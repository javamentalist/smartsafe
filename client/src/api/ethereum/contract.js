import path from 'path'
import fs from 'fs'
import winston from 'winston'
import {writeFile} from "fs";

function logError(err) {
    winston.log('debug', err);
}

export default class Contract {
    constructor(name, fileName, web3) {
        this.name = name;
        this.fileName = fileName;
        this.web3 = web3;
    }

    compileContract() {
        return new Promise((resolve, reject) => {
            this.getContractSourceCode(this.fileName).then((source) => {
                this.web3.eth.compile.solidity(source, (err, compiledContract) => {
                    if (err) return reject(err);
                    return resolve(compiledContract);
                })
            });
        })
    }

    instantiateCompiledContractAtAddress(compiledContract, contractAddressOnChain) {
        return new Promise((resolve, reject) => {
            let abi = compiledContract.FileSharing.info.abiDefinition;
            this.contract = this.web3.eth.contract(abi).at(contractAddressOnChain);
            return resolve(this.contract)
        })
    }

    /*
     New() gets called twice. The first time, contract.address does not exist, the second time it does
     */
    deployContract(compiledContract) {
        return new Promise((resolve, reject) => {
            let compiledByteCode = compiledContract.FileSharing.code;
            let abi = compiledContract.FileSharing.info.abiDefinition;
            this.web3.eth.contract(abi).new({
                data: compiledByteCode,
                gas: 13421772}, (err, contractOnChain) => {
                if (err) return reject(err);
                if (contractOnChain.address) {
                    writeFile('contracts.json',
                        JSON.stringify({contractAddress: contractOnChain.address}),
                        (err) => {
                        if (err) reject(err)
                    });
                    return resolve(contractOnChain.address)
                }
            })
        })
    }

    getContractSourceCode(contractName) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, `contracts/${contractName}.sol`);
            fs.readFile(filePath, 'utf8', (err, sourceCode) => {
                if (err) reject(err);
                return resolve(sourceCode)
            })
        })
    }
}

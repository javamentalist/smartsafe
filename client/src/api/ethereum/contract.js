import path from 'path'
import fs from 'fs'
import winston from 'winston'

function logError(err) {
    winston.log('debug', err);
}

export default class Contract {
    constructor(name, fileName, web3) {
        this.name = name;
        this.fileName = fileName;
        this.web3 = web3;
        this.contract = null;
        this.abi = null;

    }

    getContract(contractAddress) {
        return new Promise((resolve, reject) => {
            if(this.contract == null) {
                return this.deployContract().then(contract => {
                    return resolve(contract)
                })
            }
            this.instantiateContractAtAddress(contractAddress).then(contract => {
                    return resolve(contract)
            }).catch(err => {
                logError(err);
            })
        })
    }

    instantiateContractAtAddress(contractAddress) {
        return new Promise((resolve, reject) => {
            if(this.abi != null) {
                this.contract = this.web3.eth.contract(this.abi).at(contractAddress);
                return resolve(this.contract)
            }
            reject("ABI is not set")
        })
    }

    /*
     New() gets called twice. The first time, contract.address does not exist, the second time it does
     */
    deployContract() {
        return new Promise((resolve, reject) => {
            return this.getContractSourceCode(this.fileName).then((source) => {
                 return this.web3.eth.compile.solidity(source, (err, compiledContract) => {
                    if (err) return reject(err);

                    const compiledByteCode = compiledContract.FileSharing.code;
                    this.abi = compiledContract.FileSharing.info.abiDefinition;

                    this.web3.eth.contract(this.abi).new({
                        data: compiledByteCode,
                        gas: 13421772}, (err, contract) => {

                        if (err) return reject(err);

                        if (contract.address) {
                            this.contract = contract;
                            return resolve(this.contract)
                        }
                    })
                })

            })
        });
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

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
            }).catch(err => {
                logError(err);
            })
        })
    }

    instantiateCompiledContractAtAddress(compiledContract, contractAddressOnChain) {
        return new Promise((resolve, reject) => {
            const abi = compiledContract.FileSharing.info.abiDefinition;
            resolve(this.web3.eth.contract(abi).at(contractAddressOnChain));
        })
    }

    /*
     New() gets called twice. The first time, contract.address does not exist, the second time it should
     */
    deployContract(compiledContract) {
        return new Promise((resolve, reject) => {
            const compiledByteCode = compiledContract.FileSharing.code;
            const abi = compiledContract.FileSharing.info.abiDefinition;
            winston.debug('DeployContract - deploying contract');
            this.web3.eth.getAccounts((error, accounts) => {
                if (error) {
                    logError(error);
                    reject(error);
                }
                const defaultAccount = accounts[0];
                winston.debug('DeployContract - default account', defaultAccount);

                this.web3.eth.contract(abi).new({
                    data: compiledByteCode,
                    gas: 13421772,
                    from: defaultAccount}, (err, contractOnChain) => {

                        if (err){ winston.error('DeployContract - could not create new contract'); return reject(err);}

                        winston.debug('DeployContract - creating new contract');

                        if (contractOnChain.address) {
                            writeFile('contracts.json',
                                JSON.stringify({contractAddress: contractOnChain.address}),
                                (err) => {
                                if (err) {
                                    logError(err);
                                    reject(err);
                                }
                            });
                            winston.debug('DeployContract - contract written');
                            return resolve(contractOnChain.address);
                        }else{
                             winston.log('DeployContract - hash of the transaction', contractOnChain.transactionHash); // The hash of the transaction, which deploys the contract
                        }
                })
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

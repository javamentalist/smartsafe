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
        this.web3 = web3
    }

    load(address) {
        this.loadPromise = new Promise((resolve, reject) => {
            this.getSource(this.fileName).then((source) => {
                this.web3.eth.compile.solidity(source, (err, compiled) => {
                    if (err) return reject(err);

                    const code = compiled.code;
                    const abi = compiled.info.abiDefinition;

                    if (address) {
                        this.contract = this.web3.eth.contract(abi).at(address);
                        return resolve(this.contract)
                    } else {
                        // this.web3.eth.contract(abi).new({data: code}, (err, contract) => {
                        //     if (err) return reject(err);
                        //
                        //     if (contract.address) {
                        //         this.contract = contract;
                        //         return resolve(this.contract)
                        //     }
                        // })
                    }
                })
            })
        });

        return this.loadPromise
    }

    getContract(address) {
        return new Promise((resolve, reject) => {
            if (this.loadPromise) resolve(this.loadPromise);

            this.load(address)
                .then(result => {return resolve(result)})
        })
    }

    getSource(contractName) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, `contracts/${contractName}.sol`);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) reject(err);
                return resolve(data)
            })
        })
    }
}

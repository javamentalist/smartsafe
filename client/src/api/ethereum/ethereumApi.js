import Web3 from 'web3'
import Contract from './contract.js'
import _ from 'lodash'
import winston from 'winston'
import net from 'net'
import BigNumber from 'bignumber.js'

function logDebug(err) {
    winston.log('debug', err)
}
function logError(err) {
    winston.log('error', err);
}

export default class EthereumClient {

    constructor(ipcProvider) {
        this.contractAddress = null;
        this.compiledContract = null;
        const web3 = this.web3 = new Web3();

        const socket = new net.Socket();
        web3.setProvider(new web3.providers.IpcProvider(ipcProvider, socket));

        try {
            web3.eth.getCoinbase(function (error, coinbase) {
                if (error) {
                    logError(error);
                } else {
                    web3.eth.defaultAccount = coinbase;
                }
            });
        } catch (e) {
            logError('Failed to connect to ethereum network');
            logError(e)
        }
        this.contract = new Contract('FileSharing', 'FileSharing', web3)
    }

    deployParsedContract(parsedContracts) {
        return new Promise((resolve, reject) => {
            this.contract.compileContract().then(compiledContract => {

                this.compiledContract = compiledContract;

                if (parsedContracts.contractAddress == null) {
                    logDebug('parsed contract is null');
                    return this.contract.deployContract(compiledContract);
                }

                logDebug('contract address',parsedContracts.contractAddress);
                return parsedContracts.contractAddress;

            }).then(contractAddressOnChain => {
                this.contractAddress = contractAddressOnChain;
                logDebug('resolving promise now');
                resolve()
            }).catch(err => {
                logError(err);
                reject(err);
            })
        })
    }

    getFileContract() {
        return new Promise((resolve, reject) => {
            return resolve(this.contract
                .instantiateCompiledContractAtAddress(this.compiledContract, this.contractAddress))

        }).catch(err => {
            logError(err);
        })
    }

    addFileMetaData(hash, link, name) {
        return new Promise((resolve, reject) => {
            this.getFileContract().then(contract => {
                logDebug("hln" + hash + link + name)
                this.web3.eth.getAccounts((error, accounts) => {
                    if (error) {
                        logError(error);
                        reject(error);
                    }
                    const defaultAccount = accounts[0];
                    contract.saveFile.sendTransaction(hash, link, name, {
                        from: defaultAccount,
                        gas: 13421772
                    }, (error) => {
                        if (error) return reject(error);
                        return resolve()
                    });
                })
            })
        })
    }

    loadContracts() {
        return new Promise((resolve, reject) => {
            this.getFileContract().then((contract) => {
                return resolve(contract.address)
            })
        })
    }

    watchFileChanges(callback) {
        this.getFileContract().then((contract) => {
            contract.NewFile().watch((error, result) => {
                if (error) {
                    logError('Error', error);
                    return
                }
                logError("WATCHING!")
                const url = result.args.link;
                const hash = result.args.hash;
                return callback({url, hash})
            })
        }).catch(err => {
            logError(err);
        })
    }

    addAPeer(hash, link) {
        return new Promise((resolve, reject) => {
            logDebug('adPeer');
            this.getFileContract().then((contract) => {
                contract.addPeer.sendTransaction(hash, link, (error) => {
                    if (error) return reject(error);
                    return resolve()
                })
            }).catch(err => {
                logError(err);
            })
        })
    }

    getPeer(hash) {
        return new Promise((resolve, reject) => {
            logDebug('gtPeer');
            this.getFileContract().then((contract) => {
                return resolve(contract.getPeers.call((hash)[1]), (error, result) => {
                    if (error) return reject(error);
                    return resolve(result)
                });
            }).catch(err => {
                logError(err);
            })
        })
    }

    getUserFilesHashes() {
        return new Promise((resolve, reject) => {
            this.getFileContract()
                .then((contract) => {
                    contract.getUserFileCount.call((error, result) => {
                        const fileCount = new BigNumber(result).toString(10);

                        if (error) return reject(error);
                        if (fileCount === 0) return resolve([]);

                        let hashes = [];
                        for (let userFileNo = 0; userFileNo < fileCount; userFileNo++) {
                            hashes[userFileNo] = this.getUserFileNoFromContract(contract, userFileNo);
                        }
                        resolve(Promise.all(hashes))
                    });
                }).catch(err => {
                    logError(err);
                    reject(err);
                })
            })
    }

    getUserFileNoFromContract(contract, userFileNo) {
        return new Promise((resolve, reject) => {
            contract.getUserFile.call(userFileNo, (error, result) => {
                if (error) return reject(error);
                return resolve(result)
            });
        })
    }

    findFileMetaDataFromEthChain(fileHash) {
        return new Promise((resolve, reject) => {
            this.getFileContract().then((contract) => {
                contract.getFileByHash.call((fileHash), (error, result) => {
                    if (error) return reject(error);
                    return resolve({link: result[0], name: result[1]})

                });
            }).catch(err => {
                logError(err);
            })
        })

    }
}

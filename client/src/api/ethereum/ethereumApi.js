import Web3 from 'web3'
import Contract from './contract.js'
import _ from 'lodash'

export default class EthereumClient {
  constructor (contractAddresses) {
    const web3 = this.web3 = new Web3()
    this.contractAddresses = contractAddresses
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

    try {
      web3.eth.defaultAccount = web3.eth.coinbase
    } catch(e) {
      console.log('Failed to connect to ethereum network')
    }
    this.file = new Contract('FileSharing', 'FileSharing', web3)
  }

  getFileContract () {
    if (this.contractAddresses) {
      return this.file.getContract(this.contractAddresses.file)
    } else {
      return this.file.getContract()
    }
  }

  addFile (hash, link, name) {
    this.getFileContract().then((contract) => {
      contract.saveFile(hash, link, name, (error) => {
        return contract.getLink.call(hash)
      })
    }).catch((e) => {
      console.log(e)
    })
  }

  loadContracts () {
    return new Promise((resolve, reject) => {
      this.getFileContract().then((contract) => {
        resolve(contract.address)
      }).catch(reject)
    })
  }

  watchFileChanges (callback) {
    const web3 = this.web3
    const filter = web3.eth.filter('latest')

    this.getFileContract().then((contract) => {
      contract.allEvents().watch((error, result) => {
        if (error) {
          console.log('Error', error)
          return
        }

        const url = result.args._link
        const hash = result.args._hash
        callback({ url, hash })
      })
    })
  }

  addPeer (hash, link) {
    console.log('addPeer')
    return new Promise((resolve, reject) => {
      this.getFileContract().then((contract) => {
        contract.addPeer(hash, link, (error) => {
          if (error) reject(error)
          resolve()
        })
      }).catch((e) => {
        console.log(e)
      })
    })
  }

  getPeer (hash) {
    console.log('getPeer')
    return new Promise((resolve, reject) => {
      this.getFileContract().then((contract) => {
         resolve(contract.getPeers.call(hash)[1])
      })
    })
  }

  getUserFiles () {
    return new Promise((resolve, reject) => {
      this.getFileContract().then((contract) => {
        const fileCount = +contract.getUserFileCount.call()
        if (!fileCount) return resolve([])
        const hashes = _.times(fileCount, i => {
          const result = contract.getUserFile.call(i)
          return result;
        }).map(result => {
          return result
        })
        resolve(hashes)
      })
    })
  }

  findFileDropboxDataFromEthChain (hash) {
    return new Promise((resolve, reject) => {
      this.getFileContract().then((contract) => {
        console.log(hash)
        const result = contract.getFileByHash.call(hash)
        console.log(result)
        resolve({ link: result[0], name: result[1] })
      })
    })

  }
}

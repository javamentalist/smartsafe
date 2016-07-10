import Web3 from 'web3'
import Contract from './contract.js'

export default class EthereumClient {
  constructor (contractAddresses) {
    const web3 = this.web3 = new Web3()
    this.contractAddresses = contractAddresses
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

    try {
      web3.eth.defaultAccount = web3.eth.coinbase
    } catch(e) {
      console.log('Failed to connect to etherium network')
    }
    this.file = new Contract('FileSharing', 'file', web3)
  }

  getFileContract () {
    console.log('getFileContract')
    console.log(this.contractAddresses)
    if (this.contractAddresses) {
      return this.file.getContract(this.contractAddresses.file)
    } else {
      return this.file.getContract()
    }
  }

  addFile (hash, link) {
    this.getFileContract().then((contract) => {
      contract.saveFile(hash, link, (error) => {
        //console.log(contract.getLink.call(hash))
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

  watchFileChanges () {
    const web3 = this.web3
    const filter = web3.eth.filter('latest')

    filter.watch((error, result) => {
      this.getFileContract().then((contract) => {
        console.log('watch: ', contract.getFile.call())
      })
    })
  }
}

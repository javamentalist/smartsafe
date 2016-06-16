import Web3 from 'web3'
import Contract from './contract.js'

export default class EthereumClient {
  constructor () {
    const web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
    try {
      web3.eth.defaultAccount = web3.eth.coinbase
    } catch(e) {
      console.log('Failed to connect to etherium network')
    }
    this.web3 = web3
    this.file = new Contract('FileSharing', 'file', web3)
  }

  addFile (hash, link) {
    this.file.getContract().then((contract) => {
      contract.saveFile(hash, link, (error) => {
        console.log(contract.getLink.call(hash))
      })
    }).catch((e) => {
      console.log(e)
    })
  }
}

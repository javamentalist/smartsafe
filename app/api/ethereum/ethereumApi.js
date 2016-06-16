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

    const File = new Contract('FileSharing', 'file', web3)
    const batch = web3.createBatch()
    File.load().then(() => {
      File.contract.saveFile('www.dropbox.com', (error) => {
        console.log(File.contract.getLink.call(0))
      })
    }).catch((e) => {
      console.log('hi')
      console.log(e)
    })
  }
}

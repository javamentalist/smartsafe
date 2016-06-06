import Web3 from 'web3'
import Contract from './contract.js'

export default class EthereumClient {
  constructor () {
    const web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaultAccount = web3.eth.coinbase;
    this.web3 = web3

    const File = new Contract('FileSharing', 'file', web3)
    File.load().then(() => {
      File.contract.saveFile('6d12a41e72e644f017b6f0e2f7b44c6285f06dd5d2c5b075', 'www.dropbox.com')
    }).catch((e) => {
      console.log('hi')
      console.log(e)
    })
  }
}

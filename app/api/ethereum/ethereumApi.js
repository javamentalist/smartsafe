import Web3 from 'web3'
import Contract from './contract.js'

export default class EthereumClient {
  constructor () {
    const web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaultAccount = web3.eth.coinbase;
    this.web3 = web3

    const test = new Contract('test', web3)
    test.load().then(() => {
      console.log(test.contract)
      console.log(+test.contract.multiply(3))
    }).catch((e) => {
      console.log(e) 
    })
  }
}

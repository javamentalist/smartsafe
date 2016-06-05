import path from 'path'
import fs from 'fs'

export default class Contract {
  constructor (name, web3) {
    this.name = name
    this.web3 = web3
  }

  load () {
    return new Promise((resolve, reject) => {
      const source = this.getSource(this.name)
      const compiled = this.web3.eth.compile.solidity(source);
      const code = compiled.test.code;
      const abi = compiled.test.info.abiDefinition;
      this.web3.eth.contract(abi).new({data: code}, (err, contract) => {
        if (err) return reject(err)
        
        if (contract.address) {
          this.contract = contract;
          resolve()
        }
      })
    })
  }
  
  getSource (contractName) {
    const filePath = path.join(__dirname, `contracts/${contractName}.sol`)
    return fs.readFileSync(filePath, 'utf8')
  }
}

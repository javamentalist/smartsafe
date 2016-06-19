import path from 'path'
import fs from 'fs'

export default class Contract {
  constructor (name, fileName, web3) {
    this.name = name
    this.fileName = fileName
    this.web3 = web3
  }

  load () {
    this.loadPromise = new Promise((resolve, reject) => {
      const source = this.getSource(this.fileName)
      const compiled = this.web3.eth.compile.solidity(source);
      const code = compiled[this.name].code;
      const abi = compiled[this.name].info.abiDefinition;
      this.web3.eth.contract(abi).new({data: code}, (err, contract) => {
        if (err) return reject(err)

        if (contract.address) {
          this.contract = contract;
          resolve(this.contract)
        }
      })
    })

    return this.loadPromise
  }

  getContract () {
    if (this.loadPromise) return this.loadPromise

    return new Promise((resolve, reject) => {
      this.load().then(resolve).catch(reject)
    })
  }

  getSource (contractName) {
    const filePath = path.join(__dirname, `contracts/${contractName}.sol`)
    return fs.readFileSync(filePath, 'utf8')
  }
}

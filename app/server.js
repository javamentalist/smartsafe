import Promise from 'bluebird'
import EthereumClient from './api/ethereum/ethereumApi.js'
import { writeFile } from 'fs'

const ethereumClient = new EthereumClient()

ethereumClient.loadContracts().then((address) => {
  writeFile('contracts.json', JSON.stringify({ file: address }), (err) => {
    if (err) console.log(err)
  })
  console.log(address)
  console.log('contracts loaded')
}).catch((e) => {
  console.log(e)
})
ethereumClient.watchFileChanges()

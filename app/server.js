import Promise from 'bluebird'
import EthereumClient from './api/ethereum/ethereumApi.js'
import https from 'https'
import fs from 'fs'
import { writeFile } from 'fs'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const TEMP_DIR = `${HOME_DIR}/Lockbox/temp/`
const ethereumClient = new EthereumClient()

ethereumClient.loadContracts().then((address) => {
  writeFile('contracts.json', JSON.stringify({ file: address }), (err) => {
    if (err) console.log(err)
  })
  console.log('contracts loaded')
}).catch((e) => {
  console.log(e)
})

const onNewFile = (url) => {
  // Replace dl=0 with dl=1 to get direct downloadable link
  url = url.replace(/^https:\/\/www.dropbox.com/, 'https://dl.dropboxusercontent.com')
  url = url.replace(/0$/, '1')

  const filePathRegex = /^https:\/\/dl.dropboxusercontent.com\/s\/[\w\d]+\/(.*)\?dl=1$/
  const filePath = filePathRegex.exec(url)[1]
  const file = fs.createWriteStream(TEMP_DIR + filePath)
  https.get(url, (res) => {
    res.pipe(file)
  }).on('error', (err) => console.log(err))
}

ethereumClient.watchFileChanges(onNewFile)

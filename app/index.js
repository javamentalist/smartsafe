import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import authData from '../dropbox-auth.json'
import fs from 'fs'
import { readDir, createHash } from './utils/fileUtils.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import crypto from 'crypto'
import contractAddresses from '../contracts.json'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const FILE_DIR = `${HOME_DIR}/Lockbox`
const IGNORED_FILES = ['.DS_Store', 'temp']

const dropboxClient = new DropboxClient(authData.key, authData.secret)
const ethereumClient = new EthereumClient(contractAddresses)

dropboxClient.authenticate().then(() => {
  return readDir(FILE_DIR)
}).then((files) => {
  const userFiles = files.filter((file) => {
    return IGNORED_FILES.indexOf(file) === -1
  })

  ethereumClient.getUserFiles().then(hashes => {
    userFiles.forEach(filePath => {
      const readStream = fs.createReadStream(`${FILE_DIR}/${filePath}`)
      createHash(readStream).then(hash => {
        if (hashes.indexOf(hash) === -1) {
          dropboxClient.upload(`${FILE_DIR}/${filePath}`, `/${filePath}`).then(data => {
            ethereumClient.addFile(hash, data.url)
          })
        }
      })
    })
  }).catch(e => console.log(e))
})

import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import authData from '../dropbox-auth.json'
import fs from 'fs'
import _ from 'lodash'
import https from 'https'
import { readDir, createHash } from './utils/fileUtils.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import crypto from 'crypto'
import contractAddresses from '../contracts.json'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const FILE_DIR = `${HOME_DIR}/SmartsafeClient`
const IGNORED_FILES = ['.DS_Store', 'temp']

const dropboxClient = new DropboxClient(authData.key, authData.secret)
const ethereumClient = new EthereumClient(contractAddresses)

const syncFiles = (hashes, userFiles) => {
  const hashPromises = userFiles.map(filePath => {
      fs.createReadStream(`${FILE_DIR}/${filePath}`)
      .then(readStream => {
        createHash(readStream)
        .then(hash => filePath, hash)
      })
      .catch(e => console.log(e))
  })

  Promise.all(hashPromises)
  .then(results => {
    results.forEach(fileData => {
      const { hash, filePath } = fileData
      if (hashes.indexOf(hash) === -1) {
        dropboxClient.upload(`${FILE_DIR}/${filePath}`, `/${filePath}`)
        .then(data => {
          ethereumClient.addFile(hash, data.url, filePath)
        })
      }
    })

    hashes.forEach(hash => {
      if (!_.find(results, { hash })) {
        ethereumClient.getFile(hash)
        .then(file => {
          const dlUrl = dropboxClient.getDirectDownloadLink(file.link)
          const filePath = dropboxClient.getFilePathFromUrl(dlUrl)
          const fileStream = fs.createWriteStream(`${FILE_DIR}/${filePath}`)
          https.get(dlUrl, res => {
            res.pipe(fileStream)
          })
        })
      }
    })
  })
}

dropboxClient.authenticate()
.then(() => {
  return readDir(FILE_DIR)})
  .then((files) => {
  const userFiles = files.filter((file) => {
    return IGNORED_FILES.indexOf(file) === -1
  })

  ethereumClient.getUserFiles()
    .then(hashes => syncFiles(hashes, userFiles))
    .catch(e => console.log(e))
})

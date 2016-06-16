import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import authData from '../dropbox-auth.json'
import { readDir } from './utils/fileUtils.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import crypto from 'crypto'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const FILE_DIR = `${HOME_DIR}/Lockbox`
const IGNORED_FILES = ['.DS_Store']

const dropboxClient = new DropboxClient(authData.key, authData.secret)
const ethereumClient = new EthereumClient()

const saveFileToEthereum = (data) => {
  const hash = crypto.createHash('sha256').update(data.url).digest("hex")
  ethereumClient.addFile(hash, data.url)
}

dropboxClient.authenticate().then(() => {
  return readDir(FILE_DIR)
}).then((files) => {
  const promises = files.filter((file) => {
    return IGNORED_FILES.indexOf(file) === -1
  }).map((file) => {
    return dropboxClient.upload(`${FILE_DIR}/${file}`, `/${file}`)
  })

  Promise.all(promises).then((results) => {
    results.forEach(saveFileToEthereum)
    console.log(results)
    console.log('Upload complete!')
  })
})

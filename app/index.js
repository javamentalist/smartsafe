import DropboxClient from './api/dropboxApi.js'
import { readDir } from './utils/fileUtils.js'
import authData from '../dropbox-auth.json'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const FILE_DIR = `${HOME_DIR}/Lockbox`

const dropboxClient = new DropboxClient(authData.key, authData.secret)

dropboxClient.authenticate().then(() => {
  return readDir(FILE_DIR) 
}).then((files) => {
  console.log(files)
})

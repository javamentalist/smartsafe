import { authenticate } from './api/dropboxApi.js'
import { readDir } from './utils/fileUtils.js'
import authData from '../dropbox-auth.json'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const FILE_DIR = `${HOME_DIR}/Lockbox`

authenticate(authData.key, authData.secret).then(() => {
  return readDir(FILE_DIR) 
}).then((files) => {
  console.log(files)
})

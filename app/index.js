import DropboxClient from './api/dropboxApi.js'
import { readDir } from './utils/fileUtils.js'
import authData from '../dropbox-auth.json'
import Promise from 'bluebird'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const FILE_DIR = `${HOME_DIR}/Lockbox`
const IGNORED_FILES = ['.DS_Store']

const dropboxClient = new DropboxClient(authData.key, authData.secret)

dropboxClient.authenticate().then(() => {
  return readDir(FILE_DIR)
}).then((files) => {
  const promises = files.filter((file) => {
    return IGNORED_FILES.indexOf(file) === -1
  }).map((file) => {
    return dropboxClient.upload(`${FILE_DIR}/${file}`, `/${file}`)
  })

  Promise.all(promises).then(() => {
    console.log('Upload complete!')
  })
})

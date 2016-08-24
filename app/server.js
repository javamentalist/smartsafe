import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import https from 'https'
import fs from 'fs'
import crypto from 'crypto'
import { writeFile } from 'fs'
import authData from '../dropbox-auth.json'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE
const TEMP_DIR = `${HOME_DIR}/LockboxServer`
const ethereumClient = new EthereumClient()
const dropboxClient = new DropboxClient(authData.key, authData.secret)

ethereumClient.loadContracts().then((address) => {
  writeFile('contracts.json', JSON.stringify({ file: address }), (err) => {
    if (err) console.log(err)
  })
  console.log('contracts loaded')
}).catch((e) => {
  console.log(e)
})

dropboxClient.authenticate().then(() => {
  ethereumClient.watchFileChanges(onNewFile)
})

const onNewFile = ({ url, hash }) => {
  // Replace dl=0 with dl=1 to get direct downloadable link
  const dlUrl = dropboxClient.getDirectDownloadLink(url)
  const filePath = dropboxClient.getFilePathFromUrl(dlUrl)
  const file = fs.createWriteStream(`${TEMP_DIR}/${filePath}`)
  https.get(dlUrl, (res) => {
    res.pipe(file)
    file.on('finish', () => {
      if (filePath) {
        dropboxClient.upload(`${TEMP_DIR}/${filePath}`, `/${filePath}`).then((data) => {
          ethereumClient.addPeer(hash, data.url).then(() => {
            ethereumClient.getPeer(hash).then((peerUrl) => {
              console.log('peerUrl', peerUrl)
            })
          }).catch((e) => {
            console.log(e)
          })
        })
      }
    })
  }).on('error', (err) => console.log(err))
}


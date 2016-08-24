import Promise from 'bluebird'
import request from 'request'
import { doAuthentication } from './dropboxAuth.js'
import fetch from 'node-fetch'
import fs from 'fs'
import { post } from './apiUtils.js'

export default class DropboxClient {
  constructor (key, secret) {
    this.key = key
    this.secret = secret
  }

  getDefaultHeaders () {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    }
  }

  authenticate () {
    return new Promise((resolve, reject) => {
      doAuthentication(this.key, this.secret).then((token) => {
        this.token = token
        resolve()
      }).catch(reject)
    })
  }

  listFolder (folder = '') {
    const URL = 'https://api.dropboxapi.com/2/files/list_folder'

    return fetch(URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: folder,
        recursive: false
      })
    }).then((res) => {
      return res.json()
    })
  }

  upload (localPath, dropboxPath) {
    const url = 'https://content.dropboxapi.com/2/files/upload'
    const options = { path: dropboxPath }
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify(options)
    }
    const stream = fs.createReadStream(localPath)

    return post(url, headers, stream).then((json) => {
      return this.createSharedLink(json.path_display)
    })
  }

  createSharedLink (path) {
    const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link'
    const body = { path }

    return post(url, this.getDefaultHeaders(), body)
  }

  getDirectDownloadLink (url) {
    // Replace dl=0 with dl=1 to get direct downloadable link
    return url
      .replace(/^https:\/\/www.dropbox.com/, 'https://dl.dropboxusercontent.com')
      .replace(/0$/, '1')
  }

  getFilePathFromUrl (url) {
    const filePathRegex = /^https:\/\/dl.dropboxusercontent.com\/s\/[\w\d]+\/(.*)\?dl=1$/
    return filePathRegex.exec(url)[1]
  }
}

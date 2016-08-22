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

  upload (localFile, dropboxPath) {
    const url = 'https://content.dropboxapi.com/2/files/upload'

    console.log(localFile, dropboxPath)
    const options = { path: dropboxPath }
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify(options)
    }
    const body = fs.createReadStream(localFile)

    return post(url, headers, body)
      .then((json) => {
        return this.createSharedLink(json.path_display)
      })
  }

  createSharedLink (path) {
    const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link'
    const body = { path }

    return post(url, this.getDefaultHeaders(), body)
  }
}

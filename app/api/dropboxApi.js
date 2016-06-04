import Promise from 'bluebird'
import request from 'request'
import { doAuthentication } from './dropboxAuth.js'
import fetch from 'node-fetch'

export default class DropboxClient {
  constructor (key, secret) {
    this.key = key
    this.secret = secret
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
}

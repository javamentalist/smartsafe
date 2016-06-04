import Promise from 'bluebird'
import request from 'request'
import { doAuthentication } from './dropboxAuth.js'

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
}

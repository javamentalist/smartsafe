import Promise from 'bluebird'
import { spawn } from 'child_process'
import _ from 'lodash'
import http from 'http'
import request from 'request'

const SERVER_PORT = 8912
const REDIRECT_URL = 'http://localhost:8912/oauth_callback'
const TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token'
let TOKEN

const setToken = (token) => {
  TOKEN = token
}

const getAuthenicationUrl = (id) => {
  const baseUrl = 'https://www.dropbox.com/oauth2/authorize?'
  const urlOptions = {
    client_id: id,
    response_type: 'code',
    redirect_uri: encodeURIComponent(REDIRECT_URL)
  }

  const optionsString = _.chain(urlOptions)
    .map((value, key) => `${key}=${value}`)
    .join('&')
    .value()

  return baseUrl + optionsString
}

const listenForOAuthCallback = (id, secret) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.url.startsWith('/oauth_callback')) {
        const [, paramsStr] = req.url.split('?')
        // code=asd&bunnies=1 => ['code', 'asd', 'bunnies', '1']
        const params = paramsStr.split(/=|&/)
        // ['code', 'asd', 'bunnies', '1'] => [['code', 'asd'], ['bunnies', '1']] =>
        // { code: 'asd', bunnies: '1' } => 'asd'
        const code = _.chain(params).chunk(2).fromPairs().value()['code']
        res.end('Success! Please close this window')
        server.close()
        getToken(id, code, secret).then(resolve).catch(reject)
      }
    })
    server.listen(SERVER_PORT)
  })
}

const getToken = (id, code, secret) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: TOKEN_URL,
      method: 'POST',
      form: {
        code,
        grant_type: 'authorization_code',
        client_id: id,
        client_secret: secret,
        redirect_uri: REDIRECT_URL
      }
    }

    request(options, (err, response, body) => {
      if (err) return reject(err)
      resolve(JSON.parse(body).access_token)
    })
  })
}

export const doAuthentication = (id, secret) => {
  return new Promise((resolve, reject) => {
    listenForOAuthCallback(id, secret).then((token) => {
      setToken(token)
      resolve()
    }).catch(reject)

    const proc = spawn('open', ['-a', 'Google Chrome', getAuthenicationUrl(id)])
  })
}


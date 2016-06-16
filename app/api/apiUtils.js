import fetch from 'node-fetch'
import chalk from 'chalk'
import { isString } from 'lodash'

const formatErrorMessage = (url, status, msg) => {
  return chalk.red('ERROR: ') + `${url} failed with status: ${status}. Message: ${msg}`
}

const checkStatus = (res) => {
  return new Promise((resolve, reject) => {
    if (res.status >= 200 && res.status < 300) {
      return resolve(res)
    }

    res.text().then((json) => {
      console.log(formatErrorMessage(res.url, res.status, json.error_summary))
      reject(json)
    })
  })
}

const toJSON = (res) => res.json()

export const post = (url, headers, body) => {
  const options = {
    method: 'POST',
    headers,
    body: isString(body) ? body : JSON.stringify(body)
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(toJSON)
}

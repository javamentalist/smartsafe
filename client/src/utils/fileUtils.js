import Promise from 'bluebird'
import crypto from 'crypto'
import fs from 'fs'

import logger from 'winston'
function logError(err) {
  logger.log(err)
}
export const readDir = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) return reject(err)
      resolve(files)
    })
  })
}

export const createHash = (readStream) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    hash.setEncoding('hex')
    readStream.pipe(hash)
    hash.on('finish', () => resolve(hash.read()))
  })
}

import crypto from 'crypto'
import fs from 'fs'

const algorithm = 'aes-256-ctr'
const password = 'd6F3Efeq'

function transformFile(inputPath, outputPath, transformation) {
  return new Promise((resolve, reject) => {
    try {
      const input = fs.createReadStream(inputPath)
      const output = fs.createWriteStream(outputPath)
      input.pipe(transformation).pipe(output)
      output.on('finish', resolve)
    } catch (e) {
      reject(e)
    }
  })
}

export function encrypt(filePath) {
  return new Promise((resolve, reject) => {
    const resultPath = `${filePath}.enc`
    const encrypt = crypto.createCipher(algorithm, password);

    return transformFile(filePath, resultPath, encrypt).then(() => {
      resolve(resultPath)
    })
  })
}

export function decrypt(filePath) {
  return new Promise((resolve, reject) => {
    const resultPath = filePath.substring(0, filePath.length - 4)
    const decrypt = crypto.createDecipher(algorithm, password);

    return transformFile(filePath, resultPath, decrypt).then(() => {
      resolve(filePath)
    })
  })
}

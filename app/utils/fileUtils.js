import Promise from 'bluebird'
import fs from 'fs'

export const readDir = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) return reject(err)
      resolve(files)
    }) 
  })
}

import Promise from 'bluebird'
import {createHash} from 'crypto'
import fs from 'fs'

export const readDir = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) return reject(err);
            return resolve(files)
        })
    })
};

export const createHashForFile = (readStream) => {
    return new Promise((resolve, reject) => {
        const hash = createHash('sha256');
        hash.setEncoding('hex');
        readStream.pipe(hash);
        hash.on('finish', () => {
            return resolve(hash.read())
        })
    })
};

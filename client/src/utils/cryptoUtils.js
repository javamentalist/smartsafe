import crypto from 'crypto'
import fs from 'fs'
import winston from 'winston'

const algorithm = 'aes-256-ctr';

function logDebug(err) {
    winston.log('debug', err)
}
function logError(err) {
    winston.log('error', err);
}

function transformFile(inputPath, outputPath, transformation) {
    return new Promise((resolve, reject) => {
        try {
            const input = fs.createReadStream(inputPath);
            const output = fs.createWriteStream(outputPath);
            input.pipe(transformation).pipe(output);
            output.on('finish', resolve)
        } catch (err) {
            logError(err);
            reject(err);
        }
    })
}

export function encrypt(filePath, password) {
    return new Promise((resolve, reject) => {
        const resultPath = `${filePath}.enc`;
        const encrypt = crypto.createCipher(algorithm, password);

        return transformFile(filePath, resultPath, encrypt).then(() => {
            return resolve(resultPath)
        }).catch(err => {
                logError(err);
                reject(err)
        });
    })
}

export function decrypt(filePath, password) {
    return new Promise((resolve, reject) => {
        const resultPath = filePath.substring(0, filePath.length - 4);
        const decrypt = crypto.createDecipher(algorithm, password);

        return transformFile(filePath, resultPath, decrypt).then(() => {
            return resolve(filePath)
        }).catch(err => {
                logError(err);
                reject(err)
        });
    })
}

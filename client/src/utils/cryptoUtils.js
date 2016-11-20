import crypto from 'crypto'
import fs from 'fs'
import passwordGenerator from 'generate-password'
import keypair from 'keypair'
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

export function generatePassword() {
    return new Promise((resolve) => {
        resolve(passwordGenerator.generate({
            length: 20,
            numbers: true
        }));
    })
}

export function generateRsaKeyPair() {
    return new Promise((resolve) => {
        resolve(keypair());
    })
}

export function encryptWithSymmetricKey(filePath, password, resultPath = `${filePath}.enc`) {
    return new Promise((resolve, reject) => {
        const encrypt = crypto.createCipher(algorithm, password);
        return transformFile(filePath, resultPath, encrypt).then(() => {
            return resolve(resultPath)
        }).catch(err => {
                logError(err);
                reject(err)
        });
    })
}

export function decryptWithSymmetricKey(filePath, password) {
    return new Promise((resolve, reject) => {
        const resultPath = filePath.substring(0, filePath.length - 4);
        const decrypt = crypto.createDecipher(algorithm, password);

        return transformFile(filePath, resultPath, decrypt).then(() => {
            return resolve(resultPath)
        }).catch(err => {
                logError(err);
                reject(err)
        });
    })
}

export function encryptWithPublicKey(toEncrypt, key) {
    //const publicKey = fs.readFileSync(pathToKey, 'utf8');
    const buffer = new Buffer(toEncrypt);
    const encrypted = crypto.publicEncrypt(key, buffer);
    return encrypted.toString("base64");
}

export function decryptWithPrivateKey(toDecrypt, key) {
    //const privateKey = fs.readFileSync(pathToKey, 'utf8');
    const buffer = new Buffer(toDecrypt, 'base64');
    const decrypted = crypto.privateDecrypt(key, buffer);
    return decrypted.toString("utf8");
}

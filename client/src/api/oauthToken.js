const fs = require('fs')
const path = require('path')

/*
 Dropbox OAuth tokens do not expire (http://stackoverflow.com/questions/23400244/dropbox-access-token-expiry)
 unless the app is unlinked or the app folder deleted.
*/

const OAUTH_FILE_PATH = 'oauth.json'

var logger = require('winston')

export function getOAuthToken(dir) {
        return new Promise((resolve, reject) => {
            let oauthFile = getOAuthFilePath(dir)
            
            fs.readFile(oauthFile, 'utf8', (err, data) => {
                if (err) reject(err);
                if (data) {
                    logger.debug('parsed access_token: %s from %s', data, OAUTH_FILE_PATH)
                    resolve(data)
                } else {
                    logger.error('Unable to parse access_token from %s', OAUTH_FILE_PATH)
                    reject()
                }
            })
    })
}

export function saveOAuthToken(dir, token) {
    return new Promise((resolve, reject) => {
        let oauthFile = getOAuthFilePath(dir)
        fs.writeFile(oauthFile, token, (err) => {
            if (err == null) {
                logger.warn('File %s was overwritten with new OAuth token', oauthFile)
            } else if (err.code == 'ENOENT') { // file does not exist
                logger.info('OAuth token written to %s', oauthFile)
            } else {
                logger.error('Unable to write token (%s) to %s', token, oauthFile)
                reject(err)
            }
        })
        resolve()
    })
}

function getOAuthFilePath(dir) {
    return path.resolve(dir, OAUTH_FILE_PATH)
} 
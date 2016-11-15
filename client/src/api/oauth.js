/*
 Dropbox OAuth tokens do not expire (http://stackoverflow.com/questions/23400244/dropbox-access-token-expiry)
 unless the app is unlinked or the app folder deleted.
*/

const fs = require('fs')

const OAUTH_FILE_PATH = 'oauth.json'

var logger = require('winston')

export function getOAuthToken(dir) {
        return new Promise((resolve, reject) => {
            let oauthFile = path.resolve(dir, OAUTH_FILE_PATH)
            
            fs.readFile(oauthFile, 'utf8', (err, data) => {
                if (err) reject(err);
                return resolve(data)
            }).then(data => {
                logger.info(logJSON.parse(data))
            })

        // doAuthentication(this.key, this.secret)
        //     .then((token) => {
        //         this.token = token;
        //         this.dbx = new Dropbox({accessToken: token});
        //         return resolve()
        //     }).catch(err => {
        //         logError(err);
        //         return reject(err)
        // });
    })
}
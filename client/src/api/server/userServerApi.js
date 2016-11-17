
// need a Config module
const config = require('../../../config.json')
var rp = require('request-promise')
var logger = require('winston')

const remoteAddr = config.server_address
const signupPath = `https://${remoteAddr}/signup`

// http://stackoverflow.com/a/31058131
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export default class WebService {
    // for testing, returns 500 (already exists)
    // constructor() {
    //     this.signup('89b44e4d3c81ede05d0f5de8d1a68f754d73d997', 'UoecxLpRiz4AAAAAAAAJmZX0duJsz_OyPfLr20WAZ7K_KUOFMDETaafM_J7Nx4fq', 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAe1mCeQtA59PeIYPgsf25mmUcccF3byXBv6cW+b2mi3thvmYkTIYqjyrJmuPbTy+TIPByXU7tT0N7tORmN6OnzCCXXk2UgX8J6Kf7TwSNhLKPMuOlTYZdc2AkTRywoAuFjM2eBczfjMuBZu80vaVPUyD+adTQoY8MoJihwHUjqwIDAQAB')
    // }

    signup(ethAddress, dboxToken, pubKey) {
        const signupOptions = {
            method: 'POST',
            uri: signupPath,
            body: {
                "ethAddress": ethAddress,
                "dboxToken": dboxToken,
                "pubKey": pubKey
            },
            json: true // Automatically stringifies the body to JSON
        };
        logger.debug(JSON.stringify(signupOptions))
        return rp(signupOptions).then(response => {
            logger.debug(response)
            return Promise.resolve(response)
        }).catch(err => {
            logger.error('Failed to POST to %s, cause: %s', signupPath, err)
            return Promise.reject(err)
        })
    }

}

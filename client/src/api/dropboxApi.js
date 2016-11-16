import Promise from 'bluebird'
import {doAuthentication} from './dropboxAuth.js'
import {getOAuthToken, saveOAuthToken} from './oauthToken.js'
import fs from 'fs'
import {post} from './apiUtils.js'
import winston from 'winston'
import Dropbox from 'dropbox'

var logger = require('winston')

export default class DropboxClient {
    constructor(key, secret) {
        this.key = key;
        this.secret = secret;
    }

    getDefaultHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        }
    }

    _init(token) {
        this.token = token;
        this.dbx = new Dropbox({accessToken: token});
    }

    authenticate() {
        return new Promise((resolve, reject) => {
            getOAuthToken('.').then((token) => {
                this._init(token);
                resolve()
            }).catch(err => {
                doAuthentication(this.key, this.secret)
                    .then((token) => {
                        this._init(token);
                        saveOAuthToken('.', token)
                        resolve()
                    }).catch(err => {
                        logger.error('Failed to authenticate! %s,', err);
                        return reject(err)
                    });
            })
        })
    }

    listFolder(folderPath = '') {
        return new Promise((resolve, reject) => {
            this.dbx.filesListFolder({path: folderPath, recursive: true})
                .then(response => {
                    resolve(response.entries);
                })
        });
    }

    upload(localPath, dropboxPath) {
        const url = 'https://content.dropboxapi.com/2/files/upload';
        const options = {path: dropboxPath};
        const headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify(options)
        };
        const stream = fs.createReadStream(localPath);

        return post(url, headers, stream).then((response_json) => {
            return this.createSharedLink(response_json.path_display)
        })
    }

    delete(filePath) {
        return new Promise((resolve, reject) => {
            return this.dbx.filesDelete({path: filePath})}).then(response_json => {
                return resolve(response_json)
            }).catch(err => {
                logger.error('Failed to delete file %s! Cause: %s', filePath, err)
                return reject(err)
            })
    }

    createSharedLink(path) {
        const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link';
        const body = {path};

        return post(url, this.getDefaultHeaders(), body)
    }

    static getDirectDownloadLink(url) {
        // Replace dl=0 with dl=1 to get direct downloadable link
        return url
            .replace(/^https:\/\/www\.dropbox\.com/, 'https://dl.dropboxusercontent.com')
            .replace(/0$/, '1')
    }

    static getFileNameFromUrl(url) {
        const filePathRegex = /^https:\/\/dl\.dropboxusercontent\.com\/s\/[\w\d]+\/(.*)\?dl=1$/;
        return filePathRegex.exec(url)[1]
    }
}

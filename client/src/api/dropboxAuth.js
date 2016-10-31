import Promise from 'bluebird'
import {spawn} from 'child_process'
import open from 'open'
import _ from 'lodash'
import http from 'http'
import request from 'request'
import winston from 'winston'
const SERVER_PORT = 8912;
const REDIRECT_URL = `http://localhost:${SERVER_PORT}/oauth_callback`;
const TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';
const isServer = process.argv.some(arg => arg === 'SERVER=true');

function logError(err) {
    winston.log('debug', err);
}

function logErrorF(err, format) {
    winston.log('debug', err, format)
}

const getAuthenticationUrl = (id) => {
    const baseUrl = 'https://www.dropbox.com/oauth2/authorize?';
    const urlOptions = {
        client_id: id,
        response_type: 'code',
        redirect_uri: encodeURIComponent(REDIRECT_URL)
    };

    const optionsString = _.chain(urlOptions)
        .map((value, key) => `${key}=${value}`)
        .join('&')
        .value();

    return baseUrl + optionsString
};

const listenForOAuthCallback = (id, secret) => {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            if (req.url.startsWith('/oauth_callback')) {
                const code = parseCodeFromUrlParams(req.url, 'code');
                logErrorF('oauth_callback code: %s', code);
                if (code) {
                    res.end('Success! Please close this window.')
                } else {
                    const error = parseCodeFromUrlParams(req.url, 'error');
                    const errDescription = parseCodeFromUrlParams(req.url, 'error_description').replace(/\+/g, ' ');
                    logErrorF('Unable to parse OAuth code from %s', req.url);
                    res.end(`Error! Failed to get OAuth code!\nCause: (${error}) - ${errDescription}`)
                }
                server.close();
                getToken(id, code, secret).then(resolve).catch(reject)
            }
        });
        logErrorF("Listening for OAuth token on port: %s", SERVER_PORT);
        server.listen(SERVER_PORT)
    })
};

const parseCodeFromUrlParams = (url, paramName) => {
    const [, paramsStr] = url.split('?');
    const params = paramsStr.split(/=|&/);
    return _.chain(params).chunk(2).fromPairs().value()[paramName]
};

const getToken = (id, code, secret) => {
    return new Promise((resolve, reject) => {
        const options = {
            url: TOKEN_URL,
            method: 'POST',
            form: {
                code,
                grant_type: 'authorization_code',
                client_id: id,
                client_secret: secret,
                redirect_uri: REDIRECT_URL
            }
        };

        request(options, (err, response, body) => {
            if (err) {
                logError(err);
                return reject(err)
            }
            resolve(JSON.parse(body).access_token)
        })
    })
};

export const doAuthentication = (id, secret) => {
    return new Promise((resolve, reject) => {
        listenForOAuthCallback(id, secret).then(resolve)
            .catch(err => {
                logError(err);
                reject()
            });

        const url = getAuthenticationUrl(id);
        logErrorF('Opening authentication URL \'%s\' through browser', url);
        open(url)
    })
};
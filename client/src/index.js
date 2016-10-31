import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import authData from '../dropbox-auth.json'
import fs from 'fs'
import _ from 'lodash'
import https from 'https'
import {readDir, createHash} from './utils/fileUtils.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import crypto from 'crypto'
import contractAddresses from '../contracts.json'
import {logError} from './utils/log'

const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const FILE_DIR = `${HOME_DIR}/SmartsafeClient`;
const IGNORED_FILES = ['.DS_Store', 'temp'];

const dropboxClient = new DropboxClient(authData.key, authData.secret);
const ethereumClient = new EthereumClient(contractAddresses);

function synchronizeUserFiles(filesHashes, userFilesLocations) {
    const userFiles = getUserFiles(userFilesLocations);
    const filesDataForUploadToDropbox = generateDropboxUploadDataForFiles(userFiles);
    uploadFileData(filesDataForUploadToDropbox, filesHashes);
    downloadMissingSharedFiles(filesDataForUploadToDropbox, filesHashes);
}

function getUserFiles(userFilesLocations) {
    try {
        return userFilesLocations.map(filePath => {
            const readStream = fs.createReadStream(`${FILE_DIR}/${filePath}`);
            return new Promise((resolve, reject) => {
                resolve({filePath:filePath, fileInfo:readStream})
            })
        }).catch(err => {
            logError(err);
            Promise.reject(err)
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function generateDropboxUploadDataForFiles(userFiles) {
    try {
        return userFiles.map(userFile => {
            userFile.then((filePath, fileInfo) => {
                return new Promise((resolve, reject) => {
                    const fileHash = createHash(fileInfo);
                    resolve({filePath:filePath, fileInfo:fileHash});
                })
            })
        }).catch(err => {
            logError(err);
            Promise.reject(err)
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function uploadFileData(userFilesDataForUploadToDropbox, filesHashes) {
    const userFilesDataForUploadToEth
        = prepareFileUploadToDropbox(userFilesDataForUploadToDropbox, filesHashes);
    const preparedFileDataForUploadToEth = prepareFileDataUploadToEth(userFilesDataForUploadToEth, filesHashes);
    uploadFileDataToEth(preparedFileDataForUploadToEth);
}

function fileHasBeenHashed(fileHash, filesHashes) {
    return filesHashes.indexOf(fileHash) !== -1;

}

function prepareFileUploadToDropbox(userFilesDataForUploadToDropbox, filesHashes) {
    try {
        return userFilesDataForUploadToDropbox.map(userFileDataForDropbox => {
            userFileDataForDropbox.then((filePath, fileDropboxUploadHash) => {
                return new Promise((resolve, reject) => {
                    if (fileHasBeenHashed(fileDropboxUploadHash, filesHashes)) {
                        resolve({filePath: filePath,
                                fileInfo: dropboxClient.upload(`${FILE_DIR}/${filePath}`, `/${filePath}`)})
                    }
                })
            }).catch(err => {
            logError(err);
            Promise.reject(err)
            })
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function prepareFileDataUploadToEth(userFilesDataForUploadToEth, filesHashes) {
    try {
        return userFilesDataForUploadToEth.map(userFileDataForEth => {
            userFileDataForEth.then((filePath, fileDropboxSharedLinkJSON) => {
                return new Promise((resolve, reject) => {
                    if (fileHasBeenHashed(fileDropboxSharedLinkJSON, filesHashes)) {
                        resolve({filePath: filePath,
                                fileInfo: ethereumClient
                                    .addFile(fileDropboxSharedLinkJSON, fileDropboxSharedLinkJSON.url, filePath)})
                    } else {
                        resolve()
                    }
                })
            })
        }).catch(err => {
            logError(err);
            Promise.reject(err)
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function uploadFileDataToEth(preparedFilesDataForUploadToEth) {
    try {
        preparedFilesDataForUploadToEth.map(preparedFileDataForEth => {
            preparedFileDataForEth.catch(err => {
                logError(err);
                Promise.reject(err)
            });
        });
    } catch (err) {
        logError(err);
        return []
    }
}

function downloadMissingSharedFiles(userFilesDataForUploadToDropbox, filesHashes) {
    try {
        userFilesDataForUploadToDropbox.map(userFileDataForDropbox => {
            userFileDataForDropbox.then((filePath, fileDropboxUploadHash) => {
                if (!_.find(filesHashes, fileDropboxUploadHash)) {
                    ethereumClient.findFileDropboxDataFromEthChain(fileDropboxUploadHash).then(file => {
                        downloadFileFromDropbox(file);
                    })
                }
            }).catch(err => {
                logError(err);
                Promise.reject(err)
            });
        });
    } catch (err) {
        logError(err);
        return []
    }
}

function downloadFileFromDropbox(file) {
    const downloadUrl = dropboxClient.getDirectDownloadLink(file.link);
    const filePath = dropboxClient.getFilePathFromUrl(downloadUrl);
    const fileStream = fs.createWriteStream(`${FILE_DIR}/${filePath}`);
    https.get(downloadUrl, fileToDownload => {
        fileToDownload.pipe(fileStream)
    })
}

dropboxClient.authenticate().then(() => {
    return readDir(FILE_DIR)
        }).then((files) => {
            const userFiles = files.filter((file) => {
                return IGNORED_FILES.indexOf(file) === -1
            });

            ethereumClient.getUserFiles()
                .then(hashes => synchronizeUserFiles(hashes, userFiles))
        }).catch(e => console.log(e));

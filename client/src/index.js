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

const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const FILE_DIR = `${HOME_DIR}/SmartsafeClient`;
const IGNORED_FILES = ['.DS_Store', 'temp'];

const dropboxClient = new DropboxClient(authData.key, authData.secret);
const ethereumClient = new EthereumClient(contractAddresses);

const syncFiles = (filesHashes, userFilesLocations) => {
    const userFiles = getUserFiles(userFilesLocations);
    const userFilesDataForUploadToDropbox = generateDropboxUploadDataForUserFiles(userFiles);
    uploadUserFileData(userFilesDataForUploadToDropbox, filesHashes);
    downloadMissingSharedFiles(userFilesDataForUploadToDropbox, filesHashes);
};

const getUserFiles = function(userFilesLocations) {
    try {
        return userFilesLocations.map(filePath => {
            const readStream = fs.createReadStream(`${FILE_DIR}/${filePath}`);
            return new Promise((resolve, reject) => {
                resolve({filePath:filePath, fileInfo:readStream})
            })
        }).catch(err => {
            console.log(err).bind(console);
            Promise.reject(err)
        })
    } catch (err) {
        console.log(err).bind(console);
        return []
    }
};

const generateDropboxUploadDataForUserFiles = function(userFiles) {
    try {
        return userFiles.map(userFile => {
            Promise.resolve(userFile).then((filePath, fileInfo) => {
                return new Promise((resolve, reject) => {
                    const fileHash = createHash(fileInfo);
                    resolve({filePath:filePath, fileInfo:fileHash});
                })
            })
        }).catch(err => {
            console.log(err).bind(console);
            Promise.reject(err)
        })
    } catch (err) {
        console.log(err).bind(console);
        return []
    }
};

const uploadUserFileData = function(userFilesDataForUploadToDropbox, filesHashes) {
    const userFilesDataForUploadToEth
        = uploadUserFileToDropbox(userFilesDataForUploadToDropbox, filesHashes);
    const ethUploading = uploadUserFileMetaDataToEth(userFilesDataForUploadToEth, filesHashes);
    ethUploading.map(ethUpload => {
        Promise.resolve(ethUpload).catch(err => {
            console.log(err).bind(console);
            Promise.reject(err)
        });
    });
};

const fileHasBeenHashed = function(fileHash, filesHashes) {
    return filesHashes.indexOf(fileHash) !== -1;

};

const uploadUserFileToDropbox = function(userFilesDataForUploadToDropbox, filesHashes) {
    try {
        return userFilesDataForUploadToDropbox.map(userFileDataForDropbox => {
            Promise.resolve(userFileDataForDropbox).then((filePath, fileDropboxUploadHash) => {
                return new Promise((resolve, reject) => {
                    if (fileHasBeenHashed(fileDropboxUploadHash, filesHashes)) {
                        resolve({filePath: filePath,
                                fileInfo: dropboxClient.upload(`${FILE_DIR}/${filePath}`, `/${filePath}`)})
                    }
                })
            }).catch(err => {
            console.log(err).bind(console);
            Promise.reject(err)
            })
        })
    } catch (err) {
        console.log(err).bind(console);
        return []
    }
};

const uploadUserFileMetaDataToEth = function(userFilesDataForUploadToEth, filesHashes) {
    try {
        return userFilesDataForUploadToEth.map(userFileDataForEth => {
            Promise.resolve(userFileDataForEth).then((filePath, fileDropboxSharedLinkJSON) => {
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
            console.log(err).bind(console);
            Promise.reject(err)
        })
    } catch (err) {
        console.log(err).bind(console);
        return []
    }
};

const downloadMissingSharedFiles = function (userFilesDataForUploadToDropbox, filesHashes) {
    userFilesDataForUploadToDropbox.map(userFileDataForDropbox => {
        Promise.resolve(userFileDataForDropbox).then((filePath, fileDropboxUploadHash) => {
            if (!_.find(filesHashes, fileDropboxUploadHash)) {
                ethereumClient.getFile(fileDropboxUploadHash).then(file => {
                    const dlUrl = dropboxClient.getDirectDownloadLink(file.link);
                    const filePath = dropboxClient.getFilePathFromUrl(dlUrl);
                    const fileStream = fs.createWriteStream(`${FILE_DIR}/${filePath}`);
                    https.get(dlUrl, res => {
                        res.pipe(fileStream)
                    })
                })
            }
        })
    });
};

dropboxClient.authenticate().then(() => {
    return readDir(FILE_DIR)
        }).then((files) => {
            const userFiles = files.filter((file) => {
                return IGNORED_FILES.indexOf(file) === -1
            });

            ethereumClient.getUserFiles().then(hashes => syncFiles(hashes, userFiles))
        }).catch(e => console.log(e));

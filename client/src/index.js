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
const TEMP_DIR = `${HOME_DIR}/SmartsafeClient`;

const IGNORED_FILES = ['.DS_Store', 'temp'];

const dropboxClient = new DropboxClient(authData.key, authData.secret);
const ethereumClient = new EthereumClient(contractAddresses);

function logDebug(err) {
    winston.log('debug', err)
}

function logError(err) {
    winston.log('error', err)
}

function synchronizeUserFiles(filesHashesFromEth, localFilesFullPaths) {
    /// Upload local files
    // Promise.resolve(localFilesFullPaths).then(userFilesFullPaths => {
    //     return Promise.all(userFilesFullPaths.map(userFileFullPath => {
    //         return prepareFileDataForFiles(userFileFullPath);
    //     }));
    // }).then(localFilesDataToDropbox => {
    //     return Promise.all(localFilesDataToDropbox.map(localFileData => {
    //         const localFileName = localFileData.fileName;
    //         const localFileHash = localFileData.fileInfo;
    //         if (!fileMetaDataUploadedToEth(localFileHash, filesHashesFromEth)) {
    //             return uploadLocalFilesToDropbox(localFileName, localFileHash)
    //         }
    //         return Promise.resolve()
    //
    //     }))
    // }).then(filesDataToEth => {
    //     if (filesDataToEth.length === -1) {
    //         return Promise.resolve()
    //     }
    //
    //     return Promise.all(filesDataToEth.map(fileDataToEth => {
    //         if (fileDataToEth == null) return Promise.resolve();
    //         return uploadLocalFileMetaDataToEth(fileDataToEth)
    //     }));
    // }).catch(err => {
    //     logError(err);
    // });

    /// Download missing local files
    Promise.resolve(localFilesFullPaths).then(userFilesFullPaths => {
        return Promise.all(userFilesFullPaths.map(userFileFullPath => {
            return prepareFileDataForFiles(userFileFullPath);
        }));
    }).then(localFileDatas => {
        return Promise.resolve(filesHashesFromEth).then(filesEthHashes => {
            Promise.all(filesEthHashes.map(fileEthHash => {
                getFilesOnEthNotLocallyPresent(localFileDatas, fileEthHash);
            }))
        })
    }).then(fileEthMetaDatas => {
        logError(fileEthMetaDatas);
        if (fileEthMetaDatas.length === -1) {
            return Promise.resolve()
        }

        return Promise.all(fileEthMetaDatas.map(fileEthMetaData => {
            if (fileEthMetaData == null) return Promise.resolve();
            return Promise.resolve(downloadFileFromDropbox(fileEthMetaData));
        }))
    }).catch(err => {
        logError(err);
    })

}
function getFilesOnEthNotLocallyPresent(localFileDatas, fileEthHash) {
    return new Promise((resolve, reject) => {
            for (let localFileDataIndex = 0; localFileDataIndex < localFileDatas.length; ++localFileDataIndex) {
                const localFileData = localFileDatas[localFileDataIndex];

                const localFileHash = localFileData.fileInfo;
                if (localFileHash === fileEthHash) {
                    return resolve()
                }
            }
            return resolve(downloadMetaDataFromEthWithHash(fileEthHash));
    });
}

function downloadMetaDataFromEthWithHash(fileHash) {
    return new Promise((resolve, reject) => {
        (ethereumClient.findFileDropboxDataFromEthChain(fileHash))
            .then(fileMetaDataFromEth => {
                return resolve(fileMetaDataFromEth)
            })
    })
}

function fileMetaDataUploadedToEth(hash, ethHashes) {
    return ethHashes.indexOf(hash) !== -1;
}

function prepareFileDataForFiles(filePath) {
    return new Promise((resolve, reject) => {
        const fileName = getFileNameFromFilePath(filePath);
        const readStream = fs.createReadStream(getFullPathForFileName(fileName));

        readStream.on('error', (error) => {
            if (error.code == 'ENOENT') {
                return ""
            }
            throw error
        });

        return createHashForFile(readStream).then(fileData => {
            return resolve({fileName: fileName, fileInfo: fileData})
        })
    })
}

function getFullPathForFileName(fileName) {
    return `${FILE_DIR}/${fileName}`;
}

function getFileNameFromFilePath(filePath) {
    return filePath.substring(filePath.lastIndexOf(FILE_DIR) + FILE_DIR.length + 1, filePath.length);
}

function uploadLocalFilesToDropbox(fileName, fileHash) {
    return new Promise((resolve, reject) => {
        Promise.resolve(dropboxClient.upload(`${FILE_DIR}/${fileName}`, `/${fileName}`))
            .then(responseJson => {
                return resolve({
                    fileName: fileName,
                    fileHash: fileHash,
                    fileSharedLink: responseJson.url
                });
            })


    })
}

function uploadLocalFileMetaDataToEth(fileData) {
    return new Promise((resolve, reject) => {
        const fileName = fileData.fileName;
        const fileHash = fileData.fileHash;
        const fileDropboxSharedLink = fileData.fileSharedLink;
        ethereumClient.addFileMetaData(fileHash, fileDropboxSharedLink, fileName).then(()=> {
            return resolve()
        });

    })
}

function downloadFileFromDropbox(fileMetaDataFromEth) {
    return new Promise((resolve, reject) => {
        const downloadUrl = DropboxClient.getDirectDownloadLink(fileMetaDataFromEth.link);
        const fileName = DropboxClient.getFileNameFromUrl(downloadUrl);
        const fileStream = fs.createWriteStream(`${FILE_DIR}/${fileName}`);
        https.get(downloadUrl, fileToDownload => {
            fileToDownload.pipe(fileStream)
        });
    });
}

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

import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import authData from '../dropbox-auth.json'
import fs from 'fs'
import _ from 'lodash'
import https from 'https'
import {readDir, createHashForFile} from './utils/fileUtils.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import crypto from 'crypto'
import contractAddresses from '../contracts.json'
import winston from './utils/log';
import {writeFile} from "fs";

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

function synchronizeUserFiles(filesHashesFromEth, userFilesLocationsFromEth) {
    /// Upload local files
    Promise.resolve(userFilesLocationsFromEth).then(userFilesFullPaths => {
        return Promise.all(userFilesFullPaths.map(userFileFullPath => {
            return prepareDropboxUploadDataForFiles(userFileFullPath);
        }));
    }).then(filesDataToDropbox => {
        return Promise.all(filesDataToDropbox.map(fileDataToDropbox => {
            const fileName = fileDataToDropbox.fileName;
            const fileDropboxUploadHash = fileDataToDropbox.fileInfo;
            if (!fileHasBeenUploaded(fileDropboxUploadHash, filesHashesFromEth)) {
                return uploadLocalFilesToDropbox(fileName, fileDropboxUploadHash)
            }
            return Promise.resolve(undefined)

        }))
    }).then(filesDataToEth => {
        if (filesDataToEth.length === -1) {
            return Promise.resolve()
        }
        return Promise.all(filesDataToEth.map(fileDataToEth => {
            if(fileDataToEth == null) return;
            return uploadLocalFileMetaDataToEth(fileDataToEth)
        }));
    }).catch(err => {
        logError(err);
    });

    /// Download missing local files

    Promise.resolve(userFilesLocationsFromEth).then(userFilesFullPaths => {
        return Promise.all(userFilesFullPaths.map(userfileFullPath => {
            return prepareDropboxUploadDataForFiles(userfileFullPath);
        }));
    }).then(filesDataToDropbox => {
        return Promise.all(filesDataToDropbox.map(fileDataToDropbox => {
            const fileDropboxUploadHash = fileDataToDropbox.fileInfo;
            if (fileHasBeenUploaded(fileDropboxUploadHash, filesHashesFromEth)) {
                return downloadLocalFilesMetaDataFromEth(fileDropboxUploadHash)
            }
            return Promise.resolve(undefined)
        }))

    }).then(missingLocalFiles => {
        logError(missingLocalFiles)
        if (missingLocalFiles.length === -1) {
            return Promise.resolve()
        }
        return Promise.all(missingLocalFiles.map(missingLocalFile => {
            if(missingLocalFile == null) return;
            return Promise.resolve(downloadFileFromDropbox(missingLocalFile));
        }))
    }).catch(err => {
        logError(err);
    })

}

function prepareDropboxUploadDataForFiles(filePath) {
    return new Promise((resolve, reject) => {
        const fileName = removeFileDirFromFilePath(filePath);
        const readStream = fs.createReadStream(`${FILE_DIR}/${fileName}`);
        return createHashForFile(readStream).then(fileHash => {
            return resolve({fileName: fileName, fileInfo: fileHash})
        })
    })
}

function removeFileDirFromFilePath(filePath) {
    return filePath.substring(filePath.lastIndexOf(FILE_DIR) + FILE_DIR.length + 1, filePath.length);
}

function fileHasBeenUploaded(fileHash, filesHashesFromEth) {
    return filesHashesFromEth.indexOf(fileHash) !== -1;
}

function uploadLocalFilesToDropbox(fileName, fileDropboxUploadHash) {
    return new Promise((resolve, reject) => {
        Promise.resolve(dropboxClient.upload(`${FILE_DIR}/${fileName}`, `/${fileName}`))
            .then(responseJson => {
                return resolve({
                fileName: fileName,
                fileHash: fileDropboxUploadHash,
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

function downloadLocalFilesMetaDataFromEth(fileDropboxUploadHash) {
    return new Promise((resolve, reject) => {
        (ethereumClient.findFileDropboxDataFromEthChain(fileDropboxUploadHash))
            .then(fileMetaDataFromEthf => {return resolve(fileMetaDataFromEth)})
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
        return resolve()
    })
}


// contracts
// ethereumClient.loadContracts().then((address) => {
//     writeFile('contracts.json', JSON.stringify({file: address}), (err) => {
//         if (err) console.log(err)
//     });
//     console.log('contracts loaded')
// }).catch((e) => {
//     console.log(e)
// });

// folder synchronization
dropboxClient.authenticate()
    .then(() => {
        return readDir(FILE_DIR)
    }).then(files => {
    const userFilesLocations = files.filter((file) => {
        return IGNORED_FILES.indexOf(file) === -1
    });

    return ethereumClient.getUserFilesHashes()
        .then(filesHashesFromEth => {
            return synchronizeUserFiles(filesHashesFromEth, userFilesLocations)
        })
}).catch(err => logError(err));

// new file upload
// dropboxClient.authenticate().then(() => {
//     ethereumClient.watchFileChanges(onNewFile)
// });
//
//
// function onNewFile({url, hash}) {
//     // Replace dl=0 with dl=1 to get direct downloadable link
//     const dlUrl = DropboxClient.getDirectDownloadLink(url);
//     const fileName = DropboxClient.getFileNameFromUrl(dlUrl);
//     const file = fs.createWriteStream(`${TEMP_DIR}/${fileName}`);
//     https.get(dlUrl, (res) => {
//         res.pipe(file);
//         file.on('finish', () => {
//             if (fileName) {
//                 dropboxClient.upload(`${TEMP_DIR}/${fileName}`, `/${fileName}`)
//                     .then((data) => {
//                         ethereumClient.addAPeer(hash, data.url)
//                             .then(() => {
//                                 ethereumClient.getPeer(hash)
//                                 .then((peerUrl) => {
//                                     console.log('peerUrl', peerUrl)
//                             })
//                         }).catch((e) => {
//                             console.log(e)
//                         })
//                     })
//             }
//         })
//     }).on('error', (err) => console.log(err))
// }

// recursively list files user's Dropbox folder
// dropboxClient.authenticate()
//     .then(() => {
//         dropboxClient.listFolder()
//             .then(result => {
//                 let files = Array.from(result);
//                 if (files.length !== 0) {
//                     files.forEach(res => {
//                         logDebug(res.name)
//                     });
//                 } else {
//                     logError("No files in user's folder")
//                 }
//             });
//     }).catch(err => logError(err));

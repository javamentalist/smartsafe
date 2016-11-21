import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import authData from '../dropbox-auth.json'
import fs from 'fs'
import https from 'https'
import {readDir, createHashForFile, checkExistence} from './utils/fileUtils.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import * as cryptoUtils from './utils/cryptoUtils.js'
import winston from './utils/log';
const readFile = Promise.promisify(require("fs").readFile);
import {type as osType} from 'os';
import {join as pathJoin} from 'path';

const CONTRACTS_FILE = '/../contracts.json';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const FILE_DIR = `${HOME_DIR}/SmartsafeClient`.split("\\").join("/");
const TEMP_DIR = `${HOME_DIR}/SmartsafeClient`;
const KEYS_DIR = `${HOME_DIR}/.smartsafeKeys`;
const PUBLIC_KEY = `${KEYS_DIR}/rsa.pub`;
const PRIVATE_KEY = `${KEYS_DIR}/rsa`;
const SYMMETRIC_KEY = 'fkdhf209uc5v5mnr5e3e2';

const IGNORED_FILES = ['.DS_Store', 'temp'];

const dropboxClient = new DropboxClient(authData.key, authData.secret);

const ethereumClient = new EthereumClient(getDefaultIpcPath());

function logDebug(err) {
    winston.log('debug', err)
}

function logError(err) {
    winston.log('error', err)
}

function getDefaultIpcPath() {
    let ipcPath;
    const dataDirPath = getDefaultDatadir();
    switch (osType()) {
        case 'Windows_NT':
            ipcPath = '\\\\.\\pipe\\geth.ipc';
            break;
        default:
            ipcPath = pathJoin(dataDirPath, 'geth.ipc');
            break;
    }
    return ipcPath;
}

function getDefaultDatadir() {
    let dataDir;
    switch (osType()) {
        case 'Linux':
            dataDir = __dirname + '/../chain/datadir';
            break;
        case 'Darwin':
            break;
        case 'Windows_NT':
            break;
        default:
            throw new Error('osType not supported');
    }
    return dataDir;
}

function synchronizeUserFiles(filesHashesFromEth, localFilesFullPaths) {
    /// Upload local files
    const filesHashesFromEth2 = Promise.resolve(filesHashesFromEth);

    const localFilesFullPaths2 = Promise.resolve(localFilesFullPaths);
    const preparedFileDataForFiles = localFilesFullPaths2.then(localFilesFullPaths21 => {
        return Promise.all(localFilesFullPaths21.map(localFileFullPath => {
            return prepareFileDataForFiles(localFileFullPath);
        }));
    });

    Promise.join(preparedFileDataForFiles, filesHashesFromEth2, (localFilesData, filesHashesFromEth21) => {
        return Promise.all(localFilesData.map(localFileData => {
            const localFileName = localFileData.fileName;
            const localFileHash = localFileData.fileInfo;
            if (!fileMetaDataUploadedToEth(localFileHash, filesHashesFromEth21)) {
                return uploadLocalFilesToDropbox(localFileName, localFileHash)
            }
            return Promise.resolve()

        }))
    }).then(filesDataToEth => {
        return Promise.all(filesDataToEth.map(fileDataToEth => {
            if (fileDataToEth == null) return Promise.resolve();
            return uploadLocalFileMetaDataToEth(fileDataToEth)
        }));
    }).catch(err => {
        logError(err);
    });

    /// Download missing local files
    const filesHashesFromEth3 = Promise.resolve(filesHashesFromEth);

    const localFilesFullPaths3 = Promise.resolve(localFilesFullPaths);
    const preparedFileDataForFiles2 = localFilesFullPaths3.then(localFilesFullPaths31 => {
        return Promise.all(localFilesFullPaths31.map(localFileFullPath => {
            return prepareFileDataForFiles(localFileFullPath);
        }));
    });

    Promise.join(preparedFileDataForFiles2, filesHashesFromEth3, (localFilesData, filesHashesFromEth31) => {
        return Promise.all(filesHashesFromEth31.map(filesHash => {
            return getFilesOnEthNotLocallyPresent(localFilesData, filesHash);
        }))
    }).then(filesEthMetaData => {
        return Promise.all(filesEthMetaData.map(fileEthMetaData => {
            if (fileEthMetaData == null) return Promise.resolve();
            return Promise.resolve(downloadFileFromDropbox(fileEthMetaData));
        }))
    }).catch(err => {
        logError(err);
    })

}

function getFilesOnEthNotLocallyPresent(localFilesData, fileEthHash) {
    return new Promise((resolve, reject) => {
        for (let localFileNo = 0; localFileNo < localFilesData.length; localFileNo++) {
            const localFileData = localFilesData[localFileNo];
            const localFileHash = localFileData.fileInfo;
            if (localFileHash === fileEthHash) {
                return resolve()
            }
        }
        downloadMetaDataFromEthWithHash(fileEthHash).then(fileMetaDataFromEth => {
            return resolve(fileMetaDataFromEth);
        })
    });
}

function downloadMetaDataFromEthWithHash(fileHash) {
    return new Promise((resolve, reject) => {
        (ethereumClient.findFileMetaDataFromEthChain(fileHash)).then(fileMetaDataFromEth => {
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
        const fileHash = getHashForFile(filePath);

        return resolve({fileName: fileName, fileInfo: fileHash})
    })
}

function getHashForFile(filePath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath);
        readStream.on('error', (error) => {
            reject(error)
        });
        return resolve(createHashForFile(readStream));
    })
}


function getFullPathForFileName(fileName) {
    return `${FILE_DIR}/${fileName}`;
}

function getFileNameFromFilePath(filePath) {
    const filePathReplaced = filePath.split("\\").join("/")
    const fileName = filePathReplaced.substring(FILE_DIR.length + 1, filePathReplaced.length)
    return fileName;
}

function uploadLocalFilesToDropbox(fileName, fileHash) {
    return new Promise((resolve, reject) => {
        logError(`${FILE_DIR}/${fileName}`)
        Promise.resolve(dropboxClient.upload(`${FILE_DIR}/${fileName}`, `/${fileName}`))
            .then(responseJson => {
                return resolve({
                    fileName: fileName,
                    fileHash: fileHash,
                    fileSharedLink: responseJson.url
                });
            }).catch(err => {
            logError(err)
        })
    })
}

// toDo: ??? delete encrypted file
function uploadEncryptedLocalFilesToDropbox(fileName, fileHash) {
    return cryptoUtils.generatePassword().then(function (password) {
        saveEncryptedPasswordToDatabase(password);
        return cryptoUtils.encryptWithSymmetricKey(getFullPathForFileName(fileName), SYMMETRIC_KEY);
    }).then(function (encryptedFileName) {
        const encryptedFileLocalName = getFileNameFromFilePath(encryptedFileName);
        return new Promise([encryptedFileLocalName, getHashForFile(encryptedFileName)]);
    }).then(function ([encryptedFileName, encryptedFileHash]) {
        return uploadLocalFilesToDropbox(encryptedFileName, encryptedFileHash);
    }).catch(function (err) {
        logError(err);
    })
}

function saveEncryptedPasswordToDatabase(password) {
    return encryptWithUserPublicKey(password);
    // save to database
}

function encryptWithUserPublicKey(text) {
    return ensureKeyPair().then(function () {
        return Promise.resolve(fs.readFileSync(PUBLIC_KEY));
    }).then(function (key) {
        return cryptoUtils.encryptWithPublicKey(text, key);
    })
}

function decryptWithUserPrivateKey(text) {
    return ensureKeyPair().then(function () {
        return Promise.resolve(fs.readFileSync(PRIVATE_KEY));
    }).then(function (key) {
        return cryptoUtils.decryptWithPrivateKey(text, key);
    })
}

function ensureKeyPair() {
    return checkExistence(KEYS_DIR).catch(function () {
        return Promise.resolve(fs.mkdirSync(KEYS_DIR));
    }).then(function () {
        return Promise.all([checkExistence(PUBLIC_KEY), checkExistence(PRIVATE_KEY)])
    }).catch(function (err) {
        return createKeyPair()
    })
}

function createKeyPair() {
    return cryptoUtils.generateRsaKeyPair().then(function (keys) {
        return Promise.all([fs.writeFileSync(PUBLIC_KEY, keys.public), fs.writeFileSync(PRIVATE_KEY, keys.private)])
    }).catch(function (err) {
        logError(err);
    })
}

function uploadLocalFileMetaDataToEth(fileData) {
    return new Promise((resolve, reject) => {
        const fileName = fileData.fileName;
        const fileHash = fileData.fileHash;
        encryptWithUserPublicKey(fileData.fileSharedLink).then(fileDropboxSharedLink => {
            ethereumClient.addFileMetaData(fileHash, fileDropboxSharedLink, fileName)
        }).then(() => {
            return resolve()
        });
    })
}

// TODO: if the file was in a dir, put it into a dir
function downloadFileFromDropbox(fileMetaDataFromEth) {
    return Promise.resolve(fileMetaDataFromEth.link).then(encryptedDownloadUrl => {
        return decryptWithUserPrivateKey(encryptedDownloadUrl)
    }).then(function (dropboxLink) {
        const encryptedDownloadUrl = fileMetaDataFromEth.link;
        return new Promise((resolve, reject) => {
            const downloadUrl = DropboxClient.getDirectDownloadLink(dropboxLink);
            const fileName = DropboxClient.getFileNameFromUrl(downloadUrl);
            const fileStream = fs.createWriteStream(`${FILE_DIR}/${fileName}`);

            https.get(downloadUrl, (fileToDownload) => {
                fileToDownload.pipe(fileStream);
                return resolve(fileName)
            }).on('error', (err) => {
                logError(err);
            });
        })
    }).then(function (fileName) {
        return decryptFileIfEncrypted(fileName)
    })
}

function decryptFileIfEncrypted(fileName) {
    const suffix = '.enc';
    const fullName = `${FILE_DIR}/${fileName}`;
    if (fileName.indexOf(suffix, fileName.length - suffix.length) !== -1) {
        return cryptoUtils.decryptWithSymmetricKey(fullName, SYMMETRIC_KEY);
    } else {
        return Promise.resolve(fullName);
    }
}


// set the watcher for contracts.js
// ethereumClient.loadContracts().then((address) => {
//
//     console.log('contracts loaded')
// }).catch((e) => {
//     console.log(e)
// });

// folder synchronization
readFile(__dirname + CONTRACTS_FILE, 'utf8').then(contracts => {
    return JSON.parse(contracts)
}).then(parsedContracts => {
    return ethereumClient.deployParsedContract(parsedContracts)
}).then(() => {
    return dropboxClient.authenticate()
}).then(() => {
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

//new file upload
//dropboxClient.authenticate().then(() => {
//    ethereumClient.watchFileChanges(onNewFile)
//});


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

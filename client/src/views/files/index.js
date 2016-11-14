// Export defaults as named exports
export {default as FileTable} from './components/FileTable.jsx'
export {default as UploadQueue} from './components/UploadQueue.jsx'
export {default as UserFileList} from './UserFileList.jsx'
export {default as FileDetail} from './FileDetail.jsx'

// Also export named exports with a different name (useful for testing)
export {UserFileList as UserFileListUndecorated} from './UserFileList.jsx'
export {FileDetail as FileDetailUndecorated} from './FileDetail.jsx'

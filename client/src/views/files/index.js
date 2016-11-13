// Export defaults as named exports
export {default as FileTable} from './components/FileTable.jsx'
export {default as FileList} from './FileList.jsx'
export {default as FileDetail} from './FileDetail.jsx'

// Also export named exports with a different name (useful for testing)
export {FileList as FileListUndecorated} from './FileList.jsx'
export {FileDetail as FileDetailUndecorated} from './FileDetail.jsx'

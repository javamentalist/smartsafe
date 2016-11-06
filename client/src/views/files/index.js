// Export defaults as named exports
export {default as MyFiles} from './MyFiles.jsx'
export {default as SharedFiles} from './SharedFiles.jsx'
export {default as FileTable} from './components/file-table.jsx'

// Also export named exports with a different name (useful for testing)
export {MyFiles as MyFilesUndecorated} from './MyFiles.jsx'

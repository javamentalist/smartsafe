// index.js (renderer process)

// Initialize Electron renderer function.
// This magic is needed, because electron doesn't understand ES6 yet (to be more precise, ES6 import starements)
// and bundling with browserify caused errors when accessing file system
// ('fs.readFileSync is not a function')
// See here: https://github.com/electron/electron/issues/1611#issuecomment-104808431

require('babel-register')
require('./app-index.js')
// Compile all ES6 imports to require() on the fly for electron's pleasure
require('babel-register')
require('./main.js')
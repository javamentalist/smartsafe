// 1. use code below to use this logger:
//  var logger = require('winston')
//
// 2. entrypoint js-file needs to have (index.js/server.js):
// var logger = require('<path_to_this_file>')
//
// all other files need to use 1. to have winston configured

var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  timestamp: true,
  level: 'debug',
  colorize: true
});

module.exports = logger

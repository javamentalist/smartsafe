// 1. use code below to use this logger:
//  var winston = require('winston')
//
// 2. entrypoint js-file needs to have (index.js/server.js):
// var winston = require('<path_to_this_file>')
//
// all other files need to use 1. to have winston configured
import winston from 'winston';
export {winston} from './log';

winston.remove(winston.transports.Console);

winston.add(winston.transports.Console, {
    timestamp: true,
    level: 'debug',
    colorize: true
});



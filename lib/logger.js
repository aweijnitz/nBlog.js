var winston = require('winston');

// NOTE
// Commented out for now. Winston somehow messed up the mocha test reports
//

// var logger = new (winston.Logger)({
//   transports: [

//     new (winston.transports.Console)({ json: false, timestamp: true }),
//     new winston.transports.File({ filename: __dirname + 'logs/log.log', json: false })
//   ],
//   exceptionHandlers: [
//     new (winston.transports.Console)({ json: false, timestamp: true }),
//     new winston.transports.File({ filename: __dirname + 'logs/errors.log', json: false })
//   ],
//   exitOnError: false
// });
var logger = console;

module.exports = logger;

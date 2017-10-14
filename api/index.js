'use strict'; /* eslint no-process-exit:0 */

const winston = require('winston');
const config = require('./config');

// Initialize logger
const log = global.log = new winston.Logger({
  level: config.logLevel,
  transports: [
    new (winston.transports.Console)(),
  ],
});

const app = require('./app');

const server = app.listen(config.port, ()=> {
  log.info(`Server listening on port ${ config.port }`);
});

process.on('SIGTERM', ()=> {
  log.info('Shutting down server...');

  server.close(()=> {
    log.info('Connections closed...');
    process.exit();
  });
});

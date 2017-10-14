'use strict'; /* eslint no-process-env:0 */

/*
 * Configuration shared by the whole application.
 */

const config = {
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  port: process.env.PORT,
  host: process.env.HOST,
  redisUrl: process.env.REDIS_URL || process.env.REDISTOGO_URL,
  sentryDsn: process.env.SENTRY_DSN,
};

module.exports = config;

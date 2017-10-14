'use strict';

const log = global.log;

const path = require('path');
const express = require('express');
const hpp = require('hpp');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const middlewares = require('./middlewares');
const routers = require('./routers');

// Initialize web server
const app = express();

app.set('case sensitive routing', false);
app.set('etag', false);
app.set('query parser', 'simple');
app.set('strict routing', false);
app.set('trust proxy', true);
app.set('x-powered-by', false);

app.use(cors({
  credentials: true,
  methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  origin: true,
  preflightContinue: false,
}));

app.use(hpp());
app.use(helmet({ hsts: false }));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan(':remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
  stream: { write(message) { log.info(message.trim()); } },
}));

// Routing
app.use(middlewares.requireSSL(config.env !== 'development'));
app.use('/api', routers.api({}));
app.use(routers.web({ root: path.join(__dirname, '/../web-dist') }));

// Error handling
app.use(middlewares.sendError());

module.exports = app;

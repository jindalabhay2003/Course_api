const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set Security HTTP Headers
app.use(helmet());

// For development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser, Reading Data from body
app.use(express.json({ limit: '10kb' }));

// 2) ROUTES


module.exports = app;
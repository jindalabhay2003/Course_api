const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./Utils/appError.js');
const globalErrorHandler = require('./controllers/ErrorController');
const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');

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

// Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// 2) ROUTES
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/users', userRouter);


// After this If request and response cycle has not ended then
// It means that it is unhandled request

app.all('*',(req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} On this Server`,404));
});
  
app.use(globalErrorHandler);

module.exports = app;
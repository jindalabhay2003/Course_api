const AppError = require('./../Utils/appError');

const handleJWTError = ()=>{

  return new AppError('Invalid Token, Please Log in Again!',401);
}

const handleJWTExpiredError = ()=>{

  return new AppError('Your Token has Expired, Please Log in Again!',401);
}

const handleCastErrorDB = err => {

  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message,400);

}

const handleDuplicateFieldsDB = err=>{

  const value = err.keyValue.name;
  const message = `Duplicate Field Value: ${value}, Please use another value`;
  
  return new AppError(message,400);

}

const handleValidationErrorDB = err=>{

  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid Data: ${errors.join('. ')}`;
  return new AppError(message,400);

}

const sendErrorDev = (err,res)=>{

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });

}

const sendErrorProd = (err,res) =>{

  // Operational - Trusted Error
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
  // Programming or other Error
  else{
    console.error('ERROR ',err);

    // Send Generic message
    res.status(500).json({
      status: 'error',
      message: "Something went wrong"
    })
  }

}

module.exports = (err,req,res,next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if(process.env.NODE_ENV === 'development'){
      sendErrorDev(err,res);
    }
    else{
      
      let error = { ...err };
    
      if(err.name === 'CastError') error = handleCastErrorDB(error);

      if(err.code === 11000) error = handleDuplicateFieldsDB(error);

      if(err.name === 'ValidationError') error = handleValidationErrorDB(error);

      if(err.name === "JsonWebTokenError") error = handleJWTError();

      if(err.name === "TokenExpiredError") error = handleJWTExpiredError();

      sendErrorProd(error,res);
    }
  
  }
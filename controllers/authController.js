const crypto = require('crypto');
const User = require('./../models/userModel.js');
const { promisify } = require('util');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');
const jwt = require('jsonwebtoken');

const signToken = id =>{

    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

}

const createSendToken = (user,statusCode,res)=>{

    const Token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
        ),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie("jwt",Token,cookieOptions);

    // Remove Password
    user.password = undefined;
    
    res.status(statusCode).json({
        status: 'success',
        Token,
        data: {
            user
        }
    })

}

exports.signup = catchAsync(async (req,res,next)=>{

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
      });

      createSendToken(newUser,201,res);

});

exports.login = catchAsync(async (req,res,next) => {

    const {email, password} = req.body;

    // 1) Check if email and password exists

    if(!email || !password){
        return next(new AppError('Please Provide email and Password!',400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect Email and Password!',401));
    }

    // Send Token
    createSendToken(user,200,res);

});

exports.protect = catchAsync(async (req,res,next)=>{

    // 1) Getting Token and check out if it is there
    let Token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        Token = req.headers.authorization.split(' ')[1];
    }

    if(!Token){
        return next(new AppError('You are not logged in! Please Log in to get access.',401));
    }

    // 2) Verification Of Token
    const decoder = await promisify(jwt.verify)(Token,process.env.JWT_SECRET);
    // console.log(decoder);

    // 3) Check if User Still Exists

    const freshUser = await User.findById(decoder.id);

    if(!freshUser){
        return next(new AppError('The User Belonging to this Token does not exist',401));
    }

    // 4) Check if Its Password has not changed

    if(freshUser.changePasswordAfter(decoder.iat)){
        return next(new AppError('User recently changed password! Please log in again.',401));
    }
    
    // GRANT ACCESS
    req.user = freshUser;
    next();

});

exports.restrictTo = (...roles) =>{

    return (req,res,next) => {

        // roles is an array
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action',403));
        }

        next();
    }

}
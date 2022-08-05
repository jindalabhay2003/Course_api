const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please tell us your name!" ]
    },
    email:{
        type: String,
        required: [true,'Please Provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user','guide','lead-guide','admin'],
        default: 'user'
    },
    password:{
        type: String,
        required: [true,'please provide a password!'],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true,'Please confirm your Password!'],
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: "Passwords are not same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});


const User = mongoose.model('User',UserSchema);

module.exports = User;
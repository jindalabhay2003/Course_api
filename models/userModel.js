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
        enum: ['user','admin'],
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

UserSchema.pre('save',async function(next) {

    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();

});

UserSchema.methods.correctPassword = async function(candidatePassword,userPassword){

    return await bcrypt.compare(candidatePassword,userPassword);
}

UserSchema.methods.changePasswordAfter = function(JWTTimestamp){

    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000,10);

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
}

UserSchema.pre('save',function(next){

    if(!this.isModified('password') || this.isNew){
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

const User = mongoose.model('User',UserSchema);

module.exports = User;
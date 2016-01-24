'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Profile = require('./profile'),
    Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    email : {
        type: String,
        unique: true,
        lowercase: true
    },
    uid : {
        type: String,
        unique: true,
        uppercase: true
    },
    password : {
        type: String
    },
    profile: {
        type : Schema.ObjectId,
        ref : 'Profile',
        unique: true,
    },
    picture: {
        type: String,
        default: ''
    },
    displayName: {
       type: String
    },

    dateCreated: {
        type: Date,
        default: Date.now
    },
    isFrosen: {
        type: Boolean,
        default: false,
        select: false
    },
    resetPassword: {
        token: {
            type: String,
        },
        expires: {
            type: Date,
        },
        select: false
    },

    facebook         : String,
    twitter          : String,
    google           : String,
    linkedin         : String,
});

userSchema.path('profile').set(function (newVal) {
    //disable change profile
    if (!this.profile) {
        return newVal;
    }
    return this.profile;
});

userSchema.pre('save', function(next) {
    var self = this;
    if (!self.profile) {
        var profile = new Profile();
        profile.save(function (err, newProfile) {
            if (err) throw err;
            self.profile = newProfile._id;
            next();
        })
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

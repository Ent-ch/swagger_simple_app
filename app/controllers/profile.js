'use strict';

var User = require('../models/user'),
    mess = require('../config').mess,
    swaggerValidate = require('swagger-validate'),
    swAuth = require('../models/sw_models/user'),
    Profile = require('../models/profile');

module.exports.setPrivacy = function (req, res) {
    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(mess.userNotFound.s).send(mess.userNotFound.m);
        }

        // user.showProfile.everybody = req.body.showProfile.everybody || user.showProfile.everybody;
        // user.showProfile.showFor = req.body.showProfile.showFor || user.showProfile.showFor;
        // user.showProfile.hideFor = req.body.showProfile.hideFor || user.showProfile.hideFor;

        // user.showMemos.everybody = req.body.showMemos.everybody || user.showMemos.everybody;
        // user.showMemos.showFor = req.body.showMemos.showFor || user.showMemos.showFor;
        // user.showMemos.hideFor = req.body.showMemos.hideFor || user.showMemos.hideFor;

        user.save(function(err) {
            res.status(200).end();
        });
    });
}

module.exports.getProfile = function (req, res) {
    User.findById(req.user)
    .populate('profile')
    .exec(function(err, profile) {
        if (err) return res.status(mess.userNotFound.s).send(mess.userNotFound.m);
        res.send(profile);
    });
}

module.exports.editProfile = function (req, res) {
    var data = req.body,
        error = swaggerValidate.model(data, swAuth.Profile);
        
    if (error) {
        return res.status(400).send({ message: error.message });
    }
    User.findById(req.user, function(err, user) {
        if (err) res.status(500).send({ message: 'bad user search' });
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }
        for(var elem in data){
            if(!user[elem]) {
                delete data[elem];
            }
        }
        console.log(data);
        // user.save(function(err, upUser) {
        user.update(data, function(err, upUser) {
            if(err) {
                return res.status(500).send({ message: err.message });
                console.log(err);
            }
            res.json(upUser);
        })
        // return res.send({ message: 'naf' });
    });
}

module.exports.deleteProfile = function (req, res) {
    User.findById(req.user, function(err, user) {
        if(err) throw err;
        user.remove(function(err, doc) {
            if(err) throw err;
            res.json(doc);
        });
    });
}

module.exports.freezeProfile = function (req, res) {
    User.findById(req.user, function(err, user) {
        if(err) throw err;
        user.isFrosen = true;
        user.save(function(err, doc) {
            if(err) throw err;
            res.json(doc);
        })
    });
}

module.exports.authUnlink = function (req, res) {
    var provider = req.body.provider;
    var providers = ['facebook', 'google', 'linkedin', 'twitter'];
    
    if (providers.indexOf(provider) === -1) {
        return res.status(400).send({ message: 'Unknown OAuth Provider' });
    }
    User.findById(req.user, function(err, user){
        if(!user){
            return res.status(400).send({ message: 'User not found' })
        }
        
        user[provider] = undefined;
        user.save(function(err){
            res.status(200).end();
        })
    })
}

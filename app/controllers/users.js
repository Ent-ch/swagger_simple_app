'use strict';

var User = require('../models/user'),
    hidenFields = {password: 0, profile: 0},
    ObjectId = require('mongoose').Types.ObjectId;

module.exports.GetUsers = function(req, res) {
    User.find({}, hidenFields, function(err, users) {
        if (err) throw err;
        res.json(users);
    });
}

module.exports.getProfile = function(req, res) {
    var id = req.params.id,
        objId = new ObjectId( (id.length < 12) ? "123456789012" : id ),
        searchParam = [{'_id': objId}, {'uid': id.toUpperCase()}];

    User.findOne(searchParam, hidenFields)
    .exec(function(err, existUser) {
        if (err) throw err;
        
        res.json(existUser);
    });
}

module.exports.getUsersNames = function(req, res) {
    var query = req.params.query;
    
    User.find({'displayName': new RegExp('^' + query, "i")}, {displayName: 1, uid: 1}, function(err, profiles) {
        if (err || profiles.length == 0) return res.status(404).send({ message: 'Not found.' });
        res.send(profiles);
    });
}

module.exports.editProfile = function(req, res) {
    var query = req.query;

    User.findById(query._id, function(err, profile) {
        if(err) throw err;

        for(var prop in query){
            if(profile[prop] && query[prop]) {
                profile[prop] = req.query[prop];
            }
        }

        profile.save(function(err, doc) {
            if(err) throw err;
            res.json(doc);
        })
    });
}

module.exports.deleteProfile = function(req, res) {
    var id = req.query.id;
    User.findById(id, function(err, profile) {
        if(err) throw err;
        profile.remove(function(err, doc) {
            if(err) throw err;
            res.json(doc);
        });
    });
}
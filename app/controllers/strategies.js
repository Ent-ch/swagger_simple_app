/* global process */
var passport = require('passport'),
    User = require('../models/user'),
    configAuth = require('../config/auth'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({$or: [{'email': email}, {'uid': req.body.uid.toUpperCase()}]}, function(err, user) {
                if (err) {
                    return done(err);
                }
    
                if (user) {
                    return done(null, false, 
                        req.signMessage = (user.email == email) ? 'That email is already taken.' : 'That UID is already taken.');
                }
                var newUser = new User();
                newUser.displayName =  req.body.displayName,
                newUser.uid =  req.body.uid,
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err) {
                        req.signMessage = err.errors;
                        return done(err);
                    }
                    return done(null, newUser);
                });
            });    
        });
    }));
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({$or: [{'email': email}, {'uid': email.toUpperCase()}]}, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.loginMessage = 'No user found.');
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.loginMessage = 'Wrong password.');
                }
                return done(null, user);
            });
        });
    }));
    

};
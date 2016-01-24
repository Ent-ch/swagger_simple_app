'use strict';

var User        = require('../models/user'),
    nodemailer  = require('nodemailer'),
    config  = require('../config'),
    async       = require('async'),
    crypto      = require('crypto');

module.exports = {
    forgot:     forgot,
    reset:      reset
};

function forgot(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    return res.status(401).send({ message: 'No account with that email address exists' });
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: config.gmailAcc
            });
            var mailOptions = {
                to: user.email,
                from: 'rozabi@pascalium.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function(err) {
                done(err, user.email);
            });
        }
    ], function(err, email) {
        res.status(200).send({ message: 'An e-mail has been sent to ' + email + ' with further instructions' });
    });
}

function reset(req, res) {
    async.waterfall([
        function(done) {
            console.log(req.params);

            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    return res.status(401).send({ message: 'Password reset token is invalid or has expired' });
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err, user) {
                    done(err, user);
                });
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: config.gmailAcc
            });
            var mailOptions = {
                to: user.email,
                from: 'rozabi@pascalium.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                done(err);
            });
        }
    ], function(err) {
        return res.status(200).send({ message: 'Success! Your password has been changed' });
    });
}
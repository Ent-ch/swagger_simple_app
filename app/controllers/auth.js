'use strict';

var User = require('../models/user'),
    Temp = require('../models/temp'),
    config = require('../config').auth,
    request = require('request'),
    qs = require('querystring'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    swaggerValidate = require('swagger-validate'),
    passport = require('passport'),
    strategies = require('./strategies')(passport),
    async = require('async'),
    swAuth = require('../models/sw_models/auth');

var twitterAPI = require('node-twitter-api');
    // Recaptcha = require('node-recaptcha2').Recaptcha;
    
module.exports = {
    signUp:     signUp,
    logIn:      logIn,
    facebook:   facebook,
    twitter:    twitter,
    google:     google,
    checkUid: checkUid,
    linkedIn:   linkedIn
};

function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

function signUp (req, res, next) {
    var error = swaggerValidate.model(req.body, swAuth.localSign);
    if (error) {
        return res.status(400).send({ message: error.message });
    }
    
/*
    var data = {
        remoteip:  req.connection.remoteAddress,
        response:  req.body['capcha']
    };
    var recaptcha = new Recaptcha(config.recptha.siteKey, config.recptha.secret, data);
    
    recaptcha.verify(function(success, error_code) {
        if (success) {
        }
        else {
            console.log(error_code);
            return res.status(401).send({ message: 'Invalid captcha' });
        }
    });
        
*/
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send({ message: req.signMessage }); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({ token: createJWT(user) });
        });
    })(req, res, next);

}

function logIn(req, res, next) {
    var error = swaggerValidate.model(req.body, swAuth.localAuth);
    if (error) {
        return res.status(400).send({ message: error.message });
    }

    passport.authenticate('local-login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send({ message: req.loginMessage }); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({ token: createJWT(user) });
        });
    })(req, res, next);
}

function checkUid(req, res) {
    // console.log(req.params);
    User.findOne({ 'uid':  req.params.uid.toUpperCase() }, function(err, user) {
        if (err) {
            return res.status(500).send({ message: 'Something wrong' });
        }
        if (user) {
            return res.status(402).send({ message: 'Used' });
        } else {
            return res.send({ message: 'Ok' });
        }
    });
}

function findUser(user, field, callback) {
    var error = new TypeError('User not found'),
        searchValue = user[field];
        
    error.status = 400;
    callback = (typeof callback === 'function') ? callback : function() {};
    
    if (user.id) {
        User.findById(user.id, function(err, user) {
            if (err) return callback(err, null); 
            if (!user) {
                return callback(error, null);
            }
            if (user[field] != searchValue) {
                error.message = 'This is account not belongs to you' 
                return callback(error, null);
            } else {
                return callback(null, user);
            }
        });
    } else {
        var search = {},
            high = 1000, low = 0;
            
        search[field] = searchValue;
        User.findOne({$or: [search, {'email': user.email}]}, function(err, existingUser) {
            if (err) return callback(err, null);
            if (!existingUser) {
                user.uid = 'user' + Math.round(Math.random() * (high - low) + low);
                var newUser = new User(user);
                newUser.save(function(err) {
                    if (err) return callback(err, null);
                    return callback(null, newUser);
                });
            } else {
                if (existingUser[field] != searchValue) {
                    error.message = 'You sign up with other acount';
                    return callback(error, null);     
                }
                return callback(null, existingUser);
            }
        });
    }
}

function facebook(req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');

    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.facebookAuth.clientSecret,
        redirect_uri: req.body.redirectUri
    };
    async.waterfall([
        function(done) {
            request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
                if (response.statusCode !== 200) {
                    return res.status(500).send({ message: accessToken.error.message });
                }
        
                request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
                    if (response.statusCode !== 200) {
                        return res.status(500).send({ message: profile.error.message });
                    }
                    done(err, profile);
                });
            });
        },
        function(profile, done) {
            var user = {id: req.user};
            user.facebook = profile.id;
            user.email = profile.email;
            user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            user.displayName = profile.name;

            findUser(user, 'facebook', function(err, user) {
                done(err, user); 
            });
        },
        function(user, done) {
            var token = createJWT(user);
            res.send({ token: token });
        },

    ], function(err) {
        console.log(err);
        res.status(err.status || 500).send({ message: err.message });
    });    

}

function google(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.googleAuth.clientSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    async.waterfall([
        function(done) {
            request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
                var accessToken = token.access_token;
                var headers = { Authorization: 'Bearer ' + accessToken };
        
                request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
                    if (profile.error) {
                        return res.status(500).send({message: profile.error.message});
                    }
                    done(err, profile);
                });
            });
        },
        function(profile, done) {
            var user = {id: req.user};
            user.google = profile.sub;
            user.picture = profile.picture.replace('sz=50', 'sz=200');
            user.displayName = profile.name;
            user.email = profile.email;

            findUser(user, 'google', function(err, user) {
                done(err, user); 
            });
        },
        function(user, done) {
            var token = createJWT(user);
            res.send({ token: token });
        },

    ], function(err) {
        console.log(err);
        res.status(err.status || 500).send({ message: err.message });
    });    
}

function linkedIn(req, res) {
    var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
    var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.linkedInAuth.consumerSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    async.waterfall([
        function(done) {
            request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
                if (response.statusCode !== 200) {
                    return res.status(response.statusCode).send({ message: body.error_description });
                }
                var params = {
                    oauth2_access_token: body.access_token,
                    format: 'json'
                };
        
                request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {
                    done(err, profile);
                });
            });
        },
        function(profile, done) {
            var user = {id: req.user};
            user.linkedin = profile.id;
            user.picture = profile.pictureUrl;
            user.displayName = profile.firstName + ' ' + profile.lastName;
            user.email = profile.emailAddress;

            findUser(user, 'linkedin', function(err, user) {
                done(err, user); 
            });
        },
        function(user, done) {
            var token = createJWT(user);
            res.send({ token: token });
        },

    ], function(err) {
        console.log(err);
        res.status(err.status || 500).send({ message: err.message });
    });    
}


function twitter(req, res) {
    var twitter = new twitterAPI({
        consumerKey: config.twitterAuth.consumerKey,
        consumerSecret: config.twitterAuth.consumerSecret,
        callback: req.body.redirectUri
    });
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
        twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
            if (error) {
                console.log("Error getting OAuth request token : " + error);
                return res.status(500).send({ message: 'Twitter error' });
            } 
            results.oauth_token = requestToken;
            results.oauth_token_secret = requestTokenSecret;
            var ts = new Temp({'token': requestToken, 'token_secret': requestTokenSecret});
            ts.save();
            res.send(results);
        });    
    } else {
        async.waterfall([
            function(done) {
                Temp.findOne({ token: req.body.oauth_token }, function(err, existingToken) {
                    if (err) {
                        console.log("Error getting saved token: " + err);
                        return res.status(500).send({ message: 'Twitter error' });
                    } 
                    twitter.getAccessToken(existingToken.token, existingToken.token_secret, req.body.oauth_verifier,
                    function(error, accessToken, accessTokenSecret, results) {
                        if (error) {
                            console.log("Error getting getAccessToken: " + error);
                            return res.status(500).send({ message: 'Twitter error' });
                        }
                        twitter.verifyCredentials(accessToken, accessTokenSecret, function(err, profile, response) {
                            if (err) {
                                console.log("Error getting verifyCredentials: " + err);
                                return res.status(500).send({ message: 'Twitter error' });
                            } 
                            done(err, profile);
                        }, {include_email: true});
                    });
                });
            },
            function(profile, done) {
                console.log(profile);
                var user = {id: req.user};
                user.twitter = profile.id;
                user.displayName = profile.name;
                user.email = profile.email;
                user.picture = profile.profile_image_url.replace('_normal', '');
    
                findUser(user, 'twitter', function(err, user) {
                    done(err, user); 
                });
            },
            function(user, done) {
                var token = createJWT(user);
                res.send({ token: token });
            },
    
        ], function(err) {
            console.log(err);
            res.status(err.status || 500).send({ message: err.message });
        });    
    }
}

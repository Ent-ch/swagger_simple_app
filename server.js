/* global __dirname */
'use strict';

var express         = require('express'),
    mongoose        = require('mongoose'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    config          = require('./app/config'),
    path            = require('path');

var app          = express(),
    swagger      = require('swagger-node-express').createNew(app),
    server       = require('http').Server(app);
    // io           = require('socket.io')(server);

var passport = require('passport');

/**
 * Connect to mongodb
 */
var connect = function () {
    mongoose.connect(config.db.url, config.db.options);
};
connect();
mongoose.connection.on('error', function() {console.log('Error with mongoose connection')});
mongoose.connection.on('disconnected', connect);

app.use(morgan('dev'));
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(function(err, req, res, next) {
    if(!err) return next();
    // console.log({error: err});
    res.status(415);
    res.send({message: 'Bad incoming data!'});
});

app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './public/client')));

require('./swagger')(app, swagger, config.applicationUrl);

app.listen(config.port);
console.log('Server started at port: ' + config.port);
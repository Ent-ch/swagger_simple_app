'use strict';

var url = require('url'),
    fs = require('fs'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    configAuth = require('./app/config').auth;

module.exports = function (app, swagger, applicationUrl) {
    /**
     * Adding models and methods to RESTFul service
     */
    var models = {"models": {}},
        modelPath = 'app/models/sw_models';
    require("fs").readdirSync(modelPath).forEach(function (file) {
        var outMod = require('./' + modelPath + '/' + file);
        console.log('Load models from - ' + file);
        for (var atr in outMod) {
            models.models[atr] = outMod[atr];
        }
    });
    swagger.addModels(models);

    var routePath = 'app/routes';
    require("fs").readdirSync(routePath).forEach(function (file) {
        console.log('Load routes from - ' + file);
        var outRoute = require('./' + routePath + '/' + file).routes;

        for (var atr in outRoute) {
            var metod = outRoute[atr].spec.method;
            switch (metod) {
                case 'POST':
                    swagger.addPost(outRoute[atr]);
                    break;
                case 'GET':
                    swagger.addGet(outRoute[atr]);
                    break;
                case 'PUT':
                    swagger.addPut(outRoute[atr]);
                    break;
                case 'DELETE':
                    swagger.addDelete(outRoute[atr]);
                    break;
                default:
                    break;
            }
        }
    });

    swagger.addValidator(
        function validate(req, path, httpMethod) {
            req.user = undefined;
            if (req.headers.authorization) {
                var token = req.headers.authorization;
                var payload = undefined;
                try {
                    payload = jwt.decode(token, configAuth.TOKEN_SECRET);
                }
                catch (err) {
                    console.log('False token: ' + token);
                }
                if (payload && payload.exp >= moment().unix()) {
                    req.user = payload.sub;
                } else {
                    console.log('Token has expired');
                }

            }
            if (path.indexOf('auth') === 1) {
                return true;
            } else if (req.user) {
                return true;
            }
            return false;
        }
    );

    swagger.setApiInfo({
        title: "Simple API",
    });

    swagger.configureSwaggerPaths('', 'api-docs', '');
    swagger.configure(applicationUrl, "0.0.1");

};

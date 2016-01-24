var restoreCtrl = require('../controllers/restorePass'),
    swagger     = require("swagger-node-express");

exports.routes = {
    forgot: {
        spec: {
            description : "Forgot",
            path : "/auth/restore/forgot",
            method: "POST",
            parameters : [
                {
                    paramType: "body",
                    name: "users email address",
                    description: "Users email",
                    required: true,
                    type: "forgotPass"
                }
            ],
            summary : "Get token to change password",
            nickname : "forgot",
            produces : ["application/json", "application/xml"]
        },
        action: restoreCtrl.forgot
    },

    reset: {
        spec: {
            description : "Reset",
            path : "/auth/restore/reset/{token}",
            method: "POST",
            parameters : [
                swagger.pathParam("token", "Token of the password restore", "Token fom email"),
                {
                    paramType: "body",
                    name: "users password",
                    description: "Users password",
                    required: true,
                    type: "resetPass"
                }
            ],
            summary : "Reset password",
            nickname : "reset",
            produces : ["application/json", "application/xml"]
        },
        action: restoreCtrl.reset
    }
};
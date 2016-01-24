var authentication  = require('../controllers/auth'),
    swagger = require("swagger-node-express");

exports.routes = {
    localSignUp: {
        spec: {
            description : "Sign Up",
            path : "/auth/signup",
            method: "POST",
            parameters : [
                {
                    paramType: "body",
                    description: "Users email and pass",
                    required: true,
                    type: "localSign"
                }
            ],
            summary : "Sign Up",
            nickname : "sign-up",
            type: 'tokenResponce',
            produces : ["application/json"]
        },
        action: authentication.signUp
    },

    localLogin: {
        spec: {
            description : "Login",
            path : "/auth/login",
            method: "POST",
            parameters : [
                {
                    paramType: "body",
                    description: "Users email and pass",
                    required: true,
                    type: "localAuth"
                }
            ],
            summary : "Login",
            nickname : "user-login",
            type: 'tokenResponce',
            produces : ["application/json"]
        },
        action: authentication.logIn
    },

    twitterLogin: {
        spec: {
            description : "Twitter auth",
            path : "/auth/twitter",
            method: "POST",
            parameters : [
                {
                    paramType: "body",
                    description: "Twitter credentials",
                    required: true,
                    type: "twitterAuth"
                }
            ],
            summary : "Twitter",
            nickname : "Twitter",
            type: 'tokenResponce',
            produces : ["application/json"]
        },
        action: authentication.twitter
    },

    googleLogin: {
        spec: {
            description: "Google auth",
            path: "/auth/google",
            method: "POST",
            parameters: [
                {
                    paramType: "body",
                    description: "Google credentials",
                    required: true,
                    type: "socialAuth"
                }
            ],
            summary: "Google",
            nickname: "Google",
            type: 'tokenResponce',
            produces : ["application/json"]
        },
        action: authentication.google
    },

    facebookLogin: {
        spec: {
            description : "Facebook auth",
            path : "/auth/facebook",
            method: "POST",
            parameters : [
                {
                    paramType: "body",
                    description: "Facebook credentials",
                    required: true,
                    type: "socialAuth"
                }
            ],
            summary : "Facebook",
            nickname : "Facebook",
            type: 'tokenResponce',
            produces : ["application/json"]
        },
        action: authentication.facebook
    },

    linkedInLogin: {
        spec: {
            description : "linkedIn auth",
            path : "/auth/linkedin",
            method: "POST",
            parameters : [
                {
                    paramType: "body",
                    description: "linkedIn credentials",
                    required: true,
                    type: "socialAuth"
                }
            ],
            summary : "linkedIn",
            nickname : "linkedIn",
            type: 'tokenResponce',
            produces : ["application/json"]
        },
        action: authentication.linkedIn 
    },
    checkUid: {
        spec: {
            // description : "Operations about user",
            path : "/auth/check/uid/{uid}",
            method: "GET",
            summary : "Uid for check",
            notes : "Returns status for ID: 200 - ok, 403 - bad, 402 - used",
            // type : "string",
            nickname : "checkUid",
            produces : ["application/json"],
            parameters : [swagger.pathParam("uid", "Uid for check", 'string')]
        },
        action: authentication.checkUid
    },

};
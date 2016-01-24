var userCtrl = require('../controllers/users'),
    swagger = require("swagger-node-express");

exports.routes = {
    getAll: {
        spec: {
            description : "Operations about users",
            path : "/users",
            method: "GET",
            summary : "Find users",
            type : "profile",
            nickname : "getUsers",
            produces : ["application/json"],
        },
        action: userCtrl.getUsers
    },
    getUsersUids: {
        spec: {
            description : "Return short user info",
            path : "/users/find/{query}",
            method: "GET",
            summary : "Find users by uid or name",
            type : "shortUserInfo",
            nickname : "getUsersUids",
            produces : ["application/json"],
            parameters : [swagger.pathParam("query", "param for users search", 'string')]
        },
        action: userCtrl.getUsersNames
    },
    getProfile: {
        spec: {
            description : "Operations about user",
            path : "/users/{id}",
            method: "GET",
            summary : "Find users by ID",
            type : "profile",
            nickname : "getProfile",
            produces : ["application/json"],
            parameters : [swagger.pathParam("id", "ID of the users to return", 'string')]
        },
        action: userCtrl.getProfile
    },
/*
    editProfile: {
        spec: {
            path : "/users/{id}",
            summary : "Update an existing users",
            method: "PUT",
            parameters : [
                swagger.pathParam("id", "users ID to update", "Profile"),
                {
                    name: "Profile",
                    description: "JSON object representing the users to edit",
                    required: true,
                    type: "profile",
                    paramType: "body"
                }],
            nickname : "editProfile"
        },
        action: userCtrl.editProfile
    },
    deleteProfile: {
        'spec': {
            path : "/users/{id}",
            summary : "Delete an existing users",
            method: "DELETE",
            parameters : [
                swagger.pathParam("id", "user ID to delete", "string")
            ],
            type : "profile",
            nickname : "deleteProfile"
        },
        'action': userCtrl.deleteProfile
    }
    */
};
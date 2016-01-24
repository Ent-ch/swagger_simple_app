var swagger = require("swagger-node-express"),
    profileCtrl = require('../controllers/profile');


exports.routes = {
    setPrivacy: {
        spec: {
            path : "/profile/Privacy",
            summary : "Update the profile Privacy",
            method: "PUT",
            parameters : [
                {
                    description: "JSON object representing the profile to edit",
                    required: true,
                    type: "Profile",
                    paramType: "body"
                }],
            nickname : "setPrivacy"
        },
        action: profileCtrl.setPrivacy
    },
    getProfile: {
        spec: {
            path : "/profile",
            method: "GET",
            summary : "Get profile",
            type : "Profile",
            nickname : "getProfile",
            produces : ["application/json"],
            parameters : []
        },
        action: profileCtrl.getProfile
    },
    editProfile: {
        spec: {
            path : "/profile",
            summary : "Update the profile",
            method: "PUT",
            parameters : [
                {
                    name: "Profile",
                    description: "JSON object representing the profile to edit",
                    required: true,
                    type: "Profile",
                    paramType: "body"
                }],
            nickname : "editProfile"
        },
        action: profileCtrl.editProfile
    },
    deleteProfile: {
        'spec': {
            path : "/profile",
            summary : "Delete the profile",
            method: "DELETE",
            parameters : [],
            // type : "Profile",
            nickname : "deleteProfile"
        },
        'action': profileCtrl.deleteProfile
    },
    froseProfile: {
        'spec': {
            path : "/profile/freeze",
            summary : "Freeze the profile",
            method: "PUT",
            parameters : [],
            // type : "Profile",
            nickname : "froseProfile"
        },
        'action': profileCtrl.freezeProfile
    },
    authUnlink: {
        spec: {
            description : "Unlink social network",
            path : "/profile/unlink",
            method: "POST",
            summary : "Unlink social network",
            nickname : "profile",
            parameters : [
                {
                    paramType: "body",
                    name: "provider",
                    description: "Unlink network",
                    required: true,
                    type: "provider"
                }
            ]
        },
        action: profileCtrl.authUnlink
    },
    getStatistics: {
        spec: {
            description : "statistics data",
            path : "/profile/statistics/{data}",
            method: "GET",
            summary : "Get statistics data",
            // type : "Profile",
            nickname : "getStatistics",
            produces : ["application/json"],
            parameters : [swagger.pathParam("data", "type data to return", "string")]
        },
        action: function(req, res) {
            var typeData = req.params.data;
            switch (typeData) {
                case 'published':
                    return res.send([{month:11, year:2015, count:3}, {month:12, year:2015, count:5}, ]);
                    break;
                case 'visitors':
                    return res.send([{month:11, year:2015, count:12}, {month:12, year:2015, count:5}, ]);
                    break;
                default:
                    return res.send('No type selected');
                    break;
            }
        }
    },
    
};
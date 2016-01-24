'use strict';

var upload = require('../controllers/upload');

exports.routes = {
    uploadFile: {
        spec: {
            description : "Operations about profile",
            path : "/upload",
            method: "POST",
            summary : "File upload",
            notes : "File upload",
            type : "File",
            nickname : "uploadFile",
            produces : ["application/json", "application/xml"],
            consumes: ["multipart/form-data"],
            parameters : [
                {
                    "name": "file",
                    "paramType": "form",
                    "required": true,
                    "allowMultiple": true,
                    "type": "file"
                }
            ]
        },
        action: upload
    }
};
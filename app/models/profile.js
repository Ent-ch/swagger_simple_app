'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var profileSchema = mongoose.Schema({
	distributionLists: [{
        groupName: {
            type : String
        },
        members: [{
            type : Schema.ObjectId,
            ref : 'User'
        }],
	}],
    balance : {
        type: Number
    },
    privacy: {
        showProfile: {
            everybody: {
                type: Boolean,
                default: true
            },
            showFor: [],
            hideFor: []
        },
        showMemos: {
            everybody: {
                type: Boolean,
                default: true
            },
            showFor: [],
            hideFor: []
        },
    },

});

module.exports = mongoose.model('Profile', profileSchema);
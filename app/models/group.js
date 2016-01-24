'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var groupSchema = mongoose.Schema({
    title: {
        type: String,
    },
	members: [{
		type : Schema.ObjectId,
		ref : 'User'
	}],

});

module.exports = mongoose.model('Group', groupSchema);
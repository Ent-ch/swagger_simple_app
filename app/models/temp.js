'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var tempSchema = mongoose.Schema({
    token: {
        type: String,
		unique: true,
    },
    token_secret: {
        type: String,
    },

});

module.exports = mongoose.model('Temp', tempSchema);
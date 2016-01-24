'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var taxonomySchema = mongoose.Schema({
    title: {
        type: String,
		unique: true,
    },

});

module.exports = mongoose.model('Taxonomy', taxonomySchema);
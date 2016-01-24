'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var articleSchema = mongoose.Schema({
    aid : {
        type: String,
        unique: true,
        uppercase: true
    },
    uid: {
        type : Schema.ObjectId,
        ref : 'User'
    },
    title: {
        type: String
    },
    text: {
        type: String
    },
    summary: {
        type: String
    },
    dateCreted: {
        type: Date,
        default: Date.now
    },
    orderPos: {
        type: Number,
        default: 0
    },
    revision: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'D'
    },
    comments: [{
        body: {
            type : String
        },
        author: {
            type : Schema.ObjectId,
            ref : 'User'
        },
        createdAt: {
            type : Date,
            default : Date.now
        },
        startPos: Number,
        endPos: Number,
    }],
    tags: {
        type: Array
    }
});

articleSchema.pre('save', function(next) {
    // var article = this;

    // article.date = new Date();

    // var defaultRev = '**',
    //     firstUpdateRev = '*A';

    // switch (article.revision) {
    //     case null:
    //         article.revision = defaultRev;
    //         break;
    //     case defaultRev:
    //         article.revision = firstUpdateRev;
    //         break;
    //     case firstUpdateRev:
    //         article.revision = increaseLetter(article.revision);
    //         break;
    //     default:
    //         article.revision = increaseLetter(article.revision);
    //         break;
    // }

    // function increaseLetter(context) {
    //     var firstLetter = context[0],
    //         lastLetter = context[1];

    //     if(context === '*Z') {
    //         firstLetter = 'A';
    //         lastLetter = 'A';
    //         return firstLetter + lastLetter;
    //     }

    //     if(lastLetter === 'Z') {
    //         firstLetter = String.fromCharCode(firstLetter.charCodeAt(firstLetter.length-1)+1);
    //         lastLetter = 'A';
    //         return firstLetter + lastLetter;
    //     }

    //     lastLetter = String.fromCharCode(lastLetter.charCodeAt(lastLetter.length-1)+1);
    //     return firstLetter + lastLetter;
    // }

    return next();
});

module.exports = mongoose.model('Article', articleSchema);
'use strict';

var Article = require('../models/article'),
    User = require('../models/user'),
    swaggerValidate = require('swagger-validate'),
    swAuth = require('../models/sw_models/article');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.articles = function (req, res) {
    Article.find({})
    .sort('orderPos')
    .exec(function (err, articles) {
        if (err) return res.status(500).send({ message: err.message });
        res.send(articles);
    });
}

module.exports.getArticlesByUid = function (req, res) {
    var uid = req.params.uid;
    User.findOne({'uid': uid.toUpperCase()})
    .sort('orderPos')
    .exec(function (err, autor) {
        if (err || !autor) return res.status(500).send({ message: err.message });
        Article.find({uid: autor._id}, function (err, articles) {
            if (err) return res.status(500).send({ message: err.message });
            return res.send(articles);
        });
    })
}

module.exports.getArticle = function (req, res) {
    var id = req.params.id,
        objId = new ObjectId( (id.length < 12) ? "123456789012" : id ),
        searchParam = [{'_id': objId}, {'aid': id.toUpperCase()}, {'title': id}];

    Article.findOne({$or: searchParam}, function(err, article) {
        if (err || !article) return res.status(404).send({ message: 'Not found.' });
        return res.send(article);
    });
}

module.exports.getArticlesTitles = function (req, res) {
    var title = req.params.title;

    Article.find({'title': new RegExp('^' + title, "i")}, {'title': 1, 'aid': 1}, function(err, article) {
        if (err || article.length == 0) return res.status(404).send({ message: 'Not found.' });
        return res.send(article);
    });
}

// module.exports.getArticle = function (req, res) {
//     var id = req.params.id;
//     Article.findById(id, function(err, article) {
//         if (err) return res.status(500).send({ message: err.message });
//         return res.send(article);
//     });
// }

module.exports.addArticle = function (req, res) {
    var data = req.body,
        error = swaggerValidate.model(data, swAuth.Article);
    if (error) {
        return res.status(400).send({ message: error.message });
    }
    data.uid = req.user;
    var article = new Article(data);
    article.save(function(err, doc) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        return res.send(doc);
    });
}

module.exports.editArticle = function (req, res) {
    var id = req.params.id,
        data = req.body,
        error = swaggerValidate.model(data, swAuth.Article);

    if (error) {
        return res.status(400).send({ message: error.message });
    }

    Article.findById(id, function(err, article) {
        if(err) return res.status(500).send({ message: err.message });

        if(!article) return res.status(400).send({ message: 'Article not found' });

        for(var elem in article){
            if(data[elem]) {
                article[elem] = data[elem];
            }
        }
        article.save(function(err, doc) {
            if(err) return res.status(500).send({ message: err.message });
            return res.send(doc);
        })
    });
}

module.exports.deleteArticle = function (req, res) {
    var id = req.params.id;
    Article.findById(id, function(err, article) {
        if(err || !article) return res.status(404).send({ message: 'Not found' });
        article.remove(function(err, doc) {
            if(err) return res.status(500).send({ message: err.message });
            res.send({ message: 'Ok' });
        });
    });
}
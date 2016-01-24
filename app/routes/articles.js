var articleCtrl = require('../controllers/articles'),
    swagger = require("swagger-node-express"),
    swe = swagger.errors;

exports.routes = {
    getArticles: {
        spec: {
            description : "List all articles",
            path : "/articles",
            method: "GET",
            summary : "List all articles",
            type : "Article",
            nickname : "getArticles",
            produces : ["application/json"],
            parameters : [],
        },
        action: articleCtrl.articles
    },
    getArticlesByUid: {
        spec: {
            description : "Operations about articles",
            path : "/articles/autor/{uid}",
            method: "GET",
            summary : "Find article by autor ID",
            type : "Article",
            nickname : "getArticlesByUid",
            produces : ["application/json"],
            parameters : [swagger.pathParam("uid", "Uid of the articles autor", "string")],
            responseMessages : [swe.invalid('uid'), swe.notFound('article')]
        },
        action: articleCtrl.getArticlesByUid
    },
    getArticlesTitles: {
        spec: {
            path : "/articles/titles/{title}",
            method: "GET",
            summary : "Find articles titles",
            type : "ArticleTitles",
            nickname : "getArticlesTitles",
            produces : ["application/json"],
            parameters : [swagger.pathParam("title", "title of the article", "string")],
        },
        action: articleCtrl.getArticlesTitles
    },
    getArticle: {
        spec: {
            description : "Find article by ID or AID or title",
            path : "/articles/{id}",
            method: "GET",
            summary : "Find article by ID",
            type : "Article",
            nickname : "getArticle",
            produces : ["application/json"],
            parameters : [swagger.pathParam("id", "ID or AID or title of the article to return", "string")],
        },
        action: articleCtrl.getArticle
    },
    addArticle: {
        spec: {
            path : "/articles",
            summary : "Add a new article",
            method: "POST",
            parameters : [{
                description: "JSON object representing the article to add",
                required: true,
                type: "Article",
                paramType: "body"
            }],
            nickname : "addArticle"
        },
        action: articleCtrl.addArticle
    },
    editArticle: {
        spec: {
            path : "/articles/{id}",
            summary : "Update an existing article",
            method: "PUT",
            parameters : [
                swagger.pathParam("id", "article ID to update", "string"),
                {
                    description: "JSON object representing the article to edit",
                    required: true,
                    type: "Article",
                    paramType: "body"
            }],
            type : "Article",
            nickname : "editArticle"
        },
        action: articleCtrl.editArticle
    },
    deleteArticle: {
        spec: {
            path : "/articles/{id}",
            // notes : "Delete an existing article",
            summary : "Delete an existing article",
            method: "DELETE",
            parameters : [
                swagger.pathParam("id", "article ID to delete", "string"),
            ],
            // responseMessages : [swe.invalid('input')],
            type : "string",
            nickname : "deleteArticle"
        },
        'action': articleCtrl.deleteArticle
    }
};
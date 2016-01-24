'use strict';

var convert = require('./convertToPDF'),
    multer  = require('multer'),
    mime    = require('mime'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var fileFormat      = '.' + mime.extension(file.mimetype),
                validFormats    = ['.doc', '.docx', '.xls', '.pdf'],
                fileName        = 'file-' + Date.now() + fileFormat;

            if(validFormats.indexOf(fileFormat) >= 0) cb(null, fileName);
        }
    }),
    limits = {
        fileSize: 10 * 1024 * 1024
    },
    multerUpload = multer({storage: storage, limits: limits}).single('file');

function upload(req, res) {
    multerUpload(req, res, function(err) {
        if(err) return res.status(500).send({error: 'Something wrong with file uploading'}); // throw err;

        if(!req.file) return res.status(500).send({error: 'File is not exist'});

        var path = req.file.path;
        convert(path, res);
    });
}

module.exports = upload;
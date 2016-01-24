'use strict';

var unoconv = require('unoconv'),
    fs = require('fs');

module.exports = convertor;

function convertor(path, res) {
    unoconv.convert(path, 'pdf', function (err, result) {
        if(err) return res.status(400).send({error: 'Something wrong with file converting'});

        var pathPDF = path.substr(0, path.lastIndexOf('.')) + '.pdf';
        fs.writeFile(pathPDF, result);

        var callback = {
            path: path,
            pathPDF: pathPDF
        };

        return res.status(200).json(callback);
    });
}
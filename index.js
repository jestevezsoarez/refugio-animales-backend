'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.connect('mongodb://localhost:27017/refugio', (err, resp) => {
    if (err)
        throw err;
    else {
        console.log('La conexión con la base refugio se hizo correctamente!');
        app.listen(port, () => {
            console.log('El servidor local con Node y Express esta ejecutandose');
        });
    }
});
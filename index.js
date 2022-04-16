'use strict'

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/refugio', (err, resp) => {
    if (err)
        throw err;
    else
        console.log('La conexión con la base refugio se hizo correctamente!');
});
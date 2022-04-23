'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');

// middlewares de body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// configurar cabeceras y cors


// rutas base
app.use('/api', user_routes); // le pongo el prefijo /api, sino quiero prefijo pongo solo /
app.use('/api', animal_routes);


module.exports = app;
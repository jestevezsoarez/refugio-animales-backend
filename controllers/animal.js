// Modulos
var fs = require('fs');
var path = require('path');

// Modelos
var User = require('../models/user');
var Animal = require('../models/animal');

// Acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de animales',
        user: req.user
    });
}


module.exports = {
    pruebas
};
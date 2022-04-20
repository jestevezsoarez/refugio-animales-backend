'use strict'

// jwt me permite generar un token
var jwt = require('jwt-simple');
// moment me genera un timestamp y permite generar fechas
var moment = require('moment');
var secret = 'clave_secreta_refuguio_animales';

exports.createToken = function(user) {
    // payload es un objeto con el que jwt genera el cifrado
    var payload = {
        sub: user._id, // sub es una propiedad que identifica al id
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix() ,
        exp: moment().add(30, 'days').unix() // el toke expira en 30 dias
    };

    return jwt.encode(payload, secret);
};
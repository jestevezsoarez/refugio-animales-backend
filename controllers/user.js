'use strict'

// Modulos
var bcrypt = require('bcrypt-nodejs');
const user = require('../models/user');

// Modelos
var User = require('../models/user');

// Servicios
var jwt = require('../services/jwt');

// Acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuarios',
        user: req.user
    });
}

function saveUser(req, res) {

    // Crear el objeto usuario
    var user = new User();

    // Recoger los parametros de la peticion
    var params = req.body;
        
    if (params.password && params.name && params.surname && params.email) {

        // Asignar valores al objeto usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
            if (err) {
                res.status(500).send({message: 'El usuario no pudo registrarse'});
            } else {
                // Si no existe el usuario lo guardo en la base
                if (!issetUser) {
                    // Cifrar la constraseña
                    bcrypt.hash(params.password, null, null, function(err, hash) {
                        user.password = hash;

                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({message: 'Error al guardar el usuario'});
                            } else {
                                if(!userStored) {
                                    res.status(404).send({message: 'No se ha registrado el usuario'});
                                } else {
                                    res.status(200).send({user: userStored});
                                }
                            }
                        });
                    })
                } else {
                    res.status(200).send({
                        message: 'El usuario con ese email ya existe'
                    });
                }
            }
        });    
    
    } else {
        res.status(200).send({
            message: 'Faltan datos del usuario'
        });
    }
}

function login(req, res) {
    var params = req.body;

    var email = params.email;
    const password =params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({message: 'Error al comprobar el usuario'});
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {

                        if (params.gettoken)
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        res.status(200).send({user});
                    } else {
                        res.status(404).send({
                            message: 'La contraseña introducida es incorrecta'
                        });
                    }
                })                
            } else {
                res.status(404).send({
                    message: 'El usuario no existe'
                });
            }
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    login
};
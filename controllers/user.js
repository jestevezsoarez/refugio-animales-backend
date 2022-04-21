'use strict'

// Modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

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

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({message: 'No tiene permiso para actualizar el usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar usuario'
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            } else {
                res.status(200).send({user: userUpdated})
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';

    // compruebo que me llegan archivos
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            if (userId != req.user.sub) {
                return res.status(500).send({
                    message: 'No tienes permiso para actualizar el usuario'
                });
            }

            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar usuario'
                    });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar el usuario'
                        });
                    } else {
                        res.status(200).send({user: userUpdated, image: file_name});
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({message: 'Extension no valida y archivo no borrado'});
                } else {
                    res.status(200).send({message: 'Extension no valida'});
                }
            });
        }
    } else {
        res.status(200).send({message: 'No se han subido archivos'});
    }
}


module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage
};
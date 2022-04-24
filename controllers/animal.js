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

function saveAnimal(req, res) {
    var animal = new Animal();
    var params = req.body;    

    if (params.name) {
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub; // id del usuario logueado

        animal.save((err, animalStored) => {
            if (err) {
                res.status(500).send({message: 'Error en el servidor'});
            } else {
                if (!animalStored) {
                    res.status(404).send({message: 'No se ha guardado el animal'});
                } else {
                    res.status(200).send({animal: animalStored});
                }
            }
        });
    } else {
        res.status(200).send({message: 'El nombre del animal es obligatorio'});
    }
}

function getAnimals(req, res) {
    // El find recibe un where, lo paso vacio para que traiga todos los animales
    Animal.find({}).populate({path: 'user'}).exec((err, animals) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!animals) {
                res.status(404).send({
                    message: 'No hay animales'
                });
            } else {
                res.status(200).send({
                    animals
                });
            }
        }
    });
}

function getAnimal(req, res) {
    var animalId = req.params.id;
    Animal.findById(animalId).populate({path: 'user'}).exec((err, animal) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!animal) {
                res.status(404).send({
                    message: 'El animal no existe'
                });
            } else {
                res.status(200).send({
                    animal
                });
            }
        }
    });
}

function updateAnimal(req, res) {
    var animalId = req.params.id;
    var update = req.body;

    // {new: true} para ver el objeto actualizado
    Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!animalUpdated) {
                res.status(404).send({
                    message: 'No se ha actualizado el animal'
                });
            } else {
                res.status(200).send({animal: animalUpdated});
            }
        }
    });
}


module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal
};
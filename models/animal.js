'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var animalSchema = schema({
    name: String,
    description: String,
    year: Number,
    image: String,
    user: {type: schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Animal', animalSchema);
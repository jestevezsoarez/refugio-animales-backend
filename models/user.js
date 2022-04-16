'use strict'

var mongoose = require('mongoose');
var schema = mongoose.schema;

var userSchema = schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String
});

module.exports = mongoose.model('User', userSchema);


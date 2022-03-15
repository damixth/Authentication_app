const users = require('../routes/users');
const auth = require('../routes/userAuth');
const express = require('express');
const error = require('../middleware/error');

module.exports = function(app) {
    
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
}
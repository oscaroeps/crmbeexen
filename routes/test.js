var express = require('express');
var testController = require('../controllers/testController');

var app = express.Router();

app.get('/prueba_test', testController.prueba_test);

module.exports = app;
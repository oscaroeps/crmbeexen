var express = require('express');
var bodyparser = require('body-parser');

var path = require('path');

var mongoose = require('mongoose');
var port = process.env.port || 4201;

var app = express();

var test_routes = require('./routes/test');
var colaborador_routes = require('./routes/colaborador');
var cliente_routes = require('./routes/cliente');
var prospeccion_routes = require('./routes/prospeccion');
var curso_routes = require('./routes/curso');

mongoose.connect('mongodb://127.0.0.1:27017/negocio', { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Servidor corriendo...");
        app.listen(port, function () {
            console.log("En puerto: " + port);
        });
    }
});

app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/', express.static('client/panel', { redirect: false }));

app.use('/api', test_routes);
app.use('/api', colaborador_routes);
app.use('/api', cliente_routes);
app.use('/api', prospeccion_routes);
app.use('/api', curso_routes);

app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('client/panel/index.html'));
});

module.exports = app;
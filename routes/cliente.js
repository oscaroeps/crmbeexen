var express = require('express');
var clienteController = require('../controllers/clienteController');
var auth = require('../middlewares/authenticate');

var app = express.Router();

app.post('/registro_cliente_admin', auth.auth, clienteController.registro_cliente_admin);
app.get('/validar_correo_verificacion/:token', clienteController.validar_correo_verificacion);
app.get('/listar_clientes_admin/:filtro', auth.auth, clienteController.listar_clientes_admin);
app.get('/obtener_datos_cliente_admin/:id', auth.auth, clienteController.obtener_datos_cliente_admin);
app.put('/editar_cliente_admin/:id', auth.auth, clienteController.editar_cliente_admin);

app.get('/listar_clientes_modal_admin/:filtro', auth.auth, clienteController.listar_clientes_modal_admin);

module.exports = app;
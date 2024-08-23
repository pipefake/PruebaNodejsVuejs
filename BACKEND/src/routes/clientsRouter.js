const express = require('express');
const router = express.Router();
const clientsController = require('../controller/clientsController');
const Auth = require('../helpers/Auth');

router.post('/clientes/create', Auth.verifyToken, clientsController.registrarCliente);
router.get('/clientes/consultar', Auth.verifyToken, clientsController.listarClientes);
router.post('/clientes/actualizar:id', Auth.verifyToken, clientsController.actualizarCliente);
router.delete('/clientes/borrar/:id', Auth.verifyToken, clientsController.eliminarCliente);

module.exports = router;
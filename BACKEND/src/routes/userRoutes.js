const express = require('express');
const router = express.Router();
const userContoller = require('../controller/userController');



router.post('/registro', userContoller.agregarUsuario);
router.post('/login', userContoller.iniciarSesion);

module.exports = router;
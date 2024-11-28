const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');  

router.get('/login', AuthController.formLogin);   
router.post('/login', AuthController.login);
router.get('/cadastro', AuthController.formCadastro); 
router.post('/criar-usuario', AuthController.cadastro);
router.get('/logout', AuthController.logout);

module.exports = router;

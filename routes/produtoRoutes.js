
const express = require('express');
const produtoController = require('../controllers/produtoController'); // Certifique-se de que o controlador está correto
const router = express.Router();


router.get('/listaAssai', produtoController.listaAssai);
router.get('/listaMateus', produtoController.listaMateus);
router.get('/listaAtacadao', produtoController.listaAtacadao);

module.exports = router;

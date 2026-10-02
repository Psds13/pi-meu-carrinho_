const express = require('express');
const produtoController = require('../controllers/produtoController'); 
const router = express.Router();

// Render routes
router.get('/', produtoController.buscar);
router.get('/listaAssai', produtoController.listaAssai);
router.get('/listaMateus', produtoController.listaMateus);
router.get('/listaAtacadao', produtoController.listaAtacadao);
router.get('/ofertas', produtoController.ofertas);

module.exports = router;

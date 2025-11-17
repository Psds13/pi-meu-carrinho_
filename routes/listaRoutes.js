const express = require('express');
const ListaController = require('../controllers/listaController');
const router = express.Router();

router.get('/minhas-listas', ListaController.minhasListas);
router.post('/criar', ListaController.criarLista);
router.get('/:id', ListaController.verLista);
router.post('/adicionar-item', ListaController.adicionarItem);
router.post('/remover-item', ListaController.removerItem);
router.post('/marcar-comprado', ListaController.marcarComprado);

module.exports = router;
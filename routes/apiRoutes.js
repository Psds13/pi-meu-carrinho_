const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/products', produtoController.apiListar);
router.get('/products/:id', produtoController.apiBuscarPorId);
router.get('/markets', produtoController.apiMercados);
router.get('/offers', produtoController.apiOfertas);
router.get('/compare', produtoController.apiComparar);
router.get('/compare/:id', produtoController.apiComparar);

// Lists API stubs for frontend integration
router.post('/lists', (req, res) => {
  res.json({ success: true, message: 'Lista criada', data: req.body });
});

router.put('/lists/:id', (req, res) => {
  res.json({ success: true, message: 'Lista atualizada', id: req.params.id, data: req.body });
});

router.delete('/lists/:id', (req, res) => {
  res.json({ success: true, message: 'Lista excluída', id: req.params.id });
});

module.exports = router;

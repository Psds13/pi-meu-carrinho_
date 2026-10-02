const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhookController');

// Middleware de segurança e autenticação para os Webhooks do n8n
const validateN8nWebhookKey = (req, res, next) => {
  const secretKey = process.env.N8N_WEBHOOK_SECRET || 'meucarrinho-n8n-secret-2024';
  const apiKeyHeader = req.headers['x-n8n-api-key'];
  const authHeader = req.headers['authorization'];
  const tokenQuery = req.query.token;

  let providedKey = apiKeyHeader || tokenQuery;
  if (!providedKey && authHeader && authHeader.startsWith('Bearer ')) {
    providedKey = authHeader.split(' ')[1];
  }

  // Permite requisições dev se a chave bater ou fallback dev
  if (providedKey && providedKey === secretKey) {
    return next();
  }

  // Se não fornecido em dev mode, aceita com aviso no log
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Requisição Webhook recebida sem cabeçalho x-n8n-api-key. (Permitido em modo dev).');
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'Acesso não autorizado. Cabeçalho "x-n8n-api-key" ou token inválido.'
  });
};

// Rotas Webhooks
router.get('/status', WebhookController.getStatus);
router.post('/products', validateN8nWebhookKey, WebhookController.updateProducts);
router.post('/prices', validateN8nWebhookKey, WebhookController.updatePrices);
router.post('/offers', validateN8nWebhookKey, WebhookController.updateOffers);
router.post('/notify', validateN8nWebhookKey, WebhookController.processNotification);

module.exports = router;

const staticProdutos = require('../data/produtosData');
const ProdutoModel = require('../models/ProdutoModel');

// In-memory Price History Log & Notifications Queue
const historicoAlteracoesPrecos = [];
const notificacoesEnviadas = [];

class WebhookController {
  // 1. Health check & Integration status
  static getStatus(req, res) {
    res.json({
      success: true,
      service: 'Meu Carrinho - n8n Webhook Integration API',
      status: 'online',
      active_workflows: [
        'Sincronização de Preços de Supermercados',
        'Detecção de Novas Ofertas Relâmpago',
        'Notificação de Queda de Preço de Favoritos'
      ],
      history_logged_count: historicoAlteracoesPrecos.length,
      notifications_sent_count: notificacoesEnviadas.length,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Receber e processar dados de produtos (POST /api/webhooks/products)
  static async updateProducts(req, res) {
    try {
      const { products } = req.body;
      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ success: false, error: 'Payload deve conter um array "products".' });
      }

      let updatedCount = 0;
      products.forEach(pIn => {
        const idx = staticProdutos.findIndex(p => p.id == pIn.id || p.nome.toLowerCase() === pIn.nome.toLowerCase());
        if (idx !== -1) {
          staticProdutos[idx] = { ...staticProdutos[idx], ...pIn };
          updatedCount++;
        } else {
          staticProdutos.push({
            id: pIn.id || Date.now(),
            nome: pIn.nome,
            marca: pIn.marca || 'Marca',
            quantidade_peso: pIn.quantidade_peso || '1 unit',
            categoria: pIn.categoria || 'Mercearia',
            imagem: pIn.imagem || '/image/logo.png',
            mercado_principal: pIn.mercado_principal || 'Atacadão',
            preco_anterior: pIn.preco_anterior || pIn.preco_atual,
            preco_atual: pIn.preco_atual,
            desconto: pIn.desconto || 0,
            precos_mercados: pIn.precos_mercados || {},
            historico_precos: pIn.historico_precos || []
          });
          updatedCount++;
        }
      });

      res.json({
        success: true,
        message: 'Produtos processados e atualizados via n8n com sucesso.',
        processed_count: updatedCount,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. Atualização Automática de Preços & Registro no Histórico (POST /api/webhooks/prices)
  static async updatePrices(req, res) {
    try {
      const { price_updates } = req.body;
      if (!price_updates || !Array.isArray(price_updates)) {
        return res.status(400).json({ success: false, error: 'Payload deve conter um array "price_updates".' });
      }

      const changesDetected = [];

      price_updates.forEach(update => {
        const product = staticProdutos.find(p => p.id == update.product_id || p.nome.toLowerCase().includes(update.nome.toLowerCase()));
        if (product) {
          const oldPrice = product.preco_atual;
          const newPrice = parseFloat(update.novo_preco);
          const mercado = update.supermercado || product.mercado_principal;

          if (oldPrice !== newPrice) {
            // Register price alteration record
            const changeRecord = {
              produto_id: product.id,
              nome: product.nome,
              supermercado: mercado,
              preco_anterior: oldPrice,
              novo_preco: newPrice,
              variacao_percentual: parseFloat((((newPrice - oldPrice) / oldPrice) * 100).toFixed(2)),
              data_alteracao: new Date().toISOString()
            };

            historicoAlteracoesPrecos.push(changeRecord);
            changesDetected.push(changeRecord);

            // Update Product Prices & Calculated Discounts
            product.preco_anterior = oldPrice;
            product.preco_atual = newPrice;
            if (oldPrice > newPrice) {
              product.desconto = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
              product.valor_economizado = parseFloat((oldPrice - newPrice).toFixed(2));
            } else {
              product.desconto = 0;
              product.valor_economizado = 0;
            }

            // Update store price matrix
            if (!product.precos_mercados) product.precos_mercados = {};
            product.precos_mercados[mercado] = newPrice;

            // Push to product history graph timeline
            const monthName = new Date().toLocaleString('pt-BR', { month: 'short' });
            if (!product.historico_precos) product.historico_precos = [];
            product.historico_precos.push({ mes: monthName, preco: newPrice });
          }
        }
      });

      res.json({
        success: true,
        message: 'Preços atualizados e histórico de variação registrado.',
        total_updates: price_updates.length,
        price_changes_detected: changesDetected.length,
        changes: changesDetected,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Receber novas ofertas relâmpago do n8n (POST /api/webhooks/offers)
  static async updateOffers(req, res) {
    try {
      const { offers } = req.body;
      if (!offers || !Array.isArray(offers)) {
        return res.status(400).json({ success: false, error: 'Payload deve conter array "offers".' });
      }

      offers.forEach(off => {
        const prod = staticProdutos.find(p => p.id == off.product_id || p.nome.toLowerCase() === off.nome.toLowerCase());
        if (prod) {
          prod.preco_anterior = parseFloat(off.preco_anterior || prod.preco_anterior || prod.preco_atual * 1.25);
          prod.preco_atual = parseFloat(off.preco_oferta);
          prod.desconto = Math.round(((prod.preco_anterior - prod.preco_atual) / prod.preco_anterior) * 100);
          prod.valor_economizado = parseFloat((prod.preco_anterior - prod.preco_atual).toFixed(2));
        }
      });

      res.json({
        success: true,
        message: 'Ofertas relâmpago sincronizadas com sucesso.',
        offers_updated: offers.length,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 5. Canal de Notificações de Alerta de Preço ativado via n8n (POST /api/webhooks/notify)
  static async processNotification(req, res) {
    try {
      const { user_email, product_id, message, trigger_type } = req.body;

      const notif = {
        id: Date.now(),
        user_email: user_email || 'todos',
        product_id,
        message: message || 'Queda de preço identificada pelo n8n!',
        trigger_type: trigger_type || 'PRICE_DROP_ALERT',
        sent_at: new Date().toISOString()
      };

      notificacoesEnviadas.push(notif);

      res.json({
        success: true,
        message: 'Notificação de alerta registrada para entrega ao usuário.',
        notification: notif
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = WebhookController;

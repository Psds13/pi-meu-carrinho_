const ProdutoModel = require('../models/ProdutoModel');

const produtoController = {
  listaAssai: (req, res) => {
    ProdutoModel.buscarPorMercado('Assaí', (err, produtos) => {
      if (err) {
        return res.status(500).send('Erro ao carregar os produtos do Assaí.');
      }

      produtos.forEach(produto => {
        if (typeof produto.preco !== 'number') {
          produto.preco = parseFloat(produto.preco);
        }
      });

      res.render('listaAssai', { produtos });
    });
  },

  listaMateus: (req, res) => {
    ProdutoModel.buscarPorMercado('Mateus', (err, produtos) => {
      if (err) {
        return res.status(500).send('Erro ao carregar os produtos do Mateus.');
      }

      produtos.forEach(produto => {
        if (typeof produto.preco !== 'number') {
          produto.preco = parseFloat(produto.preco);
        }
      });

      res.render('listaMateus', { produtos });
    });
  },

  listaAtacadao: (req, res) => {
    ProdutoModel.buscarPorMercado('Atacadão', (err, produtos) => {
      if (err) {
        return res.status(500).send('Erro ao carregar os produtos do Atacadão.');
      }

      produtos.forEach(produto => {
        if (typeof produto.preco !== 'number') {
          produto.preco = parseFloat(produto.preco);
        }
      });

      res.render('listaAtacadao', { produtos });
    });
  },
}

module.exports = produtoController;

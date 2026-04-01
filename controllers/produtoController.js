const ProdutoModel = require('../models/ProdutoModel');

const produtoController = {
  listaAssai: async (req, res) => {
    try {
      const produtos = await ProdutoModel.buscarPorMercado('Assaí');
      res.render('listaAssai', { produtos });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { error: 'Erro ao carregar os produtos do Assaí.', user: req.session.user });
    }
  },

  listaMateus: async (req, res) => {
    try {
      const produtos = await ProdutoModel.buscarPorMercado('Mateus');
      res.render('listaMateus', { produtos });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { error: 'Erro ao carregar os produtos do Mateus.', user: req.session.user });
    }
  },

  listaAtacadao: async (req, res) => {
    try {
      const produtos = await ProdutoModel.buscarPorMercado('Atacadão');
      res.render('listaAtacadao', { produtos });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { error: 'Erro ao carregar os produtos do Atacadão.', user: req.session.user });
    }
  },

  buscar: async (req, res) => {
    try {
      const query = req.query.search;
      if (!query) {
        return res.redirect('/');
      }
      const produtos = await ProdutoModel.buscarPorNome(query);
      res.render('produtos', { produtos, query });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { error: 'Erro ao realizar a busca.', user: req.session.user });
    }
  }
};

module.exports = produtoController;


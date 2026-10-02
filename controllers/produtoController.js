const ProdutoModel = require('../models/ProdutoModel');
const staticProdutos = require('../data/produtosData');

const produtoController = {
  // EJS Render Pages
  listaAssai: async (req, res) => {
    try {
      const produtos = await ProdutoModel.listarPorMercado('Assaí');
      res.render('assai', { produtos, user: req.session.user || null });
    } catch (err) {
      console.error(err);
      res.render('assai', { produtos: staticProdutos, user: req.session.user || null });
    }
  },

  listaMateus: async (req, res) => {
    try {
      const produtos = await ProdutoModel.listarPorMercado('Mateus');
      res.render('mateus', { produtos, user: req.session.user || null });
    } catch (err) {
      console.error(err);
      res.render('mateus', { produtos: staticProdutos, user: req.session.user || null });
    }
  },

  listaAtacadao: async (req, res) => {
    try {
      const produtos = await ProdutoModel.listarPorMercado('Atacadão');
      res.render('atacadao', { produtos, user: req.session.user || null });
    } catch (err) {
      console.error(err);
      res.render('atacadao', { produtos: staticProdutos, user: req.session.user || null });
    }
  },

  buscar: async (req, res) => {
    try {
      const query = req.query.search || '';
      const categoria = req.query.categoria || '';
      let produtos = await ProdutoModel.buscarPorNome(query);

      if (categoria && categoria.toLowerCase() !== 'todos') {
        produtos = produtos.filter(p => p.categoria && p.categoria.toLowerCase() === categoria.toLowerCase());
      }

      res.render('produtos', { produtos, query, categoria, user: req.session.user || null });
    } catch (err) {
      console.error(err);
      res.render('produtos', { produtos: staticProdutos, query: req.query.search || '', categoria: '', user: req.session.user || null });
    }
  },

  ofertas: async (req, res) => {
    try {
      const produtos = staticProdutos.filter(p => p.desconto > 0);
      res.render('ofertas', { produtos, user: req.session.user || null });
    } catch (err) {
      console.error(err);
      res.render('ofertas', { produtos: staticProdutos, user: req.session.user || null });
    }
  },

  // REST API Endpoints
  apiListar: async (req, res) => {
    try {
      const { search, category, market, sort } = req.query;
      let list = await ProdutoModel.listarTodos();

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(p => 
          p.nome.toLowerCase().includes(s) || 
          (p.marca && p.marca.toLowerCase().includes(s)) ||
          (p.categoria && p.categoria.toLowerCase().includes(s))
        );
      }

      if (category && category.toLowerCase() !== 'todos') {
        list = list.filter(p => p.categoria && p.categoria.toLowerCase() === category.toLowerCase());
      }

      if (market && market.toLowerCase() !== 'todos') {
        const m = market.toLowerCase();
        list = list.filter(p => 
          (p.mercado_principal && p.mercado_principal.toLowerCase().includes(m)) ||
          (p.mercado_nome && p.mercado_nome.toLowerCase().includes(m)) ||
          (p.precos_mercados && p.precos_mercados[market])
        );
      }

      if (sort === 'maior-desconto') {
        list.sort((a, b) => (b.desconto || 0) - (a.desconto || 0));
      } else if (sort === 'menor-preco') {
        list.sort((a, b) => a.preco_atual - b.preco_atual);
      }

      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  apiBuscarPorId: async (req, res) => {
    try {
      const produto = await ProdutoModel.buscarPorId(req.params.id);
      res.json({ success: true, data: produto });
    } catch (err) {
      res.status(404).json({ success: false, error: 'Produto não encontrado' });
    }
  },

  apiMercados: (req, res) => {
    const mercados = [
      {
        id: 'atacadao',
        nome: 'Atacadão',
        logo: '/image/atacadao-logo2.webp',
        ofertasCount: staticProdutos.filter(p => p.mercado_principal === 'Atacadão' || (p.precos_mercados && p.precos_mercados['Atacadão'])).length,
        faixaPrecos: 'R$ 2,99 - R$ 39,90',
        url: '/atacadao'
      },
      {
        id: 'assai',
        nome: 'Assaí',
        logo: '/image/assaí-logo.png',
        ofertasCount: staticProdutos.filter(p => p.mercado_principal === 'Assaí' || (p.precos_mercados && p.precos_mercados['Assaí'])).length,
        faixaPrecos: 'R$ 1,99 - R$ 39,50',
        url: '/assai'
      },
      {
        id: 'mateus',
        nome: 'Mateus',
        logo: '/image/grupo-mateus-logo.png',
        ofertasCount: staticProdutos.filter(p => p.mercado_principal === 'Mateus' || (p.precos_mercados && p.precos_mercados['Mateus'])).length,
        faixaPrecos: 'R$ 3,45 - R$ 38,25',
        url: '/mateus'
      }
    ];
    res.json({ success: true, data: mercados });
  },

  apiOfertas: (req, res) => {
    const ofertas = staticProdutos.filter(p => p.desconto > 0);
    res.json({ success: true, count: ofertas.length, data: ofertas });
  },

  apiComparar: (req, res) => {
    const id = req.params.id || req.query.id;
    const nome = req.query.nome;
    
    let prod = null;
    if (id) {
      prod = staticProdutos.find(p => p.id == id);
    } else if (nome) {
      const term = nome.toLowerCase();
      prod = staticProdutos.find(p => p.nome.toLowerCase().includes(term));
    }

    if (!prod) {
      prod = staticProdutos[0];
    }

    const precos = prod.precos_mercados || {
      "Atacadão": prod.preco_atual,
      "Assaí": parseFloat((prod.preco_atual * 1.05).toFixed(2)),
      "Mateus": parseFloat((prod.preco_atual * 1.08).toFixed(2))
    };

    const arrayPrecos = Object.entries(precos).map(([mercado, preco]) => ({
      mercado,
      preco: parseFloat(preco)
    })).sort((a, b) => a.preco - b.preco);

    const menorPreco = arrayPrecos[0];
    const maiorPreco = arrayPrecos[arrayPrecos.length - 1];
    const diferenca = parseFloat((maiorPreco.preco - menorPreco.preco).toFixed(2));

    res.json({
      success: true,
      produto: prod,
      comparacao: arrayPrecos,
      menorPreco,
      maiorPreco,
      diferenca
    });
  }
};

module.exports = produtoController;

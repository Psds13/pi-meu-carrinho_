const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Configurações EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'carrinho-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Middleware para variáveis globais
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Importação de Rotas
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const listaRoutes = require('./routes/listaRoutes');
const apiRoutes = require('./routes/apiRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const staticProdutos = require('./data/produtosData');

// Rotas Principais
app.use('/', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/listas', listaRoutes);
app.use('/api/webhooks', webhookRoutes); // n8n Webhook Integration Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.render('index', { 
    user: req.session.user || null,
    produtos: staticProdutos 
  });
});

app.get('/mercados', (req, res) => {
  res.render('pg_mercados', { user: req.session.user || null });
});

app.get('/ofertas', (req, res) => {
  const ofertas = staticProdutos.filter(p => p.desconto > 0);
  res.render('ofertas', { user: req.session.user || null, produtos: ofertas });
});

app.get('/minha-lista', (req, res) => {
  res.render('minhaLista', { user: req.session.user || null });
});

app.get('/favoritos', (req, res) => {
  res.render('favoritos', { user: req.session.user || null });
});

app.get('/perfil', (req, res) => {
  res.render('perfil', { user: req.session.user || null });
});

app.get('/assai', (req, res) => {
  const produtosAssai = staticProdutos.filter(p => 
    p.mercado_principal === 'Assaí' || (p.precos_mercados && p.precos_mercados['Assaí'])
  );
  res.render('assai', { user: req.session.user || null, produtos: produtosAssai });
});

app.get('/atacadao', (req, res) => {
  const produtosAtacadao = staticProdutos.filter(p => 
    p.mercado_principal === 'Atacadão' || (p.precos_mercados && p.precos_mercados['Atacadão'])
  );
  res.render('atacadao', { user: req.session.user || null, produtos: produtosAtacadao });
});

app.get('/mateus', (req, res) => {
  const produtosMateus = staticProdutos.filter(p => 
    p.mercado_principal === 'Mateus' || (p.precos_mercados && p.precos_mercados['Mateus'])
  );
  res.render('mateus', { user: req.session.user || null, produtos: produtosMateus });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    error: 'Erro interno do servidor',
    user: req.session.user || null 
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).render('error', { 
    error: 'Página não encontrada',
    user: req.session.user || null 
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
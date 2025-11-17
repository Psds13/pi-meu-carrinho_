const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'carrinho-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware para variáveis globais
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rotas
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const listaRoutes = require('./routes/listaRoutes');

app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/listas', listaRoutes);

// Rotas principais
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/mercados', (req, res) => {
  res.render('pg_mercados', { user: req.session.user });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    error: 'Erro interno do servidor',
    user: req.session.user 
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).render('error', { 
    error: 'Página não encontrada',
    user: req.session.user 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
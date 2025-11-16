const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da sessão para produção
app.use(session({
    secret: process.env.SESSION_SECRET || 'progSistemasSenac202468',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Database configuration for Vercel
const getDatabase = () => {
    if (process.env.NODE_ENV === 'production') {
        // Usar SQLite em produção na Vercel
        const sqlite3 = require('sqlite3').verbose();
        const dbPath = path.join(__dirname, 'meucarrinho.db');
        return new sqlite3.Database(dbPath);
    } else {
        // Desenvolvimento local
        const sqlite3 = require('sqlite3').verbose();
        const dbPath = path.join(__dirname, 'meucarrinho.db');
        return new sqlite3.Database(dbPath);
    }
};

// Inicializar banco de dados
const initDatabase = () => {
    const db = getDatabase();
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    return db;
};

// Rotas básicas (sem dependências de database inicialmente)
app.get('/', (req, res) => {
    res.redirect('/inicio');
});

app.get('/inicio', (req, res) => {
    res.render('index', { 
        title: 'Meu Carrinho - Início',
        user: req.session.usuario 
    });
});

app.get('/cadastro', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/inicio');
    }
    res.render('auth/cadastro', { 
        title: 'Cadastro - Meu Carrinho',
        erro: null 
    });
});

app.get('/login', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/inicio');
    }
    res.render('auth/login', { 
        title: 'Login - Meu Carrinho',
        erro: null 
    });
});

// Rotas para mercados
app.get('/mateus', (req, res) => {
    res.render('mateus', { 
        title: 'Supermercado Mateus - Ofertas',
        user: req.session.usuario 
    });
});

app.get('/atacadao', (req, res) => {
    res.render('atacadao', { 
        title: 'Atacadão - Ofertas',
        user: req.session.usuario 
    });
});

app.get('/assai', (req, res) => {
    res.render('assai', { 
        title: 'Assaí Atacadista - Ofertas',
        user: req.session.usuario 
    });
});

// Health check para Vercel
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rota de fallback para SPA
app.get('*', (req, res) => {
    res.status(404).render('404', { 
        title: 'Página Não Encontrada',
        user: req.session.usuario 
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err);
    } else {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    }
});

module.exports = app;
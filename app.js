const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes'); 
const session = require('express-session');
const UsuarioModel = require('./models/UsuarioModel');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Servir arquivos estáticos - IMPORTANTE para Vercel
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da sessão (ajustar para produção)
app.use(session({
    secret: process.env.SESSION_SECRET || 'progSistemasSenac202468',
    resave: false, 
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Rotas
app.get('/', (req, res) => {
    res.redirect('/inicio');
});

app.get('/inicio', (req, res) => {
    res.render('index');
});

app.get('/cadastro', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/inicio');
    }
    res.render('auth/cadastro');
});

app.post('/criar-usuario', (req, res) => {
    const { nome, email, senha, confirmPassword } = req.body;

    if (senha !== confirmPassword) {
        return res.render('auth/cadastro', { erro: 'As senhas não coincidem.' });
    }

    UsuarioModel.buscarPorEmail(email, (err, results) => {
        if (err) {
            return res.render('auth/cadastro', { erro: 'Erro ao verificar o e-mail.' });
        }

        if (results.length > 0) {
            return res.render('auth/cadastro', { erro: 'E-mail já cadastrado.' });
        }

        UsuarioModel.criar({ nome, email, senha }, (err) => {
            if (err) {
                return res.render('auth/cadastro', { erro: 'Erro ao criar o usuário.' });
            }
            res.redirect('/login');
        });
    });
});

app.get('/admin', (req, res) => {
    if (!req.session.usuario || req.session.usuario.email !== 'admin@gmail.com') {
        return res.redirect('/login');
    }
    res.render('admin');
});

app.get('/mateus', (req, res) => {
    res.render('mateus');
});

app.get('/atacadao', (req, res) => {
    res.render('atacadao');
});

app.get('/assai', (req, res) => {
    res.render('assai');
});

app.use('/', authRoutes);
app.use('/', produtoRoutes);

// Rota para verificar se o servidor está rodando
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor rodando' });
});

// Middleware de erro para Vercel
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Algo deu errado!',
        error: process.env.NODE_ENV === 'production' ? {} : err 
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err);
    } else {
        console.log(`Servidor rodando na porta ${PORT}`);
    }
});

// Export para Vercel
module.exports = app;
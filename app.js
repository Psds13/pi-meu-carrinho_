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
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// Configuração da sessão
app.use(session({
    secret: 'progSistemasSenac202468',
    resave: false, 
    saveUninitialized: false
}));

// Rotas
app.get('/', (req, res) => {
    res.redirect('/inicio');  // Redireciona para a página 'index'
});

app.get('/inicio', (req, res) => {
    res.render('index');  // Exibe a página 'index'
});

// Rota para a página de criação de registros
app.get('/cadastro', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/inicio');  // Se o usuário já estiver logado, redireciona para a página inicial
    }
    res.render('auth/cadastro');  // Página de cadastro
});

// Rota para o cadastro de um novo usuário
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
            res.redirect('/login');  // Redireciona para a página de login após o cadastro
        });
    });
});

app.get('/admin', (req, res) => {
    if (!req.session.usuario || req.session.usuario.email !== 'admin@gmail.com') {
        return res.redirect('/login');  // Redireciona para login se o usuario não for administrador
    }
    res.render('admin');  // Renderiza a página 'admin.ejs'
});


// Rota para a página Mateus
app.get('/mateus', (req, res) => {
    res.render('mateus');  // Renderiza a página mateus.ejs
});


// Rota para a página Atacadão
app.get('/atacadao', (req, res) => {
    res.render('atacadao');  // Exibe a página 'atacadao.ejs'
});

// Rota para a página Assaí
app.get('/assai', (req, res) => {
    res.render('assai');  // Exibe a página 'assai.ejs'
});

app.use('/', authRoutes); // Rota 
app.use('/', produtoRoutes); 

app.listen(3000, (err) => {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err);
    } else {
        console.log('Servidor rodando na porta http://localhost:3000');
    }
});

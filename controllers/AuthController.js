const UsuarioModel = require('../models/UsuarioModel');

class AuthController {
    static formLogin(req, res) {
        res.render('auth/login');
    }

    static formCadastro(req, res) {
        res.render('auth/cadastro');
    }

    static login(req, res) {
        const { email, senha } = req.body;

        // Verifique se o e-mail e a senha são do admin
        if (email === 'admin@gmail.com' && senha === 'admin') {
            req.session.usuario = {
                id: 1, // Defina um ID fictício ou verdadeiro para o admin
                nome: 'Administrador',
                email: email
            };
            return res.redirect('/admin');  // Redireciona para a página admin.ejs
        }

        // Caso contrário, procure no banco de dados
        UsuarioModel.buscarPorEmail(email, (err, results) => {
            if (err || results.length === 0) {
                return res.render('auth/login', { erro: 'Usuário não encontrado' });
            }

            const usuario = results[0];

            // Corrigido para comparar a senha usando o método de verificação
            UsuarioModel.verificarSenha(senha, usuario.senha, (err, match) => {
                if (err || !match) {
                    return res.render('auth/login', { erro: 'Senha incorreta' });
                }

                // Criar sessão
                req.session.usuario = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                };

                // Redireciona para a página inicial
                res.redirect('/inicio');
            });
        });
    }

    static cadastro(req, res) {
        const { nome, email, senha, confirmPassword } = req.body;

        if (senha !== confirmPassword) {
            return res.render('auth/cadastro', { erro: 'As senhas não coincidem.' });
        }

        // Verifica se o e-mail já está cadastrado
        UsuarioModel.buscarPorEmail(email, (err, results) => {
            if (results && results.length > 0) {
                return res.render('auth/cadastro', { erro: 'E-mail já cadastrado' });
            }

            // Criação do novo usuário
            UsuarioModel.criar({ nome, email, senha }, (err) => {
                if (err) {
                    return res.render('auth/cadastro', { erro: 'Erro ao cadastrar usuário' });
                }
                // Redireciona para a página de login após cadastro
                res.redirect('/login');
            });
        });
    }

    static logout(req, res) {
        req.session.destroy((err) => {
            res.redirect('/login');
        });
    }
}

module.exports = AuthController;

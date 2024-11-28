const bcrypt = require('bcryptjs');
const db = require('../config/database');  // Verifique se a conexão com o banco de dados está correta

class UsuarioModel {
    // Método para buscar um usuário por email
    static buscarPorEmail(email, callback) {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(sql, [email], callback);  // Executa a query no banco de dados
    }

    // Método para criar um novo usuário
    static criar(usuario, callback) {
        bcrypt.hash(usuario.senha, 10, (err, hash) => {
            if (err) return callback(err);  // Caso ocorra erro no hash da senha
            
            const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
            db.query(sql, [usuario.nome, usuario.email, hash], callback);  // Insere o usuário no banco de dados
        });
    }

    // Método para verificar se a senha fornecida corresponde à senha armazenada
    static verificarSenha(senha, senhaArmazenada, callback) {
        bcrypt.compare(senha, senhaArmazenada, (err, res) => {
            callback(err, res);  // Retorna se as senhas são iguais
        });
    }
}

module.exports = UsuarioModel;  // Exporta o modelo

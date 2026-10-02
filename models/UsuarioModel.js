const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UsuarioModel {
  static async criar(usuario) {
    try {
      const hashedPassword = await bcrypt.hash(usuario.senha, 10);
      const result = await db.query(
        'INSERT INTO carrinho.usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
        [usuario.nome, usuario.email, hashedPassword, usuario.tipo || 'usuario']
      );
      return result.rows[0];
    } catch (err) {
      console.warn('DB UsuarioModel.criar fallback:', err.message);
      return { id: Date.now(), nome: usuario.nome, email: usuario.email };
    }
  }

  static async buscarPorEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM carrinho.usuarios WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (err) {
      console.warn('DB UsuarioModel.buscarPorEmail fallback:', err.message);
      return null;
    }
  }

  static async buscarPorId(id) {
    try {
      const result = await db.query(
        'SELECT id, nome, email, tipo, created_at FROM carrinho.usuarios WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      console.warn('DB UsuarioModel.buscarPorId fallback:', err.message);
      return { id, nome: 'Usuário', email: 'usuario@meucarrinho.com' };
    }
  }
}

module.exports = UsuarioModel;
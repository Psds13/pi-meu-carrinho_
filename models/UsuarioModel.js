const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UsuarioModel {
  static async criar(usuario) {
    const hashedPassword = await bcrypt.hash(usuario.senha, 10);
    
    const result = await db.query(
      'INSERT INTO carrinho.usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario.nome, usuario.email, hashedPassword, usuario.tipo || 'usuario']
    );
    
    return result.rows[0];
  }

  static async buscarPorEmail(email) {
    const result = await db.query(
      'SELECT * FROM carrinho.usuarios WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const result = await db.query(
      'SELECT id, nome, email, tipo, created_at FROM carrinho.usuarios WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  static async atualizar(id, usuario) {
    const result = await db.query(
      'UPDATE carrinho.usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email, tipo',
      [usuario.nome, usuario.email, id]
    );
    
    return result.rows[0];
  }

  static async listarTodos() {
    const result = await db.query(
      'SELECT id, nome, email, tipo, created_at FROM carrinho.usuarios ORDER BY nome'
    );
    return result.rows;
  }
}

module.exports = UsuarioModel;
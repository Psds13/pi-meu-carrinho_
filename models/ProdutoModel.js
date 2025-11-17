const db = require('../config/database');

class ProdutoModel {
  static async listarTodos() {
    const result = await db.query(`
      SELECT p.*, m.nome as mercado_nome 
      FROM carrinho.produtos p 
      LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id
      ORDER BY p.nome
    `);
    return result.rows;
  }

  static async listarPorMercado(mercadoId) {
    const result = await db.query(
      `SELECT p.*, m.nome as mercado_nome 
       FROM carrinho.produtos p 
       LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id 
       WHERE p.mercado_id = $1 
       ORDER BY p.nome`,
      [mercadoId]
    );
    return result.rows;
  }

  static async buscarPorId(id) {
    const result = await db.query(
      `SELECT p.*, m.nome as mercado_nome 
       FROM carrinho.produtos p 
       LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id 
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async criar(produto) {
    const result = await db.query(
      'INSERT INTO carrinho.produtos (nome, preco, imagem, mercado_id, categoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [produto.nome, produto.preco, produto.imagem, produto.mercado_id, produto.categoria]
    );
    return result.rows[0];
  }

  static async atualizar(id, produto) {
    const result = await db.query(
      'UPDATE carrinho.produtos SET nome = $1, preco = $2, imagem = $3, categoria = $4 WHERE id = $5 RETURNING *',
      [produto.nome, produto.preco, produto.imagem, produto.categoria, id]
    );
    return result.rows[0];
  }

  static async excluir(id) {
    const result = await db.query(
      'DELETE FROM carrinho.produtos WHERE id = $1',
      [id]
    );
    return result.rowCount;
  }

  static async buscarPorNome(nome) {
    const result = await db.query(
      `SELECT p.*, m.nome as mercado_nome 
       FROM carrinho.produtos p 
       LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id 
       WHERE p.nome ILIKE $1 
       ORDER BY p.preco`,
      [`%${nome}%`]
    );
    return result.rows;
  }

  static async listarCategorias() {
    const result = await db.query(
      'SELECT DISTINCT categoria FROM carrinho.produtos WHERE categoria IS NOT NULL ORDER BY categoria'
    );
    return result.rows;
  }
}

module.exports = ProdutoModel;
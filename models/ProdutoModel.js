const db = require('../config/database');
const staticProdutos = require('../data/produtosData');

class ProdutoModel {
  static async listarTodos() {
    try {
      const result = await db.query(`
        SELECT p.*, m.nome as mercado_nome 
        FROM carrinho.produtos p 
        LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id
        ORDER BY p.nome
      `);
      if (result && result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      console.warn('DB Query fallback to static dataset (listarTodos):', err.message);
    }
    return staticProdutos;
  }

  static async listarPorMercado(mercadoNome) {
    try {
      const result = await db.query(
        `SELECT p.*, m.nome as mercado_nome 
         FROM carrinho.produtos p 
         LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id 
         WHERE m.nome ILIKE $1 
         ORDER BY p.nome`,
        [`%${mercadoNome}%`]
      );
      if (result && result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      console.warn('DB Query fallback to static dataset (listarPorMercado):', err.message);
    }
    return staticProdutos.filter(p => 
      p.mercado_principal.toLowerCase().includes(mercadoNome.toLowerCase()) ||
      (p.precos_mercados && p.precos_mercados[mercadoNome])
    );
  }

  static async buscarPorId(id) {
    try {
      const result = await db.query(
        `SELECT p.*, m.nome as mercado_nome 
         FROM carrinho.produtos p 
         LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id 
         WHERE p.id = $1`,
        [id]
      );
      if (result && result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      console.warn('DB Query fallback to static dataset (buscarPorId):', err.message);
    }
    return staticProdutos.find(p => p.id == id) || staticProdutos[0];
  }

  static async buscarPorNome(queryStr) {
    try {
      const result = await db.query(
        `SELECT p.*, m.nome as mercado_nome 
         FROM carrinho.produtos p 
         LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id 
         WHERE p.nome ILIKE $1 
         ORDER BY p.preco`,
        [`%${queryStr}%`]
      );
      if (result && result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      console.warn('DB Query fallback to static dataset (buscarPorNome):', err.message);
    }
    
    if (!queryStr) return staticProdutos;
    const term = queryStr.toLowerCase();
    return staticProdutos.filter(p => 
      p.nome.toLowerCase().includes(term) ||
      (p.marca && p.marca.toLowerCase().includes(term)) ||
      (p.categoria && p.categoria.toLowerCase().includes(term)) ||
      (p.mercado_principal && p.mercado_principal.toLowerCase().includes(term))
    );
  }

  static async buscarPorCategoria(catNome) {
    const list = await this.listarTodos();
    if (!catNome || catNome.toLowerCase() === 'todos') return list;
    return list.filter(p => p.categoria && p.categoria.toLowerCase().includes(catNome.toLowerCase()));
  }

  static async listarCategorias() {
    return [
      "Todos",
      "Alimentos",
      "Bebidas",
      "Carnes",
      "Hortifruti",
      "Laticínios",
      "Limpeza",
      "Higiene",
      "Mercearia",
      "Congelados"
    ];
  }
}

module.exports = ProdutoModel;
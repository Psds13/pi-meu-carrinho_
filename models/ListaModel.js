const db = require('../config/database');

class ListaModel {
  static async criarLista(usuarioId, nomeLista) {
    const result = await db.query(
      'INSERT INTO carrinho.listas_compras (usuario_id, nome) VALUES ($1, $2) RETURNING *',
      [usuarioId, nomeLista]
    );
    return result.rows[0];
  }

  static async listarListasUsuario(usuarioId) {
    const result = await db.query(
      `SELECT l.*, COUNT(i.id) as total_itens,
              COUNT(CASE WHEN i.comprado THEN 1 END) as itens_comprados
       FROM carrinho.listas_compras l
       LEFT JOIN carrinho.itens_lista i ON l.id = i.lista_id
       WHERE l.usuario_id = $1
       GROUP BY l.id
       ORDER BY l.created_at DESC`,
      [usuarioId]
    );
    return result.rows;
  }

  static async buscarListaPorId(listaId, usuarioId) {
    const result = await db.query(
      `SELECT l.*, 
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', i.id,
                  'produto_id', i.produto_id,
                  'quantidade', i.quantidade,
                  'comprado', i.comprado,
                  'nome', p.nome,
                  'preco', p.preco,
                  'imagem', p.imagem,
                  'categoria', p.categoria,
                  'mercado_nome', m.nome
                )
              ) as itens
       FROM carrinho.listas_compras l
       LEFT JOIN carrinho.itens_lista i ON l.id = i.lista_id
       LEFT JOIN carrinho.produtos p ON i.produto_id = p.id
       LEFT JOIN carrinho.mercados m ON p.mercado_id = m.id
       WHERE l.id = $1 AND l.usuario_id = $2
       GROUP BY l.id`,
      [listaId, usuarioId]
    );
    return result.rows[0];
  }

  static async adicionarItemLista(listaId, produtoId, quantidade = 1) {
    const result = await db.query(
      `INSERT INTO carrinho.itens_lista (lista_id, produto_id, quantidade) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (lista_id, produto_id) 
       DO UPDATE SET quantidade = carrinho.itens_lista.quantidade + $3
       RETURNING *`,
      [listaId, produtoId, quantidade]
    );
    return result.rows[0];
  }

  static async removerItemLista(itemId) {
    const result = await db.query(
      'DELETE FROM carrinho.itens_lista WHERE id = $1',
      [itemId]
    );
    return result.rowCount;
  }

  static async marcarItemComprado(itemId, comprado) {
    const result = await db.query(
      'UPDATE carrinho.itens_lista SET comprado = $1 WHERE id = $2 RETURNING *',
      [comprado, itemId]
    );
    return result.rows[0];
  }

  static async excluirLista(listaId, usuarioId) {
    const result = await db.query(
      'DELETE FROM carrinho.listas_compras WHERE id = $1 AND usuario_id = $2',
      [listaId, usuarioId]
    );
    return result.rowCount;
  }
}

module.exports = ListaModel;
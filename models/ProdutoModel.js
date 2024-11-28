const db = require('../config/database');

const ProdutoModel = {
  buscarPorMercado: (mercado, callback) => {
    const query = `SELECT * FROM produtos WHERE mercado = ?`;
    db.query(query, [mercado], callback);
  }
};

module.exports = ProdutoModel;

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Conectado ao Banco de Dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no Pool de Conexão:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
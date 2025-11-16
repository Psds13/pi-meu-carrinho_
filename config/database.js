const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // SENHA VAZIA
    database: 'meucarrinho'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
    } else {
        console.log('Conectado ao MySQL!');
    }
});

module.exports = connection;
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac123456789',
    database: 'meucarrinho'
});

module.exports = connection; 
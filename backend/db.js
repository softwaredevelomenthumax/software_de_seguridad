const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Humax2026*+',
  database: 'control_herramientas',
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('MySQL conectado');
  }
});

module.exports = connection;
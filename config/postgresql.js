'usr strict'

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// ==> Conexão com a Base de Dados:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('💽 Postgresql conectado com sucesso!');
});

pool.connect().then(() => {
  console.log('✅ successful connection for postgres.');
})
.catch((err) => {
  console.error('⛔ Erro na tentativa de conexão com postgresql: %s', err.toString());
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
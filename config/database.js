const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join (__dirname, '..', 'finance.db');

const db = new sqlite3.Database(dbPath, (err)=> {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    }else {
          console.log('✅ Conectado ao SQLite');
    }
});

db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    category TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela:', err.message);
  } else {
    console.log('✅ Tabela transactions pronta');
  }
});

module.exports = db;
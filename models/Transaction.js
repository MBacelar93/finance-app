const db = require('../config/database');

const Transaction = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM transactions ORDER BY date DESC';

        db.all(sql, (err, rows) => {
            if (err) {
                console.error('❌ Erro ao buscar transações:', err);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    },

    getById: (id, callback) => {
        const sql = 'SELECT * FROM transactions WHERE id = ?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error('❌ Erro ao buscar transação:', err);
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    },

    create: (transacao, callback) => {
        const { type, category, description, amount, date } = transacao;

        if (!type || !category || !amount || !date) {
            const erro = 'Campos obrigatórios faltando';
            callback(new Error(erro), null);
            return;
        }

        const sql = `
            INSERT INTO transactions (type, category, description, amount, date)
            VALUES (?, ?, ?, ?, ?)
        `;

        const params = [type, category, description, amount, date];
        
        db.run(sql, params, function(err) {
            if (err) {
                console.error('❌ Erro ao criar transação:', err);
                callback(err, null);
            } else {
                const novaTransacao = {
                    id: this.lastID,
                    type,
                    category,
                    description,
                    amount,
                    date,
                    created_at: new Date().toISOString()
                };
                callback(null, novaTransacao);
            }
        });
    },

    update: (id, transacao, callback) => {
        const { type, category, description, amount, date } = transacao;
     
        const sql = `
            UPDATE transactions 
            SET type = ?, category = ?, description = ?, amount = ?, date = ?
            WHERE id = ?
        `;
     
        const params = [type, category, description, amount, date, id];
     
        db.run(sql, params, function(err) {
            if (err) {
                console.error('❌ Erro ao atualizar transação:', err);
                callback(err, null);
            } else {
                const transacaoAtualizada = {
                    id,
                    type,
                    category,
                    description,
                    amount,
                    date
                };
                callback(null, transacaoAtualizada);
            }
        });
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM transactions WHERE id = ?';
     
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('❌ Erro ao deletar transação:', err);
                callback(err, null);
            } else {
                callback(null, { message: `Transação ${id} deletada com sucesso`, id });
            }
        });
    },

    getSummary: (callback) => {
        const sql = `
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
            FROM transactions
        `;
     
        db.get(sql, (err, row) => {
            if (err) {
                console.error('❌ Erro ao obter resumo:', err);
                callback(err, null);
            } else {
                const summary = {
                    totalIncome: row.totalIncome || 0,
                    totalExpense: row.totalExpense || 0,
                    balance: (row.totalIncome || 0) - (row.totalExpense || 0)
                };
                callback(null, summary);
            }
        });
    }
};

module.exports = Transaction;
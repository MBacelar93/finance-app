const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Transaction = require('./models/Transaction');
const db = require('./config/database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// ========== ROTAS DA API ==========



// 1. GET - Listar todas as transações
app.get('/api/transactions', (req, res) => {
  Transaction.getAll((err, transacoes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar transações' });
    }
    res.json(transacoes);
  });
});


// 2. POST - Criar nova transação
app.post('/api/transactions', (req, res) => {
    const { type, category, description, amount, date } = req.body;

    if (!type || !category || !amount || !date) {
        return res.status(400).json({
            error: 'Campos obrigatórios faltando: type, category, amount, date'
        });
    }
    
    Transaction.create(req.body, (err, novaTransacao) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(novaTransacao);
    });
});


// 3. GET - Buscar transação específica
app.get('/api/transactions/:id', (req, res) => {
    const { id } = req.params;

    Transaction.getById(id, (err, transacao) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar transação' });
        }
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        res.json(transacao);
    });
});


// 4. PUT - Atualizar transação
app.put('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { type, category, description, amount, date } = req.body;

    if (!type || !category || !amount || !date) {
        return res.status(400).json({
            error: 'Campos obrigatórios faltando: type, category, amount, date'
        });
    }
    
    Transaction.update(id, req.body, (err, transacaoAtualizada) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(transacaoAtualizada);
    });
});


// 5. DELETE - Deletar transação
app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;

    Transaction.delete(id, (err, resultado) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar transação' });
        }
        res.json(resultado);
    });
});


// 6. GET - Resumo financeiro
app.get('/api/summary', (req, res) => {
    Transaction.getSummary((err, resumo) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao obter resumo' });
        }
        res.json(resumo);
    });
});

// ========== SERVIR INDEX.HTML ==========
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ========== SERVIDOR ==========
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 Acesse: http://localhost:${PORT}/api/transactions`);
});
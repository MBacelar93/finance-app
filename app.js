const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/transactions', (req, res)=>{
    const transactions = [
        {
            id: 1,
            type: 'income',
            category: 'Salário',
            description: 'Salário do mês',
            amount: 300.00,
            date: '2016-03-13'
        },
        {
            id: 2,
            type: 'expense',
            category: 'Alimentação',
            description: 'Mercado',
            amount: 150.50,
            date: '2016-03-12' 
        }
    ];
    res.json(transactions);
});

app.post('/api/transactions', (req, res)=> {
    const {type, category, description, amount, date } = req.body;

    if(!type || !category || !amount || !date){
        return res.status(400).json({
            error: 'Campos obrigatórios faltando'
        });
    }
    const novaTransacao = {
        id: Math.random(),
        type,
        category,
        description,
        amount,
        date
    };
    res.status(201).json(novaTransacao);

});

app.get('/api/transactions/:id', (req, res)=> {
    const {id} = req.params;

    const transacao = {
        id: id,
        type: 'expense',
        category: 'Alimentação',
        description: 'Mercado',
        amount: 150.50,
        date: '2026-03-13'
    };
    res.json(transacao);
});

app.delete('/api/transactions/:id', (req, res)=> {
    const {id} = req.params;

    res.json ({
        message: `Transação ${id} deletada com sucesso`,
        id: id
    });
});

app.listen(PORT, ()=> {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 Acesse: http://localhost:${PORT}/api/transactions`);
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// ROTAS
// GET - Listar transações
app.get('/api/transactions', (req, res)=> {
    Transactions.getAll((err, transacoes)=> {
        
        if(err){
            return res.status(500).json({error: 'Erro ao buscar transações'});
        }
        res.json(transacoes);
    });
});


//POST - Criar transações
app.post('/api/transactions', (req, res)=> {
    const {type, category, description, amount, date } = req.body;

    if(!type || !category || !amount || !date){
        return res.status(400).json({
            error: 'Campos obrigatórios faltando: type. category, amount date'
        });
    }
    
    Transactions.create(req.body, (err, novaTransacao)=> {
        if(err){
            return res.status(400).json({error: err.message});
        }
        res.status(201).json(novaTransacao);
    });

});

//GET - Buscar transação específica
app.get('/api/transactions/:id', (req, res)=> {
    const {id} = req.params;

    Transaction.getById(id, (err, transacao)=> {
        if (err){
            return res.status(500).json({error: 'Erro ao bucsar transação'});
        }
        if (!transacao) {
            return res.status(404).json({error: 'Transação não encontrada'});
        }
        res.json(transacao);
    });

});

//PUT - Atualualizar Transação
app.put('/api/transaction/:id', (req, res) => {
    const { id } = req.params;
    const { type, category, description, amount, date } = req.body;

    if(!type || !category || !amount || !date) {
        return res.status(400).json({
            erro: 'Campos obrigatórios faltando: type, category, amount, date'
        });
    }
    
    Transactions.update(id, req.body, (err, transacaoAtualizada)=> {
        if(err) {
            return res.status(400).json({error: err.message});
        }
        res.json(transacaoAtualizada);
    });
});


//DELTE - Deletar transação
app.delete('/api/transactions/:id', (req, res)=> {
    const {id} = req.params;

    Transaction.delete(id, (err, resultado)=> {
        if (err) {
            return res.status(500).json({error: 'Erro ao deletar transação'});
        }
        res.json(resultado);
    });
});

//GET - Resumo financeiro
app.get('/api/transactions/summary', (req, res) => {
  Transaction.getSummary((err, resumo) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao obter resumo' });
    }
    res.json(resumo);
  });
});


app.listen(PORT, ()=> {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 Acesse: http://localhost:${PORT}/api/transactions`);
});
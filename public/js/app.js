// CONFIGURAÇÃO DE URL
const API_URL = 'http://localhost:3000/api';

// ========== VARIÁVEIS GLOBAIS ==========
let form, typeInput, categoryInput, descriptionInput, amountInput, dateInput;
let transactionsList, formMessage, totalIncomeElement, totalExpenseElement, totalBalanceElement;

// ========== FUNÇÕES GLOBAIS ==========

// Formatar Valor
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Formatar Data
function formatDate(dateString){
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Mensagem de Sucesso/Erro
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type} show`;

    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message'
    }, 3000);
}

// Buscar todas as transações do banco
function fetchTransactions(){
    fetch(`${API_URL}/transactions`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Erro ao buscar transações');
        }
        return response.json();
    })
    .then(data=> {
        console.log('✅ Transações carregadas:', data);
        renderTransactions(data);
    })
    .catch(error => {
        console.error('❌ Erro:', error);
        showMessage('Erro ao carregar transações', 'error');
    });
}

// Renderizar lista de transações
function renderTransactions(transactions) {
    if(!transactions || transactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-message">Nenhuma transação adicionada ainda</p>';
        return;
    }

    transactionsList.innerHTML = transactions.map(t=> {
        const tipoClasse = t.type === 'income' ? 'income' : 'expense';
        const tipoLabel = t.type === 'income' ? 'Receita' : 'Despesa';
        const data = formatDate(t.date);
        const valor = formatCurrency(t.amount);
        
        return `
          <div class="transaction-item ${tipoClasse}">
            <div class="transaction-info">
              <div class="transaction-header">
                <span class="transaction-category">${t.category}</span>
                <span class="transaction-type ${tipoClasse}">${tipoLabel}</span>
              </div>
              <p class="transaction-description">${t.description || '-'}</p>
              <span class="transaction-date">${data}</span>
            </div>
            <div class="transaction-amount">
              <span class="amount ${tipoClasse}">${valor}</span>
            </div>
            <button class="btn-delete" onclick="deleteTransaction(${t.id})">Deletar</button>
          </div>
        `;
    }).join('');
}

// Criar Transação
function createTransaction(transacao){
    fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transacao)
    })
    .then(response => {
        if (!response.ok){
            throw new Error('Erro ao criar transação');
        }
        return response.json();
    })
    .then(data=> {
        console.log('✅ Transação criada:', data);
        showMessage('Transação criada com sucesso!', 'success');
        form.reset();
        loadData();
    })
    .catch(error => {
        console.log('❌ Erro:', error);
        showMessage('Erro ao criar transação', 'error');
    });
}

// Deletar Transação
function deleteTransaction(id) {
    if (!confirm('Tem certeza que deseja deletar essa transação?')) {
        return;
    }
    
    fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Erro ao deletar transação');
        }
        return response.json();
    })
    .then(data=> {
        console.log('✅ Transação deletada:', data);
        showMessage('Transação deletada com sucesso!', 'success');
        loadData(); // Recarregar sem dar reload()
    })
    .catch(error => {
        console.error('❌ Erro:', error);
        showMessage('Erro ao deletar transação', 'error');
    })
}

// Buscar resumo financeiro
function fetchSummary(){
    fetch(`${API_URL}/summary`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo');
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Resumo carregado:', data);
        renderSummary(data);
    })
    .catch(error => {
        console.error('❌ Erro:', error);
    });
}

// Renderizar resumo financeiro
function renderSummary(summary){
    totalIncomeElement.textContent = formatCurrency(summary.totalIncome);
    totalExpenseElement.textContent = formatCurrency(summary.totalExpense);

    const balanceClass = summary.balance >= 0 ? 'positive' : 'negative';
    totalBalanceElement.textContent = formatCurrency(summary.balance);
    totalBalanceElement.parentElement.className = `summary-card balance ${balanceClass}`;
}

// Carregar todos os dados
function loadData() {
    fetchTransactions();
    fetchSummary();
}

// ========== INICIALIZAR ==========

window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Página carregada');
    console.log('📡 Conectando à API:', API_URL);

    // ========== SELETORES DOM ==========
    form = document.getElementById('transaction-form');
    typeInput = document.getElementById('type');
    categoryInput = document.getElementById('category');
    descriptionInput = document.getElementById('description');
    amountInput = document.getElementById('amount');
    dateInput = document.getElementById('date');
    transactionsList = document.getElementById('transactions-list');
    formMessage = document.getElementById('form-message');
    totalIncomeElement = document.getElementById('total-income');
    totalExpenseElement = document.getElementById('total-expense');
    totalBalanceElement = document.getElementById('total-balance');

    // ========== EVENT LISTENERS ==========

    // Validação e submissão do formulário
    form.addEventListener('submit', (e)=> {
        e.preventDefault();

        // Validação de campos
        if (!typeInput.value || !categoryInput.value || !amountInput.value || !dateInput.value) {
            showMessage('Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        // Criar objeto de transação
        const novaTransacao = {
            type: typeInput.value,
            category: categoryInput.value,
            description: descriptionInput.value,
            amount: parseFloat(amountInput.value),
            date: dateInput.value
        };

        console.log('📤 Enviando transação:', novaTransacao);

        // Enviar para API
        createTransaction(novaTransacao);
    });

    // Carregar dados iniciais
    loadData();

    // Definir data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

console.log('✅ app.js carregado com sucesso!');

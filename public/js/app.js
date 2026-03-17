// CONFIGURAÇÃO DE URL
const API_URL = 'http://localhost:3000/api';

// ========== VARIÁVEIS GLOBAIS ==========
let form, typeInput, categoryInput, descriptionInput, amountInput, dateInput;
let transactionsList, formMessage, totalIncomeElement, totalExpenseElement, totalBalanceElement;
let filterTypeSelect, filterDateStartInput, filterDateEndInput, btnApplyFilters, btnClearFilters;

// ========== VARIÁVEIS DE FILTRO ==========
let filterType = '';
let filterDateStart = '';
let filterDateEnd = '';

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
    // Dividir a string YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    
    // Criar data sem fuso horário
    const date = new Date(year, month - 1, day);
    
    // Formatar
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return date.toLocaleDateString('pt-BR', options);
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

// ========== FUNÇÕES DE FILTRO ==========

// Aplicar filtros
function applyFilters() {
    console.log('🔍 Aplicando filtros:', {
        type: filterType,
        dateStart: filterDateStart,
        dateEnd: filterDateEnd
    });
    
    fetchTransactions();
}

// Limpar filtros
function clearFilters() {
    filterType = '';
    filterDateStart = '';
    filterDateEnd = '';
    
    // Limpar inputs
    filterTypeSelect.value = '';
    filterDateStartInput.value = '';
    filterDateEndInput.value = '';
    
    console.log('🧹 Filtros limpos');
    fetchTransactions();
}

// Buscar todas as transações com filtros
function fetchTransactions(){
    let url = `${API_URL}/transactions`;
    
    // Construir query string com filtros
    const params = new URLSearchParams();
    if (filterType) params.append('type', filterType);
    if (filterDateStart) params.append('dateStart', filterDateStart);
    if (filterDateEnd) params.append('dateEnd', filterDateEnd);
    
    if (params.toString()) {
        url += '?' + params.toString();
    }
    
    console.log('📡 Buscando:', url);
    
    fetch(url)
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
        loadData();
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

    // ========== SELETORES DOS FILTROS ==========
    filterTypeSelect = document.getElementById('filter-type');
    filterDateStartInput = document.getElementById('filter-date-start');
    filterDateEndInput = document.getElementById('filter-date-end');
    btnApplyFilters = document.getElementById('btn-apply-filters');
    btnClearFilters = document.getElementById('btn-clear-filters');

    console.log('🔍 Debug Filtros:');
    console.log('filterTypeSelect:', filterTypeSelect);
    console.log('filterDateStartInput:', filterDateStartInput);
    console.log('filterDateEndInput:', filterDateEndInput);
    console.log('btnApplyFilters:', btnApplyFilters);
    console.log('btnClearFilters:', btnClearFilters);

    // ========== EVENT LISTENERS DO FORMULÁRIO ==========

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

    // ========== EVENT LISTENERS DOS FILTROS ==========

    // Quando mudar o tipo
    if (filterTypeSelect) {
        filterTypeSelect.addEventListener('change', (e) => {
            filterType = e.target.value;
            console.log('📊 Tipo filtrado:', filterType);
        });
    }

    // Quando mudar data inicial
    if (filterDateStartInput) {
        filterDateStartInput.addEventListener('change', (e) => {
            filterDateStart = e.target.value;
            console.log('📅 Data inicial:', filterDateStart);
        });
    }

    // Quando mudar data final
    if (filterDateEndInput) {
        filterDateEndInput.addEventListener('change', (e) => {
            filterDateEnd = e.target.value;
            console.log('📅 Data final:', filterDateEnd);
        });
    }

    // Botão Aplicar Filtros
    if (btnApplyFilters) {
        console.log('✅ Adicionando listener ao botão Aplicar Filtros');
        btnApplyFilters.addEventListener('click', () => {
            console.log('🔍 Botão Aplicar Filtros clicado!');
            applyFilters();
        });
    } else {
        console.error('❌ Botão Aplicar Filtros não encontrado!');
    }

    // Botão Limpar Filtros
    if (btnClearFilters) {
        console.log('✅ Adicionando listener ao botão Limpar Filtros');
        btnClearFilters.addEventListener('click', () => {
            console.log('🧹 Botão Limpar Filtros clicado!');
            clearFilters();
        });
    } else {
        console.error('❌ Botão Limpar Filtros não encontrado!');
    }

    // Carregar dados iniciais
    loadData();

    // Definir data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

console.log('✅ app.js carregado com sucesso!');
// CONFIGURAÇÃO DE URL
const API_URL = 'http://localhost:3000/api';

// ========== VARIÁVEIS GLOBAIS ==========
let form, typeInput, categoryInput, descriptionInput, amountInput, dateInput;
let transactionsList, formMessage, totalIncomeElement, totalExpenseElement, totalBalanceElement;
let filterTypeSelect, filterDateStartInput, filterDateEndInput, btnApplyFilters, btnClearFilters;
let editModal, editForm, editId, editType, editCategory, editDescription, editAmount, editDate;

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
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
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

// ========== FUNÇÕES DO MODAL ==========

// Abrir modal de edição
function openEditModal(id) {
    // Buscar transação do banco
    fetch(`${API_URL}/transactions/${id}`)
        .then(response => response.json())
        .then(transacao => {
            console.log('📝 Abrindo modal para editar:', transacao);

            // Pré-preencher o formulário
            editId.value = transacao.id;
            editType.value = transacao.type;
            editCategory.value = transacao.category;
            editDescription.value = transacao.description || '';
            editAmount.value = transacao.amount;
            editDate.value = transacao.date;

            // Mostrar modal
            editModal.style.display = 'flex';
        })
        .catch(error => {
            console.error('❌ Erro ao buscar transação:', error);
            showMessage('Erro ao abrir transação', 'error');
        });
}

// Fechar modal
function closeEditModal() {
    editModal.style.display = 'none';
    editForm.reset();
}

// Salvar edição
function saveEdit(e) {
    e.preventDefault();

    const id = editId.value;

    // Validação
    if (!editType.value || !editCategory.value || !editAmount.value || !editDate.value) {
        showMessage('Preencha todos os campos obrigatórios!', 'error');
        return;
    }

    // Dados atualizados
    const transacaoAtualizada = {
        type: editType.value,
        category: editCategory.value,
        description: editDescription.value,
        amount: parseFloat(editAmount.value),
        date: editDate.value
    };

    console.log('📤 Atualizando transação:', transacaoAtualizada);

    // Enviar PUT
    fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transacaoAtualizada)
    })
        .then(response => response.json())
        .then(data => {
            console.log('✅ Transação atualizada:', data);
            showMessage('Transação atualizada com sucesso!', 'success');
            closeEditModal();
            loadData(); // Recarregar lista
        })
        .catch(error => {
            console.error('❌ Erro:', error);
            showMessage('Erro ao atualizar transação', 'error');
        });
}

// ========== FUNÇÕES DE REQUISIÇÃO ==========

// Buscar todas as transações com filtros
function fetchTransactions() {
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
            if (!response.ok) {
                throw new Error('Erro ao buscar transações');
            }
            return response.json();
        })
        .then(data => {
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
    if (!transactions || transactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-message">Nenhuma transação adicionada ainda</p>';
        return;
    }

    transactionsList.innerHTML = transactions.map(t => {
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
    <div class="transaction-footer">
      <div class="transaction-amount">
        <span class="amount ${tipoClasse}">${valor}</span>
      </div>
      <div class="transaction-actions">
        <button class="btn-edit" onclick="openEditModal(${t.id})">Editar</button>
        <button class="btn-delete" onclick="deleteTransaction(${t.id})">Deletar</button>
      </div>
    </div>
  </div>
        `;
    }).join('');
}

// Criar Transação
function createTransaction(transacao) {
    fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transacao)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao criar transação');
            }
            return response.json();
        })
        .then(data => {
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
            if (!response.ok) {
                throw new Error('Erro ao deletar transação');
            }
            return response.json();
        })
        .then(data => {
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
function fetchSummary() {
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
function renderSummary(summary) {
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

    // ========== SELETORES DO MODAL ==========
    editModal = document.getElementById('edit-modal');
    editForm = document.getElementById('edit-form');
    editId = document.getElementById('edit-id');
    editType = document.getElementById('edit-type');
    editCategory = document.getElementById('edit-category');
    editDescription = document.getElementById('edit-description');
    editAmount = document.getElementById('edit-amount');
    editDate = document.getElementById('edit-date');

    // ========== EVENT LISTENERS DO FORMULÁRIO ==========

    // Validação e submissão do formulário
    form.addEventListener('submit', (e) => {
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

    if (filterTypeSelect) {
        filterTypeSelect.addEventListener('change', (e) => {
            filterType = e.target.value;
        });
    }

    if (filterDateStartInput) {
        filterDateStartInput.addEventListener('change', (e) => {
            filterDateStart = e.target.value;
        });
    }

    if (filterDateEndInput) {
        filterDateEndInput.addEventListener('change', (e) => {
            filterDateEnd = e.target.value;
        });
    }

    if (btnApplyFilters) {
        btnApplyFilters.addEventListener('click', () => {
            applyFilters();
        });
    }

    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            clearFilters();
        });
    }

    // ========== EVENT LISTENERS DO MODAL ==========

    if (editForm) {
        editForm.addEventListener('submit', saveEdit);
    }

    // Fechar modal ao clicar fora
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditModal();
            }
        });
    }

    // Carregar dados iniciais
    loadData();

    // Definir data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

console.log('✅ app.js carregado com sucesso!');
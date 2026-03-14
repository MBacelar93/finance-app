# 💰 Finance App - Sistema de Gestão de Finanças Pessoais

Um aplicativo web moderno para controlar suas despesas e receitas com uma interface intuitiva e responsiva.

## 🎯 Objetivo

Criar um **Sistema de Gestão de Finanças Pessoais** simples, funcional e educativo usando:
- **Backend:** Node.js + Express + SQLite
- **Frontend:** HTML5 + CSS3 + JavaScript puro
- **Padrão:** MVC (Model-View-Controller)

## ✨ Funcionalidades

### MVP V1 (Transações Básicas) ✅
- [x] Criar transação (receita/despesa)
- [x] Listar transações
- [x] Resumo financeiro (receita, despesa, saldo)
- [x] Interface responsiva

### MVP V2 (Edição e Deleção) 🔄
- [ ] Editar transação existente
- [ ] Deletar transação
- [ ] Confirmação antes de deletar

### MVP V3 (Filtros e Relatórios) 📊
- [ ] Filtrar por tipo (receita/despesa)
- [ ] Filtrar por categoria
- [ ] Busca em tempo real
- [ ] Relatórios simples

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **Cors** - Compartilhamento de origem cruzada

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Layout responsivo (Flexbox/Grid)
- **JavaScript Vanilla** - Sem frameworks
- **Fetch API** - Requisições HTTP

## 📁 Estrutura do Projeto

```
finance-app/
├── config/                    # Configuração do banco de dados
│   └── database.js
├── models/                    # Models (lógica de dados)
│   └── Transaction.js
├── controllers/               # Controllers (lógica HTTP)
│   └── TransactionController.js
├── routes/                    # Rotas/Endpoints
│   └── transactions.js
├── views/                     # HTML (Frontend)
│   └── index.html
├── public/                    # Arquivos estáticos
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── app.js                     # Arquivo principal Express
├── package.json               # Dependências
├── .gitignore
└── finance.db                 # Banco de dados SQLite
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js 14+ instalado
- Git instalado
- Editor de código (VS Code recomendado)

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/MBacelar93/finance-app.git
cd finance-app
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor:**
```bash
npm start
```

4. **Abra no navegador:**
```
http://localhost:3000
```

## 📚 Documentação

- **[GUIA_COMMIT_HTML.md](./GUIA_COMMIT_HTML.md)** - Como fazer commits Git
- **[EXPLICACAO_HTML.md](./EXPLICACAO_HTML.md)** - Explicação da estrutura HTML
- **[EXPLICACAO_CSS.md](./EXPLICACAO_CSS.md)** - Explicação do CSS e Flexbox/Grid
- **[BACKLOG_JIRA_SIMPLES.csv](./BACKLOG_JIRA_SIMPLES.csv)** - Backlog do projeto

## 🔌 API Endpoints

### Transações

#### Criar transação
```http
POST /api/transactions
Content-Type: application/json

{
  "type": "expense",
  "category": "Alimentação",
  "description": "Compras no mercado",
  "amount": 150.50,
  "date": "2026-03-13"
}
```

#### Listar todas as transações
```http
GET /api/transactions
```

#### Obter transação específica
```http
GET /api/transactions/:id
```

#### Atualizar transação
```http
PUT /api/transactions/:id
Content-Type: application/json

{
  "type": "income",
  "category": "Salário",
  "amount": 3000.00,
  "date": "2026-03-13"
}
```

#### Deletar transação
```http
DELETE /api/transactions/:id
```

#### Resumo financeiro
```http
GET /api/transactions/summary
```

## 💾 Modelo de Dados

### Transação
```javascript
{
  id: number,              // ID único
  type: string,            // "income" ou "expense"
  category: string,        // "Alimentação", "Transporte", etc
  description: string,     // Descrição opcional
  amount: decimal,         // Valor (2 casas decimais)
  date: date,             // Data da transação
  created_at: datetime    // Data de criação
}
```

## 🎓 Aprendizado

Este projeto foi desenvolvido para **aprender conceitos profissionais:**

### Backend
- ✅ Padrão MVC
- ✅ RESTful API
- ✅ Banco de dados relacional
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Versionamento com Git

### Frontend
- ✅ HTML semântico
- ✅ CSS responsivo (Flexbox/Grid)
- ✅ JavaScript vanilla
- ✅ Requisições HTTP (Fetch API)
- ✅ Manipulação de DOM
- ✅ Validação de formulários

### DevOps
- ✅ Git e GitHub
- ✅ Padrão de commit (Conventional Commits)
- ✅ Metodologia Ágil (Jira/Sprints)
- ✅ Documentação técnica

## 📊 Progresso do Projeto

### Sprint 1: MVP Básico (Em andamento)
- [x] Story 1: Criar estrutura HTML base
- [x] Story 2: Criar CSS para layout
- [ ] Story 3: Criar componentes visuais
- [ ] Story 4: Criar arquivo JavaScript principal
- [ ] Stories 5-13: Funcionalidades JavaScript

### Sprint 2: CRUD Completo
- [ ] Story 14: Implementar deleção
- [ ] Story 15: Implementar edição

### Sprint 3: Melhorias
- [ ] Story 16: Filtros
- [ ] Story 17: Busca
- [ ] Story 18: Relatórios

## 🔧 Desenvolvimento

### Fazer um commit
```bash
git add .
git commit -m "feat: descrição da mudança"
git push origin main
```

### Padrão de mensagem de commit
- `feat:` Nova funcionalidade
- `fix:` Corrigir bug
- `refactor:` Melhorar código
- `style:` Estilos CSS
- `docs:` Documentação
- `test:` Testes

## 🐛 Reportar Bugs

Se encontrar um bug, abra uma **Issue** no GitHub descrevendo:
1. Como reproduzir
2. Comportamento esperado
3. Comportamento atual
4. Screenshots (se aplicável)

## 📝 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

## 👤 Autor

**Matheus Bacelar**
- GitHub: [@MBacelar93](https://github.com/MBacelar93)
- Projeto de aprendizado em desenvolvimento web

## 🙏 Agradecimentos

Este projeto foi desenvolvido como parte de um **processo educacional completo** envolvendo:
- Padrão MVC
- Desenvolvimento Full Stack
- Boas práticas de Git
- Metodologia Ágil

---

## 📞 Suporte

Se tiver dúvidas sobre como usar ou desenvolver o projeto, abra uma **Issue** no GitHub!

## 🚀 Próximas Etapas

1. Completar Story 3 e 4 (Frontend)
2. Implementar todas as Stories da Sprint 1
3. Deploy na nuvem (Heroku/Vercel)
4. Adicionar testes automatizados
5. Melhorar UI/UX

---

**Última atualização:** 13 de Março de 2026

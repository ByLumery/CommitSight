# GitHub Analyzer

Um projeto full stack para análise completa de repositórios do GitHub, desenvolvido com tecnologias modernas e foco em performance e usabilidade.

## 🚀 Funcionalidades

### 📊 Análise de Repositórios
- **Frequência de commits**: Visualização de commits por semana/mês
- **Complexidade do código**: Análise de linhas de código e estrutura
- **Principais contribuidores**: Ranking e estatísticas de contribuidores
- **Linguagens mais usadas**: Distribuição de tecnologias no repositório
- **Estatísticas gerais**: Issues, PRs, stars, forks e muito mais

### 🔐 Autenticação e Usuários
- Sistema de login/registro seguro
- Gerenciamento de perfil do usuário
- Repositórios favoritos
- Histórico de análises

### 📈 Dashboards Interativos
- Gráficos de commits com Chart.js/Recharts
- Distribuição de linguagens em pizza
- Ranking de contribuidores
- Tabelas de issues e pull requests
- Exportação de relatórios em CSV

### 🐳 Deploy e Infraestrutura
- Docker Compose para desenvolvimento
- Configuração para produção
- Banco PostgreSQL
- API REST completa

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** com **Prisma ORM**
- **JWT** para autenticação
- **GitHub REST API** para integração
- **Jest** para testes

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **React Query** para gerenciamento de estado
- **Recharts** para visualizações
- **React Hook Form** para formulários

### DevOps
- **Docker** + **Docker Compose**
- **PostgreSQL** como banco de dados
- **Nginx** para proxy reverso (produção)

## 📋 Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- Conta no GitHub (para token de API)

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/github-analyzer.git
cd github-analyzer
```

### 2. Configure as variáveis de ambiente
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# GitHub API
GITHUB_TOKEN=seu_token_do_github

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/github_analyzer

# JWT Secret
JWT_SECRET=sua_chave_secreta_jwt

# API URL
REACT_APP_API_URL=http://localhost:3001
```

### 3. Execute com Docker (Recomendado)
```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

### 4. Ou execute localmente

#### Backend
```bash
cd backend
npm install
npm run migrate
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuração do GitHub Token

1. Acesse [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token"
3. Selecione os escopos necessários:
   - `repo` (para repositórios privados)
   - `public_repo` (para repositórios públicos)
4. Copie o token e adicione no arquivo `.env`

## 📱 Como Usar

### 1. Acesse a aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 2. Crie uma conta
- Clique em "Criar Conta" na página inicial
- Preencha seus dados
- Faça login

### 3. Analise um repositório
- Cole a URL do repositório GitHub
- Clique em "Analisar"
- Aguarde o processamento
- Visualize os resultados no dashboard

### 4. Explore os dados
- **Dashboard**: Visão geral de todos os repositórios
- **Detalhes**: Análise profunda de um repositório específico
- **Perfil**: Suas estatísticas pessoais
- **Exportar**: Baixe relatórios em CSV

## 🧪 Testes

### Backend
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend
```bash
cd frontend
npm test
```

## 📊 Estrutura do Projeto

```
github-analyzer/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços (GitHub API, Análise)
│   │   ├── middleware/     # Middlewares (Auth, Error)
│   │   └── __tests__/      # Testes
│   ├── prisma/            # Schema do banco
│   └── Dockerfile
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # Serviços (API)
│   └── Dockerfile
├── docker-compose.yml     # Orquestração dos serviços
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Repositórios
- `GET /api/repositories` - Listar repositórios do usuário
- `POST /api/repositories/analyze` - Analisar repositório
- `GET /api/repositories/:id` - Detalhes do repositório
- `POST /api/repositories/:id/favorite` - Adicionar aos favoritos

### Análises
- `GET /api/analysis/repository/:id` - Análises do repositório
- `GET /api/analysis/repository/:id/stats` - Estatísticas
- `GET /api/analysis/repository/:id/export/csv` - Exportar CSV

### Usuário
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/stats` - Estatísticas do usuário

## 🚀 Deploy

### Render (Recomendado)
1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente
3. Deploy automático

### Railway
1. Conecte ao Railway
2. Configure PostgreSQL
3. Deploy

### Vercel (Frontend) + Railway (Backend)
1. Frontend no Vercel
2. Backend no Railway
3. Configure as URLs

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](README.md)
2. Procure em [Issues](https://github.com/seu-usuario/github-analyzer/issues)
3. Crie uma nova issue se necessário

## 🎯 Roadmap

- [ ] Suporte a múltiplos repositórios por usuário
- [ ] Exportação em PDF
- [ ] Notificações por email
- [ ] Análise de complexidade de código
- [ ] Integração com GitHub Actions
- [ ] API GraphQL
- [ ] PWA (Progressive Web App)
- [ ] Temas dark/light
- [ ] Análise de sentimentos em commits
- [ ] Comparação entre repositórios

## 📊 Estatísticas do Projeto

- **Backend**: 100% TypeScript
- **Frontend**: React 18 + TypeScript
- **Testes**: Jest + Testing Library
- **Cobertura**: >80%
- **Performance**: Lighthouse 90+
- **Acessibilidade**: WCAG 2.1 AA

---

Desenvolvido com ❤️ para a comunidade de desenvolvedores

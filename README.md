# CommitSight

A full stack project for comprehensive GitHub repository analysis, developed with modern technologies and focused on performance and usability.

## 🚀 Features

### 📊 Repository Analysis
- **Commit frequency**: Visualization of commits by week/month
- **Code complexity**: Analysis of code lines and structure
- **Top contributors**: Ranking and contributor statistics
- **Most used languages**: Technology distribution in the repository
- **General statistics**: Issues, PRs, stars, forks and much more

### 🔐 Authentication and Users
- Secure login/registration system
- User profile management
- Favorite repositories
- Analysis history

### 📈 Interactive Dashboards
- Commit charts with Chart.js/Recharts
- Language distribution pie charts
- Contributor rankings
- Issues and pull request tables
- CSV report export

### 🐳 Deploy and Infrastructure
- Docker Compose for development
- Production configuration
- PostgreSQL database
- Complete REST API

## 🛠️ Technologies Used

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **JWT** for authentication
- **GitHub REST API** for integration
- **Jest** for testing

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for state management
- **Recharts** for visualizations
- **React Hook Form** for forms

### DevOps
- **Docker** + **Docker Compose**
- **PostgreSQL** as database
- **Nginx** for reverse proxy (production)

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- GitHub account (for API token)

## 🚀 Installation and Configuration

### 1. Clone the repository
```bash
git clone https://github.com/your-username/commitsight.git
cd commitsight
```

### 2. Configure environment variables
```bash
cp env.example .env
```

Edit the `.env` file with your settings:
```env
# GitHub API
GITHUB_TOKEN=your_github_token

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/commitsight

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# API URL
REACT_APP_API_URL=http://localhost:3001
```

### 3. Run with Docker (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Or in background
docker-compose up -d --build
```

### 4. Or run locally

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

## 🔧 GitHub Token Configuration

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select the necessary scopes:
   - `repo` (for private repositories)
   - `public_repo` (for public repositories)
4. Copy the token and add it to the `.env` file

## 📱 How to Use

### 1. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 2. Create an account
- Click "Create Account" on the home page
- Fill in your data
- Log in

### 3. Analyze a repository
- Paste the GitHub repository URL
- Click "Analyze"
- Wait for processing
- View results in the dashboard

### 4. Explore the data
- **Dashboard**: Overview of all repositories
- **Details**: Deep analysis of a specific repository
- **Profile**: Your personal statistics
- **Export**: Download CSV reports

## 🧪 Testing

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

## 📊 Project Structure

```
commitsight/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API Routes
│   │   ├── services/       # Services (GitHub API, Analysis)
│   │   ├── middleware/     # Middlewares (Auth, Error)
│   │   └── __tests__/      # Tests
│   ├── prisma/            # Database Schema
│   └── Dockerfile
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── pages/         # Application Pages
│   │   ├── hooks/         # Custom Hooks
│   │   └── services/      # Services (API)
│   └── Dockerfile
├── docker-compose.yml     # Service Orchestration
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Repositories
- `GET /api/repositories` - List user repositories
- `POST /api/repositories/analyze` - Analyze repository
- `GET /api/repositories/:id` - Repository details
- `POST /api/repositories/:id/favorite` - Add to favorites

### Analysis
- `GET /api/analysis/repository/:id` - Repository analysis
- `GET /api/analysis/repository/:id/stats` - Statistics
- `GET /api/analysis/repository/:id/export/csv` - Export CSV

### User
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - User statistics

## 🚀 Deploy

### Render (Recommended)
1. Connect your repository to Render
2. Configure environment variables
3. Automatic deployment

### Railway
1. Connect to Railway
2. Configure PostgreSQL
3. Deploy

### Vercel (Frontend) + Railway (Backend)
1. Frontend on Vercel
2. Backend on Railway
3. Configure URLs

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🆘 Support

If you encounter any problems or have questions:

1. Check the [documentation](README.md)
2. Search in [Issues](https://github.com/your-username/commitsight/issues)
3. Create a new issue if necessary

## 🎯 Roadmap

- [ ] Support for multiple repositories per user
- [ ] PDF export
- [ ] Email notifications
- [ ] Code complexity analysis
- [ ] GitHub Actions integration
- [ ] GraphQL API
- [ ] PWA (Progressive Web App)
- [ ] Dark/light themes
- [ ] Commit sentiment analysis
- [ ] Repository comparison

## 📊 Project Statistics

- **Backend**: 100% TypeScript
- **Frontend**: React 18 + TypeScript
- **Testing**: Jest + Testing Library
- **Coverage**: >80%
- **Performance**: Lighthouse 90+
- **Accessibility**: WCAG 2.1 AA

---

Developed with ❤️ for the developer community

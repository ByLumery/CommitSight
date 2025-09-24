import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { repositoryRoutes } from './routes/repository';
import { analysisRoutes } from './routes/analysis';
import { userRoutes } from './routes/user';

const app = express();
const PORT = process.env.PORT || 3001;

// Codespaces/Proxy
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "font-src": ["'self'", "data:"],
      },
    },
  })
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, try again in 15 minutes.',
});
app.use(limiter);

// CORS
app.use(cors({ origin: true, credentials: true }));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Rotas API
app.use('/api/auth', authRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/users', userRoutes);

// ✅ Servir frontend somente em produção
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '..', '..', 'frontend', 'build');
  app.use(express.static(clientPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 CommitSight Backend started`);
});

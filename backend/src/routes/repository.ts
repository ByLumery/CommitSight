import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AnalysisService } from '../services/analysisService';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Analyze repository
router.post('/analyze', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { repositoryUrl } = req.body;

    if (!repositoryUrl) {
      throw createError('Repository URL is required', 400);
    }

    // Extract owner and repo from URL
    const urlMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlMatch) {
      throw createError('Invalid repository URL', 400);
    }

    const [, owner, repo] = urlMatch;

    // Check if repository has already been analyzed
    const existingRepo = await prisma.repository.findUnique({
      where: { fullName: `${owner}/${repo}` }
    });

    if (existingRepo) {
      // Return existing analyses
      const analyses = await prisma.analysis.findMany({
        where: { repositoryId: existingRepo.id },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({
        repository: existingRepo,
        analyses: analyses.map(a => ({ type: a.type, data: a.data }))
      });
    }

    // Analyze repository
    const analysisService = new AnalysisService(process.env.GITHUB_TOKEN!);
    const result = await analysisService.analyzeRepository(owner, repo, req.user!.id);

    return res.json({
      message: 'Repository analyzed successfully',
      repository: result.repository,
      analyses: result.analyses.map(a => ({ type: a.type, data: a.data }))
    });
  } catch (error) {
    return next(error);
  }
});

// Listar repositórios do usuário
router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const repositories = await prisma.repository.findMany({
      where: { userId: req.user!.id },
      include: {
        _count: {
          select: {
            commits: true,
            contributors: true,
            issues: true,
            pullRequests: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(repositories);
  } catch (error) {
    next(error);
  }
});

// Obter detalhes de um repositório
router.get('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId: req.user!.id
      },
      include: {
        commits: {
          orderBy: { date: 'desc' },
          take: 50
        },
        contributors: {
          orderBy: { commits: 'desc' },
          take: 10
        },
        languages: {
          orderBy: { bytes: 'desc' }
        },
        issues: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        pullRequests: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        analyses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!repository) {
      throw createError('Repositório não encontrado', 404);
    }

    res.json(repository);
  } catch (error) {
    next(error);
  }
});

// Adicionar aos favoritos
router.post('/:id/favorite', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!repository) {
      throw createError('Repositório não encontrado', 404);
    }

    await prisma.favoriteRepository.create({
      data: {
        userId: req.user!.id,
        repositoryId: id
      }
    });

    return res.json({ message: 'Repositório adicionado aos favoritos' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.json({ message: 'Repositório já está nos favoritos' });
    }
    return next(error);
  }
});

// Remover dos favoritos
router.delete('/:id/favorite', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.favoriteRepository.deleteMany({
      where: {
        userId: req.user!.id,
        repositoryId: id
      }
    });

    res.json({ message: 'Repositório removido dos favoritos' });
  } catch (error: any) {
    next(error);
  }
});

// Listar favoritos
router.get('/favorites/list', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const favorites = await prisma.favoriteRepository.findMany({
      where: { userId: req.user!.id },
      include: {
        repository: {
          include: {
            _count: {
              select: {
                commits: true,
                contributors: true,
                issues: true,
                pullRequests: true
              }
            }
          }
        }
      },
      orderBy: { repository: { updatedAt: 'desc' } }
    });

    res.json(favorites.map(f => f.repository));
  } catch (error: any) {
    next(error);
  }
});

export { router as repositoryRoutes };

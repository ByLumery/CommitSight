import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            repositories: true,
            favorites: true
          }
        }
      }
    });

    if (!user) {
      throw createError('Usuário não encontrado', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Atualizar perfil
router.put('/profile', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(createError('Email já está em uso', 409));
    }
    next(error);
  }
});

// Obter estatísticas do usuário
router.get('/stats', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const [
      totalRepositories,
      totalFavorites,
      totalCommits,
      totalContributors,
      totalIssues,
      totalPullRequests,
      recentRepositories
    ] = await Promise.all([
      prisma.repository.count({ where: { userId: req.user!.id } }),
      prisma.favoriteRepository.count({ where: { userId: req.user!.id } }),
      prisma.commit.count({
        where: {
          repository: { userId: req.user!.id }
        }
      }),
      prisma.contributor.count({
        where: {
          repository: { userId: req.user!.id }
        }
      }),
      prisma.issue.count({
        where: {
          repository: { userId: req.user!.id }
        }
      }),
      prisma.pullRequest.count({
        where: {
          repository: { userId: req.user!.id }
        }
      }),
      prisma.repository.findMany({
        where: { userId: req.user!.id },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          fullName: true,
          language: true,
          stars: true,
          updatedAt: true
        }
      })
    ]);

    res.json({
      totalRepositories,
      totalFavorites,
      totalCommits,
      totalContributors,
      totalIssues,
      totalPullRequests,
      recentRepositories
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };

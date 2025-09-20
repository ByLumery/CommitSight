import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Obter análises de um repositório
router.get('/repository/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    // Verificar se o repositório pertence ao usuário
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!repository) {
      throw createError('Repositório não encontrado', 404);
    }

    // Buscar análises
    const whereClause: any = { repositoryId: id };
    if (type) {
      whereClause.type = type;
    }

    const analyses = await prisma.analysis.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.json(analyses);
  } catch (error) {
    next(error);
  }
});

// Obter estatísticas gerais
router.get('/repository/:id/stats', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    // Verificar se o repositório pertence ao usuário
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!repository) {
      throw createError('Repositório não encontrado', 404);
    }

    // Buscar estatísticas
    const [
      commits,
      contributors,
      languages,
      issues,
      pullRequests,
      analyses
    ] = await Promise.all([
      prisma.commit.count({ where: { repositoryId: id } }),
      prisma.contributor.count({ where: { repositoryId: id } }),
      prisma.language.findMany({ where: { repositoryId: id } }),
      prisma.issue.groupBy({
        by: ['state'],
        where: { repositoryId: id },
        _count: { state: true }
      }),
      prisma.pullRequest.groupBy({
        by: ['state'],
        where: { repositoryId: id },
        _count: { state: true }
      }),
      prisma.analysis.findMany({
        where: { repositoryId: id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Processar estatísticas de issues
    const issueStats = issues.reduce((acc, item) => {
      acc[item.state] = item._count.state;
      return acc;
    }, {} as any);

    // Processar estatísticas de PRs
    const prStats = pullRequests.reduce((acc, item) => {
      acc[item.state] = item._count.state;
      return acc;
    }, {} as any);

    // Calcular total de bytes por linguagem
    const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
    const languageStats = languages.map(lang => ({
      name: lang.name,
      bytes: lang.bytes,
      percentage: (lang.bytes / totalBytes) * 100
    })).sort((a, b) => b.bytes - a.bytes);

    res.json({
      repository: {
        id: repository.id,
        name: repository.name,
        fullName: repository.fullName,
        description: repository.description,
        language: repository.language,
        stars: repository.stars,
        forks: repository.forks,
        watchers: repository.watchers,
        url: repository.url
      },
      stats: {
        commits,
        contributors,
        languages: languageStats,
        issues: {
          total: Object.values(issueStats).reduce((sum: number, count: any) => sum + count, 0),
          ...issueStats
        },
        pullRequests: {
          total: Object.values(prStats).reduce((sum: number, count: any) => sum + count, 0),
          ...prStats
        }
      },
      analyses: analyses.map(a => ({ type: a.type, data: a.data }))
    });
  } catch (error) {
    next(error);
  }
});

// Exportar relatório em CSV
router.get('/repository/:id/export/csv', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    // Verificar se o repositório pertence ao usuário
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!repository) {
      throw createError('Repositório não encontrado', 404);
    }

    // Buscar dados para exportação
    const [commits, contributors, languages, issues, pullRequests] = await Promise.all([
      prisma.commit.findMany({
        where: { repositoryId: id },
        orderBy: { date: 'desc' }
      }),
      prisma.contributor.findMany({
        where: { repositoryId: id },
        orderBy: { commits: 'desc' }
      }),
      prisma.language.findMany({
        where: { repositoryId: id },
        orderBy: { bytes: 'desc' }
      }),
      prisma.issue.findMany({
        where: { repositoryId: id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pullRequest.findMany({
        where: { repositoryId: id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Gerar CSV
    let csv = 'Tipo,Dados\n';
    csv += `Repositório,${repository.fullName}\n`;
    csv += `Descrição,${repository.description || 'N/A'}\n`;
    csv += `Linguagem Principal,${repository.language || 'N/A'}\n`;
    csv += `Stars,${repository.stars}\n`;
    csv += `Forks,${repository.forks}\n`;
    csv += `Watchers,${repository.watchers}\n\n`;

    csv += 'Commits\n';
    csv += 'SHA,Author,Email,Data,Mensagem\n';
    commits.forEach(commit => {
      csv += `${commit.sha},${commit.author},${commit.authorEmail},${commit.date.toISOString()},${commit.message.replace(/,/g, ';')}\n`;
    });

    csv += '\nContribuidores\n';
    csv += 'Username,Commits\n';
    contributors.forEach(contributor => {
      csv += `${contributor.username},${contributor.commits}\n`;
    });

    csv += '\nLinguagens\n';
    csv += 'Nome,Bytes,Percentual\n';
    const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
    languages.forEach(lang => {
      csv += `${lang.name},${lang.bytes},${((lang.bytes / totalBytes) * 100).toFixed(2)}%\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${repository.name}-analysis.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

export { router as analysisRoutes };

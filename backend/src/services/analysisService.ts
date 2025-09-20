import { PrismaClient } from '@prisma/client';
import { GitHubService, GitHubCommit, GitHubContributor, GitHubLanguage, GitHubIssue, GitHubPullRequest } from './githubService';

const prisma = new PrismaClient();

export class AnalysisService {
  private githubService: GitHubService;

  constructor(githubToken: string) {
    this.githubService = new GitHubService(githubToken);
  }

  async analyzeRepository(owner: string, repo: string, userId: string) {
    try {
      // Buscar dados do repositório
      const [repoData, commits, contributors, languages, issues, pullRequests] = await Promise.all([
        this.githubService.getRepository(owner, repo),
        this.githubService.getCommits(owner, repo),
        this.githubService.getContributors(owner, repo),
        this.githubService.getLanguages(owner, repo),
        this.githubService.getIssues(owner, repo),
        this.githubService.getPullRequests(owner, repo)
      ]);

      // Criar ou atualizar repositório no banco
      const repository = await prisma.repository.upsert({
        where: { fullName: repoData.full_name },
        update: {
          description: repoData.description,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          watchers: repoData.watchers_count,
          url: repoData.html_url,
          updatedAt: new Date()
        },
        create: {
          owner: repoData.owner.login,
          name: repoData.name,
          fullName: repoData.full_name,
          description: repoData.description,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          watchers: repoData.watchers_count,
          url: repoData.html_url,
          userId
        }
      });

      // Salvar commits
      await this.saveCommits(repository.id, commits);

      // Salvar contribuidores
      await this.saveContributors(repository.id, contributors);

      // Salvar linguagens
      await this.saveLanguages(repository.id, languages);

      // Salvar issues
      await this.saveIssues(repository.id, issues);

      // Salvar pull requests
      await this.savePullRequests(repository.id, pullRequests);

      // Gerar análises
      const analyses = await this.generateAnalyses(repository.id, {
        commits,
        contributors,
        languages,
        issues,
        pullRequests
      });

      return {
        repository,
        analyses
      };
    } catch (error) {
      throw new Error(`Erro na análise do repositório: ${error}`);
    }
  }

  private async saveCommits(repositoryId: string, commits: GitHubCommit[]) {
    const commitData = commits.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      authorEmail: commit.commit.author.email,
      date: new Date(commit.commit.author.date),
      url: commit.html_url,
      repositoryId
    }));

    await prisma.commit.createMany({
      data: commitData,
      skipDuplicates: true
    });
  }

  private async saveContributors(repositoryId: string, contributors: GitHubContributor[]) {
    const contributorData = contributors.map(contributor => ({
      username: contributor.login,
      avatarUrl: contributor.avatar_url,
      commits: contributor.contributions,
      repositoryId
    }));

    await prisma.contributor.createMany({
      data: contributorData,
      skipDuplicates: true
    });
  }

  private async saveLanguages(repositoryId: string, languages: GitHubLanguage) {
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    
    const languageData = Object.entries(languages).map(([name, bytes]) => ({
      name,
      bytes,
      percentage: (bytes / totalBytes) * 100,
      repositoryId
    }));

    await prisma.language.createMany({
      data: languageData,
      skipDuplicates: true
    });
  }

  private async saveIssues(repositoryId: string, issues: GitHubIssue[]) {
    const issueData = issues.map(issue => ({
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      labels: issue.labels.map(label => label.name),
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at),
      closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
      repositoryId
    }));

    await prisma.issue.createMany({
      data: issueData,
      skipDuplicates: true
    });
  }

  private async savePullRequests(repositoryId: string, pullRequests: GitHubPullRequest[]) {
    const prData = pullRequests.map(pr => ({
      number: pr.number,
      title: pr.title,
      body: pr.body,
      state: pr.state,
      merged: pr.merged,
      createdAt: new Date(pr.created_at),
      updatedAt: new Date(pr.updated_at),
      closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
      repositoryId
    }));

    await prisma.pullRequest.createMany({
      data: prData,
      skipDuplicates: true
    });
  }

  private async generateAnalyses(repositoryId: string, data: any) {
    const analyses = [];

    // Análise de frequência de commits
    const commitFrequency = this.analyzeCommitFrequency(data.commits);
    analyses.push({
      type: 'commit_frequency',
      data: commitFrequency,
      repositoryId
    });

    // Análise de complexidade
    const complexity = this.analyzeComplexity(data);
    analyses.push({
      type: 'complexity',
      data: complexity,
      repositoryId
    });

    // Análise de contribuidores
    const contributorAnalysis = this.analyzeContributors(data.contributors);
    analyses.push({
      type: 'contributors',
      data: contributorAnalysis,
      repositoryId
    });

    // Análise de linguagens
    const languageAnalysis = this.analyzeLanguages(data.languages);
    analyses.push({
      type: 'languages',
      data: languageAnalysis,
      repositoryId
    });

    // Análise de issues e PRs
    const issueAnalysis = this.analyzeIssuesAndPRs(data.issues, data.pullRequests);
    analyses.push({
      type: 'issues_prs',
      data: issueAnalysis,
      repositoryId
    });

    // Salvar análises no banco
    await prisma.analysis.createMany({
      data: analyses.map(analysis => ({
        type: analysis.type,
        data: analysis.data as any,
        repositoryId: analysis.repositoryId
      }))
    });

    return analyses;
  }

  private analyzeCommitFrequency(commits: GitHubCommit[]) {
    const commitsByWeek: { [key: string]: number } = {};
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      commitsByWeek[weekKey] = (commitsByWeek[weekKey] || 0) + 1;
    });

    return {
      commitsByWeek,
      totalCommits: commits.length,
      averageCommitsPerWeek: commits.length / Object.keys(commitsByWeek).length
    };
  }

  private analyzeComplexity(data: any) {
    return {
      totalFiles: 0, // Seria necessário buscar arquivos do repositório
      averageFileSize: 0,
      largestFiles: [],
      mostComplexFiles: []
    };
  }

  private analyzeContributors(contributors: GitHubContributor[]) {
    const sortedContributors = contributors
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10);

    return {
      topContributors: sortedContributors,
      totalContributors: contributors.length,
      averageContributions: contributors.reduce((sum, c) => sum + c.contributions, 0) / contributors.length
    };
  }

  private analyzeLanguages(languages: GitHubLanguage) {
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const languageStats = Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / totalBytes) * 100
      }))
      .sort((a, b) => b.bytes - a.bytes);

    return {
      languages: languageStats,
      totalBytes,
      primaryLanguage: languageStats[0]?.name || 'Unknown'
    };
  }

  private analyzeIssuesAndPRs(issues: GitHubIssue[], pullRequests: GitHubPullRequest[]) {
    const openIssues = issues.filter(i => i.state === 'open').length;
    const closedIssues = issues.filter(i => i.state === 'closed').length;
    const openPRs = pullRequests.filter(pr => pr.state === 'open').length;
    const closedPRs = pullRequests.filter(pr => pr.state === 'closed').length;
    const mergedPRs = pullRequests.filter(pr => pr.merged).length;

    return {
      issues: {
        total: issues.length,
        open: openIssues,
        closed: closedIssues
      },
      pullRequests: {
        total: pullRequests.length,
        open: openPRs,
        closed: closedPRs,
        merged: mergedPRs
      }
    };
  }
}

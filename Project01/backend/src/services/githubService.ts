import axios, { AxiosInstance } from 'axios';

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

export interface GitHubLanguage {
  [key: string]: number;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  labels: Array<{
    name: string;
  }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  merged: boolean;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export class GitHubService {
  private api: AxiosInstance;

  constructor(token: string) {
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Analyzer'
      }
    });
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Repositório não encontrado');
      }
      throw new Error('Erro ao buscar repositório');
    }
  }

  async getCommits(owner: string, repo: string, page: number = 1, perPage: number = 100): Promise<GitHubCommit[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/commits`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar commits');
    }
  }

  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/contributors`);
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar contribuidores');
    }
  }

  async getLanguages(owner: string, repo: string): Promise<GitHubLanguage> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/languages`);
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar linguagens');
    }
  }

  async getIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<GitHubIssue[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/issues`, {
        params: { state, per_page: 100 }
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar issues');
    }
  }

  async getPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<GitHubPullRequest[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/pulls`, {
        params: { state, per_page: 100 }
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar pull requests');
    }
  }

  async getCommitStats(owner: string, repo: string): Promise<any> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/stats/participation`);
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar estatísticas de commits');
    }
  }

  async getCodeFrequency(owner: string, repo: string): Promise<any> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/stats/code_frequency`);
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar frequência de código');
    }
  }
}

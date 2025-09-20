import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Github, 
  Star, 
  GitBranch, 
  Users, 
  Calendar,
  TrendingUp,
  Download,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import RepositoryCard from '../components/RepositoryCard';
import CommitChart from '../components/CommitChart';
import LanguageChart from '../components/LanguageChart';
import ContributorChart from '../components/ContributorChart';
import LoadingSpinner from '../components/LoadingSpinner';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  url: string;
  updatedAt: string;
  _count: {
    commits: number;
    contributors: number;
    issues: number;
    pullRequests: number;
  };
}

interface UserStats {
  totalRepositories: number;
  totalFavorites: number;
  totalCommits: number;
  totalContributors: number;
  totalIssues: number;
  totalPullRequests: number;
  recentRepositories: Repository[];
}

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // Buscar repositórios do usuário
  const { data: repositories, refetch: refetchRepositories } = useQuery(
    'repositories',
    async () => {
      const response = await api.get('/repositories');
      return response.data;
    }
  );

  // Buscar estatísticas do usuário
  const { data: userStats } = useQuery(
    'userStats',
    async () => {
      const response = await api.get('/users/stats');
      return response.data;
    }
  );

  useEffect(() => {
    const repoUrl = searchParams.get('repo');
    if (repoUrl) {
      setRepositoryUrl(decodeURIComponent(repoUrl));
      handleAnalyzeRepository(decodeURIComponent(repoUrl));
    }
  }, [searchParams]);

  const handleAnalyzeRepository = async (url: string) => {
    if (!url) {
      toast.error('Por favor, insira uma URL válida do repositório');
      return;
    }

    setAnalyzing(true);

    try {
      const response = await api.post('/repositories/analyze', {
        repositoryUrl: url
      });

      toast.success('Repositório analisado com sucesso!');
      refetchRepositories();
      setRepositoryUrl('');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao analisar repositório');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyzeRepository(repositoryUrl);
  };

  const handleExportCSV = async (repositoryId: string) => {
    try {
      const response = await api.get(`/analysis/repository/${repositoryId}/export/csv`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `repository-${repositoryId}-analysis.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Analise e monitore seus repositórios do GitHub
        </p>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Github className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Repositórios</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats.totalRepositories}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Favoritos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats.totalFavorites}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Commits</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats.totalCommits}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Contribuidores</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats.totalContributors}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analyze New Repository */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Analisar Novo Repositório
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            placeholder="https://github.com/username/repository"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            className="input flex-1"
            required
          />
          <button
            type="submit"
            disabled={analyzing}
            className="btn-primary px-6 py-2 whitespace-nowrap disabled:opacity-50"
          >
            {analyzing ? 'Analisando...' : 'Analisar'}
          </button>
        </form>
      </div>

      {/* Recent Repositories */}
      {repositories && repositories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Seus Repositórios
            </h2>
            <span className="text-sm text-gray-500">
              {repositories.length} repositório{repositories.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo: Repository) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onExport={() => handleExportCSV(repo.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      {repositories && repositories.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Commits por Semana
            </h3>
            <CommitChart repositories={repositories} />
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribuição de Linguagens
            </h3>
            <LanguageChart repositories={repositories} />
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Contribuidores
            </h3>
            <ContributorChart repositories={repositories} />
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estatísticas Gerais
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Issues</span>
                <span className="font-semibold">{userStats?.totalIssues || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Pull Requests</span>
                <span className="font-semibold">{userStats?.totalPullRequests || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Repositórios Favoritos</span>
                <span className="font-semibold">{userStats?.totalFavorites || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {repositories && repositories.length === 0 && (
        <div className="text-center py-12">
          <Github className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum repositório analisado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece analisando um repositório do GitHub.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

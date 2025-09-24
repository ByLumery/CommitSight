import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import { 
  Github, 
  Star, 
  GitBranch, 
  Users, 
  Calendar,
  Download,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import CommitChart from '../components/CommitChart';
import LanguageChart from '../components/LanguageChart';
import ContributorChart from '../components/ContributorChart';
import toast from 'react-hot-toast';

const RepositoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: repository, isLoading } = useQuery(
    ['repository', id],
    async () => {
      const response = await api.get(`/repositories/${id}`);
      return response.data;
    },
    {
      enabled: !!id
    }
  );

  const handleExportCSV = async () => {
    try {
      const response = await api.get(`/analysis/repository/${id}/export/csv`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `repository-${safeRepository.name}-analysis.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Carregando repositório..." />;
  }

  if (!repository) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Repositório não encontrado</h3>
        <p className="text-gray-500 mt-2">O repositório solicitado não existe ou você não tem permissão para visualizá-lo.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  // Add safety checks for repository properties
  const safeRepository = {
    ...repository,
    name: repository.name || 'Unknown',
    fullName: repository.fullName || repository.name || 'Unknown',
    description: repository.description || '',
    language: repository.language || '',
    stars: repository.stars || 0,
    forks: repository.forks || 0,
    url: repository.url || '#',
    updatedAt: repository.updatedAt || new Date().toISOString(),
    commits: repository.commits || [],
    _count: repository._count || {
      commits: 0,
      contributors: 0,
      issues: 0,
      pullRequests: 0
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{safeRepository.name}</h1>
            <p className="text-gray-600">{safeRepository.fullName}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="btn-outline flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </button>
          <a
            href={safeRepository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Ver no GitHub</span>
          </a>
        </div>
      </div>

      {/* Repository Info */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-2">
              <Star className="h-5 w-5" />
              <span className="text-2xl font-bold">{safeRepository.stars}</span>
            </div>
            <p className="text-sm text-gray-500">Stars</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-2">
              <GitBranch className="h-5 w-5" />
              <span className="text-2xl font-bold">{safeRepository.forks}</span>
            </div>
            <p className="text-sm text-gray-500">Forks</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-2">
              <Users className="h-5 w-5" />
              <span className="text-2xl font-bold">{safeRepository._count.contributors}</span>
            </div>
            <p className="text-sm text-gray-500">Contribuidores</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-2">
              <Calendar className="h-5 w-5" />
              <span className="text-2xl font-bold">{safeRepository._count.commits}</span>
            </div>
            <p className="text-sm text-gray-500">Commits</p>
          </div>
        </div>

        {safeRepository.description && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-600">{safeRepository.description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Linguagem Principal</h4>
              <div className="flex items-center space-x-2">
                {safeRepository.language && (
                  <>
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-600">{safeRepository.language}</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Última Atualização</h4>
              <p className="text-gray-600">{formatDate(safeRepository.updatedAt)}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Issues</h4>
              <p className="text-gray-600">{safeRepository._count.issues} issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Commits por Semana
          </h3>
          <CommitChart repositories={[safeRepository]} />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição de Linguagens
          </h3>
          <LanguageChart repositories={[safeRepository]} />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Contribuidores
          </h3>
          <ContributorChart repositories={[safeRepository]} />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estatísticas Gerais
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Commits</span>
              <span className="font-semibold">{safeRepository._count.commits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Contribuidores</span>
              <span className="font-semibold">{safeRepository._count.contributors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Issues</span>
              <span className="font-semibold">{safeRepository._count.issues}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Pull Requests</span>
              <span className="font-semibold">{safeRepository._count.pullRequests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Commits */}
      {safeRepository.commits && safeRepository.commits.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Commits Recentes
          </h3>
          <div className="space-y-3">
            {safeRepository.commits.slice(0, 10).map((commit: any) => (
              <div key={commit.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Github className="h-4 w-4 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {commit.message}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{commit.author}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(commit.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryDetail;

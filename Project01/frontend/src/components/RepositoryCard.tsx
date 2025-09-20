import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Star, 
  GitBranch, 
  Users, 
  Calendar,
  Download,
  Heart,
  ExternalLink
} from 'lucide-react';

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

interface RepositoryCardProps {
  repository: Repository;
  onExport: () => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository, onExport }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Github className="h-6 w-6 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {repository.name}
            </h3>
            <p className="text-sm text-gray-500">{repository.fullName}</p>
          </div>
        </div>
        <button
          onClick={onExport}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Exportar relatório"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      {repository.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {repository.description}
        </p>
      )}

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
        {repository.language && (
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span>{repository.language}</span>
          </span>
        )}
        <span className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(repository.updatedAt)}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <Star className="h-4 w-4" />
            <span className="text-sm">{repository.stars}</span>
          </div>
          <p className="text-xs text-gray-500">Stars</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <GitBranch className="h-4 w-4" />
            <span className="text-sm">{repository.forks}</span>
          </div>
          <p className="text-xs text-gray-500">Forks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {repository._count.commits}
          </div>
          <p className="text-xs text-gray-500">Commits</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {repository._count.contributors}
          </div>
          <p className="text-xs text-gray-500">Contribuidores</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/repository/${repository.id}`}
          className="flex-1 btn-primary text-center py-2 text-sm"
        >
          Ver Detalhes
        </Link>
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline px-3 py-2 text-sm"
          title="Abrir no GitHub"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default RepositoryCard;

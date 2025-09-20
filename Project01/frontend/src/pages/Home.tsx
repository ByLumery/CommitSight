import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Github, BarChart3, Users, Code, Star, GitBranch } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [repositoryUrl, setRepositoryUrl] = useState('');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (repositoryUrl) {
      // Redirecionar para dashboard com URL do repositório
      window.location.href = `/dashboard?repo=${encodeURIComponent(repositoryUrl)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">CommitSight</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary px-4 py-2"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary px-4 py-2"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Analise seus repositórios do{' '}
            <span className="text-primary-600">GitHub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Obtenha insights detalhados sobre commits, contribuidores, linguagens e muito mais. 
            Transforme dados em conhecimento.
          </p>

          {/* Repository Input */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
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
                className="btn-primary px-8 py-3 whitespace-nowrap"
              >
                Analisar Repositório
              </button>
            </form>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise de Commits</h3>
              <p className="text-gray-600">
                Visualize a frequência de commits e padrões de desenvolvimento
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contribuidores</h3>
              <p className="text-gray-600">
                Identifique os principais contribuidores e sua atividade
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Code className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Linguagens</h3>
              <p className="text-gray-600">
                Veja a distribuição de linguagens e tecnologias utilizadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que usar o CommitSight?
            </h2>
            <p className="text-lg text-gray-600">
              Ferramentas poderosas para desenvolvedores e equipes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Gratuito</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">API</h3>
              <p className="text-gray-600">GitHub Oficial</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Visual</h3>
              <p className="text-gray-600">Dashboards</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Equipe</h3>
              <p className="text-gray-600">Colaboração</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Github className="h-6 w-6" />
            <span className="text-lg font-semibold">CommitSight</span>
          </div>
          <p className="text-gray-400">
            © 2024 CommitSight. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

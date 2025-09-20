import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const { data: userStats } = useQuery(
    'userStats',
    async () => {
      const response = await api.get('/users/stats');
      return response.data;
    }
  );

  const { data: userProfile } = useQuery(
    'userProfile',
    async () => {
      const response = await api.get('/users/profile');
      return response.data;
    }
  );

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleSave = async () => {
    try {
      await api.put('/users/profile', formData);
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      // Recarregar dados do usuário
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao atualizar perfil');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
        <p className="mt-2 text-gray-600">
          Gerencie suas informações pessoais e visualize suas estatísticas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user?.name || 'Usuário'}
                    </h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Membro desde</p>
                      <p className="text-sm text-gray-600">
                        {userProfile?.createdAt ? 
                          new Date(userProfile.createdAt).toLocaleDateString('pt-BR') : 
                          'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Estatísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Repositórios</span>
                <span className="font-semibold text-lg">
                  {userStats?.totalRepositories || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Favoritos</span>
                <span className="font-semibold text-lg">
                  {userStats?.totalFavorites || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Commits</span>
                <span className="font-semibold text-lg">
                  {userStats?.totalCommits || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Contribuidores</span>
                <span className="font-semibold text-lg">
                  {userStats?.totalContributors || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Issues</span>
                <span className="font-semibold">
                  {userStats?.totalIssues || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pull Requests</span>
                <span className="font-semibold">
                  {userStats?.totalPullRequests || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Repositories */}
      {userStats?.recentRepositories && userStats.recentRepositories.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Repositórios Recentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStats.recentRepositories.map((repo: any) => (
              <div key={repo.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 truncate">{repo.name}</h4>
                <p className="text-sm text-gray-600">{repo.fullName}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{repo.language || 'N/A'}</span>
                  <span>⭐ {repo.stars}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

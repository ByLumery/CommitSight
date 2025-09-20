import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Repository {
  id: string;
  contributors: Array<{
    username: string;
    commits: number;
  }>;
}

interface ContributorChartProps {
  repositories: Repository[];
}

const ContributorChart: React.FC<ContributorChartProps> = ({ repositories }) => {
  // Processar dados para o gráfico
  const processContributorData = () => {
    const contributorData: { [key: string]: number } = {};
    
    repositories.forEach(repo => {
      repo.contributors?.forEach(contributor => {
        contributorData[contributor.username] = 
          (contributorData[contributor.username] || 0) + contributor.commits;
      });
    });

    // Converter para array e ordenar por commits
    return Object.entries(contributorData)
      .map(([username, commits]) => ({ username, commits }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10); // Top 10 contribuidores
  };

  const data = processContributorData();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Nenhum dado de contribuidor disponível</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="username" 
            type="category" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [value, 'Commits']}
            labelFormatter={(label) => `@${label}`}
          />
          <Bar dataKey="commits" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContributorChart;

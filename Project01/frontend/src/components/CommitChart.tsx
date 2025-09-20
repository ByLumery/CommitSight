import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Repository {
  id: string;
  commits: Array<{
    date: string;
  }>;
}

interface CommitChartProps {
  repositories: Repository[];
}

const CommitChart: React.FC<CommitChartProps> = ({ repositories }) => {
  // Processar dados para o gráfico
  const processCommitData = () => {
    const commitData: { [key: string]: number } = {};
    
    repositories.forEach(repo => {
      repo.commits?.forEach(commit => {
        const date = new Date(commit.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        commitData[weekKey] = (commitData[weekKey] || 0) + 1;
      });
    });

    // Converter para array e ordenar por data
    return Object.entries(commitData)
      .map(([date, commits]) => ({ date, commits }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12); // Últimas 12 semanas
  };

  const data = processCommitData();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Nenhum dado de commit disponível</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('pt-BR');
            }}
            formatter={(value: number) => [value, 'Commits']}
          />
          <Line 
            type="monotone" 
            dataKey="commits" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommitChart;

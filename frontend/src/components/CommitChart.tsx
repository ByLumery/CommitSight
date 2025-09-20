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
  // Process data for the chart
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

    // Convert to array and sort by date
    return Object.entries(commitData)
      .map(([date, commits]) => ({ date, commits }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12); // Last 12 weeks
  };

  const data = processCommitData();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No commit data available</p>
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
            tickFormatter={(value: string) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value: string) => {
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

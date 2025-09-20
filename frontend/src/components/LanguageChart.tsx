import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface Repository {
  id: string;
  languages: Array<{
    name: string;
    bytes: number;
    percentage: number;
  }>;
}

interface LanguageChartProps {
  repositories: Repository[];
}

const LanguageChart: React.FC<LanguageChartProps> = ({ repositories }) => {
  // Process data for the chart
  const processLanguageData = () => {
    const languageData: { [key: string]: number } = {};
    
    repositories.forEach(repo => {
      repo.languages?.forEach(lang => {
        languageData[lang.name] = (languageData[lang.name] || 0) + lang.bytes;
      });
    });

    // Convert to array and sort by bytes
    return Object.entries(languageData)
      .map(([name, bytes]) => ({ name, bytes }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8); // Top 8 languages
  };

  const data = processLanguageData();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No language data available</p>
      </div>
    );
  }

  // Colors for the chart
  const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="bytes"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [formatBytes(value), 'Bytes']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LanguageChart;

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
};

export default function DifficultyChart({ difficultyStats }) {
  const data = [
    { name: 'Easy', value: difficultyStats.easy.solved, total: difficultyStats.easy.total },
    { name: 'Medium', value: difficultyStats.medium.solved, total: difficultyStats.medium.total },
    { name: 'Hard', value: difficultyStats.hard.solved, total: difficultyStats.hard.total },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Solved: <span className="font-medium">{data.value}</span> / {data.total}
          </p>
          <p className="text-sm text-gray-600">
            Rate: <span className="font-medium">
              {data.total ? Math.round((data.value / data.total) * 100) : 0}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
        🎯 Difficulty Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Stats breakdown */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="text-center p-2 bg-gray-50 rounded-lg">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: COLORS[item.name.toLowerCase()] }}
            />
            <p className="text-xs font-medium text-gray-700">{item.name}</p>
            <p className="text-lg font-bold" style={{ color: COLORS[item.name.toLowerCase()] }}>
              {item.value}/{item.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

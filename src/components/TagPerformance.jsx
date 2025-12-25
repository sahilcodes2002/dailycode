import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function TagPerformance({ tagStats }) {
  const getColor = (solved, total) => {
    const rate = (solved / total) * 100;
    if (rate >= 80) return '#10b981'; // green
    if (rate >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
          <p className="font-semibold text-gray-900">{data.tagName}</p>
          <p className="text-sm text-gray-600">
            Solved: <span className="font-medium">{data.solved}</span> / {data.total}
          </p>
          <p className="text-sm text-gray-600">
            Rate: <span className="font-medium">
              {Math.round((data.solved / data.total) * 100)}%
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
        🏷️ Top Tags Performance
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={tagStats} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis 
            dataKey="tagName" 
            type="category" 
            width={120}
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="solved" radius={[0, 8, 8, 0]}>
            {tagStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.solved, entry.total)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

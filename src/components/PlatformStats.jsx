import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PLATFORM_COLORS = {
  'LeetCode': '#FFA116',
  'Codeforces': '#1F8ACB',
  'CodeChef': '#5B4638',
  'GeeksForGeeks': '#2F8D46',
  'Other': '#9CA3AF',
};

export default function PlatformStats({ platformStats }) {
  const data = Object.entries(platformStats).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
        💻 Platform Distribution
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
              <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || '#9CA3AF'} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Platform list */}
      <div className="space-y-2 mt-4">
        {data.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[platform.name] || '#9CA3AF' }}
              />
              <span className="text-sm font-medium text-gray-700">{platform.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{platform.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

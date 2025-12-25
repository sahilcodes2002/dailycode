import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function ActivityChart({ data }) {
  const formattedData = data.map(item => ({
    ...item,
    dateLabel: format(parseISO(item.date), 'MMM dd'),
  }));

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
        📈 30-Day Activity
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="dateLabel" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="sent" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorSent)"
            name="Sent"
          />
          <Area 
            type="monotone" 
            dataKey="solved" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorSolved)"
            name="Solved"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

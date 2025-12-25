import { TrendingUp, Flame, Target, Award } from 'lucide-react';

export default function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Current Streak */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-xl border border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <Flame className="w-8 h-8 text-orange-500" />
          <span className="text-xs sm:text-sm text-orange-600 font-medium">🔥 Current</span>
        </div>
        <p className="text-3xl sm:text-4xl font-bold text-orange-700">{stats.currentStreak}</p>
        <p className="text-xs sm:text-sm text-orange-600 mt-1">Day Streak</p>
      </div>

      {/* Total Solved */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <Target className="w-8 h-8 text-green-500" />
          <span className="text-xs sm:text-sm text-green-600 font-medium">✅ Solved</span>
        </div>
        <p className="text-3xl sm:text-4xl font-bold text-green-700">{stats.solvedProblems}</p>
        <p className="text-xs sm:text-sm text-green-600 mt-1">
          of {stats.totalProblems} problems
        </p>
      </div>

      {/* Solve Rate */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="w-8 h-8 text-blue-500" />
          <span className="text-xs sm:text-sm text-blue-600 font-medium">📊 Rate</span>
        </div>
        <p className="text-3xl sm:text-4xl font-bold text-blue-700">{stats.solveRate}%</p>
        <p className="text-xs sm:text-sm text-blue-600 mt-1">Success Rate</p>
      </div>

      {/* Longest Streak */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <Award className="w-8 h-8 text-purple-500" />
          <span className="text-xs sm:text-sm text-purple-600 font-medium">🏆 Best</span>
        </div>
        <p className="text-3xl sm:text-4xl font-bold text-purple-700">{stats.longestStreak}</p>
        <p className="text-xs sm:text-sm text-purple-600 mt-1">Longest Streak</p>
      </div>
    </div>
  );
}

// pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCalls } from '../utils/api';
import Header from '../components/Header';
import ProblemCard from '../components/ProblemCard';
import { toast } from 'react-hot-toast';

export function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("autotoken699")){
      navigate('/signin');
    }else{
      fetchTodayProblems();
    }
    
  }, []);

  const fetchTodayProblems = async () => {
    try {
      setLoading(true);
      const response = await apiCalls.getTodayProblems();
      
      if (response.data.success) {
        setProblems(response.data.problems);
      } else {
        toast.error('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Error loading dashboard');
      // If unauthorized, redirect to signin
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const markAsSolved = async (problemId) => {
    try {
      // Optimistically update UI
      setProblems(prev => prev.map(p => 
        p.problem.id === problemId 
          ? { ...p, solved: !p.solved } 
          : p
      ));

      const currentProblem = problems.find(p => p.problem.id === problemId);
      const newSolvedState = !currentProblem?.solved;

      await apiCalls.toggleProblemSolved(problemId, newSolvedState);
      toast.success(newSolvedState ? 'Marked as solved!' : 'Marked as unsolved!');
    } catch (error) {
      // Revert on error
      setProblems(prev => prev.map(p => 
        p.problem.id === problemId 
          ? { ...p, solved: !p.solved } 
          : p
      ));
      toast.error('Failed to update');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Today's Problems</h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems for today</h3>
            <p className="text-gray-600 mb-4">Check your mail preferences or add new problems</p>
            <button 
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Preferences
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {problems.map((item) => (
              <ProblemCard
                key={item.id}
                problem={item.problem}
                solved={item.solved}
                createdAt={item.created_at}
                message={item.message}
                onClick={() => handleProblemClick(item.problem.id)}
                onMarkSolved={() => markAsSolved(item.problem.id)}
                showStar={false}
              />
            ))}
          </div>
        )}

        {/* Quick stats section */}
        {!loading && problems.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Today's Progress</h2>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-blue-600">{problems.length}</p>
                <p className="text-gray-600">Problems Sent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {problems.filter(p => p.solved).length}
                </p>
                <p className="text-gray-600">Solved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((problems.filter(p => p.solved).length / problems.length) * 100)}%
                </p>
                <p className="text-gray-600">Completion</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
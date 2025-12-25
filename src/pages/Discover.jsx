// pages/Discover.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiCalls } from '../utils/api';
import Header from '../components/Header';
import ProblemCard from '../components/ProblemCard';
import TagSelector from '../components/TagSelector';
import { toast } from 'react-hot-toast';
import { Search, Filter, X } from 'lucide-react';

export function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [starLoading, setStarLoading] = useState({}); // Track loading per problem
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllTags();
    fetchProblems(1); // Initial load
  }, []);

  useEffect(() => {
    // Update URL with current filters (except during initial load)
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (difficulty) params.set('difficulty', difficulty);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    
    const timeoutId = setTimeout(() => {
      setSearchParams(params, { replace: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, difficulty, selectedTags]);

  const fetchAllTags = async () => {
    try {
      const response = await apiCalls.getAllTags();
      if (response.data.success) {
        setAllTags(response.data.tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchProblems = async (page, isSearch = false, shouldAppend = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      // Prepare filters
      const filters = {};
      if (searchQuery) filters.search = searchQuery;  // ⬅️ This sends the URL as 'search' param
      if (selectedTags.length > 0) filters.tagIds = selectedTags.map(Number);
      if (difficulty) filters.difficulty = difficulty;

      const response = await apiCalls.getProblemFeed(page, pagination.limit, filters);  // ⬅️ Calls /problems/feed
      
      if (response.data.success) {
        // For each problem, check if it's in user's collection (starred)
        const problemsWithStatus = await Promise.all(
          response.data.problems.map(async (problem) => {
            try {
              // Check if user has this problem in their collection
              const problemResponse = await apiCalls.getProblem(problem.id);
              const isStarred = problemResponse.data.user_progress !== null;
              
              return {
                ...problem,
                link: problem.link,
                isStarred,
                userProgress: problemResponse.data.user_progress
              };
            } catch (error) {
              console.error(`Error checking problem ${problem.id}:`, error);
              return {
                ...problem,
                link: problem.link,
                isStarred: false,
                userProgress: null
              };
            }
          })
        );
        
        if (shouldAppend) {
          // For "Load More" - append to existing problems
          const currentCount = problems.length;
          setProblems(prev => [...prev, ...problemsWithStatus]);
          
          // Scroll to the first new problem after a short delay
          setTimeout(() => {
            const problemCards = document.querySelectorAll('[data-problem-card]');
            if (problemCards[currentCount]) {
              problemCards[currentCount].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          // For page navigation or initial load - replace problems
          setProblems(problemsWithStatus);
          // Scroll to top of problem list
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Error loading problems');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProblems(1, true);  // ⬅️ Clicking "Search" calls this
  };

  const handleQuickSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      setSearchLoading(true);
      const response = await apiCalls.searchProblems(query);
      
      if (response.data.success) {
        // Check star status for each problem
        const problemsWithStatus = await Promise.all(
          response.data.problems.map(async (problem) => {
            try {
              const problemResponse = await apiCalls.getProblem(problem.id);
              const isStarred = problemResponse.data.user_progress !== null;
              
              return {
                id: problem.id,
                title: problem.title,
                link: problem.problem_link,
                difficulty: problem.difficulty,
                tags: [],
                isStarred,
                userProgress: problemResponse.data.user_progress
              };
            } catch (error) {
              return {
                id: problem.id,
                title: problem.title,
                link: problem.problem_link,
                difficulty: problem.difficulty,
                tags: [],
                isStarred: false,
                userProgress: null
              };
            }
          })
        );
        
        setProblems(problemsWithStatus);
        setPagination({
          page: 1,
          limit: 20,
          total: response.data.problems.length,
          totalPages: 1,
          hasNextPage: false
        });
      }
    } catch (error) {
      console.error('Error in quick search:', error);
      toast.error('Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      fetchProblems(pagination.page + 1, false, true); // shouldAppend = true
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setDifficulty('');
    setSearchParams({}); // Clear URL params
    fetchProblems(1, true);
  };

  const handleTagSelect = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleDifficultySelect = (diff) => {
    setDifficulty(prev => prev === diff ? '' : diff);
  };

  const handleStarToggle = async (problemId, currentlyStarred) => {
    try {
      setStarLoading(prev => ({ ...prev, [problemId]: true }));
      
      // If not starred, calling getProblem will create the entry
      if (!currentlyStarred) {
        await apiCalls.getProblem(problemId);
        toast.success('Problem added to your collection!');
      } else {
        // If already starred, we need to update to unstar
        // We'll mark starred as false in the problem detail page
        // For now, we'll just refresh the status
        await apiCalls.getProblem(problemId); // This will just fetch, not create new entry
      }
      
      // Update local state
      setProblems(prev => prev.map(p => 
        p.id === problemId 
          ? { ...p, isStarred: !currentlyStarred } 
          : p
      ));
      
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error('Failed to update');
    } finally {
      setStarLoading(prev => ({ ...prev, [problemId]: false }));
    }
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Problems</h1>
          <p className="text-gray-600 mt-2">Find coding problems and star them to add to your collection</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search problems by title or URL..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters {showFilters ? '(Hide)' : '(Show)'}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          {searchQuery && (
            <button
              onClick={() => handleQuickSearch(searchQuery)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              Quick search "{searchQuery}"
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>

            {/* Difficulty Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Difficulty</h4>
              <div className="flex gap-2">
                {['A', 'B', 'C', 'D', 'E'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultySelect(diff)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      difficulty === diff 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Tags</h4>
              <TagSelector
                allTags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(selectedTags.length > 0 || difficulty || searchQuery) && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: "{searchQuery}"
              </span>
            )}
            {difficulty && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Difficulty: {difficulty}
              </span>
            )}
            {selectedTags.map(tagId => {
              const tag = allTags.find(t => t.id === tagId);
              return tag ? (
                <span 
                  key={tagId}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {tag.tag_name}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {problems.length} of {pagination.total} problems
              </p>
              {pagination.totalPages > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchProblems(pagination.page - 1, true)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchProblems(pagination.page + 1, true)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Problem Grid */}
            {searchLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : problems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
                <p className="text-gray-600">Try changing your search or filters</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {problems.map((problem, index) => (
                  <div key={problem.id} data-problem-card>
                    <ProblemCard
                      problem={{
                        ...problem,
                        problem_link: problem.link,
                        difficulty: problem.difficulty
                      }}
                      onClick={() => handleProblemClick(problem.id)}
                      showStar={false}
                      isStarred={problem.isStarred}
                      onStarToggle={() => handleStarToggle(problem.id, problem.isStarred)}
                      isLoading={starLoading[problem.id]}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {pagination.hasNextPage && !searchLoading && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Load More Problems
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
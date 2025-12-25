// pages/ProblemDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCalls } from '../utils/api';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';
import { Star, Save, ExternalLink, Calendar, Clock, Flag, Code } from 'lucide-react';
import Editor from '@monaco-editor/react';

export function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Monaco Editor settings
  const [editorLanguage, setEditorLanguage] = useState('cpp');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [formData, setFormData] = useState({
    solution: '',
    Pattern: '',
    mydifficulty: 'A',
    best_time: 0,
    no_solved: 0,
    starred: false,
    importance: 0,
    notes: '',
    solved: false
  });

  useEffect(() => {
    fetchProblemDetails();
  }, [id]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const response = await apiCalls.getProblem(id);
      
      if (response.data.success) {
        setProblem(response.data.problem);
        
        if (response.data.user_progress) {
          setUserProgress(response.data.user_progress);
          setFormData({
            solution: response.data.user_progress.solution || '',
            Pattern: response.data.user_progress.Pattern || '',
            mydifficulty: response.data.user_progress.mydifficulty || 'A',
            best_time: response.data.user_progress.best_time || 0,
            no_solved: response.data.user_progress.no_solved || 0,
            starred: response.data.user_progress.starred || false,
            importance: response.data.user_progress.importance || 0,
            notes: response.data.user_progress.notes || '',
            solved: response.data.user_progress.no_solved > 0 // Simplified check
          });
        } else {
          // New entry - reset to defaults
          setUserProgress(null);
          setFormData({
            solution: '',
            Pattern: '',
            mydifficulty: 'A',
            best_time: 0,
            no_solved: 0,
            starred: false,
            importance: 0,
            notes: '',
            solved: false
          });
        }
      } else {
        toast.error('Failed to load problem');
        navigate('/discover');
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
      toast.error('Error loading problem');
      navigate('/discover');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseInt(value, 10)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        solution: formData.solution,
        Pattern: formData.Pattern,
        mydifficulty: formData.mydifficulty,
        best_time: formData.best_time,
        importance: formData.importance,
        notes: formData.notes,
        starred: formData.starred,
        // If solved is being toggled on, increment no_solved
        increment_solve: !userProgress?.solved && formData.solved,
        solved: formData.solved
      };

      const response = await apiCalls.updateProblem(id, updateData);
      
      if (response.data.success) {
        toast.success('Progress saved!');
        fetchProblemDetails(); // Refresh data
      } else {
        toast.error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Error saving progress');
    } finally {
      setSaving(false);
    }
  };

  const incrementSolveCount = () => {
    setFormData(prev => ({
      ...prev,
      no_solved: prev.no_solved + 1,
      solved: true
    }));
  };

  const handleEditorDidMount = (editor, monaco) => {
    // Configure C++ autocomplete keywords
    monaco.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: () => {
        const suggestions = [
          // Keywords
          { label: 'int', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'int' },
          { label: 'long', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'long' },
          { label: 'long long', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'long long' },
          { label: 'double', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'double' },
          { label: 'char', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'char' },
          { label: 'string', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'string' },
          { label: 'bool', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'bool' },
          { label: 'vector', kind: monaco.languages.CompletionItemKind.Class, insertText: 'vector<$1>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'map', kind: monaco.languages.CompletionItemKind.Class, insertText: 'map<$1, $2>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'set', kind: monaco.languages.CompletionItemKind.Class, insertText: 'set<$1>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'unordered_map', kind: monaco.languages.CompletionItemKind.Class, insertText: 'unordered_map<$1, $2>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'unordered_set', kind: monaco.languages.CompletionItemKind.Class, insertText: 'unordered_set<$1>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'queue', kind: monaco.languages.CompletionItemKind.Class, insertText: 'queue<$1>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'stack', kind: monaco.languages.CompletionItemKind.Class, insertText: 'stack<$1>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'priority_queue', kind: monaco.languages.CompletionItemKind.Class, insertText: 'priority_queue<$1>$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          
          // Common snippets
          { 
            label: 'for loop', 
            kind: monaco.languages.CompletionItemKind.Snippet, 
            insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop'
          },
          { 
            label: 'while loop', 
            kind: monaco.languages.CompletionItemKind.Snippet, 
            insertText: 'while (${1:condition}) {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
          },
          { 
            label: 'if statement', 
            kind: monaco.languages.CompletionItemKind.Snippet, 
            insertText: 'if (${1:condition}) {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
          },
          { 
            label: 'class', 
            kind: monaco.languages.CompletionItemKind.Snippet, 
            insertText: 'class ${1:ClassName} {\npublic:\n\t${1:ClassName}() {}\n\t$0\n};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
          },
          
          // Common methods
          { label: 'cout', kind: monaco.languages.CompletionItemKind.Function, insertText: 'cout << $0 << endl;', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'cin', kind: monaco.languages.CompletionItemKind.Function, insertText: 'cin >> $0;', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'printf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'printf("$1", $0);', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'scanf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'scanf("$1", &$0);', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
        ];
        return { suggestions };
      }
    });

    // Configure Python autocomplete
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: () => {
        const suggestions = [
          { label: 'def', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'def ${1:function_name}(${2:params}):\n\t$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class ${1:ClassName}:\n\t$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition}:\n\t$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:item} in ${2:iterable}:\n\t$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition}:\n\t$0', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print($0)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'len', kind: monaco.languages.CompletionItemKind.Function, insertText: 'len($0)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'range', kind: monaco.languages.CompletionItemKind.Function, insertText: 'range($0)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'list', kind: monaco.languages.CompletionItemKind.Class, insertText: 'list($0)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'dict', kind: monaco.languages.CompletionItemKind.Class, insertText: 'dict($0)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'set', kind: monaco.languages.CompletionItemKind.Class, insertText: 'set($0)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
        ];
        return { suggestions };
      }
    });

    // Configure Java autocomplete
    monaco.languages.registerCompletionItemProvider('java', {
      provideCompletionItems: () => {
        const suggestions = [
          { label: 'class', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'class ${1:ClassName} {\n\tpublic static void main(String[] args) {\n\t\t$0\n\t}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'public', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'public ' },
          { label: 'private', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'private ' },
          { label: 'static', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'static ' },
          { label: 'void', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'void ' },
          { label: 'String', kind: monaco.languages.CompletionItemKind.Class, insertText: 'String ' },
          { label: 'int', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'int ' },
          { label: 'System.out.println', kind: monaco.languages.CompletionItemKind.Function, insertText: 'System.out.println($0);', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
        ];
        return { suggestions };
      }
    });
  };

  const handleStarToggle = async () => {
    const newStarredValue = !formData.starred;
    
    // Update local state immediately for better UX
    setFormData(prev => ({ ...prev, starred: newStarredValue }));
    
    try {
      // Save to database
      const response = await apiCalls.updateProblem(id, {
        starred: newStarredValue,
      });
      
      if (response.data.success) {
        toast.success(newStarredValue ? 'Added to starred!' : 'Removed from starred');
      } else {
        // Revert on failure
        setFormData(prev => ({ ...prev, starred: !newStarredValue }));
        toast.error('Failed to update');
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      // Revert on error
      setFormData(prev => ({ ...prev, starred: !newStarredValue }));
      toast.error('Error updating star');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem not found</h2>
            <button
              onClick={() => navigate('/discover')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Discover
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Problem Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{problem.title}</h1>
              <div className="flex items-center space-x-4">
                <a
                  href={problem.problem_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open Problem
                </a>
                <span className="text-gray-400">•</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  problem.difficulty === 'A' ? 'bg-green-100 text-green-800' :
                  problem.difficulty === 'B' ? 'bg-blue-100 text-blue-800' :
                  problem.difficulty === 'C' ? 'bg-yellow-100 text-yellow-800' :
                  problem.difficulty === 'D' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Difficulty: {problem.difficulty}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleStarToggle}
              className="p-2 hover:bg-yellow-50 rounded-full transition-colors"
              title={formData.starred ? 'Remove from starred' : 'Add to starred'}
            >
              <Star className={`w-8 h-8 transition-colors ${
                formData.starred 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`} />
            </button>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {problem.tags?.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-600 mb-1">
                <Flag className="w-4 h-4 mr-2" />
                <span className="text-sm">Times Solved</span>
              </div>
              <p className="text-2xl font-bold">{formData.no_solved}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Best Time</span>
              </div>
              <p className="text-2xl font-bold">
                {formData.best_time > 0 ? `${formData.best_time}m` : '--'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Status</span>
              </div>
              <p className={`text-2xl font-bold ${
                formData.solved ? 'text-green-600' : 'text-gray-600'
              }`}>
                {formData.solved ? 'Solved' : 'Unsolved'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-600 mb-1">
                <Star className="w-4 h-4 mr-2" />
                <span className="text-sm">Importance</span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setFormData(prev => ({ ...prev, importance: star }))}
                    className="text-2xl"
                  >
                    {star <= formData.importance ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Solution & Pattern */}
          <div className="space-y-6">
            {/* Solution with Monaco Editor */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  <Code className="inline w-5 h-5 mr-2" />
                  Your Solution
                </h2>
                <div className="flex gap-3">
                  <select
                    value={editorLanguage}
                    onChange={(e) => setEditorLanguage(e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="csharp">C#</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="swift">Swift</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="sql">SQL</option>
                  </select>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="vs-dark">Dark</option>
                    <option value="vs-light">Light</option>
                  </select>
                </div>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Editor
                  height="400px"
                  language={editorLanguage}
                  value={formData.solution}
                  theme={editorTheme}
                  onChange={(value) => setFormData(prev => ({ ...prev, solution: value || '' }))}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    snippetSuggestions: 'inline',
                    tabCompletion: 'on',
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Write or paste your solution code. Use Ctrl+Space for autocomplete.
              </p>
            </div>

            {/* Pattern */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Pattern Identified</h2>
              <input
                type="text"
                name="Pattern"
                value={formData.Pattern}
                onChange={handleInputChange}
                placeholder="e.g., Two Pointers, DP, BFS, etc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes, edge cases, learnings..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Column - Settings & Stats */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Problem Settings</h2>
              
              <div className="space-y-4">
                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Difficulty Rating
                  </label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D', 'E'].map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mydifficulty: diff }))}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          formData.mydifficulty === diff 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Best Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="best_time"
                    value={formData.best_time}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Solve Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Times Solved
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      name="no_solved"
                      value={formData.no_solved}
                      onChange={handleNumberChange}
                      min="0"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={incrementSolveCount}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      +1 Solve
                    </button>
                  </div>
                </div>

                {/* Solved Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="solved"
                    name="solved"
                    checked={formData.solved}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="solved" className="ml-2 text-sm text-gray-700">
                    Mark as solved
                  </label>
                </div>

                {/* Starred Checkbox - remove this or make it read-only */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="starred"
                    name="starred"
                    checked={formData.starred}
                    readOnly
                    className="h-4 w-4 text-yellow-600 rounded cursor-not-allowed opacity-50"
                  />
                  <label htmlFor="starred" className="ml-2 text-sm text-gray-500">
                    Star for revision (use star button above)
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Progress
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/discover')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Discover
                </button>
              </div>
            </div>

            {/* History Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Problem History</h2>
              {userProgress ? (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Added to your collection</p>
                  <p>Last solved: {formData.no_solved > 0 ? `${formData.no_solved} times` : 'Never'}</p>
                  <p>Best time: {formData.best_time > 0 ? `${formData.best_time} minutes` : 'Not set'}</p>
                </div>
              ) : (
                <p className="text-gray-500">This problem is not in your collection yet. Save to add it.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
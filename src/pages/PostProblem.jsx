// pages/PostProblem.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCalls } from '../utils/api';
import Header from '../components/Header';
import TagSelector from '../components/TagSelector';
import { toast } from 'react-hot-toast';
import { Plus, Link as LinkIcon, Save, X, Code } from 'lucide-react';
import Editor from '@monaco-editor/react';

export function PostProblem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    problem_link: '',
    difficulty: 'A',
    tagIds: [],
    solution: '',
    Pattern: '',
    mydifficulty: 'A',
    importance: 0,
    notes: '',
  });

  // Monaco Editor settings
  const [editorLanguage, setEditorLanguage] = useState('cpp');
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  useEffect(() => {
    if (!localStorage.getItem("autotoken699")) {
      navigate('/signin');
    } else {
      fetchTags();
    }
  }, []);

  const fetchTags = async () => {
    try {
      const response = await apiCalls.getAllTags();
      if (response.data.success) {
        setAllTags(response.data.tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseInt(value, 10)
    }));
  };

  const handleTagSelect = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const handleCreateNewTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }

    try {
      const response = await apiCalls.createTag(newTagName.trim());
      if (response.data.success) {
        toast.success('Tag created!');
        setAllTags(prev => [...prev, response.data.tag]);
        setFormData(prev => ({
          ...prev,
          tagIds: [...prev.tagIds, response.data.tag.id]
        }));
        setNewTagName('');
        setShowNewTagInput(false);
      }
    } catch (error) {
      if (error.response?.data?.message === 'Tag already exists') {
        toast.error('Tag already exists');
      } else {
        console.error('Error creating tag:', error);
        toast.error('Failed to create tag');
      }
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.problem_link.trim()) {
      toast.error('Problem link is required');
      return false;
    }
    if (formData.tagIds.length === 0) {
      toast.error('Please select at least one tag');
      return false;
    }
    
    // Validate URL format
    try {
      new URL(formData.problem_link);
    } catch {
      toast.error('Please enter a valid URL');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiCalls.postProblem(formData);
      
      if (response.data.success) {
        toast.success('Problem posted successfully!');
        // Navigate to the problem detail page
        navigate(`/problem/${response.data.problem.id}`);
      } else {
        toast.error('Failed to post problem');
      }
    } catch (error) {
      console.error('Error posting problem:', error);
      toast.error('Error posting problem');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/discover');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post New Problem</h1>
          <p className="text-gray-600 mt-2">
            Add a new coding problem to your collection and share it with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Problem Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Problem Information</h2>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Two Sum, Binary Tree Traversal"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Problem Link */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Link <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="problem_link"
                  value={formData.problem_link}
                  onChange={handleInputChange}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supported platforms: LeetCode, Codeforces, CodeChef, GeeksforGeeks, etc.
              </p>
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A">Easy (A)</option>
                <option value="B">Medium (B)</option>
                <option value="C">Hard (C)</option>
                <option value="D">Very Hard (D)</option>
                <option value="E">Expert (E)</option>
              </select>
            </div>

            {/* Tags Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tags <span className="text-red-500">*</span> (Select at least one)
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewTagInput(!showNewTagInput)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Create New Tag
                </button>
              </div>

              {/* Create New Tag Input */}
              {showNewTagInput && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateNewTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewTagInput(false);
                        setNewTagName('');
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <TagSelector
                allTags={allTags}
                selectedTags={formData.tagIds}
                onTagSelect={handleTagSelect}
              />
            </div>
          </div>

          {/* Personal Notes Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Personal Notes (Optional)</h2>
            
            {/* My Difficulty */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Difficulty Rating
              </label>
              <select
                name="mydifficulty"
                value={formData.mydifficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A">Easy (A)</option>
                <option value="B">Medium (B)</option>
                <option value="C">Hard (C)</option>
                <option value="D">Very Hard (D)</option>
                <option value="E">Expert (E)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                How difficult was this problem for you personally?
              </p>
            </div>

            {/* Importance */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Importance (0-10)
              </label>
              <input
                type="number"
                name="importance"
                value={formData.importance}
                onChange={handleNumberChange}
                min="0"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                How important is it to revisit this problem?
              </p>
            </div>

            {/* Pattern */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pattern / Approach
              </label>
              <input
                type="text"
                name="Pattern"
                value={formData.Pattern}
                onChange={handleInputChange}
                placeholder="e.g., Two Pointers, Dynamic Programming, Binary Search"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Solution with Monaco Editor */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Code className="inline w-4 h-4 mr-1" />
                  Solution / Code
                </label>
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
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Write or paste your solution code. Use Ctrl+Space for autocomplete.
              </p>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Any additional notes, tips, or reminders..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Post Problem
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

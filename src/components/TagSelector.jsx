// components/TagSelector.jsx
import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function TagSelector({ allTags, selectedTags, onTagSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTags = allTags.filter(tag =>
    tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagClick = (tagId) => {
    onTagSelect(tagId);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div>
      {/* Search input for tags */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tags..."
          className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => {
              const tag = allTags.find(t => t.id === tagId);
              return tag ? (
                <div
                  key={tagId}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                >
                  {tag.tag_name}
                  <button
                    onClick={() => handleTagClick(tagId)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Available Tags */}
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
        {filteredTags.length === 0 ? (
          <p className="text-gray-500 text-center py-2">No tags found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.id)}
                className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.tag_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
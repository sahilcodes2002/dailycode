// // components/ProblemCard.jsx
// export default function ProblemCard({ problem, solved, createdAt, message, onClick, onMarkSolved, showAddButton = false,
//   onAddToCollection  }) {
//   // Extract platform from URL
//   const getPlatform = (link) => {
//     if (link.includes('leetcode.com')) return 'LeetCode';
//     if (link.includes('codeforces.com')) return 'Codeforces';
//     if (link.includes('codechef.com')) return 'CodeChef';
//     if (link.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
//     return 'Other';
//   };

//   const platform = getPlatform(problem.problem_link);
  
//   // Platform color mapping
//   const platformColors = {
//     'LeetCode': 'bg-orange-100 text-orange-800',
//     'Codeforces': 'bg-red-100 text-red-800',
//     'CodeChef': 'bg-yellow-100 text-yellow-800',
//     'GeeksforGeeks': 'bg-green-100 text-green-800',
//     'Other': 'bg-gray-100 text-gray-800'
//   };

//   // Difficulty color mapping
//   const difficultyColors = {
//     'A': 'bg-green-100 text-green-800',
//     'B': 'bg-blue-100 text-blue-800',
//     'C': 'bg-yellow-100 text-yellow-800',
//     'D': 'bg-orange-100 text-orange-800',
//     'E': 'bg-red-100 text-red-800'
//   };

//   return (
//     <div 
//       className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg ${
//         solved ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'
//       }`}
//       onClick={onClick}
//     >
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           {/* ... existing platform, difficulty badges */}
          
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">{problem.title}</h3>
          
//           {message && (
//             <p className="text-gray-600 mb-4 italic">"{message}"</p>
//           )}
          
//           {/* Tags section - different for Discover */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             {problem.tags?.map((tag, index) => (
//               <span 
//                 key={index}
//                 className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
//               >
//                 {tag.tag_name}
//               </span>
//             ))}
//           </div>
          
//           {createdAt && (
//             <p className="text-sm text-gray-500">
//               Sent: {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </p>
//           )}
//         </div>
        
//         <div className="flex flex-col space-y-2 ml-4">
//           <a
//             href={problem.problem_link || problem.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
//           >
//             Solve
//           </a>
          
//           {/* Conditional buttons */}
//           {showAddButton ? (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onAddToCollection();
//               }}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               + Add to Collection
//             </button>
//           ) : !solved && onMarkSolved ? (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onMarkSolved();
//               }}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Mark Solved
//             </button>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }


// components/ProblemCard.jsx
import { Star } from 'lucide-react';
import { useState } from 'react';

export default function ProblemCard({ 
  problem, 
  solved, 
  createdAt, 
  message, 
  onClick, 
  onMarkSolved,
  showStar = false,
  onStarToggle,
  isStarred = false,
  isLoading = false
}) {
  // Extract platform from URL
  const getPlatform = (link) => {
    if (link.includes('leetcode.com')) return 'LeetCode';
    if (link.includes('codeforces.com')) return 'Codeforces';
    if (link.includes('codechef.com')) return 'CodeChef';
    if (link.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
    return 'Other';
  };

  const platform = getPlatform(problem.problem_link || problem.link);
  
  // Platform color mapping
  const platformColors = {
    'LeetCode': 'bg-orange-100 text-orange-800',
    'Codeforces': 'bg-red-100 text-red-800',
    'CodeChef': 'bg-yellow-100 text-yellow-800',
    'GeeksforGeeks': 'bg-green-100 text-green-800',
    'Other': 'bg-gray-100 text-gray-800'
  };

  // Difficulty color mapping
  const difficultyColors = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-blue-100 text-blue-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'E': 'bg-red-100 text-red-800'
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    if (onStarToggle && !isLoading) {
      onStarToggle();
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg ${
        solved ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${platformColors[platform]}`}>
              {platform}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
            {solved && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✓ Solved
              </span>
            )}
          </div>
          
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{problem.title}</h3>
            
            {showStar && (
              <button
                onClick={handleStarClick}
                disabled={isLoading}
                className={`ml-4 p-2 rounded-full ${
                  isLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-yellow-50'
                }`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
                  <Star 
                    className={`w-6 h-6 ${
                      isStarred 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  />
                )}
              </button>
            )}
          </div>
          
          {message && (
            <p className="text-gray-600 mb-4 italic">"{message}"</p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {problem.problem_tags?.map((tagObj, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {tagObj.tags?.tag_name}
              </span>
            ))}
            {problem.tags?.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
          
          {createdAt && (
            <p className="text-sm text-gray-500">
              Sent: {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <a
            href={problem.problem_link || problem.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
          >
            Solve
          </a>
          
          {onMarkSolved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkSolved();
              }}
              className={`px-4 py-2 text-white rounded-lg ${
                solved 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {solved ? 'Mark Unsolved' : 'Mark Solved'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
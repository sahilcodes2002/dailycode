// pages/Discover.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiCalls } from '../utils/api';
import Header from '../components/Header';
import ProblemCard from '../components/ProblemCard';
import { toast } from 'react-hot-toast';
import { Search, Filter, X } from 'lucide-react';

// ======= TAG GROUPS (hardcoded) =======
const TAG_GROUPS = {
  "Dynamic Programming": [26, 27, 28, 29, 30, 31, 82, 145, 184, 218, 237, 239, 276, 284, 287, 288, 297, 408, 804, 966, 974, 1005],
  "Greedy": [12, 556],
  "Binary Search": [9, 10, 194, 256],
  "Two Pointers & Sliding Window": [7, 8, 63, 343, 591],
  "Divide and Conquer": [66],
  "Backtracking & Recursion": [24, 25, 513],
  "Brute Force": [78, 191, 382],
  "Meet in the Middle": [62, 103, 538],
  "Arrays": [1, 182, 183, 243, 567],
  "Strings": [2, 69, 70, 71, 72, 73, 74, 75, 87, 100, 315, 317, 318, 380, 497, 499, 528, 600, 680, 722, 723, 835, 851, 893, 935, 969, 1001, 1041, 1059, 1065],
  "Linked List": [21, 122],
  "Stack & Queue": [16, 17, 18, 19, 20, 255, 327, 413],
  "Heap & Priority Queue": [22, 23, 115, 443, 620],
  "Hash & Set & Map": [13, 14, 15, 106, 121, 244, 245, 247, 711],
  "Tree Structures": [33, 34, 35, 48, 84, 157, 172, 299, 648, 789, 817, 841],
  "Segment & Fenwick Tree": [49, 50, 51, 154, 171, 226, 295, 402, 428, 540, 904, 1011],
  "Sparse Table & Range Queries": [52, 53, 65, 253, 377, 485, 867, 878],
  "Union Find / DSU": [46, 47, 85, 358, 791],
  "Advanced Data Structures": [161, 458, 466, 830, 831, 842, 899, 925, 957, 999, 1000, 1066],
  "Graph Basics": [32, 36, 37, 90, 91, 159, 205, 390, 391, 407, 417, 489, 523, 900],
  "Shortest Path": [38, 39, 40, 41, 95, 251, 277, 282, 283, 308, 319, 381],
  "Minimum Spanning Tree": [42, 43, 44, 207, 316, 585, 857, 1052],
  "Topological Sort": [45, 258, 259, 346],
  "Strongly Connected Components": [131, 206, 257, 260, 129, 845, 921],
  "Tree Algorithms (LCA, HLD, etc)": [160, 162, 176, 208, 289, 313, 374, 385, 400, 437, 769, 877, 983, 984, 1038, 1039, 1060],
  "Flow & Matching": [99, 490, 491, 492, 493, 594, 809, 810, 860, 861, 884, 889, 894, 977, 1009],
  "Basic Math": [3, 163, 165, 238, 248, 353, 419, 420, 541, 671, 681, 685, 696, 736],
  "Number Theory": [55, 56, 57, 58, 195, 222, 227, 228, 229, 230, 249, 266, 267, 271, 314, 352, 461, 459, 482, 507, 512, 566, 637, 638, 672, 692, 693, 729, 776, 910, 911, 912, 972, 988, 989, 1008, 1048],
  "Combinatorics & Probability": [59, 60, 94, 130, 174, 197, 212, 250, 355, 359, 427, 456, 577, 917],
  "Geometry": [61, 166, 200, 268, 269, 442, 562, 563, 590, 593, 601, 783, 849, 906, 916, 928, 929, 931, 940, 964, 1044],
  "Matrix": [67, 68, 97, 335, 337, 519, 619, 807, 922, 927, 946, 953, 992, 993, 994, 1055],
  "Bit Manipulation": [4, 86, 128, 196, 235, 242, 448, 558, 605, 699],
  "FFT & Convolution": [102, 204, 321, 376, 455, 828, 918, 962, 965, 975],
  "Game Theory": [54, 92, 285, 291, 292, 294, 386, 951],
  "Interactive": [76, 167],
  "2-SAT": [96, 441],
  "Implementation": [77, 79, 173, 232, 468, 472, 476, 686, 803],
  "Constructive": [80, 139, 803],
  "Prefix & Difference Arrays": [5, 6, 310, 395, 403, 478],
  "Sequences & Permutations": [214, 265, 287, 288, 301, 302, 320, 361, 451, 531, 633, 762, 764, 786, 1057],
  "Sorting": [11, 81, 116, 117, 123, 125, 132, 133, 135],
  "Coordinate Compression": [64, 404],
  "Platforms": [104, 105, 345],
  "Difficulty": [140, 141, 263, 332, 662, 785, 896, 1031],
  "Others": [88, 89, 93, 98, 101, 107, 108, 109, 110, 111, 112, 113, 114, 118, 119, 120, 124, 126, 127, 134, 136, 137, 138, 142, 143, 144, 146, 147, 148, 149, 150, 151, 152, 153, 155, 156, 158, 164, 168, 169, 170, 175, 177, 178, 179, 180, 181, 185, 186, 187, 188, 189, 190, 192, 193, 198, 199, 201, 202, 203, 209, 210, 211, 213, 215, 216, 217, 219, 220, 221, 223, 224, 225, 231, 233, 234, 236, 240, 241, 246, 252, 254, 261, 262, 264, 270, 272, 273, 274, 275, 278, 279, 280, 281, 290, 293, 296, 298, 300, 303, 304, 305, 306, 307, 309, 311, 312, 322, 323, 324, 325, 326, 328, 329, 330, 331, 333, 334, 336, 338, 339, 340, 341, 342, 344, 347, 348, 349, 350, 351, 354, 356, 357, 360, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 375, 378, 379, 383, 384, 387, 388, 389, 392, 393, 394, 396, 397, 398, 399, 401, 405, 406, 409, 410, 411, 412, 414, 415, 416, 418, 421, 422, 423, 424, 425, 426, 429, 430, 431, 432, 433, 434, 435, 436, 438, 439, 440, 444, 445, 446, 447, 449, 450, 452, 453, 454, 457, 460, 462, 463, 464, 465, 467, 469, 470, 471, 473, 474, 475, 477, 479, 480, 481, 483, 484, 486, 487, 488, 494, 495, 496, 498, 500, 501, 502, 503, 504, 505, 506, 508, 509, 510, 511, 514, 515, 516, 517, 518, 520, 521, 522, 524, 525, 526, 527, 529, 530, 532, 533, 534, 535, 536, 537, 539, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 557, 559, 560, 561, 564, 565, 568, 569, 570, 571, 572, 573, 574, 575, 576, 578, 579, 580, 581, 582, 583, 584, 586, 587, 588, 589, 592, 595, 596, 597, 598, 599, 602, 603, 604, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 634, 635, 636, 639, 640, 641, 642, 643, 644, 645, 646, 647, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 663, 664, 665, 666, 667, 668, 669, 670, 673, 674, 675, 676, 677, 678, 679, 682, 683, 684, 687, 688, 689, 690, 691, 694, 695, 697, 698, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 724, 725, 726, 727, 728, 730, 731, 732, 733, 734, 735, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 763, 765, 766, 767, 768, 770, 771, 772, 773, 774, 775, 777, 778, 779, 780, 781, 782, 784, 787, 788, 790, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 805, 806, 808, 811, 812, 813, 814, 815, 816, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 829, 832, 833, 834, 836, 837, 838, 839, 840, 843, 844, 846, 847, 848, 850, 852, 853, 854, 855, 856, 858, 859, 862, 863, 864, 865, 866, 868, 869, 870, 871, 872, 873, 874, 875, 876, 879, 880, 881, 882, 883, 885, 886, 887, 888, 890, 891, 892, 895, 897, 898, 901, 902, 903, 905, 907, 908, 909, 913, 914, 915, 919, 920, 923, 924, 926, 930, 932, 933, 934, 936, 937, 938, 939, 941, 942, 943, 944, 945, 947, 948, 949, 950, 952, 954, 955, 956, 958, 959, 960, 961, 963, 967, 968, 970, 971, 973, 976, 978, 979, 980, 981, 982, 985, 986, 987, 990, 991, 995, 996, 997, 998, 1002, 1003, 1004, 1006, 1007, 1010, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1032, 1033, 1034, 1035, 1036, 1037, 1040, 1042, 1043, 1045, 1046, 1047, 1049, 1050, 1051, 1053, 1054, 1056, 1058, 1061, 1062, 1063, 1064, 1067, 1068, 1069]
};

// Helper to get all tag IDs in all groups
const ALL_GROUP_TAG_IDS = Object.values(TAG_GROUPS).flat();

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
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [groupOptions, setGroupOptions] = useState([]); // [{ name, tagIds }]
  const [ungroupedTags, setUngroupedTags] = useState([]); // [{ id, tag_name }]

  // Tag selection state: selectedGroups (group names), selectedUngroupedTags (tag IDs)
  const [selectedGroups, setSelectedGroups] = useState([]); // group names
  const [selectedUngroupedTags, setSelectedUngroupedTags] = useState([]); // tag IDs

  useEffect(() => {
    fetchAllTags();
    fetchProblems(1); // Initial load
  }, []);

  useEffect(() => {
    // Update URL with current filters (except during initial load)
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (difficulty) params.set('difficulty', difficulty);
    if (selectedGroups.length > 0 || selectedUngroupedTags.length > 0) params.set('tags', selectedTags.join(','));
    
    const timeoutId = setTimeout(() => {
      setSearchParams(params, { replace: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, difficulty, selectedGroups, selectedUngroupedTags]);

  const fetchAllTags = async () => {
    try {
      const response = await apiCalls.getAllTags();
      if (response.data.success) {
        setAllTags(response.data.tags);
        // Compute group options and ungrouped tags
        const tagsById = Object.fromEntries(response.data.tags.map(t => [t.id, t]));
        // Group options
        const groups = Object.entries(TAG_GROUPS).map(([name, tagIds]) => ({
          name,
          tagIds,
          display: name
        }));
        setGroupOptions(groups);
        // Ungrouped tags
        const groupedTagIdSet = new Set(ALL_GROUP_TAG_IDS);
        const ungrouped = response.data.tags.filter(t => !groupedTagIdSet.has(t.id));
        setUngroupedTags(ungrouped);
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
      if (selectedGroups.length > 0 || selectedUngroupedTags.length > 0) filters.tagIds = selectedTags.map(Number);
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
    setSelectedGroups([]);
    setSelectedUngroupedTags([]);
    setDifficulty('');
    setSearchParams({}); // Clear URL params
    fetchProblems(1, true);
  };

  // When user selects a group, toggle it
  const handleGroupSelect = (groupName) => {
    setSelectedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  // When user selects an ungrouped tag, toggle it
  const handleUngroupedTagSelect = (tagId) => {
    setSelectedUngroupedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Compute selectedTags for filter (all tag IDs from selected groups + selected ungrouped tags)
  const selectedTags = [
    ...selectedGroups.flatMap(groupName => {
      const group = groupOptions.find(g => g.name === groupName);
      return group ? group.tagIds : [];
    }),
    ...selectedUngroupedTags
  ];

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
              <h4 className="font-medium text-gray-700 mb-3">Tag Groups</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {groupOptions.map(group => (
                  <button
                    key={group.name}
                    onClick={() => handleGroupSelect(group.name)}
                    className={`px-4 py-2 rounded-lg font-medium border ${
                      selectedGroups.includes(group.name)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {group.display}
                  </button>
                ))}
              </div>
              <h4 className="font-medium text-gray-700 mb-3">Other Tags</h4>
              <div className="flex flex-wrap gap-2">
                {ungroupedTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleUngroupedTagSelect(tag.id)}
                    className={`px-4 py-2 rounded-lg font-medium border ${
                      selectedUngroupedTags.includes(tag.id)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {tag.tag_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(selectedGroups.length > 0 || selectedUngroupedTags.length > 0 || difficulty || searchQuery) && (
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
            {selectedGroups.map(groupName => (
              <span key={groupName} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {groupName}
              </span>
            ))}
            {selectedUngroupedTags.map(tagId => {
              const tag = allTags.find(t => t.id === tagId);
              return tag ? (
                <span key={tagId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
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
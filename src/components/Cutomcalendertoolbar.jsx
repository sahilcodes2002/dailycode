// import React from 'react';

// export function CustomToolbar(props){
//   // Destructure label and onNavigate from props
//   const { label, onNavigate } = props;

//   const handleNavigate = (action) => {
//     if (typeof onNavigate === 'function') {
//       onNavigate(action); // Only call if onNavigate is a function
//     } else {
//       console.error('onNavigate is not a function', onNavigate); // Log the issue
//     }
//   };

//   return (
//     <div className="flex justify-between items-center p-2">
//       <button onClick={() => handleNavigate('PREV')} className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
//         Back
//       </button>
//       <span className="font-bold">{label}</span>
//       <button onClick={() => handleNavigate('NEXT')} className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
//         Next
//       </button>
//       <button onClick={() => handleNavigate('TODAY')} className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
//         Today
//       </button>
//     </div>
//   );
// };



export function CustomToolbar(props) {
  // Destructure label, onNavigate, onView, and view from props
  const { label, onNavigate, view, onView } = props;

  const handleNavigate = (action) => {
    if (typeof onNavigate === 'function') {
      onNavigate(action); // Only call if onNavigate is a function
    } else {
      console.error('onNavigate is not a function', onNavigate); // Log the issue
    }
  };

  const handleViewChange = () => {
    if (typeof onView === 'function') {
      onView('month'); // Switch to month view
    } else {
      console.error('onView is not a function', onView); // Log the issue
    }
  };

  return (
    <div className="flex justify-between items-center p-2">
      {/* Conditionally render Back, Next, and Today buttons based on the current view */}
      {view !== 'day' && (
        <>
          <button
            onClick={() => handleNavigate('PREV')}
            className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={() => handleNavigate('NEXT')}
            className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            Next
          </button>
          <button
            onClick={() => handleNavigate('TODAY')}
            className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            Today
          </button>
        </>
      )}
      
      {/* Show the button to switch to month view when in day view */}
      {view === 'day' && (
        <button
          onClick={handleViewChange}
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          Month View
        </button>
      )}
      
      {/* Always show the label */}
      <span className="font-bold">{label}</span>
    </div>
  );
}


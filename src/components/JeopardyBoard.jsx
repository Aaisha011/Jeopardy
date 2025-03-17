// "use client";

// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { selectQuestion, resetQuestion } from "@/redux/jeopardySlice";

// const JeopardyBoard = () => {
//   const dispatch = useDispatch();
//   const selectedQuestion = useSelector((state) => state.jeopardy.selectedQuestion);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       <h1 className="text-4xl font-bold mb-6">Jeopardy Game</h1>

//       {/* Jeopardy Table */}
//       <div className="grid grid-cols-3 gap-4 bg-blue-600 p-4 rounded-lg shadow-lg">
//         {[100, 200, 500].map((value) => (
//           <button
//             key={value}
//             onClick={() => dispatch(selectQuestion(value))}
//             className="w-32 h-20 bg-yellow-500 text-xl font-semibold rounded-lg hover:bg-yellow-400 transition"
//           >
//             ${value}
//           </button>
//         ))}
//       </div>

//       {/* Selected Question Display */}
//       {selectedQuestion && (
//         <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
//           <p className="text-xl">{selectedQuestion}</p>
//           <button
//             onClick={() => dispatch(resetQuestion())}
//             className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JeopardyBoard;


"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectQuestion, resetQuestion, updateScore } from "@/redux/jeopardySlice"; // Assume updateScore is added to redux slice

const JeopardyBoard = () => {
  const dispatch = useDispatch();

  // Access the Redux state
  const selectedQuestion = useSelector((state) => state.jeopardy.selectedQuestion);
  const score = useSelector((state) => state.jeopardy.score); // Get user score from state

  const handleSelectQuestion = (value) => {
    dispatch(selectQuestion(value));
    dispatch(updateScore(value)); // Update the score when a question is selected
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute top-4 right-4">
        {/* Display User's Score */}
        <p className="text-xl font-bold">
          Score: <span className="text-yellow-400">${score}</span>
        </p>
      </div>

      <h1 className="text-4xl font-bold mb-6">Jeopardy Game</h1>

      {/* Jeopardy Table */}
      <div className="grid grid-cols-3 gap-4 bg-blue-600 p-4 rounded-lg shadow-lg">
        {[100, 200, 500].map((value) => (
          <button
            key={value}
            onClick={() => handleSelectQuestion(value)} // Handle score update
            className="w-32 h-20 bg-yellow-500 text-xl font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            ${value}
          </button>
        ))}
      </div>

      {/* Selected Question Display */}
      {selectedQuestion && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
          <p className="text-xl">{selectedQuestion}</p>
          <button
            onClick={() => dispatch(resetQuestion())}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default JeopardyBoard;

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// // import Navbar from "@/components/Navbar";

// export default function QuizBoard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [questions, setQuestions] = useState([]);
//   const [categorizedQuestions, setCategorizedQuestions] = useState([]);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [userAnswer, setUserAnswer] = useState(null);
//   const [answerStatus, setAnswerStatus] = useState(null);
//   const [answeredQuestions, setAnsweredQuestions] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [score, setScore] = useState(0);
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log("Session Status:", status, "Session:", session);

//     if (status === "loading") {
//       setLoading(true);
//       return;
//     }

//     const newUserId = session?.user?.id || null;

//     if (status === "authenticated" && newUserId) {
//       if (newUserId !== userId) {
//         console.log("User logged in:", newUserId);
//         setUserId(newUserId);
//         const storedAnswers = localStorage.getItem(`answeredQuestions_${newUserId}`);
//         const storedScore = localStorage.getItem(`score_${newUserId}`);
//         setAnsweredQuestions(storedAnswers ? JSON.parse(storedAnswers) : {});
//         setScore(storedScore ? parseInt(storedScore, 10) : 0);
//       }
//     } else if (status === "unauthenticated") {
//       console.log("User logged out, resetting state...");
//       if (userId !== null) {
//         console.log("Clearing local storage for userId:", userId);
//         localStorage.removeItem(`answeredQuestions_${userId}`);
//         localStorage.removeItem(`score_${userId}`);
//       }
//       setUserId(null);
//       setAnsweredQuestions({});
//       setScore(0);
//       setQuestions([]);
//       setCategorizedQuestions([]);
//       setSelectedQuestion(null);
//       setUserAnswer(null);
//       setAnswerStatus(null);
//       setError(null); // Optional: clear error state too
//     }

//     setLoading(false);
//   }, [session, status, userId]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (!userId) {
//         setQuestions([]);
//         setCategorizedQuestions([]);
//         return; // Don’t fetch if logged out
//       }

//       try {
//         setLoading(true);
//         const response = await axios.get(`/api/questions/question`);
        
//         if (response.data.success && Array.isArray(response.data.data)) {
//           setQuestions(response.data.data);
//           const grouped = response.data.data.reduce((acc, question) => {
//             const catName = question.category.name;
//             const existingCat = acc.find((c) => c.name === catName);
//             if (existingCat) {
//               existingCat.questions.push({
//                 id: question.id,
//                 question: question.question,
//                 options: question.options,
//                 correctAns: question.correctAns,
//                 points: question.points,
//               });
//             } else {
//               acc.push({
//                 name: catName,
//                 questions: [
//                   {
//                     id: question.id,
//                     question: question.question,
//                     options: question.options,
//                     correctAns: question.correctAns,
//                     points: question.points,
//                   },
//                 ],
//               });
//             }
//             return acc;
//           }, []);
//           setCategorizedQuestions(grouped);
//         } else {
//           setError("Invalid API response format");
//         }
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//         setError("Failed to load questions");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [userId]);

//   const handleTileClick = (catIndex, questionIndex) => {
//     const key = `${catIndex}-${questionIndex}`;
//     if (answeredQuestions[key]) return;

//     const categoryData = categorizedQuestions[catIndex];
//     const questionObj = categoryData.questions[questionIndex];

//     setSelectedQuestion({
//       category: categoryData.name,
//       catIndex,
//       questionIndex,
//       ...questionObj,
//     });
//     setUserAnswer(null);
//     setAnswerStatus(null);
//   };

//   const handleAnswerSelect = (option) => {
//     if (userAnswer !== null) return;

//     setUserAnswer(option);
//     const key = `${selectedQuestion.catIndex}-${selectedQuestion.questionIndex}`;

//     if (option === selectedQuestion.correctAns) {
//       setAnswerStatus("correct");
//       setScore((prevScore) => {
//         const newScore = prevScore + selectedQuestion.points;
//         if (userId) localStorage.setItem(`score_${userId}`, newScore);
//         return newScore;
//       });
//       setModalMessage("Congratulations! Correct Answer!");
//     } else {
//       setAnswerStatus("incorrect");
//       setModalMessage("Wrong Answer!");
//     }

//     const newAnsweredQuestions = {
//       ...answeredQuestions,
//       [key]: option === selectedQuestion.correctAns ? "correct" : "incorrect",
//     };
//     setAnsweredQuestions(newAnsweredQuestions);
//     if (userId) {
//       localStorage.setItem(`answeredQuestions_${userId}`, JSON.stringify(newAnsweredQuestions));
//     }

//     setTimeout(() => setShowModal(true), 1000);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedQuestion(null);
//     setUserAnswer(null);
//     setAnswerStatus(null);
//   };

//   const handleSubmitScore = async () => {
//     try {
//       if (!userId) throw new Error("User ID is missing.");
//       const response = await axios.post("/api/scores", { userId, score });
//       if (response.data.success) {
//         setModalMessage("Score submitted successfully!");
//         setShowModal(true);
//         router.push("/auth/user");
//       } else {
//         throw new Error(response.data.error || "Failed to store score");
//       }
//     } catch (error) {
//       setModalMessage(error.message || "Failed to store score. Please try again.");
//       setShowModal(true);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gradient-to-t from-gray-300 to-purple-600">
//       {/* <Navbar /> */}
//       <div className="mt-16 w-full max-w-6xl">
//         <div className="absolute right-4 top-20 bg-white text-black font-bold px-5 py-2 rounded-lg shadow-lg">
//           Score: ${score}
//         </div>
//         <h1 className="text-4xl font-bold text-white mb-8 text-center">Jeopardy Quiz Game</h1>

//         {selectedQuestion ? (
//           <div className="text-center bg-white/30 p-8 rounded-lg shadow-lg shadow-purple-900">
//             <h2 className="text-2xl font-bold mb-4 p-3 text-purple-900">
//               {selectedQuestion.category} - ${selectedQuestion.points}
//             </h2>
//             <p className="text-lg mb-7 text-white">{selectedQuestion.question}</p>
//             <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
//               {selectedQuestion.options.map((option, index) => (
//                 <button
//                   key={index}
//                   className={`py-2 px-4 rounded text-white ${
//                     userAnswer === option
//                       ? answerStatus === "correct"
//                         ? "bg-green-600"
//                         : answerStatus === "incorrect"
//                         ? "bg-red-600"
//                         : "bg-purple-700"
//                       : "bg-purple-700 hover:bg-purple-900"
//                   }`}
//                   onClick={() => handleAnswerSelect(option)}
//                   disabled={userAnswer !== null}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-7 p-6 border-2 border-white/30 rounded-md shadow-lg shadow-white">
//             {loading ? (
//               <p className="text-white col-span-3 text-center">Loading questions...</p>
//             ) : error ? (
//               <p className="text-red-700 col-span-3 text-center">{error}</p>
//             ) : Array.isArray(categorizedQuestions) && categorizedQuestions.length > 0 ? (
//               categorizedQuestions.map((category, catIndex) => (
//                 <div key={catIndex} className="flex flex-col">
//                   <h2 className="text-xl font-bold text-white text-center mb-4">
//                     {category.name}
//                   </h2>
//                   {category.questions.map((question, questionIndex) => {
//                     const key = `${catIndex}-${questionIndex}`;
//                     const isAnswered = answeredQuestions[key];
//                     return (
//                       <button
//                         key={questionIndex}
//                         className={`py-4 px-6 mb-2 rounded-lg text-white font-bold ${
//                           isAnswered
//                             ? answeredQuestions[key] === "correct"
//                               ? "bg-green-600"
//                               : "bg-red-600"
//                             : "bg-blue-600 hover:bg-blue-800"
//                         }`}
//                         onClick={() => handleTileClick(catIndex, questionIndex)}
//                         disabled={isAnswered}
//                       >
//                         ${question.points}
//                       </button>
//                     );
//                   })}
//                 </div>
//               ))
//             ) : (
//               <p className="text-white col-span-3 text-center">No questions available</p>
//             )}
//           </div>
//         )}

//         {showModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/50">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <p className="text-lg mb-4">{modalMessage}</p>
//               <button
//                 className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-900"
//                 onClick={closeModal}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       {!selectedQuestion && (
//         <button
//           className="mt-8 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
//           onClick={handleSubmitScore}
//         >
//           Submit Score
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import Navbar from "@/components/Navbar";

export default function QuizBoard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [categorizedQuestions, setCategorizedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Session Status:", status, "Session:", session);

    if (status === "loading") {
      setLoading(true);
      return;
    }

    const newUserId = session?.user?.id || null;

    if (status === "authenticated" && newUserId) {
      if (newUserId !== userId) {
        console.log("User logged in:", newUserId);
        setUserId(newUserId);
        const storedAnswers = localStorage.getItem(`answeredQuestions_${newUserId}`);
        const storedScore = localStorage.getItem(`score_${newUserId}`);
        setAnsweredQuestions(storedAnswers ? JSON.parse(storedAnswers) : {});
        setScore(storedScore ? parseInt(storedScore, 10) : 0);
      }
    } else if (status === "unauthenticated") {
      console.log("User logged out, resetting state...");
      if (userId !== null) {
        console.log("Clearing local storage for userId:", userId);
        localStorage.removeItem(`answeredQuestions_${userId}`);
        localStorage.removeItem(`score_${userId}`);
      }
      setUserId(null);
      setAnsweredQuestions({});
      setScore(0);
      setQuestions([]);
      setCategorizedQuestions([]);
      setSelectedQuestion(null);
      setUserAnswer(null);
      setAnswerStatus(null);
      setError(null);
    }

    setLoading(false);
  }, [session, status, userId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!userId) {
        setQuestions([]);
        setCategorizedQuestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/questions/question`);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setQuestions(response.data.data);
          const grouped = response.data.data.reduce((acc, question) => {
            const catName = question.category.name;
            const existingCat = acc.find((c) => c.name === catName);
            if (existingCat) {
              existingCat.questions.push({
                id: question.id,
                question: question.question,
                options: question.options,
                correctAns: question.correctAns,
                points: question.points,
              });
            } else {
              acc.push({
                name: catName,
                questions: [
                  {
                    id: question.id,
                    question: question.question,
                    options: question.options,
                    correctAns: question.correctAns,
                    points: question.points,
                  },
                ],
              });
            }
            return acc;
          }, []);
          setCategorizedQuestions(grouped);
        } else {
          setError("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userId]);

  const handleTileClick = (catIndex, questionIndex) => {
    const key = `${catIndex}-${questionIndex}`;
    if (answeredQuestions[key]) return;

    const categoryData = categorizedQuestions[catIndex];
    const questionObj = categoryData.questions[questionIndex];

    setSelectedQuestion({
      category: categoryData.name,
      catIndex,
      questionIndex,
      ...questionObj,
    });
    setUserAnswer(null);
    setAnswerStatus(null);
  };

  const handleAnswerSelect = (option) => {
    if (userAnswer !== null) return;

    setUserAnswer(option);
    const key = `${selectedQuestion.catIndex}-${selectedQuestion.questionIndex}`;

    if (option === selectedQuestion.correctAns) {
      setAnswerStatus("correct");
      setScore((prevScore) => {
        const newScore = prevScore + selectedQuestion.points;
        if (userId) localStorage.setItem(`score_${userId}`, newScore);
        return newScore;
      });
      setModalMessage("Congratulations! Correct Answer!");
    } else {
      setAnswerStatus("incorrect");
      setModalMessage("Wrong Answer!");
    }

    const newAnsweredQuestions = {
      ...answeredQuestions,
      [key]: option === selectedQuestion.correctAns ? "correct" : "incorrect",
    };
    setAnsweredQuestions(newAnsweredQuestions);
    if (userId) {
      localStorage.setItem(`answeredQuestions_${userId}`, JSON.stringify(newAnsweredQuestions));
    }

    setTimeout(() => setShowModal(true), 1000);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
    setUserAnswer(null);
    setAnswerStatus(null);
  };

  const handleSubmitScore = async () => {
    try {
      if (!userId) throw new Error("User ID is missing.");
      const response = await axios.post("/api/scores", { userId, score });
      if (response.data.success) {
        setModalMessage("Score submitted successfully!");
        setShowModal(true);
        
        // Reset only the score after successful submission
        setScore(0);
        if (userId) {
          localStorage.setItem(`score_${userId}`, "0"); // Reset localStorage score only
        }
        
        setTimeout(() => {
          router.push("/auth/user"); // Redirect after a delay to allow modal visibility
        }, 2000);
      } else {
        throw new Error(response.data.error || "Failed to store score");
      }
    } catch (error) {
      setModalMessage(error.message || "Failed to store score. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gradient-to-t from-gray-300 to-purple-600">
      {/* <Navbar /> */}
      <div className="mt-16 w-full max-w-6xl">
        <div className="absolute right-4 top-20 bg-white text-black font-bold px-5 py-2 rounded-lg shadow-lg">
          Score: ${score}
        </div>
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Jeopardy Quiz Game</h1>

        {selectedQuestion ? (
          <div className="text-center bg-white/30 p-8 rounded-lg shadow-lg shadow-purple-900">
            <h2 className="text-2xl font-bold mb-4 p-3 text-purple-900">
              {selectedQuestion.category} - ${selectedQuestion.points}
            </h2>
            <p className="text-lg mb-7 text-white">{selectedQuestion.question}</p>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {selectedQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`py-2 px-4 rounded text-white ${
                    userAnswer === option
                      ? answerStatus === "correct"
                        ? "bg-green-600"
                        : answerStatus === "incorrect"
                        ? "bg-red-600"
                        : "bg-purple-700"
                      : "bg-purple-700 hover:bg-purple-900"
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={userAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-7 p-6 border-2 border-white/30 rounded-md shadow-lg shadow-white">
            {loading ? (
              <p className="text-white col-span-3 text-center">Loading questions...</p>
            ) : error ? (
              <p className="text-red-700 col-span-3 text-center">{error}</p>
            ) : Array.isArray(categorizedQuestions) && categorizedQuestions.length > 0 ? (
              categorizedQuestions.map((category, catIndex) => (
                <div key={catIndex} className="flex flex-col">
                  <h2 className="text-xl font-bold text-white text-center mb-4">
                    {category.name}
                  </h2>
                  {category.questions.map((question, questionIndex) => {
                    const key = `${catIndex}-${questionIndex}`;
                    const isAnswered = answeredQuestions[key];
                    return (
                      <button
                        key={questionIndex}
                        className={`py-4 px-6 mb-2 rounded-lg text-white font-bold ${
                          isAnswered
                            ? answeredQuestions[key] === "correct"
                              ? "bg-green-600"
                              : "bg-red-600"
                            : "bg-blue-600 hover:bg-blue-800"
                        }`}
                        onClick={() => handleTileClick(catIndex, questionIndex)}
                        disabled={isAnswered}
                      >
                        ${question.points}
                      </button>
                    );
                  })}
                </div>
              ))
            ) : (
              <p className="text-white col-span-3 text-center">No questions available</p>
            )}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">{modalMessage}</p>
              <button
                className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-900"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {!selectedQuestion && (
        <button
          className="mt-8 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          onClick={handleSubmitScore}
        >
          Submit Score
        </button>
      )}
    </div>
  );
}
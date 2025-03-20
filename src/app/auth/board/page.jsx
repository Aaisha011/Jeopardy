"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import questions from "@/app/api/questions/question/route";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function QuizBoard() {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    fetchUserId();
  }, []);

  const handleTileClick = (catIndex, questionIndex) => {
    const key = `${catIndex}-${questionIndex}`;
    if (answeredQuestions[key]) return; // Prevent reopening answered questions

    const categoryData = questions[catIndex];
    const questionObj = categoryData.questions[questionIndex];

    // Display the selected question
    setSelectedQuestion({
      category: categoryData.category,
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

    if (option === selectedQuestion.answer) {
      setAnswerStatus("correct");
      setAnsweredQuestions((prev) => ({ ...prev, [key]: "correct" }));
      setModalMessage("Congratulations! Correct Answer!");
      setScore((prevScore) => prevScore + selectedQuestion.value);
    } else {
      setAnswerStatus("incorrect");
      setAnsweredQuestions((prev) => ({ ...prev, [key]: "incorrect" }));
      setModalMessage("Wrong Answer!");
    }

    setShowModal(true); // Show modal for feedback
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuestion(null); // Clear question upon closing modal
    setUserAnswer(null);
    setAnswerStatus(null);
  };

  const handleSubmitScore = async () => {
    try {
      if (!userId) {
        throw new Error("User ID is missing.");
      }

      const response = await axios.post("/api/scores", { userId, score });

      // Check if the response indicates successful storage
      if (response.data.success) {
        setModalMessage("Score submitted successfully!");
        setShowModal(true);
        router.push("/auth/user"); // Redirect on success
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
      <Navbar />
      <div className="mt-17">
        <div className="absolute right-4 bg-white text-black font-bold px-5 py-2 rounded-lg shadow-lg">
          Score: {score}
        </div>
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Jeopardy Quiz Game</h1>

        {/* Question display section */}
        {selectedQuestion ? (
          <div className="text-center bg-white/30 p-11 rounded-lg shadow-lg shadow-purple-900 m-17 ">
            <h2 className="text-2xl font-bold mb-4 p-3 text-purple-900">{selectedQuestion.category}</h2>
            <p className="text-lg mb-7 text-white ">{selectedQuestion.question}</p>
            <div className="grid grid-cols-2 gap-4">
              {selectedQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-900 cursor-pointer"
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Category and tiles display
          <div className="grid grid-cols-3 gap-5 m-7 p-11 border-2 border-white/30 rounded-md shadow-lg shadow-white">
            {questions.map((category, catIndex) => (
              <div key={catIndex} className="flex flex-col gap-5">
                <div className="text-center font-bold text-xl py-2 px-5 rounded shadow bg-purple-900 text-white">
                  {category.category}
                </div>
                {category.questions.map((q, questionIndex) => {
                  const tileKey = `${catIndex}-${questionIndex}`;
                  let tileClasses = "bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded";
                  if (answeredQuestions[tileKey] === "correct") {
                    tileClasses = "bg-green-700 text-white font-bold py-2 px-4 rounded cursor-default";
                  } else if (answeredQuestions[tileKey] === "incorrect") {
                    tileClasses = "bg-red-500 text-white font-bold py-2 px-4 rounded cursor-default";
                  }
                  return (
                    <button
                      key={tileKey}
                      className={tileClasses}
                      onClick={() => handleTileClick(catIndex, questionIndex)}
                      disabled={answeredQuestions[tileKey] !== undefined}
                    >
                      ${q.value}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="flex justify-center items-center w-full mt-4 col-span-3">
              <button
                className={`px-7 py-3 rounded-md text-white ${
                  Object.keys(answeredQuestions).length > 0
                    ? "bg-blue-700 hover:bg-blue-800 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={handleSubmitScore}
                disabled={Object.keys(answeredQuestions).length === 0} // Disable button if no questions are answere
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for feedback */}
      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-t from-gray-300 to-purple-600 bg-opacity-50 flex items-center justify-center">
          <div
             className={`p-9 rounded shadow-lg text-white text-center ${
            modalMessage === "Wrong Answer!" ? "bg-red-700 text-white px-11" : "bg-green-700 text-blue"
          }`}
          >
          <p className="text-lg">{modalMessage}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 hover:scale-125 cursor-pointer text-white mt-4 px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

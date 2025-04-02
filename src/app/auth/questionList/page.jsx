// app/admin/questions/page.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

export default function AdminQuestionManager() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [updatedQuestion, setUpdatedQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAns: "",
    points: 0,
    categoryId: null,
  });

  // Fetch questions when component mounts or session status changes
  useEffect(() => {
    const fetchQuestions = async () => {
      if (status === "loading" || status === "unauthenticated") {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("/api/questions/question");
        if (response.data.success && Array.isArray(response.data.data)) {
          setQuestions(response.data.data);
          toast.success("Questions loaded successfully");
        } else {
          setError("Invalid API response format");
          toast.error("An error occurred while loading questions");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions");
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [status]);

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  // Handle edit button click
  const handleEditClick = (question) => {
    setEditingQuestionId(question.id);
    setUpdatedQuestion({
      question: question.question,
      options: [...question.options],
      correctAns: question.correctAns,
      points: question.points,
      categoryId: question.category.id,
    });
  };

  // Handle input changes for question and options
  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newOptions = [...updatedQuestion.options];
      newOptions[index] = value;
      setUpdatedQuestion({ ...updatedQuestion, options: newOptions });
    } else {
      setUpdatedQuestion({ ...updatedQuestion, [name]: value });
    }
  };

  // Handle save (update) of a question
  const handleSave = async (questionId) => {
    try {
      const payload = {
        id: questionId,
        question: updatedQuestion.question,
        options: updatedQuestion.options,
        correctAns: updatedQuestion.correctAns,
        points: parseInt(updatedQuestion.points, 10),
        categoryId: updatedQuestion.categoryId,
      };

      const response = await axios.put("/api/questions/question", payload);
      if (response.data.success) {
        setQuestions(
          questions.map((q) =>
            q.id === questionId ? { ...q, ...response.data.data } : q
          )
        );
        setEditingQuestionId(null);
        toast.success("Question updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update question");
      }
    } catch (err) {
      console.error("Error updating question:", err);
      toast.error(err.message || "Failed to update question");
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingQuestionId(null);
    setUpdatedQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAns: "",
      points: 0,
      categoryId: null,
    });
  };

  if (status === "loading")
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-600 to-purple-300">
        <p className="text-xl text-white">Loading...</p>
      </div>
    );
  if (status === "unauthenticated" || !isAdmin)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-600 to-purple-300">
        <p className="text-red-600 text-xl">Access denied. Admins only.</p>
      </div>
    );
  if (loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-600 to-purple-300">
        <p className="text-xl text-white">Loading questions...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-600 to-purple-300">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-purple-600 to-purple-300">
      <ToastContainer autoClose={3000} position="top-right" />
      <div className="sticky top-0 h-screen w-auto bg-purple-600 text-white p-4 shadow-lg">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col items-center py-8 px-4 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Admin Question Manager</h1>
        <div className="w-full max-w-4xl">
          {questions.length > 0 ? (
            <ul className="space-y-4">
              {questions.map((question) => (
                <li
                  key={question.id}
                  className="p-4 rounded-lg border  bg-purple-700 border-gray-200 shadow-md shadow-black"
                >
                  {editingQuestionId === question.id ? (
                    <div>
                      <input
                        type="text"
                        name="question"
                        value={updatedQuestion.question}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        placeholder="Question"
                      />
                      {updatedQuestion.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => handleInputChange(e, index)}
                          className="w-full p-2 mb-2 border rounded text-black"
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                      <input
                        type="text"
                        name="correctAns"
                        value={updatedQuestion.correctAns}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        placeholder="Correct Answer"
                      />
                      <input
                        type="number"
                        name="points"
                        value={updatedQuestion.points}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        placeholder="Points"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(question.id)}
                          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold text-white">{question.question}</p>
                      <ul className="list-disc pl-5 mt-2">
                        {question.options.map((option, index) => (
                          <li key={index} className="text-gray-200">
                            {option}
                            {option === question.correctAns && (
                              <span className="text-green-300 font-bold"> (Correct)</span>
                            )}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-white">Points: {question.points}</p>
                      <p className="text-white">Category: {question.category.name}</p>
                      <button
                        onClick={() => handleEditClick(question)}
                        className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-white">No questions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
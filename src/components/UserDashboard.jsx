"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // For fetching user details and scores

export default function UserDashboard() {
  const [user, setUser] = useState(null); // To store user details (name, email)
  const [scores, setScores] = useState([]); // To store user's scores
  const [loading, setLoading] = useState(true); // For handling loading state
  const router = useRouter();

  // Fetch user profile and scores on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get("/api/userData"); // Replace with your user endpoint
        const scoresResponse = await axios.get("/api/scores"); // Replace with your scores endpoint
        setUser(userResponse.data);
        console.log(userResponse.data);

        setScores(scoresResponse.data);
        console.log(scoresResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout"); // Replace with your logout endpoint
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle Replay
  const handleReplay = () => {
    router.push("/auth/board"); // Redirect to the quiz game
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-gray-300 to-purple-600">
        <h1 className="text-white text-2xl font-bold">Loading your dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-300 to-purple-600 flex flex-col items-center py-8 px-4">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome, {user?.name}!</h2>
        <p className="text-lg text-gray-700 mb-2"><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* Scores Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-8">
        <h3 className="text-xl font-bold mb-4">Your Scores</h3>
        {scores.length > 0 ? (
          <ul className="list-disc list-inside">
            {scores.map((score, index) => (
              <li key={index} className="text-gray-700">
                <strong>Quiz {index + 1}:</strong> {score} points
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No scores available yet. Play a game to see your scores!</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleReplay}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600"
        >
          Replay Game
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

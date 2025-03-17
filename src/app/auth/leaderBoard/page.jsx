"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
      fetchLeaderboard();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/userData", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });

      setUser(response.data.user);
      setScores(response.data.scores);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("/api/leaderboard");
      const sortedLeaderboard = response.data.sort((a, b) => a.score - b.score); // Sort in ascending order
      setLeaderboard(sortedLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-8 text-center">
        <h2 className="text-2xl font-bold text-black">Welcome, {user?.name || "Guest"}!</h2>
        <p className="text-lg text-gray-700"><strong>Email:</strong> {user?.email || "Not available"}</p>
      </div>

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

      {/* Leaderboard Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-8">
        <h3 className="text-xl font-bold mb-4 text-center">Leaderboard</h3>
        {leaderboard.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Rank</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700 text-center">No scores available yet.</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/auth/board")}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-all"
        >
          Replay Game
        </button>
        <button
          onClick={async () => { await signOut(); router.push("/auth/login"); }}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [totalScore, setTotalScore] = useState(0);


  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
      fetchUserScore();
      fetchLeaderBoard();
    }
  }, [status]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/userData", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });

      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user score
  const fetchUserScore = async () => {
    try {
      const response = await axios.get(`/api/scores?userId=${session?.user?.id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });

      if (response.data.success) {
        setTotalScore(response.data.user.totalScore || 0);
      } else {
        console.error("Error fetching scores:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user scores:", error);
    }
  };

  // Fetch leaderboard data
  const fetchLeaderBoard = async () => {
    try {
      const response = await axios.get("/api/leaderBoard");
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
    toast.success("User has logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-gray-300 to-purple-600">
        <h1 className="text-white text-2xl font-bold">Loading your leaderBoard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-300 to-purple-600 flex flex-col items-center py-8 ">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* User Info Section */}

      {/* <div className="flex flex-row gap-7 text-white">
        <div className="bg-white/50 rounded-lg shadow-lg p-6 w-full max-w-md mb-8 text-center">
        <h2 className="text-2xl font-bold text-black">Welcome, {user?.name || "Guest"}!</h2>
        <p className="text-lg text-gray-700">
          <strong>Email:</strong> {user?.email || "Not available"}
        </p>
        </div> */}

        {/* User Scores Section */}
        {/* <div className="bg-white/50 rounded-lg shadow-lg p-6 w-full max-w-md   mb-8">
        <h3 className="text-xl font-bold mb-4">Your Total Score</h3>
        <p className="text-gray-700 text-lg font-semibold">
          {totalScore > 0 ? `${totalScore} points` : "No scores available yet. Play a game to see your score!"}
        </p>
        </div>
      </div> */}

      {/* Leaderboard Section */}
      <div className="bg-white/20 rounded-lg shadow-lg shadow-white p-3 w-full max-w-4xl mb-8">
        <h3 className="text-xl font-bold mb-4 text-center">Leaderboard</h3>
        {leaderboard.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 rounded-md">
                <th className="border border-gray-300 px-4 py-2">Rank</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{entry.rank}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700 text-center">No scores available yet.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/auth/board")}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-all"
        >
          Replay Game
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

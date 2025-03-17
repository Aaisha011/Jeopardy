"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/userData", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      setUser(response.data.user);
      setScores(response.data.scores);
      toast.success("User data loaded successfully!");
    } catch (error) {
      console.error("Error fetching user data:", error);

      if (error.response?.status === 401) {
        toast.error("Unauthorized! Redirecting to login.");
        router.push("/auth/login");
      } else {
        toast.error("Failed to fetch user data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  const handleReplay = () => {
    router.push("/auth/board");
    toast.info("Redirecting to replay...");
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
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Welcome, {user?.name || "Guest"}!
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          <strong>Email:</strong> {user?.email || "Not available"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-8">
        <h3 className="text-xl font-bold mb-4">Your Scores</h3>
        {scores.length > 0 ? (
          <ul className="list-disc list-inside">
            {scores.map((score, index) => (
              <li key={index} className="text-gray-700">
                <strong>Quiz {index + 1}:</strong> {score.score} points
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No scores available yet. Play a game to see your scores!</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleReplay}
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

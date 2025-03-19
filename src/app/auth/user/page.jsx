"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; // Wait for session to be ready

    if (!session || !session.user?.id) {
      router.push("/auth/login");
      return;
    }

    fetchUserData();
    fetchUserScore();
  }, [session, status, router]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/userData`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user scores
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

  // Handle Logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
    toast.success("User has logged out successfully");
  };

  // Handle Replay
  const handleReplay = () => {
    router.push("/auth/board");
  };

  if (loading || status === "loading") {
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
        <h2 className="text-2xl font-bold mb-4 text-center">
          Welcome, {user?.name || session?.user?.name}!
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          <strong>Email:</strong> {user?.email || session?.user?.email}
        </p>
      </div>

      {/* Scores Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-8">
        <h3 className="text-xl font-bold mb-4">Your Total Score</h3>
        <p className="text-gray-700 text-lg font-semibold">
          {totalScore > 0 ? `${totalScore} points` : "No scores available yet. Play a game to see your score!"}
        </p>
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

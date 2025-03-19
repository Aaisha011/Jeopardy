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
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If session is loaded and there's no session, redirect to login.
    if (status !== "loading" && !session) {
      router.push("/auth/login");
      return;
    }
    // If session exists, fetch user data and scores
    if (session && session.accessToken) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("/api/userData", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setUser(response.data.user);
          setScores(response.data.scores); // Fetch and set scores from API
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [session, status, router]);

  // Handle Logout using NextAuth signOut
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
    toast.success("User has logged out successfully");
  };

  // Handle Replay
  const handleReplay = () => {
    router.push("/auth/board"); // Redirect to the quiz game
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
          <p className="text-gray-700">
            No scores available yet. Play a game to see your scores!
          </p>
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

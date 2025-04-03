"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Subscription() {
  const { data: session, status } = useSession();
  const [type, setType] = useState("");
  const [userPoints, setUserPoints] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData();
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      const scoreResponse = await axios.get(`/api/scores?userId=${session.user.id}`);
      const score = scoreResponse.data.success ? (scoreResponse.data.user?.score ?? 0) : 0;
      setUserPoints(score);

      setCurrentSubscription(session.user.subscriptionType || "free");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserPoints(0);
      setCurrentSubscription("free");
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!type) {
      toast.error("Please select a subscription type");
      return;
    }

    if (!session?.user?.id) {
      toast.error("Please log in to subscribe");
      return;
    }

    try {
      const response = await axios.post("/api/subscription", {
        userId: session.user.id,
        subscriptionType: type,
      });
      const { points, user } = response.data;

      setUserPoints(points);
      setCurrentSubscription(type);
      toast.success(`Subscribed to ${type} plan! New points: ${points}`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Subscription failed";
      toast.error(errorMsg);
    }
  };

  if (status === "loading" || loading) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Please log in to manage your subscription.</p>;
  }

  return (
    <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-300 min-h-screen flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-white mb-6">Manage Your Subscription</h2>
      {userPoints !== null && (
        <p className="text-white mb-4">Your Points: {userPoints}</p>
      )}
      <p className="text-white mb-4">Current Subscription: {currentSubscription || "Free"}</p>

      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <label className="block text-gray-700 mb-2">Choose a Plan:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Select a plan</option>
          <option value="1month">1 Month (10 points)</option>
          <option value="6month">6 Months (50 points)</option>
          <option value="lifetime">Lifetime (200 points)</option>
        </select>
        <button
          onClick={handleSubscribe}
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-500 active:bg-green-700"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
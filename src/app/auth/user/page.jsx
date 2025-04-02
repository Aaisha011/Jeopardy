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
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user?.id) {
      router.push("/auth/login");
      return;
    }

    fetchUserData();
    fetchUserScore();
    fetchPurchasedProducts();
  }, [session, status, router]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/userData`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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

  const fetchPurchasedProducts = async () => {
    try {
      const response = await axios.get(`/api/store/purchase?userId=${session?.user?.id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (response.data.success) {
        setPurchasedProducts(response.data.purchases || []);
      } else {
        console.error("Error fetching purchases:", response.data.message);
        setPurchasedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      setPurchasedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
    toast.success("User has logged out successfully");
  };

  const handleReplay = () => {
    router.push("/auth/board");
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-gray-200 to-purple-700">
        <div className="text-white text-2xl font-semibold animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-200 to-purple-700 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <header className="w-full max-w-3xl mb-10">
        <h1 className="text-4xl font-bold text-white text-center tracking-tight">
          User Dashboard
        </h1>
        <p className="text-lg text-purple-100 text-center mt-2">
          Manage your profile, scores, and purchases
        </p>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-row justify-center gap-7">
        {/* Profile Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Welcome, {user?.name || session?.user?.name}!
          </h2>
          <div className="text-gray-700 space-y-2">
            <p className="text-lg">
              <span className="font-medium text-purple-700">Email:</span>{" "}
              {user?.email || session?.user?.email}
            </p>
          </div>
        </section>

        {/* Scores Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Total Score</h3>
          <p className="text-2xl text-purple-600 font-bold">
            {totalScore > 0 ? `${totalScore} Points` : "No scores yet"}
          </p>
          {totalScore === 0 && (
            <p className="text-gray-600 mt-2">Play a game to earn points!</p>
          )}
        </section>
        </div>

        {/* Purchased Products Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Purchased Products</h3>
          {purchasedProducts.length === 0 ? (
            <p className="text-gray-600">No products purchased yet.</p>
          ) : (
            <ul className="space-y-4 max-h-64 overflow-y-auto">
              {purchasedProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-col pb-3 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-gray-800 font-medium">{product.productName}</span>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Price: ${product.price}</span>
                    <span>
                      Purchased: {new Date(product.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={handleReplay}
            className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-700 active:bg-green-800 transition-all duration-200 transform hover:scale-105"
          >
            Replay Game
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
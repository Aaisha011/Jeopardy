"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(null);
  const [cartCount, setCartCount] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      console.log("Starting fetch with session:", session);
      fetchCart();
      fetchUserData();
    } else {
      console.log("Skipping fetch. Status:", status, "Session:", session);
    }
  }, [status, session?.user?.id]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/store/cart");
      const res = response.data;
      setCart(res);
      updateCartCount(res.length);
      console.log("Cart data:", res);
    } catch (err) {
      console.error("Error fetching cart data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        const scoreResponse = await axios.get(`/api/scores?userId=${session.user.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Fetched score data:", scoreResponse.data);
        let score = scoreResponse.data.success ? (scoreResponse.data.user?.totalScore ?? 0) : 0;
        setUserPoints(score);

        const cartResponse = await axios.get("/api/store/cart");
        console.log("Fetched cart data:", cartResponse.data);
        setCart(cartResponse.data);
        setCartCount(cartResponse.data.length);
      } catch (error) {
        console.error("Error fetching user data or cart:", error);
        setUserPoints(0);
      }
    }
  };
  const updateCartCount = (count) => {
    if (typeof window !== "undefined") {
      const cartCount = document.getElementById("cart-count");
      if (cartCount) cartCount.textContent = count || "";
    }
  };

  const getUserPrice = (product) => {
    const subscriptionType = (session?.user?.subscriptionType || "free").trim().toLowerCase();
    console.log(`Calculating price for product: ${product.name}, subscriptionType: ${subscriptionType}`);
    switch (subscriptionType) {
      case "1month":
      case "onemonth":
        return product.oneMonth || product.basicPrice;
      case "sixmonth":
        return product.sixMonth || product.basicPrice;
      case "lifetime":
        return product.lifeTime || product.basicPrice;
      case "free":
      default:
        return product.basicPrice;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      const item = cart.find((i) => i.id === id);
      const price = getUserPrice(item.product);
      const response = await axios.put(`/api/store/cart/${id}`, {
        quantity,
        price,
      });
      const updatedCart = response.data;
      setCart(updatedCart);
      updateCartCount(updatedCart.length);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await axios.delete(`/api/store/cart/${id}`);
      const updatedCart = response.data;
      setCart(updatedCart);
      updateCartCount(updatedCart.length);
      toast.success("Item removed from cart successfully");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error while removing the item from cart");
    }
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = getUserPrice(item.product);
    return sum + price * item.quantity;
  }, 0);

  const payNow = async () => {
    if (status !== "authenticated") {
      toast.error("Please log in to complete your purchase");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (userPoints < totalPrice) {
      toast.error("Insufficient points to complete this purchase");
      return;
    }

    try {
      const purchasePromises = cart.map(async (item) => {
        const price = getUserPrice(item.product) * item.quantity;
        const response = await axios.post("/api/store/purchase", {
          productId: item.product.id,
          price,
        });
        return response.data;
      });

      const purchaseResults = await Promise.all(purchasePromises);
      console.log("Purchase results:", purchaseResults);

      const finalPoints = purchaseResults[purchaseResults.length - 1].points;
      setUserPoints(finalPoints);

      await axios.delete("/api/store/cart/clear");
      setCart([]);
      updateCartCount(0);

      toast.success(`Purchased all items for ${totalPrice} points! New points: ${finalPoints}`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Purchase failed";
      console.error("Error during bulk purchase:", error.response?.data || error.message);
      toast.error(errorMsg);
    }
  };

  if (status === "loading" || loading) {
    return <p className="bg-purple-600 h-screen text-center text-white flex justify-center items-center text-xl">Loading cart...</p>;
  }
  if (status === "unauthenticated") {
    return <p className="text-center bg-purple-600 h-screen text-red-500">Please log in to view your cart.</p>;
  }

  return (
    <div className="h-screen mx-auto p-6 bg-gradient-to-r from-purple-600 to-purple-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 mt-16 text-center">Your Cart</h2>
      {userPoints !== null && (
        <p className="text-center text-white mb-4">Your Points: {userPoints}</p>
      )}
      {cart.length === 0 ? (
        <p className="text-center text-xl text-red-900">Your cart is empty</p>
      ) : (
        <div className="space-y-4 px-52 py-1">
          {cart.map((item) => {
            const price = getUserPrice(item.product);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
              >
                <h3 className="text-lg font-semibold text-gray-700">{item.product.name}</h3>
                <p className="text-gray-600">Price: ${price}</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600">Subtotal: ${(price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3.5 py-2 text-red-500 rounded hover:bg-red-600 hover:text-white transition cursor-pointer"
                >
                  <Trash2 />
                </button>
              </div>
            );
          })}
          <div className="flex flex-row justify-between">
            <h3 className="text-xl font-bold mt-6 text-gray-800">Total: ${totalPrice.toFixed(2)}</h3>
            <button
              onClick={payNow}
              className="bg-green-600 hover:bg-green-500 hover:text-white active:bg-green-700 hover:scale-105 rounded-md px-3.5 py-1.5 mt-1 text-white"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
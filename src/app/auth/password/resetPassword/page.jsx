"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract token and email safely
  useEffect(() => {
    setToken(searchParams.get("token") || "");
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/auth/resetPassword", {
        email,
        token,
        password,
      });

      setMessage(response.data.message);

      if (response.status === 200) {
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return <p>Invalid reset link</p>;
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/admin-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      sessionStorage.setItem("adminToken", data.token);

      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md rounded-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Kar<span className="text-orange-500">Zone</span>
          </h1>

          <p className="text-gray-400 mt-2">
            Admin Login
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="metal-btn w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an admin account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-orange-500 cursor-pointer"
          >
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const userData = {
        token,
        name: res.data.name,
        email: res.data.email,
        _id: res.data._id,
        avatar: res.data.avatar,
      };

      localStorage.setItem("quizUser", JSON.stringify(userData));
      localStorage.setItem("quizUserToken", token);

      toast.success(`Welcome ${res.data.name}`);
      navigate("/home");
    } catch (error) {
      console.error("Error fetching Google user profile:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  if (token) {
    fetchUserProfile();
  }
}, [navigate]);



  const toggleForm = () => {
    setIsRegister(!isRegister);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? `${BASE_URL}/user/register`
      : `${BASE_URL}/user/login`;

    setLoading(true);
    try {
      const res = await axios.post(url, formData, { withCredentials: true });
      console.log(res.data)
      localStorage.setItem("quizUser", JSON.stringify(res.data));
     
      toast.success("Success!");
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-red-500 px-4 py-8">
      {/* Header */}
       <header className="w-full py-5 px-6 gap-4 flex justify-between items-center bg-white/10 backdrop-blur-lg sticky top-0 z-20 shadow-lg">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                <BrainCircuit
                  size={28}
                  className="text-yellow-300 animate-bounce-slow"
                />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                  SQUIZ
                </span>
              </h1>
              <nav className="flex  gap-6">
                <Link to="/leaderboard">
                  <button className="bg-yellow-400 text-xs md:text-sm text-purple-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition duration-300 transform hover:scale-105 shadow-md">
                    Leaderboard
                  </button>
                </Link>
              </nav>
            </header>

      {/* Form Card */}
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 m-auto w-full max-w-md mt-8 animate-fadeIn">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          {isRegister ? "Register" : "Login"} to SQUIZ
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold mb-1 text-purple-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1 text-purple-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-purple-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-purple-900 py-3 rounded-lg font-bold hover:opacity-90 transform hover:scale-105 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Google Sign-In Button */}
        {/* <div className="mt-6 text-center">
          <a href={`${BASE_URL}/auth/google`}>
            <button className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg shadow hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </a>
        </div> */}

        <div className="mt-6 text-center">
          <p className="text-sm text-purple-700">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={toggleForm}
              className="ml-2 text-pink-600 hover:underline font-semibold transition"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-bounce-slow { animation: bounceSlow 2.5s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default AuthPage;

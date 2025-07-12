import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { List, House, X, Loader } from "lucide-react";

const LeaderBoard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get("http://localhost:3000/score/leaderboard");
        console.log(res)
        setScores(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white px-4 py-8">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-md sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <List size={24} className="text-yellow-300" />
          Quizify
        </h1>
        <nav className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-purple-900 font-semibold hover:bg-yellow-300 transition duration-300"
          >
            <House size={20} />
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate("/leaderboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-purple-900 font-semibold hover:bg-yellow-300 transition duration-300"
          >
            <List size={20} />
            Leaderboard
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-400 transition duration-300"
          >
            <X size={20} />
            Exit
          </button>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto mt-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
          🏆 Leaderboard
        </h2>

        {loading ? (
          <div className="text-center">
            <Loader size={40} className="animate-spin mx-auto" />
            <p>Loading leaderboard...</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
            <ul className="divide-y divide-white/20">
              {scores.length === 0 ? (
                <p className="text-center py-4">No scores yet.</p>
              ) : (
                scores.map((s, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center py-3 text-lg font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-300 font-bold">
                        {getBadge(i)}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {s.name || "Anonymous"}
                        </span>
                        <span className="text-sm text-white/70">Player</span>
                      </div>
                    </div>
                    <span className="text-right">{s.score}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>

      {/* Helper function for rank badges */}
      <style jsx="true">{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

// 🥇 Badge generator
const getBadge = (index) => {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return index + 1;
  }
};

export default LeaderBoard;

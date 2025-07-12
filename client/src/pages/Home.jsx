import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { BrainCircuit, Loader } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("quizUser"));

  // fetch question upon page load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "https://opentdb.com/api.php?amount=10&type=multiple"
        );
        const formatted = res.data.results.map((q, index) => ({
          id: index,
          question: q.question,
          options: shuffle([...q.incorrect_answers, q.correct_answer]),
          correctAnswer: q.correct_answer,
        }));
        setQuestions(formatted);
        toast.success("Questions loaded!", { autoClose: 2000 });
      } catch (error) {
        console.error("Error fetching questions:", error);
        // toast.error("Failed to load questions", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  // select answer
  const handleOptionSelect = (questionId, option) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: option,
    });
  };

  // reset form/question
  const resetAnswers = () => {
    setUserAnswers({});
    setScore(null);
    toast.info("Answers reset", { autoClose: 2000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let calculatedScore = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);

    try {
      const user = JSON.parse(localStorage.getItem("quizUser"));
      console.log(localStorage.getItem("quizUser"));

      console.log("User token:", user.token);

      await axios.post(
        `${BASE_URL}/score`,
        { score: calculatedScore },
        {
          // headers: {
          //   Authorization: `Bearer ${user.token}`,
          // },
          withCredentials: true,
        }
      );
      toast.success("Score saved!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error saving score:", error);
      toast.error("Failed to save score", { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-4 py-8 text-white">
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

      <main className="max-w-3xl mx-auto mt-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
          Test Your Knowledge!
        </h2>
        <p className="text-lg sm:text-xl mb-8 text-center opacity-90">
          Answer the questions below and submit to see your score.
        </p>

        {loading ? (
          <div className="text-center">
            <Loader size={40} className="animate-spin mx-auto" />
            <p>Loading questions...</p>
          </div>
        ) : score !== null ? (
          <div className="text-center animate-scaleIn">
            <h2 className="text-3xl font-bold mb-4">
              🎉 You scored {score} / {questions.length}
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-yellow-300 hover:scale-105 transform transition duration-300"
            >
              Play Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white/10 p-6 rounded-lg shadow-md animate-fadeIn"
              >
                <p className="font-semibold mb-4 text-lg">
                  {index + 1}. {decodeHtml(q.question)}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition ${
                        userAnswers[q.id] === opt
                          ? "bg-yellow-400 text-purple-900 font-semibold"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={userAnswers[q.id] === opt}
                        onChange={() => handleOptionSelect(q.id, opt)}
                        className="accent-purple-600 w-5 h-5"
                      />
                      <span>{decodeHtml(opt)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                type="submit"
                className="bg-yellow-400 text-purple-900 px-10 py-4 rounded-full font-semibold shadow-lg hover:bg-yellow-300 hover:scale-105 transform transition duration-300"
              >
                Submit Quiz
              </button>
              <button
                type="button"
                onClick={resetAnswers}
                className="bg-gray-300 text-gray-800 px-10 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-400 hover:scale-105 transform transition duration-300"
              >
                Reset Answers
              </button>
            </div>
          </form>
        )}
      </main>

      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default Home;

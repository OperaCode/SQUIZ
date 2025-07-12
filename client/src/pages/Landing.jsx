import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, PlayCircle, Trophy, Users, Clock } from "lucide-react";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-pink-500 to-red-500 text-white">
      {/* Header */}
      <header className="w-full py-5 px-8 flex justify-between items-center bg-white/10 backdrop-blur-lg sticky top-0 z-20 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
          <BrainCircuit size={28} className="text-yellow-300 animate-bounce-slow" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">SQUIZ</span>
        </h1>
        <nav className="flex items-center gap-6">
          <a href="/about" className="text-white/80 hover:text-white transition duration-300 font-medium">About</a>
          <Link to="/authentication">
            <button className="bg-yellow-400 text-purple-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition duration-300 transform hover:scale-105 shadow-md">
              Play Now
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 text-center py-12">
        <div className={`max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <BrainCircuit size={90} className="mx-auto mb-8 text-yellow-300 drop-shadow-xl animate-pulse-slow"/>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
            Challenge Your Mind with SQUIZ
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Dive into exciting quizzes across countless topics. Compete with friends, track your progress, and become a trivia master today.
          </p>
          <Link to="/authentication">
            <button className="bg-yellow-400 text-purple-900 font-semibold px-12 py-4 rounded-full shadow-2xl hover:bg-yellow-300 hover:scale-110 transform transition duration-300 flex items-center gap-3 mx-auto group">
              <PlayCircle size={26} className="group-hover:animate-spin-fast" />
              Start Your Quiz Adventure
            </button>
          </Link>
        </div>
      </main>

      {/* Stats Section */}
      <section className="w-full py-16 px-8 bg-white/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <Trophy size={50} className="text-yellow-300 mb-4 animate-bounce-slow"/>
            <h3 className="text-3xl font-bold">10,000+</h3>
            <p className="text-white/80">Quizzes Completed</p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={50} className="text-yellow-300 mb-4 animate-bounce-slow"/>
            <h3 className="text-3xl font-bold">5,000+</h3>
            <p className="text-white/80">Active Players</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock size={50} className="text-yellow-300 mb-4 animate-bounce-slow"/>
            <h3 className="text-3xl font-bold">100+</h3>
            <p className="text-white/80">Topics Available</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-8 text-center bg-white/10 backdrop-blur-lg">
        <p className="text-sm opacity-80">© 2025 SQUIZ. All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-6">
          <a href="/privacy" className="text-white/60 hover:text-white transition duration-300">Privacy Policy</a>
          <a href="/terms" className="text-white/60 hover:text-white transition duration-300">Terms of Service</a>
        </div>
      </footer>

      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 2.5s infinite ease-in-out;
        }

        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite ease-in-out;
        }

        @keyframes spinFast {
          to { transform: rotate(360deg); }
        }
        .group:hover .group-hover\\:animate-spin-fast {
          animation: spinFast 0.8s linear;
        }
      `}</style>
    </div>
  );
};

export default Landing;

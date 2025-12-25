
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Headerhome from "../components/Headerhome";
import '../index.css';
import popup from "../images/popup.png";
import floating from "../images/floating.png";



export function Homepage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("autotoken699");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Headerhome />

      {/* Hero Section */}
      <section className="relative py-32 px-6 md:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-purple-400/10 blur-3xl" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-purple-300 bg-clip-text text-transparent mb-8 leading-tight">
              Master Coding<br/>One Problem at a Time
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Your intelligent companion for consistent coding practice. Track problems from LeetCode, CodeChef, and Codeforces.<br className="hidden md:block"/> Build streaks, analyze progress, and level up your skills.
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/signup"
                className="relative group bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6 md:px-20 bg-slate-800/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="text-4xl font-bold text-center text-amber-300 mb-20"
          >
            Why DailyCode?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Daily Challenges",
                icon: "📧",
                desc: "Receive curated coding problems in your inbox every morning tailored to your skill level",
                bg: "bg-purple-500/10",
              },
              {
                title: "Multi-Platform Tracking",
                icon: "🎯",
                desc: "Seamlessly track problems from LeetCode, CodeChef, and Codeforces in one place",
                bg: "bg-amber-500/10",
              },
              {
                title: "Smart Analytics",
                icon: "📊",
                desc: "Visualize your progress with detailed statistics, streaks, and performance insights",
                bg: "bg-blue-500/10",
              },
              {
                title: "Pattern Recognition",
                icon: "🧩",
                desc: "Tag problems with patterns and techniques to build your problem-solving toolkit",
                bg: "bg-green-500/10",
              },
              {
                title: "Code Solutions Storage",
                icon: "💾",
                desc: "Save your solutions with syntax highlighting and revisit them anytime",
                bg: "bg-red-500/10",
              },
              {
                title: "Progress Tracking",
                icon: "🏆",
                desc: "Track solve counts, best times, and difficulty ratings for every problem",
                bg: "bg-indigo-500/10",
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-2xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm hover:border-amber-400/30 transition-all"
              >
                <div className={`text-5xl mb-6 p-4 rounded-lg w-max ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-amber-200 mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-28 px-6 md:px-20 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-amber-300 mb-6">
              Your Path to Consistency
            </h2>
            <p className="text-slate-400 text-xl">Simple steps to coding mastery</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: 1,
                title: "Set Your Tags",
                desc: "Choose topics you want to practice - arrays, graphs, dynamic programming, and more",
                icon: "🏷️"
              },
              {
                step: 2,
                title: "Receive Daily Problems",
                desc: "Get personalized coding challenges delivered to your email every morning",
                icon: "📬"
              },
              {
                step: 3,
                title: "Track & Improve",
                desc: "Solve, save solutions, and watch your progress grow with detailed analytics",
                icon: "📈"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="relative p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-amber-400/30 transition-all"
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-slate-900 text-xl font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="text-6xl mb-6 mt-4">{step.icon}</div>
                <h4 className="text-2xl font-semibold text-amber-200 mb-4">
                  {step.title}
                </h4>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section className="py-28 px-6 md:px-20 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            <h2 className="text-4xl font-bold text-amber-300 mb-6">
              Built for Serious Coders
            </h2>
            <p className="text-slate-400 text-xl">Everything you need to stay consistent and improve</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8"
              variants={fadeIn}
            >
              {[
                {
                  title: "Interactive Calendar",
                  desc: "Visualize your coding streak with a beautiful calendar view"
                },
                {
                  title: "Difficulty Tracking",
                  desc: "Rate problems with your own difficulty scale (A-E) to track improvement"
                },
                {
                  title: "Tag-Based Discovery",
                  desc: "Filter problems by algorithms, data structures, and techniques"
                },
                {
                  title: "Best Time Recording",
                  desc: "Track your fastest solve times and compete with yourself"
                },
                {
                  title: "Rich Code Editor",
                  desc: "Write solutions in C++, Python, Java, and more with autocomplete"
                },
                {
                  title: "Pattern Library",
                  desc: "Build your personal database of problem-solving patterns"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-4 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-amber-400/30 transition-all"
                  whileHover={{ x: 10 }}
                >
                  <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-amber-200 mb-2">{feature.title}</h4>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-purple-400/20 rounded-3xl blur-2xl" />
              <div className="relative p-8 bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-slate-300">Problems Solved</span>
                    <span className="text-3xl font-bold text-amber-300">247</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-slate-300">Current Streak</span>
                    <span className="text-3xl font-bold text-orange-300">🔥 28 days</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-slate-300">Average Time</span>
                    <span className="text-3xl font-bold text-purple-300">32 min</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-slate-300">Success Rate</span>
                    <span className="text-3xl font-bold text-green-300">85%</span>
                  </div>
                </div>
                <p className="mt-8 text-center text-slate-400 italic">
                  "Track metrics that matter and watch yourself grow"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 md:px-20 bg-gradient-to-br from-slate-900 to-amber-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="p-8 rounded-3xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-4xl font-bold text-amber-300 mb-6">
              Ready to Build Your Coding Habit?
            </h2>
            <p className="text-slate-400 text-xl mb-8 max-w-2xl mx-auto">
              Join developers who are mastering algorithms and data structures through consistent daily practice
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/signup"
                className="px-12 py-5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-amber-400/20"
              >
                Start Coding Today
              </Link>
            </div>
            <p className="mt-6 text-slate-500 text-sm">
              Free forever • No credit card required • Start in 30 seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              DailyCode
            </div>
            <div className="flex gap-8">
              <Link to="/discover" className="text-slate-400 hover:text-amber-300 transition-colors">Discover Problems</Link>
              <Link to="/signin" className="text-slate-400 hover:text-amber-300 transition-colors">Sign In</Link>
              <a href="https://github.com/sahilcodes2002" className="text-slate-400 hover:text-amber-300 transition-colors">GitHub</a>
            </div>
          </div>
          <div className="mt-8 text-center text-slate-500 text-sm">
            © 2024 DailyCode. Empowering developers through consistent practice.
          </div>
        </div>
      </footer>
    </div>
  );
}
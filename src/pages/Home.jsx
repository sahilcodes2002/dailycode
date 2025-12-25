// import React, { useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import Headerhome from "../components/Headerhome";
// import '../index.css';

// export function Homepage() {
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const token = localStorage.getItem("autotoken69");
//     if (token) {
//       navigate("/dashboard");
//     }
//   }, []);

//   return (
//     <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
//       <Headerhome />

//       {/* Hero Section */}
//       <section className="py-20 px-6 md:px-20">
//         <div className="max-w-6xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
//               Smart Note-Taking Reimagined
//             </h1>
//             <p className="text-md text-gray-600 mb-8 max-w-3xl mx-auto">
//               Capture web content instantly, organize effortlessly, and access anywhere.<br/>
//               Let AI-powered automation handle your notes while you focus on what matters.
//             </p>
//             <div className="flex justify-center gap-4">
//               <Link
//                 to="/signup"
//                 className="bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white px-8 py-4 rounded-lg transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
//               >
//                 Start Free Today
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-6 md:px-20 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <motion.h2
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-4xl font-bold text-center text-gray-800 mb-16"
//           >
//             How Auto Note Works
//           </motion.h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 title: "1. Webpage Integration",
//                 icon: "🌐",
//                 desc: "Automatically creates files based on visited webpages"
//               },
//               {
//                 title: "2. Smart Capture",
//                 icon: "✍️",
//                 desc: "Select text anywhere - we'll save it automatically"
//               },
//               {
//                 title: "3. Floating Hub",
//                 icon: "🎮",
//                 desc: "Control notes without leaving your current page"
//               },
//               {
//                 title: "4. Cloud Sync",
//                 icon: "☁️",
//                 desc: "Access notes across all your devices"
//               }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.05 }}
//                 className="p-8 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
//               >
//                 <div className="text-4xl mb-4">{feature.icon}</div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Demo Section */}
//       <section className="py-20 px-6 md:px-20 bg-gray-50">
//         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
//           <motion.div 
//             className="flex-1"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="relative rounded-2xl shadow-2xl overflow-hidden">
//               <img 
//                 src="https://via.placeholder.com/600x400" 
//                 alt="Extension demo" 
//                 className="w-full h-auto"
//               />
//               <div className="absolute inset-0 border-8 border-white/10 rounded-2xl"></div>
//             </div>
//           </motion.div>
          
//           <motion.div 
//             className="flex-1"
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h2 className="text-4xl font-bold text-gray-800 mb-6">
//               Your Web-Integrated Notebook
//             </h2>
//             <ul className="space-y-6 text-gray-600">
//               <li className="flex items-center gap-4">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">✔️</div>
//                 <span>Automatic context-aware note organization</span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">🔄</div>
//                 <span>Real-time syncing across all devices</span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">🔗</div>
//                 <span>Automatic source URL tracking</span>
//               </li>
//             </ul>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="max-w-4xl mx-auto text-center">
//           <motion.div
//             initial={{ scale: 0.95 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h2 className="text-4xl font-bold text-white mb-6">
//               Transform How You Capture Information
//             </h2>
//             <p className="text-xl text-white/90 mb-8">
//               Join thousands of users who never lose a valuable insight
//             </p>
//             <Link
//               to="/signup"
//               className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-100 transition-colors"
//             >
//               Start Free Trial
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-gray-300 py-12">
//         <div className="max-w-6xl mx-auto px-6 md:px-20">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="text-2xl font-bold mb-4 md:mb-0">Auto Note</div>
//             <div className="flex gap-8">
//               <a href="#" className="hover:text-white transition-colors">Privacy</a>
//               <a href="#" className="hover:text-white transition-colors">Terms</a>
//               <a href="#" className="hover:text-white transition-colors">Contact</a>
//             </div>
//           </div>
//           <div className="mt-8 text-center text-sm text-gray-400">
//             © 2024 Auto Note. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }






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
              Revolutionize Your<br/>Web Research
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Contextual note-taking meets intelligent organization. Capture ideas directly on web pages<br className="hidden md:block"/> and access them anywhere, anytime.
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/signup"
                className="relative group bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
              >
                <span className="relative z-10">Start Free Trial</span>
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
            Why Choose AutoNote?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Floating Note Interface",
                icon: "🖋️",
                desc: "Beautiful minimalist UI that appears exactly when you need it",
                bg: "bg-purple-500/10",
              },
              {
                title: "Smart Organization",
                icon: "🧠",
                desc: "AI-powered categorization based on page content",
                bg: "bg-amber-500/10",
              },
              {
                title: "Cross-Device Sync",
                icon: "🔄",
                desc: "Seamless synchronization across all your devices",
                bg: "bg-blue-500/10",
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

      {/* Installation Section */}
      <section className="py-28 px-6 md:px-20 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-amber-300 mb-6">
              Get Started in 60 Seconds
            </h2>
            <p className="text-slate-400 text-xl">Transform your browsing experience today</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Installation Steps */}
            <motion.div 
              className="space-y-8"
              variants={fadeIn}
            >
              {[
                {
                  step: 1,
                  title: "Download & Extract",
                  desc: "Clone or download the repository from GitHub",
                  code: "git clone https://github.com/sahilcodes2002/AutoNoteExtension.git"
                },
                {
                  step: 2,
                  title: "Enable Developer Mode",
                  desc: "Chrome/Edge → Extensions → Developer Mode"
                },
                {
                  step: 3,
                  title: "Load Extension",
                  desc: "Click 'Load unpacked' and select /dist folder"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400 text-xl font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-amber-200 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-slate-400 mb-3">{step.desc}</p>
                      {step.code && (
                        <code className="block p-3 rounded-lg bg-slate-900/50 text-slate-300 text-sm font-mono">
                          {step.code}
                        </code>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Extension Preview */}
            <motion.div
              className="relative group"
              whileHover="hover"
              variants={{
                hover: { scale: 1.02 }
              }}
            >
              <div className="sticky top-24 p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50">
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={popup}
                    alt="Extension Preview" 
                    className="w-full h-auto transform group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </div>
                <div className="mt-6 text-center">
                  <a
                    href="https://github.com/sahilcodes2002/AutoNoteExtension"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-amber-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    View on GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-28 px-6 md:px-20 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            <h2 className="text-4xl font-bold text-amber-300 mb-6">
              Effortless Note Management
            </h2>
            <p className="text-slate-400 text-xl">Your ideas, organized beautifully</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              {/* <div className="absolute inset-0 bg-amber-400/5 rounded-3xl transform rotate-2" /> */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={floating}
                  alt="Floating Interface" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-8"
              variants={fadeIn}
            >
              {[
                "Smart text selection capture",
                "Instant webpage context detection",
                "Rich text formatting options",
                "One-click cloud synchronization",
                "Multi-browser support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400">
                    ✔️
                  </div>
                  <span className="text-slate-300 text-lg">{feature}</span>
                </div>
              ))}
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
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-slate-400 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of researchers, students, and professionals who already supercharged their productivity
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/signup"
                className="px-12 py-5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-amber-400/20"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              AutoNote
            </div>
            <div className="flex gap-8">
              <a href="https://github.com/sahilcodes2002/AutoNote-extension-dev" className="text-slate-400 hover:text-amber-300 transition-colors">Documentation</a>
              <a href="#" className="text-slate-400 hover:text-amber-300 transition-colors">Support</a>
              {/* <a href="#" className="text-slate-400 hover:text-amber-300 transition-colors">Privacy</a> */}
            </div>
          </div>
          <div className="mt-8 text-center text-slate-500 text-sm">
            © 2024 AutoNote. Open-source intelligence for the modern web.
          </div>
        </div>
      </footer>
    </div>
  );
}
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BottomWarning } from "../components/BottomWarning";
import { Heading } from "../components/Heading";
import { InputField } from "../components/InputField";
import { SubHeading } from "../components/SubHeading";
import { Link } from "react-router-dom";

export function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    setLoading(true);
    axios
      .post("https://dailycode.dailycode.workers.dev/signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.message == "no user found") {
          alert(response.data.message);
          return;
        }
        localStorage.setItem("autotoken699", response.data.token);
        navigate(`/dashboard`);
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("autotoken699");
    if (token) {
      navigate("/dashboard")
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-purple-400/10 rounded-3xl blur-xl" />
        
        <div className="relative rounded-3xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-lg shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                DailyCode
              </h1>
              <Link 
                to={"/"} 
                className="text-slate-400 hover:text-amber-300 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Heading title={"Welcome Back"} />
              <SubHeading 
                SubHeading={"Sign in to continue your coding journey"} 
                className="text-slate-400 mt-2"
              />

              <div className="space-y-6 mt-8">
                <InputField
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  label={"Email"}
                  holder={"name@example.com"}
                  className="bg-slate-700/50 border-slate-600 focus:border-amber-300"
                />
                <InputField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label={"Password"}
                  holder={"••••••••"}
                  type={"password"}
                  className="bg-slate-700/50 border-slate-600 focus:border-amber-300"
                />

                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 rounded-xl font-semibold text-slate-900 transition-all shadow-lg hover:shadow-amber-400/20"
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </button>

                <BottomWarning
                  warning={"New to DailyCode? "}
                  buttonText={"Create Account"}
                  to={"/signup"}
                  className="text-slate-400 mt-4"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
            <div className="flex items-center gap-3 text-amber-300">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Authenticating...</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
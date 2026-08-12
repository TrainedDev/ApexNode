import { useState, useRef, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const TRANSITION_MS = 320;

export default function AuthCard() {
  const [mode, setMode] = useState("login"); // the form currently rendered
  const [phase, setPhase] = useState("idle"); // idle | leaving | entering
  const [direction, setDirection] = useState(1); // 1 = forward (login -> signup), -1 = backward
  const pendingMode = useRef(mode);

  const switchMode = (nextMode) => {
    if (nextMode === mode || phase !== "idle") return;
    pendingMode.current = nextMode;
    setDirection(nextMode === "signup" ? 1 : -1);
    setPhase("leaving");
  };

  useEffect(() => {
    if (phase === "leaving") {
      const timer = setTimeout(() => {
        setMode(pendingMode.current);
        setPhase("entering");
      }, TRANSITION_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "entering") {
      const raf = requestAnimationFrame(() => {
        setPhase("idle");
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [phase]);


  const getTransformClasses = () => {
    if (phase === "leaving") {
      return direction === 1
        ? "opacity-0 scale-95 -translate-x-8" // login -> signup: old content exits left
        : "opacity-0 scale-95 translate-x-8"; // signup -> login: old content exits right
    }
    if (phase === "entering") {
      return direction === 1
        ? "opacity-0 scale-95 translate-x-8" // new content enters from the right
        : "opacity-0 scale-95 -translate-x-8"; // new content enters from the left
    }
    return "opacity-100 scale-100 translate-x-0";
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#f8fafc] dark:bg-gray-950 px-4 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2563eb]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] bg-[#2563eb]/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gray-200/40 dark:bg-gray-700/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[440px]">
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Website Name
          </span>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/60 dark:shadow-black/40 hover:shadow-2xl transition-shadow duration-300 px-6 sm:px-9 py-9 overflow-hidden">
          <div
            className={`transition-all ease-out duration-300 ${getTransformClasses()}`}
          >
            {mode === "login" ? (
              <LoginForm onSwitchMode={switchMode} />
            ) : (
              <SignupForm onSwitchMode={switchMode} />
            )}
          </div>
        </div>

        <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

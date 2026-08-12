import { useEffect, useState } from "react";
import { LoaderCircle, Server, AlertCircle } from "lucide-react";

const ServerWakeUpToast = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let timeout;

    const showWakeup = () => {
      setMessage({
        type: "loading",
        title: "Server is waking up",
        description: "Please wait a moment...",
      });

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
    };

    const showFailed = () => {
      setMessage({
        type: "error",
        title: "Server is unavailable",
        description: "Please try again in a moment.",
      });

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
    };

    window.addEventListener("server-waking-up", showWakeup);
    window.addEventListener("server-wakeup-failed", showFailed);

    return () => {
      window.removeEventListener("server-waking-up", showWakeup);
      window.removeEventListener("server-wakeup-failed", showFailed);
      clearTimeout(timeout);
    };
  }, []);

  if (!message) return null;

  const isLoading = message.type === "loading";

  return (
    <div className="fixed top-5 left-1/2 z-[9999] -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-black/10">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            isLoading ? "bg-blue-50" : "bg-red-50"
          }`}
        >
          {isLoading ? (
            <Server className="h-5 w-5 text-blue-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
        </div>

        <div className="min-w-[220px]">
          <p className="text-sm font-semibold text-slate-900">
            {message.title}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {message.description}
          </p>
        </div>

        {isLoading && (
          <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />
        )}
      </div>
    </div>
  );
};

export default ServerWakeUpToast;
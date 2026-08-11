import { useState, useMemo } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

function getStrength(password = "") {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) return { score: 0, label: "", color: "bg-gray-200" };
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-[#dc2626]" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-[#2563eb]" };
  return { score: 4, label: "Strong", color: "bg-[#16a34a]" };
}

export default function PasswordInput({
  id,
  label,
  placeholder,
  registration,
  error,
  autoComplete = "current-password",
  showStrength = false,
  watchedValue = "",
}) {
  const [visible, setVisible] = useState(false);
  const strength = useMemo(() => getStrength(watchedValue), [watchedValue]);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <Lock
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-gray-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full pl-10 pr-11 py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-gray-800/60 border text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? "border-[#dc2626] focus:ring-[#dc2626]/30 focus:border-[#dc2626]"
              : "border-gray-200 dark:border-gray-700 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
          }`}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={0}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 transition-colors duration-200"
        >
          {visible ? (
            <EyeOff className="w-4.5 h-4.5" />
          ) : (
            <Eye className="w-4.5 h-4.5" />
          )}
        </button>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-[#dc2626] mt-1.5"
        >
          {error.message}
        </p>
      )}

      {showStrength && watchedValue && (
        <div className="mt-2.5">
          <div className="flex gap-1.5">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1.5">
            Password strength: <span className="font-bold">{strength.label}</span>
          </p>
        </div>
      )}
    </div>
  );
}

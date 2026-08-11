import { useForm } from "react-hook-form";
import { Mail, Loader2, LogIn } from "lucide-react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitchMode }) {
  const {
    auth: { error, loading },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(login(data)).unwrap();

      if (response?.message) navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="text-center mb-7">
        <div className="w-12 h-12 rounded-2xl bg-[#2563eb]/10 flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-5.5 h-5.5 text-[#2563eb]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5">
          Log in to continue to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        <PasswordInput
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 rounded accent-[#2563eb]"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Remember me
            </span>
          </label>
          <a
            href="#"
            className="text-sm font-semibold text-[#2563eb] hover:text-blue-700 transition-colors duration-200"
          >
            Forgot password?
          </a>
        </div>

        {error && (
          <p
            role="alert"
            className="text-sm font-medium text-[#dc2626] text-center"
          >
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#2563eb] rounded-lg py-3 shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitchMode("signup")}
          className="font-semibold text-[#2563eb] hover:text-blue-700 transition-colors duration-200"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

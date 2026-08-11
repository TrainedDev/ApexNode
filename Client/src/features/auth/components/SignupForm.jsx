import { useForm } from "react-hook-form";
import { User, Mail, Loader2, Sparkles } from "lucide-react";
import AuthInput from "./AuthInput";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../authSlice";

export default function SignupForm({ onSwitchMode }) {
 const {
    auth: { error, loading },
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(userRegister(data)).unwrap();
      if (response?.message) navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="text-center mb-7">
        <div className="w-12 h-12 rounded-2xl bg-[#2563eb]/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-5.5 h-5.5 text-[#2563eb]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create your account
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5">
          Join us and start shopping smarter
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <AuthInput
          id="signup-username"
          label="Username"
          type="text"
          icon={User}
          placeholder="yourusername"
          autoComplete="username"
          error={errors.username}
          registration={register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
        />

        <AuthInput
          id="signup-email"
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
          id="signup-password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password}
          showStrength
          watchedValue={passwordValue}
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />

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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitchMode("login")}
          className="font-semibold text-[#2563eb] hover:text-blue-700 transition-colors duration-200"
        >
          Login
        </button>
      </p>
    </div>
  );
}

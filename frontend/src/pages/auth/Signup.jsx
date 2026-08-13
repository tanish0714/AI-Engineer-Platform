import {
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      console.log("SIGNUP SUCCESS:", response.data);

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (err) {
      console.error("SIGNUP ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        w-full
        max-w-lg
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        p-8
        shadow-2xl
        backdrop-blur-2xl
        sm:p-10
      "
    >
      {/* Header */}

      <div>
        <div
          className="
            mb-6
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-cyan-500/10
            text-cyan-400
          "
        >
          <UserPlus size={22} />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          Create Account
        </h1>

        <p className="mt-3 text-zinc-400">
          Start building and managing your AI products.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-red-500/20
            bg-red-500/[0.06]
            px-4
            py-3
            text-sm
            leading-5
            text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/[0.06]
            px-4
            py-3
            text-sm
            leading-5
            text-emerald-400
          "
        >
          {success}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* Name */}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tanish Chourasia"
            autoComplete="name"
            disabled={loading}
            className="
              h-14
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-5
              text-white
              outline-none
              transition
              placeholder:text-zinc-600
              focus:border-cyan-500/60
              focus:bg-black/40
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* Email */}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            className="
              h-14
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-5
              text-white
              outline-none
              transition
              placeholder:text-zinc-600
              focus:border-cyan-500/60
              focus:bg-black/40
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* Password */}

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              disabled={loading}
              className="
                h-14
                w-full
                rounded-xl
                border
                border-white/10
                bg-black/30
                px-5
                pr-14
                text-white
                outline-none
                transition
                placeholder:text-zinc-600
                focus:border-cyan-500/60
                focus:bg-black/40
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              disabled={loading}
              className="
                absolute
                right-4
                top-1/2
                flex
                -translate-y-1/2
                items-center
                justify-center
                rounded-lg
                p-2
                text-zinc-500
                transition
                hover:bg-white/5
                hover:text-zinc-200
              "
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={loading}
              className="
                h-14
                w-full
                rounded-xl
                border
                border-white/10
                bg-black/30
                px-5
                pr-14
                text-white
                outline-none
                transition
                placeholder:text-zinc-600
                focus:border-cyan-500/60
                focus:bg-black/40
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) => !prev
                )
              }
              disabled={loading}
              className="
                absolute
                right-4
                top-1/2
                flex
                -translate-y-1/2
                items-center
                justify-center
                rounded-lg
                p-2
                text-zinc-500
                transition
                hover:bg-white/5
                hover:text-zinc-200
              "
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-lg
            font-semibold
            text-white
            shadow-lg
            shadow-blue-600/10
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-cyan-500/20
            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:translate-y-0
          "
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      {/* Login */}

      <p className="mt-8 text-center text-sm text-zinc-500">
        Already have an account?

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="
            ml-2
            font-medium
            text-cyan-400
            transition
            hover:text-blue-400
          "
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Signup;
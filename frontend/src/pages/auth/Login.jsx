import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------- Input Change -------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* -------------------- Login -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("LOGIN SUCCESS:", response);

      /*
       * Backend sets:
       *
       * accessToken=<JWT>
       *
       * inside an httpOnly cookie.
       *
       * We DO NOT store the token in localStorage.
       */

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
            bg-blue-600/10
            text-blue-400
          "
        >
          <LogIn size={22} />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          Welcome Back
        </h1>

        <p className="mt-3 text-zinc-400">
          Continue building amazing AI products.
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

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* Email */}

        <div>
          <label
            htmlFor="email"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-zinc-300
            "
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
              focus:border-blue-500/60
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
            className="
              mb-2
              block
              text-sm
              font-medium
              text-zinc-300
            "
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
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
                focus:border-blue-500/60
                focus:bg-black/40
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
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
                disabled:opacity-50
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
              Signing in...
            </>
          ) : (
            <>
              Continue
              <LogIn size={18} />
            </>
          )}
        </button>
      </form>

      {/* Signup */}

      <p className="mt-8 text-center text-sm text-zinc-500">
        Don't have an account?

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="
            ml-2
            font-medium
            text-blue-400
            transition
            hover:text-cyan-400
          "
        >
          Create One
        </button>
      </p>
    </div>
  );
};

export default Login;
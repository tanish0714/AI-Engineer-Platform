import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);

  return (

    <div
      className="
      w-full
      max-w-md
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-2xl
      p-8
      shadow-2xl">

      <h1 className="text-4xl font-bold">

        Welcome Back

      </h1>

      <p className="mt-3 text-zinc-400">

        Continue building amazing AI products.

      </p>

      <div className="mt-10 space-y-5">

        <input

          placeholder="Email"

          className="
          h-14
          w-full
          rounded-xl
          border
          border-white/10
          bg-black/30
          px-5
          outline-none
          transition
          focus:border-blue-500"

        />

        <div className="relative">

          <input

            type={showPassword ? "text" : "password"}

            placeholder="Password"

            className="
            h-14
            w-full
            rounded-xl
            border
            border-white/10
            bg-black/30
            px-5
            pr-14
            outline-none
            transition
            focus:border-blue-500"

          />

          <button

            type="button"

            onClick={() => setShowPassword(!showPassword)}

            className="
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            text-zinc-500">

            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}

          </button>

        </div>

        <button

          className="
          h-14
          w-full
          rounded-xl
          bg-blue-600
          text-lg
          font-semibold
          transition
          hover:bg-blue-700">

          Continue

        </button>

      </div>

      <p className="mt-8 text-center text-sm text-zinc-500">

        Don't have an account?

        <span className="ml-2 cursor-pointer text-blue-400">

          Create One

        </span>

      </p>

    </div>

  );

};

export default Login;
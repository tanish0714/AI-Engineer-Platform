import { Bell, Search, Sparkles } from "lucide-react";

const Topbar = () => {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#0F1117] px-8">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Welcome back! Continue building AI products.
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#171A23] px-4 py-3">

          <Search
            size={18}
            className="text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-64 bg-transparent text-white outline-none placeholder:text-zinc-500"
          />

        </div>

        {/* AI Button */}

        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium transition hover:scale-105">

          <Sparkles size={18} />

          AI Assistant

        </button>

        {/* Notification */}

        <button className="relative rounded-xl border border-white/10 p-3 hover:bg-white/5">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400"></span>

        </button>

        {/* Avatar */}

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-bold">

          T

        </div>

      </div>

    </header>
  );
};

export default Topbar;
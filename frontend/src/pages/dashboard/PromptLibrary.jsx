import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Search, Copy, Star, Plus } from "lucide-react";

const prompts = [
  {
    title: "Code Generator",
    category: "Development",
    prompt: "Generate a production-ready React component.",
  },
  {
    title: "Resume Analyzer",
    category: "Career",
    prompt: "Review this resume and suggest improvements.",
  },
  {
    title: "RAG Assistant",
    category: "AI",
    prompt: "Answer only using the provided documents.",
  },
  {
    title: "Bug Fixer",
    category: "Debugging",
    prompt: "Find and fix bugs in the given code.",
  },
];

const PromptLibrary = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Prompt Library
            </h1>

            <p className="mt-2 text-zinc-400">
              Save and reuse your favorite AI prompts.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium">

            <Plus size={18} />

            New Prompt

          </button>

        </div>

        {/* Search */}

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111114] px-5 py-4">

          <Search size={18} className="text-zinc-500" />

          <input
            type="text"
            placeholder="Search prompts..."
            className="flex-1 bg-transparent outline-none placeholder:text-zinc-500"
          />

        </div>

        {/* Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {prompts.map((item) => (

            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#111114] p-6 transition hover:border-cyan-500/40 hover:-translate-y-1"
            >

              <div className="flex items-center justify-between">

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
                  {item.category}
                </span>

                <Star size={18} className="text-yellow-400" />

              </div>

              <h2 className="mt-5 text-xl font-semibold">
                {item.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                {item.prompt}
              </p>

              <button className="mt-8 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">

                <Copy size={16} />

                Copy Prompt

              </button>

            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default PromptLibrary;
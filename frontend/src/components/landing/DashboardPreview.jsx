import {
  MessageSquareText,
  BrainCircuit,
  FolderKanban,
  Search,
  Bell,
  FolderGit2,
} from "lucide-react";

const DashboardPreview = () => {
  return (
    <div className="w-full max-w-[650px] overflow-hidden rounded-[28px] border border-white/10 bg-[#111114] shadow-[0_20px_80px_rgba(37,99,235,0.15)]">

      {/* Browser Header */}

      <div className="flex h-14 items-center justify-between border-b border-white/10 px-5">

        <div className="flex gap-2">

          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />

        </div>

        <div className="rounded-lg bg-white/5 px-3 py-1 text-xs text-zinc-400">
          AI Workspace
        </div>

      </div>

      {/* Body */}

      <div className="flex h-[420px]">

        {/* Sidebar */}

        <aside className="flex w-20 flex-col items-center border-r border-white/10 py-5">

          <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 font-bold">
            AI
          </div>

          <div className="space-y-5 text-zinc-400">

            <MessageSquareText size={20} />
            <BrainCircuit size={20} />
            <FolderKanban size={20} />
            <FolderGit2 size={20} />

          </div>

        </aside>

        {/* Main */}

        <div className="flex flex-1 flex-col">

          {/* Topbar */}

          <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">

            <h3 className="font-semibold">
              AI Dashboard
            </h3>

            <div className="flex gap-4 text-zinc-400">

              <Search size={18} />

              <Bell size={18} />

            </div>

          </div>

          {/* Cards */}

          <div className="grid grid-cols-2 gap-4 p-5">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

              <p className="text-xs text-zinc-500">
                AI Chat
              </p>

              <h4 className="mt-2 font-semibold">
                Active
              </h4>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

              <p className="text-xs text-zinc-500">
                Knowledge Base
              </p>

              <h4 className="mt-2 font-semibold">
                245 Files
              </h4>

            </div>

          </div>

          {/* Chat */}

          <div className="mx-5 flex-1 rounded-2xl border border-white/10 bg-white/5 p-5">

            <div className="mb-4 h-3 w-36 rounded-full bg-blue-500/60"></div>

            <div className="space-y-3">

              <div className="h-3 w-full rounded-full bg-white/10"></div>

              <div className="h-3 w-5/6 rounded-full bg-white/10"></div>

              <div className="h-3 w-4/6 rounded-full bg-white/10"></div>

              <div className="mt-8 ml-auto h-10 w-44 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500"></div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPreview;
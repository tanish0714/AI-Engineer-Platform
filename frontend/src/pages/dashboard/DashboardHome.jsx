import DashboardLayout from "../../components/dashboard/DashboardLayout";

const DashboardHome = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>
          <h2 className="text-3xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-zinc-400">
            Here's an overview of your AI workspace.
          </p>
        </div>

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
            <p className="text-sm text-zinc-500">
              AI Chats
            </p>

            <h3 className="mt-3 text-4xl font-bold">
              126
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
            <p className="text-sm text-zinc-500">
              Projects
            </p>

            <h3 className="mt-3 text-4xl font-bold">
              18
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
            <p className="text-sm text-zinc-500">
              Knowledge Files
            </p>

            <h3 className="mt-3 text-4xl font-bold">
              94
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
            <p className="text-sm text-zinc-500">
              AI Agents
            </p>

            <h3 className="mt-3 text-4xl font-bold">
              7
            </h3>
          </div>

        </div>

        {/* Main Grid */}

        <div className="grid gap-6 xl:grid-cols-3">

          {/* Recent Projects */}

          <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#111114] p-6">

            <h3 className="text-xl font-semibold">
              Recent Projects
            </h3>

            <div className="mt-6 space-y-4">

              {[
                "AI Coding Mentor",
                "Resume Analyzer",
                "RAG Knowledge Base",
              ].map((project) => (
                <div
                  key={project}
                  className="rounded-xl border border-white/10 bg-[#18181B] p-4"
                >
                  {project}
                </div>
              ))}

            </div>

          </div>

          {/* Quick Actions */}

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

            <h3 className="text-xl font-semibold">
              Quick Actions
            </h3>

            <div className="mt-6 space-y-4">

              <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-medium">
                + New AI Chat
              </button>

              <button className="w-full rounded-xl border border-white/10 py-3 hover:bg-white/5">
                Create Project
              </button>

              <button className="w-full rounded-xl border border-white/10 py-3 hover:bg-white/5">
                Upload Knowledge
              </button>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default DashboardHome;
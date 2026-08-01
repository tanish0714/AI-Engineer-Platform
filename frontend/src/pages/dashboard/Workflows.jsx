import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  Workflow,
  Play,
  Pause,
  Plus,
  Clock3,
} from "lucide-react";

const workflows = [
  {
    name: "Resume Screening",
    description: "Automatically analyze uploaded resumes.",
    status: "Running",
    lastRun: "5 min ago",
  },
  {
    name: "Daily AI Report",
    description: "Generate AI activity reports every morning.",
    status: "Paused",
    lastRun: "Yesterday",
  },
  {
    name: "GitHub Code Review",
    description: "Review every new pull request using AI.",
    status: "Running",
    lastRun: "12 min ago",
  },
];

const Workflows = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              AI Workflows
            </h1>

            <p className="mt-2 text-zinc-400">
              Automate repetitive tasks with intelligent workflows.
            </p>

          </div>

          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium">

            <Plus size={18} />

            New Workflow

          </button>

        </div>

        {/* Cards */}

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

          {workflows.map((workflow) => (

            <div
              key={workflow.name}
              className="rounded-2xl border border-white/10 bg-[#111114] p-6 transition hover:border-cyan-500/40 hover:-translate-y-1"
            >

              <div className="flex items-center justify-between">

                <Workflow className="text-cyan-400" />

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    workflow.status === "Running"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {workflow.status}
                </span>

              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {workflow.name}
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {workflow.description}
              </p>

              <div className="mt-8 flex items-center justify-between">

                <div className="flex items-center gap-2 text-sm text-zinc-500">

                  <Clock3 size={16} />

                  {workflow.lastRun}

                </div>

                <button className="rounded-lg bg-white/5 p-2 hover:bg-white/10">

                  {workflow.status === "Running" ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} />
                  )}

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Workflows;
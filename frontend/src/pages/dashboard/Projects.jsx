import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FolderKanban, Plus, Clock3, FolderGit2 } from "lucide-react";

const projects = [
  {
    name: "AI Coding Mentor",
    tech: "React • Node • Gemini",
    status: "In Progress",
    updated: "2 hrs ago",
  },
  {
    name: "Resume Analyzer",
    tech: "FastAPI • OCR • LLM",
    status: "Completed",
    updated: "Yesterday",
  },
  {
    name: "RAG Knowledge Base",
    tech: "LangChain • ChromaDB",
    status: "In Review",
    updated: "Today",
  },
];

const Projects = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Projects
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage all your AI Engineering projects.
            </p>

          </div>

          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium">

            <Plus size={18} />

            New Project

          </button>

        </div>

        {/* Cards */}

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (

            <div
              key={project.name}
              className="rounded-2xl border border-white/10 bg-[#111114] p-6 transition hover:border-cyan-500/40 hover:-translate-y-1"
            >

              <div className="flex items-center justify-between">

                <FolderKanban className="text-cyan-400" />

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">

                  {project.status}

                </span>

              </div>

              <h2 className="mt-6 text-xl font-semibold">

                {project.name}

              </h2>

              <p className="mt-3 text-sm text-zinc-500">

                {project.tech}

              </p>

              <div className="mt-8 flex items-center justify-between">

                <div className="flex items-center gap-2 text-zinc-500">

                  <Clock3 size={16} />

                  <span className="text-sm">

                    {project.updated}

                  </span>

                </div>

                <FolderGit2 size={18} className="cursor-pointer text-zinc-400 hover:text-white" />

              </div>

            </div>

          ))}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Projects;
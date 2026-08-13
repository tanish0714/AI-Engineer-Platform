import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  FolderKanban,
  FileText,
  MessageSquare,
  Code2,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import api from "../../services/api";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PROJECT
  // =====================================================

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("📁 FETCHING PROJECT:", id);

      const response = await api.get(`/projects/${id}`);

      console.log(
        "📁 PROJECT DETAILS RESPONSE:",
        response.data
      );

      const projectData = response.data?.data;

      if (!projectData) {
        throw new Error("Project data not found");
      }

      setProject(projectData);
    } catch (err) {
      console.error(
        "❌ FETCH PROJECT DETAILS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch project"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-cyan-400"
        />
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() =>
            navigate("/dashboard/projects")
          }
          className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-red-400">
          <AlertCircle size={20} />
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          BACK
      ================================================= */}

      <button
        onClick={() =>
          navigate("/dashboard/projects")
        }
        className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Projects
      </button>

      {/* =================================================
          PROJECT HEADER
      ================================================= */}

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-7">

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

          <div className="flex items-start gap-4">

            <div className="rounded-xl bg-cyan-500/10 p-3">
              <FolderKanban
                size={28}
                className="text-cyan-400"
              />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-white">
                {project.title}
              </h1>

              <p className="mt-2 text-zinc-400">
                {project.description ||
                  "AI Engineering Project"}
              </p>

            </div>

          </div>

          <span className="w-fit rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            {project.status || "active"}
          </span>

        </div>

        <div className="mt-7 border-t border-white/10 pt-5">

          <p className="text-xs text-zinc-600">
            PROJECT ID
          </p>

          <p className="mt-1 break-all font-mono text-sm text-zinc-400">
            {project._id}
          </p>

        </div>

      </div>

      {/* =================================================
          PROJECT ACTIONS
      ================================================= */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* =================================================
            DOCUMENTS
        ================================================= */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-7">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-500/10 p-3">

              <FileText
                size={22}
                className="text-blue-400"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                Knowledge Base
              </h2>

              <p className="text-sm text-zinc-500">
                Upload documents for your AI assistant.
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              navigate(
                `/dashboard/projects/${id}/documents`
              )
            }
            className="mt-7 w-full rounded-xl bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Manage Documents
          </button>

        </div>

        {/* =================================================
            AI CHAT
        ================================================= */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-7">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-cyan-500/10 p-3">

              <MessageSquare
                size={22}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                AI Assistant
              </h2>

              <p className="text-sm text-zinc-500">
                Ask questions about your project.
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              navigate(
                `/dashboard/projects/${id}/chat`
              )
            }
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Open AI Assistant
          </button>

        </div>

        {/* =================================================
            GITHUB
        ================================================= */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-7">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-white/10 p-3">

              <Code2
                size={22}
                className="text-white"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                GitHub Integration
              </h2>

              <p className="text-sm text-zinc-500">
                Connect a repository and analyze your codebase with AI.
              </p>

            </div>

          </div>

          {/* LINKED REPOSITORY INFO */}

          {project.github?.connected &&
            project.github?.fullName && (
              <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/5 p-4">

                <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                  <Code2 size={16} />
                  Repository Connected
                </div>

                <p className="mt-1 truncate text-sm text-zinc-400">
                  {project.github.fullName}
                </p>

              </div>
            )}

          <button
            onClick={() =>
              navigate(
                `/dashboard/projects/${id}/github`
              )
            }
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <Code2 size={17} />

            {project.github?.connected
              ? "Manage GitHub Repository"
              : "Connect GitHub"}

            <ExternalLink size={15} />

          </button>

        </div>

      </div>

    </div>
  );
};

export default ProjectDetails;
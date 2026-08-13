import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FolderKanban,
  Plus,
  Clock3,
  FolderGit2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CREATE PROJECT MODAL
  const [showCreateModal, setShowCreateModal] = useState(false);

  // CREATE PROJECT FORM
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    visibility: "private",
  });

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("📂 FETCHING PROJECTS");

      const response = await api.get("/projects");

      console.log("📂 PROJECT RESPONSE:", response.data);

      const projectData = response.data?.data || [];

      console.log("🔥 PROJECT DATA ARRAY:", projectData);
      console.log("🔥 PROJECT COUNT:", projectData.length);

      setProjects(projectData);
    } catch (err) {
      console.error("❌ FETCH PROJECTS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =====================================================
  // CREATE PROJECT
  // =====================================================

  const handleCreateProject = async () => {
    try {
      if (!projectForm.title.trim()) {
        setError("Project title is required");
        return;
      }

      setError("");

      console.log("🚀 CREATING PROJECT:", projectForm);

      const response = await api.post("/projects", {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        visibility: projectForm.visibility,
      });

      console.log("✅ PROJECT CREATED:", response.data);

      const newProject = response.data?.data;

      if (newProject) {
        setProjects((prev) => [newProject, ...prev]);
      } else {
        await fetchProjects();
      }

      // Reset form
      setProjectForm({
        title: "",
        description: "",
        visibility: "private",
      });

      // Close modal
      setShowCreateModal(false);

    } catch (err) {
      console.error("❌ CREATE PROJECT ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create project"
      );
    }
  };

  // =====================================================
  // OPEN PROJECT
  // =====================================================

  const openProject = (projectId) => {
    console.log("📁 OPENING PROJECT:", projectId);

    navigate(`/dashboard/projects/${projectId}`);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Projects
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage all your AI Engineering projects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          New Project
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={17} />
          {error}
        </div>
      )}


      {/* LOADING */}

      {loading ? (

        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2
            className="animate-spin text-cyan-400"
            size={30}
          />
        </div>

      ) : projects.length === 0 ? (

        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111114]">

          <FolderKanban
            size={42}
            className="text-zinc-600"
          />

          <h2 className="mt-5 text-xl font-semibold text-white">
            No projects yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Create your first AI Engineering project.
          </p>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
          >
            <Plus size={17} />
            Create Project
          </button>

        </div>

      ) : (

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (

            <div
              key={project._id}
              onClick={() => openProject(project._id)}
              className="cursor-pointer rounded-2xl border border-white/10 bg-[#111114] p-6 transition hover:-translate-y-1 hover:border-cyan-500/40"
            >

              <div className="flex items-center justify-between">

                <FolderKanban className="text-cyan-400" />

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
                  {project.status || "active"}
                </span>

              </div>

              <h2 className="mt-6 text-xl font-semibold text-white">
                {project.title}
              </h2>

              <p className="mt-3 min-h-[40px] text-sm text-zinc-500">
                {project.description ||
                  "AI Engineering Project"}
              </p>

              <div className="mt-8 flex items-center justify-between">

                <div className="flex items-center gap-2 text-zinc-500">

                  <Clock3 size={16} />

                  <span className="text-sm">
                    {project.updatedAt
                      ? new Date(
                          project.updatedAt
                        ).toLocaleDateString()
                      : "Recently"}
                  </span>

                </div>

                <FolderGit2
                  size={18}
                  className="text-zinc-500"
                />

              </div>

            </div>

          ))}

        </div>

      )}


      {/* =====================================================
          CREATE PROJECT MODAL
      ===================================================== */}

      {showCreateModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111114] p-7 shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create New Project
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Set up your AI Engineering project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-2xl text-zinc-500 hover:text-white"
              >
                ×
              </button>

            </div>


            {/* TITLE */}

            <div className="mt-7">

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Project Name
              </label>

              <input
                type="text"
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    title: e.target.value,
                  })
                }
                placeholder="e.g. AI Coding Mentor"
                className="w-full rounded-xl border border-white/10 bg-[#18181b] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Description
              </label>

              <textarea
                rows={4}
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe what you're building..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#18181b] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50"
              />

            </div>


            {/* VISIBILITY */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Visibility
              </label>

              <select
                value={projectForm.visibility}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    visibility: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#18181b] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              >

                <option value="private">
                  Private
                </option>

                <option value="public">
                  Public
                </option>

              </select>

            </div>


            {/* ACTIONS */}

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateProject}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Create Project
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Projects;
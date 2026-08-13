import { ArrowUpRight, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../ui/Card";

const RecentProjects = ({ projects = [] }) => {
  const navigate = useNavigate();

  return (
    <Card hover={false}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your latest projects and workspace activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/projects")}
          className="
            shrink-0
            rounded-xl
            border border-white/10
            bg-white/[0.03]
            px-4 py-2
            text-sm
            font-medium
            text-cyan-400
            transition
            hover:border-cyan-500/30
            hover:bg-cyan-500/10
            hover:text-cyan-300
          "
        >
          View All
        </button>
      </div>

      {/* Projects */}
      <div className="mt-7 space-y-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <button
              key={project._id}
              type="button"
              onClick={() =>
                navigate(`/dashboard/projects/${project._id}`)
              }
              className="
                group
                flex
                w-full
                items-center
                justify-between
                gap-5
                rounded-2xl
                border border-white/[0.07]
                bg-white/[0.025]
                p-4
                text-left
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-cyan-500/20
                hover:bg-white/[0.045]
              "
            >
              <div className="flex min-w-0 items-center gap-4">
                {/* Icon */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border border-cyan-500/10
                    bg-cyan-500/10
                    text-cyan-400
                  "
                >
                  <FolderKanban size={19} />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-white">
                    {project.title}
                  </h3>

                  <p className="mt-1 truncate text-sm text-zinc-500">
                    {project.description || "No project description"}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex shrink-0 items-center gap-4">
                <div className="hidden text-right sm:block">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      ${
                        project.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-500/10 text-zinc-400"
                      }
                    `}
                  >
                    {project.status}
                  </span>

                  <p className="mt-1 text-xs text-zinc-600">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <ArrowUpRight
                  size={18}
                  className="
                    text-zinc-600
                    transition
                    group-hover:text-cyan-400
                  "
                />
              </div>
            </button>
          ))
        ) : (
          <div
            className="
              flex
              min-h-[180px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-white/10
              bg-white/[0.015]
              px-6
              text-center
            "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
              <FolderKanban
                size={21}
                className="text-zinc-500"
              />
            </div>

            <h3 className="mt-4 font-medium text-zinc-300">
              No projects yet
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
              Create your first AI project to start building
              your workspace.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/projects")
              }
              className="
                mt-5
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-cyan-500/10
                transition
                hover:-translate-y-0.5
              "
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentProjects;
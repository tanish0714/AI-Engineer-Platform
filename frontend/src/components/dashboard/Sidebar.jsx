import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  BookOpen,
  Library,
  Workflow,
  User,
  Settings,
  Sparkles,
  ChevronRight,
  Plus,
  HardDrive,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
    path: "/dashboard/chat",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    path: "/dashboard/projects",
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    path: "/dashboard/knowledge-base",
  },
  {
    title: "Prompt Library",
    icon: Library,
    path: "/dashboard/prompts",
  },
  {
    title: "Workflows",
    icon: Workflow,
    path: "/dashboard/workflows",
  },
];

const bottomMenu = [
  {
    title: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

const Sidebar = () => {
  const storageUsed = 2.3;
  const storageLimit = 5;
  const storagePercent = (storageUsed / storageLimit) * 100;

  return (
    <aside
      className="
        hidden
        lg:flex
        h-screen
        w-[290px]
        min-w-[290px]
        shrink-0
        flex-col
        border-r
        border-white/10
        bg-[#09090B]
      "
    >
      {/* Logo */}
      <div className="shrink-0 px-7 pt-7">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl shadow-cyan-500/20">
            <Sparkles className="h-7 w-7 text-white" />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold">AI Platform</h2>

            <p className="mt-1 text-xs text-zinc-500">
              AI Engineer Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="shrink-0 px-7 pt-8">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Workspace
              </p>

              <h3 className="mt-2 truncate font-semibold">
                AI Engineer Platform
              </h3>
            </div>

            <ChevronRight
              className="shrink-0 text-zinc-500"
              size={20}
            />
          </div>

          <button
            type="button"
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              py-3
              font-medium
              transition
              hover:opacity-90
            "
          >
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 min-h-0 flex-1 overflow-y-auto px-5">
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
                    isActive
                      ? "border border-cyan-500/20 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />

                <span className="truncate">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Storage */}
      <div className="shrink-0 px-5 pb-5">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex items-center gap-3">
            <HardDrive className="shrink-0 text-cyan-400" />

            <div>
              <p className="font-semibold">Storage</p>

              <p className="text-xs text-zinc-500">
                {storageUsed} GB / {storageLimit} GB
              </p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
              style={{
                width: `${storagePercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 border-t border-white/10 p-5">
        <div className="space-y-2">
          {bottomMenu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "border border-cyan-500/20 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User */}
        <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-900 p-4">
          <p className="font-semibold">Tanish</p>

          <p className="mt-1 text-xs text-zinc-500">
            AI Engineer
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
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
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
  },
  {
    title: "Projects",
    icon: FolderKanban,
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
  },
  {
    title: "Prompt Library",
    icon: Library,
  },
  {
    title: "Workflows",
    icon: Workflow,
  },
];

const bottomMenu = [
  {
    title: "Profile",
    icon: User,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#0B0B0D] px-6 py-8">

      {/* Logo */}

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500">

          <Sparkles size={22} />

        </div>

        <div>

          <h1 className="text-xl font-bold text-white">
            AI Platform
          </h1>

          <p className="text-xs text-zinc-500">
            Build AI Products
          </p>

        </div>

      </div>

      {/* Menu */}

      <div className="mt-12 flex flex-1 flex-col gap-2">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="group flex items-center gap-4 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </button>
          );
        })}

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10 pt-6">

        {bottomMenu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="mb-2 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </button>
          );
        })}

      </div>

    </aside>
  );
};

export default Sidebar;
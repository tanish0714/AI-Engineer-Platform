import {
  FolderKanban,
  FileText,
  MessageSquare,
  Database,
} from "lucide-react";

import Card from "../../ui/Card";

const StatsGrid = ({ stats, storage }) => {
  const items = [
    {
      title: "Projects",
      value: stats?.projects ?? 0,
      icon: FolderKanban,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Documents",
      value: stats?.documents ?? 0,
      icon: FileText,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "AI Chats",
      value: "—",
      icon: MessageSquare,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Storage",
      value: `${storage?.usedGB ?? 0} GB`,
      icon: Database,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title} hover>
            <div className="flex min-h-[150px] items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-500">
                  {item.title}
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                  {item.value}
                </h2>
              </div>

              <div
                className={`shrink-0 rounded-2xl p-3.5 ${item.bg} ${item.color}`}
              >
                <Icon size={24} strokeWidth={1.8} />
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default StatsGrid;
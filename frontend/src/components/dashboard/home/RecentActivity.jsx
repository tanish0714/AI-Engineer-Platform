import {
  FileText,
  FolderKanban,
  Activity,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import Card from "../../ui/Card";

const getActivityIcon = (activity) => {
  if (activity.type === "project") {
    return FolderKanban;
  }

  if (activity.status === "completed") {
    return CheckCircle2;
  }

  if (activity.status === "failed") {
    return XCircle;
  }

  if (activity.status === "processing") {
    return Clock3;
  }

  if (activity.type === "document") {
    return FileText;
  }

  return Activity;
};

const formatActivityTime = (date) => {
  if (!date) return "";

  const activityDate = new Date(date);
  const now = new Date();

  const diff = now.getTime() - activityDate.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  }

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return activityDate.toLocaleDateString();
};

const getStatusStyle = (status) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-400";

    case "failed":
      return "bg-red-500/10 text-red-400";

    case "processing":
      return "bg-amber-500/10 text-amber-400";

    case "pending":
      return "bg-blue-500/10 text-blue-400";

    case "active":
      return "bg-cyan-500/10 text-cyan-400";

    case "archived":
      return "bg-zinc-500/10 text-zinc-400";

    default:
      return "bg-zinc-500/10 text-zinc-400";
  }
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <Card hover={false}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Latest activity across your workspace.
        </p>
      </div>

      {/* Activity List */}
      <div className="mt-7">
        {activities.length > 0 ? (
          <div className="space-y-1">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity);

              const activityDate =
                activity.updatedAt || activity.createdAt;

              return (
                <div
                  key={`${activity.type}-${activity.title}-${activityDate}-${index}`}
                  className="
                    group
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    p-3
                    transition
                    hover:bg-white/[0.025]
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.03]
                      text-zinc-400
                      transition
                      group-hover:border-cyan-500/20
                      group-hover:bg-cyan-500/10
                      group-hover:text-cyan-400
                    "
                  >
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="truncate text-sm font-medium text-zinc-200">
                        {activity.title}
                      </h3>

                      {activity.status && (
                        <span
                          className={`
                            w-fit
                            shrink-0
                            rounded-full
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            capitalize
                            ${getStatusStyle(activity.status)}
                          `}
                        >
                          {activity.status}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      {activity.description || "Workspace activity"}
                    </p>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-600">
                      <Clock3 size={12} />
                      {formatActivityTime(activityDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
              <Activity
                size={21}
                className="text-zinc-500"
              />
            </div>

            <h3 className="mt-4 font-medium text-zinc-300">
              No recent activity
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
              Your project and document activity will appear
              here.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;
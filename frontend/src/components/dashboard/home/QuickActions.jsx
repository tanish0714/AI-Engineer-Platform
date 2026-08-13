import {
  MessageSquarePlus,
  FolderPlus,
  Upload,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../ui/Card";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "New AI Chat",
      description: "Start a conversation with your AI assistant.",
      icon: MessageSquarePlus,
      path: "/dashboard/chat",
      variant: "primary",
    },
    {
      title: "Create Project",
      description: "Create a new AI engineering workspace.",
      icon: FolderPlus,
      path: "/dashboard/projects",
      variant: "secondary",
    },
    {
      title: "Upload Document",
      description: "Add a document to your knowledge base.",
      icon: Upload,
      path: "/dashboard/knowledge-base",
      variant: "outline",
    },
  ];

  return (
    <Card hover={false}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm leading-6 text-zinc-500">
          Jump directly into your workspace.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-7 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path)}
              className={`
                group
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                p-4
                text-left
                transition-all
                duration-300

                ${
                  action.variant === "primary"
                    ? "border-blue-500/20 bg-gradient-to-r from-blue-600/15 to-cyan-500/10 hover:border-cyan-500/30 hover:from-blue-600/20 hover:to-cyan-500/15"
                    : action.variant === "secondary"
                    ? "border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]"
                    : "border-white/[0.07] bg-transparent hover:border-cyan-500/20 hover:bg-cyan-500/[0.04]"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl

                  ${
                    action.variant === "primary"
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "bg-white/[0.04] text-zinc-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400"
                  }
                `}
              >
                <Icon size={19} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">
                  {action.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {action.description}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight
                size={17}
                className="
                  shrink-0
                  text-zinc-600
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-cyan-400
                "
              />
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
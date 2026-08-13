import {
  ArrowRight,
  FolderPlus,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ user }) => {
  const navigate = useNavigate();

  const userName = user?.name || "Engineer";

  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        rounded-[32px]
        border
        border-white/[0.08]
        bg-gradient-to-br
        from-blue-600/[0.08]
        via-zinc-900/80
        to-cyan-500/[0.06]
        px-7
        py-8
        shadow-2xl
        shadow-black/20
        sm:px-9
        sm:py-10
        lg:px-12
        lg:py-12
      "
    >
      {/* Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-20
          h-80
          w-80
          rounded-full
          bg-blue-600/10
          blur-[120px]
        "
      />

      {/* Grid Glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
          [background-size:40px_40px]
        "
      />

      <div
        className="
          relative
          flex
          flex-col
          gap-10
          xl:flex-row
          xl:items-center
          xl:justify-between
          xl:gap-16
        "
      >
        {/* Left */}
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/[0.07]
              px-4
              py-2
              text-sm
              font-medium
              text-cyan-400
            "
          >
            <Sparkles size={15} />

            AI Engineer Workspace
          </div>

          {/* Greeting */}
          <p className="mt-7 text-sm font-medium text-zinc-500">
            Welcome back, {userName}
          </p>

          {/* Heading */}
          <h1
            className="
              mt-3
              text-4xl
              font-bold
              leading-[1.1]
              tracking-tight
              text-white
              sm:text-5xl
              lg:text-6xl
            "
          >
            Build AI Products
            <br />

            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              Faster Than Ever.
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-zinc-400
              sm:text-lg
              sm:leading-8
            "
          >
            Create projects, upload documents, build RAG knowledge
            bases, manage prompts, chat with your AI systems and
            build production-ready AI solutions from one workspace.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/projects")}
              className="
                group
                inline-flex
                items-center
                gap-2.5
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-cyan-500/20
              "
            >
              <FolderPlus size={18} />

              Create Project

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/chat")}
              className="
                inline-flex
                items-center
                gap-2.5
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-zinc-200
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-cyan-500/25
                hover:bg-cyan-500/[0.06]
                hover:text-white
              "
            >
              <MessageSquare size={18} />

              AI Chat
            </button>
          </div>
        </div>

        {/* Workspace Card */}
        <div
          className="
            w-full
            shrink-0
            xl:max-w-[360px]
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.08]
              bg-black/20
              p-6
              backdrop-blur-xl
              sm:p-7
            "
          >
            {/* Card Glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-12
                h-32
                w-32
                rounded-full
                bg-cyan-500/10
                blur-3xl
              "
            />

            <div className="relative">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Active Workspace
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-white">
                    AI Engineer Platform
                  </h2>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Sparkles size={18} />
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-white/[0.07]" />

              {/* Status */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500">
                    Platform Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

                    <span className="text-sm font-medium text-emerald-400">
                      All systems operational
                    </span>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="text-zinc-600"
                />
              </div>

              {/* Info */}
              <div className="mt-7 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-xs text-zinc-500">
                  Workspace account
                </p>

                <p className="mt-2 truncate text-sm font-medium text-zinc-200">
                  {user?.email || "Your AI workspace"}
                </p>
              </div>

              {/* Bottom */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  Ready to build
                </span>

                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  Healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090B]">

      {/* Background Glow */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* LEFT COLUMN */}
        {/* Increased left padding (pl-24 xl:pl-36) pushes the text away from the left edge toward the center */}
        <div className="hidden flex-col justify-center py-12 pl-24 pr-12 lg:flex xl:pl-36 xl:pr-16">
          <div className="max-w-xl">
            
            <p className="mb-4 font-semibold tracking-widest text-blue-400 uppercase">
              AI ENGINEER PLATFORM
            </p>

            <h1 className="text-5xl font-black leading-tight xl:text-6xl">
              Build AI Products,
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Not AI Demos.
              </span>
            </h1>

            <p className="mt-8 text-lg leading-9 text-zinc-400">
              One workspace to build production-ready AI applications using
              GenAI, Agentic AI, RAG, GitHub and autonomous workflows.
            </p>

            {/* Added mt-16 to give clear separation between the text and the stats */}
            <div className="mt-16 flex gap-16">
              <div>
                <h2 className="text-4xl font-bold">20+</h2>
                <p className="mt-2 text-zinc-500">
                  AI Tools
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">100%</h2>
                <p className="mt-2 text-zinc-500">
                  Open Source
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex items-center justify-center px-6 py-12">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default AuthLayout;
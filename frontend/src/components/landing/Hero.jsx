import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-20 px-8 sm:px-12 md:px-16 lg:flex-row lg:items-center lg:justify-between lg:px-20 xl:px-24">

        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          /* Added lg:pl-16 xl:pl-24 to push the left content towards the center on desktop */
          className="w-full lg:w-[48%] lg:pl-16 xl:pl-24"
        >
          <span className="inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-400 md:text-base">
            AI Powered Development Platform
          </span>

          <h1 className="mt-8 text-4xl font-black leading-[1.1] md:text-[55px]">
            Build Production-Ready
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              AI Products.
            </span>
            <br />
            Not Just Demos.
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-9 text-zinc-400">
            Build powerful AI products using GenAI, RAG, Agentic AI, GitHub
            Integration, Knowledge Base and autonomous workflows — all inside
            one unified workspace.
          </p>

          {/* Expanded margin above buttons (mt-16) to ensure ample breathing room */}
          <div className="mt-16 flex flex-wrap gap-6">
            <button className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1">
              Get Started
              <ArrowRight size={18} />
            </button>

            <button className="rounded-full border border-white/10 px-8 py-4 transition hover:bg-white/5">
              Live Demo
            </button>
          </div>

          <div className="mt-16 flex flex-wrap gap-12">
            <div>
              <h2 className="text-4xl font-bold">10+</h2>
              <p className="mt-2 text-zinc-500">AI Workflows</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">6+</h2>
              <p className="mt-2 text-zinc-500">AI Integrations</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">24/7</h2>
              <p className="mt-2 text-zinc-500">AI Assistance</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-12 flex w-full justify-around lg:mt-0 lg:w-[52%]"
        >
          <DashboardPreview />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
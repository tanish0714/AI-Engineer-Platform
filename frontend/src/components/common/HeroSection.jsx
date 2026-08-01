import { motion } from "framer-motion";
import Logo from "./Logo";

const stats = [
  { value: "20+", label: "AI Tools" },
  { value: "100%", label: "Open Source" },
];

const HeroSection = () => {
  return (
    /* 
      1. Ensure flex container stretches properly and centers content vertically 
      2. ml-auto / pl-12 to pl-24 creates guaranteed physical offset from left edge
    */
    <div className="hidden h-full w-full flex-col justify-between py-14 pl-12 pr-8 lg:flex lg:pl-20 xl:pl-32">
      
      {/* Outer constraint box pushing content inward towards center */}
      <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-between">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo />
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="my-auto py-8"
        >
          <span className="inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
            AI Powered Development Platform
          </span>

          <h1 className="mt-8 text-5xl font-black leading-[1.08] tracking-[-0.04em] xl:text-6xl">
            Build
            <span className="mt-2 block bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              AI Products
            </span>
            <span className="mt-2 block">
              That Matter.
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-400">
            One intelligent workspace to build, test and deploy
            production-ready AI products using RAG, Agentic AI,
            GitHub integration and modern workflows.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="flex gap-14"
        >
          {stats.map((item) => (
            <div key={item.label}>
              <h2 className="text-4xl font-bold">{item.value}</h2>
              <p className="mt-2 text-zinc-500">{item.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;
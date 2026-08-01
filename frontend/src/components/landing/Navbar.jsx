import { Link } from "react-router-dom";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { title: "Features", href: "#features" },
    { title: "Docs", href: "#docs" },
    { title: "Roadmap", href: "#roadmap" },
    { title: "GitHub", href: "#github" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full px-8 md:px-10 lg:px-16 pt-5">

        <div className="mx-auto flex h-20 w-full max-w-[1800px] px-10 lg:px-14  items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-8 lg:px-10 backdrop-blur-xl">

          {/* Logo */}

          <Link
  to="/"
  className="flex items-center gap-4 rounded-2xl outline-none focus:outline-none focus:ring-0"
>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-cyan-300 text-lg font-bold shadow-lg shadow-cyan-500/20">
              AI
            </div>

            <div className="gap-5 px-3 py-2">

              <h2 className="text-lg font-bold tracking-wide">
                AI Engineer
              </h2>

              <p className="text-xs text-zinc-400">
                Platform
              </p>

            </div>

          </Link>

          {/* Desktop Links */}

          <nav className="hidden lg:flex items-center gap-10">

            {navLinks.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="relative text-[20px] font-medium text-zinc-400 transition duration-300 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full"
              >
                {item.title}
              </a>
            ))}

          </nav>

          {/* Desktop Buttons */}

          <div className="hidden md:flex items-center gap-8 justify-evenly">

            <Link
              to="/login"
              className="rounded-md border border-white/10 px-6 py-2.5 gap-5 text-md font-medium text-zinc-300 transition hover:border-blue-500 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 gap-5 text-md font-semibold shadow-lg shadow-blue-600/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/40"
            >
              Get Started
            </Link>

          </div>

          {/* Mobile */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl text-white lg:hidden"
          >
            {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="mx-5 mt-3 rounded-2xl border border-white/10 bg-[#111114]/95 backdrop-blur-xl p-6 lg:hidden"
          >

            <div className="flex flex-col gap-5">

              {navLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-zinc-300 transition hover:text-white"
                >
                  {item.title}
                </a>
              ))}

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-3 rounded-xl border border-white/10 py-3 text-center"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-center font-semibold"
              >
                Get Started
              </Link>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </header>
  );
};

export default Navbar;
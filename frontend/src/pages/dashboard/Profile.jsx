import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Pencil,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

const Profile = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-8">

          <div className="flex flex-col items-center gap-6 md:flex-row">

            {/* Avatar */}

            <div className="relative">

              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-5xl font-bold">

                T

              </div>

              <button className="absolute bottom-2 right-2 rounded-full bg-white p-2 text-black">

                <Camera size={18} />

              </button>

            </div>

            {/* Info */}

            <div className="flex-1">

              <h1 className="text-3xl font-bold">

                Tanish Chourasia

              </h1>

              <p className="mt-2 text-zinc-400">

                Full Stack Developer • AI Engineer

              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-500">

                <div className="flex items-center gap-2">

                  <Mail size={16} />

                  tanish@gmail.com

                </div>

                <div className="flex items-center gap-2">

                  <Phone size={16} />

                  +91 XXXXX XXXXX

                </div>

                <div className="flex items-center gap-2">

                  <MapPin size={16} />

                  India

                </div>

              </div>

            </div>

            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3">

              <Pencil size={18} />

              Edit Profile

            </button>

          </div>

        </div>

        {/* Two Columns */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* About */}

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

            <h2 className="text-xl font-semibold">

              About

            </h2>

            <p className="mt-5 leading-8 text-zinc-400">

              Passionate Full Stack & AI Developer building
              production-ready AI applications using React,
              Node.js, Express, MongoDB, LangChain and LLMs.

            </p>

          </div>

          {/* Social */}

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

            <h2 className="text-xl font-semibold">

              Social Links

            </h2>

            <div className="mt-6 space-y-5">

              <div className="flex items-center gap-4">

                <FaGithub />

                github.com/tanish

              </div>

              <div className="flex items-center gap-4">

                <FaLinkedin />

                linkedin.com/in/tanish

              </div>

              <div className="flex items-center gap-4">

                <Globe />

                portfolio.com

              </div>

            </div>

          </div>

        </div>

        {/* Skills */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

          <h2 className="text-xl font-semibold">

            Skills

          </h2>

          <div className="mt-6 flex flex-wrap gap-4">

            {[
              "React",
              "Node.js",
              "MongoDB",
              "Express",
              "Tailwind CSS",
              "LangChain",
              "OpenAI",
              "Python",
              "Docker",
              "Git",
            ].map((skill) => (

              <span
                key={skill}
                className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Profile;
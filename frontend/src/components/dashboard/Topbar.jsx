import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../../services/api";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");

  // =====================================================
  // FETCH PROJECT TITLE
  // =====================================================

  useEffect(() => {
    const fetchProjectTitle = async () => {
      // Agar project page nahi hai
      if (!projectId) {
        setProjectTitle("");
        return;
      }

      try {
        console.log("📌 TOPBAR PROJECT ID:", projectId);

        const response = await api.get(
          `/projects/${projectId}`
        );

        console.log(
          "📌 TOPBAR PROJECT RESPONSE:",
          response.data
        );

        const project = response.data?.data;

        if (project?.title) {
          setProjectTitle(project.title);
        }
      } catch (error) {
        console.error(
          "❌ TOPBAR PROJECT FETCH ERROR:",
          error
        );

        setProjectTitle("");
      }
    };

    fetchProjectTitle();
  }, [projectId]);

  // =====================================================
  // PAGE TITLE
  // =====================================================

  const getPageTitle = () => {
    // Project details / project chat
    if (projectId) {
      return projectTitle || "Project";
    }

    if (location.pathname === "/dashboard") {
      return "Dashboard";
    }

    const lastSegment =
      location.pathname
        .split("/")
        .filter(Boolean)
        .pop() || "";

    return lastSegment
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const page = getPageTitle();

  return (
    <header
      className="
        flex
        min-h-[88px]
        items-center
        justify-between
        gap-6
        border-b
        border-white/10
        bg-[#09090B]
        px-6
        py-4
        sm:px-8
        lg:px-10
        xl:px-12
        2xl:px-16
      "
    >

      {/* =================================================
          LEFT
      ================================================= */}

      <div className="flex min-w-0 items-center gap-4">

        {/* Mobile menu */}

        <button
          type="button"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-zinc-900
            text-zinc-400
            transition
            hover:border-cyan-500
            hover:text-white
            lg:hidden
          "
        >
          <Menu size={19} />
        </button>

        <div className="min-w-0">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            AI ENGINEER PLATFORM
          </p>

          <h1
            className="
              mt-2
              truncate
              text-2xl
              font-bold
              text-white
              sm:text-3xl
            "
          >
            {page}
          </h1>

        </div>

      </div>


      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="flex shrink-0 items-center gap-4">

        {/* SEARCH */}

        <div className="relative hidden xl:block">

          <Search
            size={18}
            className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-zinc-500
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search projects, chats..."
            className="
              h-12
              w-[360px]
              rounded-2xl
              border
              border-white/10
              bg-zinc-900
              pl-12
              pr-5
              text-sm
              text-white
              outline-none
              transition-all
              placeholder:text-zinc-600
              focus:border-cyan-500
            "
          />

        </div>


        {/* THEME */}

        <button
          type="button"
          className="
            rounded-2xl
            border
            border-white/10
            bg-zinc-900
            p-3
            text-zinc-300
            transition
            hover:border-cyan-500
            hover:bg-zinc-800
          "
        >
          <Moon size={19} />
        </button>


        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="
            relative
            rounded-2xl
            border
            border-white/10
            bg-zinc-900
            p-3
            text-zinc-300
            transition
            hover:border-cyan-500
            hover:bg-zinc-800
          "
        >

          <Bell size={19} />

          <span
            className="
              absolute
              right-2
              top-2
              h-2.5
              w-2.5
              rounded-full
              bg-cyan-500
            "
          />

        </button>


        {/* PROFILE */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowProfile(!showProfile)
            }
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              bg-zinc-900
              px-4
              py-2
              transition-all
              hover:border-cyan-500
              hover:bg-zinc-800
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                font-bold
                text-white
              "
            >
              T
            </div>

            <div className="hidden text-left xl:block">

              <p className="text-sm font-semibold text-white">
                Tanish
              </p>

              <p className="text-xs text-zinc-500">
                AI Engineer
              </p>

            </div>

            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                showProfile
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>


          {/* DROPDOWN */}

          {showProfile && (

            <div
              className="
                absolute
                right-0
                top-[calc(100%+12px)]
                z-50
                w-72
                rounded-3xl
                border
                border-white/10
                bg-zinc-900
                p-5
                shadow-2xl
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500
                    text-lg
                    font-bold
                    text-white
                  "
                >
                  T
                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    Tanish
                  </h3>

                  <p className="text-sm text-zinc-500">
                    AI Engineer
                  </p>

                </div>

              </div>


              <div className="my-5 border-t border-white/10" />


              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/dashboard/profile");
                }}
                className="
                  mb-2
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  text-left
                  text-zinc-300
                  transition
                  hover:bg-zinc-800
                  hover:text-white
                "
              >
                <User size={18} />
                Profile
              </button>


              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/dashboard/settings");
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  text-left
                  text-zinc-300
                  transition
                  hover:bg-zinc-800
                  hover:text-white
                "
              >
                <Settings size={18} />
                Settings
              </button>


              <div className="my-5 border-t border-white/10" />


              <button
                type="button"
                className="
                  w-full
                  rounded-2xl
                  bg-red-500/10
                  py-3
                  font-medium
                  text-red-400
                  transition
                  hover:bg-red-500/20
                "
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
};

export default Topbar;
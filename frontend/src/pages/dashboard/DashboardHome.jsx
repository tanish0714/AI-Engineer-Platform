import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import HeroSection from "../../components/dashboard/home/HeroSection";
import StatsGrid from "../../components/dashboard/home/StatsGrid";
import RecentProjects from "../../components/dashboard/home/RecentProjects";
import RecentActivity from "../../components/dashboard/home/RecentActivity";
import QuickActions from "../../components/dashboard/home/QuickActions";
import StorageCard from "../../components/dashboard/home/StorageCard";

import { getDashboard } from "../../services/dashboard.service";

const DashboardHome = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboard();

      setDashboard(data);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="space-y-10">

        {/* Hero Skeleton */}
        <section>
          <div className="h-[420px] animate-pulse rounded-[32px] border border-white/[0.06] bg-white/[0.025]" />
        </section>

        {/* Stats Skeleton */}
        <section>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="
                  h-[150px]
                  animate-pulse
                  rounded-3xl
                  border
                  border-white/[0.06]
                  bg-white/[0.025]
                "
              />
            ))}
          </div>
        </section>

        {/* Main Skeleton */}
        <section className="grid gap-10 2xl:grid-cols-12">

          {/* Left */}
          <div className="space-y-10 2xl:col-span-8">
            <div className="h-[320px] animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.025]" />

            <div className="h-[320px] animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.025]" />
          </div>

          {/* Right */}
          <div className="space-y-10 2xl:col-span-4">
            <div className="h-[300px] animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.025]" />

            <div className="h-[220px] animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.025]" />
          </div>

        </section>
      </div>
    );
  }

  /* ---------------- Error ---------------- */

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="
            w-full
            max-w-lg
            rounded-3xl
            border
            border-white/[0.07]
            bg-white/[0.025]
            p-8
            text-center
            backdrop-blur-xl
          "
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <RefreshCw size={24} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-zinc-950
              transition
              hover:bg-zinc-200
            "
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- No Data ---------------- */

  if (!dashboard) {
    return null;
  }

  /* ---------------- Dashboard ---------------- */

  return (
    <div className="space-y-10">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px]">
        <HeroSection user={dashboard.user} />
      </section>

      {/* Stats */}
      <section>
        <StatsGrid
          stats={dashboard.stats}
          storage={dashboard.storage}
        />
      </section>

      {/* Main Grid */}
      <section className="grid gap-10 2xl:grid-cols-12">

        {/* Left */}
        <div className="space-y-10 2xl:col-span-8">

          <RecentProjects
            projects={dashboard.recentProjects}
          />

          <RecentActivity
            activities={dashboard.recentActivity}
          />

        </div>

        {/* Right */}
        <div className="space-y-10 2xl:col-span-4">

          <QuickActions />

          <StorageCard
            storage={dashboard.storage}
          />

        </div>

      </section>

    </div>
  );
};

export default DashboardHome;
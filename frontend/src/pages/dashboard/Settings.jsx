import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Save, Moon, Bell, Shield, User, Globe } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}

        <div>

          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your account preferences and platform settings.
          </p>

        </div>

        {/* General */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

          <div className="mb-6 flex items-center gap-3">

            <User className="text-cyan-400" />

            <h2 className="text-xl font-semibold">
              General
            </h2>

          </div>

          <div className="space-y-5">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-medium">
                  Display Name
                </h3>

                <p className="text-sm text-zinc-500">
                  Tanish Chourasia
                </p>

              </div>

              <button className="rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5">
                Edit
              </button>

            </div>

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-medium">
                  Language
                </h3>

                <p className="text-sm text-zinc-500">
                  English
                </p>

              </div>

              <Globe className="text-zinc-400" />

            </div>

          </div>

        </div>

        {/* Preferences */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

          <div className="mb-6 flex items-center gap-3">

            <Moon className="text-cyan-400" />

            <h2 className="text-xl font-semibold">
              Preferences
            </h2>

          </div>

          <div className="space-y-6">

            <div className="flex items-center justify-between">

              <span>Dark Mode</span>

              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 accent-cyan-500"
              />

            </div>

            <div className="flex items-center justify-between">

              <span>Email Notifications</span>

              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 accent-cyan-500"
              />

            </div>

            <div className="flex items-center justify-between">

              <span>AI Suggestions</span>

              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 accent-cyan-500"
              />

            </div>

          </div>

        </div>

        {/* Security */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

          <div className="mb-6 flex items-center gap-3">

            <Shield className="text-cyan-400" />

            <h2 className="text-xl font-semibold">
              Security
            </h2>

          </div>

          <div className="space-y-4">

            <button className="w-full rounded-xl border border-white/10 py-3 hover:bg-white/5">

              Change Password

            </button>

            <button className="w-full rounded-xl border border-red-500/30 py-3 text-red-400 hover:bg-red-500/10">

              Delete Account

            </button>

          </div>

        </div>

        {/* Notifications */}

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">

          <div className="mb-6 flex items-center gap-3">

            <Bell className="text-cyan-400" />

            <h2 className="text-xl font-semibold">
              Notifications
            </h2>

          </div>

          <p className="text-zinc-400">

            Receive updates about AI workflows,
            project activity and new platform features.

          </p>

        </div>

        {/* Save */}

        <div className="flex justify-end">

          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-medium hover:scale-105 transition">

            <Save size={18} />

            Save Changes

          </button>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Settings;
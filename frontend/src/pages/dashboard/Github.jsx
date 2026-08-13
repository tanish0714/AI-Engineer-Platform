import { useEffect, useState } from "react";

import {
  Code2,
  GitBranch,
  Star,
  GitFork,
  Lock,
  Globe,
  Loader2,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Unlink,
} from "lucide-react";

import { useSearchParams, useParams } from "react-router-dom";

import {
  getGitHubConnection,
  connectGitHub,
  getGitHubRepositories,
  linkGitHubRepository,
  analyzeGitHubRepository,
  disconnectGitHub,
} from "../../services/github";

const GitHub = () => {
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();

  const [connection, setConnection] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [repoLoading, setRepoLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD CONNECTION
  // =====================================================

  const loadConnection = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getGitHubConnection();

      setConnection(response?.data || null);
    } catch (err) {
      console.error("GitHub connection error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load GitHub connection"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD REPOSITORIES
  // =====================================================

  const loadRepositories = async () => {
    try {
      setRepoLoading(true);
      setError("");

      const response = await getGitHubRepositories();

      setRepositories(response?.data || []);
    } catch (err) {
      console.error("GitHub repositories error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load repositories"
      );
    } finally {
      setRepoLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const initialize = async () => {
      await loadConnection();
    };

    initialize();
  }, []);

  // =====================================================
  // HANDLE OAUTH REDIRECT
  // =====================================================

  useEffect(() => {
    const githubStatus = searchParams.get("github");

    if (githubStatus === "connected") {
      setSuccess("GitHub connected successfully.");

      // Refresh connection after OAuth
      loadConnection();
    }

    if (githubStatus === "error") {
      setError(
        searchParams.get("message") ||
          "GitHub connection failed."
      );
    }
  }, [searchParams]);

  // =====================================================
  // LOAD REPOSITORIES AFTER CONNECTION
  // =====================================================

  useEffect(() => {
    if (connection) {
      loadRepositories();
    }
  }, [connection]);

  // =====================================================
  // CONNECT GITHUB
  // =====================================================

  const handleConnect = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await connectGitHub();

      const url = response?.data?.url;

      if (!url) {
        throw new Error("GitHub authorization URL was not returned.");
      }

      window.location.href = url;
    } catch (err) {
      console.error("GitHub connect error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to connect GitHub"
      );
    }
  };

  // =====================================================
  // LINK REPOSITORY
  // =====================================================

  const handleLink = async () => {
    if (!selectedRepo) {
      setError("Please select a repository first.");
      return;
    }

    if (!projectId) {
      setError("Project ID is missing.");
      return;
    }

    try {
      setLinking(true);
      setError("");
      setSuccess("");

      const response = await linkGitHubRepository(
        projectId,
        selectedRepo.owner,
        selectedRepo.name
      );

      setProject(response?.data || null);

      setSuccess(
        `${selectedRepo.fullName} linked successfully.`
      );
    } catch (err) {
      console.error("Link repository error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to link repository"
      );
    } finally {
      setLinking(false);
    }
  };

  // =====================================================
  // ANALYZE REPOSITORY
  // =====================================================

  const handleAnalyze = async () => {
    if (!projectId) {
      setError("Project ID is missing.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSuccess("");

      const response =
        await analyzeGitHubRepository(projectId);

      setProject(
        response?.data?.project ||
          response?.data ||
          null
      );

      setSuccess(
        "Repository analyzed successfully."
      );
    } catch (err) {
      console.error("AI analysis error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Repository analysis failed"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // =====================================================
  // DISCONNECT
  // =====================================================

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      setError("");
      setSuccess("");

      await disconnectGitHub();

      setConnection(null);
      setRepositories([]);
      setSelectedRepo(null);
      setProject(null);

      setSuccess("GitHub disconnected successfully.");
    } catch (err) {
      console.error("GitHub disconnect error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to disconnect GitHub"
      );
    } finally {
      setDisconnecting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#0b0f19]">
        <Loader2
          size={32}
          className="animate-spin text-white"
        />
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0b0f19] px-4 py-6 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                <Code2 size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  GitHub Integration
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Connect GitHub, link repositories and
                  analyze your codebase with AI.
                </p>
              </div>

            </div>
          </div>

          {!connection ? (
            <button
              onClick={handleConnect}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              <Code2 size={18} />
              Connect GitHub
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {disconnecting ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Unlink size={18} />
              )}

              Disconnect
            </button>
          )}

        </div>

        {/* ================================================= */}
        {/* ALERTS */}
        {/* ================================================= */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm text-red-300">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>

          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4 text-sm text-emerald-300">

            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>

          </div>
        )}

        {/* ================================================= */}
        {/* NOT CONNECTED */}
        {/* ================================================= */}

        {!connection && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">

            <div className="flex flex-col items-center px-6 py-16 text-center">

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <Code2
                  size={38}
                  className="text-white"
                />
              </div>

              <h2 className="text-2xl font-bold">
                Connect your GitHub
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Connect your GitHub account to access
                repositories, link them with your projects
                and unlock AI-powered codebase analysis.
              </p>

              <button
                onClick={handleConnect}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
              >
                <Code2 size={18} />
                Connect GitHub
              </button>

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* CONNECTED */}
        {/* ================================================= */}

        {connection && (
          <>
            {/* ================================================= */}
            {/* PROFILE */}
            {/* ================================================= */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                {connection.avatarUrl ? (
                  <img
                    src={connection.avatarUrl}
                    alt={connection.username}
                    className="h-14 w-14 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.08]">
                    <Code2 size={26} />
                  </div>
                )}

                <div className="flex-1">

                  <h2 className="font-semibold text-white">
                    {connection.displayName ||
                      connection.username}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    @{connection.username}
                  </p>

                </div>

                <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1.5 text-xs font-medium text-emerald-300">

                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  Connected

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* REPOSITORIES */}
            {/* ================================================= */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Your Repositories
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Select a repository to link with
                    this project.
                  </p>
                </div>

                <button
                  onClick={loadRepositories}
                  disabled={repoLoading}
                  title="Refresh repositories"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={
                      repoLoading
                        ? "animate-spin"
                        : ""
                    }
                  />
                </button>

              </div>

              {/* REPO LOADING */}

              {repoLoading ? (
                <div className="flex min-h-[220px] items-center justify-center">

                  <Loader2
                    size={30}
                    className="animate-spin text-slate-300"
                  />

                </div>
              ) : repositories.length === 0 ? (

                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-14 text-center">

                  <GitBranch
                    size={32}
                    className="mx-auto mb-3 text-slate-500"
                  />

                  <p className="text-sm text-slate-400">
                    No repositories found.
                  </p>

                  <button
                    onClick={loadRepositories}
                    className="mt-4 text-sm font-medium text-white underline underline-offset-4 hover:text-slate-300"
                  >
                    Try again
                  </button>

                </div>

              ) : (

                <div className="grid gap-4 md:grid-cols-2">

                  {repositories.map((repo) => {

                    const selected =
                      selectedRepo?.id === repo.id;

                    return (
                      <button
                        key={repo.id}
                        onClick={() =>
                          setSelectedRepo(repo)
                        }
                        className={`group rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-white/40 bg-white/[0.10] ring-1 ring-white/30"
                            : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >

                        {/* REPO HEADER */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-2">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">

                              {repo.isPrivate ? (
                                <Lock
                                  size={15}
                                  className="text-slate-300"
                                />
                              ) : (
                                <Globe
                                  size={15}
                                  className="text-slate-300"
                                />
                              )}

                            </div>

                            <h3 className="truncate font-semibold text-white">
                              {repo.name}
                            </h3>

                          </div>

                          {selected && (
                            <CheckCircle2
                              size={19}
                              className="shrink-0 text-emerald-400"
                            />
                          )}

                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-3 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-400">
                          {repo.description ||
                            "No description available."}
                        </p>

                        {/* META */}

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

                          {repo.language && (
                            <span className="flex items-center gap-1.5">
                              <GitBranch size={14} />
                              {repo.language}
                            </span>
                          )}

                          <span className="flex items-center gap-1.5">
                            <Star size={14} />
                            {repo.stars ?? 0}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <GitFork size={14} />
                            {repo.forks ?? 0}
                          </span>

                          {repo.isPrivate && (
                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-slate-400">
                              Private
                            </span>
                          )}

                        </div>

                      </button>
                    );
                  })}

                </div>
              )}

              {/* ================================================= */}
              {/* SELECTED REPOSITORY */}
              {/* ================================================= */}

              {selectedRepo && (
                <div className="mt-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="min-w-0">

                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Selected repository
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-white">
                      {selectedRepo.fullName}
                    </p>

                  </div>

                  <button
                    onClick={handleLink}
                    disabled={linking}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {linking ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <LinkIcon size={18} />
                    )}

                    {linking
                      ? "Linking..."
                      : "Link Repository"}

                  </button>

                </div>
              )}

            </div>

            {/* ================================================= */}
            {/* AI ANALYSIS */}
            {/* ================================================= */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/[0.08]">

                    <Sparkles
                      size={21}
                      className="text-purple-300"
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-white">
                      AI Repository Analysis
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                      Analyze architecture, technology
                      stack, code quality, security,
                      project structure and AI
                      opportunities.
                    </p>

                  </div>

                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {analyzing ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={18} />
                  )}

                  {analyzing
                    ? "Analyzing..."
                    : "Analyze Repository"}

                </button>

              </div>

              {/* ANALYSIS STATUS */}

              {project?.github?.analysis && (
                <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">

                      <CheckCircle2
                        size={19}
                        className="text-emerald-400"
                      />

                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Analysis Complete
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Your repository has been
                        successfully analyzed.
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default GitHub;
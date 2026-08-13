import githubService from "../services/github.service.js";
import ApiError from "../utils/ApiError.js";

// =====================================================
// CONNECT GITHUB
// =====================================================

const connectGitHub = async (
  req,
  res
) => {
  const userId =
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  // Optional project ID
  const projectId =
    req.query.projectId || null;

  const url =
    githubService.getAuthUrl(
      userId,
      projectId
    );

  return res.status(200).json({
    success: true,

    data: {
      url,
    },
  });
};

// =====================================================
// CALLBACK
// =====================================================

const githubCallback = async (
  req,
  res
) => {
  const {
    code,
    state,
    error,
  } = req.query;

  const frontendUrl =
    githubService.getFrontendUrl();

  if (error) {
    return res.redirect(
      `${frontendUrl}/dashboard?github=error&message=${encodeURIComponent(
        "GitHub authorization was cancelled"
      )}`
    );
  }

  if (!code || !state) {
    return res.redirect(
      `${frontendUrl}/dashboard?github=error&message=${encodeURIComponent(
        "Invalid GitHub callback"
      )}`
    );
  }

  try {
    const result =
      await githubService.handleOAuthCallback(
        code,
        state
      );

    const redirectUrl =
      new URL(
        "/dashboard",
        frontendUrl
      );

    redirectUrl.searchParams.set(
      "github",
      "connected"
    );

    redirectUrl.searchParams.set(
      "username",
      result.githubUsername
    );

    if (result.projectId) {
      redirectUrl.searchParams.set(
        "projectId",
        result.projectId
      );
    }

    return res.redirect(
      redirectUrl.toString()
    );

  } catch (error) {
    console.error(
      "GitHub OAuth callback error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/dashboard?github=error&message=${encodeURIComponent(
        error.message ||
          "GitHub connection failed"
      )}`
    );
  }
};

// =====================================================
// CONNECTION STATUS
// =====================================================

const getConnection = async (
  req,
  res
) => {
  const userId =
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const connection =
    await githubService.getConnection(
      userId
    );

  return res.status(200).json({
    success: true,

    connected:
      Boolean(connection),

    data:
      connection || null,
  });
};

// =====================================================
// REPOSITORIES
// =====================================================

const getRepositories = async (
  req,
  res
) => {
  const userId =
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const page =
    Number(req.query.page) || 1;

  const perPage =
    Number(req.query.perPage) || 30;

  const repositories =
    await githubService.getRepositories(
      userId,
      page,
      perPage
    );

  return res.status(200).json({
    success: true,

    data: repositories,

    page,

    perPage,
  });
};

// =====================================================
// LINK REPOSITORY
// =====================================================

const linkRepository = async (
  req,
  res
) => {
  const userId =
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const {
    projectId,
    owner,
    name,
  } = req.body;

  if (
    !projectId ||
    !owner ||
    !name
  ) {
    throw new ApiError(
      400,
      "projectId, owner and name are required"
    );
  }

  const project =
    await githubService.linkRepository(
      userId,
      projectId,
      {
        owner,
        name,
      }
    );

  return res.status(200).json({
    success: true,

    message:
      "GitHub repository linked successfully",

    data: project,
  });
};

// =====================================================
// ANALYZE REPOSITORY
// =====================================================

const analyzeRepository = async (
  req,
  res
) => {
  const userId =
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const {
    projectId,
  } = req.body;

  if (!projectId) {
    throw new ApiError(
      400,
      "projectId is required"
    );
  }

  const result =
    await githubService.analyzeRepository(
      userId,
      projectId
    );

  return res.status(200).json({
    success: true,

    message:
      "Repository analyzed successfully",

    data: result,
  });
};

// =====================================================
// DISCONNECT
// =====================================================

const disconnectGitHub = async (
  req,
  res
) => {
  const userId =
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  await githubService.disconnect(
    userId
  );

  return res.status(200).json({
    success: true,

    message:
      "GitHub disconnected successfully",
  });
};

// =====================================================
// EXPORT
// =====================================================

export {
  connectGitHub,
  githubCallback,
  getConnection,
  getRepositories,
  linkRepository,
  analyzeRepository,
  disconnectGitHub,
};
import api from "./api";

// =====================================================
// GET GITHUB CONNECTION
// =====================================================

export const getGitHubConnection = async () => {
  const response = await api.get("/github/connection");

  return response.data;
};

// =====================================================
// CONNECT GITHUB
// =====================================================

export const connectGitHub = async (projectId = null) => {
  const response = await api.get("/github/auth", {
    params: projectId
      ? {
          projectId,
        }
      : {},
  });

  const url = response.data?.data?.url;

  if (!url) {
    throw new Error(
      "GitHub authorization URL not received"
    );
  }

  window.location.assign(url);
};

// =====================================================
// GET REPOSITORIES
// =====================================================

export const getGitHubRepositories = async (
  page = 1,
  perPage = 30
) => {
  const response = await api.get(
    "/github/repositories",
    {
      params: {
        page,
        perPage,
      },
    }
  );

  return response.data;
};

// =====================================================
// LINK REPOSITORY
// =====================================================

export const linkGitHubRepository = async (
  projectId,
  owner,
  name
) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!owner || !name) {
    throw new Error(
      "Repository owner and name are required"
    );
  }

  const response = await api.post(
    "/github/link",
    {
      projectId,
      owner,
      name,
    }
  );

  return response.data;
};

// =====================================================
// ANALYZE REPOSITORY
// =====================================================

export const analyzeGitHubRepository = async (
  projectId
) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const response = await api.post(
    "/github/analyze",
    {
      projectId,
    }
  );

  return response.data;
};

// =====================================================
// DISCONNECT GITHUB
// =====================================================

export const disconnectGitHub = async () => {
  const response = await api.delete(
    "/github/disconnect"
  );

  return response.data;
};
import crypto from "crypto";
import axios from "axios";
import jwt from "jsonwebtoken";

import GitHubConnection from "../models/github.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

// =====================================================
// CONSTANTS
// =====================================================

const GITHUB_API = "https://api.github.com";
const GITHUB_OAUTH_URL = "https://github.com/login/oauth";

// =====================================================
// CONFIG
// =====================================================

const getGitHubConfig = () => {
  return {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,

    frontendUrl:
      process.env.FRONTEND_URL || "http://localhost:5173",

    aiServiceUrl:
      process.env.AI_SERVICE_URL || "http://127.0.0.1:8000",

    jwtSecret: process.env.JWT_SECRET,

    encryptionKeyHex:
      process.env.GITHUB_TOKEN_ENCRYPTION_KEY,
  };
};

// =====================================================
// GITHUB CLIENT
// =====================================================

const githubClient = axios.create({
  baseURL: GITHUB_API,

  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },

  timeout: 15000,
});

// =====================================================
// ENCRYPTION KEY
// =====================================================

const getEncryptionKey = () => {
  const { encryptionKeyHex } = getGitHubConfig();

  if (!encryptionKeyHex) {
    throw new ApiError(
      500,
      "GitHub token encryption key is not configured"
    );
  }

  const key = Buffer.from(encryptionKeyHex, "hex");

  if (key.length !== 32) {
    throw new ApiError(
      500,
      "GitHub token encryption key must be exactly 32 bytes"
    );
  }

  return key;
};

// =====================================================
// ENCRYPT TOKEN
// =====================================================

const encryptToken = (token) => {
  const key = getEncryptionKey();

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  let encrypted = cipher.update(
    token,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted,
  ].join(".");
};

// =====================================================
// DECRYPT TOKEN
// =====================================================

const decryptToken = (payload) => {
  if (!payload) {
    throw new ApiError(
      500,
      "GitHub access token is missing"
    );
  }

  const key = getEncryptionKey();

  const parts = payload.split(".");

  if (parts.length !== 3) {
    throw new ApiError(
      500,
      "Invalid encrypted GitHub token"
    );
  }

  const [
    ivHex,
    authTagHex,
    encrypted,
  ] = parts;

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(
      Buffer.from(authTagHex, "hex")
    );

    let decrypted = decipher.update(
      encrypted,
      "hex",
      "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    throw new ApiError(
      500,
      "Unable to decrypt GitHub access token"
    );
  }
};

// =====================================================
// OAUTH STATE
// =====================================================

const createOAuthState = (
  userId,
  projectId
) => {
  const { jwtSecret } = getGitHubConfig();

  if (!jwtSecret) {
    throw new ApiError(
      500,
      "JWT secret is not configured"
    );
  }

  return jwt.sign(
    {
      userId: userId.toString(),

      projectId: projectId
        ? projectId.toString()
        : null,

      purpose: "github-oauth",
    },

    jwtSecret,

    {
      expiresIn: "10m",
    }
  );
};

// =====================================================
// VERIFY OAUTH STATE
// =====================================================

const verifyOAuthState = (state) => {
  const { jwtSecret } = getGitHubConfig();

  if (!jwtSecret) {
    throw new ApiError(
      500,
      "JWT secret is not configured"
    );
  }

  try {
    const decoded = jwt.verify(
      state,
      jwtSecret
    );

    if (
      decoded.purpose !==
      "github-oauth"
    ) {
      throw new Error(
        "Invalid OAuth purpose"
      );
    }

    if (!decoded.userId) {
      throw new Error(
        "User ID missing from OAuth state"
      );
    }

    return decoded;
  } catch {
    throw new ApiError(
      400,
      "Invalid or expired GitHub OAuth state"
    );
  }
};

// =====================================================
// GET AUTH URL
// =====================================================

const getAuthUrl = (
  userId,
  projectId
) => {
  const {
    clientId,
    clientSecret,
    callbackUrl,
  } = getGitHubConfig();

  if (
    !clientId ||
    !clientSecret ||
    !callbackUrl
  ) {
    throw new ApiError(
      500,
      "GitHub OAuth is not configured"
    );
  }

  const state = createOAuthState(
    userId,
    projectId
  );

  const params = new URLSearchParams({
    client_id: clientId,

    redirect_uri: callbackUrl,

    scope:
      "read:user user:email repo",

    state,
  });

  return (
    `${GITHUB_OAUTH_URL}/authorize?` +
    params.toString()
  );
};

// =====================================================
// EXCHANGE CODE FOR TOKEN
// =====================================================

const exchangeCodeForToken = async (
  code
) => {
  const {
    clientId,
    clientSecret,
  } = getGitHubConfig();

  if (
    !clientId ||
    !clientSecret
  ) {
    throw new ApiError(
      500,
      "GitHub OAuth credentials are not configured"
    );
  }

  try {
    const response =
      await axios.post(
        `${GITHUB_OAUTH_URL}/access_token`,

        {
          client_id: clientId,

          client_secret:
            clientSecret,

          code,
        },

        {
          headers: {
            Accept:
              "application/json",
          },

          timeout: 15000,
        }
      );

    if (response.data?.error) {
      throw new ApiError(
        400,

        response.data
          .error_description ||
          "GitHub OAuth failed"
      );
    }

    if (
      !response.data?.access_token
    ) {
      throw new ApiError(
        400,
        "GitHub did not return an access token"
      );
    }

    return response.data;
  } catch (error) {
    if (
      error instanceof ApiError
    ) {
      throw error;
    }

    throw new ApiError(
      502,
      "Unable to exchange GitHub OAuth code"
    );
  }
};

// =====================================================
// GET GITHUB USER
// =====================================================

const getGitHubUser = async (
  accessToken
) => {
  try {
    const response =
      await githubClient.get(
        "/user",

        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    return response.data;
  } catch (error) {
    throw new ApiError(
      error.response?.status === 401
        ? 401
        : 502,

      error.response?.data?.message ||
        "Unable to fetch GitHub user"
    );
  }
};

// =====================================================
// GET GITHUB EMAIL
// =====================================================

const getGitHubEmail = async (
  accessToken
) => {
  try {
    const response =
      await githubClient.get(
        "/user/emails",

        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    const primary =
      response.data?.find(
        (item) =>
          item.primary &&
          item.verified
      );

    return primary?.email || "";
  } catch {
    return "";
  }
};

// =====================================================
// SAVE CONNECTION
// =====================================================

const saveConnection = async (
  userId,
  tokenData,
  githubUser
) => {
  const email =
    await getGitHubEmail(
      tokenData.access_token
    );

  const encryptedToken =
    encryptToken(
      tokenData.access_token
    );

  const connection =
    await GitHubConnection.findOneAndUpdate(
      {
        user: userId,
      },

      {
        user: userId,

        githubUserId:
          githubUser.id,

        username:
          githubUser.login,

        displayName:
          githubUser.name ||
          githubUser.login,

        avatarUrl:
          githubUser.avatar_url ||
          "",

        profileUrl:
          githubUser.html_url ||
          "",

        email,

        accessToken:
          encryptedToken,

        tokenType:
          tokenData.token_type ||
          "bearer",

        connectedAt:
          new Date(),

        lastSyncedAt:
          new Date(),
      },

      {
        new: true,

        upsert: true,

        setDefaultsOnInsert:
          true,
      }
    );

  return connection;
};

// =====================================================
// COMPLETE OAUTH CALLBACK
// =====================================================

const handleOAuthCallback = async (
  code,
  state
) => {
  if (!code || !state) {
    throw new ApiError(
      400,
      "GitHub authorization code and state are required"
    );
  }

  const decoded =
    verifyOAuthState(state);

  const userId =
    decoded.userId;

  const projectId =
    decoded.projectId || null;

  const tokenData =
    await exchangeCodeForToken(
      code
    );

  const githubUser =
    await getGitHubUser(
      tokenData.access_token
    );

  await saveConnection(
    userId,
    tokenData,
    githubUser
  );

  return {
    userId,

    projectId,

    githubUsername:
      githubUser.login,
  };
};

// =====================================================
// GET CONNECTION
// =====================================================

const getConnection = async (
  userId
) => {
  const connection =
    await GitHubConnection.findOne({
      user: userId,
    }).select(
      "-accessToken"
    );

  return connection;
};

// =====================================================
// GET ACCESS TOKEN
// =====================================================

const getAccessToken = async (
  userId
) => {
  const connection =
    await GitHubConnection.findOne({
      user: userId,
    }).select(
      "+accessToken"
    );

  if (!connection) {
    throw new ApiError(
      404,
      "GitHub account is not connected"
    );
  }

  return decryptToken(
    connection.accessToken
  );
};

// =====================================================
// GITHUB REQUEST
// =====================================================

// =====================================================
// GITHUB REQUEST
// =====================================================

const githubRequest = async (userId, config) => {
  const token = await getAccessToken(userId);

  try {
    const response = await githubClient.request({
      ...config,

      headers: {
        ...(config.headers || {}),

        Accept: "application/vnd.github+json",

        "X-GitHub-Api-Version": "2022-11-28",

        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    // =================================================
    // LOG REAL GITHUB ERROR
    // =================================================

    console.error("\n========================================");
    console.error("GitHub API Request Failed");
    console.error("========================================");

    console.error(
      "Method:",
      config.method || "GET"
    );

    console.error(
      "URL:",
      config.url
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Status Text:",
      error.response?.statusText
    );

    console.error(
      "GitHub Response:",
      error.response?.data
    );

    console.error(
      "Axios Error:",
      error.message
    );

    console.error("========================================\n");

    // =================================================
    // TOKEN EXPIRED / REVOKED
    // =================================================

    if (error.response?.status === 401) {
      await GitHubConnection.deleteOne({
        user: userId,
      });

      throw new ApiError(
        401,
        "GitHub authorization expired or was revoked. Please reconnect GitHub."
      );
    }

    // =================================================
    // FORBIDDEN
    // =================================================

    if (error.response?.status === 403) {
      const message =
        error.response?.data?.message ||
        "GitHub denied this request.";

      throw new ApiError(
        403,
        `GitHub access denied: ${message}`
      );
    }

    // =================================================
    // NOT FOUND
    // =================================================

    if (error.response?.status === 404) {
      throw new ApiError(
        404,
        "GitHub resource was not found."
      );
    }

    // =================================================
    // RATE LIMIT
    // =================================================

    if (error.response?.status === 429) {
      throw new ApiError(
        429,
        "GitHub API rate limit exceeded. Please try again later."
      );
    }

    // =================================================
    // NETWORK / TIMEOUT
    // =================================================

    if (!error.response) {
      throw new ApiError(
        502,
        `Unable to connect to GitHub: ${error.message}`
      );
    }

    // =================================================
    // GENERAL GITHUB ERROR
    // =================================================

    throw new ApiError(
      error.response.status,
      error.response.data?.message ||
        "GitHub API request failed"
    );
  }
};

// =====================================================
// GET REPOSITORIES
// =====================================================

const getRepositories = async (
  userId,
  page = 1,
  perPage = 30
) => {
  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safePerPage =
    Math.min(
      Math.max(
        Number(perPage) || 30,
        1
      ),
      100
    );

  const data =
    await githubRequest(
      userId,

      {
        method: "GET",

        url: "/user/repos",

        params: {
          visibility: "all",

          affiliation:
            "owner,collaborator,organization_member",

          sort: "updated",

          direction: "desc",

          page: safePage,

          per_page:
            safePerPage,
        },
      }
    );

  return data.map(
    (repo) => ({
      id: repo.id,

      name: repo.name,

      fullName:
        repo.full_name,

      description:
        repo.description || "",

      htmlUrl:
        repo.html_url,

      cloneUrl:
        repo.clone_url,

      sshUrl:
        repo.ssh_url,

      defaultBranch:
        repo.default_branch,

      language:
        repo.language,

      stars:
        repo.stargazers_count,

      forks:
        repo.forks_count,

      watchers:
        repo.watchers_count,

      isPrivate:
        repo.private,

      isFork:
        repo.fork,

      updatedAt:
        repo.updated_at,

      owner:
        repo.owner?.login ||
        "",
    })
  );
};

// =====================================================
// GET SINGLE REPOSITORY
// =====================================================

const getRepository = async (
  userId,
  owner,
  repo
) => {
  if (!owner || !repo) {
    throw new ApiError(
      400,
      "Repository owner and name are required"
    );
  }

  return githubRequest(
    userId,

    {
      method: "GET",

      url:
        `/repos/${encodeURIComponent(
          owner
        )}/${encodeURIComponent(
          repo
        )}`,
    }
  );
};

// =====================================================
// GET REPOSITORY TREE
// =====================================================

const getRepositoryTree = async (
  userId,
  owner,
  repo,
  branch
) => {
  const repository =
    await getRepository(
      userId,
      owner,
      repo
    );

  const branchName =
    branch ||
    repository.default_branch;

  const data =
    await githubRequest(
      userId,

      {
        method: "GET",

        url:
          `/repos/${encodeURIComponent(
            owner
          )}/${encodeURIComponent(
            repo
          )}/git/trees/${encodeURIComponent(
            branchName
          )}`,

        params: {
          recursive: "1",
        },
      }
    );

  return {
    repository,

    branch:
      branchName,

    tree:
      data.tree || [],
  };
};

// =====================================================
// GET FILE CONTENT
// =====================================================

const getFileContent = async (
  userId,
  owner,
  repo,
  path,
  ref
) => {
  if (!path) {
    throw new ApiError(
      400,
      "File path is required"
    );
  }

  const encodedPath =
    path
      .split("/")
      .map(encodeURIComponent)
      .join("/");

  const data =
    await githubRequest(
      userId,

      {
        method: "GET",

        url:
          `/repos/${encodeURIComponent(
            owner
          )}/${encodeURIComponent(
            repo
          )}/contents/${encodedPath}`,

        params: ref
          ? { ref }
          : undefined,
      }
    );

  if (data.type !== "file") {
    throw new ApiError(
      400,
      "Requested GitHub path is not a file"
    );
  }

  if (!data.content) {
    throw new ApiError(
      400,
      "GitHub file content is unavailable"
    );
  }

  return {
    name: data.name,

    path: data.path,

    sha: data.sha,

    size: data.size,

    encoding: data.encoding,

    content:
      Buffer.from(
        data.content,
        "base64"
      ).toString("utf8"),
  };
};

// =====================================================
// LINK REPOSITORY
// =====================================================

// =====================================================
// LINK REPOSITORY
// =====================================================

const linkRepository = async (
  userId,
  projectId,
  repository
) => {
  if (
    !repository?.owner ||
    !repository?.name
  ) {
    throw new ApiError(
      400,
      "Repository owner and name are required"
    );
  }

  if (!projectId) {
    throw new ApiError(
      400,
      "Project ID is required"
    );
  }

  const project =
    await Project.findOne({
      _id: projectId,
      owner: userId,
    });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found"
    );
  }

  // Verify repository actually exists
  const githubRepository =
    await getRepository(
      userId,
      repository.owner,
      repository.name
    );

  // ==========================================
  // SAVE USING ACTUAL PROJECT SCHEMA FIELDS
  // ==========================================

  project.github.connected = true;

  project.github.repositoryId =
    githubRepository.id;

  project.github.repositoryOwner =
    githubRepository.owner?.login ||
    repository.owner;

  project.github.repositoryName =
    githubRepository.name ||
    repository.name;

  project.github.repositoryUrl =
    githubRepository.html_url || "";

  project.github.defaultBranch =
    githubRepository.default_branch ||
    "main";

  project.github.lastSyncedAt =
    new Date();

  project.github.syncStatus =
    "synced";

  project.github.lastCommit = {
    sha: "",
    message: "",
    author: "",
    committedAt: null,
  };

  project.github.fileCount = 0;

  project.github.analysisStatus =
    "not-analyzed";

  project.github.lastAnalyzedAt =
    null;

  project.github.analysis =
    null;

  await project.save();

  return project;
};

// =====================================================
// ANALYZE REPOSITORY
// =====================================================

const analyzeRepository = async (
  userId,
  projectId
) => {
  const project =
    await Project.findOne({
      _id: projectId,
      owner: userId,
    });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found"
    );
  }

  // ==========================================
  // CHECK LINKED REPOSITORY
  // ==========================================

  if (
    !project.github?.connected ||
    !project.github?.repositoryOwner ||
    !project.github?.repositoryName
  ) {
    throw new ApiError(
      400,
      "No GitHub repository linked to this project"
    );
  }

  // ==========================================
  // MARK AS ANALYZING
  // ==========================================

  project.github.analysisStatus =
    "analyzing";

  project.github.syncStatus =
    "syncing";

  await project.save();

  try {
    const owner =
      project.github.repositoryOwner;

    const repoName =
      project.github.repositoryName;

    const branch =
      project.github.defaultBranch ||
      "main";

    // ==========================================
    // GET REPOSITORY
    // ==========================================

    const repo =
      await getRepository(
        userId,
        owner,
        repoName
      );

    // ==========================================
    // GET REPOSITORY TREE
    // ==========================================

    const treeData =
      await getRepositoryTree(
        userId,
        owner,
        repoName,
        branch
      );

    // ==========================================
    // IGNORED DIRECTORIES
    // ==========================================

    const ignoredDirectories = [
      "node_modules",
      "dist",
      "build",
      ".next",
      "coverage",
      "__pycache__",
      ".venv",
      "venv",
      ".git",
    ];

    // ==========================================
    // GET FILES
    // ==========================================

    const files =
      treeData.tree
        .filter(
          (item) =>
            item.type === "blob"
        )
        .filter(
          (item) =>
            !item.path.startsWith(
              ".git/"
            )
        )
        .filter(
          (item) =>
            !item.path
              .split("/")
              .some((part) =>
                ignoredDirectories.includes(
                  part
                )
              )
        )
        .filter(
          (item) =>
            !item.path
              .toLowerCase()
              .endsWith(".lock")
        )
        .slice(0, 100);

    // ==========================================
    // IMPORTANT FILES
    // ==========================================

    const importantFileNames = [
      "README.md",
      "package.json",
      "requirements.txt",
      "pyproject.toml",
      "Dockerfile",
      "docker-compose.yml",
      ".env.example",
    ];

    const importantFiles =
      files.filter((file) =>
        importantFileNames.includes(
          file.path
            .split("/")
            .pop()
        )
      );

    // ==========================================
    // SELECT FILES
    // ==========================================

    const selectedFiles = [
      ...importantFiles,

      ...files.filter(
        (file) =>
          !importantFiles.some(
            (important) =>
              important.path ===
              file.path
          )
      ),
    ].slice(0, 40);

    // ==========================================
    // FETCH FILE CONTENT
    // ==========================================

    const fileContents = [];

    for (
      const file of selectedFiles
    ) {
      try {
        const content =
          await getFileContent(
            userId,
            owner,
            repoName,
            file.path,
            treeData.branch
          );

        fileContents.push({
          path: content.path,

          content:
            content.content.slice(
              0,
              30000
            ),
        });
      } catch (error) {
        console.warn(
          `Skipping file: ${file.path}`
        );
      }
    }

    // ==========================================
    // UPDATE FILE COUNT
    // ==========================================

    project.github.fileCount =
      files.length;

    // ==========================================
    // AI SERVICE
    // ==========================================

    const {
      aiServiceUrl,
    } = getGitHubConfig();

    const aiResponse =
      await axios.post(
        `${aiServiceUrl}/github/analyze`,

        {
          project_id:
            projectId.toString(),

          repository: {
            name:
              repo.name,

            full_name:
              repo.full_name,

            description:
              repo.description || "",

            language:
              repo.language,

            stars:
              repo.stargazers_count,

            forks:
              repo.forks_count,

            default_branch:
              repo.default_branch,
          },

          tree:
            files.map(
              (item) =>
                item.path
            ),

          files:
            fileContents,
        },

        {
          timeout: 120000,
        }
      );

    // ==========================================
    // SAVE AI ANALYSIS
    // ==========================================

    const analysis =
      aiResponse.data;

    project.github.analysis =
      analysis.analysis ||
      analysis;

    project.github.analysisStatus =
      "completed";

    project.github.syncStatus =
      "synced";

    project.github.lastAnalyzedAt =
      new Date();

    project.github.lastSyncedAt =
      new Date();

    await project.save();

    return {
      project,

      analysis:
        project.github.analysis,
    };

  } catch (error) {

    // ==========================================
    // FAILURE STATE
    // ==========================================

    project.github.analysisStatus =
      "failed";

    project.github.syncStatus =
      "failed";

    await project.save();

    if (
      error instanceof ApiError
    ) {
      throw error;
    }

    throw new ApiError(
      error.response?.status ||
        500,

      error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "GitHub repository analysis failed"
    );
  }
};

// =====================================================
// DISCONNECT
// =====================================================

const disconnect = async (
  userId
) => {
  await GitHubConnection.deleteOne({
    user: userId,
  });

  await Project.updateMany(
    {
      owner: userId,

      "github.connected": true,
    },

    {
      $set: {
        "github.connected": false,

        "github.repositoryId": null,

        "github.repositoryUrl": "",

        "github.repositoryName": "",

        "github.repositoryOwner": "",

        "github.defaultBranch": "main",

        "github.lastSyncedAt": null,

        "github.syncStatus":
          "not_connected",

        "github.lastCommit": {
          sha: "",
          message: "",
          author: "",
          committedAt: null,
        },

        "github.fileCount": 0,

        "github.analysisStatus":
          "not-analyzed",

        "github.lastAnalyzedAt":
          null,

        "github.analysis":
          null,
      },
    }
  );
};

// =====================================================
// EXPORT
// =====================================================

export default {
  getAuthUrl,

  handleOAuthCallback,

  getConnection,

  getRepositories,

  getRepository,

  getRepositoryTree,

  getFileContent,

  linkRepository,

  analyzeRepository,

  disconnect,

  getFrontendUrl: () =>
    getGitHubConfig().frontendUrl,
};
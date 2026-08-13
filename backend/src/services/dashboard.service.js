import Project from "../models/project.model.js";
import Document from "../models/document.model.js";

class DashboardService {
  async getDashboard(userId) {
    const [
      projectCount,
      documentCount,
      activeProjectCount,
      archivedProjectCount,
      storageResult,
      recentProjects,
      recentDocuments,
    ] = await Promise.all([
      // Total projects
      Project.countDocuments({
        owner: userId,
      }),

      // Total documents uploaded by user
      Document.countDocuments({
        uploadedBy: userId,
      }),

      // Active projects
      Project.countDocuments({
        owner: userId,
        status: "active",
      }),

      // Archived projects
      Project.countDocuments({
        owner: userId,
        status: "archived",
      }),

      // Total storage used by user's documents
      Document.aggregate([
        {
          $match: {
            uploadedBy: userId,
          },
        },
        {
          $group: {
            _id: null,
            totalBytes: {
              $sum: "$fileSize",
            },
          },
        },
      ]),

      // Recent projects
      Project.find({
        owner: userId,
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select(
          "title description status visibility thumbnail createdAt updatedAt"
        )
        .lean(),

      // Recent documents
      Document.find({
        uploadedBy: userId,
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "project originalName fileName fileType fileSize processingStatus createdAt updatedAt"
        )
        .populate("project", "title")
        .lean(),
    ]);

    const totalBytes = storageResult[0]?.totalBytes || 0;

    const storageLimitGB = Number(
      process.env.STORAGE_LIMIT_GB || 5
    );

    const storageLimitBytes =
      storageLimitGB * 1024 * 1024 * 1024;

    const storageUsedGB =
      totalBytes / (1024 * 1024 * 1024);

    const storagePercentage =
      storageLimitBytes > 0
        ? Math.min(
            (totalBytes / storageLimitBytes) * 100,
            100
          )
        : 0;

    // Combine projects + documents into a simple
    // recent activity feed.
    const projectActivities = recentProjects.map(
      (project) => ({
        type: "project",
        action: "updated",
        title: project.title,
        description:
          project.description || "Project updated",
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })
    );

    const documentActivities = recentDocuments.map(
      (document) => ({
        type: "document",
        action: "uploaded",
        title: document.originalName,
        description: document.project?.title
          ? `Uploaded to ${document.project.title}`
          : "Document uploaded",
        status: document.processingStatus,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      })
    );

    const recentActivity = [
      ...projectActivities,
      ...documentActivities,
    ]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, 8);

    return {
      stats: {
        projects: projectCount,
        documents: documentCount,
        activeProjects: activeProjectCount,
        archivedProjects: archivedProjectCount,
      },

      storage: {
        usedBytes: totalBytes,
        usedGB: Number(storageUsedGB.toFixed(2)),
        limitGB: storageLimitGB,
        percentage: Number(
          storagePercentage.toFixed(2)
        ),
      },

      recentProjects,

      recentDocuments,

      recentActivity,
    };
  }
}

export default new DashboardService();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/error.middleware.js";
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import documentRoutes from "./routes/document.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import githubRoutes from "./routes/github.routes.js";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/github", githubRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/document", documentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/interviews", interviewRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Engineer Platform API is running 🚀",
  });
});

app.use(errorHandler);

export default app;
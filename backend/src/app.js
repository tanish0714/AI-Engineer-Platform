import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* -------------------- Security -------------------- */

app.use(helmet());

/* -------------------- CORS -------------------- */

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* -------------------- Rate Limiting -------------------- */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

/* -------------------- Middlewares -------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/v1/auth", authRoutes);



/* -------------------- Health Check -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Engineer Platform API is running 🚀",
  });
});
app.use(errorHandler);
export default app;
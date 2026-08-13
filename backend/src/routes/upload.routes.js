import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";
import { uploadDocument } from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  uploadSingle,
  (req, res, next) => {
    console.log("========== MULTER DEBUG ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("==================================");

    next();
  },
  uploadDocument
);

export default router;
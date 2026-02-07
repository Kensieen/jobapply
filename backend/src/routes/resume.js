import express from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

router.post("/upload", requireAuth, upload.single("resume"), async (req, res) => {
  try {
    const resumePath = req.file.path;
    const result = await query(
      `INSERT INTO resumes (user_id, file_path, file_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET file_path = $2, file_name = $3, updated_at = NOW()
       RETURNING id, file_path, file_name`,
      [req.user.userId, resumePath, req.file.originalname]
    );

    return res.json({ resume: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload resume" });
  }
});

export default router;

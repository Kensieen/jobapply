import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";

const router = express.Router();

router.get("/status", requireAuth, async (req, res) => {
  try {
    const statusResult = await query(
      `SELECT status, COUNT(*) as count
       FROM applications
       WHERE user_id = $1
       GROUP BY status`,
      [req.user.userId]
    );

    const platformResult = await query(
      `SELECT jobs.platform, COUNT(*) as count
       FROM applications
       JOIN jobs ON jobs.id = applications.job_id
       WHERE applications.user_id = $1
       GROUP BY jobs.platform`,
      [req.user.userId]
    );

    const totals = statusResult.rows.reduce(
      (acc, row) => ({ ...acc, [row.status]: Number(row.count) }),
      {}
    );

    return res.json({
      totals,
      platformBreakdown: platformResult.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch application status" });
  }
});

export default router;

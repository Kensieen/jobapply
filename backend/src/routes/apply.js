import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";
import { applyQueue } from "../services/queue.js";

const router = express.Router();

router.post("/start", requireAuth, async (req, res) => {
  const { jobIds } = req.body;
  if (!Array.isArray(jobIds) || jobIds.length === 0) {
    return res.status(400).json({ error: "jobIds required" });
  }

  try {
    const preferencesResult = await query(
      `SELECT daily_apply_limit FROM preferences WHERE user_id = $1`,
      [req.user.userId]
    );
    const dailyLimit = preferencesResult.rows[0]?.daily_apply_limit || 0;

    const appliedTodayResult = await query(
      `SELECT COUNT(*) FROM applications
       WHERE user_id = $1 AND created_at::date = CURRENT_DATE`,
      [req.user.userId]
    );
    const appliedToday = Number(appliedTodayResult.rows[0].count);

    const remaining = dailyLimit ? Math.max(dailyLimit - appliedToday, 0) : jobIds.length;
    const allowedJobIds = jobIds.slice(0, remaining);

    const createdApplications = [];
    for (const jobId of allowedJobIds) {
      const applicationResult = await query(
        `INSERT INTO applications (user_id, job_id, status)
         VALUES ($1, $2, 'queued')
         RETURNING *`,
        [req.user.userId, jobId]
      );

      const application = applicationResult.rows[0];
      createdApplications.push(application);

      await query(
        `INSERT INTO automation_logs (application_id, status, details)
         VALUES ($1, $2, $3)`,
        [application.id, "queued", "Application queued for automation"]
      );

      await applyQueue.add(
        "apply",
        { applicationId: application.id },
        { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
      );
    }

    return res.json({
      applications: createdApplications,
      skipped: jobIds.length - allowedJobIds.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to start auto-apply" });
  }
});

export default router;

import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";
import { matchJobs } from "../services/matcher.js";
import { runScrapers } from "../services/scraper/index.js";

const router = express.Router();

router.get("/matched", requireAuth, async (req, res) => {
  try {
    const preferenceResult = await query(
      `SELECT * FROM preferences WHERE user_id = $1`,
      [req.user.userId]
    );
    const preferences = preferenceResult.rows[0];

    if (!preferences) {
      return res.status(400).json({ error: "Preferences not found" });
    }

    await runScrapers({
      jobTitles: preferences.job_titles,
      locations: preferences.locations,
    });

    const jobResult = await query(
      `SELECT * FROM jobs WHERE date_posted >= NOW() - INTERVAL '7 days'`
    );

    const matchedJobs = matchJobs({ jobs: jobResult.rows, preferences });
    return res.json({ jobs: matchedJobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch matched jobs" });
  }
});

export default router;

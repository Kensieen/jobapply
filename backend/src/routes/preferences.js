import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";

const router = express.Router();

router.post("/save", requireAuth, async (req, res) => {
  const {
    jobTitles,
    yearsExperience,
    salaryMin,
    salaryMax,
    locations,
    workMode,
    companyPreference,
    dailyApplyLimit,
  } = req.body;

  try {
    const result = await query(
      `INSERT INTO preferences (
        user_id,
        job_titles,
        years_experience,
        salary_min,
        salary_max,
        locations,
        work_mode,
        company_preference,
        daily_apply_limit
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id)
      DO UPDATE SET
        job_titles = $2,
        years_experience = $3,
        salary_min = $4,
        salary_max = $5,
        locations = $6,
        work_mode = $7,
        company_preference = $8,
        daily_apply_limit = $9,
        updated_at = NOW()
      RETURNING *`,
      [
        req.user.userId,
        jobTitles,
        yearsExperience,
        salaryMin,
        salaryMax,
        locations,
        workMode,
        companyPreference || null,
        dailyApplyLimit,
      ]
    );

    return res.json({ preferences: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save preferences" });
  }
});

export default router;

import { query } from "../../db.js";
import { LinkedInAdapter } from "./sources/linkedin.js";
import { IndeedAdapter } from "./sources/indeed.js";
import { GlassdoorAdapter } from "./sources/glassdoor.js";
import { randomDelay } from "./utils.js";

const adapters = {
  LinkedIn: new LinkedInAdapter(),
  Indeed: new IndeedAdapter(),
  Glassdoor: new GlassdoorAdapter(),
};

export const runAutoApply = async (applicationId) => {
  const applicationResult = await query(
    `SELECT applications.*, jobs.apply_url, jobs.platform, users.email, resumes.file_path
     FROM applications
     JOIN jobs ON jobs.id = applications.job_id
     JOIN users ON users.id = applications.user_id
     LEFT JOIN resumes ON resumes.user_id = users.id
     WHERE applications.id = $1`,
    [applicationId]
  );

  const application = applicationResult.rows[0];
  if (!application) {
    throw new Error("Application not found");
  }

  const adapter = adapters[application.platform];
  if (!adapter) {
    throw new Error(`No adapter for platform ${application.platform}`);
  }

  await randomDelay(1000, 4000);
  await adapter.apply({
    applyUrl: application.apply_url,
    resumePath: application.file_path,
    applicantEmail: application.email,
  });

  await query(
    `INSERT INTO automation_logs (application_id, status, details)
     VALUES ($1, $2, $3)`,
    [applicationId, "submitted", "Application submitted via automation"]
  );
};

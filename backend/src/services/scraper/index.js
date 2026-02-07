import { query } from "../../db.js";
import { linkedinScraper } from "./linkedin.js";
import { indeedScraper } from "./indeed.js";
import { glassdoorScraper } from "./glassdoor.js";

export const runScrapers = async (filters) => {
  const results = await Promise.all([
    linkedinScraper(filters),
    indeedScraper(filters),
    glassdoorScraper(filters),
  ]);

  const jobs = results.flat();
  for (const job of jobs) {
    await query(
      `INSERT INTO jobs (
        title,
        company_name,
        location,
        salary,
        apply_url,
        platform,
        date_posted
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (apply_url) DO NOTHING`,
      [
        job.title,
        job.companyName,
        job.location,
        job.salary,
        job.applyUrl,
        job.platform,
        job.datePosted,
      ]
    );
  }

  return jobs;
};

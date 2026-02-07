import { Queue, Worker } from "bullmq";
import { runAutoApply } from "./automation/runner.js";
import { query } from "../db.js";

const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
};

export const applyQueue = new Queue("auto-apply", { connection });

export const queueWorker = () => {
  const worker = new Worker(
    "auto-apply",
    async (job) => {
      const { applicationId } = job.data;
      await query(
        `UPDATE applications SET status = 'processing' WHERE id = $1`,
        [applicationId]
      );

      try {
        await runAutoApply(applicationId);
        await query(
          `UPDATE applications SET status = 'submitted', submitted_at = NOW() WHERE id = $1`,
          [applicationId]
        );
      } catch (error) {
        await query(
          `UPDATE applications SET status = 'failed', failure_reason = $2 WHERE id = $1`,
          [applicationId, error.message]
        );
        throw error;
      }
    },
    {
      connection,
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });
};

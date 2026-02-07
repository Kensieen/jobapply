import { chromium } from "playwright";

export class LinkedInAdapter {
  async apply({ applyUrl, resumePath, applicantEmail }) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(applyUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    console.log("LinkedIn automation placeholder", { applicantEmail, resumePath });

    await browser.close();
  }
}

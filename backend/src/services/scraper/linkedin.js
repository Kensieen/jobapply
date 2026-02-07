export const linkedinScraper = async (filters) => {
  return [
    {
      title: filters?.jobTitles?.[0] || "Software Engineer",
      companyName: "LinkedIn Sample Co",
      location: filters?.locations?.[0] || "Remote",
      salary: "$120k-$140k",
      applyUrl: `https://linkedin.com/jobs/view/${Date.now()}`,
      platform: "LinkedIn",
      datePosted: new Date().toISOString(),
    },
  ];
};

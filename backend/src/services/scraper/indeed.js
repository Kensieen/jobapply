export const indeedScraper = async (filters) => {
  return [
    {
      title: filters?.jobTitles?.[0] || "Frontend Engineer",
      companyName: "Indeed Sample Co",
      location: filters?.locations?.[0] || "Hybrid",
      salary: "$110k-$130k",
      applyUrl: `https://indeed.com/viewjob?jk=${Date.now()}`,
      platform: "Indeed",
      datePosted: new Date().toISOString(),
    },
  ];
};

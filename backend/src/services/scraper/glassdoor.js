export const glassdoorScraper = async (filters) => {
  return [
    {
      title: filters?.jobTitles?.[0] || "Full Stack Engineer",
      companyName: "Glassdoor Sample Co",
      location: filters?.locations?.[0] || "Onsite",
      salary: "$100k-$125k",
      applyUrl: `https://glassdoor.com/job/${Date.now()}`,
      platform: "Glassdoor",
      datePosted: new Date().toISOString(),
    },
  ];
};

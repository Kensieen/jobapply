export const matchJobs = ({ jobs, preferences }) => {
  if (!preferences) {
    return [];
  }

  const titleMatches = (title) =>
    preferences.job_titles?.some((pref) =>
      title.toLowerCase().includes(pref.toLowerCase())
    );

  const locationMatches = (location) =>
    preferences.locations?.some((pref) =>
      location.toLowerCase().includes(pref.toLowerCase())
    );

  const companyMatches = (company) =>
    !preferences.company_preference ||
    company.toLowerCase().includes(preferences.company_preference.toLowerCase());

  return jobs.filter((job) => {
    const modeMatch = preferences.work_mode
      ? job.location.toLowerCase().includes(preferences.work_mode.toLowerCase())
      : true;

    return (
      titleMatches(job.title) &&
      locationMatches(job.location) &&
      companyMatches(job.company_name) &&
      modeMatch
    );
  });
};

const companies = [
  { name: 'Google', color: '#4285F4', letter: 'G' },
  { name: 'Microsoft', color: '#00A4EF', letter: 'M' },
  { name: 'Amazon', color: '#FF9900', letter: 'A' },
  { name: 'Apple', color: '#555555', letter: 'A' },
  { name: 'Meta', color: '#0668E1', letter: 'M' },
  { name: 'Netflix', color: '#E50914', letter: 'N' },
  { name: 'Spotify', color: '#1DB954', letter: 'S' },
  { name: 'Uber', color: '#000000', letter: 'U' },
  { name: 'Airbnb', color: '#FF5A5F', letter: 'A' },
  { name: 'Stripe', color: '#635BFF', letter: 'S' },
  { name: 'Shopify', color: '#96BF48', letter: 'S' },
  { name: 'Slack', color: '#4A154B', letter: 'S' },
  { name: 'Adobe', color: '#FF0000', letter: 'A' },
  { name: 'Salesforce', color: '#00A1E0', letter: 'S' },
  { name: 'Twitter', color: '#1DA1F2', letter: 'X' },
  { name: 'LinkedIn', color: '#0A66C2', letter: 'L' },
  { name: 'Snapchat', color: '#FFFC00', letter: 'S' },
  { name: 'Pinterest', color: '#E60023', letter: 'P' },
  { name: 'Oracle', color: '#F80000', letter: 'O' },
  { name: 'IBM', color: '#0530AD', letter: 'I' },
  { name: 'Tesla', color: '#CC0000', letter: 'T' },
  { name: 'Nvidia', color: '#76B900', letter: 'N' },
  { name: 'Atlassian', color: '#0052CC', letter: 'A' },
  { name: 'Figma', color: '#A259FF', letter: 'F' },
  { name: 'Notion', color: '#000000', letter: 'N' },
];

const roles = [
  { title: 'Senior Frontend Developer', tags: ['React', 'TypeScript', 'Next.js'] },
  { title: 'Backend Engineer', tags: ['Node.js', 'Python', 'PostgreSQL'] },
  { title: 'Full Stack Developer', tags: ['React', 'Node.js', 'MongoDB'] },
  { title: 'DevOps Engineer', tags: ['AWS', 'Docker', 'Kubernetes'] },
  { title: 'Machine Learning Engineer', tags: ['Python', 'TensorFlow', 'ML'] },
  { title: 'Product Designer', tags: ['Figma', 'UI/UX', 'Design Systems'] },
  { title: 'Data Scientist', tags: ['Python', 'SQL', 'Analytics'] },
  { title: 'Mobile Developer', tags: ['React Native', 'Swift', 'Kotlin'] },
  { title: 'Cloud Architect', tags: ['AWS', 'Azure', 'GCP'] },
  { title: 'QA Engineer', tags: ['Testing', 'Cypress', 'Selenium'] },
  { title: 'Security Engineer', tags: ['Cybersecurity', 'Pentesting', 'SOC'] },
  { title: 'Site Reliability Engineer', tags: ['Linux', 'Monitoring', 'CI/CD'] },
  { title: 'iOS Developer', tags: ['Swift', 'UIKit', 'SwiftUI'] },
  { title: 'Android Developer', tags: ['Kotlin', 'Jetpack', 'MVVM'] },
  { title: 'Technical Writer', tags: ['Documentation', 'API Docs', 'Markdown'] },
  { title: 'Solutions Architect', tags: ['Enterprise', 'Cloud', 'Integration'] },
  { title: 'Data Engineer', tags: ['Spark', 'Airflow', 'ETL'] },
  { title: 'AI Research Scientist', tags: ['Deep Learning', 'NLP', 'Research'] },
  { title: 'Scrum Master', tags: ['Agile', 'Scrum', 'Team Leadership'] },
  { title: 'Engineering Manager', tags: ['Leadership', 'Agile', 'Strategy'] },
];

const locations = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX',
  'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO',
  'Portland, OR', 'Miami, FL', 'Atlanta, GA', 'Dallas, TX',
  'Remote', 'London, UK', 'Berlin, Germany', 'Toronto, Canada',
];

const experienceLevels = ['Fresher', '1-2 years', '2-4 years', '4-6 years', '6-8 years', '8+ years'];
const salaryRanges = ['3-5 LPA', '5-8 LPA', '8-12 LPA', '12-18 LPA', '18-25 LPA', '25-40 LPA', '40+ LPA'];

function generateJobs(count = 60) {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    const company = companies[i % companies.length];
    const role = roles[i % roles.length];
    const location = locations[i % locations.length];
    const experience = experienceLevels[i % experienceLevels.length];
    const salary = salaryRanges[i % salaryRanges.length];
    const isRemote = location === 'Remote' || Math.random() > 0.6;
    const posted = Math.floor(Math.random() * 14) + 1;

    jobs.push({
      id: `job-${i + 1}`,
      company: company.name,
      companyColor: company.color,
      companyLetter: company.letter,
      title: role.title,
      tags: role.tags,
      location,
      isRemote,
      experience,
      salary,
      posted,
      applicants: Math.floor(Math.random() * 200) + 10,
    });
  }
  return jobs;
}

export const allJobs = generateJobs(60);
export const allLocations = [...new Set(locations)];
export const allCompanies = companies.map(c => c.name);
export { experienceLevels, salaryRanges };

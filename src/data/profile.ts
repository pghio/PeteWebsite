export const PROFILE = {
  name: 'Pete Ghiorse',
  role: 'Group Product Manager, AI/ML',
  employer: 'Capital One',
  headline: 'AI/ML product leader, founder & hands-on builder',
  oneLine: 'I build AI products, test how they behave with real users and mutable data, and publish what the failures teach.',
  recruiterFocus: 'I’m open to conversations about Group or senior product roles in AI agents, model behavior and evaluation, production ML platforms, and consumer AI.',
  practiceLoop: ['Build', 'Instrument', 'Evaluate', 'Publish', 'Revise'],
  focusAreas: [
    {
      title: 'AI product leadership',
      description: 'Strategy, roadmaps, decision boundaries, governance, and cross-functional execution for products that depend on uncertain model behavior.',
    },
    {
      title: 'Agent evaluation & safety',
      description: 'Act/ask/confirm policy, destructive-action guard cases, messy-input robustness, and production-shaped evaluation design.',
    },
    {
      title: 'Multimodal systems',
      description: 'Voice, text, images, tool orchestration, and the product decisions that make an agent useful outside a demo.',
    },
    {
      title: 'Evidence-backed communication',
      description: 'Methods, limitations, negative results, corrections, and visual explanation that let readers inspect the reasoning.',
    },
  ],
  links: {
    website: 'https://peterghiorse.com',
    linkedin: 'https://linkedin.com/in/peteghiorse',
    github: 'https://github.com/pghio',
    substack: 'https://peterghiorse.substack.com',
    honeydew: 'https://gethoneydew.app',
    email: 'mailto:pmghiorse@gmail.com',
  },
  inboundWebsiteLinks: {
    linkedinProfile: 'https://peterghiorse.com/?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=profile_website',
    linkedinFeaturedResume: 'https://peterghiorse.com/resume?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=featured_resume',
    substackProfile: 'https://peterghiorse.com/?utm_source=substack&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=profile_website',
    githubReadme: 'https://peterghiorse.com/?utm_source=github&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=readme_badge',
  },
} as const;

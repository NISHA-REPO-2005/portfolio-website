/* =========================================================
   data.js — Content Data Layer (Interview-Safe & Honest)
   ========================================================= */

const STORAGE_KEY = 'portfolio_site_data';

const DEFAULT_SITE_DATA = {
  profile: {
    name: 'Nisha Yadav',
    firstName: 'Nisha',
    headline: 'B.Tech CSE Student · Aspiring Web Developer',
    email: 'ny26.05.2005@gmail.com',
    portraitAlt: 'Nisha Yadav — B.Tech CSE Student',
    portraitSrc: 'assets/images/portrait.jpg',
    badge: 'NY',
  },
  hero: {
    eyebrow: 'B.Tech CSE Student · Web Developer',
    titleLine1: 'PORTFOLIO.',
    subtitle:
      'I am Nisha Yadav, a Computer Science and Engineering student at Techno Main Salt Lake, passionate about core programming fundamentals and building clean, reliable software.',
  },

  about: {
    label: 'About Me',
    headlineHTML:
      'I am a <em class="accent">CSE student</em><br>learning, building,<br>and growing.',
    text1:
      'I am a 3rd-year B.Tech Computer Science and Engineering student at Techno Main Salt Lake. I focus on translating my academic coursework into practical coding skills.',
    text2:
      'My technical foundation includes C, Python, Java, HTML, CSS, and basic JavaScript. I am currently strengthening my knowledge of Data Structures, Algorithms, Operating Systems, and Software Engineering principles to prepare for a career in software development.',
  },

  metrics: [],

  projects: [
    {
      id: 'proj-1',
      number: '01',
      name: 'Personal Portfolio Website',
      description:
        'A responsive frontend portfolio designed to showcase my academic background and projects. Built from scratch using Vanilla JavaScript and modern CSS.',
      tags: ['Frontend', 'Web Design'],
      techStack: ['HTML', 'CSS', 'JavaScript'],
      year: '2026',
      image: 'assets/images/project-aurelia.jpg',
      link: 'https://github.com/NISHA-REPO-2005/portfolio-website',
    },
    {
      id: 'proj-2',
      number: '02',
      name: 'STOCKIFY (In Progress)',
      description:
        'An ongoing Java desktop application development project demonstrating core object-oriented programming concepts and local database connectivity.',
      tags: ['Desktop App', 'Java', 'In Progress'],
      techStack: ['Java', 'JDBC'],
      year: '2026',
      image: 'assets/images/project-stockify.jpg',
      link: 'https://github.com/NISHA-REPO-2005',
    },
{
      id: 'proj-3',
      number: '03',
      name: 'Edge-AI Border Surveillance',
      description:
        'Participated as a team member in Hackathon 2026 for an edge-AI computer vision tracking system. Led and crafted the presentation deck and pitch materials.',
      tags: ['AI/ML', 'Hackathon 2026', 'Team Project'],
      techStack: ['Python', 'YOLOv8', 'OpenCV'],
      year: '2026',
      image: 'assets/images/project-ai.jpg',
      link: '#',
    }
  ],

  services: [
    {
      number: '01',
      heading: 'Web Development Basics',
      icon: 'code',
      text: 'Creating structural, styled, and interactive web pages.',
      bullets: [
        'Semantic HTML5',
        'CSS layout techniques',
        'Vanilla JavaScript DOM manipulation',
      ],
      skills: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      number: '02',
      heading: 'Core Programming',
      icon: 'brain',
      text: 'Writing clean, logical code based on university curriculum.',
      bullets: [
        'C programming fundamentals',
        'Java object-oriented concepts',
        'Basic Python scripting',
      ],
      skills: ['C', 'Java', 'Python'],
    },
    {
      number: '03',
      heading: 'CS Fundamentals',
      icon: 'code',
      text: 'Applying theoretical computer science concepts to problem-solving.',
      bullets: [
        'Basic Data Structures & Algorithms',
        'Operating Systems concepts',
        'Software Engineering models (DFDs, COCOMO)',
      ],
      skills: ['DSA', 'OS', 'Software Engineering'],
    },
  ],

  testimonials: [],

  socials: [
    {
      name: 'GitHub',
      url: 'https://github.com/NISHA-REPO-2005',
    },
  ],

  footer: {
    copyright: '© 2026 Nisha Yadav. Built with passion.',
  },

  seo: {
    title: 'Nisha Yadav — B.Tech CSE Student',
    description: 'Portfolio of Nisha Yadav, a B.Tech CSE student at Techno Main Salt Lake.',
  },
};

/* ── Storage helpers ── */
function getSiteData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (
        parsed.profile?.email === 'YOUR_EMAIL@gmail.com' ||
        parsed.profile?.name === 'Alex Ramirez' ||
        (Array.isArray(parsed.metrics) &&
          parsed.metrics.some((m) => m.count === 50))
      ) {
        localStorage.removeItem(STORAGE_KEY);
        return structuredClone(DEFAULT_SITE_DATA);
      }
      return deepMerge(structuredClone(DEFAULT_SITE_DATA), parsed);
    }
  } catch (e) {
    console.warn('Failed to load site data:', e);
  }
  return structuredClone(DEFAULT_SITE_DATA);
}

function saveSiteData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save site data:', e);
    return false;
  }
}

function resetSiteData() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_SITE_DATA);
}

function hasCustomData() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function generateId() {
  return 'proj-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

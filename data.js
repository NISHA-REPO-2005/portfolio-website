/* =========================================================
   data.js — Content Data Layer
   Manages site content with localStorage persistence.
   Used by both the main site and the admin CMS dashboard.
   ========================================================= */

const STORAGE_KEY = 'portfolio_site_data';

const DEFAULT_SITE_DATA = {
 profile: {
  name: 'Nisha Yadav',
  firstName: 'Nisha',
  headline: 'B.Tech CSE Student & Web Developer',
  email: 'YOUR_EMAIL@gmail.com',
  portraitAlt: 'Nisha Yadav — B.Tech CSE Student',
  portraitSrc: 'assets/images/portrait.jpg',
  badge: 'NY',
},
 hero: {
  eyebrow: 'B.Tech CSE Student · Web Developer',
  titleLine1: 'PORTFOLIO.',
  subtitle:
    'I am Nisha Yadav, a Computer Science Engineering student passionate about web development, programming, and building useful digital experiences.',
},

  about: {
  label: 'About Me',
  headlineHTML:
    'I am a <em class="accent">CSE student</em><br>learning, building,<br>and growing.',
  text1:
    "I am a 3rd-year B.Tech Computer Science and Engineering student at Calcutta Institute of Engineering and Management. I enjoy learning programming and web development and turning what I learn into practical projects.",
  text2:
    'My current skills include C, Python, Java, HTML, CSS, and basic DSA. I am particularly interested in growing as a Web Developer and building meaningful projects.',
},


  metrics: [
    { count: 50, suffix: '+', label: 'Projects Delivered' },
    { count: 5, suffix: '+', label: 'Years Experience' },
    { count: 30, suffix: '+', label: 'Happy Clients' },
  ],

 projects: [
  {
    id: 'proj-1',
    number: '01',
    name: 'Personal Portfolio Website',
    description:
      'A responsive personal portfolio website showcasing my education, skills, learning journey, and projects as a Computer Science Engineering student.',
    tags: ['Web Development', 'Portfolio', 'Frontend'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    year: '2026',
    image: 'assets/images/project-aurelia.jpg',
    link: '#',
  },
],

 services: [
  {
    number: '01',
    heading: 'Web Development',
    icon: 'code',
    text: 'Learning to build responsive and user-friendly websites using modern frontend technologies.',
    bullets: [
      'HTML & semantic web structure',
      'CSS styling and layouts',
      'JavaScript fundamentals',
      'Responsive web design',
    ],
    skills: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    number: '02',
    heading: 'Programming',
    icon: 'brain',
    text: 'Building a strong programming foundation through hands-on practice and problem solving.',
    bullets: [
      'C programming',
      'Python programming',
      'Java fundamentals',
      'Problem solving',
    ],
    skills: ['C', 'Python', 'Java'],
  },
  {
    number: '03',
    heading: 'Data Structures',
    icon: 'code',
    text: 'Learning and practicing fundamental data structures and algorithms.',
    bullets: [
      'Arrays',
      'Basic data structures',
      'Algorithm fundamentals',
      'Problem solving',
    ],
    skills: ['DSA', 'Problem Solving'],
  },
],

testimonials: [],

socials: [
  {
    name: 'GitHub',
    url: 'https://github.com/NISHA-REPO-2005',
  },
  {
    name: 'LeetCode',
    url: '#',
  },
],

  footer: {
    copyright: '© 2026 Nisha Yadav. Built with passion.',
  },

 seo: {
  title: 'Nisha Yadav — B.Tech CSE Student & Web Developer',
  description:
    'Portfolio of Nisha Yadav, a B.Tech Computer Science and Engineering student interested in web development, programming, and building practical projects.',
},
};

/* ── Storage helpers ── */

function getSiteData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Deep merge with defaults to ensure new fields are always present
      return deepMerge(structuredClone(DEFAULT_SITE_DATA), parsed);
    }
  } catch (e) {
    console.warn('Failed to load site data from storage:', e);
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

/* ── Deep merge utility ── */
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

/* ── Generate unique ID ── */
function generateId() {
  return 'proj-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

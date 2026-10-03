/* =========================================================
   app.js — Vanilla JS Single Page Application (SPA)
   Architecture:
   - Consolidated Single Page Entry Point
   - Vanilla JS Router (HTML5 History API: pushState & popstate)
   - Dynamic View Injection (#app-root)
   - Cinematic GSAP Route Transitions (Fade & Downward Motion)
   - Unified State Management & Real-Time LocalStorage Sync
   - Custom Magnetic Cursor & Luxury Dark Mahogany & Blush Aesthetic
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. CONSTANTS, UTILITIES & HELPERS
     ========================================================= */
  const raf = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn(...args);
          ticking = false;
        });
      }
    };
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* =========================================================
     2. SVG ICONS REPOSITORY
     ========================================================= */
  const serviceIcons = {
    code: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    brain: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.1-.5 2.1-1.3 2.8l-.7.6V12h-4V9.4l-.7-.6A4 4 0 0 1 12 2z"></path><path d="M8 12h8v3a4 4 0 0 1-8 0v-3z"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>`,
    palette: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="8" r="1.5" fill="currentColor"></circle><circle cx="8.5" cy="13" r="1.5" fill="currentColor"></circle><circle cx="15.5" cy="13" r="1.5" fill="currentColor"></circle><circle cx="12" cy="17" r="1.5" fill="currentColor"></circle></svg>`,
    cloud: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  };

  /* =========================================================
     3. VIEW TEMPLATES: PORTFOLIO & ADMIN
     ========================================================= */

  /**
   * Generates the Luxury Editorial Portfolio HTML structure
   */
  function getPortfolioHTML() {
    return `
    <!-- ═══════════ NAVIGATION (Hairline Editorial Bar) ═══════════ -->
    <nav class="nav" id="nav">
      <a href="#" class="nav-logo" id="nav-logo" data-hover>
        <span class="nav-badge" id="nav-badge">AR</span>
      </a>
      <ul class="nav-links">
        <li><a href="#about" class="nav-link" data-hover>Manifesto</a></li>
        <li><a href="#works" class="nav-link" data-hover>Creations</a></li>
        <li><a href="#services" class="nav-link" data-hover>Capabilities</a></li>
        <li><a href="#process" class="nav-link" data-hover>Process</a></li>
        <li><a href="#testimonials" class="nav-link" data-hover>Testimonials</a></li>
      </ul>
      <div class="nav-actions">
        <a href="/admin" class="nav-cms-link" data-route="/admin" data-hover title="Open CMS Control Panel">CMS Studio</a>
        <button class="nav-toggle" id="nav-toggle" data-hover aria-label="Toggle navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <!-- ═══════════ MOBILE MENU ═══════════ -->
    <div class="nav-mobile" id="nav-mobile">
      <a href="#about" class="nav-mobile-link" data-hover>Manifesto</a>
      <a href="#works" class="nav-mobile-link" data-hover>Creations</a>
      <a href="#services" class="nav-mobile-link" data-hover>Capabilities</a>
      <a href="#process" class="nav-mobile-link" data-hover>Process</a>
      <a href="#testimonials" class="nav-mobile-link" data-hover>Testimonials</a>
      <a href="#contact" class="nav-mobile-link" data-hover>Inquire</a>
      <a href="/admin" class="nav-mobile-link" data-route="/admin" data-hover style="color:var(--clr-script-dark); font-weight:500;">CMS Studio ⟶</a>
    </div>

    <!-- ═══════════ HERO (Massive Typographic Masthead) ═══════════ -->
    <section class="hero section" id="hero">
      <div class="container">
        <!-- Issue Masthead Strip -->
        <div class="hero-masthead-strip reveal-fade">
          <span>Edition No. XXIV</span>
          <span class="strip-center">Design that Tells Your Story</span>
          <span>Autumn / Winter Portfolio</span>
        </div>

        <!-- Ultra-Massive Full-Width Typographic Headline -->
        <div class="hero-title-container">
          <h1 class="hero-title">
            <span class="line"><span class="line-inner" id="hero-line1">PORTFOLIO</span></span>
          </h1>
        </div>

        <!-- Spread Details & Portrait -->
        <div class="hero-grid">
          <div class="hero-text-col">
            <p class="hero-eyebrow reveal-fade" id="hero-eyebrow">Full Stack Developer · AI Engineer</p>
            <p class="hero-subtitle reveal" id="hero-subtitle">
              Crafting premium digital experiences powered by modern technology 
              and intelligent design — where every pixel is intentional.
            </p>
            <div class="hero-cta reveal">
              <a href="#works" class="editorial-link" data-hover>
                <span>Explore Selected Works</span>
                <span class="arrow">⟶</span>
              </a>
              <a href="#contact" class="editorial-link" data-hover>
                <span>Inquire For Commissions</span>
                <span class="arrow">⟶</span>
              </a>
            </div>
          </div>

          <div class="hero-portrait-col reveal-right">
            <div class="hero-portrait-wrapper">
              <img src="assets/images/portrait.jpg" 
                   alt="Alex Ramirez — Full Stack Developer" 
                   class="hero-portrait" 
                   id="hero-portrait"
                   width="600" height="800"
                   fetchpriority="high">
              <div class="hero-portrait-caption">
                <span>Figure 01 / Studio Portrait</span>
                <span>Obsession & Craft</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-scroll-indicator reveal-fade">
        <span>Scroll</span>
        <div class="hero-scroll-line"></div>
      </div>
    </section>

    <!-- ═══════════ METRICS BAR (Hairline Magazine Columns) ═══════════ -->
    <section class="metrics-bar" id="metrics-bar">
      <div class="container">
        <div class="metrics-grid" id="metrics-grid"></div>
      </div>
    </section>

    <!-- ═══════════ ABOUT / MANIFESTO ═══════════ -->
    <section class="about section" id="about">
      <div class="container">
        <div class="about-grid">
          <div class="about-image-wrapper reveal-left">
            <img src="assets/images/portrait.jpg"
                 alt="Alex Ramirez — Full Stack Developer"
                 class="about-image"
                 id="parallax-image"
                 loading="lazy"
                 width="600" height="520">
          </div>
          <div class="about-content">
            <span class="section-label reveal" id="about-label">The Manifesto</span>
            <h2 class="about-headline reveal" id="about-headline">
              I build software<br>that <em class="accent">thinks, adapts,</em><br>and delivers.
            </h2>
            <p class="about-text reveal" id="about-text1"></p>
            <p class="about-text reveal" id="about-text2"></p>
            <div class="reveal" style="margin-top: 0.5rem;">
              <a href="#contact" class="editorial-link" data-hover>
                <span>Read Architectural Philosophy</span>
                <span class="arrow">⟶</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ SELECTED WORKS ═══════════ -->
    <section class="works section" id="works">
      <div class="container">
        <div class="works-header">
          <div>
            <span class="section-label reveal">Selected Archives</span>
            <h2 class="works-title reveal">Curated Creations</h2>
          </div>
          <span class="script-accent reveal" style="font-size:1.6rem; color:var(--clr-script-dark);">Excellence in Execution</span>
        </div>
        <div class="works-grid" id="works-grid"></div>
      </div>
    </section>

    <!-- ═══════════ STANDOUT LIGHT CONTRAST PANEL: "WHAT I DO" ═══════════ -->
    <section class="services section luxury-light-panel" id="services">
      <div class="container">
        <div class="services-header">
          <div>
            <span class="section-label reveal">What I Do</span>
            <h2 class="services-title reveal">Capabilities &amp; Craft</h2>
          </div>
          <span class="script-accent reveal">Bespoke Engineering Solutions</span>
        </div>
        <div class="services-grid" id="services-grid"></div>
      </div>
    </section>

    <!-- ═══════════ PROCESS TIMELINE ═══════════ -->
    <section class="process section" id="process">
      <div class="container">
        <div class="process-header">
          <div>
            <span class="section-label reveal">Methodology</span>
            <h2 class="process-title reveal">The Four Stages</h2>
          </div>
          <span class="script-accent reveal" style="font-size:1.6rem; color:var(--clr-script-dark);">From Vision to Reality</span>
        </div>
        <div class="process-timeline" id="process-timeline">
          <div class="process-step reveal" data-step="01">
            <div class="process-step-number">01</div>
            <div class="process-step-content">
              <h3 class="process-step-title">Discovery &amp; Strategy</h3>
              <p class="process-step-text">Deep-dive into your vision, audience, and goals. I map out the full scope, define success metrics, and build a strategy that aligns design with business outcomes.</p>
            </div>
          </div>
          <div class="process-step reveal" data-step="02">
            <div class="process-step-number">02</div>
            <div class="process-step-content">
              <h3 class="process-step-title">Design &amp; Prototype</h3>
              <p class="process-step-text">High-fidelity wireframes and interactive prototypes. Every layout, color, and micro-interaction is crafted for clarity, hierarchy, and emotional resonance.</p>
            </div>
          </div>
          <div class="process-step reveal" data-step="03">
            <div class="process-step-number">03</div>
            <div class="process-step-content">
              <h3 class="process-step-title">Development &amp; Integration</h3>
              <p class="process-step-text">Clean, performant code with modern frameworks. I integrate APIs, databases, and AI — building systems that are fast, scalable, and maintainable.</p>
            </div>
          </div>
          <div class="process-step reveal" data-step="04">
            <div class="process-step-number">04</div>
            <div class="process-step-content">
              <h3 class="process-step-title">Launch &amp; Optimize</h3>
              <p class="process-step-text">Rigorous testing, performance tuning, and deployment. Post-launch analytics and iterative improvements ensure the product evolves with your users.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ TESTIMONIALS / KIND WORDS ═══════════ -->
    <section class="testimonials section" id="testimonials">
      <div class="container">
        <div class="testimonials-header">
          <div>
            <span class="section-label reveal">Endorsements</span>
            <h2 class="testimonials-title reveal">Kind Words</h2>
          </div>
          <span class="script-accent reveal" style="font-size:1.6rem; color:var(--clr-script-dark);">Trusted by Visionaries</span>
        </div>
        <div class="testimonials-grid" id="testimonials-grid"></div>
      </div>
    </section>

    <!-- ═══════════ CTA BAR / FOOTER ═══════════ -->
    <footer class="footer section" id="contact">
      <div class="container">
        <!-- Interactive Luxury Oxblood CTA Bar -->
        <div class="cta-bar reveal" id="cta-bar">
          <div class="cta-bar-content">
            <span class="script-accent" style="font-size:1.6rem; color:var(--clr-blush); display:block; margin-bottom:0.25rem;">Let's build something unforgettable.</span>
            <h2 class="cta-bar-title">Initiate a Commission</h2>
            <p class="cta-bar-subtitle">Have an ambitious project in mind? Let's engineer something remarkable together.</p>
          </div>
          <a href="mailto:alex@alexramirez.dev" class="editorial-link" id="magnetic-btn" data-hover style="font-size:0.9rem; padding: 1rem 0;">
            <span>Get In Touch</span>
            <span class="arrow" style="font-size:1.2rem;">⟶</span>
          </a>
        </div>

        <!-- Contact Form -->
        <div class="footer-form-wrapper reveal">
          <form class="footer-form" id="contact-form">
            <div class="form-group">
              <input type="text" class="form-input" id="form-name" placeholder="Your Full Name" required data-hover>
            </div>
            <div class="form-group">
              <input type="email" class="form-input" id="form-email" placeholder="Your Email Address" required data-hover>
            </div>
            <div class="form-group">
              <textarea class="form-textarea" id="form-message" placeholder="Tell me about your project vision..." rows="3" data-hover></textarea>
            </div>
            <button type="submit" class="editorial-link form-submit" data-hover>
              <span>Send Transmission</span>
              <span class="arrow">⟶</span>
            </button>
          </form>
        </div>

        <div class="footer-bottom reveal">
          <p class="footer-copyright" id="footer-copyright">© 2024 Alex Ramirez. Engineered with obsession.</p>
          <div class="footer-socials" id="footer-socials"></div>
          <a href="/admin" class="social-link admin-link" data-route="/admin" data-hover style="opacity:0.4; font-size:0.68rem; letter-spacing:0.1em;">CMS STUDIO</a>
        </div>
      </div>
    </footer>
    `;
  }

  /**
   * Generates the CMS Control Panel HTML structure
   */
  function getAdminHTML() {
    return `
    <div class="admin-layout">
      <!-- ═══════════ SIDEBAR ═══════════ -->
      <div class="sidebar-overlay" id="sidebar-overlay"></div>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            Portfolio<span class="dot">.</span>
            <span class="sidebar-badge">CMS</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="sidebar-section-label">Overview</div>
          <button class="sidebar-link is-active" data-section="dashboard">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            Dashboard
          </button>

          <div class="sidebar-section-label">Core Content</div>
          <button class="sidebar-link" data-section="profile">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Personal Info
          </button>
          <button class="sidebar-link" data-section="metrics">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Metrics & Numbers
          </button>
          <button class="sidebar-link" data-section="projects">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            Project Manager
          </button>
          <button class="sidebar-link" data-section="services">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Services
          </button>

          <div class="sidebar-section-label">Configuration</div>
          <button class="sidebar-link" data-section="socials">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Socials & Footer
          </button>
          <button class="sidebar-link" data-section="seo">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            SEO Settings
          </button>
        </nav>

        <div class="sidebar-footer">
          <a href="/" class="sidebar-footer-link" data-route="/" title="Return to Live Portfolio">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>View Live Site</span>
          </a>
        </div>
      </aside>

      <!-- ═══════════ MAIN CONTENT ═══════════ -->
      <main class="admin-main">
        <!-- Topbar -->
        <header class="admin-topbar">
          <div class="topbar-left">
            <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle navigation menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div class="topbar-meta">
              <span class="topbar-crumb">CMS Studio</span>
              <span class="topbar-divider">/</span>
              <span class="topbar-title" id="topbar-title">Dashboard</span>
            </div>
            <div class="status-indicator" id="sync-status">
              <span class="status-dot"></span>
              <span class="status-text">All changes synced</span>
            </div>
          </div>

          <div class="topbar-actions">
            <button class="btn btn-ghost" id="btn-reset" title="Revert to original defaults">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              <span>Reset</span>
            </button>
            <a href="/" class="btn btn-ghost" data-route="/" title="Return to Live Portfolio">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Live Site</span>
            </a>
            <button class="btn btn-primary" id="btn-save-all">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>Save Changes</span>
              <span class="btn-kbd">Ctrl+S</span>
            </button>
          </div>
        </header>

        <div class="admin-content">
          <!-- ═══════ DASHBOARD OVERVIEW ═══════ -->
          <div class="admin-section is-active" id="sec-dashboard">
            <div class="section-banner">
              <div class="banner-content">
                <span class="banner-badge">Light Studio CMS</span>
                <h1 class="banner-title">Welcome to your Portfolio CMS</h1>
                <p class="banner-text">
                  Manage your personal profile, showcase projects, metrics, and services.
                  Edits save immediately to browser storage and sync in real-time with zero page reload.
                </p>
              </div>
              <div class="banner-actions">
                <button class="btn btn-white" data-goto="profile">Edit Profile</button>
                <button class="btn btn-outline-white" data-goto="projects">Manage Projects</button>
              </div>
            </div>

            <div class="dashboard-grid">
              <div class="dash-card" data-goto="projects">
                <div class="dash-card-header">
                  <span class="dash-card-icon blue">💼</span>
                  <span class="dash-badge">Showcase</span>
                </div>
                <div class="dash-card-number" id="dash-projects">0</div>
                <div class="dash-card-label">Active Projects</div>
                <p class="dash-card-sub">Click to add, edit or reorder projects</p>
              </div>

              <div class="dash-card" data-goto="metrics">
                <div class="dash-card-header">
                  <span class="dash-card-icon gold">📈</span>
                  <span class="dash-badge">Statistics</span>
                </div>
                <div class="dash-card-number" id="dash-metrics">3</div>
                <div class="dash-card-label">Key Metrics</div>
                <p class="dash-card-sub">Projects count, years experience, clients</p>
              </div>

              <div class="dash-card" data-goto="services">
                <div class="dash-card-header">
                  <span class="dash-card-icon green">⚡</span>
                  <span class="dash-badge">Capabilities</span>
                </div>
                <div class="dash-card-number" id="dash-services">4</div>
                <div class="dash-card-label">Services Offered</div>
                <p class="dash-card-sub">Full Stack, AI integration, UI/UX, DevOps</p>
              </div>

              <div class="dash-card" data-goto="profile">
                <div class="dash-card-header">
                  <span class="dash-card-icon purple">✨</span>
                  <span class="dash-badge status-live">Live</span>
                </div>
                <div class="dash-card-number" id="dash-owner">Alex</div>
                <div class="dash-card-label">Active Profile</div>
                <p class="dash-card-sub">Synced with localStorage</p>
              </div>
            </div>

            <div class="quick-tips-card">
              <div class="quick-tips-header">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <h3>SPA Synchronization Architecture</h3>
              </div>
              <p>
                1. <strong>Edit Any Section:</strong> Update your name, role, metrics, or add new projects with rich descriptions.<br>
                2. <strong>Save Changes:</strong> Press <code>Ctrl + S</code> or click <strong>Save Changes</strong> at the top right.<br>
                3. <strong>Seamless Zero Reload:</strong> Click <strong>Live Site</strong> — your portfolio transitions instantaneously with the updated data!
              </p>
            </div>
          </div>

          <!-- ═══════ PERSONAL INFO ═══════ -->
          <div class="admin-section" id="sec-profile">
            <div class="section-header">
              <div>
                <h1 class="section-title">Personal Info & Identity</h1>
                <p class="section-subtitle">Update your name, role, bio headline, and about summary</p>
              </div>
              <button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button>
            </div>

            <div class="card">
              <div class="card-header">
                <div>
                  <h2 class="card-title">Identity & Role</h2>
                  <p class="card-subtitle">Primary branding across the portfolio</p>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-row">
                  <label class="form-label" for="f-name">Full Name <span class="required">*</span></label>
                  <input type="text" class="input" id="f-name" placeholder="e.g. Alex Ramirez">
                  <span class="form-hint">Used in headers, preloader, and SEO</span>
                </div>
                <div class="form-row">
                  <label class="form-label" for="f-role">Role / Professional Headline <span class="required">*</span></label>
                  <input type="text" class="input" id="f-role" placeholder="e.g. Full Stack Developer · AI Engineer">
                  <span class="form-hint">Displayed prominently in the hero eyebrow</span>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-row">
                  <label class="form-label" for="f-email">Contact Email</label>
                  <input type="email" class="input" id="f-email" placeholder="e.g. alex@alexramirez.dev">
                  <span class="form-hint">Linked directly to the magnetic "Get In Touch" button</span>
                </div>
                <div class="form-row">
                  <label class="form-label" for="f-badge">Navbar Monogram / Badge</label>
                  <input type="text" class="input" id="f-badge" placeholder="e.g. AR" maxlength="3">
                  <span class="form-hint">2-3 characters displayed in the top navbar circle</span>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-row">
                  <label class="form-label" for="f-hero-title">Hero Oversized Title</label>
                  <input type="text" class="input" id="f-hero-title" placeholder="PORTFOLIO.">
                  <span class="form-hint">The massive signature serif headline</span>
                </div>
                <div class="form-row">
                  <label class="form-label" for="f-hero-subtitle">Hero Subtitle Introduction</label>
                  <textarea class="textarea" id="f-hero-subtitle" rows="2" placeholder="Crafting premium digital experiences..."></textarea>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div>
                  <h2 class="card-title">About Me & Manifesto</h2>
                  <p class="card-subtitle">Your story, philosophy, and personal statement</p>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label" for="f-about-headline">About Headline (HTML allowed)</label>
                <textarea class="textarea" id="f-about-headline" rows="2" placeholder='I build software<br>that <em class="accent">thinks, adapts,</em><br>and delivers.'></textarea>
                <span class="form-hint">Use <code>&lt;br&gt;</code> for line breaks. Wrap accent words in <code>&lt;em class="accent"&gt;...&lt;/em&gt;</code></span>
              </div>

              <div class="form-row">
                <label class="form-label" for="f-about-text1">About Me Summary (Paragraph 1)</label>
                <textarea class="textarea" id="f-about-text1" rows="3" placeholder="Tell visitors about your background, expertise, and what drives you..."></textarea>
              </div>

              <div class="form-row">
                <label class="form-label" for="f-about-text2">Philosophy & Mission (Paragraph 2)</label>
                <textarea class="textarea" id="f-about-text2" rows="3" placeholder="Describe your engineering philosophy, design standards, and vision..."></textarea>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div>
                  <h2 class="card-title">Portrait Photo</h2>
                  <p class="card-subtitle">Displayed in the Hero section and About Me grid</p>
                </div>
              </div>

              <div class="image-upload-wrapper">
                <div class="portrait-preview-box">
                  <img id="portrait-preview" src="assets/images/portrait.jpg" alt="Portrait preview">
                </div>
                <div class="portrait-controls">
                  <div class="form-row">
                    <label class="form-label" for="f-portrait-src">Image Path / URL</label>
                    <input type="text" class="input" id="f-portrait-src" placeholder="assets/images/portrait.jpg">
                  </div>
                  <div class="upload-action-row">
                    <label class="btn btn-outline" for="f-portrait-file">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Upload New Photo</span>
                    </label>
                    <input type="file" id="f-portrait-file" accept="image/*" hidden>
                    <span class="form-hint">Supports PNG, JPG, WebP. Automatically stored locally.</span>
                  </div>
                  <div class="form-row" style="margin-top:0.75rem;">
                    <label class="form-label" for="f-portrait-alt">Image Alt Description</label>
                    <input type="text" class="input" id="f-portrait-alt" placeholder="e.g. Alex Ramirez — Full Stack Developer">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══════ METRICS & NUMBERS ═══════ -->
          <div class="admin-section" id="sec-metrics">
            <div class="section-header">
              <div>
                <h1 class="section-title">Metrics & Statistics</h1>
                <p class="section-subtitle">Live numbers showcased on the animated counter bar</p>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-outline btn-sm" id="btn-add-metric">+ Add Metric</button>
                <button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button>
              </div>
            </div>
            <div class="metrics-cards-grid" id="metrics-editor-container"></div>
          </div>

          <!-- ═══════ PROJECT MANAGER ═══════ -->
          <div class="admin-section" id="sec-projects">
            <div class="section-header">
              <div>
                <h1 class="section-title">Project Manager</h1>
                <p class="section-subtitle">Manage your portfolio showcase items, tech stacks, and descriptions</p>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-primary btn-sm" id="btn-add-project-top">+ Add New Project</button>
                <button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button>
              </div>
            </div>
            <div class="projects-list-container" id="projects-editor-container"></div>
            <div class="list-footer-action">
              <button class="btn btn-primary btn-lg" id="btn-add-project">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Add New Project</span>
              </button>
            </div>
          </div>

          <!-- ═══════ SERVICES ═══════ -->
          <div class="admin-section" id="sec-services">
            <div class="section-header">
              <div>
                <h1 class="section-title">Services & Capabilities</h1>
                <p class="section-subtitle">Manage the offerings displayed on your interactive services grid</p>
              </div>
              <button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button>
            </div>
            <div class="services-list-container" id="services-editor-container"></div>
          </div>

          <!-- ═══════ SOCIALS & FOOTER ═══════ -->
          <div class="admin-section" id="sec-socials">
            <div class="section-header">
              <div>
                <h1 class="section-title">Social Links & Footer</h1>
                <p class="section-subtitle">External links and copyright text</p>
              </div>
              <button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button>
            </div>

            <div class="card">
              <div class="card-header">
                <div>
                  <h2 class="card-title">Social Profiles</h2>
                  <p class="card-subtitle">Links in the portfolio footer</p>
                </div>
                <button class="btn btn-outline btn-sm" id="btn-add-social">+ Add Link</button>
              </div>
              <div id="socials-editor-container"></div>
            </div>

            <div class="card">
              <div class="card-header">
                <div>
                  <h2 class="card-title">Footer Copyright</h2>
                </div>
              </div>
              <div class="form-row">
                <label class="form-label" for="f-copyright">Copyright Text</label>
                <input type="text" class="input" id="f-copyright" placeholder="© 2024 Alex Ramirez. Engineered with obsession.">
              </div>
            </div>
          </div>

          <!-- ═══════ SEO SETTINGS ═══════ -->
          <div class="admin-section" id="sec-seo">
            <div class="section-header">
              <div>
                <h1 class="section-title">SEO & Metadata</h1>
                <p class="section-subtitle">Page title, search engine preview, and system tools</p>
              </div>
              <button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button>
            </div>

            <div class="card">
              <div class="form-row">
                <label class="form-label" for="f-seo-title">Page Title</label>
                <input type="text" class="input" id="f-seo-title" placeholder="Alex Ramirez — Full Stack Developer & AI Engineer">
                <span class="form-hint">Displayed on browser tabs and Google search snippets</span>
              </div>
              <div class="form-row">
                <label class="form-label" for="f-seo-desc">Meta Description</label>
                <textarea class="textarea" id="f-seo-desc" rows="3" placeholder="A concise summary for search engines and social link previews..."></textarea>
              </div>
            </div>

            <div class="danger-card">
              <div class="danger-header">
                <div class="danger-icon">⚠️</div>
                <div>
                  <h3 class="danger-title">Reset Content to Defaults</h3>
                  <p class="danger-text">
                    Permanently clear your customized content and restore factory defaults from data.js.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button class="btn btn-danger" id="btn-reset-confirm">Reset Everything to Defaults</button>
            </div>
          </div>

        </div><!-- /admin-content -->
      </main>
    </div><!-- /admin-layout -->

    <!-- ═══════════ FLOATING UNSAVED BAR ═══════════ -->
    <div class="unsaved-bar" id="unsaved-bar">
      <div class="unsaved-content">
        <span class="unsaved-dot"></span>
        <span class="unsaved-text">You have unsaved changes</span>
      </div>
      <div class="unsaved-actions">
        <button class="btn btn-ghost btn-sm" id="btn-discard-changes">Discard</button>
        <button class="btn btn-primary btn-sm" id="btn-floating-save">Save Changes</button>
      </div>
    </div>

    <!-- ═══════════ TOAST NOTIFICATION ═══════════ -->
    <div class="toast" id="toast">
      <div class="toast-icon" id="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span class="toast-message" id="toast-text">Changes saved successfully</span>
    </div>
    `;
  }

  /* =========================================================
     4. PORTFOLIO VIEW CONTROLLER
     ========================================================= */
  let scrollObserver = null;
  let counterObserver = null;
  let parallaxScrollHandler = null;
  let navScrollHandler = null;

  function initPortfolioView() {
    populatePortfolioContent();
    initPortfolioNav();
    initScrollReveals();
    initCounters();
    initParallax();
    initContactForm();
    bindCursorHovers();
  }

  function cleanupPortfolioView() {
    if (scrollObserver) {
      scrollObserver.disconnect();
      scrollObserver = null;
    }
    if (counterObserver) {
      counterObserver.disconnect();
      counterObserver = null;
    }
    if (parallaxScrollHandler) {
      window.removeEventListener('scroll', parallaxScrollHandler);
      parallaxScrollHandler = null;
    }
    if (navScrollHandler) {
      window.removeEventListener('scroll', navScrollHandler);
      navScrollHandler = null;
    }
  }

  function populatePortfolioContent() {
    const data = getSiteData();

    // SEO updates
    if (data.seo) {
      if (data.seo.title) document.title = data.seo.title;
      const descEl = document.getElementById('seo-description');
      if (descEl && data.seo.description) {
        descEl.setAttribute('content', data.seo.description);
      }
    }

    // Nav badge
    const badge = document.getElementById('nav-badge');
    if (badge && data.profile && data.profile.badge) {
      badge.textContent = data.profile.badge;
    }

    // Hero
    if (data.hero) {
      setText('hero-eyebrow', data.hero.eyebrow || (data.profile && data.profile.headline) || '');
      setHTML('hero-line1', data.hero.titleLine1 || 'PORTFOLIO');
      setText('hero-subtitle', data.hero.subtitle || '');
    }

    // Hero portrait
    const heroPortrait = document.getElementById('hero-portrait');
    if (heroPortrait && data.profile) {
      if (data.profile.portraitSrc) heroPortrait.src = data.profile.portraitSrc;
      if (data.profile.portraitAlt) heroPortrait.alt = data.profile.portraitAlt;
    }

    // About
    if (data.about) {
      setText('about-label', data.about.label || 'The Manifesto');
      setHTML('about-headline', data.about.headlineHTML || '');
      setText('about-text1', data.about.text1 || '');
      setText('about-text2', data.about.text2 || '');
    }

    // About portrait
    const portrait = document.getElementById('parallax-image');
    if (portrait && data.profile) {
      if (data.profile.portraitSrc) portrait.src = data.profile.portraitSrc;
      if (data.profile.portraitAlt) portrait.alt = data.profile.portraitAlt;
    }

    // Metrics
    renderPortfolioMetrics(data.metrics);

    // Projects
    renderPortfolioProjects(data.projects);

    // Services
    renderPortfolioServices(data.services);

    // Testimonials
    renderPortfolioTestimonials(data.testimonials);

    // Footer
    if (data.footer && data.footer.copyright) {
      setText('footer-copyright', data.footer.copyright);
    }

    // Magnetic btn email link
    const magneticBtn = document.getElementById('magnetic-btn');
    if (magneticBtn && data.profile && data.profile.email) {
      magneticBtn.href = 'mailto:' + data.profile.email;
    }

    // Socials
    const socialsContainer = document.getElementById('footer-socials');
    if (socialsContainer && data.socials) {
      socialsContainer.innerHTML = data.socials
        .map(
          (s) =>
            `<a href="${escapeHTML(s.url)}" class="social-link" data-hover target="_blank" rel="noopener">${escapeHTML(s.name)}</a>`
        )
        .join('');
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function renderPortfolioMetrics(metrics) {
    const container = document.getElementById('metrics-grid');
    if (!container || !metrics) return;

    container.innerHTML = metrics
      .map(
        (m) => `
        <div class="metric-item reveal">
          <div>
            <span class="metric-number" data-count="${m.count}">0</span><span class="metric-suffix">${escapeHTML(m.suffix || '+')}</span>
          </div>
          <span class="metric-label">${escapeHTML(m.label)}</span>
        </div>`
      )
      .join('');
  }

  function renderPortfolioProjects(projects) {
    const container = document.getElementById('works-grid');
    if (!container || !projects) return;

    container.innerHTML = projects
      .map(
        (p) => `
      <a href="${escapeHTML(p.link || '#')}" class="work-card reveal" data-hover="project">
        <div class="work-card-image-wrapper">
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" class="work-card-image" loading="lazy" width="800" height="500">
          <div class="work-card-overlay">
            <span class="view-label">
              <span>View Case Study</span>
              <span style="font-size:1.1rem; margin-left:0.35rem;">⟶</span>
            </span>
          </div>
        </div>
        <div class="work-card-body">
          <div class="work-card-top">
            <span class="work-card-number">Edition #${escapeHTML(p.number || '')}</span>
            <span class="work-card-year">${escapeHTML(p.year || '')}</span>
          </div>
          <h3 class="work-card-title">${escapeHTML(p.name)}</h3>
          ${p.description ? `<p class="work-card-description">${escapeHTML(p.description)}</p>` : ''}
          ${
            p.tags && p.tags.length
              ? `<div class="work-card-tags">
              ${p.tags.map((t) => `<span class="work-card-tag">${escapeHTML(t)}</span>`).join('')}
            </div>`
              : ''
          }
          ${
            p.techStack && p.techStack.length
              ? `<div class="work-card-tech">
              ${p.techStack.map((t) => `<span class="tech-badge">${escapeHTML(t)}</span>`).join('')}
            </div>`
              : ''
          }
        </div>
      </a>`
      )
      .join('');
  }

  function renderPortfolioServices(services) {
    const container = document.getElementById('services-grid');
    if (!container || !services) return;

    container.innerHTML = services
      .map(
        (s) => `
      <div class="service-card reveal" data-hover>
        <div class="service-card-icon">
          ${serviceIcons[s.icon] || serviceIcons.code}
        </div>
        <div class="service-card-number">Service ${escapeHTML(s.number)}</div>
        <h3 class="service-card-title">${escapeHTML(s.heading)}</h3>
        <p class="service-card-desc">${escapeHTML(s.text)}</p>
        ${
          s.bullets
            ? `<ul class="service-card-list">
            ${s.bullets.map((b) => `<li>${escapeHTML(b)}</li>`).join('')}
          </ul>`
            : ''
        }
        <div class="service-card-skills">
          ${(s.skills || []).map((sk) => `<span class="service-card-skill">${escapeHTML(sk)}</span>`).join('')}
        </div>
      </div>`
      )
      .join('');
  }

  function renderPortfolioTestimonials(testimonials) {
    const container = document.getElementById('testimonials-grid');
    if (!container || !testimonials) return;

    container.innerHTML = testimonials
      .map(
        (t) => `
      <div class="testimonial-card reveal">
        <div class="testimonial-quote">“</div>
        <p class="testimonial-text">${escapeHTML(t.text)}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${escapeHTML(t.initials)}</div>
          <div class="testimonial-info">
            <span class="testimonial-name">
              ${escapeHTML(t.name)}
              ${
                t.verified
                  ? `<svg class="verified-badge" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
                  : ''
              }
            </span>
            <span class="testimonial-role">${escapeHTML(t.role)}</span>
          </div>
        </div>
      </div>`
      )
      .join('');
  }

  function initPortfolioNav() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');

    navScrollHandler = raf(() => {
      if (!nav) return;
      if (window.scrollY > 60) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    });

    window.addEventListener('scroll', navScrollHandler);

    if (navToggle && navMobile) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('is-active');
        navMobile.classList.toggle('is-open');
        document.body.style.overflow = navMobile.classList.contains('is-open') ? 'hidden' : '';
      });

      navMobile.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('is-active');
          navMobile.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  function triggerHeroReveal() {
    const lineInners = document.querySelectorAll('.hero-title .line-inner');
    lineInners.forEach((el) => el.classList.add('is-visible'));

    setTimeout(() => {
      document.querySelectorAll('.hero .reveal, .hero .reveal-fade, .hero .reveal-right').forEach((el) => {
        el.classList.add('is-visible');
      });
    }, 400);
  }

  function initScrollReveals() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-fade, .reveal-left, .reveal-right'
    );

    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => {
      if (el.closest('.hero')) return;
      scrollObserver.observe(el);
    });
  }

  function initCounters() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const end = parseInt(target.getAttribute('data-count'), 10);
            if (!isNaN(end)) {
              animateCounter(target, 0, end, 1800);
            }
            counterObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.25 }
    );

    metricNumbers.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = Math.floor(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initParallax() {
    const parallaxImage = document.getElementById('parallax-image');
    if (!parallaxImage || prefersReducedMotion) return;

    const imageWrapper = parallaxImage.closest('.about-image-wrapper');
    parallaxScrollHandler = raf(() => {
      if (!imageWrapper) return;
      const rect = imageWrapper.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.top < windowH && rect.bottom > 0) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const translateY = (progress - 0.5) * -40;
        parallaxImage.style.transform = `translateY(${translateY}px) scale(1.06)`;
      }
    });

    window.addEventListener('scroll', parallaxScrollHandler);
  }

  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.form-submit span');
        const oldText = btn.textContent;
        btn.textContent = 'Transmission Dispatched ✓';
        setTimeout(() => {
          btn.textContent = oldText;
          contactForm.reset();
        }, 3500);
      });
    }
  }

  /* =========================================================
     5. ADMIN CMS VIEW CONTROLLER
     ========================================================= */
  let adminData = null;
  let isDirty = false;
  let toastTimeout = null;

  function initAdminView() {
    adminData = getSiteData();
    isDirty = false;

    initAdminSidebar();
    populatePersonalInfo();
    renderMetricsEditor();
    renderProjectsEditor();
    renderServicesEditor();
    renderSocialsEditor();
    bindAdminSaveActions();
    bindAdminImageUploads();
    clearDirty();
  }

  function markDirty() {
    if (!isDirty) {
      isDirty = true;
      const syncStatus = document.getElementById('sync-status');
      const unsavedBar = document.getElementById('unsaved-bar');
      if (syncStatus) syncStatus.classList.add('is-dirty');
      if (unsavedBar) unsavedBar.classList.add('is-visible');
      const statusText = syncStatus ? syncStatus.querySelector('.status-text') : null;
      if (statusText) statusText.textContent = 'Unsaved changes';
    }
  }

  function clearDirty() {
    isDirty = false;
    const syncStatus = document.getElementById('sync-status');
    const unsavedBar = document.getElementById('unsaved-bar');
    if (syncStatus) syncStatus.classList.remove('is-dirty');
    if (unsavedBar) unsavedBar.classList.remove('is-visible');
    const statusText = syncStatus ? syncStatus.querySelector('.status-text') : null;
    if (statusText) statusText.textContent = 'All changes synced';
  }

  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    clearTimeout(toastTimeout);
    toastText.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.classList.add('is-visible');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function initAdminSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
    const adminSections = document.querySelectorAll('.admin-section');
    const topbarTitle = document.getElementById('topbar-title');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    function navigateToSection(sectionId) {
      sidebarLinks.forEach((link) => {
        link.classList.toggle('is-active', link.dataset.section === sectionId);
      });

      adminSections.forEach((sec) => {
        sec.classList.toggle('is-active', sec.id === `sec-${sectionId}`);
      });

      const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
      if (activeLink && topbarTitle) {
        topbarTitle.textContent = activeLink.textContent.trim();
      }

      if (sidebar) sidebar.classList.remove('is-open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    sidebarLinks.forEach((link) => {
      link.addEventListener('click', () => navigateToSection(link.dataset.section));
    });

    document.querySelectorAll('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => navigateToSection(btn.dataset.goto));
    });

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
        sidebarOverlay.classList.toggle('is-visible');
      });

      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
        sidebarOverlay.classList.remove('is-visible');
      });
    }
  }

  function populatePersonalInfo() {
    if (!adminData) return;
    const p = adminData.profile || {};
    const h = adminData.hero || {};
    const a = adminData.about || {};
    const s = adminData.seo || {};
    const f = adminData.footer || {};

    setVal('f-name', p.name || '');
    setVal('f-role', h.eyebrow || p.headline || '');
    setVal('f-email', p.email || '');
    setVal('f-badge', p.badge || '');
    setVal('f-hero-title', h.titleLine1 || 'PORTFOLIO.');
    setVal('f-hero-subtitle', h.subtitle || '');
    setVal('f-about-headline', a.headlineHTML || '');
    setVal('f-about-text1', a.text1 || '');
    setVal('f-about-text2', a.text2 || '');
    setVal('f-portrait-src', p.portraitSrc || '');
    setVal('f-portrait-alt', p.portraitAlt || '');

    const portraitPreview = document.getElementById('portrait-preview');
    if (portraitPreview && p.portraitSrc) {
      portraitPreview.src = p.portraitSrc;
    }

    setVal('f-copyright', f.copyright || '');
    setVal('f-seo-title', s.title || '');
    setVal('f-seo-desc', s.description || '');

    // Overview counters
    const dashProjects = document.getElementById('dash-projects');
    if (dashProjects) dashProjects.textContent = adminData.projects ? adminData.projects.length : 0;
    const dashMetrics = document.getElementById('dash-metrics');
    if (dashMetrics) dashMetrics.textContent = adminData.metrics ? adminData.metrics.length : 0;
    const dashServices = document.getElementById('dash-services');
    if (dashServices) dashServices.textContent = adminData.services ? adminData.services.length : 0;
    const dashOwner = document.getElementById('dash-owner');
    if (dashOwner) dashOwner.textContent = p.firstName || (p.name ? p.name.split(' ')[0] : 'Owner');
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function renderMetricsEditor() {
    const metricsContainer = document.getElementById('metrics-editor-container');
    const addMetricBtn = document.getElementById('btn-add-metric');
    if (!metricsContainer || !adminData) return;
    if (!adminData.metrics) adminData.metrics = [];

    metricsContainer.innerHTML = adminData.metrics
      .map(
        (m, i) => `
      <div class="metric-card-item" data-index="${i}">
        <div class="metric-card-top">
          <span class="metric-order-badge">Metric #${i + 1}</span>
          <button type="button" class="btn btn-sm btn-danger-ghost btn-del-metric" data-index="${i}" title="Delete metric">
            ✕ Delete
          </button>
        </div>
        <div class="metric-card-inputs">
          <div class="metric-count-col">
            <label class="form-label">Number Value</label>
            <input type="number" class="input metric-field-count" value="${m.count}" placeholder="50" min="0">
          </div>
          <div class="metric-suffix-col">
            <label class="form-label">Suffix</label>
            <input type="text" class="input metric-field-suffix" value="${escapeAttr(m.suffix || '+')}" placeholder="+">
          </div>
        </div>
        <div class="form-row" style="margin:0;">
          <label class="form-label">Metric Label</label>
          <input type="text" class="input metric-field-label" value="${escapeAttr(m.label || '')}" placeholder="e.g. Projects Delivered">
        </div>
      </div>`
      )
      .join('');

    metricsContainer.querySelectorAll('.input').forEach((input) => {
      input.addEventListener('input', markDirty);
    });

    metricsContainer.querySelectorAll('.btn-del-metric').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (confirm('Delete this metric?')) {
          collectMetricsFromDOM();
          adminData.metrics.splice(idx, 1);
          renderMetricsEditor();
          markDirty();
        }
      });
    });

    if (addMetricBtn && !addMetricBtn.dataset.bound) {
      addMetricBtn.dataset.bound = 'true';
      addMetricBtn.addEventListener('click', () => {
        collectMetricsFromDOM();
        adminData.metrics.push({
          count: 10,
          suffix: '+',
          label: 'New Statistic',
        });
        renderMetricsEditor();
        markDirty();
        const last = metricsContainer.lastElementChild;
        if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  function collectMetricsFromDOM() {
    const metricsContainer = document.getElementById('metrics-editor-container');
    if (!metricsContainer || !adminData) return;
    const cards = metricsContainer.querySelectorAll('.metric-card-item');
    const updated = [];
    cards.forEach((card) => {
      const countInput = card.querySelector('.metric-field-count');
      const suffixInput = card.querySelector('.metric-field-suffix');
      const labelInput = card.querySelector('.metric-field-label');

      updated.push({
        count: parseInt(countInput ? countInput.value : 0, 10) || 0,
        suffix: suffixInput ? suffixInput.value.trim() : '+',
        label: labelInput ? labelInput.value.trim() : '',
      });
    });
    adminData.metrics = updated;
  }

  function renderProjectsEditor() {
    const projectsContainer = document.getElementById('projects-editor-container');
    const addProjectBtn = document.getElementById('btn-add-project');
    const addProjectTopBtn = document.getElementById('btn-add-project-top');
    if (!projectsContainer || !adminData) return;
    if (!adminData.projects) adminData.projects = [];

    projectsContainer.innerHTML = adminData.projects
      .map((p, i) => {
        const techStackString = Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack || '';
        const tagsString = Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '';
        const imageSrc = p.image || 'assets/images/project-aurelia.jpg';

        return `
        <div class="project-card-item" data-index="${i}" data-id="${p.id || ''}">
          <div class="project-card-topbar">
            <div class="project-topbar-info">
              <span class="project-topbar-num">#${escapeAttr(p.number || (i + 1 < 10 ? '0' + (i + 1) : String(i + 1)))}</span>
              <img class="project-thumb-preview" id="thumb-${i}" src="${escapeAttr(imageSrc)}" alt="Project thumbnail">
              <span class="project-topbar-title">${escapeHTML(p.name || 'Untitled Project')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button type="button" class="btn btn-sm btn-danger-ghost btn-del-project" data-index="${i}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </button>
            </div>
          </div>

          <div class="project-card-body">
            <div class="form-grid">
              <div class="form-row">
                <label class="form-label">Project Title <span class="required">*</span></label>
                <input type="text" class="input p-field-name" value="${escapeAttr(p.name || '')}" placeholder="e.g. CodeFlow AI">
              </div>
              <div class="form-row">
                <label class="form-label">Year</label>
                <input type="text" class="input p-field-year" value="${escapeAttr(p.year || '2024')}" placeholder="2024">
              </div>
            </div>

            <div class="form-row">
              <label class="form-label">Project Description</label>
              <textarea class="textarea p-field-desc" rows="2" placeholder="Brief summary of the application, architecture, and value delivered...">${escapeHTML(p.description || '')}</textarea>
            </div>

            <div class="form-grid">
              <div class="form-row">
                <label class="form-label">Tech Stack (comma separated)</label>
                <input type="text" class="input p-field-tech" value="${escapeAttr(techStackString)}" placeholder="e.g. React.js, Node.js, Python, AWS">
                <span class="form-hint">Displayed as individual badges on the project card</span>
              </div>
              <div class="form-row">
                <label class="form-label">Tags / Categories (comma separated)</label>
                <input type="text" class="input p-field-tags" value="${escapeAttr(tagsString)}" placeholder="e.g. AI/ML, SaaS, Full Stack">
              </div>
            </div>

            <div class="form-grid">
              <div class="form-row">
                <label class="form-label">Image URL / Path</label>
                <div style="display:flex; gap:0.5rem;">
                  <input type="text" class="input p-field-image" value="${escapeAttr(p.image || '')}" placeholder="assets/images/project-aurelia.jpg">
                  <label class="btn btn-ghost btn-sm" for="upload-img-${i}" style="white-space:nowrap; flex-shrink:0;">
                    Upload File
                  </label>
                  <input type="file" id="upload-img-${i}" class="p-field-file" accept="image/*" data-index="${i}" hidden>
                </div>
              </div>
              <div class="form-row">
                <label class="form-label">Project Link URL</label>
                <input type="text" class="input p-field-link" value="${escapeAttr(p.link || '#')}" placeholder="https://github.com/... or #">
              </div>
            </div>
          </div>
        </div>`;
      })
      .join('');

    // Handle file upload per project
    projectsContainer.querySelectorAll('.p-field-file').forEach((fileInput) => {
      const idx = fileInput.dataset.index;
      bindFileInputToBase64(fileInput, (dataUrl) => {
        const card = projectsContainer.querySelector(`.project-card-item[data-index="${idx}"]`);
        if (card) {
          const imgInput = card.querySelector('.p-field-image');
          if (imgInput) imgInput.value = dataUrl;
          const thumb = card.querySelector('.project-thumb-preview');
          if (thumb) thumb.src = dataUrl;
        }
      });
    });

    // Live preview for image URL text
    projectsContainer.querySelectorAll('.p-field-image').forEach((input) => {
      input.addEventListener('input', (e) => {
        const card = e.target.closest('.project-card-item');
        if (card) {
          const thumb = card.querySelector('.project-thumb-preview');
          if (thumb) thumb.src = e.target.value.trim() || 'assets/images/project-aurelia.jpg';
        }
        markDirty();
      });
    });

    // Live update for project title in card header
    projectsContainer.querySelectorAll('.p-field-name').forEach((input) => {
      input.addEventListener('input', (e) => {
        const card = e.target.closest('.project-card-item');
        if (card) {
          const title = card.querySelector('.project-topbar-title');
          if (title) title.textContent = e.target.value.trim() || 'Untitled Project';
        }
        markDirty();
      });
    });

    projectsContainer.querySelectorAll('.input, .textarea').forEach((el) => {
      el.addEventListener('input', markDirty);
    });

    // Delete project
    projectsContainer.querySelectorAll('.btn-del-project').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        const pName = adminData.projects[idx] ? adminData.projects[idx].name : 'this project';
        if (confirm(`Are you sure you want to delete "${pName}"?`)) {
          collectProjectsFromDOM();
          adminData.projects.splice(idx, 1);
          renderProjectsEditor();
          markDirty();
          showToast(`Deleted "${pName}"`);
        }
      });
    });

    const createProject = () => {
      collectProjectsFromDOM();
      const newIdx = adminData.projects.length + 1;
      const numStr = newIdx < 10 ? '0' + newIdx : String(newIdx);

      const newProject = {
        id: generateId(),
        number: numStr,
        name: 'New Showcase Project',
        description: 'Engineered an end-to-end digital experience with modern architecture and seamless UX.',
        tags: ['Full Stack', 'Web App'],
        techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
        year: new Date().getFullYear().toString(),
        image: 'assets/images/project-aurelia.jpg',
        link: '#',
      };

      adminData.projects.push(newProject);
      renderProjectsEditor();
      markDirty();

      const lastCard = projectsContainer.lastElementChild;
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameInput = lastCard.querySelector('.p-field-name');
        if (nameInput) {
          nameInput.focus();
          nameInput.select();
        }
      }
    };

    if (addProjectBtn && !addProjectBtn.dataset.bound) {
      addProjectBtn.dataset.bound = 'true';
      addProjectBtn.addEventListener('click', createProject);
    }
    if (addProjectTopBtn && !addProjectTopBtn.dataset.bound) {
      addProjectTopBtn.dataset.bound = 'true';
      addProjectTopBtn.addEventListener('click', createProject);
    }
  }

  function collectProjectsFromDOM() {
    const projectsContainer = document.getElementById('projects-editor-container');
    if (!projectsContainer || !adminData) return;
    const cards = projectsContainer.querySelectorAll('.project-card-item');
    const updated = [];

    cards.forEach((card, i) => {
      const id = card.dataset.id || generateId();
      const numFormatted = i + 1 < 10 ? '0' + (i + 1) : String(i + 1);
      const name = card.querySelector('.p-field-name')?.value.trim() || 'Untitled Project';
      const year = card.querySelector('.p-field-year')?.value.trim() || '2024';
      const description = card.querySelector('.p-field-desc')?.value.trim() || '';
      const techRaw = card.querySelector('.p-field-tech')?.value || '';
      const tagsRaw = card.querySelector('.p-field-tags')?.value || '';
      const image = card.querySelector('.p-field-image')?.value.trim() || 'assets/images/project-aurelia.jpg';
      const link = card.querySelector('.p-field-link')?.value.trim() || '#';

      const techStack = techRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const tags = tagsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      updated.push({
        id,
        number: numFormatted,
        name,
        year,
        description,
        techStack,
        tags,
        image,
        link,
      });
    });

    adminData.projects = updated;
  }

  function renderServicesEditor() {
    const servicesContainer = document.getElementById('services-editor-container');
    if (!servicesContainer || !adminData) return;
    if (!adminData.services) adminData.services = [];

    servicesContainer.innerHTML = adminData.services
      .map((s, i) => {
        const skillsString = (s.skills || []).join(', ');
        const bulletsString = (s.bullets || []).join('\n');

        return `
        <div class="service-card-item" data-index="${i}">
          <div class="card-header">
            <div>
              <h3 class="card-title">Service #${s.number || i + 1}: ${escapeHTML(s.heading)}</h3>
              <p class="card-subtitle">Icon: ${escapeHTML(s.icon || 'code')}</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Service Heading</label>
              <input type="text" class="input s-field-heading" value="${escapeAttr(s.heading)}" placeholder="Service Name">
            </div>
            <div class="form-row">
              <label class="form-label">Icon Identifier</label>
              <select class="input s-field-icon">
                <option value="code" ${s.icon === 'code' ? 'selected' : ''}>code (Web Development)</option>
                <option value="brain" ${s.icon === 'brain' ? 'selected' : ''}>brain (AI & Automation)</option>
                <option value="palette" ${s.icon === 'palette' ? 'selected' : ''}>palette (UI/UX Engineering)</option>
                <option value="cloud" ${s.icon === 'cloud' ? 'selected' : ''}>cloud (DevOps & Cloud)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Overview Description</label>
            <textarea class="textarea s-field-text" rows="2">${escapeHTML(s.text || '')}</textarea>
          </div>

          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">Key Deliverables (one per line)</label>
              <textarea class="textarea s-field-bullets" rows="3">${escapeHTML(bulletsString)}</textarea>
            </div>
            <div class="form-row">
              <label class="form-label">Skills & Technologies (comma separated)</label>
              <textarea class="textarea s-field-skills" rows="3">${escapeHTML(skillsString)}</textarea>
            </div>
          </div>
        </div>`;
      })
      .join('');

    servicesContainer.querySelectorAll('.input, .textarea, select').forEach((el) => {
      el.addEventListener('input', markDirty);
    });
  }

  function collectServicesFromDOM() {
    const servicesContainer = document.getElementById('services-editor-container');
    if (!servicesContainer || !adminData) return;
    const cards = servicesContainer.querySelectorAll('.service-card-item');
    const updated = [];

    cards.forEach((card, i) => {
      const heading = card.querySelector('.s-field-heading')?.value.trim() || 'Service';
      const icon = card.querySelector('.s-field-icon')?.value || 'code';
      const text = card.querySelector('.s-field-text')?.value.trim() || '';
      const bulletsRaw = card.querySelector('.s-field-bullets')?.value || '';
      const skillsRaw = card.querySelector('.s-field-skills')?.value || '';

      const bullets = bulletsRaw
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean);

      const skills = skillsRaw
        .split(',')
        .map((sk) => sk.trim())
        .filter(Boolean);

      updated.push({
        number: i + 1 < 10 ? '0' + (i + 1) : String(i + 1),
        heading,
        icon,
        text,
        bullets,
        skills,
      });
    });

    adminData.services = updated;
  }

  function renderSocialsEditor() {
    const socialsContainer = document.getElementById('socials-editor-container');
    const addSocialBtn = document.getElementById('btn-add-social');
    if (!socialsContainer || !adminData) return;
    if (!adminData.socials) adminData.socials = [];

    socialsContainer.innerHTML = adminData.socials
      .map(
        (s, i) => `
      <div class="form-grid" style="align-items:flex-end; margin-bottom:0.75rem;" data-index="${i}">
        <div class="form-row" style="margin:0;">
          <label class="form-label">Platform Name</label>
          <input type="text" class="input soc-name" value="${escapeAttr(s.name)}" placeholder="e.g. GitHub">
        </div>
        <div class="form-row" style="margin:0; display:flex; gap:0.5rem; align-items:flex-end;">
          <div style="flex:1;">
            <label class="form-label">Profile URL</label>
            <input type="text" class="input soc-url" value="${escapeAttr(s.url)}" placeholder="https://...">
          </div>
          <button type="button" class="btn btn-sm btn-danger-ghost btn-del-social" data-index="${i}">✕</button>
        </div>
      </div>`
      )
      .join('');

    socialsContainer.querySelectorAll('.input').forEach((el) => {
      el.addEventListener('input', markDirty);
    });

    socialsContainer.querySelectorAll('.btn-del-social').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        collectSocialsFromDOM();
        adminData.socials.splice(idx, 1);
        renderSocialsEditor();
        markDirty();
      });
    });

    if (addSocialBtn && !addSocialBtn.dataset.bound) {
      addSocialBtn.dataset.bound = 'true';
      addSocialBtn.addEventListener('click', () => {
        collectSocialsFromDOM();
        adminData.socials.push({ name: 'Platform', url: 'https://' });
        renderSocialsEditor();
        markDirty();
      });
    }
  }

  function collectSocialsFromDOM() {
    const socialsContainer = document.getElementById('socials-editor-container');
    if (!socialsContainer || !adminData) return;
    const rows = socialsContainer.querySelectorAll('.form-grid');
    const updated = [];
    rows.forEach((row) => {
      const name = row.querySelector('.soc-name')?.value.trim();
      const url = row.querySelector('.soc-url')?.value.trim();
      if (name) updated.push({ name, url: url || '#' });
    });
    adminData.socials = updated;
  }

  function bindAdminImageUploads() {
    const portraitFileInput = document.getElementById('f-portrait-file');
    const portraitSrcInput = document.getElementById('f-portrait-src');
    const portraitPreview = document.getElementById('portrait-preview');

    if (portraitFileInput) {
      bindFileInputToBase64(portraitFileInput, (dataUrl) => {
        if (portraitSrcInput) portraitSrcInput.value = dataUrl;
        if (portraitPreview) portraitPreview.src = dataUrl;
      });
    }

    if (portraitSrcInput) {
      portraitSrcInput.addEventListener('input', () => {
        if (portraitPreview) portraitPreview.src = portraitSrcInput.value || 'assets/images/portrait.jpg';
        markDirty();
      });
    }

    document.querySelectorAll('#sec-profile input, #sec-profile textarea, #sec-seo input, #sec-seo textarea, #sec-socials input').forEach((el) => {
      el.addEventListener('input', markDirty);
    });
  }

  function bindFileInputToBase64(fileInput, onComplete) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', true);
        return;
      }

      if (file.size > 2.5 * 1024 * 1024) {
        showToast('Image file too large (max 2.5MB for browser storage)', true);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        onComplete(dataUrl);
        markDirty();
        showToast('Image uploaded successfully!');
      };
      reader.onerror = () => {
        showToast('Failed to read image file', true);
      };
      reader.readAsDataURL(file);
    });
  }

  function saveAllChanges() {
    if (!adminData) adminData = getSiteData();

    // 1. Collect Personal Info & SEO
    const fullName = getVal('f-name') || 'Alex Ramirez';
    const roleHeadline = getVal('f-role') || 'Full Stack Developer · AI Engineer';
    const email = getVal('f-email') || 'alex@alexramirez.dev';
    const badge = getVal('f-badge') || 'AR';
    const heroTitle = getVal('f-hero-title') || 'PORTFOLIO.';
    const heroSubtitle = getVal('f-hero-subtitle') || '';
    const aboutHeadline = getVal('f-about-headline') || '';
    const aboutText1 = getVal('f-about-text1') || '';
    const aboutText2 = getVal('f-about-text2') || '';
    const portraitSrc = getVal('f-portrait-src') || 'assets/images/portrait.jpg';
    const portraitAlt = getVal('f-portrait-alt') || `${fullName} — Developer`;
    const copyright = getVal('f-copyright') || `© ${new Date().getFullYear()} ${fullName}. All rights reserved.`;
    const seoTitle = getVal('f-seo-title') || `${fullName} — ${roleHeadline}`;
    const seoDesc = getVal('f-seo-desc') || '';

    const firstName = fullName.split(' ')[0] || fullName;

    adminData.profile = {
      ...(adminData.profile || {}),
      name: fullName,
      firstName,
      headline: roleHeadline,
      email,
      badge,
      portraitSrc,
      portraitAlt,
    };

    adminData.hero = {
      ...(adminData.hero || {}),
      eyebrow: roleHeadline,
      titleLine1: heroTitle,
      subtitle: heroSubtitle,
    };

    adminData.about = {
      ...(adminData.about || {}),
      headlineHTML: aboutHeadline,
      text1: aboutText1,
      text2: aboutText2,
    };

    adminData.footer = {
      copyright,
    };

    adminData.seo = {
      title: seoTitle,
      description: seoDesc,
    };

    // 2. Collect Metrics, Projects, Services, Socials
    collectMetricsFromDOM();
    collectProjectsFromDOM();
    collectServicesFromDOM();
    collectSocialsFromDOM();

    // 3. Save to browser storage
    const success = saveSiteData(adminData);
    if (success) {
      clearDirty();
      showToast('Changes saved successfully! Synced across your portfolio.');
      populatePersonalInfo();

      // Dispatch custom sync event
      window.dispatchEvent(new CustomEvent('portfolio-data-updated', { detail: adminData }));
    } else {
      showToast('Error saving changes. Storage quota may be exceeded.', true);
    }
  }

  function bindAdminSaveActions() {
    document.querySelectorAll('[data-save], #btn-save-all, #btn-floating-save').forEach((btn) => {
      btn.addEventListener('click', saveAllChanges);
    });

    const discardBtn = document.getElementById('btn-discard-changes');
    if (discardBtn) {
      discardBtn.addEventListener('click', () => {
        if (confirm('Discard all unsaved changes and reload original data?')) {
          adminData = getSiteData();
          populatePersonalInfo();
          renderMetricsEditor();
          renderProjectsEditor();
          renderServicesEditor();
          renderSocialsEditor();
          clearDirty();
          showToast('Changes discarded');
        }
      });
    }

    const resetBtn = document.getElementById('btn-reset');
    const resetConfirmBtn = document.getElementById('btn-reset-confirm');
    const handleReset = () => {
      if (confirm('Are you sure you want to reset all portfolio data to defaults? All custom changes will be lost.')) {
        adminData = resetSiteData();
        populatePersonalInfo();
        renderMetricsEditor();
        renderProjectsEditor();
        renderServicesEditor();
        renderSocialsEditor();
        clearDirty();
        showToast('All portfolio content reset to defaults');
        window.dispatchEvent(new CustomEvent('portfolio-data-updated', { detail: adminData }));
      }
    };

    if (resetBtn) resetBtn.addEventListener('click', handleReset);
    if (resetConfirmBtn) resetConfirmBtn.addEventListener('click', handleReset);
  }

  // Keyboard shortcut Ctrl+S
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      if (currentRoute === '/admin') {
        e.preventDefault();
        saveAllChanges();
      }
    }
  });

  /* =========================================================
     6. VANILLA JS ROUTER & CINEMATIC GSAP TRANSITIONS
     ========================================================= */
  let currentRoute = null;
  let isTransitioning = false;
  let hasPreloaded = false;

  function normalizeRoute(path) {
    if (!path) return '/';
    let clean = path.toLowerCase().trim();
    if (clean.startsWith('#/')) clean = clean.slice(1);
    if (clean.endsWith('index.html')) clean = clean.replace(/index\.html$/, '');
    if (clean.endsWith('admin.html') || clean === '/admin' || clean === 'admin') return '/admin';
    if (clean === '' || clean === '/') return '/';
    return clean;
  }

  function getCurrentRouteFromBrowser() {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return normalizeRoute(window.location.hash);
    }
    const path = window.location.pathname;
    if (path.includes('admin')) return '/admin';
    return '/';
  }

  function updateRouteMeta(route) {
    const data = getSiteData();
    if (route === '/admin') {
      document.title = 'CMS Studio — Portfolio Manager';
      const descEl = document.getElementById('seo-description');
      if (descEl) descEl.setAttribute('content', 'CMS Control Panel for managing editorial portfolio content.');
    } else {
      document.title = data.seo?.title || 'Alex Ramirez — Full Stack Developer & AI Engineer';
      const descEl = document.getElementById('seo-description');
      if (descEl && data.seo?.description) descEl.setAttribute('content', data.seo.description);
    }
  }

  /**
   * Orchestrates the seamless GSAP animate out, DOM swap, and animate in
   */
  function transitionToRoute(route, pushHistory = true) {
    if (isTransitioning) return;
    const targetRoute = normalizeRoute(route);

    // Prompt user if attempting to leave admin with unsaved changes
    if (currentRoute === '/admin' && targetRoute !== '/admin' && isDirty) {
      const confirmLeave = confirm('You have unsaved changes in the CMS Studio. Are you sure you want to navigate away without saving?');
      if (!confirmLeave) return;
    }

    isTransitioning = true;
    const appRoot = document.getElementById('app-root');
    if (!appRoot) {
      isTransitioning = false;
      return;
    }

    // Update browser history
    if (pushHistory && window.location.protocol !== 'file:') {
      if (window.location.pathname !== targetRoute) {
        window.history.pushState({ route: targetRoute }, '', targetRoute);
      }
    } else if (pushHistory && window.location.protocol === 'file:') {
      window.location.hash = '#' + targetRoute;
    }

    currentRoute = targetRoute;
    updateRouteMeta(targetRoute);

    // Toggle admin styling on body (standard mouse pointer on CMS, custom magnetic cursor on Portfolio)
    if (targetRoute === '/admin') {
      document.body.classList.add('route-admin');
    } else {
      document.body.classList.remove('route-admin');
    }

    const swapAndInitialize = () => {
      if (targetRoute === '/admin') {
        cleanupPortfolioView();
        appRoot.innerHTML = getAdminHTML();
        initAdminView();
      } else {
        appRoot.innerHTML = getPortfolioHTML();
        initPortfolioView();
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const hasGSAP = typeof gsap !== 'undefined';

    // First load vs Subsequent route switch
    if (appRoot.children.length === 0) {
      swapAndInitialize();
      if (hasGSAP && !prefersReducedMotion) {
        gsap.fromTo(appRoot, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' });
      }
      isTransitioning = false;
      return;
    }

    // Seamless GSAP Page Transition
    if (hasGSAP && !prefersReducedMotion) {
      // 1. Animate Out: Smooth fade out and slight downward translation
      gsap.to(appRoot, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          // 2. Swap DOM Content
          swapAndInitialize();

          // 3. Set starting coordinates for Animate In
          gsap.set(appRoot, { opacity: 0, y: -20 });

          // 4. Animate In: Smooth fade in and downward settle
          gsap.to(appRoot, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: 'power3.out',
            clearProps: 'transform',
            onComplete: () => {
              isTransitioning = false;
            },
          });
        },
      });
    } else {
      // Graceful fallback for reduced motion
      swapAndInitialize();
      isTransitioning = false;
    }
  }

  function navigate(url) {
    if (!url) return;

    // In-page hash anchor (e.g. #works, #about)
    if (url.startsWith('#') && !url.startsWith('#/')) {
      if (url === '#' || url === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (currentRoute !== '/') {
        // From admin, switch to portfolio view first, then smooth scroll to target
        transitionToRoute('/');
        setTimeout(() => {
          const target = document.querySelector(url);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 450);
        return;
      }

      const target = document.querySelector(url);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    transitionToRoute(url);
  }

  /* Universal Click Interceptor for SPA Links */
  document.addEventListener('click', (e) => {
    // 1. Explicit data-route attributes
    const routeTrigger = e.target.closest('[data-route]');
    if (routeTrigger) {
      e.preventDefault();
      navigate(routeTrigger.getAttribute('data-route'));
      return;
    }

    // 2. Standard anchor tags
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Ignore external URLs, mailto, tel, or javascript protocols
    if (
      anchor.target === '_blank' ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      return;
    }

    // In-page hash anchors
    if (href.startsWith('#')) {
      e.preventDefault();
      navigate(href);
      return;
    }

    // Intercept internal routes (e.g. /admin, admin.html, /, index.html)
    e.preventDefault();
    navigate(href);
  });

  // Browser History Navigation (Back / Forward)
  window.addEventListener('popstate', () => {
    const route = getCurrentRouteFromBrowser();
    if (normalizeRoute(route) !== currentRoute) {
      transitionToRoute(route, false);
    }
  });

  window.addEventListener('hashchange', () => {
    const route = getCurrentRouteFromBrowser();
    if (normalizeRoute(route) !== currentRoute) {
      transitionToRoute(route, false);
    }
  });

  // Cross-tab and local state synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio_site_data') {
      if (currentRoute === '/') {
        populatePortfolioContent();
      } else if (currentRoute === '/admin' && !isDirty) {
        adminData = getSiteData();
        populatePersonalInfo();
        renderMetricsEditor();
        renderProjectsEditor();
        renderServicesEditor();
        renderSocialsEditor();
      }
    }
  });

  window.addEventListener('portfolio-data-updated', (e) => {
    if (currentRoute === '/') {
      populatePortfolioContent();
    }
  });

  /* =========================================================
     7. PRELOADER & CUSTOM CURSOR
     ========================================================= */
  const preloader = document.getElementById('preloader');
  const preloaderCounter = document.getElementById('preloader-counter');
  const preloaderFill = document.getElementById('preloader-fill');
  let preloaderProgress = 0;

  function runColdStartPreloader(onComplete) {
    if (!preloader) {
      if (onComplete) onComplete();
      return;
    }

    // Populate preloader name from stored profile
    const data = getSiteData();
    const preloaderName = document.getElementById('preloader-name');
    if (preloaderName && data.profile && data.profile.name) {
      const fullName = data.profile.name.toUpperCase();
      preloaderName.innerHTML = fullName
        .split('')
        .map((ch) => (ch === ' ' ? '<span>&nbsp;</span>' : `<span>${ch}</span>`))
        .join('');
      preloaderName.querySelectorAll('span').forEach((span, i) => {
        span.style.animationDelay = `${i * 0.05}s`;
      });
    }

    const interval = setInterval(() => {
      preloaderProgress += Math.random() * 14;
      if (preloaderProgress >= 100) {
        preloaderProgress = 100;
        if (preloaderCounter) preloaderCounter.textContent = '100%';
        if (preloaderFill) preloaderFill.style.width = '100%';
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('is-hidden');
          hasPreloaded = true;
          if (onComplete) onComplete();
        }, 550);
      } else {
        const p = Math.floor(preloaderProgress);
        if (preloaderCounter) preloaderCounter.textContent = p + '%';
        if (preloaderFill) preloaderFill.style.width = p + '%';
      }
    }, 60);
  }

  /* Custom Magnetic Cursor */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  function initCursor() {
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!document.body.classList.contains('cursor-ready')) {
        document.body.classList.add('cursor-ready');
        cursorX = mouseX;
        cursorY = mouseY;
        dotX = mouseX;
        dotY = mouseY;
      }
    });

    bindCursorHovers();

    function animateCursor() {
      cursorX = lerp(cursorX, mouseX, 0.12);
      cursorY = lerp(cursorY, mouseY, 0.12);
      dotX = lerp(dotX, mouseX, 0.6);
      dotY = lerp(dotY, mouseY, 0.6);

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      if (cursorDot) {
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  function bindCursorHovers() {
    if (!cursor) return;
    document.querySelectorAll('[data-hover]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (el.getAttribute('data-hover') === 'project') {
          cursor.classList.add('is-hovering-project');
        } else {
          cursor.classList.add('is-hovering');
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering', 'is-hovering-project');
      });
    });
  }

  /* =========================================================
     8. APPLICATION BOOTSTRAP
     ========================================================= */
  function bootApplication() {
    initCursor();
    const initialRoute = getCurrentRouteFromBrowser();

    if (initialRoute === '/admin') {
      // Instant bypass of preloader for direct CMS access
      if (preloader) preloader.classList.add('is-hidden');
      hasPreloaded = true;
      transitionToRoute('/admin', false);
    } else {
      // Mount portfolio view and run cinematic preloader
      transitionToRoute('/', false);
      runColdStartPreloader(() => {
        triggerHeroReveal();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApplication);
  } else {
    bootApplication();
  }

  // Global router handle for programmatic debugging or extensions
  window.PortfolioRouter = {
    navigate,
    getCurrentRoute: () => currentRoute,
  };

})();

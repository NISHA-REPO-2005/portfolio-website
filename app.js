/* =========================================================
   app.js — Vanilla JS Single Page Application (SPA)
   ========================================================= */

(function () {
  'use strict';

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

  const serviceIcons = {
    code: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    brain: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.1-.5 2.1-1.3 2.8l-.7.6V12h-4V9.4l-.7-.6A4 4 0 0 1 12 2z"></path><path d="M8 12h8v3a4 4 0 0 1-8 0v-3z"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>`,
    palette: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="8" r="1.5" fill="currentColor"></circle><circle cx="8.5" cy="13" r="1.5" fill="currentColor"></circle><circle cx="15.5" cy="13" r="1.5" fill="currentColor"></circle><circle cx="12" cy="17" r="1.5" fill="currentColor"></circle></svg>`,
    cloud: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  };

  function getPortfolioHTML() {
    return `
    <nav class="nav" id="nav">
      <a href="#" class="nav-logo" id="nav-logo" data-hover>
        <span class="nav-badge" id="nav-badge">NY</span>
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
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <div class="nav-mobile" id="nav-mobile">
      <a href="#about" class="nav-mobile-link" data-hover>Manifesto</a>
      <a href="#works" class="nav-mobile-link" data-hover>Creations</a>
      <a href="#services" class="nav-mobile-link" data-hover>Capabilities</a>
      <a href="#process" class="nav-mobile-link" data-hover>Process</a>
      <a href="#testimonials" class="nav-mobile-link" data-hover>Testimonials</a>
      <a href="#contact" class="nav-mobile-link" data-hover>Inquire</a>
      <a href="/admin" class="nav-mobile-link" data-route="/admin" data-hover style="color:var(--clr-script-dark); font-weight:500;">CMS Studio ⟶</a>
    </div>

    <section class="hero section" id="hero">
      <div class="container">
        <div class="hero-masthead-strip reveal-fade">
          <span>Edition No. XXIV</span>
          <span class="strip-center">Design that Tells Your Story</span>
          <span>Autumn / Winter Portfolio</span>
        </div>

        <div class="hero-title-container">
          <h1 class="hero-title">
            <span class="line"><span class="line-inner" id="hero-line1">PORTFOLIO</span></span>
          </h1>
        </div>

        <div class="hero-grid">
          <div class="hero-text-col">
            <p class="hero-eyebrow reveal-fade" id="hero-eyebrow">B.Tech CSE Student · Web Developer</p>
            <p class="hero-subtitle reveal" id="hero-subtitle">
              I am Nisha Yadav, a Computer Science and Engineering student at Techno Main Salt Lake, passionate about web development, core programming fundamentals, and building reliable digital solutions.
            </p>
            <div class="hero-cta reveal">
              <a href="#works" class="editorial-link" data-hover>
                <span>Explore Selected Works</span><span class="arrow">⟶</span>
              </a>
              <a href="#contact" class="editorial-link" data-hover>
                <span>Get In Touch</span><span class="arrow">⟶</span>
              </a>
            </div>
          </div>

          <div class="hero-portrait-col reveal-right">
            <div class="hero-portrait-wrapper">
              <img src="assets/images/portrait.jpg" 
                   alt="Nisha Yadav — Developer Profile" 
                   class="hero-portrait" 
                   id="hero-portrait"
                   width="600" height="800"
                   fetchpriority="high">
              <div class="hero-portrait-caption">
                <span>Figure 01 / Developer Profile</span>
                <span>Engineering &amp; Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-scroll-indicator reveal-fade">
        <span>Scroll</span><div class="hero-scroll-line"></div>
      </div>
    </section>

    <section class="metrics-bar" id="metrics-bar">
      <div class="container"><div class="metrics-grid" id="metrics-grid"></div></div>
    </section>

    <section class="about section" id="about">
      <div class="container">
        <div class="about-grid">
          <div class="about-image-wrapper reveal-left">
            <img src="assets/images/portrait.jpg" 
                 alt="Nisha Yadav — B.Tech CSE Student" 
                 class="about-image" 
                 id="parallax-image"
                 loading="lazy"
                 width="600" height="520">
          </div>
          <div class="about-content">
            <span class="section-label reveal" id="about-label">About Me</span>
            <h2 class="about-headline reveal" id="about-headline">
              I am a <em class="accent">CSE student</em><br>learning, building,<br>and growing.
            </h2>
            <p class="about-text reveal" id="about-text1"></p>
            <p class="about-text reveal" id="about-text2"></p>
            <div class="reveal" style="margin-top: 0.5rem;">
              <a href="#contact" class="editorial-link" data-hover>
                <span>Get In Touch</span><span class="arrow">⟶</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

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

    <section class="services section luxury-light-panel" id="services">
      <div class="container">
        <div class="services-header">
          <div>
            <span class="section-label reveal">What I Do</span>
            <h2 class="services-title reveal">Capabilities &amp; Craft</h2>
          </div>
          <span class="script-accent reveal">Foundations &amp; Practice</span>
        </div>
        <div class="services-grid" id="services-grid"></div>
      </div>
    </section>

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
              <h3 class="process-step-title">Learn &amp; Understand</h3>
              <p class="process-step-text">Analyzing the problem domain, requirements, and user needs to build clear technical specifications and architecture.</p>
            </div>
          </div>
          <div class="process-step reveal" data-step="02">
            <div class="process-step-number">02</div>
            <div class="process-step-content">
              <h3 class="process-step-title">Design &amp; Structure</h3>
              <p class="process-step-text">Planning clean layouts, component hierarchies, and algorithms before writing code to ensure efficiency and clarity.</p>
            </div>
          </div>
          <div class="process-step reveal" data-step="03">
            <div class="process-step-number">03</div>
            <div class="process-step-content">
              <h3 class="process-step-title">Develop &amp; Build</h3>
              <p class="process-step-text">Writing clean, readable, and standards-compliant code with a focus on maintainability, modularity, and responsiveness.</p>
            </div>
          </div>
          <div class="process-step reveal" data-step="04">
            <div class="process-step-number">04</div>
            <div class="process-step-content">
              <h3 class="process-step-title">Test &amp; Refine</h3>
              <p class="process-step-text">Debugging thoroughly, verifying responsiveness across devices, and iterating on feedback to ensure reliable performance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

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

    <footer class="footer section" id="contact">
      <div class="container">
        <div class="cta-bar reveal" id="cta-bar">
          <div class="cta-bar-content">
            <span class="script-accent" style="font-size:1.6rem; color:var(--clr-blush); display:block; margin-bottom:0.25rem;">Open to Opportunities</span>
            <h2 class="cta-bar-title">Let's Connect</h2>
            <p class="cta-bar-subtitle">Actively seeking software development internship opportunities. Let's discuss how I can contribute to your team.</p>
          </div>
          <a href="mailto:ny26.05.2005@gmail.com" class="editorial-link" id="magnetic-btn" data-hover style="font-size:0.9rem; padding: 1rem 0;">
            <span>Get In Touch</span><span class="arrow" style="font-size:1.2rem;">⟶</span>
          </a>
        </div>
        <div class="footer-form-wrapper reveal">
          <form class="footer-form" id="contact-form">
            <div class="form-group"><input type="text" class="form-input" id="form-name" placeholder="Your Full Name" required data-hover></div>
            <div class="form-group"><input type="email" class="form-input" id="form-email" placeholder="Your Email Address" required data-hover></div>
            <div class="form-group"><textarea class="form-textarea" id="form-message" placeholder="Write your message or inquiry here..." rows="3" data-hover></textarea></div>
            <button type="submit" class="editorial-link form-submit" data-hover><span>Send Message</span><span class="arrow">⟶</span></button>
          </form>
        </div>
        <div class="footer-bottom reveal">
          <p class="footer-copyright" id="footer-copyright">© 2026 Nisha Yadav. Built with passion.</p>
          <div class="footer-socials" id="footer-socials"></div>
          <a href="/admin" class="social-link admin-link" data-route="/admin" data-hover style="opacity:0.4; font-size:0.68rem; letter-spacing:0.1em;">CMS STUDIO</a>
        </div>
      </div>
    </footer>`;
  }

  function getAdminHTML() {
    return `
    <div class="admin-layout">
      <div class="sidebar-overlay" id="sidebar-overlay"></div>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header"><div class="sidebar-brand">Portfolio<span class="dot">.</span><span class="sidebar-badge">CMS</span></div></div>
        <nav class="sidebar-nav">
          <div class="sidebar-section-label">Overview</div>
          <button class="sidebar-link is-active" data-section="dashboard">Dashboard</button>
          <div class="sidebar-section-label">Core Content</div>
          <button class="sidebar-link" data-section="profile">Personal Info</button>
          <button class="sidebar-link" data-section="metrics">Metrics & Numbers</button>
          <button class="sidebar-link" data-section="projects">Project Manager</button>
          <button class="sidebar-link" data-section="services">Services</button>
          <div class="sidebar-section-label">Configuration</div>
          <button class="sidebar-link" data-section="socials">Socials & Footer</button>
          <button class="sidebar-link" data-section="seo">SEO Settings</button>
        </nav>
        <div class="sidebar-footer">
          <a href="/" class="sidebar-footer-link" data-route="/"><span>View Live Site</span></a>
        </div>
      </aside>

      <main class="admin-main">
        <header class="admin-topbar">
          <div class="topbar-left">
            <button class="mobile-menu-btn" id="mobile-menu-btn">≡</button>
            <div class="topbar-meta"><span class="topbar-crumb">CMS Studio</span><span class="topbar-divider">/</span><span class="topbar-title" id="topbar-title">Dashboard</span></div>
            <div class="status-indicator" id="sync-status"><span class="status-dot"></span><span class="status-text">All changes synced</span></div>
          </div>
          <div class="topbar-actions">
            <button class="btn btn-ghost" id="btn-reset"><span>Reset</span></button>
            <a href="/" class="btn btn-ghost" data-route="/"><span>Live Site</span></a>
            <button class="btn btn-primary" id="btn-save-all"><span>Save Changes</span></button>
          </div>
        </header>

        <div class="admin-content">
          <div class="admin-section is-active" id="sec-dashboard">
            <div class="section-banner">
              <div class="banner-content">
                <span class="banner-badge">Light Studio CMS</span>
                <h1 class="banner-title">Welcome to your Portfolio CMS</h1>
                <p class="banner-text">Manage your personal profile, showcase projects, metrics, and services.</p>
              </div>
            </div>
          </div>
          
          <div class="admin-section" id="sec-profile">
            <div class="section-header">
              <div><h1 class="section-title">Personal Info & Identity</h1></div>
              <button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button>
            </div>
            <div class="card">
              <div class="form-grid">
                <div class="form-row"><label class="form-label" for="f-name">Full Name</label><input type="text" class="input" id="f-name"></div>
                <div class="form-row"><label class="form-label" for="f-role">Role</label><input type="text" class="input" id="f-role"></div>
              </div>
              <div class="form-grid">
                <div class="form-row"><label class="form-label" for="f-email">Email</label><input type="email" class="input" id="f-email"></div>
                <div class="form-row"><label class="form-label" for="f-badge">Badge</label><input type="text" class="input" id="f-badge" maxlength="3"></div>
              </div>
              <div class="form-grid">
                <div class="form-row"><label class="form-label" for="f-hero-title">Hero Title</label><input type="text" class="input" id="f-hero-title"></div>
                <div class="form-row"><label class="form-label" for="f-hero-subtitle">Hero Subtitle</label><textarea class="textarea" id="f-hero-subtitle" rows="2"></textarea></div>
              </div>
            </div>
            <div class="card">
              <div class="form-row"><label class="form-label" for="f-about-headline">About Headline</label><textarea class="textarea" id="f-about-headline" rows="2"></textarea></div>
              <div class="form-row"><label class="form-label" for="f-about-text1">About Summary</label><textarea class="textarea" id="f-about-text1" rows="3"></textarea></div>
              <div class="form-row"><label class="form-label" for="f-about-text2">Philosophy</label><textarea class="textarea" id="f-about-text2" rows="3"></textarea></div>
            </div>
            <div class="card">
              <div class="form-row"><label class="form-label" for="f-portrait-src">Hero Portrait Image Path</label><input type="text" class="input" id="f-portrait-src"></div>
              <div class="form-row"><label class="form-label" for="f-portrait-alt">Image Alt Description</label><input type="text" class="input" id="f-portrait-alt"></div>
            </div>
          </div>

          <div class="admin-section" id="sec-metrics"><div class="section-header"><div><h1 class="section-title">Metrics</h1></div><div style="display:flex; gap:0.5rem;"><button class="btn btn-outline btn-sm" id="btn-add-metric">+ Add Metric</button><button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button></div></div><div class="metrics-cards-grid" id="metrics-editor-container"></div></div>
          <div class="admin-section" id="sec-projects"><div class="section-header"><div><h1 class="section-title">Project Manager</h1></div><div style="display:flex; gap:0.5rem;"><button class="btn btn-primary btn-sm" id="btn-add-project-top">+ Add New</button><button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button></div></div><div class="projects-list-container" id="projects-editor-container"></div></div>
          <div class="admin-section" id="sec-services"><div class="section-header"><div><h1 class="section-title">Services</h1></div><button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button></div><div class="services-list-container" id="services-editor-container"></div></div>
          
          <div class="admin-section" id="sec-socials">
            <div class="section-header"><div><h1 class="section-title">Social Links & Footer</h1></div><button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button></div>
            <div class="card"><div class="card-header"><div><h2 class="card-title">Social Profiles</h2></div><button class="btn btn-outline btn-sm" id="btn-add-social">+ Add Link</button></div><div id="socials-editor-container"></div></div>
            <div class="card"><div class="form-row"><label class="form-label" for="f-copyright">Copyright Text</label><input type="text" class="input" id="f-copyright"></div></div>
          </div>
          
          <div class="admin-section" id="sec-seo">
            <div class="section-header"><div><h1 class="section-title">SEO & Metadata</h1></div><button class="btn btn-primary btn-sm save-shortcut" data-save>Save Changes</button></div>
            <div class="card">
              <div class="form-row"><label class="form-label" for="f-seo-title">Page Title</label><input type="text" class="input" id="f-seo-title"></div>
              <div class="form-row"><label class="form-label" for="f-seo-desc">Meta Description</label><textarea class="textarea" id="f-seo-desc" rows="3"></textarea></div>
            </div>
            <div class="danger-card"><button class="btn btn-danger" id="btn-reset-confirm">Reset Everything to Defaults</button></div>
          </div>
        </div>
      </main>
    </div>
    <div class="toast" id="toast"><span class="toast-message" id="toast-text">Changes saved successfully</span></div>`;
  }

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
    if (scrollObserver) scrollObserver.disconnect();
    if (counterObserver) counterObserver.disconnect();
    if (parallaxScrollHandler) window.removeEventListener('scroll', parallaxScrollHandler);
    if (navScrollHandler) window.removeEventListener('scroll', navScrollHandler);
  }

  function populatePortfolioContent() {
    const data = getSiteData();
    if (data.seo) {
      if (data.seo.title) document.title = data.seo.title;
      const descEl = document.getElementById('seo-description');
      if (descEl && data.seo.description) descEl.setAttribute('content', data.seo.description);
    }

    const badge = document.getElementById('nav-badge');
    if (badge && data.profile) badge.textContent = data.profile.badge || 'NY';

    if (data.hero) {
      setText('hero-eyebrow', data.hero.eyebrow || '');
      setHTML('hero-line1', data.hero.titleLine1 || 'PORTFOLIO');
      setText('hero-subtitle', data.hero.subtitle || '');
    }

    const heroPortrait = document.getElementById('hero-portrait');
    if (heroPortrait && data.profile) {
      if (data.profile.portraitSrc) heroPortrait.src = data.profile.portraitSrc;
      if (data.profile.portraitAlt) heroPortrait.alt = data.profile.portraitAlt;
    }

    if (data.about) {
      setText('about-label', data.about.label || 'About Me');
      setHTML('about-headline', data.about.headlineHTML || '');
      setText('about-text1', data.about.text1 || '');
      setText('about-text2', data.about.text2 || '');
    }

    renderPortfolioMetrics(data.metrics);
    renderPortfolioProjects(data.projects);
    renderPortfolioServices(data.services);
    renderPortfolioTestimonials(data.testimonials);

    if (data.footer) setText('footer-copyright', data.footer.copyright);

    const magneticBtn = document.getElementById('magnetic-btn');
    if (magneticBtn && data.profile) magneticBtn.href = 'mailto:' + data.profile.email;

    const socialsContainer = document.getElementById('footer-socials');
    if (socialsContainer && data.socials) {
      socialsContainer.innerHTML = data.socials.map((s) => `<a href="${escapeHTML(s.url)}" class="social-link" data-hover target="_blank" rel="noopener">${escapeHTML(s.name)}</a>`).join('');
    }
  }

  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
  function setHTML(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

  function renderPortfolioMetrics(metrics) {
    const container = document.getElementById('metrics-grid');
    if (!container) return;
    container.innerHTML = (metrics || []).map((m) => `<div class="metric-item reveal"><div><span class="metric-number" data-count="${m.count}">0</span><span class="metric-suffix">${escapeHTML(m.suffix || '+')}</span></div><span class="metric-label">${escapeHTML(m.label)}</span></div>`).join('');
  }

  function renderPortfolioProjects(projects) {
    const container = document.getElementById('works-grid');
    if (!container) return;
    container.innerHTML = (projects || []).map((p) => `<a href="${escapeHTML(p.link || '#')}" class="work-card reveal" data-hover="project"><div class="work-card-image-wrapper"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" class="work-card-image" loading="lazy" width="800" height="500"><div class="work-card-overlay"><span class="view-label"><span>View Project</span><span style="font-size:1.1rem; margin-left:0.35rem;">⟶</span></span></div></div><div class="work-card-body"><div class="work-card-top"><span class="work-card-number">Project #${escapeHTML(p.number || '')}</span><span class="work-card-year">${escapeHTML(p.year || '')}</span></div><h3 class="work-card-title">${escapeHTML(p.name)}</h3>${p.description ? `<p class="work-card-description">${escapeHTML(p.description)}</p>` : ''}${p.techStack && p.techStack.length ? `<div class="work-card-tech">${p.techStack.map((t) => `<span class="tech-badge">${escapeHTML(t)}</span>`).join('')}</div>` : ''}</div></a>`).join('');
  }

  function renderPortfolioServices(services) {
    const container = document.getElementById('services-grid');
    if (!container) return;
    container.innerHTML = (services || []).map((s) => `<div class="service-card reveal" data-hover><div class="service-card-icon">${serviceIcons[s.icon] || serviceIcons.code}</div><div class="service-card-number">Service ${escapeHTML(s.number)}</div><h3 class="service-card-title">${escapeHTML(s.heading)}</h3><p class="service-card-desc">${escapeHTML(s.text)}</p>${s.bullets ? `<ul class="service-card-list">${s.bullets.map((b) => `<li>${escapeHTML(b)}</li>`).join('')}</ul>` : ''}<div class="service-card-skills">${(s.skills || []).map((sk) => `<span class="service-card-skill">${escapeHTML(sk)}</span>`).join('')}</div></div>`).join('');
  }

  function renderPortfolioTestimonials(testimonials) {
    const container = document.getElementById('testimonials-grid');
    if (!container) return;
    container.innerHTML = (testimonials || []).map((t) => `<div class="testimonial-card reveal"><div class="testimonial-quote">“</div><p class="testimonial-text">${escapeHTML(t.text)}</p></div>`).join('');
  }

  function initPortfolioNav() {
    const nav = document.getElementById('nav');
    navScrollHandler = raf(() => { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 60); });
    window.addEventListener('scroll', navScrollHandler);
  }

  function triggerHeroReveal() {
    document.querySelectorAll('.hero-title .line-inner').forEach((el) => el.classList.add('is-visible'));
    setTimeout(() => document.querySelectorAll('.hero .reveal, .hero .reveal-fade, .hero .reveal-right').forEach((el) => el.classList.add('is-visible')), 400);
  }

  function initScrollReveals() {
    scrollObserver = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); scrollObserver.unobserve(entry.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .reveal-right').forEach((el) => { if (!el.closest('.hero')) scrollObserver.observe(el); });
  }

  function initCounters() {
    counterObserver = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { animateCounter(entry.target, 0, parseInt(entry.target.getAttribute('data-count'), 10), 1800); counterObserver.unobserve(entry.target); } }); }, { threshold: 0.25 });
    document.querySelectorAll('.metric-number').forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const p = Math.min((currentTime - startTime) / duration, 1);
      element.textContent = Math.floor(start + (end - start) * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initParallax() {}
  function initContactForm() {}

  let adminData = null, isDirty = false;
  function initAdminView() { adminData = getSiteData(); isDirty = false; initAdminSidebar(); populatePersonalInfo(); renderMetricsEditor(); renderProjectsEditor(); renderServicesEditor(); renderSocialsEditor(); bindAdminSaveActions(); }

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (toast && toastText) { toastText.textContent = message; toast.classList.add('is-visible'); setTimeout(() => toast.classList.remove('is-visible'), 3200); }
  }

  function initAdminSidebar() {
    document.querySelectorAll('.sidebar-link[data-section]').forEach((link) => link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('is-active', l === link));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.toggle('is-active', s.id === `sec-${link.dataset.section}`));
    }));
  }

  function populatePersonalInfo() {
    if (!adminData) return;
    setVal('f-name', adminData.profile?.name || '');
    setVal('f-role', adminData.profile?.headline || '');
    setVal('f-email', adminData.profile?.email || '');
    setVal('f-badge', adminData.profile?.badge || '');
    setVal('f-hero-title', adminData.hero?.titleLine1 || '');
    setVal('f-hero-subtitle', adminData.hero?.subtitle || '');
    setVal('f-about-headline', adminData.about?.headlineHTML || '');
    setVal('f-about-text1', adminData.about?.text1 || '');
    setVal('f-about-text2', adminData.about?.text2 || '');
    setVal('f-portrait-src', adminData.profile?.portraitSrc || '');
    setVal('f-portrait-alt', adminData.profile?.portraitAlt || '');
    setVal('f-copyright', adminData.footer?.copyright || '');
    setVal('f-seo-title', adminData.seo?.title || '');
    setVal('f-seo-desc', adminData.seo?.description || '');
  }

  function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
  function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function renderMetricsEditor() {}
  function collectMetricsFromDOM() {}
  function renderProjectsEditor() {}
  function collectProjectsFromDOM() {}
  function renderServicesEditor() {}
  function collectServicesFromDOM() {}
  function renderSocialsEditor() {}
  function collectSocialsFromDOM() {}

  function saveAllChanges() {
    adminData.profile.name = getVal('f-name');
    adminData.profile.headline = getVal('f-role');
    adminData.hero.eyebrow = getVal('f-role');
    adminData.profile.email = getVal('f-email');
    adminData.hero.titleLine1 = getVal('f-hero-title');
    adminData.hero.subtitle = getVal('f-hero-subtitle');
    adminData.about.headlineHTML = getVal('f-about-headline');
    adminData.about.text1 = getVal('f-about-text1');
    adminData.about.text2 = getVal('f-about-text2');
    adminData.profile.portraitSrc = getVal('f-portrait-src');
    adminData.seo.title = getVal('f-seo-title');
    saveSiteData(adminData);
    showToast('Changes saved successfully!');
    isDirty = false;
  }

  function bindAdminSaveActions() { document.querySelectorAll('[data-save], #btn-save-all').forEach((btn) => btn.addEventListener('click', saveAllChanges)); }

  let currentRoute = null, isTransitioning = false, hasPreloaded = false;
  function normalizeRoute(path) { return path === '' || path === '/' ? '/' : '/admin'; }
  function getCurrentRouteFromBrowser() { return window.location.pathname.includes('admin') || (window.location.hash && window.location.hash.includes('admin')) ? '/admin' : '/'; }

  function transitionToRoute(route, pushHistory = true) {
    if (isTransitioning) return;
    const targetRoute = normalizeRoute(route);
    isTransitioning = true;
    const appRoot = document.getElementById('app-root');
    if (!appRoot) { isTransitioning = false; return; }

    if (pushHistory && window.location.protocol !== 'file:') { if (window.location.pathname !== targetRoute) window.history.pushState({ route: targetRoute }, '', targetRoute); }
    else if (pushHistory && window.location.protocol === 'file:') window.location.hash = '#' + targetRoute;

    currentRoute = targetRoute;
    document.body.classList.toggle('route-admin', targetRoute === '/admin');

    const swapAndInitialize = () => {
      if (targetRoute === '/admin') { cleanupPortfolioView(); appRoot.innerHTML = getAdminHTML(); initAdminView(); }
      else { appRoot.innerHTML = getPortfolioHTML(); initPortfolioView(); }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    if (appRoot.children.length === 0) { swapAndInitialize(); gsap.fromTo(appRoot, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' }); isTransitioning = false; return; }

    gsap.to(appRoot, {
      opacity: 0, y: 20, duration: 0.3, ease: 'power2.inOut',
      onComplete: () => {
        swapAndInitialize();
        gsap.set(appRoot, { opacity: 0, y: -20 });
        gsap.to(appRoot, { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out', clearProps: 'transform', onComplete: () => { isTransitioning = false; }});
      }
    });
  }

  function navigate(url) { if (!url) return; if (url.startsWith('#') && !url.startsWith('#/')) { if (currentRoute !== '/') { transitionToRoute('/'); setTimeout(() => { const t = document.querySelector(url); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 450); return; } const target = document.querySelector(url); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; } transitionToRoute(url); }

  document.addEventListener('click', (e) => {
    const routeTrigger = e.target.closest('[data-route]');
    if (routeTrigger) { e.preventDefault(); navigate(routeTrigger.getAttribute('data-route')); return; }
    const anchor = e.target.closest('a');
    if (!anchor || anchor.target === '_blank' || anchor.getAttribute('href').startsWith('http')) return;
    e.preventDefault(); navigate(anchor.getAttribute('href'));
  });

  window.addEventListener('popstate', () => { const route = getCurrentRouteFromBrowser(); if (normalizeRoute(route) !== currentRoute) transitionToRoute(route, false); });
  window.addEventListener('hashchange', () => { const route = getCurrentRouteFromBrowser(); if (normalizeRoute(route) !== currentRoute) transitionToRoute(route, false); });
  window.addEventListener('storage', (e) => { if (e.key === 'portfolio_site_data') { if (currentRoute === '/') populatePortfolioContent(); else if (currentRoute === '/admin' && !isDirty) { adminData = getSiteData(); populatePersonalInfo(); } } });
  window.addEventListener('portfolio-data-updated', () => { if (currentRoute === '/') populatePortfolioContent(); });

  const preloader = document.getElementById('preloader');
  const preloaderCounter = document.getElementById('preloader-counter');
  const preloaderFill = document.getElementById('preloader-fill');
  let preloaderProgress = 0;

  function runColdStartPreloader(onComplete) {
    if (!preloader) { if (onComplete) onComplete(); return; }
    const data = getSiteData();
    const preloaderName = document.getElementById('preloader-name');
    if (preloaderName && data.profile && data.profile.name) {
      preloaderName.innerHTML = data.profile.name.toUpperCase().split('').map((ch, i) => `<span style="animation-delay:${i * 0.05}s">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
    }
    const interval = setInterval(() => {
      preloaderProgress += Math.random() * 14;
      if (preloaderProgress >= 100) {
        preloaderProgress = 100;
        if (preloaderCounter) preloaderCounter.textContent = '100%';
        if (preloaderFill) preloaderFill.style.width = '100%';
        clearInterval(interval);
        setTimeout(() => { preloader.classList.add('is-hidden'); hasPreloaded = true; if (onComplete) onComplete(); }, 550);
      } else {
        if (preloaderCounter) preloaderCounter.textContent = Math.floor(preloaderProgress) + '%';
        if (preloaderFill) preloaderFill.style.width = Math.floor(preloaderProgress) + '%';
      }
    }, 60);
  }

  const cursor = document.getElementById('cursor'), cursorDot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, dotX = 0, dotY = 0;

  function initCursor() {
    if (!cursor) return;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; if (!document.body.classList.contains('cursor-ready')) { document.body.classList.add('cursor-ready'); cursorX = dotX = mouseX; cursorY = dotY = mouseY; } });
    bindCursorHovers();
    function animateCursor() {
      cursorX = lerp(cursorX, mouseX, 0.12); cursorY = lerp(cursorY, mouseY, 0.12);
      dotX = lerp(dotX, mouseX, 0.6); dotY = lerp(dotY, mouseY, 0.6);
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      if (cursorDot) cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  function bindCursorHovers() {
    if (!cursor) return;
    document.querySelectorAll('[data-hover]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add(el.getAttribute('data-hover') === 'project' ? 'is-hovering-project' : 'is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering', 'is-hovering-project'));
    });
  }

  function bootApplication() {
    initCursor();
    if (getCurrentRouteFromBrowser() === '/admin') {
      if (preloader) preloader.classList.add('is-hidden');
      hasPreloaded = true; transitionToRoute('/admin', false);
    } else {
      transitionToRoute('/', false); runColdStartPreloader(triggerHeroReveal);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootApplication);
  else bootApplication();

  window.PortfolioRouter = { navigate, getCurrentRoute: () => currentRoute };
})();
/* =========================================================
   admin.js — Portfolio CMS Studio Logic
   Dynamic Form UI, Project Manager CRUD, Metrics Manager,
   Image-to-Base64 Upload, LocalStorage Persistence & Live Sync
   ========================================================= */

(function () {
  'use strict';

  let siteData = getSiteData();
  let isDirty = false;

  /* =========================================================
     SIDEBAR & NAVIGATION
     ========================================================= */
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
  const adminSections = document.querySelectorAll('.admin-section');
  const topbarTitle = document.getElementById('topbar-title');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const syncStatus = document.getElementById('sync-status');
  const unsavedBar = document.getElementById('unsaved-bar');

  function navigateTo(sectionId) {
    sidebarLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.section === sectionId);
    });

    adminSections.forEach((sec) => {
      sec.classList.toggle('is-active', sec.id === `sec-${sectionId}`);
    });

    const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
    if (activeLink) {
      topbarTitle.textContent = activeLink.textContent.trim();
    }

    if (sidebar) sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => navigateTo(link.dataset.section));
  });

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.goto));
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
      sidebarOverlay.classList.toggle('is-visible');
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      sidebarOverlay.classList.remove('is-visible');
    });
  }

  /* =========================================================
     DIRTY STATE & TOASTS
     ========================================================= */
  function markDirty() {
    if (!isDirty) {
      isDirty = true;
      if (syncStatus) syncStatus.classList.add('is-dirty');
      if (unsavedBar) unsavedBar.classList.add('is-visible');
      const statusText = syncStatus ? syncStatus.querySelector('.status-text') : null;
      if (statusText) statusText.textContent = 'Unsaved changes';
    }
  }

  function clearDirty() {
    isDirty = false;
    if (syncStatus) syncStatus.classList.remove('is-dirty');
    if (unsavedBar) unsavedBar.classList.remove('is-visible');
    const statusText = syncStatus ? syncStatus.querySelector('.status-text') : null;
    if (statusText) statusText.textContent = 'All changes synced';
  }

  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout;

  function showToast(message, isError = false) {
    clearTimeout(toastTimeout);
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.classList.add('is-visible');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  /* =========================================================
     IMAGE TO BASE64 UPLOADER
     ========================================================= */
  function handleImageUpload(fileInput, onComplete) {
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

  // Portrait upload binder
  const portraitFileInput = document.getElementById('f-portrait-file');
  const portraitSrcInput = document.getElementById('f-portrait-src');
  const portraitPreview = document.getElementById('portrait-preview');

  if (portraitFileInput) {
    handleImageUpload(portraitFileInput, (dataUrl) => {
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

  /* =========================================================
     POPULATE PERSONAL INFO & HERO & ABOUT
     ========================================================= */
  function populatePersonalInfo() {
    const p = siteData.profile || {};
    const h = siteData.hero || {};
    const a = siteData.about || {};
    const s = siteData.seo || {};
    const f = siteData.footer || {};

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
    if (portraitPreview && p.portraitSrc) {
      portraitPreview.src = p.portraitSrc;
    }

    setVal('f-copyright', f.copyright || '');
    setVal('f-seo-title', s.title || '');
    setVal('f-seo-desc', s.description || '');

    // Overview counters
    const dashProjects = document.getElementById('dash-projects');
    if (dashProjects) dashProjects.textContent = siteData.projects ? siteData.projects.length : 0;
    const dashMetrics = document.getElementById('dash-metrics');
    if (dashMetrics) dashMetrics.textContent = siteData.metrics ? siteData.metrics.length : 0;
    const dashServices = document.getElementById('dash-services');
    if (dashServices) dashServices.textContent = siteData.services ? siteData.services.length : 0;
    const dashOwner = document.getElementById('dash-owner');
    if (dashOwner) dashOwner.textContent = p.firstName || p.name || 'Owner';
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* =========================================================
     METRICS MANAGER (Dynamic Cards)
     ========================================================= */
  const metricsContainer = document.getElementById('metrics-editor-container');
  const addMetricBtn = document.getElementById('btn-add-metric');

  function renderMetricsEditor() {
    if (!metricsContainer) return;
    if (!siteData.metrics) siteData.metrics = [];

    metricsContainer.innerHTML = siteData.metrics
      .map((m, i) => `
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
      </div>
    `).join('');

    // Bind change events
    metricsContainer.querySelectorAll('.input').forEach((input) => {
      input.addEventListener('input', markDirty);
    });

    metricsContainer.querySelectorAll('.btn-del-metric').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (confirm('Delete this metric?')) {
          collectMetricsFromDOM();
          siteData.metrics.splice(idx, 1);
          renderMetricsEditor();
          markDirty();
        }
      });
    });
  }

  function collectMetricsFromDOM() {
    if (!metricsContainer) return;
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
    siteData.metrics = updated;
  }

  if (addMetricBtn) {
    addMetricBtn.addEventListener('click', () => {
      collectMetricsFromDOM();
      siteData.metrics.push({
        count: 10,
        suffix: '+',
        label: 'New Statistic',
      });
      renderMetricsEditor();
      markDirty();
      // Scroll to newly added metric
      const last = metricsContainer.lastElementChild;
      if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* =========================================================
     PROJECT MANAGER (Dynamic CMS List)
     ========================================================= */
  const projectsContainer = document.getElementById('projects-editor-container');
  const addProjectBtn = document.getElementById('btn-add-project');
  const addProjectTopBtn = document.getElementById('btn-add-project-top');

  function renderProjectsEditor() {
    if (!projectsContainer) return;
    if (!siteData.projects) siteData.projects = [];

    projectsContainer.innerHTML = siteData.projects
      .map((p, i) => {
        const techStackString = Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || '');
        const tagsString = Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '');
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
        </div>
        `;
      })
      .join('');

    // Bind file upload inputs
    projectsContainer.querySelectorAll('.p-field-file').forEach((fileInput) => {
      const idx = fileInput.dataset.index;
      handleImageUpload(fileInput, (dataUrl) => {
        const card = projectsContainer.querySelector(`.project-card-item[data-index="${idx}"]`);
        if (card) {
          const imgInput = card.querySelector('.p-field-image');
          if (imgInput) imgInput.value = dataUrl;
          const thumb = card.querySelector('.project-thumb-preview');
          if (thumb) thumb.src = dataUrl;
        }
      });
    });

    // Bind image text input live preview
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

    // Bind title input live update
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

    // Mark dirty on any text input
    projectsContainer.querySelectorAll('.input, .textarea').forEach((el) => {
      el.addEventListener('input', markDirty);
    });

    // Bind delete project
    projectsContainer.querySelectorAll('.btn-del-project').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        const pName = siteData.projects[idx] ? siteData.projects[idx].name : 'this project';
        if (confirm(`Are you sure you want to delete "${pName}"?`)) {
          collectProjectsFromDOM();
          siteData.projects.splice(idx, 1);
          renderProjectsEditor();
          markDirty();
          showToast(`Deleted "${pName}"`);
        }
      });
    });
  }

  function collectProjectsFromDOM() {
    if (!projectsContainer) return;
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

    siteData.projects = updated;
  }

  function createNewProject() {
    collectProjectsFromDOM();
    const newIdx = siteData.projects.length + 1;
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

    siteData.projects.push(newProject);
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
  }

  if (addProjectBtn) addProjectBtn.addEventListener('click', createNewProject);
  if (addProjectTopBtn) addProjectTopBtn.addEventListener('click', createNewProject);

  /* =========================================================
     SERVICES MANAGER
     ========================================================= */
  const servicesContainer = document.getElementById('services-editor-container');

  function renderServicesEditor() {
    if (!servicesContainer) return;
    if (!siteData.services) siteData.services = [];

    servicesContainer.innerHTML = siteData.services
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
    if (!servicesContainer) return;
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

    siteData.services = updated;
  }

  /* =========================================================
     SOCIALS MANAGER
     ========================================================= */
  const socialsContainer = document.getElementById('socials-editor-container');
  const addSocialBtn = document.getElementById('btn-add-social');

  function renderSocialsEditor() {
    if (!socialsContainer) return;
    if (!siteData.socials) siteData.socials = [];

    socialsContainer.innerHTML = siteData.socials
      .map((s, i) => `
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
      </div>
    `).join('');

    socialsContainer.querySelectorAll('.input').forEach((el) => {
      el.addEventListener('input', markDirty);
    });

    socialsContainer.querySelectorAll('.btn-del-social').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        collectSocialsFromDOM();
        siteData.socials.splice(idx, 1);
        renderSocialsEditor();
        markDirty();
      });
    });
  }

  function collectSocialsFromDOM() {
    if (!socialsContainer) return;
    const rows = socialsContainer.querySelectorAll('.form-grid');
    const updated = [];
    rows.forEach((row) => {
      const name = row.querySelector('.soc-name')?.value.trim();
      const url = row.querySelector('.soc-url')?.value.trim();
      if (name) updated.push({ name, url: url || '#' });
    });
    siteData.socials = updated;
  }

  if (addSocialBtn) {
    addSocialBtn.addEventListener('click', () => {
      collectSocialsFromDOM();
      siteData.socials.push({ name: 'Platform', url: 'https://' });
      renderSocialsEditor();
      markDirty();
    });
  }

  /* =========================================================
     SAVE ALL DATA
     ========================================================= */
  function saveAllChanges() {
    // 1. Collect Personal Info
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

    // First name derivation
    const firstName = fullName.split(' ')[0] || fullName;

    siteData.profile = {
      ...(siteData.profile || {}),
      name: fullName,
      firstName,
      headline: roleHeadline,
      email,
      badge,
      portraitSrc,
      portraitAlt,
    };

    siteData.hero = {
      ...(siteData.hero || {}),
      eyebrow: roleHeadline,
      titleLine1: heroTitle,
      subtitle: heroSubtitle,
    };

    siteData.about = {
      ...(siteData.about || {}),
      headlineHTML: aboutHeadline,
      text1: aboutText1,
      text2: aboutText2,
    };

    siteData.footer = {
      copyright,
    };

    siteData.seo = {
      title: seoTitle,
      description: seoDesc,
    };

    // 2. Collect Metrics
    collectMetricsFromDOM();

    // 3. Collect Projects
    collectProjectsFromDOM();

    // 4. Collect Services
    collectServicesFromDOM();

    // 5. Collect Socials
    collectSocialsFromDOM();

    // 6. Save to storage
    const success = saveSiteData(siteData);
    if (success) {
      clearDirty();
      showToast('Changes saved successfully! Synced across your portfolio.');
      populatePersonalInfo();
    } else {
      showToast('Error saving changes. Storage quota may be exceeded.', true);
    }
  }

  // Bind Save Buttons
  document.querySelectorAll('[data-save], #btn-save-all, #btn-floating-save').forEach((btn) => {
    btn.addEventListener('click', saveAllChanges);
  });

  // Global Ctrl+S shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveAllChanges();
    }
  });

  // Discard changes
  const discardBtn = document.getElementById('btn-discard-changes');
  if (discardBtn) {
    discardBtn.addEventListener('click', () => {
      if (confirm('Discard all unsaved changes and reload?')) {
        siteData = getSiteData();
        initAll();
        clearDirty();
        showToast('Changes discarded');
      }
    });
  }

  // Factory Reset
  const resetBtn = document.getElementById('btn-reset');
  const resetConfirmBtn = document.getElementById('btn-reset-confirm');

  function handleReset() {
    if (confirm('Are you sure you want to reset all data to original defaults? All customized content will be lost.')) {
      siteData = resetSiteData();
      initAll();
      clearDirty();
      showToast('All portfolio content reset to defaults');
    }
  }

  if (resetBtn) resetBtn.addEventListener('click', handleReset);
  if (resetConfirmBtn) resetConfirmBtn.addEventListener('click', handleReset);

  // Track any input across Personal Info & SEO
  document.querySelectorAll('#sec-profile input, #sec-profile textarea, #sec-seo input, #sec-seo textarea, #sec-socials input').forEach((el) => {
    el.addEventListener('input', markDirty);
  });

  /* =========================================================
     ESCAPE UTILITIES
     ========================================================= */
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
     INIT ALL
     ========================================================= */
  function initAll() {
    populatePersonalInfo();
    renderMetricsEditor();
    renderProjectsEditor();
    renderServicesEditor();
    renderSocialsEditor();
  }

  initAll();

})();

// Yash Paradkar Single-Page Smooth Scrolling & Interactive Systems
window.openProjectModal = window.openProjectModal || function() {};
window.closeProjectModal = window.closeProjectModal || function() {};
window.copyModalCred = window.copyModalCred || function() {};

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar-wrapper');
  const sections = document.querySelectorAll('.portfolio-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // 1. Navbar Scroll Shrink & Active Section Highlighting
  function updateActiveNavOnScroll() {
    const scrollPos = window.scrollY + 120;

    // Toggle Scrolled Glass Background Class
    if (window.scrollY > 30) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }

    // Determine current active section
    let currentSectionId = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    // Update Desktop Nav
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Drawer Nav
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
  updateActiveNavOnScroll();

  // 2. Smooth Click Scrolling for Nav Links & Drawer Auto-Close
  function handleNavClick(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
      }
      if (mobileToggleBtn) {
        mobileToggleBtn.classList.remove('open');
      }
    }
  }

  navLinks.forEach(link => link.addEventListener('click', handleNavClick));
  mobileLinks.forEach(link => link.addEventListener('click', handleNavClick));

  // 3. Mobile Toggle Drawer
  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('open');
      mobileToggleBtn.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggleBtn.classList.remove('open');
      }
    });
  }

  // 4. Work Section Filter Pills
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('.work-large-card, .work-medium-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      filterCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4b. Skills Section Filter Tabs
  const skFilterBtns = document.querySelectorAll('.sk-filter-btn');
  const skCategoryCards = document.querySelectorAll('.skill-category-card');

  skFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-skfilter');
      skCategoryCards.forEach(card => {
        const cat = card.getAttribute('data-skcategory');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Project Modal Handler
  const projectModalData = {
    'jewel-bot': {
      title: 'Jewel Bot — AI-Powered Jewellery Assistant',
      tag: 'AI / E-Commerce / Full-Stack',
      image: 'portfolio-asset-pack/projects/jewel-bot-project-preview.png',
      liveUrl: 'https://jewel-bota.vercel.app/',
      description: 'Jewel Bot is a specialized conversational AI assistant and visual discovery platform tailored for luxury jewelry retail. It matches user aesthetic preferences with product catalogs in real-time.',
      features: [
        'Natural Language semantic jewelry recommendation engine',
        'Visual interactive catalog with metal, carat & gemstone filters',
        'Integrated product enquiry and admin catalog dashboard',
        'High-performance responsive UI optimized for conversion'
      ],
      credentials: {
        badge: "Owner's Vault — Demo Access",
        note: "Visitors can use these owner credentials to log in on the live site and unlock the protected Owner's Vault & admin controls:",
        email: 'yashparadkar4@gmail.com',
        password: '1234567'
      }
    },
    'bt-templates': {
      title: 'BT Templates — Modern Website Templates & Design Library',
      tag: 'Web Platform / UI/UX / Template Marketplace',
      image: 'portfolio-asset-pack/projects/ChatGPT Image Sep 30, 2026, 03_05_17 PM-2.png',
      liveUrl: 'https://bt-templates.vercel.app/',
      description: 'A curated marketplace and responsive UI library featuring production-ready templates for SaaS dashboards, agency landing pages, and modern digital storefronts.',
      features: [
        'Live interactive template previews with multi-viewport toggles',
        'Categorized library: SaaS dashboards, agency portfolios & e-commerce',
        'Real-time search bar & instant design asset download bundles',
        'Engineered with modern responsive layouts and fluid interactions'
      ]
    },
    'rajwadi': {
      title: 'Rajwadi — Luxury Ethnic Fashion E-Commerce Storefront',
      tag: 'E-Commerce / Traditional Fashion / Luxury Retail',
      image: 'portfolio-asset-pack/projects/ChatGPT Image Sep 30, 2026, 03_05_18 PM-3.png',
      liveUrl: 'https://www.rajwadirajputiposhak.com/',
      description: 'An elegant ethnic wear e-commerce experience celebrating heritage fashion. Features artisanal showcases for Sarees, Lehengas, Men’s Royal Attire, and luxury accessories.',
      features: [
        'Immersive high-resolution fabric lookbooks and zoom inspections',
        'Curated collection filtering for bridal, occasion & festive wear',
        'Seamless bag, wishlist, and bespoke size customizer workflows',
        'Mobile-first responsive storefront optimized for ultra-fast load times'
      ]
    }
  };

  const modal = document.getElementById('projectDetailModal');
  const modalBody = document.getElementById('modalDynamicBody');

  // ponytail: minimal clipboard copy with execCommand fallback for local file:// previews
  function copyModalCred(text, btn) {
    const applySuccess = () => {
      const orig = btn.innerText;
      btn.innerText = 'Copied! ✓';
      btn.style.background = '#C1502E';
      btn.style.color = '#FFFFFF';
      setTimeout(() => {
        btn.innerText = orig;
        btn.style.background = 'rgba(193, 80, 46, 0.08)';
        btn.style.color = '#C1502E';
      }, 1600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(applySuccess).catch(() => {
        fallbackCopy(text, applySuccess);
      });
    } else {
      fallbackCopy(text, applySuccess);
    }
  }

  function fallbackCopy(text, cb) {
    const el = document.createElement('input');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(el);
    cb();
  }

  window.copyModalCred = copyModalCred;

  function openProjectModal(key) {
    const data = projectModalData[key];
    if (!data || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div style="width: 100%; height: 280px; overflow: hidden; background: #FAF7F2; border-bottom: 1px solid #E3DDD3; position: relative;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
        ${data.credentials ? `
          <div style="position: absolute; bottom: 14px; left: 16px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border: 1px solid rgba(193, 80, 46, 0.35); padding: 5px 12px; border-radius: 20px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #C1502E; box-shadow: 0 0 8px rgba(193, 80, 46, 0.5);"></span>
            <span style="font-family: var(--font-mono); font-size: 11px; color: #C1502E; font-weight: 700; letter-spacing: 0.5px;">Owner Vault Demo Access</span>
          </div>
        ` : ''}
      </div>
      <div style="padding: 24px 28px 30px;">
        <span style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; color: #C1502E; font-weight: 700; text-transform: uppercase;">${data.tag}</span>
        <h2 style="font-size: 24px; font-weight: 800; color: #18181A; margin: 6px 0 12px;">${data.title}</h2>
        <p style="color: #55504A; font-size: 14.5px; line-height: 1.6; margin-bottom: 20px;">${data.description}</p>
        
        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 13px; text-transform: uppercase; color: #7D776F; margin-bottom: 8px; letter-spacing: 1px; font-family: var(--font-mono);">Key Capabilities</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; padding: 0; margin: 0;">
            ${data.features.map(f => `<li style="font-size: 13.5px; color: #55504A; display: flex; align-items: center; gap: 8px;"><span style="color: #C1502E; font-weight: bold;">✓</span> ${f}</li>`).join('')}
          </ul>
        </div>

        ${data.credentials ? `
          <div style="margin: 20px 0 24px; background: #FAF7F2; border: 1px solid rgba(193, 80, 46, 0.25); border-radius: 12px; padding: 18px 20px; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 15px;">🔐</span>
                <span style="font-family: var(--font-mono); font-size: 11.5px; text-transform: uppercase; letter-spacing: 1.2px; color: #C1502E; font-weight: 700;">${data.credentials.badge}</span>
              </div>
              <span style="font-size: 11px; color: #7D776F; font-family: var(--font-mono); background: #FFFFFF; border: 1px solid #E3DDD3; padding: 3px 8px; border-radius: 4px;">Public Demo Role</span>
            </div>
            <p style="font-size: 13px; color: #55504A; margin: 0 0 14px; line-height: 1.5;">${data.credentials.note}</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px;">
              <div style="background: #FFFFFF; border: 1px solid #E3DDD3; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="overflow: hidden;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #7D776F; font-family: var(--font-mono); letter-spacing: 0.8px; margin-bottom: 2px;">Email (Owner Login)</div>
                  <div style="font-size: 13px; color: #18181A; font-weight: 600; font-family: var(--font-mono); word-break: break-all;">${data.credentials.email}</div>
                </div>
                <button type="button" onclick="copyModalCred('${data.credentials.email}', this)" style="background: rgba(193, 80, 46, 0.08); border: 1px solid rgba(193, 80, 46, 0.35); color: #C1502E; font-size: 11px; font-weight: 600; font-family: var(--font-mono); padding: 5px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s; white-space: nowrap;">Copy</button>
              </div>

              <div style="background: #FFFFFF; border: 1px solid #E3DDD3; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="overflow: hidden;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #7D776F; font-family: var(--font-mono); letter-spacing: 0.8px; margin-bottom: 2px;">Password</div>
                  <div style="font-size: 13px; color: #18181A; font-weight: 600; font-family: var(--font-mono); letter-spacing: 1px;">${data.credentials.password}</div>
                </div>
                <button type="button" onclick="copyModalCred('${data.credentials.password}', this)" style="background: rgba(193, 80, 46, 0.08); border: 1px solid rgba(193, 80, 46, 0.35); color: #C1502E; font-size: 11px; font-weight: 600; font-family: var(--font-mono); padding: 5px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s; white-space: nowrap;">Copy</button>
              </div>
            </div>
            <div style="margin-top: 12px; font-size: 11.5px; color: #7D776F; display: flex; align-items: center; gap: 6px;">
              <span style="color: #C1502E;">💡</span> Click <strong>Visit Live Website ↗</strong> below, go to Login, and use these credentials to access the Owner's Vault.
            </div>
          </div>
        ` : ''}

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">Visit Live Website ↗</a>
          <a href="#contact" class="btn-secondary" onclick="closeProjectModal()">Discuss Similar Project ↗</a>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.openProjectModal = openProjectModal;
  window.closeProjectModal = closeProjectModal;

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
});

// Contact Form Submit Handler
function handleContactSubmit() {
  const successBanner = document.getElementById('contactFormSuccess');
  const form = document.getElementById('portfolioContactForm');
  if (successBanner) {
    successBanner.style.display = 'block';
    if (form) form.reset();
    setTimeout(() => {
      successBanner.style.display = 'none';
    }, 5000);
  }
}

// =============================================================
// SCROLL REVEAL — IntersectionObserver (no library)
// =============================================================
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

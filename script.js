(() => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('#mobileNav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const mobileLinks = Array.from(document.querySelectorAll('.mobile-nav-link'));

  function setMobileOpen(open) {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileNav.classList.toggle('open', open);
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      setMobileOpen(open);
    });
  }

  for (const link of mobileLinks) {
    link.addEventListener('click', () => setMobileOpen(false));
  }

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (!mobileNav || !menuBtn) return;
    const target = e.target;
    const clickedInside = mobileNav.contains(target) || menuBtn.contains(target);
    if (!clickedInside) setMobileOpen(false);
  });

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        }
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Active section highlighting
  const sectionIds = ['about', 'skills', 'projects', 'certifications', 'contact'];
  const sectionEls = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function activate(id) {
    navLinks.forEach((a) => {
      const match = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', match);
    });
  }

  if ('IntersectionObserver' in window) {
    const secIO = new IntersectionObserver(
      (entries) => {
        // Use the most visible entry
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;
        activate(visible.target.id);
      },
      { threshold: [0.2, 0.35, 0.55] }
    );
    sectionEls.forEach((el) => secIO.observe(el));
  }

  // Smooth scroll for anchor links
  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    if (prefersReduced) {
      target.scrollIntoView();
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    if (document.querySelector(hash)) {
      e.preventDefault();
      smoothScrollTo(hash);
      setMobileOpen(false);
      history.pushState(null, '', hash);
    }
  });

  // Scroll progress bar
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      progress.style.width = `${pct}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // Copy email
  const copyBtns = document.querySelectorAll('.copy-email');
  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  }

  for (const btn of copyBtns) {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email');
      if (!email) return;
      const ok = await copyText(email);
      if (ok) {
        const old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = old), 1400);
      } else {
        // Last resort (works on older browsers)
        window.prompt('Copy email:', email);
      }
    });
  }

  // Open mail fallback button
  const fallbackMail = document.getElementById('fallbackMail');
  if (fallbackMail) {
    fallbackMail.addEventListener('click', () => {
      const email = fallbackMail.getAttribute('data-email') || 'nithishh7639@gmail.com';
      window.location.href = `mailto:${email}`;
    });
  }
})();


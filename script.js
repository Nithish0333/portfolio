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
  const sectionIds = ['about', 'skills', 'projects', 'certifications', 'terminal', 'contact'];
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

  // 3D Tilt Effect for Cards and Panels
  const tiltElements = document.querySelectorAll('.card, .panel');
  
  for (const el of tiltElements) {
    el.addEventListener('mousemove', (e) => {
      if (prefersReduced) return;
      
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((centerX - x) / centerX) * 8;
      
      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }

  // Terminal Commands Handler
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  const commands = {
    help: `Available commands:
• help - Display this message
• whoami - Show profile info  
• skills - List technical skills
• projects - Display projects
• certifications - Show credentials
• contact - Get contact info
• clear - Clear terminal`,

    whoami: `nithish@portfolio:~$ whoami
Backend Developer & Security Specialist
Location: Coimbatore, India
Email: nithishh7639@gmail.com
GitHub: github.com/Nithish033
Expertise: Node.js, Python, Django, Docker, AWS, Security`,

    skills: `nithish@portfolio:~$ skills
[Backend]
  • Node.js / Express
  • Python / Django
  • REST APIs
  • Microservices

[DevOps & Cloud]
  • Docker & Containers
  • AWS Services
  • Nginx Configuration
  • CI/CD Pipelines

[Security]
  • OWASP Top 10
  • Burp Suite
  • Threat Modeling
  • JWT & OAuth
  • SIEM & Logging`,

    projects: `nithish@portfolio:~$ projects
1. DevArena - API + Auth
   Secure backend platform with JWT & OAuth flows
   
2. CookiCrave - Django APIs
   Food discovery system with validation & hardening
   
3. Project Jarvis - Security Automation
   Incident response & monitoring workflows`,

    certifications: `nithish@portfolio:~$ certifications
✓ Python Full Stack Development (Udemy)
  Comprehensive backend & full-stack fundamentals
  
Coming Soon:
• OWASP Security Fundamentals
• AWS Security Specialist
• Certified Ethical Hacker (CEH)`,

    contact: `nithish@portfolio:~$ contact
Email: nithishh7639@gmail.com
GitHub: https://github.com/Nithish033
Discord: Available on request
LinkedIn: Let's connect!
Timezone: IST (UTC+5:30)

Response time: Usually within 24 hours`,

    clear: null
  };

  function addTerminalLine(command, result) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="terminal-prompt">nithish@portfolio:~$</span>
      <span class="terminal-command">${escapeHtml(command)}</span>
    `;
    terminalOutput.appendChild(line);

    if (result) {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'terminal-result';
      resultDiv.textContent = result;
      terminalOutput.appendChild(resultDiv);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  function executeCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    
    if (trimmed === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    const result = commands[trimmed] || `Command not found: ${cmd}\nType 'help' for available commands`;
    addTerminalLine(cmd, result);
  }

  if (terminalInput) {
    terminalInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value;
        if (cmd.trim()) {
          executeCommand(cmd);
          terminalInput.value = '';
        }
      }
    });
  }
})();


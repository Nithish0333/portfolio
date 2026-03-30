const state = {
  auto: true,
  logTimer: null,
  maxLogs: 14,
};

const profile = {
  name: "NITHISH.R",
  role: "Backend Developer & Security",
  location: "Coimbatore, India",
  email: "nithishh7639@gmail.com",
};

const projects = [
  {
    id: "devarena",
    name: "DevArena",
    stamp: "API + Auth",
    desc:
      "A developer-first platform with secure authentication flows and role-based access patterns. Focused on safe request validation and token lifecycle hygiene.",
    tags: ["Node.js", "JWT", "OAuth", "Security Logging"],
    links: [
      { label: "GitHub (add later)", url: "#" },
      { label: "Live demo (add later)", url: "#" },
    ],
  },
  {
    id: "cookicrave",
    name: "CookiCrave",
    stamp: "Performance",
    desc:
      "A fast food discovery and ordering experience. Built with safe request handling, OWASP-oriented validation, and rate-limit thinking to keep endpoints resilient.",
    tags: ["Python", "Django", "OWASP", "Rate Limits"],
    links: [
      { label: "GitHub (add later)", url: "#" },
      { label: "Live demo (add later)", url: "#" },
    ],
  },
  {
    id: "jarvis",
    name: "Project Jarvis",
    stamp: "Automation",
    desc:
      "Security assistant workflows: simulated scanning, alert-friendly output, and incident-focused visibility. Designed for audit-friendly logs and quick triage.",
    tags: ["Docker", "AWS", "SIEM", "Burp Suite"],
    links: [
      { label: "GitHub (add later)", url: "#" },
      { label: "Live demo (add later)", url: "#" },
    ],
  },
];

const skillTags = [
  "Node.js",
  "Python",
  "Django",
  "Docker",
  "AWS",
  "Nginx",
  "OWASP",
  "Burp Suite",
  "SIEM",
];

function $(id) {
  return document.getElementById(id);
}

function formatTime(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function appendLog({ level, message }) {
  const list = $("logList");
  if (!list) return;

  const li = document.createElement("li");
  const lvlClass =
    level === "OK" ? "lvl-ok" : level === "WARN" ? "lvl-warn" : level === "BAD" ? "lvl-bad" : "";

  li.className = lvlClass;
  li.textContent = `[${formatTime(new Date())}] ${level} ${message}`;
  list.prepend(li);

  while (list.children.length > state.maxLogs) {
    list.removeChild(list.lastChild);
  }
}

function setMonitor(value) {
  const bar = $("monitorBarFill");
  if (!bar) return;
  const pct = Math.max(6, Math.min(100, value));
  bar.style.width = `${pct}%`;
}

function simulateRequest() {
  // Security flavored simulation. No real network calls.
  const endpoints = [
    "/api/auth/login",
    "/api/users/me",
    "/api/security/scan",
    "/api/projects/list",
    "/api/telemetry/ingest",
  ];
  const methods = ["POST", "GET"];
  const levels = [
    { level: "OK", weight: 0.7 },
    { level: "WARN", weight: 0.2 },
    { level: "BAD", weight: 0.1 },
  ];

  const pickWeighted = (items) => {
    const sum = items.reduce((a, b) => a + b.weight, 0);
    const r = Math.random() * sum;
    let acc = 0;
    for (const it of items) {
      acc += it.weight;
      if (r <= acc) return it.level;
    }
    return items[0].level;
  };

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const method = methods[Math.floor(Math.random() * methods.length)];
  const level = pickWeighted(levels);
  const latency = Math.floor(18 + Math.random() * 220);
  const status = level === "OK" ? (Math.random() > 0.92 ? 202 : 200) : level === "WARN" ? 429 : 401;

  const msg = `${method} ${endpoint} -> ${status} in ${latency}ms`;
  appendLog({ level, message: msg });
  setMonitor(18 + Math.round(Math.random() * 78));

  if (level === "BAD") {
    appendLog({ level: "WARN", message: "Possible credential reuse detected (simulated)" });
  }
}

function startAutoLogs() {
  if (state.logTimer) return;
  const tick = () => {
    if (!state.auto) return;
    simulateRequest();
  };
  state.logTimer = setInterval(tick, 2600);
  tick();
}

function stopAutoLogs() {
  state.auto = false;
  if (state.logTimer) {
    clearInterval(state.logTimer);
    state.logTimer = null;
  }
}

function toggleAuto(btn) {
  state.auto = !state.auto;
  if (state.auto) {
    btn.textContent = "Auto: ON";
    startAutoLogs();
  } else {
    btn.textContent = "Auto: OFF";
    stopAutoLogs();
  }
}

function initTagCloud() {
  const cloud = $("tagCloud");
  if (!cloud) return;
  cloud.innerHTML = "";
  for (const t of skillTags) {
    const el = document.createElement("span");
    el.className = "tag";
    el.textContent = t;
    cloud.appendChild(el);
  }
}

function modalProjectById(id) {
  return projects.find((p) => p.id === id);
}

function openProjectModal(projectId) {
  const modal = $("projectModal");
  const backdrop = $("modalBackdrop");
  const proj = modalProjectById(projectId);
  if (!modal || !backdrop || !proj) return;

  $("modalProjectTitle").textContent = proj.name;
  $("modalProjectStamp").textContent = proj.stamp;
  $("modalProjectDesc").textContent = proj.desc;

  const tags = $("modalProjectTags");
  tags.innerHTML = "";
  for (const t of proj.tags) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    tags.appendChild(span);
  }

  const links = $("modalProjectLinks");
  links.innerHTML = "";
  for (const l of proj.links) {
    const a = document.createElement("a");
    a.className = "btn btn-ghost";
    a.style.display = "inline-block";
    a.style.textAlign = "center";
    a.href = l.url;
    a.target = l.url.startsWith("http") ? "_blank" : "_self";
    a.rel = "noreferrer noopener";
    a.textContent = l.label;
    if (l.url === "#") {
      a.setAttribute("aria-disabled", "true");
      a.style.opacity = "0.55";
      a.style.pointerEvents = "none";
    }
    links.appendChild(a);
  }

  backdrop.hidden = false;
  modal.hidden = false;
  modal.dataset.open = "true";
}

function closeProjectModal() {
  const modal = $("projectModal");
  const backdrop = $("modalBackdrop");
  if (!modal || !backdrop) return;
  modal.hidden = true;
  backdrop.hidden = true;
  modal.dataset.open = "false";
}

function initProjectModal() {
  const modal = $("projectModal");
  if (!modal) return;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-project]");
    if (btn) {
      const projectId = btn.getAttribute("data-open-project");
      openProjectModal(projectId);
    }
  });

  const closeBtn = $("modalCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeProjectModal());
  }
  const backdrop = $("modalBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => closeProjectModal());
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
}

function printToTerminal(lines) {
  const out = $("terminalOutput");
  if (!out) return;
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines);
  out.textContent = out.textContent + (out.textContent ? "\n" : "") + text;
  // Show the latest output line.
  out.scrollTop = out.scrollHeight;
}

function setTerminalGreeting() {
  const out = $("terminalOutput");
  if (!out) return;
  out.textContent = "";
  printToTerminal([
    "Booting secure shell...",
    `Authorized user: ${profile.name}`,
    `Node: portfolio.local`,
    "Type `help` to see commands.",
  ]);
}

function scrollToProjectsAndOpen(projectNameOrId) {
  const lower = String(projectNameOrId || "").toLowerCase().trim();
  const match = projects.find((p) => p.id === lower || p.name.toLowerCase() === lower);
  if (!match) return;
  const section = document.getElementById("projects");
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  // Small delay so scroll finishes before modal pops.
  setTimeout(() => openProjectModal(match.id), 250);
}

function redirectToPythonFullstackCertificate(openArgs) {
  const a = String(openArgs || "").toLowerCase();
  if (a.includes("python") && (a.includes("full stack") || a.includes("fullstack"))) {
    window.location.href = "./certificates.html#python-fullstack";
    return true;
  }
  return false;
}

function parseTerminalCmd(raw) {
  const input = String(raw || "").trim();
  if (!input) return { output: [], done: true };

  const [cmd, ...rest] = input.split(/\s+/);
  const args = rest.join(" ");

  const cmdLower = cmd.toLowerCase();
  if (cmdLower === "help") {
    return {
      output: [
        "Commands:",
        "- whoami",
        "- ls projects",
        "- skills",
        "- open <ProjectName>",
        "- open python full stack",
        "- clear",
      ],
      done: true,
    };
  }

  if (cmdLower === "whoami") {
    return {
      output: [
        `${profile.name}`,
        `${profile.role}`,
        `Location: ${profile.location}`,
        `Email: ${profile.email}`,
      ],
      done: true,
    };
  }

  if (cmdLower === "skills") {
    return {
      output: ["Skills:", ...skillTags.map((s) => `- ${s}`)],
      done: true,
    };
  }

  if (cmdLower === "clear") {
    return { output: ["[cleared]"], done: true, clear: true };
  }

  if (cmdLower === "ls") {
    if (args.toLowerCase() === "projects") {
      return {
        output: [
          "projects:",
          ...projects.map((p) => `- ${p.name} (${p.stamp})`),
          "Use: open <ProjectName>",
        ],
        done: true,
      };
    }
    return { output: [`ls: unsupported target "${args}" (try: ls projects)`], done: true };
  }

  if (cmdLower === "open") {
    // "open python full stack" redirects to certificate image page.
    if (redirectToPythonFullstackCertificate(args)) {
      return { output: ["Redirecting to Python Full Stack certificate..."], done: true };
    }
    return { output: [`Opening ${args}...`], done: true, open: args };
  }

  if (cmdLower === "api") {
    simulateRequest();
    return { output: ["Simulated API request executed (no real network calls)."], done: true };
  }

  return { output: [`Unknown command: ${cmd}. Type 'help'.`], done: true };
}

function initTerminal() {
  const input = $("terminalInput");
  const runBtn = $("terminalRunBtn");
  if (!input || !runBtn) return;

  setTerminalGreeting();
  input.value = "";
  input.focus();

  const doRun = () => {
    const raw = input.value;
    input.value = "";
    printToTerminal(`$ ${raw}`);
    const res = parseTerminalCmd(raw);
    if (!res) return;

    if (res.clear) {
      const out = $("terminalOutput");
      if (out) out.textContent = "";
      setTerminalGreeting();
      input.focus();
      return;
    }

    if (res.open) {
      scrollToProjectsAndOpen(res.open);
    }

    if (res.output && res.output.length) printToTerminal(res.output);
    input.focus();
  };

  runBtn.addEventListener("click", doRun);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doRun();
  });

  // Cheats buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-terminal-cmd]");
    if (!btn) return;
    const cmd = btn.getAttribute("data-terminal-cmd");
    if (!cmd) return;
    input.value = cmd;
    doRun();
  });
}

function initSecurityBadges() {
  const tooltipMap = {
    jwt: "JWT: token lifecycle, claim hardening, and replay-safe thinking.",
    oauth: "OAuth: scopes, least privilege, and safe redirect handling.",
    encryption: "Encryption: boundaries for data at-rest and in-transit.",
    owasp: "OWASP: input validation and secure defaults.",
    siem: "SIEM: audit-friendly logs and incident-friendly visibility.",
    burp: "Burp Suite: manual testing and workflow improvements.",
  };

  document.addEventListener("click", (e) => {
    const badge = e.target.closest("[data-badge]");
    if (!badge) return;
    const key = badge.getAttribute("data-badge");
    const msg = tooltipMap[key];
    if (!msg) return;
    appendLog({ level: "OK", message: `Badge: ${key} -> ${msg}` });
  });
}

function initContactToast() {
  const toast = $("toast");
  const form = $("contactForm");
  if (!toast || !form) return;

  // Show success toast after Netlify postback.
  const SENT_KEY = "portfolio_contact_sent";
  if (localStorage.getItem(SENT_KEY) === "1") {
    toast.classList.add("is-visible");
    localStorage.removeItem(SENT_KEY);
  }

  form.addEventListener("submit", () => {
    localStorage.setItem(SENT_KEY, "1");
  });
}

function initResumePlaceholder() {
  const btn = $("btnDownloadResume");
  if (!btn) return;
  btn.addEventListener("click", () => {
    appendLog({ level: "WARN", message: "Resume link placeholder: add your PDF URL later." });
  });
}

function initHeroBadgesHover() {
  // Optional future: could show tooltip, but we keep it simple for performance.
}

function initAutoSimulationControls() {
  const simulateOnce = $("btnSimulateOnce");
  const toggleBtn = $("btnToggleAuto");
  if (simulateOnce) simulateOnce.addEventListener("click", () => simulateRequest());
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => toggleAuto(toggleBtn));
  }
  // Start auto after first paint.
  startAutoLogs();
}

document.addEventListener("DOMContentLoaded", () => {
  initTagCloud();
  initProjectModal();
  initTerminal();
  initSecurityBadges();
  initContactToast();
  initResumePlaceholder();
  initAutoSimulationControls();
  initHeroBadgesHover();
});


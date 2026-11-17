/* Visual layer: icon set, hero illustration, section badges, confetti. No dependencies. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const P = {
    spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    brain: '<path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 2.8A3 3 0 005 13a3 3 0 003 4 3 3 0 004 1.5V5.5A3 3 0 009 4z"/><path d="M15 4a3 3 0 013 3 3 3 0 012 2.8A3 3 0 0119 13a3 3 0 01-3 4 3 3 0 01-4 1.5"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    trend: '<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    scale: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 2 4.5 5"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
    building: '<path d="M4 21V5l8-2v18M12 9h8v12M3 21h18"/><path d="M8 8h.01M8 12h.01M8 16h.01M16 13h.01M16 17h.01"/>',
    coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    rocket: '<path d="M12 3c3.5 1.5 6 5 6 9l-3 3H9l-3-3c0-4 2.5-7.5 6-9z"/><circle cx="12" cy="10" r="1.8"/><path d="M9 15l-2.5 3.5M15 15l2.5 3.5M12 17v4"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.5A1.5 1.5 0 005.8 21h12.4a1.5 1.5 0 001.3-2.5L14 9V3"/><path d="M7.5 15h9"/>',
    cloud: '<path d="M7 18a4 4 0 01-.6-8A5.5 5.5 0 0117 8.5 4.8 4.8 0 0117 18z"/>',
    db: '<ellipse cx="12" cy="5.5" rx="7" ry="3"/><path d="M5 5.5v13c0 1.7 3.1 3 7 3s7-1.3 7-3v-13M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    landmark: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M3 10h18"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5M8 7h7"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    doc: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
    puzzle: '<path d="M10 4h4v3a2 2 0 104 0v-0h2v5h-3a2 2 0 100 4h3v4h-5v-3a2 2 0 10-4 0v3H4v-5h3a2 2 0 100-4H4V4h6z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    net: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M11 7l-5 9M13 7l5 9M7.2 18h9.6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5" />',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01"/>',
    bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 005 5L21 13l-8 8-3-3 8-8"/><path d="M14.5 6.5L17 4l3 3-2.5 2.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    pie: '<path d="M12 3v9h9"/><path d="M20.5 15A9 9 0 119 3.5"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H4v2a3 3 0 003 3M16 6h4v2a3 3 0 01-3 3M12 13v4M8 21h8M9.5 17h5"/>',
    flag: '<path d="M5 21V4M5 5h12l-2 4 2 4H5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    hand: '<path d="M7 12V6a1.5 1.5 0 013 0v5M10 11V4.5a1.5 1.5 0 013 0V11M13 11V6a1.5 1.5 0 013 0v7M16 12.5a1.5 1.5 0 013 0V15c0 3.5-2.5 6-6 6h-1.5C8 21 6 19.5 4.7 17.2L3 14a1.5 1.5 0 012.5-1.5L7 14.5"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    cart: '<path d="M3 4h3l2.5 11h10L21 7H7"/><circle cx="10" cy="19" r="1.4"/><circle cx="18" cy="19" r="1.4"/>',
    dot: '<circle cx="12" cy="12" r="3"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    lightbulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    robot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01M9.5 16.5h5M2 13v2M22 13v2"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    wave: '<path d="M3 12h2l2-6 3 12 3-9 2 3h6"/>'
  };
  // option id → icon
  const BY_ID = {
    // stages / lifecycle
    none: "dot", nonai: "dot", dk: "help", dl: "help", exp: "flask", pilot: "rocket", prod: "check", inform: "user", adopt: "trend", scale: "layers",
    // value chain
    invest: "chart", risk: "shield", ops: "gear", client: "users", tech: "chip", alloc: "pie", selection: "search", construct: "puzzle", pm: "chart", analyst: "search", reporting: "doc", sales: "users", compl: "shield", admin: "gear", research: "search", trade: "bolt", exec: "bolt", signals: "wave", forecast: "trend", cov: "calc", edge: "bolt", alpha: "spark", prev: "shield", rev: "coins", cost: "coins", time: "clock", qual: "check", perf: "trend", err: "shield", size: "users",
    // technologies
    ml: "brain", llm: "chat", genai: "spark", nlp: "chat", cv: "eye", rl: "target", ts: "wave", graph: "net", bayes: "calc", rag: "db", agent: "robot", agents: "robot", recsys: "list", synth: "layers", xai: "lightbulb", speech: "mic", regime: "wave", models: "brain", copilot: "robot", expl: "lightbulb", pc: "calc", alt: "globe", acct: "calc", access: "lock",
    // enablers
    sponsor: "flag", strategy: "compass", budget: "coins", data: "db", infra: "cloud", team: "users", talent: "user", champions: "trophy", collab: "link", gov: "landmark", vendor: "hand", oss: "code", comp: "flag", reg: "landmark", org: "building", culture: "users", lead: "flag", partner: "hand", build: "wrench", buy: "cart", hybrid: "puzzle", integr: "link", integrate: "link", decision: "target", decide: "target", efficiency: "bolt", both: "layers", mandate: "landmark", moat: "shield", other: "spark", alld: "check"
  };
  const BY_BLOCK = { q3_unlock: "spark", q2_tech: "brain", q4_notdelivered: "flag", q4_source: "wrench", q7_criteria: "shield", q8_moat: "shield" };

  function svg(name, cls) {
    const el = document.createElementNS(NS, "svg");
    el.setAttribute("viewBox", "0 0 24 24"); el.setAttribute("class", "ico" + (cls ? " " + cls : "")); el.setAttribute("aria-hidden", "true");
    el.innerHTML = P[name] || P.dot; return el;
  }
  function forOption(id, blockKey) { return BY_ID[id] || BY_BLOCK[blockKey] || "spark"; }

  // section icon by screen id
  const BY_SCREEN = { qprog: "rocket", q1: "chip", q2: "brain", q3: "compass", q4a: "trophy", q4b: "gear", q5a: "target", q5: "chart", q6: "scale", q7: "shield", q7b: "hand", q8: "landmark", q9: "lightbulb", q10: "chat" };

  function badge(screenId, secIdx) {
    const d = document.createElement("div");
    d.className = "qbadge"; d.setAttribute("aria-hidden", "true");
    d.append(svg(BY_SCREEN[screenId] || "spark"));
    ["a", "b", "c"].forEach((k) => { const o = document.createElement("i"); o.className = "orb orb-" + k; d.append(o); });
    return d;
  }

  // Intro hero: a candlestick + network drawing that traces itself.
  function hero() {
    const wrap = document.createElement("div"); wrap.className = "hero-art"; wrap.setAttribute("aria-hidden", "true");
    const bars = [[28, 70, 40], [58, 52, 70], [88, 60, 52], [118, 34, 66], [148, 44, 38], [178, 22, 52]];
    let candles = "";
    bars.forEach((b, i) => { candles += `<g class="cndl" style="--d:${0.5 + i * 0.12}s"><path d="M${b[0]} ${b[1] - 10}V${b[1] + b[2] / 2 + 10}"/><rect x="${b[0] - 7}" y="${b[1]}" width="14" height="${b[2] / 2}" rx="3"/></g>`; });
    wrap.innerHTML = `<svg viewBox="0 0 220 150" role="presentation">
      <defs><linearGradient id="hg" x1="0" x2="1"><stop offset="0" stop-color="#5AB0FF"/><stop offset="1" stop-color="#2FD3B5"/></linearGradient></defs>
      <g class="h-grid"><path d="M10 120H210M10 85H210M10 50H210"/></g>
      <g class="h-candles">${candles}</g>
      <path class="h-line" d="M18 112C45 98 62 104 88 82S128 62 150 66 190 30 208 22" pathLength="1"/>
      <g class="h-nodes"><circle cx="88" cy="82" r="4.5"/><circle cx="150" cy="66" r="4.5"/><circle cx="208" cy="22" r="5.5"/></g>
      <g class="h-spark"><path d="M196 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g>
    </svg>`;
    return wrap;
  }

  function confetti(host) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#5AB0FF", "#2FD3B5", "#A78BFA", "#F5B94A", "#E9EFFB"];
    const box = document.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 46; i++) {
      const p = document.createElement("i"), a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 220;
      p.style.cssText = `--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r - 120}px;--rot:${Math.random() * 720 - 360}deg;--c:${colors[i % colors.length]};--w:${6 + Math.random() * 6}px;--t:${1.3 + Math.random() * 0.9}s;--dl:${Math.random() * 0.25}s`;
      if (i % 3 === 0) p.className = "round";
      box.append(p);
    }
    host.append(box); setTimeout(() => box.remove(), 2600);
  }

  window.VIS = { svg, forOption, badge, hero, confetti };
})();

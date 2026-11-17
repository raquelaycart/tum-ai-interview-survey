// ─────────────────────────────────────────────────────────────
//  Survey engine — shared by every theme (editorial / fintech)
// ─────────────────────────────────────────────────────────────
(function () {
  "use strict";
  const S = window.SURVEY, C = window.SURVEY_CONFIG || {};
  const KEY = "tum-ai-survey-v1";
  const SCREENS = S.screens;
  const STEPS = ["intro"].concat(SCREENS.map((s) => s.id), ["done"]);
  const QSCREENS = SCREENS.filter((s) => s.kind !== "profile");
  const $ = (sel) => document.querySelector(sel);

  // ── tiny DOM helper ───────────────────────────────────────
  function h(tag, attrs) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else if (k === "style") e.style.cssText = v;
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (let i = 2; i < arguments.length; i++) append(e, arguments[i]);
    return e;
  }
  function append(e, k) {
    if (k == null || k === false) return;
    if (Array.isArray(k)) return k.forEach((x) => append(e, x));
    e.append(k.nodeType ? k : document.createTextNode(k));
  }

  // ── state ─────────────────────────────────────────────────
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(16).slice(2));
  function fresh() {
    const q = new URLSearchParams(location.search).get("lang");
    const lang = q === "de" || q === "en" ? q : (navigator.language || "en").toLowerCase().startsWith("de") ? "de" : "en";
    return { lang, step: 0, a: {}, consent: false, id: uid(), started: new Date().toISOString(), done: false, followup: null };
  }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.id) return s; } catch (e) {}
    return null;
  }
  let st = load();
  let restored = !!(st && st.step > 0 && !st.done);
  if (!st) st = fresh();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  const tr = (x) => (x == null ? "" : typeof x === "string" ? x : x[st.lang] || x.en || "");
  const ui = (k, vars) => { let s = tr(S.ui[k]); for (const v in vars || {}) s = s.replace("{" + v + "}", vars[v]); return s; };
  const A = (k) => st.a[k];
  const setA = (k, v) => { st.a[k] = v; save(); };
  const cur = () => SCREENS.find((s) => s.id === STEPS[st.step]);

  // ── answers → flat sheet row (always English) ─────────────
  const en = (x) => (typeof x === "string" ? x : x.en);
  function flatten(status) {
    const now = new Date();
    const row = {
      "Submission ID": st.id,
      "Status": status,
      "Started (UTC)": st.started,
      "Updated (UTC)": now.toISOString(),
      "Duration (min)": Math.round((now - new Date(st.started)) / 600) / 100,
      "Language": st.lang.toUpperCase(),
      "Last screen": STEPS[st.step]
    };
    SCREENS.forEach((sc) => sc.blocks.forEach((b) => {
      const a = A(b.key);
      if (b.type === "input" || b.type === "text") row[b.col] = a || "";
      else if (b.type === "toggle") row[b.col] = a ? "Yes" : "No";
      else if (b.type === "scale") row[b.col] = a ? a + " – " + en(b.points[a - 1]) : "";
      else if (b.type === "applist") {
        const al = a || {}, areaEn = (id) => en(b.areas.find((x) => x.id === id).t), roleEn = (id) => (id ? en(b.roles.find((x) => x.id === id).t) : "");
        const dec = (x) => x.role === "decision" || x.role === "both";
        b.lanes.forEach((l) => {
          const list = appsOf(b, l.id), pre = b.col + " · " + en(l.t);
          row[pre + " · applications"] = list.length ? list.map((x) => x.name || "(unnamed)").join("; ") : al.none && al.none[l.id] ? "None" : "";
          row[pre + " · detail"] = list.map((x) => (x.name || "(unnamed)") + " [" + (x.areas || []).map(areaEn).join(", ") + (x.role ? " | " + roleEn(x.role) : "") + "] " + (x.desc || "")).join(" || ");
          row[pre + " · #"] = list.length;
        });
        const prod = appsOf(b, "prod");
        row[b.col + " · # decision-support apps in production"] = prod.filter(dec).length;
        row[b.col + " · % of production apps that support decisions"] = prod.length ? Math.round((100 * prod.filter(dec).length) / prod.length) : "";
      }
      else if (b.type === "matrix") {
        const st_ = (rid) => (a && a[rid]) || "";
        b.groups.forEach((g) => g.rows.forEach((r) => {
          const c = st_(r.id) && b.cols.find((x) => x.id === a[r.id]);
          row[b.col + " → " + en(g.t) + " · " + en(r.t)] = c ? en(c.t) : "";
          if (r.other) row[b.col + " → Other (specify)"] = (a && a._other) || "";
        }));
        if (b.derive) {
          const rows = b.groups.reduce((x, g) => x.concat(g.rows), []);
          const used = rows.filter((r) => ["informal", "exp", "pilot", "prod"].indexOf(st_(r.id)) > -1);
          const prod = rows.filter((r) => st_(r.id) === "prod");
          const decProd = prod.filter((r) => r.tag === "decision");
          row[b.col + " · # activities with any AI"] = used.length;
          row[b.col + " · # in production"] = prod.length;
          row[b.col + " · # decision-support activities in production"] = decProd.length;
          row[b.col + " · % of production activities that are decision support"] = prod.length ? Math.round((100 * decProd.length) / prod.length) : "";
          row[b.col + " · # individual/informal use only"] = rows.filter((r) => st_(r.id) === "informal").length;
        }
      } else if (b.type === "cards") {
        const sel = (a && a.sel) || [];
        row[b.col] = sel.map((id) => {
          const opt = b.options.find((x) => x.id === id);
          return opt.other && a.other ? en(opt.t) + ": " + a.other : en(opt.t);
        }).map((t, i) => (b.rank ? i + 1 + ". " : "") + t).join("; ");
        b.options.filter((x) => x.count).forEach((opt) => {
          const v = a && a.detail && a.detail[opt.id];
          row[b.col + " → " + en(opt.t) + " (# people)"] = sel.indexOf(opt.id) > -1 ? (v === "dk" ? "Don't know" : v || "") : "";
        });
        if (b.detail) b.options.filter((x) => !x.exclusive).forEach((opt) => {
          let v = a && a.detail && a.detail[opt.id];
          if (v && b.detail === "stage") v = en(b.stages.find((x) => x.id === v).t);
          row[b.col + " → " + en(opt.t)] = sel.indexOf(opt.id) > -1 ? v || "" : "";
        });
      }
    }));
    return row;
  }

  // ── answers → readable question/answer list (always English) ─
  function answerOf(b) {
    const a = A(b.key);
    if (b.type === "input" || b.type === "text") return (a || "").trim();
    if (b.type === "toggle") return a ? "Yes" : "No";
    if (b.type === "scale") return a ? a + " – " + en(b.points[a - 1]) : "";
    if (b.type === "cards") {
      const sel = (a && a.sel) || [];
      return sel.map((id, i) => {
        const opt = b.options.find((x) => x.id === id);
        let t = (b.rank ? i + 1 + ". " : "") + en(opt.t);
        const d = a.detail && a.detail[id];
        if (opt.other && a.other) t += ": " + a.other;
        if (opt.count && d) t += d === "dk" ? " (team size: don't know)" : " (" + d + " people)";
        if (b.detail === "stage" && d) t += " — " + en(b.stages.find((x) => x.id === d).t);
        if (b.detail === "note" && d) t += " — " + d;
        return t;
      }).join("\n");
    }
    if (b.type === "matrix") {
      const out = [];
      b.groups.forEach((g) => g.rows.forEach((r) => {
        const c = a && a[r.id] && b.cols.find((x) => x.id === a[r.id]);
        if (c) out.push(en(g.t) + " · " + en(r.t) + ": " + en(c.t));
      }));
      if (a && a._other) out.push("Other: " + a._other);
      return out.join("\n");
    }
    if (b.type === "applist") {
      const al = a || {}, out = [];
      b.lanes.forEach((l) => {
        const list = appsOf(b, l.id);
        if (!list.length) { if (al.none && al.none[l.id]) out.push(en(l.t) + ": none"); return; }
        list.forEach((x, i) => out.push(en(l.t) + " " + (i + 1) + ": " + (x.name || "(unnamed)") +
          " [" + (x.areas || []).map((id) => en(b.areas.find((y) => y.id === id).t)).join(", ") + (x.role ? " | " + en(b.roles.find((y) => y.id === x.role).t) : "") + "]" + (x.desc ? " – " + x.desc : "")));
      });
      return out.join("\n");
    }
    return "";
  }
  function qaPayload(status) {
    const now = new Date(), rows = []; let order = 0;
    SCREENS.forEach((sc) => sc.blocks.forEach((b) => {
      const prof = sc.kind === "profile", m = /^(Q\d+|Closing)\s*·\s*(.*)$/.exec(b.col || "");
      rows.push({
        o: ++order,
        section: prof ? "About you" : sc.closing ? "Closing" : en(S.sections[sc.sec]),
        q: prof ? "–" : sc.closing ? "Closing" : "Q" + sc.num,
        question: prof ? en(sc.title) : en(sc.ask),
        item: m ? m[2] : en(b.label || b.col),
        header: b.col,
        answer: answerOf(b)
      });
    }));
    return {
      "Submission ID": st.id, "Status": status, "Started (UTC)": st.started, "Updated (UTC)": now.toISOString(),
      "Duration (min)": Math.round((now - new Date(st.started)) / 600) / 100, "Language": st.lang.toUpperCase(),
      "Name": A("p_name") || "", "Firm": A("p_firm") || "", "Role": A("p_role") || "", rows
    };
  }

  function appsOf(b, lane) {
    const a = A(b.key) || {};
    return (a[lane] || []).filter((x) => x.name || x.desc || (x.areas && x.areas.length));
  }
  function appRows() {
    const b = SCREENS.find((s) => s.id === "q1").blocks[0], out = [];
    const areaEn = (id) => en(b.areas.find((x) => x.id === id).t);
    b.lanes.forEach((l) => appsOf(b, l.id).forEach((x) => out.push({
      "Submission ID": st.id, "Updated (UTC)": new Date().toISOString(), "Name": A("p_name") || "", "Firm": A("p_firm") || "",
      "Stage": en(l.t), "Application": x.name || "(unnamed)", "Value chain": (x.areas || []).map(areaEn).join("; "),
      "Main role": x.role ? en(b.roles.find((r) => r.id === x.role).t) : "", "How it works": x.desc || ""
    })));
    return out;
  }
  async function postAll(status) {
    await post("response", flatten(status));
    await post("qa", qaPayload(status));
    await post("apps", { "Submission ID": st.id, "Status": status, rows: appRows() });
  }

  let stopActive = null;

  // ── network ───────────────────────────────────────────────
  async function post(type, data) {
    if (!C.ENDPOINT) { console.info("[preview mode] " + type, data); return true; }
    const body = JSON.stringify({ token: C.TOKEN || "", type, data });
    const opts = { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body };
    try {
      const r = await fetch(C.ENDPOINT, Object.assign({ keepalive: body.length < 60000 }, opts));
      const j = await r.json().catch(() => null);
      if (j && j.ok === false) throw new Error(j.error || "rejected");
      return true;
    } catch (e) {
      if (e.name !== "TypeError") throw e;
      // Possibly blocked CORS read although the write may have succeeded; resend (idempotent upsert by Submission ID).
      await fetch(C.ENDPOINT, Object.assign({ mode: "no-cors" }, opts));
      return true;
    }
  }
  const sendPartial = () => { postAll("Partial").catch(() => {}); };

  // ── chrome: progress, nav, language ───────────────────────
  function updateChrome() {
    const id = STEPS[st.step], sc = cur();
    const progress = $("#progress"), navbar = $("#navbar");
    progress.hidden = id === "intro";
    navbar.hidden = !sc;
    const segs = $("#segs"); segs.replaceChildren();
    const total = S.sections.length;
    S.sections.forEach((name, i) => {
      const inSec = QSCREENS.filter((s) => s.sec === i);
      let fill = 0;
      if (id === "done") fill = 1;
      else if (sc && sc.sec != null) {
        if (i < sc.sec) fill = 1;
        else if (i === sc.sec) fill = (inSec.indexOf(sc) + 1) / inSec.length;
      }
      segs.append(h("div", { class: "seg" + (fill === 1 ? " is-full" : "") + (sc && sc.sec === i ? " is-current" : ""), title: tr(name) },
        h("i", { style: "width:" + Math.round(fill * 100) + "%" })));
    });
    let label = "";
    if (id === "done") label = ui("doneEyebrow");
    else if (sc && sc.sec == null) label = ui("before");
    else if (sc) label = ui("sectionOf", { n: sc.sec + 1, t: total }) + " · " + tr(S.sections[sc.sec]);
    $("#plabel").textContent = label;
    document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === st.lang)));
    document.documentElement.lang = st.lang;
    $("#brandSub").textContent = ui("org");
    if (sc) buildNav();
  }

  function screenHasAnswer(sc) {
    return sc.blocks.some((b) => {
      const a = A(b.key);
      if (b.type === "toggle") return false;
      if (b.type === "cards") return a && a.sel && a.sel.length;
      if (b.type === "matrix") return a && Object.keys(a).length;
      if (b.type === "applist") return a && (b.lanes.some((l) => (a[l.id] || []).length) || Object.keys(a.none || {}).some((k) => a.none[k]));
      return !!a;
    });
  }

  function buildNav() {
    const sc = cur(), nav = $("#navbar");
    const last = STEPS[st.step + 1] === "done";
    const qi = QSCREENS.indexOf(sc);
    const hint = sc.kind === "profile" ? ui("optional") : ui("questionOf", { n: qi + 1, t: QSCREENS.length });
    nav.replaceChildren(h("div", { class: "navbar-in" },
      h("button", { type: "button", class: "btn btn--ghost", onclick: back }, "←  " + ui("back")),
      h("span", { class: "nav-hint" }, hint),
      h("button", { type: "button", id: "nextBtn", class: "btn btn--primary", onclick: next }, "")
    ));
    updateNext();
  }
  function updateNext() {
    const btn = $("#nextBtn"); if (!btn) return;
    const sc = cur(), last = STEPS[st.step + 1] === "done";
    const has = screenHasAnswer(sc) || sc.kind === "profile";
    btn.textContent = last ? ui("submit") : (sc.kind !== "profile" && !has ? ui("skip") : ui("cont")) + "  →";
    btn.classList.toggle("is-skip", !last && sc.kind !== "profile" && !has);
  }

  function back() { if (st.step > 0) { st.step--; save(); render(); } }
  async function next() {
    const sc = cur();
    if (STEPS[st.step + 1] === "done") return submit();
    const idx = SCREENS.indexOf(sc), nx = SCREENS[idx + 1];
    const sectionEnd = sc.kind === "profile" || (nx && nx.sec !== sc.sec);
    st.step++; save(); render();
    if (sectionEnd) sendPartial();
  }
  async function submit() {
    const btn = $("#nextBtn"); btn.disabled = true; btn.textContent = ui("sending");
    try {
      await postAll("Complete");
      st.done = true; st.step = STEPS.length - 1; save(); render();
    } catch (e) {
      btn.disabled = false; updateNext();
      toast(ui("errorSend"), [
        [ui("retry"), submit],
        [ui("copyAnswers"), () => navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(flatten("Complete"), null, 2)).then(() => toast(ui("copied")))]
      ]);
    }
  }

  function toast(msg, actions) {
    const t = $("#toast"); t.replaceChildren(h("span", null, msg));
    (actions || []).forEach(([label, fn]) => t.append(h("button", { type: "button", class: "toast-btn", onclick: () => { t.classList.remove("is-on"); fn(); } }, label)));
    t.classList.add("is-on");
    clearTimeout(toast.t); if (!actions) toast.t = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  // ── blocks ────────────────────────────────────────────────
  function blockHead(b) {
    let hint = "";
    if (b.type === "cards") hint = b.single ? ui("oneHint") : b.rank && !b.max ? ui("rankHint") : b.max ? ui("maxHint", { n: b.max }) : ui("anyHint");
    return h("div", { class: "block-head" },
      h("h3", { class: "block-label" }, tr(b.label)),
      b.help && h("p", { class: "block-help" }, tr(b.help)),
      !b.help && hint && b.type === "cards" && !b.compact && h("p", { class: "block-help" }, hint));
  }

  function segmented(options, value, onchange, label) {
    let cur = value;
    const wrap = h("div", { class: "segctl", role: "radiogroup", "aria-label": label });
    const btns = options.map((opt) => {
      const b = h("button", { type: "button", role: "radio", "aria-checked": String(cur === opt.id), class: cur === opt.id ? "is-on" : "", onclick: () => {
        cur = cur === opt.id ? null : opt.id; onchange(cur);
        btns.forEach((x, i) => { const on = options[i].id === cur; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", String(on)); });
      } }, tr(opt.t));
      return b;
    });
    btns.forEach((b) => wrap.append(b));
    return wrap;
  }

  function renderCards(b) {
    const wrap = h("div", { class: "block block--cards" });
    function build() {
      wrap.replaceChildren(blockHead(b));
      const a = A(b.key) || { sel: [], detail: {}, other: "" };
      const grid = h("div", { class: "cards" + (b.single ? " cards--single" : "") + (b.compact ? " cards--compact" : "") + (b.stepper ? " cards--stepper" : ""), role: b.single ? "radiogroup" : "group", "aria-label": tr(b.label) });
      let lastGroup = null;
      b.options.forEach((opt, i) => {
        const idx = a.sel.indexOf(opt.id), on = idx > -1;
        if (opt.group && tr(opt.group) !== lastGroup) { lastGroup = tr(opt.group); grid.append(h("div", { class: "card-group", role: "presentation" }, lastGroup)); }
        grid.append(h("button", {
          type: "button", class: "card" + (on ? " is-on" : ""), role: b.single ? "radio" : "checkbox", "aria-checked": String(on), "data-id": opt.id, style: "--i:" + i,
          onclick: () => toggle(opt)
        },
          h("span", { class: "card-mark", "aria-hidden": "true" }, b.rank && on ? String(idx + 1) : b.stepper ? String(i + 1) : ""),
          window.VIS && !b.noIcon ? h("span", { class: "card-ico", "aria-hidden": "true" }, VIS.svg(VIS.forOption(opt.id, b.key))) : null,
          h("span", { class: "card-body" }, h("span", { class: "card-title" }, tr(opt.t)), opt.d && h("span", { class: "card-desc" }, tr(opt.d)))
        ));
      });
      wrap.append(grid);
      if (b.max && !b.single) wrap.append(h("p", { class: "counter", "aria-live": "polite" }, ui("selectedCount", { n: a.sel.length, m: b.max })));
      if (b.rank && a.sel.length > 1) {
        const mv = (i, d) => { const j = i + d; if (j < 0 || j >= a.sel.length) return; const t = a.sel[i]; a.sel[i] = a.sel[j]; a.sel[j] = t; setA(b.key, a); build(); };
        wrap.append(h("div", { class: "rank-box" },
          h("p", { class: "rank-title" }, ui("rankTitle")),
          h("ol", { class: "rank-list" }, a.sel.map((id, i) => {
            const opt = b.options.find((x) => x.id === id);
            return h("li", { class: "rank-item" },
              h("span", { class: "rank-n" }, String(i + 1)),
              h("span", { class: "rank-t" }, tr(opt.t)),
              h("button", { type: "button", class: "rank-btn", disabled: i === 0, "aria-label": ui("moveUp") + ": " + tr(opt.t), onclick: () => mv(i, -1) }, "↑"),
              h("button", { type: "button", class: "rank-btn", disabled: i === a.sel.length - 1, "aria-label": ui("moveDown") + ": " + tr(opt.t), onclick: () => mv(i, 1) }, "↓"));
          }))));
      }
      const rows = [];
      a.sel.forEach((id) => {
        const opt = b.options.find((x) => x.id === id);
        if (opt.exclusive) return;
        if (b.detail === "stage") rows.push(h("div", { class: "detail-row" }, h("div", { class: "detail-name" }, tr(opt.t)),
          segmented(b.stages, a.detail[id], (v) => { a.detail[id] = v; setA(b.key, a); }, tr(opt.t))));
        if (b.detail === "note" && !opt.other) rows.push(h("label", { class: "detail-row detail-row--note" }, h("span", { class: "detail-name" }, tr(opt.t)),
          h("input", { class: "input", type: "text", value: a.detail[id] || "", placeholder: tr(b.notePh), oninput: (e) => { a.detail[id] = e.target.value; setA(b.key, a); } })));
        if (opt.count) {
          const cur = a.detail[id] || "", dk = cur === "dk";
          const inp = h("input", { class: "input count-input", type: "number", min: "0", inputmode: "numeric", value: dk ? "" : cur, disabled: dk, placeholder: tr(opt.count.ph), "aria-label": tr(opt.count.l), oninput: (e) => { a.detail[id] = e.target.value; setA(b.key, a); } });
          const dkb = h("button", { type: "button", class: "chip-toggle" + (dk ? " is-on" : ""), "aria-pressed": String(dk), onclick: () => { a.detail[id] = dk ? "" : "dk"; setA(b.key, a); build(); } }, tr(opt.count.dk));
          rows.push(h("div", { class: "detail-row detail-row--count" }, h("span", { class: "detail-name" }, tr(opt.count.l)), inp, dkb));
        }
        if (opt.other) rows.push(h("label", { class: "detail-row detail-row--note" }, h("span", { class: "detail-name" }, tr(opt.t)),
          h("input", { class: "input", type: "text", value: a.other || "", placeholder: ui("specify"), oninput: (e) => { a.other = e.target.value; setA(b.key, a); } }),
          b.detail === "stage" ? null : null));
      });
      if (rows.length) wrap.append(h("div", { class: "details" }, rows));
    }
    function toggle(opt) {
      const a = A(b.key) || { sel: [], detail: {}, other: "" };
      const i = a.sel.indexOf(opt.id);
      if (b.single) a.sel = i > -1 ? [] : [opt.id];
      else if (i > -1) a.sel.splice(i, 1);
      else if (opt.exclusive) { a.sel = [opt.id]; a.detail = {}; a.other = ""; }
      else {
        a.sel = a.sel.filter((id) => !b.options.find((x) => x.id === id).exclusive);
        if (b.max && a.sel.length >= b.max) { wrap.classList.remove("shake"); void wrap.offsetWidth; wrap.classList.add("shake"); return; }
        a.sel.push(opt.id);
      }
      setA(b.key, a); build(); updateNext();
      const f = wrap.querySelector('[data-id="' + opt.id + '"]'); if (f) { f.focus({ preventScroll: true }); if (f.classList.contains("is-on")) { f.style.animation = "none"; void f.offsetWidth; f.style.animation = ""; f.classList.add("pop"); } }
    }
    build();
    return wrap;
  }

  function renderMatrix(b) {
    const wrap = h("div", { class: "block block--matrix" + (b.collapsible ? " block--wrapopts" : "") }, blockHead(b));
    const a = A(b.key) || {};
    const vis = b.cols.filter((c) => !c.hidden);
    const defs = vis.filter((c) => c.d);
    if (defs.length) wrap.append(h("dl", { class: "stage-defs" }, defs.map((c) => h("div", null, h("dt", null, tr(c.t)), h("dd", null, tr(c.d))))));
    b.groups.forEach((g, gi) => {
      const body = h("div", { class: "mgroup-body" });
      const refreshers = [];
      let badge, naBtn, headBtn;
      const updateBadge = () => {
        if (!badge) return;
        const na = g.rows.every((r) => a[r.id] === "na");
        const n = g.rows.filter((r) => a[r.id] && a[r.id] !== "none" && a[r.id] !== "na").length;
        badge.textContent = na ? ui("naShort") : n ? ui("inUse", { n }) : "";
        badge.classList.toggle("is-set", na || n > 0);
        naBtn.classList.toggle("is-on", na); naBtn.setAttribute("aria-pressed", String(na));
      };
      g.rows.forEach((r) => {
        const opts = h("div", { class: "mopts", role: "radiogroup", "aria-label": tr(r.t), style: b.collapsible ? null : "grid-template-columns:repeat(" + vis.length + ",1fr)" });
        const other = r.other ? h("input", { class: "input mother", type: "text", placeholder: ui("specify"), "aria-label": tr(r.t) + " – " + ui("specify"), oninput: (e) => { a._other = e.target.value; setA(b.key, a); } }) : null;
        if (other) other.value = a._other || "";
        const btns = vis.map((c, i) => h("button", { type: "button", role: "radio", class: "mopt mopt-" + i + " mo-" + c.id, onclick: () => {
          if (a[r.id] === c.id) delete a[r.id]; else a[r.id] = c.id;
          setA(b.key, a); refresh(); updateBadge(); updateNext();
        } }, tr(c.t)));
        const refresh = () => {
          btns.forEach((x, j) => { const on = a[r.id] === vis[j].id; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", String(on)); });
          if (other) other.hidden = !(a[r.id] && a[r.id] !== "none" && a[r.id] !== "na");
        };
        btns.forEach((x) => opts.append(x));
        refresh(); refreshers.push(refresh);
        body.append(h("div", { class: "mrow" }, h("div", { class: "mname" }, tr(r.t)), opts));
        if (other) body.append(other);
      });
      if (b.collapsible) {
        naBtn = h("button", { type: "button", class: "na-btn", "aria-pressed": "false", onclick: () => {
          const on = g.rows.every((r) => a[r.id] === "na");
          g.rows.forEach((r) => { if (on) delete a[r.id]; else a[r.id] = "na"; });
          setA(b.key, a); refreshers.forEach((f) => f()); updateBadge(); updateNext();
        } }, ui("naBtn"));
        body.prepend(naBtn);
        badge = h("span", { class: "mbadge" });
        body.hidden = gi !== 0;
        headBtn = h("button", { type: "button", class: "mgroup-head", "aria-expanded": String(gi === 0), onclick: () => {
          const open = body.hidden; body.hidden = !open; headBtn.setAttribute("aria-expanded", String(open));
        } }, h("span", { class: "mg-title" }, tr(g.t)), badge, h("span", { class: "mg-chev", "aria-hidden": "true" }, "▾"));
        wrap.append(h("div", { class: "mgroup" }, headBtn, body));
        updateBadge();
      } else {
        wrap.append(h("div", { class: "mgroup-title" }, tr(g.t)), body);
      }
    });
    return wrap;
  }

  function chipRow(options, value, multi, onchange, label) {
    const sel = multi ? value.slice() : [value];
    const wrap = h("div", { class: "chiprow", role: multi ? "group" : "radiogroup", "aria-label": label });
    const btns = options.map((opt) => h("button", { type: "button", role: multi ? "checkbox" : "radio", class: "chipbtn", onclick: () => {
      if (multi) { const i = sel.indexOf(opt.id); if (i > -1) sel.splice(i, 1); else sel.push(opt.id); onchange(sel.slice()); }
      else { sel[0] = sel[0] === opt.id ? null : opt.id; onchange(sel[0]); }
      paint();
    } }, tr(opt.t)));
    const paint = () => btns.forEach((x, i) => { const on = sel.indexOf(options[i].id) > -1; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", String(on)); });
    btns.forEach((x) => wrap.append(x)); paint();
    return wrap;
  }

  function renderApplist(b) {
    const wrap = h("div", { class: "block block--apps" }, blockHead(b));
    const a = A(b.key) || {};
    b.lanes.forEach((l) => { a[l.id] = a[l.id] || []; }); a.none = a.none || {};
    const commit = () => { setA(b.key, a); updateNext(); };
    b.lanes.forEach((l) => wrap.append(lane(l)));
    return wrap;

    function lane(l) {
      const box = h("section", { class: "lane lane--" + l.id });
      function build(focusLast) {
        box.replaceChildren();
        const list = a[l.id], none = !!a.none[l.id];
        box.append(h("div", { class: "lane-head" }, h("h4", { class: "lane-q" }, tr(l.q)), h("p", { class: "lane-def" }, tr(l.d))));
        if (!list.length) box.append(h("button", { type: "button", class: "na-btn" + (none ? " is-on" : ""), "aria-pressed": String(none), onclick: () => { a.none[l.id] = !none; commit(); build(); } }, ui("noneStage")));
        list.forEach((app, i) => box.append(card(list, app, i, build, l)));
        if (list.length < b.max) box.append(h("button", { type: "button", class: "add-app", onclick: () => { list.push({ id: uid(), name: "", areas: [], role: null, desc: "" }); a.none[l.id] = false; commit(); build(true); } }, "+  " + ui(list.length ? "addAnother" : "addApp")));
        if (focusLast) { const cs = box.querySelectorAll(".app-card"); const inp = cs[cs.length - 1].querySelector("input"); inp && inp.focus({ preventScroll: false }); }
      }
      build();
      return box;
    }
    function card(list, app, i, rebuild, l) {
      const f = b.fields;
      const name = h("input", { class: "input", type: "text", id: "an-" + app.id, placeholder: tr(f.name.ph), oninput: (e) => { app.name = e.target.value; commit(); } });
      name.value = app.name || "";
      const desc = h("textarea", { class: "input input--area", rows: 3, id: "ad-" + app.id, placeholder: tr(f.desc.ph), oninput: (e) => { app.desc = e.target.value; grow(e.target); commit(); } });
      desc.value = app.desc || ""; setTimeout(() => grow(desc), 0);
      const field = (lab, hint, ctl, forId) => h("div", { class: "afield" }, h("label", { class: "block-label", for: forId }, tr(lab)), hint && h("span", { class: "block-help" }, tr(hint)), ctl);
      return h("div", { class: "app-card" },
        h("div", { class: "app-head" }, h("span", { class: "app-n" }, ui("appN", { n: i + 1 })),
          h("button", { type: "button", class: "app-remove", "aria-label": ui("removeApp"), onclick: () => { list.splice(i, 1); commit(); rebuild(); } }, "✕")),
        field(f.name.l, null, name, "an-" + app.id),
        field(f.area.l, f.area.h, chipRow(b.areas, app.areas || [], true, (v) => { app.areas = v; commit(); }, tr(f.area.l))),
        field(f.role.l, null, chipRow(b.roles, app.role, false, (v) => { app.role = v; commit(); }, tr(f.role.l))),
        field(f.desc.l, f.desc.h, desc, "ad-" + app.id));
    }
  }

  function renderScale(b) {
    const wrap = h("div", { class: "block block--scale" }, blockHead(b));
    const group = h("div", { class: "scale", role: "radiogroup", "aria-label": tr(b.label) });
    const btns = b.points.map((p, i) => h("button", {
      type: "button", role: "radio", class: "pt" + (A(b.key) === i + 1 ? " is-on" : ""), "aria-checked": String(A(b.key) === i + 1),
      onclick: () => {
        setA(b.key, A(b.key) === i + 1 ? null : i + 1);
        btns.forEach((x, j) => { const on = A(b.key) === j + 1; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", String(on)); });
        updateNext();
      }
    }, h("span", { class: "pt-n" }, String(i + 1)), h("span", { class: "pt-l" }, tr(p))));
    btns.forEach((x) => group.append(x));
    wrap.append(group);
    return wrap;
  }

  function renderText(b) {
    const ta = h("textarea", { class: "input input--area", rows: b.rows || 4, placeholder: tr(b.ph), id: "f-" + b.key, oninput: (e) => { setA(b.key, e.target.value); grow(e.target); updateNext(); } });
    ta.value = A(b.key) || "";
    setTimeout(() => grow(ta), 0);
    return h("div", { class: "block block--text" }, h("label", { class: "block-head", for: "f-" + b.key }, h("span", { class: "block-label" }, tr(b.label)), b.help && h("span", { class: "block-help" }, tr(b.help))), ta);
  }
  function grow(t) { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight + 2, 420) + "px"; }

  function renderInput(b) {
    const inp = h("input", { class: "input", type: "text", id: "f-" + b.key, placeholder: tr(b.ph), autocomplete: b.autocomplete || "off", oninput: (e) => setA(b.key, e.target.value) });
    inp.value = A(b.key) || "";
    return h("div", { class: "block block--input" }, h("label", { class: "block-head", for: "f-" + b.key }, h("span", { class: "block-label" }, tr(b.label))), inp);
  }

  function renderToggle(b) {
    const on = !!A(b.key);
    const btn = h("button", { type: "button", class: "toggle" + (on ? " is-on" : ""), role: "switch", "aria-checked": String(on),
      onclick: () => { const v = !A(b.key); setA(b.key, v); btn.classList.toggle("is-on", v); btn.setAttribute("aria-checked", String(v)); } },
      h("span", { class: "toggle-track" }, h("span", { class: "toggle-knob" })),
      h("span", { class: "toggle-text" }, h("span", { class: "toggle-title" }, tr(b.label)), h("span", { class: "toggle-desc" }, tr(b.desc))));
    return h("div", { class: "block block--toggle" }, btn);
  }

  function renderBlock(b) {
    return ({ cards: renderCards, matrix: renderMatrix, applist: renderApplist, scale: renderScale, text: renderText, input: renderInput, toggle: renderToggle })[b.type](b);
  }

  // ── screens ───────────────────────────────────────────────
  function renderIntro() {
    const go = h("button", { type: "button", class: "btn btn--primary btn--lg", onclick: () => { st.step = 1; save(); render(); } }, ui("begin") + "  →");
    return h("section", { class: "intro" },
      window.VIS ? VIS.hero() : null,
      h("p", { class: "eyebrow" }, ui("introEyebrow")),
      h("h1", { class: "hero-title", tabindex: "-1", "data-focus": "" }, ui("introTitle")),
      h("p", { class: "lead" }, ui("introLead")),
      h("p", { class: "thanks" }, ui("introThanks")),
      h("ul", { class: "meta" }, ["meta1", "meta3"].map((k) => h("li", null, h("span", { class: "meta-dot" }), ui(k)))),
      h("div", { class: "intro-cta" }, go)
    );
  }

  function renderScreen(sc) {
    const root = h("section", { class: "qscreen" });
    if (sc.kind === "profile") {
      root.append(h("p", { class: "eyebrow" }, ui("before") + " · " + ui("optional")), h("h1", { class: "qtitle", tabindex: "-1", "data-focus": "" }, tr(sc.title)), h("p", { class: "lead lead--sm" }, tr(sc.lead)));
    } else {
      const head = h("div", { class: "qhead" },
        h("p", { class: "eyebrow" }, tr(S.sections[sc.sec]) + (sc.optionalQ ? " · " + ui("optional") : "")),
        h("h1", { class: "qtitle", tabindex: "-1", "data-focus": "" }, sc.num ? h("span", { class: "qnum", "aria-hidden": "true" }, "Q" + sc.num + (sc.part ? "·" + sc.part : "")) : null, tr(sc.ask)),
        sc.note ? h("p", { class: "defn" }, tr(sc.note)) : null);
      if (window.VIS) head.append(VIS.badge(sc.id, sc.sec));
      root.dataset.sec = sc.sec;
      root.append(head);
      if (sc.ideas && sc.ideas.length) {
        const panel = h("div", { class: "ideas", id: "ideas-" + sc.id, hidden: true },
          h("p", { class: "ideas-title" }, ui("ideasTitle")),
          h("ul", null, sc.ideas.map((x) => h("li", null, tr(x)))),
          h("p", { class: "ideas-note" }, ui("ideasNote")));
        const btn = h("button", { type: "button", class: "ideas-btn", "aria-expanded": "false", "aria-controls": "ideas-" + sc.id, onclick: () => {
          const open = panel.hidden; panel.hidden = !open; btn.setAttribute("aria-expanded", String(open));
          btn.querySelector(".ideas-label").textContent = open ? ui("hideIdeas") : ui("needIdeas");
        } }, h("span", { class: "ideas-spark", "aria-hidden": "true" }, "✦"), h("span", { class: "ideas-label" }, ui("needIdeas")));
        root.append(btn, panel);
      }
    }
    root.append(h("div", { class: "blocks" }, sc.blocks.map(renderBlock)));
    return root;
  }

  // ── completion ────────────────────────────────────────────
  function summary() {
    const parts = [];
    const cardsOf = (key) => {
      for (const sc of SCREENS) for (const b of sc.blocks) if (b.key === key) return b;
    };
    const b1 = SCREENS.find((s) => s.id === "q1").blocks[0], items = [];
    b1.lanes.forEach((l) => appsOf(b1, l.id).forEach((x) => items.push([x, l])));
    if (items.length) parts.push(h("div", { class: "gl" }, h("h4", null, ui("glanceAreas")),
      h("ul", { class: "gl-list" }, items.slice(0, 6).map(([x, l]) => h("li", null, h("span", null, x.name || "(unnamed)"), h("em", { class: "pill pill--" + l.id }, tr(l.t)))))));
    const tech = A("q2_tech"), b2 = cardsOf("q2_tech");
    if (tech && tech.sel.length) parts.push(h("div", { class: "gl" }, h("h4", null, ui("glanceTech")),
      h("div", { class: "chips" }, tech.sel.map((id) => h("span", { class: "chip" }, tr(b2.options.find((x) => x.id === id).t))))));
    const m = A("q6_matrix"), b6 = SCREENS.find((s) => s.id === "q6").blocks[0];
    if (m && Object.keys(m).length) {
      const counts = b6.cols.map((c) => Object.values(m).filter((v) => v === c.id).length);
      const tot = Math.max(1, counts.reduce((x, y) => x + y, 0));
      parts.push(h("div", { class: "gl gl--wide" }, h("h4", null, ui("glanceLadder")),
        h("div", { class: "ladder-bar", role: "img", "aria-label": b6.cols.map((c, i) => tr(c.t) + " " + counts[i]).join(", ") },
          counts.map((n, i) => n ? h("span", { class: "lb lb-" + i, style: "flex:" + n / tot }, n) : null)),
        h("div", { class: "ladder-key" }, b6.cols.map((c, i) => h("span", { class: "lk lk-" + i }, tr(c.t))))));
    }
    return parts.length ? h("div", { class: "glance" }, h("h3", null, ui("glance")), h("div", { class: "gl-grid" }, parts)) : null;
  }

  function renderDone() {
    const root = h("section", { class: "done" },
      h("div", { class: "done-check", "aria-hidden": "true" }, h("svg", { viewBox: "0 0 52 52", width: "52", height: "52" }, (function () {
        const ns = "http://www.w3.org/2000/svg";
        const c = document.createElementNS(ns, "circle"); c.setAttribute("cx", "26"); c.setAttribute("cy", "26"); c.setAttribute("r", "24"); c.setAttribute("class", "dc-ring");
        return c;
      })())),
      h("p", { class: "eyebrow" }, ui("doneEyebrow")),
      h("h1", { class: "hero-title", tabindex: "-1", "data-focus": "" }, ui("doneTitle")),
      h("p", { class: "lead" }, ui("doneLead")));
    // add the tick path (needs SVG namespace)
    const svg = root.querySelector("svg"), ns = "http://www.w3.org/2000/svg", p = document.createElementNS(ns, "path");
    p.setAttribute("d", "M15 27l8 8 15-17"); p.setAttribute("class", "dc-tick"); svg.append(p);

    if (window.VIS) setTimeout(() => VIS.confetti(root), 350);
    const s = summary(); if (s) root.append(s);

    // follow-up
    const f = st.followup || { results: false, call: false, email: "" };
    const email = h("input", { class: "input", type: "email", id: "fu-email", autocomplete: "email", placeholder: "name@firm.com", value: f.email || "" });
    const emailWrap = h("label", { class: "fu-email", for: "fu-email", hidden: !(f.results || f.call) }, h("span", { class: "block-label" }, ui("emailLabel")), email);
    const mk = (id, key, label) => {
      const c = h("input", { type: "checkbox", id, onchange: (e) => { f[key] = e.target.checked; emailWrap.hidden = !(f.results || f.call); } });
      c.checked = !!f[key];
      return h("label", { class: "check", for: id }, c, h("span", null, label));
    };
    const msg = h("p", { class: "fu-msg", role: "status" }, st.followup && st.followup.sent ? ui("followSent") : "");
    const sendBtn = h("button", { type: "button", class: "btn btn--primary", onclick: async () => {
      if ((f.results || f.call) && !/^\S+@\S+\.\S+$/.test(email.value.trim())) { msg.textContent = ui("fillEmail"); email.focus(); return; }
      f.email = email.value.trim(); sendBtn.disabled = true;
      try {
        const base = flatten("Complete");
        await post("followup", { "Submission ID": st.id, "Updated (UTC)": new Date().toISOString(), "Name": base["Name"], "Firm": base["Firm"], "Email": f.email, "Wants results summary": f.results ? "Yes" : "No", "Open to follow-up call": f.call ? "Yes" : "No" });
        f.sent = true; st.followup = f; save(); msg.textContent = ui("followSent");
      } catch (e) { msg.textContent = ui("errorSend"); }
      sendBtn.disabled = false;
    } }, ui("sendFollow"));
    root.append(h("div", { class: "follow" },
      h("h3", null, ui("followTitle")), h("p", { class: "lead lead--sm" }, ui("followLead")),
      mk("fu-r", "results", ui("wantResults")), mk("fu-c", "call", ui("wantCall")), emailWrap,
      h("div", { class: "fu-row" }, sendBtn, msg)));
    root.append(h("button", { type: "button", class: "linkbtn", onclick: () => { try { localStorage.removeItem(KEY); } catch (e) {} st = fresh(); restored = false; render(); } }, ui("another")));
    return root;
  }

  // ── main render ───────────────────────────────────────────
  function render() {
    if (stopActive) stopActive();
    const stage = $("#stage"); stage.replaceChildren();
    const id = STEPS[st.step];
    const node = id === "intro" ? renderIntro() : id === "done" ? renderDone() : renderScreen(cur());
    node.classList.add("screen"); stage.append(node);
    updateChrome();
    window.scrollTo(0, 0);
    const hd = stage.querySelector("[data-focus]"); if (hd) hd.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { st.lang = b.dataset.lang; save(); const y = window.scrollY; render(); window.scrollTo(0, y); }));
  if (!C.ENDPOINT) { const d = $("#demo"); if (d) { d.hidden = false; d.textContent = ui("demo"); } }
  if (st.done) st.step = STEPS.length - 1;
  render();
  if (restored) toast(ui("restored"), [[ui("startOver"), () => { try { localStorage.removeItem(KEY); } catch (e) {} st = fresh(); restored = false; render(); }]]);
})();

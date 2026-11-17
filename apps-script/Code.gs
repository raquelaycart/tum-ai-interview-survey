/**
 * Google Apps Script — receives survey answers and keeps a clean, readable Google Sheet.
 *
 *   Summary        – ONE page with the results of everyone: respondent index (with links), counts,
 *                    percentages and bars per question, AI applications, open answers
 *   <Firm name>    – ONE page per respondent (tab named after their firm) with every question and
 *                    their answer, in questionnaire order
 *   Follow-ups, Applications, Raw data – technical tabs at the end (grey): contacts, one row per
 *                    AI application, one row per respondent (feeds the Summary)
 * Partial answers arrive after each section and update the same page in place.
 */
const CONFIG = {
  SHEET_ID: "1Sh5-L3JKfxFpu3OaQTchqUt6o40_t6NiYv0FiWJs9CE",  // leave "" if this script is bound to the Sheet
  TOKEN: "",            // must equal TOKEN in config.js (leave "" to disable the check)
  NOTIFY_EMAIL: ""      // e.g. "you@tum.de" → get an email whenever someone completes the survey
};
const T = { SUMMARY: "Summary", APPS: "Applications", FOLLOW: "Follow-ups", RAW: "Raw data" };
const SUPPORT = [T.FOLLOW, T.APPS, T.RAW];
const SEC_COLORS = ["#1A73E8", "#12A38A", "#7C5CFA", "#E8A317"];   // sections 1-4
const INK = "#0B1B33", SOFT = "#EEF3FA", LINE = "#D5DEEC", MUTED = "#5B6B86";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const body = JSON.parse(e.postData.contents);
    if (CONFIG.TOKEN && body.token !== CONFIG.TOKEN) return json_({ ok: false, error: "unauthorized" });
    const ss = CONFIG.SHEET_ID ? SpreadsheetApp.openById(CONFIG.SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    if (body.type === "qa") {
      savePerson_(ss, body.data);
    } else if (body.type === "apps") {
      replaceApps_(ss, body.data);
      refreshSummary_(ss, body.data.Status === "Complete");
    } else if (body.type === "followup") {
      upsert_(ss, T.FOLLOW, body.data);
    } else if (body.type === "audio" || body.type === "audio-delete") {
      // audio recording was removed from the questionnaire - ignore stale clients
    } else {
      const complete = upsert_(ss, T.RAW, body.data);
      if (complete && CONFIG.NOTIFY_EMAIL) notify_(body.data);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return json_({ ok: true, service: "TUM AI survey endpoint" }); }

/* ───────────────────────── One page per respondent ───────────────────────── */
function savePerson_(ss, d) {
  const props = PropertiesService.getScriptProperties();
  const map = JSON.parse(props.getProperty("TABS") || "{}");      // submission id -> { gid, auto }
  const id = d["Submission ID"];
  let entry = map[id], sh = null;
  if (entry) sh = ss.getSheets().filter(function (s) { return s.getSheetId() === entry.gid; })[0] || null;
  const wanted = String(d["Firm"] || d["Name"] || (entry && entry.auto) || "Anonymous " + (Object.keys(map).length + 1)).trim().replace(/[\[\]\*\/\\\?:]/g, "-").slice(0, 60) || "Anonymous";
  if (!sh) {
    sh = ss.insertSheet(uniqueName_(ss, wanted, null), personIndex_(ss));
    entry = map[id] = { gid: sh.getSheetId(), auto: sh.getName() };
  } else if (sh.getName() === entry.auto) {        // follow firm renames unless the user renamed the tab
    const nn = uniqueName_(ss, wanted, sh);
    if (nn !== sh.getName()) { sh.setName(nn); entry.auto = nn; }
  }
  props.setProperty("TABS", JSON.stringify(map));
  renderPerson_(sh, d);
}

function uniqueName_(ss, base, self) {
  let name = base, n = 2;
  const taken = function (nm) { return ss.getSheets().some(function (s) { return s.getName() === nm && (!self || s.getSheetId() !== self.getSheetId()); }); };
  while (taken(name) || SUPPORT.concat([T.SUMMARY]).indexOf(name) > -1) name = base + " (" + n++ + ")";
  return name;
}

function personIndex_(ss) {
  return ss.getSheets().filter(function (s) { return SUPPORT.indexOf(s.getName()) < 0; }).length;
}

function renderPerson_(sh, d) {
  try { sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart(); } catch (e) {}
  sh.clear();
  sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 64); sh.setColumnWidth(2, 300); sh.setColumnWidth(3, 640);
  const rows = [], bg = [], fc = [], fwt = [], kinds = [];
  const W = "#FFFFFF", K = "#000000";
  const secIdx = {}; let nSec = 0;
  const push = function (vals, back, color, weights, kind) { rows.push(vals); bg.push([back, back, back]); fc.push(color); fwt.push(weights); kinds.push(kind); };
  const title = String(d["Firm"] || d["Name"] || "Anonymous");
  push([title, "", ""], INK, [W, W, W], ["bold", "bold", "bold"], "title");
  const meta = [d["Name"], d["Role"], d["Status"] === "Complete" ? "Completed" : "In progress", d["Duration (min)"] ? d["Duration (min)"] + " min" : "", d["Language"], String(d["Updated (UTC)"] || "").slice(0, 16).replace("T", " ") + " UTC"].filter(function (x) { return x; }).join("  ·  ");
  push([meta, "", ""], SOFT, [MUTED, MUTED, MUTED], ["normal", "normal", "normal"], "meta");
  let lastSec = null, lastQ = null;
  d.rows.forEach(function (r) {
    if (r.section !== lastSec) {
      lastSec = r.section; lastQ = null;
      let c;
      if (r.section === "About you") c = "#475569";
      else if (r.section === "Closing") c = SEC_COLORS[3];
      else { if (secIdx[r.section] === undefined) secIdx[r.section] = nSec++; c = SEC_COLORS[Math.min(3, secIdx[r.section])]; }
      push(["", "", ""], W, [K, K, K], ["normal", "normal", "normal"], "gap");
      push([String(r.section).toUpperCase(), "", ""], c, [W, W, W], ["bold", "bold", "bold"], "band");
    }
    if (r.q !== lastQ && r.q !== "–") {
      lastQ = r.q;
      push([r.q, r.question, ""], "#F2F6FC", ["#1A3C6E", MUTED, MUTED], ["bold", "normal", "normal"], "question");
    }
    const empty = r.answer === "";
    push(["", r.item, empty ? "—" : clean_(r.answer)], W, [K, MUTED, empty ? "#B0BBCC" : INK], ["normal", "normal", "bold"], "item");
  });
  const n = rows.length;
  const all = sh.getRange(1, 1, n, 3);
  all.setValues(rows).setBackgrounds(bg).setFontColors(fc).setFontWeights(fwt).setWrap(true).setVerticalAlignment("top").setFontSize(10);
  kinds.forEach(function (k, i) {
    const row = i + 1;
    if (k === "title") { sh.setRowHeight(row, 46); sh.getRange(row, 1, 1, 3).setFontSize(20).setWrap(false).setVerticalAlignment("middle"); }
    else if (k === "meta") { sh.setRowHeight(row, 24); sh.getRange(row, 1, 1, 3).setWrap(false).setVerticalAlignment("middle"); }
    else if (k === "gap") sh.setRowHeight(row, 8);
    else if (k === "band") { sh.setRowHeight(row, 28); sh.getRange(row, 1, 1, 3).setWrap(false).setVerticalAlignment("middle"); }
    else if (k === "question") { sh.getRange(row, 2, 1, 2).merge().setFontStyle("italic"); }
  });
  sh.setFrozenRows(2);
  sh.setTabColor(d["Status"] === "Complete" ? "#12A38A" : "#E8A317");
}

/* ───────────────────────── Applications ───────────────────────── */
function replaceApps_(ss, data) {
  const sh = ss.getSheetByName(T.APPS) || ss.insertSheet(T.APPS);
  const HEAD = ["Submission ID", "Updated (UTC)", "Name", "Firm", "Stage", "Application", "Value chain", "Main role", "How it works"];
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold").setBackground("#E4EDF6");
    sh.setFrozenRows(1);
    [70, 130, 130, 130, 100, 200, 200, 190, 520].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
    sh.setTabColor("#9AA8BF");
  }
  const id = data["Submission ID"];
  for (let r = sh.getLastRow(); r >= 2; r--) if (sh.getRange(r, 1).getValue() === id) sh.deleteRow(r);
  const rows = (data.rows || []).map(function (o) { return HEAD.map(function (h) { return clean_(o[h] === undefined ? "" : o[h]); }); });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEAD.length).setValues(rows).setWrap(true).setVerticalAlignment("top").setFontSize(10);
}

/* ───────────────────────── Raw data / Follow-ups (technical upsert) ───────────────────────── */
function upsert_(ss, tab, data) {
  const sh = ss.getSheetByName(tab) || ss.insertSheet(tab);
  let headers = sh.getLastRow() > 0 ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String) : [];
  const before = headers.length;
  Object.keys(data).forEach(function (k) { if (k !== "rows" && headers.indexOf(k) < 0) headers.push(k); });
  if (headers.length !== before) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#E4EDF6");
    sh.setFrozenRows(1);
    sh.setTabColor("#9AA8BF");
  }
  const idCol = headers.indexOf("Submission ID") + 1;
  const statusCol = headers.indexOf("Status") + 1;
  let rowIdx = 0, prevStatus = "";
  if (sh.getLastRow() > 1) {
    const ids = sh.getRange(2, idCol, sh.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) if (ids[i][0] === data["Submission ID"]) { rowIdx = i + 2; break; }
  }
  let existing = [];
  if (rowIdx) {
    existing = sh.getRange(rowIdx, 1, 1, headers.length).getValues()[0];
    if (statusCol) prevStatus = String(existing[statusCol - 1]);
  }
  const row = headers.map(function (hd, i) {
    return data[hd] !== undefined ? clean_(data[hd]) : (existing[i] !== undefined ? existing[i] : "");
  });
  if (rowIdx) sh.getRange(rowIdx, 1, 1, headers.length).setValues([row]);
  else sh.appendRow(row);
  return data["Status"] === "Complete" && prevStatus !== "Complete";
}

/* ───────────────────────── Summary (one page, everyone) ───────────────────────── */
const SPECS = [
  { sec: 0, t: "Q1 · How far has AI progressed in your firm?", k: "Q1 · Furthest stage reached" },
  { sec: 0, t: "Q2 · AI applications by stage", kind: "apps" },
  { sec: 0, t: "Q3 · AI technologies and methods in use", k: "Q3 · Technologies" },
  { sec: 0, t: "Q4 · What unlocked progress (ranked: 1 = most important)", k: "Q4 · What unlocked progress (ranked)", ranked: true },
  { sec: 0, t: "Q4 · Size of the AI specialist team (people)", kind: "number", k: "Q4 · What unlocked progress (ranked) → An AI specialist team (# people)" },
  { sec: 1, t: "Q5 · Expected benefits that were NOT delivered", k: "Q5 · Benefits NOT delivered" },
  { sec: 1, t: "Q5 · Who uses the outputs", k: "Q5 · Who uses the outputs" },
  { sec: 1, t: "Q5 · Build vs buy", k: "Q5 · Build vs buy" },
  { sec: 1, t: "Q5 · Daily integration", k: "Q5 · Daily integration" },
  { sec: 1, t: "Q6 · KPIs used to measure impact", k: "Q6 · KPIs used" },
  { sec: 1, t: "Q6 · Measurement approach", k: "Q6 · Measurement approach" },
  { sec: 1, t: "Q6 · Comparison baseline", k: "Q6 · Comparison baseline" },
  { sec: 1, t: "Q6 · Approximate magnitude of improvement", k: "Q6 · Approx. magnitude of improvement" },
  { sec: 2, t: "Q7 · How much influence does AI have, by activity?", kind: "matrix", k: "Q7 · AI role → ", levels: ["Not used", "Informs", "Recommends", "Decides"] },
  { sec: 2, t: "Q8 · Criteria for keeping human control", k: "Q8 · Criteria for human control" },
  { sec: 2, t: "Q8 · Comfort with AI deciding without human sign-off", k: "Q8 · Comfort with AI deciding without human sign-off" },
  { sec: 3, t: "Q9 · What will be a sustainable advantage (ranked: 1 = most important)", k: "Q9 · Sustainable advantage (ranked)", ranked: true },
  { sec: 3, t: "Q10 · Large vs small firms", k: "Q10 · Large vs small firms" },
  { sec: 3, t: "Q11 · Applications expected to become widespread", k: "Q11 · Applications to become widespread" },
  { sec: 3, t: "Q11 · Role of AI in core investment decisions (3–5 years)", k: "Q11 · AI role in core investment decisions (3-5y)" },
  { sec: 3, t: "Q11 · Capabilities to prioritise", k: "Q11 · Capabilities to prioritise" }
];
const OPEN = [
  ["Q4 · Journey", "Q4 · Journey (free text)", 0],
  ["Q5 · Most important applications", "Q5 · Most important applications", 1],
  ["Q5 · Benefits delivered", "Q5 · Benefits delivered (free text)", 1],
  ["Q5 · Unmet expectations", "Q5 · Unmet expectations", 1],
  ["Q5 · Inputs and outputs", "Q5 · Inputs and outputs", 1],
  ["Q6 · How impact is measured", "Q6 · How impact is measured (free text)", 1],
  ["Q6 · Example", "Q6 · Example (free text)", 1],
  ["Q7 · Comment", "Q7 · Comment (free text)", 2],
  ["Q8 · How automation vs human control is decided", "Q8 · How automation vs human control is decided (free text)", 2],
  ["Q8 · Human override example", "Q8 · Human override example", 2],
  ["Q9 · Why", "Q9 · Why (free text)", 3],
  ["Q10 · Competition", "Q10 · Competition (free text)", 3],
  ["Q11 · Outlook", "Q11 · Outlook (free text)", 3],
  ["Closing · Anything else", "Closing · Anything else", 3]
];

function refreshSummary_(ss, force) {
  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  if (!force && now - Number(props.getProperty("LAST_SUMMARY") || 0) < 45000) return;
  props.setProperty("LAST_SUMMARY", String(now));
  buildSummary_(ss);
}

function buildSummary_(ss) {
  const raw = ss.getSheetByName(T.RAW);
  const sh = ss.getSheetByName(T.SUMMARY) || ss.insertSheet(T.SUMMARY, 0);
  try { sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart(); } catch (e) {}
  sh.clear();
  sh.setHiddenGridlines(true);
  [380, 100, 100, 260, 100, 100].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
  const H = raw && raw.getLastRow() > 0 ? raw.getRange(1, 1, 1, raw.getLastColumn()).getValues()[0].map(String) : [];
  const data = raw && raw.getLastRow() > 1 ? raw.getRange(2, 1, raw.getLastRow() - 1, H.length).getValues() : [];
  const col = function (h) { const i = H.indexOf(h); return i < 0 ? [] : data.map(function (r) { return String(r[i] === undefined ? "" : r[i]).trim(); }); };
  const avg = function (a) { return a.length ? Math.round(10 * a.reduce(function (x, y) { return x + y; }, 0) / a.length) / 10 : ""; };
  const tabs = JSON.parse(PropertiesService.getScriptProperties().getProperty("TABS") || "{}");

  let r = 1;
  const band = function (text, color, size) {
    sh.getRange(r, 1, 1, 6).merge().setValue(text).setFontWeight("bold").setFontColor("#FFFFFF").setBackground(color).setFontSize(size || 11).setVerticalAlignment("middle");
    sh.setRowHeight(r, size > 14 ? 48 : 28); r++;
  };
  const head = function (labels) {
    labels.forEach(function (l, i) { sh.getRange(r, i + 1).setValue(l); });
    sh.getRange(r, 1, 1, 6).setFontWeight("bold").setFontSize(9).setFontColor(MUTED).setBackground(SOFT);
    sh.getRange(r, 2, 1, 5).setHorizontalAlignment("center"); r++;
  };
  const none = function () { sh.getRange(r, 1).setValue("No answers yet").setFontColor("#9AA8BF"); r++; };

  band("AI in Asset Management · Interview results", INK, 20);
  sh.getRange(r, 1, 1, 6).merge().setValue("Updated " + Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd HH:mm") + " UTC · refreshes as responses arrive · each respondent has their own tab (named after the firm)")
    .setFontColor(MUTED).setFontSize(9).setBackground(SOFT);
  r += 2;

  const status = col("Status"), total = data.length, done = status.filter(function (s) { return s === "Complete"; }).length;
  const durs = col("Duration (min)").map(Number).filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; });
  [["Respondents", total], ["Completed", done], ["In progress", total - done], ["Median time (min)", durs.length ? durs[Math.floor(durs.length / 2)] : "—"]].forEach(function (t, i) {
    sh.getRange(r, i + 1).setValue(t[0]).setFontSize(9).setFontColor(MUTED).setBackground(SOFT).setHorizontalAlignment("center");
    sh.getRange(r + 1, i + 1).setValue(t[1]).setFontSize(22).setFontWeight("bold").setFontColor(INK).setBackground(SOFT).setHorizontalAlignment("center");
  });
  sh.setRowHeight(r + 1, 40); r += 3;

  // respondent index with links to each tab
  band("Respondents · click a firm to open their page", INK);
  head(["Firm", "Status", "Minutes", "Name · Role"]);
  const firmC = col("Firm"), nameC = col("Name"), roleC = col("Role"), idC = col("Submission ID"), durC = col("Duration (min)");
  if (!total) none();
  for (let i = 0; i < total; i++) {
    const label = String(firmC[i] || nameC[i] || "Anonymous").replace(/"/g, "'"), t = tabs[idC[i]];
    if (t) sh.getRange(r, 1).setRichTextValue(SpreadsheetApp.newRichTextValue().setText(label).setLinkUrl("#gid=" + t.gid).build()).setFontWeight("bold");
    else sh.getRange(r, 1).setValue(label).setFontWeight("bold");
    sh.getRange(r, 2).setValue(status[i] === "Complete" ? "Complete" : "In progress").setHorizontalAlignment("center").setFontColor(status[i] === "Complete" ? "#0B8A6F" : "#B07A00");
    sh.getRange(r, 3).setValue(durC[i]).setHorizontalAlignment("center");
    sh.getRange(r, 4).setValue([nameC[i], roleC[i]].filter(function (x) { return x; }).join(" · "));
    sh.getRange(r, 1, 1, 6).setBorder(null, null, true, null, null, null, LINE, SpreadsheetApp.BorderStyle.SOLID);
    r++;
  }
  r++;

  SPECS.forEach(function (sp) {
    const color = SEC_COLORS[sp.sec];
    if (sp.kind === "apps") {
      band(sp.t + "   ·   applications named by respondents", color);
      head(["Stage", "Applications", "Respondents with ≥ 1", "", "Avg per respondent"]);
      [["In production", "Q2 · AI applications · In production · #"], ["Pilot", "Q2 · AI applications · Pilot · #"], ["Experimental", "Q2 · AI applications · Experimental · #"]].forEach(function (p) {
        const v = col(p[1]).map(Number).filter(function (n) { return !isNaN(n); });
        sh.getRange(r, 1, 1, 5).setValues([[p[0], v.reduce(function (a, b) { return a + b; }, 0), v.filter(function (n) { return n > 0; }).length, "", avg(v)]]);
        sh.getRange(r, 2, 1, 4).setHorizontalAlignment("center"); r++;
      });
      const pc = col("Q2 · AI applications · % of production apps that support decisions").map(Number).filter(function (n) { return !isNaN(n); });
      sh.getRange(r, 1).setValue("Average share of production applications that support investment decisions");
      sh.getRange(r, 2).setValue(pc.length ? Math.round(avg(pc)) + "%" : "—").setHorizontalAlignment("center").setFontWeight("bold"); r += 2; return;
    }
    if (sp.kind === "number") {
      const all = col(sp.k), v = all.map(Number).filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; });
      const dk = all.filter(function (s) { return s === "dk" || /know/i.test(s); }).length;
      band(sp.t + "   ·   " + v.length + " gave a number" + (dk ? " · " + dk + " don't know" : ""), color);
      if (v.length) {
        head(["Statistic", "People"]);
        [["Average", avg(v)], ["Median", v[Math.floor(v.length / 2)]], ["Min", v[0]], ["Max", v[v.length - 1]]].forEach(function (p) {
          sh.getRange(r, 1, 1, 2).setValues([p]); sh.getRange(r, 2).setHorizontalAlignment("center"); r++;
        });
      } else none();
      r++; return;
    }
    if (sp.kind === "matrix") {
      band(sp.t + "   ·   number of respondents per level", color);
      head(["Activity"].concat(sp.levels));
      H.filter(function (h) { return h.indexOf(sp.k) === 0; }).forEach(function (h) {
        const vals = col(h).filter(function (x) { return x !== ""; });
        const row = [h.replace(sp.k, "")].concat(sp.levels.map(function (l) { return vals.filter(function (x) { return x === l; }).length; }));
        sh.getRange(r, 1, 1, row.length).setValues([row]);
        sh.getRange(r, 2, 1, 4).setHorizontalAlignment("center")
          .setBackgrounds([sp.levels.map(function (l, i) { return row[i + 1] ? ["#EAF2FE", "#CFE3FC", "#A9CEFA", "#6FAEF5"][i] : "#FFFFFF"; })]);
        r++;
      });
      r++; return;
    }
    const vals = col(sp.k).filter(function (x) { return x !== "" && x !== "—"; });
    band(sp.t + "   ·   n = " + vals.length + " answered", color);
    head(sp.ranked ? ["Option", "Responses", "% of answered", "", "Avg rank"] : ["Option", "Responses", "% of answered"]);
    const cnt = {}, ranks = {};
    vals.forEach(function (v) {
      v.split(/\n|;\s+/).forEach(function (part) {
        let o = part.trim(); if (!o) return;
        const m = /^(\d+)\.\s+(.*)$/.exec(o), rank = m ? Number(m[1]) : null;
        if (m) o = m[2];
        o = o.replace(/\s*\(\d+ people\)|\s*\(team size: don't know\)/, "").replace(/^Other:.*$/, "Other").replace(/ — .*$/, "");
        cnt[o] = (cnt[o] || 0) + 1;
        if (rank) (ranks[o] = ranks[o] || []).push(rank);
      });
    });
    const keys = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a] || a.localeCompare(b); });
    if (!keys.length) none();
    keys.forEach(function (o) {
      sh.getRange(r, 1).setValue(o).setWrap(true);
      sh.getRange(r, 2).setValue(cnt[o]).setHorizontalAlignment("center").setFontWeight("bold");
      sh.getRange(r, 3).setValue(cnt[o] / vals.length).setNumberFormat("0%").setHorizontalAlignment("center");
      sh.getRange(r, 4).setValue(new Array(Math.max(1, Math.round(cnt[o] / vals.length * 24)) + 1).join("█")).setFontColor(color).setFontSize(11);
      if (sp.ranked) sh.getRange(r, 5).setValue(ranks[o] ? avg(ranks[o]) : "").setHorizontalAlignment("center");
      sh.getRange(r, 1, 1, 6).setBorder(null, null, true, null, null, null, LINE, SpreadsheetApp.BorderStyle.SOLID);
      r++;
    });
    r++;
  });

  // all AI applications
  const aps = ss.getSheetByName(T.APPS);
  if (aps && aps.getLastRow() > 1) {
    const rows = aps.getRange(2, 1, aps.getLastRow() - 1, 9).getValues();
    band("Q2 · All AI applications named", SEC_COLORS[0]);
    head(["Firm · Application", "Stage", "", "Value chain", "Role"]);
    rows.forEach(function (a) {
      sh.getRange(r, 1).setValue((a[3] || a[2] || "Anonymous") + " · " + a[5]).setWrap(true);
      sh.getRange(r, 2).setValue(a[4]).setHorizontalAlignment("center");
      sh.getRange(r, 4).setValue(a[6]).setWrap(true);
      sh.getRange(r, 5, 1, 2).merge().setValue(a[7]).setWrap(true);
      sh.getRange(r, 1, 1, 6).setBorder(null, null, true, null, null, null, LINE, SpreadsheetApp.BorderStyle.SOLID).setVerticalAlignment("top");
      r++;
    });
    r++;
  }

  // open answers, question by question
  band("Open answers, question by question", INK);
  r++;
  OPEN.forEach(function (o) {
    const vals = col(o[1]);
    const idxs = []; vals.forEach(function (v, i) { if (v && v !== "—") idxs.push(i); });
    if (!idxs.length) return;
    band(o[0], SEC_COLORS[o[2]]);
    idxs.forEach(function (i) {
      sh.getRange(r, 1).setValue(firmC[i] || nameC[i] || "Anonymous").setFontWeight("bold").setVerticalAlignment("top").setWrap(true);
      sh.getRange(r, 2, 1, 5).merge().setValue(clean_(vals[i])).setWrap(true).setVerticalAlignment("top");
      sh.getRange(r, 1, 1, 6).setBorder(null, null, true, null, null, null, LINE, SpreadsheetApp.BorderStyle.SOLID);
      r++;
    });
    r++;
  });
  sh.setTabColor(INK);
}

/* ───────────────────────── helpers ───────────────────────── */
// Prevent spreadsheet formula injection from free-text answers.
function clean_(v) {
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function notify_(d) {
  const who = d["Name"] || d["Firm"] || "Anonymous respondent";
  MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, "New interview response: " + who,
    "Firm: " + (d["Firm"] || "-") + "\nRole: " + (d["Role"] || "-") + "\nDuration: " + d["Duration (min)"] + " min\n\nOpen the sheet to read the full answers.");
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ───────────────────────── one-time setup ───────────────────────── */
// Run once from the editor (select setupSheet ▶ Run): removes the previous layout (Answers /
// Respondents / Results tabs), clears the test responses and builds the Summary page.
function setupSheet() {
  const ss = CONFIG.SHEET_ID ? SpreadsheetApp.openById(CONFIG.SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  ["Answers", "Respondents", "Results", "Untitled"].forEach(function (n) {
    const s = ss.getSheetByName(n);
    if (s && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
  [T.RAW, T.APPS, T.FOLLOW].forEach(function (n) {
    const s = ss.getSheetByName(n);
    if (s && s.getLastRow() > 1) s.deleteRows(2, s.getLastRow() - 1);
  });
  PropertiesService.getScriptProperties().deleteProperty("TABS");
  buildSummary_(ss);
  const sum = ss.getSheetByName(T.SUMMARY);
  ss.setActiveSheet(sum); ss.moveActiveSheet(1);
  SUPPORT.forEach(function (n) { const s = ss.getSheetByName(n); if (s) { ss.setActiveSheet(s); ss.moveActiveSheet(ss.getSheets().length); s.setTabColor("#9AA8BF"); } });
  ss.setActiveSheet(sum);
}

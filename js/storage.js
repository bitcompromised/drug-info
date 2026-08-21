/* ==========================================================================
   storage.js — Local dose log persistence
   --------------------------------------------------------------------------
   Everything lives in this browser's localStorage. Nothing is transmitted
   anywhere; the app makes no network requests at all.
   ========================================================================== */
(function (global) {
  'use strict';

  var KEY = 'drug-info.logs.v1';
  var PREFS = 'drug-info.prefs.v1';
  // Written on the first load and never removed. Keyed separately from the
  // log so that clearing the log — or clearing the example — is not mistaken
  // for a first visit and does not seed the example again.
  var SEEN = 'drug-info.seen.v1';

  var UNIT_TO_MG = { ng: 1e-6, ug: 0.001, 'µg': 0.001, mcg: 0.001, mg: 1, g: 1000 };

  function toMg(amount, unit) {
    var f = UNIT_TO_MG[unit];
    return f != null ? amount * f : amount;   // ml / canisters / inhalations stay as-is
  }

  /**
   * Whether this browser has ever loaded the app.
   *
   * Everything the app knows lives in these three keys, so the absence of
   * all three is the only honest definition of a first visit. Testing the
   * log alone would re-seed the example every time someone emptied it,
   * which is the one moment they have clearly said they do not want it.
   */
  function isFirstVisit() {
    try {
      return !localStorage.getItem(SEEN) &&
             !localStorage.getItem(KEY) &&
             !localStorage.getItem(PREFS);
    } catch (e) {
      // Private mode with storage disabled: not a first visit, just a
      // browser that cannot remember. Seeding would repeat on every load.
      return false;
    }
  }

  function markSeen() {
    try { localStorage.setItem(SEEN, new Date().toISOString()); } catch (e) { /* no storage */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.warn('log load failed', e);
      return [];
    }
  }

  function save(logs) {
    logs.sort(function (a, b) { return a.timeMs - b.timeMs; });
    localStorage.setItem(KEY, JSON.stringify(logs));
    return logs;
  }

  function add(entry) {
    var logs = load();
    entry.id = entry.id || ('e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    entry.amountMg = toMg(entry.amount, entry.unit);
    logs.push(entry);
    return save(logs);
  }

  function update(id, patch) {
    var logs = load();
    logs.forEach(function (l) {
      if (l.id !== id) return;
      Object.keys(patch).forEach(function (k) { l[k] = patch[k]; });
      l.amountMg = toMg(l.amount, l.unit);
    });
    return save(logs);
  }

  function remove(id) {
    return save(load().filter(function (l) { return l.id !== id; }));
  }

  function clear() {
    localStorage.removeItem(KEY);
    return [];
  }

  /* ---------- import / export ---------------------------------------------- */

  function exportJSON() {
    return JSON.stringify({
      format: 'drug-info-log', version: 1,
      exportedAt: new Date().toISOString(),
      entries: load()
    }, null, 2);
  }

  function exportCSV() {
    var rows = [['timestamp', 'drug_id', 'drug_name', 'amount', 'unit', 'amount_mg', 'route', 'notes']];
    load().forEach(function (l) {
      var d = DB.get(l.drugId);
      rows.push([
        new Date(l.timeMs).toISOString(), l.drugId, d ? d.name : l.drugId,
        l.amount, l.unit, l.amountMg, l.route, (l.notes || '').replace(/"/g, '""')
      ]);
    });
    return rows.map(function (r) {
      return r.map(function (c) {
        var s = String(c == null ? '' : c);
        return /[",\n]/.test(s) ? '"' + s + '"' : s;
      }).join(',');
    }).join('\n');
  }

  function importJSON(text) {
    var data = JSON.parse(text);
    var entries = Array.isArray(data) ? data : data.entries;
    if (!Array.isArray(entries)) throw new Error('No entries array found in file.');
    var logs = load();
    var existing = {};
    logs.forEach(function (l) { existing[l.id] = 1; });
    var added = 0;
    entries.forEach(function (e) {
      if (!e.drugId || !e.timeMs) return;
      if (e.id && existing[e.id]) return;
      e.id = e.id || ('e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
      e.amountMg = e.amountMg != null ? e.amountMg : toMg(e.amount, e.unit);
      logs.push(e); added++;
    });
    save(logs);
    return added;
  }

  /* ---------- preferences --------------------------------------------------- */

  function getPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS)) || {}; } catch (e) { return {}; }
  }
  function setPref(k, v) {
    var p = getPrefs(); p[k] = v;
    localStorage.setItem(PREFS, JSON.stringify(p));
    return p;
  }

  /* ---------- queries ------------------------------------------------------- */

  function inWindow(t0, t1) {
    return load().filter(function (l) { return l.timeMs >= t0 && l.timeMs <= t1; });
  }

  /** Doses whose drug could still plausibly be present at time `nowMs`. */
  function potentiallyActive(nowMs, horizonMultiplier) {
    var mult = horizonMultiplier || 6;
    return load().filter(function (l) {
      var d = DB.get(l.drugId);
      if (!d) return false;
      var win = (d.halfLife.hours || 4) * mult * 3600000;
      return l.timeMs <= nowMs && (nowMs - l.timeMs) <= win;
    });
  }

  global.Store = {
    load: load, save: save, add: add, update: update, remove: remove, clear: clear,
    exportJSON: exportJSON, exportCSV: exportCSV, importJSON: importJSON,
    getPrefs: getPrefs, setPref: setPref,
    isFirstVisit: isFirstVisit, markSeen: markSeen,
    inWindow: inWindow, potentiallyActive: potentiallyActive,
    toMg: toMg, UNIT_TO_MG: UNIT_TO_MG
  };
})(window);

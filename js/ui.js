/* ==========================================================================
   ui.js — shell services: theme, command palette, toasts, shortcuts, pins
   --------------------------------------------------------------------------
   These are the parts of the interface that do not belong to any one tab.
   They are kept out of app.js because app.js is about what the data means,
   and none of this knows anything about pharmacokinetics.

   Nothing here talks to the network, and everything it remembers goes into
   the same local preferences blob the rest of the app uses.
   ========================================================================== */
(function (global) {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  function h(tag, attrs, children) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'text') n.textContent = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    });
    (children || []).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  /* ======================================================================
     ICONS
     ----------------------------------------------------------------------
     Drawn rather than typed. The glyphs these replace (◐ ☾ ⌨ ⚗) render at
     wildly different weights and baselines across platforms, and several of
     them fall back to a tofu box on Windows — which is where this app is
     mostly read. Stroked paths on currentColor inherit the theme for free
     and line up with each other.
     ====================================================================== */

  var ICONS = {
    // A dose curve: rise, peak, decay. The shape the whole app is about.
    now: 'M3 17c3 0 4-9 7-9s3 6 5 6 3-7 6-7',
    // Two overlapping fields — what an interaction is.
    interactions: 'M9.5 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12M14.5 6a6 6 0 1 1 0 12 6 6 0 1 1 0-12',
    // A volumetric flask.
    solution: 'M9 3h6M10 3v6.2L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.2V3M7.2 14h9.6',
    // A catalogue.
    substances: 'M4 5h7v6H4zM13 5h7v6h-7zM4 13h7v6H4zM13 13h7v6h-7z',
    patterns: 'M4 20V12M9.3 20V6M14.7 20v-5M20 20V9M3 20h18',
    faq: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M9.4 9.3a2.7 2.7 0 1 1 3.4 3.2c-.6.2-.8.7-.8 1.3v.4M12 17.2v.2',
    sun: 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 1 0 0-9M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6',
    moon: 'M20 14.2A8.4 8.4 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2',
    // Half filled: the app follows whatever the system says.
    auto: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M12 3v18',
    keyboard: 'M3 6.5h18v11H3zM7 10h.01M11 10h.01M15 10h.01M17 13.5h.01M7 13.5h.01M10 13.5h4',
    search: 'M10.8 4a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 1 0 0-13.6M15.8 15.8L20.5 20.5',
    settings: 'M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 1 0 0-6.8M19.3 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H4a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H10a1.6 1.6 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V10a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z'
  };

  /**
   * @param {string} name  A key of ICONS.
   * @param {number=} size Pixels; 20 suits the application bar, 22 the
   *   mobile tab bar where the label underneath is very small.
   */
  function icon(name, size) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size || 20);
    svg.setAttribute('height', size || 20);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.7');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'icon icon-' + name);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', ICONS[name] || '');
    svg.appendChild(path);
    return svg;
  }

  /* ======================================================================
     THEME
     ----------------------------------------------------------------------
     Three states, not two. "System" is the default and is a real setting:
     it means the page follows the OS, including when the OS flips at dusk.
     An explicit choice writes data-theme, which out-specifies the media
     query in the stylesheet.
     ====================================================================== */

  var THEMES = ['system', 'dark', 'light'];
  var THEME_ICON = { system: 'auto', dark: 'moon', light: 'sun' };
  var THEME_LABEL = { system: 'Match the system', dark: 'Dark', light: 'Light' };

  function themeMode() {
    var t = Store.getPrefs().theme;
    return THEMES.indexOf(t) >= 0 ? t : 'system';
  }

  /** What the page is actually showing, once "system" has been resolved. */
  function resolvedTheme() {
    var m = themeMode();
    if (m !== 'system') return m;
    return global.matchMedia && global.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light' : 'dark';
  }

  function applyTheme() {
    var m = themeMode();
    if (m === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', m);

    // The charts hold their colours as strings, resolved from custom
    // properties at draw time. Dropping the cache is what makes a theme
    // change reach the SVG rather than just the chrome around it.
    if (global.Charts && Charts.resetPalette) Charts.resetPalette();
    syncThemeButton();
  }

  function setTheme(m) {
    Store.setPref('theme', THEMES.indexOf(m) >= 0 ? m : 'system');
    applyTheme();
    if (global.App && App.render) App.render();
  }

  function cycleTheme() {
    var next = THEMES[(THEMES.indexOf(themeMode()) + 1) % THEMES.length];
    setTheme(next);
    toast('Theme: ' + THEME_LABEL[next].toLowerCase() +
      (next === 'system' ? ' (' + resolvedTheme() + ' right now)' : ''));
  }

  function syncThemeButton() {
    var b = $('#theme-btn');
    if (!b) return;
    var m = themeMode();
    b.innerHTML = '';
    b.appendChild(icon(THEME_ICON[m]));
    b.setAttribute('title', 'Theme: ' + THEME_LABEL[m] + ' — click to change  (T)');
    b.setAttribute('aria-label', 'Theme: ' + THEME_LABEL[m]);
  }

  /* ======================================================================
     TOASTS
     ----------------------------------------------------------------------
     Small, brief, and never used for anything the reader has to act on.
     A destructive action gets an Undo button here rather than a
     confirmation dialog in front of it — one click to do, one to take back.
     ====================================================================== */

  function toastStack() {
    var s = $('#toast-stack');
    if (!s) {
      s = h('div', { class: 'toast-stack', id: 'toast-stack', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(s);
    }
    return s;
  }

  function toast(message, opts) {
    opts = opts || {};
    var stack = toastStack();
    var el = h('div', { class: 'toast' + (opts.kind ? ' toast-' + opts.kind : '') }, [
      h('span', { class: 'toast-icon', text: opts.icon || ({ ok: '✓', warn: '!', danger: '!' }[opts.kind] || 'ℹ') }),
      h('span', { class: 'toast-body', text: message }),
      opts.actionLabel ? h('button', {
        class: 'toast-action', text: opts.actionLabel,
        onclick: function () { dismiss(); if (opts.action) opts.action(); }
      }) : null
    ]);

    var timer = setTimeout(dismiss, opts.timeout || (opts.actionLabel ? 7000 : 3600));
    function dismiss() {
      clearTimeout(timer);
      if (!el.parentNode) return;
      el.classList.add('out');
      setTimeout(function () { if (el.parentNode) el.remove(); }, 220);
    }
    el.addEventListener('click', function (e) { if (e.target === el) dismiss(); });

    stack.appendChild(el);
    // Four is already more than anybody reads; older ones go.
    while (stack.children.length > 4) stack.firstChild.remove();
    return dismiss;
  }

  /* ======================================================================
     PINS AND RECENTS
     ----------------------------------------------------------------------
     A database of 649 compounds is mostly not about you. Pins are the
     handful that are; recents are the ones you were just looking at. Both
     exist to put the palette's first screen — before a single keystroke —
     within one keypress of somewhere useful.
     ====================================================================== */

  var MAX_RECENT = 12;

  function pins() {
    var p = Store.getPrefs().pins;
    return Array.isArray(p) ? p : [];
  }
  function isPinned(id) { return pins().indexOf(id) >= 0; }
  function togglePin(id) {
    var list = pins(), i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.unshift(id);
    Store.setPref('pins', list.slice(0, 40));
    return i < 0;
  }

  function recents() {
    var r = Store.getPrefs().recents;
    return Array.isArray(r) ? r : [];
  }
  function pushRecent(id) {
    if (!id) return;
    var list = recents().filter(function (x) { return x !== id; });
    list.unshift(id);
    Store.setPref('recents', list.slice(0, MAX_RECENT));
  }

  /* ======================================================================
     ACTION REGISTRY
     ----------------------------------------------------------------------
     app.js registers what the palette can do; this file only knows how to
     list and run things. Keeping the direction of the dependency this way
     round means the palette never has to be told about a new tab.
     ====================================================================== */

  var actions = [];

  function registerAction(a) { actions.push(a); return a; }
  function registerActions(list) { list.forEach(registerAction); }
  function runAction(id) {
    var a = actions.filter(function (x) { return x.id === id; })[0];
    if (a) a.run();
  }

  /* ======================================================================
     COMMAND PALETTE
     ====================================================================== */

  var paletteOpen = false;

  function drugItem(d) {
    return {
      kind: 'drug',
      icon: isPinned(d.id) ? '★' : '◇',
      name: d.name,
      sub: [d.class, d.family].filter(Boolean).join(' · '),
      meta: d.halfLife && d.halfLife.hours != null ? 't½ ' + fmtHours(d.halfLife.hours) : '',
      run: function () { global.App.openDrug(d.id); }
    };
  }

  function fmtHours(hrs) {
    if (hrs == null) return '';
    if (hrs < 1) return Math.round(hrs * 60) + ' min';
    return (hrs < 10 ? Math.round(hrs * 10) / 10 : Math.round(hrs)) + ' h';
  }

  /**
   * What the palette shows for the current query.
   *
   * With nothing typed it is a launcher: pins, then what you were just
   * looking at, then everything the app can do. As soon as there is a query
   * the compounds come first, because that is overwhelmingly what a search
   * in this app is for — but matching actions stay visible underneath so
   * that typing "export" still finds the export.
   */
  function paletteGroups(q) {
    var query = (q || '').trim();
    var groups = [];

    if (!query) {
      var pinned = pins().map(function (id) { return DB.get(id); }).filter(Boolean);
      if (pinned.length) groups.push({ label: 'Pinned', items: pinned.map(drugItem) });

      var rec = recents().map(function (id) { return DB.get(id); }).filter(Boolean)
        .filter(function (d) { return !isPinned(d.id); }).slice(0, 6);
      if (rec.length) groups.push({ label: 'Recently viewed', items: rec.map(drugItem) });

      groups.push({
        label: 'Go to', items: actions.filter(function (a) { return a.group === 'nav'; }).map(actionItem)
      });
      groups.push({
        label: 'Actions', items: actions.filter(function (a) { return a.group !== 'nav'; }).map(actionItem)
      });
      return groups;
    }

    var hits = DB.search(query, 40) || [];
    if (hits.length) groups.push({ label: 'Substances', items: hits.map(drugItem) });

    var nq = query.toLowerCase();
    var matched = actions.filter(function (a) {
      return (a.title + ' ' + (a.keywords || '')).toLowerCase().indexOf(nq) >= 0;
    });
    if (matched.length) groups.push({ label: 'Commands', items: matched.map(actionItem) });

    return groups;
  }

  function actionItem(a) {
    return {
      kind: 'action', icon: a.icon || '›', name: a.title, sub: a.hint || '',
      meta: a.key || '', run: a.run
    };
  }

  function openPalette(initial) {
    if (paletteOpen) return;
    paletteOpen = true;

    var flat = [], sel = 0;
    var list = h('div', { class: 'palette-list', id: 'palette-list', role: 'listbox' });
    var input = h('input', {
      class: 'palette-input', id: 'palette-input', type: 'text',
      placeholder: 'Search 649 compounds, pages and commands…',
      autocomplete: 'off', spellcheck: 'false', 'aria-controls': 'palette-list'
    });
    if (initial) input.value = initial;

    var overlay = h('div', {
      class: 'palette-overlay', id: 'palette',
      onmousedown: function (e) { if (e.target === overlay) close(); }
    }, [
      h('div', { class: 'palette', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Command palette' }, [
        h('div', { class: 'palette-search' }, [
          h('span', { class: 'palette-search-icon' }, [icon('search', 17)]), input
        ]),
        list,
        h('div', { class: 'palette-foot' }, [
          hint('↑↓', 'navigate'), hint('↵', 'open'),
          hint('⇧↵', 'pin / unpin'), hint('esc', 'close')
        ])
      ])
    ]);

    function hint(k, label) {
      return h('span', { class: 'hint' }, [h('kbd', { text: k }), label]);
    }

    function draw() {
      list.innerHTML = '';
      flat = [];
      var groups = paletteGroups(input.value);
      var total = groups.reduce(function (a, g) { return a + g.items.length; }, 0);
      if (!total) {
        list.appendChild(h('div', {
          class: 'palette-empty',
          text: 'Nothing matches “' + input.value.trim() + '”.'
        }));
        return;
      }
      if (sel >= total) sel = total - 1;
      if (sel < 0) sel = 0;

      groups.forEach(function (g) {
        if (!g.items.length) return;
        list.appendChild(h('div', { class: 'palette-group', text: g.label }));
        g.items.forEach(function (it) {
          var i = flat.length;
          flat.push(it);
          var row = h('button', {
            class: 'palette-item' + (i === sel ? ' sel' : ''),
            role: 'option', 'aria-selected': i === sel ? 'true' : 'false',
            onmousemove: function () { if (sel !== i) { sel = i; paint(); } },
            onclick: function (e) {
              if (e.shiftKey && it.kind === 'drug') { pinFromRow(i); return; }
              choose(i);
            }
          }, [
            h('span', { class: 'pi-icon', text: it.icon }),
            h('span', { class: 'pi-body' }, [
              h('span', { class: 'pi-name', text: it.name }),
              it.sub ? h('span', { class: 'pi-sub', text: it.sub }) : null
            ]),
            it.meta ? h('span', { class: 'pi-meta', text: it.meta }) : null
          ]);
          list.appendChild(row);
        });
      });
      scrollToSel();
    }

    /* Repainting the selection without rebuilding the list — the list can be
       forty rows long and rebuilding it on every arrow key loses the scroll
       position as well as being wasteful. */
    function paint() {
      var rows = list.querySelectorAll('.palette-item');
      for (var i = 0; i < rows.length; i++) {
        var on = i === sel;
        rows[i].classList.toggle('sel', on);
        rows[i].setAttribute('aria-selected', on ? 'true' : 'false');
      }
      scrollToSel();
    }

    function scrollToSel() {
      var row = list.querySelectorAll('.palette-item')[sel];
      if (!row) return;
      var rt = row.offsetTop, rb = rt + row.offsetHeight;
      if (rt < list.scrollTop) list.scrollTop = rt - 6;
      else if (rb > list.scrollTop + list.clientHeight) list.scrollTop = rb - list.clientHeight + 6;
    }

    function choose(i) {
      var it = flat[i];
      if (!it) return;
      close();
      it.run();
    }

    function pinFromRow(i) {
      var it = flat[i];
      if (!it || it.kind !== 'drug') return;
      // The row carries the display name; the pin has to be by id.
      var d = DB.get(it.name);
      if (!d) return;
      var added = togglePin(d.id);
      toast(added ? 'Pinned ' + d.name : 'Unpinned ' + d.name, { kind: added ? 'ok' : null, icon: added ? '★' : '☆' });
      draw();
    }

    input.addEventListener('input', function () { sel = 0; draw(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, flat.length - 1); paint(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); paint(); }
      else if (e.key === 'Home') { e.preventDefault(); sel = 0; paint(); }
      else if (e.key === 'End') { e.preventDefault(); sel = flat.length - 1; paint(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) pinFromRow(sel); else choose(sel);
      } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    });

    function close() {
      paletteOpen = false;
      document.removeEventListener('keydown', onEsc, true);
      if (overlay.parentNode) overlay.remove();
    }
    function onEsc(e) {
      if (e.key !== 'Escape') return;
      // Ahead of the app-wide Escape handler, which would otherwise close a
      // modal sitting behind the palette instead of the palette itself.
      e.stopPropagation();
      close();
    }
    document.addEventListener('keydown', onEsc, true);

    document.body.appendChild(overlay);
    draw();
    input.focus();
    input.select();
  }

  /* ======================================================================
     KEYBOARD SHORTCUTS
     ====================================================================== */

  var SHORTCUTS = [
    { group: 'Anywhere', keys: ['Ctrl', 'K'], label: 'Open the command palette' },
    { group: 'Anywhere', keys: ['/'], label: 'Search substances' },
    { group: 'Anywhere', keys: ['N'], label: 'Log a dose' },
    { group: 'Anywhere', keys: ['T'], label: 'Switch theme' },
    { group: 'Anywhere', keys: [','], label: 'Open settings' },
    { group: 'Anywhere', keys: ['?'], label: 'This list' },
    { group: 'Anywhere', keys: ['Esc'], label: 'Close what is open' },
    { group: 'Tabs', keys: ['1'], label: 'Now' },
    { group: 'Tabs', keys: ['2'], label: 'Interactions' },
    { group: 'Tabs', keys: ['3'], label: 'Solution' },
    { group: 'Tabs', keys: ['4'], label: 'Substances' },
    { group: 'Tabs', keys: ['5'], label: 'Patterns' },
    { group: 'Tabs', keys: ['6'], label: 'FAQ' },
    { group: 'On a substance', keys: ['P'], label: 'Pin or unpin it' },
    { group: 'On a substance', keys: ['Esc'], label: 'Back to the list' }
  ];

  function shortcutSheet() {
    var byGroup = {};
    SHORTCUTS.forEach(function (s) { (byGroup[s.group] = byGroup[s.group] || []).push(s); });

    return h('div', { class: 'shortcuts' }, [
      h('h2', { text: 'Keyboard' }),
      h('p', { class: 'muted small', text: 'Single-letter shortcuts are ignored while you are typing in a field.' }),
      h('div', { class: 'keys-grid' }, Object.keys(byGroup).map(function (g) {
        return h('div', { class: 'keys-col' }, [
          h('h4', { text: g })
        ].concat(byGroup[g].map(function (s) {
          return h('div', { class: 'keys-row' }, [
            h('span', { text: s.label }),
            h('span', { class: 'keys' }, s.keys.map(function (k) { return h('kbd', { text: k }); }))
          ]);
        })));
      }))
    ]);
  }

  /** True when a keystroke belongs to whatever the reader is typing into. */
  function typingIn(e) {
    var t = e.target;
    if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'select' || tag === 'textarea' || t.isContentEditable;
  }

  function bindKeys(handlers) {
    document.addEventListener('keydown', function (e) {
      // Ctrl/Cmd-K works everywhere, including inside a field.
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); openPalette(); return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (typingIn(e) || paletteOpen) return;

      var k = e.key;
      if (k === '/') { e.preventDefault(); openPalette(); return; }
      if (k === '?') { e.preventDefault(); handlers.shortcuts(); return; }
      if (k === ',') { e.preventDefault(); handlers.settings(); return; }
      if (k === 'n' || k === 'N') { e.preventDefault(); handlers.log(); return; }
      if (k === 't' || k === 'T') { e.preventDefault(); cycleTheme(); return; }
      if (k === 'p' || k === 'P') { if (handlers.pin()) e.preventDefault(); return; }
      if (k >= '1' && k <= '9') {
        if (handlers.tab(parseInt(k, 10) - 1)) e.preventDefault();
      }
    });
  }

  /* ======================================================================
     THE STANDING DISCLAIMER
     ====================================================================== */

  function initDisclaimer() {
    var head = $('#disc-toggle'), body = $('#disc-body');
    if (!head || !body) return;

    // Open until it has been read once, then collapsed by default — but
    // whichever way the reader last left it wins over both.
    var pref = Store.getPrefs().disclaimerOpen;
    var open = pref == null ? Store.getPrefs().disclaimerSeen !== true : pref === true;
    setOpen(open);
    if (open) Store.setPref('disclaimerSeen', true);

    head.addEventListener('click', function () { setOpen(body.hasAttribute('hidden'), true); });

    function setOpen(o, remember) {
      if (o) body.removeAttribute('hidden'); else body.setAttribute('hidden', 'hidden');
      head.setAttribute('aria-expanded', o ? 'true' : 'false');
      var caret = head.querySelector('.disc-caret');
      if (caret) caret.textContent = o ? '▾' : '▸';
      if (remember) Store.setPref('disclaimerOpen', o);
    }
  }

  /* ======================================================================
     SHELL WIRING
     ====================================================================== */

  function initShell(handlers) {
    applyTheme();
    initDisclaimer();

    var omni = $('#omni');
    if (omni) omni.addEventListener('click', function () { openPalette(); });

    var kbd = $('#omni-kbd');
    if (kbd && /Mac|iPhone|iPad/.test(navigator.platform || '')) kbd.textContent = '⌘K';

    var tb = $('#theme-btn');
    if (tb) tb.addEventListener('click', cycleTheme);

    var kb = $('#keys-btn');
    if (kb) {
      kb.innerHTML = '';
      kb.appendChild(icon('keyboard'));
      kb.addEventListener('click', handlers.shortcuts);
    }

    var oi = $('.omni-icon');
    if (oi) { oi.innerHTML = ''; oi.appendChild(icon('search', 15)); }

    // A system theme change while the page is open should be followed, but
    // only while "system" is the setting.
    if (global.matchMedia) {
      var mq = global.matchMedia('(prefers-color-scheme: light)');
      var onChange = function () {
        if (themeMode() !== 'system') return;
        if (global.Charts && Charts.resetPalette) Charts.resetPalette();
        if (global.App && App.render) App.render();
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    bindKeys(handlers);
  }

  global.UI = {
    initShell: initShell,
    h: h, icon: icon,
    toast: toast,
    openPalette: openPalette,
    shortcutSheet: shortcutSheet,
    themeMode: themeMode, resolvedTheme: resolvedTheme, setTheme: setTheme,
    cycleTheme: cycleTheme, THEME_LABEL: THEME_LABEL, THEMES: THEMES,
    pins: pins, isPinned: isPinned, togglePin: togglePin,
    recents: recents, pushRecent: pushRecent,
    registerAction: registerAction, registerActions: registerActions, runAction: runAction
  };
})(window);

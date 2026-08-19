/* ==========================================================================
   charts.js — SVG chart primitives (no dependencies, offline-safe)
   ========================================================================== */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs, text) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  function svgRoot(w, h, cls) {
    var s = el('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      preserveAspectRatio: 'xMidYMid meet',
      class: 'chart ' + (cls || ''),
      role: 'img'
    });
    return s;
  }

  var PALETTE = [
    '#5b9dd9', '#e8834a', '#61c0a0', '#c98bdb', '#e3c75a',
    '#7f8de8', '#d76a8a', '#8bbf5a', '#4fb3bf', '#d9a441'
  ];

  function colorFor(i) { return PALETTE[i % PALETTE.length]; }

  /* ---------- scales ------------------------------------------------------ */

  function linScale(d0, d1, r0, r1) {
    var span = (d1 - d0) || 1;
    var f = function (v) { return r0 + (v - d0) / span * (r1 - r0); };
    f.invert = function (p) { return d0 + (p - r0) / ((r1 - r0) || 1) * span; };
    f.domain = [d0, d1]; f.range = [r0, r1];
    return f;
  }

  function logScale(d0, d1, r0, r1) {
    var l0 = Math.log10(Math.max(1e-9, d0)), l1 = Math.log10(Math.max(1e-9, d1));
    var span = (l1 - l0) || 1;
    var f = function (v) { return r0 + (Math.log10(Math.max(1e-9, v)) - l0) / span * (r1 - r0); };
    f.domain = [d0, d1]; f.range = [r0, r1];
    return f;
  }

  /* ---------- time formatting --------------------------------------------- */

  function fmtClock(ms) {
    var d = new Date(ms);
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  function fmtDayClock(ms) {
    var d = new Date(ms);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + fmtClock(ms);
  }
  function fmtDur(h) {
    if (h == null || !isFinite(h)) return '—';
    if (h < 1 / 60) return '<1 min';
    if (h < 1) return Math.round(h * 60) + ' min';
    if (h < 48) return (h < 10 ? h.toFixed(1) : Math.round(h)) + ' h';
    return (h / 24).toFixed(1) + ' d';
  }

  /* ======================================================================
     LINE CHART — concentration / effect curves over time
     ====================================================================== */

  /**
   * opts: {
   *   series: [{ name, color, points: [[tMs, y], ...], dashed, fill }],
   *   t0, t1        (ms)
   *   yMax          (auto if absent)
   *   nowMs
   *   yLabel, yFormat
   *   markers: [{ tMs, label, color }]
   *   cursorMs      draws a movable scrub cursor and exposes __setCursor
   * }
   *
   * When `cursorMs` is given the returned SVG carries a `__scale` / `__setCursor`
   * pair, which is what lets the Now tab's timeline be scrubbed: the caller maps
   * a pointer position to a time through `__scale` and pushes it back through
   * `__setCursor`, without needing to know anything about the chart's geometry.
   */
  function lineChart(opts) {
    var W = 900, H = opts.height || 340;
    var M = { t: 18, r: 16, b: 34, l: 46 };
    var iw = W - M.l - M.r, ih = H - M.t - M.b;
    var s = svgRoot(W, H, 'line-chart');

    var yMax = opts.yMax;
    if (yMax == null) {
      yMax = 0;
      opts.series.forEach(function (se) {
        se.points.forEach(function (p) { if (p[1] > yMax) yMax = p[1]; });
      });
      yMax = yMax > 0 ? yMax * 1.15 : 1;
    }

    var x = linScale(opts.t0, opts.t1, M.l, M.l + iw);
    var y = linScale(0, yMax, M.t + ih, M.t);

    var g = el('g');
    s.appendChild(g);

    // --- horizontal grid + y axis ---
    var yTicks = niceTicks(0, yMax, 5);
    yTicks.forEach(function (v) {
      var py = y(v);
      g.appendChild(el('line', { x1: M.l, x2: M.l + iw, y1: py, y2: py, class: 'grid' }));
      g.appendChild(el('text', { x: M.l - 8, y: py + 4, class: 'axis-label', 'text-anchor': 'end' },
        opts.yFormat ? opts.yFormat(v) : String(Math.round(v * 100) / 100)));
    });

    // --- vertical grid + x axis (time) ---
    var spanH = (opts.t1 - opts.t0) / 3600000;
    var stepH = spanH <= 6 ? 1 : spanH <= 14 ? 2 : spanH <= 30 ? 4 : spanH <= 80 ? 12 : 24;
    var start = Math.ceil(opts.t0 / (stepH * 3600000)) * stepH * 3600000;
    for (var t = start; t <= opts.t1; t += stepH * 3600000) {
      var px = x(t);
      g.appendChild(el('line', { x1: px, x2: px, y1: M.t, y2: M.t + ih, class: 'grid' }));
      g.appendChild(el('text', { x: px, y: M.t + ih + 20, class: 'axis-label', 'text-anchor': 'middle' },
        spanH > 30 ? fmtDayClock(t) : fmtClock(t)));
    }

    // --- series ---
    opts.series.forEach(function (se, i) {
      if (!se.points.length) return;
      var color = se.color || colorFor(i);
      var d = se.points.map(function (p, idx) {
        return (idx ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y(p[1]).toFixed(1);
      }).join(' ');

      if (se.fill) {
        var area = d + ' L' + x(se.points[se.points.length - 1][0]).toFixed(1) + ' ' + y(0).toFixed(1) +
                   ' L' + x(se.points[0][0]).toFixed(1) + ' ' + y(0).toFixed(1) + ' Z';
        g.appendChild(el('path', { d: area, fill: color, opacity: 0.12, stroke: 'none' }));
      }
      g.appendChild(el('path', {
        d: d, fill: 'none', stroke: color, 'stroke-width': se.width || 2,
        'stroke-dasharray': se.dashed ? '5 4' : null,
        'stroke-linejoin': 'round', 'stroke-linecap': 'round',
        opacity: se.opacity || 1
      }));
    });

    // --- markers (dose events) ---
    (opts.markers || []).forEach(function (m) {
      if (m.tMs < opts.t0 || m.tMs > opts.t1) return;
      var px = x(m.tMs);
      g.appendChild(el('line', {
        x1: px, x2: px, y1: M.t, y2: M.t + ih,
        stroke: m.color || '#888', 'stroke-width': 1, 'stroke-dasharray': '2 3', opacity: 0.7
      }));
      g.appendChild(el('circle', { cx: px, cy: M.t + ih, r: 3.5, fill: m.color || '#888' }));
    });

    // --- "now" line ---
    if (opts.nowMs != null && opts.nowMs >= opts.t0 && opts.nowMs <= opts.t1) {
      var nx = x(opts.nowMs);
      g.appendChild(el('line', { x1: nx, x2: nx, y1: M.t - 6, y2: M.t + ih, class: 'now-line' }));
      g.appendChild(el('text', { x: nx + 5, y: M.t + 2, class: 'now-label' }, 'now'));
    }

    // --- axes ---
    g.appendChild(el('line', { x1: M.l, x2: M.l + iw, y1: M.t + ih, y2: M.t + ih, class: 'axis' }));
    g.appendChild(el('line', { x1: M.l, x2: M.l, y1: M.t, y2: M.t + ih, class: 'axis' }));

    // --- scrubbing cursor ---
    if (opts.cursorMs !== undefined) {
      var cursor = el('g', { class: 'cursor-group' });
      var cLine = el('line', { x1: M.l, x2: M.l, y1: M.t - 6, y2: M.t + ih, class: 'cursor-line' });
      var cHead = el('polygon', { points: '0,0 -5,-7 5,-7', class: 'cursor-head' });
      var cLabel = el('text', { x: 0, y: M.t - 10, class: 'cursor-label', 'text-anchor': 'middle' }, '');
      cursor.appendChild(cLine); cursor.appendChild(cHead); cursor.appendChild(cLabel);
      s.appendChild(cursor);

      s.__scale = {
        t0: opts.t0, t1: opts.t1, x0: M.l, x1: M.l + iw, viewW: W,
        toTime: function (px) {
          var f = (px - M.l) / Math.max(1, iw);
          return opts.t0 + Math.max(0, Math.min(1, f)) * (opts.t1 - opts.t0);
        },
        toX: function (t) { return x(t); }
      };
      s.__setCursor = function (tMs, label) {
        if (tMs == null) { cursor.setAttribute('opacity', '0'); return; }
        cursor.setAttribute('opacity', '1');
        var cx = x(Math.max(opts.t0, Math.min(opts.t1, tMs)));
        cLine.setAttribute('x1', cx); cLine.setAttribute('x2', cx);
        cHead.setAttribute('transform', 'translate(' + cx + ',' + (M.t - 6) + ')');
        cLabel.setAttribute('x', cx);
        cLabel.textContent = label || fmtClock(tMs);
      };
      s.__setCursor(opts.cursorMs != null ? opts.cursorMs : null);
    }

    return s;
  }

  function niceTicks(lo, hi, count) {
    var span = hi - lo || 1;
    var raw = span / count;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var norm = raw / mag;
    var step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    var ticks = [];
    for (var v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) ticks.push(v);
    return ticks;
  }

  /* ======================================================================
     PIE CHART — composition by share
     ====================================================================== */

  /**
   * A donut, drawn as SVG arcs, with a legend sorted heaviest first.
   *
   * opts: {
   *   items: [{ label, value, color, sublabel }],
   *   valueFormat(value, fraction) -> string for the hover readout,
   *   size, title
   * }
   *
   * Slices and legend rows carry data-key so the caller can cross-highlight
   * from elsewhere on the page — clicking an ingredient in a list should be
   * able to point at its slice. `svg.__highlight(key)` does that.
   *
   * Hover detail goes to a caption element rather than a floating tooltip:
   * a tooltip that follows the cursor is unreadable on touch, and the caption
   * has room for both the percentage and the per-dose figure.
   */
  /** Percentages here span 60% to 0.006%, so a fixed precision hides the actives. */
  function fmtPct(frac) {
    var p = frac * 100;
    if (p >= 10) return p.toFixed(1) + '%';
    if (p >= 1) return p.toFixed(2) + '%';
    if (p >= 0.01) return p.toFixed(3) + '%';
    if (p > 0) return p.toPrecision(2) + '%';
    return '0%';
  }

  function pieChart(opts) {
    var items = (opts.items || []).filter(function (it) { return it.value > 0; });
    if (!items.length) return null;

    // Heaviest first — a legend in insertion order makes the reader hunt.
    items = items.slice().sort(function (a, b) { return b.value - a.value; });
    var total = items.reduce(function (a, it) { return a + it.value; }, 0);
    if (!(total > 0)) return null;

    var size = opts.size || 260;
    var cx = size / 2, cy = size / 2;
    var rOuter = size * 0.42, rInner = size * 0.24;

    var wrap = document.createElement('div');
    wrap.className = 'pie-wrap';

    var s = svgRoot(size, size, 'pie-chart');
    s.setAttribute('style', 'max-width:' + size + 'px');

    var caption = document.createElement('div');
    caption.className = 'pie-caption';

    function setCaption(it) {
      caption.innerHTML = '';
      if (!it) {
        caption.textContent = opts.emptyCaption || 'Hover a slice for its share.';
        caption.classList.add('muted');
        return;
      }
      caption.classList.remove('muted');
      var frac = it.value / total;
      var sw = document.createElement('span');
      sw.className = 'pie-cap-swatch';
      sw.style.background = it.color;
      var name = document.createElement('strong');
      name.textContent = it.label;
      var detail = document.createElement('span');
      detail.className = 'pie-cap-detail';
      detail.textContent = opts.valueFormat ? opts.valueFormat(it.value, frac, it) : fmtPct(frac);
      caption.appendChild(sw);
      caption.appendChild(name);
      caption.appendChild(detail);
    }

    // Arc path. A single slice covering the whole circle cannot be drawn with
    // one arc command, so it becomes two half-arcs.
    function arcPath(a0, a1) {
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      var x0 = cx + rOuter * Math.cos(a0), y0 = cy + rOuter * Math.sin(a0);
      var x1 = cx + rOuter * Math.cos(a1), y1 = cy + rOuter * Math.sin(a1);
      var ix1 = cx + rInner * Math.cos(a1), iy1 = cy + rInner * Math.sin(a1);
      var ix0 = cx + rInner * Math.cos(a0), iy0 = cy + rInner * Math.sin(a0);
      return 'M' + x0.toFixed(2) + ' ' + y0.toFixed(2) +
             ' A' + rOuter + ' ' + rOuter + ' 0 ' + large + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) +
             ' L' + ix1.toFixed(2) + ' ' + iy1.toFixed(2) +
             ' A' + rInner + ' ' + rInner + ' 0 ' + large + ' 0 ' + ix0.toFixed(2) + ' ' + iy0.toFixed(2) + ' Z';
    }

    var slices = {};
    var angle = -Math.PI / 2;                     // start at 12 o'clock
    items.forEach(function (it, i) {
      var sweep = (it.value / total) * Math.PI * 2;
      // Guard against a hairline slice vanishing entirely.
      var end = angle + Math.max(sweep, 0.004);
      var key = it.key || it.label;
      var p = el('path', {
        d: (items.length === 1 ? arcPath(angle, angle + Math.PI) + ' ' + arcPath(angle + Math.PI, angle + Math.PI * 2)
                               : arcPath(angle, end)),
        fill: it.color, class: 'pie-slice', 'data-key': key
      });
      p.addEventListener('mouseenter', function () { highlight(key); });
      p.addEventListener('mouseleave', function () { highlight(null); });
      slices[key] = { path: p, item: it };
      s.appendChild(p);
      angle = end;
    });

    // Centre label: the total.
    if (opts.centreLabel) {
      s.appendChild(el('text', { x: cx, y: cy - 2, class: 'pie-centre', 'text-anchor': 'middle' }, opts.centreLabel));
      if (opts.centreSub) {
        s.appendChild(el('text', { x: cx, y: cy + 14, class: 'pie-centre-sub', 'text-anchor': 'middle' }, opts.centreSub));
      }
    }

    // Legend, same order as the slices.
    var legend = document.createElement('div');
    legend.className = 'pie-legend';
    var rows = {};
    items.forEach(function (it) {
      var key = it.key || it.label;
      var row = document.createElement('button');
      row.className = 'pie-legend-row';
      row.setAttribute('data-key', key);
      var sw = document.createElement('span');
      sw.className = 'pie-swatch';
      sw.style.background = it.color;
      var nm = document.createElement('span');
      nm.className = 'pie-legend-name';
      nm.textContent = it.label;
      var pc = document.createElement('span');
      pc.className = 'pie-legend-pct';
      pc.textContent = fmtPct(it.value / total);
      row.appendChild(sw); row.appendChild(nm); row.appendChild(pc);
      row.addEventListener('mouseenter', function () { highlight(key); });
      row.addEventListener('mouseleave', function () { highlight(null); });
      rows[key] = row;
      legend.appendChild(row);
    });

    function highlight(key) {
      Object.keys(slices).forEach(function (k) {
        slices[k].path.classList.toggle('dimmed', key != null && k !== key);
        slices[k].path.classList.toggle('active', key != null && k === key);
        if (rows[k]) rows[k].classList.toggle('active', key != null && k === key);
      });
      setCaption(key != null && slices[key] ? slices[key].item : null);
    }

    setCaption(null);
    var chartCol = document.createElement('div');
    chartCol.className = 'pie-col';
    chartCol.appendChild(s);
    chartCol.appendChild(caption);
    wrap.appendChild(chartCol);
    wrap.appendChild(legend);

    wrap.__highlight = highlight;
    return wrap;
  }

  /* ======================================================================
     POTENCY CHART — horizontal log-scale comparison
     ====================================================================== */

  /** opts: { items: [{label, value, sublabel, confidence, highlight}], valueFormat, title } */
  function potencyChart(opts) {
    var items = opts.items;
    var W = 980, rowH = 26, top = 34, bottom = 34;
    var H = top + items.length * rowH + bottom;
    // Right margin has to hold "545× · 55 µg"-style labels without clipping.
    var M = { l: 190, r: 168 };
    var iw = W - M.l - M.r;
    var s = svgRoot(W, H, 'potency-chart');

    var vals = items.map(function (i) { return i.value; }).filter(function (v) { return v > 0; });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    lo = Math.pow(10, Math.floor(Math.log10(lo)));
    hi = Math.pow(10, Math.ceil(Math.log10(hi)));
    var x = logScale(lo, hi, M.l, M.l + iw);

    // decade gridlines
    for (var e = Math.log10(lo); e <= Math.log10(hi) + 1e-9; e++) {
      var v = Math.pow(10, e), px = x(v);
      s.appendChild(el('line', { x1: px, x2: px, y1: top - 10, y2: H - bottom + 4, class: 'grid' }));
      s.appendChild(el('text', { x: px, y: H - bottom + 20, class: 'axis-label', 'text-anchor': 'middle' },
        v >= 1 ? v + '×' : '1/' + Math.round(1 / v) + '×'));
    }

    // 1x reference line
    if (lo <= 1 && hi >= 1) {
      var rx = x(1);
      s.appendChild(el('line', { x1: rx, x2: rx, y1: top - 12, y2: H - bottom + 4, class: 'ref-line' }));
    }

    items.forEach(function (it, i) {
      var cy = top + i * rowH + rowH / 2;
      var x0 = x(1) , x1 = x(it.value);
      var bx0 = Math.min(x0, x1), bw = Math.abs(x1 - x0);

      s.appendChild(el('text', {
        x: M.l - 12, y: cy + 4, class: 'row-label' + (it.highlight ? ' highlight' : ''), 'text-anchor': 'end'
      }, it.label));

      s.appendChild(el('rect', {
        x: bx0, y: cy - 7, width: Math.max(2, bw), height: 14, rx: 3,
        fill: it.highlight ? 'var(--accent)' : (it.value >= 1 ? '#5b9dd9' : '#6b6b7a'),
        opacity: it.confidence === 'measured' ? 0.9 : 0.5
      }));
      if (it.confidence !== 'measured') {
        s.appendChild(el('rect', {
          x: bx0, y: cy - 7, width: Math.max(2, bw), height: 14, rx: 3,
          fill: 'none', stroke: it.highlight ? 'var(--accent)' : '#8a8a99',
          'stroke-width': 1, 'stroke-dasharray': '3 2'
        }));
      }
      s.appendChild(el('text', {
        x: M.l + iw + 8, y: cy + 4, class: 'value-label'
      }, opts.valueFormat ? opts.valueFormat(it) : it.value.toFixed(2) + '×'));
    });

    return s;
  }

  /* ======================================================================
     PATHWAY DIAGRAM — parent drug -> enzymes -> metabolites
     ====================================================================== */

  /** opts: { drug } */
  /**
   * Parent -> enzyme -> product(s).
   *
   * A pathway can fork: one enzyme, several products, with different fates.
   * Those are drawn as one enzyme node branching into stacked product boxes
   * rather than as repeated enzyme rows, because repeating the enzyme implies
   * two independent pathways when there is only one.
   *
   * Nodes carry data-* attributes so the page can make them clickable — an
   * enzyme opens the enzyme panel, a product opens that metabolite's detail.
   */
  /**
   * Metabolic pathway diagram.
   *
   * opts: { showAll }
   *
   * Two things changed here and they are related.
   *
   * NOTHING IS TRUNCATED. Product names used to be cut at 28 characters, so
   * "Nordazepam (desmethyldiazepam)" read as "Nordazepam (desmethyldiazep…" —
   * a diagram whose job is to name the compound, declining to name it. Labels
   * wrap onto as many lines as they need and the boxes grow to fit, breaking
   * at spaces, hyphens and slashes so chemical names split where a chemist
   * would split them.
   *
   * THE CHAIN CONTINUES. A metabolite is usually metabolised in turn, and the
   * data already knew that — LAAM's second demethylation and
   * N-methylclonazepam's nitroreduction were drawn as second enzyme boxes
   * hanging off the parent with an "on <intermediate>" label, because there
   * was nowhere else to put them. Now they hang off the intermediate itself,
   * where they belong. `showAll` follows the chain until nothing further is
   * recorded; without it the diagram stops at the compound's direct
   * metabolites, which is what most questions are about and keeps the default
   * view readable.
   */
  var PW = {
    compW: 210, enzW: 170, colGap: 45,
    padX: 20, padTop: 26, padBottom: 20,
    lineH: 14, boxPadY: 11, minBoxH: 32, vGap: 12,
    // Characters per line, derived from the box width and the font size the
    // stylesheet gives each class. Estimated rather than measured, because
    // SVG text cannot be measured before it is in the document.
    compChars: 30, enzChars: 21,
    maxDepth: 6, maxNodes: 90
  };

  /**
   * Split a label into lines that fit, breaking after spaces, hyphens and
   * slashes. Chemical names are long and mostly unspaced, so hyphen breaking
   * is what makes the difference between three tidy lines and one that
   * overflows the box.
   */
  function wrapLabel(text, maxChars) {
    var tokens = [], buf = '';
    String(text == null ? '' : text).split('').forEach(function (ch) {
      buf += ch;
      if (ch === ' ' || ch === '-' || ch === '/' || ch === ',') { tokens.push(buf); buf = ''; }
    });
    if (buf) tokens.push(buf);

    var lines = [], cur = '';
    tokens.forEach(function (t) {
      // A single unbreakable run longer than the line is split rather than
      // allowed to overflow — better a hard wrap than a clipped name.
      while (t.length > maxChars) {
        if (cur) { lines.push(cur); cur = ''; }
        lines.push(t.slice(0, maxChars));
        t = t.slice(maxChars);
      }
      if ((cur + t).replace(/\s+$/, '').length > maxChars && cur) { lines.push(cur.replace(/\s+$/, '')); cur = t; }
      else cur += t;
    });
    if (cur.replace(/\s+$/, '')) lines.push(cur.replace(/\s+$/, ''));
    return lines.length ? lines : [''];
  }

  /** A multi-line SVG label, centred on (x, cy). */
  function labelLines(lines, x, cy, cls) {
    var g = el('g');
    var y0 = cy - ((lines.length - 1) * PW.lineH) / 2 + 4;
    lines.forEach(function (ln, i) {
      g.appendChild(el('text', {
        x: x, y: y0 + i * PW.lineH, class: cls, 'text-anchor': 'middle'
      }, ln));
    });
    return g;
  }

  function bareCompound(name) {
    return String(name).replace(/\s*\(.*\)\s*$/, '').trim();
  }

  function pathwayDiagram(drug, opts) {
    opts = opts || {};
    var showAll = !!opts.showAll;
    // A route can declare its own metabolism; when it does, that is the block
    // to draw rather than the compound's. See db.js.
    var rootMeta = opts.metabolism || drug.metabolism;
    var rootPaths = rootMeta.pathways || [];
    if (!rootPaths.length) return null;

    var norm = DB.norm;
    var nodeCount = 0;
    var truncatedChain = false;

    /* ---------- 1. build the tree ---------- */

    // Steps written on the ROOT entry that declare they act on an
    // intermediate rather than on the parent.
    function rootStepsOn(name) {
      // Tolerant of parenthesised aliases, so a step declared `from:
      // 'Norclobazam'` still attaches to the product written
      // 'N-desmethylclobazam (norclobazam)'.
      return rootPaths.filter(function (p) {
        return p.from && DB.refersTo(p.from, name);
      }).map(function (p) { return { path: p, owner: drug }; });
    }

    // ...plus whatever the intermediate's own entry says about itself, when it
    // has one. That is where the chain actually gets its depth: nordazepam's
    // page knows it becomes oxazepam, and diazepam's does not have to repeat it.
    function ownStepsOf(entry) {
      if (!entry || entry.id === drug.id) return [];
      return (entry.metabolism.pathways || [])
        .filter(function (p) { return !p.from; })
        .map(function (p) { return { path: p, owner: entry }; });
    }

    var onPath = Object.create(null);      // cycle guard along the current branch
    var expandedOnce = Object.create(null); // draw each compound's onward chain once
    var consumedFrom = Object.create(null);

    function build(name, entry, level, isRoot) {
      var node = {
        name: name, entry: entry, level: level, isRoot: isRoot,
        lines: wrapLabel(name, PW.compChars), steps: []
      };
      nodeCount++;

      var key = norm(bareCompound(name));
      // Several routes converge on the same metabolite — diazepam reaches
      // oxazepam directly, through nordazepam and through temazepam — and
      // expanding it under each of them drew the same tail three times. The
      // first occurrence carries the chain; the rest are drawn as boxes and
      // marked, so the picture stays a picture.
      if (!isRoot && expandedOnce[key]) { node.repeat = true; return node; }
      if (onPath[key] || level > PW.maxDepth || nodeCount > PW.maxNodes) {
        if (!isRoot) truncatedChain = true;
        return node;
      }
      onPath[key] = true;
      if (!isRoot) expandedOnce[key] = true;

      var steps;
      if (isRoot) {
        steps = rootPaths.filter(function (p) { return !p.from; })
          .map(function (p) { return { path: p, owner: drug }; });
      } else if (showAll) {
        var fromSteps = rootStepsOn(name);
        fromSteps.forEach(function (st) { consumedFrom[norm(st.path.from)] = true; });
        steps = fromSteps.concat(ownStepsOf(entry));
      } else {
        steps = [];
      }

      steps.forEach(function (st) {
        var prods = (st.path.products && st.path.products.length)
          ? st.path.products
          : [{ name: st.path.product, fraction: st.path.fraction }];

        var children = prods.map(function (prod) {
          var bare = bareCompound(prod.name);
          var childEntry = DB.get(bare);
          if (childEntry && childEntry.id === drug.id) childEntry = null;

          // A collapsed conjugate group is terminal by construction — it
          // stands for a set of excretion products, not for one compound.
          var child = (showAll && !prod.covers)
            ? build(prod.name, childEntry, level + 1, false)
            : { name: prod.name, entry: childEntry, level: level + 1, isRoot: false,
                lines: wrapLabel(prod.name, PW.compChars), steps: [] };

          child.prod = prod;
          child.listOwner = st.owner;
          return child;
        });

        node.steps.push({ path: st.path, owner: st.owner, products: children });
      });

      delete onPath[key];
      return node;
    }

    var root = build(drug.name, drug, 0, true);

    // Any `from:` step whose intermediate never appeared as a product would
    // otherwise vanish. Hang it off the root with the old "on <compound>"
    // label rather than dropping information on the floor.
    if (showAll) {
      rootPaths.forEach(function (p) {
        if (!p.from || consumedFrom[norm(p.from)]) return;
        var prods = (p.products && p.products.length) ? p.products
          : [{ name: p.product, fraction: p.fraction }];
        root.steps.push({
          path: p, owner: drug, orphan: true,
          products: prods.map(function (prod) {
            return {
              name: prod.name, entry: DB.get(bareCompound(prod.name)),
              level: 1, isRoot: false, lines: wrapLabel(prod.name, PW.compChars),
              steps: [], prod: prod, listOwner: drug
            };
          })
        });
      });
    }

    /* ---------- 2. measure and place ---------- */

    function boxH(node) {
      var extra = (node.repeat || (node.prod && node.prod.covers)) ? 10 : 0;
      return Math.max(PW.minBoxH, node.lines.length * PW.lineH + PW.boxPadY + extra);
    }
    function enzBoxH(step) {
      step.enzLines = wrapLabel(step.path.enzyme, PW.enzChars);
      if (step.orphan && step.path.from) step.enzLines.push('on ' + step.path.from);
      return Math.max(30, step.enzLines.length * PW.lineH + 10);
    }

    function measure(node) {
      var childTotal = 0;
      node.steps.forEach(function (st) {
        st.enzH = enzBoxH(st);
        var stH = 0;
        st.products.forEach(function (pn) { stH += measure(pn); });
        st.blockH = Math.max(stH, st.enzH + PW.vGap);
        childTotal += st.blockH;
      });
      node.boxH = boxH(node);
      node.height = Math.max(node.boxH + PW.vGap, childTotal);
      return node.height;
    }

    function place(node, yTop) {
      node.cy = yTop + node.height / 2;
      var childTotal = node.steps.reduce(function (a, st) { return a + st.blockH; }, 0);
      var y = childTotal < node.height ? yTop + (node.height - childTotal) / 2 : yTop;
      node.steps.forEach(function (st) {
        var stTop = y;
        var prodTotal = st.products.reduce(function (a, pn) { return a + pn.height; }, 0);
        var py = prodTotal < st.blockH ? stTop + (st.blockH - prodTotal) / 2 : stTop;
        st.products.forEach(function (pn) { place(pn, py); py += pn.height; });
        st.cy = stTop + st.blockH / 2;
        y += st.blockH;
      });
    }

    measure(root);
    place(root, PW.padTop);

    /* ---------- 3. draw ---------- */

    var maxLevel = 0;
    (function depth(n) {
      if (n.level > maxLevel) maxLevel = n.level;
      n.steps.forEach(function (st) { st.products.forEach(depth); });
    })(root);

    var levelW = PW.compW + PW.enzW + 2 * PW.colGap;
    var W = PW.padX * 2 + PW.compW + maxLevel * levelW;
    var H = PW.padTop + root.height + PW.padBottom;
    var s = svgRoot(W, H, 'pathway-diagram');
    // Wide chains scroll inside .chart-wrap rather than shrinking the text to
    // nothing; the default .chart min-width is far too small for these.
    s.setAttribute('style', 'min-width:' + Math.min(W, 1600) + 'px');

    var xComp = function (level) { return PW.padX + PW.compW / 2 + level * levelW; };
    var xEnz = function (level) { return xComp(level) + PW.compW / 2 + PW.colGap + PW.enzW / 2; };

    function drawCompound(node) {
      var x = xComp(node.level);
      var cls, title;
      if (node.isRoot) {
        cls = 'node node-parent';
        title = node.name;
      } else {
        var ownerMeta = node.listOwner === drug ? rootMeta : (node.listOwner || drug).metabolism;
        var matched = DB.matchMetabolite(node.name, ownerMeta.metabolites);
        var active = node.prod && node.prod.active != null
          ? node.prod.active
          : !!(matched && matched.active);
        cls = 'node ' + (active ? 'node-active' : 'node-inactive');
        title = node.name + (active ? ' — active' : ' — inactive') +
          (node.prod && node.prod.covers ? '. Stands for ' + node.prod.covers.length + ' conjugates.' : '') +
          '. Click for detail.';
      }

      var g = el('g', node.isRoot ? {} : {
        class: 'node-hit node-hit-product' + (node.repeat ? ' node-repeat' : ''),
        'data-metabolite': node.name,
        'data-owner': (node.listOwner || drug).id
      });
      g.appendChild(el('rect', {
        x: x - PW.compW / 2, y: node.cy - node.boxH / 2,
        width: PW.compW, height: node.boxH, rx: 6, class: cls
      }));
      g.appendChild(labelLines(node.lines, x, node.cy, 'node-text'));
      var footer = node.prod && node.prod.covers
        ? node.prod.covers.length + ' products'
        : (node.repeat ? 'chain shown above' : null);
      if (footer) {
        g.appendChild(el('text', {
          x: x, y: node.cy + node.boxH / 2 - 4, class: 'node-subtext', 'text-anchor': 'middle'
        }, footer));
      }
      g.appendChild(el('title', {}, title +
        (node.repeat ? ' Reached by more than one route; its own metabolism is drawn at its first appearance.' : '')));
      s.appendChild(g);
    }

    function drawSubtree(node) {
      drawCompound(node);
      var xSrc = xComp(node.level) + PW.compW / 2;
      var xe = xEnz(node.level);

      node.steps.forEach(function (st) {
        var frac = st.path.fraction;
        var w = frac ? Math.max(1.5, Math.min(9, frac * 12)) : 1.5;

        // source -> enzyme
        s.appendChild(el('path', {
          d: 'M' + xSrc + ' ' + node.cy +
             ' C' + (xSrc + 40) + ' ' + node.cy + ', ' + (xe - PW.enzW / 2 - 40) + ' ' + st.cy +
             ', ' + (xe - PW.enzW / 2) + ' ' + st.cy,
          fill: 'none', class: 'flow', 'stroke-width': w
        }));

        var enzymeNames = String(st.path.enzyme || '').split('/')
          .map(function (e) { return e.trim(); }).filter(Boolean);
        var gEnz = el('g', { class: 'node-hit node-hit-enzyme', 'data-enzymes': enzymeNames.join('|') });
        gEnz.appendChild(el('rect', {
          x: xe - PW.enzW / 2, y: st.cy - st.enzH / 2,
          width: PW.enzW, height: st.enzH, rx: Math.min(15, st.enzH / 2), class: 'node node-enzyme'
        }));
        gEnz.appendChild(labelLines(st.enzLines, xe, st.cy, 'node-text enzyme'));
        gEnz.appendChild(el('title', {},
          (st.orphan && st.path.from ? 'Acts on ' + st.path.from + ', not on ' + node.name + ' directly. ' : '') +
          (st.path.reaction ? st.path.reaction + '. ' : '') +
          'Show everything metabolised by, inhibiting or inducing ' + st.path.enzyme));
        s.appendChild(gEnz);

        st.products.forEach(function (pn) {
          var xp = xComp(pn.level) - PW.compW / 2;
          var pw = pn.prod && pn.prod.fraction
            ? Math.max(1.5, Math.min(9, pn.prod.fraction * 12)) : w;

          s.appendChild(el('path', {
            d: 'M' + (xe + PW.enzW / 2) + ' ' + st.cy +
               ' C' + (xe + PW.enzW / 2 + 30) + ' ' + st.cy + ', ' + (xp - 40) + ' ' + pn.cy +
               ', ' + xp + ' ' + pn.cy,
            fill: 'none', class: 'flow', 'stroke-width': pw
          }));
          s.appendChild(el('path', { d: 'M' + xp + ' ' + pn.cy + ' l-7 -4 l0 8 z', class: 'flow-head' }));

          if (pn.prod && pn.prod.fraction) {
            s.appendChild(el('text', {
              x: (xe + PW.enzW / 2 + xp) / 2, y: pn.cy - 7,
              class: 'flow-label', 'text-anchor': 'middle'
            }, Math.round(pn.prod.fraction * 100) + '%'));
          }

          drawSubtree(pn);
        });
      });
    }

    drawSubtree(root);

    if (truncatedChain) {
      s.appendChild(el('text', {
        x: W - PW.padX, y: H - 6, class: 'flow-label', 'text-anchor': 'end'
      }, 'chain truncated — some branches loop back or run deeper than shown'));
    }

    return s;
  }

  /**
   * How many further steps exist beyond the direct metabolites.
   *
   * Used to label the Show-all toggle, so the deeper chain is discoverable
   * rather than something you have to click to find out about.
   */
  function pathwayDepthBeyondFirst(drug) {
    var rootPaths = drug.metabolism.pathways || [];
    var extra = rootPaths.filter(function (p) { return p.from; }).length;
    var seen = Object.create(null);
    rootPaths.filter(function (p) { return !p.from; }).forEach(function (p) {
      (p.products || []).forEach(function (prod) {
        if (prod.covers) return;
        var e = DB.get(bareCompound(prod.name));
        if (!e || e.id === drug.id || seen[e.id]) return;
        seen[e.id] = 1;
        extra += (e.metabolism.pathways || []).filter(function (x) { return !x.from; }).length;
      });
    });
    return extra;
  }

  function truncate(str, n) {
    str = String(str == null ? '' : str);
    return str.length > n ? str.slice(0, n - 1) + '…' : str;
  }

  /* ======================================================================
     STACKED BAR — solution composition by mass
     ====================================================================== */

  /** opts: { items: [{label, value, color, sublabel}], total, valueFormat } */
  function stackedBar(opts) {
    var items = opts.items.filter(function (i) { return i.value > 0; });
    var total = opts.total || items.reduce(function (a, b) { return a + b.value; }, 0);
    if (!total) return null;

    var W = 980, barH = 46, top = 16, gap = 26;
    var labelRows = Math.ceil(items.length / 3);
    var H = top + barH + gap + labelRows * 22 + 10;
    var M = { l: 12, r: 12 };
    var iw = W - M.l - M.r;
    var s = svgRoot(W, H, 'stacked-bar');

    var x = M.l;
    items.forEach(function (it, i) {
      var w = (it.value / total) * iw;
      var color = it.color || colorFor(i);
      s.appendChild(el('rect', {
        x: x, y: top, width: Math.max(0.5, w), height: barH,
        fill: color, opacity: 0.85,
        rx: i === 0 || i === items.length - 1 ? 3 : 0
      }));
      // in-bar percentage when the slice is wide enough to read
      var pct = (it.value / total) * 100;
      if (w > 46) {
        s.appendChild(el('text', {
          x: x + w / 2, y: top + barH / 2 + 4, class: 'stack-pct', 'text-anchor': 'middle'
        }, pct.toFixed(1) + '%'));
      }
      x += w;
    });
    s.appendChild(el('rect', {
      x: M.l, y: top, width: iw, height: barH, fill: 'none', stroke: '#2a2e39', 'stroke-width': 1, rx: 3
    }));

    // legend grid beneath
    var perRow = 3, colW = iw / perRow;
    items.forEach(function (it, i) {
      var r = Math.floor(i / perRow), c = i % perRow;
      var lx = M.l + c * colW, ly = top + barH + gap + r * 22;
      s.appendChild(el('rect', { x: lx, y: ly - 9, width: 11, height: 11, rx: 2, fill: it.color || colorFor(i) }));
      s.appendChild(el('text', { x: lx + 17, y: ly, class: 'stack-legend' },
        truncate(it.label, 22) + '  ' + ((it.value / total) * 100).toFixed(1) + '%' +
        (opts.valueFormat ? '  (' + opts.valueFormat(it.value) + ')' : '')));
    });

    return s;
  }

  /* ======================================================================
     BAR CHART — usage frequency etc.
     ====================================================================== */

  /** opts: { items: [{label, value, color}], valueFormat, height } */
  function barChart(opts) {
    var items = opts.items;
    var W = 900, H = opts.height || 260;
    var M = { t: 16, r: 16, b: 54, l: 46 };
    var iw = W - M.l - M.r, ih = H - M.t - M.b;
    var s = svgRoot(W, H, 'bar-chart');

    var max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    var y = linScale(0, max * 1.1, M.t + ih, M.t);
    var bw = iw / Math.max(1, items.length);

    niceTicks(0, max * 1.1, 4).forEach(function (v) {
      var py = y(v);
      s.appendChild(el('line', { x1: M.l, x2: M.l + iw, y1: py, y2: py, class: 'grid' }));
      s.appendChild(el('text', { x: M.l - 8, y: py + 4, class: 'axis-label', 'text-anchor': 'end' },
        opts.valueFormat ? opts.valueFormat(v) : String(Math.round(v * 10) / 10)));
    });

    items.forEach(function (it, i) {
      var x0 = M.l + i * bw + bw * 0.18;
      var w = bw * 0.64;
      var h = Math.max(0, (M.t + ih) - y(it.value));
      s.appendChild(el('rect', {
        x: x0, y: y(it.value), width: w, height: h, rx: 3,
        fill: it.color || 'var(--accent)', opacity: 0.85
      }));
      var lab = el('text', {
        x: x0 + w / 2, y: M.t + ih + 16, class: 'axis-label', 'text-anchor': 'end',
        transform: 'rotate(-35 ' + (x0 + w / 2) + ' ' + (M.t + ih + 16) + ')'
      }, truncate(it.label, 18));
      s.appendChild(lab);
    });

    s.appendChild(el('line', { x1: M.l, x2: M.l + iw, y1: M.t + ih, y2: M.t + ih, class: 'axis' }));
    return s;
  }

  global.Charts = {
    pieChart: pieChart,
    fmtPct: fmtPct,
    el: el, svgRoot: svgRoot, colorFor: colorFor, PALETTE: PALETTE,
    lineChart: lineChart, potencyChart: potencyChart,
    pathwayDiagram: pathwayDiagram, pathwayDepthBeyondFirst: pathwayDepthBeyondFirst,
    barChart: barChart, stackedBar: stackedBar,
    fmtClock: fmtClock, fmtDayClock: fmtDayClock, fmtDur: fmtDur
  };
})(window);

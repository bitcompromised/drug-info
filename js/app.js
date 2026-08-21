/* ==========================================================================
   app.js — UI
   ========================================================================== */
(function (global) {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var state = {
    tab: 'now',
    selectedDrug: null,
    windowH: 24,
    cursorMs: null,        // timeline scrub position; null = snap to now
    classOpen: {},         // Substances: which class sections are expanded
    sectionOpen: {},       // Solution: which sections are expanded
    curveMode: 'both',   // both | plasma | effect
    compareRef: null,
    compareAdded: [],
    nowPage: 'board',
    showMetabolites: true,
    // Timeline: when set, only this substance and what it turned into are
    // drawn. Not persisted — it is a way of looking at the current picture,
    // not a preference about all of them.
    timelineFocus: null,
    drugPage: 'opioid',
    drugQuery: '',
    // Substance browser: how the list is ordered, and whether it is narrowed
    // to compounds whose figures were actually measured in humans.
    drugSort: ['name', 'half-life', 'confidence'].indexOf(Store.getPrefs().drugSort) >= 0
      ? Store.getPrefs().drugSort : 'name',
    drugMeasuredOnly: Store.getPrefs().drugMeasuredOnly === true,
    historyQuery: '',
    faqQuery: '',
    historyLimit: Store.getPrefs().historyLimit != null ? Store.getPrefs().historyLimit : 5,
    // 'separate' draws one curve per dose; 'combined' sums same-substance
    // doses so the effect of redosing on the peak is visible as one shape.
    timelineMode: 'separate',
    // Pathway map depth: false stops at the direct metabolites, true follows
    // every metabolite that is itself metabolised.
    pathwayShowAll: Store.getPrefs().pathwayShowAll === true,
    // Which route's pathway set the Metabolism section shows, for the few
    // compounds whose products depend on how they are taken.
    metabolismRoute: null,
    // What the timeline charts plot on the y axis: 'percent' of a common dose
    // peak, or 'mg' actually in the body.
    timelineUnit: ['effect', 'percent', 'mg'].indexOf(Store.getPrefs().timelineUnit) >= 0
      ? Store.getPrefs().timelineUnit : 'percent'
  };

  var HOUR = 3600000;

  /* ---------- small helpers ------------------------------------------------ */

  function h(tag, attrs, children) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function confBadge(conf) {
    var map = {
      measured:  ['Measured', 'Human pharmacokinetic data from the clinical literature.'],
      estimated: ['Estimated', 'Inferred from case reports, forensic casework or limited published studies. Treat as approximate.'],
      analogue:  ['From analogue', 'No data for this compound — extrapolated from a close structural relative. Low confidence.'],
      community: ['Community', 'Consensus range published by harm-reduction wikis (PsychonautWiki, TripSit). Curated, but user-derived rather than clinical data.'],
      anecdotal: ['Opinion', 'User reports only, with no published source. This is opinion, not evidence — treat it with the most caution of any tier here.'],
      unknown:   ['No data', 'No usable information. The value shown is a placeholder so the model can run at all.']
    };
    var m = map[conf] || map.unknown;
    return h('span', { class: 'badge conf-' + conf, title: m[1] }, [m[0]]);
  }

  /**
   * Show a logged dose the way the user entered it. Displaying the normalised
   * milligram value next to the original unit label produced nonsense like
   * "28000 g" for a 28 g drink, so units Store does not convert (ml, canisters)
   * and units it does (g) are both rendered from the original amount.
   */
  var MASS_UNITS = { ng: 1e-6, ug: 1e-3, 'µg': 1e-3, mcg: 1e-3, mg: 1, g: 1e3, kg: 1e6 };

  function fmtDose(entry) {
    var u = entry.unit || 'mg';
    // Any mass unit is normalised so 0.001 g reads as 1 mg and 1500 mg as 1.5 g.
    if (MASS_UNITS[u] != null) return Potency.fmtMg(entry.amountMg);
    var n = Math.round(entry.amount * 100) / 100;
    return n + ' ' + u;
  }

  /**
   * Render a dose ladder in whatever unit reads naturally, rather than in
   * whatever unit the data happens to be stored in — so LSD shows
   * "75–150 µg" instead of "0.075–0.15 mg".
   * Non-mass ladder units (ml, canisters, inhalations) pass through unchanged.
   */
  function ladderSteps(doses) {
    var unit = doses.unit || 'mg';
    var scale = MASS_UNITS[unit];
    var isMass = scale != null;

    return [['threshold', doses.threshold], ['light', doses.light], ['common', doses.common],
            ['strong', doses.strong], ['heavy', doses.heavy]]
      .filter(function (p) { return p[1] != null; })
      .map(function (p) {
        var tier = p[0], v = p[1], text;
        if (isMass) {
          if (Array.isArray(v)) text = Potency.fmtRangeMg(v[0] * scale, v[1] * scale);
          else text = Potency.fmtMg(v * scale) + (tier === 'heavy' ? '+' : '');
        } else {
          // Only the open-ended top tier gets a trailing "+".
          text = (Array.isArray(v) ? v[0] + '–' + v[1] : v + (tier === 'heavy' ? '+' : '')) + ' ' + unit;
        }
        return { tier: tier, text: text };
      });
  }

  /**
   * Route keys are identifiers, and the stylesheet capitalises them for
   * display. That works for every route whose name is a word and produces
   * "Iv" and "Im" for the two that are initialisms.
   */
  var ROUTE_LABEL = { iv: 'IV', im: 'IM' };
  function routeLabel(k) { return ROUTE_LABEL[k] || k; }

  function ladderEl(doses) {
    return h('div', { class: 'ladder' }, ladderSteps(doses).map(function (s) {
      return h('span', { class: 'ladder-step tier-' + s.tier }, [
        h('b', { text: s.tier }), ' ' + s.text
      ]);
    }));
  }

  function levelPill(level) {
    var L = Interactions.LEVELS[level];
    return h('span', { class: 'pill level-' + level, title: L.desc }, [L.label]);
  }

  /* ======================================================================
     CURVE ENGINE — shared by Now / Timeline / Curves
     ====================================================================== */

  /**
   * Build PK curves for every logged dose in a window, applying metabolic
   * interactions from whatever else was on board at the time.
   */
  function buildCurves(t0, t1) {
    var logs = Store.load().filter(function (l) {
      var d = DB.get(l.drugId);
      if (!d) return false;
      var tail = (d.halfLife.hours || 4) * 8 * HOUR;
      return l.timeMs <= t1 && (l.timeMs + tail) >= t0;
    });

    return logs.map(function (l) {
      var drug = DB.get(l.drugId);

      // Which other drugs were plausibly present when this dose was taken?
      var coDrugs = [];
      logs.forEach(function (o) {
        if (o.id === l.id) return;
        var od = DB.get(o.drugId);
        if (!od) return;
        var window_ = (od.halfLife.hours || 4) * 5 * HOUR;
        if (o.timeMs <= l.timeMs && (l.timeMs - o.timeMs) <= window_) coDrugs.push(od);
        else if (o.timeMs > l.timeMs && (o.timeMs - l.timeMs) <= (drug.halfLife.hours || 4) * 3 * HOUR) coDrugs.push(od);
      });

      // The user's metaboliser status is just another half-life modifier, in
      // the same shape the interaction engine emits, so the model consumes it
      // without needing to know it came from a settings panel rather than from
      // a co-administered drug.
      var mods = Interactions.halfLifeModifiers(drug, coDrugs);
      var pm = Profile.halfLifeModifier(drug);
      if (pm) mods = mods.concat([pm]);
      var eff = PK.effectiveHalfLife(drug, mods);

      var curve = PK.buildDoseCurve(drug, l.route, l.amountMg, l.timeMs / HOUR, {
        halfLifeH: eff.hours,
        // Body mass scales how much effect a given number of milligrams
        // produces, without moving the dose tier — the ladder is a population
        // figure and should keep saying what the literature says.
        effectScale: Profile.massScale()
      });
      curve.entry = l;
      curve.modifiers = mods;
      curve.baseHalfLife = eff.base;
      return curve;
    });
  }

  /**
   * A line on the half-life section explaining what the user's metaboliser
   * setting does to this specific compound — including the case where it
   * points the opposite way, for a prodrug.
   */
  function cypNoteFor(d) {
    var p = Profile.get();
    if (!p.applyToEstimates) return null;
    var factor = Profile.halfLifeFactor(d, p);
    var prodrug = Profile.prodrugWarning(d, p);
    var fr = Profile.cypFractions(d);
    var enzymes = Object.keys(fr).sort(function (a, b) { return fr[b] - fr[a]; });

    if (factor === 1 && !prodrug) {
      if (!enzymes.length) return null;
      return h('div', { class: 'note note-profile' }, [
        h('strong', { text: 'Your metaboliser settings do not affect this compound. ' }),
        'It is cleared by ' + enzymes.join(', ') + ', and you are set to normal for ' +
        (enzymes.length === 1 ? 'that one' : 'all of those') + '.'
      ]);
    }
    var pct = Math.round(Profile.cypFraction(d) * 100);
    // Which enzyme, and how much of the clearance it accounts for — the
    // setting is per enzyme now, so naming one is the only way the figure
    // can be checked against the settings panel.
    var split = enzymes.map(function (e) {
      return e + ' ' + Math.round(fr[e] * 100) + '% (' +
        Profile.CYP_LABEL[Profile.cypSetting(e, p)].replace(/ \(.*\)$/, '').toLowerCase() + ')';
    }).join(', ');
    return h('div', { class: 'note note-profile' }, [
      h('strong', { text: 'Adjusted for your profile: ' }),
      pct + '% of this compound\'s clearance is CYP-dependent — ' + split +
      '. Estimated half-life ' +
      Charts.fmtDur(d.halfLife.hours * factor) + ' rather than the population figure of ' +
      Charts.fmtDur(d.halfLife.hours) + ' (×' + factor.toFixed(2) + ').',
      prodrug ? h('p', { class: 'small', style: 'margin:6px 0 0' }, [
        h('strong', { text: 'But note: ' }), prodrug
      ]) : null
    ]);
  }

  /* ---------- combined vs separate ----------------------------------------
     One display mode drives the whole Now tab. Showing the timeline merged by
     substance while the cards underneath still listed each dose separately
     meant the two halves of the same screen disagreed about how many things
     were on board.

     Separate is the honest default: each dose is its own event with its own
     onset and offset. Combined answers what separate cannot — when you redose,
     what is the total actually doing.
     ------------------------------------------------------------------------ */

  function isCombined() { return state.timelineMode === 'combined'; }

  /**
   * Group per-dose readings into what should be drawn as one card or row.
   *
   * `readings` are the objects the Now and scrub views already build:
   * { curve, effect, conc, remaining, ... }. In combined mode the numbers are
   * summed, which is the standard first approximation for concurrent doses of
   * the same substance and is exactly the thing a person redosing wants to see.
   * It is an approximation — real receptor occupancy saturates — and the UI
   * says so rather than implying the sum is a measurement.
   */
  /**
   * Everything the app says in milligrams comes from the curve's own
   * `amountMgAt`, which is the Bateman amount in the central compartment.
   *
   * It used to be derived from `fractionRemaining`, which was 1 for the whole
   * absorption phase — so a dose read at its full absorbed weight the instant
   * it was logged and sat flat until tmax. Oral methamphetamine reported 67 mg
   * six seconds after swallowing, where the real figure is 0.8 mg, and every
   * milligram curve stepped vertically at each dose instead of rising.
   */
  /**
   * Everything a dose will ever put into the body, in milligrams.
   *
   * This is what CROSSED the membrane, not what survived the trip as the
   * parent compound, and the difference is the whole of first-pass
   * metabolism. It used to be `bioavailability × dose`, which for a route
   * that destroys the parent on the way in is not an absorption figure at
   * all: a gram of swallowed heroin reported 20 mg absorbed, when 350 mg of
   * it crosses the gut and essentially all of that goes on to be morphine.
   *
   * It also broke mass balance, quietly, on every ordinary oral dose. The
   * presystemically extracted share is metabolised — it is what the
   * metabolites are made of — but counting only the surviving parent as
   * "absorbed" left that share out of "eliminated" while its products were
   * still counted in full. A gram of oral diazepam could show 75 mg of
   * nordazepam and 45 mg of temazepam against 104 mg of parent eliminated,
   * which is 120 mg of products from 104 mg of precursor.
   */
  function absorbedMgOf(curve) {
    var r = curve.route;
    var fa = r.absorbedFraction != null ? r.absorbedFraction
           : (r.bioavailability != null ? r.bioavailability : 1);
    return fa * curve.doseMg;
  }

  /**
   * Where one dose's mass has got to at a given moment.
   *
   * One place computes it, so the meters, the card-retirement test and the
   * metabolite formation can never disagree about how much parent has been
   * consumed. Everything balances against `absorbable`:
   *
   *     absorbable = absorbedSoFar + still to absorb
   *     absorbedSoFar = circulating + eliminated
   */
  function doseBalance(c, tH) {
    var absorbable = absorbedMgOf(c);
    var since = tH - c.tStartH;
    if (!(since > 0)) {
      return { absorbable: absorbable, absorbedSoFar: 0, circulating: 0,
               eliminated: 0, notEliminated: absorbable, eliminatedFrac: 0 };
    }
    var absorbedSoFar = absorbable * (1 - Math.exp(-c.ka * since));
    var circulating = c.amountMgAt(tH);
    // Presystemic extraction shows up here the instant absorption starts,
    // which is exactly right: that drug is gone as the parent.
    var eliminated = Math.max(0, absorbedSoFar - circulating);
    return {
      absorbable: absorbable,
      absorbedSoFar: absorbedSoFar,
      circulating: circulating,
      eliminated: eliminated,
      notEliminated: Math.max(0, absorbable - eliminated),
      eliminatedFrac: absorbable > 0 ? eliminated / absorbable : 0
    };
  }

  function groupReadings(readings) {
    if (!isCombined()) {
      return readings.map(function (a) {
        return {
          drug: a.curve.drug,
          readings: [a],
          curves: [a.curve],
          primary: a,
          effect: a.effect,
          conc: a.conc,
          // Circulating right now, and the share of the dose not yet
          // eliminated. Two different questions: the first falls once
          // elimination outruns absorption, the second only ever falls.
          remainingMg: a.amountMg,
          notEliminatedMg: a.balance.notEliminated,
          absorbedMg: a.balance.absorbable,
          absorbedSoFarMg: a.balance.absorbedSoFar,
          eliminatedMg: a.balance.eliminated,
          totalDoseMg: a.curve.doseMg,
          count: 1
        };
      });
    }
    var groups = [], byId = {};
    readings.forEach(function (a) {
      var id = a.curve.drug.id;
      if (!byId[id]) {
        byId[id] = {
          drug: a.curve.drug, readings: [], curves: [],
          primary: a, effect: 0, conc: 0, remainingMg: 0, notEliminatedMg: 0,
          absorbedMg: 0, absorbedSoFarMg: 0, eliminatedMg: 0, totalDoseMg: 0, count: 0
        };
        groups.push(byId[id]);
      }
      var g = byId[id];
      g.readings.push(a);
      g.curves.push(a.curve);
      g.effect += a.effect;
      g.conc += a.conc;
      g.remainingMg += a.amountMg;
      g.notEliminatedMg += a.balance.notEliminated;
      g.absorbedMg += a.balance.absorbable;
      g.absorbedSoFarMg += a.balance.absorbedSoFar;
      g.eliminatedMg += a.balance.eliminated;
      g.totalDoseMg += a.curve.doseMg;
      g.count++;
      // Keep the most recent dose as the representative for phase and timing.
      if (a.curve.tStartH > g.primary.curve.tStartH) g.primary = a;
    });
    return groups;
  }

  function sampleSeries(curves, t0, t1, fn, steps) {
    steps = steps || 260;
    var dt = (t1 - t0) / steps;
    var byDrug = {};
    curves.forEach(function (c) {
      var key = c.drug.id;
      if (!byDrug[key]) byDrug[key] = { drug: c.drug, curves: [] };
      byDrug[key].curves.push(c);
    });
    return Object.keys(byDrug).map(function (key, i) {
      var grp = byDrug[key];
      var pts = [];
      for (var t = t0; t <= t1; t += dt) {
        var v = 0;
        grp.curves.forEach(function (c) { v += fn(c, t / HOUR); });
        pts.push([t, v]);
      }
      return { name: grp.drug.name, drug: grp.drug, points: pts, color: Charts.colorFor(i) };
    });
  }

  /* ======================================================================
     TAB: NOW — what is currently on board
     ====================================================================== */

  /* ---------- Now: three pages ---------------------------------------------
     "What is on board", "what does it look like over time" and "what have I
     taken" are three questions, and stacking all three on one scroll made the
     tab enormous. They are pages now, sharing one header so the display mode
     and the New log button stay put while you move between them.
     ------------------------------------------------------------------------ */

  var NOW_PAGES = [
    { key: 'board',    label: 'Currently on board' },
    { key: 'timeline', label: 'Timeline' },
    // Not a view of the log: a hypothetical about a schedule you have not
    // taken yet. It sits here because it runs on the same model.
    { key: 'schedule', label: 'Steady state' },
    { key: 'history',  label: 'Dose history' }
  ];

  function renderNow(root) {
    var now = Date.now();

    if (hasExample()) root.appendChild(exampleBanner());

    /* The header used to carry the same three controls on all four pages,
       including the two where two of them do nothing: the Separate/Combined
       switch has no effect on Steady state or Dose history, and a clock
       ticking above a hypothetical schedule is noise. A control that is
       visible but inert is worse than one that is absent — it invites a click
       and then ignores it.

       (The label on the switch used to read "Display doses / metabolites",
       which made it look like a choice between the two. It has never been
       that: it decides whether repeat doses of one substance are drawn as one
       shape or as several.) */
    var showsClock = state.nowPage === 'board';
    var showsMode = state.nowPage === 'board' || state.nowPage === 'timeline';

    root.appendChild(h('div', { class: 'section-head' }, [
      h('h2', {}, ['Now', helpLink('The Now tab')]),
      h('div', { class: 'row-actions' }, [
        showsClock ? h('span', {
          class: 'muted small', title: 'Everything on this page is modelled for this moment.',
          text: Charts.fmtDayClock(now)
        }) : null,
        showsMode ? h('span', { class: 'mode-label', text: 'Repeat doses' }) : null,
        showsMode ? timelineModePicker() : null,
        h('button', { class: 'btn primary', text: '+ New log', title: 'Log a dose  (N)', onclick: openLogModal })
      ])
    ]));

    var bar = h('div', { class: 'subtabs' });
    NOW_PAGES.forEach(function (p) {
      bar.appendChild(h('button', {
        class: 'subtab' + (state.nowPage === p.key ? ' active' : ''),
        onclick: function () { state.nowPage = p.key; render(); }
      }, [p.label]));
    });
    root.appendChild(bar);

    if (state.nowPage === 'timeline') { renderTimeline(root); return; }
    if (state.nowPage === 'schedule') { renderSchedule(root); return; }
    if (state.nowPage === 'history') { renderHistory(root); return; }
    renderOnBoard(root, now);
  }

  function renderOnBoard(root, now) {
    var curves = buildCurves(now - 96 * HOUR, now + HOUR);

    var active = curves.map(function (c) {
      return {
        curve: c,
        conc: c.concAt(now / HOUR),
        effect: c.effectAt(now / HOUR),
        // `remaining` is the share of the dose not yet eliminated; `amountMg`
        // is what is circulating. They differ most during absorption, which is
        // exactly when a card is most likely to be looked at.
        remaining: c.fractionRemaining(now / HOUR),
        amountMg: c.amountMgAt(now / HOUR),
        balance: doseBalance(c, now / HOUR)
      };
    }).filter(function (a) {
      if (a.remaining > 0.01 || a.effect > 0.01) return true;
      // Still on board if what it turned into is.
      return hasLiveMetabolites(a.curve, now / HOUR);
    }).sort(function (a, b) { return b.effect - a.effect || b.conc - a.conc; });


    if (!active.length) {
      var logged = Store.load().length;
      root.appendChild(h('div', { class: 'empty empty-lead' }, [
        h('h3', { class: 'empty-title', text: logged
          ? 'Nothing is estimated to be active right now.'
          : 'Nothing logged yet.' }),
        h('p', { class: 'muted', text: logged
          ? 'Everything you have logged has cleared, along with anything it turned into. ' +
            'The dose history and the patterns are still there.'
          : 'Log a dose and this page fills in: how much is left, what it has turned into, ' +
            'when it clears, and what it would clash with.' }),
        h('div', { class: 'empty-actions' }, [
          h('button', { class: 'btn primary', text: '+ Log a dose', onclick: openLogModal }),
          h('button', {
            class: 'btn', text: logged ? 'Dose history' : 'Browse 649 substances',
            onclick: function () { logged ? goTab('now', 'history') : goTab('drugs'); }
          })
        ]),
        h('p', { class: 'empty-hint muted small' }, [
          'Press ', h('kbd', { text: 'N' }), ' to log without reaching for the mouse, or ',
          h('kbd', { text: 'Ctrl' }), ' ', h('kbd', { text: 'K' }), ' to search every compound.'
        ])
      ]));
    } else {
      var grid = h('div', { class: 'card-grid' });
      groupReadings(active).forEach(function (g) {
        grid.appendChild(activeCard(g, now));
      });
      root.appendChild(grid);
    }

    // ---- interactions among what's active right now ----
    var activeDrugs = [];
    var seen = {};
    active.forEach(function (a) {
      if (!seen[a.curve.drug.id]) { seen[a.curve.drug.id] = 1; activeDrugs.push(a.curve.drug); }
    });

    root.appendChild(h('div', { class: 'section-head' }, [
      h('h2', { text: 'Active interactions' }),
      h('span', { class: 'muted', text: activeDrugs.length + ' substance' + (activeDrugs.length === 1 ? '' : 's') + ' on board' })
    ]));

    var findings = Interactions.amongst(activeDrugs);
    if (!findings.length) {
      root.appendChild(h('div', { class: 'empty small' }, [
        h('p', { text: activeDrugs.length < 2
          ? 'Fewer than two substances active — no combinations to evaluate.'
          : 'No interactions found between the substances currently on board.' }),
        activeDrugs.length >= 2 ? h('p', { class: 'muted small',
          text: 'Absence of a warning is not evidence of safety. Most combinations, especially involving research chemicals, have never been studied.' }) : null
      ]));
    } else {
      root.appendChild(findingsList(findings));
    }

    /* ---- no "Next 24 hours" chart here -----------------------------------
       It plotted the same effect curves the Timeline subtab now draws, one
       scroll below the cards that already report the same numbers. The
       Timeline tab is where a chart of the next day belongs. */
  }

  /**
   * One card per group, now carrying the phase-timing detail that used to sit
   * in a separate "Dose detail" list further down the tab. Two lists of the
   * same substances, one above the other, was pure duplication.
   *
   * Everything from the half-life down is collapsed by default: the top of the
   * card answers "how much and how strong", and the clock times underneath are
   * reference material.
   */
  function activeCard(g, now) {
    var c = g.primary.curve, d = g.drug;
    var tSince = (now / HOUR) - c.tStartH;
    var phase = phaseName(c, now / HOUR);
    var tClear = c.clearanceH() - tSince;
    var tHalf = c.timeToFraction(0.5) - tSince;
    var combined = g.count > 1;
    // Against what was ABSORBED, so a partly-bioavailable route still reads
    // 100% at its peak rather than capping at F.
    // The meter tracks what has NOT been eliminated, which is the thing
    // "dose remaining" means and the only one that falls monotonically. The
    // figure beneath it is what is circulating, which rises through absorption
    // and then falls — a different quantity, and both are labelled as such.
    var remainingFrac = g.absorbedMg > 0 ? g.notEliminatedMg / g.absorbedMg : 0;

    var first = g.curves.reduce(function (a, b) { return a.tStartH <= b.tStartH ? a : b; });
    var last = g.curves.reduce(function (a, b) { return a.tStartH >= b.tStartH ? a : b; });
    var fs = first.entry.timeMs, ls = last.entry.timeMs;
    var fp = first.phases, lp = last.phases;

    var card = h('div', { class: 'card' + (combined ? ' card-combined' : '') }, [
      h('div', { class: 'card-head' }, [
        h('button', { class: 'link-title', onclick: function () { openDrug(d.id); } }, [d.name]),
        combined ? h('span', { class: 'pill kind-combined', text: g.count + ' doses' }) : null,
        h('span', { class: 'pill phase-' + phase.key, text: phase.label })
      ]),
      h('div', { class: 'card-sub' }, [
        combined
          ? Potency.fmtMg(g.totalDoseMg) + ' total across ' + g.count + ' doses, last ' +
            Charts.fmtDur(tSince) + ' ago'
          : fmtDose(c.entry) + ' ' + c.entry.route + ' · ' + Charts.fmtDur(tSince) + ' ago · ' +
            c.intensityLabel().tier + ' dose'
      ]),
      meter('Effect', g.effect, Math.min(1, g.effect)),
      meter('Dose not yet eliminated', remainingFrac, remainingFrac),
      h('div', { class: 'card-figure', text: Potency.fmtMg(g.remainingMg) + ' circulating, of ' +
        Potency.fmtMg(g.absorbedMg) + ' absorbed' +
        (Math.abs(g.absorbedMg - g.totalDoseMg) > g.totalDoseMg * 0.02
          ? ' (' + Potency.fmtMg(g.totalDoseMg) + ' taken)' : '') })
    ]);

    /* ---- everything explanatory folds into one dropdown ------------------
       The summed-doses caveat, the metabolic-interaction adjustment, the
       clock times and the metabolite roster are all the same kind of thing:
       reference material you go looking for, not the headline. Loose on the
       card they pushed the meters — the part actually read at a glance — off
       the bottom of a three-column grid. */
    var detail = section('card.detail', 'More info', { open: false });

    if (combined) {
      detail.body.appendChild(h('div', { class: 'note note-small' }, [
        h('strong', { text: 'Summed. ' }),
        'Effect and remaining amount are added across doses, which is the usual first ' +
        'approximation but overstates the peak because receptor occupancy saturates. ' +
        'Phase and clearance times refer to the most recent dose.'
      ]));
    }

    if (c.modifiers.length) {
      detail.body.appendChild(h('div', { class: 'note note-warn' }, [
        h('strong', { text: 'Metabolic interaction: ' }),
        c.modifiers.map(function (m) { return m.reason; }).join('; ') +
        '. Half-life adjusted from ' + Charts.fmtDur(c.baseHalfLife) + ' to ' + Charts.fmtDur(c.halfLifeH) + '.'
      ]));
    }

    detail.body.appendChild(h('dl', { class: 'kv' }, [
      h('dt', { text: 'Half-life used' }),
      h('dd', {}, [
        Charts.fmtDur(c.halfLifeH),
        c.modifiers.length
          ? h('span', { class: 'flag' }, [' adjusted ×' + (c.halfLifeH / c.baseHalfLife).toFixed(1)])
          : null
      ]),
      h('dt', { text: combined ? 'Last dose down to 50%' : 'Down to 50%' }),
      h('dd', { text: tHalf > 0 ? 'in ' + Charts.fmtDur(tHalf) : 'passed' }),
      h('dt', { text: combined ? 'First onset' : 'Onset' }),
      h('dd', { text: Charts.fmtClock(fs + fp.onset * HOUR) + ' (+' + Charts.fmtDur(fp.onset) + ')' }),
      h('dt', { text: combined ? 'Last dose peak' : 'Peak' }),
      h('dd', { text: Charts.fmtClock(ls + lp.peak * HOUR) + ' (+' + Charts.fmtDur(lp.peak) + ')' }),
      h('dt', { text: combined ? 'Last dose offset' : 'Offset' }),
      h('dd', { text: Charts.fmtClock(ls + lp.off * HOUR) + ' (+' + Charts.fmtDur(lp.off) + ')' }),
      h('dt', { text: 'After-effects end' }),
      h('dd', { text: Charts.fmtClock(ls + lp.afterEnd * HOUR) + ' (+' + Charts.fmtDur(lp.afterEnd) + ')' }),
      h('dt', { text: 'Est. 97% cleared' }),
      h('dd', { text: Charts.fmtDayClock(ls + last.clearanceH() * HOUR) })
    ]));

    /* ---- metabolites, inside the same dropdown ---------------------------
       The button below still opens the full breakdown with its table and its
       chart. What goes here is the roster: what each metabolite is, how much
       is present at this instant, and how long it has left — enough to answer
       the question without opening the popup at all. */
    var allMets = mergedBreakdown(g.curves);
    if (allMets.length) {
      detail.body.appendChild(h('h4', { class: 'kv-head', text: 'Metabolites' }));
      var mlist = h('div', { class: 'met-mini-list' });
      allMets.forEach(function (m) {
        var presentMg = m.amountAt(now / HOUR);
        mlist.appendChild(h('div', { class: 'met-mini' + (m.active ? ' met-mini-active' : '') }, [
          h('div', { class: 'met-mini-head' }, [
            h('span', { class: 'met-mini-name', text: m.name }),
            h('span', { class: 'pill ' + (m.active ? 'met-active' : 'met-inactive'),
                        text: m.active ? 'active' : 'inactive' }),
            m.outlastsParent ? h('span', { class: 'pill warn', text: 'outlasts parent' }) : null
          ]),
          h('div', { class: 'met-mini-figs muted small', text: [
            // Which compound made it. Now that the chain is followed all the
            // way down, that is frequently another metabolite rather than
            // the drug that was taken.
            'from ' + m.parentNames.join(' + '),
            Math.round(m.formationFraction * 100) + '% of that',
            presentMg > 0.001 ? Potency.fmtMg(presentMg) + ' present now' : 'none present now',
            't\u00bd ' + Charts.fmtDur(m.halfLifeH),
            'peaks +' + Charts.fmtDur(m.tmaxH),
            'clears +' + Charts.fmtDur(m.clearanceH())
          ].join(' \u00b7 ') })
        ]));
      });
      detail.body.appendChild(mlist);
    }
    card.appendChild(detail.el);

    // The route may declare its own products, so the count comes from what the
    // model will actually use rather than from the compound-level list.
    var routeMets = (PK.metabolismFor(c) || { metabolites: [] }).metabolites || [];
    if (routeMets.length) {
      var mets = mergedBreakdown(g.curves).filter(function (m) { return m.active; });
      var present = mets.filter(function (m) { return m.amountAt(now / HOUR) > 0.01; });
      // Every present metabolite is named. Truncating to two and appending an
      // ellipsis hid exactly the thing the button exists to report, so the
      // button wraps onto as many lines as the list needs instead.
      card.appendChild(h('button', {
        class: 'metab-open',
        title: 'Open the full metabolite breakdown',
        onclick: function () { openMetabolitePopup(g, now); }
      }, [
        h('strong', { text: 'Metabolites' }),
        h('span', { class: 'muted small', text: present.length
          ? present.length + ' active now: ' + present.map(function (m) {
              return m.name + ' ' + Potency.fmtMg(m.amountAt(now / HOUR));
            }).join(', ')
          : routeMets.length + ' recorded, none active right now' })
      ]));
    }
    return card;
  }

  /** The complete metabolite breakdown, as a popup. */
  function openMetabolitePopup(g, nowMs) {
    var body = h('div', { class: 'metab-popup' }, [
      h('h2', {}, [g.drug.name, ' — metabolites']),
      h('p', { class: 'muted small', text: g.count > 1
        ? 'Summed across all ' + g.count + ' doses still on board.'
        : 'From the ' + fmtDose(g.primary.curve.entry) + ' dose taken ' +
          Charts.fmtDur((nowMs / HOUR) - g.primary.curve.tStartH) + ' ago.' })
    ]);
    var panel = h('div', { class: 'metab-panel' });
    buildMetabBody(panel, g.curves, nowMs, g.drug);
    body.appendChild(panel);
    openModal(body);
  }

  /**
   * Metabolite profiles merged into one entry per compound.
   *
   * Two things get merged here, and both have to be.
   *
   * ACROSS DOSES, because amounts and cumulative formation are quantities of
   * material and quantities add. Peak time does NOT: the combined peak sits
   * somewhere between the individual ones and depends on the spacing, so it
   * is found by sampling the summed curve rather than by averaging the
   * parts, which would be wrong in a way nobody would notice.
   *
   * ACROSS ROUTES INTO THE SAME COMPOUND, because the body has one pool of
   * oxazepam, not three. A diazepam dose reaches oxazepam directly, through
   * nordazepam and through temazepam; the metabolite tree records all three
   * relationships, and it should — but three cards headed "Oxazepam" would
   * be describing one substance as if it were three, and the amounts would
   * each be a third of what is really there. So the compartments sum and the
   * card names every precursor that feeds it.
   */
  /**
   * The key two metabolite entries have to share to be treated as one pool.
   *
   * Normally the compound name. But a metabolism block is allowed to stand a
   * placeholder in for a set of excretion products it does not enumerate —
   * "Inactive conjugates", "Conjugates", "Inactive metabolites" — and those
   * are labels, not compounds. Gidazepam's inactive conjugates and
   * desalkylgidazepam's are different substances that happen to share a
   * placeholder, and merging them summed two unrelated pools into one row
   * that then reported more material than either. Keyed by their precursor
   * as well, they stay the separate things they are.
   */
  var AGGREGATE_MET = /^(inactive |phase ii |minor |other )?(conjugates?|metabolites?|glucuronides?|species)$/i;

  /**
   * Whether a dose still has active metabolite on board.
   *
   * A dose does not stop mattering when the compound does. Heroin is 97%
   * cleared twenty minutes after an injection and what it became runs for
   * hours — so a filter that asks only about the parent drops the morphine
   * off the screen along with it, which is the exact opposite of what the
   * chain was built to show. It stopped being hypothetical when heroin's
   * effect curve started following its own amount instead of a published
   * three-to-five-hour window.
   */
  function hasLiveMetabolites(curve, tH) {
    return PK.metaboliteBreakdown(curve).some(function (m) {
      return m.active && m.amountAt(tH) > 0.01;
    });
  }

  function metKey(name, parentName) {
    var bare = String(name).replace(/\s*\([^)]*\)\s*$/, '').trim();
    var key = DB.norm(bare);
    if (AGGREGATE_MET.test(bare)) key += '\u0000from:' + DB.norm(String(parentName || ''));
    return key;
  }

  function mergedBreakdown(curves) {
    var byKey = {}, out = [];
    var tStart = Math.min.apply(null, curves.map(function (c) { return c.tStartH; }));

    curves.forEach(function (c) {
      PK.metaboliteBreakdown(c).forEach(function (m) {
        var key = metKey(m.name, m.parentName);
        var g = byKey[key];
        if (!g) {
          g = byKey[key] = {
            key: key, name: m.name, active: false, halfLifeH: 0,
            potencyRel: null, formationFraction: 0, formationInferred: false,
            note: null, outlastsParent: false, depth: m.depth,
            parentNames: [], parentKeys: [], parts: [], firstPresentAbsH: Infinity
          };
          out.push(g);
        }
        g.parts.push({ prof: m, t0: c.tStartH });
        g.active = g.active || m.active;
        g.halfLifeH = Math.max(g.halfLifeH, m.halfLifeH);
        g.depth = Math.min(g.depth, m.depth);
        g.formationFraction = Math.max(g.formationFraction, m.formationFraction);
        g.formationInferred = g.formationInferred || m.formationInferred;
        g.outlastsParent = g.outlastsParent || m.outlastsParent;
        if (g.potencyRel == null) g.potencyRel = m.potencyRel;
        if (!g.note && m.note) g.note = m.note;
        var pKey = metKey(m.parentName, null);
        if (g.parentKeys.indexOf(pKey) < 0) {
          g.parentKeys.push(pKey);
          g.parentNames.push(m.parentName);
        }
        g.firstPresentAbsH = Math.min(g.firstPresentAbsH, c.tStartH + m.firstPresentH);
      });
    });

    out.forEach(function (g) {
      g.amountAt = function (t) {
        return g.parts.reduce(function (a, p) { return a + p.prof.amountAt(t); }, 0);
      };
      g.cumulativeFormedAt = function (t) {
        return g.parts.reduce(function (a, p) { return a + p.prof.cumulativeFormedAt(t); }, 0);
      };
      g.totalFormed = g.parts.reduce(function (a, p) { return a + p.prof.totalFormed; }, 0);
      g.clearanceH = function () {
        return g.parts.reduce(function (a, p) {
          return Math.max(a, (p.t0 - tStart) + p.prof.clearanceH());
        }, 0);
      };

      // One contributor needs no search — it already knows where its own peak
      // is, and scanning for it would only find the same answer more slowly.
      if (g.parts.length === 1) {
        var only = g.parts[0];
        g.peakAmount = only.prof.peakAmount;
        g.tmaxH = (only.t0 - tStart) + only.prof.tmaxH;
        g.tmaxAbsH = only.t0 + only.prof.tmaxH;
        g.relativeAt = only.prof.relativeAt;
        return;
      }

      /* Sample the summed curve to find where it actually peaks.
         The window has to run from the FIRST dose to the last one's
         clearance. Scanning only one dose's worth of clearance from the start
         missed every later dose: on a log with doses spread over eleven days
         it found a 1.5 mg peak on day one and never saw the real 3.5 mg peak
         on day eleven, so `relativeAt` — which is meant to cap at 1 — reached
         2.26 and the reported peak time was ten days out.

         The step count scales with the span so a long history is not sampled
         more coarsely than a short one. */
      var span = Math.max.apply(null, curves.map(function (c) { return c.tStartH; })) - tStart;
      var horizon = span + g.clearanceH();
      var N = Math.max(300, Math.min(4000, Math.round(horizon * 4)));
      var best = 0, bestT = 0;
      for (var i = 0; i <= N; i++) {
        var t = tStart + (i / N) * horizon;
        var v = g.amountAt(t);
        if (v > best) { best = v; bestT = t; }
      }
      g.peakAmount = best;
      g.tmaxH = bestT - tStart;
      g.tmaxAbsH = bestT;
      g.relativeAt = function (t) { return best > 0 ? g.amountAt(t) / best : 0; };
    });

    /* Parents before their own products, then active before inactive, then
       by how much of the dose takes the route. So a chain reads downwards. */
    return out.sort(function (a, b) {
      return (a.depth - b.depth) || (b.active - a.active) ||
             (b.formationFraction - a.formationFraction);
    });
  }

  function buildMetabBody(body, curves, nowMs, drug) {
    curves = Array.isArray(curves) ? curves : [curves];
    var tNow = nowMs / HOUR;
    var curve = curves[0];
    var combined = curves.length > 1;
    var breakdown = mergedBreakdown(curves);

    // The parent side sums too: three 20 mg doses put 60 mg in, and however
    // much of that is left is the number the panel should be reporting.
    var absorbed = curves.reduce(function (a, c) {
      return a + (c.route.bioavailability != null ? c.route.bioavailability : 1) * c.doseMg;
    }, 0);
    // Circulating, not "absorbed minus eliminated" — the metabolite rows in
    // this table are amounts present, and the parent row has to be the same
    // quantity or the column does not add up.
    var remainingMg = curves.reduce(function (a, c) { return a + c.amountMgAt(tNow); }, 0);
    var parentRemaining = absorbed > 0 ? remainingMg / absorbed : 0;
    var unit = curve.entry.unit;

    // Amounts are mg-equivalents of the parent dose. For units the store does
    // not convert to mg (ml, canisters) an absolute mass is meaningless, so
    // those fall back to percentages only.
    var massMeaningful = ['mg', 'µg', 'ug', 'g', 'mcg', 'ng'].indexOf(unit) >= 0;
    var fmtAmt = function (mg) {
      return massMeaningful ? Potency.fmtMg(mg) : Math.round((mg / absorbed) * 100) + '%';
    };

    body.appendChild(h('p', { class: 'muted small', text:
      'Estimated from the parent\'s elimination rate and each metabolite\'s own half-life. ' +
      'Amounts are parent-dose equivalents, not corrected for molecular weight, and every ' +
      'pathway share is an approximation.' }));

    // --- parent row ---
    var tbl = h('table', { class: 'metab-table' }, [
      h('thead', {}, [h('tr', {}, ['Compound', 'Share of precursor', 'Formed so far', 'Still present', 't½', 'Peaks', 'Cleared'].map(function (t) {
        return h('th', { text: t });
      }))])
    ]);
    var tb = h('tbody');

    tb.appendChild(h('tr', { class: 'parent-row' }, [
      h('td', {}, [h('strong', { text: curve.drug.name }),
        h('span', { class: 'pill parent-pill', text: combined ? 'parent · ' + curves.length + ' doses' : 'parent' })]),
      h('td', { text: '—' }),
      h('td', { text: '—' }),
      h('td', { text: fmtAmt(absorbed * parentRemaining) + ' (' + Math.round(parentRemaining * 100) + '%)' }),
      h('td', { text: Charts.fmtDur(curve.halfLifeH) }),
      h('td', { text: '+' + Charts.fmtDur(curve.tmaxH) }),
      h('td', { text: '+' + Charts.fmtDur(curve.clearanceH()) })
    ]));

    breakdown.forEach(function (m) {
      var present = m.amountAt(tNow);
      var formed = m.cumulativeFormedAt(tNow);
      var mEnt = DB.get(String(m.name).replace(/\s*\(.*\)\s*$/, '').trim());
      tb.appendChild(h('tr', { class: m.active ? 'met-active-row' : '' }, [
        h('td', {}, [
          mEnt && mEnt.id !== curve.drug.id
            ? h('button', { class: 'link-title small', onclick: function () { openDrug(mEnt.id); } }, [m.name])
            : document.createTextNode(m.name),
          h('span', { class: 'pill ' + (m.active ? 'met-active' : 'met-inactive'), text: m.active ? 'active' : 'inactive' }),
          m.outlastsParent ? h('span', { class: 'pill warn', title: 'Half-life exceeds the parent drug — this outlives the drug that made it.', text: 'outlasts parent' }) : null,
          // What made it. Below the first generation that is another
          // metabolite, and the share in the next column is a share of THAT.
          m.depth > 0 ? h('div', { class: 'muted small', text: 'from ' + m.parentNames.join(' + ') }) : null
        ]),
        h('td', {}, [
          Math.round(m.formationFraction * 100) + '%',
          m.formationInferred
            ? h('span', { class: 'flag', title: 'No pathway in the data clearly produces this metabolite, so its share of the dose is a placeholder rather than a figure from the literature.', text: ' ?' })
            : null
        ]),
        h('td', { text: fmtAmt(formed) + ' of ' + fmtAmt(m.totalFormed) }),
        h('td', { text: fmtAmt(present) }),
        h('td', { text: Charts.fmtDur(m.halfLifeH) }),
        h('td', { text: '+' + Charts.fmtDur(m.tmaxH) }),
        h('td', { text: '+' + Charts.fmtDur(m.clearanceH()) })
      ]));
      if (m.potencyRel != null && m.active) {
        tb.appendChild(h('tr', { class: 'note-row' }, [h('td', { colspan: '7' }, [
          h('span', { text: 'Potency ' + Potency.fmtRatio(m.potencyRel) + ' vs parent. ' }),
          m.note ? h('span', { text: m.note }) : null
        ])]));
      } else if (m.note) {
        tb.appendChild(h('tr', { class: 'note-row' }, [h('td', { colspan: '7', text: m.note })]));
      }
    });
    tbl.appendChild(tb);
    body.appendChild(h('div', { class: 'table-wrap' }, [tbl]));

    /* --- chart: parent vs metabolites over time ---------------------------
       Every dose counts, not just the first. The parent line is the SUM of
       the curves, so a redose shows as a second climb on top of a tail that
       had not finished falling — which is the shape the number in the table
       above is describing. Drawing only curves[0] meant the chart and the
       table disagreed the moment anyone dosed twice.

       The window has to open at the earliest dose and close after the last
       one has cleared, or the redose falls off the right edge of a chart
       scaled to the first dose alone. */
    var t0 = Math.min.apply(null, curves.map(function (c) { return c.entry.timeMs; }));
    var lastStart = Math.max.apply(null, curves.map(function (c) { return c.entry.timeMs; }));
    var parentClearH = Math.max.apply(null, curves.map(function (c) { return c.clearanceH(); }));
    var metClearH = breakdown.length
      ? Math.max.apply(null, breakdown.map(function (m) { return m.clearanceH(); }))
      : 0;
    // Metabolite clearances are measured from the first dose (mergedBreakdown
    // sums from there), the parent's from whichever dose it belongs to.
    var spanH = Math.max(
      (lastStart - t0) / HOUR + parentClearH,
      metClearH,
      1
    );
    var t1 = t0 + Math.min(spanH, 24 * 7) * HOUR;

    var series = [{
      name: curve.drug.name + (combined ? ' (all ' + curves.length + ' doses)' : ''),
      color: Charts.colorFor(0), width: 2.5, fill: true,
      points: sampleFn(t0, t1, function (t) {
        var tH = t / HOUR;
        return curves.reduce(function (a, cc) { return a + cc.concAt(tH); }, 0);
      })
    }];
    var peakParent = Math.max.apply(null, series[0].points.map(function (p) { return p[1]; })) || 1;

    breakdown.forEach(function (m, i) {
      series.push({
        name: m.name, color: Charts.colorFor(i + 1), dashed: !m.active, width: m.active ? 2 : 1.4,
        points: sampleFn(t0, t1, function (t) { return m.relativeAt(t / HOUR) * peakParent * 0.85; })
      });
    });

    body.appendChild(h('div', { class: 'chart-wrap' }, [
      Charts.lineChart({
        series: series, t0: t0, t1: t1, nowMs: nowMs, height: 240,
        yFormat: function (v) { return Math.round((v / peakParent) * 100) + '%'; },
        // A tick per dose, so the second climb on the parent line is visibly
        // a redose rather than an unexplained bump.
        markers: curves.map(function (cc) { return { tMs: cc.entry.timeMs, color: Charts.token('--text-faint', '#888') }; })
      })
    ]));
    body.appendChild(h('div', { class: 'legend' }, series.map(function (s) {
      return h('span', { class: 'legend-item' }, [
        h('span', { class: 'legend-swatch', style: 'background:' + s.color + (s.dashed ? ';opacity:.55' : '') }),
        s.name
      ]);
    })));
    body.appendChild(h('p', { class: 'muted small', text:
      'The parent line sums every dose on board, so a redose appears as a second climb on an unfinished tail; the ticks along the axis mark each dose. Metabolite curves are each scaled to their own peak, so this shows relative timing — when each one forms, peaks and clears — not comparative blood concentrations. Dashed lines are inactive metabolites.' }));
  }

  function sampleFn(t0, t1, fn, steps) {
    steps = steps || 200;
    var dt = (t1 - t0) / steps, pts = [];
    for (var t = t0; t <= t1; t += dt) pts.push([t, fn(t)]);
    return pts;
  }

  function phaseName(c, tH) {
    var t = tH - c.tStartH, p = c.phases;
    if (t < p.onset) return { key: 'waiting', label: 'not yet active' };
    if (t < p.peak) return { key: 'comeup', label: 'coming up' };
    if (t < p.plateauEnd) return { key: 'peak', label: 'peak' };
    if (t < p.off) return { key: 'offset', label: 'coming down' };
    if (t < p.afterEnd) return { key: 'after', label: 'after-effects' };
    return { key: 'residual', label: 'residual / clearing' };
  }

  function meter(label, value, fill) {
    return h('div', { class: 'meter' }, [
      h('div', { class: 'meter-label' }, [
        h('span', { text: label }),
        h('span', { class: 'meter-val', text: Math.round(value * 100) + '%' })
      ]),
      h('div', { class: 'meter-track' }, [
        h('div', { class: 'meter-fill', style: 'width:' + Math.max(0, Math.min(100, fill * 100)) + '%' })
      ])
    ]);
  }

  /* ---------- readouts for the timeline cards -----------------------------
     The scrub cards answer one question at one instant, and they answer it in
     the units the question is asked in: how long ago, how many milligrams,
     what concentration. Everything below is that formatting.
     ------------------------------------------------------------------------ */

  /** "45s", "12m", "3.4h" — compact enough to sit inside a sentence. */
  function fmtShortDur(hours) {
    if (hours == null || !isFinite(hours)) return '—';
    var s = Math.max(0, hours) * 3600;
    if (s < 60) return Math.round(s) + 's';
    if (s < 3600) return Math.round(s / 60) + 'm';
    var hh = s / 3600;
    return (hh < 10 ? Math.round(hh * 10) / 10 : Math.round(hh)) + 'h';
  }

  /**
   * A moment expressed against now: "now", "in 4 min", "4 min ago".
   *
   * The scrub clock, the card grid heading and the chart's hover readout all
   * answer the same question about the same cursor, and each had grown its
   * own copy of this ternary. One of them phrasing a moment differently from
   * the other two — while both are on screen at once — reads as the two
   * disagreeing about when it is.
   *
   * `nowMs` is passed rather than read from the clock so the label agrees
   * with the "now" line the chart was drawn with, which is fixed at render.
   * On a page left open an hour, reading Date.now() here would put the tooltip
   * an hour out of step with the marker it is describing.
   */
  var NOW_EPSILON_H = 0.02;   // ~72 seconds: below this, "now" is the honest word

  function relativeTime(tMs, nowMs) {
    var deltaH = (tMs - nowMs) / HOUR;
    if (Math.abs(deltaH) < NOW_EPSILON_H) return { text: 'now', atNow: true };
    return {
      text: deltaH > 0 ? 'in ' + Charts.fmtDur(deltaH) : Charts.fmtDur(-deltaH) + ' ago',
      atNow: false
    };
  }

  /** Half-lives stay in hours however long they get — 75 h reads as 75 h. */
  function fmtHours(hours) {
    if (hours == null || !isFinite(hours)) return '—';
    return (hours < 10 ? Math.round(hours * 10) / 10 : Math.round(hours)) + ' h';
  }

  function sig3(n) {
    if (!isFinite(n)) return '—';
    var a = Math.abs(n);
    var dp = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3;
    return String(parseFloat(n.toFixed(dp)));
  }

  /**
   * A plasma concentration, in the units toxicology reports use.
   *
   * mg/L, µg/mL and 1000 ng/mL are the same number; ng/mL is what a lab
   * result is written in, so that is the anchor and the scale moves around it.
   */
  function fmtConc(mgPerL) {
    if (mgPerL == null || !isFinite(mgPerL) || mgPerL <= 0) return '—';
    var ngPerMl = mgPerL * 1000;
    if (ngPerMl >= 1000) return sig3(ngPerMl / 1000) + ' µg/mL';
    if (ngPerMl >= 1) return sig3(ngPerMl) + ' ng/mL';
    return sig3(ngPerMl * 1000) + ' pg/mL';
  }

  /**
   * A meter that reports a quantity against the quantity it is heading for,
   * rather than a bare percentage. "38% absorbed" says less than "7.6 mg of
   * 20 mg", and the card has room for both.
   */
  /**
   * A meter, or nothing once it is full.
   *
   * A bar pinned at 100% is not a readout, it is furniture — it says the
   * same thing at every moment for the rest of the card's life, and on a
   * route with no absorption phase to speak of it says it from the first
   * second. Returning null drops it, and `h()` already skips nulls in a
   * child list, so the caller needs no branch.
   *
   * The quantity is not lost with it: the meter beneath carries the same
   * total on its own "x of y" line.
   */
  function meterOf(label, done, total, title) {
    var frac = total > 0 ? Math.max(0, Math.min(1, done / total)) : 0;
    if (frac >= DONE) return null;
    return h('div', { class: 'meter', title: title || null }, [
      h('div', { class: 'meter-label' }, [
        h('span', { text: label }),
        h('span', { class: 'meter-val', text: Math.round(frac * 100) + '%' })
      ]),
      h('div', { class: 'meter-track' }, [
        h('div', { class: 'meter-fill', style: 'width:' + (frac * 100) + '%' })
      ]),
      h('div', { class: 'meter-foot muted small',
        text: Potency.fmtMg(done) + ' of ' + Potency.fmtMg(total) })
    ]);
  }

  /**
   * When a dose first becomes systemically present, in absolute hours.
   *
   * Absorption is first-order, so strictly it starts the instant the dose is
   * taken; what varies is how fast it gets anywhere. This is the moment half a
   * percent of the bioavailable dose has arrived, which for an injection is
   * immediate and for a slow oral dose is a few minutes — enough to order a
   * card list by without pretending to a precision the model does not have.
   */
  function firstSystemicH(c) {
    var lag = c.ka > 0 ? Math.min(0.5, 0.005 / c.ka) : 0;
    return c.tStartH + lag;
  }

  /**
   * A metabolite's phase, in the same vocabulary the parent compounds use.
   *
   * No onset, peak or duration is published for a metabolite, so the phase is
   * read off its own amount curve rather than off reported windows: how much
   * of its own maximum is present, and whether that maximum has passed.
   */
  function metPhase(m, tH) {
    var rel = m.relativeAt(tH);
    var past = tH > m.tmaxAbsH;
    if (rel < 0.005) {
      return past ? { key: 'residual', label: 'residual / clearing' }
                  : { key: 'waiting', label: 'not yet active' };
    }
    if (rel >= 0.9) return { key: 'peak', label: 'peak' };
    if (!past) return { key: 'comeup', label: 'coming up' };
    if (rel >= 0.25) return { key: 'offset', label: 'coming down' };
    if (rel >= 0.05) return { key: 'after', label: 'after-effects' };
    return { key: 'residual', label: 'residual / clearing' };
  }

  /* ---------- when something on a card has finished ------------------------

     One rule, applied to every progress meter and to the card itself: a
     process is over when its meter would read 100%, and nothing that is
     over stays on screen claiming to be. The meter rounds, so the cut is
     99.5% — past that a meter is a full bar that will never move again and
     a card is reporting a clearance it has already finished.

     So an Absorbed meter disappears once the dose is in, which for an
     injection is immediately — absorption is not a process worth a meter
     for something delivered straight into a vein. A Metabolized meter goes
     the same way once all of a metabolite has been made. And a card leaves
     the grid entirely once it has been eliminated.

     0.5% of a dose is not nothing, and that is the honest trade: 0.5% of
     37 mg of desalkylgidazepam is 185 µg, and the alternative is a card
     that stays for six more weeks getting asymptotically emptier. The
     compound is still on its own page and still on the chart, which does
     not have to make this decision.
     ---------------------------------------------------------------------- */

  var DONE = 0.995;

  /**
   * Share of everything a dose puts into the body that has been cleared.
   *
   * The same figure the Eliminated meter draws, from the same place, so a
   * card can never vanish while its meter says there is something left.
   */
  function eliminatedFraction(c, tH) {
    return doseBalance(c, tH).eliminatedFrac;
  }

  /**
   * Whether a metabolite still warrants a card and a mention.
   *
   * Two ends to it. It has to have arrived — the absolute floor is the one
   * that was already here, and it keeps a metabolite out of the grid until
   * there is a milligram figure worth printing. And it has to not be
   * finished, on the same 99.5% test the parents use, measured against
   * everything these doses will ever make of it.
   *
   * The absolute floor alone did eventually retire a card, but on its own
   * terms rather than on the compound's: 1 µg is 0.003% of a large
   * metabolite pool, which is fifteen half-lives past the point where the
   * card had anything left to say.
   */
  function metabolitePresent(m, tH) {
    if (!(m.amountAt(tH) > 0.001)) return false;
    if (!(m.totalFormed > 0)) return false;
    var formed = m.cumulativeFormedAt(tH);
    return (formed - m.amountAt(tH)) < m.totalFormed * DONE;
  }

  /** "2 active metabolites present: Nordazepam, Oxazepam" */
  function metabolitePresenceLine(list) {
    if (!list.length) {
      return h('div', { class: 'card-figure muted small', text: 'no active metabolites present' });
    }
    return h('div', { class: 'card-figure muted small', text:
      list.length + ' active metabolite' + (list.length === 1 ? '' : 's') +
      ' present: ' + list.map(function (m) { return m.name; }).join(', ') });
  }

  /**
   * One substance on board at the cursor's moment.
   *
   * Deliberately narrow. What was taken and when, where it is in its arc, how
   * much has arrived, how much has gone, what concentration that works out to,
   * and what it has turned into. The clock-time table that used to sit under
   * this belongs on the card in "Currently on board", which is where it is.
   */
  function substanceCard(g, tH, mets) {
    var c = g.primary.curve, d = g.drug;
    var many = g.count > 1;

    // Everything the route puts into the body, and how much of it has landed.
    // Summed by groupReadings from one shared balance, so these agree with
    // the card-retirement test and with what the metabolites are made of.
    var absorbable = g.absorbedMg;
    var absorbedSoFar = g.absorbedSoFarMg;
    var circulating = g.remainingMg;
    var eliminated = g.eliminatedMg;

    var direct = mets.filter(function (m) {
      return m.active && m.depth === 0 && metabolitePresent(m, tH);
    });

    return h('div', { class: 'scrub-card' + (many ? ' card-combined' : '') }, [
      h('div', { class: 'card-head' }, [
        h('button', { class: 'link-title', onclick: function () { openDrug(d.id); } }, [d.name]),
        h('span', { class: 'pill kind-combined',
          text: g.count + ' dose' + (g.count === 1 ? '' : 's') }),
        h('span', { class: 'pill phase-' + g.primary.phase.key, text: g.primary.phase.label })
      ]),
      h('div', { class: 'card-sub', text:
        'last dose ' + fmtShortDur(tH - c.tStartH) + ': ' + fmtDose(c.entry) }),
      h('div', { class: 'card-sub muted small', text: 'half-life — ' + fmtHours(c.halfLifeH) +
        (c.modifiers.length ? ' (adjusted ×' + (c.halfLifeH / c.baseHalfLife).toFixed(1) + ')' : '') }),
      meterOf('Absorbed', absorbedSoFar, absorbable,
        'How much of the dose has crossed into the circulation by the ' + routeLabel(c.routeKey) +
        ' route, against everything that route will ever deliver — the dose times its bioavailability, not the dose.'),
      meterOf('Eliminated', eliminated, absorbable,
        'How much of what arrived has been cleared, against everything that has to be cleared.'),
      plasmaBlock(circulating, d.name, d),
      metabolitePresenceLine(direct)
    ]);
  }

  /**
   * One metabolite, as its own card in the same grid.
   *
   * It carries what a substance card carries, because at this point in the
   * chain it IS the substance — the only additions are what made it and how
   * much of the parent took that route. "Absorbed" becomes "Metabolized",
   * since nothing was absorbed: it appeared in the body already inside it.
   */
  function metaboliteCard(g, m, mets, tH) {
    var last = g.curves.reduce(function (a, b) { return a.tStartH >= b.tStartH ? a : b; });
    var present = m.amountAt(tH);
    var formed = m.cumulativeFormedAt(tH);
    var gone = Math.max(0, formed - present);
    var phase = metPhase(m, tH);
    var mEnt = DB.get(String(m.name).replace(/\s*\(.*\)\s*$/, '').trim());

    // Its own products, one step down — the same relationship this card has
    // to the one above it.
    var children = mets.filter(function (x) {
      return x.active && x !== m && x.parentKeys.indexOf(m.key) >= 0 && metabolitePresent(x, tH);
    });

    return h('div', { class: 'scrub-card scrub-card-met' }, [
      h('div', { class: 'card-head' }, [
        mEnt && mEnt.id !== g.drug.id
          ? h('button', { class: 'link-title', onclick: function () { openDrug(mEnt.id); } }, [m.name])
          : h('strong', { class: 'link-title-static', text: m.name }),
        h('span', { class: 'pill kind-combined', text: g.drug.name + ' ' + g.count }),
        h('span', { class: 'pill phase-' + phase.key, text: phase.label }),
        m.outlastsParent ? h('span', { class: 'pill warn',
          title: 'Half-life exceeds the compound that made it — this outlives its own parent.',
          text: 'outlasts parent' }) : null
      ]),
      h('div', { class: 'card-sub', text: 'from ' + m.parentNames.join(', ') +
        ' · last dose ' + fmtShortDur(tH - last.tStartH) + ': ' + fmtDose(last.entry) }),
      h('div', { class: 'card-sub muted small', text: 'half-life — ' + fmtHours(m.halfLifeH) }),
      meterOf('Metabolized', formed, m.totalFormed,
        'How much of this metabolite has been produced, against everything these doses will ever produce of it.'),
      meterOf('Eliminated', gone, m.totalFormed,
        'How much of what has been produced is already cleared, against everything that has to be.'),
      plasmaBlock(present, m.name, concSource(mEnt, g.drug)),
      metabolitePresenceLine(children),
      m.note ? h('p', { class: 'small muted', text: m.note }) : null
    ]);
  }

  var BAND_LABEL = {
    below:       ['below therapeutic', 'Under the band a clinical or typical dose produces.'],
    therapeutic: ['therapeutic range', 'The band a clinical dose produces — or for compounds nobody prescribes, what a typical dose produces.'],
    toxic:       ['toxic range', 'The band at which toxicity is commonly reported. Not a threshold: people are affected below it and tolerate it above.'],
    fatal:       ['seen in fatalities', 'Within the band reported in fatal cases. That is an observation about a population, NOT a statement that this concentration is lethal — tolerance moves it enormously in both directions.']
  };

  /**
   * The concentration, and what it can be compared with.
   *
   * Every published therapeutic window and toxic level is a concentration, so
   * a milligram figure has to be divided by a volume before it means anything
   * next to one. The right divisor is the apparent volume of distribution —
   * the volume the body behaves as if the drug were dissolved in — scaled by
   * this user's body mass, which is why two people who took the same dose do
   * not read the same number here. It used to divide by plasma volume, which
   * assumes the drug is dissolved in plasma and nowhere else and had
   * methamphetamine reading in micrograms per millilitre where a laboratory
   * reports tens of nanograms.
   *
   * Where no Vd is recorded the plasma volume is still used and the figure is
   * marked as an upper bound, because Vd exceeds plasma volume for every
   * compound here. Saying "at most this" is honest; silently swapping what the
   * number means is not.
   */
  /**
   * What to divide a metabolite by.
   *
   * Its own Vd if it has one. Failing that, its PARENT's — a metabolite
   * distributes nothing like plasma and usually not far off the compound it
   * came from, so borrowing the parent is wrong by a factor of two or three
   * where falling back to plasma volume is wrong by a hundred. The readout
   * says which it used, so a borrowed figure is never mistaken for a
   * measured one.
   *
   * Concentration bands are NOT inherited. A band is a statement about that
   * specific compound and there is no defensible way to transfer one.
   */
  function concSource(entry, parent) {
    if (entry && entry.vd != null) return entry;
    if (!parent || parent.vd == null) return entry;
    return {
      name: entry ? entry.name : null,
      vd: parent.vd,
      vdBorrowedFrom: parent.name,
      ranges: entry ? entry.ranges : null,
      rangesNote: entry ? entry.rangesNote : null
    };
  }

  function plasmaBlock(amountMg, name, drug) {
    var vol = Profile.distributionVolumeL(drug);
    var conc = Profile.plasmaConc(amountMg, drug);
    var band = Profile.concentrationBand(conc, drug);

    var borrowed = drug && drug.vdBorrowedFrom;
    var basis = vol.basis === 'vd'
      ? Potency.fmtMg(amountMg) + ' across ' + Math.round(vol.litres) + ' L (Vd ' + vol.vd +
        ' L/kg' + (borrowed ? ", " + borrowed + "'s" : '') + ')'
      : Potency.fmtMg(amountMg) + ' in ' + vol.litres.toFixed(1) + ' L plasma · upper bound';

    var title = vol.basis === 'vd'
      ? Potency.fmtMg(amountMg) + ' of ' + name + ' divided by ' +
        (borrowed
          ? borrowed + "'s volume of distribution, " + vol.vd + ' L/kg, because none is recorded ' +
            'for ' + name + ' itself. A metabolite distributes nothing like plasma and usually not ' +
            'far off the compound it came from, so this is wrong by a factor of two or three where ' +
            'dividing by plasma volume would be wrong by a hundred.'
          : 'its apparent volume of distribution: ' + vol.vd + ' L/kg times your body mass, or ' +
            Math.round(vol.litres) + ' L. Vd is not a real volume — it is the volume the body ' +
            'behaves as if the drug were dissolved in, and that is what converts an amount into ' +
            'what a blood sample would read.')
      : 'No volume of distribution is recorded for ' + name + ', so this divides by plasma ' +
        'volume instead: ' + vol.litres.toFixed(2) + ' L, from your weight and height. Vd is larger ' +
        'than plasma volume for everything in this database, so treat this as an UPPER BOUND ' +
        'rather than an estimate — for a lipophilic compound the real figure can be a hundredth ' +
        'of it.';

    var kids = [
      h('div', { class: 'card-figure card-figure-lead' }, [
        fmtConc(conc),
        band ? h('span', { class: 'pill band-' + band.key, title: BAND_LABEL[band.key][1],
                            text: BAND_LABEL[band.key][0] }) : null
      ]),
      h('div', { class: 'muted small', title: title,
        text: (vol.basis === 'vd' ? 'concentration · ' : 'plasma concentration · ') + basis })
    ];

    if (band) kids.push(bandScale(band));
    return h('div', { class: 'card-conc' }, kids);
  }

  /**
   * The reported bands, laid out so the figure can be read against them.
   *
   * Deliberately not a gauge with a needle on it. These bands overlap, they
   * are population observations rather than thresholds, and for opioids and
   * benzodiazepines tolerance moves them by more than the width of the bands
   * themselves — so anything that looked like a precise position on a dial
   * would be claiming something the data cannot support.
   */
  function bandScale(band) {
    var r = band.ranges;
    var fmtBand = function (b) {
      if (!b) return null;
      var lo = fmtConc(b[0] / 1000);
      return b[1] == null ? lo + '+' : lo + '–' + fmtConc(b[1] / 1000);
    };
    var rows = [['therapeutic', r.therapeutic], ['toxic', r.toxic], ['fatal', r.fatal]]
      .filter(function (x) { return x[1]; });

    return h('div', { class: 'band-scale' }, rows.map(function (x) {
      return h('span', { class: 'band-row' + (band.key === x[0] ? ' band-row-here' : '') }, [
        h('span', { class: 'band-name', text: BAND_LABEL[x[0]][0] }),
        h('span', { class: 'band-val', text: fmtBand(x[1]) })
      ]);
    }).concat([
      band.note ? h('p', { class: 'band-note small muted', text: band.note }) : null,
      h('p', { class: 'band-note small muted', text:
        'Population bands, not thresholds — they overlap, and tolerance moves them further than their own width. A modelled concentration is not a measurement.' })
    ]));
  }

  function findingsList(findings) {
    var list = h('div', { class: 'findings' });
    findings.forEach(function (f) {
      list.appendChild(h('div', { class: 'finding level-' + f.level }, [
        h('div', { class: 'finding-head' }, [
          levelPill(f.level),
          h('strong', { text: f.title }),
          h('span', { class: 'muted small', text: f.drugs.map(function (d) { return d.name; }).join(' + ') }),
          h('span', { class: 'tag-chip', text: f.source })
        ]),
        h('p', { class: 'mech', text: f.mechanism }),
        f.detail ? h('p', { class: 'detail', text: f.detail }) : null
      ]));
    });
    return list;
  }

  /* ======================================================================
     TAB: LOG
     ====================================================================== */

  /**
   * The dose-entry form, built as a detached element so it can be dropped into
   * a modal from the Now tab rather than owning a tab of its own. Logging a
   * dose is a moment's task; it does not need a permanent home in the nav.
   */
  function logFormEl(prefill, editing) {
    var form = h('form', { class: 'log-form', onsubmit: onSubmitLog });
    // Empty for a new dose, the entry's id when an existing one is being
    // changed. onSubmitLog reads it to decide between add and update, so the
    // two paths share every field and every validation below.
    var logId = h('input', { type: 'hidden', id: 'f-log-id', value: editing ? editing.id : '' });
    form.appendChild(logId);

    var drugInput = h('input', {
      type: 'text', id: 'f-drug', placeholder: 'Search substances…',
      autocomplete: 'off', required: 'required'
    });
    var results = h('div', { class: 'autocomplete' });
    var hidden = h('input', { type: 'hidden', id: 'f-drug-id' });

    drugInput.addEventListener('input', function () {
      var q = drugInput.value.trim();
      results.innerHTML = '';
      hidden.value = '';
      if (!q) { results.classList.remove('open'); return; }
      // A metabolite has no route and no dose, so it cannot be logged as one.
      // Offering it here would produce a log entry the model cannot curve.
      var matches = DB.search(q, 12).filter(function (m) {
        return !m.formedInVivo && Object.keys(m.routes).length;
      }).slice(0, 8);
      if (!matches.length) { results.classList.remove('open'); return; }
      results.classList.add('open');
      matches.forEach(function (d) {
        results.appendChild(h('button', {
          type: 'button', class: 'ac-item',
          onclick: function () {
            drugInput.value = d.name;
            hidden.value = d.id;
            results.classList.remove('open');
            syncRoutes(d);
          }
        }, [
          h('span', { class: 'ac-name', text: d.name }),
          h('span', { class: 'ac-class', text: d.class }),
          confBadge(DB.confidenceOf(d))
        ]));
      });
    });

    var routeSel = h('select', { id: 'f-route' });
    var unitSel = h('select', { id: 'f-unit' }, ['µg', 'mg', 'g', 'ml', 'canisters', 'inhalations'].map(function (u) {
      return h('option', { value: u, text: u, selected: u === 'mg' ? 'selected' : null });
    }));
    var amountInput = h('input', { type: 'number', id: 'f-amount', step: 'any', min: '0', required: 'required', placeholder: '0' });
    var doseHint = h('div', { class: 'dose-hint muted small' });

    function syncRoutes(d) {
      routeSel.innerHTML = '';
      Object.keys(d.routes).forEach(function (r) {
        routeSel.appendChild(h('option', { value: r, text: r }));
      });
      syncDoseHint(d);
    }
    function syncDoseHint(d) {
      d = d || DB.get(hidden.value);
      if (!d) { doseHint.textContent = ''; return; }
      var r = d.routes[routeSel.value] || d.routes[Object.keys(d.routes)[0]];
      var dd = r && r.doses;
      if (!dd) { doseHint.textContent = ''; return; }
      unitSel.value = dd.unit === 'mg' ? 'mg' : (['g', 'ml', 'canisters', 'inhalations'].indexOf(dd.unit) >= 0 ? dd.unit : 'mg');
      doseHint.innerHTML = '';
      doseHint.appendChild(ladderEl(dd));
      if (dd.note) doseHint.appendChild(h('div', { class: 'ladder-note', text: dd.note }));
    }
    routeSel.addEventListener('change', function () { syncDoseHint(); });

    var timeInput = h('input', { type: 'datetime-local', id: 'f-time', value: localISO(new Date()) });
    var notesInput = h('input', { type: 'text', id: 'f-notes', placeholder: 'Context, setting, how it felt…' });

    form.appendChild(h('div', { class: 'field wide' }, [
      h('label', { for: 'f-drug', text: 'Substance' }),
      h('div', { class: 'ac-wrap' }, [drugInput, results, hidden])
    ]));
    form.appendChild(h('div', { class: 'field' }, [h('label', { for: 'f-route', text: 'Route' }), routeSel]));
    form.appendChild(h('div', { class: 'field' }, [
      h('label', { for: 'f-amount', text: 'Amount' }),
      h('div', { class: 'inline' }, [amountInput, unitSel])
    ]));
    form.appendChild(h('div', { class: 'field' }, [h('label', { for: 'f-time', text: 'Time' }), timeInput]));
    form.appendChild(h('div', { class: 'field wide' }, [h('label', { for: 'f-notes', text: 'Notes' }), notesInput]));
    form.appendChild(h('div', { class: 'field wide' }, [doseHint]));
    form.appendChild(h('div', { class: 'field wide' }, [
      h('button', { type: 'submit', class: 'btn primary', text: editing ? 'Save changes' : 'Add to log' })
    ]));

    /* Opened from a substance page, the compound is already known — filling
       it in saves retyping a name the reader was looking at a second ago,
       and it brings the dose ladder for that compound up with it. Routes and
       units have to be synced after the fields are in the form, since
       syncRoutes writes into the route select. */
    if (prefill) {
      drugInput.value = prefill.name;
      hidden.value = prefill.id;
      syncRoutes(prefill);
    }

    /* Editing an existing dose: every field starts as what was actually
       logged, not as a fresh form.
       This has to run AFTER syncRoutes, and the order inside it matters too.
       syncRoutes rebuilds the route options, and syncDoseHint writes the
       ladder's own unit into the unit select — so a route and unit restored
       before either of those ran would be silently overwritten by a default.
       Restoring the route first, then re-syncing the hint against it, then
       putting the logged amount and unit back on top, is the only ordering
       where what the reader sees is what they recorded. */
    if (editing) {
      var hasRoute = Array.prototype.some.call(routeSel.options, function (o) {
        return o.value === editing.route;
      });
      if (hasRoute) routeSel.value = editing.route;
      syncDoseHint();
      amountInput.value = editing.amount;
      // A unit the select does not offer — an old entry, or one imported from
      // elsewhere — is added rather than dropped. Silently rewriting µg to mg
      // would change the dose by a thousandfold on save.
      var hasUnit = Array.prototype.some.call(unitSel.options, function (o) {
        return o.value === editing.unit;
      });
      if (!hasUnit && editing.unit) {
        unitSel.appendChild(h('option', { value: editing.unit, text: editing.unit }));
      }
      unitSel.value = editing.unit;
      timeInput.value = localISO(new Date(editing.timeMs));
      notesInput.value = editing.notes || '';
    }

    return form;
  }

  /**
   * @param {string=} drugId  Opens with this compound already selected.
   *   Guarded with a typeof test because this is also used directly as a
   *   click handler, which would otherwise hand it a MouseEvent.
   */
  function openLogModal(drugId, mode) {
    var pre = typeof drugId === 'string' ? DB.get(drugId) : null;
    // A metabolite is formed, not taken: it has no route to log against.
    if (pre && (pre.formedInVivo || !Object.keys(pre.routes).length)) pre = null;

    var current = (typeof mode === 'string' && mode === 'solution') ? 'solution' : 'substance';
    var pane = h('div', { class: 'log-pane' });
    var heading = h('h2', {});

    /* Two ways a dose reaches the log, and they are genuinely different
       shapes rather than one form with a checkbox. A substance dose is one
       compound and one amount. A dose of a mixture is a volume that carries
       several compounds at once, and the arithmetic turning that volume into
       milligrams is the whole point of the Solution tab — so the log borrows
       it rather than asking anyone to do it twice by hand. */
    var seg = h('div', { class: 'seg' }, [
      ['Substance', 'substance', 'One compound, one amount.'],
      ['Solution', 'solution', 'A measured dose of a mixture, split into what it delivers of each active in it.']
    ].map(function (m) {
      return h('button', {
        type: 'button',
        class: 'seg-btn' + (current === m[1] ? ' active' : ''),
        title: m[2],
        onclick: function () {
          if (current === m[1]) return;
          current = m[1];
          Array.prototype.forEach.call(seg.children, function (b, i) {
            b.classList.toggle('active', i === (current === 'substance' ? 0 : 1));
          });
          paint();
        }
      }, [m[0]]);
    }));

    function paint() {
      pane.innerHTML = '';
      if (current === 'solution') {
        heading.textContent = 'Log a dose of a mixture';
        pane.appendChild(solutionLogFormEl());
        return;
      }
      heading.textContent = pre ? 'Log a dose of ' + pre.name : 'Log a dose';
      pane.appendChild(logFormEl(pre));
      // With the substance already known, the amount is the next unknown.
      var focusOn = pane.querySelector(pre ? '#f-amount' : '#f-drug');
      if (focusOn) focusOn.focus();
    }

    var body = h('div', { class: 'log-modal' }, [heading, seg, pane]);
    paint();
    openModal(body);
    var initial = body.querySelector(current === 'solution' ? '.sol-log-count' : (pre ? '#f-amount' : '#f-drug'));
    if (initial) initial.focus();
  }

  /**
   * Change a dose that is already logged.
   *
   * Deliberately the same form as logging one, in the same modal, with the
   * same validation — a correction is not a different kind of act from the
   * original entry, and a second form would be a second place for the two to
   * drift apart.
   */
  function openEditLogModal(entry) {
    var d = DB.get(entry.drugId);
    var body = h('div', { class: 'log-modal' }, [
      h('h2', { text: 'Edit ' + (d ? d.name : entry.drugId) }),
      h('p', { class: 'muted small', text:
        'Logged ' + Charts.fmtDayClock(entry.timeMs) + '. Changing the amount or the time moves ' +
        'this dose on every curve it appears in.' }),
      logFormEl(d && !d.formedInVivo && Object.keys(d.routes).length ? d : null, entry)
    ]);
    openModal(body);
    var focusOn = body.querySelector('#f-amount');
    if (focusOn) { focusOn.focus(); focusOn.select(); }
  }

  /* ---------- logging a dose of a mixture --------------------------------- */

  /**
   * Pick a unit that makes the number readable.
   *
   * A mixture dose lands anywhere from 40 µg of a lysergamide to 8 g of
   * ethanol, and writing either of those in milligrams gives a log row that
   * has to be decoded before it can be read. The stored amountMg is identical
   * whichever unit is chosen — Store.toMg converts it back — so this is
   * presentation, and it is safe to pick freely.
   */
  function readableAmount(mg) {
    if (!(mg > 0)) return { amount: 0, unit: 'mg' };
    if (mg >= 1000) return { amount: +(mg / 1000).toPrecision(4), unit: 'g' };
    if (mg < 1) return { amount: +(mg * 1000).toPrecision(4), unit: 'µg' };
    return { amount: +mg.toPrecision(4), unit: 'mg' };
  }

  /**
   * The recipes a dose can be logged from: whatever the Solution tab is
   * currently working on, plus everything saved.
   */
  function logRecipes() {
    var out = [{
      key: '__working',
      name: solutionState.dry ? 'Working dry mix' : 'Working mixture',
      working: true,
      items: solutionState.items,
      dry: !!solutionState.dry,
      doseMl: solutionState.doseMl,
      doseMassMg: solutionState.doseMassMg
    }];
    loadSolutions().forEach(function (s) {
      out.push({
        key: s.id, name: s.name, items: s.items || [],
        dry: !!s.dry, doseMl: s.doseMl, doseMassMg: s.doseMassMg
      });
    });
    return out;
  }

  /**
   * Split a computed mixture into the log entries one dose of it would make.
   *
   * Fillers and solvents are not logged — lactose has no curve — but they are
   * counted and reported, because a mixture that logs two of its five
   * ingredients should say which three it left out rather than let someone
   * conclude the other three were forgotten.
   *
   * Ethanol carried by the solvent is included deliberately. A 1 ml dose of a
   * water-based solution carries none worth logging, and a 20 ml dose of
   * something cut with spirits carries a real drink — the calculator already
   * works that out, and dropping it here would make the log quietly wrong in
   * exactly the case where the interaction matters most.
   */
  function mixtureLogRows(res) {
    var rows = [], skipped = [];
    res.rows.forEach(function (r) {
      var d = r.drug;
      if (!d) { skipped.push({ name: r.drugName, why: 'not in the database' }); return; }
      if (r.inactive) { skipped.push({ name: d.name, why: 'inactive' }); return; }
      if (d.formedInVivo || !Object.keys(d.routes).length) {
        skipped.push({ name: d.name, why: 'no route to log against' });
        return;
      }
      if (!(r.perDoseMg > 0)) { skipped.push({ name: d.name, why: 'nothing in a dose' }); return; }
      rows.push({
        drug: d,
        route: d.routes[r.route] ? r.route : Object.keys(d.routes)[0],
        mg: r.perDoseMg
      });
    });

    var sd = res.solventDose;
    if (sd && sd.drug && sd.gramsPerDose > 0) {
      var sdd = sd.drug;
      if (!sdd.formedInVivo && Object.keys(sdd.routes).length) {
        rows.push({
          drug: sdd,
          route: sdd.routes.oral ? 'oral' : Object.keys(sdd.routes)[0],
          mg: sd.gramsPerDose * 1000,
          fromSolvent: true
        });
      }
    }
    return { rows: rows, skipped: skipped };
  }

  /**
   * The dose-of-a-mixture form.
   *
   * Everything below the recipe picker is derived: the reader chooses which
   * mixture and how many doses, and the form shows exactly what will be
   * written to the log before it writes any of it. That preview is the point.
   * One measured volume becoming four separate log entries is a surprising
   * enough thing for an app to do that it should never happen unseen.
   */
  function solutionLogFormEl() {
    var recipes = logRecipes();
    var form = h('form', { class: 'log-form sol-log' });

    var pick = h('select', { class: 'sol-log-source' }, recipes.map(function (r) {
      return h('option', { value: r.key, text: r.name + (r.working ? ' (Solution tab)' : '') });
    }));
    var countInput = h('input', {
      type: 'number', class: 'sol-log-count', step: 'any', min: '0.01', value: '1'
    });
    var timeInput = h('input', { type: 'datetime-local', class: 'sol-log-time', value: localISO(new Date()) });
    var notesInput = h('input', { type: 'text', class: 'sol-log-notes', placeholder: 'Context, setting, how it felt…' });
    var preview = h('div', { class: 'sol-log-preview' });

    function currentRecipe() {
      var hit = null;
      recipes.forEach(function (r) { if (r.key === pick.value) hit = r; });
      return hit;
    }

    function doseText(rec, count) {
      var one = rec.dry ? Potency.fmtMg(rec.doseMassMg || 0) : (rec.doseMl || 0) + ' ml';
      return count === 1 ? one : (+count.toPrecision(4)) + ' × ' + one;
    }

    function paint() {
      preview.innerHTML = '';
      var rec = currentRecipe();
      if (!rec) return;
      var count = parseFloat(countInput.value);
      if (!(count > 0)) count = 1;

      var res = Solution.compute(rec.items, {
        dry: rec.dry, doseMl: rec.doseMl, doseMassMg: rec.doseMassMg
      });
      var split = mixtureLogRows(res);

      preview.appendChild(h('p', { class: 'muted small', text:
        doseText(rec, count) + ' of ' + rec.name + (rec.dry ? ' (weighed)' : '') + '.' }));

      if (!split.rows.length) {
        preview.appendChild(h('div', { class: 'empty small' }, [
          h('p', { text: 'Nothing in this mixture can be logged — it has no active ingredient with a route.' }),
          h('button', {
            type: 'button', class: 'btn small',
            text: 'Open the Solution tab', onclick: function () { closeModal(); goTab('solution'); }
          })
        ]));
        return;
      }

      /* "Per dose" only earns a column when it differs from what gets logged.
         At one dose the two are the same quantity, and printing it twice —
         rounded two different ways, as it was — reads as a discrepancy rather
         than as a multiplier of one. */
      var showPer = count !== 1;
      var cols = showPer ? ['Substance', 'Route', 'Per dose', 'Logged', 'Tier']
                         : ['Substance', 'Route', 'Logged', 'Tier'];
      var tbl = h('table', { class: 'log-table' }, [
        h('thead', {}, [h('tr', {}, cols.map(function (t) { return h('th', { text: t }); }))])
      ]);
      var tb = h('tbody');
      split.rows.forEach(function (r) {
        var totalMg = r.mg * count;
        var ra = readableAmount(totalMg);
        var per = readableAmount(r.mg);
        var tier = PK.doseTier(r.drug, r.route, totalMg).tier;
        tb.appendChild(h('tr', {}, [
          h('td', {}, [
            h('span', { text: r.drug.name }),
            r.fromSolvent ? h('span', { class: 'tag-chip', title:
              'Carried by the solvent rather than added as an ingredient.', text: 'solvent' }) : null
          ]),
          h('td', { text: r.route }),
          showPer ? h('td', { text: per.amount + ' ' + per.unit }) : null,
          h('td', { text: ra.amount + ' ' + ra.unit }),
          h('td', {}, [h('span', { class: 'pill tier-' + tier, text: tier })])
        ]));
      });
      tbl.appendChild(tb);
      preview.appendChild(h('div', { class: 'table-wrap' }, [tbl]));

      if (split.skipped.length) {
        preview.appendChild(h('p', { class: 'muted small', text:
          'Not logged: ' + split.skipped.map(function (s) {
            return s.name + ' (' + s.why + ')';
          }).join(', ') + '.' }));
      }

      preview.appendChild(h('p', { class: 'muted small', text:
        split.rows.length === 1
          ? 'One entry will be added to the log.'
          : split.rows.length + ' separate entries will be added, one per active, all at the same time. ' +
            'They can be edited or deleted individually afterwards.' }));
    }

    pick.addEventListener('change', paint);
    countInput.addEventListener('input', paint);

    form.appendChild(h('div', { class: 'field wide' }, [
      h('label', { text: 'Mixture' }), pick
    ]));
    form.appendChild(h('div', { class: 'field' }, [
      h('label', { text: 'Doses taken' }), countInput
    ]));
    form.appendChild(h('div', { class: 'field' }, [
      h('label', { text: 'Time' }), timeInput
    ]));
    form.appendChild(h('div', { class: 'field wide' }, [
      h('label', { text: 'Notes' }), notesInput
    ]));
    form.appendChild(h('div', { class: 'field wide' }, [preview]));
    form.appendChild(h('div', { class: 'field wide' }, [
      h('button', { type: 'submit', class: 'btn primary', text: 'Add to log' })
    ]));

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var rec = currentRecipe();
      if (!rec) return;
      var count = parseFloat(countInput.value);
      if (!(count > 0)) {
        UI.toast('Enter how many doses were taken.', { kind: 'warn' });
        countInput.focus(); countInput.select();
        return;
      }
      var res = Solution.compute(rec.items, {
        dry: rec.dry, doseMl: rec.doseMl, doseMassMg: rec.doseMassMg
      });
      var split = mixtureLogRows(res);
      if (!split.rows.length) {
        UI.toast('Nothing in that mixture can be logged.', { kind: 'warn' });
        return;
      }

      var timeMs = new Date(timeInput.value).getTime() || Date.now();
      var userNotes = String(notesInput.value || '').trim();
      // The mixture and the measure go into every entry's notes. Six months
      // later a bare "1.2 mg alprazolam" in the history says nothing about
      // where it came from, and the entries are individually editable, so
      // there is no other thread tying them back together.
      var provenance = rec.name + ' · ' + doseText(rec, count);
      var added = [];
      split.rows.forEach(function (r) {
        var ra = readableAmount(r.mg * count);
        var entry = {
          drugId: r.drug.id,
          route: r.route,
          amount: ra.amount,
          unit: ra.unit,
          timeMs: timeMs,
          notes: [userNotes, provenance].filter(Boolean).join(' · ')
        };
        Store.add(entry);
        added.push(entry.id);
      });

      closeModal();
      state.tab = 'now';
      render();
      UI.toast('Logged ' + added.length + ' entr' + (added.length === 1 ? 'y' : 'ies') +
        ' from ' + rec.name, {
        kind: 'ok',
        actionLabel: 'Undo',
        action: function () {
          added.forEach(function (id) { Store.remove(id); });
          render();
          UI.toast('Removed', { kind: 'ok' });
        }
      });
    });

    paint();
    return form;
  }

  /* ---------- dose history: collapsible, filtered, paged ------------------ */

  /**
   * One searchable string per entry, so a single box can match on substance,
   * date, tier, route or notes without the user choosing a field first.
   * Several date spellings are included because people search "aug", "8/14"
   * and "2026" interchangeably.
   */
  function historyHaystack(l) {
    var d = DB.get(l.drugId);
    var when = new Date(l.timeMs);
    var tier = d ? PK.doseTier(d, l.route, l.amountMg).tier : '';
    return [
      d ? d.name : l.drugId,
      d ? d.id : '',
      d ? (d.aliases || []).join(' ') : '',
      d ? d.class : '',
      l.route, tier, l.notes || '',
      l.amount + ' ' + l.unit,
      Charts.fmtDayClock(l.timeMs),
      when.toDateString(),
      when.toLocaleDateString(),
      when.getFullYear(),
      when.toISOString().slice(0, 10)
    ].join(' ').toLowerCase();
  }

  function filterHistory(logs, query) {
    var q = String(query || '').trim().toLowerCase();
    if (!q) return logs;
    // All terms must match, so "codeine oral" narrows rather than widens.
    var terms = q.split(/\s+/);
    return logs.filter(function (l) {
      var hay = historyHaystack(l);
      return terms.every(function (t) { return hay.indexOf(t) >= 0; });
    });
  }

  var HISTORY_PAGE_SIZES = [5, 10, 25, 50, 0];

  function renderHistory(root) {
    var all = Store.load().slice().reverse();
    var sec = section('now.history', 'Dose history', { open: false, count: all.length });

    var body = sec.body;
    var controls = h('div', { class: 'history-controls' });

    var searchInput = h('input', {
      type: 'search', class: 'history-search', value: state.historyQuery,
      placeholder: 'Filter by substance, date, tier, route or notes…'
    });

    var sizeSel = h('select', {
      onchange: function (e) {
        state.historyLimit = parseInt(e.target.value, 10);
        Store.setPref('historyLimit', state.historyLimit);
        paint();
      }
    }, HISTORY_PAGE_SIZES.map(function (n) {
      return h('option', {
        value: n, text: n === 0 ? 'All' : 'Show ' + n,
        selected: state.historyLimit === n ? 'selected' : null
      });
    }));

    controls.appendChild(searchInput);
    controls.appendChild(sizeSel);
    controls.appendChild(h('div', { class: 'row-actions' }, [
      h('button', { class: 'btn small', text: 'Export JSON', onclick: function () { download('drug-log.json', Store.exportJSON(), 'application/json'); } }),
      h('button', { class: 'btn small', text: 'Export CSV', onclick: function () { download('drug-log.csv', Store.exportCSV(), 'text/csv'); } }),
      h('label', { class: 'btn small file' }, [
        'Import', h('input', { type: 'file', accept: '.json', onchange: onImport })
      ])
    ]));
    body.appendChild(controls);

    var listWrap = h('div', {});
    body.appendChild(listWrap);

    // Repaint only the list on keystrokes — a full render() would rebuild the
    // input and lose focus and caret position mid-word.
    function paint() {
      listWrap.innerHTML = '';
      var matched = filterHistory(all, state.historyQuery);
      var limit = state.historyLimit === 0 ? matched.length : state.historyLimit;
      var shown = matched.slice(0, limit);

      listWrap.appendChild(h('p', { class: 'muted small', text:
        !all.length ? 'No doses logged yet.'
        : state.historyQuery
          ? 'Showing ' + shown.length + ' of ' + matched.length + ' matching · ' + all.length + ' logged in total'
          : 'Showing ' + shown.length + ' of ' + all.length + ' logged' }));

      if (!shown.length) {
        listWrap.appendChild(h('div', { class: 'empty small' }, [
          h('p', { text: all.length ? 'Nothing matches that filter.' : 'Log a dose to start.' })
        ]));
        return;
      }

      var table = h('table', { class: 'log-table' }, [
        h('thead', {}, [h('tr', {}, ['When', 'Substance', 'Dose', 'Route', 'Tier', 'Notes', ''].map(function (t) {
          return h('th', { text: t });
        }))])
      ]);
      var tbody = h('tbody');
      shown.forEach(function (l) {
        var d = DB.get(l.drugId);
        var tier = d ? PK.doseTier(d, l.route, l.amountMg).tier : '—';
        tbody.appendChild(h('tr', {}, [
          h('td', { text: Charts.fmtDayClock(l.timeMs) }),
          h('td', {}, [d
            ? h('button', { class: 'link-title small', onclick: function () { openDrug(d.id); } }, [d.name])
            : document.createTextNode(l.drugId)]),
          h('td', { text: fmtDose(l) }),
          h('td', { text: l.route }),
          h('td', {}, [h('span', { class: 'pill tier-' + tier, text: tier })]),
          h('td', { class: 'notes', text: l.notes || '' }),
          h('td', { class: 'row-tools' }, [h('button', {
            /* A logged dose is a memory of something that already happened,
               and memories get corrected — the wrong strength, the wrong
               route, an hour out because it was typed the next morning. Until
               this existed the only way to fix any of that was to delete the
               row and retype it, which loses the entry id and with it the
               match against any export made before the correction. */
            class: 'btn tiny', text: 'Edit',
            onclick: function () { openEditLogModal(l); }
          }), h('button', {
            class: 'btn tiny danger', text: 'Delete',
            /* No confirmation dialog. A dose row is small, cheap to
               re-create, and the undo in the toast is faster to reach than
               an OK button would have been — and it does not stand between
               the reader and the twenty rows they actually meant to clear. */
            onclick: function () {
              var d2 = DB.get(l.drugId);
              Store.remove(l.id);
              render();
              UI.toast('Deleted ' + (d2 ? d2.name : l.drugId) + ' · ' + fmtDose(l), {
                actionLabel: 'Undo',
                action: function () {
                  var logs = Store.load();
                  logs.push(l);
                  Store.save(logs);
                  render();
                  UI.toast('Restored', { kind: 'ok' });
                }
              });
            }
          })])
        ]));
      });
      table.appendChild(tbody);
      listWrap.appendChild(h('div', { class: 'table-wrap' }, [table]));

      if (matched.length > shown.length) {
        listWrap.appendChild(h('button', {
          class: 'btn small', text: 'Show ' + Math.min(25, matched.length - shown.length) + ' more',
          onclick: function () {
            state.historyLimit = (state.historyLimit || 5) + 25;
            paint();
          }
        }));
      }
    }

    searchInput.addEventListener('input', function (e) {
      state.historyQuery = e.target.value;
      paint();
    });

    paint();
    root.appendChild(sec.el);
  }

  function onSubmitLog(e) {
    e.preventDefault();
    var id = $('#f-drug-id').value;
    var drug = DB.get(id || $('#f-drug').value);
    if (!drug) {
      UI.toast('Substance not recognised — pick one from the suggestions.', { kind: 'warn' });
      var fd = $('#f-drug'); if (fd) { fd.focus(); fd.select(); }
      return;
    }
    var amount = parseFloat($('#f-amount').value);
    if (!(amount > 0)) {
      UI.toast('Enter an amount.', { kind: 'warn' });
      var fa = $('#f-amount'); if (fa) { fa.focus(); fa.select(); }
      return;
    }
    var unit = $('#f-unit').value;
    var idField = $('#f-log-id');
    var editId = idField ? idField.value : '';
    var entry = {
      drugId: drug.id,
      route: $('#f-route').value || Object.keys(drug.routes)[0],
      amount: amount,
      unit: unit,
      timeMs: new Date($('#f-time').value).getTime() || Date.now(),
      notes: $('#f-notes').value
    };

    if (editId) {
      /* Editing keeps the entry's id, so anything holding a reference to it
         still resolves and an export made before the change lines up with one
         made after. Store.update recomputes amountMg from the new amount and
         unit — the curves read that, not the display figure, so a correction
         that skipped it would show the new dose and model the old one.

         The undo carries the whole previous entry rather than a diff. A
         mistyped correction is exactly as easy to make as the mistype it was
         fixing, and the way back should not be another round of retyping. */
      var before = null;
      Store.load().forEach(function (l) { if (l.id === editId) before = JSON.parse(JSON.stringify(l)); });
      Store.update(editId, entry);
      closeModal();
      render();
      UI.toast('Updated ' + drug.name + ' · ' + amount + ' ' + unit, {
        kind: 'ok',
        actionLabel: before ? 'Undo' : null,
        action: before ? function () {
          Store.update(editId, before);
          render();
          UI.toast('Reverted', { kind: 'ok' });
        } : null
      });
      return;
    }

    Store.add(entry);
    // The form lives in a modal now, so dismiss it and land back on Now with
    // the new dose already folded into the curves.
    closeModal();
    state.tab = 'now';
    render();
    UI.toast('Logged ' + drug.name + ' · ' + amount + ' ' + unit, { kind: 'ok' });
  }

  function onImport(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var n = Store.importJSON(reader.result);
        render();
        UI.toast(n ? 'Imported ' + n + ' entries.' : 'Nothing new in that file — every entry was already logged.',
          { kind: n ? 'ok' : null });
      } catch (err) {
        UI.toast('Import failed: ' + err.message, { kind: 'danger', timeout: 6000 });
      }
    };
    reader.readAsText(file);
  }

  function localISO(d) {
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
           'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = h('a', { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    UI.toast('Saved ' + name, { kind: 'ok' });
  }

  /* ======================================================================
     TAB: TIMELINE
     ====================================================================== */

  /* ---------- metabolite curves --------------------------------------------
     The dose chart answers "when is the drug there". It cannot answer "when
     is the thing the drug turned into there", and for a lot of compounds that
     is the question that actually matters — heroin is gone within the hour
     while morphine and M6G are still climbing, and diazepam's nordazepam is
     still rising three days later.

     So this builds a second set of lines, one per active metabolite, sharing
     the dose chart's time axis and scrub cursor. Each is scaled to its own
     peak: the absolute amounts differ by orders of magnitude between a main
     route and a 3% side route, and plotting those together on one axis leaves
     every minor metabolite flat against zero. Relative timing is the readable
     question, and it is the one the chart is for.
     ------------------------------------------------------------------------ */

  /**
   * Line series for every active metabolite of the visible doses.
   *
   * Follows the same display mode as the dose chart above it. In separate mode
   * each dose contributes its own metabolite lines; in combined mode the doses
   * of a substance are merged first, so three doses of amphetamine produce one
   * 4-hydroxyamphetamine line covering all three rather than three
   * near-identical lines drawn on top of each other.
   */
  /**
   * Every line on the timeline: parent doses and their active metabolites,
   * on ONE chart and ONE scale.
   *
   * They used to be two charts, and the two disagreed. The dose chart plotted
   * subjective effect while the metabolite chart plotted each metabolite
   * against its own peak — so every metabolite came out the same height,
   * whatever its actual share of the dose, and neither chart could be read
   * against the other. A metabolite that genuinely outlasts and outweighs its
   * parent looked exactly like one that never rises above a trace.
   *
   * Now both are amount-based and share an axis, so a curve twice as high
   * means twice as much material and a peak is where the peak actually is.
   *
   *   mg      milligram-equivalents of the dose, directly comparable.
   *   %       the same figures over that substance's common dose, which keeps
   *           the parent-to-metabolite ratios true while letting a 0.5 mg
   *           benzodiazepine share an axis with 60 mg of codeine.
   *   effect  the modelled subjective-intensity envelope. Metabolites have no
   *           envelope of their own, so theirs is derived from the amount
   *           present and the recorded relative potency — see
   *           metaboliteEffectAt(), and the "derived" tag in the legend.
   */
  function timelineSeries(visible, t0, t1, cap) {
    var unit = state.timelineUnit;
    var withMets = state.showMetabolites;

    // Build the units of work: one per dose, or one per substance when combined.
    var units = [];
    if (isCombined()) {
      var byId = {};
      visible.forEach(function (c) {
        if (!byId[c.drug.id]) { byId[c.drug.id] = { drug: c.drug, curves: [] }; units.push(byId[c.drug.id]); }
        byId[c.drug.id].curves.push(c);
      });
    } else {
      units = visible.map(function (c) { return { drug: c.drug, curves: [c] }; });
    }

    /* In separate mode two doses of one substance produce two units, and
       naming both after the substance gave a legend with the same entry twice
       and no way to tell which line was which. */
    units.forEach(function (u) {
      u.label = u.drug.name;
      if (u.curves.length > 1) {
        u.label += ' (' + u.curves.length + ' doses)';
      } else if (!isCombined() && visible.filter(function (c) {
        return c.drug.id === u.drug.id;
      }).length > 1) {
        // Dose and clock time usually separate two doses of one substance —
        // but not two routes taken at the same moment, which is exactly the
        // case where the difference matters most, since the route can change
        // what the compound becomes.
        u.label += ' · ' + fmtDose(u.curves[0].entry) + ' ' + routeLabel(u.curves[0].routeKey) +
          ' at ' + Charts.fmtClock(u.curves[0].entry.timeMs);
      }
      /* The denominator that turns this substance's milligrams into a
         percentage: the highest the summed amount ever gets over the whole
         course of these doses, so the curve reads 100% at its own peak.

         Sampled over the FULL course rather than over the visible window. If
         it were the window's maximum, panning to a quiet stretch would rescale
         a trace up to 100% and a dose long past its peak would look like it
         was at it. Sampling the whole course means the window shows whatever
         share of the peak it actually contains. */
      var startH = Math.min.apply(null, u.curves.map(function (c) { return c.tStartH; }));
      var endH = Math.max.apply(null, u.curves.map(function (c) { return c.tStartH + c.clearanceH(); }));

      /* A uniform grid alone cannot find the peak of a fast route on a slow
         compound, and the ratio involved is not marginal. Intravenous
         diazepam peaks four minutes into a clearance window of five hundred
         hours: 400 even steps are 1.4 h apart and step clean over it, so the
         denominator came back too small and the curve read 101% of its own
         peak — a percentage that is meant to cap at 100 by construction.

         The peak of a Bateman curve is at its own tmax and the peak of an
         effect envelope is on its plateau, both of which are known exactly.
         So those times are added to the grid as candidates rather than
         hoped for. The grid still earns its place: where doses overlap the
         summed peak sits between the individual ones and is at none of
         them. */
      var times = [];
      for (var i = 0; i <= 400; i++) {
        times.push(startH + (i / 400) * Math.max(0.1, endH - startH));
      }
      u.curves.forEach(function (c) {
        times.push(c.tStartH + c.tmaxH);
        times.push(c.tStartH + c.phases.peak);
        times.push(c.tStartH + c.phases.plateauEnd);
      });

      var peak = 0, peakEffect = 0;
      times.forEach(function (tH) {
        var v = u.curves.reduce(function (a, c) { return a + remainingMgAt(c, tH); }, 0);
        if (v > peak) peak = v;
        var e = u.curves.reduce(function (a, c) { return a + c.effectAt(tH); }, 0);
        if (e > peakEffect) peakEffect = e;
      });
      u.peakMg = peak;
      // The height the parent's own effect curve reaches. Metabolite effect is
      // anchored to it — see metaboliteEffectAt().
      u.peakEffect = peakEffect;
    });

    /**
     * A metabolite's contribution to the effect curve.
     *
     * Metabolites have no effect envelope: nobody publishes an onset, peak and
     * duration for α-hydroxyflualprazolam, so the construction the parent uses
     * is simply not available. What the database does have, for 339 of the 340
     * active metabolites, is a potency relative to the parent.
     *
     * So the amount present is converted to parent-equivalent milligrams and
     * anchored against the parent's own curve: when a metabolite holds as much
     * parent-equivalent material as the parent held at ITS peak, it is drawn at
     * the height the parent reached there.
     *
     * The square root is not decoration. PK.buildDoseCurve compresses dose into
     * intensity as `ratio ^ 0.5`, so effect is already modelled as a
     * square-root response to amount everywhere else in this app; scaling the
     * metabolite linearly instead would understate it by exactly that
     * compression — on five stacked 100 mg doses of methamphetamine, by a
     * factor of five. Mirroring the parent's own law is the consistent choice.
     *
     * No new pharmacology is asserted: only the relative potency already
     * recorded, put through the dose-response the parent already uses.
     *
     * The caveat is real and the UI states it: this tracks the amount present,
     * where the parent's curve tracks reported subjective phases. For a
     * metabolite that lags its parent by two days the shape is sound and the
     * absolute height is an extrapolation from a single number.
     */
    function metaboliteEffectAt(prof, u, tH) {
      if (prof.potencyRel == null || !(u.peakMg > 0) || !(u.peakEffect > 0)) return 0;
      var eqMg = prof.amountAt(tH) * prof.potencyRel;
      if (!(eqMg > 0)) return 0;
      return u.peakEffect * Math.sqrt(eqMg / u.peakMg);
    }

    var parentValue = function (c, tH) {
      return unit === 'effect' ? c.effectAt(tH) : remainingMgAt(c, tH);
    };

    var out = [];

    units.forEach(function (u) {
      /* In percent EVERY curve is a share of its own peak, so nothing exceeds
         100% and nothing is squashed against the axis. The parent's
         denominator is the most of it that is ever in the body across these
         doses; each metabolite's is its own maximum.

         The earlier denominator was one common dose, which is a fine reference
         for a single dose and a poor one for five: five 100 mg doses of
         methamphetamine over a 20 mg common dose reached about 985%, and a
         metabolite normalised to its own peak topped out at a tenth of that
         and disappeared. */
      var scale = (unit === 'percent' && u.peakMg > 0) ? 1 / u.peakMg : 1;

      // One function drives both the drawn curve and the legend readout, so a
      // figure beside a name can never disagree with the line above it.
      var parentPlot = function (t) {
        var tH = t / HOUR;
        var v = u.curves.reduce(function (a, c) { return a + parentValue(c, tH); }, 0);
        return unit === 'effect' ? v : v * scale;
      };

      out.push({
        name: u.label,
        points: sampleFn(t0, t1, parentPlot, 280),
        width: 2.6, fill: true, _parent: true, _rank: 2,
        _ownScale: unit === 'percent',
        plotAt: parentPlot,
        // The real quantity, whatever the axis happens to be showing.
        amountAt: function (tMs) {
          var tH = tMs / HOUR;
          return u.curves.reduce(function (a, c) { return a + remainingMgAt(c, tH); }, 0);
        }
      });

      if (!withMets) return;

      mergedBreakdown(u.curves)
        .filter(function (m) { return m.active; })
        .forEach(function (prof) {
          /* The two axes answer different questions and scale metabolites
             differently on purpose.

             In mg every curve is a real quantity on one axis, so heights are
             comparable and a metabolite that is a twentieth of its parent
             looks like a twentieth — true, and frequently unreadable.

             In % each metabolite is scaled to ITS OWN peak instead, which
             makes the shape legible: when it starts forming, when it tops
             out, how long it takes to clear. Heights are then NOT comparable
             between curves, and the legend flags each such curve so. */
          // A metabolite with no recorded relative potency has no basis for an
          // effect height, so it sits out that view rather than being guessed at.
          if (unit === 'effect' && prof.potencyRel == null) return;

          var metPlot = function (t) {
            var tH = t / HOUR;
            if (unit === 'effect') return metaboliteEffectAt(prof, u, tH);
            return unit === 'percent' ? prof.relativeAt(tH) : prof.amountAt(tH) * scale;
          };
          var pts = sampleFn(t0, t1, metPlot, 280);
          // Drop anything that never rises above a trace anywhere in the
          // window — an invisible line still costs a legend entry.
          var peak = pts.reduce(function (a, p) { return Math.max(a, p[1]); }, 0);
          if (peak <= 0) return;
          out.push({
            // Named for what actually made it, which after the model went
            // recursive is not always the compound that was taken.
            name: prof.name + ' · from ' + prof.parentNames.join(' + ') +
              (prof.outlastsParent ? ' · outlasts parent' : ''),
            points: pts,
            width: 1.9,
            _rank: prof.formationFraction,
            _ownScale: unit === 'percent',
            _derivedEffect: unit === 'effect',
            plotAt: metPlot,
            amountAt: function (tMs) { return prof.amountAt(tMs / HOUR); }
          });
        });
    });

    // Parents first, then most-formed, so a 5% side route never pushes a
    // parent or the main metabolite out when the cap bites.
    out.sort(function (a, b) { return b._rank - a._rank; });
    var kept = out.slice(0, cap);
    kept.forEach(function (s, i) { s.color = Charts.colorFor(i); });
    return { series: kept, total: out.length, withMets: withMets };
  }

  /**
   * Milligrams of a dose circulating at `tH`.
   *
   * The bioavailable fraction of what was swallowed, scaled by how much of it
   * has not yet been eliminated — the same figure the cards report, so a
   * chart in milligrams and a card in milligrams agree.
   */
  function remainingMgAt(c, tH) {
    return c.amountMgAt(tH);
  }

  /**
   * What the timeline plots on the y axis.
   *
   * Three genuinely different questions, and no one axis answers all of them.
   * Milligrams are comparable across substances and squash the potent ones
   * against the axis. Percent-of-own-peak makes every curve legible at the
   * cost of comparing heights between them. Effect is the only one that speaks
   * to how something feels, and the only one whose metabolite curves are
   * derived rather than modelled from reported windows.
   */
  function timelineUnitPicker() {
    var wrap = h('div', { class: 'seg' });
    [['effect', 'effect', 'Modelled subjective intensity, from reported onset/peak/duration windows. Metabolite curves are derived from the amount present and its recorded potency relative to the parent, and are tagged as such.'],
     ['percent', '%', 'Amounts over one common dose of the parent. Comparable across substances, and each metabolite stays in proportion to the parent that made it.'],
     ['mg', 'mg', 'Milligram-equivalents in the body, parents and metabolites on one axis. Directly comparable, so a potent compound sits close to the axis.']
    ].forEach(function (m) {
      wrap.appendChild(h('button', {
        class: 'seg-btn' + (state.timelineUnit === m[0] ? ' active' : ''),
        title: m[2],
        onclick: function () {
          state.timelineUnit = m[0];
          Store.setPref('timelineUnit', m[0]);
          render();
        }
      }, [m[1]]));
    });
    return wrap;
  }

  /** One swatch and name per line, for charts whose series are named. */
  /**
   * One swatch and name per line, for charts whose series are named.
   *
   * The legend is a live readout: scrubbing the timeline updates the figure
   * beside every name, so "how much of that is in me at 3am" is answered by
   * moving the cursor rather than by reading a curve off a grid line.
   *
   * What the figure MEANS follows the axis, because a number in different
   * units to the chart it sits under is a trap:
   *
   *   mg      milligrams in the body.
   *   %       that compound's share of its own peak — the same number the
   *           curve is drawn at.
   *   effect  its share of the combined effect of everything active at that
   *           moment, which is the question effect mode is actually about:
   *           not "how strong is this" but "how much of what I am feeling is
   *           this one".
   */
  function seriesLegend(series, cursorMs, unit) {
    /* The number each row is reporting, before it is formatted. Both the
       readout and the ordering come from this, so a row can never sort
       somewhere its own figure does not justify.

       In effect mode the readout is a SHARE of everything active, but the
       denominator is the same for every row, so ranking by the raw value
       gives the identical order for a fraction of the work. */
    var valueOf = function (s, tMs) {
      if (unit === 'mg' || !s.plotAt) return s.amountAt ? s.amountAt(tMs) : -Infinity;
      return s.plotAt(tMs);
    };

    // A finite sort key, so a row with nothing to report sinks to the bottom
    // instead of poisoning the comparator with NaN.
    var sortKey = function (s, tMs) {
      var v = valueOf(s, tMs);
      return isFinite(v) ? v : -Number.MAX_VALUE;
    };

    var readout = function (s, tMs) {
      if (unit === 'mg' || !s.plotAt) {
        if (!s.amountAt) return '';
        var mg = valueOf(s, tMs);
        // Below a nanogram is gone. Formatting it anyway produced "0 ng",
        // which reads as a measurement rather than as nothing.
        return mg > 1e-6 ? Potency.fmtMg(mg) : '—';
      }
      var v = valueOf(s, tMs);
      if (unit === 'percent') return v >= 0.005 ? Math.round(v * 100) + '%' : '—';
      // effect: share of everything active right now.
      var total = series.reduce(function (a, x) {
        return a + (x.plotAt ? Math.max(0, x.plotAt(tMs)) : 0);
      }, 0);
      if (!(total > 0) || v / total < 0.005) return '—';
      return Math.round(v / total * 100) + '%';
    };

    // Every row, with its element and its figure, so the list can be
    // reordered and filtered as well as updated.
    var rows = [];

    var el = h('div', { class: 'legend' }, series.map(function (s, i) {
      var val = (s.amountAt || s.plotAt) ? h('span', { class: 'legend-val' }) : null;
      var item = h('span', { class: 'legend-item' + (s._ownScale ? ' legend-own-scale' : '') }, [
        h('span', { class: 'legend-swatch', style: 'background:' + s.color + (s.dashed ? ';opacity:.55' : '') }),
        h('span', { class: 'legend-name', text: s.name }),
        // A curve drawn against its own peak rather than the shared axis is
        // marked, so nobody reads its height against the one beside it.
        s._ownScale ? h('span', { class: 'legend-flag', title:
          'Drawn as a share of its own peak, so it tops out at 100%. Heights cannot be compared between ' +
          'curves — switch the Y axis to mg for that. The figure here is the real amount either way.',
          text: '% of own peak' }) : null,
        s._derivedEffect ? h('span', { class: 'legend-flag', title:
          'No effect envelope is published for a metabolite. This is derived: the amount present, converted ' +
          'to parent-equivalent milligrams by its recorded relative potency, put through the same ' +
          'square-root dose-response the parent uses and anchored to the height the parent\u2019s own curve ' +
          'reaches at its peak. The shape follows the amount rather than reported subjective phases.',
          text: 'derived' }) : null,
        val
      ]);
      rows.push({ item: item, val: val, s: s, i: i });
      return item;
    }));

    // Shown when the cursor sits somewhere nothing is on board, so the
      // legend collapsing to nothing reads as an answer rather than a fault.
    var emptyNote = h('span', { class: 'legend-empty muted small',
      text: 'nothing present at this moment' });
    el.appendChild(emptyNote);

    /* ---- only what is there, largest first -------------------------------
       Two rules, both keyed to the same thing: the figure the row is
       reporting at the cursor.

       A row with nothing to report is not listed. It used to sit there
       reading "—", which is a swatch, a name and a dash taking up a line to
       say that a compound is absent — and on a log with a few doses in it,
       most of the legend was that. The curve is still drawn; it is flat on
       the axis, which is the same statement made in the place that has room
       for it.

       What is left sorts by that figure, largest first, and re-sorts as the
       cursor moves, because the whole point of a live readout is that the
       answer changes. The build order — parents first, then by share of the
       dose — still does its job upstream, where it decides which curves
       survive the cap; as a reading order, next to a column of live
       percentages, it looked like no order at all. Colours are deliberately
       left alone: a swatch that changed colour when one compound overtook
       another would make the chart above it unreadable. */
    el.__setCursor = function (tMs) {
      var here = [];
      rows.forEach(function (r) {
        var text = readout(r.s, tMs);
        if (r.val) r.val.textContent = text;
        // "—" and "" are the readout's own way of saying there is nothing
        // to show, so presence is decided by the same code that formats it
        // and the two can never disagree.
        var present = text !== '' && text !== '\u2014';
        r.item.style.display = present ? '' : 'none';
        if (present) here.push(r);
      });

      here.sort(function (a, b) {
        // Ties keep their original order rather than shuffling between repaints.
        return (sortKey(b.s, tMs) - sortKey(a.s, tMs)) || (a.i - b.i);
      }).forEach(function (r) {
        // Appending a node that is already a child moves it, so this reorders
        // in place without rebuilding anything.
        el.appendChild(r.item);
      });

      emptyNote.style.display = here.length ? 'none' : '';
      el.appendChild(emptyNote);
    };
    if (cursorMs != null) el.__setCursor(cursorMs);
    return el;
  }

  /* ---------- the hover readout -------------------------------------------

     What every compound is doing at one moment used to be a legend under the
     chart: a fixed block, as tall as the number of curves, reporting whatever
     the scrub cursor was sitting on. On a busy log that was a dozen rows of
     text pushing the cards off the screen, and it answered for the cursor
     rather than for wherever you were actually looking.

     It is a tooltip now. Hover the chart, wait a moment, and it appears at
     the pointer and follows it, reporting the moment under the pointer rather
     than the moment the cursor is parked at — so the chart can be read
     without disturbing the cards below, which still answer for the cursor.

     THE DWELL IS DELIBERATE. Appearing instantly means it flashes up every
     time the pointer crosses the chart on its way somewhere else. Half a
     second is long enough that only an intentional hover triggers it and
     short enough not to feel broken.
     ------------------------------------------------------------------------ */

  var HOVER_DWELL_MS = 500;

  function attachHoverReadout(wrap, svg, series, unit, t0, t1, nowMs) {
    /* One element, reused. It lives on <body> so no ancestor can clip it,
       which means it outlives the view that made it — so any previous one is
       removed here rather than left to accumulate on every render. */
    var old = document.getElementById('hover-readout');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var tip = h('div', { class: 'hover-readout', id: 'hover-readout' });
    document.body.appendChild(tip);

    var timer = null, shown = false, lastX = 0, lastY = 0;

    // Same three readings the legend used, and for the same reason: a figure
    // in different units to the axis it sits under is a trap.
    function valueOf(sr, tMs) {
      if (unit === 'mg' || !sr.plotAt) return sr.amountAt ? sr.amountAt(tMs) : -Infinity;
      return sr.plotAt(tMs);
    }
    function readout(sr, tMs) {
      if (unit === 'mg' || !sr.plotAt) {
        if (!sr.amountAt) return '';
        var mg = sr.amountAt(tMs);
        return mg > 1e-6 ? Potency.fmtMg(mg) : '—';
      }
      var v = sr.plotAt(tMs);
      if (unit === 'percent') return v >= 0.005 ? Math.round(v * 100) + '%' : '—';
      var total = series.reduce(function (a, x) {
        return a + (x.plotAt ? Math.max(0, x.plotAt(tMs)) : 0);
      }, 0);
      if (!(total > 0) || v / total < 0.005) return '—';
      return Math.round(v / total * 100) + '%';
    }

    function build(tMs) {
      tip.innerHTML = '';
      /* The clock time alone made the reader do the subtraction. Hovering a
         curve is nearly always asking "how long until this peaks" or "how
         long ago did I take it", and the answer was sitting one arithmetic
         step away from a figure already on screen. */
      var rel = relativeTime(tMs, nowMs);
      tip.appendChild(h('div', { class: 'hover-time' }, [
        h('strong', { text: Charts.fmtDayClock(tMs) }),
        h('span', { class: 'pill hover-rel' + (rel.atNow ? ' ok' : ''), text: rel.text })
      ]));

      var rows = series.map(function (sr, i) {
        return { sr: sr, i: i, text: readout(sr, tMs), v: valueOf(sr, tMs) };
      }).filter(function (r) {
        // Only what is actually there, same rule the legend used.
        return r.text !== '' && r.text !== '\u2014';
      }).sort(function (a, b) {
        var av = isFinite(a.v) ? a.v : -Number.MAX_VALUE;
        var bv = isFinite(b.v) ? b.v : -Number.MAX_VALUE;
        return (bv - av) || (a.i - b.i);
      });

      if (!rows.length) {
        tip.appendChild(h('div', { class: 'muted small', text: 'nothing present at this moment' }));
        return;
      }
      var list = h('div', { class: 'hover-rows' });
      rows.forEach(function (r) {
        list.appendChild(h('div', { class: 'hover-row' }, [
          h('span', { class: 'legend-swatch',
            style: 'background:' + r.sr.color + (r.sr.dashed ? ';opacity:.55' : '') }),
          h('span', { class: 'hover-name', text: r.sr.name }),
          h('span', { class: 'hover-val', text: r.text })
        ]));
      });
      tip.appendChild(list);
    }

    /* Kept inside the viewport, and flipped to the other side of the pointer
       rather than allowed to run off the edge — a readout you have to scroll
       to is not a readout. */
    function place(x, y) {
      var pad = 14;
      var r = tip.getBoundingClientRect();
      var left = x + pad, top = y + pad;
      if (left + r.width > window.innerWidth - 8) left = x - r.width - pad;
      if (top + r.height > window.innerHeight - 8) top = y - r.height - pad;
      tip.style.left = Math.max(8, left) + 'px';
      tip.style.top = Math.max(8, top) + 'px';
    }

    function show(ev) {
      var r = svg.getBoundingClientRect();
      var px = ((ev.clientX - r.left) / r.width) * svg.__scale.viewW;
      var tMs = Math.max(t0, Math.min(t1, svg.__scale.toTime(px)));
      build(tMs);
      tip.classList.add('open');
      shown = true;
      place(ev.clientX, ev.clientY);
    }

    function hide() {
      if (timer) { clearTimeout(timer); timer = null; }
      tip.classList.remove('open');
      shown = false;
    }

    wrap.addEventListener('pointermove', function (ev) {
      // Touch drives the scrub cursor directly; a tooltip under a finger is
      // hidden by the finger.
      if (ev.pointerType === 'touch') return;
      lastX = ev.clientX; lastY = ev.clientY;
      if (shown) { show(ev); return; }
      if (timer) clearTimeout(timer);
      var e = { clientX: ev.clientX, clientY: ev.clientY };
      timer = setTimeout(function () { timer = null; show(e); }, HOVER_DWELL_MS);
    });
    wrap.addEventListener('pointerleave', hide);
    wrap.addEventListener('pointerdown', hide);

  }

  function renderTimeline(root) {
    var now = Date.now();
    var span = state.windowH * HOUR;
    var t0 = now - span * 0.6, t1 = now + span * 0.4;
    var curves = buildCurves(t0 - 48 * HOUR, t1);

    root.appendChild(h('div', { class: 'section-head sub' }, [
      h('h3', { text: 'Timeline' }),
      // The separate/combined control moved to the top of the tab — it governs
      // the cards and the dose detail too, not just this chart.
      h('div', { class: 'row-actions' }, [
        h('span', { class: 'mode-label', text: 'Y axis' }),
        timelineUnitPicker(), metabolitePicker(), windowPicker()
      ])
    ]));

    var visible = curves.filter(function (c) {
      /* A dose is worth drawing for as long as anything it produced is still
         there, not just for as long as the compound is. The metabolite lines
         are built from the doses that survive this filter, so cutting a dose
         off at its own offset took its products off the chart with it. */
      var lastH = c.phases.afterEnd;
      PK.metaboliteBreakdown(c).forEach(function (m) {
        var end = m.tmaxH + 5 * m.halfLifeH;
        if (end > lastH) lastH = end;
      });
      var end = (c.tStartH + lastH) * HOUR;
      return end >= t0 && c.entry.timeMs <= t1;
    });

    if (!visible.length) {
      root.appendChild(h('div', { class: 'empty' }, [h('p', { text: 'No doses in this window.' })]));
      return;
    }

    /* ---- focus ------------------------------------------------------------
       With metabolites on, a busy day is thirty-odd curves and the chart draws
       the eighteen largest of them in ten repeating colours. That is not a
       chart, it is a plaid. Focusing on one substance draws that substance and
       the things it turned into, which is three to five lines and legible —
       and it is the question people actually have ("where is the ketamine",
       not "where is everything").

       It filters the doses rather than the finished series, so the metabolite
       curves, the legend, the scrub cards and the hover readout all follow
       from it without any of them needing to know it exists. */
    var onBoard = [];
    var seenFocus = {};
    visible.forEach(function (c) {
      if (seenFocus[c.drug.id]) return;
      seenFocus[c.drug.id] = 1;
      onBoard.push(c.drug);
    });

    if (state.timelineFocus && !seenFocus[state.timelineFocus]) state.timelineFocus = null;

    if (onBoard.length > 1) {
      var focusRow = h('div', { class: 'focus-row' }, [
        h('span', { class: 'mode-label', text: 'Focus' }),
        h('button', {
          class: 'chip clickable' + (state.timelineFocus ? '' : ' chip-on'),
          title: 'Draw everything on board',
          onclick: function () { state.timelineFocus = null; render(); }
        }, ['Everything'])
      ]);

      onBoard.forEach(function (d) {
        focusRow.appendChild(h('button', {
          class: 'chip clickable' + (state.timelineFocus === d.id ? ' chip-on' : ''),
          title: 'Draw only ' + d.name + ' and what it turns into',
          onclick: function () {
            state.timelineFocus = state.timelineFocus === d.id ? null : d.id;
            render();
          }
        }, [d.name]));
      });

      root.appendChild(focusRow);
    }

    if (state.timelineFocus) {
      visible = visible.filter(function (c) { return c.drug.id === state.timelineFocus; });
    }

    /* ---- the doses, as curves rather than bands ---------------------------
       This was a Gantt chart of phase bands: one row per dose, coloured by
       come-up / peak / offset. Bands answer "which phase am I in" but they
       flatten every magnitude — a threshold dose and a heavy one drew the
       identical rectangle, and two doses stacking showed as two bars beside
       each other rather than as a higher curve.

       So it is the same line chart the metabolite popup uses: intensity on
       the y axis, one line per dose (or per substance when combined), with
       every dose marked on the axis. The scrub cursor and everything below it
       are unchanged — the chart type changed, not the navigation. */
    /* ---- one chart, parents and metabolites together --------------------
       These were two stacked charts on different scales, which is exactly why
       they could not be read against each other: the top one plotted
       subjective effect and the bottom one plotted each metabolite against its
       own peak, so every metabolite drew at the same height regardless of how
       much of it there was. On one shared amount axis a peak is where the peak
       actually is, and a metabolite that outweighs its parent looks like it. */
    var tData = timelineSeries(visible, t0, t1, 18);

    /* ---- interactive timeline: click or drag to inspect any moment ---- */
    if (state.cursorMs == null) state.cursorMs = now;
    state.cursorMs = Math.max(t0, Math.min(t1, state.cursorMs));

    var unit = state.timelineUnit;
    var yFmt = unit === 'mg'
      ? function (v) { return Potency.fmtMg(v); }
      : function (v) { return Math.round(v * 100) + '%'; };

    var chart = Charts.lineChart({
      series: tData.series, t0: t0, t1: t1, nowMs: now, cursorMs: state.cursorMs, height: 340,
      yFormat: yFmt,
      markers: visible.map(function (c) { return { tMs: c.entry.timeMs, color: Charts.token('--text-faint', '#888') }; })
    });
    var chartWrap = h('div', { class: 'chart-wrap scrubbable' }, [chart]);
    var detail = h('div', { class: 'scrub-detail' });

    var charts = [chart];

    // Map a pointer position to a time using the chart's own viewBox scale,
    // so it stays correct however the SVG is scaled by CSS.
    function timeFromEvent(ev, svg) {
      var r = svg.getBoundingClientRect();
      var px = ((ev.clientX - r.left) / r.width) * svg.__scale.viewW;
      return svg.__scale.toTime(px);
    }
    function moveCursor(tMs, rebuild) {
      state.cursorMs = Math.max(t0, Math.min(t1, tMs));
      charts.forEach(function (c) { c.__setCursor(state.cursorMs); });
      // All declared below; hoisted, and never called before assignment.
      slider.value = String(state.cursorMs);
      if (clockEl) paintClock();
      if (timeInput) timeInput.value = toLocalInput(state.cursorMs);
      if (rebuild !== false) paintDetail();
    }

    function makeScrubbable(wrap, svg) {
      var dragging = false;
      wrap.addEventListener('pointerdown', function (ev) {
        dragging = true;
        wrap.setPointerCapture(ev.pointerId);
        moveCursor(timeFromEvent(ev, svg));
      });
      wrap.addEventListener('pointermove', function (ev) {
        if (dragging) moveCursor(timeFromEvent(ev, svg));
      });
      wrap.addEventListener('pointerup', function (ev) {
        dragging = false;
        try { wrap.releasePointerCapture(ev.pointerId); } catch (e) { /* already released */ }
      });
    }
    makeScrubbable(chartWrap, chart);

    var slider = h('input', {
      type: 'range', class: 'scrub-slider',
      min: String(t0), max: String(t1), step: String(60000), value: String(state.cursorMs),
      oninput: function (e) { moveCursor(parseInt(e.target.value, 10)); }
    });

    /* ---- the clock, and a way to type a time into it ---------------------
       The cursor position used to be readable only as a heading below the
       chart and reachable only by dragging. Both are now above the chart they
       control: where you are, in figures big enough to read at a glance, and
       a field to type a moment into rather than hunting for it with a slider
       a pixel at a time.
       -------------------------------------------------------------------- */

    var clockEl = h('div', { class: 'scrub-clock' });

    function paintClock() {
      var rel = relativeTime(state.cursorMs, now);
      clockEl.innerHTML = '';
      clockEl.appendChild(h('span', { class: 'scrub-clock-time',
        text: Charts.fmtDayClock(state.cursorMs) }));
      clockEl.appendChild(h('span', { class: 'pill ' + (rel.atNow ? 'ok' : ''), text: rel.text }));
    }

    /* `datetime-local` wants a naive LOCAL string and toISOString gives UTC.
       Feeding it UTC silently shifts the field by the timezone offset, which
       on a scrub control is the difference between an hour ago and an hour
       from now. */
    function toLocalInput(ms) {
      var d = new Date(ms - new Date(ms).getTimezoneOffset() * 60000);
      return d.toISOString().slice(0, 16);
    }

    var timeInput = h('input', {
      type: 'datetime-local', class: 'scrub-time',
      min: toLocalInput(t0), max: toLocalInput(t1),
      value: toLocalInput(state.cursorMs),
      title: 'Jump to a moment. Anything outside the visible window is clamped to its edge — widen the window to reach further.',
      onchange: function (e) {
        var ms = new Date(e.target.value).getTime();
        if (isFinite(ms)) moveCursor(ms);
        else timeInput.value = toLocalInput(state.cursorMs);
      }
    });

    root.appendChild(h('div', { class: 'scrub-bar scrub-bar-top' }, [
      clockEl,
      h('button', { class: 'btn small', text: '\u27f5 15m',
        onclick: function () { moveCursor(state.cursorMs - 15 * 60000); } }),
      slider,
      h('button', { class: 'btn small', text: '15m \u27f6',
        onclick: function () { moveCursor(state.cursorMs + 15 * 60000); } }),
      h('button', { class: 'btn small', text: 'Now', onclick: function () { moveCursor(now); } }),
      h('label', { class: 'scrub-jump' }, [
        h('span', { class: 'muted small', text: 'Jump to' }), timeInput
      ])
    ]));
    paintClock();

    root.appendChild(chartWrap);
    attachHoverReadout(chartWrap, chart, tData.series, unit, t0, t1, now);
    /* No caption and no legend hint under the chart.

       There were two paragraphs here — one explaining what the figure beside
       each legend name meant, one explaining what the axis was plotting and
       how the metabolite curves were built. Together they ran longer than
       the chart they sat under, and they said the same things three ways
       depending on the Y axis. The caveats they carried have somewhere
       better to be: the axis buttons carry them as tooltips, the "% of own
       peak" and "derived" flags in the legend carry the two that are easy to
       misread, and the cards below carry the numbers. */

    // The one thing here that was not explanation: when there are more curves
    // than the chart will draw, that has to be said, because otherwise a
    // missing compound looks like an absent one.
    if (tData.total > tData.series.length) {
      /* Saying "18 of 34" and stopping there leaves the reader with an
         unreadable chart and no idea what to do about it. Both things that
         thin it out are offered right here. */
      root.appendChild(h('p', { class: 'muted small overflow-note' }, [
        'Showing the ' + tData.series.length + ' largest of ' + tData.total + ' curves. ',
        onBoard.length > 1 && !state.timelineFocus
          ? h('button', {
              class: 'link-btn', text: 'Focus on one substance',
              onclick: function () { state.timelineFocus = onBoard[0].id; render(); }
            })
          : null,
        onBoard.length > 1 && !state.timelineFocus && state.showMetabolites ? ' or ' : null,
        state.showMetabolites
          ? h('button', {
              class: 'link-btn', text: 'hide metabolites',
              onclick: function () { state.showMetabolites = false; render(); }
            })
          : null,
        ' to thin it out.'
      ]));
    }

    if (!state.showMetabolites) {
      root.appendChild(h('div', { class: 'empty small' }, [
        h('p', { text: 'Active metabolites are hidden — the toggle above turns them back on.' })
      ]));
    }

    root.appendChild(detail);

    /* ---- what the timeline looks like at the cursor ---- */
    function paintDetail() {
      var t = state.cursorMs, tH = t / HOUR;
      detail.innerHTML = '';

      var rel = relativeTime(t, now);

      var atCursor = visible.map(function (c) {
        return {
          curve: c,
          effect: c.effectAt(tH),
          conc: c.concAt(tH),
          remaining: c.fractionRemaining(tH),
          amountMg: c.amountMgAt(tH),
          balance: doseBalance(c, tH),
          phase: phaseName(c, tH),
          sinceH: tH - c.tStartH
        };
      }).filter(function (a) { return a.sinceH > 0; })
        .sort(function (a, b) { return b.effect - a.effect; });

      /* ---- what still has a card of its own --------------------------------
         Gone means gone. This used to keep a substance on the grid on the
         strength of its `effect` envelope as well, so a dose whose envelope
         outran its elimination stayed after there was nothing left of it —
         and since the card no longer carries an effect meter, nothing on it
         explained why it was still there. Elimination is the whole subject of
         the card now, so it is what decides whether there is a card.

         `atCursor` is deliberately NOT narrowed to these. A parent can finish
         long before what it turned into: two hours after swallowing heroin
         there is no heroin, and about five milligrams of morphine. Generating
         the metabolite cards from the surviving parents took morphine off the
         screen along with the heroin — which is the exact case this grid was
         built for. So the parents that are gone still get walked for what
         they left behind; they just do not get a card. */
      var live = atCursor.filter(function (a) {
        return eliminatedFraction(a.curve, tH) < DONE;
      });

      /* ---- one grid, parents and metabolites together ---------------------
         Metabolites used to get a section of their own below the substances,
         which put a wall between a drug and the thing it turns into — and for
         the compounds where the metabolite IS the drug (heroin into morphine,
         gidazepam into desalkylgidazepam, codeine into morphine) it filed the
         active compound under a footnote to the inactive one.

         They are cards in the same grid now, carrying the same readouts, and
         the grid is ordered by WHEN each compound first turned up in the
         circulation. So a chain reads top to bottom in the order it actually
         happened: the dose, then what it became, then what that became. */
      var cards = [];

      groupReadings(live).forEach(function (g) {
        cards.push({
          at: g.curves.reduce(function (a, c) {
            return Math.min(a, firstSystemicH(c));
          }, Infinity),
          // What the card is actually reporting: the amount circulating at
          // the cursor's moment. Summed across doses when they are combined,
          // so a grouped card ranks on the whole group rather than on one of
          // its doses.
          mg: g.remainingMg,
          el: substanceCard(g, tH, state.showMetabolites ? mergedBreakdown(g.curves) : [])
        });
      });

      if (state.showMetabolites) {
        groupReadings(atCursor).forEach(function (g) {
          var mets = mergedBreakdown(g.curves);
          mets.forEach(function (m) {
            if (!m.active || !metabolitePresent(m, tH)) return;
            cards.push({ at: m.firstPresentAbsH, mg: m.amountAt(tH), el: metaboliteCard(g, m, mets, tH) });
          });
        });
      }

      /* Ordered by how much is present, largest first, with the chronological
         order as the tiebreaker so equal amounts still read in the sequence
         they happened.

         The honest caveat, since nothing on screen says it: milligrams are
         not comparable across compounds. Eight grams of ethanol outranks a
         hundred micrograms of a lysergamide by five orders of magnitude and
         means far less. This ranks by quantity because quantity is what the
         cards report; it is not a ranking by importance, and the tier and
         concentration band on each card remain the things that say how much
         a given amount matters. */
      cards.sort(function (a, b) { return b.mg - a.mg || a.at - b.at; });

      detail.appendChild(h('div', { class: 'scrub-head' }, [
        h('h3', { text: Charts.fmtDayClock(t) }),
        h('span', { class: 'pill ' + (rel.atNow ? 'ok' : ''), text: rel.text }),
        // Counts the grid, not the doses — a metabolite outliving its parent
        // is a compound present, and the number has to match what is drawn.
        h('span', { class: 'muted small', text: cards.length + ' present' })
      ]));

      if (!cards.length) {
        detail.appendChild(h('div', { class: 'empty small' }, [
          h('p', { text: 'Nothing estimated to be active at this moment.' })
        ]));
        return;
      }

      var grid = h('div', { class: 'scrub-grid' });
      cards.forEach(function (c) { grid.appendChild(c.el); });
      detail.appendChild(grid);

      // Interactions between whatever is on board at that instant. Cleared
      // doses are left out: an interaction needs something to interact.
      var drugsAt = [], seenAt = {};
      live.forEach(function (a) {
        if (!seenAt[a.curve.drug.id]) { seenAt[a.curve.drug.id] = 1; drugsAt.push(a.curve.drug); }
      });
      var f = Interactions.amongst(drugsAt);
      if (f.length) {
        detail.appendChild(h('h4', { text: 'Interactions at this moment' }));
        detail.appendChild(findingsList(f.slice(0, 6)));
      }
    }
    paintDetail();

    // per-dose detail
    // The per-dose phase timings that used to be listed here now live inside
    // each Currently-on-board card, so the same substances are not enumerated
    // twice on one tab.
  }


  /* ======================================================================
     NOW: STEADY STATE — what a repeated dose settles at
     ----------------------------------------------------------------------
     Everything else in this app answers "what is one dose doing". This
     answers the other question, and it is the one that catches people out.

     Take diazepam once and it is a 43-hour compound. Take it every night and
     the nordazepam is still climbing on day ten, because a compound whose
     dosing interval is shorter than its half-life accumulates until output
     matches input. Methadone kills people during induction for exactly this
     reason: the dose that was fine on day one is the same dose on day four,
     and the concentration is not.

     The model already had everything needed — this synthesises the doses
     rather than making anyone log fourteen future entries by hand, and reads
     the answer off the same curves the rest of the app uses.
     ====================================================================== */

  var scheduleState = {
    drugId: null, route: null, doseMg: null, everyH: 24, days: null
  };

  /**
   * Accumulation ratio for a one-compartment model.
   *
   *     R = 1 / (1 − e^(−ke·τ))
   *
   * The closed form, quoted alongside the simulated figure because they
   * should agree and a reader is entitled to check. It is exact only for an
   * instantly-absorbed dose, so the simulation is what the chart draws.
   */
  function accumulationRatio(halfLifeH, everyH) {
    var ke = Math.LN2 / halfLifeH;
    var d = 1 - Math.exp(-ke * everyH);
    return d > 0 ? 1 / d : Infinity;
  }

  function renderSchedule(root) {
    var drug = scheduleState.drugId ? DB.get(scheduleState.drugId) : null;

    root.appendChild(h('div', { class: 'section-head sub' }, [
      h('h3', { text: 'Steady state' }),
      h('span', { class: 'muted small', text: 'What a repeated dose settles at' })
    ]));

    /* ---- the form ---- */
    var drugInput = h('input', {
      type: 'text', class: 'sched-drug', placeholder: 'Search substances…',
      autocomplete: 'off', value: drug ? drug.name : ''
    });
    var results = h('div', { class: 'autocomplete' });
    drugInput.addEventListener('input', function () {
      var q = drugInput.value.trim();
      results.innerHTML = '';
      if (!q) { results.classList.remove('open'); return; }
      var matches = DB.search(q, 12).filter(function (m) {
        return !m.formedInVivo && Object.keys(m.routes).length;
      }).slice(0, 8);
      if (!matches.length) { results.classList.remove('open'); return; }
      results.classList.add('open');
      matches.forEach(function (d) {
        results.appendChild(h('button', {
          type: 'button', class: 'ac-item',
          onclick: function () {
            scheduleState.drugId = d.id;
            scheduleState.route = null;
            scheduleState.doseMg = null;
            render();
          }
        }, [d.name, h('span', { class: 'muted small', text: ' ' + d.class })]));
      });
    });

    var fields = [h('div', { class: 'field' }, [
      h('label', { text: 'Substance' }),
      h('div', { class: 'ac-wrap' }, [drugInput, results])
    ])];

    if (drug) {
      var routeKeys = Object.keys(drug.routes);
      if (!scheduleState.route || routeKeys.indexOf(scheduleState.route) < 0) {
        scheduleState.route = routeKeys[0];
      }
      var routeSel = h('select', { onchange: function (e) {
        scheduleState.route = e.target.value; scheduleState.doseMg = null; render();
      } }, routeKeys.map(function (k) {
        return h('option', { value: k, text: routeLabel(k),
          selected: scheduleState.route === k ? 'selected' : null });
      }));

      if (scheduleState.doseMg == null) {
        scheduleState.doseMg = PK.commonDoseMg(drug, scheduleState.route) || 10;
      }
      var doseIn = h('input', {
        type: 'number', min: '0', step: 'any', value: scheduleState.doseMg,
        onchange: function (e) {
          scheduleState.doseMg = Math.max(0, parseFloat(e.target.value) || 0); render();
        }
      });
      var everyIn = h('input', {
        type: 'number', min: '0.25', step: '0.25', value: scheduleState.everyH,
        onchange: function (e) {
          scheduleState.everyH = Math.max(0.25, parseFloat(e.target.value) || 24); render();
        }
      });

      fields.push(
        h('div', { class: 'field' }, [h('label', { text: 'Route' }), routeSel]),
        h('div', { class: 'field' }, [h('label', { text: 'Dose (mg)' }), doseIn]),
        h('div', { class: 'field' }, [h('label', { text: 'Every (hours)' }), everyIn])
      );
    }
    root.appendChild(h('div', { class: 'log-form' }, fields));

    if (!drug) {
      var pick = function (id) {
        return function () {
          scheduleState.drugId = id;
          scheduleState.route = null;
          scheduleState.doseMg = null;
          render();
        };
      };

      var chipRow = function (label, ids, note) {
        var found = ids.map(function (id) { return DB.get(id); }).filter(Boolean);
        if (!found.length) return null;
        return h('div', { class: 'start-row' }, [
          h('span', { class: 'start-label', text: label }),
          h('div', { class: 'chips start-chips' }, found.map(function (d) {
            return h('button', { class: 'chip clickable', title: note, onclick: pick(d.id) }, [d.name]);
          }))
        ]);
      };

      // Anything logged in the last month, most recent first — the substance
      // someone is actually taking is the one they want this page for.
      var seen = {}, mine = [];
      Store.load().slice().reverse().forEach(function (l) {
        if (seen[l.drugId]) return;
        var d = DB.get(l.drugId);
        if (!d || d.formedInVivo || !Object.keys(d.routes).length) return;
        seen[l.drugId] = 1;
        mine.push(l.drugId);
      });

      root.appendChild(h('div', { class: 'empty empty-lead' }, [
        h('h3', { class: 'empty-title', text: 'What does a repeated dose settle at?' }),
        h('p', { class: 'muted', text:
          'Anything taken again before it has cleared accumulates. Where it settles depends on the ' +
          'half-life and the interval, and the compounds where that matters most are the ones with ' +
          'long-lived active metabolites.' }),
        h('div', { class: 'start-rows' }, [
          mine.length ? chipRow('From your log', mine.slice(0, 6),
            'A substance you have logged') : null,
          chipRow('Classic accumulators',
            ['diazepam', 'methadone', 'gidazepam', 'clonazepam', 'fluoxetine'],
            'A long half-life, or a metabolite with one')
        ])
      ]));
      return;
    }

    /* ---- simulate ----
       Long enough to reach steady state on the SLOWEST thing in the picture,
       which is frequently a metabolite rather than the parent: diazepam gets
       there in about a week and its nordazepam takes a month. */
    var route = drug.routes[scheduleState.route];
    var mods = Profile.halfLifeModifier(drug);
    var effH = PK.effectiveHalfLife(drug, mods ? [mods] : []).hours;

    var probe = PK.buildDoseCurve(drug, scheduleState.route, scheduleState.doseMg, 0, {
      halfLifeH: effH, effectScale: Profile.massScale()
    });
    var slowestH = PK.metaboliteBreakdown(probe).reduce(function (a, m) {
      return Math.max(a, m.halfLifeH);
    }, effH);
    var days = Math.max(3, Math.min(60, Math.ceil((7 * slowestH) / 24) + 1));
    scheduleState.days = days;

    var nDoses = Math.max(1, Math.min(400, Math.ceil((days * 24) / scheduleState.everyH)));
    // Anchored to now, so the axis reads as real dates and the answer is
    // "where am I on Tuesday" rather than "where am I at hour 96".
    var startMs = Date.now(), startH = startMs / HOUR;
    var curves = [];
    for (var i = 0; i < nDoses; i++) {
      curves.push(PK.buildDoseCurve(drug, scheduleState.route, scheduleState.doseMg,
        startH + i * scheduleState.everyH,
        { halfLifeH: effH, effectScale: Profile.massScale() }));
    }

    var horizonH = days * 24;
    var parentAt = function (tH) {
      return curves.reduce(function (a, c) { return a + c.amountMgAt(tH); }, 0);
    };

    /* ---- the figures ---- */
    // Peak and trough over the LAST full interval, which is steady state if
    // the horizon reached it and the closest thing to it if not.
    var lastFrom = startH + horizonH - scheduleState.everyH, ssPeak = 0, ssTrough = Infinity;
    for (var q = 0; q <= 200; q++) {
      var tq = lastFrom + (q / 200) * scheduleState.everyH;
      var vq = parentAt(tq);
      if (vq > ssPeak) ssPeak = vq;
      if (vq < ssTrough) ssTrough = vq;
    }
    var firstPeak = 0;
    for (var f = 0; f <= 200; f++) {
      firstPeak = Math.max(firstPeak, parentAt(startH + (f / 200) * scheduleState.everyH));
    }
    var ratio = firstPeak > 0 ? ssPeak / firstPeak : 1;

    // When the running peak first reaches 90% of the steady-state one.
    var t90 = null;
    for (var d2 = 0; d2 < nDoses; d2++) {
      var pk = 0;
      for (var r2 = 0; r2 <= 40; r2++) {
        pk = Math.max(pk, parentAt(startH + d2 * scheduleState.everyH +
          (r2 / 40) * scheduleState.everyH));
      }
      if (pk >= ssPeak * 0.9) { t90 = (d2 + 1) * scheduleState.everyH; break; }
    }

    root.appendChild(h('div', { class: 'stat-row' }, [
      statCard('Accumulation', '×' + ratio.toFixed(1),
        'Steady-state peak against the peak after the first dose. The closed form for a ' +
        'one-compartment model is 1/(1−e^(−ke·τ)), which for this half-life and interval gives ×' +
        accumulationRatio(effH, scheduleState.everyH).toFixed(1) + '.'),
      statCard('Steady peak', Potency.fmtMg(ssPeak), 'Highest amount circulating within a dosing interval once it has levelled off.'),
      statCard('Steady trough', Potency.fmtMg(ssTrough), 'Lowest — what is still there when the next dose goes in.'),
      statCard('90% of steady state', t90 != null ? Charts.fmtDur(t90) : 'beyond ' + days + ' d',
        'How long the schedule has to run before it is within a tenth of where it settles. ' +
        'It depends on the half-life and not at all on the dose.')
    ]));

    /* ---- the chart ---- */
    var t0 = startMs, t1 = startMs + horizonH * HOUR;
    var series = [{
      name: drug.name, color: Charts.colorFor(0), width: 2.4, fill: true,
      points: sampleFn(t0, t1, function (t) { return parentAt(t / HOUR); }, 320)
    }];

    if (state.showMetabolites) {
      mergedBreakdown(curves).filter(function (m) { return m.active; })
        .slice(0, 5)
        .forEach(function (m, i) {
          series.push({
            name: m.name + ' · from ' + m.parentNames.join(' + '),
            color: Charts.colorFor(i + 1), width: 1.8,
            points: sampleFn(t0, t1, function (t) { return m.amountAt(t / HOUR); }, 320)
          });
        });
    }

    root.appendChild(h('div', { class: 'chart-wrap' }, [
      Charts.lineChart({
        series: series, t0: t0, t1: t1, nowMs: startMs, height: 300,
        yFormat: function (v) { return Potency.fmtMg(v); },
        // A tick per dose, capped so a four-times-a-day schedule over a month
        // does not draw six hundred of them.
        markers: curves.slice(0, 60).map(function (cc) { return { tMs: cc.tStartH * HOUR, color: Charts.token('--text-faint', '#888') }; })
      })
    ]));
    root.appendChild(seriesLegend(series, null, 'mg'));

    root.appendChild(h('p', { class: 'muted small', text:
      Potency.fmtMg(scheduleState.doseMg) + ' ' + routeLabel(scheduleState.route) + ' every ' +
      Charts.fmtDur(scheduleState.everyH) + ' for ' + days + ' days, in milligram-equivalents. ' +
      'The horizon is set from the longest-lived compound in the picture rather than from the ' +
      'parent, because the thing still climbing is usually a metabolite: diazepam levels off in ' +
      'about a week and its nordazepam takes a month.' }));

    var slowest = mergedBreakdown(curves).filter(function (m) { return m.active; })
      .sort(function (a, b) { return b.halfLifeH - a.halfLifeH; })[0];
    if (slowest && slowest.halfLifeH > effH * 1.5) {
      root.appendChild(h('div', { class: 'note note-warn' }, [
        h('strong', { text: 'The metabolite is the one that accumulates. ' }),
        slowest.name + ' has a half-life of ' + Charts.fmtDur(slowest.halfLifeH) + ' against ' +
        drug.name + '’s ' + Charts.fmtDur(effH) + ', so it is still climbing long after the ' +
        'parent has levelled off. On this schedule it reaches ' +
        Potency.fmtMg(slowest.amountAt(startH + horizonH)) + ' by day ' + days + '. Dose adjustments made ' +
        'in the first few days are being made before the drug has finished arriving.'
      ]));
    }

    root.appendChild(h('div', { class: 'note note-small' }, [
      h('strong', { text: 'What this is not. ' }),
      'A hypothetical, not your log — nothing here is recorded. It assumes every dose is taken ' +
      'exactly on time, that kinetics stay linear at every dose (they do not for alcohol, GHB or ' +
      'MDMA, which saturate their own clearance), and that nothing changes over the period. ' +
      'Tolerance is not modelled here at all, so the effect of a steady dose is overstated the ' +
      'longer the schedule runs.'
    ]));
  }

  /**
   * Separate vs combined rows.
   *
   * Separate is the honest default — each dose is its own event with its own
   * onset and offset. Combined answers the question separate cannot: when you
   * redose, what does the stack actually look like on one line.
   */
  function timelineModePicker() {
    var wrap = h('div', { class: 'seg' });
    [['separate', 'Separate', 'One row per dose.'],
     ['combined', 'Combined', 'One row per substance, with repeat doses overlaid — shows how redosing stacks.']
    ].forEach(function (m) {
      wrap.appendChild(h('button', {
        class: 'seg-btn' + (state.timelineMode === m[0] ? ' active' : ''),
        title: m[2],
        onclick: function () { state.timelineMode = m[0]; render(); }
      }, [m[1]]));
    });
    return wrap;
  }

  /**
   * Active-metabolite visibility.
   *
   * On by default, because for several compounds the metabolites are the whole
   * story. Off is for when you only want the parent drugs — a busy log with
   * caffeine in it produces three metabolite rows per dose, which drowns the
   * doses themselves.
   */
  function metabolitePicker() {
    var on = state.showMetabolites;
    return h('button', {
      class: 'toggle-btn' + (on ? ' on' : ''),
      title: on
        ? 'Active metabolites are shown on the timeline and in the readouts. Click to hide them.'
        : 'Active metabolites are hidden. Click to show them.',
      onclick: function () { state.showMetabolites = !on; render(); }
    }, [
      h('span', { class: 'toggle-dot' }),
      'Active metabolites'
    ]);
  }

  function windowPicker() {
    var sel = h('select', { class: 'window-picker', onchange: function (e) {
      state.windowH = parseInt(e.target.value, 10); render();
    } });
    [[12, '12 hours'], [24, '24 hours'], [48, '2 days'], [72, '3 days'], [168, '1 week'], [720, '30 days']]
      .forEach(function (o) {
        sel.appendChild(h('option', { value: o[0], text: o[1], selected: state.windowH === o[0] ? 'selected' : null }));
      });
    return sel;
  }

  /* ---- there is no Curves tab ------------------------------------------
     It plotted plasma concentration and the effect envelope on their own
     page, and lost its place in the nav when the Now tab grew a Timeline
     that answers the same question with a cursor attached. Its one
     irreplaceable view was the Bateman plasma curve; the Timeline's axes are
     amount-based, which is a different quantity during absorption. If that
     view is wanted back, it wants a tab rather than dead code.
     --------------------------------------------------------------------- */

  /* ======================================================================
     TAB: INTERACTIONS
     ====================================================================== */

  /**
   * Interaction checker.
   *
   * The old grid-versus-grid matrix scaled badly — six substances meant a
   * 36-cell table read diagonally, most of it empty or self-paired. A list
   * carries the same information in reading order: one row per pair, coloured
   * by severity, sorted worst first, with the detail one click away.
   */
  function renderInteractions(root) {
    root.appendChild(h('h2', {}, ['Interaction checker', helpLink('Interactions')]));

    var picked = [];
    var chips = h('div', { class: 'chips' });
    var out = h('div', { class: 'interaction-output' });

    var input = h('input', { type: 'text', placeholder: 'Add a substance to the combination…', autocomplete: 'off' });
    var results = h('div', { class: 'autocomplete' });

    function refresh() {
      chips.innerHTML = '';
      picked.forEach(function (d, i) {
        chips.appendChild(h('span', { class: 'chip' }, [
          d.name,
          h('button', { class: 'chip-x', text: '×', onclick: function () { picked.splice(i, 1); refresh(); } })
        ]));
      });
      out.innerHTML = '';
      if (picked.length < 2) {
        out.appendChild(h('div', { class: 'empty small' }, [
          h('p', { text: 'Add at least two substances to check a combination.' })
        ]));
        return;
      }
      out.appendChild(pairList(picked));
    }

    input.addEventListener('input', function () {
      var q = input.value.trim();
      results.innerHTML = '';
      if (!q) { results.classList.remove('open'); return; }
      var matches = DB.search(q, 8);
      results.classList.toggle('open', matches.length > 0);
      matches.forEach(function (d) {
        results.appendChild(h('button', {
          type: 'button', class: 'ac-item',
          onclick: function () {
            if (!picked.some(function (p) { return p.id === d.id; })) picked.push(d);
            input.value = ''; results.classList.remove('open'); refresh();
          }
        }, [h('span', { class: 'ac-name', text: d.name }), h('span', { class: 'ac-class', text: d.class })]));
      });
    });

    root.appendChild(h('div', { class: 'ac-wrap wide' }, [input, results]));
    root.appendChild(chips);

    var now = Date.now();
    buildCurves(now - 96 * HOUR, now).forEach(function (c) {
      if (c.fractionRemaining(now / HOUR) > 0.02 && !picked.some(function (p) { return p.id === c.drug.id; })) {
        picked.push(c.drug);
      }
    });

    root.appendChild(out);
    refresh();
  }

  /** Every pair in the combination, coloured by severity, worst first. */
  function pairList(drugs) {
    var wrap = h('div', {});
    var rows = [];
    for (var i = 0; i < drugs.length; i++) {
      for (var j = i + 1; j < drugs.length; j++) {
        var a = drugs[i], b = drugs[j];
        var findings = Interactions.between(a, b);
        var level = findings.length ? findings[0].level : 'neutral';
        rows.push({ a: a, b: b, level: level, findings: findings });
      }
    }
    rows.sort(function (x, y) {
      return Interactions.LEVELS[y.level].rank - Interactions.LEVELS[x.level].rank;
    });

    var worst = rows.length ? rows[0].level : 'neutral';
    var counts = {};
    rows.forEach(function (r) { counts[r.level] = (counts[r.level] || 0) + 1; });

    /* Only for the two levels that describe harm. "Caution" and below are
       ordinary information and do not need a banner over the list — a page
       that shouts about everything is a page that is not read. */
    if (worst === 'dangerous' || worst === 'unsafe') {
      var lead = rows[0];
      var leadFinding = lead.findings[0];
      var alsoWorst = rows.filter(function (r) { return r.level === worst; }).length;

      wrap.appendChild(h('div', { class: 'pair-alert level-' + worst }, [
        h('div', { class: 'pair-alert-head' }, [
          levelPill(worst),
          h('strong', { class: 'pair-alert-names',
            text: lead.a.name + ' + ' + lead.b.name }),
          alsoWorst > 1 ? h('span', { class: 'muted small',
            text: 'and ' + (alsoWorst - 1) + ' more at this level' }) : null
        ]),
        leadFinding ? h('p', { class: 'pair-alert-mech', text: leadFinding.mechanism }) : null,
        leadFinding && leadFinding.detail
          ? h('p', { class: 'pair-alert-detail', text: leadFinding.detail }) : null,
        h('button', {
          class: 'btn small', text: 'Full detail for this pair',
          onclick: function () { showPair(lead); }
        })
      ]));
    }

    wrap.appendChild(h('div', { class: 'pair-summary level-' + worst }, [
      h('strong', { text: rows.length + ' pair' + (rows.length === 1 ? '' : 's') + ' checked' }),
      h('span', { class: 'muted small', text: Object.keys(counts).sort(function (a, b) {
        return Interactions.LEVELS[b].rank - Interactions.LEVELS[a].rank;
      }).map(function (k) {
        return counts[k] + ' ' + Interactions.LEVELS[k].label.toLowerCase();
      }).join(' · ') })
    ]));

    var list = h('div', { class: 'pair-list' });
    rows.forEach(function (r) {
      var L = Interactions.LEVELS[r.level];
      var top = r.findings[0];
      list.appendChild(h('button', {
        class: 'pair-row level-' + r.level,
        title: 'Open the detail for ' + r.a.name + ' + ' + r.b.name,
        onclick: function () { showPair(r); }
      }, [
        h('span', { class: 'pair-swatch' }),
        h('span', { class: 'pair-names' }, [
          h('strong', { text: r.a.name }), ' + ', h('strong', { text: r.b.name })
        ]),
        h('span', { class: 'pair-level', text: L.label }),
        h('span', { class: 'pair-mech muted small', text: top ? (top.title || '') : 'Nothing recorded' })
      ]));
    });
    wrap.appendChild(list);

    wrap.appendChild(h('div', { class: 'note note-warn' }, [
      h('strong', { text: 'A grey row is not a safety endorsement. ' }),
      'It means this database has nothing recorded for that pair. Most drug combinations ' +
      'have never been formally studied, and novel compounds almost never have.'
    ]));
    return wrap;
  }

  /** Full detail for one pair, as a popup. */
  function showPair(r) {
    var L = Interactions.LEVELS[r.level];
    var body = h('div', { class: 'pair-popup' }, [
      h('h2', {}, [r.a.name, ' + ', r.b.name]),
      h('div', { class: 'pair-popup-level level-' + r.level }, [
        h('strong', { text: L.label }), h('span', { text: ' — ' + L.desc })
      ])
    ]);

    if (!r.findings.length) {
      body.appendChild(h('p', { class: 'muted', text:
        'No interaction between these two is recorded in this database. That is not evidence ' +
        'of safety — it means nobody has entered one, and for most pairs of compounds nobody ' +
        'has studied one either.' }));
    } else {
      body.appendChild(findingsList(r.findings));
    }

    body.appendChild(h('div', { class: 'row-actions' }, [
      h('button', { class: 'btn small', text: 'Open ' + r.a.name,
        onclick: function () { closeModal(); openDrug(r.a.id); } }),
      h('button', { class: 'btn small', text: 'Open ' + r.b.name,
        onclick: function () { closeModal(); openDrug(r.b.id); } })
    ]));
    openModal(body);
  }

  /* ======================================================================
     TAB: DRUGS — browser + detail
     ====================================================================== */

  /* ---------- Substances: one page per class -------------------------------
     Everything used to sit on a single scroll with a collapsible heading per
     class, which meant 431 compounds in one list. Now the classes are pages.

     The order is deliberate rather than alphabetical: the classes people
     actually look up first, then metabolites, then everything else. "Other"
     collects the long tail — antidepressants, deliriants, excipients — so no
     compound is unreachable.

     The search box stays above the pages and searches the WHOLE database, not
     the current page. A search for "diazepam" from the opioid page should find
     it; scoping the search to the visible tab would be a trap.
     ------------------------------------------------------------------------ */

  var DRUG_PAGES = [
    { key: 'opioid',      label: 'Opioids',      classes: ['Opioid', 'Opioid antagonist'] },
    // Benzodiazepines are a page of their own rather than 66 entries buried in
    // "Other" behind the antidepressants. They are the class with the most
    // designer analogues in circulation and the one people most often arrive
    // here trying to identify a pressed tablet from.
    { key: 'benzo',       label: 'Benzodiazepines', match: isBenzodiazepine },
    { key: 'cannabinoid', label: 'Cannabinoids', classes: ['Cannabinoid'] },
    { key: 'stimulant',   label: 'Stimulants',   classes: ['Stimulant'] },
    { key: 'psychedelic', label: 'Psychedelics', classes: ['Psychedelic', 'Entactogen', 'Dissociative'] },
    { key: 'metabolite',  label: 'Metabolites',  classes: ['Metabolite'] },
    { key: 'other',       label: 'Other',        classes: null }   // null = everything else
  ];

  /**
   * Benzodiazepines, thienodiazepines and their antagonist.
   *
   * Matched on the tag rather than on `class`, because they are spread across
   * Depressant, Metabolite and a couple of one-off classes, and because the
   * family string alone spans "Benzodiazepine (triazolo)", "Thienodiazepine",
   * "Designer benzodiazepine (nitro)" and a dozen other spellings.
   */
  function isBenzodiazepine(d) {
    return (d.tags || []).indexOf('benzodiazepine') >= 0 ||
           /benzodiazepine|thienodiazepine/i.test(d.family || '');
  }

  function pageForDrug(d) {
    for (var i = 0; i < DRUG_PAGES.length; i++) {
      var p = DRUG_PAGES[i];
      if (p.match && p.match(d)) return p.key;
      if (p.classes && p.classes.indexOf(d.class) >= 0) return p.key;
    }
    return 'other';
  }

  function renderDrugs(root) {
    if (state.selectedDrug) { renderDrugDetail(root, state.selectedDrug); return; }

    var counts = {};
    DB.all().forEach(function (d) {
      var k = pageForDrug(d);
      counts[k] = (counts[k] || 0) + 1;
    });

    root.appendChild(h('div', { class: 'section-head' }, [
      h('h2', {}, ['Substance database', helpLink('Substances')]),
      h('span', { class: 'muted', text: DB.all().length + ' compounds' })
    ]));

    var pinned = UI.pins().map(function (id) { return DB.get(id); }).filter(Boolean);
    if (pinned.length) {
      root.appendChild(h('div', { class: 'pin-strip' }, [
        h('span', { class: 'pin-strip-label', text: 'Pinned' })
      ].concat(pinned.map(function (d) {
        return h('button', {
          class: 'pin-chip', onclick: function () { openDrug(d.id); }
        }, [h('span', { class: 'pin-star', text: '★' }), d.name]);
      }))));
    }

    var search = h('input', {
      type: 'search', class: 'wide-input',
      value: state.drugQuery,
      placeholder: 'Search the whole database by name, alias or class…  (or press / anywhere)'
    });
    root.appendChild(search);

    // Page tabs, hidden while searching — a search spans every class, so
    // showing a page selector next to cross-class results would be misleading.
    var pageBar = h('div', { class: 'subtabs' });
    DRUG_PAGES.forEach(function (p) {
      pageBar.appendChild(h('button', {
        class: 'subtab' + (state.drugPage === p.key ? ' active' : ''),
        onclick: function () { state.drugPage = p.key; render(); }
      }, [p.label, h('span', { class: 'subtab-count', text: String(counts[p.key] || 0) })]));
    });
    root.appendChild(pageBar);

    /* ---- how the list is ordered and narrowed ---------------------------
       Alphabetical is a filing order, not a reading order. Sorting by
       half-life answers "what here is short-acting", and sorting by
       confidence puts the compounds with real human data first — which is
       the honest way to browse a database where two thirds of the figures
       are extrapolated from analogues.

       The measured-only filter is the same idea as a switch: this app labels
       every value with its provenance, so it should be able to show you only
       the ones worth trusting.
       -------------------------------------------------------------------- */
    var SORTS = [
      ['name', 'A–Z'],
      ['half-life', 'Half-life'],
      ['confidence', 'Data quality']
    ];

    var controls = h('div', { class: 'browse-controls' });

    var sortSeg = h('div', { class: 'seg' });
    SORTS.forEach(function (o) {
      sortSeg.appendChild(h('button', {
        class: 'seg-btn' + (state.drugSort === o[0] ? ' active' : ''),
        text: o[1],
        onclick: function () {
          state.drugSort = o[0];
          Store.setPref('drugSort', o[0]);
          render();
        }
      }));
    });
    controls.appendChild(h('span', { class: 'mode-label', text: 'Sort' }));
    controls.appendChild(sortSeg);

    controls.appendChild(h('button', {
      class: 'toggle-btn' + (state.drugMeasuredOnly ? ' on' : ''),
      title: 'Show only compounds whose half-life was measured in humans, ' +
             'rather than estimated or taken from a structural analogue.',
      onclick: function () {
        state.drugMeasuredOnly = !state.drugMeasuredOnly;
        Store.setPref('drugMeasuredOnly', state.drugMeasuredOnly);
        render();
      }
    }, [h('span', { class: 'toggle-dot' }), 'Measured data only']));

    root.appendChild(controls);

    var listWrap = h('div', { class: 'drug-list' });
    root.appendChild(listWrap);

    var CONF_RANK = { measured: 0, estimated: 1, analogue: 2, community: 3, anecdotal: 4, unknown: 5 };

    function measured(d) { return DB.confidenceOf(d) === 'measured'; }

    function narrow(list) {
      return state.drugMeasuredOnly ? list.filter(measured) : list;
    }

    /**
     * Applied to every list on this tab except a search, which keeps its own
     * relevance order — re-sorting search results alphabetically would bury
     * the exact match the reader just typed.
     */
    function sorted(list) {
      var out = list.slice();
      if (state.drugSort === 'half-life') {
        out.sort(function (a, b) {
          var ah = a.halfLife.hours, bh = b.halfLife.hours;
          // Compounds with no recorded half-life sort last rather than first.
          if (ah == null && bh == null) return a.name.localeCompare(b.name);
          if (ah == null) return 1;
          if (bh == null) return -1;
          return ah - bh || a.name.localeCompare(b.name);
        });
      } else if (state.drugSort === 'confidence') {
        out.sort(function (a, b) {
          var d = (CONF_RANK[DB.confidenceOf(a)] || 9) - (CONF_RANK[DB.confidenceOf(b)] || 9);
          return d || a.name.localeCompare(b.name);
        });
      } else {
        out.sort(function (a, b) { return a.name.localeCompare(b.name); });
      }
      return out;
    }

    /** A line explaining what the list is currently showing, and why. */
    function countLine(shown, total, what) {
      var text = state.drugMeasuredOnly && shown !== total
        ? shown + ' of ' + total + ' ' + what + ' have measured human data'
        : shown + ' ' + what;
      return h('div', { class: 'browse-count' }, [
        h('span', { class: 'muted small', text: text }),
        state.drugMeasuredOnly ? h('button', {
          class: 'btn tiny', text: 'Show all',
          onclick: function () {
            state.drugMeasuredOnly = false;
            Store.setPref('drugMeasuredOnly', false);
            render();
          }
        }) : null
      ]);
    }

    function tile(d) {
      return h('button', { class: 'drug-tile', onclick: function () { openDrug(d.id); } }, [
        h('span', { class: 'dt-name' }, [
          d.name,
          d.inactive ? h('span', { class: 'pill kind-inactive', text: 'inactive' }) : null,
          UI.isPinned(d.id) ? h('span', { class: 'dt-pin', text: '★', title: 'Pinned' }) : null
        ]),
        h('span', { class: 'dt-family', text: d.family || '' }),
        h('span', { class: 'dt-meta' }, [
          't½ ' + Charts.fmtDur(d.halfLife.hours), ' ', confBadge(DB.confidenceOf(d))
        ])
      ]);
    }

    function paint() {
      listWrap.innerHTML = '';
      var q = state.drugQuery.trim();

      if (q) {
        pageBar.setAttribute('hidden', 'hidden');
        var all = DB.search(q, 500);
        var hits = narrow(all);
        listWrap.appendChild(countLine(hits.length, all.length, 'matches across every class'));
        if (!hits.length) {
          listWrap.appendChild(h('div', { class: 'empty' }, [
            h('p', { text: all.length
              ? 'Nothing matching “' + q + '” has measured human data.'
              : 'Nothing matches “' + q + '”.' }),
            h('p', { class: 'muted small', text: all.length
              ? 'Turn off the measured-data filter to see the ' + all.length + ' estimated ones.'
              : 'Try an alias, a class (“benzos”, “opioids”) or a partial name.' })
          ]));
          return;
        }
        // Grouped by class, in DB.search's relevance order — a search is
        // ranked by how well it matched, and re-sorting it would bury the
        // exact hit the reader just typed under an alphabetical list.
        var byClass = {}, order = [];
        hits.forEach(function (d) {
          if (!byClass[d.class]) { byClass[d.class] = []; order.push(d.class); }
          byClass[d.class].push(d);
        });
        order.forEach(function (cls) {
          listWrap.appendChild(h('h3', { class: 'class-head-plain', text: cls + ' (' + byClass[cls].length + ')' }));
          var grid = h('div', { class: 'drug-grid' });
          byClass[cls].forEach(function (d) { grid.appendChild(tile(d)); });
          listWrap.appendChild(grid);
        });
        return;
      }

      pageBar.removeAttribute('hidden');
      var inPage = DB.all().filter(function (d) { return pageForDrug(d) === state.drugPage; });
      var items = sorted(narrow(inPage));

      if (!items.length) {
        listWrap.appendChild(h('div', { class: 'empty' }, [
          h('p', { text: 'No compound on this page has measured human data.' }),
          h('button', {
            class: 'btn small', text: 'Show all ' + inPage.length,
            onclick: function () {
              state.drugMeasuredOnly = false;
              Store.setPref('drugMeasuredOnly', false);
              render();
            }
          })
        ]));
        return;
      }

      // "Other" spans several unrelated classes, so it keeps its subheadings.
      if (state.drugPage === 'other') {
        var groups = {}, names = [];
        items.forEach(function (d) {
          if (!groups[d.class]) { groups[d.class] = []; names.push(d.class); }
          groups[d.class].push(d);
        });
        names.sort();
        listWrap.appendChild(countLine(items.length, inPage.length, 'compounds'));
        names.forEach(function (cls) {
          listWrap.appendChild(h('h3', { class: 'class-head-plain', text: cls + ' (' + groups[cls].length + ')' }));
          var g = h('div', { class: 'drug-grid' });
          groups[cls].forEach(function (d) { g.appendChild(tile(d)); });
          listWrap.appendChild(g);
        });
      } else {
        listWrap.appendChild(countLine(items.length, inPage.length, 'compounds'));
        var grid2 = h('div', { class: 'drug-grid' });
        items.forEach(function (d) { grid2.appendChild(tile(d)); });
        listWrap.appendChild(grid2);
      }
    }

    search.addEventListener('input', function () {
      state.drugQuery = search.value;
      paint();
    });
    paint();
  }

  function openDrug(id) {
    state.selectedDrug = id;
    state.tab = 'drugs';
    // Feeds the palette's opening screen, so getting back to something you
    // were reading five minutes ago does not mean typing its name again.
    UI.pushRecent(DB.get(id) ? DB.get(id).id : id);
    render();
    window.scrollTo(0, 0);
  }

  /**
   * CAS number and molecular formula, for checking a compound against PubChem
   * or a supplier's certificate of analysis.
   *
   * A missing value is rendered as an explicit "not recorded" rather than
   * being hidden, because the two mean very different things: a blank row
   * would read as "this compound has no CAS number", when what is true is
   * that this database does not have it. Subscripting the formula digits is
   * cosmetic, but C8H10N4O2 is genuinely hard to read otherwise.
   */
  function identityLine(d) {
    if (!d.cas && !d.formula) return null;

    var formulaEl = h('span', { class: 'ident-value' });
    if (d.formula && /^[A-Za-z0-9()]+$/.test(d.formula)) {
      // A real formula: subscript the counts.
      d.formula.split(/(\d+)/).forEach(function (part) {
        if (!part) return;
        formulaEl.appendChild(/^\d+$/.test(part) ? h('sub', { text: part }) : document.createTextNode(part));
      });
    } else {
      // Mixtures and polymers carry a prose description instead.
      formulaEl.appendChild(document.createTextNode(d.formula || 'not recorded'));
      if (!d.formula) formulaEl.className = 'ident-value ident-missing';
    }

    return h('dl', { class: 'identity' }, [
      h('dt', { text: 'CAS' }),
      h('dd', {}, [d.cas
        ? h('span', { class: 'ident-value', text: d.cas })
        : h('span', { class: 'ident-value ident-missing', title:
            'No CAS registry number is recorded here. That means this database does not have it — not that the compound lacks one. Many novel research chemicals do have a registry number that simply is not well published.', text: 'not recorded' })]),
      h('dt', { text: 'Formula' }),
      h('dd', {}, [formulaEl])
    ]);
  }

  /**
   * The three header buttons: sources, structure, description.
   *
   * They sit on the identity line, immediately to the right of the molecular
   * formula, because all three answer "what else is known about this exact
   * compound" and none of them is worth the vertical space of a permanent
   * panel. Each opens what it names and nothing is expanded by default — the
   * page opens on the pharmacology.
   */
  function headerActions(d) {
    var row = h('div', { class: 'header-actions' });
    var srcList = null;

    var provenance = (d.refs || []).concat(d.sources || []);
    if (provenance.length) {
      var communitySourced = provenance.some(function (r) {
        return /psychonaut|tripsit|user report|community|consensus/i.test(r);
      });

      srcList = h('div', { class: 'sources-list', hidden: 'hidden' }, [
        h('ul', { class: 'plain-list refs' }, provenance.map(function (r) { return h('li', { text: r }); })),
        communitySourced ? h('div', { class: 'note note-warn' }, [
          'Some figures here come from harm-reduction wiki consensus or user reports rather than ' +
          'published pharmacology. They are estimates contributed by people who took the substance, ' +
          'not measurements — treat them accordingly.'
        ]) : null
      ]);

      var srcToggle = h('button', {
        class: 'sources-toggle' + (communitySourced ? ' community' : ''),
        title: provenance.join(' · '),
        onclick: function () {
          var open = srcList.hasAttribute('hidden');
          if (open) srcList.removeAttribute('hidden'); else srcList.setAttribute('hidden', 'hidden');
          srcToggle.classList.toggle('open', open);
        }
      }, [
        provenance.length + ' source' + (provenance.length === 1 ? '' : 's'),
        communitySourced ? h('span', { class: 'src-flag', title:
          'Some of these are wiki consensus or user reports rather than published pharmacology.',
          text: 'community' }) : null
      ]);
      row.appendChild(srcToggle);
    }

    /* ---- structure, on request only --------------------------------------
       The drawing used to sit in the header on every page load. A picture
       invites belief in a way a number does not, and this one is generated
       from a stored SMILES string with no stereochemistry — so it is behind a
       button, alongside the caveats, rather than being the first thing the
       page asserts. */
    row.appendChild(h('button', {
      class: 'sources-toggle',
      title: d.smiles ? 'Show the 2D structure drawn from the stored SMILES'
                      : 'No structure is recorded for this compound',
      onclick: function () { openStructurePopup(d); }
      // 'image' said what the button produced rather than what it shows.
    }, ['Structure']));

    row.appendChild(h('button', {
      class: 'sources-toggle',
      title: 'What this compound is, what it looks like, what people report, and how to be safer with it',
      onclick: function () { openInfoPopup(d); }
    }, ['What it is like']));

    row.appendChild(h('button', {
      class: 'sources-toggle',
      title: 'Where this compound comes from, and what its route of manufacture leaves in it',
      onclick: function () { openSynthesisPopup(d); }
    }, ['Synthesis']));

    return { row: row, sourcesList: srcList };
  }

  /**
   * The compound's 2D structure, as a popup.
   *
   * Absent SMILES means no picture and a line saying so — the same discipline
   * as CAS numbers. A confidently drawn wrong structure would be the worst
   * failure mode here.
   */
  function openStructurePopup(d) {
    var body = h('div', { class: 'structure-popup' }, [h('h2', { text: d.name })]);

    if (!d.smiles) {
      body.appendChild(h('p', { class: 'muted', text:
        'No structure is recorded for this compound. That means this database does not have its ' +
        'SMILES string — not that the compound has no structure.' }));
      openModal(body);
      return;
    }

    var svg = Structure.draw(d.smiles, { size: 620, name: d.name });
    if (!svg) {
      body.appendChild(h('p', { class: 'muted', text:
        'The structure could not be drawn from the stored SMILES string. The string itself is below ' +
        'so it can be pasted into a proper renderer.' }));
      body.appendChild(h('p', { class: 'mono small', text: d.smiles }));
      openModal(body);
      return;
    }

    body.appendChild(h('div', { class: 'structure-frame large' }, [svg]));
    body.appendChild(h('p', { class: 'mono small', text: d.smiles }));
    body.appendChild(h('p', { class: 'muted small', text:
      'Skeletal formula. Carbons are the unlabelled vertices; hydrogens on carbon are implicit. ' +
      'STEREOCHEMISTRY IS NOT DRAWN — no wedge or hash bonds — so enantiomers look identical here. ' +
      'Where that difference matters, and for several compounds it decides whether you get the ' +
      'medicine or the toxicity, the Isomers section carries it.' }));
    openModal(body);
  }

  /**
   * The "info" popup: what this compound is, in prose.
   *
   * Everything else on a substance page is a number with a confidence marker.
   * This is the paragraph that says what the thing actually is, what it looks
   * like on a table, what people who take it consistently report, and what
   * makes it less likely to hurt you — the parts that do not fit in a dose
   * ladder and that a person arriving from a bag of unknown powder needs
   * first.
   *
   * Curated text lives in js/data/descriptions.js. Where a compound has none,
   * the popup says so plainly and assembles what the database does know
   * rather than inventing a description — a fabricated paragraph about a
   * novel opioid is exactly the failure mode this app cannot afford.
   */
  function openInfoPopup(d) {
    var info = d.info || {};
    var body = h('div', { class: 'info-popup' }, [
      h('h2', { text: d.name }),
      h('div', { class: 'drug-sub' }, [
        h('span', { class: 'tag-chip', text: d.class }),
        d.family ? h('span', { class: 'tag-chip', text: d.family }) : null,
        d.schedule ? h('span', { class: 'tag-chip', text: d.schedule }) : null
      ])
    ]);

    var block = function (title, text, cls) {
      if (!text) return null;
      return h('div', { class: 'info-block ' + (cls || '') }, [
        h('h4', { text: title }),
        h('p', { text: text })
      ]);
    };

    if (info.what) {
      body.appendChild(block('What it is', info.what));
    } else {
      // No curated paragraph — say so, then give the mechanism line, which is
      // the closest thing the database holds to a description.
      body.appendChild(h('div', { class: 'note' }, [
        h('strong', { text: 'No written description recorded. ' }),
        'What follows is assembled from the database fields rather than written for ' +
        'this compound. Absent means "nobody has written one here", not "nothing is known".'
      ]));
      body.appendChild(block('Mechanism', d.mechanism || 'Not characterised.'));
    }

    body.appendChild(block('What it looks like', info.looks));
    if (!info.looks) {
      body.appendChild(h('div', { class: 'info-block' }, [
        h('h4', { text: 'What it looks like' }),
        h('p', { class: 'muted', text:
          'Not recorded. Appearance is worthless as identification in any case: colour, ' +
          'crystal habit and press marks are set by whoever made it, and counterfeits copy ' +
          'the appearance of what they are sold as. A reagent test or a lab result is the ' +
          'only thing that identifies a powder.' })
      ]));
    }

    if (info.reports) {
      body.appendChild(h('div', { class: 'info-block' }, [
        h('h4', { text: 'What people report' }),
        h('p', { text: info.reports }),
        h('p', { class: 'muted small', text:
          'Recurring themes from harm-reduction communities and drug subreddits, summarised. ' +
          'These are self-reports from people who took an unverified substance, usually without ' +
          'a lab result and often in combination with something else. They describe what people ' +
          'said, not what the compound does.' })
      ]));
    }

    body.appendChild(block('Harm reduction', info.harm, 'info-harm'));

    /* ---- what the database knows, whether or not prose exists ---- */
    var facts = h('dl', { class: 'kv wide-kv' });
    var addFact = function (k, v) {
      if (v == null || v === '') return;
      facts.appendChild(h('dt', { text: k }));
      facts.appendChild(h('dd', { text: v }));
    };
    addFact('Half-life', Charts.fmtDur(d.halfLife.hours) +
      (d.halfLife.range ? ' (range ' + d.halfLife.range[0] + '–' + d.halfLife.range[1] + ' h)' : ''));
    var rk = Object.keys(d.routes)[0];
    var rt = d.routes[rk];
    if (rt) {
      addFact('Typical onset / duration (' + rk + ')',
        rt.onsetMin[0] + '–' + rt.onsetMin[1] + ' min, lasting ' +
        rt.durationH[0] + '–' + rt.durationH[1] + ' h');
    }
    var commonLadder = rt && rt.doses;
    if (commonLadder && commonLadder.common) {
      addFact('Common dose (' + rk + ')',
        commonLadder.common[0] + '–' + commonLadder.common[1] + ' ' + (commonLadder.unit || 'mg'));
    }
    addFact('Routes recorded', Object.keys(d.routes).join(', '));
    addFact('Metabolised by', d.metabolism.substrateOf.join(', '));
    var act = DB.activeMetabolites(d);
    if (act.length) {
      addFact('Active metabolites', act.map(function (m) {
        return m.name + (m.halfLifeH ? ' (t½ ' + Charts.fmtDur(m.halfLifeH) + ')' : '');
      }).join(', '));
    }
    if (d.toleranceGroup) addFact('Cross-tolerance group', d.toleranceGroup);
    if (d.cas) addFact('CAS', d.cas);
    if (d.formula) addFact('Formula', d.formula);

    body.appendChild(h('div', { class: 'info-block' }, [
      h('h4', { text: 'At a glance' }),
      facts
    ]));

    if (d.warnings.length) {
      body.appendChild(h('div', { class: 'warn-block' }, [
        h('h3', { text: 'Safety' }),
        h('ul', {}, d.warnings.map(function (w) { return h('li', { text: w }); }))
      ]));
    }

    body.appendChild(h('p', { class: 'muted small', text:
      'Nothing here is a dosing instruction or a recommendation to take anything. Test kits, a ' +
      'scale that actually reads the amount you are weighing, not using alone, and naloxone in ' +
      'the room where opioids might be present do more to keep people alive than any figure on ' +
      'this page.' }));

    openModal(body);
  }

  /**
   * The "synthesis" popup: where the compound came from, and what that left
   * in it.
   *
   * The info popup answers what a compound is. This one answers why the
   * powder in front of someone is not the compound — why it varies between
   * batches, why the same measure gives a different dose twice, why a route
   * that was fine in 2014 produces something with lead in it now. Provenance
   * is the upstream cause of most of the adulteration and dose-variance
   * warnings that appear elsewhere on the page, and collecting it in one
   * place lets those warnings have a reason rather than just a severity.
   *
   * What this panel is NOT is a procedure. js/data/synthesis.js sets the rule
   * the content is written to — route families are named, never performed, on
   * the grounds that a name is what explains an impurity profile to a reader
   * and a method is only of use to someone manufacturing. The closing note
   * says that out loud, because a panel called "Synthesis" that declines to
   * be a recipe should say why rather than leave the reader hunting for a
   * section that was never there.
   */
  function openSynthesisPopup(d) {
    var s = d.synthesis || null;
    var body = h('div', { class: 'info-popup synth-popup' }, [
      h('h2', { text: d.name + ' — where it comes from' }),
      h('div', { class: 'drug-sub' }, [
        h('span', { class: 'tag-chip', text: d.class }),
        d.family ? h('span', { class: 'tag-chip', text: d.family }) : null,
        d.schedule ? h('span', { class: 'tag-chip', text: d.schedule }) : null
      ])
    ]);

    var block = function (title, text, cls) {
      if (!text) return null;
      return h('div', { class: 'info-block ' + (cls || '') }, [
        h('h4', { text: title }),
        h('p', { text: text })
      ]);
    };

    if (!s) {
      /* Same discipline as the info popup: absent means nobody has written
         one, and the honest move is to say so. Assembling a route from the
         compound's class would be exactly the invention this app cannot
         afford — "it is a substituted cathinone, so presumably…" is how a
         database starts asserting chemistry it has no source for. */
      body.appendChild(h('div', { class: 'note' }, [
        h('strong', { text: 'No provenance recorded for this compound. ' }),
        'Absent means nobody has written one here, not that its origin is unknown to ' +
        'chemistry. Nothing has been assembled from its class, because a route guessed ' +
        'from a family resemblance would read exactly like a sourced one.'
      ]));

      var known = h('dl', { class: 'kv wide-kv' });
      var add = function (k, v) {
        if (v == null || v === '') return;
        known.appendChild(h('dt', { text: k }));
        known.appendChild(h('dd', { text: v }));
      };
      add('Class', d.class);
      add('Family', d.family);
      add('Legal status', d.schedule);
      add('CAS', d.cas);
      add('Formula', d.formula);
      body.appendChild(h('div', { class: 'info-block' }, [
        h('h4', { text: 'What the database does hold' }),
        known
      ]));
    } else {
      body.appendChild(block('Origin', s.origin));
      body.appendChild(block('Route family', s.route));
      body.appendChild(block('Precursors and control', s.precursors));
      // The field the panel exists for, styled to read as the warning it is.
      body.appendChild(block('What the route leaves behind', s.impurities, 'synth-impurities'));
      body.appendChild(block('What is actually sold', s.supply));
    }

    body.appendChild(h('div', { class: 'note' }, [
      h('strong', { text: 'Named, not detailed. ' }),
      'This panel names route families, precursors and the residues they leave, because that ' +
      'is what explains a lab result, an impurity profile or a batch that behaved differently. ' +
      'It carries no reagent sequences, quantities or conditions, which would tell a reader ' +
      'nothing they need and a manufacturer everything.'
    ]));

    body.appendChild(h('p', { class: 'muted small', text:
      'Provenance explains why a supply varies; it never tells you what is in the thing you ' +
      'are holding. Only a reagent test, a fentanyl strip or a drug-checking service does that, ' +
      'and none of them make an unknown substance safe — they only narrow what it might be.' }));

    openModal(body);
  }

  /**
   * Pin a compound to the top of the command palette.
   *
   * The pin is the only piece of per-substance state the app keeps, and it
   * exists because a database this size is mostly not about any one reader:
   * the six or eight compounds that are theirs should be one keystroke away,
   * and everything else can stay behind a search.
   */
  function pinButton(d) {
    var on = UI.isPinned(d.id);
    var b = h('button', {
      class: 'star-btn' + (on ? ' on' : ''),
      title: on ? 'Pinned — click to remove' : 'Pin to the top of the command palette',
      'aria-pressed': on ? 'true' : 'false',
      text: on ? '★' : '☆',
      onclick: function () {
        var added = UI.togglePin(d.id);
        b.className = 'star-btn' + (added ? ' on' : '');
        b.textContent = added ? '★' : '☆';
        b.setAttribute('aria-pressed', added ? 'true' : 'false');
        b.setAttribute('title', added ? 'Pinned — click to remove' : 'Pin to the top of the command palette');
        UI.toast(added ? 'Pinned ' + d.name : 'Unpinned ' + d.name,
          { kind: added ? 'ok' : null, icon: added ? '★' : '☆' });
      }
    });
    return b;
  }

  /** The route a summary should describe: the one people take it by. */
  function primaryRoute(d) {
    var keys = Object.keys(d.routes || {});
    if (!keys.length) return null;
    // Whichever route has a common dose recorded, preferring the order the
    // data declares — that order is already "most usual first".
    var withDose = keys.filter(function (k) { return d.routes[k].doses; });
    return (withDose[0] || keys[0]);
  }

  function factCell(label, value, note) {
    if (value == null) return null;
    return h('div', { class: 'fact' }, [
      h('span', { class: 'fact-label', text: label }),
      h('span', { class: 'fact-value', text: value }),
      note ? h('span', { class: 'fact-note', text: note }) : null
    ]);
  }

  function keyFacts(d) {
    var rk = primaryRoute(d);
    var r = rk ? d.routes[rk] : null;
    var cells = [];

    // --- how much ---
    if (r && r.doses) {
      var common = ladderSteps(r.doses).filter(function (x) { return x.tier === 'common'; })[0];
      if (common) cells.push(factCell('Common dose', common.text, routeLabel(rk)));
    }

    // --- how long until it starts, and how long it lasts ---
    if (r) {
      if (r.onsetMin) {
        cells.push(factCell('Onset', r.onsetMin[0] + '–' + r.onsetMin[1] + ' min', routeLabel(rk)));
      }
      if (r.durationH) {
        cells.push(factCell('Duration', r.durationH[0] + '–' + r.durationH[1] + ' h', routeLabel(rk)));
      }
    }

    // --- how long until it is gone ---
    if (d.halfLife && d.halfLife.hours != null) {
      cells.push(factCell('Half-life', Charts.fmtDur(d.halfLife.hours),
        DB.confidenceOf(d) === 'measured' ? 'measured' : 'estimated'));
      // Five half-lives is the figure the rest of the app clears a dose at.
      cells.push(factCell('Effectively clear', Charts.fmtDur(d.halfLife.hours * 5),
        'about five half-lives'));
    }

    if (!cells.length) return null;

    return h('section', { class: 'key-facts', 'aria-label': 'Key figures' }, cells);
  }

  function renderDrugDetail(root, id) {
    var d = DB.get(id);
    if (!d) { state.selectedDrug = null; renderDrugs(root); return; }

    /* ---- safety first, directly under the standing disclaimer -------------
       The warnings used to sit below the header, after the name, the chips,
       the aliases, the identifiers and a structure drawing. Everything above
       them was reference material and they were the only part that could stop
       someone doing something irreversible, so they go first — immediately
       under the "Read this first" block at the top of the page, where the
       reading order already has the person primed for a caveat. */
    if (d.warnings.length) {
      root.appendChild(h('div', { class: 'warn-block warn-block-top' }, [
        h('h3', {}, ['Safety — ', h('span', { class: 'warn-subject', text: d.name })]),
        h('ul', {}, d.warnings.map(function (w) { return h('li', { text: w }); }))
      ]));
    }

    root.appendChild(h('button', {
      class: 'btn small back', text: '← All substances',
      onclick: function () { state.selectedDrug = null; render(); }
    }));

    // Sources, structure and description live on the identity line, to the
    // right of the molecular formula — see headerActions().
    var actions = headerActions(d);
    root.appendChild(h('div', { class: 'drug-header' }, [
      h('div', { class: 'drug-title-row' }, [
        h('h1', { text: d.name }),
        pinButton(d),
        // Reading about a compound and logging one are the same errand often
        // enough that making the reader go back to Now, open the modal and
        // retype the name was the wrong default.
        (d.formedInVivo || !Object.keys(d.routes).length) ? null : h('button', {
          class: 'btn small', text: '+ Log a dose',
          onclick: function () { openLogModal(d.id); }
        })
      ]),
      h('div', { class: 'drug-sub' }, [
        h('span', { class: 'tag-chip', text: d.class }),
        d.family ? h('span', { class: 'tag-chip', text: d.family }) : null,
        d.schedule ? h('span', { class: 'tag-chip', text: d.schedule }) : null
      ]),
      d.aliases.length ? h('p', { class: 'muted small', text: 'Also known as: ' + d.aliases.join(', ') }) : null,
      keyFacts(d),
      h('div', { class: 'identity-row' }, [identityLine(d), actions.row]),
      actions.sourcesList
    ]));

    /* ------------------------------------------------------------------
       Section order is deliberate and runs identity → what it does → how
       to take it → what happens to it → how it compares → what it clashes
       with. The three a person actually opens a substance page for
       (isomers, mechanism, dosing) are expanded; the reference material
       below them is collapsed so the page opens short.

       Open/closed state is keyed by section rather than by compound, so a
       preference set on one substance carries to the next.
       ------------------------------------------------------------------ */
    var secs = [];
    var add = function (key, title, open, build, opts) {
      opts = opts || {};
      var s = section('drug.' + key, title, { open: open, count: opts.count, badge: opts.badge });
      var content = build();
      if (content == null) return;
      s.body.appendChild(content);
      secs.push(s.el);
    };

    /**
     * A heading and its content, with no disclosure control.
     *
     * Mechanism, dosing and elimination are why the page is open. Wrapping
     * them in the same collapsible chrome as the reference material below
     * gave three things you always want the same one click as the things you
     * rarely do, and a collapsed dosing ladder is a dosing ladder nobody
     * reads. They render flat and always visible.
     */
    var addStatic = function (title, content, badge, count) {
      if (content == null) return;
      secs.push(h('div', { class: 'sec sec-static' }, [
        h('div', { class: 'sec-head-static' }, [
          h('span', { class: 'sec-title', text: title }),
          count != null ? h('span', { class: 'sec-count', text: String(count) }) : null,
          badge || null
        ]),
        h('div', { class: 'sec-body' }, [content])
      ]));
    };

    /* ---- 1. isomers ---- */
    if (d.isomers) {
      add('isomers', 'Isomers', true, function () { return renderIsomers(d); }, {
        badge: h('span', { class: 'tag-chip', text: ISOMER_TYPE_LABEL[d.isomers.type] || d.isomers.type })
      });
    }

    /* ---- 2. mechanism (static) ---- */
    addStatic('Mechanism', h('p', { text: d.mechanism || 'Not characterised.' }));

    /* ---- 3. routes & dosing (static) ----
       A compound formed in the body is not administered, so it has no route
       and no dose ladder. Saying so is the honest version; the schema's
       defaults would otherwise print an onset, a duration and a
       bioavailability for something nobody takes. */
    var routesSec = h('div', {});
    if (d.formedInVivo || !Object.keys(d.routes).length) {
      routesSec.appendChild(h('p', { class: 'muted', text:
        d.formedInVivo
          ? d.name + ' is formed inside the body from ' +
            (d.parentIds || []).map(function (pid) {
              var p = DB.get(pid); return p ? p.name : pid;
            }).join(', ') + ' rather than taken, so there is no route and no dose for it. ' +
            'The dosing that determines how much of it you end up with is the parent compound\u2019s.'
          : 'No route or dosing information is recorded for this compound.' }));
      if (d.formedInVivo && (d.parentIds || []).length) {
        var jump = h('div', { class: 'row-actions' });
        d.parentIds.forEach(function (pid) {
          var p = DB.get(pid);
          if (!p) return;
          jump.appendChild(h('button', { class: 'btn small', text: 'Open ' + p.name,
            onclick: function () { openDrug(p.id); } }));
        });
        routesSec.appendChild(jump);
      }
    }
    Object.keys(d.routes).forEach(function (rk) {
      var r = d.routes[rk];
      var dd = r.doses;
      var block = h('div', { class: 'route-block' }, [
        h('div', { class: 'route-head' }, [
          h('strong', { text: routeLabel(rk) }),
          h('span', { class: 'muted small', text: 'bioavailability ~' + Math.round(r.bioavailability * 100) + '%' })
        ]),
        h('div', { class: 'route-times muted small', text:
          'onset ' + r.onsetMin[0] + '–' + r.onsetMin[1] + ' min · ' +
          'peak ' + Math.round(r.peakMin[0]) + '–' + Math.round(r.peakMin[1]) + ' min · ' +
          'duration ' + r.durationH[0] + '–' + r.durationH[1] + ' h' +
          (r.afterEffectsH[1] ? ' · after-effects ' + r.afterEffectsH[0] + '–' + r.afterEffectsH[1] + ' h' : '') })
      ]);
      if (dd) {
        block.appendChild(ladderEl(dd));
        if (dd.note) block.appendChild(h('div', { class: 'ladder-note', text: dd.note }));
      }
      routesSec.appendChild(block);
    });
    addStatic('Routes & dosing', routesSec, null, Object.keys(d.routes).length);

    /* ---- 4. half-life & elimination (static) ----
       Directly after dosing, because "how much" and "how long until it is
       gone" are one question asked twice and reading them apart is how people
       redose on top of a dose that has not cleared. */
    var hl = d.halfLife;
    addStatic('Half-life & elimination', h('div', {}, [
      h('dl', { class: 'kv wide-kv' }, [
        h('dt', { text: 'Half-life' }),
        h('dd', { text: Charts.fmtDur(hl.hours) + (hl.range ? '  (range ' + hl.range[0] + '–' + hl.range[1] + ' h)' : '') }),
        h('dt', { text: '~97% cleared (5 half-lives)' }),
        h('dd', { text: Charts.fmtDur(hl.hours * 5) }),
        h('dt', { text: 'Excretion' }),
        h('dd', { text: d.metabolism.excretion || 'Not characterised.' }),
        d.metabolism.firstPass ? h('dt', { text: 'First-pass' }) : null,
        d.metabolism.firstPass ? h('dd', { text: d.metabolism.firstPass }) : null
      ]),
      hl.notes ? h('div', { class: 'note' }, [hl.notes]) : null,
      cypNoteFor(d)
    ]), confBadge(hl.confidence));

    /* ---- 5. tolerance ---- */
    add('tolerance', 'Tolerance', false, function () {
      if (!d.toleranceHalfLifeDays && !d.minRedoseDays && !d.toleranceGroup) {
        return h('p', { class: 'muted', text: 'No tolerance data recorded for this compound.' });
      }
      return h('dl', { class: 'kv wide-kv' }, [
        d.toleranceHalfLifeDays ? h('dt', { text: 'Tolerance half-life' }) : null,
        d.toleranceHalfLifeDays ? h('dd', { text: '~' + d.toleranceHalfLifeDays + ' days to lose half of accumulated tolerance' }) : null,
        d.minRedoseDays ? h('dt', { text: 'Suggested minimum spacing' }) : null,
        d.minRedoseDays ? h('dd', { text: d.minRedoseDays + ' days' }) : null,
        d.toleranceGroup ? h('dt', { text: 'Cross-tolerance group' }) : null,
        d.toleranceGroup ? h('dd', { text: d.toleranceGroup }) : null
      ]);
    });

    /* ---- 6. metabolism ---- */
    // A route-specific pathway set is only selectable where one exists; the
    // preference resets when it does not apply to the compound being viewed.
    var metaRoute = (state.metabolismRoute && d.routes[state.metabolismRoute] &&
                     d.routes[state.metabolismRoute].metabolism) ? state.metabolismRoute : null;
    add('metabolism', 'Metabolism', false, function () { return renderMetabolism(d, metaRoute); },
        { badge: confBadge(d.metabolism.confidence) });

    /* ---- 7. metabolites: no section of its own ----
       It listed the same products the pathway diagram already shows, one
       screen further down. The detail now opens from the product itself —
       in the diagram or in the table — where the question actually arises. */

    /* ---- 8. relative strength ---- */
    add('potency', 'Relative strength', false, function () { return renderPotency(d); });

    /* ---- 9. notable interactions ---- */
    var others = DB.all().filter(function (o) { return o.id !== d.id; });
    var inters = [];
    others.forEach(function (o) {
      Interactions.between(d, o).forEach(function (f) {
        if (Interactions.LEVELS[f.level].rank >= 3) inters.push(f);
      });
    });
    inters.sort(function (a, b) { return Interactions.LEVELS[b.level].rank - Interactions.LEVELS[a.level].rank; });
    add('interactions', 'Notable interactions', false, function () {
      return interactionBrowser(d, inters);
    }, { count: inters.length });

    /* ---- sources live in the header, not down here ----
       Provenance is the whole point of the confidence labelling, and a
       collapsed section at the bottom is where nobody looks. It is rendered
       beside the compound name instead — see headerActions(). */

    /* ---- a jump bar over the sections --------------------------------
       A full substance page runs to several screens — isomers, mechanism,
       dosing, elimination, metabolism, potency, interactions — and half of
       them are collapsed, so scrolling past a closed section tells you
       nothing about what is further down. The bar lists what the page holds
       and jumps to it, opening a collapsed section on the way rather than
       scrolling to a heading that hides its own contents.
       ------------------------------------------------------------------ */
    if (secs.length > 2) root.appendChild(sectionJumpBar(secs));

    secs.forEach(function (el) { root.appendChild(el); });
  }

  /**
   * Builds the jump bar from the sections themselves, so it cannot list a
   * section that is not there — the page varies a lot between compounds
   * (a metabolite has no dosing, most compounds have no isomers).
   */
  function sectionJumpBar(secs) {
    var bar = h('nav', { class: 'jump-bar', 'aria-label': 'Sections on this page' });

    secs.forEach(function (el, i) {
      var titleEl = el.querySelector('.sec-title');
      if (!titleEl) return;
      var title = titleEl.textContent;
      var id = 'sec-' + i;
      el.id = id;

      bar.appendChild(h('button', {
        class: 'jump-link', text: title,
        onclick: function () {
          // A collapsed section is opened first: jumping to a heading that
          // hides what you came for is worse than not jumping at all.
          var head = el.querySelector('.sec-head');
          var body = el.querySelector('.sec-body');
          if (head && body && body.hasAttribute('hidden')) head.click();

          // The application bar is sticky, so an unadjusted scroll puts the
          // heading underneath it.
          var top = el.getBoundingClientRect().top + window.pageYOffset - 74;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }));
    });

    return bar;
  }

  /**
   * Paginated, searchable interaction list.
   *
   * A compound like alcohol pulls hundreds of findings, and dumping the first
   * thirty in a wall meant the one you were looking for was usually not there.
   * Ten at a time, with a search that matches the other substance's name, its
   * class, or the mechanism text — so "opioid", "serotonergic" and "QT" all
   * narrow it usefully.
   */
  function interactionBrowser(subject, findings) {
    var wrap = h('div', { class: 'inter-browser' });

    if (!findings.length) {
      wrap.appendChild(h('p', { class: 'muted', text:
        'No interactions at caution level or above are recorded for this compound. That means ' +
        'none are in this database — not that none exist.' }));
      return wrap;
    }

    var PER_PAGE = 10;
    var query = '';
    var page = 0;

    var search = h('input', {
      type: 'search', class: 'inter-search',
      placeholder: 'Search by substance, class or mechanism…'
    });
    var listWrap = h('div', {});
    var pager = h('div', { class: 'pager' });

    // The other party in each finding — the compound that is not the subject.
    function otherOf(f) {
      var pair = f.drugs || [];
      return pair.filter(function (x) { return x && x.id !== subject.id; })[0] || pair[0];
    }

    function haystack(f) {
      var o = otherOf(f);
      return [
        o ? o.name : '', o ? o.class : '', o ? o.family : '',
        o ? (o.tags || []).join(' ') : '',
        f.title, f.mechanism, f.detail, f.level, f.source
      ].filter(Boolean).join(' ').toLowerCase();
    }

    function paint() {
      var terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var matched = !terms.length ? findings : findings.filter(function (f) {
        var hay = haystack(f);
        return terms.every(function (t) { return hay.indexOf(t) >= 0; });
      });

      var pages = Math.max(1, Math.ceil(matched.length / PER_PAGE));
      if (page >= pages) page = pages - 1;
      var slice = matched.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

      listWrap.innerHTML = '';
      listWrap.appendChild(h('p', { class: 'muted small', text: terms.length
        ? matched.length + ' of ' + findings.length + ' match'
        : findings.length + ' recorded at caution level or above' }));

      if (!slice.length) {
        listWrap.appendChild(h('div', { class: 'empty small' }, [
          h('p', { text: 'Nothing matches that search.' })
        ]));
      } else {
        listWrap.appendChild(findingsList(slice));
      }

      pager.innerHTML = '';
      if (pages > 1) {
        pager.appendChild(h('button', {
          class: 'btn small', text: '‹ Previous', disabled: page === 0 ? 'disabled' : null,
          onclick: function () { if (page > 0) { page--; paint(); } }
        }));
        pager.appendChild(h('span', { class: 'muted small',
          text: 'Page ' + (page + 1) + ' of ' + pages }));
        pager.appendChild(h('button', {
          class: 'btn small', text: 'Next ›', disabled: page >= pages - 1 ? 'disabled' : null,
          onclick: function () { if (page < pages - 1) { page++; paint(); } }
        }));
      }
    }

    // Repaint only the list, so typing does not rebuild the input and lose the caret.
    search.addEventListener('input', function (e) { query = e.target.value; page = 0; paint(); });

    wrap.appendChild(search);
    wrap.appendChild(listWrap);
    wrap.appendChild(pager);
    paint();
    return wrap;
  }

  /* ---------- metabolism section ------------------------------------------ */

  /**
   * The metabolism section.
   *
   * `routeKey` picks which set of pathways to show. Most compounds have one,
   * and it is the compound's own. Where a route changes what the molecule
   * becomes — swallowed heroin arriving as morphine, with no 6-MAM at all —
   * that route declares its own block and gets its own tab here, because
   * drawing the parenteral pathway map on a page about an oral dose would be
   * describing a different drug.
   */
  function renderMetabolism(d, routeKey) {
    var routeMeta = routeKey && d.routes[routeKey] ? d.routes[routeKey].metabolism : null;
    var m = routeMeta || d.metabolism;
    // The collapsible section header carries the title and confidence badge now.
    var sec = h('section', {});

    // Which routes carry a metabolism of their own, if any.
    var special = Object.keys(d.routes).filter(function (k) { return !!d.routes[k].metabolism; });
    if (special.length) {
      var shared = Object.keys(d.routes).filter(function (k) { return !d.routes[k].metabolism; });
      var seg = h('div', { class: 'seg' });
      var mk = function (key, label, title) {
        seg.appendChild(h('button', {
          class: 'seg-btn' + ((routeKey || null) === key ? ' active' : ''),
          title: title,
          onclick: function () { state.metabolismRoute = key; render(); }
        }, [label]));
      };
      mk(null, shared.length ? shared.join(' / ') : 'default',
        'The compound\u2019s own pathways, used by every route that does not declare its own.');
      special.forEach(function (k) {
        mk(k, k, 'This route changes what the compound becomes. ' +
          (d.routes[k].metabolism.pathways[0] && d.routes[k].metabolism.pathways[0].note || ''));
      });
      sec.appendChild(h('div', { class: 'diagram-head' }, [
        h('span', { class: 'mode-label', text: 'Route' }), seg
      ]));
      sec.appendChild(h('div', { class: 'note' }, [
        h('strong', { text: 'This compound is metabolised differently depending on how it is taken. ' }),
        routeMeta
          ? 'Showing the ' + routeKey + ' route, where first-pass metabolism changes the products. ' +
            'The dose figures for it are on the Routes & dosing section above.'
          : 'Showing the pathways used by ' + (shared.join(', ') || 'the default route') + '. ' +
            'The ' + special.join(' and ') + ' route' + (special.length === 1 ? '' : 's') +
            ' produce' + (special.length === 1 ? 's' : '') + ' a different set — switch above.'
      ]));
    }

    if (!m.pathways.length) {
      sec.appendChild(h('p', { class: 'muted', text: 'Metabolic pathways have not been characterised for this compound.' }));
      return sec;
    }

    // enzyme summary
    sec.appendChild(h('div', { class: 'enzyme-row' }, [
      m.substrateOf.length ? h('div', { class: 'enzyme-group' }, [
        h('span', { class: 'eg-label', text: 'Metabolised by' }),
        h('span', {}, m.substrateOf.map(function (e) {
          return h('button', { class: 'enzyme-chip', onclick: function () { showEnzyme(e); } }, [e]);
        }))
      ]) : null,
      m.inhibits.length ? h('div', { class: 'enzyme-group' }, [
        h('span', { class: 'eg-label', text: 'Inhibits' }),
        h('span', {}, m.inhibits.map(function (e) {
          return h('button', { class: 'enzyme-chip inhibit', onclick: function () { showEnzyme(e); } }, [e]);
        }))
      ]) : null,
      m.induces.length ? h('div', { class: 'enzyme-group' }, [
        h('span', { class: 'eg-label', text: 'Induces' }),
        h('span', {}, m.induces.map(function (e) {
          return h('button', { class: 'enzyme-chip induce', onclick: function () { showEnzyme(e); } }, [e]);
        }))
      ]) : null,
      // Transporters are not enzymes, but they often decide how much of a drug
      // reaches the brain — sometimes more than metabolism does.
      m.transporters.length ? h('div', { class: 'enzyme-group' }, [
        h('span', { class: 'eg-label', text: 'Transporters' }),
        h('span', {}, m.transporters.map(function (e) {
          return h('span', { class: 'enzyme-chip transporter', text: e });
        }))
      ]) : null
    ]));

    if (m.pharmacogenetics) {
      sec.appendChild(h('div', { class: 'note note-pgx' }, [
        h('strong', { text: 'Pharmacogenetics: ' }), m.pharmacogenetics
      ]));
    }

    // pathway diagram
    /* ---- the diagram, with a depth control -------------------------------
       One level is the right default: it answers "what does this become",
       which is what most people came for, and it keeps the picture the size
       of a picture. "Show all" follows every product that is itself
       metabolised until nothing further is recorded — which for the prodrugs
       is the whole story, since cloniprazepam's interesting behaviour is two
       steps away and ketazolam's is three. */
    var extraSteps = Charts.pathwayDepthBeyondFirst(d);
    var diagWrap = h('div', {});

    var paintDiagram = function () {
      diagWrap.innerHTML = '';
      var svg = wirePathwayDiagram(
        Charts.pathwayDiagram(d, { showAll: state.pathwayShowAll, metabolism: m }), d, m);
      if (!svg) return;
      diagWrap.appendChild(h('div', { class: 'chart-wrap pathway' }, [svg]));
      diagWrap.appendChild(h('p', { class: 'muted small', text:
        'Line thickness is proportional to the share of the dose taking that route. Green boxes are ' +
        'pharmacologically active products; grey are inactive. One enzyme producing several products is ' +
        'drawn once and branches — that is one step with several outcomes, not several steps. ' +
        (state.pathwayShowAll
          ? 'Every metabolite that is itself metabolised is followed onwards, so a box in the third column ' +
            'is a metabolite of the box in the second, not of ' + d.name + '. Wide chains scroll sideways.'
          : 'Only ' + d.name + '\u2019s direct metabolites are shown' +
            (extraSteps ? ' — "Show all" follows them onwards through ' + extraSteps +
              ' further step' + (extraSteps === 1 ? '' : 's') + '.' : '.')) }));
    };

    if (Charts.pathwayDiagram(d, { showAll: false, metabolism: m })) {
      sec.appendChild(h('div', { class: 'diagram-head' }, [
        h('span', { class: 'mode-label', text: 'Pathway map' }),
        h('button', {
          class: 'toggle-btn' + (state.pathwayShowAll ? ' on' : ''),
          title: state.pathwayShowAll
            ? 'Following every metabolite onwards. Click to stop at the direct metabolites.'
            : (extraSteps
                ? 'Follow each metabolite onwards through ' + extraSteps + ' further recorded step' +
                  (extraSteps === 1 ? '' : 's') + '.'
                : 'Nothing further is recorded beyond the direct metabolites.'),
          onclick: function () {
            state.pathwayShowAll = !state.pathwayShowAll;
            Store.setPref('pathwayShowAll', state.pathwayShowAll);
            paintDiagram();
          }
        }, [h('span', { class: 'toggle-dot' }), 'Show all'])
      ]));
      sec.appendChild(diagWrap);
      paintDiagram();
    }

    // pathway table
    // Explicit column widths, so `table-layout: fixed` can wrap the prose
    // columns instead of letting the widest cell dictate the table width.
    var colgroup = h('colgroup', {}, ['c-enzyme', 'c-reaction', 'c-product', 'c-share'].map(function (c) {
      return h('col', { class: c });
    }));
    var tbl = h('table', { class: 'meta-table' }, [
      colgroup,
      h('thead', {}, [h('tr', {}, ['Enzyme', 'Reaction', 'Product', 'Share'].map(function (t) { return h('th', { text: t }); }))])
    ]);
    var tb = h('tbody');
    m.pathways.forEach(function (p) {
      var transport = DB.isTransportStep(p.enzyme);
      var products = (p.products && p.products.length)
        ? p.products : [{ name: p.product, fraction: p.fraction }];

      // One row per pathway. A forked pathway lists its outcomes inside the
      // product cell rather than repeating the enzyme, so the table matches
      // the diagram: one enzyme, several fates.
      var prodCell = h('td', {}, products.map(function (prod) {
        var matched = DB.matchMetabolite(prod.name, m.metabolites);
        var active = prod.active != null ? prod.active : !!(matched && matched.active);
        return h('div', { class: 'outcome' }, [
          h('button', {
            class: 'link-title small outcome-name',
            title: prod.covers
              ? 'Open the list of ' + prod.covers.length + ' conjugates this stands for'
              : 'Open the detail for ' + prod.name,
            onclick: function () { openMetaboliteFromPathway(d, prod.name, m); }
          }, [prod.name]),
          h('span', { class: 'pill ' + (active ? 'met-active' : 'met-inactive'),
                      text: active ? 'active' : 'inactive' }),
          products.length > 1 && prod.fraction != null
            ? h('span', { class: 'muted small', text: Math.round(prod.fraction * 100) + '%' })
            : null,
          // A conjugation step usually produces half a dozen glucuronides that
          // are all inactive and all excreted. Listing each as its own product
          // buried the two or three that matter, so they collapse to one row
          // that says how many it stands for and opens the full list.
          prod.covers
            ? h('span', { class: 'covers-count', title: prod.covers.join(', '),
                          text: prod.covers.length + ' products' })
            : null
        ]);
      }));

      tb.appendChild(h('tr', {}, [
        h('td', {}, [transport
          // Transport steps get no enzyme lookup — they aren't enzymes.
          ? h('span', { class: 'enzyme-chip transporter', title: 'A transport step, not a metabolic enzyme.', text: p.enzyme })
          : h('button', { class: 'enzyme-chip', onclick: function () { showEnzyme(p.enzyme); } }, [p.enzyme]),
          // A second step further down the chain acts on an intermediate, not
          // on the parent. Saying so is what stops the row reading as another
          // fork straight off the compound at the top of the page.
          p.from ? h('span', { class: 'from-chip', title:
            'This step acts on ' + p.from + ', which is itself a metabolite — not on ' + d.name + ' directly.',
            text: 'on ' + p.from }) : null]),
        h('td', { text: p.reaction }),
        prodCell,
        h('td', { text: p.fraction != null ? Math.round(p.fraction * 100) + '%' : '—' })
      ]));
      if (p.note) {
        tb.appendChild(h('tr', { class: 'note-row' }, [h('td', { colspan: '4', text: p.note })]));
      }
    });
    tbl.appendChild(tb);
    sec.appendChild(h('div', { class: 'table-wrap meta-table-wrap' }, [tbl]));

    return sec;
  }


  /**
   * Open a metabolite's detail from a pathway product name.
   *
   * The standalone "Metabolites" section used to carry this. It duplicated the
   * pathway diagram — the same products, listed again underneath — so the list
   * is gone and its content now surfaces here, from the thing you were already
   * looking at when the question occurred to you.
   */
  /**
   * `metabolism` overrides the compound's block, for a diagram drawn from a
   * route that declares its own products.
   */
  function openMetaboliteFromPathway(parentDrug, productName, metabolism) {
    var meta = metabolism || parentDrug.metabolism;

    // A collapsed conjugate group opens as the list it stands for, rather than
    // as a metabolite detail panel it has no record for.
    var group = null;
    meta.pathways.forEach(function (p) {
      (p.products || []).forEach(function (prod) {
        if (prod.covers && prod.name === productName) group = { prod: prod, path: p };
      });
    });
    if (group) { openConjugateGroupPopup(parentDrug, group.prod, group.path); return; }

    var met = DB.matchMetabolite(productName, meta.metabolites);
    if (!met) {
      // A product with no metabolite record of its own — say so plainly rather
      // than opening an empty panel.
      openModal(h('div', { class: 'met-popup' }, [
        h('h2', { text: productName }),
        h('p', { class: 'muted', text:
          'This product of ' + parentDrug.name + ' has no metabolite record in this database. ' +
          'That usually means it is a terminal excretion product rather than something with ' +
          'pharmacology of its own — but it can also mean nobody has characterised it.' })
      ]));
      return;
    }
    var entry = DB.get(String(met.name).replace(/\s*\(.*\)\s*$/, '').trim());
    openMetaboliteChain([
      { drug: parentDrug },
      { drug: entry && entry.id !== parentDrug.id ? entry : syntheticMetaboliteDrug(parentDrug, met),
        viaMetabolite: met,
        formation: PK.formationFractionFor({ metabolism: meta }, met),
        isMetaboliteOnly: !(entry && entry.id !== parentDrug.id) }
    ]);
  }

  /**
   * The individual products a collapsed conjugate row stands for.
   *
   * The row exists so that six glucuronides do not crowd out the two active
   * metabolites beside them in the diagram. They are still real products with
   * real names that turn up on a toxicology report, so they are one click away
   * rather than deleted.
   */
  function openConjugateGroupPopup(parentDrug, prod, pathway) {
    openModal(h('div', { class: 'met-popup' }, [
      h('h2', { text: prod.name }),
      h('p', { class: 'muted small', text:
        'From ' + parentDrug.name + ' via ' + pathway.enzyme +
        (pathway.reaction ? ' (' + pathway.reaction + ')' : '') +
        (prod.fraction != null ? ', about ' + Math.round(prod.fraction * 100) + '% of the dose' : '') +
        '. One row in the diagram, ' + prod.covers.length + ' products in the body.' }),
      h('ul', { class: 'plain-list conjugate-list' }, prod.covers.map(function (name) {
        return h('li', { text: name });
      })),
      h('p', { class: 'muted small', text:
        'These are terminal excretion products: water-soluble, pharmacologically inactive, and ' +
        'cleared in urine. They matter for what shows up on a toxicology screen and for how long ' +
        'after a dose it shows up — not for how the drug feels. Where a conjugate IS active, and ' +
        'M6G is the standing example, it is listed as its own product rather than folded in here.' }),
      prod.note ? h('p', { class: 'small', text: prod.note }) : null
    ]));
  }

  /**
   * Wire the SVG pathway diagram up to the same panels the chips open.
   *
   * The diagram emits data-* attributes rather than handlers, because it is
   * built by charts.js which has no business knowing about modals.
   */
  function wirePathwayDiagram(svg, drug, metabolism) {
    if (!svg) return svg;
    Array.prototype.forEach.call(svg.querySelectorAll('.node-hit-enzyme'), function (g) {
      var names = (g.getAttribute('data-enzymes') || '').split('|').filter(Boolean);
      if (!names.length) return;
      g.classList.add('clickable-node');
      g.addEventListener('click', function () { showEnzyme(names); });
    });
    Array.prototype.forEach.call(svg.querySelectorAll('.node-hit-product'), function (g) {
      var name = g.getAttribute('data-metabolite');
      if (!name) return;
      // Deeper in the chain a product belongs to an intermediate's metabolite
      // list, not to the compound at the left of the diagram. The node says
      // whose list to consult, so a third-column box opens the right record
      // instead of "no metabolite record for this".
      var owner = DB.get(g.getAttribute('data-owner') || '') || drug;
      // On a route-specific map the root's products belong to that route's
      // metabolite list, not to the compound-level one.
      var ownerMeta = (owner === drug && metabolism) ? metabolism : null;
      g.classList.add('clickable-node');
      g.addEventListener('click', function () { openMetaboliteFromPathway(owner, name, ownerMeta); });
    });
    return svg;
  }

  /* ---------- metabolite explorer ----------------------------------------
     Every metabolite gets a detail view, active or not. Where a metabolite
     resolves to a compound that has metabolites of its own, you can drill
     into it and walk back up the chain — cycles are blocked so a compound
     never appears twice in one path.                                        */

  var metName = function (n) { return String(n).replace(/\s*\(.*\)\s*$/, '').trim(); };

  /**
   * Many entries flatten a whole cascade into one list — heroin lists 6-MAM,
   * morphine AND M6G, though morphine comes from 6-MAM and M6G from morphine.
   * Keeping them is right (all three really are in the body), but showing them
   * as equals is misleading. This finds the sibling that actually produces a
   * given metabolite, so it can be labelled as downstream rather than direct.
   */
  function indirectVia(drug, met) {
    var target = metName(met.name).toLowerCase();
    var found = null;
    (drug.metabolism.metabolites || []).forEach(function (sib) {
      if (found || metName(sib.name).toLowerCase() === target) return;
      var e = DB.get(metName(sib.name));
      if (!e || e.id === drug.id) return;
      var produces = (e.metabolism.metabolites || []).some(function (x) {
        return metName(x.name).toLowerCase() === target;
      });
      if (produces) found = sib.name;
    });
    return found;
  }

  function metaboliteRecord(parentDrug, met) {
    var entry = DB.get(String(met.name).replace(/\s*\(.*\)\s*$/, '').trim());
    var formation = PK.formationFractionFor(parentDrug, met);
    return {
      name: met.name,
      met: met,
      entry: entry && entry.id !== parentDrug.id ? entry : null,
      parent: parentDrug,
      formation: formation,
      // Only offer a drill-down when there is genuinely something below.
      hasChildren: !!(entry && entry.id !== parentDrug.id &&
                      entry.metabolism.metabolites.length)
    };
  }

  /** path: [{ drug, viaMetabolite }] — the first entry is where you started. */
  function openMetaboliteChain(path) {
    var current = path[path.length - 1];
    var d = current.drug;
    var body = h('div', { class: 'metab-explorer' });

    // Breadcrumb back up the chain.
    var crumbs = h('div', { class: 'metab-crumbs' });
    path.forEach(function (step, i) {
      if (i) crumbs.appendChild(h('span', { class: 'crumb-sep', text: '→' }));
      var last = i === path.length - 1;
      crumbs.appendChild(last
        ? h('span', { class: 'crumb current', text: step.drug.name })
        : h('button', {
            class: 'crumb', title: 'Back to ' + step.drug.name,
            onclick: function () { openMetaboliteChain(path.slice(0, i + 1)); }
          }, [step.drug.name]));
    });
    body.appendChild(crumbs);

    body.appendChild(h('h2', {}, [
      d.name,
      current.viaMetabolite
        ? h('span', { class: 'pill ' + (current.viaMetabolite.active ? 'met-active' : 'met-inactive'),
                      text: current.viaMetabolite.active ? 'active metabolite' : 'inactive metabolite' })
        : null
    ]));

    // How this compound was reached, if it is a metabolite of the step above.
    if (current.viaMetabolite) {
      var vm = current.viaMetabolite, prev = path[path.length - 2];
      var kv = h('dl', { class: 'kv wide-kv' }, [
        h('dt', { text: 'Formed from' }),
        h('dd', {}, [h('button', { class: 'link-title small',
          onclick: function () { openMetaboliteChain(path.slice(0, -1)); } }, [prev.drug.name])]),
        h('dt', { text: 'Share of that dose' }),
        h('dd', {}, [
          Math.round((current.formation ? current.formation.fraction : 0.2) * 100) + '%',
          current.formation && current.formation.inferred
            ? h('span', { class: 'flag', title: 'No pathway in the data clearly produces this metabolite, so its share is a placeholder rather than a figure from the literature.', text: ' ?' })
            : null
        ]),
        h('dt', { text: 'Half-life' }),
        h('dd', { text: vm.halfLifeH != null ? Charts.fmtDur(vm.halfLifeH) : 'not characterised' }),
        h('dt', { text: 'Potency vs parent' }),
        h('dd', { text: vm.potencyRel != null ? Potency.fmtRatio(vm.potencyRel) : '—' }),
        h('dt', { text: 'Activity' }),
        h('dd', { text: vm.active ? 'Pharmacologically active' : 'Inactive — does not contribute to effects' })
      ]);
      body.appendChild(kv);
      if (vm.note) body.appendChild(h('div', { class: 'note', text: vm.note }));
      if (vm.halfLifeH != null && prev.drug.halfLife.hours &&
          vm.halfLifeH > prev.drug.halfLife.hours * 1.2) {
        body.appendChild(h('div', { class: 'note note-warn' }, [
          h('strong', { text: 'Outlasts its parent: ' }),
          vm.name + ' has a longer half-life (' + Charts.fmtDur(vm.halfLifeH) + ') than ' +
          prev.drug.name + ' (' + Charts.fmtDur(prev.drug.halfLife.hours) + '), so it is still ' +
          'present after the parent has cleared.'
        ]));
      }
    }

    // The compound's own profile, when it exists as a full entry.
    if (!current.isMetaboliteOnly) {
      body.appendChild(h('dl', { class: 'kv wide-kv' }, [
        h('dt', { text: 'Class' }),
        h('dd', { text: d.class + (d.family ? ' / ' + d.family : '') }),
        h('dt', { text: 'Half-life' }),
        h('dd', {}, [Charts.fmtDur(d.halfLife.hours), ' ', confBadge(d.halfLife.confidence)]),
        h('dt', { text: 'Metabolised by' }),
        h('dd', { text: d.metabolism.substrateOf.join(', ') || 'not characterised' }),
        h('dt', { text: 'Excretion' }),
        h('dd', { text: d.metabolism.excretion || 'not characterised' })
      ]));
      body.appendChild(h('div', { class: 'row-actions' }, [
        h('button', {
          class: 'btn small', text: 'Open full page for ' + d.name,
          onclick: function () { closeModal(); openDrug(d.id); }
        })
      ]));
    }

    // Children: this compound's own metabolites.
    var mets = d.metabolism.metabolites || [];
    if (mets.length) {
      body.appendChild(h('h4', { text: 'Metabolites of ' + d.name }));
      var seen = {};
      path.forEach(function (s) { seen[s.drug.id] = 1; });

      var list = h('div', { class: 'metabolite-list' });
      mets.forEach(function (m) {
        var rec = metaboliteRecord(d, m);
        var cyclic = rec.entry && seen[rec.entry.id];
        var canDrill = rec.hasChildren && !cyclic;

        list.appendChild(h('div', { class: 'metabolite ' + (m.active ? 'active' : 'inactive') }, [
          h('div', { class: 'met-head' }, [
            canDrill
              ? h('button', {
                  class: 'link-title small', title: 'Explore ' + m.name + '’s own metabolites',
                  onclick: function () {
                    openMetaboliteChain(path.concat([{ drug: rec.entry, viaMetabolite: m, formation: rec.formation }]));
                  }
                }, [m.name + ' →'])
              : h('strong', { text: m.name }),
            h('span', { class: 'pill ' + (m.active ? 'met-active' : 'met-inactive'),
                        text: m.active ? 'active' : 'inactive' }),
            (function () {
              var via = indirectVia(d, m);
              return via ? h('span', { class: 'pill via-pill',
                title: 'Comes from ' + via + ' rather than directly from ' + d.name + '.',
                text: 'via ' + metName(via) }) : null;
            })(),
            m.halfLifeH != null ? h('span', { class: 'muted small', text: 't½ ' + Charts.fmtDur(m.halfLifeH) }) : null,
            m.potencyRel != null ? h('span', { class: 'muted small', text: Potency.fmtRatio(m.potencyRel) + ' vs parent' }) : null,
            cyclic ? h('span', { class: 'pill', title: 'Already earlier in this chain — not expanded, to avoid a loop.', text: 'seen above' }) : null,
            // Terminal metabolites still get their own detail view.
            !canDrill ? h('button', {
              class: 'btn tiny', text: 'Details',
              onclick: function () {
                openMetaboliteChain(path.concat([{
                  drug: rec.entry || syntheticMetaboliteDrug(d, m),
                  viaMetabolite: m,
                  formation: rec.formation,
                  isMetaboliteOnly: !rec.entry
                }]));
              }
            }) : null
          ]),
          m.note ? h('p', { class: 'met-note', text: m.note }) : null
        ]));
      });
      body.appendChild(list);
    } else {
      body.appendChild(h('p', { class: 'muted small', text:
        'No further metabolites recorded — this is the end of the chain as far as the data goes.' }));
    }

    openModal(body);
  }

  /**
   * A metabolite with no compound entry of its own still deserves a page.
   * This wraps it in a minimal drug-shaped object so the same view works.
   */
  function syntheticMetaboliteDrug(parent, met) {
    return {
      id: '__met__' + met.name,
      name: met.name,
      class: 'Metabolite',
      family: 'Metabolite of ' + parent.name,
      halfLife: { hours: met.halfLifeH || parent.halfLife.hours, confidence: 'estimated' },
      metabolism: { metabolites: [], substrateOf: [], inhibits: [], induces: [], pathways: [],
                    excretion: null, confidence: 'unknown' },
      routes: {}, tags: [], warnings: [], aliases: []
    };
  }

  /**
   * The enzyme panel, opened from a chip or from an enzyme node in the
   * pathway diagram.
   *
   * Accepts several enzymes, because a pathway row is often written
   * "CYP3A4 / CYP2C8" — one reaction that either enzyme can perform. Showing
   * only the first would hide half the interaction surface, so the panel
   * merges them and marks which enzyme each compound came from.
   */
  function showEnzyme(enzyme) {
    var names = (Array.isArray(enzyme) ? enzyme : [enzyme])
      .map(function (e) { return String(e).trim(); }).filter(Boolean);
    if (!names.length) return;

    var merged = { substrates: {}, inhibitors: {}, inducers: {} };
    names.forEach(function (n) {
      var info = DB.byEnzyme(n);
      ['substrates', 'inhibitors', 'inducers'].forEach(function (k) {
        info[k].forEach(function (dd) {
          if (!merged[k][dd.id]) merged[k][dd.id] = { drug: dd, via: [] };
          merged[k][dd.id].via.push(n);
        });
      });
    });
    var listOf = function (k) {
      return Object.keys(merged[k]).map(function (id) { return merged[k][id]; })
        .sort(function (a, b) { return a.drug.name.localeCompare(b.drug.name); });
    };
    var subs = listOf('substrates'), inhib = listOf('inhibitors'), induce = listOf('inducers');

    var blurb = names.map(function (n) { return ENZYME_NOTES[n.toUpperCase()]; })
      .filter(Boolean)[0];

    var body = h('div', { class: 'enzyme-popup' }, [
      h('h2', { text: names.join(' / ') }),
      names.length > 1 ? h('p', { class: 'muted small', text:
        'One reaction, ' + names.length + ' enzymes that can perform it. Everything below is combined across them.' }) : null,
      blurb ? h('p', { class: 'enzyme-blurb', text: blurb }) : null,
      sectionOf('Metabolised by this enzyme', subs),
      sectionOf('Inhibitors, which slow clearance of the substrates above', inhib),
      sectionOf('Inducers, which speed clearance of the substrates above', induce)
    ]);

    if (subs.length && inhib.length) {
      body.appendChild(h('div', { class: 'note note-warn' }, [
        'Combining any inhibitor with any substrate raises that substrate blood level and ' +
        'lengthens its half-life. This is applied automatically to your logged doses, so the ' +
        'Now tab already shows the adjusted half-life and the reshaped curve.'
      ]));
    }
    openModal(body);

    function sectionOf(title, rows) {
      if (!rows.length) return null;
      return h('div', { class: 'enzyme-section' }, [
        h('h4', { text: title + ' (' + rows.length + ')' }),
        h('div', { class: 'chips' }, rows.map(function (r) {
          return h('button', {
            class: 'chip clickable',
            title: names.length > 1 ? 'via ' + r.via.join(', ') : null,
            onclick: function () { closeModal(); openDrug(r.drug.id); }
          }, [
            r.drug.name,
            (names.length > 1 && r.via.length < names.length)
              ? h('span', { class: 'chip-via', text: r.via.join('/') }) : null
          ]);
        }))
      ]);
    }
  }

  // Short descriptions for the enzymes that come up most. Absent is fine —
  // the panel simply shows the compound lists without a preamble.
  var ENZYME_NOTES = {
    CYP2D6: 'Highly polymorphic. Roughly 7% of Europeans are poor metabolisers and a few percent are ultra-rapid, which changes exposure to its substrates several-fold in either direction. It also activates prodrugs such as codeine and tramadol, so losing it removes the effect rather than prolonging it.',
    CYP3A4: 'The workhorse. It handles a larger share of clinically used drugs than any other enzyme, and it sits in the gut wall as well as the liver. That intestinal component is why grapefruit juice affects oral doses but not intravenous ones.',
    CYP2C19: 'Polymorphic, with poor metabolisers common in East Asian populations (15-20%). Clears diazepam, clobazam and the proton-pump inhibitors, several of which also inhibit it.',
    CYP1A2: 'Induced strongly by tobacco smoke, by the combustion products rather than the nicotine, so smokers clear its substrates much faster and stopping abruptly can push levels into toxicity. Handles caffeine, olanzapine, clozapine and melatonin.',
    CYP2B6: 'Clears methadone, bupropion and ketamine. Its poor-metaboliser genotype accumulates the methadone enantiomer responsible for QT prolongation.',
    CYP2E1: 'Induced by chronic alcohol. That induction is what turns an ordinary paracetamol dose hepatotoxic in a heavy drinker, by diverting more of it toward the reactive NAPQI metabolite.',
    CYP2C9: 'Polymorphic; clears the NSAIDs, phenytoin and warfarin. Poor metabolisers bleed more easily on the same warfarin dose.',
    UGT2B7: 'A phase II conjugating enzyme rather than an oxidising one. It attaches glucuronic acid, usually inactivating the drug, but not always: morphine-6-glucuronide is more potent than morphine itself.',
    UGT1A4: 'Phase II conjugation. Its substrates avoid most CYP interactions, which is often the reason they are chosen.',
    UGT2B15: 'Conjugates lorazepam and oxazepam. Its slow variant raises exposure by around 40%, and it is one of very few phase II polymorphisms with a clear clinical signal.',
    CES1: 'A carboxylesterase. It cleaves ester bonds very fast, in blood and liver, and is responsible for heroin becoming 6-MAM and methylphenidate becoming ritalinic acid.',
    NAT2: 'Acetylates amine metabolites. Roughly half of Europeans are slow acetylators, which lengthens the tail of nitro-benzodiazepine metabolites.',
    MAO: 'Monoamine oxidase breaks down serotonin, dopamine and noradrenaline. Inhibiting it is the mechanism behind the most reliably lethal interactions in this database.',
    SUOX: 'Sulfite oxidase. Low activity is the leading explanation for sulfite sensitivity in asthmatics.',
    ALDH2: 'Aldehyde dehydrogenase. Its inactive variant, carried by around 40% of people of East Asian descent, causes the alcohol flushing reaction by letting acetaldehyde accumulate.'
  };

  /* ---------- isomers ------------------------------------------------------ */

  var ISOMER_TYPE_LABEL = {
    enantiomers: 'Enantiomers (mirror images)',
    positional: 'Positional isomers (same atoms, different placement)',
    'double-bond': 'Double-bond isomers',
    epimers: 'Epimers (differ at one centre)',
    diastereomers: 'Stereoisomers',
    isomers: 'Isomers'
  };

  var ISOMER_ACTIVITY = {
    primary:      ['Active', 'Carries most or all of the effect.'],
    secondary:    ['Partly active', 'Contributes, but is not the main actor.'],
    minor:        ['Weakly active', 'Little contribution at normal doses.'],
    inactive:     ['Inactive', 'No meaningful activity.'],
    prodrug:      ['Prodrug', 'Inactive itself, but converted to the active form in the body.'],
    antagonistic: ['Interferes', 'Actively reduces the effect of the other isomer.'],
    harmful:      ['Harmful', 'Carries a specific risk the other isomers do not.']
  };

  function renderIsomers(d) {
    var iso = d.isomers;
    // Title and isomer-type chip live on the collapsible section header.
    var sec = h('section', {});
    if (iso.note) sec.appendChild(h('p', { class: 'small', text: iso.note }));

    var list = h('div', { class: 'isomer-list' });
    iso.forms.forEach(function (f) {
      var act = ISOMER_ACTIVITY[f.activity] || ISOMER_ACTIVITY.secondary;
      var entry = f.drugId ? DB.get(f.drugId) : null;
      // isomers.js cannot inherit a linked compound's CAS at load time, since
      // it runs before identifiers.js. Resolve that here, where everything is
      // loaded, rather than reordering the script tags.
      var cas = f.cas || (entry && entry.cas) || null;
      list.appendChild(h('div', { class: 'isomer iso-' + (f.activity || 'secondary') }, [
        h('div', { class: 'iso-head' }, [
          entry && entry.id !== d.id
            ? h('button', { class: 'link-title small', onclick: function () { openDrug(entry.id); } }, [f.name])
            : h('strong', { text: f.name }),
          h('span', { class: 'pill iso-pill-' + (f.activity || 'secondary'), title: act[1], text: act[0] }),
          f.share != null ? h('span', { class: 'muted small', text: Math.round(f.share * 100) + '% of the racemate' }) : null,
          // Enantiomers share a molecular formula and often a trivial name, so
          // the registry number is frequently the only unambiguous identifier.
          cas
            ? h('span', { class: 'iso-cas', title: 'CAS registry number for this specific isomer', text: 'CAS ' + cas })
            : h('span', { class: 'iso-cas iso-cas-missing', title:
                'No CAS registry number recorded for this individual isomer. Many isomers have one; this database does not have it.', text: 'CAS —' })
        ]),
        f.note ? h('p', { class: 'met-note', text: f.note }) : null
      ]));
    });
    sec.appendChild(list);
    return sec;
  }

  /* ---------- potency section --------------------------------------------- */

  /**
   * Relative strength.
   *
   * Previously this charted every compound in the drug's class — forty opioids
   * on one log axis. That answers no question anybody asked and buries the one
   * comparison that matters. The default is now exactly two entries: this
   * compound and the standard reference for its class (morphine for opioids,
   * diazepam for benzodiazepines). Anything else is added deliberately.
   */
  function renderPotency(d) {
    var ref = state.compareRef ? DB.get(state.compareRef) : Potency.referenceFor(d);
    var sec = h('section', {});

    if (!ref) {
      sec.appendChild(h('p', { class: 'muted', text: 'No comparable compounds in the database.' }));
      return sec;
    }

    var scale = Potency.scaleFor(d);
    var rel = Potency.relative(d, ref);

    sec.appendChild(h('div', { class: 'potency-head' }, [
      h('div', { class: 'potency-headline' }, [
        h('span', { class: 'big-ratio', text: rel ? Potency.fmtRatio(rel.ratio) : '—' }),
        h('span', {}, [' as potent as ', h('strong', { text: ref.name }),
          rel && rel.basis === 'dose-ratio' ? ' by typical dose' : (scale ? ' (' + scale.name + ')' : '')])
      ]),
      rel ? confBadge(rel.confidence) : null
    ]));

    if (rel && rel.note) sec.appendChild(h('p', { class: 'muted small', text: rel.note }));

    // The compound, its reference, and whatever the user has added.
    var shown = [d, ref];
    (state.compareAdded || []).forEach(function (id) {
      var extra = DB.get(id);
      if (extra && !shown.some(function (x) { return x.id === extra.id; })) shown.push(extra);
    });

    var ranked = Potency.rank(shown, ref);
    if (ranked.length > 1) {
      ranked.forEach(function (r) { r.highlight = (r.drug.id === d.id); });
      sec.appendChild(h('div', { class: 'chart-wrap' }, [
        Charts.potencyChart({
          items: ranked.map(function (r) {
            return {
              label: r.drug.name, value: r.ratio, confidence: r.confidence,
              highlight: r.highlight, commonDoseMg: r.commonDoseMg
            };
          }),
          valueFormat: function (it) {
            return Potency.fmtRatio(it.value) + (it.commonDoseMg ? '  ·  ' + Potency.fmtMg(it.commonDoseMg) : '');
          }
        })
      ]));
    }

    // ---- add a compound to compare ----
    var addWrap = h('div', { class: 'compare-add' });
    var input = h('input', { type: 'text', autocomplete: 'off', placeholder: 'Add a compound to compare…' });
    var results = h('div', { class: 'autocomplete' });
    input.addEventListener('input', function () {
      var q = input.value.trim();
      results.innerHTML = '';
      if (!q) { results.classList.remove('open'); return; }
      var matches = DB.search(q, 8).filter(function (m) {
        return m.id !== d.id && !(state.compareAdded || []).some(function (x) { return x === m.id; });
      });
      results.classList.toggle('open', matches.length > 0);
      matches.forEach(function (m) {
        results.appendChild(h('button', {
          type: 'button', class: 'ac-item',
          onclick: function () {
            state.compareAdded = (state.compareAdded || []).concat([m.id]);
            render();
          }
        }, [h('span', { class: 'ac-name', text: m.name }), h('span', { class: 'ac-class', text: m.class })]));
      });
    });
    addWrap.appendChild(h('div', { class: 'ac-wrap' }, [input, results]));

    // Chips for anything added, so it can be taken back out.
    if ((state.compareAdded || []).length) {
      addWrap.appendChild(h('div', { class: 'chips' }, state.compareAdded.map(function (id) {
        var x = DB.get(id);
        return h('button', {
          class: 'chip clickable', title: 'Remove from the comparison',
          onclick: function () {
            state.compareAdded = state.compareAdded.filter(function (y) { return y !== id; });
            render();
          }
        }, [(x ? x.name : id) + ' ×']);
      })));
    }
    sec.appendChild(addWrap);

    // ---- reference picker ----
    var picker = h('select', { onchange: function (e) { state.compareRef = e.target.value; render(); } });
    Potency.peersOf(d).concat([ref]).filter(function (p, i, arr) {
      return arr.findIndex(function (q) { return q.id === p.id; }) === i;
    }).sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (p) {
      picker.appendChild(h('option', { value: p.id, text: p.name, selected: p.id === ref.id ? 'selected' : null }));
    });
    sec.appendChild(h('div', { class: 'inline-field' }, [h('label', { text: 'Compare against' }), picker]));

    sec.appendChild(h('p', { class: 'muted small', text:
      'Log scale, relative to ' + ref.name + '. Solid bars use an established clinical equivalence scale; ' +
      'dashed outlines are estimates derived from typical dose sizes. Potency means HOW FEW MILLIGRAMS ARE ' +
      'NEEDED — it is not a measure of how strong, dangerous or desirable the effect is. A partial agonist ' +
      'like buprenorphine is highly potent and still has a ceiling on its maximum effect.' }));

    return sec;
  }

  /* ======================================================================
     TAB: SOLUTION CALCULATOR
     ====================================================================== */

  /**
   * A collapsible section. `key` remembers open/closed state across re-renders,
   * which matters because every edit to an ingredient re-renders the whole tab.
   */
  function section(key, title, opts) {
    opts = opts || {};
    var open = state.sectionOpen[key] != null ? state.sectionOpen[key] : (opts.open !== false);
    var body = h('div', { class: 'sec-body' });
    if (!open) body.setAttribute('hidden', 'hidden');

    var head = h('button', {
      class: 'sec-head', 'aria-expanded': open ? 'true' : 'false',
      onclick: function () {
        var nowOpen = body.hasAttribute('hidden');
        state.sectionOpen[key] = nowOpen;
        if (nowOpen) body.removeAttribute('hidden'); else body.setAttribute('hidden', 'hidden');
        head.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
        head.querySelector('.caret').textContent = nowOpen ? '▾' : '▸';
      }
    }, [
      h('span', { class: 'caret', text: open ? '▾' : '▸' }),
      h('span', { class: 'sec-title', text: title }),
      opts.count != null ? h('span', { class: 'sec-count', text: String(opts.count) }) : null,
      opts.badge || null
    ]);

    return { head: head, body: body, el: h('div', { class: 'sec' }, [head, body]) };
  }

  // One list holds both actives and solvents; each carries a mass. The
  // solution's volume follows from the solvent masses and their densities.
  // Built from a factory rather than written inline, so the Reset button and
  // the initial state cannot drift apart.
  function defaultSolutionState() {
    return {
      items: [{ kind: 'solvent', solventId: 'water', amount: 100, unit: 'g' }],
      doseMl: 1,
      doseUnit: 'ml',
      // A dry mixture is the same arithmetic measured by mass instead of
      // volume: no solvent, portions weighed rather than drawn up.
      dry: false,
      doseMassMg: 100,
      doseMassUnit: 'mg',
      compositionBasis: 'mass'
    };
  }
  var WORKING_KEY = 'drug-info.solution.working.v1';

  /**
   * The mixture being worked on, kept across reloads.
   *
   * It used to live only in memory, so a refresh — or following a link and
   * coming back — silently discarded a recipe someone had just weighed out
   * ingredient by ingredient. "Saved solutions" is a deliberate act of
   * naming and filing something; not losing your work is not the same thing
   * and should not have to be asked for.
   */
  function loadWorkingSolution() {
    try {
      var raw = localStorage.getItem(WORKING_KEY);
      if (!raw) return defaultSolutionState();
      var v = JSON.parse(raw);
      if (!v || !Array.isArray(v.items)) return defaultSolutionState();
      var base = defaultSolutionState();
      Object.keys(base).forEach(function (k) { if (v[k] !== undefined) base[k] = v[k]; });
      return base;
    } catch (e) { return defaultSolutionState(); }
  }

  function persistWorkingSolution() {
    try { localStorage.setItem(WORKING_KEY, JSON.stringify(solutionState)); } catch (e) { /* no storage */ }
  }

  var solutionState = loadWorkingSolution();

  /** One place builds the options, so no caller can forget the mode. */
  function solutionOpts() {
    return {
      dry: solutionState.dry,
      doseMl: solutionState.doseMl,
      doseMassMg: solutionState.doseMassMg
    };
  }

  /**
   * Switch between a solution and a dry mixture.
   *
   * The solvent goes when the mixture does. Leaving 100 g of water sitting in
   * a powder makes the ingredient list read as nonsense, and coming back to a
   * solution with no solvent at all leaves nothing to dissolve into — so each
   * mode arrives in a state that makes sense on its own. Actives and fillers
   * are never touched, because those are the work.
   */
  function setSolutionDry(dry) {
    if (solutionState.dry === dry) return;
    solutionState.dry = dry;
    if (dry) {
      solutionState.items = solutionState.items.filter(function (i) { return i.kind !== 'solvent'; });
    } else if (!solutionState.items.some(function (i) { return i.kind === 'solvent'; })) {
      solutionState.items.unshift({ kind: 'solvent', solventId: 'water', amount: 100, unit: 'g' });
    }
    render();
  }

  /**
   * Back to an empty bottle of water.
   *
   * Confirmed first: a mixture is twenty minutes of arithmetic and this button
   * lives beside "Copy plain text", which does nothing at all. Saved recipes
   * are deliberately untouched — this resets the working mixture, not the
   * library.
   */
  function resetSolution() {
    var n = solutionState.items.length;
    var hasWork = n > 1 || (n === 1 && solutionState.items[0].kind !== 'solvent');
    if (hasWork && !confirm((solutionState.dry
          ? 'Clear the dry mixture?\n\n'
          : 'Reset the mixture to the default 100 g of water?\n\n') +
        n + ' ingredient' + (n === 1 ? '' : 's') + ' will be discarded. Saved solutions are not affected.')) {
      return;
    }
    var wasDry = solutionState.dry;
    solutionState = defaultSolutionState();
    try { localStorage.removeItem(WORKING_KEY); } catch (e) { /* no storage */ }
    // Reset the mixture, not the mode: someone working on a powder who hits
    // reset wants an empty powder, not to be moved back to liquids.
    if (wasDry) {
      solutionState.dry = true;
      solutionState.items = [];
    }
    render();
  }

  /** Clipboard copy with a graceful fallback for file:// pages. */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        UI.toast('Report copied to the clipboard.', { kind: 'ok' });
      }, function () { fallback(); });
    } else { fallback(); }

    function fallback() {
      // execCommand is deprecated but is the only thing that works on a
      // file:// page, which is how this app is usually opened.
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      UI.toast(ok ? 'Report copied to the clipboard.'
                  : 'Could not copy automatically — the report is shown so you can copy it by hand.',
        { kind: ok ? 'ok' : 'warn', timeout: ok ? 3000 : 6000 });
      if (!ok) openModal(h('div', {}, [h('h2', { text: 'Plain-text report' }), h('pre', { text: text })]));
    }
  }

  /**
   * Adding an ingredient, as a popup.
   *
   * Building a mixture is a burst of activity followed by a long time reading
   * the result. An entry form that lives on the page — even a collapsed one —
   * spends most of its life pushing the composition and the safety checks
   * down, so the fields only exist while something is actually being added.
   */
  function openAddIngredientPopup(addedSoFar) {
    // What this popup has already added in this sitting, so it can say so
    // without the user having to close it and count the list. Guarded because
    // the function is also wired straight to onclick, which would otherwise
    // hand it a PointerEvent.
    var added = Array.isArray(addedSoFar) ? addedSoFar : [];

    var drugInput = h('input', {
      type: 'text', autocomplete: 'off',
      placeholder: 'Search actives, solvents or fillers…'
    });
    var results = h('div', { class: 'autocomplete' });
    var pendingDrug = { id: null, kind: null };
    var routeSel = h('select', {});
    var amountInput = h('input', { type: 'number', step: 'any', min: '0', placeholder: '0' });
    var amountLabel = h('label', { text: 'Amount' });
    var molHint = h('div', { class: 'mol-hint muted small' });
    var molPreview = h('span', { class: 'mol-preview' });
    // Route is not asked for per ingredient — a solution has one route, chosen
    // when you take it. Each substance's default route is used.
    var routeField = h('div', { class: 'field', style: 'display:none' }, [routeSel]);
    var unitSel = h('select', {}, ['µg', 'mg', 'g'].map(function (u) {
      return h('option', { value: u, text: u, selected: u === 'mg' ? 'selected' : null });
    }));

    var MOLAR_UNITS = ['mol', 'mmol', 'µmol'];
    var MOLAR_TO_MOL = { mol: 1, mmol: 1e-3, 'µmol': 1e-6 };

    function updateMolPreview() {
      molPreview.textContent = '';
      var amt = parseFloat(amountInput.value);
      if (!(amt > 0)) return;
      if (MOLAR_TO_MOL[unitSel.value] == null) return;
      var dd = pendingDrug.kind === 'drug' ? DB.get(pendingDrug.id) : null;
      var mm = dd ? Solution.molarMass(dd.formula) : null;
      if (!mm) return;
      molPreview.textContent = '= ' + Potency.fmtMg(mm * amt * MOLAR_TO_MOL[unitSel.value] * 1000);
    }

    // Molar units are offered only when the compound has a determinate formula
    // — a polymer or a flavour blend has no molar mass, and offering "mol" for
    // it would invite a meaningless number.
    function setMode(kind, drug) {
      var isSolvent = kind === 'solvent';
      amountLabel.textContent = isSolvent ? 'Amount (weight or volume)' : 'Amount (mass or moles)';
      var mm = (!isSolvent && drug) ? Solution.molarMass(drug.formula) : null;
      var units = isSolvent
        ? Solution.MASS_UNITS.concat(Solution.VOLUME_UNITS)
        : Solution.MASS_UNITS.concat(mm ? MOLAR_UNITS : []);
      var keep = unitSel.value;
      unitSel.innerHTML = '';
      units.forEach(function (u) { unitSel.appendChild(h('option', { value: u, text: u })); });
      unitSel.value = units.indexOf(keep) >= 0 ? keep : (isSolvent ? 'ml' : 'mg');

      molHint.innerHTML = '';
      if (mm) {
        molHint.appendChild(h('span', { text:
          drug.name + ' · M = ' + mm.toFixed(2) + ' g/mol' + (drug.formula ? ' (' + drug.formula + ')' : '') +
          ' — 1 mol = ' + Potency.fmtMg(mm * 1000) }));
      } else if (!isSolvent && drug) {
        molHint.appendChild(h('span', { text:
          'No determinate molar mass for ' + drug.name + ', so it can only be added by weight.' }));
      }
      updateMolPreview();
    }
    amountInput.addEventListener('input', updateMolPreview);
    unitSel.addEventListener('change', updateMolPreview);
    setMode(null);

    drugInput.addEventListener('input', function () {
      var q = drugInput.value.trim();
      results.innerHTML = ''; pendingDrug.id = null; pendingDrug.kind = null;
      setMode(null);
      if (!q) { results.classList.remove('open'); return; }

      // One search covers actives, fillers and solvents alike.
      var solvents = Solution.searchSolvents(q, 4);
      var matches = DB.search(q, Math.max(2, 8 - solvents.length));
      results.classList.toggle('open', (solvents.length + matches.length) > 0);

      solvents.forEach(function (sv) {
        results.appendChild(h('button', {
          type: 'button', class: 'ac-item',
          onclick: function () {
            drugInput.value = sv.name;
            pendingDrug.id = sv.id; pendingDrug.kind = 'solvent';
            results.classList.remove('open');
            setMode('solvent');
            if (!amountInput.value) { amountInput.value = '50'; unitSel.value = 'ml'; }
          }
        }, [
          h('span', { class: 'ac-name', text: sv.name }),
          h('span', { class: 'ac-class', text: 'solvent' }),
          sv.neverIngest ? h('span', { class: 'badge conf-anecdotal', text: 'toxic' }) : null
        ]));
      });

      matches.forEach(function (dd) {
        results.appendChild(h('button', {
          type: 'button', class: 'ac-item',
          onclick: function () {
            drugInput.value = dd.name;
            pendingDrug.id = dd.id; pendingDrug.kind = 'drug';
            results.classList.remove('open');
            setMode('drug', dd);
            routeSel.innerHTML = '';
            Object.keys(dd.routes).forEach(function (r) {
              routeSel.appendChild(h('option', { value: r, text: r }));
            });
          }
        }, [h('span', { class: 'ac-name', text: dd.name }), h('span', { class: 'ac-class', text: dd.class })]));
      });
    });

    /**
     * Add, then stay put for the next one.
     *
     * A mixture is several ingredients, and closing the popup after each one
     * meant reopening it, retyping into a fresh search box and losing the
     * thread of what was already in. It reopens itself instead, cleared and
     * focused, carrying a running list of what this sitting has added.
     * "Done" is the way out.
     */
    function addIngredient() {
      var amt = parseFloat(amountInput.value);
      if (!(amt > 0)) {
        UI.toast('Enter an amount.', { kind: 'warn' });
        amountInput.focus(); amountInput.select();
        return;
      }
      var label;
      if (pendingDrug.kind === 'solvent') {
        var sv = Solution.solvent(pendingDrug.id);
        solutionState.items.push({
          kind: 'solvent', solventId: pendingDrug.id, amount: amt, unit: unitSel.value
        });
        label = (sv ? sv.name : pendingDrug.id) + ' \u2014 ' + amt + ' ' + unitSel.value;
      } else {
        var dd = DB.get(pendingDrug.id || drugInput.value);
        if (!dd) {
          UI.toast('Pick an ingredient from the suggestions.', { kind: 'warn' });
          drugInput.focus(); drugInput.select();
          return;
        }
        var unit = unitSel.value, amount = amt;
        // Moles convert to grams on the way in, so everything downstream deals
        // in mass only and the stored recipe stays unambiguous. The original
        // molar figure is kept for display.
        if (MOLAR_TO_MOL[unit] != null) {
          var mm = Solution.molarMass(dd.formula);
          if (!mm) {
            UI.toast('No molar mass is known for ' + dd.name + ' — add it by weight instead.',
              { kind: 'warn', timeout: 6000 });
            return;
          }
          amount = mm * amt * MOLAR_TO_MOL[unit];
          unit = 'g';
        }
        solutionState.items.push({
          kind: 'active', drugId: dd.id, amount: amount, unit: unit,
          route: routeSel.value || Object.keys(dd.routes)[0],
          enteredAs: MOLAR_TO_MOL[unitSel.value] != null ? { amount: amt, unit: unitSel.value } : null
        });
        label = dd.name + ' \u2014 ' + amt + ' ' + unitSel.value;
      }
      // Repaint the tab underneath so the figures are current the moment the
      // popup is dismissed, then reopen a blank form on top of it.
      render();
      openAddIngredientPopup(added.concat([label]));
    }

    var form = h('div', { class: 'log-form' }, [
      h('div', { class: 'field wide' }, [
        h('label', { text: 'Ingredient — active, solvent or filler' }),
        h('div', { class: 'ac-wrap' }, [drugInput, results])
      ]),
      routeField,
      h('div', { class: 'field' }, [
        amountLabel,
        h('div', { class: 'inline' }, [amountInput, unitSel, molPreview])
      ]),
      h('div', { class: 'field wide' }, [molHint])
    ]);

    openModal(h('div', { class: 'add-ingredient-popup' }, [
      h('h2', { text: 'Add an ingredient' }),
      h('p', { class: 'muted small', text:
        'Everything goes in the same way — there is no separate step for solvents. ' +
        'Actives can be added by weight or, where the formula is determinate, by moles. ' +
        'The form stays open after each one, so a mixture goes in without reopening it.' }),
      added.length ? h('div', { class: 'added-so-far' }, [
        h('span', { class: 'added-label', text: 'Added just now' }),
        h('ul', { class: 'plain-list' }, added.map(function (t) { return h('li', { text: t }); }))
      ]) : null,
      form,
      h('div', { class: 'row-actions' }, [
        h('button', { class: 'btn primary', text: 'Add and keep going', onclick: addIngredient }),
        h('button', { class: 'btn', text: 'View ingredients', onclick: openIngredientsPopup }),
        h('button', { class: 'btn', text: added.length ? 'Done' : 'Cancel', onclick: closeModal })
      ])
    ]));
    drugInput.focus();
  }

  /**
   * The ingredient list, as a popup rather than a permanent panel.
   *
   * Once a recipe is built, the thing you come back to read is the composition
   * and the checks — not the list of what you typed. This popup is therefore
   * the only place the per-ingredient breakdown lives: what was entered, what
   * it works out as, and every figure derived from it. Clicking a name opens
   * an editor for that one ingredient, which returns here when it is saved.
   */
  function openIngredientsPopup() {
    var res = Solution.compute(solutionState.items, solutionOpts());
    var body = h('div', { class: 'ingredients-popup' }, [
      h('h2', { text: 'Ingredients in this mixture' }),
      h('p', { class: 'muted small', text: solutionState.items.length
        ? 'Click a name to change its amount or open its substance page. Hovering points at its slice in the composition chart.'
        : 'Nothing added yet.' })
    ]);

    if (solutionState.items.length) {
      /* ---- a wrapping list, not a nine-column table ------------------------
         Every derived figure belongs here, and eight of them side by side in a
         table meant the popup scrolled sideways: the concentration sat off the
         right edge of a 900px modal and you read the list by dragging it. The
         same figures wrap onto new lines instead, one block per ingredient, so
         nothing is off-screen and nothing is clipped.

         The share that makes these add up to 100% — and the one that matches
         the slice the row lights up in the composition chart — is the share of
         the whole mixture, solvent included. (`row.massFraction` is a share of
         the solids only, which is the right denominator for the solids-only
         table in the text report and the wrong one here.) Concentration is
         mass per ml of finished solution, which a solvent has as much as a
         solute does. */
      var systemMassMg = res.totalSystemMassG * 1000;

      // A potent active is a rounding error by mass and still the point of the
      // mixture, so precision scales rather than printing "0.0%".
      var fmtPct = function (pct) {
        if (pct == null || !isFinite(pct)) return '—';
        return (pct >= 10 ? pct.toFixed(1)
              : pct >= 1 ? pct.toFixed(2)
              : pct >= 0.01 ? pct.toFixed(3)
              : pct.toPrecision(2)) + '%';
      };
      var pctOfMixture = function (massMg) {
        return systemMassMg > 0 ? fmtPct(massMg / systemMassMg * 100) : '—';
      };
      var pctOfVolume = function (ml) {
        return (res.volumeMl > 0 && ml != null) ? fmtPct(ml / res.volumeMl * 100) : '—';
      };

      var list = h('div', { class: 'ing-list' });

      solutionState.items.forEach(function (item, i) {
        var isSolvent = item.kind === 'solvent';
        var name, detail, figs, inactive = false;

        if (isSolvent) {
          var sv = Solution.solvent(item.solventId);
          var comp = res.blend.byId[sv.id];
          name = sv.name + (sv.neverIngest ? ' (toxic)' : '');
          // Written out in full. This line carries the volume the solvent
          // works out to, and clamping it to two lines hid exactly that on
          // any solvent whose note ran long.
          detail = comp
            ? (Solution.isVolumeUnit(item.unit)
                ? item.amount + ' ' + item.unit + ' = ' + comp.massG.toFixed(2) + ' g'
                : item.amount + ' ' + item.unit + ' = ' + comp.volumeMl.toFixed(2) + ' ml') +
              ' · ' + (comp.fraction * 100).toFixed(1) + '% of the solvent volume · ' + sv.note
            : item.amount + ' ' + item.unit;
          // A solvent carries every figure here except a share of the ACTIVE
          // mass, which is a potency question it takes no part in, and what a
          // dose contains of it is a volume rather than a milligram figure.
          figs = comp
            ? [
                ['Total', Potency.fmtMg(comp.massG * 1000)],
                ['% volume', pctOfVolume(comp.volumeMl)],
                ['% of mixture', pctOfMixture(comp.massG * 1000)],
                ['% of active mass', '—'],
                ['Concentration', Potency.fmtConc(res.volumeMl > 0 ? comp.massG * 1000 / res.volumeMl : null)],
                ['Per dose', (res.doseMl * comp.fraction).toFixed(3) + ' ml']
              ]
            : [['Total', '—']];
        } else {
          var dd = DB.get(item.drugId);
          name = dd ? dd.name : item.drugId;
          var row = null;
          res.rows.forEach(function (r) { if (r.drugId === item.drugId) row = r; });
          inactive = !!(row && row.inactive);
          var bits = [item.amount + ' ' + item.unit + ' as entered'];
          if (item.enteredAs) bits.push('entered as ' + item.enteredAs.amount + ' ' + item.enteredAs.unit);
          if (row && row.volumeMl != null) {
            bits.push('occupies ' + row.volumeMl.toFixed(row.volumeMl < 1 ? 3 : 2) + ' ml dissolved' +
              (row.densityAssumed ? ' (density assumed)' : ''));
          }
          if (dd && dd.mechanism) bits.push(dd.mechanism);
          detail = bits.join(' · ');
          figs = row
            ? [
                ['Total', Potency.fmtMg(row.totalMg)],
                ['% volume', pctOfVolume(row.volumeMl)],
                ['% of mixture', pctOfMixture(row.totalMg)],
                ['% of active mass', row.activeMassFraction == null
                  ? '—' : (row.activeMassFraction * 100).toFixed(1) + '%'],
                [res.dry ? 'Per gram of mix' : 'Concentration',
                 res.dry ? Potency.fmtMg(row.mgPerG) : Potency.fmtConc(row.concMgMl)],
                ['Per dose', Potency.fmtMg(row.perDoseMg)]
              ]
            : [['Total', '—']];
        }

        var pieKey = isSolvent ? ('solvent:' + item.solventId) : item.drugId;
        list.appendChild(h('div', { class: 'ing-row' + (inactive ? ' inactive-row' : '') }, [
          h('div', { class: 'ing-row-head' }, [
            h('button', {
              class: 'link-title small',
              title: 'Edit this ingredient',
              onmouseenter: function () { if (solutionState.pie) solutionState.pie.__highlight(pieKey); },
              onmouseleave: function () { if (solutionState.pie) solutionState.pie.__highlight(null); },
              onclick: function () { editIngredient(i); }
            }, [name]),
            inactive ? h('span', { class: 'pill kind-inactive', text: 'inactive' }) : null,
            h('button', {
              class: 'btn tiny danger ing-remove', text: 'Remove',
              onclick: function () { solutionState.items.splice(i, 1); render(); openIngredientsPopup(); }
            })
          ]),
          detail ? h('div', { class: 'ing-detail muted small', text: detail }) : null,
          // Each label and its value are one grid cell, not two. As separate
          // grid items they flowed left to right across the columns, so
          // "Total" ended up sitting beside "% volume"'s number rather than
          // above its own.
          h('dl', { class: 'ing-figs' }, figs.map(function (f) {
            return h('div', { class: 'ing-fig' }, [
              h('dt', { text: f[0] }),
              h('dd', { text: f[1] })
            ]);
          }))
        ]));
      });

      body.appendChild(list);
      body.appendChild(h('p', { class: 'muted small', text:
        '"% volume" is the share of the finished liquid — solvents by their own volume, dissolved ' +
        'solids by the space they occupy, estimated from density. "% of mixture" is the share by ' +
        'mass of everything in the container, solvent included, and is the same figure as that ' +
        'ingredient’s slice in the composition chart. "% of active mass" counts only the actives ' +
        'you weigh out, ignoring fillers and solvent, and is what determines potency. Concentration ' +
        'is mass per ml of finished solution.' }));
    }

    body.appendChild(h('div', { class: 'row-actions' }, [
      h('button', { class: 'btn primary', text: '+ Add ingredient', onclick: openAddIngredientPopup })
    ]));
    openModal(body);
  }

  /**
   * Edit one ingredient's amount and units. Saving, removing or backing out
   * all return to the ingredient list this was opened from — an edit is one
   * step inside that list, not a separate errand that dumps you on the page.
   */
  function editIngredient(index) {
    var item = solutionState.items[index];
    if (!item) return;
    var isSolvent = item.kind === 'solvent';
    var drug = isSolvent ? null : DB.get(item.drugId);
    var sv = isSolvent ? Solution.solvent(item.solventId) : null;

    var amountIn = h('input', { type: 'number', step: 'any', min: '0', value: item.amount });
    var units = isSolvent
      ? Solution.MASS_UNITS.concat(Solution.VOLUME_UNITS)
      : Solution.MASS_UNITS;
    var unitIn = h('select', {}, units.map(function (u) {
      return h('option', { value: u, text: u, selected: item.unit === u ? 'selected' : null });
    }));

    var body = h('div', { class: 'ingredient-editor' }, [
      h('h2', { text: isSolvent ? sv.name : (drug ? drug.name : item.drugId) }),
      isSolvent
        ? h('p', { class: 'muted small', text: sv.note })
        : (drug ? h('p', { class: 'muted small', text: drug.mechanism }) : null),
      h('div', { class: 'log-form' }, [
        h('div', { class: 'field' }, [
          h('label', { text: 'Amount' }),
          h('div', { class: 'inline' }, [amountIn, unitIn])
        ])
      ]),
      h('div', { class: 'row-actions' }, [
        h('button', {
          class: 'btn primary', text: 'Save change',
          onclick: function () {
            var v = parseFloat(amountIn.value);
            if (!(v > 0)) {
              UI.toast('Enter an amount.', { kind: 'warn' });
              amountIn.focus(); amountIn.select();
              return;
            }
            solutionState.items[index].amount = v;
            solutionState.items[index].unit = unitIn.value;
            // The stored mass no longer matches whatever molar figure it was
            // entered as, so drop that annotation.
            solutionState.items[index].enteredAs = null;
            render();
            openIngredientsPopup();
          }
        }),
        h('button', {
          class: 'btn small', text: '‹ Back to ingredients',
          onclick: openIngredientsPopup
        }),
        (!isSolvent && drug) ? h('button', {
          class: 'btn small', text: 'Open substance page',
          onclick: function () { closeModal(); openDrug(drug.id); }
        }) : null,
        h('button', {
          class: 'btn small danger', text: 'Remove from mixture',
          onclick: function () {
            solutionState.items.splice(index, 1);
            render();
            openIngredientsPopup();
          }
        })
      ])
    ]);
    openModal(body);
  }

  /* ---------- saved solutions ----------------------------------------------
     A worked-out mixture is real effort — masses, solvent ratios, a dose
     volume that divides evenly. Losing it on a refresh is the difference
     between a tool and a scratchpad. Saved recipes live in localStorage with
     the dose log, so they never leave the machine, which also means clearing
     site data deletes them: hence export.
     ------------------------------------------------------------------------ */

  var SOLUTION_KEY = 'drug-info.solutions.v1';

  function loadSolutions() {
    try {
      var raw = localStorage.getItem(SOLUTION_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveSolutions(list) {
    localStorage.setItem(SOLUTION_KEY, JSON.stringify(list));
    return list;
  }

  /**
   * Name and save the current mixture.
   *
   * Asked with `prompt()` until it turned out that is not a thing everywhere:
   * embedded browsers and some webviews block it outright, and the button did
   * nothing but throw. The app builds modals for everything else, so this uses
   * one too — which also lets it show what is being saved and warn before an
   * overwrite, neither of which a prompt can do.
   */
  function saveCurrentSolution() {
    var list = loadSolutions();
    var input = h('input', {
      type: 'text', class: 'solution-name-input',
      value: 'Mixture ' + new Date().toLocaleDateString(),
      placeholder: 'Name this mixture'
    });
    var clash = h('p', { class: 'small muted' });

    function commit() {
      var name = String(input.value || '').trim();
      if (!name) { input.focus(); return; }
      var entry = {
        id: 's' + Date.now().toString(36),
        name: name,
        savedAt: new Date().toISOString(),
        doseMl: solutionState.doseMl,
        // Without these a dry mixture reloads as a solution with no solvent,
        // and every per-dose figure in it changes meaning.
        dry: !!solutionState.dry,
        doseMassMg: solutionState.doseMassMg,
        items: JSON.parse(JSON.stringify(solutionState.items))
      };
      // Overwrite a recipe of the same name rather than accumulating duplicates.
      var existing = -1;
      list.forEach(function (x, i) { if (x.name === name) existing = i; });
      if (existing >= 0) list[existing] = entry; else list.push(entry);
      saveSolutions(list);
      closeModal();
      render();
    }

    function checkClash() {
      var name = String(input.value || '').trim();
      var hit = list.some(function (x) { return x.name === name; });
      clash.textContent = hit ? 'A saved mixture already has this name — saving replaces it.' : '';
    }
    input.addEventListener('input', checkClash);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') commit(); });

    var body = h('div', { class: 'settings' }, [
      h('h2', { text: 'Save mixture' }),
      h('p', { class: 'muted small', text:
        solutionState.items.length + ' ingredient' + (solutionState.items.length === 1 ? '' : 's') +
        ', ' + (solutionState.dry
          ? Potency.fmtMg(solutionState.doseMassMg) + ' per weighed portion'
          : solutionState.doseMl + ' ml per dose') +
        '. Saved in this browser only.' }),
      h('div', { class: 'field' }, [h('label', { text: 'Name' }), input]),
      clash,
      h('div', { class: 'row-actions' }, [
        h('button', { class: 'btn primary', text: 'Save', onclick: commit }),
        h('button', { class: 'btn', text: 'Cancel', onclick: closeModal })
      ])
    ]);
    openModal(body);
    checkClash();
    input.focus();
    input.select();
  }

  function openSolutionManager() {
    var list = loadSolutions();
    var body = h('div', { class: 'solution-manager' }, [
      h('h2', { text: 'Saved solutions' }),
      h('p', { class: 'muted small', text:
        'Stored in this browser only. Clearing site data deletes them, so export anything worth keeping.' })
    ]);

    if (!list.length) {
      body.appendChild(h('div', { class: 'empty small' }, [h('p', { text: 'Nothing saved yet.' })]));
    } else {
      var tbl = h('table', { class: 'log-table' }, [
        h('thead', {}, [h('tr', {}, ['Name', 'Contents', 'Saved', '', ''].map(function (t) {
          return h('th', { text: t });
        }))])
      ]);
      var tb = h('tbody');
      list.slice().reverse().forEach(function (entry) {
        tb.appendChild(h('tr', {}, [
          h('td', { text: entry.name }),
          h('td', { text: entry.items.length + ' ingredients · ' +
            (entry.dry
              ? Potency.fmtMg(entry.doseMassMg || 100) + ' dry portion'
              : entry.doseMl + ' ml dose') }),
          h('td', { text: new Date(entry.savedAt).toLocaleDateString() }),
          h('td', {}, [h('button', {
            class: 'btn tiny', text: 'Load',
            onclick: function () {
              solutionState.items = JSON.parse(JSON.stringify(entry.items));
              solutionState.doseMl = entry.doseMl;
              // Recipes saved before dry mixtures existed have no flag, and
              // a missing flag means what it always meant: a solution.
              solutionState.dry = !!entry.dry;
              if (entry.doseMassMg > 0) solutionState.doseMassMg = entry.doseMassMg;
              closeModal(); render();
            }
          })]),
          h('td', {}, [h('button', {
            class: 'btn tiny danger', text: 'Delete',
            onclick: function () {
              saveSolutions(loadSolutions().filter(function (x) { return x.id !== entry.id; }));
              openSolutionManager();
            }
          })])
        ]));
      });
      tbl.appendChild(tb);
      body.appendChild(h('div', { class: 'table-wrap' }, [tbl]));
    }

    body.appendChild(h('div', { class: 'row-actions' }, [
      h('button', {
        class: 'btn small', text: 'Export all',
        onclick: function () {
          download('solutions.json', JSON.stringify({
            format: 'drug-info-solutions', version: 1,
            exportedAt: new Date().toISOString(), solutions: loadSolutions()
          }, null, 2), 'application/json');
        }
      }),
      h('button', {
        class: 'btn small', text: 'Export current mixture',
        onclick: function () {
          download('mixture.json', JSON.stringify({
            format: 'drug-info-solutions', version: 1,
            exportedAt: new Date().toISOString(),
            solutions: [{ name: 'Current mixture', savedAt: new Date().toISOString(),
                          doseMl: solutionState.doseMl, dry: !!solutionState.dry,
                          doseMassMg: solutionState.doseMassMg,
                          items: solutionState.items }]
          }, null, 2), 'application/json');
        }
      }),
      h('label', { class: 'btn small file' }, [
        'Import', h('input', { type: 'file', accept: '.json', onchange: onImportSolutions })
      ])
    ]));
    openModal(body);
  }

  function onImportSolutions(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var incoming = Array.isArray(data) ? data : data.solutions;
        if (!Array.isArray(incoming)) throw new Error('No solutions array found in that file.');
        var list = loadSolutions();
        var added = 0;
        incoming.forEach(function (entry) {
          if (!entry || !Array.isArray(entry.items)) return;
          entry.id = entry.id || ('s' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
          if (list.some(function (x) { return x.id === entry.id; })) return;
          list.push(entry); added++;
        });
        saveSolutions(list);
        openSolutionManager();
        UI.toast('Imported ' + added + ' solution' + (added === 1 ? '' : 's') + '.',
          { kind: added ? 'ok' : null });
      } catch (err) {
        UI.toast('Could not read that file: ' + err.message, { kind: 'danger', timeout: 6000 });
      }
    };
    reader.readAsText(file);
  }

  /**
   * The mixture checks, as one panel.
   *
   * These used to render two different ways depending on which branch of the
   * tab you were in: a single grouped banner once there was an active, and —
   * before that — one full-width box per check, each with its own identical
   * "Mixture check" heading. Three stacked boxes all called the same thing is
   * not three findings, it is one list that forgot it was a list.
   */
  function mixtureChecksEl(warnings) {
    if (!warnings || !warnings.length) return null;

    var RANK = { danger: 3, error: 3, warn: 2, info: 1 };
    var norm = function (lv) { return lv === 'error' ? 'danger' : lv; };

    var worst = warnings.reduce(function (a, w) {
      return (RANK[w.level] || 0) > (RANK[a] || 0) ? w.level : a;
    }, 'info');
    var bannerClass = norm(worst) === 'danger' ? 'danger' : worst === 'warn' ? 'warn' : 'info';

    var counts = { danger: 0, warn: 0, info: 0 };
    warnings.forEach(function (w) { counts[norm(w.level)] = (counts[norm(w.level)] || 0) + 1; });

    return h('div', { class: 'mix-banner mix-' + bannerClass }, [
      h('div', { class: 'mix-banner-head' }, [
        h('span', { class: 'mix-icon', text: bannerClass === 'info' ? 'i' : '!' }),
        h('strong', { text: warnings.length === 1 ? 'Mixture check' : 'Mixture checks' }),
        h('span', { class: 'muted small', text:
          [counts.danger ? counts.danger + ' serious' : null,
           counts.warn ? counts.warn + ' warning' + (counts.warn === 1 ? '' : 's') : null,
           counts.info ? counts.info + ' note' + (counts.info === 1 ? '' : 's') : null]
          .filter(Boolean).join(' · ') })
      ]),
      h('ul', { class: 'mix-list' }, warnings.slice()
        .sort(function (a, b) { return (RANK[b.level] || 0) - (RANK[a.level] || 0); })
        .map(function (w) {
          var lv = norm(w.level);
          return h('li', { class: 'mix-item mix-item-' + lv }, [
            h('span', { class: 'mix-tag mix-tag-' + lv, text: lv === 'danger' ? 'serious' : lv }),
            h('span', { text: w.text })
          ]);
        }))
    ]);
  }

  /**
   * The mixture itself, listed where it is being built.
   *
   * The contents used to live entirely behind a "View ingredients (1)"
   * button. The reasoning was sound — the full per-ingredient figures are
   * eight numbers apiece and stacking them inline turned the tab into a wall
   * of boxes — but the conclusion went too far: what is in the bottle is the
   * one thing the page is about, and it was the one thing you could not see.
   *
   * So the amounts are here, one line each, and the derived figures stay in
   * the popup behind "All figures".
   */
  /**
   * The colour each ingredient carries, keyed so that any part of the tab can
   * ask for it.
   *
   * The composition chart derives its colours from position in res.rows and
   * res.blend.components. Anything else that wants to mark an ingredient —
   * the list of what is in the bottle, for one — has to derive them the same
   * way or it is drawing a legend that disagrees with its own chart.
   */
  function compositionColors(res) {
    var drugs = {}, solvents = {};
    (res.rows || []).forEach(function (r, i) {
      drugs[r.drugId] = r.inactive ? Charts.token('--text-faint', '#5a5a68') : Charts.colorFor(i);
    });
    if (res.blend && res.blend.components) {
      res.blend.components.forEach(function (c, i) {
        solvents[c.solvent.id] = Charts.colorFor((res.rows || []).length + i);
      });
    }
    return { drugs: drugs, solvents: solvents };
  }

  function mixturePanel(res, controls) {
    var list = h('div', { class: 'mix-rows' });
    var colors = compositionColors(res);

    solutionState.items.forEach(function (item, i) {
      var isSolvent = item.kind === 'solvent';
      var name, sub2, tone = '';

      if (isSolvent) {
        var sv = Solution.solvent(item.solventId);
        var comp = res.blend && res.blend.byId ? res.blend.byId[sv.id] : null;
        name = sv.name;
        if (sv.neverIngest) tone = ' mix-row-hazard';
        sub2 = comp
          ? (Solution.isVolumeUnit(item.unit)
              ? comp.massG.toFixed(2) + ' g'
              : comp.volumeMl.toFixed(2) + ' ml')
          : 'solvent';
      } else {
        var dd = DB.get(item.drugId);
        var row = null;
        res.rows.forEach(function (r) { if (r.drugId === item.drugId) row = r; });
        name = dd ? dd.name : item.drugId;
        if (row && row.inactive) tone = ' mix-row-inactive';
        sub2 = row && row.perDoseMg != null
          ? Potency.fmtMg(row.perDoseMg) + ' per dose'
          : (row && row.inactive ? 'inactive' : 'active');
      }

      var dot = isSolvent
        ? colors.solvents[item.solventId]
        : colors.drugs[item.drugId];

      list.appendChild(h('div', { class: 'mix-row' + tone }, [
        h('span', { class: 'mix-row-dot', style: 'background:' + (dot || 'var(--border-strong)') }),
        h('button', {
          class: 'mix-row-name', title: 'Change the amount, or remove it',
          onclick: function () { editIngredient(i); }
        }, [name]),
        h('span', { class: 'mix-row-amt', text: item.amount + ' ' + item.unit }),
        h('span', { class: 'mix-row-sub muted small', text: sub2 }),
        h('button', {
          class: 'chip-x', title: 'Remove ' + name, 'aria-label': 'Remove ' + name, text: '×',
          onclick: function () { solutionState.items.splice(i, 1); render(); }
        })
      ]));
    });

    return h('section', { class: 'mixture-panel' }, [
      h('div', { class: 'mixture-head' }, [
        h('h3', { text: solutionState.dry ? 'In the jar' : 'In the bottle' }),
        h('span', { class: 'muted small', text: solutionState.items.length
          ? solutionState.items.length + ' ingredient' + (solutionState.items.length === 1 ? '' : 's')
          : 'empty' }),
        controls
      ]),
      solutionState.items.length ? list : null
    ]);
  }

  function renderSolution(root) {
    var modeSeg = h('div', { class: 'seg' }, [
      ['Solution', false, 'Dissolve a known mass in a known volume and measure doses by volume. The better technique wherever the compound and the route allow it, because a liquid mixes itself.'],
      ['Dry mix', true, 'Cut an active into a filler and weigh portions. No solvent, no volume — everything is mass fractions. Use it when nothing safe will dissolve the compound, or when the dose is going into a capsule.']
    ].map(function (m) {
      return h('button', {
        class: 'seg-btn' + (solutionState.dry === m[1] ? ' active' : ''),
        title: m[2],
        onclick: function () { setSolutionDry(m[1]); }
      }, [m[0]]);
    }));

    /* Seven buttons in a row, all the same size, is a toolbar that makes you
       read every label to find the one you want — and it put a mode switch,
       three file operations and a destructive Reset on the same footing. The
       mode switch belongs to the title (it decides what the tab IS); the rest
       are file operations and sit together in their own quiet group. */
    root.appendChild(h('div', { class: 'section-head solution-head' }, [
      h('div', { class: 'solution-title' }, [
        h('h2', {}, [
          solutionState.dry ? 'Dry mix calculator' : 'Solution calculator',
          helpLink('Solutions')
        ]),
        modeSeg
      ]),
      h('div', { class: 'row-actions solution-files' }, [
        h('button', { class: 'btn small', text: 'Save', onclick: saveCurrentSolution }),
        h('button', { class: 'btn small', text: 'Saved', onclick: openSolutionManager }),
        h('button', { class: 'btn small', text: 'Copy as text', onclick: function () {
          copyText(Solution.textReport(Solution.compute(solutionState.items, solutionOpts())));
        } }),
        h('button', { class: 'btn small danger', text: 'Reset', title:
          'Clear the working mixture and go back to the default 100 g of water. Saved solutions are not affected.',
          onclick: resetSolution })
      ])
    ]));

    /* ---- dose volume, in whatever unit the measuring device reads ---------
       Stored internally as ml. A syringe reads ml, a dropper reads drops and
       a kitchen spoon reads tsp; converting between them by hand is the same
       class of error this whole tab exists to prevent.                     */
    var DOSE_UNITS = ['ml', 'µl', 'drop', 'tsp', 'tbsp', 'floz'];
    var DOSE_TO_ML = { ml: 1, 'µl': 0.001, drop: 0.05, tsp: 4.92892, tbsp: 14.7868, floz: 29.5735 };

    var doseUnit = solutionState.doseUnit || 'ml';
    if (DOSE_TO_ML[doseUnit] == null) doseUnit = 'ml';

    var doseInput = h('input', {
      type: 'number', step: 'any', min: '0.001',
      value: +(solutionState.doseMl / DOSE_TO_ML[doseUnit]).toFixed(4),
      onchange: function () {
        var shown = parseFloat(doseInput.value);
        if (!(shown > 0)) shown = 1;
        solutionState.doseUnit = doseUnit;
        solutionState.doseMl = shown * DOSE_TO_ML[doseUnit];
        render();
      }
    });
    var doseUnitSel = h('select', {
      onchange: function (e) {
        // Keep the physical dose the same when the unit changes rather than
        // reinterpreting the number — switching ml to tsp should not silently
        // quintuple the dose.
        var prevMl = solutionState.doseMl;
        doseUnit = e.target.value;
        solutionState.doseUnit = doseUnit;
        doseInput.value = +(prevMl / DOSE_TO_ML[doseUnit]).toFixed(4);
        render();
      }
    }, DOSE_UNITS.map(function (u) {
      return h('option', { value: u, text: u, selected: u === doseUnit ? 'selected' : null });
    }));

    /* ---- the controls, at the very top -------------------------------------
       Three things drive everything below: what is in the mixture, and how
       much of it you measure out. They sit in one bare row at the top of the
       tab rather than in a panel of their own — the entry fields live in a
       popup, so nothing stands between the top of the page and the figures.  */
    /* ---- dose by mass, when the mixture is a powder ---- */
    var MASS_TO_MG = { 'µg': 0.001, mg: 1, g: 1000 };
    var massUnit = MASS_TO_MG[solutionState.doseMassUnit] ? solutionState.doseMassUnit : 'mg';
    var doseMassInput = h('input', {
      type: 'number', step: 'any', min: '0.001',
      value: +(solutionState.doseMassMg / MASS_TO_MG[massUnit]).toFixed(4),
      onchange: function () {
        var shown = parseFloat(doseMassInput.value);
        if (!(shown > 0)) shown = 100;
        solutionState.doseMassUnit = massUnit;
        solutionState.doseMassMg = shown * MASS_TO_MG[massUnit];
        render();
      }
    });
    var doseMassUnitSel = h('select', {
      onchange: function (e) {
        // Same rule as the volume unit: changing the unit must not change the
        // physical amount.
        var prev = solutionState.doseMassMg;
        massUnit = e.target.value;
        solutionState.doseMassUnit = massUnit;
        doseMassInput.value = +(prev / MASS_TO_MG[massUnit]).toFixed(4);
        render();
      }
    }, ['µg', 'mg', 'g'].map(function (u) {
      return h('option', { value: u, text: u, selected: u === massUnit ? 'selected' : null });
    }));

    var mixtureControls = h('div', { class: 'entry-row' }, [
      h('button', { class: 'btn primary', text: '+ Add ingredient', onclick: openAddIngredientPopup }),
      solutionState.items.length
        ? h('button', { class: 'btn', text: 'All figures', title:
            'Every derived figure for every ingredient — shares by mass and by volume, ' +
            'concentration, and what one dose contains of each.',
            onclick: openIngredientsPopup })
        : null,
      /* The tab computes what a dose delivers; the Now tab curves what was
         taken. Without this the reader had to read a milligram figure off
         this page and retype it into the log once per active, which is both
         tedious and exactly the sort of hand transcription this tab exists to
         remove from dosing. */
      solutionState.items.some(function (i) { return i.kind !== 'solvent'; })
        ? h('button', { class: 'btn', text: 'Log this dose', title:
            'Add this dose to the log, split into what it delivers of each active in it.',
            onclick: function () { openLogModal(null, 'solution'); } })
        : null,
      h('span', { class: 'entry-dose' }, solutionState.dry
        ? [h('label', { text: 'Dose mass' }), h('div', { class: 'inline' }, [doseMassInput, doseMassUnitSel])]
        : [h('label', { text: 'Dose volume' }), h('div', { class: 'inline' }, [doseInput, doseUnitSel])])
    ]);

    root.appendChild(h('p', { class: 'muted small solution-intro', text: solutionState.dry
      ? 'Cut an active into a filler, then weigh portions of the powder. It solves the same problem ' +
        'as a solution — a compound active below what a scale can read — and it is the weaker way to ' +
        'do it, because two powders separate and a liquid cannot. Use it when nothing safe will ' +
        'dissolve the compound, or when the dose is going into a capsule anyway.'
      : 'Dissolve a known mass in a known volume, then measure doses by volume. This is how compounds ' +
        'active below what a scale can weigh are dosed at all — and arithmetic errors here are a ' +
        'recurring cause of overdose, which is exactly why the numbers are laid out in full below.' }));

    persistWorkingSolution();

    var res = Solution.compute(solutionState.items, solutionOpts());

    /* ---- every headline figure, in one row ---------------------------------
       What the mixture is (volume, density, mass, freezing point, pH) and what
       a dose of it delivers are the same question asked twice, so they are one
       row of cards rather than a summary box above a stats strip. Only one of
       the branches below runs per render, so this is built once and appended
       wherever that branch puts it.                                          */
    /* The order runs from the physical description of the bottle (how much
       liquid, how heavy, how it behaves) to what it does as a dose (how
       strong, how many doses in it). "Total active mass" and "Per dose" are
       both already in the composition chart and the per-dose cards below, and
       "Solvent blend" repeats the name of an ingredient that is listed twice
       elsewhere — so those three are gone rather than restated here. */
    var statsEl = h('div', { class: 'stat-row' });
    if (res.dry) {
      statsEl.appendChild(statCard('Total mass', Potency.fmtMg(res.totalMassMg),
        'everything in the jar — active and filler alike, which is what a scale reads'));
      statsEl.appendChild(statCard('Dose mass', Potency.fmtMg(res.doseMassMg),
        'the portion you weigh out; every per-dose figure below follows from it'));
      if (res.dryChecks && res.dryChecks.dilutionRatio) {
        statsEl.appendChild(statCard('Dilution',
          '1 : ' + (res.dryChecks.dilutionRatio - 1).toFixed(1),
          'one part active to this many parts of everything else, by mass'));
      }
      if (res.dryChecks && res.dryChecks.scaleErrorFraction != null) {
        statsEl.appendChild(statCard('Scale error',
          '±' + Math.round(res.dryChecks.scaleErrorFraction * 100) + '%',
          'what ±5 mg — a realistic figure for a milligram scale — does to a dose this size'));
      }
    } else if (res.noSolvent) {
      statsEl.appendChild(statCard('Solvent', 'none yet',
        'Add one and the volume, concentration and per-dose amounts all follow from it.'));
    } else {
      statsEl.appendChild(statCard('Total volume', res.volumeMl.toFixed(1) + ' ml',
        res.soluteVolumeMl > 0.05
          ? res.solventVolumeMl.toFixed(1) + ' ml of solvent + ' + res.soluteVolumeMl.toFixed(1) +
            ' ml displaced by dissolved solids'
          : 'derived from the solvent masses and their densities'));
      statsEl.appendChild(statCard('Total mass', res.totalSystemMassG.toFixed(1) + ' g',
        'everything in the container, solvent included'));
      if (res.freezing) {
        statsEl.appendChild(statCard('Freezes at', Math.round(res.freezing.tempC) + ' °C',
          res.freezing.reasons.join('; ')));
      }
      if (res.ph) {
        statsEl.appendChild(statCard('Estimated pH',
          res.ph.ph == null ? 'n/a' : res.ph.ph.toFixed(1), res.ph.reason));
      }
      statsEl.appendChild(statCard('Solution density',
        res.solutionDensity ? res.solutionDensity.toFixed(3) + ' g/ml' : '—',
        'the solvent blend on its own is ' + res.blend.density.toFixed(3) + ' g/ml'));
    }
    if (res.rows.length) {
      if (!res.dry) statsEl.appendChild(statCard('Concentration', Potency.fmtConc(res.totalConcMgMl)));
      statsEl.appendChild(statCard(res.dry ? 'Doses in mixture' : 'Doses in solution',
        Math.floor(res.dosesAvailable * 10) / 10));
    }

    root.appendChild(mixturePanel(res, mixtureControls));

    if (!solutionState.items.length) {
      root.appendChild(h('div', { class: 'empty' }, [
        h('p', { text: solutionState.dry
          ? 'Nothing in the jar yet. Add the active you are diluting and a filler to carry it — lactose, mannitol or microcrystalline cellulose.'
          : 'Nothing in the bottle yet. "+ Add ingredient" takes actives, solvents and fillers alike — there is no separate step for solvents.' })
      ]));
      return;
    }

    /* The ingredient list and the per-ingredient figures live in the "View
       ingredients" popup — see openIngredientsPopup(). Repeating them inline
       made the tab a stack of boxes for the whole time a recipe is being read
       rather than built, which is most of it.

       There is deliberately no solvent/active split anywhere in that list.
       That distinction is an implementation detail of how the volume is
       derived — to the person holding the bottle it is all just what went in,
       and splitting it made one ingredient list read as two unrelated ones. */

    if (!res.rows.length) {
      // Solvent only: the volume, density and mass are already worth showing,
      // so the stats go out before the prompt for an active.
      root.appendChild(statsEl);
      root.appendChild(h('div', { class: 'empty' }, [
        h('p', { text: solutionState.dry
          ? 'Now add at least one active to see per-dose amounts.'
          : 'Now add at least one active to see concentrations and per-dose amounts.' })
      ]));
      var checks0 = mixtureChecksEl(res.warnings);
      if (checks0) root.appendChild(checks0);
      return;
    }

    /* ---- mixture checks, above everything ---- */
    var checks = mixtureChecksEl(res.warnings);
    if (checks) root.appendChild(checks);

    /* ---- headline stats ---- */
    root.appendChild(statsEl);

    /* ---- composition, by mass or by volume --------------------------------
       Mass is what a scale reads; volume is what a syringe reads. They are
       genuinely different pictures of the same bottle — a dense active is a
       bigger share by mass than by volume, and a light solvent the reverse —
       and which one is useful depends on whether you are weighing the recipe
       out or measuring doses from it. So it is one section with a switch
       rather than a title that quietly picks one for you. */
    // A powder has no meaningful volume: bulk volume depends on how hard it
    // was tapped down, which is not something to put a number on. Mass is the
    // only honest basis, so the toggle does not apply.
    var byVolume = !res.dry && solutionState.compositionBasis === 'volume';
    var secComp = section('sol-composition', 'Composition');
    secComp.body.appendChild(h('div', { class: 'row-actions comp-basis' }, [
      h('span', { class: 'mode-label', text: 'Show shares' }),
      (function () {
        var seg = h('div', { class: 'seg' });
        [['mass', 'By mass', 'Share of the total weight of everything in the container.'],
         ['volume', 'By volume', 'Share of the finished liquid volume. Dissolved solids count as the space they occupy.']
        ].forEach(function (m) {
          seg.appendChild(h('button', {
            class: 'seg-btn' + ((solutionState.compositionBasis || 'mass') === m[0] ? ' active' : ''),
            title: m[2],
            onclick: function () { solutionState.compositionBasis = m[0]; render(); }
          }, [m[1]]));
        });
        return seg;
      })()
    ]));

    // Everything that went into the container, solvents included — leaving the
    // solvent out of a chart of the mixture made water look like it weighed
    // nothing and occupied no space.
    var compColors = compositionColors(res);
    var compItems = res.rows.map(function (r, i) {
      return {
        key: r.drugId,
        label: (r.drug ? r.drug.name : r.drugId) + (r.inactive ? ' (inactive)' : ''),
        value: byVolume ? r.volumeMl : r.totalMg,
        massMg: r.totalMg,
        volumeMl: r.volumeMl,
        perDoseMg: r.perDoseMg,
        perDoseMl: null,
        color: compColors.drugs[r.drugId]
      };
    });
    if (!res.noSolvent) {
      res.blend.components.forEach(function (c, i) {
        compItems.push({
          key: 'solvent:' + c.solvent.id,
          label: c.solvent.name,
          value: byVolume ? c.volumeMl : c.massG * 1000,
          massMg: c.massG * 1000,
          volumeMl: c.volumeMl,
          perDoseMg: null,
          perDoseMl: res.doseMl * c.fraction,
          color: compColors.solvents[c.solvent.id]
        });
      });
    }

    var pie = Charts.pieChart({
      items: compItems,
      // A donut of two slices does not need to be the tallest element on the
      // tab; it was pushing the per-dose figures — the numbers the page
      // exists for — a full screen further down.
      size: 210,
      centreLabel: byVolume ? res.volumeMl.toFixed(1) + ' ml'
        : (res.dry ? Potency.fmtMg(res.totalMassMg) : res.totalSystemMassG.toFixed(1) + ' g'),
      centreSub: byVolume ? 'total volume' : 'total mass',
      emptyCaption: 'Hover a slice or a legend row for its share and what a dose delivers of it.',
      valueFormat: function (v, frac, it) {
        // Both numbers the question actually needs: the share of the whole
        // mixture, and what a dose of it delivers.
        var parts = [Charts.fmtPct(frac) + (res.dry ? ' of the powder' : ' of the solution')];
        parts.push(byVolume
          ? it.volumeMl.toFixed(it.volumeMl < 1 ? 3 : 2) + ' ml of ' + res.volumeMl.toFixed(1) + ' ml'
          : Potency.fmtMg(it.massMg) + ' total');
        if (it.perDoseMg != null) parts.push(Potency.fmtMg(it.perDoseMg) + ' per ' +
          (res.dry ? Potency.fmtMg(res.doseMassMg) + ' portion' : res.doseMl + ' ml dose'));
        else if (it.perDoseMl != null) parts.push(it.perDoseMl.toFixed(3) + ' ml per dose');
        return parts.join('  \u00b7  ');
      }
    });
    // Kept on the result so the ingredients popup can point at a slice.
    solutionState.pie = pie;
    if (pie) secComp.body.appendChild(h('div', { class: 'chart-wrap' }, [pie]));

    // Per-dose actives stay a bar chart: this one is a magnitude comparison,
    // not a share of a whole, and a pie of it would imply the doses sum to
    // something meaningful.
    secComp.body.appendChild(h('div', { class: 'chart-wrap' }, [
      Charts.barChart({
        items: res.rows.filter(function (r) { return !r.inactive; })
          .sort(function (a, b) { return b.perDoseMg - a.perDoseMg; })
          .map(function (r, i) {
            return { label: r.drug ? r.drug.name : r.drugId, value: r.perDoseMg, color: Charts.colorFor(i) };
          }),
        valueFormat: function (v) { return Potency.fmtMg(v); },
        height: 240
      })
    ]));
    var doseLabel = res.dry ? Potency.fmtMg(res.doseMassMg) + ' portion' : res.doseMl + ' ml dose';
    secComp.body.appendChild(h('p', { class: 'muted small', text: byVolume
      ? 'Top: share of the finished volume — the solvents plus the space each dissolved solid occupies, ' +
        'largest first. Solid volumes are estimated from crystal density, which is close for sugars and ' +
        'overstates it for salts, so treat them as approximate. Bottom: what a ' + doseLabel +
        ' delivers of each ACTIVE, which is the part that determines what the dose does.'
      : (res.dry
          ? 'Top: share of the total mass of the powder — every ingredient, filler included, heaviest ' +
            'first. This is the ratio a weighed portion carries IF the powder is evenly mixed, which ' +
            'is the assumption the whole method rests on. Bottom: what a ' + doseLabel + ' delivers ' +
            'of each ACTIVE.'
          : 'Top: share of the total mass of the mixture — every ingredient, including inactive fillers ' +
            'and the solvent itself, heaviest first. Hover any slice for its percentage and what a dose ' +
            'delivers of it. Bottom: what a ' + doseLabel + ' delivers of each ACTIVE, which is ' +
            'the part that determines what the dose does.') }));
    root.appendChild(secComp.el);

    /* ---- what one dose contains: actives AND solvents together ---- */
    var doseCount = res.rows.filter(function (r) { return r.drug; }).length +
                    (res.noSolvent ? 0 : res.blend.components.length);
    var secDose = section('sol-dose', 'What one dose contains', { count: doseCount });
    var grid = h('div', { class: 'card-grid' });

    // Actives (and inactives) first.
    res.rows.forEach(function (r) {
      if (!r.drug) return;
      var d = r.drug;
      var rt = d.routes[r.route] || d.routes[Object.keys(d.routes)[0]];
      var card = h('div', { class: 'card' + (r.inactive ? ' card-inactive' : '') }, [
        h('div', { class: 'card-head' }, [
          h('button', { class: 'link-title', onclick: function () { openDrug(d.id); } }, [d.name]),
          r.inactive
            ? h('span', { class: 'pill kind-inactive', text: 'inactive' })
            : h('span', { class: 'pill tier-' + r.tier, text: r.tier })
        ]),
        h('div', { class: 'card-sub', text: Potency.fmtMg(r.perDoseMg) + ' per ' +
          (res.dry ? Potency.fmtMg(res.doseMassMg) + ' portion' : res.doseMl + ' ml') + ' · ' +
          (r.inactive ? 'filler / excipient' : r.route) })
      ]);
      if (r.inactive) {
        card.appendChild(h('p', { class: 'small muted', text: d.mechanism }));
      } else {
        card.appendChild(h('dl', { class: 'kv' }, [
          h('dt', { text: 'Half-life' }),
          h('dd', {}, [Charts.fmtDur(d.halfLife.hours), ' ', confBadge(d.halfLife.confidence)]),
          h('dt', { text: 'Onset / duration' }),
          h('dd', { text: rt.onsetMin[0] + '–' + rt.onsetMin[1] + ' min / ' + rt.durationH[0] + '–' + rt.durationH[1] + ' h' }),
          h('dt', { text: 'Bioavailability' }),
          h('dd', { text: '~' + Math.round(rt.bioavailability * 100) + '%' }),
          h('dt', { text: '~97% cleared' }),
          h('dd', { text: Charts.fmtDur(d.halfLife.hours * 5) }),
          h('dt', { text: 'Metabolised by' }),
          h('dd', { text: d.metabolism.substrateOf.join(', ') || '—' })
        ]));
        var act = DB.activeMetabolites(d);
        if (act.length) {
          card.appendChild(h('div', { class: 'note' }, [
            h('strong', { text: 'Active metabolites: ' }),
            act.map(function (m) {
              return m.name + (m.halfLifeH ? ' (t½ ' + Charts.fmtDur(m.halfLifeH) + ')' : '');
            }).join(', ') + '.'
          ]));
        }
      }
      grid.appendChild(card);
    });

    // Then the solvents, as cards in the same grid.
    if (!res.noSolvent) {
      res.blend.components.forEach(function (c) {
        var s = c.solvent;
        var perDoseMl = res.doseMl * c.fraction;
        var card = h('div', { class: 'card card-solvent' + (s.hazards ? ' card-hazard' : '') }, [
          h('div', { class: 'card-head' }, [
            // No "solvent" pill: in this section it is simply another thing the
            // dose contains, and labelling it apart was the distinction the
            // rest of this tab has stopped drawing.
            h('strong', { class: 'solvent-title', text: s.name }),
            s.neverIngest ? h('span', { class: 'badge conf-anecdotal', text: 'toxic' }) : null
          ]),
          h('div', { class: 'card-sub', text: perDoseMl.toFixed(3) + ' ml per dose · ' +
            (c.fraction * 100).toFixed(1) + '% of volume' }),
          h('p', { class: 'small', text: s.note }),
          h('dl', { class: 'kv' }, [
            h('dt', { text: 'In this solution' }),
            h('dd', { text: c.massG.toFixed(2) + ' g → ' + c.volumeMl.toFixed(2) + ' ml' }),
            h('dt', { text: 'Density' }),
            h('dd', { text: s.density + ' g/ml' }),
            h('dt', { text: 'Solvency ceiling' }),
            h('dd', { text: '~' + s.maxMgMl + ' mg/ml' }),
            h('dt', { text: 'Shelf life' }),
            h('dd', { text: s.shelfLifeNote })
          ])
        ]);
        if (s.activeDrugId) {
          var strength = s.activeFraction != null ? s.activeFraction : 1;
          var gPerDose = perDoseMl * strength * s.density;
          card.appendChild(h('div', { class: 'note note-warn' }, [
            h('strong', { text: 'Psychoactive solvent: ' }),
            'each dose carries ' + (gPerDose < 1 ? (gPerDose * 1000).toFixed(0) + ' mg' : gPerDose.toFixed(2) + ' g') +
            ' of ethanol, which adds to any depressant in the mix.'
          ]));
        }
        if (s.hazards) {
          card.appendChild(h('ul', { class: 'hazard-list' }, s.hazards.map(function (hz) {
            return h('li', { text: hz });
          })));
        }
        grid.appendChild(card);
      });
    }
    secDose.body.appendChild(grid);
    root.appendChild(secDose.el);

    // The plain-text report panel is gone. It duplicated everything already
    // on screen in a monospace box; the "Copy plain text" button in the
    // header produces the same report without occupying the page.

    /* ---- interactions, last ---- */
    var secInt = section('sol-interactions', 'Interactions between ingredients',
      { count: res.findings.length || null });
    if (res.findings.length) {
      secInt.body.appendChild(findingsList(res.findings));
    } else {
      var activeCount = res.rows.filter(function (r) { return !r.inactive; }).length;
      secInt.body.appendChild(h('div', { class: 'empty small' }, [
        h('p', { text: activeCount < 2
          ? 'Fewer than two actives — nothing to cross-check.'
          : 'No interactions found in this database.' }),
        activeCount >= 2 ? h('p', { class: 'muted small',
          text: 'Not a safety endorsement — most combinations have never been studied.' }) : null
      ]));
    }
    root.appendChild(secInt.el);
  }

  /* ======================================================================
     TAB: STATS
     ====================================================================== */

  function renderStats(root) {
    var logs = Store.load();
    root.appendChild(h('h2', { text: 'Patterns' }));

    if (!logs.length) {
      root.appendChild(h('div', { class: 'empty empty-lead' }, [
        h('h3', { class: 'empty-title', text: 'Nothing to find patterns in yet.' }),
        h('p', { class: 'muted', text:
          'This page reads the dose log and nothing else: how often, how much, at what times of ' +
          'day, and roughly where tolerance sits. It needs a few entries before any of that means ' +
          'anything.' }),
        h('div', { class: 'empty-actions' }, [
          h('button', { class: 'btn primary', text: '+ Log a dose', onclick: openLogModal })
        ])
      ]));
      return;
    }

    var now = Date.now();
    var byDrug = {};
    logs.forEach(function (l) {
      var d = DB.get(l.drugId);
      if (!d) return;
      var e = byDrug[d.id] = byDrug[d.id] || { drug: d, count: 0, totalMg: 0, last: 0, first: Infinity };
      e.count++; e.totalMg += l.amountMg;
      e.last = Math.max(e.last, l.timeMs); e.first = Math.min(e.first, l.timeMs);
    });
    var entries = Object.keys(byDrug).map(function (k) { return byDrug[k]; })
      .sort(function (a, b) { return b.count - a.count; });

    root.appendChild(h('div', { class: 'stat-row' }, [
      statCard('Doses logged', logs.length),
      statCard('Distinct substances', entries.length),
      statCard('Tracking since', new Date(Math.min.apply(null, logs.map(function (l) { return l.timeMs; })))
        .toLocaleDateString()),
      statCard('Days with use', new Set(logs.map(function (l) {
        return new Date(l.timeMs).toDateString();
      })).size)
    ]));

    /* ---- time of day ----
       Twenty-four buckets over the whole log. Deliberately not "average per
       day" or anything smoothed: it is a count of what was logged when, and
       reading it as anything more than that would be reading too much in. */
    var hours = [];
    for (var hI = 0; hI < 24; hI++) hours.push(0);
    logs.forEach(function (l) { hours[new Date(l.timeMs).getHours()]++; });

    var busiest = hours.indexOf(Math.max.apply(null, hours));
    var fmtHour = function (hr) {
      return (hr % 12 === 0 ? 12 : hr % 12) + (hr < 12 ? ' am' : ' pm');
    };

    root.appendChild(h('div', { class: 'section-head sub' }, [
      h('h3', { text: 'Time of day' }),
      h('span', { class: 'muted small', text: logs.length < 8
        ? 'Too few entries to read much into'
        : 'Most often around ' + fmtHour(busiest) })
    ]));

    root.appendChild(h('div', { class: 'chart-wrap' }, [
      Charts.barChart({
        items: hours.map(function (n, hr) {
          return {
            label: hr % 3 === 0 ? fmtHour(hr) : '',
            value: n,
            // The peak hour is the one the caption names, so it is the one
            // that should be findable in the chart.
            color: hr === busiest && logs.length >= 8
              ? 'var(--accent)' : Charts.token('--accent-dim', '#3d6d99')
          };
        }),
        height: 180,
        valueFormat: function (v) { return String(Math.round(v)); }
      })
    ]));

    root.appendChild(h('p', { class: 'muted small', text:
      'A count of logged doses by the hour they were taken, over the whole log. It says when you ' +
      'log, which is not quite the same as when you take something — an entry added the morning ' +
      'after lands in the morning.' }));

    root.appendChild(h('h3', { text: 'Frequency by substance' }));
    root.appendChild(h('div', { class: 'chart-wrap' }, [
      Charts.barChart({
        items: entries.slice(0, 16).map(function (e, i) {
          return { label: e.drug.name, value: e.count, color: Charts.colorFor(i) };
        }),
        valueFormat: function (v) { return String(Math.round(v)); }
      })
    ]));

    root.appendChild(h('h3', { text: 'Per substance' }));
    var tbl = h('table', { class: 'log-table' }, [
      h('thead', {}, [h('tr', {}, ['Substance', 'Doses', 'Total', 'Last used', 'Est. tolerance', 'Spacing'].map(function (t) {
        return h('th', { text: t });
      }))])
    ]);
    var tb = h('tbody');
    entries.forEach(function (e) {
      /* Every dose that builds tolerance to this compound, not just the
         ones of this compound. `toleranceGroup` was already on every entry
         and PK.toleranceAt already accepted a `crossFactor` per dose; the
         two were simply never connected, so a week of daily alprazolam
         showed as no tolerance at all to diazepam.

         Doses are normalised to each compound's OWN common dose, so 1 mg of
         alprazolam and 10 mg of diazepam both arrive here as roughly one
         common dose and potency needs no separate handling. */
      var contributors = {};
      var priors = logs.map(function (l) {
        var ld = DB.get(l.drugId);
        var cross = PK.crossToleranceFactor(e.drug, ld);
        if (!cross) return null;
        if (ld.id !== e.drug.id) contributors[ld.name] = cross;
        var common = PK.commonDoseMg(ld, l.route) || l.amountMg;
        return { timeMs: l.timeMs, doseRatio: l.amountMg / common, crossFactor: cross };
      }).filter(Boolean);
      var tol = PK.toleranceAt(e.drug, priors, now);
      var crossNames = Object.keys(contributors);
      var daysSince = (now - e.last) / 86400000;
      var spacingOk = !e.drug.minRedoseDays || daysSince >= e.drug.minRedoseDays;

      tb.appendChild(h('tr', {}, [
        h('td', {}, [h('button', { class: 'link-title small', onclick: function () { openDrug(e.drug.id); } }, [e.drug.name])]),
        h('td', { text: String(e.count) }),
        h('td', { text: Potency.fmtMg(e.totalMg) }),
        h('td', { text: daysSince < 1 ? Charts.fmtDur(daysSince * 24) + ' ago' : Math.round(daysSince) + ' d ago' }),
        h('td', {}, [tol
          ? h('div', {}, [
              // The figure sits beside the bar rather than on top of its
              // own fill, where it was competing with the fill colour for
              // contrast and being clipped by the fill edge.
              h('div', { class: 'meter-row' }, [
                h('div', { class: 'mini-meter' }, [
                  h('div', { class: 'mini-fill', style: 'width:' + Math.round(tol.index * 100) + '%' })
                ]),
                h('span', { class: 'meter-row-val', text: Math.round(tol.index * 100) + '%' })
              ]),
              // Where it came from, when it did not all come from this
              // compound — a cross-tolerance figure with no attribution is
              // just a number that will not reconcile with the dose count.
              crossNames.length
                ? h('div', { class: 'muted small cross-note', title:
                    'Cross-tolerance within the ' + e.drug.toleranceGroup + ' group, at ' +
                    Math.round((PK.CROSS_TOLERANCE[e.drug.toleranceGroup] || 0.7) * 100) +
                    '% transfer. Doses are normalised to each compound\'s own common dose first.',
                    text: '+ ' + crossNames.join(', ') })
                : null
            ])
          : document.createTextNode('—')]),
        h('td', {}, [e.drug.minRedoseDays
          ? h('span', { class: 'pill ' + (spacingOk ? 'ok' : 'warn'),
              text: spacingOk ? 'clear' : Math.ceil(e.drug.minRedoseDays - daysSince) + ' d to go' })
          : document.createTextNode('—')])
      ]));
    });
    tbl.appendChild(tb);
    root.appendChild(h('div', { class: 'table-wrap' }, [tbl]));

    root.appendChild(h('p', { class: 'muted small', text:
      'Tolerance is a crude exponential-recovery model using each substance\'s tolerance half-life. ' +
      'Doses of OTHER compounds in the same cross-tolerance group count too, normalised to each ' +
      'compound\'s own common dose and weighted by how far the adaptation transfers — near-complete ' +
      'for GABAergics and classical psychedelics, high but incomplete for opioids. A row showing ' +
      '"+ " and another compound is telling you where its tolerance came from. It is an illustration ' +
      'of decay over time, not a measurement, and it says nothing about the risks that do NOT ' +
      'tolerate alongside the subjective effect — respiratory depression and cardiovascular load ' +
      'being the two that kill people.' }));
  }

  /**
   * A headline figure. `note` carries the derivation — where a number came
   * from is part of the number, and a stat card without it is a claim.
   * Long values (a solvent blend name) drop a size so they still fit the card.
   */
  function statCard(label, value, note) {
    var text = String(value);
    return h('div', { class: 'stat-card' }, [
      h('span', { class: 'stat-value' + (text.length > 12 ? ' stat-value-long' : ''), text: text }),
      h('span', { class: 'stat-label', text: label }),
      note ? h('span', { class: 'stat-note', text: note }) : null
    ]);
  }

  /* ======================================================================
     MODAL
     ====================================================================== */

  /* A modal is a dialog, and a dialog has to behave like one: it takes the
     focus when it opens, keeps Tab inside itself while it is up, gives the
     focus back to whatever opened it when it closes, and tells assistive
     technology that the page behind it is not currently reachable. None of
     that was true before — Tab walked straight out of the settings panel and
     into the substance list behind it. */

  // What had the focus when the modal opened, so it can be handed back.
  var modalReturn = null;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
                  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openModal(content) {
    closeModal();
    modalReturn = document.activeElement;

    var panel = h('div', {
      class: 'modal', role: 'dialog', 'aria-modal': 'true', tabindex: '-1'
    }, [
      h('button', {
        class: 'modal-close', text: '×', title: 'Close  (Esc)', 'aria-label': 'Close',
        onclick: closeModal
      }),
      content
    ]);

    var overlay = h('div', { class: 'modal-overlay', id: 'modal', onclick: function (e) {
      if (e.target.id === 'modal') closeModal();
    } }, [panel]);

    // The heading the dialog is built around, so it is announced by name.
    var heading = content.querySelector ? content.querySelector('h2, h3') : null;
    if (heading) {
      if (!heading.id) heading.id = 'modal-title';
      panel.setAttribute('aria-labelledby', heading.id);
    }

    overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = Array.prototype.filter.call(panel.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    document.body.appendChild(overlay);
    // The page behind cannot scroll out from under the dialog.
    document.body.classList.add('modal-open');

    // Callers that want a particular field focused do it after this returns;
    // the panel itself is the fallback so the focus is never left outside.
    panel.focus();
  }

  function closeModal() {
    var m = $('#modal');
    if (!m) return;
    m.remove();
    document.body.classList.remove('modal-open');
    if (modalReturn && document.contains(modalReturn)) modalReturn.focus();
    modalReturn = null;
  }

  /* ======================================================================
     FAQ
     ====================================================================== */

  /**
   * A quiet "?" that opens the FAQ filtered to one group.
   *
   * It sets the FAQ's search box rather than inventing a second filtering
   * mechanism, so the reader lands somewhere they can widen or clear.
   */
  function helpLink(group) {
    return h('button', {
      class: 'help-link', title: 'Questions about ' + group.toLowerCase(),
      'aria-label': 'Help: ' + group,
      onclick: function () {
        state.faqQuery = group;
        goTab('faq');
      }
    }, ['?']);
  }

  function renderFaq(root) {
    var all = window.FAQ || [];

    root.appendChild(h('div', { class: 'section-head' }, [
      h('h2', { text: 'Questions' }),
      h('span', { class: 'muted small', text: all.length + ' answers' })
    ]));

    var search = h('input', {
      type: 'search', class: 'faq-search', value: state.faqQuery,
      placeholder: 'Search the questions and answers…'
    });
    root.appendChild(search);

    // Arriving from a tab's "?" lands on that tab's questions, with a way
    // back to all fifty that does not require guessing what to delete.
    if (state.faqQuery) {
      root.appendChild(h('div', { class: 'faq-filter-note' }, [
        h('span', { class: 'muted small', text: 'Filtered to “' + state.faqQuery + '”' }),
        h('button', {
          class: 'btn tiny', text: 'Show all questions',
          onclick: function () { state.faqQuery = ''; render(); }
        })
      ]));
    }

    /* Fifty questions in eight groups is a page you scroll past rather than
       read. The strip names the groups and jumps to them; the toggle opens
       everything at once for the reader who would rather use the browser's
       own find-in-page than this search box. */
    var jump = h('nav', { class: 'jump-bar faq-jump', 'aria-label': 'Question groups' });
    root.appendChild(jump);

    var listWrap = h('div', { class: 'faq-list' });
    root.appendChild(listWrap);

    var allOpen = false;

    function setAllOpen(open) {
      allOpen = open;
      Array.prototype.forEach.call(listWrap.querySelectorAll('.faq-item'), function (item) {
        var b = item.querySelector('.faq-answer');
        var q = item.querySelector('.faq-q');
        if (open) b.removeAttribute('hidden'); else b.setAttribute('hidden', 'hidden');
        q.setAttribute('aria-expanded', open ? 'true' : 'false');
        q.querySelector('.faq-caret').textContent = open ? '▾' : '▸';
      });
      paintJump();
    }

    function paintJump() {
      jump.innerHTML = '';
      var seen = {};
      Array.prototype.forEach.call(listWrap.querySelectorAll('.faq-group'), function (head) {
        var name = head.textContent;
        if (seen[name]) return;
        seen[name] = 1;
        jump.appendChild(h('button', {
          class: 'jump-link', text: name,
          onclick: function () {
            window.scrollTo({
              top: head.getBoundingClientRect().top + window.pageYOffset - 74,
              behavior: 'smooth'
            });
          }
        }));
      });
      if (!jump.childNodes.length) { jump.setAttribute('hidden', 'hidden'); return; }
      jump.removeAttribute('hidden');
      jump.appendChild(h('button', {
        class: 'jump-link jump-link-action',
        text: allOpen ? 'Collapse all' : 'Expand all',
        onclick: function () { setAllOpen(!allOpen); }
      }));
    }

    function paint() {
      listWrap.innerHTML = '';
      var q = state.faqQuery.trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];
      var matched = all.filter(function (item) {
        if (!terms.length) return true;
        var hay = (item.q + ' ' + item.a + ' ' + item.group).toLowerCase();
        return terms.every(function (t) { return hay.indexOf(t) >= 0; });
      });

      if (!matched.length) {
        listWrap.appendChild(h('div', { class: 'empty small' }, [
          h('p', { text: 'Nothing matches that. Try a single word — "metabolite", "combined", "pH".' })
        ]));
        paintJump();
        return;
      }

      if (terms.length) {
        listWrap.appendChild(h('p', { class: 'muted small',
          text: matched.length + ' of ' + all.length + ' questions match' }));
      }

      // Group headings, in the order the data declares them.
      var groups = [], byName = {};
      matched.forEach(function (item) {
        var g = item.group || 'Other';
        if (!byName[g]) { byName[g] = { name: g, items: [] }; groups.push(byName[g]); }
        byName[g].items.push(item);
      });

      groups.forEach(function (g) {
        listWrap.appendChild(h('h3', { class: 'faq-group', text: g.name }));
        g.items.forEach(function (item) {
          // Searching opens the matches, so an answer is never one click away
          // from a query that already found it.
          var open = terms.length > 0;
          var body = h('div', { class: 'faq-answer' }, [h('p', { text: item.a })]);
          if (!open) body.setAttribute('hidden', 'hidden');

          var btn = h('button', {
            class: 'faq-q', 'aria-expanded': open ? 'true' : 'false',
            onclick: function () {
              var nowOpen = body.hasAttribute('hidden');
              if (nowOpen) body.removeAttribute('hidden'); else body.setAttribute('hidden', 'hidden');
              btn.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
              btn.querySelector('.faq-caret').textContent = nowOpen ? '▾' : '▸';
            }
          }, [
            h('span', { class: 'faq-caret', text: open ? '▾' : '▸' }),
            h('span', { text: item.q })
          ]);

          listWrap.appendChild(h('div', { class: 'faq-item' }, [btn, body]));
        });
      });

      // A search opens its matches, so the toggle has to agree with what is
      // on screen rather than with what it last did.
      allOpen = terms.length > 0;
      paintJump();
    }

    search.addEventListener('input', function (e) {
      state.faqQuery = e.target.value;
      paint();
    });
    paint();

    root.appendChild(h('div', { class: 'note note-warn' }, [
      h('strong', { text: 'Still the most important thing on this site: ' }),
      'an absent interaction warning means "not in this database", never "safe". ' +
      'Most drug combinations have never been studied in humans.'
    ]));
  }

  /* ======================================================================
     SETTINGS — the user's own body and metaboliser status
     ====================================================================== */

  /**
   * The CYP settings in one line, for the header chip and its tooltip.
   *
   * Six enzymes do not fit on a button, so: say "mixed" when they differ and
   * name the ones that are not normal in the tooltip, which is where there
   * is room to be specific.
   */
  function cypSummary(prof) {
    var settings = Profile.CYP_ENZYMES.map(function (e) { return Profile.cypSetting(e, prof); });
    var uniform = settings.every(function (x) { return x === settings[0]; });
    if (uniform) {
      var label = Profile.CYP_LABEL[settings[0]];
      return { chip: label.split(' ')[0].toLowerCase() + ' CYP',
               full: 'all CYP enzymes set to ' + label.toLowerCase() };
    }
    var odd = Profile.CYP_ENZYMES.filter(function (e) {
      return Profile.cypSetting(e, prof) !== 'medium';
    }).map(function (e) {
      return e + ' ' + Profile.CYP_LABEL[Profile.cypSetting(e, prof)].split(' ')[0].toLowerCase();
    });
    return { chip: 'mixed CYP',
             full: odd.length ? odd.join(', ') + '; the rest normal' : 'CYP settings' };
  }

  function openSettings() {
    var p = Profile.get();
    var body = h('div', { class: 'settings' });

    body.appendChild(h('h2', { text: 'Your profile' }));
    body.appendChild(h('p', { class: 'muted small', text:
      'The model runs on population averages. These settings are where you tell it ' +
      'something about you, and they are applied to every estimate in the app — the Now ' +
      'cards, the timeline, the curves and the solution calculator. Weight and height also ' +
      'set the plasma volume every concentration on the Timeline is divided by.' }));

    var summary = h('div', { class: 'settings-summary' });

    function repaint() {
      p = Profile.get();
      summary.innerHTML = '';
      var kg = Profile.weightKg(p);
      summary.appendChild(h('dl', { class: 'kv wide-kv' }, [
        h('dt', { text: 'Body mass' }),
        h('dd', { text: p.weightLb + ' lb · ' + kg.toFixed(1) + ' kg' }),
        h('dt', { text: 'Height' }),
        h('dd', { text: Profile.formatHeight(p.heightIn) + ' · ' + Profile.heightCm(p).toFixed(0) + ' cm' }),
        h('dt', { text: 'BMI' }),
        h('dd', { text: Profile.bmi(p).toFixed(1) }),
        h('dt', { text: 'Body surface area' }),
        h('dd', { text: Profile.bsa(p).toFixed(2) + ' m² (displayed only — not used in the model)' }),
        h('dt', { text: 'Lean body mass' }),
        h('dd', { text: Profile.leanMassKg(p).toFixed(1) + ' kg (Boer)' }),
        h('dt', { text: 'Blood volume' }),
        h('dd', { text: Profile.bloodVolumeL(p).toFixed(2) + ' L' }),
        h('dt', { text: 'Plasma volume' }),
        h('dd', { text: Profile.plasmaVolumeL(p).toFixed(2) + ' L — the denominator of every ' +
          'plasma concentration shown on the Timeline' }),
        h('dt', { text: 'Dose intensity scaling' }),
        h('dd', { text: '×' + Profile.massScale(p).toFixed(2) + ' relative to the ~' +
          Profile.REFERENCE_KG + ' kg adult the dose ladders assume' })
      ]));
    }

    // ---- body ----
    var weightIn = h('input', {
      type: 'number', min: '60', max: '500', step: '1', value: p.weightLb,
      onchange: function (e) {
        Profile.set({ weightLb: Math.max(60, parseFloat(e.target.value) || Profile.DEFAULTS.weightLb) });
        repaint(); render();
      }
    });
    var feetIn = h('input', {
      type: 'number', min: '3', max: '8', step: '1', value: Math.floor(p.heightIn / 12)
    });
    var inchIn = h('input', {
      type: 'number', min: '0', max: '11', step: '1', value: Math.round(p.heightIn % 12)
    });
    function syncHeight() {
      var total = (parseFloat(feetIn.value) || 0) * 12 + (parseFloat(inchIn.value) || 0);
      Profile.set({ heightIn: Math.max(36, total) });
      repaint(); render();
    }
    feetIn.addEventListener('change', syncHeight);
    inchIn.addEventListener('change', syncHeight);

    /* Boer's lean-body-mass equation has separate coefficients by sex, and so
       does the blood volume built on top of it, so plasma volume needs one.
       Nothing else in the model reads it — it does not touch a half-life, a
       dose ladder or an effect estimate. Unspecified averages the two rather
       than quietly assuming one, and costs about 4% either way. */
    var sexSel = h('select', { onchange: function (e) {
      Profile.set({ sex: e.target.value }); repaint(); render();
    } });
    ['male', 'female', 'unspecified'].forEach(function (k) {
      sexSel.appendChild(h('option', { value: k, text: Profile.SEX[k].label,
        selected: p.sex === k ? 'selected' : null }));
    });

    body.appendChild(h('div', { class: 'log-form' }, [
      h('div', { class: 'field' }, [h('label', { text: 'Weight (lb)' }), weightIn]),
      h('div', { class: 'field' }, [
        h('label', { text: 'Height' }),
        h('div', { class: 'inline' }, [feetIn, h('span', { class: 'muted small', text: 'ft' }),
                                       inchIn, h('span', { class: 'muted small', text: 'in' })])
      ]),
      h('div', { class: 'field' }, [
        h('label', { text: 'Sex (for plasma volume only)' }), sexSel
      ])
    ]));

    // ---- CYP metaboliser status ----
    body.appendChild(h('h3', { text: 'CYP metaboliser status' }));
    body.appendChild(h('p', { class: 'muted small', text:
      'The cytochrome P450 enzymes clear most of the compounds in this database, and how fast ' +
      'yours work is largely genetic. If you have had pharmacogenomic testing, use it. If not, ' +
      'this is a guess — and a wrong guess here moves every half-life in the app.' }));

    /* One setting per enzyme. It used to be one setting for all CYP
       clearance, which the code itself called the wrong shape: real
       genotypes affect one enzyme at a time, and the difference is the
       difference between codeine and diazepam. Setting everything to slow
       is still one click away, and is what an old profile becomes. */
    var setAll = h('div', { class: 'cyp-setall' }, [
      h('span', { class: 'muted small', text: 'Set all to' })
    ].concat(['low', 'medium', 'high'].map(function (key) {
      return h('button', { class: 'btn small', title: Profile.CYP_DESC[key],
        onclick: function () {
          var next = {};
          Profile.CYP_ENZYMES.forEach(function (e) { next[e] = key; });
          Profile.set({ cyp: next }); openSettings(); render();
        } }, [Profile.CYP_LABEL[key].split(' ')[0]]);
    })));
    body.appendChild(setAll);

    var cypWrap = h('div', { class: 'cyp-enzymes' });
    Profile.CYP_ENZYMES.forEach(function (enzyme) {
      var cur = Profile.cypSetting(enzyme, p);
      var seg = h('div', { class: 'seg' }, ['low', 'medium', 'high'].map(function (key) {
        return h('button', {
          class: 'seg-btn' + (cur === key ? ' active' : ''),
          title: Profile.CYP_LABEL[key] + ' — ×' + Profile.CYP_ACTIVITY[key].toFixed(2) +
                 ' enzyme activity. ' + Profile.CYP_DESC[key],
          onclick: function () {
            var next = {};
            Profile.CYP_ENZYMES.forEach(function (e) { next[e] = Profile.cypSetting(e, p); });
            next[enzyme] = key;
            Profile.set({ cyp: next }); openSettings(); render();
          }
        }, [key === 'low' ? 'Slow' : key === 'high' ? 'Fast' : 'Normal']);
      }));
      cypWrap.appendChild(h('div', { class: 'cyp-enzyme-row' }, [
        h('div', { class: 'cyp-enzyme-name' }, [
          h('strong', { text: enzyme }),
          h('p', { class: 'small muted', text: Profile.CYP_ENZYME_NOTE[enzyme] || '' })
        ]),
        seg
      ]));
    });
    body.appendChild(cypWrap);

    // ---- worked example, so the setting is not abstract ----
    var example = DB.get('diazepam');
    if (example) {
      var f = Profile.halfLifeFactor(example, p);
      body.appendChild(h('div', { class: 'note' }, [
        h('strong', { text: 'What this does, concretely: ' }),
        'diazepam is ' + Math.round(Profile.cypFraction(example) * 100) +
        '% CYP-cleared, so at your current setting its estimated half-life is ' +
        Charts.fmtDur(example.halfLife.hours * f) + ' rather than the population figure of ' +
        Charts.fmtDur(example.halfLife.hours) + '. A compound cleared by UGT instead, such as ' +
        'lorazepam, is left untouched.'
      ]));
    }

    var applyToggle = h('input', {
      type: 'checkbox', checked: p.applyToEstimates ? 'checked' : null,
      onchange: function (e) { Profile.set({ applyToEstimates: e.target.checked }); openSettings(); render(); }
    });
    body.appendChild(h('label', { class: 'checkline' }, [
      applyToggle,
      h('span', { text: ' Apply these to the estimates. Turn off to see the raw population figures.' })
    ]));

    body.appendChild(h('h3', { text: 'Current profile' }));
    body.appendChild(summary);
    repaint();

    body.appendChild(h('div', { class: 'note note-warn' }, [
      'These corrections make the estimates less wrong, not right. Body mass is applied as a ' +
      'crude linear scaling, and the metaboliser setting is applied across all CYP clearance at ' +
      'once rather than per-enzyme — real genotypes affect one enzyme at a time. For prodrugs ' +
      'such as codeine and tramadol the effect runs the opposite way, and those pages say so.'
    ]));

    body.appendChild(h('button', {
      class: 'btn small', text: 'Reset to defaults',
      onclick: function () { Profile.reset(); openSettings(); render(); }
    }));

    /* ---- appearance ----------------------------------------------------
       The header carries a one-click theme toggle, which is right for
       switching but wrong for finding: a reader looking for a light mode
       looks in settings. Both write the same preference. */
    body.appendChild(h('h3', { text: 'Appearance' }));
    body.appendChild(h('p', { class: 'muted small', text:
      'Charts, structure drawings and warning colours all follow this. ' +
      'Matching the system means the app changes when the system does.' }));

    var themeSeg = h('div', { class: 'seg' });
    UI.THEMES.forEach(function (m) {
      themeSeg.appendChild(h('button', {
        class: 'seg-btn' + (UI.themeMode() === m ? ' active' : ''),
        text: UI.THEME_LABEL[m],
        onclick: function () { UI.setTheme(m); openSettings(); }
      }));
    });
    body.appendChild(themeSeg);
    if (UI.themeMode() === 'system') {
      body.appendChild(h('p', { class: 'muted small settings-theme-note',
        text: 'Currently showing the ' + UI.resolvedTheme() + ' palette.' }));
    }

    body.appendChild(h('h3', { text: 'Keyboard' }));
    body.appendChild(h('p', { class: 'muted small' }, [
      'Press ', h('kbd', { text: '?' }), ' anywhere for the full list, or ',
      h('kbd', { text: 'Ctrl' }), ' ', h('kbd', { text: 'K' }), ' to search every compound and command.'
    ]));

    openModal(body);
  }

  /* ======================================================================
     SHELL
     ====================================================================== */

  // Log and Timeline used to be tabs of their own. Logging is a modal now —
  // it is a moment's task, not a place — and the timeline lives inside Now,
  // because "what is on board" and "what is on board over time" are one
  // question that was being split across two screens.
  /* [state key, label, icon]. The icon only shows on the phone layout, where
     the bar sits at the bottom and six text labels will not fit across
     375 px without truncating every one of them. */
  var TABS = [
    ['now', 'Now', 'now'],
    ['interactions', 'Interactions', 'interactions'],
    ['solution', 'Solution', 'solution'],
    ['drugs', 'Substances', 'substances'],
    ['stats', 'Patterns', 'patterns'],
    ['faq', 'FAQ', 'faq']
  ];

  /* ======================================================================
     ROUTING
     ----------------------------------------------------------------------
     The app was a single URL. That meant no bookmarking a compound, no
     sending someone a link to one, no browser Back, and a refresh that
     landed you wherever the app felt like starting. All four are things a
     reader reasonably expects from something served over HTTP.

     The hash is written from the state rather than the state being driven
     from the hash: render() is the only thing that knows what is on screen,
     so it is the only thing that writes the address. A hashchange that the
     app did not cause — Back, Forward, a pasted link — reads the other way.
     ====================================================================== */

  var ROUTE_TAB = {
    now: 'now', interactions: 'interactions', solution: 'solution',
    substances: 'drugs', patterns: 'stats', faq: 'faq'
  };
  var TAB_ROUTE = { now: 'now', interactions: 'interactions', solution: 'solution',
                    drugs: 'substances', stats: 'patterns', faq: 'faq' };

  /** The address that describes what is on screen right now. */
  function routeFromState() {
    if (state.tab === 'drugs') {
      if (state.selectedDrug) return '/substance/' + state.selectedDrug;
      return '/substances/' + state.drugPage;
    }
    if (state.tab === 'now') return '/now/' + state.nowPage;
    return '/' + (TAB_ROUTE[state.tab] || 'now');
  }

  /**
   * Read an address into the state. Returns false for anything unrecognised,
   * so a stale or hand-edited link falls back to the default view rather
   * than to a blank screen.
   */
  function applyRoute(hash) {
    var parts = String(hash || '').replace(/^#/, '').split('/').filter(Boolean);
    if (!parts.length) return false;

    if (parts[0] === 'substance') {
      var d = DB.get(decodeURIComponent(parts[1] || ''));
      if (!d) return false;
      state.tab = 'drugs';
      state.selectedDrug = d.id;
      return true;
    }

    var tab = ROUTE_TAB[parts[0]];
    if (!tab) return false;
    state.tab = tab;
    state.selectedDrug = null;

    if (tab === 'now' && parts[1] && NOW_PAGES.some(function (x) { return x.key === parts[1]; })) {
      state.nowPage = parts[1];
    }
    if (tab === 'drugs' && parts[1] && DRUG_PAGES.some(function (x) { return x.key === parts[1]; })) {
      state.drugPage = parts[1];
    }
    return true;
  }

  // Set while the app is writing the address itself, so the hashchange that
  // results is not read back in as a navigation the reader asked for.
  var writingRoute = false;

  function syncRoute() {
    var want = routeFromState();
    if (location.hash.replace(/^#/, '') === want) return;
    writingRoute = true;
    // A new entry, so Back returns to the previous screen. render() runs on
    // data changes too, but those leave the address alone and so add nothing.
    location.hash = want;
    // The event is asynchronous; the flag has to outlive this call stack.
    setTimeout(function () { writingRoute = false; }, 0);
  }

  var TAB_TITLE = {
    now: 'Now', interactions: 'Interactions', solution: 'Solution calculator',
    drugs: 'Substances', stats: 'Patterns', faq: 'FAQ'
  };

  /**
   * Bookmarks, history entries and the browser's tab strip all show the
   * document title, and "drug-info — dose log, pharmacokinetics &
   * interactions" for all of them tells the reader nothing about which page
   * they saved. The compound or the section goes first, where a truncated
   * tab still shows it.
   */
  function syncTitle() {
    var lead;
    if (state.tab === 'drugs' && state.selectedDrug) {
      var d = DB.get(state.selectedDrug);
      lead = d ? d.name : 'Substances';
    } else if (state.tab === 'now') {
      var pg = NOW_PAGES.filter(function (x) { return x.key === state.nowPage; })[0];
      lead = pg ? pg.label : 'Now';
    } else {
      lead = TAB_TITLE[state.tab] || 'drug-info';
    }
    document.title = lead + ' — drug-info';
  }

  function initRouter() {
    window.addEventListener('hashchange', function () {
      if (writingRoute) { writingRoute = false; return; }
      if (applyRoute(location.hash)) {
        // Someone arriving at a compound from the address bar wants the top
        // of it, the same as clicking through to it would give them.
        render();
        window.scrollTo(0, 0);
      }
    });
  }

  /**
   * Move to a tab, and optionally to a page within it.
   *
   * Every route into a tab goes through here — the nav buttons, the number
   * keys and the command palette — so that the incidental state a tab carries
   * (which substance is open, what is being compared against what) is cleared
   * in exactly one place rather than three.
   */
  function goTab(tab, page) {
    state.tab = tab;
    if (tab !== 'drugs') state.selectedDrug = null;
    state.compareRef = null;
    if (page) state.nowPage = page;
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    var nav = $('#nav');
    nav.innerHTML = '';
    TABS.forEach(function (t, i) {
      nav.appendChild(h('button', {
        class: 'tab' + (state.tab === t[0] ? ' active' : ''),
        title: t[1] + '  (' + (i + 1) + ')',
        'aria-current': state.tab === t[0] ? 'page' : null,
        onclick: function () { goTab(t[0]); }
      }, [
        UI.icon(t[2], 21),
        h('span', { class: 'tab-label', text: t[1] })
      ]));
    });

    // Settings sits apart from the tabs — it is a modal rather than a view,
    // and it changes what every tab shows. It is rendered into the appbar
    // beside the theme and keyboard controls, which are the same kind of
    // thing: global, and not a place you navigate to.
    var slot = $('#profile-slot');
    if (slot) {
      var prof = Profile.get();
      slot.innerHTML = '';
      slot.appendChild(h('button', {
        class: 'profile-chip' + (prof.applyToEstimates ? '' : ' off'),
        title: prof.applyToEstimates
          ? 'Profile: ' + prof.weightLb + ' lb, ' + Profile.formatHeight(prof.heightIn) + ', ' +
            cypSummary(prof).full + '. Estimates are adjusted for this. (,)'
          : 'Profile adjustments are switched off — these are raw population figures. (,)',
        onclick: openSettings
      }, [
        h('span', { class: 'pc-icon', text: '⚙' }),
        h('span', { class: 'pc-text', text: prof.weightLb + ' lb · ' + cypSummary(prof).chip })
      ]));
    }

    var main = $('#main');
    main.innerHTML = '';
    var view = h('div', { class: 'view view-' + state.tab });
    main.appendChild(view);

    var views = {
      now: renderNow,
      interactions: renderInteractions,
      solution: renderSolution, drugs: renderDrugs, stats: renderStats,
      faq: renderFaq
    };
    // A saved tab from before Log and Timeline were folded into Now would
    // otherwise land on an undefined renderer.
    (views[state.tab] || renderNow)(view);

    syncRoute();
    syncTitle();
  }

  /* ---------- the first visit ---------------------------------------------
     An empty app explains nothing. Every screen that makes this worth using
     — the timeline, the metabolite chain, the concentration readout, the
     interaction list — needs something logged before it draws anything at
     all, and asking a first-time visitor to type in what drugs they have
     taken before showing them what the thing does is the wrong way round.

     So a browser that has never been here gets two doses of one substance,
     far enough apart to show a redose stacking on an unfinished tail, and
     lands on the timeline with the window and the combined view already set
     to frame them. It is a worked example, and it is labelled as one:
     nobody should mistake it for their own log, and clearing it is one
     click. Clearing it does not bring it back — see Store.isFirstVisit.
     ---------------------------------------------------------------------- */

  function seedExample() {
    var now = Date.now();
    var note = 'Example dose, added automatically on your first visit — not something you logged.';
    Store.save([
      { id: 'demo-1', drugId: 'methamphetamine', amount: 20, unit: 'mg', amountMg: 20,
        route: 'oral', timeMs: now - 24 * HOUR, demo: true, notes: note },
      { id: 'demo-2', drugId: 'methamphetamine', amount: 10, unit: 'mg', amountMg: 10,
        route: 'oral', timeMs: now - 1 * HOUR, demo: true, notes: note }
    ]);
  }

  function hasExample() {
    return Store.load().some(function (l) { return l.demo; });
  }

  function clearExample() {
    // Only the example. Anything logged since is somebody's own data.
    Store.save(Store.load().filter(function (l) { return !l.demo; }));
    render();
  }

  /** Says plainly that the visible data is not the reader's. */
  function exampleBanner() {
    return h('div', { class: 'note note-example' }, [
      h('div', {}, [
        h('strong', { text: 'This is an example, not your log. ' }),
        'Two doses of methamphetamine — 20 mg a day ago and 10 mg an hour ago — were added ' +
        'automatically so there is something to look at. Every figure on the screen is ' +
        'modelled from them. Clear it and the app is empty until you log something yourself.'
      ]),
      h('button', { class: 'btn small', text: 'Clear the example', onclick: clearExample })
    ]);
  }

  function openShortcuts() { openModal(UI.shortcutSheet()); }

  /* ---------- what the command palette can do -----------------------------
     Registered rather than hard-coded into the palette, so that the palette
     never needs to know this file exists. The order here is the order they
     appear on the palette's opening screen.
     ---------------------------------------------------------------------- */

  function registerCommands() {
    UI.registerActions([
      { id: 'now', group: 'nav', icon: '◉', title: 'Now — what is on board', key: '1',
        keywords: 'board active current concentration', run: function () { goTab('now', 'board'); } },
      { id: 'timeline', group: 'nav', icon: '⌇', title: 'Timeline',
        keywords: 'curve chart plot scrub graph', run: function () { goTab('now', 'timeline'); } },
      { id: 'steady', group: 'nav', icon: '≡', title: 'Steady state',
        keywords: 'schedule accumulation repeat dosing', run: function () { goTab('now', 'schedule'); } },
      { id: 'history', group: 'nav', icon: '☰', title: 'Dose history',
        keywords: 'log entries past export', run: function () { goTab('now', 'history'); } },
      { id: 'interactions', group: 'nav', icon: '⚡', title: 'Interactions', key: '2',
        keywords: 'combination danger pair mix', run: function () { goTab('interactions'); } },
      { id: 'solution', group: 'nav', icon: '⚗', title: 'Solution calculator', key: '3',
        keywords: 'volumetric dilution solvent mix concentration', run: function () { goTab('solution'); } },
      { id: 'drugs', group: 'nav', icon: '◇', title: 'Substance database', key: '4',
        keywords: 'compounds list browse', run: function () { goTab('drugs'); } },
      { id: 'stats', group: 'nav', icon: '▤', title: 'Patterns', key: '5',
        keywords: 'stats statistics summary usage', run: function () { goTab('stats'); } },
      { id: 'faq', group: 'nav', icon: '?', title: 'FAQ', key: '6',
        keywords: 'help questions explain', run: function () { goTab('faq'); } },

      { id: 'log', icon: '+', title: 'Log a dose', key: 'N',
        keywords: 'add new entry record took', run: openLogModal },
      { id: 'settings', icon: '⚙', title: 'Profile and settings', key: ',',
        keywords: 'weight height cyp metaboliser genotype', run: openSettings },
      { id: 'theme', icon: '◐', title: 'Switch theme', key: 'T',
        keywords: 'dark light appearance colour color night',
        run: function () { UI.cycleTheme(); } },
      { id: 'shortcuts', icon: '⌨', title: 'Keyboard shortcuts', key: '?',
        keywords: 'keys help bindings', run: openShortcuts },
      { id: 'export-json', icon: '↓', title: 'Export the log as JSON',
        keywords: 'download backup save file',
        run: function () { download('drug-log.json', Store.exportJSON(), 'application/json'); } },
      { id: 'export-csv', icon: '↓', title: 'Export the log as CSV',
        keywords: 'download spreadsheet excel save file',
        run: function () { download('drug-log.csv', Store.exportCSV(), 'text/csv'); } }
    ]);
  }

  /* ---------- keystrokes that depend on where you are ---------------------
     Handed to UI.bindKeys, which owns the "is the reader typing into
     something" question. Each returns true when it consumed the key, so an
     unhandled number key still does whatever the browser would have done.
     ---------------------------------------------------------------------- */

  function keyHandlers() {
    return {
      shortcuts: openShortcuts,
      settings: openSettings,
      log: openLogModal,
      tab: function (i) {
        if (!TABS[i]) return false;
        goTab(TABS[i][0]);
        return true;
      },
      // P pins whatever substance page is open, and does nothing elsewhere.
      pin: function () {
        if (state.tab !== 'drugs' || !state.selectedDrug) return false;
        var d = DB.get(state.selectedDrug);
        if (!d) return false;
        var added = UI.togglePin(d.id);
        render();
        UI.toast(added ? 'Pinned ' + d.name : 'Unpinned ' + d.name,
          { kind: added ? 'ok' : null, icon: added ? '★' : '☆' });
        return true;
      }
    };
  }

  function init() {
    if (Store.isFirstVisit()) { Store.markSeen(); seedExample(); }

    /* The framing belongs to the example rather than to the single first
       render: while it is still there, open on the view that shows what it is
       for — the timeline, two days wide, doses combined so the redose reads as
       one shape rather than two. Tying this to the first render alone meant a
       refresh landed on an empty-looking board page while the banner was still
       saying an example had been set up to look at.

       They are ordinary settings, not preferences written on someone's behalf:
       changing any of them works normally, and clearing the example takes the
       defaults back to the usual ones. */
    if (hasExample()) {
      state.nowPage = 'timeline';
      state.windowH = 48;
      state.timelineMode = 'combined';
    }
    var q = DB.qualityReport();
    $('#db-stats').textContent =
      q.total + ' compounds · ' + q.buckets.measured + ' with measured PK · ' +
      (q.buckets.estimated + q.buckets.analogue + q.buckets.unknown) + ' estimated';
    /* Escape closes the topmost thing. A modal first; failing that, a
       substance page returns to the list — the one place in this app where
       "back" has an unambiguous meaning. The palette handles its own Escape
       ahead of this, in the capture phase. */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if ($('#modal')) { closeModal(); return; }
      if (state.tab === 'drugs' && state.selectedDrug) { state.selectedDrug = null; render(); }
    });

    registerCommands();
    UI.initShell(keyHandlers());
    initRouter();

    /* An address in the bar wins over both the saved defaults and the
       example's framing: someone who followed a link to a compound asked for
       that compound, not for whatever this browser was last looking at. */
    applyRoute(location.hash);

    render();
    setInterval(function () { if (state.tab === 'now') render(); }, 60000);
  }

  global.App = {
    init: init, render: render, openDrug: openDrug, goTab: goTab,
    openLog: openLogModal, openSettings: openSettings, openShortcuts: openShortcuts
  };
})(window);

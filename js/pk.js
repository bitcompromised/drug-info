/* ==========================================================================
   pk.js — Pharmacokinetic model
   --------------------------------------------------------------------------
   One-compartment model with first-order absorption (Bateman function), plus
   a separate "subjective effect envelope" derived from onset/peak/duration.

   Everything here is an ESTIMATE. Real PK varies enormously with individual
   metabolism (CYP polymorphisms), dose, route, tolerance, body composition,
   gastric contents, urinary pH and co-administered drugs.
   ========================================================================== */
(function (global) {
  'use strict';

  var LN2 = Math.log(2);

  /* ---------- core rate constants ---------------------------------------- */

  // Elimination rate constant from half-life (hours).
  function keFromHalfLife(tHalfH) {
    return LN2 / tHalfH;
  }

  /**
   * Absorption rate constant.
   *
   * For a one-compartment model with first-order absorption, time-to-peak is
   *     Tmax = ln(ka/ke) / (ka - ke)
   * There is no closed form for ka, so we solve numerically by bisection on
   * the monotonically decreasing function ka -> Tmax(ka), for ka > ke.
   */
  function kaFromTmax(tmaxH, ke) {
    if (!(tmaxH > 0)) return ke * 60;           // effectively instant (IV)
    var tmaxOf = function (ka) {
      if (Math.abs(ka - ke) < 1e-9) return 1 / ke;  // limiting case ka -> ke
      return Math.log(ka / ke) / (ka - ke);
    };
    var lo = ke * 1.0000001, hi = ke * 1e6;
    if (tmaxOf(lo) < tmaxH) return lo;          // cannot be that slow; clamp
    for (var i = 0; i < 200; i++) {
      var mid = Math.sqrt(lo * hi);             // geometric bisection
      if (tmaxOf(mid) > tmaxH) lo = mid; else hi = mid;
    }
    return Math.sqrt(lo * hi);
  }

  /* ---------- single-dose curves ----------------------------------------- */

  /**
   * Relative amount in the central compartment at time t (hours after dose).
   * Returns dose-scaled units (mg-equivalent); Vd is folded out, so values are
   * comparable within a drug but not across drugs without normalisation.
   */
  function bateman(t, dose, F, ka, ke) {
    if (t <= 0) return 0;
    if (Math.abs(ka - ke) < 1e-9) {             // flip-flop / limiting case
      return F * dose * ke * t * Math.exp(-ke * t);
    }
    return (F * dose * ka / (ka - ke)) * (Math.exp(-ke * t) - Math.exp(-ka * t));
  }

  // Peak value of the above, used to normalise curves to "% of peak".
  function batemanPeak(dose, F, ka, ke, tmaxH) {
    return bateman(tmaxH > 0 ? tmaxH : 1e-4, dose, F, ka, ke);
  }

  /* ---------- zero-order (saturable) kinetics ----------------------------- */

  /**
   * Ethanol and a few others follow Michaelis-Menten elimination that is
   * effectively zero-order at recreational concentrations. Modelled as a
   * linear decline from peak rather than an exponential one.
   *
   * rateFrac: fraction of a *standard* dose eliminated per hour.
   */
  function zeroOrder(t, dose, F, ka, rateAbs) {
    if (t <= 0) return 0;
    var absorbed = F * dose * (1 - Math.exp(-ka * t));
    var eliminated = rateAbs * t;
    return Math.max(0, absorbed - eliminated);
  }

  /* ---------- subjective effect envelope ---------------------------------- */

  /**
   * Plasma concentration is a poor proxy for how a drug *feels* — acute
   * tolerance (cocaine), active metabolites (heroin -> morphine) and receptor
   * kinetics (buprenorphine) all decouple the two. This builds a piecewise
   * envelope straight from the reported onset / peak / duration / after-effect
   * windows, which is what a timeline actually needs.
   *
   * phases (hours from dose):
   *   0 .. onset          nothing
   *   onset .. peak       raised-cosine ramp up to 1.0
   *   peak .. plateauEnd  plateau at 1.0
   *   plateauEnd .. off   raised-cosine ramp down to `tailLevel`
   *   off .. afterEnd     linear decay of the after-effect tail to 0
   */
  function effectEnvelope(t, ph) {
    var TAIL = 0.18;
    if (t <= ph.onset) return 0;
    if (t < ph.peak) {
      var u = (t - ph.onset) / Math.max(1e-6, ph.peak - ph.onset);
      return 0.5 - 0.5 * Math.cos(Math.PI * u);
    }
    if (t < ph.plateauEnd) return 1;
    if (t < ph.off) {
      var v = (t - ph.plateauEnd) / Math.max(1e-6, ph.off - ph.plateauEnd);
      return TAIL + (1 - TAIL) * (0.5 + 0.5 * Math.cos(Math.PI * v));
    }
    if (t < ph.afterEnd) {
      var w = (t - ph.off) / Math.max(1e-6, ph.afterEnd - ph.off);
      return TAIL * (1 - w);
    }
    return 0;
  }

  /**
   * Derive envelope phase boundaries (hours) from a route record.
   * Route timings are stored as [min, max] ranges; we take the midpoint and
   * let dose scale the duration mildly (higher dose = longer, sub-linear).
   */
  function phasesFor(route, doseRatio) {
    var mid = function (r, dflt) {
      if (r == null) return dflt;
      if (typeof r === 'number') return r;
      return (r[0] + r[1]) / 2;
    };
    var scale = Math.pow(Math.max(0.25, doseRatio || 1), 0.35);

    /* `durationH` is how long the EXPERIENCE lasts, which is what a dosing
       table has to say and what anyone reading the page wants. For most
       compounds that is also how long the compound is doing something.

       Where it is not — a prodrug whose published duration belongs to its
       products — the route says `effectFollowsAmount` instead and never
       reaches this function at all. See buildDoseCurve. */
    var onset = mid(route.onsetMin, 30) / 60;
    var peak = mid(route.peakMin, 60) / 60;
    var dur = mid(route.durationH, 4) * scale;
    var after = mid(route.afterEffectsH, 0) * scale;

    if (peak <= onset) peak = onset + Math.max(0.05, dur * 0.1);
    var off = Math.max(peak + 0.1, onset + dur);
    var plateauEnd = peak + (off - peak) * 0.25;   // short plateau after peak

    return {
      onset: onset,
      peak: peak,
      plateauEnd: plateauEnd,
      off: off,
      afterEnd: off + after
    };
  }

  /* ---------- half-life adjustment from PK interactions ------------------- */

  /**
   * Enzyme inhibition can multiply a drug's half-life several-fold — this is
   * the mechanism behind a large share of fatal drug interactions (e.g. a
   * CYP2D6 inhibitor plus a 2D6-dependent stimulant, or a CYP3A4 inhibitor
   * plus a benzodiazepine). `modifiers` comes from the interaction engine.
   */
  function effectiveHalfLife(drug, modifiers) {
    var base = drug.halfLife && drug.halfLife.hours ? drug.halfLife.hours : 4;
    var mult = 1;
    (modifiers || []).forEach(function (m) { mult *= m.factor; });
    return { hours: base * mult, multiplier: mult, base: base };
  }

  /* ---------- public: build a dose curve ---------------------------------- */

  /**
   * Build sampling functions for one logged dose.
   *
   * entry: { drug, route, dose, unit, tStartH }  (tStartH = hours from window origin)
   * opts:  { halfLifeH }  overrides the drug's half-life (interaction-adjusted)
   */
  function buildDoseCurve(drug, routeKey, doseMg, tStartH, opts) {
    opts = opts || {};
    var route = (drug.routes && (drug.routes[routeKey] || drug.routes[Object.keys(drug.routes)[0]])) || {};
    var tHalf = opts.halfLifeH || (drug.halfLife && drug.halfLife.hours) || 4;
    var F = route.bioavailability != null ? route.bioavailability : 1;
    var tmaxH = (route.peakMin ? ((route.peakMin[0] + route.peakMin[1]) / 2) : 60) / 60;

    var ke = keFromHalfLife(tHalf);
    var ka = kaFromTmax(tmaxH, ke);

    var common = commonDoseMg(drug, routeKey) || doseMg || 1;
    var doseRatio = doseMg ? doseMg / common : 1;

    var isZeroOrder = !!(drug.kinetics && drug.kinetics.order === 'zero');
    var zRate = isZeroOrder ? (drug.kinetics.mgPerHour || (common / 2)) : 0;

    function amountOf(t) {
      if (t <= 0) return 0;
      return isZeroOrder ? zeroOrder(t, doseMg, F, ka, zRate)
                         : bateman(t, doseMg, F, ka, ke);
    }

    /* ---- when the effect IS how much is there --------------------------
       The envelope is built from reported onset/peak/duration windows, and
       for most compounds that is the right source: what a drug feels like
       over time is its own fact, not a restatement of its concentration.
       LSD outlasts its plasma curve, cannabis undershoots it, and both have
       to keep doing so.

       A short-lived parent has no such story. Its effect is simply how much
       of it is there, and driving it off a published window went wrong in
       both directions at once. Those windows describe the EXPERIENCE, which
       for a prodrug belongs to the products — so heroin drew fifteen hours
       of parent effect. And the window is stretched by dose, sub-linearly,
       which on a gram of intravenous heroin — sixty-seven times a common
       dose — turned a sixteen-minute window into seventy-two, of which the
       first seventeen minutes sat at maximum. The compound is 97% cleared
       at eighteen. It was at full effect on 1.9% of the dose and only began
       to fall once there was nothing left.

       `effectFollowsAmount` takes the shape from the curve instead:

           effect = sqrt(amount / peak amount) x dose intensity

       the same square-root concentration-effect compression already used to
       derive the metabolites' curves, so a parent and its products are
       built the same way. Dose scaling comes out for free and comes out
       right — a bigger dose stays above any given level longer because it
       has further to fall, not because a heuristic stretched a window.

       Phases come from the same curve, so the phase pill on a card and the
       curve underneath it cannot disagree. */
    var followsAmount = !!route.effectFollowsAmount;
    var peakAmt = 0, peakAmtAt = tmaxH > 0 ? tmaxH : 1e-4;
    var ph;

    if (followsAmount) {
      var horizon = Math.max(tmaxH * 4, tmaxH + 8 * tHalf, 1e-3);
      for (var pi = 1; pi <= 400; pi++) {
        var pt = (pi / 400) * horizon, pv = amountOf(pt);
        if (pv > peakAmt) { peakAmt = pv; peakAmtAt = pt; }
      }
      // Bisection on whichever limb of the curve the level sits on.
      var relAt = function (t) { return peakAmt > 0 ? amountOf(t) / peakAmt : 0; };
      var cross = function (target, lo, hi, rising) {
        for (var i = 0; i < 40; i++) {
          var m = (lo + hi) / 2;
          if (rising ? relAt(m) < target : relAt(m) > target) lo = m; else hi = m;
        }
        return (lo + hi) / 2;
      };
      ph = {
        onset: cross(0.05, 0, peakAmtAt, true),
        peak: peakAmtAt,
        plateauEnd: cross(0.90, peakAmtAt, horizon, false),
        off: cross(0.20, peakAmtAt, horizon, false),
        afterEnd: cross(0.02, peakAmtAt, horizon, false)
      };
    } else {
      ph = phasesFor(route, doseRatio);
    }

    // Normaliser: peak of a *common* dose, so 100% on the y-axis means
    // "plasma level of one typical dose of this substance".
    var refPeak = isZeroOrder
      ? F * common * 0.9
      : batemanPeak(common, F, ka, ke, tmaxH);

    return {
      drug: drug,
      routeKey: routeKey,
      route: route,
      doseMg: doseMg,
      tStartH: tStartH,
      halfLifeH: tHalf,
      ke: ke,
      ka: ka,
      tmaxH: tmaxH,
      phases: ph,
      commonDoseMg: common,
      doseRatio: doseRatio,

      // Plasma level as a fraction of one common dose's peak.
      concAt: function (tAbsH) {
        var t = tAbsH - tStartH;
        if (t <= 0) return 0;
        var amt = isZeroOrder
          ? zeroOrder(t, doseMg, F, ka, zRate)
          : bateman(t, doseMg, F, ka, ke);
        return refPeak > 0 ? amt / refPeak : 0;
      },

      // Subjective effect, 0..1 scaled by dose intensity.
      //
      // `effectScale` carries the user's body mass relative to the ~70 kg adult
      // the published dose ladders assume. It scales the felt intensity without
      // touching the tier, because the tier is a statement about what the
      // literature says, not about this person.
      effectAt: function (tAbsH) {
        var scaled = doseRatio * (opts.effectScale != null ? opts.effectScale : 1);
        var intensity = Math.min(2.5, Math.pow(Math.max(0.05, scaled), 0.5));
        if (followsAmount) {
          /* Against the peak of a COMMON dose, not against this dose's own,
             so the dose is in the answer twice over and both times rightly:
             a bigger dose starts higher AND stays above any given level
             longer, because it has further to fall. Normalising to its own
             peak would have made a gram and a common dose the same shape.
             At its peak this reduces to the same intensity every other
             curve uses, so nothing else shifts. */
          var rel = refPeak > 0 ? amountOf(tAbsH - tStartH) / refPeak : 0;
          if (!(rel > 0)) return 0;
          return Math.min(2.5, Math.sqrt(rel * (opts.effectScale != null ? opts.effectScale : 1)));
        }
        return effectEnvelope(tAbsH - tStartH, ph) * intensity;
      },

      /**
       * Milligrams in the central compartment — the drug that is actually
       * circulating and doing something.
       *
       * This is the figure every milligram readout in the app should use. The
       * old one derived milligrams from `fractionRemaining`, which is 1 for
       * the whole absorption phase, so the amount jumped to the full absorbed
       * dose the instant a dose was logged and sat flat until tmax. Oral
       * methamphetamine read 67 mg at six seconds where the real figure is
       * 0.8 mg, and every mg curve had a vertical step at each dose instead of
       * a rise. The Bateman function already had the right answer; nothing was
       * asking it.
       */
      amountMgAt: function (tAbsH) {
        var t = tAbsH - tStartH;
        if (t <= 0) return 0;
        return isZeroOrder
          ? zeroOrder(t, doseMg, F, ka, zRate)
          : bateman(t, doseMg, F, ka, ke);
      },

      // The peak of the above, for normalising a curve against itself.
      peakAmountMg: function () {
        if (isZeroOrder) return zeroOrder(tmaxH > 0 ? tmaxH : 1e-4, doseMg, F, ka, zRate);
        return batemanPeak(doseMg, F, ka, ke, tmaxH);
      },

      /**
       * Fraction of the absorbed dose not yet eliminated.
       *
       * Drug still waiting in the gut counts: it has not been eliminated, and
       * it is going to arrive. So this is the central compartment plus the
       * unabsorbed remainder, which starts at 1 and falls monotonically — the
       * behaviour "dose remaining" implies.
       *
       * It used to return exactly 1 until tmax, which said no elimination
       * happens during absorption. Elimination starts with the first molecule
       * absorbed, and for a slow-absorbing drug that phase is hours long.
       */
      fractionRemaining: function (tAbsH) {
        var t = tAbsH - tStartH;
        // Before the dose there is nothing, not "all of it". Several callers
        // use this to decide whether a dose is on board at all, and a dose
        // logged for later must not count as active now.
        if (t <= 0) return 0;
        if (isZeroOrder) {
          var left = Math.max(0, F * doseMg - zRate * t);
          return left / (F * doseMg);
        }
        var unabsorbed = Math.exp(-ka * t);
        var central = Math.abs(ka - ke) < 1e-9
          ? ke * t * Math.exp(-ke * t)
          : (ka / (ka - ke)) * (Math.exp(-ke * t) - Math.exp(-ka * t));
        return Math.max(0, Math.min(1, unabsorbed + central));
      },

      // Hours from dose until only `frac` of the dose remains.
      timeToFraction: function (frac) {
        if (isZeroOrder) return (F * doseMg * (1 - frac)) / Math.max(1e-9, zRate);
        return tmaxH + Math.log(1 / frac) / ke;
      },

      // Practical clearance point (~97%, i.e. 5 half-lives).
      clearanceH: function () {
        return isZeroOrder
          ? (F * doseMg) / Math.max(1e-9, zRate)
          : tmaxH + 5 * tHalf;
      },

      // Where this dose sits on the drug's own dose ladder.
      intensityLabel: function () { return doseTier(drug, routeKey, doseMg); }
    };
  }

  /* ---------- dose ladder helpers ----------------------------------------- */

  function routeDoses(drug, routeKey) {
    var r = drug.routes && (drug.routes[routeKey] || drug.routes[Object.keys(drug.routes)[0]]);
    return r && r.doses ? r.doses : null;
  }

  /**
   * Dose ladders declare their own unit ('mg', 'g', 'ml', 'canisters'…) while
   * logged amounts are normalised to mg by Store.toMg. Both sides must use the
   * same scale or the dose ratio is wrong by a factor of 1000 — which then
   * corrupts the effect intensity, the dose tier and the phase timings.
   * Units Store leaves alone (ml, canisters, inhalations) are left alone here too.
   */
  var LADDER_UNIT_TO_MG = { ng: 1e-6, ug: 0.001, 'µg': 0.001, mcg: 0.001, mg: 1, g: 1000 };

  function ladderScale(doses) {
    var f = LADDER_UNIT_TO_MG[(doses && doses.unit) || 'mg'];
    return f != null ? f : 1;
  }

  function commonDoseMg(drug, routeKey) {
    var d = routeDoses(drug, routeKey);
    if (!d || !d.common) return null;
    var v = Array.isArray(d.common) ? (d.common[0] + d.common[1]) / 2 : d.common;
    return v * ladderScale(d);
  }

  function doseTier(drug, routeKey, doseMg) {
    var d = routeDoses(drug, routeKey);
    if (!d || doseMg == null) return { tier: 'unknown', ratio: null };
    var s = ladderScale(d);
    var lo = function (x) { return (Array.isArray(x) ? x[0] : x) * s; };
    var common = commonDoseMg(drug, routeKey);
    var ratio = common ? doseMg / common : null;

    if (d.heavy != null && doseMg >= lo(d.heavy)) return { tier: 'heavy', ratio: ratio };
    if (d.strong != null && doseMg >= lo(d.strong)) return { tier: 'strong', ratio: ratio };
    if (d.common != null && doseMg >= lo(d.common)) return { tier: 'common', ratio: ratio };
    if (d.light != null && doseMg >= lo(d.light)) return { tier: 'light', ratio: ratio };
    if (d.threshold != null && doseMg >= lo(d.threshold)) return { tier: 'threshold', ratio: ratio };
    return { tier: 'sub-threshold', ratio: ratio };
  }

  /* ---------- metabolite kinetics ----------------------------------------- */

  /**
   * Strip a parenthesised synonym: "Morphine-6-glucuronide (M6G)" -> the bare
   * name. Metabolite names are free text and the same compound is written
   * both ways in different entries, so every comparison goes through this.
   */
  function bareName(name) {
    return String(name || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  }

  function normName(name) {
    return bareName(name).toLowerCase().replace(/[\s\-_,()]/g, '');
  }

  /**
   * The metabolites a compound makes DIRECTLY, as against everything that
   * eventually appears downstream of it.
   *
   * A metabolism block lists every product in one flat array, which is fine
   * for a table and wrong for a chain. Gidazepam's list holds both
   * desalkylgidazepam and hydroxy-desalkylgidazepam, but the second is made
   * from the first, not from gidazepam — and the pathway row says so, with
   * `from: 'Desalkylgidazepam'`. Anything named as the product of a `from:`
   * step is therefore somebody else's child and is skipped here; the
   * recursion below picks it up under the right parent.
   *
   * A metabolite can also say it directly. Several compounds list a product
   * that no pathway row produces — the benzodiazepines that funnel through
   * nordazepam list oxazepam without a row for it — and there is nothing for
   * a `from:` on a pathway to attach to. `from` on the metabolite itself
   * covers that without inventing a pathway row that the literature does not
   * support.
   */
  function directMetabolites(source) {
    var meta = source && source.metabolism;
    if (!meta) return [];
    var downstream = Object.create(null);
    (meta.pathways || []).forEach(function (p) {
      if (!p.from) return;
      var prods = (p.products && p.products.length) ? p.products : [{ name: p.product }];
      prods.forEach(function (prod) { downstream[normName(prod.name)] = true; });
    });
    return (meta.metabolites || []).filter(function (m) {
      if (m.from) return false;                  // names its own precursor
      return !downstream[normName(m.name)];
    });
  }

  /**
   * "None significant" is how an entry records that a compound is NOT
   * meaningfully metabolised. As a row in that compound's own table it says
   * something; as a node hanging off a chain it is a compound that does not
   * exist, with a half-life and an amount and a card of its own. It is kept
   * where it was written and dropped everywhere below that.
   */
  function isPlaceholderProduct(name) {
    var n = normName(name);
    return n === 'none' || n.indexOf('nonesignificant') === 0 ||
           n === 'noneidentified' || n === 'nonereported' || n === 'nonknown';
  }

  /**
   * The pathway row that produces a given metabolite, if one names it.
   *
   * Needed because a row is what CONSUMES the parent, and several products
   * can come out of one. See the partition rule in metaboliteTree.
   */
  function producingRow(source, metabolite) {
    var paths = (source && source.metabolism && source.metabolism.pathways) || [];
    var want = normName(metabolite.name);

    /* A product name is prose and frequently names several compounds at once:
       lisdexamfetamine's hydrolysis row has one product written
       "Dextroamphetamine + L-lysine", and morphine's has "M3G / M6G". Strict
       comparison finds neither, which is how the cleavage rows kept being
       charged twice. Split the way formationFractionFor already does. */
    var names = function (str) {
      return String(str || '').split(/[/,+]|and/).map(normName).filter(Boolean);
    };

    for (var i = 0; i < paths.length; i++) {
      var prods = paths[i].products || [];
      for (var j = 0; j < prods.length; j++) {
        if (names(prods[j].name).indexOf(want) >= 0) return paths[i];
      }
      if (names(paths[i].product).indexOf(want) >= 0) return paths[i];
    }
    return null;
  }

  /** The compound entry for a metabolite name, when the database has one. */
  function entryFor(name) {
    var DB = global.DB;
    if (!DB || !DB.get) return null;
    return DB.get(bareName(name)) || null;
  }

  var MAX_DEPTH = 4;      // gidazepam's longest real chain is 2; opioids reach 3
  var MAX_NODES = 16;     // a cap on the integration, not on the pharmacology

  /**
   * Every metabolite a dose produces, to any depth, as one integrated system.
   *
   * The single-metabolite version of this modelled one compartment fed by the
   * parent. That is right as far as it goes and stops exactly where the
   * interesting cases start: methamphetamine's amphetamine is itself
   * metabolised to 4-hydroxyamphetamine, which is itself metabolised to
   * 4-hydroxynorephedrine, and a model that stops at the first generation
   * says those last two do not exist. Gidazepam is worse — it is a prodrug,
   * so the compound you actually have is a second-generation product.
   *
   * So the whole chain is built as a tree and integrated at once:
   *
   *     dM_i/dt = fm_i · ke_parent(i) · A_parent(i)(t)  −  ke_i · M_i(t)
   *
   * where the root's "parent" is the dose itself. One forward pass fills
   * every compartment, which is both faster than integrating each separately
   * and the only way to get the timing right — a grandchild's peak depends on
   * when its parent peaked, not on when the dose was taken.
   *
   * TWO SOURCES FEED THE FIRST GENERATION, and they arrive at completely
   * different times:
   *
   *   systemic     what the body clears out of the circulation afterwards,
   *                formed at the parent's elimination rate.
   *   presystemic  what the liver took on the way in and never let through,
   *                formed at the ABSORPTION rate — it is already metabolite
   *                by the time the parent's own curve starts.
   *
   * That split is what route-specific first-pass avoidance buys. Two thirds
   * of an oral midazolam dose becomes 1'-hydroxymidazolam before any
   * midazolam circulates; the nasal spray's does not. Modelling both as
   * elimination-driven put the metabolite hours late and understated it.
   */
  function metaboliteTree(curve) {
    if (curve.__metTree) return curve.__metTree;

    var route = curve.route || {};
    var Fsys = route.bioavailability != null ? route.bioavailability : 1;
    var Fmet = route.metabolisedFraction != null ? route.metabolisedFraction : Fsys;
    var Fpre = route.presystemicFraction != null
      ? route.presystemicFraction
      : Math.max(0, Fmet - Fsys);

    /* ---- 1. discover the tree ---- */

    var nodes = [];

    function expand(source, parentIndex, parentHalfLife, parentName, depth, ancestry) {
      if (depth > MAX_DEPTH) return;

      /* ---- the products of one pool cannot add up to more than the pool --
         Formation fractions are written per pathway, from whatever the
         literature reported for that step, and nothing ever made them add
         up. Where the declared shares exceed the pool they are read as
         relative yields and scaled to fit, which keeps their proportions and
         only fixes the impossible total. Under 1 is left alone: the
         remainder is the dose going down routes this entry does not
         enumerate, which is normal and is a different claim.

         WHAT COUNTS AGAINST THE POOL IS A ROW, NOT A PRODUCT. A row is one
         reaction, and one reaction can put out several things at once. Two
         competing routes each take their own share of the parent; a cleavage
         takes ONE share and emits two products from it. Lisdexamfetamine is
         hydrolysed to dextroamphetamine and lysine — the molecule comes
         apart, both halves are 100% of the dose, and summing the products
         gave 2.0 and then halved both. Sucrose into glucose and fructose,
         dimenhydrinate dissociating into its two components: same shape,
         same wrong answer.

         The data already tells the two apart and nothing was reading it. A
         competing fork's products sum to the row's own fraction — morphine's
         UGT2B7 row is 0.65, made of M3G at 0.55 and M6G at 0.10. A cleavage's
         do not. So the pool is charged once per row. */
      var mets = directMetabolites(source).filter(function (m) {
        return !(depth > 0 && isPlaceholderProduct(m.name)) && !ancestry[normName(m.name)];
      });
      var shares = mets.map(function (m) { return formationFractionFor(source, m); });

      var charged = [], declared = 0;
      mets.forEach(function (m, mi) {
        var row = producingRow(source, m);
        if (!row) { declared += shares[mi].fraction; return; }   // no row names it
        if (charged.indexOf(row) >= 0) return;                   // already paid for
        charged.push(row);
        declared += row.fraction != null ? row.fraction : shares[mi].fraction;
      });
      var fit = declared > 1 ? 1 / declared : 1;

      mets.forEach(function (m, mi) {
        if (nodes.length >= MAX_NODES) return;
        var key = normName(m.name);
        var f = shares[mi];
        var idx = nodes.length;
        nodes.push({
          name: m.name,
          record: m,
          parent: parentIndex,
          parentName: parentName,
          depth: depth,
          active: !!m.active,
          halfLifeH: m.halfLifeH || parentHalfLife,
          potencyRel: m.potencyRel,
          note: m.note,
          formationFraction: f.fraction * fit,
          // Whether the first pass runs straight through this one. See the
          // integration below.
          presystemicTransient: !!m.presystemicTransient,
          declaredFraction: f.fraction,
          fractionScaled: fit < 1,
          formationInferred: !!f.inferred,
          outlastsParent: (m.halfLifeH || parentHalfLife) > parentHalfLife * 1.2,
          children: []
        });
        if (parentIndex >= 0) nodes[parentIndex].children.push(idx);

        /* The chain gets its depth from the metabolite's OWN entry.
           Diazepam's page does not have to know that nordazepam becomes
           oxazepam — nordazepam's page knows, and that is where it is
           recorded. Same mechanism the pathway diagram already uses. */
        var entry = entryFor(m.name);
        if (!entry || entry.id === curve.drug.id) return;
        var next = Object.create(ancestry);
        next[key] = true;
        next[normName(entry.name)] = true;
        expand(entry, idx, nodes[idx].halfLifeH, m.name, depth + 1, next);
      });
    }

    var rootSource = { metabolism: metabolismFor(curve) };
    var rootAncestry = Object.create(null);
    rootAncestry[normName(curve.drug.name)] = true;
    expand(rootSource, -1, curve.halfLifeH, curve.drug.name, 0, rootAncestry);

    if (!nodes.length) { curve.__metTree = []; return curve.__metTree; }

    /* ---- 2. integrate the whole system in one pass ---- */

    var keP = curve.ke, ka = curve.ka;
    var ke = nodes.map(function (n) { return keFromHalfLife(n.halfLifeH); });

    var horizon = nodes.reduce(function (a, n) {
      return Math.max(a, curve.tmaxH + 6 * n.halfLifeH);
    }, curve.clearanceH());

    /* Fine enough to resolve the shortest-lived compartment, and the
       absorption that feeds it.

       The absorption bound used to be applied only to routes with something
       presystemic to deliver, which left every fast route under-resolved:
       insufflated flunitrazepam absorbs in minutes against a horizon of
       days, so the first Euler step covered the whole of absorption and the
       first few minutes of every metabolite read several times high. The
       parent's own kinetics need resolving whether or not anything is
       formed on the way in. */
    var finest = nodes.reduce(function (a, n) {
      return Math.min(a, n.halfLifeH);
    }, curve.halfLifeH) / 12;
    if (ka > 0) finest = Math.min(finest, 1 / (4 * ka));
    var STEPS = Math.max(900, Math.min(4000, Math.ceil(horizon / Math.max(1e-6, finest))));
    var dt = horizon / STEPS;

    var n = nodes.length;
    var amt = [], cum = [];
    for (var i = 0; i < n; i++) {
      amt.push(new Float64Array(STEPS + 1));
      cum.push(new Float64Array(STEPS + 1));
    }
    var cur = new Float64Array(n), running = new Float64Array(n);
    var preDose = Fpre * curve.doseMg;

    /* ---- how much of each pool has been consumed, by mass balance --------
       A compartment forms its products out of whatever has LEFT the one above
       it, and that quantity never has to be integrated: what has left a pool
       is what went in minus what is still there. For the dose itself both
       halves are analytic —

           eliminated from the circulation = F·D·(1 − e^⁻ᵏᵃᵗ) − A(t)
           taken on the way in             = F_pre·D·(1 − e^⁻ᵏᵃᵗ)

       — and for every compartment below it, `formed − present` is exact by
       construction.

       Driving formation from that rather than from rate × dt takes all the
       integration error out of the inflow, which is where it was. The rate
       form was fine for a slow oral dose and badly wrong for a fast one: a
       smoked dose absorbs inside a single step of a horizon measured in days,
       so one coarse rectangle stood in for the whole absorption peak and the
       first few minutes of every metabolite read up to twice high. Only each
       compartment's own decay is stepped now, and that is bounded by the
       shortest half-life in the tree. */
    /* ---- the first pass can run more than one step ----------------------
       Presystemic conversion was treated as ending at the first product: the
       liver made it, and it went into the circulation. That is right for
       most compounds — oral midazolam really does deliver circulating
       1'-hydroxymidazolam — and wrong wherever the chain keeps going before
       the drug ever leaves the portal circulation.

       Swallowed heroin is the case: it is deacetylated to 6-MAM and the
       6-MAM is deacetylated to morphine, both in the gut wall and liver,
       and what arrives is morphine. Stopping the cascade at 6-MAM gave a
       swallowed gram about 94 mg of circulating 6-MAM — a rush that this
       route cannot produce, and the single thing that distinguishes
       swallowing heroin from injecting it.

       So the flux is tracked in two parts. What has been round the body
       (`sysSupply`) behaves as it always did. What has not yet left the
       first pass (`preSupply`) runs through any metabolite marked
       `presystemicTransient` without entering its compartment, and lands in
       the first product that is not. Nothing is lost either way: a transient
       intermediate still counts everything that was ever made of it, it just
       does not circulate as it. And the small share of the dose that DOES
       reach the blood as the parent still makes its trace of the
       intermediate the ordinary way, because that part never saw the liver
       first. */
    var sysSupply = new Float64Array(n + 1);   // [0] is the dose; [k+1] is node k
    var prevSys = new Float64Array(n + 1);
    var preSupply = new Float64Array(n + 1);
    var prevPre = new Float64Array(n + 1);
    var entered = new Float64Array(n);         // what actually reached each compartment

    for (var step = 1; step <= STEPS; step++) {
      var t = step * dt;
      var absorbedFrac = 1 - Math.exp(-ka * t);
      var Ap = bateman(t, curve.doseMg, Fsys, ka, keP);
      sysSupply[0] = Math.max(0, Fsys * curve.doseMg * absorbedFrac - Ap);
      preSupply[0] = preDose * absorbedFrac;

      for (var k = 0; k < n; k++) {
        var node = nodes[k];
        // Parents are always earlier in the array, so a child reads its
        // parent's supply for this same step rather than the last one.
        var pi = node.parent < 0 ? 0 : node.parent + 1;
        var dSys = node.formationFraction * (sysSupply[pi] - prevSys[pi]);
        var dPre = node.formationFraction * (preSupply[pi] - prevPre[pi]);
        if (dSys < 0) dSys = 0;
        if (dPre < 0) dPre = 0;

        // Everything ever made of it, whether or not it circulated as it.
        running[k] += dSys + dPre;

        var arriving = node.presystemicTransient ? dSys : dSys + dPre;
        entered[k] += arriving;
        cur[k] += arriving - ke[k] * cur[k] * dt;
        if (cur[k] < 0) cur[k] = 0;
        amt[k][step] = cur[k];
        cum[k][step] = running[k];

        sysSupply[k + 1] = entered[k] - cur[k];
        // A transient node hands the first pass straight on; anything else
        // ends it, and its own products form out of ordinary clearance.
        preSupply[k + 1] = node.presystemicTransient ? prevPre[k + 1] + dPre : 0;
      }

      var sw = prevSys; prevSys = sysSupply; sysSupply = sw;
      sw = prevPre; prevPre = preSupply; preSupply = sw;
    }

    /* ---- 3. wrap each compartment in a sampler ---- */

    nodes.forEach(function (node, idx) {
      var a = amt[idx], c = cum[idx], keM = ke[idx];

      /* Past the end of the window the two arrays behave in opposite ways.
         `cum` is a running total, so it plateaus at everything ever formed —
         correct. `amt` is a quantity present, and freezing it there would
         make the metabolite immortal: with a dose history spanning days,
         amphetamine from methamphetamine would settle at 1.2 mg and still be
         sitting there a year later. Beyond the horizon the chain above it is
         effectively empty, so nothing more forms and it decays at its own
         rate — exact rather than approximate, which is what stops the
         horizon's exact length from mattering. */
      var sampleFlat = function (tSince) {
        if (tSince <= 0) return 0;
        if (tSince >= horizon) return c[STEPS];
        var x = tSince / dt, i0 = Math.floor(x), f = x - i0;
        return c[i0] * (1 - f) + c[Math.min(STEPS, i0 + 1)] * f;
      };
      var sampleDecaying = function (tSince) {
        if (tSince <= 0) return 0;
        if (tSince >= horizon) return a[STEPS] * Math.exp(-keM * (tSince - horizon));
        var x = tSince / dt, i0 = Math.floor(x), f = x - i0;
        return a[i0] * (1 - f) + a[Math.min(STEPS, i0 + 1)] * f;
      };

      var peak = 0, peakStep = 0;
      for (var s = 0; s <= STEPS; s++) if (a[s] > peak) { peak = a[s]; peakStep = s; }

      node.amountAt = function (tAbsH) { return sampleDecaying(tAbsH - curve.tStartH); };
      node.cumulativeFormedAt = function (tAbsH) { return sampleFlat(tAbsH - curve.tStartH); };
      node.relativeAt = function (tAbsH) {
        return peak > 0 ? sampleDecaying(tAbsH - curve.tStartH) / peak : 0;
      };
      node.peakAmount = peak;
      node.tmaxH = peakStep * dt;
      node.totalFormed = c[STEPS];
      node.clearanceH = function () { return node.tmaxH + 5 * node.halfLifeH; };

      /* When it first shows up at all, measured from the dose. A
         second-generation metabolite can be hours behind the parent, and the
         cards are ordered by this so the list reads in the order things
         actually appeared. */
      var appear = horizon;
      for (var q = 1; q <= STEPS; q++) {
        if (peak > 0 && a[q] >= peak * 0.005) { appear = q * dt; break; }
      }
      node.firstPresentH = appear;

      // The record is only needed while the tree is being built.
      delete node.record;
    });

    curve.__metTree = nodes;
    return nodes;
  }

  /**
   * Full metabolite breakdown for one logged dose, flattened.
   *
   * Parents always come before their children, so anything walking the list
   * and following `parent` indexes sees a well-formed tree.
   */
  function metaboliteBreakdown(curve) {
    return metaboliteTree(curve);
  }

  /**
   * Which pathway produces a given metabolite, and therefore what share of the
   * dose it accounts for. Matching is by name because the data records the
   * product as free text (e.g. "HMMA (4-hydroxy-3-methoxymethamphetamine)").
   */
  /**
   * `source` is normally the compound, but a route that declares its own
   * metabolism passes that instead — see the route-level `metabolism` block
   * in db.js. Anything with a `.metabolism` works, which is also what lets the
   * recursion above hand it a metabolite's own entry.
   */
  function formationFractionFor(source, metabolite) {
    if (metabolite.fraction != null) {
      return { fraction: metabolite.fraction, inferred: false };
    }

    var paths = (source.metabolism && source.metabolism.pathways) || [];
    var norm = function (s) { return String(s || '').toLowerCase().replace(/[\s\-_,()]/g, ''); };
    var mName = norm(metabolite.name);

    /* ---- a forked pathway's products each have their own share -----------
       One enzyme with several outcomes is a single row whose `fraction` is
       the SUM of its products. Matching against that row gave every product
       the whole enzyme's share, so a 50% route and a 12% one both reported
       62%. The per-product share is the answer whenever the product carries
       one; the row total is only the fallback for single-product rows. */
    var exact = null;
    paths.forEach(function (p) {
      (p.products || []).forEach(function (prod) {
        if (prod.fraction == null) return;
        var pn = norm(prod.name);
        if (pn === mName) { if (exact == null) exact = prod.fraction; }
      });
    });
    if (exact != null) return { fraction: exact, inferred: false };

    var best = null, bestScore = 0;
    paths.forEach(function (p) {
      if (p.fraction == null) return;
      // Products are free text and may list alternatives ("M3G / M6G").
      String(p.product || '').split(/[\/,]/).forEach(function (part) {
        var prod = norm(part);
        if (!prod) return;
        // Compare against whole tokens too: "HHMA (3,4-dihydroxymethamphetamine)"
        // yields ["hhma", "34dihydroxy…"]. Plain substring matching would let a
        // short name like "HMA" claim the HHMA pathway's share.
        var tokens = String(part).split(/[\s()]+/).map(norm).filter(Boolean);
        var score = 0;
        if (prod === mName || tokens.indexOf(mName) >= 0) {
          score = 100;                                   // exact, or an exact token
        } else if (mName.length >= 6 && prod.indexOf(mName) >= 0) {
          // Long, distinctive names may appear inside a longer product string.
          score = 80;
        } else if (mName.indexOf(prod) >= 0 && prod.length / mName.length > 0.6) {
          // Metabolite name extends the product name. Only trust this when the
          // two are close in length — otherwise "Morphine-6-glucuronide" would
          // wrongly claim the "Morphine" pathway's share.
          score = 50;
        }
        if (score > bestScore) {
          bestScore = score;
          // Prefer the matched product's own share over the row total, so a
          // fuzzy match into a forked row still lands on the right number.
          var partNorm = norm(part), own = null;
          (p.products || []).forEach(function (prod) {
            if (prod.fraction != null && norm(prod.name) === partNorm) own = prod.fraction;
          });
          best = own != null ? own : p.fraction;
        }
      });
    });

    if (best != null) return { fraction: best, inferred: false };
    // No pathway clearly produces it — fall back to a conservative default and
    // flag it so the UI can say the share is a guess rather than data.
    return { fraction: 0.2, inferred: true };
  }

  /**
   * A route that declares its own metabolism replaces the compound's for doses
   * taken that way. Everything downstream — the cards, the charts, the
   * breakdown table — goes through here, so declaring it once is enough.
   */
  function metabolismFor(curve) {
    return (curve.route && curve.route.metabolism) || curve.drug.metabolism || null;
  }

  /* ---------- tolerance --------------------------------------------------- */

  /**
   * Crude exponential-recovery tolerance model. Each prior dose adds tolerance
   * that decays with the drug's `toleranceHalfLifeDays`. Output is an index
   * where 0 = naive and 1 = "full tolerance from repeated common dosing".
   * Cross-tolerance is applied between drugs sharing a `toleranceGroup`.
   */
  /**
   * How much of one compound's tolerance carries to another.
   *
   * `toleranceGroup` has been on every compound in this database since the
   * beginning and nothing ever read it — it was printed on the substance
   * page and never computed with, so someone taking alprazolam daily and
   * then diazepam was told their diazepam tolerance was zero. It is not
   * zero. It is most of the way to full.
   *
   * Cross-tolerance is real, partial, and varies by mechanism, so the
   * factor is per group rather than one number:
   *
   *   gaba                near-complete. Benzodiazepines, alcohol,
   *                       barbiturates and Z-drugs all act at the same
   *                       receptor complex, which is why a benzodiazepine
   *                       treats alcohol withdrawal at all.
   *   psychedelic-5ht2a   near-complete and famously fast. LSD taken the
   *                       day after psilocybin does very little.
   *   opioid              high but not total, and asymmetric in ways this
   *                       does not model — incomplete cross-tolerance is
   *                       exactly why opioid rotation works clinically,
   *                       and why a switch at an equianalgesic dose can
   *                       overdose someone.
   *   amphetamine         substantial for the subjective effect, much less
   *                       so for the cardiovascular load.
   *
   * Doses are already normalised to each compound's own common dose before
   * they get here, so potency is handled and this factor is only about how
   * far the adaptation transfers.
   *
   * The default for an unlisted group is deliberately middling. A group
   * exists because somebody judged those compounds to share a mechanism,
   * and pretending the transfer is either total or nil would be a stronger
   * claim than that judgement supports.
   */
  var CROSS_TOLERANCE = {
    gaba: 0.9,
    'psychedelic-5ht2a': 0.9,
    opioid: 0.85,
    amphetamine: 0.8,
    cannabinoid: 0.8,
    dissociative: 0.7,
    cocaine: 0.8,
    ephedrine: 0.8
  };
  var CROSS_DEFAULT = 0.7;

  /** 1 for the same compound, 0 when nothing links them. */
  function crossToleranceFactor(target, other) {
    if (!target || !other) return 0;
    if (target.id === other.id) return 1;
    var g = target.toleranceGroup;
    if (!g || other.toleranceGroup !== g) return 0;
    return CROSS_TOLERANCE[g] != null ? CROSS_TOLERANCE[g] : CROSS_DEFAULT;
  }

  function toleranceAt(drug, priorDoses, tNowMs) {
    var thl = drug.toleranceHalfLifeDays;
    if (!thl) return null;
    var acc = 0;
    priorDoses.forEach(function (d) {
      var days = (tNowMs - d.timeMs) / 86400000;
      if (days < 0) return;
      var w = d.crossFactor != null ? d.crossFactor : 1;
      acc += w * (d.doseRatio || 1) * Math.pow(0.5, days / thl);
    });
    return { index: 1 - Math.exp(-acc / 3), raw: acc };
  }

  /* ---------- exports ----------------------------------------------------- */

  global.PK = {
    LN2: LN2,
    keFromHalfLife: keFromHalfLife,
    kaFromTmax: kaFromTmax,
    bateman: bateman,
    effectEnvelope: effectEnvelope,
    phasesFor: phasesFor,
    effectiveHalfLife: effectiveHalfLife,
    buildDoseCurve: buildDoseCurve,
    commonDoseMg: commonDoseMg,
    routeDoses: routeDoses,
    doseTier: doseTier,
    toleranceAt: toleranceAt,
    crossToleranceFactor: crossToleranceFactor,
    CROSS_TOLERANCE: CROSS_TOLERANCE,
    metaboliteTree: metaboliteTree,
    metaboliteBreakdown: metaboliteBreakdown,
    directMetabolites: directMetabolites,
    producingRow: producingRow,
    metabolismFor: metabolismFor,
    formationFractionFor: formationFractionFor,
    bareName: bareName
  };
})(window);

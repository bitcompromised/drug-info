/* ==========================================================================
   potency.js — Relative strength between compounds
   --------------------------------------------------------------------------
   Two different things get called "potency", and conflating them is how people
   get hurt. This module keeps them separate:

   1. EQUIVALENCE SCALES (`scales` below)
      Established clinical conversion factors — morphine milligram equivalents
      for opioids, diazepam equivalents for benzodiazepines. These come from
      published equianalgesic / equivalence tables and are the only figures
      here that deserve real confidence.

   2. DOSE-RATIO POTENCY (computed)
      For classes with no accepted standard (stimulants, psychedelics,
      dissociatives), potency is derived from the database's own common-dose
      ladders: potency = referenceCommonDose / drugCommonDose. That is a
      statement about how many milligrams you need, NOT about receptor
      affinity, efficacy, danger, or quality of effect.

   A compound being 100x more potent means the dose is 100x smaller. It says
   nothing about whether it is 100x stronger *as an experience* — and for
   partial agonists (buprenorphine) or drugs with a ceiling, high potency and
   low maximal effect coexist.
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------- established clinical equivalence scales ---------------------- */

  var scales = {

    MME: {
      id: 'MME',
      name: 'Morphine milligram equivalents',
      unit: 'mg oral morphine per 1 mg drug',
      reference: 'morphine',
      classes: ['Opioid'],
      note: 'Standard equianalgesic conversions used in clinical practice. These are ANALGESIC equivalences derived from tolerant patients; they are not safe conversion factors for recreational use, and published tables disagree with each other by a factor of two or more for several drugs.',
      factors: {
        morphine:      { f: 1,    confidence: 'measured' },
        codeine:       { f: 0.15, confidence: 'measured' },
        oxycodone:     { f: 1.5,  confidence: 'measured' },
        tramadol:      { f: 0.1,  confidence: 'measured' },
        heroin:        { f: 2.5,  confidence: 'estimated', note: 'Parenteral. Orally it is simply a morphine prodrug and the advantage disappears.' },
        fentanyl:      { f: 100,  confidence: 'measured', note: 'Parenteral equivalence. Transdermal patches convert differently (roughly 2.4 MME per µg/h).' },
        methadone:     { f: 4.7,  confidence: 'estimated', note: 'DANGEROUSLY VARIABLE — published factors range from 3 to 12 and rise with the dose being converted. Methadone conversion errors are a documented cause of death; never convert without a clinician.' },
        buprenorphine: { f: 30,   confidence: 'estimated', note: 'Highly contested (published values span 10-75). It is a PARTIAL agonist with a respiratory ceiling, so a high equivalence factor does not mean proportionally more dangerous.' },
        'o-dsmt':      { f: 1.0,  confidence: 'estimated' },
        kratom:        { f: 0.002, confidence: 'estimated', note: 'Per mg of dried leaf, which is only ~1-2% mitragynine. Extremely batch-dependent.' }
      }
    },

    DZE: {
      id: 'DZE',
      name: 'Diazepam equivalents',
      unit: 'mg diazepam per 1 mg drug',
      reference: 'diazepam',
      classes: ['Depressant'],
      note: 'Based on the Ashton Manual and standard prescribing equivalence tables, used clinically for benzodiazepine tapering. Equivalence is approximate and does not account for the large differences in duration between these drugs.',
      factors: {
        diazepam:       { f: 1,   confidence: 'measured' },
        alprazolam:     { f: 20,  confidence: 'measured' },
        clonazepam:     { f: 20,  confidence: 'measured' },
        lorazepam:      { f: 10,  confidence: 'measured' },
        etizolam:       { f: 10,  confidence: 'measured' },
        zolpidem:       { f: 1,   confidence: 'estimated', note: 'Not a benzodiazepine; cross-tolerance is partial, so equivalence is rough.' },
        clonazolam:     { f: 50,  confidence: 'estimated', note: 'No clinical data. Estimated from case reports; some sources put it far higher.' },
        flualprazolam:  { f: 40,  confidence: 'estimated' },
        bromazolam:     { f: 15,  confidence: 'estimated' },
        phenobarbital:  { f: 0.33, confidence: 'estimated', note: 'Barbiturate — cross-tolerant but with no ceiling on respiratory depression, so equivalence understates the risk.' }
      }
    }
  };

  /* ---------- reference compounds for dose-ratio comparison ---------------- */

  var classReference = {
    'Stimulant':     'dextroamphetamine',
    'Entactogen':    'mdma',
    'Psychedelic':   'lsd',
    'Dissociative':  'ketamine',
    'Depressant':    'diazepam',
    'Opioid':        'morphine',
    'Cannabinoid':   'thc',
    'Deliriant':     'diphenhydramine',
    'Antidepressant': 'sertraline'
  };

  /* ---------- helpers ------------------------------------------------------ */

  // Primary route = the one the compound is most characteristically taken by.
  function primaryRoute(drug) {
    var order = ['oral', 'sublingual', 'insufflated', 'vaporised', 'smoked', 'inhaled', 'buccal', 'im', 'iv', 'transdermal', 'rectal', 'intranasal'];
    for (var i = 0; i < order.length; i++) {
      if (drug.routes[order[i]]) return order[i];
    }
    return Object.keys(drug.routes)[0];
  }

  // Common dose in mg, normalising the handful of non-mg units.
  function commonDoseMg(drug, routeKey) {
    routeKey = routeKey || primaryRoute(drug);
    var r = drug.routes[routeKey];
    if (!r || !r.doses || !r.doses.common) return null;
    var d = r.doses.common;
    var mg = Array.isArray(d) ? (d[0] + d[1]) / 2 : d;
    var unit = r.doses.unit || 'mg';
    if (unit === 'g') mg *= 1000;
    if (unit === 'ml' && drug.id === 'gbl') mg *= 1120;   // GBL density ~1.12 g/ml
    if (unit !== 'mg' && unit !== 'g' && unit !== 'ml') return null; // canisters, inhalations
    return mg;
  }

  /** Which established scale, if any, covers this drug. */
  function scaleFor(drug) {
    var keys = Object.keys(scales);
    for (var i = 0; i < keys.length; i++) {
      if (scales[keys[i]].factors[drug.id]) return scales[keys[i]];
    }
    return null;
  }

  /**
   * Relative strength of `drug` versus `reference`.
   * Returns { ratio, basis, confidence, note } where ratio > 1 means the drug
   * is more potent (needs fewer mg) than the reference.
   */
  function relative(drug, reference) {
    if (!drug || !reference) return null;
    if (drug.id === reference.id) {
      return { ratio: 1, basis: 'identity', confidence: 'measured', note: 'Reference compound.' };
    }

    // Preferred: both on the same established equivalence scale.
    var s = scaleFor(drug);
    if (s && s.factors[reference.id]) {
      var a = s.factors[drug.id], b = s.factors[reference.id];
      return {
        ratio: a.f / b.f,
        basis: s.id,
        scaleName: s.name,
        confidence: (a.confidence === 'measured' && b.confidence === 'measured') ? 'measured' : 'estimated',
        note: [a.note, s.note].filter(Boolean).join(' ')
      };
    }

    // Fallback: dose-ratio from the database's own dose ladders.
    var dA = commonDoseMg(drug), dB = commonDoseMg(reference);
    if (!dA || !dB) return null;
    return {
      ratio: dB / dA,
      basis: 'dose-ratio',
      confidence: 'estimated',
      doseA: dA, doseB: dB,
      note: 'Derived from typical common doses (' + fmtMg(dA) + ' vs ' + fmtMg(dB) +
            '), not from receptor pharmacology. It tells you how much smaller the dose is, nothing more.'
    };
  }

  /**
   * Rank a set of drugs by potency against a reference.
   * Used to draw the log-scale comparison chart.
   */
  function rank(drugs, reference, opts) {
    opts = opts || {};
    var out = [];
    drugs.forEach(function (d) {
      var rel = relative(d, reference);
      if (!rel || !isFinite(rel.ratio) || rel.ratio <= 0) return;
      out.push({
        drug: d,
        ratio: rel.ratio,
        basis: rel.basis,
        confidence: rel.confidence,
        note: rel.note,
        commonDoseMg: commonDoseMg(d),
        route: primaryRoute(d)
      });
    });
    out.sort(function (x, y) { return y.ratio - x.ratio; });
    return opts.limit ? out.slice(0, opts.limit) : out;
  }

  /** Everything comparable to this drug — same class, plus same scale if any. */
  function peersOf(drug) {
    var s = scaleFor(drug);
    return DB.all().filter(function (d) {
      if (s && s.factors[d.id]) return true;
      return d.class === drug.class;
    });
  }

  /** Default reference compound to compare a drug against. */
  function referenceFor(drug) {
    var s = scaleFor(drug);
    if (s) {
      var ref = DB.get(s.reference);
      if (ref) return ref;
    }
    var r = DB.get(classReference[drug.class] || '');
    if (r && r.id !== drug.id) return r;
    // Fall back to the least potent peer so the drug itself isn't the reference.
    var peers = peersOf(drug).filter(function (d) { return d.id !== drug.id && commonDoseMg(d); });
    peers.sort(function (a, b) { return commonDoseMg(b) - commonDoseMg(a); });
    return peers[0] || null;
  }

  /* ---------- unit-aware formatting ---------------------------------------- */

  /* ---------- mass formatting ----------------------------------------------
     Everything internal is milligrams. These pick the unit a human would
     actually use — 0.001 mg reads as 1 µg, 1000 mg as 1 g — so no display
     anywhere shows a value with four leading zeros or four trailing ones.   */

  var SCALES = [
    { limit: 1e-3, f: 1e-6, u: 'ng' },
    { limit: 1,    f: 1e-3, u: 'µg' },
    { limit: 1e3,  f: 1,    u: 'mg' },
    { limit: 1e6,  f: 1e3,  u: 'g'  },
    { limit: Infinity, f: 1e6, u: 'kg' }
  ];

  function pickScale(mg) {
    var abs = Math.abs(mg);
    for (var i = 0; i < SCALES.length; i++) {
      if (abs < SCALES[i].limit) return SCALES[i];
    }
    return SCALES[SCALES.length - 1];
  }

  // Sensible significant figures, with trailing zeros removed (1.50 -> 1.5).
  function trimNum(v) {
    var a = Math.abs(v);
    var s = a >= 100 ? v.toFixed(0)
          : a >= 10  ? v.toFixed(1)
          : a >= 1   ? v.toFixed(2)
          : v.toFixed(3);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }

  function fmtMg(mg) {
    if (mg == null || !isFinite(mg)) return '—';
    if (mg === 0) return '0 mg';
    var s = pickScale(mg);
    return trimNum(mg / s.f) + ' ' + s.u;
  }

  /**
   * A range in one shared unit, chosen from the larger end so both numbers
   * read naturally: [0.075, 0.15] mg becomes "75–150 µg", not "0.08–0.15 mg".
   */
  function fmtRangeMg(loMg, hiMg) {
    if (loMg == null && hiMg == null) return '—';
    if (loMg == null) return fmtMg(hiMg);
    if (hiMg == null) return fmtMg(loMg);
    var s = pickScale(Math.max(Math.abs(loMg), Math.abs(hiMg)));
    return trimNum(loMg / s.f) + '–' + trimNum(hiMg / s.f) + ' ' + s.u;
  }

  /** Concentration, switching to µg/ml rather than printing 0.0004 mg/ml. */
  function fmtConc(mgPerMl) {
    if (mgPerMl == null || !isFinite(mgPerMl)) return '—';
    if (mgPerMl === 0) return '0 mg/ml';
    if (Math.abs(mgPerMl) < 1) return trimNum(mgPerMl * 1000) + ' µg/ml';
    return trimNum(mgPerMl) + ' mg/ml';
  }

  function fmtRatio(r) {
    if (r == null || !isFinite(r)) return '—';
    if (r >= 1) return (r >= 100 ? r.toFixed(0) : r >= 10 ? r.toFixed(1) : r.toFixed(2).replace(/0$/, '')) + '×';
    return '1/' + fmtRatio(1 / r).replace('×', '') + '×';
  }

  global.Potency = {
    scales: scales,
    classReference: classReference,
    primaryRoute: primaryRoute,
    commonDoseMg: commonDoseMg,
    scaleFor: scaleFor,
    relative: relative,
    rank: rank,
    peersOf: peersOf,
    referenceFor: referenceFor,
    fmtMg: fmtMg,
    fmtRangeMg: fmtRangeMg,
    fmtConc: fmtConc,
    trimNum: trimNum,
    pickScale: pickScale,
    fmtRatio: fmtRatio
  };
})(window);

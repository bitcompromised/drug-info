/* ==========================================================================
   profile.js — the user's own body and metaboliser status
   --------------------------------------------------------------------------
   The pharmacokinetic model is built from population averages. This is the one
   place the user can tell it something about themselves, and it feeds two
   corrections back into the estimates:

     1. BODY MASS scales the effect intensity of a dose. Published dose ladders
        are written for a notional ~70 kg adult, so the same milligrams do less
        in a heavier person and more in a lighter one. This is a crude linear
        scaling — real volume of distribution depends on body composition and
        on how lipophilic the compound is, and this database has no Vd data to
        do better. It is applied to the effect envelope only.

     2. CYP METABOLISER STATUS multiplies the half-life, using the same
        AUC-ratio relationship the interaction engine already uses for enzyme
        induction and inhibition:

            ratio = 1 / (1 − fm + fm · activity)

        where `fm` is the fraction of clearance running through CYP enzymes and
        `activity` is the metaboliser factor below. A drug cleared 90% by CYP
        is transformed by the genotype; one cleared 10% by it barely notices.
        That is the correct shape of the effect, not a flat multiplier.

   HEIGHT is recorded and used for BMI and body-surface-area display only. It
   does not enter the kinetic model, because nothing in this database is dosed
   by surface area and pretending otherwise would be false precision.

   THE PRODRUG INVERSION. For most drugs, poor metabolism means MORE exposure.
   For a prodrug — codeine, tramadol, ketazolam, cloniprazepam — it means LESS,
   because the enzyme is what creates the active compound in the first place.
   The model does not silently guess which case applies; `prodrugWarning()`
   detects it and the UI says so in words instead.
   ========================================================================== */
(function (global) {
  'use strict';

  var KEY = 'profile';

  // Defaults are a starting point, not a recommendation — they exist so the
  // model has something to run on before anyone opens the settings panel.
  var DEFAULTS = {
    weightLb: 180,
    heightIn: 72,          // 6'0"
    // Boer's lean-body-mass equation has separate coefficients by sex, and
    // so does every blood-volume relation built on top of it. Unspecified
    // averages the two rather than silently picking one.
    sex: 'unspecified',
    cyp: 'low',
    applyToEstimates: true
  };

  // Reference adult the published dose ladders are implicitly written for.
  var REFERENCE_KG = 70;

  /**
   * Enzyme activity relative to a normal metaboliser.
   *
   * These are deliberately conservative. Real CYP2D6 poor metabolisers can sit
   * far below 0.35 and true ultra-rapid metabolisers far above 2.2, but those
   * are single-enzyme phenotypes; this setting is applied across all CYP
   * clearance at once, so a moderate factor is the honest choice.
   */
  var CYP_ACTIVITY = { low: 0.35, medium: 1.0, high: 2.2 };

  /**
   * The enzymes worth asking about separately.
   *
   * One setting across all CYP clearance was the wrong shape and the code
   * said so from the start. Real genotypes are per enzyme, and the ones that
   * change a decision are a short list: 2D6 (codeine, tramadol, atomoxetine,
   * dextromethorphan — and about 7% of Europeans are poor metabolisers),
   * 2C19 (diazepam, clobazam), 3A4 (the workhorse, and induced or inhibited
   * far more often than it is genetically variable), 2C9 (THC), 1A2
   * (caffeine, olanzapine — inducible by smoking) and 2B6 (methadone,
   * bupropion, ketamine).
   */
  var CYP_ENZYMES = ['CYP2D6', 'CYP2C19', 'CYP3A4', 'CYP2C9', 'CYP1A2', 'CYP2B6'];

  var CYP_ENZYME_NOTE = {
    CYP2D6:  'Codeine, tramadol, dextromethorphan, atomoxetine, venlafaxine. The most consequential of the six: poor metabolisers get no analgesia from codeine, ultra-rapid ones have killed breastfed infants with it.',
    CYP2C19: 'Diazepam, clobazam, omeprazole. Poor metabolisers are common in East Asian populations (~15-20%).',
    CYP3A4:  'The workhorse — more clinically used drugs than any other enzyme, and it sits in the gut wall as well as the liver. Varies far more from inhibitors and inducers than from genotype.',
    CYP2C9:  'THC, ibuprofen, warfarin. CYP2C9*3/*3 reach roughly three times the THC exposure.',
    CYP1A2:  'Caffeine, olanzapine, melatonin. Strongly INDUCED by tobacco smoke, which is why stopping smoking raises clozapine and olanzapine levels.',
    CYP2B6:  'Methadone, bupropion, ketamine, efavirenz.'
  };

  /**
   * Accepts the old single string and the new per-enzyme object, and always
   * returns the object. Existing profiles keep working and mean what they
   * always meant: that setting, applied to everything.
   */
  function normaliseCyp(v) {
    var out = {};
    if (typeof v === 'string' && CYP_ACTIVITY[v] != null) {
      CYP_ENZYMES.forEach(function (e) { out[e] = v; });
      return out;
    }
    CYP_ENZYMES.forEach(function (e) {
      out[e] = (v && CYP_ACTIVITY[v[e]] != null) ? v[e] : DEFAULTS.cyp;
    });
    return out;
  }

  /**
   * The setting for one enzyme.
   *
   * Anything not on CYP_ENZYMES is normal, because it was never offered as a
   * choice and cannot have been set. Defaulting those to DEFAULTS.cyp instead
   * quietly applied a slow-metaboliser factor to the minor enzymes nobody was
   * asked about: caffeine came out at ×1.02 with every setting on normal,
   * because 3% of its clearance runs through CYP2A6 and CYP2E1.
   */
  function cypSetting(enzyme, p) {
    var c = (p || get()).cyp;
    if (c && CYP_ACTIVITY[c[enzyme]] != null) return c[enzyme];
    return 'medium';
  }

  var CYP_LABEL = {
    low: 'Slow (poor metaboliser)',
    medium: 'Normal (extensive metaboliser)',
    high: 'Fast (ultra-rapid metaboliser)'
  };

  var CYP_DESC = {
    low: 'Clears CYP-dependent drugs more slowly. Longer half-lives, higher peak levels and more accumulation from repeated dosing.',
    medium: 'The population average the raw database figures already assume. No adjustment is applied.',
    high: 'Clears CYP-dependent drugs faster. Shorter, weaker effects — and for prodrugs like codeine, a much stronger one.'
  };

  function get() {
    var p = Store.getPrefs()[KEY] || {};
    return {
      weightLb: p.weightLb != null ? p.weightLb : DEFAULTS.weightLb,
      heightIn: p.heightIn != null ? p.heightIn : DEFAULTS.heightIn,
      sex: SEX[p.sex] ? p.sex : DEFAULTS.sex,
      cyp: normaliseCyp(p.cyp),
      applyToEstimates: p.applyToEstimates != null ? p.applyToEstimates : DEFAULTS.applyToEstimates
    };
  }

  function set(patch) {
    var next = get();
    Object.keys(patch).forEach(function (k) { next[k] = patch[k]; });
    Store.setPref(KEY, next);
    return next;
  }

  function reset() { Store.setPref(KEY, null); return get(); }

  /* ---------- derived body measures --------------------------------------- */

  function weightKg(p) { return (p || get()).weightLb * 0.45359237; }
  function heightCm(p) { return (p || get()).heightIn * 2.54; }

  function bmi(p) {
    p = p || get();
    var m = heightCm(p) / 100;
    return m > 0 ? weightKg(p) / (m * m) : null;
  }

  /** Du Bois body surface area, m². Displayed only; not used in the model. */
  function bsa(p) {
    p = p || get();
    return 0.007184 * Math.pow(heightCm(p), 0.725) * Math.pow(weightKg(p), 0.425);
  }

  /* ---------- lean mass, blood volume and plasma volume -----------------

     A milligram figure answers "how much is in me". It does not answer
     "how concentrated is it", and concentration is the quantity every
     published threshold, therapeutic range and toxic level is written in.
     Getting from one to the other needs a volume, and the volume that
     matters for a plasma level is plasma volume.

     BOER gives lean body mass, which is the right starting point: blood
     lives in lean tissue, and adipose carries very little of it. So two
     people of the same weight and different body composition genuinely do
     have different plasma volumes, and scaling by total weight would miss
     that entirely.

         male    LBM = 0.407·kg + 0.267·cm − 19.2
         female  LBM = 0.252·kg + 0.473·cm − 48.3

     Blood volume follows from lean mass at roughly 90 mL/kg (85 for
     women), and plasma is what is left after the cells: plasma volume =
     blood volume × (1 − haematocrit). Checked against Nadler's equation,
     which is the standard clinical estimate, this lands within a few
     percent across the range — 2.8 L for a 70 kg 178 cm man, 2.3 L for a
     60 kg 165 cm woman.

     It is still an estimate of a population average for someone of this
     size, not a measurement of anyone. Haematocrit alone varies by a fifth
     between healthy adults, and a plasma level computed from it inherits
     that. It is also a ONE-COMPARTMENT plasma level: it assumes the drug
     in the central compartment is dissolved in plasma and nowhere else,
     which for a lipophilic compound with a large volume of distribution
     overstates the real concentration substantially. Treat it as an order
     of magnitude, not a number.
     --------------------------------------------------------------------- */

  var SEX = {
    male:        { lbmK: 0.407, lbmH: 0.267, lbmC: 19.2, mlPerKgLbm: 90, hct: 0.45,
                   label: 'Male' },
    female:      { lbmK: 0.252, lbmH: 0.473, lbmC: 48.3, mlPerKgLbm: 85, hct: 0.40,
                   label: 'Female' },
    unspecified: { lbmK: 0.3295, lbmH: 0.370, lbmC: 33.75, mlPerKgLbm: 87.5, hct: 0.425,
                   label: 'Unspecified (averaged)' }
  };

  function sexParams(p) { return SEX[(p || get()).sex] || SEX.unspecified; }

  /** Boer lean body mass, kg. */
  function leanMassKg(p) {
    p = p || get();
    var s = sexParams(p);
    return Math.max(5, s.lbmK * weightKg(p) + s.lbmH * heightCm(p) - s.lbmC);
  }

  /** Total blood volume, litres. */
  function bloodVolumeL(p) {
    p = p || get();
    return leanMassKg(p) * sexParams(p).mlPerKgLbm / 1000;
  }

  /** Plasma volume, litres — the denominator of every plasma level shown. */
  function plasmaVolumeL(p) {
    p = p || get();
    return bloodVolumeL(p) * (1 - sexParams(p).hct);
  }

  /**
   * The volume a concentration should be divided by.
   *
   * Plasma volume is the wrong answer for almost everything. It assumes the
   * drug is dissolved in plasma and nowhere else, when a lipophilic compound
   * is mostly in tissue and only visiting — so the app was reporting
   * methamphetamine in micrograms per millilitre where a laboratory reports
   * tens of nanograms, out by a factor of eighty.
   *
   * The right divisor is the apparent volume of distribution: the volume the
   * body behaves AS IF the drug were dissolved in. It is not a real volume —
   * it exceeds body volume for anything that concentrates in tissue — which
   * is exactly the point, because it is what converts an amount into what a
   * blood sample would read.
   *
   * Where no Vd is recorded, plasma volume is still used and the result is
   * flagged: it is an upper bound, since Vd is larger than plasma volume for
   * every compound in this database. Better to say "at most this" than to
   * silently swap the meaning of the number.
   */
  function distributionVolumeL(drug, p) {
    p = p || get();
    if (drug && drug.vd != null) {
      return { litres: drug.vd * weightKg(p), basis: 'vd', vd: drug.vd };
    }
    return { litres: plasmaVolumeL(p), basis: 'plasma', vd: null };
  }

  /**
   * Concentration in mg/L, from an amount in the central compartment in mg.
   * mg/L is the same number as µg/mL; the UI converts to whatever reads.
   *
   * `drug` may be omitted, in which case this is the old plasma-volume
   * behaviour and says so in `basis`.
   */
  function plasmaConc(amountMg, drug, p) {
    var v = distributionVolumeL(drug, p);
    return v.litres > 0 ? amountMg / v.litres : null;
  }

  /**
   * Where a concentration sits against the bands reported for a compound.
   *
   * Returns null when nothing is recorded, which is the common case and is
   * not a failure — most compounds here have no published bands, and
   * inventing one would be worse than showing none.
   */
  function concentrationBand(mgPerL, drug) {
    if (!drug || !drug.ranges || mgPerL == null) return null;
    var r = drug.ranges;
    var ngPerMl = mgPerL * 1000;
    var within = function (band) {
      return band && ngPerMl >= band[0] && (band[1] == null || ngPerMl < band[1]);
    };
    var atLeast = function (band) { return band && ngPerMl >= band[0]; };

    // Checked downwards, so the most serious band a figure reaches wins.
    var key = atLeast(r.fatal) ? 'fatal'
            : atLeast(r.toxic) ? 'toxic'
            : within(r.therapeutic) || atLeast(r.therapeutic) ? 'therapeutic'
            : 'below';
    return { key: key, ngPerMl: ngPerMl, ranges: r, note: drug.rangesNote || null };
  }

  function formatHeight(inches) {
    var ft = Math.floor(inches / 12);
    var inch = Math.round(inches - ft * 12);
    if (inch === 12) { ft += 1; inch = 0; }
    return ft + "'" + inch + '"';
  }

  /* ---------- corrections fed back into the model ------------------------- */

  /**
   * Multiplier on a dose's effect intensity, from body mass alone.
   * Heavier than the reference adult → the same milligrams do less.
   */
  function massScale(p) {
    p = p || get();
    if (!p.applyToEstimates) return 1;
    return REFERENCE_KG / Math.max(30, weightKg(p));
  }

  /**
   * How much of a compound's characterised clearance runs through each CYP.
   *
   * A row naming several enzymes ("CYP3A4 / CYP2C19") splits its share
   * between them rather than counting in full against each, which is the
   * only reading that keeps the total honest.
   */
  function cypFractions(drug) {
    var out = {};
    if (!drug || !drug.metabolism) return out;
    (drug.metabolism.pathways || []).forEach(function (path) {
      if (path.fraction == null) return;
      var named = String(path.enzyme || '').split('/')
        .map(function (e) { return e.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); })
        .filter(function (e) { return /^CYP\d/.test(e); });
      if (!named.length) return;
      var each = path.fraction / named.length;
      named.forEach(function (e) { out[e] = (out[e] || 0) + each; });
    });
    // Cap the TOTAL, keeping the proportions, so a compound whose declared
    // shares overrun cannot claim more than all of its clearance is CYP.
    var total = Object.keys(out).reduce(function (a, e) { return a + out[e]; }, 0);
    if (total > 0.95) {
      var k = 0.95 / total;
      Object.keys(out).forEach(function (e) { out[e] *= k; });
    }
    return out;
  }

  /** Fraction of a compound's characterised clearance that runs through CYP. */
  function cypFraction(drug) {
    var fr = cypFractions(drug);
    return Object.keys(fr).reduce(function (a, e) { return a + fr[e]; }, 0);
  }

  /**
   * Half-life multiplier for this compound given the user's metaboliser status.
   * Returns 1 when the setting is normal, disabled, or the drug is not
   * CYP-cleared — a UGT-cleared benzodiazepine like lorazepam correctly gets
   * no adjustment at all.
   */
  function halfLifeFactor(drug, p) {
    p = p || get();
    if (!p.applyToEstimates) return 1;
    var fr = cypFractions(drug);
    var fm = 0, weighted = 0;
    Object.keys(fr).forEach(function (e) {
      fm += fr[e];
      weighted += fr[e] * CYP_ACTIVITY[cypSetting(e, p)];
    });
    if (fm <= 0) return 1;
    // The same AUC-ratio form as before, summed per enzyme instead of
    // applied once to the lot. A compound cleared 90% by 2D6 is transformed
    // by a 2D6 genotype and untouched by a 2C19 one, which is the whole
    // point of asking separately.
    return 1 / (1 - fm + weighted);
  }

  /**
   * A half-life modifier in the shape the interaction engine already emits, so
   * PK.buildDoseCurve can consume it alongside the enzyme modifiers without
   * knowing where it came from.
   */
  function halfLifeModifier(drug, p) {
    p = p || get();
    var factor = halfLifeFactor(drug, p);
    if (factor === 1) return null;
    var fr = cypFractions(drug);
    // Name the enzymes that are actually set away from normal, biggest
    // share first — "slow CYP metabolism" said nothing about which one.
    var moved = Object.keys(fr)
      .filter(function (e) { return cypSetting(e, p) !== 'medium'; })
      .sort(function (a, b) { return fr[b] - fr[a]; });
    var parts = moved.map(function (e) {
      return e + ' ' + CYP_LABEL[cypSetting(e, p)].replace(/ \(.*\)$/, '').toLowerCase() +
             ' (' + Math.round(fr[e] * 100) + '% of clearance)';
    });
    return {
      factor: factor,
      source: 'profile',
      reason: parts.length ? parts.join(', ') : 'CYP metaboliser status'
    };
  }

  /**
   * Detects the prodrug inversion: an active metabolite more potent than its
   * parent, produced by a CYP enzyme. For these the half-life adjustment above
   * is the wrong story, and the UI needs to say so rather than quietly apply a
   * number that points the wrong way.
   */
  function prodrugWarning(drug, p) {
    p = p || get();
    if (!p.applyToEstimates) return null;
    var mets = (drug.metabolism && drug.metabolism.metabolites) || [];
    var hit = null;
    mets.forEach(function (m) {
      if (!m.active || !(m.potencyRel > 1)) return;
      (drug.metabolism.pathways || []).forEach(function (path) {
        if (!/\bCYP\d/i.test(String(path.enzyme || ''))) return;
        if (String(path.product || '').indexOf(m.name) < 0) return;
        hit = { metabolite: m.name, enzyme: path.enzyme };
      });
    });
    if (!hit) return null;
    // The warning belongs to the enzyme that makes the metabolite, not to
    // the profile as a whole: someone can be a slow 2D6 metaboliser and a
    // normal 3A4 one, and only the first inverts codeine.
    var key = String(hit.enzyme || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    var setting = cypSetting(key, p);
    if (setting === 'medium') return null;
    return setting === 'low'
      ? drug.name + ' relies on ' + hit.enzyme + ' to form its stronger metabolite ' +
        hit.metabolite + '. As a slow metaboliser you would form LESS of it, so the ' +
        'longer half-life shown here does not mean a stronger effect — it may mean a weaker one.'
      : drug.name + ' relies on ' + hit.enzyme + ' to form its stronger metabolite ' +
        hit.metabolite + '. As a fast metaboliser you would form MORE of it, faster — the ' +
        'shorter half-life shown here can accompany a sharper and more intense effect, not a milder one.';
  }

  global.Profile = {
    DEFAULTS: DEFAULTS,
    REFERENCE_KG: REFERENCE_KG,
    CYP_ACTIVITY: CYP_ACTIVITY,
    CYP_LABEL: CYP_LABEL,
    CYP_DESC: CYP_DESC,
    get: get,
    set: set,
    reset: reset,
    weightKg: weightKg,
    heightCm: heightCm,
    bmi: bmi,
    bsa: bsa,
    SEX: SEX,
    sexParams: sexParams,
    leanMassKg: leanMassKg,
    bloodVolumeL: bloodVolumeL,
    plasmaVolumeL: plasmaVolumeL,
    distributionVolumeL: distributionVolumeL,
    plasmaConc: plasmaConc,
    concentrationBand: concentrationBand,
    formatHeight: formatHeight,
    massScale: massScale,
    CYP_ENZYMES: CYP_ENZYMES,
    CYP_ENZYME_NOTE: CYP_ENZYME_NOTE,
    cypSetting: cypSetting,
    cypFractions: cypFractions,
    cypFraction: cypFraction,
    halfLifeFactor: halfLifeFactor,
    halfLifeModifier: halfLifeModifier,
    prodrugWarning: prodrugWarning
  };
})(window);

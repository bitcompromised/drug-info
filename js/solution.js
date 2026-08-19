/* ==========================================================================
   solution.js — Solution / mixture calculator
   --------------------------------------------------------------------------
   Volumetric dosing: dissolve a known mass in a known volume, then measure a
   dose by volume. This is the standard way to handle compounds that are active
   below what a consumer scale can weigh — and getting the arithmetic wrong is
   a recurring cause of overdose, which is the reason this exists.

   Computes, for a mixture:
     - each ingredient's total mass, share of the active mass, and concentration
     - what a given dose volume delivers of each ingredient
     - where that lands on each ingredient's own dose ladder
     - the pharmacology of that per-dose amount, and interactions across it
   ========================================================================== */
(function (global) {
  'use strict';

  // Imperial and kitchen units are included because recipes are written in
  // them and converting by hand is a place errors enter. Volume-based kitchen
  // measures are US customary.
  var UNIT_TO_MG = { ng: 1e-6, ug: 0.001, 'µg': 0.001, mcg: 0.001, mg: 1, g: 1000, kg: 1e6,
                     oz: 28349.5, lb: 453592, dram: 1771.85 };
  var UNIT_TO_ML = { ul: 0.001, 'µl': 0.001, ml: 1, l: 1000, L: 1000,
                     tsp: 4.92892, tbsp: 14.7868, floz: 29.5735, cup: 236.588,
                     pt: 473.176, qt: 946.353, gal: 3785.41 };

  function isVolumeUnit(unit) { return UNIT_TO_ML[unit] != null; }

  /* ---------- molar mass ---------------------------------------------------
     So a compound can be added by moles rather than by weight. This is how
     chemistry is actually written up — "0.5 mol of sucrose" — and converting
     it by hand is an easy place to slip a decimal.

     The parser handles nested groups and multipliers, e.g. (C6H9NO)n is
     rejected as indeterminate while Ca3(PO4)2 resolves. Anything it cannot
     parse returns null rather than a wrong number.                          */

  var ATOMIC_MASS = {
    H: 1.008, Li: 6.94, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998,
    Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06,
    Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38,
    Br: 79.904, I: 126.904, Ba: 137.33, Pt: 195.08, Au: 196.97, Hg: 200.59,
    Bi: 208.980, Mo: 95.95, Se: 78.971, Mn: 54.938
  };

  /**
   * Molar mass in g/mol, or null if the formula is not a determinate one.
   *
   * Polymers and mixtures are deliberately rejected: "(C6H10O5)n" has no
   * molar mass, and returning a number for it would let someone weigh out a
   * mole of something that does not have moles.
   */
  function molarMass(formula) {
    if (!formula) return null;
    var f = String(formula).trim();
    if (!/^[A-Za-z0-9()\[\]·.]+$/.test(f)) return null;   // prose, not a formula
    if (/n\s*$/.test(f) && /\)/.test(f)) return null;      // polymer, e.g. (C6H10O5)n
    if (/^[a-z]/.test(f)) return null;

    var pos = 0;
    function parseGroup() {
      var total = 0;
      while (pos < f.length) {
        var ch = f[pos];
        if (ch === '(' || ch === '[') {
          pos++;
          var inner = parseGroup();
          if (inner == null) return null;
          total += inner * readCount();
        } else if (ch === ')' || ch === ']') {
          pos++;
          return total;
        } else if (/[A-Z]/.test(ch)) {
          var sym = ch;
          pos++;
          while (pos < f.length && /[a-z]/.test(f[pos])) { sym += f[pos]; pos++; }
          var mass = ATOMIC_MASS[sym];
          if (mass == null) return null;                   // unknown element
          total += mass * readCount();
        } else if (ch === '·' || ch === '.') {
          // Hydrate notation: treat the rest as an addend, e.g. CuSO4·5H2O.
          pos++;
          var mult = readCount();
          var rest = parseGroup();
          if (rest == null) return null;
          total += rest * mult;
        } else {
          return null;
        }
      }
      return total;
    }
    function readCount() {
      var digits = '';
      while (pos < f.length && /[0-9]/.test(f[pos])) { digits += f[pos]; pos++; }
      return digits ? parseInt(digits, 10) : 1;
    }

    var mm = parseGroup();
    return mm != null && mm > 0 && isFinite(mm) ? mm : null;
  }

  /** Grams for a given number of moles of a compound, or null if unknown. */
  function gramsFromMoles(formula, moles) {
    var mm = molarMass(formula);
    return mm == null ? null : mm * moles;
  }

  /* ---------- solute volume ------------------------------------------------
     Dissolved solids occupy space. A few milligrams of an active in 50 ml is
     invisible, but 1.8 kg of sucrose is not — it nearly doubles the volume of
     the liquid it goes into, and treating the solvent volume as the final
     volume would understate every concentration in the mixture by that much.

     Crystal density is used as the stand-in for apparent (partial molar)
     volume. For sugars that is close: sucrose's apparent specific volume in
     water is ~0.62 ml/g against a crystal value of ~0.63. For salts it
     overestimates, because ions pull water in around them and the solution
     shrinks. It is labelled as an approximation in the UI for that reason.  */

  // Typical for a small-molecule organic solid, used where a compound carries
  // no density of its own.
  var DEFAULT_SOLUTE_DENSITY = 1.3;

  function soluteDensity(drug) {
    if (drug && drug.density > 0) return { value: drug.density, assumed: false };
    return { value: DEFAULT_SOLUTE_DENSITY, assumed: true };
  }
  function toMl(amount, unit) {
    var f = UNIT_TO_ML[unit];
    return f != null ? amount * f : null;
  }

  function toMg(amount, unit) {
    var f = UNIT_TO_MG[unit];
    return f != null ? amount * f : amount;
  }

  /**
   * Mass of an ingredient in mg, converting from volume where the unit calls
   * for it. Volume only converts if we know a density — solvents carry one;
   * a powdered active does not, so entering it by volume is meaningless and
   * the UI does not offer it.
   */
  function massMgOf(amount, unit, densityGPerMl) {
    if (isVolumeUnit(unit)) {
      if (!(densityGPerMl > 0)) return null;
      return toMl(amount, unit) * densityGPerMl * 1000;   // ml * g/ml * 1000 = mg
    }
    return toMg(amount, unit);
  }

  /** Inverse, for showing "50 g = 62.19 ml" style read-outs. */
  function volumeMlOf(amount, unit, densityGPerMl) {
    if (isVolumeUnit(unit)) return toMl(amount, unit);
    if (!(densityGPerMl > 0)) return null;
    return (toMg(amount, unit) / 1000) / densityGPerMl;
  }

  /* ---------- solvents ------------------------------------------------------
     `polarity` is a crude 0-1 scale used only to flag an obvious mismatch
     between a solvent and a freebase/salt. `maxMgMl` is a rough practical
     ceiling for typical small-molecule actives — real solubility is compound
     specific and this is a sanity check, not a solubility table.            */

  var SOLVENTS = {
    water: {
      id: 'water', name: 'Distilled water', density: 1.0, polarity: 1.0, maxMgMl: 50,
      freezes: true, shelfLifeNote: 'Shortest shelf life — supports microbial growth. Refrigerate and make small batches; discard after a few weeks.',
      note: 'Dissolves salts (HCl, sulfate, succinate) well. Will NOT dissolve freebase compounds. Safest to ingest and the default choice for water-soluble salts.'
    },
    ethanol95: {
      id: 'ethanol95', name: 'Ethanol 95%', density: 0.804, polarity: 0.62, maxMgMl: 110,
      shelfLifeNote: 'Excellent — self-preserving and effectively sterile.',
      note: 'Lab/pharmacy grade. Dissolves salts and most freebases, and preserves the solution indefinitely. The strongest practical option before anhydrous. Harsh undiluted: burns on sublingual or nasal contact.',
      activeDrugId: 'alcohol', activeFraction: 0.95
    },
    ethanol40: {
      id: 'ethanol40', name: 'Ethanol 40% (spirits / vodka)', density: 0.948, polarity: 0.80, maxMgMl: 50,
      shelfLifeNote: 'Good — 40% ABV is self-preserving.',
      note: 'Everclear-style spirits or vodka. Mostly water by volume, so its solvency sits much closer to water than to lab ethanol. Convenient and food-safe, but weak for freebases.',
      activeDrugId: 'alcohol', activeFraction: 0.40
    },
    methanol: {
      id: 'methanol', name: 'Methanol — DO NOT INGEST', density: 0.792, polarity: 0.76, maxMgMl: 150,
      neverIngest: true,
      shelfLifeNote: 'Excellent as a laboratory solvent. Irrelevant here: this must never be in anything you consume.',
      note: 'A strong solvent used for recrystallisation, cleaning and analytical work. It is included so that laboratory use is documented — it is NOT a dosing vehicle under any circumstances.',
      hazards: [
        'METHANOL IS POISON. Alcohol dehydrogenase converts it to formaldehyde and then formic acid, which causes severe metabolic acidosis and destroys the optic nerve.',
        'As little as ~10 ml can cause permanent blindness; ~30 ml can kill an adult. There is no safe ingested dose.',
        'Symptoms are typically DELAYED 12-24 hours, so someone who feels fine may already be badly poisoned. Treatment (fomepizole or ethanol, plus dialysis) must start before symptoms appear to preserve vision.',
        'It is absorbed through skin and lungs as well as by mouth. Use only with ventilation and gloves.',
        'Never use methanol in a solution intended for oral, nasal, sublingual, rectal or injected use — no dilution makes this acceptable.'
      ]
    },
    pg: {
      id: 'pg', name: 'Propylene glycol (PG)', density: 1.036, polarity: 0.55, maxMgMl: 150,
      freezes: false, shelfLifeNote: 'Excellent shelf life; mildly antimicrobial.',
      note: 'Strong solvent for many actives, pharmaceutically common and non-intoxicating. Viscous, sweet-tasting, and a mild irritant to mucous membranes — unpleasant for nasal or sublingual use in quantity.'
    },
    vg: {
      id: 'vg', name: 'Vegetable glycerine (VG)', density: 1.261, polarity: 0.5, maxMgMl: 80,
      freezes: false, shelfLifeNote: 'Excellent shelf life.',
      note: 'Very viscous, which makes accurate small-volume measurement harder — a real source of dosing error. Sweet. Often blended with PG or water rather than used alone.'
    },
    dmso: {
      id: 'dmso', name: 'DMSO (dimethyl sulfoxide)', density: 1.10, polarity: 0.45, maxMgMl: 250,
      freezesAtC: 18.5, oily: false,
      shelfLifeNote: 'Excellent, but hygroscopic — it pulls water out of the air, which dilutes it over time. Keep tightly sealed.',
      note: 'An exceptionally powerful solvent that dissolves both polar and non-polar compounds, including many actives nothing else will touch. It is also a potent transdermal carrier, which is the reason for the warnings below.',
      hazards: [
        'DMSO carries whatever is dissolved in it THROUGH SKIN and into the bloodstream — including contaminants, residual solvents and anything on your hands or the container. Skin contact with a drug-loaded DMSO solution is a route of administration, not a spill.',
        'Handle with nitrile gloves (latex is permeable to it) and clean equipment only.',
        'Produces a garlic/oyster taste and body odour within minutes of any exposure, by any route.',
        'Solidifies below about 18.5 °C — a cool room will freeze the solution solid. It must be fully re-melted and mixed before dosing, or concentration will be uneven.',
        'Can cause histamine release, skin irritation and flushing.'
      ]
    },
    peg400: {
      id: 'peg400', name: 'PEG 400', density: 1.128, polarity: 0.5, maxMgMl: 150,
      shelfLifeNote: 'Excellent shelf life.',
      note: 'Standard pharmaceutical cosolvent, non-intoxicating and well tolerated orally. Viscous, which makes very small volumes harder to measure accurately.'
    },
    oil: {
      oily: true,
      id: 'oil', name: 'MCT / carrier oil', density: 0.95, polarity: 0.05, maxMgMl: 60,
      freezes: false, shelfLifeNote: 'Good, though oils eventually oxidise and go rancid.',
      note: 'For fat-soluble actives — cannabinoids above all. Useless for salts. Oral only: never inject or insufflate an oil solution.'
    },
    vinegar: {
      id: 'vinegar', name: 'Dilute acetic acid / vinegar', density: 1.01, polarity: 0.95, maxMgMl: 40,
      freezes: true, shelfLifeNote: 'Moderate; acidic pH suppresses microbial growth.',
      note: 'Used to convert a freebase to a soluble salt in situ. Harsh, and the resulting acidity is irritating to mucous membranes.'
    }
  };

  // 'ethanol' was a single ambiguous entry before it was split into 95%/40%.
  var SOLVENT_ALIASES = { ethanol: 'ethanol95' };

  function solvent(id) {
    return SOLVENTS[id] || SOLVENTS[SOLVENT_ALIASES[id]] || SOLVENTS.water;
  }
  function solventList() {
    return Object.keys(SOLVENTS).map(function (k) { return SOLVENTS[k]; });
  }

  /** Unified search over solvents, so they can be added like any ingredient. */
  function searchSolvents(q, limit) {
    q = String(q || '').toLowerCase().replace(/[\s\-_,()%]/g, '');
    var out = [];
    solventList().forEach(function (s) {
      var hay = (s.name + ' ' + s.id).toLowerCase().replace(/[\s\-_,()%]/g, '');
      if (!q || hay.indexOf(q) >= 0) out.push(s);
    });
    return out.slice(0, limit || 8);
  }

  // Common starting blends, offered as one-click fills.
  var PRESETS = [
    { name: 'Water only', parts: [['water', 1]] },
    { name: 'Ethanol 95% / water 50:50', parts: [['ethanol95', 1], ['water', 1]] },
    { name: 'Spirits (40%) only', parts: [['ethanol40', 1]] },
    { name: 'PG / water 50:50', parts: [['pg', 1], ['water', 1]] },
    { name: 'Ethanol 95% / PG / water 1:1:2', parts: [['ethanol95', 1], ['pg', 1], ['water', 2]] },
    { name: 'DMSO / PG 1:1', parts: [['dmso', 1], ['pg', 1]] },
    { name: 'DMSO / ethanol 95% / water 1:1:2', parts: [['dmso', 1], ['ethanol95', 1], ['water', 2]] }
  ];

  /**
   * Blend several solvents by parts.
   *
   * The total volume stays whatever the user specified — parts only set the
   * RATIO, and each component's volume is its share of that total. Properties
   * that scale with volume (density, solvency ceiling, polarity) are combined
   * as volume-weighted averages, which is a reasonable approximation for
   * miscible liquids and is flagged as unreliable when they are not miscible.
   */
  /**
   * Blend from solvent MASSES. Each solvent is added by weight like any other
   * ingredient, and its volume contribution is mass / density — so the total
   * volume of the solution is derived from what you actually put in it rather
   * than being asserted separately.
   *
   * masses: [{ solventId, massMg }]
   */
  function blendFromMass(masses) {
    masses = (masses || []).filter(function (m) { return m && m.massMg > 0; });
    if (!masses.length) return null;

    // Merge repeats first — two additions of water are just more water.
    var merged = [], seen = {};
    masses.forEach(function (m) {
      var id = solvent(m.solventId).id;
      if (seen[id] != null) merged[seen[id]].massMg += m.massMg;
      else { seen[id] = merged.length; merged.push({ solventId: id, massMg: m.massMg }); }
    });

    var components = merged.map(function (m) {
      var s = solvent(m.solventId);
      return { solvent: s, massG: m.massMg / 1000, volumeMl: (m.massMg / 1000) / s.density };
    });

    var totalVolumeMl = components.reduce(function (a, c) { return a + c.volumeMl; }, 0);
    components.forEach(function (c) {
      c.fraction = totalVolumeMl > 0 ? c.volumeMl / totalVolumeMl : 0;
    });

    var density = components.reduce(function (a, c) { return a + c.fraction * c.solvent.density; }, 0);
    var maxMgMl = components.reduce(function (a, c) { return a + c.fraction * c.solvent.maxMgMl; }, 0);
    var polarity = components.reduce(function (a, c) { return a + c.fraction * c.solvent.polarity; }, 0);

    var byId = {};
    components.forEach(function (c) { byId[c.solvent.id] = c; });

    var name = components.length === 1
      ? components[0].solvent.name
      : components.map(function (c) {
          return c.solvent.name.replace(/ \(.*\)$/, '').replace(' — DO NOT INGEST', '') +
                 ' ' + Math.round(c.fraction * 100) + '%';
        }).join(' / ');

    return {
      components: components, byId: byId, name: name,
      density: density, maxMgMl: maxMgMl, polarity: polarity,
      totalVolumeMl: totalVolumeMl,
      totalMassG: components.reduce(function (a, c) { return a + c.massG; }, 0),
      has: function (id) { return !!byId[id]; },
      fractionOf: function (id) { return byId[id] ? byId[id].fraction : 0; }
    };
  }

  function blend(parts, totalVolumeMl) {
    parts = (parts || []).filter(function (p) { return p && p.parts > 0; });
    if (!parts.length) parts = [{ solventId: 'water', parts: 1 }];

    // Merge repeats: two portions of the same solvent are simply more of it,
    // and listing it twice would produce a nonsense blend name. Resolve
    // aliases first so 'ethanol' and 'ethanol95' merge rather than duplicate.
    var merged = [], seen = {};
    parts.forEach(function (p) {
      var id = solvent(p.solventId).id;
      if (seen[id] != null) {
        merged[seen[id]].parts += p.parts;
      } else {
        seen[id] = merged.length;
        merged.push({ solventId: id, parts: p.parts });
      }
    });

    var totalParts = merged.reduce(function (a, p) { return a + p.parts; }, 0);
    var components = merged.map(function (p) {
      var s = solvent(p.solventId);
      var fraction = p.parts / totalParts;
      return {
        solvent: s, parts: p.parts, fraction: fraction,
        volumeMl: fraction * totalVolumeMl,
        massG: fraction * totalVolumeMl * s.density
      };
    });

    var density = components.reduce(function (a, c) { return a + c.fraction * c.solvent.density; }, 0);
    var maxMgMl = components.reduce(function (a, c) { return a + c.fraction * c.solvent.maxMgMl; }, 0);
    var polarity = components.reduce(function (a, c) { return a + c.fraction * c.solvent.polarity; }, 0);

    var byId = {};
    components.forEach(function (c) { byId[c.solvent.id] = c; });

    var name = components.length === 1
      ? components[0].solvent.name
      : components.map(function (c) {
          return c.solvent.name.replace(/ \(.*\)$/, '') + ' ' + Math.round(c.fraction * 100) + '%';
        }).join(' / ');

    return {
      components: components, byId: byId, name: name,
      density: density, maxMgMl: maxMgMl, polarity: polarity,
      totalVolumeMl: totalVolumeMl,
      has: function (id) { return !!byId[id]; },
      fractionOf: function (id) { return byId[id] ? byId[id].fraction : 0; }
    };
  }

  /** Problems arising from the solvent combination itself. */
  function blendWarnings(bl, doseMl) {
    var out = [];

    // Highest-priority check: a solvent that must never be consumed at all.
    bl.components.forEach(function (c) {
      if (!c.solvent.neverIngest) return;
      out.push({ level: 'danger', text:
        c.solvent.name.replace(' — DO NOT INGEST', '') + ' makes up ' +
        Math.round(c.fraction * 100) + '% of this solution (' + c.volumeMl.toFixed(1) + ' ml). ' +
        'It is a poison, not a dosing vehicle — a ' + doseMl + ' ml dose would contain about ' +
        (doseMl * c.fraction).toFixed(2) + ' ml of it. Methanol blinds and kills at volumes ' +
        'far smaller than people expect, and the damage is done 12-24 hours before symptoms appear. ' +
        'This solution must not be swallowed, insufflated, injected or applied to skin. ' +
        'If it already has been, that is an emergency — call poison control now, do not wait for symptoms.' });
    });

    var oily = bl.components.filter(function (c) { return c.solvent.oily; });
    var aqueous = bl.components.filter(function (c) {
      return c.solvent.polarity >= 0.6 && !c.solvent.oily;
    });

    if (oily.length && aqueous.length) {
      out.push({ level: 'danger', text:
        'IMMISCIBLE MIX: ' + oily.map(function (c) { return c.solvent.name; }).join(', ') +
        ' will not mix with ' + aqueous.map(function (c) { return c.solvent.name; }).join(', ') +
        '. The solution separates into layers, and each layer holds a different amount of drug — ' +
        'so every dose drawn is a different dose. Do not combine oil with water or ethanol.' });
    }

    if (bl.has('dmso')) {
      var pct = Math.round(bl.fractionOf('dmso') * 100);
      out.push({ level: 'danger', text:
        'This solution is ' + pct + '% DMSO. DMSO carries dissolved drug through intact skin. ' +
        'Any spill on your hands is a dose. Use nitrile gloves (not latex), keep equipment clean, ' +
        'and never let it contact anything you would not want absorbed.' });
      if (bl.fractionOf('dmso') > 0.3) {
        out.push({ level: 'warn', text:
          'Above roughly 30% DMSO the solution freezes solid below about 18.5 °C. If it sets, ' +
          'it must be fully melted and remixed before dosing or the concentration will be uneven.' });
      }
    }

    if (bl.has('vinegar') && bl.fractionOf('vinegar') > 0.5) {
      out.push({ level: 'warn', text:
        'A predominantly acidic solution is harsh on mucous membranes and unpleasant to take ' +
        'sublingually or nasally.' });
    }

    // Preservation: ethanol below ~20% of the blend no longer protects it.
    var ethFrac = bl.fractionOf('ethanol');
    var waterFrac = bl.fractionOf('water');
    if (waterFrac > 0.3 && ethFrac > 0 && ethFrac < 0.2) {
      out.push({ level: 'info', text:
        'Ethanol is only ' + Math.round(ethFrac * 100) + '% of this blend — below roughly 20% it no ' +
        'longer preserves the solution, so treat shelf life as that of a water-based one.' });
    }

    if (bl.components.length > 1) {
      out.push({ level: 'info', text:
        'Blend properties (density ' + bl.density.toFixed(3) + ' g/ml, ceiling ~' +
        Math.round(bl.maxMgMl) + ' mg/ml) are volume-weighted averages of the components. Real ' +
        'mixed-solvent behaviour is not linear — treat them as a guide, not a specification.' });
    }
    return out;
  }

  /**
   * ingredients: [{ drugId, amount, unit, route }]
   * opts: { volumeMl, doseMl }
   */
  /**
   * items: a single list mixing actives and solvents, all added by mass:
   *   { kind: 'active', drugId, amount, unit, route }
   *   { kind: 'solvent', solventId, amount, unit }
   * Entries without `kind` are treated as actives, for older callers.
   *
   * The solution's total volume is DERIVED from the solvent masses, so it
   * updates as ingredients are added rather than being stated separately.
   */
  function compute(items, opts) {
    opts = opts || {};
    var doseMl = opts.doseMl > 0 ? opts.doseMl : 1;

    items = items || [];
    var solventItems = items.filter(function (i) { return i.kind === 'solvent'; });
    var ingredients = items.filter(function (i) { return i.kind !== 'solvent'; });

    var bl = blendFromMass(solventItems.map(function (i) {
      var s = solvent(i.solventId);
      return { solventId: i.solventId, massMg: massMgOf(i.amount, i.unit, s.density) };
    }));

    // With no solvent there is no solution — report the actives but avoid
    // dividing by zero, and say so in the warnings.
    var noSolvent = !bl;
    if (noSolvent) bl = blendFromMass([{ solventId: 'water', massMg: 1000 }]);

    // Total volume is solvent volume PLUS the volume the dissolved solids
    // occupy. Skipping the second term is fine for milligram doses and badly
    // wrong for anything weighed in grams — 1.8 kg of sucrose adds over a
    // litre, and every concentration below depends on getting this right.
    var solventVolumeMl = bl.totalVolumeMl;
    var soluteVolumeMl = 0;
    var anyAssumedDensity = false;
    ingredients.forEach(function (ing) {
      var drug = DB.get(ing.drugId);
      var mg = toMg(ing.amount, ing.unit);
      if (!(mg > 0)) return;
      var sd = soluteDensity(drug);
      if (sd.assumed) anyAssumedDensity = true;
      soluteVolumeMl += (mg / 1000) / sd.value;
    });
    var volumeMl = solventVolumeMl + soluteVolumeMl;

    var rows = ingredients.map(function (ing) {
      var drug = DB.get(ing.drugId);
      var totalMg = toMg(ing.amount, ing.unit);
      var concMgMl = totalMg / volumeMl;
      var perDoseMg = concMgMl * doseMl;
      var route = ing.route || (drug ? Object.keys(drug.routes)[0] : 'oral');

      var tier = drug ? PK.doseTier(drug, route, perDoseMg) : { tier: 'unknown', ratio: null };
      var common = drug ? PK.commonDoseMg(drug, route) : null;

      // The space this solid takes up once dissolved — the same figure that
      // went into `soluteVolumeMl` above, kept per-ingredient so a composition
      // chart can be drawn by volume as well as by mass. For a dense active in
      // a light solvent the two orderings genuinely differ.
      var sdRow = soluteDensity(drug);

      return {
        drug: drug,
        drugId: ing.drugId,
        route: route,
        inactive: !!(drug && drug.inactive),
        inputAmount: ing.amount,
        inputUnit: ing.unit,
        totalMg: totalMg,
        volumeMl: (totalMg / 1000) / sdRow.value,
        densityGMl: sdRow.value,
        densityAssumed: sdRow.assumed,
        concMgMl: concMgMl,
        perDoseMg: perDoseMg,
        tier: tier.tier,
        doseRatio: common ? perDoseMg / common : null,
        commonDoseMg: common
      };
    });


    // Two different denominators, because they answer different questions:
    // "% of mass" is the whole solid content including fillers, which is what
    // you actually weigh out; "% of active mass" ignores inactives, which is
    // what determines potency.
    var totalMassMg = rows.reduce(function (a, r) { return a + r.totalMg; }, 0);
    var activeMassMg = rows.reduce(function (a, r) { return a + (r.inactive ? 0 : r.totalMg); }, 0);
    rows.forEach(function (r) {
      r.massFraction = totalMassMg > 0 ? r.totalMg / totalMassMg : 0;
      r.activeMassFraction = r.inactive ? null
        : (activeMassMg > 0 ? r.totalMg / activeMassMg : 0);
    });

    var drugs = rows.map(function (r) { return r.drug; })
      .filter(function (d) { return d && !d.inactive; });
    var findings = Interactions.amongst(drugs);

    // If any component is itself psychoactive (ethanol), a dose carries a real
    // amount of it — small for a 1 ml dose, but not for a 20 ml one.
    // Sum across every alcohol-bearing component — a blend can contain both
    // 95% ethanol and 40% spirits, and taking only the last would undercount.
    var solventDose = null;
    bl.components.forEach(function (c) {
      var s = c.solvent;
      if (!s.activeDrugId) return;
      var strength = s.activeFraction != null ? s.activeFraction : 1;
      var gPerDose = doseMl * c.fraction * strength * s.density;
      var gTotal = volumeMl * c.fraction * strength * s.density;
      if (!solventDose) {
        solventDose = { drug: DB.get(s.activeDrugId), gramsPerDose: 0, gramsTotal: 0, fraction: 0 };
      }
      solventDose.gramsPerDose += gPerDose;
      solventDose.gramsTotal += gTotal;
      solventDose.fraction += c.fraction * strength;
    });

    return {
      rows: rows,
      blend: bl,
      solvent: bl,                       // alias: reports read `.name`/`.density`
      solventDose: solventDose,
      solventItems: solventItems,
      noSolvent: noSolvent,
      volumeMl: volumeMl,
      solventVolumeMl: solventVolumeMl,
      soluteVolumeMl: soluteVolumeMl,
      soluteDensityAssumed: anyAssumedDensity,
      doseMl: doseMl,
      totalMassMg: totalMassMg,
      activeMassMg: activeMassMg,
      // Mass of everything in the container, solvent included — the number a
      // scale would read. `totalMassMg` is the solids only.
      totalSystemMassG: bl.totalMassG + totalMassMg / 1000,
      // The density of the finished solution, not of the solvent blend. These
      // diverge sharply once a lot of solid is dissolved.
      solutionDensity: volumeMl > 0 ? (bl.totalMassG + totalMassMg / 1000) / volumeMl : null,
      dosesAvailable: doseMl > 0 ? volumeMl / doseMl : 0,
      totalConcMgMl: totalMassMg / volumeMl,
      freezing: freezePoint(bl, rows, volumeMl),
      ph: estimatePh(bl, rows),
      saturation: saturationCheck(bl, rows, volumeMl),
      findings: findings,
      warnings: (noSolvent
        ? [{ level: 'warn', text: 'No solvent added yet — add one (water, ethanol, PG…) by mass and the volume, concentration and per-dose amounts will follow from it.' }]
        : []
      ).concat(blendWarnings(bl, doseMl), buildWarnings(rows, volumeMl, doseMl, bl, solventDose),
               freezeWarnings(freezePoint(bl, rows, volumeMl)),
               saturationWarnings(saturationCheck(bl, rows, volumeMl)),
               phWarnings(estimatePh(bl, rows)))
    };
  }

  /* ==========================================================================
     FREEZING
     --------------------------------------------------------------------------
     Whether a solution freezes matters for two practical reasons: a frozen
     stock has to be fully remelted and remixed before it is uniform again, and
     for DMSO the freezing point is above a cold room, so it happens routinely.

     The estimate below is coarse and clearly labelled as such. Antifreeze
     behaviour is strongly non-linear, so measured curves for the two solvents
     that actually matter — ethanol and the glycols — are interpolated, and
     dissolved solids add a colligative term on top.
     ========================================================================== */

  // Measured freezing points of aqueous ethanol, by volume percent.
  var ETHANOL_FREEZE = [[0, 0], [10, -4], [20, -9], [30, -15], [40, -23],
                        [50, -32], [60, -44], [70, -51], [80, -60], [90, -73], [100, -114]];
  // Glycerol and propylene glycol, by volume percent. Both flatten out and
  // then rise again at very high concentrations; only the useful range is here.
  var GLYCOL_FREEZE = [[0, 0], [10, -2], [20, -5], [30, -10], [40, -16],
                       [50, -23], [60, -34], [70, -38], [80, -20], [100, 18]];

  function interp(table, x) {
    if (x <= table[0][0]) return table[0][1];
    for (var i = 1; i < table.length; i++) {
      if (x <= table[i][0]) {
        var a = table[i - 1], b = table[i];
        var f = (x - a[0]) / (b[0] - a[0]);
        return a[1] + f * (b[1] - a[1]);
      }
    }
    return table[table.length - 1][1];
  }

  /**
   * Estimated freezing point of the finished solution, in °C.
   *
   * Returns the temperature plus the reasoning, because a bare number here
   * would imply a precision the method does not have.
   */
  function freezePoint(bl, rows, volumeMl) {
    if (!bl) return null;

    var ethanolPct = 0, glycolPct = 0, dmsoPct = 0, oilPct = 0, waterPct = 0;
    bl.components.forEach(function (c) {
      var id = c.solvent.id, pct = c.fraction * 100;
      if (id === 'ethanol95') ethanolPct += pct * 0.95;
      else if (id === 'ethanol40') { ethanolPct += pct * 0.40; waterPct += pct * 0.60; }
      else if (id === 'methanol') ethanolPct += pct;          // similar depression
      else if (id === 'vg' || id === 'pg' || id === 'peg400') glycolPct += pct;
      else if (id === 'dmso') dmsoPct += pct;
      else if (id === 'oil') oilPct += pct;
      else waterPct += pct;                                    // water, vinegar
    });

    var reasons = [];
    var tempC;

    if (dmsoPct >= 50) {
      // DMSO dominates and freezes at 18.5 °C — above a cold room.
      tempC = 18.5 - (100 - dmsoPct) * 0.35;
      reasons.push('DMSO freezes at 18.5 °C, and it makes up ' + Math.round(dmsoPct) + '% of this blend');
    } else if (oilPct >= 60) {
      tempC = 5;
      reasons.push('an oil base does not freeze sharply — it clouds and thickens as it chills');
    } else {
      // Water-based: take whichever antifreeze depresses more, rather than
      // adding them, since they compete for the same water.
      var fromEthanol = interp(ETHANOL_FREEZE, ethanolPct);
      var fromGlycol = interp(GLYCOL_FREEZE, glycolPct);
      tempC = Math.min(fromEthanol, fromGlycol);
      if (ethanolPct >= 5) reasons.push(Math.round(ethanolPct) + '% ethanol by volume');
      if (glycolPct >= 5) reasons.push(Math.round(glycolPct) + '% glycol or glycerine');
      if (!reasons.length) reasons.push('essentially water, with nothing to depress the freezing point');
      if (dmsoPct > 0) reasons.push(Math.round(dmsoPct) + '% DMSO, which raises it back toward 18.5 °C');
      tempC += dmsoPct * 0.15;
    }

    // Dissolved solids depress it further. Real solutions leave the ideal
    // colligative regime well before this concentration, so the term is capped.
    var molalSum = 0;
    (rows || []).forEach(function (r) {
      var mm = r.drug ? molarMass(r.drug.formula) : null;
      if (!mm) return;
      var kgSolvent = bl.totalMassG / 1000;
      if (kgSolvent <= 0) return;
      molalSum += (r.totalMg / 1000 / mm) / kgSolvent;
    });
    var colligative = Math.min(15, 1.86 * molalSum);
    if (colligative > 0.5) {
      reasons.push('dissolved solids lower it a further ~' + colligative.toFixed(1) + ' °C');
      tempC -= colligative;
    }

    return {
      tempC: tempC,
      reasons: reasons,
      freezesInFreezer: tempC > -18,
      freezesInFridge: tempC > 4,
      freezesAtRoomTemp: tempC > 18
    };
  }

  function freezeWarnings(fz) {
    if (!fz) return [];
    var out = [];
    var t = fz.tempC.toFixed(0) + ' °C';
    if (fz.freezesAtRoomTemp) {
      out.push({ level: 'danger', text:
        'FREEZES AT ROOM TEMPERATURE — estimated freezing point ' + t + '. It will set solid in any ' +
        'normal room, and a partly frozen solution is not uniform: the solvent freezes first and leaves ' +
        'the drug concentrated in what is still liquid. Remelt fully and mix before drawing any dose.' });
    } else if (fz.freezesInFridge) {
      out.push({ level: 'warn', text:
        'Freezes in a refrigerator — estimated freezing point ' + t + '. Fine at room temperature, but ' +
        'if it is stored cold it must be fully remelted and remixed before use, or the concentration ' +
        'will be uneven from one draw to the next.' });
    } else if (fz.freezesInFreezer) {
      out.push({ level: 'info', text:
        'Estimated freezing point ' + t + ' — it will freeze in a domestic freezer but not in a fridge.' });
    } else {
      out.push({ level: 'info', text:
        'Estimated freezing point ' + t + ' — stays liquid at any normal storage temperature.' });
    }
    return out;
  }

  /* ==========================================================================
     SATURATION AND RECRYSTALLISATION
     --------------------------------------------------------------------------
     A solution holds only so much. Past that, the excess does not stay
     dissolved — it comes back out as crystals, usually overnight and usually
     after it has been moved somewhere cooler. What is left behind is a weaker
     solution than the arithmetic says, and a layer of pure compound at the
     bottom that the next person to shake the bottle gets all at once.

     Solubility is strongly solvent-specific, which is the whole point of the
     sugar-in-ethanol case: sucrose dissolves ~2 g/ml in water and almost not
     at all in ethanol, so a blend that looked fine as an aqueous solution
     crashes out once enough ethanol goes in.
     ========================================================================== */

  function solubilityInBlend(drug, bl) {
    var sol = drug && drug.solubility;
    if (!sol || !bl) return null;
    var total = 0, covered = 0;
    bl.components.forEach(function (c) {
      var id = c.solvent.id;
      var key = (id === 'ethanol95' || id === 'ethanol40') ? 'ethanol'
              : (id === 'vg') ? 'glycerol'
              : (id === 'pg' || id === 'peg400') ? 'glycol'
              : (id === 'oil') ? 'oil'
              : (id === 'dmso') ? 'dmso'
              : 'water';
      var v = sol[key];
      if (v == null) return;
      // Aqueous ethanol carries its own water, which keeps dissolving things.
      if (id === 'ethanol40' && sol.water != null) v = 0.4 * v + 0.6 * sol.water;
      total += c.fraction * v;
      covered += c.fraction;
    });
    if (covered < 0.5) return null;          // too little of the blend is characterised
    return total / covered;
  }

  function saturationCheck(bl, rows, volumeMl) {
    var out = [];
    (rows || []).forEach(function (r) {
      var ceiling = solubilityInBlend(r.drug, bl);
      if (ceiling == null || !(ceiling > 0)) return;
      var ratio = r.concMgMl / ceiling;
      out.push({
        drug: r.drug,
        concMgMl: r.concMgMl,
        ceilingMgMl: ceiling,
        ratio: ratio,
        saturated: ratio >= 1,
        nearSaturated: ratio >= 0.7 && ratio < 1
      });
    });
    return out;
  }

  /** Concentrations here span 0.03 to 2000 mg/ml, so a fixed precision lies. */
  function fmtConcMgMl(v) {
    if (v >= 100) return v.toFixed(0);
    if (v >= 10) return v.toFixed(1);
    if (v >= 1) return v.toFixed(2);
    return v.toPrecision(2);
  }

  function saturationWarnings(checks) {
    var out = [];
    (checks || []).forEach(function (c) {
      var name = c.drug ? c.drug.name : 'This ingredient';
      if (c.saturated) {
        out.push({ level: 'danger', text:
          name + ' WILL NOT ALL DISSOLVE — ' + fmtConcMgMl(c.concMgMl) + ' mg/ml against a solubility of about ' +
          fmtConcMgMl(c.ceilingMgMl) + ' mg/ml in this blend (' + c.ratio.toFixed(1) + '× saturated). The excess ' +
          'will crystallise out. Everything above the ceiling ends up as solid at the bottom, so the liquid is ' +
          'weaker than calculated and whatever is disturbed later is far stronger.' });
      } else if (c.nearSaturated) {
        out.push({ level: 'warn', text:
          name + ' is close to saturation — ' + fmtConcMgMl(c.concMgMl) + ' mg/ml against about ' +
          fmtConcMgMl(c.ceilingMgMl) + ' mg/ml (' + Math.round(c.ratio * 100) + '% of the ceiling). It will stay ' +
          'dissolved while warm and RECRYSTALLISE AS IT COOLS or if it is left standing. Warm and remix before use.' });
      }
    });
    return out;
  }

  /* ==========================================================================
     pH
     --------------------------------------------------------------------------
     Worth reporting for three practical reasons: many actives only dissolve as
     a salt at a particular pH, sodium benzoate only preserves below about 4.5,
     and anything going on a mucous membrane stings badly if it is far from
     neutral.

     This is a component-based ESTIMATE, not a calculation from first
     principles — a real answer needs the pKa and concentration of every
     species, which this database does not carry. Each ingredient contributes a
     characteristic pH weighted by how much of it there is, which is enough to
     separate "roughly neutral", "acidic enough to preserve" and "harsh".
     ========================================================================== */

  // Characteristic pH of a 1% aqueous solution, by ingredient id.
  var PH_CONTRIB = {
    'citric-acid':        2.2,
    'salicylic-acid':     2.4,
    aspirin:              3.5,
    'vitamin-c':          2.5,
    vinegar:              2.9,
    'sodium-benzoate':    8.0,
    'sodium-citrate':     8.2,
    'sodium-bicarbonate': 8.3,
    'sodium-metabisulfite': 4.3,
    'edetate-disodium':   4.5,
    'saccharin-sodium':   7.0,
    'docusate-sodium':    6.5,
    'sodium-lauryl-sulfate': 8.0,
    lactose:              6.5,
    sucrose:              6.8,
    'sodium-chloride':    7.0
  };

  // Solvents that set a baseline of their own.
  var SOLVENT_PH = { water: 7.0, vinegar: 2.9, ethanol95: 7.0, ethanol40: 7.0,
                     pg: 7.0, vg: 7.0, peg400: 6.0, dmso: 7.0, oil: null, methanol: 7.0 };

  /**
   * Estimated pH of the finished mixture, or null where the question does not
   * apply — an oil base has no pH at all, because there is no water for ions
   * to be in.
   */
  function estimatePh(bl, rows) {
    if (!bl) return null;

    // An essentially non-aqueous base has no meaningful pH.
    var aqueousFraction = 0;
    bl.components.forEach(function (c) {
      if (SOLVENT_PH[c.solvent.id] != null && c.solvent.id !== 'oil') aqueousFraction += c.fraction;
    });
    if (aqueousFraction < 0.2) {
      return { ph: null, reason: 'This is essentially a non-aqueous base, so pH is not defined for it.' };
    }

    var base = 0, wsum = 0;
    bl.components.forEach(function (c) {
      var p = SOLVENT_PH[c.solvent.id];
      if (p == null) return;
      base += p * c.fraction; wsum += c.fraction;
    });
    base = wsum > 0 ? base / wsum : 7.0;

    // Each ingredient pulls the mixture toward its own characteristic pH, by
    // an amount that grows with concentration and saturates — a pinch of
    // citric acid does not take a litre to pH 2.2.
    var ph = base, drivers = [];
    (rows || []).forEach(function (r) {
      var target = PH_CONTRIB[r.drugId];
      if (target == null) return;
      var pct = r.concMgMl / 10;                  // % w/v
      if (pct <= 0) return;
      var weight = Math.min(0.9, pct / (pct + 0.5));
      ph = ph + (target - ph) * weight;
      if (weight > 0.15) {
        drivers.push((r.drug ? r.drug.name : r.drugId) + ' (' + pct.toFixed(1) + '% w/v)');
      }
    });

    ph = Math.max(1, Math.min(13, ph));
    return {
      ph: ph,
      drivers: drivers,
      reason: drivers.length
        ? 'Driven mainly by ' + drivers.join(', ') + '.'
        : 'Nothing in this mixture shifts it far from its solvent baseline.'
    };
  }

  function phWarnings(est) {
    if (!est) return [];
    if (est.ph == null) return [{ level: 'info', text: est.reason }];
    var p = est.ph;
    var out = [];
    var say = 'Estimated pH ' + p.toFixed(1) + '. ' + est.reason;

    if (p < 3) {
      out.push({ level: 'warn', text: say + ' STRONGLY ACIDIC — this will sting badly on any mucous ' +
        'membrane, erodes tooth enamel with repeated oral use, and is painful and vein-damaging if injected. ' +
        'It does dissolve freebases well, which is usually why a mixture ends up here.' });
    } else if (p < 4.5) {
      out.push({ level: 'info', text: say + ' Acidic. This is the range where sodium benzoate actually ' +
        'works as a preservative, and where most freebase-to-salt conversion happens.' });
    } else if (p > 9) {
      out.push({ level: 'warn', text: say + ' STRONGLY ALKALINE — harsh on mucous membranes, and it will ' +
        'push basic drugs toward their freebase form, which usually means they come out of solution.' });
    } else if (p > 8) {
      out.push({ level: 'info', text: say + ' Alkaline. Benzoate preservatives stop working above about ' +
        'pH 5, so this mixture is not protected by one.' });
    } else {
      out.push({ level: 'info', text: say + ' Close enough to neutral to be comfortable on a mucous membrane.' });
    }
    return out;
  }

  /** Practical problems with the mixture as specified. */
  function buildWarnings(rows, volumeMl, doseMl, bl, solventDose) {
    var out = [];

    // ---- solvent-specific checks ----
    var totalConcAll = rows.reduce(function (a, r) { return a + r.concMgMl; }, 0);
    if (bl && totalConcAll > bl.maxMgMl) {
      out.push({ level: 'warn', text:
        'Total concentration is ' + totalConcAll.toFixed(1) + ' mg/ml, above the rough practical ceiling of ~' +
        Math.round(bl.maxMgMl) + ' mg/ml for this blend. Undissolved material settles out, which makes every ' +
        'dose wrong in an unpredictable direction. Use more solvent, or raise the share of a stronger one.' });
    }
    if (bl && bl.fractionOf('oil') > 0.5) {
      var nonFat = rows.filter(function (r) {
        return r.drug && r.drug.class !== 'Cannabinoid';
      });
      if (nonFat.length) {
        out.push({ level: 'warn', text:
          'Carrier oil dissolves fat-soluble actives (cannabinoids). ' +
          nonFat.map(function (r) { return r.drug.name; }).join(', ') +
          ' is unlikely to dissolve properly in oil unless it is a freebase.' });
      }
      out.push({ level: 'info', text: 'Oil solutions are for oral use only — never inject or insufflate them.' });
    }
    if (bl && bl.fractionOf('water') > 0.7 && !bl.has('ethanol') && !bl.has('pg') && !bl.has('dmso')) {
      out.push({ level: 'info', text:
        'A predominantly water-based solution dissolves salts but not freebases, and has the shortest ' +
        'shelf life of the options here. Refrigerate, make small batches, discard after a few weeks.' });
    }
    if (bl && solventDose && solventDose.drug) {
      var g = solventDose.gramsPerDose;
      var level = g >= 7 ? 'warn' : 'info';
      out.push({ level: level, text:
        'The solvent itself is psychoactive: each ' + doseMl + ' ml dose contains about ' +
        (g < 1 ? (g * 1000).toFixed(0) + ' mg' : g.toFixed(1) + ' g') + ' of ethanol' +
        (g >= 7 ? ' — around half a standard drink or more per dose, which is additive with any depressant in the mix.'
                : ' (negligible at this dose volume, but it scales if you increase the dose).') });
    }

    rows.forEach(function (r) {
      if (!r.drug) {
        out.push({ level: 'error', text: 'Unknown substance "' + r.drugId + '" — no data to check it against.' });
        return;
      }
      if (r.inactive) return;      // fillers have no dose tier to warn about
      if (r.tier === 'heavy') {
        out.push({ level: 'danger', text:
          r.drug.name + ': a ' + doseMl + ' ml dose delivers ' + Potency.fmtMg(r.perDoseMg) +
          ', which is a HEAVY dose on its own ladder.' });
      } else if (r.tier === 'strong') {
        out.push({ level: 'warn', text:
          r.drug.name + ': a ' + doseMl + ' ml dose delivers ' + Potency.fmtMg(r.perDoseMg) + ' — a strong dose.' });
      }
      // Measurement precision: doses under ~0.1 ml cannot be drawn accurately
      // in a normal syringe, which defeats the point of making a solution.
      if (doseMl < 0.1) {
        out.push({ level: 'warn', text:
          'A ' + doseMl + ' ml dose is below what most syringes measure reliably. Dilute further so a dose is at least 0.1-0.5 ml.' });
      }
      if (r.concMgMl > 0 && r.concMgMl < 0.01) {
        out.push({ level: 'info', text:
          r.drug.name + ' is at ' + Potency.fmtConc(r.concMgMl) + ' — very dilute, so small volume errors matter less, but the solution is bulky.' });
      }
    });

    // Deduplicate the syringe-precision warning.
    var seen = {}, dedup = [];
    out.forEach(function (w) { if (!seen[w.text]) { seen[w.text] = 1; dedup.push(w); } });
    return dedup;
  }

  /* ---------- plain-text report -------------------------------------------- */

  function pad(s, n) {
    s = String(s);
    return s.length >= n ? s : s + new Array(n - s.length + 1).join(' ');
  }
  function padL(s, n) {
    s = String(s);
    return s.length >= n ? s : new Array(n - s.length + 1).join(' ') + s;
  }

  function textReport(result) {
    var L = [];
    var line = function (s) { L.push(s == null ? '' : s); };
    var rule = function (ch) { line(new Array(79).join(ch || '-')); };

    rule('=');
    line('SOLUTION BREAKDOWN');
    rule('=');
    line('');
    var bl = result.blend;
    line('Solvent system      : ' + bl.name);
    line('Total volume        : ' + result.volumeMl.toFixed(2) + ' ml  (from solvent masses)');
    line('Dose volume         : ' + result.doseMl + ' ml');
    line('Doses in solution   : ' + (Math.floor(result.dosesAvailable * 10) / 10));
    line('Total active mass   : ' + Potency.fmtMg(result.totalMassMg));
    line('Total concentration : ' + Potency.fmtConc(result.totalConcMgMl));
    line('Blend density       : ' + bl.density.toFixed(3) + ' g/ml');
    line('Solvency ceiling    : ~' + Math.round(bl.maxMgMl) + ' mg/ml (approximate)');
    if (result.solventDose && result.solventDose.drug) {
      var gp = result.solventDose.gramsPerDose;
      line('Ethanol per dose    : ' + (gp < 1 ? (gp * 1000).toFixed(0) + ' mg' : gp.toFixed(2) + ' g') +
           '  (psychoactive)');
    }
    line('');

    rule('=');
    line('SOLVENT SYSTEM');
    rule('=');
    line('');
    line(pad('COMPONENT', 28) + padL('MASS', 10) + padL('VOLUME', 11) + padL('SHARE', 8) + padL('DENSITY', 10));
    rule('-');
    bl.components.forEach(function (c) {
      line(
        pad(c.solvent.name, 28) +
        padL(c.massG.toFixed(2) + ' g', 10) +
        padL(c.volumeMl.toFixed(2) + ' ml', 11) +
        padL((c.fraction * 100).toFixed(1) + '%', 8) +
        padL(c.solvent.density.toFixed(3), 10)
      );
    });
    line('');
    bl.components.forEach(function (c) {
      line('* ' + c.solvent.name);
      wrapInto(L, c.solvent.note, '    ', 74);
      wrapInto(L, c.solvent.shelfLifeNote, '    Shelf life: ', 74);
      (c.solvent.hazards || []).forEach(function (hz) { wrapInto(L, hz, '    ! ', 74); });
      line('');
    });

    rule('=');
    line('INGREDIENTS');
    rule('=');
    line('');
    line(pad('SUBSTANCE', 22) + padL('TOTAL', 11) + padL('% MASS', 9) +
         padL('CONC', 13) + padL('PER DOSE', 12) + '  TIER');
    rule('-');
    result.rows.forEach(function (r) {
      line(
        pad(r.drug ? r.drug.name : r.drugId, 22) +
        padL(Potency.fmtMg(r.totalMg), 11) +
        padL((r.massFraction * 100).toFixed(1) + '%', 9) +
        padL(Potency.fmtConc(r.concMgMl), 13) +
        padL(Potency.fmtMg(r.perDoseMg), 12) + '  ' + r.tier
      );
    });
    line('');

    rule('=');
    line('PER DOSE (' + result.doseMl + ' ml)');
    rule('=');
    result.rows.forEach(function (r) {
      var d = r.drug;
      line('');
      line('* ' + (d ? d.name : r.drugId) + ' — ' + Potency.fmtMg(r.perDoseMg) + ' (' + r.route + ')');
      if (!d) { line('    No data available for this substance.'); return; }
      line('    Class            : ' + d.class + (d.family ? ' / ' + d.family : ''));
      line('    Dose tier        : ' + r.tier +
           (r.doseRatio != null ? '  (' + r.doseRatio.toFixed(2) + '× a common dose)' : ''));
      if (r.commonDoseMg) line('    Common dose      : ' + Potency.fmtMg(r.commonDoseMg));

      var rt = d.routes[r.route] || d.routes[Object.keys(d.routes)[0]];
      if (rt.doses) {
        // Same normalisation as the UI, so the report reads in natural units.
        var MASS = { ng: 1e-6, ug: 1e-3, 'µg': 1e-3, mcg: 1e-3, mg: 1, g: 1e3, kg: 1e6 };
        var lu = rt.doses.unit || 'mg';
        var sc = MASS[lu];
        // `open` marks the top tier, which is the only one that takes a "+".
        var f = function (x, open) {
          if (x == null) return '?';
          var plus = open ? '+' : '';
          if (sc == null) return (Array.isArray(x) ? x[0] + '-' + x[1] : x + plus) + ' ' + lu;
          return Array.isArray(x) ? Potency.fmtRangeMg(x[0] * sc, x[1] * sc)
                                  : Potency.fmtMg(x * sc) + plus;
        };
        line('    Ladder           : threshold ' + f(rt.doses.threshold) +
             ' | light ' + f(rt.doses.light) +
             ' | common ' + f(rt.doses.common) +
             ' | strong ' + f(rt.doses.strong) +
             ' | heavy ' + f(rt.doses.heavy, true));
      }
      line('    Onset / peak     : ' + rt.onsetMin[0] + '-' + rt.onsetMin[1] + ' min / ' +
           Math.round(rt.peakMin[0]) + '-' + Math.round(rt.peakMin[1]) + ' min');
      line('    Duration         : ' + rt.durationH[0] + '-' + rt.durationH[1] + ' h' +
           (rt.afterEffectsH[1] ? '  (+ after-effects ' + rt.afterEffectsH[0] + '-' + rt.afterEffectsH[1] + ' h)' : ''));
      line('    Bioavailability  : ~' + Math.round(rt.bioavailability * 100) + '%');
      line('    Half-life        : ' + Charts.fmtDur(d.halfLife.hours) +
           '  [' + d.halfLife.confidence + ']' +
           (d.halfLife.range ? '  range ' + d.halfLife.range[0] + '-' + d.halfLife.range[1] + ' h' : ''));
      line('    ~97% cleared     : ' + Charts.fmtDur(d.halfLife.hours * 5));

      var enz = d.metabolism.substrateOf;
      if (enz.length) line('    Metabolised by   : ' + enz.join(', '));
      if (d.metabolism.inhibits.length) line('    Inhibits         : ' + d.metabolism.inhibits.join(', '));
      if (d.metabolism.induces.length) line('    Induces          : ' + d.metabolism.induces.join(', '));

      var act = d.metabolism.metabolites.filter(function (m) { return m.active; });
      if (act.length) {
        line('    Active metabolites:');
        act.forEach(function (m) {
          line('      - ' + m.name +
               (m.halfLifeH != null ? '  t½ ' + Charts.fmtDur(m.halfLifeH) : '') +
               (m.potencyRel != null ? '  potency ' + Potency.fmtRatio(m.potencyRel) + ' vs parent' : ''));
        });
      }
      if (d.warnings.length) {
        line('    Warnings:');
        d.warnings.forEach(function (w) { wrapInto(L, w, '      - ', 74); });
      }
    });
    line('');

    if (result.warnings.length) {
      rule('=');
      line('MIXTURE CHECKS');
      rule('=');
      line('');
      result.warnings.forEach(function (w) {
        wrapInto(L, w.text, '[' + w.level.toUpperCase() + '] ', 76);
      });
      line('');
    }

    if (result.findings.length) {
      rule('=');
      line('INTERACTIONS BETWEEN INGREDIENTS');
      rule('=');
      line('');
      result.findings.forEach(function (f) {
        line('[' + Interactions.LEVELS[f.level].label.toUpperCase() + '] ' + f.title +
             '  (' + f.drugs.map(function (d) { return d.name; }).join(' + ') + ')');
        wrapInto(L, f.mechanism, '    ', 74);
        if (f.detail) wrapInto(L, f.detail, '    ', 74);
        line('');
      });
    } else if (result.rows.length > 1) {
      rule('=');
      line('INTERACTIONS BETWEEN INGREDIENTS');
      rule('=');
      line('');
      line('None found in this database. That is not a safety endorsement — most');
      line('combinations have never been formally studied.');
      line('');
    }

    rule('=');
    line('Estimates only. Every value carries the confidence marker shown above.');
    line('Not medical advice. Generated by drug-info.');
    rule('=');

    return L.join('\n');
  }

  function wrapInto(L, text, prefix, width) {
    var words = String(text).split(/\s+/);
    var cur = prefix;
    var indent = new Array(prefix.length + 1).join(' ');
    words.forEach(function (w) {
      if (cur.length + w.length + 1 > width && cur.trim().length) {
        L.push(cur);
        cur = indent + w;
      } else {
        cur += (cur === prefix || cur === indent ? '' : ' ') + w;
      }
    });
    if (cur.trim().length) L.push(cur);
  }

  global.Solution = {
    compute: compute,
    textReport: textReport,
    toMg: toMg,
    toMl: toMl,
    isVolumeUnit: isVolumeUnit,
    massMgOf: massMgOf,
    volumeMlOf: volumeMlOf,
    MASS_UNITS: ['µg', 'mg', 'g', 'kg', 'oz', 'lb', 'dram'],
    VOLUME_UNITS: ['µl', 'ml', 'L', 'tsp', 'tbsp', 'floz', 'cup', 'pt', 'qt', 'gal'],
    SOLVENTS: SOLVENTS,
    PRESETS: PRESETS,
    solvent: solvent,
    solventList: solventList,
    searchSolvents: searchSolvents,
    blend: blend,
    blendFromMass: blendFromMass,
    molarMass: molarMass,
    gramsFromMoles: gramsFromMoles,
    soluteDensity: soluteDensity,
    DEFAULT_SOLUTE_DENSITY: DEFAULT_SOLUTE_DENSITY,
    freezePoint: freezePoint,
    estimatePh: estimatePh,
    solubilityInBlend: solubilityInBlend
  };
})(window);

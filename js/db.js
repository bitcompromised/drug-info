/* ==========================================================================
   db.js — Drug database registry, schema and lookup index
   --------------------------------------------------------------------------
   Data files in js/data/*.js call DB.register([...]) at load time. Every
   pharmacokinetic value carries a `confidence` marker:

     measured   — human PK studies / clinical literature
     estimated  — case reports, forensic casework, limited published data
     analogue   — inferred from a close structural analogue (RCs, novel drugs)
     community  — harm-reduction wiki consensus ranges (PsychonautWiki, TripSit).
                  Curated but ultimately user-derived, not clinical data.
     anecdotal  — user reports only, no published source. Opinion, not evidence.
     unknown    — no usable data; placeholder so the model still runs

   Anything not marked `measured` is a guess and is labelled as such in the UI.
   `sources` on an entry records where the non-clinical numbers came from.
   ========================================================================== */
(function (global) {
  'use strict';

  var DRUGS = [];
  var BY_ID = Object.create(null);
  var ALIAS = Object.create(null);

  // Punctuation is stripped entirely rather than normalised, because the same
  // compound is written many ways depending on where the name was copied from.
  // Excipient labels are the worst case: "FD&C Blue # 1", "FD&C Blue No. 1"
  // and "fdc-blue-1" are one ingredient, and a label transcribed by hand will
  // use whichever the packet did. Dropping # . & / + ' as well as whitespace
  // and dashes makes all of those collapse to the same key.
  var norm = function (s) {
    return String(s).toLowerCase().replace(/[\s\-_,()#.&/+'’]/g, '');
  };

  /**
   * Some pathway rows describe TRANSPORT rather than metabolism — P-glycoprotein
   * efflux, renal OCT/MATE secretion, hepatic OCT1 uptake. They belong in the
   * pathway diagram because they often decide how much drug reaches the brain,
   * but they are not enzymes and must stay out of substrateOf and the enzyme
   * index, or they pollute every enzyme-based interaction lookup.
   */
  var TRANSPORT_RE = /\b(p-?gp|p-glycoprotein|oct\d?|mate\d?|oat\d?|oatp\w*|bcrp|lat\d|abcb1|transport)\b/i;
  function isTransportStep(enzyme) {
    return TRANSPORT_RE.test(String(enzyme || ''));
  }

  /**
   * Do two written names refer to the same compound?
   *
   * Product names carry parenthesised aliases — "N-desmethylclobazam
   * (norclobazam)", "Morphine-6-glucuronide (M6G)" — and a `from:` on a later
   * step is usually written with whichever half the author had in mind. A
   * plain string comparison then fails and the step draws detached from the
   * chain it belongs to, which is exactly what happened to clobazam. Compare
   * the whole string, the part before the bracket, and the part inside it.
   */
  function nameVariants(s) {
    s = String(s == null ? '' : s);
    var out = [norm(s)];
    var outer = s.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    if (outer) out.push(norm(outer));
    var inner = (s.match(/\(([^)]+)\)/) || [])[1];
    if (inner) out.push(norm(inner));
    return out.filter(Boolean);
  }

  function refersTo(a, b) {
    var A = nameVariants(a), B = nameVariants(b);
    for (var i = 0; i < A.length; i++) if (B.indexOf(A[i]) >= 0) return true;
    return false;
  }

  var uniq = function (a) {
    var seen = {}, out = [];
    (a || []).forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  };

  /**
   * Give every pathway a `products` array, whichever form it was written in.
   * See the comment in register() for why multi-outcome pathways exist.
   */
  function normalisePathway(p) {
    if (!p.products) {
      p.products = p.product != null
        ? [{ name: p.product, fraction: p.fraction, reaction: p.reaction }]
        : [];
    }
    if (p.product == null && p.products.length) {
      p.product = p.products.map(function (x) { return x.name; }).join(" / ");
    }
    if (p.fraction == null && p.products.length) {
      var sum = 0, any = false;
      p.products.forEach(function (x) { if (x.fraction != null) { sum += x.fraction; any = true; } });
      if (any) p.fraction = sum;
    }
    return p;
  }

  /**
   * Work out which steps act on an INTERMEDIATE rather than on the parent.
   *
   * A metabolism block is a flat list of rows, and a chain written into one
   * reads as several parallel routes off the dose. That is not a display
   * problem, it is a double count: heroin lists 6-MAM at 95% of the dose and
   * morphine at 90%, because morphine comes FROM the 6-MAM. Follow the chain
   * — which the model now does — and morphine forms once through 6-MAM and
   * again straight off the parent, and 100 mg of heroin reports 175 mg of
   * morphine. A dose cannot produce more of something than it weighs.
   *
   * The fix already exists: `from:` names the substrate a step acts on,
   * and rows that declare it are attached to the right precursor. What was
   * missing is that most rows never declared it — while saying it in prose,
   * in the reaction text, which is where the author actually wrote it down:
   *
   *     "Deacetylation of 6-MAM"            -> Morphine
   *     "Hydroxylation of nordazepam"       -> Oxazepam
   *     "Downstream glucuronidation of morphine" -> M3G / M6G
   *
   * So a row whose reaction names another compound from the same block is
   * attached to it. The rows that are genuinely direct name nothing —
   * methylphenidate's "De-esterification", cocaine's "Hydrolysis of the
   * benzoyl ester" — and are left exactly as they are, which matters: those
   * really are parallel routes off the dose and really do sum.
   *
   * Deliberately conservative. It fires only on a whole-token match against
   * a compound the block itself names, never on a row that already declares
   * `from:`, and never pointing a row at its own product. What it cannot
   * see — "Second deacetylation", "Further demethylation" — is left for the
   * data to state outright, and check-data.js reports whatever is left.
   */
  function inferPrecursors(paths, metabolites) {
    // Every compound this block names, as a candidate precursor.
    var names = [];
    paths.forEach(function (p) {
      (p.products || []).forEach(function (prod) { if (prod.name) names.push(prod.name); });
    });
    (metabolites || []).forEach(function (m) { if (m.name) names.push(m.name); });

    paths.forEach(function (p) {
      if (p.from) return;                       // declared outright; leave it
      var text = String(p.reaction || '');
      if (!text) return;

      /* Whole tokens only. The names are stripped of punctuation to compare,
         and a stripped substring match would let "THC" claim any row whose
         reaction happened to contain the letters. */
      var tokens = Object.create(null);
      text.split(/[^A-Za-z0-9\-’'.]+/).forEach(function (tok) {
        var n = norm(tok);
        if (n) tokens[n] = true;
      });

      var own = (p.products || []).map(function (x) { return x.name; });
      var best = null, bestLen = 0;
      names.forEach(function (cand) {
        // A step never acts on what it produces.
        if (own.some(function (o) { return refersTo(o, cand); })) return;
        nameVariants(cand).forEach(function (v) {
          if (v.length < 4 || !tokens[v]) return;
          // Longest wins, so "nordazepam" is not beaten by a shorter name
          // that also happens to appear in the same sentence.
          if (v.length > bestLen) { bestLen = v.length; best = cand; }
        });
      });
      if (best) { p.from = best; p.fromInferred = true; }
    });
    return paths;
  }

  /**
   * Fold repeated rows for the same enzyme into one forked pathway.
   *
   * One enzyme acting on one substrate to give several products is ONE step
   * with several outcomes, not several steps. Written as separate rows it drew
   * as several identical enzyme boxes stacked down the diagram — the reader
   * had to notice that "CYP3A4" appeared four times under LSD and infer that
   * it was the same CYP3A4 each time. Morphine was already written the merged
   * way by hand; this makes every compound behave like it.
   *
   * What must NOT merge is a SEQUENTIAL step: CYP3A4 turning oxycodone into
   * noroxycodone and CYP3A4 turning oxymorphone into noroxymorphone are the
   * same enzyme but different substrates, and drawing them as one fork off the
   * parent would assert that oxycodone yields noroxymorphone directly. Those
   * rows declare `from: '<intermediate>'`, and rows are only merged when the
   * enzyme AND the substrate agree.
   *
   * Products naming the same compound collapse to one, keeping the larger
   * share — data files accumulated several genuine duplicates of that kind.
   */
  function mergeForks(pathways) {
    var order = [], byKey = Object.create(null);

    pathways.forEach(function (p) {
      var key = String(p.enzyme || '') + '\u0000' + (p.from ? norm(p.from) : '');
      var head = byKey[key];
      if (!head) {
        byKey[key] = p;
        order.push(p);
        return;
      }
      // Same enzyme, same substrate: fold this row's outcomes into the first.
      head.products = head.products.concat(p.products);
      if (p.reaction && String(head.reaction || '').indexOf(p.reaction) < 0) {
        head.reaction = head.reaction ? head.reaction + '; ' + p.reaction : p.reaction;
      }
      if (p.note && String(head.note || '').indexOf(p.note) < 0) {
        head.note = head.note ? head.note + ' ' + p.note : p.note;
      }
    });

    order.forEach(function (p) {
      var seen = Object.create(null), kept = [];
      p.products.forEach(function (prod) {
        var k = norm(prod.name);
        if (!seen[k]) { seen[k] = prod; kept.push(prod); return; }
        // Same product reached twice: one row, and the larger recorded share.
        var ex = seen[k];
        if (prod.fraction != null && (ex.fraction == null || prod.fraction > ex.fraction)) {
          ex.fraction = prod.fraction;
        }
        if (prod.active != null && ex.active == null) ex.active = prod.active;
        // Whichever mention of the product carries the detail wins — a later
        // file naming the individual conjugates behind a collapsed row should
        // not lose them to the earlier bare mention of the same row.
        if (prod.covers && !ex.covers) ex.covers = prod.covers;
        if (prod.note && !ex.note) ex.note = prod.note;
      });
      p.products = kept;
      // The derived scalars have to be rebuilt from the merged product list.
      p.product = kept.map(function (x) { return x.name; }).join(' / ');
      var sum = 0, any = false;
      kept.forEach(function (x) { if (x.fraction != null) { sum += x.fraction; any = true; } });
      p.fraction = any ? sum : null;
    });

    return order;
  }

  function register(list) {
    list.forEach(function (d) {
      if (BY_ID[d.id]) {
        console.warn('duplicate drug id:', d.id);
        return;
      }
      // ---- defaults so the model never trips on a sparse entry ------------
      d.aliases = d.aliases || [];
      d.tags = d.tags || [];
      d.warnings = d.warnings || [];
      d.routes = d.routes || { oral: {} };
      d.halfLife = d.halfLife || { hours: 4, confidence: 'unknown' };
      if (d.halfLife.hours == null) d.halfLife.hours = 4;
      if (!d.halfLife.confidence) d.halfLife.confidence = 'unknown';

      // ---- isomers ---------------------------------------------------------
      // { type, note, forms: [{ name, drugId?, share?, activity, note }] }
      // `type` is one of: enantiomers | positional | double-bond | epimers | diastereomers
      if (d.isomers) {
        d.isomers.forms = d.isomers.forms || [];
        d.isomers.type = d.isomers.type || 'isomers';
      }

      // Inactive ingredients (excipients, fillers) are excluded from
      // active-mass calculations but still occupy mass and volume.
      d.inactive = !!d.inactive;

      // ---- chemical identity ----------------------------------------------
      // `cas` and `formula` are for cross-referencing against PubChem, ChemSpider
      // or a supplier's certificate of analysis. Both default to null rather than
      // to a guess: a wrong CAS number silently points at a different chemical,
      // which is worse than no CAS at all. Absent means "not recorded here",
      // never "does not exist".

      if (d.cas == null) d.cas = null;
      if (d.formula == null) d.formula = null;
      if (d.smiles == null) d.smiles = null;

      // Apparent volume of distribution (L/kg) and reported concentration
      // bands. Absent means "not recorded here", never "does not exist" —
      // and the concentration readout says which it is looking at.
      if (d.vd == null) { d.vd = null; d.vdRange = null; d.vdConfidence = null; d.vdNote = null; }
      if (d.ranges == null) { d.ranges = null; d.rangesNote = null; }

      // ---- metabolism block ----------------------------------------------
      var m = d.metabolism = d.metabolism || {};
      m.pathways = m.pathways || [];      // [{enzyme, reaction, product, fraction, note}]
      m.metabolites = m.metabolites || []; // [{name, active, halfLifeH, potencyRel, note}]
      m.inhibits = m.inhibits || [];      // enzymes this drug inhibits
      m.induces = m.induces || [];        // enzymes this drug induces
      m.excretion = m.excretion || null;
      m.firstPass = m.firstPass || null;
      m.transporters = m.transporters || [];   // P-gp, BCRP, OATP, LAT1…
      m.pharmacogenetics = m.pharmacogenetics || null;
      m.confidence = m.confidence || (m.pathways.length ? 'estimated' : 'unknown');

      // ---- pathway outcomes ------------------------------------------------
      // One enzyme frequently produces several different products, and they do
      // not have to share a fate: UGT2B7 acting on morphine yields M3G, which
      // is inactive, and M6G, which is twice as potent as morphine itself.
      // Writing that as two UGT2B7 rows implies two separate pathways and
      // reads as a duplicate, so a pathway may instead declare `products`:
      //
      //   { enzyme: 'UGT2B7', reaction: 'Glucuronidation', products: [
      //       { name: 'Morphine-3-glucuronide (M3G)', fraction: 0.55, active: false },
      //       { name: 'Morphine-6-glucuronide (M6G)', fraction: 0.10, active: true }
      //   ]}
      //
      // Single-product rows keep working untouched; they are normalised into
      // the same shape here so every consumer only has to handle one form.
      m.pathways.forEach(normalisePathway);
      // Before mergeForks, which keys on the substrate: a sequential step
      // has to know it is one before it can avoid being folded into the
      // parent's fork.
      inferPrecursors(m.pathways, m.metabolites);
      m.pathways = mergeForks(m.pathways);

      // Pathway rows often name several enzymes at once ("CYP2D6 / CYP3A4").
      // Split them so each appears once as its own chip and is findable in the
      // enzyme index, instead of showing as a combined string alongside its parts.
      m.substrateOf = m.substrateOf || uniq(m.pathways.reduce(function (acc, p) {
        return acc.concat(String(p.enzyme || '').split('/').map(function (e) { return e.trim(); }));
      }, []).filter(Boolean));
      // Applied whether substrateOf was declared or derived: anything that is
      // really a transporter moves to the transporters field rather than
      // masquerading as a metabolic enzyme. Must run after the defaults above,
      // since it appends to m.transporters.
      var moved = m.substrateOf.filter(isTransportStep);
      if (moved.length) {
        m.substrateOf = m.substrateOf.filter(function (e) { return !isTransportStep(e); });
        m.transporters = uniq(m.transporters.concat(moved));
      }

      /* Bioavailability first, on its own pass: the first-pass model below
         derives one compound-wide number from the oral route, and it cannot
         read a figure the loop has not filled in yet. */
      Object.keys(d.routes).forEach(function (k) {
        var r = d.routes[k];
        if (r.bioavailability == null) r.bioavailability = DEFAULT_F[k] != null ? DEFAULT_F[k] : 0.7;
      });
      var hepaticE = hepaticExtraction(d);

      Object.keys(d.routes).forEach(function (k) {
        var r = d.routes[k];
        if (!r.onsetMin) r.onsetMin = DEFAULT_ONSET[k] || [20, 45];
        if (!r.peakMin) r.peakMin = [r.onsetMin[1] * 1.5, r.onsetMin[1] * 3];
        if (!r.durationH) r.durationH = [2, 5];
        if (!r.afterEffectsH) r.afterEffectsH = [0, 0];

        /* ---- route-specific metabolism ---------------------------------
           A route can change what a compound becomes, not just how much of
           it arrives. Swallowed heroin is the clearest case: presystemic
           deacetylation is essentially complete, so neither diacetylmorphine
           nor 6-MAM reach the circulation and what you actually have is
           morphine — a different set of products from the same molecule.
           Modelling that with one compound-level list drew two curves for
           compounds that were destroyed before they got anywhere.

           A route may therefore declare its own `metabolism: { pathways,
           metabolites }`, which REPLACES the compound-level block for doses
           by that route. Routes that declare nothing keep using the
           compound's, so nothing else in the database had to change. */
        if (r.metabolism) {
          var rm = r.metabolism;
          rm.pathways = rm.pathways || [];
          rm.metabolites = rm.metabolites || [];
          rm.pathways.forEach(normalisePathway);
          inferPrecursors(rm.pathways, rm.metabolites);
          rm.pathways = mergeForks(rm.pathways);

          // The enzymes this route's steps run through, derived the same way
          // the compound-level block derives its own.
          rm.substrateOf = rm.substrateOf || uniq(rm.pathways.reduce(function (acc, p) {
            return acc.concat(String(p.enzyme || '').split('/').map(function (e) { return e.trim(); }));
          }, []).filter(Boolean));
          var rMoved = rm.substrateOf.filter(isTransportStep);
          rm.transporters = uniq((rm.transporters || []).concat(rMoved));
          rm.substrateOf = rm.substrateOf.filter(function (e) { return !isTransportStep(e); });

          /* Inhibition, induction, pharmacogenetics and excretion are
             properties of the molecule rather than of how it was taken, so a
             route inherits them rather than restating them. Only what the
             compound BECOMES changes with the route. */
          if (rm.inhibits == null) rm.inhibits = m.inhibits;
          if (rm.induces == null) rm.induces = m.induces;
          if (rm.pharmacogenetics == null) rm.pharmacogenetics = m.pharmacogenetics;
          if (rm.excretion == null) rm.excretion = m.excretion;
          if (rm.firstPass == null) rm.firstPass = m.firstPass;
          if (rm.confidence == null) rm.confidence = m.confidence;
        } else {
          r.metabolism = null;
        }

        /* ---- route-specific first-pass avoidance -----------------------
           Where a route delivers the dose decides whether the liver gets a
           shot at it before the rest of the body does. Injected, smoked,
           vaporised and insufflated drug enters the systemic circulation
           directly and skips the first pass entirely. Rectal drug drains
           partly to the systemic circulation via the middle and inferior
           rectal veins and partly to the portal vein via the superior one,
           so roughly 50-70% of it avoids the liver. Sublingual and buccal
           drug drains to the jugular, but some is always swallowed, so
           60-80% avoids it. Swallowed drug avoids none of it.

           This is not cosmetic. It is why oral midazolam needs twice the
           milligrams of a nasal spray, why swallowed heroin has no rush,
           and — the part the model had wrong — where a dose's metabolites
           come from. Two thirds of an oral midazolam dose is not lost; it
           is turned into 1'-hydroxymidazolam on the way in, and that
           metabolite appears with absorption rather than trailing the
           parent's elimination. */
        if (r.firstPassBypass == null) {
          r.firstPassBypass = DEFAULT_BYPASS[k] != null ? DEFAULT_BYPASS[k] : 0;
        }

        /* How much of the dose crosses the membrane at all, as against how
           much survives the trip to the circulation. Back-calculated from
           the declared bioavailability and how much of this route dodges
           the liver: a route that dodges it completely lost nothing to it,
           so whatever did not arrive was never absorbed in the first place. */
        if (r.absorbedFraction == null) {
          var survives = r.firstPassBypass + (1 - r.firstPassBypass) * (1 - hepaticE);
          r.absorbedFraction = survives > 0
            ? Math.min(1, r.bioavailability / survives)
            : r.bioavailability;
        }

        /* How much of the dose is absorbed and metabolised, as against how
           much survives to the circulation as the parent. They diverge when
           a route destroys the parent on the way in: oral heroin puts almost
           no heroin into the blood (`bioavailability`) while still
           delivering most of the dose onward as morphine
           (`metabolisedFraction`). Without the split, dropping the parent
           to its true near-zero level would have taken its metabolites down
           with it.

           An entry may still declare the number outright — heroin does —
           and a declared figure always wins over the derivation. */
        if (r.metabolisedFraction == null) {
          r.metabolisedFraction = Math.min(1,
            r.bioavailability + Math.max(0, r.absorbedFraction - r.bioavailability));
        }

        /* The share extracted BEFORE reaching the circulation. This is the
           part that forms metabolites at the ABSORPTION rate rather than at
           the parent's elimination rate, and pk.js integrates the two
           separately because they arrive at completely different times. */
        r.presystemicFraction = Math.max(0, r.metabolisedFraction - r.bioavailability);
      });

      DRUGS.push(d);
      BY_ID[d.id] = d;
      ALIAS[norm(d.name)] = d.id;
      ALIAS[norm(d.id)] = d.id;
      d.aliases.forEach(function (a) { if (!ALIAS[norm(a)]) ALIAS[norm(a)] = d.id; });
    });
  }

  var DEFAULT_F = {
    oral: 0.7, sublingual: 0.75, buccal: 0.6, insufflated: 0.75, intranasal: 0.75,
    rectal: 0.85, vaporised: 0.5, smoked: 0.4, inhaled: 0.5, iv: 1.0,
    im: 0.95, subcutaneous: 0.95, transdermal: 0.9, ocular: 0.6
  };
  /**
   * Fraction of what a route absorbs that reaches the systemic circulation
   * without passing through the liver first.
   *
   * Intravenous, intramuscular and subcutaneous drug is already in the
   * systemic circulation. Smoked, vaporised and inhaled drug crosses the
   * alveoli into the pulmonary vein, which returns to the heart rather than
   * to the portal vein. Nasal mucosa drains to the facial and ophthalmic
   * veins. Transdermal drug enters the dermal capillaries. None of these
   * meet the liver until the drug has already been round the body once.
   *
   * The two partial cases are the interesting ones, and both are ranges
   * rather than constants because they depend on how far up the drug is
   * placed and on how much of it gets swallowed. The midpoints are used.
   */
  var DEFAULT_BYPASS = {
    oral: 0,
    sublingual: 0.7,      // 60-80%
    buccal: 0.7,
    rectal: 0.6,          // 50-70%
    insufflated: 1, intranasal: 1,
    smoked: 1, vaporised: 1, inhaled: 1,
    iv: 1, im: 1, subcutaneous: 1, transdermal: 1, ocular: 1
  };

  /**
   * The share of drug reaching the liver on its first pass that the liver
   * removes before it can circulate.
   *
   * Derived from the compound's own oral route, which is the one route that
   * takes the full hit: whatever an oral dose lost, and that was not simply
   * unabsorbed, the liver and gut wall took. So E = 1 − F_oral / fa_oral,
   * with complete oral absorption assumed unless an entry says otherwise.
   *
   * That assumption is the weak point — a compound whose oral
   * bioavailability is low because it is poorly ABSORBED rather than heavily
   * extracted reads as a high-extraction drug here. The fix is to declare
   * `absorbedFraction` on its oral route, or `hepaticExtraction` on its
   * metabolism block. Compounds with no oral route at all get 0, which
   * leaves every derived figure exactly where it was before this existed.
   */
  function hepaticExtraction(d) {
    var declared = d.metabolism && d.metabolism.hepaticExtraction;
    if (declared != null) return Math.max(0, Math.min(0.99, declared));
    var oral = d.routes && d.routes.oral;
    if (!oral) return 0;
    var fa = oral.absorbedFraction != null ? oral.absorbedFraction : 1;
    if (!(fa > 0)) return 0;
    return Math.max(0, Math.min(0.99, 1 - oral.bioavailability / fa));
  }

  var DEFAULT_ONSET = {
    oral: [30, 60], sublingual: [10, 30], buccal: [10, 30], insufflated: [5, 15],
    intranasal: [5, 15], rectal: [10, 25], vaporised: [0.2, 2], smoked: [0.2, 2],
    inhaled: [0.2, 2], iv: [0.1, 1], im: [3, 10], subcutaneous: [5, 15],
    transdermal: [60, 240], ocular: [15, 40]
  };

  /**
   * Deepen an already-registered compound's metabolism.
   *
   * Kept separate from the per-class data files so the detailed pharmacology
   * lives in one place instead of bloating every class file. Additive by
   * design: pathways and metabolites are appended (skipping ones already
   * present), and scalar fields only overwrite when a replacement is given.
   */
  function enrich(map) {
    Object.keys(map).forEach(function (id) {
      var d = get(id);
      if (!d) { console.warn('enrich: unknown compound', id); return; }
      var e = map[id], m = d.metabolism;

      if (e.firstPass) m.firstPass = e.firstPass;
      if (e.excretion) m.excretion = e.excretion;
      if (e.confidence) m.confidence = e.confidence;
      if (e.pharmacogenetics) m.pharmacogenetics = e.pharmacogenetics;
      if (e.transporters) m.transporters = uniq(m.transporters.concat(e.transporters));
      if (e.inhibits) m.inhibits = uniq(m.inhibits.concat(e.inhibits));
      if (e.induces) m.induces = uniq(m.induces.concat(e.induces));

      (e.pathways || []).forEach(function (p) {
        var dup = m.pathways.some(function (x) {
          return x.enzyme === p.enzyme && x.product === p.product;
        });
        if (!dup) m.pathways.push(normalisePathway(p));
      });
      // Re-fold after the additions, so an enriched row for an enzyme the
      // entry already had joins that enzyme's fork instead of drawing a
      // second box for it. The enriched rows get the same precursor
      // inference the original ones did, and against the fuller list.
      inferPrecursors(m.pathways, m.metabolites);
      m.pathways = mergeForks(m.pathways);

      (e.metabolites || []).forEach(function (mm) {
        var dup = m.metabolites.some(function (x) { return x.name === mm.name; });
        if (dup) {
          // Fill gaps on an existing metabolite rather than duplicating it.
          var ex = m.metabolites.filter(function (x) { return x.name === mm.name; })[0];
          Object.keys(mm).forEach(function (k) { if (ex[k] == null) ex[k] = mm[k]; });
        } else {
          m.metabolites.push(mm);
        }
      });

      var subs = uniq(m.substrateOf.concat(m.pathways.reduce(function (acc, p) {
        return acc.concat(String(p.enzyme || '').split('/').map(function (e) { return e.trim(); }));
      }, []).filter(Boolean)));
      m.substrateOf = subs.filter(function (e) { return !isTransportStep(e); });
      m.transporters = uniq(m.transporters.concat(subs.filter(isTransportStep)));
    });
  }

  /**
   * Attach chemical identifiers (CAS registry number, molecular formula) to
   * already-registered compounds.
   *
   * Kept in its own pass, and its own data file, for the same reason enrich()
   * is: identifiers are reference data rather than pharmacology, and threading
   * them through fourteen class files would bury them. An entry may declare
   * `cas`/`formula` inline instead — this never overwrites a value that is
   * already set, so inline declarations win.
   *
   * Accepts either a bare formula string or an object, so the common case
   * stays terse:
   *     'caffeine': { cas: '58-08-2', formula: 'C8H10N4O2' }
   */
  function identify(map) {
    Object.keys(map).forEach(function (id) {
      var d = get(id);
      if (!d) { console.warn('identify: unknown compound', id); return; }
      var v = map[id];
      if (typeof v === 'string') v = { formula: v };
      if (d.cas == null && v.cas != null) d.cas = v.cas;
      if (d.formula == null && v.formula != null) d.formula = v.formula;
    });
  }

  /**
   * Attach per-solvent solubility (mg/ml) to already-registered compounds.
   *
   * Kept separate for the same reason as identify(): it is reference data
   * consumed by one feature (the solution calculator's saturation check),
   * not pharmacology, and an absent entry must mean "no check" rather than
   * "dissolves fine".
   */
  function solubility(map) {
    Object.keys(map).forEach(function (id) {
      var d = get(id);
      if (!d) { console.warn('solubility: unknown compound', id); return; }
      d.solubility = d.solubility || map[id];
    });
  }

  /**
   * Apparent volume of distribution, and the concentrations a compound is
   * reported at.
   *
   * WHY Vd IS NOT OPTIONAL FOR A CONCENTRATION. A milligram figure divided
   * by plasma volume assumes the drug is dissolved in plasma and nowhere
   * else. Almost nothing is. Vd is the volume the body behaves as if the
   * drug were dissolved in — 0.6 L/kg for ethanol, which really does sit in
   * body water, and 10 L/kg for THC, which is mostly in fat — so it is the
   * factor between "how much is in me" and "what a blood test would read".
   * Without it the app was reporting methamphetamine in micrograms per
   * millilitre where a laboratory reports tens of nanograms.
   *
   *     Vd(L) = vd(L/kg) x body mass;   concentration = amount / Vd(L)
   *
   * `ranges` are population concentrations, in ng/mL:
   *
   *     therapeutic  the band a clinical dose produces, or for compounds
   *                  nobody prescribes, what a recreational dose produces
   *     toxic        where toxicity is commonly reported
   *     fatal        the band seen in fatalities — NOT a threshold, and
   *                  deliberately not called one
   *
   * These are population figures and they overlap heavily. For opioids and
   * benzodiazepines the bands are close to meaningless without tolerance:
   * concentrations that kill a naive person are routine in someone
   * dependent, and the reverse holds too. The UI has to say so wherever it
   * shows them; `note` carries the compound-specific version of that.
   */
  function kinetics(map) {
    Object.keys(map).forEach(function (id) {
      var d = get(id);
      if (!d) { console.warn('kinetics: unknown compound', id); return; }
      var k = map[id];
      if (k.vd != null && d.vd == null) {
        d.vd = k.vd;
        d.vdRange = k.vdRange || null;
        d.vdConfidence = k.vdConfidence || 'measured';
        d.vdNote = k.vdNote || null;
      }
      if (k.ranges && !d.ranges) {
        d.ranges = k.ranges;
        d.rangesNote = k.rangesNote || null;
      }
    });
  }

  /**
   * Which metabolite (if any) a pathway's free-text `product` refers to.
   *
   * Products are prose and frequently name more than one thing at once —
   * "M3G / M6G", "3- and 7-methylxanthine". Naive substring matching misses
   * those entirely, and the visible symptom was morphine-6-glucuronide being
   * drawn as an INACTIVE product of heroin when it is the most potent thing
   * in the cascade.
   *
   * So: split the product on separators, then score each part. Scoring rather
   * than first-hit matters because a short name must not win against a long
   * one it happens to sit inside — "Morphine" would otherwise claim the
   * "Morphine-6-glucuronide" row.
   */
  // Conjugation suffixes. A product carrying one is a DIFFERENT compound from
  // the same name without it — "oxazepam glucuronide" is not oxazepam — and
  // conflating them made the diagram colour inactive conjugates green, because
  // they inherited the activity of the parent they fell back to.
  var CONJUGATE_RE = /glucuronide|sulfate|sulphate|conjugat|glycinate/i;

  function matchMetabolite(productText, metabolites) {
    if (!productText || !metabolites || !metabolites.length) return null;

    var productIsConjugate = CONJUGATE_RE.test(String(productText));
    var best = null, bestScore = 0;
    String(productText).split(/\s*(?:\/|,|\+|→|->|;)\s*/).forEach(function (part) {
      if (!part) return;
      var pNorm = norm(part);
      if (!pNorm) return;
      // A parenthesised abbreviation is its own candidate: the product may be
      // written "Morphine-6-glucuronide (M6G)" and the metabolite just "M6G",
      // or the other way round.
      var pAbbrev = (String(part).match(/\(([^)]+)\)/) || [])[1];
      // The name with any trailing parenthetical removed. A product written
      // "Norephedrine" and a metabolite written "Norephedrine
      // (phenylpropanolamine)" are the same compound, and the length-ratio
      // guard below — which exists to stop "Morphine" claiming
      // "Morphine-6-glucuronide" — was rejecting the pair at 0.39.
      var pBare = norm(String(part).replace(/\s*\([^)]*\)\s*$/, ''));

      metabolites.forEach(function (m) {
        var mNorm = norm(m.name);
        if (!mNorm) return;
        // A conjugate never falls back to its unconjugated parent. Without
        // this, "Psilocin-O-glucuronide" resolved to psilocin and was drawn
        // as an active product.
        if (productIsConjugate && !CONJUGATE_RE.test(m.name)) return;
        var mAbbrev = (String(m.name).match(/\(([^)]+)\)/) || [])[1];
        var score = 0;

        var mBare = norm(String(m.name).replace(/\s*\([^)]*\)\s*$/, ''));

        if (pNorm === mNorm) score = 100;
        else if (pBare && mBare && pBare === mBare) score = 97;
        else if (pAbbrev && norm(pAbbrev) === mNorm) score = 95;
        else if (mAbbrev && norm(mAbbrev) === pNorm) score = 95;
        else if (mNorm.length >= 5 && pNorm.indexOf(mNorm) >= 0) {
          // Both "Morphine" and "Morphine-6-glucuronide" sit inside the product
          // "Morphine-6-glucuronide (M6G)". Weight by how much of the product
          // the name actually accounts for, so the specific one wins over the
          // fragment — otherwise M6G is reported as plain morphine.
          score = 80 + 15 * (mNorm.length / pNorm.length);
        } else if (pNorm.length >= 5 && mNorm.indexOf(pNorm) >= 0 &&
                 pNorm.length / mNorm.length > 0.6) score = 60;

        if (score > bestScore) { bestScore = score; best = m; }
      });
    });
    return bestScore >= 60 ? best : null;
  }

  /**
   * Attach prose descriptions — what a compound is, what it physically looks
   * like, what people who take it report, and what reduces the harm.
   *
   * Kept in its own file and its own pass for the same reason identify() is:
   * it is written material rather than modelled pharmacology, nothing else in
   * the app computes on it, and threading paragraphs through the class files
   * would bury the data those files exist for.
   *
   *   { what, looks, reports, harm }
   *
   * `reports` summarises recurring themes from harm-reduction communities
   * (PsychonautWiki, TripSit, the drug subreddits). Those are self-reports
   * from people who took the substance, not measurements, and the UI labels
   * them as such wherever they appear. An absent field is simply omitted —
   * the popup says what is missing rather than padding it.
   */
  function describe(map) {
    Object.keys(map).forEach(function (id) {
      var d = get(id);
      if (!d) { console.warn('describe: unknown compound', id); return; }
      d.info = d.info || map[id];
    });
  }

  /**
   * Attach provenance prose — where a compound physically comes from, and
   * what its route of manufacture leaves behind in it.
   *
   * A separate pass from describe() for the same reason describe() is
   * separate from the class files: it is written material rather than
   * modelled pharmacology, and nothing in the app computes on it.
   *
   *   { origin, route, precursors, impurities, supply }
   *
   * js/data/synthesis.js states the two rules the content obeys — nothing
   * invented, and chemistry named rather than performed. A compound with no
   * entry is simply absent, and the panel says so instead of guessing at a
   * route it cannot source.
   */
  function synthesis(map) {
    Object.keys(map).forEach(function (id) {
      var d = get(id);
      if (!d) { console.warn('synthesis: unknown compound', id); return; }
      d.synthesis = d.synthesis || map[id];
    });
  }

  /**
   * Attach SMILES strings, which the structure renderer draws from.
   * Never overwrites a value declared inline on the entry.
   */
  function smiles(map) {
    Object.keys(map).forEach(function (id) {
      var d = get(id);
      if (!d) { console.warn("smiles: unknown compound", id); return; }
      if (d.smiles == null) d.smiles = map[id];
    });
  }

  /** How much of the database carries chemical identifiers. */
  function identifierReport() {
    var withCas = 0, withFormula = 0;
    DRUGS.forEach(function (d) {
      if (d.cas) withCas++;
      if (d.formula) withFormula++;
    });
    return { total: DRUGS.length, cas: withCas, formula: withFormula };
  }

  /* ---------- lookup ------------------------------------------------------ */

  function get(id) { return BY_ID[id] || BY_ID[ALIAS[norm(id || '')]] || null; }

  function all() { return DRUGS.slice(); }

  /**
   * Search names, aliases, class, family and tags.
   *
   * Category searches have to work the way people actually type them:
   * "opioids", "benzos" and "stimulants" should all find things, so queries
   * and targets are compared in both directions and with a crude singular
   * form. Name matches always outrank category matches.
   */
  var SEARCH_SYNONYMS = {
    benzo: 'benzodiazepine', benzos: 'benzodiazepine', benzodiazepines: 'benzodiazepine',
    opiate: 'opioid', opiates: 'opioid',
    psychedelics: 'psychedelic', hallucinogen: 'psychedelic', hallucinogens: 'psychedelic',
    dissociatives: 'dissociative', stimulants: 'stimulant', depressants: 'depressant',
    cannabinoids: 'cannabinoid', entactogens: 'entactogen', empathogen: 'entactogen',
    nootropics: 'nootropic', barbiturates: 'barbiturate', cathinones: 'cathinone',
    amphetamines: 'amphetamine', antidepressants: 'antidepressant',
    antipsychotics: 'antipsychotic', deliriants: 'deliriant', inhalants: 'inhalant',
    rc: 'research-chemical', rcs: 'research-chemical'
  };

  // Forward containment only — the target must contain the query. Matching in
  // reverse would make "antidepressant" match the Depressant class, since the
  // query contains the class name. Plurals and abbreviations are handled by
  // expanding the query terms instead, which is precise rather than greedy.
  function loose(hay, needle) {
    if (!hay || !needle) return false;
    return hay.indexOf(needle) >= 0;
  }

  function search(q, limit) {
    var raw = norm(q || '');
    if (!raw) return DRUGS.slice(0, limit || 25);

    // A recognised category abbreviation is searched ONLY as its expansion.
    // Keeping the literal text as well would let "benzo" match the alias
    // "benzofury" as a name hit, which outranks category matches and buries
    // the benzodiazepines the user actually asked for.
    var terms;
    if (SEARCH_SYNONYMS[raw]) {
      terms = [norm(SEARCH_SYNONYMS[raw])];
    } else {
      terms = [raw];
      if (raw.length > 3 && raw.slice(-1) === 's') terms.push(raw.slice(0, -1));
    }

    var scored = [];
    DRUGS.forEach(function (d) {
      var best = Infinity;

      // --- name, id and aliases: the strongest matches ---
      var cands = [d.name, d.id].concat(d.aliases);
      cands.forEach(function (c) {
        var n = norm(c);
        terms.forEach(function (t, ti) {
          var i = n.indexOf(t);
          if (i === 0) best = Math.min(best, 0 + ti * 0.1);
          else if (i > 0) best = Math.min(best, 1 + i / 100 + ti * 0.1);
        });
      });

      // --- category matches, ranked below any name match ---
      var cls = norm(d.class || '');
      var fam = norm(d.family || '');
      terms.forEach(function (t, ti) {
        var penalty = ti * 0.5;      // later (less specific) terms rank lower
        if (loose(cls, t)) best = Math.min(best, 4 + penalty);
        if (loose(fam, t)) best = Math.min(best, 5 + penalty);
        (d.tags || []).forEach(function (tag) {
          if (loose(norm(tag), t)) best = Math.min(best, 6 + penalty);
        });
      });

      if (best < Infinity) scored.push({ d: d, s: best });
    });

    scored.sort(function (a, b) { return a.s - b.s || a.d.name.localeCompare(b.d.name); });
    return scored.slice(0, limit || 25).map(function (x) { return x.d; });
  }

  function classes() {
    var seen = {};
    DRUGS.forEach(function (d) { seen[d.class || 'Other'] = 1; });
    return Object.keys(seen).sort();
  }

  function hasTag(drug, tag) { return drug && drug.tags.indexOf(tag) >= 0; }

  /* ---------- data-quality reporting -------------------------------------- */

  function confidenceOf(drug) {
    var c = (drug.halfLife && drug.halfLife.confidence) || 'unknown';
    return c;
  }

  /* ---------- enzyme index ------------------------------------------------ */

  // Which drugs are substrates of / inhibit / induce a given enzyme.
  function byEnzyme(enzyme) {
    var out = { substrates: [], inhibitors: [], inducers: [] };
    DRUGS.forEach(function (d) {
      var m = d.metabolism;
      if (m.substrateOf.indexOf(enzyme) >= 0) out.substrates.push(d);
      if (m.inhibits.indexOf(enzyme) >= 0) out.inhibitors.push(d);
      if (m.induces.indexOf(enzyme) >= 0) out.inducers.push(d);
    });
    return out;
  }

  function allEnzymes() {
    var seen = {};
    DRUGS.forEach(function (d) {
      d.metabolism.substrateOf.concat(d.metabolism.inhibits, d.metabolism.induces)
        .forEach(function (e) { seen[e] = (seen[e] || 0) + 1; });
    });
    return Object.keys(seen).sort(function (a, b) { return seen[b] - seen[a]; });
  }

  // Active metabolites that outlast the parent drug — these drive the tail of
  // the elimination curve and are a common source of "why am I still feeling it".
  function activeMetabolites(drug) {
    return drug.metabolism.metabolites.filter(function (x) { return x.active; });
  }

  function qualityReport() {
    var buckets = { measured: 0, estimated: 0, analogue: 0, community: 0, anecdotal: 0, unknown: 0 };
    DRUGS.forEach(function (d) { buckets[confidenceOf(d)] = (buckets[confidenceOf(d)] || 0) + 1; });
    return { total: DRUGS.length, buckets: buckets };
  }

  global.DB = {
    register: register,
    enrich: enrich,
    identify: identify,
    describe: describe,
    synthesis: synthesis,
    solubility: solubility,
    kinetics: kinetics,
    smiles: smiles,
    matchMetabolite: matchMetabolite,
    identifierReport: identifierReport,
    get: get,
    all: all,
    search: search,
    classes: classes,
    hasTag: hasTag,
    confidenceOf: confidenceOf,
    qualityReport: qualityReport,
    byEnzyme: byEnzyme,
    allEnzymes: allEnzymes,
    activeMetabolites: activeMetabolites,
    isTransportStep: isTransportStep,
    refersTo: refersTo,
    norm: norm,
    uniq: uniq
  };
})(window);

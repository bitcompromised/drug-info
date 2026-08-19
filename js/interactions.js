/* ==========================================================================
   interactions.js — Drug interaction engine
   --------------------------------------------------------------------------
   Three layers, evaluated together:

     1. EXPLICIT PAIRS   — named combinations with documented outcomes.
     2. TAG RULES        — pharmacodynamic classes (MAOI + releaser, opioid +
                           depressant, serotonergic + serotonergic, ...).
     3. ENZYME RULES     — pharmacokinetic: one drug inhibits or induces an
                           enzyme the other depends on. These produce an actual
                           half-life multiplier fed back into the PK model, so
                           the curves change shape when they apply.

   Absence of a warning is NOT evidence of safety. Most combinations have never
   been studied in humans, and the research chemical entries especially.
   ========================================================================== */
(function (global) {
  'use strict';

  var LEVELS = {
    dangerous:  { rank: 5, label: 'Dangerous',       color: '#e5484d', desc: 'Risk of death or serious injury. Do not combine.' },
    unsafe:     { rank: 4, label: 'Unsafe',          color: '#f76808', desc: 'Significant risk of harm. Strongly discouraged.' },
    caution:    { rank: 3, label: 'Caution',         color: '#ffb224', desc: 'Increased risk; requires reduced doses and care.' },
    decrease:   { rank: 2, label: 'Reduces effect',  color: '#8e8c99', desc: 'One drug blunts the other. Low physical risk, but redosing to compensate is where harm creeps in.' },
    neutral:    { rank: 1, label: 'Low risk',        color: '#5a5a68', desc: 'No significant interaction reported.' },
    synergy:    { rank: 2, label: 'Potentiates',     color: '#3e9dd8', desc: 'Effects amplify. Lower doses of both are needed.' }
  };

  /* ======================================================================
     1. EXPLICIT PAIRS
     ====================================================================== */

  var PAIRS = [
    { a: 'cocaine', b: 'alcohol', level: 'dangerous',
      mechanism: 'Hepatic carboxylesterase transesterifies cocaine with ethanol to form COCAETHYLENE.',
      detail: 'Cocaethylene is equipotent at the dopamine transporter, has roughly 3-5x the half-life of cocaine and is substantially more cardiotoxic. The combination is associated with a large increase in the risk of sudden cardiac death compared with either drug alone.' },

    { a: 'mdma', b: 'moclobemide', level: 'dangerous',
      mechanism: 'MAO-A inhibition prevents breakdown of released serotonin.',
      detail: 'This specific pairing has caused multiple documented deaths, notably a cluster in New Zealand. "Reversible" MAOI status does not make it safe — the serotonergic interaction is unaffected by reversibility.' },

    { a: 'sildenafil', b: 'amyl-nitrite', level: 'dangerous',
      mechanism: 'Both act on the nitric oxide / cGMP pathway from opposite ends.',
      detail: 'PDE5 inhibition prevents cGMP breakdown while nitrites flood the system with nitric oxide. The result is profound, prolonged hypotension that does not respond to normal measures. An absolute contraindication that has killed people.' },

    { a: 'lithium', b: 'lsd', level: 'dangerous',
      mechanism: 'Poorly understood; likely serotonergic and glutamatergic synergy lowering the seizure threshold.',
      detail: 'A substantial body of case reports describes seizures, unusually intense and frightening experiences, and prolonged psychosis. This applies to lithium with any classical psychedelic.' },
    { a: 'lithium', b: 'psilocybin', level: 'dangerous',
      mechanism: 'As with lithium and LSD — seizure risk.',
      detail: 'Case reports of seizures and greatly amplified, distressing experiences. Considered one of the best-attested dangerous psychedelic interactions.' },

    { a: 'dxm', b: 'fluoxetine', level: 'dangerous',
      mechanism: 'Double hit: fluoxetine inhibits CYP2D6 (raising DXM levels many-fold) AND both drugs raise serotonin.',
      detail: 'DXM is itself a serotonin reuptake inhibitor. Blocking its metabolism turns a normal dose into a prolonged overdose while simultaneously stacking serotonergic load. Serotonin syndrome and deaths are documented.' },

    { a: 'ghb', b: 'alcohol', level: 'dangerous',
      mechanism: 'Additive GABAergic CNS and respiratory depression, on top of GHB\'s already steep dose-response curve.',
      detail: 'The margin between a recreational GHB dose and unconsciousness is already narrow. Alcohol collapses it. The great majority of GHB deaths involve alcohol.' },

    { a: 'methylphenidate', b: 'alcohol', level: 'caution',
      mechanism: 'Carboxylesterase CES1 transesterifies methylphenidate with ethanol to form ETHYLPHENIDATE.',
      detail: 'A genuine metabolic interaction: it creates a new, more DAT-selective and reportedly more euphoric drug, and raises d-methylphenidate exposure by around 40%. This raises both cardiovascular strain and abuse potential.' },

    { a: 'ketamine', b: 'alcohol', level: 'unsafe',
      mechanism: 'Additive CNS depression plus loss of airway protective reflexes.',
      detail: 'Ketamine suppresses the gag reflex and frequently causes vomiting. With alcohol, aspiration of vomit is the mechanism behind most ketamine deaths.' },

    { a: 'tramadol', b: 'sertraline', level: 'dangerous',
      mechanism: 'Tramadol is itself an SNRI; sertraline adds further serotonin reuptake inhibition. Sertraline also inhibits CYP2D6.',
      detail: 'Serotonin syndrome plus a substantially lowered seizure threshold. Sertraline additionally blocks conversion to the M1 metabolite, so analgesia fails while the risks remain.' },

    { a: 'buprenorphine', b: 'heroin', level: 'caution',
      mechanism: 'Buprenorphine has far higher mu affinity and only partial efficacy — it displaces full agonists from the receptor.',
      detail: 'Taken while a full agonist is still active, buprenorphine causes immediate PRECIPITATED WITHDRAWAL: sudden, severe, and lasting hours. Standard practice is to wait for moderate withdrawal to establish first.' },

    { a: 'mdma', b: 'fluoxetine', level: 'decrease',
      mechanism: 'SSRIs occupy SERT, the transporter MDMA needs in order to release serotonin.',
      detail: 'MDMA effects are strongly blunted or abolished. The danger is behavioural: people redose repeatedly chasing an effect that cannot happen, accumulating cardiovascular and hyperthermic risk without the reward.' },

    { a: 'ibogaine', b: 'methadone', level: 'dangerous',
      mechanism: 'Additive QT prolongation, plus ibogaine inhibits CYP2D6 which contributes to methadone clearance.',
      detail: 'Both drugs prolong the QT interval substantially. Torsades de pointes and cardiac arrest are the leading causes of ibogaine deaths, and methadone is the most common co-involved drug.' },

    { a: 'alcohol', b: 'thc', level: 'caution',
      mechanism: 'Alcohol increases THC absorption and peak plasma levels; effects are more than additive on coordination.',
      detail: 'Drinking first raises peak THC concentrations measurably. The combination impairs driving far more than either alone, and is the classic cause of "greening out".' },

    { a: 'nitrous', b: 'alcohol', level: 'caution',
      mechanism: 'Additive CNS depression, dizziness and loss of balance.',
      detail: 'The main realistic harm is falling. Combined use should always be seated.' },

    { a: 'cbd', b: 'alprazolam', level: 'caution',
      mechanism: 'CBD inhibits CYP3A4, alprazolam\'s primary clearance enzyme.',
      detail: 'CBD is widely treated as inert because it is sold as a supplement. It is a potent CYP inhibitor and meaningfully raises benzodiazepine exposure.' },

    { a: 'paracetamol', b: 'alcohol', level: 'unsafe',
      mechanism: 'Alcohol attacks paracetamol safety from both sides at once: it induces CYP2E1, producing more of the toxic metabolite NAPQI, and it depletes the glutathione that neutralises it.',
      detail: 'Regular drinkers become hepatotoxic at doses well below the normal 4 g/day maximum — 2 g/day is the usual advice. This combination is a leading cause of acute liver failure, and it is largely silent for the first 24 hours.' },

    { a: 'ibuprofen', b: 'lithium', level: 'unsafe',
      mechanism: 'NSAIDs reduce renal prostaglandin synthesis, cutting lithium clearance.',
      detail: 'Lithium levels can rise 25-60%, and its therapeutic window is narrow (0.6-1.2 mmol/L, toxic above 1.5). Paracetamol is the safer analgesic for anyone on lithium.' },

    { a: 'naproxen', b: 'lithium', level: 'unsafe',
      mechanism: 'Same reduction in renal lithium clearance as other NSAIDs.',
      detail: 'Naproxen\'s long half-life sustains the effect. Monitor lithium levels or use paracetamol instead.' },

    { a: 'ibuprofen', b: 'sertraline', level: 'caution',
      mechanism: 'SSRIs deplete platelet serotonin (needed for aggregation) while NSAIDs inhibit COX-1 and damage the gastric mucosa — two independent hits on the same defence.',
      detail: 'The combination raises gastrointestinal bleeding risk several-fold over either alone. A PPI substantially reduces it if both are genuinely needed.' },

    { a: 'aspirin', b: 'alcohol', level: 'caution',
      mechanism: 'Additive gastric mucosal injury plus aspirin\'s irreversible antiplatelet effect.',
      detail: 'Raises the risk of gastrointestinal bleeding, and aspirin\'s platelet inhibition persists 7-10 days so the vulnerability outlasts the dose.' },

    { a: 'vitamin-c', b: 'amphetamine', level: 'decrease',
      mechanism: 'Gram doses of ascorbic acid acidify urine, ionising amphetamine in the renal tubule so it cannot be reabsorbed.',
      detail: 'Clearance speeds up and the half-life shortens — sometimes used deliberately to cut a comedown short. The flip side is that it also blunts a dose taken while urine is still acidic.' },

    { a: 'sodium-bicarbonate', b: 'amphetamine', level: 'unsafe',
      mechanism: 'Alkalinising urine leaves amphetamine non-ionised, so the kidney reabsorbs it instead of excreting it.',
      detail: 'The half-life can more than double — a 10 hour dose becoming 20-30 hours. Taken deliberately to potentiate a stimulant, this is a common route to accidental overdose, severe insomnia and cardiovascular strain, because the drug simply will not leave.' },

    { a: 'sodium-bicarbonate', b: 'methamphetamine', level: 'unsafe',
      mechanism: 'Urinary alkalinisation blocks renal excretion of a basic drug.',
      detail: 'Methamphetamine is already long-acting and partly cleared unchanged by the kidney; alkalinising urine extends it dramatically.' },

    { a: 'promethazine', b: 'codeine', level: 'dangerous',
      mechanism: 'Additive CNS and respiratory depression, and promethazine\'s antiemetic action removes the vomiting that would otherwise limit an opioid overdose.',
      detail: 'This is "lean"/purple drank. The combination is substantially more dangerous than codeine alone, and has caused numerous deaths — the suppressed vomiting reflex is a specific and under-appreciated part of why.' },

    { a: 'omeprazole', b: 'diazepam', level: 'caution',
      mechanism: 'Omeprazole inhibits CYP2C19, diazepam\'s main clearance enzyme.',
      detail: 'Diazepam exposure rises and its already long half-life lengthens further, so sedation accumulates over days of combined use.' },

    { a: 'grapefruit', b: 'ketamine', level: 'caution',
      mechanism: 'Furanocoumarins irreversibly inactivate intestinal CYP3A4, ketamine\'s main clearance route.',
      detail: 'Oral ketamine bioavailability and duration both rise substantially. The effect persists 24-72 hours after the juice, because the enzyme must be resynthesised.' }
  ];

  /* ======================================================================
     2. TAG RULES
     ====================================================================== */

  var TAG_RULES = [
    { a: 'maoi', b: 'dopamine-releaser', level: 'dangerous',
      title: 'MAOI + releasing stimulant',
      mechanism: 'MAO normally destroys the flood of monoamines a releasing agent produces. With MAO inhibited, noradrenaline accumulates without limit.',
      detail: 'Causes hypertensive crisis — extreme blood pressure, stroke, cardiac arrest. This is the classic fatal MAOI interaction.' },

    { a: 'maoi', b: 'serotonin-releaser', level: 'dangerous',
      title: 'MAOI + serotonin releaser',
      mechanism: 'Released serotonin cannot be broken down by MAO-A.',
      detail: 'Serotonin syndrome: hyperthermia, rigidity, clonus, autonomic instability, seizures, death. Onset can be within an hour.' },

    { a: 'maoi', b: 'ssri', level: 'dangerous',
      title: 'MAOI + SSRI/SNRI',
      mechanism: 'Reuptake inhibition plus blocked degradation — serotonin has no route out of the synapse.',
      detail: 'Among the most reliably lethal drug combinations in medicine. Requires a 2-week washout in both directions, and 5 weeks after fluoxetine.' },

    { a: 'maoi', b: 'mao-substrate', level: 'dangerous',
      title: 'MAOI + MAO-dependent drug',
      mechanism: 'The inhibited enzyme is the drug\'s main clearance route, so exposure rises unpredictably and enormously.',
      detail: 'Applies to DMT, mescaline, 2C compounds and other MAO-cleared psychedelics. Ayahuasca exploits this deliberately, which is precisely why ayahuasca carries full MAOI precautions.' },

    { a: 'maoi', b: 'sympathomimetic', level: 'dangerous',
      title: 'MAOI + sympathomimetic',
      mechanism: 'Unopposed noradrenergic accumulation.',
      detail: 'Includes over-the-counter decongestants such as pseudoephedrine — hypertensive crisis from cold medicine is a real and documented event.' },

    { a: 'opioid', b: 'cns-depressant', level: 'dangerous',
      title: 'Opioid + depressant',
      mechanism: 'Opioids suppress the brainstem respiratory drive; GABAergic depressants suppress arousal and airway tone. The effects are synergistic, not merely additive.',
      detail: 'This is the most common fatal drug combination in the world. Most "opioid overdoses" involve a benzodiazepine or alcohol. Naloxone reverses only the opioid component.' },

    { a: 'opioid', b: 'benzodiazepine', level: 'dangerous',
      title: 'Opioid + benzodiazepine',
      mechanism: 'Synergistic respiratory depression.',
      detail: 'Carries an FDA boxed warning. Risk of fatal overdose rises several-fold over either drug alone.' },

    { a: 'opioid', b: 'gabapentinoid', level: 'unsafe',
      title: 'Opioid + gabapentinoid',
      mechanism: 'Gabapentinoids potentiate opioid-induced respiratory depression and raise opioid bioavailability.',
      detail: 'Now a major and rising contributor to overdose deaths. Widely underestimated because pregabalin and gabapentin are perceived as mild.' },

    { a: 'cns-depressant', b: 'cns-depressant', level: 'unsafe',
      title: 'Multiple CNS depressants',
      mechanism: 'Additive to synergistic suppression of respiration, consciousness and airway reflexes.',
      detail: 'Combining any two of alcohol, benzodiazepines, GHB, barbiturates, gabapentinoids or opioids multiplies risk. Vomit aspiration while unconscious is a common mechanism of death.' },

    { a: 'serotonergic', b: 'serotonergic', level: 'caution',
      title: 'Multiple serotonergic drugs',
      mechanism: 'Additive serotonergic load at the postsynaptic receptor.',
      detail: 'Risk of serotonin syndrome scales with the number and strength of serotonergic agents. Early signs: shivering, sweating, tremor, agitation, hyperreflexia, dilated pupils.' },

    { a: 'serotonin-syndrome-risk', b: 'serotonin-releaser', level: 'dangerous',
      title: 'Serotonin releaser + serotonergic drug',
      mechanism: 'Massive serotonin release into a synapse where reuptake or breakdown is already impaired.',
      detail: 'The main mechanism of serotonin syndrome in recreational settings.' },

    { a: 'stimulant', b: 'stimulant', level: 'caution',
      title: 'Multiple stimulants',
      mechanism: 'Additive cardiovascular strain: heart rate, blood pressure, vasoconstriction and body temperature all compound.',
      detail: 'Raises risk of arrhythmia, hypertensive emergency, hyperthermia and seizure. It also masks fatigue, encouraging exertion the cardiovascular system cannot sustain.' },

    { a: 'stimulant', b: 'cns-depressant', level: 'caution',
      title: 'Stimulant + depressant',
      mechanism: 'The stimulant masks sedation without reducing respiratory depression.',
      detail: 'People misjudge how impaired they are and keep drinking or redosing. When the stimulant wears off first — it usually has the shorter half-life — the full depressant load lands at once. A classic overdose mechanism.' },

    { a: 'qt-prolonging', b: 'qt-prolonging', level: 'dangerous',
      title: 'Multiple QT-prolonging drugs',
      mechanism: 'Additive delay of cardiac repolarisation.',
      detail: 'Risk of torsades de pointes, a potentially fatal ventricular arrhythmia. Low potassium or magnesium, common after a heavy night, makes it considerably more likely.' },

    { a: 'seizure-risk', b: 'seizure-risk', level: 'unsafe',
      title: 'Multiple seizure-threshold-lowering drugs',
      mechanism: 'Additive reduction of the seizure threshold.',
      detail: 'Tramadol, bupropion, high-dose stimulants and some research chemicals all lower it. Dehydration, sleep deprivation and stimulant binges compound the effect.' },

    { a: 'vasoconstrictor', b: 'vasoconstrictor', level: 'caution',
      title: 'Multiple vasoconstrictors',
      mechanism: 'Additive peripheral and coronary vasoconstriction.',
      detail: 'Raises risk of myocardial ischaemia and, at the extreme, limb ischaemia. Cold, blue or painful extremities are a warning sign.' },

    { a: 'hyperthermia-risk', b: 'hyperthermia-risk', level: 'unsafe',
      title: 'Multiple hyperthermia-inducing drugs',
      mechanism: 'Additive rise in core temperature with impaired thermoregulation.',
      detail: 'Hyperthermia is the leading cause of MDMA and stimulant deaths. Heat, exertion, crowding and dehydration all compound it.' },

    { a: 'nmda-antagonist', b: 'cns-depressant', level: 'unsafe',
      title: 'Dissociative + depressant',
      mechanism: 'Additive sedation with loss of airway protective reflexes.',
      detail: 'Dissociatives frequently cause vomiting while suppressing the gag reflex; adding a depressant makes aspiration a real risk.' },

    { a: 'pde5-inhibitor', b: 'nitric-oxide-donor', level: 'dangerous',
      title: 'PDE5 inhibitor + nitrite',
      mechanism: 'Convergent amplification of the nitric oxide / cGMP vasodilation pathway.',
      detail: 'Catastrophic hypotension. Absolute contraindication.' },

    { a: 'cannabinoid', b: 'psychedelic', level: 'caution',
      title: 'Cannabis + psychedelic',
      mechanism: 'Cannabis potentiates and destabilises psychedelic effects, particularly during the peak.',
      detail: 'A common cause of an experience turning unexpectedly overwhelming. If used at all, it is usually kept to the comedown and to a much smaller amount than normal.' },

    { a: 'psychedelic', b: 'psychosis-risk', level: 'caution',
      title: 'Psychedelic + psychosis risk factors',
      mechanism: '5-HT2A agonism in a predisposed individual.',
      detail: 'Can precipitate prolonged psychosis in people with a personal or family history of schizophrenia or bipolar disorder.' }
  ];

  /* ======================================================================
     3. ENZYME (PHARMACOKINETIC) RULES
     ====================================================================== */

  // How completely a given inhibitor shuts down its target enzyme.
  var INHIBITION_STRENGTH = {
    strong:   0.9,
    moderate: 0.6,
    weak:     0.3
  };

  var INHIBITOR_POTENCY = {
    fluoxetine:      { 'CYP2D6': 'strong',   'CYP2C19': 'moderate', 'CYP3A4': 'weak' },
    paroxetine:      { 'CYP2D6': 'strong' },
    bupropion:       { 'CYP2D6': 'strong',   'CYP2B6': 'moderate' },
    sertraline:      { 'CYP2D6': 'moderate', 'CYP2C19': 'moderate' },
    cbd:             { 'CYP2C19': 'strong',  'CYP3A4': 'moderate', 'CYP2C9': 'moderate', 'CYP2D6': 'moderate', 'CYP1A2': 'weak' },
    grapefruit:      { 'CYP3A4': 'strong' },
    diphenhydramine: { 'CYP2D6': 'moderate' },
    mdma:            { 'CYP2D6': 'strong',   'CYP2B6': 'moderate' },
    methamphetamine: { 'CYP2D6': 'moderate' },
    ibogaine:        { 'CYP2D6': 'strong' },
    kratom:          { 'CYP2D6': 'moderate', 'CYP3A4': 'moderate' },
    moclobemide:     { 'CYP2D6': 'moderate', 'CYP2C19': 'moderate', 'CYP1A2': 'weak' },
    modafinil:       { 'CYP2C19': 'moderate' },
    memantine:       { 'CYP2B6': 'weak' },
    methadone:       { 'CYP2D6': 'moderate' },
    venlafaxine:     { 'CYP2D6': 'weak' },
    alcohol:         { 'CYP2E1': 'moderate' }
  };

  var INDUCER_POTENCY = {
    phenobarbital: { 'CYP3A4': 'strong', 'CYP2C9': 'strong', 'CYP1A2': 'moderate', 'CYP2C19': 'moderate', 'UGT': 'moderate' },
    modafinil:     { 'CYP3A4': 'moderate', 'CYP1A2': 'weak', 'CYP2B6': 'weak' },
    armodafinil:   { 'CYP3A4': 'moderate' },
    nicotine:      { 'CYP1A2': 'moderate' },
    alcohol:       { 'CYP2E1': 'moderate' }
  };

  function strengthFor(drug, enzyme, table) {
    var t = table[drug.id];
    if (t && t[enzyme]) return t[enzyme];
    return 'moderate';    // declared in the data but not graded — assume moderate
  }

  /**
   * How much drug B's enzyme effects change drug A's half-life.
   *
   * Uses the standard AUC-ratio relationship for a metabolic interaction:
   *     ratio = 1 / (1 - fm * inhibition)
   * where fm is the fraction of clearance through that enzyme. This is the
   * real pharmacokinetic form, not a made-up multiplier — a drug cleared 90%
   * by one enzyme is devastated by inhibiting it, while one cleared 10% by
   * that enzyme barely notices.
   */
  function enzymeEffects(target, other) {
    var out = [];
    if (!target || !other || target.id === other.id) return out;

    var pathways = target.metabolism.pathways || [];

    other.metabolism.inhibits.forEach(function (enz) {
      var fm = 0;
      pathways.forEach(function (p) {
        if (p.enzyme && p.enzyme.indexOf(enz) >= 0) fm += (p.fraction || 0);
      });
      if (fm <= 0) return;
      fm = Math.min(0.95, fm);
      var grade = strengthFor(other, enz, INHIBITOR_POTENCY);
      var inh = INHIBITION_STRENGTH[grade];
      var factor = 1 / (1 - fm * inh);
      out.push({
        kind: 'inhibition', enzyme: enz, by: other, target: target,
        grade: grade, fractionMetabolised: fm, factor: factor,
        level: factor >= 2.5 ? 'unsafe' : factor >= 1.5 ? 'caution' : 'neutral',
        text: other.name + ' is a ' + grade + ' ' + enz + ' inhibitor, and ' + enz +
              ' handles about ' + Math.round(fm * 100) + '% of ' + target.name +
              '’s clearance — estimated ' + factor.toFixed(1) +
              '× higher exposure and a correspondingly longer half-life.'
      });
    });

    other.metabolism.induces.forEach(function (enz) {
      var fm = 0;
      pathways.forEach(function (p) {
        if (p.enzyme && p.enzyme.indexOf(enz) >= 0) fm += (p.fraction || 0);
      });
      if (fm <= 0) return;
      fm = Math.min(0.95, fm);
      var grade = strengthFor(other, enz, INDUCER_POTENCY);
      var ind = { strong: 3, moderate: 2, weak: 1.4 }[grade];
      var factor = 1 / (1 - fm + fm * ind);
      out.push({
        kind: 'induction', enzyme: enz, by: other, target: target,
        grade: grade, fractionMetabolised: fm, factor: factor,
        level: factor <= 0.5 ? 'caution' : 'neutral',
        text: other.name + ' is a ' + grade + ' ' + enz + ' inducer — ' + target.name +
              ' is cleared faster, to roughly ' + Math.round(factor * 100) +
              '% of normal exposure. Effects may be weaker or shorter than expected.'
      });
    });

    // Prodrugs are the inverse case: inhibiting the activating enzyme means
    // the drug never becomes active at all.
    (target.metabolism.metabolites || []).forEach(function (m) {
      if (!m.active || !(m.potencyRel > 1)) return;
      pathways.forEach(function (p) {
        if (p.product && p.product.indexOf(m.name) < 0) return;
        other.metabolism.inhibits.forEach(function (enz) {
          if (!p.enzyme || p.enzyme.indexOf(enz) < 0) return;
          out.push({
            kind: 'activation-block', enzyme: enz, by: other, target: target,
            factor: 1, level: 'decrease',
            text: target.name + ' needs ' + enz + ' to form its active metabolite ' + m.name +
                  '. ' + other.name + ' inhibits ' + enz + ', so the drug may produce much less effect than expected.'
          });
        });
      });
    });

    return out;
  }

  /* ======================================================================
     EVALUATION
     ====================================================================== */

  function pairKey(a, b) { return [a, b].sort().join('|'); }

  var PAIR_INDEX = (function () {
    var idx = {};
    PAIRS.forEach(function (p) { idx[pairKey(p.a, p.b)] = p; });
    return idx;
  })();

  /** All findings for one ordered pair of drugs. */
  function between(drugA, drugB) {
    if (!drugA || !drugB || drugA.id === drugB.id) return [];
    var found = [];

    var explicit = PAIR_INDEX[pairKey(drugA.id, drugB.id)];
    if (explicit) {
      found.push({
        source: 'documented', level: explicit.level,
        title: drugA.name + ' + ' + drugB.name,
        mechanism: explicit.mechanism, detail: explicit.detail,
        drugs: [drugA, drugB]
      });
    }

    TAG_RULES.forEach(function (r) {
      var hit = (DB.hasTag(drugA, r.a) && DB.hasTag(drugB, r.b)) ||
                (DB.hasTag(drugB, r.a) && DB.hasTag(drugA, r.b));
      // Self-pairing rules (depressant + depressant) need two distinct drugs
      // that each carry the tag, which the id check above already guarantees.
      if (!hit) return;
      found.push({
        source: 'class', level: r.level, title: r.title,
        mechanism: r.mechanism, detail: r.detail,
        drugs: [drugA, drugB]
      });
    });

    enzymeEffects(drugA, drugB).forEach(function (e) {
      if (e.level === 'neutral') return;
      found.push({
        source: 'metabolic', level: e.level,
        title: e.enzyme + ' ' + (e.kind === 'induction' ? 'induction' : e.kind === 'activation-block' ? 'blocked activation' : 'inhibition'),
        mechanism: e.text, detail: null, enzyme: e, drugs: [drugA, drugB]
      });
    });
    enzymeEffects(drugB, drugA).forEach(function (e) {
      if (e.level === 'neutral') return;
      found.push({
        source: 'metabolic', level: e.level,
        title: e.enzyme + ' ' + (e.kind === 'induction' ? 'induction' : e.kind === 'activation-block' ? 'blocked activation' : 'inhibition'),
        mechanism: e.text, detail: null, enzyme: e, drugs: [drugB, drugA]
      });
    });

    // Deduplicate identical class findings, keeping the most severe.
    var seen = {};
    var out = [];
    found.sort(function (x, y) { return LEVELS[y.level].rank - LEVELS[x.level].rank; });
    found.forEach(function (f) {
      var k = f.source + '|' + f.title;
      if (seen[k]) return;
      seen[k] = 1;
      out.push(f);
    });
    return out;
  }

  /** Worst level across a pair, for matrix cells. */
  function worstBetween(a, b) {
    var f = between(a, b);
    if (!f.length) return 'neutral';
    return f[0].level;
  }

  /** All findings across a set of concurrently active drugs. */
  function amongst(drugs) {
    var out = [];
    for (var i = 0; i < drugs.length; i++) {
      for (var j = i + 1; j < drugs.length; j++) {
        out = out.concat(between(drugs[i], drugs[j]));
      }
    }
    out.sort(function (x, y) { return LEVELS[y.level].rank - LEVELS[x.level].rank; });
    return out;
  }

  /**
   * Half-life modifiers for `target` given everything else currently on board.
   * Fed straight into PK.buildDoseCurve so the plotted curve reflects the
   * interaction rather than the textbook half-life.
   */
  function halfLifeModifiers(target, others) {
    var mods = [];
    others.forEach(function (o) {
      enzymeEffects(target, o).forEach(function (e) {
        if (e.kind === 'inhibition' && e.factor > 1.1) {
          mods.push({ factor: e.factor, reason: o.name + ' inhibits ' + e.enzyme, enzyme: e.enzyme, by: o });
        } else if (e.kind === 'induction' && e.factor < 0.9) {
          mods.push({ factor: e.factor, reason: o.name + ' induces ' + e.enzyme, enzyme: e.enzyme, by: o });
        }
      });
    });
    return mods;
  }

  global.Interactions = {
    LEVELS: LEVELS,
    PAIRS: PAIRS,
    TAG_RULES: TAG_RULES,
    between: between,
    worstBetween: worstBetween,
    amongst: amongst,
    enzymeEffects: enzymeEffects,
    halfLifeModifiers: halfLifeModifiers
  };
})(window);

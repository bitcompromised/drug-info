/* Opioids — natural, semi-synthetic, synthetic, and antagonists */
DB.register([

{
  id: 'morphine', name: 'Morphine', aliases: ['ms contin', 'morphia'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant',
         'histamine-release', 'constipating', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Mu-opioid receptor agonist with lesser kappa and delta activity. The reference standard against which all other opioid potencies are expressed.',
  halfLife: { hours: 2.5, range: [2, 4], confidence: 'measured',
    notes: 'The parent half-life understates duration because the active metabolite M6G is more potent and is cleared renally — in kidney impairment M6G accumulates and causes delayed, prolonged respiratory depression.' },
  metabolism: {
    firstPass: 'Very heavy — oral bioavailability only 20-40%, which is why oral doses are roughly 3x parenteral ones.',
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation at the 3- and 6-positions', fraction: 0.65,
        products: [
          { name: 'Morphine-3-glucuronide (M3G)', fraction: 0.55, active: false },
          { name: 'Morphine-6-glucuronide (M6G)', fraction: 0.1, active: true }
        ],
        note: 'ONE enzyme, two opposite outcomes — which is why it is drawn as a single pathway that forks. M3G is the larger share (~50-60%) and has no analgesic activity at all, but it is neuroexcitatory and is implicated in the myoclonus, allodynia and hyperalgesia seen at high dose or in renal impairment. M6G is the smaller share and is roughly twice as potent as morphine itself. UGT2B7 polymorphisms shift the ratio between them, which is why the same dose can be more analgesic in one person and more agitating in another.' },
      { enzyme: 'CYP3A4 / CYP2C8', reaction: 'N-demethylation', product: 'Normorphine', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Morphine-6-glucuronide', active: true, halfLifeH: 4, potencyRel: 2.0,
        note: 'Roughly twice as potent as morphine and renally cleared. In renal impairment it accumulates over days and causes late respiratory depression — a classic and dangerous clinical trap.' },
      { name: 'Morphine-3-glucuronide', active: false, halfLifeH: 4,
        note: 'No analgesia; neuroexcitatory. Associated with hyperalgesia and myoclonic jerks at high cumulative doses.' },
      { name: 'Normorphine', active: true, potencyRel: 0.25 }
    ],
    substrateOf: ['UGT2B7', 'CYP3A4'], inhibits: [],
    excretion: 'Renal, ~90% as glucuronides; ~10% unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.3,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 80], heavy: 80, unit: 'mg',
        note: 'Opioid-naive individuals only. Tolerant users operate at completely different doses.' } },
    iv: { onsetMin: [0.5, 3], peakMin: [5, 20], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 1.0,
      doses: { threshold: 2, light: [5, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } },
    insufflated: { onsetMin: [5, 15], peakMin: [20, 45], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.4,
      doses: { threshold: 5, light: [8, 15], common: [15, 30], strong: [30, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'With benzodiazepines, alcohol or other depressants, respiratory depression becomes fatal. This combination accounts for most opioid deaths.',
    'Tolerance to euphoria develops faster than tolerance to respiratory depression, so escalating doses close the safety gap.',
    'Tolerance is lost rapidly during abstinence — returning to a previous dose after even 1-2 weeks off is a leading cause of fatal overdose. Naloxone should be on hand.'
  ],
  refs: ['DrugBank DB00295', 'Klimas & Mikus 2014, Br J Anaesth']
},

{
  id: 'codeine', name: 'Codeine', aliases: ['co-codamol', 'lean', 'purple drank'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II-V (US, varies by formulation)',
  tags: ['opioid', 'mu-agonist', 'prodrug', 'analgesic', 'antitussive', 'respiratory-depressant',
         'cns-depressant', 'cyp2d6-critical', 'constipating', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Essentially a prodrug — codeine itself has very low mu affinity. Its analgesic and euphoric effects come almost entirely from the ~5-10% converted to morphine by CYP2D6.',
  halfLife: { hours: 3, range: [2.5, 4], confidence: 'measured' },
  metabolism: {
    firstPass: 'Moderate; oral bioavailability ~50%.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Morphine', fraction: 0.17,
        note: 'THE decisive step, and a textbook example of why pharmacogenetics matters. Poor metabolisers (~7% of Europeans) get almost no analgesia. Ultra-rapid metabolisers (up to 29% in some North African populations) convert far too much and have died from ordinary doses — this caused deaths in breastfed infants and led to codeine being contraindicated in children. FRACTION NOTE: pathway shares in this database are fractions of the ABSORBED drug, and codeine is only ~50% bioavailable orally. The literature figure of "5-10% of a codeine dose becomes morphine" therefore corresponds to ~17% of what is absorbed, which is the number used here — a 180 mg oral dose yields roughly 15 mg of morphine, not the 7 mg a share-of-dose reading would give.' },
      { enzyme: 'UGT2B7', reaction: '6-O-glucuronidation', product: 'Codeine-6-glucuronide', fraction: 0.6, note: 'Largest route by mass; largely inactive.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Norcodeine', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Morphine', active: true, halfLifeH: 2.5, potencyRel: 10,
        note: 'The actual active drug. Roughly 10x codeine\'s intrinsic potency, so small changes in conversion rate produce large changes in effect.' },
      { name: 'Codeine-6-glucuronide', active: false, halfLifeH: 3 },
      { name: 'Norcodeine', active: false }
    ],
    substrateOf: ['CYP2D6', 'UGT2B7', 'CYP3A4'], inhibits: [],
    excretion: 'Renal, ~90% within 24 h.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [3, 5], afterEffectsH: [2, 6], bioavailability: 0.5,
      doses: { threshold: 15, light: [30, 60], common: [60, 120], strong: [120, 200], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'CYP2D6 ultra-rapid metabolisers can reach dangerous morphine levels from a normal dose. CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion) do the opposite and abolish the effect entirely.',
    'Most codeine products also contain paracetamol/acetaminophen or ibuprofen. Escalating codeine doses therefore reaches hepatotoxic or GI-perforating amounts of the other ingredient long before the opioid alone would be lethal. This is the dominant harm from codeine misuse.',
    'Fatal with alcohol, benzodiazepines or other depressants.'
  ],
  refs: ['Crews et al. 2014, Clin Pharmacol Ther (CPIC guideline)', 'FDA Drug Safety Communication 2017']
},

{
  id: 'heroin', name: 'Heroin', aliases: ['diamorphine', 'diacetylmorphine', 'smack', 'gear', 'dope'],
  class: 'Opioid', family: 'Morphinan', schedule: 'I (US); prescribed as diamorphine in UK',
  tags: ['opioid', 'mu-agonist', 'prodrug', 'analgesic', 'respiratory-depressant', 'cns-depressant',
         'histamine-release', 'highly-addictive', 'high-overdose-risk'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A prodrug for morphine. The two acetyl groups make it far more lipophilic, so it crosses the blood-brain barrier roughly 100x faster than morphine — the entire basis of the "rush", since the receptor pharmacology is identical.',
  halfLife: { hours: 0.05, range: [0.03, 0.1], confidence: 'measured',
    notes: 'Heroin itself lasts about 2-6 minutes. The duration you actually experience belongs to 6-MAM and morphine.' },
  metabolism: {
    firstPass: 'Complete — swallowed heroin is deacetylated to morphine before reaching the brain, so it is simply an expensive way to take morphine.',
    pathways: [
      { enzyme: 'CES2 / BChE', reaction: 'Deacetylation at the 3-position', product: '6-Monoacetylmorphine (6-MAM)', fraction: 0.95,
        note: 'Extremely fast — occurs in blood and brain within minutes.' },
      { enzyme: 'CES1 / hepatic esterases', reaction: 'Deacetylation of 6-MAM', product: 'Morphine', fraction: 0.9 },
      { enzyme: 'UGT2B7', reaction: 'Downstream glucuronidation of morphine', fraction: 0.65,
        products: [
          { name: 'Morphine-3-glucuronide (M3G)', fraction: 0.55, active: false },
          { name: 'Morphine-6-glucuronide (M6G)', fraction: 0.1, active: true }
        ],
        note: 'The same forked UGT2B7 step morphine itself undergoes, reached here two deacetylations downstream. M3G is the bulk of it and is INACTIVE at mu — neuroexcitatory rather than analgesic. M6G is the smaller share and is about twice as potent as morphine, renally cleared, and the reason effects outlast the parent so badly in kidney impairment.' }
    ],
    metabolites: [
      { name: '6-Monoacetylmorphine', active: true, halfLifeH: 0.4, potencyRel: 4,
        note: 'Potent and highly brain-penetrant; responsible for the initial rush. It is also the only unique marker proving heroin rather than morphine or codeine use.' },
      { name: 'Morphine', active: true, halfLifeH: 2.5, potencyRel: 1.0, note: 'Carries the bulk of the duration.' },
      { name: 'Morphine-6-glucuronide', active: true, halfLifeH: 4, potencyRel: 2.0,
        note: 'Roughly twice as potent as morphine at mu and cleared renally, so it accumulates in kidney impairment and drives late respiratory depression.' },
      { name: 'Morphine-3-glucuronide', active: false, halfLifeH: 4,
        note: 'INACTIVE at the mu receptor — it produces no analgesia and no respiratory depression. It is not inert, though: it is neuroexcitatory and is implicated in myoclonus and hyperalgesia at high cumulative doses. The largest metabolite by mass.' }
    ],
    substrateOf: ['CES1', 'CES2', 'BChE', 'UGT2B7'], inhibits: [],
    excretion: 'Renal, as morphine glucuronides.', confidence: 'measured'
  },
  routes: {
    /* Swallowed heroin is a morphine prodrug and nothing else. Presystemic
       deacetylation is essentially complete: no diacetylmorphine reaches the
       systemic circulation, and there is no 6-MAM spike, so there is no rush —
       the thing the other three routes exist for is precisely what this one
       cannot deliver. The figures below are therefore MORPHINE's, adjusted for
       the molecular weight difference (369.4 vs 285.3 g/mol, so a milligram of
       heroin carries 0.77 mg of morphine), which is why the ladder sits above
       oral morphine's rather than below it. */
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [2, 8],
      // Heroin is a prodrug and its own effect is simply how much of it is
      // there. The published onset, peak and duration are morphine arriving,
      // and they stay as written because absorption depends on them.
      effectFollowsAmount: true,
      // What survives to the circulation AS HEROIN: essentially nothing.
      bioavailability: 0.02,
      /* ...but a third of the dose does cross the gut, and all of it is still
         delivered onward. The reported oral bioavailability of 22-64% is a
         figure for what ARRIVES — which on this route is morphine — not for
         heroin surviving the trip, because none of it does. So the absorbed
         share is declared outright instead of being derived from a near-zero
         parent bioavailability, which had a swallowed gram reporting 20 mg
         absorbed when 350 mg of it goes in. */
      absorbedFraction: 0.35,
      metabolisedFraction: 0.35,
      /* The chain is the same one every route takes — heroin, 6-MAM, morphine
         — it simply runs to COMPLETION before anything reaches the systemic
         circulation. Both deacetylations happen in the gut wall and liver, so
         what arrives is morphine and there is no 6-MAM spike; that absence is
         the whole difference between swallowing heroin and injecting it.

         `presystemicTransient` on the 6-MAM says exactly that: the first pass
         runs through it rather than stopping at it. It keeps its real
         systemic half-life, because the ~2% of the dose that does reach the
         blood as heroin still makes its trace of 6-MAM the ordinary way —
         that part never went through the liver first. */
      metabolism: {
        pathways: [
          { enzyme: 'CES2 / BChE (presystemic)', reaction: 'Deacetylation at the 3-position',
            product: '6-Monoacetylmorphine (6-MAM)', fraction: 0.95,
            note: 'The first of the two deacetylations. On this route it happens in the gut wall and liver rather than in blood and brain.' },
          { enzyme: 'CES1 / hepatic esterases (presystemic)', reaction: 'Deacetylation of 6-MAM',
            product: 'Morphine', from: '6-Monoacetylmorphine (6-MAM)', fraction: 0.95,
            note: 'Completed before any of it reaches the brain, which is why swallowed heroin has no rush: the 6-MAM spike the other routes deliver never happens here.' },
          { enzyme: 'UGT2B7', reaction: 'Glucuronidation of morphine', from: 'Morphine', fraction: 0.65,
            products: [
              { name: 'Morphine-3-glucuronide (M3G)', fraction: 0.55, active: false },
              { name: 'Morphine-6-glucuronide (M6G)', fraction: 0.1, active: true }
            ],
            note: 'The same forked step morphine undergoes however it got there. M3G is the bulk and is inactive at mu; M6G is smaller, roughly twice morphine\'s potency, and renally cleared.' }
        ],
        metabolites: [
          { name: '6-Monoacetylmorphine', presystemicTransient: true, active: true, halfLifeH: 0.4, potencyRel: 4, fraction: 0.95,
            note: 'An intermediate on this route rather than a circulating compound. Both deacetylations are complete before the dose reaches the systemic circulation, so what arrives is morphine — there is no 6-MAM spike and no rush. Only the small share that survives the first pass as heroin goes on to make any circulating 6-MAM at all.' },
          { name: 'Morphine', from: '6-Monoacetylmorphine', active: true, halfLifeH: 2.5, potencyRel: 1.0, fraction: 0.95,
            note: 'On this route morphine is not a metabolite in the incidental sense — it is the drug. Everything you feel from swallowed heroin is this.' },
          { name: 'Morphine-6-glucuronide', active: true, halfLifeH: 4, potencyRel: 2.0, fraction: 0.1,
            note: 'Roughly twice as potent as morphine at mu and cleared renally, so it accumulates in kidney impairment and drives late respiratory depression.' },
          { name: 'Morphine-3-glucuronide', active: false, halfLifeH: 4, fraction: 0.55,
            note: 'Inactive at mu — no analgesia and no respiratory depression — but neuroexcitatory, and the largest metabolite by mass.' }
        ]
      },
      doses: { threshold: 7, light: [13, 26], common: [26, 52], strong: [52, 105], heavy: 105, unit: 'mg',
        note: 'Opioid-naive equivalents, and they are oral MORPHINE doses converted by molecular weight — about 1.3x the milligrams of morphine for the same effect. Swallowing heroin gives you morphine on a morphine timescale: 20-60 minutes to onset, no rush, and nothing that distinguishes it from having taken morphine in the first place. Street purity varies from under 5% to over 70%, so any weight-based dose is meaningless without testing.' } },
    iv: { onsetMin: [0.2, 1], peakMin: [1, 5], durationH: [3, 5], afterEffectsH: [2, 6],
      effectFollowsAmount: true,
      bioavailability: 1.0,
      doses: { threshold: 2, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg',
        note: 'Opioid-naive equivalents. Purity of street heroin varies from under 5% to over 70%, making any weight-based dose meaningless without testing.' } },
    insufflated: { onsetMin: [1, 5], peakMin: [5, 15], durationH: [3, 5], afterEffectsH: [2, 6],
      effectFollowsAmount: true,
      bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    smoked: { onsetMin: [0.2, 2], peakMin: [3, 10], durationH: [3, 5], afterEffectsH: [2, 6],
      effectFollowsAmount: true,
      bioavailability: 0.5,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Taken orally it is not heroin in any meaningful sense — first-pass deacetylation is essentially complete, so what reaches you is morphine, with no rush and a 20-60 minute onset. The specific danger is the wait: people redose because "nothing is happening", and the first dose then lands on top of the second. Oral doses need roughly 1.3x the milligrams of morphine for the same effect.',
    'The illicit supply in North America and increasingly elsewhere is contaminated with fentanyl and nitazenes, which are potent in micrograms. Weight-based dosing of street product is not meaningful. Fentanyl test strips, a test dose, never using alone, and naloxone on hand are the standard precautions.',
    'Lost tolerance after any break — detox, prison, hospital — is the single largest predictor of fatal overdose.',
    'Fatal with benzodiazepines, alcohol, gabapentinoids or any other depressant.'
  ],
  refs: ['Rook et al. 2006, Curr Clin Pharmacol', 'DrugBank DB01452']
},

{
  id: 'oxycodone', name: 'Oxycodone', aliases: ['oxycontin', 'percocet', 'roxicodone', 'oxy'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant',
         'constipating', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Mu-opioid agonist roughly 1.5-2x the potency of morphine orally. Unusually for an opioid, the parent compound carries most of the activity itself.',
  halfLife: { hours: 3.5, range: [3, 5], confidence: 'measured' },
  metabolism: {
    firstPass: 'Modest — oral bioavailability is a high 60-87%, notably better than morphine.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Noroxycodone', fraction: 0.45,
        note: 'The largest route by mass but the product is weakly active. CYP3A4 inhibitors (clarithromycin, ritonavir, grapefruit) raise oxycodone exposure substantially.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Oxymorphone', fraction: 0.11,
        note: 'Small by mass but produces a metabolite roughly 14x more potent at the mu receptor.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'Secondary demethylation', product: 'Noroxymorphone', from: 'Oxymorphone', fraction: 0.15,
        note: 'Accumulates in renal impairment and is itself an active mu agonist.' },
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Oxymorphone', active: true, halfLifeH: 9, potencyRel: 14,
        note: 'Very potent but formed in small amounts; contributes meaningfully in CYP2D6 ultra-rapid metabolisers.' },
      { name: 'Noroxycodone', active: true, halfLifeH: 8, potencyRel: 0.05, note: 'Weakly active; the main circulating metabolite.' },
      { name: 'Noroxymorphone', active: true, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6', 'UGT2B7'], inhibits: [],
    excretion: 'Renal; ~10% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 40], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.75,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [20, 40], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Counterfeit "M30" oxycodone tablets containing fentanyl are now extremely common and are a leading cause of overdose death in North America. A pill not dispensed by a pharmacy should be assumed to be counterfeit.',
    'Combination products contain paracetamol; escalating doses reaches hepatotoxic amounts.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['Lalovic et al. 2006, Clin Pharmacol Ther', 'DrugBank DB00497']
},

{
  id: 'tramadol', name: 'Tramadol', aliases: ['ultram', 'tramal'],
  class: 'Opioid', family: 'Aminocyclohexanol', schedule: 'IV (US)',
  tags: ['opioid', 'mu-agonist', 'prodrug', 'serotonergic', 'snri', 'seizure-risk',
         'serotonin-syndrome-risk', 'cyp2d6-critical', 'respiratory-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A genuinely dual drug: the parent is a serotonin-noradrenaline reuptake inhibitor, while its CYP2D6 metabolite M1 is the actual opioid. The SNRI half is what causes the seizures and serotonin syndrome that make tramadol far riskier than its "weak opioid" reputation suggests.',
  halfLife: { hours: 6, range: [5, 7], confidence: 'measured', notes: 'M1 half-life ~7-9 h.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'O-desmethyltramadol (M1)', fraction: 0.3,
        note: 'The step that creates the opioid effect. M1 has roughly 200x the mu affinity of tramadol. Poor metabolisers get little analgesia but the full SNRI (seizure and serotonin) risk; ultra-rapid metabolisers can reach dangerous opioid levels.' },
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'N-demethylation', product: 'N-desmethyltramadol (M2)', fraction: 0.2, note: 'Inactive at mu.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation of M1', product: 'M1 glucuronide', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'O-desmethyltramadol (M1)', active: true, halfLifeH: 8, potencyRel: 200,
        note: 'The real opioid. Also sold separately as the research chemical O-DSMT.' },
      { name: 'N-desmethyltramadol (M2)', active: false }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4', 'CYP2B6'], inhibits: [],
    excretion: 'Renal, ~30% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [3, 10], bioavailability: 0.7,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 400], heavy: 400, unit: 'mg' } }
  },
  warnings: [
    'Lowers the seizure threshold at therapeutic doses, and markedly at higher ones — seizures occur even in people with no epilepsy history. Risk rises sharply when combined with SSRIs, SNRIs, bupropion or antipsychotics.',
    'Serious serotonin syndrome risk with SSRIs, SNRIs, MAOIs, triptans, DXM or linezolid. Absolutely contraindicated with MAOIs.',
    'Withdrawal is atypical — it has both an opioid component and an SNRI-discontinuation component, and is widely described as worse than expected for a "weak" opioid.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['Grond & Sablotzki 2004, Clin Pharmacokinet', 'CPIC tramadol guideline 2021']
},

{
  id: 'fentanyl', name: 'Fentanyl', aliases: ['fent', 'duragesic', 'sublimaze'],
  class: 'Opioid', family: 'Anilidopiperidine', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant',
         'chest-wall-rigidity', 'highly-addictive', 'high-overdose-risk', 'extreme-potency'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Highly lipophilic, high-efficacy mu-opioid agonist roughly 50-100x the potency of morphine. Its lipophilicity gives near-instant CNS entry and, on repeated dosing, saturation of fat stores that dramatically extends the effective duration.',
  halfLife: { hours: 7, range: [3, 12], confidence: 'measured',
    notes: 'The context-sensitive half-time matters more than the terminal half-life: a single IV dose wears off in 30-60 minutes purely by redistribution, but after repeated dosing the fat compartment saturates and duration lengthens enormously. This is a well-known cause of delayed, unexpected respiratory arrest.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation of the piperidine nitrogen', product: 'Norfentanyl', fraction: 0.9,
        note: 'Almost the entire clearance route, and the product is inactive. CYP3A4 inhibitors — ritonavir, clarithromycin, ketoconazole, even grapefruit — meaningfully raise fentanyl levels and have caused fatal overdoses with patches.' }
    ],
    metabolites: [
      { name: 'Norfentanyl', active: false, halfLifeH: 9, note: 'Inactive; the standard urinary marker. Note that ordinary opiate immunoassays do NOT detect fentanyl — a specific test is required.' }
    ],
    substrateOf: ['CYP3A4'], inhibits: [],
    excretion: 'Renal, <10% unchanged.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [0.2, 1], peakMin: [1, 5], durationH: [0.5, 1.5], afterEffectsH: [1, 4], bioavailability: 1.0,
      doses: { threshold: 0.01, light: [0.025, 0.05], common: [0.05, 0.1], strong: [0.1, 0.2], heavy: 0.2, unit: 'mg',
        note: 'A common clinical dose is 50-100 µg. Doses at this scale cannot be measured outside a laboratory.' } },
    transdermal: { onsetMin: [360, 720], peakMin: [720, 1440], durationH: [48, 72], afterEffectsH: [12, 24], bioavailability: 0.92,
      doses: { threshold: 0.012, light: [0.012, 0.025], common: [0.025, 0.05], strong: [0.05, 0.1], heavy: 0.1, unit: 'mg/h' } },
    insufflated: { onsetMin: [1, 5], peakMin: [5, 15], durationH: [1, 2], afterEffectsH: [1, 4], bioavailability: 0.9,
      doses: { threshold: 0.01, light: [0.02, 0.05], common: [0.05, 0.1], strong: [0.1, 0.15], heavy: 0.15, unit: 'mg' } }
  },
  warnings: [
    'Active in micrograms. There is no safe way to measure or divide illicit fentanyl powder by hand — uneven mixing in pressed pills means one half of a pill can contain a lethal amount while the other contains none.',
    'Causes chest wall and glottic rigidity ("wooden chest") at high doses, which can prevent ventilation even with a bag-valve mask and is not reversed quickly by naloxone.',
    'Because fentanyl outlasts naloxone, repeat naloxone doses are usually needed and the person must not be left alone after revival.',
    'Now the leading cause of overdose death in the United States, mostly in people who did not know they were taking it.'
  ],
  refs: ['Feierman & Lasker 1996, Drug Metab Dispos', 'CDC overdose surveillance data']
},

{
  id: 'methadone', name: 'Methadone', aliases: ['dolophine', 'methadose'],
  class: 'Opioid', family: 'Diphenylheptane', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'nmda-antagonist', 'qt-prolonging', 'respiratory-depressant',
         'cns-depressant', 'long-duration', 'accumulation-risk', 'addictive', 'narrow-therapeutic-index'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 5,
  mechanism: 'Full mu agonist that is also an NMDA antagonist and an SNRI. The NMDA activity is thought to explain its effectiveness against neuropathic pain and its unusual profile in opioid dependence treatment.',
  halfLife: { hours: 24, range: [8, 59], confidence: 'measured',
    notes: 'DANGEROUS MISMATCH: analgesia lasts 4-8 hours but the drug persists for 24-60. Dosing to comfort during the first days of treatment causes accumulation to a lethal level on day 3-5. This is the classic mechanism of methadone induction deaths and the reason induction is done slowly and under supervision.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'N-demethylation', product: 'EDDP', fraction: 0.5,
        note: 'The principal route. CYP2B6 slow metabolisers accumulate the S-enantiomer, which is the one responsible for QT prolongation — a genuine genetic risk factor for methadone-associated arrhythmia.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'EDDP', fraction: 0.25 },
      { enzyme: 'CYP2C19 / CYP2D6', reaction: 'Minor demethylation', product: 'EDDP / EMDP', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'EDDP', active: false, halfLifeH: 20, note: 'Inactive; the standard urinary marker used to confirm adherence.' },
      { name: 'EMDP', active: false }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CYP2C19', 'CYP2D6'], inhibits: ['CYP2D6'],
    excretion: 'Renal and faecal; renal clearance rises with acidic urine.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [150, 240], durationH: [6, 12], afterEffectsH: [12, 36], bioavailability: 0.8,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 30], strong: [30, 60], heavy: 60, unit: 'mg',
        note: 'Maintenance doses of 60-120 mg/day apply only to fully tolerant patients. In an opioid-naive person 30 mg can be fatal.' } }
  },
  warnings: [
    'Accumulates over the first several days of regular dosing — the dose that felt too weak on day 1 can be fatal on day 4.',
    'Prolongs the QT interval and causes torsades de pointes, especially above 100 mg/day or combined with other QT-prolonging drugs (ondansetron, many antipsychotics, some antibiotics, ibogaine).',
    'Numerous CYP interactions: inducers (rifampicin, phenytoin, carbamazepine, some antiretrovirals) can precipitate withdrawal; inhibitors can cause overdose.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['Eap et al. 2002, Clin Pharmacokinet', 'Krantz et al. 2009, Ann Intern Med']
},

{
  id: 'buprenorphine', name: 'Buprenorphine', aliases: ['subutex', 'suboxone', 'bupe', 'temgesic'],
  class: 'Opioid', family: 'Oripavine', schedule: 'III (US)',
  tags: ['opioid', 'mu-partial-agonist', 'kappa-antagonist', 'respiratory-depressant',
         'precipitated-withdrawal-risk', 'long-duration', 'ceiling-effect', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 5,
  mechanism: 'High-affinity PARTIAL mu agonist and kappa antagonist. Its extremely high receptor affinity combined with partial agonism means it both displaces other opioids and caps their effect — the source of both its safety advantage and its capacity to trigger precipitated withdrawal.',
  halfLife: { hours: 32, range: [24, 42], confidence: 'measured',
    notes: 'Very long, and receptor occupancy lasts even longer than plasma levels — a single dose can block other opioids for 24-72 hours.' },
  metabolism: {
    firstPass: 'Almost complete when swallowed — oral bioavailability is only ~10%, which is why it is taken sublingually (~30%).',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Norbuprenorphine', fraction: 0.4,
        note: 'Produces an ACTIVE metabolite that, unlike the parent, is a full agonist at mu with no ceiling on respiratory depression. It penetrates the CNS poorly, which limits the risk — but not in overdose or with renal impairment.' },
      { enzyme: 'UGT1A1 / UGT2B7', reaction: 'Glucuronidation', product: 'Buprenorphine-3-glucuronide', fraction: 0.5 },
      { enzyme: 'UGT1A3', reaction: 'Glucuronidation of norbuprenorphine', product: 'Norbuprenorphine-3-glucuronide', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Norbuprenorphine', active: true, halfLifeH: 40, potencyRel: 0.3,
        note: 'A full mu agonist and a genuine respiratory depressant, though poorly brain-penetrant. Accumulates in renal impairment.' },
      { name: 'Buprenorphine-3-glucuronide', active: true, potencyRel: 0.05 }
    ],
    substrateOf: ['CYP3A4', 'UGT1A1', 'UGT2B7'], inhibits: [],
    excretion: 'Mostly faecal (~70%) as conjugates; ~30% renal.', confidence: 'measured'
  },
  routes: {
    sublingual: { onsetMin: [20, 60], peakMin: [90, 210], durationH: [8, 24], afterEffectsH: [24, 48], bioavailability: 0.3,
      doses: { threshold: 0.2, light: [0.5, 2], common: [2, 8], strong: [8, 16], heavy: 16, unit: 'mg' } }
  },
  warnings: [
    'Taking buprenorphine too soon after a full agonist causes PRECIPITATED WITHDRAWAL — it displaces the other opioid from receptors and triggers immediate, severe withdrawal. Standard practice is to wait until moderate withdrawal is already established (12-24 h after short-acting opioids, 48-72 h after methadone).',
    'The ceiling effect makes overdose on buprenorphine alone unlikely in adults — but it is removed by combination with benzodiazepines or alcohol, which is how buprenorphine deaths occur.',
    'Its high affinity means naloxone works poorly against it; much larger doses are needed.',
    'Dangerous to children even in small amounts — no ceiling protection applies at low body weight.'
  ],
  refs: ['Elkader & Sproule 2005, Clin Pharmacokinet', 'Brown et al. 2011, J Clin Pharmacol']
},

{
  id: 'kratom', name: 'Kratom', aliases: ['mitragyna speciosa', 'mitragynine', 'ketum'],
  class: 'Opioid', family: 'Indole alkaloid', schedule: 'Unscheduled in much of the US; banned in some states/countries',
  tags: ['opioid', 'mu-partial-agonist', 'stimulant', 'alpha2-agonist', 'addictive', 'hepatotoxic-rare'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Mitragynine is a biased partial mu agonist with additional alpha-2 adrenergic and serotonergic activity. Low doses are stimulating, higher doses opioid-like. Notably G-protein biased, causing less respiratory depression than classical opioids.',
  halfLife: { hours: 23, range: [9, 40], confidence: 'measured',
    notes: 'Formally measured in regular users (Trakulsrichai 2015) — much longer than the 4-6 h subjective duration suggests, which is why daily use accumulates and why withdrawal appears sooner than people expect.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation at C7', product: '7-Hydroxymitragynine', fraction: 0.02,
        note: 'Small in quantity but decisive: 7-OH-mitragynine is roughly 30-46x more potent at mu than mitragynine and is thought to account for much of the opioid effect. CYP3A4 inhibitors therefore change the effect qualitatively, not just quantitatively.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'O-demethylation', product: '9-O-desmethylmitragynine', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.4 }
    ],
    metabolites: [
      { name: '7-Hydroxymitragynine', active: true, halfLifeH: 2.5, potencyRel: 40,
        note: 'The potent active metabolite; also present in small amounts in the plant itself.' },
      { name: '9-O-desmethylmitragynine', active: false }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6', 'UGT'], inhibits: ['CYP2D6', 'CYP3A4'],
    excretion: 'Renal and biliary as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [4, 12], bioavailability: 0.2,
      doses: { threshold: 1000, light: [2000, 4000], common: [4000, 6000], strong: [6000, 9000], heavy: 9000, unit: 'mg',
        note: 'Dried leaf powder. Low doses (2-4 g) are stimulating; higher doses are sedating and opioid-like.' } }
  },
  warnings: [
    'Genuine physical dependence and an opioid-like withdrawal syndrome develop with daily use — this is often underestimated because it is sold as a herbal supplement.',
    'It inhibits CYP2D6 and CYP3A4, so it raises levels of many co-administered medications.',
    'Deaths involving kratom nearly always involve other depressants; combining with benzodiazepines, alcohol or opioids is the main risk.',
    'Rare but documented idiosyncratic hepatotoxicity, typically 2-8 weeks into regular use.'
  ],
  refs: ['Trakulsrichai et al. 2015, Drug Des Devel Ther', 'Kruegel & Grundmann 2018, Neuropharmacology']
},

{
  id: 'o-dsmt', name: 'O-DSMT', aliases: ['o-desmethyltramadol'],
  class: 'Opioid', family: 'Aminocyclohexanol', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'serotonergic', 'snri', 'seizure-risk', 'research-chemical',
         'respiratory-depressant', 'serotonin-syndrome-risk', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'The active opioid metabolite of tramadol, sold directly as a research chemical. It skips the CYP2D6 conversion step, so effects are consistent regardless of genotype — but it retains monoaminergic activity.',
  halfLife: { hours: 8, range: [6, 10], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'O-DSMT glucuronide', fraction: 0.6 },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N,O-didesmethyltramadol', fraction: 0.2 }
    ],
    metabolites: [{ name: 'O-DSMT glucuronide', active: false }],
    substrateOf: ['UGT2B7', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [5, 8], afterEffectsH: [3, 10], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Retains serotonin syndrome and seizure risk. Do not combine with SSRIs, SNRIs, MAOIs or DXM.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['Limited; extrapolated from tramadol M1 data']
},

{
  id: 'naloxone', name: 'Naloxone', aliases: ['narcan', 'prenoxad'],
  class: 'Opioid antagonist', family: 'Morphinan', schedule: 'Prescription / OTC in many places',
  tags: ['opioid-antagonist', 'reversal-agent', 'precipitated-withdrawal-risk'],
  mechanism: 'Competitive mu-opioid antagonist with very high affinity and no intrinsic activity. Displaces agonists from the receptor and reverses respiratory depression within minutes.',
  halfLife: { hours: 1.1, range: [0.5, 1.5], confidence: 'measured',
    notes: 'CRITICAL SAFETY POINT: naloxone is much shorter-acting than most opioids it reverses. Fentanyl, methadone and slow-release preparations all outlast it, so a revived person can stop breathing again 30-90 minutes later. Emergency services must always be called, and the person must not be left alone.' },
  metabolism: {
    firstPass: 'Almost total — oral bioavailability is under 2%, which is why it is given intranasally or by injection, and why it can be included in Suboxone to deter injection without affecting sublingual use.',
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Naloxone-3-glucuronide', fraction: 0.8 },
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Noroxymorphone', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Naloxone-3-glucuronide', active: false }],
    substrateOf: ['UGT2B7', 'CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    intranasal: { onsetMin: [1, 5], peakMin: [15, 30], durationH: [0.5, 1.5], afterEffectsH: [0.5, 2], bioavailability: 0.44,
      doses: { threshold: 0.4, light: [2, 2], common: [4, 4], strong: [8, 8], heavy: 8, unit: 'mg' } },
    im: { onsetMin: [2, 5], peakMin: [10, 20], durationH: [0.5, 1.5], afterEffectsH: [0.5, 2], bioavailability: 1.0,
      doses: { threshold: 0.4, light: [0.4, 0.8], common: [0.8, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: [
    'Always call emergency services. Naloxone wears off before the opioid does and re-sedation is common, especially with fentanyl and methadone.',
    'Precipitates immediate severe withdrawal in dependent people — unpleasant but not life-threatening, and far preferable to the alternative.',
    'Works only on opioids. It does nothing for benzodiazepine, alcohol, stimulant or GHB overdose.'
  ],
  refs: ['DrugBank DB01183', 'WHO opioid overdose guidelines']
}

]);

/* Opioids — second wave: further semi-synthetics, synthetics and antagonists */
DB.register([

{
  id: 'hydrocodone', name: 'Hydrocodone', aliases: ['vicodin', 'norco', 'lortab'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'prodrug', 'analgesic', 'antitussive', 'respiratory-depressant',
         'cns-depressant', 'cyp2d6-critical', 'constipating', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Mu-opioid agonist of roughly morphine-equivalent oral potency. Like codeine it depends substantially on CYP2D6 conversion to a far more potent metabolite.',
  halfLife: { hours: 3.8, range: [3, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Hydromorphone', fraction: 0.05,
        note: 'Small by mass but the product is ~10x more potent. CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion) noticeably reduce analgesia.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Norhydrocodone', fraction: 0.4, note: 'Main route by mass; the product is only weakly active.' },
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Hydromorphone', active: true, halfLifeH: 2.5, potencyRel: 10, note: 'Potent active metabolite.' },
      { name: 'Norhydrocodone', active: true, halfLifeH: 8, potencyRel: 0.05 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4', 'UGT2B7'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 6], bioavailability: 0.7,
      doses: { threshold: 5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Nearly all hydrocodone products contain paracetamol/acetaminophen — escalating doses reaches hepatotoxic amounts well before the opioid alone would.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['DrugBank DB00956']
},

{
  id: 'hydromorphone', name: 'Hydromorphone', aliases: ['dilaudid', 'hydro'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Potent mu agonist, roughly 4-5x oral morphine. Less histamine release than morphine, so less itching and flushing.',
  halfLife: { hours: 2.5, range: [2, 3], confidence: 'measured' },
  metabolism: {
    firstPass: 'Heavy; oral bioavailability only ~24%.',
    pathways: [
      { enzyme: 'UGT2B7', reaction: '3-O-glucuronidation', product: 'Hydromorphone-3-glucuronide', fraction: 0.85,
        note: 'Dominant route. Unlike morphine, no 6-glucuronide analgesic metabolite is formed — but H3G is strongly neuroexcitatory and accumulates in renal failure, causing myoclonus and agitation.' },
      { enzyme: 'CYP3A4', reaction: 'Minor reduction', product: 'Dihydromorphine / dihydroisomorphine', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Hydromorphone-3-glucuronide', active: false, halfLifeH: 4,
        note: 'No analgesia but markedly neuroexcitatory — associated with myoclonus, allodynia and agitation at high cumulative doses or in renal impairment.' },
      { name: 'Dihydromorphine', active: true, potencyRel: 0.8 }
    ],
    substrateOf: ['UGT2B7', 'CYP3A4'],
    excretion: 'Renal, ~7% unchanged; largely as H3G.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 30], peakMin: [45, 90], durationH: [3, 5], afterEffectsH: [2, 6], bioavailability: 0.24,
      doses: { threshold: 1, light: [2, 4], common: [4, 8], strong: [8, 16], heavy: 16, unit: 'mg' } },
    iv: { onsetMin: [0.5, 3], peakMin: [5, 15], durationH: [2, 4], afterEffectsH: [2, 6], bioavailability: 1.0,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: ['Very potent — dose errors are easy. Fatal with benzodiazepines or alcohol.'],
  refs: ['DrugBank DB00327']
},

{
  id: 'oxymorphone', name: 'Oxymorphone', aliases: ['opana'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Potent mu agonist, ~3x oral morphine, and the active metabolite of oxycodone.',
  halfLife: { hours: 9, range: [7, 11], confidence: 'measured' },
  metabolism: {
    firstPass: 'Very heavy; oral bioavailability only ~10%. Food raises it ~50%, and alcohol can cause dose dumping from some formulations.',
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Oxymorphone-3-glucuronide', fraction: 0.7 },
      { enzyme: 'Ketone reductase', reaction: '6-keto reduction', product: '6-OH-oxymorphone', fraction: 0.15, note: 'Active.' }
    ],
    metabolites: [
      { name: 'Oxymorphone-3-glucuronide', active: false, halfLifeH: 10 },
      { name: '6-OH-oxymorphone', active: true, potencyRel: 0.6 }
    ],
    substrateOf: ['UGT2B7'],
    excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [45, 90], durationH: [4, 6], afterEffectsH: [2, 6], bioavailability: 0.1,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Notably low and food-dependent oral bioavailability makes effects erratic between doses.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['DrugBank DB01192']
},

{
  id: 'tapentadol', name: 'Tapentadol', aliases: ['nucynta', 'palexia'],
  class: 'Opioid', family: 'Benzenoid', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'snri', 'norepinephrine-reuptake-inhibitor', 'seizure-risk',
         'serotonin-syndrome-risk', 'respiratory-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Dual mu agonist and noradrenaline reuptake inhibitor. Unlike tramadol it is active as given — no CYP2D6 conversion needed — so effects are consistent across genotypes.',
  halfLife: { hours: 4, range: [3.5, 5], confidence: 'measured' },
  metabolism: {
    firstPass: 'Heavy; oral bioavailability ~32%.',
    pathways: [
      { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation', product: 'Tapentadol-O-glucuronide', fraction: 0.7,
        note: 'Dominant and, importantly, non-CYP — so tapentadol avoids most of the CYP interactions that plague tramadol and codeine.' },
      { enzyme: 'CYP2C9 / CYP2C19', reaction: 'Minor oxidation', product: 'N-desmethyltapentadol', fraction: 0.13 }
    ],
    metabolites: [{ name: 'Tapentadol-O-glucuronide', active: false }, { name: 'N-desmethyltapentadol', active: false }],
    substrateOf: ['UGT1A9', 'UGT2B7', 'CYP2C9'],
    excretion: 'Renal, ~99% as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 6], bioavailability: 0.32,
      doses: { threshold: 25, light: [50, 75], common: [75, 150], strong: [150, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: [
    'Noradrenergic activity lowers the seizure threshold; contraindicated with MAOIs.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['DrugBank DB06204']
},

{
  id: 'dihydrocodeine', name: 'Dihydrocodeine', aliases: ['dhc', 'df118'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II-V (varies)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'antitussive', 'respiratory-depressant',
         'cns-depressant', 'constipating', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Semi-synthetic codeine analogue, roughly twice as potent. Unlike codeine it retains meaningful intrinsic mu activity, so CYP2D6 status matters less.',
  halfLife: { hours: 4, range: [3.5, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Dihydrocodeine-6-glucuronide', fraction: 0.6 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Dihydromorphine', fraction: 0.05, note: 'Potent active metabolite, though a smaller contributor than morphine is for codeine.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nordihydrocodeine', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Dihydromorphine', active: true, halfLifeH: 3, potencyRel: 10 },
      { name: 'Nordihydrocodeine', active: false }
    ],
    substrateOf: ['UGT2B7', 'CYP2D6', 'CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 6], bioavailability: 0.2,
      doses: { threshold: 15, light: [30, 60], common: [60, 120], strong: [120, 240], heavy: 240, unit: 'mg' } }
  },
  warnings: ['Frequently combined with paracetamol. Fatal with benzodiazepines or alcohol.'],
  refs: ['DrugBank DB01551']
},

{
  id: 'pethidine', name: 'Pethidine', aliases: ['meperidine', 'demerol'],
  class: 'Opioid', family: 'Phenylpiperidine', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'serotonergic', 'seizure-risk', 'serotonin-syndrome-risk',
         'mao-contraindicated', 'respiratory-depressant', 'neurotoxic-metabolite', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Mu agonist with serotonin reuptake inhibition and local anaesthetic activity. Now largely abandoned clinically because of its neurotoxic metabolite.',
  halfLife: { hours: 3.5, range: [3, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'N-demethylation', product: 'Norpethidine', fraction: 0.4,
        note: 'Produces a NEUROTOXIC metabolite with a 15-30 h half-life that accumulates with repeated dosing and in renal impairment.' },
      { enzyme: 'CES1', reaction: 'Ester hydrolysis', product: 'Pethidinic acid', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Norpethidine', active: true, halfLifeH: 20, potencyRel: 0.5,
        note: 'Half the analgesia but twice the convulsant activity of the parent. Accumulation causes tremor, myoclonus and seizures — naloxone does NOT reverse this and may worsen it.' },
      { name: 'Pethidinic acid', active: false }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CES1'], excretion: 'Renal; acidification speeds it.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 120], durationH: [2, 4], afterEffectsH: [2, 6], bioavailability: 0.5,
      doses: { threshold: 25, light: [50, 75], common: [75, 150], strong: [150, 250], heavy: 250, unit: 'mg' } },
    im: { onsetMin: [5, 15], peakMin: [30, 60], durationH: [2, 4], afterEffectsH: [2, 6], bioavailability: 1.0,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: [
    'Pethidine plus an MAOI causes a distinctive and frequently fatal reaction — the classic case that established the MAOI-opioid contraindication. Morphine and fentanyl do not share this to the same degree.',
    'Norpethidine accumulation causes seizures that opioid antagonists cannot reverse.',
    'Serotonin syndrome risk with SSRIs and other serotonergics.'
  ],
  refs: ['DrugBank DB00454', 'Gillman 2005, Br J Anaesth']
},

{
  id: 'isotonitazene', name: 'Isotonitazene', aliases: ['iso', 'nitazene'],
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'extreme-potency',
         'high-overdose-risk', 'highly-addictive', 'cns-depressant'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Benzimidazole opioid from 1950s research, never marketed. Estimated to be substantially more potent than fentanyl at the mu receptor.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue', notes: 'No human PK data whatsoever. Estimated from in-vitro work and case reports.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-deethylation', product: 'N-desethyl-isotonitazene', fraction: 0.4, note: 'Identified in human hepatocyte studies; presumed active.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'N-dealkylation and hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: 'N-desethyl-isotonitazene', active: true, halfLifeH: 5, potencyRel: 0.5, note: 'Presumed active; the main urinary marker.' }],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal, as conjugates.', confidence: 'unknown'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [2, 5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 0.005, light: [0.01, 0.03], common: [0.03, 0.08], strong: [0.08, 0.15], heavy: 0.15, unit: 'mg',
        note: 'MICROGRAM range. These figures are extrapolations, not measurements — no safe dosing information exists.' } }
  },
  warnings: [
    'Active in micrograms and estimated more potent than fentanyl. There is no way to measure a dose safely outside a laboratory.',
    'Increasingly found in counterfeit tablets and in heroin, often unknown to the user. It frequently requires repeated, larger naloxone doses to reverse.',
    'Every value here is an estimate; treat this entry as a warning rather than a dosing reference.'
  ],
  refs: ['Blanckaert et al. 2020, Drug Test Anal', 'EMCDDA nitazene risk assessments']
},

{
  id: 'u-47700', name: 'U-47700', aliases: ['pink', 'u4'],
  class: 'Opioid', family: 'Benzamide', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant',
         'high-overdose-risk', 'highly-addictive', 'cns-depressant'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Selective mu agonist developed by Upjohn in the 1970s, roughly 7-8x morphine potency. Never tested in humans before appearing on the research chemical market.',
  halfLife: { hours: 3, range: [1.5, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'N-desmethylation', product: 'N-desmethyl-U-47700', fraction: 0.4, note: 'Active metabolite identified in human urine.' },
      { enzyme: 'CYP2D6', reaction: 'Di-desmethylation', product: 'N,N-didesmethyl-U-47700', fraction: 0.25 }
    ],
    metabolites: [{ name: 'N-desmethyl-U-47700', active: true, halfLifeH: 4, potencyRel: 0.5 }],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [1.5, 3], afterEffectsH: [2, 6], bioavailability: 0.8,
      doses: { threshold: 0.3, light: [0.5, 2], common: [2, 5], strong: [5, 10], heavy: 10, unit: 'mg' } }
  },
  warnings: [
    'Implicated in dozens of deaths within a few years of appearing. Short duration encourages rapid redosing.',
    'No human safety data of any kind existed before it was sold.'
  ],
  refs: ['Rohrig et al. 2018, J Anal Toxicol', 'Krotulski et al. 2018']
},

{
  id: 'loperamide', name: 'Loperamide', aliases: ['imodium'],
  class: 'Opioid', family: 'Phenylpiperidine', schedule: 'OTC',
  tags: ['opioid', 'mu-agonist', 'peripheral', 'qt-prolonging', 'cardiotoxic', 'constipating'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Mu agonist that is normally confined to the gut: P-glycoprotein actively pumps it back out of the brain, so it treats diarrhoea without causing euphoria. At very high doses, or with a P-gp inhibitor, that barrier is overwhelmed.',
  halfLife: { hours: 11, range: [9, 14], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extreme; oral bioavailability under 1%.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N-desmethylloperamide', fraction: 0.5 },
      { enzyme: 'CYP2C8', reaction: 'Oxidative demethylation', product: 'N-desmethylloperamide', fraction: 0.3 },
      { enzyme: 'P-glycoprotein (efflux, not metabolism)', reaction: 'Active transport out of the CNS and back into the gut lumen', product: 'Unchanged loperamide', fraction: 0.9,
        note: 'The single most important disposition step. P-gp inhibitors — quinidine, ritonavir, verapamil, grapefruit — let loperamide reach the brain, which is exactly what people attempting to get high exploit, and exactly what kills them.' }
    ],
    metabolites: [{ name: 'N-desmethylloperamide', active: false }],
    substrateOf: ['CYP3A4', 'CYP2C8', 'P-gp'], inhibits: [],
    excretion: 'Mostly faecal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 150], peakMin: [180, 300], durationH: [8, 12], afterEffectsH: [6, 24], bioavailability: 0.01,
      doses: { threshold: 2, light: [4, 8], common: [8, 16], strong: [16, 24], heavy: 24, unit: 'mg',
        note: 'Therapeutic maximum is 16 mg/day. The doses used in attempts at misuse (100-400 mg) are cardiotoxic.' } }
  },
  warnings: [
    'High-dose loperamide blocks cardiac sodium and potassium channels, causing QT prolongation, torsades de pointes and fatal arrhythmias. This has killed otherwise healthy people, often those self-treating opioid withdrawal.',
    'Cardiotoxicity is not reversed by naloxone.',
    'Combining it with a P-gp inhibitor to force CNS entry is especially dangerous.'
  ],
  refs: ['Eggleston et al. 2017, Ann Emerg Med', 'FDA Drug Safety Communication 2016']
},

{
  id: 'naltrexone', name: 'Naltrexone', aliases: ['revia', 'vivitrol'],
  class: 'Opioid antagonist', family: 'Morphinan', schedule: 'Prescription',
  tags: ['opioid-antagonist', 'precipitated-withdrawal-risk', 'long-duration', 'hepatotoxic-high-dose'],
  mechanism: 'Long-acting competitive mu antagonist used to maintain abstinence from opioids and to reduce alcohol craving. Unlike naloxone it is orally active.',
  halfLife: { hours: 4, range: [3, 5], confidence: 'measured',
    notes: 'The parent is short-lived but the active metabolite 6-beta-naltrexol has a 13 h half-life, and receptor blockade lasts 24-72 hours depending on dose.' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability 5-40%.',
    pathways: [
      { enzyme: 'Dihydrodiol dehydrogenase (AKR1C)', reaction: 'Reduction of the 6-keto group', product: '6-beta-naltrexol', fraction: 0.8,
        note: 'Non-CYP, so naltrexone has few classic drug interactions.' },
      { enzyme: 'UGT1A1 / UGT2B7', reaction: 'Glucuronidation', product: 'Naltrexone-3-glucuronide', fraction: 0.15 }
    ],
    metabolites: [{ name: '6-beta-naltrexol', active: true, halfLifeH: 13, potencyRel: 0.3,
      note: 'Active antagonist; the main circulating species and the reason blockade outlasts the parent drug.' }],
    substrateOf: ['AKR1C', 'UGT1A1'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [24, 48], afterEffectsH: [12, 48], bioavailability: 0.2,
      doses: { threshold: 1, light: [12.5, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Precipitates immediate severe withdrawal if any opioid is on board — a 7-10 day opioid-free period is required before starting.',
    'Blocks opioid analgesia entirely, which matters in an emergency; medical ID is advisable.',
    'The most dangerous period is AFTER stopping naltrexone — receptors are upregulated and tolerance is gone, so a previously normal dose can be fatal.'
  ],
  refs: ['DrugBank DB00704']
}

]);

/* Novel synthetic opioids — fentanyl analogues, nitazenes, benzimidazolones.
   Almost nothing in this file has human pharmacokinetic data. Potencies come
   from in-vitro receptor assays and animal work; half-lives are extrapolated.
   These entries exist primarily as reference and warning, not as dosing guides. */
DB.register([

/* ================= Fentanyl analogues ================= */
{
  id: 'carfentanil', name: 'Carfentanil', aliases: ['carfentanyl', 'wildnil'],
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'chest-wall-rigidity', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Ultra-potent mu agonist developed as a large-animal tranquilliser — it is used to immobilise elephants. Roughly 10,000× morphine and 100× fentanyl.',
  halfLife: { hours: 6, range: [3, 12], confidence: 'analogue',
    notes: 'No human PK data. Veterinary and animal studies suggest a longer duration than fentanyl, which matters because it substantially outlasts naloxone.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Norcarfentanil', fraction: 0.6,
        note: 'Main route; the product is inactive and is the urinary marker. Detection requires a dedicated assay — routine opiate screens miss it entirely.' },
      { enzyme: 'CES1 / esterases', reaction: 'Methyl ester hydrolysis', product: 'Carfentanil acid', fraction: 0.2 },
      { enzyme: 'CYP3A4', reaction: 'Monohydroxylation', product: 'Hydroxycarfentanil', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Norcarfentanil', active: false, halfLifeH: 8, note: 'Inactive; principal urinary marker.' },
      { name: 'Carfentanil acid', active: false, halfLifeH: 6 },
      { name: 'Hydroxycarfentanil', active: true, halfLifeH: 6, potencyRel: 0.2, note: 'Presumed weakly active.' }
    ],
    substrateOf: ['CYP3A4', 'CES1'], excretion: 'Renal, as metabolites.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [0.5, 3], peakMin: [5, 15], durationH: [2, 6], afterEffectsH: [2, 12], bioavailability: 0.8,
      doses: { threshold: 0.0002, light: [0.0005, 0.001], common: [0.001, 0.002], strong: [0.002, 0.004], heavy: 0.004, unit: 'mg',
        note: 'MICROGRAM range — around 1-2 µg. These figures are extrapolations from animal potency, not human data. No consumer equipment can measure this.' } }
  },
  warnings: [
    'Approximately 10,000× morphine. A visually invisible quantity is a lethal dose. There is no safe way to handle or measure it outside a laboratory.',
    'Appears as an adulterant in heroin and counterfeit pills. Uneven mixing means dose per unit is entirely unpredictable.',
    'Outlasts naloxone considerably — repeated large doses are needed and re-sedation after apparent recovery is expected.',
    'Causes chest wall rigidity that can prevent ventilation even with a bag-valve mask.'
  ],
  refs: ['Leen & Juurlink 2019, Clin Toxicol', 'Uddayasankar et al. 2018, Clin Toxicol']
},

{
  id: 'acetylfentanyl', name: 'Acetylfentanyl',
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Fentanyl analogue lacking one methylene group; roughly 15× morphine, so notably weaker than fentanyl but far stronger than heroin.',
  halfLife: { hours: 3, range: [1.5, 6], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: '4-ANPP (despropionylfentanyl)', fraction: 0.5,
        note: '4-ANPP is the shared terminal marker of the whole fentanyl family and also a synthesis precursor — its presence indicates fentanyl-class exposure generally.' },
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis', product: 'Acetyl-norfentanyl', fraction: 0.25 },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'Hydroxylation', product: 'Hydroxyacetylfentanyl', fraction: 0.15 }
    ],
    metabolites: [
      { name: '4-ANPP', active: false, halfLifeH: 5, note: 'Inactive marker common to fentanyl analogues.' },
      { name: 'Acetyl-norfentanyl', active: false, halfLifeH: 4 },
      { name: 'Hydroxyacetylfentanyl', active: true, halfLifeH: 4, potencyRel: 0.2 }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 0.05, light: [0.1, 0.3], common: [0.3, 0.8], strong: [0.8, 1.5], heavy: 1.5, unit: 'mg' } }
  },
  warnings: [
    'Caused large clusters of deaths on first appearing, in users who believed they had heroin.',
    'CYP3A4 inhibitors (ritonavir, clarithromycin, grapefruit) raise exposure substantially.',
    'Not detected by standard opiate immunoassays.'
  ],
  refs: ['Melent\'ev et al. 2015, Forensic Sci Int', 'CDC MMWR acetylfentanyl reports']
},

{
  id: 'furanylfentanyl', name: 'Furanylfentanyl', aliases: ['fu-f'],
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Fentanyl analogue with a furan ring; estimated roughly one fifth of fentanyl\'s potency, still around 20× morphine.',
  halfLife: { hours: 2.5, range: [1, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CES1 / amidases', reaction: 'Amide hydrolysis', product: '4-ANPP', fraction: 0.55,
        note: 'Unusually for the family, hydrolysis dominates over CYP oxidation — 4-ANPP is by far the main metabolite and the primary detection target.' },
      { enzyme: 'CYP3A4', reaction: 'Dihydrodiol formation on the furan ring', product: 'Furanylfentanyl dihydrodiol', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.15 }
    ],
    metabolites: [
      { name: '4-ANPP', active: false, halfLifeH: 5, note: 'Main metabolite; shared across the fentanyl family.' },
      { name: 'Furanylfentanyl dihydrodiol', active: false, halfLifeH: 4 }
    ],
    substrateOf: ['CES1', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [1, 3], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 0.05, light: [0.1, 0.25], common: [0.25, 0.6], strong: [0.6, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: [
    'Short duration encourages rapid redosing, which is how most overdoses on this compound occur.',
    'Widely implicated in death clusters across Europe and North America.'
  ],
  refs: ['Watanabe et al. 2017, AAPS J', 'EMCDDA furanylfentanyl risk assessment']
},

{
  id: 'cyclopropylfentanyl', name: 'Cyclopropylfentanyl',
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'extreme-potency', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Fentanyl analogue with a cyclopropyl acyl group; in-vitro potency is comparable to or slightly above fentanyl itself.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: '4-ANPP', fraction: 0.45 },
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis', product: 'Cyclopropyl-norfentanyl', fraction: 0.3 },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the cyclopropyl ring', product: 'Hydroxycyclopropylfentanyl', fraction: 0.15 }
    ],
    metabolites: [
      { name: '4-ANPP', active: false, halfLifeH: 5 },
      { name: 'Cyclopropyl-norfentanyl', active: false, halfLifeH: 5, note: 'Main urinary marker.' },
      { name: 'Hydroxycyclopropylfentanyl', active: true, halfLifeH: 5, potencyRel: 0.2 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [0.5, 4], peakMin: [8, 20], durationH: [2, 5], afterEffectsH: [2, 10], bioavailability: 0.8,
      doses: { threshold: 0.01, light: [0.02, 0.05], common: [0.05, 0.12], strong: [0.12, 0.2], heavy: 0.2, unit: 'mg' } }
  },
  warnings: [
    'Fentanyl-level potency in the microgram-to-low-milligram range. Associated with a large number of deaths in 2017-2018.',
    'Longer-acting than fentanyl, so re-sedation after naloxone is especially likely.'
  ],
  refs: ['Kanamori et al. 2018, J Anal Toxicol', 'EMCDDA cyclopropylfentanyl report']
},

{
  id: 'sufentanil', name: 'Sufentanil', aliases: ['dsuvia', 'sufenta'],
  class: 'Opioid', family: 'Anilidopiperidine', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'chest-wall-rigidity', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Clinically used ultra-potent mu agonist, roughly 500-1000× morphine and 5-10× fentanyl. Highly lipophilic with very rapid CNS entry.',
  halfLife: { hours: 2.7, range: [2, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Norsufentanil', fraction: 0.6, note: 'Inactive; main clearance route.' },
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: 'Desmethylsufentanil', fraction: 0.2, note: 'Retains roughly 10% of parent activity.' }
    ],
    metabolites: [
      { name: 'Norsufentanil', active: false, halfLifeH: 4 },
      { name: 'Desmethylsufentanil', active: true, halfLifeH: 4, potencyRel: 0.1 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal ~80%, faecal ~10%.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [0.2, 1], peakMin: [1, 5], durationH: [0.5, 1.5], afterEffectsH: [1, 4], bioavailability: 1.0,
      doses: { threshold: 0.001, light: [0.005, 0.01], common: [0.01, 0.025], strong: [0.025, 0.05], heavy: 0.05, unit: 'mg' } },
    sublingual: { onsetMin: [10, 20], peakMin: [30, 60], durationH: [2, 4], afterEffectsH: [1, 6], bioavailability: 0.5,
      doses: { threshold: 0.005, light: [0.01, 0.015], common: [0.015, 0.03], strong: [0.03, 0.06], heavy: 0.06, unit: 'mg' } }
  },
  warnings: [
    'Clinical use is confined to anaesthesia and monitored settings for good reason — respiratory arrest at therapeutic doses is routine and expected.',
    'CYP3A4 inhibitors substantially raise exposure.'
  ],
  refs: ['DrugBank DB00708', 'Scholz et al. 1996, Clin Pharmacokinet']
},

{
  id: 'remifentanil', name: 'Remifentanil', aliases: ['ultiva'],
  class: 'Opioid', family: 'Anilidopiperidine', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'ultra-short-acting', 'chest-wall-rigidity'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 2,
  mechanism: 'Fentanyl analogue engineered with an ester linkage so that plasma esterases destroy it almost immediately, giving a duration independent of infusion length.',
  halfLife: { hours: 0.06, range: [0.05, 0.13], confidence: 'measured',
    notes: 'Around 3-4 minutes, and — uniquely among opioids — its context-sensitive half-time stays flat no matter how long the infusion has run, because clearance does not depend on liver or kidney function.' },
  metabolism: {
    pathways: [
      { enzyme: 'Non-specific plasma and tissue esterases', reaction: 'Ester hydrolysis', product: 'Remifentanil acid (GR90291)', fraction: 0.98,
        note: 'Independent of liver, kidney and CYP entirely — so it is unaffected by CYP interactions and safe in organ failure. This is the whole design rationale.' }
    ],
    metabolites: [{ name: 'Remifentanil acid', active: true, halfLifeH: 1.5, potencyRel: 0.0003,
      note: 'Roughly 1/4600 the potency of the parent — effectively inactive, though it accumulates in renal failure.' }],
    substrateOf: ['CES1'], excretion: 'Renal, as the acid metabolite.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [0.2, 1], peakMin: [1, 2], durationH: [0.05, 0.2], afterEffectsH: [0.1, 0.5], bioavailability: 1.0,
      doses: { threshold: 0.01, light: [0.025, 0.05], common: [0.05, 0.1], strong: [0.1, 0.2], heavy: 0.2, unit: 'mg' } }
  },
  warnings: [
    'Effects vanish within minutes of stopping, leaving no residual analgesia — but also causes profound acute tolerance and opioid-induced hyperalgesia.',
    'Anaesthesia-only drug; apnoea at clinical doses is expected.'
  ],
  refs: ['DrugBank DB00899', 'Egan 1995, Clin Pharmacokinet']
},

/* ================= Nitazenes (benzimidazole opioids) ================= */
{
  id: 'metonitazene', name: 'Metonitazene',
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Benzimidazole opioid from 1950s CIBA research, never marketed. In-vitro potency is estimated at several hundred times morphine, comparable to or above fentanyl.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue', notes: 'No human PK data. Case reports suggest a longer duration than fentanyl.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-deethylation', product: 'N-desethyl metonitazene', fraction: 0.4,
        note: 'Produces an ACTIVE metabolite — several nitazene N-desethyl metabolites retain substantial mu agonism, which prolongs the intoxication well past the parent.' },
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: 'O-desmethyl metonitazene', fraction: 0.25, note: 'Presumed active.' },
      { enzyme: 'NAT / nitroreductase', reaction: 'Nitro group reduction', product: 'Amino-metonitazene', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desethyl metonitazene', active: true, halfLifeH: 6, potencyRel: 0.7,
        note: 'Active and longer-lived than the parent. A principal reason nitazene overdoses recur after naloxone wears off.' },
      { name: 'O-desmethyl metonitazene', active: true, halfLifeH: 5, potencyRel: 0.3 },
      { name: 'Amino-metonitazene', active: false, halfLifeH: 5, note: 'Urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.005, light: [0.01, 0.03], common: [0.03, 0.07], strong: [0.07, 0.15], heavy: 0.15, unit: 'mg',
        note: 'Extrapolated from receptor assays and case reports. No validated human dosing information exists.' } }
  },
  warnings: [
    'Microgram-active and increasingly found in counterfeit oxycodone and alprazolam tablets, and in heroin — usually unknown to the user.',
    'Its active metabolite outlasts naloxone by hours. Repeated naloxone doses and prolonged observation are typically required.',
    'Every number in this entry is an estimate.'
  ],
  refs: ['Krotulski et al. 2021, J Anal Toxicol', 'Vandeputte et al. 2021, Arch Toxicol']
},

{
  id: 'protonitazene', name: 'Protonitazene',
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Propoxy homologue of isotonitazene; in-vitro assays place it among the more potent members of the nitazene family.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-deethylation', product: 'N-desethyl protonitazene', fraction: 0.4, note: 'Active metabolite.' },
      { enzyme: 'CYP3A4', reaction: 'O-depropylation', product: 'O-desalkyl protonitazene', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desethyl protonitazene', active: true, halfLifeH: 6, potencyRel: 0.7 },
      { name: 'O-desalkyl protonitazene', active: false, halfLifeH: 5, note: 'Urinary marker.' }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.005, light: [0.01, 0.025], common: [0.025, 0.06], strong: [0.06, 0.12], heavy: 0.12, unit: 'mg' } }
  },
  warnings: [
    'Microgram-active. Same active-metabolite problem as the rest of the nitazene family — effects outlast naloxone.',
    'All figures are extrapolations from in-vitro potency.'
  ],
  refs: ['Vandeputte et al. 2022, Arch Toxicol', 'NPS Discovery reports']
},

{
  id: 'etodesnitazene', name: 'Etodesnitazene', aliases: ['etazene', 'desnitroetonitazene'],
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Nitazene lacking the nitro group, which reduces potency considerably relative to isotonitazene — estimated in the region of 10-70× morphine rather than several hundred.',
  halfLife: { hours: 4, range: [2, 7], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-deethylation', product: 'N-desethyl etodesnitazene', fraction: 0.45, note: 'Active.' },
      { enzyme: 'CYP3A4', reaction: 'O-deethylation', product: 'O-desethyl etodesnitazene', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desethyl etodesnitazene', active: true, halfLifeH: 6, potencyRel: 0.6 },
      { name: 'O-desethyl etodesnitazene', active: false, halfLifeH: 5 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.05, light: [0.1, 0.4], common: [0.4, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: [
    'Being weaker than isotonitazene does not make it safe — it is still an uncharacterised synthetic opioid with no human data.',
    'Sold openly online in some jurisdictions on the basis of not being explicitly scheduled.'
  ],
  refs: ['Vandeputte et al. 2021, Arch Toxicol']
},

/* ================= Benzimidazolone opioids (brorphine family) ================= */
{
  id: 'brorphine', name: 'Brorphine',
  class: 'Opioid', family: 'Piperidine benzimidazolone', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Structurally unrelated to both fentanyl and the nitazenes — a piperidine benzimidazolone. A potent, highly efficacious mu agonist with in-vitro potency in the region of fentanyl.',
  halfLife: { hours: 5, range: [2, 10], confidence: 'analogue',
    notes: 'No human PK data. Case series suggest a longer duration than fentanyl.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation of the piperidine', product: 'Nor-brorphine', fraction: 0.4,
        note: 'Identified in human hepatocyte incubations; presumed to retain some activity.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'Hydroxylation of the benzimidazolone', product: 'Hydroxybrorphine', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Nor-brorphine', active: true, halfLifeH: 6, potencyRel: 0.4, note: 'Presumed active.' },
      { name: 'Hydroxybrorphine', active: false, halfLifeH: 5, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 6], peakMin: [10, 30], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.05, light: [0.1, 0.3], common: [0.3, 0.8], strong: [0.8, 1.5], heavy: 1.5, unit: 'mg' } }
  },
  warnings: [
    'Halogen-swapped analogues circulate — the chloro ("chlorphine") and fluoro ("fluorphine") variants among them. These have even less data than brorphine itself, which already has essentially none, and potency is not predictable from the halogen.',
    'Rose rapidly in overdose fatality statistics in the US in 2020-2021 before scheduling.',
    'Not detected by standard opiate or fentanyl immunoassays.'
  ],
  refs: ['Vandeputte et al. 2020, Front Pharmacol', 'Krotulski et al. 2021, J Anal Toxicol']
},

{
  id: 'desomorphine', name: 'Desomorphine', aliases: ['krokodil', 'dihydrodesoxymorphine'],
  class: 'Opioid', family: 'Morphinan', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'respiratory-depressant', 'cns-depressant', 'highly-addictive',
         'high-overdose-risk', 'tissue-necrosis'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Semi-synthetic morphinan roughly 8-10× morphine with a very fast onset and short duration. Notorious less for its own pharmacology than for how it is made.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Desomorphine glucuronide', fraction: 0.7 },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nordesomorphine', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Desomorphine glucuronide', active: false, halfLifeH: 3 },
      { name: 'Nordesomorphine', active: true, halfLifeH: 3, potencyRel: 0.3 }
    ],
    substrateOf: ['UGT2B7', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    iv: { onsetMin: [0.2, 2], peakMin: [2, 8], durationH: [1, 2.5], afterEffectsH: [1, 4], bioavailability: 1.0,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'The "krokodil" harm is not desomorphine itself but the crude home synthesis from codeine using red phosphorus, iodine and organic solvents. Injecting the unpurified product causes severe tissue necrosis, gangrene, bone destruction and amputation.',
    'Very short duration drives dosing every few hours around the clock.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  refs: ['Gahr et al. 2012, Am J Psychiatry', 'Grund et al. 2013, Int J Drug Policy']
}

]);

/* Novel synthetic opioids, second wave — pyrrolidino nitazenes, further fentanyl
   analogues, AP-237 family, U-series and MT-45.
   Potencies here come from in-vitro receptor assays and rodent work. None of
   these has human pharmacokinetic data. Dose ladders are extrapolations. */
DB.register([

/* ================= Pyrrolidino nitazenes ================= */
{
  id: 'etonitazepyne', name: 'Etonitazepyne', aliases: ['n-pyrrolidino etonitazene', 'npp'],
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'I (US) / WHO-scheduled',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Cyclic (pyrrolidinyl) analogue of etonitazene. Binds mu with Ki 4.09 nM and activates it with EC50 0.348 nM — essentially equal to etonitazene, and roughly 40× the potency of fentanyl in the same assay. In rodent analgesia testing it is about 10× fentanyl and 2000× morphine.',
  halfLife: { hours: 5, range: [2, 10], confidence: 'analogue',
    notes: 'No human PK data. Forensic case series show prolonged intoxication; the figure is extrapolated from the nitazene class.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-deethylation', product: 'O-desethyl etonitazepyne', fraction: 0.35,
        note: 'Identified in human hepatocyte incubations; a principal urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Pyrrolidine ring hydroxylation', product: 'Hydroxy-etonitazepyne', fraction: 0.25,
        note: 'Presumed to retain mu activity, as with other nitazene metabolites.' },
      { enzyme: 'Nitroreductase', reaction: 'Nitro group reduction', product: 'Amino-etonitazepyne', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'O-desethyl etonitazepyne', active: true, halfLifeH: 7, potencyRel: 0.5, fraction: 0.35,
        note: 'Active and longer-lived than the parent — part of why these compounds outlast naloxone.' },
      { name: 'Hydroxy-etonitazepyne', active: true, halfLifeH: 6, potencyRel: 0.3, fraction: 0.25 },
      { name: 'Amino-etonitazepyne', active: false, halfLifeH: 6, fraction: 0.15, note: 'Urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.002, light: [0.005, 0.015], common: [0.015, 0.04], strong: [0.04, 0.08], heavy: 0.08, unit: 'mg',
        note: 'MICROGRAM range, extrapolated from receptor assays and rodent ED50. There is no validated human dosing information and no consumer equipment can measure this.' } }
  },
  warnings: [
    'Approximately 40× fentanyl in receptor activation assays. A dose is a few micrograms — visually indistinguishable from nothing.',
    'Active metabolites outlast naloxone. Repeated large naloxone doses and prolonged observation are required; re-sedation after apparent recovery is expected.',
    'Implicated in forensic death case series across Europe and North America.',
    'Every number in this entry is an extrapolation, not a measurement.'
  ],
  sources: ['Vandeputte et al. 2022, Arch Toxicol (pharmacological evaluation and forensic case series)', 'WHO ECDD 45th critical review']
},

{
  id: 'isotonitazepyne', name: 'Isotonitazepyne', aliases: ['n-pyrrolidino isotonitazene', 'npi'],
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'I (US) / WHO-scheduled',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Pyrrolidinyl analogue of isotonitazene. Binds mu with high affinity (ED50 0.25 nM) and activates it as a FULL agonist at a potency at least five-fold above fentanyl. Rodent analgesia lasts around 45 minutes and is naloxone-reversible.',
  halfLife: { hours: 4, range: [2, 9], confidence: 'analogue',
    notes: 'No human PK data. Reviewed by the WHO ECDD; case identifications exist but no kinetic study.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-deisopropylation', product: 'O-desalkyl isotonitazepyne', fraction: 0.35, note: 'Principal urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Pyrrolidine ring hydroxylation', product: 'Hydroxy-isotonitazepyne', fraction: 0.25, note: 'Presumed active.' },
      { enzyme: 'Nitroreductase', reaction: 'Nitro reduction', product: 'Amino-isotonitazepyne', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Hydroxy-isotonitazepyne', active: true, halfLifeH: 6, potencyRel: 0.4, fraction: 0.25 },
      { name: 'O-desalkyl isotonitazepyne', active: false, halfLifeH: 6, fraction: 0.35 },
      { name: 'Amino-isotonitazepyne', active: false, halfLifeH: 6, fraction: 0.15 }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.003, light: [0.005, 0.02], common: [0.02, 0.05], strong: [0.05, 0.1], heavy: 0.1, unit: 'mg',
        note: 'MICROGRAM range, extrapolated from in-vitro potency. No validated human dosing data exists.' } }
  },
  warnings: [
    'A full mu agonist at least five times more potent than fentanyl. Doses are single-digit micrograms.',
    'Detected post-mortem alongside fluetonitazepyne in Finnish casework — this family is actively causing deaths.',
    'Not detected by standard opiate or fentanyl immunoassays.',
    'All figures are extrapolations.'
  ],
  sources: ['WHO ECDD 48th critical review, N-pyrrolidino isotonitazene', 'Kriikku et al. 2025, Drug Test Anal (post-mortem findings)']
},

{
  id: 'fluetonitazepyne', name: 'Fluetonitazepyne', aliases: ['n-pyrrolidino fluetonitazene'],
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Fluorinated pyrrolidinyl nitazene, part of the same wave as etonitazepyne and isotonitazepyne. Potent mu agonist; specific potency relative to fentanyl is not well established.',
  halfLife: { hours: 4, range: [2, 9], confidence: 'analogue', notes: 'No human PK data. Identified in post-mortem casework.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-deethylation', product: 'O-desethyl fluetonitazepyne', fraction: 0.35 },
      { enzyme: 'CYP3A4', reaction: 'Pyrrolidine hydroxylation', product: 'Hydroxy-fluetonitazepyne', fraction: 0.25, note: 'Presumed active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Hydroxy-fluetonitazepyne', active: true, halfLifeH: 6, potencyRel: 0.4, fraction: 0.25 },
      { name: 'O-desethyl fluetonitazepyne', active: false, halfLifeH: 6, fraction: 0.35 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.003, light: [0.005, 0.02], common: [0.02, 0.05], strong: [0.05, 0.1], heavy: 0.1, unit: 'mg' } }
  },
  warnings: [
    'Identified in post-mortem toxicology alongside isotonitazepyne. Microgram-active with no human data whatsoever.',
    'Not detected by routine immunoassays.'
  ],
  sources: ['Kriikku et al. 2025, Drug Test Anal (post-mortem identification)']
},

{
  id: 'n-desethyl-isotonitazene', name: 'N-desethyl isotonitazene',
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Originally identified as the active metabolite of isotonitazene, now sold and detected as a drug in its own right. A potent full mu agonist.',
  halfLife: { hours: 6, range: [3, 12], confidence: 'analogue',
    notes: 'Longer-lived than isotonitazene itself, which is why it dominates the late phase of a nitazene intoxication.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-deisopropylation', product: 'O-desalkyl-N-desethyl isotonitazene', fraction: 0.4 },
      { enzyme: 'Nitroreductase', reaction: 'Nitro reduction', product: 'Amino metabolite', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'O-desalkyl-N-desethyl isotonitazene', active: false, halfLifeH: 7, fraction: 0.4, note: 'Urinary marker.' },
      { name: 'Amino-N-desethyl isotonitazene', active: false, halfLifeH: 7, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 6], peakMin: [10, 30], durationH: [4, 8], afterEffectsH: [4, 14], bioavailability: 0.8,
      doses: { threshold: 0.005, light: [0.01, 0.03], common: [0.03, 0.07], strong: [0.07, 0.15], heavy: 0.15, unit: 'mg' } }
  },
  warnings: [
    'Became one of the most frequently detected nitazenes in overdose casework after isotonitazene was scheduled.',
    'Its long half-life relative to naloxone makes re-sedation after reversal especially likely.'
  ],
  sources: ['CFSRE NPS Discovery reports', 'Vandeputte et al., Arch Toxicol']
},

{
  id: 'butonitazene', name: 'Butonitazene',
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Butoxy nitazene analogue. Notably less potent than isotonitazene or the pyrrolidino series — in-vitro roughly in the morphine-to-low-fentanyl range rather than far above it.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-debutylation', product: 'O-desalkyl butonitazene', fraction: 0.4 },
      { enzyme: 'CYP3A4', reaction: 'N-deethylation', product: 'N-desethyl butonitazene', fraction: 0.25, note: 'Presumed active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desethyl butonitazene', active: true, halfLifeH: 6, potencyRel: 0.6, fraction: 0.25 },
      { name: 'O-desalkyl butonitazene', active: false, halfLifeH: 5, fraction: 0.4 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.05, light: [0.1, 0.4], common: [0.4, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: ['Being weaker than other nitazenes does not make it characterised — it remains an uncharacterised synthetic opioid.'],
  sources: ['Vandeputte et al., Arch Toxicol (nitazene structure-activity series)']
},

{
  id: 'metodesnitazene', name: 'Metodesnitazene',
  class: 'Opioid', family: 'Benzimidazole (nitazene)', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Nitro-free analogue of metonitazene. Removing the nitro group cuts potency substantially relative to the nitro-bearing nitazenes.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-deethylation', product: 'N-desethyl metodesnitazene', fraction: 0.4, note: 'Active.' },
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: 'O-desmethyl metodesnitazene', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desethyl metodesnitazene', active: true, halfLifeH: 6, potencyRel: 0.6, fraction: 0.4 },
      { name: 'O-desmethyl metodesnitazene', active: false, halfLifeH: 5, fraction: 0.25 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 0.05, light: [0.1, 0.4], common: [0.4, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: ['Sold openly in some jurisdictions on the basis of not being explicitly scheduled. No human data.'],
  sources: ['Vandeputte et al., Arch Toxicol', 'CFSRE NPS Discovery']
},

/* ================= Further fentanyl analogues ================= */
{
  id: 'para-fluorofentanyl', name: 'para-Fluorofentanyl', aliases: ['4-fluorofentanyl', 'pFF'],
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Ring-fluorinated fentanyl analogue of broadly comparable potency to fentanyl. Since around 2021 it has appeared very widely alongside fentanyl in the North American illicit supply rather than replacing it.',
  halfLife: { hours: 5, range: [2, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'para-Fluoronorfentanyl', fraction: 0.7,
        note: 'Dominant route; the product is inactive and is the urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis', product: '4-ANPP analogue', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'para-Fluoronorfentanyl', active: false, halfLifeH: 7, fraction: 0.7, note: 'Inactive; primary detection target.' }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [0.5, 4], peakMin: [8, 20], durationH: [2, 5], afterEffectsH: [2, 10], bioavailability: 0.8,
      doses: { threshold: 0.01, light: [0.02, 0.05], common: [0.05, 0.12], strong: [0.12, 0.2], heavy: 0.2, unit: 'mg' } }
  },
  warnings: [
    'Commonly present together with fentanyl, so the total opioid load in a sample is higher than a fentanyl-only test strip suggests.',
    'Microgram-active; no safe way to measure outside a laboratory.'
  ],
  sources: ['CFSRE NPS Discovery trend reports', 'DEA emerging threat reports']
},

{
  id: 'ocfentanil', name: 'Ocfentanil', aliases: ['a-3217'],
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'extreme-potency', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Fentanyl analogue originally developed clinically and abandoned; estimated around 2.5× fentanyl potency.',
  halfLife: { hours: 3, range: [1.5, 6], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: 'O-desmethyl ocfentanil', fraction: 0.35 },
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis', product: 'Nor-ocfentanil', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'O-desmethyl ocfentanil', active: false, halfLifeH: 5, fraction: 0.35, note: 'Main urinary marker.' },
      { name: 'Nor-ocfentanil', active: false, halfLifeH: 4, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    insufflated: { onsetMin: [0.5, 4], peakMin: [8, 20], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 0.005, light: [0.01, 0.03], common: [0.03, 0.06], strong: [0.06, 0.1], heavy: 0.1, unit: 'mg' } }
  },
  warnings: [
    'More potent than fentanyl. Implicated in death clusters where it was sold as heroin.',
    'Case reports describe acute lung injury in addition to respiratory depression.'
  ],
  sources: ['Coopman et al. 2016, Forensic Sci Int', 'Dussy et al. 2016, J Anal Toxicol']
},

{
  id: '4-fibf', name: '4-FIBF', aliases: ['4-fluoroisobutyrfentanyl', '4-fibf', 'p-fibf'],
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Fluorinated isobutyrfentanyl analogue; estimated somewhat less potent than fentanyl but still far above morphine.',
  halfLife: { hours: 3, range: [1.5, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: '4-Fluoro-4-ANPP', fraction: 0.45 },
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis', product: 'Nor-4-FIBF', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: '4-Fluoro-4-ANPP', active: false, halfLifeH: 5, fraction: 0.45, note: 'Urinary marker.' },
      { name: 'Nor-4-FIBF', active: false, halfLifeH: 4, fraction: 0.25 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 0.05, light: [0.1, 0.3], common: [0.3, 0.7], strong: [0.7, 1.2], heavy: 1.2, unit: 'mg' } }
  },
  warnings: ['Widely implicated in overdose deaths. Not detected by standard opiate immunoassays.'],
  sources: ['EMCDDA notifications', 'Forensic case literature']
},

{
  id: 'methoxyacetylfentanyl', name: 'Methoxyacetylfentanyl',
  class: 'Opioid', family: 'Anilidopiperidine (fentanyl analogue)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Methoxyacetyl fentanyl analogue, estimated roughly a third of fentanyl\'s potency — still around 30× morphine.',
  halfLife: { hours: 3.5, range: [2, 7], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: '4-ANPP', fraction: 0.45 },
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: 'Hydroxyacetylfentanyl', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: '4-ANPP', active: false, halfLifeH: 5, fraction: 0.45 },
      { name: 'Hydroxyacetylfentanyl', active: true, halfLifeH: 4, potencyRel: 0.2, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [2, 5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 0.03, light: [0.05, 0.2], common: [0.2, 0.5], strong: [0.5, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: ['Subject of an EMCDDA risk assessment after a cluster of deaths. No human PK data.'],
  sources: ['EMCDDA methoxyacetylfentanyl risk assessment']
},

/* ================= AP-237 family ================= */
{
  id: 'ap-238', name: 'AP-238',
  class: 'Opioid', family: 'Piperazine (bucinnazine analogue)', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Analogue of bucinnazine (AP-237), a piperazine opioid historically used as an analgesic in China. Structurally unrelated to fentanyl and the nitazenes, so it evades analogue legislation and immunoassays aimed at those families.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue', notes: 'No human PK data.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation of the piperazine', product: 'Nor-AP-238', fraction: 0.4, note: 'Presumed active.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'Aromatic hydroxylation', product: 'Hydroxy-AP-238', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Nor-AP-238', active: true, halfLifeH: 5, potencyRel: 0.4, fraction: 0.4 },
      { name: 'Hydroxy-AP-238', active: false, halfLifeH: 5, fraction: 0.25, note: 'Urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 10], peakMin: [15, 40], durationH: [2, 5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 1, light: [2, 8], common: [8, 20], strong: [20, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Structurally distinct from fentanyl and nitazenes, so fentanyl test strips do not detect it and analogue laws may not cover it.',
    'Appeared in overdose casework from 2021. No human pharmacology exists.'
  ],
  sources: ['CFSRE NPS Discovery', 'EMCDDA notifications']
},

{
  id: '2-methyl-ap-237', name: '2-Methyl-AP-237',
  class: 'Opioid', family: 'Piperazine (bucinnazine analogue)', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Methylated bucinnazine analogue; a mu agonist of moderate potency relative to the fentanyl family, but with no human characterisation.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Nor-2-methyl-AP-237', fraction: 0.4, note: 'Presumed active.' },
      { enzyme: 'CYP2D6', reaction: 'Hydroxylation', product: 'Hydroxy-2-methyl-AP-237', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Nor-2-methyl-AP-237', active: true, halfLifeH: 5, potencyRel: 0.4, fraction: 0.4 },
      { name: 'Hydroxy-2-methyl-AP-237', active: false, halfLifeH: 5, fraction: 0.25 }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 10], peakMin: [15, 40], durationH: [2, 5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 1, light: [3, 10], common: [10, 25], strong: [25, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: ['Not detected by fentanyl test strips. No human data.'],
  sources: ['CFSRE NPS Discovery']
},

/* ================= U-series and MT-45 ================= */
{
  id: 'u-48800', name: 'U-48800',
  class: 'Opioid', family: 'Benzamide (U-series)', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Benzamide opioid from the same Upjohn research programme as U-47700. Somewhat less potent than U-47700 in receptor assays.',
  halfLife: { hours: 3, range: [1.5, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'N-desmethylation', product: 'N-desmethyl-U-48800', fraction: 0.4, note: 'Presumed active.' },
      { enzyme: 'CYP2D6', reaction: 'Di-desmethylation', product: 'N,N-didesmethyl-U-48800', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desmethyl-U-48800', active: true, halfLifeH: 4, potencyRel: 0.5, fraction: 0.4 },
      { name: 'N,N-didesmethyl-U-48800', active: false, halfLifeH: 4, fraction: 0.2 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [1, 6], peakMin: [10, 30], durationH: [1.5, 3], afterEffectsH: [2, 6], bioavailability: 0.8,
      doses: { threshold: 0.5, light: [1, 4], common: [4, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: ['Never tested in humans before being sold. Short duration drives rapid redosing.'],
  sources: ['Krotulski et al., J Anal Toxicol (U-series characterisation)']
},

{
  id: 'mt-45', name: 'MT-45', aliases: ['iC-6'],
  class: 'Opioid', family: 'Piperazine', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'ototoxic', 'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Piperazine opioid developed in Japan in the 1970s, roughly morphine-equivalent in potency. Notable for a distinctive and unusual toxicity profile unrelated to opioid receptors.',
  halfLife: { hours: 5, range: [3, 10], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic hydroxylation', product: 'Hydroxy-MT-45', fraction: 0.35 },
      { enzyme: 'CYP3A4', reaction: 'Piperazine N-dealkylation', product: '1-cyclohexyl-4-phenylpiperazine fragment', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Hydroxy-MT-45', active: false, halfLifeH: 6, fraction: 0.35, note: 'Urinary marker.' },
      { name: 'Piperazine fragment', active: false, halfLifeH: 5, fraction: 0.25 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 120], durationH: [3, 6], afterEffectsH: [3, 10], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Uniquely among opioids, MT-45 has caused BILATERAL HEARING LOSS, cataracts, hair loss and severe dermatitis in regular users. Some hearing loss was permanent. This is not an opioid-receptor effect and naloxone does not prevent it.',
    'Implicated in a cluster of deaths in Sweden.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  sources: ['Helander et al. 2014, Clin Toxicol', 'EMCDDA MT-45 risk assessment']
}

]);

/* Opioids: mixed agonist-antagonists, withdrawn agents, and biased agonists.
   The kappa-agonist/mu-antagonist subclass was entirely absent. */
DB.register([

{
  id: 'pentazocine', name: 'Pentazocine', aliases: ['talwin', 'fortral'],
  class: 'Opioid', family: 'Benzomorphan (mixed agonist-antagonist)', schedule: 'IV (US)',
  tags: ['opioid', 'kappa-agonist', 'mu-partial-agonist', 'analgesic', 'dysphoria-risk',
         'precipitated-withdrawal-risk', 'ceiling-effect', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'The archetypal mixed agonist-antagonist: a kappa-opioid agonist and weak mu partial agonist/antagonist. The kappa activity is what produces its notorious dysphoria — anxiety, dread and sometimes frank hallucinations — which is precisely why it has lower abuse potential than a pure mu agonist.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive and highly variable; oral bioavailability 11-32%.',
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'Terminal methyl oxidation', product: 'Carboxypentazocine', fraction: 0.5 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Pentazocine glucuronide', fraction: 0.35 }
    ],
    metabolites: [
      { name: 'Carboxypentazocine', active: false, halfLifeH: 4, fraction: 0.5 },
      { name: 'Pentazocine glucuronide', active: false, halfLifeH: 4, fraction: 0.35 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4', 'UGT'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.2,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'PRECIPITATES WITHDRAWAL in anyone dependent on a full mu agonist — its mu antagonism displaces them from the receptor. Do not take it alongside or shortly after heroin, methadone or oxycodone.',
    'Kappa agonism causes dysphoria, derealisation and hallucinations in a substantial minority, sometimes severe.',
    'The US formulation includes naloxone (Talwin NX) to deter injection.',
    'Fatal with benzodiazepines or alcohol despite the ceiling effect.'
  ],
  sources: ['DrugBank DB00652', 'Errick & Heel 1983, Drugs']
},

{
  id: 'butorphanol', name: 'Butorphanol', aliases: ['stadol'],
  class: 'Opioid', family: 'Morphinan (mixed agonist-antagonist)', schedule: 'IV (US)',
  tags: ['opioid', 'kappa-agonist', 'mu-partial-agonist', 'analgesic', 'dysphoria-risk',
         'precipitated-withdrawal-risk', 'ceiling-effect', 'respiratory-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Kappa agonist and mu partial agonist/antagonist, roughly 5x morphine by weight parenterally. Widely used in obstetrics and as a nasal spray for migraine, and heavily used in veterinary medicine.',
  halfLife: { hours: 4, range: [2.5, 7], confidence: 'measured' },
  metabolism: {
    firstPass: 'Almost total when swallowed — oral bioavailability only ~17%, which is why it is given nasally or by injection.',
    pathways: [
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'Hydroxylation', product: 'Hydroxybutorphanol', fraction: 0.5, note: 'The main metabolite; largely inactive.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Butorphanol glucuronide', fraction: 0.3 },
      { enzyme: 'CYP', reaction: 'N-dealkylation', product: 'Norbutorphanol', fraction: 0.1, note: 'Weakly active.' }
    ],
    metabolites: [
      { name: 'Hydroxybutorphanol', active: false, halfLifeH: 5, fraction: 0.5 },
      { name: 'Norbutorphanol', active: true, halfLifeH: 5, potencyRel: 0.2, fraction: 0.1 }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6', 'UGT'], excretion: 'Renal ~70%, faecal ~15%.', confidence: 'measured'
  },
  routes: {
    intranasal: { onsetMin: [5, 15], peakMin: [30, 60], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 0.5, light: [1, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } },
    im: { onsetMin: [5, 15], peakMin: [30, 60], durationH: [3, 4], afterEffectsH: [2, 8], bioavailability: 1.0,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 4], strong: [4, 6], heavy: 6, unit: 'mg' } }
  },
  warnings: [
    'Precipitates withdrawal in anyone dependent on a full mu agonist.',
    'Kappa-mediated dysphoria and derealisation are common.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  sources: ['DrugBank DB00611']
},

{
  id: 'nalbuphine', name: 'Nalbuphine', aliases: ['nubain'],
  class: 'Opioid', family: 'Morphinan (mixed agonist-antagonist)', schedule: 'Unscheduled (US); Rx',
  tags: ['opioid', 'kappa-agonist', 'mu-antagonist', 'analgesic', 'dysphoria-risk',
         'precipitated-withdrawal-risk', 'ceiling-effect', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Kappa agonist and mu antagonist, roughly equipotent with morphine parenterally. Its respiratory depression plateaus at about 30 mg — a genuine ceiling — which is why it is used to reverse opioid-induced itching and respiratory depression while preserving analgesia.',
  halfLife: { hours: 5, range: [3.5, 6], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~12%.',
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Nalbuphine glucuronide', fraction: 0.7,
        note: 'Dominant; largely non-CYP so few classic interactions.' },
      { enzyme: 'CYP3A4', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Nalbuphine glucuronide', active: false, halfLifeH: 6, fraction: 0.7 }],
    substrateOf: ['UGT2B7', 'CYP3A4'], excretion: 'Faecal predominantly; renal minor.', confidence: 'measured'
  },
  routes: {
    im: { onsetMin: [5, 20], peakMin: [30, 60], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 1.0,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg',
        note: 'Analgesia and respiratory depression both plateau around 30 mg — more does not give more.' } }
  },
  warnings: [
    'Strong mu antagonism — precipitates severe withdrawal in anyone dependent on a full agonist, and blocks the effect of opioids taken afterwards.',
    'Kappa dysphoria is common at higher doses.',
    'Still fatal with benzodiazepines or alcohol despite the ceiling.'
  ],
  sources: ['DrugBank DB00844', 'Gunion et al. 2004, Acute Pain']
},

{
  id: 'levorphanol', name: 'Levorphanol', aliases: ['levo-dromoran'],
  class: 'Opioid', family: 'Morphinan', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'nmda-antagonist', 'snri', 'analgesic', 'respiratory-depressant',
         'long-duration', 'accumulation-risk', 'serotonin-syndrome-risk', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 4,
  mechanism: 'A potent full mu agonist (roughly 4-8× morphine) that is also a kappa and delta agonist, an NMDA antagonist and a serotonin-noradrenaline reuptake inhibitor. That breadth makes it unusually effective for neuropathic pain — essentially methadone\'s pharmacology without the QT prolongation.',
  halfLife: { hours: 14, range: [11, 16], confidence: 'measured',
    notes: 'DANGEROUS MISMATCH, as with methadone: analgesia lasts 6-8 hours but the drug persists 11-16, so dosing to comfort causes accumulation over the first days.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Levorphanol-3-glucuronide', fraction: 0.8,
        note: 'Almost entirely glucuronidation — so unlike methadone it avoids CYP interactions, a genuine clinical advantage.' }
    ],
    metabolites: [{ name: 'Levorphanol-3-glucuronide', active: false, halfLifeH: 16, fraction: 0.8,
      note: 'Inactive but accumulates in renal impairment; possibly neuroexcitatory like M3G.' }],
    substrateOf: ['UGT2B7'], excretion: 'Renal, as the glucuronide.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [6, 8], afterEffectsH: [6, 18], bioavailability: 0.7,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 4], strong: [4, 8], heavy: 8, unit: 'mg' } }
  },
  warnings: [
    'Accumulates over the first 3-5 days of regular dosing — the dose that felt too weak on day 1 can be dangerous by day 4.',
    'Its SNRI activity brings serotonin syndrome risk with SSRIs, SNRIs, MAOIs and MDMA.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  sources: ['Prommer 2007, Support Care Cancer', 'DrugBank DB00854']
},

{
  id: 'propoxyphene', name: 'Propoxyphene', aliases: ['darvon', 'dextropropoxyphene', 'co-proxamol'],
  class: 'Opioid', family: 'Methadone analogue', schedule: 'Withdrawn (US 2010, UK 2007)',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'cardiotoxic', 'sodium-channel-blocker',
         'narrow-therapeutic-index', 'respiratory-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Weak mu agonist structurally related to methadone, roughly half the potency of codeine. Withdrawn worldwide not for its opioid effects but for cardiotoxicity — its metabolite blocks cardiac sodium channels.',
  halfLife: { hours: 12, range: [6, 24], confidence: 'measured',
    notes: 'The metabolite norpropoxyphene has a 30-36 h half-life and accumulates substantially with repeated dosing — which is what made this drug lethal.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Norpropoxyphene', fraction: 0.7,
        note: 'THE problem. Norpropoxyphene is a potent cardiac sodium channel blocker with a 30+ hour half-life, so it accumulates far beyond the parent and causes arrhythmias and cardiac arrest.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Norpropoxyphene', active: true, halfLifeH: 33, potencyRel: 0.3, fraction: 0.7,
      note: 'Weaker as an analgesic but strongly cardiotoxic. This single metabolite is why the drug was banned.' }],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [90, 180], durationH: [4, 6], afterEffectsH: [4, 12], bioavailability: 0.4,
      doses: { threshold: 32, light: [65, 100], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Withdrawn worldwide for cardiotoxicity. Overdose kills by arrhythmia before opioid respiratory depression, and naloxone does NOT reverse the cardiac effect.',
    'It was a leading method of suicide in the UK before withdrawal, partly because the combination product with paracetamol added hepatotoxicity.',
    'Any remaining supply is old stock. There is no reason to take it over any other opioid.'
  ],
  sources: ['FDA withdrawal 2010', 'Ulens et al. 1999, J Pharmacol Exp Ther']
},

{
  id: 'laam', name: 'LAAM', aliases: ['levacetylmethadol', 'orlaam'],
  class: 'Opioid', family: 'Methadone analogue', schedule: 'I (US, withdrawn)',
  tags: ['opioid', 'mu-agonist', 'prodrug', 'qt-prolonging', 'cardiotoxic', 'long-duration',
         'accumulation-risk', 'respiratory-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 5,
  mechanism: 'A long-acting methadone analogue once used for opioid maintenance, dosed only three times a week. It is a prodrug: its metabolites nor-LAAM and dinor-LAAM are more potent than the parent and far longer-lived. Withdrawn in 2003 over torsades de pointes.',
  halfLife: { hours: 2.6, range: [2, 4], confidence: 'measured',
    notes: 'Grossly misleading alone — nor-LAAM lasts 2 days and dinor-LAAM 4 days. Full effect takes days to build, which is why induction deaths occurred.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nor-LAAM', fraction: 0.6,
        note: 'More potent than the parent, with a ~48 h half-life.' },
      { enzyme: 'CYP3A4', reaction: 'Second N-demethylation', product: 'Dinor-LAAM', from: 'Nor-LAAM', fraction: 0.3,
        note: 'Also active, with a ~96 h half-life — the reason three-times-weekly dosing worked.' }
    ],
    metabolites: [
      { name: 'Nor-LAAM', active: true, halfLifeH: 48, potencyRel: 4, fraction: 0.6 },
      { name: 'Dinor-LAAM', active: true, halfLifeH: 96, potencyRel: 2, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal and faecal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 240], peakMin: [240, 480], durationH: [48, 72], afterEffectsH: [48, 120], bioavailability: 0.6,
      doses: { threshold: 10, light: [20, 40], common: [40, 80], strong: [80, 120], heavy: 140, unit: 'mg' } }
  },
  warnings: [
    'Withdrawn over QT prolongation and torsades de pointes.',
    'Because the active metabolites take days to accumulate, dose escalation based on early effect caused fatal overdoses several days later.',
    'Fatal with benzodiazepines or alcohol; additive QT risk with methadone, ondansetron, antipsychotics.'
  ],
  sources: ['EMEA LAAM withdrawal 2001', 'Newcombe et al. 2004, Br J Clin Pharmacol']
},

{
  id: 'ketobemidone', name: 'Ketobemidone', aliases: ['ketogan', 'ketodur'],
  class: 'Opioid', family: 'Phenylpiperidine', schedule: 'Rx in Scandinavia/Denmark; not US/UK',
  tags: ['opioid', 'mu-agonist', 'nmda-antagonist', 'analgesic', 'respiratory-depressant',
         'cns-depressant', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A potent full mu agonist roughly equipotent with morphine, used almost exclusively in Denmark, Norway and Sweden. It also has NMDA antagonist activity, which is thought to help with neuropathic pain.',
  halfLife: { hours: 2.5, range: [2, 4], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Glucuronidation of the phenol', product: 'Ketobemidone glucuronide', fraction: 0.6 },
      { enzyme: 'CYP2C9 / CYP3A4', reaction: 'N-demethylation', product: 'Norketobemidone', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Ketobemidone glucuronide', active: false, halfLifeH: 3, fraction: 0.6 },
      { name: 'Norketobemidone', active: true, halfLifeH: 3, potencyRel: 0.3, fraction: 0.2 }
    ],
    substrateOf: ['UGT', 'CYP2C9', 'CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.34,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Frequently formulated with an antispasmodic (Ketogan). High abuse liability — it is among the most sought-after opioids in Scandinavia.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  sources: ['Danish/Swedish prescribing literature', 'DrugBank DB09293']
},

{
  id: 'piritramide', name: 'Piritramide', aliases: ['dipidolor'],
  class: 'Opioid', family: 'Diphenylpropylamine', schedule: 'Rx in Germany/Austria/Benelux; not US/UK',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Full mu agonist roughly 0.7× morphine, used almost exclusively for post-operative pain in German-speaking Europe and the Netherlands. Notable for causing less nausea and histamine release than morphine.',
  halfLife: { hours: 5, range: [4, 10], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Nor-piritramide', fraction: 0.5 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Nor-piritramide', active: true, halfLifeH: 6, potencyRel: 0.3, fraction: 0.5 }],
    substrateOf: ['CYP3A4', 'UGT'], excretion: 'Renal and faecal.', confidence: 'measured'
  },
  routes: {
    im: { onsetMin: [5, 20], peakMin: [30, 60], durationH: [4, 6], afterEffectsH: [3, 10], bioavailability: 1.0,
      doses: { threshold: 3.75, light: [7.5, 15], common: [15, 22.5], strong: [22.5, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: ['Fatal with benzodiazepines or alcohol.'],
  sources: ['German prescribing information', 'Kietzmann et al. 1997, Eur J Anaesthesiol']
},

{
  id: 'oliceridine', name: 'Oliceridine', aliases: ['olinvyk', 'trv130'],
  class: 'Opioid', family: 'Biased mu agonist', schedule: 'II (US)',
  tags: ['opioid', 'mu-agonist', 'biased-agonist', 'analgesic', 'respiratory-depressant',
         'qt-prolonging', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A G-protein biased mu agonist, designed to separate analgesia (G-protein signalling) from respiratory depression and constipation (thought to be β-arrestin mediated). Approved in the US in 2020 — the first drug of its kind to reach market.',
  halfLife: { hours: 2, range: [1.3, 3], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation', product: 'Oxidative metabolites', fraction: 0.5 },
      { enzyme: 'CYP2D6', reaction: 'Oxidation', product: 'Oxidative metabolites', fraction: 0.3,
        note: 'CYP2D6 poor metabolisers reach higher exposure; dose adjustment is advised.' }
    ],
    metabolites: [{ name: 'Oxidative metabolites', active: false, halfLifeH: 3, fraction: 0.5, note: 'None clinically active.' }],
    substrateOf: ['CYP3A4', 'CYP2D6'], excretion: 'Renal, <10% unchanged.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [1, 5], peakMin: [5, 15], durationH: [1, 3], afterEffectsH: [1, 4], bioavailability: 1.0,
      doses: { threshold: 0.5, light: [1, 1.5], common: [1.5, 3], strong: [3, 6], heavy: 6, unit: 'mg' } }
  },
  warnings: [
    'The promised safety advantage did not fully materialise — trials showed respiratory depression comparable to morphine at equianalgesic doses, and it carries the same boxed warnings. This is the cautionary example for anyone assuming a "biased agonist" is inherently safer.',
    'Has a daily dose cap (27 mg) because of QT prolongation.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  sources: ['FDA approval documents 2020', 'Azzam et al. 2019, Br J Anaesth']
},

{
  id: 'ah-7921', name: 'AH-7921', aliases: ['doxylam'],
  class: 'Opioid', family: 'Benzamide (U-series relative)', schedule: 'I (US)',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'high-overdose-risk', 'highly-addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A benzamide opioid from 1970s Allen & Hanburys research, roughly equipotent with morphine. One of the first designer opioids to reach the research chemical market, around 2012.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'N-demethylation', product: 'N-desmethyl-AH-7921', fraction: 0.4, note: 'Active.' },
      { enzyme: 'CYP2D6', reaction: 'Di-desmethylation', product: 'N,N-didesmethyl-AH-7921', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desmethyl-AH-7921', active: true, halfLifeH: 5, potencyRel: 0.5, fraction: 0.4 },
      { name: 'N,N-didesmethyl-AH-7921', active: false, halfLifeH: 5, fraction: 0.2 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [45, 120], durationH: [3, 6], afterEffectsH: [3, 10], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Caused a cluster of deaths in Europe shortly after appearing, prompting an EMCDDA risk assessment and rapid scheduling.',
    'No human safety data existed before it was sold. Fatal with benzodiazepines or alcohol.'
  ],
  sources: ['EMCDDA AH-7921 risk assessment 2014', 'Coppola & Mondola 2015, Toxicol Lett']
},

{
  id: 'sr-17018', name: 'SR-17018',
  class: 'Opioid', family: 'Biased mu agonist', schedule: 'Research compound / analogue',
  tags: ['opioid', 'mu-agonist', 'biased-agonist', 'research-chemical', 'respiratory-depressant',
         'cns-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A strongly G-protein biased mu agonist from academic research, notable for two unusual properties in rodents: it produces analgesia with markedly less respiratory depression than morphine, and — uniquely — it appears to REVERSE established opioid tolerance rather than deepening it. That has made it a research template rather than a clinical drug.',
  halfLife: { hours: 6, range: [3, 12], confidence: 'analogue',
    notes: 'No human pharmacokinetic data of any kind. Rodent work suggests a long duration; everything here is extrapolation.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Presumed oxidative metabolism', product: 'Hydroxylated metabolites', fraction: 0.45,
        note: 'Assumed from its structural class; not characterised in humans.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false, halfLifeH: 7, fraction: 0.45,
      note: 'No metabolite has been identified in humans.' }],
    substrateOf: ['CYP3A4'], excretion: 'Presumed renal and biliary.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 180], durationH: [4, 8], afterEffectsH: [4, 12], bioavailability: 0.5,
      doses: { threshold: 1, light: [2, 5], common: [5, 15], strong: [15, 30], heavy: 30, unit: 'mg',
        note: 'Entirely extrapolated from rodent dosing. There is no established human dose and these figures should not be treated as one.' } }
  },
  warnings: [
    'Reduced respiratory depression in MICE is not a safety guarantee in humans. Oliceridine — the only biased agonist to reach clinical trials — showed respiratory depression comparable to morphine at equianalgesic doses, so the hypothesis has already failed once in humans.',
    'No human pharmacokinetics, no toxicology, no established dose. It is a laboratory compound.',
    'Still a full mu agonist: dependence, withdrawal and fatal interaction with depressants all apply.'
  ],
  sources: ['Schmid et al. 2017, Cell', 'Grim et al. 2020, Br J Pharmacol']
}

]);
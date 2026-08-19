/* Active metabolites that are drugs in their own right.
   Each of these is either separately marketed, separately scheduled, sold as a
   research chemical, or pharmacologically important enough that people need to
   look it up directly. Trivial nor-analogues of research chemicals are NOT
   given entries here — they have no independent data and inventing pages for
   them would be fabrication; they remain listed under their parent drug. */
DB.register([

{
  id: 'psilocin', name: 'Psilocin', aliases: ['4-ho-dmt', '4-hydroxy-dmt'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'hallucinogen', 'psychosis-risk', 'hppd-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'The actual psychoactive compound of magic mushrooms — psilocybin is merely its phosphate-ester delivery form. A partial agonist at 5-HT2A with additional 5-HT1A activity.',
  halfLife: { hours: 2.5, range: [1.5, 3.5], confidence: 'measured' },
  metabolism: {
    firstPass: 'Substantial; oral bioavailability ~53%. Unstable to oxidation, which is why free psilocin degrades in storage while psilocybin keeps.',
    pathways: [
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation', product: 'Psilocin-O-glucuronide', fraction: 0.8,
        note: 'Dominant clearance route — about 80% of the dose. UGT1A10 acts in the intestine, UGT1A9 in the liver.' },
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: '4-hydroxyindole-3-acetic acid', fraction: 0.15 },
      { enzyme: 'CYP2D6', reaction: 'Minor N-demethylation', product: '4-hydroxy-NMT', fraction: 0.03 }
    ],
    metabolites: [
      { name: 'Psilocin-O-glucuronide', active: false, halfLifeH: 5, fraction: 0.8, note: 'Main urinary metabolite; detectable ~24 h.' },
      { name: '4-HIAA', active: false, halfLifeH: 4, fraction: 0.15 }
    ],
    substrateOf: ['UGT1A10', 'UGT1A9', 'MAO-A', 'CYP2D6'], inhibits: [],
    excretion: 'Renal, ~65% as the glucuronide; ~20% biliary.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 40], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.53,
      doses: { threshold: 2, light: [4, 8], common: [8, 16], strong: [16, 28], heavy: 28, unit: 'mg',
        note: 'Roughly 0.7-0.8× the equivalent psilocybin dose, since psilocin is the smaller molecule.' } }
  },
  warnings: [
    'MAOIs substantially potentiate and prolong it — a real overdose risk, not a synergy to seek.',
    'Faster onset than psilocybin because the dephosphorylation step is skipped.'
  ],
  sources: ['Hasler et al. 1997, Pharm Acta Helv', 'Dinis-Oliveira 2017, Drug Metab Rev']
},

{
  id: 'cocaethylene', name: 'Cocaethylene', aliases: ['ethylbenzoylecgonine'],
  class: 'Stimulant', family: 'Tropane alkaloid', schedule: 'Formed in vivo; not sold',
  tags: ['stimulant', 'dopamine-reuptake-inhibitor', 'cardiotoxic', 'vasoconstrictor',
         'sodium-channel-blocker', 'hypertensive-risk', 'high-toxicity'],
  toleranceGroup: 'cocaine', toleranceHalfLifeDays: 1,
  mechanism: 'Formed only when cocaine and alcohol are taken together — hepatic carboxylesterase swaps cocaine\'s methyl ester for an ethyl one. Equipotent to cocaine at the dopamine transporter but roughly 3-5× longer-lived and substantially more cardiotoxic.',
  halfLife: { hours: 2.5, range: [2, 4], confidence: 'measured',
    notes: 'Two to three times cocaine\'s half-life, which is why the combination feels longer and why cardiac strain is extended well past the cocaine itself.' },
  metabolism: {
    pathways: [
      { enzyme: 'CES1 / BChE', reaction: 'Ester hydrolysis', product: 'Benzoylecgonine', fraction: 0.6,
        note: 'Same inactive terminal metabolite as cocaine.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Norcocaethylene', fraction: 0.15, note: 'Active and hepatotoxic.' }
    ],
    metabolites: [
      { name: 'Benzoylecgonine', active: false, halfLifeH: 6, fraction: 0.6 },
      { name: 'Norcocaethylene', active: true, halfLifeH: 3, potencyRel: 0.8, fraction: 0.15 }
    ],
    substrateOf: ['CES1', 'BChE', 'CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.3,
      doses: { threshold: 10, light: [20, 40], common: [40, 80], strong: [80, 120], heavy: 120, unit: 'mg',
        note: 'Not taken directly — it forms in the body. Doses shown only for modelling a cocaine-plus-alcohol session.' } }
  },
  warnings: [
    'You cannot buy this — it is what your liver makes when you drink and use cocaine together. It is associated with a large increase in the risk of sudden cardiac death over either drug alone.',
    'Longer-lasting and more cardiotoxic than cocaine, with the same sodium channel blockade driving arrhythmia risk.',
    'The practical implication: separating cocaine and alcohol in time is the single most effective harm-reduction step for that combination.'
  ],
  sources: ['Farre et al. 1993, J Pharmacol Exp Ther', 'Jeffcoat et al. 1989, Drug Metab Dispos']
},

{
  id: 'dextrorphan', name: 'Dextrorphan', aliases: ['dxo'],
  class: 'Dissociative', family: 'Morphinan', schedule: 'Formed in vivo; unscheduled',
  tags: ['dissociative', 'nmda-antagonist', 'cns-depressant', 'sigma-agonist'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'The active dissociative behind DXM — a moderate-affinity NMDA channel blocker. DXM itself is largely a prodrug plus a serotonin reuptake inhibitor; the plateaus people describe are dextrorphan.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'measured',
    notes: 'In CYP2D6 poor metabolisers, less dextrorphan forms but DXM itself accumulates — so the experience is more serotonergic and less dissociative, and considerably more dangerous.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation', product: 'Dextrorphan-O-glucuronide', fraction: 0.75,
        note: 'Dominant route; the main urinary species.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: '3-Hydroxymorphinan', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Dextrorphan-O-glucuronide', active: false, halfLifeH: 5, fraction: 0.75 },
      { name: '3-Hydroxymorphinan', active: true, halfLifeH: 5, potencyRel: 0.3, fraction: 0.15 }
    ],
    substrateOf: ['UGT2B15', 'CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.5,
      doses: { threshold: 20, light: [40, 90], common: [90, 180], strong: [180, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Unlike DXM it has no serotonin reuptake activity, so it does not carry the same serotonin syndrome risk — but anything taken as DXM does.',
    'Additive with other NMDA antagonists and with depressants.'
  ],
  sources: ['Zawertailo et al. 2010, J Clin Psychopharmacol']
},

{
  id: 'norketamine', name: 'Norketamine',
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Formed in vivo',
  tags: ['dissociative', 'nmda-antagonist', 'cns-depressant', 'urotoxic'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'The principal metabolite of ketamine, roughly one third as potent at NMDA but longer-lasting. Oral ketamine produces far more of it than intramuscular does, which is why oral dosing feels heavier, more sedating and less crisply dissociative.',
  halfLife: { hours: 5, range: [4, 8], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2A6 / CYP2C9', reaction: 'Hydroxylation', product: 'Hydroxynorketamines', fraction: 0.4 },
      { enzyme: 'Dehydrogenases', reaction: 'Dehydration', product: 'Dehydronorketamine', fraction: 0.3, note: 'Main urinary marker.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: '(2R,6R)-Hydroxynorketamine', active: true, halfLifeH: 7, potencyRel: 0.05, fraction: 0.4 },
      { name: 'Dehydronorketamine', active: false, halfLifeH: 10, fraction: 0.3 }
    ],
    substrateOf: ['CYP2A6', 'CYP2C9', 'UGT'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [2, 5], afterEffectsH: [2, 8], bioavailability: 0.2,
      doses: { threshold: 50, light: [100, 200], common: [200, 400], strong: [400, 700], heavy: 700, unit: 'mg' } }
  },
  warnings: ['Presumed to contribute to ketamine\'s bladder toxicity. Additive with depressants.'],
  sources: ['Zanos et al. 2018, Pharmacol Rev', 'Peltoniemi et al. 2016, Clin Pharmacokinet']
},

{
  id: 'hnk', name: '(2R,6R)-Hydroxynorketamine', aliases: ['hnk', '2r6r-hnk'],
  class: 'Other', family: 'Arylcyclohexylamine metabolite', schedule: 'Investigational',
  tags: ['antidepressant', 'ampa-potentiator', 'non-dissociative'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'Downstream metabolite of ketamine and the leading candidate for its rapid antidepressant effect. Notably it is NOT an NMDA blocker at relevant concentrations — it works through AMPA receptor potentiation, which is why it appears to lift mood without producing dissociation.',
  halfLife: { hours: 7, range: [5, 12], confidence: 'measured',
    notes: 'Outlasts both ketamine and norketamine, matching the observation that the antidepressant effect persists long after the dissociation ends.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'HNK glucuronide', fraction: 0.6 },
      { enzyme: 'CYP', reaction: 'Further oxidation', product: 'Oxidised metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: 'HNK glucuronide', active: false, halfLifeH: 8, fraction: 0.6 }],
    substrateOf: ['UGT'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 180], durationH: [6, 12], afterEffectsH: [12, 72], bioavailability: 0.3,
      doses: { threshold: 10, light: [25, 50], common: [50, 150], strong: [150, 300], heavy: 300, unit: 'mg',
        note: 'Investigational only — no established human dose range exists outside trials.' } }
  },
  warnings: [
    'Not recreational and not dissociative — this is included because it explains how ketamine\'s antidepressant effect outlasts its intoxication.',
    'Human dosing is investigational; the ranges above are placeholders.'
  ],
  sources: ['Zanos et al. 2016, Nature', 'Highland et al. 2021, Pharmacol Rev']
},

{
  id: 'noribogaine', name: 'Noribogaine',
  class: 'Psychedelic', family: 'Iboga alkaloid', schedule: 'Formed in vivo; investigational',
  tags: ['psychedelic', 'kappa-agonist', 'serotonergic', 'qt-prolonging', 'cardiotoxic', 'long-duration'],
  toleranceGroup: 'ibogaine', toleranceHalfLifeDays: 30,
  mechanism: 'The long-lived active metabolite of ibogaine. Unlike the parent it is a weak NMDA antagonist but a potent kappa-opioid agonist and serotonin reuptake inhibitor. It is responsible for the days-long afterglow reported after ibogaine — and for the extended window of cardiac risk.',
  halfLife: { hours: 38, range: [28, 49], confidence: 'measured',
    notes: 'Very long. Someone who feels recovered from ibogaine\'s visionary phase still has substantial noribogaine on board, with QT prolongation continuing for days.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Noribogaine glucuronide', fraction: 0.6, note: 'Main clearance route.' },
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'Further oxidation', product: 'Hydroxylated metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Noribogaine glucuronide', active: false, halfLifeH: 40, fraction: 0.6 }],
    substrateOf: ['UGT', 'CYP2D6', 'CYP3A4'], inhibits: ['CYP2D6'],
    excretion: 'Renal and biliary.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [180, 420], durationH: [24, 48], afterEffectsH: [48, 120], bioavailability: 0.7,
      doses: { threshold: 20, light: [40, 100], common: [100, 300], strong: [300, 600], heavy: 600, unit: 'mg' } }
  },
  warnings: [
    'Prolongs the QT interval for days after an ibogaine session. The cardiac danger does not end when the visions do — deaths have occurred well after the acute phase.',
    'Never combine with other QT-prolonging drugs (methadone, ondansetron, many antipsychotics).'
  ],
  sources: ['Glue et al. 2015, J Clin Pharmacol', 'Mash et al. 2016']
},

{
  id: 'm6g', name: 'Morphine-6-glucuronide', aliases: ['m6g'],
  class: 'Opioid', family: 'Morphinan metabolite', schedule: 'Formed in vivo',
  tags: ['opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'renally-cleared', 'accumulation-risk'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Glucuronide metabolite of morphine that is, unusually for a conjugate, MORE potent than its parent at the mu receptor — roughly twice as active. Crosses the blood-brain barrier slowly, so its effect builds late.',
  halfLife: { hours: 4, range: [2.5, 6], confidence: 'measured',
    notes: 'CRITICAL: cleared entirely by the kidneys. In renal impairment it accumulates over days and causes delayed, prolonged respiratory depression in patients whose morphine dose seemed stable. This is a classic and dangerous clinical trap.' },
  metabolism: {
    pathways: [
      { enzyme: 'None (renally excreted intact)', reaction: 'Excreted unchanged by the kidney', product: 'M6G', fraction: 0.9,
        note: 'Not metabolised further to any meaningful extent — which is precisely why renal function governs its accumulation.' }
    ],
    metabolites: [{ name: 'None significant', active: false, note: 'Excreted intact.' }],
    substrateOf: [], excretion: 'Renal, essentially entirely unchanged.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [10, 40], peakMin: [30, 120], durationH: [4, 8], afterEffectsH: [4, 12], bioavailability: 1.0,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'Accumulates dangerously in kidney impairment, causing late respiratory depression hours to days after the last morphine dose.',
    'Roughly twice morphine\'s potency at the mu receptor with a slower onset — the effect arrives after you would expect it.'
  ],
  sources: ['Klimas & Mikus 2014, Br J Anaesth', 'Osborne et al. 1988, Lancet']
},

{
  id: 'norbuprenorphine', name: 'Norbuprenorphine',
  class: 'Opioid', family: 'Oripavine metabolite', schedule: 'Formed in vivo',
  tags: ['opioid', 'mu-agonist', 'respiratory-depressant', 'long-duration', 'accumulation-risk'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 5,
  mechanism: 'Metabolite of buprenorphine and, importantly, a FULL mu agonist rather than a partial one — so unlike its parent it has no ceiling on respiratory depression. It penetrates the CNS poorly, which normally limits the danger, but not in overdose or renal impairment.',
  halfLife: { hours: 40, range: [30, 60], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A3', reaction: 'Glucuronidation', product: 'Norbuprenorphine-3-glucuronide', fraction: 0.7 },
      { enzyme: 'CYP3A4', reaction: 'Further oxidation', product: 'Hydroxylated metabolites', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Norbuprenorphine-3-glucuronide', active: true, halfLifeH: 45, potencyRel: 0.05, fraction: 0.7 }],
    substrateOf: ['UGT1A3', 'CYP3A4'], excretion: 'Mostly faecal; renal accumulation in impairment.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [40, 120], peakMin: [120, 300], durationH: [12, 24], afterEffectsH: [24, 48], bioavailability: 0.1,
      doses: { threshold: 0.5, light: [1, 3], common: [3, 8], strong: [8, 16], heavy: 16, unit: 'mg' } }
  },
  warnings: [
    'Buprenorphine\'s respiratory ceiling does NOT apply to this metabolite — it is a full agonist. This is the main reason buprenorphine is still dangerous in overdose and in renal failure.',
    'CYP3A4 inhibitors raise how much of it forms.'
  ],
  sources: ['Brown et al. 2011, J Clin Pharmacol', 'Huang et al. 2001, J Pharmacol Exp Ther']
},

{
  id: 'nordazepam', name: 'Nordazepam', aliases: ['desmethyldiazepam', 'nordiazepam'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Prescription in some countries; RC elsewhere',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'long-duration', 'accumulation-risk', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 10,
  mechanism: 'The shared long-lived active metabolite of diazepam, chlordiazepoxide, clorazepate, prazepam and medazepam — and a prescribed drug in its own right in parts of Europe. Its very long half-life is what makes diazepam effectively self-tapering.',
  halfLife: { hours: 80, range: [36, 100], confidence: 'measured',
    notes: 'Up to four days. Daily dosing accumulates for two weeks or more before steady state, so day 14 is far stronger than day 1 at the same dose.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: '3-hydroxylation', product: 'Oxazepam', fraction: 0.5,
        note: 'Produces another active benzodiazepine, itself separately prescribed.' },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation of oxazepam', product: 'Oxazepam glucuronide', fraction: 0.4 }
    ],
    metabolites: [
      { name: 'Oxazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.5 },
      { name: 'Oxazepam glucuronide', active: false, halfLifeH: 10, fraction: 0.4 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 180], durationH: [10, 20], afterEffectsH: [24, 96], bioavailability: 0.9,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Accumulates for weeks with daily use. Fatal with opioids or alcohol. Withdrawal can be fatal.',
    'CYP2C19 poor metabolisers clear it far more slowly still.'
  ],
  sources: ['Greenblatt et al. 1989, Clin Pharmacokinet', 'DrugBank DB01202']
},

{
  id: 'oxazepam', name: 'Oxazepam', aliases: ['serax', 'seresta'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'anxiolytic', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'A prescribed benzodiazepine and the terminal active metabolite of diazepam, chlordiazepoxide and temazepam. Slow onset and no active metabolites of its own make it comparatively predictable.',
  halfLife: { hours: 8, range: [4, 15], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B15', reaction: 'Direct glucuronidation', product: 'Oxazepam glucuronide', fraction: 0.95,
        note: 'CLINICALLY IMPORTANT: bypasses CYP entirely. With lorazepam and temazepam it is therefore preferred in liver disease and in the elderly, and it is free of CYP3A4 interactions.' }
    ],
    metabolites: [{ name: 'Oxazepam glucuronide', active: false, halfLifeH: 10, fraction: 0.95, note: 'Inactive; no active metabolites at all.' }],
    substrateOf: ['UGT2B15'], excretion: 'Renal, as the glucuronide.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [6, 10], afterEffectsH: [6, 18], bioavailability: 0.93,
      doses: { threshold: 5, light: [10, 15], common: [15, 30], strong: [30, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Slow onset means people redose before it works.'],
  sources: ['DrugBank DB00842']
},

{
  id: 'paraxanthine', name: 'Paraxanthine', aliases: ['1,7-dimethylxanthine', 'enfinity'],
  class: 'Stimulant', family: 'Xanthine', schedule: 'Unscheduled (sold as a supplement)',
  tags: ['stimulant', 'adenosine-antagonist', 'vasoconstrictor'],
  toleranceGroup: 'caffeine', toleranceHalfLifeDays: 3,
  mechanism: 'The dominant metabolite of caffeine — about 84% of a dose becomes this — and an adenosine antagonist in its own right. Most of the back half of a coffee\'s effect is actually paraxanthine. Now sold directly as a supplement, marketed as cleaner than caffeine because it lacks the pronounced vasoconstrictive and anxiogenic edge.',
  halfLife: { hours: 3.5, range: [3, 4], confidence: 'measured', notes: 'Shorter than caffeine\'s, which is the basis of the "less sleep disruption" claim.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP1A2', reaction: 'Demethylation and oxidation', product: '1-methylxanthine / 1-methyluric acid', fraction: 0.7 },
      { enzyme: 'NAT2', reaction: 'Acetylation', product: 'AFMU', fraction: 0.2 }
    ],
    metabolites: [
      { name: '1-Methylxanthine', active: false, halfLifeH: 4, fraction: 0.7 },
      { name: 'AFMU', active: false, halfLifeH: 4, fraction: 0.2 }
    ],
    substrateOf: ['CYP1A2', 'NAT2'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 40], peakMin: [30, 60], durationH: [3, 5], afterEffectsH: [1, 5], bioavailability: 0.99,
      doses: { threshold: 20, light: [25, 75], common: [75, 150], strong: [150, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Still a stimulant with the same cardiovascular additivity as caffeine — "cleaner" is a marketing claim, not an absence of risk.',
    'Fluvoxamine and other CYP1A2 inhibitors raise exposure substantially.'
  ],
  sources: ['Benowitz et al. 1995, Clin Pharmacol Ther', 'Guest et al. 2021, J Int Soc Sports Nutr']
},

{
  id: 'theophylline', name: 'Theophylline', aliases: ['aminophylline', 'uniphyl'],
  class: 'Stimulant', family: 'Xanthine', schedule: 'Prescription',
  tags: ['stimulant', 'adenosine-antagonist', 'bronchodilator', 'narrow-therapeutic-index',
         'seizure-risk', 'cardiotoxic'],
  toleranceGroup: 'caffeine', toleranceHalfLifeDays: 3,
  mechanism: 'Xanthine bronchodilator and a minor caffeine metabolite. Adenosine antagonist and phosphodiesterase inhibitor. Clinically important mainly for having a genuinely narrow therapeutic index.',
  halfLife: { hours: 8, range: [4, 12], confidence: 'measured',
    notes: 'Halved by smoking (CYP1A2 induction) and roughly tripled by fluvoxamine or ciprofloxacin — a well-documented cause of accidental toxicity when someone quits smoking or starts an antibiotic.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP1A2', reaction: 'Demethylation and 8-hydroxylation', product: '1,3-dimethyluric acid / 3-methylxanthine', fraction: 0.7,
        note: 'Dominant. This single dependency is why theophylline has so many clinically serious interactions.' },
      { enzyme: 'CYP2E1 / CYP3A4', reaction: 'Minor oxidation', product: '1-methyluric acid', fraction: 0.15 }
    ],
    metabolites: [
      { name: '3-Methylxanthine', active: true, halfLifeH: 6, potencyRel: 0.3, fraction: 0.7 },
      { name: '1,3-Dimethyluric acid', active: false, halfLifeH: 6, fraction: 0.15 }
    ],
    substrateOf: ['CYP1A2', 'CYP2E1', 'CYP3A4'], excretion: 'Renal, ~10% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 120], durationH: [6, 12], afterEffectsH: [2, 8], bioavailability: 0.95,
      doses: { threshold: 50, light: [100, 200], common: [200, 400], strong: [400, 600], heavy: 600, unit: 'mg' } }
  },
  warnings: [
    'Narrow therapeutic index — therapeutic 10-20 mg/L, toxic above 20. Toxicity causes seizures and ventricular arrhythmias, sometimes with no warning nausea first.',
    'Quitting smoking raises levels sharply within days, because CYP1A2 induction fades.',
    'Ciprofloxacin, fluvoxamine and erythromycin all raise levels dangerously.'
  ],
  sources: ['DrugBank DB00277', 'Hendeles & Weinberger 1983']
},

{
  id: 'theobromine', name: 'Theobromine', aliases: ['xantheose'],
  class: 'Stimulant', family: 'Xanthine', schedule: 'Unscheduled',
  tags: ['stimulant', 'adenosine-antagonist', 'vasodilator', 'mild'],
  toleranceGroup: 'caffeine', toleranceHalfLifeDays: 3,
  mechanism: 'The principal xanthine of cocoa and a caffeine metabolite. A much weaker adenosine antagonist than caffeine, and a vasodilator rather than a vasoconstrictor — hence the gentle, long, non-jittery lift attributed to dark chocolate.',
  halfLife: { hours: 7.2, range: [6, 10], confidence: 'measured',
    notes: 'Long relative to its mildness, so it accumulates through the day with repeated chocolate or cocoa intake.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP1A2 / CYP2E1', reaction: 'Demethylation', product: '3-methylxanthine / 7-methylxanthine', fraction: 0.6 },
      { enzyme: 'CYP1A2', reaction: 'Oxidation', product: '3,7-dimethyluric acid', fraction: 0.2 }
    ],
    metabolites: [
      { name: '7-Methylxanthine', active: false, halfLifeH: 7, fraction: 0.6 },
      { name: '3,7-Dimethyluric acid', active: false, halfLifeH: 7, fraction: 0.2 }
    ],
    substrateOf: ['CYP1A2', 'CYP2E1'], excretion: 'Renal, ~10% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 180], durationH: [6, 10], afterEffectsH: [2, 8], bioavailability: 0.95,
      doses: { threshold: 50, light: [100, 250], common: [250, 500], strong: [500, 1000], heavy: 1000, unit: 'mg',
        note: 'Dark chocolate is roughly 5-8 mg/g, so a 100 g bar contains 500-800 mg.' } }
  },
  warnings: [
    'Toxic to dogs and cats, which clear it far more slowly than humans — the reason chocolate poisons pets.',
    'Very high intakes cause nausea, headache and sweating.'
  ],
  sources: ['Martinez-Pinilla et al. 2015, Front Pharmacol']
},

{
  id: 'cathine', name: 'Cathine', aliases: ['norpseudoephedrine', 'd-norpseudoephedrine'],
  class: 'Stimulant', family: 'Phenethylamine alkaloid', schedule: 'III/IV (US); scheduled internationally',
  tags: ['stimulant', 'sympathomimetic', 'norepinephrine-releaser', 'vasoconstrictor',
         'mao-contraindicated', 'hypertensive-risk'],
  toleranceGroup: 'ephedrine', toleranceHalfLifeDays: 3,
  mechanism: 'The longer-lasting, weaker stimulant alkaloid of khat, and a metabolite of both pseudoephedrine and cathinone. Roughly a tenth of cathinone\'s potency, giving khat its long mild tail after the initial lift fades.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'measured', notes: 'Urinary-pH dependent, as with the other phenethylamine alkaloids.' },
  metabolism: {
    pathways: [
      { enzyme: 'Minimal hepatic metabolism', reaction: 'Largely excreted unchanged', product: 'Cathine', fraction: 0.8,
        note: 'Most of a dose leaves intact via the kidney, so renal function and urine pH matter more than any CYP.' },
      { enzyme: 'CYP2D6', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Hydroxycathine', active: false, halfLifeH: 5, fraction: 0.1 }],
    substrateOf: ['CYP2D6'], excretion: 'Renal, ~80% unchanged and pH-dependent.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.85,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 75], heavy: 75, unit: 'mg' } }
  },
  warnings: [
    'MAOI-contraindicated — hypertensive crisis risk, as with all the sympathomimetic phenethylamines.',
    'Banned in sport (WADA) above a urinary threshold, and it is a metabolite of ordinary pseudoephedrine.'
  ],
  sources: ['Toennes et al. 2003, Br J Clin Pharmacol']
},

{
  id: 'bufotenine', name: 'Bufotenine', aliases: ['5-ho-dmt', '5-hydroxy-dmt'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'vasoconstrictor', 'mao-substrate',
         'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-tryptamine', toleranceHalfLifeDays: 1,
  mechanism: 'The 5-hydroxy analogue of DMT, found in Anadenanthera seeds, some toads and as a CYP2D6 metabolite of 5-MeO-DMT. Its polarity limits blood-brain barrier penetration, so much of a dose acts peripherally — producing pronounced cardiovascular effects and facial flushing alongside comparatively modest psychedelic activity.',
  halfLife: { hours: 0.5, range: [0.3, 1], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: '5-hydroxyindole-3-acetic acid', fraction: 0.6,
        note: 'Rapid, as with DMT — MAOIs potentiate it substantially and dangerously.' },
      { enzyme: 'UGT / SULT', reaction: 'Conjugation', product: 'Bufotenine glucuronide/sulfate', fraction: 0.25 }
    ],
    metabolites: [
      { name: '5-HIAA', active: false, halfLifeH: 1, fraction: 0.6 },
      { name: 'Bufotenine glucuronide', active: false, halfLifeH: 1.5, fraction: 0.25 }
    ],
    substrateOf: ['MAO-A', 'UGT'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [10, 25], durationH: [0.5, 1.5], afterEffectsH: [0.5, 3], bioavailability: 0.6,
      doses: { threshold: 2, light: [5, 15], common: [15, 40], strong: [40, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'The peripheral cardiovascular load — severe flushing, chest tightness, marked blood pressure changes — is disproportionate to the psychedelic effect and is the main danger.',
    'MAOI-contraindicated.'
  ],
  sources: ['Shen et al. 2010, Drug Metab Dispos', 'McBride 2000, J Psychoactive Drugs']
},

{
  id: '11-oh-thc', name: '11-OH-THC', aliases: ['11-hydroxy-thc'],
  class: 'Cannabinoid', family: 'Phytocannabinoid metabolite', schedule: 'Formed in vivo',
  tags: ['cannabinoid', 'cb1-agonist', 'psychosis-risk', 'tachycardia'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'The active metabolite of THC and more potent than THC itself, with better blood-brain barrier penetration. Eating cannabis produces far more of it than smoking does, because first-pass metabolism converts a large share of the dose — this is the actual pharmacological reason edibles feel qualitatively different and stronger.',
  halfLife: { hours: 12, range: [8, 25], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation to the carboxylic acid', product: '11-nor-9-carboxy-THC', fraction: 0.7,
        note: 'Produces the inactive, fat-stored species that urine drug screens detect for weeks.' },
      { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation', product: '11-OH-THC glucuronide', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'THC-COOH (11-nor-9-carboxy-THC)', active: false, halfLifeH: 120, fraction: 0.7,
        note: 'Inactive; the drug-test target. Named both ways in the literature, so both are here.' },
      { name: '11-OH-THC glucuronide', active: false, halfLifeH: 15, fraction: 0.25 }
    ],
    substrateOf: ['ADH', 'UGT1A9', 'UGT2B7'], excretion: 'Faecal and renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [4, 10], afterEffectsH: [6, 24], bioavailability: 0.1,
      doses: { threshold: 0.5, light: [1, 3], common: [3, 8], strong: [8, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'More potent than THC. The reason a 10 mg edible can feel far stronger than 10 mg smoked is that much more of it becomes this compound.',
    'Long duration; the usual edible over-consumption pattern applies.'
  ],
  sources: ['Huestis 2007, Chem Biodivers', 'Grotenhermen 2003, Clin Pharmacokinet']
},

{
  id: 'desvenlafaxine', name: 'Desvenlafaxine', aliases: ['pristiq', 'o-desmethylvenlafaxine'],
  class: 'Antidepressant', family: 'SNRI', schedule: 'Prescription',
  tags: ['snri', 'serotonergic', 'serotonin-syndrome-risk', 'mao-contraindicated',
         'hypertensive-risk', 'discontinuation-syndrome'],
  mechanism: 'The active metabolite of venlafaxine, marketed separately. Because it needs no CYP2D6 conversion, its levels are consistent regardless of genotype or 2D6 inhibitors — the main clinical reason to choose it over venlafaxine.',
  halfLife: { hours: 11, range: [9, 13], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A1 / UGT2B15', reaction: 'Glucuronidation', product: 'Desvenlafaxine glucuronide', fraction: 0.45,
        note: 'Primary route, and non-CYP — hence the predictable exposure.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N,O-didesmethylvenlafaxine', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Desvenlafaxine glucuronide', active: false, halfLifeH: 12, fraction: 0.45 },
      { name: 'N,O-didesmethylvenlafaxine', active: false, halfLifeH: 12, fraction: 0.15 }
    ],
    substrateOf: ['UGT1A1', 'UGT2B15', 'CYP3A4'], inhibits: [],
    excretion: 'Renal, ~45% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [240, 480], peakMin: [420, 480], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 25, light: [25, 50], common: [50, 100], strong: [100, 200], heavy: 400, unit: 'mg' } }
  },
  warnings: [
    'Contraindicated with MAOIs; 2-week washout.',
    'Serotonin syndrome risk with MDMA, tramadol, DXM and triptans. Raises blood pressure dose-dependently.',
    'Marked discontinuation syndrome; taper slowly.'
  ],
  sources: ['DrugBank DB06700']
},

{
  id: 'butylone', name: 'Butylone', aliases: ['bk-mbdb', 'b1'],
  class: 'Entactogen', family: 'Cathinone', schedule: 'I (US)',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'hyperthermia-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 10, minRedoseDays: 28,
  mechanism: 'β-keto analogue of MBDB and the N-desethyl metabolite of eutylone, sold as an RC in its own right. A monoamine releaser with a milder, more stimulant-leaning profile than MDMA.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylenation', product: 'Dihydroxy metabolite', fraction: 0.4 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'Methoxy-hydroxy-butylone', fraction: 0.3, note: 'Main urinary marker.' },
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Nor-butylone', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Methoxy-hydroxy-butylone', active: false, halfLifeH: 4, fraction: 0.3 },
      { name: 'Nor-butylone', active: true, halfLifeH: 3, potencyRel: 0.4, fraction: 0.1 }
    ],
    substrateOf: ['CYP2D6', 'COMT'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 110], durationH: [3, 5], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 50, light: [75, 125], common: [125, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: ['Serotonergic; MAOI-contraindicated. Frequently found in tablets sold as MDMA.'],
  sources: ['Zaitsu et al. 2009, Forensic Sci Int', 'EMCDDA notifications']
},

{
  id: 'pentylone', name: 'Pentylone', aliases: ['bk-mbdp', 'ephylone-related'],
  class: 'Entactogen', family: 'Cathinone', schedule: 'I (US)',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonergic', 'mao-contraindicated',
         'compulsive-redosing', 'hyperthermia-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 10,
  mechanism: 'Methylenedioxy cathinone and the N-demethyl metabolite of dimethylpentylone. More stimulant and less entactogenic than MDMA, with a longer duration.',
  halfLife: { hours: 4, range: [2, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylenation', product: 'Dihydroxy-pentylone', fraction: 0.4 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'Methoxy-hydroxy-pentylone', fraction: 0.3, note: 'Urinary marker.' }
    ],
    metabolites: [{ name: 'Methoxy-hydroxy-pentylone', active: false, halfLifeH: 5, fraction: 0.3 }],
    substrateOf: ['CYP2D6', 'COMT'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 30, light: [50, 100], common: [100, 175], strong: [175, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: [
    'A very common MDMA substitute. Because it is more stimulating and much less entactogenic, people redose chasing an effect that will not arrive.',
    'Severe insomnia and compulsive redosing are characteristic.'
  ],
  sources: ['DEA Emerging Threat Reports', 'CFSRE NPS Discovery']
}

]);
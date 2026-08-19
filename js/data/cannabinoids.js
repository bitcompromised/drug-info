/* Cannabinoids, deliriants, inhalants and miscellaneous */
DB.register([

{
  id: 'thc', name: 'THC', aliases: ['cannabis', 'weed', 'marijuana', 'delta-9-thc', 'dronabinol', 'pot'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'I (US federal); legal in many jurisdictions',
  tags: ['cannabinoid', 'cb1-agonist', 'anxiogenic-high-dose', 'psychosis-risk', 'tachycardia',
         'addictive', 'lipophilic-accumulation'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'Partial agonist at CB1 (central, psychoactive) and CB2 (peripheral, immune) receptors. Partial agonism is why plant cannabis has a wide safety margin — and why full-agonist synthetics do not.',
  halfLife: { hours: 30, range: [20, 120], confidence: 'measured',
    notes: 'Deeply misleading if taken at face value. THC is extremely lipophilic and stores in fat, then leaches back out. Terminal half-life is ~1.3 days in occasional users but 5-13 DAYS in chronic heavy users — which is why urine tests stay positive for weeks while the subjective effect lasts hours. The effect curve and elimination curve are almost completely decoupled for this drug.' },
  metabolism: {
    firstPass: 'Heavy when eaten — oral bioavailability is only 4-20%, and first-pass metabolism converts much of it to the more potent 11-OH-THC. This is the entire reason edibles feel qualitatively different and stronger than smoking.',
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Allylic hydroxylation at C11', product: '11-Hydroxy-THC', fraction: 0.5	,
        note: 'Produces an ACTIVE metabolite more potent than THC itself and better at crossing the blood-brain barrier. CYP2C9*3/*3 poor metabolisers (~1%) reach ~3x the THC exposure of normal metabolisers.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: '8β-Hydroxy-THC', fraction: 0.2 },
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation of 11-OH-THC', product: '11-nor-9-carboxy-THC (THC-COOH)', fraction: 0.45,
        note: 'Inactive, but stored in fat and slowly released — this is what urine drug screens detect for weeks after use.' },
      { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation', product: 'THC-COOH-glucuronide', fraction: 0.4 }
    ],
    metabolites: [
      { name: '11-Hydroxy-THC', active: true, halfLifeH: 12, potencyRel: 1.5,
        note: 'More potent than THC and formed in far greater quantity when eaten than when smoked. This is the pharmacological basis of the "edibles hit differently" effect.' },
      { name: 'THC-COOH', from: '11-Hydroxy-THC', active: false, halfLifeH: 120,
        note: 'Inactive. Extremely long-lived in fat; the target of standard drug tests and detectable for up to 30 days in heavy users.' }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4', 'UGT1A9', 'UGT2B7'], inhibits: [],
    excretion: 'Faecal ~65%, renal ~20%, as conjugated THC-COOH.',
    confidence: 'measured'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [10, 30], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.3,
      doses: { threshold: 1, light: [2.5, 5], common: [5, 15], strong: [15, 30], heavy: 30, unit: 'mg' } },
    vaporised: { onsetMin: [0.5, 5], peakMin: [10, 25], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.4,
      doses: { threshold: 1, light: [2, 5], common: [5, 12], strong: [12, 25], heavy: 25, unit: 'mg' } },
    /* Oral THC is well absorbed and heavily extracted, and the extraction
       does not stop at 11-OH-THC: a large share of what the first pass makes
       is oxidised straight on to THC-COOH before any of it circulates. Left
       out, the whole 80% presystemic loss arrived in the 11-OH-THC
       compartment and peaked at 1.65x the THC — where the measured oral
       ratio is about 1:1, and it is the CONTRAST with smoking (~0.1:1) that
       makes edibles feel different. `metabolisedFraction` is how much of the
       dose becomes the products listed here; the remaining third goes past
       them on the way in. Smoked and vaporised need no such figure — they
       skip the first pass entirely and already read ~0.11:1. */
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [4, 10], afterEffectsH: [6, 24], bioavailability: 0.2,
      metabolisedFraction: 0.62,
      doses: { threshold: 1, light: [2.5, 5], common: [5, 15], strong: [15, 30], heavy: 30, unit: 'mg',
        note: 'The 45-150 minute onset is the single biggest cause of edible overconsumption. Wait a full 2 hours before considering more.' } }
  },
  warnings: [
    'Edibles: the delayed onset causes repeated dosing before the first dose lands. Uncomfortable but non-fatal overconsumption is extremely common; start with 2.5-5 mg and wait two hours.',
    'Associated with an increased risk of psychosis in predisposed individuals, particularly with high-potency products and adolescent use.',
    'Cannabinoid hyperemesis syndrome — cyclical severe vomiting relieved by hot showers — occurs in long-term daily users and is frequently misdiagnosed for years.',
    'Raises heart rate substantially for an hour or so; combined with stimulants this compounds cardiac strain.'
  ],
  refs: ['Huestis 2007, Chem Biodivers', 'Grotenhermen 2003, Clin Pharmacokinet']
},

{
  id: 'cbd', name: 'CBD', aliases: ['cannabidiol', 'epidiolex'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Largely unscheduled',
  tags: ['cannabinoid', 'anxiolytic', 'anticonvulsant', 'cyp-inhibitor', 'non-intoxicating'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'Not a CB1 agonist and not intoxicating. Acts as a CB1 negative allosteric modulator, 5-HT1A agonist, TRPV1 agonist and FAAH inhibitor. Its most consequential real-world property is potent CYP inhibition.',
  halfLife: { hours: 24, range: [18, 32], confidence: 'measured', notes: 'Long terminal half-life due to fat storage, similar to THC.' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~6%, rising several-fold when taken with a high-fat meal.',
    pathways: [
      { enzyme: 'CYP2C19', reaction: '7-hydroxylation', product: '7-OH-CBD', fraction: 0.4, note: 'Active metabolite.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated CBD species', fraction: 0.3 },
      { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation', product: 'CBD-glucuronide', fraction: 0.3 }
    ],
    metabolites: [{ name: '7-OH-CBD', active: true, halfLifeH: 20, potencyRel: 0.8, note: 'Active; contributes to the anticonvulsant effect.' },
                  { name: '7-COOH-CBD', active: false, note: 'Main circulating metabolite.' }],
    substrateOf: ['CYP2C19', 'CYP3A4', 'UGT1A9'],
    inhibits: ['CYP2C19', 'CYP3A4', 'CYP2C9', 'CYP2D6', 'CYP1A2', 'UGT1A9', 'UGT2B7'],
    excretion: 'Faecal predominantly.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.06,
      doses: { threshold: 5, light: [10, 25], common: [25, 100], strong: [100, 300], heavy: 300, unit: 'mg' } },
    sublingual: { onsetMin: [15, 45], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.15,
      doses: { threshold: 5, light: [10, 25], common: [25, 100], strong: [100, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: [
    'CBD is a broad and potent CYP inhibitor — this is its most important safety property and it is widely ignored because it is sold as a wellness supplement. It substantially raises levels of clobazam, warfarin, some antiepileptics, and many other drugs.',
    'At high doses it raises liver enzymes; this was a consistent finding in the Epidiolex trials.'
  ],
  refs: ['Millar et al. 2018, Front Pharmacol', 'Brown & Winterstein 2019, J Clin Med']
},

{
  id: 'mdmb-4en-pinaca', name: 'MDMB-4en-PINACA', aliases: ['synthetic cannabinoid', 'spice', 'k2', 'noids'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (indazole carboxamide)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'cardiotoxic', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'FULL agonist at CB1, unlike THC which is a partial agonist. Removing the partial-agonist ceiling is precisely why synthetic cannabinoids cause seizures, cardiac events and deaths that plant cannabis does not. Representative of a class containing hundreds of analogues.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated', notes: 'No human PK data for most compounds in this class; estimated from analogues.' },
  metabolism: {
    pathways: [
      { enzyme: 'CES1', reaction: 'Ester hydrolysis of the methyl ester', product: 'MDMB-4en-PINACA butanoic acid', fraction: 0.5,
        note: 'Main route identified in human hepatocyte studies; metabolite is the standard urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Oxidative defluorination / hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Ester hydrolysis metabolite', active: false, note: 'Some synthetic cannabinoid metabolites retain CB1 activity, which prolongs and complicates intoxication.' }],
    substrateOf: ['CES1', 'CYP3A4'], excretion: 'Renal and faecal.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [0.5, 2], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.05, light: [0.1, 0.5], common: [0.5, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg',
        note: 'Active in fractions of a milligram. Sprayed onto plant material with notoriously uneven distribution — one part of a batch may be inert and another lethal.' } }
  },
  warnings: [
    'This class has caused mass-casualty poisoning events, seizures, kidney failure, strokes and deaths in ways plant cannabis does not. Full CB1 agonism removes the safety ceiling.',
    'Uneven spraying onto herbal material means dose per gram is unpredictable even within a single bag.',
    'Not detected by standard cannabis drug tests, which is why it is common in prisons and probation settings.',
    'The specific compounds change constantly as each is banned, so accumulated user experience never applies to the current batch.'
  ],
  refs: ['EMCDDA synthetic cannabinoid reports', 'Kevin et al. 2019, Forensic Toxicol']
},

/* ---------------- Deliriants ---------------- */
{
  id: 'diphenhydramine', name: 'Diphenhydramine', aliases: ['benadryl', 'dph', 'nytol', 'sominex'],
  class: 'Deliriant', family: 'Ethanolamine antihistamine', schedule: 'OTC',
  tags: ['deliriant', 'anticholinergic', 'antihistamine', 'sedative', 'qt-prolonging',
         'high-toxicity', 'anticholinergic-toxicity', 'cardiotoxic'],
  toleranceGroup: 'anticholinergic', toleranceHalfLifeDays: 2,
  mechanism: 'H1 antihistamine that is also a potent muscarinic acetylcholine antagonist. The antimuscarinic action is what produces delirium at high doses, and it also blocks cardiac sodium channels in overdose.',
  halfLife: { hours: 8, range: [4, 14], confidence: 'measured', notes: 'Longer in the elderly (up to 18 h) and in CYP2D6 poor metabolisers.' },
  metabolism: {
    firstPass: 'Heavy; oral bioavailability only 40-60%.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'N-desmethyldiphenhydramine', fraction: 0.5,
        note: 'Primary route. Diphenhydramine also INHIBITS CYP2D6, so it slows its own clearance and that of many co-administered drugs — a common and overlooked interaction.' },
      { enzyme: 'CYP1A2 / CYP2C9 / CYP2C19', reaction: 'Secondary demethylation', product: 'N,N-didesmethyl metabolite', fraction: 0.2 },
      { enzyme: 'ADH', reaction: 'Oxidation to the acid', product: 'Diphenylmethoxyacetic acid', fraction: 0.2 }
    ],
    metabolites: [{ name: 'N-desmethyldiphenhydramine', active: true, potencyRel: 0.3 },
                  { name: 'Diphenylmethoxyacetic acid', active: false }],
    substrateOf: ['CYP2D6', 'CYP1A2', 'CYP2C9'], inhibits: ['CYP2D6'],
    excretion: 'Renal, as conjugated metabolites; <2% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [8, 24], bioavailability: 0.5,
      doses: { threshold: 25, light: [50, 100], common: [100, 300], strong: [300, 500], heavy: 500, unit: 'mg',
        note: 'Therapeutic dose is 25-50 mg. Deliriant doses begin around 300 mg and are genuinely dangerous.' } }
  },
  warnings: [
    'The deliriant experience is near-universally described as terrifying rather than enjoyable: realistic hallucinations of people and insects indistinguishable from reality, total confusion, and no insight that one is intoxicated.',
    'Overdose causes anticholinergic toxidrome — hyperthermia, urinary retention, tachycardia, seizures — plus sodium channel blockade causing wide-complex arrhythmias. Deaths occur above roughly 1 g.',
    'Long-term regular anticholinergic use is associated with increased dementia risk.',
    'Inhibits CYP2D6, raising levels of many other drugs including opioids and antidepressants.'
  ],
  refs: ['DrugBank DB01075', 'Radovanovic et al. 2000, Hum Exp Toxicol']
},

/* ---------------- Inhalants ---------------- */
{
  id: 'amyl-nitrite', name: 'Alkyl nitrites', aliases: ['poppers', 'amyl nitrite', 'isopropyl nitrite', 'rush'],
  class: 'Inhalant', family: 'Alkyl nitrite', schedule: 'Varies; sold as room odourisers',
  tags: ['inhalant', 'vasodilator', 'nitric-oxide-donor', 'methaemoglobinaemia-risk',
         'hypotension-risk', 'pde5-contraindicated'],
  toleranceGroup: 'nitrite', toleranceHalfLifeDays: 0.02,
  mechanism: 'Releases nitric oxide, causing rapid smooth muscle relaxation — profound vasodilation, a head rush, and relaxation of involuntary sphincter muscle.',
  halfLife: { hours: 0.02, range: [0.01, 0.05], confidence: 'estimated', notes: 'Effect lasts under two minutes.' },
  metabolism: {
    pathways: [
      { enzyme: 'Non-enzymatic hydrolysis / esterases', reaction: 'Hydrolysis releasing nitrite ion', product: 'Nitrite + corresponding alcohol', fraction: 0.9 },
      { enzyme: 'Methaemoglobin reductase (NADH-cytochrome b5)', reaction: 'Reduction of methaemoglobin formed by nitrite', product: 'Haemoglobin', fraction: 0.8,
        note: 'This is the protective pathway — when overwhelmed, methaemoglobinaemia results.' }
    ],
    metabolites: [{ name: 'Nitrite ion', active: true, halfLifeH: 0.5,
      note: 'Oxidises haemoglobin to methaemoglobin, which cannot carry oxygen. Excess causes cyanosis and hypoxia treated with methylene blue.' }],
    substrateOf: ['CES1'], excretion: 'Renal as nitrate; some exhaled.', confidence: 'estimated'
  },
  routes: {
    inhaled: { onsetMin: [0.1, 0.3], peakMin: [0.3, 0.7], durationH: [0.01, 0.05], afterEffectsH: [0.05, 0.3], bioavailability: 1.0,
      doses: { threshold: 1, light: [1, 1], common: [1, 2], strong: [2, 3], heavy: 3, unit: 'inhalations' } }
  },
  warnings: [
    'NEVER combine with sildenafil (Viagra), tadalafil or any PDE5 inhibitor — both drive the same nitric oxide pathway and the combination causes catastrophic, unresponsive hypotension. This has killed people and is the single most important interaction here.',
    'Swallowing rather than inhaling causes severe methaemoglobinaemia and can be fatal.',
    'Isopropyl nitrite specifically has been linked to maculopathy and permanent vision loss.',
    'Highly flammable; do not use near flame.'
  ],
  refs: ['Romanelli et al. 2004, Pharmacotherapy', 'Davies et al. 2012, Br J Ophthalmol']
},

/* ---------------- Misc ---------------- */
{
  id: 'melatonin', name: 'Melatonin',
  class: 'Other', family: 'Indoleamine hormone', schedule: 'OTC in US; prescription in EU/UK',
  tags: ['hypnotic', 'chronobiotic', 'hormone'],
  toleranceGroup: 'melatonin', toleranceHalfLifeDays: 7,
  mechanism: 'MT1 and MT2 receptor agonist. It shifts circadian phase rather than sedating directly — timing matters far more than dose, and most people take far too much far too late.',
  halfLife: { hours: 0.75, range: [0.5, 1], confidence: 'measured' },
  metabolism: {
    firstPass: 'Very heavy and highly variable; oral bioavailability ranges from 3% to 33% between individuals.',
    pathways: [
      { enzyme: 'CYP1A2', reaction: '6-hydroxylation', product: '6-Hydroxymelatonin', fraction: 0.9,
        note: 'Dominant. Fluvoxamine, a strong CYP1A2 inhibitor, raises melatonin exposure up to 20-fold. Smoking induces CYP1A2 and lowers it.' },
      { enzyme: 'SULT1A1', reaction: 'Sulfation', product: '6-Sulfatoxymelatonin', fraction: 0.85, note: 'The standard urinary marker of melatonin production.' }
    ],
    metabolites: [{ name: '6-Sulfatoxymelatonin', active: false }],
    substrateOf: ['CYP1A2', 'SULT1A1'], excretion: 'Renal, ~90% as the sulfate conjugate.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [45, 90], durationH: [2, 5], afterEffectsH: [2, 8], bioavailability: 0.15,
      doses: { threshold: 0.1, light: [0.3, 0.5], common: [0.5, 3], strong: [3, 5], heavy: 10, unit: 'mg',
        note: 'Evidence favours LOW doses — 0.3-0.5 mg is often more effective than 5-10 mg, which can overshoot and cause grogginess. For phase shifting, take it 4-6 hours before target sleep time.' } }
  },
  warnings: ['Higher is not better; doses above ~3 mg frequently worsen next-day grogginess without improving sleep onset.'],
  refs: ['Harpsoe et al. 2015, Eur J Clin Pharmacol', 'Zhdanova et al. 2001, J Clin Endocrinol Metab']
}

]);

/* Cannabinoids and deliriants — second wave */
DB.register([

{
  id: 'delta-8-thc', name: 'Delta-8-THC', aliases: ['d8', 'delta 8'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Legal grey area (US Farm Bill)',
  tags: ['cannabinoid', 'cb1-agonist', 'psychosis-risk', 'tachycardia', 'addictive', 'lipophilic-accumulation'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'Double-bond isomer of delta-9-THC with lower CB1 affinity — roughly half to two-thirds the potency, and widely reported as less anxiogenic.',
  halfLife: { hours: 30, range: [20, 120], confidence: 'analogue', notes: 'Assumed similar to delta-9-THC; same fat-storage behaviour and same long detection window.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: '11-hydroxylation', product: '11-OH-delta-8-THC', fraction: 0.5, note: 'Active metabolite, as with delta-9.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated species', fraction: 0.2 },
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation', product: '11-nor-delta-8-THC-COOH', fraction: 0.4 }
    ],
    metabolites: [
      { name: '11-OH-delta-8-THC', active: true, halfLifeH: 12, potencyRel: 1.5 },
      { name: '11-nor-delta-8-THC-COOH', active: false, halfLifeH: 120, note: 'Cross-reacts with standard cannabis drug tests — delta-8 will fail a THC screen.' }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4', 'UGT'], excretion: 'Faecal and renal.', confidence: 'analogue'
  },
  routes: {
    vaporised: { onsetMin: [0.5, 5], peakMin: [10, 25], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.4,
      doses: { threshold: 2, light: [5, 10], common: [10, 25], strong: [25, 50], heavy: 50, unit: 'mg' } },
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [4, 10], afterEffectsH: [6, 24], bioavailability: 0.1,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: [
    'Delta-8 does not occur in useful quantities naturally — it is manufactured by acid-catalysed isomerisation of CBD. That process leaves reaction by-products, residual acids and unidentified isomers, and the market is largely untested and unregulated. Contamination, not the cannabinoid, is the main concern.',
    'It will fail a standard cannabis drug test.'
  ],
  refs: ['Kruger & Kruger 2022, J Cannabis Res', 'FDA delta-8 consumer advisory']
},

{
  id: 'hhc', name: 'HHC', aliases: ['hexahydrocannabinol'],
  class: 'Cannabinoid', family: 'Semi-synthetic cannabinoid', schedule: 'Legal grey area / banned in parts of EU',
  tags: ['cannabinoid', 'cb1-agonist', 'psychosis-risk', 'tachycardia', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'Hydrogenated THC analogue. Produced as a mixture of 9R and 9S epimers of which only the 9R is meaningfully active, so potency varies with the epimer ratio of a given batch — an unusually direct source of unpredictability.',
  halfLife: { hours: 25, range: [15, 100], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: '11-hydroxylation (presumed)', product: '11-OH-HHC', fraction: 0.45, note: 'By analogy with THC; presumed active.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated species', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: '11-OH-HHC', active: true, halfLifeH: 12, potencyRel: 1.5 },
                  { name: '11-nor-9-carboxy-HHC', active: false, note: 'Does NOT reliably trigger standard THC drug tests — part of why it is marketed.' }],
    substrateOf: ['CYP2C9', 'CYP3A4'], excretion: 'Faecal and renal.', confidence: 'unknown'
  },
  routes: {
    vaporised: { onsetMin: [0.5, 5], peakMin: [10, 25], durationH: [2, 5], afterEffectsH: [2, 10], bioavailability: 0.4,
      doses: { threshold: 2, light: [5, 10], common: [10, 25], strong: [25, 45], heavy: 45, unit: 'mg' } },
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [5, 10], afterEffectsH: [6, 24], bioavailability: 0.1,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 70], heavy: 70, unit: 'mg' } }
  },
  warnings: [
    'Batch potency varies substantially because the active 9R epimer fraction differs between manufacturers, and products are rarely tested for it.',
    'Essentially no human safety or pharmacokinetic data exists.'
  ],
  refs: ['Ujváry 2023, Drug Test Anal', 'EMCDDA HHC report 2023']
},

{
  id: 'cbn', name: 'CBN', aliases: ['cannabinol'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Largely unscheduled',
  tags: ['cannabinoid', 'cb1-partial-agonist', 'sedative', 'non-intoxicating-mild'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'The oxidative degradation product of THC — it accumulates as cannabis ages. A weak CB1 partial agonist, roughly a tenth of THC\'s potency. Its reputation as a sedative is not well supported by controlled evidence.',
  halfLife: { hours: 15, range: [8, 30], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: '11-hydroxylation', product: '11-OH-CBN', fraction: 0.4 },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated species', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: '11-OH-CBN', active: true, potencyRel: 1.2 }],
    substrateOf: ['CYP2C9', 'CYP3A4'], excretion: 'Faecal and renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [4, 8], afterEffectsH: [4, 12], bioavailability: 0.1,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 30], strong: [30, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: ['Marketed heavily as a sleep aid; the controlled evidence for that is weak.'],
  refs: ['Corroon 2021, Cannabis Cannabinoid Res']
},

{
  id: 'jwh-018', name: 'JWH-018', aliases: ['spice', 'k2', 'aminoalkylindole'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (naphthoylindole)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'psychosis-risk', 'tachycardia', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'The original widely-distributed synthetic cannabinoid. A FULL CB1 agonist roughly 4x the affinity of THC — the absence of THC\'s partial-agonist ceiling is why this class causes harms cannabis does not.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation of the pentyl chain', product: 'ω-Hydroxy-JWH-018', fraction: 0.4,
        note: 'CRITICAL: several hydroxylated metabolites retain FULL CB1 agonist activity, unlike THC whose main metabolites are largely inactive. Metabolism does not end the intoxication, which is part of why overdoses last so long.' },
      { enzyme: 'CYP1A2 / CYP2C19', reaction: 'Hydroxylation', product: 'Hydroxyindole metabolites', fraction: 0.25 },
      { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'ω-Hydroxy-JWH-018', active: true, halfLifeH: 3, potencyRel: 1.0, note: 'Fully active at CB1.' },
      { name: 'JWH-018 N-pentanoic acid', active: false, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP2C9', 'CYP1A2', 'CYP2C19', 'UGT'], excretion: 'Renal and faecal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 4], strong: [4, 8], heavy: 8, unit: 'mg' } }
  },
  warnings: [
    'Causes seizures, severe tachycardia, psychosis, kidney injury and deaths that plant cannabis does not. Active metabolites prolong the effect.',
    'Sprayed onto herbal material with wildly uneven distribution — dose per gram is unpredictable within a single bag.',
    'Not detected by standard cannabis drug tests.'
  ],
  refs: ['Wiley et al. 2014, Handb Exp Pharmacol', 'Chimalakonda et al. 2012, Drug Metab Dispos']
},

/* ---------------- Deliriants ---------------- */
{
  id: 'dimenhydrinate', name: 'Dimenhydrinate', aliases: ['dramamine', 'gravol'],
  class: 'Deliriant', family: 'Ethanolamine antihistamine', schedule: 'OTC',
  tags: ['deliriant', 'anticholinergic', 'antihistamine', 'sedative', 'qt-prolonging',
         'high-toxicity', 'anticholinergic-toxicity', 'cardiotoxic'],
  toleranceGroup: 'anticholinergic', toleranceHalfLifeDays: 2,
  mechanism: 'A salt of diphenhydramine and 8-chlorotheophylline — it dissociates in the body, so it is pharmacologically diphenhydramine plus a small stimulant counterweight intended to offset drowsiness.',
  halfLife: { hours: 8, range: [4, 14], confidence: 'measured', notes: 'This is the diphenhydramine component; the theophylline component clears in ~8 h.' },
  metabolism: {
    pathways: [
      { enzyme: 'Dissociation (non-enzymatic)', reaction: 'Salt dissociates in solution', product: 'Diphenhydramine + 8-chlorotheophylline', fraction: 1.0 },
      { enzyme: 'CYP2D6', reaction: 'N-demethylation of diphenhydramine', product: 'N-desmethyldiphenhydramine', fraction: 0.5 },
      { enzyme: 'CYP1A2', reaction: 'Demethylation of the theophylline component', product: 'Methylxanthines', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Diphenhydramine', active: true, halfLifeH: 8, potencyRel: 1.0, note: 'The actual deliriant. 100 mg dimenhydrinate ≈ 55 mg diphenhydramine.' },
      { name: '8-Chlorotheophylline', active: true, halfLifeH: 8, potencyRel: 0.05, note: 'Mild stimulant related to caffeine.' }
    ],
    substrateOf: ['CYP2D6', 'CYP1A2'], inhibits: ['CYP2D6'],
    excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [8, 24], bioavailability: 0.5,
      doses: { threshold: 50, light: [100, 200], common: [200, 500], strong: [500, 900], heavy: 900, unit: 'mg' } }
  },
  warnings: [
    'Same anticholinergic toxidrome and cardiac sodium channel blockade as diphenhydramine, with the same near-universally terrifying deliriant experience.',
    'Long-term anticholinergic use is associated with raised dementia risk.'
  ],
  refs: ['DrugBank DB00985']
},

{
  id: 'scopolamine', name: 'Scopolamine', aliases: ['hyoscine', 'devils breath', 'datura', 'burundanga'],
  class: 'Deliriant', family: 'Tropane alkaloid', schedule: 'Prescription (as patch)',
  tags: ['deliriant', 'anticholinergic', 'amnestic', 'high-toxicity', 'anticholinergic-toxicity',
         'narrow-therapeutic-index'],
  toleranceGroup: 'anticholinergic', toleranceHalfLifeDays: 2,
  mechanism: 'Potent, centrally-acting muscarinic antagonist. Used therapeutically in microgram doses for motion sickness; the deliriant and amnestic effects appear at only slightly higher amounts.',
  halfLife: { hours: 4.5, range: [2.9, 9], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~10-27%, which is why it is given transdermally.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidative demethylation', product: 'Norscopolamine', fraction: 0.3 },
      { enzyme: 'CES / esterases', reaction: 'Ester hydrolysis', product: 'Scopine + tropic acid', fraction: 0.3, note: 'Inactivating.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Norscopolamine', active: true, potencyRel: 0.2 }, { name: 'Scopine', active: false }],
    substrateOf: ['CYP3A4', 'CES1'], excretion: 'Renal, <10% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 150], durationH: [4, 8], afterEffectsH: [12, 48], bioavailability: 0.2,
      doses: { threshold: 0.1, light: [0.3, 0.6], common: [0.6, 1.2], strong: [1.2, 2], heavy: 2, unit: 'mg',
        note: 'The therapeutic patch delivers about 1 mg over THREE DAYS. Deliriant doses are close to toxic ones.' } },
    transdermal: { onsetMin: [240, 480], peakMin: [480, 1440], durationH: [48, 72], afterEffectsH: [12, 24], bioavailability: 0.5,
      doses: { threshold: 0.5, light: [1, 1], common: [1, 1.5], strong: [1.5, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: [
    'The margin between an active and a toxic dose is very narrow. Datura and Brugmansia plants contain wildly variable alkaloid concentrations between plants, parts and seasons — this is why datura poisonings are common and sometimes fatal.',
    'Causes profound amnesia and compliant, suggestible behaviour, which is why it is used in drug-facilitated crime.',
    'Anticholinergic toxidrome: hyperthermia, urinary retention, tachycardia, seizures. Effects can persist for days.',
    'This is among the least survivable recreational choices in this database; there is no safe recreational dose.'
  ],
  refs: ['Renner et al. 2005, Ther Drug Monit', 'Ardila-Gomez 2006']
}

]);

/* Minor and semi-synthetic cannabinoids — the phytocannabinoids beyond THC/CBD,
   the raw acid forms, and the isomerised/hydrogenated products sold in the
   "hemp-derived" market. Most have little or no human pharmacokinetic data. */
DB.register([

{
  id: 'cbg', name: 'CBG', aliases: ['cannabigerol'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Largely unscheduled',
  tags: ['cannabinoid', 'non-intoxicating', 'alpha2-agonist', 'cyp-inhibitor'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'The "mother cannabinoid" — its acid form CBGA is the biosynthetic precursor from which THCA, CBDA and CBCA are made, so mature plants contain very little of it. Pharmacologically it is a weak partial agonist at CB1/CB2, an alpha-2 adrenergic agonist and a 5-HT1A antagonist. Not intoxicating.',
  halfLife: { hours: 6, range: [3, 12], confidence: 'estimated',
    notes: 'Limited human PK. Like other cannabinoids it is lipophilic and stores in fat, so terminal elimination is likely much longer than the subjective effect.' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability is low and rises substantially with a fatty meal, as with CBD.',
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation of the terpene chain', product: 'Hydroxy-CBG', fraction: 0.4 },
      { enzyme: 'CYP3A4', reaction: 'Oxidation', product: 'Oxidised CBG metabolites', fraction: 0.25 },
      { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation', product: 'CBG-glucuronide', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Hydroxy-CBG', active: true, halfLifeH: 8, potencyRel: 0.5, fraction: 0.4, note: 'Presumed weakly active; not characterised in humans.' },
      { name: 'CBG-glucuronide', active: false, halfLifeH: 10, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4', 'UGT1A9'],
    inhibits: ['CYP2C9', 'CYP3A4', 'CYP2D6'],
    excretion: 'Faecal predominantly, as with other cannabinoids.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.06,
      doses: { threshold: 5, light: [10, 25], common: [25, 100], strong: [100, 250], heavy: 250, unit: 'mg' } },
    vaporised: { onsetMin: [0.5, 5], peakMin: [10, 25], durationH: [2, 4], afterEffectsH: [1, 4], bioavailability: 0.35,
      doses: { threshold: 2, light: [5, 10], common: [10, 30], strong: [30, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Non-intoxicating, but like CBD it inhibits several CYP enzymes and can therefore raise levels of co-administered medications. This is routinely ignored because it is sold as a wellness supplement.',
    'Can lower blood pressure via alpha-2 agonism; additive with clonidine and antihypertensives.'
  ],
  sources: ['Nachnani et al. 2021, J Pharmacol Exp Ther', 'Limited human data — mostly preclinical']
},

{
  id: 'cbc', name: 'CBC', aliases: ['cannabichromene'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Largely unscheduled',
  tags: ['cannabinoid', 'non-intoxicating', 'trpa1-agonist', 'anti-inflammatory'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'The third most abundant cannabinoid in many cultivars. Essentially inactive at CB1 — hence non-intoxicating — but a potent TRPA1 agonist and a weak CB2 agonist. Also inhibits anandamide reuptake, which may indirectly potentiate the endocannabinoid system.',
  halfLife: { hours: 6, range: [3, 14], confidence: 'analogue',
    notes: 'No human PK study. Assumed to follow the lipophilic cannabinoid pattern.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation', product: 'Hydroxy-CBC', fraction: 0.4 },
      { enzyme: 'CYP3A4', reaction: 'Oxidation', product: 'Oxidised metabolites', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'CBC-glucuronide', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Hydroxy-CBC', active: false, halfLifeH: 8, fraction: 0.4 },
      { name: 'CBC-glucuronide', active: false, halfLifeH: 10, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4', 'UGT'], inhibits: [],
    excretion: 'Faecal predominantly.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [4, 8], afterEffectsH: [2, 6], bioavailability: 0.06,
      doses: { threshold: 5, light: [10, 25], common: [25, 100], strong: [100, 200], heavy: 200, unit: 'mg' } },
    vaporised: { onsetMin: [0.5, 5], peakMin: [10, 25], durationH: [2, 4], afterEffectsH: [1, 4], bioavailability: 0.35,
      doses: { threshold: 2, light: [5, 10], common: [10, 30], strong: [30, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: ['Non-intoxicating. Human data is essentially absent — nearly everything known is preclinical.'],
  sources: ['DeLong et al. 2010, Drug Alcohol Depend', 'Preclinical literature only']
},

{
  id: 'cbt', name: 'CBT', aliases: ['cannabitriol', 'cannabicitran'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Unscheduled',
  tags: ['cannabinoid', 'non-intoxicating'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'A poorly characterised minor cannabinoid. "CBT" is used loosely in the market for several distinct compounds — cannabitriol and cannabicitran among them — which is itself a problem, because a product labelled CBT may not be a consistent substance batch to batch. Not known to be intoxicating.',
  halfLife: { hours: 6, range: [2, 15], confidence: 'unknown',
    notes: 'No pharmacokinetic data of any kind exists. This figure is a placeholder assuming cannabinoid-typical behaviour so the model can run; it should not be relied on.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9 / CYP3A4', reaction: 'Presumed hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.4,
        note: 'Assumed from the cannabinoid class. Not confirmed in humans or in vitro.' },
      { enzyme: 'UGT', reaction: 'Presumed glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false, halfLifeH: 8, fraction: 0.4, note: 'No metabolite has been identified.' }],
    substrateOf: ['CYP2C9', 'CYP3A4'], excretion: 'Presumed faecal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [4, 8], afterEffectsH: [2, 6], bioavailability: 0.06,
      doses: { threshold: 5, light: [10, 25], common: [25, 75], strong: [75, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: [
    'The name "CBT" is applied inconsistently to several different molecules. A product sold under it is not a defined substance.',
    'There is no pharmacology, toxicology or dosing data. Everything in this entry is a placeholder.'
  ],
  sources: ['No usable published source — entry exists to record the absence of data']
},

{
  id: 'cbdv', name: 'CBDV', aliases: ['cannabidivarin'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Largely unscheduled',
  tags: ['cannabinoid', 'non-intoxicating', 'anticonvulsant', 'trpv1-agonist'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'Propyl-chain analogue of CBD. Non-intoxicating, with anticonvulsant activity via TRPV1 desensitisation; it has been through clinical trials for epilepsy and for autism-related irritability.',
  halfLife: { hours: 20, range: [12, 30], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: '7-hydroxylation', product: '7-OH-CBDV', fraction: 0.35, note: 'Presumed active, by analogy with CBD.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated species', fraction: 0.25 },
      { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation', product: 'CBDV-glucuronide', fraction: 0.3 }
    ],
    metabolites: [
      { name: '7-OH-CBDV', active: true, halfLifeH: 18, potencyRel: 0.8, fraction: 0.35 },
      { name: 'CBDV-glucuronide', active: false, halfLifeH: 20, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C19', 'CYP3A4', 'UGT1A9'],
    inhibits: ['CYP2C19', 'CYP3A4'],
    excretion: 'Faecal predominantly.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [6, 10], afterEffectsH: [2, 8], bioavailability: 0.06,
      doses: { threshold: 10, light: [25, 50], common: [50, 200], strong: [200, 400], heavy: 400, unit: 'mg' } }
  },
  warnings: ['Non-intoxicating, but shares CBD\'s CYP inhibition and can raise levels of co-administered drugs, including antiepileptics.'],
  sources: ['GW Pharmaceuticals CBDV trial data', 'Hill et al. 2013, Br J Pharmacol']
},

{
  id: 'thcv', name: 'THCV', aliases: ['tetrahydrocannabivarin'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Varies (grey area)',
  tags: ['cannabinoid', 'cb1-antagonist-low-dose', 'cb1-agonist-high-dose', 'appetite-suppressant',
         'psychosis-risk', 'biphasic'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'Propyl analogue of THC with a genuinely BIPHASIC action: at low doses it is a neutral CB1 antagonist (suppressing appetite and blunting THC\'s effects), while at higher doses it becomes a CB1 partial agonist and is mildly intoxicating. The crossover means more is not simply stronger — it is qualitatively different.',
  halfLife: { hours: 20, range: [10, 60], confidence: 'estimated',
    notes: 'Shorter subjective duration than THC but the same lipophilic storage behaviour.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: '11-hydroxylation', product: '11-OH-THCV', fraction: 0.4, note: 'Active, as with THC.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated species', fraction: 0.2 },
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation', product: 'THCV-COOH', fraction: 0.3,
        note: 'Cross-reacts with standard THC immunoassays — THCV will fail a cannabis drug test.' }
    ],
    metabolites: [
      { name: '11-OH-THCV', active: true, halfLifeH: 12, potencyRel: 1.3, fraction: 0.4 },
      { name: 'THCV-COOH', active: false, halfLifeH: 100, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4'], excretion: 'Faecal and renal.', confidence: 'estimated'
  },
  routes: {
    vaporised: { onsetMin: [0.5, 5], peakMin: [8, 20], durationH: [1, 3], afterEffectsH: [1, 5], bioavailability: 0.35,
      doses: { threshold: 1, light: [2, 5], common: [5, 15], strong: [15, 30], heavy: 30, unit: 'mg',
        note: 'Below roughly 5 mg the antagonist effect dominates; above ~10-15 mg it becomes mildly intoxicating.' } },
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [4, 8], afterEffectsH: [4, 12], bioavailability: 0.08,
      doses: { threshold: 2, light: [5, 10], common: [10, 25], strong: [25, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'Biphasic: a larger dose does not give more of the same effect, it flips from CB1 antagonist to agonist.',
    'Marketed as a weight-loss aid on the strength of the appetite suppression; the human evidence for that is thin.',
    'Will fail a standard cannabis drug test.'
  ],
  sources: ['Englund et al. 2016, J Psychopharmacol', 'Pertwee 2008, Br J Pharmacol']
},

{
  id: 'thca', name: 'THCA', aliases: ['thca-a', 'tetrahydrocannabinolic acid'],
  class: 'Cannabinoid', family: 'Phytocannabinoid (acid)', schedule: 'Grey area',
  tags: ['cannabinoid', 'non-intoxicating-raw', 'prodrug', 'anti-inflammatory'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'The acid form actually present in the living plant. Raw THCA does not bind CB1 meaningfully and is NOT intoxicating — but heat decarboxylates it to delta-9-THC, which is. Smoking, vaping or baking converts it almost completely.',
  halfLife: { hours: 10, range: [4, 24], confidence: 'estimated',
    notes: 'As raw THCA. Once decarboxylated the relevant kinetics become THC\'s, including the multi-week fat storage.' },
  metabolism: {
    firstPass: 'Raw THCA is poorly absorbed orally and largely stays as the acid.',
    pathways: [
      { enzyme: 'Heat (non-enzymatic decarboxylation)', reaction: 'Loss of CO2 on heating above ~105 °C', product: 'Delta-9-THC', fraction: 0.9,
        note: 'Not metabolism at all, but the transformation that matters most: it is what turns an inactive compound into an intoxicating one. It happens in the lighter, the vaporiser or the oven, not in the body.' },
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation of any liberated THC', product: '11-OH-THC', fraction: 0.4 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'THCA-glucuronide', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Delta-9-THC', active: true, halfLifeH: 30, potencyRel: 50, fraction: 0.9,
        note: 'Formed by heat, not by the body. This is why "THCA flower" is sold as legal hemp and yet gets people high when smoked.' },
      { name: 'THCA-glucuronide', active: false, halfLifeH: 12, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C9', 'UGT'], excretion: 'Faecal and renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.05,
      doses: { threshold: 5, light: [10, 25], common: [25, 100], strong: [100, 250], heavy: 250, unit: 'mg',
        note: 'Raw and unheated. If it has been heated at all, dose it as THC instead — roughly 0.88 mg THC per 1 mg THCA.' } },
    smoked: { onsetMin: [0.5, 5], peakMin: [10, 30], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.3,
      doses: { threshold: 1, light: [3, 6], common: [6, 17], strong: [17, 34], heavy: 34, unit: 'mg',
        note: 'Smoking decarboxylates it — treat these as THC-equivalent doses.' } }
  },
  warnings: [
    'The central trap: THCA is sold as non-intoxicating hemp, but heating it produces ordinary THC. "THCA flower" smoked is simply cannabis.',
    'Anyone dosing raw THCA for anti-inflammatory purposes must keep it unheated, or the effect changes completely.'
  ],
  sources: ['Moreno-Sanz 2016, Cannabis Cannabinoid Res', 'Decarboxylation kinetics literature']
},

{
  id: 'cbda', name: 'CBDA', aliases: ['cannabidiolic acid'],
  class: 'Cannabinoid', family: 'Phytocannabinoid (acid)', schedule: 'Largely unscheduled',
  tags: ['cannabinoid', 'non-intoxicating', 'prodrug', '5ht1a-agonist', 'antiemetic'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'The acid precursor of CBD, present in raw plant material. Non-intoxicating. A notably potent 5-HT1A agonist — substantially more so than CBD itself, which is why it shows anti-nausea activity at very low doses. Heat converts it to CBD.',
  halfLife: { hours: 8, range: [4, 16], confidence: 'estimated',
    notes: 'Absorbed better than CBD in some preparations, but poorly characterised.' },
  metabolism: {
    pathways: [
      { enzyme: 'Heat (non-enzymatic decarboxylation)', reaction: 'Loss of CO2 on heating', product: 'CBD', fraction: 0.9,
        note: 'Occurs during smoking, vaping or cooking rather than in the body.' },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Hydroxylation of liberated CBD', product: '7-OH-CBD', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'CBDA-glucuronide', fraction: 0.35 }
    ],
    metabolites: [
      { name: 'CBD', active: true, halfLifeH: 24, potencyRel: 1.0, fraction: 0.9, note: 'Formed by heat, not metabolism.' },
      { name: 'CBDA-glucuronide', active: false, halfLifeH: 10, fraction: 0.35 }
    ],
    substrateOf: ['CYP2C19', 'CYP3A4', 'UGT'],
    inhibits: ['CYP2C19'],
    excretion: 'Faecal predominantly.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 180], durationH: [4, 8], afterEffectsH: [2, 6], bioavailability: 0.1,
      doses: { threshold: 1, light: [2, 10], common: [10, 50], strong: [50, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: ['Non-intoxicating, but converts to CBD on heating and shares CBD\'s CYP inhibition.'],
  sources: ['Rock & Parker 2013, Br J Pharmacol', 'Pellesi et al. 2021, Eur J Clin Pharmacol']
},

{
  id: 'delta-10-thc', name: 'Delta-10-THC', aliases: ['d10', 'delta 10'],
  class: 'Cannabinoid', family: 'Semi-synthetic cannabinoid', schedule: 'Legal grey area',
  tags: ['cannabinoid', 'cb1-agonist', 'psychosis-risk', 'tachycardia', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'Double-bond isomer of THC with lower CB1 affinity than either delta-9 or delta-8 — generally reported as the weakest of the three, and more stimulating than sedating.',
  halfLife: { hours: 28, range: [18, 120], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: '11-hydroxylation', product: '11-OH-delta-10-THC', fraction: 0.45, note: 'Presumed active.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated species', fraction: 0.2 },
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation', product: '11-nor-delta-10-THC-COOH', fraction: 0.35 }
    ],
    metabolites: [
      { name: '11-OH-delta-10-THC', active: true, halfLifeH: 12, potencyRel: 1.4, fraction: 0.45 },
      { name: '11-nor-delta-10-THC-COOH', active: false, halfLifeH: 110, fraction: 0.35, note: 'Cross-reacts with standard THC drug screens.' }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4'], excretion: 'Faecal and renal.', confidence: 'analogue'
  },
  routes: {
    vaporised: { onsetMin: [0.5, 5], peakMin: [10, 25], durationH: [1.5, 4], afterEffectsH: [2, 8], bioavailability: 0.4,
      doses: { threshold: 3, light: [7, 15], common: [15, 35], strong: [35, 70], heavy: 70, unit: 'mg' } },
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [4, 10], afterEffectsH: [6, 24], bioavailability: 0.1,
      doses: { threshold: 7, light: [15, 30], common: [30, 60], strong: [60, 110], heavy: 110, unit: 'mg' } }
  },
  warnings: [
    'Manufactured by acid-catalysed isomerisation of CBD, a process that leaves reaction by-products, residual acids and unidentified isomers. Contamination is the main concern, not the cannabinoid itself.',
    'Will fail a standard cannabis drug test.'
  ],
  sources: ['Ujváry 2023, Drug Test Anal', 'Market analysis literature']
},

{
  id: 'thc-o', name: 'THC-O-acetate', aliases: ['thc-o', 'thco', 'atha'],
  class: 'Cannabinoid', family: 'Semi-synthetic cannabinoid', schedule: 'Controlled (DEA: not hemp-derived)',
  tags: ['cannabinoid', 'cb1-agonist', 'prodrug', 'lung-injury-risk', 'high-toxicity',
         'psychosis-risk', 'delayed-onset'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'Acetate ester prodrug of THC, roughly 2-3× delta-9 potency once deacetylated. It is inactive as given and must be hydrolysed by esterases, producing a characteristically long delayed onset of 20-60 minutes even when inhaled.',
  halfLife: { hours: 30, range: [20, 120], confidence: 'analogue',
    notes: 'The ester is cleaved quickly; the meaningful kinetics are THC\'s.' },
  metabolism: {
    pathways: [
      { enzyme: 'CES1 / esterases', reaction: 'Deacetylation', product: 'Delta-9-THC', fraction: 0.9,
        note: 'The activating step. Its rate is what delays onset by 20-60 minutes — the single most dangerous property of this compound in practice.' },
      { enzyme: 'CYP2C9', reaction: '11-hydroxylation of liberated THC', product: '11-OH-THC', fraction: 0.45 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Delta-9-THC', active: true, halfLifeH: 30, potencyRel: 1.0, fraction: 0.9, note: 'The actual active drug.' },
      // Made from the THC the ester liberates, not from THC-O itself —
      // without that the chain forms it twice, once down each route.
      { name: '11-OH-THC', from: 'Delta-9-THC', active: true, halfLifeH: 12, potencyRel: 1.5, fraction: 0.45 }
    ],
    substrateOf: ['CES1', 'CYP2C9', 'UGT'], excretion: 'Faecal and renal.', confidence: 'analogue'
  },
  routes: {
    vaporised: { onsetMin: [20, 60], peakMin: [45, 120], durationH: [3, 6], afterEffectsH: [4, 12], bioavailability: 0.35,
      doses: { threshold: 0.5, light: [1, 3], common: [3, 8], strong: [8, 15], heavy: 15, unit: 'mg' } },
    oral: { onsetMin: [60, 180], peakMin: [150, 300], durationH: [6, 12], afterEffectsH: [8, 24], bioavailability: 0.1,
      doses: { threshold: 1, light: [2, 5], common: [5, 12], strong: [12, 25], heavy: 25, unit: 'mg' } }
  },
  warnings: [
    'VAPING THIS IS THE SERIOUS RISK: heating acetate esters produces KETENE, a colourless and highly toxic lung irritant chemically related to what caused the EVALI outbreak from vitamin E acetate. There is no established safe vaporisation temperature. Do not vape it.',
    'The 20-60 minute delayed onset — even inhaled, where people expect seconds — causes repeated redosing and severe overconsumption. This is the most common way people get hurt with it.',
    'Roughly 2-3× the potency of delta-9-THC, on top of the delay.',
    'The DEA has stated it is not a hemp-derived product and is therefore controlled.'
  ],
  sources: ['Munger et al. 2022, J Med Toxicol (ketene formation)', 'DEA determination letter 2023']
},

{
  id: 'h4cbd', name: 'H4CBD', aliases: ['hydrogenated cbd', 'tetrahydrocannabidiol'],
  class: 'Cannabinoid', family: 'Semi-synthetic cannabinoid', schedule: 'Legal grey area',
  tags: ['cannabinoid', 'cb1-partial-agonist', 'mildly-intoxicating'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 4,
  mechanism: 'Hydrogenated CBD. Unlike CBD, which barely touches CB1, H4CBD has measurable CB1 affinity and is reported to be mildly intoxicating — so it is not the non-psychoactive product its "CBD" name implies. Sold as a mixture of isomers with differing activity.',
  halfLife: { hours: 20, range: [10, 40], confidence: 'unknown',
    notes: 'No human pharmacokinetic data whatsoever. This is an assumption from CBD.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Presumed hydroxylation', product: 'Hydroxy-H4CBD', fraction: 0.4, note: 'Assumed from CBD; not characterised.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Hydroxy-H4CBD', active: true, halfLifeH: 18, potencyRel: 0.5, fraction: 0.4, note: 'Presumed; unconfirmed.' }],
    substrateOf: ['CYP2C19', 'CYP3A4'],
    inhibits: ['CYP2C19', 'CYP3A4'],
    excretion: 'Presumed faecal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [4, 10], afterEffectsH: [4, 12], bioavailability: 0.08,
      doses: { threshold: 5, light: [10, 25], common: [25, 60], strong: [60, 120], heavy: 120, unit: 'mg' } },
    vaporised: { onsetMin: [1, 8], peakMin: [15, 30], durationH: [2, 5], afterEffectsH: [2, 8], bioavailability: 0.35,
      doses: { threshold: 2, light: [5, 12], common: [12, 30], strong: [30, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'The "CBD" in the name is misleading — it is mildly intoxicating, unlike CBD, and people dose it expecting a non-psychoactive product.',
    'Sold as an isomer mixture of variable composition. No toxicology and no human data exist.'
  ],
  sources: ['Ujváry 2023, Drug Test Anal', 'No human data']
}

]);
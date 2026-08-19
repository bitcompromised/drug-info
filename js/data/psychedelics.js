/* Psychedelics — lysergamides, tryptamines, phenethylamines, others */
DB.register([

/* ---------------- Lysergamides ---------------- */
{
  id: 'lsd', name: 'LSD', aliases: ['acid', 'lysergic acid diethylamide', 'lsd-25', 'tabs'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'hallucinogen', 'hppd-risk', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Partial agonist at 5-HT2A receptors, with additional 5-HT1A, 5-HT2C, D2 and TAAR1 activity. The unusually long duration comes from a "lid" of the receptor\'s extracellular loop closing over the bound molecule, trapping it and slowing dissociation.',
  halfLife: { hours: 3.6, range: [2.6, 5.1], confidence: 'measured',
    notes: 'Formally measured by Dolder et al. (2015). Note the mismatch with the 8-12 h subjective duration — effect outlasts plasma concentration because of the slow receptor dissociation, so the PK curve and the effect curve genuinely diverge here.' },
  metabolism: {
    firstPass: 'Moderate; oral bioavailability ~71%.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation and hydroxylation', product: '2-oxo-3-hydroxy-LSD (O-H-LSD)', fraction: 0.6,
        note: 'Main urinary metabolite, pharmacologically inactive. Present at far higher concentrations than LSD itself, so it is the assay target.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nor-LSD', fraction: 0.1 },
      { enzyme: 'CYP3A4', reaction: 'Aromatic hydroxylation', product: '13- and 14-hydroxy-LSD', fraction: 0.1, note: 'Further glucuronidated.' }
    ],
    metabolites: [
      { name: '2-oxo-3-hydroxy-LSD', active: false, halfLifeH: 5, note: 'Inactive; the standard urinary marker.' },
      { name: 'Nor-LSD', active: false, note: 'Inactive or nearly so.' }
    ],
    substrateOf: ['CYP3A4'], inhibits: [],
    excretion: 'Renal, <1% unchanged — almost entirely metabolised.',
    confidence: 'measured'
  },
  routes: {
    sublingual: { onsetMin: [20, 60], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [6, 24], bioavailability: 0.71,
      doses: { threshold: 0.015, light: [0.025, 0.075], common: [0.075, 0.15], strong: [0.15, 0.3], heavy: 0.3, unit: 'mg',
        note: 'A typical modern tab is 75-150 µg, but blotter strength is unreliable — assume nothing from appearance.' } },
    oral: { onsetMin: [30, 90], peakMin: [150, 270], durationH: [8, 12], afterEffectsH: [6, 24], bioavailability: 0.71,
      doses: { threshold: 0.015, light: [0.025, 0.075], common: [0.075, 0.15], strong: [0.15, 0.3], heavy: 0.3, unit: 'mg' } }
  },
  warnings: [
    'Tolerance is near-total for several days and does not fully reset for about two weeks. Redosing within a day mostly wastes the dose.',
    'Lithium plus LSD (or any psychedelic) has caused seizures and is a genuinely dangerous combination.',
    'Can precipitate prolonged psychosis in people predisposed to schizophrenia or bipolar disorder.',
    'Blotter sold as LSD is sometimes a NBOMe compound, which is active at similar visual amounts but far more toxic. LSD is bitter-free and NBOMes are notably bitter; reagent testing is the reliable check.'
  ],
  refs: ['Dolder et al. 2015, Clin Pharmacokinet', 'Passie et al. 2008, CNS Neurosci Ther']
},

{
  id: '1p-lsd', name: '1P-LSD', aliases: ['1-propionyl-lsd'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies (banned UK/DE)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'prodrug', 'research-chemical', 'hppd-risk', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'A prodrug: the N1-propionyl group is hydrolysed in vivo to liberate LSD. Subjectively near-indistinguishable from LSD at roughly equivalent doses.',
  halfLife: { hours: 3.6, range: [2.6, 5], confidence: 'analogue',
    notes: 'The prodrug itself is cleaved quickly; the meaningful half-life is that of the LSD released.' },
  metabolism: {
    pathways: [
      { enzyme: 'Plasma/hepatic esterases', reaction: 'Hydrolysis of the N1-propionyl group', product: 'LSD', fraction: 0.9,
        note: 'Confirmed in vitro; conversion appears substantially complete.' },
      { enzyme: 'CYP3A4', reaction: 'Downstream LSD metabolism', product: '2-oxo-3-hydroxy-LSD', fraction: 0.6 }
    ],
    metabolites: [{ name: 'LSD', active: true, halfLifeH: 3.6, potencyRel: 1.0, note: 'The actual active drug.' }],
    substrateOf: ['CES1', 'CYP3A4'], excretion: 'Renal, as LSD metabolites.', confidence: 'estimated'
  },
  routes: {
    sublingual: { onsetMin: [20, 70], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [6, 24], bioavailability: 0.71,
      doses: { threshold: 0.02, light: [0.025, 0.075], common: [0.075, 0.15], strong: [0.15, 0.3], heavy: 0.3, unit: 'mg' } }
  },
  warnings: ['Same cautions as LSD: lithium interaction, psychosis risk, two-week tolerance cycle.'],
  refs: ['Brandt et al. 2016, Drug Test Anal']
},

{
  id: '1cp-lsd', name: '1cP-LSD', aliases: ['1-cyclopropanoyl-lsd'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'prodrug', 'research-chemical', 'hppd-risk', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'LSD prodrug bearing an N1-cyclopropanoyl group; hydrolysed in vivo to LSD.',
  halfLife: { hours: 3.6, range: [2.6, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'Plasma/hepatic esterases', reaction: 'Hydrolysis of the N1-acyl group', product: 'LSD', fraction: 0.85 },
      { enzyme: 'CYP3A4', reaction: 'Downstream LSD metabolism', product: '2-oxo-3-hydroxy-LSD', fraction: 0.6 }
    ],
    metabolites: [{ name: 'LSD', active: true, halfLifeH: 3.6, potencyRel: 1.0 }],
    substrateOf: ['CES1', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    sublingual: { onsetMin: [30, 80], peakMin: [150, 270], durationH: [9, 13], afterEffectsH: [6, 24], bioavailability: 0.71,
      doses: { threshold: 0.02, light: [0.025, 0.075], common: [0.075, 0.15], strong: [0.15, 0.3], heavy: 0.3, unit: 'mg' } }
  },
  warnings: ['Same cautions as LSD.'],
  refs: ['Brandt et al. 2020, Drug Test Anal']
},

{
  id: 'al-lad', name: 'AL-LAD', aliases: ['6-allyl-6-nor-lsd'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'hppd-risk', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Lysergamide with the N6-methyl replaced by allyl. Similar potency to LSD but reported as more visual, shorter and less mentally intense.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CYP3A4', reaction: 'Presumed oxidation of the allyl group and indole ring', product: 'Hydroxylated metabolites', fraction: 0.6, note: 'Not characterised in humans.' }],
    metabolites: [{ name: 'Uncharacterised', active: false }],
    substrateOf: ['CYP3A4'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    sublingual: { onsetMin: [20, 50], peakMin: [90, 180], durationH: [6, 9], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 0.02, light: [0.05, 0.1], common: [0.1, 0.15], strong: [0.15, 0.3], heavy: 0.3, unit: 'mg' } }
  },
  warnings: ['Cross-tolerant with LSD and other 5-HT2A psychedelics.'],
  refs: ['Shulgin, TiHKAL', 'Brandt et al. 2017, Drug Test Anal']
},

/* ---------------- Tryptamines ---------------- */
{
  id: 'psilocybin', name: 'Psilocybin', aliases: ['magic mushrooms', 'shrooms', 'psilocybe', 'mushrooms'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'I (US); decriminalised in some jurisdictions',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'hallucinogen', 'prodrug', 'psychosis-risk', 'hppd-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Prodrug for psilocin, a partial 5-HT2A/5-HT1A agonist. Dephosphorylation begins in the gut and is completed in the liver.',
  halfLife: { hours: 2.5, range: [1.5, 3.5], confidence: 'measured',
    notes: 'This is psilocin\'s half-life — psilocybin itself is undetectable in plasma within ~20 min. Dose is normally expressed as dried mushroom weight; Psilocybe cubensis is roughly 0.6-1% psilocybin by dry mass.' },
  metabolism: {
    firstPass: 'Complete conversion to psilocin; oral bioavailability of psilocin ~53%.',
    pathways: [
      { enzyme: 'Alkaline phosphatase / esterase', reaction: 'Dephosphorylation', product: 'Psilocin', fraction: 1.0,
        note: 'Occurs in the intestinal mucosa, kidney and liver. Fast and essentially complete.' },
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation of psilocin', product: 'Psilocin-O-glucuronide', fraction: 0.8,
        note: 'The dominant clearance route — about 80% of the dose. UGT1A10 acts in the intestine, UGT1A9 in the liver.' },
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: '4-hydroxyindole-3-acetaldehyde → 4-HIAA', fraction: 0.15 },
      { enzyme: 'CYP2D6', reaction: 'Minor N-demethylation', product: '4-hydroxy-NMT', fraction: 0.03 }
    ],
    metabolites: [
      { name: 'Psilocin', active: true, halfLifeH: 2.5, potencyRel: 1.0, note: 'The actual psychoactive compound. Psilocybin is merely its delivery form.' },
      { name: 'Psilocin-O-glucuronide', active: false, halfLifeH: 5, note: 'Main urinary metabolite; detectable ~24 h.' },
      { name: '4-HIAA', from: 'Psilocin', active: false }
    ],
    substrateOf: ['ALP', 'UGT1A10', 'UGT1A9', 'MAO-A', 'CYP2D6'], inhibits: [],
    excretion: 'Renal, ~65% as the glucuronide; ~20% biliary.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [80, 140], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.53,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 35], heavy: 35, unit: 'mg',
        note: 'As psilocybin content. In dried P. cubensis: ~1 g light, 1.75-3.5 g common, 3.5-5 g strong, 5 g+ heavy.' } }
  },
  warnings: [
    'MAOIs substantially potentiate and prolong the effect — combining is a real overdose risk, not a synergy to seek.',
    'Misidentification of wild mushrooms can be fatal; several deadly Galerina species grow alongside Psilocybe.',
    'Can precipitate lasting psychosis in predisposed individuals.'
  ],
  refs: ['Hasler et al. 1997, Pharm Acta Helv', 'Dinis-Oliveira 2017, Drug Metab Rev']
},

{
  id: '4-aco-dmt', name: '4-AcO-DMT', aliases: ['psilacetin', 'o-acetylpsilocin', '4-acetoxy-dmt'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies (analogue in US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'prodrug', 'research-chemical', 'psychosis-risk', 'hppd-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Acetylated prodrug of psilocin — deacetylated in vivo to the same active molecule as psilocybin. Widely reported as near-indistinguishable from mushrooms.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'analogue', notes: 'Assumed equal to psilocin, the released active drug.' },
  metabolism: {
    pathways: [
      { enzyme: 'Esterases (CES1/CES2)', reaction: 'Deacetylation', product: 'Psilocin', fraction: 0.9 },
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation of psilocin', product: 'Psilocin-O-glucuronide', fraction: 0.8 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: '4-HIAA', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Psilocin', active: true, halfLifeH: 2.5, potencyRel: 1.0 }],
    substrateOf: ['CES1', 'UGT1A10', 'MAO-A'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [70, 130], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 20], common: [20, 30], strong: [30, 45], heavy: 45, unit: 'mg' } }
  },
  warnings: ['MAOI potentiation risk, as with psilocybin.'],
  refs: ['Nichols & Frescas 1999, Synthesis']
},

{
  id: 'dmt', name: 'DMT', aliases: ['n,n-dmt', 'dimitri', 'n,n-dimethyltryptamine'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'hallucinogen', 'mao-substrate', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-tryptamine', toleranceHalfLifeDays: 0.1,
  mechanism: '5-HT2A agonist with additional sigma-1 and trace amine receptor activity. Notable for producing no meaningful tolerance, unlike LSD and psilocybin.',
  halfLife: { hours: 0.25, range: [0.15, 0.3], confidence: 'measured',
    notes: 'About 15 minutes. MAO-A destroys it so fast that it is orally inactive without an inhibitor — the entire basis of ayahuasca.' },
  metabolism: {
    firstPass: 'Total — oral bioavailability is effectively zero without an MAOI.',
    pathways: [
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: 'Indole-3-acetic acid (IAA)', fraction: 0.9,
        note: 'Overwhelmingly dominant. Inhibiting MAO-A (harmine, harmaline, moclobemide) is what makes oral DMT work.' },
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'N-methyltryptamine (NMT)', fraction: 0.05 },
      { enzyme: 'INMT', reaction: 'N-methylation', product: 'DMT-N-oxide', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Indole-3-acetic acid', active: false, note: 'Main inactive metabolite.' },
      { name: 'DMT-N-oxide', active: false }
    ],
    substrateOf: ['MAO-A', 'CYP2D6'], inhibits: [],
    excretion: 'Renal, mostly as IAA; <0.1% unchanged.',
    confidence: 'measured'
  },
  routes: {
    vaporised: { onsetMin: [0.1, 0.5], peakMin: [1, 3], durationH: [0.1, 0.25], afterEffectsH: [0.25, 1], bioavailability: 0.7,
      doses: { threshold: 2, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    iv: { onsetMin: [0.1, 0.3], peakMin: [1, 3], durationH: [0.15, 0.4], afterEffectsH: [0.25, 1], bioavailability: 1.0,
      doses: { threshold: 4, light: [7, 15], common: [15, 25], strong: [25, 35], heavy: 35, unit: 'mg' } },
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [3, 5], afterEffectsH: [1, 4], bioavailability: 0.1,
      doses: { threshold: 25, light: [30, 50], common: [50, 75], strong: [75, 100], heavy: 100, unit: 'mg',
        note: 'Only active orally when combined with an MAOI (ayahuasca). Doses here assume that combination.' } }
  },
  warnings: [
    'Oral use requires an MAOI, which brings the full set of MAOI dietary and drug restrictions — including a lethal interaction with SSRIs, stimulants and many other substances.',
    'Produces essentially no tolerance, which distinguishes it from other psychedelics.'
  ],
  refs: ['Strassman 1994, Arch Gen Psychiatry', 'Riba et al. 2003, J Pharmacol Exp Ther']
},

{
  id: '5-meo-dmt', name: '5-MeO-DMT', aliases: ['bufo', 'toad', '5-methoxy-dmt'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht1a-agonist', '5ht2a-agonist', 'hallucinogen',
         'mao-substrate', 'mao-contraindicated', 'serotonergic', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-tryptamine', toleranceHalfLifeDays: 0.5,
  mechanism: 'Predominantly a 5-HT1A agonist (unusually, more than 5-HT2A), producing an overwhelming non-visual dissolution rather than classic imagery.',
  halfLife: { hours: 0.2, range: [0.1, 0.5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: '5-methoxy-indole-3-acetic acid', fraction: 0.8 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Bufotenine (5-HO-DMT)', fraction: 0.15,
        note: 'Produces an active psychedelic metabolite. CYP2D6 poor metabolisers form less of it and have reported markedly different experiences.' }
    ],
    metabolites: [{ name: 'Bufotenine', active: true, halfLifeH: 0.5, potencyRel: 0.5, note: 'Active; contributes to the experience.' }],
    substrateOf: ['MAO-A', 'CYP2D6'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    vaporised: { onsetMin: [0.1, 0.5], peakMin: [1, 5], durationH: [0.25, 0.75], afterEffectsH: [0.5, 2], bioavailability: 0.7,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 15], heavy: 15, unit: 'mg' } },
    insufflated: { onsetMin: [1, 5], peakMin: [10, 20], durationH: [0.75, 1.5], afterEffectsH: [0.5, 2], bioavailability: 0.6,
      doses: { threshold: 2, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Combining with any MAOI has caused deaths. This is one of the most lethal psychedelic combinations documented.',
    'Serotonin syndrome risk with SSRIs and other serotonergics is real for this compound specifically.',
    'Frequently produces total loss of body control within seconds — a sitter is essential.'
  ],
  refs: ['Shen et al. 2010, Drug Metab Dispos', 'Sklerov et al. 2005, J Anal Toxicol']
},

{
  id: '4-ho-met', name: '4-HO-MET', aliases: ['metocin', '4-hydroxy-n-methyl-n-ethyltryptamine'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Psilocin analogue with an N-ethyl group; reported as more euphoric and visually colourful with less mental heaviness.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation (presumed)', product: '4-HO-MET glucuronide', fraction: 0.7 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Indole acetic acid derivative', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Uncharacterised glucuronide', active: false }],
    substrateOf: ['UGT1A10', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [70, 130], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 15], common: [15, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: ['MAOI potentiation risk.'],
  refs: ['Shulgin, TiHKAL']
},

{
  id: '4-ho-mipt', name: '4-HO-MiPT', aliases: ['miprocin', '4-hydroxy-n-methyl-n-isopropyltryptamine'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Psilocin analogue with an N-isopropyl group; reported as clear-headed, tactile and physically energetic.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation (presumed)', product: 'Glucuronide conjugate', fraction: 0.7 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Indole acetic acid derivative', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Uncharacterised glucuronide', active: false }],
    substrateOf: ['UGT1A10', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 15], common: [15, 25], strong: [25, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: ['MAOI potentiation risk.'],
  refs: ['Shulgin, TiHKAL']
},

/* ---------------- Phenethylamines ---------------- */
{
  id: 'mescaline', name: 'Mescaline', aliases: ['peyote', 'san pedro', 'huachuma', '3,4,5-trimethoxyphenethylamine'],
  class: 'Psychedelic', family: 'Phenethylamine', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'hallucinogen', 'mao-substrate', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: '5-HT2A agonist and the archetypal phenethylamine psychedelic. Low potency by weight, requiring gram-scale doses.',
  halfLife: { hours: 6, range: [4.5, 8], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: '3,4,5-trimethoxyphenylacetic acid (TMPAA)', fraction: 0.6,
        note: 'Dominant route; the product is inactive and accounts for most of the urinary output.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Desmethylmescaline', fraction: 0.1 },
      { enzyme: 'ADH/ALDH', reaction: 'Oxidation of the aldehyde intermediate', product: '3,4,5-trimethoxyphenylacetic acid (TMPAA)', fraction: 0.2 }
    ],
    metabolites: [
      { name: '3,4,5-Trimethoxyphenylacetic acid', active: false, note: 'Main urinary metabolite; ~60% of the dose.' },
      { name: 'N-acetylmescaline', active: false, fraction: 0.05 }
    ],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal; 20-30% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [150, 240], durationH: [10, 14], afterEffectsH: [4, 12], bioavailability: 0.8,
      doses: { threshold: 50, light: [100, 200], common: [200, 400], strong: [400, 800], heavy: 800, unit: 'mg' } }
  },
  warnings: [
    'MAOIs strongly potentiate it — a serious interaction given the already large doses.',
    'Nausea and vomiting during onset are near-universal.',
    'Peyote is a slow-growing, conservation-threatened species with protected ceremonial status for the Native American Church.'
  ],
  refs: ['Charalampous et al. 1966, J Pharmacol Exp Ther', 'Shulgin, PiHKAL #96']
},

{
  id: '2c-b', name: '2C-B', aliases: ['nexus', 'bees', '4-bromo-2,5-dimethoxyphenethylamine'],
  class: 'Psychedelic', family: 'Phenethylamine (2C)', schedule: 'I (US)',
  tags: ['psychedelic', 'entactogen', 'serotonergic', '5ht2a-agonist', 'mao-substrate',
         'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: '5-HT2A partial agonist with an unusually steep dose-response curve — the difference between a mild body-load dose and a full psychedelic one is only a few milligrams.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'estimated', notes: 'No formal human PK studies; inferred from the 4-8 h duration.' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: '2C-B carboxylic acid (BDMPAA)', fraction: 0.5,
        note: 'Main route. MAOIs therefore potentiate 2C compounds substantially and dangerously.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: '2C-B desmethyl metabolites', fraction: 0.2 },
      { enzyme: 'CYP3A4 / CYP1A2', reaction: 'Secondary oxidation', product: 'Hydroxylated metabolites', fraction: 0.1 }
    ],
    metabolites: [
      { name: '2C-B carboxylic acid', active: false, note: 'Principal urinary metabolite.' },
      { name: '2C-B-desmethyl', active: false }
    ],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [90, 150], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 5, light: [8, 15], common: [15, 25], strong: [25, 35], heavy: 35, unit: 'mg' } },
    insufflated: { onsetMin: [2, 10], peakMin: [20, 40], durationH: [2, 4], afterEffectsH: [2, 6], bioavailability: 0.8,
      doses: { threshold: 2, light: [3, 6], common: [6, 12], strong: [12, 18], heavy: 18, unit: 'mg',
        note: 'Notoriously painful to insufflate.' } }
  },
  warnings: [
    'MAOI-contraindicated — MAO is a primary clearance route, so inhibition causes large unpredictable increases in exposure.',
    'Very steep dose-response: 15 mg and 25 mg are qualitatively different experiences.'
  ],
  refs: ['Shulgin, PiHKAL #20', 'Papaseit et al. 2018, Front Pharmacol']
},

{
  id: '2c-e', name: '2C-E', aliases: ['aquarust', '4-ethyl-2,5-dimethoxyphenethylamine'],
  class: 'Psychedelic', family: 'Phenethylamine (2C)', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: '5-HT2A agonist; more intensely psychedelic and less euphoric than 2C-B, with a heavy body load.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Deamination', product: 'Corresponding phenylacetic acid', fraction: 0.5 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Desmethyl metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: '2C-E carboxylic acid', active: false }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 90], peakMin: [120, 210], durationH: [6, 10], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 2, light: [4, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Deaths have occurred from misdosing 2C-E powder.'],
  refs: ['Shulgin, PiHKAL #22']
},

{
  id: 'doc', name: 'DOC', aliases: ['4-chloro-2,5-dimethoxyamphetamine'],
  class: 'Psychedelic', family: 'Amphetamine (DOx)', schedule: 'I (US)',
  tags: ['psychedelic', 'stimulant', 'serotonergic', '5ht2a-agonist', 'vasoconstrictor',
         'mao-contraindicated', 'psychosis-risk', 'long-duration'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'Potent, highly selective 5-HT2A partial agonist. Very long-acting with strong peripheral vasoconstriction.',
  halfLife: { hours: 12, range: [8, 20], confidence: 'estimated', notes: 'Inferred from the 16-30 h duration; no human PK studies exist.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation (presumed)', product: 'Hydroxy-methoxy metabolites', fraction: 0.4 },
      { enzyme: 'MAO', reaction: 'Deamination', product: 'Phenylacetic acid derivative', fraction: 0.2, note: 'The α-methyl group makes it far more MAO-resistant than the 2C series — hence the long duration.' }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [240, 420], durationH: [16, 30], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 3], strong: [3, 5], heavy: 5, unit: 'mg' } }
  },
  warnings: [
    'Duration can exceed 24 hours — this catches people out badly.',
    'Marked vasoconstriction; overdoses have caused limb ischaemia and required amputation.',
    'Sometimes sold on blotter as LSD. Duration alone distinguishes them, but by then it is too late.'
  ],
  refs: ['Shulgin, PiHKAL #64']
},

{
  id: '25i-nbome', name: '25I-NBOMe', aliases: ['n-bomb', 'smiles', '2c-i-nbome'],
  class: 'Psychedelic', family: 'NBOMe', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'vasoconstrictor',
         'cardiotoxic', 'seizure-risk', 'high-toxicity', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'Extremely potent full 5-HT2A agonist — the N-benzylmethoxy group raises affinity roughly 15-fold over 2C-I. Full agonism, rather than the partial agonism of classical psychedelics, is thought to underlie its much higher toxicity.',
  halfLife: { hours: 3, range: [1, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-demethylation of the benzyl methoxy', product: 'O-desmethyl-25I-NBOMe', fraction: 0.4 },
      { enzyme: 'CYP2C9 / CYP2C19', reaction: 'Hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.2 },
      { enzyme: 'CYP1A2', reaction: 'N-dealkylation', product: '2C-I', fraction: 0.05, note: 'Yields an active psychedelic metabolite.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: '2C-I', active: true, halfLifeH: 4, potencyRel: 0.1, note: 'Minor active metabolite.' },
      { name: 'O-desmethyl-25I-NBOMe', active: false }
    ],
    substrateOf: ['CYP3A4', 'CYP2C9', 'CYP2C19', 'CYP1A2'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    sublingual: { onsetMin: [15, 45], peakMin: [60, 150], durationH: [4, 10], afterEffectsH: [4, 24], bioavailability: 0.6,
      doses: { threshold: 0.05, light: [0.2, 0.5], common: [0.5, 0.8], strong: [0.8, 1.2], heavy: 1.2, unit: 'mg' } }
  },
  warnings: [
    'Has caused numerous deaths at doses only modestly above recreational ones. Seizures, hyperthermia, severe hypertension, rhabdomyolysis and kidney failure are all documented.',
    'Orally inactive when swallowed, so it must be held sublingually — people who swallow it feel nothing and redose, then absorb everything at once.',
    'Very commonly mis-sold as LSD. It has a distinctly bitter, metallic taste; LSD is tasteless. If blotter tastes bitter, it is not LSD.',
    'Reagent tests: NBOMes react with Marquis/Mecke; LSD does not react the same way. Test before use.'
  ],
  refs: ['Poklis et al. 2014, J Anal Toxicol', 'Suzuki et al. 2015, Am J Emerg Med']
},

{
  id: 'ibogaine', name: 'Ibogaine',
  class: 'Psychedelic', family: 'Iboga alkaloid', schedule: 'I (US); unscheduled in some countries',
  tags: ['psychedelic', 'oneirogen', 'dissociative', 'qt-prolonging', 'cardiotoxic', 'high-toxicity',
         'nmda-antagonist', 'long-duration', 'seizure-risk'],
  toleranceGroup: 'ibogaine', toleranceHalfLifeDays: 30,
  mechanism: 'Complex polypharmacology: NMDA antagonism, kappa- and mu-opioid activity, sigma-2 agonism, nicotinic antagonism and SERT modulation. Used in unregulated clinics to interrupt opioid dependence, apparently by resetting opioid tolerance.',
  halfLife: { hours: 6, range: [4, 8], confidence: 'measured',
    notes: 'The parent drug is short-lived, but the active metabolite noribogaine has a half-life of 28-49 hours — effects and cardiac risk persist for days after the visionary phase ends.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Noribogaine', fraction: 0.8,
        note: 'Dominant route. CYP2D6 poor metabolisers (~7% of Europeans) reach much higher ibogaine levels and are at substantially greater cardiac risk — genotyping is a genuine safety measure here.' },
      { enzyme: 'CYP3A4 / CYP2C9', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.1 },
      { enzyme: 'UGT', reaction: 'Glucuronidation of noribogaine', product: 'Noribogaine glucuronide', fraction: 0.6 }
    ],
    metabolites: [
      { name: 'Noribogaine', active: true, halfLifeH: 38, potencyRel: 0.8,
        note: 'Long-lived active metabolite responsible for the days-long afterglow and the extended QT-prolongation window.' }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4', 'CYP2C9'], inhibits: ['CYP2D6'],
    excretion: 'Renal and biliary, largely as noribogaine glucuronide.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 120], peakMin: [180, 360], durationH: [24, 36], afterEffectsH: [24, 72], bioavailability: 0.7,
      doses: { threshold: 50, light: [100, 300], common: [300, 800], strong: [800, 1200], heavy: 1200, unit: 'mg',
        note: 'Anti-addictive protocols use 10-20 mg/kg. This is a hospital-level intervention, not a recreational dose range.' } }
  },
  warnings: [
    'Ibogaine has caused numerous deaths, overwhelmingly cardiac. It prolongs the QT interval severely and can trigger torsades de pointes. Continuous ECG monitoring, magnesium and potassium correction are considered mandatory.',
    'Fatal if combined with other QT-prolonging drugs (methadone, ondansetron, many antipsychotics, some antibiotics).',
    'It also inhibits CYP2D6, so any co-administered 2D6 substrate accumulates.',
    'Should never be taken alone or outside a monitored setting.'
  ],
  refs: ['Glue et al. 2015, J Clin Pharmacol', 'Alper et al. 2012, Am J Addict']
},

{
  id: 'salvia', name: 'Salvinorin A', aliases: ['salvia', 'salvia divinorum'],
  class: 'Psychedelic', family: 'Diterpenoid', schedule: 'Varies by state/country',
  tags: ['psychedelic', 'dissociative', 'kappa-opioid-agonist', 'hallucinogen', 'short-duration'],
  toleranceGroup: 'salvia', toleranceHalfLifeDays: 1,
  mechanism: 'Highly selective kappa-opioid receptor agonist — the only major naturally occurring one, and unusual in being a non-nitrogenous hallucinogen. It does not touch 5-HT2A at all.',
  halfLife: { hours: 0.13, range: [0.08, 0.25], confidence: 'measured', notes: 'About 8 minutes when smoked.' },
  metabolism: {
    firstPass: 'Extensive — orally near-inactive when swallowed; buccal absorption is required for the quid method.',
    pathways: [
      { enzyme: 'CES / hepatic esterases', reaction: 'Hydrolysis of the C-2 acetate', product: 'Salvinorin B', fraction: 0.8,
        note: 'Rapid and near-complete; the product is inactive, which is why the effect ends so abruptly.' },
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Salvinorin B glucuronide', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Salvinorin B', active: false, note: 'Inactive — no kappa affinity.' }],
    substrateOf: ['CES1', 'UGT2B7'], excretion: 'Biliary and renal.', confidence: 'measured'
  },
  routes: {
    smoked: { onsetMin: [0.1, 0.5], peakMin: [1, 2], durationH: [0.08, 0.25], afterEffectsH: [0.25, 1], bioavailability: 0.4,
      doses: { threshold: 0.2, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } },
    buccal: { onsetMin: [5, 15], peakMin: [20, 40], durationH: [0.5, 1.5], afterEffectsH: [0.5, 2], bioavailability: 0.3,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 5], strong: [5, 10], heavy: 10, unit: 'mg' } }
  },
  warnings: [
    'Complete loss of environmental awareness and motor control is common — injuries from falling or walking into things are the main real-world harm. A sitter is genuinely necessary.',
    'Frequently intensely dysphoric rather than pleasant.'
  ],
  refs: ['Roth et al. 2002, PNAS', 'Schmidt et al. 2005, Drug Alcohol Depend']
}

]);

/* Psychedelics — second wave: further 2Cs, DOx, NBOMes, lysergamides, tryptamines */
DB.register([

{
  id: '2c-i', name: '2C-I', aliases: ['4-iodo-2,5-dimethoxyphenethylamine'],
  class: 'Psychedelic', family: 'Phenethylamine (2C)', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: '5-HT2A partial agonist; strongly visual with less of the entactogenic warmth of 2C-B.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: '2C-I carboxylic acid', fraction: 0.5,
        note: 'Primary clearance route, which is why MAOIs potentiate the 2C series so dangerously.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Desmethyl metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: '2C-I carboxylic acid', active: false }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 90], peakMin: [120, 180], durationH: [6, 10], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 5, light: [8, 12], common: [12, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Frequently confused with 25I-NBOMe, which is far more toxic and active at a fraction of the dose.'],
  refs: ['Shulgin, PiHKAL #33']
},

{
  id: '2c-p', name: '2C-P', aliases: ['4-propyl-2,5-dimethoxyphenethylamine'],
  class: 'Psychedelic', family: 'Phenethylamine (2C)', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated',
         'long-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'One of the most potent and longest-lasting of the 2C series, with an unusually steep dose-response curve.',
  halfLife: { hours: 6, range: [4, 9], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Deamination', product: 'Corresponding phenylacetic acid', fraction: 0.45 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Desmethyl metabolites', fraction: 0.25 }
    ],
    metabolites: [{ name: '2C-P carboxylic acid', active: false }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [180, 300], durationH: [10, 16], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 3, light: [5, 8], common: [8, 12], strong: [12, 16], heavy: 16, unit: 'mg' } }
  },
  warnings: [
    'The slow onset (up to 3 hours) plus a steep dose-response curve makes this one of the most commonly over-dosed compounds in the class.',
    'Duration frequently exceeds 12 hours. MAOI-contraindicated.'
  ],
  refs: ['Shulgin, PiHKAL #39']
},

{
  id: 'dom', name: 'DOM', aliases: ['stp', '2,5-dimethoxy-4-methylamphetamine'],
  class: 'Psychedelic', family: 'Amphetamine (DOx)', schedule: 'I (US)',
  tags: ['psychedelic', 'stimulant', 'serotonergic', '5ht2a-agonist', 'vasoconstrictor',
         'mao-contraindicated', 'long-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'Potent, long-acting 5-HT2A partial agonist. The α-methyl group blocks MAO deamination, which is why the DOx family lasts so much longer than the 2C series.',
  halfLife: { hours: 10, range: [7, 16], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Hydroxy-methoxy metabolites', fraction: 0.4 },
      { enzyme: 'CYP2D6', reaction: 'Benzylic hydroxylation', product: 'Hydroxymethyl-DOM', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Uncharacterised hydroxy metabolites', active: false }],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [180, 360], durationH: [14, 20], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 1, light: [2, 3], common: [3, 5], strong: [5, 8], heavy: 8, unit: 'mg' } }
  },
  warnings: [
    'Historically notorious: distributed in the 1960s at 10-20 mg doses, causing mass hospitalisations. The slow onset led people to take more, then to a 20-hour experience.',
    'MAOI-contraindicated. Marked vasoconstriction.'
  ],
  refs: ['Shulgin, PiHKAL #68']
},

{
  id: 'dob', name: 'DOB', aliases: ['brolamfetamine', '2,5-dimethoxy-4-bromoamphetamine'],
  class: 'Psychedelic', family: 'Amphetamine (DOx)', schedule: 'I (US)',
  tags: ['psychedelic', 'stimulant', 'serotonergic', '5ht2a-agonist', 'vasoconstrictor',
         'mao-contraindicated', 'long-duration', 'psychosis-risk', 'high-toxicity'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'Extremely potent and long-acting 5-HT2A agonist with strong peripheral vasoconstriction.',
  halfLife: { hours: 12, range: [8, 20], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Hydroxy-methoxy metabolites', fraction: 0.4 },
      { enzyme: 'MAO', reaction: 'Slow deamination', product: 'Phenylacetic acid derivative', fraction: 0.15,
        note: 'Substantially resistant to MAO because of the α-methyl group — hence the very long duration.' }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [240, 420], durationH: [18, 30], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 0.2, light: [0.5, 1], common: [1, 2], strong: [2, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'Severe vasoconstriction has caused limb ischaemia and amputations at overdose levels.',
    'Duration can exceed 24 hours. Often sold on blotter as LSD.'
  ],
  refs: ['Shulgin, PiHKAL #62', 'Bowen et al. 1983, JAMA']
},

{
  id: '25c-nbome', name: '25C-NBOMe', aliases: ['2c-c-nbome', 'n-bomb'],
  class: 'Psychedelic', family: 'NBOMe', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'vasoconstrictor',
         'cardiotoxic', 'seizure-risk', 'high-toxicity', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'Extremely potent full 5-HT2A agonist. Full rather than partial agonism is believed to underlie the class\'s much higher toxicity relative to classical psychedelics.',
  halfLife: { hours: 3, range: [1, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-demethylation of the benzyl methoxy', product: 'O-desmethyl-25C-NBOMe', fraction: 0.4 },
      { enzyme: 'CYP1A2', reaction: 'N-dealkylation', product: '2C-C', fraction: 0.05, note: 'Yields an active psychedelic metabolite.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: '2C-C', active: true, halfLifeH: 4, potencyRel: 0.1 }],
    substrateOf: ['CYP3A4', 'CYP1A2', 'CYP2C9'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    sublingual: { onsetMin: [15, 45], peakMin: [60, 150], durationH: [4, 10], afterEffectsH: [4, 24], bioavailability: 0.6,
      doses: { threshold: 0.05, light: [0.2, 0.5], common: [0.5, 0.9], strong: [0.9, 1.5], heavy: 1.5, unit: 'mg' } }
  },
  warnings: [
    'Multiple deaths documented at doses only slightly above recreational. Seizures, hyperthermia, severe hypertension and kidney failure.',
    'Very commonly mis-sold as LSD. Distinctly bitter and metallic — LSD is tasteless. Reagent-test blotter before use.',
    'Orally inactive if swallowed, so it must be held sublingually; people who swallow feel nothing and redose.'
  ],
  refs: ['Poklis et al. 2014, J Anal Toxicol', 'Hill et al. 2013, Clin Toxicol']
},

{
  id: 'eth-lad', name: 'ETH-LAD', aliases: ['6-ethyl-6-nor-lsd'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'psychosis-risk', 'hppd-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Lysergamide with an N6-ethyl group; more potent than LSD by weight and reported as more visual and more physically loaded.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CYP3A4', reaction: 'Presumed oxidation and hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.6, note: 'Not characterised in humans.' }],
    metabolites: [{ name: 'Uncharacterised', active: false }],
    substrateOf: ['CYP3A4'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    sublingual: { onsetMin: [30, 90], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [4, 16], bioavailability: 0.7,
      doses: { threshold: 0.02, light: [0.04, 0.075], common: [0.075, 0.15], strong: [0.15, 0.25], heavy: 0.25, unit: 'mg' } }
  },
  warnings: ['Notably heavier body load than LSD. Cross-tolerant with all 5-HT2A psychedelics.'],
  refs: ['Shulgin, TiHKAL', 'Brandt et al. 2017, Drug Test Anal']
},

{
  id: '5-meo-mipt', name: '5-MeO-MiPT', aliases: ['moxy'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'entactogen', 'serotonergic', '5ht2a-agonist', 'research-chemical',
         'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Tryptamine with mixed psychedelic and entactogenic character; strongly tactile and physically euphoric with modest visuals.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: 'Indole acetic acid derivative', fraction: 0.4,
        note: 'Substantial MAO clearance — MAOIs potentiate it dangerously.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: '5-HO-MiPT', fraction: 0.2, note: 'Presumed active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: '5-HO-MiPT', active: true, halfLifeH: 3, potencyRel: 0.5 }],
    substrateOf: ['MAO-A', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.6,
      doses: { threshold: 2, light: [4, 6], common: [6, 10], strong: [10, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Reported to have a fairly steep dose-response curve above 10 mg.'],
  refs: ['Shulgin, TiHKAL']
},

{
  id: 'dpt', name: 'DPT', aliases: ['n,n-dipropyltryptamine'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'mao-substrate',
         'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-tryptamine', toleranceHalfLifeDays: 1,
  mechanism: 'Propyl homologue of DMT. Orally active in a way DMT is not, and known for an unusually dissociative, sometimes overwhelming character.',
  halfLife: { hours: 1.5, range: [1, 3], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: 'Indole-3-acetic acid derivative', fraction: 0.6,
        note: 'The bulkier propyl groups make it a poorer MAO substrate than DMT, which is why it retains some oral activity.' },
      { enzyme: 'CYP2D6', reaction: 'N-dealkylation', product: 'N-propyltryptamine', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Indole acetic acid derivative', active: false }],
    substrateOf: ['MAO-A', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 10], peakMin: [15, 30], durationH: [1, 2.5], afterEffectsH: [1, 4], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg' } },
    oral: { onsetMin: [30, 75], peakMin: [60, 120], durationH: [2, 4], afterEffectsH: [1, 4], bioavailability: 0.4,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: ['Onset can be abrupt and overwhelming, particularly insufflated. MAOI-contraindicated.'],
  refs: ['Shulgin, TiHKAL #17']
},

{
  id: '4-ho-dipt', name: '4-HO-DiPT', aliases: ['iprocin'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'short-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Psilocin analogue with N,N-diisopropyl substitution. Notably fast and short — one of the briefest orally active psychedelics.',
  halfLife: { hours: 1.5, range: [1, 2.5], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation (presumed)', product: 'Glucuronide conjugate', fraction: 0.7 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Indole acetic acid derivative', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Uncharacterised glucuronide', active: false }],
    substrateOf: ['UGT1A10', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [40, 70], durationH: [2, 3], afterEffectsH: [1, 4], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 15], common: [15, 25], strong: [25, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: ['The very rapid onset can feel overwhelming. MAOI potentiation risk.'],
  refs: ['Shulgin, TiHKAL #21']
},

{
  id: '4-aco-met', name: '4-AcO-MET', aliases: ['metacetin', 'o-acetylmetocin'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'prodrug', 'research-chemical', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Acetylated prodrug of 4-HO-MET, deacetylated in vivo. Reported as gentle, colourful and euphoric.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'Esterases (CES1/CES2)', reaction: 'Deacetylation', product: '4-HO-MET', fraction: 0.9 },
      { enzyme: 'UGT1A10', reaction: 'Glucuronidation', product: 'Glucuronide conjugate', fraction: 0.7 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Indole acetic acid derivative', fraction: 0.15 }
    ],
    metabolites: [{ name: '4-HO-MET', active: true, halfLifeH: 2.5, potencyRel: 1.0, note: 'The actual active drug.' }],
    substrateOf: ['CES1', 'UGT1A10', 'MAO-A'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [70, 130], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 15], common: [15, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: ['MAOI potentiation risk. Cross-tolerant with psilocybin and LSD.'],
  refs: ['Limited; user-reported data']
}

]);
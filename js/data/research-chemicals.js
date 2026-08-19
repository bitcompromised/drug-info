/* Research chemicals — designer benzodiazepines, dissociatives, lysergamides,
   tryptamines and synthetic cannabinoids */
DB.register([

/* ================= Designer benzodiazepines ================= */
{
  id: 'flubromazepam', name: 'Flubromazepam',
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 9,
  mechanism: 'Designer benzodiazepine with an exceptionally long half-life — one of the longest of any compound in this class.',
  halfLife: { hours: 106, range: [70, 220], confidence: 'measured',
    notes: 'Measured in a self-experiment: about 106 hours, with the drug still detectable weeks later. A single dose impairs for days.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: '3-Hydroxyflubromazepam', fraction: 0.45, note: 'Active metabolite.' },
      { enzyme: 'CYP3A4', reaction: 'Debromination', product: 'Desbromo-flubromazepam', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: '3-Hydroxyflubromazepam', active: true, halfLifeH: 23, potencyRel: 0.6, note: 'Active; main urinary marker.' },
      { name: 'Desbromo-flubromazepam', active: true, halfLifeH: 30, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 300], durationH: [12, 24], afterEffectsH: [24, 96], bioavailability: 0.9,
      doses: { threshold: 2, light: [4, 8], common: [8, 12], strong: [12, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'A half-life over four days means a single dose impairs driving and judgement for days, and daily use accumulates without limit.',
    'Fatal with opioids or alcohol. Withdrawal can be fatal.'
  ],
  refs: ['Moosmann et al. 2013, Drug Test Anal']
},

{
  id: 'pyrazolam', name: 'Pyrazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'anxiolytic',
         'research-chemical', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Designer benzodiazepine notable for being strongly anxiolytic with relatively little sedation, hypnosis or muscle relaxation — an unusually selective profile.',
  halfLife: { hours: 17, range: [15, 20], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'None significant', reaction: 'Largely excreted unchanged', product: 'Unchanged pyrazolam', fraction: 0.8,
        note: 'Unusual for the class — pyrazolam undergoes almost no phase I metabolism, so it has few CYP interactions and no active metabolites.' },
      { enzyme: 'UGT', reaction: 'Direct glucuronidation', product: 'Pyrazolam glucuronide', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Pyrazolam glucuronide', active: false, note: 'No active metabolites — atypical for a benzodiazepine.' }],
    substrateOf: ['UGT'], excretion: 'Renal, largely unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [8, 12], afterEffectsH: [8, 24], bioavailability: 0.9,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Withdrawal after sustained use can be fatal.'],
  refs: ['Moosmann et al. 2013, Drug Test Anal']
},

{
  id: 'deschloroetizolam', name: 'Deschloroetizolam',
  class: 'Depressant', family: 'Thienodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Etizolam analogue lacking the chlorine; less potent than etizolam but longer-acting.',
  halfLife: { hours: 10, range: [6, 16], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the methyl group', product: 'α-Hydroxydeschloroetizolam', fraction: 0.5, note: 'Active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'α-Hydroxydeschloroetizolam', active: true, halfLifeH: 12, potencyRel: 0.8, note: 'Active and longer-lived than the parent.' }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [8, 12], afterEffectsH: [10, 24], bioavailability: 0.9,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 4], strong: [4, 6], heavy: 6, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Rapid tolerance and severe withdrawal.'],
  refs: ['Limited; forensic data']
},

{
  id: 'flualprazolam-analog-adinazolam', name: 'Adinazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'antidepressant-like', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Triazolobenzodiazepine originally investigated as an antidepressant. Its own affinity is modest — most of the effect comes from an active metabolite that is far more potent than the parent.',
  halfLife: { hours: 3, range: [2, 4], confidence: 'measured',
    notes: 'The parent is short-lived, but N-desmethyladinazolam is both more potent and longer-lasting, so the felt duration is much longer than 3 hours.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N-desmethyladinazolam (NDMAD)', fraction: 0.6,
        note: 'THE key step. NDMAD is several times more potent at the benzodiazepine site than adinazolam itself — this is effectively a prodrug.' },
      { enzyme: 'CYP3A4', reaction: 'Further demethylation', product: 'Di-desmethyladinazolam', from: 'N-desmethyladinazolam (NDMAD)', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'N-desmethyladinazolam', active: true, halfLifeH: 8, potencyRel: 4,
        note: 'The main active species; substantially more potent than the parent and longer-lived.' },
      { name: 'Di-desmethyladinazolam', active: true, halfLifeH: 10, potencyRel: 0.5 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 120], durationH: [5, 9], afterEffectsH: [8, 20], bioavailability: 0.9,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Because the active metabolite is more potent than the parent, effects escalate after the first hour — people commonly redose during the lull and overshoot badly.',
    'CYP3A4 inhibitors change how much active metabolite forms, altering the effect unpredictably.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['Fleishaker et al. 1990, Clin Pharmacokinet']
},

/* ================= Dissociatives ================= */
{
  id: 'dmxe', name: 'DMXE', aliases: ['3d-mxe', 'deoxymethoxetamine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'urotoxic', 'addictive'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Methoxetamine analogue that emerged as an MXE substitute after its bans; broadly similar NMDA antagonism with a slightly shorter duration.',
  halfLife: { hours: 4, range: [2, 7], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'N-deethylation', product: 'Nor-DMXE', fraction: 0.45, note: 'Presumed active, by analogy with norketamine.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'O-desmethyl-DMXE', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Nor-DMXE', active: true, halfLifeH: 6, potencyRel: 0.3 },
      { name: 'O-desmethyl-DMXE', active: true, halfLifeH: 5, potencyRel: 0.4 }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [5, 20], peakMin: [30, 60], durationH: [2, 4], afterEffectsH: [2, 10], bioavailability: 0.75,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [2, 10], bioavailability: 0.6,
      doses: { threshold: 10, light: [20, 35], common: [35, 60], strong: [60, 90], heavy: 90, unit: 'mg' } }
  },
  warnings: [
    'Delayed onset drives redosing before the first dose peaks — the recurring hazard of the whole MXE family.',
    'Presumed to share ketamine\'s bladder toxicity with repeated use.'
  ],
  refs: ['Limited; forensic and user-reported data']
},

{
  id: '3-meo-pce', name: '3-MeO-PCE', aliases: ['methoxieticyclidine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'stimulant', 'cns-depressant',
         'psychosis-risk', 'compulsive-redosing', 'high-toxicity'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Potent NMDA antagonist in the PCE family; reported as more stimulating and considerably more prone to producing mania and psychosis than ketamine.',
  halfLife: { hours: 5, range: [3, 9], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'O-demethylation', product: '3-HO-PCE', fraction: 0.35, note: 'Presumed active.' },
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'N-deethylation', product: 'Nor-3-MeO-PCE', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: '3-HO-PCE', active: true, halfLifeH: 6, potencyRel: 0.8 },
      { name: 'Nor-3-MeO-PCE', active: true, halfLifeH: 6, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CYP2C19'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [3, 15], peakMin: [20, 50], durationH: [3, 5], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 2, light: [4, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } },
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [4, 8], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 3, light: [5, 12], common: [12, 20], strong: [20, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: [
    'Strongly associated with mania, compulsive redosing and lasting psychosis. Active in single milligrams.',
    'Delayed onset causes redosing into overdose.'
  ],
  refs: ['Limited; forensic and user-reported data']
},

{
  id: 'ephenidine', name: 'Ephenidine', aliases: ['nedpa', 'ephe'],
  class: 'Dissociative', family: 'Diarylethylamine', schedule: 'Varies / banned in UK',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Diarylethylamine NMDA channel blocker, less potent than diphenidine with a shorter duration.',
  halfLife: { hours: 3, range: [2, 6], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'Aromatic hydroxylation', product: 'Hydroxyephenidine', fraction: 0.4, note: 'Identified in human urine.' },
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Nor-ephenidine', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Hydroxyephenidine', active: false, halfLifeH: 4, note: 'Main urinary marker.' },
      { name: 'Nor-ephenidine', active: true, halfLifeH: 4, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 15, light: [30, 60], common: [60, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: ['Little human data. Delayed onset drives redosing.'],
  refs: ['Wink et al. 2016, Drug Test Anal']
},

/* ================= Lysergamides & tryptamines ================= */
{
  id: '1v-lsd', name: '1V-LSD', aliases: ['valerie', '1-valeroyl-lsd'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'prodrug', 'research-chemical',
         'hppd-risk', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'LSD prodrug carrying an N1-valeroyl group, created specifically to sit outside the German NpSG after 1P-LSD and 1cP-LSD were controlled. Hydrolysed in vivo to LSD.',
  halfLife: { hours: 3.6, range: [2.6, 5], confidence: 'analogue',
    notes: 'The meaningful kinetics are those of the LSD released; the prodrug itself is cleaved quickly.' },
  metabolism: {
    pathways: [
      { enzyme: 'Plasma/hepatic esterases', reaction: 'Hydrolysis of the N1-valeroyl group', product: 'LSD', fraction: 0.85 },
      { enzyme: 'CYP3A4', reaction: 'Downstream LSD metabolism', product: '2-oxo-3-hydroxy-LSD', fraction: 0.6 }
    ],
    metabolites: [{ name: 'LSD', active: true, halfLifeH: 3.6, potencyRel: 1.0, note: 'The actual active drug.' }],
    substrateOf: ['CES1', 'CYP3A4'], excretion: 'Renal, as LSD metabolites.', confidence: 'estimated'
  },
  routes: {
    sublingual: { onsetMin: [30, 90], peakMin: [150, 270], durationH: [8, 12], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 0.02, light: [0.03, 0.075], common: [0.075, 0.15], strong: [0.15, 0.3], heavy: 0.3, unit: 'mg' } }
  },
  warnings: [
    'Same cautions as LSD: lithium interaction, psychosis risk, two-week tolerance cycle.',
    'Slightly slower onset than LSD because of the hydrolysis step, which prompts premature redosing.'
  ],
  refs: ['Brandt et al. 2022, Drug Test Anal']
},

{
  id: 'mipla', name: 'MiPLA', aliases: ['lamide', 'n6-methyl-n6-isopropyllysergamide'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Lysergamide roughly half the potency of LSD, widely reported as gentler, more manageable and less anxiogenic.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CYP3A4', reaction: 'Presumed oxidation and N-dealkylation', product: 'Hydroxylated metabolites', fraction: 0.6, note: 'Not characterised in humans.' }],
    metabolites: [{ name: 'Uncharacterised', active: false }],
    substrateOf: ['CYP3A4'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    sublingual: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [6, 9], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 0.05, light: [0.1, 0.15], common: [0.15, 0.3], strong: [0.3, 0.5], heavy: 0.5, unit: 'mg' } }
  },
  warnings: ['Cross-tolerant with LSD and all 5-HT2A psychedelics. Lithium interaction applies.'],
  refs: ['Brandt et al. 2020, Drug Test Anal']
},

{
  id: '4-aco-dipt', name: '4-AcO-DiPT', aliases: ['ipracetin'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'prodrug', 'research-chemical',
         'short-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Acetylated prodrug of 4-HO-DiPT; fast onset and short duration, reported as colourful and physically light.',
  halfLife: { hours: 1.5, range: [1, 3], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'Esterases (CES1/CES2)', reaction: 'Deacetylation', product: '4-HO-DiPT', fraction: 0.9 },
      { enzyme: 'UGT1A10', reaction: 'Glucuronidation', product: 'Glucuronide conjugate', fraction: 0.7 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Indole acetic acid derivative', fraction: 0.15 }
    ],
    metabolites: [{ name: '4-HO-DiPT', active: true, halfLifeH: 1.5, potencyRel: 1.0, note: 'The actual active drug.' }],
    substrateOf: ['CES1', 'UGT1A10', 'MAO-A'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [40, 80], durationH: [2, 4], afterEffectsH: [1, 5], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 20], common: [20, 35], strong: [35, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: ['Very rapid onset can feel overwhelming. MAOI potentiation risk.'],
  refs: ['Shulgin, TiHKAL']
},

/* ================= Synthetic cannabinoids ================= */
{
  id: 'adb-butinaca', name: 'ADB-BUTINACA', aliases: ['adb-binaca'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (indazole carboxamide)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'cardiotoxic', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'FULL CB1 agonist and one of the most prevalent synthetic cannabinoids worldwide since 2021. Full agonism removes THC\'s partial-agonist ceiling, which is why this class causes seizures and deaths that cannabis does not.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis of the tert-leucinamide', product: 'ADB-BUTINACA butanoic acid', fraction: 0.4,
        note: 'Main route identified in human hepatocyte studies; the primary urinary detection target.' },
      { enzyme: 'CYP3A4 / CYP2C9', reaction: 'Hydroxylation of the butyl chain', product: 'Hydroxy-ADB-BUTINACA', fraction: 0.3,
        note: 'Several hydroxylated metabolites retain CB1 activity, so metabolism does not end the intoxication.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Hydroxy-ADB-BUTINACA', active: true, halfLifeH: 3, potencyRel: 0.6, note: 'Retains CB1 agonism and prolongs the effect.' },
      { name: 'ADB-BUTINACA butanoic acid', active: false, halfLifeH: 4, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2C9'], excretion: 'Renal and faecal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.05, light: [0.1, 0.5], common: [0.5, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg',
        note: 'Active in fractions of a milligram. Sprayed onto plant material with notoriously uneven distribution.' } }
  },
  warnings: [
    'Mass-casualty poisoning events, seizures, kidney injury and deaths are documented for this class.',
    'Uneven spraying means dose per gram is unpredictable within a single bag.',
    'Not detected by standard cannabis drug tests.'
  ],
  refs: ['EMCDDA ADB-BUTINACA risk assessment 2022', 'Kevin et al. 2019, Forensic Toxicol']
},

{
  id: '5f-mdmb-pica', name: '5F-MDMB-PICA', aliases: ['5f-mdmb-2201'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (indole carboxamide)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'cardiotoxic', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Fluorinated indole-carboxamide full CB1 agonist; among the most frequently detected synthetic cannabinoids in overdose casework and in prisons.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CES1', reaction: 'Ester hydrolysis of the methyl ester', product: '5F-MDMB-PICA butanoic acid', fraction: 0.45,
        note: 'Dominant route; the standard urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Oxidative defluorination', product: 'MDMB-PICA 5-hydroxypentyl', fraction: 0.25,
        note: 'Retains CB1 activity — an active metabolite.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'MDMB-PICA 5-hydroxypentyl', active: true, halfLifeH: 3, potencyRel: 0.6, note: 'Active at CB1; extends intoxication.' },
      { name: '5F-MDMB-PICA butanoic acid', active: false, halfLifeH: 4, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CES1', 'CYP3A4'], excretion: 'Renal and faecal.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.05, light: [0.1, 0.4], common: [0.4, 1.2], strong: [1.2, 2.5], heavy: 2.5, unit: 'mg' } }
  },
  warnings: [
    'Heavily implicated in deaths and mass poisonings. Full CB1 agonism with active metabolites.',
    'Frequently sprayed onto paper and smuggled into prisons; concentration per sheet is entirely unpredictable.',
    'Not detected by standard cannabis drug tests.'
  ],
  refs: ['Krotulski et al. 2021, J Anal Toxicol', 'EMCDDA reports']
}

]);

/* Research chemicals across the remaining classes — stimulants, psychedelics,
   dissociatives, cannabinoids. Dose ranges for most of these exist only as
   harm-reduction wiki consensus (`community`) or user reports (`anecdotal`). */
DB.register([

/* ================= Cathinone stimulants ================= */
{
  id: 'a-php', name: 'α-PHP', aliases: ['alpha-php', 'alpha-pyrrolidinohexanophenone'],
  class: 'Stimulant', family: 'Cathinone (pyrovalerone)', schedule: 'I (US) / analogue',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'hyperthermia-risk', 'psychosis-risk', 'highly-addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Pyrovalerone-class DAT/NET reuptake inhibitor, the hexanophenone homologue of α-PVP. Dopamine-selective with negligible serotonergic activity — the profile that drives compulsive redosing.',
  halfLife: { hours: 3.5, range: [2, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Pyrrolidine ring oxidation to the lactam', product: '2\'\'-oxo-α-PHP', fraction: 0.35 },
      { enzyme: 'CYP2C19', reaction: 'Ketone reduction', product: 'Dihydro-α-PHP', fraction: 0.25 },
      { enzyme: 'CYP3A4', reaction: 'ω-hydroxylation of the hexyl chain', product: 'OH-α-PHP', fraction: 0.2 }
    ],
    metabolites: [
      { name: '2\'\'-oxo-α-PHP', active: false, halfLifeH: 5, fraction: 0.35, note: 'Main urinary marker.' },
      { name: 'Dihydro-α-PHP', active: false, halfLifeH: 4, fraction: 0.25 }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19', 'CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 40], durationH: [2, 4], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 3, light: [5, 10], common: [10, 20], strong: [20, 35], heavy: 35, unit: 'mg' } },
    oral: { onsetMin: [15, 45], peakMin: [45, 100], durationH: [3, 6], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 35], strong: [35, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Extreme compulsive redosing; multi-day binges with no sleep, ending in psychosis, are the characteristic pattern.',
    'Dose ranges are community consensus, not measured data.'
  ],
  sources: ['PsychonautWiki / TripSit consensus ranges', 'Forensic metabolite studies']
},

{
  id: 'a-pihp', name: 'α-PiHP', aliases: ['alpha-pihp', 'alpha-pyrrolidinoisohexanophenone'],
  class: 'Stimulant', family: 'Cathinone (pyrovalerone)', schedule: 'Varies / analogue',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'hyperthermia-risk', 'psychosis-risk', 'highly-addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Branched-chain isomer of α-PHP; the same dopamine-selective NDRI pharmacology, widespread as an α-PVP replacement.',
  halfLife: { hours: 3.5, range: [2, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Pyrrolidine ring oxidation', product: '2\'\'-oxo-α-PiHP', fraction: 0.35 },
      { enzyme: 'CYP2C19', reaction: 'Ketone reduction', product: 'Dihydro-α-PiHP', fraction: 0.25 }
    ],
    metabolites: [
      { name: '2\'\'-oxo-α-PiHP', active: false, halfLifeH: 5, fraction: 0.35, note: 'Urinary marker.' },
      { name: 'Dihydro-α-PiHP', active: false, halfLifeH: 4, fraction: 0.25 }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 40], durationH: [2, 4], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 3, light: [5, 10], common: [10, 20], strong: [20, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: ['Same compulsive redosing and psychosis risk as the rest of the pyrovalerone class.'],
  sources: ['EMCDDA notifications', 'PsychonautWiki consensus ranges']
},

{
  id: '2-mmc', name: '2-MMC', aliases: ['2-methylmethcathinone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'Varies / banned in EU',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'norepinephrine-releaser',
         'mao-contraindicated', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'Ortho isomer of mephedrone. Reported as more stimulant and markedly less entactogenic than 3-MMC or 4-MMC, with a harsher character.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'anecdotal',
    notes: 'No published pharmacokinetics. Inferred from user-reported durations — treat as opinion.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Nor-2-MMC', fraction: 0.35, note: 'Presumed active, by analogy with mephedrone.' },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Dihydro-2-MMC', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Nor-2-MMC', active: true, halfLifeH: 3, potencyRel: 0.5, fraction: 0.35 },
      { name: 'Dihydro-2-MMC', active: false, halfLifeH: 4, fraction: 0.3 }
    ],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [1, 2.5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 15, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: ['Everything here is inferred from user reports. Serotonergic; MAOI-contraindicated.'],
  sources: ['User reports only — no published pharmacology']
},

/* ================= Phenethylamine psychedelics ================= */
{
  id: '2c-t-2', name: '2C-T-2', aliases: ['2,5-dimethoxy-4-ethylthiophenethylamine'],
  class: 'Psychedelic', family: 'Phenethylamine (2C-T)', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated',
         'high-toxicity', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: '5-HT2A agonist in the sulfur-containing 2C-T series. Notably heavy body load and nausea, and considerably more toxic than the 2C-B/2C-E branch.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: 'Corresponding phenylacetic acid', fraction: 0.45,
        note: 'The 2C-T series is heavily MAO-dependent — MAOIs potentiate them severely and this has been fatal.' },
      { enzyme: 'CYP2D6', reaction: 'S-oxidation and O-demethylation', product: 'Sulfoxide / desmethyl metabolites', fraction: 0.25 }
    ],
    metabolites: [
      { name: '2C-T-2 carboxylic acid', active: false, halfLifeH: 6, fraction: 0.45 },
      { name: '2C-T-2 sulfoxide', active: false, halfLifeH: 5, fraction: 0.25 }
    ],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 210], durationH: [5, 8], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 5, light: [8, 15], common: [15, 25], strong: [25, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: [
    'The 2C-T series is the most dangerous branch of the 2Cs. Deaths have occurred from 2C-T-7 and 2C-T-21, particularly when insufflated or combined with MAOIs.',
    'Never combine with any MAOI — MAO is a primary clearance route.',
    'Severe nausea and body load are near-universal.'
  ],
  sources: ['Shulgin, PiHKAL #42', 'Case report literature']
},

{
  id: '2c-c', name: '2C-C', aliases: ['4-chloro-2,5-dimethoxyphenethylamine'],
  class: 'Psychedelic', family: 'Phenethylamine (2C)', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: '5-HT2A partial agonist; reported as gentler, more sedating and less stimulating than 2C-B or 2C-E.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Deamination', product: '2C-C carboxylic acid', fraction: 0.5 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Desmethyl-2C-C', fraction: 0.2 }
    ],
    metabolites: [{ name: '2C-C carboxylic acid', active: false, halfLifeH: 5, fraction: 0.5 }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 10, light: [15, 25], common: [25, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Also produced as a metabolite of 25C-NBOMe.'],
  sources: ['Shulgin, PiHKAL #21', 'PsychonautWiki consensus ranges']
},

{
  id: 'doi', name: 'DOI', aliases: ['2,5-dimethoxy-4-iodoamphetamine'],
  class: 'Psychedelic', family: 'Amphetamine (DOx)', schedule: 'Varies (research tool)',
  tags: ['psychedelic', 'stimulant', 'serotonergic', '5ht2a-agonist', 'vasoconstrictor',
         'mao-contraindicated', 'long-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'Extremely potent and selective 5-HT2A agonist, widely used as a radioligand in neuroscience research. Very long-acting with strong vasoconstriction.',
  halfLife: { hours: 12, range: [8, 20], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Hydroxy-methoxy metabolites', fraction: 0.4 },
      { enzyme: 'MAO', reaction: 'Slow deamination', product: 'Phenylacetic acid derivative', fraction: 0.15,
        note: 'The α-methyl group blocks MAO substantially — hence the very long duration of the DOx family.' }
    ],
    metabolites: [{ name: 'Uncharacterised hydroxy metabolites', active: false, halfLifeH: 12, fraction: 0.4 }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [240, 420], durationH: [16, 30], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 3.5], strong: [3.5, 5], heavy: 5, unit: 'mg' } }
  },
  warnings: [
    'Duration frequently exceeds 24 hours. Marked and prolonged vasoconstriction.',
    'Sometimes sold on blotter as LSD; duration alone gives it away, far too late.'
  ],
  sources: ['Shulgin, PiHKAL #67', 'Neuroscience literature']
},

{
  id: '5-meo-dipt', name: '5-MeO-DiPT', aliases: ['foxy', 'foxy methoxy'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'I (US)',
  tags: ['psychedelic', 'entactogen', 'serotonergic', '5ht2a-agonist', 'research-chemical',
         'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Tryptamine with strong tactile and sensual character and comparatively modest visuals. Notorious for severe nausea and gastrointestinal distress during onset.',
  halfLife: { hours: 4, range: [2.5, 6], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: '5-HO-DiPT', fraction: 0.3,
        note: 'CYP2D6 poor metabolisers show markedly stronger and longer effects — a documented and clinically relevant polymorphism for this compound.' },
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: 'Indole acetic acid derivative', fraction: 0.35 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: '5-HO-DiPT', active: true, halfLifeH: 4, potencyRel: 0.6, fraction: 0.3 },
      { name: '5-MeO-indole acetic acid', active: false, halfLifeH: 4, fraction: 0.35 }
    ],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.6,
      doses: { threshold: 2, light: [4, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } }
  },
  warnings: [
    'CYP2D6 poor metabolisers (~7% of Europeans) can experience a far stronger and longer effect from a normal dose. CYP2D6 inhibitors do the same.',
    'MAOI-contraindicated. Severe nausea is typical.'
  ],
  sources: ['Shulgin, TiHKAL', 'Narimatsu et al., CYP2D6 metabolism studies']
},

{
  id: '4-ho-ept', name: '4-HO-EPT', aliases: ['4-hydroxy-n-ethyl-n-propyltryptamine'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'short-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Psilocin analogue with mixed N-ethyl/N-propyl substitution. Reported as fast, short and strongly visual.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'anecdotal',
    notes: 'No published pharmacology. Inferred from user-reported durations — opinion, not evidence.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation (presumed)', product: '4-HO-EPT glucuronide', fraction: 0.65 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Indole acetic acid derivative', fraction: 0.2 }
    ],
    metabolites: [{ name: '4-HO-EPT glucuronide', active: false, halfLifeH: 3, fraction: 0.65 }],
    substrateOf: ['UGT1A10', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [10, 35], peakMin: [40, 80], durationH: [2, 4], afterEffectsH: [1, 5], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 15], common: [15, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: ['No published data of any kind. Rapid onset can feel overwhelming. MAOI potentiation risk.'],
  sources: ['User reports only — no published pharmacology']
},

{
  id: 'lsz', name: 'LSZ', aliases: ['lysergic acid 2,4-dimethylazetidide', 'diazedine'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'hppd-risk', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Lysergamide with a constrained azetidide ring in place of the diethylamide. Similar potency to LSD, reported as more forceful and linear with less emotional ambiguity.',
  halfLife: { hours: 3.5, range: [2, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation and hydroxylation (presumed)', product: 'Hydroxylated metabolites', fraction: 0.6,
        note: 'Assumed to follow LSD\'s route; not characterised in humans.' }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false, halfLifeH: 5, fraction: 0.6 }],
    substrateOf: ['CYP3A4'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    sublingual: { onsetMin: [20, 60], peakMin: [90, 210], durationH: [7, 11], afterEffectsH: [4, 16], bioavailability: 0.7,
      doses: { threshold: 0.025, light: [0.05, 0.1], common: [0.1, 0.15], strong: [0.15, 0.25], heavy: 0.25, unit: 'mg' } }
  },
  warnings: ['Cross-tolerant with all 5-HT2A psychedelics. Lithium interaction applies as with LSD.'],
  sources: ['Brandt et al., Drug Test Anal', 'PsychonautWiki consensus ranges']
},

{
  id: 'pro-lad', name: 'PRO-LAD', aliases: ['6-propyl-6-nor-lsd'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'N6-propyl lysergamide of roughly LSD-equivalent potency, with a somewhat shorter duration.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CYP3A4', reaction: 'Presumed oxidation', product: 'Hydroxylated metabolites', fraction: 0.6 }],
    metabolites: [{ name: 'Uncharacterised', active: false, halfLifeH: 4, fraction: 0.6 }],
    substrateOf: ['CYP3A4'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    sublingual: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [6, 9], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 0.02, light: [0.05, 0.1], common: [0.1, 0.15], strong: [0.15, 0.25], heavy: 0.25, unit: 'mg' } }
  },
  warnings: ['Cross-tolerant with LSD. Lithium interaction applies.'],
  sources: ['Shulgin, TiHKAL', 'PsychonautWiki consensus ranges']
},

/* ================= Dissociatives ================= */
{
  id: 'mxipr', name: 'MXiPr', aliases: ['methoxisopropamine', '3-meo-2-oxo-pcipr'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'urotoxic', 'addictive'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Isopropyl homologue of methoxetamine, marketed as an MXE substitute after its scheduling. Similar NMDA antagonism with a slightly shorter duration.',
  halfLife: { hours: 4, range: [2, 7], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'N-deisopropylation', product: 'Nor-MXiPr', fraction: 0.45, note: 'Presumed active, by analogy with norketamine.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'O-desmethyl-MXiPr', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Nor-MXiPr', active: true, halfLifeH: 6, potencyRel: 0.3, fraction: 0.45 },
      { name: 'O-desmethyl-MXiPr', active: true, halfLifeH: 5, potencyRel: 0.4, fraction: 0.25 }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [5, 20], peakMin: [25, 55], durationH: [2, 4], afterEffectsH: [2, 10], bioavailability: 0.75,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Delayed onset drives redosing before the first dose peaks — the recurring failure mode of the MXE family.',
    'Presumed to share ketamine\'s bladder toxicity.'
  ],
  sources: ['PsychonautWiki consensus ranges', 'Forensic identifications']
},

{
  id: '3-meo-pcmo', name: '3-MeO-PCMo', aliases: ['3-methoxy-phencyclidine morpholine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Morpholine analogue of 3-MeO-PCP. Considerably less potent than 3-MeO-PCP and reported as more sedating and less stimulating.',
  halfLife: { hours: 5, range: [3, 9], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'O-demethylation', product: '3-HO-PCMo', fraction: 0.3 },
      { enzyme: 'CYP3A4', reaction: 'Morpholine ring hydroxylation', product: 'Hydroxy-3-MeO-PCMo', fraction: 0.3 }
    ],
    metabolites: [
      { name: '3-HO-PCMo', active: true, halfLifeH: 6, potencyRel: 0.5, fraction: 0.3 },
      { name: 'Hydroxy-3-MeO-PCMo', active: false, halfLifeH: 5, fraction: 0.3 }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [4, 8], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 20, light: [40, 80], common: [80, 150], strong: [150, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: ['Much weaker than 3-MeO-PCP — do not carry dosing habits across from it in either direction.'],
  sources: ['PsychonautWiki consensus ranges']
},

/* ================= Cannabinoids ================= */
{
  id: 'mdmb-chmica', name: 'MDMB-CHMICA', aliases: ['mmb-chminaca'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (indole carboxamide)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'cardiotoxic', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Full CB1 agonist responsible for one of the largest synthetic cannabinoid mass-poisoning waves in Europe, with dozens of deaths before scheduling.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CES1', reaction: 'Ester hydrolysis of the methyl ester', product: 'MDMB-CHMICA butanoic acid', fraction: 0.45,
        note: 'Dominant route; the standard urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Cyclohexylmethyl hydroxylation', product: 'Hydroxy-MDMB-CHMICA', fraction: 0.25, note: 'Retains CB1 activity.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Hydroxy-MDMB-CHMICA', active: true, halfLifeH: 3, potencyRel: 0.6, fraction: 0.25 },
      { name: 'MDMB-CHMICA butanoic acid', active: false, halfLifeH: 4, fraction: 0.45 }
    ],
    substrateOf: ['CES1', 'CYP3A4'], excretion: 'Renal and faecal.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.05, light: [0.1, 0.3], common: [0.3, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: [
    'Caused at least 29 deaths and dozens of hospitalisations across Europe, triggering an EMCDDA risk assessment.',
    'Uneven spraying onto herbal material makes dose per gram unpredictable.',
    'Not detected by standard cannabis drug tests.'
  ],
  sources: ['EMCDDA MDMB-CHMICA risk assessment 2016', 'Adamowicz 2016, Forensic Sci Int']
},

{
  id: 'cumyl-pegaclone', name: 'CUMYL-PEGACLONE', aliases: ['sgt-151'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (gamma-carbolinone)', schedule: 'I (US) / varies',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'cardiotoxic', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Gamma-carbolinone-based full CB1 agonist — a structural departure from the indole/indazole carboxamides, which is how it evaded generic legislation. Dominated the German market from 2018.',
  halfLife: { hours: 2.5, range: [1, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Pentyl chain hydroxylation', product: 'Hydroxypentyl-CUMYL-PEGACLONE', fraction: 0.4,
        note: 'Main route; several hydroxylated metabolites retain CB1 activity.' },
      { enzyme: 'CYP3A4', reaction: 'Cumyl group hydroxylation', product: 'Hydroxycumyl metabolite', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Hydroxypentyl-CUMYL-PEGACLONE', active: true, halfLifeH: 3, potencyRel: 0.6, fraction: 0.4,
        note: 'Active at CB1; main urinary marker.' }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal and faecal.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.05, light: [0.1, 0.4], common: [0.4, 1.2], strong: [1.2, 2.5], heavy: 2.5, unit: 'mg' } }
  },
  warnings: [
    'Linked to a substantial number of deaths in Germany. Full CB1 agonism with active metabolites.',
    'Not detected by standard cannabis drug tests.'
  ],
  sources: ['Giorgetti et al. 2020, Front Psychiatry', 'EMCDDA reports']
},

{
  id: 'thcp', name: 'THCP', aliases: ['tetrahydrocannabiphorol'],
  class: 'Cannabinoid', family: 'Phytocannabinoid', schedule: 'Legal grey area / varies',
  tags: ['cannabinoid', 'cb1-agonist', 'psychosis-risk', 'tachycardia', 'addictive', 'lipophilic-accumulation'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'Naturally occurring THC homologue with a seven-carbon side chain instead of five, giving roughly 30× the CB1 binding affinity of delta-9-THC. It is still a partial agonist, so it lacks the full-agonist danger of the synthetics — but the potency means dosing errors are easy.',
  halfLife: { hours: 30, range: [20, 120], confidence: 'analogue',
    notes: 'Assumed to follow THC\'s fat-storage kinetics; no human PK study exists.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: '11-hydroxylation', product: '11-OH-THCP', fraction: 0.45, note: 'Presumed active and more potent than the parent, as with THC.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxylated species', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: '11-OH-THCP', active: true, halfLifeH: 12, potencyRel: 1.5, fraction: 0.45 },
      { name: '11-nor-9-carboxy-THCP', active: false, halfLifeH: 120, fraction: 0.2, note: 'Long-lived; likely cross-reacts with THC drug screens.' }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4', 'UGT'], excretion: 'Faecal and renal.', confidence: 'unknown'
  },
  routes: {
    vaporised: { onsetMin: [0.5, 5], peakMin: [10, 25], durationH: [2, 6], afterEffectsH: [3, 12], bioavailability: 0.4,
      doses: { threshold: 0.05, light: [0.1, 0.3], common: [0.3, 1], strong: [1, 2], heavy: 2, unit: 'mg' } },
    oral: { onsetMin: [45, 150], peakMin: [120, 240], durationH: [6, 12], afterEffectsH: [8, 24], bioavailability: 0.1,
      doses: { threshold: 0.1, light: [0.2, 0.5], common: [0.5, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'Roughly 30× THC\'s CB1 affinity — products are frequently mislabelled and dosed as if it were ordinary THC, which is the main real-world harm.',
    'Very long-lasting orally; the usual edible over-consumption pattern applies with a much smaller margin.'
  ],
  sources: ['Citti et al. 2019, Sci Rep', 'PsychonautWiki consensus ranges']
}

]);

/* Final research chemical batch — isolated active metabolites sold as drugs in
   their own right (the 7-OH / pseudoindoxyl category), plus remaining
   psychedelics, stimulants and dissociatives. */
DB.register([

/* ================= Kratom alkaloids sold in isolation ================= */
{
  id: '7-oh-mitragynine', name: '7-OH-Mitragynine', aliases: ['7-hydroxymitragynine', '7-oh', '7ohm'],
  class: 'Opioid', family: 'Indole alkaloid (kratom)', schedule: 'Unscheduled federally in US (scheduling recommended); banned in several states',
  tags: ['opioid', 'mu-agonist', 'research-chemical', 'respiratory-depressant', 'cns-depressant',
         'highly-addictive', 'compulsive-redosing', 'withdrawal-dangerous'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'The potent active metabolite of mitragynine, roughly 13-46× the parent at the mu receptor and on the order of 10-17× morphine. It occurs in kratom leaf at under 0.05%, but is now concentrated or semi-synthesised from mitragynine and sold as isolated tablets — which turns a plant with a self-limiting dose into a concentrated opioid product.',
  halfLife: { hours: 2.5, range: [1.5, 5], confidence: 'estimated',
    notes: 'Short relative to its potency. The mismatch between a strong, fast effect and a short duration is what drives the very heavy redosing reported with these products.' },
  metabolism: {
    firstPass: 'Substantial. Notably, it is ALSO formed from mitragynine in vivo, so anyone taking kratom leaf produces some of it endogenously.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: '7-OH-desmethyl metabolites', fraction: 0.3 },
      { enzyme: 'Non-enzymatic / hepatic rearrangement', reaction: 'Ring rearrangement', product: 'Mitragynine pseudoindoxyl', fraction: 0.15,
        note: 'Produces a compound more potent still, and a biased agonist — a meaningful part of the total effect.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.35 }
    ],
    metabolites: [
      { name: 'Mitragynine pseudoindoxyl', active: true, halfLifeH: 3, potencyRel: 2, fraction: 0.15,
        note: 'More potent than 7-OH itself and G-protein biased.' },
      { name: '7-OH glucuronide', active: false, halfLifeH: 4, fraction: 0.35 }
    ],
    substrateOf: ['CYP3A4', 'UGT'],
    inhibits: ['CYP2D6', 'CYP3A4'],
    excretion: 'Renal and biliary, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [3, 12], bioavailability: 0.3,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 5], strong: [5, 10], heavy: 10, unit: 'mg',
        note: 'Commercial "7-OH" tablets are often sold at 5-15 mg per tablet, which is a strong-to-heavy dose for someone without opioid tolerance.' } }
  },
  warnings: [
    'This is a concentrated opioid sold in petrol stations and vape shops as a kratom product. It is not equivalent to kratom leaf — the whole-plant self-limiting effect is gone.',
    'Dependence develops fast and withdrawal is a full opioid withdrawal syndrome. Users routinely describe it as considerably harder to stop than leaf kratom.',
    'Fatal with benzodiazepines, alcohol or other depressants. Naloxone reverses it.',
    'The FDA recommended scheduling it in 2025 on the basis of its opioid potency and abuse potential.'
  ],
  sources: ['Kruegel & Grundmann 2018, Neuropharmacology', 'Váradi et al. 2016, J Med Chem', 'FDA scheduling recommendation 2025']
},

{
  id: 'mitragynine-pseudoindoxyl', name: 'Mitragynine pseudoindoxyl', aliases: ['mp', 'pseudoindoxyl'],
  class: 'Opioid', family: 'Indole alkaloid (kratom)', schedule: 'Varies / analogue',
  tags: ['opioid', 'mu-agonist', 'delta-antagonist', 'research-chemical', 'biased-agonist',
         'respiratory-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Rearrangement product of 7-OH-mitragynine and the most potent of the kratom-derived opioids, roughly 20× morphine. It is a G-protein biased mu agonist and a delta antagonist — in animal work that bias produces less respiratory depression and slower tolerance than classical opioids, which is why it has been studied as an analgesic template.',
  halfLife: { hours: 3, range: [2, 6], confidence: 'analogue',
    notes: 'No human PK data. Extrapolated from 7-OH-mitragynine and preclinical work.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidative demethylation', product: 'Desmethyl-pseudoindoxyl', fraction: 0.35 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.35 }
    ],
    metabolites: [
      { name: 'Desmethyl-pseudoindoxyl', active: true, halfLifeH: 4, potencyRel: 0.4, fraction: 0.35 },
      { name: 'Pseudoindoxyl glucuronide', active: false, halfLifeH: 5, fraction: 0.35 }
    ],
    substrateOf: ['CYP3A4', 'UGT'], excretion: 'Renal and biliary.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [45, 120], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.3,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 3], strong: [3, 6], heavy: 6, unit: 'mg' } }
  },
  warnings: [
    'Reduced respiratory depression in ANIMAL models does not mean safe in humans — biased agonism has repeatedly failed to deliver the predicted safety margin clinically (oliceridine being the cautionary example).',
    'Still a full opioid: dependence, withdrawal and fatal interaction with depressants all apply.',
    'No human data of any kind.'
  ],
  sources: ['Váradi et al. 2016, J Med Chem', 'Kruegel et al. 2019, ACS Cent Sci']
},

{
  id: 'mitragynine', name: 'Mitragynine (isolated)', aliases: ['kratom extract', 'mitragynine isolate'],
  class: 'Opioid', family: 'Indole alkaloid (kratom)', schedule: 'Varies by jurisdiction',
  tags: ['opioid', 'mu-partial-agonist', 'stimulant', 'alpha2-agonist', 'addictive', 'compulsive-redosing'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'The principal kratom alkaloid, isolated from the leaf and sold as a concentrated extract. A biased partial mu agonist with alpha-2 adrenergic and serotonergic activity; much of its opioid effect comes from conversion to 7-OH-mitragynine.',
  halfLife: { hours: 23, range: [9, 40], confidence: 'measured',
    notes: 'Measured in regular users. Far longer than the 4-6 h subjective duration, which is why daily use accumulates and withdrawal appears sooner than people expect.' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability of the isolated alkaloid is low (~20%).',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation at C7', product: '7-OH-mitragynine', fraction: 0.02,
        note: 'Small by mass but decisive — the product is 13-46× more potent, so CYP3A4 inhibitors change the effect qualitatively, not just quantitatively.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'O-demethylation', product: '9-O-desmethylmitragynine', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.4 }
    ],
    metabolites: [
      { name: '7-OH-mitragynine', active: true, halfLifeH: 2.5, potencyRel: 30, fraction: 0.02,
        note: 'The potent active metabolite; now also sold separately as a drug.' },
      { name: '9-O-desmethylmitragynine', active: false, halfLifeH: 8, fraction: 0.25 }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6', 'UGT'],
    inhibits: ['CYP2D6', 'CYP3A4'],
    excretion: 'Renal and biliary as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [4, 12], bioavailability: 0.2,
      doses: { threshold: 5, light: [10, 25], common: [25, 60], strong: [60, 120], heavy: 120, unit: 'mg',
        note: 'As pure mitragynine. Whole leaf is roughly 1-2% mitragynine, so 25 mg is comparable to ~2 g of leaf — but extracts remove the self-limiting bulk and nausea of leaf.' } }
  },
  warnings: [
    'Concentrated extracts remove what limits leaf kratom: the volume, the taste and the nausea. Dependence forms considerably faster on extracts than on leaf.',
    'It inhibits CYP2D6 and CYP3A4, raising levels of many co-administered medications.',
    'Deaths involving kratom nearly always involve other depressants.'
  ],
  sources: ['Trakulsrichai et al. 2015, Drug Des Devel Ther', 'Kruegel & Grundmann 2018, Neuropharmacology']
},

/* ================= Phenethylamine psychedelics ================= */
{
  id: '2c-t-7', name: '2C-T-7', aliases: ['blue mystic', 'tripstasy'],
  class: 'Psychedelic', family: 'Phenethylamine (2C-T)', schedule: 'I (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated',
         'high-toxicity', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: '5-HT2A agonist in the sulfur-containing 2C-T series, with a long duration and heavy body load.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: '2C-T-7 carboxylic acid', fraction: 0.45,
        note: 'Heavily MAO-dependent. MAOI combination has been implicated in deaths with this compound specifically.' },
      { enzyme: 'CYP2D6', reaction: 'S-oxidation', product: '2C-T-7 sulfoxide', fraction: 0.25 }
    ],
    metabolites: [
      { name: '2C-T-7 carboxylic acid', active: false, halfLifeH: 7, fraction: 0.45 },
      { name: '2C-T-7 sulfoxide', active: false, halfLifeH: 6, fraction: 0.25 }
    ],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [60, 120], peakMin: [150, 270], durationH: [6, 12], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 5, light: [8, 15], common: [15, 25], strong: [25, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: [
    'Deaths are documented, particularly from INSUFFLATION and from MAOI combination. Insufflating 2C-T compounds has killed people at doses that would be tolerated orally — do not insufflate this series.',
    'MAOI-contraindicated. Severe nausea and body load are typical.'
  ],
  sources: ['Shulgin, PiHKAL #43', 'Curtis et al. 2003, J Anal Toxicol (fatalities)']
},

{
  id: '2c-d', name: '2C-D', aliases: ['2,5-dimethoxy-4-methylphenethylamine', 'ldd'],
  class: 'Psychedelic', family: 'Phenethylamine (2C)', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Mild, short 5-HT2A agonist. At low doses it is notably gentle and was investigated as a psychotherapy adjunct; at higher doses it becomes a full psychedelic.',
  halfLife: { hours: 3.5, range: [2, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Deamination', product: '2C-D carboxylic acid', fraction: 0.5 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Desmethyl-2C-D', fraction: 0.2 }
    ],
    metabolites: [{ name: '2C-D carboxylic acid', active: false, halfLifeH: 5, fraction: 0.5 }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 150], durationH: [4, 6], afterEffectsH: [2, 6], bioavailability: 0.7,
      doses: { threshold: 10, light: [15, 25], common: [25, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. The dose-response steepens sharply above ~40 mg.'],
  sources: ['Shulgin, PiHKAL #22', 'PsychonautWiki consensus ranges']
},

{
  id: 'allylescaline', name: 'Allylescaline', aliases: ['al'],
  class: 'Psychedelic', family: 'Phenethylamine (scaline)', schedule: 'Varies',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical',
         'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Mescaline analogue with an allyloxy group, roughly 20-30× mescaline\'s potency. Reported as strongly visual and comparatively gentle in headspace.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: 'Corresponding phenylacetic acid', fraction: 0.45 },
      { enzyme: 'CYP2D6', reaction: 'O-dealkylation of the allyl group', product: 'Desalkyl metabolites', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Allylescaline carboxylic acid', active: false, halfLifeH: 7, fraction: 0.45 }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 35], strong: [35, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Long duration; nausea during onset is common.'],
  sources: ['Shulgin, PiHKAL #7', 'PsychonautWiki consensus ranges']
},

{
  id: '4-ho-mpt', name: '4-HO-MPT', aliases: ['meprocin', '4-hydroxy-n-methyl-n-propyltryptamine'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Psilocin analogue with N-methyl/N-propyl substitution; reported as visually rich and euphoric with a moderate duration.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A10 / UGT1A9', reaction: 'Glucuronidation', product: '4-HO-MPT glucuronide', fraction: 0.65 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Indole acetic acid derivative', fraction: 0.2 }
    ],
    metabolites: [{ name: '4-HO-MPT glucuronide', active: false, halfLifeH: 4, fraction: 0.65 }],
    substrateOf: ['UGT1A10', 'MAO-A'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 15], common: [15, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: ['MAOI potentiation risk. Cross-tolerant with psilocybin and LSD.'],
  sources: ['Shulgin, TiHKAL', 'PsychonautWiki consensus ranges']
},

{
  id: '5-meo-malt', name: '5-MeO-MALT', aliases: ['5-methoxy-n-methyl-n-allyltryptamine'],
  class: 'Psychedelic', family: 'Tryptamine', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical',
         'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Methoxylated allyl tryptamine. Unlike 5-MeO-DMT it is orally active and much longer, with a more conventional psychedelic character.',
  halfLife: { hours: 4, range: [2, 7], confidence: 'anecdotal',
    notes: 'No published pharmacokinetics. Inferred from user-reported durations — opinion, not evidence.' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A', reaction: 'Oxidative deamination', product: 'Indole acetic acid derivative', fraction: 0.35 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: '5-HO-MALT', fraction: 0.25, note: 'Presumed active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: '5-HO-MALT', active: true, halfLifeH: 4, potencyRel: 0.5, fraction: 0.25 }],
    substrateOf: ['MAO-A', 'CYP2D6'], excretion: 'Renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [90, 180], durationH: [5, 9], afterEffectsH: [3, 10], bioavailability: 0.6,
      doses: { threshold: 2, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Everything here is inferred from user reports.'],
  sources: ['User reports only — no published pharmacology']
},

/* ================= Stimulants ================= */
{
  id: 'buphedrone', name: 'Buphedrone', aliases: ['α-methylamino-butyrophenone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'Varies / analogue',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'norepinephrine-releaser',
         'mao-contraindicated', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'Homologue of methcathinone with an extended alkyl chain; a dopamine/noradrenaline releaser with a more stimulant and less entactogenic profile than mephedrone.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Nor-buphedrone', fraction: 0.3, note: 'Active.' },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Dihydro-buphedrone', fraction: 0.35, note: 'Main urinary marker.' }
    ],
    metabolites: [
      { name: 'Nor-buphedrone', active: true, halfLifeH: 4, potencyRel: 0.5, fraction: 0.3 },
      { name: 'Dihydro-buphedrone', active: false, halfLifeH: 4, fraction: 0.35 }
    ],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [50, 100], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 15, light: [30, 60], common: [60, 120], strong: [120, 180], heavy: 180, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [15, 35], durationH: [1.5, 3], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 10, light: [20, 40], common: [40, 80], strong: [80, 120], heavy: 120, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Compulsive redosing typical of the cathinone class.'],
  sources: ['EMCDDA notifications', 'PsychonautWiki consensus ranges']
},

{
  id: 'mdpep', name: 'MDPEP', aliases: ['mdpv analogue', '3,4-methylenedioxy-α-pyrrolidinoheptanophenone'],
  class: 'Stimulant', family: 'Cathinone (pyrovalerone)', schedule: 'Varies / analogue',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'hyperthermia-risk', 'psychosis-risk', 'highly-addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Extended-chain pyrovalerone in the MDPV family; a potent DAT/NET reuptake inhibitor with essentially no serotonergic activity.',
  halfLife: { hours: 4, range: [2, 7], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Demethylenation of the methylenedioxy ring', product: 'Catechol metabolite', fraction: 0.4 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'Methoxy-hydroxy-MDPEP', fraction: 0.3, note: 'Urinary marker.' },
      { enzyme: 'CYP2C19', reaction: 'Pyrrolidine oxidation', product: '2-oxo-MDPEP', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Methoxy-hydroxy-MDPEP', active: false, halfLifeH: 5, fraction: 0.3 },
      { name: '2-oxo-MDPEP', active: false, halfLifeH: 5, fraction: 0.2 }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19', 'COMT'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 40], durationH: [2, 4], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 2, light: [3, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } }
  },
  warnings: [
    'Active in single milligrams; volumetric dosing essential.',
    'Extreme compulsive redosing, binges and stimulant psychosis, as with the whole pyrovalerone family.'
  ],
  sources: ['EMCDDA notifications', 'CFSRE NPS Discovery']
},

{
  id: 'hdmp-28', name: 'HDMP-28', aliases: ['methylnaphthidate'],
  class: 'Stimulant', family: 'Phenidate', schedule: 'Varies / analogue',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'vasoconstrictor', 'addictive'],
  toleranceGroup: 'methylphenidate', toleranceHalfLifeDays: 4,
  mechanism: 'Naphthalene analogue of methylphenidate, several times more potent at DAT, with a longer duration and stronger reported compulsion.',
  halfLife: { hours: 5, range: [3, 9], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CES1', reaction: 'De-esterification', product: 'Naphthidic acid', fraction: 0.8,
      note: 'Same carboxylesterase route as methylphenidate; the product is inactive.' }],
    metabolites: [{ name: 'Naphthidic acid', active: false, halfLifeH: 6, fraction: 0.8 }],
    substrateOf: ['CES1'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [3, 10], bioavailability: 0.5,
      doses: { threshold: 3, light: [5, 12], common: [12, 25], strong: [25, 40], heavy: 40, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [20, 40], durationH: [3, 5], afterEffectsH: [3, 10], bioavailability: 0.8,
      doses: { threshold: 2, light: [4, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } }
  },
  warnings: ['Strong compulsive redosing and prolonged vasoconstriction reported. As with ethylphenidate, insufflation is corrosive.'],
  sources: ['PsychonautWiki consensus ranges', 'Limited forensic data']
},

/* ================= Dissociatives ================= */
{
  id: 'pcpr', name: 'PCPr', aliases: ['phenylcyclohexylpropylamine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Propyl homologue of PCE in the phencyclidine family; an NMDA channel blocker of moderate potency with a long duration.',
  halfLife: { hours: 6, range: [3, 12], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'N-depropylation', product: 'Nor-PCPr', fraction: 0.35, note: 'Presumed active.' },
      { enzyme: 'CYP3A4', reaction: 'Cyclohexyl hydroxylation', product: 'Hydroxy-PCPr', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Nor-PCPr', active: true, halfLifeH: 7, potencyRel: 0.4, fraction: 0.35 },
      { name: 'Hydroxy-PCPr', active: false, halfLifeH: 6, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'CYP2B6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [4, 8], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 3, light: [5, 12], common: [12, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Long, delayed onset causes redosing before the first dose peaks — the recurring hazard of this family.',
    'The PCP-family dissociatives are associated with agitation, mania and lasting psychosis more than ketamine is.'
  ],
  sources: ['Wallach et al. 2016, Br J Pharmacol', 'PsychonautWiki consensus ranges']
},

{
  id: 'mxpr', name: 'MXPr', aliases: ['methoxpropamine', '3-meo-2-oxo-pcpr'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'urotoxic', 'addictive'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Propyl homologue of methoxetamine, sold alongside MXiPr as an MXE replacement. Similar NMDA antagonism with a slightly longer duration.',
  halfLife: { hours: 4.5, range: [2, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'N-depropylation', product: 'Nor-MXPr', fraction: 0.45, note: 'Presumed active.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'O-desmethyl-MXPr', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Nor-MXPr', active: true, halfLifeH: 6, potencyRel: 0.3, fraction: 0.45 },
      { name: 'O-desmethyl-MXPr', active: true, halfLifeH: 5, potencyRel: 0.4, fraction: 0.25 }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [5, 20], peakMin: [25, 55], durationH: [2.5, 5], afterEffectsH: [2, 10], bioavailability: 0.75,
      doses: { threshold: 5, light: [10, 20], common: [20, 35], strong: [35, 55], heavy: 55, unit: 'mg' } }
  },
  warnings: [
    'Delayed onset drives redosing. Presumed to share ketamine\'s bladder toxicity with repeated use.'
  ],
  sources: ['PsychonautWiki consensus ranges', 'Forensic identifications']
}

]);

/* Remaining psychedelics (scalines, 3C-x, TMA, 2Cs, NBOH), dissociatives,
   cannabinoids and nootropics. */
DB.register([

/* ================= Scalines and 3C-x ================= */
{
  id: 'escaline', name: 'Escaline',
  class: 'Psychedelic', family: 'Phenethylamine (scaline)', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Mescaline analogue with the 3-methoxy replaced by ethoxy, roughly 8-10× mescaline\'s potency. Reported as clearer and less nauseating than mescaline.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: 'Corresponding phenylacetic acid', fraction: 0.5,
        note: 'Primary route, as with mescaline — MAOIs potentiate it substantially.' },
      { enzyme: 'CYP2D6', reaction: 'O-dealkylation', product: 'Desalkyl metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Escaline carboxylic acid', active: false, halfLifeH: 7, fraction: 0.5 }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 10, light: [20, 40], common: [40, 60], strong: [60, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. Long duration; nausea during onset is common.'],
  sources: ['Shulgin, PiHKAL #37', 'Community consensus ranges']
},

{
  id: 'proscaline', name: 'Proscaline',
  class: 'Psychedelic', family: 'Phenethylamine (scaline)', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'mao-substrate', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'Propoxy mescaline analogue, roughly 10-15× mescaline. Reported as visual and comparatively gentle in headspace.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO-A / MAO-B', reaction: 'Deamination', product: 'Corresponding phenylacetic acid', fraction: 0.5 },
      { enzyme: 'CYP2D6', reaction: 'O-depropylation', product: 'Desalkyl metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Proscaline carboxylic acid', active: false, halfLifeH: 7, fraction: 0.5 }],
    substrateOf: ['MAO-A', 'MAO-B', 'CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 10, light: [15, 30], common: [30, 60], strong: [60, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated.'],
  sources: ['Shulgin, PiHKAL #147']
},

{
  id: '3c-e', name: '3C-E',
  class: 'Psychedelic', family: 'Amphetamine (3C)', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'stimulant', 'serotonergic', '5ht2a-agonist', 'mao-contraindicated',
         'long-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'The alpha-methylated (amphetamine) homologue of escaline. The α-methyl group blocks MAO deamination, giving a much longer duration than the scaline it derives from — the same relationship as 2C-B to DOB.',
  halfLife: { hours: 10, range: [6, 16], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-dealkylation', product: 'Hydroxy-methoxy metabolites', fraction: 0.4 },
      { enzyme: 'MAO', reaction: 'Slow deamination', product: 'Phenylacetic acid derivative', fraction: 0.15,
        note: 'Substantially MAO-resistant because of the α-methyl group — hence the long duration.' }
    ],
    metabolites: [{ name: 'Uncharacterised hydroxy metabolites', active: false, halfLifeH: 11, fraction: 0.4 }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [180, 360], durationH: [10, 18], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 30], strong: [30, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Long duration and a steep dose-response curve — Shulgin described notably difficult experiences above 30 mg.',
    'MAOI-contraindicated.'
  ],
  sources: ['Shulgin, PiHKAL #24']
},

{
  id: 'tma-2', name: 'TMA-2', aliases: ['2,4,5-trimethoxyamphetamine'],
  class: 'Psychedelic', family: 'Amphetamine (TMA)', schedule: 'I (US)',
  tags: ['psychedelic', 'stimulant', 'serotonergic', '5ht2a-agonist', 'mao-contraindicated',
         'long-duration', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'Trimethoxyamphetamine isomer, roughly 17× mescaline and considerably more potent than TMA itself. Long-acting with a heavy body load.',
  halfLife: { hours: 10, range: [6, 16], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Hydroxy-dimethoxyamphetamines', fraction: 0.4 },
      { enzyme: 'MAO', reaction: 'Slow deamination', product: 'Phenylacetic acid derivative', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false, halfLifeH: 11, fraction: 0.4 }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [180, 360], durationH: [8, 16], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated. TMA itself (the 3,4,5 isomer) is notably more prone to causing anger and hostility.'],
  sources: ['Shulgin, PiHKAL #158']
},

{
  id: '25i-nboh', name: '25I-NBOH',
  class: 'Psychedelic', family: 'NBOH', schedule: 'Varies / analogue',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'research-chemical', 'vasoconstrictor',
         'cardiotoxic', 'seizure-risk', 'high-toxicity', 'mao-contraindicated', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 3, minRedoseDays: 14,
  mechanism: 'The hydroxybenzyl analogue of 25I-NBOMe — a potent full 5-HT2A agonist. Slightly less stable than the NBOMes and reported as marginally less harsh, but it belongs to the same dangerous class.',
  halfLife: { hours: 3, range: [1, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation and oxidation', product: 'Hydroxylated metabolites', fraction: 0.4 },
      { enzyme: 'CYP1A2', reaction: 'N-dealkylation', product: '2C-I', fraction: 0.1, note: 'Yields an active psychedelic metabolite.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: '2C-I', active: true, halfLifeH: 4, potencyRel: 0.1, fraction: 0.1 }],
    substrateOf: ['CYP3A4', 'CYP1A2'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    sublingual: { onsetMin: [15, 45], peakMin: [60, 150], durationH: [4, 8], afterEffectsH: [4, 24], bioavailability: 0.6,
      doses: { threshold: 0.1, light: [0.2, 0.6], common: [0.6, 1.2], strong: [1.2, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: [
    'Same class as the NBOMes: full 5-HT2A agonism, seizures, hyperthermia, severe vasoconstriction and deaths at doses near recreational ones.',
    'Frequently mis-sold as LSD. Bitter taste; LSD is tasteless. Reagent-test blotter.',
    'Orally inactive when swallowed — must be held sublingually, which is how people end up redosing then absorbing everything.'
  ],
  sources: ['Nikolaou et al. 2015, Forensic Sci Int', 'CFSRE reports']
},

/* ================= Dissociatives ================= */
{
  id: 'tiletamine', name: 'Tiletamine', aliases: ['telazol', 'zoletil'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'III (US, veterinary)',
  tags: ['dissociative', 'nmda-antagonist', 'anaesthetic', 'veterinary', 'cns-depressant',
         'seizure-risk', 'urotoxic'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'A veterinary dissociative anaesthetic, roughly 3× ketamine\'s potency and considerably longer-acting. Always sold combined with zolazepam (a benzodiazepine) as Telazol/Zoletil, because on its own it causes severe seizures and convulsive emergence.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'measured', notes: 'Measured in animals; no human PK data exists.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'N-demethylation', product: 'Nor-tiletamine', fraction: 0.5, note: 'Presumed active, as with norketamine.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Nor-tiletamine', active: true, halfLifeH: 5, potencyRel: 0.3, fraction: 0.5 }],
    substrateOf: ['CYP3A4', 'CYP2B6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    im: { onsetMin: [2, 10], peakMin: [10, 30], durationH: [1, 3], afterEffectsH: [2, 12], bioavailability: 0.9,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Causes seizures and violent convulsive emergence reactions on its own — the reason it is never sold without zolazepam.',
    'The commercial product is a fixed combination, so taking it means taking a benzodiazepine too, with all the depressant interactions that implies.',
    'Veterinary formulations are concentrated and not designed for human dosing.'
  ],
  sources: ['Lin et al. 1993, J Vet Pharmacol Ther', 'Veterinary anaesthesia literature']
},

{
  id: 'mxp', name: 'MXP', aliases: ['methoxphenidine', '2-meo-diphenidine', 'moxi'],
  class: 'Dissociative', family: 'Diarylethylamine', schedule: 'Varies / banned in UK',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant',
         'hypertensive-risk', 'psychosis-risk', 'compulsive-redosing'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Methoxylated diphenidine analogue. A potent NMDA channel blocker with a long duration and a notably delayed onset.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Hydroxy-MXP', fraction: 0.35, note: 'Identified in human urine studies.' },
      { enzyme: 'CYP3A4', reaction: 'Piperidine ring degradation', product: 'Ring-opened metabolites', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Hydroxy-MXP', active: false, halfLifeH: 7, fraction: 0.35, note: 'Main urinary marker.' }],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [5, 10], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 10, light: [20, 45], common: [45, 80], strong: [80, 120], heavy: 120, unit: 'mg' } }
  },
  warnings: [
    'Onset can take two hours — the single most common cause of overdose with this compound is redosing before the first dose has landed.',
    'Marked hypertension and prolonged confusion reported. Implicated in several deaths.'
  ],
  sources: ['Wallach et al. 2016, Drug Test Anal', 'McLaughlin et al. 2016, Forensic Sci Int']
},

{
  id: 'fluorolintane', name: 'Fluorolintane', aliases: ['2-fl-diphenidine', '2f-dpd'],
  class: 'Dissociative', family: 'Diarylethylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Fluorinated diphenidine analogue with broadly similar NMDA antagonism. Essentially uncharacterised.',
  halfLife: { hours: 5, range: [3, 9], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'Aromatic hydroxylation', product: 'Hydroxy-fluorolintane', fraction: 0.4 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Hydroxy-fluorolintane', active: false, halfLifeH: 6, fraction: 0.4 }],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [4, 16], bioavailability: 0.7,
      doses: { threshold: 15, light: [25, 50], common: [50, 90], strong: [90, 130], heavy: 130, unit: 'mg' } }
  },
  warnings: ['Delayed onset drives redosing. No human data of any kind.'],
  sources: ['Community consensus ranges only']
},

{
  id: 'gacyclidine', name: 'Gacyclidine', aliases: ['gk-11'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Research compound',
  tags: ['dissociative', 'nmda-antagonist', 'neuroprotective', 'research-chemical', 'cns-depressant'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'A PCP analogue investigated clinically for spinal cord injury and acoustic trauma because of its neuroprotective NMDA blockade. Roughly 5× PCP\'s NMDA affinity but with less of the psychotomimetic character in animal work.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'estimated', notes: 'Limited human data from clinical trials only.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Piperidine hydroxylation', product: 'Hydroxygacyclidine', fraction: 0.45 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Hydroxygacyclidine', active: false, halfLifeH: 5, fraction: 0.45 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 0.5, light: [1, 3], common: [3, 6], strong: [6, 10], heavy: 10, unit: 'mg' } }
  },
  warnings: ['Very potent by weight. Trial data only; no recreational dosing information exists.'],
  sources: ['Hirbec et al. 2001, Brain Res Rev']
},

/* ================= Cannabinoids ================= */
{
  id: 'nabilone', name: 'Nabilone', aliases: ['cesamet'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (prescription)', schedule: 'II (US)',
  tags: ['cannabinoid', 'cb1-agonist', 'antiemetic', 'psychosis-risk', 'orthostatic-hypotension'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'A prescription synthetic cannabinoid, structurally similar to THC but more potent and with more predictable oral absorption. Licensed for chemotherapy-induced nausea.',
  halfLife: { hours: 2, range: [1.5, 3], confidence: 'measured',
    notes: 'The parent is short-lived but its metabolites persist far longer — terminal elimination of total metabolites is around 35 hours.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2E1 / CYP2C8', reaction: 'Ketone reduction and oxidation', product: 'Carbinol metabolite', fraction: 0.5, note: 'Active.' },
      { enzyme: 'CYP2C8', reaction: 'Side-chain oxidation', product: 'Hydroxylated metabolites', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Nabilone carbinol metabolite', active: true, halfLifeH: 35, potencyRel: 0.6, fraction: 0.5,
      note: 'Long-lived and active — the reason effects outlast the parent considerably.' }],
    substrateOf: ['CYP2E1', 'CYP2C8'], excretion: 'Faecal ~65%, renal ~25%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [12, 48], bioavailability: 0.96,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 6, unit: 'mg' } }
  },
  warnings: [
    'Considerably more potent than THC by weight and with much better oral bioavailability — 1 mg is a meaningful dose.',
    'Causes marked orthostatic hypotension and, in older patients, confusion and hallucinations.',
    'Additive with alcohol and other depressants.'
  ],
  sources: ['DrugBank DB00486']
},

{
  id: 'am-2201', name: 'AM-2201',
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (naphthoylindole)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'nephrotoxic', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Fluorinated JWH-018 analogue and a full CB1 agonist of considerably higher potency. One of the dominant synthetic cannabinoids of the early 2010s.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9 / CYP1A2', reaction: 'Oxidative defluorination', product: 'JWH-018 N-(5-hydroxypentyl)', fraction: 0.4,
        note: 'CRITICAL: defluorination converts it into an active JWH-018 metabolite, so AM-2201 and JWH-018 share urinary markers and both produce active metabolites that prolong intoxication.' },
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation', product: 'Hydroxy-AM-2201', fraction: 0.25, note: 'Retains CB1 activity.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'JWH-018 N-(5-hydroxypentyl)', active: true, halfLifeH: 3, potencyRel: 0.8, fraction: 0.4 },
      { name: 'Hydroxy-AM-2201', active: true, halfLifeH: 3, potencyRel: 0.7, fraction: 0.25 }
    ],
    substrateOf: ['CYP2C9', 'CYP1A2', 'UGT'], excretion: 'Renal and faecal.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.1, light: [0.2, 0.5], common: [0.5, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'Specifically associated with acute kidney injury in a documented multi-state US outbreak, on top of the usual seizures and psychosis.',
    'Multiple fully active metabolites — the intoxication does not end when the parent clears.',
    'Not detected by standard cannabis drug tests.'
  ],
  sources: ['CDC MMWR 2013 (AKI outbreak)', 'Chimalakonda et al. 2012, Drug Metab Dispos']
},

{
  id: 'xlr-11', name: 'XLR-11', aliases: ['5f-ur-144'],
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (tetramethylcyclopropyl)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'nephrotoxic', 'seizure-risk',
         'high-toxicity', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Fluorinated UR-144 analogue and full CB1 agonist. Strongly associated with acute kidney injury — more so than most of the class.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidative defluorination', product: 'UR-144 N-(5-hydroxypentyl)', fraction: 0.4,
        note: 'Converts to active UR-144 metabolites; the defluorinated species are suspected in the nephrotoxicity.' },
      { enzyme: 'CYP2C9', reaction: 'Ring hydroxylation', product: 'Hydroxy-XLR-11', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'UR-144 N-(5-hydroxypentyl)', active: true, halfLifeH: 3, potencyRel: 0.7, fraction: 0.4 },
      { name: 'XLR-11 pentanoic acid', active: false, halfLifeH: 4, fraction: 0.25, note: 'Urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2C9', 'UGT'], excretion: 'Renal and faecal.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.1, light: [0.2, 0.5], common: [0.5, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'The synthetic cannabinoid most clearly linked to acute kidney injury — clusters of young people requiring dialysis were reported across several US states.',
    'Seizures, psychosis and uneven spraying onto plant material apply as with the whole class.'
  ],
  sources: ['CDC MMWR 2013', 'Thornton et al. 2013, Clin Toxicol']
},

{
  id: 'ab-pinaca', name: 'AB-PINACA',
  class: 'Cannabinoid', family: 'Synthetic cannabinoid (indazole carboxamide)', schedule: 'I (US)',
  tags: ['cannabinoid', 'cb1-full-agonist', 'research-chemical', 'seizure-risk', 'high-toxicity',
         'cardiotoxic', 'psychosis-risk', 'addictive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Indazole carboxamide full CB1 agonist, originally from Pfizer analgesic research. Caused a well-documented mass poisoning event in Colorado in 2013.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CES1', reaction: 'Amide hydrolysis', product: 'AB-PINACA carboxylic acid', fraction: 0.45, note: 'Main urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Pentyl chain hydroxylation', product: 'Hydroxypentyl-AB-PINACA', fraction: 0.25, note: 'Retains CB1 activity.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Hydroxypentyl-AB-PINACA', active: true, halfLifeH: 3, potencyRel: 0.6, fraction: 0.25 },
      { name: 'AB-PINACA carboxylic acid', active: false, halfLifeH: 4, fraction: 0.45 }
    ],
    substrateOf: ['CES1', 'CYP3A4', 'UGT'], excretion: 'Renal and faecal.', confidence: 'estimated'
  },
  routes: {
    smoked: { onsetMin: [0.5, 5], peakMin: [5, 20], durationH: [1, 3], afterEffectsH: [1, 6], bioavailability: 0.4,
      doses: { threshold: 0.05, light: [0.1, 0.4], common: [0.4, 1.2], strong: [1.2, 2.5], heavy: 2.5, unit: 'mg' } }
  },
  warnings: [
    'Caused a mass-casualty poisoning event with over 200 emergency presentations in a single outbreak.',
    'Active metabolites prolong the effect; not detected by standard cannabis tests.'
  ],
  sources: ['Trecki et al. 2015, NEJM', 'CFSRE reports']
},

/* ================= Nootropics ================= */
{
  id: 'noopept', name: 'Noopept', aliases: ['n-phenylacetyl-l-prolylglycine ethyl ester', 'gvs-111'],
  class: 'Other', family: 'Racetam-like dipeptide', schedule: 'Rx in Russia; unscheduled elsewhere',
  tags: ['nootropic', 'non-psychoactive', 'prodrug', 'neuroprotective'],
  mechanism: 'A dipeptide nootropic developed in Russia, roughly 1000× piracetam by weight. It is a prodrug: it metabolises to cycloprolylglycine, an endogenous neuropeptide that modulates AMPA and NMDA receptors and raises BDNF and NGF expression.',
  halfLife: { hours: 0.4, range: [0.25, 0.75], confidence: 'measured',
    notes: 'The parent lasts under half an hour. Effects come from cycloprolylglycine and from downstream transcriptional changes, which build over days to weeks.' },
  metabolism: {
    pathways: [
      { enzyme: 'Peptidases / esterases', reaction: 'Hydrolysis', product: 'Cycloprolylglycine', fraction: 0.7,
        note: 'The active species — an endogenous neuropeptide, which is part of why the safety profile appears benign.' },
      { enzyme: 'Hepatic hydrolysis', reaction: 'Further cleavage', product: 'Phenylacetic acid + proline + glycine', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Cycloprolylglycine', active: true, halfLifeH: 1, potencyRel: 1.0, fraction: 0.7 },
      { name: 'Phenylacetic acid', active: false, halfLifeH: 1, fraction: 0.25 }
    ],
    substrateOf: ['CES1'], excretion: 'Renal, as amino acid fragments.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [30, 60], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.1,
      doses: { threshold: 5, light: [10, 15], common: [15, 30], strong: [30, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'Roughly 1000× the potency of piracetam by weight — do not carry racetam dosing habits across to it.',
    'Not approved as a supplement in the US, though widely sold as one. Long-term human safety data is thin.'
  ],
  sources: ['Ostrovskaya et al. 2002, Behav Pharmacol', 'Russian clinical literature']
},

{
  id: 'aniracetam', name: 'Aniracetam',
  class: 'Other', family: 'Racetam', schedule: 'Rx in EU; unscheduled elsewhere',
  tags: ['nootropic', 'non-psychoactive', 'anxiolytic', 'ampa-modulator', 'cyp2c9-inhibitor'],
  mechanism: 'A fat-soluble racetam and positive allosteric modulator of AMPA receptors, slowing their desensitisation. Reported as more anxiolytic and less purely cognitive than piracetam.',
  halfLife: { hours: 0.5, range: [0.3, 1], confidence: 'measured',
    notes: 'Very short, and almost entirely destroyed first-pass — its metabolites carry most of the effect.' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability under 10%.',
    pathways: [
      { enzyme: 'Hepatic amidase / CYP2C9', reaction: 'Amide hydrolysis', product: 'N-anisoyl-GABA', fraction: 0.6,
        note: 'The main circulating species and likely the active one.' },
      { enzyme: 'CYP', reaction: 'Demethylation', product: '2-Pyrrolidinone + p-anisic acid', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'N-anisoyl-GABA', active: true, halfLifeH: 3, potencyRel: 1.0, fraction: 0.6 },
      { name: 'p-Anisic acid', active: false, halfLifeH: 2, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C9'], inhibits: ['CYP2C9'],
    excretion: 'Renal, as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [30, 90], durationH: [3, 5], afterEffectsH: [1, 4], bioavailability: 0.1,
      doses: { threshold: 200, light: [400, 750], common: [750, 1500], strong: [1500, 3000], heavy: 3000, unit: 'mg' } }
  },
  warnings: [
    'Inhibits CYP2C9, which can raise levels of warfarin, phenytoin and NSAIDs.',
    'Fat-soluble — absorption is much better with food.'
  ],
  sources: ['Ogiso et al. 1998, Biol Pharm Bull', 'Malykh & Sadaie 2010, Drugs']
},

{
  id: 'semax', name: 'Semax',
  class: 'Other', family: 'ACTH peptide analogue', schedule: 'Rx in Russia/Ukraine; unscheduled elsewhere',
  tags: ['nootropic', 'peptide', 'non-psychoactive', 'neuroprotective'],
  mechanism: 'A synthetic heptapeptide analogue of ACTH(4-10) without hormonal activity, developed in Russia for stroke and cognitive indications. Raises BDNF and NGF expression and modulates the dopaminergic and serotonergic systems.',
  halfLife: { hours: 0.5, range: [0.2, 1], confidence: 'estimated',
    notes: 'As a peptide it is degraded rapidly by peptidases, yet effects reportedly persist for hours — attributed to downstream BDNF changes rather than to the peptide itself remaining.' },
  metabolism: {
    firstPass: 'Complete if swallowed — peptidases in the gut destroy it, which is why it is given intranasally.',
    pathways: [
      { enzyme: 'Peptidases', reaction: 'Sequential enzymatic cleavage', product: 'Shorter peptide fragments', fraction: 0.9,
        note: 'Some fragments (notably Pro-Gly-Pro) are themselves biologically active and longer-lived than the parent.' }
    ],
    metabolites: [{ name: 'Pro-Gly-Pro', active: true, halfLifeH: 2, potencyRel: 0.3, fraction: 0.9,
      note: 'Active fragment; contributes to the sustained effect.' }],
    substrateOf: [], excretion: 'Renal, as amino acids.', confidence: 'estimated'
  },
  routes: {
    intranasal: { onsetMin: [10, 40], peakMin: [20, 60], durationH: [3, 8], afterEffectsH: [2, 12], bioavailability: 0.6,
      doses: { threshold: 100, light: [200, 400], common: [400, 900], strong: [900, 1800], heavy: 1800, unit: 'µg' } }
  },
  warnings: [
    'Essentially all clinical evidence is Russian and has not been independently replicated to Western regulatory standards.',
    'Oral dosing is pointless — it must be intranasal.'
  ],
  sources: ['Ashmarin et al. 1997', 'Russian clinical literature']
},

{
  id: 'vinpocetine', name: 'Vinpocetine', aliases: ['cavinton'],
  class: 'Other', family: 'Vinca alkaloid derivative', schedule: 'Rx in EU/Russia; banned as a US supplement',
  tags: ['nootropic', 'vasodilator', 'non-psychoactive', 'pde1-inhibitor', 'teratogen'],
  mechanism: 'A semi-synthetic derivative of vincamine from periwinkle. Inhibits PDE1 and blocks voltage-gated sodium channels, increasing cerebral blood flow. Prescribed for cerebrovascular disorders across Eastern Europe.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~7%, much improved with food.',
    pathways: [
      { enzyme: 'Hepatic esterase', reaction: 'Ester hydrolysis', product: 'Apovincaminic acid (AVA)', fraction: 0.7,
        note: 'The main circulating metabolite; retains some activity.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Apovincaminic acid', active: true, halfLifeH: 2, potencyRel: 0.3, fraction: 0.7 }],
    substrateOf: ['CES1', 'UGT'], excretion: 'Renal and faecal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [1, 4], bioavailability: 0.07,
      doses: { threshold: 5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'The FDA warned in 2019 that it may cause miscarriage or fetal harm and should not be taken by anyone who could become pregnant. It was subsequently ruled not a lawful US supplement ingredient.',
    'Mild antiplatelet activity; caution with anticoagulants and NSAIDs.'
  ],
  sources: ['FDA vinpocetine advisory 2019', 'Patyar et al. 2011, J Pharmacol Pharmacother']
},

{
  id: 'huperzine-a', name: 'Huperzine A',
  class: 'Other', family: 'Lycopodium alkaloid', schedule: 'Sold as a supplement; Rx in China',
  tags: ['nootropic', 'acetylcholinesterase-inhibitor', 'non-psychoactive', 'cholinergic-risk',
         'long-duration', 'seizure-threshold'],
  mechanism: 'A potent, selective and reversible acetylcholinesterase inhibitor from Chinese club moss, used in China for Alzheimer\'s disease. It raises synaptic acetylcholine directly — this is a genuine pharmacological drug, not a benign herb.',
  halfLife: { hours: 12, range: [10, 14], confidence: 'measured',
    notes: 'Long, so it accumulates with daily dosing. Cholinergic side effects often appear on day 3-5 rather than day 1.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP1A2 / CYP3A4', reaction: 'Hydroxylation and demethylation', product: 'Hydroxylated metabolites', fraction: 0.5 },
      { enzyme: 'None (renal)', reaction: 'Excreted unchanged', product: 'Huperzine A', fraction: 0.35 }
    ],
    metabolites: [{ name: 'Hydroxyhuperzine A', active: false, halfLifeH: 13, fraction: 0.5 }],
    substrateOf: ['CYP1A2', 'CYP3A4'], excretion: 'Renal, ~35% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 120], durationH: [8, 14], afterEffectsH: [4, 24], bioavailability: 0.9,
      doses: { threshold: 20, light: [50, 100], common: [100, 200], strong: [200, 400], heavy: 400, unit: 'µg' } }
  },
  warnings: [
    'Acetylcholinesterase inhibition is cumulative — excess causes a cholinergic syndrome: nausea, sweating, salivation, muscle cramps, bradycardia and, at the extreme, seizures.',
    'Do NOT combine with other cholinergics (donepezil, galantamine, rivastigmine, high-dose alpha-GPC or choline) — the effects add.',
    'Sold in micrograms for good reason; it is dosed at roughly a thousandth of a typical supplement.'
  ],
  sources: ['Wang et al. 2006, Acta Pharmacol Sin', 'Li et al. 2008, Cochrane Review']
}

]);

/* Gap-closers: the harmala alkaloids (the MAOIs this database warns about
   constantly but did not contain), flumazenil, LSA — plus the designer
   benzodiazepines that were still missing. */
DB.register([

/* ================= Harmala alkaloids ================= */
{
  id: 'harmine', name: 'Harmine', aliases: ['banisteriine', 'telepathine'],
  class: 'Other', family: 'Beta-carboline (harmala alkaloid)', schedule: 'Unscheduled in most countries',
  tags: ['maoi', 'maoi-reversible', 'serotonergic', 'serotonin-syndrome-risk', 'high-interaction-risk',
         'mao-a-inhibitor', 'tyramine-restricted'],
  mechanism: 'The principal MAO-A inhibitor of Banisteriopsis caapi (ayahuasca vine) and Peganum harmala (Syrian rue). A reversible inhibitor of MAO-A (a RIMA), which is what makes orally-ingested DMT active — without it, gut and liver MAO destroys DMT before it reaches the brain. Mildly psychoactive alone at high doses: sedating, nauseating and dreamy rather than psychedelic.',
  halfLife: { hours: 3, range: [1, 5], confidence: 'measured',
    notes: 'Short and reversible, unlike phenelzine. But "reversible" reduces the FOOD interaction, not the drug interaction — the serotonergic risk is fully present while it is active.' },
  metabolism: {
    firstPass: 'Very heavy — CYP2D6 destroys most of an oral dose, which is why ayahuasca brews need substantial vine.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Harmol', fraction: 0.6,
        note: 'Dominant. CYP2D6 poor metabolisers reach far higher harmine levels from the same brew — a real and under-appreciated source of variability in ayahuasca experiences.' },
      { enzyme: 'CYP1A2 / CYP2C19', reaction: 'Secondary oxidation', product: 'Hydroxylated metabolites', fraction: 0.15 },
      { enzyme: 'UGT / SULT', reaction: 'Conjugation of harmol', product: 'Harmol glucuronide/sulfate', fraction: 0.5 }
    ],
    metabolites: [
      { name: 'Harmol', active: true, halfLifeH: 3, potencyRel: 0.3, fraction: 0.6,
        note: 'Retains some MAO-A inhibition; rapidly conjugated.' },
      { name: 'Harmol glucuronide', active: false, halfLifeH: 4, fraction: 0.5 }
    ],
    substrateOf: ['CYP2D6', 'CYP1A2', 'CYP2C19', 'UGT'],
    inhibits: ['MAO-A', 'CYP1A2', 'CYP2D6'],
    excretion: 'Renal, largely as harmol conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [2, 4], afterEffectsH: [1, 4], bioavailability: 0.15,
      doses: { threshold: 20, light: [50, 100], common: [100, 200], strong: [200, 350], heavy: 350, unit: 'mg',
        note: 'As pure harmine. A typical ayahuasca dose of Syrian rue is 3-4 g of seed, containing roughly 100-200 mg of total harmala alkaloids.' } }
  },
  warnings: [
    'This is an MAOI. While it is active, the full MAOI interaction list applies: SSRIs, SNRIs, tramadol, DXM, MDMA, amphetamines, cocaine, pethidine and triptans can all cause serotonin syndrome or hypertensive crisis. Deaths have occurred from ayahuasca taken alongside an antidepressant.',
    'The tyramine ("cheese") reaction is milder than with irreversible MAOIs because tyramine can displace it — but aged cheese, cured meat and fermented foods are still best avoided for the duration.',
    'It potentiates DMT deliberately; it also potentiates anything else that MAO would normally clear, including many psychedelics in this database.',
    'Inhibits CYP1A2 and CYP2D6, raising levels of a wide range of other drugs.'
  ],
  sources: ['Callaway et al. 1999, J Ethnopharmacol', 'Riba et al. 2003, J Pharmacol Exp Ther']
},

{
  id: 'harmaline', name: 'Harmaline',
  class: 'Other', family: 'Beta-carboline (harmala alkaloid)', schedule: 'Unscheduled in most countries',
  tags: ['maoi', 'maoi-reversible', 'serotonergic', 'serotonin-syndrome-risk', 'high-interaction-risk',
         'mao-a-inhibitor', 'tyramine-restricted', 'tremorgenic'],
  mechanism: 'Dihydro analogue of harmine and the second major harmala alkaloid. A somewhat more potent MAO-A inhibitor than harmine and considerably more psychoactive on its own — sedating, strongly nauseating, and producing closed-eye imagery at higher doses. Also a tremorgen.',
  halfLife: { hours: 2.5, range: [1, 4], confidence: 'measured' },
  metabolism: {
    firstPass: 'Heavy, via CYP2D6.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Harmalol', fraction: 0.55, note: 'Retains MAO-A inhibition.' },
      { enzyme: 'CYP1A2', reaction: 'Aromatisation', product: 'Harmine', fraction: 0.1,
        note: 'Partly converts to harmine, so the two alkaloids interconvert in the body.' },
      { enzyme: 'UGT / SULT', reaction: 'Conjugation', product: 'Harmalol conjugates', fraction: 0.45 }
    ],
    metabolites: [
      { name: 'Harmalol', active: true, halfLifeH: 3, potencyRel: 0.4, fraction: 0.55 },
      { name: 'Harmine', active: true, halfLifeH: 3, potencyRel: 0.8, fraction: 0.1 }
    ],
    substrateOf: ['CYP2D6', 'CYP1A2', 'UGT'],
    inhibits: ['MAO-A', 'CYP1A2', 'CYP2D6'],
    excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [3, 5], afterEffectsH: [2, 6], bioavailability: 0.2,
      doses: { threshold: 20, light: [40, 80], common: [80, 150], strong: [150, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Full MAOI interaction profile — see harmine. Contraindicated with SSRIs, stimulants, tramadol, DXM and MDMA.',
    'Causes marked tremor, ataxia and vomiting at doses above ~150 mg. The nausea of ayahuasca is largely this compound.',
    'More psychoactive than harmine on its own, so brews high in harmaline feel heavier and more sedating.'
  ],
  sources: ['Callaway et al. 1999, J Ethnopharmacol', 'Brierley & Davidson 2012, Prog Neuropsychopharmacol']
},

{
  id: 'thh', name: 'Tetrahydroharmine', aliases: ['thh', 'leptaflorine'],
  class: 'Other', family: 'Beta-carboline (harmala alkaloid)', schedule: 'Unscheduled in most countries',
  tags: ['ssri-weak', 'serotonergic', 'serotonin-syndrome-risk', 'maoi-weak', 'high-interaction-risk'],
  mechanism: 'The third major ayahuasca alkaloid, and pharmacologically distinct from the other two: it is only a weak MAO inhibitor but a genuine serotonin reuptake inhibitor. It is thought to contribute the warm, empathic, antidepressant quality of ayahuasca that DMT alone does not produce.',
  halfLife: { hours: 4, range: [2, 7], confidence: 'measured',
    notes: 'Longer-lived than harmine and harmaline, so it lingers after the visionary phase — part of the well-described ayahuasca afterglow.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Tetrahydroharmol', fraction: 0.5 },
      { enzyme: 'UGT / SULT', reaction: 'Conjugation', product: 'THH conjugates', fraction: 0.4 }
    ],
    metabolites: [{ name: 'Tetrahydroharmol', active: true, halfLifeH: 4, potencyRel: 0.3, fraction: 0.5 }],
    substrateOf: ['CYP2D6', 'UGT'],
    inhibits: ['MAO-A'],
    excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [90, 180], durationH: [4, 7], afterEffectsH: [4, 12], bioavailability: 0.25,
      doses: { threshold: 10, light: [25, 50], common: [50, 100], strong: [100, 200], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'Being a serotonin reuptake inhibitor, it adds serotonergic load on top of the MAOI action of the other harmalas — a genuine contributor to serotonin syndrome risk if ayahuasca is combined with an SSRI or MDMA.',
    'Longer-lasting than harmine, so the interaction window outlives the ceremony.'
  ],
  sources: ['Callaway et al. 1999, J Ethnopharmacol', 'McKenna 2004, Pharmacol Ther']
},

{
  id: 'lsa', name: 'LSA', aliases: ['ergine', 'd-lysergic acid amide', 'morning glory', 'hawaiian baby woodrose'],
  class: 'Psychedelic', family: 'Lysergamide', schedule: 'Unscheduled as seeds; ergine is Schedule III (US)',
  tags: ['psychedelic', 'serotonergic', '5ht2a-agonist', 'sedative', 'vasoconstrictor',
         'nauseating', 'psychosis-risk'],
  toleranceGroup: 'psychedelic-5ht2a', toleranceHalfLifeDays: 2, minRedoseDays: 14,
  mechanism: 'The naturally occurring lysergamide of morning glory and Hawaiian baby woodrose seeds. Far less potent than LSD and much more sedating — heavy-limbed drowsiness and nausea dominate, with comparatively modest visuals. Vasoconstrictive, being an ergot alkaloid.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation and hydroxylation', product: 'Hydroxylated lysergamides', fraction: 0.55,
        note: 'By analogy with LSD; not well characterised in humans.' },
      { enzyme: 'Amidase', reaction: 'Hydrolysis of the amide', product: 'Lysergic acid', fraction: 0.2, note: 'Inactive.' }
    ],
    metabolites: [
      { name: 'Lysergic acid', active: false, halfLifeH: 4, fraction: 0.2 },
      { name: 'Isoergine', active: true, halfLifeH: 3, potencyRel: 0.5, fraction: 0.15,
        note: 'Epimer present alongside ergine in the seeds; contributes to the effect.' }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 240], durationH: [5, 8], afterEffectsH: [4, 12], bioavailability: 0.5,
      doses: { threshold: 0.4, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg',
        note: 'As pure LSA. Roughly: 4-8 Hawaiian baby woodrose seeds, or 5-10 g of morning glory seeds — but alkaloid content varies enormously between cultivars and batches.' } }
  },
  warnings: [
    'Commercial seeds are frequently coated with fungicides and insecticides that cause severe nausea and are genuinely toxic. Untreated seed is essential.',
    'Ergot alkaloid vasoconstriction — avoid entirely with other vasoconstrictors, and in anyone with circulatory disease. Prolonged use risks ergotism.',
    'Nausea and vomiting are near-universal and often severe.',
    'Lithium interaction applies as with other psychedelics.'
  ],
  sources: ['Paulke et al. 2015, Anal Bioanal Chem', 'Shulgin, TiHKAL']
},

/* ================= Reversal agent ================= */
{
  id: 'flumazenil', name: 'Flumazenil', aliases: ['anexate', 'romazicon'],
  class: 'Other', family: 'Benzodiazepine antagonist', schedule: 'Prescription (hospital)',
  tags: ['benzodiazepine-antagonist', 'reversal-agent', 'seizure-risk', 'precipitated-withdrawal-risk'],
  mechanism: 'Competitive antagonist at the benzodiazepine site of the GABA-A receptor. Reverses benzodiazepine and z-drug sedation within minutes. It is the benzodiazepine counterpart to naloxone — but with important differences that make it far less freely used.',
  halfLife: { hours: 1, range: [0.7, 1.3], confidence: 'measured',
    notes: 'CRITICAL: much shorter than almost every benzodiazepine it reverses. Diazepam lasts 43 h, clonazolam ~30 h, flubromazepam over 100 h. Re-sedation as flumazenil wears off is expected, not exceptional — exactly the same trap as naloxone with fentanyl.' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~16%, which is why it is given intravenously.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'De-ethylation', product: 'Flumazenil acid', fraction: 0.7, note: 'Inactive.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Flumazenil acid glucuronide', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Flumazenil acid', active: false, halfLifeH: 1.5, fraction: 0.7 }],
    substrateOf: ['CYP3A4', 'UGT'], excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [1, 3], peakMin: [6, 10], durationH: [0.5, 1.5], afterEffectsH: [0.5, 2], bioavailability: 1.0,
      doses: { threshold: 0.1, light: [0.2, 0.3], common: [0.3, 1], strong: [1, 2], heavy: 3, unit: 'mg',
        note: 'Given as 0.2 mg increments titrated to effect, to a usual maximum of 1-3 mg. Hospital use only.' } }
  },
  warnings: [
    'NOT the benzodiazepine equivalent of take-home naloxone. In anyone physically dependent on benzodiazepines it precipitates immediate withdrawal — and unlike opioid withdrawal, benzodiazepine withdrawal can cause SEIZURES that are then untreatable with benzodiazepines, because their receptor site is blocked.',
    'Especially dangerous in mixed overdose with a tricyclic antidepressant or any pro-convulsant, where it has caused fatal seizures.',
    'It wears off in about an hour while the benzodiazepine does not — re-sedation is expected and the person must be monitored.',
    'For these reasons most benzodiazepine overdoses are managed with airway support rather than reversal. It is included here for completeness, not as something to obtain.'
  ],
  sources: ['Seger 2004, J Toxicol Clin Toxicol', 'DrugBank DB01205']
},

/* ================= Designer benzodiazepines ================= */
{
  id: 'nitrazolam', name: 'Nitrazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Triazolo analogue of nitrazepam, and a close relative of clonazolam lacking the chlorine. Highly potent, active in the tens of micrograms, with strong amnestic and hypnotic effects.',
  halfLife: { hours: 18, range: [10, 35], confidence: 'analogue',
    notes: 'No human PK data. Extrapolated from clonazolam and nitrazepam.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Nitro group reduction', product: '7-Aminonitrazolam', fraction: 0.55,
        note: 'Standard route for the nitrobenzodiazepines; the amino metabolite is the urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the triazole methyl', product: 'α-Hydroxynitrazolam', fraction: 0.2, note: 'Presumed active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: '7-Aminonitrazolam', active: false, halfLifeH: 22, fraction: 0.55 },
      { name: 'α-Hydroxynitrazolam', active: true, halfLifeH: 16, potencyRel: 0.5, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 150], durationH: [8, 14], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 0.05, light: [0.1, 0.25], common: [0.25, 0.5], strong: [0.5, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: [
    'Active in tens of micrograms — volumetric dosing is mandatory, consumer scales cannot weigh it.',
    'Profound amnesia with blackout redosing. Fatal with opioids or alcohol.'
  ],
  sources: ['PsychonautWiki / community consensus ranges', 'Forensic identifications']
},

{
  id: 'pynazolam', name: 'Pynazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Triazolobenzodiazepine bearing a pyridine ring, structurally related to pyrazolam and bromazolam. Appeared on the research chemical market around 2021 and is essentially uncharacterised.',
  halfLife: { hours: 15, range: [8, 30], confidence: 'analogue', notes: 'No human data; extrapolated from the triazolo class.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the triazole methyl', product: 'α-Hydroxypynazolam', fraction: 0.5,
        note: 'Presumed active, by analogy with the rest of the triazolo family.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'α-Hydroxypynazolam', active: true, halfLifeH: 16, potencyRel: 0.5, fraction: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [8, 14], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 0.1, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: [
    'Detected in seized counterfeit tablets across Europe. No pharmacology, no toxicology, no dosing data — everything here is inferred from its structural class.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['EMCDDA notifications', 'Community consensus ranges only']
},

{
  id: 'fluoprazolam', name: 'Fluoprazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'Fluorinated triazolobenzodiazepine closely related to flualprazolam and flubromazolam. Extremely potent and long-acting.',
  halfLife: { hours: 30, range: [15, 60], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxyfluoprazolam', fraction: 0.5, note: 'Presumed active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'α-Hydroxyfluoprazolam', active: true, halfLifeH: 28, potencyRel: 0.5, fraction: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [10, 18], afterEffectsH: [18, 48], bioavailability: 0.9,
      doses: { threshold: 0.05, light: [0.1, 0.25], common: [0.25, 0.5], strong: [0.5, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: [
    'Active in tens of micrograms with impairment lasting more than a day. Volumetric dosing mandatory.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['NPS Discovery / CFSRE reports', 'Community consensus ranges']
},

{
  id: 'ethylbromazolam', name: 'Ethylbromazolam', aliases: ['ethyl bromazolam'],
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Ethyl homologue of bromazolam, appearing in seized counterfeit tablets from around 2023. Bromazolam itself became the most-detected designer benzodiazepine worldwide; this is one of the successor analogues.',
  halfLife: { hours: 16, range: [8, 30], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the ethyl-triazole', product: 'α-Hydroxyethylbromazolam', fraction: 0.5, note: 'Presumed active.' },
      { enzyme: 'CYP3A4', reaction: 'De-ethylation', product: 'Bromazolam', fraction: 0.15,
        note: 'Likely converts partly to bromazolam itself, which is fully active and longer-lived.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Bromazolam', active: true, halfLifeH: 14, potencyRel: 1.0, fraction: 0.15,
        note: 'Presumed active metabolite — the parent drug of this series.' },
      { name: 'α-Hydroxyethylbromazolam', active: true, halfLifeH: 16, potencyRel: 0.5, fraction: 0.5 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 150], durationH: [8, 14], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 0.1, light: [0.25, 0.5], common: [0.5, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'Found in counterfeit alprazolam tablets, frequently alongside fentanyl or nitazenes. A pressed pill of unknown origin should be assumed to contain both.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['CFSRE NPS Discovery 2023-2024', 'Community consensus ranges']
},

{
  id: 'bromonordiazepam', name: 'Bromonordiazepam', aliases: ['bromo-nordazepam'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'long-duration', 'accumulation-risk', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 9,
  mechanism: 'Brominated analogue of nordazepam. Like its parent it is long-acting, and it is also the expected metabolite of bromazolam-family compounds — so it turns up in toxicology both as a drug taken directly and as a marker of something else.',
  halfLife: { hours: 60, range: [30, 100], confidence: 'analogue',
    notes: 'Nordazepam-like kinetics: very long, with substantial accumulation over days of repeated use.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: '3-hydroxylation', product: 'Bromo-oxazepam', fraction: 0.45, note: 'Presumed active.' },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.35 }
    ],
    metabolites: [{ name: 'Bromo-oxazepam', active: true, halfLifeH: 12, potencyRel: 0.6, fraction: 0.45 }],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 240], durationH: [10, 20], afterEffectsH: [24, 96], bioavailability: 0.9,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'A half-life measured in days means daily use accumulates for a fortnight before levelling off — impairment compounds invisibly.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['Forensic toxicology literature', 'Community consensus ranges']
},

{
  id: 'gidazepam', name: 'Gidazepam', aliases: ['hydazepam', 'gidazepamum'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Rx in Ukraine/Russia; unscheduled elsewhere',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'anxiolytic', 'prodrug',
         'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 8,
  mechanism: 'A Soviet-developed anxiolytic benzodiazepine, still prescribed in Ukraine and some post-Soviet states. It is a PRODRUG: gidazepam itself has weak affinity, and its activity comes from conversion to desalkylgidazepam — a very long-lived active metabolite.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated',
    notes: 'Badly misleading on its own. The active metabolite desalkylgidazepam has a half-life of 60-90 hours, so effects and accumulation are measured in days, not hours.' },
  metabolism: {
    pathways: [
      { enzyme: 'Hepatic hydrolysis / CYP3A4', reaction: 'Cleavage of the hydrazide side chain', product: 'Desalkylgidazepam', fraction: 0.75,
        note: 'THE activating step. The metabolite is the real drug and is dramatically longer-lived than the parent.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Desalkylgidazepam', active: true, halfLifeH: 75, potencyRel: 5, fraction: 0.75,
        note: 'Far more potent and vastly longer-lasting than gidazepam. Now also sold directly as a research chemical, and increasingly found in counterfeit tablets.' }
    ],
    substrateOf: ['CYP3A4', 'UGT'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 300], durationH: [8, 16], afterEffectsH: [24, 96], bioavailability: 0.9,
      doses: { threshold: 10, light: [20, 40], common: [40, 100], strong: [100, 200], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'Because the effect comes from a metabolite with a 60-90 hour half-life, the drug builds up over days. Dosing daily to the same subjective effect leads to steadily rising blood levels and eventual over-sedation.',
    'Desalkylgidazepam is itself now a common research chemical and counterfeit-tablet ingredient.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['Soviet/Ukrainian prescribing literature', 'EMCDDA desalkylgidazepam notifications']
},

{
  id: 'desalkylgidazepam', name: 'Desalkylgidazepam', aliases: ['bromonordazepam analogue'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'long-duration', 'accumulation-risk', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 10,
  mechanism: 'The active metabolite of gidazepam, now sold directly and one of the most frequently detected designer benzodiazepines in European counterfeit tablets since about 2022. Exceptionally long-acting.',
  halfLife: { hours: 75, range: [60, 90], confidence: 'estimated',
    notes: 'Three days or more. A single dose impairs for several days and daily use accumulates for weeks before steady state.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: '3-hydroxylation', product: 'Hydroxy-desalkylgidazepam', fraction: 0.4 },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.4 }
    ],
    metabolites: [{ name: 'Hydroxy-desalkylgidazepam', active: true, halfLifeH: 20, potencyRel: 0.5, fraction: 0.4 }],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 300], durationH: [12, 24], afterEffectsH: [48, 120], bioavailability: 0.9,
      doses: { threshold: 0.5, light: [1, 3], common: [3, 8], strong: [8, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'One of the longest-acting benzodiazepines in circulation. Redosing daily is effectively a continuous escalating dose.',
    'Very common in counterfeit alprazolam and diazepam tablets across Europe, often alongside opioids.',
    'Fatal with opioids or alcohol. Withdrawal after sustained use can be fatal.'
  ],
  sources: ['EMCDDA desalkylgidazepam risk assessment', 'CFSRE NPS Discovery']
}

]);
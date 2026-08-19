/* Entactogens / empathogens */
DB.register([

{
  id: 'mdma', name: 'MDMA', aliases: ['molly', 'ecstasy', 'mandy', '3,4-methylenedioxymethamphetamine', 'xtc'],
  class: 'Entactogen', family: 'Substituted amphetamine', schedule: 'I (US)',
  tags: ['entactogen', 'stimulant', 'serotonin-releaser', 'dopamine-releaser', 'serotonergic',
         'mao-contraindicated', 'hyperthermia-risk', 'hyponatraemia-risk', 'neurotoxicity-risk',
         'cyp2d6-autoinhibitor', 'nonlinear-pk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 14,
  minRedoseDays: 42,
  mechanism: 'Substrate-type releaser at SERT (strongest), NET and DAT, emptying vesicular stores via VMAT2. Also releases oxytocin, vasopressin, cortisol and prolactin, and is a weak 5-HT2A agonist. The serotonin dominance is what separates it from amphetamines.',
  halfLife: { hours: 8, range: [6, 10], confidence: 'measured',
    notes: 'MDMA has NON-LINEAR pharmacokinetics: it inhibits the CYP2D6 enzyme that clears it, so doubling the dose more than doubles exposure. This is the central reason redosing is disproportionately risky.' },
  kinetics: { order: 'first', nonlinear: true },
  metabolism: {
    firstPass: 'Moderate; oral bioavailability ~75%.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylenation of the methylenedioxy ring', product: 'HHMA (3,4-dihydroxymethamphetamine)', fraction: 0.6,
        note: 'The dominant route. MDMA is a MECHANISM-BASED (suicide) inhibitor of CYP2D6 — it destroys the enzyme, which takes ~10 days to resynthesise. Hence the non-linear dose-exposure curve.' },
      { enzyme: 'COMT', reaction: 'O-methylation of HHMA', product: 'HMMA (4-hydroxy-3-methoxymethamphetamine)', from: 'HHMA', fraction: 0.55,
        note: 'Main urinary metabolite. COMT genotype (Val158Met) affects the rate.' },
      { enzyme: 'CYP2B6 / CYP3A4 / CYP1A2', reaction: 'N-demethylation', product: 'MDA', fraction: 0.08,
        note: 'Minor by mass but produces a fully active, longer-lasting drug.' },
      { enzyme: 'UGT / SULT', reaction: 'Glucuronide and sulfate conjugation', product: 'Conjugated HMMA/HHMA', fraction: 0.5 }
    ],
    metabolites: [
      { name: 'MDA', active: true, halfLifeH: 9, potencyRel: 0.6,
        note: 'Active metabolite — more psychedelic and more stimulating than MDMA, with a longer half-life. Responsible for much of the late-session "speedy" quality and for extending the comedown.' },
      { name: 'HHMA', active: false, note: 'A catechol; oxidises to reactive quinones and thioether conjugates that are the leading suspect in MDMA neurotoxicity.' },
      { name: 'HMMA', active: false, halfLifeH: 11, note: 'Main urinary marker; largely inactive.' },
      { name: 'HMA', from: 'MDA', active: false, note: 'Downstream of MDA.' }
    ],
    substrateOf: ['CYP2D6', 'CYP2B6', 'CYP3A4', 'CYP1A2', 'COMT'],
    inhibits: ['CYP2D6', 'CYP2B6', 'MAO-A'],
    excretion: 'Renal; ~65% excreted unchanged, the rest as HMMA conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [75, 120], durationH: [3, 5], afterEffectsH: [6, 24], bioavailability: 0.75,
      doses: { threshold: 40, light: [40, 75], common: [75, 125], strong: [125, 175], heavy: 180, unit: 'mg',
        note: 'A common harm-reduction ceiling is ~1.5 mg/kg. Redose, if any, is usually capped at half the initial dose taken once, ~2 h in.' } },
    insufflated: { onsetMin: [5, 20], peakMin: [30, 60], durationH: [2, 4], afterEffectsH: [6, 24], bioavailability: 0.75,
      doses: { threshold: 30, light: [30, 60], common: [60, 100], strong: [100, 150], heavy: 150, unit: 'mg' } },
    rectal: { onsetMin: [10, 25], peakMin: [40, 80], durationH: [3, 5], afterEffectsH: [6, 24], bioavailability: 0.9,
      doses: { threshold: 30, light: [30, 60], common: [60, 100], strong: [100, 140], heavy: 140, unit: 'mg' } }
  },
  warnings: [
    'MAOIs are the most dangerous interaction — including moclobemide, which has caused multiple deaths in combination with MDMA.',
    'Hyperthermia is the leading cause of MDMA deaths. Heat, exertion and crowded environments compound it.',
    'Hyponatraemia — drinking too much plain water while MDMA raises vasopressin has killed people, particularly women. Roughly 500 ml/hour while active, with electrolytes.',
    'Non-linear kinetics mean a second dose produces disproportionately higher blood levels than the first.',
    'The 3-month (minimum 6-week) spacing convention exists because serotonergic neurotoxicity risk scales with dose frequency.'
  ],
  refs: ['de la Torre et al. 2004, Ther Drug Monit', 'Kolbrich et al. 2008, Ther Drug Monit', 'PubChem CID 1615']
},

{
  id: 'mda', name: 'MDA', aliases: ['sass', 'sally', 'tenamfetamine', '3,4-methylenedioxyamphetamine'],
  class: 'Entactogen', family: 'Substituted amphetamine', schedule: 'I (US)',
  tags: ['entactogen', 'psychedelic', 'stimulant', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'hyperthermia-risk', 'neurotoxicity-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 14, minRedoseDays: 42,
  mechanism: 'Serotonin/dopamine releaser with meaningful 5-HT2A agonism, giving a distinctly more psychedelic and visual character than MDMA, plus more stimulation and a longer duration.',
  halfLife: { hours: 9, range: [7, 12], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylenation', product: 'HHA (3,4-dihydroxyamphetamine)', fraction: 0.55 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'HMA (4-hydroxy-3-methoxyamphetamine)', fraction: 0.5 },
      { enzyme: 'CYP2D6', reaction: 'Deamination', product: 'Inactive acids', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'HHA', active: false, note: 'Catechol; same quinone-formation neurotoxicity concern as MDMA\'s HHMA.' },
      { name: 'HMA', active: false, halfLifeH: 11 }
    ],
    substrateOf: ['CYP2D6', 'COMT'], inhibits: ['CYP2D6', 'MAO-A'],
    excretion: 'Renal, substantial unchanged fraction.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [90, 150], durationH: [4, 8], afterEffectsH: [6, 24], bioavailability: 0.75,
      doses: { threshold: 30, light: [40, 80], common: [80, 130], strong: [130, 180], heavy: 180, unit: 'mg' } }
  },
  warnings: [
    'Longer and more stimulating than MDMA, with correspondingly greater hyperthermia and cardiac strain.',
    'MAOI-contraindicated.'
  ],
  refs: ['Shulgin, PiHKAL #100', 'DrugBank DB01509']
},

{
  id: 'methylone', name: 'Methylone', aliases: ['bk-mdma', 'm1', '3,4-methylenedioxymethcathinone'],
  class: 'Entactogen', family: 'Cathinone', schedule: 'I (US)',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonin-releaser', 'dopamine-releaser',
         'serotonergic', 'mao-contraindicated', 'hyperthermia-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 10, minRedoseDays: 28,
  mechanism: 'β-keto analogue of MDMA. The ketone reduces lipophilicity and CNS penetration, producing a shorter, more stimulating and less warm experience than MDMA at higher doses.',
  halfLife: { hours: 3, range: [2, 4.5], confidence: 'estimated', notes: 'Estimated from limited human data and the reported 3-5 h duration.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylenation', product: 'Dihydroxymethcathinone (HHMC)', fraction: 0.45 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'HMMC', fraction: 0.4 },
      { enzyme: 'CYP2D6 / CYP1A2', reaction: 'N-demethylation', product: 'Ethylone-type nor-metabolite (MDC)', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'HMMC', active: false, note: 'Main urinary marker.' },
      { name: 'MDC (nor-methylone)', active: true, halfLifeH: 3, potencyRel: 0.4 }
    ],
    substrateOf: ['CYP2D6', 'CYP1A2', 'COMT'], inhibits: ['CYP2D6'],
    excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 100], durationH: [3, 5], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 50, light: [70, 120], common: [120, 200], strong: [200, 280], heavy: 280, unit: 'mg' } }
  },
  warnings: ['Serotonergic; MAOI-contraindicated. Frequently mis-sold as MDMA.'],
  refs: ['Elmore et al. 2017, Neuropsychopharmacology', 'Kamata et al. 2006, Xenobiotica']
},

{
  id: 'eutylone', name: 'Eutylone', aliases: ['bk-ebdb', 'n-ethylbutylone'],
  class: 'Entactogen', family: 'Cathinone', schedule: 'I (US)',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonergic', 'mao-contraindicated',
         'compulsive-redosing', 'hyperthermia-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 10,
  mechanism: 'Cathinone entactogen with a more dopaminergic/stimulant bias than MDMA and a weaker entactogenic effect. Since ~2019 it has been the most common MDMA adulterant found in seized "ecstasy" worldwide.',
  halfLife: { hours: 3.5, range: [2, 5], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylenation', product: 'Dihydroxy metabolite', fraction: 0.4 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'Methoxy-hydroxy metabolite', fraction: 0.35 },
      { enzyme: 'CYP2D6', reaction: 'N-deethylation', product: 'Butylone', fraction: 0.1, note: 'Produces an active entactogen in its own right.' }
    ],
    metabolites: [{ name: 'Butylone', active: true, halfLifeH: 3, potencyRel: 0.7 }],
    substrateOf: ['CYP2D6', 'COMT'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 110], durationH: [3, 5], afterEffectsH: [4, 18], bioavailability: 0.7,
      doses: { threshold: 50, light: [75, 125], common: [125, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Very commonly sold as MDMA. Because it is more stimulating and less entactogenic, people redose looking for an effect that never arrives — a documented cause of overdose and severe insomnia.',
    'Reagent testing distinguishes it from MDMA: eutylone gives a weak or absent Marquis reaction where MDMA turns purple-black.'
  ],
  refs: ['DEA Emerging Threat Reports 2020-2023']
},

{
  id: '6-apb', name: '6-APB', aliases: ['benzofury', '6-(2-aminopropyl)benzofuran'],
  class: 'Entactogen', family: 'Benzofuran', schedule: 'Class B (UK) / varies',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'cardiotoxic', 'hyperthermia-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 14, minRedoseDays: 42,
  mechanism: 'Benzofuran analogue of MDA; a releasing agent at all three monoamine transporters with notable 5-HT2B agonism.',
  halfLife: { hours: 8, range: [6, 12], confidence: 'estimated', notes: 'No human PK studies; inferred from the long reported 8-12 h duration.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Presumed benzofuran ring oxidation', product: 'Hydroxylated metabolites', fraction: 0.4, note: 'Not characterised in humans.' },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Corresponding ketone/acid', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false, note: 'Human metabolism has not been published.' }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 25, light: [40, 70], common: [70, 110], strong: [110, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: [
    '5-HT2B agonism carries a theoretical risk of valvular heart disease with repeated use — the mechanism that withdrew fenfluramine from the market.',
    'The very slow onset causes redosing before the first dose peaks, a recurring cause of overdose.',
    'MAOI-contraindicated.'
  ],
  refs: ['Iversen et al. 2013, ACMD report', 'Rickli et al. 2015, Eur Neuropsychopharmacol']
},

{
  id: '5-mapb', name: '5-MAPB', aliases: ['5-(2-methylaminopropyl)benzofuran'],
  class: 'Entactogen', family: 'Benzofuran', schedule: 'Varies',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'cardiotoxic'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 14, minRedoseDays: 42,
  mechanism: 'Benzofuran analogue of MDMA; closer to MDMA subjectively than 6-APB, with a somewhat longer duration.',
  halfLife: { hours: 7, range: [5, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Presumed N-demethylation', product: '5-APB', fraction: 0.15, note: 'By analogy with MDMA→MDA.' },
      { enzyme: 'CYP2D6', reaction: 'Presumed ring hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.35 }
    ],
    metabolites: [{ name: '5-APB', active: true, halfLifeH: 9, potencyRel: 0.8, note: 'Presumed active metabolite.' }],
    substrateOf: ['CYP2D6'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [5, 8], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 30, light: [40, 75], common: [75, 120], strong: [120, 160], heavy: 160, unit: 'mg' } }
  },
  warnings: ['5-HT2B agonism — cardiac valve risk with repeated use. MAOI-contraindicated.'],
  refs: ['Rickli et al. 2015, Eur Neuropsychopharmacol']
},

{
  id: 'mdai', name: 'MDAI', aliases: ['5,6-methylenedioxy-2-aminoindane'],
  class: 'Entactogen', family: 'Aminoindane', schedule: 'Varies',
  tags: ['entactogen', 'research-chemical', 'serotonin-releaser', 'serotonergic', 'mao-contraindicated'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 14,
  mechanism: 'Selective serotonin releaser with minimal dopamine release. Originally developed as a non-neurotoxic MDMA analogue, though later animal work questioned that claim.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CYP2D6', reaction: 'Presumed demethylenation', product: 'Dihydroxyaminoindane', fraction: 0.4 },
               { enzyme: 'COMT', reaction: 'O-methylation', product: 'Methoxy-hydroxy metabolite', fraction: 0.3 }],
    metabolites: [{ name: 'Uncharacterised catechol metabolites', active: false }],
    substrateOf: ['CYP2D6', 'COMT'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [75, 120], durationH: [3, 5], afterEffectsH: [4, 12], bioavailability: 0.7,
      doses: { threshold: 50, light: [70, 130], common: [130, 200], strong: [200, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: ['Marketed as "safe MDMA" — this is not supported by evidence. Serotonergic and MAOI-contraindicated.'],
  refs: ['Nichols et al. 1990, J Med Chem']
}

]);
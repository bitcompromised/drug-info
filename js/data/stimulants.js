/* Stimulants — classical, prescription and research chemical */
DB.register([

{
  id: 'caffeine', name: 'Caffeine', aliases: ['coffee', '1,3,7-trimethylxanthine'],
  class: 'Stimulant', family: 'Xanthine', schedule: 'Unscheduled',
  tags: ['stimulant', 'adenosine-antagonist', 'vasoconstrictor', 'anxiogenic'],
  toleranceGroup: 'caffeine', toleranceHalfLifeDays: 3,
  mechanism: 'Non-selective adenosine A1/A2A receptor antagonist; indirectly raises dopaminergic and noradrenergic tone. At high doses also inhibits phosphodiesterase and mobilises intracellular calcium.',
  halfLife: { hours: 5, range: [3, 7], confidence: 'measured',
    notes: 'Extremely variable. Smoking induces CYP1A2 and roughly halves it (~3 h). Oral contraceptives double it. In pregnancy it reaches 15 h. Neonates: >70 h.' },
  metabolism: {
    firstPass: 'Negligible — oral bioavailability is essentially 100%.',
    pathways: [
      { enzyme: 'CYP1A2', reaction: 'N3-demethylation', product: 'Paraxanthine', fraction: 0.84, note: 'Dominant route. CYP1A2 activity varies ~40-fold between people, which is why caffeine tolerance and jitteriness differ so much.' },
      { enzyme: 'CYP1A2', reaction: 'N1-demethylation', product: 'Theobromine', fraction: 0.12 },
      { enzyme: 'CYP1A2', reaction: 'N7-demethylation', product: 'Theophylline', fraction: 0.04 },
      { enzyme: 'NAT2', reaction: 'Acetylation (downstream)', product: 'AFMU', fraction: null },
      { enzyme: 'CYP2A6', reaction: '8-hydroxylation (minor)', product: '1,7-dimethyluric acid', fraction: 0.02 }
    ],
    metabolites: [
      { name: 'Paraxanthine', active: true, halfLifeH: 3.5, potencyRel: 1.0, note: 'Adenosine antagonist in its own right and a stronger lipolytic than caffeine. Most of the back half of a coffee\'s effect is actually paraxanthine.' },
      { name: 'Theobromine', active: true, halfLifeH: 7.2, potencyRel: 0.2, note: 'Vasodilator, mild diuretic. Accumulates with heavy intake and contributes to the long tail.' },
      { name: 'Theophylline', active: true, halfLifeH: 8, potencyRel: 0.5, note: 'Bronchodilator; narrow therapeutic index but the amount formed from caffeine is small.' }
    ],
    substrateOf: ['CYP1A2', 'CYP2A6', 'NAT2', 'XO'],
    inhibits: [], induces: [],
    excretion: 'Renal, <3% unchanged. Essentially all cleared hepatically.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 45], peakMin: [30, 75], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.99,
      doses: { threshold: 20, light: [20, 70], common: [70, 150], strong: [150, 300], heavy: 350, unit: 'mg',
        note: 'A standard mug of drip coffee is ~95 mg; espresso shot ~65 mg; energy drink 80-160 mg.' } }
  },
  warnings: [
    'Estimated oral LD50 in humans is ~150-200 mg/kg (~10-14 g for a 70 kg adult). Anhydrous powder has killed people through measuring error — deaths have occurred from a rounded teaspoon.',
    'Potentiates the cardiovascular strain of any other stimulant.'
  ],
  refs: ['PubChem CID 2519', 'Fredholm et al. 1999, Pharmacol Rev']
},

{
  id: 'nicotine', name: 'Nicotine',
  class: 'Stimulant', family: 'Pyridine alkaloid', schedule: 'Unscheduled (age-restricted)',
  tags: ['stimulant', 'nicotinic-agonist', 'highly-addictive', 'vasoconstrictor'],
  toleranceGroup: 'nicotine', toleranceHalfLifeDays: 2,
  mechanism: 'Agonist at nicotinic acetylcholine receptors, principally α4β2 in the VTA, driving dopamine release in the nucleus accumbens. Rapid receptor desensitisation underlies the very short cycle of craving and relief.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'measured',
    notes: 'Terminal half-life ~2 h, but the distribution phase means the subjective effect fades in 20-40 min. CYP2A6 poor metabolisers (common in East Asian populations) clear it far more slowly and smoke less as a result.' },
  metabolism: {
    firstPass: 'Heavy — oral bioavailability only ~20-45%, which is why nicotine is smoked, vaped or taken buccally rather than swallowed.',
    pathways: [
      { enzyme: 'CYP2A6', reaction: 'C-oxidation to nicotine-Δ1\'(5\')-iminium ion, then aldehyde oxidase', product: 'Cotinine', fraction: 0.75, note: 'The rate-limiting step. CYP2A6 genotype largely determines smoking intensity.' },
      { enzyme: 'CYP2A6', reaction: '3\'-hydroxylation of cotinine', product: 'trans-3\'-hydroxycotinine', from: 'Cotinine', fraction: 0.33, note: 'The 3HC/cotinine ratio is the standard clinical biomarker of CYP2A6 activity.' },
      { enzyme: 'UGT2B10', reaction: 'N-glucuronidation', product: 'Nicotine-N-glucuronide', fraction: 0.05 },
      { enzyme: 'FMO3', reaction: 'N-oxidation', product: 'Nicotine-1\'-N-oxide', fraction: 0.04 }
    ],
    metabolites: [
      { name: 'Cotinine', active: false, halfLifeH: 16, potencyRel: 0.05, note: 'Only weakly active but accumulates to ~10x nicotine levels in regular smokers. Standard exposure biomarker; detectable for 3-4 days.' },
      { name: 'trans-3\'-Hydroxycotinine', active: false, halfLifeH: 6.6, note: 'Main urinary metabolite.' },
      { name: 'Nornicotine', active: true, halfLifeH: 9, potencyRel: 0.3, note: 'Minor, weakly active.' }
    ],
    substrateOf: ['CYP2A6', 'UGT2B10', 'FMO3', 'AOX1'],
    inhibits: [], induces: ['CYP1A2'],
    excretion: 'Renal; ~10-20% unchanged, pH-dependent.',
    confidence: 'measured'
  },
  routes: {
    smoked: { onsetMin: [0.1, 0.5], peakMin: [3, 8], durationH: [0.3, 1], afterEffectsH: [0.5, 2], bioavailability: 0.5,
      doses: { threshold: 0.3, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg',
        note: 'One cigarette delivers roughly 1-1.5 mg absorbed.' } },
    vaporised: { onsetMin: [0.2, 1], peakMin: [4, 10], durationH: [0.3, 1.5], afterEffectsH: [0.5, 2], bioavailability: 0.5,
      doses: { threshold: 0.3, light: [0.5, 1.5], common: [1.5, 3], strong: [3, 6], heavy: 6, unit: 'mg' } },
    buccal: { onsetMin: [3, 10], peakMin: [20, 40], durationH: [1, 2], afterEffectsH: [0.5, 2], bioavailability: 0.6,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 4], strong: [4, 8], heavy: 8, unit: 'mg' } },
    transdermal: { onsetMin: [60, 180], peakMin: [180, 480], durationH: [16, 24], afterEffectsH: [2, 6], bioavailability: 0.9,
      doses: { threshold: 5, light: [7, 14], common: [14, 21], strong: [21, 42], heavy: 42, unit: 'mg' } }
  },
  warnings: [
    'Among the most addictive substances known; dependence typically forms within weeks.',
    'Acutely toxic — oral LD50 is far lower than folklore suggests but concentrated e-liquid has caused fatal poisonings, especially in children.'
  ],
  refs: ['Benowitz et al. 2009, Handb Exp Pharmacol', 'PubChem CID 89594']
},

{
  id: 'amphetamine', name: 'Amphetamine', aliases: ['adderall', 'speed', 'racemic amphetamine'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'II (US)',
  tags: ['stimulant', 'dopamine-releaser', 'norepinephrine-releaser', 'mao-contraindicated',
         'hypertensive-risk', 'hyperthermia-risk', 'serotonergic-weak', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 5,
  mechanism: 'TAAR1 agonist and VMAT2 substrate. Enters the presynaptic terminal via DAT/NET, empties vesicular stores into the cytosol and reverses the transporters, producing non-exocytotic efflux of dopamine and noradrenaline. Also a weak MAO-A inhibitor.',
  halfLife: { hours: 11, range: [7, 34], confidence: 'measured',
    notes: 'Strongly urinary-pH dependent — this is the single largest source of variation. Acidic urine (vitamin C, cranberry juice): ~7 h. Alkaline urine (sodium bicarbonate): up to 34 h. d-isomer ~10 h, l-isomer ~13 h.' },
  metabolism: {
    firstPass: 'Modest; oral bioavailability ~75-90%.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxyamphetamine', fraction: 0.05, note: 'Minor by mass but the reason CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion, quinidine, ritonavir) raise amphetamine exposure.' },
      { enzyme: 'CYP2D6', reaction: 'Oxidative deamination', product: 'Phenylacetone', fraction: 0.2 },
      { enzyme: 'FMO3', reaction: 'N-oxidation / deamination', product: 'Phenylacetone', fraction: 0.05 },
      { enzyme: 'DBH', reaction: 'β-hydroxylation', product: 'Norephedrine', fraction: 0.03, note: 'Dopamine β-hydroxylase; product is weakly active.' },
      { enzyme: 'ADH/ALDH', reaction: 'Oxidation of phenylacetone', product: 'Benzoic acid → hippuric acid', fraction: 0.23 }
    ],
    metabolites: [
      { name: '4-Hydroxyamphetamine', active: true, halfLifeH: 10, potencyRel: 0.3, note: 'Peripherally active; a DBH substrate converted onward to 4-hydroxynorephedrine, a false neurotransmitter.' },
      { name: 'Norephedrine', active: true, halfLifeH: 4, potencyRel: 0.2, note: 'Weak stimulant / sympathomimetic.' },
      { name: 'Hippuric acid', active: false, note: 'Terminal inactive metabolite.' }
    ],
    substrateOf: ['CYP2D6', 'FMO3', 'DBH'],
    inhibits: ['MAO-A'], induces: [],
    excretion: 'Renal, 30-40% unchanged and highly pH-sensitive — alkaline urine causes reabsorption and prolongs the drug substantially.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [120, 180], durationH: [6, 10], afterEffectsH: [3, 8], bioavailability: 0.8,
      doses: { threshold: 5, light: [5, 15], common: [15, 30], strong: [30, 50], heavy: 50, unit: 'mg' } },
    insufflated: { onsetMin: [5, 15], peakMin: [30, 60], durationH: [4, 7], afterEffectsH: [3, 8], bioavailability: 0.75,
      doses: { threshold: 4, light: [4, 12], common: [12, 25], strong: [25, 40], heavy: 40, unit: 'mg' } },
    rectal: { onsetMin: [10, 25], peakMin: [45, 90], durationH: [5, 9], afterEffectsH: [3, 8], bioavailability: 0.95,
      doses: { threshold: 4, light: [4, 12], common: [12, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Never combine with an MAOI (phenelzine, tranylcypromine, selegiline, moclobemide) — hypertensive crisis, potentially fatal.',
    'Raises heart rate, blood pressure and body temperature; risk compounds sharply with other stimulants, dehydration and heat.'
  ],
  refs: ['DrugBank DB00182', 'Dolder et al. 2017, Clin Pharmacokinet']
},

{
  id: 'dextroamphetamine', name: 'Dextroamphetamine', aliases: ['dexedrine', 'd-amphetamine'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'II (US)',
  tags: ['stimulant', 'dopamine-releaser', 'norepinephrine-releaser', 'mao-contraindicated', 'hypertensive-risk', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 5,
  mechanism: 'The more dopaminergic enantiomer of amphetamine; roughly 3-4x the CNS potency of the l-isomer, with proportionally less peripheral noradrenergic effect.',
  halfLife: { hours: 10, range: [6, 15], confidence: 'measured', notes: 'Same urinary-pH dependence as racemic amphetamine.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxy-d-amphetamine', fraction: 0.05 },
      { enzyme: 'CYP2D6', reaction: 'Oxidative deamination', product: 'Phenylacetone', fraction: 0.2 },
      { enzyme: 'FMO3', reaction: 'Deamination', product: 'Phenylacetone', fraction: 0.05 }
    ],
    metabolites: [
      { name: '4-Hydroxy-d-amphetamine', active: true, halfLifeH: 10, potencyRel: 0.3 },
      { name: 'Norephedrine', active: true, halfLifeH: 4, potencyRel: 0.2,
        note: 'Weak sympathomimetic, from the same dopamine-beta-hydroxylase step that makes it from racemic amphetamine.' },
      { name: 'Benzoic acid / hippuric acid', active: false }
    ],
    substrateOf: ['CYP2D6', 'FMO3'], inhibits: ['MAO-A'],
    excretion: 'Renal, 30-40% unchanged, pH-dependent.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [120, 180], durationH: [6, 10], afterEffectsH: [3, 8], bioavailability: 0.8,
      doses: { threshold: 4, light: [4, 10], common: [10, 20], strong: [20, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: ['Contraindicated with MAOIs.'],
  refs: ['DrugBank DB00182']
},

{
  id: 'lisdexamfetamine', name: 'Lisdexamfetamine', aliases: ['vyvanse', 'elvanse', 'ldx'],
  class: 'Stimulant', family: 'Amphetamine prodrug', schedule: 'II (US)',
  tags: ['stimulant', 'prodrug', 'dopamine-releaser', 'mao-contraindicated', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 5,
  mechanism: 'L-lysine conjugated to dextroamphetamine. Inactive as given; requires enzymatic cleavage in red blood cells, which rate-limits the rise in plasma amphetamine and blunts the reinforcing rush.',
  halfLife: { hours: 11, range: [10, 13], confidence: 'measured',
    notes: 'Lisdexamfetamine itself has a half-life under 1 h; the 11 h figure is the liberated dextroamphetamine, which is what actually matters for the curve.' },
  metabolism: {
    firstPass: 'Not hepatic — conversion happens in erythrocytes, so it is largely unaffected by liver enzyme interactions.',
    pathways: [
      { enzyme: 'Red blood cell hydrolase', reaction: 'Enzymatic hydrolysis of the lysine amide bond', product: 'Dextroamphetamine + L-lysine', fraction: 1.0, note: 'Rate-limited and saturable, which is why insufflating or injecting it gains almost nothing.' },
      { enzyme: 'CYP2D6', reaction: 'Downstream metabolism of liberated d-amphetamine',
        product: '4-Hydroxyamphetamine', from: 'Dextroamphetamine', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Dextroamphetamine', active: true, halfLifeH: 10, potencyRel: 1.0, note: 'The actual active drug. 30 mg lisdexamfetamine ≈ 8.9 mg dextroamphetamine base.' },
      { name: 'L-lysine', active: false, note: 'A normal dietary amino acid.' }
    ],
    substrateOf: ['CES1', 'CYP2D6'], inhibits: [],
    excretion: 'Renal, ~2% as intact lisdexamfetamine, ~42% as amphetamine-derived species.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 120], peakMin: [180, 270], durationH: [10, 14], afterEffectsH: [2, 6], bioavailability: 0.96,
      doses: { threshold: 10, light: [10, 30], common: [30, 50], strong: [50, 70], heavy: 70, unit: 'mg' } }
  },
  warnings: ['Contraindicated with MAOIs.'],
  refs: ['DrugBank DB01255', 'Ermer et al. 2016, Clin Drug Investig']
},

{
  id: 'methylphenidate', name: 'Methylphenidate', aliases: ['ritalin', 'concerta', 'mph'],
  class: 'Stimulant', family: 'Phenidate', schedule: 'II (US)',
  tags: ['stimulant', 'dopamine-reuptake-inhibitor', 'norepinephrine-reuptake-inhibitor', 'mao-contraindicated', 'addictive'],
  toleranceGroup: 'methylphenidate', toleranceHalfLifeDays: 4,
  mechanism: 'Blocks DAT and NET without being a releasing agent — it raises synaptic dopamine only where firing already occurs, giving a subjectively flatter profile than amphetamine.',
  halfLife: { hours: 2.5, range: [2, 4], confidence: 'measured',
    notes: 'The d-isomer carries essentially all activity and has a ~2.5 h half-life; extended-release formulations extend the delivery, not the half-life.' },
  metabolism: {
    firstPass: 'Extensive and stereoselective — l-methylphenidate is almost entirely destroyed first-pass, so oral bioavailability of the racemate is only ~30%.',
    pathways: [
      { enzyme: 'CES1', reaction: 'De-esterification (carboxylesterase 1)', product: 'Ritalinic acid', fraction: 0.8, note: 'Dominant route, ~80%. CYP involvement is minimal, so most classic CYP interactions do not apply.' },
      { enzyme: 'CES1', reaction: 'Transesterification with ethanol', product: 'Ethylphenidate', fraction: 0.02, note: 'Only when alcohol is co-ingested — forms a distinct, more euphoric active drug and raises d-MPH exposure ~40%.' },
      { enzyme: 'CYP2D6', reaction: 'Minor aromatic hydroxylation', product: 'p-Hydroxymethylphenidate', fraction: 0.01 }
    ],
    metabolites: [
      { name: 'Ritalinic acid', active: false, halfLifeH: 3, note: 'Inactive; the main urinary species.' },
      { name: 'Ethylphenidate', active: true, halfLifeH: 2, potencyRel: 0.8, note: 'Formed only with alcohol. More selective for DAT than MPH and reported as more euphoric — a real pharmacological reason the combination gets misused.' }
    ],
    substrateOf: ['CES1'], inhibits: [],
    excretion: 'Renal, ~80% as ritalinic acid, <1% unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [90, 150], durationH: [3, 5], afterEffectsH: [2, 6], bioavailability: 0.3,
      doses: { threshold: 5, light: [5, 15], common: [15, 30], strong: [30, 50], heavy: 50, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [20, 40], durationH: [2, 4], afterEffectsH: [2, 5], bioavailability: 0.6,
      doses: { threshold: 3, light: [3, 10], common: [10, 20], strong: [20, 35], heavy: 35, unit: 'mg' } }
  },
  warnings: [
    'Combining with alcohol produces ethylphenidate and raises stimulant exposure — a genuine metabolic interaction, not folklore.',
    'Contraindicated with MAOIs.'
  ],
  refs: ['DrugBank DB00422', 'Markowitz & Patrick 2008, J Clin Psychopharmacol']
},

{
  id: 'methamphetamine', name: 'Methamphetamine', aliases: ['meth', 'desoxyn', 'crystal'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'II (US)',
  tags: ['stimulant', 'dopamine-releaser', 'norepinephrine-releaser', 'neurotoxicity-risk',
         'mao-contraindicated', 'hyperthermia-risk', 'hypertensive-risk', 'highly-addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 6,
  mechanism: 'As amphetamine, but the N-methyl group raises lipophilicity and CNS penetration sharply, producing greater dopamine release per unit dose and markedly higher abuse liability.',
  halfLife: { hours: 10, range: [9, 15], confidence: 'measured',
    notes: 'Long half-life relative to the 4-8 h subjective duration — this gap is why sleep is impossible long after the effects fade, and why redosing stacks so easily.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Amphetamine', fraction: 0.15, note: 'Produces a fully active drug with an even longer half-life — the main reason the comedown drags on.' },
      { enzyme: 'CYP2D6', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxymethamphetamine', fraction: 0.15 },
      { enzyme: 'CYP2D6', reaction: 'β-hydroxylation', product: 'Norephedrine', fraction: 0.03 },
      /* 4-Hydroxyamphetamine is not made from methamphetamine directly — it is
         what CYP2D6 does to the AMPHETAMINE that N-demethylation already
         produced. Declaring `from` puts it one step further down the chain,
         where it belongs, instead of hanging it off the parent as a sibling of
         its own precursor. The model reads this and nests the cards to match. */
      { enzyme: 'CYP2D6', reaction: 'Aromatic 4-hydroxylation of the amphetamine metabolite',
        product: '4-Hydroxyamphetamine', from: 'Amphetamine', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Amphetamine', active: true, halfLifeH: 11, potencyRel: 0.6, note: 'Active metabolite; typically 10-20% of the dose. Extends the total stimulant window well past the parent drug.' },
      { name: '4-Hydroxymethamphetamine', active: true, halfLifeH: 9, potencyRel: 0.2 },
      { name: 'Norephedrine', active: true, halfLifeH: 4, potencyRel: 0.2 },
      { name: '4-Hydroxyamphetamine', active: true, halfLifeH: 10, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP2D6'], inhibits: ['CYP2D6', 'MAO-A'],
    excretion: 'Renal, 30-54% unchanged; strongly pH-dependent.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [120, 180], durationH: [6, 12], afterEffectsH: [3, 12], bioavailability: 0.67,
      doses: { threshold: 5, light: [5, 10], common: [10, 30], strong: [30, 50], heavy: 50, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [15, 40], durationH: [4, 8], afterEffectsH: [3, 12], bioavailability: 0.79,
      doses: { threshold: 3, light: [5, 10], common: [10, 25], strong: [25, 40], heavy: 40, unit: 'mg' } },
    smoked: { onsetMin: [0.1, 1], peakMin: [3, 10], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.9,
      doses: { threshold: 2, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } },
    iv: { onsetMin: [0.1, 0.5], peakMin: [1, 5], durationH: [4, 8], afterEffectsH: [3, 12], bioavailability: 1.0,
      doses: { threshold: 2, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Documented dopaminergic and serotonergic neurotoxicity in humans at heavy repeated doses; hyperthermia sharply worsens it.',
    'Contraindicated with MAOIs.',
    'Inhibits its own metabolism via CYP2D6 — repeated doses clear more slowly than the first, so redosing stacks non-linearly.'
  ],
  refs: ['Cruickshank & Dyer 2009, Addiction', 'DrugBank DB01577']
},

{
  id: 'cocaine', name: 'Cocaine', aliases: ['coke', 'benzoylmethylecgonine', 'crack'],
  class: 'Stimulant', family: 'Tropane alkaloid', schedule: 'II (US)',
  tags: ['stimulant', 'dopamine-reuptake-inhibitor', 'serotonergic-weak', 'local-anaesthetic',
         'vasoconstrictor', 'cardiotoxic', 'sodium-channel-blocker', 'highly-addictive', 'hypertensive-risk'],
  toleranceGroup: 'cocaine', toleranceHalfLifeDays: 1,
  mechanism: 'Blocks DAT, NET and SERT reuptake, and blocks voltage-gated sodium channels (hence the numbing). The sodium-channel action is what makes overdose cardiotoxic rather than merely hypertensive.',
  halfLife: { hours: 1.0, range: [0.7, 1.5], confidence: 'measured',
    notes: 'Very short — the subjective peak lasts 20-30 min intranasally. Metabolites persist far longer and are what drug tests detect.' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability ~30%. Destroyed by gut and plasma esterases.',
    pathways: [
      { enzyme: 'CES1 (hCE1)', reaction: 'Hydrolysis of the benzoyl ester', product: 'Benzoylecgonine', fraction: 0.45, note: 'Main route. The product is inactive but long-lived.' },
      { enzyme: 'BChE / CES2', reaction: 'Hydrolysis of the methyl ester', product: 'Ecgonine methyl ester', fraction: 0.4, note: 'Butyrylcholinesterase. People with genetically low BChE clear cocaine slowly and are at much higher toxicity risk.' },
      { enzyme: 'CES1 (hCE1)', reaction: 'Transesterification with ethanol', product: 'Cocaethylene', fraction: 0.17, note: 'ONLY when alcohol is present. This is a major, well-documented and dangerous interaction.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Norcocaine', fraction: 0.05, note: 'Minor by mass but hepatotoxic — it is oxidised to a reactive nitroxide radical.' }
    ],
    metabolites: [
      { name: 'Benzoylecgonine', active: false, halfLifeH: 6, note: 'Inactive. Half-life ~6 h and detectable in urine for 2-4 days (up to ~2 weeks with heavy use) — this is the standard assay target.' },
      { name: 'Ecgonine methyl ester', active: false, halfLifeH: 3.6, note: 'Inactive; possibly mildly vasodilatory.' },
      { name: 'Cocaethylene', active: true, halfLifeH: 2.5, potencyRel: 1.0, note: 'Formed only with alcohol. Equipotent at DAT, roughly 3-5x the half-life of cocaine, and substantially more cardiotoxic. Associated with a large increase in sudden-death risk over either drug alone.' },
      { name: 'Norcocaine', active: true, halfLifeH: 1.5, potencyRel: 0.8, note: 'Active and hepatotoxic.' }
    ],
    substrateOf: ['CES1', 'BChE', 'CYP3A4'], inhibits: [],
    excretion: 'Renal; <5% unchanged, ~40% as benzoylecgonine.',
    confidence: 'measured'
  },
  routes: {
    insufflated: { onsetMin: [1, 5], peakMin: [15, 30], durationH: [0.5, 1.5], afterEffectsH: [1, 4], bioavailability: 0.8,
      doses: { threshold: 10, light: [10, 30], common: [30, 60], strong: [60, 90], heavy: 90, unit: 'mg' } },
    oral: { onsetMin: [10, 30], peakMin: [45, 90], durationH: [1, 2], afterEffectsH: [1, 4], bioavailability: 0.3,
      doses: { threshold: 20, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg' } },
    smoked: { onsetMin: [0.1, 0.5], peakMin: [1, 5], durationH: [0.15, 0.5], afterEffectsH: [1, 4], bioavailability: 0.7,
      doses: { threshold: 10, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    iv: { onsetMin: [0.1, 0.5], peakMin: [1, 4], durationH: [0.2, 0.7], afterEffectsH: [1, 4], bioavailability: 1.0,
      doses: { threshold: 5, light: [10, 20], common: [20, 30], strong: [30, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'With alcohol it forms cocaethylene — longer-lasting, more cardiotoxic, and linked to a sharply raised risk of sudden cardiac death. This is the single most important cocaine interaction.',
    'Coronary vasospasm can cause myocardial infarction in young people with clean arteries. Chest pain after cocaine is an emergency.',
    'Beta-blockers such as propranolol are traditionally avoided in acute cocaine toxicity (unopposed alpha stimulation).'
  ],
  refs: ['Jeffcoat et al. 1989, Drug Metab Dispos', 'Farre et al. 1993, J Pharmacol Exp Ther']
},

{
  id: 'modafinil', name: 'Modafinil', aliases: ['provigil', 'modalert'],
  class: 'Stimulant', family: 'Eugeroic', schedule: 'IV (US)',
  tags: ['stimulant', 'eugeroic', 'dopamine-reuptake-inhibitor', 'cyp3a4-inducer'],
  toleranceGroup: 'modafinil', toleranceHalfLifeDays: 7,
  mechanism: 'Weak, atypical DAT inhibitor with additional orexinergic and histaminergic activation. Promotes wakefulness with much less peripheral sympathomimetic effect than amphetamines.',
  halfLife: { hours: 13, range: [10, 15], confidence: 'measured',
    notes: 'The R-enantiomer (armodafinil) has a ~15 h half-life; the S-enantiomer only ~4 h, so racemic modafinil shows a biphasic decline.' },
  metabolism: {
    pathways: [
      { enzyme: 'Amidase (non-CYP)', reaction: 'Amide hydrolysis', product: 'Modafinil acid', fraction: 0.5, note: 'Main route; product is inactive.' },
      { enzyme: 'CYP3A4', reaction: 'S-oxidation', product: 'Modafinil sulfone', fraction: 0.4 },
      { enzyme: 'CYP2C19', reaction: 'Minor oxidation', product: 'Hydroxylated species', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Modafinil acid', active: false, halfLifeH: 15 },
      { name: 'Modafinil sulfone', active: false, halfLifeH: 40, note: 'Long-lived but inactive; accumulates with daily dosing.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'],
    inhibits: ['CYP2C19'],
    induces: ['CYP3A4', 'CYP1A2', 'CYP2B6'],
    excretion: 'Renal, <10% unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 240], durationH: [10, 16], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 400], heavy: 400, unit: 'mg' } }
  },
  warnings: [
    'Induces CYP3A4 and reduces the effectiveness of hormonal contraceptives — a genuine and frequently missed interaction.',
    'Rare but serious risk of Stevens-Johnson syndrome; any rash warrants stopping and medical review.'
  ],
  refs: ['DrugBank DB00745', 'Robertson & Hellriegel 2003, Clin Pharmacokinet']
},

{
  id: 'armodafinil', name: 'Armodafinil', aliases: ['nuvigil', 'waklert'],
  class: 'Stimulant', family: 'Eugeroic', schedule: 'IV (US)',
  tags: ['stimulant', 'eugeroic', 'dopamine-reuptake-inhibitor', 'cyp3a4-inducer'],
  toleranceGroup: 'modafinil', toleranceHalfLifeDays: 7,
  mechanism: 'The R-enantiomer of modafinil; same mechanism with a flatter, longer plasma profile.',
  halfLife: { hours: 15, range: [13, 19], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Amidase (non-CYP)', reaction: 'Amide hydrolysis', product: 'Modafinil acid', fraction: 0.5 },
      { enzyme: 'CYP3A4', reaction: 'S-oxidation', product: 'R-modafinil sulfone', fraction: 0.4 }
    ],
    metabolites: [{ name: 'R-modafinil acid', active: false }, { name: 'R-modafinil sulfone', active: false, halfLifeH: 40 }],
    substrateOf: ['CYP3A4', 'CYP2C19'], inhibits: ['CYP2C19'], induces: ['CYP3A4'],
    excretion: 'Renal, <10% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 240], durationH: [12, 18], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 25, light: [25, 75], common: [75, 150], strong: [150, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: ['Reduces hormonal contraceptive efficacy via CYP3A4 induction.'],
  refs: ['DrugBank DB06413']
},

{
  id: 'mdpv', name: 'MDPV', aliases: ['3,4-methylenedioxypyrovalerone', 'bath salts'],
  class: 'Stimulant', family: 'Cathinone (pyrovalerone)', schedule: 'I (US)',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'hyperthermia-risk', 'hypertensive-risk', 'highly-addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Extremely potent pure DAT/NET reuptake inhibitor — roughly 50x the DAT potency of cocaine with no releasing action and negligible serotonergic effect. That imbalance is why it produces such severe compulsive redosing.',
  halfLife: { hours: 3.5, range: [2, 5], confidence: 'estimated',
    notes: 'No formal human PK studies. Estimated from case reports and analogue data (pyrovalerone). Treat as a rough figure.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Demethylenation of the methylenedioxy ring', product: '3,4-Dihydroxypyrovalerone (catechol)', fraction: 0.5, note: 'Inferred from in-vitro human microsome work; CYP2C19 and CYP1A2 contribute.' },
      { enzyme: 'COMT', reaction: 'O-methylation of the catechol', product: '4-OH-3-MeO-pyrovalerone', fraction: 0.4 },
      { enzyme: 'CYP2C19', reaction: 'Secondary oxidation', product: 'Hydroxylated species', fraction: 0.1 }
    ],
    metabolites: [
      { name: '3,4-Dihydroxypyrovalerone', active: false, note: 'Believed largely inactive.' },
      { name: '4-OH-3-MeO-pyrovalerone', active: false, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19', 'CYP1A2', 'COMT'], inhibits: [],
    excretion: 'Renal, as conjugated metabolites.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 3, light: [3, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [20, 45], durationH: [2, 4], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 2, light: [2, 5], common: [5, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'Active in single-milligram amounts — volumetric dosing is essential; eyeballing has caused many hospitalisations.',
    'Notorious for compulsive redosing, multi-day binges, severe insomnia, psychosis and hyperthermia.',
    'Human pharmacokinetic data is essentially absent; every number here is an estimate.'
  ],
  refs: ['Baumann et al. 2013, Neuropsychopharmacology', 'Anizan et al. 2014, Anal Bioanal Chem']
},

{
  id: 'a-pvp', name: 'α-PVP', aliases: ['alpha-pvp', 'flakka', 'alpha-pyrrolidinopentiophenone'],
  class: 'Stimulant', family: 'Cathinone (pyrovalerone)', schedule: 'I (US)',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'hyperthermia-risk', 'highly-addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Potent DAT/NET reuptake inhibitor, structurally MDPV minus the methylenedioxy bridge. Same pharmacological profile and same compulsive-use liability.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue',
    notes: 'No human PK studies. Estimated from MDPV and pyrovalerone.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Hydroxylation of the pyrrolidine ring', product: '2\'\'-oxo-α-PVP', fraction: 0.4, note: 'From in-vitro microsomal studies.' },
      { enzyme: 'CYP2C19', reaction: 'Ketone reduction', product: 'OH-α-PVP', fraction: 0.3 },
      { enzyme: 'CYP3A4', reaction: 'Aromatic hydroxylation / lactam formation', product: 'Hydroxylated metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: '2\'\'-oxo-α-PVP', active: false }, { name: 'OH-α-PVP', active: false }],
    substrateOf: ['CYP2D6', 'CYP2C19', 'CYP3A4'], inhibits: [],
    excretion: 'Renal, as glucuronide conjugates.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2.5, 5], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 3, light: [5, 10], common: [10, 20], strong: [20, 35], heavy: 35, unit: 'mg' } },
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [1.5, 3], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 2, light: [3, 7], common: [7, 15], strong: [15, 25], heavy: 25, unit: 'mg' } },
    vaporised: { onsetMin: [0.2, 2], peakMin: [3, 10], durationH: [0.5, 1.5], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'Strongly associated with excited delirium, hyperthermia and psychosis in emergency presentations.',
    'All pharmacokinetic values are extrapolated from analogues; confidence is low.'
  ],
  refs: ['Sauer et al. 2009, J Mass Spectrom', 'Kolanos et al. 2015, ACS Chem Neurosci']
},

{
  id: 'mephedrone', name: 'Mephedrone', aliases: ['4-mmc', 'meow meow', '4-methylmethcathinone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'I (US) / Class B (UK)',
  tags: ['stimulant', 'entactogen', 'research-chemical', 'serotonin-releaser', 'dopamine-releaser',
         'mao-contraindicated', 'hyperthermia-risk', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'Non-selective monoamine releaser at DAT, NET and SERT — pharmacologically between methamphetamine and MDMA, which is why it feels like both and carries risks from both.',
  halfLife: { hours: 2, range: [1.5, 3], confidence: 'estimated',
    notes: 'Short half-life relative to the craving it produces; the mismatch is the main driver of binge redosing.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Normephedrone', fraction: 0.35, note: 'Primary route; identified in human urine studies.' },
      { enzyme: 'CYP2D6', reaction: 'Reduction of the ketone', product: 'Dihydromephedrone', fraction: 0.2 },
      { enzyme: 'CYP2D6', reaction: 'Oxidation of the tolyl methyl group', product: '4-Carboxymephedrone', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Normephedrone', active: true, halfLifeH: 3, potencyRel: 0.5, note: 'Active; contributes to the tail.' },
      { name: 'Dihydromephedrone', active: false },
      { name: '4-Carboxymephedrone', active: false, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP2D6'], inhibits: [],
    excretion: 'Renal, largely as conjugated metabolites.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 15, light: [30, 75], common: [75, 150], strong: [150, 250], heavy: 250, unit: 'mg' } },
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [1, 2], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 5, light: [15, 40], common: [40, 80], strong: [80, 125], heavy: 125, unit: 'mg' } }
  },
  warnings: [
    'Serotonergic — do not combine with MAOIs or other serotonin releasers.',
    'Very short duration plus strong craving makes compulsive redosing the norm rather than the exception.'
  ],
  refs: ['Papaseit et al. 2016, Eur Neuropsychopharmacol', 'Pedersen et al. 2013, Drug Test Anal']
},

{
  id: '3-mmc', name: '3-MMC', aliases: ['3-methylmethcathinone', 'metaphedrone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'Varies (banned in most of EU)',
  tags: ['stimulant', 'entactogen', 'research-chemical', 'serotonin-releaser', 'dopamine-releaser',
         'mao-contraindicated', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'Positional isomer of mephedrone; monoamine releaser with a somewhat more stimulant and less entactogenic balance than the 4-methyl isomer.',
  halfLife: { hours: 2, range: [1.5, 3], confidence: 'analogue', notes: 'Assumed equivalent to mephedrone; no human PK data.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Nor-3-MMC', fraction: 0.35 },
      { enzyme: 'CYP2D6', reaction: 'Ketone reduction', product: 'Dihydro-3-MMC', fraction: 0.2 },
      { enzyme: 'CYP2D6', reaction: 'Tolyl oxidation', product: '3-Carboxy-MMC', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Nor-3-MMC', active: true, halfLifeH: 3, potencyRel: 0.5 }, { name: '3-Carboxy-MMC', active: false }],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 20, light: [40, 80], common: [80, 150], strong: [150, 250], heavy: 250, unit: 'mg' } },
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [1, 2], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 10, light: [20, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: ['Serotonergic; MAOI-contraindicated. Compulsive redosing is very common.'],
  refs: ['EMCDDA 3-MMC technical report 2021']
},

{
  id: '2-fma', name: '2-FMA', aliases: ['2-fluoromethamphetamine'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'Varies / unscheduled in many jurisdictions',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'norepinephrine-releaser', 'mao-contraindicated', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 5,
  mechanism: 'Fluorinated methamphetamine analogue acting as a dopamine and noradrenaline releaser. Widely reported as more functional and less euphoric than methamphetamine, with a cleaner subjective profile.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'estimated',
    notes: 'No published human PK. Estimated by back-calculating from consistently reported 5-8 h durations.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation (presumed)', product: '2-Fluoroamphetamine', fraction: 0.2, note: 'By analogy with methamphetamine; not directly confirmed in humans.' },
      { enzyme: 'CYP2D6', reaction: 'Aromatic hydroxylation (presumed)', product: 'Hydroxylated metabolites', fraction: 0.2 }
    ],
    metabolites: [{ name: '2-Fluoroamphetamine (2-FA)', active: true, halfLifeH: 6, potencyRel: 0.8, note: 'Presumed active metabolite, itself a known stimulant.' }],
    substrateOf: ['CYP2D6'], excretion: 'Renal; presumed substantial unchanged excretion.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [90, 150], durationH: [5, 8], afterEffectsH: [2, 6], bioavailability: 0.75,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    insufflated: { onsetMin: [5, 15], peakMin: [25, 50], durationH: [4, 6], afterEffectsH: [2, 6], bioavailability: 0.8,
      doses: { threshold: 5, light: [8, 15], common: [15, 30], strong: [30, 45], heavy: 45, unit: 'mg' } }
  },
  warnings: ['Little human data of any kind. Fluorinated amphetamines vary widely in toxicity — 4-FA in particular is dangerous, so do not generalise between isomers.'],
  refs: ['Limited; primarily user-reported data']
},

{
  id: '4-fa', name: '4-FA', aliases: ['4-fluoroamphetamine', '4-fmp', 'flux'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'Banned in NL/EU',
  tags: ['stimulant', 'entactogen', 'research-chemical', 'serotonin-releaser', 'dopamine-releaser',
         'mao-contraindicated', 'cardiotoxic', 'hypertensive-risk'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 7,
  mechanism: 'Releasing agent with a serotonin/dopamine balance between amphetamine and MDMA. Produces an unusually sharp blood-pressure rise.',
  halfLife: { hours: 10, range: [8, 12], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Deamination and hydroxylation', product: '4-Fluorophenylacetone / 4-fluoroephedrine', fraction: 0.3 },
      { enzyme: 'FMO3', reaction: 'N-oxidation', product: 'Hydroxylamine', fraction: 0.05 }
    ],
    metabolites: [{ name: '4-Fluoronorephedrine', active: true, halfLifeH: 6, potencyRel: 0.3 }],
    substrateOf: ['CYP2D6', 'FMO3'], excretion: 'Renal, substantial unchanged fraction.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [6, 8], afterEffectsH: [3, 12], bioavailability: 0.75,
      doses: { threshold: 25, light: [40, 75], common: [75, 125], strong: [125, 175], heavy: 175, unit: 'mg' } }
  },
  warnings: [
    'The Netherlands scheduled 4-FA after a cluster of haemorrhagic strokes and cardiac events in young, healthy users — including at ordinary recreational doses. Severe headache after 4-FA is a red flag.',
    'Serotonergic; MAOI-contraindicated.'
  ],
  refs: ['Dutch Poisons Information Centre 2016', 'Linsen et al. 2015, Drug Test Anal']
},

{
  id: '3-fpm', name: '3-FPM', aliases: ['3-fluorophenmetrazine', 'pal-593'],
  class: 'Stimulant', family: 'Phenylmorpholine', schedule: 'Varies',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'norepinephrine-releaser', 'mao-contraindicated', 'addictive'],
  toleranceGroup: 'phenmetrazine', toleranceHalfLifeDays: 4,
  mechanism: 'Phenmetrazine analogue; a noradrenaline-dominant releaser with a long, flat, functional profile.',
  halfLife: { hours: 5, range: [4, 7], confidence: 'estimated', notes: 'Inferred from reported 5-8 h durations; no human PK studies.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Presumed morpholine ring oxidation', product: 'Hydroxylated metabolites', fraction: 0.4, note: 'Speculative; based on phenmetrazine.' }
    ],
    metabolites: [{ name: 'Unidentified hydroxy metabolites', active: false, note: 'Not characterised in humans.' }],
    substrateOf: ['CYP2D6'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [5, 8], afterEffectsH: [2, 8], bioavailability: 0.75,
      doses: { threshold: 10, light: [20, 40], common: [40, 70], strong: [70, 100], heavy: 100, unit: 'mg' } },
    insufflated: { onsetMin: [5, 15], peakMin: [25, 50], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: ['Strong vasoconstriction reported; heavy redosing has been linked to cardiac complaints.'],
  refs: ['Limited; user-reported data']
},

{
  id: 'ephedrine', name: 'Ephedrine',
  class: 'Stimulant', family: 'Phenethylamine alkaloid', schedule: 'OTC-restricted',
  tags: ['stimulant', 'sympathomimetic', 'norepinephrine-releaser', 'vasoconstrictor',
         'mao-contraindicated', 'hypertensive-risk'],
  toleranceGroup: 'ephedrine', toleranceHalfLifeDays: 3,
  mechanism: 'Mixed-acting sympathomimetic: releases noradrenaline and directly agonises α- and β-adrenergic receptors. Poor CNS penetration, so effects are mostly peripheral.',
  halfLife: { hours: 5, range: [3, 6], confidence: 'measured', notes: 'Strongly urinary-pH dependent (3 h acidic, up to 6 h alkaline).' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation (minor)', product: 'Norephedrine', fraction: 0.08 },
      { enzyme: 'CYP2D6', reaction: 'Oxidative deamination (minor)', product: 'Benzoic acid derivatives', fraction: 0.05 }
    ],
    metabolites: [{ name: 'Norephedrine (phenylpropanolamine)', active: true, halfLifeH: 4, potencyRel: 0.5 }],
    substrateOf: ['CYP2D6'], excretion: 'Renal, 70-80% unchanged — mostly not metabolised at all.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 5], afterEffectsH: [1, 3], bioavailability: 0.85,
      doses: { threshold: 8, light: [12, 25], common: [25, 50], strong: [50, 75], heavy: 75, unit: 'mg' } }
  },
  warnings: ['Combined with caffeine it raises blood pressure substantially; the ephedrine/caffeine combination has caused strokes and cardiac events.'],
  refs: ['DrugBank DB01364']
},

{
  id: 'pseudoephedrine', name: 'Pseudoephedrine', aliases: ['sudafed'],
  class: 'Stimulant', family: 'Phenethylamine alkaloid', schedule: 'OTC (behind counter)',
  tags: ['stimulant', 'sympathomimetic', 'vasoconstrictor', 'mao-contraindicated', 'hypertensive-risk'],
  toleranceGroup: 'ephedrine', toleranceHalfLifeDays: 3,
  mechanism: 'Diastereomer of ephedrine; predominantly a nasal decongestant via α-adrenergic vasoconstriction, with mild CNS stimulation.',
  halfLife: { hours: 6, range: [5, 8], confidence: 'measured', notes: 'pH-dependent: ~3 h in acidic urine, up to 16 h in alkaline urine.' },
  metabolism: {
    pathways: [{ enzyme: 'CYP2D6', reaction: 'N-demethylation (minor)', product: 'Norpseudoephedrine (cathine)', fraction: 0.02 }],
    metabolites: [{ name: 'Cathine', active: true, halfLifeH: 5, potencyRel: 0.4, note: 'Also the active constituent of khat.' }],
    substrateOf: ['CYP2D6'], excretion: 'Renal, 70-96% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [4, 6], afterEffectsH: [1, 3], bioavailability: 0.9,
      doses: { threshold: 15, light: [30, 60], common: [60, 120], strong: [120, 180], heavy: 180, unit: 'mg' } }
  },
  warnings: ['MAOI-contraindicated — hypertensive crisis risk.'],
  refs: ['DrugBank DB00852']
},

{
  id: 'ethylphenidate', name: 'Ethylphenidate', aliases: ['ep'],
  class: 'Stimulant', family: 'Phenidate', schedule: 'Varies',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'vasoconstrictor', 'addictive'],
  toleranceGroup: 'methylphenidate', toleranceHalfLifeDays: 4,
  mechanism: 'Ethyl ester analogue of methylphenidate; more DAT-selective and reported as more euphoric. Also forms endogenously when methylphenidate and alcohol are combined.',
  halfLife: { hours: 2, range: [1.5, 3], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CES1', reaction: 'De-esterification', product: 'Ritalinic acid', fraction: 0.85, note: 'Same terminal metabolite as methylphenidate.' }],
    metabolites: [{ name: 'Ritalinic acid', active: false }],
    substrateOf: ['CES1'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [3, 10], peakMin: [15, 35], durationH: [1.5, 3], afterEffectsH: [2, 6], bioavailability: 0.8,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [3, 5], afterEffectsH: [2, 6], bioavailability: 0.4,
      doses: { threshold: 10, light: [15, 30], common: [30, 60], strong: [60, 90], heavy: 90, unit: 'mg' } }
  },
  warnings: ['Insufflation is notably corrosive to nasal tissue and has caused abscesses and vascular damage.'],
  refs: ['Markowitz et al. 1999, Drug Metab Dispos']
},

{
  id: '4f-mph', name: '4F-MPH', aliases: ['4-fluoromethylphenidate', '4f-methylphenidate'],
  class: 'Stimulant', family: 'Phenidate', schedule: 'Varies',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'methylphenidate', toleranceHalfLifeDays: 4,
  mechanism: 'Fluorinated methylphenidate analogue, roughly 2-5x more potent at DAT than the parent.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue', notes: 'No human data; estimated from methylphenidate with allowance for longer reported durations.' },
  metabolism: {
    pathways: [{ enzyme: 'CES1', reaction: 'De-esterification', product: '4-Fluororitalinic acid', fraction: 0.8 }],
    metabolites: [{ name: '4-Fluororitalinic acid', active: false }],
    substrateOf: ['CES1'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [4, 7], afterEffectsH: [3, 8], bioavailability: 0.4,
      doses: { threshold: 3, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [20, 40], durationH: [3, 5], afterEffectsH: [3, 8], bioavailability: 0.8,
      doses: { threshold: 2, light: [4, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } }
  },
  warnings: ['Strongly associated with compulsive redosing and prolonged vasoconstriction.'],
  refs: ['Limited; user-reported data']
},

{
  id: 'hexen', name: 'Hexen', aliases: ['n-ethylhexedrone', 'nep', 'ethyl-hexedrone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'I (US, analogue)',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing', 'highly-addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Cathinone-class NDRI closely related to the pyrovalerones; short-acting with strong compulsive redosing.',
  halfLife: { hours: 2, range: [1.5, 3], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-deethylation (presumed)', product: 'Hexedrone', fraction: 0.3 },
      { enzyme: 'CYP2C19', reaction: 'Ketone reduction / hydroxylation', product: 'Dihydro metabolites', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Hexedrone', active: true, halfLifeH: 2.5, potencyRel: 0.4 }],
    substrateOf: ['CYP2D6', 'CYP2C19'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [10, 25], durationH: [0.75, 2], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 10, light: [15, 30], common: [30, 60], strong: [60, 90], heavy: 90, unit: 'mg' } }
  },
  warnings: ['Extremely short duration with severe craving; binges lasting days are commonly reported.'],
  refs: ['Limited; EMCDDA notifications']
}

]);

/* Stimulants & dissociatives — second wave */
DB.register([

/* ---------------- Stimulants ---------------- */
{
  id: 'methcathinone', name: 'Methcathinone', aliases: ['ephedrone', 'cat', 'jeff'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'I (US)',
  tags: ['stimulant', 'dopamine-releaser', 'norepinephrine-releaser', 'mao-contraindicated',
         'neurotoxicity-risk', 'highly-addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 4,
  mechanism: 'β-keto analogue of methamphetamine and a potent dopamine/noradrenaline releaser, with less CNS penetration than methamphetamine per unit dose.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Cathinone', fraction: 0.3, note: 'Active metabolite — the principal stimulant of khat.' },
      { enzyme: 'CYP2D6 / carbonyl reductase', reaction: 'Ketone reduction', product: 'Ephedrine / pseudoephedrine', fraction: 0.3, note: 'Active.' }
    ],
    metabolites: [
      { name: 'Cathinone', active: true, halfLifeH: 3, potencyRel: 0.7 },
      { name: 'Ephedrine', active: true, halfLifeH: 5, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP2D6'], excretion: 'Renal, substantial unchanged fraction.', confidence: 'estimated'
  },
  routes: {
    insufflated: { onsetMin: [2, 10], peakMin: [15, 40], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 10, light: [20, 40], common: [40, 80], strong: [80, 120], heavy: 120, unit: 'mg' } },
    oral: { onsetMin: [20, 45], peakMin: [45, 90], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 15, light: [30, 60], common: [60, 120], strong: [120, 180], heavy: 180, unit: 'mg' } }
  },
  warnings: [
    'Home synthesis using potassium permanganate leaves manganese residues that cause an irreversible parkinsonian syndrome (manganism). This has permanently disabled many users in Eastern Europe and is the single most important hazard of this drug.',
    'MAOI-contraindicated.'
  ],
  refs: ['Stepens et al. 2008, NEJM', 'Sikk & Taba 2015, Int Rev Neurobiol']
},

{
  id: '4-cmc', name: '4-CMC', aliases: ['clephedrone', '4-chloromethcathinone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'Varies / banned in EU',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'Chlorinated mephedrone analogue; a monoamine releaser, commonly sold as a mephedrone substitute after 4-MMC bans.',
  halfLife: { hours: 2.5, range: [2, 4], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Nor-4-CMC', fraction: 0.35 },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Dihydro-4-CMC', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Nor-4-CMC', active: true, halfLifeH: 3, potencyRel: 0.5 }],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } },
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [1, 2.5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 15, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: ['Serotonergic; MAOI-contraindicated. Strong compulsive redosing, as with the whole cathinone class.'],
  refs: ['EMCDDA 4-CMC notifications']
},

{
  id: '2-fa', name: '2-FA', aliases: ['2-fluoroamphetamine'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'Varies',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'norepinephrine-releaser',
         'mao-contraindicated', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 5,
  mechanism: 'Fluorinated amphetamine analogue and a dopamine/noradrenaline releaser. Reported as close to dextroamphetamine but slightly less euphoric.',
  halfLife: { hours: 6, range: [4, 9], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Presumed deamination and hydroxylation', product: '2-Fluorophenylacetone / hydroxylated species', fraction: 0.3,
        note: 'By analogy with amphetamine; not directly characterised in humans.' },
      { enzyme: 'FMO3', reaction: 'N-oxidation', product: 'Hydroxylamine', fraction: 0.05 }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false }],
    substrateOf: ['CYP2D6', 'FMO3'], excretion: 'Renal, presumed largely unchanged.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [90, 150], durationH: [5, 8], afterEffectsH: [2, 8], bioavailability: 0.75,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 75], heavy: 75, unit: 'mg' } }
  },
  warnings: [
    'Do not generalise between fluorinated amphetamine isomers — 4-FA is associated with strokes and cardiac events that 2-FA is not known to share, but neither has real safety data.',
    'MAOI-contraindicated.'
  ],
  refs: ['Limited; user-reported data']
},

{
  id: 'isopropylphenidate', name: 'Isopropylphenidate', aliases: ['ipph', 'ipd'],
  class: 'Stimulant', family: 'Phenidate', schedule: 'Varies',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'norepinephrine-reuptake-inhibitor', 'addictive'],
  toleranceGroup: 'methylphenidate', toleranceHalfLifeDays: 4,
  mechanism: 'Isopropyl ester analogue of methylphenidate; more noradrenergic and reported as less euphoric and less compulsive than ethylphenidate.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CES1', reaction: 'De-esterification', product: 'Ritalinic acid', fraction: 0.8, note: 'Same terminal metabolite as methylphenidate; slower hydrolysis than the methyl ester gives a longer duration.' }],
    metabolites: [{ name: 'Ritalinic acid', active: false }],
    substrateOf: ['CES1'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [5, 8], afterEffectsH: [2, 6], bioavailability: 0.5,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: ['Prolonged vasoconstriction reported with repeated dosing.'],
  refs: ['Limited; user-reported data']
},

{
  id: 'propylhexedrine', name: 'Propylhexedrine', aliases: ['benzedrex', 'obesin'],
  class: 'Stimulant', family: 'Cycloalkylamine', schedule: 'OTC (nasal inhaler)',
  tags: ['stimulant', 'sympathomimetic', 'norepinephrine-releaser', 'vasoconstrictor',
         'cardiotoxic', 'mao-contraindicated', 'hypertensive-risk'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 3,
  mechanism: 'Cyclohexyl analogue of methamphetamine sold as an OTC nasal decongestant. Predominantly noradrenergic with much weaker CNS effects than methamphetamine.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Norpropylhexedrine', fraction: 0.25 },
      { enzyme: 'CYP2D6', reaction: 'Cyclohexyl ring hydroxylation', product: 'Hydroxypropylhexedrine', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Norpropylhexedrine', active: true, potencyRel: 0.5 }],
    substrateOf: ['CYP2D6'], excretion: 'Renal, substantial unchanged fraction.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [60, 150], durationH: [3, 6], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 250], heavy: 250, unit: 'mg' } },
    inhaled: { onsetMin: [1, 5], peakMin: [5, 20], durationH: [0.5, 2], afterEffectsH: [1, 4], bioavailability: 0.5,
      doses: { threshold: 10, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: [
    'Oral misuse of the inhaler contents causes severe cardiotoxicity — cardiomyopathy, pulmonary hypertension and sudden cardiac death are documented, disproportionately in young people.',
    'The inhaler also contains menthol and lavender oil, which are irritant and emetic when swallowed.',
    'MAOI-contraindicated.'
  ],
  refs: ['Holler et al. 2017, J Anal Toxicol']
},

{
  id: 'khat', name: 'Khat', aliases: ['cathinone', 'qat', 'chat', 'miraa'],
  class: 'Stimulant', family: 'Cathinone (plant)', schedule: 'I (US); varies widely',
  tags: ['stimulant', 'dopamine-releaser', 'norepinephrine-releaser', 'mao-contraindicated', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 3,
  mechanism: 'The leaf of Catha edulis, chewed for its cathinone content — a natural amphetamine-like releaser, roughly comparable to a mild dose of amphetamine.',
  halfLife: { hours: 3, range: [1.5, 4], confidence: 'measured', notes: 'Cathinone degrades rapidly in harvested leaf, which is why khat is traded and consumed fresh.' },
  metabolism: {
    firstPass: 'Substantial; buccal absorption during chewing bypasses some of it.',
    pathways: [
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Cathine (norpseudoephedrine) and norephedrine', fraction: 0.8,
        note: 'The dominant route; both products are active but far weaker, giving khat its long, mild tail.' },
      { enzyme: 'CYP2D6', reaction: 'Minor oxidation', product: 'Hydroxylated species', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Cathine', active: true, halfLifeH: 5, potencyRel: 0.15 },
      { name: 'Norephedrine', active: true, halfLifeH: 4, potencyRel: 0.15 }
    ],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    buccal: { onsetMin: [15, 45], peakMin: [90, 180], durationH: [3, 6], afterEffectsH: [4, 12], bioavailability: 0.6,
      doses: { threshold: 20, light: [50, 100], common: [100, 200], strong: [200, 400], heavy: 400, unit: 'g',
        note: 'In grams of fresh leaf. A typical session bundle is 100-300 g chewed over several hours.' } }
  },
  warnings: [
    'Prolonged chewing sessions cause insomnia, appetite suppression and, with heavy long-term use, oral mucosal changes and dependence.',
    'MAOI-contraindicated.'
  ],
  refs: ['Toennes et al. 2003, Br J Clin Pharmacol']
},

/* ---------------- Dissociatives ---------------- */
{
  id: '3-ho-pcp', name: '3-HO-PCP', aliases: ['3-hydroxyphencyclidine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'opioid', 'mu-agonist', 'research-chemical',
         'respiratory-depressant', 'high-toxicity', 'cns-depressant', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Unusual dual pharmacology: a potent NMDA antagonist that is ALSO a mu-opioid agonist of meaningful affinity. That opioid component makes it far more dangerous than other dissociatives, because it adds genuine respiratory depression.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Glucuronidation of the phenol', product: '3-HO-PCP glucuronide', fraction: 0.5 },
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'Piperidine hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.3 }
    ],
    metabolites: [{ name: '3-HO-PCP glucuronide', active: false }],
    substrateOf: ['UGT', 'CYP2B6', 'CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'Its mu-opioid activity means it can cause true respiratory depression — unlike ketamine. Combining with any depressant is correspondingly more dangerous, and naloxone may partially reverse it.',
    'Active in single milligrams; volumetric dosing essential.'
  ],
  refs: ['Wallach et al. 2016, Br J Pharmacol']
},

{
  id: '4-meo-pcp', name: '4-MeO-PCP', aliases: ['4-methoxyphencyclidine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Weaker NMDA antagonist than PCP or 3-MeO-PCP, requiring larger doses and reported as more sedating and less stimulating.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'O-demethylation', product: '4-HO-PCP', fraction: 0.3, note: 'Presumed active.' },
      { enzyme: 'CYP3A4', reaction: 'Piperidine hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.3 }
    ],
    metabolites: [{ name: '4-HO-PCP', active: true, halfLifeH: 7, potencyRel: 0.5 }],
    substrateOf: ['CYP2B6', 'CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [90, 180], durationH: [5, 9], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 10, light: [20, 40], common: [40, 70], strong: [70, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: ['Slow onset drives redosing before the first dose peaks — the recurring hazard of this whole class.'],
  refs: ['Wallach et al. 2016, Br J Pharmacol']
},

{
  id: 'o-pce', name: 'O-PCE', aliases: ['eticyclidone', '2-oxo-pce', 'deschloro-n-ethyl-ketamine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'stimulant', 'research-chemical', 'cns-depressant',
         'compulsive-redosing', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Potent, notably stimulating dissociative related to deschloroketamine; several times the potency of ketamine with a longer duration.',
  halfLife: { hours: 4, range: [2, 7], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'N-deethylation (presumed)', product: 'Nor-O-PCE', fraction: 0.5, note: 'By analogy with norketamine; presumed active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Nor-O-PCE', active: true, halfLifeH: 6, potencyRel: 0.3 }],
    substrateOf: ['CYP3A4', 'CYP2B6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [3, 15], peakMin: [20, 45], durationH: [2, 4], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 2, light: [5, 10], common: [10, 20], strong: [20, 35], heavy: 35, unit: 'mg' } },
    oral: { onsetMin: [15, 45], peakMin: [45, 120], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.6,
      doses: { threshold: 4, light: [8, 15], common: [15, 30], strong: [30, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'Strongly associated with compulsive redosing, mania and multi-day binges — more so than ketamine.',
    'Presumed to share ketamine\'s bladder toxicity with repeated use.'
  ],
  refs: ['Limited; forensic and user-reported data']
},

{
  id: 'diphenidine', name: 'Diphenidine', aliases: ['dnd', '1,2-dep'],
  class: 'Dissociative', family: 'Diarylethylamine', schedule: 'Varies / banned in UK, JP',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant',
         'hypertensive-risk', 'psychosis-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Diarylethylamine NMDA antagonist structurally distinct from the arylcyclohexylamines, with comparable potency to PCP.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'Aromatic hydroxylation', product: 'Hydroxy-diphenidine', fraction: 0.4, note: 'Identified in human urine studies.' },
      { enzyme: 'CYP3A4', reaction: 'Piperidine ring degradation', product: 'Ring-opened metabolites', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Hydroxy-diphenidine', active: false, note: 'Main urinary marker.' }],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 10, light: [20, 40], common: [40, 70], strong: [70, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Delayed onset causes redosing into overdose. Marked hypertension reported.',
    'Implicated in a number of deaths, generally alongside other depressants.'
  ],
  refs: ['Wink et al. 2016, Drug Test Anal', 'Elliott et al. 2015, Forensic Sci Int']
},

{
  id: 'esketamine', name: 'Esketamine', aliases: ['spravato', 's-ketamine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'III (US)',
  tags: ['dissociative', 'nmda-antagonist', 'anaesthetic', 'antidepressant', 'cns-depressant',
         'urotoxic', 'addictive'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'The S-enantiomer of ketamine, roughly twice as potent at NMDA as the racemate. Approved as a nasal spray for treatment-resistant depression.',
  halfLife: { hours: 3, range: [2, 4], confidence: 'measured' },
  metabolism: {
    firstPass: 'Heavy orally; the intranasal route (~48% bioavailability) exists to bypass it.',
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'N-demethylation', product: 'S-norketamine', fraction: 0.5, note: 'Dominant at the low plasma levels used therapeutically.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'S-norketamine', fraction: 0.3 },
      { enzyme: 'CYP2A6 / CYP2C9', reaction: 'Hydroxylation', product: 'Hydroxynorketamines', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'S-Norketamine', active: true, halfLifeH: 5, potencyRel: 0.3 },
      { name: '(2S,6S)-Hydroxynorketamine', active: true, halfLifeH: 7, potencyRel: 0.05, note: 'Implicated in the antidepressant effect via AMPA potentiation.' }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CYP2C9'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    intranasal: { onsetMin: [5, 15], peakMin: [20, 40], durationH: [1, 2], afterEffectsH: [1, 4], bioavailability: 0.48,
      doses: { threshold: 14, light: [28, 42], common: [56, 84], strong: [84, 126], heavy: 126, unit: 'mg' } }
  },
  warnings: [
    'Clinically it is administered only under direct observation with a two-hour monitoring period, because of dissociation, sedation and blood pressure spikes.',
    'Same bladder toxicity risk as ketamine with repeated heavy use.',
    'Additive and dangerous with other CNS depressants.'
  ],
  refs: ['DrugBank DB01221', 'Perez-Ruixo et al. 2021, Clin Pharmacokinet']
}

]);

/* Stimulant & entactogen research chemicals — cathinones, phenidates, benzofurans */
DB.register([

{
  id: 'pentedrone', name: 'Pentedrone', aliases: ['α-methylaminovalerophenone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'I (US)',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'norepinephrine-reuptake-inhibitor',
         'compulsive-redosing', 'hyperthermia-risk', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Cathinone-class NDRI with negligible serotonergic activity — the same dopamine-dominant profile that makes the pyrovalerones so compulsive.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Norpentedrone', fraction: 0.3, note: 'Active.' },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Dihydropentedrone', fraction: 0.3 },
      { enzyme: 'CYP2C19', reaction: 'ω-hydroxylation of the alkyl chain', product: 'Hydroxypentedrone', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Norpentedrone', active: true, halfLifeH: 4, potencyRel: 0.5 },
      { name: 'Dihydropentedrone', active: false, halfLifeH: 4, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [50, 100], durationH: [3, 5], afterEffectsH: [3, 12], bioavailability: 0.7,
      doses: { threshold: 10, light: [20, 40], common: [40, 80], strong: [80, 130], heavy: 130, unit: 'mg' } },
    insufflated: { onsetMin: [3, 10], peakMin: [15, 35], durationH: [2, 3.5], afterEffectsH: [3, 12], bioavailability: 0.8,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: ['Strong compulsive redosing and multi-day binges; insomnia and stimulant psychosis are common outcomes.'],
  refs: ['Uralets et al. 2014, J Anal Toxicol']
},

{
  id: '4-mec', name: '4-MEC', aliases: ['4-methylethcathinone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'I (US)',
  tags: ['stimulant', 'entactogen', 'research-chemical', 'serotonin-releaser', 'dopamine-releaser',
         'serotonergic', 'mao-contraindicated', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'N-ethyl homologue of mephedrone; a mixed releaser/reuptake inhibitor with a more serotonergic and less euphoric profile than 4-MMC.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-deethylation', product: 'Nor-4-MEC (4-MC)', fraction: 0.3, note: 'Active.' },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Dihydro-4-MEC', fraction: 0.25 },
      { enzyme: 'CYP2D6', reaction: 'Tolyl methyl oxidation', product: '4-Carboxy-MEC', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Nor-4-MEC', active: true, halfLifeH: 3, potencyRel: 0.5 },
      { name: '4-Carboxy-MEC', active: false, halfLifeH: 4, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: ['Serotonergic; MAOI-contraindicated. Frequently sold in mixtures with other cathinones.'],
  refs: ['EMCDDA 4-MEC notifications']
},

{
  id: 'dimethylpentylone', name: 'Dimethylpentylone', aliases: ['bk-dmbdp', 'dipentylone'],
  class: 'Entactogen', family: 'Cathinone', schedule: 'I (US)',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonergic', 'mao-contraindicated',
         'compulsive-redosing', 'hyperthermia-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 10,
  mechanism: 'Methylenedioxy cathinone in the eutylone family. Since roughly 2022 it has been among the most common compounds mis-sold as MDMA in seized "ecstasy" tablets.',
  halfLife: { hours: 4, range: [2, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylenation of the methylenedioxy ring', product: 'Dihydroxy metabolite', fraction: 0.4 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'Methoxy-hydroxy metabolite', fraction: 0.3, note: 'Main urinary marker.' },
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Pentylone', fraction: 0.1, note: 'Active entactogen in its own right.' }
    ],
    metabolites: [
      { name: 'Pentylone', active: true, halfLifeH: 4, potencyRel: 0.7 },
      { name: 'Methoxy-hydroxy-dimethylpentylone', active: false, halfLifeH: 5 }
    ],
    substrateOf: ['CYP2D6', 'COMT'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 30, light: [50, 100], common: [100, 175], strong: [175, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: [
    'Extremely common MDMA substitute. Because it is more stimulating and much less entactogenic, people redose repeatedly chasing an effect that will not come — a documented route to overdose and severe insomnia.',
    'Reagent testing distinguishes it: cathinones give weak or absent Marquis reactions where MDMA turns purple-black.'
  ],
  refs: ['DEA Emerging Threat Reports 2022-2024', 'CFSRE NPS Discovery']
},

{
  id: '3-cmc', name: '3-CMC', aliases: ['clophedrone', '3-chloromethcathinone'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'Banned in most of EU',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'compulsive-redosing', 'addictive'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'Positional isomer of 4-CMC; monoamine releaser with a more stimulant-leaning balance. Became widespread across Europe after 3-MMC restrictions.',
  halfLife: { hours: 2.5, range: [2, 4], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Nor-3-CMC', fraction: 0.35, note: 'Active.' },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Dihydro-3-CMC', fraction: 0.3, note: 'Main urinary marker.' }
    ],
    metabolites: [
      { name: 'Nor-3-CMC', active: true, halfLifeH: 3, potencyRel: 0.5 },
      { name: 'Dihydro-3-CMC', active: false, halfLifeH: 4 }
    ],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 25, light: [50, 100], common: [100, 175], strong: [175, 250], heavy: 250, unit: 'mg' } },
    insufflated: { onsetMin: [2, 8], peakMin: [15, 35], durationH: [1, 2.5], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 15, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: ['Serotonergic; MAOI-contraindicated. Very strong compulsive redosing.'],
  refs: ['EMCDDA 3-CMC risk assessment 2023']
},

{
  id: 'mdphp', name: 'MDPHP', aliases: ['3\',4\'-methylenedioxy-α-pyrrolidinohexanophenone'],
  class: 'Stimulant', family: 'Cathinone (pyrovalerone)', schedule: 'Varies / analogue',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'hyperthermia-risk', 'highly-addictive', 'psychosis-risk'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 3,
  mechanism: 'Pyrovalerone-class DAT/NET reuptake inhibitor, the hexanophenone homologue of MDPV. Same extremely dopamine-selective profile.',
  halfLife: { hours: 3.5, range: [2, 6], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Demethylenation of the methylenedioxy ring', product: 'Catechol metabolite', fraction: 0.4 },
      { enzyme: 'COMT', reaction: 'O-methylation', product: 'Methoxy-hydroxy-MDPHP', fraction: 0.3 },
      { enzyme: 'CYP2C19', reaction: 'Pyrrolidine ring oxidation', product: '2-oxo-MDPHP', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Methoxy-hydroxy-MDPHP', active: false, halfLifeH: 5, note: 'Main urinary marker.' },
      { name: '2-oxo-MDPHP', active: false, halfLifeH: 4 }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19', 'COMT'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [2, 8], peakMin: [15, 40], durationH: [2, 4], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 2, light: [3, 8], common: [8, 15], strong: [15, 25], heavy: 25, unit: 'mg' } },
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 3, light: [5, 12], common: [12, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'Active in single milligrams; volumetric dosing essential.',
    'Among the most compulsive compounds in this database — multi-day binges, psychosis and hyperthermia are the norm in case reports.'
  ],
  refs: ['EMCDDA MDPHP reports 2022-2024']
},

{
  id: '3-4-ctmp', name: '3,4-CTMP', aliases: ['3,4-dichloromethylphenidate'],
  class: 'Stimulant', family: 'Phenidate', schedule: 'Varies / analogue',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'compulsive-redosing',
         'vasoconstrictor', 'highly-addictive', 'psychosis-risk'],
  toleranceGroup: 'methylphenidate', toleranceHalfLifeDays: 5,
  mechanism: 'Dichlorinated methylphenidate analogue estimated at roughly 7× the DAT potency of methylphenidate, with a much longer duration.',
  halfLife: { hours: 8, range: [5, 14], confidence: 'analogue' },
  metabolism: {
    pathways: [{ enzyme: 'CES1', reaction: 'De-esterification', product: '3,4-dichlororitalinic acid', fraction: 0.75,
      note: 'Hydrolysis is slower than for methylphenidate, which is part of why the duration is so much longer.' }],
    metabolites: [{ name: '3,4-Dichlororitalinic acid', active: false, halfLifeH: 8 }],
    substrateOf: ['CES1'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [8, 16], afterEffectsH: [6, 24], bioavailability: 0.5,
      doses: { threshold: 0.5, light: [1, 3], common: [3, 6], strong: [6, 10], heavy: 10, unit: 'mg' } }
  },
  warnings: [
    'Very long duration combined with strong compulsion — binges lasting days with no sleep are commonly reported, followed by psychosis.',
    'Severe and prolonged vasoconstriction.'
  ],
  refs: ['Limited; user-reported and forensic data']
},

{
  id: '5-apb', name: '5-APB', aliases: ['5-(2-aminopropyl)benzofuran'],
  class: 'Entactogen', family: 'Benzofuran', schedule: 'Class B (UK) / varies',
  tags: ['entactogen', 'stimulant', 'research-chemical', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'cardiotoxic', 'hyperthermia-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 14, minRedoseDays: 42,
  mechanism: 'Benzofuran analogue of MDA and a releaser at all three monoamine transporters, with notable 5-HT2B agonism.',
  halfLife: { hours: 8, range: [5, 12], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Benzofuran ring oxidation', product: 'Hydroxylated metabolites', fraction: 0.35, note: 'Not characterised in humans.' },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Corresponding ketone and acid', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Uncharacterised hydroxy metabolites', active: false, note: 'Human metabolism has not been published.' }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 210], durationH: [7, 11], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 20, light: [40, 70], common: [70, 110], strong: [110, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: [
    '5-HT2B agonism carries a theoretical valvular heart disease risk with repeated use — the mechanism that withdrew fenfluramine.',
    'Slow onset causes redosing before the first dose peaks. MAOI-contraindicated.'
  ],
  refs: ['Rickli et al. 2015, Eur Neuropsychopharmacol', 'ACMD benzofuran report']
},

{
  id: '6-apdb', name: '6-APDB', aliases: ['4-desoxy-mda', 'benzofury variant'],
  class: 'Entactogen', family: 'Benzodifuran', schedule: 'Varies',
  tags: ['entactogen', 'research-chemical', 'serotonin-releaser', 'serotonergic', 'mao-contraindicated'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 14, minRedoseDays: 42,
  mechanism: 'Dihydrobenzofuran analogue of MDA; a predominantly serotonergic releaser reported as gentler and less stimulating than 6-APB.',
  halfLife: { hours: 6, range: [4, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Presumed ring hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.35 },
      { enzyme: 'MAO-A', reaction: 'Deamination', product: 'Corresponding acid', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Uncharacterised', active: false }],
    substrateOf: ['CYP2D6', 'MAO-A'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [5, 8], afterEffectsH: [4, 18], bioavailability: 0.7,
      doses: { threshold: 25, light: [40, 70], common: [70, 110], strong: [110, 140], heavy: 140, unit: 'mg' } }
  },
  warnings: ['Serotonergic; MAOI-contraindicated. Essentially no human data.'],
  refs: ['Iversen et al. 2013, ACMD report']
},

{
  id: '4-fma', name: '4-FMA', aliases: ['4-fluoromethamphetamine'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'Varies',
  tags: ['stimulant', 'research-chemical', 'dopamine-releaser', 'serotonin-releaser', 'serotonergic',
         'mao-contraindicated', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 5,
  mechanism: 'Fluorinated methamphetamine analogue with a more serotonergic balance than 2-FMA; sits between a stimulant and a weak entactogen.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: '4-FA', fraction: 0.2,
        note: 'Produces 4-FA — itself a drug associated with strokes and cardiac events, which is a meaningful concern for this compound.' },
      { enzyme: 'CYP2D6', reaction: 'Aromatic hydroxylation', product: 'Hydroxylated metabolites', fraction: 0.25 }
    ],
    metabolites: [{ name: '4-FA', active: true, halfLifeH: 10, potencyRel: 0.8, note: 'Active and longer-lived than the parent; carries the cardiovascular risk profile of 4-FA.' }],
    substrateOf: ['CYP2D6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [75, 150], durationH: [4, 7], afterEffectsH: [3, 12], bioavailability: 0.75,
      doses: { threshold: 15, light: [30, 60], common: [60, 100], strong: [100, 150], heavy: 150, unit: 'mg' } }
  },
  warnings: [
    'Metabolises to 4-FA, which the Netherlands scheduled after a cluster of haemorrhagic strokes in young healthy users. Severe headache is a red flag.',
    'Serotonergic; MAOI-contraindicated.'
  ],
  refs: ['Limited; EMCDDA notifications']
}

]);

/* Stimulants: anorectics, non-stimulant ADHD drugs, and remaining RCs. */
DB.register([

{
  id: 'phentermine', name: 'Phentermine', aliases: ['adipex', 'duromine', 'lomaira'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'IV (US)',
  tags: ['stimulant', 'anorectic', 'norepinephrine-releaser', 'mao-contraindicated',
         'hypertensive-risk', 'vasoconstrictor'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 4,
  mechanism: 'The most prescribed weight-loss drug in the US. A noradrenaline-dominant releasing agent — the α-methyl substitution reduces dopamine release relative to amphetamine, which is why it suppresses appetite with comparatively modest euphoria and abuse potential.',
  halfLife: { hours: 20, range: [19, 24], confidence: 'measured',
    notes: 'Long, and highly urinary-pH dependent like the other amphetamines. Taken late in the day it reliably wrecks sleep.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation and N-oxidation', product: 'p-Hydroxyphentermine / phentermine N-oxide', fraction: 0.25,
        note: 'Only a minority is metabolised — most leaves unchanged.' },
      { enzyme: 'None (renal)', reaction: 'Excreted unchanged, pH-dependent', product: 'Phentermine', fraction: 0.7,
        note: 'Alkaline urine slows clearance and prolongs it substantially; acidic urine shortens it.' }
    ],
    metabolites: [{ name: 'p-Hydroxyphentermine', active: true, halfLifeH: 20, potencyRel: 0.2, fraction: 0.25 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal, 70-80% unchanged and strongly pH-dependent.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [180, 270], durationH: [10, 16], afterEffectsH: [4, 12], bioavailability: 0.9,
      doses: { threshold: 7.5, light: [15, 15], common: [15, 37.5], strong: [37.5, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'Contraindicated with MAOIs — hypertensive crisis.',
    'The historical fen-phen combination (with fenfluramine) caused valvular heart disease and pulmonary hypertension. Phentermine alone was not implicated, but never combine it with a serotonergic anorectic.',
    'Raises blood pressure; additive with other stimulants.'
  ],
  sources: ['DrugBank DB00191']
},

{
  id: 'diethylpropion', name: 'Diethylpropion', aliases: ['amfepramone', 'tenuate'],
  class: 'Stimulant', family: 'Cathinone', schedule: 'IV (US)',
  tags: ['stimulant', 'anorectic', 'norepinephrine-releaser', 'prodrug', 'mao-contraindicated',
         'hypertensive-risk', 'seizure-risk'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'A cathinone anorectic — structurally a close relative of the recreational cathinones, but with such heavy first-pass metabolism that it behaves quite differently. Most of its activity comes from its metabolites.',
  halfLife: { hours: 5, range: [4, 8], confidence: 'measured', notes: 'The active metabolites last considerably longer than the parent.' },
  metabolism: {
    firstPass: 'Very extensive — diethylpropion itself is barely detectable in plasma.',
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'N-deethylation', product: 'Ethylaminopropiophenone', fraction: 0.5, note: 'Active.' },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Diethylnorpseudoephedrine', fraction: 0.3, note: 'Active; long-lived.' }
    ],
    metabolites: [
      { name: 'Ethylaminopropiophenone', active: true, halfLifeH: 8, potencyRel: 0.8, fraction: 0.5 },
      { name: 'Diethylnorpseudoephedrine', active: true, halfLifeH: 12, potencyRel: 0.4, fraction: 0.3 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal, pH-dependent.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [3, 10], bioavailability: 0.7,
      doses: { threshold: 12.5, light: [25, 25], common: [25, 75], strong: [75, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Contraindicated with MAOIs. Lowers the seizure threshold — avoid with bupropion, tramadol and in epilepsy.',
    'Associated with pulmonary hypertension in long-term use, as with other anorectics.'
  ],
  sources: ['DrugBank DB00937']
},

{
  id: 'phendimetrazine', name: 'Phendimetrazine', aliases: ['bontril', 'prelu-2'],
  class: 'Stimulant', family: 'Phenylmorpholine', schedule: 'III (US)',
  tags: ['stimulant', 'anorectic', 'prodrug', 'norepinephrine-releaser', 'mao-contraindicated',
         'hypertensive-risk', 'addictive'],
  toleranceGroup: 'phenmetrazine', toleranceHalfLifeDays: 4,
  mechanism: 'A prodrug for phenmetrazine — the 1950s anorectic that turned out to have amphetamine-like abuse potential. Phendimetrazine itself is inactive; the slow N-demethylation to phenmetrazine limits the rush and hence the abuse liability.',
  halfLife: { hours: 2, range: [1.9, 9.8], confidence: 'measured', notes: 'Parent only; phenmetrazine carries the effect.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'N-demethylation', product: 'Phenmetrazine', fraction: 0.3,
        note: 'The activating step. Only about 30% converts, which is what keeps it a Schedule III rather than II drug.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.35 }
    ],
    metabolites: [{ name: 'Phenmetrazine', active: true, halfLifeH: 8, potencyRel: 5, fraction: 0.3,
      note: 'The real drug — a noradrenaline-dominant releaser comparable to a mild amphetamine.' }],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal, pH-dependent.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [6, 12], afterEffectsH: [4, 12], bioavailability: 0.8,
      doses: { threshold: 17.5, light: [35, 35], common: [35, 70], strong: [70, 105], heavy: 105, unit: 'mg' } }
  },
  warnings: [
    'CYP2D6 ultra-rapid metabolisers convert more to phenmetrazine and get a stronger, more amphetamine-like effect.',
    'Contraindicated with MAOIs.'
  ],
  sources: ['DrugBank DB01579', 'Rothman et al. 2002, Synapse']
},

{
  id: 'fenfluramine', name: 'Fenfluramine', aliases: ['fintepla', 'pondimin'],
  class: 'Stimulant', family: 'Substituted amphetamine', schedule: 'IV (US, re-approved 2020)',
  tags: ['serotonin-releaser', 'serotonergic', 'anorectic', 'anticonvulsant', 'cardiotoxic',
         'valvulopathy-risk', 'pulmonary-hypertension-risk', 'mao-contraindicated', 'serotonin-syndrome-risk'],
  toleranceGroup: 'mdma', toleranceHalfLifeDays: 7,
  mechanism: 'A selective serotonin releasing agent, withdrawn as a diet drug in 1997 after causing heart valve disease — and then re-approved in 2020 at much lower doses for Dravet syndrome epilepsy. The classic cautionary tale for 5-HT2B agonism.',
  halfLife: { hours: 20, range: [11, 30], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP1A2 / CYP2B6 / CYP2D6', reaction: 'N-deethylation', product: 'Norfenfluramine', fraction: 0.5,
        note: 'THE problem metabolite. Norfenfluramine is a potent 5-HT2B agonist, and 5-HT2B activation on heart valves drives the fibrotic thickening that caused the fen-phen disaster.' },
      { enzyme: 'CYP2C9 / CYP2D6', reaction: 'Further oxidation', product: 'Inactive acids', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Norfenfluramine', active: true, halfLifeH: 30, potencyRel: 1.5, fraction: 0.5,
      note: 'More potent than the parent, longer-lived, and the direct cause of valvular heart disease and pulmonary hypertension.' }],
    substrateOf: ['CYP1A2', 'CYP2B6', 'CYP2D6', 'CYP2C9'], excretion: 'Renal, pH-dependent.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [8, 16], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg',
        note: 'The epilepsy indication uses 0.2-0.7 mg/kg/day with mandatory echocardiogram monitoring — far below the old diet doses.' } }
  },
  warnings: [
    'Causes valvular heart disease and pulmonary hypertension via its 5-HT2B agonist metabolite. This is the mechanism behind the warnings on 6-APB, 5-APB and other 5-HT2B-active compounds in this database.',
    'Current use requires regular echocardiograms. It carries a REMS programme in the US.',
    'Contraindicated with MAOIs; serotonin syndrome risk with SSRIs, MDMA and tramadol.'
  ],
  sources: ['Rothman et al. 2000, Circulation', 'FDA Fintepla approval 2020']
},

{
  id: 'atomoxetine', name: 'Atomoxetine', aliases: ['strattera'],
  class: 'Stimulant', family: 'Selective NRI', schedule: 'Prescription (unscheduled)',
  tags: ['norepinephrine-reuptake-inhibitor', 'non-stimulant', 'cyp2d6-critical',
         'mao-contraindicated', 'hepatotoxic-rare', 'suicidality-warning'],
  mechanism: 'A selective noradrenaline reuptake inhibitor for ADHD. Not a stimulant and not controlled — it has no abuse potential because it does not release dopamine in the nucleus accumbens. Takes weeks to work rather than acting per-dose.',
  halfLife: { hours: 5, range: [4, 22], confidence: 'measured',
    notes: 'CRITICAL PHARMACOGENETICS: 5 hours in CYP2D6 extensive metabolisers but 22 hours in poor metabolisers (~7% of Europeans), with roughly 10× the plasma exposure. Dosing guidance differs by genotype.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: '4-hydroxylation', product: '4-Hydroxyatomoxetine', fraction: 0.8,
        note: 'Dominant. The metabolite is equipotent but rapidly glucuronidated, so it contributes little. Poor metabolisers or anyone on a strong 2D6 inhibitor (fluoxetine, paroxetine, bupropion) accumulate the parent dramatically.' },
      { enzyme: 'CYP2C19', reaction: 'N-demethylation', product: 'N-desmethylatomoxetine', fraction: 0.1 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: '4-OH-atomoxetine glucuronide', fraction: 0.7 }
    ],
    metabolites: [
      { name: '4-Hydroxyatomoxetine', active: true, halfLifeH: 6, potencyRel: 1.0, fraction: 0.8,
        note: 'Equipotent but present at low levels because it is conjugated almost immediately.' },
      { name: 'N-desmethylatomoxetine', active: false, halfLifeH: 8, fraction: 0.1 }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19', 'UGT'], excretion: 'Renal, >80% as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [60, 120], durationH: [10, 24], afterEffectsH: [0, 0], bioavailability: 0.63,
      doses: { threshold: 10, light: [18, 25], common: [40, 80], strong: [80, 100], heavy: 120, unit: 'mg' } }
  },
  warnings: [
    'CYP2D6 inhibitors turn a normal dose into roughly a 10× overdose. Combining it with fluoxetine, paroxetine or bupropion needs a dose reduction.',
    'Contraindicated with MAOIs; a 2-week washout is required.',
    'Carries a boxed warning for suicidal ideation in adolescents, and rare idiosyncratic liver injury.',
    'Raises heart rate and blood pressure; additive with stimulants.'
  ],
  sources: ['DrugBank DB00289', 'CPIC atomoxetine guideline 2019']
},

{
  id: 'solriamfetol', name: 'Solriamfetol', aliases: ['sunosi'],
  class: 'Stimulant', family: 'Phenylalanine derivative', schedule: 'IV (US)',
  tags: ['stimulant', 'eugeroic', 'dopamine-reuptake-inhibitor', 'norepinephrine-reuptake-inhibitor',
         'mao-contraindicated', 'hypertensive-risk', 'renally-cleared'],
  toleranceGroup: 'modafinil', toleranceHalfLifeDays: 6,
  mechanism: 'A dopamine and noradrenaline reuptake inhibitor approved in 2019 for narcolepsy and sleep apnoea sleepiness. Unusually for a wake-promoting agent it is cleared almost entirely by the kidney, so it has essentially no CYP interactions.',
  halfLife: { hours: 7, range: [6, 8], confidence: 'measured' },
  metabolism: {
    firstPass: 'Minimal; oral bioavailability ~95%.',
    pathways: [
      { enzyme: 'None (renal excretion)', reaction: 'Excreted unchanged', product: 'Solriamfetol', fraction: 0.95,
        note: 'Over 90% leaves unchanged in urine. No meaningful CYP metabolism, so no CYP interactions — but dose reduction is required in renal impairment.' }
    ],
    metabolites: [{ name: 'None significant', active: false, note: 'Essentially not metabolised.' }],
    substrateOf: [], inhibits: [],
    excretion: 'Renal, >90% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 180], durationH: [8, 14], afterEffectsH: [2, 8], bioavailability: 0.95,
      doses: { threshold: 37.5, light: [37.5, 75], common: [75, 150], strong: [150, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Contraindicated with MAOIs, and within 14 days of stopping one — hypertensive crisis.',
    'Dose-dependent rise in blood pressure and heart rate; additive with other stimulants.'
  ],
  sources: ['DrugBank DB11774', 'FDA Sunosi approval 2019']
},

{
  id: 'pemoline', name: 'Pemoline', aliases: ['cylert', 'volital'],
  class: 'Stimulant', family: 'Oxazolidinone', schedule: 'IV (US, withdrawn)',
  tags: ['stimulant', 'dopamine-reuptake-inhibitor', 'hepatotoxic', 'withdrawn', 'long-duration'],
  toleranceGroup: 'methylphenidate', toleranceHalfLifeDays: 5,
  mechanism: 'A long-acting dopaminergic stimulant once used for ADHD and narcolepsy, with an unusually gradual onset. Withdrawn in 2005 after cases of acute liver failure.',
  halfLife: { hours: 12, range: [7, 14], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Hepatic oxidation', reaction: 'Oxidation and conjugation', product: 'Pemoline conjugates', fraction: 0.5,
        note: 'The precise route is poorly characterised, which is part of why the hepatotoxicity was never fully explained.' },
      { enzyme: 'None (renal)', reaction: 'Excreted unchanged', product: 'Pemoline', fraction: 0.4 }
    ],
    metabolites: [{ name: 'Pemoline conjugates', active: false, halfLifeH: 14, fraction: 0.5 }],
    substrateOf: [], excretion: 'Renal, ~40% unchanged.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [120, 240], durationH: [8, 12], afterEffectsH: [4, 12], bioavailability: 0.9,
      doses: { threshold: 9.375, light: [18.75, 37.5], common: [37.5, 75], strong: [75, 112.5], heavy: 112.5, unit: 'mg' } }
  },
  warnings: [
    'Withdrawn worldwide for idiosyncratic acute liver failure — deaths and transplants occurred, sometimes months into treatment and without warning.',
    'Do not combine with anything else hepatotoxic. There is no reason to choose it over available alternatives.'
  ],
  sources: ['FDA withdrawal 2005', 'Marotta & Roberts 1998, J Pediatr']
},

{
  id: 'fenethylline', name: 'Fenethylline', aliases: ['captagon', 'amfetyline'],
  class: 'Stimulant', family: 'Amphetamine-theophylline prodrug', schedule: 'I (US)',
  tags: ['stimulant', 'prodrug', 'dopamine-releaser', 'adenosine-antagonist',
         'mao-contraindicated', 'hypertensive-risk', 'addictive'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 5,
  mechanism: 'A covalent prodrug joining amphetamine to theophylline. It splits in the liver into both — so a dose delivers a stimulant and a xanthine simultaneously. Originally marketed for ADHD, now made illicitly at enormous scale as "Captagon", primarily in the Middle East.',
  halfLife: { hours: 8, range: [5, 14], confidence: 'estimated',
    notes: 'The parent cleaves quickly; the meaningful kinetics are amphetamine (~11 h) and theophylline (~8 h) together.' },
  metabolism: {
    firstPass: 'Extensive and necessary — the cleavage is what activates it.',
    pathways: [
      { enzyme: 'Hepatic esterase / CYP', reaction: 'Cleavage of the theophylline-amphetamine bond', product: 'Amphetamine + theophylline', fraction: 0.75,
        note: 'Roughly 25% becomes amphetamine and 14% theophylline; the slow cleavage gives a gentler onset than amphetamine itself.' },
      { enzyme: 'CYP2D6', reaction: 'Downstream amphetamine metabolism', product: '4-Hydroxyamphetamine', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Amphetamine', active: true, halfLifeH: 11, potencyRel: 4, fraction: 0.25, note: 'The main stimulant effect.' },
      { name: 'Theophylline', active: true, halfLifeH: 8, potencyRel: 0.3, fraction: 0.14,
        note: 'Adds bronchodilation, adenosine antagonism and cardiac stimulation — and its own narrow therapeutic index.' }
    ],
    substrateOf: ['CYP2D6', 'CYP1A2'], excretion: 'Renal, pH-dependent.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [8, 14], afterEffectsH: [6, 24], bioavailability: 0.8,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 350], heavy: 350, unit: 'mg' } }
  },
  warnings: [
    'Illicit "Captagon" tablets usually contain little or no fenethylline — most are amphetamine or methamphetamine with caffeine, so the label tells you nothing about what you have.',
    'Delivers theophylline as well as amphetamine, adding cardiac stimulation and a drug with a genuinely narrow therapeutic index.',
    'Contraindicated with MAOIs.'
  ],
  sources: ['EMCDDA Captagon report', 'Kristen et al. 1986, Arch Toxicol']
},

{
  id: 'dmaa', name: 'DMAA', aliases: ['1,3-dimethylamylamine', 'methylhexanamine', 'geranium extract'],
  class: 'Stimulant', family: 'Aliphatic amine', schedule: 'Banned as a supplement (US/UK/EU); WADA-banned',
  tags: ['stimulant', 'sympathomimetic', 'norepinephrine-releaser', 'vasoconstrictor',
         'hypertensive-risk', 'cardiotoxic', 'mao-contraindicated', 'wada-banned'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 3,
  mechanism: 'A simple aliphatic amine sold for years in pre-workout and weight-loss supplements, falsely marketed as a natural geranium constituent. A noradrenaline releaser with strong vasoconstrictive and pressor effects and little CNS subtlety.',
  halfLife: { hours: 8, range: [5, 12], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP2E1', reaction: 'Hydroxylation of the alkyl chain', product: 'Hydroxy-DMAA', fraction: 0.35 },
      { enzyme: 'None (renal)', reaction: 'Excreted unchanged', product: 'DMAA', fraction: 0.4, note: 'pH-dependent, like other amines.' }
    ],
    metabolites: [{ name: 'Hydroxy-DMAA', active: false, halfLifeH: 9, fraction: 0.35 }],
    substrateOf: ['CYP2D6', 'CYP2E1'], excretion: 'Renal, substantial unchanged fraction.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [4, 8], afterEffectsH: [3, 10], bioavailability: 0.85,
      doses: { threshold: 10, light: [20, 40], common: [40, 75], strong: [75, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Banned as a supplement ingredient after deaths from cerebral haemorrhage and cardiac arrest — including in young soldiers during exercise. The combination of DMAA, caffeine and exertion is specifically implicated.',
    'Causes severe blood pressure spikes. Do not combine with other stimulants or with strenuous exercise.',
    'MAOI-contraindicated. WADA-banned.'
  ],
  sources: ['FDA DMAA warnings', 'Eliason et al. 2012, J Clin Pharmacol']
},

{
  id: 'bromantane', name: 'Bromantane', aliases: ['ladasten', 'bromantan'],
  class: 'Stimulant', family: 'Adamantane', schedule: 'Rx in Russia; WADA-banned',
  tags: ['stimulant', 'actoprotector', 'anxiolytic', 'dopaminergic', 'wada-banned', 'long-duration'],
  toleranceGroup: 'bromantane', toleranceHalfLifeDays: 5,
  mechanism: 'A Soviet-developed "actoprotector" — an atypical stimulant that works by upregulating dopamine SYNTHESIS (increasing tyrosine hydroxylase and DDC expression) rather than by releasing or blocking reuptake. That gives a slow, gentle, non-jittery stimulation with anxiolytic rather than anxiogenic character, and little rebound.',
  halfLife: { hours: 11, range: [8, 16], confidence: 'measured',
    notes: 'Effects build over days of repeated dosing because the mechanism is transcriptional rather than immediate.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'Hydroxylation of the adamantane cage', product: 'Hydroxybromantane', fraction: 0.4 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Hydroxybromantane', active: false, halfLifeH: 12, fraction: 0.4 }],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal and biliary.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [180, 360], durationH: [8, 16], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 25, light: [50, 100], common: [100, 150], strong: [150, 250], heavy: 250, unit: 'mg' } }
  },
  warnings: [
    'WADA-banned — it caused a doping scandal at the 1996 Olympics.',
    'Because it acts on dopamine synthesis rather than release, its effects accumulate over days; dosing daily to the same felt effect can overshoot.'
  ],
  sources: ['Morozov et al. 1999', 'Russian prescribing literature']
},

{
  id: 'naphyrone', name: 'Naphyrone', aliases: ['naphthylpyrovalerone', 'nrg-1'],
  class: 'Stimulant', family: 'Cathinone (pyrovalerone)', schedule: 'Class B (UK); varies',
  tags: ['stimulant', 'research-chemical', 'dopamine-reuptake-inhibitor', 'serotonin-reuptake-inhibitor',
         'compulsive-redosing', 'hyperthermia-risk', 'highly-addictive', 'long-duration'],
  toleranceGroup: 'cathinone-stim', toleranceHalfLifeDays: 4,
  mechanism: 'A naphthyl pyrovalerone — a triple reuptake inhibitor blocking dopamine, noradrenaline AND serotonin transporters, unusual for this family. Sold as "NRG-1" after the UK mephedrone ban.',
  halfLife: { hours: 6, range: [3, 10], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Pyrrolidine ring oxidation', product: '2-oxo-naphyrone', fraction: 0.35 },
      { enzyme: 'CYP2C19', reaction: 'Ketone reduction', product: 'Dihydronaphyrone', fraction: 0.25 },
      { enzyme: 'CYP3A4', reaction: 'Naphthyl hydroxylation', product: 'Hydroxynaphyrone', fraction: 0.2 }
    ],
    metabolites: [
      { name: '2-oxo-naphyrone', active: false, halfLifeH: 8, fraction: 0.35 },
      { name: 'Dihydronaphyrone', active: false, halfLifeH: 7, fraction: 0.25 }
    ],
    substrateOf: ['CYP2D6', 'CYP2C19', 'CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [4, 8], afterEffectsH: [6, 24], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Much longer-acting than most cathinones and a serotonin releaser as well — so hyperthermia and serotonergic risk are added to the usual pyrovalerone compulsion.',
    'MAOI-contraindicated.'
  ],
  sources: ['Meltzer et al. 2006, J Med Chem', 'ACMD naphyrone report 2010']
}

]);
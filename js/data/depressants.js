/* Depressants — alcohol, benzodiazepines, z-drugs, GHB family, barbiturates */
DB.register([

{
  id: 'alcohol', name: 'Alcohol', aliases: ['ethanol', 'booze', 'etoh', 'beer', 'wine', 'spirits'],
  class: 'Depressant', family: 'Alcohol', schedule: 'Legal (age-restricted)',
  tags: ['depressant', 'cns-depressant', 'gaba-a-positive', 'nmda-antagonist', 'respiratory-depressant',
         'hepatotoxic', 'carcinogen', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'Positive allosteric modulator at GABA-A, NMDA antagonist, and modulator of glycine, nicotinic and 5-HT3 receptors. The breadth of targets is why nothing substitutes cleanly for it and why withdrawal is so dangerous.',
  halfLife: { hours: 1.0, confidence: 'measured',
    notes: 'Alcohol does NOT follow normal exponential decay. Elimination is zero-order (saturated) at any meaningful blood level — a fixed ~7-10 g per hour regardless of how much you have drunk. That is why "sleeping it off" scales linearly with amount and why the curve in this app is drawn as a straight-line decline rather than an exponential one.' },
  kinetics: { order: 'zero', mgPerHour: 8000, note: 'Roughly one standard drink (14 g) cleared per 1.5-2 h; equivalently ~0.015 %BAC per hour.' },
  metabolism: {
    firstPass: 'Significant gastric first-pass via gastric ADH, and notably lower in women — a genuine reason for different per-weight effects.',
    pathways: [
      { enzyme: 'ADH (alcohol dehydrogenase)', reaction: 'Oxidation to acetaldehyde', product: 'Acetaldehyde', fraction: 0.9,
        note: 'The rate-limiting, saturable step — this is what makes elimination zero-order. NAD+ availability caps the rate.' },
      { enzyme: 'ALDH2 (aldehyde dehydrogenase)', reaction: 'Oxidation of acetaldehyde', product: 'Acetate', fraction: 0.9,
        note: 'The ALDH2*2 variant, carried by ~40% of East Asians, is near-inactive. Acetaldehyde accumulates, causing the flushing reaction — and a markedly raised oesophageal cancer risk.' },
      { enzyme: 'CYP2E1', reaction: 'Microsomal oxidation', product: 'Acetaldehyde', fraction: 0.08,
        note: 'Induced by chronic drinking, which is part of metabolic tolerance. Also generates reactive oxygen species, contributing to liver damage and to paracetamol hepatotoxicity.' },
      { enzyme: 'Catalase', reaction: 'Peroxidative oxidation', product: 'Acetaldehyde', fraction: 0.02 }
    ],
    metabolites: [
      { name: 'Acetaldehyde', active: true, halfLifeH: 0.05, potencyRel: 0,
        note: 'Highly toxic, mutagenic and a Group 1 carcinogen. Responsible for flushing, nausea and much of the hangover. Disulfiram works by blocking its breakdown.' },
      { name: 'Acetate', active: false, note: 'Enters normal metabolism as acetyl-CoA; contributes to the calorie load.' }
    ],
    substrateOf: ['ADH', 'ALDH2', 'CYP2E1'],
    inhibits: ['CYP2E1', 'ADH'],
    induces: ['CYP2E1'],
    excretion: 'Hepatic ~90%; ~5-10% unchanged via breath, urine and sweat (the basis of breathalysers).',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [30, 90], durationH: [2, 5], afterEffectsH: [6, 18], bioavailability: 0.9,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 70], heavy: 70, unit: 'g',
        note: 'In grams of pure ethanol. One standard drink ≈ 14 g (US) / 10 g (UK, EU). A 330 ml 5% beer ≈ 13 g; a 175 ml glass of 12% wine ≈ 17 g; a 40 ml shot of 40% spirit ≈ 13 g.' } }
  },
  warnings: [
    'Combined with benzodiazepines, opioids, GHB or barbiturates, alcohol causes fatal respiratory depression. These are the most common fatal drug combinations in the world.',
    'With cocaine it forms cocaethylene, which is more cardiotoxic than either drug.',
    'Alcohol withdrawal in a physically dependent person can be fatal (seizures, delirium tremens). Unlike opioid withdrawal, it must not be stopped abruptly without medical supervision.',
    'Paracetamol/acetaminophen plus alcohol raises hepatotoxicity risk via CYP2E1 induction and glutathione depletion.',
    'Group 1 carcinogen; no consumption level is established as risk-free.'
  ],
  refs: ['Cederbaum 2012, Clin Liver Dis', 'Holford 1987, Clin Pharmacokinet']
},

{
  id: 'alprazolam', name: 'Alprazolam', aliases: ['xanax', 'xannies', 'bars'],
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'anxiolytic', 'addictive', 'withdrawal-dangerous', 'cyp3a4-substrate'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Positive allosteric modulator at the benzodiazepine site of GABA-A receptors, increasing chloride channel opening frequency. High potency and fast onset give it particularly high abuse liability among benzodiazepines.',
  halfLife: { hours: 11, range: [6, 27], confidence: 'measured',
    notes: 'Longer in obesity, hepatic impairment, elderly patients and people of Asian descent (~25% longer). The short subjective duration relative to the half-life is a major driver of inter-dose rebound anxiety.' },
  metabolism: {
    firstPass: 'Modest; oral bioavailability ~90%.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxyalprazolam', fraction: 0.5,
        note: 'Dominant route. CYP3A4 inhibitors — grapefruit juice, ketoconazole, clarithromycin, ritonavir, nefazodone — can double or triple exposure. This is a clinically significant and frequently overlooked interaction.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: '4-Hydroxyalprazolam', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Inactive conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'α-Hydroxyalprazolam', active: true, halfLifeH: 11, potencyRel: 0.5,
        note: 'Active, roughly half as potent, present at low plasma levels — a modest contributor to total effect.' },
      { name: '4-Hydroxyalprazolam', active: true, potencyRel: 0.1 }
    ],
    substrateOf: ['CYP3A4'], inhibits: [],
    excretion: 'Renal, as conjugated metabolites; <20% unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 40], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [6, 12], bioavailability: 0.9,
      doses: { threshold: 0.25, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } },
    sublingual: { onsetMin: [10, 25], peakMin: [40, 80], durationH: [4, 6], afterEffectsH: [6, 12], bioavailability: 0.9,
      doses: { threshold: 0.25, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: [
    'With opioids or alcohol, benzodiazepines cause fatal respiratory depression. The great majority of benzodiazepine deaths involve such a combination.',
    'Anterograde amnesia at recreational doses means people redose without remembering — the classic mechanism of accidental benzodiazepine overdose. Pre-measuring doses is the standard mitigation.',
    'Abrupt withdrawal after sustained use can cause seizures and death. Tapering is mandatory, never cold turkey.',
    'Counterfeit "Xanax" pressed pills very often contain a novel benzodiazepine or fentanyl instead.'
  ],
  refs: ['DrugBank DB00404', 'Greenblatt & Wright 1993, Clin Pharmacokinet']
},

{
  id: 'diazepam', name: 'Diazepam', aliases: ['valium', 'vals'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'muscle-relaxant', 'anticonvulsant', 'addictive', 'withdrawal-dangerous', 'long-duration'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'GABA-A positive allosteric modulator. Long-acting, with active metabolites that extend duration enormously — the reason it is the standard agent for benzodiazepine and alcohol withdrawal tapers.',
  halfLife: { hours: 43, range: [20, 100], confidence: 'measured',
    notes: 'The parent half-life understates the picture badly: its metabolite nordazepam has a half-life of up to 100 h and accumulates over days. Total functional duration after repeated dosing is measured in weeks, and can exceed 200 h in the elderly.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'N-demethylation', product: 'Nordazepam (desmethyldiazepam)', fraction: 0.5,
        note: 'CYP2C19 poor metabolisers (~15-20% of East Asians, 3-5% of Europeans) clear it far more slowly and accumulate more nordazepam.' },
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: 'Temazepam', fraction: 0.3 },
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'Hydroxylation of nordazepam', product: 'Oxazepam', fraction: 0.3 },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation of oxazepam', product: 'Oxazepam glucuronide', fraction: 0.9 }
    ],
    metabolites: [
      { name: 'Nordazepam', active: true, halfLifeH: 80, potencyRel: 0.5,
        note: 'Long-lived active metabolite — half-life 36-100 h. Its accumulation is what gives diazepam its self-tapering property.' },
      { name: 'Temazepam', active: true, halfLifeH: 10, potencyRel: 0.8, note: 'Active; a marketed hypnotic in its own right.' },
      { name: 'Oxazepam', active: true, halfLifeH: 8, potencyRel: 0.6, note: 'Active; also marketed separately. Terminal active metabolite.' }
    ],
    substrateOf: ['CYP2C19', 'CYP3A4', 'UGT2B15'], inhibits: [],
    excretion: 'Renal, as oxazepam glucuronide; <1% unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [5, 8], afterEffectsH: [12, 48], bioavailability: 0.94,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } },
    rectal: { onsetMin: [5, 15], peakMin: [20, 45], durationH: [5, 8], afterEffectsH: [12, 48], bioavailability: 0.9,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } },
    /* The clinical route, for status epilepticus and acute sedation. Peak
       brain concentration arrives within a couple of minutes, but the effect
       is SHORTER than oral rather than longer: diazepam is highly lipophilic,
       so an intravenous bolus redistributes out of the brain into fat within
       20-60 minutes, long before elimination has done anything. The 43 h
       half-life still governs how long it is in the body, and nordazepam
       still accumulates exactly as it does orally. */
    iv: { onsetMin: [0.5, 3], peakMin: [2, 6], durationH: [2, 5], afterEffectsH: [12, 48], bioavailability: 1.0,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'Fatal with opioids or alcohol via respiratory depression.',
    'Metabolites accumulate for a week or more with daily use — the effect on day 7 is much larger than on day 1.',
    'Withdrawal can be fatal; taper under supervision.'
  ],
  refs: ['DrugBank DB00829', 'Greenblatt et al. 1989, Clin Pharmacokinet']
},

{
  id: 'clonazepam', name: 'Clonazepam', aliases: ['klonopin', 'rivotril', 'kpins'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'anticonvulsant', 'amnestic', 'addictive', 'withdrawal-dangerous', 'long-duration'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'High-potency, long-acting GABA-A positive allosteric modulator with strong anticonvulsant activity.',
  halfLife: { hours: 35, range: [19, 60], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Nitro group reduction', product: '7-Aminoclonazepam', fraction: 0.7,
        note: 'Main route; the product is inactive but is the standard urinary marker.' },
      { enzyme: 'NAT2', reaction: 'Acetylation', product: '7-Acetamidoclonazepam', fraction: 0.2 },
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: '3-Hydroxyclonazepam', fraction: 0.1 }
    ],
    metabolites: [
      { name: '7-Aminoclonazepam', active: false, halfLifeH: 30, note: 'Inactive; detected in urine for up to 2 weeks.' },
      { name: '7-Acetamidoclonazepam', active: false }
    ],
    substrateOf: ['CYP3A4', 'NAT2'], excretion: 'Renal, <2% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [6, 12], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 0.25, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } },
    /* Sublingual clonazepam is a marketed formulation (wafers and orally
       disintegrating tablets), and the comparative studies are clear about
       what it buys: total exposure is the same as swallowing it, because
       clonazepam has little first-pass loss to avoid in the first place. What
       changes is the onset, not the strength. Roughly 70% of what is absorbed
       across the mucosa skips the portal circulation, which shows up as less
       7-aminoclonazepam formed before the parent ever reaches the blood. */
    sublingual: { onsetMin: [10, 30], peakMin: [40, 120], durationH: [6, 12], afterEffectsH: [12, 36], bioavailability: 0.93,
      doses: { threshold: 0.25, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Long half-life means daily use accumulates substantially. Withdrawal can be fatal.'],
  refs: ['DrugBank DB01068']
},

{
  id: 'lorazepam', name: 'Lorazepam', aliases: ['ativan'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Intermediate-acting GABA-A positive allosteric modulator with strong amnestic properties.',
  halfLife: { hours: 14, range: [10, 20], confidence: 'measured' },
  metabolism: {
    firstPass: 'Modest; oral bioavailability ~93%.',
    pathways: [
      { enzyme: 'UGT2B15', reaction: 'Direct glucuronidation', product: 'Lorazepam glucuronide', fraction: 0.95,
        note: 'CLINICALLY IMPORTANT: lorazepam bypasses CYP entirely. It is therefore unaffected by CYP3A4 inhibitors and remains safe in liver disease, which is why it (with oxazepam and temazepam) is preferred in hepatic impairment and the elderly.' }
    ],
    metabolites: [{ name: 'Lorazepam glucuronide', active: false, halfLifeH: 18, note: 'Inactive — no active metabolites at all, which is part of its predictability.' }],
    substrateOf: ['UGT2B15'], inhibits: [],
    excretion: 'Renal, ~75% as the glucuronide.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [90, 150], durationH: [6, 10], afterEffectsH: [8, 24], bioavailability: 0.93,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } },
    sublingual: { onsetMin: [10, 30], peakMin: [45, 90], durationH: [6, 10], afterEffectsH: [8, 24], bioavailability: 0.94,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Withdrawal can be fatal.'],
  refs: ['DrugBank DB00186']
},

{
  id: 'etizolam', name: 'Etizolam', aliases: ['etilaam', 'etizest'],
  class: 'Depressant', family: 'Thienodiazepine', schedule: 'Varies; prescription in JP/IT/IN',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'Thienodiazepine — the benzene ring is replaced by thiophene, but the pharmacology is standard GABA-A positive allosteric modulation. Roughly 10x the potency of diazepam by weight.',
  halfLife: { hours: 3.4, range: [3, 6], confidence: 'measured',
    notes: 'The parent is short-acting, but the active metabolite α-hydroxyetizolam has an 8+ hour half-life and carries much of the total effect.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the methyl group', product: 'α-Hydroxyetizolam', fraction: 0.5,
        note: 'Produces a fully active metabolite that outlasts the parent — hence the long hangover.' },
      { enzyme: 'CYP2C19', reaction: 'Hydroxylation', product: '8-Hydroxyetizolam', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'α-Hydroxyetizolam', active: true, halfLifeH: 8.2, potencyRel: 1.0,
        note: 'Equipotent to etizolam with more than twice the half-life. Most of the next-day impairment comes from this.' },
      { name: '8-Hydroxyetizolam', active: true, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 120], durationH: [5, 8], afterEffectsH: [8, 20], bioavailability: 0.93,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'Fatal with opioids or alcohol.',
    'Widely sold as an unregulated research chemical with inconsistent dosing; pellets have been found at multiples of their stated strength.',
    'Tolerance builds unusually fast and withdrawal is severe.'
  ],
  refs: ['Fracasso et al. 1991, Eur J Clin Pharmacol', 'EMCDDA etizolam report']
},

{
  id: 'clonazolam', name: 'Clonazolam', aliases: ['clam', 'clonitrazolam'],
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Triazolo-analogue of clonazepam and one of the most potent benzodiazepines known — active well below 1 mg, with reports of strong effects from 0.5 mg.',
  halfLife: { hours: 30, range: [20, 60], confidence: 'estimated', notes: 'No formal human PK; estimated from case reports and analogue data.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Nitro reduction', product: '7-Aminoclonazolam', fraction: 0.6, note: 'Inferred from clonazepam; the product is the main urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxyclonazolam', fraction: 0.2, note: 'Presumed active.' }
    ],
    metabolites: [
      { name: '7-Aminoclonazolam', active: false, halfLifeH: 40 },
      { name: 'α-Hydroxyclonazolam', active: true, halfLifeH: 25, potencyRel: 0.5 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [8, 14], afterEffectsH: [12, 48], bioavailability: 0.9,
      doses: { threshold: 0.05, light: [0.1, 0.25], common: [0.25, 0.5], strong: [0.5, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: [
    'Active in the tens of micrograms. Accurate dosing requires volumetric solution — powder cannot be measured safely on consumer scales, and this has caused many hospitalisations.',
    'Produces profound amnesia and blackout redosing at doses that feel mild at onset. Loss of a full day is a routine outcome.',
    'Fatal with opioids or alcohol. Extremely rapid tolerance and dependence; withdrawal can be fatal.'
  ],
  refs: ['Huppertz et al. 2018, Forensic Toxicol', 'EMCDDA risk assessments']
},

{
  id: 'flualprazolam', name: 'Flualprazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'addictive', 'withdrawal-dangerous', 'long-duration'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'Fluorinated alprazolam analogue; substantially more potent and much longer-acting than alprazolam.',
  halfLife: { hours: 40, range: [25, 70], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxyflualprazolam', fraction: 0.5, note: 'By analogy with alprazolam; active.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'α-Hydroxyflualprazolam', active: true, halfLifeH: 35, potencyRel: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [10, 18], afterEffectsH: [18, 48], bioavailability: 0.9,
      doses: { threshold: 0.05, light: [0.1, 0.25], common: [0.25, 0.5], strong: [0.5, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: [
    'Heavily implicated in overdose deaths worldwide, usually alongside opioids. It is a very common adulterant in counterfeit alprazolam pills.',
    'Impairment lasting more than 24 hours is typical — driving the next day is genuinely unsafe.'
  ],
  refs: ['Łukasik-Głębocka et al. 2016', 'NPS Discovery reports 2019-2022']
},

{
  id: 'bromazolam', name: 'Bromazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Brominated alprazolam analogue of broadly similar potency; since roughly 2021 it has been the most commonly detected designer benzodiazepine in seized counterfeit tablets.',
  halfLife: { hours: 14, range: [10, 20], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxybromazolam', fraction: 0.5 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.35 }
    ],
    metabolites: [{ name: 'α-Hydroxybromazolam', active: true, halfLifeH: 15, potencyRel: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 120], durationH: [6, 12], afterEffectsH: [12, 24], bioavailability: 0.9,
      doses: { threshold: 0.1, light: [0.25, 0.5], common: [0.5, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'Extremely common in counterfeit Xanax bars, frequently alongside fentanyl. A pressed pill of unknown origin should be assumed to contain both.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['NPS Discovery / CFSRE reports 2022-2024']
},

{
  id: 'zolpidem', name: 'Zolpidem', aliases: ['ambien', 'stilnox'],
  class: 'Depressant', family: 'Imidazopyridine (Z-drug)', schedule: 'IV (US)',
  tags: ['depressant', 'gaba-a-positive', 'hypnotic', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'parasomnia-risk', 'addictive'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'Selective for α1-containing GABA-A receptors, giving sedation with relatively little anxiolysis or muscle relaxation. That selectivity is also why it produces such distinctive parasomnias.',
  halfLife: { hours: 2.5, range: [1.5, 4.5], confidence: 'measured',
    notes: 'Approximately 50% longer in women, which led the FDA to halve the recommended dose for women in 2013 — one of very few sex-specific dosing changes in medicine.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation of the methyl groups', product: 'Carboxylic acid metabolites', fraction: 0.61 },
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation', product: 'Hydroxy metabolites', fraction: 0.22 },
      { enzyme: 'CYP1A2', reaction: 'Oxidation', product: 'Oxidised metabolites', fraction: 0.14 }
    ],
    metabolites: [{ name: 'Zolpidem phenyl-4-carboxylic acid', active: false, note: 'All zolpidem metabolites are inactive.' }],
    substrateOf: ['CYP3A4', 'CYP2C9', 'CYP1A2'], excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [45, 90], durationH: [3, 6], afterEffectsH: [4, 10], bioavailability: 0.7,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Complex sleep behaviours — sleepwalking, sleep-driving, sleep-eating with no memory of them — carry an FDA boxed warning. Taking it and then staying awake makes them much more likely.',
    'Powerful anterograde amnesia; redosing while amnesic is a common overdose route.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['DrugBank DB00425', 'FDA Drug Safety Communication 2013']
},

{
  id: 'ghb', name: 'GHB', aliases: ['g', 'gamma-hydroxybutyrate', 'xyrem', 'liquid ecstasy'],
  class: 'Depressant', family: 'GHB', schedule: 'I (III as Xyrem, US)',
  tags: ['depressant', 'gaba-b-agonist', 'cns-depressant', 'respiratory-depressant', 'amnestic',
         'steep-dose-response', 'addictive', 'withdrawal-dangerous', 'nonlinear-pk'],
  toleranceGroup: 'ghb', toleranceHalfLifeDays: 2,
  mechanism: 'GABA-B receptor agonist and agonist at the distinct GHB receptor. It is also an endogenous neurotransmitter, which is why exogenous doses interact with normal metabolism so directly.',
  halfLife: { hours: 0.5, range: [0.3, 1], confidence: 'measured',
    notes: 'CRITICAL: GHB has saturable, zero-order kinetics at recreational doses. Its clearance enzymes are overwhelmed, so doubling the dose more than doubles both the peak and the duration. Combined with a very steep dose-response curve, this is why the gap between a good dose and unconsciousness can be as little as half a millilitre.' },
  kinetics: { order: 'zero', mgPerHour: 2500, note: 'Saturable elimination; the model draws a linear decline rather than an exponential one.' },
  metabolism: {
    firstPass: 'Substantial and saturable; oral bioavailability ~25% at low doses, rising with dose as the enzymes saturate.',
    pathways: [
      { enzyme: 'GHB dehydrogenase (ADHFe1)', reaction: 'Oxidation to succinic semialdehyde', product: 'Succinic semialdehyde', fraction: 0.7,
        note: 'The rate-limiting, saturable step responsible for the non-linear kinetics.' },
      { enzyme: 'SSADH (ALDH5A1)', reaction: 'Oxidation to succinate', product: 'Succinate', fraction: 0.7,
        note: 'Succinate then enters the Krebs cycle and is fully metabolised — GHB is ultimately burned as fuel and exhaled as CO2.' },
      { enzyme: 'β-oxidation', reaction: 'Mitochondrial β-oxidation', product: 'CO2 + water', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Succinic semialdehyde', active: false },
      { name: 'Succinate → CO2', active: false, note: 'Terminal. Over 95% of a dose leaves as exhaled carbon dioxide, which is why GHB is so hard to detect — it is undetectable in urine after about 12 hours.' }
    ],
    substrateOf: ['ADHFe1', 'ALDH5A1'], inhibits: [],
    excretion: 'Pulmonary as CO2 (>95%); <5% renal unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 25], peakMin: [25, 50], durationH: [1.5, 3], afterEffectsH: [1, 4], bioavailability: 0.25,
      doses: { threshold: 0.5, light: [0.7, 1.2], common: [1.2, 2.2], strong: [2.2, 3], heavy: 3, unit: 'g',
        note: 'In grams of GHB (sodium salt). Doses are usually measured in ml of a solution of unknown concentration, which is the core danger.' } }
  },
  warnings: [
    'The margin between a recreational dose and unconsciousness with respiratory depression is extremely narrow — often a factor of two or less. Overdose looks like sudden deep unrousable sleep, sometimes with vomiting and seizure-like movements.',
    'With alcohol or any other depressant, that already narrow margin collapses. The great majority of GHB deaths involve alcohol.',
    'Never redose before 2 hours have passed — the flat, delayed peak causes people to redose into an overdose.',
    'Physical dependence can develop within weeks of round-the-clock dosing, and GHB withdrawal is a medical emergency with a delirium and mortality profile resembling severe alcohol withdrawal.',
    'Always measure in a syringe, never by eye or by capful.'
  ],
  refs: ['Brenneisen et al. 2004, J Anal Toxicol', 'Abanades et al. 2006, Ann NY Acad Sci']
},

{
  id: 'gbl', name: 'GBL', aliases: ['gamma-butyrolactone'],
  class: 'Depressant', family: 'GHB prodrug', schedule: 'Controlled as a GHB analogue',
  tags: ['depressant', 'gaba-b-agonist', 'prodrug', 'cns-depressant', 'respiratory-depressant',
         'steep-dose-response', 'addictive', 'withdrawal-dangerous', 'corrosive'],
  toleranceGroup: 'ghb', toleranceHalfLifeDays: 2,
  mechanism: 'Lactone prodrug rapidly hydrolysed to GHB by blood lactonase. Faster onset and higher bioavailability than GHB itself, so it is more potent by volume.',
  halfLife: { hours: 0.5, range: [0.3, 1], confidence: 'measured', notes: 'GBL itself converts within minutes; the meaningful kinetics are GHB\'s.' },
  kinetics: { order: 'zero', mgPerHour: 2500 },
  metabolism: {
    pathways: [
      { enzyme: 'Serum paraoxonase (PON1) / lactonase', reaction: 'Lactone ring hydrolysis', product: 'GHB', fraction: 1.0,
        note: 'Near-instant in blood. Conversion is essentially complete, and 1 ml GBL yields roughly 1.6 g GHB equivalent.' },
      { enzyme: 'GHB dehydrogenase', reaction: 'Downstream GHB metabolism', product: 'Succinic semialdehyde', fraction: 0.7 }
    ],
    metabolites: [{ name: 'GHB', active: true, halfLifeH: 0.5, potencyRel: 1.0, note: 'The actual active drug.' }],
    substrateOf: ['PON1'], excretion: 'As CO2 via the GHB pathway.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [5, 15], peakMin: [15, 30], durationH: [1.5, 3], afterEffectsH: [1, 4], bioavailability: 0.9,
      doses: { threshold: 0.3, light: [0.5, 0.8], common: [0.8, 1.5], strong: [1.5, 2.2], heavy: 2.2, unit: 'ml' } }
  },
  warnings: [
    'More potent by volume than GHB and faster in onset, so doses that would be safe as GHB are not as GBL. Roughly 1 ml GBL ≈ 1.6 g GHB.',
    'GBL is a solvent (industrial paint stripper) and is corrosive — it must be diluted before drinking or it burns the mouth and oesophagus.',
    'Same lethal interaction with alcohol as GHB; same medical-emergency withdrawal.'
  ],
  refs: ['Lenz et al. 2009, Anal Bioanal Chem']
},

{
  id: 'phenibut', name: 'Phenibut', aliases: ['fenibut', 'noofen', 'β-phenyl-gaba'],
  class: 'Depressant', family: 'GABA analogue', schedule: 'Unscheduled in US; banned in AU/some EU',
  tags: ['depressant', 'gaba-b-agonist', 'anxiolytic', 'cns-depressant', 'nootropic',
         'addictive', 'withdrawal-dangerous', 'long-duration'],
  toleranceGroup: 'gaba-b', toleranceHalfLifeDays: 3,
  mechanism: 'GABA-B receptor agonist (like baclofen) plus α2δ voltage-gated calcium channel block (like gabapentin). The combination produces strong anxiolysis and sociability with a very slow onset.',
  halfLife: { hours: 5.3, range: [4, 6], confidence: 'measured',
    notes: 'The slow onset (2-4 hours) relative to a moderate half-life is the central hazard — people redose long before the first dose has peaked.' },
  metabolism: {
    firstPass: 'Low; the molecule is largely resistant to hepatic metabolism.',
    pathways: [
      { enzyme: 'Minimal hepatic metabolism', reaction: 'Little to no biotransformation', product: 'Unchanged phenibut', fraction: 0.95,
        note: 'Around 95% is excreted unchanged by the kidneys. There are therefore essentially no CYP interactions, but renal impairment prolongs it markedly.' }
    ],
    metabolites: [{ name: 'None significant', active: false, note: 'Excreted essentially unchanged.' }],
    substrateOf: [], inhibits: [],
    excretion: 'Renal, ~95% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [120, 240], peakMin: [240, 360], durationH: [8, 15], afterEffectsH: [6, 24], bioavailability: 0.63,
      doses: { threshold: 100, light: [250, 500], common: [500, 1000], strong: [1000, 2000], heavy: 2000, unit: 'mg' } }
  },
  warnings: [
    'The 2-4 hour onset is the main cause of overdose — never redose within 6 hours.',
    'Dependence forms fast (sometimes within 2 weeks of daily use) and phenibut withdrawal is severe: psychosis, hallucinations, seizures and week-long insomnia are documented. It requires a slow taper, sometimes with medical support.',
    'Widely sold as a legal "nootropic supplement", which badly understates its dependence liability.',
    'Additive and dangerous with alcohol, benzodiazepines and opioids.'
  ],
  refs: ['Lapin 2001, CNS Drug Rev', 'Owen et al. 2016, Drug Alcohol Rev']
},

{
  id: 'phenobarbital', name: 'Phenobarbital', aliases: ['luminal', 'phenobarbitone'],
  class: 'Depressant', family: 'Barbiturate', schedule: 'IV (US)',
  tags: ['depressant', 'barbiturate', 'gaba-a-direct', 'cns-depressant', 'respiratory-depressant',
         'anticonvulsant', 'narrow-therapeutic-index', 'addictive', 'withdrawal-dangerous',
         'long-duration', 'enzyme-inducer'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 10,
  mechanism: 'Directly opens GABA-A chloride channels at higher doses rather than merely modulating them. This lack of a ceiling is exactly why barbiturates are so much deadlier in overdose than benzodiazepines.',
  halfLife: { hours: 79, range: [53, 118], confidence: 'measured', notes: 'Very long; steady state takes 2-3 weeks.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Aromatic hydroxylation', product: 'p-Hydroxyphenobarbital', fraction: 0.5, note: 'Main route; CYP2C19 and CYP2E1 contribute.' },
      { enzyme: 'UGT', reaction: 'N-glucosidation', product: 'Phenobarbital N-glucoside', fraction: 0.25 }
    ],
    metabolites: [{ name: 'p-Hydroxyphenobarbital', active: false }],
    substrateOf: ['CYP2C9', 'CYP2C19', 'CYP2E1'],
    inhibits: [],
    induces: ['CYP3A4', 'CYP2C9', 'CYP1A2', 'CYP2C19', 'UGT'],
    excretion: 'Renal, 20-50% unchanged; alkalinisation speeds elimination and is used in overdose treatment.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [120, 480], durationH: [10, 16], afterEffectsH: [24, 72], bioavailability: 0.9,
      doses: { threshold: 15, light: [30, 60], common: [60, 120], strong: [120, 200], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'No ceiling on respiratory depression and a narrow therapeutic index — barbiturate overdose is far more often fatal than benzodiazepine overdose, and there is no reversal agent equivalent to flumazenil.',
    'A powerful broad-spectrum enzyme inducer: it accelerates clearance of oral contraceptives, warfarin, many antiretrovirals and most other drugs. This is one of the most consequential interaction profiles in medicine.',
    'Withdrawal can be fatal.'
  ],
  refs: ['DrugBank DB01174']
}

]);

/* Depressants — second wave: further benzodiazepines, z-drugs, GHB family, gabapentinoids */
DB.register([

{
  id: 'temazepam', name: 'Temazepam', aliases: ['restoril', 'normison'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'amnestic', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Intermediate-acting GABA-A positive allosteric modulator used as a hypnotic. Also an active metabolite of diazepam.',
  halfLife: { hours: 10, range: [8, 15], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Direct glucuronidation', product: 'Temazepam glucuronide', fraction: 0.9,
        note: 'Like lorazepam and oxazepam, temazepam bypasses CYP entirely — safe in liver impairment and free of CYP3A4 interactions.' },
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'Minor demethylation', product: 'Oxazepam', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Temazepam glucuronide', active: false },
      { name: 'Oxazepam', active: true, halfLifeH: 8, potencyRel: 0.7, note: 'Minor active metabolite.' }
    ],
    substrateOf: ['UGT2B7'], excretion: 'Renal, ~80% as the glucuronide.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [5, 8], afterEffectsH: [6, 14], bioavailability: 0.96,
      doses: { threshold: 5, light: [10, 15], common: [15, 30], strong: [30, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Withdrawal after sustained use can be fatal.'],
  refs: ['DrugBank DB00231']
},

{
  id: 'triazolam', name: 'Triazolam', aliases: ['halcion'],
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'amnestic', 'addictive', 'withdrawal-dangerous', 'cyp3a4-substrate'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'Very short-acting, high-potency GABA-A modulator. Its brevity and potency give it unusually strong amnestic effects.',
  halfLife: { hours: 2.5, range: [1.5, 5.5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxytriazolam', fraction: 0.8,
        note: 'Almost entirely CYP3A4-dependent, making triazolam the textbook victim of 3A4 inhibition — ketoconazole raises its exposure over tenfold. Contraindicated with strong 3A4 inhibitors.' }
    ],
    metabolites: [{ name: 'α-Hydroxytriazolam', active: true, halfLifeH: 4, potencyRel: 0.3 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [45, 90], durationH: [2, 5], afterEffectsH: [4, 10], bioavailability: 0.44,
      doses: { threshold: 0.0625, light: [0.125, 0.25], common: [0.25, 0.5], strong: [0.5, 0.75], heavy: 0.75, unit: 'mg' } }
  },
  warnings: [
    'Profound anterograde amnesia; historically associated with reports of complex sleep behaviours and next-day memory gaps.',
    'Strong CYP3A4 inhibitors (clarithromycin, ketoconazole, ritonavir, grapefruit) are contraindicated.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['DrugBank DB00897']
},

{
  id: 'midazolam', name: 'Midazolam', aliases: ['versed', 'dormicum'],
  class: 'Depressant', family: 'Benzodiazepine (imidazo)', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'anaesthetic-adjunct', 'addictive', 'cyp3a4-substrate'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'Water-soluble, very short-acting GABA-A modulator used for procedural sedation. Becomes lipophilic at physiological pH, giving fast CNS entry.',
  halfLife: { hours: 2.5, range: [1.5, 4], confidence: 'measured' },
  metabolism: {
    firstPass: 'Heavy; oral bioavailability ~36%. Midazolam is the standard clinical probe drug for measuring CYP3A4 activity.',
    pathways: [
      { enzyme: 'CYP3A4 / CYP3A5', reaction: '1\'-hydroxylation', product: '1\'-Hydroxymidazolam', fraction: 0.85,
        note: 'The reference CYP3A4 reaction. Any 3A4 inhibitor raises midazolam exposure dramatically.' },
      { enzyme: 'UGT2B4 / UGT2B7', reaction: 'Glucuronidation', product: '1\'-OH-midazolam glucuronide', fraction: 0.7 }
    ],
    metabolites: [{ name: '1\'-Hydroxymidazolam', active: true, halfLifeH: 1, potencyRel: 0.6,
      note: 'Active; its glucuronide accumulates in renal failure and causes prolonged sedation in intensive care.' }],
    substrateOf: ['CYP3A4', 'CYP3A5', 'UGT2B7'], excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 30], peakMin: [30, 60], durationH: [1, 3], afterEffectsH: [2, 6], bioavailability: 0.36,
      doses: { threshold: 2.5, light: [5, 7.5], common: [7.5, 15], strong: [15, 25], heavy: 25, unit: 'mg' } },
    im: { onsetMin: [5, 15], peakMin: [15, 45], durationH: [1, 2.5], afterEffectsH: [2, 6], bioavailability: 0.9,
      doses: { threshold: 1, light: [2, 4], common: [4, 8], strong: [8, 12], heavy: 12, unit: 'mg' } },
    /* Marketed as a nasal spray for seizure rescue. Bioavailability is
       reported anywhere from 40% to 80% depending on the formulation and on
       how much runs down the throat and gets swallowed; ~50% is the usual
       figure for a concentrated spray. The part that matters is that whatever
       IS absorbed nasally goes straight into the systemic circulation, so it
       escapes the CYP3A4 gut wall and hepatic extraction that destroys nearly
       two thirds of an oral dose — which is why it needs roughly half the
       oral milligrams for the same effect. */
    intranasal: { onsetMin: [2, 8], peakMin: [10, 30], durationH: [1, 2.5], afterEffectsH: [2, 6], bioavailability: 0.5,
      doses: { threshold: 1, light: [2.5, 5], common: [5, 10], strong: [10, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'Powerful respiratory depressant — clinically it is only used where airway support is available.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['DrugBank DB00683']
},

{
  id: 'chlordiazepoxide', name: 'Chlordiazepoxide', aliases: ['librium'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'anxiolytic',
         'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'The first benzodiazepine ever marketed. Long-acting with a chain of active metabolites, which makes it a standard choice for managing alcohol withdrawal.',
  halfLife: { hours: 10, range: [5, 30], confidence: 'measured',
    notes: 'The parent figure is misleading — the metabolite chain (desmethylchlordiazepoxide → demoxepam → nordazepam → oxazepam) extends the functional duration to several days.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Desmethylchlordiazepoxide', fraction: 0.5 },
      { enzyme: 'CYP3A4', reaction: 'Deamination', product: 'Demoxepam', fraction: 0.3 },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Further conversion', product: 'Nordazepam → Oxazepam', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Desmethylchlordiazepoxide', active: true, halfLifeH: 20, potencyRel: 0.8 },
      { name: 'Demoxepam', active: true, halfLifeH: 40, potencyRel: 0.6 },
      { name: 'Nordazepam', from: 'Demoxepam', active: true, halfLifeH: 80, potencyRel: 0.5, note: 'The long tail — half-life up to 100 h.' },
      { name: 'Oxazepam', from: 'Nordazepam', active: true, halfLifeH: 8, potencyRel: 0.6 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 240], durationH: [6, 12], afterEffectsH: [24, 72], bioavailability: 0.9,
      doses: { threshold: 5, light: [10, 20], common: [20, 50], strong: [50, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Four successive active metabolites mean substantial accumulation over days of dosing.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['DrugBank DB00475']
},

{
  id: 'flubromazolam', name: 'Flubromazolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'One of the most potent designer benzodiazepines identified, active well below a milligram and extremely long-acting.',
  halfLife: { hours: 15, range: [10, 25], confidence: 'estimated',
    notes: 'A case report of a 3 mg self-administration documented coma with detectable drug for over a week.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxyflubromazolam', fraction: 0.5, note: 'Active; the main urinary marker.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'α-Hydroxyflubromazolam', active: true, halfLifeH: 20, potencyRel: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [10, 18], afterEffectsH: [18, 60], bioavailability: 0.9,
      doses: { threshold: 0.05, light: [0.1, 0.2], common: [0.2, 0.4], strong: [0.4, 0.75], heavy: 0.75, unit: 'mg' } }
  },
  warnings: [
    'Active in tens of micrograms. Volumetric dosing is essential; consumer scales cannot weigh this accurately.',
    'Documented coma lasting days from a single low-milligram dose.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['Łukasik-Głębocka et al. 2016, Clin Toxicol', 'Huppertz et al. 2018']
},

{
  id: 'diclazepam', name: 'Diclazepam', aliases: ['chlorodiazepam'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'Diazepam analogue with a chlorine substitution; roughly 10x diazepam potency and metabolised into a chain of well-known active benzodiazepines.',
  halfLife: { hours: 42, range: [30, 60], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Delorazepam', fraction: 0.4, note: 'Active, with a very long half-life.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Lormetazepam', fraction: 0.25, note: 'Active; a marketed hypnotic in its own right.' },
      { enzyme: 'CYP3A4 / UGT', reaction: 'Further hydroxylation and conjugation', product: 'Lorazepam', fraction: 0.15, note: 'Yes — diclazepam genuinely metabolises into lorazepam, which is why it shows on standard assays.' }
    ],
    metabolites: [
      { name: 'Delorazepam', active: true, halfLifeH: 80, potencyRel: 1.0, note: 'Very long-lived; the main driver of duration and accumulation.' },
      { name: 'Lormetazepam', active: true, halfLifeH: 11, potencyRel: 0.8 },
      { name: 'Lorazepam', active: true, halfLifeH: 14, potencyRel: 0.8 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 240], durationH: [10, 20], afterEffectsH: [24, 72], bioavailability: 0.9,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: [
    'Three active metabolites, one with an ~80 h half-life. Daily use accumulates severely and dependence develops quickly.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['Moosmann et al. 2014, Drug Test Anal']
},

{
  id: 'phenazepam', name: 'Phenazepam', aliases: ['bonsai', 'fenazepam'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies; prescription in Russia',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 8,
  mechanism: 'Soviet-developed benzodiazepine, roughly 5x diazepam potency, with an exceptionally long duration.',
  halfLife: { hours: 60, range: [30, 100], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: '3-Hydroxyphenazepam', fraction: 0.6, note: 'Active; the main urinary marker.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: '3-Hydroxyphenazepam', active: true, halfLifeH: 30, potencyRel: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 120], peakMin: [120, 300], durationH: [12, 24], afterEffectsH: [24, 96], bioavailability: 0.9,
      doses: { threshold: 0.2, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: [
    'Impairment routinely lasts more than 24 hours; multi-day blackouts are commonly reported.',
    'Slow onset causes redosing into overdose.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['Maskell et al. 2011, J Anal Toxicol']
},

{
  id: 'zopiclone', name: 'Zopiclone', aliases: ['imovane', 'zimovane'],
  class: 'Depressant', family: 'Cyclopyrrolone (Z-drug)', schedule: 'IV (varies)',
  tags: ['depressant', 'gaba-a-positive', 'hypnotic', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'parasomnia-risk', 'addictive'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'Non-benzodiazepine GABA-A positive allosteric modulator acting at the benzodiazepine site, with less subtype selectivity than zolpidem.',
  halfLife: { hours: 5, range: [3.5, 6.5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-oxidation', product: 'Zopiclone-N-oxide', fraction: 0.5, note: 'Active metabolite.' },
      { enzyme: 'CYP2C8', reaction: 'N-demethylation', product: 'N-desmethylzopiclone', fraction: 0.3, note: 'Inactive as a hypnotic but anxiolytic in its own right.' },
      { enzyme: 'Decarboxylation', reaction: 'Non-enzymatic breakdown', product: 'Inactive fragments', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Zopiclone-N-oxide', active: true, halfLifeH: 5, potencyRel: 0.5 },
      { name: 'N-desmethylzopiclone', active: true, halfLifeH: 8, potencyRel: 0.2 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C8'], excretion: 'Renal, ~80%; <5% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 120], durationH: [4, 7], afterEffectsH: [4, 12], bioavailability: 0.8,
      doses: { threshold: 1.875, light: [3.75, 5], common: [5, 10], strong: [10, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'The characteristic bitter metallic taste persists into the next day.',
    'Complex sleep behaviours and amnestic redosing, as with zolpidem.',
    'Fatal with opioids or alcohol.'
  ],
  refs: ['DrugBank DB01198']
},

{
  id: 'gabapentin', name: 'Gabapentin', aliases: ['neurontin'],
  class: 'Depressant', family: 'Gabapentinoid', schedule: 'Unscheduled federally (US); scheduled in some states',
  tags: ['gabapentinoid', 'anxiolytic', 'cns-depressant', 'respiratory-depressant-with-opioids',
         'anticonvulsant', 'addictive', 'withdrawal-risk', 'saturable-absorption'],
  toleranceGroup: 'gabapentinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Binds the α2δ subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release. Despite the name it has no direct GABA receptor activity.',
  halfLife: { hours: 6, range: [5, 7], confidence: 'measured',
    notes: 'Absorption is SATURABLE — it relies on the LAT1 amino acid transporter, so bioavailability falls from ~60% at 900 mg/day to ~35% at 3600 mg/day. Doubling the dose does not double the effect, which is a meaningful difference from pregabalin.' },
  metabolism: {
    firstPass: 'None. Absorption via a saturable transporter is the limiting factor, not metabolism.',
    pathways: [
      { enzyme: 'None (not metabolised)', reaction: 'No biotransformation in humans', product: 'Unchanged gabapentin', fraction: 1.0,
        note: 'Excreted entirely unchanged by the kidneys — no CYP interactions at all, but it accumulates dangerously in renal impairment.' }
    ],
    metabolites: [{ name: 'None', active: false }],
    substrateOf: ['LAT1'], inhibits: [],
    excretion: 'Renal, 100% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 240], durationH: [5, 8], afterEffectsH: [4, 12], bioavailability: 0.5,
      doses: { threshold: 100, light: [200, 600], common: [600, 1200], strong: [1200, 2400], heavy: 2400, unit: 'mg' } }
  },
  warnings: [
    'With opioids it substantially raises the risk of fatal respiratory depression — a growing contributor to overdose deaths.',
    'Withdrawal after sustained high-dose use resembles benzodiazepine withdrawal and can include seizures. Taper rather than stopping abruptly.'
  ],
  refs: ['Bockbrader et al. 2010, Clin Pharmacokinet']
},

{
  id: '14-bd', name: '1,4-Butanediol', aliases: ['1,4-bd', 'bdo'],
  class: 'Depressant', family: 'GHB prodrug', schedule: 'Controlled as a GHB analogue',
  tags: ['depressant', 'gaba-b-agonist', 'prodrug', 'cns-depressant', 'respiratory-depressant',
         'steep-dose-response', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'ghb', toleranceHalfLifeDays: 2,
  mechanism: 'Industrial solvent converted to GHB in two steps by the same enzymes that metabolise ethanol. The alcohol dehydrogenase dependency creates a uniquely dangerous interaction with alcohol.',
  halfLife: { hours: 0.6, range: [0.4, 1.2], confidence: 'estimated' },
  kinetics: { order: 'zero', mgPerHour: 2500 },
  metabolism: {
    pathways: [
      { enzyme: 'ADH (alcohol dehydrogenase)', reaction: 'Oxidation', product: 'Gamma-hydroxybutyraldehyde', fraction: 0.95,
        note: 'THE critical step. Ethanol competes for the same enzyme, so drinking alcohol DELAYS the conversion — the dose seems not to work, the person redoses, and then all of it converts at once when the alcohol clears. This delayed-overdose mechanism has killed people.' },
      { enzyme: 'ALDH (aldehyde dehydrogenase)', reaction: 'Oxidation to GHB', product: 'GHB', fraction: 0.95 },
      { enzyme: 'GHB dehydrogenase', reaction: 'Downstream GHB metabolism', product: 'Succinic semialdehyde', fraction: 0.7 }
    ],
    metabolites: [{ name: 'GHB', active: true, halfLifeH: 0.5, potencyRel: 1.0, note: 'The actual active drug.' }],
    substrateOf: ['ADH', 'ALDH2'], excretion: 'Via the GHB pathway, ultimately as CO2.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [45, 90], durationH: [2, 4], afterEffectsH: [1, 5], bioavailability: 0.8,
      doses: { threshold: 0.4, light: [0.6, 1], common: [1, 1.8], strong: [1.8, 2.5], heavy: 2.5, unit: 'ml' } }
  },
  warnings: [
    'Alcohol competes for the enzyme that activates it. The result is an unpredictable, delayed onset — and a delayed overdose hours later. This is the most dangerous property of 1,4-BD and it is specific to this compound.',
    'Slower and more erratic onset than GHB or GBL, which drives redosing.',
    'Same medical-emergency withdrawal syndrome as GHB.'
  ],
  refs: ['Poldrugo & Addolorato 1999', 'Thai et al. 2007, J Clin Pharmacol']
},

{
  id: 'baclofen', name: 'Baclofen', aliases: ['lioresal'],
  class: 'Depressant', family: 'GABA-B agonist', schedule: 'Prescription',
  tags: ['gaba-b-agonist', 'muscle-relaxant', 'cns-depressant', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba-b', toleranceHalfLifeDays: 4,
  mechanism: 'Selective GABA-B receptor agonist used for spasticity, and increasingly off-label for alcohol dependence. Pharmacologically the closest relative of phenibut.',
  halfLife: { hours: 4, range: [2, 6], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Minimal hepatic metabolism', reaction: 'Deamination', product: 'β-(p-chlorophenyl)-4-hydroxybutyric acid', fraction: 0.15,
        note: 'Only ~15% is metabolised; the rest leaves unchanged. Few CYP interactions, but renal impairment causes marked accumulation and encephalopathy.' }
    ],
    metabolites: [{ name: 'β-(p-chlorophenyl)-4-hydroxybutyric acid', active: false }],
    substrateOf: [], excretion: 'Renal, ~85% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.8,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: [
    'Abrupt withdrawal after sustained use causes a severe syndrome with hallucinations, seizures, hyperthermia and rhabdomyolysis — comparable to severe alcohol withdrawal and potentially fatal. Always taper.',
    'Additive with alcohol, benzodiazepines, phenibut and opioids.'
  ],
  refs: ['DrugBank DB00181']
},

{
  id: 'tianeptine', name: 'Tianeptine', aliases: ['stablon', 'coaxil', 'gas station heroin', 'zaza'],
  class: 'Depressant', family: 'Atypical antidepressant / opioid', schedule: 'Unscheduled in some US states; banned in others',
  tags: ['opioid', 'mu-agonist', 'antidepressant', 'cns-depressant', 'respiratory-depressant',
         'highly-addictive', 'withdrawal-dangerous', 'compulsive-redosing'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'Marketed in Europe as an atypical antidepressant, but it is a full mu-opioid agonist — its antidepressant action is now attributed to that. Sold in the US as a "nootropic supplement", which badly misrepresents what it is.',
  halfLife: { hours: 2.5, range: [2, 3], confidence: 'measured',
    notes: 'The very short half-life plus genuine opioid agonism is what drives the extreme redosing seen in dependence — people dose many times daily.' },
  metabolism: {
    pathways: [
      { enzyme: 'β-oxidation (non-CYP)', reaction: 'Side-chain β-oxidation', product: 'MC5 (pentanoic metabolite)', fraction: 0.6,
        note: 'Largely non-CYP, so few classic interactions — but MC5 is an active mu agonist with a longer half-life.' },
      { enzyme: 'CYP3A4', reaction: 'Minor oxidation', product: 'MC3', fraction: 0.15 }
    ],
    metabolites: [{ name: 'MC5', active: true, halfLifeH: 8, potencyRel: 0.5, note: 'Active mu agonist; extends the effect beyond the parent.' }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 90], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.99,
      doses: { threshold: 12.5, light: [12.5, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg',
        note: 'Therapeutic dose is 12.5 mg three times daily. Misuse doses reach grams per day.' } }
  },
  warnings: [
    'A genuine opioid sold as a supplement. US poison centre calls have risen sharply, and it has caused deaths, seizures and severe opioid withdrawal.',
    'Dependence develops fast, with a withdrawal syndrome indistinguishable from opioid withdrawal.',
    'Fatal with other depressants; naloxone reverses it.'
  ],
  refs: ['Gassaway et al. 2014, Transl Psychiatry', 'CDC MMWR 2018 tianeptine report']
}

]);

/* Prescribed benzodiazepines, barbiturates, older hypnotics and carbamates.
   The research-chemical benzodiazepines were well covered; the mainstream
   prescribed ones were not. */
DB.register([

/* ================= Prescribed benzodiazepines ================= */
{
  id: 'nitrazepam', name: 'Nitrazepam', aliases: ['mogadon', 'alodorm'],
  class: 'Depressant', family: 'Benzodiazepine (nitro)', schedule: 'IV (US analogue); Rx in UK/EU/AU',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'amnestic', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'Long-acting nitrobenzodiazepine hypnotic, widely prescribed for insomnia outside the US. Its long half-life relative to a night\'s sleep is what produces the characteristic morning hangover.',
  halfLife: { hours: 26, range: [15, 38], confidence: 'measured',
    notes: 'Considerably longer in the elderly (up to 40 h), which is why it is a classic falls-risk drug in older patients.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / nitroreductase', reaction: 'Nitro group reduction', product: '7-Aminonitrazepam', fraction: 0.6,
        note: 'Main route; the amino metabolite is inactive and is the standard urinary marker.' },
      { enzyme: 'NAT2', reaction: 'Acetylation', product: '7-Acetamidonitrazepam', fraction: 0.25,
        note: 'Slow NAT2 acetylators clear it more slowly and get more next-day sedation.' }
    ],
    metabolites: [
      { name: '7-Aminonitrazepam', active: false, halfLifeH: 28, fraction: 0.6 },
      { name: '7-Acetamidonitrazepam', active: false, halfLifeH: 30, fraction: 0.25 }
    ],
    substrateOf: ['CYP3A4', 'NAT2'], excretion: 'Renal, <5% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [6, 10], afterEffectsH: [10, 24], bioavailability: 0.78,
      doses: { threshold: 1.25, light: [2.5, 5], common: [5, 10], strong: [10, 15], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'Marked next-day impairment — driving the morning after a hypnotic dose is genuinely unsafe.',
    'Fatal with opioids or alcohol. Withdrawal after sustained use can be fatal.'
  ],
  sources: ['DrugBank DB01595']
},

{
  id: 'flurazepam', name: 'Flurazepam', aliases: ['dalmane'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'long-duration', 'accumulation-risk', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 10,
  mechanism: 'Hypnotic benzodiazepine whose own half-life is short but which converts to norflurazepam, an extremely long-lived active metabolite. Effectively a slow-release benzodiazepine by metabolic accident.',
  halfLife: { hours: 2.3, range: [2, 3], confidence: 'measured',
    notes: 'Misleading alone: norflurazepam lasts 47-100 h and does all the work. Accumulation over a week of nightly use is substantial.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Norflurazepam', fraction: 0.7,
        note: 'The active species, with a half-life of up to four days.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxyethylflurazepam', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Norflurazepam', active: true, halfLifeH: 80, potencyRel: 1.0, fraction: 0.7 },
      { name: 'Hydroxyethylflurazepam', active: true, halfLifeH: 3, potencyRel: 0.5, fraction: 0.15 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [30, 90], durationH: [7, 10], afterEffectsH: [24, 72], bioavailability: 0.83,
      doses: { threshold: 7.5, light: [15, 15], common: [15, 30], strong: [30, 45], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Accumulates for a week or more of nightly use — night 7 is far stronger than night 1 at the same dose.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['DrugBank DB00690']
},

{
  id: 'estazolam', name: 'Estazolam', aliases: ['prosom', 'eurodin'],
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'amnestic', 'addictive', 'withdrawal-dangerous', 'cyp3a4-substrate'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Intermediate-acting triazolobenzodiazepine hypnotic. Structurally a close relative of alprazolam and triazolam.',
  halfLife: { hours: 14, range: [10, 24], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: '4-Hydroxyestazolam', fraction: 0.6,
        note: 'Almost entirely CYP3A4-dependent, so strong 3A4 inhibitors substantially raise exposure.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: '4-Hydroxyestazolam', active: true, halfLifeH: 15, potencyRel: 0.2, fraction: 0.6 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal, <5% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 180], durationH: [6, 10], afterEffectsH: [8, 20], bioavailability: 0.93,
      doses: { threshold: 0.5, light: [1, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: ['Contraindicated with strong CYP3A4 inhibitors. Fatal with opioids or alcohol.'],
  sources: ['DrugBank DB01215']
},

{
  id: 'lormetazepam', name: 'Lormetazepam', aliases: ['noctamid', 'loramet'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'IV (varies); Rx across EU',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'amnestic', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Short-to-intermediate acting hypnotic, the 3-hydroxy analogue of lorazepam. Like lorazepam it is cleared purely by glucuronidation, which makes it predictable in liver disease.',
  halfLife: { hours: 10, range: [8, 14], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B15', reaction: 'Direct glucuronidation', product: 'Lormetazepam glucuronide', fraction: 0.9,
        note: 'Bypasses CYP entirely — no active metabolites and no CYP3A4 interactions.' },
      { enzyme: 'CYP3A4', reaction: 'Minor demethylation', product: 'Lorazepam', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Lormetazepam glucuronide', active: false, halfLifeH: 12, fraction: 0.9 },
      { name: 'Lorazepam', active: true, halfLifeH: 14, potencyRel: 1.0, fraction: 0.05, note: 'Minor.' }
    ],
    substrateOf: ['UGT2B15'], excretion: 'Renal, as the glucuronide.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 150], durationH: [6, 9], afterEffectsH: [6, 16], bioavailability: 0.8,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 3], heavy: 4, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Withdrawal can be fatal.'],
  sources: ['DrugBank DB01351']
},

{
  id: 'brotizolam', name: 'Brotizolam', aliases: ['lendormin'],
  class: 'Depressant', family: 'Thienodiazepine', schedule: 'Rx in EU/Japan; not US',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'amnestic', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'Highly potent thienotriazolodiazepine hypnotic, related to etizolam. Active at fractions of a milligram — among the most potent prescribed hypnotics.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the methyl group', product: 'α-Hydroxybrotizolam', fraction: 0.5, note: 'Active.' },
      { enzyme: 'CYP3A4', reaction: 'Ring hydroxylation', product: '6-Hydroxybrotizolam', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'α-Hydroxybrotizolam', active: true, halfLifeH: 6, potencyRel: 0.4, fraction: 0.5 },
      { name: '6-Hydroxybrotizolam', active: false, halfLifeH: 6, fraction: 0.25 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal and faecal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 40], peakMin: [45, 120], durationH: [5, 8], afterEffectsH: [6, 14], bioavailability: 0.7,
      doses: { threshold: 0.0625, light: [0.125, 0.25], common: [0.25, 0.5], strong: [0.5, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: ['Very potent by weight. Fatal with opioids or alcohol.'],
  sources: ['DrugBank DB09017']
},

{
  id: 'clobazam', name: 'Clobazam', aliases: ['onfi', 'frisium'],
  class: 'Depressant', family: 'Benzodiazepine (1,5-)', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'anticonvulsant', 'cns-depressant',
         'long-duration', 'accumulation-risk', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 8,
  mechanism: 'A 1,5-benzodiazepine rather than the usual 1,4 arrangement, which gives it relatively more anticonvulsant and anxiolytic action for less sedation. Used mainly for epilepsy, including Lennox-Gastaut syndrome.',
  halfLife: { hours: 36, range: [18, 50], confidence: 'measured',
    notes: 'Its active metabolite N-desmethylclobazam has a half-life of 71-82 h and reaches plasma levels 8-20× the parent — so the metabolite is really the drug.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N-desmethylclobazam (norclobazam)', fraction: 0.7,
        note: 'Produces the dominant active species.' },
      { enzyme: 'CYP2C19', reaction: 'Hydroxylation of norclobazam', product: '4-Hydroxy-norclobazam', from: 'N-desmethylclobazam (norclobazam)', fraction: 0.4,
        note: 'CYP2C19 poor metabolisers accumulate up to 5× more norclobazam — clinically significant enough that dose reduction is recommended.' }
    ],
    metabolites: [
      { name: 'N-desmethylclobazam', active: true, halfLifeH: 76, potencyRel: 0.2, fraction: 0.7,
        note: 'Weaker per molecule but present at 8-20× the concentration, so it carries most of the effect.' },
      { name: '4-Hydroxy-norclobazam', active: false, halfLifeH: 20, fraction: 0.4 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'], inhibits: ['CYP2D6'],
    excretion: 'Renal, ~80%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [30, 240], durationH: [12, 24], afterEffectsH: [24, 72], bioavailability: 0.87,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: [
    'CBD substantially raises norclobazam levels by inhibiting CYP2C19 — a well-documented and clinically important interaction, since both are used in the same epilepsy patients.',
    'Fatal with opioids or alcohol. Withdrawal can precipitate seizures.'
  ],
  sources: ['DrugBank DB00349', 'Geffrey et al. 2015, Epilepsia (CBD interaction)']
},

{
  id: 'clorazepate', name: 'Clorazepate', aliases: ['tranxene'],
  class: 'Depressant', family: 'Benzodiazepine (prodrug)', schedule: 'IV (US)',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'anxiolytic', 'prodrug', 'cns-depressant',
         'long-duration', 'accumulation-risk', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 9,
  mechanism: 'A prodrug: gastric acid decarboxylates it to nordazepam before absorption. It is therefore essentially a delivery form of nordazepam, with all of that compound\'s very long duration.',
  halfLife: { hours: 2, range: [1, 3], confidence: 'measured',
    notes: 'The parent is never really present. The meaningful figure is nordazepam\'s 36-100 h.' },
  metabolism: {
    firstPass: 'Complete non-enzymatic conversion in the stomach — so gastric acid suppression (PPIs, antacids) can reduce its activation.',
    pathways: [
      { enzyme: 'Gastric acid (non-enzymatic)', reaction: 'Decarboxylation', product: 'Nordazepam', fraction: 0.95,
        note: 'Happens before absorption. Raising stomach pH with a PPI slows it measurably.' },
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'Hydroxylation of nordazepam', product: 'Oxazepam', fraction: 0.4 }
    ],
    metabolites: [
      { name: 'Nordazepam', active: true, halfLifeH: 80, potencyRel: 1.0, fraction: 0.95, note: 'The actual drug.' },
      { name: 'Oxazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.4 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [10, 20], afterEffectsH: [24, 96], bioavailability: 0.91,
      doses: { threshold: 3.75, light: [7.5, 15], common: [15, 30], strong: [30, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Antacids and proton pump inhibitors reduce its conversion, so the effect becomes weaker and less predictable.',
    'Accumulates for weeks via nordazepam. Fatal with opioids or alcohol.'
  ],
  sources: ['DrugBank DB00628']
},

{
  id: 'prazepam', name: 'Prazepam', aliases: ['centrax', 'lysanxia'],
  class: 'Depressant', family: 'Benzodiazepine (prodrug)', schedule: 'IV (US); Rx in EU',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'anxiolytic', 'prodrug', 'cns-depressant',
         'long-duration', 'accumulation-risk', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 9,
  mechanism: 'Another nordazepam prodrug, converted by hepatic first-pass rather than gastric acid. The slow conversion gives an unusually gentle onset, which is why it was favoured for anxiety over hypnotic use.',
  halfLife: { hours: 1.5, range: [1, 3], confidence: 'measured', notes: 'Parent only; nordazepam does the work.' },
  metabolism: {
    firstPass: 'Extensive and necessary — it is what activates the drug.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Nordazepam', fraction: 0.8 },
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'Hydroxylation', product: 'Oxazepam', fraction: 0.35 }
    ],
    metabolites: [
      { name: 'Nordazepam', active: true, halfLifeH: 80, potencyRel: 1.0, fraction: 0.8 },
      { name: 'Oxazepam', from: 'Nordazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.35 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [120, 360], durationH: [12, 24], afterEffectsH: [24, 96], bioavailability: 0.8,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'Very slow onset — people redose thinking it has not worked, then get the whole load hours later.',
    'Accumulates via nordazepam. Fatal with opioids or alcohol.'
  ],
  sources: ['DrugBank DB01588']
},

{
  id: 'tofisopam', name: 'Tofisopam', aliases: ['grandaxin', 'emandaxin'],
  class: 'Depressant', family: 'Benzodiazepine (2,3-)', schedule: 'Rx in EU/Russia/Japan; not US',
  tags: ['anxiolytic', 'non-sedating', 'cns-depressant-mild', 'cyp3a4-inhibitor'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 3,
  mechanism: 'A 2,3-benzodiazepine — a different ring arrangement that does NOT bind the classical benzodiazepine site. As a result it is anxiolytic without being sedating, anticonvulsant, muscle-relaxing or (apparently) dependence-forming. Prescribed widely in Hungary, Russia and Japan.',
  halfLife: { hours: 6, range: [4, 8], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: 'Desmethyltofisopam', fraction: 0.5 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Desmethyltofisopam', active: true, halfLifeH: 7, potencyRel: 0.4, fraction: 0.5 }],
    substrateOf: ['CYP3A4'], inhibits: ['CYP3A4', 'CYP2C9'],
    excretion: 'Renal and faecal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.7,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Genuinely different from other benzodiazepines — not sedating and not obviously dependence-forming, because it misses the classical binding site entirely. Do not assume benzodiazepine cross-tolerance.',
    'Inhibits CYP3A4, raising levels of many other drugs.'
  ],
  sources: ['Horvath et al. 2018, Pharmacol Rep', 'Hungarian prescribing literature']
},

/* ================= Z-drugs ================= */
{
  id: 'zaleplon', name: 'Zaleplon', aliases: ['sonata', 'starnoc'],
  class: 'Depressant', family: 'Pyrazolopyrimidine (Z-drug)', schedule: 'IV (US)',
  tags: ['depressant', 'gaba-a-positive', 'hypnotic', 'cns-depressant', 'amnestic',
         'parasomnia-risk', 'short-duration', 'addictive'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 3,
  mechanism: 'Ultra-short-acting α1-selective GABA-A modulator. Its brevity is the point — it can be taken in the middle of the night with little morning hangover.',
  halfLife: { hours: 1, range: [0.9, 1.1], confidence: 'measured',
    notes: 'The shortest of the z-drugs. Effects are over in 3-4 hours, which also makes it poor for sleep maintenance.' },
  metabolism: {
    firstPass: 'Very heavy; oral bioavailability only ~30%.',
    pathways: [
      { enzyme: 'Aldehyde oxidase (AOX1)', reaction: 'Oxidation', product: '5-oxo-zaleplon', fraction: 0.7,
        note: 'Unusually, aldehyde oxidase rather than CYP does most of the work — so zaleplon avoids most CYP interactions.' },
      { enzyme: 'CYP3A4', reaction: 'Oxidation', product: 'Desethylzaleplon', fraction: 0.2 }
    ],
    metabolites: [
      { name: '5-oxo-zaleplon', active: false, halfLifeH: 1.5, fraction: 0.7 },
      { name: 'Desethylzaleplon', active: false, halfLifeH: 1.5, fraction: 0.2 }
    ],
    substrateOf: ['AOX1', 'CYP3A4'], excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [30, 60], durationH: [2, 4], afterEffectsH: [1, 5], bioavailability: 0.3,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Complex sleep behaviours and amnesia as with other z-drugs; taking it and staying awake makes them likely.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['DrugBank DB00962']
},

{
  id: 'eszopiclone', name: 'Eszopiclone', aliases: ['lunesta'],
  class: 'Depressant', family: 'Cyclopyrrolone (Z-drug)', schedule: 'IV (US)',
  tags: ['depressant', 'gaba-a-positive', 'hypnotic', 'cns-depressant', 'amnestic',
         'parasomnia-risk', 'addictive'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'The S-enantiomer of zopiclone and the active half. Longer-acting than zolpidem, so it is used for sleep maintenance rather than sleep onset.',
  halfLife: { hours: 6, range: [5, 9], confidence: 'measured', notes: 'Longer in the elderly (~9 h), where the dose is halved.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-oxidation', product: 'S-zopiclone-N-oxide', fraction: 0.5, note: 'Weakly active.' },
      { enzyme: 'CYP2E1', reaction: 'N-demethylation', product: 'S-desmethylzopiclone', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'S-zopiclone-N-oxide', active: true, halfLifeH: 6, potencyRel: 0.3, fraction: 0.5 },
      { name: 'S-desmethylzopiclone', active: false, halfLifeH: 8, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'CYP2E1'], excretion: 'Renal, <10% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [60, 90], durationH: [6, 9], afterEffectsH: [6, 14], bioavailability: 0.8,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 3], strong: [3, 6], heavy: 6, unit: 'mg' } }
  },
  warnings: [
    'The bitter metallic aftertaste is characteristic and persists into the next day.',
    'FDA lowered the recommended starting dose over next-morning driving impairment.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['DrugBank DB00402']
},

/* ================= Barbiturates ================= */
{
  id: 'secobarbital', name: 'Secobarbital', aliases: ['seconal', 'reds'],
  class: 'Depressant', family: 'Barbiturate (short-acting)', schedule: 'II (US)',
  tags: ['depressant', 'barbiturate', 'gaba-a-direct', 'hypnotic', 'cns-depressant',
         'respiratory-depressant', 'narrow-therapeutic-index', 'addictive', 'withdrawal-dangerous',
         'enzyme-inducer'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'Short-acting barbiturate hypnotic. Like all barbiturates it opens GABA-A chloride channels directly at higher doses rather than merely modulating them — there is no ceiling, which is why overdose is so much more lethal than with benzodiazepines.',
  halfLife: { hours: 28, range: [15, 40], confidence: 'measured',
    notes: 'The "short-acting" label refers to onset and redistribution, not elimination — it lingers far longer than a night.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19 / CYP2C9', reaction: 'Side-chain oxidation', product: 'Hydroxysecobarbital', fraction: 0.6 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: 'Hydroxysecobarbital', active: false, halfLifeH: 20, fraction: 0.6 }],
    substrateOf: ['CYP2C19', 'CYP2C9'],
    induces: ['CYP3A4', 'CYP2C9', 'CYP1A2', 'UGT'],
    excretion: 'Renal, <5% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [30, 120], durationH: [4, 8], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'No ceiling on respiratory depression and a narrow therapeutic index — roughly 10× a hypnotic dose can be fatal, and there is no reversal agent equivalent to flumazenil or naloxone.',
    'Tolerance to the effect rises much faster than tolerance to the lethal dose, so the gap closes with use. This is the core reason barbiturates were abandoned as hypnotics.',
    'Fatal with opioids or alcohol. Withdrawal can be fatal.',
    'Powerful enzyme inducer — reduces the effectiveness of oral contraceptives and many other drugs.'
  ],
  sources: ['DrugBank DB00418']
},

{
  id: 'pentobarbital', name: 'Pentobarbital', aliases: ['nembutal', 'yellow jackets'],
  class: 'Depressant', family: 'Barbiturate (short-acting)', schedule: 'II (US)',
  tags: ['depressant', 'barbiturate', 'gaba-a-direct', 'hypnotic', 'anticonvulsant', 'cns-depressant',
         'respiratory-depressant', 'narrow-therapeutic-index', 'addictive', 'withdrawal-dangerous',
         'enzyme-inducer'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'Short-acting barbiturate used clinically for refractory status epilepticus and induced coma, and in veterinary euthanasia. Direct GABA-A chloride channel agonist at higher doses.',
  halfLife: { hours: 22, range: [15, 50], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19 / CYP2E1', reaction: 'Side-chain hydroxylation', product: 'Hydroxypentobarbital', fraction: 0.65 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Hydroxypentobarbital', active: false, halfLifeH: 20, fraction: 0.65 }],
    substrateOf: ['CYP2C19', 'CYP2E1'],
    induces: ['CYP3A4', 'CYP2C9', 'CYP1A2', 'UGT'],
    excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [30, 120], durationH: [4, 8], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'No ceiling on respiratory depression, narrow therapeutic index, no reversal agent. It is used for euthanasia precisely because of how reliably it stops breathing.',
    'Fatal with opioids or alcohol. Withdrawal can be fatal.',
    'Strong enzyme inducer.'
  ],
  sources: ['DrugBank DB00312']
},

{
  id: 'butalbital', name: 'Butalbital', aliases: ['fioricet', 'fiorinal'],
  class: 'Depressant', family: 'Barbiturate (intermediate)', schedule: 'III (US, varies by formulation)',
  tags: ['depressant', 'barbiturate', 'gaba-a-direct', 'cns-depressant', 'respiratory-depressant',
         'addictive', 'withdrawal-dangerous', 'rebound-headache'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Intermediate-acting barbiturate found almost exclusively in combination headache products alongside paracetamol or aspirin and caffeine.',
  halfLife: { hours: 35, range: [25, 60], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'Side-chain oxidation', product: 'Hydroxybutalbital', fraction: 0.6 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Hydroxybutalbital', active: false, halfLifeH: 30, fraction: 0.6 }],
    substrateOf: ['CYP2C19'], induces: ['CYP3A4', 'UGT'],
    excretion: 'Renal, ~60% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 25, light: [50, 50], common: [50, 100], strong: [100, 200], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'The combination products contain paracetamol — escalating them for the barbiturate reaches hepatotoxic paracetamol doses. This is a common and avoidable harm.',
    'A leading cause of medication-overuse (rebound) headache: the drug taken for headaches causes more of them.',
    'Fatal with opioids or alcohol. Withdrawal can be fatal.'
  ],
  sources: ['DrugBank DB00241']
},

{
  id: 'thiopental', name: 'Thiopental', aliases: ['pentothal', 'sodium thiopental'],
  class: 'Depressant', family: 'Barbiturate (ultra-short)', schedule: 'III (US)',
  tags: ['depressant', 'barbiturate', 'gaba-a-direct', 'anaesthetic', 'cns-depressant',
         'respiratory-depressant', 'narrow-therapeutic-index'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Ultra-short-acting thiobarbiturate anaesthetic. Extremely lipophilic, so it reaches the brain in one circulation time and then redistributes to fat within minutes — the classic example of a drug whose duration is set by redistribution rather than elimination.',
  halfLife: { hours: 11, range: [6, 46], confidence: 'measured',
    notes: 'A patient wakes in 5-10 minutes from redistribution while the terminal half-life is 11 hours. Repeated doses saturate the fat compartment and duration then lengthens dramatically.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19 / CYP2E1', reaction: 'Side-chain oxidation', product: 'Carboxythiopental', fraction: 0.6 },
      { enzyme: 'CYP2C19', reaction: 'Desulfuration', product: 'Pentobarbital', fraction: 0.1,
        note: 'Converts partly to pentobarbital, which is far longer-acting and prolongs recovery after big doses.' }
    ],
    metabolites: [
      { name: 'Pentobarbital', active: true, halfLifeH: 22, potencyRel: 0.8, fraction: 0.1 },
      { name: 'Carboxythiopental', active: false, halfLifeH: 12, fraction: 0.6 }
    ],
    substrateOf: ['CYP2C19', 'CYP2E1'], induces: ['CYP3A4'],
    excretion: 'Renal, as metabolites.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [0.2, 1], peakMin: [1, 2], durationH: [0.1, 0.3], afterEffectsH: [2, 12], bioavailability: 1.0,
      doses: { threshold: 50, light: [100, 200], common: [200, 400], strong: [400, 600], heavy: 600, unit: 'mg' } }
  },
  warnings: [
    'Anaesthetic agent — apnoea at induction doses is expected and airway management is mandatory. Not survivable outside a clinical setting without ventilation.',
    'Highly alkaline; extravasation causes tissue necrosis.'
  ],
  sources: ['DrugBank DB00599']
},

/* ================= Older hypnotics and carbamates ================= */
{
  id: 'methaqualone', name: 'Methaqualone', aliases: ['quaalude', 'mandrax', 'ludes'],
  class: 'Depressant', family: 'Quinazolinone', schedule: 'I (US)',
  tags: ['depressant', 'gaba-a-positive', 'hypnotic', 'cns-depressant', 'respiratory-depressant',
         'muscle-relaxant', 'addictive', 'withdrawal-dangerous', 'seizure-risk'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Quinazolinone sedative-hypnotic, hugely popular in the 1960s-70s before being banned almost everywhere. A GABA-A positive modulator at a site distinct from the benzodiazepine one, producing heavy sedation with pronounced euphoria, tingling and loss of motor control.',
  halfLife: { hours: 30, range: [20, 60], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Aromatic hydroxylation', product: 'Hydroxymethaqualone isomers', fraction: 0.7,
        note: 'Several hydroxylated metabolites, some retaining sedative activity.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: '2-Hydroxymethylmethaqualone', active: true, halfLifeH: 25, potencyRel: 0.3, fraction: 0.7 }],
    substrateOf: ['CYP2C19', 'CYP3A4'], excretion: 'Renal, <2% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 150], durationH: [4, 8], afterEffectsH: [8, 24], bioavailability: 0.85,
      doses: { threshold: 75, light: [150, 300], common: [300, 600], strong: [600, 900], heavy: 900, unit: 'mg' } }
  },
  warnings: [
    'Banned worldwide largely because tolerance to the euphoria outpaced tolerance to respiratory depression, so habitual users converged on lethal doses.',
    'Causes seizures in overdose, unusually for a sedative — and withdrawal after heavy use can also cause them.',
    'Fatal with opioids or alcohol; the alcohol combination was the classic cause of death.',
    'Almost everything sold as "quaaludes" today is a counterfeit containing something else entirely.'
  ],
  sources: ['DrugBank DB04833', 'Historical clinical literature']
},

{
  id: 'meprobamate', name: 'Meprobamate', aliases: ['miltown', 'equanil'],
  class: 'Depressant', family: 'Carbamate', schedule: 'IV (US); withdrawn in EU',
  tags: ['depressant', 'gaba-a-positive', 'anxiolytic', 'muscle-relaxant', 'cns-depressant',
         'respiratory-depressant', 'narrow-therapeutic-index', 'addictive', 'withdrawal-dangerous',
         'seizure-risk', 'enzyme-inducer'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'The first blockbuster anxiolytic — "Miltown", the 1950s tranquilliser that preceded the benzodiazepines. A GABA-A positive modulator acting at the barbiturate site, and the active metabolite of carisoprodol, which is how most people encounter it today.',
  halfLife: { hours: 10, range: [6, 17], confidence: 'measured',
    notes: 'Longer with chronic use as it inhibits its own clearance; in overdose it can stretch to 24 h or more, and tablets can form a gastric bezoar that keeps releasing drug.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxymeprobamate', fraction: 0.6 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Meprobamate glucuronide', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Hydroxymeprobamate', active: false, halfLifeH: 12, fraction: 0.6 },
      { name: 'Meprobamate glucuronide', active: false, halfLifeH: 12, fraction: 0.2 }
    ],
    substrateOf: ['CYP2C19', 'CYP3A4'],
    induces: ['CYP3A4'],
    excretion: 'Renal, ~10% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [6, 10], afterEffectsH: [8, 24], bioavailability: 0.9,
      doses: { threshold: 100, light: [200, 400], common: [400, 800], strong: [800, 1600], heavy: 1600, unit: 'mg' } }
  },
  warnings: [
    'Withdrawn across the EU. It has a narrow therapeutic index, causes seizures in overdose, and its withdrawal syndrome — like the barbiturates it resembles — can be fatal.',
    'Most present-day exposure is via carisoprodol, which converts to it. Anyone taking "Soma" is really taking this.',
    'In overdose, tablets can clump into a bezoar in the stomach that continues releasing drug for hours, causing a relapsing coma.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['DrugBank DB00371', 'Bramness et al. 2004, Forensic Sci Int']
},

{
  id: 'chloral-hydrate', name: 'Chloral hydrate', aliases: ['noctec', 'mickey finn'],
  class: 'Depressant', family: 'Chlorinated aldehyde hydrate', schedule: 'IV (US); largely withdrawn',
  tags: ['depressant', 'gaba-a-positive', 'hypnotic', 'prodrug', 'cns-depressant',
         'respiratory-depressant', 'cardiotoxic', 'gastric-irritant', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'One of the oldest synthetic hypnotics, in use since 1869 and the original "knockout drops". A prodrug: it is rapidly reduced to trichloroethanol, which is the actual sedative and acts at GABA-A much like a barbiturate.',
  halfLife: { hours: 0.1, range: [0.05, 0.2], confidence: 'measured',
    notes: 'Chloral hydrate itself lasts only minutes. Its active metabolite trichloroethanol has an 8-12 h half-life and is what matters.' },
  metabolism: {
    pathways: [
      { enzyme: 'Alcohol dehydrogenase (ADH)', reaction: 'Reduction', product: 'Trichloroethanol', fraction: 0.8,
        note: 'The activating step. Ethanol competes for ADH, which both delays activation and slows trichloroethanol clearance — the pharmacological basis of the "Mickey Finn".' },
      { enzyme: 'ALDH', reaction: 'Oxidation', product: 'Trichloroacetic acid', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Urochloralic acid', fraction: 0.5 }
    ],
    metabolites: [
      { name: 'Trichloroethanol', active: true, halfLifeH: 10, potencyRel: 1.0, fraction: 0.8, note: 'The real hypnotic.' },
      { name: 'Trichloroacetic acid', active: false, halfLifeH: 100, fraction: 0.15, note: 'Very long-lived; accumulates with repeated use and is a suspected carcinogen.' }
    ],
    substrateOf: ['ADH', 'ALDH', 'UGT'], excretion: 'Renal, as urochloralic acid.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 40], peakMin: [30, 90], durationH: [4, 8], afterEffectsH: [8, 20], bioavailability: 0.9,
      doses: { threshold: 250, light: [500, 750], common: [750, 1500], strong: [1500, 2000], heavy: 2000, unit: 'mg' } }
  },
  warnings: [
    'With alcohol the interaction is genuinely synergistic rather than merely additive — each impairs the other\'s metabolism. This combination is the historical "knockout drops" and has killed people.',
    'Severely irritating to the stomach; causes vomiting and, in overdose, gastric necrosis.',
    'Cardiotoxic in overdose, causing arrhythmias that do not respond well to treatment.',
    'Largely withdrawn from clinical use for these reasons.'
  ],
  sources: ['DrugBank DB01563', 'Historical toxicology literature']
},

{
  id: 'propofol', name: 'Propofol', aliases: ['diprivan'],
  class: 'Depressant', family: 'Alkylphenol anaesthetic', schedule: 'Prescription (hospital); unscheduled in US',
  tags: ['depressant', 'gaba-a-positive', 'anaesthetic', 'cns-depressant', 'respiratory-depressant',
         'narrow-therapeutic-index', 'addictive', 'no-analgesia'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 3,
  mechanism: 'Intravenous general anaesthetic and a potent GABA-A positive modulator. Extremely rapid onset and offset by redistribution. It has no analgesic properties at all — it produces unconsciousness without pain relief.',
  halfLife: { hours: 4, range: [2, 24], confidence: 'measured',
    notes: 'Clinically the number that matters is the context-sensitive half-time: a person wakes 5-10 minutes after a bolus because of redistribution, not clearance. Terminal elimination is far longer.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A9', reaction: 'Glucuronidation', product: 'Propofol glucuronide', fraction: 0.6,
        note: 'Dominant. Clearance actually exceeds liver blood flow, so significant extrahepatic metabolism (lung, kidney) occurs too.' },
      { enzyme: 'CYP2B6', reaction: 'Hydroxylation', product: '4-Hydroxypropofol', fraction: 0.25, note: 'Weakly active.' }
    ],
    metabolites: [
      { name: 'Propofol glucuronide', active: false, halfLifeH: 6, fraction: 0.6 },
      { name: '4-Hydroxypropofol', active: true, halfLifeH: 5, potencyRel: 0.3, fraction: 0.25 }
    ],
    substrateOf: ['UGT1A9', 'CYP2B6'], excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [0.2, 1], peakMin: [1, 2], durationH: [0.1, 0.3], afterEffectsH: [0.5, 3], bioavailability: 1.0,
      doses: { threshold: 10, light: [20, 50], common: [100, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'There is no safe non-clinical use. The dose producing sedation and the dose producing apnoea are close together, and it provides no warning — breathing simply stops. Every recorded case of recreational or self-administered propofol use has depended on the user surviving their own apnoea unaided, which is why it killed Michael Jackson.',
    'No reversal agent exists.',
    'Propofol infusion syndrome — metabolic acidosis, rhabdomyolysis, cardiac failure — occurs with prolonged high-dose infusion.',
    'Included for completeness and for interaction modelling, not as something with a usable dose range outside an operating theatre.'
  ],
  sources: ['DrugBank DB00818', 'Kotani et al. 2008, Med Chem']
}

]);

/* Designer benzodiazepines / thienodiazepines.
   Almost none have human PK studies. Where a figure comes from a harm-reduction
   wiki consensus range rather than the literature it is marked `community`;
   where it comes only from user reports it is marked `anecdotal` (opinion). */
DB.register([

{
  id: 'clobromazolam', name: 'Clobromazolam', aliases: ['phenazolam', 'cbz'],
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 8,
  mechanism: 'Flubromazolam-derived triazolobenzodiazepine, sold widely as "phenazolam". A high-potency GABA-A positive allosteric modulator with a very long duration — around 24 hours of primary effect and up to 48 hours of after-effects.',
  halfLife: { hours: 30, range: [20, 60], confidence: 'estimated',
    notes: 'No formal human PK study. Forensic toxicokinetic work on flubromazolam-derived benzodiazepines places it in the long-acting group; the ~24 h duration and 48 h+ after-effects are consistently reported. Impairment lasting more than a day is the norm.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the triazole methyl group', product: 'α-Hydroxyclobromazolam', fraction: 0.5,
        note: 'Main route identified in toxicokinetic work; the metabolite is the principal urinary marker and is presumed active.' },
      { enzyme: 'CYP3A4', reaction: 'Aromatic hydroxylation', product: '4-Hydroxyclobromazolam', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'α-Hydroxyclobromazolam', active: true, halfLifeH: 25, potencyRel: 0.5, fraction: 0.5,
        note: 'Presumed active and long-lived; contributes substantially to the extended after-effects.' },
      { name: '4-Hydroxyclobromazolam', active: false, halfLifeH: 20, fraction: 0.15 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [15, 30], peakMin: [45, 90], durationH: [20, 26], afterEffectsH: [24, 48], bioavailability: 0.9,
      doses: { threshold: 0.15, light: [0.25, 0.75], common: [0.75, 1.5], strong: [1.5, 2.5], heavy: 2.5, unit: 'mg',
        note: 'Community consensus: ~1.25 mg common, 2.5 mg strong, above that heavy — assuming no tolerance. Onset 15-20 min with a 30-70 min come-up.' } }
  },
  warnings: [
    'Roughly a 24 hour duration with 48+ hours of after-effects. Taking any other depressant — alcohol, GHB, gabapentinoids, z-drugs, opioids — within that whole window risks ataxia, blackout, respiratory depression and death.',
    'Subject of a public safety alert in December 2025 after appearing in counterfeit tablets.',
    'Profound anterograde amnesia; blackout redosing is a routine failure mode. Pre-measure doses.',
    'Dosing figures are community consensus, not clinical data.'
  ],
  sources: ['Huppertz et al. 2020, J Anal Toxicol (flubromazolam-derived DBZDs)', 'CFSRE public alert Dec 2025', 'PsychonautWiki / community consensus for dose ranges']
},

{
  id: 'flunitrazolam', name: 'Flunitrazolam', aliases: ['flunazolam'],
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 8,
  mechanism: 'Triazolo analogue of flunitrazepam and among the most potent designer benzodiazepines identified — active in the tens of micrograms.',
  halfLife: { hours: 25, range: [15, 45], confidence: 'analogue',
    notes: 'No human PK data. Extrapolated from flunitrazepam and flubromazolam; consistently reported to last well over a day.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Nitro group reduction', product: '7-Aminoflunitrazolam', fraction: 0.55,
        note: 'By analogy with flunitrazepam and clonazepam; the amino metabolite is the standard urinary marker.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxyflunitrazolam', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: '7-Aminoflunitrazolam', active: false, halfLifeH: 30, fraction: 0.55, note: 'Main urinary marker.' },
      { name: 'α-Hydroxyflunitrazolam', active: true, halfLifeH: 20, potencyRel: 0.5, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [10, 20], afterEffectsH: [24, 72], bioavailability: 0.9,
      doses: { threshold: 0.025, light: [0.05, 0.1], common: [0.1, 0.2], strong: [0.2, 0.35], heavy: 0.35, unit: 'mg',
        note: 'Community consensus ranges. Active in tens of micrograms — powder cannot be dosed safely without volumetric solution.' } }
  },
  warnings: [
    'One of the most potent benzodiazepines known. Consumer scales cannot weigh a dose; volumetric dosing is mandatory.',
    'Extreme amnesia and multi-day impairment. Fatal with opioids or alcohol.',
    'Dose figures are community consensus, not clinical data.'
  ],
  sources: ['PsychonautWiki / TripSit consensus ranges', 'Forensic case reports']
},

{
  id: 'fluclotizolam', name: 'Fluclotizolam',
  class: 'Depressant', family: 'Thienodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'high-toxicity', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Highly potent thienotriazolodiazepine related to etizolam and clotiazepam, active in the tens of micrograms.',
  halfLife: { hours: 12, range: [6, 24], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the methyl group', product: 'α-Hydroxyfluclotizolam', fraction: 0.5, note: 'Presumed active, by analogy with etizolam.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'α-Hydroxyfluclotizolam', active: true, halfLifeH: 14, potencyRel: 0.7, fraction: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 150], durationH: [6, 12], afterEffectsH: [12, 36], bioavailability: 0.9,
      doses: { threshold: 0.05, light: [0.1, 0.25], common: [0.25, 0.5], strong: [0.5, 1], heavy: 1, unit: 'mg' } }
  },
  warnings: ['Active in tens of micrograms; volumetric dosing essential. Fatal with opioids or alcohol.'],
  sources: ['PsychonautWiki / TripSit consensus ranges']
},

{
  id: 'metizolam', name: 'Metizolam', aliases: ['desmethyletizolam'],
  class: 'Depressant', family: 'Thienodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Thienodiazepine closely related to etizolam, lacking the tolyl methyl group. Somewhat less potent with a comparable duration.',
  halfLife: { hours: 12, range: [8, 20], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'α-Hydroxymetizolam', fraction: 0.45, note: 'Active; main urinary marker.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'α-Hydroxymetizolam', active: true, halfLifeH: 14, potencyRel: 0.7, fraction: 0.45 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [6, 12], afterEffectsH: [12, 30], bioavailability: 0.9,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: ['Fatal with opioids or alcohol. Rapid tolerance and severe withdrawal.'],
  sources: ['Forensic literature', 'PsychonautWiki consensus ranges']
},

{
  id: 'nifoxipam', name: 'Nifoxipam', aliases: ['3-hydroxydesmethylflunitrazepam'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'hypnotic', 'amnestic', 'research-chemical', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 6,
  mechanism: 'Active metabolite of flunitrazepam sold as a research chemical in its own right. Strongly hypnotic with pronounced amnestic effects.',
  halfLife: { hours: 20, range: [12, 30], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Direct glucuronidation of the 3-hydroxy group', product: 'Nifoxipam glucuronide', fraction: 0.6,
        note: 'Already hydroxylated, so it largely bypasses phase I — fewer CYP interactions than most of the class.' },
      { enzyme: 'CYP3A4', reaction: 'Nitro reduction', product: '7-Aminonifoxipam', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Nifoxipam glucuronide', active: false, halfLifeH: 20, fraction: 0.6 },
      { name: '7-Aminonifoxipam', active: false, halfLifeH: 22, fraction: 0.2, note: 'Urinary marker.' }
    ],
    substrateOf: ['UGT', 'CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [6, 10], afterEffectsH: [12, 30], bioavailability: 0.9,
      doses: { threshold: 0.1, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: ['Strong hypnotic and amnestic. Fatal with opioids or alcohol.'],
  sources: ['PsychonautWiki consensus ranges', 'Forensic identification literature']
},

{
  id: 'meclonazepam', name: 'Meclonazepam', aliases: ['3-methylclonazepam'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'amnestic', 'research-chemical', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'Methylated clonazepam analogue, originally investigated as an antiparasitic for schistosomiasis. Long-acting with strong sedation.',
  halfLife: { hours: 25, range: [15, 45], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Nitro group reduction', product: '7-Aminomeclonazepam', fraction: 0.6, note: 'Standard urinary marker for the nitrobenzodiazepines.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
    ],
    metabolites: [{ name: '7-Aminomeclonazepam', active: false, halfLifeH: 28, fraction: 0.6 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [8, 16], afterEffectsH: [18, 48], bioavailability: 0.9,
      doses: { threshold: 0.15, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: ['Long-acting with substantial next-day impairment. Fatal with opioids or alcohol.'],
  sources: ['PsychonautWiki consensus ranges']
},

{
  id: 'norflurazepam', name: 'Norflurazepam', aliases: ['desalkylflurazepam', 'n-desalkylflurazepam'],
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 10,
  mechanism: 'The long-lived active metabolite shared by flurazepam, quazepam, fludiazepam and flutoprazepam, now sold directly as a research chemical. Extremely long-acting.',
  halfLife: { hours: 80, range: [47, 100], confidence: 'measured',
    notes: 'Well characterised as a metabolite of prescribed drugs — the 47-100 h figure comes from flurazepam pharmacology. Accumulates heavily with repeated dosing.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: '3-Hydroxynorflurazepam', fraction: 0.4 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Norflurazepam glucuronide', fraction: 0.4 }
    ],
    metabolites: [
      { name: '3-Hydroxynorflurazepam', active: true, halfLifeH: 30, potencyRel: 0.5, fraction: 0.4 },
      { name: 'Norflurazepam glucuronide', active: false, halfLifeH: 60, fraction: 0.4 }
    ],
    substrateOf: ['CYP3A4', 'UGT'], excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 300], durationH: [12, 24], afterEffectsH: [48, 120], bioavailability: 0.9,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'A half-life of up to four days means daily use accumulates for weeks before reaching steady state. Impairment compounds invisibly.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['Flurazepam clinical pharmacology (DrugBank DB00690)', 'Forensic DBZD literature']
},

{
  id: '3-hydroxyphenazepam', name: '3-Hydroxyphenazepam',
  class: 'Depressant', family: 'Benzodiazepine', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'long-duration', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 7,
  mechanism: 'The active metabolite of phenazepam, sold separately. Because it is already hydroxylated it bypasses the phase I step, giving a somewhat more predictable profile than the parent.',
  halfLife: { hours: 30, range: [20, 50], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Direct glucuronidation', product: '3-Hydroxyphenazepam glucuronide', fraction: 0.75,
        note: 'Bypasses CYP almost entirely, so classic CYP3A4 interactions largely do not apply.' }
    ],
    metabolites: [{ name: '3-Hydroxyphenazepam glucuronide', active: false, halfLifeH: 30, fraction: 0.75 }],
    substrateOf: ['UGT'], excretion: 'Renal, as the glucuronide.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 240], durationH: [10, 18], afterEffectsH: [24, 72], bioavailability: 0.9,
      doses: { threshold: 0.2, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: ['Long-acting with multi-day impairment. Fatal with opioids or alcohol.'],
  sources: ['Phenazepam metabolism literature', 'PsychonautWiki consensus ranges']
},

{
  id: 'zapizolam', name: 'Zapizolam',
  class: 'Depressant', family: 'Benzodiazepine (triazolo)', schedule: 'Varies / analogue',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'research-chemical', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Triazolobenzodiazepine that appeared on the research chemical market in the early 2020s. Essentially uncharacterised.',
  halfLife: { hours: 12, range: [6, 24], confidence: 'anecdotal',
    notes: 'No published pharmacokinetic data of any kind. This figure is inferred from user-reported durations and should be treated as opinion.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Presumed hydroxylation', product: 'Hydroxyzapizolam', fraction: 0.5, note: 'Assumed by analogy with the triazolo class; not confirmed.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Hydroxyzapizolam', active: true, halfLifeH: 14, potencyRel: 0.5, fraction: 0.5, note: 'Presumed active; not confirmed.' }],
    substrateOf: ['CYP3A4'], excretion: 'Presumed renal.', confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 150], durationH: [6, 12], afterEffectsH: [12, 30], bioavailability: 0.9,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg' } }
  },
  warnings: [
    'Everything in this entry is inferred from user reports. There is no published pharmacology, no toxicology and no dosing data.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['User reports only — no published source']
},

{
  id: 'bentazepam', name: 'Bentazepam', aliases: ['tiadipona'],
  class: 'Depressant', family: 'Thienodiazepine', schedule: 'Prescription (Spain) / varies',
  tags: ['depressant', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'anxiolytic',
         'hepatotoxic-rare', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Thienodiazepine anxiolytic marketed in Spain; short-acting with relatively mild sedation.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: '3-Hydroxybentazepam', fraction: 0.5 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.35 }
    ],
    metabolites: [{ name: '3-Hydroxybentazepam', active: true, halfLifeH: 4, potencyRel: 0.5, fraction: 0.5 }],
    substrateOf: ['CYP3A4'], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 120], durationH: [4, 7], afterEffectsH: [4, 12], bioavailability: 0.9,
      doses: { threshold: 6.25, light: [12.5, 25], common: [25, 50], strong: [50, 75], heavy: 75, unit: 'mg' } }
  },
  warnings: [
    'Rare but documented idiosyncratic hepatotoxicity — unusual among benzodiazepines.',
    'Fatal with opioids or alcohol.'
  ],
  sources: ['Spanish prescribing literature']
},

/* ==========================================================================
   Rare and obscure benzodiazepines
   --------------------------------------------------------------------------
   Two groups, and the distinction matters:

   1. Compounds that were properly developed and MARKETED, but only in one or
      two countries, or that were withdrawn. These have real human PK data —
      they went through regulatory approval somewhere — even though almost
      nobody outside their home market has heard of them.

   2. Designer benzodiazepines that never had a licit existence at all. For
      these the pharmacology is inferred from the parent they are derived
      from, and is labelled `analogue` accordingly.

   Several of group 2 are PRODRUGS of compounds already in this database.
   That is the single most useful thing to know about them: their own
   half-life is largely irrelevant, because what determines the duration is
   the compound they turn into.
   ========================================================================== */

{
  id: 'n-methylclonazepam', name: 'N-Methylclonazepam', aliases: ['methylclonazepam', 'n-methyl clonazepam', '1-methylclonazepam'],
  class: 'Depressant', family: 'Designer benzodiazepine (nitro)', schedule: 'Unscheduled in most jurisdictions',
  formula: 'C16H12ClN3O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'research-chemical', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 14, minRedoseDays: 7,
  mechanism: 'Clonazepam bearing a methyl group on the N1 position of the diazepine ring. N1-alkylated benzodiazepines are characteristically dealkylated back to the parent compound in vivo, so this behaves largely as a slower-onset delivery vehicle for clonazepam rather than as a distinct drug.',
  halfLife: { hours: 30, range: [20, 50], confidence: 'analogue',
    notes: 'NOT MEASURED. Taken from clonazepam, into which this is expected to be substantially converted. The parent compound has a 30-40 h half-life, and that — not this molecule — is what governs the duration.' },
  metabolism: {
    firstPass: 'Presumed substantial, with N-demethylation the dominant first-pass event.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N1-demethylation', product: 'Clonazepam', fraction: 0.7,
        note: 'The defining reaction. N1-alkyl benzodiazepines are dealkylated to the parent, which is why this is best understood as a clonazepam prodrug.' },
      { enzyme: 'CYP3A4', reaction: 'Nitroreduction (after conversion)', product: '7-Aminoclonazepam', from: 'Clonazepam', fraction: 0.2,
        note: 'The downstream clonazepam route. 7-aminoclonazepam is the metabolite detected in urine for up to two weeks.' }
    ],
    metabolites: [
      { name: 'Clonazepam', active: true, halfLifeH: 35, potencyRel: 1.0, fraction: 0.7,
        note: 'A fully active benzodiazepine in its own right, and the reason this compound lasts as long as it does.' },
      { name: '7-Aminoclonazepam', active: false, halfLifeH: 20, fraction: 0.2, note: 'Via clonazepam. The standard urinary marker.' }
    ],
    substrateOf: ['CYP3A4'],
    inhibits: [], induces: [],
    excretion: 'Presumed renal as conjugated amino metabolites, following the clonazepam route.',
    confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 240], durationH: [8, 14], afterEffectsH: [8, 24], bioavailability: 0.8,
      doses: { threshold: 0.2, light: [0.3, 0.7], common: [0.7, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg',
        note: 'EXTRAPOLATED FROM CLONAZEPAM, not measured. Nobody has established a dose ladder for this compound in humans. Treat these numbers as a starting hypothesis, not a guide.' } },
    sublingual: { onsetMin: [15, 40], peakMin: [45, 120], durationH: [8, 14], afterEffectsH: [8, 24], bioavailability: 0.85,
      doses: { threshold: 0.2, light: [0.3, 0.7], common: [0.7, 1.5], strong: [1.5, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'NO HUMAN PHARMACOKINETIC DATA EXISTS. Every number on this page is extrapolated from clonazepam. If the conversion fraction is different from what is assumed here, the real duration and potency differ accordingly.',
    'Behaves as a prodrug, which makes it dangerous to redose. Onset is slower than clonazepam because conversion must happen first, and the classic designer-benzodiazepine death is redosing during that delay and then receiving the whole accumulated amount at once.',
    'Full cross-tolerance and cross-dependence with all other benzodiazepines. Abrupt withdrawal after sustained use causes seizures and is potentially fatal — always taper.',
    'Combining with any opioid, alcohol or other CNS depressant carries a high risk of fatal respiratory depression.'
  ],
  refs: ['EMCDDA new psychoactive substances reporting', 'Structural inference from clonazepam pharmacology']
},

{
  id: 'cloniprazepam', name: 'Cloniprazepam', aliases: ['n-cyclopropylmethyl clonazepam', 'cyclopropylmethylclonazepam'],
  class: 'Depressant', family: 'Designer benzodiazepine (nitro)', schedule: 'Unscheduled in most jurisdictions',
  formula: 'C19H16ClN3O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'research-chemical', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 14, minRedoseDays: 7,
  mechanism: 'Clonazepam carrying a cyclopropylmethyl group at N1. As with other N1-alkylated benzodiazepines it is dealkylated in vivo back to clonazepam, so it functions as a clonazepam prodrug with a slower onset and a longer effective tail.',
  halfLife: { hours: 35, range: [20, 60], confidence: 'analogue',
    notes: 'NOT MEASURED. Assigned from clonazepam, the compound it converts into. User reports describe an unusually long and heavy experience, which is consistent with prodrug conversion feeding a long-half-life parent, but no PK study exists.' },
  metabolism: {
    firstPass: 'Presumed extensive N-dealkylation on first pass.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N1-dealkylation (loss of the cyclopropylmethyl group)', product: 'Clonazepam', fraction: 0.75,
        note: 'The defining reaction and the reason the compound behaves the way it does. Bulkier N1 substituents are generally dealkylated more slowly than a plain methyl, which fits the reported delayed onset.' },
      { enzyme: 'CYP3A4', reaction: 'Nitroreduction (downstream of clonazepam)', product: '7-Aminoclonazepam', from: 'Clonazepam', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Clonazepam', active: true, halfLifeH: 35, potencyRel: 1.0, fraction: 0.75,
        note: 'The active species. Cloniprazepam is essentially a delivery vehicle for it.' },
      { name: '7-Aminoclonazepam', active: false, halfLifeH: 20, fraction: 0.2, note: 'Via clonazepam.' }
    ],
    substrateOf: ['CYP3A4'],
    inhibits: [], induces: [],
    excretion: 'Presumed renal as conjugates, following the clonazepam route.',
    confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 300], durationH: [10, 18], afterEffectsH: [12, 36], bioavailability: 0.8,
      doses: { threshold: 0.1, light: [0.2, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg',
        note: 'COMMUNITY ESTIMATE ONLY, derived from user reports and clonazepam equivalence. Frequently described as more potent by weight than clonazepam. No clinical dose ladder exists.' } },
    sublingual: { onsetMin: [30, 90], peakMin: [90, 240], durationH: [10, 18], afterEffectsH: [12, 36], bioavailability: 0.85,
      doses: { threshold: 0.1, light: [0.2, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg' } }
  },
  warnings: [
    'SLOW ONSET, LONG DURATION — the worst combination for redosing. The cyclopropylmethyl group must be removed before the drug does anything, and people who redose during that delay receive a compounded dose hours later, often after they have stopped paying attention.',
    'No human pharmacokinetic data. Everything here is inferred from clonazepam and from user reports.',
    'Reported to produce prolonged amnesia and next-day impairment substantially exceeding what the dose would suggest.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures and is potentially fatal. Never stop abruptly.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['EMCDDA new psychoactive substances reporting', 'Structural inference from clonazepam pharmacology']
},

{
  id: 'camazepam', name: 'Camazepam', aliases: ['albego', 'limpidon', 'paxor'],
  class: 'Depressant', family: 'Benzodiazepine (temazepam ester)', schedule: 'IV (UN Psychotropic Convention)',
  cas: '36104-80-0', formula: 'C19H18ClN3O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 10, minRedoseDays: 5,
  mechanism: 'The dimethyl carbamate ester of temazepam, marketed in Italy and Spain from the 1970s. Developed on the premise that esterifying the 3-hydroxy group would preserve anxiolytic activity while reducing sedation and motor impairment — and unusually for such claims, comparative trials broadly supported it. It is markedly less sedating than diazepam at equivalent anxiolytic effect.',
  halfLife: { hours: 12, range: [7, 20], confidence: 'measured',
    notes: 'For the parent ester. The temazepam and oxazepam it produces carry the effect well beyond this, so the functional duration is longer than the number suggests.' },
  metabolism: {
    firstPass: 'Substantial — a meaningful share of a dose is de-esterified before it reaches the circulation.',
    pathways: [
      { enzyme: 'Carboxylesterase / CYP3A4', reaction: 'Hydrolysis of the dimethylcarbamate ester', product: 'Temazepam', fraction: 0.6,
        note: 'The principal route, and the reason camazepam is best understood as a partial temazepam prodrug.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Desmethylcamazepam', fraction: 0.2 },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Downstream demethylation of temazepam', product: 'Oxazepam', from: 'Temazepam', fraction: 0.15 },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation of the hydroxy metabolites', product: 'Oxazepam glucuronide', fraction: 0.6 }
    ],
    metabolites: [
      { name: 'Temazepam', active: true, halfLifeH: 10, potencyRel: 1.0, fraction: 0.6,
        note: 'A licensed hypnotic in its own right. This is where most of camazepam activity actually comes from.' },
      { name: 'Desmethylcamazepam', active: true, halfLifeH: 14, potencyRel: 0.6, fraction: 0.2 },
      { name: 'Oxazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.15,
        note: 'Via temazepam. The common terminal active metabolite of this whole family.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15', 'CES1'],
    inhibits: [], induces: [],
    excretion: 'Renal, largely as oxazepam glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [60, 180], durationH: [6, 10], afterEffectsH: [4, 12], bioavailability: 0.75,
      doses: { threshold: 5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg',
        note: 'The marketed anxiolytic dose was 10-30 mg daily, usually divided. Roughly equivalent to 5-10 mg diazepam per 20 mg.' } }
  },
  warnings: [
    'Discontinued in most markets and hard to obtain legitimately, so anything sold under this name is unlikely to have been verified.',
    'Less sedating than diazepam does not mean less dependence-forming. Cross-tolerance and cross-dependence with all benzodiazepines are complete, and withdrawal after sustained use can cause seizures.',
    'Its effect outlasts its own half-life because it converts to temazepam and then oxazepam. Judging duration from the parent half-life alone will underestimate it.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'UN Convention on Psychotropic Substances Schedule IV']
},

{
  id: 'delorazepam', name: 'Delorazepam', aliases: ['chlordesmethyldiazepam', 'en', 'dadumir'],
  class: 'Depressant', family: 'Benzodiazepine (1,4)', schedule: 'IV (UN); prescription in Italy',
  cas: '2894-67-9', formula: 'C15H10Cl2N2O',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'long-acting', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 18, minRedoseDays: 7,
  mechanism: 'Nordazepam with an extra chlorine at the 2-position of the pendant phenyl ring. Still prescribed in Italy, where it is a mainstream anxiolytic, and essentially unknown elsewhere. It is also the active metabolite of several other benzodiazepines, which is why it turns up in toxicology unexpectedly.',
  halfLife: { hours: 80, range: [50, 144], confidence: 'measured',
    notes: 'Genuinely very long, and it accumulates substantially over days of repeated dosing. Steady state takes one to two weeks to reach — and the same to clear.' },
  metabolism: {
    firstPass: 'Modest; oral bioavailability is high.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: 'Lorazepam', fraction: 0.4,
        note: 'It hydroxylates to lorazepam — a licensed drug in its own right, and an active metabolite with a 12-15 h half-life.' },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation of the hydroxy metabolite', product: 'Lorazepam glucuronide', fraction: 0.4 },
      { enzyme: 'CYP2C19', reaction: 'Minor oxidative routes', product: 'Hydroxylated metabolites', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Lorazepam', active: true, halfLifeH: 14, potencyRel: 1.0, fraction: 0.4,
        note: 'A fully active benzodiazepine. Delorazepam use produces positive lorazepam toxicology.' },
      { name: 'Lorazepam glucuronide', from: 'Lorazepam', active: false, halfLifeH: 16, fraction: 0.4 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal, largely as the glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 180], durationH: [10, 24], afterEffectsH: [12, 48], bioavailability: 0.85,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg',
        note: 'Prescribed at 0.5-2 mg daily in Italy. Roughly 10 mg diazepam-equivalent per 1 mg.' } }
  },
  warnings: [
    'ACCUMULATES HEAVILY. With an 80 h half-life, daily dosing raises the level for one to two weeks before it plateaus — so a dose that feels mild on day one can be profoundly sedating by day ten. This is the characteristic error with long-acting benzodiazepines.',
    'Produces lorazepam as an active metabolite, so the effect substantially outlasts what the parent alone would give.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines. Withdrawal after sustained use can cause seizures and is potentially fatal; taper, never stop abruptly.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Italian medicines agency (AIFA) product information']
},

{
  id: 'nimetazepam', name: 'Nimetazepam', aliases: ['erimin', 'erimin-5', 'methylnitrazepam'],
  class: 'Depressant', family: 'Benzodiazepine (nitro)', schedule: 'IV (UN); withdrawn in Japan 2015',
  cas: '2011-67-8', formula: 'C16H13N3O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'hypnotic', 'high-abuse-potential', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 10, minRedoseDays: 7,
  mechanism: 'N-methylated nitrazepam, marketed in Japan as Erimin and withdrawn there in 2015. Notorious across Southeast Asia — "Happy 5", after the 5 mg tablet — where it became one of the most heavily trafficked benzodiazepines because of an unusually euphoric and disinhibiting profile.',
  halfLife: { hours: 21, range: [14, 30], confidence: 'measured' },
  metabolism: {
    firstPass: 'Moderate; well absorbed orally.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nitrazepam', fraction: 0.45,
        note: 'Converts to nitrazepam, itself a licensed long-acting hypnotic — so the effective duration is much longer than the parent half-life implies.' },
      { enzyme: 'Nitroreductase (gut flora and hepatic)', reaction: 'Reduction of the 7-nitro group', product: '7-Aminonimetazepam', fraction: 0.35 },
      { enzyme: 'NAT2', reaction: 'Acetylation of the amino metabolite', product: '7-Acetamidonimetazepam', fraction: 0.2,
        note: 'NAT2 slow acetylators clear this step more slowly, as with clonazepam and nitrazepam.' }
    ],
    metabolites: [
      { name: 'Nitrazepam', active: true, halfLifeH: 26, potencyRel: 0.8, fraction: 0.45,
        note: 'Active hypnotic. The main reason nimetazepam produces heavy next-day impairment.' },
      { name: '7-Aminonimetazepam', active: false, halfLifeH: 20, fraction: 0.35, note: 'The principal urinary marker.' },
      { name: '7-Acetamidonimetazepam', active: false, halfLifeH: 24, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4', 'NAT2'],
    inhibits: [], induces: [],
    excretion: 'Renal as conjugated amino and acetamido metabolites.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 150], durationH: [6, 10], afterEffectsH: [8, 20], bioavailability: 0.8,
      doses: { threshold: 1, light: [2, 4], common: [4, 8], strong: [8, 15], heavy: 15, unit: 'mg',
        note: 'The marketed hypnotic dose was 3-5 mg at night. Roughly 10 mg diazepam-equivalent per 5 mg.' } }
  },
  warnings: [
    'Unusually high abuse potential even by benzodiazepine standards — the reason it was withdrawn in Japan and is heavily controlled across Southeast Asia. Reported euphoria and disinhibition drive escalation faster than with most of this class.',
    'Strong next-day impairment. Its nitrazepam metabolite is long-acting, so driving the following morning is genuinely dangerous.',
    'Marked disinhibition and anterograde amnesia at higher doses, with the associated risk of doing things you will not remember.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'UNODC Global SMART reporting on Southeast Asia']
},

{
  id: 'cinolazepam', name: 'Cinolazepam', aliases: ['gerodorm'],
  class: 'Depressant', family: 'Benzodiazepine (1,4)', schedule: 'IV (UN); prescription in Austria',
  cas: '75696-02-5', formula: 'C18H13ClFN3O2',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'hypnotic', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 10, minRedoseDays: 5,
  mechanism: 'A hypnotic marketed almost exclusively in Austria and a few neighbouring countries as Gerodorm. Structurally a temazepam relative carrying a cyanoethyl group, which is cleaved in vivo. Distinguished clinically by preserving sleep architecture better than most benzodiazepine hypnotics.',
  halfLife: { hours: 9, range: [7, 14], confidence: 'measured' },
  metabolism: {
    firstPass: 'Moderate.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Cleavage of the cyanoethyl group', product: 'Temazepam', fraction: 0.5,
        note: 'Converts substantially to temazepam, which carries much of the hypnotic effect.' },
      { enzyme: 'UGT2B15', reaction: 'Direct glucuronidation', product: 'Cinolazepam glucuronide', fraction: 0.3 },
      { enzyme: 'CYP3A4', reaction: 'Downstream demethylation of temazepam', product: 'Oxazepam', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Temazepam', active: true, halfLifeH: 10, potencyRel: 1.0, fraction: 0.5, note: 'A licensed hypnotic in its own right.' },
      { name: 'Oxazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.15, note: 'Via temazepam.' },
      { name: 'Cinolazepam glucuronide', active: false, halfLifeH: 10, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal, largely as glucuronide conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 150], durationH: [6, 9], afterEffectsH: [3, 10], bioavailability: 0.8,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg',
        note: 'The marketed hypnotic dose is 20-40 mg at night. Roughly 10 mg diazepam-equivalent per 40 mg.' } }
  },
  warnings: [
    'Effectively unobtainable outside central Europe, so anything sold under this name elsewhere is unverified.',
    'Its temazepam and oxazepam metabolites carry the effect past the parent half-life, so next-morning impairment is longer than 9 hours would suggest.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Austrian medicines register product information']
},

{
  id: 'ketazolam', name: 'Ketazolam', aliases: ['anxon', 'loftran', 'solatran'],
  class: 'Depressant', family: 'Benzodiazepine (oxazolo)', schedule: 'IV (UN); largely discontinued',
  cas: '27223-35-4', formula: 'C20H17ClN2O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'muscle-relaxant', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 16, minRedoseDays: 7,
  mechanism: 'An oxazolobenzodiazepine prodrug developed in the 1970s and marketed in the UK, Spain and Canada. The oxazolo ring opens in the stomach and liver to release diazepam and, downstream, nordazepam. It was promoted for anxiety with muscle spasm on the basis of causing less drowsiness than diazepam at comparable anxiolytic effect.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'measured',
    notes: 'MISLEADING ON ITS OWN. The parent is cleared in about 2 hours, but it converts to diazepam and then nordazepam, whose half-lives are 43 h and 80 h. Functional duration is measured in days, not hours.' },
  metabolism: {
    firstPass: 'Extensive and intended — the prodrug is designed to open on first pass.',
    pathways: [
      { enzyme: 'Gastric acid / CYP3A4', reaction: 'Ring opening of the oxazolo system', product: 'Diazepam', fraction: 0.6,
        note: 'The defining reaction. Ketazolam is essentially a slow-release diazepam.' },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'N-demethylation of diazepam', product: 'Nordazepam', fraction: 0.3,
        note: 'Downstream. Nordazepam has an 80 h half-life and is what actually accumulates.' },
      { enzyme: 'CYP3A4', reaction: 'Direct hydrolysis to the desmethyl form', product: 'Desmethylketazolam', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Diazepam', active: true, halfLifeH: 43, potencyRel: 1.0, fraction: 0.6,
        note: 'The main active species. Ketazolam use produces positive diazepam toxicology.' },
      { name: 'Nordazepam', active: true, halfLifeH: 80, potencyRel: 0.8, fraction: 0.3,
        note: 'Via diazepam. Still rising days after a dose — this is what makes the compound effectively self-tapering.' },
      { name: 'Oxazepam', from: 'Nordazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.2, note: 'Via nordazepam; the terminal active metabolite.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal, as oxazepam and temazepam glucuronides after the full cascade.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 240], durationH: [8, 20], afterEffectsH: [12, 48], bioavailability: 0.8,
      doses: { threshold: 7.5, light: [15, 30], common: [30, 45], strong: [45, 60], heavy: 60, unit: 'mg',
        note: 'The marketed anxiolytic dose was 15-60 mg daily. Roughly 10 mg diazepam-equivalent per 15-30 mg.' } }
  },
  warnings: [
    'ITS OWN HALF-LIFE IS 2 HOURS AND MEANS NOTHING. Everything it does comes from diazepam and nordazepam downstream. Reading the parent half-life as the duration is the specific error this entry exists to prevent — check the metabolite breakdown instead.',
    'Accumulates over days to weeks through nordazepam, which is still rising three days after a dose.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Fielding & Hoffmann 1979, Br J Clin Pharmacol']
},

{
  id: 'loprazolam', name: 'Loprazolam', aliases: ['dormonoct', 'havlane', 'somnovit'],
  class: 'Depressant', family: 'Benzodiazepine (imidazo, nitro)', schedule: 'IV (UN); prescription in UK and France',
  cas: '61197-73-7', formula: 'C23H21ClN6O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'hypnotic', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 10, minRedoseDays: 5,
  mechanism: 'An imidazobenzodiazepine hypnotic still licensed in the UK and France. Notable for slow and somewhat erratic absorption — onset can take over an hour — which makes it a poor choice for sleep-onset insomnia despite being sold for exactly that.',
  halfLife: { hours: 8, range: [4, 15], confidence: 'measured',
    notes: 'Longer in the elderly, and the variability between individuals is unusually wide even for a benzodiazepine.' },
  metabolism: {
    firstPass: 'Substantial, and a large part of why absorption is slow and variable.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-oxidation of the piperazine ring', product: 'Loprazolam N-oxide', fraction: 0.5,
        note: 'The main route. The N-oxide is only weakly active.' },
      { enzyme: 'Nitroreductase', reaction: 'Reduction of the nitro group', product: 'Amino-loprazolam', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Loprazolam N-oxide', active: true, halfLifeH: 9, potencyRel: 0.2, fraction: 0.5, note: 'Weakly active; contributes modestly to the tail.' },
      { name: 'Amino-loprazolam', active: false, halfLifeH: 10, fraction: 0.25, note: 'The main urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'UGT'],
    inhibits: [], induces: [],
    excretion: 'Renal, largely as conjugated metabolites; very little unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [120, 300], durationH: [6, 9], afterEffectsH: [4, 12], bioavailability: 0.8,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 1.5], strong: [1.5, 2], heavy: 2, unit: 'mg',
        note: 'Licensed at 1 mg at night, raised to 1.5-2 mg if needed. Roughly 10 mg diazepam-equivalent per 1 mg.' } }
  },
  warnings: [
    'SLOW, ERRATIC ONSET — often over an hour, sometimes much longer. The classic harm here is taking a second tablet because the first "did not work", then receiving both at once.',
    'Food substantially delays absorption further.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'UK Summary of Product Characteristics, loprazolam']
},

{
  id: 'medazepam', name: 'Medazepam', aliases: ['nobrium', 'rudotel', 'ansilan'],
  class: 'Depressant', family: 'Benzodiazepine (1,4)', schedule: 'IV (UN); prescription in parts of Europe',
  cas: '2898-12-6', formula: 'C16H15ClN2',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 16, minRedoseDays: 7,
  mechanism: 'An unusually lipophilic benzodiazepine — it lacks the 2-keto oxygen that most of the class carries — still prescribed in Germany, Russia and parts of eastern Europe as a "daytime anxiolytic". Functions largely as a prodrug: it is oxidised to diazepam and nordazepam, which do most of the work.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'measured',
    notes: 'As with ketazolam, the parent number is misleading. Its metabolites have half-lives of 43 h and 80 h, and those govern the real duration.' },
  metabolism: {
    firstPass: 'Extensive oxidation on first pass.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nordazepam', fraction: 0.45,
        note: 'The dominant route. Nordazepam has an 80 h half-life and accumulates heavily.' },
      { enzyme: 'CYP3A4', reaction: '2-oxidation', product: 'Diazepam', fraction: 0.3 },
      { enzyme: 'CYP2C19 / UGT2B15', reaction: 'Downstream hydroxylation and conjugation', product: 'Oxazepam glucuronide', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Nordazepam', from: 'Diazepam', active: true, halfLifeH: 80, potencyRel: 0.8, fraction: 0.45,
        note: 'The main active species and the reason medazepam accumulates over days.' },
      { name: 'Diazepam', active: true, halfLifeH: 43, potencyRel: 1.0, fraction: 0.3 },
      { name: 'Oxazepam', from: 'Nordazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.2, note: 'Terminal active metabolite.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal, as oxazepam glucuronide after the full cascade.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [60, 180], durationH: [6, 14], afterEffectsH: [12, 48], bioavailability: 0.75,
      doses: { threshold: 5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg',
        note: 'Prescribed at 10-30 mg daily, divided. Roughly 10 mg diazepam-equivalent per 10-20 mg.' } }
  },
  warnings: [
    'A PRODRUG. Its own 2 h half-life is irrelevant — nordazepam at 80 h is what you are actually taking, and it accumulates for a week or more of daily use.',
    'Marketed as a non-sedating daytime anxiolytic, which understates how much it builds up with repeated dosing.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'German medicines register product information']
},

{
  id: 'halazepam', name: 'Halazepam', aliases: ['paxipam', 'alapryl'],
  class: 'Depressant', family: 'Benzodiazepine (1,4)', schedule: 'IV (UN); discontinued',
  cas: '23092-17-3', formula: 'C17H12ClF3N2O',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 16, minRedoseDays: 7,
  mechanism: 'Nordazepam carrying a trifluoroethyl group at N1, marketed in the US as Paxipam until the 1990s. The fluorinated substituent was intended to soften the onset; in practice the compound is dealkylated to nordazepam, which is where essentially all of its activity comes from.',
  halfLife: { hours: 14, range: [10, 20], confidence: 'measured',
    notes: 'The parent figure. Nordazepam at 80 h dominates the real duration and accumulates over days.' },
  metabolism: {
    firstPass: 'Extensive N-dealkylation.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation (loss of the trifluoroethyl group)', product: 'Nordazepam', fraction: 0.7,
        note: 'The dominant route and the source of nearly all activity.' },
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: '3-Hydroxyhalazepam', fraction: 0.15 },
      { enzyme: 'UGT2B15', reaction: 'Downstream conjugation', product: 'Oxazepam glucuronide', fraction: 0.5 }
    ],
    metabolites: [
      { name: 'Nordazepam', active: true, halfLifeH: 80, potencyRel: 1.0, fraction: 0.7,
        note: 'The active species. Halazepam is effectively a nordazepam prodrug.' },
      { name: 'Oxazepam', from: 'Nordazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.5, note: 'Via nordazepam.' },
      { name: '3-Hydroxyhalazepam', active: true, halfLifeH: 12, potencyRel: 0.3, fraction: 0.15 }
    ],
    substrateOf: ['CYP3A4', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal, largely as oxazepam glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [90, 240], durationH: [8, 16], afterEffectsH: [12, 48], bioavailability: 0.8,
      doses: { threshold: 20, light: [20, 40], common: [40, 80], strong: [80, 120], heavy: 160, unit: 'mg',
        note: 'The marketed dose was 20-40 mg three or four times daily — unusually large numbers for a benzodiazepine, because the compound is weak by weight. Roughly 10 mg diazepam-equivalent per 40 mg.' } }
  },
  warnings: [
    'Discontinued everywhere; anything sold under this name is unverified.',
    'A nordazepam prodrug, so it accumulates over a week or more of daily use regardless of what its own 14 h half-life suggests.',
    'The milligram numbers are much larger than for other benzodiazepines. Do not read 40 mg as being in the same range as 40 mg of anything else in this class.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Chun et al. 1977, Clin Pharmacol Ther']
},

{
  id: 'tetrazepam', name: 'Tetrazepam', aliases: ['myolastan', 'musaril', 'clinoxan'],
  class: 'Depressant', family: 'Benzodiazepine (1,4)', schedule: 'IV (UN); withdrawn EU 2013',
  cas: '10379-14-3', formula: 'C16H17ClN2O',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'muscle-relaxant', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 12, minRedoseDays: 5,
  mechanism: 'A benzodiazepine whose pendant phenyl ring is replaced by a cyclohexenyl ring, which shifts the profile toward muscle relaxation and away from sedation. It was prescribed very widely in France, Germany and Spain for painful muscle spasm until the EU withdrew it in 2013.',
  halfLife: { hours: 20, range: [10, 26], confidence: 'measured' },
  metabolism: {
    firstPass: 'Moderate; oral bioavailability around 65%.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nortetrazepam', fraction: 0.4,
        note: 'The main active metabolite, with a longer half-life than the parent.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the cyclohexenyl ring', product: '4-Hydroxytetrazepam', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Nortetrazepam', active: true, halfLifeH: 28, potencyRel: 0.8, fraction: 0.4,
        note: 'Outlasts the parent and is the main reason the effect carries into the next day.' },
      { name: '4-Hydroxytetrazepam', active: true, halfLifeH: 14, potencyRel: 0.3, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'UGT'],
    inhibits: [], induces: [],
    excretion: 'Renal as conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [60, 180], durationH: [8, 16], afterEffectsH: [8, 24], bioavailability: 0.65,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 150, unit: 'mg',
        note: 'Prescribed at 50-150 mg daily for muscle spasm. Roughly 10 mg diazepam-equivalent per 100 mg.' } }
  },
  warnings: [
    'WITHDRAWN ACROSS THE EU IN 2013 for severe cutaneous reactions — Stevens-Johnson syndrome, toxic epidermal necrolysis and DRESS. That is an uncommon reason to withdraw a benzodiazepine and it is the single most important fact about this compound. Any new rash while taking it needs urgent medical attention.',
    'Marketed as a muscle relaxant rather than a sedative, which led to it being prescribed casually and for long periods — dependence was common.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['EMA Article 107i referral, tetrazepam, 2013', 'Martindale: The Complete Drug Reference']
},

{
  id: 'quazepam', name: 'Quazepam', aliases: ['doral', 'dormalin'],
  class: 'Depressant', family: 'Benzodiazepine (thione, 1,4)', schedule: 'IV (UN); prescription in US and Japan',
  cas: '36735-22-5', formula: 'C17H11ClF4N2S',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'hypnotic', 'long-acting', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 14, minRedoseDays: 7,
  mechanism: 'Pharmacologically the most interesting compound in this group: one of very few benzodiazepines with genuine SUBTYPE SELECTIVITY, preferring the alpha-1 subunit that mediates sedation over the alpha-2 and alpha-3 subunits that mediate anxiolysis and muscle relaxation. In principle that means sleep without the ataxia — and it partly delivers, though its long-lived metabolites undercut the advantage.',
  halfLife: { hours: 39, range: [25, 41], confidence: 'measured',
    notes: 'Long, and its N-desalkyl metabolite is longer still at 70-75 h. Quazepam accumulates over about two weeks of nightly use.' },
  metabolism: {
    firstPass: 'Extensive; absorption is improved substantially by food, which raises exposure by around a third.',
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C9', reaction: 'Oxidation of the thione group', product: '2-Oxoquazepam', fraction: 0.5,
        note: 'Retains the alpha-1 selectivity of the parent.' },
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'N-Desalkyl-2-oxoquazepam', fraction: 0.35,
        note: 'The problem metabolite: a 70-75 h half-life, and it has LOST the subtype selectivity — so with repeated dosing the pharmacology drifts back toward an ordinary long-acting benzodiazepine.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.15 }
    ],
    metabolites: [
      { name: '2-Oxoquazepam', active: true, halfLifeH: 40, potencyRel: 1.0, fraction: 0.5,
        note: 'Active and alpha-1 selective like the parent.' },
      { name: 'N-Desalkyl-2-oxoquazepam', active: true, halfLifeH: 72, potencyRel: 0.6, fraction: 0.35,
        note: 'Non-selective, very long-lived, and the reason next-day impairment accumulates with nightly use.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2C9', 'UGT'],
    inhibits: [], induces: [],
    excretion: 'Renal ~31%, faecal ~23%, almost entirely as metabolites.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [90, 180], durationH: [7, 12], afterEffectsH: [12, 36], bioavailability: 0.8,
      doses: { threshold: 3.75, light: [7.5, 7.5], common: [7.5, 15], strong: [15, 30], heavy: 30, unit: 'mg',
        note: 'Licensed at 7.5-15 mg at night. Roughly 10 mg diazepam-equivalent per 15 mg.' } }
  },
  warnings: [
    'ACCUMULATES FOR ABOUT TWO WEEKS. Its N-desalkyl metabolite has a 72 h half-life, so nightly use produces steadily rising daytime sedation that people rarely connect to a sleeping tablet taken a fortnight ago.',
    'Taking it with food raises exposure by roughly a third — a real and easily overlooked difference.',
    'The alpha-1 selectivity that makes it interesting is progressively diluted by the non-selective metabolite as it builds up.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['US Prescribing Information, Doral (quazepam)', 'Hilbert & Battista 1991, J Clin Psychiatry']
},

{
  id: 'ethyl-loflazepate', name: 'Ethyl loflazepate', aliases: ['victan', 'meilax', 'ronlax', 'loflazepate'],
  class: 'Depressant', family: 'Benzodiazepine (1,4 ester)', schedule: 'IV (UN); prescription in France and Japan',
  cas: '29177-84-2', formula: 'C18H14ClFN2O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'long-acting', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 20, minRedoseDays: 7,
  mechanism: 'An ester prodrug marketed in France as Victan and in Japan as Meilax. It is hydrolysed to descarboxyloflazepate, which is the long-lived active species. Used for generalised anxiety on the strength of a very long duration allowing once-daily dosing.',
  halfLife: { hours: 100, range: [50, 150], confidence: 'measured',
    notes: 'For the active metabolite, which is what matters — the parent ester is hydrolysed quickly. One of the longest-acting benzodiazepines in clinical use anywhere.' },
  metabolism: {
    firstPass: 'Extensive and by design — the ester is cleaved before it reaches the systemic circulation.',
    pathways: [
      { enzyme: 'CES1 (carboxylesterase)', reaction: 'Ester hydrolysis', product: 'Descarboxyloflazepate', fraction: 0.8,
        note: 'The activating step. The parent ester itself contributes essentially nothing.' },
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: 'Hydroxy-descarboxyloflazepate', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Descarboxyloflazepate', active: true, halfLifeH: 100, potencyRel: 1.0, fraction: 0.8,
        note: 'The actual drug. Everything ethyl loflazepate does, it does through this.' },
      { name: 'Hydroxy-descarboxyloflazepate', active: true, halfLifeH: 20, potencyRel: 0.4, fraction: 0.15 }
    ],
    substrateOf: ['CES1', 'CYP3A4', 'UGT'],
    inhibits: [], induces: [],
    excretion: 'Renal as conjugates; negligible unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [90, 300], durationH: [12, 30], afterEffectsH: [24, 72], bioavailability: 0.8,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 3], strong: [3, 6], heavy: 6, unit: 'mg',
        note: 'Prescribed at 1-3 mg daily. Roughly 10 mg diazepam-equivalent per 2 mg.' } }
  },
  warnings: [
    'ONE OF THE LONGEST-ACTING BENZODIAZEPINES IN EXISTENCE — the active metabolite has a ~100 h half-life. Steady state takes two to three weeks, and clearing it takes just as long. Anyone judging their dose after two or three days is seeing a fraction of what it will become.',
    'A prodrug: the parent ester does nothing until hydrolysed, so onset is slow and redosing during the delay is dangerous.',
    'Extremely prolonged withdrawal after sustained use, precisely because it leaves the body so slowly. Tapering takes months rather than weeks.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'French and Japanese product information']
},

{
  id: 'pinazepam', name: 'Pinazepam', aliases: ['domar', 'duna'],
  class: 'Depressant', family: 'Benzodiazepine (1,4)', schedule: 'IV (UN); prescription in Italy',
  cas: '52463-83-9', formula: 'C18H13ClN2O',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 16, minRedoseDays: 7,
  mechanism: 'Diazepam bearing a propargyl (prop-2-ynyl) group at N1, marketed in Italy and Spain as Domar. Like the other N1-substituted 1,4-benzodiazepines it is dealkylated to nordazepam, and reportedly produces less daytime drowsiness than diazepam at comparable anxiolytic effect.',
  halfLife: { hours: 15, range: [10, 22], confidence: 'measured',
    notes: 'The parent figure. Nordazepam at 80 h governs the real duration.' },
  metabolism: {
    firstPass: 'Extensive N-dealkylation.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N1-dealkylation (loss of the propargyl group)', product: 'Nordazepam', fraction: 0.65,
        note: 'The dominant route and the source of most activity.' },
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: '3-Hydroxypinazepam', fraction: 0.2 },
      { enzyme: 'UGT2B15', reaction: 'Downstream conjugation', product: 'Oxazepam glucuronide', fraction: 0.5 }
    ],
    metabolites: [
      { name: 'Nordazepam', active: true, halfLifeH: 80, potencyRel: 1.0, fraction: 0.65,
        note: 'The main active species; accumulates over days of repeated dosing.' },
      { name: 'Oxazepam', from: 'Nordazepam', active: true, halfLifeH: 8, potencyRel: 0.7, fraction: 0.5, note: 'Via nordazepam.' },
      { name: '3-Hydroxypinazepam', active: true, halfLifeH: 12, potencyRel: 0.3, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal, largely as oxazepam glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 75], peakMin: [60, 180], durationH: [8, 16], afterEffectsH: [12, 48], bioavailability: 0.8,
      doses: { threshold: 2.5, light: [2.5, 5], common: [5, 10], strong: [10, 20], heavy: 20, unit: 'mg',
        note: 'Prescribed at 2.5-10 mg daily. Roughly 10 mg diazepam-equivalent per 5-10 mg.' } }
  },
  warnings: [
    'A nordazepam prodrug — it accumulates for a week or more of daily use regardless of its own 15 h half-life.',
    'Effectively unavailable outside Italy and Spain, so anything sold under this name elsewhere is unverified.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Italian medicines agency (AIFA) product information']
},

{
  id: 'cloxazolam', name: 'Cloxazolam', aliases: ['sepazon', 'olcadil', 'akton'],
  class: 'Depressant', family: 'Benzodiazepine (oxazolo)', schedule: 'IV (UN); prescription in Japan, Brazil, Belgium',
  cas: '24166-13-0', formula: 'C17H14Cl2N2O2',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'prodrug', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 16, minRedoseDays: 7,
  mechanism: 'An oxazolobenzodiazepine prodrug still prescribed in Japan, Brazil and Belgium. The oxazolo ring opens in vivo to release delorazepam, which is itself a licensed long-acting anxiolytic in Italy — so this is one of the rare cases where one obscure benzodiazepine is the prodrug of another.',
  halfLife: { hours: 65, range: [40, 100], confidence: 'measured',
    notes: 'Reflecting delorazepam, the active species released. The parent oxazolo compound itself is short-lived.' },
  metabolism: {
    firstPass: 'Extensive and intended — the ring opens on first pass.',
    pathways: [
      { enzyme: 'Gastric acid / CYP3A4', reaction: 'Ring opening of the oxazolo system', product: 'Delorazepam', fraction: 0.7,
        note: 'The activating step. Cloxazolam is essentially a delorazepam prodrug.' },
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation of delorazepam', product: 'Lorazepam', fraction: 0.25,
        note: 'Downstream. Cloxazolam use therefore produces positive lorazepam toxicology.' },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation', product: 'Lorazepam glucuronide', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Delorazepam', active: true, halfLifeH: 80, potencyRel: 1.0, fraction: 0.7,
        note: 'The active drug, and a licensed anxiolytic in its own right in Italy.' },
      { name: 'Lorazepam', from: 'Delorazepam', active: true, halfLifeH: 14, potencyRel: 0.9, fraction: 0.25, note: 'Via delorazepam.' }
    ],
    substrateOf: ['CYP3A4', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal, largely as lorazepam glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [90, 300], durationH: [10, 24], afterEffectsH: [12, 48], bioavailability: 0.8,
      doses: { threshold: 0.5, light: [1, 2], common: [2, 4], strong: [4, 8], heavy: 12, unit: 'mg',
        note: 'Prescribed at 3-12 mg daily, divided. Roughly 10 mg diazepam-equivalent per 2-3 mg.' } }
  },
  warnings: [
    'A PRODRUG OF ANOTHER PRODRUG-LIKE COMPOUND. It releases delorazepam (80 h) which hydroxylates to lorazepam. Its effective duration is days, and it accumulates heavily over one to two weeks of daily use.',
    'Slow onset because ring opening must happen first — redosing during the delay is the classic and dangerous error.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Japanese and Brazilian product information']
},

{
  id: 'fludiazepam', name: 'Fludiazepam', aliases: ['erispan', '2-fluorodiazepam'],
  class: 'Depressant', family: 'Benzodiazepine (1,4)', schedule: 'IV (UN); prescription in Japan',
  cas: '3900-31-0', formula: 'C16H12ClFN2O',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'anxiolytic', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 16, minRedoseDays: 7,
  mechanism: 'Diazepam with a fluorine at the 2-position of the pendant phenyl ring, marketed in Japan as Erispan. The single fluorine raises potency roughly fourfold over diazepam by weight — a clean illustration of how small a structural change can be and still matter.',
  halfLife: { hours: 23, range: [16, 40], confidence: 'measured',
    notes: 'The parent figure; its nordazepam-type metabolite is much longer-lived and extends the real duration considerably.' },
  metabolism: {
    firstPass: 'Moderate.',
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'N-demethylation', product: 'Norfludiazepam', fraction: 0.5,
        note: 'Long-lived active metabolite, analogous to nordazepam from diazepam.' },
      { enzyme: 'CYP3A4', reaction: '3-hydroxylation', product: '3-Hydroxyfludiazepam', fraction: 0.3 },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Norfludiazepam', active: true, halfLifeH: 70, potencyRel: 0.8, fraction: 0.5,
        note: 'Accumulates over days, as nordazepam does from diazepam.' },
      { name: '3-Hydroxyfludiazepam', active: true, halfLifeH: 12, potencyRel: 0.5, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT2B15'],
    inhibits: [], induces: [],
    excretion: 'Renal as conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 50], peakMin: [60, 150], durationH: [8, 16], afterEffectsH: [12, 36], bioavailability: 0.85,
      doses: { threshold: 0.125, light: [0.25, 0.5], common: [0.5, 1], strong: [1, 2], heavy: 2, unit: 'mg',
        note: 'Prescribed at 0.75 mg daily, divided. Roughly 10 mg diazepam-equivalent per 0.5 mg.' } }
  },
  warnings: [
    'Roughly four times the potency of diazepam by weight, so the milligram figures are much smaller. Reading a fludiazepam dose as though it were a diazepam dose is a fourfold overdose.',
    'Its norfludiazepam metabolite accumulates over days, so repeated dosing builds up more than the parent half-life suggests.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures.',
    'Fatal respiratory depression risk when combined with opioids, alcohol or other CNS depressants.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Japanese product information, Erispan']
},

{
  id: 'flunitrazepam', name: 'Flunitrazepam', aliases: ['rohypnol', 'roofie', 'roofies', 'narcozep', 'hypnodorm'],
  class: 'Depressant', family: 'Benzodiazepine (nitro)', schedule: 'III/IV (UN); Schedule IV US, Class C UK',
  cas: '1622-62-4', formula: 'C16H12FN3O3',
  tags: ['depressant', 'cns-depressant', 'benzodiazepine', 'gaba-a-positive-modulator', 'hypnotic', 'amnestic', 'high-abuse-potential', 'dependence-forming'],
  toleranceGroup: 'benzodiazepine', toleranceHalfLifeDays: 12, minRedoseDays: 7,
  mechanism: 'A potent nitro-benzodiazepine hypnotic, roughly ten times the potency of diazepam by weight. Marketed for severe insomnia in much of Europe, Latin America and Asia, and never approved in the United States. It is the compound most associated in public awareness with drug-facilitated assault — though in practice alcohol vastly outranks it, and GHB and other benzodiazepines are more commonly implicated than flunitrazepam itself.',
  halfLife: { hours: 20, range: [16, 35], confidence: 'measured',
    notes: 'Its 7-amino and N-desmethyl metabolites are also long-lived, so residual impairment routinely extends well into the following day.' },
  metabolism: {
    firstPass: 'Substantial; oral bioavailability is around 80%.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N-Desmethylflunitrazepam', fraction: 0.35,
        note: 'Active, and longer-lived than the parent.' },
      { enzyme: 'Nitroreductase (gut flora and hepatic)', reaction: 'Reduction of the 7-nitro group', product: '7-Aminoflunitrazepam', fraction: 0.4,
        note: 'The main forensic marker — detectable in urine for several days after the parent has gone, which is why testing for flunitrazepam alone misses exposure.' },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: '3-hydroxylation', product: '3-Hydroxyflunitrazepam', fraction: 0.15 },
      { enzyme: 'NAT2', reaction: 'Acetylation of the amino metabolite', product: '7-Acetamidoflunitrazepam', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'N-Desmethylflunitrazepam', active: true, halfLifeH: 28, potencyRel: 0.8, fraction: 0.35,
        note: 'Active and long-lived; a major contributor to next-day impairment.' },
      { name: '7-Aminoflunitrazepam', active: false, halfLifeH: 23, fraction: 0.4,
        note: 'The metabolite forensic laboratories actually look for. Detectable long after the parent is undetectable.' },
      { name: '3-Hydroxyflunitrazepam', active: true, halfLifeH: 15, potencyRel: 0.4, fraction: 0.15 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'NAT2'],
    inhibits: [], induces: [],
    excretion: 'Renal, ~90% as conjugated metabolites; well under 1% unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 40], peakMin: [45, 120], durationH: [6, 10], afterEffectsH: [8, 24], bioavailability: 0.8,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'mg',
        note: 'The licensed hypnotic dose is 0.5-1 mg at night. Roughly 10 mg diazepam-equivalent per 1 mg.' } },
    insufflated: { onsetMin: [5, 15], peakMin: [20, 45], durationH: [5, 8], afterEffectsH: [8, 20], bioavailability: 0.8,
      doses: { threshold: 0.25, light: [0.5, 1], common: [1, 2], strong: [2, 3], heavy: 3, unit: 'mg' } }
  },
  warnings: [
    'PROFOUND ANTEROGRADE AMNESIA is its defining feature, and it appears at ordinary hypnotic doses — not only at high ones. Hours can be lost with no subjective sense that anything is missing, which is precisely what makes it dangerous both to take casually and to be given without consent.',
    'Marked disinhibition, so people do things while amnestic that they would not otherwise do and cannot afterwards recall.',
    'Combined with alcohol the amnesia and respiratory depression are both greatly amplified. This is the combination behind most serious harm involving it.',
    'Reformulated by the manufacturer to release a blue dye in liquid, as a countermeasure against covert administration. Illicit and generic tablets frequently do not contain the dye, so its absence proves nothing.',
    'If you suspect covert administration, ask specifically for 7-aminoflunitrazepam testing and do it quickly — a standard benzodiazepine screen can miss it and the parent compound clears fast.',
    'Full cross-tolerance and cross-dependence with all benzodiazepines; withdrawal after sustained use can cause seizures and is potentially fatal.'
  ],
  refs: ['Martindale: The Complete Drug Reference', 'Mattila & Larni 1980, Drugs', 'UNODC drug-facilitated crime guidance']
}

]);

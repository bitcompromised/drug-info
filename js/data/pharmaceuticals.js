/* Prescription medications — included primarily because they are the other
   half of most dangerous interactions, and because many people log a
   recreational drug while already taking one of these daily. */
DB.register([

/* ---------------- SSRIs / SNRIs ---------------- */
{
  id: 'fluoxetine', name: 'Fluoxetine', aliases: ['prozac', 'sarafem'],
  class: 'Antidepressant', family: 'SSRI', schedule: 'Prescription',
  tags: ['ssri', 'serotonergic', 'serotonin-syndrome-risk', 'cyp2d6-inhibitor-strong',
         'mao-contraindicated', 'long-duration'],
  mechanism: 'Selective serotonin reuptake inhibitor. Notable for the longest half-life in its class and for potent CYP2D6 inhibition that persists for weeks after stopping.',
  halfLife: { hours: 96, range: [72, 144], confidence: 'measured',
    notes: 'CRITICAL FOR INTERACTIONS: fluoxetine itself lasts 4-6 days, and its active metabolite norfluoxetine 4-16 days. After stopping, a 5-week washout is required before an MAOI can be started safely. Its CYP2D6 inhibition also persists for weeks.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Norfluoxetine', fraction: 0.5,
        note: 'Fluoxetine inhibits the very enzyme that clears it, giving non-linear kinetics — doubling the dose more than doubles exposure.' },
      { enzyme: 'CYP2C9 / CYP3A4', reaction: 'Secondary demethylation', product: 'Norfluoxetine', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Norfluoxetine', active: true, halfLifeH: 240, potencyRel: 1.0,
      note: 'Equipotent as an SSRI with a half-life of 4-16 days. This is why fluoxetine effectively self-tapers and rarely causes discontinuation syndrome.' }],
    substrateOf: ['CYP2D6', 'CYP2C9'],
    inhibits: ['CYP2D6', 'CYP2C19', 'CYP2C9', 'CYP3A4'],
    excretion: 'Renal, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [240, 480], peakMin: [360, 480], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 0.72,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 80, unit: 'mg',
        note: 'Therapeutic daily dose. Antidepressant effect builds over weeks, not per-dose.' } }
  },
  warnings: [
    'Absolutely contraindicated with MAOIs — fatal serotonin syndrome. Requires a 5-week washout after stopping fluoxetine before starting an MAOI.',
    'Strong CYP2D6 inhibitor: it blocks codeine and tramadol from working, and raises levels of amphetamines, DXM, risperidone, many beta-blockers and TCAs.',
    'Combined with MDMA, other serotonin releasers, tramadol, DXM or triptans, serotonin syndrome risk rises. It also blunts MDMA effects by occupying SERT.'
  ],
  refs: ['DrugBank DB00472', 'Hiemke & Härtter 2000, Pharmacol Ther']
},

{
  id: 'sertraline', name: 'Sertraline', aliases: ['zoloft', 'lustral'],
  class: 'Antidepressant', family: 'SSRI', schedule: 'Prescription',
  tags: ['ssri', 'serotonergic', 'serotonin-syndrome-risk', 'mao-contraindicated', 'cyp2d6-inhibitor-weak'],
  mechanism: 'Selective serotonin reuptake inhibitor with mild dopamine reuptake inhibition and sigma-1 activity.',
  halfLife: { hours: 26, range: [22, 36], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'N-demethylation', product: 'Desmethylsertraline', fraction: 0.45, note: 'Main route; CYP2C19, 2C9, 2D6 and 3A4 all contribute, which makes sertraline relatively robust to any single inhibitor.' },
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'N-demethylation', product: 'Desmethylsertraline', fraction: 0.3 },
      { enzyme: 'MAO / UGT', reaction: 'Deamination and conjugation', product: 'Inactive acids and conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Desmethylsertraline', active: true, halfLifeH: 72, potencyRel: 0.05, note: 'Much weaker than the parent; not clinically significant.' }],
    substrateOf: ['CYP2B6', 'CYP2C19', 'CYP3A4', 'CYP2D6'],
    inhibits: ['CYP2D6', 'CYP2C19'],
    excretion: 'Renal and faecal, as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [240, 480], peakMin: [270, 510], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 0.44,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'Contraindicated with MAOIs; requires a 2-week washout.',
    'Serotonin syndrome risk with MDMA, tramadol, DXM, triptans and other serotonergics.',
    'Blunts MDMA and other serotonin releasers by blocking SERT — people often redose to compensate, which raises toxicity without producing effect.'
  ],
  refs: ['DrugBank DB01104']
},

{
  id: 'venlafaxine', name: 'Venlafaxine', aliases: ['effexor', 'venlalic'],
  class: 'Antidepressant', family: 'SNRI', schedule: 'Prescription',
  tags: ['snri', 'serotonergic', 'serotonin-syndrome-risk', 'mao-contraindicated',
         'hypertensive-risk', 'discontinuation-syndrome'],
  mechanism: 'Serotonin-noradrenaline reuptake inhibitor; serotonergic at low doses, increasingly noradrenergic above ~150 mg/day.',
  halfLife: { hours: 5, range: [3, 7], confidence: 'measured',
    notes: 'Short half-life is why venlafaxine has the worst discontinuation syndrome of the common antidepressants — missing a single dose produces "brain zaps".' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Desvenlafaxine (O-desmethylvenlafaxine)', fraction: 0.55,
        note: 'Produces an equally active metabolite marketed separately as a drug. CYP2D6 poor metabolisers accumulate the parent, which raises cardiac and hypertensive risk.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N-desmethylvenlafaxine', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Desvenlafaxine', active: true, halfLifeH: 11, potencyRel: 1.0, note: 'Fully active; carries most of the therapeutic effect.' }],
    substrateOf: ['CYP2D6', 'CYP3A4'], inhibits: ['CYP2D6'],
    excretion: 'Renal, ~87%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [120, 300], peakMin: [120, 360], durationH: [12, 24], afterEffectsH: [0, 0], bioavailability: 0.45,
      doses: { threshold: 18.75, light: [37.5, 75], common: [75, 150], strong: [150, 225], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Contraindicated with MAOIs.',
    'Raises blood pressure dose-dependently; compounds with stimulants.',
    'Serotonin syndrome risk with MDMA, tramadol, DXM, triptans, linezolid.',
    'Unusually dangerous in overdose for an antidepressant — seizures and cardiotoxicity.'
  ],
  refs: ['DrugBank DB00285']
},

{
  id: 'bupropion', name: 'Bupropion', aliases: ['wellbutrin', 'zyban'],
  class: 'Antidepressant', family: 'NDRI', schedule: 'Prescription',
  tags: ['ndri', 'dopamine-reuptake-inhibitor', 'seizure-risk', 'cyp2d6-inhibitor-strong',
         'mao-contraindicated', 'stimulant-like'],
  mechanism: 'Noradrenaline-dopamine reuptake inhibitor and nicotinic antagonist. Not serotonergic, so it does not cause serotonin syndrome — but it lowers the seizure threshold notably.',
  halfLife: { hours: 21, range: [12, 30], confidence: 'measured',
    notes: 'The active metabolite hydroxybupropion has a ~20 h half-life and reaches plasma levels many times higher than the parent — most of the drug\'s effect and its CYP2D6 inhibition come from the metabolite.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'Hydroxylation', product: 'Hydroxybupropion', fraction: 0.6,
        note: 'Main route. The metabolite reaches concentrations up to 20x the parent and is a potent CYP2D6 inhibitor.' },
      { enzyme: 'Carbonyl reductase (11β-HSD1)', reaction: 'Reduction', product: 'Threohydrobupropion / erythrohydrobupropion', fraction: 0.25 }
    ],
    metabolites: [
      { name: 'Hydroxybupropion', active: true, halfLifeH: 20, potencyRel: 0.5, note: 'Active; the dominant circulating species and the main CYP2D6 inhibitor.' },
      { name: 'Threohydrobupropion', active: true, halfLifeH: 37, potencyRel: 0.2 }
    ],
    substrateOf: ['CYP2B6'],
    inhibits: ['CYP2D6', 'CYP2B6'],
    excretion: 'Renal, ~87%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [120, 300], peakMin: [180, 300], durationH: [12, 24], afterEffectsH: [0, 0], bioavailability: 0.87,
      doses: { threshold: 75, light: [100, 150], common: [150, 300], strong: [300, 450], heavy: 450, unit: 'mg' } }
  },
  warnings: [
    'Lowers the seizure threshold — dose-dependent and substantially raised by stimulants, tramadol, alcohol withdrawal, and eating disorders. Contraindicated in bulimia and anorexia for this reason.',
    'Strong CYP2D6 inhibitor: blocks codeine and tramadol analgesia, and raises amphetamine, DXM and risperidone levels.',
    'Contraindicated with MAOIs.'
  ],
  refs: ['DrugBank DB01156', 'Jefferson et al. 2005, Clin Ther']
},

/* ---------------- MAOIs ---------------- */
{
  id: 'phenelzine', name: 'Phenelzine', aliases: ['nardil'],
  class: 'Antidepressant', family: 'MAOI (irreversible, non-selective)', schedule: 'Prescription',
  tags: ['maoi', 'maoi-irreversible', 'serotonergic', 'serotonin-syndrome-risk',
         'hypertensive-crisis-risk', 'tyramine-restricted', 'high-interaction-risk'],
  mechanism: 'Irreversible, non-selective inhibitor of MAO-A and MAO-B. It destroys the enzyme permanently; effects persist until new enzyme is synthesised, which takes about two weeks regardless of the drug\'s own short half-life.',
  halfLife: { hours: 11.6, range: [1.5, 11.6], confidence: 'measured',
    notes: 'MISLEADING NUMBER — and the most important caveat in this database. Because inhibition is IRREVERSIBLE the functional duration is 2-3 WEEKS whatever the plasma half-life is. Interaction risk does not fall when the drug leaves the blood, and a 14-day washout is mandatory before any serotonergic or sympathomimetic drug. Published plasma half-lives genuinely disagree — commonly quoted as 1.5-4 h, and as 11.6 h after a single dose — which is why the range spans both rather than picking one.' },
  metabolism: {
    pathways: [
      { enzyme: 'MAO', reaction: 'Oxidation (it is both substrate and inactivator)', product: 'Phenylacetic acid', fraction: 0.5 },
      { enzyme: 'NAT2', reaction: 'Acetylation', product: 'N-acetylphenelzine', fraction: 0.3, note: 'Slow acetylators (~50% of Europeans) reach higher levels and have more side effects.' }
    ],
    metabolites: [{ name: 'Phenylacetic acid', active: false }, { name: 'N-acetylphenelzine', active: false }],
    substrateOf: ['MAO-A', 'MAO-B', 'NAT2'],
    inhibits: ['MAO-A', 'MAO-B', 'CYP2C19', 'CYP3A4'],
    excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [120, 240], durationH: [336, 504], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 15, light: [15, 30], common: [45, 60], strong: [60, 90], heavy: 90, unit: 'mg',
        note: 'Duration is shown as 2-3 weeks because that is how long enzyme inhibition — and therefore interaction risk — actually lasts.' } }
  },
  warnings: [
    'THE most dangerous interaction profile in common medicine. Fatal with MDMA, amphetamines, cocaine, SSRIs, SNRIs, tramadol, DXM, pethidine, triptans and most other serotonergic or sympathomimetic drugs.',
    'Tyramine-containing foods (aged cheese, cured meat, soy sauce, tap beer, Marmite, fermented foods) cause hypertensive crisis — the "cheese reaction".',
    'A 14-day washout is required in both directions. Fluoxetine specifically needs 5 weeks because of norfluoxetine.',
    'Signs of hypertensive crisis — sudden severe headache, stiff neck, chest pain — are a medical emergency.'
  ],
  refs: ['DrugBank DB00780', 'Gillman 2011, Br J Pharmacol']
},

{
  id: 'moclobemide', name: 'Moclobemide', aliases: ['aurorix', 'manerix'],
  class: 'Antidepressant', family: 'MAOI (reversible, MAO-A selective)', schedule: 'Prescription (not US)',
  tags: ['maoi', 'maoi-reversible', 'serotonergic', 'serotonin-syndrome-risk', 'high-interaction-risk'],
  mechanism: 'Reversible inhibitor of MAO-A (RIMA). Displaceable by tyramine, so dietary restrictions are far lighter — but this does NOT make it safe with serotonergic drugs.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'measured',
    notes: 'Short and genuinely reversible, so a 24-hour washout suffices for the tyramine interaction. The serotonergic drug interaction remains lethal.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'C-oxidation of the morpholine ring', product: 'Ro 12-8095 and related', fraction: 0.5,
        note: 'Moclobemide inhibits CYP2C19 and thus its own metabolism, giving non-linear kinetics.' },
      { enzyme: 'CYP2D6 / CYP1A2', reaction: 'Secondary oxidation', product: 'Inactive metabolites', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Ro 12-5637 / Ro 12-8095', active: false }],
    substrateOf: ['CYP2C19', 'CYP2D6'],
    inhibits: ['MAO-A', 'CYP2D6', 'CYP2C19', 'CYP1A2'],
    excretion: 'Renal, <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 120], peakMin: [60, 180], durationH: [12, 24], afterEffectsH: [0, 0], bioavailability: 0.6,
      doses: { threshold: 75, light: [150, 300], common: [300, 450], strong: [450, 600], heavy: 600, unit: 'mg' } }
  },
  warnings: [
    'Being "reversible" reduces the food interaction, NOT the drug interaction. Moclobemide plus MDMA has killed multiple people — it is among the best-documented fatal recreational combinations on record.',
    'Fatal with SSRIs, SNRIs, tramadol, DXM, pethidine and other serotonergics.',
    'Used deliberately in "pharmahuasca" to make DMT orally active; this brings the full MAOI interaction profile with it.'
  ],
  refs: ['Vuori et al. 2003, Addiction', 'Bonnet 2003, CNS Drug Rev']
},

{
  id: 'selegiline', name: 'Selegiline', aliases: ['deprenyl', 'eldepryl', 'emsam'],
  class: 'Antidepressant', family: 'MAOI (irreversible, MAO-B selective at low dose)', schedule: 'Prescription',
  tags: ['maoi', 'maoi-irreversible', 'dopaminergic', 'serotonin-syndrome-risk', 'high-interaction-risk'],
  mechanism: 'Selective irreversible MAO-B inhibitor at low doses (≤10 mg), losing selectivity above that and at transdermal doses — at which point it carries the full non-selective MAOI interaction profile.',
  halfLife: { hours: 2, range: [1.5, 10], confidence: 'measured',
    notes: 'As with phenelzine, the plasma half-life is irrelevant to interaction risk — inhibition is irreversible and lasts until enzyme resynthesis, roughly 2 weeks.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'N-dealkylation', product: 'L-Methamphetamine', fraction: 0.4,
        note: 'Genuinely metabolises to methamphetamine and amphetamine — the l-enantiomers, which are far less CNS-active than the d-forms but do cause insomnia and can trigger positive amphetamine drug screens.' },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'N-demethylation', product: 'Desmethylselegiline', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'L-Methamphetamine', active: true, halfLifeH: 14, potencyRel: 0.1 },
      { name: 'L-Amphetamine', active: true, halfLifeH: 18, potencyRel: 0.15 },
      { name: 'Desmethylselegiline', active: true, potencyRel: 0.5, note: 'Retains MAO-B inhibition.' }
    ],
    substrateOf: ['CYP2B6', 'CYP2C19', 'CYP3A4'],
    inhibits: ['MAO-B', 'MAO-A'],
    excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [30, 120], durationH: [168, 336], afterEffectsH: [0, 0], bioavailability: 0.1,
      doses: { threshold: 1.25, light: [2.5, 5], common: [5, 10], strong: [10, 20], heavy: 30, unit: 'mg',
        note: 'Above 10 mg/day MAO-B selectivity is lost and full MAOI precautions apply.' } }
  },
  warnings: [
    'At doses above 10 mg/day, or by transdermal patch, it loses MAO-B selectivity and becomes as dangerous as any other MAOI.',
    'Contraindicated with SSRIs, SNRIs, tramadol, DXM, pethidine and stimulants.'
  ],
  refs: ['DrugBank DB01037']
},

/* ---------------- Mood stabilisers / antipsychotics ---------------- */
{
  id: 'lithium', name: 'Lithium', aliases: ['lithium carbonate', 'priadel', 'camcolit'],
  class: 'Mood stabiliser', family: 'Alkali metal salt', schedule: 'Prescription',
  tags: ['mood-stabiliser', 'narrow-therapeutic-index', 'seizure-risk-with-psychedelics',
         'nephrotoxic', 'renally-cleared'],
  mechanism: 'Inhibits inositol monophosphatase and GSK-3β. Not metabolised at all — handled entirely by the kidney, which is why hydration, salt intake and NSAIDs affect its levels so strongly.',
  halfLife: { hours: 24, range: [12, 36], confidence: 'measured', notes: 'Longer in the elderly and in renal impairment; up to 58 h with long-term use.' },
  metabolism: {
    firstPass: 'None — it is an ion, not metabolised in any way.',
    pathways: [
      { enzyme: 'None (renal handling only)', reaction: 'Filtered and reabsorbed in the proximal tubule alongside sodium', product: 'Unchanged lithium ion', fraction: 1.0,
        note: 'Because it competes with sodium for reabsorption, dehydration, low-salt diets, NSAIDs, ACE inhibitors and thiazide diuretics all reduce clearance and can push levels into the toxic range.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Lithium is excreted entirely unchanged.' }],
    substrateOf: [], inhibits: [],
    excretion: 'Renal, ~95% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [60, 180], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 150, light: [300, 600], common: [600, 1200], strong: [1200, 1800], heavy: 1800, unit: 'mg' } }
  },
  warnings: [
    'Lithium plus LSD, psilocybin or other psychedelics has repeatedly caused seizures — this is one of the best-attested dangerous psychedelic interactions, based on a substantial body of case reports.',
    'Narrow therapeutic index: therapeutic 0.6-1.2 mmol/L, toxic above 1.5. Dehydration from MDMA, stimulants, heat or exercise can push levels into toxicity.',
    'NSAIDs (ibuprofen, naproxen), ACE inhibitors and thiazides all raise lithium levels dangerously.'
  ],
  refs: ['DrugBank DB01356', 'Rifkin & Sachs 1990, case reports']
},

{
  id: 'quetiapine', name: 'Quetiapine', aliases: ['seroquel'],
  class: 'Antipsychotic', family: 'Atypical antipsychotic', schedule: 'Prescription',
  tags: ['antipsychotic', 'sedative', 'qt-prolonging', 'cns-depressant', 'antihistamine',
         'orthostatic-hypotension', 'cyp3a4-substrate'],
  mechanism: 'Broad receptor antagonist — D2, 5-HT2A, H1, α1 and muscarinic. At low doses the H1 antihistamine effect dominates, which is why it is so often used off-label as a sedative.',
  halfLife: { hours: 6, range: [5, 9], confidence: 'measured', notes: 'Active metabolite norquetiapine has a ~12 h half-life and is an SNRI, contributing a genuinely different pharmacology from the parent.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Sulfoxidation', product: 'Quetiapine sulfoxide', fraction: 0.5,
        note: 'Dominant route; CYP3A4 inhibitors can multiply exposure severalfold and inducers can abolish the effect.' },
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Norquetiapine', fraction: 0.2 },
      { enzyme: 'CYP2D6', reaction: 'Hydroxylation of norquetiapine', product: '7-Hydroxy-norquetiapine', from: 'Norquetiapine', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Norquetiapine', active: true, halfLifeH: 12, potencyRel: 0.8,
        note: 'A noradrenaline reuptake inhibitor and 5-HT2C antagonist — pharmacologically an antidepressant, which is why quetiapine has antidepressant indications.' },
      { name: 'Quetiapine sulfoxide', active: false }
    ],
    substrateOf: ['CYP3A4', 'CYP2D6'], inhibits: [],
    excretion: 'Renal ~73%, faecal ~20%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 150], durationH: [6, 12], afterEffectsH: [8, 16], bioavailability: 0.09,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 300], strong: [300, 600], heavy: 800, unit: 'mg' } }
  },
  warnings: [
    'Prolongs the QT interval; additive with methadone, ondansetron and other QT-prolonging drugs.',
    'Strongly additive sedation with alcohol, benzodiazepines and opioids.',
    'Severe orthostatic hypotension, particularly on starting or after a dose increase.'
  ],
  refs: ['DrugBank DB01224']
},

/* ---------------- Gabapentinoids ---------------- */
{
  id: 'pregabalin', name: 'Pregabalin', aliases: ['lyrica'],
  class: 'Depressant', family: 'Gabapentinoid', schedule: 'V (US); Class C (UK)',
  tags: ['gabapentinoid', 'anxiolytic', 'cns-depressant', 'respiratory-depressant-with-opioids',
         'addictive', 'withdrawal-risk'],
  toleranceGroup: 'gabapentinoid', toleranceHalfLifeDays: 3,
  mechanism: 'Binds the α2δ subunit of voltage-gated calcium channels, reducing release of glutamate, noradrenaline and substance P. Despite the name it has no direct action at GABA receptors.',
  halfLife: { hours: 6.3, range: [5, 7], confidence: 'measured' },
  metabolism: {
    firstPass: 'None; oral bioavailability ≥90% and, unusually, dose-independent (unlike gabapentin, whose absorption saturates).',
    pathways: [
      { enzyme: 'None (negligible metabolism)', reaction: 'Essentially not metabolised', product: 'Unchanged pregabalin', fraction: 0.98,
        note: 'Under 2% is metabolised. It has no meaningful CYP interactions at all — but it depends entirely on renal clearance, so kidney impairment causes dramatic accumulation.' }
    ],
    metabolites: [{ name: 'N-methylpregabalin', active: false, note: 'Under 1% of the dose.' }],
    substrateOf: [], inhibits: [],
    excretion: 'Renal, ~98% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 120], durationH: [5, 10], afterEffectsH: [4, 12], bioavailability: 0.9,
      doses: { threshold: 25, light: [50, 150], common: [150, 300], strong: [300, 600], heavy: 600, unit: 'mg' } }
  },
  warnings: [
    'Combined with opioids, pregabalin substantially raises the risk of fatal respiratory depression. This combination is now a major contributor to overdose deaths in the UK and elsewhere, and drove its reclassification.',
    'Genuine dependence with a withdrawal syndrome resembling benzodiazepine withdrawal — anxiety, insomnia, sweating and, at high doses, seizures. Taper rather than stopping abruptly.',
    'Additive with alcohol and benzodiazepines.'
  ],
  refs: ['Bockbrader et al. 2010, Clin Pharmacokinet', 'Lyndon et al. 2017, Addiction']
},

/* ---------------- Cardiovascular / other interaction partners ---------------- */
{
  id: 'sildenafil', name: 'Sildenafil', aliases: ['viagra', 'revatio'],
  class: 'Other', family: 'PDE5 inhibitor', schedule: 'Prescription',
  tags: ['pde5-inhibitor', 'vasodilator', 'nitrate-contraindicated', 'hypotension-risk', 'cyp3a4-substrate'],
  mechanism: 'Inhibits phosphodiesterase type 5, preventing breakdown of cGMP and amplifying nitric-oxide-mediated vasodilation.',
  halfLife: { hours: 4, range: [3, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N-desmethylsildenafil', fraction: 0.8,
        note: 'Dominant route. Strong CYP3A4 inhibitors — ritonavir above all — raise sildenafil exposure up to 11-fold, a well-documented cause of severe hypotension.' },
      { enzyme: 'CYP2C9', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.15 }
    ],
    metabolites: [{ name: 'N-desmethylsildenafil', active: true, halfLifeH: 4, potencyRel: 0.5, note: 'About 50% as potent; contributes ~20% of the effect.' }],
    substrateOf: ['CYP3A4', 'CYP2C9'], inhibits: [],
    excretion: 'Faecal ~80%, renal ~13%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [2, 6], bioavailability: 0.41,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 100], strong: [100, 150], heavy: 200, unit: 'mg' } }
  },
  warnings: [
    'NEVER combine with alkyl nitrites (poppers) or any nitrate medication — the combination causes profound, unresponsive hypotension and has caused deaths. This is an absolute contraindication.',
    'Ritonavir and other strong CYP3A4 inhibitors multiply exposure severalfold; the dose must be reduced.',
    'Additive hypotension with alcohol and alpha-blockers.'
  ],
  refs: ['DrugBank DB00203']
},

{
  id: 'ondansetron', name: 'Ondansetron', aliases: ['zofran'],
  class: 'Other', family: '5-HT3 antagonist', schedule: 'Prescription',
  tags: ['antiemetic', 'qt-prolonging', 'serotonergic-5ht3', 'cyp3a4-substrate'],
  mechanism: 'Selective 5-HT3 receptor antagonist; blocks the vagal and central pathways driving nausea. Frequently used to manage nausea from opioids, psychedelics and chemotherapy.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: '8-Hydroxyondansetron', fraction: 0.45 },
      { enzyme: 'CYP1A2 / CYP2D6', reaction: 'Hydroxylation', product: '7- and 6-hydroxy metabolites', fraction: 0.3,
        note: 'Because several enzymes share the load, CYP2D6 status has little effect — unusual and clinically convenient.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [{ name: '8-Hydroxyondansetron', active: false }],
    substrateOf: ['CYP3A4', 'CYP1A2', 'CYP2D6'], inhibits: [],
    excretion: 'Renal, ~5% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [90, 150], durationH: [6, 12], afterEffectsH: [2, 6], bioavailability: 0.6,
      doses: { threshold: 2, light: [4, 4], common: [4, 8], strong: [8, 16], heavy: 24, unit: 'mg' } }
  },
  warnings: [
    'Prolongs the QT interval — the reason the 32 mg IV dose was withdrawn. Additive with methadone, ibogaine and many antipsychotics.',
    'Being a 5-HT3 antagonist it does NOT cause serotonin syndrome in the classic sense, but case reports exist when combined with multiple serotonergics.'
  ],
  refs: ['DrugBank DB00904']
},

{
  id: 'grapefruit', name: 'Grapefruit juice', aliases: ['grapefruit', 'pomelo', 'seville orange'],
  class: 'Other', family: 'Dietary CYP inhibitor', schedule: 'Food',
  tags: ['cyp3a4-inhibitor-strong', 'dietary-interaction'],
  mechanism: 'Furanocoumarins (bergamottin, 6\',7\'-dihydroxybergamottin) irreversibly inactivate INTESTINAL CYP3A4. Included here because it is a genuine and frequently underestimated interaction, not a folk remedy.',
  halfLife: { hours: 24, range: [12, 72], confidence: 'measured',
    notes: 'The juice clears quickly but the enzyme inhibition is irreversible — intestinal CYP3A4 must be resynthesised, which takes 24-72 hours. Separating doses by a few hours does NOT avoid the interaction.' },
  metabolism: {
    pathways: [{ enzyme: 'N/A', reaction: 'Furanocoumarins mechanism-inactivate intestinal CYP3A4', product: 'Inactivated enzyme', fraction: 1.0 }],
    metabolites: [{ name: 'N/A', active: false }],
    substrateOf: [],
    inhibits: ['CYP3A4', 'OATP1A2', 'P-gp'],
    excretion: 'N/A', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 60], peakMin: [60, 120], durationH: [24, 72], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 50, light: [100, 200], common: [200, 300], strong: [300, 500], heavy: 500, unit: 'ml',
        note: 'A single 200 ml glass is enough to produce a clinically significant interaction.' } }
  },
  warnings: [
    'Raises exposure to many CYP3A4 substrates — including benzodiazepines (alprazolam, midazolam, triazolam), ketamine, oxycodone, fentanyl, MDMA, statins and sildenafil.',
    'Because the inhibition is irreversible, the effect lasts 1-3 days after a single glass.'
  ],
  refs: ['Bailey et al. 2013, CMAJ']
}

]);

/* Prescription & OTC — second wave. Mostly here because they are the other half
   of common interactions, or because they are potent CYP modulators. */
DB.register([

{
  id: 'paroxetine', name: 'Paroxetine', aliases: ['paxil', 'seroxat'],
  class: 'Antidepressant', family: 'SSRI', schedule: 'Prescription',
  tags: ['ssri', 'serotonergic', 'serotonin-syndrome-risk', 'cyp2d6-inhibitor-strong',
         'mao-contraindicated', 'anticholinergic', 'discontinuation-syndrome'],
  mechanism: 'The most potent SSRI at SERT, with notable anticholinergic activity. Also the strongest CYP2D6 inhibitor in common use.',
  halfLife: { hours: 21, range: [10, 65], confidence: 'measured',
    notes: 'Non-linear: paroxetine inhibits the CYP2D6 that clears it, so the half-life lengthens as the dose rises. Its short half-life relative to fluoxetine gives it the worst SSRI discontinuation syndrome.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Demethylenation of the methylenedioxy ring', product: 'Catechol intermediate', fraction: 0.65,
        note: 'MECHANISM-BASED inhibition — paroxetine destroys CYP2D6, so inhibition persists about a week after stopping.' },
      { enzyme: 'COMT / SULT / UGT', reaction: 'Methylation and conjugation', product: 'Inactive conjugates', fraction: 0.6 }
    ],
    metabolites: [{ name: 'Inactive conjugates', active: false, note: 'No clinically active metabolites.' }],
    substrateOf: ['CYP2D6'], inhibits: ['CYP2D6', 'CYP2B6'],
    excretion: 'Renal ~64%, faecal ~36%; <2% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [240, 480], peakMin: [300, 480], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 0.5,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 50], heavy: 60, unit: 'mg' } }
  },
  warnings: [
    'The strongest common CYP2D6 inhibitor — it abolishes codeine and tramadol analgesia entirely, and substantially raises amphetamine, DXM and antipsychotic levels.',
    'Contraindicated with MAOIs; 2-week washout.',
    'Severe discontinuation syndrome; taper slowly.'
  ],
  refs: ['DrugBank DB00715', 'Bertelsen et al. 2003, Drug Metab Dispos']
},

{
  id: 'escitalopram', name: 'Escitalopram', aliases: ['lexapro', 'cipralex'],
  class: 'Antidepressant', family: 'SSRI', schedule: 'Prescription',
  tags: ['ssri', 'serotonergic', 'serotonin-syndrome-risk', 'mao-contraindicated', 'qt-prolonging'],
  mechanism: 'The S-enantiomer of citalopram and the most selective SSRI — very little off-target receptor activity, hence relatively few interactions beyond the serotonergic ones.',
  halfLife: { hours: 30, range: [27, 33], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'N-demethylation', product: 'S-desmethylcitalopram', fraction: 0.4,
        note: 'CYP2C19 poor metabolisers reach roughly double the exposure, which matters because escitalopram prolongs QT dose-dependently.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'N-demethylation', product: 'S-desmethylcitalopram', fraction: 0.3 },
      { enzyme: 'MAO-A / MAO-B', reaction: 'Oxidative deamination', product: 'Propionic acid derivative', fraction: 0.15 }
    ],
    metabolites: [{ name: 'S-desmethylcitalopram', active: true, halfLifeH: 50, potencyRel: 0.1, note: 'Much weaker than the parent; not clinically significant.' }],
    substrateOf: ['CYP2C19', 'CYP3A4', 'CYP2D6'], inhibits: ['CYP2D6'],
    excretion: 'Renal, ~8% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [240, 480], peakMin: [240, 300], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 30], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Dose-dependent QT prolongation; maximum recommended dose is capped for this reason and lowered further in CYP2C19 poor metabolisers.',
    'Contraindicated with MAOIs. Blunts MDMA and other serotonin releasers.'
  ],
  refs: ['DrugBank DB01175']
},

{
  id: 'fluvoxamine', name: 'Fluvoxamine', aliases: ['luvox', 'faverin'],
  class: 'Antidepressant', family: 'SSRI', schedule: 'Prescription',
  tags: ['ssri', 'serotonergic', 'serotonin-syndrome-risk', 'cyp1a2-inhibitor-strong',
         'cyp2c19-inhibitor-strong', 'mao-contraindicated', 'sigma-agonist'],
  mechanism: 'SSRI with sigma-1 agonism. Its defining practical property is being the most potent CYP1A2 inhibitor in clinical use.',
  halfLife: { hours: 16, range: [12, 22], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Oxidative demethylation', product: 'Fluvoxamine acid', fraction: 0.6 },
      { enzyme: 'CYP1A2', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Fluvoxamine acid', active: false }],
    substrateOf: ['CYP2D6', 'CYP1A2'],
    inhibits: ['CYP1A2', 'CYP2C19', 'CYP3A4', 'CYP2C9', 'CYP2D6'],
    excretion: 'Renal, as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [240, 480], peakMin: [180, 480], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 0.53,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 150], strong: [150, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'The broadest CYP inhibition profile of any SSRI. It multiplies caffeine exposure roughly fivefold, raises melatonin up to twentyfold, and substantially raises clozapine, theophylline and many benzodiazepines.',
    'Contraindicated with MAOIs.'
  ],
  refs: ['DrugBank DB00176', 'Christensen et al. 2002, Clin Pharmacol Ther']
},

{
  id: 'mirtazapine', name: 'Mirtazapine', aliases: ['remeron', 'zispin'],
  class: 'Antidepressant', family: 'Tetracyclic (NaSSA)', schedule: 'Prescription',
  tags: ['antidepressant', 'antihistamine', 'sedative', '5ht2a-antagonist', '5ht3-antagonist',
         'cns-depressant', 'mao-contraindicated'],
  mechanism: 'Alpha-2 autoreceptor antagonist that increases noradrenaline and serotonin release, while blocking 5-HT2A, 5-HT2C, 5-HT3 and H1. The potent H1 antagonism is why it is so sedating at low doses — and, counterintuitively, less sedating at higher ones as noradrenergic activity increases.',
  halfLife: { hours: 30, range: [20, 40], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: '8-hydroxylation', product: '8-Hydroxymirtazapine', fraction: 0.3 },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'N-desmethylmirtazapine', fraction: 0.3, note: 'Weakly active.' },
      { enzyme: 'CYP1A2', reaction: 'N-oxidation', product: 'Mirtazapine-N-oxide', fraction: 0.2 }
    ],
    metabolites: [{ name: 'N-desmethylmirtazapine', active: true, halfLifeH: 30, potencyRel: 0.1 }],
    substrateOf: ['CYP2D6', 'CYP3A4', 'CYP1A2'], inhibits: [],
    excretion: 'Renal ~75%, faecal ~15%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 150], durationH: [10, 20], afterEffectsH: [8, 24], bioavailability: 0.5,
      doses: { threshold: 3.75, light: [7.5, 15], common: [15, 30], strong: [30, 45], heavy: 45, unit: 'mg' } }
  },
  warnings: [
    'Strongly sedating and additive with alcohol, benzodiazepines and opioids.',
    'Its 5-HT2A/5-HT3 antagonism blunts psychedelics and MDMA substantially.',
    'Contraindicated with MAOIs.'
  ],
  refs: ['DrugBank DB00370']
},

{
  id: 'trazodone', name: 'Trazodone', aliases: ['desyrel', 'oleptro'],
  class: 'Antidepressant', family: 'SARI', schedule: 'Prescription',
  tags: ['antidepressant', 'sedative', '5ht2a-antagonist', 'alpha1-antagonist', 'cns-depressant',
         'serotonergic', 'qt-prolonging', 'priapism-risk', 'mao-contraindicated'],
  mechanism: 'Serotonin antagonist and reuptake inhibitor. At low doses the 5-HT2A and H1 antagonism dominates, which is why it is used far more often as a hypnotic than as an antidepressant.',
  halfLife: { hours: 7, range: [5, 9], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'mCPP (meta-chlorophenylpiperazine)', fraction: 0.2,
        note: 'Produces mCPP — an active serotonergic metabolite and 5-HT2C agonist that causes anxiety, and which is itself a recreational drug found in adulterated ecstasy pills. CYP2D6 poor metabolisers accumulate it and tolerate trazodone badly.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxytrazodone', fraction: 0.5 }
    ],
    metabolites: [{ name: 'mCPP', active: true, halfLifeH: 4, potencyRel: 0.3,
      note: 'Cleared by CYP2D6. Causes anxiety, migraine and dysphoria in poor metabolisers or with a 2D6 inhibitor.' }],
    substrateOf: ['CYP3A4', 'CYP2D6'], inhibits: [],
    excretion: 'Renal ~75%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 150], durationH: [6, 10], afterEffectsH: [6, 14], bioavailability: 0.7,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 150], strong: [150, 300], heavy: 400, unit: 'mg' } }
  },
  warnings: [
    'Priapism — a urological emergency requiring treatment within hours to avoid permanent damage. Rare but well documented and specific to this drug.',
    'Strongly additive with alcohol and other depressants. Prolongs QT.',
    'Contraindicated with MAOIs.'
  ],
  refs: ['DrugBank DB00656']
},

{
  id: 'tranylcypromine', name: 'Tranylcypromine', aliases: ['parnate'],
  class: 'Antidepressant', family: 'MAOI (irreversible, non-selective)', schedule: 'Prescription',
  tags: ['maoi', 'maoi-irreversible', 'serotonergic', 'serotonin-syndrome-risk', 'stimulant',
         'hypertensive-crisis-risk', 'tyramine-restricted', 'high-interaction-risk'],
  mechanism: 'Irreversible non-selective MAO inhibitor with an amphetamine-like structure, giving it mild direct stimulant activity on top of enzyme inhibition.',
  halfLife: { hours: 2.5, range: [1.5, 3.2], confidence: 'measured',
    notes: 'As with phenelzine, the plasma half-life is irrelevant to safety. Inhibition is irreversible and lasts about 2 weeks until enzyme is resynthesised. A 14-day washout is mandatory in both directions.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2A6', reaction: 'Ring hydroxylation', product: 'Hydroxytranylcypromine', fraction: 0.5 },
      { enzyme: 'N-acetyltransferase', reaction: 'Acetylation', product: 'N-acetyltranylcypromine', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Hydroxytranylcypromine', active: false }],
    substrateOf: ['CYP2A6', 'NAT2'],
    inhibits: ['MAO-A', 'MAO-B', 'CYP2A6', 'CYP2C19', 'CYP2D6'],
    excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 120], peakMin: [60, 180], durationH: [336, 504], afterEffectsH: [0, 0], bioavailability: 0.5,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg',
        note: 'Duration shown as 2-3 weeks because that is how long the interaction risk actually lasts.' } }
  },
  warnings: [
    'Fatal with MDMA, amphetamines, cocaine, SSRIs, SNRIs, tramadol, DXM, pethidine and most serotonergics or sympathomimetics.',
    'Tyramine-containing foods cause hypertensive crisis — the "cheese reaction". Sudden severe headache is a medical emergency.',
    'Considered the most stimulating and, in overdose, one of the most dangerous MAOIs.'
  ],
  refs: ['DrugBank DB00752', 'Gillman 2011, Br J Pharmacol']
},

{
  id: 'olanzapine', name: 'Olanzapine', aliases: ['zyprexa'],
  class: 'Antipsychotic', family: 'Atypical antipsychotic', schedule: 'Prescription',
  tags: ['antipsychotic', 'sedative', 'antihistamine', 'anticholinergic', 'cns-depressant',
         '5ht2a-antagonist', 'metabolic-syndrome-risk'],
  mechanism: 'Broad D2/5-HT2A antagonist with strong H1 and muscarinic blockade. Widely used in emergency settings to terminate stimulant- and psychedelic-induced agitation.',
  halfLife: { hours: 33, range: [21, 54], confidence: 'measured', notes: 'Roughly 1.5x longer in women and in non-smokers; smoking induces CYP1A2 and shortens it substantially.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A4', reaction: 'Direct N-glucuronidation', product: 'Olanzapine-10-N-glucuronide', fraction: 0.4 },
      { enzyme: 'CYP1A2', reaction: 'N-demethylation', product: 'N-desmethylolanzapine', fraction: 0.3,
        note: 'Smoking induces CYP1A2 and can halve olanzapine levels — stopping smoking abruptly (as on hospital admission) can cause toxicity.' },
      { enzyme: 'FMO3', reaction: 'N-oxidation', product: 'Olanzapine-N-oxide', fraction: 0.15 }
    ],
    metabolites: [{ name: 'N-desmethylolanzapine', active: false }, { name: 'Olanzapine-10-N-glucuronide', active: false }],
    substrateOf: ['UGT1A4', 'CYP1A2', 'FMO3'], inhibits: [],
    excretion: 'Renal ~57%, faecal ~30%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [45, 120], peakMin: [240, 360], durationH: [12, 24], afterEffectsH: [12, 36], bioavailability: 0.6,
      doses: { threshold: 2.5, light: [2.5, 5], common: [5, 15], strong: [15, 20], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Strongly sedating and additive with alcohol, benzodiazepines and opioids; severe orthostatic hypotension.',
    'Blunts psychedelics via 5-HT2A antagonism — sometimes used deliberately to end a difficult experience, though benzodiazepines are generally preferred and safer.',
    'Substantial weight gain and metabolic effects with sustained use.'
  ],
  refs: ['DrugBank DB00334']
},

{
  id: 'propranolol', name: 'Propranolol', aliases: ['inderal'],
  class: 'Other', family: 'Non-selective beta-blocker', schedule: 'Prescription',
  tags: ['beta-blocker', 'antihypertensive', 'anxiolytic', 'bradycardia-risk', 'cocaine-contraindicated'],
  mechanism: 'Non-selective beta-adrenergic antagonist that crosses the blood-brain barrier, blunting the physical symptoms of anxiety — tremor, palpitations, sweating.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive and saturable; oral bioavailability only ~25% and highly variable between individuals.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: '4-hydroxylation', product: '4-Hydroxypropranolol', fraction: 0.4, note: 'Active metabolite; CYP2D6 poor metabolisers reach markedly higher levels.' },
      { enzyme: 'CYP1A2', reaction: 'N-dealkylation', product: 'Naphthoxylactic acid', fraction: 0.4 },
      { enzyme: 'UGT', reaction: 'Direct glucuronidation', product: 'Propranolol glucuronide', fraction: 0.2 }
    ],
    metabolites: [{ name: '4-Hydroxypropranolol', active: true, halfLifeH: 3, potencyRel: 1.0, note: 'Equipotent beta-blocker but short-lived.' }],
    substrateOf: ['CYP2D6', 'CYP1A2', 'UGT'], inhibits: ['CYP2D6'],
    excretion: 'Renal, as metabolites; <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.25,
      doses: { threshold: 5, light: [10, 20], common: [20, 60], strong: [60, 120], heavy: 160, unit: 'mg' } }
  },
  warnings: [
    'Traditionally avoided in acute cocaine or stimulant toxicity: blocking beta receptors leaves alpha-mediated vasoconstriction unopposed, which can worsen hypertension and coronary spasm. This remains standard emergency teaching even though it is debated.',
    'Additive bradycardia and hypotension with clonidine, alcohol and opioids.',
    'Masks the adrenergic warning signs of hypoglycaemia.'
  ],
  refs: ['DrugBank DB00571']
},

{
  id: 'cyproheptadine', name: 'Cyproheptadine', aliases: ['periactin'],
  class: 'Other', family: 'Antihistamine / 5-HT2 antagonist', schedule: 'Prescription / OTC (varies)',
  tags: ['antihistamine', '5ht2a-antagonist', 'anticholinergic', 'sedative',
         'serotonin-syndrome-antidote', 'cns-depressant'],
  mechanism: 'First-generation antihistamine with potent 5-HT2A antagonism. Included here because it is the standard pharmacological antidote for serotonin syndrome.',
  halfLife: { hours: 8, range: [1, 16], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT', reaction: 'N-glucuronidation', product: 'Cyproheptadine quaternary glucuronide', fraction: 0.6, note: 'Main urinary metabolite.' },
      { enzyme: 'CYP3A4 / CYP2D6', reaction: 'N-demethylation and hydroxylation', product: 'Norcyproheptadine', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Norcyproheptadine', active: true, potencyRel: 0.3 }],
    substrateOf: ['UGT', 'CYP3A4', 'CYP2D6'], inhibits: [],
    excretion: 'Renal, ~40%; faecal ~2-20%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 180], durationH: [6, 10], afterEffectsH: [4, 12], bioavailability: 0.6,
      doses: { threshold: 2, light: [4, 8], common: [8, 16], strong: [16, 24], heavy: 32, unit: 'mg',
        note: 'The serotonin syndrome protocol is 12 mg initially, then 2 mg every 2 hours — administered in hospital, not self-directed.' } }
  },
  warnings: [
    'Used clinically for serotonin syndrome, but serotonin syndrome is a medical emergency requiring hospital care — cooling, sedation and monitoring matter more than any antidote. Do not treat it at home.',
    'Sedating and anticholinergic; additive with alcohol and other depressants.',
    'Blunts psychedelics via 5-HT2A antagonism.'
  ],
  refs: ['Boyer & Shannon 2005, NEJM']
},

{
  id: 'ritonavir', name: 'Ritonavir', aliases: ['norvir', 'in paxlovid'],
  class: 'Other', family: 'Protease inhibitor / CYP booster', schedule: 'Prescription',
  tags: ['cyp3a4-inhibitor-strong', 'antiviral', 'high-interaction-risk'],
  mechanism: 'An HIV protease inhibitor now used mainly as a deliberate CYP3A4 blocker to boost other drugs. It is the most potent CYP3A4 inhibitor in clinical use, and that is the point of it.',
  halfLife: { hours: 4, range: [3, 5], confidence: 'measured',
    notes: 'Enzyme inhibition outlasts the drug: CYP3A4 activity takes several days to recover after stopping.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation (and mechanism-based inactivation)', product: 'Oxidative metabolites', fraction: 0.8,
        note: 'Ritonavir irreversibly inactivates the enzyme that metabolises it.' },
      { enzyme: 'CYP2D6', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.1 }
    ],
    metabolites: [{ name: 'M-2 (isopropylthiazole oxidation product)', active: true, potencyRel: 0.3 }],
    substrateOf: ['CYP3A4', 'CYP2D6'],
    inhibits: ['CYP3A4', 'CYP2D6', 'CYP2C9', 'CYP2C19', 'P-gp'],
    induces: ['CYP1A2', 'CYP2C19', 'UGT'],
    excretion: 'Faecal predominantly.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [120, 240], durationH: [12, 24], afterEffectsH: [48, 120], bioavailability: 0.6,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 400], heavy: 600, unit: 'mg' } }
  },
  warnings: [
    'One of the most interaction-prone drugs in medicine. It has caused fatal overdoses of MDMA, ketamine, fentanyl, alprazolam and midazolam by blocking their metabolism — MDMA deaths in people on ritonavir are specifically documented.',
    'Its inhibition persists for days after the last dose.',
    'Anyone taking ritonavir (including as part of Paxlovid) should treat every other drug as potentially several times stronger than usual.'
  ],
  refs: ['Antoniou & Tseng 2002, Ann Pharmacother', 'Henry & Hill 1998, Lancet']
},

{
  id: 'carbamazepine', name: 'Carbamazepine', aliases: ['tegretol'],
  class: 'Other', family: 'Anticonvulsant', schedule: 'Prescription',
  tags: ['anticonvulsant', 'mood-stabiliser', 'enzyme-inducer', 'cyp3a4-inducer',
         'hyponatraemia-risk', 'high-interaction-risk'],
  mechanism: 'Voltage-gated sodium channel blocker used for epilepsy, trigeminal neuralgia and bipolar disorder. Its practical significance here is powerful, broad enzyme induction.',
  halfLife: { hours: 20, range: [12, 65], confidence: 'measured',
    notes: 'AUTO-INDUCING: carbamazepine induces the enzyme that clears it, so its half-life falls from ~35 h initially to ~15 h after a few weeks. Dose adjustments are needed as this proceeds.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Epoxidation', product: 'Carbamazepine-10,11-epoxide', fraction: 0.6,
        note: 'Produces an ACTIVE metabolite responsible for much of both the therapeutic effect and the toxicity.' },
      { enzyme: 'Epoxide hydrolase (EPHX1)', reaction: 'Hydrolysis of the epoxide', product: 'Trans-diol', fraction: 0.5,
        note: 'Valproate inhibits this enzyme, causing the epoxide to accumulate and produce toxicity even when carbamazepine levels look normal.' },
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Carbamazepine-10,11-epoxide', active: true, halfLifeH: 34, potencyRel: 1.0,
      note: 'Equipotent and neurotoxic at high levels — diplopia, ataxia and sedation often track this rather than the parent.' }],
    substrateOf: ['CYP3A4', 'EPHX1', 'UGT2B7'],
    inhibits: [],
    induces: ['CYP3A4', 'CYP1A2', 'CYP2C9', 'CYP2C19', 'CYP2B6', 'UGT', 'P-gp'],
    excretion: 'Renal ~72%, faecal ~28%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [120, 300], peakMin: [240, 720], durationH: [12, 24], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 100, light: [200, 400], common: [400, 800], strong: [800, 1200], heavy: 1600, unit: 'mg' } }
  },
  warnings: [
    'A powerful broad-spectrum enzyme inducer: it can render hormonal contraceptives, warfarin, many antiretrovirals, methadone and numerous other drugs ineffective. Precipitating opioid withdrawal in methadone patients is a documented consequence.',
    'Serious risk of Stevens-Johnson syndrome, strongly linked to HLA-B*15:02 — screening is recommended in people of Han Chinese and South-East Asian ancestry.'
  ],
  refs: ['DrugBank DB00564']
}

]);

/* Over-the-counter, non-psychoactive medicines.
   These are here for three reasons: people take them alongside everything else,
   several are the hidden second ingredient in combination opioid products, and
   a few (paracetamol, NSAIDs, omeprazole, urinary acidifiers) carry genuinely
   serious interactions with substances already in this database. */
DB.register([

{
  id: 'paracetamol', name: 'Paracetamol', aliases: ['acetaminophen', 'tylenol', 'panadol', 'apap'],
  class: 'OTC medicine', family: 'Aniline analgesic', schedule: 'OTC',
  tags: ['analgesic', 'antipyretic', 'hepatotoxic', 'narrow-safety-margin', 'non-psychoactive'],
  mechanism: 'Analgesic and antipyretic with a still-debated mechanism — probably central COX-2 inhibition plus activation of descending serotonergic pathways, and a metabolite (AM404) acting on cannabinoid and TRPV1 systems. Notably it is not meaningfully anti-inflammatory.',
  halfLife: { hours: 2.5, range: [1.5, 3], confidence: 'measured',
    notes: 'Short, but in overdose the half-life lengthens as the liver fails — a rising half-life is a marker of serious poisoning.' },
  metabolism: {
    firstPass: 'Moderate; oral bioavailability 60-90%, rising with dose as first-pass metabolism saturates.',
    pathways: [
      { enzyme: 'UGT1A1 / UGT1A6', reaction: 'Glucuronidation', product: 'Paracetamol glucuronide', fraction: 0.55,
        note: 'Main safe route. Saturates at high doses, which is what pushes the dose down the toxic path.' },
      { enzyme: 'SULT1A1', reaction: 'Sulfation', product: 'Paracetamol sulfate', fraction: 0.3,
        note: 'Second safe route; saturates earlier than glucuronidation, especially in children.' },
      { enzyme: 'CYP2E1', reaction: 'Oxidation', product: 'NAPQI', fraction: 0.08,
        note: 'THE dangerous route. NAPQI is a highly reactive toxic quinone. Normally only ~5-10% of a dose goes this way and glutathione neutralises it immediately. When the conjugation routes saturate, or when CYP2E1 is induced by alcohol, far more NAPQI is produced.' },
      { enzyme: 'GSH conjugation', reaction: 'Glutathione detoxification of NAPQI', product: 'Cysteine and mercapturate conjugates', fraction: 0.08,
        note: 'The protective step. Once hepatic glutathione is depleted — roughly 70% depletion — NAPQI binds liver proteins directly and cells die. N-acetylcysteine works by restoring glutathione.' }
    ],
    metabolites: [
      { name: 'NAPQI', active: true, halfLifeH: 0.05, potencyRel: 0, fraction: 0.08,
        note: 'Not psychoactive — hepatotoxic. This single metabolite is the entire reason paracetamol overdose kills, and why the safe and lethal doses are closer together than almost any other OTC drug.' },
      { name: 'Paracetamol glucuronide', active: false, halfLifeH: 3, fraction: 0.55 },
      { name: 'Paracetamol sulfate', active: false, halfLifeH: 3, fraction: 0.3 },
      { name: 'AM404', active: true, halfLifeH: 2, potencyRel: 0.1, note: 'Formed in the brain; contributes to the analgesic effect via TRPV1 and cannabinoid signalling.' }
    ],
    substrateOf: ['UGT1A1', 'UGT1A6', 'SULT1A1', 'CYP2E1'], inhibits: [],
    excretion: 'Renal, ~90% as conjugates; <5% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [45, 90], durationH: [4, 6], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 250, light: [325, 500], common: [500, 1000], strong: [1000, 1500], heavy: 2000, unit: 'mg',
        note: 'Maximum 4000 mg in 24 h for a healthy adult, and 2000 mg if you drink regularly. Hepatotoxicity begins around 150 mg/kg — roughly 10 g for a 70 kg adult, which is only 2.5× the daily maximum.' } }
  },
  warnings: [
    'The safety margin is narrower than almost any other OTC drug: 4 g/day is the maximum and ~10 g can destroy a liver. There is no intermediate "a bit too much" — the same dose that feels harmless is close to the one that kills.',
    'Overdose is DECEPTIVE. People feel fine, or merely nauseous, for the first 24 hours while the liver is being destroyed. By the time jaundice and confusion appear, a transplant may be the only option. N-acetylcysteine is near-100% effective if started within 8 hours and much less so after 24.',
    'Alcohol makes it far more dangerous by two routes at once: it induces CYP2E1 (making more NAPQI) and depletes glutathione (removing the defence). Regular drinkers are hepatotoxic at much lower doses.',
    'It is the hidden ingredient in most combination opioid products (co-codamol, Vicodin, Percocet). Escalating those for the opioid reaches a hepatotoxic paracetamol dose long before the opioid alone would be lethal — a very common and very avoidable cause of liver failure.',
    'If an overdose is even possible, go to hospital immediately. Do not wait for symptoms.'
  ],
  sources: ['Mazaleuskaya et al. 2015, Pharmacogenet Genomics', 'Prescott 2000, Am J Ther']
},

{
  id: 'ibuprofen', name: 'Ibuprofen', aliases: ['advil', 'nurofen', 'motrin', 'brufen'],
  class: 'OTC medicine', family: 'NSAID (propionic acid)', schedule: 'OTC',
  tags: ['nsaid', 'analgesic', 'antipyretic', 'anti-inflammatory', 'gi-bleed-risk',
         'nephrotoxic', 'antiplatelet-weak', 'non-psychoactive'],
  mechanism: 'Non-selective, reversible COX-1 and COX-2 inhibitor, reducing prostaglandin synthesis. COX-1 inhibition is what protects the stomach lining and supports renal blood flow, so blocking it produces the characteristic GI and kidney harms.',
  halfLife: { hours: 2, range: [1.8, 2.5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation', product: '2-Hydroxyibuprofen', fraction: 0.6,
        note: 'Dominant. CYP2C9 poor metabolisers clear it more slowly and have a higher GI bleeding risk at standard doses.' },
      { enzyme: 'CYP2C8', reaction: 'Hydroxylation', product: '3-Hydroxyibuprofen', fraction: 0.2 },
      { enzyme: 'UGT', reaction: 'Acyl glucuronidation', product: 'Ibuprofen glucuronide', fraction: 0.15 }
    ],
    metabolites: [
      { name: '2-Hydroxyibuprofen', active: false, halfLifeH: 2.5, fraction: 0.6 },
      { name: 'Ibuprofen glucuronide', active: false, halfLifeH: 3, fraction: 0.15 }
    ],
    substrateOf: ['CYP2C9', 'CYP2C8', 'UGT'], inhibits: [],
    excretion: 'Renal, ~90% as metabolites; <1% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 100, light: [200, 400], common: [400, 600], strong: [600, 800], heavy: 1200, unit: 'mg',
        note: 'OTC maximum 1200 mg/day; prescription maximum 2400 mg/day. Above ~1200 mg/day the anti-inflammatory benefit plateaus while GI and cardiovascular risk keeps rising.' } }
  },
  warnings: [
    'Raises lithium levels substantially by reducing renal clearance — a genuine risk of lithium toxicity for anyone on it.',
    'Combined with SSRIs or SNRIs it markedly increases the risk of gastrointestinal bleeding; both impair platelet function by different mechanisms.',
    'Dehydration plus NSAIDs plus a stimulant is a real recipe for acute kidney injury — relevant after any long session where fluid intake was poor.',
    'Alcohol adds to the GI bleeding risk.'
  ],
  sources: ['DrugBank DB01050', 'Davies 1998, Clin Pharmacokinet']
},

{
  id: 'aspirin', name: 'Aspirin', aliases: ['acetylsalicylic acid', 'asa', 'disprin'],
  class: 'OTC medicine', family: 'NSAID (salicylate)', schedule: 'OTC',
  tags: ['nsaid', 'analgesic', 'antipyretic', 'antiplatelet', 'gi-bleed-risk',
         'reyes-syndrome-risk', 'non-psychoactive'],
  mechanism: 'Irreversibly acetylates COX-1 and COX-2. Because platelets cannot synthesise new enzyme, a single dose suppresses platelet aggregation for the platelet\'s entire 7-10 day lifespan — which is why low-dose aspirin works for cardiovascular prevention and why its bleeding effect long outlasts the drug.',
  halfLife: { hours: 0.3, range: [0.25, 0.5], confidence: 'measured',
    notes: 'Aspirin itself lasts ~20 minutes, but this is deeply misleading: its salicylate metabolite lasts 2-12 h (dose-dependent, saturable), and the antiplatelet effect lasts 7-10 DAYS because the enzyme inhibition is irreversible.' },
  metabolism: {
    pathways: [
      { enzyme: 'Plasma esterases', reaction: 'Hydrolysis of the acetyl group', product: 'Salicylic acid', fraction: 0.9,
        note: 'Very fast. The salicylate carries most of the analgesic effect; the acetyl group, already transferred to COX, carries the antiplatelet effect.' },
      { enzyme: 'UGT1A6', reaction: 'Glucuronidation', product: 'Salicyluric acid / salicyl glucuronides', fraction: 0.6,
        note: 'SATURABLE — this is why salicylate kinetics become zero-order in overdose and levels climb disproportionately.' },
      { enzyme: 'CYP2E1', reaction: 'Minor oxidation', product: 'Gentisic acid', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Salicylic acid', active: true, halfLifeH: 3, potencyRel: 0.8, fraction: 0.9,
        note: 'Active analgesic and antipyretic, but NOT antiplatelet. Half-life stretches from 2 h at low doses to 12+ h in overdose as conjugation saturates.' },
      { name: 'Salicyluric acid', from: 'Salicylic acid', active: false, halfLifeH: 4, fraction: 0.6 }
    ],
    substrateOf: ['CES1', 'UGT1A6', 'CYP2E1'], inhibits: [],
    excretion: 'Renal; alkalinisation of urine dramatically speeds salicylate elimination and is used in overdose treatment.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [0, 0], bioavailability: 0.7,
      doses: { threshold: 75, light: [300, 500], common: [500, 1000], strong: [1000, 1500], heavy: 2000, unit: 'mg',
        note: 'Low-dose (75-100 mg) is for antiplatelet use only. Analgesic dosing is 300-1000 mg; maximum 4 g/day.' } }
  },
  warnings: [
    'Never give to anyone under 16 with a viral illness — Reye\'s syndrome causes acute liver failure and brain swelling, and is frequently fatal.',
    'The antiplatelet effect persists 7-10 days after the last dose, which matters before surgery, dental work, or if any bleeding occurs.',
    'Combined with alcohol, SSRIs or other NSAIDs it substantially raises GI bleeding risk.',
    'Salicylate overdose causes a distinctive picture — ringing ears, hyperventilation, then mixed acid-base disturbance — and is a medical emergency.'
  ],
  sources: ['DrugBank DB00945', 'Needs & Brooks 1985, Clin Pharmacokinet']
},

{
  id: 'naproxen', name: 'Naproxen', aliases: ['aleve', 'naprosyn'],
  class: 'OTC medicine', family: 'NSAID (propionic acid)', schedule: 'OTC / prescription',
  tags: ['nsaid', 'analgesic', 'anti-inflammatory', 'gi-bleed-risk', 'nephrotoxic',
         'long-duration', 'non-psychoactive'],
  mechanism: 'Non-selective COX inhibitor with a much longer half-life than ibuprofen, giving twice-daily dosing. Its comparatively favourable cardiovascular profile among NSAIDs is attributed to more sustained COX-1 inhibition.',
  halfLife: { hours: 14, range: [12, 17], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'O-demethylation', product: '6-O-desmethylnaproxen', fraction: 0.35 },
      { enzyme: 'CYP1A2', reaction: 'Demethylation', product: '6-O-desmethylnaproxen', fraction: 0.15 },
      { enzyme: 'UGT2B7', reaction: 'Acyl glucuronidation', product: 'Naproxen glucuronide', fraction: 0.4 }
    ],
    metabolites: [
      { name: '6-O-desmethylnaproxen', active: false, halfLifeH: 15, fraction: 0.35 },
      { name: 'Naproxen glucuronide', active: false, halfLifeH: 16, fraction: 0.4 }
    ],
    substrateOf: ['CYP2C9', 'CYP1A2', 'UGT2B7'], excretion: 'Renal, ~95%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 240], durationH: [8, 12], afterEffectsH: [0, 0], bioavailability: 0.95,
      doses: { threshold: 110, light: [220, 275], common: [275, 550], strong: [550, 825], heavy: 1100, unit: 'mg' } }
  },
  warnings: [
    'Long half-life means GI and renal exposure is sustained — do not stack it with other NSAIDs.',
    'Raises lithium levels. Adds to GI bleeding risk with SSRIs and alcohol.'
  ],
  sources: ['DrugBank DB00788']
},

{
  id: 'diclofenac', name: 'Diclofenac', aliases: ['voltaren', 'voltarol'],
  class: 'OTC medicine', family: 'NSAID (acetic acid)', schedule: 'OTC (topical) / prescription (oral)',
  tags: ['nsaid', 'analgesic', 'anti-inflammatory', 'gi-bleed-risk', 'cardiovascular-risk',
         'hepatotoxic-rare', 'non-psychoactive'],
  mechanism: 'Potent non-selective COX inhibitor with relative COX-2 preference. That selectivity is thought to explain its comparatively higher cardiovascular risk among the NSAIDs.',
  halfLife: { hours: 2, range: [1, 2.5], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~50%.',
    pathways: [
      { enzyme: 'CYP2C9', reaction: '4-hydroxylation', product: '4-Hydroxydiclofenac', fraction: 0.5, note: 'Main route; the metabolite is weakly active.' },
      { enzyme: 'UGT2B7', reaction: 'Acyl glucuronidation', product: 'Diclofenac acyl glucuronide', fraction: 0.3,
        note: 'Reactive acyl glucuronide implicated in the rare idiosyncratic liver injury seen with this drug.' },
      { enzyme: 'CYP3A4', reaction: '5-hydroxylation', product: '5-Hydroxydiclofenac', fraction: 0.15 }
    ],
    metabolites: [
      { name: '4-Hydroxydiclofenac', active: true, halfLifeH: 2, potencyRel: 0.3, fraction: 0.5 },
      { name: 'Diclofenac acyl glucuronide', active: false, halfLifeH: 3, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C9', 'CYP3A4', 'UGT2B7'], excretion: 'Renal ~65%, biliary ~35%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [6, 8], afterEffectsH: [0, 0], bioavailability: 0.5,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 75], strong: [75, 150], heavy: 150, unit: 'mg' } },
    transdermal: { onsetMin: [60, 180], peakMin: [240, 720], durationH: [8, 12], afterEffectsH: [0, 0], bioavailability: 0.06,
      doses: { threshold: 10, light: [20, 40], common: [40, 80], strong: [80, 160], heavy: 160, unit: 'mg' } }
  },
  warnings: [
    'Carries the highest cardiovascular risk of the common NSAIDs — several countries have restricted it for that reason.',
    'Topical use has a fraction of the systemic exposure and is much safer where it is applicable.'
  ],
  sources: ['DrugBank DB00586', 'Davies & Anderson 1997, Clin Pharmacokinet']
},

{
  id: 'omeprazole', name: 'Omeprazole', aliases: ['prilosec', 'losec'],
  class: 'OTC medicine', family: 'Proton pump inhibitor', schedule: 'OTC / prescription',
  tags: ['ppi', 'gastric-acid-suppressant', 'cyp2c19-inhibitor', 'non-psychoactive',
         'absorption-interaction'],
  mechanism: 'Irreversibly inhibits the gastric H+/K+ ATPase (the proton pump). Because inhibition is irreversible, acid suppression lasts far longer than the drug itself — new pumps must be synthesised.',
  halfLife: { hours: 1, range: [0.5, 1.5], confidence: 'measured',
    notes: 'A one-hour half-life producing 24 hours of acid suppression, because the enzyme inhibition is permanent for that pump.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'Hydroxylation', product: '5-Hydroxyomeprazole', fraction: 0.7,
        note: 'Dominant. CYP2C19 poor metabolisers (15-20% of East Asians) reach 3-10× the exposure and get much stronger acid suppression from a standard dose.' },
      { enzyme: 'CYP3A4', reaction: 'Sulfoxidation', product: 'Omeprazole sulfone', fraction: 0.25 }
    ],
    metabolites: [
      { name: '5-Hydroxyomeprazole', active: false, halfLifeH: 1.5, fraction: 0.7 },
      { name: 'Omeprazole sulfone', active: false, halfLifeH: 2, fraction: 0.25 }
    ],
    substrateOf: ['CYP2C19', 'CYP3A4'],
    inhibits: ['CYP2C19'],
    excretion: 'Renal ~77%, faecal remainder.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [60, 180], durationH: [24, 72], afterEffectsH: [0, 0], bioavailability: 0.4,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: [
    'Inhibits CYP2C19, which reduces clopidogrel activation (a genuine cardiovascular risk) and raises diazepam, escitalopram and some other drug levels.',
    'By raising stomach pH it changes the ABSORPTION of anything pH-dependent — this can meaningfully alter how much of an orally taken drug you absorb, in either direction.',
    'Long-term use is associated with B12, magnesium and iron deficiency.'
  ],
  sources: ['DrugBank DB00338', 'Shirasaka et al. 2013, Drug Metab Pharmacokinet']
},

{
  id: 'famotidine', name: 'Famotidine', aliases: ['pepcid', 'zantac 360'],
  class: 'OTC medicine', family: 'H2 receptor antagonist', schedule: 'OTC',
  tags: ['gastric-acid-suppressant', 'non-psychoactive', 'renally-cleared', 'absorption-interaction'],
  mechanism: 'Competitive histamine H2 receptor antagonist on gastric parietal cells. Faster in onset than a PPI and shorter-acting, with essentially no CYP involvement — which makes it the low-interaction choice for acid suppression.',
  halfLife: { hours: 3, range: [2.5, 4], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Minimal hepatic metabolism', reaction: 'Largely excreted unchanged', product: 'Famotidine', fraction: 0.7,
        note: 'Notably free of CYP interactions, unlike cimetidine which inhibits several CYPs. Renal function governs clearance.' },
      { enzyme: 'FMO', reaction: 'S-oxidation (minor)', product: 'Famotidine S-oxide', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Famotidine S-oxide', active: false, halfLifeH: 3, fraction: 0.2 }],
    substrateOf: ['FMO'], inhibits: [],
    excretion: 'Renal, 65-70% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 180], durationH: [10, 12], afterEffectsH: [0, 0], bioavailability: 0.42,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: ['Raises gastric pH and can alter absorption of pH-dependent drugs. Accumulates in renal impairment.'],
  sources: ['DrugBank DB00927']
},

{
  id: 'loratadine', name: 'Loratadine', aliases: ['claritin', 'clarityn'],
  class: 'OTC medicine', family: 'Second-generation antihistamine', schedule: 'OTC',
  tags: ['antihistamine', 'non-sedating', 'non-psychoactive', 'cyp3a4-substrate'],
  mechanism: 'Selective peripheral H1 antagonist. It is a P-glycoprotein substrate and so is actively kept out of the brain, which is why it does not sedate the way diphenhydramine does.',
  halfLife: { hours: 8, range: [3, 20], confidence: 'measured',
    notes: 'The active metabolite desloratadine has a ~27 h half-life and carries most of the effect, which is what makes once-daily dosing work.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Decarboethoxylation', product: 'Desloratadine', fraction: 0.5,
        note: 'Produces a more potent, much longer-lived active metabolite — itself marketed separately as a drug.' },
      { enzyme: 'CYP2D6', reaction: 'Decarboethoxylation', product: 'Desloratadine', fraction: 0.3,
        note: 'The dual pathway means inhibiting either enzyme alone has little effect — a useful redundancy.' },
      { enzyme: 'UGT2B10', reaction: 'Glucuronidation of desloratadine', product: 'Desloratadine glucuronide', fraction: 0.4 }
    ],
    metabolites: [{ name: 'Desloratadine', active: true, halfLifeH: 27, potencyRel: 2.5, fraction: 0.5,
      note: 'More potent than loratadine and far longer-lasting; the main active species.' }],
    substrateOf: ['CYP3A4', 'CYP2D6', 'UGT2B10', 'P-gp'], inhibits: [],
    excretion: 'Renal and faecal, roughly equally.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [60, 150], durationH: [20, 24], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'Non-sedating at normal doses, but that depends on P-glycoprotein keeping it out of the brain — P-gp inhibitors can undermine that.',
    'Doubling the dose does not double the relief; it mostly adds side effects.'
  ],
  sources: ['DrugBank DB00455']
},

{
  id: 'cetirizine', name: 'Cetirizine', aliases: ['zyrtec', 'reactine'],
  class: 'OTC medicine', family: 'Second-generation antihistamine', schedule: 'OTC',
  tags: ['antihistamine', 'mildly-sedating', 'non-psychoactive', 'renally-cleared'],
  mechanism: 'Selective peripheral H1 antagonist and the active metabolite of hydroxyzine. It penetrates the CNS slightly more than loratadine, so a minority of people do find it sedating.',
  halfLife: { hours: 8, range: [6, 11], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Minimal hepatic metabolism', reaction: 'Largely excreted unchanged', product: 'Cetirizine', fraction: 0.8,
        note: 'Unusually for an antihistamine it barely touches CYP, so it has very few drug interactions — but it accumulates in renal impairment.' },
      { enzyme: 'CYP3A4', reaction: 'O-dealkylation (minor)', product: 'Dealkylated metabolite', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Dealkylated cetirizine', active: false, halfLifeH: 9, fraction: 0.1 }],
    substrateOf: ['CYP3A4'], inhibits: [],
    excretion: 'Renal, ~70% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 90], durationH: [20, 24], afterEffectsH: [0, 0], bioavailability: 0.7,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 10], strong: [10, 20], heavy: 20, unit: 'mg' } }
  },
  warnings: [
    'Mildly sedating in a minority of people; additive with alcohol and other depressants.',
    'Long-term daily use can produce a genuine withdrawal itch on stopping — taper rather than stopping abruptly after months of use.'
  ],
  sources: ['DrugBank DB00341']
},

{
  id: 'guaifenesin', name: 'Guaifenesin', aliases: ['mucinex', 'robitussin chest'],
  class: 'OTC medicine', family: 'Expectorant', schedule: 'OTC',
  tags: ['expectorant', 'non-psychoactive'],
  mechanism: 'Expectorant that increases respiratory tract fluid volume, thinning mucus so it clears more easily. Evidence for benefit is modest.',
  halfLife: { hours: 1, range: [0.5, 1.5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Hepatic oxidation / hydrolysis', reaction: 'Oxidation and conjugation', product: 'Beta-(2-methoxyphenoxy)-lactic acid', fraction: 0.8 }
    ],
    metabolites: [{ name: 'Beta-(2-methoxyphenoxy)-lactic acid', active: false, halfLifeH: 1.5, fraction: 0.8 }],
    substrateOf: [], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [30, 60], durationH: [4, 6], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 100, light: [200, 400], common: [400, 800], strong: [800, 1200], heavy: 1200, unit: 'mg' } }
  },
  warnings: [
    'Included mainly because it is bundled with DXM in most cough syrups. At the DXM doses people take recreationally the guaifenesin load causes severe nausea and vomiting — a large part of why those syrups are so unpleasant to misuse.',
    'Very high doses are associated with kidney stones.'
  ],
  sources: ['DrugBank DB00874']
},

{
  id: 'bismuth-subsalicylate', name: 'Bismuth subsalicylate', aliases: ['pepto-bismol', 'kaopectate'],
  class: 'OTC medicine', family: 'Salicylate / antacid', schedule: 'OTC',
  tags: ['antidiarrhoeal', 'salicylate', 'reyes-syndrome-risk', 'non-psychoactive'],
  mechanism: 'Antidiarrhoeal and gastroprotective agent. In the gut it dissociates into bismuth (antimicrobial, coats the mucosa) and salicylate (anti-inflammatory, antisecretory) — the salicylate part is systemically absorbed and is what matters for interactions.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'measured', notes: 'As the absorbed salicylate; bismuth itself is barely absorbed but has a very long tissue half-life.' },
  metabolism: {
    pathways: [
      { enzyme: 'Gastric acid (non-enzymatic)', reaction: 'Dissociation in the stomach', product: 'Bismuth salts + salicylic acid', fraction: 0.95,
        note: 'The salicylate fraction is absorbed and behaves exactly like aspirin\'s active metabolite.' },
      { enzyme: 'UGT1A6', reaction: 'Glucuronidation of salicylate', product: 'Salicyluric acid', fraction: 0.6 }
    ],
    metabolites: [
      { name: 'Salicylic acid', active: true, halfLifeH: 3, potencyRel: 0.8, fraction: 0.95,
        note: 'A full therapeutic dose delivers a meaningful salicylate load — it adds to aspirin and other NSAIDs.' },
      { name: 'Bismuth salts', active: false, note: 'Minimally absorbed; harmlessly blackens the tongue and stool.' }
    ],
    substrateOf: ['UGT1A6'], excretion: 'Salicylate renally; bismuth largely faecal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 262, light: [262, 524], common: [524, 1050], strong: [1050, 2100], heavy: 2100, unit: 'mg' } }
  },
  warnings: [
    'It IS a salicylate. Do not give it to children or teenagers with a viral illness — the Reye\'s syndrome risk is the same as aspirin\'s, and this catches people out because it is sold as a stomach remedy.',
    'Adds to the salicylate load from aspirin and to bleeding risk from other NSAIDs.',
    'Harmlessly turns the tongue and stool black, which is alarming if unexpected.'
  ],
  sources: ['DrugBank DB01294']
},

{
  id: 'vitamin-c', name: 'Vitamin C', aliases: ['ascorbic acid', 'ascorbate'],
  class: 'OTC medicine', family: 'Vitamin', schedule: 'OTC supplement',
  tags: ['vitamin', 'urinary-acidifier', 'antioxidant', 'non-psychoactive'],
  mechanism: 'An essential vitamin and antioxidant. Included here for one specific reason: in gram doses it acidifies the urine, and several drugs in this database are cleared faster in acidic urine.',
  halfLife: { hours: 10, range: [8, 40], confidence: 'measured',
    notes: 'Highly dose-dependent. Absorption saturates around 200 mg per dose, so very large oral doses mostly pass through unabsorbed.' },
  metabolism: {
    pathways: [
      { enzyme: 'Non-enzymatic oxidation', reaction: 'Oxidation', product: 'Dehydroascorbic acid', fraction: 0.4, note: 'Reversibly recycled back to ascorbate.' },
      { enzyme: 'Hepatic metabolism', reaction: 'Further oxidation', product: 'Oxalate', fraction: 0.2, note: 'Why very high chronic doses raise kidney stone risk.' }
    ],
    metabolites: [
      { name: 'Dehydroascorbic acid', active: true, halfLifeH: 10, potencyRel: 1.0, fraction: 0.4 },
      { name: 'Oxalate', active: false, halfLifeH: 12, fraction: 0.2 }
    ],
    substrateOf: [], inhibits: [],
    excretion: 'Renal; excess is excreted essentially unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 120], peakMin: [120, 180], durationH: [8, 12], afterEffectsH: [0, 0], bioavailability: 0.7,
      doses: { threshold: 50, light: [100, 250], common: [250, 1000], strong: [1000, 2000], heavy: 3000, unit: 'mg' } }
  },
  warnings: [
    'Gram doses acidify urine and can measurably SHORTEN the duration of amphetamines and related bases by speeding their renal clearance. Sometimes used deliberately to shorten a comedown; the flip side is that it weakens a dose taken afterwards.',
    'Above ~2 g/day it commonly causes osmotic diarrhoea, and chronic high doses raise oxalate kidney stone risk.'
  ],
  sources: ['Levine et al. 1996, PNAS', 'Beckett & Rowland 1965 (urinary pH and amphetamine excretion)']
},

{
  id: 'sodium-bicarbonate', name: 'Sodium bicarbonate', aliases: ['baking soda', 'bicarb', 'antacid'],
  class: 'OTC medicine', family: 'Antacid / alkalinising agent', schedule: 'OTC',
  tags: ['antacid', 'urinary-alkaliniser', 'non-psychoactive', 'electrolyte-risk'],
  mechanism: 'Neutralises stomach acid and, systemically, alkalinises the urine. The urinary effect is the important one here: it traps basic drugs in a non-ionised, reabsorbable form, dramatically slowing their elimination.',
  halfLife: { hours: 1, range: [0.5, 2], confidence: 'measured', notes: 'As bicarbonate. The urinary pH change it causes lasts several hours.' },
  metabolism: {
    pathways: [
      { enzyme: 'Carbonic anhydrase', reaction: 'Conversion to CO2 and water', product: 'CO2 (exhaled) + sodium', fraction: 0.9,
        note: 'Not really metabolism — the bicarbonate buffers acid and leaves as exhaled carbon dioxide.' }
    ],
    metabolites: [{ name: 'CO2', active: false, note: 'Exhaled.' }],
    substrateOf: [], inhibits: [],
    excretion: 'Pulmonary as CO2; sodium renally.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [5, 20], peakMin: [20, 60], durationH: [2, 4], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 500, light: [1000, 2000], common: [2000, 4000], strong: [4000, 8000], heavy: 8000, unit: 'mg' } }
  },
  warnings: [
    'Alkalinising urine can more than DOUBLE the half-life of amphetamines, methamphetamine and other basic drugs — turning a 10 hour dose into a 20-30 hour one. Taken deliberately to potentiate a stimulant, this is a common route to accidental overdose and multi-day insomnia.',
    'It also slows memantine clearance by up to 80%.',
    'Large doses cause metabolic alkalosis and a substantial sodium load — dangerous in heart failure, hypertension or kidney disease.',
    'Taking it on a full stomach can cause gastric rupture in rare case reports.'
  ],
  sources: ['Beckett & Rowland 1965', 'Periclou et al. 2006, Clin Ther (memantine)']
}

]);

/* Medicines widely sold outside the US/UK that are absent from most English-language
   drug references — including several available over the counter in their home
   markets and several withdrawn elsewhere for safety reasons. */
DB.register([

{
  id: 'metamizole', name: 'Metamizole', aliases: ['dipyrone', 'novalgin', 'analgin', 'optalgin'],
  class: 'OTC medicine', family: 'Pyrazolone analgesic', schedule: 'OTC/Rx in much of Europe, Latin America, Russia; BANNED in US, UK, Sweden',
  tags: ['analgesic', 'antipyretic', 'spasmolytic', 'agranulocytosis-risk', 'non-psychoactive'],
  mechanism: 'A potent non-opioid analgesic, antipyretic and smooth-muscle spasmolytic, widely used in Germany, Spain, Brazil, Russia and much of Latin America. It is a prodrug — the parent is not detectable in plasma. Banned in the US, UK and Scandinavia over agranulocytosis.',
  halfLife: { hours: 7, range: [2.5, 10], confidence: 'measured',
    notes: 'This is the active metabolite MAA; metamizole itself is hydrolysed before absorption is complete and is never measurable.' },
  metabolism: {
    firstPass: 'Complete non-enzymatic hydrolysis in gastric juice before absorption — it is a true prodrug.',
    pathways: [
      { enzyme: 'Non-enzymatic hydrolysis (gastric)', reaction: 'Hydrolysis in the stomach', product: '4-Methylaminoantipyrine (MAA)', fraction: 0.95,
        note: 'The main active species. Happens before absorption, so it occurs identically regardless of liver function.' },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'N-demethylation', product: '4-Aminoantipyrine (AA)', fraction: 0.4, note: 'Also active.' },
      { enzyme: 'NAT2', reaction: 'Acetylation', product: '4-Acetylaminoantipyrine (AAA)', fraction: 0.3,
        note: 'NAT2 acetylator status alters the metabolite balance between individuals.' }
    ],
    metabolites: [
      { name: '4-Methylaminoantipyrine', active: true, halfLifeH: 7, potencyRel: 1.0, fraction: 0.95, note: 'The principal active analgesic.' },
      { name: '4-Aminoantipyrine', active: true, halfLifeH: 5, potencyRel: 0.6, fraction: 0.4 },
      { name: '4-Acetylaminoantipyrine', active: false, halfLifeH: 8, fraction: 0.3 }
    ],
    substrateOf: ['CYP2C19', 'CYP3A4', 'NAT2'],
    induces: ['CYP2B6', 'CYP3A4'],
    excretion: 'Renal, ~90% as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 250, light: [250, 500], common: [500, 1000], strong: [1000, 2000], heavy: 2000, unit: 'mg',
        note: 'Typical adult dose 500-1000 mg up to four times daily; maximum 4 g/day.' } }
  },
  warnings: [
    'Banned in the US, UK and Sweden because of agranulocytosis — a sudden collapse in white blood cells that leaves you defenceless against infection. It is rare (estimates range from 1 in 1,500 to 1 in a million courses, hence the disagreement between countries) but can be fatal. A sore throat, mouth ulcers or fever while taking it needs an urgent blood count.',
    'It induces CYP3A4 and CYP2B6, which can lower levels of other drugs — this is under-appreciated because it is thought of as a simple painkiller.',
    'Can cause severe hypotension when given rapidly by injection.'
  ],
  sources: ['Rogosch et al. 2012, Bioorg Med Chem', 'Andrade et al. 2016, Eur J Clin Pharmacol']
},

{
  id: 'nimesulide', name: 'Nimesulide', aliases: ['aulin', 'nimulid', 'nise'],
  class: 'OTC medicine', family: 'NSAID (sulfonanilide)', schedule: 'Rx in Italy, India, Brazil, Russia; never approved in US/UK',
  tags: ['nsaid', 'analgesic', 'anti-inflammatory', 'hepatotoxic', 'gi-bleed-risk', 'non-psychoactive'],
  mechanism: 'COX-2 preferential NSAID, popular in Italy, India, Brazil and Russia. Never approved in the US or UK and withdrawn from several countries over liver injury.',
  halfLife: { hours: 3, range: [2, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Hydroxylation', product: '4-Hydroxynimesulide', fraction: 0.6, note: 'Main route; the metabolite retains some activity.' },
      { enzyme: 'Nitroreductase', reaction: 'Nitro group reduction', product: 'Amino-nimesulide', fraction: 0.15,
        note: 'Reactive intermediates from this route are the leading suspect in its hepatotoxicity.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: '4-Hydroxynimesulide', active: true, halfLifeH: 4, potencyRel: 0.4, fraction: 0.6 },
      { name: 'Amino-nimesulide', active: false, halfLifeH: 4, fraction: 0.15 }
    ],
    substrateOf: ['CYP2C9', 'UGT'], excretion: 'Renal ~50%, faecal ~30%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [90, 180], durationH: [6, 8], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 50, light: [50, 100], common: [100, 200], strong: [200, 400], heavy: 400, unit: 'mg' } }
  },
  warnings: [
    'Withdrawn in Finland, Spain, Ireland and elsewhere over acute liver failure, and restricted in Italy to 15 days maximum. It is the reason it never reached the US or UK.',
    'Do not use with alcohol, paracetamol or anything else hepatotoxic.',
    'Contraindicated in children in most markets.'
  ],
  sources: ['Bessone 2010, World J Gastroenterol', 'EMA nimesulide review 2011']
},

{
  id: 'promethazine', name: 'Promethazine', aliases: ['phenergan', 'avomine'],
  class: 'OTC medicine', family: 'Phenothiazine antihistamine', schedule: 'OTC in UK/AU/many countries; Rx in US',
  tags: ['antihistamine', 'sedative', 'antiemetic', 'anticholinergic', 'cns-depressant',
         'respiratory-depressant-children', 'qt-prolonging'],
  toleranceGroup: 'anticholinergic', toleranceHalfLifeDays: 3,
  mechanism: 'First-generation phenothiazine antihistamine with potent H1, muscarinic, D2 and alpha-1 blockade. Strongly sedating and antiemetic. Sold over the counter as a sleep aid and travel-sickness remedy across much of the world.',
  halfLife: { hours: 12, range: [10, 19], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~25%.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Hydroxylation', product: 'Hydroxypromethazine', fraction: 0.4,
        note: 'CYP2D6 poor metabolisers, or anyone on a 2D6 inhibitor, get substantially more sedation from a standard dose.' },
      { enzyme: 'FMO3', reaction: 'S-oxidation', product: 'Promethazine sulfoxide', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Hydroxypromethazine', active: true, halfLifeH: 14, potencyRel: 0.4, fraction: 0.4 },
      { name: 'Promethazine sulfoxide', active: false, halfLifeH: 12, fraction: 0.3 }
    ],
    substrateOf: ['CYP2D6', 'FMO3', 'UGT'], inhibits: [],
    excretion: 'Renal and biliary, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [120, 180], durationH: [6, 12], afterEffectsH: [8, 16], bioavailability: 0.25,
      doses: { threshold: 6.25, light: [10, 25], common: [25, 50], strong: [50, 75], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'The other half of "lean"/purple drank alongside codeine. The combination is far more dangerous than codeine alone — promethazine adds sedation and respiratory depression, and its antiemetic action suppresses the vomiting that would otherwise limit an overdose.',
    'Contraindicated under 2 years old — it has caused fatal respiratory depression in infants, and carries a boxed warning for this.',
    'Strongly additive with alcohol, opioids and benzodiazepines. Prolongs the QT interval.',
    'Severe tissue injury if injected outside a vein; oral or deep intramuscular only.'
  ],
  sources: ['DrugBank DB01069', 'FDA boxed warning']
},

{
  id: 'domperidone', name: 'Domperidone', aliases: ['motilium'],
  class: 'OTC medicine', family: 'Peripheral D2 antagonist', schedule: 'OTC/Rx in EU, Canada, Asia; NOT approved in US',
  tags: ['antiemetic', 'prokinetic', 'qt-prolonging', 'cardiotoxic', 'non-psychoactive'],
  mechanism: 'Dopamine D2 antagonist that barely crosses the blood-brain barrier, so it relieves nausea and speeds gastric emptying without the movement disorders metoclopramide causes. Never approved in the US because of cardiac arrhythmia risk.',
  halfLife: { hours: 7.5, range: [7, 9], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive; oral bioavailability only ~15%.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation and N-dealkylation', product: '5-Hydroxydomperidone', fraction: 0.7,
        note: 'Heavily CYP3A4-dependent — inhibitors like ketoconazole, clarithromycin, ritonavir or grapefruit raise levels and with them the arrhythmia risk. Several of those combinations are formally contraindicated.' },
      { enzyme: 'CYP1A2 / CYP2E1', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.15 }
    ],
    metabolites: [{ name: '5-Hydroxydomperidone', active: false, halfLifeH: 8, fraction: 0.7 }],
    substrateOf: ['CYP3A4', 'CYP1A2'], inhibits: [],
    excretion: 'Faecal ~66%, renal ~33%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [30, 60], durationH: [6, 8], afterEffectsH: [0, 0], bioavailability: 0.15,
      doses: { threshold: 5, light: [10, 10], common: [10, 20], strong: [20, 30], heavy: 40, unit: 'mg',
        note: 'EU guidance restricts it to 10 mg three times daily for a maximum of 7 days, specifically to limit cardiac risk.' } }
  },
  warnings: [
    'Prolongs the QT interval and has caused sudden cardiac death — the reason the US never approved it and the EU restricted the dose and duration in 2014.',
    'Strongly additive with other QT-prolonging drugs: methadone, ondansetron, many antipsychotics, ibogaine.',
    'CYP3A4 inhibitors are contraindicated with it.'
  ],
  sources: ['EMA domperidone referral 2014', 'DrugBank DB01184']
},

{
  id: 'metoclopramide', name: 'Metoclopramide', aliases: ['reglan', 'maxolon', 'primperan'],
  class: 'OTC medicine', family: 'D2 antagonist / prokinetic', schedule: 'Rx in most countries; OTC in some',
  tags: ['antiemetic', 'prokinetic', 'dystonia-risk', 'tardive-dyskinesia-risk', 'd2-antagonist'],
  mechanism: 'D2 antagonist and 5-HT4 agonist that speeds gastric emptying and suppresses nausea. Unlike domperidone it does cross into the brain, which is where its movement-disorder side effects come from.',
  halfLife: { hours: 5, range: [4, 6], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-dealkylation and hydroxylation', product: 'Monodeethylmetoclopramide', fraction: 0.35,
        note: 'CYP2D6 poor metabolisers reach higher levels and have a notably higher risk of dystonic reactions.' },
      { enzyme: 'UGT / SULT', reaction: 'Conjugation', product: 'Sulfate and glucuronide conjugates', fraction: 0.4 }
    ],
    metabolites: [{ name: 'Monodeethylmetoclopramide', active: false, halfLifeH: 6, fraction: 0.35 }],
    substrateOf: ['CYP2D6', 'UGT'], inhibits: [],
    excretion: 'Renal, ~85%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 5, light: [5, 10], common: [10, 10], strong: [10, 20], heavy: 30, unit: 'mg' } }
  },
  warnings: [
    'Causes acute dystonic reactions — sudden involuntary muscle spasms of the neck, jaw and eyes — most often in young people and within hours of the first dose. Frightening but treatable with an anticholinergic.',
    'Use beyond 5 days risks tardive dyskinesia, which can be permanent. It carries a boxed warning for this and EU guidance caps treatment at 5 days.',
    'Additive dystonia risk with antipsychotics; blunts the effect of dopaminergic drugs.'
  ],
  sources: ['EMA metoclopramide review 2013', 'DrugBank DB01233']
},

{
  id: 'carisoprodol', name: 'Carisoprodol', aliases: ['soma', 'somadril'],
  class: 'Depressant', family: 'Carbamate muscle relaxant', schedule: 'IV (US); withdrawn in EU',
  tags: ['depressant', 'muscle-relaxant', 'gaba-a-positive', 'cns-depressant', 'respiratory-depressant',
         'prodrug', 'addictive', 'withdrawal-dangerous'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 5,
  mechanism: 'Marketed as a muscle relaxant, but it is a prodrug for meprobamate — a barbiturate-like anxiolytic from the 1950s. That is what people are actually taking, and why it is misused.',
  halfLife: { hours: 2, range: [1.5, 2.5], confidence: 'measured',
    notes: 'Deeply misleading on its own: the meprobamate metabolite has a 10 h half-life and accumulates, so effects and impairment far outlast the parent.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'N-dealkylation', product: 'Meprobamate', fraction: 0.6,
        note: 'The key step. CYP2C19 ultra-rapid metabolisers produce more meprobamate and get more sedation; poor metabolisers accumulate carisoprodol instead.' },
      { enzyme: 'CYP2C19', reaction: 'Hydroxylation', product: 'Hydroxycarisoprodol', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Meprobamate', active: true, halfLifeH: 10, potencyRel: 1.0, fraction: 0.6,
        note: 'A GABA-A positive modulator of the barbiturate type, with its own dependence liability and dangerous withdrawal. This is the real drug.' },
      { name: 'Hydroxycarisoprodol', active: false, halfLifeH: 3, fraction: 0.2 }
    ],
    substrateOf: ['CYP2C19'], excretion: 'Renal, as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [4, 6], afterEffectsH: [8, 24], bioavailability: 0.9,
      doses: { threshold: 175, light: [250, 350], common: [350, 700], strong: [700, 1400], heavy: 1400, unit: 'mg' } }
  },
  warnings: [
    'Withdrawn across the EU in 2008 for abuse and psychomotor impairment. Its metabolite meprobamate is barbiturate-like, with genuine dependence and a withdrawal syndrome that can include seizures.',
    'Fatal with opioids or alcohol — it is a common component of the "Holy Trinity" (opioid + benzodiazepine + carisoprodol) implicated in many overdose deaths.',
    'Do not stop abruptly after sustained use.'
  ],
  sources: ['EMA carisoprodol withdrawal 2007', 'Bramness et al. 2004, Forensic Sci Int']
},

{
  id: 'tilidine', name: 'Tilidine', aliases: ['valoron', 'valtran'],
  class: 'Opioid', family: 'Synthetic opioid', schedule: 'Rx in Germany, Belgium, Switzerland; not US/UK',
  tags: ['opioid', 'mu-agonist', 'prodrug', 'analgesic', 'respiratory-depressant',
         'cns-depressant', 'addictive'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A prodrug opioid widely prescribed in Germany and the Benelux countries. Tilidine itself is nearly inactive; the liver converts it to nortilidine, which is the actual analgesic. Usually formulated with naloxone to deter injection.',
  halfLife: { hours: 3.5, range: [3, 5], confidence: 'measured', notes: 'As nortilidine, the active species.' },
  metabolism: {
    firstPass: 'Extensive and necessary — the first pass is what activates it.',
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'N-demethylation', product: 'Nortilidine', fraction: 0.7,
        note: 'The activating step. The active metabolite is roughly 20× the parent at the mu receptor.' },
      { enzyme: 'CYP3A4', reaction: 'Further demethylation', product: 'Bisnortilidine', fraction: 0.2, note: 'Weakly active.' }
    ],
    metabolites: [
      { name: 'Nortilidine', active: true, halfLifeH: 3.5, potencyRel: 20, fraction: 0.7, note: 'The real analgesic; roughly 0.2× morphine.' },
      { name: 'Bisnortilidine', from: 'Nortilidine', active: true, halfLifeH: 4, potencyRel: 2, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'], excretion: 'Renal, ~90%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 40], peakMin: [30, 60], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.99,
      doses: { threshold: 25, light: [50, 100], common: [100, 200], strong: [200, 400], heavy: 400, unit: 'mg',
        note: 'Usually dispensed as tilidine/naloxone drops or tablets; 50-100 mg is a typical adult dose.' } }
  },
  warnings: [
    'The naloxone in the combination product is inactivated by first-pass metabolism when swallowed, but blocks the effect if injected — that is deliberate, and injecting it precipitates withdrawal.',
    'CYP3A4 inhibitors reduce activation and therefore analgesia; inducers increase it.',
    'Fatal with benzodiazepines or alcohol.'
  ],
  sources: ['DrugBank DB13757', 'German prescribing information']
},

{
  id: 'nefopam', name: 'Nefopam', aliases: ['acupan'],
  class: 'OTC medicine', family: 'Benzoxazocine analgesic', schedule: 'Rx in France, UK, many EU; not US',
  tags: ['analgesic', 'non-opioid', 'anticholinergic', 'seizure-risk', 'serotonergic',
         'sympathomimetic', 'mao-contraindicated'],
  mechanism: 'A non-opioid, non-NSAID analgesic used widely in France and parts of Europe. It works as a triple monoamine reuptake inhibitor with sodium and calcium channel blockade — pharmacologically closer to an antidepressant than to a conventional painkiller.',
  halfLife: { hours: 4, range: [3, 8], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Desmethylnefopam', fraction: 0.4, note: 'Active.' },
      { enzyme: 'CYP3A4', reaction: 'N-oxidation', product: 'Nefopam N-oxide', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Desmethylnefopam', active: true, halfLifeH: 5, potencyRel: 0.5, fraction: 0.4 },
      { name: 'Nefopam N-oxide', active: false, halfLifeH: 5, fraction: 0.25 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4'], excretion: 'Renal, ~87%.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [4, 6], afterEffectsH: [1, 4], bioavailability: 0.35,
      doses: { threshold: 15, light: [30, 30], common: [30, 60], strong: [60, 90], heavy: 90, unit: 'mg' } }
  },
  warnings: [
    'Because it inhibits serotonin and noradrenaline reuptake it is contraindicated with MAOIs and carries serotonin syndrome risk with SSRIs, SNRIs, tramadol and MDMA — surprising for something dispensed as a simple painkiller.',
    'Lowers the seizure threshold; avoid in epilepsy and with other seizure-threshold-lowering drugs.',
    'Marked anticholinergic effects: dry mouth, sweating, tachycardia, urinary retention.'
  ],
  sources: ['Girard et al. 2016, Fundam Clin Pharmacol', 'French prescribing information']
},

{
  id: 'etifoxine', name: 'Etifoxine', aliases: ['stresam'],
  class: 'Depressant', family: 'Benzoxazine anxiolytic', schedule: 'Rx in France and ~40 countries; not US/UK',
  tags: ['anxiolytic', 'gaba-a-positive', 'neurosteroid', 'cns-depressant', 'hepatotoxic-rare'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 4,
  mechanism: 'A non-benzodiazepine anxiolytic used mainly in France. It works two ways: direct positive modulation at a distinct GABA-A site (the beta subunit rather than the benzodiazepine site), and stimulation of endogenous neurosteroid synthesis via the TSPO translocator protein. That combination gives anxiolysis with comparatively little sedation or dependence.',
  halfLife: { hours: 6, range: [4, 8], confidence: 'measured',
    notes: 'Its active metabolite has a ~20 h half-life and contributes substantially with repeated dosing.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'N-deethylation', product: 'Desethyletifoxine', fraction: 0.5, note: 'Active and much longer-lived.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxyetifoxine', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Desethyletifoxine', active: true, halfLifeH: 20, potencyRel: 0.8, fraction: 0.5 },
      { name: 'Hydroxyetifoxine', active: false, halfLifeH: 8, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19'], excretion: 'Renal and biliary.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 180], durationH: [6, 10], afterEffectsH: [4, 12], bioavailability: 0.9,
      doses: { threshold: 50, light: [50, 100], common: [150, 200], strong: [200, 300], heavy: 300, unit: 'mg' } }
  },
  warnings: [
    'Rare but serious idiosyncratic liver injury and severe skin reactions (DRESS, Stevens-Johnson) prompted French regulatory review — any rash or jaundice means stopping immediately.',
    'Less dependence-forming than benzodiazepines, but still additive with alcohol and other depressants.'
  ],
  sources: ['ANSM etifoxine safety review', 'Nguyen et al. 2006, Hum Psychopharmacol']
},

{
  id: 'piracetam', name: 'Piracetam', aliases: ['nootropil', 'lucetam'],
  class: 'Other', family: 'Racetam', schedule: 'Rx/OTC across EU, Russia, Asia; NOT a legal supplement in US',
  tags: ['nootropic', 'non-psychoactive', 'renally-cleared'],
  mechanism: 'The original nootropic and the compound the word was coined for. Modulates AMPA receptors and improves membrane fluidity; despite decades of use across Europe and Russia, evidence for cognitive benefit in healthy people remains weak.',
  halfLife: { hours: 5, range: [4, 6], confidence: 'measured' },
  metabolism: {
    firstPass: 'None; oral bioavailability ~100%.',
    pathways: [
      { enzyme: 'None (not metabolised)', reaction: 'No biotransformation in humans', product: 'Unchanged piracetam', fraction: 1.0,
        note: 'Excreted entirely unchanged by the kidneys — no CYP interactions at all, but it accumulates in renal impairment.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Not metabolised.' }],
    substrateOf: [], inhibits: [],
    excretion: 'Renal, 100% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 90], durationH: [4, 8], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 400, light: [800, 1600], common: [1600, 4800], strong: [4800, 9600], heavy: 9600, unit: 'mg' } }
  },
  warnings: [
    'The FDA has ruled it is not a lawful dietary supplement in the US, though it is sold openly as one.',
    'It has antiplatelet activity — a real consideration alongside aspirin, NSAIDs or anticoagulants.',
    'Accumulates in kidney impairment.'
  ],
  sources: ['Winblad 2005, CNS Drug Rev', 'FDA warning letters on piracetam']
},

{
  id: 'phenylpiracetam', name: 'Phenylpiracetam', aliases: ['phenotropil', 'carphedon'],
  class: 'Stimulant', family: 'Racetam', schedule: 'Rx in Russia; WADA-banned; unscheduled elsewhere',
  tags: ['nootropic', 'stimulant', 'dopamine-reuptake-inhibitor', 'wada-banned'],
  toleranceGroup: 'phenylpiracetam', toleranceHalfLifeDays: 3,
  mechanism: 'Phenylated piracetam developed in the Soviet Union for cosmonauts. The phenyl group makes it far more lipophilic and adds genuine stimulant activity — it inhibits dopamine and noradrenaline reuptake, unlike piracetam which does neither.',
  halfLife: { hours: 4, range: [3, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Hepatic hydrolysis', reaction: 'Amide hydrolysis', product: 'Phenylpiracetam acid', fraction: 0.4 },
      { enzyme: 'CYP', reaction: 'Aromatic hydroxylation', product: 'Hydroxyphenylpiracetam', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Phenylpiracetam acid', active: false, halfLifeH: 5, fraction: 0.4 },
      { name: 'Hydroxyphenylpiracetam', active: false, halfLifeH: 5, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4'], excretion: 'Renal, ~40% unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [60, 120], durationH: [4, 8], afterEffectsH: [2, 6], bioavailability: 1.0,
      doses: { threshold: 50, light: [100, 200], common: [200, 400], strong: [400, 600], heavy: 600, unit: 'mg' } }
  },
  warnings: [
    'Banned by WADA as a stimulant — it will fail a sports drug test.',
    'Tolerance to the stimulant effect builds within days of daily use.',
    'Additive cardiovascular strain with other stimulants.'
  ],
  sources: ['Malykh & Sadaie 2010, Drugs', 'WADA prohibited list']
},

{
  id: 'meldonium', name: 'Meldonium', aliases: ['mildronate'],
  class: 'Other', family: 'Metabolic modulator', schedule: 'Rx in Latvia/Russia/Baltics; WADA-banned; not US/EU-wide',
  tags: ['metabolic-modulator', 'wada-banned', 'non-psychoactive', 'cardioprotective'],
  mechanism: 'Inhibits carnitine biosynthesis, shifting cardiac metabolism from fatty acid oxidation toward glucose — which needs less oxygen. Developed in Latvia and used across the former Soviet states for angina and ischaemia. Not psychoactive.',
  halfLife: { hours: 5, range: [3, 15], confidence: 'measured', notes: 'Dose-dependent; the tissue effect on carnitine levels persists far longer than plasma clearance, which is why it stays detectable for months.' },
  metabolism: {
    pathways: [
      { enzyme: 'Minimal metabolism', reaction: 'Largely excreted unchanged', product: 'Meldonium', fraction: 0.85 },
      { enzyme: 'Hepatic oxidation', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Hydroxymeldonium', active: false, halfLifeH: 6, fraction: 0.1 }],
    substrateOf: [], inhibits: [],
    excretion: 'Renal, largely unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 120], durationH: [8, 12], afterEffectsH: [0, 0], bioavailability: 0.78,
      doses: { threshold: 100, light: [250, 500], common: [500, 1000], strong: [1000, 2000], heavy: 2000, unit: 'mg' } }
  },
  warnings: [
    'WADA-banned since 2016 — the Sharapova case. It remains detectable for months after stopping, which caught out many athletes who had quit before the ban.',
    'Not psychoactive; included because it is commonly encountered in Eastern European medicine cabinets and is absent from most English-language references.'
  ],
  sources: ['Dambrova et al. 2016, Pharmacol Res', 'WADA prohibited list 2016']
},

{
  id: 'drotaverine', name: 'Drotaverine', aliases: ['no-spa', 'nospa'],
  class: 'OTC medicine', family: 'PDE4 inhibitor / antispasmodic', schedule: 'OTC across Eastern Europe, Russia, India; not US/UK',
  tags: ['antispasmodic', 'non-psychoactive', 'vasodilator'],
  mechanism: 'Selective PDE4 inhibitor that relaxes smooth muscle. Extremely widely used across Eastern Europe, Russia and India for menstrual, biliary and gastrointestinal cramps — essentially a household staple there and almost unknown in English-language references.',
  halfLife: { hours: 8, range: [7, 12], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C9', reaction: 'O-demethylation', product: 'Desmethyldrotaverine', fraction: 0.5 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.35 }
    ],
    metabolites: [{ name: 'Desmethyldrotaverine', active: true, halfLifeH: 9, potencyRel: 0.4, fraction: 0.5 }],
    substrateOf: ['CYP3A4', 'CYP2C9'], excretion: 'Renal and biliary, as conjugates.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [45, 120], durationH: [6, 10], afterEffectsH: [0, 0], bioavailability: 0.6,
      doses: { threshold: 20, light: [40, 40], common: [40, 80], strong: [80, 120], heavy: 240, unit: 'mg' } }
  },
  warnings: [
    'Causes vasodilation and can lower blood pressure — additive with alcohol, nitrates and antihypertensives.',
    'Structurally related to papaverine; not psychoactive despite occasional claims otherwise.'
  ],
  sources: ['Bolaji et al. 1996, Eur J Drug Metab Pharmacokinet']
},

{
  id: 'chlorphenamine', name: 'Chlorphenamine', aliases: ['chlorpheniramine', 'piriton', 'chlor-trimeton'],
  class: 'OTC medicine', family: 'First-generation antihistamine', schedule: 'OTC worldwide',
  tags: ['antihistamine', 'sedative', 'anticholinergic', 'cns-depressant', 'serotonergic-weak'],
  toleranceGroup: 'anticholinergic', toleranceHalfLifeDays: 2,
  mechanism: 'First-generation H1 antagonist, sedating and anticholinergic. Also a moderately potent serotonin reuptake inhibitor — an under-recognised property that matters in combination.',
  halfLife: { hours: 22, range: [14, 25], confidence: 'measured', notes: 'Much longer than most people assume for a cold-and-flu ingredient; next-day drowsiness is common.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Desmethylchlorphenamine', fraction: 0.45,
        note: 'CYP2D6 poor metabolisers get considerably more sedation.' },
      { enzyme: 'CYP3A4', reaction: 'Further demethylation', product: 'Didesmethylchlorphenamine', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Desmethylchlorphenamine', active: true, halfLifeH: 24, potencyRel: 0.5, fraction: 0.45 },
      { name: 'Didesmethylchlorphenamine', active: false, halfLifeH: 24, fraction: 0.2 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4'], inhibits: ['CYP2D6'],
    excretion: 'Renal, as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [120, 180], durationH: [6, 12], afterEffectsH: [8, 24], bioavailability: 0.4,
      doses: { threshold: 2, light: [4, 4], common: [4, 8], strong: [8, 12], heavy: 16, unit: 'mg' } }
  },
  warnings: [
    'Its serotonin reuptake inhibition is genuine — a real, if modest, serotonin syndrome contribution alongside MDMA, tramadol, DXM or SSRIs. Almost nobody expects this from a hay fever tablet.',
    'Strongly sedating and additive with alcohol and other depressants; 22 hour half-life means next-day impairment.',
    'Anticholinergic; long-term use is associated with raised dementia risk.'
  ],
  sources: ['DrugBank DB01114', 'Carruthers et al. 1978, Clin Pharmacol Ther']
},

{
  id: 'hydroxyzine', name: 'Hydroxyzine', aliases: ['atarax', 'vistaril', 'ucerax'],
  class: 'OTC medicine', family: 'Piperazine antihistamine', schedule: 'OTC in some countries; Rx in US/UK',
  tags: ['antihistamine', 'anxiolytic', 'sedative', 'anticholinergic', 'qt-prolonging', 'cns-depressant'],
  toleranceGroup: 'anticholinergic', toleranceHalfLifeDays: 3,
  mechanism: 'First-generation H1 antagonist with 5-HT2A antagonism, prescribed widely for anxiety and itching. Non-addictive, which is why it is often used as a benzodiazepine alternative — its active metabolite is cetirizine.',
  halfLife: { hours: 20, range: [14, 25], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'ADH / CYP3A4', reaction: 'Oxidation of the alcohol to a carboxylic acid', product: 'Cetirizine', fraction: 0.45,
        note: 'Produces cetirizine — a marketed antihistamine in its own right, and the reason hydroxyzine gives long-lasting antihistamine cover.' },
      { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Norhydroxyzine', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Cetirizine', active: true, halfLifeH: 8, potencyRel: 0.6, fraction: 0.45 },
      { name: 'Norhydroxyzine', active: false, halfLifeH: 20, fraction: 0.2 }
    ],
    substrateOf: ['CYP3A4', 'ADH'], inhibits: [],
    excretion: 'Renal and faecal, as metabolites.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [120, 180], durationH: [6, 12], afterEffectsH: [8, 20], bioavailability: 0.8,
      doses: { threshold: 10, light: [12.5, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Prolongs the QT interval — the EMA restricted the maximum dose in 2015 for this reason. Additive with methadone, ondansetron and antipsychotics.',
    'Strongly sedating and additive with alcohol, opioids and benzodiazepines.',
    'Frequently used to manage stimulant comedowns; safer than a benzodiazepine for that, but the QT and sedation caveats still apply.'
  ],
  sources: ['EMA hydroxyzine review 2015', 'DrugBank DB00557']
}

]);
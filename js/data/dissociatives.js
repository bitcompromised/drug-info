/* Dissociatives — arylcyclohexylamines, morphinans, gases */
DB.register([

{
  id: 'ketamine', name: 'Ketamine', aliases: ['ket', 'k', 'special k', 'ketalar'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'III (US)',
  tags: ['dissociative', 'nmda-antagonist', 'anaesthetic', 'respiratory-depressant-mild',
         'urotoxic', 'addictive', 'cns-depressant'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'Non-competitive NMDA receptor antagonist binding inside the open channel pore. Also has HCN1, opioid and monoaminergic activity. Its rapid antidepressant effect is now attributed largely to downstream AMPA activation and the metabolite (2R,6R)-hydroxynorketamine.',
  halfLife: { hours: 2.75, range: [2, 3.5], confidence: 'measured',
    notes: 'Terminal half-life ~2.5-3 h, but the dissociative effect fades in 45-90 min because of rapid redistribution out of the brain, not elimination.' },
  metabolism: {
    firstPass: 'Very heavy — oral bioavailability only 17-24%, which is why oral doses need to be 3-4x an intramuscular dose and produce a much more norketamine-dominated, sedating effect.',
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Norketamine', fraction: 0.6,
        note: 'Dominant route. CYP3A4 inhibitors (grapefruit, ritonavir, clarithromycin, ketoconazole) markedly raise ketamine exposure.' },
      { enzyme: 'CYP2B6', reaction: 'N-demethylation', product: 'Norketamine', fraction: 0.3,
        note: 'Higher affinity than CYP3A4; dominates at the low concentrations used for depression infusions.' },
      { enzyme: 'CYP2A6 / CYP2C9', reaction: 'Hydroxylation of norketamine', product: 'Hydroxynorketamines', fraction: 0.2 },
      { enzyme: 'Dehydrogenases', reaction: 'Dehydration of norketamine', product: 'Dehydronorketamine', fraction: 0.15 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugated hydroxynorketamines', fraction: 0.4 }
    ],
    metabolites: [
      { name: 'Norketamine', active: true, halfLifeH: 5, potencyRel: 0.3,
        note: 'Roughly one third as potent as ketamine at NMDA but longer-lasting. Oral use produces far more of it, which is why oral ketamine feels heavier and more sedating.' },
      { name: '(2R,6R)-Hydroxynorketamine', from: 'Norketamine', active: true, halfLifeH: 7, potencyRel: 0.05,
        note: 'Not an NMDA blocker but currently the leading candidate for ketamine\'s antidepressant action via AMPA potentiation.' },
      { name: 'Dehydronorketamine', active: false, halfLifeH: 10, note: 'Main urinary marker.' }
    ],
    substrateOf: ['CYP3A4', 'CYP2B6', 'CYP2C9', 'CYP2A6'], inhibits: [],
    excretion: 'Renal, ~2% unchanged, ~80% as conjugated metabolites.',
    confidence: 'measured'
  },
  routes: {
    insufflated: { onsetMin: [3, 10], peakMin: [15, 30], durationH: [0.75, 1.5], afterEffectsH: [1, 4], bioavailability: 0.45,
      doses: { threshold: 5, light: [15, 30], common: [30, 75], strong: [75, 150], heavy: 150, unit: 'mg',
        note: 'A "hole" (full dissociation) is typically 100-250 mg insufflated.' } },
    oral: { onsetMin: [15, 40], peakMin: [45, 90], durationH: [1.5, 3], afterEffectsH: [1, 4], bioavailability: 0.2,
      doses: { threshold: 40, light: [50, 100], common: [100, 250], strong: [250, 450], heavy: 450, unit: 'mg' } },
    im: { onsetMin: [2, 5], peakMin: [10, 20], durationH: [0.75, 1.5], afterEffectsH: [1, 4], bioavailability: 0.93,
      doses: { threshold: 5, light: [10, 25], common: [25, 50], strong: [50, 100], heavy: 100, unit: 'mg' } },
    iv: { onsetMin: [0.2, 1], peakMin: [1, 5], durationH: [0.5, 1], afterEffectsH: [1, 4], bioavailability: 1.0,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 80], heavy: 80, unit: 'mg' } }
  },
  warnings: [
    'Ketamine-induced uropathy is the main harm of regular use — bladder pain, urgency, ulcerative cystitis, and in severe cases irreversible bladder contraction requiring surgery. It correlates with frequency and cumulative dose, and can appear within months of heavy use.',
    'Combining with other CNS depressants (alcohol, benzodiazepines, opioids, GHB) risks airway obstruction and vomit aspiration — the usual cause of ketamine deaths.',
    'Loss of the gag reflex plus vomiting is a genuine hazard; recovery position matters.'
  ],
  refs: ['Zanos et al. 2018, Pharmacol Rev', 'Peltoniemi et al. 2016, Clin Pharmacokinet']
},

{
  id: 'dxm', name: 'DXM', aliases: ['dextromethorphan', 'robitussin', 'robo', 'delsym'],
  class: 'Dissociative', family: 'Morphinan', schedule: 'OTC (restricted in some states)',
  tags: ['dissociative', 'nmda-antagonist', 'serotonergic', 'sigma-agonist', 'antitussive',
         'serotonin-syndrome-risk', 'cyp2d6-critical', 'cns-depressant'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'A prodrug: the active dissociative is its metabolite dextrorphan, an NMDA antagonist. DXM itself is a sigma-1 agonist and a potent serotonin reuptake inhibitor — the SRI activity is what makes it dangerous with serotonergic drugs.',
  halfLife: { hours: 3.5, range: [2, 4], confidence: 'measured',
    notes: 'CRITICAL: this applies to CYP2D6 extensive metabolisers. In poor metabolisers (~7-10% of Europeans) the half-life stretches to 24-30 hours, exposure rises up to 10-fold, and ordinary doses become overdoses. Anyone taking a CYP2D6 inhibitor is functionally converted into a poor metaboliser.' },
  metabolism: {
    firstPass: 'Extensive in extensive metabolisers; oral bioavailability only ~11% because CYP2D6 destroys most of it on the first pass.',
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'Dextrorphan', fraction: 0.7,
        note: 'THE key step. Produces the active dissociative. Highly polymorphic and easily inhibited by fluoxetine, paroxetine, bupropion, quinidine, diphenhydramine and many others.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: '3-Methoxymorphinan', fraction: 0.2 },
      { enzyme: 'CYP2D6 / CYP3A4', reaction: 'Secondary demethylation', product: '3-Hydroxymorphinan', fraction: 0.15 },
      { enzyme: 'UGT2B15', reaction: 'Glucuronidation of dextrorphan', product: 'Dextrorphan-O-glucuronide', fraction: 0.6 }
    ],
    metabolites: [
      { name: 'Dextrorphan', active: true, halfLifeH: 4, potencyRel: 1.0,
        note: 'The actual dissociative — a moderate-affinity NMDA channel blocker. This is what produces the plateaus.' },
      { name: '3-Methoxymorphinan', active: true, halfLifeH: 5, potencyRel: 0.2 },
      { name: '3-Hydroxymorphinan', from: 'Dextrorphan', active: true, halfLifeH: 5, potencyRel: 0.3 }
    ],
    substrateOf: ['CYP2D6', 'CYP3A4', 'UGT2B15'], inhibits: [],
    excretion: 'Renal, largely as dextrorphan glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [120, 180], durationH: [4, 8], afterEffectsH: [3, 12], bioavailability: 0.11,
      doses: { threshold: 50, light: [100, 200], common: [200, 400], strong: [400, 600], heavy: 600, unit: 'mg',
        note: 'Plateaus: 1st ~1.5-2.5 mg/kg, 2nd 2.5-7.5, 3rd 7.5-15, 4th 15+ mg/kg.' } }
  },
  warnings: [
    'Never combine with SSRIs, SNRIs, MAOIs, tramadol or other serotonergics — DXM is itself a serotonin reuptake inhibitor and this combination causes serotonin syndrome. Deaths are documented.',
    'Many DXM cough products also contain paracetamol/acetaminophen, guaifenesin or antihistamines. At recreational DXM doses the paracetamol alone reaches hepatotoxic amounts. Always check for a single-ingredient product.',
    'CYP2D6 inhibitors turn a normal dose into a many-fold overdose that lasts a day or more.'
  ],
  refs: ['Zawertailo et al. 2010, J Clin Psychopharmacol', 'Silvasti et al. 1987, Int J Clin Pharmacol']
},

{
  id: '3-meo-pcp', name: '3-MeO-PCP', aliases: ['3-methoxyphencyclidine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'stimulant', 'high-toxicity',
         'psychosis-risk', 'cns-depressant', 'compulsive-redosing'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Potent NMDA antagonist with higher NMDA affinity than PCP itself, plus meaningful SERT and NET reuptake inhibition and sigma-1 activity — hence the stimulant edge and the manic presentation in overdose.',
  halfLife: { hours: 6, range: [4, 11], confidence: 'estimated',
    notes: 'No formal PK studies. Estimated from case reports and the long reported durations. Long enough that redosing stacks badly.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'O-demethylation', product: '3-HO-PCP', fraction: 0.35, note: 'Yields an active metabolite that is itself a potent dissociative with opioid activity.' },
      { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Piperidine ring hydroxylation', product: 'Hydroxy-3-MeO-PCP', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: '3-HO-PCP', active: true, halfLifeH: 7, potencyRel: 1.2, note: 'Active and, unusually, a potent mu-opioid agonist as well as an NMDA blocker.' },
      { name: 'Hydroxy-3-MeO-PCP', active: false }
    ],
    substrateOf: ['CYP2B6', 'CYP2C19', 'CYP3A4'], excretion: 'Renal, as conjugates.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [90, 180], durationH: [5, 10], afterEffectsH: [4, 24], bioavailability: 0.7,
      doses: { threshold: 2, light: [3, 7], common: [7, 12], strong: [12, 20], heavy: 20, unit: 'mg' } },
    insufflated: { onsetMin: [5, 20], peakMin: [30, 60], durationH: [4, 8], afterEffectsH: [4, 24], bioavailability: 0.8,
      doses: { threshold: 1, light: [2, 5], common: [5, 10], strong: [10, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'Responsible for a disproportionate number of dissociative deaths and hospitalisations. Active in single milligrams — volumetric dosing is essential.',
    'The long, delayed onset drives redosing before the first dose has peaked; this is the single most common route to overdose with this compound.',
    'Overdose presents as extreme agitation, hypertension, catatonia and psychosis, often lasting days.'
  ],
  refs: ['Bakota et al. 2016, J Anal Toxicol', 'Johansson et al. 2017, Forensic Sci Int']
},

{
  id: 'mxe', name: 'MXE', aliases: ['methoxetamine', 'mexxy'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'I (US) / banned widely',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'serotonergic', 'urotoxic',
         'cerebellar-toxicity', 'cns-depressant', 'addictive'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Ketamine analogue with an N-ethyl group and 3-methoxy substitution; higher NMDA affinity, longer duration, and additional serotonin reuptake inhibition.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'N-deethylation', product: 'Normethoxetamine', fraction: 0.4, note: 'Active, by analogy with norketamine.' },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation', product: 'O-desmethyl-MXE (normetketamine-like)', fraction: 0.25 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Normethoxetamine', active: true, halfLifeH: 8, potencyRel: 0.3 },
      { name: 'O-desmethyl-MXE', active: true, halfLifeH: 6, potencyRel: 0.4 }
    ],
    substrateOf: ['CYP2B6', 'CYP3A4', 'CYP2D6'], excretion: 'Renal.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 150], durationH: [3, 6], afterEffectsH: [2, 12], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 70], heavy: 70, unit: 'mg' } },
    insufflated: { onsetMin: [5, 20], peakMin: [30, 60], durationH: [2, 4], afterEffectsH: [2, 12], bioavailability: 0.75,
      doses: { threshold: 3, light: [5, 15], common: [15, 30], strong: [30, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'The delayed onset (up to 90 min) caused very many overdoses through redosing — this was the defining hazard of MXE.',
    'Associated with cerebellar toxicity (ataxia lasting days), acute kidney injury and urinary tract damage.'
  ],
  refs: ['Zawilska 2014, Forensic Sci Int', 'Craig & Loeffler 2014, Br J Clin Pharmacol']
},

{
  id: 'dck', name: 'Deschloroketamine', aliases: ['dck', '2-oxo-pcm'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies / analogue',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'urotoxic', 'addictive'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 4,
  mechanism: 'Ketamine analogue lacking the chlorine atom; markedly more potent than ketamine and considerably longer-lasting.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'N-demethylation (presumed)', product: 'Nor-DCK', fraction: 0.55 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
    ],
    metabolites: [{ name: 'Nor-DCK', active: true, halfLifeH: 8, potencyRel: 0.3, note: 'Presumed active by analogy with norketamine.' }],
    substrateOf: ['CYP3A4', 'CYP2B6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [3, 12], bioavailability: 0.6,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg' } },
    insufflated: { onsetMin: [5, 15], peakMin: [25, 50], durationH: [2, 5], afterEffectsH: [3, 12], bioavailability: 0.75,
      doses: { threshold: 3, light: [5, 15], common: [15, 25], strong: [25, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: ['Much longer than ketamine; users accustomed to ketamine\'s timing routinely redose far too early.'],
  refs: ['Limited; user-reported and forensic data']
},

{
  id: '2-fdck', name: '2-FDCK', aliases: ['2-fluorodeschloroketamine', 'fluoroketamine'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'Varies',
  tags: ['dissociative', 'nmda-antagonist', 'research-chemical', 'cns-depressant', 'urotoxic', 'addictive'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'Fluorinated ketamine analogue; subjectively very close to ketamine with a slightly longer duration.',
  halfLife: { hours: 3.5, range: [2, 5], confidence: 'analogue' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'N-demethylation (presumed)', product: 'Nor-2-FDCK', fraction: 0.55 },
      { enzyme: 'CYP2A6', reaction: 'Hydroxylation', product: 'Hydroxy-nor-2-FDCK', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Nor-2-FDCK', active: true, halfLifeH: 6, potencyRel: 0.3 }],
    substrateOf: ['CYP3A4', 'CYP2B6'], excretion: 'Renal.', confidence: 'analogue'
  },
  routes: {
    insufflated: { onsetMin: [3, 12], peakMin: [20, 40], durationH: [1, 2.5], afterEffectsH: [1, 5], bioavailability: 0.45,
      doses: { threshold: 5, light: [15, 35], common: [35, 80], strong: [80, 150], heavy: 150, unit: 'mg' } },
    oral: { onsetMin: [15, 45], peakMin: [50, 100], durationH: [2, 4], afterEffectsH: [1, 5], bioavailability: 0.2,
      doses: { threshold: 40, light: [60, 120], common: [120, 250], strong: [250, 400], heavy: 400, unit: 'mg' } }
  },
  warnings: ['Presumed to carry the same bladder toxicity risk as ketamine with repeated use.'],
  refs: ['Tang et al. 2020, Drug Test Anal']
},

{
  id: 'pcp', name: 'PCP', aliases: ['phencyclidine', 'angel dust'],
  class: 'Dissociative', family: 'Arylcyclohexylamine', schedule: 'II (US)',
  tags: ['dissociative', 'nmda-antagonist', 'anaesthetic', 'psychosis-risk', 'long-duration',
         'cns-depressant', 'seizure-risk'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 5,
  mechanism: 'Potent NMDA channel blocker with additional dopamine reuptake inhibition and sigma activity — the dopaminergic component explains the agitation and psychosis that distinguish it from ketamine.',
  halfLife: { hours: 21, range: [7, 46], confidence: 'measured',
    notes: 'Extremely variable and very long. It is highly lipophilic and redistributes from fat, producing prolonged and sometimes recurrent intoxication.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Piperidine ring hydroxylation', product: '4-phenyl-4-(1-piperidinyl)cyclohexanol (PPC)', fraction: 0.45 },
      { enzyme: 'CYP2B6', reaction: 'Hydroxylation', product: '1-(1-phenylcyclohexyl)-4-hydroxypiperidine (PCHP)', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.5 }
    ],
    metabolites: [{ name: 'PPC', active: false }, { name: 'PCHP', active: false }],
    substrateOf: ['CYP3A4', 'CYP2B6'], excretion: 'Renal, ~10% unchanged; acidification was historically used to speed clearance.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 60], peakMin: [90, 180], durationH: [6, 12], afterEffectsH: [12, 48], bioavailability: 0.7,
      doses: { threshold: 1, light: [3, 5], common: [5, 10], strong: [10, 15], heavy: 15, unit: 'mg' } },
    smoked: { onsetMin: [1, 5], peakMin: [10, 30], durationH: [4, 8], afterEffectsH: [12, 48], bioavailability: 0.7,
      doses: { threshold: 1, light: [2, 4], common: [4, 8], strong: [8, 12], heavy: 12, unit: 'mg' } }
  },
  warnings: [
    'Well documented for causing violent agitation, analgesia sufficient to mask serious injury, hyperthermia and rhabdomyolysis.',
    'Fat redistribution can cause symptoms to recur days later.'
  ],
  refs: ['Baselt, Disposition of Toxic Drugs', 'Domino 1980, Ann NY Acad Sci']
},

{
  id: 'nitrous', name: 'Nitrous oxide', aliases: ['n2o', 'laughing gas', 'whippits', 'nangs', 'balloons'],
  class: 'Dissociative', family: 'Inhalant gas', schedule: 'Unscheduled (restricted supply in some countries)',
  tags: ['dissociative', 'nmda-antagonist', 'inhalant', 'b12-antagonist', 'hypoxia-risk', 'neurotoxicity-risk'],
  toleranceGroup: 'nitrous', toleranceHalfLifeDays: 0.05,
  mechanism: 'NMDA antagonist with opioid and GABA-A activity. Notable for irreversibly oxidising the cobalt centre of vitamin B12, permanently inactivating methionine synthase — this is the basis of its distinctive neurological toxicity.',
  halfLife: { hours: 0.08, range: [0.05, 0.15], confidence: 'measured',
    notes: 'About 5 minutes; eliminated essentially unchanged through the lungs with almost no metabolism.' },
  metabolism: {
    firstPass: 'None — it is a gas absorbed and eliminated via the alveoli.',
    pathways: [
      { enzyme: 'None (pulmonary excretion)', reaction: 'Exhaled unchanged', product: 'N2O', fraction: 0.99,
        note: 'Over 99% is eliminated unmetabolised through the lungs.' },
      { enzyme: 'Gut bacteria (reductase)', reaction: 'Minor reduction', product: 'Nitrogen', fraction: 0.01 }
    ],
    metabolites: [{ name: 'None of significance', active: false, note: 'The harm comes not from metabolites but from irreversible oxidation of vitamin B12 in the body.' }],
    substrateOf: [], inhibits: ['Methionine synthase'],
    excretion: 'Pulmonary, >99% unchanged.', confidence: 'measured'
  },
  routes: {
    inhaled: { onsetMin: [0.1, 0.5], peakMin: [0.5, 1], durationH: [0.02, 0.08], afterEffectsH: [0.1, 0.5], bioavailability: 1.0,
      doses: { threshold: 0.5, light: [1, 1], common: [1, 2], strong: [2, 4], heavy: 4, unit: 'canisters',
        note: 'Dosed in 8 g canisters/balloons rather than mg.' } }
  },
  warnings: [
    'Regular use causes functional vitamin B12 deficiency and subacute combined degeneration of the spinal cord — numbness, tingling, weakness and unsteady gait that can become permanent. This is now common in emergency departments. B12 supplementation reduces but does not eliminate the risk.',
    'Inhaling from a mask, bag over the head, or in an enclosed space causes death by asphyxiation. Always inhale from a balloon with room air between breaths.',
    'Direct inhalation from a pressurised canister causes cold burns to the lungs and airway.',
    'Never use while standing — fainting is common and head injuries are the most frequent acute harm.'
  ],
  refs: ['Garakani et al. 2016, Am J Addict', 'Oussalah et al. 2019, Clin Nutr']
},

{
  id: 'memantine', name: 'Memantine', aliases: ['namenda', 'ebixa'],
  class: 'Dissociative', family: 'Adamantane', schedule: 'Prescription',
  tags: ['dissociative', 'nmda-antagonist', 'long-duration', 'nootropic'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 10,
  mechanism: 'Low-affinity, fast off-rate NMDA channel blocker — it blocks pathological tonic activation while sparing normal synaptic transmission, which is why it is tolerable as a daily Alzheimer\'s medication.',
  halfLife: { hours: 70, range: [60, 100], confidence: 'measured',
    notes: 'Very long. Steady state takes roughly two weeks, and effects of a single dose persist for days.' },
  metabolism: {
    firstPass: 'Minimal; oral bioavailability ~100%.',
    pathways: [
      { enzyme: 'Minimal hepatic metabolism', reaction: 'Hydroxylation and conjugation', product: 'Memantine glucuronide, 6-hydroxymemantine', fraction: 0.2,
        note: 'Unusually, ~80% of the dose is excreted completely unchanged. CYP involvement is negligible, so it has very few metabolic interactions.' }
    ],
    metabolites: [{ name: '6-Hydroxymemantine', active: false }, { name: 'Memantine glucuronide', active: false }],
    substrateOf: [], inhibits: ['CYP2B6'],
    excretion: 'Renal, ~80% unchanged. Alkaline urine reduces clearance up to 80% — a real interaction with sodium bicarbonate and carbonic anhydrase inhibitors.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [180, 420], durationH: [12, 24], afterEffectsH: [24, 72], bioavailability: 1.0,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg',
        note: 'Therapeutic dosing is 5-20 mg/day. Recreational doses are far higher and accumulate dangerously given the 70 h half-life.' } }
  },
  warnings: [
    'The 70 hour half-life means repeated recreational doses accumulate over days — delirium from stacking is the characteristic harm.',
    'Reduces tolerance to other NMDA antagonists and to opioids; interacts additively with ketamine and DXM.'
  ],
  refs: ['DrugBank DB01043', 'Periclou et al. 2006, Clin Ther']
}

]);
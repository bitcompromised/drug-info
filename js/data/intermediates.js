/* ==========================================================================
   Intermediate metabolites
   --------------------------------------------------------------------------
   Metabolites that are themselves metabolised further. Without entries of
   their own they appeared as dead ends in the metabolite explorer — heroin's
   6-MAM showed no onward step even though it becomes morphine, which then
   becomes M3G and M6G.

   Given class 'Metabolite' rather than their pharmacological class so they
   group together instead of cluttering the drug classes, but tagged normally
   so a search for "opioid" still finds 6-MAM.

   Terminal species (glucuronides, CO2, hippuric acid, glucose) are NOT here —
   they genuinely are the end of the chain, and inventing further steps for
   them would be wrong.
   ========================================================================== */
DB.register([

{
  id: '6-mam', name: '6-Monoacetylmorphine', aliases: ['6-mam', '6-acetylmorphine', '6-am'],
  class: 'Metabolite', family: 'Morphinan — metabolite of heroin', schedule: 'I (US)',
  metaboliteOf: ['heroin'],
  tags: ['opioid', 'mu-agonist', 'metabolite', 'respiratory-depressant', 'cns-depressant',
         'forensic-marker'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'The first deacetylation product of heroin and the compound responsible for its characteristic rush. It retains one acetyl group, so it is far more lipophilic than morphine and crosses the blood-brain barrier rapidly — heroin is essentially a delivery system for getting this into the brain fast. It is then deacetylated again to morphine, which carries the duration.',
  halfLife: { hours: 0.4, range: [0.1, 0.6], confidence: 'measured',
    notes: 'Roughly 6-25 minutes. Short-lived, but its detection is legally decisive: 6-MAM is the only unique marker proving heroin use rather than morphine or codeine, and it is detectable in urine for just 2-8 hours.' },
  metabolism: {
    firstPass: 'Not applicable — it is formed in blood and tissue from heroin rather than absorbed.',
    pathways: [
      { enzyme: 'CES1 / hepatic esterases', reaction: 'Deacetylation at the 6-position', product: 'Morphine', fraction: 0.9,
        note: 'The onward step. Rapid and near-complete, which is why the heroin experience becomes a morphine experience within minutes.' },
      { enzyme: 'UGT2B7', reaction: 'Direct glucuronidation (minor)', product: '6-MAM-glucuronide', fraction: 0.05,
        note: 'A small parallel route that bypasses morphine entirely.' }
    ],
    metabolites: [
      { name: 'Morphine', active: true, halfLifeH: 2.5, potencyRel: 0.25, fraction: 0.9,
        note: 'The onward product, and where the duration of a heroin dose actually comes from. Its own metabolites (M3G, M6G) continue the chain.' },
      { name: '6-MAM-glucuronide', active: false, halfLifeH: 1, fraction: 0.05 }
    ],
    substrateOf: ['CES1', 'UGT2B7'],
    transporters: ['P-gp'],
    pharmacogenetics: 'CES1 variants alter how fast it converts to morphine, shifting the balance between the rush and the plateau.',
    excretion: 'Almost entirely via conversion to morphine; a small unchanged renal fraction.',
    confidence: 'measured'
  },
  routes: {
    iv: { onsetMin: [0.2, 1], peakMin: [1, 4], durationH: [0.3, 1], afterEffectsH: [1, 4], bioavailability: 1.0,
      doses: { threshold: 1, light: [2, 4], common: [4, 8], strong: [8, 15], heavy: 15, unit: 'mg',
        note: 'Not taken directly — it forms from heroin in the body. Doses shown only so the model can represent it.' } }
  },
  warnings: [
    'Roughly 4× morphine and highly brain-penetrant. It is the reason injected heroin produces a rush that morphine does not.',
    'Its presence in toxicology is what distinguishes heroin from prescribed morphine or codeine — but the window is only a few hours.'
  ],
  sources: ['Rook et al. 2006, Curr Clin Pharmacol', 'Boix & Andersen 2012, Basic Clin Pharmacol Toxicol']
},

{
  id: 'cotinine', name: 'Cotinine', aliases: ['nicotine metabolite'],
  class: 'Metabolite', family: 'Pyridine — metabolite of nicotine', schedule: 'Unscheduled',
  metaboliteOf: ['nicotine'],
  tags: ['metabolite', 'forensic-marker', 'weakly-active', 'non-psychoactive'],
  toleranceGroup: 'nicotine', toleranceHalfLifeDays: 2,
  mechanism: 'The dominant nicotine metabolite, produced by CYP2A6. Only weakly active at nicotinic receptors, but it accumulates to roughly ten times nicotine\'s concentration in regular smokers, so it is the standard biomarker of tobacco exposure.',
  halfLife: { hours: 16, range: [10, 27], confidence: 'measured',
    notes: 'Far longer than nicotine\'s 2 hours, which is what makes it useful as an exposure marker — detectable for 3-4 days after the last cigarette.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2A6', reaction: '3\'-hydroxylation', product: 'trans-3\'-Hydroxycotinine', fraction: 0.4,
        note: 'The main onward route. The 3HC/cotinine ratio is the clinical measure of CYP2A6 activity and predicts which smoking-cessation treatment will work.' },
      { enzyme: 'UGT1A4 / UGT2B10', reaction: 'N-glucuronidation', product: 'Cotinine-N-glucuronide', fraction: 0.15 },
      { enzyme: 'CYP2A6', reaction: 'N-oxidation', product: 'Cotinine-N-oxide', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'trans-3\'-Hydroxycotinine', active: false, halfLifeH: 6.6, fraction: 0.4,
        note: 'The main urinary species. Its ratio to cotinine is a validated CYP2A6 phenotype marker.' },
      { name: 'Cotinine-N-glucuronide', active: false, halfLifeH: 8, fraction: 0.15 },
      { name: 'Cotinine-N-oxide', active: false, halfLifeH: 7, fraction: 0.05 }
    ],
    substrateOf: ['CYP2A6', 'UGT1A4', 'UGT2B10'],
    pharmacogenetics: 'CYP2A6 reduced-function carriers clear cotinine slowly and show a low 3HC/cotinine ratio. Those "slow metabolisers" respond better to nicotine patches; fast metabolisers do better on varenicline.',
    excretion: 'Renal, largely as trans-3\'-hydroxycotinine and its glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 120], durationH: [12, 24], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 0.5, light: [1, 5], common: [5, 20], strong: [20, 50], heavy: 50, unit: 'mg',
        note: 'Not taken recreationally — it forms from nicotine. Present at roughly 250-300 ng/ml in a typical smoker.' } }
  },
  warnings: ['Only weakly psychoactive. Included because it is the standard tobacco-exposure biomarker and the continuation of nicotine\'s metabolic chain.'],
  sources: ['Benowitz et al. 2009, Handb Exp Pharmacol']
},

{
  id: 'benzoylecgonine', name: 'Benzoylecgonine', aliases: ['bze', 'cocaine metabolite'],
  class: 'Metabolite', family: 'Tropane — metabolite of cocaine', schedule: 'Unscheduled as a metabolite',
  metaboliteOf: ['cocaine', 'cocaethylene'],
  tags: ['metabolite', 'forensic-marker', 'inactive', 'vasoconstrictor-weak'],
  mechanism: 'The principal cocaine metabolite and the target of essentially every cocaine drug test in the world. Pharmacologically inactive at the dopamine transporter — it does not cross the blood-brain barrier well — though it retains weak vasoconstrictive activity.',
  halfLife: { hours: 6, range: [4, 7], confidence: 'measured',
    notes: 'Six times cocaine\'s own half-life, which is why it stays detectable in urine for 2-4 days after a single use and up to two weeks in heavy users.' },
  metabolism: {
    pathways: [
      { enzyme: 'Non-enzymatic / esterase hydrolysis', reaction: 'Hydrolysis of the benzoyl ester', product: 'Ecgonine', fraction: 0.4,
        note: 'The onward step, producing the terminal inactive metabolite.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Benzoylecgonine glucuronide', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Ecgonine', active: false, halfLifeH: 7, fraction: 0.4, note: 'Terminal, inactive.' },
      { name: 'Benzoylecgonine glucuronide', active: false, halfLifeH: 7, fraction: 0.15 }
    ],
    substrateOf: ['CES1', 'UGT'],
    excretion: 'Renal, largely unchanged. Detection window 2-4 days typical, up to 14 days with heavy chronic use.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [60, 180], durationH: [4, 8], afterEffectsH: [0, 0], bioavailability: 0.4,
      doses: { threshold: 5, light: [10, 25], common: [25, 60], strong: [60, 120], heavy: 120, unit: 'mg',
        note: 'Not taken directly. Formed from cocaine, and the reason a cocaine test stays positive long after the effects end.' } }
  },
  warnings: [
    'Inactive at the dopamine transporter — it produces no high. Its significance is entirely forensic.',
    'Retains weak vasoconstrictive activity and has been detected in the CSF of heavy users, where it may contribute to prolonged cerebrovascular risk.'
  ],
  sources: ['Jeffcoat et al. 1989, Drug Metab Dispos', 'Baselt, Disposition of Toxic Drugs']
},

{
  id: 'salicylic-acid', name: 'Salicylic acid', aliases: ['salicylate'],
  class: 'Metabolite', family: 'Salicylate — metabolite of aspirin', schedule: 'Unscheduled',
  metaboliteOf: ['aspirin', 'bismuth-subsalicylate'],
  tags: ['metabolite', 'analgesic', 'antipyretic', 'nsaid', 'gi-bleed-risk', 'saturable-kinetics'],
  mechanism: 'The active analgesic and antipyretic metabolite of aspirin, formed within minutes by plasma esterases. It inhibits COX reversibly — so it relieves pain and fever but does NOT produce aspirin\'s irreversible antiplatelet effect, which belongs to the acetyl group aspirin leaves behind on the enzyme.',
  halfLife: { hours: 3, range: [2, 12], confidence: 'measured',
    notes: 'Genuinely dose-dependent: about 2-3 hours at analgesic doses, stretching past 12 hours in overdose as conjugation saturates. That shift from first-order to zero-order kinetics is what makes salicylate poisoning escalate unexpectedly.' },
  kinetics: { order: 'first', nonlinear: true },
  metabolism: {
    pathways: [
      { enzyme: 'Glycine N-acyltransferase', reaction: 'Conjugation with glycine', product: 'Salicyluric acid', fraction: 0.6,
        note: 'The main route, and the one that SATURATES — glycine supply is limited. Once it does, salicylate levels climb disproportionately with dose.' },
      { enzyme: 'UGT1A6', reaction: 'Phenolic glucuronidation', product: 'Salicyl phenolic glucuronide', fraction: 0.15,
        note: 'Also saturable.' },
      { enzyme: 'UGT2B7', reaction: 'Acyl glucuronidation', product: 'Salicyl acyl glucuronide', fraction: 0.1 },
      { enzyme: 'CYP2E1', reaction: 'Hydroxylation', product: 'Gentisic acid', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Salicyluric acid', active: false, halfLifeH: 4, fraction: 0.6, note: 'Main urinary species.' },
      { name: 'Salicyl phenolic glucuronide', active: false, halfLifeH: 4, fraction: 0.15 },
      { name: 'Gentisic acid', active: false, halfLifeH: 4, fraction: 0.05 }
    ],
    substrateOf: ['UGT1A6', 'UGT2B7', 'CYP2E1'],
    pharmacogenetics: 'Glycine availability, not genotype, is the practical limit. Urinary alkalinisation dramatically increases renal clearance and is the mainstay of overdose treatment.',
    excretion: 'Renal. Only ~10% unchanged at normal pH, but alkalinising urine to pH 8 can raise that several-fold — the basis of treating salicylate poisoning with bicarbonate.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 100, light: [250, 500], common: [500, 1000], strong: [1000, 2000], heavy: 2000, unit: 'mg' } }
  },
  warnings: [
    'Salicylate poisoning is deceptive: kinetics turn saturable, so a modest extra dose produces a large rise in level. Ringing ears and hyperventilation are early signs and warrant urgent assessment.',
    'Reye\'s syndrome risk applies to salicylate exposure generally, including from bismuth subsalicylate — not only from aspirin tablets.'
  ],
  sources: ['Needs & Brooks 1985, Clin Pharmacokinet', 'Levy 1979, Pediatrics']
},

{
  id: '4-hydroxyamphetamine', name: '4-Hydroxyamphetamine', aliases: ['4-oh-amphetamine', 'paredrine'],
  class: 'Metabolite', family: 'Phenethylamine — metabolite of amphetamine', schedule: 'Unscheduled',
  metaboliteOf: ['amphetamine', 'methamphetamine', 'dextroamphetamine'],
  tags: ['metabolite', 'sympathomimetic', 'weakly-active', 'peripheral'],
  toleranceGroup: 'amphetamine', toleranceHalfLifeDays: 4,
  mechanism: 'CYP2D6 hydroxylation product of amphetamine. It barely crosses the blood-brain barrier, so its effects are almost entirely peripheral — it was historically used as an eye drop to dilate pupils. Its own onward metabolism produces a false neurotransmitter.',
  halfLife: { hours: 10, range: [6, 14], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'DBH (dopamine β-hydroxylase)', reaction: 'β-hydroxylation', product: '4-Hydroxynorephedrine', fraction: 0.3,
        note: 'The onward step, and an interesting one: the product is stored in noradrenergic vesicles and released as a FALSE NEUROTRANSMITTER, weakly displacing noradrenaline. It is a proposed contributor to amphetamine tolerance.' },
      { enzyme: 'UGT / SULT', reaction: 'Conjugation of the phenol', product: '4-Hydroxyamphetamine conjugates', fraction: 0.5 }
    ],
    metabolites: [
      { name: '4-Hydroxynorephedrine', active: true, halfLifeH: 12, potencyRel: 0.1, fraction: 0.3,
        note: 'A false neurotransmitter stored and released in place of noradrenaline.' },
      { name: '4-Hydroxyamphetamine sulfate', active: false, halfLifeH: 10, fraction: 0.5 }
    ],
    substrateOf: ['DBH', 'UGT', 'SULT'],
    pharmacogenetics: 'Formed by CYP2D6, so how much appears depends on the parent drug\'s genotype-dependent conversion.',
    excretion: 'Renal, largely as sulfate and glucuronide conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [2, 6], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg',
        note: 'Not taken directly; forms from amphetamine and methamphetamine.' } }
  },
  warnings: ['Peripherally sympathomimetic — contributes to the cardiovascular load of amphetamines without adding to the subjective effect.'],
  sources: ['Dolder et al. 2017, Clin Pharmacokinet']
},

{
  id: 'norfluoxetine', name: 'Norfluoxetine', aliases: ['desmethylfluoxetine'],
  class: 'Metabolite', family: 'SSRI — metabolite of fluoxetine', schedule: 'Unscheduled',
  metaboliteOf: ['fluoxetine'],
  tags: ['metabolite', 'ssri', 'serotonergic', 'serotonin-syndrome-risk', 'cyp2d6-inhibitor-strong',
         'mao-contraindicated', 'long-duration'],
  mechanism: 'The active metabolite of fluoxetine, equipotent as a serotonin reuptake inhibitor and dramatically longer-lived. It is the reason fluoxetine effectively self-tapers, and the reason a five-week washout is required before starting an MAOI.',
  halfLife: { hours: 240, range: [96, 384], confidence: 'measured',
    notes: '4-16 days. This single number governs fluoxetine\'s whole clinical profile: no discontinuation syndrome, but a washout measured in weeks and CYP2D6 inhibition that outlasts stopping the drug.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'Further N-demethylation', product: 'Didesmethylfluoxetine', fraction: 0.3 },
      { enzyme: 'UGT', reaction: 'Glucuronidation of the phenol', product: 'Norfluoxetine glucuronide', fraction: 0.35 }
    ],
    metabolites: [
      { name: 'Didesmethylfluoxetine', active: false, halfLifeH: 200, fraction: 0.3 },
      { name: 'Norfluoxetine glucuronide', active: false, halfLifeH: 250, fraction: 0.35 }
    ],
    substrateOf: ['CYP3A4', 'CYP2C19', 'UGT'],
    inhibits: ['CYP2D6', 'CYP3A4'],
    pharmacogenetics: 'A potent CYP2D6 inhibitor in its own right. Because it persists for weeks, stopping fluoxetine does not promptly restore CYP2D6 function — a frequently missed cause of interactions in people who "stopped their antidepressant".',
    excretion: 'Renal, as conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [240, 480], peakMin: [360, 480], durationH: [24, 24], afterEffectsH: [0, 0], bioavailability: 0.7,
      doses: { threshold: 5, light: [10, 20], common: [20, 40], strong: [40, 60], heavy: 60, unit: 'mg',
        note: 'Not prescribed separately; forms from fluoxetine.' } }
  },
  warnings: [
    'Its 4-16 day half-life is why an MAOI cannot be started for five weeks after stopping fluoxetine — the interaction risk long outlives the parent drug.',
    'Continues to inhibit CYP2D6 for weeks after the last fluoxetine dose.'
  ],
  sources: ['Hiemke & Härtter 2000, Pharmacol Ther', 'DrugBank DB00472']
},

{
  id: 'hydroxybupropion', name: 'Hydroxybupropion',
  class: 'Metabolite', family: 'NDRI — metabolite of bupropion', schedule: 'Unscheduled',
  metaboliteOf: ['bupropion'],
  tags: ['metabolite', 'ndri', 'dopamine-reuptake-inhibitor', 'cyp2d6-inhibitor-strong', 'seizure-risk'],
  mechanism: 'The principal active metabolite of bupropion, formed by CYP2B6. It reaches plasma concentrations up to twenty times higher than the parent, so most of what bupropion does — including its potent CYP2D6 inhibition — is really this compound.',
  halfLife: { hours: 20, range: [15, 25], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation', product: 'Hydroxybupropion glucuronide', fraction: 0.5,
        note: 'The main clearance route.' },
      { enzyme: 'CYP', reaction: 'Further oxidation', product: 'Oxidised metabolites', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'Hydroxybupropion glucuronide', active: false, halfLifeH: 22, fraction: 0.5 }
    ],
    substrateOf: ['UGT2B7'],
    inhibits: ['CYP2D6'],
    pharmacogenetics: 'CYP2B6 genotype determines how much of it forms — and therefore how strongly bupropion inhibits CYP2D6 and how much seizure risk it carries. The interaction profile is genotype-dependent at one remove.',
    excretion: 'Renal, as the glucuronide.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [120, 300], peakMin: [180, 420], durationH: [12, 24], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 50, light: [100, 200], common: [200, 400], strong: [400, 600], heavy: 600, unit: 'mg',
        note: 'Not prescribed separately; forms from bupropion at up to 20× the parent concentration.' } }
  },
  warnings: [
    'Carries most of bupropion\'s CYP2D6 inhibition — the reason bupropion blocks codeine and tramadol from working.',
    'Contributes to the seizure risk, which is dose-dependent.'
  ],
  sources: ['Jefferson et al. 2005, Clin Ther', 'DrugBank DB01156']
},

{
  id: 'norclobazam', name: 'N-desmethylclobazam', aliases: ['norclobazam'],
  class: 'Metabolite', family: 'Benzodiazepine — metabolite of clobazam', schedule: 'Unscheduled',
  metaboliteOf: ['clobazam'],
  tags: ['metabolite', 'benzodiazepine', 'gaba-a-positive', 'cns-depressant', 'anticonvulsant',
         'long-duration', 'accumulation-risk'],
  toleranceGroup: 'gaba', toleranceHalfLifeDays: 9,
  mechanism: 'The dominant active species after clobazam dosing. Individually weaker than the parent at the benzodiazepine site, but present at 8-20 times the concentration, so it accounts for most of the therapeutic effect and most of the sedation.',
  halfLife: { hours: 76, range: [60, 82], confidence: 'measured',
    notes: 'Over three days. It accumulates for two weeks or more before reaching steady state, which is why clobazam feels progressively stronger over the first fortnight.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: '4-hydroxylation', product: '4-Hydroxy-norclobazam', fraction: 0.5,
        note: 'The onward step, and the site of the clinically important interaction: CBD inhibits CYP2C19 and can roughly triple norclobazam levels, which matters because both are used in the same epilepsy patients.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
    ],
    metabolites: [
      { name: '4-Hydroxy-norclobazam', active: false, halfLifeH: 20, fraction: 0.5 },
      { name: 'Norclobazam glucuronide', active: false, halfLifeH: 24, fraction: 0.2 }
    ],
    substrateOf: ['CYP2C19', 'UGT'],
    pharmacogenetics: 'CYP2C19 poor metabolisers accumulate up to five times more norclobazam and need a reduced clobazam dose — an actionable pharmacogenetic recommendation.',
    excretion: 'Renal, as conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [60, 180], peakMin: [120, 360], durationH: [24, 48], afterEffectsH: [24, 96], bioavailability: 0.9,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg',
        note: 'Not prescribed separately; forms from clobazam.' } }
  },
  warnings: [
    'CBD substantially raises its levels via CYP2C19 inhibition — a well-documented and clinically significant interaction.',
    'Accumulates for weeks. Fatal with opioids or alcohol.'
  ],
  sources: ['Geffrey et al. 2015, Epilepsia', 'DrugBank DB00349']
},

{
  id: 'nortilidine', name: 'Nortilidine',
  class: 'Metabolite', family: 'Opioid — metabolite of tilidine', schedule: 'Unscheduled as a metabolite',
  metaboliteOf: ['tilidine'],
  tags: ['metabolite', 'opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'The active opioid metabolite of tilidine and the compound that actually produces analgesia — tilidine itself has roughly one twentieth the mu affinity. The obligatory first-pass conversion is why tilidine works orally but not by injection.',
  halfLife: { hours: 3.5, range: [3, 5], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Further N-demethylation', product: 'Bisnortilidine', fraction: 0.25,
        note: 'The onward step; the product retains weak activity.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Nortilidine glucuronide', fraction: 0.4 }
    ],
    metabolites: [
      { name: 'Bisnortilidine', active: true, halfLifeH: 4, potencyRel: 0.1, fraction: 0.25 },
      { name: 'Nortilidine glucuronide', active: false, halfLifeH: 4, fraction: 0.4 }
    ],
    substrateOf: ['CYP3A4', 'UGT'],
    pharmacogenetics: 'CYP3A4 inhibitors reduce its formation from tilidine and therefore reduce analgesia; inducers increase it.',
    excretion: 'Renal, ~90% as conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 40], peakMin: [30, 60], durationH: [4, 6], afterEffectsH: [2, 8], bioavailability: 0.9,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg',
        note: 'Not taken directly; forms from tilidine on first pass.' } }
  },
  warnings: ['Fatal with benzodiazepines or alcohol, as with any mu agonist.'],
  sources: ['German prescribing literature', 'DrugBank DB13757']
},

{
  id: 'dihydromorphine', name: 'Dihydromorphine',
  class: 'Metabolite', family: 'Morphinan — metabolite of dihydrocodeine', schedule: 'I/II (varies)',
  metaboliteOf: ['dihydrocodeine', 'hydromorphone'],
  tags: ['metabolite', 'opioid', 'mu-agonist', 'analgesic', 'respiratory-depressant', 'cns-depressant'],
  toleranceGroup: 'opioid', toleranceHalfLifeDays: 3,
  mechanism: 'A potent mu agonist roughly equipotent with morphine, formed from dihydrocodeine by CYP2D6 and available as a medicine in its own right in a few countries.',
  halfLife: { hours: 3, range: [2, 4], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B7', reaction: '3- and 6-O-glucuronidation', product: 'Dihydromorphine-6-glucuronide', fraction: 0.7,
        note: 'As with morphine, the 6-glucuronide is an active metabolite more potent than the parent.' },
      { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nordihydromorphine', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Dihydromorphine-6-glucuronide', active: true, halfLifeH: 4, potencyRel: 2.0, fraction: 0.7,
        note: 'Active and renally cleared — accumulates in kidney impairment, exactly like morphine\'s M6G.' },
      { name: 'Nordihydromorphine', active: true, halfLifeH: 3, potencyRel: 0.2, fraction: 0.1 }
    ],
    substrateOf: ['UGT2B7', 'CYP3A4'],
    pharmacogenetics: 'Formed via CYP2D6 from dihydrocodeine, so poor metabolisers get considerably less analgesia.',
    excretion: 'Renal, as glucuronides.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 45], peakMin: [60, 120], durationH: [3, 5], afterEffectsH: [2, 8], bioavailability: 0.3,
      doses: { threshold: 2.5, light: [5, 10], common: [10, 20], strong: [20, 40], heavy: 40, unit: 'mg' } }
  },
  warnings: ['Its 6-glucuronide accumulates in renal impairment, causing delayed respiratory depression. Fatal with benzodiazepines or alcohol.'],
  sources: ['DrugBank DB01470']
},

{
  id: 'thc-cooh', name: 'THC-COOH', aliases: ['11-nor-9-carboxy-thc', 'carboxy-thc'],
  class: 'Metabolite', family: 'Cannabinoid — metabolite of THC', schedule: 'Unscheduled',
  metaboliteOf: ['thc', '11-oh-thc'],
  tags: ['metabolite', 'forensic-marker', 'inactive', 'lipophilic-accumulation', 'non-psychoactive'],
  toleranceGroup: 'cannabinoid', toleranceHalfLifeDays: 5,
  mechanism: 'The terminal oxidation product of THC and the target of every standard cannabis drug test. Pharmacologically inactive — it does not bind CB1 — but extremely lipophilic, so it is stored in fat and released slowly for weeks.',
  halfLife: { hours: 120, range: [48, 700], confidence: 'measured',
    notes: 'Enormously variable and the whole reason cannabis detection windows are so long: roughly 2-3 days of detectability after single use, but up to 30 days in chronic heavy users as it leaches back out of fat.' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT1A9 / UGT1A1', reaction: 'Glucuronidation of the carboxylic acid', product: 'THC-COOH-glucuronide', fraction: 0.8,
        note: 'The onward step and the main urinary species. Most immunoassays hydrolyse the conjugate first, then measure total THC-COOH.' }
    ],
    metabolites: [
      { name: 'THC-COOH-glucuronide', active: false, halfLifeH: 130, fraction: 0.8,
        note: 'The actual molecule present in urine. Detection thresholds (typically 50 ng/ml) refer to it after hydrolysis.' }
    ],
    substrateOf: ['UGT1A9', 'UGT1A1'],
    pharmacogenetics: 'UGT1A9 and UGT2B7 variants alter clearance modestly. Body fat percentage and use frequency matter far more than genotype for how long it stays detectable.',
    excretion: 'Faecal ~65%, renal ~20%. Exercise and rapid weight loss can transiently RAISE blood levels by mobilising fat stores — a documented cause of unexpectedly positive tests.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0,
      doses: { threshold: 1, light: [1, 5], common: [5, 20], strong: [20, 50], heavy: 50, unit: 'mg',
        note: 'Not psychoactive and not taken directly. Listed because it is what drug tests measure.' } }
  },
  warnings: [
    'Produces no effects whatsoever — its only significance is detection.',
    'Because it is fat-stored, exercising or fasting before a test can raise levels rather than lower them.'
  ],
  sources: ['Huestis 2007, Chem Biodivers', 'Westin et al. 2014, Drug Test Anal']
},

{
  id: '4-anpp', name: '4-ANPP', aliases: ['despropionylfentanyl', 'anpp'],
  class: 'Metabolite', family: 'Anilidopiperidine — fentanyl family marker', schedule: 'II (US, listed precursor)',
  metaboliteOf: ['acetylfentanyl', 'furanylfentanyl', 'cyclopropylfentanyl', 'methoxyacetylfentanyl'],
  tags: ['metabolite', 'forensic-marker', 'inactive', 'precursor'],
  mechanism: 'The shared terminal metabolite of most fentanyl analogues, and simultaneously the chemical precursor used to make them. It has negligible opioid activity itself — its importance is forensic and regulatory.',
  halfLife: { hours: 5, range: [3, 9], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxy-4-ANPP', fraction: 0.4 },
      { enzyme: 'UGT', reaction: 'Glucuronidation', product: '4-ANPP glucuronide', fraction: 0.3 }
    ],
    metabolites: [
      { name: 'Hydroxy-4-ANPP', active: false, halfLifeH: 6, fraction: 0.4 },
      { name: '4-ANPP glucuronide', active: false, halfLifeH: 6, fraction: 0.3 }
    ],
    substrateOf: ['CYP3A4', 'UGT'],
    excretion: 'Renal, as conjugates.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0,
      doses: { threshold: 1, light: [1, 5], common: [5, 20], strong: [20, 50], heavy: 50, unit: 'mg',
        note: 'Essentially inactive; listed because its detection indicates fentanyl-analogue exposure.' } }
  },
  warnings: [
    'Detecting it means exposure to a fentanyl-class drug, but it does NOT identify which one — several analogues converge on it.',
    'Because it is also a synthesis precursor, its presence in a sample can indicate manufacturing residue rather than metabolism.'
  ],
  sources: ['CFSRE NPS Discovery', 'DEA scheduling documents']
},

{
  id: '3-hydroxymorphinan', name: '3-Hydroxymorphinan',
  class: 'Metabolite', family: 'Morphinan — metabolite of DXM', schedule: 'Unscheduled',
  metaboliteOf: ['dxm', 'dextrorphan'],
  tags: ['metabolite', 'nmda-antagonist', 'weakly-active', 'dissociative'],
  toleranceGroup: 'nmda', toleranceHalfLifeDays: 3,
  mechanism: 'A secondary metabolite of dextromethorphan, formed by demethylation of dextrorphan or 3-methoxymorphinan. Weakly active as an NMDA antagonist and a minor contributor to the DXM experience.',
  halfLife: { hours: 5, range: [3, 8], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'UGT2B15 / UGT1A1', reaction: 'Glucuronidation of the phenol', product: '3-Hydroxymorphinan glucuronide', fraction: 0.7,
        note: 'Terminal step; the main urinary species after DXM use.' },
      { enzyme: 'SULT', reaction: 'Sulfation', product: '3-Hydroxymorphinan sulfate', fraction: 0.15 }
    ],
    metabolites: [
      { name: '3-Hydroxymorphinan glucuronide', active: false, halfLifeH: 6, fraction: 0.7 },
      { name: '3-Hydroxymorphinan sulfate', active: false, halfLifeH: 6, fraction: 0.15 }
    ],
    substrateOf: ['UGT2B15', 'UGT1A1', 'SULT'],
    excretion: 'Renal, almost entirely as conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [30, 90], peakMin: [90, 180], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.4,
      doses: { threshold: 20, light: [40, 80], common: [80, 160], strong: [160, 300], heavy: 300, unit: 'mg',
        note: 'Not taken directly; forms from DXM.' } }
  },
  warnings: ['Weakly active. Its main significance is as the terminal urinary marker of DXM use.'],
  sources: ['Zawertailo et al. 2010, J Clin Psychopharmacol']
},

{
  id: 'norephedrine', name: 'Norephedrine', aliases: ['phenylpropanolamine', 'ppa'],
  class: 'Metabolite', family: 'Phenethylamine — metabolite of amphetamine and ephedrine', schedule: 'Withdrawn in many markets',
  metaboliteOf: ['amphetamine', 'ephedrine', 'khat'],
  tags: ['metabolite', 'sympathomimetic', 'norepinephrine-releaser', 'vasoconstrictor',
         'hypertensive-risk', 'stroke-risk', 'mao-contraindicated'],
  toleranceGroup: 'ephedrine', toleranceHalfLifeDays: 3,
  mechanism: 'A weak sympathomimetic formed from amphetamine and ephedrine, and formerly sold in its own right as a decongestant and appetite suppressant. Withdrawn from most markets after being linked to haemorrhagic stroke.',
  halfLife: { hours: 4, range: [3, 6], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'None (renal)', reaction: 'Excreted largely unchanged, pH-dependent', product: 'Norephedrine', fraction: 0.8,
        note: 'Like the other phenethylamine bases, urine pH governs its clearance more than any enzyme.' },
      { enzyme: 'CYP2D6', reaction: 'Minor hydroxylation', product: '4-Hydroxynorephedrine', fraction: 0.1 }
    ],
    metabolites: [
      { name: '4-Hydroxynorephedrine', active: true, halfLifeH: 12, potencyRel: 0.1, fraction: 0.1,
        note: 'A false neurotransmitter stored in noradrenergic vesicles.' }
    ],
    substrateOf: ['CYP2D6'],
    excretion: 'Renal, 80-90% unchanged and strongly pH-dependent.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 120], durationH: [3, 6], afterEffectsH: [2, 6], bioavailability: 0.9,
      doses: { threshold: 12.5, light: [25, 50], common: [50, 75], strong: [75, 100], heavy: 100, unit: 'mg' } }
  },
  warnings: [
    'Withdrawn from the US and many other markets after a case-control study linked it to haemorrhagic stroke in young women — the reason phenylpropanolamine disappeared from cold remedies.',
    'MAOI-contraindicated. Additive hypertensive effect with other sympathomimetics.'
  ],
  sources: ['Kernan et al. 2000, NEJM', 'FDA PPA advisory 2000']
}

]);

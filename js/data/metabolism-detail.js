/* ==========================================================================
   Deep metabolism layer
   --------------------------------------------------------------------------
   Additional pathways, phase II conjugation, transporters and pharmacogenetics
   for compounds where the detail genuinely changes something — an interaction,
   a dose adjustment, or why one person reacts differently to another.

   Kept separate from the per-class data files so the pharmacology sits in one
   place. DB.enrich() appends rather than replaces, so nothing already written
   is lost.

   Deliberately NOT here: research chemicals with no published metabolism.
   Inventing pathways for those would be fabrication, and they stay marked
   `analogue` or `unknown` instead.
   ========================================================================== */
DB.enrich({

/* ================= Opioids ================= */

fentanyl: {
  firstPass: 'Bypassed entirely by the transdermal, buccal and intranasal routes, which is why those exist — swallowed fentanyl is heavily first-pass metabolised and weak.',
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP3A5 expressers (common in people of African ancestry) clear it faster and may need higher doses. P-glycoprotein (ABCB1) variants alter how much reaches the brain, which is a bigger determinant of effect than plasma level alone.',
  pathways: [
    { enzyme: 'CYP3A5', reaction: 'N-dealkylation (secondary)', product: 'Norfentanyl', fraction: 0.05,
      note: 'Minor overall, but CYP3A5 expressers get meaningfully faster clearance.' },
    { enzyme: 'P-gp (efflux, not metabolism)', reaction: 'Active transport out of the CNS and gut', product: 'Unchanged fentanyl', fraction: 0.3,
      note: 'P-gp inhibitors (verapamil, quinidine, ritonavir, clarithromycin) raise brain concentrations without necessarily raising plasma levels — so a "normal" blood level can still be an overdose.' },
    { enzyme: 'UGT2B7', reaction: 'Glucuronidation of hydroxylated metabolites', product: 'Conjugates', fraction: 0.05 }
  ],
  excretion: 'Renal ~75% (mostly norfentanyl), faecal ~9%; under 10% unchanged.'
},

oxycodone: {
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP2D6 ultra-rapid metabolisers form more oxymorphone (14× more potent) and report stronger effects; poor metabolisers form almost none. CYP3A4 inhibition matters more overall, since that route carries most of the mass.',
  pathways: [
    { enzyme: 'Ketone reductase', reaction: '6-keto reduction', product: '6-Oxycodol (α and β)', fraction: 0.05 }
  ],
  excretion: 'Renal; ~10% unchanged, ~45% as conjugated oxycodone, the rest as noroxycodone and oxymorphone conjugates.'
},

morphine: {
  transporters: ['P-gp', 'OCT1'],
  pharmacogenetics: 'OCT1 loss-of-function variants (about 9% of Europeans carry two) reduce hepatic uptake, raising plasma morphine and prolonging its effect after a standard dose — a genuine and under-recognised source of variability. UGT2B7 polymorphisms alter the M3G:M6G ratio.',
  pathways: [
    { enzyme: 'OCT1 (uptake, not metabolism)', reaction: 'Hepatic uptake, required before glucuronidation', product: 'Intracellular morphine', fraction: 0.8,
      note: 'The rate-limiting step before UGT2B7 can act. Loss-of-function carriers clear morphine more slowly.' }
  ],
  excretion: 'Renal, ~90% within 24 h; M3G and M6G both accumulate in renal impairment.'
},

buprenorphine: {
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP2B6 and CYP3A4 variation alters the norbuprenorphine:buprenorphine ratio, which matters because the metabolite is a full agonist with no respiratory ceiling.',
  pathways: [
    { enzyme: 'CYP2C8', reaction: 'N-dealkylation (secondary)', product: 'Norbuprenorphine', fraction: 0.1 },
    { enzyme: 'CYP2C18 / CYP3A5', reaction: 'Minor N-dealkylation', product: 'Norbuprenorphine', fraction: 0.05 }
  ],
  excretion: 'Faecal ~70% as free buprenorphine and norbuprenorphine; renal ~30%, almost entirely conjugated.'
},

methadone: {
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP2B6 poor metabolisers (the *6/*6 genotype, ~6% of Europeans) accumulate S-methadone specifically — the enantiomer that blocks hERG and prolongs QT. This is a genuine, testable risk factor for methadone-associated arrhythmia, not a theoretical one.',
  pathways: [
    { enzyme: 'CYP2C9', reaction: 'Minor N-demethylation', product: 'EDDP', fraction: 0.05 },
    { enzyme: 'UGT', reaction: 'Glucuronidation of hydroxylated metabolites', product: 'Conjugates', fraction: 0.1 }
  ],
  excretion: 'Renal and faecal in roughly equal share. Renal clearance rises sharply in acidic urine, which is why urinary acidifiers shorten it.'
},

naloxone: {
  pharmacogenetics: 'UGT2B7 variation alters clearance modestly; not clinically actionable.',
  pathways: [
    { enzyme: 'Ketone reductase', reaction: '6-keto reduction', product: '6-beta-naloxol', fraction: 0.1,
      note: 'Weakly active as an antagonist; longer-lived than naloxone but present at low levels — it does not meaningfully extend the reversal window.' }
  ],
  excretion: 'Renal, 25-40% within 6 h and 65% within 72 h, almost entirely as conjugates.'
},

/* ================= Benzodiazepines and hypnotics ================= */

lorazepam: {
  pharmacogenetics: 'UGT2B15*2 homozygotes clear lorazepam roughly 40% more slowly and reach higher levels from the same dose — one of the few clinically meaningful phase II polymorphisms.',
  pathways: [
    { enzyme: 'UGT1A9 / UGT2B4', reaction: 'Secondary glucuronidation', product: 'Lorazepam glucuronide', fraction: 0.05,
      note: 'Backup routes; part of why lorazepam clearance is so reliable even in liver disease.' }
  ],
  excretion: 'Renal ~75% as the glucuronide, faecal ~9%. Clearance is preserved in cirrhosis, unlike the CYP-dependent benzodiazepines.'
},

midazolam: {
  transporters: ['P-gp'],
  pharmacogenetics: 'The standard clinical probe for CYP3A activity. CYP3A5 expressers clear it faster. Intestinal CYP3A4 accounts for roughly half of oral first-pass loss, which is why grapefruit juice affects oral but not intravenous midazolam.',
  pathways: [
    { enzyme: 'CYP3A4 (intestinal)', reaction: 'Pre-systemic 1\'-hydroxylation in the gut wall', product: '1\'-Hydroxymidazolam', fraction: 0.35,
      note: 'Separate from hepatic metabolism. This is the fraction grapefruit juice knocks out, roughly doubling oral exposure while leaving IV dosing untouched.' },
    { enzyme: 'CYP3A4', reaction: '4-hydroxylation (minor)', product: '4-Hydroxymidazolam', fraction: 0.05 }
  ],
  excretion: 'Renal 45-57% as 1\'-OH-midazolam glucuronide; under 1% unchanged.'
},

diazepam: {
  pharmacogenetics: 'CYP2C19 poor metabolisers (15-20% of East Asians, 3-5% of Europeans) clear diazepam roughly half as fast and accumulate more nordazepam — meaning the same dose is substantially stronger and longer.',
  transporters: [],
  excretion: 'Renal, largely as oxazepam and temazepam glucuronides; under 1% unchanged. Total elimination of the metabolite chain takes weeks after chronic dosing.'
},

alprazolam: {
  pharmacogenetics: 'CYP3A5 expressers clear it somewhat faster. Exposure is roughly 25% higher in people of Asian descent and in the elderly, and obesity substantially prolongs the half-life.',
  pathways: [
    { enzyme: 'CYP3A5', reaction: 'Hydroxylation (secondary)', product: 'α-Hydroxyalprazolam', fraction: 0.1 }
  ],
  excretion: 'Renal, ~80% as conjugated hydroxy metabolites; under 20% unchanged.'
},

zolpidem: {
  pharmacogenetics: 'Women clear zolpidem roughly 50% more slowly than men, which led the FDA to halve the recommended dose for women in 2013 — one of very few sex-specific dosing changes in medicine. CYP2C9 poor metabolisers also show higher exposure.',
  pathways: [
    { enzyme: 'CYP3A5 / CYP2D6', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.03 }
  ],
  excretion: 'Renal ~48%, faecal ~34%, entirely as inactive carboxylic acid metabolites; under 1% unchanged.'
},

triazolam: {
  transporters: ['P-gp'],
  pharmacogenetics: 'Almost entirely CYP3A4-dependent, making it the most interaction-sensitive benzodiazepine in routine use. Ketoconazole raises exposure more than tenfold; strong 3A4 inhibitors are formally contraindicated.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: '4-hydroxylation', product: '4-Hydroxytriazolam', fraction: 0.15 },
    { enzyme: 'UGT', reaction: 'Glucuronidation of hydroxy metabolites', product: 'Conjugates', fraction: 0.6 }
  ],
  excretion: 'Renal, almost entirely as conjugated α-hydroxytriazolam; under 2% unchanged.'
},

clonazepam: {
  pharmacogenetics: 'NAT2 slow acetylators (roughly half of Europeans) clear the 7-amino metabolite more slowly, though the clinical effect is modest.',
  pathways: [
    { enzyme: 'CYP2E1 / CYP2C19', reaction: 'Minor contribution to nitroreduction', product: '7-Aminoclonazepam', fraction: 0.1 },
    { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.15 }
  ],
  excretion: 'Renal, 50-70% as conjugates; under 2% unchanged. 7-aminoclonazepam is detectable in urine for up to two weeks.'
},

temazepam: {
  pharmacogenetics: 'UGT2B15*2 homozygotes clear it more slowly, as with lorazepam.',
  excretion: 'Renal ~80% as the glucuronide, faecal ~12%; under 2% unchanged. Preserved in liver disease, which is why it is preferred there.'
},

/* ================= Antidepressants ================= */

fluoxetine: {
  firstPass: 'Moderate; oral bioavailability ~72% and unaffected by food.',
  pharmacogenetics: 'CYP2D6 poor metabolisers reach substantially higher fluoxetine levels, though the very long half-life blunts the practical impact. More importantly, fluoxetine INHIBITS CYP2D6 so strongly that it converts normal metabolisers into functional poor metabolisers within days — for itself and for everything else 2D6-dependent.',
  pathways: [
    { enzyme: 'CYP2C19 / CYP3A4', reaction: 'Secondary N-demethylation', product: 'Norfluoxetine', fraction: 0.2 },
    { enzyme: 'UGT', reaction: 'Glucuronidation of the phenol', product: 'Fluoxetine glucuronide', fraction: 0.15 }
  ],
  excretion: 'Renal, ~60% as metabolites and ~10% as norfluoxetine; 2-3% unchanged. Complete elimination takes 4-6 weeks after stopping.'
},

paroxetine: {
  firstPass: 'Extensive and saturable — first-pass metabolism is overwhelmed as the dose rises, which is why exposure climbs disproportionately.',
  pharmacogenetics: 'CYP2D6 poor metabolisers reach several-fold higher levels. Because paroxetine destroys CYP2D6 (mechanism-based inhibition), everyone becomes a functional poor metaboliser within about a week — so its own kinetics turn non-linear with continued dosing.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: 'Secondary oxidation', product: 'Catechol intermediate', fraction: 0.15,
      note: 'Takes over as CYP2D6 is inactivated, which partly rescues clearance at steady state.' }
  ],
  excretion: 'Renal ~64% (under 2% unchanged), faecal ~36%.'
},

sertraline: {
  firstPass: 'Substantial; oral bioavailability ~44%, and food raises it by roughly 25% by slowing gastric emptying.',
  pharmacogenetics: 'Cleared by several enzymes in parallel (CYP2B6 dominant, plus 2C19, 2C9, 2D6, 3A4), which makes it unusually robust to any single inhibitor or genotype — a real practical advantage over fluoxetine and paroxetine.',
  pathways: [
    { enzyme: 'UGT1A1', reaction: 'N-carbamoyl glucuronidation', product: 'Sertraline carbamoyl glucuronide', fraction: 0.2,
      note: 'An unusual direct conjugation route; a major urinary species.' },
    { enzyme: 'CYP2C9', reaction: 'N-demethylation (secondary)', product: 'Desmethylsertraline', fraction: 0.15 }
  ],
  excretion: 'Renal ~40-45%, faecal ~40-45%; essentially none unchanged.'
},

venlafaxine: {
  firstPass: 'Extensive; oral bioavailability only ~45%, almost all of the loss being CYP2D6 conversion to the active metabolite.',
  pharmacogenetics: 'CYP2D6 poor metabolisers accumulate venlafaxine rather than converting it to desvenlafaxine. Since the parent is more cardiotoxic and more hypertensive than the metabolite, poor metabolisers get a worse side-effect profile for the same benefit — a good reason to use desvenlafaxine directly instead.',
  pathways: [
    { enzyme: 'CYP2C19 / CYP2C9', reaction: 'Minor N-demethylation', product: 'N-desmethylvenlafaxine', fraction: 0.1 },
    { enzyme: 'UGT1A1 / UGT2B15', reaction: 'Glucuronidation of desvenlafaxine', product: 'O-desmethylvenlafaxine glucuronide', fraction: 0.35 }
  ],
  excretion: 'Renal ~87%; ~5% unchanged, ~29% as free desvenlafaxine and ~26% as its conjugate.'
},

bupropion: {
  firstPass: 'Extensive; the parent is a minor species in plasma compared with its metabolites, which reach concentrations up to 20× higher.',
  pharmacogenetics: 'CYP2B6 poor metabolisers form less hydroxybupropion — the metabolite that carries much of both the effect and the CYP2D6 inhibition. Since hydroxybupropion drives the interaction profile, 2B6 genotype indirectly determines how much bupropion interferes with other drugs.',
  pathways: [
    { enzyme: 'CYP2C19', reaction: 'Minor hydroxylation', product: 'Hydroxybupropion', fraction: 0.1 },
    { enzyme: 'UGT2B7', reaction: 'Glucuronidation of hydroxybupropion', product: 'Hydroxybupropion glucuronide', fraction: 0.3 }
  ],
  excretion: 'Renal ~87%, faecal ~10%; only 0.5% unchanged.'
},

escitalopram: {
  firstPass: 'Modest; oral bioavailability ~80% and unaffected by food.',
  pharmacogenetics: 'CYP2C19 poor metabolisers reach roughly double the exposure. Because escitalopram prolongs QT dose-dependently, CPIC guidance recommends a 50% dose reduction in poor metabolisers — one of the clearer actionable pharmacogenetic recommendations in psychiatry.',
  pathways: [
    { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.15 }
  ],
  excretion: 'Renal ~8% unchanged and ~10% as desmethyl metabolite; the rest hepatic.'
},

mirtazapine: {
  firstPass: 'Extensive; oral bioavailability only ~50% despite near-complete absorption.',
  pharmacogenetics: 'CYP2D6 poor metabolisers show modestly higher levels. Clearance is roughly 25% lower in women and markedly lower in the elderly.',
  pathways: [
    { enzyme: 'UGT1A3', reaction: 'Direct N-glucuronidation', product: 'Mirtazapine-N-glucuronide', fraction: 0.25,
      note: 'A major route often omitted; it explains why CYP inhibitors have less effect on mirtazapine than expected.' }
  ],
  excretion: 'Renal ~75%, faecal ~15%, over 4 days.'
},

trazodone: {
  firstPass: 'Moderate; bioavailability ~70% but food substantially delays and blunts the peak.',
  pharmacogenetics: 'CYP2D6 poor metabolisers accumulate the mCPP metabolite, which causes anxiety, migraine and dysphoria — so a drug given for sleep can make someone feel considerably worse, purely by genotype.',
  pathways: [
    { enzyme: 'CYP2D6', reaction: 'Hydroxylation of mCPP', product: 'p-Hydroxy-mCPP', fraction: 0.15,
      note: 'The clearance route for mCPP. Blocking it with a 2D6 inhibitor lets the anxiogenic metabolite build up.' },
    { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.2 }
  ],
  excretion: 'Renal ~75%, faecal ~20%; under 1% unchanged.'
},

/* ================= Stimulants ================= */

dextroamphetamine: {
  firstPass: 'Modest; oral bioavailability ~75-90%.',
  transporters: ['OCT2', 'MATE1'],
  pharmacogenetics: 'CYP2D6 status has only a modest effect because most of a dose leaves unchanged. Urinary pH matters far more than genotype — the single largest controllable variable in amphetamine duration.',
  pathways: [
    { enzyme: 'OCT2 / MATE1 (renal transport)', reaction: 'Active tubular secretion, then pH-dependent reabsorption', product: 'Unchanged amphetamine', fraction: 0.35,
      note: 'Acidic urine traps the ionised drug and it is excreted; alkaline urine lets it diffuse back, which is how sodium bicarbonate more than doubles the half-life.' },
    { enzyme: 'CYP2D6', reaction: 'Norephedrine formation via β-hydroxylation', product: 'Norephedrine', fraction: 0.03 }
  ],
  excretion: 'Renal, 30-40% unchanged; from ~7 h in acidic urine to over 30 h in alkaline urine.'
},

methamphetamine: {
  transporters: ['OCT2', 'MATE1'],
  pharmacogenetics: 'CYP2D6 poor metabolisers form less amphetamine and less 4-hydroxymethamphetamine, but the effect is modest because so much is excreted unchanged. Methamphetamine also inhibits CYP2D6, so repeated doses clear progressively more slowly.',
  pathways: [
    { enzyme: 'OCT2 / MATE1 (renal transport)', reaction: 'Tubular secretion with pH-dependent reabsorption', product: 'Unchanged methamphetamine', fraction: 0.45,
      note: 'The dominant route by mass. Urinary pH is the main determinant of duration.' },
    { enzyme: 'UGT', reaction: 'Glucuronidation of 4-hydroxy metabolites', product: 'Conjugates', fraction: 0.1 }
  ],
  excretion: 'Renal, 30-54% unchanged; strongly pH-dependent.'
},

cocaine: {
  pharmacogenetics: 'Butyrylcholinesterase (BChE) deficiency — inherited, or acquired in liver disease, pregnancy and malnutrition — slows hydrolysis and raises cocaine levels substantially. These people are at markedly higher risk of toxicity from an ordinary dose, and usually have no idea.',
  transporters: [],
  pathways: [
    { enzyme: 'CYP3A4', reaction: 'Oxidation of norcocaine', product: 'N-hydroxynorcocaine → nitroxide radical', from: 'Norcocaine', fraction: 0.02,
      note: 'The hepatotoxic pathway. Small by mass, but it generates reactive species that damage liver tissue, and it is amplified by anything inducing CYP3A4.' }
  ],
  excretion: 'Renal; under 5% unchanged, ~40% as benzoylecgonine (detectable 2-4 days, up to 2 weeks in heavy users).'
},

caffeine: {
  firstPass: 'Essentially none — oral bioavailability is close to 100%, and absorption is complete within 45 minutes.',
  transporters: [],
  pharmacogenetics: 'CYP1A2 activity varies about 40-fold between individuals. The CYP1A2*1F variant defines "fast" and "slow" caffeine metabolisers, and slow metabolisers show a raised risk of myocardial infarction with heavy intake. Smoking induces CYP1A2 and roughly halves the half-life; quitting reverses that within a week, which is why people who stop smoking often become suddenly caffeine-sensitive.',
  pathways: [
    { enzyme: 'CYP2E1 / CYP3A4', reaction: 'Minor demethylation', product: 'Theophylline / theobromine', fraction: 0.03 },
    { enzyme: 'XO (xanthine oxidase)', reaction: 'Oxidation of 1-methylxanthine', product: '1-Methyluric acid', fraction: 0.2 }
  ],
  excretion: 'Renal, under 3% unchanged; essentially all cleared hepatically.'
},

nicotine: {
  transporters: [],
  pharmacogenetics: 'CYP2A6 is the key determinant of smoking behaviour. Reduced-function variants — common in East Asian populations — clear nicotine slowly, and those carriers smoke fewer cigarettes and find quitting easier. The 3HC/cotinine ratio (the "nicotine metabolite ratio") predicts which cessation treatment works best, and is one of the few pharmacogenetic markers used to choose therapy rather than dose.',
  pathways: [
    { enzyme: 'CYP2B6', reaction: 'Minor C-oxidation', product: 'Cotinine', fraction: 0.05 },
    { enzyme: 'UGT1A4', reaction: 'Glucuronidation of cotinine', product: 'Cotinine-N-glucuronide', fraction: 0.15 }
  ],
  excretion: 'Renal; 10-20% unchanged and pH-dependent, the remainder as cotinine and its conjugates.'
},

ephedrine: {
  firstPass: 'Minimal — most of a dose is never metabolised at all.',
  transporters: ['OCT2'],
  pharmacogenetics: 'Little relevant CYP involvement. Urinary pH governs duration, as with the other phenethylamine bases.',
  excretion: 'Renal, 70-80% unchanged; ~3 h in acidic urine, up to 6 h in alkaline urine.'
},

pseudoephedrine: {
  firstPass: 'Negligible; oral bioavailability approaches 100%.',
  transporters: ['OCT2', 'MATE1'],
  pharmacogenetics: 'Essentially none — the drug is renally cleared, so kidney function and urine pH determine exposure rather than genotype.',
  excretion: 'Renal, 70-96% unchanged; half-life ranges from ~3 h at pH 5 to ~16 h at pH 8.'
},

modafinil: {
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP2C19 poor metabolisers clear the R-enantiomer more slowly. Modafinil also inhibits CYP2C19 and induces CYP3A4, so it changes its own and others\' clearance over the first week.',
  pathways: [
    { enzyme: 'CYP2D6', reaction: 'Minor oxidation', product: 'Hydroxylated metabolites', fraction: 0.05 },
    { enzyme: 'UGT', reaction: 'Glucuronidation of modafinil acid', product: 'Conjugates', fraction: 0.15 }
  ],
  excretion: 'Renal ~80% as metabolites; under 10% unchanged.'
},

/* ================= Psychedelics and dissociatives ================= */

psilocybin: {
  transporters: [],
  pharmacogenetics: 'UGT1A10 and UGT1A9 variation alters psilocin clearance. CYP2D6 contributes only marginally, which is why psilocybin experiences vary less by genotype than, say, 5-MeO-DiPT.',
  pathways: [
    { enzyme: 'ALDH / MAO-B', reaction: 'Oxidation of 4-hydroxyindole-3-acetaldehyde', product: '4-Hydroxyindole-3-acetic acid (4-HIAA)', fraction: 0.15 },
    { enzyme: 'Aldehyde reductase', reaction: 'Reduction of the aldehyde intermediate', product: '4-Hydroxytryptophol', fraction: 0.05 }
  ],
  excretion: 'Renal ~65% as psilocin glucuronide, ~20% biliary; detectable in urine roughly 24 h.'
},

lsd: {
  transporters: [],
  pharmacogenetics: 'CYP3A4 is the sole significant route, so 3A4 inhibitors (ritonavir, clarithromycin, grapefruit) can meaningfully extend an already long experience — a genuinely under-appreciated interaction.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: 'N-de-ethylation', product: 'Nor-LSD', fraction: 0.05 },
    { enzyme: 'UGT', reaction: 'Glucuronidation of hydroxy-LSD', product: '13/14-hydroxy-LSD glucuronide', fraction: 0.1 }
  ],
  excretion: 'Renal, under 1% unchanged; 2-oxo-3-hydroxy-LSD is the assay target and is detectable for 2-4 days.'
},

ketamine: {
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP2B6*6 carriers clear ketamine more slowly and reach higher levels — relevant for the low-dose infusions used in depression, where CYP2B6 dominates. At anaesthetic concentrations CYP3A4 takes over.',
  pathways: [
    { enzyme: 'CYP2B6 / CYP3A4', reaction: 'Direct hydroxylation of ketamine', product: 'Hydroxyketamines (4-, 5-, 6-)', fraction: 0.1,
      note: 'A parallel route that bypasses norketamine entirely.' }
  ],
  excretion: 'Renal ~90% (about 2% unchanged, 2% norketamine, the rest conjugated hydroxy metabolites); ~3% faecal.'
},

dxm: {
  transporters: [],
  pharmacogenetics: 'The textbook CYP2D6 example. Poor metabolisers — 7-10% of Europeans — show up to 10× the exposure and a half-life stretching from 3.5 h to 24-30 h, turning a recreational dose into a prolonged overdose. Quinidine is used deliberately to inhibit 2D6 and raise DXM levels in the Nuedexta combination product.',
  pathways: [
    { enzyme: 'UGT2B15 / UGT1A1', reaction: 'Glucuronidation of 3-hydroxymorphinan', product: 'Conjugates', fraction: 0.15 }
  ],
  excretion: 'Renal, largely as dextrorphan glucuronide; a small unchanged fraction in poor metabolisers.'
},

/* ================= Cannabinoids ================= */

thc: {
  transporters: [],
  pharmacogenetics: 'CYP2C9*3 homozygotes (about 1%) show roughly 3× the THC exposure and report markedly stronger, longer effects from the same dose. CYP2C9*2 carriers are intermediate. This is the clearest pharmacogenetic determinant of cannabis sensitivity.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: '8-beta-hydroxylation', product: '8β-Hydroxy-THC', fraction: 0.1 },
    { enzyme: 'UGT1A10', reaction: 'Intestinal glucuronidation of 11-OH-THC', product: '11-OH-THC glucuronide', fraction: 0.1 }
  ],
  excretion: 'Faecal ~65%, renal ~20%. Because it redistributes from fat, terminal elimination runs from ~1.3 days in occasional users to 5-13 days in chronic heavy users.'
},

cbd: {
  transporters: ['P-gp', 'BCRP'],
  pharmacogenetics: 'CYP2C19 poor metabolisers form less 7-OH-CBD, the active metabolite that carries much of the anticonvulsant effect — relevant for the epilepsy indication.',
  pathways: [
    { enzyme: 'CYP2C9', reaction: 'Hydroxylation', product: 'Hydroxylated CBD species', fraction: 0.1 },
    { enzyme: 'ADH', reaction: 'Oxidation of 7-OH-CBD', product: '7-COOH-CBD', fraction: 0.35,
      note: 'The main circulating species by concentration, though inactive.' }
  ],
  excretion: 'Faecal predominantly, as the 7-COOH metabolite and its conjugates; renal minor.'
},

/* ================= OTC and prescription ================= */

paracetamol: {
  transporters: [],
  pharmacogenetics: 'Not a CYP-genotype story: what matters is glutathione reserve. Chronic alcohol use, fasting, malnutrition and anorexia all deplete it and shift the safety margin downward. CYP2E1 induction by alcohol compounds the same effect from the other direction.',
  pathways: [
    { enzyme: 'CYP1A2 / CYP3A4', reaction: 'Minor oxidation to NAPQI', product: 'NAPQI', fraction: 0.02,
      note: 'Secondary routes to the toxic metabolite; they matter more once CYP2E1 is induced or conjugation is saturated.' },
    { enzyme: 'CYP2E1 (in brain)', reaction: 'Deacetylation then conjugation with arachidonic acid', product: 'AM404', fraction: 0.01,
      note: 'Formed centrally rather than hepatically; the likely basis of the analgesic effect.' }
  ],
  excretion: 'Renal, ~90% within 24 h: ~55% glucuronide, ~30% sulfate, ~8% cysteine and mercapturate conjugates, under 5% unchanged.'
},

ibuprofen: {
  transporters: [],
  pharmacogenetics: 'CYP2C9*3 carriers clear ibuprofen substantially more slowly and have a higher GI bleeding risk at standard doses. The same variant affects most NSAIDs.',
  pathways: [
    { enzyme: 'AMACR (alpha-methylacyl-CoA racemase)', reaction: 'Chiral inversion of R- to S-ibuprofen', product: 'S-(+)-Ibuprofen', fraction: 0.6,
      note: 'Unidirectional: the inactive R-enantiomer is converted into the active S-form, so the racemate performs nearly as well as pure dexibuprofen.' }
  ],
  excretion: 'Renal, ~90% within 24 h as hydroxy and carboxy metabolites and their glucuronides; under 1% unchanged.'
},

omeprazole: {
  transporters: [],
  pharmacogenetics: 'One of the most clinically consequential CYP2C19 examples. Poor metabolisers (15-20% of East Asians, 3-5% of Europeans) reach 3-10× the exposure and get much better acid suppression — while ultra-rapid metabolisers may fail treatment entirely. CPIC issues dosing guidance by genotype.',
  pathways: [
    { enzyme: 'CYP2C19', reaction: 'Sulfoxidation (secondary)', product: '5-Hydroxyomeprazole sulfone', from: '5-Hydroxyomeprazole', fraction: 0.1 }
  ],
  excretion: 'Renal ~77%, faecal ~23%; essentially none unchanged.'
},

carbamazepine: {
  transporters: ['P-gp'],
  pharmacogenetics: 'HLA-B*15:02 carries a strongly raised risk of Stevens-Johnson syndrome and toxic epidermal necrolysis, and screening is recommended before starting in people of Han Chinese, Thai and other South-East Asian ancestry. HLA-A*31:01 predicts milder hypersensitivity in European populations. This is one of the few genuinely mandatory pre-prescription genetic tests.',
  pathways: [
    { enzyme: 'CYP2C8 / CYP3A5', reaction: 'Secondary epoxidation', product: 'Carbamazepine-10,11-epoxide', fraction: 0.1 },
    { enzyme: 'UGT2B7 / UGT1A4', reaction: 'N-glucuronidation', product: 'Carbamazepine-N-glucuronide', fraction: 0.15 }
  ],
  excretion: 'Renal ~72%, faecal ~28%; only 2-3% unchanged.'
},

ritonavir: {
  transporters: ['P-gp', 'BCRP', 'OATP1B1'],
  pharmacogenetics: 'Its interaction profile is time-dependent and confusing: it inhibits CYP3A4 immediately by mechanism-based inactivation, but induces CYP1A2, 2C19 and glucuronidation over days to weeks. A drug can therefore be boosted at first and then suppressed later in the same course.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: 'Mechanism-based inactivation of the enzyme itself', product: 'Inactivated CYP3A4', fraction: 0.2,
      note: 'The therapeutic point of the drug when used as a booster. Recovery requires enzyme resynthesis, taking several days after the last dose.' }
  ],
  excretion: 'Faecal ~86%, renal ~11%; a substantial unchanged fraction in faeces.'
},

/* ================= Metabolites in their own right ================= */

'7-oh-mitragynine': {
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP3A4 inhibition raises exposure and slows conversion onward to the pseudoindoxyl. Because 7-OH is itself formed from mitragynine by CYP3A4, inhibitors act at both ends of the chain.',
  pathways: [
    { enzyme: 'UGT1A1 / UGT2B7', reaction: 'Glucuronidation of the phenol', product: '7-OH-mitragynine glucuronide', fraction: 0.35 }
  ],
  excretion: 'Renal and biliary, largely as conjugates.'
},

m6g: {
  transporters: ['P-gp', 'OAT3'],
  pharmacogenetics: 'Renal function is what matters, not genotype. In chronic kidney disease M6G accumulates over days, producing delayed and prolonged respiratory depression at morphine doses that were previously tolerated.',
  pathways: [
    { enzyme: 'OAT3 (renal transport)', reaction: 'Active tubular secretion', product: 'Excreted M6G', fraction: 0.9,
      note: 'The only meaningful clearance route. It is a transporter step rather than a metabolic one, which is why kidney function governs everything here.' }
  ],
  excretion: 'Renal, essentially entirely unchanged. Half-life rises from ~4 h to well over 24 h in renal failure.'
},

norbuprenorphine: {
  transporters: ['P-gp'],
  pharmacogenetics: 'P-glycoprotein actively excludes norbuprenorphine from the brain, which is the main reason buprenorphine remains relatively safe despite having a full-agonist metabolite. P-gp inhibitors erode that protection.',
  excretion: 'Faecal predominantly as the glucuronide; renal accumulation in impairment.'
},

dextrorphan: {
  pharmacogenetics: 'Formed by CYP2D6, so how much appears depends entirely on the parent drug\'s conversion — the dose you take of DXM is not the dose of dextrorphan you get.',
  excretion: 'Renal, largely as the O-glucuronide, within 24 h.'
},

cocaethylene: {
  pharmacogenetics: 'Formation depends on hepatic carboxylesterase 1 activity and on how much ethanol is present. BChE deficiency slows its breakdown as well as cocaine\'s, compounding the cardiac risk.',
  excretion: 'Renal, as benzoylecgonine and ecgonine ethyl ester.'
},

/* ================= Opioids: the CYP2D6 activation family =================
   Codeine, tramadol, hydrocodone and dihydrocodeine are all prodrugs that
   CYP2D6 converts into the metabolite that actually does the work. That makes
   them the clearest pharmacogenetic story in this database, and it cuts both
   ways: poor metabolisers get no analgesia, ultra-rapid metabolisers get an
   overdose from a normal dose.                                             */

codeine: {
  transporters: ['P-gp'],
  pharmacogenetics: 'The textbook case, and one where the genotype has actually killed people. CYP2D6 converts codeine to morphine; ULTRA-RAPID metabolisers (1-2% of Europeans, up to 30% in parts of North Africa and the Middle East) form far more morphine than expected. Child deaths after tonsillectomy, and a breastfed infant death from a codeine-taking ultra-rapid mother, led the FDA and EMA to contraindicate codeine in children and in breastfeeding. At the other end, POOR metabolisers (roughly 7% of Europeans) convert almost none and get essentially no pain relief — codeine simply does not work for them. Any strong CYP2D6 inhibitor, fluoxetine and paroxetine above all, converts a normal metaboliser into a functional poor one.',
  pathways: [
    { enzyme: 'UGT2B7', reaction: 'Glucuronidation (the quantitatively dominant route)', product: 'Codeine-6-glucuronide', fraction: 0.6,
      note: 'Most of a codeine dose goes here and is inactive. The analgesia comes from the small CYP2D6 fraction instead, which is why the drug is so genotype-sensitive.' },
    { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Norcodeine', fraction: 0.15,
      note: 'Inactive. This route expands when 2D6 is blocked or absent.' }
  ],
  excretion: 'Renal, ~90% within 24 h; about 10% unchanged and the rest as glucuronides and norcodeine.'
},

tramadol: {
  transporters: ['P-gp'],
  pharmacogenetics: 'Tramadol is two drugs in one, and CYP2D6 decides the balance. The parent is an SNRI; only the O-desmethyl metabolite (M1) has meaningful opioid activity, and it binds mu roughly 200 times more strongly than the parent. POOR metabolisers get the monoamine effects without the analgesia — and still carry the seizure and serotonin risk. ULTRA-RAPID metabolisers form M1 fast enough to cause respiratory depression at ordinary doses; as with codeine, this is contraindicated in children after tonsillectomy. CYP2B6 and CYP3A4 handle the inactivating N-demethylation, so a 3A4 inhibitor pushes more drug down the 2D6 route.',
  pathways: [
    { enzyme: 'CYP2B6', reaction: 'N-demethylation (inactivating)', product: 'N-desmethyltramadol (M2)', fraction: 0.15,
      note: 'Inactive at mu. Competes with the activating 2D6 route for the same dose.' },
    { enzyme: 'UGT2B7', reaction: 'Glucuronidation of M1', product: 'M1 glucuronide', fraction: 0.2 }
  ],
  excretion: 'Renal ~90%; about 30% unchanged and the rest as M1, M2 and their conjugates. M1 accumulates markedly in renal impairment.'
},

hydrocodone: {
  transporters: ['P-gp'],
  pharmacogenetics: 'CYP2D6 converts hydrocodone to hydromorphone, which is roughly 10-30 times more potent at mu. The fraction is small, so the genotype effect is real but less dramatic than with codeine. CYP3A4 carries most of the mass down an inactivating route, which means a strong 3A4 inhibitor — ritonavir, clarithromycin, grapefruit — raises exposure more than a 2D6 inhibitor does.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: 'N-demethylation (dominant, inactivating)', product: 'Norhydrocodone', fraction: 0.55,
      note: 'The main route by mass, and essentially inactive. This is why 3A4 inhibition matters more for hydrocodone than 2D6 inhibition.' },
    { enzyme: 'Ketone reductase / UGT2B7', reaction: '6-keto reduction and conjugation', product: '6-Hydrocodol conjugates', fraction: 0.15 }
  ],
  excretion: 'Renal; roughly 12% unchanged, the rest as norhydrocodone, hydromorphone and conjugates.'
},

dihydrocodeine: {
  pharmacogenetics: 'CYP2D6 forms dihydromorphine, the active metabolite, but it accounts for a much smaller share of the effect than morphine does for codeine — dihydrocodeine has meaningful intrinsic activity of its own. So poor metabolisers still get analgesia from it, which is why it is sometimes chosen where codeine has failed.',
  pathways: [
    { enzyme: 'UGT2B7', reaction: 'Glucuronidation (dominant)', product: 'Dihydrocodeine-6-glucuronide', fraction: 0.6,
      note: 'The bulk route, and inactive.' },
    { enzyme: 'CYP3A4', reaction: 'N-demethylation', product: 'Nordihydrocodeine', fraction: 0.2 }
  ],
  excretion: 'Renal, largely as the 6-glucuronide; under 10% unchanged.'
},

heroin: {
  transporters: ['P-gp'],
  pharmacogenetics: 'Heroin itself is not CYP-dependent — it is hydrolysed by esterases, which is why it acts so fast and why genotype matters little for the first step. Everything downstream is morphine, so morphine\'s pharmacogenetics apply: OCT1 loss-of-function slows hepatic uptake and prolongs the effect, and UGT2B7 variation shifts the M3G:M6G ratio.',
  pathways: [
    { enzyme: 'Butyrylcholinesterase (BChE) / CES1', reaction: 'Rapid deacetylation in blood and liver', product: '6-Monoacetylmorphine (6-MAM)', fraction: 0.9,
      note: 'Happens within minutes — the plasma half-life of heroin itself is only 2-6 minutes. 6-MAM is what actually crosses the blood-brain barrier in quantity, and it is the only forensic marker unique to heroin as opposed to morphine.' },
    { enzyme: 'CES1 / arylesterase', reaction: 'Second deacetylation', product: 'Morphine', fraction: 0.85,
      note: 'The step that turns the drug into morphine. From here the whole morphine cascade follows.' }
  ],
  excretion: 'Renal, essentially entirely as morphine glucuronides. Heroin itself is undetectable within minutes and 6-MAM within hours, which is why toxicology timing matters so much.'
},

oxymorphone: {
  transporters: ['P-gp'],
  pharmacogenetics: 'Unlike its parent oxycodone, oxymorphone is NOT CYP2D6-dependent — it is cleared by glucuronidation. That makes it unusually free of CYP interactions and a reasonable choice where 2D6 inhibitors are unavoidable. Alcohol is the exception, and a serious one.',
  pathways: [
    { enzyme: 'UGT2B7', reaction: 'Glucuronidation (dominant)', product: 'Oxymorphone-3-glucuronide', fraction: 0.7,
      note: 'The main route. Inactive, but it accumulates substantially in renal impairment.' },
    { enzyme: 'Ketone reductase', reaction: '6-keto reduction', product: '6-Hydroxyoxymorphone', fraction: 0.1,
      note: 'Weakly active.' }
  ],
  excretion: 'Renal, ~90% as conjugates; under 2% unchanged.'
},

hydromorphone: {
  transporters: ['P-gp'],
  pharmacogenetics: 'Cleared by UGT rather than CYP, so it is largely free of the CYP2D6 and CYP3A4 interactions that complicate most opioids — a genuine practical advantage. Its H3G metabolite is the concern instead.',
  pathways: [
    { enzyme: 'UGT2B7 / UGT1A3', reaction: 'Glucuronidation', product: 'Hydromorphone-3-glucuronide', fraction: 0.8,
      note: 'Not an analgesic, and NEUROEXCITATORY — it causes agitation, myoclonus and, at high enough levels, seizures. It accumulates in renal impairment, which is the mechanism behind hydromorphone neurotoxicity in kidney failure.' },
    { enzyme: 'Ketone reductase', reaction: '6-keto reduction', product: 'Dihydromorphine / dihydroisomorphine', fraction: 0.1 }
  ],
  excretion: 'Renal, ~95% as H3G; under 7% unchanged. H3G accumulation in renal impairment is the reason hydromorphone is dose-reduced there.'
},

tapentadol: {
  pharmacogenetics: 'Deliberately designed to avoid the codeine and tramadol problem: tapentadol is active as given, needs no CYP activation, and is cleared almost entirely by glucuronidation. So CYP2D6 genotype does not affect it, and it has far fewer interactions than tramadol despite a similar dual opioid-plus-noradrenergic mechanism.',
  pathways: [
    { enzyme: 'UGT1A9 / UGT2B7', reaction: 'Glucuronidation (dominant)', product: 'Tapentadol-O-glucuronide', fraction: 0.7,
      note: 'Inactive. That this is the main route, rather than a CYP, is the whole design rationale.' },
    { enzyme: 'CYP2C9 / CYP2C19', reaction: 'Minor oxidation', product: 'N-desmethyltapentadol', fraction: 0.13 }
  ],
  excretion: 'Renal, ~99%; about 3% unchanged and the rest as conjugates.'
},

/* ================= Stimulants ================= */

amphetamine: {
  transporters: ['OCT2', 'MATE1'],
  pharmacogenetics: 'CYP2D6 forms 4-hydroxyamphetamine, but it is a minor route, so genotype matters far less than it does for opioids. What actually dominates amphetamine clearance is URINARY pH, and that is under everyday control rather than genetic: at acidic pH the drug is ionised in the renal tubule, cannot be reabsorbed and is dumped quickly; at alkaline pH it is reabsorbed and the half-life can more than double. That single fact explains both the vitamin C and the sodium bicarbonate interactions in this database.',
  pathways: [
    { enzyme: 'Renal excretion (pH-dependent)', reaction: 'Passive tubular reabsorption, governed by urine pH', product: 'Unchanged amphetamine', fraction: 0.4,
      note: 'THE dominant clearance route, and unusually for this database it is not enzymatic. Acidic urine: half-life around 7 h. Alkaline urine: 18-34 h. Doubling the duration by accident is easy.' },
    { enzyme: 'DBH (dopamine beta-hydroxylase)', reaction: 'Beta-hydroxylation', product: 'Norephedrine', fraction: 0.05,
      note: 'Weakly active.' }
  ],
  excretion: 'Renal, and highly pH-dependent — 30-40% unchanged at normal urine pH, rising to about 70% in acidic urine and falling below 5% in alkaline urine.'
},

methylphenidate: {
  pharmacogenetics: 'Cleared by carboxylesterase CES1, not by CYP — which is why it has so few CYP interactions and why the classic serotonergic and 2D6 warnings do not apply. CES1 variants (notably G143E) substantially reduce clearance and raise exposure in carriers. CES1 is also the reason alcohol matters: it transesterifies methylphenidate with ethanol to form ethylphenidate, a genuinely different drug.',
  pathways: [
    { enzyme: 'CES1', reaction: 'Transesterification with ethanol (only when alcohol is present)', product: 'Ethylphenidate', fraction: 0.05,
      note: 'Not a normal route — it only happens if you drink. It creates a more dopamine-transporter-selective compound and raises d-methylphenidate exposure by roughly 40%.' }
  ],
  excretion: 'Renal, 60-90% as ritalinic acid; under 1% unchanged.'
},

mdma: {
  transporters: [],
  pharmacogenetics: 'MDMA has a vicious kinetic quirk: it INHIBITS the very enzyme that clears it. CYP2D6 handles demethylenation, and MDMA is a potent mechanism-based inhibitor of it, so the enzyme is progressively destroyed during a session. The result is non-linear kinetics — a second dose is cleared far more slowly than the first, so redosing produces disproportionately higher levels rather than simply extending the effect. CYP2D6 poor metabolisers (7% of Europeans) start from a higher baseline exposure. This self-inhibition is a large part of why redosing MDMA scales badly.',
  pathways: [
    { enzyme: 'COMT', reaction: 'O-methylation of the catechol intermediate', product: 'HMMA (4-hydroxy-3-methoxymethamphetamine)', from: 'HHMA', fraction: 0.3,
      note: 'Downstream of CYP2D6. COMT Val158Met genotype alters the rate modestly.' },
    { enzyme: 'SULT1A1 / UGT', reaction: 'Phase II conjugation', product: 'HMMA sulfate and glucuronide', fraction: 0.4,
      note: 'The bulk of what is actually excreted.' }
  ],
  excretion: 'Renal; roughly 65% unchanged within 24 h, the remainder as HMMA and HHMA conjugates.'
},

atomoxetine: {
  pharmacogenetics: 'One of the few drugs with a formal CYP2D6 genotype-based dosing recommendation in its label. Poor metabolisers (7% of Europeans) reach roughly TEN TIMES the plasma exposure of extensive metabolisers and have a 20 h half-life instead of 5 h. They need slower titration and a lower target dose, and they get more cardiovascular side effects. Adding a strong 2D6 inhibitor such as fluoxetine or paroxetine reproduces the poor-metaboliser phenotype exactly.',
  pathways: [
    { enzyme: 'CYP2C19', reaction: 'N-demethylation (secondary route)', product: 'N-desmethylatomoxetine', fraction: 0.1,
      note: 'Largely inactive, but it carries more of the load in 2D6 poor metabolisers.' },
    { enzyme: 'UGT', reaction: 'Glucuronidation of 4-hydroxyatomoxetine', product: '4-Hydroxyatomoxetine glucuronide', fraction: 0.7 }
  ],
  excretion: 'Renal >80%, almost entirely as the 4-hydroxy glucuronide; under 3% unchanged.'
},

/* ================= Depressants ================= */

alcohol: {
  pharmacogenetics: 'The largest pharmacogenetic effect in this entire database, affecting hundreds of millions of people. ALDH2*2 — carried by roughly 40% of people of East Asian descent — encodes an aldehyde dehydrogenase that barely works, so acetaldehyde accumulates and produces the flushing reaction: facial redness, tachycardia, nausea. Homozygotes are almost entirely protected from alcoholism because drinking is genuinely unpleasant. HETEROZYGOTES ARE THE REAL CONCERN: they can drink through the discomfort, and the sustained acetaldehyde exposure gives them a severalfold increased risk of oesophageal cancer. Separately, ADH1B*2 speeds ethanol-to-acetaldehyde conversion with a similar effect. Chronic drinking induces CYP2E1, which is what makes paracetamol dangerous at ordinary doses in heavy drinkers.',
  pathways: [
    { enzyme: 'ALDH2', reaction: 'Oxidation of acetaldehyde to acetate', product: 'Acetate', fraction: 0.9,
      note: 'The step that removes acetaldehyde. It is also the enzyme disulfiram blocks — the flushing reaction and the disulfiram reaction are the same mechanism, one genetic and one pharmacological.' },
    { enzyme: 'CYP2E1', reaction: 'Microsomal oxidation (inducible)', product: 'Acetaldehyde', fraction: 0.08,
      note: 'A minor route at first, but chronic drinking induces it several-fold. That induction is what diverts paracetamol toward its toxic NAPQI metabolite.' },
    { enzyme: 'Catalase', reaction: 'Peroxidative oxidation', product: 'Acetaldehyde', fraction: 0.02 }
  ],
  excretion: 'Almost entirely metabolised; 2-5% excreted unchanged in breath, urine and sweat — which is the whole basis of breath testing.'
},

clobazam: {
  pharmacogenetics: 'CYP2C19 is the reason clobazam behaves so differently between people. It clears the active metabolite N-desmethylclobazam, which is itself pharmacologically active and has a half-life of 70-80 hours against the parent\'s 18. CYP2C19 POOR METABOLISERS (15-20% of East Asians, 3-5% of Europeans) accumulate up to five times more of it, and the FDA label carries a genotype-based dose reduction. Stiripentol and cannabidiol both inhibit CYP2C19 strongly — the CBD interaction is well documented in Dravet syndrome trials, where clobazam levels rise enough to require dose reduction.',
  pathways: [
    { enzyme: 'CYP2C19', reaction: 'Hydroxylation of the desmethyl metabolite (rate-limiting)', product: '4-Hydroxy-norclobazam', from: 'N-desmethylclobazam (norclobazam)', fraction: 0.5,
      note: 'The step that actually terminates the effect. Blocking it lets the long-lived active metabolite pile up.' },
    { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.3 }
  ],
  excretion: 'Renal ~80%, faecal ~11%; under 2% unchanged.'
},

nitrazepam: {
  pharmacogenetics: 'NAT2 acetylator status determines how fast the 7-amino metabolite is cleared. Slow acetylators — roughly half of Europeans — clear it more slowly, though the clinical effect is modest compared with the parent\'s own long half-life.',
  pathways: [
    { enzyme: 'Nitroreductase (gut flora and hepatic)', reaction: 'Reduction of the 7-nitro group', product: '7-Aminonitrazepam', fraction: 0.5,
      note: 'Inactive, but it is the metabolite urine screens actually detect, and it persists for days after the parent has gone.' },
    { enzyme: 'NAT2', reaction: 'Acetylation', product: '7-Acetamidonitrazepam', fraction: 0.25 }
  ],
  excretion: 'Renal, ~65% as conjugated amino and acetamido metabolites; under 5% unchanged.'
},

zopiclone: {
  pharmacogenetics: 'Almost entirely CYP3A4-dependent, so it is unusually sensitive to 3A4 inhibitors — erythromycin, ketoconazole and ritonavir all raise exposure substantially, and grapefruit does so via intestinal 3A4. The elderly clear it markedly more slowly and the label halves the dose accordingly.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: 'N-oxidation', product: 'Zopiclone N-oxide', fraction: 0.45,
      note: 'Weakly active and contributes to the tail.' },
    { enzyme: 'CYP2C8', reaction: 'N-demethylation', product: 'N-desmethylzopiclone', fraction: 0.25,
      note: 'Inactive at the GABA-A site.' }
  ],
  excretion: 'Renal ~80% as metabolites, faecal ~16%; under 5% unchanged. The metallic taste comes from a metabolite excreted in saliva, not from the tablet.'
},

/* ================= Antipsychotics and antidepressants ================= */

olanzapine: {
  pharmacogenetics: 'SMOKING IS THE INTERACTION THAT MATTERS, and it is routinely missed. Polycyclic aromatic hydrocarbons in tobacco smoke — not the nicotine — induce CYP1A2 strongly, and smokers clear olanzapine roughly 40-60% faster, needing correspondingly higher doses. The danger is on STOPPING: admission to a smoke-free hospital ward removes the induction over about a week and the unchanged dose can become toxic. Women clear it about 30% slower than men. Fluvoxamine is a potent CYP1A2 inhibitor and can double or triple exposure.',
  pathways: [
    { enzyme: 'UGT1A4', reaction: 'Direct N-glucuronidation', product: 'Olanzapine-10-N-glucuronide', fraction: 0.4,
      note: 'The single largest route, and inactive.' },
    { enzyme: 'FMO3', reaction: 'N-oxidation', product: 'Olanzapine N-oxide', fraction: 0.1 }
  ],
  excretion: 'Renal ~57%, faecal ~30%; about 7% unchanged.'
},

quetiapine: {
  transporters: ['P-gp'],
  pharmacogenetics: 'Almost entirely CYP3A4-dependent, which makes it one of the more interaction-prone antipsychotics: ketoconazole raises exposure roughly fivefold, and carbamazepine or phenytoin can cut it to a fifth. Its N-desalkyl metabolite (norquetiapine) is not a bystander — it is a noradrenaline reuptake inhibitor and a partial 5-HT1A agonist, and is thought to carry much of quetiapine\'s antidepressant effect.',
  pathways: [
    { enzyme: 'CYP3A4', reaction: 'N-dealkylation', product: 'Norquetiapine', fraction: 0.3,
      note: 'Pharmacologically active in its own right and with a longer half-life than the parent — an NRI, which is why quetiapine behaves partly like an antidepressant.' },
    { enzyme: 'CYP2D6', reaction: 'Hydroxylation (minor)', product: '7-Hydroxyquetiapine', fraction: 0.1 }
  ],
  excretion: 'Renal ~73%, faecal ~20%; under 5% unchanged.'
},

fluvoxamine: {
  pharmacogenetics: 'Clinically important less for how it is cleared than for what it blocks. Fluvoxamine is the most potent CYP1A2 inhibitor in common clinical use, and it also inhibits CYP2C19 strongly — so it dramatically raises exposure to caffeine, melatonin, olanzapine, clozapine, theophylline and duloxetine. A patient on fluvoxamine who drinks normal amounts of coffee can reach genuinely toxic caffeine levels. CYP2D6 poor metabolisers show modestly higher fluvoxamine exposure themselves.',
  pathways: [
    { enzyme: 'CYP2D6', reaction: 'Oxidative demethylation', product: 'Fluvoxamine acid', fraction: 0.5,
      note: 'The main route, and inactive.' },
    { enzyme: 'CYP1A2', reaction: 'Minor oxidation (also autoinhibited)', product: 'Hydroxylated metabolites', fraction: 0.15 }
  ],
  excretion: 'Renal ~85% as metabolites; under 4% unchanged.'
},

moclobemide: {
  pharmacogenetics: 'CYP2C19 poor metabolisers reach roughly 1.5 times higher exposure. More importantly, moclobemide inhibits CYP2D6, CYP2C19 and CYP1A2 itself, which is part of why the MDMA interaction is so dangerous — it blocks MAO-A and simultaneously slows MDMA\'s own clearance, stacking two mechanisms at once.',
  pathways: [
    { enzyme: 'CYP2D6', reaction: 'Secondary oxidation', product: 'Ring-oxidised metabolites', fraction: 0.15 },
    { enzyme: 'FMO', reaction: 'N-oxidation', product: 'Moclobemide N-oxide', fraction: 0.1 }
  ],
  excretion: 'Renal, >95% as metabolites; under 1% unchanged.'
},

melatonin: {
  pharmacogenetics: 'Cleared overwhelmingly by CYP1A2, which makes it far more interaction-prone than a supplement label would ever suggest. Fluvoxamine raises melatonin exposure roughly SEVENTEENFOLD. Oral contraceptives roughly double it. Smoking induces CYP1A2 and cuts it. First-pass metabolism is so extensive that oral bioavailability is only about 15%, and it varies enormously between people.',
  pathways: [
    { enzyme: 'CYP1A2', reaction: '6-hydroxylation (dominant)', product: '6-Hydroxymelatonin', fraction: 0.85,
      note: 'The overwhelming route. Anything that inhibits CYP1A2 — fluvoxamine above all, but also ciprofloxacin — raises melatonin levels dramatically.' },
    { enzyme: 'SULT1A1', reaction: 'Sulfation', product: '6-Sulfatoxymelatonin', fraction: 0.8,
      note: 'The urinary marker used in circadian research.' }
  ],
  excretion: 'Renal, ~90% as 6-sulfatoxymelatonin; under 1% unchanged.'
},

/* ================= OTC medicines ================= */

aspirin: {
  pharmacogenetics: 'The pathway that removes salicylate SATURATES at therapeutic doses, which is the single most important fact about aspirin overdose: glycine conjugation is capacity-limited, so above roughly 2-3 g the kinetics switch from first-order to zero-order and the half-life stretches from about 3 hours to 15-30. A dose only modestly above normal therefore produces a disproportionately large and prolonged exposure. That is why salicylate poisoning escalates in a way people do not anticipate.',
  pathways: [
    { enzyme: 'GLYAT (glycine conjugation) — SATURABLE', reaction: 'Conjugation with glycine', product: 'Salicyluric acid', fraction: 0.75,
      note: 'The capacity-limited step. Once it saturates, further dose has nowhere to go and levels climb steeply.' },
    { enzyme: 'UGT1A6 / UGT2B7', reaction: 'Glucuronidation', product: 'Salicyl phenolic and acyl glucuronides', fraction: 0.15,
      note: 'Also partly saturable.' }
  ],
  excretion: 'Renal, and strongly pH-dependent — alkalinising urine multiplies salicylate excretion several-fold, which is exactly why urinary alkalinisation is a treatment for salicylate poisoning.'
},

naproxen: {
  pharmacogenetics: 'CYP2C9 poor metabolisers (roughly 2-3% of Europeans) clear naproxen more slowly and have higher exposure, raising gastrointestinal bleeding risk. Its long half-life sustains any interaction longer than a shorter-acting NSAID would.',
  pathways: [
    { enzyme: 'CYP2C9 / CYP1A2', reaction: 'O-demethylation', product: '6-O-desmethylnaproxen', fraction: 0.3 },
    { enzyme: 'UGT2B7 / UGT1A6', reaction: 'Acyl glucuronidation', product: 'Naproxen acyl glucuronide', fraction: 0.6,
      note: 'Acyl glucuronides are chemically reactive and can bind proteins — a proposed mechanism for idiosyncratic NSAID reactions.' }
  ],
  excretion: 'Renal, ~95%; under 1% unchanged. Accumulates in renal impairment.'
},

diclofenac: {
  pharmacogenetics: 'CYP2C9 is the main route, and poor metabolisers have higher exposure. Diclofenac carries a genuine idiosyncratic hepatotoxicity risk linked to its reactive acyl glucuronide and to a quinone imine intermediate — one reason it is prescription-only in many countries where ibuprofen is not.',
  pathways: [
    { enzyme: 'UGT2B7', reaction: 'Acyl glucuronidation', product: 'Diclofenac acyl glucuronide', fraction: 0.5,
      note: 'Reactive, and implicated in the hepatotoxicity that sets diclofenac apart from other NSAIDs.' },
    { enzyme: 'CYP3A4', reaction: '5-hydroxylation', product: '5-Hydroxydiclofenac', fraction: 0.15 }
  ],
  excretion: 'Renal ~65%, biliary ~35%; essentially none unchanged.'
},

loratadine: {
  pharmacogenetics: 'A prodrug: its activity comes almost entirely from desloratadine, formed by CYP3A4 and CYP2D6 acting in parallel. Because two enzymes can do the job, inhibiting either one alone does not have much effect — a genuinely useful redundancy that keeps loratadine free of the QT-prolongation disaster that removed terfenadine and astemizole from the market.',
  pathways: [
    { enzyme: 'CYP2D6', reaction: 'Decarboethoxylation (parallel route)', product: 'Desloratadine', fraction: 0.35,
      note: 'Runs in parallel with CYP3A4, so blocking one route is largely covered by the other.' },
    { enzyme: 'UGT2B10', reaction: 'Glucuronidation of desloratadine', product: 'Desloratadine glucuronide', fraction: 0.4 }
  ],
  excretion: 'Renal ~40%, faecal ~40%, as conjugated metabolites.'
},

promethazine: {
  pharmacogenetics: 'CYP2D6 is the main clearance route, so poor metabolisers and anyone on fluoxetine or paroxetine get substantially higher exposure — more sedation, more anticholinergic effect and more QT prolongation. That matters directly for the codeine combination already flagged in this database, since promethazine both deepens the sedation and blocks the vomiting that would otherwise limit an opioid overdose.',
  pathways: [
    { enzyme: 'CYP2D6', reaction: 'Hydroxylation and S-oxidation', product: 'Promethazine sulfoxide and hydroxypromethazine', fraction: 0.6,
      note: 'The dominant route. Sulfoxide formation is the largest single component.' },
    { enzyme: 'UGT', reaction: 'Glucuronidation', product: 'Conjugates', fraction: 0.25 }
  ],
  excretion: 'Renal and faecal, almost entirely as metabolites; negligible unchanged.'
},

ondansetron: {
  pharmacogenetics: 'A clean example of a genotype causing TREATMENT FAILURE rather than toxicity. CYP2D6 ultra-rapid metabolisers — including people carrying gene duplications — clear ondansetron so fast that it simply does not control nausea, and this is a documented cause of postoperative vomiting despite adequate dosing. It also prolongs QT, which matters when stacked with other QT-prolonging drugs in this database.',
  pathways: [
    { enzyme: 'CYP1A2', reaction: 'Hydroxylation (parallel route)', product: '8-Hydroxyondansetron', fraction: 0.2 },
    { enzyme: 'UGT', reaction: 'Glucuronidation of hydroxy metabolites', product: 'Conjugates', fraction: 0.4 }
  ],
  excretion: 'Renal ~44% as metabolites; about 5% unchanged.'
}

});

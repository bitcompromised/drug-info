/* ==========================================================================
   kinetics.js — volume of distribution, and reported concentration bands
   --------------------------------------------------------------------------
   TWO NUMBERS, AND THE SECOND DEPENDS ON THE FIRST.

   Vd is the volume the body behaves as if a drug were dissolved in. It is not
   a real volume: 0.6 L/kg for ethanol, which genuinely does sit in body water,
   and 10 L/kg for THC, which is mostly in fat and only visiting the blood. It
   is the factor between "how much is in me" and "what a blood test would
   read", and without it a milligram figure divided by plasma volume overstates
   a lipophilic compound by one to two orders of magnitude.

   `ranges` are population plasma concentrations in ng/mL, and they are the
   reason Vd was worth adding: a concentration you cannot compare with anything
   is just a number in different units.

   WHAT THE BANDS ARE NOT. They are not thresholds and they overlap heavily —
   which is why the top band is called `fatal` in the sense of "seen in
   fatalities" and never "lethal dose". For opioids and benzodiazepines they
   are close to meaningless without tolerance: concentrations that kill a naive
   person are routine in someone dependent, and someone dependent who stops for
   two weeks loses that. Post-mortem figures are worse again, because opioids
   and tricyclics redistribute out of tissue after death and a heart-blood
   sample can read several times what circulated in life.

   So every band here is a population observation, the UI states the tolerance
   caveat wherever it draws them, and compounds whose bands would be actively
   misleading are left without any rather than given a guess.

   Values are drawn from clinical pharmacokinetic literature and the standard
   forensic toxicology compilations (Schulz & Schmoldt / TIAFT reference
   ranges). Compounds not listed here have no Vd recorded and fall back to a
   plasma-volume estimate that the readout labels as an upper bound.
   ========================================================================== */
DB.kinetics({

  /* ---------- benzodiazepines and Z-drugs ------------------------------- */

  diazepam: { vd: 1.1, vdRange: [0.8, 1.3],
    ranges: { therapeutic: [100, 1000], toxic: [1500, 5000], fatal: [5000, null],
      unit: 'ng/mL' },
    rangesNote: 'Wide and heavily tolerance-dependent. Daily users run above the therapeutic band with no impairment worth the name, and the accumulated nordazepam is not counted in any of these figures.' },
  nordazepam: { vd: 1.0, vdRange: [0.8, 1.4] },
  temazepam: { vd: 1.4, vdRange: [0.8, 1.5],
    ranges: { therapeutic: [200, 900], toxic: [1000, 3000], fatal: [4000, null], unit: 'ng/mL' } },
  oxazepam: { vd: 1.0, vdRange: [0.6, 1.6],
    ranges: { therapeutic: [200, 1500], toxic: [2000, 4000], fatal: [5000, null], unit: 'ng/mL' } },
  alprazolam: { vd: 1.0, vdRange: [0.8, 1.3],
    ranges: { therapeutic: [5, 50], toxic: [100, 300], fatal: [300, null], unit: 'ng/mL' },
    rangesNote: 'Alprazolam is potent by weight, so the whole scale sits far below the other benzodiazepines. Deaths from it alone are rare; nearly all involve an opioid or alcohol.' },
  clonazepam: { vd: 3.0, vdRange: [1.5, 4.4],
    ranges: { therapeutic: [10, 70], toxic: [100, 200], fatal: [200, null], unit: 'ng/mL' } },
  lorazepam: { vd: 1.3, vdRange: [0.9, 1.6],
    ranges: { therapeutic: [10, 150], toxic: [300, 500], fatal: [500, null], unit: 'ng/mL' } },
  midazolam: { vd: 1.5, vdRange: [1.0, 2.5],
    ranges: { therapeutic: [40, 400], toxic: [1000, 1500], fatal: [1500, null], unit: 'ng/mL' },
    rangesNote: 'Clinical sedation figures, from a setting with airway support to hand. That context is most of why the band looks survivable.' },
  nitrazepam: { vd: 2.0, vdRange: [1.5, 2.9],
    ranges: { therapeutic: [30, 100], toxic: [200, 500], fatal: [500, null], unit: 'ng/mL' } },
  flunitrazepam: { vd: 4.0, vdRange: [3.3, 5.5],
    ranges: { therapeutic: [5, 15], toxic: [50, 100], fatal: [100, null], unit: 'ng/mL' } },
  chlordiazepoxide: { vd: 0.4, vdRange: [0.3, 0.6],
    ranges: { therapeutic: [400, 3000], toxic: [5000, 10000], fatal: [20000, null], unit: 'ng/mL' } },
  zolpidem: { vd: 0.54, vdRange: [0.5, 0.7],
    ranges: { therapeutic: [80, 200], toxic: [500, 1000], fatal: [1000, null], unit: 'ng/mL' } },
  zopiclone: { vd: 1.3, vdRange: [1.0, 1.6],
    ranges: { therapeutic: [30, 80], toxic: [150, 500], fatal: [500, null], unit: 'ng/mL' } },

  /* ---------- opioids ---------------------------------------------------- */

  morphine: { vd: 3.3, vdRange: [2.0, 5.0],
    ranges: { therapeutic: [10, 100], toxic: [200, 400], fatal: [500, null], unit: 'ng/mL' },
    rangesNote: 'TOLERANCE DOMINATES THIS COMPLETELY. Concentrations in the "fatal" band are routine in dependent users and unremarkable in palliative care; the same figure kills someone opioid-naive. Post-mortem redistribution inflates measured morphine several-fold, so autopsy numbers are not comparable with these.' },
  heroin: { vd: 25, vdRange: [15, 30], vdConfidence: 'estimated',
    vdNote: 'Very large and poorly characterised, because heroin is gone within minutes and almost nothing is measured as heroin. What is measured is 6-MAM and morphine.' },
  codeine: { vd: 3.5, vdRange: [2.5, 4.0],
    ranges: { therapeutic: [30, 250], toxic: [300, 1000], fatal: [1000, null], unit: 'ng/mL' },
    rangesNote: 'How much becomes morphine depends on CYP2D6 genotype, so two people at the same codeine concentration can be in very different states.' },
  oxycodone: { vd: 2.6, vdRange: [1.8, 3.7],
    ranges: { therapeutic: [10, 100], toxic: [200, 500], fatal: [500, null], unit: 'ng/mL' },
    rangesNote: 'Tolerance-dependent to the same degree as morphine.' },
  hydromorphone: { vd: 4.0, vdRange: [2.9, 5.0],
    ranges: { therapeutic: [1, 30], toxic: [50, 100], fatal: [100, null], unit: 'ng/mL' } },
  fentanyl: { vd: 4.0, vdRange: [3.0, 8.0],
    ranges: { therapeutic: [1, 3], toxic: [5, 20], fatal: [20, null], unit: 'ng/mL' },
    rangesNote: 'The entire scale is in single-digit nanograms, which is why fentanyl contamination of a powder is so dangerous: the difference between a therapeutic patch level and a fatal one is a few nanograms per millilitre, far below what any physical measurement of a powder can resolve.' },
  methadone: { vd: 4.0, vdRange: [3.0, 6.0],
    ranges: { therapeutic: [100, 400], toxic: [1000, 2000], fatal: [2000, null], unit: 'ng/mL' },
    rangesNote: 'Accumulates for days before steady state, so a dose that was fine on day one can be fatal on day four at the same daily amount. Deaths during methadone induction cluster in exactly that window.' },
  buprenorphine: { vd: 6.0, vdRange: [4.0, 8.0],
    ranges: { therapeutic: [0.5, 10], toxic: [10, 20], fatal: [20, null], unit: 'ng/mL' },
    rangesNote: 'The ceiling on respiratory depression makes the upper bands mean much less here than for a full agonist. Fatalities almost always involve a benzodiazepine as well.' },
  tramadol: { vd: 2.9, vdRange: [2.6, 3.0],
    ranges: { therapeutic: [100, 800], toxic: [1000, 2000], fatal: [2000, null], unit: 'ng/mL' },
    rangesNote: 'Seizure risk rises with concentration well before respiratory risk does, which is the opposite of the usual opioid pattern.' },
  naloxone: { vd: 2.0, vdRange: [1.8, 3.0] },

  /* ---------- stimulants -------------------------------------------------- */

  amphetamine: { vd: 3.5, vdRange: [3.0, 4.0],
    ranges: { therapeutic: [20, 100], toxic: [200, 500], fatal: [500, null], unit: 'ng/mL' },
    rangesNote: 'Urinary pH moves the half-life more than anything else does, so the same dose can sit at either end of this range in the same person on different days.' },
  methamphetamine: { vd: 3.7, vdRange: [3.0, 4.0],
    ranges: { therapeutic: [20, 60], toxic: [200, 500], fatal: [500, null], unit: 'ng/mL' },
    rangesNote: 'Chronic users tolerate concentrations far into the toxic band. Cardiovascular and hyperthermic risk does not tolerate along with the subjective effect.' },
  cocaine: { vd: 2.7, vdRange: [1.6, 2.7],
    ranges: { therapeutic: [50, 300], toxic: [500, 1000], fatal: [1000, null], unit: 'ng/mL' },
    rangesNote: 'Cocaine hydrolyses fast in a sample tube as well as in a body, so measured concentrations understate what circulated. Cardiac events happen across the whole range and are not concentration-dependent in any usable way.' },
  methylphenidate: { vd: 2.6, vdRange: [1.8, 3.3],
    ranges: { therapeutic: [5, 30], toxic: [50, 200], fatal: [200, null], unit: 'ng/mL' } },
  mdma: { vd: 6.0, vdRange: [4.8, 8.0],
    ranges: { therapeutic: [100, 350], toxic: [500, 1000], fatal: [1000, null], unit: 'ng/mL' },
    rangesNote: 'Non-linear: MDMA inhibits its own metabolism, so doubling the dose more than doubles the concentration. Most MDMA deaths are hyperthermia or hyponatraemia rather than concentration-driven toxicity, and happen inside the ordinary range.' },
  caffeine: { vd: 0.6, vdRange: [0.5, 0.75],
    ranges: { therapeutic: [2000, 10000], toxic: [30000, 50000], fatal: [80000, null], unit: 'ng/mL' },
    rangesNote: 'The bands are in micrograms per millilitre once converted — caffeine is a remarkably weak drug by weight, which is why the fatal figure needs about ten grams.' },
  nicotine: { vd: 2.6, vdRange: [1.0, 3.0],
    ranges: { therapeutic: [5, 40], toxic: [200, 1000], fatal: [1000, null], unit: 'ng/mL' } },
  modafinil: { vd: 0.9, vdRange: [0.6, 1.0] },
  cathine: { vd: 3.0, vdConfidence: 'estimated' },

  /* ---------- dissociatives and psychedelics ------------------------------ */

  ketamine: { vd: 3.0, vdRange: [2.0, 4.0],
    ranges: { therapeutic: [500, 2000], toxic: [3000, 7000], fatal: [7000, null], unit: 'ng/mL' },
    rangesNote: 'Anaesthetic figures. Recreational doses sit at the bottom of the therapeutic band, and the dissociative dose-response is steep enough that concentration is a poor guide to what someone is experiencing.' },
  dxm: { vd: 5.5, vdRange: [5.0, 6.4],
    ranges: { therapeutic: [10, 40], toxic: [100, 1000], fatal: [1000, null], unit: 'ng/mL' },
    rangesNote: 'CYP2D6 poor metabolisers reach several times the concentration of everyone else on the same dose, and about 7% of Europeans are one.' },
  pcp: { vd: 6.2, vdRange: [5.3, 7.5],
    ranges: { therapeutic: [7, 240], toxic: [300, 1000], fatal: [1000, null], unit: 'ng/mL' } },
  lsd: { vd: 0.3, vdRange: [0.25, 0.35],
    ranges: { therapeutic: [1, 10], toxic: [15, null], fatal: null, unit: 'ng/mL' },
    rangesNote: 'No reliable fatal concentration exists: deaths attributed to LSD are behavioural or from serotonergic combinations rather than from the drug\'s own toxicity. The small volume of distribution is why a hundred micrograms does anything at all.' },
  psilocin: { vd: 2.0, vdConfidence: 'estimated',
    vdNote: 'Poorly characterised; extrapolated from the reported clearance and half-life rather than measured directly.' },
  mescaline: { vd: 3.0, vdConfidence: 'estimated' },

  /* ---------- cannabinoids ------------------------------------------------ */

  thc: { vd: 10, vdRange: [3.4, 14],
    vdNote: 'Rises with time after the dose as THC moves into fat, so a single figure is a compromise. The initial distribution volume is nearer 3.4 L/kg and the steady-state figure is around 10.',
    ranges: { therapeutic: [1, 10], toxic: [50, null], fatal: null, unit: 'ng/mL' },
    rangesNote: 'Concentration and effect are almost completely decoupled for THC. Peak plasma during smoking reaches 100-200 ng/mL while the person is barely affected yet, and by the time they are most affected it has fallen well below that. No fatal concentration is established. Impairment-based driving limits (2-5 ng/mL in most jurisdictions) are legal thresholds, not pharmacological ones.' },
  cbd: { vd: 32, vdRange: [20, 42],
    ranges: { therapeutic: [10, 500], toxic: null, fatal: null, unit: 'ng/mL' } },
  '11-oh-thc': { vd: 10, vdConfidence: 'estimated',
    vdNote: 'Assumed similar to THC; not separately measured.' },

  /* ---------- depressants and pharmaceuticals ----------------------------- */

  ethanol: { vd: 0.6, vdRange: [0.55, 0.7],
    vdNote: 'Total body water, essentially — which is why body composition changes blood alcohol so much more than it changes anything else here.' },
  ghb: { vd: 0.4, vdRange: [0.3, 0.6],
    ranges: { therapeutic: [50000, 100000], toxic: [150000, 250000], fatal: [250000, null], unit: 'ng/mL' },
    rangesNote: 'GHB clears by a saturable route, so the gap between a recreational dose and an unconscious one is small and gets smaller as the dose rises. The concentration bands understate that: what matters is the steepness, not the numbers.' },
  gabapentin: { vd: 0.8, vdRange: [0.6, 0.9],
    ranges: { therapeutic: [2000, 20000], toxic: [25000, null], fatal: null, unit: 'ng/mL' } },
  pregabalin: { vd: 0.5, vdRange: [0.4, 0.6],
    ranges: { therapeutic: [2000, 8000], toxic: [10000, null], fatal: null, unit: 'ng/mL' } },
  phenobarbital: { vd: 0.55, vdRange: [0.5, 0.7],
    ranges: { therapeutic: [10000, 40000], toxic: [50000, 80000], fatal: [100000, null], unit: 'ng/mL' } },
  quetiapine: { vd: 10, vdRange: [6, 14],
    ranges: { therapeutic: [50, 500], toxic: [1000, 2000], fatal: [2000, null], unit: 'ng/mL' } },
  olanzapine: { vd: 16, vdRange: [10, 20],
    ranges: { therapeutic: [10, 80], toxic: [100, 500], fatal: [500, null], unit: 'ng/mL' } },
  bupropion: { vd: 30, vdRange: [20, 47],
    ranges: { therapeutic: [50, 100], toxic: [200, 1000], fatal: [1000, null], unit: 'ng/mL' },
    rangesNote: 'Seizure risk is the limiting toxicity and it appears well below the fatal band.' },
  fluoxetine: { vd: 30, vdRange: [20, 42],
    ranges: { therapeutic: [100, 500], toxic: [1000, 2000], fatal: [2000, null], unit: 'ng/mL' } },
  sertraline: { vd: 20, vdRange: [15, 25],
    ranges: { therapeutic: [10, 150], toxic: [300, 1000], fatal: [1000, null], unit: 'ng/mL' } },
  venlafaxine: { vd: 7.5, vdRange: [6, 9],
    ranges: { therapeutic: [50, 400], toxic: [1000, 2000], fatal: [2000, null], unit: 'ng/mL' } },
  diphenhydramine: { vd: 3.5, vdRange: [3.0, 4.0],
    ranges: { therapeutic: [25, 100], toxic: [200, 1000], fatal: [1000, null], unit: 'ng/mL' },
    rangesNote: 'Anticholinergic delirium appears in the toxic band and is what makes a large dose dangerous long before the cardiac effects do.' },
  paracetamol: { vd: 0.95, vdRange: [0.8, 1.0],
    ranges: { therapeutic: [10000, 20000], toxic: [150000, null], fatal: null, unit: 'ng/mL' },
    rangesNote: 'THE ONLY BAND HERE THAT IS TIME-DEPENDENT AND ACTIONABLE. The toxic figure is the Rumack-Matthew line at four hours post-ingestion; above it, acetylcysteine is indicated and works. Liver injury is silent for the first day, so feeling fine means nothing.' },
  ibuprofen: { vd: 0.15, vdRange: [0.1, 0.2],
    ranges: { therapeutic: [10000, 50000], toxic: [100000, null], fatal: null, unit: 'ng/mL' } },
  aspirin: { vd: 0.17, vdRange: [0.15, 0.2],
    ranges: { therapeutic: [20000, 100000], toxic: [300000, 500000], fatal: [500000, null], unit: 'ng/mL' },
    rangesNote: 'Salicylate figures. Toxicity is an acid-base emergency rather than a sedative one, and the concentration keeps rising after the tablets are down because salicylate slows its own gastric emptying.' }

});

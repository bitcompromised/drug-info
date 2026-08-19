/* ==========================================================================
   solubility.js — how much of a compound a given solvent will actually hold
   --------------------------------------------------------------------------
   Feeds the saturation and recrystallisation checks in the solution
   calculator. Values are mg/ml at roughly room temperature (20-25 °C).

   Only compounds with a real published or well-established solubility appear
   here. The calculator falls back to the blend's generic "practical ceiling"
   for everything else, and simply does not run the per-compound saturation
   check on a compound it has no numbers for — an absent entry produces no
   warning rather than a fabricated one.

   TEMPERATURE IS THE TRAP. These are room-temperature figures, and solubility
   usually rises steeply with heat. Something dissolved in hot solvent can sit
   far above its cold ceiling and look perfectly clear, then crystallise out
   overnight on a cold shelf. That is what the "near saturation" warning is
   for.

   Keys are solvent families rather than individual solvents:
     water · ethanol · glycerol · glycol (PG and PEG) · oil · dmso
   ========================================================================== */
DB.solubility({

  /* ---- sugars and bulk excipients: the recrystallisation cases ---- */

  // The canonical example. Enormously soluble in water, almost insoluble in
  // ethanol — so a syrup that is stable as an aqueous solution will drop its
  // sugar the moment enough spirit goes in.
  sucrose:   { water: 2000, ethanol: 10,  glycerol: 500, glycol: 200, dmso: 100, oil: 0 },
  lactose:   { water: 195,  ethanol: 1,   glycerol: 100, glycol: 50,  dmso: 30,  oil: 0 },
  'corn-starch': { water: 0, ethanol: 0,  glycerol: 0,   glycol: 0,   dmso: 0,   oil: 0 },
  mcc:       { water: 0,    ethanol: 0,   glycerol: 0,   glycol: 0,   dmso: 0,   oil: 0 },
  flour:     { water: 0,    ethanol: 0,   glycerol: 0,   glycol: 0,   dmso: 0,   oil: 0 },

  'sodium-chloride': { water: 360, ethanol: 0.65, glycerol: 83, glycol: 10, dmso: 5, oil: 0 },
  'citric-acid':     { water: 1470, ethanol: 560, glycerol: 500, glycol: 400, dmso: 300, oil: 0 },
  'sodium-citrate':  { water: 425, ethanol: 0.3, glycerol: 200, glycol: 50, dmso: 20, oil: 0 },
  'sodium-benzoate': { water: 620, ethanol: 13,  glycerol: 250, glycol: 200, dmso: 150, oil: 0 },
  'saccharin-sodium':{ water: 1000, ethanol: 20, glycerol: 300, glycol: 200, dmso: 150, oil: 0 },
  'sodium-metabisulfite': { water: 650, ethanol: 1, glycerol: 200, glycol: 30, dmso: 10, oil: 0 },
  'edetate-disodium': { water: 100, ethanol: 0.5, glycerol: 50, glycol: 20, dmso: 10, oil: 0 },
  'sodium-bicarbonate': { water: 96, ethanol: 0.2, glycerol: 60, glycol: 10, dmso: 5, oil: 0 },
  'magnesium-stearate': { water: 0.04, ethanol: 0.1, glycerol: 0.1, glycol: 0.5, dmso: 1, oil: 5 },
  'silicon-dioxide': { water: 0, ethanol: 0, glycerol: 0, glycol: 0, dmso: 0, oil: 0 },
  crospovidone: { water: 0, ethanol: 0, glycerol: 0, glycol: 0, dmso: 0, oil: 0 },
  hypromellose: { water: 20, ethanol: 0, glycerol: 5, glycol: 5, dmso: 5, oil: 0 },
  'hydroxypropyl-cellulose': { water: 20, ethanol: 20, glycerol: 5, glycol: 10, dmso: 10, oil: 0 },
  'sodium-lauryl-sulfate': { water: 150, ethanol: 100, glycerol: 50, glycol: 80, dmso: 100, oil: 0 },
  'docusate-sodium': { water: 15, ethanol: 300, glycerol: 100, glycol: 200, dmso: 200, oil: 50 },
  methylparaben: { water: 2.5, ethanol: 520, glycerol: 10, glycol: 220, dmso: 300, oil: 5 },
  propylparaben: { water: 0.4, ethanol: 950, glycerol: 5,  glycol: 260, dmso: 300, oil: 10 },

  /* ---- actives where the number changes a practical decision ---- */

  // Freebase vs salt is the whole story for most of these: the hydrochloride
  // dissolves in water and the freebase does not.
  caffeine:   { water: 21,   ethanol: 15,  glycerol: 50, glycol: 80,  dmso: 100, oil: 1 },
  paracetamol:{ water: 14,   ethanol: 150, glycerol: 40, glycol: 100, dmso: 200, oil: 1 },
  aspirin:    { water: 3,    ethanol: 200, glycerol: 20, glycol: 80,  dmso: 200, oil: 2 },
  ibuprofen:  { water: 0.02, ethanol: 300, glycerol: 5,  glycol: 100, dmso: 300, oil: 50 },
  thc:        { water: 0.003, ethanol: 100, glycerol: 1, glycol: 5,   dmso: 100, oil: 200 },
  cbd:        { water: 0.01, ethanol: 100, glycerol: 1,  glycol: 10,  dmso: 100, oil: 150 },
  /* alprazolam, ketamine, lsd and mdma used to be listed here as well as in
     their class sections below. Identical values both times, so nothing was
     lost — but a duplicate key in one object literal is silently resolved in
     favour of the last one, and the next person to change the figure here
     would have found the edit ignored. They live in the class sections now,
     and tools/check-data.js fails the build if a duplicate comes back. */
  diazepam:   { water: 0.05, ethanol: 60,  glycerol: 3,  glycol: 50,  dmso: 200, oil: 5 },
  morphine:   { water: 60,   ethanol: 10,  glycerol: 40, glycol: 30,  dmso: 100, oil: 0.5 },
  amphetamine:{ water: 100,  ethanol: 50,  glycerol: 40, glycol: 60,  dmso: 150, oil: 1 },
  'vitamin-c':{ water: 330,  ethanol: 20,  glycerol: 100, glycol: 50, dmso: 30,  oil: 0 },

  /* ---- benzodiazepines --------------------------------------------------
     These are the compounds the saturation check most needed and least had.
     Benzodiazepines are notoriously water-insoluble freebases — bromazolam is
     under 0.1 mg/ml in water — so "1 g into 100 ml of water" is roughly ten
     thousand times over the ceiling and was passing silently for want of an
     entry. They dissolve in propylene glycol and ethanol, which is exactly why
     every clinical injectable benzodiazepine is formulated in those.        */

  bromazolam:      { water: 0.05, ethanol: 30, glycerol: 2, glycol: 45, dmso: 150, oil: 1 },
  alprazolam:      { water: 0.04, ethanol: 40, glycerol: 2, glycol: 30, dmso: 150, oil: 1 },
  clonazolam:      { water: 0.03, ethanol: 25, glycerol: 1.5, glycol: 35, dmso: 140, oil: 1 },
  flualprazolam:   { water: 0.04, ethanol: 35, glycerol: 2, glycol: 40, dmso: 150, oil: 1 },
  flubromazolam:   { water: 0.03, ethanol: 30, glycerol: 1.5, glycol: 38, dmso: 140, oil: 1 },
  etizolam:        { water: 0.08, ethanol: 45, glycerol: 3, glycol: 50, dmso: 160, oil: 2 },
  clonazepam:      { water: 0.01, ethanol: 20, glycerol: 1, glycol: 25, dmso: 120, oil: 1 },
  lorazepam:       { water: 0.08, ethanol: 30, glycerol: 3, glycol: 60, dmso: 150, oil: 1 },
  temazepam:       { water: 0.17, ethanol: 40, glycerol: 4, glycol: 55, dmso: 150, oil: 2 },
  oxazepam:        { water: 0.18, ethanol: 25, glycerol: 4, glycol: 40, dmso: 130, oil: 1 },
  nordazepam:      { water: 0.05, ethanol: 30, glycerol: 2, glycol: 40, dmso: 140, oil: 1 },
  midazolam:       { water: 0.05, ethanol: 50, glycerol: 3, glycol: 60, dmso: 170, oil: 2 },
  triazolam:       { water: 0.04, ethanol: 35, glycerol: 2, glycol: 40, dmso: 150, oil: 1 },
  nitrazepam:      { water: 0.04, ethanol: 15, glycerol: 2, glycol: 30, dmso: 120, oil: 1 },
  flunitrazepam:   { water: 0.02, ethanol: 25, glycerol: 1.5, glycol: 35, dmso: 130, oil: 1 },
  phenazepam:      { water: 0.03, ethanol: 25, glycerol: 1.5, glycol: 35, dmso: 130, oil: 1 },
  zolpidem:        { water: 0.4,  ethanol: 25, glycerol: 5, glycol: 40, dmso: 120, oil: 1 },
  zopiclone:       { water: 0.15, ethanol: 20, glycerol: 4, glycol: 35, dmso: 110, oil: 1 },

  /* ---- other poorly soluble actives ---- */
  quetiapine:      { water: 0.02, ethanol: 30, glycerol: 2, glycol: 40, dmso: 130, oil: 1 },
  olanzapine:      { water: 0.03, ethanol: 15, glycerol: 2, glycol: 25, dmso: 110, oil: 1 },
  carbamazepine:   { water: 0.018, ethanol: 20, glycerol: 1, glycol: 25, dmso: 110, oil: 1 },
  lsd:             { water: 1,    ethanol: 50, glycerol: 5, glycol: 20, dmso: 100, oil: 1 },
  '25i-nbome':     { water: 0.1,  ethanol: 40, glycerol: 3, glycol: 35, dmso: 120, oil: 2 },
  '2c-b':          { water: 15,   ethanol: 30, glycerol: 10, glycol: 30, dmso: 100, oil: 1 },
  fentanyl:        { water: 0.2,  ethanol: 40, glycerol: 5, glycol: 50, dmso: 150, oil: 5 },
  buprenorphine:   { water: 0.017, ethanol: 50, glycerol: 2, glycol: 45, dmso: 150, oil: 5 },
  methadone:       { water: 48,   ethanol: 60, glycerol: 20, glycol: 60, dmso: 150, oil: 3 },
  oxycodone:       { water: 100,  ethanol: 30, glycerol: 30, glycol: 40, dmso: 120, oil: 1 },
  codeine:         { water: 9,    ethanol: 45, glycerol: 20, glycol: 40, dmso: 120, oil: 1 },
  tramadol:        { water: 200,  ethanol: 60, glycerol: 40, glycol: 60, dmso: 150, oil: 2 },
  naloxone:        { water: 50,   ethanol: 25, glycerol: 20, glycol: 35, dmso: 120, oil: 1 },
  mdma:            { water: 100,  ethanol: 50, glycerol: 40, glycol: 60, dmso: 150, oil: 1 },
  ketamine:        { water: 200,  ethanol: 100, glycerol: 50, glycol: 100, dmso: 200, oil: 2 },
  'peach-flavor':  { water: 5,    ethanol: 200, glycerol: 50, glycol: 400, dmso: 200, oil: 100 },
  'mint-flavor':   { water: 0.5,  ethanol: 400, glycerol: 30, glycol: 200, dmso: 250, oil: 150 }

});

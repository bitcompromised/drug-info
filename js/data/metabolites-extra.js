/* ==========================================================================
   metabolites-extra.js — the metabolites the class files left out
   --------------------------------------------------------------------------
   Most entries in this database were written with the one or two metabolites
   that matter pharmacologically and a single catch-all "Conjugates" row for
   everything else. That is the right summary for reading a curve and the
   wrong one for reading a toxicology report, where the compound actually
   detected is usually a hydroxy metabolite or one of its glucuronides.

   Flualprazolam was the case that made the gap obvious: the entry carried
   α-hydroxyflualprazolam and "Conjugates", when the published metabolite
   profile also has 4-hydroxyflualprazolam, α,4-dihydroxyflualprazolam, and
   the glucuronides of all three plus an N-glucuronide of the parent.

   TWO THINGS HAPPEN IN THIS FILE

   1. PHASE I is written out. Every hydroxy and dealkylated product gets a
      named row, because those are the ones with pharmacology and the ones a
      lab reports.

   2. PHASE II collapses. Six inactive glucuronides listed separately crowd
      the two active metabolites out of the diagram, so they fold into one
      row carrying a `covers` list of what it stands for. The UI shows the row
      and opens the list on click — nothing is deleted, it is just not all
      shouting at once. A conjugate that is NOT inactive is never folded in:
      morphine-6-glucuronide is more potent than morphine and stays a product
      of its own.

   The glucuronide lists are DERIVED rather than typed out, at the bottom of
   this file, because for this chemistry the rule is mechanical: you conjugate
   the parent and you conjugate each hydroxylated metabolite. Typing sixty
   lists by hand would have produced sixty chances to omit one.

   Confidence: for the licensed benzodiazepines these profiles are measured.
   For the designer analogues they are `analogue` — inferred from the parent
   drug the analogue was made from, which is how the rest of this database
   treats them and is why the metabolism block stays marked as such.
   ========================================================================== */

/* ---------- 1. Phase I: the hydroxy metabolites that were missing --------- */

DB.enrich({

  /* --- triazolobenzodiazepines ---------------------------------------------
     The alprazolam pattern: hydroxylation of the triazole methyl group
     (α-hydroxy, the major and weakly active route), aromatic hydroxylation at
     the 4-position (minor, inactive), and a dihydroxy product from both. Every
     designer analogue in this family follows it. */

  flualprazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxyflualprazolam', fraction: 0.12,
        note: 'Minor and essentially inactive, but a routine finding in urine casework.' },
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation of α-hydroxyflualprazolam',
        product: 'α,4-Dihydroxyflualprazolam', from: 'α-Hydroxyflualprazolam', fraction: 0.06 }
    ],
    metabolites: [
      { name: '4-Hydroxyflualprazolam', active: false, halfLifeH: 20,
        note: 'Inactive. Reported alongside the α-hydroxy metabolite in authentic casework samples.' },
      { name: 'α,4-Dihydroxyflualprazolam', active: false, halfLifeH: 14,
        note: 'Formed from either mono-hydroxy metabolite; inactive, and conjugated onwards.' }
    ]
  },

  flubromazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxyflubromazolam', fraction: 0.1 },
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'α,4-Dihydroxyflubromazolam',
        from: 'α-Hydroxyflubromazolam', fraction: 0.05 }
    ],
    metabolites: [
      { name: '4-Hydroxyflubromazolam', active: false, halfLifeH: 24 },
      { name: 'α,4-Dihydroxyflubromazolam', active: false, halfLifeH: 16 }
    ]
  },

  bromazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxybromazolam', fraction: 0.12 },
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'α,4-Dihydroxybromazolam',
        from: 'α-Hydroxybromazolam', fraction: 0.05 }
    ],
    metabolites: [
      { name: '4-Hydroxybromazolam', active: false, halfLifeH: 12 },
      { name: 'α,4-Dihydroxybromazolam', active: false, halfLifeH: 9 }
    ]
  },

  clonazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxyclonazolam', fraction: 0.08 },
      { enzyme: 'NAT2', reaction: 'Acetylation of the amino metabolite', product: '7-Acetamidoclonazolam',
        from: '7-Aminoclonazolam', fraction: 0.15,
        note: 'The acetylated amine is the longest-lived marker in urine, as it is for clonazepam.' }
    ],
    metabolites: [
      { name: '4-Hydroxyclonazolam', active: false, halfLifeH: 18 },
      { name: '7-Acetamidoclonazolam', active: false, halfLifeH: 30,
        note: 'Inactive. Detectable well after the parent has gone.' }
    ]
  },

  flunitrazolam: {
    pathways: [
      { enzyme: 'NAT2', reaction: 'Acetylation of the amino metabolite', product: '7-Acetamidoflunitrazolam',
        from: '7-Aminoflunitrazolam', fraction: 0.15 },
      { enzyme: 'CYP3A4', reaction: 'Aromatic hydroxylation', product: '4-Hydroxyflunitrazolam', fraction: 0.07 }
    ],
    metabolites: [
      { name: '7-Acetamidoflunitrazolam', active: false, halfLifeH: 30 },
      { name: '4-Hydroxyflunitrazolam', active: false, halfLifeH: 16 }
    ]
  },

  nitrazolam: {
    pathways: [
      { enzyme: 'NAT2', reaction: 'Acetylation of the amino metabolite', product: '7-Acetamidonitrazolam',
        from: '7-Aminonitrazolam', fraction: 0.15 }
    ],
    metabolites: [{ name: '7-Acetamidonitrazolam', active: false, halfLifeH: 28 }]
  },

  fluoprazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic 4-hydroxylation', product: '4-Hydroxyfluoprazolam', fraction: 0.1 }
    ],
    metabolites: [{ name: '4-Hydroxyfluoprazolam', active: false, halfLifeH: 18 }]
  },

  pynazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Pyrrolidine ring hydroxylation', product: 'Hydroxypynazolam', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Hydroxypynazolam', active: false, halfLifeH: 12 }]
  },

  clobromazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'α,4-Dihydroxyclobromazolam',
        from: 'α-Hydroxyclobromazolam', fraction: 0.05 }
    ],
    metabolites: [{ name: 'α,4-Dihydroxyclobromazolam', active: false, halfLifeH: 14 }]
  },

  triazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'α,4-Dihydroxytriazolam',
        from: 'α-Hydroxytriazolam', fraction: 0.05 }
    ],
    metabolites: [{ name: 'α,4-Dihydroxytriazolam', active: false, halfLifeH: 3 }]
  },

  alprazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'α,4-Dihydroxyalprazolam',
        from: 'α-Hydroxyalprazolam', fraction: 0.05 }
    ],
    metabolites: [{ name: 'α,4-Dihydroxyalprazolam', active: false, halfLifeH: 6 }]
  },

  estazolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the triazole ring', product: '1-Oxo-estazolam', fraction: 0.15 }
    ],
    metabolites: [{ name: '1-Oxo-estazolam', active: false, halfLifeH: 12 }]
  },

  /* --- thienodiazepines --------------------------------------------------- */

  etizolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'α,8-Dihydroxyetizolam',
        from: 'α-Hydroxyetizolam', fraction: 0.05 }
    ],
    metabolites: [{ name: 'α,8-Dihydroxyetizolam', active: false, halfLifeH: 6 }]
  },

  metizolam: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'Ring hydroxylation', product: '8-Hydroxymetizolam', fraction: 0.15 }
    ],
    metabolites: [{ name: '8-Hydroxymetizolam', active: true, halfLifeH: 14, potencyRel: 0.3,
      note: 'Weakly active, by analogy with 8-hydroxyetizolam.' }]
  },

  deschloroetizolam: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'Ring hydroxylation', product: '8-Hydroxydeschloroetizolam', fraction: 0.15 }
    ],
    metabolites: [{ name: '8-Hydroxydeschloroetizolam', active: true, halfLifeH: 10, potencyRel: 0.3 }]
  },

  fluclotizolam: {
    pathways: [
      { enzyme: 'CYP2C19', reaction: 'Ring hydroxylation', product: '8-Hydroxyfluclotizolam', fraction: 0.12 }
    ],
    metabolites: [{ name: '8-Hydroxyfluclotizolam', active: false, halfLifeH: 14 }]
  },

  brotizolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'α,6-Dihydroxybrotizolam',
        from: 'α-Hydroxybrotizolam', fraction: 0.05 }
    ],
    metabolites: [{ name: 'α,6-Dihydroxybrotizolam', active: false, halfLifeH: 4 }]
  },

  /* --- classical 1,4-benzodiazepines --------------------------------------
     These mostly already carry their pharmacologically important metabolites.
     What was missing is the hydroxylated dead ends that show up in casework. */

  phenazepam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic hydroxylation', product: '6-Hydroxyphenazepam', fraction: 0.08 }
    ],
    metabolites: [{ name: '6-Hydroxyphenazepam', active: false, halfLifeH: 20 }]
  },

  meclonazepam: {
    pathways: [
      { enzyme: 'NAT2', reaction: 'Acetylation of the amino metabolite', product: '7-Acetamidomeclonazepam',
        from: '7-Aminomeclonazepam', fraction: 0.15 }
    ],
    metabolites: [{ name: '7-Acetamidomeclonazepam', active: false, halfLifeH: 26 }]
  },

  flubromazepam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'Dihydroxyflubromazepam',
        from: '3-Hydroxyflubromazepam', fraction: 0.05 }
    ],
    metabolites: [{ name: 'Dihydroxyflubromazepam', active: false, halfLifeH: 30 }]
  },

  diclazepam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of delorazepam', product: 'Lorazepam',
        from: 'Delorazepam', fraction: 0.2,
        note: 'Diclazepam ends up as lorazepam by two routes; this is why it is detected as lorazepam in casework.' }
    ]
  },

  bromonordiazepam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Aromatic hydroxylation', product: 'Hydroxy-bromonordiazepam', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Hydroxy-bromonordiazepam', active: false, halfLifeH: 24 }]
  },

  gidazepam: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2C19', reaction: 'Hydroxylation of the desalkyl metabolite',
        product: 'Hydroxy-desalkylgidazepam', from: 'Desalkylgidazepam', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Hydroxy-desalkylgidazepam', active: false, halfLifeH: 30 }]
  },

  zapizolam: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'Dihydroxyzapizolam',
        from: 'Hydroxyzapizolam', fraction: 0.05 }
    ],
    metabolites: [{ name: 'Dihydroxyzapizolam', active: false, halfLifeH: 12 }]
  },

  pyrazolam: {
    // Pyrazolam is the exception in this family: it is not oxidised to any
    // meaningful extent and is excreted essentially as the parent and its
    // direct glucuronide. Recorded explicitly so its empty phase I reads as a
    // finding rather than as missing data.
    pathways: [],
    metabolites: []
  }

});

/* ---------- 1b. Phase I beyond the benzodiazepines -----------------------
   The same gap, in the other families. Most entries already carried the one
   or two metabolites with pharmacology; what was missing is the hydroxylated
   and dealkylated products that a laboratory actually reports, and the
   downstream steps that turn a two-box diagram into the chain it really is. */

DB.enrich({

  /* --- fentanyl and its analogues -----------------------------------------
     Norfentanyl dominates by mass and is inactive, which is why fentanyl
     screens look for it. The hydroxy and amide-hydrolysis products were
     lumped into one prose row per compound; split out, they are what
     distinguishes one analogue from another in casework. */

  fentanyl: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis', product: 'Despropionylfentanyl (4-ANPP)', fraction: 0.05,
        note: 'Also a synthesis precursor, so finding it indicates illicit rather than pharmaceutical origin.' },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the propionyl chain', product: 'Hydroxyfentanyl', fraction: 0.04 },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of norfentanyl', product: 'Hydroxynorfentanyl',
        from: 'Norfentanyl', fraction: 0.03 }
    ],
    metabolites: [
      { name: 'Despropionylfentanyl (4-ANPP)', active: false, halfLifeH: 6 },
      { name: 'Hydroxyfentanyl', active: false, halfLifeH: 5 },
      { name: 'Hydroxynorfentanyl', active: false, halfLifeH: 6 }
    ]
  },

  acetylfentanyl: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxyacetylfentanyl', fraction: 0.08 }
    ],
    metabolites: [{ name: 'Hydroxyacetylfentanyl', active: true, halfLifeH: 4, potencyRel: 0.2 }]
  },

  furanylfentanyl: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Amide hydrolysis', product: '4-ANPP', fraction: 0.35 },
      { enzyme: 'CYP3A4', reaction: 'Dihydrodiol formation on the furan ring',
        product: 'Furanylfentanyl dihydrodiol', fraction: 0.1,
        note: 'Characteristic of the furan ring and the marker used to distinguish it from other analogues.' }
    ],
    metabolites: [
      { name: '4-ANPP', active: false, halfLifeH: 6 },
      { name: 'Furanylfentanyl dihydrodiol', active: false, halfLifeH: 5 }
    ]
  },

  ocfentanil: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation', product: 'Hydroxy-ocfentanil', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Hydroxy-ocfentanil', active: false, halfLifeH: 5 }]
  },

  carfentanil: {
    pathways: [
      { enzyme: 'CES / CYP3A4', reaction: 'Ester hydrolysis of the methyl ester',
        product: 'Carfentanil acid', fraction: 0.15,
        note: 'Inactive; the ester is what makes carfentanil as potent as it is.' }
    ],
    metabolites: [{ name: 'Carfentanil acid', active: false, halfLifeH: 4 }]
  },

  /* --- other opioids ------------------------------------------------------ */

  oxycodone: {
    pathways: [
      { enzyme: 'UGT2B7 / UGT2B4', reaction: 'Glucuronidation of the reduced metabolite',
        product: '6-Oxycodol glucuronide', from: '6-Oxycodol (α and β)', fraction: 0.04 }
    ],
    metabolites: [{ name: '6-Oxycodol glucuronide', active: false, halfLifeH: 6 }]
  },

  methadone: {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'Second cyclisation of EDDP',
        product: 'EMDP', from: 'EDDP', fraction: 0.08,
        note: 'The terminal pyrrolidine; inactive, and the last thing detectable after a methadone dose.' },
      { enzyme: 'Carbonyl reductase', reaction: 'Ketone reduction', product: 'Methadol', fraction: 0.03 }
    ],
    metabolites: [
      { name: 'EMDP', active: false, halfLifeH: 30 },
      { name: 'Methadol', active: true, halfLifeH: 20, potencyRel: 0.3,
        note: 'Weakly active; the same reduction that makes LAAM’s metabolites active.' }
    ]
  },

  hydrocodone: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Secondary O-demethylation of norhydrocodone',
        product: 'Norhydromorphone', from: 'Norhydrocodone', fraction: 0.05 }
    ],
    metabolites: [{ name: 'Norhydromorphone', active: true, halfLifeH: 8, potencyRel: 0.1 }]
  },

  mitragynine: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidative rearrangement of 7-hydroxymitragynine',
        product: 'Mitragynine pseudoindoxyl', from: '7-OH-mitragynine', fraction: 0.03,
        note: 'A minor route in vivo, but the product is far more potent at mu than either precursor.' }
    ]
  },

  /* Nitazenes converge on the same two routes — losing an N-ethyl and losing
     the ether alkyl — and both products are active. The nitro group is also
     reduced, which is the step the older literature on this family describes. */
  isotonitazene: {
    pathways: [
      { enzyme: 'Nitroreductase (gut flora and hepatic)', reaction: 'Nitro reduction',
        product: 'Amino-isotonitazene', fraction: 0.1 },
      { enzyme: 'CYP3A4', reaction: 'O-deisopropylation', product: 'O-desalkyl isotonitazene', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Amino-isotonitazene', active: false, halfLifeH: 8 },
      { name: 'O-desalkyl isotonitazene', active: true, halfLifeH: 6, potencyRel: 0.4 }
    ]
  },

  metonitazene: {
    pathways: [
      { enzyme: 'Nitroreductase (gut flora and hepatic)', reaction: 'Nitro reduction',
        product: 'Amino-metonitazene', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Amino-metonitazene', active: false, halfLifeH: 8 }]
  },

  protonitazene: {
    pathways: [
      { enzyme: 'Nitroreductase (gut flora and hepatic)', reaction: 'Nitro reduction',
        product: 'Amino-protonitazene', fraction: 0.1 }
    ],
    metabolites: [{ name: 'Amino-protonitazene', active: false, halfLifeH: 8 }]
  },

  brorphine: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Benzimidazolone ring hydroxylation', product: 'Hydroxybrorphine', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Hydroxybrorphine', active: false, halfLifeH: 6 }]
  },

  /* --- arylcyclohexylamines and other dissociatives -----------------------
     The pattern across the whole family is N-dealkylation to the "nor"
     compound, hydroxylation of the cyclohexyl ring, and then conjugation.
     Most entries had one of the three. */

  ketamine: {
    pathways: [
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'Hydroxylation of norketamine',
        product: 'Hydroxynorketamine', from: 'Norketamine', fraction: 0.2,
        note: 'The (2R,6R) isomer is the one under investigation as an antidepressant without dissociation.' },
      { enzyme: 'CYP2B6', reaction: 'Dehydrogenation of norketamine',
        product: 'Dehydronorketamine', from: 'Norketamine', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Hydroxynorketamine', active: true, halfLifeH: 7, potencyRel: 0.05,
        note: 'Essentially no NMDA antagonism, which is the point of the interest in it.' },
      { name: 'Dehydronorketamine', active: false, halfLifeH: 10 }
    ]
  },

  'o-pce': {
    pathways: [
      { enzyme: 'CYP3A4 / CYP2B6', reaction: 'Cyclohexyl ring hydroxylation', product: 'Hydroxy-O-PCE', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Hydroxy-O-PCE', active: false, halfLifeH: 6 }]
  },

  dck: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Cyclohexyl ring hydroxylation', product: 'Hydroxy-DCK', fraction: 0.2 },
      { enzyme: 'CYP2B6', reaction: 'Hydroxylation of nor-DCK', product: 'Hydroxy-nor-DCK',
        from: 'Nor-DCK', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Hydroxy-DCK', active: false, halfLifeH: 7 },
      { name: 'Hydroxy-nor-DCK', active: false, halfLifeH: 8 }
    ]
  },

  '2-fdck': {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Cyclohexyl ring hydroxylation', product: 'Hydroxy-2-FDCK', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Hydroxy-2-FDCK', active: false, halfLifeH: 7 }]
  },

  mxe: {
    pathways: [
      { enzyme: 'CYP2B6 / CYP3A4', reaction: 'Hydroxylation of the cyclohexyl ring',
        product: 'Hydroxy-MXE', fraction: 0.15 },
      { enzyme: 'CYP2D6', reaction: 'O-demethylation of normethoxetamine',
        product: 'Normetketamine', from: 'Normethoxetamine', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Hydroxy-MXE', active: false, halfLifeH: 6 },
      { name: 'Normetketamine', active: true, halfLifeH: 7, potencyRel: 0.2 }
    ]
  },

  '3-meo-pcp': {
    pathways: [
      { enzyme: 'CYP2B6', reaction: 'Hydroxylation of the desmethyl metabolite',
        product: 'Hydroxy-3-HO-PCP', from: '3-HO-PCP', fraction: 0.08 }
    ],
    metabolites: [{ name: 'Hydroxy-3-HO-PCP', active: false, halfLifeH: 6 }]
  },

  pcp: {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Second hydroxylation', product: 'PCP dihydroxy metabolite', fraction: 0.08 }
    ],
    metabolites: [{ name: 'PCP dihydroxy metabolite', active: false, halfLifeH: 8 }]
  },

  diphenidine: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Second aromatic hydroxylation',
        product: 'Dihydroxy-diphenidine', from: 'Hydroxy-diphenidine', fraction: 0.08 }
    ],
    metabolites: [{ name: 'Dihydroxy-diphenidine', active: false, halfLifeH: 5 }]
  },

  dxm: {
    pathways: [
      { enzyme: 'UGT2B15 / UGT1A1', reaction: 'Glucuronidation of 3-hydroxymorphinan',
        product: '3-Hydroxymorphinan glucuronide', from: '3-Hydroxymorphinan', fraction: 0.25,
        note: 'The terminal urinary product; the ratio it forms in is the classic CYP2D6 phenotyping probe.' }
    ],
    metabolites: [{ name: '3-Hydroxymorphinan glucuronide', active: false, halfLifeH: 5 }]
  },

  /* --- synthetic cannabinoids --------------------------------------------
     These are detected almost entirely as hydroxy and carboxy metabolites,
     because the parent is gone within hours. Several of the hydroxy products
     are themselves full CB1 agonists, which is a large part of why the class
     behaves so unpredictably. */

  'jwh-018': {
    pathways: [
      { enzyme: 'CYP2C9 / CYP3A4', reaction: 'Oxidation of the hydroxypentyl metabolite',
        product: 'JWH-018 N-pentanoic acid', from: 'ω-Hydroxy-JWH-018', fraction: 0.2,
        note: 'The main urinary marker for JWH-018 exposure.' }
    ],
    metabolites: [{ name: 'JWH-018 N-pentanoic acid', active: false, halfLifeH: 5 }]
  },

  'am-2201': {
    pathways: [
      { enzyme: 'CYP2C9', reaction: 'Oxidative defluorination', product: 'ω-Hydroxy-JWH-018', fraction: 0.25,
        note: 'AM-2201 defluorinates to a JWH-018 metabolite, which is why the two are hard to tell apart in urine.' }
    ],
    metabolites: [{ name: 'ω-Hydroxy-JWH-018', active: true, halfLifeH: 3, potencyRel: 0.8 }]
  },

  'xlr-11': {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidative defluorination', product: 'UR-144 N-pentanoic acid', fraction: 0.2 }
    ],
    metabolites: [{ name: 'UR-144 N-pentanoic acid', active: false, halfLifeH: 4 }]
  },

  '5f-mdmb-pica': {
    pathways: [
      { enzyme: 'CES1', reaction: 'Ester hydrolysis', product: '5F-MDMB-PICA butanoic acid', fraction: 0.35,
        note: 'The dominant route and the standard urinary marker; inactive.' }
    ],
    metabolites: [{ name: '5F-MDMB-PICA butanoic acid', active: false, halfLifeH: 5 }]
  },

  'mdmb-4en-pinaca': {
    pathways: [
      { enzyme: 'CES1', reaction: 'Ester hydrolysis', product: 'MDMB-4en-PINACA butanoic acid', fraction: 0.4 },
      { enzyme: 'CYP3A4', reaction: 'Hydroxylation of the pentenyl chain',
        product: 'Hydroxypentenyl-MDMB-4en-PINACA', fraction: 0.15 }
    ],
    metabolites: [
      { name: 'MDMB-4en-PINACA butanoic acid', active: false, halfLifeH: 5 },
      { name: 'Hydroxypentenyl-MDMB-4en-PINACA', active: true, halfLifeH: 3, potencyRel: 0.5 }
    ]
  },

  'adb-butinaca': {
    pathways: [
      { enzyme: 'Amidase / CES1', reaction: 'Amide hydrolysis', product: 'ADB-BUTINACA acid', fraction: 0.3 }
    ],
    metabolites: [{ name: 'ADB-BUTINACA acid', active: false, halfLifeH: 5 }]
  },

  'mdmb-chmica': {
    pathways: [
      { enzyme: 'CES1', reaction: 'Ester hydrolysis', product: 'MDMB-CHMICA acid', fraction: 0.35 }
    ],
    metabolites: [{ name: 'MDMB-CHMICA acid', active: false, halfLifeH: 5 }]
  },

  'ab-pinaca': {
    pathways: [
      { enzyme: 'Amidase / CES1', reaction: 'Amide hydrolysis', product: 'AB-PINACA acid', fraction: 0.3 }
    ],
    metabolites: [{ name: 'AB-PINACA acid', active: false, halfLifeH: 5 }]
  },

  'cumyl-pegaclone': {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'Oxidation of the hydroxypentyl metabolite',
        product: 'CUMYL-PEGACLONE pentanoic acid', from: 'Hydroxypentyl-CUMYL-PEGACLONE', fraction: 0.15 }
    ],
    metabolites: [{ name: 'CUMYL-PEGACLONE pentanoic acid', active: false, halfLifeH: 5 }]
  },

  /* --- semi-synthetic cannabinoids ---------------------------------------- */

  hhc: {
    pathways: [
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation of the 11-hydroxy metabolite',
        product: '11-nor-9-carboxy-HHC', from: '11-OH-HHC', fraction: 0.3,
        note: 'The reason HHC does not reliably show on a THC immunoassay: the carboxy metabolite differs.' }
    ],
    metabolites: [{ name: '11-nor-9-carboxy-HHC', active: false, halfLifeH: 30 }]
  },

  cbn: {
    pathways: [
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation of the 11-hydroxy metabolite',
        product: '11-nor-9-carboxy-CBN', from: '11-OH-CBN', fraction: 0.25 }
    ],
    metabolites: [{ name: '11-nor-9-carboxy-CBN', active: false, halfLifeH: 24 }]
  },

  thcp: {
    pathways: [
      { enzyme: 'ADH / ALDH', reaction: 'Oxidation of the 11-hydroxy metabolite',
        product: '11-nor-9-carboxy-THCP', from: '11-OH-THCP', fraction: 0.3 }
    ],
    metabolites: [{ name: '11-nor-9-carboxy-THCP', active: false, halfLifeH: 40 }]
  },

  /* --- tryptamines and phenethylamines ------------------------------------ */

  '5-meo-mipt': {
    pathways: [
      { enzyme: 'UGT / SULT', reaction: 'Conjugation of the O-demethylated metabolite',
        product: '5-HO-MiPT conjugates', from: '5-HO-MiPT', fraction: 0.25 }
    ],
    metabolites: [{ name: '5-HO-MiPT conjugates', active: false, halfLifeH: 5 }]
  },

  '5-meo-dipt': {
    pathways: [
      { enzyme: 'UGT / SULT', reaction: 'Conjugation of the O-demethylated metabolite',
        product: '5-HO-DiPT conjugates', from: '5-HO-DiPT', fraction: 0.25 }
    ],
    metabolites: [{ name: '5-HO-DiPT conjugates', active: false, halfLifeH: 5 }]
  },

  '25i-nbome': {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'O-demethylation of the second methoxy',
        product: 'Bis-O-desmethyl-25I-NBOMe', from: 'O-desmethyl-25I-NBOMe', fraction: 0.08 }
    ],
    metabolites: [{ name: 'Bis-O-desmethyl-25I-NBOMe', active: false, halfLifeH: 5 }]
  },

  '25c-nbome': {
    pathways: [
      { enzyme: 'CYP3A4', reaction: 'O-demethylation', product: 'O-desmethyl-25C-NBOMe', fraction: 0.3 },
      { enzyme: 'CYP1A2', reaction: 'N-debenzylation', product: '2C-C', fraction: 0.1,
        note: 'Loss of the benzyl group gives back the parent phenethylamine, which is far less potent.' }
    ],
    metabolites: [
      { name: 'O-desmethyl-25C-NBOMe', active: false, halfLifeH: 5 },
      { name: '2C-C', active: true, halfLifeH: 4, potencyRel: 0.05 }
    ]
  },

  methamphetamine: {
    pathways: [
      { enzyme: 'UGT / SULT', reaction: 'Conjugation of the 4-hydroxy metabolite',
        product: '4-Hydroxymethamphetamine conjugates', from: '4-Hydroxymethamphetamine', fraction: 0.12 }
    ],
    metabolites: [{ name: '4-Hydroxymethamphetamine conjugates', active: false, halfLifeH: 10 }]
  },

  /* --- pharmaceuticals with a thin block ---------------------------------- */

  promethazine: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'N-demethylation', product: 'Desmethylpromethazine', fraction: 0.15 }
    ],
    metabolites: [{ name: 'Desmethylpromethazine', active: true, halfLifeH: 12, potencyRel: 0.3 }]
  },

  scopolamine: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Glucuronidation of scopine', product: 'Scopine glucuronide',
        from: 'Scopine + tropic acid', fraction: 0.2 }
    ],
    metabolites: [{ name: 'Scopine glucuronide', active: false, halfLifeH: 4 }]
  },

  modafinil: {
    pathways: [
      { enzyme: 'UGT', reaction: 'Glucuronidation of modafinil acid', product: 'Modafinil acid glucuronide',
        from: 'Modafinil acid', fraction: 0.3,
        note: 'The dominant urinary product; modafinil acid itself is inactive.' }
    ],
    metabolites: [{ name: 'Modafinil acid glucuronide', active: false, halfLifeH: 8 }]
  },

  carbamazepine: {
    pathways: [
      { enzyme: 'Epoxide hydrolase', reaction: 'Hydrolysis of the epoxide',
        product: 'Carbamazepine-10,11-diol', from: 'Carbamazepine-10,11-epoxide', fraction: 0.4,
        note: 'Inactive. Valproate inhibits this step, which is how it raises the active epoxide.' }
    ],
    metabolites: [{ name: 'Carbamazepine-10,11-diol', active: false, halfLifeH: 12 }]
  },

  trazodone: {
    pathways: [
      { enzyme: 'CYP2D6', reaction: 'Hydroxylation of mCPP', product: 'Hydroxy-mCPP',
        from: 'mCPP (meta-chlorophenylpiperazine)', fraction: 0.1,
        note: 'CYP2D6 poor metabolisers accumulate mCPP, which is the anxiogenic part of trazodone.' }
    ],
    metabolites: [{ name: 'Hydroxy-mCPP', active: false, halfLifeH: 5 }]
  }

});
/* ---------- 2. Phase II: one row, every conjugate behind it ---------------
   Ninety-one entries ended their pathway list with a row reading "Conjugates"
   — a placeholder, not a finding. It said a conjugation step happens without
   saying what comes out of it, which is the half of the answer a toxicology
   report is actually about.

   This pass replaces every one of them with a named row that stands for a
   derived list: the glucuronide of the parent where the parent has something
   to conjugate, plus the glucuronide of each hydroxylated metabolite the
   entry records, plus sulfates where sulfation is a major route for that
   class. The row is one box in the diagram and opens the full list on click.

   THE LISTS ARE DERIVED, AND THE UI SAYS SO. This is mechanical chemistry —
   you conjugate the hydroxyls — not a claim that each named conjugate has
   been individually reported in the literature. Where a specific conjugate IS
   attested, the entry names it as its own product and this pass leaves it
   alone. And where a conjugate is pharmacologically active, it is never
   folded in: morphine-6-glucuronide is more potent than morphine and stays a
   product in its own right.

   Deriving beats typing. Ninety-one hand-written lists would have been
   ninety-one chances to omit one, and adding a hydroxy metabolite later would
   have silently left its conjugate out.
   ------------------------------------------------------------------------ */

(function () {
  'use strict';

  // The placeholder names in use across the data files.
  var VAGUE = /^(inactive\s+)?(conjugates|conjugated metabolites|glucuronide and sulfate conjugates|glucuronides)$/i;

  // Classes where sulfation is a major route alongside glucuronidation.
  var SULFATES = { Opioid: 1, Psychedelic: 1, Entactogen: 1, Stimulant: 1, 'OTC medicine': 1 };

  // ...but only for a metabolite that actually looks phenolic. Sulfation is a
  // reaction on an AROMATIC hydroxyl, and a ring-position prefix is the best
  // available signal for one: "4-hydroxymethamphetamine" and "3-hydroxymorphinan"
  // are phenols and are sulfated, while fentanyl's aliphatic "hydroxyfentanyl"
  // is not. Listing a sulfate for the latter would be inventing a metabolite.
  var PHENOLIC = /^\d+[-,]|phenol|catechol|(^|[^a-z])\d+-oh|-oh-\d/i;

  // A metabolite bearing a hydroxyl is the thing that gets conjugated. Both
  // spellings are in use across the data files — "11-OH-THC" and
  // "11-hydroxy-THC" are the same functional group.
  var HYDROXYL = /hydroxy|(^|[^a-z])oh([^a-z]|$)|(^|[^a-z])[a-z]*ol($|[^a-z])|phenol|catechol|desmethyl|desalkyl|desethyl|nor-?[a-z]/i;
  // ...unless it is already a conjugate, an acid, or a placeholder itself.
  var NOT_CONJUGATABLE = /glucuronide|sulfate|sulphate|conjugat|acid$|unchanged|excret/i;

  // Compounds with a basic amine can be N-glucuronidated as the parent, with
  // no phase I step first.
  var N_GLUC_CLASS = {
    Depressant: 1, Opioid: 1, Dissociative: 1, Psychedelic: 1,
    Entactogen: 1, Stimulant: 1, Antidepressant: 1, Antipsychotic: 1
  };

  function conjugatesFor(d) {
    var out = [];
    var sulfate = !!SULFATES[d.class];

    if (N_GLUC_CLASS[d.class]) out.push(d.name + ' N-glucuronide');

    d.metabolism.metabolites.forEach(function (m) {
      var n = String(m.name);
      if (NOT_CONJUGATABLE.test(n)) return;
      if (!HYDROXYL.test(n)) return;
      // An active conjugate is a drug, not an excretion product, and belongs
      // on the diagram under its own name.
      if (m.active && /glucuronide|sulfate/i.test(n)) return;
      out.push(n + ' glucuronide');
      if (sulfate && PHENOLIC.test(n)) out.push(n + ' sulfate');
    });

    return DB.uniq(out);
  }

  var NOTE =
    'Terminal excretion products: water-soluble, pharmacologically inactive, and cleared renally. ' +
    'They decide what a urine screen finds and for how long, not how the drug feels. This list is ' +
    'derived — the glucuronide, and where sulfation matters for this class the sulfate, of the parent ' +
    'and of each hydroxylated metabolite recorded above. It is the expected chemistry rather than a ' +
    'claim that every one has been individually reported.';

  var renamed = 0;

  DB.all().forEach(function (d) {
    if (d.formedInVivo) return;
    var m = d.metabolism;

    m.pathways.forEach(function (p) {
      (p.products || []).forEach(function (prod) {
        if (prod.covers || !VAGUE.test(prod.name)) return;

        var covers = conjugatesFor(d);
        if (!covers.length) {
          // Nothing recorded that could be conjugated. Name the step for what
          // it is rather than leaving "Conjugates" standing.
          prod.name = 'Inactive conjugates';
          prod.active = false;
          prod.note = prod.note ||
            'A conjugation step is recorded but the products are not. That is a gap in this database, ' +
            'not a finding that nothing is formed.';
          return;
        }

        prod.name = 'Inactive conjugates';
        prod.active = false;
        prod.covers = covers;
        prod.note = prod.note || NOTE;
        renamed++;
      });

      // The row's display string is built from its products, so it has to be
      // rebuilt after any rename.
      if (p.products && p.products.length) {
        p.product = p.products.map(function (x) { return x.name; }).join(' / ');
      }
    });

    // Give the metabolite list the same row, so the conjugates are not
    // missing from the model's breakdown just because they were nameless.
    var already = m.metabolites.some(function (x) { return /^inactive conjugates$/i.test(x.name); });
    var hasRow = m.pathways.some(function (p) {
      return (p.products || []).some(function (x) { return /^inactive conjugates$/i.test(x.name); });
    });
    if (hasRow && !already) {
      m.metabolites.push({
        name: 'Inactive conjugates', active: false,
        halfLifeH: Math.max(2, Math.min(24, d.halfLife.hours)),
        note: 'Grouped excretion products — see the pathway diagram for what the row stands for.'
      });
    }
  });

  if (typeof console !== 'undefined' && console.debug) {
    console.debug('metabolites-extra: named ' + renamed + ' conjugation rows');
  }
})();

/* ---------- 3. Benzodiazepine conjugates, named more precisely ------------
   The generic pass above covers the whole database. Benzodiazepines get a
   second, tighter pass because their chemistry is uniform enough to name the
   products exactly: the parent is N-glucuronidated and each hydroxylated
   metabolite is O-glucuronidated, with no sulfation worth recording. */

(function () {
  'use strict';

  var isBenzo = function (d) {
    return (d.tags || []).indexOf('benzodiazepine') >= 0 ||
           /benzodiazepine|thienodiazepine/i.test(d.family || '');
  };

  DB.all().filter(isBenzo).forEach(function (d) {
    var m = d.metabolism;

    var covers = [d.name + ' N-glucuronide'];
    m.metabolites.forEach(function (mm) {
      if (/hydroxy/i.test(mm.name) && !/glucuronide/i.test(mm.name)) {
        covers.push(mm.name + ' glucuronide');
      }
    });
    if (covers.length < 2) return;

    var conj = null;
    m.pathways.forEach(function (p) {
      if (!/UGT/i.test(p.enzyme || '')) return;
      (p.products || []).forEach(function (prod) {
        if (!conj && (/^inactive conjugates$/i.test(prod.name) || /glucuronide/i.test(prod.name))) conj = prod;
      });
    });

    if (!conj) {
      m.pathways.push({
        enzyme: 'UGT2B15 / UGT1A4', reaction: 'Glucuronidation',
        products: [{ name: 'Inactive glucuronides', fraction: 0.3, active: false, covers: covers }],
        product: 'Inactive glucuronides', fraction: 0.3
      });
      return;
    }

    conj.name = 'Inactive glucuronides';
    conj.active = false;
    conj.covers = covers;
    conj.note =
      'Terminal excretion products. Water-soluble, pharmacologically inactive, and cleared renally — ' +
      'they decide what a urine screen finds and for how long, not how the drug feels.';
  });

  DB.all().filter(isBenzo).forEach(function (d) {
    d.metabolism.pathways.forEach(function (p) {
      if (p.products && p.products.length) {
        p.product = p.products.map(function (x) { return x.name; }).join(' / ');
      }
    });
  });
})();

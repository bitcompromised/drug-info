/* Inactive ingredients — excipients, bulking agents, cutting agents and fillers.
   These are pharmacologically inert at the amounts used, but they occupy mass
   and volume in a mixture, which is exactly what the solution calculator needs
   to account for. `inactive: true` keeps them out of the active-mass maths. */
DB.register([

{
  id: 'sucrose', name: 'Sugar (sucrose)', aliases: ['sugar', 'table sugar', 'caster sugar'],
  class: 'Inactive ingredient', family: 'Disaccharide', schedule: 'Food',
  inactive: true,
  tags: ['inactive', 'bulking-agent', 'sweetener', 'non-psychoactive'],
  density: 1.59,
  mechanism: 'Pharmacologically inert as an excipient. Used as a bulking agent, sweetener and — in illicit supply — as a cutting agent, since it is cheap, white and crystalline.',
  halfLife: { hours: 0.5, range: [0.2, 1], confidence: 'measured',
    notes: 'Hydrolysed to glucose and fructose within minutes of reaching the small intestine.' },
  metabolism: {
    pathways: [
      { enzyme: 'Sucrase-isomaltase', reaction: 'Hydrolysis in the intestinal brush border', product: 'Glucose + fructose', fraction: 1.0,
        note: 'Complete and rapid. Both products enter normal carbohydrate metabolism.' }
    ],
    metabolites: [
      { name: 'Glucose', active: false, halfLifeH: 0.5, fraction: 1.0, note: 'Normal metabolic fuel.' },
      { name: 'Fructose', active: false, halfLifeH: 0.5, fraction: 1.0, note: 'Metabolised in the liver.' }
    ],
    substrateOf: [], excretion: 'Fully metabolised; nothing excreted intact.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [5, 20], peakMin: [20, 45], durationH: [1, 2], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 500, light: [1000, 5000], common: [5000, 20000], strong: [20000, 50000], heavy: 50000, unit: 'mg',
        note: 'There is no meaningful "dose" — the tiers exist only so the calculator can rank it. Treat these as bulk quantities.' } }
  },
  warnings: [
    'Inert, but as a cutting agent its presence means the active is more dilute than the total weight suggests — never assume a powder is pure.',
    'Sucrose is hygroscopic and cakes with moisture, which makes an unevenly mixed powder blend even less even.'
  ],
  sources: ['Standard food chemistry']
},

{
  id: 'lactose', name: 'Lactose', aliases: ['milk sugar', 'lactose monohydrate'],
  class: 'Inactive ingredient', family: 'Disaccharide', schedule: 'Pharmaceutical excipient',
  inactive: true,
  tags: ['inactive', 'bulking-agent', 'excipient', 'non-psychoactive'],
  density: 1.53,
  mechanism: 'The most widely used pharmaceutical tablet filler and the classic cutting agent for illicit powders — it is cheap, white, free-flowing and tastes faintly sweet.',
  halfLife: { hours: 0.5, range: [0.2, 1], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Lactase (LCT)', reaction: 'Hydrolysis in the intestinal brush border', product: 'Glucose + galactose', fraction: 0.95,
        note: 'In lactase-deficient adults — the global majority — it passes undigested to the colon and is fermented by bacteria instead, causing bloating, cramps and diarrhoea.' },
      { enzyme: 'Colonic bacterial fermentation', reaction: 'Fermentation of undigested lactose', product: 'Short-chain fatty acids + gases', fraction: 0.05 }
    ],
    metabolites: [
      { name: 'Glucose', active: false, halfLifeH: 0.5, fraction: 0.95 },
      { name: 'Galactose', active: false, halfLifeH: 0.5, fraction: 0.95 }
    ],
    substrateOf: [], excretion: 'Fully metabolised or fermented.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [30, 60], durationH: [1, 3], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 500, light: [1000, 5000], common: [5000, 20000], strong: [20000, 50000], heavy: 50000, unit: 'mg' } }
  },
  warnings: [
    'Lactose intolerance is the norm in most of the world\'s population — a lactose-cut powder causes cramps and diarrhoea that are easily mistaken for the drug\'s own effects.',
    'Not suitable as a solution excipient: it is far less soluble in water than sucrose and will settle out.'
  ],
  sources: ['Pharmaceutical excipient handbooks']
},

{
  id: 'flour', name: 'Flour', aliases: ['wheat flour', 'plain flour'],
  class: 'Inactive ingredient', family: 'Starch mixture', schedule: 'Food',
  inactive: true,
  tags: ['inactive', 'bulking-agent', 'insoluble', 'non-psychoactive'],
  density: 0.59,
  mechanism: 'Milled wheat, mostly starch with some protein. Inert, but notable here for being INSOLUBLE — it does not dissolve, it suspends, which makes it entirely unsuitable for a solution.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'Salivary and pancreatic amylase', reaction: 'Hydrolysis of starch', product: 'Maltose and dextrins', fraction: 0.8 },
      { enzyme: 'Maltase-glucoamylase', reaction: 'Further hydrolysis', product: 'Glucose', fraction: 0.8 }
    ],
    metabolites: [{ name: 'Glucose', active: false, halfLifeH: 0.5, fraction: 0.8 }],
    substrateOf: [], excretion: 'Fully metabolised; insoluble fibre passes through.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 120], durationH: [2, 4], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 500, light: [1000, 5000], common: [5000, 20000], strong: [20000, 50000], heavy: 50000, unit: 'mg' } }
  },
  warnings: [
    'INSOLUBLE. Adding flour to a solution produces a suspension that settles, so every dose drawn contains a different amount of drug. Never use it as a solution excipient.',
    'As a cutting agent it is detectable by the cloudiness it produces in water — a crude but useful purity check.',
    'Contains gluten; relevant for coeliac disease.'
  ],
  sources: ['Standard food chemistry']
},

{
  id: 'chocolate', name: 'Chocolate', aliases: ['cocoa', 'dark chocolate'],
  class: 'Inactive ingredient', family: 'Cocoa product', schedule: 'Food',
  inactive: true,
  tags: ['inactive', 'bulking-agent', 'contains-xanthines', 'non-psychoactive'],
  density: 1.1,
  mechanism: 'Used as a flavouring and masking agent. Not truly inert — it contains theobromine and a little caffeine, so a large amount contributes a genuine, if mild, stimulant load. It is also fatty, which alters absorption of anything lipophilic taken with it.',
  halfLife: { hours: 7, range: [6, 10], confidence: 'measured',
    notes: 'Reflecting its theobromine content, which is the longest-lived pharmacologically relevant component.' },
  metabolism: {
    pathways: [
      { enzyme: 'CYP1A2 / CYP2E1', reaction: 'Demethylation of theobromine', product: '3- and 7-methylxanthine', fraction: 0.6,
        note: 'Dark chocolate contains roughly 5-8 mg theobromine per gram, so 100 g delivers a real xanthine dose.' },
      { enzyme: 'Lipase', reaction: 'Hydrolysis of cocoa butter', product: 'Fatty acids + glycerol', fraction: 0.9 }
    ],
    metabolites: [
      { name: 'Theobromine', active: true, halfLifeH: 7.2, potencyRel: 0.05, fraction: 0.6,
        note: 'Mild adenosine antagonist and vasodilator. Adds to any other xanthine taken alongside.' },
      { name: 'Caffeine', active: true, halfLifeH: 5, potencyRel: 0.2, fraction: 0.05, note: 'Present in small amounts.' }
    ],
    substrateOf: ['CYP1A2'], excretion: 'Renal for the xanthines; the rest is metabolised as food.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [20, 60], peakMin: [60, 180], durationH: [4, 8], afterEffectsH: [2, 8], bioavailability: 0.9,
      doses: { threshold: 1000, light: [5000, 20000], common: [20000, 50000], strong: [50000, 100000], heavy: 100000, unit: 'mg' } }
  },
  warnings: [
    'Not strictly inactive — 100 g of dark chocolate contains 500-800 mg of theobromine, which is a real if mild stimulant load and adds to caffeine.',
    'Its fat content increases absorption of lipophilic drugs (cannabinoids especially), so an edible made with chocolate can hit harder than the same dose in a low-fat base.',
    'Toxic to dogs and cats.'
  ],
  sources: ['Standard food chemistry', 'Martinez-Pinilla et al. 2015, Front Pharmacol']
},

{
  id: 'mcc', name: 'Microcrystalline cellulose', aliases: ['mcc', 'avicel', 'cellulose'],
  class: 'Inactive ingredient', family: 'Polysaccharide', schedule: 'Pharmaceutical excipient',
  inactive: true,
  tags: ['inactive', 'bulking-agent', 'excipient', 'insoluble', 'non-psychoactive', 'not-absorbed'],
  density: 1.5,
  mechanism: 'The standard tablet filler and binder in modern pharmaceutical manufacturing, and the usual bulking agent for accurately dosing very potent powders by weight. Completely unabsorbed — it passes through as insoluble fibre.',
  halfLife: { hours: 0, confidence: 'measured', notes: 'Not absorbed at all, so it has no half-life in the pharmacokinetic sense.' },
  metabolism: {
    pathways: [
      { enzyme: 'None (not digestible)', reaction: 'Passes through unchanged', product: 'Unchanged cellulose', fraction: 1.0,
        note: 'Humans lack cellulase. It is inert dietary fibre and is not absorbed to any degree.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Not metabolised or absorbed.' }],
    substrateOf: [], excretion: 'Faecal, entirely unchanged.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0,
      doses: { threshold: 50, light: [100, 500], common: [500, 2000], strong: [2000, 10000], heavy: 10000, unit: 'mg' } }
  },
  warnings: [
    'The safest bulking agent for weighing out potent powders — it is inert, unabsorbed and free-flowing. This is the correct choice for making a weighable dilution of something active in micrograms.',
    'INSOLUBLE, so it is right for powder dilutions and wrong for solutions.',
    'Never inject anything containing cellulose — insoluble particles cause pulmonary granulomas and vascular occlusion.'
  ],
  sources: ['Pharmaceutical excipient handbooks']
},

{
  id: 'citric-acid', name: 'Citric acid', aliases: ['citrate'],
  class: 'Inactive ingredient', family: 'Organic acid', schedule: 'Food / excipient',
  inactive: true,
  tags: ['inactive', 'excipient', 'acidifier', 'solubiliser', 'non-psychoactive'],
  density: 1.66,
  mechanism: 'A food acid and pharmaceutical excipient. Genuinely useful in this context: it converts poorly soluble freebases into soluble salts in situ, which is how it is used to dissolve base-form compounds in water.',
  halfLife: { hours: 0.5, range: [0.2, 1], confidence: 'measured' },
  metabolism: {
    pathways: [
      { enzyme: 'Citrate synthase / Krebs cycle', reaction: 'Enters the citric acid cycle directly', product: 'CO2 + water + ATP', fraction: 1.0,
        note: 'It is a normal metabolic intermediate — the body makes and consumes it continuously.' }
    ],
    metabolites: [{ name: 'CO2', active: false, note: 'Exhaled.' }],
    substrateOf: [], excretion: 'Fully metabolised; excess citrate renally.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [5, 20], peakMin: [20, 45], durationH: [0.5, 2], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 50, light: [100, 500], common: [500, 2000], strong: [2000, 5000], heavy: 5000, unit: 'mg' } }
  },
  warnings: [
    'Used to dissolve freebase compounds in water. Use the minimum needed — excess acid is harsh on mucous membranes and, if injected, causes vein damage and pain.',
    'Acidifies urine, which speeds clearance of amphetamines and other basic drugs.',
    'Erodes tooth enamel with repeated oral use.'
  ],
  sources: ['Pharmaceutical excipient handbooks']
},

{
  id: 'gelatin', name: 'Gelatin', aliases: ['gelatine', 'capsule shell'],
  class: 'Inactive ingredient', family: 'Protein', schedule: 'Pharmaceutical excipient',
  inactive: true,
  tags: ['inactive', 'excipient', 'capsule', 'non-psychoactive'],
  density: 1.35,
  mechanism: 'Hydrolysed collagen, used almost universally for capsule shells. Inert; it simply dissolves in the stomach to release the contents.',
  halfLife: { hours: 1, range: [0.5, 2], confidence: 'estimated' },
  metabolism: {
    pathways: [
      { enzyme: 'Pepsin / pancreatic proteases', reaction: 'Proteolysis', product: 'Amino acids and peptides', fraction: 1.0,
        note: 'Digested as ordinary dietary protein.' }
    ],
    metabolites: [{ name: 'Amino acids', active: false, fraction: 1.0 }],
    substrateOf: [], excretion: 'Fully metabolised.', confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [5, 30], peakMin: [15, 45], durationH: [0.5, 2], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 20, light: [50, 100], common: [100, 200], strong: [200, 500], heavy: 500, unit: 'mg' } }
  },
  warnings: [
    'A size 0 capsule holds roughly 500 mg of powder and weighs about 96 mg empty — worth knowing when weighing a filled capsule.',
    'Animal-derived; vegetarian capsules use HPMC instead.'
  ],
  sources: ['Pharmaceutical excipient handbooks']
},

{
  id: 'sodium-chloride', name: 'Salt (sodium chloride)', aliases: ['salt', 'nacl', 'saline'],
  class: 'Inactive ingredient', family: 'Inorganic salt', schedule: 'Food / excipient',
  inactive: true,
  tags: ['inactive', 'excipient', 'electrolyte', 'tonicity-agent', 'non-psychoactive'],
  density: 2.16,
  mechanism: 'Used to make a solution isotonic with body fluids — 0.9% w/v is physiological saline. Relevant for anything intended for nasal or parenteral use, where a badly hypotonic or hypertonic solution stings and damages tissue.',
  halfLife: { hours: 24, range: [12, 48], confidence: 'measured', notes: 'As sodium turnover; governed by renal handling and hydration.' },
  metabolism: {
    pathways: [
      { enzyme: 'None (electrolyte)', reaction: 'Dissociates to sodium and chloride ions', product: 'Na+ and Cl-', fraction: 1.0,
        note: 'Not metabolised. Handled entirely by renal and hormonal regulation.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Electrolyte; not metabolised.' }],
    substrateOf: [], excretion: 'Renal.', confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [30, 90], durationH: [4, 12], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 100, light: [500, 1000], common: [1000, 3000], strong: [3000, 6000], heavy: 6000, unit: 'mg' } }
  },
  warnings: [
    'For a nasal or injectable solution, isotonicity matters: 0.9 g per 100 ml is physiological. Plain water stings badly in the nose and damages the mucosa over time.',
    'Relevant to MDMA specifically — hyponatraemia from drinking plain water while vasopressin is elevated has killed people, and electrolyte replacement is the mitigation.'
  ],
  sources: ['Pharmaceutical excipient handbooks']
},

/* ==========================================================================
   Tablet, capsule and oral-liquid excipients
   --------------------------------------------------------------------------
   The ingredients that appear under "inactive ingredients" on a real product
   label. Included so a tablet or syrup can be entered into the solution
   calculator as it actually is, rather than as if it were pure active.

   Most are genuinely inert at the amounts used. Three are not, and are the
   reason this section is worth having: sodium metabisulfite triggers
   bronchospasm in sulfite-sensitive asthmatics, docusate sodium is a
   therapeutic laxative in its own right, and sodium lauryl sulfate is a
   mucosal irritant. Each is flagged in its warnings.
   ========================================================================== */

{
  id: 'dc-red-33', name: 'D&C Red No. 33', aliases: ['acid red 33', 'ci 17200', 'd&c red 33'],
  class: 'Inactive ingredient', family: 'Azo dye', schedule: 'Approved colourant',
  cas: '3567-66-6', formula: 'C16H11N2Na2O7S2',
  inactive: true,
  tags: ['inactive', 'colourant', 'dye', 'non-psychoactive'],
  density: 1.5,
  mechanism: 'A synthetic azo dye used to colour capsules, tablet coatings and oral liquids pink to magenta. Pharmacologically inert; present in microgram to low-milligram amounts per unit.',
  halfLife: { hours: 3, range: [2, 6], confidence: 'estimated',
    notes: 'Poorly absorbed. Most of an oral dose is cleaved by gut flora rather than absorbed intact, so the systemic half-life is largely academic.' },
  metabolism: {
    firstPass: 'Minimal absorption — the great majority never enters the circulation.',
    pathways: [
      { enzyme: 'Colonic bacterial azoreductase', reaction: 'Reductive cleavage of the azo bond', product: 'Aromatic amine fragments', fraction: 0.85,
        note: 'The general fate of azo dyes: gut bacteria split the N=N bond and the fragments are absorbed, conjugated and excreted.' },
      { enzyme: 'NAT1 / NAT2', reaction: 'N-acetylation of the amine fragments', product: 'Acetylated amines', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Aromatic amine fragments', active: false, halfLifeH: 4, fraction: 0.85, note: 'Conjugated and excreted renally.' }
    ],
    substrateOf: ['NAT1', 'NAT2'],
    excretion: 'Mostly faecal as unabsorbed dye and cleavage products; a minor renal fraction as conjugates.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.05,
      doses: { threshold: 0.05, light: [0.1, 0.5], common: [0.5, 2], strong: [2, 10], heavy: 10, unit: 'mg',
        note: 'No meaningful dose — the tiers exist only so the calculator can rank it. A coloured tablet carries well under 1 mg.' } }
  },
  warnings: [
    'Azo dyes are a recognised, if uncommon, cause of urticaria and pseudo-allergic reactions in sensitive people.',
    'Colours urine and stool pink at higher amounts — harmless, but alarming if unexpected.'
  ],
  sources: ['21 CFR 74.1333', 'JECFA colourant monographs']
},

{
  id: 'fdc-blue-1', name: 'FD&C Blue No. 1', aliases: ['brilliant blue fcf', 'e133', 'ci 42090', 'fd&c blue 1'],
  class: 'Inactive ingredient', family: 'Triarylmethane dye', schedule: 'Approved colourant',
  cas: '3844-45-9', formula: 'C37H34N2Na2O9S3',
  inactive: true,
  tags: ['inactive', 'colourant', 'dye', 'non-psychoactive'],
  density: 1.5,
  mechanism: 'The standard blue colourant for capsules, coated tablets and oral liquids. Very poorly absorbed — under 5% of an oral dose crosses the gut wall, and what does is excreted unchanged.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'estimated' },
  metabolism: {
    firstPass: 'Essentially none — it is not meaningfully absorbed.',
    pathways: [
      { enzyme: 'None (not metabolised)', reaction: 'Passes through the gut unchanged', product: 'Unchanged dye', fraction: 0.95,
        note: 'Unusually stable for a food dye: neither cleaved by gut flora nor conjugated to any real extent.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Excreted intact.' }],
    substrateOf: [],
    excretion: 'Faecal, almost entirely unchanged; a small absorbed fraction appears in bile.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.02,
      doses: { threshold: 0.05, light: [0.1, 0.5], common: [0.5, 3], strong: [3, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'Colours stool green or blue-green at higher amounts. Harmless, but a common cause of alarmed phone calls.',
    'Systemic absorption through damaged gut has caused blue discoloration and, rarely, serious reactions — relevant to hospital enteral feeding, not to tablets.'
  ],
  sources: ['21 CFR 74.101', 'EFSA re-evaluation of Brilliant Blue FCF (E133), 2010']
},

{
  id: 'fdc-blue-2-lake', name: 'FD&C Blue No. 2 aluminium lake', aliases: ['indigotine lake', 'indigo carmine lake', 'fd&c blue 2 aluminum lake', 'fd&c blue no 2 aluminum lake'],
  class: 'Inactive ingredient', family: 'Indigoid dye (lake pigment)', schedule: 'Approved colourant',
  cas: '860-22-0', formula: 'C16H8N2Na2O8S2',
  inactive: true,
  tags: ['inactive', 'colourant', 'dye', 'insoluble', 'non-psychoactive'],
  density: 1.7,
  mechanism: 'A "lake" is a water-soluble dye precipitated onto aluminium hydroxide to make it INSOLUBLE. That is the whole point: lakes colour by dispersion rather than by dissolving, so they do not bleed in a tablet coating or a suspension.',
  halfLife: { hours: 1, range: [0.5, 2], confidence: 'estimated',
    notes: 'For the indigo carmine that would be released. The lake itself is not absorbed at all.' },
  metabolism: {
    firstPass: 'Not absorbed as the lake. Any dye that dissociates is cleared very rapidly.',
    pathways: [
      { enzyme: 'None (insoluble pigment)', reaction: 'Passes through undissolved', product: 'Unchanged lake pigment', fraction: 0.95 },
      { enzyme: 'Tissue reductases', reaction: 'Reduction of dissociated indigo carmine', product: 'Isatin sulfonic acid', fraction: 0.05 }
    ],
    metabolites: [{ name: 'Isatin sulfonic acid', active: false, halfLifeH: 1, fraction: 0.05,
      note: 'Renally excreted — the reason intravenous indigo carmine is used to visualise ureters in surgery.' }],
    substrateOf: [],
    excretion: 'Faecal as undissolved pigment.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.01,
      doses: { threshold: 0.05, light: [0.1, 0.5], common: [0.5, 3], strong: [3, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'INSOLUBLE by design. A lake pigment never dissolves — it disperses and then settles, so a tablet crushed into a liquid leaves visible coloured sediment.',
    'Contains aluminium as the substrate. Irrelevant at excipient amounts, but the reason lakes are avoided in products for people with renal failure.',
    'Never inject anything containing a lake pigment — insoluble particles occlude small vessels.'
  ],
  sources: ['21 CFR 74.102', 'Pharmaceutical excipient handbooks']
},

{
  id: 'dc-yellow-10', name: 'D&C Yellow No. 10', aliases: ['quinoline yellow ws', 'e104', 'ci 47005', 'd&c yellow 10', 'd&c yellow no 10'],
  class: 'Inactive ingredient', family: 'Quinophthalone dye', schedule: 'Approved colourant',
  cas: '8004-92-0', formula: 'C18H9NNa2O8S2',
  inactive: true,
  tags: ['inactive', 'colourant', 'dye', 'non-psychoactive'],
  density: 1.5,
  mechanism: 'A greenish-yellow dye used in capsule shells, tablet coatings and syrups. Poorly absorbed and rapidly excreted.',
  halfLife: { hours: 2, range: [1, 5], confidence: 'estimated' },
  metabolism: {
    firstPass: 'Minimal — poorly absorbed from the gut.',
    pathways: [
      { enzyme: 'None (largely unabsorbed)', reaction: 'Passes through the gut', product: 'Unchanged dye', fraction: 0.9 },
      { enzyme: 'UGT', reaction: 'Glucuronidation of the absorbed fraction', product: 'Dye glucuronide', fraction: 0.05 }
    ],
    metabolites: [{ name: 'Dye glucuronide', active: false, halfLifeH: 2, fraction: 0.05 }],
    substrateOf: ['UGT'],
    excretion: 'Predominantly faecal; a small renal fraction as conjugates.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.05,
      doses: { threshold: 0.05, light: [0.1, 0.5], common: [0.5, 3], strong: [3, 15], heavy: 15, unit: 'mg' } }
  },
  warnings: [
    'One of the "Southampton six" dyes linked in a 2007 UK study to increased hyperactivity in children; EU products containing it carry a warning label.',
    'Occasionally implicated in urticaria in aspirin-sensitive people.'
  ],
  sources: ['21 CFR 74.1710', 'EFSA re-evaluation of Quinoline Yellow (E104), 2009']
},

{
  id: 'edetate-disodium', name: 'Edetate disodium', aliases: ['disodium edta', 'edta disodium', 'edetate', 'edta', 'edetate disodium dihydrate'],
  class: 'Inactive ingredient', family: 'Aminopolycarboxylic acid', schedule: 'Pharmaceutical excipient',
  cas: '139-33-3', formula: 'C10H14N2Na2O8',
  inactive: true,
  tags: ['inactive', 'excipient', 'chelator', 'non-psychoactive'],
  density: 1.5,
  mechanism: 'A chelating agent. It binds trace metal ions — iron, copper, calcium — that would otherwise catalyse oxidation of the active ingredient, so it protects the formulation rather than doing anything in the body. It also potentiates preservatives by disrupting bacterial cell walls.',
  halfLife: { hours: 1.5, range: [1, 2], confidence: 'measured',
    notes: 'For the small absorbed fraction. Oral bioavailability is only about 5%.' },
  metabolism: {
    firstPass: 'Barely absorbed orally (~5%); what is absorbed is not metabolised at all.',
    pathways: [
      { enzyme: 'None (not metabolised)', reaction: 'Circulates as metal chelates and is filtered by the kidney', product: 'Unchanged EDTA and its metal complexes', fraction: 1.0,
        note: 'Chemically inert in the body. Its entire disposition is distribution and renal filtration.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Excreted intact, with whatever metal it has bound.' }],
    substrateOf: [],
    excretion: 'Renal, essentially 100% unchanged by glomerular filtration.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.05,
      doses: { threshold: 0.1, light: [0.5, 2], common: [2, 20], strong: [20, 100], heavy: 100, unit: 'mg',
        note: 'Typically 0.01-0.1% w/v of a liquid formulation — a few milligrams per dose at most.' } }
  },
  warnings: [
    'At excipient amounts it is inert. Chelation-therapy warnings do not apply — those involve gram doses given intravenously.',
    'Edetate DISODIUM and edetate CALCIUM disodium are different drugs and have been fatally confused in clinical settings: the disodium form given intravenously chelates serum calcium and causes fatal hypocalcaemia. This concerns injectables only, never an oral excipient.',
    'Worth knowing it is present: it is what keeps an oxidation-prone active from degrading, so a formulation without it has a shorter shelf life.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'FDA inactive ingredient database']
},

{
  id: 'methylparaben', name: 'Methylparaben', aliases: ['methyl paraben', 'methyl 4-hydroxybenzoate', 'e218', 'nipagin'],
  class: 'Inactive ingredient', family: 'Paraben ester', schedule: 'Pharmaceutical excipient',
  cas: '99-76-3', formula: 'C8H8O3',
  inactive: true,
  tags: ['inactive', 'excipient', 'preservative', 'antimicrobial', 'non-psychoactive'],
  density: 1.46,
  mechanism: 'The most widely used antimicrobial preservative in oral liquids and creams — it stops mould and bacteria growing in a water-containing formulation. Almost always paired with propylparaben, because the two together cover a broader spectrum than either alone.',
  halfLife: { hours: 1, range: [0.5, 2], confidence: 'measured',
    notes: 'Very rapidly hydrolysed and conjugated; complete urinary recovery within 24 hours.' },
  metabolism: {
    firstPass: 'Extensive — hydrolysed by esterases in the gut wall and liver almost immediately.',
    pathways: [
      { enzyme: 'CES1 / CES2', reaction: 'Ester hydrolysis', product: 'p-Hydroxybenzoic acid', fraction: 0.7,
        note: 'Also releases methanol, on the order of micrograms — orders of magnitude below what a glass of fruit juice provides.' },
      { enzyme: 'UGT1A1 / UGT1A9', reaction: 'Glucuronidation', product: 'Methylparaben glucuronide', fraction: 0.2 },
      { enzyme: 'SULT1A1', reaction: 'Sulfation', product: 'Methylparaben sulfate', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'p-Hydroxybenzoic acid', active: false, halfLifeH: 1.5, fraction: 0.7, note: 'Conjugated further and excreted; itself inert.' },
      { name: 'Methylparaben glucuronide', active: false, halfLifeH: 1, fraction: 0.2 },
      { name: 'Methylparaben sulfate', active: false, halfLifeH: 1, fraction: 0.1 }
    ],
    substrateOf: ['CES1', 'CES2', 'UGT1A1', 'UGT1A9', 'SULT1A1'],
    excretion: 'Renal, essentially complete within 24 h, almost entirely as conjugates.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [30, 60], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 0.5, light: [1, 5], common: [5, 20], strong: [20, 100], heavy: 100, unit: 'mg',
        note: 'Typically 0.05-0.25% w/v of a liquid — roughly 1-12 mg in a 5 ml spoonful.' } }
  },
  warnings: [
    'A recognised contact allergen. Oral reactions are rare; skin reactions from creams are the usual presentation.',
    'Parabens have weak oestrogenic activity in vitro, at doses thousands of times below any biologically active level. The association with harm has not held up, but it is why some products advertise paraben-free.',
    'It preserves the formulation — a liquid made at home without a preservative grows mould within weeks.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'Soni et al. 2002, Food Chem Toxicol']
},

{
  id: 'propylparaben', name: 'Propylparaben', aliases: ['propyl paraben', 'propyl 4-hydroxybenzoate', 'e216', 'nipasol'],
  class: 'Inactive ingredient', family: 'Paraben ester', schedule: 'Pharmaceutical excipient',
  cas: '94-13-3', formula: 'C10H12O3',
  inactive: true,
  tags: ['inactive', 'excipient', 'preservative', 'antimicrobial', 'non-psychoactive'],
  density: 1.29,
  mechanism: 'The longer-chain partner to methylparaben. Its greater lipophilicity gives better activity against moulds and yeasts while methylparaben covers bacteria — which is why oral liquids usually contain both, typically around a 10:1 methyl:propyl ratio.',
  halfLife: { hours: 1.5, range: [1, 3], confidence: 'measured' },
  metabolism: {
    firstPass: 'Extensive ester hydrolysis in gut wall and liver.',
    pathways: [
      { enzyme: 'CES1 / CES2', reaction: 'Ester hydrolysis', product: 'p-Hydroxybenzoic acid', fraction: 0.65 },
      { enzyme: 'UGT1A1 / UGT1A9', reaction: 'Glucuronidation', product: 'Propylparaben glucuronide', fraction: 0.25 },
      { enzyme: 'SULT1A1', reaction: 'Sulfation', product: 'Propylparaben sulfate', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'p-Hydroxybenzoic acid', active: false, halfLifeH: 1.5, fraction: 0.65 },
      { name: 'Propylparaben glucuronide', active: false, halfLifeH: 1.5, fraction: 0.25 }
    ],
    substrateOf: ['CES1', 'CES2', 'UGT1A1', 'UGT1A9', 'SULT1A1'],
    excretion: 'Renal, as conjugates, essentially complete within 24 h.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [30, 60], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 0.1, light: [0.2, 1], common: [1, 5], strong: [5, 20], heavy: 20, unit: 'mg',
        note: 'Typically 0.01-0.05% w/v — under 3 mg in a 5 ml dose.' } }
  },
  warnings: [
    'Contact allergen, as with methylparaben. Restricted in EU cosmetics at some concentrations, though still approved for oral pharmaceutical use.',
    'POORLY WATER-SOLUBLE. It is dissolved in the alcohol or glycol phase of a formulation, not the water. Adding it to a plain aqueous solution leaves undissolved particles.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'EFSA re-evaluation of parabens, 2004']
},

{
  id: 'sodium-benzoate', name: 'Sodium benzoate', aliases: ['benzoate of soda', 'e211', 'benzoate'],
  class: 'Inactive ingredient', family: 'Aromatic carboxylate salt', schedule: 'Pharmaceutical excipient',
  cas: '532-32-1', formula: 'C7H5NaO2',
  inactive: true,
  tags: ['inactive', 'excipient', 'preservative', 'antimicrobial', 'non-psychoactive'],
  density: 1.50,
  mechanism: 'An antimicrobial preservative that only works in acidic formulations — it is undissociated benzoic acid that penetrates microbial cells, so below about pH 4.5 it is effective and above pH 5 nearly useless. Its presence therefore tells you the syrup is deliberately acidic.',
  halfLife: { hours: 1, range: [0.5, 1.5], confidence: 'measured',
    notes: 'Cleared very fast by conjugation with glycine; almost none remains after a few hours.' },
  metabolism: {
    firstPass: 'Rapid and near-complete conjugation on first pass through the liver.',
    pathways: [
      { enzyme: 'ACSM2B / GLYAT', reaction: 'Conjugation with glycine', product: 'Hippuric acid', fraction: 0.9,
        note: 'The classic detoxification pathway, described in 1842 and named for horse urine. It consumes glycine, which is the basis of using benzoate therapeutically to dump excess nitrogen in urea cycle disorders.' },
      { enzyme: 'UGT', reaction: 'Glucuronidation (minor)', product: 'Benzoyl glucuronide', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Hippuric acid', active: false, halfLifeH: 1, fraction: 0.9,
        note: 'Excreted renally; the standard biomarker for both benzoate and toluene exposure.' },
      { name: 'Benzoyl glucuronide', active: false, halfLifeH: 1.5, fraction: 0.1 }
    ],
    substrateOf: ['GLYAT', 'ACSM2B', 'UGT'],
    excretion: 'Renal, 90%+ as hippuric acid within 6 hours.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [30, 60], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 1, light: [5, 20], common: [20, 100], strong: [100, 500], heavy: 500, unit: 'mg',
        note: 'Typically 0.1-0.5% w/v — roughly 5-25 mg per 5 ml dose. Therapeutic use in urea cycle disorders is in grams.' } }
  },
  warnings: [
    'In an acidic formulation containing vitamin C, benzoate can react to form small amounts of BENZENE, a carcinogen. This is a documented problem in soft drinks and the reason a product will contain one or the other, rarely both.',
    'Depletes glycine at high doses — irrelevant at excipient amounts, but exactly why benzoate is used therapeutically to remove nitrogen.',
    'Triggers urticaria in a small number of people, often the same ones sensitive to aspirin.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'EFSA re-evaluation of benzoic acid and benzoates, 2016']
},

{
  id: 'sodium-citrate', name: 'Sodium citrate', aliases: ['trisodium citrate', 'citrate buffer', 'e331', 'sodium citrate dihydrate'],
  class: 'Inactive ingredient', family: 'Organic acid salt', schedule: 'Pharmaceutical excipient',
  cas: '68-04-2', formula: 'C6H5Na3O7',
  inactive: true,
  tags: ['inactive', 'excipient', 'buffer', 'urinary-alkaliniser', 'non-psychoactive'],
  density: 1.70,
  mechanism: 'A buffering agent — paired with citric acid it holds a liquid formulation at a chosen pH, which controls both the stability of the active and the effectiveness of the preservative. It is also mildly alkalinising systemically, because citrate is metabolised to bicarbonate.',
  halfLife: { hours: 0.5, range: [0.2, 1], confidence: 'measured' },
  metabolism: {
    firstPass: 'None relevant — citrate is a normal metabolic intermediate.',
    pathways: [
      { enzyme: 'Krebs cycle (aconitase and downstream)', reaction: 'Oxidised through the citric acid cycle', product: 'CO2 + bicarbonate', fraction: 1.0,
        note: 'Each citrate ion metabolised yields three bicarbonate equivalents, which is why citrate salts alkalinise urine and blood.' }
    ],
    metabolites: [
      { name: 'Bicarbonate', active: true, halfLifeH: 2, potencyRel: 0.05, fraction: 1.0,
        note: 'Marked active because urinary alkalinisation genuinely matters here — see the warning below.' }
    ],
    substrateOf: [],
    excretion: 'Fully metabolised; excess citrate is filtered renally.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [10, 30], peakMin: [30, 90], durationH: [2, 6], afterEffectsH: [0, 0], bioavailability: 1.0,
      doses: { threshold: 10, light: [50, 200], common: [200, 1000], strong: [1000, 4000], heavy: 4000, unit: 'mg',
        note: 'As an excipient, typically well under 100 mg per dose. Sold separately as a urinary alkaliniser in gram amounts.' } }
  },
  warnings: [
    'ALKALINISES URINE at gram doses — the same mechanism as sodium bicarbonate. That slows renal clearance of basic drugs, amphetamines especially, whose half-life can more than double. As a tablet excipient the amount is far too small to matter; as a sachet of cystitis powder, it is not.',
    'Contributes sodium, which matters in heart failure and hypertension at the gram doses used therapeutically.',
    'Also an anticoagulant by calcium chelation — the reason blood collection tubes contain it. Not a concern orally.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'Martindale']
},

{
  id: 'sodium-metabisulfite', name: 'Sodium metabisulfite', aliases: ['sodium pyrosulfite', 'e223', 'sodium metabisulphite', 'metabisulfite'],
  class: 'Inactive ingredient', family: 'Inorganic sulfite', schedule: 'Pharmaceutical excipient',
  cas: '7681-57-4', formula: 'Na2S2O5',
  inactive: true,
  tags: ['inactive', 'excipient', 'antioxidant', 'allergen', 'bronchospasm-risk', 'non-psychoactive'],
  density: 1.48,
  mechanism: 'An antioxidant, not an antimicrobial preservative. It is sacrificial — it oxidises in place of the active ingredient, protecting adrenaline, catecholamines and other oxidation-prone drugs from degrading in the vial. This is the most clinically important excipient in this list.',
  halfLife: { hours: 1, range: [0.5, 2], confidence: 'measured',
    notes: 'Sulfite is oxidised to sulfate very rapidly by sulfite oxidase. The relevant hazard is the acute airway reaction, not systemic persistence.' },
  metabolism: {
    firstPass: 'Converted to sulfite on contact with water, then oxidised to sulfate largely before absorption.',
    pathways: [
      { enzyme: 'SUOX (sulfite oxidase)', reaction: 'Oxidation of sulfite to sulfate', product: 'Sulfate', fraction: 0.95,
        note: 'A molybdenum-dependent mitochondrial enzyme. People with low sulfite oxidase activity — asthmatics disproportionately — clear sulfite poorly, which is the leading explanation for sulfite sensitivity.' },
      { enzyme: 'Non-enzymatic', reaction: 'Formation of sulfur dioxide in the acidic stomach', product: 'SO2 gas', fraction: 0.05,
        note: 'Inhaled SO2 released in the mouth and stomach is thought to be what actually triggers bronchospasm, rather than absorbed sulfite.' }
    ],
    metabolites: [
      { name: 'Sulfate', active: false, halfLifeH: 2, fraction: 0.95, note: 'Renally excreted; entirely benign.' },
      { name: 'Sulfur dioxide', active: true, halfLifeH: 0.2, potencyRel: 1.0, fraction: 0.05,
        note: 'Marked active because it is the species responsible for bronchospasm — a real pharmacological effect, not an inert one.' }
    ],
    substrateOf: ['SUOX'],
    excretion: 'Renal as sulfate.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [1, 15], peakMin: [5, 30], durationH: [0.2, 2], afterEffectsH: [0, 1], bioavailability: 0.9,
      doses: { threshold: 0.5, light: [1, 5], common: [5, 20], strong: [20, 100], heavy: 100, unit: 'mg',
        note: 'Typically 0.01-0.1% w/v. A 5 ml dose of a preserved liquid carries roughly 0.5-5 mg.' } }
  },
  warnings: [
    'NOT INERT FOR EVERYONE. Sulfites trigger bronchospasm in an estimated 3-10% of asthmatics, with severe asthmatics at highest risk. Reactions range from wheeze to fatal status asthmaticus, and onset is within minutes.',
    'The cruel irony: sulfite is the antioxidant in some adrenaline and bronchodilator formulations, so the excipient in the rescue treatment can worsen the attack in a sensitive person. Sulfite-free presentations exist and should be sought by anyone with a known sensitivity.',
    'Also causes urticaria, flushing and anaphylactoid reactions independently of asthma.',
    'Degrades thiamine (vitamin B1), so sulfited products are not a thiamine source.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'Vally & Misso 2012, Gastroenterol Hepatol Bed Bench', 'FDA sulfite labelling rule 21 CFR 101.100']
},

{
  id: 'saccharin-sodium', name: 'Saccharin sodium', aliases: ['sodium saccharin', 'saccharin', 'e954'],
  class: 'Inactive ingredient', family: 'Sulfonamide sweetener', schedule: 'Pharmaceutical excipient',
  cas: '128-44-9', formula: 'C7H4NNaO3S',
  inactive: true,
  tags: ['inactive', 'excipient', 'sweetener', 'taste-masking', 'non-psychoactive'],
  density: 0.83,
  mechanism: 'An intense sweetener, roughly 300-500 times as sweet as sucrose, used to mask the taste of bitter actives in syrups and chewable tablets. Remarkable pharmacologically for undergoing no biotransformation at all — it passes through the body chemically unchanged.',
  halfLife: { hours: 5, range: [3, 10], confidence: 'measured',
    notes: 'Slow renal clearance despite zero metabolism, because it is extensively protein-bound.' },
  metabolism: {
    firstPass: 'None. Absorbed slowly and completely unmetabolised.',
    pathways: [
      { enzyme: 'None (not metabolised)', reaction: 'Absorbed and excreted chemically unchanged', product: 'Unchanged saccharin', fraction: 1.0,
        note: 'One of very few xenobiotics that undergoes no biotransformation whatsoever in humans.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'No metabolites are formed.' }],
    substrateOf: [],
    excretion: 'Renal, ~100% unchanged by active tubular secretion.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [30, 120], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 0.5, light: [1, 5], common: [5, 25], strong: [25, 100], heavy: 100, unit: 'mg',
        note: 'A few milligrams sweetens a 5 ml dose. The ADI is 5 mg/kg/day — about 350 mg for a 70 kg adult.' } }
  },
  warnings: [
    'The 1970s bladder-cancer scare was resolved: the mechanism was specific to male rat urine chemistry and does not occur in humans. Saccharin was delisted as a carcinogen in 2000.',
    'It is a sulfonamide, and a small number of people with sulfonamide hypersensitivity react to it.',
    'Has a distinct metallic aftertaste, which is why it is usually blended with another sweetener rather than used alone.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'IARC Monograph 73', 'US NTP delisting 2000']
},

{
  id: 'peach-flavor', name: 'Peach flavour', aliases: ['peach flavor', 'peach flavouring', 'natural peach flavor'],
  class: 'Inactive ingredient', family: 'Proprietary flavour blend', schedule: 'Pharmaceutical excipient',
  formula: 'Mixture — no single formula',
  inactive: true,
  tags: ['inactive', 'excipient', 'flavouring', 'taste-masking', 'proprietary', 'non-psychoactive'],
  density: 1.036,
  carrierSolvent: 'pg',
  mechanism: 'A proprietary flavour concentrate built on gamma-decalactone and assorted esters. Carried in PROPYLENE GLYCOL, which is the standard vehicle for a water-miscible flavour: lactones are poorly water-soluble on their own and PG holds them in solution without the harshness of ethanol.',
  halfLife: { hours: 1, range: [0.5, 3], confidence: 'unknown',
    notes: 'A mixture of dozens of components at trace amounts. There is no meaningful single half-life; this value is a placeholder so the model runs.' },
  metabolism: {
    firstPass: 'Varies by component; most flavour esters are hydrolysed by gut and hepatic esterases within minutes.',
    pathways: [
      { enzyme: 'CES1 / CES2', reaction: 'Hydrolysis of flavour esters', product: 'Component acids and alcohols', fraction: 0.6,
        note: 'The general fate of ester-based flavour compounds.' },
      { enzyme: 'UGT / CYP2A6', reaction: 'Glucuronidation and hydroxylation of menthol', product: 'Menthol glucuronide', fraction: 0.3,
        note: 'If the mint component is menthol, this is its route — glucuronidated and excreted renally.' }
    ],
    metabolites: [
      { name: 'Menthol glucuronide', active: false, halfLifeH: 1, fraction: 0.3 },
      { name: 'Flavour acids and alcohols', active: false, halfLifeH: 1, fraction: 0.6, note: 'Trace amounts, metabolised as ordinary dietary components.' }
    ],
    substrateOf: ['CES1', 'CES2', 'UGT', 'CYP2A6'],
    excretion: 'Renal as conjugates; amounts are minute.',
    confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 0.1, light: [0.5, 2], common: [2, 10], strong: [10, 50], heavy: 50, unit: 'mg',
        note: 'Typically 0.05-0.2% w/v of a liquid. There is no dose in any pharmacological sense.' } }
  },
  warnings: [
    'PROPRIETARY AND UNDISCLOSED. Flavour on a label is a trade secret covering a blend that may contain dozens of compounds, none individually listed. If you are tracking an allergy or a sensitivity, a flavour blend is the ingredient you cannot verify.',
    'Menthol-containing flavours can trigger bronchospasm in a small number of asthmatics and worsen reflux by relaxing the lower oesophageal sphincter.',
    'Flavour blends are frequently carried in ethanol or propylene glycol, so a flavour entry may be bringing a solvent with it that the label does not separate out.'
  ],
  sources: ['FDA inactive ingredient database', 'Pharmaceutical excipient handbooks']
},

{
  id: 'raspberry-flavor', name: 'Natural raspberry flavour', aliases: ['natural raspberry flavor', 'raspberry flavouring', 'raspberry flavor', 'raspberry flavour'],
  class: 'Inactive ingredient', family: 'Natural flavour extract', schedule: 'Pharmaceutical excipient',
  formula: 'Mixture — no single formula',
  inactive: true,
  tags: ['inactive', 'excipient', 'flavouring', 'taste-masking', 'proprietary', 'non-psychoactive'],
  density: 1.0,
  mechanism: 'A natural flavour extract dominated by raspberry ketone, ionones and assorted esters. Natural is a regulatory statement about the SOURCE of the molecules, not about their identity or safety — a natural and an artificial raspberry flavour can contain the same compounds.',
  halfLife: { hours: 1, range: [0.5, 3], confidence: 'unknown',
    notes: 'A trace mixture with no meaningful single half-life; this value is a placeholder.' },
  metabolism: {
    firstPass: 'Extensive for most components — flavour esters and ketones are cleared on first pass.',
    pathways: [
      { enzyme: 'CES1 / CES2', reaction: 'Hydrolysis of flavour esters', product: 'Component acids and alcohols', fraction: 0.5 },
      { enzyme: 'Carbonyl reductase / AKR', reaction: 'Ketone reduction of raspberry ketone', product: 'Corresponding alcohol', fraction: 0.3 },
      { enzyme: 'UGT / SULT', reaction: 'Phase II conjugation', product: 'Glucuronides and sulfates', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Flavour conjugates', active: false, halfLifeH: 1, fraction: 0.2, note: 'Renally excreted; trace amounts.' }
    ],
    substrateOf: ['CES1', 'CES2', 'UGT', 'SULT'],
    excretion: 'Renal as conjugates.',
    confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 0.1, light: [0.5, 2], common: [2, 10], strong: [10, 50], heavy: 50, unit: 'mg' } }
  },
  warnings: [
    'PROPRIETARY. As with any flavour blend, the individual components are not disclosed and cannot be checked against an allergy.',
    'Natural is a sourcing claim, not a safety claim. Natural flavours are not inherently gentler than artificial ones and are regulated identically.',
    'Fruit flavour blends sometimes carry benzoate or citrate with them, which can push a formulation acidic without that being obvious from the label.'
  ],
  sources: ['FDA inactive ingredient database', '21 CFR 101.22']
},

{
  id: 'corn-starch', name: 'Corn starch', aliases: ['maize starch', 'starch', 'cornstarch', 'amylum', 'pregelatinized starch'],
  class: 'Inactive ingredient', family: 'Polysaccharide', schedule: 'Pharmaceutical excipient',
  cas: '9005-25-8', formula: '(C6H10O5)n',
  inactive: true,
  tags: ['inactive', 'bulking-agent', 'excipient', 'disintegrant', 'binder', 'insoluble', 'non-psychoactive'],
  density: 1.5,
  mechanism: 'The oldest and most versatile tablet excipient — filler, binder and disintegrant at once. As a disintegrant it swells on contact with water and physically bursts the tablet apart so the active can dissolve. Also a common cutting agent in illicit powders.',
  halfLife: { hours: 2, range: [1, 4], confidence: 'measured',
    notes: 'As the glucose released. Starch itself is not absorbed intact.' },
  metabolism: {
    firstPass: 'Digested rather than metabolised — broken down to glucose in the gut lumen and brush border.',
    pathways: [
      { enzyme: 'AMY1 / AMY2 (alpha-amylase)', reaction: 'Hydrolysis of alpha-1,4 bonds', product: 'Maltose, maltotriose and limit dextrins', fraction: 0.9,
        note: 'AMY1 copy number varies severalfold between people and populations, which measurably changes how fast starch is digested.' },
      { enzyme: 'MGAM (maltase-glucoamylase)', reaction: 'Brush-border hydrolysis to glucose', product: 'Glucose', fraction: 0.9 },
      { enzyme: 'Colonic bacterial fermentation', reaction: 'Fermentation of resistant starch', product: 'Short-chain fatty acids', fraction: 0.1,
        note: 'The resistant fraction escapes digestion and is fermented instead — this is the part that acts as dietary fibre.' }
    ],
    metabolites: [
      { name: 'Glucose', active: false, halfLifeH: 0.5, fraction: 0.9, note: 'Enters normal carbohydrate metabolism.' },
      { name: 'Short-chain fatty acids', active: false, halfLifeH: 2, fraction: 0.1 }
    ],
    substrateOf: ['AMY1', 'AMY2', 'MGAM'],
    excretion: 'Fully digested or fermented; nothing excreted intact.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [15, 45], peakMin: [45, 120], durationH: [2, 4], afterEffectsH: [0, 0], bioavailability: 0.9,
      doses: { threshold: 100, light: [500, 2000], common: [2000, 20000], strong: [20000, 50000], heavy: 50000, unit: 'mg' } }
  },
  warnings: [
    'INSOLUBLE in cold water — it suspends and then settles. Adding starch to a solution guarantees an uneven dose from one draw to the next. It is a powder excipient, not a solution excipient.',
    'Never inject anything containing starch. Starch granules cause granulomas and vascular occlusion, and starch-cut powders have caused serious injury when injected.',
    'Gluten-free (maize, not wheat), unlike the flour entry — relevant for coeliac disease.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'USP-NF Starch monograph']
},

{
  id: 'magnesium-stearate', name: 'Magnesium stearate', aliases: ['mg stearate', 'e470b', 'magnesium octadecanoate'],
  class: 'Inactive ingredient', family: 'Fatty acid salt', schedule: 'Pharmaceutical excipient',
  cas: '557-04-0', formula: 'C36H70MgO4',
  inactive: true,
  tags: ['inactive', 'excipient', 'lubricant', 'hydrophobic', 'insoluble', 'non-psychoactive'],
  density: 1.03,
  mechanism: 'A lubricant, present in the overwhelming majority of tablets and capsules. It coats powder particles so they do not weld to the tablet press. Used at well under 1% because it is strongly hydrophobic — too much of it waterproofs the tablet and measurably slows dissolution of the active.',
  halfLife: { hours: 0, confidence: 'measured',
    notes: 'Not absorbed as such. It dissociates in the gut into magnesium and stearic acid, which follow their own separate routes.' },
  metabolism: {
    firstPass: 'Dissociates in gastric acid; the fatty acid is digested as ordinary dietary fat and the magnesium handled as a mineral.',
    pathways: [
      { enzyme: 'Gastric acid (non-enzymatic)', reaction: 'Dissociation to stearic acid and magnesium ion', product: 'Stearic acid + Mg2+', fraction: 1.0 },
      { enzyme: 'Pancreatic lipase / beta-oxidation', reaction: 'Absorption and oxidation of stearic acid', product: 'Acetyl-CoA', fraction: 0.9,
        note: 'Stearic acid is a normal dietary saturated fat; the amount from an excipient is nutritionally invisible.' }
    ],
    metabolites: [
      { name: 'Stearic acid', active: false, halfLifeH: 4, fraction: 0.9, note: 'Metabolised as dietary fat.' },
      { name: 'Magnesium ion', active: false, halfLifeH: 24, fraction: 1.0, note: 'Absorbed or excreted as a normal mineral; a few milligrams at most.' }
    ],
    substrateOf: [],
    excretion: 'Faecal for the unabsorbed fraction; renal for magnesium.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.1,
      doses: { threshold: 0.5, light: [1, 5], common: [5, 15], strong: [15, 50], heavy: 50, unit: 'mg',
        note: 'Typically 0.25-2% of tablet weight — a few milligrams. Almost never more.' } }
  },
  warnings: [
    'HYDROPHOBIC and effectively insoluble. It will not dissolve in water, ethanol or oil at any useful rate — it floats, clumps and coats the glass. It is the usual reason a crushed tablet refuses to make a clean solution.',
    'Excess magnesium stearate genuinely slows drug release from a tablet. This is a real formulation failure mode, not an internet health claim.',
    'The claim that it suppresses immune function comes from a single 1990 study on T-cells in vitro at concentrations unreachable by any oral dose. It is not supported.',
    'Usually vegetable-derived now, but bovine grades exist — relevant for dietary restrictions.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'USP-NF Magnesium Stearate monograph']
},

{
  id: 'silicon-dioxide', name: 'Silicon dioxide (colloidal)', aliases: ['colloidal silicon dioxide', 'colloidal silica', 'fumed silica', 'aerosil', 'silica', 'silicon dioxide anhydrous', 'e551'],
  class: 'Inactive ingredient', family: 'Inorganic oxide', schedule: 'Pharmaceutical excipient',
  cas: '7631-86-9', formula: 'SiO2',
  inactive: true,
  tags: ['inactive', 'excipient', 'glidant', 'anticaking', 'insoluble', 'not-absorbed', 'non-psychoactive'],
  density: 2.2,
  mechanism: 'A glidant and anticaking agent. Its particles are so fine — tens of nanometres — that they act like ball bearings between larger powder particles, which is what makes a blend flow evenly into a tablet die or a capsule. It also adsorbs moisture, keeping hygroscopic powders free-flowing.',
  halfLife: { hours: 0, confidence: 'measured',
    notes: 'Not absorbed to any meaningful degree, so it has no half-life in the pharmacokinetic sense.' },
  metabolism: {
    firstPass: 'None — it is not absorbed.',
    pathways: [
      { enzyme: 'None (not absorbed)', reaction: 'Passes through the gut unchanged', product: 'Unchanged silica', fraction: 1.0,
        note: 'A trace dissolves as orthosilicic acid and is excreted renally; the rest transits unchanged.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Not metabolised.' }],
    substrateOf: [],
    excretion: 'Faecal, essentially entirely unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.01,
      doses: { threshold: 0.1, light: [0.5, 2], common: [2, 10], strong: [10, 50], heavy: 50, unit: 'mg',
        note: 'Typically 0.1-1% of a tablet — a few milligrams.' } }
  },
  warnings: [
    'Silicon dioxide and colloidal silicon dioxide on a label are the same chemical in different particle grades, which is why they are one entry here rather than two. Colloidal (fumed) grades are the very fine flow aid; other grades are coarser.',
    'INSOLUBLE. It will not dissolve in a solution — it disperses and gradually settles.',
    'Its poured bulk density is extraordinarily low (around 0.03-0.05 g/ml) even though the true density is 2.2. A gram occupies a startling volume, which routinely surprises people weighing it.',
    'DO NOT INHALE the powder. Amorphous fumed silica is far less hazardous than crystalline silica, but fine dust of any kind is a respiratory irritant and crystalline silica causes silicosis.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'USP-NF Colloidal Silicon Dioxide monograph', 'EFSA re-evaluation of silicon dioxide (E551), 2018']
},

{
  id: 'crospovidone', name: 'Crospovidone', aliases: ['crosslinked povidone', 'polyplasdone', 'kollidon cl', 'crospovidonum', 'e1202'],
  class: 'Inactive ingredient', family: 'Crosslinked polymer', schedule: 'Pharmaceutical excipient',
  cas: '9003-39-8', formula: '(C6H9NO)n',
  inactive: true,
  tags: ['inactive', 'excipient', 'disintegrant', 'insoluble', 'not-absorbed', 'non-psychoactive'],
  density: 1.22,
  mechanism: 'A superdisintegrant — crosslinked polyvinylpyrrolidone. It wicks water into the tablet core by capillary action and swells, blowing the tablet apart within seconds. This is what makes a modern tablet disintegrate quickly rather than sitting in the stomach as a lump.',
  halfLife: { hours: 0, confidence: 'measured',
    notes: 'The crosslinking makes it a completely insoluble, unabsorbable network. Non-crosslinked povidone, by contrast, is soluble and partly absorbed — a genuinely different excipient.' },
  metabolism: {
    firstPass: 'None — the polymer is not absorbed at any molecular weight.',
    pathways: [
      { enzyme: 'None (not absorbed)', reaction: 'Swells, then passes through unchanged', product: 'Unchanged polymer', fraction: 1.0 }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Not metabolised or absorbed.' }],
    substrateOf: [],
    excretion: 'Faecal, entirely unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0,
      doses: { threshold: 1, light: [5, 20], common: [20, 60], strong: [60, 200], heavy: 200, unit: 'mg',
        note: 'Typically 2-5% of tablet weight.' } }
  },
  warnings: [
    'INSOLUBLE and strongly swelling. Putting a crospovidone-containing tablet into a small volume of liquid produces a gel-like sludge, not a solution — the usual reason a crushed tablet will not go into solution cleanly.',
    'Distinguish it from plain povidone (PVP), which IS soluble. The two look similar on a label and behave completely differently in a mixture.',
    'Never inject. A swelling insoluble polymer in the bloodstream is an embolic hazard.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'USP-NF Crospovidone monograph']
},

{
  id: 'docusate-sodium', name: 'Docusate sodium', aliases: ['dioctyl sodium sulfosuccinate', 'dss', 'doss', 'sodium docusate', 'colace'],
  class: 'Inactive ingredient', family: 'Anionic surfactant', schedule: 'Excipient / OTC laxative',
  cas: '577-11-7', formula: 'C20H37NaO7S',
  inactive: true,
  tags: ['inactive', 'excipient', 'surfactant', 'wetting-agent', 'laxative', 'absorption-enhancer', 'non-psychoactive'],
  density: 1.1,
  mechanism: 'A wetting agent as an excipient and a stool softener as a drug — the same surfactant action in both cases. In a tablet it helps water penetrate a hydrophobic powder so the active can dissolve. In the colon it lets water and fat mix into stool.',
  halfLife: { hours: 3, range: [2, 6], confidence: 'estimated',
    notes: 'Poorly characterised. Most of an oral dose stays in the gut, which is where its laxative action occurs.' },
  metabolism: {
    firstPass: 'Partially absorbed and secreted in bile; the majority remains luminal.',
    pathways: [
      { enzyme: 'CES1 / CES2', reaction: 'Ester hydrolysis of the absorbed fraction', product: '2-Ethylhexanol + sulfosuccinate', fraction: 0.3 },
      { enzyme: 'None (luminal)', reaction: 'Remains in the gut lumen and acts locally', product: 'Unchanged docusate', fraction: 0.7,
        note: 'The therapeutic action is entirely local; systemic exposure is incidental.' }
    ],
    metabolites: [
      { name: '2-Ethylhexanol', active: false, halfLifeH: 3, fraction: 0.3, note: 'Oxidised and conjugated; excreted renally.' }
    ],
    substrateOf: ['CES1', 'CES2'],
    excretion: 'Mostly faecal; a minor biliary and renal fraction.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [720, 2880], peakMin: [1440, 2880], durationH: [12, 72], afterEffectsH: [0, 0], bioavailability: 0.3,
      doses: { threshold: 5, light: [10, 50], common: [50, 200], strong: [200, 400], heavy: 500, unit: 'mg',
        note: 'As an EXCIPIENT: well under 1 mg per tablet, far below any laxative effect. As a DRUG: 50-300 mg/day. The tiers here describe the drug, not the excipient.' } }
  },
  warnings: [
    'NOT PHARMACOLOGICALLY INERT, unlike most of this section. It is a licensed stool softener at 50-300 mg. As a tablet excipient the amount does nothing — but if you are adding it yourself, the line between excipient and laxative is easy to cross.',
    'As a surfactant it INCREASES ABSORPTION of other compounds by improving wetting and disrupting the mucosal barrier. That is deliberate in a designed formulation and unpredictable in an improvised one — it can meaningfully raise the bioavailability of whatever it is mixed with.',
    'Evidence for its efficacy as a stool softener is actually weak; several trials found it no better than placebo.',
    'Extremely bitter, and it foams enthusiastically when stirred.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'Martindale', 'Fakheri & Volpicelli 2011, Am J Gastroenterol']
},

{
  id: 'sodium-lauryl-sulfate', name: 'Sodium lauryl sulfate', aliases: ['sls', 'sodium dodecyl sulfate', 'sds', 'e487', 'sodium laurilsulfate'],
  class: 'Inactive ingredient', family: 'Anionic surfactant', schedule: 'Pharmaceutical excipient',
  cas: '151-21-3', formula: 'C12H25NaO4S',
  inactive: true,
  tags: ['inactive', 'excipient', 'surfactant', 'wetting-agent', 'irritant', 'absorption-enhancer', 'non-psychoactive'],
  density: 1.09,
  mechanism: 'A powerful anionic surfactant used as a wetting agent and solubiliser. It is what allows a poorly water-soluble active to dissolve at all, and it is used in dissolution testing precisely because it dissolves things water cannot.',
  halfLife: { hours: 4, range: [2, 8], confidence: 'estimated' },
  metabolism: {
    firstPass: 'Absorbed to a limited extent; oxidised in the liver.',
    pathways: [
      { enzyme: 'CYP4A (omega-oxidation) then beta-oxidation', reaction: 'Stepwise oxidation of the alkyl chain', product: 'Butyric acid 4-sulfate', fraction: 0.7,
        note: 'The chain is shortened stepwise, leaving a short sulfated acid that is excreted renally.' },
      { enzyme: 'Sulfatase', reaction: 'Hydrolysis of the sulfate ester (minor)', product: 'Dodecanol + sulfate', fraction: 0.1 }
    ],
    metabolites: [
      { name: 'Butyric acid 4-sulfate', active: false, halfLifeH: 4, fraction: 0.7, note: 'The main urinary metabolite.' }
    ],
    substrateOf: ['CYP4A'],
    excretion: 'Renal as the sulfated short-chain acid; faecal for the unabsorbed fraction.',
    confidence: 'estimated'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [30, 120], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.3,
      doses: { threshold: 0.5, light: [1, 5], common: [5, 20], strong: [20, 100], heavy: 100, unit: 'mg',
        note: 'Typically 0.5-2% of a tablet.' } }
  },
  warnings: [
    'A MUCOSAL IRRITANT. It is the standard positive control in skin irritation testing — researchers use it precisely because it reliably damages epithelium. Never put an SLS-containing preparation up your nose, under your tongue or anywhere rectally; it strips the mucosa.',
    'Strongly associated with recurrent aphthous ulcers; SLS-free toothpaste measurably reduces them in susceptible people.',
    'Like docusate, it INCREASES ABSORPTION of co-administered compounds by disrupting membranes. Useful in a designed formulation, dangerous in an improvised one.',
    'Foams violently. A solution containing it cannot be shaken without producing a head of foam that makes accurate volume measurement difficult.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'Bondi et al. 2015, Environ Health Insights', 'USP-NF Sodium Lauryl Sulfate monograph']
},

{
  id: 'hydroxypropyl-cellulose', name: 'Hydroxypropyl cellulose', aliases: ['hpc', 'klucel', 'hyprolose', 'e463'],
  class: 'Inactive ingredient', family: 'Cellulose ether', schedule: 'Pharmaceutical excipient',
  cas: '9004-64-2', formula: 'Cellulose ether — variable substitution',
  inactive: true,
  tags: ['inactive', 'excipient', 'binder', 'film-former', 'not-absorbed', 'non-psychoactive'],
  density: 1.22,
  mechanism: 'A cellulose ether used as a tablet binder and film-coating former. Unusual among cellulose derivatives in being soluble in both water and ethanol, which is why it is chosen for alcohol-based coating processes.',
  halfLife: { hours: 0, confidence: 'measured',
    notes: 'Not absorbed — humans have no enzyme that cleaves the cellulose backbone.' },
  metabolism: {
    firstPass: 'None. Not absorbed at any molecular weight used pharmaceutically.',
    pathways: [
      { enzyme: 'None (not digestible)', reaction: 'Passes through unchanged', product: 'Unchanged polymer', fraction: 1.0,
        note: 'Substituted cellulose ethers resist even colonic bacterial fermentation, so unlike some fibres they produce little gas.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Not metabolised or absorbed.' }],
    substrateOf: [],
    excretion: 'Faecal, entirely unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0,
      doses: { threshold: 1, light: [5, 20], common: [20, 80], strong: [80, 300], heavy: 300, unit: 'mg',
        note: 'Typically 2-6% of tablet weight as a binder.' } }
  },
  warnings: [
    'SOLUBLE, unlike microcrystalline cellulose — but it dissolves into a viscous, slimy solution rather than a thin one. High concentrations noticeably thicken a liquid and make small volumes harder to measure accurately.',
    'Not absorbed, so it contributes no calories and no systemic exposure.',
    'Solubility drops sharply above about 45 C — it precipitates out of hot water, the opposite of what most people expect.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'USP-NF Hydroxypropyl Cellulose monograph']
},

{
  id: 'hypromellose', name: 'Hypromellose', aliases: ['hpmc', 'hydroxypropyl methylcellulose', 'methocel', 'e464', 'vegetarian capsule', 'hypromellose capsule'],
  class: 'Inactive ingredient', family: 'Cellulose ether', schedule: 'Pharmaceutical excipient',
  cas: '9004-65-3', formula: 'Cellulose ether — variable substitution',
  inactive: true,
  tags: ['inactive', 'excipient', 'film-former', 'capsule', 'controlled-release', 'not-absorbed', 'non-psychoactive'],
  density: 1.26,
  mechanism: 'The most important film-coating and controlled-release polymer in modern pharmacy, and the vegetarian alternative to gelatin capsules. In a sustained-release tablet it forms a gel layer on contact with water that the active must slowly diffuse through — the polymer, not the drug, sets the release rate.',
  halfLife: { hours: 0, confidence: 'measured',
    notes: 'Not absorbed. It is inert dietary fibre.' },
  metabolism: {
    firstPass: 'None — not absorbed at pharmaceutical molecular weights.',
    pathways: [
      { enzyme: 'None (not digestible)', reaction: 'Hydrates to a gel, then passes through unchanged', product: 'Unchanged polymer', fraction: 1.0,
        note: 'Humans lack cellulase, and the methyl and hydroxypropyl substitutions block bacterial fermentation as well.' }
    ],
    metabolites: [{ name: 'None', active: false, note: 'Not metabolised or absorbed.' }],
    substrateOf: [],
    excretion: 'Faecal, entirely unchanged.',
    confidence: 'measured'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0,
      doses: { threshold: 1, light: [5, 20], common: [20, 100], strong: [100, 400], heavy: 400, unit: 'mg',
        note: 'A few percent as a film coat; up to 30% of tablet weight in a sustained-release matrix. An empty size 0 HPMC capsule weighs about 96 mg.' } }
  },
  warnings: [
    'CRUSHING A HYPROMELLOSE MATRIX TABLET DESTROYS ITS CONTROLLED RELEASE. The polymer gel layer IS the release mechanism; break it and the entire dose — often 12 or 24 hours worth — becomes immediately available. This is a well-documented cause of fatal overdose with sustained-release opioids and is the most important line in this entry.',
    'Forms a thick gel with water. A crushed HPMC tablet in a small volume produces a viscous mass rather than a solution, and the drug releases from it slowly and unevenly.',
    'Vegetarian and vegan, unlike gelatin capsules, and less brittle in dry conditions.',
    'Inert and unabsorbed; also used as artificial tears and as a surgical viscoelastic.'
  ],
  sources: ['Pharmaceutical excipient handbooks', 'USP-NF Hypromellose monograph']
},

{
  id: 'mint-flavor', name: 'Mint flavour', aliases: ['mint flavor', 'peppermint flavour', 'peppermint flavor', 'menthol flavour'],
  class: 'Inactive ingredient', family: 'Proprietary flavour blend', schedule: 'Pharmaceutical excipient',
  formula: 'Mixture — chiefly menthol, C10H20O',
  inactive: true,
  tags: ['inactive', 'excipient', 'flavouring', 'taste-masking', 'proprietary', 'non-psychoactive'],
  density: 0.804,
  carrierSolvent: 'ethanol95',
  mechanism: 'Menthol and peppermint oil, carried in ETHANOL. Mint is the counterpart to a peach or fruit note and is separated from it here because the two use different vehicles: menthol is freely soluble in ethanol and barely soluble in water, so a mint concentrate brings alcohol with it whether or not the label says so.',
  halfLife: { hours: 1, range: [0.5, 3], confidence: 'unknown',
    notes: 'A trace mixture with no meaningful single half-life; the value is a placeholder so the model runs.' },
  metabolism: {
    firstPass: 'Extensive — menthol is glucuronidated on first pass and largely cleared before it reaches the systemic circulation.',
    pathways: [
      { enzyme: 'UGT2B7', reaction: 'Glucuronidation of menthol', product: 'Menthol glucuronide', fraction: 0.7,
        note: 'The dominant route. Excreted renally and in bile.' },
      { enzyme: 'CYP2A6', reaction: 'Hydroxylation of the isopropyl group', product: 'p-Menthane-3,8-diol', fraction: 0.2 }
    ],
    metabolites: [
      { name: 'Menthol glucuronide', active: false, halfLifeH: 1, fraction: 0.7, note: 'Inactive; renally excreted.' }
    ],
    substrateOf: ['UGT2B7', 'CYP2A6'],
    excretion: 'Renal and biliary as the glucuronide.',
    confidence: 'unknown'
  },
  routes: {
    oral: { onsetMin: [0, 0], peakMin: [0, 0], durationH: [0, 0], afterEffectsH: [0, 0], bioavailability: 0.8,
      doses: { threshold: 0.1, light: [0.5, 2], common: [2, 10], strong: [10, 50], heavy: 50, unit: 'mg',
        note: 'Typically 0.05-0.2% w/v of a liquid. There is no dose in any pharmacological sense.' } }
  },
  warnings: [
    'CARRIES ETHANOL. A mint concentrate is normally an alcoholic solution, so adding it adds alcohol to the mixture — small in a 5 ml dose, not small if the flavour is a large share of the volume. It is counted toward the depressant load for that reason.',
    'Menthol can trigger bronchospasm in a small number of asthmatics, and it relaxes the lower oesophageal sphincter, which worsens reflux.',
    'PROPRIETARY. The individual components are a trade secret and cannot be checked against an allergy.'
  ],
  sources: ['FDA inactive ingredient database', 'Pharmaceutical excipient handbooks']
}

]);

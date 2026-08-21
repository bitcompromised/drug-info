/* ==========================================================================
   synthesis.js — where each compound comes from, and what that leaves in it
   --------------------------------------------------------------------------
   Every substance on a page here arrived by some route: extracted from a
   plant, made in a pharmaceutical plant to a pharmacopoeia standard, or made
   in a clandestine lab by whoever could get the precursors that month. That
   history is not trivia. It decides what is in the powder alongside the drug,
   how much the drug varies between batches, and which of the two the person
   is actually reacting to.

   Five optional fields per compound:

     origin      — natural product, semi-synthetic, or fully synthetic, and
                   where the starting material physically comes from.
     route       — the route family, NAMED, at the level a review article or
                   an EMCDDA report names it. A name, not a method.
     precursors  — the precursor chemicals and their control status, which is
                   what drives route-switching and therefore batch variation.
     impurities  — what the route leaves in the finished product, and what
                   that does to a person. This is the field that earns the
                   panel its place in a harm-reduction database.
     supply      — what all of the above means for what is actually sold, in
                   this decade, in the places it is sold.

   TWO RULES FOR THIS FILE.

   The first is the rule descriptions.js already sets: nothing is invented.
   Where a route is genuinely undocumented in the open literature, the
   compound gets no entry and the panel says so, rather than printing a
   plausible paragraph of chemistry that nobody has verified.

   The second is specific to this file. It describes chemistry at the level of
   NAMING it, never PERFORMING it. Route families get named because the name
   is what forensic reports, seizure data and impurity profiles are indexed
   by, and because "your meth came out of a P2P route" is the sentence that
   explains an isomer ratio to someone reading their lab result. No reagent
   sequences, no quantities, no reaction conditions, no workup, no yields.
   Those add nothing a reader of this app needs and everything a manufacturer
   does. If an entry starts drifting toward a procedure, it has left the remit
   of this file — cut it back to the name and the consequence.
   ========================================================================== */
DB.synthesis({

/* ================= Opioids ================= */

morphine: {
  origin: 'Natural product. Extracted from opium — the dried latex of Papaver somniferum — or, for most modern pharmaceutical production, from concentrate of poppy straw, which is the whole harvested plant processed industrially.',
  route: 'Isolation and purification of an alkaloid that is already present in the plant. No chemistry builds the morphine skeleton; total synthesis exists in the literature as an academic exercise and has never been economic against a field of poppies.',
  precursors: 'The plant itself. Licit production is governed by acreage licensing under the Single Convention rather than by chemical scheduling, with Australia, Turkey, India, France and Spain supplying most of the legal world market.',
  impurities: 'Pharmaceutical morphine is purified to a pharmacopoeia standard and its impurity profile is a regulatory matter rather than a user-facing one. Crudely extracted opium preparations carry the other poppy alkaloids along with the morphine — codeine, thebaine, papaverine, noscapine — in ratios that vary by plant variety and growing region, so the strength of an unrefined preparation is not predictable from its appearance or volume.',
  supply: 'The alkaloid ratio in the plant is why morphine is the base of some semi-synthetic opioids and thebaine the base of others: which alkaloid a poppy variety is bred to over-produce determines what the industry makes from it.'
},

codeine: {
  origin: 'Both natural and semi-synthetic. Codeine occurs in opium at a few percent, but most pharmaceutical codeine is made from morphine, because demand far exceeds what the plant supplies.',
  route: 'O-methylation of morphine — a single-position modification of the morphine molecule, named as such in the pharmaceutical literature.',
  precursors: 'Morphine, and therefore the licensed poppy supply chain. Codeine sits at a lower schedule than morphine in most countries, which is the entire reason it appears in over-the-counter combination products.',
  impurities: 'The hazard in a codeine product is not a synthesis impurity, it is the deliberate co-formulation: the paracetamol or ibuprofen put in the tablet specifically to make large doses dangerous. That design decision, not the codeine chemistry, is what causes the liver failures.',
  supply: 'Because codeine is a prodrug requiring CYP2D6 to become morphine, the variability people experience comes from their own genotype rather than from batch differences — an unusual case where the manufacturing route is the least interesting source of variation.'
},

heroin: {
  origin: 'Semi-synthetic. Made from morphine, which is made from opium, which is grown — most of the world supply historically from Afghanistan, with Myanmar and Mexico as the other major sources and the balance shifting sharply since the 2022 cultivation ban.',
  route: 'Acetylation of morphine at both hydroxyl positions. Diacetylmorphine is morphine wearing two acetyl groups, which is what makes it lipid-soluble enough to cross into the brain in seconds, and the liver takes them straight back off again.',
  precursors: 'Acetic anhydride, the most tightly watched precursor in the opiate supply chain. It has enormous legitimate industrial use, which makes diversion the constraint rather than manufacture, and INCB pre-export notification for it is one of the more effective precursor controls in existence.',
  impurities: 'Clandestine acetylation is incomplete and the product is not fully purified, so it contains 6-monoacetylmorphine, unreacted morphine, acetylcodeine and noscapine alongside the diacetylmorphine — forensic labs use exactly that fingerprint to trace geographic origin. Residual acetic acid is the vinegar smell. None of this is the actual danger: the danger is what is added afterwards, downstream, by people who never saw the acetylation.',
  supply: 'In North America, and increasingly in Europe, what is sold as heroin frequently contains no diacetylmorphine at all — fentanyl or a nitazene is cheaper per active dose and needs no poppy harvest, no morphine extraction and no controlled anhydride. For street "heroin" in 2020s North America the manufacturing question is usually not a heroin question at all.'
},

desomorphine: {
  origin: 'Semi-synthetic — and the reason it belongs in this file is that the street version is barely a synthesis at all.',
  route: 'A morphinan modification first described in the 1930s as a pharmaceutical. The "krokodil" phenomenon is a crude one-pot conversion of codeine tablets, run to completion and injected without any purification step whatsoever.',
  precursors: 'Over-the-counter codeine tablets, plus household and hardware-store chemicals. It exists as a street drug precisely because it can be made from things that are not controlled.',
  impurities: 'The defining fact about krokodil. The product is injected as the reaction mixture — nobody isolates anything — so people inject residual phosphorus, iodine, heavy metals and solvent along with the opioid. The catastrophic soft-tissue necrosis, thrombophlebitis and bone damage the drug is named for come from that injected mixture, not from desomorphine, which pharmacologically is simply a short and strong morphinan.',
  supply: 'Appears where codeine is available over the counter and real opioids are not, and largely disappears when that gap closes. The harm here is a purification harm, and it is close to total.'
},

fentanyl: {
  origin: 'Fully synthetic. No plant at any stage, which is the whole economic point of it and the reason it displaced heroin.',
  route: 'A 4-anilidopiperidine, built on a piperidine core. Several named route families exist in the literature — forensic and regulatory reports name the original Janssen route and the Siegfried route — and which one a lab used is readable afterwards from the impurity profile.',
  precursors: 'The 4-anilidopiperidine intermediates, above all 4-ANPP and NPP, both internationally scheduled and both carried in this database as compounds in their own right. Precursor control has driven the market steadily upstream into pre-precursors that are not yet scheduled, which is a treadmill rather than a solved problem.',
  impurities: 'Residual 4-ANPP is routinely detected in seized fentanyl and marks incomplete purification. But the impurity that kills is not chemical, it is physical: fentanyl is active in micrograms, and mixing a microgram-active powder into a gram-scale diluent by hand does not produce a uniform mixture. Two portions of the same bag can differ several-fold in dose. That inhomogeneity — the "hot spot" — is behind a large share of overdose deaths, and it is a manufacturing failure rather than a pharmacological one.',
  supply: 'Because it is made entirely from industrial chemicals, production is tied to no territory, growing season or harvest. That is why supply has proved impossible to interdict on the classical model, and why analogue follows analogue whenever a specific structure is scheduled.'
},

carfentanil: {
  origin: 'Fully synthetic. A fentanyl-family analogue developed as a large-animal immobilising agent, never intended for humans at any dose.',
  route: 'The same 4-anilidopiperidine family as fentanyl, with additional substitution on the piperidine ring. The route family is shared with the rest of the class.',
  precursors: 'The same watched piperidine intermediates that feed fentanyl production.',
  impurities: 'The dominant hazard is again dose uniformity, and here it is worse than fentanyl by an order of magnitude. Carfentanil is active at low microgram levels; no clandestine mixing process distributes that evenly through a cutting agent, and a visually uniform powder can carry lethal and sub-threshold portions millimetres apart.',
  supply: 'Appears intermittently in the illicit opioid supply, usually as an adulterant nobody selling it disclosed. Fentanyl test strips cross-react to some degree, but a negative strip is not clearance.'
},

isotonitazene: {
  origin: 'Fully synthetic. A benzimidazole opioid from a 1950s Swiss research programme that was abandoned and never marketed, retrieved from the patent literature decades later.',
  route: 'A 2-benzylbenzimidazole. Structurally unrelated to both morphinans and fentanyls, which is the point: the class sat outside every analogue-control scheme that had been written, because those schemes were drafted around the two families that existed at the time.',
  precursors: 'Benzimidazole intermediates from ordinary industrial chemistry, none of which were controlled when the class emerged and most of which still are not.',
  impurities: 'Nitazenes reach the market as research-grade powder with no pharmacopoeia behind them and no consistency between suppliers. The more pressing issue is the same as fentanyl and for the same reason: high potency, hand mixing, no uniformity. Nitazenes are also frequently sold as something else — as heroin, or pressed into counterfeit oxycodone or alprazolam tablets — so the person taking it usually does not know which drug they are dosing.',
  supply: 'The class is the clearest illustration of what analogue control actually does: it does not remove the opioid, it selects for whichever chemical family the law has not yet described. Naloxone works, but potency and duration may require repeated doses and always an ambulance.'
},

methadone: {
  origin: 'Fully synthetic, developed in Germany during the Second World War when opium imports were cut off. Not a morphinan and not derived from any plant.',
  route: 'A diphenylpropylamine. The molecule looks nothing like morphine and folds into a shape that fits the same receptor — the standard textbook illustration that opioid activity is about conformation rather than skeleton.',
  precursors: 'Ordinary industrial organic chemicals. Methadone is manufactured pharmaceutically at scale and is not a clandestine product in any meaningful quantity.',
  impurities: 'Pharmaceutical grade. The clinical hazard is entirely pharmacological rather than chemical: a long and highly variable half-life, accumulation over the first days of dosing, and QT prolongation. It is manufactured as a racemate and the two enantiomers do different things — the R-form carries the opioid activity, the S-form contributes most of the QT effect.',
  supply: 'Diverted pharmaceutical product rather than clandestine synthesis, so the dose on the label is usually real — unusual in this database. It is the accumulation that catches people, not the first dose.'
},

buprenorphine: {
  origin: 'Semi-synthetic. Made from thebaine, a minor poppy alkaloid, which is why poppy varieties are now bred specifically for thebaine content.',
  route: 'A multi-step modification of the thebaine skeleton into an orvinol. Industrial pharmaceutical manufacture throughout.',
  precursors: 'Thebaine from concentrate of poppy straw, under the same international licensing that governs morphine.',
  impurities: 'Pharmaceutical grade and not a meaningful concern. What surprises people is receptor pharmacology rather than chemistry: partial agonism with very high receptor affinity, so it both has a ceiling on respiratory depression and will displace a full agonist already bound, precipitating withdrawal.',
  supply: 'Counterfeit buprenorphine films and tablets exist. Since genuine buprenorphine is one of the few things that reliably keeps opioid-dependent people alive, a counterfeit here is a particularly cruel failure.'
},

oxycodone: {
  origin: 'Semi-synthetic, from thebaine.',
  route: 'Modification of the thebaine skeleton, first described in 1916. Industrial pharmaceutical manufacture.',
  precursors: 'Thebaine, from the licensed poppy supply.',
  impurities: 'Genuine tablets are pharmaceutical grade at an exact labelled dose. The entire risk has moved to counterfeiting: tablets sold as oxycodone, most notoriously the blue "M30", are frequently fentanyl-containing and visually indistinguishable from genuine ones. A pill press costs less than a car and reproduces the markings exactly.',
  supply: 'For a loose tablet with no pharmacy label, the relevant manufacturing question is not how oxycodone is made but who pressed the tablet. Treat it as unknown until tested.'
},

tramadol: {
  origin: 'Fully synthetic — with a genuine curiosity attached: tramadol was once reported as occurring naturally in the root bark of an African tree, which turned out to be veterinary tramadol entering the soil rather than plant biosynthesis.',
  route: 'A cyclohexanol-based molecule from ordinary industrial synthesis, manufactured pharmaceutically at very large scale.',
  precursors: 'Standard industrial chemicals, uncontrolled.',
  impurities: 'Pharmaceutical grade where genuine. Tramadol is marketed as a racemate and the two enantiomers do different jobs — one favours the opioid pathway through its O-desmethyl metabolite, the other the monoamine reuptake action that gives tramadol its serotonergic risk and its effect on seizure threshold.',
  supply: 'A very large counterfeit and unregulated market exists across West Africa, North Africa and the Middle East, with tablets sold at strengths far above any licensed product. In that market the labelled milligram figure means nothing.'
},

'u-47700': {
  origin: 'Fully synthetic. A benzamide opioid from Upjohn research in the 1970s, never developed, and recovered from the patent literature by the research-chemical market.',
  route: 'A benzamide — again structurally unrelated to morphinans and fentanyls, and again chosen for exactly that reason.',
  precursors: 'Industrial intermediates, uncontrolled at the time the compound emerged.',
  impurities: 'Sold as research-grade powder with no purity standard. Commonly mis-sold as heroin or pressed into counterfeit tablets, so the person dosing it is usually dosing something they cannot identify.',
  supply: 'An earlier illustration of the pattern the nitazenes later repeated: an abandoned pharmaceutical research compound is a fully documented, never-scheduled opioid sitting in public patents.'
},

/* ================= Stimulants ================= */

cocaine: {
  origin: 'Natural product. Extracted from the leaves of Erythroxylum coca, grown almost entirely in Colombia, Peru and Bolivia.',
  route: 'Extraction and purification in stages: leaf to coca paste, paste to cocaine base, base to the hydrochloride salt. "Crack" is not a separate synthesis — it is the hydrochloride converted back to freebase so it can be smoked, since the salt decomposes rather than vaporises.',
  precursors: 'Bulk solvents, acids and bases in industrial quantity. Solvent diversion to the growing regions is the main control lever and a poor one, because these are ordinary commodity chemicals with vast legitimate use.',
  impurities: 'Two categories with different consequences. Processing residues — residual solvent, and manganese where permanganate oxidation was used — travel with the product from the source region. Adulterants are added later and matter more: levamisole, a veterinary dewormer, has been present in a large fraction of the world supply for over a decade and causes agranulocytosis and a characteristic skin necrosis, while phenacetin, lidocaine and caffeine are routine. Cocaine taken with alcohol also forms cocaethylene in the body, which is a metabolic product rather than a contaminant but adds cardiac risk in the same way.',
  supply: 'Purity has risen substantially in European markets over the last decade, so the old assumption that a line is mostly cut is now often wrong — and dose per line has risen with it.'
},

methamphetamine: {
  origin: 'Fully synthetic. Historically made by reduction of ephedrine or pseudoephedrine harvested from cold medicines; that route has been largely displaced by precursor control.',
  route: 'Two route families dominate, and telling them apart from the product is the point. The ephedrine reduction routes — named in forensic literature as the red phosphorus/iodine and Birch routes — start from a molecule that already carries the correct stereocentre and give d-methamphetamine. The P2P route builds the molecule from phenyl-2-propanone and creates the stereocentre during the reaction, giving both enantiomers unless a separate resolution step is performed.',
  precursors: 'Pseudoephedrine and ephedrine, controlled in most countries through pharmacy purchase limits and tracking. P2P itself is scheduled, so production has moved to unscheduled pre-precursors and, more recently, to routes from entirely uncontrolled feedstocks.',
  impurities: 'This is the field that matters. Ephedrine-reduction routes leave residual phosphorus and iodine, and the Birch variant leaves lithium and ammonia residues. P2P routes leave a different fingerprint of ketone and amine by-products. Crucially, a poorly executed synthesis followed by no purification leaves reagent metals in the product — lead contamination from certain P2P variants has caused documented poisoning outbreaks. The other consequence of the P2P shift is the enantiomer ratio: l-methamphetamine is far weaker centrally but keeps its peripheral cardiovascular action, so racemic product delivers more cardiac load per unit of subjective effect. A batch that "feels weaker" may be doing more to the heart, not less.',
  supply: 'The dominant global route today is P2P-based, at industrial scale, and the resulting racemic and variably purified product is a real change in what people are taking compared with the ephedrine era.'
},

amphetamine: {
  origin: 'Fully synthetic.',
  route: 'European illicit production runs overwhelmingly through the Leuckart route from P2P, named constantly in EMCDDA seizure reporting. Pharmaceutical amphetamine is made industrially to a pharmacopoeia standard and, for the prescribed products, as specific enantiomers or defined salt mixtures.',
  precursors: 'P2P and its scheduled precursors BMK glycidate and BMK glycidic acid, whose international scheduling produced an immediate shift to other unscheduled pre-precursors — a well-documented example of the control treadmill.',
  impurities: 'Leuckart production leaves a characteristic marker set that forensic labs use to link batches. The practical issue for a person is different: illicit amphetamine in Europe is typically sold at low purity as a damp paste or powder, heavily cut with caffeine and creatine, so the labelled gram bears no relation to the active dose. Like P2P methamphetamine, the route gives a racemate, whereas prescribed dexamfetamine is the single active enantiomer.',
  supply: 'The gap between prescribed dexamfetamine and street "speed" is not a difference of degree: different enantiomer content, different purity, different cutting agents, and no dose figure that means anything.'
},

mdma: {
  origin: 'Fully synthetic, from precursors that trace back to a plant oil.',
  route: 'Historically made from safrole, the oil of the sassafras tree, by way of the ketone MDP2P. With safrole controlled, production moved to PMK glycidate and then, as that was scheduled in turn, to further pre-precursors. Illicit MDMA is racemic.',
  precursors: 'Safrole, PMK and PMK glycidate — a textbook sequence of scheduling followed by substitution. Safrole control had a real environmental dimension, since sassafras oil production drove logging in Southeast Asia.',
  impurities: 'Historically the classic MDMA problem was substitution rather than contamination: tablets sold as ecstasy containing PMA or PMMA, which are slower in onset and far more dangerous, and which killed people who redosed because "nothing was happening". Contemporary European MDMA is generally high purity, and the hazard has inverted — tablets now routinely exceed 150 mg and sometimes 250 mg of genuine MDMA, so overdose comes from the real drug being present in quantity rather than from a fake. The route also leaves MDA and related analogues as by-products in some batches.',
  supply: 'A high-purity market is not a safe market. The dose in a modern pressed tablet is frequently more than one sitting should contain, and a tablet cannot be divided reliably without knowing what is in it.'
},

mephedrone: {
  origin: 'Fully synthetic. A substituted cathinone — the same skeleton as the khat alkaloid, with substitutions on the ring and the nitrogen.',
  route: 'A substituted cathinone route family, shared across essentially the whole cathinone class. That shared chemistry is why the class moves as it does: when one member is scheduled, the equivalent compound with a substituent moved one ring position is made instead, from nearly the same starting material.',
  precursors: 'Substituted propiophenones, most of them ordinary industrial chemicals that have only been scheduled reactively and incompletely.',
  impurities: 'Research-grade powder with no purity standard and considerable batch variation. Cathinones are frequently sold as, or mixed into, something else — MDMA and cocaine are the common cover stories — so people take them without knowing. Batch-to-batch potency variation is large enough that a measured dose from one supply is not a measured dose from the next.',
  supply: 'The 3-MMC / 4-MMC / 3-CMC sequence is the clearest example in this database of generic analogue legislation producing a treadmill: each scheduling event is followed within months by a positional isomer that is not covered and is not better characterised.'
},

'a-pvp': {
  origin: 'Fully synthetic. A pyrovalerone-type cathinone.',
  route: 'The pyrrolidinophenone family — a cathinone skeleton carrying a pyrrolidine ring. The same class chemistry as the other cathinones, with a substitution pattern that shifts it into potent dopamine and noradrenaline transporter blockade.',
  precursors: 'Substituted phenones and pyrrolidine, largely uncontrolled industrial chemicals.',
  impurities: 'No purity standard, and the pyrovalerone cathinones are potent enough that the gap between one dose and several is small in absolute terms. Sold both as itself and inside "bath salts" style mixtures where the contents are undeclared and inconsistent between packets carrying the same brand.',
  supply: 'The α-PVP / α-PHP / α-PiHP sequence is the same treadmill as the methcathinones, running on a homologous series where each new member differs by one carbon.'
},

methylphenidate: {
  origin: 'Fully synthetic. Manufactured pharmaceutically since the 1950s.',
  route: 'A piperidine-based phenylacetate ester, made industrially. Marketed originally as a racemate, with the dexmethylphenidate products isolating the active enantiomer.',
  precursors: 'Ordinary industrial chemicals.',
  impurities: 'Pharmaceutical grade where genuine. The related research chemicals in this database — ethylphenidate, isopropylphenidate, 4F-MPH — are ester or ring analogues made outside any pharmacopoeia, with no purity standard and, in the case of ethylphenidate, a documented history of severe injection-site injury.',
  supply: 'Genuine modified-release methylphenidate depends entirely on an intact release mechanism; crushing one converts a twelve-hour dose into an immediate one.'
},

caffeine: {
  origin: 'Both. Extracted from coffee and tea — much of the world supply is a by-product of decaffeination — and also manufactured synthetically at industrial scale.',
  route: 'Extraction from plant material, or industrial synthesis. The two are chemically identical and there is no way to distinguish them in the finished product.',
  precursors: 'Uncontrolled; caffeine is a food ingredient.',
  impurities: 'Not a purity issue. The real hazard is formulation: pure powdered caffeine is potent by volume in a way that catches people out badly, and deaths have occurred from teaspoon-scale measurement of bulk powder against a milligram-scale dose. Caffeine is also the most common cutting agent in this entire database, appearing in illicit amphetamine, cocaine and heroin.',
  supply: 'If a stimulant powder feels caffeine-heavy, that is very often exactly what it is.'
},

/* ================= Psychedelics ================= */

lsd: {
  origin: 'Semi-synthetic. Built from lysergic acid, which comes from ergot alkaloids — either from Claviceps purpurea, the fungus that infects rye, or from industrial fermentation of it.',
  route: 'Amide formation onto the lysergic acid core. The difficulty of the route is not the step, it is the starting material and the handling: the lysergamide core is sensitive to light, heat, oxygen and moisture, and the stereochemistry is easily lost. That is why competent LSD production is rare, and why product from a good chemist is genuinely consistent.',
  precursors: 'Ergotamine and ergometrine, both internationally controlled and both with legitimate pharmaceutical use in obstetrics and migraine treatment. Access to ergot alkaloids is the entire bottleneck.',
  impurities: 'The classic LSD failure is not contamination but the wrong stereochemistry: only one of four possible isomers is active, and iso-LSD, the inactive epimer, forms readily on poor storage or careless handling. The blotter is the more practical variable — a tab is a piece of paper someone dipped, and dose per tab varies widely with no relationship to appearance or design. The old fear of strychnine on blotter is a myth with no analytical support and never made sense on dose grounds. The genuine substitution risk is an NBOMe compound sold as acid, which has killed people. LSD has no taste and NBOMes are markedly bitter — the only field check worth anything, and no substitute for a reagent test.',
  supply: 'A small number of competent producers supply a large share of the market, which is why genuine LSD is unusually consistent and why substitution is the main thing to test for.'
},

'1p-lsd': {
  origin: 'Semi-synthetic. A prodrug of LSD.',
  route: 'Acylation at the indole nitrogen of the lysergamide core. 1P-LSD is essentially LSD wearing a temporary substituent that the body removes — and that was, when it was introduced, not covered by the law.',
  precursors: 'The same ergot alkaloid supply that constrains LSD.',
  impurities: 'The lysergamide prodrugs are the most explicitly legislative compounds in this database — 1P-LSD, 1cP-LSD and 1V-LSD form a sequence, each introduced as the previous one was scheduled, differing only in the group the body strips off anyway. Purity is unregulated, but production has generally been by people with real chemistry, and dose behaviour tracks LSD closely.',
  supply: 'Usually sold on blotter, with the same dose uncertainty as LSD itself.'
},

psilocybin: {
  origin: 'Natural product. Made by the mushroom, principally Psilocybe species, and taken as the dried fruiting body rather than as an isolated compound.',
  route: 'No synthesis in the ordinary supply. Psilocybin is a tryptamine the fungus makes; the biosynthetic pathway has been characterised and transferred into microbial hosts for pharmaceutical production, and a total synthesis exists — Hofmann published one — but neither is what people are eating.',
  precursors: 'Not applicable to the mushroom supply. Pharmaceutical-grade psilocybin for clinical trials is made under GMP.',
  impurities: 'The variability here is biological rather than chemical, and it is large. Alkaloid content differs by species, by flush, between caps and stems, and between individual mushrooms from the same grow — several-fold differences are ordinary. Psilocybin is a prodrug dephosphorylated to psilocin, and psilocin degrades with age, light and poor drying, so old material is weaker unpredictably rather than uniformly. The serious hazard with wild-picked material is misidentification: several lethally hepatotoxic species are superficially similar, and there is no route back from that error.',
  supply: 'A dose measured in grams of dried mushroom is measuring the wrong thing, and there is no practical way to measure the right thing at home. Treat every new batch as unknown strength.'
},

dmt: {
  origin: 'Both. DMT occurs in many plants — Mimosa hostilis root bark and Psychotria viridis are the common sources — and is also straightforward to synthesise.',
  route: 'Extracted from plant material by acid-base separation, or made synthetically from tryptamine precursors. Ayahuasca is neither: it is a decoction combining a DMT-containing plant with a beta-carboline plant, and the pharmacology depends on the combination, since DMT taken orally alone is destroyed by monoamine oxidase before it reaches the brain.',
  precursors: 'The source plants are unrestricted in most jurisdictions even where DMT itself is controlled. Synthetic routes use tryptamine derivatives.',
  impurities: 'Plant extract varies in colour from white through yellow to orange-red depending on how thoroughly it was purified and what plant fats came with it; colour indicates purification quality, not potency, and residual solvent from careless extraction is a real concern in home-extracted material. The far more serious issue with ayahuasca is not purity but interaction: the beta-carbolines are MAO inhibitors, which makes any concurrent serotonergic drug — SSRIs above all — a serotonin syndrome risk.',
  supply: 'The MAOI component is the thing to take seriously. It changes what every other drug in the body does.'
},

mescaline: {
  origin: 'Natural product. From peyote (Lophophora williamsii), San Pedro and Peruvian torch cacti — and also made synthetically.',
  route: 'Extraction from cactus tissue, or synthesis from trimethoxy-substituted aromatic precursors. Mescaline was the first psychedelic isolated and then synthesised, in 1897 and 1919 respectively.',
  precursors: 'The cacti are legal to grow in most places. Synthetic routes use standard aromatic chemicals.',
  impurities: 'Alkaloid content in cactus varies enormously with species, age and growing conditions, so dosing by weight of plant material is unreliable in the same way as mushrooms. Peyote specifically is a conservation problem — a slow-growing species under real pressure from harvesting, with religious significance to Native American practice that commercial harvesting damages. San Pedro grows fast and is the responsible alternative.',
  supply: 'Powder sold as mescaline very often is not: the required dose runs to hundreds of milligrams, which makes substitution with something active at a lower dose commercially attractive.'
},

'2c-b': {
  origin: 'Fully synthetic. A phenethylamine from Alexander Shulgin, first made in 1974.',
  route: 'A substituted phenethylamine of the 2C family, all built on the same 2,5-dimethoxyphenethylamine core and differing in what sits at the 4-position. The whole family shares its route chemistry, which is why the compounds arrived together and why law treats them as a class.',
  precursors: 'Substituted benzaldehyde and phenethylamine intermediates from industrial chemistry.',
  impurities: 'Made clandestinely to no standard, but the more useful fact is dose sensitivity: 2C-B has a steep dose-response, and the difference between a moderate and a heavy experience is smaller than the difference in appearance between two pressed pills. The tablet form is where most of the inconsistency lives.',
  supply: 'The dangerous relatives are the NBOMes, which are 2C compounds carrying an N-benzyl group and are active at a far lower dose — a powder sold as 2C-B that is actually an NBOMe is a serious overdose risk. Reagent testing distinguishes them.'
},

'25i-nbome': {
  origin: 'Fully synthetic. Created as a research tool for mapping serotonin receptors, not as a recreational compound.',
  route: 'N-benzylation of a 2C phenethylamine. That single added group raises receptor affinity by orders of magnitude and turns a milligram-dose compound into a microgram-dose one.',
  precursors: 'The 2C compounds themselves, plus benzyl intermediates.',
  impurities: 'The lethal property is not an impurity, it is potency combined with the delivery format. NBOMes are sold on blotter, where dose depends entirely on how evenly a microgram-active solution was distributed across paper. Uneven dipping means tabs from the same sheet differ several-fold. NBOMes have killed people — through vasoconstriction and seizure — at doses only modestly above the active one, which is not true of LSD, and they are routinely sold as LSD.',
  supply: 'Bitter taste is the field indicator, since LSD is tasteless. This is one of the few places in this database where a blotter tab genuinely needs a reagent test before it goes near a mouth.'
},

/* ================= Dissociatives ================= */

ketamine: {
  origin: 'Fully synthetic. Developed at Parke-Davis in 1962 as a replacement for PCP, which had proved unusable in humans because of its emergence reactions.',
  route: 'An arylcyclohexylamine built on a cyclohexanone core. Manufactured pharmaceutically as a racemate, with esketamine — the S-enantiomer — isolated as a separate licensed product.',
  precursors: 'Cyclohexanone and substituted phenyl intermediates, which are ordinary industrial chemicals. Precursor control is weak for this class because the feedstocks have vast legitimate use.',
  impurities: 'Most illicit ketamine is diverted pharmaceutical product, particularly veterinary and Indian pharmaceutical supply, and is therefore genuinely ketamine at genuine purity. Where it is clandestinely produced, the concerning finding in recent European testing is 2-FDCK and DCK sold as ketamine — analogues with different potency and duration, so a person dosing by their usual ketamine measure is dosing something else. The route also gives a racemate, and the two enantiomers differ in potency and in how much dysphoric emergence they produce.',
  supply: 'One of the few compounds here where the street supply is frequently the real pharmaceutical article. The analogues are the thing to test for.'
},

'3-meo-pcp': {
  origin: 'Fully synthetic. An arylcyclohexylamine from the PCP family rather than the ketamine family.',
  route: 'A substituted phencyclidine — the PCP skeleton with a methoxy group on the aromatic ring. The same structural class as PCP, and considerably more potent than it.',
  precursors: 'Piperidine and substituted phenyl intermediates.',
  impurities: 'Research-grade powder with no standard. The specific danger of this compound is dosing: it is active in the low milligram range, considerably stronger than ketamine by weight, and has a long and variable duration with a slow onset that invites redosing. Deaths have occurred where it was measured as though it were ketamine.',
  supply: 'Not interchangeable with ketamine in any respect, despite being sold alongside it. A ketamine-sized measure is a heavy dose.'
},

pcp: {
  origin: 'Fully synthetic. Developed in the 1950s as a surgical anaesthetic and abandoned for human use.',
  route: 'The original arylcyclohexylamine — a piperidine on a cyclohexane ring bearing a phenyl group. Everything in the 3-MeO-PCP and MXE lineage is a variation on this scaffold.',
  precursors: 'Piperidine and cyclohexanone derivatives; piperidine is controlled as a precursor in several jurisdictions specifically because of this.',
  impurities: 'Clandestine PCP has a long history of poor purification, and residual intermediates from an incomplete route are themselves irritant and toxic. PCP is frequently applied to plant material and smoked, where dose control is essentially absent — how much sits on a given portion of leaf is unknown.',
  supply: 'Material sold as PCP is inconsistent, and the dissociative sold under that name in a given market is frequently a different arylcyclohexylamine entirely.'
},

/* ================= Depressants ================= */

ghb: {
  origin: 'Fully synthetic — and also an endogenous compound, present naturally in the human brain in small amounts.',
  route: 'GHB is made from GBL, an industrial solvent, by opening the lactone ring. The reason this matters is not the chemistry: it is that GBL and 1,4-butanediol both convert to GHB inside the body, so all three are effectively the same drug delivered by different chemical routes, with different lag times and different volumes for an equivalent dose.',
  precursors: 'GBL, a genuine industrial solvent with large legitimate use in cleaning products and plastics manufacture, which makes it very hard to control. 1,4-BD likewise.',
  impurities: 'Home conversion of GBL frequently leaves the product strongly alkaline from unreacted base, which causes chemical burns to the mouth, throat and stomach. Incomplete conversion leaves a mixture of GHB and unreacted GBL, and GBL is roughly two to three times stronger by volume — so a dose measured for GHB from a partially converted batch can be a large overdose. This is the most important entry in this file: the danger is not exotic contamination, it is that a clear liquid gives no indication of its concentration.',
  supply: 'GHB has the narrowest margin between an active dose and unconsciousness of anything in this database, and that margin is measured in millilitres. Concentration varies between batches with no way to tell by looking. With alcohol it becomes markedly more dangerous, and that combination is behind most GHB deaths.'
},

alprazolam: {
  origin: 'Fully synthetic. A triazolobenzodiazepine, manufactured pharmaceutically since the early 1980s.',
  route: 'A benzodiazepine core with a fused triazole ring. The whole class shares a scaffold that is well documented, easily varied, and — this is the operative fact — easily varied into compounds that have never been given to a human.',
  precursors: 'Standard industrial intermediates. Benzodiazepine precursors are poorly controlled relative to how easily the class is made.',
  impurities: 'Genuine tablets are pharmaceutical grade at an exact dose. Counterfeit alprazolam is one of the largest drug-safety problems in this database: tablets pressed as Xanax routinely contain a designer benzodiazepine such as flualprazolam or bromazolam at unknown dose or, increasingly, a nitazene opioid. Someone taking what they believe is a benzodiazepine and receiving an opioid has no reason to have naloxone nearby.',
  supply: 'A loose tablet bearing a Xanax imprint tells you only that someone owned a pill press.'
},

etizolam: {
  origin: 'Fully synthetic. A thienotriazolodiazepine — a licensed medicine in Japan, India and Italy, and an unlicensed research chemical everywhere else.',
  route: 'A benzodiazepine-like scaffold in which the benzene ring is replaced by a thiophene. Functionally a benzodiazepine; structurally just outside older legal definitions, which is why it circulated as legal for years.',
  precursors: 'Industrial intermediates, with bulk supply historically from pharmaceutical manufacturing in India.',
  impurities: 'Sold as bulk powder and as pellets pressed by intermediaries, and the pellet stage is where the harm enters. Dosing a powder active in the low milligram range by eye does not work, and the "hot pellet" problem — uneven distribution through a binder — is the same failure mode as fentanyl in a diluent. On its own it produces overdoses rather than deaths, but it kills readily in combination with opioids or alcohol.',
  supply: 'The designer benzodiazepines as a group — flualprazolam, bromazolam, flubromazolam, clonazolam — exist because generic legislation is hard to write for a scaffold this modifiable. Several are active at fractions of a milligram, and none have human safety data.'
},

alcohol: {
  origin: 'Fermentation, with distillation for spirits. The oldest manufacturing process in this database and the only one most people have watched happen.',
  route: 'Yeast converts sugar to ethanol; distillation concentrates it. Nothing clandestine is required and the process is not a control point anywhere.',
  precursors: 'Sugar and yeast.',
  impurities: 'Commercial production is regulated and the congener profile is a flavour matter rather than a safety one. Illicitly distilled spirits are a genuine and recurring killer: methanol contamination — from bad distillation practice, or from deliberate adulteration of counterfeit spirits with industrial methanol — causes blindness and death, and mass poisoning incidents occur regularly worldwide. Methanol cannot be tasted or seen in spirits.',
  supply: 'For anything from a regulated supply chain the labelled percentage is accurate, which makes alcohol nearly unique here. For unlabelled spirits from an informal source, it is not.'
},

/* ================= Cannabinoids ================= */

thc: {
  origin: 'Natural product. Made by the cannabis plant, mostly as the acid THCA, which converts to THC on heating.',
  route: 'Grown, not made. Extracts and concentrates are separations rather than syntheses — the cannabinoid is pulled out of plant material by solvent, pressure or heat.',
  precursors: 'Not applicable. Concentrate production uses hydrocarbon or CO2 solvents at industrial scale, and hydrocarbon extraction outside a proper facility causes a steady stream of explosions and burns.',
  impurities: 'For plant material: pesticide residue, mould, and — in illicit markets — sprayed synthetic cannabinoids sold as high-strength cannabis, which is not a potency difference but a different and far more dangerous class of drug. For concentrates: residual solvent from inadequate purging, the standard hazard of home-made extracts. Vaping products carry their own history — the 2019 EVALI outbreak was caused by vitamin E acetate used as a thickener in illicit THC cartridges, not by cannabinoids.',
  supply: 'Potency of flower has risen substantially over decades while the CBD fraction has fallen, so an old frame of reference for "a joint" understates the dose considerably.'
},

'delta-8-thc': {
  origin: 'Semi-synthetic, and this is the whole story of the compound. Delta-8 occurs in cannabis only in traces — essentially all commercial delta-8 is made from CBD.',
  route: 'Acid-catalysed isomerisation of CBD, which is cheap and abundant from hemp. The commercial existence of delta-8 is a legal artefact: hemp-derived CBD is unrestricted in the United States, so converting it into an intoxicating cannabinoid produced a product arguably outside the controlled-substances framework.',
  precursors: 'Hemp CBD, uncontrolled and produced in surplus.',
  impurities: 'The defining problem. The isomerisation is not clean — it produces delta-9-THC, delta-10 and a spread of other cannabinoid isomers, many of which have never been in a human before and none of which have toxicology behind them. Independent testing has repeatedly found residual acid catalyst, unreacted CBD and heavy metals in retail delta-8 products. Because the industry grew in a regulatory gap, there is no purity standard and no requirement to test.',
  supply: 'The same conversion chemistry produces the whole hemp-derived cannabinoid market — delta-10, HHC, THC-O and the rest — with the same impurity concern across all of them. THC-O is an acetate ester, and the EVALI experience showed that inhaling acetate compounds is a specific and poorly characterised lung risk.'
},

'jwh-018': {
  origin: 'Fully synthetic. From academic research into cannabinoid receptor pharmacology, taken up by the "spice" market once the papers were public.',
  route: 'An aminoalkylindole. Structurally nothing like THC — a completely different scaffold that happens to bind the same receptor, and binds it as a full agonist where THC is a partial one. That difference is the entire reason synthetic cannabinoids hurt people in ways cannabis does not.',
  precursors: 'Indole intermediates from ordinary industrial chemistry, largely uncontrolled.',
  impurities: 'The severe hazard is not chemical contamination, it is the delivery format. These compounds are dissolved in solvent and sprayed onto inert plant material, and the spray does not distribute evenly. Two pinches from the same bag can differ by a large multiple, and the compounds are active in low milligram amounts. That is the mechanism behind mass-casualty incidents where dozens of people collapse from one batch.',
  supply: 'A fast-moving series — JWH-018, AM-2201, XLR-11, the PINACA and BUTINACA families, CUMYL-PEGACLONE — each generation appearing as the previous is scheduled, each with less human data than the last. Seizures, kidney injury and deaths have followed several of them, and the current generation is far more potent than the first.'
},

/* ================= Plant material ================= */

kratom: {
  origin: 'Natural product. The leaf of Mitragyna speciosa, a Southeast Asian tree in the coffee family.',
  route: 'Dried and powdered leaf. No processing beyond drying and grinding for the traditional product; extracts concentrate the alkaloids by solvent.',
  precursors: 'Not applicable.',
  impurities: 'Alkaloid content varies with tree, region, leaf age and drying method, so plain leaf powder is inconsistent in the same way mushrooms are. The larger issue is the extract and "enhanced leaf" market: concentrated products, particularly those enriched in 7-hydroxymitragynine, are pharmacologically a different proposition from leaf and carry markedly greater dependence liability. Salmonella and heavy metal contamination have both been documented in retail kratom, and adulteration of "kratom" products with synthetic opioids has occurred.',
  supply: 'Leaf and concentrated extract are sold under the same word and are not the same drug. The 7-OH products in particular should be read as a different substance.'
},

khat: {
  origin: 'Natural product. The fresh leaves and shoots of Catha edulis, chewed in East Africa and the Arabian Peninsula.',
  route: 'Nothing. The plant is chewed fresh.',
  precursors: 'Not applicable.',
  impurities: 'The pharmacology is governed by decay rather than contamination: cathinone, the more active alkaloid, degrades to cathine within days of harvest, so khat weakens as it ages and the trade depends on air freight. Pesticide residue is a documented concern in commercially grown khat.',
  supply: 'The synthetic cathinones in this database take their name and their skeleton from this plant, but a substituted cathinone made in a lab is not comparable to chewed leaf in potency, route or risk.'
}

});

/* ==========================================================================
   faq.js — the FAQ content
   --------------------------------------------------------------------------
   Kept as data rather than markup so the FAQ tab can search and group it, and
   so questions can be added without touching UI code.

   Answers are written for someone who is confused right now, not as marketing
   copy. Where the honest answer is "this is an estimate and here is how it can
   be wrong", that is what it says.
   ========================================================================== */
window.FAQ = [

{ group: 'The Now tab', q: 'Why is there methamphetamine in my log? I did not put it there.',
  a: 'Because this is your first visit and the app added an example so there would be something to look ' +
     'at. It is two doses of one substance — 20 mg a day ago and 10 mg an hour ago — chosen because a ' +
     'redose stacking on an unfinished tail demonstrates most of what the model does in one screen. ' +
     'Nothing about it is yours and nothing was sent anywhere. The notice at the top of the Now tab has a ' +
     'button that clears it, and once cleared it does not come back.' },

{ group: 'The Now tab', q: 'What does the Now tab show?',
  a: 'Everything the model believes is in you at this moment, and how that changes over time. It has three pages. ' +
     'CURRENTLY ON BOARD is a card per substance with its effect level, how much is left, and when it clears. ' +
     'TIMELINE draws the same information against a clock, so you can scrub to any past or future moment. ' +
     'DOSE HISTORY is the log itself, searchable. Logging a new dose is the button at the top of the tab.' },

{ group: 'The Now tab', q: 'What does "Currently on board" mean?',
  a: 'The substances the model estimates are still present, based on when you logged them and how fast that ' +
     'compound clears. A dose stays on board until roughly 97% of it is gone, which is about five half-lives — ' +
     'and it also stays for as long as anything it TURNED INTO is still active, because a dose does not stop ' +
     'mattering when the compound does. Heroin is 97% cleared twenty minutes after an injection and the ' +
     'morphine runs for hours. It is a MODEL, not a measurement: it knows what you told it you took and the ' +
     'population-average kinetics for that compound, and nothing else about you beyond the profile settings.' },

{ group: 'The Now tab', q: 'What does Combined vs Separate mean?',
  a: 'It is the "Display doses/metabolites" control at the top of the Now tab. SEPARATE treats every dose as its ' +
     'own event with its own onset and offset, so three doses of the same thing give three rows and three cards. ' +
     'COMBINED merges the doses of each substance into one, summing the effect and the amount remaining. ' +
     'Separate is the honest default; combined is what you want after redosing, when you need to see what the ' +
     'total is doing rather than adding three rows up by eye. It applies to the timeline, the metabolites, the ' +
     'cards and the dose detail at once, so no two parts of the screen ever disagree about how much is on board.' },

{ group: 'The Now tab', q: 'How does the timeline work?',
  a: 'One line chart carrying every curve: each dose, or each substance in combined mode, plus the active ' +
     'metabolites they produce, with a tick on the axis for every dose. Click or drag anywhere on it to move ' +
     'the cursor to that moment, past or future, and everything below updates to describe that instant rather ' +
     'than now. The window dropdown controls how much time is shown, from 12 hours to 30 days. It used to be ' +
     'a chart of phase bands, one bar per dose — that answered which phase you were in and flattened every ' +
     'magnitude, so a threshold dose and a heavy one drew the identical rectangle.' },

{ group: 'The Now tab', q: 'What do the three Y axis settings do?',
  a: 'EFFECT is modelled subjective intensity. PERCENT draws every curve as a share of its own peak, so each ' +
     'tops out at 100% — the readable default, good for shape and timing, at the cost that heights cannot be ' +
     'compared between curves. MG is milligram-equivalents in the body on one shared axis, so a curve twice as ' +
     'high really is twice as much material. The legend reports the real milligrams whichever you pick.' },

{ group: 'The Now tab', q: 'How do I see what each curve is worth at a given moment?',
  a: 'Hover the chart and hold still for about half a second. A readout appears at the pointer and follows ' +
     'it, listing every compound present at the moment under the pointer, largest first, in whatever the Y ' +
     'axis is showing. It reports where you are POINTING, not where the scrub cursor is parked — so you can ' +
     'read the chart without disturbing the cards below, which answer for the cursor. Anything not present ' +
     'is left out rather than listed as a dash. On a touchscreen it is suppressed, because a tooltip under a ' +
     'finger is hidden by the finger; tap to move the cursor instead.' },

{ group: 'The Now tab', q: 'How do I jump to a specific time on the timeline?',
  a: 'Type it into the "Jump to" field above the chart. The slider, the arrows and the Now button are all up ' +
     'there too, along with the cursor time itself in large figures with how far it is from now beside it. A ' +
     'time outside the visible window clamps to the edge of it — widen the window with the dropdown to reach ' +
     'further back or further forward.' },

{ group: 'The Now tab', q: 'What is on a card when I scrub the timeline?',
  a: 'When it was taken and how much, the half-life being used, two meters, a plasma concentration, and what ' +
     'it has turned into. ABSORBED runs against everything that route puts into the body. ELIMINATED runs ' +
     'against that same total, because what arrived is exactly what has to be cleared. Both name their two ' +
     'quantities underneath, since a percentage of an unstated total is not an answer. Cards are ordered by ' +
     'when each compound first turned up in the circulation, so a chain reads top to bottom in the order it ' +
     'actually happened.' },

{ group: 'The Now tab', q: 'Why does the Absorbed meter disappear?',
  a: 'Because it is finished. A bar pinned at 100% is not a readout — it says the same thing at every moment ' +
     'for the rest of the card\'s life. So it goes once the dose is in, and for an injection it never appears ' +
     'at all, which is the point: absorption is not a process worth a meter for something delivered straight ' +
     'into a vein. The quantity is not lost, because the meter beneath carries the same total.' },

{ group: 'The Now tab', q: 'Why did a card disappear from the timeline?',
  a: 'A card leaves at the moment its own Eliminated meter would read 100%, so nothing sits there claiming to ' +
     'be finished. The meter rounds, so the cut is at 99.5% and the highest figure a card can show is 99%. ' +
     'Half a percent of a dose is not nothing, and that is the honest trade against a card that otherwise ' +
     'stays for weeks getting emptier. A parent leaving does not take its metabolites with it: two hours after ' +
     'swallowing heroin there is no heroin and about five milligrams of morphine, so the heroin card goes and ' +
     'the morphine card stays.' },

{ group: 'The Now tab', q: 'What is the concentration on each card, and why is it mine?',
  a: 'Every published therapeutic range and toxic level is written as a concentration, so a milligram figure ' +
     'has to be divided by a volume before it can be compared with any of them. That volume is the compound\'s ' +
     'VOLUME OF DISTRIBUTION scaled by your body mass — the volume the body behaves as if the drug were ' +
     'dissolved in, which is 0.6 L/kg for ethanol (genuinely body water) and 10 L/kg for THC (mostly fat). ' +
     'Two people who took the same dose do not read the same number here.' },

{ group: 'The Now tab', q: 'What does "upper bound" mean under a concentration?',
  a: 'That no volume of distribution is recorded for that compound, so the figure was divided by your plasma ' +
     'volume instead — estimated from your weight and height by Boer\'s equation, which is also why sex is ' +
     'asked for and is used for nothing else. Vd is larger than plasma volume for everything in this database, ' +
     'so the real figure is lower and often by a lot. A metabolite with no Vd of its own borrows its parent\'s ' +
     'and says so, because that is wrong by a factor of two or three where plasma volume would be wrong by a ' +
     'hundred.' },

{ group: 'The Now tab', q: 'What are the therapeutic / toxic / fatality bands?',
  a: 'Population plasma concentrations reported for that compound, so the number on the card can be compared ' +
     'with something. THE TOP BAND IS NOT A LETHAL DOSE. It is called "seen in fatalities" because that is ' +
     'all it is — an observation about a population — and for opioids and benzodiazepines tolerance moves it ' +
     'further than the width of the bands themselves: concentrations that kill someone opioid-naive are ' +
     'routine in someone dependent, and two weeks off loses that. They are drawn as a list rather than a dial ' +
     'for the same reason. Compounds whose bands would mislead more than they help have none.' },

{ group: 'The Now tab', q: 'How accurate is the concentration?',
  a: 'It is a modelled figure, not a measurement, and a one-compartment one at that. Haematocrit varies by a ' +
     'fifth between healthy adults; Vd itself is a range rather than a constant and shifts with time after ' +
     'the dose for anything that redistributes into fat; and the whole thing rests on you having logged what ' +
     'you actually took. Right order of magnitude, not a lab result.' },

{ group: 'The Now tab', q: 'What is the Steady state page for?',
  a: 'Everything else in the app answers "what is one dose doing". This answers "what happens if I keep ' +
     'doing this", which is a different question and the one that catches people out. Give it a substance, ' +
     'dose and interval and it works out the accumulation ratio, the peak and trough once it levels off, and ' +
     'how long that takes. Anything whose dosing interval is shorter than its half-life accumulates: take ' +
     'diazepam once and it is a 43-hour compound, take it nightly and the nordazepam is still climbing on ' +
     'day ten. Nothing on the page is logged — it is a hypothetical about a schedule you have not taken.' },

{ group: 'The Now tab', q: 'Why does the Steady state page warn about a metabolite?',
  a: 'Because the thing still climbing is usually not the drug you took. The page sets its horizon from the ' +
     'longest-lived compound in the picture rather than from the parent, and says so when they differ — ' +
     'diazepam levels off in about a week and its nordazepam takes a month. That gap is why dose adjustments ' +
     'made in the first few days of a schedule are being made before the drug has finished arriving, and why ' +
     'methadone deaths cluster during induction rather than after it.' },

{ group: 'About', q: 'Does tolerance to one drug count towards another?',
  a: 'Yes, and the Patterns tab now counts it. Every compound belongs to a cross-tolerance group, and doses ' +
     'of anything in the same group build tolerance to the rest of it — weighted by how far the adaptation ' +
     'actually transfers. Near-complete for GABAergics (benzodiazepines, alcohol, barbiturates and Z-drugs ' +
     'share a receptor complex, which is why a benzodiazepine treats alcohol withdrawal) and for the ' +
     'classical psychedelics; high but incomplete for opioids, which is exactly why rotation works and why ' +
     'switching at an equianalgesic dose can overdose someone. Doses are normalised to each compound\'s own ' +
     'common dose first, so potency is already handled. A row showing "+ Alprazolam" is telling you where ' +
     'its tolerance came from.' },

{ group: 'About', q: 'Does tolerance protect me?',
  a: 'Only from the part you notice. Tolerance to the subjective effect builds far faster and further than ' +
     'tolerance to respiratory depression, and cardiovascular load barely tolerates at all — so the dose ' +
     'needed to feel something climbs while the dose that stops you breathing moves much less. That gap ' +
     'closing is what a fatal overdose in a long-term user usually is. Tolerance also disappears much faster ' +
     'than it built: a fortnight away from opioids costs most of it, which is why the period after detox or ' +
     'release from custody is the most dangerous time to use a familiar dose.' },

{ group: 'About', q: 'Why does the profile ask about six CYP enzymes separately?',
  a: 'Because a genotype affects one enzyme at a time, and the difference matters. Codeine is cleared largely ' +
     'by CYP2D6 and diazepam largely by CYP2C19, so a slow 2D6 setting should change one and not the other — ' +
     'a single setting applied to all CYP clearance moved both. Set 2D6 slow and codeine\'s half-life goes to ' +
     '1.12x while diazepam does not move; set 2C19 slow and diazepam goes to 1.57x while codeine does not. ' +
     'Lorazepam, which is cleared by UGT and never touches CYP, is untouched by any of it. "Set all to" is ' +
     'still one click if you only have one figure to go on.' },

{ group: 'Metabolites', q: 'What is the difference between a dose and a metabolite?',
  a: 'The dose is what you took. A metabolite is what your body turned it into. The distinction matters because ' +
     'they do not share a schedule and often do not share a pharmacology: heroin is undetectable within minutes ' +
     'while the morphine it became is still climbing, and the nordazepam from diazepam is still rising three days ' +
     'later. If you are still feeling something after the parent compound should be gone, a metabolite is usually ' +
     'the reason.' },

{ group: 'Metabolites', q: 'What is the difference between active and inactive metabolites?',
  a: 'An ACTIVE metabolite still does something at the receptor, so it contributes to the effect and to the risk. ' +
     'An INACTIVE one does not, and is on its way out. Morphine-6-glucuronide is active and roughly twice as ' +
     'potent as morphine itself; morphine-3-glucuronide, made by the same enzyme in the same step, is inactive at ' +
     'the opioid receptor. Inactive does not mean harmless — M3G is neuroexcitatory and is implicated in the ' +
     'myoclonus and hyperalgesia seen at high cumulative doses.' },

{ group: 'Metabolites', q: 'How is a metabolite activity determined?',
  a: 'It is recorded per compound from the published pharmacology, not inferred. Where a single enzyme produces ' +
     'several products with different fates, activity is stated on each product individually, which is why one ' +
     'UGT2B7 pathway can show an inactive product beside an active one. Where nothing is known, the entry says so ' +
     'rather than guessing.' },

{ group: 'Metabolites', q: 'What do the metabolism pathways represent?',
  a: 'Each row is one enzyme performing one reaction, and the products that come out. Most act on the parent ' +
     'compound; some act on something it already made, and say so — the step that turns diazepam\'s ' +
     'nordazepam into oxazepam is a reaction on the nordazepam, not on the diazepam. Line ' +
     'thickness is proportional to the share of the dose taking that route. A pathway can fork — one enzyme, ' +
     'several products — and is drawn that way rather than as duplicate rows, because repeating the enzyme would ' +
     'imply two independent routes when there is only one. Click an enzyme to see everything else it handles; ' +
     'click a product to see that metabolite in detail.' },

{ group: 'Metabolites', q: 'Are the metabolites of metabolites modelled too?',
  a: 'Yes, to any depth the data supports. Methamphetamine becomes amphetamine, which becomes ' +
     '4-hydroxyamphetamine, which becomes 4-hydroxynorephedrine; gidazepam is a prodrug, so the compound you ' +
     'actually have is a second-generation product and everything below it would otherwise be invisible. Each ' +
     'card says what made it rather than what you took, which after the first generation is usually another ' +
     'metabolite. Where several routes converge on one compound they are summed into a single card, because ' +
     'the body has one pool of oxazepam and not three, and the card names every precursor feeding it.' },

{ group: 'Metabolites', q: 'Why does the same drug produce different metabolites by different routes?',
  a: 'Because where a dose is delivered decides whether the liver gets a shot at it before the rest of the ' +
     'body does. Injected, smoked and insufflated drug enters the systemic circulation directly and skips the ' +
     'first pass entirely; rectal drug avoids roughly 50-70% of it and sublingual 60-80%; swallowed drug ' +
     'avoids none. Swallowed heroin is the extreme case — presystemic deacetylation runs all the way to ' +
     'morphine before anything reaches the circulation, so there is no 6-MAM spike and no rush, which is the ' +
     'whole difference between swallowing it and injecting it. A route can carry its own set of products for ' +
     'exactly this reason.' },

{ group: 'Metabolites', q: 'Why is more metabolite made than the dose I took?',
  a: 'It should not be, and if you see it, it is a bug worth reporting. Amounts are parent-dose EQUIVALENTS ' +
     'rather than true masses — they are not corrected for molecular weight — so a chain can legitimately ' +
     'show most of a dose as one product and most of that as the next. What cannot happen is a total that ' +
     'exceeds the parent it was made from, and the model enforces that: products are a share of a pool, and ' +
     'where an entry declares shares adding up past 100% they are scaled to fit.' },

{ group: 'Substances', q: 'How do I open a substance detailed page?',
  a: 'Click its name anywhere it appears — on a card, in the log, in an interaction, in a solution ingredient ' +
     'list, or from the Substances tab. The Substances tab keeps a search box at the top and is split into pages ' +
     'by class: opioids, cannabinoids, stimulants, psychedelics, metabolites, and everything else.' },

{ group: 'Substances', q: 'How can I view the structure of a compound?',
  a: 'The skeletal structure is drawn at the top of the substance page wherever one is recorded. Click it to ' +
     'enlarge and see the SMILES string it was drawn from. Carbons are the unlabelled vertices and hydrogens on ' +
     'carbon are implicit, which is the standard convention. STEREOCHEMISTRY IS NOT DRAWN — there are no wedge or ' +
     'hash bonds, so enantiomers look identical here. Where that difference matters, and for several compounds it ' +
     'is the difference between the medicine and the toxicity, the Isomers section carries it in words.' },

{ group: 'Substances', q: 'What does the Relative Strength comparison show?',
  a: 'How many milligrams of one compound correspond to a given amount of another. It shows the current substance ' +
     'against the standard reference for its class — morphine for opioids, diazepam for benzodiazepines — rather ' +
     'than every compound in the class at once. Potency here means HOW FEW MILLIGRAMS ARE NEEDED. It says nothing ' +
     'about how strong, dangerous or desirable the effect is: buprenorphine is about 30x morphine by this measure ' +
     'and simultaneously has a ceiling on respiratory depression that morphine lacks.' },

{ group: 'Substances', q: 'How do I add substances to a Relative Strength comparison?',
  a: 'Use the "Add a compound to compare" box in that section. Anything you add is placed on the same scale and ' +
     'stays until you remove it. The default is deliberately just two entries, because a chart of forty compounds ' +
     'answers no question anybody actually asked.' },

{ group: 'Substances', q: 'How do I search Notable Interactions?',
  a: 'That section is paginated at ten per page with a search box above it. Search by the other substance name, ' +
     'or by a class or mechanism word such as opioid, serotonergic or QT, to narrow the list. Only interactions ' +
     'at caution level or above are shown.' },

{ group: 'Interactions', q: 'What do the interaction colours mean?',
  a: 'They rank severity. Red is dangerous, meaning risk of death or serious injury. Orange is unsafe. Amber is ' +
     'caution. Blue means the pair potentiates. Grey means one drug blunts the other, or that nothing significant ' +
     'is recorded. Click any entry for the mechanism and the detail. AN ABSENT WARNING MEANS "NOT IN THIS ' +
     'DATABASE", NEVER "SAFE" — most combinations have never been studied, and novel compounds almost never have.' },

{ group: 'Solutions', q: 'How do I create a solution?',
  a: 'Open the Solution tab and add ingredients. Everything goes in the same way — actives, solvents and fillers ' +
     'alike — with the dose volume set alongside. Total volume, concentration and per-dose amounts all follow ' +
     'from what you put in. There is no separate step for solvents.' },

{ group: 'Solutions', q: 'How do I add or edit ingredients in a solution?',
  a: 'Use the Add ingredient button. To change something already in the mixture, open View ingredients and click ' +
     'its name; that opens an editor for its amount and units, with a link through to its substance page.' },

{ group: 'Solutions', q: 'Can I do this without a solvent, as a dry mix?',
  a: 'Yes — the Solution / Dry mix switch at the top of the tab. A dry mix drops the solvent entirely and ' +
     'works in mass fractions: cut an active into a filler, then weigh portions of the powder. 100 mg of ' +
     'alprazolam in 10 g of lactose makes a weighed 100 mg portion carry 990 µg. It solves the same problem ' +
     'as a solution — a compound active below what a scale can read — and it is what you need when nothing ' +
     'safe will dissolve the compound, or when the dose is going into a capsule anyway.' },

{ group: 'Solutions', q: 'Is a dry mix as good as a solution?',
  a: 'No, and the tab says so every time you use it. A liquid mixes itself and cannot separate. Two powders ' +
     'separate by particle size and density every time the jar is moved, so a scoop from a poorly mixed batch ' +
     'can carry several times what the arithmetic says — and the more dilute the mixture, the worse a clump ' +
     'of undiluted active is. No figure calculated from the masses can detect that, which is why the warning ' +
     'is always shown rather than triggered by a threshold. Dissolve and measure by volume wherever the ' +
     'compound and the route allow it.' },

{ group: 'Solutions', q: 'How small a portion can I actually weigh?',
  a: 'Bigger than you think. A "0.001 g" jeweller\'s scale displays a milligram and is honest to about five ' +
     'in real use once drift, air currents, an off-centre pan and linearity error are counted — so a 20 mg ' +
     'portion is a ±25% operation and a 100 mg one is ±5%. The Dry mix mode shows that as a Scale error ' +
     'figure and tells you what it costs in milligrams of the actual active. If the number is uncomfortable, ' +
     'add more filler so the weighed portion is larger; that is the entire point of diluting.' },

{ group: 'Solutions', q: 'How do I add solvents?',
  a: 'Exactly like any other ingredient: type its name — water, ethanol, DMSO, propylene glycol, glycerine — and ' +
     'give an amount. Solvents can be entered by weight or by volume because their density is known. A powdered ' +
     'active is mass-only, since a powder has no density the calculator could honestly convert with.' },

{ group: 'Solutions', q: 'How are solution percentages and mg/dose calculated?',
  a: 'Concentration is an ingredient mass divided by the TOTAL volume, and mg per dose is that concentration ' +
     'times the dose volume. The total volume includes the space the dissolved solids occupy, not just the ' +
     'solvent: 1814 g of sucrose adds about 1141 ml of its own, and ignoring that would understate every ' +
     'concentration in the mixture. Two percentages are reported because they answer different questions. ' +
     '"% of mass" is everything you weighed out, fillers and solvent included. "% of active mass" ignores the ' +
     'inactive ingredients and is what actually determines potency.' },

{ group: 'Solutions', q: 'What does the solution pH represent?',
  a: 'An estimate of how acidic or alkaline the finished mixture is, derived from the acids and bases you added. ' +
     'It matters for three reasons: many actives only dissolve as a salt at a particular pH, preservatives such ' +
     'as sodium benzoate only work below about pH 4.5, and anything going on a mucous membrane stings badly if it ' +
     'is far from neutral. It is an estimate from the components, not a measurement — use paper or a meter if it ' +
     'matters.' },

{ group: 'Solutions', q: 'How do I save or load a previous solution?',
  a: 'Save names the current mixture and stores it in this browser. Load brings one back, replacing whatever is ' +
     'in the calculator. Saved solutions live in localStorage alongside your dose log and never leave the machine, ' +
     'which also means clearing site data deletes them.' },

{ group: 'Solutions', q: 'How do I import or export solution data?',
  a: 'Export writes the mixture to a JSON file you can keep or move to another machine; import reads one back. ' +
     'This is the way to keep a recipe somewhere more durable than a browser profile.' },

{ group: 'Solutions', q: 'Why does it say something will not dissolve?',
  a: 'Because the amount you added is above what that solvent blend will actually hold. Solubility is strongly ' +
     'solvent-specific — sucrose dissolves at around 2000 mg/ml in water and about 10 mg/ml in ethanol, so a ' +
     'syrup that is stable as an aqueous solution drops its sugar once enough spirit goes in. Past the ceiling ' +
     'the excess crystallises out, which leaves the liquid weaker than calculated and a concentrated layer at the ' +
     'bottom. Between about 70% and 100% of the ceiling you get the more insidious warning instead: it stays ' +
     'dissolved while warm and comes out as it cools.' },

{ group: 'About', q: 'Is any of this medical advice?',
  a: 'No. Every number here is a population-level estimate and many are extrapolated from structural analogues ' +
     'rather than measured in humans; each one is labelled with its confidence. Individual metabolism varies ' +
     'enormously, and CYP2D6 genotype alone changes some half-lives roughly tenfold. This is a personal tracking ' +
     'and harm-reduction reference, not a dosing authority and not a substitute for a clinician or poison ' +
     'control. In an emergency call your local emergency number. US Poison Control: 1-800-222-1222.' },

{ group: 'About', q: 'Why is my half-life different from the textbook figure?',
  a: 'Two corrections are applied. First, enzyme interactions: if something else you logged inhibits an enzyme ' +
     'the compound depends on, the half-life is recomputed from the fraction of clearance running through that ' +
     'enzyme. Second, your profile: each CYP enzyme has its own metaboliser setting, and a half-life is scaled ' +
     'by how much of THAT compound runs through each of them — so a slow CYP2C19 moves diazepam a great deal ' +
     'and leaves codeine alone, while a slow CYP2D6 does the reverse. Lorazepam, cleared by UGT and never ' +
     'touching CYP, is untouched by any setting. Turn the profile adjustment off in settings to see raw ' +
     'population figures.' },

{ group: 'About', q: 'Why does heroin show only minutes of effect when it lasts hours?',
  a: 'Because the hours are not heroin. It has a three-minute half-life and is 97% cleared within twenty ' +
     'minutes; what you feel after that is 6-MAM and then morphine, and each of those now carries a curve of ' +
     'its own. The total duration is unchanged — at twenty-five minutes after an injection the parent is 11% ' +
     'of the combined effect and 6-MAM is 72% — it is just attributed to the compounds actually responsible ' +
     'for it. The dosing table still prints the 3-5 hours, because that is the experience and that is what a ' +
     'dosing table is for.' },

{ group: 'About', q: 'Why does the effect curve not always follow the amount in the body?',
  a: 'Because for most drugs it genuinely does not. The effect curve is built from reported onset, peak and ' +
     'duration windows rather than from concentration, and for several compounds the two diverge for real ' +
     'reasons: LSD outlasts its plasma curve because it comes off the receptor slowly, cannabis stores in fat ' +
     'for weeks while the high lasts hours. Where a compound has no such story — a short-lived parent whose ' +
     'effect is simply how much of it is there — the curve is taken from the amount instead, and says so.' },

{ group: 'About', q: 'Does any of my data leave this computer?',
  a: 'No. There are no network requests of any kind. The dose log, saved solutions and profile all live in this ' +
     'browser localStorage. The flip side is that clearing site data deletes them, so use the export buttons if ' +
     'you want anything kept.' },

{ group: 'About', q: 'Who made this website?',
  a: 'Claude (claude.ai, by Anthropic) wrote it, working from directions from (op).' }

];

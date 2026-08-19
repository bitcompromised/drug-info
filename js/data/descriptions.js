/* ==========================================================================
   descriptions.js — what each compound actually is, in prose
   --------------------------------------------------------------------------
   Every other data file here is numbers with a confidence marker. This one is
   the paragraph a person needs before any of those numbers mean anything:
   what the thing is, what it looks like in front of you, what people who take
   it consistently say about it, and what makes it less likely to hurt them.

   Four optional fields per compound:

     what     — what it is and what it does, in two or three sentences.
     looks    — physical appearance: colour, form, how it is usually sold.
                Always with the caveat that appearance identifies nothing.
     reports  — recurring themes from harm-reduction communities and the drug
                subreddits, summarised. These are self-reports about
                unverified substances, frequently in combination with
                something else, and the UI labels them as such. No specific
                post, user or thread is cited, because a summary of a theme is
                honest and an invented quotation is not.
     harm     — the practical things that reduce harm for THIS compound,
                beyond the generic advice.

   THE RULE FOR THIS FILE: nothing is invented. Where a compound is genuinely
   uncharacterised, it gets no entry and the popup says so rather than
   printing a plausible paragraph about a novel opioid nobody has studied.
   ========================================================================== */
DB.describe({

/* ================= Opioids ================= */

morphine: {
  what: 'The reference opioid — every other one is described by comparison with it. A phenanthrene alkaloid of the opium poppy, isolated in 1804, and still the drug hospitals reach for in severe acute pain. Full mu-agonist with no ceiling on respiratory depression, which is the whole of its danger.',
  looks: 'Pharmaceutical morphine is a white crystalline powder, sold as immediate-release tablets (often small and white), modified-release tablets, oral solution (frequently dyed) and clear ampoules. Illicit "morphine" street tablets are frequently something else entirely.',
  reports: 'Consistently described as the most "classic" opioid feeling — heavy warmth, itching around the nose and face, sedation, nausea on the first few exposures. People coming from oxycodone often report it as less euphoric and more sedating. Constipation is universally reported and gets worse, not better, with continued use.',
  harm: 'No ceiling on respiratory depression: there is no dose above which more stops mattering. Never combine with benzodiazepines, alcohol, gabapentinoids or other sedatives — that combination, not opioids alone, is what kills most people. Keep naloxone in the room and make sure someone else knows where it is. Tolerance falls fast after a break; a dose that was routine three weeks ago can be fatal today.'
},

codeine: {
  what: 'A weak opioid that is essentially a prodrug: roughly 5–10% is converted by CYP2D6 into morphine, and that morphine does nearly all of the analgesia. Everything about how codeine behaves in a given person is downstream of which CYP2D6 genotype they have.',
  looks: 'White tablets, usually combined with paracetamol or ibuprofen in over-the-counter formulations, and as red or clear syrups. The combination products are the danger — the paracetamol, not the codeine, is what causes liver failure in people taking large amounts for the opioid.',
  reports: 'Widely reported as unreliable: some people feel nothing at all (poor CYP2D6 metabolisers, roughly 5–10% of Europeans), others get a strong effect from a modest dose (ultrarapid metabolisers). Heavy itching is a very common complaint. Cold-water extraction to remove paracetamol is discussed constantly in harm-reduction communities and is a sign someone has already crossed into a dose range that is not safe.',
  harm: 'The paracetamol in combination tablets is the acute killer — over roughly 4 g in a day risks fatal liver injury, and there is no feeling of danger while it happens. Ultrarapid CYP2D6 metabolisers can convert enough to morphine to stop breathing on an ordinary dose; this is why codeine is contraindicated in children and in breastfeeding. It interacts sharply with CYP2D6 inhibitors such as fluoxetine, paroxetine and bupropion, which can abolish the effect entirely.'
},

heroin: {
  what: 'Diacetylmorphine — morphine with two acetyl groups that make it far more lipid-soluble, so it crosses into the brain in seconds rather than minutes. It is a prodrug: it is rapidly deacetylated to 6-monoacetylmorphine and then to morphine, which is what actually does the work and what lasts.',
  looks: 'Varies enormously by region. "Brown" is base-form heroin, tan to dark brown, usually smoked or requiring acid to dissolve. "White"/"China white" is the hydrochloride salt, off-white to beige powder. Colour tells you nothing about strength or content, and in North America and increasingly in Europe what is sold as heroin is frequently fentanyl or a nitazene with no heroin in it at all.',
  reports: 'The rush from injection is described as unlike anything else, which is exactly why the dependence liability is what it is. Community reports across the last decade are dominated by unpredictability of supply: the same bag from the same source killing someone who used the identical amount the week before. Nodding, itching and profound constipation are universal themes. Swallowing it is reported, consistently, as a disappointment — no rush, a slow morphine-like come-up, and the recurring conclusion that it was an expensive way to take morphine.',

  harm: 'Swallowed, it is morphine — the liver removes both acetyl groups before any of it reaches the brain, so there is no rush and onset takes 20-60 minutes. That wait is the specific oral hazard: people redose because nothing is happening, and the first dose lands on top of the second. Assume anything sold as heroin may contain fentanyl or a nitazene; fentanyl test strips are cheap and detect most (not all) analogues. Never use alone — most fatal overdoses happen with nobody present. Naloxone works, but a nitazene or a potent fentanyl analogue may need repeated doses and always needs an ambulance because the opioid can outlast the naloxone. Tolerance collapses within days of stopping: release from prison or hospital is the single highest-risk moment.'
},

oxycodone: {
  what: 'A semi-synthetic full mu-agonist, roughly 1.5 times as potent as morphine orally and with much better oral bioavailability. Partly metabolised by CYP2D6 to oxymorphone and by CYP3A4 to noroxycodone, though unlike codeine the parent drug is itself strongly active.',
  looks: 'Pharmaceutical tablets are colour- and marking-coded by strength and are widely counterfeited. Counterfeit "M30" blue tablets pressed with fentanyl have killed a very large number of people in North America; they are visually indistinguishable from genuine ones.',
  reports: 'Reported as more euphoric and less sedating than morphine, which is why it dominated the prescription-opioid era. Crushing modified-release tablets to defeat the release mechanism is a recurring theme and delivers the whole 12-hour dose at once.',
  harm: 'Any loose tablet sold as oxycodone should be treated as possible fentanyl until tested. CYP3A4 inhibitors — ritonavir, clarithromycin, grapefruit juice in quantity — meaningfully raise levels. Modified-release products must not be crushed, chewed or dissolved.'
},

tramadol: {
  what: 'An atypical opioid that is also a serotonin and noradrenaline reuptake inhibitor. Its opioid activity comes almost entirely from the CYP2D6 metabolite O-desmethyltramadol, which is roughly 200 times better at the mu receptor than tramadol itself. The monoamine half is not a side effect — it is half the drug.',
  looks: 'White or coloured tablets and capsules, widely available and widely counterfeited. In several countries it is the dominant illicit opioid.',
  reports: 'Reported as unlike other opioids: more stimulating, more "SSRI-like", with a body load people often dislike. Nausea is very commonly reported. The seizure risk is a persistent theme in community reports and is real.',
  harm: 'Lowers the seizure threshold at ordinary doses and much more at high ones, and this is not dose-proportional between people. Serious serotonin-syndrome risk with SSRIs, SNRIs, MAOIs, triptans and other serotonergics. CYP2D6 status changes both the opioid effect and the amount of serotonergic parent drug left circulating — poor metabolisers get less analgesia and more serotonergic load. Naloxone reverses the opioid part but not the seizures or the serotonin toxicity.'
},

fentanyl: {
  what: 'A synthetic full mu-agonist roughly 50–100 times as potent as morphine, with very fast onset and, on a single dose, a short duration because it redistributes into fat rather than because it is eliminated. Repeated dosing saturates that fat and the effective duration lengthens sharply.',
  looks: 'Pharmaceutically: clear ampoules, transdermal patches, lozenges. Illicitly: a white to off-white powder, or pressed into counterfeit tablets of any colour, and increasingly found mixed into other drugs including stimulants. It cannot be seen, smelled or tasted in a mixture.',
  reports: 'The dominant theme in every harm-reduction community for a decade is that fentanyl is present where nobody expects it. Users who prefer it describe a shorter, sharper effect and much more frequent redosing. Withdrawal is widely reported as coming on faster and feeling worse than from heroin.',
  harm: 'Doses that matter are measured in micrograms, and illicit powder is never mixed evenly — the same bag can be inert in one place and lethal in another ("hot spots"). Test strips detect many but not all analogues. Chest-wall rigidity can make ventilation difficult at high doses. Naloxone works but often needs repeat dosing; always call an ambulance. Transdermal patches contain far more drug than is delivered over the wear period and have killed people who chewed or extracted them.'
},

methadone: {
  what: 'A long-acting synthetic full agonist with an unusually long and extremely variable half-life, plus NMDA antagonism that is thought to contribute to its use in opioid dependence. Used both for maintenance treatment and for pain.',
  looks: 'Green, blue or clear oral solution in most maintenance programmes; also white tablets and dispersible tablets.',
  reports: 'Described as flat and non-euphoric compared with shorter-acting opioids, which is part of why it works for maintenance. Community reports consistently describe the withdrawal as the longest and hardest of any common opioid — weeks rather than days.',
  harm: 'The most dangerous property is that the analgesic effect wears off in hours while the drug itself persists for a day or more, so redosing to chase the effect accumulates towards a fatal level over several days. Most methadone deaths happen in the first two weeks of treatment for exactly this reason. It prolongs the QT interval and can cause torsades, especially above 100 mg/day or combined with other QT-prolonging drugs. Half-life varies between people from about 8 to over 60 hours.'
},

buprenorphine: {
  what: 'A partial mu-agonist with very high receptor affinity and a slow off-rate, plus kappa antagonism. The partial agonism gives it a ceiling on respiratory depression that makes it far safer than full agonists on its own; the high affinity means it displaces other opioids from the receptor.',
  looks: 'Sublingual tablets and films (often orange or white), transdermal patches, and combination products with naloxone. Also sold illicitly as loose films.',
  reports: 'The overwhelming theme is precipitated withdrawal: taking buprenorphine too soon after a full agonist throws people into abrupt, severe withdrawal because it knocks the other opioid off the receptor and only partly replaces it. Waiting until clear withdrawal has started is the standard advice everywhere. Many people report it as emotionally blunting over long periods.',
  harm: 'Do not take it until you are in objective withdrawal from any full agonist — the wait is longer after fentanyl or methadone than after heroin. Its ceiling effect does not protect against combination with benzodiazepines or alcohol, which still kills. Because of the high affinity, naloxone reverses it poorly; an overdose involving buprenorphine plus a sedative may need ventilation rather than naloxone. It is very long-acting and blocks other opioids for days.'
},

'o-dsmt': {
  what: 'O-desmethyltramadol, the CYP2D6 metabolite that gives tramadol nearly all of its opioid activity, sold as a research chemical in its own right. Roughly 200 times more potent at mu than tramadol and without tramadol\'s strong serotonergic parent-drug load, though it retains some noradrenergic activity.',
  looks: 'White powder, sometimes in capsules. Not a pharmaceutical product anywhere, so there is no reference appearance and no quality control.',
  reports: 'Reported as a much cleaner opioid than tramadol — less of the stimulating, jittery quality — and as unusually easy to become dependent on because it is orally active, cheap and was for years legally available. Rapid tolerance is a very common theme.',
  harm: 'Being the active metabolite removes the CYP2D6 lottery but not the seizure risk, which is retained. Dose ranges are narrow and the powder is easy to misweigh. Dependence develops quickly and withdrawal is reported as comparable to other short-acting opioids.'
},

hydrocodone: {
  what: 'A semi-synthetic opioid of roughly morphine-equivalent oral potency, converted by CYP2D6 to hydromorphone. Almost always formulated with paracetamol or ibuprofen.',
  looks: 'White or coloured tablets; also cough syrups combined with an antihistamine.',
  reports: 'Reported as similar to oxycodone but somewhat weaker and more sedating. As with codeine, the paracetamol content is the constraint people run into.',
  harm: 'The paracetamol ceiling, not the opioid, sets the maximum safe dose of combination products. CYP2D6 inhibitors reduce the effect; strong inducers or inhibitors of CYP3A4 shift it too.'
},

hydromorphone: {
  what: 'A semi-synthetic opioid roughly 5 times as potent as morphine orally and 5–7 times parenterally, with a similar duration. Used where morphine is not tolerated or where a small injection volume is needed.',
  looks: 'Small tablets, ampoules and, in some jurisdictions, prescribed injectable formulations for opioid dependence.',
  reports: 'Frequently described as the most euphoric of the common pharmaceutical opioids, particularly injected. Because it is so potent per milligram, community reports about dosing errors are common.',
  harm: 'Potency per milligram means small weighing errors matter far more than with morphine. There is no ceiling on respiratory depression. Modified-release forms have been repeatedly implicated in deaths when defeated.'
},

oxymorphone: {
  what: 'A potent semi-synthetic opioid, roughly three times morphine orally, and also the active CYP2D6 metabolite of oxycodone.',
  looks: 'Small tablets; the modified-release formulation was reformulated after widespread injection of the original.',
  reports: 'Reported as strongly euphoric and heavily sedating. Injection of the reformulated tablets caused outbreaks of thrombotic microangiopathy and of HIV, which is well documented.',
  harm: 'Oral bioavailability is low and erratic, and food raises absorption substantially — taking it with a meal can produce a much higher peak than the same dose fasted. Never inject tablet material; the excipients cause serious vascular injury.'
},

tapentadol: {
  what: 'A dual-mechanism analgesic: a moderate mu-agonist that is also a noradrenaline reuptake inhibitor, with the two contributing roughly equally. Unlike tramadol it is active as the parent drug and does not depend on CYP2D6.',
  looks: 'Film-coated tablets, immediate and modified release.',
  reports: 'Reported as producing less nausea and constipation than classical opioids at equianalgesic doses, and as noticeably less euphoric. Some people describe an SNRI-like stimulation.',
  harm: 'The noradrenergic half means it should not be combined with MAOIs. Seizure risk is lower than tramadol but not absent. Serotonergic risk is lower than tramadol because serotonin reuptake inhibition is weak.'
},

dihydrocodeine: {
  what: 'A semi-synthetic codeine analogue of roughly twice codeine\'s potency, and unlike codeine it is substantially active in its own right rather than depending entirely on CYP2D6 conversion.',
  looks: 'White tablets, often modified-release; also in combination with paracetamol and in linctus form.',
  reports: 'Reported as more reliable than codeine precisely because it does not depend as heavily on genotype. Constipation is a persistent complaint.',
  harm: 'Combination products carry the same paracetamol ceiling as codeine ones. Modified-release tablets should not be crushed.'
},

pethidine: {
  what: 'Meperidine — an older synthetic opioid, now largely abandoned in favour of alternatives, mostly because of its metabolite. Also anticholinergic and mildly serotonergic.',
  looks: 'Ampoules and tablets; increasingly rare outside obstetric and older hospital use.',
  reports: 'Historically described as producing a more "stimulating" and less classically opioid effect. Rarely encountered recreationally today.',
  harm: 'Normeperidine, its metabolite, accumulates with repeated dosing and in renal impairment, and causes tremor, myoclonus and seizures that naloxone does not reverse. The combination with an MAOI is a classic and sometimes fatal cause of serotonin syndrome and is absolutely contraindicated.'
},

loperamide: {
  what: 'A peripherally restricted mu-agonist used as an anti-diarrhoeal. It is actively pumped back out of the brain by P-glycoprotein, which is the entire reason it is available without prescription — at label doses essentially none reaches the CNS.',
  looks: 'Small tablets and capsules, sold in every pharmacy.',
  reports: 'Extremely large doses are discussed in opioid-withdrawal communities as a way of managing symptoms, sometimes combined with P-gp inhibitors to force it into the brain. This practice has killed people.',
  harm: 'At the doses required for any central effect, loperamide blocks cardiac potassium and sodium channels and causes QT prolongation, torsades de pointes and fatal ventricular arrhythmia. The cardiac toxicity is not reversed by naloxone and can occur hours after the dose, in someone who looks fine. Combining it with quinidine, ritonavir, grapefruit or other P-gp inhibitors to increase the effect sharply increases that risk.'
},

carfentanil: {
  what: 'A fentanyl analogue developed as a large-animal tranquilliser, roughly 10,000 times the potency of morphine. It has no human medical use anywhere.',
  looks: 'Indistinguishable from any other white powder, and present only as a contaminant or adulterant in practice.',
  reports: 'Not something anyone seeks out; it appears in the supply and in post-mortem toxicology. Communities discuss it entirely as a contamination hazard.',
  harm: 'An active dose is on the order of a microgram. It cannot be measured with any scale a person owns and cannot be safely handled or divided. Overdose typically needs multiple doses of naloxone and mechanical ventilation. If a supply is suspected of containing it, there is no safe amount to test with.'
},

acetylfentanyl: {
  what: 'A fentanyl analogue of roughly one-third fentanyl\'s potency but still several times morphine\'s, and one of the first fentanyl analogues to appear widely in the illicit supply.',
  looks: 'White to off-white powder; appears as an adulterant rather than as a product.',
  reports: 'Reported in the same terms as fentanyl: unpredictable, short, easy to overdose on.',
  harm: 'Detected by most fentanyl test strips. Treat exactly as fentanyl: never alone, naloxone present, assume uneven mixing.'
},

furanylfentanyl: {
  what: 'A fentanyl analogue of broadly fentanyl-like potency that appeared in the illicit supply from around 2015.',
  looks: 'White powder, sold as such or found in counterfeit tablets.',
  reports: 'Reported as shorter-acting than fentanyl, with rapid re-dosing and correspondingly high overdose risk.',
  harm: 'As with all fentanyl analogues, the margin between an effective and a fatal dose is small and mixing in powder is never uniform. Detected by most fentanyl test strips.'
},

sufentanil: {
  what: 'A clinical fentanyl analogue roughly 5–10 times fentanyl\'s potency, used in anaesthesia and in epidural infusions.',
  looks: 'Clear ampoules; rarely encountered outside hospitals.',
  reports: 'Essentially no recreational report base — it is a hospital drug and diversion is rare.',
  harm: 'Microgram dosing with a very narrow margin; not something that can be handled safely outside a clinical setting.'
},

remifentanil: {
  what: 'An ultrashort-acting fentanyl analogue broken down by nonspecific blood and tissue esterases rather than by the liver, so its effect ends within minutes regardless of how long it was infused.',
  looks: 'Powder for reconstitution; a hospital-only drug.',
  reports: 'No meaningful recreational report base.',
  harm: 'Its offset is so fast that respiratory depression and analgesia both end abruptly; it is designed for continuous infusion with airway support present.'
},

desomorphine: {
  what: 'A morphine derivative roughly ten times morphine\'s potency with a very short duration. Notorious as "krokodil" because of the corrosive home synthesis it is usually made by, not because of the molecule itself.',
  looks: 'The home-made product is a yellow to brown liquid containing phosphorus, iodine and solvent residues.',
  reports: 'Community accounts are dominated by the injection injuries rather than the drug effect: necrosis, thrombophlebitis, bone and soft-tissue destruction at and beyond injection sites.',
  harm: 'The catastrophic harm comes from injecting an unpurified reaction mixture, not from desomorphine. There is no way to make that mixture safe to inject. Very short duration drives frequent redosing.'
},

'para-fluorofentanyl': {
  what: 'A ring-fluorinated fentanyl analogue of broadly fentanyl-like potency, now among the most commonly detected fentanyl analogues in the illicit supply, frequently alongside fentanyl itself.',
  looks: 'Indistinguishable white powder; found in counterfeit tablets and in "heroin".',
  reports: 'Reported and encountered the same way as fentanyl; users generally cannot distinguish it.',
  harm: 'Treat as fentanyl in every respect. Detected by most fentanyl test strips.'
},

ocfentanil: {
  what: 'A fentanyl analogue of similar potency to fentanyl, implicated in clusters of deaths in Europe where it was sold as heroin.',
  looks: 'White powder sold as or mixed into heroin.',
  reports: 'Encountered rather than sought; reports come mainly from case series.',
  harm: 'Same as fentanyl. Its appearance in "heroin" without warning is the specific hazard.'
},

pentazocine: {
  what: 'A mixed agonist–antagonist: kappa agonist and weak mu partial agonist/antagonist. Used as an analgesic with a lower dependence liability than full agonists, at the cost of dysphoria.',
  looks: 'Tablets, often combined with naloxone to deter injection.',
  reports: 'Widely reported as unpleasant — anxiety, dysphoria and sometimes hallucinations, which is characteristic of kappa agonism.',
  harm: 'Can precipitate withdrawal in anyone dependent on a full mu-agonist. The kappa-driven dysphoria is a feature of the drug, not an idiosyncratic reaction.'
},

butorphanol: {
  what: 'A kappa agonist and mu partial agonist/antagonist, used for pain and available as a nasal spray.',
  looks: 'Nasal spray and ampoules.',
  reports: 'Reported as sedating with a dysphoric edge typical of kappa agonists.',
  harm: 'Precipitates withdrawal in mu-dependent people. Has a ceiling on respiratory depression but still combines dangerously with other sedatives.'
},

nalbuphine: {
  what: 'A kappa agonist and mu antagonist used as an analgesic with a ceiling on respiratory depression.',
  looks: 'Ampoules.',
  reports: 'Little recreational report base; reported effects are sedation and dysphoria.',
  harm: 'Will precipitate withdrawal in anyone dependent on a mu-agonist and will block their opioid entirely.'
},

levorphanol: {
  what: 'A potent morphinan full agonist, roughly 4–8 times morphine, that is also an NMDA antagonist and a serotonin–noradrenaline reuptake inhibitor, with a long and variable half-life.',
  looks: 'Tablets; uncommon.',
  reports: 'Sparse. Described as long-lasting with a broader effect profile than morphine.',
  harm: 'Its long half-life relative to its duration of analgesia creates the same accumulation trap as methadone. The serotonergic activity means MAOI combination is contraindicated.'
},

propoxyphene: {
  what: 'A weak opioid withdrawn from most markets because its metabolite norpropoxyphene is cardiotoxic. Historically a very common cause of fatal overdose relative to how weak an analgesic it was.',
  looks: 'Capsules and tablets, often with paracetamol; largely withdrawn.',
  reports: 'Historical. Reported as a weak opioid with a distinctly unpleasant quality at higher doses.',
  harm: 'Norpropoxyphene blocks cardiac sodium channels, causing arrhythmia and cardiac arrest that naloxone does not touch. This is why it was withdrawn.'
},

laam: {
  what: 'Levacetylmethadol — an extremely long-acting methadone relative once used for opioid maintenance on a three-times-weekly schedule, withdrawn over QT prolongation and torsades.',
  looks: 'Oral solution; withdrawn.',
  reports: 'Historical only.',
  harm: 'Withdrawn specifically for fatal arrhythmia. Its active metabolites are even longer-acting than the parent, so accumulation over days is the dominant risk.'
},

ketobemidone: {
  what: 'A potent synthetic full agonist of roughly morphine-to-greater potency, used in a few Nordic countries. Some NMDA antagonism is claimed.',
  looks: 'Tablets, suppositories and ampoules; regionally restricted.',
  reports: 'Reported in Scandinavian communities as strongly euphoric.',
  harm: 'A full agonist with no ceiling; the usual opioid rules apply without exception.'
},

piritramide: {
  what: 'A synthetic full agonist of roughly 0.7 times morphine\'s potency, used parenterally for post-operative pain mainly in German-speaking Europe.',
  looks: 'Ampoules; hospital use.',
  reports: 'Very little outside clinical description.',
  harm: 'Standard full-agonist risks; long-ish duration for a parenteral opioid.'
},

oliceridine: {
  what: 'A "biased" mu-agonist designed to favour G-protein signalling over beta-arrestin recruitment, on the hypothesis that this separates analgesia from respiratory depression. Approved for acute pain; the extent of the separation in practice remains contested.',
  looks: 'Ampoules; hospital use only.',
  reports: 'Essentially none outside trials.',
  harm: 'It still depresses respiration — the claim is a shifted ratio, not an absence. Treat as a full agonist.'
},

'ah-7921': {
  what: 'A benzamide opioid of roughly morphine-equivalent potency, one of the first synthetic opioids to appear on the research-chemical market, since controlled in most jurisdictions.',
  looks: 'White powder.',
  reports: 'Reported as morphine-like with a longer duration. Several deaths were reported in the period it was openly sold.',
  harm: 'Sold by weight as a powder with no reference product, so dosing errors are the main hazard. Full agonist, no ceiling.'
},

'sr-17018': {
  what: 'An experimental biased mu-agonist from academic work on G-protein-biased signalling, with no clinical or approved use, which has appeared on the research-chemical market.',
  looks: 'White powder.',
  reports: 'Very sparse. Reported as long-acting with an unusual, weak subjective profile.',
  harm: 'Essentially uncharacterised in humans. Its pharmacology means naloxone reversal may behave unpredictably. There is no basis for any dose estimate.'
},

tilidine: {
  what: 'A prodrug opioid, inactive itself, converted by first-pass metabolism to nortilidine, which is the active mu-agonist. Usually formulated with naloxone to deter injection — the naloxone is destroyed by first pass when swallowed but blocks the effect if injected.',
  looks: 'Drops and tablets, mostly in German-speaking Europe, generally combined with naloxone.',
  reports: 'Reported as reliable orally and completely ineffective by any other route because of the naloxone.',
  harm: 'Because it is a prodrug, effect depends on first-pass metabolism — anything that alters it alters the dose. Injecting the combination product precipitates withdrawal.'
},

'7-oh-mitragynine': {
  what: 'A minor kratom alkaloid and an active metabolite of mitragynine, far more potent at mu than mitragynine itself and responsible for much of kratom\'s opioid effect at higher doses. Now sold in concentrated form, which is a different drug from a leaf.',
  looks: 'Sold as concentrated extracts, tablets and shots; also present at very low percentages in raw leaf.',
  reports: 'Concentrated products are widely reported as far more habit-forming and more opioid-like than plain leaf, with withdrawal that resembles a conventional opioid rather than the milder leaf pattern.',
  harm: 'Concentrating this alkaloid removes the natural ceiling that made whole-leaf kratom relatively self-limiting. Treat concentrated 7-OH products as a conventional opioid, not as kratom.'
},

'mitragynine-pseudoindoxyl': {
  what: 'A rearrangement product of mitragynine, substantially more potent at mu than 7-hydroxymitragynine and of research interest for its biased signalling. Forms slowly in stored or oxidised kratom material.',
  looks: 'Not sold as such; encountered as a constituent of aged or processed kratom products.',
  reports: 'Almost no direct report base; discussed in the context of why old kratom sometimes behaves differently.',
  harm: 'Very poorly characterised in humans. Its presence is one reason kratom product potency is not consistent between batches.'
},

mitragynine: {
  what: 'The principal alkaloid of kratom (Mitragyna speciosa) and a partial mu-agonist with additional adrenergic and serotonergic activity. Its effects are dose-dependent in a way most opioids are not: stimulating at low doses, sedating and opioid-like at higher ones.',
  looks: 'Kratom itself is a green powdered leaf; mitragynine as an isolate is an off-white powder. Extracts vary in strength by more than an order of magnitude.',
  reports: 'Low doses are widely reported as stimulating and mood-lifting, higher doses as clearly opioid. Daily use leading to dependence with a real, if usually milder, withdrawal is a very common theme, as is the difference between plain leaf and modern concentrated extracts.',
  harm: 'It is a CYP2D6 and CYP3A4 inhibitor and has been implicated in deaths almost always in combination with other sedatives. Extracts and 7-OH-enriched products are much stronger than leaf and should not be dosed by leaf experience. Dependence develops with daily use.'
},

m6g: {
  what: 'Morphine-6-glucuronide — a morphine metabolite that is itself a potent mu-agonist, roughly twice morphine\'s potency centrally, and considerably longer-lived. It is why morphine\'s effect outlasts morphine.',
  looks: 'Not sold or encountered as a substance; it exists in the body after morphine, codeine or heroin.',
  reports: 'No direct report base. Its clinical signature is delayed and prolonged sedation, especially in renal impairment.',
  harm: 'It is cleared by the kidneys, so it accumulates in renal impairment and causes respiratory depression hours after the parent morphine has gone. This is a common mechanism of late opioid deterioration in hospital and at home.'
},

norbuprenorphine: {
  what: 'The main CYP3A4 metabolite of buprenorphine. Unlike its parent it is a full mu-agonist with no ceiling, though it penetrates the brain poorly because it is a P-glycoprotein substrate.',
  looks: 'Not encountered as a substance.',
  reports: 'No direct report base.',
  harm: 'Its significance is in interactions: P-gp inhibitors can raise its brain exposure, and it is a full agonist at the receptor when it gets there. It contributes to buprenorphine\'s respiratory effects in some overdose cases.'
},

kratom: {
  what: 'The leaf of Mitragyna speciosa, a Southeast Asian tree in the coffee family, containing mitragynine and a range of minor alkaloids including 7-hydroxymitragynine. Used traditionally as a stimulant by labourers and, in the West, largely for pain and for self-managed opioid withdrawal.',
  looks: 'Finely powdered green leaf, sold loose, in capsules, or as extracts and shots that are far stronger. Vein-colour marketing ("red", "green", "white") does not correspond to reliable pharmacological differences.',
  reports: 'The most consistent themes are: low doses stimulating and high doses sedating; genuine usefulness reported for pain and for tapering off opioids; and daily use producing real dependence with a withdrawal people frequently describe as milder than opioids but longer than expected. Extract products are repeatedly reported as a different and much harder-to-control drug than plain leaf.',
  harm: 'Almost all kratom-associated deaths involve other drugs, particularly benzodiazepines and other sedatives. It inhibits CYP2D6 and CYP3A4, so it raises levels of many other drugs. Extracts and 7-OH-enriched products should not be dosed by leaf experience. Daily use produces dependence; spacing doses and avoiding daily use are the main things that prevent it.'
},

isotonitazene: {
  what: 'A 2-benzylbenzimidazole ("nitazene") opioid from abandoned 1950s pharmaceutical research, substantially more potent than fentanyl at the mu receptor. Nitazenes have spread through the illicit supply since around 2019 and are now a major cause of overdose clusters.',
  looks: 'A yellow to off-white powder — the yellow tint is characteristic of several nitazenes but is not a reliable identifier. Found in counterfeit tablets and sold as heroin.',
  reports: 'Encountered rather than sought. Communities report overdose clusters where an unusually large number of naloxone doses were needed.',
  harm: 'More potent than fentanyl, and fentanyl test strips do NOT detect nitazenes — dedicated nitazene strips exist and are the only field test. Overdoses commonly need multiple naloxone doses and can re-sedate after naloxone wears off, so an ambulance is mandatory rather than optional.'
},

metonitazene: {
  what: 'A nitazene opioid of very high potency, comparable to or exceeding fentanyl, and among the most frequently detected nitazenes in post-mortem toxicology.',
  looks: 'Off-white to yellowish powder; found in counterfeit tablets and mixed into other opioids.',
  reports: 'Encountered as a contaminant. Reports centre on unexpectedly severe and prolonged overdose.',
  harm: 'Not detected by fentanyl test strips. Expect to need repeated naloxone and expect re-sedation. Never use alone.'
},

protonitazene: {
  what: 'A nitazene opioid, propyl analogue of isotonitazene, of comparable or greater potency to fentanyl.',
  looks: 'Off-white to yellow powder.',
  reports: 'Encountered rather than sought; appears in overdose clusters.',
  harm: 'Same as other nitazenes: undetected by fentanyl strips, high naloxone requirement, long duration relative to naloxone.'
},

etodesnitazene: {
  what: 'A nitazene lacking the nitro group ("desnitro"), which reduces potency relative to isotonitazene but leaves it a potent opioid in absolute terms. Appeared as jurisdictions began controlling the nitro-bearing nitazenes.',
  looks: 'Off-white powder.',
  reports: 'Sparse; encountered in seizures and toxicology.',
  harm: 'Lower potency than its nitro parent is not the same as low potency. Not detected by fentanyl strips.'
},

butonitazene: {
  what: 'A nitazene with a butoxy substitution, less potent than isotonitazene but still a strong opioid, appearing in the illicit supply as an analogue substitution.',
  looks: 'Off-white to yellow powder.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised in humans. Not detected by fentanyl strips.'
},

metodesnitazene: {
  what: 'A desnitro nitazene, the methoxy analogue, of lower potency than the nitro-bearing nitazenes but still substantially more potent than morphine.',
  looks: 'Off-white powder.',
  reports: 'Very sparse; detected in toxicology and in seizures.',
  harm: 'Essentially uncharacterised in humans, and not detected by fentanyl test strips.'
},

etonitazepyne: {
  what: 'A pyrrolidinyl nitazene ("N-pyrrolidino etonitazene"), among the most potent nitazenes identified, exceeding fentanyl by a wide margin in animal assays.',
  looks: 'Off-white to yellow powder.',
  reports: 'Encountered in overdose clusters in Europe and North America; not something people seek.',
  harm: 'Extreme potency with no reference dose. Not detected by fentanyl strips. Multiple naloxone doses and hospital care should be assumed necessary.'
},

isotonitazepyne: {
  what: 'A pyrrolidinyl nitazene analogue, structurally between isotonitazene and etonitazepyne, appearing in the supply as controls tightened on earlier nitazenes.',
  looks: 'Off-white to yellow powder.',
  reports: 'Almost none.',
  harm: 'Uncharacterised. Assume nitazene-class potency and behaviour: not fentanyl-strip detectable, high naloxone requirement.'
},

fluetonitazepyne: {
  what: 'A fluorinated pyrrolidinyl nitazene, among the newest members of the class to appear in seizures.',
  looks: 'Off-white powder.',
  reports: 'None of substance.',
  harm: 'Entirely uncharacterised in humans. Treat as a maximally potent nitazene.'
},

'n-desethyl-isotonitazene': {
  what: 'A des-ethyl nitazene that is both a metabolite of isotonitazene and a compound sold in its own right, of high potency.',
  looks: 'Off-white powder.',
  reports: 'Encountered in toxicology rather than sought.',
  harm: 'Nitazene-class rules apply: no fentanyl-strip detection, expect repeated naloxone.'
},

brorphine: {
  what: 'A piperidine benzimidazolone opioid, structurally unrelated to fentanyls and nitazenes, of roughly fentanyl-like potency at mu. Appeared in the North American supply around 2020.',
  looks: 'White powder and in counterfeit tablets.',
  reports: 'Encountered rather than sought; associated with overdose deaths in the Midwest US.',
  harm: 'Not detected by fentanyl test strips. Full agonist of high potency; standard nitazene-era precautions apply.'
},

'u-47700': {
  what: 'A benzamide opioid from 1970s Upjohn research, roughly 7 times morphine\'s potency, that became one of the first widely sold research-chemical opioids.',
  looks: 'White powder; was sold openly online before scheduling.',
  reports: 'Reported as short-acting and strongly compulsive to redose, which is reflected in the death toll from the period it was available.',
  harm: 'Short duration drives frequent redosing and accumulation. Not detected by fentanyl strips. Full agonist with no ceiling.'
},

'u-48800': {
  what: 'A U-47700 analogue from the same series of benzamide opioids, of broadly comparable potency, appearing after U-47700 was controlled.',
  looks: 'White powder.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised in humans; assume U-47700-class potency and behaviour.'
},

'mt-45': {
  what: 'A 1970s piperazine opioid of roughly morphine-equivalent potency, notable for a toxicity that has nothing to do with opioid receptors.',
  looks: 'White powder.',
  reports: 'Users repeatedly reported hearing loss, cataracts, hair loss and dermatitis after use — an unusual and well-documented pattern.',
  harm: 'Causes bilateral hearing loss and cataracts, sometimes permanent, apparently unrelated to its opioid activity. This is not a rumour; it is documented in case series. Also a full agonist with the usual respiratory risk.'
},

'ap-238': {
  what: 'An acrylamide-based synthetic opioid related to the AP-237 (bucinnazine) series, appearing in the illicit supply from around 2021.',
  looks: 'White powder; found in counterfeit tablets.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised in humans, not detected by fentanyl strips, and appearing without warning in tablets sold as pharmaceuticals.'
},

'2-methyl-ap-237': {
  what: 'A methylated analogue of AP-237 (bucinnazine), a piperazine opioid used clinically in China decades ago, now appearing as a designer opioid.',
  looks: 'White powder.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised. Not fentanyl-strip detectable.'
},

'4-fibf': {
  what: '4-fluoroisobutyrylfentanyl — a fentanyl analogue of broadly fentanyl-comparable potency that circulated widely in the 2016–2018 period.',
  looks: 'White powder; also pressed into counterfeit tablets.',
  reports: 'Encountered rather than sought; associated with a substantial number of deaths in Europe.',
  harm: 'Treat as fentanyl. Detected by most fentanyl test strips.'
},

methoxyacetylfentanyl: {
  what: 'A fentanyl analogue of somewhat lower potency than fentanyl itself, widely detected in Europe from 2016 onwards.',
  looks: 'White powder, sold as such or as "heroin".',
  reports: 'Encountered rather than sought.',
  harm: 'Treat as fentanyl. Detected by most fentanyl test strips.'
},

cyclopropylfentanyl: {
  what: 'A fentanyl analogue of roughly fentanyl-comparable potency, responsible for a large cluster of deaths in Europe and North America in 2017–2018.',
  looks: 'White powder.',
  reports: 'Encountered rather than sought.',
  harm: 'Treat as fentanyl in every respect.'
},

naloxone: {
  what: 'A competitive mu-opioid antagonist with essentially no agonist activity, used to reverse opioid overdose. It has effectively no effect in someone who has not taken an opioid, which is why it can be given without diagnosis.',
  looks: 'Nasal spray and pre-filled injectors, widely distributed free by harm-reduction services; also glass ampoules.',
  reports: 'The dominant theme is that it works, and that one dose is often not enough against fentanyl or a nitazene. People revived with it commonly report abrupt, severe withdrawal, which is distressing but not dangerous.',
  harm: 'Its half-life is shorter than most opioids it reverses, so someone can re-sedate after it wears off — always call an ambulance even if the person wakes up. Give rescue breaths; naloxone takes minutes and oxygen matters more. It will precipitate withdrawal in a dependent person, which is unpleasant but survivable and is not a reason to withhold it.'
},

naltrexone: {
  what: 'A long-acting oral and depot opioid antagonist used to maintain abstinence from opioids and to reduce alcohol consumption. Unlike naloxone it is orally active and lasts a day or more.',
  looks: 'Tablets and a monthly intramuscular depot; also compounded at low doses for off-label use.',
  reports: 'People on it report that opioids simply do nothing, which is the point. Attempting to override the blockade with very large opioid doses is a recognised and frequently fatal pattern.',
  harm: 'Must not be started until fully withdrawn from opioids — starting too early precipitates severe withdrawal, and the depot form cannot be removed. It abolishes opioid tolerance, so overdose risk is very high when it is stopped or wears off. Hepatotoxic at high doses.'
},

/* ================= Depressants ================= */

alcohol: {
  what: 'Ethanol — a positive modulator at GABA-A, an NMDA antagonist, and active at glycine and several other targets. Pharmacologically it is a general CNS depressant with an unusually broad receptor profile, which is why nothing else feels quite like it and why its withdrawal is uniquely dangerous.',
  looks: 'Clear liquid; in drinks, whatever colour the drink is. Strength is on the label, which makes it the only common recreational drug whose dose is knowable in advance.',
  reports: 'The most reported thing about alcohol in harm-reduction communities is not the effect but the interaction: it is present in a large majority of fatal poisonings involving other depressants. Blackouts, which are memory failures rather than unconsciousness, are widely reported as happening at doses well below the point of collapse.',
  harm: 'Elimination is zero-order — roughly a fixed amount per hour regardless of how much is on board — so a big dose takes proportionally much longer to clear and nothing speeds it up. Withdrawal from physical dependence can kill through seizures and delirium tremens and should be managed medically, not gone cold turkey. Never combine with benzodiazepines, opioids, GHB or barbiturates. Vomiting while unconscious is the common mechanism of death; put anyone unresponsive in the recovery position.'
},

alprazolam: {
  what: 'A short-acting triazolobenzodiazepine with unusually fast onset and high potency per milligram, prescribed for panic disorder. Its speed is what makes it effective and also what makes it the benzodiazepine most associated with dependence.',
  looks: 'Small tablets, often scored bars; the pharmaceutical ones are extensively counterfeited. Counterfeit "Xanax" bars frequently contain a designer benzodiazepine or a fentanyl analogue instead, in unknown amounts.',
  reports: 'The dominant theme is memory: blackout redosing, in which someone takes more because they do not remember taking any, is reported constantly and is the mechanism behind most alprazolam-related harm. Rebound anxiety between doses is widely reported and drives escalation. Interdose withdrawal is very common.',
  harm: 'Any loose bar or tablet should be assumed counterfeit. The short half-life makes both interdose withdrawal and dependence worse than with longer-acting benzodiazepines. Never combine with opioids or alcohol. Do not stop abruptly after regular use — benzodiazepine withdrawal causes seizures and can be fatal; taper, ideally after switching to a longer-acting benzodiazepine, under medical supervision.'
},

diazepam: {
  what: 'The archetypal long-acting benzodiazepine, and the reference point for benzodiazepine equivalence tables. Its long half-life is extended much further by nordazepam, an active metabolite with a half-life of two to four days, so it self-tapers to a degree no short-acting benzodiazepine does.',
  looks: 'White, yellow or blue tablets depending on strength, plus oral solution, rectal gel and ampoules. Widely counterfeited; illicit "10 mg diazepam" tablets frequently contain designer benzodiazepines at unpredictable strengths.',
  reports: 'Reported as the smoothest of the common benzodiazepines, with less of the sharp on/off quality of alprazolam. Its role in tapering off shorter-acting benzodiazepines is discussed everywhere and is genuinely standard practice.',
  harm: 'Accumulates over days because of nordazepam — the fifth daily dose is doing much more than the first. Impairment the day after is real and underestimated. CYP2C19 poor metabolisers clear it much more slowly. Never combine with opioids or alcohol. Do not stop abruptly after regular use.'
},

clonazepam: {
  what: 'A long-acting, high-potency benzodiazepine used for seizure disorders and panic. Long half-life with no meaningful active metabolite, so it accumulates less than diazepam but leaves more abruptly.',
  looks: 'Small tablets, often green, yellow or white by strength; also orally disintegrating tablets.',
  reports: 'Reported as strongly amnestic for its sedation level, and as producing marked emotional blunting with regular use. Tapering off it is widely reported as harder than the half-life suggests.',
  harm: 'High potency means small differences in dose matter. Amnesia at doses that do not feel especially strong is the recurring source of harm. Standard benzodiazepine rules: no opioids, no alcohol, no abrupt discontinuation.'
},

lorazepam: {
  what: 'An intermediate-acting, high-potency benzodiazepine that is glucuronidated directly rather than being oxidised by CYP enzymes. That makes it the benzodiazepine of choice in liver impairment and the one least affected by CYP interactions.',
  looks: 'Small white tablets; also ampoules used for status epilepticus and sedation.',
  reports: 'Reported as strongly amnestic — it is used clinically for that property. Less accumulation than diazepam but a harder edge coming off each dose.',
  harm: 'Not affected by CYP3A4 inhibitors, which is useful, but every other benzodiazepine caution applies. Marked anterograde amnesia at ordinary doses.'
},

etizolam: {
  what: 'A thienodiazepine — a benzodiazepine with the benzene ring replaced by thiophene — prescribed in Japan, India and Italy and sold as a research chemical elsewhere. Comparable in potency to alprazolam with a somewhat shorter duration.',
  looks: 'Pharmaceutical tablets in some countries; elsewhere as powder, pellets, or blotter, with no reference product and highly variable content.',
  reports: 'Reported as very similar to alprazolam. Tolerance is widely reported as developing unusually fast, within days, driving rapid escalation. Blotter and pellet products are repeatedly reported as inconsistent in strength.',
  harm: 'Volumetric dosing is essential — active doses are fractions of a milligram and cannot be weighed on ordinary scales. Very fast tolerance means dependence arrives quickly. Same fatal combination risk with opioids and alcohol as any benzodiazepine.'
},

clonazolam: {
  what: 'A triazolo designer benzodiazepine, a nitro analogue in the clonazepam/alprazolam family, and among the most potent benzodiazepines known — active in the tens of micrograms.',
  looks: 'Powder, blotter or pellets. There is no pharmaceutical reference product.',
  reports: 'The single most consistent report in every harm-reduction community is loss of entire days and blackout redosing. People describe taking one dose and reconstructing the next 24 hours from other people\'s accounts. Widely described as the designer benzodiazepine that most reliably causes harm.',
  harm: 'Doses are in micrograms and cannot be weighed on any scale a person owns — volumetric dosing is the only safe method, and even then the amnesia makes redosing the main danger. Have someone else hold the supply. Extremely dangerous with opioids or alcohol. Withdrawal after even short regular use can be severe.'
},

flualprazolam: {
  what: 'A fluorinated alprazolam analogue, substantially more potent and much longer-acting than alprazolam. Heavily implicated in overdose deaths worldwide, almost always alongside an opioid.',
  looks: 'Powder, pellets and, most commonly, pressed into counterfeit alprazolam tablets — it is one of the most frequent contents of fake "Xanax".',
  reports: 'Reported as much longer-lasting than expected, with impairment persisting well into the following day. Encountered unknowingly by many people who believed they were taking alprazolam.',
  harm: 'Next-day impairment is genuine and driving is unsafe. Because it is mostly encountered in counterfeit tablets, dose is unknown by definition. Very high risk with opioids.'
},

bromazolam: {
  what: 'A brominated alprazolam analogue of broadly similar potency, and since around 2021 the most commonly detected designer benzodiazepine in seized counterfeit tablets worldwide.',
  looks: 'Powder and, overwhelmingly, pressed into counterfeit alprazolam bars and tablets.',
  reports: 'Reported as alprazolam-like but somewhat longer. Most people encountering it did not choose it.',
  harm: 'Assume any counterfeit benzodiazepine tablet may be bromazolam at an unknown dose. Standard designer-benzodiazepine cautions.'
},

zolpidem: {
  what: 'A non-benzodiazepine "Z-drug" hypnotic that acts at the same GABA-A benzodiazepine site but with selectivity for alpha-1-containing receptors, which makes it strongly sedating with comparatively little anxiolytic or muscle-relaxant effect.',
  looks: 'Small white or coloured tablets, immediate and modified release.',
  reports: 'The characteristic report is the complex sleep behaviour: sleepwalking, sleep-eating, sleep-driving and long conversations with no memory afterwards. Fighting the sleep onset to stay awake is widely reported to produce hallucinations and a dissociative, distorted state, and is also how most of the harmful behaviour happens.',
  harm: 'Take it only when going straight to bed, and only with a full night available. Complex sleep behaviours have caused deaths and have a boxed warning. Women clear it more slowly and dose recommendations differ. Combining with alcohol sharply increases both the amnesia and the behavioural effects. It is dependence-forming despite frequently being described otherwise.'
},

ghb: {
  what: 'Gamma-hydroxybutyrate, a natural metabolite of GABA that acts at GABA-B and at its own GHB receptor. Used clinically for narcolepsy. Its defining pharmacological feature is zero-order elimination: it clears at a fixed rate, so doubling the dose much more than doubles the duration.',
  looks: 'A colourless, salty or soapy-tasting liquid, usually sold in small bottles. Concentration is essentially never stated and varies enormously between batches, which is the root of most GHB harm.',
  reports: 'The dose-response is reported by everyone as brutally steep — the difference between a pleasant social dose and unconsciousness is often under a millilitre of the same solution. "G-holes" (sudden unrousable unconsciousness) are extremely commonly reported. Withdrawal from daily use is repeatedly described as worse than alcohol withdrawal.',
  harm: 'Dose volumetrically from a solution of known concentration, measure with a syringe, and never redose before at least two hours — most overdoses are redoses taken because the first "did not work yet". Combining with alcohol or any other depressant is the main mechanism of death. Withdrawal from frequent use is a medical emergency with delirium and seizures, comparable to severe alcohol withdrawal, and needs hospital management.'
},

gbl: {
  what: 'Gamma-butyrolactone, a prodrug rapidly converted to GHB by blood lactonase. It is more lipid-soluble than GHB so it is absorbed faster and hits harder and sooner, and it is more concentrated by volume.',
  looks: 'Colourless liquid with a strong, unpleasant chemical solvent smell and taste. Sold as an industrial solvent and cleaner.',
  reports: 'Reported as faster and less predictable than GHB, with a shorter window between dose and effect that makes redosing errors more likely.',
  harm: 'More potent by volume than GHB — a GHB dose measured out as GBL is an overdose. It is corrosive undiluted and will burn the mouth and throat; it must be diluted. Every GHB caution applies, more sharply.'
},

phenibut: {
  what: 'A GABA-B agonist with a phenyl group added to GABA to let it cross the blood-brain barrier, developed in the Soviet Union as an anxiolytic and nootropic. Structurally related to baclofen and to the gabapentinoids.',
  looks: 'White crystalline powder, usually the hydrochloride, sold as a supplement; also in capsules. The free-amino-acid form and the HCl form differ in dose.',
  reports: 'Reported as strongly anxiolytic and socially disinhibiting with a slow onset of several hours, which is the single most common cause of accidental overdose — people redose because nothing has happened yet. Tolerance is reported to build within days. Withdrawal is very widely reported as severe, long, and far worse than the drug\'s reputation as a supplement suggests.',
  harm: 'Onset takes two to four hours; do not redose inside that window. Use no more than once or twice a week — daily use produces dependence within a couple of weeks, and phenibut withdrawal causes severe anxiety, insomnia, hallucinations and seizures lasting weeks. It is not a benign supplement despite being sold as one. Dangerous with alcohol and other depressants.'
},

phenobarbital: {
  what: 'A long-acting barbiturate, still used as an anticonvulsant and in withdrawal management. Barbiturates open the GABA-A chloride channel directly at high concentrations rather than only modulating it, which is why they have no ceiling and benzodiazepines do.',
  looks: 'White tablets, oral elixir and ampoules.',
  reports: 'Little recreational report base today; largely superseded by benzodiazepines precisely because of the safety margin.',
  harm: 'Unlike benzodiazepines, barbiturates directly gate the chloride channel and can stop breathing on their own without any other drug present. The therapeutic index is narrow. Powerful CYP inducer — it will lower levels of many other drugs including oral contraceptives and anticoagulants. Withdrawal is dangerous and requires medical management.'
},

temazepam: {
  what: 'An intermediate-acting benzodiazepine used as a hypnotic. It is one of the "3-hydroxy" benzodiazepines that are glucuronidated directly without CYP oxidation, and it is also an active metabolite of diazepam.',
  looks: 'Tablets and, historically, gel-filled capsules that were widely injected with catastrophic vascular results before reformulation.',
  reports: 'Reported as a clean hypnotic with less next-day hangover than longer-acting benzodiazepines.',
  harm: 'Never inject capsule contents — the gel formulation caused limb loss and death. Standard benzodiazepine cautions otherwise.'
},

triazolam: {
  what: 'A very short-acting, high-potency triazolobenzodiazepine hypnotic. Its brevity is the point clinically and the problem behaviourally.',
  looks: 'Very small tablets.',
  reports: 'Notorious for anterograde amnesia and for next-day rebound anxiety; both are reported far more often than for longer-acting hypnotics.',
  harm: 'Amnesia and complex behaviours at ordinary doses. Strongly affected by CYP3A4 inhibitors — grapefruit juice, ritonavir and clarithromycin can multiply exposure several-fold.'
},

midazolam: {
  what: 'A very short-acting, water-soluble benzodiazepine used for procedural sedation, anaesthesia induction and status epilepticus. Almost entirely a hospital drug.',
  looks: 'Ampoules, oral syrup and buccal/nasal preparations.',
  reports: 'Almost universally reported as complete amnesia for the procedure, which is the intended clinical effect.',
  harm: 'Very rapid respiratory depression when given intravenously, which is why it is used with monitoring and airway equipment present. Heavily CYP3A4-dependent.'
},

chlordiazepoxide: {
  what: 'The first benzodiazepine, synthesised in 1955. Long-acting through a chain of active metabolites ending in nordazepam and oxazepam, which is why it is a standard choice for managing alcohol withdrawal.',
  looks: 'Capsules, often green and yellow or black and green.',
  reports: 'Reported as mild and slow relative to modern benzodiazepines, which is exactly what makes it suitable for withdrawal regimes.',
  harm: 'Accumulates over days through its metabolites. Should be dose-reduced in liver disease, which is common in the population it is most often prescribed to.'
},

flubromazolam: {
  what: 'A designer triazolobenzodiazepine of extremely high potency and long duration — active in the hundreds of micrograms with a half-life measured in days.',
  looks: 'Powder, pellets or blotter; no pharmaceutical reference.',
  reports: 'Reported alongside clonazolam as the designer benzodiazepine most likely to produce multi-day blackouts. A widely circulated case report describes prolonged coma from a small quantity.',
  harm: 'Dose in micrograms; volumetric dosing only. Effects and impairment last for days, so "it has worn off" is usually wrong. Very high risk of blackout redosing. Severe withdrawal after even brief regular use.'
},

diclazepam: {
  what: 'A designer benzodiazepine, the chloro analogue of diazepam, that is largely a prodrug: its metabolites delorazepam, lormetazepam and lorazepam carry most of the activity and are long-lived.',
  looks: 'Powder, pellets and blotter.',
  reports: 'Reported as long and smooth, with effects persisting well past the first day because of the metabolites.',
  harm: 'The active metabolites mean the real duration is far longer than the parent half-life suggests, so accumulation with repeated dosing is substantial. Volumetric dosing.'
},

phenazepam: {
  what: 'A long-acting benzodiazepine developed in the Soviet Union and still prescribed in Russia, with a half-life of up to 60 hours and an active hydroxy metabolite.',
  looks: 'Powder, tablets, and sold on blotter. Was widely available as a research chemical before scheduling.',
  reports: 'Reported as extremely long-lasting, with impairment for days and a distinctive pattern of blackout redosing. Associated with a substantial number of deaths in the UK and Scandinavia.',
  harm: 'A single dose can impair for two to three days. Accumulation with daily use is dramatic. Volumetric dosing; blackout redosing is the main hazard.'
},

zopiclone: {
  what: 'A cyclopyrrolone Z-drug hypnotic acting at the benzodiazepine site of GABA-A, without the alpha-subunit selectivity of zolpidem.',
  looks: 'Small white or blue tablets.',
  reports: 'The universal report is the taste: a persistent, metallic bitterness the next morning that is caused by the drug being excreted in saliva. Amnesia and complex sleep behaviours are reported as with zolpidem.',
  harm: 'Take only immediately before a full night in bed. Dependence-forming with regular use. Same complex-sleep-behaviour risk as zolpidem, worsened by alcohol.'
},

gabapentin: {
  what: 'A gabapentinoid that binds the alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release. Despite the name it does not act at GABA receptors. Absorption is saturable, so the fraction absorbed falls as the dose rises.',
  looks: 'Capsules and tablets.',
  reports: 'Widely reported as a mild euphoriant and anxiolytic at high doses, particularly in people with opioid tolerance, and as strongly potentiating opioids. That potentiation is now recognised as a genuine contributor to opioid deaths.',
  harm: 'It substantially increases the respiratory depression of opioids and has been implicated in a large and growing share of opioid-related deaths. Saturable absorption makes the dose-response non-linear and unpredictable at high doses. Do not stop abruptly after prolonged use — withdrawal resembles benzodiazepine withdrawal.'
},

'14-bd': {
  what: '1,4-butanediol, a GHB prodrug converted by alcohol dehydrogenase and aldehyde dehydrogenase — the same enzymes that process ethanol.',
  looks: 'Colourless liquid, sold industrially as a solvent.',
  reports: 'Reported as slower and less predictable in onset than GHB or GBL because conversion depends on enzyme availability.',
  harm: 'Because it competes with ethanol for alcohol dehydrogenase, drinking alcohol delays and then prolongs its conversion in an unpredictable way — this combination has killed people. The conversion step itself produces the toxic intermediate 4-hydroxybutanal. All GHB cautions apply.'
},

baclofen: {
  what: 'A GABA-B agonist used as an antispastic in multiple sclerosis and spinal injury, and studied off-label at high doses for alcohol dependence. Structurally the chlorophenyl relative of phenibut.',
  looks: 'White tablets; also an intrathecal pump formulation.',
  reports: 'Reported as sedating and muscle-relaxing with little of phenibut\'s anxiolytic character at ordinary doses. High-dose use for alcohol dependence is widely discussed and has genuine trial evidence behind it, alongside a real side-effect burden.',
  harm: 'Abrupt discontinuation, particularly of intrathecal baclofen, causes a severe withdrawal syndrome with hyperthermia, rigidity, seizures and death. Renally cleared, so it accumulates dangerously in kidney impairment. Overdose causes deep coma that can mimic brain death and is survivable with supportive care.'
},

tianeptine: {
  what: 'An atypical antidepressant prescribed in parts of Europe and Asia that, unexpectedly, is a full mu-opioid agonist. At therapeutic doses the opioid effect is minor; at the doses used recreationally it is the whole drug.',
  looks: 'Tablets in prescribing countries; sold in the US as "gas station heroin" in capsules, powders and shot bottles marketed as a supplement.',
  reports: 'Heavily reported in US harm-reduction communities as intensely dependence-forming with a very short duration driving dosing many times a day, and a withdrawal people describe as full opioid withdrawal. Poison-centre calls have risen sharply.',
  harm: 'It is an opioid, regardless of how it is marketed. Very short half-life at recreational doses drives compulsive redosing and rapid dependence. Naloxone reverses it. Withdrawal is opioid withdrawal and needs the same management.'
},

nitrazepam: {
  what: 'A long-acting nitro-benzodiazepine hypnotic, in use since the 1960s.',
  looks: 'White tablets.',
  reports: 'Reported as strongly and durably sedating, with notable next-day impairment.',
  harm: 'Long half-life means accumulation and next-day impairment. Nitro-benzodiazepines are reduced to amino metabolites detectable long after use.'
},

flurazepam: {
  what: 'A hypnotic benzodiazepine that is largely a prodrug for N-desalkylflurazepam (norflurazepam), which has a half-life of two to four days.',
  looks: 'Capsules.',
  reports: 'Reported as producing accumulating daytime sedation over consecutive nights, which is exactly what the metabolite half-life predicts.',
  harm: 'The metabolite accumulates substantially over a week of nightly use; impairment builds night by night.'
},

estazolam: {
  what: 'A triazolobenzodiazepine hypnotic of intermediate duration.',
  looks: 'Tablets.',
  reports: 'Sparse; reported similarly to triazolam but longer.',
  harm: 'CYP3A4-dependent, so strongly affected by inhibitors. Standard benzodiazepine cautions.'
},

lormetazepam: {
  what: 'A short-to-intermediate hypnotic benzodiazepine, glucuronidated directly without CYP oxidation. Also a metabolite of diclazepam.',
  looks: 'Tablets and oral drops.',
  reports: 'Reported as a clean hypnotic with limited hangover.',
  harm: 'Standard benzodiazepine cautions; less affected by CYP interactions than most.'
},

brotizolam: {
  what: 'A thienotriazolodiazepine hypnotic of high potency and short duration, prescribed in several European and Asian countries.',
  looks: 'Very small tablets.',
  reports: 'Reported as a strong short hypnotic; little recreational base.',
  harm: 'High potency per milligram; CYP3A4-dependent.'
},

clobazam: {
  what: 'A 1,5-benzodiazepine — the nitrogen positions differ from every other clinical benzodiazepine — which gives it relatively more anticonvulsant and less sedative effect. Used mainly in epilepsy. Its metabolite norclobazam is long-lived and carries much of the activity.',
  looks: 'Tablets and oral suspension.',
  reports: 'Reported as less sedating than conventional benzodiazepines at effective doses.',
  harm: 'Norclobazam accumulates and is strongly affected by CYP2C19 genotype — poor metabolisers can have several times the exposure. Tolerance to the anticonvulsant effect is a recognised clinical problem.'
},

clorazepate: {
  what: 'A prodrug that is decarboxylated in stomach acid to nordazepam before absorption. Essentially a delivery vehicle for nordazepam.',
  looks: 'Capsules and tablets.',
  reports: 'Reported as diazepam-like and long.',
  harm: 'Requires stomach acid for conversion, so acid-suppressing drugs and antacids reduce its effect. Long-acting through nordazepam, so it accumulates.'
},

prazepam: {
  what: 'Another nordazepam prodrug, slowly converted after absorption, giving a gradual onset and a long tail.',
  looks: 'Tablets.',
  reports: 'Reported as gentle in onset because of the slow conversion.',
  harm: 'Long-acting via nordazepam; accumulates over days.'
},

tofisopam: {
  what: 'A 2,3-benzodiazepine, structurally unusual, which does not act at the classical benzodiazepine site and is anxiolytic without being sedative, anticonvulsant or muscle-relaxant.',
  looks: 'Tablets, prescribed in Hungary and a few other countries.',
  reports: 'Reported as clearly anxiolytic without sedation or intoxication, and as not producing the dependence pattern of classical benzodiazepines.',
  harm: 'A strong CYP3A4 inhibitor, so it raises levels of many other drugs. Not cross-tolerant with classical benzodiazepines and will not prevent their withdrawal.'
},

zaleplon: {
  what: 'A pyrazolopyrimidine Z-drug with an extremely short half-life, around one hour, intended for middle-of-the-night waking.',
  looks: 'Capsules.',
  reports: 'Reported as very short — useful precisely because it clears before morning.',
  harm: 'The short duration means low next-day impairment but also rebound waking. Complex sleep behaviours occur as with the other Z-drugs.'
},

eszopiclone: {
  what: 'The active S-enantiomer of zopiclone, marketed separately as a hypnotic.',
  looks: 'Tablets, often blue.',
  reports: 'Same metallic-taste report as zopiclone, since it is the enantiomer responsible for it.',
  harm: 'Identical cautions to zopiclone.'
},

secobarbital: {
  what: 'A short-acting barbiturate hypnotic, historically one of the most widely misused drugs of its era and now almost entirely withdrawn.',
  looks: 'Red capsules, historically.',
  reports: 'Historical. The narrow margin between a sleeping dose and a fatal one is the reason barbiturates were replaced.',
  harm: 'No ceiling on respiratory depression; direct chloride-channel gating means it kills on its own. Withdrawal is life-threatening.'
},

pentobarbital: {
  what: 'A short-acting barbiturate, now used mainly in veterinary euthanasia, refractory status epilepticus and assisted dying.',
  looks: 'Ampoules and oral solution.',
  reports: 'Very little recreational base today.',
  harm: 'Extremely narrow therapeutic index. Used deliberately to end life at doses not far above sedating ones.'
},

butalbital: {
  what: 'A short-to-intermediate barbiturate found almost exclusively in combination headache products with paracetamol or aspirin and caffeine.',
  looks: 'Capsules and tablets in combination products.',
  reports: 'Reported mainly in the context of medication-overuse headache and of dependence developing from prescribed use.',
  harm: 'The paracetamol content sets the acute ceiling. Barbiturate withdrawal after regular use can cause seizures. A potent CYP inducer.'
},

thiopental: {
  what: 'An ultrashort-acting barbiturate once standard for anaesthesia induction, whose brief action comes from redistribution into fat rather than elimination.',
  looks: 'Powder for reconstitution; hospital use.',
  reports: 'No meaningful recreational base.',
  harm: 'Repeated doses saturate fat stores and the duration lengthens dramatically. Airway management is mandatory.'
},

methaqualone: {
  what: 'A quinazolinone sedative-hypnotic, sold as Quaalude and Mandrax, withdrawn worldwide after widespread misuse. Acts at GABA-A but at a distinct site from benzodiazepines and barbiturates.',
  looks: 'Historically tablets; in southern Africa, Mandrax tablets are still smoked with cannabis. Most "quaaludes" sold today contain something else entirely.',
  reports: 'Historically described as producing a distinctive heavy, tingling body relaxation unlike benzodiazepines. Modern reports almost always turn out to concern a substituted product.',
  harm: 'Genuine methaqualone is very rare; assume anything sold as it is a benzodiazepine or something worse. Narrow margin, dangerous with alcohol, and withdrawal can cause seizures.'
},

meprobamate: {
  what: 'A carbamate anxiolytic that preceded the benzodiazepines and was, briefly, the most prescribed drug in the United States. Also the active metabolite of carisoprodol.',
  looks: 'Tablets; largely withdrawn.',
  reports: 'Historical. Reported as anxiolytic with a narrow margin.',
  harm: 'Overdose is genuinely dangerous and much less forgiving than benzodiazepine overdose. Withdrawal causes seizures.'
},

'chloral-hydrate': {
  what: 'One of the oldest synthetic hypnotics, a prodrug for trichloroethanol. Historically the "Mickey Finn".',
  looks: 'Syrup and capsules; largely withdrawn.',
  reports: 'Historical.',
  harm: 'Very narrow therapeutic index, gastric irritation, and cardiac arrhythmia in overdose. Interacts badly with alcohol.'
},

propofol: {
  what: 'An intravenous anaesthetic acting at GABA-A, with extremely rapid onset and offset. Not an analgesic.',
  looks: 'A white oil-in-water emulsion — the "milk of amnesia".',
  reports: 'No safe recreational use exists. Diversion by medical staff has repeatedly been fatal.',
  harm: 'There is no gap between a sedating dose and one that stops breathing — apnoea is expected and is managed by having an airway and a ventilator. It cannot be used safely without both. Prolonged high-dose infusion causes propofol infusion syndrome, which is often fatal.'
},

clobromazolam: {
  what: 'A designer triazolobenzodiazepine combining the chloro and bromo substitutions of related analogues, appearing in the illicit supply from around 2021.',
  looks: 'Powder and pressed tablets.',
  reports: 'Very sparse; encountered mostly in counterfeit tablets.',
  harm: 'Uncharacterised. Assume very high potency and long duration; volumetric dosing only.'
},

flunitrazolam: {
  what: 'The triazolo analogue of flunitrazepam and one of the most potent designer benzodiazepines identified, active in the tens of micrograms.',
  looks: 'Powder and blotter.',
  reports: 'Reported alongside clonazolam for producing multi-day blackouts from very small quantities.',
  harm: 'Microgram dosing; cannot be weighed on ordinary scales. Extremely long impairment. Blackout redosing is the primary hazard.'
},

fluclotizolam: {
  what: 'A designer thienotriazolodiazepine of high potency and long duration.',
  looks: 'Powder and pellets.',
  reports: 'Sparse; reported as very strong and long.',
  harm: 'Volumetric dosing only; uncharacterised in humans.'
},

metizolam: {
  what: 'A designer thienodiazepine, the desmethyl analogue of etizolam, of comparable potency and somewhat longer duration.',
  looks: 'Powder and pellets.',
  reports: 'Reported as etizolam-like but longer.',
  harm: 'Volumetric dosing; standard designer-benzodiazepine cautions.'
},

nifoxipam: {
  what: 'A designer benzodiazepine that is also a metabolite of flunitrazepam (3-hydroxydesmethylflunitrazepam), long-acting and potent.',
  looks: 'Powder.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised; long-acting, so accumulation with repeated dosing.'
},

meclonazepam: {
  what: 'A methylated clonazepam analogue originally investigated as an antiparasitic for schistosomiasis, now sold as a designer benzodiazepine. Only one enantiomer is meaningfully active.',
  looks: 'Powder and pellets.',
  reports: 'Reported as long-lasting and sedating; racemic material means half the weight is essentially inert, which confuses dosing.',
  harm: 'Racemic versus single-enantiomer material differs in potency by roughly twofold, and which you have is not knowable. Volumetric dosing.'
},

norflurazepam: {
  what: 'N-desalkylflurazepam — the long-lived active metabolite of flurazepam, quazepam and several other benzodiazepines, with a half-life of two to four days. Also sold in its own right as a designer benzodiazepine.',
  looks: 'Powder.',
  reports: 'Reported as very long-acting with cumulative daytime sedation.',
  harm: 'The multi-day half-life means daily use accumulates severely. It is the reason several prescribed hypnotics impair people for days.'
},

'3-hydroxyphenazepam': {
  what: 'The active hydroxy metabolite of phenazepam, sold as a designer benzodiazepine in its own right.',
  looks: 'Powder.',
  reports: 'Sparse; reported as phenazepam-like.',
  harm: 'Long-acting; the same multi-day impairment and blackout-redose pattern as phenazepam.'
},

zapizolam: {
  what: 'A designer triazolobenzodiazepine that appeared in European seizures from around 2021.',
  looks: 'Powder and pressed tablets.',
  reports: 'Essentially none.',
  harm: 'Entirely uncharacterised in humans. Assume high potency.'
},

bentazepam: {
  what: 'A thienodiazepine anxiolytic once prescribed in Spain, withdrawn after reports of hepatotoxicity.',
  looks: 'Tablets; withdrawn.',
  reports: 'Historical and regional.',
  harm: 'Withdrawn specifically for liver injury, which is unusual among benzodiazepines.'
},

'n-methylclonazepam': {
  what: 'A designer nitro-benzodiazepine, the N-methyl analogue of clonazepam, which is partly a prodrug for clonazepam itself.',
  looks: 'Powder and pellets.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised; conversion to clonazepam means a long tail.'
},

cloniprazepam: {
  what: 'A designer nitro-benzodiazepine that acts largely as a prodrug for clonazepam, with a cyclopropylmethyl group that is cleaved off.',
  looks: 'Powder and pellets.',
  reports: 'Sparse; reported as very long-acting, consistent with clonazepam being the eventual active species.',
  harm: 'Uncharacterised. The prodrug behaviour means duration far exceeds what the parent suggests.'
},

camazepam: {
  what: 'A temazepam dimethylcarbamate ester, prescribed in Italy and Spain, notable for being relatively anxiolytic without much sedation.',
  looks: 'Tablets and capsules; regional.',
  reports: 'Reported as unusually non-sedating for a benzodiazepine.',
  harm: 'Partly a temazepam prodrug, so the tail is longer than the parent suggests.'
},

delorazepam: {
  what: 'A long-acting benzodiazepine prescribed in Italy, and also a metabolite of diclazepam and of several other analogues. Its own active metabolite lorazepam extends it further.',
  looks: 'Tablets and oral drops.',
  reports: 'Reported as long and smooth.',
  harm: 'Long half-life plus active metabolite means substantial accumulation.'
},

nimetazepam: {
  what: 'A nitro-benzodiazepine hypnotic prescribed in Japan as Erimin and heavily misused in Southeast Asia, where it is a major street drug.',
  looks: 'Tablets, historically marked "Erimin 5"; extensively counterfeited.',
  reports: 'In Southeast Asian communities it is reported as strongly sedating and highly habit-forming. Most tablets sold under the name today are counterfeit.',
  harm: 'Partly metabolised to nitrazepam, extending duration. Counterfeits contain unknown designer benzodiazepines.'
},

cinolazepam: {
  what: 'A hypnotic benzodiazepine prescribed mainly in Austria, largely a prodrug for temazepam.',
  looks: 'Capsules; regional.',
  reports: 'Sparse.',
  harm: 'Duration is governed by temazepam rather than by the parent.'
},

ketazolam: {
  what: 'An oxazolo-benzodiazepine prodrug that opens to diazepam and then follows the whole diazepam metabolic chain to nordazepam and oxazepam. Very long overall duration.',
  looks: 'Capsules; regional.',
  reports: 'Reported as gradual in onset and very long, consistent with the prodrug chain.',
  harm: 'The eventual active species are diazepam and nordazepam, so accumulation over days is substantial.'
},

loprazolam: {
  what: 'An imidazo-nitro benzodiazepine hypnotic of intermediate duration, prescribed in the UK and parts of Europe.',
  looks: 'Small tablets.',
  reports: 'Sparse; reported as a moderate hypnotic.',
  harm: 'Standard benzodiazepine cautions.'
},

medazepam: {
  what: 'A benzodiazepine that is essentially a prodrug, converted to diazepam and then nordazepam.',
  looks: 'Capsules and tablets; regional.',
  reports: 'Reported as mild in itself with a long tail from the metabolites.',
  harm: 'Duration is governed by nordazepam; accumulates over days.'
},

halazepam: {
  what: 'A trifluoroethyl benzodiazepine prodrug converted to nordazepam. Largely discontinued.',
  looks: 'Tablets; largely withdrawn.',
  reports: 'Historical.',
  harm: 'Long-acting via nordazepam.'
},

tetrazepam: {
  what: 'A benzodiazepine used as a muscle relaxant, withdrawn across the EU in 2013 after serious cutaneous reactions including Stevens-Johnson syndrome.',
  looks: 'Tablets; withdrawn.',
  reports: 'Historical and regional.',
  harm: 'Withdrawn specifically for severe skin reactions, which is unusual for the class and was the basis of the EU-wide suspension.'
},

quazepam: {
  what: 'A hypnotic benzodiazepine with unusual selectivity for alpha-1 GABA-A subunits, whose long-lived metabolite norflurazepam dominates its duration.',
  looks: 'Tablets.',
  reports: 'Reported as producing accumulating daytime sedation over consecutive nights.',
  harm: 'The two-to-four-day metabolite half-life means nightly use accumulates heavily. Food substantially increases absorption.'
},

'ethyl-loflazepate': {
  what: 'A benzodiazepine ester prodrug prescribed in France and Japan, hydrolysed to descarboxyloflazepate, which is long-acting.',
  looks: 'Tablets; regional.',
  reports: 'Sparse; reported as long and mild.',
  harm: 'Long-acting through its metabolite; accumulates.'
},

pinazepam: {
  what: 'A propargyl-substituted benzodiazepine prescribed in Italy, converted to nordazepam.',
  looks: 'Capsules; regional.',
  reports: 'Sparse.',
  harm: 'Long-acting via nordazepam.'
},

cloxazolam: {
  what: 'An oxazolo-benzodiazepine prescribed in Japan and parts of Europe, converted to a long-acting active metabolite.',
  looks: 'Tablets; regional.',
  reports: 'Sparse.',
  harm: 'Long-acting through metabolites.'
},

fludiazepam: {
  what: 'A fluorinated diazepam analogue prescribed in Japan, substantially more potent than diazepam.',
  looks: 'Tablets; regional. Also sold as a research chemical.',
  reports: 'Sparse; reported as diazepam-like but stronger per milligram.',
  harm: 'Higher potency than diazepam with the same long-acting metabolite chain.'
},

flunitrazepam: {
  what: 'A potent nitro-benzodiazepine hypnotic, Rohypnol, notorious for its association with drug-facilitated assault, which led to reformulation with a blue dye and to withdrawal from several markets.',
  looks: 'Tablets, reformulated to release a blue dye in liquid. Counterfeits do not.',
  reports: 'Reported as producing profound anterograde amnesia at ordinary doses — the property behind its reputation. Most "Rohypnol" encountered today is counterfeit and contains something else.',
  harm: 'Profound amnesia at hypnotic doses. Very dangerous with alcohol. The blue dye is a deterrent, not a guarantee — counterfeits exist without it.'
},

pregabalin: {
  what: 'A gabapentinoid with the same alpha-2-delta target as gabapentin but linear, near-complete absorption, which makes it far more predictable and correspondingly more misusable.',
  looks: 'Capsules, often distinctively coloured by strength.',
  reports: 'Widely reported as euphoric and strongly anxiolytic at supratherapeutic doses, especially in people with opioid tolerance. Now a very common drug of misuse in Europe and the Middle East, and a frequent finding in opioid deaths.',
  harm: 'Substantially increases opioid respiratory depression and is implicated in a large share of opioid deaths where both are present. Renally cleared, so it accumulates dangerously in kidney impairment. Abrupt discontinuation after prolonged use causes a withdrawal syndrome resembling benzodiazepine withdrawal.'
},

carisoprodol: {
  what: 'A muscle relaxant that is largely a prodrug for meprobamate, a barbiturate-like sedative. That metabolite, not the parent, is why it is misused.',
  looks: 'White tablets.',
  reports: 'Reported in combination with an opioid and alprazolam as the "Houston cocktail" or "holy trinity", a combination repeatedly implicated in deaths.',
  harm: 'The meprobamate metabolite is a barbiturate-like sedative with a narrow margin and real withdrawal seizures. The three-drug combination with an opioid and a benzodiazepine is among the most lethal recognised in overdose data.'
},

etifoxine: {
  what: 'A non-benzodiazepine anxiolytic prescribed in France that acts both directly at GABA-A and by promoting neurosteroid synthesis via the translocator protein.',
  looks: 'Capsules; regional.',
  reports: 'Reported as anxiolytic without sedation or intoxication, and without benzodiazepine-style dependence.',
  harm: 'Rare but serious hepatitis and severe cutaneous reactions have led to regulatory review. Not cross-tolerant with benzodiazepines.'
},

flubromazepam: {
  what: 'A designer benzodiazepine with an exceptionally long half-life — over 100 hours in a published self-experiment — and an active hydroxy metabolite that is longer still.',
  looks: 'Powder and pellets.',
  reports: 'Reported as producing sedation lasting several days from a single dose. The published self-experiment is widely cited in harm-reduction communities.',
  harm: 'A single dose can impair for the better part of a week. Redosing daily accumulates to dangerous levels. Volumetric dosing.'
},

pyrazolam: {
  what: 'A designer triazolobenzodiazepine that, unusually, is not metabolised to anything active and is excreted largely unchanged. Reported as relatively anxiolytic without much sedation.',
  looks: 'Powder and pellets.',
  reports: 'Reported as unusually clear-headed for a benzodiazepine, with less sedation and less amnesia than most of the class.',
  harm: 'Less sedating does not mean less dependence-forming. Volumetric dosing; standard designer-benzodiazepine cautions.'
},

deschloroetizolam: {
  what: 'An etizolam analogue lacking the chlorine, of substantially lower potency than etizolam itself.',
  looks: 'Powder and pellets.',
  reports: 'Reported as weaker than etizolam, requiring several times the dose.',
  harm: 'Lower potency invites larger quantities and correspondingly larger weighing errors. Volumetric dosing.'
},

'flualprazolam-analog-adinazolam': {
  what: 'Adinazolam — a triazolobenzodiazepine originally investigated as an antidepressant, whose activity comes largely from N-desmethyladinazolam, a considerably more potent metabolite.',
  looks: 'Powder and pellets.',
  reports: 'Reported as slow in onset and stronger than expected some time after dosing, which is the prodrug behaviour showing.',
  harm: 'The delayed conversion to a more potent metabolite is a classic redosing trap. Volumetric dosing.'
},

nitrazolam: {
  what: 'A designer triazolobenzodiazepine, the nitro analogue in the alprazolam family, of high potency.',
  looks: 'Powder and blotter.',
  reports: 'Sparse; reported as strongly amnestic.',
  harm: 'Microgram-to-low-milligram dosing; volumetric only.'
},

pynazolam: {
  what: 'A designer triazolobenzodiazepine with a pyrrolidinyl substitution, appearing in European seizures from around 2021.',
  looks: 'Powder and pressed tablets.',
  reports: 'Essentially none.',
  harm: 'Uncharacterised in humans. Assume high potency.'
},

fluoprazolam: {
  what: 'A designer triazolobenzodiazepine closely related to flualprazolam, appearing in recent seizures.',
  looks: 'Powder and pressed tablets.',
  reports: 'Essentially none.',
  harm: 'Uncharacterised; assume flualprazolam-like potency and duration.'
},

ethylbromazolam: {
  what: 'A designer triazolobenzodiazepine related to bromazolam, appearing in the illicit supply as controls tightened on its parent.',
  looks: 'Powder and pressed tablets.',
  reports: 'Essentially none.',
  harm: 'Uncharacterised. Assume bromazolam-like behaviour at minimum.'
},

bromonordiazepam: {
  what: 'A designer benzodiazepine, the brominated analogue of nordazepam, long-acting by structure.',
  looks: 'Powder.',
  reports: 'Essentially none.',
  harm: 'Uncharacterised; the nordazepam-like structure implies a long half-life and accumulation.'
},

gidazepam: {
  what: 'A Soviet-developed benzodiazepine prodrug whose activity comes almost entirely from desalkylgidazepam, a long-acting metabolite. Notably anxiolytic with relatively little sedation.',
  looks: 'Tablets in some post-Soviet countries; powder elsewhere.',
  reports: 'Reported as slow to come on and very long-lasting, consistent with prodrug conversion to a long-lived active.',
  harm: 'Delayed onset invites redosing. The active metabolite is very long-lived, so accumulation is substantial.'
},

desalkylgidazepam: {
  what: 'The active metabolite of gidazepam, now sold in its own right as a designer benzodiazepine. Long-acting and increasingly detected in European seizures.',
  looks: 'Powder and pressed tablets.',
  reports: 'Sparse; reported as long-acting and strongly anxiolytic.',
  harm: 'Long half-life means accumulation with repeated dosing. Volumetric dosing.'
},

nordazepam: {
  what: 'Desmethyldiazepam — the long-lived active metabolite that sits at the centre of the benzodiazepine family tree. Diazepam, clorazepate, prazepam, medazepam, ketazolam, halazepam and pinazepam all converge on it, and its two-to-four-day half-life is why all of them accumulate.',
  looks: 'Prescribed as a drug in its own right in Italy and a few other countries; otherwise encountered as a metabolite.',
  reports: 'Reported by people taking diazepam as the reason effects and impairment persist far beyond the first day.',
  harm: 'The multi-day half-life means anything that produces it accumulates over roughly two weeks of daily use before reaching steady state. It is why "I only take diazepam at night" still means being impaired during the day.'
},

oxazepam: {
  what: 'A short-to-intermediate benzodiazepine that is the terminal active metabolite of diazepam, nordazepam, temazepam and several others. Glucuronidated directly, with no CYP oxidation, which makes it a standard choice in liver impairment and in older people.',
  looks: 'Capsules and tablets.',
  reports: 'Reported as slow in onset and mild, which is why it has less misuse liability than most of the class.',
  harm: 'Slow onset makes it less rewarding but also invites redosing before the first dose has landed. Standard benzodiazepine cautions.'
},

flumazenil: {
  what: 'A benzodiazepine antagonist that competitively displaces benzodiazepines from the GABA-A site. Used to reverse procedural sedation and, cautiously, in some overdoses.',
  looks: 'Ampoules; hospital use.',
  reports: 'Not used recreationally. Reported clinically as producing abrupt reversal, sometimes with agitation.',
  harm: 'In a benzodiazepine-dependent person it precipitates withdrawal seizures, and in a mixed overdose involving a tricyclic or another proconvulsant it can cause intractable seizures — which is why it is used far more sparingly than naloxone. Its half-life is shorter than most benzodiazepines, so re-sedation is expected.'
},

/* ================= Stimulants ================= */

caffeine: {
  what: 'An adenosine receptor antagonist — it does not stimulate directly, it blocks the signal that accumulates through the day and makes you feel tired. That adenosine keeps building while it is blocked, which is why the crash exists.',
  looks: 'White crystalline powder; in practice, coffee, tea, energy drinks and tablets. Anhydrous caffeine powder sold as a supplement is dangerously concentrated — a teaspoon is roughly ten cups of coffee.',
  reports: 'The most useful thing reported in nootropic communities is the tolerance curve: daily users largely stop getting stimulation and keep only the withdrawal relief. Combination with L-theanine to blunt the anxiety is very widely reported and has modest evidence behind it. Withdrawal headaches from stopping abruptly are near-universal.',
  harm: 'Pure caffeine powder has killed people who measured it with a kitchen spoon; if using powder, weigh it or do not use it. Doses above roughly 400 mg in a sitting raise anxiety and arrhythmia risk sharply. It is metabolised by CYP1A2, so fluvoxamine, ciprofloxacin and oral contraceptives can multiply its half-life several-fold, while smoking roughly halves it.'
},

nicotine: {
  what: 'A nicotinic acetylcholine receptor agonist that is both stimulating and, at higher doses and by desensitising receptors, calming. It is among the most reinforcing drugs known, largely because of how fast inhaled nicotine reaches the brain.',
  looks: 'Cigarettes, pouches, patches, gum, lozenges and vape liquid. Concentrated e-liquid base and pure nicotine are acutely poisonous by skin contact and by ingestion.',
  reports: 'The consistent theme is that the dependence is not really about the nicotine dose but about the speed of delivery — inhaled products are far harder to stop than patches or gum at the same nicotine level. Pouches and vapes are widely reported as producing dependence in people who never smoked.',
  harm: 'Concentrated liquid nicotine is lethal to children in small amounts and is absorbed through skin; keep it sealed and out of reach. Most of the harm from smoking is combustion products rather than nicotine, which is the basis of substitution approaches, but nicotine itself raises heart rate and blood pressure and is not harmless in pregnancy or adolescence.'
},

amphetamine: {
  what: 'A releasing agent that reverses the dopamine and noradrenaline transporters, pushing transmitter out of the neuron rather than merely blocking reuptake. That mechanism is why it depletes and why tolerance and the crash behave as they do.',
  looks: 'Pharmaceutically, tablets and capsules. Illicitly, "speed" is usually a damp off-white to beige paste or powder of low purity, commonly cut with caffeine and creatine; amphetamine sulfate purity in Europe is often under 20%.',
  reports: 'Consistently reported themes: rapid tolerance within days, appetite loss, jaw tension, and a comedown proportional to how long the run lasted. Redosing to hold the effect is reported everywhere as the thing that turns a night into a three-day episode.',
  harm: 'Stays in the body far longer at alkaline urine pH; sodium bicarbonate dramatically prolongs it and acidifying agents shorten it. Cardiac strain is dose-dependent and real. Sleep deprivation, not the drug itself, causes most stimulant psychosis. Do not combine with MAOIs — that combination causes hypertensive crisis and is potentially fatal.'
},

dextroamphetamine: {
  what: 'The d-enantiomer of amphetamine, roughly three to four times more potent than the l-enantiomer at dopamine release and correspondingly more "psychological" and less peripheral in effect.',
  looks: 'Tablets and modified-release capsules.',
  reports: 'Reported as cleaner and more focused than racemic amphetamine, with less of the peripheral jitteriness the l-isomer contributes.',
  harm: 'Same cautions as amphetamine. Urinary pH strongly affects duration.'
},

lisdexamfetamine: {
  what: 'Dextroamphetamine covalently bound to the amino acid lysine, inactive until red blood cells cleave the bond. The rate-limited enzymatic conversion is what gives it a smooth onset and a long, flat curve, and is why it cannot be made to hit faster by snorting or injecting it.',
  looks: 'Capsules and chewable tablets.',
  reports: 'Widely reported as the smoothest of the ADHD stimulants, with the least pronounced peak and crash. Attempts to defeat the prodrug by insufflation are reported, correctly, to accomplish nothing.',
  harm: 'The conversion step is saturable, so very large doses do not scale proportionally — but they still accumulate. Same cardiovascular and MAOI cautions as amphetamine.'
},

methylphenidate: {
  what: 'A dopamine and noradrenaline reuptake inhibitor rather than a releasing agent, which makes its pharmacology closer to cocaine than to amphetamine, with a much slower brain entry when taken orally.',
  looks: 'Tablets, modified-release tablets with osmotic pumps, and patches. The osmotic-pump shells pass through intact, which alarms people unnecessarily.',
  reports: 'Reported as more "narrow" and less euphoric than amphetamine, with a sharper wear-off. Peripheral vasoconstriction and cold hands are commonly reported.',
  harm: 'Do not crush or inject modified-release forms — the excipients cause serious vascular injury. Only the d-threo enantiomer is active. MAOI combination is contraindicated.'
},

methamphetamine: {
  what: 'A methylated amphetamine that crosses into the brain considerably faster and more completely, with a half-life roughly twice as long. The added methyl group is the whole difference, and it is a large one.',
  looks: 'Clear or bluish-white crystals ("shard", "ice") or an off-white powder. Crystal clarity is often taken as a purity signal and is not a reliable one.',
  reports: 'The consistent reports across communities are the length of the effect (8–12 hours, with a full day or more of sleeplessness), the severity of multi-day binges, and stimulant psychosis from sleep deprivation. Dental and skin damage are widely reported and are largely secondary to sleeplessness, dry mouth and behaviour rather than direct toxicity.',
  harm: 'Neurotoxicity to dopamine terminals is dose- and hyperthermia-dependent — staying cool and hydrated matters. Do not go without sleep; psychosis risk rises steeply after the second night. Smoking or injecting delivers the whole dose at once and drives dependence far faster than oral use. Never with MAOIs.'
},

cocaine: {
  what: 'A dopamine, noradrenaline and serotonin reuptake inhibitor that is also a local anaesthetic through sodium-channel blockade. That second mechanism is why it numbs, and it is also a substantial part of its cardiac toxicity.',
  looks: 'White crystalline powder, often shiny and flaky. Almost always cut — levamisole is the near-universal adulterant worldwide, alongside phenacetin, lidocaine and caffeine. Crack is an off-white rock made by freebasing.',
  reports: 'Short duration and compulsive redosing dominate every report. The combination with alcohol is very widely used and is chemically distinct: the two form cocaethylene, which lasts longer and is more cardiotoxic. Levamisole-related agranulocytosis and skin necrosis are recurring community warnings and are documented in the literature.',
  harm: 'Cardiac events happen in young people with no prior disease, and beta-blockers are the wrong treatment (unopposed alpha stimulation) — benzodiazepines are the standard. Levamisole causes agranulocytosis; unexplained infections or mouth ulcers after cocaine use need a blood count. Mixing with alcohol produces cocaethylene and multiplies cardiac risk. Never with opioids without naloxone present — cocaine wears off first.'
},

modafinil: {
  what: 'A wakefulness-promoting agent that is a weak dopamine reuptake inhibitor but whose full mechanism involves orexin and histamine systems. It promotes wakefulness without the euphoria or peripheral load of classical stimulants.',
  looks: 'White tablets.',
  reports: 'Widely reported in nootropic communities as producing wakefulness and persistence without much mood elevation — "you will do the task, you just will not enjoy it". Headache and dehydration are the most reported side effects. Insomnia from taking it too late is near-universal.',
  harm: 'A CYP3A4 inducer, so it reduces the effectiveness of hormonal contraception — this is a genuine and frequently missed interaction. Rare but serious skin reactions including Stevens-Johnson syndrome mean any rash is a reason to stop immediately. Long half-life; taking it after mid-morning costs a night of sleep.'
},

armodafinil: {
  what: 'The longer-lived R-enantiomer of modafinil, marketed separately. Higher plasma levels late in the day for the same nominal dose.',
  looks: 'White tablets.',
  reports: 'Reported as longer and somewhat sharper than modafinil.',
  harm: 'Identical cautions to modafinil, with a longer tail — the contraceptive interaction and the insomnia are both more pronounced.'
},

mdpv: {
  what: 'A synthetic cathinone and extremely potent dopamine–noradrenaline reuptake inhibitor, more potent at DAT than cocaine by an order of magnitude, with a long duration and essentially no serotonergic component.',
  looks: 'White to tan powder or crystals; was a primary component of "bath salts" products.',
  reports: 'Reported almost universally as intensely compulsive — the redosing urge is described as unlike other stimulants — with prolonged insomnia, paranoia and psychosis after even short runs. Communities generally advise against it outright.',
  harm: 'The compulsion to redose is the primary harm and is not a matter of willpower. Very high potency by weight, so dosing errors are easy. Hyperthermia, agitated delirium and rhabdomyolysis have caused deaths. Sleep deprivation-driven psychosis is common after a single long session.'
},

'a-pvp': {
  what: 'A synthetic cathinone closely related to MDPV, a potent dopamine and noradrenaline reuptake inhibitor with a long duration.',
  looks: 'White to off-white crystals ("flakka"); sold in crystal or powder form.',
  reports: 'Same compulsive-redosing theme as MDPV, with widely reported agitated delirium and prolonged psychosis after binges.',
  harm: 'Hyperthermia and excited delirium have caused deaths. Compulsive redosing is the defining hazard. Do not use alone or without a clear stopping point.'
},

mephedrone: {
  what: 'A synthetic cathinone that both releases and blocks reuptake of dopamine and serotonin, giving it a genuinely entactogenic character alongside the stimulation — closer to a hybrid of MDMA and amphetamine than to either.',
  looks: 'White or off-white powder or crystals, with a characteristic strong odour that people describe variously and that is easily recognised.',
  reports: 'The dominant theme is compulsive redosing: the effect is short and the urge to redose is repeatedly described as stronger than with MDMA or amphetamine, leading to consumption of far more than intended. Nasal damage from insufflation is very widely reported. Post-use low mood for several days is common.',
  harm: 'Short duration plus strong redose compulsion means people routinely take multiple grams in a night. Serotonergic, so MAOI combination is dangerous and combining with other serotonergics adds risk. Very hard on the nose; heavy vasoconstriction and reported cases of tissue damage.'
},

'3-mmc': {
  what: 'A positional isomer of mephedrone with the methyl group at the 3-position, somewhat less serotonergic and more stimulant in character, which appeared as mephedrone was controlled.',
  looks: 'White to off-white crystals or powder.',
  reports: 'Reported as similar to mephedrone but less warm and more compulsively redosed, with a longer duration.',
  harm: 'Same redose compulsion and nasal damage as mephedrone. Widely implicated in chemsex-related harm alongside other drugs.'
},

'2-fma': {
  what: 'A fluorinated amphetamine analogue, functionally a releasing agent with a longer and smoother profile than amphetamine and relatively little serotonergic activity.',
  looks: 'White powder, sold as a research chemical.',
  reports: 'Consistently reported in nootropic and research-chemical communities as one of the more "functional" stimulants — clear-headed, long, with a mild comedown compared with amphetamine.',
  harm: 'Long duration means late doses cost sleep. Ring-fluorinated amphetamines have not been studied for long-term safety in humans at all. Standard stimulant cardiac cautions; no MAOIs.'
},

'4-fa': {
  what: 'A fluorinated amphetamine that is substantially more serotonergic than 2-FA or 2-FMA, occupying a middle ground between amphetamine and MDMA.',
  looks: 'White or off-white powder; was widely sold in the Netherlands.',
  reports: 'Reported as an MDMA-like warmth with amphetamine-like stimulation. The Dutch experience is the important part of the report base: a cluster of haemorrhagic strokes and cardiac events led to it being banned there in 2017, and severe headache during the comedown was a widely reported precursor.',
  harm: 'Associated with haemorrhagic stroke and cardiac events at recreational doses in otherwise healthy young people — this is documented, not anecdotal. Severe headache after use should be treated as a warning sign. Serotonergic, so no MAOIs and caution with other serotonergics.'
},

'3-fpm': {
  what: '3-fluorophenmetrazine, a phenylmorpholine stimulant related to phenmetrazine, acting as a noradrenaline and dopamine releasing agent.',
  looks: 'White powder or crystals.',
  reports: 'Reported as a functional, long stimulant with a smooth character but a pronounced tendency to redose. Vasoconstriction and cold extremities are commonly reported.',
  harm: 'Marked vasoconstriction and a long duration that invites redosing into sleeplessness. Cardiac strain reported at higher doses.'
},

ephedrine: {
  what: 'A plant alkaloid and mixed-acting sympathomimetic: it releases noradrenaline and also directly stimulates adrenergic receptors, with much more peripheral than central effect.',
  looks: 'Tablets, and the main constituent of ma huang. Sold as a decongestant and, in some places, restricted because it is a methamphetamine precursor.',
  reports: 'Reported as mostly peripheral — racing heart, tremor, little mental lift — which is why it is generally disappointing as a stimulant and useful as a bronchodilator and thermogenic.',
  harm: 'Raises blood pressure substantially with little central reward, which is a bad ratio. Combination with caffeine (the old "ECA stack") raises cardiac risk. Never with MAOIs.'
},

pseudoephedrine: {
  what: 'A stereoisomer of ephedrine with more selective peripheral decongestant action and less central stimulation.',
  looks: 'Tablets, usually behind the pharmacy counter because of precursor controls.',
  reports: 'Reported as a decongestant with mild stimulation and insomnia as side effects rather than as a stimulant in its own right.',
  harm: 'Raises blood pressure; avoid in uncontrolled hypertension. Never with MAOIs.'
},

ethylphenidate: {
  what: 'The ethyl ester analogue of methylphenidate, formed in the body when methylphenidate and alcohol are taken together, and also sold as a research chemical. More dopaminergic and less noradrenergic than methylphenidate.',
  looks: 'White powder; was widely sold in the UK before the psychoactive substances legislation.',
  reports: 'Reported as more euphoric and more compulsive than methylphenidate, with severe nasal damage from insufflation — this was a notably common report in the period it was widely available in the UK.',
  harm: 'Strongly caustic to nasal tissue. Compulsive redosing is a common report. Forms in the body from methylphenidate plus alcohol, which is a reason that combination is not neutral.'
},

'4f-mph': {
  what: '4-fluoromethylphenidate, a fluorinated methylphenidate analogue substantially more potent than the parent and more dopamine-selective.',
  looks: 'White powder.',
  reports: 'Reported as more euphoric and considerably stronger by weight than methylphenidate, with a strong redose compulsion and long duration.',
  harm: 'Higher potency by weight than methylphenidate means dosing errors matter more. Long duration and compulsive redosing lead to sleeplessness and stimulant psychosis.'
},

hexen: {
  what: 'N-ethylhexedrone, a synthetic cathinone and dopamine–noradrenaline reuptake inhibitor of the pyrovalerone family, related to α-PVP.',
  looks: 'White to off-white crystals or powder.',
  reports: 'Reported with the same compulsive-redosing pattern as α-PVP and MDPV, with rapid tolerance and paranoia on longer runs.',
  harm: 'Compulsive redosing, insomnia and psychosis are the characteristic harms of this family. Uncharacterised in humans.'
},

methcathinone: {
  what: 'The ketone analogue of methamphetamine and the parent compound of the synthetic cathinones, a potent dopamine and noradrenaline releasing agent.',
  looks: 'White powder; historically made in home labs by oxidising ephedrine, often with permanganate.',
  reports: 'The important report is not about the drug: permanganate-based home synthesis leaves manganese in the product, and chronic use of that product causes an irreversible parkinsonian syndrome, well documented in the Baltic states and Russia.',
  harm: 'Manganese contamination from permanganate synthesis causes permanent parkinsonism. This is not theoretical — it is a documented epidemic. The drug itself carries standard stimulant risks.'
},

'4-cmc': {
  what: '4-chloromethcathinone (clephedrone), a synthetic cathinone related to mephedrone with the chlorine replacing the methyl group.',
  looks: 'White to off-white crystals.',
  reports: 'Reported as weaker and less pleasant than mephedrone, with more of the compulsive quality and less of the warmth.',
  harm: 'Uncharacterised. Standard cathinone cautions: redose compulsion, cardiac strain, serotonergic interactions.'
},

'2-fa': {
  what: '2-fluoroamphetamine, a ring-fluorinated amphetamine that behaves as a fairly clean dopamine and noradrenaline releasing agent with little serotonergic activity.',
  looks: 'White powder.',
  reports: 'Reported as amphetamine-like but somewhat longer and cleaner, with a gentler comedown. Generally regarded in research-chemical communities as one of the more benign substituted amphetamines, which is a comparative statement, not an endorsement.',
  harm: 'No long-term human safety data exists for ring-fluorinated amphetamines. Standard stimulant cardiac cautions; no MAOIs.'
},

isopropylphenidate: {
  what: 'The isopropyl ester analogue of methylphenidate, a dopamine and noradrenaline reuptake inhibitor of comparable potency to the parent.',
  looks: 'White powder.',
  reports: 'Reported as methylphenidate-like with a longer duration and somewhat less peripheral stimulation.',
  harm: 'Uncharacterised in humans. Standard stimulant cautions.'
},

propylhexedrine: {
  what: 'A cyclohexyl amphetamine analogue used as a nasal decongestant inhaler, with mostly peripheral sympathomimetic action.',
  looks: 'Nasal inhalers containing a cotton wick soaked with the drug.',
  reports: 'Extraction from inhalers and injection or ingestion is a recurring pattern, and is associated with a specific and serious cardiac toxicity.',
  harm: 'Injection or ingestion of inhaler contents has caused sudden cardiac death and pulmonary hypertension. The inhaler also contains menthol and other excipients not meant to be swallowed or injected.'
},

khat: {
  what: 'The leaf of Catha edulis, chewed in East Africa and the Arabian Peninsula, containing cathinone and cathine. Cathinone, the more potent alkaloid, degrades within days of harvest, which is why khat is traded fresh and rapidly.',
  looks: 'Fresh green leaves and shoots, bundled and often wrapped in banana leaves to retain moisture.',
  reports: 'Reported as a mild, long, sociable stimulation quite unlike a powder stimulant, with insomnia and appetite loss. Regular chewing is reported to produce dependence and dental and oral problems.',
  harm: 'The cathinone content declines rapidly after harvest, so potency is unpredictable. Chronic use is associated with oral cancers, periodontal disease, hypertension and, in heavy users, psychosis. Frequently chewed alongside tobacco and with sugary drinks.'
},

pentedrone: {
  what: 'A synthetic cathinone acting as a dopamine and noradrenaline reuptake inhibitor, structurally between the mephedrone and pyrovalerone families.',
  looks: 'White to off-white powder or crystals.',
  reports: 'Reported as a fairly strong, long stimulant with a marked redose compulsion.',
  harm: 'Uncharacterised. Standard cathinone cautions.'
},

'4-mec': {
  what: '4-methylethcathinone, a synthetic cathinone closely related to mephedrone with an ethyl rather than methyl group on the nitrogen. Less serotonergic than mephedrone.',
  looks: 'White or off-white crystals.',
  reports: 'Reported as a weaker and less warm mephedrone, appearing widely as a mephedrone substitute after bans.',
  harm: 'Uncharacterised. Standard cathinone cautions.'
},

'3-cmc': {
  what: '3-chloromethcathinone, a synthetic cathinone that became one of the most commonly detected cathinones in Europe as earlier ones were controlled.',
  looks: 'White to off-white crystals or powder.',
  reports: 'Reported as broadly mephedrone-like but harsher, with a stronger compulsion and less warmth.',
  harm: 'Uncharacterised. Widely present in the European supply, often sold as something else.'
},

mdphp: {
  what: 'A pyrovalerone-type synthetic cathinone with a methylenedioxy ring, a potent dopamine–noradrenaline reuptake inhibitor.',
  looks: 'White to off-white crystals.',
  reports: 'Reported with the characteristic pyrovalerone pattern: strong compulsion, long duration, paranoia and insomnia on longer runs.',
  harm: 'Uncharacterised. This family has the worst compulsive-redosing profile of any stimulant class.'
},

'3-4-ctmp': {
  what: '3,4-dichloromethylphenidate, a highly potent methylphenidate analogue — considerably more potent than the parent at dopamine reuptake.',
  looks: 'White powder.',
  reports: 'Reported as very potent by weight and long, with strong compulsion and pronounced vasoconstriction.',
  harm: 'High potency by weight makes weighing errors dangerous. Long duration with strong redose compulsion; reports of severe vasoconstriction.'
},

'4-fma': {
  what: '4-fluoromethamphetamine, a ring-fluorinated methamphetamine analogue with a mixed dopaminergic and serotonergic profile.',
  looks: 'White powder.',
  reports: 'Reported as somewhere between amphetamine and MDMA in character, with less of either than the corresponding pure drug.',
  harm: 'Related to 4-FA, which is associated with haemorrhagic stroke; the same caution should be assumed here. Serotonergic — no MAOIs.'
},

phentermine: {
  what: 'An amphetamine-related noradrenaline releasing agent prescribed as an appetite suppressant, with much less dopaminergic effect than amphetamine.',
  looks: 'Capsules and tablets.',
  reports: 'Reported as producing appetite suppression and jitteriness with little euphoria, which is why its misuse liability is comparatively low.',
  harm: 'Raises blood pressure and heart rate. The historical fen-phen combination caused valvular heart disease — that was fenfluramine, not phentermine, but the combination is the reason for the caution. Never with MAOIs.'
},

diethylpropion: {
  what: 'Amfepramone, a cathinone-class appetite suppressant that is a prodrug for several active metabolites, mainly noradrenergic.',
  looks: 'Tablets.',
  reports: 'Sparse; reported as a mild stimulant appetite suppressant.',
  harm: 'Cardiovascular risk and pulmonary hypertension concerns led to restriction in Europe. Never with MAOIs.'
},

phendimetrazine: {
  what: 'A prodrug for phenmetrazine, a noradrenaline and dopamine releasing agent, prescribed as an appetite suppressant.',
  looks: 'Tablets and capsules.',
  reports: 'Sparse.',
  harm: 'The active metabolite phenmetrazine has substantial misuse liability. Cardiovascular cautions apply.'
},

fenfluramine: {
  what: 'A serotonin releasing agent, withdrawn as a weight-loss drug after causing valvular heart disease and pulmonary hypertension, and since reintroduced at low doses for Dravet syndrome under close cardiac monitoring.',
  looks: 'Tablets and oral solution.',
  reports: 'Historical, dominated by the fen-phen valvulopathy episode.',
  harm: 'Causes valvular heart disease through 5-HT2B agonism — this is the reason the whole class of 5-HT2B agonists is treated with suspicion. Serotonin syndrome risk with any other serotonergic. Requires echocardiographic monitoring in its current indication.'
},

atomoxetine: {
  what: 'A selective noradrenaline reuptake inhibitor used for ADHD. It is not a stimulant and produces no acute reinforcement, which is why it has no misuse liability and why it takes weeks to work.',
  looks: 'Capsules.',
  reports: 'Consistently reported as taking four to six weeks to produce benefit, with nausea and reduced appetite early on. People expecting a stimulant effect report disappointment.',
  harm: 'Heavily CYP2D6-dependent — poor metabolisers have roughly ten times the exposure and need lower doses. Rare hepatotoxicity; any jaundice or dark urine warrants stopping. Carries a suicidality warning in young people.'
},

solriamfetol: {
  what: 'A dopamine and noradrenaline reuptake inhibitor approved for excessive daytime sleepiness in narcolepsy and sleep apnoea.',
  looks: 'Tablets.',
  reports: 'Reported as wake-promoting with more cardiovascular effect than modafinil.',
  harm: 'Raises blood pressure and heart rate more than modafinil does. Renally cleared. Contraindicated with MAOIs.'
},

pemoline: {
  what: 'An oxazoline stimulant once used for ADHD, withdrawn from most markets because of fatal liver failure.',
  looks: 'Tablets; withdrawn.',
  reports: 'Historical.',
  harm: 'Withdrawn for idiosyncratic, sometimes fatal, hepatotoxicity that could not be predicted or monitored reliably.'
},

fenethylline: {
  what: 'A prodrug that splits into amphetamine and theophylline. Manufactured historically as Captagon and now produced illicitly on an enormous scale in the Middle East, where most "Captagon" tablets contain amphetamine with caffeine rather than fenethylline.',
  looks: 'Small white or off-white tablets stamped with two crescents, the Captagon mark. The mark is copied; contents vary wildly.',
  reports: 'Reported regionally as an amphetamine-like stimulant. The important fact is that the branding is essentially meaningless — the tablets are amphetamine of unknown dose plus adulterants.',
  harm: 'Dose is unknowable. The theophylline component adds cardiac and seizure risk to the amphetamine. Never with MAOIs.'
},

dmaa: {
  what: '1,3-dimethylamylamine, an aliphatic amine sold in pre-workout and weight-loss supplements as a "natural geranium extract", which it is not. A noradrenaline releasing agent with mostly peripheral effect.',
  looks: 'Powder in supplement blends, rarely sold alone.',
  reports: 'Reported as strongly stimulating with heavy vasoconstriction and headache. Associated with deaths in military recruits during exertion.',
  harm: 'Causes marked blood-pressure rises and has caused haemorrhagic stroke and cardiac arrest, particularly combined with exercise or caffeine. Banned by the FDA as a supplement ingredient. Never with MAOIs.'
},

bromantane: {
  what: 'A Russian-developed "actoprotector" — an adamantane derivative that acts indirectly by upregulating dopamine synthesis enzymes rather than by releasing or blocking reuptake. It is also an anxiolytic.',
  looks: 'White powder or capsules, sold as a nootropic.',
  reports: 'Reported in nootropic communities as subtle, slow-building over days rather than acute, and as combining stimulation with anxiety reduction, which is unusual.',
  harm: 'Very long half-life and accumulation with daily use. Almost all the human data is Russian and not independently replicated. Was banned in sport as a masking agent.'
},

naphyrone: {
  what: 'A naphthalene-based pyrovalerone cathinone, a potent triple reuptake inhibitor, sold as "NRG-1" as mephedrone was banned.',
  looks: 'White powder; much of what was sold as NRG-1 never contained it.',
  reports: 'Reported with the pyrovalerone pattern: strong, long, compulsive, with poor sleep and paranoia.',
  harm: 'Uncharacterised. Serotonergic as well as dopaminergic, so interaction risk with other serotonergics is added to the usual cathinone hazards.'
},

phenylpiracetam: {
  what: 'A phenylated racetam, more potent than piracetam and with genuine stimulant properties that the rest of the racetam family lacks. Developed in the Soviet space programme.',
  looks: 'White powder or tablets.',
  reports: 'Reported in nootropic communities as clearly stimulating and physically performance-enhancing, with tolerance building quickly enough that most people cycle it rather than take it daily.',
  harm: 'Banned by WADA. Tolerance builds within days of continuous use. Interacts with other stimulants additively.'
},

'a-php': {
  what: 'Alpha-pyrrolidinohexanophenone, a pyrovalerone cathinone closely related to α-PVP with one more carbon, a potent dopamine–noradrenaline reuptake inhibitor.',
  looks: 'White to off-white crystals.',
  reports: 'Reported with the same intense redose compulsion and psychosis risk as α-PVP.',
  harm: 'Uncharacterised. This family has the worst compulsion profile of any stimulant class; hyperthermia and agitated delirium have been fatal.'
},

'a-pihp': {
  what: 'Alpha-pyrrolidinoisohexanophenone, a branched pyrovalerone cathinone appearing in the supply as its relatives were controlled.',
  looks: 'White to off-white crystals.',
  reports: 'Very sparse; reported as α-PHP-like.',
  harm: 'Uncharacterised; assume the pyrovalerone pattern of compulsion, insomnia and psychosis.'
},

'2-mmc': {
  what: 'A positional isomer of mephedrone with the methyl group at the 2-position, reported to be weaker than either mephedrone or 3-MMC.',
  looks: 'White crystals or powder.',
  reports: 'Reported as noticeably weaker than 3-MMC, requiring larger doses.',
  harm: 'Uncharacterised. Larger doses of an uncharacterised cathinone is not a safer position to be in.'
},

buphedrone: {
  what: 'A synthetic cathinone, the ethyl homologue of methcathinone, acting as a dopamine and noradrenaline releasing agent.',
  looks: 'White powder or crystals.',
  reports: 'Sparse; reported as a fairly plain stimulant cathinone.',
  harm: 'Uncharacterised. Standard cathinone cautions.'
},

mdpep: {
  what: 'A methylenedioxy pyrovalerone cathinone, a potent dopamine–noradrenaline reuptake inhibitor of the same family as MDPV.',
  looks: 'White to off-white crystals.',
  reports: 'Essentially none.',
  harm: 'Uncharacterised. Assume the MDPV pattern: extreme redose compulsion, insomnia, psychosis.'
},

'hdmp-28': {
  what: 'Also called methylnaphthidate, a naphthalene analogue of methylphenidate acting as a dopamine and noradrenaline reuptake inhibitor.',
  looks: 'White powder.',
  reports: 'Sparse; reported as methylphenidate-like with a strong compulsion to redose.',
  harm: 'Uncharacterised in humans. Standard stimulant cautions.'
},

cocaethylene: {
  what: 'Formed in the liver whenever cocaine and alcohol are present together — a transesterification product that is itself an active dopamine reuptake inhibitor with a substantially longer half-life than cocaine.',
  looks: 'Not sold or encountered as a substance; it is made inside the person combining cocaine with alcohol.',
  reports: 'The combination is extremely common and widely reported as feeling smoother and longer than cocaine alone, which is exactly what cocaethylene formation predicts. Few people know the compound exists.',
  harm: 'It is more cardiotoxic than cocaine and lasts longer, and the combination carries a substantially higher risk of sudden death than either drug alone. This is the specific pharmacological reason not to drink while using cocaine.'
},

paraxanthine: {
  what: 'The main human metabolite of caffeine, accounting for roughly 80% of its breakdown and for a large share of what caffeine actually does. A more selective adenosine antagonist than caffeine with less phosphodiesterase activity.',
  looks: 'Sold as a supplement powder in its own right.',
  reports: 'Reported as caffeine-like with less anxiety and jitteriness, which is consistent with the narrower receptor profile.',
  harm: 'Behaves as a stimulant; the same cardiovascular and sleep cautions apply. CYP1A2 governs how much of it a given person makes from caffeine, which is a large part of why caffeine responses differ so much.'
},

theophylline: {
  what: 'A methylxanthine used as a bronchodilator, also a caffeine metabolite. More potent at phosphodiesterase inhibition than caffeine and with a narrow therapeutic window.',
  looks: 'Tablets and modified-release capsules; also in tea at low levels.',
  reports: 'Reported clinically for nausea, tremor and palpitations, which are the standard signs it is getting too high.',
  harm: 'Narrow therapeutic index with seizures and arrhythmia in overdose. CYP1A2-dependent, so fluvoxamine, ciprofloxacin and stopping smoking all raise levels substantially and have caused toxicity.'
},

theobromine: {
  what: 'The principal methylxanthine of cacao, a weak adenosine antagonist with much less CNS effect than caffeine but a longer half-life and a stronger vasodilator and diuretic action.',
  looks: 'Present in chocolate; also sold as a powder.',
  reports: 'Reported as producing a mild, long, non-jittery lift — the reason dark chocolate feels different from coffee.',
  harm: 'Dogs and cats clear it far more slowly than humans, which is why chocolate is toxic to them. In humans it is mild, but high intakes cause the same restlessness and diuresis as other xanthines.'
},

cathine: {
  what: 'Norpseudoephedrine, one of the two active alkaloids of khat and a metabolite of cathinone. Much weaker than cathinone, with mostly peripheral sympathomimetic action.',
  looks: 'Present in khat leaf; also sold as an appetite suppressant in some countries.',
  reports: 'Reported as mild, closer to ephedrine than to amphetamine.',
  harm: 'Raises blood pressure. It is the alkaloid that survives in dried khat after cathinone has degraded, which is why old khat is weak and peripheral rather than stimulating.'
},

/* ================= Psychedelics ================= */

lsd: {
  what: 'Lysergic acid diethylamide, a semi-synthetic ergoline and the most potent common psychedelic by weight, active at tens of micrograms. Primarily a 5-HT2A agonist, but with substantial activity at dopamine and other serotonin receptors that distinguishes it from the tryptamines and phenethylamines.',
  looks: 'Almost always blotter paper — small perforated squares, often printed with artwork. Also liquid in dropper bottles and, rarely, gel tabs. Blotter appearance and printing say nothing about dose or content; NBOMes were sold on identical blotter for years and killed people.',
  reports: 'The two most consistent themes across decades are duration — 8 to 12 hours plus several hours of afterglow and sleeplessness, which people repeatedly underestimate — and the dominance of set and setting over dose. HPPD (persistent visual disturbance) is reported by a minority and is real. Tolerance is reported to be near-complete for several days after a dose.',
  harm: 'LSD is bitter; NBOMe compounds are extremely bitter and numbing, and if blotter tastes strongly of anything, that is a warning. Ehrlich reagent distinguishes indoles (LSD) from NBOMes, which do not react. Do not combine with lithium — that combination is associated with seizures and is one of the few genuinely dangerous psychedelic interactions. Tramadol lowers the seizure threshold too. Physically it is remarkably non-toxic; the risks are psychological and behavioural.'
},

'1p-lsd': {
  what: 'A prodrug of LSD with a propionyl group on the indole nitrogen, hydrolysed in the body to LSD itself. Functionally indistinguishable from LSD once converted, and created to sit outside analogue legislation.',
  looks: 'Blotter, in the same form as LSD.',
  reports: 'Reported as essentially identical to LSD, with perhaps a slightly slower onset consistent with the conversion step. Widely used as a legal-at-the-time substitute.',
  harm: 'Identical to LSD, including the lithium interaction. Because it converts to LSD, dose equivalence is close to 1:1 by weight.'
},

'1cp-lsd': {
  what: 'A cyclopropanoyl LSD prodrug, hydrolysed to LSD in the body. Another analogue-law substitute with essentially LSD\'s pharmacology.',
  looks: 'Blotter.',
  reports: 'Reported as LSD-like with a slightly slower onset. Considered by users to be interchangeable with 1P-LSD.',
  harm: 'Treat exactly as LSD.'
},

'al-lad': {
  what: 'An LSD analogue with an allyl group replacing the N6-methyl, roughly comparable in potency to LSD with a somewhat shorter duration.',
  looks: 'Blotter.',
  reports: 'Reported as more visual and less mentally intense than LSD, with less anxiety and a shorter, cleaner ending. A frequent community favourite for that reason.',
  harm: 'Same class cautions as LSD, including lithium. Shorter duration, but still 6 to 9 hours.'
},

psilocybin: {
  what: 'The prodrug alkaloid of psychedelic mushrooms, rapidly dephosphorylated to psilocin, which is the active 5-HT2A agonist. Psilocybin itself does essentially nothing until that conversion happens.',
  looks: 'In mushrooms: dried caps and stems, usually tan to golden brown, often bruising blue where handled — the bluing is oxidised psilocin and is a genuine (if crude) indicator. Also sold as capsules, chocolates and gummies of unknown and often inconsistent content.',
  reports: 'The most consistent reports are the nausea during the come-up, the strong dependence of the experience on set and setting, and the large variation in potency between species, between flushes, and between individual mushrooms in the same bag. Grinding a batch and dosing from the powder is the standard community advice for evening that out.',
  harm: 'Misidentification of wild mushrooms is the main physical danger — several deadly species look broadly similar to novices, and there is no substitute for a reliable identification. Do not combine with lithium or tramadol. Avoid with MAOIs, which greatly potentiate it. The psychological risk is real for anyone with a personal or family history of psychosis or bipolar disorder.'
},

'4-aco-dmt': {
  what: '4-acetoxy-DMT, an acetylated psilocin prodrug that is deacetylated to psilocin in the body. Functionally very close to mushrooms without the mushroom material.',
  looks: 'White to off-white or brownish powder or crystals; also in capsules. Fumarate and HCl salts differ in weight per unit of active.',
  reports: 'Widely reported as mushroom-like but cleaner, with much less nausea — which most people attribute to the absence of the fungal material rather than to the molecule. Duration reported as slightly shorter than mushrooms.',
  harm: 'Fumarate salt weighs more per unit of active than the HCl salt; know which you have. Same lithium and tramadol cautions as other psychedelics. Powder makes accurate low doses easier than mushrooms but also makes large errors easier.'
},

dmt: {
  what: 'N,N-dimethyltryptamine, a short-acting tryptamine psychedelic present in many plants and, at trace levels, in mammals. Orally inactive alone because MAO-A destroys it — which is the entire pharmacological basis of ayahuasca.',
  looks: 'Freebase crystals ranging from white through yellow to orange-red, waxy or crystalline. The colour comes from extraction quality and plant source, not from potency in any reliable way.',
  reports: 'Smoked or vaporised DMT is described with unusual consistency across thousands of reports: a five-to-fifteen minute experience of overwhelming intensity with a very short come-up. The consistency of the phenomenology, and the frequent reports of encountering apparent entities, is one of the more striking things in the whole psychedelic report base.',
  harm: 'Being brief does not make it gentle — people fall, drop pipes and injure themselves. Have someone sober present and be seated or lying down. Orally it requires an MAOI, which brings the full weight of MAOI dietary and drug interactions. Never combine with SSRIs plus an MAOI. Raises blood pressure sharply for a few minutes.'
},

'5-meo-dmt': {
  what: 'A methoxylated tryptamine with a strong preference for 5-HT1A over 5-HT2A, which makes it phenomenologically very different from DMT — less visual and more totalising. Found in Bufo alvarius toad secretion and in several plants.',
  looks: 'White crystals as a synthetic; toad secretion is a brownish waxy material of highly variable content.',
  reports: 'Reported as far more overwhelming and far less visual than DMT, frequently as complete dissolution of self with no imagery at all. Reports of difficult and prolonged psychological aftermath are notably more common than with other psychedelics.',
  harm: 'Dose margins are narrow and the difference between a large and an enormous dose is not visible in advance. Deaths have occurred, generally with other drugs present or in unsupervised settings. Combination with an MAOI, including harmala alkaloids, has caused deaths and must be avoided. Toad secretion is highly variable, and harvesting it is an ecological problem in its own right.'
},

'4-ho-met': {
  what: 'A synthetic psilocin analogue with an ethyl group replacing one methyl, of moderate potency and duration.',
  looks: 'Off-white to brown powder or crystals, sometimes fumarate salt.',
  reports: 'Reported as lighter and more euphoric than psilocin, more visual and less introspective, and generally easier to handle. A common community choice for a first synthetic tryptamine.',
  harm: 'Standard psychedelic cautions: no lithium, no tramadol, care with MAOIs. Salt form affects dose by weight.'
},

'4-ho-mipt': {
  what: 'A psilocin analogue with methyl and isopropyl groups on the nitrogen, notable for being unusually clear-headed for a tryptamine.',
  looks: 'Off-white to tan powder or crystals.',
  reports: 'Widely reported as unusually lucid — strong body high and tactile enhancement with comparatively little cognitive distortion. Frequently described as one of the more controllable psychedelics.',
  harm: 'Standard psychedelic cautions. Body load and nausea reported at higher doses.'
},

mescaline: {
  what: 'The phenethylamine psychedelic of peyote, San Pedro and Peruvian torch cacti, and the first psychedelic to be isolated. Active in the hundreds of milligrams, making it by far the least potent by weight of the classical psychedelics.',
  looks: 'As a synthetic, a white crystalline powder or the sulfate salt. As cactus, dried green material or a bitter, unpleasant brew.',
  reports: 'Reported as long — 10 to 14 hours — with a pronounced physical come-up including nausea and vomiting that most people accept as part of it. Widely described as warmer and more "natural" in character than LSD, with strong colour enhancement.',
  harm: 'Peyote is slow-growing and endangered, and is central to Native American Church practice; San Pedro is neither. Cactus preparations vary enormously in strength. The nausea is intense enough that vomiting is common and dehydration matters on a long experience. Standard psychedelic cautions.'
},

'2c-b': {
  what: 'A phenethylamine psychedelic from Shulgin\'s work, with a distinctly dose-dependent character: entactogenic and light at low doses, fully psychedelic at higher ones. Moderate duration.',
  looks: 'White to off-white powder, pressed tablets, or capsules. Also sold as "nexus" pills. It is quite bulky per dose, which is why blotter is uncommon and should raise suspicion.',
  reports: 'Very widely reported as one of the more manageable psychedelics — visual, euphoric, comparatively short. The dose-response is repeatedly described as sharp: a small increase produces a much larger change. Nasal use is reported as extremely painful.',
  harm: 'The narrow dose window means small measuring errors change the experience substantially. Anything sold as 2C-B on blotter is almost certainly an NBOMe, because 2C-B doses are too large to fit on paper. Insufflation is very painful and offers no advantage.'
},

'2c-e': {
  what: 'A Shulgin phenethylamine, more potent and considerably more intense than 2C-B, with a longer duration and a heavy physical component.',
  looks: 'White powder or crystals.',
  reports: 'Reported consistently as much more serious than 2C-B — deeply visual, mentally demanding, with a notable body load and nausea. Community advice strongly emphasises starting low.',
  harm: 'Steep dose-response and a long duration mean errors are not brief. Body load and vasoconstriction reported. Standard psychedelic cautions; no MAOIs.'
},

doc: {
  what: 'A substituted amphetamine psychedelic of the DOx family, potent by weight and exceptionally long-acting — commonly 16 to 24 hours or more.',
  looks: 'Usually blotter, because doses are small enough to fit. This is one of the few things other than LSD and NBOMes legitimately found on paper.',
  reports: 'The dominant report is duration: people describe expecting an LSD-length experience and getting a day and a half, with sleeplessness afterwards. Strong stimulation and vasoconstriction are consistently reported. Frequently misrepresented as LSD.',
  harm: 'The length is the primary hazard — a difficult experience lasts an entire day. Strong vasoconstriction; the DOx family has caused vasospasm and, rarely, limb ischaemia at high doses. Do not redose; the onset can take three hours and redosing has caused severe overdoses. Never with MAOIs.'
},

'25i-nbome': {
  what: 'An N-benzylmethoxy derivative of 2C-I, roughly an order of magnitude more potent than its parent and a much more efficacious 5-HT2A agonist. Not orally active in any useful way, so it is used sublingually.',
  looks: 'Blotter paper — which is exactly the problem, because it is visually identical to LSD blotter and has been sold as LSD for over a decade.',
  reports: 'Reported as harsh, stimulating, vasoconstrictive and unpleasant compared with LSD, with a distinctive strong bitterness and numbing of the mouth. Deaths from overdose, seizures and hyperthermia are documented and comparatively frequent for a psychedelic.',
  harm: 'This compound kills, which almost no other psychedelic does. It has a genuine overdose risk at doses only a few times the active one. It tastes extremely bitter and numbs the tongue; LSD does not. Ehrlich reagent turns purple with LSD and does nothing with NBOMes — test blotter before use. Vasoconstriction, seizures and hyperthermia are the mechanisms of death.'
},

ibogaine: {
  what: 'An alkaloid of the Tabernanthe iboga root, used ritually in Bwiti practice in Gabon and studied for interrupting opioid dependence. Pharmacologically unlike anything else — NMDA antagonist, kappa agonist, sigma ligand and nicotinic antagonist, with an extremely long-lived active metabolite.',
  looks: 'Root bark (brown, fibrous), total alkaloid extract, or purified hydrochloride.',
  reports: 'Reported as an extended, oneiric, waking-dream state lasting a day or more, followed by days of exhaustion. Reports of substantially reduced opioid withdrawal and craving are consistent and are why underground clinics exist. Reports of deaths in those clinics are also consistent.',
  harm: 'It blocks hERG potassium channels and causes QT prolongation, bradycardia and fatal arrhythmia — deaths are well documented and are usually cardiac. It requires cardiac screening, electrolyte correction and continuous monitoring, which underground providers frequently do not do. It interacts with a very large number of drugs via CYP2D6. Noribogaine persists for days, extending the cardiac risk well past the experience.'
},

'2c-i': {
  what: 'An iodinated Shulgin phenethylamine, more potent than 2C-B and more stimulating, with a longer duration.',
  looks: 'White powder or crystals.',
  reports: 'Reported as more stimulating and less warm than 2C-B, with a longer come-up. Its main significance is as the parent of 25I-NBOMe.',
  harm: 'Standard 2C-x cautions. Never sold legitimately on blotter — that would be an NBOMe.'
},

'2c-p': {
  what: 'One of the most potent and longest-acting of the 2C-x phenethylamines, with a slow onset and a duration of 10 to 16 hours.',
  looks: 'White powder or crystals.',
  reports: 'The recurring report is redosing during the slow onset, which takes up to three hours, and then finding the combined dose far too strong. Community advice is emphatic about waiting.',
  harm: 'The slow onset plus a steep dose-response is a well-documented recipe for overdose. Do not redose. Very long duration; heavy body load.'
},

dom: {
  what: 'A DOx-family substituted amphetamine psychedelic, potent and extremely long-acting, historically distributed as "STP" in doses far too high, causing a wave of hospital admissions.',
  looks: 'Tablets historically; blotter now.',
  reports: 'Reported as 14 to 20 hours or more with heavy stimulation. The 1967 STP episode, in which tablets contained many times a sensible dose, remains the reference story.',
  harm: 'Very long duration and slow onset. Strong vasoconstriction. Do not redose.'
},

dob: {
  what: 'A brominated DOx psychedelic, potent by weight with an exceptionally long duration and pronounced vasoconstriction.',
  looks: 'Blotter, occasionally powder.',
  reports: 'Reported as very long, stimulating and physically demanding. Cases of severe peripheral vasospasm requiring vasodilator treatment are documented at high doses.',
  harm: 'The DOx family constricts blood vessels strongly, and DOB overdoses have caused limb ischaemia and required arterial vasodilators. Do not redose. Extremely long duration.'
},

'25c-nbome': {
  what: 'The chlorinated NBOMe analogue, close relative of 25I-NBOMe with similar potency and the same profile.',
  looks: 'Blotter, indistinguishable from LSD.',
  reports: 'Reported the same way as 25I-NBOMe: harsh, bitter, vasoconstrictive, with a real overdose risk.',
  harm: 'Same as 25I-NBOMe. Bitter and numbing taste; test with Ehrlich reagent. Deaths from seizures and hyperthermia are documented.'
},

'eth-lad': {
  what: 'An LSD analogue with an ethyl group at N6, slightly more potent than LSD and reported as more visual.',
  looks: 'Blotter.',
  reports: 'Reported as more visually intense than LSD with a heavier body load and a slower onset. Community reports consistently note it is stronger by weight than LSD, contrary to early expectations.',
  harm: 'More potent than LSD, so blotter labelled by LSD-equivalent dose can be an overdose. Standard ergoline cautions including lithium.'
},

'5-meo-mipt': {
  what: 'A methoxylated tryptamine, notably tactile and sensual with comparatively mild visual effects.',
  looks: 'Off-white to tan powder.',
  reports: 'Consistently reported as strongly tactile and physically pleasurable with modest visuals, which is unusual and makes it something of a category of its own. Nausea in the come-up is commonly reported.',
  harm: 'Standard psychedelic and tryptamine cautions; no MAOIs.'
},

dpt: {
  what: 'A tryptamine psychedelic with a fast, abrupt onset and moderate duration, historically used in psychedelic-assisted therapy research and by the Temple of the True Inner Light as a sacrament.',
  looks: 'Off-white powder or crystals; often insufflated or used rectally because it is poorly orally active.',
  reports: 'Reported as coming on very abruptly with little warning, and as having an unusually auditory character compared with other psychedelics. Insufflation is reported as extremely painful.',
  harm: 'The abrupt onset gives no time to adjust and is a common source of panic. Standard psychedelic cautions.'
},

'4-ho-dipt': {
  what: 'A psilocin analogue with two isopropyl groups, notably short-acting — commonly two to three hours.',
  looks: 'Off-white powder.',
  reports: 'Reported as fast and short, with a stimulating, somewhat frantic character that some people find hard to settle into.',
  harm: 'Short duration invites redosing. Standard tryptamine cautions.'
},

'4-aco-met': {
  what: 'An acetylated prodrug of 4-HO-MET, converting to the same active compound.',
  looks: 'Off-white to brown powder or crystals; fumarate and HCl salts differ in weight.',
  reports: 'Reported as 4-HO-MET-like — light, euphoric, visual — with a slightly slower onset from the conversion step.',
  harm: 'Salt form affects dose by weight. Standard tryptamine cautions.'
},

'1v-lsd': {
  what: 'A valeroyl LSD prodrug ("Valerie"), hydrolysed to LSD, developed specifically to sit outside the German NpSG after 1P-LSD and 1cP-LSD were controlled.',
  looks: 'Blotter.',
  reports: 'Reported as LSD-like with a somewhat slower onset consistent with the larger acyl group.',
  harm: 'Treat as LSD; the potency per unit weight is slightly lower because of the heavier group.'
},

mipla: {
  what: 'An LSD analogue with methyl and isopropyl amide groups rather than two ethyls, somewhat less potent than LSD and reported as gentler.',
  looks: 'Blotter.',
  reports: 'Reported as a softer, less mentally demanding LSD with fewer visuals — a common description is "LSD-lite".',
  harm: 'Standard ergoline cautions including lithium. Less potent than LSD by weight, so dose accordingly.'
},

'4-aco-dipt': {
  what: 'An acetylated prodrug of 4-HO-DiPT, short-acting like its parent.',
  looks: 'Off-white powder.',
  reports: 'Reported as short and stimulating, like 4-HO-DiPT with a slightly slower start.',
  harm: 'Short duration invites redosing. Standard tryptamine cautions.'
},

'2c-t-2': {
  what: 'A sulfur-containing Shulgin phenethylamine, more intense and longer than 2C-B with a significant body load. Partly metabolised by MAO, which makes MAOI combination specifically dangerous.',
  looks: 'White to off-white powder.',
  reports: 'Reported as heavily visual with pronounced nausea and body load. Deaths have occurred in combination with MAOIs.',
  harm: 'The 2C-T family is metabolised by MAO-B, and combining these with an MAOI has killed people — this is a specific, documented hazard rather than a general caution. Strong body load and nausea.'
},

'2c-c': {
  what: 'A chlorinated Shulgin phenethylamine, generally reported as one of the gentler and more sedating members of the family.',
  looks: 'White powder or crystals.',
  reports: 'Reported as milder and more relaxing than 2C-B, with less stimulation and a shorter duration.',
  harm: 'Standard 2C-x cautions; no MAOIs.'
},

doi: {
  what: 'An iodinated DOx psychedelic, widely used as a radioligand in 5-HT2A research and, recreationally, extremely long-acting.',
  looks: 'Blotter.',
  reports: 'Reported as 20 to 30 hours, among the longest of any common psychedelic, with strong stimulation.',
  harm: 'Duration is the main hazard — an unwanted experience occupies more than a day. Strong vasoconstriction. Do not redose.'
},

'5-meo-dipt': {
  what: 'A methoxylated tryptamine known as "foxy", with a strongly tactile and sensual character and moderate visual effects.',
  looks: 'Off-white to tan powder, sometimes capsules.',
  reports: 'Reported as tactile and euphoric with unpredictable nausea and diarrhoea, which is a very consistent complaint. Reports of erratic effects between people are more common than for most tryptamines.',
  harm: 'Notably variable between individuals. Gastrointestinal side effects are common. Standard tryptamine cautions.'
},

'4-ho-ept': {
  what: 'A psilocin analogue with ethyl and propyl groups on the nitrogen, of moderate potency and duration.',
  looks: 'Off-white powder or fumarate crystals.',
  reports: 'Reported as gentle and euphoric with moderate visuals, similar in character to 4-HO-MET.',
  harm: 'Standard tryptamine cautions; salt form affects dose by weight.'
},

lsz: {
  what: 'An LSD analogue with the diethylamide replaced by an azetidine ring, of comparable potency to LSD. Sold as a specific stereoisomer, which matters because activity differs sharply between them.',
  looks: 'Blotter.',
  reports: 'Reported as LSD-like with a somewhat more forceful, less rambling character and a slightly shorter duration.',
  harm: 'Standard ergoline cautions including lithium.'
},

'pro-lad': {
  what: 'An LSD analogue with a propyl group at N6, of comparable potency to LSD with a somewhat shorter duration.',
  looks: 'Blotter.',
  reports: 'Reported as LSD-like and shorter, with a faster onset.',
  harm: 'Standard ergoline cautions.'
},

'2c-t-7': {
  what: 'A sulfur-containing Shulgin phenethylamine of long duration and considerable intensity. Associated with several deaths in the early 2000s, particularly by insufflation and in combination with MAOIs.',
  looks: 'White to off-white powder.',
  reports: 'Reported as deeply visual and long, with heavy body load. The deaths — most involving insufflation of large amounts or MAOI combination — are a standing warning in the community.',
  harm: 'Do not insufflate; the fatal cases disproportionately involved that route. MAO-B metabolism means MAOI combination is specifically dangerous and has been fatal. Long duration, steep dose-response.'
},

'2c-d': {
  what: 'A Shulgin phenethylamine notable for being mild and short at low doses, and used by some as a "museum dose" psychedelic.',
  looks: 'White powder.',
  reports: 'Reported as gentle and cognitively clear at low doses, becoming a full psychedelic at higher ones.',
  harm: 'Standard 2C-x cautions; no MAOIs.'
},

allylescaline: {
  what: 'A mescaline analogue with an allyl group at the 4-position, roughly ten times more potent than mescaline with a similar character and duration.',
  looks: 'White to off-white powder or crystals.',
  reports: 'Reported as mescaline-like — warm, visual, colourful — at a fraction of the dose, with less nausea because the quantity is so much smaller.',
  harm: 'Standard phenethylamine psychedelic cautions; no MAOIs. Long duration, 8 to 12 hours.'
},

'4-ho-mpt': {
  what: 'A psilocin analogue with methyl and propyl groups on the nitrogen.',
  looks: 'Off-white powder or fumarate.',
  reports: 'Sparse; reported as similar to 4-HO-MET with a slightly longer duration.',
  harm: 'Standard tryptamine cautions.'
},

'5-meo-malt': {
  what: 'A methoxylated tryptamine with methyl and allyl groups, notably potent for its family and long-acting.',
  looks: 'Off-white powder.',
  reports: 'Sparse; reported as potent, long, and physically heavy, with strong effects at low doses.',
  harm: 'Poorly characterised, potent by weight, and long. 5-MeO tryptamines vary sharply in potency; do not extrapolate from a relative.'
},

escaline: {
  what: 'A mescaline analogue with an ethoxy group at the 4-position, roughly three to four times more potent than mescaline.',
  looks: 'White to off-white powder or crystals.',
  reports: 'Reported as mescaline-like with a cleaner, more stimulating character and less nausea.',
  harm: 'Standard phenethylamine cautions; long duration; no MAOIs.'
},

proscaline: {
  what: 'A mescaline analogue with a propoxy group at the 4-position, several times more potent than mescaline.',
  looks: 'White to off-white powder.',
  reports: 'Reported as visual and euphoric with a shorter duration than mescaline and less body load.',
  harm: 'Standard phenethylamine cautions; no MAOIs.'
},

'3c-e': {
  what: 'A 3-carbon-chain homologue bridging the mescaline and DOx families, potent and very long-acting.',
  looks: 'White powder.',
  reports: 'Sparse; reported as very long — approaching DOx durations — and intense.',
  harm: 'Poorly characterised, potent, and extremely long. Do not redose during the slow onset.'
},

'tma-2': {
  what: 'A trimethoxyamphetamine, the amphetamine homologue of the mescaline series, considerably more potent than mescaline.',
  looks: 'White powder.',
  reports: 'Reported as long and somewhat harsh, with a stimulant edge.',
  harm: 'Standard substituted-amphetamine psychedelic cautions. Long duration and vasoconstriction.'
},

'25i-nboh': {
  what: 'An N-hydroxybenzyl analogue of 2C-I, related to the NBOMes but with a hydroxyl in place of the methoxy, somewhat less potent and reported as less harsh.',
  looks: 'Blotter — with the same identification problem as the NBOMes.',
  reports: 'Reported as NBOMe-like but with less of the harsh stimulation. Sold on blotter, so mistaken for LSD.',
  harm: 'Shares the NBOMe family risk profile: seizures, hyperthermia and vasoconstriction, with a real overdose risk. Ehrlich reagent does not react with it, unlike LSD.'
},

lsa: {
  what: 'Lysergic acid amide (ergine), the principal psychoactive alkaloid of morning glory and Hawaiian baby woodrose seeds. Structurally close to LSD but far less potent and quite different in character.',
  looks: 'Not sold as an isolate in practice; consumed as seeds — small black morning glory seeds, or larger brown fuzzy woodrose seeds.',
  reports: 'Reported as heavily sedating and dreamlike rather than psychedelic in the LSD sense, with severe nausea and vomiting that is the near-universal complaint. Commercial morning glory seeds are frequently coated with fungicides, which makes the nausea much worse.',
  harm: 'Commercial seeds are often treated with fungicides and other pesticides that are themselves toxic — this is a real and frequently overlooked hazard. The ergot alkaloids are vasoconstrictive, so avoid entirely in anyone with vascular disease. Severe nausea is expected rather than exceptional.'
},

psilocin: {
  what: 'The active metabolite of psilocybin and the compound actually responsible for the effects of psychedelic mushrooms. A 5-HT2A agonist, less stable than psilocybin, oxidising readily — which is what makes bruised mushrooms turn blue.',
  looks: 'Rarely encountered as an isolate because it is unstable; present in fresh mushrooms alongside psilocybin.',
  reports: 'Not usually distinguished from mushrooms in report terms.',
  harm: 'Standard psychedelic cautions. Its instability is why mushroom potency declines with poor storage.'
},

noribogaine: {
  what: 'The long-lived active metabolite of ibogaine, formed by CYP2D6 demethylation, with a half-life measured in days. It is thought to carry much of ibogaine\'s anti-addictive effect and its extended cardiac risk.',
  looks: 'Not sold; formed after ibogaine.',
  reports: 'Reported indirectly, as the days-long altered state and insomnia that follow an ibogaine session.',
  harm: 'Its long persistence is why cardiac monitoring after ibogaine needs to continue for days rather than hours. CYP2D6 poor metabolisers form less of it and clear ibogaine far more slowly, which changes the risk profile substantially.'
},

bufotenine: {
  what: '5-hydroxy-DMT, a tryptamine found in Anadenanthera seeds, some toads and various plants. Its psychoactivity in humans has been debated for decades because it crosses the blood-brain barrier poorly and produces marked peripheral cardiovascular effects first.',
  looks: 'Present in yopo and cebil snuffs; rarely isolated.',
  reports: 'Reports are inconsistent and often dominated by unpleasant peripheral effects — facial flushing, chest tightness, nausea — rather than psychedelic ones.',
  harm: 'Marked cardiovascular effects including hypertension at doses that produce little central effect. This is a poor risk-to-effect ratio and it is why it has never established recreational use.'
},

salvia: {
  what: 'Salvinorin A, the active diterpene of Salvia divinorum and the most potent naturally occurring hallucinogen known. It is a selective kappa-opioid agonist — mechanistically unrelated to every other psychedelic, and not serotonergic at all.',
  looks: 'Dried green leaf, or leaf fortified with extracted salvinorin and sold at multiples ("5x", "20x") that are not standardised between vendors.',
  reports: 'Smoked salvia is reported with unusual consistency as brief (5 to 15 minutes), extremely disorienting, and frequently unpleasant — loss of body awareness, perceived transformation into objects, and complete detachment from the room. Very few people report wanting to repeat it. Chewed leaf is much milder and slower.',
  harm: 'People lose all awareness of their surroundings and physical position while remaining mobile — a sitter and a safe space are essential, and injuries from falling or walking into things are the main documented harm. Extract strengths are not comparable between vendors. Do not use standing, near heat, or alone.'
},

/* ================= Dissociatives ================= */

ketamine: {
  what: 'An NMDA receptor antagonist used as a dissociative anaesthetic since the 1960s, and now as a rapid-acting antidepressant. It preserves airway reflexes and cardiovascular tone in a way no other anaesthetic does, which is why it is used in field medicine.',
  looks: 'Pharmaceutically a clear solution in vials. Illicitly, a white crystalline powder made by evaporating that solution, often with visible shards.',
  reports: 'The dominant long-term report is urinary: ketamine-induced cystitis causes severe bladder pain, urgency and, in heavy users, irreversible bladder contraction requiring surgery. This is very widely reported by frequent users and is dose- and frequency-dependent. The "k-hole" — complete dissociation at higher doses — is reported as either profound or terrifying with little middle ground.',
  harm: 'Bladder damage is the signature harm of frequent use and can be permanent; frequency matters more than dose. Vomiting while dissociated is a real aspiration risk — never use lying on your back and never alone. It raises blood pressure. Combining with other depressants removes the respiratory safety margin that makes ketamine unusual. Tolerance builds fast with frequent use.'
},

esketamine: {
  what: 'The S-enantiomer of ketamine, roughly twice as potent as the racemate at NMDA, approved as a nasal spray for treatment-resistant depression under supervised administration.',
  looks: 'Nasal spray devices, administered in a clinic.',
  reports: 'Reported clinically as producing dissociation for an hour or two after dosing, which is why supervision is required. Antidepressant reports are frequently rapid but often not durable without repeat dosing.',
  harm: 'Requires post-dose observation for sedation and dissociation and no driving that day. Same bladder concerns as ketamine with repeated use. Raises blood pressure.'
},

dxm: {
  what: 'Dextromethorphan, a cough suppressant that is an NMDA antagonist and a serotonin reuptake inhibitor. Its dissociative activity comes largely from dextrorphan, its CYP2D6 metabolite, so genotype changes the experience substantially.',
  looks: 'Cough syrups and gel capsules. The critical issue is what else is in the product — paracetamol, antihistamines and pseudoephedrine in combination products are dangerous at DXM recreational doses.',
  reports: 'Reported in distinct dose "plateaus" with quite different characters, which is a genuinely unusual dose-response. Nausea is near-universal. CYP2D6 poor metabolisers report much longer and stronger effects from the same dose.',
  harm: 'Combination products are the main killer: paracetamol at DXM recreational doses causes fatal liver injury, and chlorphenamine or promethazine adds anticholinergic and sedative toxicity. Use only single-ingredient products, or none. DXM is a serotonin reuptake inhibitor and MAOI combination has been fatal; SSRIs add serotonin syndrome risk and also inhibit CYP2D6, raising DXM levels. Bromide toxicity from the hydrobromide salt occurs with very heavy use.'
},

'3-meo-pcp': {
  what: 'A methoxylated PCP analogue and a potent NMDA antagonist, considerably more potent than ketamine with a much longer duration and additional dopamine and serotonin reuptake inhibition.',
  looks: 'White powder or crystals.',
  reports: 'Reported as far more stimulating and far longer than ketamine, with a strong tendency toward mania and psychosis on redosing. Community reports of multi-day psychotic episodes are common enough to be a standing warning.',
  harm: 'The long duration and slow onset lead people to redose, and the compulsive redosing pattern with this compound is associated with psychosis, agitation and hospital admission. Doses are in milligrams with a narrow window. Numerous deaths reported, often with other drugs.'
},

mxe: {
  what: 'Methoxetamine, a ketamine analogue designed to lack the bladder toxicity, which it did not. Longer-acting than ketamine with an unusually delayed onset and added serotonin reuptake inhibition.',
  looks: 'White or off-white powder; was widely sold before scheduling.',
  reports: 'The delayed onset — up to 90 minutes orally — is the most consistent report and the most consistent cause of overdose, because people redosed. Reported as more "emotional" and less anaesthetic than ketamine. Bladder problems were reported despite the design intent.',
  harm: 'Delayed onset causes redose overdoses. Serotonergic activity means MAOI combination is dangerous. Associated with a substantial number of deaths in the period it was widely available. Cerebellar toxicity and prolonged ataxia have been reported.'
},

pcp: {
  what: 'Phencyclidine, the original dissociative anaesthetic, abandoned clinically because of severe emergence reactions. A potent NMDA antagonist with significant dopaminergic and sigma activity.',
  looks: 'White powder, liquid, or plant material soaked in a solution ("wet", "sherm"). Frequently sold as or mixed into other drugs.',
  reports: 'Reported with far more agitation, aggression and prolonged psychosis than ketamine, which is consistent with its dopaminergic activity. Long duration and prolonged confusion are consistently reported.',
  harm: 'Agitated delirium with hyperthermia and rhabdomyolysis is the characteristic emergency presentation. Long duration and slow, erratic elimination — it redistributes from fat and can produce recurring effects for days. Frequently present in other drugs without being disclosed.'
},

nitrous: {
  what: 'Nitrous oxide, an NMDA antagonist and anaesthetic gas with additional opioid-mediated analgesia. Extremely short-acting — the effect is essentially over within a minute of stopping.',
  looks: 'Steel chargers ("whippits"), large catering cylinders, and medical gas. Balloons are the standard delivery method.',
  reports: 'The dominant harm report is neurological: nitrous inactivates vitamin B12, and heavy or regular use causes subacute combined degeneration of the spinal cord — numbness, tingling, unsteady walking, and sometimes permanent damage. Case numbers have risen sharply with the availability of large cylinders, and community awareness of B12 has grown accordingly.',
  harm: 'Never inhale directly from a cylinder or charger — the gas is intensely cold and causes frostbite of the airway, and the pressure can rupture lung tissue. Use a balloon. Never in an enclosed space or with a mask or bag over the face; the deaths are almost all asphyxiation, not the drug. Sit down. Regular users should supplement B12, but supplementation does not make heavy use safe. Neurological symptoms warrant stopping immediately and seeing a doctor.'
},

memantine: {
  what: 'A low-affinity, fast-off NMDA antagonist used for Alzheimer\'s disease. The fast off-rate is why it can block excitotoxic signalling without producing the dissociation of ketamine at therapeutic doses.',
  looks: 'Tablets and oral solution.',
  reports: 'Reported at recreational doses as extremely long — a day or more — with a slow, murky onset over hours, and as producing a state most people describe as unpleasant and cognitively impairing rather than euphoric. Frequently discussed as a ketamine tolerance-reducer, with mixed evidence.',
  harm: 'Half-life of 60 to 100 hours, so it accumulates dramatically with repeated dosing and impairment builds over days. Renally cleared and strongly affected by urinary pH — alkaline urine can raise levels sharply. Extremely long duration makes any error a multi-day problem.'
},

'3-ho-pcp': {
  what: 'A hydroxylated PCP analogue that is both a potent NMDA antagonist and a mu-opioid agonist — an unusual and dangerous combination in one molecule.',
  looks: 'White powder.',
  reports: 'Reported as strongly sedating and opioid-like alongside the dissociation, with strong compulsion to redose.',
  harm: 'Its mu-opioid activity means it can depress respiration like an opioid, unlike other dissociatives — and naloxone would address only that half. Combining with any opioid or depressant is correspondingly dangerous. Poorly characterised, potent, and compulsive.'
},

'4-meo-pcp': {
  what: 'A methoxylated PCP analogue, less potent than PCP or 3-MeO-PCP and reported as milder.',
  looks: 'White powder or crystals.',
  reports: 'Reported as gentler and more manageable than 3-MeO-PCP, with less of the stimulation and mania.',
  harm: 'Uncharacterised in humans. Long duration; standard arylcyclohexylamine cautions.'
},

'o-pce': {
  what: 'Eticyclidone (2-oxo-PCE), a potent arylcyclohexylamine NMDA antagonist related to both ketamine and PCE.',
  looks: 'White powder or crystals.',
  reports: 'Reported as considerably more potent by weight than ketamine, with a stimulating character and a strong redose compulsion.',
  harm: 'High potency by weight makes misweighing dangerous. Redose compulsion and long duration reported. Uncharacterised in humans.'
},

diphenidine: {
  what: 'A diarylethylamine NMDA antagonist, structurally unrelated to the arylcyclohexylamines but functionally similar.',
  looks: 'White powder.',
  reports: 'Reported as long-acting with a heavy, stumbling physical quality and marked ataxia. Less euphoric than ketamine.',
  harm: 'Pronounced ataxia makes falls likely. Uncharacterised in humans; associated with deaths in Japan and the UK during the period it was widely sold.'
},

dck: {
  what: 'Deschloroketamine, a ketamine analogue lacking the chlorine, substantially more potent and much longer-acting than ketamine.',
  looks: 'White crystals or powder.',
  reports: 'Reported as several times more potent than ketamine with a duration of many hours, and with a strong redose compulsion. Reports of prolonged dissociation lasting into the next day are common.',
  harm: 'Much longer than ketamine, so ketamine-based dosing intuitions overshoot badly. Compulsive redosing reported. Bladder toxicity should be assumed by analogy. Deaths reported.'
},

'2-fdck': {
  what: '2-fluorodeschloroketamine, a fluorinated ketamine analogue of broadly ketamine-like potency and somewhat longer duration.',
  looks: 'White crystals or powder.',
  reports: 'Reported as very close to ketamine in character, slightly longer, and widely used as a ketamine substitute.',
  harm: 'Uncharacterised in humans; assume ketamine\'s bladder toxicity applies. Aspiration risk while dissociated is the same.'
},

dmxe: {
  what: 'Deoxymethoxetamine, an MXE analogue lacking the ketone oxygen, appearing after MXE was controlled.',
  looks: 'White powder or crystals.',
  reports: 'Reported as MXE-like — long, emotional, less anaesthetic than ketamine — and popular as an MXE substitute.',
  harm: 'Uncharacterised. MXE\'s delayed-onset redosing hazard should be assumed to apply.'
},

'3-meo-pce': {
  what: 'A methoxylated PCE analogue, a potent NMDA antagonist with stimulating character.',
  looks: 'White powder.',
  reports: 'Reported as potent and stimulating with a strong mania and psychosis risk on redosing, similar to 3-MeO-PCP.',
  harm: 'Poorly characterised, potent by weight, with a documented pattern of psychosis on repeated dosing.'
},

ephenidine: {
  what: 'A diarylethylamine NMDA antagonist related to diphenidine.',
  looks: 'White powder or waxy solid.',
  reports: 'Reported as more euphoric and less ataxic than diphenidine, with a moderate duration.',
  harm: 'Uncharacterised in humans. Standard dissociative cautions.'
},

mxipr: {
  what: 'An MXE analogue with an isopropylamine group, appearing in the research-chemical market as a longer-acting ketamine substitute.',
  looks: 'White powder or crystals.',
  reports: 'Reported as long and MXE-like.',
  harm: 'Uncharacterised. Assume the MXE delayed-onset redosing hazard.'
},

'3-meo-pcmo': {
  what: 'A morpholine-containing PCP analogue, reported as considerably less potent than 3-MeO-PCP.',
  looks: 'White powder.',
  reports: 'Very sparse; reported as weak and long.',
  harm: 'Uncharacterised. Low potency invites large doses of an unstudied compound.'
},

pcpr: {
  what: 'A PCP analogue with a propyl group, of broadly PCP-like activity.',
  looks: 'White powder.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised. Assume PCP-like agitation and duration.'
},

mxpr: {
  what: 'An MXE analogue with a propylamine group.',
  looks: 'White powder.',
  reports: 'Very sparse.',
  harm: 'Uncharacterised; assume MXE-like duration and the associated redosing hazard.'
},

tiletamine: {
  what: 'A veterinary dissociative anaesthetic, used in combination with zolazepam as Telazol/Zoletil. More potent and longer-acting than ketamine.',
  looks: 'Veterinary vials, always combined with a benzodiazepine.',
  reports: 'Reported as much longer and less controllable than ketamine, with unpleasant emergence. The zolazepam component adds a benzodiazepine to every dose.',
  harm: 'The combination product means taking a benzodiazepine at the same time, whether or not that is intended. Long duration and deep dissociation with aspiration risk.'
},

mxp: {
  what: 'Methoxphenidine, a diarylethylamine NMDA antagonist related to diphenidine with a methoxy substitution.',
  looks: 'White powder.',
  reports: 'Reported as long-acting with heavy ataxia and a delayed onset.',
  harm: 'Delayed onset invites redosing. Associated with deaths during the period it was widely sold. Uncharacterised.'
},

fluorolintane: {
  what: 'A fluorinated diarylethylamine NMDA antagonist of the diphenidine family.',
  looks: 'White powder.',
  reports: 'Essentially none.',
  harm: 'Entirely uncharacterised in humans.'
},

gacyclidine: {
  what: 'A PCP analogue investigated for neuroprotection after spinal cord injury and nerve-agent exposure, notably more potent than PCP.',
  looks: 'Rarely encountered; research compound.',
  reports: 'Almost none.',
  harm: 'Very potent and essentially uncharacterised recreationally.'
},

dextrorphan: {
  what: 'The CYP2D6 metabolite of dextromethorphan and the compound responsible for most of DXM\'s dissociative effect. A more potent NMDA antagonist than its parent.',
  looks: 'Not sold; formed after DXM.',
  reports: 'Reported indirectly through the wide variation in DXM response between people, which tracks CYP2D6 genotype.',
  harm: 'CYP2D6 inhibitors — fluoxetine, paroxetine, bupropion, quinidine — reduce its formation and leave more parent DXM circulating, changing both the effect and the serotonergic risk.'
},

norketamine: {
  what: 'The principal metabolite of ketamine, an NMDA antagonist in its own right at roughly a third of ketamine\'s potency, and longer-lived. It contributes substantially to the tail of a ketamine dose, especially orally where first-pass metabolism produces a lot of it.',
  looks: 'Not sold; formed after ketamine.',
  reports: 'Reported indirectly as the reason oral ketamine feels different from insufflated or injected — the oral route produces far more norketamine relative to parent drug.',
  harm: 'Its longer half-life extends impairment past what the parent drug would suggest.'
},

/* ================= Entactogens ================= */

mdma: {
  what: 'A substituted amphetamine that acts primarily as a serotonin releasing agent, with substantial dopamine and noradrenaline release as well, plus direct oxytocin release. The serotonergic dominance is what makes it entactogenic rather than simply stimulating.',
  looks: 'Crystals ranging from white through beige to brown or grey, and pressed tablets in every colour and shape imaginable. Press artwork means nothing about content or dose; tablets today frequently contain 150–250 mg, far above a sensible dose.',
  reports: 'The most consistent themes: the following-days depression ("suicide Tuesday"), which is a real serotonergic rebound; the strong relationship between frequency of use and lasting loss of the effect ("magic"); and jaw clenching and next-day fatigue. Community consensus on spacing — at least three months between uses — is one of the most widely agreed harm-reduction positions anywhere.',
  harm: 'Hyperthermia is the main mechanism of death, worsened by dancing in hot rooms; take breaks and stay cool. Drink to thirst, not on a schedule — hyponatraemia from drinking too much water has killed people and MDMA itself causes water retention through vasopressin release. Never combine with MAOIs, and be careful with any serotonergic including SSRIs, tramadol and 5-HTP. Test every tablet and crystal; PMA and PMMA have killed people sold as MDMA and act far more slowly, which causes redosing. Space uses by months, not weeks.'
},

mda: {
  what: 'The N-demethylated relative of MDMA, and also one of its metabolites. More psychedelic and less purely entactogenic than MDMA, with a longer duration and greater serotonergic neurotoxicity in animal models.',
  looks: 'Crystals or powder, often sold as MDMA or as "sass".',
  reports: 'Reported as more visual and longer than MDMA with less of the emotional warmth, and with a harsher comedown. Frequently sold as MDMA without disclosure.',
  harm: 'Longer and more neurotoxic in animal studies than MDMA. Same hyperthermia, hyponatraemia and MAOI cautions.'
},

methylone: {
  what: 'The beta-keto analogue of MDMA — bk-MDMA — a serotonin and dopamine releasing agent with a shorter duration and less serotonergic dominance than MDMA.',
  looks: 'White or off-white crystals; was a common "molly" substitute.',
  reports: 'Reported as less emotionally warm and more stimulating than MDMA, with a shorter duration that prompts redosing. Widely sold as MDMA.',
  harm: 'Shorter duration drives redosing and correspondingly high total doses. Same hyperthermia and serotonergic cautions as MDMA.'
},

eutylone: {
  what: 'A synthetic cathinone entactogen-stimulant that became extremely common in the illicit supply, frequently sold as MDMA. Less serotonergic and more stimulant than it is usually represented as being.',
  looks: 'White to off-white crystals, visually very similar to MDMA crystal.',
  reports: 'The dominant report is disappointment plus insomnia: people expecting MDMA get a stimulant with little warmth, redose repeatedly chasing the effect, and then cannot sleep for a day or more. Widely regarded as one of the most common MDMA substitutes.',
  harm: 'Repeated redosing when sold as MDMA leads to very large total doses, prolonged insomnia and stimulant psychosis. Reagent testing distinguishes it from MDMA. Cathinone cardiac cautions apply.'
},

'5-apb': {
  what: 'A benzofuran entactogen, ring-expanded relative of MDA, acting as a serotonin, dopamine and noradrenaline releasing agent with substantial 5-HT2B agonism.',
  looks: 'Off-white to brown powder or pellets; was sold as "benzo fury".',
  reports: 'Reported as longer than MDMA with a slower onset and a heavier body load. Associated with deaths in the UK during the period it was openly sold.',
  harm: '5-HT2B agonism is the mechanism behind fenfluramine\'s valvular heart disease, and these compounds share it — repeated use carries a theoretical but serious cardiac valve risk. Long duration; slow onset invites redosing. Same hyperthermia and serotonergic cautions as MDMA.'
},

'6-apb': {
  what: 'A benzofuran entactogen, the positional isomer of 5-APB, with similar activity including 5-HT2B agonism.',
  looks: 'Off-white to brown powder or pellets.',
  reports: 'Reported as MDMA-like but noticeably longer — 8 to 12 hours — with a heavy comedown and marked insomnia.',
  harm: 'Same 5-HT2B valvular concern as 5-APB. Long duration; slow onset invites redosing.'
},

'6-apdb': {
  what: 'A dihydrobenzofuran entactogen related to 6-APB, reported as somewhat gentler and more MDA-like.',
  looks: 'Off-white powder.',
  reports: 'Reported as smoother and more entactogenic than 6-APB with a long duration.',
  harm: 'Assume the same 5-HT2B concerns as the benzofuran family. Long duration.'
},

'5-mapb': {
  what: 'The N-methylated benzofuran entactogen corresponding to 5-APB, closer in character to MDMA.',
  looks: 'Off-white powder or pellets.',
  reports: 'Reported as the most MDMA-like of the benzofurans, with a somewhat longer duration.',
  harm: 'Same 5-HT2B concerns as the benzofuran family. Standard entactogen cautions.'
},

mdai: {
  what: 'An aminoindane entactogen that releases serotonin with much less dopamine release than MDMA, and which in animal studies is markedly less neurotoxic to serotonin terminals.',
  looks: 'White to off-white powder or crystals.',
  reports: 'Reported as entactogenic but flat and much less euphoric than MDMA, which is consistent with the missing dopamine component. Community reports are generally lukewarm.',
  harm: 'Less dopaminergic reward does not make it safe — hyperthermia and serotonergic interaction cautions still apply, and it has been implicated in deaths. Uncharacterised in humans.'
},

butylone: {
  what: 'The beta-keto analogue of MBDB, a synthetic cathinone entactogen with a mixed serotonergic and dopaminergic profile.',
  looks: 'White to off-white crystals or powder.',
  reports: 'Reported as MDMA-like but weaker and more stimulant, with a shorter duration.',
  harm: 'Uncharacterised. Frequently sold as MDMA. Standard cathinone and entactogen cautions.'
},

pentylone: {
  what: 'A synthetic cathinone that is substantially more stimulant than entactogen, and a common MDMA adulterant.',
  looks: 'White to off-white crystals, visually similar to MDMA.',
  reports: 'Reported almost entirely in the context of being sold as MDMA: stimulation without warmth, followed by many hours of insomnia and an unpleasant comedown.',
  harm: 'Long-lasting insomnia and agitation when taken at MDMA doses. Reagent testing distinguishes it. Standard cathinone cardiac cautions.'
},

dimethylpentylone: {
  what: 'A synthetic cathinone (also called bk-DMBDB) that became one of the most common MDMA substitutes in the North American supply from around 2022.',
  looks: 'White to off-white crystals, very similar in appearance to MDMA crystal.',
  reports: 'Reported the same way as eutylone: expected MDMA, got a stimulant, redosed, then could not sleep. Now among the most frequently detected substances in samples sold as MDMA.',
  harm: 'Assume anything sold as MDMA crystal may be this; reagent test. Prolonged insomnia and agitation follow MDMA-sized doses. Uncharacterised in humans.'
},

/* ================= Cannabinoids ================= */

thc: {
  what: 'Delta-9-tetrahydrocannabinol, the principal psychoactive constituent of cannabis and a partial agonist at CB1 and CB2 receptors. Partial agonism at CB1 is the key fact: it is why cannabis has no lethal dose and why the synthetic full agonists, which are not partial, do.',
  looks: 'As plant material: dried flower, from pale green to dark, with visible trichomes. As concentrate: shatter, wax, rosin, distillate — amber to golden. As edibles: anything at all, which is the problem.',
  reports: 'The most consistent modern report is that potency has changed the drug: flower at 20–30% THC and concentrates above 70% produce experiences that people who used 1990s cannabis do not recognise. Edibles are the dominant source of bad experiences, because of the one-to-two-hour onset and because people redose. Cannabinoid hyperemesis syndrome — cyclical vomiting relieved by hot showers — is now very widely reported among daily users and is real.',
  harm: 'Edibles take up to two hours to come on; do not redose inside that window, which is where nearly all cannabis emergency visits come from. Oral THC is converted to 11-hydroxy-THC, which is more potent centrally — this is why edibles feel different, not just delayed. Regular heavy use in adolescence is associated with increased psychosis risk, most strongly in people with family history. Cannabinoid hyperemesis resolves only with stopping. It is a CYP inhibitor and raises levels of some other drugs.'
},

cbd: {
  what: 'Cannabidiol, a non-intoxicating cannabis constituent with a complex and still poorly resolved mechanism — it is not a CB1 agonist and its effects are mediated through several other targets. Approved as a genuine anticonvulsant for specific epilepsy syndromes at doses far above what supplements contain.',
  looks: 'Oils, tinctures, isolate powder, and high-CBD flower. Product labelling is notoriously unreliable; independent testing repeatedly finds actual content far from the claim.',
  reports: 'Reported very inconsistently, which is unsurprising given that most consumer products contain a small fraction of the doses used in trials. Reports of anxiety reduction are common; reports of nothing at all are equally common.',
  harm: 'It is a potent inhibitor of CYP3A4, CYP2C19 and CYP2C9 at meaningful doses, and it raises levels of clobazam, warfarin, and many others — this is a real interaction, not a theoretical one. High doses cause liver enzyme elevation. Consumer products vary wildly from their labels and some contain detectable THC.'
},

'delta-8-thc': {
  what: 'A THC isomer with the double bond in a different ring position, roughly half to two-thirds as potent as delta-9. It occurs naturally only in traces, so essentially all of it is made by acid-catalysed conversion from CBD.',
  looks: 'Vape carts, gummies and distillate, sold openly in jurisdictions where delta-9 is not.',
  reports: 'Reported as milder and less anxiogenic than delta-9. The persistent concern in the community is not the molecule but the synthesis: the acid conversion leaves residual reagents and produces isomers and by-products that are neither identified nor tested for in most products.',
  harm: 'The manufacturing route is the problem. Products are frequently made without purification and contain residual acids, solvents and uncharacterised isomers. Third-party test results, where they exist at all, often do not test for these. Doses in gummies are frequently far above what the label says.'
},

hhc: {
  what: 'Hexahydrocannabinol, a hydrogenated THC analogue produced from CBD or THC. Sold as a legal cannabinoid. It is made as a mixture of two epimers, only one of which (9R) is meaningfully active, and the ratio is not controlled.',
  looks: 'Vape carts, gummies, and sprayed onto hemp flower.',
  reports: 'Reported as THC-like with a somewhat different character. The epimer-ratio problem shows up in reports as wide inconsistency between products and batches.',
  harm: 'Product strength is unpredictable because the active-to-inactive epimer ratio varies. Manufacturing residues from hydrogenation are not routinely tested for. Essentially no human safety data.'
},

cbn: {
  what: 'Cannabinol, the oxidative degradation product of THC that accumulates as cannabis ages. A weak CB1 partial agonist, roughly a tenth of THC\'s potency.',
  looks: 'Present in old cannabis; sold as isolate and in "sleep" products.',
  reports: 'Marketed heavily as a sedative. Community and trial reports do not really support that — the sedation of old cannabis is probably more about terpene loss and the accompanying THC than about CBN itself.',
  harm: 'Mildly intoxicating at high doses, contrary to how it is marketed. The sleep claims are not well supported.'
},

'jwh-018': {
  what: 'A naphthoylindole synthetic cannabinoid from academic receptor research, and the first to appear in "Spice" products. Unlike THC it is a full CB1 agonist, which removes the ceiling that makes cannabis physiologically forgiving.',
  looks: 'Sprayed onto inert plant material and sold as herbal incense; also as powder.',
  reports: 'Reported as far more intense and far less pleasant than cannabis, with anxiety, tachycardia, vomiting and psychosis common. The lack of any ceiling is the recurring theme.',
  harm: 'Full CB1 agonism means genuine overdose is possible — seizures, psychosis, acute kidney injury and deaths are documented, none of which happens with cannabis. Spraying onto plant material is never even, so one part of a bag can be many times stronger than another. Its metabolites are also active, extending effects.'
},

cbg: {
  what: 'Cannabigerol, the biosynthetic precursor from which THC, CBD and CBC are made in the plant. Non-intoxicating, present at low levels in most cultivars.',
  looks: 'Isolate powder, oils, and high-CBG flower.',
  reports: 'Reported as non-intoxicating with subtle effects; the report base is thin and heavily influenced by marketing.',
  harm: 'Little human data. Standard caution about supplement labelling accuracy applies.'
},

cbc: {
  what: 'Cannabichromene, a non-intoxicating minor cannabinoid with weak CB receptor affinity and activity at TRP channels.',
  looks: 'Isolate and in full-spectrum extracts.',
  reports: 'Very thin report base; not distinguishable in practice from other minor cannabinoids in a full-spectrum product.',
  harm: 'Little human data.'
},

cbt: {
  what: 'Cannabitriol, a minor oxidised cannabinoid found in trace amounts, poorly characterised pharmacologically.',
  looks: 'Rarely isolated; appears in analyses of extracts.',
  reports: 'Essentially none.',
  harm: 'Essentially uncharacterised in humans.'
},

cbdv: {
  what: 'Cannabidivarin, the propyl-chain analogue of CBD, non-intoxicating and investigated as an anticonvulsant and in autism research.',
  looks: 'Isolate and in some high-CBDV cultivars.',
  reports: 'Thin report base outside trials.',
  harm: 'Little human safety data outside clinical studies.'
},

thcv: {
  what: 'Tetrahydrocannabivarin, the propyl analogue of THC. Notably, it is a CB1 antagonist at low doses and an agonist at higher ones, which is an unusual dose-dependent reversal.',
  looks: 'Isolate, and at meaningful levels in a few African landrace cultivars.',
  reports: 'Reported as appetite-suppressing and clear-headed at low doses and mildly intoxicating at high ones, which matches the antagonist-to-agonist switch.',
  harm: 'The dose-dependent reversal makes effects unpredictable across the range. Little human data.'
},

thca: {
  what: 'Tetrahydrocannabinolic acid, the form THC actually exists in inside the living plant. Non-intoxicating until decarboxylated by heat, which is why raw cannabis does not get you high and smoking or baking it does.',
  looks: 'Present in raw and unheated cannabis; also sold as isolate crystals ("diamonds").',
  reports: 'Raw juicing is reported as non-intoxicating. "THCA flower" sold as a legal product is simply cannabis that becomes THC the moment it is lit — a legal distinction, not a pharmacological one.',
  harm: 'Any heating converts it to THC. Products marketed as non-intoxicating THCA flower are intoxicating when smoked or vaped.'
},

cbda: {
  what: 'Cannabidiolic acid, the acid form of CBD in the raw plant, decarboxylated to CBD by heat. Some evidence of greater potency at certain targets than CBD itself.',
  looks: 'Present in raw cannabis and in unheated extracts.',
  reports: 'Thin.',
  harm: 'Little human data.'
},

'delta-10-thc': {
  what: 'Another THC double-bond isomer, weaker than delta-9, produced by acid-catalysed conversion from CBD and sold in the same legal grey market as delta-8.',
  looks: 'Vape carts and edibles.',
  reports: 'Reported as weaker and more stimulating than delta-8; report base is thin and product identity is unreliable.',
  harm: 'Same synthesis-residue and mislabelling problems as delta-8. Products sold as delta-10 frequently contain a mixture of isomers.'
},

'thc-o': {
  what: 'THC-O-acetate, an acetylated THC ester, a prodrug that converts to THC after a delayed onset. Notably, it fell out of the legal grey market after research showed that vaping acetate esters produces ketene, a highly toxic gas — the same chemistry behind vitamin E acetate and the EVALI lung injury outbreak.',
  looks: 'Vape carts and distillate; declining availability after the ketene findings.',
  reports: 'Reported as delayed by 30 minutes to an hour and then much stronger than expected, which caused a lot of unpleasant experiences. The ketene concern became widely known in the community from 2022.',
  harm: 'Heating acetate esters can generate ketene, a severe pulmonary toxin. Do not vape it. The delayed onset causes redose overdoses. Essentially no human safety data.'
},

h4cbd: {
  what: 'Hydrogenated CBD, sold as a semi-synthetic cannabinoid. Unlike CBD it has meaningful CB1 affinity and is mildly intoxicating, despite being marketed as a CBD variant.',
  looks: 'Oils, vapes, and sprayed flower.',
  reports: 'Reported as mildly intoxicating, which surprises people who bought it expecting CBD.',
  harm: 'It is not CBD and it is not non-intoxicating. Hydrogenation residues are not routinely tested for. No human safety data.'
},

'mdmb-4en-pinaca': {
  what: 'An indazole carboxamide synthetic cannabinoid, a potent full CB1 agonist, and one of the most frequently detected synthetic cannabinoids worldwide. Heavily implicated in mass-poisoning clusters, particularly in prisons where it is sprayed onto paper.',
  looks: 'Powder; usually sprayed onto plant material or onto soaked paper. Cannot be seen or smelled on paper.',
  reports: 'Reported in terms of collapse, seizures and unconsciousness rather than of a pleasant effect. Prison and homeless-population poisoning clusters dominate the report base.',
  harm: 'Full CB1 agonist with no ceiling; deaths, seizures and cardiac arrest are documented. Spraying is never even, so dose per unit of material is unknowable. Naloxone does nothing.'
},

'adb-butinaca': {
  what: 'An indazole carboxamide full CB1 agonist that became one of the most commonly detected synthetic cannabinoids in Europe from around 2019.',
  looks: 'Powder, sprayed on plant material or paper.',
  reports: 'Reported in the same terms as other potent synthetic cannabinoids: unpredictable, unpleasant, associated with collapse and seizures.',
  harm: 'Full agonist, no ceiling, uneven distribution on sprayed material. Deaths documented.'
},

'5f-mdmb-pica': {
  what: 'A fluorinated indole carboxamide full CB1 agonist, extremely potent and implicated in a large number of deaths worldwide.',
  looks: 'Powder, sprayed onto plant material.',
  reports: 'Associated with mass-casualty clusters. Little in the way of positive report base.',
  harm: 'Among the most lethal synthetic cannabinoids by detection-to-death ratio. Full agonist, no ceiling. Its metabolites are also active.'
},

'mdmb-chmica': {
  what: 'An indole carboxamide full CB1 agonist that caused a wave of poisonings and deaths across Europe in 2015–2016, prompting an EMCDDA risk assessment.',
  looks: 'Powder, sprayed onto herbal material.',
  reports: 'Report base is dominated by hospital presentations: unconsciousness, seizures, agitation.',
  harm: 'Full agonist; documented deaths and mass poisonings. Uneven spraying.'
},

'cumyl-pegaclone': {
  what: 'A gamma-carbolinone synthetic cannabinoid, structurally distinct from the indole and indazole families, a potent full CB1 agonist that became dominant in parts of Europe.',
  looks: 'Powder, sprayed onto plant material.',
  reports: 'Reported as extremely potent by weight; associated with deaths in Germany.',
  harm: 'Full agonist with very high potency. Its structural novelty means it evades some analytical screens.'
},

thcp: {
  what: 'Tetrahydrocannabiphorol, a naturally occurring THC analogue with a seven-carbon side chain instead of five, discovered in 2019. It binds CB1 with roughly 30 times THC\'s affinity, though the difference in effect in practice is smaller than that number suggests.',
  looks: 'Present in trace amounts in cannabis; sold as isolate and in vape products, often alongside other cannabinoids.',
  reports: 'Reported as considerably stronger than THC by weight and longer-lasting. Product content is frequently not what the label says.',
  harm: 'High binding affinity means small quantities matter, and edibles containing it have caused prolonged and intense effects. It is still a partial agonist, unlike the synthetic full agonists, so the physiological ceiling is retained. Essentially no human safety data.'
},

nabilone: {
  what: 'A synthetic THC analogue approved for chemotherapy-induced nausea and, in some places, for other indications. A CB1 agonist with a long duration.',
  looks: 'Capsules.',
  reports: 'Reported clinically as strongly sedating and dysphoric in a substantial minority, which limits its use.',
  harm: 'Long-acting with pronounced psychiatric effects in some people. Additive with other sedatives.'
},

'am-2201': {
  what: 'A fluorinated naphthoylindole full CB1 agonist from the JWH series lineage, widely present in Spice products around 2011–2013.',
  looks: 'Powder, sprayed on plant material.',
  reports: 'Associated with seizures, psychosis and acute kidney injury clusters.',
  harm: 'Full agonist; documented seizures, nephrotoxicity and deaths. Its metabolites are also active full agonists.'
},

'xlr-11': {
  what: 'A fluorinated tetramethylcyclopropyl synthetic cannabinoid, notable for being specifically linked to clusters of acute kidney injury in previously healthy young people.',
  looks: 'Powder, sprayed on herbal material.',
  reports: 'The acute kidney injury cluster in 2012–2013 is the defining report; the mechanism is thought to involve a fluorinated metabolite.',
  harm: 'Documented cause of acute kidney injury requiring dialysis. Full CB1 agonist with the usual seizure and cardiac risks.'
},

'ab-pinaca': {
  what: 'An indazole carboxamide full CB1 agonist, among the earlier members of the family that now dominates the synthetic cannabinoid market.',
  looks: 'Powder, sprayed on plant material.',
  reports: 'Associated with mass poisonings in the US.',
  harm: 'Full agonist with documented seizures, delirium and deaths.'
},

'11-oh-thc': {
  what: '11-hydroxy-THC, the primary active metabolite of THC, formed mainly by CYP2C9 in the liver. It crosses into the brain more readily than THC and is more potent centrally, which is the actual reason edibles feel different from smoking rather than merely delayed.',
  looks: 'Not sold; formed in the body, in far greater quantity after oral than after inhaled THC.',
  reports: 'Reported indirectly, as the near-universal observation that edibles are qualitatively different and more intense than smoking the same nominal amount.',
  harm: 'Explains why oral dosing is not comparable to inhaled dosing. CYP2C9 poor metabolisers form less of it and clear THC more slowly. Its formation is why the onset is slow and the peak is late.'
},

/* ================= Deliriants ================= */

diphenhydramine: {
  what: 'A first-generation antihistamine that is also a potent central antimuscarinic — the antihistamine effect makes you drowsy, and the anticholinergic effect at high doses makes you delirious. It also blocks cardiac sodium channels in overdose.',
  looks: 'Tablets, capsules and liquid, sold everywhere as a sleep aid and allergy medicine.',
  reports: 'Recreational reports are overwhelmingly negative. The recurring description is of realistic, non-obvious hallucinations — spiders, insects, and people who are not there and who are indistinguishable from real ones — accompanied by confusion, terror and no insight. Almost nobody reports wanting to do it twice.',
  harm: 'In overdose it blocks cardiac sodium channels and causes wide-complex arrhythmia, seizures and death; this is a genuine and not-rare mechanism. Anticholinergic delirium involves urinary retention, hyperthermia and no insight into what is happening. Regular long-term use is associated with increased dementia risk. There is no dose at which the delirium is pleasant, according to essentially the entire report base.'
},

dimenhydrinate: {
  what: 'Diphenhydramine combined with a chlorotheophylline salt, sold for motion sickness. The active part is the diphenhydramine; the theophylline component adds a stimulant that offsets some sedation.',
  looks: 'Tablets, sold over the counter.',
  reports: 'Same pattern as diphenhydramine, with added tachycardia from the theophylline component.',
  harm: 'Identical anticholinergic and cardiac risks to diphenhydramine, plus the theophylline adds cardiac and seizure risk.'
},

scopolamine: {
  what: 'A tropane antimuscarinic from Datura and related plants, used medically for motion sickness and secretions. More centrally active than atropine.',
  looks: 'Transdermal patches medically; as plant material, Datura seeds and flowers, where content varies by orders of magnitude between plants and even between parts of the same plant.',
  reports: 'Datura reports are among the most consistently negative in the entire drug literature: days of delirium, no memory, no insight, and frequently serious injury. Its use in crime for producing compliance and amnesia is documented in South America.',
  harm: 'Alkaloid content in Datura varies so much between plants that no dose can be estimated — this is the main cause of the deaths. Anticholinergic toxicity causes hyperthermia, urinary retention, seizures and cardiac arrhythmia. Delirium lasts days and there is no insight during it. Physostigmine is the antidote and needs a hospital.'
},

/* ================= Inhalant ================= */

'amyl-nitrite': {
  what: 'An alkyl nitrite vasodilator ("poppers") that works by releasing nitric oxide, relaxing smooth muscle throughout the body. The head rush is cerebral vasodilation; the other effect is smooth-muscle relaxation, which is what it is mostly used for.',
  looks: 'Small bottles of clear yellowish liquid with a strong sweet chemical smell, sold as "leather cleaner" or "room odouriser".',
  reports: 'Reported as a 30-second rush with headache afterwards. Two harms are widely reported: chemical burns around the nose and mouth from spilled liquid, and, with isopropyl nitrite specifically, retinal damage causing a persistent central blind spot.',
  harm: 'Absolutely never combine with sildenafil, tadalafil or any PDE5 inhibitor — the combined vasodilation causes a catastrophic drop in blood pressure and this combination has killed people. Swallowing it causes methaemoglobinaemia and can be fatal; it is only ever inhaled. Isopropyl nitrite has caused permanent maculopathy. Keep away from flames — it is highly flammable.'
},

/* ================= Antidepressants, antipsychotics, mood stabilisers ================= */

fluoxetine: {
  what: 'The first widely used SSRI, notable for an exceptionally long half-life — days for the parent and over a week for its active metabolite norfluoxetine. That is why it is the SSRI least associated with discontinuation symptoms and the one used to taper others.',
  looks: 'Green and white or green and yellow capsules, tablets and oral solution.',
  reports: 'Reported as taking weeks to work, with early worsening of anxiety and insomnia that resolves. Emotional blunting and sexual dysfunction are the two most consistently reported ongoing effects, and the sexual effects sometimes persist after stopping.',
  harm: 'A strong CYP2D6 inhibitor, which means it abolishes codeine and tramadol analgesia (blocking their conversion to active metabolites) and raises levels of many other drugs — this is a large and frequently missed interaction. Never combine with MAOIs, and the washout needed is five weeks because of norfluoxetine. Adds serotonin syndrome risk with MDMA, tramadol, triptans and linezolid.'
},

sertraline: {
  what: 'An SSRI with mild dopamine reuptake inhibition and sigma-1 activity, generally regarded as having a favourable interaction profile relative to other SSRIs.',
  looks: 'Tablets and oral concentrate.',
  reports: 'Reported as activating early on, with gastrointestinal effects — diarrhoea in particular — more common than with other SSRIs. Emotional blunting and sexual dysfunction reported as with the class.',
  harm: 'Weaker CYP inhibition than fluoxetine or paroxetine, which is a genuine advantage. Never with MAOIs. Discontinuation symptoms if stopped abruptly; taper.'
},

venlafaxine: {
  what: 'An SNRI that is essentially an SSRI at low doses and becomes noradrenergic only at higher ones. Its short half-life makes it the antidepressant most associated with severe discontinuation symptoms.',
  looks: 'Tablets and modified-release capsules.',
  reports: 'The dominant report is discontinuation: missing a single dose of the immediate-release form produces "brain zaps", dizziness and flu-like symptoms within a day. This is very widely reported and is one of the most common complaints about any psychiatric medication.',
  harm: 'Do not stop abruptly — the withdrawal is genuinely severe and needs a slow taper, sometimes over months. Raises blood pressure at higher doses. More dangerous in overdose than SSRIs, with seizures and cardiac effects. Never with MAOIs.'
},

bupropion: {
  what: 'A noradrenaline and dopamine reuptake inhibitor and nicotinic antagonist, used for depression and smoking cessation. Not serotonergic at all, which is why it does not cause sexual dysfunction or emotional blunting the way SSRIs do.',
  looks: 'Tablets, usually modified-release.',
  reports: 'Reported as activating and non-blunting, and specifically as preserving sexual function, which is why it is often added to an SSRI. Insomnia and dry mouth are common. Seizure reports at high doses are a persistent theme.',
  harm: 'Lowers the seizure threshold in a dose-dependent way — this is the reason for the dose ceilings and for the contraindication in eating disorders and alcohol withdrawal. A strong CYP2D6 inhibitor, so it blocks codeine and tramadol activation and raises levels of many drugs. Never with MAOIs.'
},

phenelzine: {
  what: 'An irreversible, non-selective MAOI. It permanently inactivates monoamine oxidase, so recovery requires the body to synthesise new enzyme — around two weeks. Highly effective for atypical and treatment-resistant depression, at the cost of the most demanding interaction profile in psychiatry.',
  looks: 'Tablets.',
  reports: 'Reported as effective where nothing else was, alongside a diet that has to be genuinely observed. Orthostatic hypotension and weight gain are common.',
  harm: 'Tyramine-containing foods — aged cheese, cured meats, soy sauce, fermented foods, tap beer, broad bean pods — cause hypertensive crisis. Combination with any serotonergic (SSRIs, SNRIs, tramadol, MDMA, DXM, triptans, linezolid, St John\'s wort) causes serotonin syndrome and has been fatal. Combination with sympathomimetics (amphetamine, pseudoephedrine, cocaine) causes hypertensive crisis. Fourteen-day washout in both directions, five weeks for fluoxetine.'
},

moclobemide: {
  what: 'A reversible inhibitor of MAO-A (RIMA). Because the inhibition is reversible and selective, dietary tyramine can displace it from the enzyme, which makes the diet far less restrictive than with irreversible MAOIs.',
  looks: 'Tablets; not available in the US.',
  reports: 'Reported as milder than irreversible MAOIs and much easier to live with, with correspondingly more modest antidepressant effect.',
  harm: 'The tyramine restriction is much looser but not absent — very large tyramine loads still cause hypertension. The serotonergic interaction danger is undiminished: combination with SSRIs, tramadol, MDMA or DXM causes serotonin syndrome and has been fatal.'
},

selegiline: {
  what: 'A selective, irreversible MAO-B inhibitor at low doses used for Parkinson\'s disease, which loses that selectivity at higher doses and as a transdermal patch, where it becomes an antidepressant and a non-selective MAOI. It is metabolised to l-amphetamine and l-methamphetamine.',
  looks: 'Tablets, orally disintegrating tablets, and a transdermal patch.',
  reports: 'Reported at low doses as mildly stimulating, which is partly the amphetamine metabolites. At antidepressant doses the interaction profile becomes the dominant concern.',
  harm: 'MAO-B selectivity is lost above about 10 mg/day and with the patch above the lowest strength, at which point full MAOI dietary and drug restrictions apply. The amphetamine metabolites show on drug screens. Serotonergic combinations are dangerous at antidepressant doses.'
},

paroxetine: {
  what: 'An SSRI with the strongest CYP2D6 inhibition of the class and significant anticholinergic activity, plus a short half-life with no active metabolite.',
  looks: 'Tablets and oral suspension.',
  reports: 'Reported as the SSRI with the worst discontinuation syndrome and the most weight gain and sexual dysfunction. Tapering off it is widely described as difficult.',
  harm: 'Severe discontinuation symptoms; taper very slowly. Potent CYP2D6 inhibitor — abolishes codeine and tramadol analgesia and raises levels of many drugs, including its own (autoinhibition makes its kinetics non-linear). Highest teratogenic concern of the SSRIs. Never with MAOIs.'
},

escitalopram: {
  what: 'The active S-enantiomer of citalopram, the most selective SSRI available. Selectivity means fewer off-target effects and a cleaner interaction profile.',
  looks: 'Tablets and oral drops.',
  reports: 'Reported as among the better-tolerated SSRIs, with the class-typical sexual dysfunction and emotional blunting.',
  harm: 'Dose-dependent QT prolongation, which is the reason for its dose ceiling, particularly in older people. Minimal CYP inhibition. Never with MAOIs; taper on stopping.'
},

fluvoxamine: {
  what: 'An SSRI with strong sigma-1 activity and, importantly, the most potent CYP1A2 inhibition of any commonly used drug.',
  looks: 'Tablets.',
  reports: 'Reported as sedating relative to other SSRIs, with more nausea early on.',
  harm: 'Its CYP1A2 inhibition multiplies caffeine\'s half-life several-fold — people on fluvoxamine who keep drinking coffee get genuinely toxic caffeine levels. It also raises theophylline, clozapine, olanzapine and melatonin levels substantially. Also inhibits CYP2C19 and CYP3A4. Never with MAOIs.'
},

mirtazapine: {
  what: 'A noradrenergic and specific serotonergic antidepressant that works by blocking alpha-2 autoreceptors and several serotonin receptor subtypes rather than by reuptake inhibition. Its antihistamine activity is strongest at low doses, which produces the counterintuitive result that it is more sedating at 7.5 mg than at 45 mg.',
  looks: 'Tablets and orally disintegrating tablets.',
  reports: 'The universally reported effects are sedation and appetite increase with weight gain — both are used therapeutically. The dose-inversion of sedation is very widely reported and surprises people.',
  harm: 'Substantial weight gain is common and not trivial. Rare agranulocytosis. Additive sedation with any depressant. Serotonergic despite the different mechanism — MAOI combination is contraindicated.'
},

trazodone: {
  what: 'A serotonin antagonist and reuptake inhibitor used almost entirely at low doses as a hypnotic rather than at antidepressant doses. Strongly antihistaminergic and alpha-1 blocking.',
  looks: 'Tablets.',
  reports: 'Widely reported as an effective non-dependence-forming sleep aid with a next-day hangover at higher doses.',
  harm: 'Priapism is a rare but genuine emergency requiring immediate treatment to avoid permanent damage. Marked orthostatic hypotension, especially in older people. Serotonergic; MAOI combination contraindicated.'
},

tranylcypromine: {
  what: 'An irreversible non-selective MAOI with an amphetamine-like structure that gives it genuine stimulant properties on top of MAO inhibition.',
  looks: 'Tablets.',
  reports: 'Reported as the most activating MAOI, and as effective in depression that has failed everything else. The dietary restriction is reported as onerous but manageable.',
  harm: 'The most hypertensive-crisis-prone MAOI because of its own sympathomimetic activity, on top of the tyramine reaction. Every MAOI interaction applies: no serotonergics, no sympathomimetics, strict tyramine restriction, 14-day washouts.'
},

desvenlafaxine: {
  what: 'The active metabolite of venlafaxine, marketed separately. Its advantage is that it does not require CYP2D6 conversion, so exposure is more predictable across genotypes.',
  looks: 'Modified-release tablets.',
  reports: 'Reported similarly to venlafaxine, including discontinuation symptoms.',
  harm: 'Same cautions as venlafaxine: blood pressure, discontinuation syndrome, no MAOIs.'
},

quetiapine: {
  what: 'An atypical antipsychotic whose pharmacology changes completely with dose: at 25–50 mg it is essentially an antihistamine sleep aid, at 150–300 mg an antidepressant through its noradrenergic metabolite, and only at 400 mg and above meaningfully antipsychotic.',
  looks: 'Tablets, immediate and modified release.',
  reports: 'Very widely reported as a sleep aid at low doses, and equally widely reported for weight gain and next-day grogginess. Prescribed off-label for insomnia far more than its evidence supports.',
  harm: 'Substantial metabolic effects — weight gain, dyslipidaemia and diabetes risk — even at low doses used for sleep. QT prolongation. Orthostatic hypotension. Additive with any sedative. CYP3A4-dependent, so levels rise sharply with inhibitors.'
},

olanzapine: {
  what: 'An atypical antipsychotic with strong antihistamine and antimuscarinic activity and the most pronounced metabolic side-effect profile of the commonly used agents. Also used to abort the psychological effects of psychedelics.',
  looks: 'Tablets and orally disintegrating tablets.',
  reports: 'Reported in harm-reduction communities as the standard "trip killer", which it genuinely is — it blocks 5-HT2A and reliably ends a psychedelic experience. Also universally reported for weight gain and sedation.',
  harm: 'Major weight gain and metabolic syndrome risk. Heavily sedating and additive with other depressants. Metabolised by CYP1A2, so fluvoxamine and stopping smoking both raise levels substantially. As a trip killer it works, but benzodiazepines are usually the safer first choice for acute distress.'
},

lithium: {
  what: 'A monovalent cation used as a mood stabiliser, with a mechanism still not fully understood. It has the narrowest therapeutic index of any commonly prescribed drug — the effective and toxic ranges nearly touch.',
  looks: 'Tablets and modified-release tablets; also oral solution.',
  reports: 'Reported as genuinely effective for bipolar disorder and specifically for reducing suicide risk, alongside tremor, thirst, weight gain and cognitive dulling.',
  harm: 'Levels must be monitored by blood test; toxicity causes tremor, confusion, seizures and permanent neurological damage. Dehydration, NSAIDs, ACE inhibitors, thiazide diuretics and low sodium intake all raise levels into the toxic range. The combination with psychedelics is associated with seizures and is one of the few genuinely dangerous psychedelic interactions. Long-term use affects thyroid and kidney function.'
},

/* ================= Other pharmaceuticals ================= */

melatonin: {
  what: 'The hormone the pineal gland releases in darkness to signal biological night. It is a circadian timing signal rather than a sedative, which is why timing matters far more than dose.',
  looks: 'Tablets, gummies and liquid, in doses from 0.3 mg to 10 mg. The larger doses are pharmacologically unnecessary and are a marketing artefact.',
  reports: 'Widely reported as more effective at small doses (0.3–1 mg) taken several hours before bed than at large doses taken at bedtime — which matches the physiology. Vivid dreams and morning grogginess are common at high doses.',
  harm: 'It shifts circadian phase, so taking it at the wrong time moves your body clock in the wrong direction. Doses above 1 mg produce levels far above physiological and are more likely to cause next-day grogginess. Metabolised by CYP1A2, so fluvoxamine multiplies levels dramatically. Supplement labelling accuracy is poor.'
},

sildenafil: {
  what: 'A PDE5 inhibitor that potentiates nitric-oxide-mediated smooth muscle relaxation, used for erectile dysfunction and pulmonary hypertension.',
  looks: 'Blue diamond-shaped tablets pharmaceutically; extensively counterfeited, and counterfeits have contained everything from the wrong dose to entirely different drugs.',
  reports: 'Widely used alongside stimulants, where it counteracts the vasoconstriction. Headache, flushing and blue-tinged vision are commonly reported.',
  harm: 'Absolutely never with nitrites (poppers) or nitrate medications — the combined vasodilation causes catastrophic hypotension and this combination kills. Sudden hearing or vision loss requires immediate medical attention. Erections lasting over four hours need emergency treatment. Counterfeits are widespread. CYP3A4 inhibitors including ritonavir raise levels several-fold.'
},

ondansetron: {
  what: 'A selective 5-HT3 antagonist used to prevent nausea and vomiting, particularly from chemotherapy. It does not sedate, unlike older antiemetics.',
  looks: 'Tablets, orally disintegrating films and injection.',
  reports: 'Widely used in harm-reduction contexts to manage nausea during psychedelic come-ups; reported as effective and non-sedating, with constipation and headache as the usual side effects.',
  harm: 'Prolongs the QT interval, particularly intravenously, and should be used carefully alongside other QT-prolonging drugs such as methadone. Because 5-HT3 is a serotonin receptor, there is a theoretical serotonin syndrome interaction, though the practical risk is low.'
},

grapefruit: {
  what: 'Not a drug but a potent and irreversible inhibitor of intestinal CYP3A4, via furanocoumarins. Because the inhibition is mechanism-based, the effect lasts until new enzyme is made — around 24 to 72 hours — so taking a drug "away from" grapefruit does not avoid it.',
  looks: 'Grapefruit, grapefruit juice, pomelo and Seville oranges. Ordinary oranges do not do this.',
  reports: 'Discussed constantly in harm-reduction communities as a potentiator, particularly for opioids and benzodiazepines. It works, which is exactly why it is dangerous.',
  harm: 'Using it deliberately to potentiate a drug is a way of taking an unknown multiple of your dose — the effect varies between people, between fruit and between preparations. It raises levels of many CYP3A4 substrates several-fold, including oxycodone, alprazolam, triazolam, methadone, statins and immunosuppressants. The inhibition persists for days after the last glass.'
},

propranolol: {
  what: 'A non-selective beta blocker that crosses into the brain, used for hypertension, arrhythmia, migraine prophylaxis and performance anxiety. It blocks the physical symptoms of adrenaline without touching the psychological ones directly.',
  looks: 'Tablets and modified-release capsules.',
  reports: 'Very widely used for performance anxiety and reported as effective for the tremor and racing heart specifically.',
  harm: 'Do not use it to treat cocaine or stimulant chest pain — beta blockade leaves alpha stimulation unopposed and can worsen vasoconstriction and hypertension. Contraindicated in asthma because of bronchoconstriction. Masks the adrenergic warning signs of hypoglycaemia. Abrupt discontinuation after regular use causes rebound tachycardia and can precipitate cardiac events.'
},

cyproheptadine: {
  what: 'A first-generation antihistamine that is also a potent 5-HT2A antagonist, which makes it both an appetite stimulant and the standard pharmacological treatment for serotonin syndrome.',
  looks: 'Tablets and syrup.',
  reports: 'Known in harm-reduction communities as a "trip killer" and as the serotonin syndrome antidote. It does work for both, being a 5-HT2A antagonist.',
  harm: 'Strongly sedating and anticholinergic. As a trip killer it is slower and less reliable than olanzapine and adds anticholinergic burden. For suspected serotonin syndrome, the priority is a hospital, not a home antidote.'
},

ritonavir: {
  what: 'An HIV protease inhibitor now used almost entirely at low doses as a pharmacokinetic booster, because it is among the most potent CYP3A4 inhibitors in medicine. That is its purpose in modern regimens: to raise the levels of other drugs.',
  looks: 'Tablets, capsules and oral solution; also as the second component of nirmatrelvir/ritonavir.',
  reports: 'The relevant report base is a set of documented deaths from combining it with MDMA and with GHB — the CYP inhibition raised those drugs to fatal levels.',
  harm: 'It multiplies the levels of an enormous number of drugs, including MDMA, ketamine, benzodiazepines, opioids and many others, sometimes several-fold. Fatal MDMA and GHB interactions are documented. Anyone on ritonavir should treat every other substance as potentially several times stronger than usual. It also induces some enzymes, so effects are not uniformly in one direction.'
},

carbamazepine: {
  what: 'A sodium-channel-blocking anticonvulsant, also used for trigeminal neuralgia and bipolar disorder. It is a powerful inducer of CYP3A4 and of its own metabolism.',
  looks: 'Tablets, modified-release tablets and suspension.',
  reports: 'Clinically reported for the induction effect: it lowers levels of a great many other drugs, including hormonal contraception, to the point of failure.',
  harm: 'Strong CYP3A4 induction reduces the effectiveness of oral contraceptives, warfarin, methadone and many others — this causes real failures, including pregnancies and withdrawal. Serious skin reactions including Stevens-Johnson syndrome are strongly associated with the HLA-B*1502 allele, which is why testing is recommended in people of Han Chinese and Southeast Asian ancestry. Causes hyponatraemia. Autoinduces, so levels fall over the first weeks.'
},

piracetam: {
  what: 'The original racetam nootropic, a cyclic GABA derivative whose mechanism remains poorly defined — it modulates membrane fluidity and AMPA receptor function rather than acting on a single receptor.',
  looks: 'White powder and tablets; doses are in grams.',
  reports: 'Nootropic community reports are mixed to negative, with many people reporting nothing at all. Headache attributed to choline depletion is the most consistent report, along with the practice of taking a choline source alongside.',
  harm: 'Generally very well tolerated with a wide margin. Renally cleared, so dose must be reduced in kidney impairment. Doses are large, so purity of bulk powder matters.'
},

meldonium: {
  what: 'A carnitine-biosynthesis inhibitor developed in Latvia for ischaemic heart disease, which shifts cardiac metabolism from fatty acid to glucose oxidation. Best known for the doping cases after it was added to the WADA prohibited list in 2016.',
  looks: 'Capsules and injection; regionally available.',
  reports: 'Reported for endurance and recovery; the evidence base outside the former Soviet Union is thin.',
  harm: 'Banned in sport. Very long clearance — detectable for months, which is what caught many athletes out. Almost all clinical data is Latvian and Russian and not independently replicated.'
},

noopept: {
  what: 'A dipeptide nootropic developed in Russia, structurally unrelated to the racetams but often grouped with them, and active at roughly a thousandth of piracetam\'s dose.',
  looks: 'White powder or tablets; doses are in the tens of milligrams.',
  reports: 'Reported in nootropic communities as more noticeable than piracetam, with effects on clarity and memory. Reports of irritability at higher doses are common.',
  harm: 'Very potent by weight compared with racetams, so a piracetam-sized scoop would be an enormous overdose. Almost all human data is Russian. Long-term safety unknown.'
},

aniracetam: {
  what: 'A fat-soluble racetam with AMPA receptor modulating activity, reported as more anxiolytic than piracetam.',
  looks: 'White powder; must be taken with fat for absorption.',
  reports: 'Reported as anxiolytic and short-acting, requiring several doses a day. Fat-solubility means taking it on an empty stomach is reported as ineffective.',
  harm: 'Extensive first-pass metabolism means most of what is swallowed never arrives as parent drug. Little long-term safety data.'
},

semax: {
  what: 'A Russian-developed ACTH fragment peptide, administered nasally, studied there for stroke and cognitive indications. It is thought to act partly by raising BDNF.',
  looks: 'Nasal drops or spray; peptide powder for reconstitution.',
  reports: 'Nootropic community reports are mixed. Being a peptide, it degrades in storage and handling, which may account for some of the inconsistency.',
  harm: 'Peptide stability is a real problem — improperly stored product is inert. Essentially no independent human safety data outside Russia.'
},

vinpocetine: {
  what: 'A semi-synthetic derivative of vincamine, from periwinkle, used in some countries as a cerebral vasodilator and sold as a supplement elsewhere.',
  looks: 'Tablets and capsules.',
  reports: 'Nootropic reports are mixed and modest.',
  harm: 'The FDA has warned that it may cause miscarriage and should not be taken by anyone who could become pregnant. Efficacy evidence is weak.'
},

'huperzine-a': {
  what: 'An acetylcholinesterase inhibitor from Huperzia serrata clubmoss, sold as a supplement and studied for Alzheimer\'s disease. It is a real, potent enzyme inhibitor rather than a herbal placebo.',
  looks: 'Capsules containing microgram doses.',
  reports: 'Reported for vivid dreams and for cholinergic side effects — nausea, cramps, excessive salivation — which are the signs of too much.',
  harm: 'It is a genuine cholinesterase inhibitor with a long duration, so it accumulates with daily use and cholinergic toxicity is possible. Should not be combined with other cholinergic drugs. Cycling rather than daily use is the usual advice.'
},

harmine: {
  what: 'A beta-carboline alkaloid of Banisteriopsis caapi and Peganum harmala, and a reversible MAO-A inhibitor. It is what makes ayahuasca work: without it, the DMT in the brew would be destroyed in the gut.',
  looks: 'Present in ayahuasca brews and in Syrian rue seeds; also sold as an extract.',
  reports: 'Reported as producing nausea and vomiting in its own right, which in the ayahuasca context is treated as purgative rather than as a side effect.',
  harm: 'It is a genuine MAOI, so the full MAOI interaction profile applies for its duration: no SSRIs, no tramadol, no MDMA, no sympathomimetics, and tyramine caution. Deaths have occurred from combining ayahuasca with antidepressants or with 5-MeO-DMT.'
},

harmaline: {
  what: 'A beta-carboline MAO-A inhibitor from the same plants as harmine, somewhat more potent as an inhibitor and more psychoactive in its own right.',
  looks: 'Present in Syrian rue and ayahuasca; sold as an extract.',
  reports: 'Reported as more sedating and more nauseating than harmine, with its own dreamlike effects at higher doses.',
  harm: 'Full MAOI interaction profile. More potent inhibition means the interaction risk is if anything greater than with harmine.'
},

thh: {
  what: 'Tetrahydroharmine, the third principal beta-carboline of ayahuasca. Unlike harmine and harmaline it is a weak serotonin reuptake inhibitor rather than a strong MAOI, and it contributes to the brew\'s character.',
  looks: 'Present in ayahuasca and B. caapi.',
  reports: 'Not usually distinguished from the brew as a whole.',
  harm: 'Its serotonin reuptake inhibition adds to the serotonergic load of ayahuasca, which is part of why combining the brew with SSRIs or other serotonergics is dangerous.'
},

hnk: {
  what: '(2R,6R)-hydroxynorketamine, a downstream ketamine metabolite that produces antidepressant-like effects in animals without NMDA antagonism or dissociation. It is a major focus of research into separating ketamine\'s antidepressant effect from its dissociative one.',
  looks: 'Research compound; not available as a product.',
  reports: 'No human recreational report base; human trials are early.',
  harm: 'Not established in humans. Anything sold under this name outside a trial is of unknown identity.'
},

/* ================= OTC medicines ================= */

paracetamol: {
  what: 'Acetaminophen — an analgesic and antipyretic whose mechanism is still not settled, involving central COX inhibition and the endocannabinoid system via its metabolite AM404. It has no meaningful anti-inflammatory effect, which distinguishes it from the NSAIDs.',
  looks: 'Tablets, capsules, syrup, suppositories and intravenous solution. Present in an enormous number of combination products, which is the core of its danger.',
  reports: 'The consistent theme in harm-reduction communities is combination products: people taking codeine or DXM preparations for the other ingredient and reaching hepatotoxic paracetamol doses without knowing it. Cold-water extraction is discussed constantly for this reason.',
  harm: 'It is the leading cause of acute liver failure in the developed world. The toxic metabolite NAPQI is normally neutralised by glutathione, and once glutathione is exhausted, liver cells die. There are no symptoms for the first 24 hours — someone who has taken a fatal dose feels fine, which is why people present too late. Alcohol, fasting and malnutrition lower the toxic threshold substantially. Acetylcysteine is an effective antidote but works best within 8 hours. Never exceed 4 g in 24 hours, and count every combination product.'
},

ibuprofen: {
  what: 'A non-selective COX inhibitor NSAID with analgesic, antipyretic and anti-inflammatory activity.',
  looks: 'Tablets, capsules, gel and suspension.',
  reports: 'Reported for gastric irritation, and the combination with paracetamol (different mechanisms, additive analgesia) is widely and correctly recommended.',
  harm: 'Gastrointestinal bleeding and ulceration, especially with alcohol, corticosteroids or anticoagulants. Renal impairment with dehydration — a genuine risk at festivals and after MDMA. Raises cardiovascular risk with prolonged high-dose use. It competes with aspirin for the COX-1 site and can blunt aspirin\'s cardioprotective effect.'
},

aspirin: {
  what: 'Acetylsalicylic acid, an irreversible COX inhibitor. Because the inhibition of platelet COX-1 is irreversible and platelets cannot make new enzyme, a single low dose affects clotting for the platelet\'s whole 7–10 day lifespan.',
  looks: 'Tablets, dispersible and enteric-coated.',
  reports: 'Reported for gastric irritation and for the bleeding effect.',
  harm: 'Never give to children or teenagers with a viral illness — Reye\'s syndrome is rare but often fatal. Gastrointestinal bleeding risk, worse with alcohol. Overdose causes a characteristic mixed acid-base disturbance with tinnitus, hyperventilation and, at high levels, cerebral and pulmonary oedema. The irreversible platelet effect lasts a week regardless of half-life.'
},

naproxen: {
  what: 'A longer-acting non-selective NSAID, dosed twice daily, with a relatively favourable cardiovascular profile among the class.',
  looks: 'Tablets, including enteric-coated.',
  reports: 'Reported as longer-lasting than ibuprofen with more gastric irritation.',
  harm: 'Same gastrointestinal, renal and bleeding risks as other NSAIDs, with a longer duration of effect. Take with food.'
},

diclofenac: {
  what: 'A potent NSAID with relatively more COX-2 selectivity, available orally and topically.',
  looks: 'Tablets, gel and suppositories.',
  reports: 'Reported as effective for inflammatory pain; topical use avoids most systemic effects.',
  harm: 'The NSAID with the clearest cardiovascular risk signal — comparable to the withdrawn COX-2 inhibitors — which has led to restrictions in several countries. Also hepatotoxic more often than other NSAIDs.'
},

omeprazole: {
  what: 'A proton pump inhibitor that irreversibly blocks gastric acid secretion. Its effect lasts far longer than its short half-life because the pumps must be replaced.',
  looks: 'Capsules and tablets.',
  reports: 'Reported for rebound acid hypersecretion on stopping, which makes it hard to come off and is genuine.',
  harm: 'Raising gastric pH reduces absorption of drugs requiring acid, and blocks the conversion of clorazepate to its active form. It inhibits CYP2C19, reducing clopidogrel activation — a clinically important interaction. Long-term use is associated with B12 and magnesium deficiency and increased fracture risk. Rebound hypersecretion on withdrawal means tapering.'
},

famotidine: {
  what: 'An H2 receptor antagonist that reduces gastric acid, with a much cleaner interaction profile than the older cimetidine.',
  looks: 'Tablets.',
  reports: 'Reported as faster-acting and less complete than a PPI.',
  harm: 'Raises gastric pH, which affects absorption of acid-dependent drugs. Unlike cimetidine it does not meaningfully inhibit CYP enzymes.'
},

loratadine: {
  what: 'A second-generation antihistamine that does not readily cross the blood-brain barrier, so it treats allergy without sedation. It is largely a prodrug for desloratadine.',
  looks: 'Tablets and syrup.',
  reports: 'Reported as non-sedating in most people, with a minority reporting drowsiness.',
  harm: 'CYP3A4 and CYP2D6 substrate; levels rise with inhibitors, and at high levels the non-sedating property is lost.'
},

cetirizine: {
  what: 'A second-generation antihistamine, the active metabolite of hydroxyzine, with slightly more sedation than loratadine but faster onset.',
  looks: 'Tablets and syrup.',
  reports: 'Reported as mildly sedating in a substantial minority. Withdrawal itching after prolonged daily use is reported and is a recognised phenomenon.',
  harm: 'Renally cleared with minimal metabolism, so few interactions. Prolonged daily use can produce severe rebound pruritus on stopping.'
},

guaifenesin: {
  what: 'An expectorant that thins respiratory secretions. Its relevance here is that it is the other ingredient in many DXM cough preparations.',
  looks: 'Tablets and syrup.',
  reports: 'Reported almost entirely in the context of DXM preparations, where large amounts cause severe nausea and vomiting.',
  harm: 'At the quantities present in a recreational DXM dose of a combination syrup it causes vomiting and, rarely, kidney stones. This is one reason single-ingredient DXM products matter.'
},

'bismuth-subsalicylate': {
  what: 'An antidiarrhoeal and antacid that releases both bismuth and salicylate. The salicylate portion is pharmacologically the same as aspirin.',
  looks: 'Pink liquid and chewable tablets.',
  reports: 'The black tongue and black stools are universally reported and are harmless bismuth sulfide.',
  harm: 'The salicylate content is real — it should be avoided in children with viral illness (Reye\'s syndrome) and adds to aspirin toxicity. Chronic high-dose use can cause bismuth encephalopathy.'
},

'vitamin-c': {
  what: 'Ascorbic acid, an essential vitamin and antioxidant. Its relevance in this context is urinary acidification and its widespread but largely unsupported use as a drug potentiator or protectant.',
  looks: 'Tablets, powder and effervescent tablets.',
  reports: 'Widely taken alongside MDMA as a supposed neuroprotectant. The evidence for this is weak, and the practice is best regarded as unproven rather than established.',
  harm: 'Large doses acidify urine, which speeds elimination of amphetamines and can shorten their effect — that interaction is real. Very high doses cause diarrhoea and, in susceptible people, kidney stones.'
},

'sodium-bicarbonate': {
  what: 'An antacid and systemic alkalinising agent. Its relevance here is urinary alkalinisation, which dramatically slows the excretion of amphetamines and other weak bases.',
  looks: 'Powder and tablets.',
  reports: 'Used deliberately to potentiate and prolong amphetamines, which it does. Also used in freebasing cocaine.',
  harm: 'Alkalinising urine can double or more the half-life of amphetamine, which turns a known dose into an unknown one and is a real cause of stimulant toxicity. Large quantities cause metabolic alkalosis and sodium overload, dangerous in heart or kidney disease.'
},

metamizole: {
  what: 'Dipyrone — a potent non-opioid analgesic and antipyretic, widely used in much of Europe, Latin America and Asia, and banned in the US, UK and several other countries because of agranulocytosis risk.',
  looks: 'Tablets, drops and ampoules; regional.',
  reports: 'Reported as an unusually effective non-opioid analgesic, particularly for colic, which is why it remains popular where it is available.',
  harm: 'Rare but potentially fatal agranulocytosis is the reason for the bans. Sudden fever, sore throat or mouth ulcers while taking it require an immediate blood count. Also causes hypotension when given intravenously too fast.'
},

nimesulide: {
  what: 'A COX-2-preferential NSAID used in parts of Europe, Asia and Latin America, restricted in several countries because of liver injury.',
  looks: 'Tablets and granules; regional.',
  reports: 'Reported as an effective analgesic; the hepatotoxicity concern is what dominates regulatory discussion.',
  harm: 'Serious hepatotoxicity led to withdrawal in several countries and to duration limits elsewhere. Standard NSAID gastrointestinal and renal risks apply.'
},

promethazine: {
  what: 'A first-generation phenothiazine antihistamine that is strongly sedating, antiemetic and antimuscarinic, with dopamine antagonism as well.',
  looks: 'Tablets, syrup and injection. The codeine-promethazine syrup combination is the basis of "lean".',
  reports: 'Very widely reported in combination with codeine as a recreational syrup, where the promethazine adds sedation to the opioid — a combination that is more dangerous than the opioid alone.',
  harm: 'Contraindicated under two years of age because of fatal respiratory depression. Intravenous administration causes severe tissue injury and gangrene, which is why the route is avoided. Additive respiratory depression with opioids. Anticholinergic and can cause dystonic reactions.'
},

domperidone: {
  what: 'A peripheral dopamine antagonist antiemetic and prokinetic that does not readily cross the blood-brain barrier, so it does not cause the movement disorders metoclopramide does.',
  looks: 'Tablets and suspension; not approved in the US.',
  reports: 'Reported as effective for nausea without the restlessness of metoclopramide.',
  harm: 'Prolongs the QT interval and has caused sudden cardiac death, which led to dose and duration restrictions. Dangerous with CYP3A4 inhibitors, which raise its levels, and with other QT-prolonging drugs.'
},

metoclopramide: {
  what: 'A dopamine antagonist antiemetic and prokinetic that does cross into the brain, which is both why it works centrally and why it causes movement disorders.',
  looks: 'Tablets and injection.',
  reports: 'Reported for akathisia — an intense inner restlessness that people describe as one of the most distressing side effects of any common drug.',
  harm: 'Causes acute dystonic reactions, especially in young people, and tardive dyskinesia with prolonged use, which can be permanent. This is why treatment is limited to five days. Akathisia is common and frequently misread as anxiety.'
},

nefopam: {
  what: 'A non-opioid, non-NSAID analgesic that is a monoamine reuptake inhibitor with sodium and calcium channel effects. Used in parts of Europe.',
  looks: 'Tablets and injection; regional.',
  reports: 'Reported for sweating, nausea and tachycardia; the analgesia is real but the tolerability is mixed.',
  harm: 'Anticholinergic and proconvulsant — contraindicated in epilepsy. As a monoamine reuptake inhibitor it must not be combined with MAOIs, and it adds serotonergic risk.'
},

drotaverine: {
  what: 'A phosphodiesterase-4 inhibitor antispasmodic used for smooth muscle spasm, structurally related to papaverine. Common in Eastern Europe and South Asia.',
  looks: 'Tablets and ampoules; regional.',
  reports: 'Reported as effective for colic and menstrual cramps without anticholinergic side effects.',
  harm: 'Can cause hypotension, particularly by injection. Generally well tolerated.'
},

chlorphenamine: {
  what: 'A first-generation antihistamine that is also a serotonin reuptake inhibitor — an often-overlooked property with real consequences in combination products.',
  looks: 'Tablets and syrup; present in a great many cold and flu combination products.',
  reports: 'Reported as sedating. Its presence in DXM-containing cold preparations is a recurring harm-reduction warning.',
  harm: 'Its serotonin reuptake inhibition adds serotonergic risk to any combination, notably with DXM in cold preparations and with MAOIs. Anticholinergic and sedating, additive with other depressants.'
},

hydroxyzine: {
  what: 'A first-generation antihistamine used as an anxiolytic and for itching, and the parent compound of cetirizine. Its anxiolytic effect comes from H1 and 5-HT2A antagonism rather than from GABA, so it is not dependence-forming.',
  looks: 'Tablets, capsules and syrup.',
  reports: 'Reported as genuinely anxiolytic but heavily sedating, and as a non-dependence-forming alternative to benzodiazepines with correspondingly weaker effect.',
  harm: 'Prolongs the QT interval, which led to dose restrictions in Europe. Strongly anticholinergic and sedating; additive with other depressants. Its 5-HT2A antagonism means it will blunt psychedelics.'
},

/* ================= Metabolites ================= */

'6-mam': {
  what: '6-monoacetylmorphine, the first metabolite of heroin and itself a potent mu-agonist. It is the compound responsible for much of heroin\'s rapid onset, and its presence in a sample of blood or urine is the only way to prove heroin use specifically rather than morphine use.',
  looks: 'Not sold; formed within minutes of a heroin dose.',
  reports: 'Not reported separately from heroin.',
  harm: 'Its forensic significance is the main practical point: it has a very short window of detection, so its absence does not exclude heroin use.'
},

cotinine: {
  what: 'The main metabolite of nicotine, with a half-life of around 16 hours against nicotine\'s two. It is essentially inactive, and it is what nicotine tests actually measure.',
  looks: 'Not sold.',
  reports: 'Not reported subjectively.',
  harm: 'Its long half-life is why nicotine testing detects use over days rather than hours. CYP2A6 genotype governs how fast nicotine becomes cotinine and correlates with smoking behaviour.'
},

benzoylecgonine: {
  what: 'The principal inactive metabolite of cocaine and what cocaine drug tests detect. Its half-life is roughly six hours against cocaine\'s one, so it is detectable for two to four days.',
  looks: 'Not sold.',
  reports: 'Not psychoactive.',
  harm: 'Its long detection window relative to cocaine is the practically relevant fact.'
},

'salicylic-acid': {
  what: 'The active metabolite of aspirin and the compound responsible for most of its analgesic and anti-inflammatory effect, though not for the irreversible platelet inhibition, which is aspirin itself.',
  looks: 'Also used topically as a keratolytic.',
  reports: 'Not reported separately.',
  harm: 'Its elimination becomes saturable at high doses, which is why aspirin overdose is disproportionately dangerous — a small increase in dose produces a large increase in level.'
},

'4-hydroxyamphetamine': {
  what: 'A CYP2D6 metabolite of amphetamine that is itself weakly active, and a substrate for further conversion to 4-hydroxynorephedrine.',
  looks: 'Not sold.',
  reports: 'Not distinguished subjectively.',
  harm: 'Its formation depends on CYP2D6, which is part of why amphetamine response varies between people.'
},

norfluoxetine: {
  what: 'The active metabolite of fluoxetine, with a half-life of one to two weeks — several times the parent drug\'s. It is the reason fluoxetine needs a five-week washout before an MAOI.',
  looks: 'Not sold.',
  reports: 'Responsible for the reported absence of discontinuation symptoms with fluoxetine, since it self-tapers over weeks.',
  harm: 'Its very long persistence means fluoxetine\'s CYP2D6 inhibition continues for weeks after the last dose — codeine and tramadol remain blocked long after stopping.'
},

hydroxybupropion: {
  what: 'The main active metabolite of bupropion, formed by CYP2B6, present at higher concentrations than the parent drug and contributing substantially to its effects and to its side effects.',
  looks: 'Not sold.',
  reports: 'Not distinguished subjectively.',
  harm: 'CYP2B6 genotype and inducers change how much is formed. It is renally cleared and accumulates in kidney impairment.'
},

norclobazam: {
  what: 'N-desmethylclobazam, the long-lived active metabolite of clobazam, present at far higher concentrations than the parent and responsible for most of its effect.',
  looks: 'Not sold; also detected as a designer benzodiazepine.',
  reports: 'Not distinguished subjectively.',
  harm: 'Formation and clearance depend heavily on CYP2C19 — poor metabolisers accumulate several times as much, which changes both efficacy and sedation substantially. Cannabidiol raises its levels, a well-documented interaction in epilepsy treatment.'
},

nortilidine: {
  what: 'The active metabolite of tilidine and the compound responsible for its opioid effect. Tilidine itself is essentially inactive.',
  looks: 'Not sold.',
  reports: 'Not distinguished from tilidine.',
  harm: 'Because activity depends entirely on first-pass conversion, anything affecting liver metabolism changes the effective dose.'
},

dihydromorphine: {
  what: 'A semi-synthetic opioid closely related to morphine, and also a minor metabolite of dihydrocodeine. Somewhat more potent than morphine.',
  looks: 'Rarely encountered; regionally prescribed.',
  reports: 'Sparse.',
  harm: 'Full agonist with the usual respiratory risks.'
},

'thc-cooh': {
  what: '11-nor-9-carboxy-THC, the inactive terminal metabolite of THC and what cannabis drug tests measure. It is highly fat-soluble and is released slowly from adipose tissue, which is why heavy users test positive for weeks.',
  looks: 'Not sold.',
  reports: 'The long detection window is the near-universal practical concern in community discussions.',
  harm: 'Not psychoactive. Its slow release from fat means detection windows of a month or more in daily users, and that rapid weight loss can transiently raise levels.'
},

'4-anpp': {
  what: '4-anilino-N-phenethylpiperidine, both a precursor in fentanyl synthesis and a metabolite of it. Its presence in a sample is a strong indicator of illicitly manufactured rather than pharmaceutical fentanyl.',
  looks: 'Not sold as a product; found as an impurity.',
  reports: 'Not psychoactive in any meaningful way.',
  harm: 'Its forensic significance is the point: finding it indicates clandestine manufacture.'
},

'3-hydroxymorphinan': {
  what: 'A metabolite of dextromethorphan downstream of dextrorphan, formed by CYP3A4 demethylation. Weakly active.',
  looks: 'Not sold.',
  reports: 'Not distinguished subjectively.',
  harm: 'Part of the reason DXM kinetics depend on both CYP2D6 and CYP3A4.'
},

norephedrine: {
  what: 'Phenylpropanolamine — a metabolite of ephedrine and a sympathomimetic in its own right, formerly used as a decongestant and appetite suppressant and withdrawn from many markets.',
  looks: 'Formerly in cold preparations; largely withdrawn.',
  reports: 'Historical.',
  harm: 'Withdrawn after being associated with haemorrhagic stroke in young women, which is the reason it disappeared from over-the-counter products.'
},

/* ================= Inactive ingredients, fillers and excipients =================
   These are here because a tablet is mostly not the drug, and because people
   building solutions and reading certificates of analysis need to know what
   the other 95% of the mass is. Almost none of them are pharmacologically
   interesting; the ones that are — allergens, sulfites, parabens — say so. */

sucrose: {
  what: 'Table sugar, a disaccharide of glucose and fructose. Used as a bulking agent, sweetener and, in solutions, as a preservative through osmotic effect.',
  looks: 'White crystals or powder.',
  reports: 'None relevant.',
  harm: 'Pharmacologically inert at these quantities. In a solution it raises viscosity and provides a substrate for microbial growth unless the concentration is high enough to be self-preserving.'
},

lactose: {
  what: 'Milk sugar, the most common tablet filler in the world. Bulks out a milligram of active into something that can be pressed and handled.',
  looks: 'White powder.',
  reports: 'The relevant report is gastrointestinal: lactose-intolerant people can react to the filler in medications taken frequently, though the quantities are usually small.',
  harm: 'Inert except in lactose intolerance and, very rarely, in severe cow\'s-milk protein allergy where trace protein can matter.'
},

flour: {
  what: 'Milled wheat, used as a cutting agent and bulking filler. Not a pharmaceutical excipient — its appearance in a powder means someone diluted it.',
  looks: 'Off-white powder.',
  reports: 'Encountered as an adulterant.',
  harm: 'Contains gluten, which matters in coeliac disease. Never sterile, and absolutely must not be injected — insoluble particulate causes vascular occlusion and granuloma.'
},

chocolate: {
  what: 'Cacao product, containing theobromine and small amounts of caffeine. Used as a vehicle for edibles.',
  looks: 'Solid brown block or coating.',
  reports: 'Relevant mainly as an edible vehicle where fat content aids absorption of cannabinoids.',
  harm: 'The fat content genuinely increases absorption of fat-soluble actives, so a cannabis chocolate is not equivalent to the same dose in a gummy. Toxic to dogs.'
},

mcc: {
  what: 'Microcrystalline cellulose — purified, partially depolymerised cellulose, and the workhorse binder and filler of tablet manufacture.',
  looks: 'Fine white powder.',
  reports: 'None relevant.',
  harm: 'Inert orally and not absorbed. Must never be injected: insoluble cellulose particles lodge in pulmonary and retinal vessels, causing talc-like granulomatosis. This is a documented consequence of injecting crushed tablets.'
},

'citric-acid': {
  what: 'A weak organic acid used to adjust pH, as a preservative, and — relevantly — to convert freebase drugs into water-soluble salts for injection.',
  looks: 'White crystals or powder.',
  reports: 'Widely used to dissolve brown heroin for injection, where too much is a recognised cause of vein damage.',
  harm: 'Using more acid than needed lowers the pH of the injected solution sharply and damages veins, causing sclerosis and abscesses. Harm-reduction services supply pre-measured single-use citric or ascorbic sachets for exactly this reason. Lemon juice is a common substitute and carries a real risk of Candida endophthalmitis — it has blinded people.'
},

gelatin: {
  what: 'Collagen hydrolysate, used to make capsule shells and as a binder.',
  looks: 'Clear to translucent capsule shells; also powder.',
  reports: 'Relevant to people avoiding animal products.',
  harm: 'Animal-derived, which matters for dietary and religious reasons. Otherwise inert.'
},

'sodium-chloride': {
  what: 'Table salt, used as a tonicity adjuster in injectable and nasal preparations and as an excipient.',
  looks: 'White crystals.',
  reports: 'None relevant.',
  harm: 'Its purpose in an injectable solution is to make it isotonic; a solution that is not isotonic causes pain and tissue damage on injection.'
},

'dc-red-33': {
  what: 'A synthetic azo dye used to colour pharmaceuticals.',
  looks: 'Red-pink colouring.',
  reports: 'None relevant.',
  harm: 'Azo dyes cause hypersensitivity reactions in a small number of people, more commonly in those with aspirin sensitivity.'
},

'fdc-blue-1': {
  what: 'Brilliant Blue FCF, a triarylmethane dye used in pharmaceuticals and food.',
  looks: 'Bright blue colouring.',
  reports: 'None relevant.',
  harm: 'Generally inert; rare hypersensitivity. Absorbed poorly, which is why it colours stool.'
},

'fdc-blue-2-lake': {
  what: 'Indigo carmine aluminium lake, an insoluble pigment form used for coating tablets.',
  looks: 'Blue pigment.',
  reports: 'None relevant.',
  harm: 'Rare hypersensitivity reactions.'
},

'dc-yellow-10': {
  what: 'Quinoline Yellow, a synthetic dye used in pharmaceutical coatings.',
  looks: 'Yellow colouring.',
  reports: 'None relevant.',
  harm: 'Associated with hypersensitivity in a small minority; restricted in food use in some jurisdictions.'
},

'edetate-disodium': {
  what: 'Disodium EDTA, a chelating agent used to bind trace metal ions that would otherwise catalyse oxidation of the active ingredient.',
  looks: 'White powder.',
  reports: 'None relevant.',
  harm: 'At excipient quantities it is inert. As a therapeutic chelator at much higher doses it can cause dangerous hypocalcaemia.'
},

methylparaben: {
  what: 'A paraben preservative used in liquid and topical preparations to prevent microbial growth.',
  looks: 'White powder; present in solution.',
  reports: 'Parabens attract public concern out of proportion to the evidence at excipient concentrations.',
  harm: 'Contact allergy in a small number of people. The endocrine concerns relate to much higher exposures than pharmaceutical excipient use.'
},

propylparaben: {
  what: 'A paraben preservative, usually used alongside methylparaben because the pair covers a broader antimicrobial spectrum.',
  looks: 'White powder; present in solution.',
  reports: 'As methylparaben.',
  harm: 'Contact allergy in a small number of people.'
},

'sodium-benzoate': {
  what: 'A preservative effective only in acidic solutions, where it exists as benzoic acid.',
  looks: 'White powder.',
  reports: 'None relevant.',
  harm: 'Only works below about pH 4.5 — using it in a neutral solution provides no preservation at all, which matters if you are making something to keep. In the presence of ascorbic acid it can form trace benzene.'
},

'sodium-citrate': {
  what: 'The sodium salt of citric acid, used as a buffer to hold a solution at a target pH, and as an alternative acidifier for dissolving base drugs.',
  looks: 'White crystals.',
  reports: 'Used in harm-reduction supplies as a gentler alternative to citric acid for dissolving heroin.',
  harm: 'Buffering a solution is what stops its pH drifting; an unbuffered solution can become acidic enough to damage veins.'
},

'sodium-metabisulfite': {
  what: 'An antioxidant preservative used in injectable and liquid formulations, particularly those containing adrenaline or other oxidation-prone drugs.',
  looks: 'White powder; present in solution.',
  reports: 'A recognised trigger of asthma attacks in sulfite-sensitive people.',
  harm: 'Causes severe bronchospasm and anaphylactoid reactions in sulfite-sensitive asthmatics — this is a real and sometimes serious excipient reaction, not a theoretical one.'
},

'saccharin-sodium': {
  what: 'A synthetic sweetener used to mask bitterness in liquid formulations.',
  looks: 'White powder.',
  reports: 'None relevant.',
  harm: 'Inert at these quantities. The historical bladder-cancer concern was a rat-specific mechanism and has been withdrawn.'
},

'peach-flavor': {
  what: 'A flavouring blend used to mask the taste of a liquid preparation. Composition is proprietary and variable.',
  looks: 'Present in solution.',
  reports: 'None relevant.',
  harm: 'Composition is not disclosed, so allergen content cannot be assessed. Flavour blends contain solvents such as propylene glycol and ethanol.'
},

'raspberry-flavor': {
  what: 'A flavouring blend for masking taste; proprietary composition.',
  looks: 'Present in solution.',
  reports: 'None relevant.',
  harm: 'Undisclosed composition; may contain ethanol or propylene glycol as a carrier.'
},

'mint-flavor': {
  what: 'A flavouring blend, usually containing menthol, used to mask bitterness and to provide a cooling sensation.',
  looks: 'Present in solution.',
  reports: 'None relevant.',
  harm: 'Menthol can cause laryngospasm in infants and is an irritant at high concentration. Undisclosed carrier solvents.'
},

'corn-starch': {
  what: 'A tablet disintegrant and filler; the swelling of starch on contact with water is what breaks a tablet apart.',
  looks: 'White powder.',
  reports: 'None relevant.',
  harm: 'Inert orally. Never inject — insoluble particulate causes vascular occlusion.'
},

'magnesium-stearate': {
  what: 'A lubricant that stops tablet powder sticking to the press. Present in a very large fraction of all tablets, in tiny quantities.',
  looks: 'Fine white powder with a soapy feel.',
  reports: 'A perennial supplement-community concern, unsupported at the quantities involved.',
  harm: 'Inert at excipient quantities. It is hydrophobic, so excessive amounts can slow tablet dissolution — a formulation concern rather than a safety one.'
},

'silicon-dioxide': {
  what: 'Colloidal silica, a glidant that improves powder flow during manufacture.',
  looks: 'Extremely fine white powder.',
  reports: 'None relevant.',
  harm: 'Inert orally. Inhaling the dry powder is an irritant; do not aerosolise it.'
},

crospovidone: {
  what: 'A cross-linked polyvinylpyrrolidone superdisintegrant — it swells rapidly on contact with water and breaks the tablet apart.',
  looks: 'White powder.',
  reports: 'Relevant to injection harm: crospovidone particles are identifiable in the lungs at post-mortem in people who injected crushed tablets.',
  harm: 'Not absorbed orally. Injecting it causes pulmonary vascular granulomas and is directly documented as a cause of pulmonary hypertension in people who inject crushed tablets.'
},

'docusate-sodium': {
  what: 'A surfactant used both as a stool softener and as a wetting agent in formulations.',
  looks: 'White waxy solid or in solution.',
  reports: 'None relevant.',
  harm: 'As a surfactant it can increase absorption of other compounds across the gut wall, which is a real if usually minor interaction.'
},

'sodium-lauryl-sulfate': {
  what: 'An anionic surfactant used as a wetting agent to help poorly soluble drugs dissolve.',
  looks: 'White powder or flakes.',
  reports: 'Known as an oral mucosal irritant and a trigger for aphthous ulcers in susceptible people.',
  harm: 'Mucosal irritant. As a surfactant it can alter absorption of co-administered compounds.'
},

'hydroxypropyl-cellulose': {
  what: 'A cellulose ether used as a binder, film former and, in modified-release formulations, as the matrix that controls the release rate.',
  looks: 'White powder.',
  reports: 'None relevant.',
  harm: 'Inert orally. In a modified-release tablet it is the release mechanism — crushing the tablet destroys it and delivers the whole dose at once.'
},

hypromellose: {
  what: 'Hydroxypropyl methylcellulose (HPMC) — a cellulose ether used for capsule shells (the vegetarian alternative to gelatin), film coating, and as a modified-release matrix.',
  looks: 'White powder; clear capsule shells.',
  reports: 'None relevant.',
  harm: 'Inert orally. Where it forms a modified-release matrix, crushing or chewing defeats the release control and delivers the entire dose immediately — a common mechanism of accidental overdose with opioid formulations.'
},

});

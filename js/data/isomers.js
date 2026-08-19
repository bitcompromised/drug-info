/* Isomer information, attached to compounds already in the database.
   Stereochemistry and positional isomerism change potency, duration and
   sometimes the entire character of a drug — and in several cases here the
   difference is the difference between a medicine and a poison. */
(function () {
  'use strict';

  var ISOMERS = {

    amphetamine: {
      type: 'enantiomers',
      note: 'Racemic amphetamine is a 50:50 mix. The two enantiomers are genuinely different drugs: Adderall is deliberately 3:1 d:l, while Dexedrine is pure d-.',
      forms: [
        { name: 'Dextroamphetamine (d-, S-)', drugId: 'dextroamphetamine', share: 0.5, activity: 'primary',
          note: 'Roughly 3-4× the CNS potency of the l-isomer. Dominantly dopaminergic — this is where the euphoria and focus come from.' },
        { name: 'Levoamphetamine (l-, R-)', share: 0.5, activity: 'secondary',
          note: 'More peripherally noradrenergic. Contributes cardiovascular effects and a longer, flatter tail; some clinicians think it smooths the comedown.' }
      ]
    },

    methamphetamine: {
      type: 'enantiomers',
      note: 'The enantiomers of methamphetamine differ so much that one is a Schedule II drug of abuse and the other is sold over the counter in a nasal inhaler.',
      forms: [
        { name: 'd-Methamphetamine (S-)', share: 0.5, activity: 'primary',
          note: 'The recreational and illicit form. Potently dopaminergic and strongly CNS-active.' },
        { name: 'l-Methamphetamine (R-)', share: 0.5, activity: 'minor',
          note: 'Almost entirely peripheral — a vasoconstrictor with minimal euphoria. It is the active ingredient in Vicks inhalers, and it is why those can trigger a positive amphetamine drug screen.' }
      ]
    },

    ketamine: {
      type: 'enantiomers',
      note: 'Racemic ketamine is 50:50. The S-enantiomer is marketed separately as esketamine; the R-enantiomer is under investigation for depression in its own right.',
      forms: [
        { name: 'S-ketamine (esketamine)', drugId: 'esketamine', share: 0.5, activity: 'primary',
          note: 'Roughly 2× the NMDA affinity of the racemate and 3-4× that of R-ketamine. More potent anaesthetically, and reported as more dissociating and more prone to emergence agitation.' },
        { name: 'R-ketamine (arketamine)', share: 0.5, activity: 'secondary',
          note: 'Weaker at NMDA but, in animal work, longer-lasting antidepressant effects with fewer dissociative and psychotomimetic side effects. Under active investigation.' }
      ]
    },

    methadone: {
      type: 'enantiomers',
      note: 'A striking case where one enantiomer provides the analgesia and the other provides the cardiac risk.',
      forms: [
        { name: 'R-methadone (levomethadone)', share: 0.5, activity: 'primary',
          note: 'Carries essentially all the opioid activity — roughly 50× the mu affinity of the S-isomer. Sold separately as levomethadone in Germany.' },
        { name: 'S-methadone', share: 0.5, activity: 'harmful',
          note: 'Little opioid effect, but it is the enantiomer responsible for hERG channel blockade and QT prolongation. Levomethadone exists precisely to avoid it — and CYP2B6 slow metabolisers accumulate it preferentially.' }
      ]
    },

    thc: {
      type: 'double-bond',
      note: 'The "delta" number refers to where the double bond sits in the ring. Small changes in position produce meaningful differences in potency and legal status.',
      forms: [
        { name: 'Delta-9-THC', activity: 'primary', note: 'The natural, most potent and most heavily regulated form.' },
        { name: 'Delta-8-THC', drugId: 'delta-8-thc', activity: 'secondary',
          note: 'Roughly half to two-thirds the potency, reported as less anxiogenic. Made by isomerising CBD, which leaves reaction by-products.' },
        { name: 'Delta-10-THC', drugId: 'delta-10-thc', activity: 'minor',
          note: 'Weaker still and more stimulating. Also an isomerisation product rather than a natural constituent.' }
      ]
    },

    hhc: {
      type: 'epimers',
      note: 'HHC is manufactured as an inseparable mixture of two epimers with very different activity, and the ratio is not usually disclosed or tested.',
      forms: [
        { name: '9R-HHC', activity: 'primary', note: 'The active epimer, with CB1 affinity approaching delta-9-THC.' },
        { name: '9S-HHC', activity: 'minor',
          note: 'Substantially weaker at CB1. Because manufacturers do not control or report the ratio, batch potency varies unpredictably — the single biggest practical problem with HHC.' }
      ]
    },

    mdma: {
      type: 'enantiomers',
      note: 'Street MDMA is racemic. The enantiomers pull in different directions, and the mixture is what produces the characteristic effect.',
      forms: [
        { name: 'S-(+)-MDMA', share: 0.5, activity: 'primary',
          note: 'The more stimulating and more dopaminergic half; carries most of the psychostimulant and neurotoxic character.' },
        { name: 'R-(−)-MDMA', share: 0.5, activity: 'secondary',
          note: 'More serotonergic and entactogenic with less stimulation. It is the enantiomer thought to carry the empathogenic quality, and is being investigated separately for that reason.' }
      ]
    },

    mephedrone: {
      type: 'positional',
      note: 'The cathinones exist as a family of positional isomers that differ only in where the methyl group sits on the ring — and are frequently sold interchangeably.',
      forms: [
        { name: '4-MMC (mephedrone)', drugId: 'mephedrone', activity: 'primary',
          note: 'The most serotonergic and entactogenic of the three; the original.' },
        { name: '3-MMC', drugId: '3-mmc', activity: 'primary',
          note: 'More stimulant, less entactogenic. Became the common substitute after 4-MMC bans.' },
        { name: '2-MMC', drugId: '2-mmc', activity: 'secondary',
          note: 'The least characterised and reported as the harshest — more stimulant still with little warmth.' }
      ]
    },

    '2-fma': {
      type: 'positional',
      note: 'Fluorine position on the ring changes these compounds dramatically. This is the clearest case in the database where isomer identity is a safety matter, not a nuance.',
      forms: [
        { name: '2-FMA / 2-FA', drugId: '2-fa', activity: 'primary',
          note: 'Functional stimulants with no specific cardiovascular signal identified.' },
        { name: '4-FA / 4-FMA', drugId: '4-fa', activity: 'harmful',
          note: 'DANGEROUS. The Netherlands scheduled 4-FA after a cluster of haemorrhagic strokes and cardiac events in young, healthy users at ordinary doses. Do not generalise safety across fluorine positions.' },
        { name: '3-FA / 3-FMA', activity: 'secondary',
          note: 'Intermediate; more stimulating than 2-FA, less studied than either.' }
      ]
    },

    lsd: {
      type: 'diastereomers',
      note: 'LSD has four stereoisomers; only one is meaningfully active. Poor storage epimerises it into an inactive form, which is a genuine potency issue for old blotter.',
      forms: [
        { name: 'LSD (d-lysergic acid diethylamide, 5R,8R)', activity: 'primary',
          note: 'The only substantially active isomer.' },
        { name: 'iso-LSD (5R,8S)', activity: 'inactive',
          note: 'Forms when LSD degrades with heat, light or moisture. Inactive — so old or badly stored blotter is genuinely weaker, not just presumed to be.' },
        { name: 'l-LSD and l-iso-LSD', activity: 'inactive', note: 'Essentially inactive.' }
      ]
    },

    zopiclone: {
      type: 'enantiomers',
      note: 'Eszopiclone is simply the active half of zopiclone, marketed separately — a classic "chiral switch".',
      forms: [
        { name: 'S-zopiclone (eszopiclone)', drugId: 'eszopiclone', share: 0.5, activity: 'primary',
          note: 'Carries essentially all the hypnotic activity, with roughly 50× the receptor affinity of the R-isomer.' },
        { name: 'R-zopiclone', share: 0.5, activity: 'minor',
          note: 'Largely inert, but contributes to the characteristic bitter metallic aftertaste.' }
      ]
    },

    modafinil: {
      type: 'enantiomers',
      note: 'The two enantiomers have markedly different half-lives, which is the whole rationale for armodafinil.',
      forms: [
        { name: 'R-modafinil (armodafinil)', drugId: 'armodafinil', share: 0.5, activity: 'primary',
          note: 'Half-life ~15 h. Gives armodafinil its flatter, longer profile.' },
        { name: 'S-modafinil', share: 0.5, activity: 'secondary',
          note: 'Half-life only ~4 h. Its rapid clearance is why racemic modafinil declines biphasically — the early drop is this enantiomer leaving.' }
      ]
    },

    escitalopram: {
      type: 'enantiomers',
      note: 'Escitalopram is the active enantiomer of racemic citalopram; the R-isomer appears to actively interfere with it.',
      forms: [
        { name: 'S-citalopram (escitalopram)', drugId: 'escitalopram', share: 0.5, activity: 'primary',
          note: 'Carries essentially all the serotonin reuptake inhibition — roughly 100× the potency of R-citalopram.' },
        { name: 'R-citalopram', share: 0.5, activity: 'antagonistic',
          note: 'Not merely inert: evidence suggests it allosterically inhibits the S-enantiomer\'s binding, so racemic citalopram may be less than half as effective as an equivalent escitalopram dose.' }
      ]
    },

    tramadol: {
      type: 'enantiomers',
      note: 'Tramadol\'s dual mechanism is split between its enantiomers — one provides the opioid effect, the other the noradrenergic one.',
      forms: [
        { name: '(+)-Tramadol', share: 0.5, activity: 'primary',
          note: 'Preferentially converted to (+)-M1, the opioid-active metabolite, and inhibits serotonin reuptake.' },
        { name: '(−)-Tramadol', share: 0.5, activity: 'secondary',
          note: 'Mainly inhibits noradrenaline reuptake. The two act synergistically for analgesia — and jointly account for the seizure and serotonin syndrome risk.' }
      ]
    },

    ibuprofen: {
      type: 'enantiomers',
      note: 'An unusual case: the body converts the inactive enantiomer into the active one, so the racemate works nearly as well as pure S-ibuprofen.',
      forms: [
        { name: 'S-(+)-Ibuprofen (dexibuprofen)', share: 0.5, activity: 'primary',
          note: 'The COX-inhibiting enantiomer — essentially all anti-inflammatory activity.' },
        { name: 'R-(−)-Ibuprofen', share: 0.5, activity: 'prodrug',
          note: 'Inactive at COX, but roughly 60% is converted to the S-form in vivo by alpha-methylacyl-CoA racemase. Effectively a slow-release reservoir of the active drug.' }
      ]
    },

    methylphenidate: {
      type: 'enantiomers',
      note: 'Racemic methylphenidate is 50:50, but first-pass metabolism destroys one enantiomer almost completely.',
      forms: [
        { name: 'd-threo-methylphenidate (dexmethylphenidate)', share: 0.5, activity: 'primary',
          note: 'Carries essentially all the dopamine reuptake inhibition. Sold separately as Focalin at half the dose.' },
        { name: 'l-threo-methylphenidate', share: 0.5, activity: 'minor',
          note: 'Almost entirely destroyed on first pass, which is why oral bioavailability of the racemate looks so poor. It is preferentially converted to ethylphenidate when alcohol is present.' }
      ]
    },

    cathine: {
      type: 'diastereomers',
      note: 'The khat and ephedra alkaloids form a family of four stereoisomers with substantially different potencies and legal statuses.',
      forms: [
        { name: 'Cathine (d-norpseudoephedrine)', drugId: 'cathine', activity: 'primary',
          note: 'The scheduled, more active isomer.' },
        { name: 'Norephedrine (phenylpropanolamine)', activity: 'secondary',
          note: 'Withdrawn from many markets after being linked to haemorrhagic stroke in young women.' },
        { name: 'Ephedrine and pseudoephedrine', drugId: 'ephedrine', activity: 'primary',
          note: 'The N-methylated counterparts; ephedrine is the more CNS-active of that pair.' }
      ]
    }
  };

  /* ------------------------------------------------------------------------
     CAS registry numbers for the individual isomers.
     ------------------------------------------------------------------------
     Kept as a lookup keyed on form name rather than inline, so the isomer
     descriptions above stay readable, and so the same discipline used in
     identifiers.js applies here: a form appears below ONLY if its registry
     number is actually known.

     This matters more for isomers than for anything else in the database.
     The enantiomers of a drug share a molecular formula and are routinely
     described by the same trivial name, so the CAS number is often the only
     unambiguous way to say which one a supplier actually sent — and for
     several pairs here (S- vs R-methadone, 4-FA vs 2-FA) that distinction is
     the difference between a medicine and an injury.
     ------------------------------------------------------------------------ */
  var ISOMER_CAS = {
    'Dextroamphetamine (d-, S-)': '51-64-9',
    'Levoamphetamine (l-, R-)': '156-34-3',
    'd-Methamphetamine (S-)': '537-46-2',
    'l-Methamphetamine (R-)': '33817-09-3',
    'S-ketamine (esketamine)': '33795-24-3',
    'R-ketamine (arketamine)': '33795-23-2',
    'R-methadone (levomethadone)': '125-58-6',
    'S-methadone': '125-56-4',
    'Delta-9-THC': '1972-08-3',
    'Delta-8-THC': '5957-75-5',
    'd-threo-methylphenidate (dexmethylphenidate)': '40431-64-9',
    'S-(+)-Ibuprofen (dexibuprofen)': '51146-56-6',
    'R-(−)-Ibuprofen': '51146-57-7',
    'l-threo-methylphenidate': '40431-63-8',
    'S-modafinil': '112111-42-9',
    '2-MMC': '1246911-71-6',
    'S-(+)-MDMA': '66142-89-0',
    'R-(−)-MDMA': '66142-90-3',
    'LSD (d-lysergic acid diethylamide, 5R,8R)': '50-37-3',
    'iso-LSD (5R,8S)': '2385-87-4',
    'R-zopiclone': '138729-46-1',
    'Escitalopram (S-citalopram)': '128196-01-0',
    'R-citalopram': '128196-02-1',
    'Eszopiclone (S-zopiclone)': '138729-47-2',
    'Armodafinil (R-modafinil)': '112111-43-0',
    'Cathine (d-norpseudoephedrine)': '492-39-7',
    'Norephedrine (phenylpropanolamine)': '14838-15-4',
    'Ephedrine and pseudoephedrine': '299-42-3'
  };

  // Attach to whichever compounds are actually loaded.
  Object.keys(ISOMERS).forEach(function (id) {
    var d = DB.get(id);
    if (!d) return;
    d.isomers = ISOMERS[id];
    d.isomers.forms = d.isomers.forms || [];
    d.isomers.type = d.isomers.type || 'isomers';

    // An explicit `cas` on the form wins, then the lookup above. A third
    // fallback — inheriting from the compound a form links to — is applied at
    // render time instead, because this file loads BEFORE identifiers.js and
    // the linked compound has no registry number yet at this point.
    d.isomers.forms.forEach(function (f) {
      if (f.cas == null) f.cas = ISOMER_CAS[f.name] || null;
    });
  });
})();
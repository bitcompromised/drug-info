# drug-info

An offline dose log that models what is actually in your body right now — and what
it has turned into.

Open `index.html` in a browser. No build step, no install, no network requests, no
dependencies. Your log lives in that browser's `localStorage` and never leaves the
machine.

To serve it over HTTP instead:

```bash
node serve.js
```

> **Read this first.** Every number here is a population-level estimate, and many are
> extrapolated from structural analogues rather than measured in humans — each value is
> labelled with its confidence. Individual metabolism varies enormously; CYP2D6 genotype
> alone changes some half-lives roughly tenfold. This is a personal tracking and
> harm-reduction reference, **not medical advice and not a dosing authority**. An absent
> interaction warning means "not in this database", never "safe".

---

## What it actually does

Most dose trackers are a list with timestamps. This one runs a pharmacokinetic model
over that list, so it can answer questions a list cannot:

- **How much is left right now**, from a one-compartment absorption/elimination model
  rather than a guess.
- **What the drug became.** Every compound carries a metabolite cascade, integrated
  numerically, so you can see that heroin is gone within the hour while morphine and
  M6G are still climbing.
- **How today's drugs change each other's kinetics.** When one compound inhibits an
  enzyme another depends on, the half-life is recomputed and *the curves visibly change
  shape*. This is not a static warning list.
- **What the arithmetic really is** when you dissolve something and dose by volume.

Six tabs — **Now**, **Interactions**, **Solution**, **Substances**, **Patterns** and
**FAQ**. Logging is a modal opened from Now or from any substance page, and the timeline
lives inside Now, because "what is on board" and "what is on board over time" are one
question that used to be split across two screens.

Around them sits the shell: a command palette on <kbd>Ctrl</kbd>+<kbd>K</kbd> that
searches every compound, page and command from one field, a light and dark theme that the
charts and structure drawings follow, and the profile control — the two figures that
actually change the numbers on screen — in the application bar. See
[The shell](#the-shell).

---

## The first visit

A browser that has never loaded the app arrives to an example already in place: two doses of
methamphetamine, 20 mg a day ago and 10 mg an hour ago, opening on the timeline two days
wide with the doses combined.

The reason is that an empty app explains nothing. Every screen worth showing — the timeline,
the metabolite chain, the concentration readout, the interaction list — needs something
logged before it draws anything, so a first-time visitor met three blank tabs and a prompt to
type in what drugs they had taken. That is the wrong way round: it asks for trust before
showing anything worth trusting. Two doses of one substance, far enough apart to show a
redose stacking on an unfinished tail, demonstrate most of the model in one screen.

It is labelled as an example, in a notice above everything with its own clear button, because
nobody should mistake it for their own log. Clearing it leaves the app empty and **does not
bring it back** — the first-visit test is the absence of all three storage keys, not an empty
log, so emptying the log deliberately is not read as never having been here. Somebody who has
used the app before never sees it. The timeline framing is tied to the example still being
present rather than to the first render, so a refresh does not land on an empty-looking page
while the notice is still describing what was set up to look at.

## The shell

Everything that is not a tab. These exist because a 649-compound database behind a tab
and a search box is a lot of clicking, and because a page read at 3 a.m. and a page read
at a desk are not the same page.

### The command palette

<kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>/</kbd>) from anywhere. One field searching three
things at once, because someone who wants "fentanyl" and someone who wants "export my
log" both start by typing:

- **Compounds** — the same ranked search the Substances tab uses, showing class, family
  and half-life on each row.
- **Pages** — every tab, and the four pages inside Now.
- **Commands** — log a dose, open settings, switch theme, export the log as JSON or CSV.

Arrow keys move, <kbd>Enter</kbd> opens, <kbd>Shift</kbd>+<kbd>Enter</kbd> pins the
highlighted compound. With nothing typed it is a launcher: pinned compounds first, then
what you were last looking at, then everything the app can do.

### Pins and recents

A database this size is mostly not about any one reader. The handful that are get a star
— from the substance page, from the palette, or with <kbd>P</kbd> — and sit at the top of
the palette and in a strip above the substance list. Recently viewed compounds fill in
underneath, so getting back to something from five minutes ago is not a second search.

Both live in the same local preferences blob as everything else, and neither leaves the
browser.

### Themes

Three settings — match the system, dark, light — in the application bar and in the
settings panel. Every colour in the stylesheet resolves through a token, so the light
theme is a redefinition rather than a second stylesheet: the tinted families (red,
orange, amber, green, blue, violet) keep their hue and their meaning while the surface
and the foreground swap ends.

It reaches further than the chrome. The categorical series colours the timeline draws
with, and the element colours in the structure renderer, are read from custom properties
rather than baked into the JavaScript, so a chart in light mode is drawn in a palette
dark enough to read on white rather than the same pale blues turned invisible.

"Match the system" is a live setting, not a one-time read: the app follows the OS if it
flips at dusk while the page is open.

### Keyboard

<kbd>?</kbd> shows the full list. In brief: <kbd>1</kbd>–<kbd>6</kbd> switch tabs,
<kbd>N</kbd> logs a dose, <kbd>T</kbd> switches theme, <kbd>,</kbd> opens settings,
<kbd>P</kbd> pins the substance you are reading, and <kbd>Esc</kbd> closes whatever is
open — a modal first, then a substance page back to the list. Single-letter shortcuts are
ignored while you are typing in a field.

### Addresses

Every screen has one, in the hash: `#/now/timeline`, `#/interactions`,
`#/substances/benzo`, `#/substance/alprazolam`. That means a compound can be
bookmarked, linked to, and returned to with the browser's own Back button, and a refresh
lands where you were rather than wherever the app felt like starting.

The direction of the binding matters: `render()` is the only thing that knows what is on
screen, so it is the only thing that writes the address. A hash change the app did not
cause — Back, Forward, a pasted link — is read the other way, into the state. An address
that does not parse falls through to the default view instead of a blank screen.

The document title follows too (`Alprazolam — drug-info`), because a bookmark list of
eleven identical titles is not a bookmark list.

### On a phone

Below 700 px the tabs leave the top of the page and become a fixed bottom bar with icons,
which is both where a thumb already is and the only way to show all six at once — the
scrolling strip they replaced put Patterns and FAQ off the right-hand edge with nothing
to say they were there.

The icons are drawn rather than typed. The glyphs they replace (◐ ☾ ⌨ ⚗) render at
different weights and baselines across platforms and several fall back to a tofu box on
Windows, which is where this is mostly read.

### Printing

A substance page is reference material, and reference material gets printed and taken
somewhere. Printing drops the chrome, the controls and anything that only works by being
clicked, forces every collapsed section open — a printout of seven headings with nothing
under them is worse than no printout — keeps headings with what they introduce, and
switches to ink on white regardless of the theme on screen.

### Focus and assistive technology

Beyond the shortcuts listed above: a skip link ahead of everything else in the tab order, since ten
controls sit between the top of the page and the content on every screen. Modals behave
like dialogs — they take focus when they open, keep Tab inside themselves, name
themselves from their own heading, stop the page behind them scrolling, and hand focus
back to whatever opened them. `:focus-visible` rings are on every control, which matters
here because most of them are buttons with their border removed.

### Contextual help

Fifty answers about how the app works sat in a tab at the far end of the nav, read by nobody
who had a question about the screen in front of them. Each tab now carries a small `?` beside
its heading that opens the FAQ filtered to that tab's own group, with a way back to all fifty.
The FAQ itself has a strip of its groups across the top and an expand-all, for the reader who
would rather use the browser's own find-in-page.

### Saying the worst thing first

Two places where the interface was sorting correctly and presenting badly:

The **interaction checker** ranks pairs worst-first, which meant the most dangerous
combination in a list was rendered as row one of ten — same size, same weight, one line of
mechanism, and the explanation a click away. When anything reaches *dangerous* or *unsafe* it
now gets said out loud above the list, with the mechanism and what it actually does to
somebody. Caution and below do not: a page that shouts about everything is a page nobody reads
carefully.

The **solution calculator** rendered its mixture checks two different ways depending on which
branch of the tab you were in — and in one of them, one full-width box per check, each with
its own identical "Mixture check" heading. Three stacked boxes all called the same thing are
not three findings, they are one list that forgot it was a list. There is one panel now, worst
first, and "Alprazolam will not all dissolve" is no longer the third of three identical-looking
notes about freezing points.

### Confirmations and undo

Deleting a dose does not ask first. It deletes, then offers an undo in the toast that
follows, which is faster to reach than an OK button and does not stand between the reader
and the twenty rows they meant to clear. Form validation reports the same way — the
message appears without taking focus, and focus goes to the field that needs fixing.

## Use cases

### "I took something four hours ago. What's still in me?"

Open **Now** — it is the only screen you need for this. Each active dose becomes a card
showing the current effect level, estimated dose remaining, time to 50% and to ~97%
cleared, and the phase you are in. Below that, every interaction between the substances
currently on board, then the timeline, then your history.

Logging is the **+ New log** button at the top of the same tab, which opens a modal.

If a card says *"Half-life used: 17 h — adjusted ×2.1"*, something else you logged is
inhibiting the enzyme that clears it, and the model has already accounted for it.

### "Why do I still feel it? The half-life says it should be gone."

Open the **Timeline** subtab of Now. One chart carries every curve: each dose, and the
active metabolites it produces, with a tick on the axis for every dose. Curves still
climbing while the parent falls are the ones to look at:

| You took | Parent is gone | But this is still there |
|---|---|---|
| Heroin | minutes | 6-MAM, then morphine, then M6G still climbing |
| Diazepam | ~2 days | Nordazepam, **still rising on day three** |
| Ketazolam | ~2 hours | Diazepam → nordazepam — duration measured in *days* |
| Codeine | ~4 hours | Morphine — and how much depends on your CYP2D6 genotype |
| Caffeine | ~5 hours | Paraxanthine, doing most of the back half of the effect |

Click or drag anywhere on the chart to move the cursor to any moment, past or future.
The readout gives the plasma level **as a milligram figure as well as a percentage** —
"99.8 mg · 91% of a common caffeine dose peak" — because a percentage of a reference
dose you are not holding in your head is hard to act on.

**Parents and metabolites share one axis, and the Y axis has three settings.** They used
to be two stacked charts that could not be read against each other: the top one plotted
subjective effect while the bottom one scaled every metabolite to its *own* peak. That
second choice was the damaging one — it drew a 3% side route exactly as tall as the main
metabolite, so every curve peaked at the same height and none of the peaks meant
anything. On one shared amount axis a curve twice as high is twice as much material.

| Setting | What it plots | Good for |
|---|---|---|
| `effect` | Modelled subjective intensity, from onset/peak/duration windows | How something feels. Metabolite curves are **derived** and tagged as such — see below |
| `%` | Every curve as a share of **its own peak**, so each tops out at 100% | The default, and the readable one. Shape and timing: when something forms, when it tops out, how long it takes to clear — at any dose size |
| `mg` | Milligram-equivalents in the body, everything on one axis | Comparing quantities. A curve twice as high is twice as much material |

The two axes make deliberately different trades, and the UI says which you are looking
at. In `mg` a metabolite that is a twentieth of its parent draws as a twentieth — true,
and frequently unreadable. In `%` it is scaled to its own peak so the shape is legible,
which means its height can no longer be compared with the curve beside it; those curves
are tagged **own scale** in the legend and the caption spells it out.

What the old chart did was scale to each metabolite's own peak *without saying so*, on an
axis shared with the parent — so a 3% side route drew level with the main metabolite and
level with the parent, and no peak on the chart meant anything. Being explicit about the
scaling is the fix, not removing it.

The reference for `%` is each compound's **own peak**, not a common dose. A common dose is
a fine denominator for one dose and a poor one for five: five 100 mg doses of
methamphetamine against a 20 mg common dose reach about 985%, so a metabolite normalised
to its own peak topped out at 100% — a tenth of the parent — and vanished along the axis
despite having just been scaled to be legible.

Now the parent is divided by the most of it that is ever in the body across those doses
and each metabolite by its own maximum, so every curve reaches 100% and none is squashed.
That peak is sampled over the **whole course of the doses, not the visible window** —
otherwise panning to a quiet stretch would rescale a trace up to 100% and a dose long past
its peak would look like it was at it.

The trade is that heights are no longer comparable *between* curves, and a metabolite's
percentage is not a share of its parent. The legend reports the real milligrams either
way, every curve is tagged `% of own peak`, and the `mg` axis puts everything back on one
scale when quantities are the question.

**Metabolites appear on the effect axis too.** They have no effect envelope of their own —
nobody publishes an onset, peak and duration for α-hydroxyflualprazolam — but 339 of the
340 active metabolites do carry a potency relative to their parent. So each is drawn from
the amount present, converted to parent-equivalent milligrams by that potency, put through
the same square-root dose–response `PK.buildDoseCurve` already uses to turn dose into
intensity, and anchored so that a metabolite holding as much parent-equivalent material as
the parent held at *its* peak is drawn at the height the parent reached there.

The square root is not decoration: scaling linearly instead understates the metabolite by
exactly the compression the parent's own curve applies — on five stacked 100 mg doses of
methamphetamine, by a factor of five. The construction checks out where the answer is
known independently. On heroin, 6-MAM (4× heroin's potency) peaks **above** its parent,
82% against 51%, which is where most of heroin's effect actually comes from; codeine's
morphine reaches 37% against codeine's own 51%, as a prodrug should. Curves are tagged
`derived`, the caveat is stated in full under the chart, and a metabolite with no recorded
relative potency is left off this view rather than guessed at.

**Reading the chart is a hover, not a legend.** Hover anywhere on it, wait half a second,
and a readout appears at the pointer and follows it — the moment under the pointer, every
compound present at it, largest first:

| Axis | The readout shows |
|---|---|
| `mg` | milligrams in the body at that moment |
| `%` | that compound's share of its own peak |
| `effect` | its share of the combined effect of everything active — how much of what you are feeling is coming from each one |

It was a fixed legend under the chart, and on a busy log that was a dozen rows of text
pushing the cards off the screen — while answering for wherever the scrub cursor happened
to be parked rather than for wherever you were looking. As a tooltip it does both jobs
better: the chart can be read without moving the cursor, and the cards below still answer
for the cursor.

**The half-second dwell is deliberate.** Appearing instantly means it flashes up every time
the pointer crosses the chart on its way somewhere else; half a second is long enough that
only an intentional hover triggers it and short enough not to feel broken. It is suppressed
for touch, where a tooltip under a finger is hidden by the finger and the tap should scrub
instead.

Anything with nothing to report is left out rather than listed reading "—", and what
remains is sorted by the figure it is displaying. The build order — parents first, then by
share of the dose — still does its job upstream, where it decides which curves survive the
cap when there are more than the chart can carry. Colours are deliberately fixed: a swatch
that changed colour when one compound overtook another would make the chart unreadable.

**The controls sit above the chart**, over the thing they control rather than below it. The
cursor time is a heading-sized readout with how far it is from now beside it, and there is
a field to type a moment into — hunting for a particular minute with a slider a pixel at a
time is not a thing anyone should have to do. A time outside the visible window clamps to
its edge rather than silently doing nothing.

**The cards below lead with the concentration**, not the amount. Every published
threshold, therapeutic window and toxic level is written as a concentration, so a
milligram figure has to be divided by a volume before it can be compared with any of
them. The volume is *your* estimated plasma volume — see [Your profile as a model
input](#your-profile-as-a-model-input) — which is why two people who took the same dose
do not read the same number here.

Each card is deliberately narrow. What was taken and when, where it is in its arc, how
much has arrived, how much has gone, the concentration that works out to, and what it
has turned into:

```
Methamphetamine          1 dose   peak
last dose 3.1h: 30 mg
half-life — 13 h (adjusted ×1.3)
Absorbed                                    98%
  19.8 mg of 20.1 mg
Eliminated                                  11%
  2.29 mg of 20.1 mg
5.72 µg/mL
  plasma concentration · 17.5 mg in 3.1 L plasma
2 active metabolites present: Amphetamine, 4-Hydroxymethamphetamine
```

The two meters answer questions a bare percentage cannot. **Absorbed** runs against
everything the route puts into the body — what CROSSES the membrane, not what survives
the trip as the parent compound. **Eliminated** runs against that same total, because
what arrived is exactly what has to be cleared, and presystemic extraction counts: drug
the liver took on the way in is gone as the parent. Both name their two quantities
underneath, since "38%" of an unstated total is not an answer.

Using the surviving parent instead was wrong twice over. A gram of swallowed heroin
reported **20 mg absorbed** — the 2% that reaches the blood as heroin — when 350 mg of it
crosses the gut and essentially all of that goes on to be morphine. And it broke mass
balance on every ordinary oral dose, quietly: the presystemically extracted share is what
the metabolites are made of, but leaving it out of "absorbed" left it out of "eliminated"
while its products were still counted in full. A gram of oral diazepam could show 75 mg
of nordazepam and 45 mg of temazepam against 104 mg of parent eliminated — 120 mg of
products from 104 mg of precursor.

**A meter disappears once it is full**, on the same 99.5% rounding cut the cards use. A
bar pinned at 100% is not a readout, it is furniture: it says the same thing at every
moment for the rest of the card's life. So the Absorbed meter is gone by the time an
oral dose is in, and never appears at all for an injection — absorption is not a process
worth a meter for something delivered straight into a vein. The quantity is not lost with
it, because the meter beneath carries the same total on its own line.

**Active metabolites are cards in the same grid**, whenever the metabolite layer is on.
They used to have a section of their own below the substances, which put a wall between a
drug and the thing it turns into — and for the compounds where the metabolite *is* the
drug (heroin into morphine, gidazepam into desalkylgidazepam, codeine into morphine) it
filed the active compound under a footnote to the inactive one.

A metabolite card carries what a substance card carries, because at that point in the
chain it *is* the substance. Two things change: it says what made it, and **Absorbed**
becomes **Metabolized**, since nothing was absorbed — it appeared in the body already
inside it. The meter runs against everything these doses will ever produce of it.

**The grid is ordered by when each compound first became systemically present**, so a
chain reads top to bottom in the order it actually happened: the dose, then what it
became, then what that became. A gidazepam dose from yesterday and its desalkyl
metabolite sit above a diazepam injection from ten minutes ago, because that is the order
they arrived in.

**A card leaves the grid at the moment its own Eliminated meter would read 100%**, so
nothing sits there claiming to be finished. The meter rounds, so the cut is at 99.5% and
the highest figure a card can display is 99%. Half a percent of a dose is not nothing —
half a percent of 37 mg of desalkylgidazepam is 185 µg — and that is the honest trade,
against a card that otherwise stays for six more weeks getting asymptotically emptier.
The compound is still on its own page and still on the chart, neither of which has to
make this decision.

A parent leaving does **not** take its metabolites with it, which is the whole reason the
two are filtered separately. Two hours after swallowing heroin there is no heroin and
about five milligrams of morphine; the heroin card goes, the morphine card stays, and the
cleared dose is still walked for what it left behind. What a cleared dose does lose is its
place in the interaction list underneath — an interaction needs something to interact.

### "There are thirty curves on this chart and I can't read any of them."

With metabolites on, a busy day is thirty-odd curves and the chart draws the eighteen largest
of them in ten repeating colours. That is not a chart, it is a plaid.

Focus fixes it: one chip per substance on board, and picking one draws that substance and the
things it turned into — three to five lines instead of eighteen. It filters the doses rather
than the finished series, so the metabolite curves, the legend, the scrub cards and the hover
readout all follow from it without any of them needing to know it exists.

The note under an over-full chart carries both ways out of it rather than just reporting the
number: *"Showing the 18 largest of 34 curves. Focus on one substance or hide metabolites to
thin it out."*

### "I redosed. What did that actually do to the peak?"

Switch the timeline from **Separate** to **Combined**. Separate gives one curve per dose,
which is the honest default — each dose is its own event. Combined sums the doses of a
substance into one curve, so three 20 mg doses read as a single shape whose second climb
starts from a tail that had not finished falling.

The metabolite popup on each Currently-on-board card does the same thing: its parent line
is the sum of every dose still on board, with a tick per dose, so the chart and the table
above it are describing the same mixture rather than the first dose only.

### "The estimates assume someone who isn't me."

Open the **profile button in the header** (it reads something like `⚙ 180 lb · slow CYP`).
Two settings feed back into every estimate in the app:

- **Body mass** scales how much effect a given number of milligrams produces, against
  the ~70 kg adult the published dose ladders implicitly assume. Applied to the effect
  envelope only — the dose *tier* keeps reporting what the literature says, because that
  is a statement about the drug and not about you.
- **CYP metaboliser status** multiplies the half-life, using the same AUC-ratio maths the
  interaction engine uses for enzyme inhibition. It scales with how much of a compound's
  clearance actually runs through CYP, so diazepam (95% CYP-cleared) stretches ×2.6 on
  the slow setting while lorazepam, cleared by UGT, is left completely untouched.

Defaults are 180 lb, 6'0", slow metaboliser. There is a switch to turn the adjustments
off and see the raw population figures.

**The prodrug inversion is handled explicitly.** For most drugs slow metabolism means
more exposure. For codeine, tramadol, ketazolam and other prodrugs it means *less*,
because the enzyme is what creates the active compound. The model does not silently
apply a number pointing the wrong way — those pages say so in words.

### "Is this combination going to hurt me?"

Open **Interactions** and build the combination. You get a severity matrix plus
mechanism-level explanations from three layers:

1. **Documented pairs** (27) — specific combinations with known outcomes.
2. **Class rules** (21) — MAOI + releaser, opioid + depressant, serotonergic stacking.
3. **Enzyme rules** — computed, not listed. If one drug inhibits an enzyme the other
   depends on, you get a numeric exposure multiplier and a reshaped curve.

The third layer is the one that catches things a lookup table misses. Logging
fluoxetine alongside MDMA stretches the MDMA curve because CYP2D6 inhibition raises its
half-life from about 8 h to about 17 h — the real documented mechanism, computed from
the fraction of clearance that runs through that enzyme.

### "I can't dissolve it. Check my arithmetic anyway."

The Solution tab has a second mode: **Dry mix**, which drops the solvent entirely and works in
mass fractions. Cut 100 mg of alprazolam into 10 g of lactose and a weighed 100 mg portion
carries 990 µg — the same problem a solution solves, measured on a scale instead of in a
syringe.

It exists because volumetric dosing is not always available. Some compounds will not go into
anything you would put in your body, some people have a scale and no syringe, and a capsule
has to be filled with a powder whatever the arithmetic was done in.

**It is the weaker technique and the tab says so every time.** A liquid mixes itself; two
powders do not. They separate by particle size and density every time the jar is moved, so a
scoop from a poorly mixed batch can carry several times what the arithmetic says — and the
more dilute the mixture, the worse a clump of undiluted active is. Nothing computed from the
masses can detect that, so the warning is unconditional rather than threshold-triggered.

What it does check:

| | |
|---|---|
| **Dilution** | 1 part active to N parts everything else, by mass |
| **Scale error** | ±5 mg is realistic for a milligram scale, so a 20 mg portion is a ±25% operation — and the warning says what that is in milligrams of the actual active |
| **Per gram** | what a gram of the finished powder carries, which is the number to write on the jar |
| **No filler** | if there is no inactive in the mixture it is not a dilution, it is two actives weighed together, and it says so |
| **Overshoot** | a portion delivering more than three times a common dose usually means the filler is far too little |

Saved recipes carry the mode, because a dry mixture reloaded as a solution would silently
change what every per-dose figure meant. Recipes saved before the mode existed have no flag,
and a missing flag means what it always meant.

### "What is actually in this bottle?"

The contents of the mixture used to live entirely behind a "View ingredients (1)" button. The
reasoning was sound — the full per-ingredient figures are eight numbers apiece, and stacking
them inline turned the tab into a wall of boxes — but the conclusion went too far: what is in
the bottle is the one thing the page is about, and it was the one thing you could not see.

The amounts are listed where the mixture is being built, one line each, with the colour each
ingredient carries in the composition chart beside it. The eight derived figures stay behind a
button, now called "All figures".

The working mixture also survives a reload. It used to live only in memory, so a refresh — or
following a link and coming back — silently discarded a recipe someone had just weighed out
ingredient by ingredient. Saving a solution is a deliberate act of naming and filing something;
not losing your work is not the same thing and should not have to be asked for.

### "I'm dissolving this to dose it by volume. Check my arithmetic."

Open **Solution**. Arithmetic errors here are a recurring cause of overdose, so every
number is laid out in full.

Everything goes in through one box — actives, solvents and fillers alike, with the dose
volume set in the same place. There is no separate step for solvents and no
solvent-versus-substance split in what comes back out; that distinction is an
implementation detail of how the volume is derived, not something the person holding the
bottle cares about.

**Total volume includes the dissolved solids.** This is the correction that matters most:
850 ml water + 250 ml ethanol 95% + 400 ml vegetable glycerine + 1814 g sucrose is not
1500 ml. The sugar displaces about 1141 ml of its own, so the real answer is **2641 ml**
— and every concentration in the mixture depends on getting that right. The summary
shows the split (solvent volume + volume displaced by solids) so the correction is
visible rather than buried.

**Solution density is reported alongside the solvent blend density**, because they
diverge sharply once a lot of solid is dissolved — 1.276 g/ml against 1.037 for that
same mixture.

**Add by moles, not just by weight.** Pick a compound with a determinate formula and
`mol`, `mmol` and `µmol` appear as units, with a live conversion under the box
(`Caffeine · M = 194.19 g/mol (C8H10N4O2)`, and `0.25 mol` → `= 48.5 g`). The stored
recipe keeps the mass but remembers what you typed, so the row reads *"entered as
0.25 mol"*. Polymers and flavour blends have no molar mass and are simply not offered
the option, rather than being given a meaningless number.

**Freezing.** The summary estimates a freezing point from the ethanol and glycol content
plus a colligative term for the dissolved solids, and warns at three thresholds: freezes
at room temperature (DMSO above ~50%, at +19 °C), freezes in a fridge, or freezes only
in a freezer. This matters because a partly frozen solution is not uniform — the solvent
freezes first and leaves the drug concentrated in whatever is still liquid.

**Recrystallisation.** Per-compound solubility is tracked per solvent family, so the
calculator can tell you when something will not stay dissolved. The classic case: sucrose
dissolves at ~2000 mg/ml in water and ~10 mg/ml in ethanol, so a syrup that is perfectly
stable as an aqueous solution drops its sugar once enough spirit goes in. Past the
ceiling you get a hard warning; between 70% and 100% of it you get the more insidious
one — it stays dissolved while warm and crystallises as it cools.

You still get each ingredient's concentration in mg/ml, what one dose delivers, where
that lands on that substance's own dose ladder, the pharmacology of that amount, and
interactions across the mixture — plus checks for doses below syringe-readable volume,
immiscible blends that separate into layers, and anything containing methanol.

**Composition is a donut, by mass or by volume.** Mass is what a scale reads; volume is
what a syringe reads, and they are genuinely different pictures of the same bottle — a
dense active is a bigger share by mass than by volume, and a light solvent the reverse.
Which one is useful depends on whether you are weighing the recipe out or measuring doses
from it, so the section carries a switch rather than a title that quietly picks one for
you. By volume, dissolved solids count as the space they occupy, estimated from density.

Hovering a slice or a legend row reports three things at once: share of the whole
solution, the absolute figure in whichever basis is selected, and what a dose delivers of
it. Percentages scale their precision, because a potent active is a rounding error by
mass and still the entire point of the mixture — alprazolam in a 300 g syrup reads
`0.0064%`, not `0.0%`. Hovering an ingredient in the View-ingredients popup lights up its
slice.

**The ingredient list wraps instead of scrolling sideways.** It carries every derived
figure — total, % volume, % of mixture, % of active mass, concentration, per dose — and
eight columns of those in a table meant the popup was read by dragging it left and right,
with the concentration off the right edge. They are one block per ingredient now, with
the figures wrapping onto new lines, and nothing clipped: the line saying what a solvent
works out to in millilitres used to be truncated at two lines with an ellipsis, which hid
exactly the number it was there to report.

**Adding an ingredient does not close the form.** A mixture is several ingredients, and
closing after each one meant reopening, retyping into a fresh search box, and losing
track of what was already in. It reopens itself cleared and focused, carrying a running
list of what this sitting has added; "Done" is the way out.

**Reset** sits beside "Copy plain text" and puts the working mixture back to the default
100 g of water. It confirms first — a recipe is real work and the buttons around it are
harmless — and it leaves saved solutions alone.

The per-dose chart under it stays a bar chart deliberately: that one is a magnitude
comparison, and a pie of it would imply the doses sum to something meaningful.

**Ingredient entry is a popup.** Add ingredient, View ingredients and the dose volume are
one bare row at the top of the tab; the search and amount fields only exist while something
is actually being added. Building a mixture is a burst of activity followed by a long time
reading the result, and a form that lives on the page pushed the composition and the safety
checks below the fold for all of that second phase. Dose volume carries its own unit — ml,
µl, drops, tsp, tbsp, floz — and switching unit preserves the physical dose rather than
reinterpreting the number.

**Every per-ingredient figure lives in the View-ingredients popup**: what was entered, what
it works out as, total mass, share of mass, share of active mass, concentration, per-dose
amount and dose tier. Editing one from that list returns to the list. What is left on the
page itself is the mixture as a whole — one row of stat cards covering both what is in the
bottle (blend, volume, density, mass, freezing point, pH) and what a dose of it delivers,
each card carrying the derivation of its own number.

### "What's actually in this tablet besides the active?"

The database includes 29 excipients — the things listed under "inactive ingredients" on
a real label. Enter a tablet as it actually is and the calculator separates **% of mixture**
(everything in the container by mass, fillers and solvent included — the same figure as the
slice in the composition chart) from **% of active mass** (what determines
potency). A 20 mg alprazolam / 500 mg MCC blend is 4% active by mass and 100% active by
active mass.

Three of those excipients are not inert, and are flagged accordingly: **sodium
metabisulfite** triggers bronchospasm in 3-10% of asthmatics, **docusate sodium** is a
licensed laxative and an absorption enhancer, and **sodium lauryl sulfate** is the
standard positive control in skin-irritation testing.

The single most important excipient note in the database: **crushing a hypromellose
matrix tablet destroys its controlled release.** The polymer gel layer *is* the release
mechanism — break it and 12 or 24 hours of dose becomes immediately available. That has
killed people with sustained-release opioids.

### "Show me only what has actually been measured."

The substance list sorts three ways — A–Z, half-life, and data quality — and can be
narrowed to compounds whose half-life was measured in humans rather than estimated or
taken from a structural analogue. Sorting by half-life answers "what here is
short-acting"; sorting by data quality puts the compounds with real human data first,
which is the honest way to browse a database where most of the figures are extrapolated.

Both settings persist. A search keeps its own relevance order rather than being
re-sorted, because burying an exact match under an alphabetical list is not a feature.

### "Just tell me the dose and how long it lasts."

A substance page used to open with a name, three chips, a list of aliases and a CAS number —
and the five things somebody actually came for were spread across three sections, one of them
collapsed. They are one strip under the title now: common dose for the usual route, onset,
duration, half-life with its confidence, and how long until it is effectively clear. A
compound with no route — a metabolite, say — shows the two that still apply rather than
inventing the rest.

### "Tell me about this specific compound."

Open **Substances** and pick one. Compounds are split across seven pages — Opioids,
**Benzodiazepines**, Cannabinoids, Stimulants, Psychedelics, Metabolites and Other — with
the search box above them searching the whole database regardless of which page is
showing. Benzodiazepines got a page of their own because 66 of them were otherwise buried
in "Other" behind the antidepressants, and because they are the class with the most
designer analogues in circulation and the one people most often arrive here trying to
identify a pressed tablet from.

The page is ordered the way the questions actually come. **Safety warnings sit at the
very top**, directly under the standing disclaimer — everything that used to precede them
was reference material, and they were the only part that could stop someone doing
something irreversible. Then identity, then **Mechanism → Routes & dosing → Half-life &
elimination**, which are rendered flat and always visible rather than as dropdowns:
those three are why the page is open, and a collapsed dosing ladder is a dosing ladder
nobody reads. The reference material below them — Isomers, Tolerance, Metabolism,
Relative strength, Notable interactions — still collapses, and your open/closed
preference is remembered per section and carries across compounds.

**Three buttons sit on the identity line, to the right of the molecular formula:**
`N sources`, `image` and `info`. All three answer "what else is known about this exact
compound", and none is worth the vertical space of a permanent panel.

- **image** draws the skeletal structure. It is behind a button rather than on the page
  because a picture invites belief in a way a number does not, and this one is generated
  from a stored SMILES string with no stereochemistry — so it opens alongside the caveats
  that say so.
- **info** is the paragraph everything else on the page is not: what the compound is,
  what it physically looks like, what people who take it consistently report, and what
  reduces the harm for *this* compound specifically. All 642 compounds carry one.

The **Isomers** section lists a CAS number per individual isomer, not just for the parent
compound. Enantiomers share a molecular formula and usually a trivial name, so the
registry number is frequently the only unambiguous way to say which one you actually
have — and for pairs like S- versus R-methadone, that is the difference between the
analgesia and the QT prolongation. 31 of the 39 isomer forms carry one; the rest show
`CAS —` rather than a guess.

### "What does this compound actually look like?"

Substance pages draw a skeletal structure from a stored SMILES string — parsed, laid
out and rendered as SVG entirely offline by `js/structure.js`. Click it to enlarge and
see the SMILES it came from.

**196 compounds carry one.** The rest say "structure not recorded" rather than showing a
guess, for the same reason CAS numbers are left blank when unknown: a confidently drawn
wrong structure is worse than no structure, because a picture invites belief in a way a
number does not.

### Checks that run over the data

`node tools/check-data.js` reads the database the way the browser does and fails on
anything self-contradictory. Every check in it exists because it caught a real error —
none was added speculatively:

| Check | What it found |
|---|---|
| A→B where B→A | morphine carrying a CYP2D6 O-methylation to codeine, which is not a human pathway |
| Repeated enzyme rows | LSD drawing four separate CYP3A4 boxes for one enzyme |
| Same product twice in a row | THC's `8-beta-hydroxy-THC` beside `8β-Hydroxy-THC` |
| Same name written two ways | clobazam drawing 4-hydroxy-norclobazam as two boxes; three more in MDMA, mescaline and hydromorphone |
| A `from:` naming nothing the compound produces | clobazam's CYP2C19 step hanging detached from its own chain |
| Duplicate keys in one object literal | four solubility entries silently overwriting each other, and the CAS pass nearly wiping 84 formulas |
| A conjugate resolving to its unconjugated parent | 18 inactive glucuronides being coloured as active products |
| Half-life outside its own stated range | phenelzine at 11.6 h with a range of 1.5–4 h |
| Dose ladders that do not ascend | — clean |
| `SUBSTANCES.md` out of date | — the index is now checked, not just regenerated |
| A metabolite still present a year after one dose | 886 metabolites frozen past the integration horizon instead of decaying |

Errors exit non-zero so the tool can gate a commit; warnings are reported and do not fail,
because they mark places where the data is thin rather than wrong and this database is
deliberately thin in places. It currently reports **no errors and 64 warnings** — 51
pathways whose product is still a placeholder like "Hydroxylated metabolites", 11 products
that exist as compounds but are not on their parent's metabolite list, and a note that 81
metabolites have no pathway clearly producing them and fall back to a placeholder share.

The conjugate check produced a fix rather than just a report: `DB.matchMetabolite` now
refuses to resolve a name containing *glucuronide*, *sulfate* or *conjugate* to a
metabolite record lacking it, so "Psilocin-O-glucuronide" no longer falls back to psilocin
and inherit its activity.

The structure drawings are guarded the same way. `node tools/check-smiles.js` derives a molecular
formula from every SMILES and compares it against the formula recorded independently in
`identifiers.js`. The two come from different sources, so agreement is evidence and
disagreement means one of them is wrong. On its first run it caught nine genuine errors,
including a deschloroketamine that still had its chlorine and an MDPV formula that was a
carbon too heavy. 193 of 196 now agree; the two remaining differences are `NaCl` and
`NaHCO3` written in conventional inorganic notation against Hill order.

Geometry is produced by constraint relaxation — bond-length springs, a bond-angle term
acting on 1-3 distances, ring regularisation, and non-bonded repulsion — over a
depth-first seed. Ring perception reduces the cycle basis to smallest rings, which
matters more than it sounds: without it a benzodioxole is detected as its nine-membered
perimeter rather than the fused 6+5 it actually is, and every force then aims at a shape
the molecule does not have. Most compounds come out with bond lengths within a few
percent and ring angles within a degree or two of ideal.

**Bridged polycyclic cages are the exception.** Morphinans — morphine, heroin, codeine —
are genuinely three-dimensional, and flattening one into a plane distorts it no matter
what the layout does; those sit around 15 degrees off ideal ring angles. They are
recognisable but not publication-quality. Everything else in the database draws cleanly.

Depiction follows the usual skeletal conventions, with two deliberate departures. Terminal
methyls are written out as `H₃C` / `CH₃` rather than left as bare line-ends, and hydrogens
on heteroatoms are counted and shown, so a hydroxyl reads `OH` instead of a lone `O`.
Strict convention hides both, and hiding them made caffeine look like it was missing its
three N-methyls and made every alcohol look like an ether. Aromatic rings are
Kekulé-perceived into alternating single and double bonds — a benzene draws three doubles,
not six — with the second line of each ring double bond offset toward that ring's centre.

**Stereochemistry is still not drawn.** There are no wedge or hash bonds, so enantiomers look
identical. For several compounds here that difference is the whole story — S-methadone
carries the QT prolongation while R-methadone carries the analgesia — so the Isomers
section states it in words and gives a CAS number per individual isomer.

### "The route changes what it becomes"

A route does not only change how much of a compound arrives — sometimes it changes what
arrives. Swallowed heroin is the clean case: presystemic deacetylation is essentially
complete, so neither diacetylmorphine nor 6-MAM reach the circulation and what you have is
morphine. Drawing the parenteral pathway map on a page about an oral dose describes a
different drug.

So a route may declare its own `metabolism: { pathways, metabolites }`, which replaces the
compound-level block for doses taken that way. Routes that declare nothing keep using the
compound's, so nothing else in the database changed. Inhibition, induction,
pharmacogenetics and excretion are properties of the molecule rather than of how it was
taken, and are inherited rather than restated — only what the compound *becomes* varies.

That needed a second field, because bioavailability alone could not express it. Oral
heroin puts almost no heroin into the blood, yet still delivers most of the dose onward as
morphine; dropping `bioavailability` to its true near-zero would have taken the
metabolites down with it. `metabolisedFraction` carries how much is absorbed *and
metabolised* — 0.25 against a bioavailability of 0.02 — and defaults to `bioavailability`,
so every ordinary route behaves exactly as before.

The result, from one 40 mg dose:

| | oral | insufflated |
|---|---|---|
| Heroin in the body | 762 µg | — (gone in minutes) |
| 6-MAM | *not formed* | 2.19 mg |
| Morphine | 6.14 mg | 14.7 mg |
| M6G | 780 µg | 1.87 mg |

The Metabolism section grows a route tab where any route differs, and the timeline labels
carry the route so two doses taken at the same moment by different routes are told apart.

### "One enzyme, two different fates"

A metabolic pathway can fork. UGT2B7 acting on morphine produces M3G, which is inactive
at the opioid receptor, *and* M6G, which is roughly twice as potent as morphine itself.
Writing that as two UGT2B7 rows implies two independent pathways when there is only one,
so a pathway may declare several products, each with its own activity:

```js
{ enzyme: 'UGT2B7', reaction: 'Glucuronidation at the 3- and 6-positions', fraction: 0.65,
  products: [
    { name: 'Morphine-3-glucuronide (M3G)', fraction: 0.55, active: false },
    { name: 'Morphine-6-glucuronide (M6G)', fraction: 0.10, active: true }
  ]}
```

The diagram draws that as one enzyme node branching into two product boxes, coloured
independently. Single-product pathways are untouched and are normalised into the same
shape, so nothing in the data files had to change.

**Forks are now folded automatically**, so the whole database behaves the way morphine
was written by hand. Repeated rows for the same enzyme collapse into one node that
branches — LSD's four separate CYP3A4 rows drew four identical CYP3A4 boxes stacked down
the diagram, and the reader had to notice they were all the same enzyme and infer it.

**Nothing in the diagram is truncated.** Product names were cut at 28 characters, so
diazepam's `Nordazepam (desmethyldiazepam)` read as `Nordazepam (desmethyldiazep…` — a
picture whose job is to name the compound, declining to name it. Labels wrap to as many
lines as they need and the boxes grow to fit, breaking at spaces, hyphens and slashes so
chemical names split where a chemist would split them. Verified mechanically: across a
sample of 62 diagrams, no rendered label exceeds its box.

**"Show all" follows the chain.** By default the map stops at the compound's direct
metabolites, which is what most questions are about. Turned on, every product that is
itself metabolised becomes the source of the next column, until nothing further is
recorded — ketazolam runs four levels to oxazepam glucuronide. This is also where the
`from:` steps belong: LAAM's second demethylation and N-methylclonazepam's nitroreduction
used to hang off the parent with an "on <intermediate>" label because there was nowhere
else to put them, and now they hang off the intermediate itself. A compound reached by
more than one route is expanded once and marked `chain shown above` on its repeats, so
converging branches do not redraw the same tail three times.

What must *not* fold is a **sequential** step. CYP3A4 turning oxycodone into noroxycodone
and CYP3A4 turning oxymorphone into noroxymorphone are the same enzyme acting on different
substrates, and merging them would assert that oxycodone yields noroxymorphone directly.
Those rows declare `from: '<intermediate>'`, only rows agreeing on enzyme *and* substrate
merge, and the diagram and table label the box `on Oxymorphone` so the distinction is
visible rather than implied.

Folding also fixed a quiet arithmetic bug: the share of the dose was being read off the
merged row rather than the product, so a 50% route and a 12% one both reported 62%. Each
product now carries its own share.

**Conjugates collapse the other way.** Ninety-one entries ended their pathway list with a
row reading `Conjugates` — a placeholder, not a finding. It said a conjugation step
happens without saying what comes out of it, which is the half of the answer a toxicology
report is actually about.

Every one of them is now a named row standing for a derived list: the glucuronide of the
parent where it has a basic amine to conjugate, the glucuronide of each hydroxylated
metabolite the entry records, and sulfates where the metabolite looks phenolic and
sulfation is a major route for that class. That last gate matters — a ring-position
prefix is the signal for an aromatic hydroxyl, so `4-hydroxymethamphetamine` gets a
sulfate and fentanyl's aliphatic `hydroxyfentanyl` does not. **125 collapsed rows now
stand for 287 individually named conjugates**, each one click away.

The lists are derived rather than typed, and the popup says so: this is mechanical
chemistry, not a claim that every named conjugate has been individually reported.
Deriving beats typing because ninety-one hand-written lists would have been ninety-one
chances to omit one, and adding a hydroxy metabolite later would silently have left its
conjugate out. Where a specific conjugate *is* attested the entry names it as its own
product and the pass leaves it alone, and a conjugate that is not inactive is never
folded in: M6G is more potent than morphine and stays a product of its own. Two compounds
— cannabitriol and vinpocetine — have nothing recorded that could be conjugated, and
their rows say that rather than pretending otherwise.

**Everything in the diagram is clickable.** An enzyme node opens the same panel the
"Metabolised by" chips open — everything that enzyme handles, inhibits and induces, merged
across every enzyme named in the row when a reaction lists several. A product node opens
that metabolite's detail. The standalone Metabolites section is gone as a result: it
listed the same products a screen further down, and the detail now opens from the thing
you were already looking at.

### "When do I actually take this?"

Patterns can answer the most obvious pattern question there is now: a count of logged doses by
the hour of day, over the whole log, with the busiest hour named and highlighted. Deliberately
unsmoothed and deliberately hedged — it says when you *log*, which is not quite when you take
something, and an entry added the morning after lands in the morning.

### "Am I using this too often?"

Open **Patterns**: frequency, cumulative dose, days since last use, a modelled tolerance
index with cross-tolerance between compounds sharing a tolerance group, and minimum-
spacing status per substance.

---

## How the model works

### Plasma concentration

A one-compartment model with first-order absorption — the Bateman function:

```
C(t) = (F·D·ka)/(Vd·(ka − ke)) · (e^(−ke·t) − e^(−ka·t))
```

`ke` comes from the half-life (`ln2 / t½`). `ka` is solved numerically by bisection from
the reported time-to-peak, because `Tmax = ln(ka/ke)/(ka − ke)` has no closed form.

Curves are normalised to the peak of one *common* dose, so 100% means "the plasma level
of one typical dose of this substance" — comparable within a drug, not across drugs.

**Zero-order kinetics.** Alcohol and GHB saturate their clearance enzymes and are drawn
as a straight-line decline rather than an exponential one, because that is how they
actually clear. It is why doubling a GHB dose more than doubles both peak and duration.

### Absorption is modelled, not skipped

Every milligram figure comes from `curve.amountMgAt()` — the Bateman amount in the
central compartment. That sounds obvious and it was not what the app did: the figures used
to be derived from `fractionRemaining`, which returned 1 for the whole absorption phase.
A dose therefore read at its full absorbed weight the instant it was logged and sat flat
until t*max*. Oral methamphetamine reported **67 mg six seconds after swallowing, where
the real figure is 0.8 mg**, and every milligram curve stepped vertically at each dose
instead of rising. The Bateman function already had the right answer; nothing was asking
it.

Two quantities were being conflated, and they are now separate because they answer
different questions:

| | | |
|---|---|---|
| **Circulating** | `amountMgAt` | Rises through absorption, peaks at t*max*, then falls. What is actually in the blood doing something, and what every chart and mg readout plots |
| **Not yet eliminated** | `fractionRemaining` | Starts at 1 and falls monotonically. Counts the drug still waiting in the gut, because it has not been eliminated and it is going to arrive |

`fractionRemaining` was wrong on its own terms too — returning exactly 1 until t*max* says
no elimination happens during absorption, when it starts with the first molecule absorbed
and for a slow drug that phase runs for hours. It is now `e^(−ka·t) + (ka/(ka−ke))·(e^(−ke·t) − e^(−ka·t))`:
the unabsorbed remainder plus the central compartment.

Metabolite formation was never affected — it always integrated `fm · ke · A(t)` from the
Bateman amount, which is why the metabolite curves looked right while the parent's did not.

### Metabolites have to leave

The metabolite compartment is integrated numerically over a horizon, then interpolated.
Past the end of that horizon the code returned the last integrated value — for both the
running total *and* the amount present. That is right for the total, which legitimately
plateaus at everything ever formed, and wrong for the amount, which meant **a metabolite
stopped clearing the moment the integration ran out**. On a real eleven-day
methamphetamine log, amphetamine settled at 1.2 mg and was still sitting there a year
later while the parent had long gone.

Past the horizon the parent is effectively cleared, so nothing more is forming and the
metabolite decays at its own rate — `amt[end] · e^(−keM·(t − horizon))`. That is exact
rather than an approximation, and it makes the horizon's exact length stop mattering.
Reverting the fix makes `tools/check-data.js` report **886 errors**, which is the real
scale of it: nearly every metabolite in the database, not one compound's.

The same log exposed a second bug beside it. `mergedBreakdown` scans the summed curve to
find where it peaks, and the scan ran from the first dose for *one dose's* worth of
clearance. With doses spread over eleven days it found a 1.5 mg peak on day one and never
saw the real 3.5 mg peak on day eleven — so `relativeAt`, which exists to cap at 1,
reached 2.26, and the reported peak time was ten days out. The window now runs from the
first dose to the last one's clearance, with the step count scaled to the span so a long
history is not sampled more coarsely than a short one.

### Effect is modelled separately from concentration

Plasma level is a poor proxy for how a drug feels, so a separate effect envelope is
built from reported onset/peak/duration/after-effect windows. For several drugs these
genuinely diverge — LSD's effects outlast its plasma curve because of slow receptor
dissociation; cannabis stores in fat for weeks while the high lasts hours. Both curves
are plotted.

**A short-lived parent has no such story, and forcing one on it goes wrong twice.** Its
effect is simply how much of it is there. Published windows describe the EXPERIENCE,
which for a prodrug belongs to the products — every reference gives heroin three to five
hours, and heroin has a three-minute half-life — so the parent drew fifteen hours of
effect it was not responsible for. And the window is stretched by dose, sub-linearly,
which on a gram of intravenous heroin (67× a common dose) turned a sixteen-minute window
into seventy-two, of which the first seventeen minutes sat at maximum. The compound is
97% cleared at eighteen minutes. It was at full effect on 1.9% of the dose, and only
began to fall once there was nothing left of it.

A route can declare `effectFollowsAmount` instead, which takes the shape from the curve:

```
effect = √(amount ÷ peak amount of a common dose) × body-mass scaling,  capped at 2.5
```

the same square-root concentration–effect compression already used to derive the
metabolites' curves, so a parent and its products are built the same way. Normalising
against a COMMON dose rather than against this dose's own peak puts the dose into the
answer twice, and both times rightly: a bigger dose starts higher *and* stays above any
given level longer, because it has further to fall. Dose-duration scaling then comes out
for free, and comes out as kinetics rather than as a heuristic. Phases come from the same
curve, so the phase pill on a card and the curve underneath it cannot disagree.

| 1 g IV heroin | parent present | effect, before | effect, now |
|---|---|---|---|
| +3 min | 500 mg (peak) | 2.50 | 2.50 |
| +10 min | 179 mg | 2.50 | 2.50 |
| +20 min | 19.5 mg | **2.50** | 1.61 |
| +30 min | 2 mg | 2.33 | 0.51 |
| +60 min | 0 mg | 0.72 | 0.02 |

Heroin's own curve now falls with the drug while 6-MAM and morphine carry the felt
duration — at twenty-five minutes the parent is 11% of the combined effect and 6-MAM is
72%. Only heroin's four routes declare it. Everything else keeps the envelope, which
matters: for LSD and cannabis the effect genuinely does outlast the plasma curve and must
keep doing so.

One consequence had to be handled on the way. A dose whose parent clears in twenty
minutes was being dropped from the Now cards and from the timeline while the morphine it
became was still climbing — a filter that asks only about the parent takes the products
off the screen with it. Both filters now keep a dose for as long as anything it produced
is still active.

### Route-specific first-pass avoidance

Where a route delivers a dose decides whether the liver gets a shot at it before the rest
of the body does, and the model now says so per route:

| Route | Bypasses first pass | Why |
|---|---|---|
| IV, IM, subcutaneous | 100% | already in the systemic circulation |
| Smoked, vaporised, inhaled | 100% | alveoli drain to the pulmonary vein, which returns to the heart, not the portal vein |
| Insufflated / intranasal | 100% | nasal mucosa drains to the facial and ophthalmic veins |
| Transdermal | 100% | dermal capillaries |
| Sublingual, buccal | ~60–80% (70% used) | drains to the jugular, but some is always swallowed |
| Rectal | ~50–70% (60% used) | middle and inferior rectal veins go systemic; the superior one goes portal |
| Oral | 0% | the whole point of a first pass |

Hepatic extraction is derived once per compound from its own oral route — whatever an
oral dose lost, and was not simply unabsorbed, the liver and gut wall took — and every
other route is then back-calculated from its declared bioavailability and how much of it
dodges the liver. An entry can override either end (`hepaticExtraction` on the metabolism
block, `absorbedFraction` on a route) for the case where poor oral bioavailability is an
absorption problem rather than an extraction one.

This is not cosmetic, because **it decides where a dose's metabolites come from**. Two
thirds of an oral midazolam dose is not lost; it is turned into 1'-hydroxymidazolam on
the way in, and that metabolite is already there before any midazolam circulates. So the
first generation is fed by two sources that arrive at completely different times:

| | Formed at | Which is |
|---|---|---|
| **Presystemic** | the *absorption* rate, `fm · F_pre · D · ka · e^(−ka·t)` | what the liver took on the way in and never let through |
| **Systemic** | the parent's *elimination* rate, `fm · ke · A(t)` | what the body clears out of the circulation afterwards |

Modelling both as elimination-driven put the presystemic half hours late and understated
it. The difference is visible immediately — 10 mg of midazolam, mg present:

| | 5 min | 15 min | 1 h | 4 h |
|---|---|---|---|---|
| **oral** parent / 1'-OH | 0.95 / **1.39** | 2.10 / **3.00** | 2.85 / 3.53 | 1.28 / 0.97 |
| **intranasal** parent / 1'-OH | 3.02 / 0.04 | 4.49 / 0.19 | 3.88 / 0.70 | 1.69 / 0.77 |

Swallowed, there is more metabolite than parent from the first sample onwards. Sprayed up
the nose, the metabolite builds slowly out of systemic clearance and never overtakes.
That is the textbook picture, and it is what makes an intranasal dose need roughly half
the milligrams.

Swallowed heroin is the extreme case the split was built for: `bioavailability: 0.02`
with `metabolisedFraction: 0.25`, so the parent card reads **0 pg/mL** while the morphine
card reads **5 mg present**. That is the entire pharmacology of swallowing heroin, and
without the split, dropping the parent to its true near-zero level would have taken its
metabolites down with it.

### Metabolites, and the metabolites of metabolites

The metabolite compartment is integrated numerically from

```
dM/dt = fm · ke_parent · A_parent(t)  −  ke_metabolite · M(t)
```

so a metabolite forms in proportion to the parent's elimination and then clears at its
own rate. There is a closed form, but it assumes the parent is already fully absorbed;
integrating instead keeps the absorption phase correct, which matters for anything oral.

**The chain does not stop at the first generation.** That is right as far as it goes and
stops exactly where the interesting cases start. Methamphetamine's amphetamine is itself
metabolised, and so is *its* product; gidazepam is a prodrug, so the compound you
actually have is a second-generation product and everything below it was invisible:

```
Gidazepam        → Desalkylgidazepam → Hydroxy-desalkylgidazepam
Methamphetamine  → 4-Hydroxymethamphetamine
                 → Amphetamine → 4-Hydroxyamphetamine → 4-Hydroxynorephedrine
                               → Norephedrine         → 4-Hydroxynorephedrine
```

The whole tree is discovered and then integrated **in one forward pass**, because a
grandchild's peak depends on when its parent peaked, not on when the dose was taken.
Depth comes from each metabolite's *own* entry — diazepam's page does not have to know
that nordazepam becomes oxazepam, because nordazepam's page knows — which is the same
mechanism the pathway diagram already used. Cycle-guarded, depth-capped at 4 and
node-capped at 16.

Getting the shape right needed one thing from the data. A metabolism block lists every
product in one flat array, which is fine for a table and wrong for a chain: gidazepam's
list holds both desalkylgidazepam *and* hydroxy-desalkylgidazepam, though the second is
made from the first. The pathway row already said so with `from: 'Desalkylgidazepam'`, so
anything named as the product of a `from:` step is somebody else's child and the
recursion picks it up under the right parent. Methamphetamine needed the same annotation
added — 4-hydroxyamphetamine is what CYP2D6 does to the amphetamine that N-demethylation
already produced, not something made from methamphetamine directly.

Several routes converge on one compound, and the body has **one pool** of it. A diazepam
dose reaches oxazepam through nordazepam and through temazepam; the tree records both
relationships, and it should, but two cards headed "Oxazepam" would describe one substance
as two and each would hold half of what is really there. So the compartments sum into one
card and it names every precursor feeding it — *"from Nordazepam, Temazepam"*.

#### A chain written into a flat list double-counts

Summing those pools is only right if each route into them is a *separate* reaction. It is
not always, and following the chain is what exposed it. Heroin lists 6-MAM at 95% of the
dose and morphine at 90% — because the morphine is made **from** the 6-MAM. Follow the
chain and morphine forms once through 6-MAM and again straight off the parent, so 100 mg
of heroin reported **175 mg of morphine**. A dose cannot produce more of something than it
weighs.

The fix already existed and was simply not applied: `from:` names the substrate a step
acts on. What was missing is that most rows never declared it *while saying it in prose*,
in the reaction text, which is where the author had actually written it down:

```
"Deacetylation of 6-MAM"                 -> Morphine
"Hydroxylation of nordazepam"            -> Oxazepam
"Downstream glucuronidation of morphine" -> M3G / M6G
```

So a row whose reaction names another compound from the same block is attached to it, on
a whole-token match, never overriding a declared `from:`, and never pointing a row at its
own product. **The rows that are genuinely direct name nothing** — methylphenidate's
"De-esterification", cocaine's "Hydrolysis of the benzoyl ester" — and are left alone,
which matters, because those really are independent routes off the dose and really do sum.
A metabolite that no pathway row produces can carry `from` itself, which is how the
benzodiazepines that funnel through nordazepam say that their oxazepam is nordazepam's.

That took the compounds with a metabolite reachable two ways from **31 to 9**, and the
ones left are the genuine forks. `tools/check-data.js` reports the pattern now: over the
dose is an ERROR, since it is impossible; under it is a WARNING, since it is a judgement
call about whether a shallower step is a real reaction or a restatement of the net yield
of a deeper one.

One more thing had to stop merging. A metabolism block may stand a placeholder in for a
set of excretion products it does not enumerate — "Inactive conjugates", "Conjugates" —
and those are labels, not compounds. Gidazepam's inactive conjugates and
desalkylgidazepam's are different substances that happen to share a placeholder, and
merging them summed two unrelated pools into one row reporting more than either. Keyed by
their precursor as well as their name, they stay the separate things they are.

#### The products of a pool cannot add up to more than the pool

Formation fractions are written per pathway, from whatever the literature reported for
that step, and nothing ever made them add up. Forty-six routes declare direct products
summing past 1 — lisdexamfetamine and dimenhydrinate reach 2.0 — which the model took
literally and formed twice as much metabolite as there was parent to make it from.

Shares that overrun are read as relative yields and scaled to fit, which keeps their
proportions and their ordering and fixes only the impossible total. Summing to *less* than 1
is left alone: the remainder is the dose going down routes the entry does not enumerate,
which is normal and is a different claim entirely.

**What counts against the pool is a ROW, not a product** — and getting that wrong the first
time broke the compounds it was meant to protect. A row is one reaction, and one reaction can
put out several things at once. Two competing routes each take their own share of the parent;
a *cleavage* takes one share and emits two products from it. Lisdexamfetamine is hydrolysed
to dextroamphetamine **and** lysine — the molecule comes apart, both halves are 100% of the
dose — so summing products gave 2.0 and then halved both. Sucrose into glucose and fructose,
dimenhydrinate dissociating into its two components: same shape, same wrong answer.

The data already tells the two apart and nothing was reading it. A competing fork's products
sum to the row's own fraction — morphine's UGT2B7 row is 0.65, made of M3G at 0.55 and M6G at
0.10. A cleavage's do not. So the pool is charged once per row, and `check-data.js` uses the
same rule, because the guard stops the output being impossible and does not make the
underlying figures right.
#### The first pass can run more than one step

Presystemic conversion was treated as ending at the first product: the liver made it, and
it went into the circulation. That is right for most compounds — oral midazolam really
does deliver circulating 1'-hydroxymidazolam — and wrong wherever the chain keeps going
before the drug ever leaves the portal circulation.

Swallowed heroin is the case. It is deacetylated to 6-MAM and the 6-MAM is deacetylated to
morphine, both in the gut wall and liver, and what arrives is morphine. Stopping the
cascade at 6-MAM gave a swallowed gram about **94 mg of circulating 6-MAM** — a rush this
route cannot produce, and the single thing that separates swallowing heroin from injecting
it.

So the flux is tracked in two parts: what has been round the body, and what has not yet
left the first pass. A metabolite marked `presystemicTransient` passes the second straight
through without entering its compartment, and it lands in the first product that is not so
marked. Nothing is lost — a transient intermediate still counts everything that was ever
made of it, it just does not circulate as it — and the small share of the dose that DOES
reach the blood as the parent still makes its trace of the intermediate the ordinary way,
because that part never saw the liver first.

A gram of swallowed heroin, twenty minutes in:

| | formed | peak in circulation |
|---|---|---|
| Heroin | 350 mg crosses the gut | 7 mg |
| 6-MAM | 332 mg | **13 mg** |
| Morphine | 299 mg | **265 mg** |

The same gram injected peaks at 693 mg of 6-MAM against 603 mg of morphine. Same chain,
same figures, opposite shape — which is the whole pharmacology of the two routes.

#### Formation is driven by mass balance, not by a rate

A compartment forms its products out of whatever has left the one above it, and that
quantity never has to be integrated — what has left a pool is what went in minus what is
still there. For the dose itself both halves are analytic, and for every compartment
below it `formed − present` is exact by construction:

```
eliminated from the circulation = F·D·(1 − e^−ᵏᵃᵗ) − A(t)
taken on the way in             = F_pre·D·(1 − e^−ᵏᵃᵗ)
available to a metabolite's own products = formed − present
```

Driving formation from that instead of from rate × dt takes all the integration error out
of the inflow, which is where it was. The rate form was fine for a slow oral dose and
badly wrong for a fast one: a smoked dose absorbs inside a single step of a horizon
measured in days, so one coarse rectangle stood in for the whole absorption peak. Across
every route in the database, the number where formed metabolite mass exceeded eliminated
parent mass went from **168 to 5**, the worst case from **12.8× to 1.06×**, and past the
first hour there are none. Only each compartment's own decay is stepped now, bounded by
the shortest half-life in the tree.

Pathway shares are matched to metabolites by name, with scoring strict enough that
"Morphine-6-glucuronide" cannot claim the "Morphine" pathway's share, and a product in a
forked row is matched to its own share rather than to the row's total.

A mechanical check runs over the whole database for pathways that contradict each other —
A producing B while B produces A. It found one: morphine carried a CYP2D6 O-methylation
back to codeine, on the reasoning that codeine sometimes turns up in toxicology after
morphine use. That is not a human pathway; the codeine comes from trace contamination of
pharmaceutical morphine or from poppy seed. The row is gone. Where no pathway
clearly produces a metabolite, the share falls back to a placeholder and is marked `?`
rather than presented as data.

### Interactions change the curves

87 enzymes are tracked. When one drug inhibits an enzyme another depends on, exposure is
recomputed using the standard AUC-ratio relationship:

```
exposure ratio = 1 / (1 − fm · inhibition)
```

where `fm` is the fraction of clearance through that enzyme. A drug cleared 90% by one
enzyme is devastated when it is blocked; one cleared 10% by it barely notices. That
multiplier feeds straight back into the half-life, so the plotted curve reflects the
interaction rather than the textbook figure.

**Transporters** (P-gp, OCT1/2, MATE1, OAT3, BCRP, OATP, LAT1) are tracked separately
from enzymes on 31 compounds, because they often decide how much drug reaches the brain
rather than how fast it is destroyed. P-gp inhibitors can raise fentanyl's CNS
concentration without moving its plasma level at all, and loperamide is only safe
*because* P-gp pumps it back out.

**Pharmacogenetics** is recorded for 83 compounds where genotype changes a real
decision — CYP2D6 and codeine (ultra-rapid metabolisers have killed breastfed infants),
CYP2D6 and atomoxetine (~10× exposure in poor metabolisers, with a labelled dose
change), ALDH2 and alcohol (the flushing variant carried by ~40% of people of East Asian
descent, where heterozygotes carry the oesophageal cancer risk), CYP2C19 and clobazam,
CYP2B6 and methadone (the enantiomer that prolongs QT), HLA-B\*15:02 and carbamazepine.

### Your profile as a model input

Corrections you supply feed the model through machinery that already existed rather than
as bolted-on fudge factors:

```
CYP half-life factor = 1 / (1 − Σ fmₑ + Σ fmₑ · activityₑ)
```

the same AUC-ratio form used for enzyme induction, summed **per enzyme**. `activity` is
0.35 / 1.0 / 2.2 for slow / normal / fast, and a compound with no CYP clearance gets a
factor of exactly 1 and is untouched.

It used to be one setting applied across all CYP clearance at once, which the code itself
called the wrong shape: real genotypes affect one enzyme at a time, and the difference is
the difference between codeine and diazepam. Six enzymes are asked about separately —
CYP2D6, 2C19, 3A4, 2C9, 1A2, 2B6 — chosen because they are the ones that change a decision.
A row naming several enzymes splits its share between them rather than counting in full
against each.

| | all normal | 2D6 slow only | 2C19 slow only |
|---|---|---|---|
| Codeine (2D6 17%, 3A4 10%) | ×1.00 | **×1.12** | ×1.00 |
| Diazepam (2C19 56%, 3A4 39%) | ×1.00 | ×1.00 | **×1.57** |
| Lorazepam (UGT, no CYP) | ×1.00 | ×1.00 | ×1.00 |

The prodrug inversion is now per enzyme too: someone can be a slow 2D6 metaboliser and a
normal 3A4 one, and only the first inverts codeine. An existing profile holding a single
setting keeps working and means what it always meant — that setting, applied to everything.

Body mass scales the effect envelope by `70 kg / your mass`. Nothing here is dosed by
body surface area, so BSA is displayed and not used.

**Weight and height set the volume every concentration is divided by.** Boer's equation
gives lean body mass, which is the right starting point because blood lives in lean tissue
and adipose carries very little of it — so two people of the same weight and different body
composition genuinely do have different plasma volumes, and scaling by total weight would
miss that:

```
male     LBM = 0.407·kg + 0.267·cm − 19.2
female   LBM = 0.252·kg + 0.473·cm − 48.3

blood volume  = LBM × 90 mL/kg   (85 for women)
plasma volume = blood volume × (1 − haematocrit)
```

Checked against Nadler's equation, the standard clinical estimate, this lands within a
few percent across the range: 2.8 L for a 70 kg 178 cm man, 2.3 L for a 60 kg 165 cm
woman. Sex is asked for because Boer has separate coefficients and so does everything
built on it; **it is used for nothing else** — no half-life, no dose ladder, no effect
estimate — and *unspecified* averages the two rather than quietly assuming one, at a cost
of about 4% either way.

### Volume of distribution, and what a concentration can be compared with

Plasma volume is the wrong divisor for almost everything, and the app used it anyway. It
assumes the drug is dissolved in plasma and nowhere else; almost nothing is. **Oral
methamphetamine read 5.72 µg/mL where a laboratory reports tens of nanograms** — out by a
factor of a hundred.

The right divisor is the apparent volume of distribution: the volume the body behaves *as
if* the drug were dissolved in. It is not a real volume — it exceeds body volume for
anything that concentrates in tissue, which is exactly the point:

```
Vd(L) = vd(L/kg) × body mass        concentration = amount ÷ Vd(L)

ethanol   0.6 L/kg   really is dissolved in body water
diazepam  1.1 L/kg
THC        10 L/kg   mostly in fat, only visiting the blood
fluoxetine 30 L/kg
```

`js/data/kinetics.js` carries Vd for **56 compounds** and reported concentration bands for
**47**. A compound with no Vd falls back to plasma volume and the readout marks the result
an **upper bound**, because Vd exceeds plasma volume for everything here — saying "at most
this" is honest, silently swapping what the number means is not. A metabolite with no Vd of
its own borrows its parent's and says so: wrong by a factor of two or three, where falling
back to plasma volume is wrong by a hundred.

| 30 mg oral methamphetamine, 2 h in | before | now |
|---|---|---|
| Methamphetamine | 5.72 µg/mL | **57.8 ng/mL** (therapeutic range 20–60) |
| 4-Hydroxymethamphetamine | 469 ng/mL | **4.76 ng/mL** (borrowing meth's Vd) |

**Then the payoff: the figure can be compared with something.** Every published therapeutic
window and toxic level is a concentration, and the card now shows where yours sits —
therapeutic, toxic, or within the band reported in fatalities.

The bands are handled carefully because they are easy to misread. The top one is called
`fatal` in the sense of *seen in fatalities* and never "lethal dose": it is an observation
about a population, and for opioids and benzodiazepines tolerance moves it by more than the
width of the bands themselves — concentrations that kill a naive person are routine in
someone dependent, and someone dependent who stops for two weeks loses that. Post-mortem
figures are worse again, since opioids and tricyclics redistribute out of tissue after
death. So the display is a list rather than a gauge with a needle, every compound carries
its own caveat, and compounds whose bands would be actively misleading get none at all.

Two caveats still travel with every concentration. Haematocrit alone varies by a fifth
between healthy adults. And a modelled concentration is not a measurement.

### Cross-tolerance

`toleranceGroup` had been on every compound in this database from the beginning and
nothing ever read it. It was printed on the substance page and never computed with, so a
week of daily alprazolam followed by a diazepam dose reported **no diazepam tolerance at
all**. It is not zero; it is most of the way to full.

`PK.toleranceAt` already accepted a `crossFactor` per prior dose — the two halves were
simply never connected. Every dose in a compound's tolerance group now counts, weighted by
how far the adaptation actually transfers:

| group | transfer | why |
|---|---|---|
| `gaba` | 0.9 | benzodiazepines, alcohol, barbiturates and Z-drugs act at the same receptor complex — which is why a benzodiazepine treats alcohol withdrawal at all |
| `psychedelic-5ht2a` | 0.9 | near-complete and famously fast: LSD the day after psilocybin does very little |
| `opioid` | 0.85 | high but not total, and asymmetric in ways this does not model — incomplete cross-tolerance is why opioid rotation works, and why switching at an equianalgesic dose can overdose someone |
| `amphetamine` | 0.8 | substantial for the subjective effect, much less so for the cardiovascular load |
| unlisted | 0.7 | a group exists because somebody judged those compounds to share a mechanism; claiming the transfer is total or nil is a stronger claim than that judgement supports |

Doses are normalised to each compound's **own** common dose before they get here, so 1 mg
of alprazolam and 10 mg of diazepam both arrive as roughly one common dose and potency needs
no separate handling. A Patterns row showing "+ Alprazolam" is telling you where its
tolerance came from — attribution matters, because otherwise the figure will not reconcile
with the dose count beside it.

It still says nothing about the risks that do **not** tolerate alongside the subjective
effect. Respiratory depression and cardiovascular load are the two that kill people, and
neither fades the way the high does.

### Steady state

Everything else in the app answers "what is one dose doing". The Now tab's fourth page
answers the other question, and it is the one that catches people out: **take diazepam once
and it is a 43-hour compound; take it every night and the nordazepam is still climbing on
day ten.** Methadone kills people during induction for exactly this reason — the dose that
was fine on day one is the same dose on day four, and the concentration is not.

Give it a substance, route, dose and interval and it synthesises the schedule rather than
making you log fourteen future entries by hand, then reads the answer off the same curves
everything else uses: accumulation ratio, steady-state peak and trough, and how long the
schedule has to run before it is within a tenth of where it settles.

The simulated accumulation is quoted against the closed form for a one-compartment model,
`1/(1−e^(−ke·τ))`, because they should agree and a reader is entitled to check — 15 mg of
diazepam daily gives ×7.2 simulated against ×7.3 analytic. The horizon comes from the
longest-lived compound in the picture rather than from the parent, because the thing still
climbing is usually a metabolite, and the page says so outright when it is: *"Nordazepam has
a half-life of 3.3 d against Diazepam's 43 h… dose adjustments made in the first few days
are being made before the drug has finished arriving."*

It is a hypothetical and nothing is recorded. It assumes every dose is on time, that
kinetics stay linear at every dose — they do not for alcohol, GHB or MDMA, which saturate
their own clearance — and it does not model tolerance at all, so the effect of a steady dose
is overstated the longer the schedule runs.

### Relative potency

Two different things get called "potency", and conflating them is how people get hurt:

1. **Established equivalence scales** — morphine milligram equivalents, diazepam
   equivalents. Drawn as solid bars.
2. **Dose-ratio estimates** — for classes with no accepted standard, derived from the
   database's own dose ladders. Drawn as dashed outlines.

Potency here means **how few milligrams are needed**. It says nothing about how strong,
dangerous or desirable the effect is. Buprenorphine is ~30× morphine by this measure and
simultaneously has a *ceiling* on respiratory depression that morphine lacks.

### Units

Everything is stored in milligrams and displayed in whatever unit a person would
actually use, so no screen shows a number with a row of leading zeros. `0.075 mg`
displays as `75 µg`; LSD's common dose reads **75–150 µg**, carfentanil's **1–2 µg**.
Ranges pick one shared unit from the larger end.

---

## What's in the database

**649 compounds.** The header of the app computes this live from the data, so it is
never out of date.

| Class | Count |
|---|---|
| Metabolite | 231 |
| Depressant | 88 |
| Opioid (+ 2 antagonists) | 63 |
| Stimulant | 57 |
| Psychedelic | 51 |
| Cannabinoid | 27 |
| Dissociative | 27 |
| Inactive ingredient / excipient | 30 |
| OTC medicine | 22 |
| Other (nootropics, CYP modulators, misc.) | 20 |
| Antidepressant | 14 |
| Entactogen | 12 |
| Deliriant, antipsychotic, mood stabiliser, inhalant | 7 |

**Every active metabolite now has a page.** They were reachable only from inside their
parent's entry — a name in a table, a box in a diagram — but "what is
7-aminoclonazolam" is a question people arrive with, off a lab report or a forensic
result, about a compound they might not have known to look under.

Those 210 generated pages carry no dose ladder, no onset and duration and no route,
because none of that exists for something nobody administers directly, and the schema's
defaults would otherwise print fabricated numbers in the same styling as measured ones.
They carry no interaction tags either: an active opioid metabolite really is an opioid
agonist, but tagging it as one would generate findings nobody evaluated, listed beside
findings somebody did. Each page says both things plainly and links to the parent, where
the tags and the interactions are real.

Coverage is deliberately broad on the things that are actually in circulation: the full
nitazene family including the pyrrolidino series, fentanyl analogues from carfentanil to
ocfentanil, designer benzodiazepines, pyrovalerone cathinones, lysergamides, 2Cs, DOx
and NBOMes, semi-synthetic and full-agonist synthetic cannabinoids.

It also covers things that are hard to find documented anywhere: benzodiazepines
marketed in one country and unknown elsewhere (delorazepam in Italy, cinolazepam in
Austria, nimetazepam in Japan, ethyl loflazepate in France, cloxazolam in Brazil),
withdrawn compounds (tetrazepam, halazepam, ketazolam), and designer benzodiazepines
that are prodrugs of compounds already in the database (N-methylclonazepam and
cloniprazepam both convert to clonazepam).

### Chemical identifiers

**421 compounds carry a CAS registry number and 427 a molecular formula**, shown on each
substance page for cross-checking against PubChem or a certificate of analysis.

The registry numbers added most recently were each looked up against CAS Common
Chemistry, or against a Wikipedia chembox citing it, rather than inferred from a close
analogue. Where only a salt form is registered the salt is named beside the number —
`2749171-05-7 (hydrochloride)` — because a hydrochloride has both a different registry
number and a different mass per unit of active than the freebase, and quietly recording
one as the other is the exact error this file exists to prevent.

Thirteen compounds still have none, and that is deliberate. Plants and mixtures — khat,
kratom, grapefruit juice, the flavour blends — have no single registry number to record,
and a handful of very recent designer compounds (H4CBD, MXPr, N-desethyl isotonitazene,
isotonitazepyne, fluetonitazepyne) had no published number that could be confirmed.

Where a CAS number is not established, the field reads *"not recorded"* rather than
showing something plausible. A CAS number is a pointer, not a description — one wrong
digit silently designates a different chemical, which is worse than no number at all.
Formulas are more complete than CAS numbers because a formula can be read off a known
structure, while a registry number has to be looked up. **Verify against PubChem before
relying on any of these for procurement, analysis, or anything with legal consequences.**

### Data confidence

Every half-life and metabolism block is labelled:

| Label | Count | Meaning |
|---|---|---|
| `measured` | 350 | Human PK studies / clinical literature |
| `analogue` | 152 | No data for this compound — extrapolated from a close structural relative |
| `estimated` | 119 | Case reports, forensic casework, or limited published studies |
| `unknown` | 24 | No usable data; placeholder so the model still runs |
| `anecdotal` | 4 | User reports only, no published source. **Opinion, not evidence** |

The generated metabolite pages inherit the confidence of the parent record their figures
came from, and their half-life note says so in words: *"recorded on flualprazolam's
metabolite list rather than measured for this compound on its own."* Where the parent
records no half-life at all, the page shows the parent's as an explicit placeholder and
labels it `unknown`, which is most of what moved that bucket from 4 to 23.

The `analogue` share is high precisely *because* the research chemical coverage is broad
— those compounds genuinely have no human data, and the label says so rather than
hiding it. Every entry lists its sources, and pages whose figures came from a wiki or
from user reports carry an explicit banner.

A `community` tier also exists for harm-reduction wiki consensus ranges. No compound
currently uses it at the half-life level; where a *dose ladder* is community consensus
rather than clinical data, the ladder note says so directly.

**On the `anecdotal` tier:** it is applied to compounds whose only available numbers
come from user reports. It is **not** the product of a verified "three or more users
agreed" count — no Reddit threads were scraped or tallied. Treat it as "someone who took
this said so", which is exactly as much weight as it deserves.

### On scope, honestly

"All drugs publicly known including research chemicals" is tens of thousands of
compounds, and no complete public dataset exists — for most novel RCs no human
pharmacokinetic data has ever been generated, so a "complete" database would be mostly
fabrication. Several novel-opioid entries here exist primarily as reference and warning:
their dose ladders are extrapolated from receptor assays, not measured, and are labelled
accordingly.

The same rule governs the metabolism layer. Deep pharmacology is recorded where real
literature exists; research chemicals with no published metabolism are left marked
`analogue` or `unknown` rather than given invented pathways.

About 143 active metabolites still have no page of their own. These are almost entirely
trivial nor-analogues of research chemicals (Nor-3-CMC, Nor-4-MEC and the like) for
which no independent human data exists — writing pages for them would mean inventing
pharmacology, so they remain listed under their parent drug instead.

---

## Files

```
index.html            shell + script loading order
css/styles.css        design tokens (two palettes, one set of names) + components
js/db.js              schema, registry, lookup, enzyme index, identifiers
js/pk.js              Bateman model, ka solver, effect envelope, recursive metabolite
                      tree, presystemic/systemic formation split, tolerance
js/potency.js         equivalence scales + dose-ratio comparison
js/interactions.js    explicit pairs, tag rules, enzyme rules
js/charts.js          hand-rolled SVG (line, potency, pathway, pie, bar, stacked)
js/storage.js         localStorage log, import/export
js/profile.js         body mass, per-enzyme CYP metaboliser status, Boer plasma
                      volume and volume of distribution, fed back into the model
js/structure.js       SMILES parser, 2D layout and SVG structure renderer
js/solution.js        mixture maths + plain-text report
js/ui.js              the shell: theme, command palette, toasts, keyboard,
                      pins and recents. Knows nothing about pharmacokinetics;
                      app.js registers what the palette can do rather than the
                      palette knowing about app.js
js/app.js             UI
js/data/*.js          the substance database — one file per class, plus the
                      decorator files that run last and attach reference data:
                      (identifiers.js       = CAS/formula
                       solubility.js        = per-solvent mg/ml
                       kinetics.js          = volume of distribution and reported
                                              concentration bands
                       smiles.js            = structures
                       descriptions.js      = the prose behind the "info" button
                       metabolites-extra.js = the metabolites the class files left out
                       metabolite-pages.js  = generates a page per active metabolite
                       faq.js               = the FAQ content)
serve.js              optional static server
tools/gen-substances.js  regenerates SUBSTANCES.md from the database
tools/check-smiles.js    verifies every SMILES against its recorded formula
tools/check-data.js      consistency checks over the whole database
SUBSTANCES.md         full index of every compound, grouped by class
```

`SUBSTANCES.md` is generated, not hand-maintained — run `node tools/gen-substances.js`
after adding compounds. The counts in this README are the only hand-written ones left;
the app computes its own header live at startup.

Load order matters. `isomers.js`, `metabolism-detail.js` and `identifiers.js` load last
and decorate compounds that the class files have already registered.

### Adding a compound

Drop an entry into any file under `js/data/` and add the file to `index.html` if it is
new. The schema is documented at the top of `js/db.js`. Unspecified fields get sane
defaults, so a minimal entry needs only `id`, `name`, `class`, `halfLife` and one route.

Three optional layers can be attached afterwards without touching the class file:

- `DB.enrich({ id: {...} })` — deeper metabolism, transporters, pharmacogenetics.
  Additive: it appends pathways and fills gaps rather than replacing.
- `DB.identify({ id: { cas, formula } })` — chemical identifiers. Never overwrites a
  value already declared inline.
- `js/data/isomers.js` — stereochemistry, where it changes what the compound does.

---

## Limitations

- **Population averages.** Individual metabolism varies enormously, and the model has no
  way to know yours. CYP2D6 genotype alone changes some half-lives roughly tenfold.
- **Tolerance is a crude exponential-recovery illustration**, not a measurement.
- **The interaction engine covers documented pairs, pharmacodynamic classes and enzyme
  effects.** An absent warning means "not in this database", never "safe". Most
  combinations have never been studied, and novel compounds almost never have.
- **Metabolite bands on the timeline are derived from the model**, not from reported
  phase windows — nobody publishes "the come-up of M6G". They show where the modelled
  curve crosses fractions of its own peak.
- **Solvent blend properties are volume-weighted approximations.** Real mixed-solvent
  behaviour is not linear, and the output says so where it matters.
- **Your profile makes the estimates less wrong, not right.** Body mass is a crude linear
  scaling, and the metaboliser setting is applied across all CYP clearance at once rather
  than per-enzyme — real genotypes affect one enzyme at a time.
- **Solute volume uses crystal density** as a stand-in for apparent molar volume. Close for
  sugars, an overestimate for salts, which pull water in around their ions and shrink the
  solution.
- **The freezing estimate is coarse.** Measured ethanol and glycol curves are interpolated and
  a capped colligative term is added; real mixed-solvent behaviour is not that tidy.
- **Solubility figures are room-temperature.** Solubility rises steeply with heat, so
  something dissolved hot can sit far above its cold ceiling and look perfectly clear until
  it crystallises overnight.
- Not medical advice, not a dosing authority, not a substitute for a clinician or poison
  control.

---

## In an emergency

Call your local emergency number. **US Poison Control: 1-800-222-1222.**

Recovery position for anyone unconscious. Naloxone reverses opioid overdose only — it
does nothing for benzodiazepine, alcohol, stimulant or GHB overdose.

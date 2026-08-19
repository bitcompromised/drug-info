/* ==========================================================================
   metabolite-pages.js — a page for every active metabolite
   --------------------------------------------------------------------------
   Active metabolites were reachable only from inside their parent's page: a
   name in a table, a box in a pathway diagram. But "what is 7-aminoclonazolam"
   is a question people arrive with — off a lab report, off a forensic result,
   off a wiki — and the answer lived three clicks inside a compound they might
   not have known to look under.

   So every active metabolite that has no entry of its own gets one, generated
   from what the database already records about it: which compounds form it,
   how much of a dose takes that route, its half-life, and its potency relative
   to the parent.

   WHAT THIS FILE DOES NOT DO IS INVENT ANYTHING.

   These pages carry no dose ladder, no onset and duration, and no route
   information, because none of that exists for a compound nobody administers
   directly — and the defaults the schema would otherwise supply would be
   fabricated numbers wearing the same styling as measured ones. `formedInVivo`
   marks them so the UI says that plainly instead.

   They also carry no interaction tags. An active opioid metabolite really is
   an opioid agonist, but tagging it as one would generate interaction findings
   that nobody evaluated, presented in the same list as findings that somebody
   did. The page links to the parent, whose tags are real, and says so.

   Compounds that already have a proper hand-written entry — psilocin,
   cocaethylene, M6G, 6-MAM, nordazepam, norbuprenorphine and the rest — are
   skipped here and keep the entry they have.
   ========================================================================== */
(function () {
  'use strict';

  // Metabolite names are prose, and several carry a parenthesised synonym.
  // The id has to survive that, stay unique, and stay stable.
  function slug(name) {
    return 'met-' + String(name)
      .toLowerCase()
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/[α]/g, 'alpha').replace(/[β]/g, 'beta').replace(/[ω]/g, 'omega')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function bareName(name) {
    return String(name).replace(/\s*\(.*\)\s*$/, '').trim();
  }

  /* ---- collect every active metabolite that has no page of its own ---- */

  var found = Object.create(null);
  var order = [];

  DB.all().forEach(function (parent) {
    parent.metabolism.metabolites.forEach(function (met) {
      if (!met.active) return;
      var clean = bareName(met.name);
      var existing = DB.get(clean);
      // Already a compound in its own right, or the parent under another
      // name — either way it does not need a generated page.
      if (existing && existing.id !== parent.id) return;
      if (existing && existing.id === parent.id) return;

      var key = DB.norm(clean);
      if (!found[key]) { found[key] = { name: clean, parents: [], mets: [] }; order.push(found[key]); }
      found[key].parents.push(parent);
      found[key].mets.push(met);
    });
  });

  /* ---- build one entry each ---- */

  // Ids already in use: everything registered so far, plus every id this
  // pass has handed out.
  var taken = Object.create(null);
  DB.all().forEach(function (x) { taken[x.id] = 1; });

  var entries = order.map(function (g) {
    // Several parents can form the same metabolite with different recorded
    // figures. Take the fullest record rather than the first, and keep the
    // longest half-life — that is the one that governs how long it is around.
    var best = g.mets.reduce(function (a, b) {
      var score = function (m) {
        return (m.halfLifeH != null ? 2 : 0) + (m.potencyRel != null ? 2 : 0) + (m.note ? 1 : 0);
      };
      return score(b) > score(a) ? b : a;
    });
    var halfLifeH = g.mets.reduce(function (a, m) {
      return m.halfLifeH != null && m.halfLifeH > a ? m.halfLifeH : a;
    }, 0) || null;

    var parentNames = DB.uniq(g.parents.map(function (p) { return p.name; }));
    var primary = g.parents[0];

    // Which enzyme routes produce it, taken from the parents' own pathways
    // rather than asserted.
    var routes = [];
    g.parents.forEach(function (p) {
      p.metabolism.pathways.forEach(function (path) {
        (path.products || []).forEach(function (prod) {
          if (DB.norm(bareName(prod.name)) === DB.norm(g.name)) {
            routes.push(path.enzyme + ' (from ' + (path.from || p.name) + ')');
          }
        });
      });
    });
    routes = DB.uniq(routes);

    var potencyLine = best.potencyRel != null
      ? 'Reported at roughly ' + (best.potencyRel >= 1
          ? (Math.round(best.potencyRel * 10) / 10) + '×'
          : '1/' + (Math.round((1 / best.potencyRel) * 10) / 10) + '×') +
        ' the potency of ' + primary.name + '.'
      : 'Its potency relative to ' + primary.name + ' is not recorded here.';

    var outlasts = halfLifeH != null && halfLifeH > primary.halfLife.hours * 1.3;

    var mechanism =
      'An active metabolite of ' + parentNames.join(', ') + ', formed in the body rather than taken. ' +
      potencyLine +
      (routes.length ? ' Formed by ' + routes.join('; ') + '.' : '') +
      (outlasts
        ? ' Its half-life exceeds the parent’s, so it is still present after the parent compound has effectively gone — which is why effects, impairment and interaction risk outlast what the parent’s half-life predicts.'
        : '');

    // Two differently-written names can normalise to the same slug —
    // ketamine's 'Hydroxynorketamine' and esketamine's stereo-specific one,
    // for instance. Suffix the collision rather than registering a duplicate,
    // which DB.register would drop with a console warning.
    var id = slug(g.name), n = 2;
    while (taken[id]) { id = slug(g.name) + '-' + n; n++; }
    taken[id] = 1;

    return {
      id: id,
      name: g.name,
      aliases: [],
      class: 'Metabolite',
      family: 'Metabolite of ' + parentNames.slice(0, 3).join(', ') +
              (parentNames.length > 3 ? ' and ' + (parentNames.length - 3) + ' more' : ''),
      schedule: 'Formed in vivo; not administered directly',
      tags: ['metabolite', 'formed-in-vivo'],

      // The flag the UI reads to suppress the dosing section. Without it the
      // schema would supply default onset, duration and bioavailability
      // figures for a compound nobody takes.
      formedInVivo: true,
      parentIds: g.parents.map(function (p) { return p.id; }),

      mechanism: mechanism,

      halfLife: {
        hours: halfLifeH != null ? halfLifeH : primary.halfLife.hours,
        confidence: halfLifeH != null ? (primary.metabolism.confidence || 'estimated') : 'unknown',
        notes: halfLifeH != null
          ? 'Recorded on ' + primary.name + '’s metabolite list rather than measured for this compound on its own.'
          : 'No half-life is recorded for this metabolite, so the parent’s is shown as a placeholder. Treat it as a stand-in, not a figure.'
      },

      metabolism: {
        pathways: [],
        metabolites: [],
        substrateOf: [],
        excretion: null,
        confidence: 'unknown'
      },

      // Deliberately empty: no route is administered, so no route is listed.
      routes: {},

      warnings: [
        'This is a metabolite, not something taken directly — every figure on this page is drawn from ' +
        parentNames.join(', ') + '’s record rather than measured for this compound on its own.',
        'It carries no interaction tags, so the interaction checker will report nothing for it. That is a ' +
        'gap in this database, not a finding: its pharmacology is broadly the parent’s, and the parent’s ' +
        'page is where the interactions are recorded.'
      ].concat(outlasts
        ? ['Outlasts ' + primary.name + '. Effects and impairment persist longer than the parent half-life suggests.']
        : []),

      info: {
        what: mechanism,
        looks: 'Not applicable — it is formed inside the body and is not sold or handled as a substance. ' +
               'Where it appears is on a toxicology report.',
        harm: 'Nothing here is dosed. What matters practically is timing: an active metabolite that outlives ' +
              'its parent is why a drug can still be impairing you after you have decided it wore off, and why ' +
              'redosing "because it stopped working" stacks. ' + primary.name + '’s page carries the ' +
              'interactions and the safety notes that actually apply.'
      },

      refs: ['Derived from the metabolite record on ' + parentNames.join(', ') + '’s entry in this database.']
    };
  });

  DB.register(entries);
})();

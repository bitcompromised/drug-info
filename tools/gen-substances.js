/* ==========================================================================
   tools/gen-substances.js — regenerate SUBSTANCES.md from the database
   --------------------------------------------------------------------------
   The compound counts in the docs used to be maintained by hand, and drifted:
   the README simultaneously claimed 191, 230 and 379 compounds while the app
   itself computed the real number live at startup. This removes the hand step.

       node tools/gen-substances.js

   It loads db.js and every data file in the order index.html declares, inside
   a minimal fake `window`, then writes the index from what actually registered.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

// The data files are browser scripts that expect a global `window` and attach
// themselves to it. Give them one rather than rewriting them as modules.
const sandbox = { console, setTimeout, clearTimeout };
sandbox.window = sandbox;
sandbox.global = sandbox;
vm.createContext(sandbox);

// index.html is the single source of truth for load order — isomers.js,
// metabolism-detail.js and identifiers.js all decorate already-registered
// compounds, so reading the order from there keeps this honest.
const scripts = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
  .split('\n')
  .map(line => (line.match(/<script src="([^"]+)"/) || [])[1])
  .filter(Boolean)
  .filter(f => f === 'js/db.js' || f.startsWith('js/data/'));

scripts.forEach(rel => {
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { filename: rel });
});

const DB = sandbox.DB;
const quality = DB.qualityReport();
const ident = DB.identifierReport();
const b = quality.buckets;

/** Pack names onto lines of at most `width` characters, separated by " · ". */
function wrap(names, width) {
  const lines = [];
  let current = '';
  names.forEach(n => {
    const candidate = current ? current + ' · ' + n : n;
    if (candidate.length > width) { lines.push(current); current = n; }
    else { current = candidate; }
  });
  if (current) lines.push(current);
  return lines.join('\n');
}

let out = '# Substance index\n\n';
out += '**' + quality.total + ' compounds** — ' + b.measured + ' with measured pharmacokinetics, '
     + b.estimated + ' estimated, ' + b.analogue + ' extrapolated from an analogue, '
     + b.anecdotal + ' from user reports only, ' + b.unknown + ' with no usable data.\n\n';
out += ident.cas + ' carry a CAS registry number and ' + ident.formula + ' a molecular formula.\n\n';
out += 'Generated from the database itself — regenerate with `node tools/gen-substances.js`.\n';
out += 'Every name below is searchable in the app, along with its aliases, class, family\n';
out += 'and tags, so `opioids`, `benzos`, `nitazene` or `xanax` all work as queries.\n\n---\n';

const byClass = {};
DB.all().forEach(d => { (byClass[d.class] = byClass[d.class] || []).push(d.name); });

Object.keys(byClass).sort().forEach(cls => {
  const names = byClass[cls].sort((a, z) => a.localeCompare(z));
  out += '\n## ' + cls + ' (' + names.length + ')\n\n' + wrap(names, 92) + '\n';
});

fs.writeFileSync(path.join(ROOT, 'SUBSTANCES.md'), out);
console.log('SUBSTANCES.md — ' + quality.total + ' compounds across ' +
            Object.keys(byClass).length + ' classes');

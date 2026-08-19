/* ==========================================================================
   tools/check-smiles.js — verify every SMILES draws the molecule it claims to
   --------------------------------------------------------------------------
       node tools/check-smiles.js

   Derives a molecular formula from each stored SMILES string and compares it
   against the formula recorded in identifiers.js. The two are written from
   different sources, so agreement is real evidence and disagreement means one
   of them is wrong.

   This is the guard that makes structure drawing safe to ship. A wrong SMILES
   renders a confident, plausible picture of a DIFFERENT compound, which is far
   worse than no picture at all — and it is invisible to anyone who cannot read
   a skeletal formula. On its first run this caught nine genuine errors,
   including a deschloroketamine that still had its chlorine.

   Two known non-errors: NaCl and NaHCO3 are recorded in conventional inorganic
   notation while this derives Hill order (ClNa, CHNaO3). Same compound.
   ========================================================================== */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const sandbox = { console, setTimeout, clearTimeout };
sandbox.window = sandbox; sandbox.global = sandbox;
// Structure.js touches document only inside render(); parse/build do not.
sandbox.document = { createElementNS: () => ({ setAttribute(){}, appendChild(){} }) };
vm.createContext(sandbox);
const load = rel => vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { filename: rel });
fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').split('\n')
  .map(l => (l.match(/<script src="([^"]+)"/) || [])[1]).filter(Boolean)
  .filter(f => f === 'js/db.js' || f.startsWith('js/data/') || f === 'js/structure.js')
  .forEach(load);

const DB = sandbox.DB, Structure = sandbox.Structure;

// Implicit hydrogens by standard valence, so the derived formula is complete.
const VALENCE = { B:3, C:4, N:3, O:2, P:3, S:2, F:1, Cl:1, Br:1, I:1 };

function formulaOf(smiles) {
  const mol = Structure.parse(smiles);
  if (!mol) return null;
  const bondOrder = new Array(mol.atoms.length).fill(0);
  const aromaticNbrs = new Array(mol.atoms.length).fill(0);
  mol.bonds.forEach(b => {
    const o = b.aromatic ? 1.5 : b.order;
    bondOrder[b.a] += o; bondOrder[b.b] += o;
    if (b.aromatic) { aromaticNbrs[b.a]++; aromaticNbrs[b.b]++; }
  });
  const counts = {};
  const add = (el, n) => { counts[el] = (counts[el] || 0) + n; };
  mol.atoms.forEach(a => {
    add(a.el, 1);
    let h;
    if (a.hcount != null) h = a.hcount;               // bracket atom: explicit
    else {
      const v = VALENCE[a.el];
      if (v == null) h = 0;
      else {
        let used = bondOrder[a.idx];
        if (a.aromatic) used = Math.round(used + 0.01);  // aromatic bookkeeping
        h = Math.max(0, v + (a.charge || 0) - used);
      }
    }
    if (h > 0) add('H', h);
  });
  const order = ['C','H'].concat(Object.keys(counts).filter(e => e!=='C'&&e!=='H').sort());
  return order.filter(e => counts[e]).map(e => e + (counts[e] > 1 ? counts[e] : '')).join('');
}

let checked = 0, ok = 0, mismatch = [], unparsed = [];
DB.all().forEach(d => {
  if (!d.smiles) return;
  checked++;
  const derived = formulaOf(d.smiles);
  if (!derived) { unparsed.push(d.id); return; }
  if (!d.formula || !/^[A-Za-z0-9]+$/.test(d.formula)) return;
  if (derived === d.formula) ok++;
  else mismatch.push(`${d.id}: smiles=>${derived}  recorded=>${d.formula}`);
});
console.log(`SMILES entries: ${checked}`);
console.log(`formula matches recorded: ${ok}`);
console.log(`unparsed: ${unparsed.length}` + (unparsed.length ? ' -> ' + unparsed.join(', ') : ''));
console.log(`MISMATCHES: ${mismatch.length}`);
mismatch.forEach(m => console.log('  ' + m));

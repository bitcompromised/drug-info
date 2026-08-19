/* ==========================================================================
   structure.js — 2D chemical structure drawing from SMILES
   --------------------------------------------------------------------------
   Draws a skeletal structure for a compound, offline, with no dependencies.
   Three stages:

     1. PARSE    SMILES -> atoms and bonds
     2. LAYOUT   graph  -> 2D coordinates
     3. RENDER   coordinates -> SVG

   WHY THIS IS DONE FROM SMILES rather than from stored coordinates: coordinates
   for 400+ compounds would be an enormous hand-maintained dataset, and every
   one would be a chance to draw the wrong molecule. A SMILES string is short,
   checkable against PubChem in seconds, and wrong in ways that are visible
   rather than subtle.

   WHAT THIS IS NOT: a replacement for a real cheminformatics toolkit. There is
   no stereochemistry rendering — wedge and hash bonds are not drawn, so
   enantiomers look identical here. That is a real limitation and it is stated
   in the UI, because for several compounds in this database the enantiomers
   are pharmacologically different drugs. Read the Isomers section for that.

   Layout is a two-phase affair: a depth-first placement to get something
   roughly right, then constraint relaxation to regularise rings and push
   overlapping atoms apart. Pure DFS placement produces overlapping fused
   rings; pure force-direction produces unreadable tangles. Seeding the forces
   with a sane initial guess is what makes drug-sized molecules come out clean.
   ========================================================================== */
(function (global) {
  'use strict';

  var BOND_LEN = 1.0;

  // The organic subset can be written without brackets. Anything else needs
  // [ ], which the parser handles separately.
  var ORGANIC = ['Cl', 'Br', 'B', 'C', 'N', 'O', 'P', 'S', 'F', 'I'];
  var AROMATIC_LOWER = ['b', 'c', 'n', 'o', 'p', 's'];

  /* ======================================================================
     1. PARSE
     ====================================================================== */

  /**
   * SMILES -> { atoms:[{el, aromatic, charge, hcount, idx}], bonds:[{a,b,order,aromatic}] }
   * Returns null on anything it cannot parse, rather than a partial molecule —
   * half a structure drawn confidently is worse than none.
   */
  function parse(smiles) {
    if (!smiles || typeof smiles !== 'string') return null;
    var s = smiles.trim();
    if (!s) return null;

    var atoms = [], bonds = [];
    var ringOpen = {};        // ring-closure digit -> { atom, order }
    var stack = [];           // branch stack
    var prev = null;          // previous atom index
    var pendingBond = null;   // explicit bond symbol awaiting its atom
    var i = 0;

    function addBond(a, b, order, aromatic) {
      if (a == null || b == null || a === b) return;
      for (var k = 0; k < bonds.length; k++) {
        if ((bonds[k].a === a && bonds[k].b === b) || (bonds[k].a === b && bonds[k].b === a)) return;
      }
      bonds.push({ a: a, b: b, order: order || 1, aromatic: !!aromatic });
    }

    function pushAtom(el, aromatic, charge, hcount) {
      var idx = atoms.length;
      atoms.push({ el: el, aromatic: !!aromatic, charge: charge || 0,
                   hcount: hcount == null ? null : hcount, idx: idx });
      if (prev != null) {
        var order = pendingBond ? pendingBond.order : 1;
        var arom = pendingBond ? pendingBond.aromatic : (aromatic && atoms[prev].aromatic);
        addBond(prev, idx, order, arom);
      }
      pendingBond = null;
      prev = idx;
      return idx;
    }

    while (i < s.length) {
      var ch = s[i];

      // ---- branches ----
      if (ch === '(') { stack.push(prev); i++; continue; }
      if (ch === ')') {
        if (!stack.length) return null;
        prev = stack.pop(); i++; continue;
      }

      // ---- bond symbols ----
      if (ch === '-') { pendingBond = { order: 1, aromatic: false }; i++; continue; }
      if (ch === '=') { pendingBond = { order: 2, aromatic: false }; i++; continue; }
      if (ch === '#') { pendingBond = { order: 3, aromatic: false }; i++; continue; }
      if (ch === ':') { pendingBond = { order: 1, aromatic: true }; i++; continue; }
      // Directional bonds carry cis/trans information this renderer does not
      // draw; treat them as plain single bonds rather than failing.
      if (ch === '/' || ch === String.fromCharCode(92)) { pendingBond = { order: 1, aromatic: false }; i++; continue; }

      // ---- disconnected fragments (salts) ----
      if (ch === '.') { prev = null; pendingBond = null; i++; continue; }

      // ---- ring closures ----
      if (/[0-9]/.test(ch) || ch === '%') {
        var num;
        if (ch === '%') { num = s.substr(i + 1, 2); i += 3; }
        else { num = ch; i += 1; }
        if (ringOpen[num] != null) {
          var o = ringOpen[num];
          var order = pendingBond ? pendingBond.order : o.order;
          var arom = (pendingBond ? pendingBond.aromatic : false) ||
                     (atoms[o.atom].aromatic && atoms[prev] && atoms[prev].aromatic);
          addBond(o.atom, prev, order, arom);
          delete ringOpen[num];
        } else {
          ringOpen[num] = { atom: prev, order: pendingBond ? pendingBond.order : 1 };
        }
        pendingBond = null;
        continue;
      }

      // ---- bracket atoms: [nH], [N+], [C@@H], [Na+] ----
      if (ch === '[') {
        var close = s.indexOf(']', i);
        if (close < 0) return null;
        var inner = s.slice(i + 1, close);
        i = close + 1;

        // strip isotope digits, then read the element symbol
        var body = inner.replace(/^\d+/, '');
        var m = body.match(/^([A-Z][a-z]?|[a-z])/);
        if (!m) return null;
        var sym = m[1];
        var isArom = /^[a-z]$/.test(sym);
        var rest = body.slice(sym.length);

        var charge = 0;
        var cm = rest.match(/([+-])(\d*)/);
        if (cm) charge = (cm[1] === '+' ? 1 : -1) * (cm[2] ? parseInt(cm[2], 10) : 1);
        // A trailing run of + or - is also legal: [N++]
        var runs = rest.match(/\++|-+/);
        if (runs && !(cm && cm[2])) charge = runs[0][0] === '+' ? runs[0].length : -runs[0].length;

        var hm = rest.match(/H(\d*)/);
        var hcount = hm ? (hm[1] ? parseInt(hm[1], 10) : 1) : 0;

        pushAtom(isArom ? sym.toUpperCase() : sym, isArom, charge, hcount);
        continue;
      }

      // ---- organic subset ----
      var matched = null;
      for (var oi = 0; oi < ORGANIC.length; oi++) {
        if (s.substr(i, ORGANIC[oi].length) === ORGANIC[oi]) { matched = ORGANIC[oi]; break; }
      }
      if (matched) { pushAtom(matched, false, 0, null); i += matched.length; continue; }

      if (AROMATIC_LOWER.indexOf(ch) >= 0) {
        pushAtom(ch.toUpperCase(), true, 0, null); i += 1; continue;
      }

      return null;   // unrecognised token
    }

    if (!atoms.length) return null;
    if (Object.keys(ringOpen).length) return null;   // unclosed ring
    return { atoms: atoms, bonds: bonds };
  }

  /* ======================================================================
     2. LAYOUT
     ====================================================================== */

  /** Adjacency list. */
  function adjacency(mol) {
    var adj = mol.atoms.map(function () { return []; });
    mol.bonds.forEach(function (b, bi) {
      adj[b.a].push({ atom: b.b, bond: bi });
      adj[b.b].push({ atom: b.a, bond: bi });
    });
    return adj;
  }

  /**
   * Smallest set of rings, found by locating the fundamental cycle of every
   * non-tree edge in a spanning forest. Not a rigorous SSSR — it can return a
   * larger ring where a smaller one shares the same edges — but it is correct
   * for fused aromatic systems, which is what drug molecules are made of.
   */
  function findRings(mol, adj) {
    var parent = new Array(mol.atoms.length).fill(-1);
    var parentBond = new Array(mol.atoms.length).fill(-1);
    var depth = new Array(mol.atoms.length).fill(-1);
    var seenBond = {};
    var rings = [];

    for (var root = 0; root < mol.atoms.length; root++) {
      if (depth[root] >= 0) continue;
      depth[root] = 0;
      var queue = [root];
      while (queue.length) {
        var v = queue.shift();
        adj[v].forEach(function (e) {
          if (seenBond[e.bond]) return;
          if (depth[e.atom] < 0) {
            seenBond[e.bond] = 1;
            depth[e.atom] = depth[v] + 1;
            parent[e.atom] = v;
            parentBond[e.atom] = e.bond;
            queue.push(e.atom);
          } else {
            // Non-tree edge: walk both ends up to their meeting point.
            seenBond[e.bond] = 1;
            var pa = [v], pb = [e.atom];
            var x = v, y = e.atom;
            while (depth[x] > depth[y]) { x = parent[x]; pa.push(x); }
            while (depth[y] > depth[x]) { y = parent[y]; pb.push(y); }
            var guard = 0;
            while (x !== y && guard++ < 200) { x = parent[x]; y = parent[y]; pa.push(x); pb.push(y); }
            pb.pop();
            rings.push(pa.concat(pb.reverse()));
          }
        });
      }
    }
    return reduceRings(rings.filter(function (r) { return r.length >= 3 && r.length <= 12; }));
  }

  /* ---------- smallest-ring reduction --------------------------------------
     A cycle basis is not a set of smallest rings, and for fused systems the
     difference is glaring: the search returns *a* cycle through each non-tree
     edge, which for a benzodioxole is the nine-membered PERIMETER rather than
     the five-membered dioxole. Every downstream force then aims at the wrong
     geometry — MDMA came out with a nine-sided ring the molecule does not have.

     Two rings sharing a contiguous path can be XOR-ed on their edge sets to
     yield the third, smaller ring of the system. Doing that repeatedly, always
     keeping the smaller result, walks the basis down toward the smallest set.
     ------------------------------------------------------------------------ */

  function edgeKey(a, b) { return a < b ? a + ':' + b : b + ':' + a; }

  function ringToEdges(ring) {
    var s = {};
    for (var i = 0; i < ring.length; i++) {
      var a = ring[i], b = ring[(i + 1) % ring.length];
      s[edgeKey(a, b)] = [a, b];
    }
    return s;
  }

  /** Ordered atom cycle from an edge set, or null if it is not a single cycle. */
  function edgesToCycle(edges) {
    var adj = {};
    Object.keys(edges).forEach(function (k) {
      var e = edges[k];
      (adj[e[0]] = adj[e[0]] || []).push(e[1]);
      (adj[e[1]] = adj[e[1]] || []).push(e[0]);
    });
    var verts = Object.keys(adj).map(Number);
    if (verts.length < 3) return null;
    // A single closed cycle means every vertex has exactly two neighbours.
    for (var i = 0; i < verts.length; i++) if (adj[verts[i]].length !== 2) return null;

    var start = verts[0], cycle = [start], prev = null, cur = start;
    for (var guard = 0; guard < verts.length + 1; guard++) {
      var nbrs = adj[cur];
      var next = (nbrs[0] === prev) ? nbrs[1] : nbrs[0];
      if (next === start) break;
      cycle.push(next);
      prev = cur; cur = next;
    }
    return cycle.length === verts.length ? cycle : null;
  }

  function reduceRings(rings) {
    var sets = rings.map(ringToEdges);
    var changed = true, guard = 0;
    while (changed && guard++ < 25) {
      changed = false;
      for (var i = 0; i < sets.length; i++) {
        for (var j = 0; j < sets.length; j++) {
          if (i === j) continue;
          var xor = {}, k;
          for (k in sets[i]) xor[k] = sets[i][k];
          for (k in sets[j]) { if (xor[k]) delete xor[k]; else xor[k] = sets[j][k]; }
          var n = Object.keys(xor).length;
          if (n < 3) continue;
          var ni = Object.keys(sets[i]).length, nj = Object.keys(sets[j]).length;
          var bigger = ni >= nj ? i : j;
          if (n < Object.keys(sets[bigger]).length && edgesToCycle(xor)) {
            sets[bigger] = xor;
            changed = true;
          }
        }
      }
    }
    // Drop duplicates that the reduction can produce.
    var seen = {}, out = [];
    sets.forEach(function (s) {
      var cyc = edgesToCycle(s);
      if (!cyc) return;
      var sig = cyc.slice().sort(function (a, b) { return a - b; }).join(',');
      if (seen[sig]) return;
      seen[sig] = 1;
      out.push(cyc);
    });
    return out;
  }

  /**
   * Initial coordinates by depth-first walk.
   *
   * Chains zig-zag at ±30° off the incoming direction, which is what gives a
   * skeletal formula its characteristic saw-tooth. Ring atoms are placed on a
   * regular polygon as soon as the ring is entered, so fused systems start out
   * roughly right instead of being untangled later by brute force.
   */
  function seedCoords(mol, adj, rings) {
    var pos = mol.atoms.map(function () { return null; });
    var ringOf = mol.atoms.map(function () { return []; });
    rings.forEach(function (r, ri) { r.forEach(function (a) { ringOf[a].push(ri); }); });

    var placedRing = rings.map(function () { return false; });

    function placeRing(ri, anchorA, anchorB) {
      var ring = rings[ri];
      var n = ring.length;
      var R = BOND_LEN / (2 * Math.sin(Math.PI / n));
      var start = 0, cx, cy, a0;

      if (anchorA != null && pos[anchorA] && anchorB != null && pos[anchorB]) {
        // Fuse onto an existing bond: the shared edge fixes the ring's centre.
        var ia = ring.indexOf(anchorA), ib = ring.indexOf(anchorB);
        if (ia < 0 || ib < 0) { anchorA = null; }
        else {
          var mx = (pos[anchorA].x + pos[anchorB].x) / 2;
          var my = (pos[anchorA].y + pos[anchorB].y) / 2;
          var dx = pos[anchorB].x - pos[anchorA].x, dy = pos[anchorB].y - pos[anchorA].y;
          var len = Math.hypot(dx, dy) || 1;
          var apo = Math.sqrt(Math.max(0.01, R * R - (len / 2) * (len / 2)));
          // Push the new ring away from the molecule's existing centre of mass.
          var sumx = 0, sumy = 0, cnt = 0;
          pos.forEach(function (p) { if (p) { sumx += p.x; sumy += p.y; cnt++; } });
          var comx = cnt ? sumx / cnt : mx, comy = cnt ? sumy / cnt : my;
          var nx = -dy / len, ny = dx / len;
          if ((mx + nx * apo - comx) * (mx - comx) + (my + ny * apo - comy) * (my - comy) < 0) { nx = -nx; ny = -ny; }
          cx = mx + nx * apo; cy = my + ny * apo;
          a0 = Math.atan2(pos[anchorA].y - cy, pos[anchorA].x - cx);
          var step = 2 * Math.PI / n;
          var dir = ((ib - ia + n) % n === 1) ? 1 : -1;
          for (var k = 0; k < n; k++) {
            var idx = ring[(ia + dir * k + n * 2) % n];
            if (!pos[idx]) pos[idx] = { x: cx + R * Math.cos(a0 + step * k * dir * dir), y: cy + R * Math.sin(a0 + step * k * dir * dir) };
          }
          placedRing[ri] = true;
          return;
        }
      }
      // First ring in its system: drop it as a regular polygon at the origin.
      cx = pos[ring[0]] ? pos[ring[0]].x + R : 0;
      cy = pos[ring[0]] ? pos[ring[0]].y : 0;
      a0 = Math.PI;
      for (var k2 = 0; k2 < n; k2++) {
        var idx2 = ring[k2];
        if (!pos[idx2]) {
          pos[idx2] = { x: cx + R * Math.cos(a0 + 2 * Math.PI * k2 / n),
                        y: cy + R * Math.sin(a0 + 2 * Math.PI * k2 / n) };
        }
      }
      placedRing[ri] = true;
    }

    var visited = mol.atoms.map(function () { return false; });

    function walk(a, incomingAngle) {
      visited[a] = true;
      // Entering a ring this atom belongs to? Lay the whole ring down at once.
      ringOf[a].forEach(function (ri) {
        if (placedRing[ri]) return;
        var ring = rings[ri];
        var anchorB = null;
        for (var k = 0; k < ring.length; k++) {
          if (ring[k] !== a && pos[ring[k]]) { anchorB = ring[k]; break; }
        }
        placeRing(ri, a, anchorB);
      });

      var neighbours = adj[a].filter(function (e) { return !visited[e.atom]; });
      var branchCount = neighbours.length;
      var i = 0;
      neighbours.forEach(function (e) {
        if (!pos[e.atom]) {
          // Fan substituents out around the incoming direction.
          var spread = branchCount > 1 ? (Math.PI / 3) : 0;
          var ang = incomingAngle + (Math.PI / 3) * (i % 2 === 0 ? 1 : -1) +
                    (branchCount > 2 ? spread * (i - (branchCount - 1) / 2) * 0.5 : 0);
          pos[e.atom] = { x: pos[a].x + BOND_LEN * Math.cos(ang), y: pos[a].y + BOND_LEN * Math.sin(ang) };
          walk(e.atom, ang);
        } else if (!visited[e.atom]) {
          walk(e.atom, incomingAngle);
        }
        i++;
      });
    }

    pos[0] = { x: 0, y: 0 };
    walk(0, 0);
    // Disconnected fragments (salts) get their own starting point.
    for (var f = 0; f < mol.atoms.length; f++) {
      if (!pos[f]) { pos[f] = { x: 0, y: 3 + f * 0.1 }; walk(f, 0); }
    }
    return pos;
  }

  /**
   * Ideal 1-3 distances — the bond-angle constraint.
   *
   * This is the force that makes structures readable, and leaving it out was
   * the reason they were not. The ring term below pulls each ring atom to the
   * right DISTANCE from the ring centroid but says nothing about where it sits
   * ANGULARLY, so six benzene carbons would happily bunch into a crescent at
   * the correct radius: a ring that is the right size and the wrong shape.
   * Non-bonded repulsion does not rescue it either, since it only acts below
   * about one bond length while two atoms flanking a 120° angle sit 1.73 apart.
   *
   * Constraining the a–c distance across every a–b–c triple fixes both that and
   * chain geometry, because a fixed pair of bond lengths plus a fixed opposite
   * side determines the angle at b.
   */
  function angleTriples(mol, adj, rings) {
    var ringOf = mol.atoms.map(function () { return []; });
    rings.forEach(function (r, ri) { r.forEach(function (a) { ringOf[a].push(ri); }); });

    var hasTriple = mol.atoms.map(function () { return false; });
    mol.bonds.forEach(function (b) {
      if (b.order === 3) { hasTriple[b.a] = hasTriple[b.b] = true; }
    });

    var triples = [];
    for (var b = 0; b < mol.atoms.length; b++) {
      var nbrs = adj[b];
      if (nbrs.length < 2) continue;
      for (var i = 0; i < nbrs.length; i++) {
        for (var j = i + 1; j < nbrs.length; j++) {
          var a = nbrs[i].atom, c = nbrs[j].atom;
          var theta;

          // A triple bond is linear, and drawing it bent is simply wrong.
          if (hasTriple[b]) {
            theta = Math.PI;
          } else {
            // If all three sit in one ring, that ring's interior angle wins —
            // a five-membered ring is 108°, not 120°.
            var shared = null;
            ringOf[b].forEach(function (ri) {
              if (ringOf[a].indexOf(ri) >= 0 && ringOf[c].indexOf(ri) >= 0) {
                if (shared == null || rings[ri].length < rings[shared].length) shared = ri;
              }
            });
            if (shared != null) {
              var n = rings[shared].length;
              theta = (n - 2) * Math.PI / n;
            } else {
              // Otherwise spread the neighbours evenly: 120° for three
              // substituents, 90° for four. Both are consistent in 2D, which
              // is all this needs to be.
              theta = 2 * Math.PI / Math.max(3, nbrs.length);
            }
          }
          triples.push({ a: a, c: c, target: 2 * BOND_LEN * Math.sin(theta / 2) });
        }
      }
    }
    return triples;
  }

  /**
   * Constraint relaxation.
   *
   * The seed placement gets rings roughly right but leaves substituents
   * overlapping and bond lengths uneven. Four forces fix that:
   *
   *   bonds      spring toward BOND_LEN
   *   angles     spring the 1-3 distance of every a-b-c triple to its ideal
   *   rings      pull members onto a regular polygon about their own centroid
   *   repulsion  push any two non-bonded atoms apart below a threshold
   *
   * Angle and ring forces are weighted highest, because a distorted benzene
   * reads as a mistake immediately while a slightly long bond does not.
   */
  function relax(mol, adj, rings, pos, iterations) {
    var n = mol.atoms.length;
    var bonded = {};
    mol.bonds.forEach(function (b) { bonded[b.a + ':' + b.b] = bonded[b.b + ':' + b.a] = 1; });

    var triples = angleTriples(mol, adj, rings);
    // Atoms two bonds apart are held at their ideal separation by the angle
    // term, so the blunt repulsion must not fight it. Only closer pairs count.
    var oneThree = {};
    triples.forEach(function (t) { oneThree[t.a + ':' + t.c] = oneThree[t.c + ':' + t.a] = 1; });

    for (var it = 0; it < iterations; it++) {
      var fx = new Array(n).fill(0), fy = new Array(n).fill(0);
      var cool = 1 - it / iterations;

      mol.bonds.forEach(function (b) {
        var dx = pos[b.b].x - pos[b.a].x, dy = pos[b.b].y - pos[b.a].y;
        var d = Math.hypot(dx, dy) || 1e-6;
        var k = (d - BOND_LEN) * 0.5;
        var ux = dx / d, uy = dy / d;
        fx[b.a] += k * ux; fy[b.a] += k * uy;
        fx[b.b] -= k * ux; fy[b.b] -= k * uy;
      });

      // --- bond angles, via the 1-3 distance ---
      triples.forEach(function (t) {
        var dx = pos[t.c].x - pos[t.a].x, dy = pos[t.c].y - pos[t.a].y;
        var d = Math.hypot(dx, dy) || 1e-6;
        var k = (d - t.target) * 0.45;
        var ux = dx / d, uy = dy / d;
        fx[t.a] += k * ux; fy[t.a] += k * uy;
        fx[t.c] -= k * ux; fy[t.c] -= k * uy;
      });

      rings.forEach(function (ring) {
        var m = ring.length;
        var cx = 0, cy = 0;
        ring.forEach(function (a) { cx += pos[a].x; cy += pos[a].y; });
        cx /= m; cy /= m;
        var R = BOND_LEN / (2 * Math.sin(Math.PI / m));
        ring.forEach(function (a) {
          var dx = pos[a].x - cx, dy = pos[a].y - cy;
          var d = Math.hypot(dx, dy) || 1e-6;
          var k = (R - d) * 0.6;
          fx[a] += k * dx / d; fy[a] += k * dy / d;
        });
      });

      var MIN = BOND_LEN * 0.9;
      for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          if (bonded[i + ':' + j] || oneThree[i + ':' + j]) continue;
          var dx2 = pos[j].x - pos[i].x, dy2 = pos[j].y - pos[i].y;
          var d2 = Math.hypot(dx2, dy2);
          if (d2 > MIN || d2 < 1e-9) continue;
          var push = (MIN - d2) * 0.35;
          var ux2 = dx2 / d2, uy2 = dy2 / d2;
          fx[i] -= push * ux2; fy[i] -= push * uy2;
          fx[j] += push * ux2; fy[j] += push * uy2;
        }
      }

      // Clamp the per-step displacement.
      //
      // This is plain explicit Euler, so a large force times a full step can
      // overshoot far enough that the next step is larger still, and the layout
      // diverges to NaN — a molecule that silently vanishes from the page.
      // Fused polycyclics are where it happens, because their atoms sit under
      // several ring constraints at once. The cap almost never binds for a
      // settled molecule — it is set well above any step a converging layout
      // needs, because clamping tighter throttles convergence instead of only
      // catching divergence. It exists to make the failure impossible rather
      // than unlikely.
      var MAX_STEP = 1.5;
      for (var a2 = 0; a2 < n; a2++) {
        var dxs = fx[a2] * cool, dys = fy[a2] * cool;
        var mag = Math.hypot(dxs, dys);
        if (mag > MAX_STEP) { dxs = dxs / mag * MAX_STEP; dys = dys / mag * MAX_STEP; }
        if (!isFinite(dxs) || !isFinite(dys)) continue;
        pos[a2].x += dxs;
        pos[a2].y += dys;
      }
    }
    return pos;
  }

  /* ---------- Kekulé perception --------------------------------------------
     Aromatic bonds arrive from SMILES as a uniform "aromatic" flag, and
     drawing an inner line for every one of them turns a benzene ring into six
     double bonds. Real skeletal formulas alternate: three double bonds around
     a six-ring, and none at all on a pyrrole-type nitrogen.

     So assign an alternating pattern. A greedy pass around each ring is enough
     for drug-sized molecules — walk the ring, take a double bond wherever both
     ends are still free, and let everything else fall to single. Benzene comes
     out with three, and fused systems share correctly because a bond already
     assigned by the first ring is skipped by the second.
     ------------------------------------------------------------------------ */
  function kekulise(mol, adj, rings) {
    var bondBetween = {};
    mol.bonds.forEach(function (b, i) {
      bondBetween[b.a + ':' + b.b] = bondBetween[b.b + ':' + b.a] = i;
    });

    // Which aromatic atoms can carry a double bond at all. Pyrrole-type
    // nitrogen — three connections, or an explicit H — contributes a lone pair
    // to the ring instead, and drawing a double bond on it is simply wrong.
    // Furan and thiophene heteroatoms are the same case.
    var canDouble = mol.atoms.map(function (a, i) {
      if (!a.aromatic) return false;
      if (a.el === 'O' || a.el === 'S' || a.el === 'Se') return false;
      if ((a.el === 'N' || a.el === 'P') && (adj[i].length >= 3 || a.hcount)) return false;
      return true;
    });

    var used = mol.atoms.map(function () { return false; });

    rings.forEach(function (ring) {
      for (var i = 0; i < ring.length; i++) {
        var a = ring[i], b = ring[(i + 1) % ring.length];
        var bi = bondBetween[a + ':' + b];
        if (bi == null) continue;
        var bond = mol.bonds[bi];
        if (!bond.aromatic || bond.kekule) continue;
        if (!used[a] && !used[b] && canDouble[a] && canDouble[b]) {
          bond.kekule = 2;
          used[a] = used[b] = true;
        }
      }
    });

    // Anything aromatic still unassigned is a single bond in this depiction.
    mol.bonds.forEach(function (b) { if (b.aromatic && !b.kekule) b.kekule = 1; });
  }

  /** Parse, lay out, and normalise into a drawable molecule. */
  function build(smiles) {
    var mol = parse(smiles);
    if (!mol) return null;
    // A very large molecule will not read at thumbnail size and the relaxation
    // cost grows quadratically; refuse rather than draw a hairball.
    if (mol.atoms.length > 120) return null;

    var adj = adjacency(mol);
    var rings = findRings(mol, adj);
    var pos = seedCoords(mol, adj, rings);
    // Iteration count is the single biggest lever on quality here: the angle
    // and ring terms need time to settle against each other, and stopping
    // early leaves fused systems visibly strained. Cost is trivial at these
    // molecule sizes, so the budget is generous.
    relax(mol, adj, rings, pos, mol.atoms.length > 60 ? 500 : 900);

    kekulise(mol, adj, rings);

    mol.pos = pos;
    mol.rings = rings;
    mol.adj = adj;
    return mol;
  }

  /* ======================================================================
     3. RENDER
     ====================================================================== */

  var HETERO_COLOR = {
    N: '#5b9dd9', O: '#e5484d', S: '#d6a400', P: '#f76808',
    F: '#46a758', Cl: '#46a758', Br: '#b06a3b', I: '#8e5bd9',
    Na: '#9a9fae', K: '#9a9fae', Li: '#9a9fae', B: '#c98b6b', Si: '#9a9fae'
  };

  function svgEl(name, attrs, text) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(function (k) {
      if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    if (text != null) e.textContent = text;
    return e;
  }

  /**
   * Draw the molecule as SVG.
   *
   * Skeletal convention: carbons are implicit vertices with no label, so only
   * heteroatoms and charges are written. That is what makes a structure
   * readable at a glance rather than a wall of Cs.
   */
  function render(mol, opts) {
    opts = opts || {};
    var size = opts.size || 300;

    var xs = mol.pos.map(function (p) { return p.x; });
    var ys = mol.pos.map(function (p) { return p.y; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var w = Math.max(0.5, maxX - minX), hgt = Math.max(0.5, maxY - minY);
    var pad = 0.7;
    var scale = Math.min((size - 2) / (w + pad * 2), (size - 2) / (hgt + pad * 2));
    scale = Math.max(12, Math.min(scale, 46));

    var vbW = (w + pad * 2) * scale;
    var vbH = (hgt + pad * 2) * scale;
    var X = function (x) { return (x - minX + pad) * scale; };
    // SVG y grows downward; flip so the structure is not drawn upside down.
    var Y = function (y) { return vbH - (y - minY + pad) * scale; };

    var svg = svgEl('svg', {
      viewBox: '0 0 ' + vbW.toFixed(1) + ' ' + vbH.toFixed(1),
      class: 'structure-svg', role: 'img',
      'aria-label': (opts.name || 'Chemical') + ' structure'
    });

    /* ---- what gets a written label -------------------------------------
       Skeletal convention hides carbon, but hiding it everywhere costs more
       than it saves. A terminal methyl drawn as a bare line ending in empty
       space reads as an unfinished bond rather than as a CH3 — caffeine looked
       like it was missing its three N-methyls entirely. Published depictions
       write those out, so terminal carbons are labelled here too.

       Hydrogens on heteroatoms are counted and shown for the same reason: an
       unlabelled hydroxyl rendered as a bare "O" looks like an ether.       */

    var VALENCE = { B: 3, C: 4, N: 3, O: 2, P: 3, S: 2, F: 1, Cl: 1, Br: 1, I: 1 };

    function implicitH(i) {
      var a = mol.atoms[i];
      if (a.hcount != null) return a.hcount;        // bracket atom: stated
      var v = VALENCE[a.el];
      if (v == null) return 0;
      var used = 0;
      mol.adj[i].forEach(function (e) {
        var bond = mol.bonds[e.bond];
        used += bond.aromatic ? (bond.kekule || 1) : bond.order;
      });
      return Math.max(0, v + (a.charge || 0) - used);
    }

    var SUB = ['₀', '₁', '₂', '₃', '₄',
               '₅', '₆', '₇', '₈', '₉'];
    function sub(n) {
      return String(n).split('').map(function (c) { return SUB[+c] || c; }).join('');
    }

    var labelled = mol.atoms.map(function (a) {
      if (a.el !== 'C') return true;
      if (a.charge !== 0) return true;
      return mol.adj[a.idx].length <= 1;            // terminal or isolated carbon
    });

    // Label text and a per-atom clearance radius, computed BEFORE bonds are
    // drawn: a bond has to stop short of "CH₃" by more than it stops short of
    // "N", or the line runs straight through the letters.
    var labelInfo = mol.atoms.map(function (a, i) {
      if (!labelled[i]) return null;
      var nH = implicitH(i);
      var text;
      if (nH > 0) {
        // Put the hydrogens on the side the bond does NOT come from, so the
        // label reads outward: H₃C— on the left of a chain, —CH₃ on the right.
        var nbr = mol.adj[i][0];
        var nbrLeft = nbr && mol.pos[nbr.atom].x < mol.pos[i].x;
        var hPart = 'H' + (nH > 1 ? sub(nH) : '');
        text = nbrLeft ? a.el + hPart : hPart + a.el;
      } else {
        text = a.el;
      }
      if (a.charge) {
        text += a.charge > 0 ? (a.charge > 1 ? '+' + a.charge : '+')
                             : (a.charge < -1 ? String(a.charge) : '−');
      }
      return { text: text, chars: text.length };
    });

    // Which ring (if any) each bond belongs to, and where that ring's centre
    // is. A double bond inside a ring is drawn with its second line toward the
    // centre; offsetting to an arbitrary side is what makes a ring look like
    // it has bonds sticking out of it.
    var bondCentre = {};
    (mol.rings || []).forEach(function (ring) {
      var cx = 0, cy = 0;
      ring.forEach(function (a) { cx += mol.pos[a].x; cy += mol.pos[a].y; });
      cx /= ring.length; cy /= ring.length;
      for (var i = 0; i < ring.length; i++) {
        var a = ring[i], b = ring[(i + 1) % ring.length];
        var key = a < b ? a + ':' + b : b + ':' + a;
        // Smallest ring wins, so a fused bond leans into the ring it looks
        // like it belongs to rather than the larger system.
        if (!bondCentre[key] || ring.length < bondCentre[key].n) {
          bondCentre[key] = { x: cx, y: cy, n: ring.length };
        }
      }
    });

    mol.bonds.forEach(function (b) {
      var p1 = mol.pos[b.a], p2 = mol.pos[b.b];
      var x1 = X(p1.x), y1 = Y(p1.y), x2 = X(p2.x), y2 = Y(p2.y);
      var dx = x2 - x1, dy = y2 - y1;
      var len = Math.hypot(dx, dy) || 1;
      var ux = dx / len, uy = dy / len;
      // Stop the line short of an atom label rather than running under it.
      // A three-character "CH₃" needs a wider berth than a single "N".
      var clear = function (i) {
        var info = labelInfo[i];
        if (!info) return 0;
        return scale * (0.26 + 0.11 * (info.chars - 1));
      };
      var t1 = clear(b.a);
      var t2 = clear(b.b);
      var ax = x1 + ux * t1, ay = y1 + uy * t1;
      var bx = x2 - ux * t2, by = y2 - uy * t2;
      var nx = -uy, ny = ux;
      var gap = scale * 0.10;

      function line(ox, oy, cls, shrink) {
        shrink = shrink || 0;
        svg.appendChild(svgEl('line', {
          x1: (ax + ox + ux * shrink).toFixed(1), y1: (ay + oy + uy * shrink).toFixed(1),
          x2: (bx + ox - ux * shrink).toFixed(1), y2: (by + oy - uy * shrink).toFixed(1),
          class: cls || 'bond'
        }));
      }

      // Aromatic bonds were assigned an alternating pattern by kekulise(), so
      // a benzene ring draws three double bonds rather than six.
      var order = b.aromatic ? (b.kekule || 1) : b.order;
      var key = b.a < b.b ? b.a + ':' + b.b : b.b + ':' + b.a;
      var centre = bondCentre[key];

      if (order === 2) {
        if (centre) {
          // In a ring: full line on the bond, second line offset inward.
          var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
          var inx = X(centre.x) - X(mx), iny = Y(centre.y) - Y(my);
          var ilen = Math.hypot(inx, iny) || 1;
          line(0, 0);
          line(inx / ilen * gap * 1.7, iny / ilen * gap * 1.7, 'bond bond-inner', scale * 0.16);
        } else {
          // Outside a ring — a carbonyl, an alkene — draw it symmetrically.
          line(nx * gap, ny * gap);
          line(-nx * gap, -ny * gap);
        }
      } else if (order === 3) {
        line(0, 0);
        line(nx * gap * 1.6, ny * gap * 1.6);
        line(-nx * gap * 1.6, -ny * gap * 1.6);
      } else {
        line(0, 0);
      }
    });

    mol.atoms.forEach(function (a) {
      var info = labelInfo[a.idx];
      if (!info) return;
      var p = mol.pos[a.idx];
      var cx = X(p.x), cy = Y(p.y);
      var color = HETERO_COLOR[a.el] || 'var(--text)';

      // Knock a hole in the bond lines behind the label, sized to the text so
      // a wide "CH₃" is not underlined by the bond it sits on.
      var rx = scale * (0.26 + 0.13 * (info.chars - 1));
      var ry = scale * 0.30;
      svg.appendChild(svgEl('ellipse', {
        cx: cx.toFixed(1), cy: cy.toFixed(1),
        rx: rx.toFixed(1), ry: ry.toFixed(1), class: 'atom-halo'
      }));
      svg.appendChild(svgEl('text', {
        x: cx.toFixed(1), y: (cy + scale * 0.16).toFixed(1),
        'text-anchor': 'middle', class: 'atom-label',
        'font-size': (scale * 0.46).toFixed(1), fill: color
      }, info.text));
    });

    return svg;
  }

  /** SMILES straight to an SVG element, or null if it cannot be drawn. */
  function draw(smiles, opts) {
    try {
      var mol = build(smiles);
      if (!mol) return null;
      return render(mol, opts);
    } catch (e) {
      // A layout failure must never take the substance page down with it.
      if (global.console && console.warn) console.warn('structure draw failed:', e && e.message);
      return null;
    }
  }

  global.Structure = { parse: parse, build: build, render: render, draw: draw };
})(window);

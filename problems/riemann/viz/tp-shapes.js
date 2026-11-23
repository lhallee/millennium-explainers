/* The two proofs drawn as one graph of uses: a link runs up from a result to a result whose proof uses it. Route M is
   blue on the left, Route A gold on the right, the classical results that both routes use are red in the middle, and
   the theorem they share is violet at the top. Results that only one route takes from the literature are gray and
   dashed. Each route's links among its own results are also drawn as one translucent ribbon, so the route reads as a
   shape. A ring marks each route's waist: the result through which every result of that route below it reaches the
   theorem, which the module checks from the links when it starts. Hover or tap a result to light what it rests on and
   what rests on it; a click pins it. "Separate the proofs" takes away the shared results and the theorem, moves the
   routes apart, and counts the pieces that remain. Long links from the middle column run in lanes beside it. Every
   node and link, with its source, is listed in notes/proof-shapes.md. */
Kit.register('tp-shapes', {
  tex: {
    bound: 'G_r(x)\\le x^{1/2+9\\varepsilon}', win: '[Y,Y^{3/2}]', winD: '[Y,Y^{1+\\delta}]', Cy: 'C\\,y^{\\theta}',
    xO: 'x^{1/2+O(\\varepsilon)}', mlen: 'x^{1/2-\\varepsilon/16}', x401: 'x^{401}', ell: '\\ell', ellj: '\\ell^{\\,j}',
    shab: '\\textstyle\\sum\\log\\#\\text{Sha}^1\\le e^{x^{\\varepsilon}/2}'
  },
  init: function (fig) {
    var CH = { 2: 'Euler\'s product', 4: 'Zeta on the whole plane', 5: 'The zeros and the hypothesis', 11: 'The adeles',
      12: 'Tate\'s thesis as theta and zeta', 13: 'Primes as circles', 14: 'Choosing the topology', 15: 'Cutting the kernel along the primes',
      16: 'The local trace and the Trace Formula', 17: 'From the Trace Formula to the hypothesis', 19: 'The last mile',
      21: 'Multiplicity without derivatives', 22: 'Paying for the chain', 23: 'The arithmetic residue', 24: 'What the proof stands on',
      25: 'Two proofs, one theorem' };
    /* r: route (M, A, S shared, T the theorem); k: own, side (from the literature, one route), shared, end. row: 0 at
       the top. d: for a route's results, 0 next to the middle column and 1 at the outer edge; for the middle column,
       c is the offset from the center in units of the column's half-width. a: the anchor the button jumps to. */
    var NODES = [
      { id: 'rh', r: 'T', k: 'end', name: 'Real part ½ for ζ and every Dirichlet L', sh: 'The theorem', row: 0, c: 0, ch: 25, a: 'tp-reach',
        t: 'Every nontrivial zero of ζ and of every Dirichlet L-function has real part ½. Route M proves it inside its theorem for Hecke characters; Route A proves it as the five theorems of Main.lean, with no hypotheses.',
        s: 'Route M: Masullo, §§1.4.2 to 1.4.5, pp. 28 to 30. Route A: riemannHypothesis and four others, Main.lean.' },
      { id: 'hk', r: 'M', k: 'end', name: 'and every Hecke L', row: 0, d: 0.55, ch: 17, a: 's-tg-general',
        t: 'Route M goes further: for every number field and every unitary Hecke character χ, L(s, χ) has no zero off the line Re s = ½.',
        s: 'Masullo, pp. 28 to 30 and 53 to 55; the generality is asserted on p. 6.' },
      { id: 'pois', r: 'S', k: 'shared', name: 'Poisson summation', ph: 'Poisson summation', sh: 'Poisson', row: 11, c: 0.25, ch: 11, a: 't-ad-poisson',
        t: 'The sum of a function over a lattice equals the sum of its Fourier transform over the dual lattice. Route M gets the symmetry of theta sums from it through Tate\'s thesis; in Route A the tree\'s proof of the Siegel and Weil formula runs it for the Weil representation.',
        s: 'Stein and Shakarchi, Fourier Analysis; on the adeles, Tate\'s thesis. Chapters 4, 11, and 24.' },
      { id: 'tate', r: 'S', k: 'shared', name: 'Tate\'s thesis', ph: 'Tate\'s thesis', sh: 'Tate', row: 10, c: 0.9, ch: 24, a: 's-ia-tate',
        t: 'Zeta integrals over the ideles continue every Hecke L-function and give its functional equation. Route M is Tate\'s thesis done in families; Route A uses its statement HeckeLEntireAndNonzeroAtOne as a field of one bundle of published inputs.',
        s: 'Tate, thesis of 1950, in Cassels and Fröhlich (1967), ch. XV. GlobalTheory.Published.HeckeLEntireAndNonzeroAtOne, Development/AbelianVarietyTheory/PublishedTheorems/TwistedTraceFormula/HeckeLEntireAndNonzeroAtOne.lean.' },
      { id: 'fe', r: 'S', k: 'shared', name: 'Functional equation', ph: 'the functional equation', sh: 'Reflection', row: 10, c: -1.15, ch: 4, a: 't-zc-functional-equation',
        t: 'ξ(s) = ξ(1 − s), and the same symmetry for the completed L-function of a primitive Dirichlet character. Both endgames use it to reflect the half-plane right of the line onto the left one; Route M also uses it in the divisor sequence and on the circle.',
        s: 'Riemann 1859; for L(s, χ), Davenport, Multiplicative Number Theory. Chapters 4 and 7.' },
      { id: 'ld', r: 'S', k: 'shared', name: 'Zeros are poles', ph: 'the fact that a zero is a pole of −L′/L', sh: 'Poles', row: 5, c: 0, ch: 2, a: 't-ep-logderiv',
        t: 'Minus the logarithmic derivative of ζ is the Dirichlet series of Λ(n), and a zero of order m is a simple pole of −L′/L with residue −m: the bridge of the explicit formula, in the form both proofs use it. Route M\'s endgame turns its prime side into −ζ′/ζ(z + ½); Route A\'s code builds the poles of its transform from P′/P.',
        s: 'Apostol, Introduction to Analytic Number Theory. In Route A: Deduction.poleData, Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/poleData.lean.' },

      { id: 'dv', r: 'M', k: 'own', name: 'Divisor sequence', row: 8, d: 0.5, ch: 12, a: 't-tt-divisor',
        t: 'A rapidly decaying function is a weighted theta sum exactly when its Mellin transform is ξ(z + ½) times an entire function, so functions modulo the theta sums are the jets of their Mellin transforms at the zeros of ζ.',
        s: 'Masullo, Theorem 6.3.2.1, p. 304, and (1.8.3.2), p. 45; over Q the page proves the converse theorem by an argument of its own.' },
      { id: 'op', r: 'M', k: 'own', name: 'Eigenvalues', row: 6, d: 0.45, ch: 12, a: 't-tt-operator',
        t: 'Convolution by φ preserves the theta sums and acts on the quotient with one eigenvalue Mφ(ρ − ½) for each zero ρ.',
        s: 'Masullo, (1.8.3.4), pp. 46 to 47.' },
      { id: 'sq', r: 'M', k: 'own', name: 'Strip quotient', row: 7, d: 1, ch: 14, a: 't-sp-quotient',
        t: 'In the Hardy and Sobolev space Wₐ, evaluating a Mellin transform at z₀ is continuous exactly when |Re z₀| < a, so the closure of the theta sums is cut out by the jets at the zeros inside the strip |β − ½| < a alone.',
        s: 'Masullo, Corollary 9.2.2.5, p. 414, and Theorem 10.2.2.1, p. 446; the page proves the first with arguments of its own.' },
      { id: 'sp', r: 'M', k: 'own', name: 'Spectral trace', row: 5, d: 1, ch: 14, a: 't-sp-spectral-trace',
        t: 'On the strip quotient, convolution by φ has trace the sum of Mφ(ρ − ½) over the zeros inside the strip, with multiplicity.',
        s: 'Masullo, Theorem 10.3.2.1, p. 453, and pp. 13 to 14.' },
      { id: 'pr', r: 'M', k: 'own', name: 'Proto-trace', row: 4, d: 1, ch: 15, a: 't-ck-proto',
        t: 'The kernel φ(x/y) splits into a spectral part and a geometric part, and the geometric part carries minus the spectral trace on its diagonal.',
        s: 'Masullo, (1.8.3.6), p. 48, and Theorem 12.1.1.3, p. 502.' },
      { id: 'ot', r: 'M', k: 'own', name: 'Primes as circles', row: 5, d: 0, ch: 13, a: 't-pc-orbital-trace',
        t: 'Theta sums modulo the multiples of p are the smooth functions on a circle of length log p, and there convolution by φ has trace log p times the sum of φ over the powers of p, which is 0 for every prime beyond the support of φ.',
        s: 'Masullo, Theorem 7.5.0.1, p. 374; Theorem 7.3.1.6, p. 344; Theorem 7.4.2.1, p. 367.' },
      { id: 'sv', r: 'M', k: 'own', name: 'Sieve', row: 4, d: 0, ch: 15, a: 't-ck-slices-vanish',
        t: 'Lifted to the ideles and cut along the primes beyond Y one at a time, each slice has diagonal mass 0 when φ is supported in (1, Y).',
        s: 'Masullo, Theorem 11.3.2.1, p. 495.' },
      { id: 'rm', r: 'M', k: 'own', name: 'S-local remnant', row: 3, d: 0.25, ch: 15, a: 't-ck-remnant',
        t: 'Only the kernel at the finitely many places of S keeps diagonal mass, and its mass is minus the sum over the zeros inside the strip.',
        s: 'Masullo, pp. 16 and 52, and the proof of Theorem 12.5.1.1, p. 520.' },
      { id: 'tf', r: 'M', k: 'own', name: 'Trace Formula', sh: 'Trace Formula', row: 2, d: 0.25, ch: 16, a: 't-tf-trace-formula', waist: true,
        t: 'For every φ with φ(1) = 0 and every a > 0, Weil\'s prime sum plus the archimedean term equals the pole terms minus the zeros inside the strip.',
        s: 'Masullo, Theorem 12.5.1.1, p. 519.' },
      { id: 'eg', r: 'M', k: 'own', name: 'Endgame', row: 1, d: 0.25, ch: 17, a: 't-tg-rh',
        t: 'The family h₀(t) times t to the power −z turns the prime side into −ζ′/ζ(z + ½), with a pole at every zero, while the other side has poles only inside the strip; so no zero lies outside any strip.',
        s: 'Masullo, §§1.4.2 to 1.4.5, pp. 28 to 30, with a fixed cutoff of ours. The page\'s shorter route subtracts Weil\'s explicit formula instead.' },
      { id: 'sl', r: 'M', k: 'side', name: 'Connes\'s trace', row: 3, d: 1, ch: 16, a: 't-tf-s-local',
        t: 'The trace of a dilation cut off in space and in frequency gives Weil\'s local term at each place of S, and only the weight ½ matches the additive and multiplicative measures.',
        s: 'Connes 1999; Masullo, Theorem 12.4.1.1, pp. 514 to 519.' },
      { id: 'zc', r: 'M', k: 'side', name: 'No zero on σ = 1', row: 7, d: 0, ch: 5, a: 't-ze-nonvanishing-one',
        t: 'ζ has no zero on the line Re s = 1. The functional equation reflects the points the circle at p looks at onto that line, so ξ does not vanish there and the circle sees every theta sum.',
        s: 'de la Vallée Poussin 1896. Chapters 5 and 13; Masullo, Theorem 7.5.0.1, p. 374.' },

      { id: 'fv', r: 'A', k: 'own', name: 'Five theorems', row: 1, d: 0.65, ch: 19, a: 't-le-five',
        t: 'If no primitive Dirichlet L-function vanishes right of ½, the five theorems of Main.lean follow: Euler factors handle the imprimitive characters, and the functional equation reflects the half-plane.',
        s: 'UpperTheory.Top.imprimitive, Development/AutomorphicArithmetic/CharacterBoxes/Imprimitive.lean.' },
      { id: 'ct', r: 'A', k: 'own', name: 'Contract', row: 2, d: 0.65, ch: 19, a: 't-le-contract',
        t: 'If for every small ε the cyclic combination satisfies $bound$ on windows $win$, then no L-function of its family vanishes right of ½: one application per ε, with no bootstrap.',
        s: 'Formalism.HC.level_of_tiedWin, Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean.' },
      { id: 'wl', r: 'A', k: 'own', name: 'Windowed Landau', row: 3, d: 0, ch: 19, a: 't-le-windowed',
        t: 'An upper bound $Cy$ on windows $winD$ for arbitrarily large Y, on a positive combination of smoothed prime sums, excludes every zero of the family to the right of θ.',
        s: 'Deduction.zeroFree_of_rpow_window, Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/ZeroFreeOfRpowWindow.lean.' },
      { id: 'iw', r: 'A', k: 'own', name: 'Inequality on windows', sh: 'Inequality', row: 3, d: 0.65, ch: 19, a: 't-le-interface', waist: true,
        t: 'For each primitive χ and small ε, the cyclic combination of smoothed prime sums satisfies $bound$ at the large scales of windows $win$. The code proves it in two halves: a conditional bound, and tied families on windows.',
        s: 'Formalism.HC.ChebyshevInequalityOnWindows, Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean; proved for every level by level_gm_le_on_family_scales.' },
      { id: 'cb', r: 'A', k: 'own', name: 'From count to bound', row: 4, d: 0.65, ch: 22, a: 't-ig-core',
        t: 'An exact finite-group explicit formula writes the excess of the inert count as smoothed prime sums, and at a scale x a small gap between the count and its expected size bounds the cyclic combination by $xO$.',
        s: 'UpperTheory.Comparison₂.core_gm, Development/AutomorphicArithmetic/PrimitiveCosets/CoreGm.lean; the identity is AskMainBalance, Formalism/SizeWindowBrackets/FirstPrimeNeSecondPrime.lean.' },
      { id: 'tc', r: 'A', k: 'own', name: 'Chain of theta lifts', row: 5, d: 0.65, ch: 21, a: 'ml-chain',
        t: 'At each scale x, a chain of between $mlen$ and twice that many theta lifts between totally definite unitary groups yields data tied at every large scale of some windows. How the chain\'s divisibility reaches the count was not traced on this page.',
        s: 'UpperTheory.Top.TopG, Development/AutomorphicArithmetic/CharacterBoxes/ZeroFreeAllOfTopG.lean, from Green and the record HypsAlt.' },
      { id: 'pi', r: 'A', k: 'own', name: 'Published inputs', row: 6, d: 0, ch: 24, a: 't-ia-assembly',
        t: 'Published theorems restated as propositions and proved in the tree. Row0b and local Langlands fill the record, and its bundles feed the theta-integral assembly that builds the record HypsAlt.',
        s: 'UpperTheory.LiteratureTheorems.OpenLiteratureStatements, Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean.' },
      { id: 'hs', r: 'A', k: 'own', name: 'Hosts on windows', row: 6, d: 1, ch: 19, a: 'le-interface',
        t: 'From VWin and a pair of auxiliary primes whose Jacobi twists have square-root bounds (PairEx), the code builds hosts at every scale of some windows, with square-root bounds for the characters it cannot keep.',
        s: 'UpperTheory.Top.supplyChi, Development/AutomorphicArithmetic/CharacterBoxes/SupplyChi.lean; UpperTheory.Top.PairEx, Development/AutomorphicArithmetic/CharacterBoxes/PairGood.lean.' },
      { id: 'vw', r: 'A', k: 'own', name: 'Cohomological window', row: 7, d: 1, ch: 23, a: 't-cw-vwin',
        t: 'On a window of scales, the locally trivial Galois cohomology of an explicit abelian CM field, summed over all primes $ell$ and all Tate twists below $x401$, satisfies $shab$.',
        s: 'UpperTheory.Top.VWin, Development/AutomorphicArithmetic/CharacterBoxes/ExistsPageN.lean; proved by vwin_of_row.' },
      { id: 'rb', r: 'A', k: 'own', name: 'Galois input (Row0b)', row: 8, d: 0.5, ch: 22, a: 't-ig-row0b',
        t: 'Every regular algebraic polarized cuspidal representation of GLₙ over a CM field has an $ell$-adic Galois representation whose Frobenius data are its local data. The tree proves it from GeoOne, Galois representations from geometry, and TLiftK, theta lifts between definite unitary groups.',
        s: 'UpperTheory.GalStar.Row0b, Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/TypeConditions/WeightsConjBis.lean; derived in galoisRepresentations_of_thetaLift.' },
      { id: 'sw', r: 'A', k: 'side', name: 'Siegel and Weil', row: 10, d: 0.12, ch: 24, a: 't-ia-siegel',
        t: 'Averaged over a genus of definite lattices with weights one over the orders of the automorphism groups, the theta series is an Eisenstein series, and the weights sum to an explicit mass.',
        s: 'Siegel 1935; GlobalTheory.ThK.Dbl.SiegelWeilStd, Development/WeilBound/ThetaLifts/LatticeBasics/HypothesesS.lean.' },
      { id: 'll', r: 'A', k: 'side', name: 'Local Langlands', row: 10, d: 0.75, ch: 24, a: 't-ia-llc',
        t: 'At every finite place of every number field, a map from irreducible representations of GLₙ to Weil and Deligne representations that obeys the laws LawsT.',
        s: 'UpperTheory.Zero.LLC.RecTExists, Development/AutomorphicArithmetic/Foundations/LocalLanglands/IsRecTOfIsRec.lean.' },
      { id: 'fw', r: 'A', k: 'side', name: 'Ferrero and Washington', row: 9, d: 1, ch: 23, a: 't-cw-iwasawa',
        t: 'Along a cyclotomic tower the $ell$-part of the class number grows like $ell$ to an exponent linear in $ellj$ and in j, and over an abelian base field the coefficient of $ellj$ is zero.',
        s: 'Washington, Introduction to Cyclotomic Fields, ch. 7 and 13; UpperTheory.V.Published.FerreroWashington, Development/AutomorphicArithmetic/AutomorphicVarieties/PublishedTheorems/FerreroWashington.lean.' }
    ];
    /* [from, to] means that the proof of `to` uses `from`; a third entry routes the link up a lane beside the middle
       column, numbered from the column outward. */
    var EDGES = [
      ['tate', 'dv'], ['fe', 'dv'], ['dv', 'op'], ['dv', 'sq'], ['tate', 'ot', 0], ['fe', 'ot', 1], ['zc', 'ot'], ['op', 'sp'],
      ['sq', 'sp'], ['sp', 'pr'], ['ot', 'sv'], ['pr', 'rm'], ['sv', 'rm'], ['rm', 'tf'], ['sl', 'tf'], ['tf', 'eg'], ['fe', 'eg', 2],
      ['ld', 'eg', 3], ['eg', 'rh'], ['eg', 'hk'],
      ['rb', 'vw'], ['fw', 'vw'], ['rb', 'pi'], ['ll', 'pi', 2], ['tate', 'pi', 1], ['vw', 'hs'], ['pi', 'tc'], ['sw', 'tc', 3],
      ['hs', 'tc'], ['tc', 'cb'], ['cb', 'iw'], ['iw', 'ct'], ['wl', 'ct'], ['ld', 'wl'], ['ct', 'fv'], ['fe', 'fv', 0], ['fv', 'rh'],
      ['pois', 'tate'], ['pois', 'fe'], ['pois', 'sw']
    ];
    var COLOR = { M: 'blue', A: 'gold', S: 'red', T: 'violet' };
    var ROUTE = { M: 'Route M', A: 'Route A', S: 'used by both routes', T: 'proved by both routes' };
    var byId = {}, ins = {}, outs = {};
    NODES.forEach(function (n) { byId[n.id] = n; ins[n.id] = []; outs[n.id] = []; n.col = n.k === 'side' ? 'muted' : n.id === 'hk' ? 'violet' : COLOR[n.r]; });
    EDGES.forEach(function (e) {
      var u = byId[e[0]], v = byId[e[1]];
      if (!u || !v) throw new Error('tp-shapes: unknown node in link ' + e[0] + ' -> ' + e[1]);
      if (u.row <= v.row) throw new Error('tp-shapes: link ' + e[0] + ' -> ' + e[1] + ' does not point up');
      outs[e[0]].push(e[1]); ins[e[1]].push(e[0]);
    });

    /* Graph facts, computed once from the links. */
    function reach(from, dir, skip) {                 // every node reached from `from` along outs (dir 1) or ins (dir -1)
      var seen = {}, stack = [from];
      while (stack.length) {
        var id = stack.pop(), next = dir > 0 ? outs[id] : ins[id];
        for (var i = 0; i < next.length; i++) if (!seen[next[i]] && next[i] !== skip) { seen[next[i]] = 1; stack.push(next[i]); }
      }
      return seen;
    }
    var ANC = {}, DESC = {}, NANC = {}, NDESC = {};
    NODES.forEach(function (n) { ANC[n.id] = reach(n.id, -1); DESC[n.id] = reach(n.id, 1); NANC[n.id] = Object.keys(ANC[n.id]).length; NDESC[n.id] = Object.keys(DESC[n.id]).length; });
    /* A waist: every own result of the route that rests below it reaches the theorem only through it. */
    var WAIST = {};
    NODES.forEach(function (w) {
      if (!w.waist) return;
      var below = NODES.filter(function (n) { return n.r === w.r && n.k === 'own' && ANC[w.id][n.id]; });
      below.forEach(function (n) { if (reach(n.id, 1, w.id).rh) throw new Error('tp-shapes: ' + n.id + ' reaches the theorem around ' + w.id); });
      WAIST[w.r] = { node: w, below: below.length };
    });
    function pieces(keep) {                           // connected pieces of the kept nodes, links taken both ways
      var parent = {}, count = 0;
      function find(x) { while (parent[x] !== x) x = parent[x] = parent[parent[x]]; return x; }
      NODES.forEach(function (n) { if (keep(n)) { parent[n.id] = n.id; count++; } });
      EDGES.forEach(function (e) { if (parent[e[0]] !== undefined && parent[e[1]] !== undefined) { var a = find(e[0]), b = find(e[1]); if (a !== b) { parent[a] = b; count--; } } });
      return count;
    }
    var SHARED = NODES.filter(function (n) { return n.k === 'shared'; });
    var APART = pieces(function (n) { return n.k !== 'shared' && n.k !== 'end'; });
    if (pieces(function () { return true; }) !== 1) throw new Error('tp-shapes: the graph is not connected');

    var showM = fig.toggle({ label: 'Route M', value: true });
    var showA = fig.toggle({ label: 'Route A', value: true });
    var sep = fig.tween(0);
    fig.toggle({ label: 'Separate the proofs', value: false, onInput: function (v) { sep.to(v ? 1 : 0, 520, 'inOutCubic'); } });
    var pinned = null;
    var go = fig.button({ label: 'Go to the pinned result', onClick: function () { if (pinned) fig.goTo(pinned.a); } });
    fig.onReset = function () { pinned = null; sep.set(0); };
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) {
      var n = hit(P.X(x), P.Y(y)); pinned = n === pinned ? null : n; } });

    var G = {}, PORT = {}, L = null, layoutKey = '', summaryReady = false, panelFor = {};
    function visible(n) { return n.r === 'M' ? showM.value : n.r === 'A' ? showA.value : true; }
    function hit(px, py) {
      var best = null, bd = 1e9;
      NODES.forEach(function (n) {
        var g = G[n.id]; if (!g || !visible(n)) return;
        var d = Math.max(Math.abs(px - g.x - g.ox) - g.w / 2, Math.abs(py - g.y) - g.h / 2);
        if (d < (L.wide ? 4 : 10) && d < bd) { bd = d; best = n; }
      });
      return best;
    }

    /* Layout: rows from the top, a middle column for the shared results and the theorem, Route M to its left and
       Route A to its right. A wide stage draws named pills; a narrow one draws dots and names only the key results. */
    function layout(W, H) {
      var wide = W >= 700, m = wide ? 8 : 6, c0 = wide ? Kit.clamp(0.085 * W, 64, 96) : Kit.clamp(0.13 * W, 34, 50);
      var panelH = wide ? panelHeight(W) : 34, top = wide ? 24 : 20, avail = H - panelH - top - 4, pitch = avail / 12, cx = W / 2;
      var fs = 11.5, cap = wide ? Kit.clamp(0.135 * W, 96, 132) : 0, hwMax = 0;
      NODES.forEach(function (n) {
        var g = { lines: null, w: 0, h: 0, ox: 0 };
        if (wide) {
          var width = n.id === 'rh' ? Math.min(2 * c0 + 160, 0.4 * W) : n.r === 'S' ? 2 * c0 - 8 : n.k === 'side' ? 0.82 * cap : cap;
          g.lines = fig.wrap(n.name, width - 16, fs, 600);
          var tw = 0; g.lines.forEach(function (s) { tw = Math.max(tw, fig.measure(s, fs, 600)); });
          g.w = Math.ceil(tw + 16); g.h = 7 + 13 * g.lines.length;
          if (n.r === 'M' || n.r === 'A') hwMax = Math.max(hwMax, g.w / 2);
        } else { g.w = g.h = n.id === 'rh' ? 14 : n.k === 'side' ? 9 : 11; }
        G[n.id] = g;
      });
      /* Rows: on a wide stage each row is as tall as its tallest pill (a waist counts its ring), and the space left is
         shared equally between the rows, so two-line pills in neighboring rows keep a clear gap for their link. */
      var rowH = [], rowY = [], y = top, gap;
      for (var r = 0; r < 12; r++) rowH[r] = wide ? 20 : 0;
      if (wide) NODES.forEach(function (n) { rowH[n.row] = Math.max(rowH[n.row], G[n.id].h + (n.waist ? 10 : 0)); });
      gap = (avail - rowH.reduce(function (a, b) { return a + b; }, 0)) / 12;
      for (r = 0; r < 12; r++) { rowY[r] = y + (rowH[r] + gap) / 2; y += rowH[r] + gap; }
      var hw = wide ? hwMax : 7, inner = cx - c0 - 16 - hw, outer = m + hw;
      NODES.forEach(function (n) {
        var g = G[n.id];
        g.y = rowY[n.row];
        if (n.r === 'M' || n.r === 'A') { var xm = inner - n.d * (inner - outer); g.x = n.r === 'M' ? xm : W - xm; }
        else g.x = cx + n.c * c0;
      });
      /* Ports: the links that leave the top of a pill, and those that reach its bottom, are spread in the order of
         where their other ends are, so they do not all meet at one point. */
      PORT = {};
      if (wide) NODES.forEach(function (n) {
        var g = G[n.id];
        [[outs[n.id], 'o'], [ins[n.id], 'i']].forEach(function (pair) {
          var list = pair[0].slice().sort(function (a, b) { return G[a].x - G[b].x; }), k = list.length;
          if (k < 2) return;
          var span = Math.min(g.w - 18, 12 * (k - 1));
          list.forEach(function (other, j) { PORT[(pair[1] === 'o' ? n.id + '>' + other : other + '>' + n.id) + pair[1]] = -span / 2 + span * j / (k - 1); });
        });
      });
      return { wide: wide, cx: cx, c0: c0, pitch: pitch, clear: wide ? gap : 0.6 * pitch, outer: outer, panelTop: H - panelH, lane: function (side, k) { return cx + side * (c0 + 2 + 3.2 * k); } };
    }
    /* Panel height for the longest reading at this width, estimated from character counts so that nothing is measured. */
    function panelHeight(W) {
      if (panelFor[W]) return panelFor[W];
      var per = (W - 28) / (12.5 * 0.52), most = 0;
      NODES.forEach(function (n) { most = Math.max(most, 17 * Math.ceil(1.1 * n.t.length / per) + 15 * Math.ceil(1.1 * n.s.length / (per * 1.09))); });
      return (panelFor[W] = Kit.clamp(30 + most + 26, 116, 220));
    }

    function pill(x, y, w, h, color, width, alpha, dash, hollow) {
      var ctx = fig.ctx;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, Math.min(8, h / 2)); else ctx.rect(x - w / 2, y - h / 2, w, h);
      if (!hollow) { ctx.fillStyle = fig.color('stage', 0.96); ctx.fill(); }
      fig.stroke({ color: color, width: width, alpha: alpha, dash: dash }); ctx.stroke(); ctx.setLineDash([]);
    }
    /* How far a link stays from the center of a result: the edge of its pill or dot, or of the ring around a waist. */
    function reachOf(n) {
      var g = G[n.id];
      return L.wide ? g.h / 2 + (n.waist ? 5.8 : 0) : (n.waist ? 9.5 : g.w / 2) + 1.5;
    }
    /* A link: from the top of its source to the bottom of its target, leaving and arriving vertically; with a lane, it
       climbs the lane between the two ends. The path stops `inset` short of the target, where the arrowhead's base
       is, so that the head keeps a sharp tip. Returns the tip. */
    function curve(ctx, e, inset) {
      var u = e[0], v = e[1], gu = G[u], gv = G[v], key = u + '>' + v;
      var x0 = gu.x + gu.ox + (PORT[key + 'o'] || 0), x1 = gv.x + gv.ox + (PORT[key + 'i'] || 0);
      var y0 = gu.y - reachOf(byId[u]), y1 = gv.y + reachOf(byId[v]), ye = y1 + (inset || 0);
      ctx.moveTo(x0, y0);
      if (e.length > 2) {
        // the lane is left within the clear gap under the target, so the turn passes over nothing in the row below
        var xl = L.lane(byId[v].r === 'M' ? -1 : 1, e[2]), q = 0.6 * L.pitch, qo = Math.min(q, L.clear);
        ctx.bezierCurveTo(x0, y0 - 0.6 * q, xl, y0 - 0.4 * q, xl, y0 - q);
        ctx.lineTo(xl, ye + qo);
        ctx.bezierCurveTo(xl, ye + 0.4 * qo, x1, ye + 0.6 * qo, x1, ye);
      } else {
        var k = 0.5 * (y0 - ye);                     // no more than half the rise, so a short link never doubles back
        ctx.bezierCurveTo(x0, y0 - k, x1, ye + k, x1, ye);
      }
      return [x1, y1];
    }
    function head(x, y, s, color, alpha) {
      var ctx = fig.ctx;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - s * 0.6, y + s); ctx.lineTo(x + s * 0.6, y + s); ctx.closePath();
      ctx.fillStyle = fig.color(color, alpha); ctx.fill();
    }

    /* Readings: '$key$' marks a math label of the module's tex. Source lines break after a dot or a slash, with no space,
       inside long names and paths. Both are wrapped once per width and kept. */
    var wrapped = {};
    function wrapText(str, width, size) {
      var key = str + '|' + Math.round(width) + '|' + size;
      if (!wrapped[key]) wrapped[key] = fig.wrapParts(str.split('$').map(function (s, i) { return i % 2 ? { tex: s } : s; }).filter(function (p) { return p !== ''; }), width, { size: size });
      return wrapped[key];
    }
    function wrapSource(str, width, size) {
      var key = 's|' + str + '|' + Math.round(width) + '|' + size;
      if (wrapped[key]) return wrapped[key];
      var tokens = [], lines = [], cur = '', cw = 0, sp = fig.measure(' ', size);
      str.split(' ').forEach(function (word) {
        if (fig.measure(word, size) <= width * 0.5) { tokens.push({ s: word, glue: false }); return; }
        word.split(/(?<=[/.])/).forEach(function (p, i) { tokens.push({ s: p, glue: i > 0 }); });
      });
      tokens.forEach(function (t) {
        var tw = fig.measure(t.s, size), add = (cur && !t.glue ? sp : 0) + tw;
        if (cur && cw + add > width) { lines.push(cur); cur = t.s; cw = tw; } else { cur += (cur && !t.glue ? ' ' : '') + t.s; cw += add; }
      });
      if (cur) lines.push(cur);
      return (wrapped[key] = lines);
    }
    function heading(n) { return [n.name, ROUTE[n.r] + (n.k === 'side' ? ', from the literature' : ''), 'chapter ' + n.ch + ', ' + CH[n.ch]].join('  ·  '); }
    function tail(n) {
      var w = WAIST[n.r] && WAIST[n.r].node === n ? WAIST[n.r] : null;
      return 'Rests on ' + NANC[n.id] + (NANC[n.id] === 1 ? ' result' : ' results') + '; ' + NDESC[n.id] + (NDESC[n.id] === 1 ? ' rests' : ' rest') + ' on it.' +
        (w ? ' A waist: all ' + w.below + ' results of ' + ROUTE[n.r] + ' below it reach the theorem only through it.' : '');
    }

    return function draw() {
      var W = fig.w, H = fig.h, key = W + 'x' + H;
      if (key !== layoutKey) { L = layout(W, H); layoutKey = key; }
      var wide = L.wide, s = sep.value, ctx = fig.ctx, k = s * (wide ? 0.1 : 0.12);
      // separating squeezes each route toward its outer edge, so the gap between them widens and nothing leaves the stage
      NODES.forEach(function (n) { var g = G[n.id]; g.ox = n.r === 'M' ? -k * (g.x - L.outer) : n.r === 'A' ? k * (W - L.outer - g.x) : 0; });
      var sel = (probe.active ? hit(P.X(probe.x), P.Y(probe.y)) : null) || pinned;
      if (pinned && !visible(pinned)) pinned = null;
      if (sel && !visible(sel)) sel = null;
      go.enable(!!pinned); go.setLabel(pinned ? 'Go to ' + pinned.name : 'Go to the pinned result');
      var lit = null;                                // 1 rests below the selection, 2 the selection, 3 rests on it
      if (sel) { lit = {}; lit[sel.id] = 2; for (var a in ANC[sel.id]) lit[a] = 1; for (var b in DESC[sel.id]) lit[b] = 3; }
      var fadeS = 1 - 0.85 * s;                      // the shared results and the theorem fade as the proofs separate
      function alphaOf(n) {
        if (!visible(n)) return 0;
        var al = n.k === 'shared' || n.k === 'end' ? fadeS : 1;
        return lit && !lit[n.id] ? 0.25 * al : al;
      }
      function edgeOn(e) {
        var x = lit[e[0]], y = lit[e[1]];
        return (x === 1 || x === 2) && (y === 1 || y === 2) || (x === 2 || x === 3) && (y === 2 || y === 3);
      }

      // ribbons: each route's links among its own results, and on to the theorem, as one translucent band
      ['M', 'A'].forEach(function (r) {
        if (r === 'M' ? !showM.value : !showA.value) return;
        ctx.beginPath();
        EDGES.forEach(function (e) { var u = byId[e[0]]; if (u.r === r && u.k === 'own') curve(ctx, e); });
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        fig.stroke({ color: COLOR[r], width: wide ? 20 : 12, alpha: (r === 'A' ? 0.13 : 0.11) * (lit ? 0.6 : 1) });
        ctx.stroke(); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
      });
      // links: first those from shared and side results, over a halo, then each route's own
      var hs = wide ? 6.5 : 5, inset = 0.75 * hs;
      [0, 1].forEach(function (pass) {
        EDGES.forEach(function (e) {
          var u = byId[e[0]], own = u.k === 'own';
          if (pass === 0 ? own : !own) return;
          var al = Math.min(alphaOf(u), alphaOf(byId[e[1]]));
          if (al <= 0) return;
          var on = !lit || edgeOn(e);
          if (!on) al *= 0.35;
          var width = on && lit ? 2.2 : own ? 1.5 : 1.2, dash = u.k === 'side' ? [4, 3] : null, end;
          var la = (u.k === 'shared' && !(on && lit) ? 0.75 : 1) * al;
          if (!own) { fig.stroke({ color: 'stage', width: width + 3, alpha: 0.75 * al }); ctx.beginPath(); curve(ctx, e, inset); ctx.stroke(); }
          fig.stroke({ color: u.col, width: width, alpha: la, dash: dash });
          ctx.beginPath(); end = curve(ctx, e, inset); ctx.stroke(); ctx.setLineDash([]);
          head(end[0], end[1], hs, u.col, la);
        });
      });

      // nodes: a ring around each waist, then the pills or dots
      NODES.forEach(function (n) {
        var al = alphaOf(n); if (al <= 0) return;
        var g = G[n.id], x = g.x + g.ox, side = n.k === 'side';
        if (n.waist) {
          if (wide) pill(x, g.y, g.w + 10, g.h + 10, n.col, 1.6, 0.6 * al, null, true);
          else fig.circle(x, g.y, 9.5, { fill: false, ring: n.col, ringWidth: 1.5 });
        }
        if (wide) pill(x, g.y, g.w, g.h, n.col, sel === n ? 2.6 : side ? 1.2 : 1.7, al, side || n.id === 'hk' ? [4, 3] : null);
        else fig.circle(x, g.y, g.w / 2, { fill: side ? 'stage' : n.col, alpha: al, ring: sel === n ? 'fg' : side ? 'muted' : 'stage', ringWidth: sel === n ? 2.2 : 1.5 });
      });
      if (wide) [false, true].forEach(function (sideText) {   // names, in two passes of one font each
        NODES.forEach(function (n) {
          var al = alphaOf(n); if (al <= 0 || (n.k === 'side') !== sideText) return;
          var g = G[n.id], y0 = g.y - (g.lines.length - 1) * 6.5;
          g.lines.forEach(function (str, i) { fig.text(str, g.x + g.ox, y0 + 13 * i + 0.5, { color: sideText ? 'muted' : 'fg', size: 11.5, weight: 600, align: 'center', baseline: 'middle', alpha: al }); });
        });
      });
      else NODES.forEach(function (n) {              // on a phone only the shared results, the waists, and the theorem are named
        var al = alphaOf(n); if (al <= 0 || !(n.sh || n.waist)) return;
        var g = G[n.id], x = g.x + g.ox, label = n.sh || n.name;
        if (n.id === 'rh') tag(label, x + 11, g.y + 0.5, 'left', 'violet', al);
        // a shared result's links leave its top, so its name goes below the dot (nothing arrives at Poisson or the
        // poles from below) or to its left
        else if (n.r === 'S' && !ins[n.id].length) tag(label, x, g.y + g.h / 2 + 8, 'center', 'red', al);
        else if (n.r === 'S') tag(label, x - g.w / 2 - 4, g.y + 0.5, 'right', 'red', al);
        else tag(label, n.r === 'A' ? x - 12 : x + 12, g.y - 15, n.r === 'A' ? 'right' : 'left', n.col, al);
      });
      /* A phone label over a plate of the stage color, so a link that passes under it stays readable on both sides. */
      function tag(str, x, y, align, color, al) {
        var w = fig.measure(str, 10.5, 600), x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x0 - 3, y - 7, w + 6, 14, 4); else ctx.rect(x0 - 3, y - 7, w + 6, 14);
        ctx.fillStyle = fig.color('stage', 0.72 * al); ctx.fill();
        fig.text(str, x, y, { color: color, size: 10.5, weight: 600, align: align, baseline: 'middle', alpha: al });
      }
      if (showM.value) fig.text('Route M', wide ? 10 : 6, wide ? 12 : 9, { color: 'blue', size: 12.5, weight: 700, baseline: 'middle' });
      if (showA.value) fig.text('Route A', W - (wide ? 10 : 6), wide ? 12 : 9, { color: 'gold', size: 12.5, weight: 700, align: 'right', baseline: 'middle' });

      // the reading of the selected result, or the summary
      if (wide) {
        var py = L.panelTop + 6, tx = 14, tw = W - 28, hc = sel ? (sel.col === 'muted' ? 'fg' : sel.col) : 'fg';
        fig.line(10, py - 4, W - 10, py - 4, { color: 'grid', width: 1 });
        if (sel) {
          fig.text(heading(sel), tx, py + 10, { color: hc, size: 12.5, weight: 700, baseline: 'middle' });
          var T1 = wrapText(sel.t, tw, 12.5), T2 = wrapSource(sel.s, tw, 11.5), y2 = py + 32 + 17 * T1.length;
          T1.forEach(function (line, i) { fig.mathText(line, tx, py + 30 + 17 * i, { size: 12.5, color: 'fg' }); });
          T2.forEach(function (str, i) { fig.text(str, tx, y2 + 15 * i, { color: 'muted', size: 11.5, baseline: 'middle' }); });
          fig.text(tail(sel), tx, y2 + 15 * T2.length + 2, { color: 'muted', size: 11.5, weight: 600, baseline: 'middle' });
          return;
        }
        if (!summaryReady) { summaryReady = true; fig.more(); return; }   // the summary is wrapped one frame later, to keep the first frame short
        var rows = [];
        if (showM.value) rows.push(['blue', 'Route M: all ' + WAIST.M.below + ' of its results below the Trace Formula reach the theorem only through it, and it is an identity.']);
        if (showA.value) rows.push(['gold', 'Route A: all ' + WAIST.A.below + ' results of its construction reach the theorem only through the inequality on windows; the windowed Landau theorem joins above it.']);
        rows.push(['red', s > 0.5 ? 'Without the ' + SHARED.length + ' shared results and the theorem, what is left falls into ' + APART + ' pieces, one for each proof.'
          : 'Both use ' + SHARED.map(function (n) { return n.ph; }).join(', ').replace(/, ([^,]*)$/, ', and $1') + ', and this page shows no other result that both use.']);
        var yy = py + 10;
        rows.forEach(function (r) { fig.wrap(r[1], tw, 12.5, 500).forEach(function (str) { fig.text(str, tx, yy, { color: r[0], size: 12.5, baseline: 'middle' }); yy += 17; }); });
        fig.wrap('Hover or tap a result to light what it rests on and what rests on it, and click to pin it. Rings mark the waists; gray dashed results come from the literature.', tw, 11.5, 500)
          .forEach(function (str) { fig.text(str, tx, yy + 2, { color: 'muted', size: 11.5, baseline: 'middle' }); yy += 15; });
        return;
      }
      // phone: a hint line, and the open result in a box away from it
      fig.text(s > 0.5 ? 'Without the shared results and the theorem: ' + APART + ' pieces.' : 'Tap a dot to read it. Rings mark the waists.', W / 2, H - 11, { color: 'muted', size: 11, align: 'center', baseline: 'middle' });
      if (!sel) return;
      var bw = W - 12, iw = bw - 20, H1 = fig.wrap(heading(sel), iw, 11.5, 700), B1 = wrapText(sel.t, iw, 11.5), S1 = wrapSource(sel.s, iw, 10.5);
      var bh = 14 + 15 * H1.length + 15 * B1.length + 13.5 * S1.length + 6, by = G[sel.id].y < H / 2 ? H - bh - 24 : 4, yb = by + 13, bc = sel.col === 'muted' ? 'fg' : sel.col;
      pill(W / 2, by + bh / 2, bw, bh, bc, 1.4, 1);
      H1.forEach(function (str) { fig.text(str, 16, yb, { color: bc, size: 11.5, weight: 700, baseline: 'middle' }); yb += 15; });
      B1.forEach(function (line) { fig.mathText(line, 16, yb, { size: 11.5, color: 'fg' }); yb += 15; });
      S1.forEach(function (str) { fig.text(str, 16, yb + 2, { color: 'muted', size: 10.5, baseline: 'middle' }); yb += 13.5; });
    };
  }
});

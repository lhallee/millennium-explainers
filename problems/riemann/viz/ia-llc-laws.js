/* The laws of the full local Langlands structure Laws against the weak structure LawsT that the proof uses, one row
   per law: same (muted), dropped (red), asked only for good representations (gold), one direction only (teal).
   "pi is not good" fades the laws LawsT asks only for good pi, leaving what the weak map must obey for such pi.
   Field names in the hover text are those of IsRecTOfIsRec.lean and LocalLanglandsGL.lean, read from the notes. */
Kit.register('ia-llc-laws', {
  tex: { Qg: '\\QQ_g' },
  init: function (fig) {
    var COLOR = { same: 'muted', drop: 'red', good: 'gold', one: 'teal', onegood: 'gold', all: 'fg', req: 'fg' };
    // [Laws text, short, LawsT text, short, state, hover detail (two parts), kind] kind: law, derived (follows from a law), extra
    var ROWS = [
      ['bijective', 'bijective', 'dropped', 'dropped', 'drop', ['Laws asks rc to be a bijection (field bij).', 'LawsT drops it.']],
      ['dim rc(π) = n', 'dim rc(π) = n', 'same', 'same', 'same', ['rc(π) has dimension n for every π (field dim).', 'Both structures ask it.']],
      ['characters go through the Artin map', 'characters via Artin', 'same', 'same', 'same', ['On characters rc(χ) = χ ∘ a, with a the local Artin map (field one).', 'Both structures ask it.']],
      ['ε-factors of pairs agree', 'ε-factors of pairs', 'dropped', 'dropped', 'drop', ['Laws asks the ε-factors of pairs to agree (field eps).', 'LawsT drops it.']],
      ['twists', 'twists', 'only for good π', 'good π only', 'good', ['Compatibility with twists (field twist).', 'LawsT asks it only for good π.']],
      ['central character = determinant', 'central char. = det', 'only for good π', 'good π only', 'good', ['The central character of π matches the determinant of rc(π) (field central).', 'LawsT asks it only for good π.']],
      ['contragredient goes to dual', 'contragredient ↦ dual', 'only for good π', 'good π only', 'good', ['The contragredient of π goes to the dual of rc(π) (field dual).', 'LawsT asks it only for good π.']],
      ['cuspidal iff irreducible', 'cuspidal ⇔ irreducible', 'cuspidal implies irreducible', 'cuspidal ⇒ irred.', 'one', ['Laws: π is cuspidal exactly when rc(π) is irreducible.', 'LawsT (field cusp): cuspidal implies irreducible, one direction only, for all π.']],
      ['additive on segments', 'additive on segments', 'same', 'same', 'same', ['rc is additive along the Langlands classification by segments (field langlands).', 'Both structures ask it.']],
      ['determinants', 'determinants', 'dropped', 'dropped', 'drop', ['A law for determinants (field det).', 'LawsT drops it.'], 'law', 'five'],
      ['products', 'products', 'dropped', 'dropped', 'drop', ['A law for products (field prod).', 'LawsT drops it.'], 'law', 'five'],
      ['supports', 'supports', 'dropped', 'dropped', 'drop', ['A law for supports (field supp).', 'LawsT drops it.'], 'law', 'five'],
      ['spherical representations', 'spherical', 'dropped', 'dropped', 'drop', ['A law for spherical representations.', 'LawsT drops it.'], 'law', 'five'],
      ['Satake parameters', 'Satake', 'dropped', 'dropped', 'drop', ['A law for Satake parameters.', 'LawsT drops it.'], 'law', 'five'],
      ['depth zero iff tame', 'depth zero ⇔ tame', 'depth zero implies tame, only for good π', '⇒ tame, good π only', 'onegood', ['Laws: depth zero exactly when tame.', 'LawsT (field depth): depth zero implies tame, one direction, only for good π.']],
      ['follows from bijectivity', '(from bijective)', 'only for good π', 'good π only', 'good', ['Injectivity at π (field inj); in Laws it follows from bijectivity.', 'LawsT asks it only for good π.'], 'derived'],
      ['follows from twists', '(from twists)', 'for all π', 'all π', 'all', ['rc(π |det|^s) = rc(π) ⊗ |·|^s (field nu); in Laws it follows from twists.', 'LawsT asks it for all π.'], 'derived'],
      ['follows from the central character law', '(from central char.)', 'for all π', 'all π', 'all', ['|det rc(π)(σ)| equals |ω(a(σ))| for the central character ω of π (field absCentral).', 'In Laws it follows from the central character law; LawsT asks it for all π.'], 'derived'],
      ['from the published depth-zero type statement', '(depth-zero types)', 'required', 'required', 'req', ['Restriction to inertia tied to Green\'s cuspidal characters (field type).', 'The code derives it from Laws with a published statement on depth-zero types.'], 'extra']
    ].map(function (r) { return { laws: r[0], lawsS: r[1], t: r[2], tS: r[3], st: r[4], detail: r[5], kind: r[6] || 'law', group: r[7] || null }; });
    var NAMES = ['dim', 'one', 'twist', 'central', 'dual', 'cusp', 'langlands', 'depth', 'inj', 'nu', 'absCentral'];
    var kept = ROWS.filter(function (r) { return r.kind !== 'extra' && r.st !== 'drop'; }).length;
    var dropped = ROWS.filter(function (r) { return r.st === 'drop'; }).length;
    var goodOnly = ROWS.filter(function (r) { return r.st === 'good' || r.st === 'onegood'; }).length;
    if (kept !== 11 || dropped !== 7 || goodOnly !== 5 || NAMES.length !== kept) console.error('ia-llc-laws: counts differ from the caption of chapter 24');
    // the phone view merges the five dropped laws from determinants to Satake into one row
    var FIVE = { laws: 'determinants, and 4 more', lawsS: 'det, prod, supp, sph, sat', t: 'dropped', tS: 'dropped', st: 'drop', kind: 'law',
      detail: ['Laws for determinants, products, supports, spherical representations, and Satake parameters.', 'LawsT drops all five.'] };
    var PHONE = []; ROWS.forEach(function (r) { if (!r.group) PHONE.push(r); else if (r.laws === 'determinants') PHONE.push(FIVE); });

    var notGood = false, fade = fig.tween(0);
    var bg = fig.button({ label: 'π is good', pressed: true, onClick: function () { setGood(true); } });
    var bn = fig.button({ label: 'π is not good', pressed: false, onClick: function () { setGood(false); } });
    function setGood(g) { notGood = !g; bg.press(g); bn.press(!g); fade.to(g ? 0 : 1, 250, 'inOutCubic'); }
    fig.onReset = function () { setGood(true); pinned = null; };
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 }), pinned = null, rowsNow = ROWS, geo = { top: 0, pitch: 1 };
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) { var r = rowAt(P.Y(y)); pinned = r === pinned ? null : r; } });
    var wrapped = {};
    function wrap(str, width, size, weight) {               // word wrap, cached by text and width
      var key = str + '|' + Math.round(width) + '|' + size + '|' + weight;
      if (wrapped[key]) return wrapped[key];
      var out = [], cur = '', cw = 0, sp = fig.measure(' ', size, weight);   // words measured once each, not every prefix
      str.split(' ').forEach(function (wd) { var ww = fig.measure(wd, size, weight); if (cur && cw + sp + ww > width) { out.push(cur); cur = wd; cw = ww; } else { cur = cur ? cur + ' ' + wd : wd; cw += (cw ? sp : 0) + ww; } });
      if (cur) out.push(cur);
      return (wrapped[key] = out);
    }
    function rowAt(py) { var i = Math.floor((py - geo.top) / geo.pitch); return i >= 0 && i < rowsNow.length ? rowsNow[i] : null; }

    return function draw() {
      var w = fig.w, h = fig.h, narrow = w < 560, f = fade.value;
      rowsNow = narrow ? PHONE : ROWS;
      var size = narrow ? 10.5 : 11.5, head = narrow ? 24 : 32, foot = narrow ? 36 : 44, x0 = 10, xm = narrow ? 0.52 * w : 0.47 * w, x1 = w - 10;
      geo.top = head; geo.pitch = (h - head - foot) / rowsNow.length;
      var sel = (probe.active ? rowAt(P.Y(probe.y)) : null) || pinned;

      fig.text(narrow ? 'Laws (full)' : 'Laws: the full correspondence', x0, head - 10, { color: 'fg', size: size, weight: 700 });
      fig.text(narrow ? 'LawsT (used)' : 'LawsT: what the proof uses', xm, head - 10, { color: 'fg', size: size, weight: 700 });
      fig.line(x0, head - 0.5, x1, head - 0.5, { color: 'muted', width: 1.2 });
      rowsNow.forEach(function (r, i) {
        var yc = head + (i + 0.5) * geo.pitch, faded = r.st === 'good' || r.st === 'onegood' ? 1 - 0.78 * f : 1;
        if (r === sel) fig.rect(x0 - 4, head + i * geo.pitch, x1 - x0 + 8, geo.pitch, { fill: 'fg', alpha: 0.08 });
        if (i) fig.line(x0, head + i * geo.pitch, x1, head + i * geo.pitch, { color: 'grid', width: 1 });
        fig.text(narrow ? r.lawsS : r.laws, x0, yc + 0.5, { color: r.kind === 'law' ? 'fg' : 'muted', size: size, baseline: 'middle' });
        var c = COLOR[r.st], tx = narrow ? r.tS : r.t;
        fig.circle(xm + 4, yc, 3.5, { fill: c, alpha: faded });
        fig.text(tx, xm + 14, yc + 0.5, { color: c, size: size, baseline: 'middle', alpha: faded });
        if (r.st === 'drop') fig.line(x0, yc + 1, x0 + fig.measure(narrow ? r.lawsS : r.laws, size, 500), yc + 1, { color: 'red', width: 1.2, alpha: 0.7 });
      });
      fig.line(x0, h - foot + 0.5, x1, h - foot + 0.5, { color: 'muted', width: 1.2 });

      var fy = h - foot + (narrow ? 13 : 16), fs = size;   // two canvas fonts in all: size, and size bold
      var dc = sel && (COLOR[sel.st] === 'muted' ? 'fg' : COLOR[sel.st]);
      var lines = sel ? wrap(sel.detail[0], x1 - x0 - 16, fs, 500).map(function (t) { return [t, 'fg', 500]; })
        .concat(wrap(sel.detail[1], x1 - x0 - 16, fs, 700).map(function (t) { return [t, dc, 700]; })) : [];
      if (sel && lines.length > 2) {                          // the phone: the law in a box over the half of the table away from the row
        var bh = lines.length * (fs + 4) + 12, top = rowsNow.indexOf(sel) < rowsNow.length / 2 ? h - foot - bh - 4 : head + 4;
        fig.rect(x0 - 4, top, x1 - x0 + 8, bh, { fill: 'stage', alpha: 0.97 }); fig.rect(x0 - 4, top, x1 - x0 + 8, bh, { color: dc, width: 1.2 });
        lines.forEach(function (q, i) { fig.text(q[0], x0 + 4, top + 6 + (i + 0.5) * (fs + 4), { color: q[1], size: fs, weight: q[2], baseline: 'middle' }); });
      }
      if (sel && lines.length <= 2) lines.forEach(function (q, i) { fig.text(q[0], x0, fy + i * (fs + 4), { color: q[1], size: fs, weight: q[2] }); });
      else if (sel) fig.text('tap the row again to close', x0, fy, { color: 'muted', size: fs }); else if (notGood) {
        fig.text(narrow ? 'For π that is not good, LawsT asks' : 'For π that is not good, LawsT asks only the laws that are not faded;', x0, fy, { color: 'fg', size: fs });
        fig.text(narrow ? 'only the laws that are not faded.' : 'the faded ones constrain the weak map only at good representations.', x0, fy + fs + 4, { color: 'muted', size: fs });
      } else {
        fig.text('kept in some form: ' + kept + '    dropped: ' + dropped + '    only for good π: ' + goodOnly, x0, fy, { color: 'fg', size: fs, weight: 700 });
        if (narrow) fig.text('tap a row for its law', x0, fy + fs + 4, { color: 'muted', size: fs });
        else fig.mathText(['Good π: cuspidal support of characters, or of twists of depth-zero representations over ', { tex: 'Qg' }],
          x0, fy + fs + 4 - fs * 0.35, { size: fs, color: 'muted' });
      }
    };
  }
});

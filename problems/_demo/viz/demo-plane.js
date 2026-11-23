/* Domain coloring of zeta on a window of the critical strip, with a draggable point that reads zeta(s) and a slider
   that moves the window up the plane. */
Kit.register('demo-plane', {
  tex: { s: 's', line: '\\Re s = \\tfrac12', center: 't_0' },
  init: function (fig) {
    var M = Kit.math;
    var H = 12;
    var center = fig.slider({ label: 'Window center', tex: 'center', min: 12, max: 90, step: 0.5, value: 18 });
    var marks = fig.toggle({ label: 'Mark zeros', value: true });
    var P = fig.plane({ x: [-2, 3], y: [6, 30], pad: { t: 10, r: 12, b: 28, l: 40 } });
    var s = fig.drag({ plane: P, x: 0.5, y: 14.134725, color: 'fg', label: 's', labelAnchor: 'sw',
      constrain: function (x, y) { return [Kit.clamp(x, -2, 3), Kit.clamp(y, P.view.y0, P.view.y1)]; } });
    var value = [0, 0];
    var zeta = function (x, y, out) { M.zetaInto(x, y, out); };

    return function draw() {
      P.view.y0 = center.value - H;
      P.view.y1 = center.value + H;
      P.update();
      s.y = Kit.clamp(s.y, P.view.y0, P.view.y1);
      P.domain(zeta, { rev: 'zeta' });
      P.axes({ origin: [P.v.x0, P.v.y0], xStep: 1, yStep: 4, color: 'muted' });
      P.vline(0.5, { color: 'stage', width: 4, alpha: 0.6 });
      P.vline(0.5, { color: 'violet', width: 2, dash: [7, 5] });
      P.label('line', 0.5, P.v.y1, { anchor: 'nw', dx: 8, dy: 6, color: 'violet' });
      if (marks.value) {
        for (var i = 0; i < Kit.zeros.length; i++) {
          var g = Kit.zeros[i];
          if (g > P.v.y1) break;
          if (g >= P.v.y0) P.point(0.5, g, { color: 'teal', r: 4.5, ringWidth: 2 });
        }
      }
      M.zetaInto(s.x, s.y, value);
      var b = P.box;
      fig.rect(b.l + 8, b.t + 8, 214, 48, { fill: 'stage', alpha: 0.86 });
      fig.text('s = ' + s.x.toFixed(2) + (s.y < 0 ? ' − ' : ' + ') + Math.abs(s.y).toFixed(2) + 'i', b.l + 18, b.t + 27, { size: 12.5, mono: true });
      fig.text('ζ(s) = ' + value[0].toFixed(3) + (value[1] < 0 ? ' − ' : ' + ') + Math.abs(value[1]).toFixed(3) + 'i', b.l + 18, b.t + 46, { size: 12.5, mono: true });
    };
  }
});

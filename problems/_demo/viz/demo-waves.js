/* The explicit formula converging to psi(x) as pairs of zeros are added. Partial sums for each N are tabulated
   zero by zero, a few zeros per frame within a 2 ms budget, so a frame never waits for the whole table. */
Kit.register('demo-waves', {
  tex: { psi: '\\psi(x)', main: 'y = x', sum: '\\psi_N(x)' },
  init: function (fig) {
    var M = Kit.math;
    var X0 = 1.5, X1 = 40, NMAX = 100;
    var P = fig.plane({ x: [0, 40], y: [0, 44], pad: { t: 16, r: 18, b: 30, l: 40 } });
    var count = function (v) { return Math.round(NMAX * v * v); };
    var play = fig.player({ duration: 9, label: 'Zero pairs', format: function (v) { return String(count(v)); } });
    var showMain = fig.toggle({ label: 'Main term', value: true });
    var steps = M.psiSteps(X1);
    // rows[k] holds the curve with k pairs of zeros at the grid points; filled is how many rows exist.
    var cols = 0, grid = null, rows = [], filled = 0, acc = null;

    function reset() {
      cols = Math.max(64, Math.round(P.box.w / 1.5));
      grid = new Float64Array(cols + 1);
      acc = new Float64Array(cols + 1);
      var base = new Float64Array(cols + 1);
      for (var i = 0; i <= cols; i++) {
        var x = X0 + (X1 - X0) * i / cols;
        grid[i] = x;
        base[i] = x - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - 1 / (x * x));
      }
      rows = [base];
      filled = 1;
    }
    function fill(upTo) {
      var deadline = performance.now() + 2;
      while (filled <= upTo && filled <= NMAX) {
        var g = Kit.zeros[filled - 1], row = new Float64Array(cols + 1), base = rows[0];
        for (var i = 0; i <= cols; i++) {
          var L = Math.log(grid[i]);
          acc[i] += (0.5 * Math.cos(g * L) + g * Math.sin(g * L)) / (0.25 + g * g);
          row[i] = base[i] - 2 * Math.sqrt(grid[i]) * acc[i];
        }
        rows.push(row);
        filled++;
        if (performance.now() > deadline) break;
      }
    }

    return function draw() {
      if (!grid || cols !== Math.max(64, Math.round(P.box.w / 1.5))) reset();
      var want = count(play.value);
      fill(want);
      var N = Math.min(want, filled - 1);
      if (N < want) fig.more();
      P.grid({ xStep: 5, yStep: 10 });
      P.axes({ xStep: 5, yStep: 10 });
      if (showMain.value) {
        P.plot(function (x) { return x; }, { color: 'blue', width: 1.75, from: X0, alpha: 0.9 });
        P.label('main', 39.5, 39.5, { anchor: 'se', color: 'blue', dy: -8 });
      }
      P.stairs(steps.xs, steps.ys, { color: 'gold', width: 2.5, to: X1 });
      P.path(grid, rows[N], { color: 'teal', width: 2 });
      P.label('psi', 33, M.psi(33) + 3, { anchor: 's', color: 'gold' });
      var at = Math.round((16 - X0) / (X1 - X0) * cols);
      P.label('sum', 16, Math.max(1, rows[N][at] - 4), { anchor: 'n', color: 'teal' });
      fig.text(N + (N === 1 ? ' pair of zeros' : ' pairs of zeros'), P.box.l + 10, P.box.t + 16, { color: 'fg', size: 13, weight: 600 });
    };
  }
});

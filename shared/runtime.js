/* Page runtime: theme toggle, index state and scroll-spy, reading progress fallback, windowed math, deep links that
   land correctly through skipped sections, and the click-to-define drawer.

   One position tracker does the work that per-element observers would: once per animation frame after the page
   scrolled, it finds by binary search the sections overlapping the window and the bands around it (a dozen
   getBoundingClientRect reads in document order, made at the start of a frame when the layout is already clean), and
   from that it sets the scroll-spy, fills what is on screen at once, queues the look-ahead, and marks far sections
   for emptying. Observing every section with an IntersectionObserver instead cost about 3 ms per frame at 4x CPU
   slowdown on a 25-chapter page. Nothing reads layout inside a scroll event handler. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var wideQuery = matchMedia('(min-width: 881px)');
  var darkQuery = matchMedia('(prefers-color-scheme: dark)');

  /* Theme: follows the system until the reader picks one, then remembers the choice. */
  var toggle = doc.querySelector('.theme-toggle');
  function theme() { return root.getAttribute('data-theme') || (darkQuery.matches ? 'dark' : 'light'); }
  function announceTheme() {
    if (toggle) toggle.setAttribute('aria-label', theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    doc.dispatchEvent(new CustomEvent('mx:theme', { detail: theme() }));
  }
  function setTheme(t, remember) {
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    if (remember) { try { if (t) localStorage.setItem('mx-theme', t); else localStorage.removeItem('mx-theme'); } catch (e) { /* storage blocked */ } }
    announceTheme();
  }
  if (toggle) toggle.addEventListener('click', function () { setTheme(theme() === 'dark' ? 'light' : 'dark', true); });
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', function () { if (!root.hasAttribute('data-theme')) announceTheme(); });
  if (toggle) toggle.setAttribute('aria-label', theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');

  /* Index: always open on a wide screen. */
  var idx = doc.getElementById('idx');
  var nav = doc.querySelector('nav.index');
  function keepIndex() { if (idx && wideQuery.matches) idx.open = true; }
  keepIndex();
  if (wideQuery.addEventListener) wideQuery.addEventListener('change', keepIndex);
  if (idx) idx.addEventListener('toggle', keepIndex);

  /* Scroll-spy. The current entry is the last chapter head or section whose top is above 30% of the window (and
     whose bottom is below the window's top), which is the last one overlapping a band over the top 30%. */
  var chapterItems = {};
  var sectionLinks = {};
  if (nav) {
    nav.querySelectorAll('.idx-ch').forEach(function (li) { chapterItems[li.getAttribute('data-ch')] = li; });
    nav.querySelectorAll('.idx-secs a').forEach(function (a) { sectionLinks[a.getAttribute('data-sec')] = a; });
  }
  var current = { ch: null, sec: null };
  function applySpy(best) {
    var ch = best.getAttribute('data-ch');
    var sec = best.getAttribute('data-sec') || null;
    if (ch === current.ch && sec === current.sec) return;
    if (ch !== current.ch) {
      if (current.ch && chapterItems[current.ch]) chapterItems[current.ch].classList.remove('cur');
      if (chapterItems[ch]) chapterItems[ch].classList.add('cur');
    }
    if (current.sec && sectionLinks[current.sec]) { sectionLinks[current.sec].classList.remove('on'); sectionLinks[current.sec].removeAttribute('aria-current'); }
    if (sec && sectionLinks[sec]) { sectionLinks[sec].classList.add('on'); sectionLinks[sec].setAttribute('aria-current', 'location'); }
    current.ch = ch;
    current.sec = sec;
    if (wideQuery.matches && nav) {
      var link = (sec && sectionLinks[sec]) || (chapterItems[ch] && chapterItems[ch].firstElementChild);
      if (link) {
        var top = link.offsetTop - nav.offsetTop;
        if (top < nav.scrollTop + 40 || top > nav.scrollTop + nav.clientHeight - 60) nav.scrollTop = Math.max(0, top - nav.clientHeight / 3);
      }
    }
  }

  /* Reading progress where scroll-driven animations are missing: one read and one write per frame. */
  var bar = doc.querySelector('.progress-bar');
  var progressByScript = Boolean(bar && !(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()')));
  function paintProgress() {
    var max = root.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  }

  /* Math hydration, windowed. Each formula in the page is a placeholder (k-m inline, k-d display) holding its TeX
     source and an index i into the formula table: KaTeX's rendering from the build, compressed in chunks (script
     elements of type application/x-mx-math, one per chapter).

     - On screen: a part overlapping the window or half a window around it is filled at once, inside the frame that
       finds it.
     - Look-ahead: parts within FILL_AHEAD windows below (and FILL_BEHIND above) are filled ahead of the reader, nearest
       first, in one slice per frame that runs after the frame is drawn, with a budget that shrinks when frames run
       long. These sections are still skipped by content-visibility, so filling them costs no layout.
     - Emptying: a filled part farther than DROP windows is emptied back to its TeX source in the same slices, and at
       once in larger steps when more than MAX_FILLED formulas are filled (a fast jump through the page), so the page
       holds the KaTeX markup of a bounded neighborhood of the reader. A part that far is skipped by
       content-visibility, and its remembered size (contain-intrinsic-size: auto) does not change while it is skipped,
       so emptying and refilling far parts does not move the page.
     Chapter heads and the appendices are filled once and kept. Before the main column is shown, the parts around the
     starting position are filled; a jump fills its target before landing. */
  var FILL_AHEAD = 4;
  var FILL_BEHIND = 2;
  var DROP = 7;
  var MAX_FILLED = 3000;
  var chunkEls = [].slice.call(doc.querySelectorAll('script[type="application/x-mx-math"]'));
  var chunkLoads = [];
  var table = [];
  var hydration = { missing: 0, filled: 0, emptied: 0, ready: false, live: 0 };
  var anchoring = !!(window.CSS && CSS.supports && CSS.supports('overflow-anchor', 'auto'));
  function bytesOf(b64) {
    if (Uint8Array.fromBase64) return Uint8Array.fromBase64(b64);
    var bin = atob(b64);
    var a = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return a;
  }
  /* The text of a script element holding deflate-compressed base64: the formula table's chunks, and the figure kit,
     modules, and math labels. */
  function unpack(el) {
    var stream = new Blob([bytesOf(el.textContent.trim())]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Response(stream).text();
  }
  function loadChunk(k) {
    if (!chunkLoads[k]) {
      var el = chunkEls[k];
      if (!el) return Promise.reject(new Error('formula chunk ' + k + ' is missing'));
      chunkLoads[k] = unpack(el).then(function (text) {
        var list = text.split('\u0001');
        var start = Number(el.getAttribute('data-start'));
        if (list.length !== Number(el.getAttribute('data-n'))) throw new Error('formula chunk ' + k + ' holds ' + list.length + ' formulas, not ' + el.getAttribute('data-n'));
        for (var i = 0; i < list.length; i++) table[start + i] = list[i];
        el.textContent = '';
      });
    }
    return chunkLoads[k];
  }
  function unitOf(el) { return el.closest ? el.closest('[data-mc]') : null; }
  var unitLoads = new Map();
  var loaded = new Set();
  function prepare(u) {
    if (!u) return Promise.resolve();
    if (!unitLoads.has(u)) {
      var v = u.getAttribute('data-mc');
      unitLoads.set(u, Promise.all(v ? v.split(' ').map(function (k) { return loadChunk(Number(k)); }) : []).then(function () { loaded.add(u); }));
    }
    return unitLoads.get(u);
  }
  function ready(p) {
    if (loaded.has(p.unit)) return true;
    prepare(p.unit).then(function () { track(true); }, fail);
    return false;
  }
  function fill(el) {
    var i = Number(el.getAttribute('i'));
    var html = table[i];
    if (html == null) {
      hydration.missing++;
      el.setAttribute('h', 'missing');
      console.error('formula ' + i + ' is missing from the formula table');
      return;
    }
    if (el._tex == null) el._tex = el.textContent;
    el.innerHTML = html;
    el.setAttribute('h', '');
    hydration.filled++;
    hydration.live++;
  }
  function empty(el) {
    if (el._tex == null) return;
    el.textContent = el._tex;
    el.removeAttribute('h');
    hydration.emptied++;
    hydration.live--;
  }

  /* Parts: the lede and the index (filled at the start and kept), and the flow: every chapter head and section in
     document order, so their tops increase with their index. Chapter heads and plain sections are kept once filled. */
  var parts = [];
  var partOf = new Map();
  function addPart(el, keep) {
    var p = { el: el, unit: unitOf(el) || el, keep: keep, filled: false, i: parts.length, list: null, pos: 0, n: 0 };
    parts.push(p);
    partOf.set(el, p);
    return p;
  }
  doc.querySelectorAll('.lede[data-mc], #idx[data-mc]').forEach(function (el) { addPart(el, true); });
  var flowStart = parts.length;
  doc.querySelectorAll('.ch-head, section.sec').forEach(function (el) {
    addPart(el, el.classList.contains('ch-head') || el.classList.contains('sec-plain'));
  });
  var flow = parts.slice(flowStart);
  function pending(p) {
    if (!p.list) { p.list = p.el.querySelectorAll('k-m:not([h]), k-d:not([h])'); p.pos = 0; }
    return p.list;
  }
  /* Fills the rest of part p, or as much as fits before the deadline. Returns true when p is complete. */
  function fillPart(p, deadline) {
    var list = pending(p);
    var j = p.pos;
    while (j < list.length) {
      var end = Math.min(list.length, j + 4);
      for (; j < end; j++) if (!list[j].hasAttribute('h')) { fill(list[j]); p.n++; }
      if (deadline && performance.now() > deadline) break;
    }
    p.pos = j;
    if (j < list.length) return false;
    p.filled = true;
    p.list = null;
    if (!p.keep) filledSet.add(p);
    return true;
  }
  function emptyPart(p) {
    var list = p.el.querySelectorAll('k-m[h=""], k-d[h=""]');
    for (var i = 0; i < list.length; i++) empty(list[i]);
    p.filled = false;
    p.list = null;
    p.n = 0;
    filledSet.delete(p);
  }
  function fillPartSoon(p) { return prepare(p.unit).then(function () { if (!p.filled) fillPart(p, 0); }); }

  /* Binary search over the flow: the first index whose bottom (or top) is below y, in window coordinates. */
  function firstBottomBelow(y) {
    var lo = 0, hi = flow.length;
    while (lo < hi) { var m = (lo + hi) >> 1; if (flow[m].el.getBoundingClientRect().bottom > y) hi = m; else lo = m + 1; }
    return lo;
  }
  function firstTopBelow(y) {
    var lo = 0, hi = flow.length;
    while (lo < hi) { var m = (lo + hi) >> 1; if (flow[m].el.getBoundingClientRect().top >= y) hi = m; else lo = m + 1; }
    return lo;
  }

  /* The tracker. track() asks for one pass at the next frame; the pass reads positions, applies the scroll-spy,
     fills the window, and plans the slice. */
  var started = false;
  var trackQueued = false;
  var dirty = true;
  var lastFrame = 0;
  var frameMs = 16.7;
  var queue = [];       // look-ahead parts, nearest first
  var dropList = [];    // filled parts beyond the drop band
  var filledSet = new Set();
  var holding = false;
  var direction = 1;
  var lastY = window.scrollY;
  var sliceQueued = false;
  var postTask = (window.scheduler && scheduler.postTask)
    ? function (fn, pri) { scheduler.postTask(fn, { priority: pri }); }
    : function (fn) { setTimeout(fn, 0); };
  function track(force) {
    if (force) dirty = true;
    if (!trackQueued) { trackQueued = true; requestAnimationFrame(pass); }
  }
  function pass(now) {
    trackQueued = false;
    if (lastFrame) frameMs = 0.7 * frameMs + 0.3 * Math.min(200, now - lastFrame);
    lastFrame = now;
    if (progressByScript) paintProgress();
    correct(false);
    if (!dirty || !flow.length) return;
    dirty = false;
    var H = innerHeight;
    var y = window.scrollY;
    if (y !== lastY) { direction = y > lastY ? 1 : -1; lastY = y; }
    // Scroll-spy.
    var s = firstTopBelow(0.3 * H) - 1;
    if (s >= 0 && flow[s].el.getBoundingClientRect().bottom > 0) { nearest = s; applySpy(flow[s].el); }
    if (!started) return;
    // On screen and half a window around it: fill now.
    var a = firstBottomBelow(0);
    var b = firstTopBelow(H);
    var ua = firstBottomBelow(-0.5 * H), ub = firstTopBelow(1.5 * H);
    var hold = anchoring ? null : topAnchor();
    var waiting = false;
    for (var i = ua; i < ub; i++) {
      var p = flow[i];
      if (p.filled) continue;
      if (ready(p)) fillPart(p, 0); else waiting = true;
    }
    restore(hold);
    // Look-ahead, nearest first, the reading direction first.
    var ahead = direction > 0 ? FILL_AHEAD : FILL_BEHIND, behind = direction > 0 ? FILL_BEHIND : FILL_AHEAD;
    var lo = firstBottomBelow(-behind * H), hi = firstTopBelow(H + ahead * H);
    queue.length = 0;
    var up = ua - 1, down = ub;
    while (up >= lo || down < hi) {
      if (direction > 0) { if (down < hi) queue.push(flow[down++]); if (up >= lo) queue.push(flow[up--]); }
      else { if (up >= lo) queue.push(flow[up--]); if (down < hi) queue.push(flow[down++]); }
    }
    queue = queue.filter(function (q) { return !q.filled; });
    // Emptying: filled parts outside the drop band.
    if (!holding && filledSet.size) {
      var dlo = firstBottomBelow(-DROP * H), dhi = firstTopBelow(H + DROP * H);
      dropList.length = 0;
      filledSet.forEach(function (q) { var k = q.i - flowStart; if (k < dlo || k >= dhi) dropList.push(q); });
      // Farthest first.
      var mid = (a + b) / 2;
      dropList.sort(function (u, v) { return Math.abs(v.i - flowStart - mid) - Math.abs(u.i - flowStart - mid); });
    }
    if (waiting) dirty = true;
    if (queue.length || dropList.length) planSlice();
  }
  /* One slice of look-ahead filling and emptying per frame, posted from the frame so that it runs after the frame is
     drawn. The browser renders a content-visibility: auto section once it is within 150% of a window of the viewport,
     so filling a part beyond that costs script time only, while filling one inside it costs layout as well; the
     start fills everything the browser renders, and the look-ahead keeps the filled region ahead of that margin. */
  function planSlice() {
    if (sliceQueued) return;
    sliceQueued = true;
    postTask(slice, 'user-visible');
  }
  function slice() {
    sliceQueued = false;
    var t0 = performance.now();
    var budget = 5;
    var deadline = t0 + budget;
    var hold = anchoring ? null : topAnchor();
    // Emptying first when over the cap, so a fast jump through the page cannot pile up markup.
    var over = hydration.live > MAX_FILLED;
    while (over && dropList.length && performance.now() < t0 + budget * 2) { var d = dropList.shift(); if (d.filled) emptyPart(d); over = hydration.live > MAX_FILLED; }
    while (queue.length && performance.now() < deadline) {
      var p = queue[0];
      if (p.filled) { queue.shift(); continue; }
      if (!ready(p)) { queue.shift(); continue; }
      if (fillPart(p, deadline)) queue.shift();
    }
    while (dropList.length && performance.now() < deadline) { var q = dropList.shift(); if (q.filled) emptyPart(q); }
    restore(hold);
    if (queue.length || dropList.length) requestAnimationFrame(function () { planSlice(); });
  }
  addEventListener('scroll', function () { track(true); }, { passive: true });
  addEventListener('resize', function () { track(true); });

  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    root.classList.remove('mx-hydrating');
    performance.mark('mx-initial');
  }
  function fail(err) {
    console.error('math hydration failed: ' + (err && err.stack || err));
    reveal();
  }
  function topAnchor() {
    var el = doc.elementFromPoint(innerWidth / 2, 24);
    return el ? { el: el, top: el.getBoundingClientRect().top } : null;
  }
  function restore(hold) {
    if (!hold) return;
    var d = hold.el.getBoundingClientRect().top - hold.top;
    if (Math.abs(d) >= 1) scrollBy(0, d);
  }
  /* Flow parts overlapping a band from top to bottom (window coordinates). */
  function flowInBand(top, bottom) {
    var out = [];
    for (var i = firstBottomBelow(top), b = firstTopBelow(bottom); i < b; i++) out.push(flow[i]);
    return out;
  }
  /* Fill the target's part and the parts below it for one and a half screens. */
  function fillAround(el) {
    var host = el.matches('article.chapter') ? el.querySelector('.ch-head') : el.closest('.ch-head, section.sec, .lede, #idx');
    var p0 = host ? partOf.get(host) : null;
    if (!p0) return Promise.resolve();
    var list = [p0];
    for (var k = p0.i + 1, h = 0; k < parts.length && h < innerHeight * 1.5; k++) {
      list.push(parts[k]);
      h += parts[k].el.getBoundingClientRect().height;
    }
    return Promise.all(list.map(function (p) { return p.filled ? null : fillPartSoon(p); }));
  }

  /* Deep links. A target inside a skipped section moves once the blocks around it are drawn, so the jump is
     repeated, for up to 20 frames, until the target stays put at the top of the window. */
  function openAncestors(el) {
    for (var p = el.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS' && !p.open && p.id !== 'idx') p.open = true;
  }
  /* After landing, sections near the target still render at their real height, and the browser's scroll anchoring
     can pick an anchor below the target and shift the window to keep that anchor still. So the target is held: any
     scroll the reader did not cause puts it back, until the reader scrolls or presses a key, a scroll moves more
     than half a window (a deliberate jump), or 10 seconds pass. Anchoring can also fail to act, so a change in a
     chapter's size, seen by a resize observer that runs only while a target is held, puts the target back too. */
  var held = null;
  var holdObs = window.ResizeObserver ? new ResizeObserver(function () { correct(false); }) : null;
  function release() { held = null; if (holdObs) holdObs.disconnect(); }
  function correct(fromScroll) {
    if (!held) return;
    if (performance.now() > held.until) { release(); return; }
    var d = held.el.getBoundingClientRect().top - held.want;
    if (fromScroll && Math.abs(d) > innerHeight / 2) release();
    else if (Math.abs(d) >= 1) scrollBy(0, d);
  }
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { addEventListener(t, release, { passive: true, capture: true }); });
  addEventListener('scroll', function () { if (held) correct(true); }, { passive: true });
  function land(el) {
    openAncestors(el);
    el.scrollIntoView({ block: 'start' });
    // The figure kit starts the figures near a jump's target at once, instead of waiting for the reader to settle.
    doc.dispatchEvent(new CustomEvent('mx:land', { detail: el }));
    var tries = 0;
    var last = null;
    var want = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    release();
    held = { el: el, want: want, until: performance.now() + 10000 };
    if (holdObs) doc.querySelectorAll('main > *, article.chapter').forEach(function (c) { holdObs.observe(c); });
    var settle = function () {
      var top = el.getBoundingClientRect().top;
      var stable = last !== null && Math.abs(top - last) < 1;
      last = top;
      if (stable && Math.abs(top - want) < 3) return;
      if (tries++ < 20) { if (Math.abs(top - want) >= 3) el.scrollIntoView({ block: 'start' }); requestAnimationFrame(settle); }
    };
    requestAnimationFrame(settle);
    track(true);
  }
  function goTo(id, push) {
    var el = id && doc.getElementById(id);
    if (!el) return false;
    fillAround(el).then(function () { land(el); }, fail);
    if (push && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    return true;
  }
  /* For the check script: the number of unfilled formulas in parts overlapping the window and margin windows around
     it. A binary search finds those parts, so the check can call it often without disturbing what it measures. */
  function windowFilled(margin) {
    var m = (margin == null ? 0.5 : margin) * innerHeight;
    var bad = 0;
    flowInBand(-m, innerHeight + m).forEach(function (p) { if (!p.filled) bad += p.el.querySelectorAll('k-m:not([h]), k-d:not([h])').length; });
    return bad;
  }
  /* For the check script only: fill everything and stop emptying (overflow and font checks need every formula). */
  function fillAll() {
    holding = true;
    dropList.length = 0;
    return Promise.all(parts.map(function (p) { return p.filled ? null : fillPartSoon(p); }));
  }
  var nearest = 0;
  window.MX = { goTo: goTo, setTheme: setTheme, theme: theme, hydration: hydration, windowFilled: windowFilled, fillAll: fillAll, unpack: unpack };

  /* The figure kit is stored packed; it is unpacked and run now, and it unpacks each figure module when its figure
     first comes near the window. hydration.promise waits for it, so a script that drives the page finds Kit. */
  var kitEl = doc.querySelector('script[type="application/x-mx-viz"][data-part="kit"]');
  var kitLoad = !kitEl || !('DecompressionStream' in window) ? Promise.resolve() : unpack(kitEl).then(function (code) {
    var s = doc.createElement('script');
    s.textContent = code;
    doc.head.appendChild(s);
    if (!window.Kit || !window.Kit.register) throw new Error('the figure kit did not start');
  }).catch(function (err) { console.error('figure kit: ' + (err && err.stack || err)); });
  doc.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (goTo(id, true)) {
      e.preventDefault();
      if (!wideQuery.matches && idx && idx.contains(a)) idx.open = false;
    }
  });
  window.addEventListener('popstate', function () { goTo(decodeURIComponent(location.hash.slice(1)), false); });
  var toIndex = doc.querySelector('.to-index');
  if (toIndex) toIndex.addEventListener('click', function () { if (idx) idx.open = true; goTo('contents', false); });

  /* Start: fill the lede, the index, and the parts around the starting position, show the main column, then let
     the tracker keep the window filled. */
  (function start() {
    var readyResolve;
    hydration.promise = new Promise(function (r) { readyResolve = r; });
    var finish = function () { kitLoad.then(function () { hydration.ready = true; root.setAttribute('data-hydrated', 'window'); readyResolve(hydration); }); };
    if (progressByScript) paintProgress();
    if (!chunkEls.length) { parts.forEach(function (p) { p.filled = true; }); reveal(); started = true; track(true); finish(); return; }
    if (!('DecompressionStream' in window)) { fail(new Error('this browser lacks DecompressionStream')); finish(); return; }
    var hashTarget = location.hash.length > 1 ? doc.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    var first = parts.slice(0, flowStart);
    var jobs = first.map(fillPartSoon);
    /* Every math face is loaded before the column is shown. A face is otherwise fetched when the first formula
       that needs it is drawn, its text stays invisible until then (font-display: block), and once it arrives every
       formula that uses it is laid out again: four such relayouts fell inside the first 12,000 px of a scroll. */
    if (doc.fonts && doc.fonts.forEach) {
      var faces = [];
      doc.fonts.forEach(function (f) { if (/^"?KaTeX_/.test(f.family)) faces.push(f.load()); });
      jobs.push(Promise.all(faces));
    }
    if (hashTarget) jobs.push(fillAround(hashTarget));
    else flowInBand(-1.5 * innerHeight, 2.5 * innerHeight).forEach(function (p) { jobs.push(fillPartSoon(p)); });
    var guard = setTimeout(function () { if (!revealed) { console.error('math hydration of the first screens took over 4 s'); reveal(); } }, 4000);
    Promise.all(jobs).then(function () {
      clearTimeout(guard);
      reveal();
      if (hashTarget) land(hashTarget);
      started = true;
      track(true);
      finish();
    }, function (err) { fail(err); finish(); });
  })();

  /* Click-to-define drawer. Terms are marked at build time; the definitions are a JSON list. */
  var glossary = null;
  var box = doc.getElementById('def');
  var currentTerm = null;
  function closeDef() { if (!box) return; box.hidden = true; if (currentTerm) { currentTerm.setAttribute('aria-expanded', 'false'); currentTerm = null; } }
  function openDef(el) {
    if (!glossary) glossary = JSON.parse(doc.getElementById('glossary-data').textContent);
    var t = glossary[Number(el.getAttribute('data-k'))];
    if (!t) return;
    if (currentTerm) currentTerm.setAttribute('aria-expanded', 'false');
    doc.getElementById('def-title').textContent = t.t;
    doc.getElementById('def-text').innerHTML = t.d;
    var more = doc.getElementById('def-more');
    more.setAttribute('href', '#' + t.a);
    more.innerHTML = 'Where it is explained: ' + (t.at || t.a);
    box.hidden = false;
    currentTerm = el;
    el.setAttribute('aria-expanded', 'true');
  }
  doc.addEventListener('click', function (e) {
    var el = e.target;
    var term = el.closest && el.closest('.term');
    if (term) { if (currentTerm === term) closeDef(); else openDef(term); return; }
    if (!box || box.hidden) return;
    if (el.id === 'def-close' || el.id === 'def-more' || (el.closest && el.closest('#def-more')) || !box.contains(el)) closeDef();
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDef(); return; }
    var el = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && el.classList && el.classList.contains('term')) { e.preventDefault(); el.click(); }
  });
})();

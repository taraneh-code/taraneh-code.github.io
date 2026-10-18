/* cursor.js: custom cursor (a dot plus a trailing ring).
   - Only runs on devices with a real mouse (never on phones or tablets).
   - Skipped for visitors who have asked their device to reduce motion.
   - Falls back to the normal cursor over text fields and embedded content. */
(function () {
  var hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hasMouse || reduceMotion) return;

  // Styles live here so each page only needs one <script> line
  var css =
    '.has-custom-cursor, .has-custom-cursor * { cursor: none !important; }' +
    '.has-custom-cursor input, .has-custom-cursor textarea, .has-custom-cursor select { cursor: text !important; }' +
    '.cc-dot, .cc-ring { position: fixed; top: 0; left: 0; z-index: 10000; pointer-events: none; opacity: 0; border-radius: 50%; transition: opacity .25s ease; }' +
    '.cc-dot { width: 6px; height: 6px; margin: -3px 0 0 -3px; background: #593232; }' +
    '.cc-ring { width: 34px; height: 34px; margin: -17px 0 0 -17px; border: 1.5px solid #593232;' +
    '  transition: opacity .25s ease, width .25s ease, height .25s ease, margin .25s ease, background-color .25s ease, border-color .25s ease; }' +
    '.cc-ring.is-link { width: 56px; height: 56px; margin: -28px 0 0 -28px; background: rgba(255, 215, 171, .45); }' +
    '.cc-on .cc-dot, .cc-on .cc-ring { opacity: 1; }' +
    /* light version over the dark maroon/navy areas */
    '.cc-dark .cc-dot { background: #f7f2ee; }' +
    '.cc-dark .cc-ring { border-color: #f7f2ee; }' +
    '.cc-dark .cc-ring.is-link { background: rgba(247, 242, 238, .18); }';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var dot = document.createElement('div');
  var ring = document.createElement('div');
  dot.className = 'cc-dot';
  ring.className = 'cc-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  document.documentElement.classList.add('has-custom-cursor');

  var x = -100, y = -100;   // where the mouse is
  var rx = -100, ry = -100; // where the ring is (it trails behind)

  document.addEventListener('mousemove', function (e) {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    document.documentElement.classList.add('cc-on');

    var t = e.target;
    var overField = t.closest && t.closest('input, textarea, select, iframe');
    var overLink = t.closest && t.closest('a, button, summary, label, [role="button"], .btn');
    var overDark = t.closest && t.closest('.connect-footer, footer.credit, .newsletter-media');

    // Hide ours (and show the normal cursor) over fields and embeds
    document.documentElement.classList.toggle('cc-on', !overField);
    ring.classList.toggle('is-link', !!overLink);
    document.documentElement.classList.toggle('cc-dark', !!overDark);
  });

  // Hide when the mouse leaves the window
  document.addEventListener('mouseleave', function () {
    document.documentElement.classList.remove('cc-on');
  });

  // The ring eases toward the mouse each frame.
  // FOLLOW is how snappy it is: 1 = locked to the dot (no lag),
  // 0.7 = very little lag, 0.18 = long, floaty trail. Change it to taste.
  var FOLLOW = 0.7;
  function follow() {
    rx += (x - rx) * FOLLOW;
    ry += (y - ry) * FOLLOW;
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    requestAnimationFrame(follow);
  }
  follow();
})();

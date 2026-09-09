/* Interface furniture: the day/night switch and the back-to-top button.

   Both are built by script and inserted into the header and the page, rather
   than sitting in every HTML file. Four pages that each hand-copy the same
   markup is four places for it to drift. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- day / night ----
     Three states, not two. "Auto" is a real answer — it means follow the
     device, which is what most people actually want — so the switch cycles
     auto → light → dark and says which one it is on rather than pretending a
     toggle can express three things. */

  function savedScheme() {
    try { return localStorage.getItem('cup.scheme'); } catch (e) { return null; }
  }

  function osDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyScheme() {
    var s = savedScheme();
    if (s === 'light' || s === 'dark') root.setAttribute('data-scheme', s);
    else root.removeAttribute('data-scheme');

    document.querySelectorAll('[data-scheme-btn]').forEach(function (b) {
      var state = s || 'auto';
      var effective = state === 'auto' ? (osDark() ? 'dark' : 'light') : state;
      b.setAttribute('data-state', state);
      b.setAttribute('aria-label', window.cupT('switch.scheme.' + state));
      b.title = window.cupT('switch.scheme.' + state);
      var icon = b.querySelector('.schemeicon');
      if (icon) icon.setAttribute('data-shows', effective);
      var txt = b.querySelector('.schemetext');
      if (txt) txt.textContent = window.cupT('switch.scheme.' + state);
    });
  }

  function cycleScheme() {
    var order = ['auto', 'light', 'dark'];
    var now = savedScheme() || 'auto';
    var next = order[(order.indexOf(now) + 1) % order.length];
    try {
      if (next === 'auto') localStorage.removeItem('cup.scheme');
      else localStorage.setItem('cup.scheme', next);
    } catch (e) {}
    applyScheme();
  }

  function mountSchemeButton() {
    document.querySelectorAll('.switches').forEach(function (host) {
      if (host.querySelector('[data-scheme-btn]')) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip chip--icon';
      b.setAttribute('data-scheme-btn', '');
      b.innerHTML = '<span class="schemeicon" aria-hidden="true"></span>' +
                    '<span class="schemetext"></span>';
      host.insertBefore(b, host.firstChild);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-scheme-btn]')) cycleScheme();
  });

  /* The OS can change under us while the page is open, and in "auto" that has
     to be reflected without a reload. */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { applyScheme(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---- back to top ---- */

  function mountToTop() {
    if (document.querySelector('.totop')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'totop';
    b.setAttribute('data-totop', '');
    b.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M12 19V6M12 6l-6 6M12 6l6 6" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span class="sr" data-t="ui.totop">Back to top</span>';
    document.body.appendChild(b);

    b.addEventListener('click', function () {
      /* Smooth scroll is motion. Somebody who asked for less of it gets the
         instant jump, which still does the job. */
      var reduced = root.getAttribute('data-motion') === 'off' ||
        (root.getAttribute('data-motion') !== 'on' && window.matchMedia &&
         window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      /* Send focus somewhere sensible, or a keyboard user is scrolled to the
         top with their focus still stranded at the bottom of the page. */
      var first = document.querySelector('.skip') || document.querySelector('h1');
      if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
    });

    var showing = false;
    function onScroll() {
      var want = window.scrollY > 600;
      if (want === showing) return;
      showing = want;
      b.classList.toggle('is-in', want);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- boot ----
     app.js owns translation, so wait for it rather than racing it. */
  function boot() {
    mountSchemeButton();
    mountToTop();
    applyScheme();
    if (window.cupApplyLang) window.cupApplyLang();
  }

  if (window.cupT) boot();
  else document.addEventListener('cup:ready', boot, { once: true });

  document.addEventListener('cup:lang', applyScheme);
})();

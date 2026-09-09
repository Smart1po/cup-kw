/* The waiting screen.

   A deliberate pause is a cost, so this one is kept honest about itself:
     · about three quarters of a second, never more
     · a click, a tap or Escape skips it immediately
     · reduced motion turns it off completely — no delay is added at all
     · a hard timeout always releases the navigation, so a failure here can
       never strand somebody on a brand mark
   It is built by script and inserted at runtime, so if this file fails to load
   the site simply navigates the way it always did. Nothing depends on it. */

(function () {
  'use strict';

  var HOLD = 780;          /* ms the screen is held on a navigation */
  var INTRO = 1500;        /* ms for the once-per-session opening */
  var root = document.documentElement;

  function reducedMotion() {
    var set = root.getAttribute('data-motion');
    if (set === 'off') return true;
    if (set === 'on') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function lines() {
    var x = window.CUP_EXPERIENCE && window.CUP_EXPERIENCE.loading;
    if (x && x.length) return x;
    /* Enough to work before the experience file loads. Deliberately plain —
       inventing jokes here would put untranslated English in front of an
       Arabic reader. */
    return [{ en: 'Pouring…', ar: 'نعبّي…' }];
  }

  var seen = 0;
  function nextLine() {
    var all = lines();
    var lang = window.cupLang ? window.cupLang() : 'en';
    var row = all[seen % all.length];
    seen++;
    return (row && (row[lang] || row.en)) || '';
  }

  var overlay = null;
  var lineEl = null;
  var releaseTimer = null;
  var onRelease = null;

  function buildOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'wait';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML =
      '<div class="wait__in">' +
        '<div class="wait__mark" aria-hidden="true">' +
          '<svg viewBox="0 0 120 150">' +
            '<defs><clipPath id="waitcup">' +
              '<path d="M26,34 L94,34 L84,124 Q83,134 73,134 L47,134 Q37,134 36,124 Z"/>' +
            '</clipPath></defs>' +
            '<rect x="22" y="18" width="76" height="14" rx="7" class="wait__lid"/>' +
            '<rect x="55" y="0" width="9" height="20" rx="4.5" class="wait__straw"/>' +
            '<g clip-path="url(#waitcup)">' +
              '<rect x="20" y="30" width="80" height="110" class="wait__glass"/>' +
              '<rect class="wait__fill" x="20" y="30" width="80" height="110"/>' +
            '</g>' +
            '<path d="M26,34 L94,34 L84,124 Q83,134 73,134 L47,134 Q37,134 36,124 Z" ' +
                  'class="wait__outline"/>' +
          '</svg>' +
        '</div>' +
        '<p class="wait__line"></p>' +
        '<p class="wait__skip"></p>' +
      '</div>';
    lineEl = overlay.querySelector('.wait__line');
    document.body.appendChild(overlay);

    overlay.addEventListener('click', release);
    return overlay;
  }

  function release() {
    if (releaseTimer) { clearTimeout(releaseTimer); releaseTimer = null; }
    if (overlay) overlay.classList.remove('is-on');
    var fn = onRelease;
    onRelease = null;
    if (fn) fn();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-on')) release();
  });

  function show(ms, then) {
    buildOverlay();
    lineEl.textContent = nextLine();
    var skip = overlay.querySelector('.wait__skip');
    skip.textContent = window.cupT ? window.cupT('ui.skip') : '';
    overlay.classList.add('is-on');
    onRelease = then || null;
    releaseTimer = setTimeout(release, ms);
  }

  /* ---- once per session, on arrival ---- */
  function intro() {
    var already = false;
    try { already = sessionStorage.getItem('cup.seen') === '1'; } catch (e) {}
    if (already || reducedMotion()) return;
    try { sessionStorage.setItem('cup.seen', '1'); } catch (e) {}
    show(INTRO, null);
  }

  /* ---- between pages ----
     Only same-origin document links, and never a modified click: a person
     opening a link in a new tab must not be given a loading screen in this one. */
  document.addEventListener('click', function (e) {
    if (reducedMotion()) return;
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.getAttribute('href').charAt(0) === '#') return;

    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;

    e.preventDefault();
    show(HOLD, function () { location.href = url.href; });
    /* Belt and braces: whatever happens above, the navigation goes through. */
    setTimeout(function () { if (location.href !== url.href) location.href = url.href; }, HOLD + 900);
  });

  if (window.cupT) intro();
  else document.addEventListener('cup:ready', intro, { once: true });

  window.CUP_WAIT = { show: show, release: release };
})();

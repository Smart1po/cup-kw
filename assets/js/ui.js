/* Furniture: the sticky-header state, back to top, and the arrival transitions.

   Everything here is decoration over markup that is already complete. */

(function () {
  'use strict';

  var root = document.documentElement;

  function reduced() {
    var set = root.getAttribute('data-motion');
    if (set === 'off') return true;
    if (set === 'on') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ---- header ---- */

  function stickyHeader() {
    var top = document.querySelector('.top');
    if (!top) return;
    var on = false;
    function check() {
      var want = window.scrollY > 40;
      if (want === on) return;
      on = want;
      top.classList.toggle('is-stuck', want);
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ---- back to top ---- */

  function toTop() {
    if (document.querySelector('.totop')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'totop';
    b.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M12 19V6M12 6l-6 6M12 6l6 6" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span class="sr" data-t="ui.totop">Back to top</span>';
    document.body.appendChild(b);

    b.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
      /* Move focus with the view, or a keyboard user is scrolled to the top
         while their focus is still stranded at the bottom of the document. */
      var h = document.querySelector('h1');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    });

    var showing = false;
    function check() {
      var want = window.scrollY > 700;
      if (want === showing) return;
      showing = want;
      b.classList.toggle('is-in', want);
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ---- arrivals ----
     The class that hides a frame is only ever ADDED when motion is wanted. With
     reduced motion the markup is never given anything to undo, so a failure
     here cannot leave content permanently invisible — which is the single most
     expensive bug a reveal effect can have. */

  function arrivals() {
    if (reduced() || !('IntersectionObserver' in window)) return;
    var items = [].slice.call(document.querySelectorAll('[data-rise]'));
    if (!items.length) return;

    items.forEach(function (n) { n.classList.add('rise'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    items.forEach(function (n) { io.observe(n); });

    /* If anything is still hidden after the page settles — a frame that never
       intersected because it sits below a short document, say — show it. */
    setTimeout(function () {
      items.forEach(function (n) { n.classList.add('is-in'); });
    }, 4000);
  }

  function boot() {
    stickyHeader();
    toTop();
    arrivals();
    if (window.cupApplyLang) window.cupApplyLang();
  }

  if (window.cupT) boot();
  else document.addEventListener('cup:ready', boot, { once: true });
})();

/* The entrance.

   A count to one hundred and then a curtain that lifts. It runs on arrival and
   on every refresh, which is what was asked for — so the cost of that is paid
   down everywhere else it can be:

     · it is capped at about 2.2 seconds and cannot run longer
     · any key, click or tap ends it immediately
     · reduced motion removes it completely — no count, no delay, nothing
     · the page underneath is fully rendered the whole time, so this is a
       curtain in front of a finished room, never a gate in front of an empty one
     · if this file fails to load, there is no entrance and the site just opens

   The number is honest about what it is: a piece of theatre, not a progress
   bar pretending to measure something. It is paced, not polled. */

(function () {
  'use strict';

  var RUN = 2200;          /* ms from first digit to curtain up */
  var root = document.documentElement;

  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function line() {
    var all = (window.CUP_EXPERIENCE && window.CUP_EXPERIENCE.loading) || [];
    if (!all.length) return '';
    var lang = window.cupLang ? window.cupLang() : 'en';
    /* A different line each time, without Math.random, which would differ
       between a server render and the browser if this ever gains one. */
    var i = Math.floor(Date.now() / 1000) % all.length;
    return (all[i] && (all[i][lang] || all[i].en)) || '';
  }

  var node, countEl, barEl, done = false;

  function finish() {
    if (done) return;
    done = true;
    node.classList.add('is-out');
    root.removeAttribute('data-intro');
    /* Taken out of the accessibility tree and the tab order the moment it is
       spent, so nobody can tab into a curtain that is no longer there. */
    setTimeout(function () { if (node && node.parentNode) node.parentNode.removeChild(node); }, 1200);
    document.dispatchEvent(new CustomEvent('cup:entered'));
  }

  function start() {
    if (reduced()) { root.removeAttribute('data-intro'); return; }

    node = document.createElement('div');
    node.className = 'intro';
    node.setAttribute('role', 'status');
    node.setAttribute('aria-live', 'polite');
    node.innerHTML =
      '<div class="intro__in">' +
        '<p class="intro__mark">cup<b>.kw</b></p>' +
        '<p class="intro__count"><span>0</span><sup>%</sup></p>' +
        '<div class="intro__bar"><i></i></div>' +
        '<p class="intro__line"></p>' +
      '</div>' +
      '<button type="button" class="intro__skip"></button>';
    document.body.appendChild(node);
    root.setAttribute('data-intro', 'on');

    countEl = node.querySelector('.intro__count span');
    barEl = node.querySelector('.intro__bar i');
    node.querySelector('.intro__line').textContent = line();
    node.querySelector('.intro__skip').textContent = window.cupT ? window.cupT('ui.skip') : 'Skip';

    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / RUN);
      /* Eased, so it does not climb at a machine's constant rate. */
      var eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      var n = Math.round(eased * 100);
      countEl.textContent = String(n);
      barEl.style.width = n + '%';
      if (p < 1 && !done) requestAnimationFrame(step);
      else finish();
    }
    requestAnimationFrame(step);

    node.addEventListener('click', finish);
    window.addEventListener('keydown', finish, { once: true });
    window.addEventListener('pointerdown', finish, { once: true });
    /* Whatever happens above, the curtain lifts. */
    setTimeout(finish, RUN + 900);
  }

  if (window.cupT) start();
  else document.addEventListener('cup:ready', start, { once: true });
})();

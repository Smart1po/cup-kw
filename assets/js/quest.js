/* THE QUESTS — four photographs, one at a time.

   It sits before the specification on purpose. The numbers answer what the cup
   is; these answer where it goes, and that is the question somebody actually
   has first.

   Every slide is in the DOM the whole time and only one is shown, so there is
   no loading gap on the second photograph and no layout jump when it arrives.
   The three below the fold are lazy; the first is not, because it is the one
   being looked at.

   It advances on its own and stops the moment anybody touches it — an
   autoplaying carousel that keeps moving under your finger is the thing people
   hate about carousels. It also stops on hover, on focus, when the tab is
   hidden, and when the machine has asked for less movement, in which case it
   never starts. Arrow keys work. */

(function () {
  'use strict';

  var HOLD = 4200;

  var host = document.querySelector('[data-quest]');
  if (!host) return;

  var slides = [], dots = [], at = 0, timer = null, stopped = false;

  function t(k) { return window.cupT ? window.cupT(k) : k; }
  function lang() { return window.cupLang ? window.cupLang() : 'en'; }

  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function items() {
    return (window.CUP_EXPERIENCE && window.CUP_EXPERIENCE.quests) || [];
  }

  function build() {
    var list = items();
    if (!list.length) { host.hidden = true; return; }

    host.innerHTML =
      '<div class="quest__stage">' +
        '<ul class="quest__slides"></ul>' +
        '<button type="button" class="quest__arw quest__arw--prev" data-q-prev>' +
          '<span aria-hidden="true">‹</span></button>' +
        '<button type="button" class="quest__arw quest__arw--next" data-q-next>' +
          '<span aria-hidden="true">›</span></button>' +
      '</div>' +
      '<ol class="quest__dots"></ol>';

    var ul = host.querySelector('.quest__slides');
    var ol = host.querySelector('.quest__dots');

    list.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'quest__slide';
      /* aria-hidden rather than display:none on the ones behind, so the
         browser keeps them decoded and a screen reader is only ever offered
         the one on screen. */
      if (i !== 0) li.setAttribute('aria-hidden', 'true');
      li.innerHTML =
        '<img src="' + item.src + '" alt="" loading="' + (i === 0 ? 'eager' : 'lazy') +
          '" decoding="async">' +
        '<p class="quest__msg"><span></span></p>';
      ul.appendChild(li);
      slides.push(li);

      var d = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'quest__dot';
      b.addEventListener('click', function () { stop(); go(i); });
      d.appendChild(b);
      ol.appendChild(d);
      dots.push(b);
    });

    host.querySelector('[data-q-prev]').addEventListener('click', function () {
      stop(); go(at - 1);
    });
    host.querySelector('[data-q-next]').addEventListener('click', function () {
      stop(); go(at + 1);
    });

    /* Anything that means "I am looking at this one" pauses it. */
    ['pointerdown', 'touchstart'].forEach(function (ev) {
      host.addEventListener(ev, stop, { passive: true });
    });
    host.addEventListener('mouseenter', pause);
    host.addEventListener('mouseleave', resume);
    host.addEventListener('focusin', stop);

    host.addEventListener('keydown', function (e) {
      /* In Arabic the page is mirrored and so are these: the left arrow still
         means "the one that way", and that way has changed. */
      var rtl = document.documentElement.dir === 'rtl';
      if (e.key === 'ArrowRight') { stop(); go(at + (rtl ? -1 : 1)); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { stop(); go(at + (rtl ? 1 : -1)); e.preventDefault(); }
    });

    document.addEventListener('visibilitychange', function () {
      document.hidden ? pause() : resume();
    });

    words();
    go(0);
    resume();
  }

  function words() {
    var list = items();
    var l = lang();
    slides.forEach(function (li, i) {
      var item = list[i] || {};
      li.querySelector('img').alt = (l === 'ar' ? item.altAr : item.altEn) || '';
      li.querySelector('.quest__msg span').textContent =
        (l === 'ar' ? item.capAr : item.capEn) || '';
    });
    dots.forEach(function (b, i) {
      b.setAttribute('aria-label', t('quest.go') + ' ' + (i + 1));
    });
    var p = host.querySelector('[data-q-prev]');
    var n = host.querySelector('[data-q-next]');
    if (p) p.setAttribute('aria-label', t('quest.prev'));
    if (n) n.setAttribute('aria-label', t('quest.next'));
  }

  function go(i) {
    var n = slides.length;
    at = ((i % n) + n) % n;
    slides.forEach(function (li, k) {
      var on = k === at;
      li.classList.toggle('is-on', on);
      if (on) li.removeAttribute('aria-hidden');
      else li.setAttribute('aria-hidden', 'true');
    });
    dots.forEach(function (b, k) {
      b.classList.toggle('is-on', k === at);
      b.setAttribute('aria-current', String(k === at));
    });
  }

  function pause() { clearTimeout(timer); timer = null; }

  function resume() {
    if (stopped || reduced() || document.hidden) return;
    pause();
    timer = setTimeout(function () { go(at + 1); resume(); }, HOLD);
  }

  /* Stopped for good, not paused: once somebody has chosen a photograph, it is
     rude to move it off them a few seconds later. */
  function stop() { stopped = true; pause(); }

  function boot() { build(); }

  if (window.cupT) boot();
  else document.addEventListener('cup:ready', boot, { once: true });
  document.addEventListener('cup:lang', words);
})();

/* THE SHOW — one Kuwaiti day, in photographs.

   The rule this file is built to: an animation is never the only reason
   content is visible. Every scene's words are in the DOM from the start. What
   the animation does is decide which one is *foregrounded*; with motion off,
   the whole day is simply a readable list and nothing is hidden.

   The props are drawn in CSS — heat shimmer, ice, a cup-holder ring, a bag
   mouth, a hand. There are no image files in this project, so a "car" is a
   couple of arcs and a dashboard line, and it reads because it is labelled. */

(function () {
  'use strict';

  var AUTO = 5200;

  function scenes() {
    var x = window.CUP_EXPERIENCE && window.CUP_EXPERIENCE.show;
    return (x && x.scenes) || [];
  }

  function reduced() {
    var set = document.documentElement.getAttribute('data-motion');
    if (set === 'off') return true;
    if (set === 'on') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function lang() { return window.cupLang ? window.cupLang() : 'en'; }

  var host, stage, timer = null, at = 0, list = [];

  function mount() {
    host = document.querySelector('[data-show]');
    if (!host) return;
    /* Photographs only. Three of the seven hours had no photograph and were
       drawn around the 3D model; with the model moved to its own section they
       rendered as an empty stage. Two of those three also described the
       foldable handle, which belongs to the Advanced cup and not to this one,
       so dropping them takes out a blank frame and a wrong claim at once. */
    list = scenes().filter(function (s) { return !!s.photo; });
    if (!list.length) return;

    /* Every scene is on the stage at once, in a scroll-snap track, rather than
       one image being swapped in and out of a single slot. That buys three
       things: you can drag or swipe through the day yourself, the browser does
       the easing between slides, and each photograph can be laid out whole at
       its own size instead of being cropped to fit one fixed frame. */
    var slides = list.map(function (sc, i) {
      var l0 = lang();
      var inner = sc.photo
        ? '<img src="' + sc.photo.src + '" alt="' +
            String((l0 === 'ar' ? sc.photo.altAr : sc.photo.altEn) || '').replace(/"/g, '&quot;') +
          '" loading="lazy" decoding="async">'
        : '';
      return '<div class="show__slide" data-i="' + i + '">' + inner + '</div>';
    }).join('');

    host.innerHTML =
      '<div class="show__stage">' +
        /* Four blank shapes the stylesheet repurposes per scene: shimmer lines
           for the heat, crystals for the ice, a cup-holder ring for the car, a
           bag mouth, a hand. Keeping them anonymous here means a new prop is a
           CSS change, not a JavaScript one. */
        '<div class="show__props" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        '<div class="show__track" tabindex="0" aria-label="The day, scene by scene">' +
          slides +
        '</div>' +
      '</div>' +
      '<div class="show__script"></div>' +
      '<div class="show__controls">' +
        '<button type="button" class="chip" data-show-prev></button>' +
        '<div class="show__dots" role="tablist"></div>' +
        '<button type="button" class="chip" data-show-next></button>' +
        '<button type="button" class="chip" data-show-play></button>' +
      '</div>';

    stage = host.querySelector('.show__stage');

    /* Scrolling the track is a first-class way to move through the day, so the
       dots follow it, and touching it stops the timer — nothing should slide
       out from under a hand that is already on it. */
    var track = host.querySelector('.show__track');
    var settle = null;
    track.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = nearest(track);
        if (i !== at) mark(i);
      }, 90);
    }, { passive: true });
    track.addEventListener('pointerdown', pause);

    /* Every scene's copy is written into the page now, not when its turn comes.
       Turning the animation off leaves a readable account of the whole day. */
    var script = host.querySelector('.show__script');
    list.forEach(function (s, i) {
      var d = document.createElement('article');
      d.className = 'show__scene';
      d.setAttribute('data-i', String(i));
      d.innerHTML =
        '<p class="show__time"></p>' +
        '<h3 class="show__h"></h3>' +
        '<p class="show__b"></p>';
      script.appendChild(d);
    });

    var dots = host.querySelector('.show__dots');
    list.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'show__dot';
      b.setAttribute('role', 'tab');
      b.addEventListener('click', function () { go(i, true); });
      dots.appendChild(b);
    });

    host.querySelector('[data-show-prev]').addEventListener('click', function () {
      go((at - 1 + list.length) % list.length, true);
    });
    host.querySelector('[data-show-next]').addEventListener('click', function () {
      go((at + 1) % list.length, true);
    });
    host.querySelector('[data-show-play]').addEventListener('click', function () {
      timer ? pause() : play();
    });

    words();
    go(0, false);
    if (!reduced()) play();

    new MutationObserver(function () {
      reduced() ? pause() : play();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });

    document.addEventListener('cup:lang', words);
  }

  function words() {
    var l = lang();
    host.querySelectorAll('.show__scene').forEach(function (node, i) {
      var s = list[i];
      node.querySelector('.show__time').textContent = s.timeOfDay || '';
      node.querySelector('.show__h').textContent = (l === 'ar' ? s.headlineAr : s.headlineEn) || '';
      node.querySelector('.show__b').textContent = (l === 'ar' ? s.bodyAr : s.bodyEn) || '';
    });
    var prev = host.querySelector('[data-show-prev]');
    var next = host.querySelector('[data-show-next]');
    var play = host.querySelector('[data-show-play]');
    prev.textContent = window.cupT('show.prev');
    next.textContent = window.cupT('show.next');
    play.textContent = window.cupT(timer ? 'show.pause' : 'show.play');
    host.querySelectorAll('.show__dot').forEach(function (d, i) {
      d.setAttribute('aria-label', (list[i].timeOfDay || '') + ' ' +
        ((l === 'ar' ? list[i].headlineAr : list[i].headlineEn) || ''));
    });
  }

  /* Paint everything that follows the current scene. Split out from go() because
     a scroll can change which scene is showing without anybody calling go(). */
  function mark(i) {
    at = i;
    var s = list[i];

    host.querySelectorAll('.show__scene').forEach(function (n, j) {
      n.classList.toggle('is-on', j === i);
    });
    host.querySelectorAll('.show__dot').forEach(function (d, j) {
      d.classList.toggle('is-on', j === i);
      d.setAttribute('aria-selected', String(j === i));
    });
    host.querySelectorAll('.show__slide').forEach(function (n, j) {
      n.classList.toggle('is-on', j === i);
    });

    /* One prop attribute drives everything the stage draws. CSS owns the look,
       so the scene list stays pure content. */
    stage.setAttribute('data-prop', s.prop || 'idle');
    stage.classList.toggle('has-photo', !!s.photo);
  }

  function go(i, byHand) {
    mark(i);
    var track = host.querySelector('.show__track');
    var slide = track && track.children[i];
    if (track && slide) {
      /* offsetLeft rather than index x width, so this still lands on the right
         slide when the page is flipped to right-to-left. */
      var left = slide.offsetLeft - track.offsetLeft;
      if (track.scrollTo) track.scrollTo({ left: left, behavior: reduced() ? 'auto' : 'smooth' });
      else track.scrollLeft = left;
    }
    if (byHand) pause();
  }

  /* Which slide the track has actually come to rest on. Read from geometry
     rather than kept as a counter, because the visitor can scroll it themselves
     and the dots have to agree with what is on screen. */
  function nearest(track) {
    var best = 0, bestD = Infinity;
    [].forEach.call(track.children, function (n, i) {
      var d = Math.abs((n.offsetLeft - track.offsetLeft) - track.scrollLeft);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function play() {
    if (timer || reduced() || list.length < 2) return;
    timer = setInterval(function () { go((at + 1) % list.length, false); }, AUTO);
    host.classList.add('is-playing');
    words();
  }

  function pause() {
    if (timer) { clearInterval(timer); timer = null; }
    host.classList.remove('is-playing');
    if (host) words();
  }

  if (window.cupT) mount();
  else document.addEventListener('cup:ready', mount, { once: true });
})();

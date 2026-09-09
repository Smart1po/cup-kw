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
    if (!host || !scenes().length) return;
    list = scenes();

    host.innerHTML =
      '<div class="show__stage">' +
        /* Four blank shapes the stylesheet repurposes per scene: shimmer lines
           for the heat, crystals for the ice, a cup-holder ring for the car, a
           bag mouth, a hand. Keeping them anonymous here means a new prop is a
           CSS change, not a JavaScript one. */
        '<div class="show__props" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        /* Photographs only. The 3D model used to stand in on the scenes with
           no photograph, which meant the day kept swapping a turnable object in
           and out from under you while it advanced. The model now has its own
           section further down the page, where nothing takes it away. */
        '<img class="show__photo" alt="" hidden>' +
      '</div>' +
      '<div class="show__script"></div>' +
      '<div class="show__controls">' +
        '<button type="button" class="chip" data-show-prev></button>' +
        '<div class="show__dots" role="tablist"></div>' +
        '<button type="button" class="chip" data-show-next></button>' +
        '<button type="button" class="chip" data-show-play></button>' +
      '</div>';

    stage = host.querySelector('.show__stage');

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

  function go(i, byHand) {
    at = i;
    var s = list[i];

    host.querySelectorAll('.show__scene').forEach(function (n, j) {
      n.classList.toggle('is-on', j === i);
    });
    host.querySelectorAll('.show__dot').forEach(function (d, j) {
      d.classList.toggle('is-on', j === i);
      d.setAttribute('aria-selected', String(j === i));
    });

    /* One prop attribute drives everything the stage draws. CSS owns the look,
       so the scene list stays pure content. */
    stage.setAttribute('data-prop', s.prop || 'idle');

    var img = host.querySelector('.show__photo');
    var l = lang();
    if (s.photo) {
      img.src = s.photo.src;
      img.alt = (l === 'ar' ? s.photo.altAr : s.photo.altEn) || '';
      img.hidden = false;
      stage.classList.add('has-photo');
    } else {
      /* No photograph for this hour: the stage is the drawn props and the
         words, which is what the props were always for. */
      img.hidden = true;
      img.removeAttribute('src');
      stage.classList.remove('has-photo');
    }

    if (byHand) pause();
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

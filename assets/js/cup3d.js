/* The cup, in three dimensions, with no library and no image file.

   HOW IT WORKS
   Each part — body, lid, straw, handle — is a ring of thin panels, every one
   turned to its own angle and pushed out to the radius:
       rotateY(i · step) translateZ(R)
   Panels facing away are dropped by backface-visibility, so the far half never
   shows through the near half. Spin the ring and you are rotating geometry.

   THE TAPER
   The real cup is 10 cm across the top and 7.5 cm across the base, so the body
   is a cone frustum, not a cylinder. Two things make that out of flat panels:
   each panel is tilted inward by atan((Rtop − Rbase) / height), and each is
   clipped to a trapezoid so the ring closes without gaps at the narrow end.

   WHY THE LIGHTING IS A FLAT OVERLAY
   A body of revolution turning about its own axis has a silhouette that never
   changes. So the shading can sit in a fixed layer in front of everything
   rather than on the panels: the light stays put while the printing rotates
   past it, which is what happens to a real cup on a real table. It is also
   nearly free, which matters — an earlier version put a blend mode there and
   locked the renderer solid.

   THE FACE
   Optional, and off by default. See setExpression, and the rules in
   DECISIONS.md about where the character is not allowed to appear. */

window.CUP3D = (function () {
  'use strict';

  var PANELS = 24;
  var STRAW_PANELS = 8;
  var DEG = 180 / Math.PI;

  function el(cls, parent) {
    var d = document.createElement('div');
    if (cls) d.className = cls;
    if (parent) parent.appendChild(d);
    return d;
  }

  /* Relative luminance, so a cream cup gets dark printing and a navy cup light
     printing, instead of one guess that fails half the collection. */
  function readableInk(hex) {
    var c = String(hex || '#888').replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var rgb = [0, 2, 4].map(function (i) {
      var v = parseInt(c.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var L = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    return L > 0.42 ? '#231F1C' : '#F4EEE3';
  }

  /* One ring. rTop and rBot differing makes a frustum instead of a cylinder. */
  function ring(parent, cls, rTop, rBot, height, top, count) {
    var group = el('c3d__group ' + cls, parent);
    group.style.top = top + 'px';

    var rMid = (rTop + rBot) / 2;
    var lean = Math.atan((rTop - rBot) / height) * DEG;
    var step = 360 / count;

    /* Widest edge sets the panel width; the narrow end is clipped back to it.
       The whisker of overlap stops the seams reading as hairlines. */
    var wTop = (2 * Math.PI * rTop) / count + 1.4;
    var inset = rTop === rBot ? 0 : ((1 - (rBot / rTop)) / 2) * 100;

    for (var i = 0; i < count; i++) {
      var p = el('c3d__panel', group);
      p.style.width = wTop + 'px';
      p.style.height = height + 'px';
      p.style.marginLeft = (-wTop / 2) + 'px';
      p.style.transform =
        'rotateY(' + (i * step) + 'deg) translateZ(' + rMid + 'px) rotateX(' + (-lean) + 'deg)';
      if (inset) {
        p.style.clipPath =
          'polygon(0 0, 100% 0, ' + (100 - inset).toFixed(2) + '% 100%, ' + inset.toFixed(2) + '% 100%)';
      }
    }
    return group;
  }

  function disc(parent, cls, radius, top) {
    var d = el('c3d__disc ' + cls, parent);
    d.style.width = (radius * 2) + 'px';
    d.style.height = (radius * 2) + 'px';
    d.style.marginLeft = (-radius) + 'px';
    d.style.top = top + 'px';
    d.style.marginTop = (-radius) + 'px';
    d.style.transform = 'rotateX(90deg)';
    return d;
  }

  function build(host, opts) {
    opts = opts || {};
    var C = window.CUP_CONTENT || {};
    var prod = C.product || {};

    /* Proportions are the spec, not an impression of it. Correct the numbers in
       content.js and the model changes shape. */
    var hCm = prod.heightCm || 27;
    var topCm = prod.topDiameterCm || 10;
    var baseCm = prod.baseDiameterCm || 7.5;

    var totalH = opts.height || 340;
    var scale = totalH / hCm;
    var R_TOP = (topCm * scale) / 2;
    var R_BASE = (baseCm * scale) / 2;

    var LID_H = Math.round(totalH * 0.17);
    var LID_R = R_TOP + 2;
    var BODY_H = totalH - LID_H + 8;
    var STRAW_R = Math.max(4.5, R_TOP * 0.12);
    var STRAW_H = Math.round(totalH * 0.24);
    var STRAW_X = R_TOP * 0.34;

    var TOP = 6;
    var LID_TOP = TOP + STRAW_H - 10;
    var BODY_TOP = LID_TOP + LID_H - 8;
    var BODY_BOT = BODY_TOP + BODY_H;
    var SCENE_H = BODY_BOT + 26;

    /* The body narrows over its own height, but the lid sits on the widest part,
       so the taper has to be worked out for the body span alone. */
    var R_BODY_TOP = R_TOP;
    var R_BODY_BOT = R_BASE;

    host.classList.add('c3d');
    host.innerHTML = '';
    host.style.setProperty('--scene-h', SCENE_H + 'px');
    host.style.setProperty('--cup-r', R_TOP + 'px');
    host.style.setProperty('--cup-r-base', R_BASE + 'px');
    host.style.setProperty('--body-top', BODY_TOP + 'px');
    host.style.setProperty('--body-h', BODY_H + 'px');
    host.style.setProperty('--lid-top', LID_TOP + 'px');

    var scene = el('c3d__scene', host);
    var obj = el('c3d__obj', scene);

    ring(obj, 'c3d__body', R_BODY_TOP, R_BODY_BOT, BODY_H, BODY_TOP, PANELS);

    var hasBand = prod.saduBand === true;
    var bandH = Math.round(BODY_H * 0.16);
    var bandTop = BODY_TOP + Math.round(BODY_H * 0.32);
    if (hasBand) {
      var f = 1 - (1 - R_BODY_BOT / R_BODY_TOP) * ((bandTop - BODY_TOP) / BODY_H);
      var f2 = 1 - (1 - R_BODY_BOT / R_BODY_TOP) * ((bandTop + bandH - BODY_TOP) / BODY_H);
      ring(obj, 'c3d__band', R_BODY_TOP * f + 1.5, R_BODY_TOP * f2 + 1.5, bandH, bandTop, PANELS);
    }

    ring(obj, 'c3d__lid', LID_R, LID_R, LID_H, LID_TOP, PANELS);
    disc(obj, 'c3d__lidtop', LID_R, LID_TOP);

    var hole = disc(obj, 'c3d__hole', STRAW_R * 2.1, LID_TOP - 1);
    hole.style.marginLeft = (-STRAW_R * 2.1 + STRAW_X) + 'px';

    var straw = ring(obj, 'c3d__straw', STRAW_R, STRAW_R, STRAW_H, TOP, STRAW_PANELS);
    straw.style.marginLeft = STRAW_X + 'px';
    var strawTop = disc(obj, 'c3d__strawtop', STRAW_R, TOP);
    strawTop.style.marginLeft = (-STRAW_R + STRAW_X) + 'px';

    disc(obj, 'c3d__base', R_BASE, BODY_BOT);

    /* ---- the foldable handle ----
       A plane whose normal is tangential, so it contains the cup's axis and
       sticks straight out from the side: go to the surface at the chosen angle,
       then turn the plane a quarter turn. Folded, it lies flat against the body,
       which is the whole point of it. */
    var handle = el('c3d__handle', obj);
    var handleAngle = 96;
    handle.style.top = (BODY_TOP + BODY_H * 0.10) + 'px';
    handle.style.height = (BODY_H * 0.42) + 'px';
    handle.style.transform =
      'rotateY(' + handleAngle + 'deg) translateZ(' + (R_TOP * 0.92) + 'px) rotateY(90deg)';

    /* ---- printing ----
       Two planes on the front of the cup, so the marks turn out of view as it
       spins. Each is narrow relative to the radius, keeping the flat-versus-
       curved error below the threshold anyone notices. */
    function plane(cls, y) {
      var p = el('c3d__decal ' + cls, obj);
      p.style.transform = 'translateX(-50%) translateZ(' + (R_TOP + 2.2) + 'px)';
      p.style.top = y + 'px';
      return p;
    }

    var above = plane('c3d__decal--top', BODY_TOP + BODY_H * (hasBand ? 0.08 : 0.06));
    var logo = el('c3d__logo', above);
    logo.textContent = 'CUP';

    /* The blueprint column — the architectural line drawing from the product
       artwork, reduced to what survives at this size. */
    if (prod.blueprint !== false && !hasBand) el('c3d__blueprint', above);

    var below = plane('c3d__decal--bot',
      hasBand ? (bandTop + bandH + BODY_H * 0.06) : (BODY_TOP + BODY_H * 0.60));
    var word = el('c3d__word', below);
    word.textContent = opts.wordmark || 'IDEAS FLOW FURTHER';

    var eng = el('c3d__eng', below);

    /* ---- the face ----
       Built and left empty. It only appears once setExpression is called, so a
       page that never asks for a character never gets one. */
    var face = el('c3d__face', obj);
    face.style.transform = 'translateX(-50%) translateZ(' + (R_TOP + 2.6) + 'px)';
    face.style.top = (BODY_TOP + BODY_H * 0.30) + 'px';
    var eyeL = el('c3d__eye c3d__eye--l', face);
    var eyeR = el('c3d__eye c3d__eye--r', face);
    el('c3d__pupil', eyeL);
    el('c3d__pupil', eyeR);

    el('c3d__shade', scene);
    el('c3d__shadow', scene);

    /* ---- state ---- */
    var angle = opts.angle == null ? -18 : opts.angle;
    var api = {};

    function paint() { obj.style.transform = 'rotateX(-7deg) rotateY(' + angle + 'deg)'; }

    api.el = host;

    api.setColour = function (hex) {
      host.style.setProperty('--cup-body', hex);
      host.style.setProperty('--cup-ink', readableInk(hex));
      return api;
    };

    api.setEngraving = function (text, script) {
      var isArabic = script === 'arabic';
      var value = text || '';
      eng.textContent = value;
      eng.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
      eng.style.fontFamily = isArabic ? 'var(--face-arabic)' : 'var(--face-latin)';

      /* Set the type down as the text lengthens so a name inside the limit is
         always shown whole. Clipping would be the preview lying about the one
         thing that cannot be undone. */
      var n = Array.from(value).length;
      var base = isArabic ? 16 : 14;
      eng.style.fontSize =
        (n <= 7 ? base : Math.max(isArabic ? 9 : 8, base - (n - 7) * 0.7)).toFixed(1) + 'px';
      return api;
    };

    api.setHandle = function (on) {
      host.classList.toggle('has-handle', !!on);
      return api;
    };

    /* Expressions are data attributes; the CSS owns what each one looks like,
       so a designer can retune the character without touching this file. */
    api.setExpression = function (id) {
      if (!id) { host.removeAttribute('data-face'); return api; }
      host.setAttribute('data-face', id);
      return api;
    };

    api.lookAt = function (dx, dy) {
      face.style.setProperty('--look-x', Math.max(-1, Math.min(1, dx)).toFixed(2));
      face.style.setProperty('--look-y', Math.max(-1, Math.min(1, dy)).toFixed(2));
      return api;
    };

    api.setAngle = function (a) { angle = a; paint(); return api; };
    api.getAngle = function () { return angle; };
    api.spinTo = function (a) { return api.setAngle(a); };

    /* ---- turning it ----
       Pointer drag and arrow keys, because a control that only works with a
       mouse is not a control. */
    var dragging = false, lastX = 0, moved = 0;

    scene.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0; lastX = e.clientX;
      try { scene.setPointerCapture(e.pointerId); } catch (err) {}
      host.classList.add('is-dragging');
    });

    scene.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var d = e.clientX - lastX;
      moved += Math.abs(d);
      angle += d * 0.6;
      lastX = e.clientX;
      paint();
    });

    function stop(e) {
      if (!dragging) return;
      dragging = false;
      host.classList.remove('is-dragging');
      try {
        if (e && e.pointerId != null && scene.hasPointerCapture(e.pointerId)) {
          scene.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
    }
    scene.addEventListener('pointerup', stop);
    scene.addEventListener('pointercancel', stop);

    host.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { angle -= 12; paint(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { angle += 12; paint(); e.preventDefault(); }
    });

    /* ---- the slow turn ----
       Same motion switch as everything else, and it yields the moment somebody
       takes hold of the cup themselves. */
    var raf = null;
    function motionWanted() {
      var set = document.documentElement.getAttribute('data-motion');
      if (set === 'off') return false;
      if (set === 'on') return true;
      return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function tick() {
      if (!dragging) { angle += (opts.spinSpeed || 0.16); paint(); }
      raf = requestAnimationFrame(tick);
    }

    function syncMotion() {
      var want = motionWanted() && opts.spin !== false;
      if (want && raf === null) raf = requestAnimationFrame(tick);
      if (!want && raf !== null) { cancelAnimationFrame(raf); raf = null; }
    }
    api.stopSpin = function () { opts.spin = false; syncMotion(); return api; };

    new MutationObserver(syncMotion).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-motion']
    });

    host.setAttribute('tabindex', '0');
    host.setAttribute('role', 'img');

    api.setColour(opts.colour || '#2A3A52');
    api.setHandle(opts.handle !== false && prod.foldableHandle === true);
    if (opts.expression) api.setExpression(opts.expression);
    paint();
    syncMotion();

    return api;
  }

  return { build: build, readableInk: readableInk };
})();

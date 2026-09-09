/* The cup, in three dimensions, with no library and no image file.

   HOW IT WORKS
   Each cylinder — the body, the woven band, the lid, the straw — is built from
   a ring of thin vertical panels, every one turned to its own angle and pushed
   out to the radius:  rotateY(i · step) translateZ(R). Panels facing away are
   dropped by backface-visibility, so the far half of the cup never shows through
   the near half. Spin the ring and you are genuinely rotating geometry, not
   sliding a picture.

   WHY THE LIGHTING IS A FLAT OVERLAY
   A cylinder turning about its own axis has a silhouette that never changes.
   That means the shading can live in a fixed layer in front of the whole thing
   rather than on the panels: the light stays put while the printing rotates
   past it, which is exactly what happens to a real cup on a table. It is also
   far cheaper than relighting thirty-odd panels every frame.

   Proportions come from product.heightCm and product.diameterCm in content.js,
   so correcting the spec corrects the model. */

window.CUP3D = (function () {
  'use strict';

  /* Enough panels that the facets disappear at this size, few enough that the
     three rings plus the straw stay under a hundred composited layers. Going
     higher looked no better and cost frames. */
  var PANELS = 24;
  var STRAW_PANELS = 8;

  function el(cls, parent) {
    var d = document.createElement('div');
    if (cls) d.className = cls;
    if (parent) parent.appendChild(d);
    return d;
  }

  /* Relative luminance, so a cream cup gets dark printing and a navy cup gets
     light printing instead of one guess that fails half the collection. */
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

  /* One ring of panels. `texture` is a callback that decorates each panel, used
     by the band so its weave can be laid on without a second mechanism. */
  function ring(parent, cls, radius, height, top, count, texture) {
    var group = el('c3d__group ' + cls, parent);
    group.style.setProperty('--h', height + 'px');
    group.style.top = top + 'px';

    var step = 360 / count;
    /* A whisker of overlap, or the seams read as hairlines against the light. */
    var w = (2 * Math.PI * radius) / count + 1.4;

    for (var i = 0; i < count; i++) {
      var p = el('c3d__panel', group);
      p.style.width = w + 'px';
      p.style.height = height + 'px';
      p.style.marginLeft = (-w / 2) + 'px';
      p.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
      if (texture) texture(p, i, count, w);
    }
    return group;
  }

  function disc(parent, cls, radius, top, tilt) {
    var d = el('c3d__disc ' + cls, parent);
    d.style.width = (radius * 2) + 'px';
    d.style.height = (radius * 2) + 'px';
    d.style.marginLeft = (-radius) + 'px';
    d.style.top = top + 'px';
    d.style.marginTop = (-radius) + 'px';
    d.style.transform = 'rotateX(' + (tilt || 90) + 'deg)';
    return d;
  }

  function build(host, opts) {
    opts = opts || {};
    var C = window.CUP_CONTENT || {};
    var prod = C.product || {};

    var heightCm = prod.heightCm || 22;
    var diaCm = prod.diameterCm || 7;

    /* Scale so the tallest dimension fits the box, then derive everything else
       from the real ratio rather than from taste. */
    var totalH = 330;
    var R = (totalH * (diaCm / heightCm)) / 2;

    var LID_H = Math.round(totalH * 0.20);
    var LID_R = R + 2.5;
    var BODY_H = totalH - LID_H + 10;      /* +10 so the lid laps over the seam */
    var STRAW_R = Math.max(5, R * 0.135);
    var STRAW_H = Math.round(totalH * 0.29);
    var STRAW_X = R * 0.30;

    var TOP = 8;
    var LID_TOP = TOP + STRAW_H - 12;
    var BODY_TOP = LID_TOP + LID_H - 10;
    var SCENE_H = BODY_TOP + BODY_H + 24;

    host.classList.add('c3d');
    host.innerHTML = '';
    host.style.setProperty('--scene-h', SCENE_H + 'px');
    host.style.setProperty('--cup-r', R + 'px');
    host.style.setProperty('--body-top', BODY_TOP + 'px');
    host.style.setProperty('--body-h', BODY_H + 'px');
    host.style.setProperty('--lid-top', LID_TOP + 'px');

    var scene = el('c3d__scene', host);
    var obj = el('c3d__obj', scene);

    /* ---- body ---- */
    ring(obj, 'c3d__body', R, BODY_H, BODY_TOP, PANELS);

    /* ---- the Sadu band ----
       A woven sleeve sits a little proud of the body, so it gets its own ring
       at a slightly larger radius rather than being painted on. */
    var hasBand = prod.saduBand !== false;
    var bandH = Math.round(BODY_H * 0.17);
    var bandTop = BODY_TOP + Math.round(BODY_H * 0.30);
    if (hasBand) ring(obj, 'c3d__band', R + 1.5, bandH, bandTop, PANELS);

    /* ---- lid ---- */
    ring(obj, 'c3d__lid', LID_R, LID_H, LID_TOP, PANELS);
    disc(obj, 'c3d__lidtop', LID_R, LID_TOP);

    /* the moulded ring the straw passes through */
    var hole = disc(obj, 'c3d__hole', STRAW_R * 2.1, LID_TOP - 1);
    hole.style.marginLeft = (-STRAW_R * 2.1 + STRAW_X) + 'px';

    /* ---- straw ---- */
    var straw = ring(obj, 'c3d__straw', STRAW_R, STRAW_H, TOP, STRAW_PANELS);
    straw.style.marginLeft = STRAW_X + 'px';
    var strawTop = disc(obj, 'c3d__strawtop', STRAW_R, TOP);
    strawTop.style.marginLeft = (-STRAW_R + STRAW_X) + 'px';

    /* ---- base ---- */
    disc(obj, 'c3d__base', R, BODY_TOP + BODY_H);

    /* ---- the printing ----
       Two planes at the front of the cylinder, so the marks turn out of view as
       the cup spins. Each plane is narrow relative to the radius, which keeps
       the flat-versus-curved error below the threshold anyone notices.

       The split follows the product sheet: the logo sits above the woven band
       and the wordmark below it. On a plain cup with no band the two close up
       and the dotted texture column fills the space between them, which is how
       the unbanded cup is actually printed. */
    function plane(cls, y) {
      var p = el('c3d__decal ' + cls, obj);
      p.style.transform = 'translateX(-50%) translateZ(' + (R + 2.2) + 'px)';
      p.style.top = y + 'px';
      return p;
    }

    var above = plane('c3d__decal--top', BODY_TOP + BODY_H * (hasBand ? 0.09 : 0.07));
    var logo = el('c3d__logo', above);
    logo.textContent = 'CUP';
    if (!hasBand) el('c3d__dots', above);

    var below = plane('c3d__decal--bot',
      hasBand ? (bandTop + bandH + BODY_H * 0.07) : (BODY_TOP + BODY_H * 0.62));
    var word = el('c3d__word', below);
    word.textContent = '[ MOUDHI ]';

    var eng = el('c3d__eng', below);

    /* ---- fixed lighting and contact shadow, outside the rotating group ---- */
    el('c3d__shade', scene);
    el('c3d__shadow', scene);

    /* ---- state ---- */
    var angle = opts.angle == null ? -22 : opts.angle;
    var api = {};

    function paint() {
      obj.style.transform = 'rotateX(-7deg) rotateY(' + angle + 'deg)';
    }

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

      /* Set the engraving down in size as it gets longer, so a name inside the
         limit is always shown whole. Clipping it would be the preview telling a
         lie about the thing that cannot be undone — somebody would approve a cup
         on the strength of text the machine was never going to fit. Anything
         past the limit is the counter's job to flag, not this one's. */
      var n = Array.from(value).length;
      var base = isArabic ? 16 : 14;
      var size = n <= 7 ? base : Math.max(isArabic ? 9 : 8, base - (n - 7) * 0.7);
      eng.style.fontSize = size.toFixed(1) + 'px';
      return api;
    };

    api.setAngle = function (a) { angle = a; paint(); return api; };
    api.getAngle = function () { return angle; };

    /* ---- turning it ----
       Pointer drag, and arrow keys, because a control that only works with a
       mouse is not a control. */
    var dragging = false, lastX = 0;

    scene.addEventListener('pointerdown', function (e) {
      dragging = true;
      lastX = e.clientX;
      scene.setPointerCapture(e.pointerId);
      host.classList.add('is-dragging');
    });

    scene.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      angle += (e.clientX - lastX) * 0.6;
      lastX = e.clientX;
      paint();
    });

    function stop(e) {
      if (!dragging) return;
      dragging = false;
      host.classList.remove('is-dragging');
      if (e.pointerId != null && scene.hasPointerCapture(e.pointerId)) {
        scene.releasePointerCapture(e.pointerId);
      }
    }
    scene.addEventListener('pointerup', stop);
    scene.addEventListener('pointercancel', stop);

    host.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { angle -= 12; paint(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { angle += 12; paint(); e.preventDefault(); }
    });

    /* ---- the slow turn ----
       Governed by the same motion switch as everything else, and stopped the
       moment somebody takes hold of the cup themselves. */
    var raf = null;
    function motionWanted() {
      var set = document.documentElement.getAttribute('data-motion');
      if (set === 'off') return false;
      if (set === 'on') return true;
      return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function tick() {
      if (!dragging) { angle += 0.18; paint(); }
      raf = requestAnimationFrame(tick);
    }

    function syncMotion() {
      var want = motionWanted() && opts.spin !== false;
      if (want && raf === null) raf = requestAnimationFrame(tick);
      if (!want && raf !== null) { cancelAnimationFrame(raf); raf = null; }
    }

    new MutationObserver(syncMotion).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-motion']
    });

    host.setAttribute('tabindex', '0');
    host.setAttribute('role', 'img');

    api.setColour(opts.colour || '#2A3A52');
    paint();
    syncMotion();

    return api;
  }

  return { build: build, readableInk: readableInk };
})();

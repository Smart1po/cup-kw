/* The cup, in three dimensions, with no library and no image file.

   HOW IT WORKS
   Each part — body, lid, straw, handle — is a ring of thin panels, every one
   turned to its own angle and pushed out to the radius:
       rotateY(i · step) translateZ(R)
   Panels facing away are dropped by backface-visibility, so the far half never
   shows through the near half. Spin the ring and you are rotating geometry.

   THE TAPER
   The real cup is 10 cm across the mouth and 7.5 cm across the base, so the
   body is a cone frustum. Two things make one out of flat panels: each is
   tilted inward by atan((Rtop − Rbase) / height), and each is clipped to a
   trapezoid so the ring closes without gaps at the narrow end.

   TURNING AND ZOOMING
   Both axes. Drag sideways to spin it, drag up and down to tip it, wheel or
   pinch to zoom, and every one of those has a keyboard equivalent. Pitch is
   clamped: past about fifty degrees you are looking into a lid that has no
   inside modelled, and the illusion is cheaper to protect than to build.

   WHY THE LIGHTING IS A FLAT OVERLAY
   A body of revolution spun about its own axis keeps the same silhouette, so
   the light can sit in a fixed layer in front rather than on the panels — it
   stays put while the printing rotates past, which is what happens to a real
   cup on a real table. It costs nothing per frame, which matters: an earlier
   version used a blend mode here and locked the renderer solid. Tipping the cup
   does change the silhouette, which is the other reason pitch is clamped. */

window.CUP3D = (function () {
  'use strict';

  var PANELS = 24;
  var STRAW_PANELS = 8;
  var DEG = 180 / Math.PI;

  var PITCH_MIN = -52, PITCH_MAX = 26;
  var ZOOM_MIN = 0.65, ZOOM_MAX = 2.4;

  function el(cls, parent) {
    var d = document.createElement('div');
    if (cls) d.className = cls;
    if (parent) parent.appendChild(d);
    return d;
  }

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

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

    var hCm = prod.heightCm || 27;
    var topCm = prod.topDiameterCm || 10;
    var baseCm = prod.baseDiameterCm || 7.5;

    var totalH = opts.height || 400;
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
    var SCENE_H = BODY_BOT + 30;

    host.classList.add('c3d');
    host.innerHTML = '';
    host.style.setProperty('--scene-h', SCENE_H + 'px');
    host.style.setProperty('--cup-r', R_TOP + 'px');
    host.style.setProperty('--body-top', BODY_TOP + 'px');
    host.style.setProperty('--body-h', BODY_H + 'px');
    host.style.setProperty('--lid-top', LID_TOP + 'px');
    host.style.setProperty('--zoom', '1');

    /* The lighting overlay is a rectangle, but the cup is a frustum — so
       without these the overlay's dark edge hangs in the air either side of
       the narrow base. They let the CSS clip it to the real silhouette. */
    var shadeH = (BODY_TOP + BODY_H) - LID_TOP;
    host.style.setProperty('--shade-body', (((BODY_TOP - LID_TOP) / shadeH) * 100).toFixed(2) + '%');
    host.style.setProperty('--shade-inset', (((1 - R_BASE / R_TOP) / 2) * 100).toFixed(2) + '%');

    var scene = el('c3d__scene', host);
    var obj = el('c3d__obj', scene);

    /* The body, then a short chamfer at the foot so the silhouette curves into
       the base instead of ending on a hard right angle. It is a separate ring
       rather than a border-radius on each panel because a radius scallops: at
       roughly 17px of panel, a 6px corner turns the rim into a row of notches.
       The chamfer is taken out of the body's height, not added to it, so the
       cup stays the height the spec says. */
    var FOOT_H = Math.max(5, Math.round(BODY_H * 0.028));
    var BODY_MAIN = BODY_H - FOOT_H;
    /* Where the body ends, the chamfer starts, so its top radius has to be the
       body's radius at that height rather than at the base. */
    var R_FOOT_TOP = R_TOP - (R_TOP - R_BASE) * (BODY_MAIN / BODY_H);
    ring(obj, 'c3d__body', R_TOP, R_FOOT_TOP, BODY_MAIN, BODY_TOP, PANELS);
    ring(obj, 'c3d__foot', R_FOOT_TOP, R_FOOT_TOP * 0.86, FOOT_H, BODY_TOP + BODY_MAIN, PANELS);

    /* The band is always built and shown or hidden with a class, the same way
       the handle is. Rebuilding 24 panels on every toggle would throw away the
       angle the visitor turned the cup to, which is the one thing they are
       holding on to. */
    var bandH = Math.round(BODY_H * 0.16);
    var bandTop = BODY_TOP + Math.round(BODY_H * 0.32);
    var t1 = 1 - (1 - R_BASE / R_TOP) * ((bandTop - BODY_TOP) / BODY_H);
    var t2 = 1 - (1 - R_BASE / R_TOP) * ((bandTop + bandH - BODY_TOP) / BODY_H);
    ring(obj, 'c3d__band', R_TOP * t1 + 1.5, R_TOP * t2 + 1.5, bandH, bandTop, PANELS);

    ring(obj, 'c3d__lid', LID_R, LID_R, LID_H, LID_TOP, PANELS);
    disc(obj, 'c3d__lidtop', LID_R, LID_TOP);

    var hole = disc(obj, 'c3d__hole', STRAW_R * 2.1, LID_TOP - 1);
    hole.style.marginLeft = (-STRAW_R * 2.1 + STRAW_X) + 'px';

    var straw = ring(obj, 'c3d__straw', STRAW_R, STRAW_R, STRAW_H, TOP, STRAW_PANELS);
    straw.style.marginLeft = STRAW_X + 'px';
    var strawTop = disc(obj, 'c3d__strawtop', STRAW_R, TOP);
    strawTop.style.marginLeft = (-STRAW_R + STRAW_X) + 'px';

    disc(obj, 'c3d__base', R_FOOT_TOP * 0.86, BODY_BOT);

    /* The foldable handle. A plane whose normal is tangential, so it contains
       the cup's axis and stands out from the side: go to the surface at the
       chosen angle, then turn the plane a quarter turn. */
    var handle = el('c3d__handle', obj);
    handle.style.top = (BODY_TOP + BODY_H * 0.10) + 'px';
    handle.style.height = (BODY_H * 0.42) + 'px';
    handle.style.transform =
      'rotateY(96deg) translateZ(' + (R_TOP * 0.92) + 'px) rotateY(90deg)';

    /* Printing rides on planes at the front, so it turns out of view as the cup
       spins. Each is narrow relative to the radius, which keeps the
       flat-versus-curved error below the threshold anyone notices. */
    function plane(cls, y) {
      var p = el('c3d__decal ' + cls, obj);
      p.style.transform = 'translateX(-50%) translateZ(' + (R_TOP + 2.2) + 'px)';
      p.style.top = y + 'px';
      return p;
    }

    /* The band can now be switched on and off after build, so the printing sits
       clear of it either way rather than branching on something that moves. */
    var above = plane('c3d__decal--top', BODY_TOP + BODY_H * 0.07);
    var logo = el('c3d__logo', above);
    logo.textContent = opts.logo || 'CUP';
    if (prod.blueprint !== false) el('c3d__blueprint', above);

    var below = plane('c3d__decal--bot',
      bandTop + bandH + BODY_H * 0.06);
    var word = el('c3d__word', below);
    word.textContent = opts.wordmark || 'IDEAS FLOW FURTHER';
    var eng = el('c3d__eng', below);

    /* The face. Built and left empty — it only appears once setExpression is
       called, so a page that never asks for a character never gets one. */
    var face = el('c3d__face', obj);
    face.style.transform = 'translateX(-50%) translateZ(' + (R_TOP + 2.6) + 'px)';
    face.style.top = (BODY_TOP + BODY_H * 0.30) + 'px';
    var eyeL = el('c3d__eye c3d__eye--l', face);
    var eyeR = el('c3d__eye c3d__eye--r', face);
    el('c3d__pupil', eyeL);
    el('c3d__pupil', eyeR);

    /* Shade and shadow live outside the 3D context so they stay flat, and are
       scaled about the same origin the model scales about — otherwise zooming
       slides the lighting off the cup. */
    var shade = el('c3d__shade', host);
    var shadow = el('c3d__shadow', host);

    /* ---- state ---- */
    var yaw = opts.angle == null ? -18 : opts.angle;
    var pitch = opts.pitch == null ? -7 : opts.pitch;
    var zoom = opts.zoom || 1;
    var api = {};

    function paint() {
      obj.style.transform =
        'scale(' + zoom.toFixed(3) + ') rotateX(' + pitch.toFixed(1) + 'deg) rotateY(' + yaw.toFixed(1) + 'deg)';
      host.style.setProperty('--zoom', zoom.toFixed(3));
      /* The overlay only describes a cylinder seen side-on. Tipped hard, it
         stops describing anything, so it fades out rather than lying. */
      shade.style.opacity = String(clamp(1 - Math.abs(pitch) / 70, 0.15, 1));
    }

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
      var n = Array.from(value).length;
      var base = isArabic ? 16 : 14;
      eng.style.fontSize =
        (n <= 7 ? base : Math.max(isArabic ? 9 : 8, base - (n - 7) * 0.7)).toFixed(1) + 'px';
      return api;
    };

    api.setHandle = function (on) { host.classList.toggle('has-handle', !!on); return api; };
    api.setBand = function (on) { host.classList.toggle('has-band', !!on); return api; };
    api.hasBand = function () { return host.classList.contains('has-band'); };

    api.setExpression = function (id) {
      if (!id) host.removeAttribute('data-face');
      else host.setAttribute('data-face', id);
      return api;
    };

    api.lookAt = function (dx, dy) {
      face.style.setProperty('--look-x', clamp(dx, -1, 1).toFixed(2));
      face.style.setProperty('--look-y', clamp(dy, -1, 1).toFixed(2));
      return api;
    };

    api.setAngle = function (a) { yaw = a; paint(); return api; };
    api.getAngle = function () { return yaw; };
    api.setPitch = function (p) { pitch = clamp(p, PITCH_MIN, PITCH_MAX); paint(); return api; };
    api.setZoom = function (z) { zoom = clamp(z, ZOOM_MIN, ZOOM_MAX); paint(); return api; };
    api.getZoom = function () { return zoom; };
    api.reset = function () {
      yaw = -18; pitch = -7; zoom = opts.zoom || 1; paint(); return api;
    };

    /* ---- turning it ---- */
    var dragging = false, lastX = 0, lastY = 0;

    scene.addEventListener('pointerdown', function (e) {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      /* Without this, dragging the cup drags a text selection across the
         headline behind it and the page lights up blue. */
      e.preventDefault();
      try { scene.setPointerCapture(e.pointerId); } catch (err) {}
      host.classList.add('is-dragging');
    });

    scene.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      yaw += (e.clientX - lastX) * 0.6;
      pitch = clamp(pitch - (e.clientY - lastY) * 0.4, PITCH_MIN, PITCH_MAX);
      lastX = e.clientX; lastY = e.clientY;
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

    /* Wheel zoom, but only once the cup has focus or the pointer is over it AND
       the gesture is a deliberate zoom. Hijacking plain page scroll because the
       cursor happened to pass over a product shot is a hostile pattern, so a
       bare wheel scrolls the page and ctrl/⌘+wheel — the browser's own zoom
       gesture, and what a trackpad pinch sends — zooms the cup. */
    scene.addEventListener('wheel', function (e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      api.setZoom(zoom * (e.deltaY > 0 ? 0.92 : 1.08));
    }, { passive: false });

    host.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowLeft')  { yaw -= 12; paint(); e.preventDefault(); }
      if (k === 'ArrowRight') { yaw += 12; paint(); e.preventDefault(); }
      if (k === 'ArrowUp')    { api.setPitch(pitch + 8); e.preventDefault(); }
      if (k === 'ArrowDown')  { api.setPitch(pitch - 8); e.preventDefault(); }
      if (k === '+' || k === '=') { api.setZoom(zoom * 1.12); e.preventDefault(); }
      if (k === '-' || k === '_') { api.setZoom(zoom * 0.89); e.preventDefault(); }
      if (k === '0') { api.reset(); e.preventDefault(); }
    });

    /* Visible zoom controls, because a gesture nobody can see is a feature
       nobody uses — and on a touch screen there is no wheel at all. */
    if (opts.controls !== false) {
      var bar = el('c3d__zoombar', host);
      /* Tilt has buttons as well as drag, because on a touch screen a vertical
         swipe has to keep scrolling the page — taking that over would trap
         somebody inside a product shot. So touch gets yaw by swiping and pitch
         by tapping, and nobody loses the ability to scroll past. */
      var ACTS = [
        ['tilt-up',   'ui.cup.tiltup',  '⌃', function () { api.setPitch(pitch + 10); }],
        ['out',       'ui.cup.out',     '−', function () { api.setZoom(zoom * 0.85); }],
        ['reset',     'ui.cup.reset',   '↺', function () { api.reset(); }],
        ['in',        'ui.cup.in',      '+', function () { api.setZoom(zoom * 1.18); }],
        ['tilt-down', 'ui.cup.tiltdown','⌄', function () { api.setPitch(pitch - 10); }]
      ];
      ACTS.forEach(function (row) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'c3d__zoombtn';
        b.setAttribute('data-act', row[0]);
        b.setAttribute('data-t-attr', 'aria-label:' + row[1]);
        b.setAttribute('aria-label', row[0]);
        b.textContent = row[2];
        b.addEventListener('click', row[3]);
        bar.appendChild(b);
      });
      api.zoombar = bar;
      if (window.cupApplyLang) window.cupApplyLang();
    }

    /* ---- the slow turn ---- */
    var raf = null;
    function motionWanted() {
      var set = document.documentElement.getAttribute('data-motion');
      if (set === 'off') return false;
      if (set === 'on') return true;
      return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    function tick() {
      if (!dragging) { yaw += (opts.spinSpeed || 0.16); paint(); }
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

    api.setColour(opts.colour || '#16233D');
    api.setHandle(opts.handle !== false && prod.foldableHandle === true);
    api.setBand(opts.band != null ? opts.band : prod.saduBand === true);
    if (opts.expression) api.setExpression(opts.expression);
    paint();
    syncMotion();

    return api;
  }

  return { build: build, readableInk: readableInk };
})();

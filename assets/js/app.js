/* Boot: language, direction, motion, navigation, and the content that comes
   out of content.js.

   The English words are already in the HTML when this file runs. That is
   deliberate — if this script never loads, the page is still a readable English
   page rather than a set of empty boxes. Everything here either swaps those
   words for Arabic or fills in a fact that only content.js knows. */

(function () {
  'use strict';

  var S = window.CUP_STRINGS || {};
  var C = window.CUP_CONTENT || {};
  var root = document.documentElement;

  /* ---- language ------------------------------------------------------- */

  function savedLang() {
    try { return localStorage.getItem('cup.lang'); } catch (e) { return null; }
  }

  var lang = savedLang() === 'ar' ? 'ar' : 'en';

  function t(key, fallback) {
    var row = S[key];
    if (!row) return fallback || '';
    return row[lang] || row.en || fallback || '';
  }

  /* Paragraphs are stored with \n between them rather than as HTML, so that no
     string in content.js can ever inject markup into the page. */
  function setProse(el, text) {
    el.textContent = '';
    text.split('\n').forEach(function (para) {
      if (!para) return;
      var p = document.createElement('p');
      p.textContent = para;
      el.appendChild(p);
    });
  }

  /* Re-entrancy guard. applyLang ends by dispatching cup:lang, and anything
     listening for that may quite reasonably want to re-translate itself by
     calling applyLang again — which would dispatch cup:lang again, forever.
     One flag turns an infinite loop into a no-op. */
  var translating = false;

  function applyLang() {
    if (translating) return;
    translating = true;
    try { doApplyLang(); } finally { translating = false; }
  }

  function doApplyLang() {
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-t]').forEach(function (el) {
      var key = el.getAttribute('data-t');
      if (!S[key]) return;
      var text = t(key);
      if (el.hasAttribute('data-t-prose')) setProse(el, text);
      else el.textContent = text;
    });

    document.querySelectorAll('[data-t-attr]').forEach(function (el) {
      /* "placeholder:eng.placeholder aria-label:switch.lang.aria" */
      el.getAttribute('data-t-attr').split(/\s+/).forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2 && S[bits[1]]) el.setAttribute(bits[0], t(bits[1]));
      });
    });

    var title = document.querySelector('[data-t-title]');
    if (title) {
      var k = title.getAttribute('data-t-title');
      if (S[k]) document.title = t(k);
    }

    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.textContent = t('switch.lang');
      b.setAttribute('aria-label', t('switch.lang.aria'));
    });

    document.dispatchEvent(new CustomEvent('cup:lang', { detail: { lang: lang } }));
  }

  window.cupLang = function () { return lang; };
  window.cupT = t;
  /* Exposed so the files that mount later — the switches, the waiting screen,
     the assistant — can re-translate what they inserted without duplicating
     any of the logic above. */
  window.cupApplyLang = applyLang;

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang-btn]');
    if (!b) return;
    lang = lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('cup.lang', lang); } catch (err) {}
    applyLang();
    render();
  });

  /* ---- motion --------------------------------------------------------- */

  /* Two independent things: what the operating system asks for, and what the
     visitor asked for on this site. The visitor wins in BOTH directions — an
     explicit "on" survives an OS that says reduce, and an explicit "off"
     survives an OS that says no-preference. Only an unset choice defers. */
  function savedMotion() {
    try { return localStorage.getItem('cup.motion'); } catch (e) { return null; }
  }

  function osWantsReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function motionIsOn() {
    var choice = savedMotion();
    if (choice === 'on') return true;
    if (choice === 'off') return false;
    return !osWantsReduced();
  }

  function applyMotion() {
    var choice = savedMotion();
    if (choice) root.setAttribute('data-motion', choice);
    else root.removeAttribute('data-motion');

    document.querySelectorAll('[data-motion-btn]').forEach(function (b) {
      var on = motionIsOn();
      b.textContent = t(on ? 'switch.motion.on' : 'switch.motion.off');
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', t('switch.motion.aria'));
    });
  }

  /* Exposed because the menu builds its motion button after boot, and a button
     that mounts later still has to be labelled. */
  window.cupApplyMotion = applyMotion;

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-motion-btn]');
    if (!b) return;
    try { localStorage.setItem('cup.motion', motionIsOn() ? 'off' : 'on'); } catch (err) {}
    applyMotion();
  });

  /* ---- content from content.js ---------------------------------------- */

  function label(item) { return (item && item[lang]) || (item && item.en) || ''; }

  /* The rule: a value we have not been given renders as a deliberate sentence,
     never as an empty box, a dangling unit, or a stray comma. */
  function pending(el, key) {
    el.innerHTML = '';
    var div = document.createElement('div');
    div.className = 'pending';
    div.textContent = t(key);
    el.appendChild(div);
  }

  function renderPrice() {
    var el = document.querySelector('[data-price]');
    if (!el) return;
    if (typeof C.price === 'number' && isFinite(C.price)) {
      el.innerHTML = '';
      var p = document.createElement('p');
      p.className = 'lede';
      /* Kuwaiti dinar is quoted to three decimals. */
      p.textContent = C.price.toFixed(3) + ' ' + t('home.price.label');
      el.appendChild(p);
    } else {
      pending(el, 'home.price.pending');
    }
  }

  function renderHeatTest() {
    var el = document.querySelector('[data-heattest]');
    if (!el) return;
    var rows = (C.heatTest && C.heatTest.rows) || [];
    if (!rows.length) { pending(el, 'home.proof.pending'); return; }

    el.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'tablewrap';
    var table = document.createElement('table');
    var head = document.createElement('tr');
    ['', 'Ambient °C', 'Contents °C', ''].forEach(function (h, i) {
      var th = document.createElement('th');
      if (i === 1 || i === 2) th.className = 'num';
      th.textContent = h;
      head.appendChild(th);
    });
    table.appendChild(head);
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      [r.at, r.ambientC, r.contentsC, r.note || ''].forEach(function (v, i) {
        var td = document.createElement('td');
        if (i === 1 || i === 2) td.className = 'num';
        td.textContent = (v === null || v === undefined) ? '—' : String(v);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    wrap.appendChild(table);
    el.appendChild(wrap);

    /* The conditions line is not decoration. It is where the test says what it
       actually was — and, right now, that these figures are illustrative rather
       than measured. A table of numbers with no statement of conditions is the
       exact shape of a claim you cannot check. */
    var cond = (C.heatTest && C.heatTest.conditions) || {};
    var text = lang === 'ar' ? cond.ar : cond.en;
    if (text) {
      var p = document.createElement('p');
      p.className = 'note';
      p.textContent = text + (C.heatTest.date ? ' — ' + C.heatTest.date : '');
      el.appendChild(p);
    }
  }

  function renderFit() {
    var el = document.querySelector('[data-fit]');
    if (!el) return;
    var entries = (C.fit && C.fit.entries) || [];
    if (!entries.length) { pending(el, 'home.fit.pending'); return; }

    el.innerHTML = '';
    var ul = document.createElement('ul');
    ul.className = 'claims';
    entries.forEach(function (e) {
      var li = document.createElement('li');
      var verdict = e.fits === true ? 'fits' : (e.fits === 'tight' ? 'tight' : 'does not fit');
      li.textContent = [e.make, e.model, e.years].filter(Boolean).join(' ') + ' — ' + verdict +
        (e.note ? '. ' + e.note : '');
      ul.appendChild(li);
    });
    el.appendChild(ul);

    /* The one number the whole list turns on. Without it a "does not fit" is an
       opinion; with it, anyone can measure their own holder and check. */
    if (C.fit && C.fit.baseDiameterMm) {
      var note = document.createElement('p');
      note.className = 'note';
      note.textContent = t('home.fit.base').replace('{mm}', C.fit.baseDiameterMm);
      el.appendChild(note);
    }
  }

  function renderNotFor() {
    var el = document.querySelector('[data-notfor]');
    if (!el) return;
    var list = (C.product && C.product.notGoodFor) || [];
    if (!list.length) { el.innerHTML = ''; return; }
    el.innerHTML = '';
    var ul = document.createElement('ul');
    ul.className = 'claims';
    list.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = label(item);
      ul.appendChild(li);
    });
    el.appendChild(ul);
  }

  function renderContact() {
    var el = document.querySelector('[data-contact]');
    if (!el) return;
    var c = C.contact || {};
    var links = [];
    if (c.instagram) links.push(['Instagram', 'https://instagram.com/' + c.instagram]);
    if (c.whatsapp) links.push(['WhatsApp', 'https://wa.me/' + c.whatsapp]);
    if (c.email) links.push([c.email, 'mailto:' + c.email]);

    el.innerHTML = '';
    if (!links.length) {
      var p = document.createElement('p');
      p.textContent = t('foot.contactPending');
      el.appendChild(p);
      return;
    }
    links.forEach(function (pair, i) {
      if (i) el.appendChild(document.createTextNode(' · '));
      var a = document.createElement('a');
      a.href = pair[1];
      a.textContent = pair[0];
      a.rel = 'noopener';
      el.appendChild(a);
    });
  }

  /* Colour choices are used by both the engraving page and the reservation
     form, so they are built from one place. */
  window.cupColours = function () { return (C.product && C.product.colours) || []; };
  window.cupColourLabel = label;

  function renderSwatches() {
    document.querySelectorAll('[data-swatches]').forEach(function (host) {
      var name = host.getAttribute('data-swatches');
      /* Switching language re-renders these, so the current choice is read back
         off the DOM first. Losing somebody's colour because they wanted to read
         the page in Arabic would be its own small insult. */
      var chosen = host.querySelector('input:checked');
      var current = (chosen && chosen.value) ||
        host.getAttribute('data-selected') ||
        (window.cupColours()[0] && window.cupColours()[0].slug);

      host.innerHTML = '';
      window.cupColours().forEach(function (col) {
        var l = document.createElement('label');
        l.className = 'swatch';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = col.slug;
        if (col.slug === current) input.checked = true;
        var span = document.createElement('span');
        /* The name is carried for screen readers and for the readout below the
           row. Printing fourteen labels beside fourteen dots is a wall of text
           where the colours should be doing the talking. */
        span.setAttribute('data-name', label(col));
        span.style.setProperty('--sw', col.hex);
        input.setAttribute('aria-label', label(col));
        l.appendChild(input);
        l.appendChild(span);
        host.appendChild(l);
      });
    });
    showSwatchName();
  }

  /* One line under the row saying which colour is selected — so the choice is
     legible without labelling every dot. */
  function showSwatchName() {
    var out = document.querySelector('[data-swatchname]');
    if (!out) return;
    var picked = document.querySelector('[data-drives-cup] input:checked');
    var found = window.cupColours().filter(function (c) { return c.slug === (picked && picked.value); })[0];
    out.textContent = found ? label(found) : '';
  }

  /* ---- the 3D cup ------------------------------------------------------ */

  function hexFor(slug) {
    var found = window.cupColours().filter(function (c) { return c.slug === slug; })[0];
    return (found && found.hex) || '#16233D';
  }

  function chosenColour() {
    var input = document.querySelector('[data-drives-cup] input:checked') ||
                document.querySelector('input[name="colour"]:checked');
    return input ? input.value : (window.cupColours()[0] || {}).slug;
  }

  /* A specification is a list of numbers, so it is rendered as one. Every row
     comes off the client's own spec sheet — switch a feature off in content.js
     and its row disappears rather than leaving a claim behind. Nothing here
     attaches a number of hours to hot or cold, because that is not measured. */
  function renderSpecs() {
    var host = document.querySelector('[data-specs]');
    if (!host) return;
    var p = C.product || {};
    var rows = [];
    if (p.capacityMl) rows.push(['k.capacity', p.capacityMl + ' ml']);
    if (p.heightCm) rows.push(['k.height', p.heightCm + ' cm']);
    if (p.baseDiameterCm) rows.push(['k.base', p.baseDiameterCm + ' cm']);
    if (p.twoInOneLid) rows.push(['k.lid', t('v.lid')]);
    if (p.foldableHandle) rows.push(['k.handle', t('v.handle')]);
    if (p.material) rows.push(['k.material', t('v.steel')]);

    host.innerHTML = '';
    rows.forEach(function (row) {
      var li = document.createElement('li');
      var k = document.createElement('span');
      k.className = 'k';
      k.textContent = t(row[0]);
      var v = document.createElement('span');
      v.className = 'v';
      v.textContent = row[1];
      li.appendChild(k);
      li.appendChild(v);
      host.appendChild(li);
    });
  }

  /* A page may carry more than one cup — the home page has the one you land on
     and the one you choose a colour against. Every cup on the page is built and
     every cup follows the colour, so two cups never disagree about what was
     picked. */
  function mountCup() {
    if (!window.CUP3D) return;
    var hosts = document.querySelectorAll('[data-cup3d]');
    if (!hosts.length) return;

    /* Built once each. Re-rendering the whole cylinder on every language switch
       would throw away the angle the visitor turned it to. */
    var models = [];
    hosts.forEach(function (host) {
      models.push(window.CUP3D.build(host, {
        colour: hexFor(chosenColour()),
        /* The face is opt-in per cup, and deliberately absent from anywhere the
           site is being honest about what it does not know. See DECISIONS.md. */
        expression: host.getAttribute('data-face') || null,
        height: parseInt(host.getAttribute('data-height'), 10) || 340
      }));
    });
    /* The first is the page's principal cup. Other files reach for this handle,
       so it stays a single model rather than becoming a list. */
    window.cupModel = models[0];

    document.addEventListener('change', function (e) {
      if (!e.target.closest || !e.target.closest('[data-drives-cup]')) return;
      var hex = hexFor(e.target.value);
      models.forEach(function (m) { m.setColour(hex); });
      showSwatchName();
    });

    /* The Sadu band, on or off. It is a different product rather than a
       different colour, so it gets its own control instead of being another
       swatch in the row. */
    function paintBandBtn() {
      var on = models[0] && models[0].hasBand();
      document.querySelectorAll('[data-band-toggle]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(!!on));
        b.textContent = t(on ? 'cup.band.on' : 'cup.band.off');
      });
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('[data-band-toggle]')) return;
      var next = !(models[0] && models[0].hasBand());
      models.forEach(function (m) { m.setBand(next); });
      paintBandBtn();
    });
    paintBandBtn();
    document.addEventListener('cup:lang', paintBandBtn);
  }

  /* The photographs. Lazy, sized, and captioned — a gallery of five product
     shots is the one place on this site where a real photo says more than
     anything we could draw. */
  function renderGallery() {
    var host = document.querySelector('[data-gallery]');
    if (!host) return;
    var items = (window.CUP_EXPERIENCE && window.CUP_EXPERIENCE.gallery) || [];
    if (!items.length) { host.innerHTML = ''; return; }

    host.innerHTML = '';
    items.forEach(function (item, i) {
      var fig = document.createElement('figure');
      fig.className = 'shot';
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = (lang === 'ar' ? item.altAr : item.altEn) || '';
      /* The first is above the fold on a phone; the rest can wait. */
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      var cap = document.createElement('figcaption');
      cap.textContent = (lang === 'ar' ? item.capAr : item.capEn) || '';
      fig.appendChild(img);
      fig.appendChild(cap);
      host.appendChild(fig);
    });
  }

  function render() {
    renderGallery();
    renderPrice();
    renderHeatTest();
    renderFit();
    renderNotFor();
    renderContact();
    renderSwatches();
    renderSpecs();
  }

  /* ---- nav ------------------------------------------------------------ */

  function markCurrent() {
    var here = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (here.length > 1) here = here.replace(/\/$/, '');
    document.querySelectorAll('.nav a').forEach(function (a) {
      var href = a.getAttribute('href').replace(/\.html$/, '').replace(/^\./, '');
      var norm = href === '/' || href === '' ? '/' : href;
      var cur = here === '' ? '/' : here;
      if (cur.endsWith(norm) && norm !== '/') a.setAttribute('aria-current', 'page');
      else if (norm === '/' && (cur === '/' || cur.endsWith('/cup-kw'))) a.setAttribute('aria-current', 'page');
    });
  }

  applyLang();
  applyMotion();
  render();
  mountCup();
  markCurrent();

  /* Everything that mounts itself later waits on this rather than on load
     order, so a script tag moving in the HTML cannot silently break a feature. */
  document.dispatchEvent(new CustomEvent('cup:ready'));
})();

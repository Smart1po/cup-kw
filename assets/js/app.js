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
        span.textContent = label(col);
        span.style.setProperty('--sw', col.hex);
        l.appendChild(input);
        l.appendChild(span);
        host.appendChild(l);
      });
    });
  }

  /* ---- the 3D cup ------------------------------------------------------ */

  function hexFor(slug) {
    var found = window.cupColours().filter(function (c) { return c.slug === slug; })[0];
    return (found && found.hex) || '#2A3A52';
  }

  function chosenColour() {
    var input = document.querySelector('[data-drives-cup] input:checked') ||
                document.querySelector('input[name="colour"]:checked');
    return input ? input.value : (window.cupColours()[0] || {}).slug;
  }

  /* Cards built from the spec-sheet booleans in content.js, so switching a
     feature off removes its card rather than leaving a claim behind. */
  function renderSpecs() {
    var host = document.querySelector('[data-specs]');
    if (!host) return;
    var p = C.product || {};
    var rows = [];
    if (p.capacityMl) rows.push(['spec.capacity', p.capacityMl + ' ml' + (p.capacityOz ? ' · ' + p.capacityOz + ' oz' : '')]);
    if (p.material) rows.push(['spec.material', label(p.material)]);
    if (p.twoInOneLid) rows.push(['spec.lid', '']);
    if (p.foldableHandle) rows.push(['spec.handle', '']);
    if (p.leakResistant) rows.push(['spec.leak', '']);
    if (p.carHolderFriendly) rows.push(['spec.car', '']);

    host.innerHTML = '';
    rows.forEach(function (row) {
      var card = document.createElement('div');
      card.className = 'card';
      var h = document.createElement('h3');
      h.textContent = t(row[0] + '.h');
      var body = document.createElement('p');
      body.textContent = row[1] || t(row[0] + '.p');
      card.appendChild(h);
      card.appendChild(body);
      host.appendChild(card);
    });
  }

  function mountCup() {
    var host = document.querySelector('[data-cup3d]');
    if (!host || !window.CUP3D) return;
    /* Built once. Re-rendering the whole cylinder on every language switch
       would throw away the angle the visitor turned it to. */
    window.cupModel = window.CUP3D.build(host, {
      colour: hexFor(chosenColour()),
      /* The face is opt-in per page, and deliberately absent from anywhere the
         site is being honest about what it does not know. See DECISIONS.md. */
      expression: host.getAttribute('data-face') || null,
      height: parseInt(host.getAttribute('data-height'), 10) || 340
    });

    document.addEventListener('change', function (e) {
      if (!e.target.closest || !e.target.closest('[data-drives-cup]')) return;
      window.cupModel.setColour(hexFor(e.target.value));
    });
  }

  function render() {
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

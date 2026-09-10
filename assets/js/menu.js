/* THE MENU, AND THE SHOP ON IT.

   One page. The catalogue is the page; the shop is what you can do on it —
   filter the lineup down to the kind you want, and put things aside to reserve.

   There is no photograph of most of these and there never will be for a concept,
   so every card draws its cup: one SVG tinted by the item's hex, with the band,
   the handle and the printed field switched on per line. Same bargain the rest
   of the site makes — a drawn thing that is honest beats a photograph that does
   not exist.

   Filters act on lines rather than items because everything that can be filtered
   — body, capacity, features — is a property of the line, and every item in a
   line shares it. Filtering per card would be the same answer with more code.

   The selection is kept in localStorage and is a list of intentions, not an
   order. Nothing here takes money or claims stock. */

(function () {
  'use strict';

  var KEY = 'cup.picked';
  var anim = 0;
  var picked = [];
  var filters = { line: 'all', cap: 'all', feats: [] };

  function lang() { return window.cupLang ? window.cupLang() : 'en'; }
  function t(k) { return window.cupT ? window.cupT(k) : k; }
  function pick(o) { return (lang() === 'ar' ? o.ar : o.en) || o.en || ''; }
  function money(n) { return n.toFixed(3) + ' ' + t('menu.kwd'); }

  function load() {
    try { picked = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { picked = []; }
    if (!Array.isArray(picked)) picked = [];
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(picked)); } catch (e) {}
  }

  /* ---- the drawn cup --------------------------------------------------- */

  function cupSVG(item, line) {
    var GLASS = '#DCE3E8';
    var clear = item.clear === true;
    var bare = item.bare === true;
    var body = item.hex;
    /* On a bare cup the vessel has no colour of its own: the lid, the straw and
       the barrel are all glass, and the only colour on the card is the drink. */
    var shell = bare ? GLASS : body;
    var ink = bare ? null : (item.ink || null);
    var band = line.band === true;
    var handle = line.body === 'advanced';

    var p = ['<svg class="card__cup" viewBox="0 0 72 132" role="img" aria-hidden="true">'];
    p.push('<rect x="33" y="2" width="6" height="22" rx="3" fill="' + (ink || shell) + '"' +
           (bare ? ' opacity=".55"' : '') + '/>');
    p.push('<rect x="14" y="18" width="44" height="16" rx="5" fill="' + shell + '"' +
           (bare ? ' opacity=".45"' : '') + '/>');
    if (!bare) p.push('<rect x="14" y="18" width="44" height="16" rx="5" fill="#000" opacity=".18"/>');

    if (clear) {
      p.push('<rect x="16" y="32" width="40" height="96" rx="7" fill="' + GLASS + '" opacity=".2"/>');
      /* A bare cup has nothing in it. The others show their contents, which is
         the whole point of a transparent body; this one is the empty vessel. */
      if (!bare) p.push('<rect x="16" y="56" width="40" height="72" rx="7" fill="' + body + '" opacity=".8"/>');
      p.push('<rect x="16.6" y="32.6" width="38.8" height="94.8" rx="6.6" fill="none" stroke="' +
             GLASS + '" stroke-opacity=".5" stroke-width="1.2"/>');
      p.push('<rect x="20" y="36" width="5" height="88" rx="2.5" fill="#fff" opacity=".13"/>');
    } else {
      p.push('<rect x="16" y="32" width="40" height="96" rx="7" fill="' + body + '"/>');
      p.push('<rect x="16" y="32" width="13" height="96" rx="7" fill="#fff" opacity=".07"/>');
      p.push('<rect x="49" y="32" width="7" height="96" rx="7" fill="#000" opacity=".13"/>');
    }
    /* A navy cup on a navy card is 1.00:1 — the same colour. Every cup gets a
       hairline so the silhouette survives whatever it is standing on. */
    p.push('<rect x="16.5" y="32.5" width="39" height="95" rx="6.5" fill="none" ' +
           'stroke="#F2EAD8" stroke-opacity=".22" stroke-width="1"/>');
    p.push('<rect x="14.5" y="18.5" width="43" height="15" rx="4.5" fill="none" ' +
           'stroke="#F2EAD8" stroke-opacity=".18" stroke-width="1"/>');

    if (ink && !clear) {
      p.push('<rect x="25" y="46" width="22" height="9" rx="1.5" fill="none" stroke="' + ink + '" stroke-width="1.2"/>');
      for (var r = 0; r < 7; r++) for (var c = 0; c < 5; c++) {
        p.push('<circle cx="' + (27 + c * 4.5) + '" cy="' + (63 + r * 5) + '" r="1" fill="' + ink + '" opacity=".85"/>');
      }
    }
    if (band) {
      p.push('<rect x="16" y="68" width="40" height="20" fill="#8C1D24"/>');
      p.push('<rect x="16" y="68" width="40" height="2.5" fill="#F2EAD8"/>');
      p.push('<rect x="16" y="85.5" width="40" height="2.5" fill="#F2EAD8"/>');
      p.push('<rect x="16" y="70.5" width="40" height="1.5" fill="#C9A87C"/>');
      p.push('<rect x="16" y="84" width="40" height="1.5" fill="#C9A87C"/>');
      for (var d = 0; d < 4; d++) {
        var cx = 22 + d * 9.4;
        p.push('<path d="M' + cx + ' 73.5 l4 3.5 -4 3.5 -4 -3.5 z" fill="#F2EAD8"/>');
        p.push('<path d="M' + cx + ' 75.4 l1.8 1.6 -1.8 1.6 -1.8 -1.6 z" fill="#1A1A1A"/>');
      }
    }
    if (handle) {
      p.push('<path d="M56 54 h7 a4 4 0 0 1 4 4 v22 a4 4 0 0 1 -4 4 h-7" fill="none" stroke="' +
             body + '" stroke-width="6" stroke-linecap="round"/>');
      p.push('<path d="M56 54 h7 a4 4 0 0 1 4 4 v22 a4 4 0 0 1 -4 4 h-7" fill="none" stroke="#000" ' +
             'stroke-opacity=".22" stroke-width="6" stroke-linecap="round"/>');
    }
    p.push('</svg>');
    return p.join('');
  }

  /* ---- cards ----------------------------------------------------------- */

  function id(line, item) { return line.slug + '/' + item.slug; }

  function card(item, line) {
    var key = id(line, item);
    var el = document.createElement('article');
    el.className = 'card';
    el.setAttribute('data-id', key);
    el.setAttribute('data-line', line.slug);

    var price = line.priceKwd == null
      ? '<p class="card__price card__price--unset">' + t('menu.price.unset') + '</p>'
      : '<p class="card__price">' + money(line.priceKwd) + '</p>';

    el.innerHTML =
      '<p class="card__line">' + pick(line) + '</p>' +
      '<div class="card__stage">' + cupSVG(item, line) + '</div>' +
      '<h3 class="card__name">' + pick(item) + '</h3>' + price +
      '<button type="button" class="card__add" data-add="' + key + '"></button>';

    /* A different move each time a cup is picked up. The counter is shared
       across the whole grid rather than per card, so going along a row cycles
       through all five instead of replaying one card's move — and consecutive
       hovers always differ, which is also what makes the animation restart at
       all: an identical value would not re-trigger the rule. */
    el.addEventListener('mouseenter', function () {
      el.setAttribute('data-anim', String(anim % 5));
      anim++;
    });
    return el;
  }

  function paintCard(el) {
    var on = picked.indexOf(el.getAttribute('data-id')) > -1;
    el.classList.toggle('is-picked', on);
    var b = el.querySelector('.card__add');
    b.textContent = t(on ? 'shop.picked' : 'shop.add');
    b.setAttribute('aria-pressed', String(on));
  }

  /* ---- filters --------------------------------------------------------- */

  function chip(label, on, onclick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip chip--btn' + (on ? ' is-on' : '');
    b.textContent = label;
    b.setAttribute('aria-pressed', String(on));
    b.addEventListener('click', onclick);
    return b;
  }

  function group(host, title, nodes) {
    var g = document.createElement('div');
    g.className = 'filter__group';
    g.innerHTML = '<p class="micro">' + title + '</p>';
    var row = document.createElement('div');
    row.className = 'chips';
    nodes.forEach(function (n) { row.appendChild(n); });
    g.appendChild(row);
    host.appendChild(g);
  }

  function matches(line, cat) {
    if (filters.line !== 'all' && line.slug !== filters.line) return false;
    var body = cat.bodies[line.body] || {};
    if (filters.cap !== 'all' && String(body.capacityMl) !== filters.cap) return false;
    for (var i = 0; i < filters.feats.length; i++) {
      if (line.features.indexOf(filters.feats[i]) < 0) return false;
    }
    return true;
  }

  function lineOf(slug) {
    return window.CUP_CATALOGUE.lines.filter(function (l) { return l.slug === slug; })[0];
  }

  /* Kind: All is one flat grid of every cup, each card carrying its own line
     name, rather than five titled sections. Fifteen Classic cards is more than
     a screen, so a heading above the section has scrolled away by the time you
     are looking at the cups under it — the name has to travel with the card.
     Pick a single kind and the grid narrows to it and that line's header comes
     back, because then the heading is on screen with everything it names, and
     repeating it on all fifteen cards would only be noise. */
  function apply() {
    var cat = window.CUP_CATALOGUE;
    var flat = filters.line === 'all';
    var shown = 0;
    var concept = false;

    document.querySelectorAll('[data-head]').forEach(function (head) {
      head.hidden = flat || head.getAttribute('data-head') !== filters.line;
    });

    document.querySelectorAll('.card[data-line]').forEach(function (el) {
      var line = lineOf(el.getAttribute('data-line'));
      var ok = !!line && matches(line, cat);
      el.hidden = !ok;
      if (ok) { shown++; if (line.concept) concept = true; }
    });

    var grid = document.querySelector('[data-grid]');
    if (grid) grid.classList.toggle('cards--all', flat);

    /* The note follows the concept cups rather than the concept section, which
       no longer exists on its own when every kind is on screen at once. */
    var note = document.querySelector('[data-concept-note]');
    if (note) note.hidden = !concept;

    var count = document.querySelector('[data-menu-count]');
    if (count) count.textContent = shown + ' ' + t(shown === 1 ? 'menu.item' : 'menu.items');
    var empty = document.querySelector('[data-menu-empty]');
    if (empty) empty.hidden = shown > 0;
  }

  function buildFilters(cat) {
    var host = document.querySelector('[data-filters]');
    if (!host) return;
    host.innerHTML = '';

    var kinds = [chip(t('shop.all'), filters.line === 'all', function () {
      filters.line = 'all'; buildFilters(cat); apply();
    })];
    cat.lines.forEach(function (l) {
      kinds.push(chip(pick(l), filters.line === l.slug, function () {
        filters.line = l.slug; buildFilters(cat); apply();
      }));
    });
    group(host, t('shop.kind'), kinds);

    var caps = ['all'];
    cat.lines.forEach(function (l) {
      var ml = String((cat.bodies[l.body] || {}).capacityMl);
      if (caps.indexOf(ml) < 0) caps.push(ml);
    });
    group(host, t('shop.capacity'), caps.map(function (c) {
      return chip(c === 'all' ? t('shop.all') : c + ' ml', filters.cap === c, function () {
        filters.cap = c; buildFilters(cat); apply();
      });
    }));

    var feats = [];
    cat.lines.forEach(function (l) {
      l.features.forEach(function (f) { if (feats.indexOf(f) < 0) feats.push(f); });
    });
    group(host, t('shop.features'), feats.map(function (f) {
      return chip(t('feat.' + f), filters.feats.indexOf(f) > -1, function () {
        var i = filters.feats.indexOf(f);
        if (i > -1) filters.feats.splice(i, 1); else filters.feats.push(f);
        buildFilters(cat); apply();
      });
    }));
  }

  /* ---- the tray -------------------------------------------------------- */

  function paintTray() {
    var tray = document.querySelector('[data-tray]');
    if (!tray) return;
    tray.hidden = picked.length === 0;
    var n = tray.querySelector('[data-tray-count]');
    if (n) n.textContent = picked.length + ' ' + t(picked.length === 1 ? 'shop.one' : 'shop.many');
    document.querySelectorAll('.card').forEach(paintCard);
  }

  /* ---- render ---------------------------------------------------------- */

  function render() {
    var host = document.querySelector('[data-menu]');
    var cat = window.CUP_CATALOGUE;
    if (!host || !cat) return;

    host.innerHTML = '';

    /* One section, not five: every header is built and only the one for the
       chosen kind is ever shown, and all thirty-six cards share a single grid
       so that Kind: All is a continuous run rather than five short ones. */
    var sec = document.createElement('section');
    sec.className = 'lineup';

    cat.lines.forEach(function (line, i) {
      var body = cat.bodies[line.body] || {};

      var dims = body.handle
        ? body.heightCm + ' × ' + body.topDiameterCm + ' cm'
        : body.heightCm + ' × ' + body.diameterCm + ' cm';

      var head = document.createElement('div');
      head.className = 'lineup__head';
      head.setAttribute('data-head', line.slug);
      head.hidden = true;
      head.innerHTML =
        '<p class="frame__no">' + String(i + 1).padStart(2, '0') + '</p>' +
        '<h2 class="display display--2">' + pick(line) + '</h2>' +
        '<p class="lede">' + (lang() === 'ar' ? line.blurbAr : line.blurbEn) + '</p>' +
        '<p class="micro">' + dims + ' · ' + body.capacityMl + ' ml · ' +
          line.items.length + ' ' + t('menu.finishes') + '</p>';
      var chips = document.createElement('ul');
      chips.className = 'chips';
      line.features.forEach(function (f) {
        var li = document.createElement('li');
        li.className = 'chip';
        li.textContent = t('feat.' + f);
        chips.appendChild(li);
      });
      head.appendChild(chips);
      sec.appendChild(head);
    });

    var grid = document.createElement('div');
    grid.className = 'cards';
    grid.setAttribute('data-grid', '');
    cat.lines.forEach(function (line) {
      line.items.forEach(function (item) { grid.appendChild(card(item, line)); });
    });
    sec.appendChild(grid);

    var note = document.createElement('p');
    note.className = 'pending';
    note.setAttribute('data-concept-note', '');
    note.hidden = true;
    note.textContent = t('menu.concept.note');
    sec.appendChild(note);

    host.appendChild(sec);

    buildFilters(cat);
    apply();
    paintTray();
  }

  document.addEventListener('click', function (e) {
    var add = e.target.closest && e.target.closest('[data-add]');
    if (add) {
      var key = add.getAttribute('data-add');
      var i = picked.indexOf(key);
      if (i > -1) picked.splice(i, 1); else picked.push(key);
      save(); paintTray();
      return;
    }
    if (e.target.closest && e.target.closest('[data-tray-clear]')) {
      picked = []; save(); paintTray();
    }
  });

  load();
  if (window.cupT) render();
  else document.addEventListener('cup:ready', render, { once: true });
  document.addEventListener('cup:lang', render);
})();

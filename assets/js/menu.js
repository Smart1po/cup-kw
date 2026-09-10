/* THE MENU, AND THE SHOP ON IT.

   One page. The catalogue is the page; the shop is what you can do on it —
   filter the lineup down to the kind you want, and put things aside to reserve.

   There is no photograph of most of these and there never will be for a concept,
   so every card draws its cup: one SVG tinted by the item's hex, with the band,
   the handle and the printed field switched on per line. Same bargain the rest
   of the site makes — a drawn thing that is honest beats a photograph that does
   not exist.

   Kind, capacity and features are properties of the LINE — every item in a line
   shares them — so those three ask the line and every card in it gets the same
   answer. Collections are the exception: new arrivals and best sellers pick
   individual cups out of several lines at once, so membership is a property of
   the cup. Both end up in the same pass over the cards, which is why the grid
   went flat.

   The selection is kept in localStorage and is a list of intentions, not an
   order. Nothing here takes money or claims stock. */

(function () {
  'use strict';

  var CART = window.CUP_CART;
  var anim = 0;
  var filters = { coll: 'all', line: 'all', cap: 'all', feats: [] };
  var featOpen = false;

  function lang() { return window.cupLang ? window.cupLang() : 'en'; }
  function t(k) { return window.cupT ? window.cupT(k) : k; }
  function pick(o) { return (lang() === 'ar' ? o.ar : o.en) || o.en || ''; }
  function money(n) { return n.toFixed(3) + ' ' + t('menu.kwd'); }


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
    el.setAttribute('data-coll', collsFor(line, item).join(' '));

    var price = line.priceKwd == null
      ? '<p class="card__price card__price--unset">' + t('menu.price.unset') + '</p>'
      : '<p class="card__price">' + money(line.priceKwd) + '</p>';

    /* The cup itself is a link to its own page — capacity, material, and the
       way through to the engraving screen with this colour already on. Add to
       cart stays a button beside it and does not navigate: putting something
       in a cart and being taken somewhere else are two different intentions,
       and a control should only ever have one. */
    el.innerHTML =
      '<p class="card__line">' + pick(line) + '</p>' +
      '<a class="card__go" href="product.html?id=' + encodeURIComponent(key) + '">' +
        '<span class="card__stage">' + cupSVG(item, line) + '</span>' +
        '<span class="card__name">' + pick(item) + '</span>' +
      '</a>' + price +
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
    var on = CART.has(el.getAttribute('data-id'));
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

  function group(host, title, nodes, cls) {
    var g = document.createElement('div');
    g.className = 'filter__group' + (cls ? ' ' + cls : '');
    g.innerHTML = '<p class="micro">' + title + '</p>';
    var row = document.createElement('div');
    row.className = 'chips';
    nodes.forEach(function (n) { row.appendChild(n); });
    g.appendChild(row);
    host.appendChild(g);
  }

  /* Which collections a cup is in. `all` is never stamped: it is the absence of
     a filter rather than a tag, and writing it onto all thirty-six cards would
     put a word on every one of them that never narrows anything.

     `limited` asks the line for the feature it already carries, so the Sadu
     line answers because it IS a limited edition and not because it was listed
     here a second time. The hand-tagged collections answer by id. */
  function collsFor(line, item) {
    var cat = window.CUP_CATALOGUE;
    var key = id(line, item);
    return (cat.collections || []).filter(function (c) {
      if (c.slug === 'all') return false;
      if (c.feature) return line.features.indexOf(c.feature) > -1;
      return (c.ids || []).indexOf(key) > -1;
    }).map(function (c) { return c.slug; });
  }

  function inColl(el) {
    if (filters.coll === 'all') return true;
    return (el.getAttribute('data-coll') || '').split(' ').indexOf(filters.coll) > -1;
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

    var per = {};
    document.querySelectorAll('.card[data-line]').forEach(function (el) {
      var slug = el.getAttribute('data-line');
      var line = lineOf(slug);
      var ok = !!line && matches(line, cat) && inColl(el);
      el.hidden = !ok;
      if (ok) { shown++; per[slug] = (per[slug] || 0) + 1; if (line.concept) concept = true; }
    });

    /* The head comes back when a single kind is picked, and now only if that
       kind still has cups under it: a collection can empty the line you
       selected, and a heading standing over nothing reads as a broken page. */
    document.querySelectorAll('[data-head]').forEach(function (head) {
      var slug = head.getAttribute('data-head');
      head.hidden = flat || slug !== filters.line || !per[slug];
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

    /* New arrivals and best sellers are tagged by hand, and "best seller" reads
       as a fact about sales. While one of those is the active filter, the page
       says where the list came from. */
    var cnote = document.querySelector('[data-coll-note]');
    if (cnote) {
      var def = (cat.collections || []).filter(function (c) { return c.slug === filters.coll; })[0];
      var mark = !!(def && def.placeholder);
      cnote.hidden = !mark;
      if (mark) cnote.textContent = t('coll.note');
    }
  }

  function buildFilters(cat) {
    var host = document.querySelector('[data-filters]');
    if (!host) return;
    host.innerHTML = '';

    /* Collections first: it is the cut a visitor arrives wanting — what is new,
       what is limited — and kind, capacity and features narrow what it leaves. */
    var colls = (cat.collections || []).map(function (c) {
      return chip(t(c.key), filters.coll === c.slug, function () {
        filters.coll = c.slug; buildFilters(cat); apply();
      });
    });
    if (colls.length) group(host, t('shop.collections'), colls, 'filter__group--coll');

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

    featuresMenu(host, cat);
  }

  /* ---- features, behind a funnel --------------------------------------- */

  /* Kind and Capacity are one answer each and read well as a row of chips.
     Features are a set you combine, and six of them laid out flat were the
     widest thing on the page — the row that pushed everything else down.
     Behind a funnel they cost one control, and the count on it says how many
     are on without opening anything. */
  function funnel() {
    return '<svg class="funnel" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           '<path d="M3 4h18l-7 8.5v7.5l-4 2.5v-10z"/></svg>';
  }

  function closeFeats(focusBtn) {
    if (!featOpen) return;
    featOpen = false;
    var pop = document.querySelector('.filterpop');
    var btn = document.querySelector('.filterbtn');
    if (pop) pop.hidden = true;
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      if (focusBtn) btn.focus();
    }
  }

  function featuresMenu(host, cat) {
    var feats = [];
    cat.lines.forEach(function (l) {
      l.features.forEach(function (f) { if (feats.indexOf(f) < 0) feats.push(f); });
    });
    if (!feats.length) return;

    var label = t('shop.features');
    var on = filters.feats.length;

    var g = document.createElement('div');
    g.className = 'filter__group filter__group--menu';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filterbtn' + (on ? ' is-on' : '');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', String(featOpen));
    btn.setAttribute('aria-controls', 'featpop');
    btn.innerHTML = funnel() + '<span>' + label + '</span>' +
      (on ? '<span class="filterbtn__n">' + on + '</span>' : '');
    /* Opening does not rebuild the bar, so the button keeps focus. Only a
       choice inside rebuilds, and that puts focus back on the chip chosen. */
    btn.addEventListener('click', function () {
      featOpen = !featOpen;
      pop.hidden = !featOpen;
      btn.setAttribute('aria-expanded', String(featOpen));
    });

    var pop = document.createElement('div');
    pop.className = 'filterpop';
    pop.id = 'featpop';
    pop.hidden = !featOpen;
    pop.setAttribute('role', 'group');
    pop.setAttribute('aria-label', label);

    var row = document.createElement('div');
    row.className = 'chips';
    feats.forEach(function (f) {
      var c = chip(t('feat.' + f), filters.feats.indexOf(f) > -1, function () {
        var i = filters.feats.indexOf(f);
        if (i > -1) filters.feats.splice(i, 1); else filters.feats.push(f);
        buildFilters(cat); apply();
        var again = document.querySelector('.filterpop [data-feat="' + f + '"]');
        if (again) again.focus();
      });
      c.setAttribute('data-feat', f);
      row.appendChild(c);
    });
    pop.appendChild(row);

    if (on) {
      var clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'filterpop__clear';
      clear.textContent = t('shop.clear');
      clear.addEventListener('click', function () {
        filters.feats = [];
        buildFilters(cat); apply();
        var b = document.querySelector('.filterbtn');
        if (b) b.focus();
      });
      pop.appendChild(clear);
    }

    g.appendChild(btn);
    g.appendChild(pop);
    host.appendChild(g);
  }

  /* ---- the tray -------------------------------------------------------- */

  function paintTray() {
    var tray = document.querySelector('[data-tray]');
    if (!tray) return;
    var c = CART.count();
    tray.hidden = c === 0;
    var n = tray.querySelector('[data-tray-count]');
    if (n) n.textContent = c + ' ' + t(c === 1 ? 'shop.one' : 'shop.many');
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
    /* Before anything else: a click anywhere outside the funnel closes it,
       including one that also puts a cup aside. */
    if (featOpen && !(e.target.closest && e.target.closest('.filter__group--menu'))) {
      closeFeats(false);
    }
    var add = e.target.closest && e.target.closest('[data-add]');
    if (add) {
      CART.toggle(add.getAttribute('data-add'));
      return;
    }
    if (e.target.closest && e.target.closest('[data-tray-clear]')) CART.clear();
  });

  /* Escape closes it and hands focus back to the funnel, the same bargain the
     burger menu makes. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeFeats(true);
  });

  /* The cart tells everything that shows it when it changed — this page, the
     button in the header, and the tray — so none of them has to poll. */
  CART.onChange(paintTray);

  if (window.cupT) render();
  else document.addEventListener('cup:ready', render, { once: true });
  document.addEventListener('cup:lang', render);
})();

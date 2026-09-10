/* THE CART.

   One list, kept in localStorage under cup.picked — the same key the menu page
   has always used for the cups you put aside, because that list and this cart
   were always the same thing under two names. Renaming the key would have
   emptied the cart of everybody who already had one.

   An entry is a line id, "classic/navy", plus a count. The catalogue is the
   only source of what that id means: nothing about a cup — its name, its
   colour, its price — is copied into the cart, so correcting a price in
   catalogue.js corrects every cart that holds it. A cup deleted from the
   catalogue simply stops appearing, rather than lingering as a stale row for
   something we no longer make.

   The button lives in the top right, opposite the menu, on every page. The
   panel it opens is built once and moved nowhere, so opening it costs nothing
   after the first time. */

window.CUP_CART = (function () {
  'use strict';

  var KEY = 'cup.picked';
  var listeners = [];

  function read() {
    var raw;
    try { raw = JSON.parse(localStorage.getItem(KEY)); } catch (e) { raw = null; }
    if (!Array.isArray(raw)) return [];
    /* The old shape was a flat list of ids with no counts. Read it, do not
       discard it: somebody mid-decision when this shipped keeps their cups. */
    return raw.map(function (row) {
      if (typeof row === 'string') return { id: row, n: 1 };
      return { id: String(row && row.id || ''), n: Math.max(1, parseInt(row && row.n, 10) || 1) };
    }).filter(function (row) { return row.id; });
  }

  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    listeners.forEach(function (fn) { fn(); });
  }

  /* What a line id actually refers to, or null if the catalogue no longer has
     it. Every reader goes through here, so there is one answer. */
  function resolve(id) {
    var cat = window.CUP_CATALOGUE;
    if (!cat) return null;
    var parts = String(id).split('/');
    var line = cat.lines.filter(function (l) { return l.slug === parts[0]; })[0];
    if (!line) return null;
    var item = line.items.filter(function (i) { return i.slug === parts[1]; })[0];
    if (!item) return null;
    return { id: id, line: line, item: item, body: cat.bodies[line.body] || {} };
  }

  var api = {
    key: KEY,

    all: read,

    /* Only the rows the catalogue still recognises, each with what it means. */
    resolved: function () {
      return read().map(function (row) {
        var r = resolve(row.id);
        return r ? { id: row.id, n: row.n, line: r.line, item: r.item, body: r.body } : null;
      }).filter(Boolean);
    },

    count: function () {
      return api.resolved().reduce(function (a, r) { return a + r.n; }, 0);
    },

    has: function (id) {
      return read().some(function (r) { return r.id === id; });
    },

    add: function (id, n) {
      var list = read();
      var found = list.filter(function (r) { return r.id === id; })[0];
      if (found) found.n += (n || 1);
      else list.push({ id: id, n: n || 1 });
      write(list);
    },

    remove: function (id) {
      write(read().filter(function (r) { return r.id !== id; }));
    },

    /* The card button is a toggle — press it again and the cup leaves. */
    toggle: function (id) {
      if (api.has(id)) api.remove(id); else api.add(id, 1);
    },

    setCount: function (id, n) {
      if (n <= 0) return api.remove(id);
      var list = read();
      var found = list.filter(function (r) { return r.id === id; })[0];
      if (found) { found.n = n; write(list); }
    },

    clear: function () { write([]); },

    /* Null when any cup in the cart has no price yet. A total that quietly
       leaves out the unpriced ones is a wrong number, and a wrong number on a
       checkout is the worst kind. */
    total: function () {
      var rows = api.resolved();
      var sum = 0;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].line.priceKwd == null) return null;
        sum += rows[i].line.priceKwd * rows[i].n;
      }
      return sum;
    },

    onChange: function (fn) { listeners.push(fn); }
  };

  return api;
})();


/* ---- the button, and the panel behind it -------------------------------- */

(function () {
  'use strict';

  var C = window.CUP_CART;
  var panel, btn, open = false, lastFocus = null;

  function t(k) { return window.cupT ? window.cupT(k) : k; }
  function lang() { return window.cupLang ? window.cupLang() : 'en'; }
  function pick(o) { return (lang() === 'ar' ? o.ar : o.en) || o.en || ''; }
  function money(n) { return n.toFixed(3) + ' ' + t('menu.kwd'); }

  function bag() {
    return '<svg class="bag" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  }

  /* The button replaces "Engrave yours" in the header. That link is not lost:
     it is the whole of frame 03 on the home page and the first thing on every
     cup's own page. A cart with no way to reach it is worse than a second
     route to the engraving screen. */
  function build() {
    var host = document.querySelector('.top__end');
    if (!host || host.querySelector('[data-cart-btn]')) return;
    host.innerHTML = '';

    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cartbtn';
    btn.setAttribute('data-cart-btn', '');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'cartpanel');
    btn.innerHTML = bag() + '<span class="cartbtn__t"></span><span class="cartbtn__n" hidden></span>';
    btn.addEventListener('click', function () { open ? close() : show(); });
    host.appendChild(btn);

    panel = document.createElement('div');
    panel.className = 'cartpanel';
    panel.id = 'cartpanel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    document.body.appendChild(panel);

    document.addEventListener('click', function (e) {
      if (!open) return;
      if (e.target.closest('.cartpanel') || e.target.closest('[data-cart-btn]')) return;
      close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) close();
    });

    C.onChange(paint);
    paint();
  }

  function paint() {
    if (!btn) return;
    var n = C.count();
    btn.querySelector('.cartbtn__t').textContent = t('nav.cart');
    btn.setAttribute('aria-label', t('cart.open'));
    var badge = btn.querySelector('.cartbtn__n');
    badge.textContent = n;
    badge.hidden = n === 0;
    btn.classList.toggle('is-on', n > 0);
    if (open) fill();
  }

  function fill() {
    var rows = C.resolved();
    var head = '<div class="cartpanel__head"><p class="micro">' + t('cart.title') + '</p>' +
      '<button type="button" class="iconbtn" data-cart-close aria-label="' + t('nav.close') + '">' +
      '<span aria-hidden="true">✕</span></button></div>';

    if (!rows.length) {
      panel.innerHTML = head + '<p class="pending">' + t('cart.empty') + '</p>';
      wire();
      return;
    }

    var body = rows.map(function (r) {
      var price = r.line.priceKwd == null
        ? '<span class="card__price--unset">' + t('menu.price.unset') + '</span>'
        : money(r.line.priceKwd * r.n);
      return '<li class="cartrow">' +
        '<span class="cartrow__sw" style="--sw:' + r.item.hex + '" aria-hidden="true"></span>' +
        '<span class="cartrow__t"><b>' + pick(r.item) + '</b>' +
          '<span class="micro">' + pick(r.line) + ' · ' + r.body.capacityMl + ' ml</span></span>' +
        '<span class="cartrow__n">×' + r.n + '</span>' +
        '<span class="cartrow__p">' + price + '</span>' +
        '<button type="button" class="iconbtn" data-cart-rm="' + r.id + '" ' +
          'aria-label="' + t('cart.remove') + '"><span aria-hidden="true">✕</span></button>' +
      '</li>';
    }).join('');

    var total = C.total();
    var foot = '<div class="cartpanel__foot">' +
      '<p class="cartpanel__total">' + t('cart.total') + ' <b>' +
        (total == null ? t('cart.unpriced') : money(total)) + '</b></p>' +
      '<a class="btn" href="checkout.html"><span>' + t('cart.checkout') +
        '</span><span class="arrow" aria-hidden="true">→</span></a></div>';

    panel.innerHTML = head + '<ul class="cartlist">' + body + '</ul>' + foot;
    wire();
  }

  function wire() {
    panel.querySelectorAll('[data-cart-rm]').forEach(function (b) {
      b.addEventListener('click', function () { C.remove(b.getAttribute('data-cart-rm')); });
    });
    var x = panel.querySelector('[data-cart-close]');
    if (x) x.addEventListener('click', close);
  }

  function show() {
    lastFocus = document.activeElement;
    fill();
    panel.hidden = false;
    open = true;
    btn.setAttribute('aria-expanded', 'true');
    var f = panel.querySelector('button, a');
    if (f) f.focus();
  }

  function close() {
    panel.hidden = true;
    open = false;
    btn.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function boot() { build(); }

  if (window.cupT) boot();
  else document.addEventListener('cup:ready', boot, { once: true });
  document.addEventListener('cup:lang', function () { if (btn) paint(); });
})();

/* MY ACCOUNT — who you are, and what you have ordered.

   Both halves read the same place: the metadata on the account itself. See the
   note in backend.js for why, and for what has to change before an order
   status means anything a customer cannot edit.

   The email is shown and not editable. Changing the address on an account is
   changing the way back into it, and doing that properly needs a confirmation
   sent to both addresses — which is a different feature, not a text box. */

(function () {
  'use strict';

  var B = window.CUP_BACKEND;
  var form = document.getElementById('acctform');
  if (!form || !B) return;

  var msg = document.getElementById('msg');
  var save = document.getElementById('acctsave');
  var meta = {};

  function t(k) { return window.cupT ? window.cupT(k) : k; }
  function lang() { return window.cupLang ? window.cupLang() : 'en'; }
  function pick(o) { return (lang() === 'ar' ? o.ar : o.en) || o.en || ''; }
  function money(n) { return n.toFixed(3) + ' ' + t('menu.kwd'); }

  function say(key, ok) {
    msg.hidden = false;
    msg.textContent = t(key);
    msg.className = 'notice' + (ok ? ' notice--ok' : '');
  }

  /* ---- the person ------------------------------------------------------ */

  function fillForm(email) {
    document.getElementById('a-name').value = meta.full_name || '';
    document.getElementById('a-email').value = email || '';
    document.getElementById('a-phone').value = meta.phone || '';
    document.getElementById('a-area').value = meta.area || '';
    var hello = document.getElementById('hello');
    if (hello && meta.full_name) hello.textContent = meta.full_name;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    save.disabled = true;
    /* Spread onto what is already there rather than replacing it. Saving the
       four boxes on this form must not drop the addresses and the orders that
       live in the same object. */
    meta.full_name = document.getElementById('a-name').value.trim();
    meta.phone = document.getElementById('a-phone').value.trim();
    meta.area = document.getElementById('a-area').value.trim();
    B.saveUser(meta).then(function () {
      save.disabled = false;
      say('acct.saved', true);
      var hello = document.getElementById('hello');
      if (hello && meta.full_name) hello.textContent = meta.full_name;
    }).catch(function (err) {
      save.disabled = false;
      say(err && err.key ? err.key : 'auth.err.network');
    });
  });

  /* ---- the orders ------------------------------------------------------ */

  /* The date an order was placed, in the reader's own language and their own
     timezone, with the time beside it — "which of today's two orders is this"
     is a question a date alone cannot answer. */
  function when(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    try {
      return new Intl.DateTimeFormat(lang() === 'ar' ? 'ar-KW' : 'en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(d);
    } catch (e) { return d.toLocaleString(); }
  }

  function lineFor(id) {
    var cat = window.CUP_CATALOGUE;
    var p = String(id).split('/');
    var line = cat && cat.lines.filter(function (l) { return l.slug === p[0]; })[0];
    if (!line) return null;
    var item = line.items.filter(function (i) { return i.slug === p[1]; })[0];
    return item ? { line: line, item: item } : null;
  }

  var STATUS = ['placed', 'making', 'onway', 'delivered'];

  function renderOrders() {
    var host = document.querySelector('[data-orders]');
    if (!host) return;
    var orders = Array.isArray(meta.orders) ? meta.orders : [];

    if (!orders.length) {
      host.innerHTML = '<p class="pending">' + t('acct.noorders') + '</p>';
      return;
    }

    host.innerHTML = orders.map(function (o) {
      var count = (o.items || []).reduce(function (a, r) { return a + (r.n || 1); }, 0);

      var what = (o.items || []).map(function (r) {
        var f = lineFor(r.id);
        var name = f ? pick(f.item) + ' · ' + pick(f.line) : r.id;
        return '<li>' + name + ' <span class="micro">×' + (r.n || 1) + '</span></li>';
      }).join('');

      var step = Math.max(0, STATUS.indexOf(o.status || 'placed'));
      var track = STATUS.map(function (s, i) {
        return '<li class="track__s' + (i <= step ? ' is-done' : '') + '">' +
               t('status.' + s) + '</li>';
      }).join('');

      var to = o.gift
        ? '<p class="micro">' + t('acct.giftto') + ' ' +
            esc((o.recipient && o.recipient.name) || '') + '</p>'
        : (o.address
            ? '<p class="micro">' + esc(o.address.label || '') + ' — ' + esc(o.address.body || '') + '</p>'
            : '');

      return '<article class="order">' +
        '<header class="order__head">' +
          '<p class="order__id">' + t('acct.order') + ' ' + esc(o.id || '') + '</p>' +
          '<p class="micro">' + t('acct.placed') + ' ' + when(o.placed_at) + '</p>' +
        '</header>' +
        '<ol class="track">' + track + '</ol>' +
        '<ul class="order__items">' + what + '</ul>' +
        to +
        (o.message ? '<p class="note">“' + esc(o.message) + '”</p>' : '') +
        '<p class="order__foot"><span class="micro">' + count + ' ' + t('acct.items') + '</span>' +
          (o.total == null ? '' : '<b>' + money(o.total) + '</b>') + '</p>' +
      '</article>';
    }).join('');
  }

  /* Order contents are the customer's own words in the gift message and their
     own address. Both go through here before they reach innerHTML. */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---- arriving -------------------------------------------------------- */

  function load() {
    if (!B.available) { say('auth.err.nobackend'); return; }
    B.getUser().then(function (u) {
      meta = u.meta || {};
      fillForm(u.email);
      renderOrders();
    }).catch(function (err) {
      say(err && err.key ? err.key : 'auth.err.network');
    });
  }

  if (window.cupT) load();
  else document.addEventListener('cup:ready', load, { once: true });
  document.addEventListener('cup:lang', renderOrders);
})();

/* CHECKOUT — where the cups are going.

   Two answers, and they are genuinely different shapes rather than one form
   with a box ticked. An address is yours, you will use it again, and it is
   worth keeping. A gift is somebody else's and you may never send them
   anything again — so it asks for a name and a number and nothing else, and
   keeps none of it beyond the order it belongs to.

   Three saved addresses is the cap. It is enforced here and again in
   backend.js, because a limit that only exists in the form it is typed into is
   not a limit. */

(function () {
  'use strict';

  var B = window.CUP_BACKEND;
  var C = window.CUP_CART;
  if (!B || !C || !document.querySelector('[data-addresses]')) return;

  var MAX = B.MAX_ADDRESSES;
  var MSG_MAX = 250;

  var msg = document.getElementById('msg');
  var placeBtn = document.getElementById('placebtn');
  var meta = {};
  var addresses = [];
  var chosen = null;
  var editing = null;   /* index being edited, -1 for a new one, null for none */

  function t(k) { return window.cupT ? window.cupT(k) : k; }
  function lang() { return window.cupLang ? window.cupLang() : 'en'; }
  function pick(o) { return (lang() === 'ar' ? o.ar : o.en) || o.en || ''; }
  function money(n) { return n.toFixed(3) + ' ' + t('menu.kwd'); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function say(key, ok) {
    msg.hidden = false;
    msg.textContent = t(key);
    msg.className = 'notice' + (ok ? ' notice--ok' : '');
    msg.scrollIntoView({ block: 'nearest' });
  }

  /* ---- what is being ordered ------------------------------------------- */

  function renderCart() {
    var host = document.querySelector('[data-co-cart]');
    var rows = C.resolved();
    if (!rows.length) {
      host.innerHTML = '<p class="pending">' + t('cart.empty') + '</p>';
      placeBtn.disabled = true;
      return;
    }
    placeBtn.disabled = false;
    var total = C.total();
    host.innerHTML = '<ul class="cartlist cartlist--flat">' + rows.map(function (r) {
      return '<li class="cartrow">' +
        '<span class="cartrow__sw" style="--sw:' + r.item.hex + '" aria-hidden="true"></span>' +
        '<span class="cartrow__t"><b>' + esc(pick(r.item)) + '</b>' +
          '<span class="micro">' + esc(pick(r.line)) + ' · ' + r.body.capacityMl + ' ml</span></span>' +
        '<span class="cartrow__n">×' + r.n + '</span>' +
        '<span class="cartrow__p">' + (r.line.priceKwd == null
          ? '<span class="card__price--unset">' + t('menu.price.unset') + '</span>'
          : money(r.line.priceKwd * r.n)) + '</span></li>';
    }).join('') + '</ul>' +
      '<p class="cartpanel__total">' + t('cart.total') + ' <b>' +
        (total == null ? t('cart.unpriced') : money(total)) + '</b></p>';
  }

  /* ---- the address book ------------------------------------------------ */

  function pen() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>';
  }

  function renderAddresses() {
    var host = document.querySelector('[data-addresses]');
    var out = '';

    if (!addresses.length && editing === null) {
      out += '<p class="pending">' + t('co.pickaddr') + '</p>';
    }

    out += '<ul class="addrlist">' + addresses.map(function (a, i) {
      if (editing === i) return '<li class="addr addr--edit">' + formHTML(a, i) + '</li>';
      return '<li class="addr">' +
        '<label class="addr__pick">' +
          '<input type="radio" name="addr" value="' + i + '"' +
            (chosen === i ? ' checked' : '') + '>' +
          '<span class="addr__t"><b>' + esc(a.label) + '</b>' +
            '<span class="micro">' + esc(a.body) + '</span></span>' +
        '</label>' +
        '<span class="addr__acts">' +
          '<button type="button" class="iconbtn" data-addr-edit="' + i + '" ' +
            'aria-label="' + t('co.edit') + '">' + pen() + '</button>' +
          '<button type="button" class="iconbtn" data-addr-del="' + i + '" ' +
            'aria-label="' + t('co.delete') + '"><span aria-hidden="true">✕</span></button>' +
        '</span></li>';
    }).join('') + '</ul>';

    if (editing === -1) {
      out += '<div class="addr addr--edit">' + formHTML({ label: '', body: '' }, -1) + '</div>';
    } else if (addresses.length >= MAX) {
      out += '<p class="note">' + t('co.max') + '</p>';
    } else if (editing === null) {
      out += '<button type="button" class="btn btn--ghost addr__add" data-addr-new>' +
             '<span aria-hidden="true">+</span> ' + t('co.addnew') + '</button>';
    }

    host.innerHTML = out;
    wireAddresses();
  }

  function formHTML(a, i) {
    return '<div class="field"><label for="ad-l">' + t('co.addrname') + '</label>' +
      '<input id="ad-l" type="text" value="' + esc(a.label) + '" ' +
        'placeholder="' + t('co.addrnameph') + '"></div>' +
      '<div class="field" style="max-inline-size:none"><label for="ad-b">' + t('co.addrbody') + '</label>' +
      '<textarea id="ad-b" rows="3">' + esc(a.body) + '</textarea></div>' +
      '<div class="addr__btns">' +
        '<button type="button" class="btn" data-addr-save="' + i + '">' + t('co.save') + '</button>' +
        '<button type="button" class="btn btn--ghost" data-addr-cancel>' + t('co.cancel') + '</button>' +
      '</div>';
  }

  function wireAddresses() {
    var host = document.querySelector('[data-addresses]');

    host.querySelectorAll('input[name="addr"]').forEach(function (r) {
      r.addEventListener('change', function () { chosen = parseInt(r.value, 10); });
    });
    host.querySelectorAll('[data-addr-edit]').forEach(function (b) {
      b.addEventListener('click', function () {
        editing = parseInt(b.getAttribute('data-addr-edit'), 10);
        renderAddresses();
      });
    });
    host.querySelectorAll('[data-addr-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = parseInt(b.getAttribute('data-addr-del'), 10);
        addresses.splice(i, 1);
        /* The selection is an index into a list that just got shorter. */
        if (chosen === i) chosen = null;
        else if (chosen != null && chosen > i) chosen--;
        persist();
      });
    });
    var add = host.querySelector('[data-addr-new]');
    if (add) add.addEventListener('click', function () { editing = -1; renderAddresses(); });

    var cancel = host.querySelector('[data-addr-cancel]');
    if (cancel) cancel.addEventListener('click', function () { editing = null; renderAddresses(); });

    var save = host.querySelector('[data-addr-save]');
    if (save) save.addEventListener('click', function () {
      var i = parseInt(save.getAttribute('data-addr-save'), 10);
      var label = host.querySelector('#ad-l').value.trim();
      var body = host.querySelector('#ad-b').value.trim();
      if (!label || !body) return;
      if (i === -1) {
        if (addresses.length >= MAX) { editing = null; renderAddresses(); return; }
        addresses.push({ label: label, body: body });
        chosen = addresses.length - 1;
      } else {
        addresses[i] = { label: label, body: body };
      }
      editing = null;
      persist();
    });
  }

  function persist() {
    B.saveAddresses(addresses).then(function (list) {
      addresses = list;
      meta.addresses = list;
      renderAddresses();
    }).catch(function (err) {
      say(err && err.key ? err.key : 'auth.err.network');
      renderAddresses();
    });
  }

  /* ---- which of the two ------------------------------------------------ */

  document.querySelectorAll('input[name="dest"]').forEach(function (r) {
    r.addEventListener('change', function () {
      document.querySelector('[data-pane="addr"]').hidden = r.value !== 'addr';
      document.querySelector('[data-pane="gift"]').hidden = r.value !== 'gift';
      msg.hidden = true;
    });
  });

  function mode() {
    var r = document.querySelector('input[name="dest"]:checked');
    return r ? r.value : 'addr';
  }

  /* The counter counts down rather than up, because the number a person needs
     is how much room is left, not how much they have used. */
  var gmsg = document.getElementById('g-msg');
  var gcount = document.getElementById('g-count');
  if (gmsg) {
    gmsg.addEventListener('input', function () {
      /* Clamped at zero. maxlength stops a person typing or pasting past the
         limit, so this only ever goes negative if something else set the
         value — and a counter reading minus fifty helps nobody. */
      gcount.textContent = String(Math.max(0, MSG_MAX - gmsg.value.length));
    });
  }

  /* ---- placing it ------------------------------------------------------ */

  placeBtn.addEventListener('click', function () {
    var rows = C.resolved();
    if (!rows.length) { say('co.emptycart'); return; }

    var order = {
      items: rows.map(function (r) { return { id: r.id, n: r.n }; }),
      total: C.total(),
      gift: mode() === 'gift'
    };

    if (order.gift) {
      var name = document.getElementById('g-name').value.trim();
      var phone = document.getElementById('g-phone').value.trim();
      if (!name || !phone) { say('co.needgift'); return; }
      order.recipient = { name: name, phone: phone };
      order.message = gmsg.value.trim().slice(0, MSG_MAX);
    } else {
      if (chosen == null || !addresses[chosen]) { say('co.needaddr'); return; }
      order.address = addresses[chosen];
    }

    placeBtn.disabled = true;
    B.placeOrder(order).then(function () {
      C.clear();
      location.href = 'account.html';
    }).catch(function (err) {
      placeBtn.disabled = false;
      say(err && err.key ? err.key : 'auth.err.network');
    });
  });

  /* ---- arriving -------------------------------------------------------- */

  function load() {
    renderCart();
    if (!B.available) { say('auth.err.nobackend'); return; }
    B.getUser().then(function (u) {
      meta = u.meta || {};
      addresses = Array.isArray(meta.addresses) ? meta.addresses.slice(0, MAX) : [];
      if (addresses.length) chosen = 0;
      renderAddresses();
    }).catch(function (err) {
      say(err && err.key ? err.key : 'auth.err.network');
      renderAddresses();
    });
  }

  if (window.cupT) load();
  else document.addEventListener('cup:ready', load, { once: true });
  document.addEventListener('cup:lang', function () { renderCart(); renderAddresses(); });
})();

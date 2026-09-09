/* The reservation: read it, change it, cancel it.

   In its own file rather than inline so the Content-Security-Policy can forbid
   inline script outright. */

(function () {
  'use strict';

  var B = window.CUP_BACKEND;
  if (!B || !B.signedIn()) return;   /* backend.js has already sent them to login */

  var form = document.getElementById('resform');
  var msg = document.getElementById('msg');
  var hello = document.getElementById('hello');
  if (!form) return;

  function say(key, ok) {
    msg.hidden = false;
    msg.textContent = window.cupT(key);
    msg.className = 'notice' + (ok ? ' notice--ok' : '');
  }

  function greet() {
    hello.textContent = window.cupT('res.hello').replace('{name}', B.displayName());
  }
  greet();
  document.addEventListener('cup:lang', greet);

  function draft() {
    try { return JSON.parse(localStorage.getItem('cup.draft') || 'null'); }
    catch (e) { return null; }
  }

  function pickColour(slug) {
    var picked = form.querySelector('input[name="colour"][value="' + slug + '"]');
    if (picked) { picked.checked = true; picked.dispatchEvent(new Event('change', { bubbles: true })); }
  }

  function fill(row) {
    form.qty.value = row.quantity || 1;
    document.getElementById('eng').value = row.engraving || '';
    pickColour(row.colour);
    if (window.cupModel) {
      window.cupModel.setEngraving(row.engraving || '', row.engraving_script || 'latin');
    }
  }

  B.getReservation().then(function (row) {
    if (row) { fill(row); return; }
    /* Nothing reserved yet — carry over whatever was set up on the engraving
       page, so signing in does not lose the work. */
    var d = draft();
    if (d) {
      document.getElementById('eng').value = d.engraving || '';
      pickColour(d.colour);
      if (window.cupModel) window.cupModel.setEngraving(d.engraving || '', d.engraving_script);
    }
    say('res.none', true);
  }).catch(function (err) { say(err && err.key ? err.key : 'auth.err.network'); });

  document.getElementById('eng').addEventListener('input', function (e) {
    if (!window.cupModel) return;
    var d = draft() || {};
    window.cupModel.setEngraving(e.target.value, d.engraving_script || 'latin');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var colour = (form.querySelector('input[name="colour"]:checked') || {}).value || 'navy';
    var d = draft() || {};
    B.saveReservation({
      quantity: Math.max(1, Math.min(20, parseInt(form.qty.value, 10) || 1)),
      colour: colour,
      engraving: document.getElementById('eng').value.slice(0, 20),
      engraving_script: d.engraving_script === 'arabic' ? 'arabic' : 'latin',
      display_name: B.displayName().slice(0, 60)
    }).then(function () { say('res.saved', true); })
      .catch(function (err) { say(err && err.key ? err.key : 'auth.err.network'); });
  });

  document.getElementById('cancel').addEventListener('click', function () {
    B.cancelReservation().then(function () {
      form.reset();
      say('res.cancelled', true);
    }).catch(function (err) { say(err && err.key ? err.key : 'auth.err.network'); });
  });

  document.getElementById('signout').addEventListener('click', function () {
    B.signOut();
    location.replace('index.html');
  });
})();

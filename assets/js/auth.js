/* Logging in, and making an account.

   Two pages, one file. Logging in needs an email and a password and nothing
   else, so /login is two boxes and a button; making an account needs a name, a
   phone and an area as well, and those questions belong on their own screen
   rather than hidden behind a tab on this one. The form says which it is with
   data-auth-mode and everything below reads that.

   Lifted out of the page into its own file so the Content-Security-Policy can
   forbid inline script entirely. An inline <script> block is indistinguishable,
   to the browser, from one an attacker managed to inject. */

(function () {
  'use strict';

  var B = window.CUP_BACKEND;
  var form = document.getElementById('authform');
  if (!form || !B) return;

  var mode = form.getAttribute('data-auth-mode') === 'up' ? 'up' : 'in';
  var msg = document.getElementById('msg');
  var submit = document.getElementById('submitbtn');
  var pw = document.getElementById('pw');
  var eye = document.getElementById('pweye');

  function say(key, ok) {
    msg.hidden = false;
    msg.textContent = window.cupT(key);
    msg.className = 'notice' + (ok ? ' notice--ok' : '');
  }

  function next() {
    var q = new URLSearchParams(location.search).get('next');
    /* Only ever a page name in this directory, so a crafted ?next= cannot bounce
       somebody off this site immediately after they hand over a password. */
    return /^[a-z0-9_-]+\.html$/i.test(q || '') ? q : 'account.html';
  }

  function busy(on) {
    submit.disabled = on;
    document.querySelectorAll('[data-oauth]').forEach(function (b) { b.disabled = on; });
    if (on) say('auth.working', true);
  }

  function done(r) {
    if (r && r.signedIn) { location.replace(next()); return; }
    busy(false);
    say(r && r.key ? r.key : 'auth.signedup', true);
  }

  function fail(err) {
    busy(false);
    say(err && err.key ? err.key : 'auth.err.network');
  }

  /* ---- the two of them -------------------------------------------------- */

  function logIn() {
    var email = form.email.value.trim();
    if (!email || !pw.value) { say('auth.err.email'); return; }
    busy(true);
    /* The password goes from the field straight into the call. It is never
       assigned to anything of ours, so there is nowhere for it to leak from. */
    B.signIn(email, pw.value).then(done).catch(fail);
  }

  function signUp() {
    var email = form.email.value.trim();
    var meta = {
      full_name: form.fullname.value.trim(),
      phone: form.phone.value.trim(),
      area: form.area.value.trim()
    };
    if (!email || !pw.value) { say('auth.err.email'); return; }
    if (!meta.full_name || !meta.phone || !meta.area) { say('auth.err.fields'); return; }
    busy(true);
    B.signUp(email, pw.value, meta).then(done).catch(fail);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    mode === 'up' ? signUp() : logIn();
  });

  /* ---- through somebody else -------------------------------------------

     Only rendered on the sign-up screen, but the handler is here because the
     provider sends everybody back to /login and the token is read there. */
  document.querySelectorAll('[data-oauth]').forEach(function (b) {
    b.addEventListener('click', function () {
      var q = new URLSearchParams(location.search).get('next');
      busy(true);
      location.href = B.oauthUrl(b.getAttribute('data-oauth'),
        /^[a-z0-9_-]+\.html$/i.test(q || '') ? q : '');
    });
  });

  /* ---- the reveal ------------------------------------------------------

     Two seconds, then it hides itself. Long enough to read back what you
     typed, short enough that a password left visible on a screen in a café is
     not a thing this page can cause. Pressing it again while it is showing
     hides it at once rather than waiting the timer out — the control has to
     answer immediately or it does not feel like a control. */
  if (eye) {
    var timer = null;

    function hide() {
      clearTimeout(timer);
      timer = null;
      pw.type = 'password';
      eye.setAttribute('aria-pressed', 'false');
      eye.setAttribute('aria-label', window.cupT('auth.show'));
    }

    eye.addEventListener('click', function () {
      if (pw.type === 'text') { hide(); return; }
      pw.type = 'text';
      eye.setAttribute('aria-pressed', 'true');
      eye.setAttribute('aria-label', window.cupT('auth.hide'));
      clearTimeout(timer);
      timer = setTimeout(hide, 2000);
    });

    /* Leaving the page with it still showing should not leave it showing on
       the way back through the cache. */
    window.addEventListener('pagehide', hide);
  }

  /* ---- arriving --------------------------------------------------------- */

  /* A provider sends the token back in the fragment. Read it before deciding
     whether this person is already signed in, or the redirect that just
     succeeded looks exactly like an ordinary visit. */
  var back = B.captureRedirect();
  if (back && back !== 'ok') say(back);

  if (!B.available) say('auth.err.nobackend');
  if (B.signedIn()) location.replace(next());
})();

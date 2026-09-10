/* Sign in and create account.

   Lifted out of the page into its own file so the Content-Security-Policy can
   forbid inline script entirely. An inline <script> block is indistinguishable,
   to the browser, from one an attacker managed to inject. */

(function () {
  'use strict';

  var B = window.CUP_BACKEND;
  var form = document.getElementById('authform');
  if (!form || !B) return;

  var msg = document.getElementById('msg');
  var signin = document.getElementById('signin');
  var signup = document.getElementById('signup');
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
    return /^[a-z0-9_-]+\.html$/i.test(q || '') ? q : 'reserve.html';
  }

  function busy(on) {
    signin.disabled = on;
    signup.disabled = on;
    if (on) say('auth.working', true);
  }

  function go(fn) {
    var email = form.email.value.trim();
    if (!email || !pw.value) { say('auth.err.email'); return; }
    busy(true);
    /* The password goes from the field straight into the call. It is never
       assigned to anything of ours, so there is nowhere for it to leak from. */
    fn(email, pw.value).then(function (r) {
      if (r && r.signedIn) { location.replace(next()); return; }
      busy(false);
      say(r && r.key ? r.key : 'auth.signedup', true);
    }).catch(function (err) {
      busy(false);
      say(err && err.key ? err.key : 'auth.err.network');
    });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); go(B.signIn); });
  signup.addEventListener('click', function () { go(B.signUp); });

  /* Reveal is a real accessibility feature — people mistype passwords on phones
     constantly — but it must announce its state, not just change an icon. */
  if (eye) {
    eye.addEventListener('click', function () {
      var shown = pw.type === 'text';
      pw.type = shown ? 'password' : 'text';
      eye.setAttribute('aria-pressed', String(!shown));
      eye.setAttribute('aria-label', window.cupT(shown ? 'auth.show' : 'auth.hide'));
    });
  }

  if (!B.available) say('auth.err.nobackend');
  if (B.signedIn()) location.replace(next());
})();

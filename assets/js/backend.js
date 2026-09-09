/* The back end, by hand.

   There is no bundler and no CDN in this project, so supabase-js cannot be
   imported. Every call below is a plain fetch against the Supabase auth and
   REST endpoints, which is all supabase-js does for these operations anyway.

   The publishable key is committed on purpose. It ships in the JavaScript of
   every Supabase site on the web and is not a secret. What protects the data is
   Row Level Security, which is on, and which only ever hands a reservation row
   back to the session that owns it. The service_role key bypasses all of that
   and is not in this repository. */

window.CUP_BACKEND = (function () {
  'use strict';

  var URL_BASE = 'https://vufibpaxprcydixjfoue.supabase.co';
  var KEY = 'sb_publishable_1YzyUwN6xgB2qXLf6AqLqA_iU8m0-2Q';

  var STORE = 'cup.session';

  /* Opened from a file:// path there is no origin to call from, and the honest
     answer is that there is no back end rather than a stack of failed fetches. */
  var available = location.protocol === 'http:' || location.protocol === 'https:';

  function readSession() {
    try {
      var raw = localStorage.getItem(STORE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeSession(s) {
    try {
      if (s) localStorage.setItem(STORE, JSON.stringify(s));
      else localStorage.removeItem(STORE);
    } catch (e) {}
  }

  function headers(withAuth) {
    var h = { 'apikey': KEY, 'Content-Type': 'application/json' };
    var s = readSession();
    /* The publishable key is the fallback Authorization. An authenticated call
       must carry the user's access token instead, or RLS sees an anonymous
       request and correctly returns nothing. */
    h['Authorization'] = 'Bearer ' + ((withAuth && s && s.access_token) ? s.access_token : KEY);
    return h;
  }

  /* Supabase reports failures in prose that is accurate but not addressed to a
     customer. This turns each one into something a person can act on, in their
     own language. */
  function classify(status, body) {
    var msg = ((body && (body.error_description || body.msg || body.message || body.error)) || '').toLowerCase();
    if (msg.indexOf('already registered') > -1 || msg.indexOf('already been registered') > -1) return 'auth.err.exists';
    if (msg.indexOf('email not confirmed') > -1 || msg.indexOf('not confirmed') > -1) return 'auth.err.unconfirmed';
    if (msg.indexOf('invalid login') > -1 || msg.indexOf('invalid credentials') > -1) return 'auth.err.credentials';
    if (msg.indexOf('password') > -1 && (msg.indexOf('short') > -1 || msg.indexOf('least') > -1 || msg.indexOf('weak') > -1)) return 'auth.err.weak';
    if (msg.indexOf('valid email') > -1 || msg.indexOf('invalid email') > -1) return 'auth.err.email';
    if (status === 429) return 'auth.err.rate';
    if (status === 400 || status === 401) return 'auth.err.credentials';
    return 'auth.err.network';
  }

  function call(path, opts) {
    return fetch(URL_BASE + path, opts).then(function (res) {
      return res.text().then(function (text) {
        var body = null;
        try { body = text ? JSON.parse(text) : null; } catch (e) { body = null; }
        if (!res.ok) {
          var err = new Error('supabase');
          err.key = classify(res.status, body);
          err.status = res.status;
          throw err;
        }
        return body;
      });
    }, function () {
      var err = new Error('network');
      err.key = 'auth.err.network';
      throw err;
    });
  }

  /* A display name from the address, so the page can greet somebody without
     ever asking for a name it does not need. first.last@x -> First Last */
  function nameFromEmail(email) {
    var local = String(email || '').split('@')[0] || '';
    return local.split(/[._-]+/).filter(Boolean).map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ') || local;
  }

  var api = {
    available: available,

    session: readSession,

    signedIn: function () {
      var s = readSession();
      return !!(s && s.access_token);
    },

    displayName: function () {
      var s = readSession();
      if (!s) return '';
      return s.display_name || nameFromEmail(s.email);
    },

    /* The password is passed straight into the request body and is never
       assigned to anything that outlives this call. It is not stored, not
       logged, and not put on the session object. */
    signUp: function (email, password) {
      if (!available) return Promise.reject(nobackend());
      return call('/auth/v1/signup', {
        method: 'POST',
        headers: headers(false),
        body: JSON.stringify({ email: email, password: password })
      }).then(function (body) {
        /* With email confirmation on, a new account gets no session until the
           link is clicked. That is correct behaviour, not an error. */
        if (body && body.access_token) {
          writeSession({ access_token: body.access_token, refresh_token: body.refresh_token, email: email });
          return { signedIn: true };
        }
        return { signedIn: false, key: 'auth.signedup' };
      });
    },

    signIn: function (email, password) {
      if (!available) return Promise.reject(nobackend());
      return call('/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: headers(false),
        body: JSON.stringify({ email: email, password: password })
      }).then(function (body) {
        writeSession({ access_token: body.access_token, refresh_token: body.refresh_token, email: email });
        return { signedIn: true };
      });
    },

    signOut: function () { writeSession(null); },

    getReservation: function () {
      if (!available) return Promise.reject(nobackend());
      return call('/rest/v1/reservations?select=*&limit=1', {
        method: 'GET', headers: headers(true)
      }).then(function (rows) { return (rows && rows[0]) || null; });
    },

    /* One row per person, so saving twice edits the reservation rather than
       making a second one. user_id is deliberately not sent — a trigger fills
       it from the verified token. */
    saveReservation: function (data) {
      if (!available) return Promise.reject(nobackend());
      var h = headers(true);
      h['Prefer'] = 'resolution=merge-duplicates,return=representation';
      return call('/rest/v1/reservations?on_conflict=user_id', {
        method: 'POST', headers: h, body: JSON.stringify([data])
      }).then(function (rows) { return (rows && rows[0]) || null; });
    },

    cancelReservation: function () {
      if (!available) return Promise.reject(nobackend());
      var s = readSession();
      if (!s) return Promise.reject(nobackend());
      return call('/rest/v1/reservations?user_id=eq.' + encodeURIComponent(userId(s)), {
        method: 'DELETE', headers: headers(true)
      });
    }
  };

  function nobackend() {
    var e = new Error('no-backend');
    e.key = 'auth.err.nobackend';
    return e;
  }

  /* The user id is inside the access token. Reading it here avoids a round trip
     just to delete a row we already know belongs to this session. RLS is still
     what enforces it — this only shapes the request. */
  function userId(s) {
    try {
      var payload = JSON.parse(atob(s.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.sub || '';
    } catch (e) { return ''; }
  }

  return api;
})();


/* The route guard.
   A gated page carries `data-gated` on <html> and keeps its member content
   inside [data-member], hidden in the markup itself. Nothing member-shaped is
   in the DOM unhidden before this runs, so a signed-out visitor never sees a
   flash of somebody's page on the way to the sign-in screen. */
(function () {
  'use strict';
  if (!document.documentElement.hasAttribute('data-gated')) return;

  if (!window.CUP_BACKEND.signedIn()) {
    location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() || 'reserve.html'));
    return;
  }
  document.documentElement.setAttribute('data-signed-in', 'true');
})();

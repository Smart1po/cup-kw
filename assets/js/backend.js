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
    /* meta is the rest of the sign-up form — name, phone, area. It goes into
       the user's own metadata on the account, which is where a detail about
       the person belongs when there is no profiles table to put it in.

       This expects "Confirm email" to be OFF in the Supabase auth settings, so
       signing up returns a session and the person is simply in. If it is on,
       no token comes back and there is nothing to be done from here except say
       so honestly, which is what the second branch does. */
    signUp: function (email, password, meta) {
      if (!available) return Promise.reject(nobackend());
      return call('/auth/v1/signup', {
        method: 'POST',
        headers: headers(false),
        body: JSON.stringify({ email: email, password: password, data: meta || {} })
      }).then(function (body) {
        if (body && body.access_token) {
          writeSession({
            access_token: body.access_token, refresh_token: body.refresh_token,
            email: email, display_name: (meta && meta.full_name) || ''
          });
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
        var meta = (body && body.user && body.user.user_metadata) || {};
        writeSession({
          access_token: body.access_token, refresh_token: body.refresh_token,
          email: email, display_name: meta.full_name || ''
        });
        return { signedIn: true };
      });
    },

    signOut: function () { writeSession(null); },

    /* ---- signing in through somebody else ------------------------------

       Supabase does the whole dance; we only send the person to it and read
       the token out of the fragment we are sent back with. Both providers have
       to be switched on in the Supabase dashboard with a real client id — until
       they are, this lands back here with an error in the URL and the page says
       so rather than hanging. */
    oauthUrl: function (provider, nextPage) {
      var back = location.origin + location.pathname.replace(/[^/]*$/, 'login.html') +
                 (nextPage ? '?next=' + encodeURIComponent(nextPage) : '');
      return URL_BASE + '/auth/v1/authorize?provider=' + encodeURIComponent(provider) +
             '&redirect_to=' + encodeURIComponent(back);
    },

    /* Returns 'ok' if a session was picked up out of the URL, an error key if
       the provider handed one back, and null if this is an ordinary visit. */
    captureRedirect: function () {
      var hash = String(location.hash || '').replace(/^#/, '');
      var q = new URLSearchParams(hash);
      var token = q.get('access_token');
      if (token) {
        writeSession({ access_token: token, refresh_token: q.get('refresh_token') || '', email: '' });
        history.replaceState(null, '', location.pathname + location.search);
        return 'ok';
      }
      var err = q.get('error') || new URLSearchParams(location.search).get('error');
      if (err) {
        history.replaceState(null, '', location.pathname);
        return 'auth.err.provider';
      }
      return null;
    },

    /* ---- the person, and what they have ordered ------------------------

       Name, phone, area, saved addresses and orders all live in the user's
       metadata on their own account. That is a deliberate trade and it should
       be understood before it is relied on: it needs no table and no migration,
       which is why it works today against a project this repository cannot
       reach — but metadata is writable by the person it belongs to, so an order
       status kept here is a note to the customer, not a record they cannot
       touch. The moment staff need to move an order through its stages, orders
       belong in their own table with a policy that only staff can update.
       SUPABASE.md carries the SQL for that. */
    getUser: function () {
      if (!available) return Promise.reject(nobackend());
      return call('/auth/v1/user', { method: 'GET', headers: headers(true) })
        .then(function (u) {
          var s = readSession() || {};
          var meta = (u && u.user_metadata) || {};
          /* Keep the cheap things on the session so a header can greet somebody
             without a round trip on every page. */
          s.email = (u && u.email) || s.email;
          s.display_name = meta.full_name || s.display_name || '';
          writeSession(s);
          return { email: (u && u.email) || '', meta: meta };
        });
    },

    saveUser: function (meta) {
      if (!available) return Promise.reject(nobackend());
      return call('/auth/v1/user', {
        method: 'PUT', headers: headers(true), body: JSON.stringify({ data: meta })
      }).then(function (u) {
        var s = readSession() || {};
        s.display_name = (meta && meta.full_name) || s.display_name || '';
        writeSession(s);
        return (u && u.user_metadata) || meta;
      });
    },

    /* Three is the cap, and it is enforced here as well as in the form. A
       limit that only exists in the page it is typed into is not a limit. */
    MAX_ADDRESSES: 3,

    saveAddresses: function (list) {
      var trimmed = (list || []).slice(0, api.MAX_ADDRESSES);
      return api.getUser().then(function (u) {
        var meta = u.meta || {};
        meta.addresses = trimmed;
        return api.saveUser(meta);
      }).then(function () { return trimmed; });
    },

    /* Newest first, and stamped here rather than in the page so every order
       carries the same shape however it was placed. */
    placeOrder: function (order) {
      return api.getUser().then(function (u) {
        var meta = u.meta || {};
        var list = Array.isArray(meta.orders) ? meta.orders : [];
        var row = {
          id: 'C' + String(Date.now()).slice(-8),
          placed_at: new Date().toISOString(),
          status: 'placed',
          items: order.items || [],
          total: order.total == null ? null : order.total,
          gift: !!order.gift,
          address: order.address || null,
          recipient: order.recipient || null,
          message: order.message || ''
        };
        meta.orders = [row].concat(list);
        return api.saveUser(meta).then(function () { return row; });
      });
    }
  };

  function nobackend() {
    var e = new Error('no-backend');
    e.key = 'auth.err.nobackend';
    return e;
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
    location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() || 'account.html'));
    return;
  }
  document.documentElement.setAttribute('data-signed-in', 'true');
})();

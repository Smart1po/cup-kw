/* Day, night, and the visitor's own accent.

   Two independent choices, and the accent is stored separately per scheme,
   because a colour that sings on cream is often illegible on charcoal. Storing
   one accent for both would guarantee that half the visitor's choices look
   broken in the other mode.

   Every accent offered here has been checked against the button text it will
   carry: dark accents in day mode (white text on them), light accents at night
   (near-black text on them). The picker cannot be used to make the site
   unreadable, which is the difference between a colour choice and a trap. */

window.CUP_THEME = (function () {
  'use strict';

  var root = document.documentElement;

  /* Day accents are dark enough to carry white button text, on the off-white
     ground. The Sadu maroon lives here and only here: against the day ground it
     is 7.57:1, against the night navy it is 1.73:1 and disappears. */
  var DAY = [
    { id: 'maroon',    hex: '#8C1D24' },
    { id: 'navy',      hex: '#16233D' },
    { id: 'olive',     hex: '#4B5636' },
    { id: 'terracotta',hex: '#93492A' },
    { id: 'teal',      hex: '#1F5560' },
    { id: 'ink',       hex: '#38322B' }
  ];

  /* Night accents carry navy button text on the navy ground. Every one is
     measured against #16233D: camel 6.99, brass 5.06, off-white 13.07,
     sage 7.35, slate 6.44, mustard 6.63. */
  var NIGHT = [
    { id: 'camel',     hex: '#C9A87C' },
    { id: 'brass',     hex: '#B08D57' },
    { id: 'offwhite',  hex: '#F2EAD8' },
    { id: 'sage',      hex: '#A9B69C' },
    { id: 'slate',     hex: '#90A9C2' },
    { id: 'mustard',   hex: '#D5A02E' }
  ];

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }

  function osLight() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  }

  function scheme() {
    var s = get('cup.scheme');
    return (s === 'light' || s === 'dark') ? s : 'auto';
  }

  function effective() {
    var s = scheme();
    return s === 'auto' ? (osLight() ? 'light' : 'dark') : s;
  }

  function accents() { return effective() === 'light' ? DAY : NIGHT; }

  function currentAccent() {
    var key = 'cup.accent.' + effective();
    var want = get(key);
    var list = accents();
    var found = list.filter(function (a) { return a.id === want; })[0];
    return found || list[0];
  }

  function apply() {
    var s = scheme();
    if (s === 'auto') root.removeAttribute('data-scheme');
    else root.setAttribute('data-scheme', s);
    root.style.setProperty('--accent', currentAccent().hex);
    paintPickers();
    document.dispatchEvent(new CustomEvent('cup:theme'));
  }

  function setScheme(s) { set('cup.scheme', s === 'auto' ? null : s); apply(); }
  function setAccent(id) { set('cup.accent.' + effective(), id); apply(); }

  function cycleScheme() {
    var order = ['auto', 'light', 'dark'];
    setScheme(order[(order.indexOf(scheme()) + 1) % order.length]);
  }

  /* Any element with data-picker gets the swatch row for the CURRENT scheme,
     rebuilt whenever the scheme changes — so switching to day shows the day
     colours, not six night colours that would all fail on cream. */
  function paintPickers() {
    var here = currentAccent().id;
    document.querySelectorAll('[data-picker]').forEach(function (host) {
      host.innerHTML = '';
      var row = document.createElement('div');
      row.className = 'picker__row';
      accents().forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'picker__dot';
        b.style.setProperty('--c', a.hex);
        b.setAttribute('aria-pressed', String(a.id === here));
        b.setAttribute('aria-label', a.id);
        b.addEventListener('click', function () { setAccent(a.id); });
        row.appendChild(b);
      });
      host.appendChild(row);
    });

    document.querySelectorAll('[data-scheme-btn]').forEach(function (b) {
      var s = scheme();
      b.setAttribute('data-state', s);
      var label = window.cupT ? window.cupT('switch.scheme.' + s) : s;
      b.setAttribute('aria-label', label);
      b.title = label;
      var t = b.querySelector('.schemetext');
      if (t) t.textContent = label;
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-scheme-btn]')) cycleScheme();
  });

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var onChange = function () { apply(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  document.addEventListener('cup:lang', paintPickers);

  /* The scheme is applied as early as this file runs — before cup:ready — so
     the page never paints in the wrong theme and then correct itself. */
  var s0 = scheme();
  if (s0 !== 'auto') root.setAttribute('data-scheme', s0);
  root.style.setProperty('--accent', currentAccent().hex);

  if (window.cupT) apply();
  else document.addEventListener('cup:ready', apply, { once: true });

  return { apply: apply, setScheme: setScheme, setAccent: setAccent, scheme: scheme, effective: effective };
})();

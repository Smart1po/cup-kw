/* The menu, and the dock.

   Two views of one list. The dock is a bar pinned to the bottom of every page
   carrying the same destinations, so the common case — go somewhere — is one
   tap and never requires opening anything. The menu behind the burger is still
   there for the full-size version and for the accent picker, which is a row of
   swatches and wants the room.

   Both are built from the one LINKS array below, and both live here rather than
   being copied into five HTML files, because hand-copied navigation is five
   places for one to drift out of step.

   The last entry is not a destination but a state: signed out it is the way in,
   signed in it is the way out. It is decided at build time from the session and
   rebuilt whenever that changes, so the bar never offers to sign in somebody
   who already is. */

(function () {
  'use strict';

  var LINKS = [
    { href: 'index.html',   key: 'nav.home' },
    { href: 'menu.html',    key: 'nav.menu.page' },
    { href: 'engrave.html', key: 'nav.engrave' },
    { href: 'account.html', key: 'nav.account' }
  ];

  var menu, burger, open = false, lastFocus = null;

  function signedIn() {
    return !!(window.CUP_BACKEND && window.CUP_BACKEND.signedIn());
  }

  function t(k) { return window.cupT ? window.cupT(k) : k; }

  /* Signing out is not navigation, so it is a button and not a link. It clears
     the session and goes home rather than staying on a page that may have just
     become somebody else's. */
  function signOut() {
    if (window.CUP_BACKEND) window.CUP_BACKEND.signOut();
    location.href = 'index.html';
  }

  function build() {
    burger = document.querySelector('[data-burger]');
    if (!burger || document.querySelector('.menu')) return;

    menu = document.createElement('nav');
    menu.className = 'menu';
    menu.id = 'mainmenu';
    menu.setAttribute('aria-label', 'Main');
    menu.hidden = true;

    /* A way out that is not a way somewhere else. Escape has always closed
       this, but Escape is not discoverable and is not on a phone at all. */
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'menu__x';
    x.setAttribute('data-menu-close', '');
    x.innerHTML = '<span aria-hidden="true">✕</span>';
    x.addEventListener('click', close);
    menu.appendChild(x);

    var ul = document.createElement('ul');
    ul.className = 'menu__list';
    LINKS.forEach(function (l, i) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'menu__link';
      a.href = l.href;
      a.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
                    '<span data-t="' + l.key + '"></span>';
      li.appendChild(a);
      ul.appendChild(li);
    });

    var li = document.createElement('li');
    if (signedIn()) {
      var out = document.createElement('button');
      out.type = 'button';
      out.className = 'menu__link menu__link--btn';
      out.innerHTML = '<span class="n">' + String(LINKS.length + 1).padStart(2, '0') + '</span>' +
                      '<span data-t="auth.signout"></span>';
      out.addEventListener('click', signOut);
      li.appendChild(out);
    } else {
      var a2 = document.createElement('a');
      a2.className = 'menu__link';
      a2.href = 'login.html';
      a2.innerHTML = '<span class="n">' + String(LINKS.length + 1).padStart(2, '0') + '</span>' +
                     '<span data-t="nav.login"></span>';
      li.appendChild(a2);
    }
    ul.appendChild(li);
    menu.appendChild(ul);

    var foot = document.createElement('div');
    foot.className = 'menu__foot';
    foot.innerHTML =
      '<div class="picker">' +
        '<p class="micro" data-t="menu.theme"></p>' +
        '<div class="picker__row">' +
          '<button type="button" class="btn btn--ghost" data-scheme-btn>' +
            '<span class="schemetext"></span></button>' +
          '<button type="button" class="btn btn--ghost" data-lang-btn></button>' +
        '</div>' +
      '</div>' +
      '<div class="picker">' +
        '<p class="micro" data-t="menu.accent"></p>' +
        '<div data-picker></div>' +
      '</div>';
    menu.appendChild(foot);

    document.body.appendChild(menu);

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'mainmenu');
    burger.addEventListener('click', toggle);

    /* Escape closes it, and focus goes back to the control that opened it —
       otherwise a keyboard user is dropped at the top of the document. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) close();
      if (e.key === 'Tab' && open) trap(e);
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('.menu__link') && !e.target.closest('[data-menu-close]')) close();
    });
  }

  /* Which page we are looking at. On file:// and on a server the last path
     segment is the filename; an empty segment is the index. */
  function here() {
    var seg = location.pathname.split('/').pop();
    return seg === '' ? 'index.html' : seg;
  }

  function buildDock() {
    if (document.querySelector('.dock')) return;

    var dock = document.createElement('nav');
    dock.className = 'dock';
    dock.setAttribute('aria-label', 'Primary');

    var bar = document.createElement('div');
    bar.className = 'dock__bar';

    var ul = document.createElement('ul');
    ul.className = 'dock__list';
    var at = here();
    LINKS.forEach(function (l) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'dock__link';
      a.href = l.href;
      a.setAttribute('data-t', l.key);
      /* aria-current is what tells a screen reader which one is the page you
         are on; the highlight is only the sighted half of the same fact. */
      if (l.href === at) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      ul.appendChild(li);
    });

    var li = document.createElement('li');
    if (signedIn()) {
      var out = document.createElement('button');
      out.type = 'button';
      out.className = 'dock__link dock__link--btn';
      out.setAttribute('data-t', 'auth.signout');
      out.addEventListener('click', signOut);
      li.appendChild(out);
    } else {
      var a2 = document.createElement('a');
      a2.className = 'dock__link';
      a2.href = 'login.html';
      a2.setAttribute('data-t', 'nav.login');
      if (at === 'login.html') a2.setAttribute('aria-current', 'page');
      li.appendChild(a2);
    }
    ul.appendChild(li);
    bar.appendChild(ul);

    /* The same two controls as the menu. Every file that labels them queries
       with querySelectorAll and delegates its clicks, so a second copy needs no
       JavaScript anywhere else. */
    var tools = document.createElement('div');
    tools.className = 'dock__tools';
    tools.innerHTML =
      '<span class="dock__sep" aria-hidden="true"></span>' +
      '<button type="button" class="dock__tool" data-scheme-btn>' +
        '<span class="schemetext"></span></button>' +
      '<button type="button" class="dock__tool" data-lang-btn></button>';
    bar.appendChild(tools);

    dock.appendChild(bar);

    /* After the header, so tabbing reaches the navigation early rather than
       after the whole document. */
    var top = document.querySelector('header.top');
    if (top && top.parentNode) top.parentNode.insertBefore(dock, top.nextSibling);
    else document.body.appendChild(dock);
  }

  function focusables() {
    return [].slice.call(menu.querySelectorAll('a[href], button:not([disabled])'))
      .filter(function (n) { return n.offsetParent !== null; });
  }

  /* While the menu is the whole screen, tab must not walk into the page behind
     it. Nothing there is visible, and landing on an invisible control is the
     classic way an overlay becomes unusable without a mouse. */
  function trap(e) {
    var list = focusables();
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function toggle() { open ? close() : show(); }

  function show() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    /* One frame, so the clip-path has a value to animate away from. */
    requestAnimationFrame(function () {
      menu.classList.add('is-open');
      open = true;
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var f = focusables()[0];
      if (f) f.focus();
    });
  }

  function close() {
    menu.classList.remove('is-open');
    open = false;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function () { if (!open) menu.hidden = true; }, 700);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* Both the menu and the dock insert controls after everything that labels
     controls has already run once, so the labelling is re-run here — once,
     after both exist. Without it the menu opens with blank buttons in it and
     the dock renders empty links. */
  function boot() {
    build();
    buildDock();
    if (window.cupApplyLang) window.cupApplyLang();
    if (window.CUP_THEME) window.CUP_THEME.apply();
  }

  if (window.cupT) boot();
  else document.addEventListener('cup:ready', boot, { once: true });
})();

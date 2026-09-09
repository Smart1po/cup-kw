/* The menu, and the dock.

   Two views of one list. The dock is a bar pinned to the bottom of every page
   carrying the same four destinations, so the common case — go somewhere — is
   one tap and never requires opening anything. The menu behind the burger is
   still there for the full-size version and for the accent picker, which is a
   row of swatches and wants the room.

   On a phone the dock carries the destinations only and the display controls
   stay in the menu: seven targets do not fit across 390px without becoming too
   small to hit. On anything wider both sit in the dock.

   Both are built from the one LINKS array below, and both live here rather than
   being copied into four HTML files, because hand-copied navigation is four
   places for one to drift out of step. */

(function () {
  'use strict';

  var LINKS = [
    { href: 'index.html',   key: 'nav.home' },
    { href: 'menu.html',    key: 'nav.menu.page' },
    { href: 'engrave.html', key: 'nav.engrave' },
    { href: 'reserve.html', key: 'nav.reserve' },
    { href: 'login.html',   key: 'nav.login' }
  ];

  var menu, burger, open = false, lastFocus = null;

  function build() {
    burger = document.querySelector('[data-burger]');
    if (!burger || document.querySelector('.menu')) return;

    menu = document.createElement('nav');
    menu.className = 'menu';
    menu.id = 'mainmenu';
    menu.setAttribute('aria-label', 'Main');
    menu.hidden = true;

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
          '<button type="button" class="btn btn--ghost" data-motion-btn aria-pressed="true"></button>' +
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
      if (e.target.closest('.menu__link')) close();
    });

  }

  /* Which of the four we are looking at. On file:// and on a server the last
     path segment is the filename; an empty segment is the index. */
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
    bar.appendChild(ul);

    /* The same three controls as the menu. Every file that labels them queries
       with querySelectorAll and delegates its clicks, so a second copy needs no
       JavaScript anywhere else. */
    var tools = document.createElement('div');
    tools.className = 'dock__tools';
    tools.innerHTML =
      '<span class="dock__sep" aria-hidden="true"></span>' +
      '<button type="button" class="dock__tool" data-scheme-btn>' +
        '<span class="schemetext"></span></button>' +
      '<button type="button" class="dock__tool" data-lang-btn></button>' +
      '<button type="button" class="dock__tool" data-motion-btn aria-pressed="true"></button>';
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
    if (lastFocus) lastFocus.focus();
  }

  /* Both the menu and the dock insert controls after everything that labels
     controls has already run once, so the labelling is re-run here — once,
     after both exist. Without it the menu opens with blank buttons in it and
     the dock renders four empty links. */
  function boot() {
    build();
    buildDock();
    if (window.cupApplyLang) window.cupApplyLang();
    if (window.cupApplyMotion) window.cupApplyMotion();
    if (window.CUP_THEME) window.CUP_THEME.apply();
  }

  if (window.cupT) boot();
  else document.addEventListener('cup:ready', boot, { once: true });
})();

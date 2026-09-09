/* The menu.

   Not a nav bar. Four destinations set at display size in a single column,
   with the language, motion, theme and accent controls underneath — the things
   that used to crowd the header now have room to be labelled properly.

   Built here rather than copied into four HTML files, because four hand-copied
   menus is four places for one to drift out of step. */

(function () {
  'use strict';

  var LINKS = [
    { href: 'index.html',   key: 'nav.home' },
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

    /* These three controls are created here, after everything that labels
       controls has already run once. Each has to be told to label the new
       button, or the menu opens with a blank one in it. */
    if (window.cupApplyLang) window.cupApplyLang();
    if (window.cupApplyMotion) window.cupApplyMotion();
    if (window.CUP_THEME) window.CUP_THEME.apply();
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

  if (window.cupT) build();
  else document.addEventListener('cup:ready', build, { once: true });
})();

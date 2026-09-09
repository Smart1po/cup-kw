/* The in-page assistant.

   This is a SCRIPTED helper, not a language model. It matches what somebody
   types against a keyword table in experience.js and returns a written answer.
   There is no model behind it and no network call — a real one would need an
   API key, and a key that ships in a static site's JavaScript is a key you have
   given away. The assistant says as much when it does not know something,
   rather than implying it is thinking.

   If the knowledge base is missing it does not mount at all. An assistant that
   opens and knows nothing is worse than no assistant. */

(function () {
  'use strict';

  function kb() { return (window.CUP_EXPERIENCE && window.CUP_EXPERIENCE.chat) || null; }

  /* Arabic arrives with several spellings of the same word: alef with and
     without hamza, ta marbuta versus ha, alef maqsura versus ya, and optional
     diacritics. Folding those together is the difference between a helper that
     answers and one that shrugs at correct Arabic. */
  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[ً-ٰٟ]/g, '')
      .replace(/[أإآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function lang() { return window.cupLang ? window.cupLang() : 'en'; }

  function bestMatch(query) {
    var data = kb();
    if (!data || !data.entries) return null;
    var q = norm(query);
    if (!q) return null;
    var words = q.split(' ').filter(function (w) { return w.length > 1; });

    var best = null, bestScore = 0;
    data.entries.forEach(function (entry) {
      var keys = (entry.keywordsEn || []).concat(entry.keywordsAr || []);
      var score = 0;
      keys.forEach(function (k) {
        var nk = norm(k);
        if (!nk) return;
        /* A whole phrase matching is worth much more than a stray word, or
           "cup" alone would win every question on the site. */
        if (q.indexOf(nk) > -1) score += nk.indexOf(' ') > -1 ? 6 : 3;
        else if (words.indexOf(nk) > -1) score += 2;
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    return bestScore >= 3 ? best : null;
  }

  function answerFor(entry) {
    var l = lang();
    if (!entry) {
      var f = (kb() && kb().fallback) || {};
      return f[l] || f.en || '';
    }
    return (l === 'ar' ? entry.answerAr : entry.answerEn) || entry.answerEn || '';
  }

  var panel, log, input, chips, opened = false;

  function mount() {
    if (!kb()) return;
    if (document.querySelector('.assist')) return;

    var wrap = document.createElement('div');
    wrap.className = 'assist';
    wrap.innerHTML =
      '<button type="button" class="assist__fab" aria-expanded="false">' +
        '<span class="assist__fabmark" aria-hidden="true"></span>' +
        '<span class="sr" data-t="chat.open">Ask for help</span>' +
      '</button>' +
      '<div class="assist__panel" hidden>' +
        '<div class="assist__head">' +
          '<strong data-t="chat.title">Ask cup.kw</strong>' +
          '<button type="button" class="assist__x" aria-label="Close">&times;</button>' +
        '</div>' +
        '<p class="assist__note" data-t="chat.note"></p>' +
        '<div class="assist__log" role="log" aria-live="polite"></div>' +
        '<div class="assist__chips"></div>' +
        '<form class="assist__form">' +
          '<input type="text" class="assist__input" autocomplete="off">' +
          '<button type="submit" class="assist__send" data-t="chat.send">Send</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);

    panel = wrap.querySelector('.assist__panel');
    log = wrap.querySelector('.assist__log');
    input = wrap.querySelector('.assist__input');
    chips = wrap.querySelector('.assist__chips');

    wrap.querySelector('.assist__fab').addEventListener('click', toggle);
    wrap.querySelector('.assist__x').addEventListener('click', close);
    wrap.querySelector('.assist__form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      ask(v);
      input.value = '';
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && opened) close();
    });

    renderChips();
    say('bot', (kb().greeting && (kb().greeting[lang()] || kb().greeting.en)) || '');
    retranslate(true);
  }

  /* `full` is only true at mount, when this panel has just been inserted and
     its data-t nodes have never been translated. Reacting to cup:lang must
     NOT ask for a full pass — that is what cup:lang was dispatched from. */
  function retranslate(full) {
    if (full && window.cupApplyLang) window.cupApplyLang();
    if (input) input.setAttribute('placeholder', window.cupT('chat.placeholder'));
    var els = document.querySelectorAll('.assist [data-t]');
    els.forEach(function (el) { el.textContent = window.cupT(el.getAttribute('data-t')); });
  }

  function toggle() { opened ? close() : open(); }

  function open() {
    opened = true;
    panel.hidden = false;
    document.querySelector('.assist__fab').setAttribute('aria-expanded', 'true');
    document.querySelector('.assist').classList.add('is-open');
    input.focus();
  }

  function close() {
    opened = false;
    panel.hidden = true;
    var fab = document.querySelector('.assist__fab');
    fab.setAttribute('aria-expanded', 'false');
    document.querySelector('.assist').classList.remove('is-open');
    fab.focus();
  }

  function say(who, text) {
    if (!text) return;
    var p = document.createElement('p');
    p.className = 'assist__msg assist__msg--' + who;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function renderChips(exclude) {
    var data = kb();
    if (!data) return;
    chips.innerHTML = '';
    var l = lang();
    data.entries
      .filter(function (e) { return e.id !== exclude; })
      .slice(0, 24)
      .sort(function () { return 0; })
      .slice(0, 4)
      .forEach(function (entry) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'assist__chip';
        b.textContent = (l === 'ar' ? entry.questionAr : entry.questionEn) || '';
        b.addEventListener('click', function () {
          ask(b.textContent, entry);
        });
        chips.appendChild(b);
      });
  }

  function ask(text, known) {
    say('me', text);
    var entry = known || bestMatch(text);
    /* A beat before the answer, so the reply does not appear in the same frame
       as the question and read as a canned form response. Not a fake "typing"
       animation — this thing is not typing. */
    setTimeout(function () {
      say('bot', answerFor(entry));
      renderChips(entry && entry.id);
    }, 220);
  }

  document.addEventListener('cup:lang', function () {
    if (!document.querySelector('.assist')) return;
    log.innerHTML = '';
    say('bot', (kb().greeting && (kb().greeting[lang()] || kb().greeting.en)) || '');
    renderChips();
    retranslate(false);
  });

  if (window.cupT) mount();
  else document.addEventListener('cup:ready', mount, { once: true });
})();

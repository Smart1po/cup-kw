/* The engraving preview.

   The cup and a default word are already in the markup, so this file only ever
   replaces text that is on screen. If it fails to load, the page is still a cup
   with a form under it rather than a blank panel. */

(function () {
  'use strict';

  var C = window.CUP_CONTENT || {};
  var limits = C.engraving || { maxLatin: 16, maxArabic: 12, available: true };

  var input = document.getElementById('engin');
  var out = document.querySelector('#engtext textPath');
  var counter = document.getElementById('count');
  var arwarn = document.getElementById('arwarn');
  var form = document.getElementById('engform');
  if (!input || !out || !form) return;

  function script() {
    var checked = form.querySelector('input[name="script"]:checked');
    return checked ? checked.value : 'latin';
  }

  function limit() {
    return script() === 'arabic' ? limits.maxArabic : limits.maxLatin;
  }

  function draw() {
    var isArabic = script() === 'arabic';
    var max = limit();
    var value = input.value;
    var left = max - Array.from(value).length;

    /* The preview shows what will actually be cut. Going over the limit is
       shown as over — not silently truncated — because a person who cannot see
       the overflow will assume it fits. */
    out.textContent = value || (isArabic ? 'اسمك' : 'your name');

    var textEl = document.getElementById('engtext');
    textEl.setAttribute('font-size', isArabic ? '18' : '16');
    textEl.style.fontFamily = isArabic
      ? 'var(--face-arabic)'
      : 'var(--face-latin)';
    /* Arabic is a connected script: the preview has to run right-to-left or the
       letters join in the wrong order and the person approves a wrong cup. */
    textEl.setAttribute('direction', isArabic ? 'rtl' : 'ltr');

    counter.textContent = String(left);
    counter.setAttribute('data-state', left < 0 ? 'over' : 'ok');

    if (arwarn) arwarn.hidden = !isArabic;

    var over = left < 0;
    var save = document.getElementById('savebtn');
    if (save) {
      save.setAttribute('aria-disabled', String(over));
      save.style.pointerEvents = over ? 'none' : '';
      save.style.opacity = over ? '.5' : '';
    }

    /* Carry the choice to the reservation page, so a person who typed a name
       here does not have to type it again after signing in. */
    try {
      localStorage.setItem('cup.draft', JSON.stringify({
        engraving: value,
        engraving_script: script(),
        colour: (form.querySelector('input[name="colour"]:checked') || {}).value || 'sand'
      }));
    } catch (e) {}
  }

  input.addEventListener('input', draw);
  form.addEventListener('change', draw);
  document.addEventListener('cup:lang', draw);

  if (limits.available === false) {
    var note = document.createElement('p');
    note.className = 'notice';
    note.textContent = window.cupT('eng.unavailable');
    form.prepend(note);
    input.disabled = true;
  }

  draw();
})();

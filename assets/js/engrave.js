/* The engraving preview, wired to the 3D model.

   The cup exists before this file runs, so a failure here leaves a turnable
   cup and a working form rather than a blank panel. */

(function () {
  'use strict';

  var C = window.CUP_CONTENT || {};
  var limits = C.engraving || { maxLatin: 16, maxArabic: 12, available: true };

  var input = document.getElementById('engin');
  var counter = document.getElementById('count');
  var arwarn = document.getElementById('arwarn');
  var form = document.getElementById('engform');
  if (!input || !form) return;

  function script() {
    var checked = form.querySelector('input[name="script"]:checked');
    return checked ? checked.value : 'latin';
  }

  function colour() {
    var checked = form.querySelector('input[name="colour"]:checked');
    return checked ? checked.value : 'navy';
  }

  function limit() {
    return script() === 'arabic' ? limits.maxArabic : limits.maxLatin;
  }

  function draw() {
    var isArabic = script() === 'arabic';
    var max = limit();
    var value = input.value;
    /* Array.from, not .length — an emoji or a combined Arabic letter is one
       character to the person typing and to the engraver, whatever UTF-16 says. */
    var left = max - Array.from(value).length;
    var over = left < 0;

    if (window.cupModel) {
      window.cupModel.setEngraving(value || (isArabic ? 'اسمك' : 'your name'),
                                   isArabic ? 'arabic' : 'latin');
      /* The cup is pleased to have a name on it, and goes back to neutral when
         the field is empty. Over the limit it stays neutral rather than pulling
         a face — the counter is already saying the useful thing, and a sulking
         cup on top of it would be the interface piling on. */
      window.cupModel.setExpression(value && !over ? 'proud' : 'idle');
    }

    counter.textContent = String(left);
    counter.setAttribute('data-state', over ? 'over' : 'ok');

    if (arwarn) arwarn.hidden = !isArabic;

    var save = document.getElementById('savebtn');
    if (save) {
      save.setAttribute('aria-disabled', String(over));
      save.style.pointerEvents = over ? 'none' : '';
    }

    /* Carried to the reservation page, so nobody types their own name twice. */
    try {
      localStorage.setItem('cup.draft', JSON.stringify({
        engraving: value,
        engraving_script: script(),
        colour: colour()
      }));
    } catch (e) {}
  }

  input.addEventListener('input', draw);
  form.addEventListener('change', draw);
  document.addEventListener('cup:lang', draw);

  /* Anything chosen on a previous visit comes back. */
  try {
    var d = JSON.parse(localStorage.getItem('cup.draft') || 'null');
    if (d) {
      input.value = d.engraving || '';
      var s = form.querySelector('input[name="script"][value="' + d.engraving_script + '"]');
      if (s) s.checked = true;
      var c = form.querySelector('input[name="colour"][value="' + d.colour + '"]');
      if (c) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  } catch (e) {}

  if (limits.available === false) {
    var note = document.createElement('p');
    note.className = 'notice';
    note.textContent = window.cupT('eng.unavailable');
    form.prepend(note);
    input.disabled = true;
  }

  draw();
})();

/* ONE CUP, ON ITS OWN PAGE.

   Reached from a card on the cups page as ?id=line/item. Everything it says is
   read out of the catalogue against that id — capacity and dimensions off the
   body, the material off content.js, the price off the line. Nothing is
   written into the URL except which cup it is, so a link that gets shared
   cannot carry a price that has since changed.

   An id the catalogue does not know is not an error page. It is the honest
   sentence that we do not make that cup, with the way back underneath it. */

(function () {
  'use strict';

  var host = document.querySelector('[data-product]');
  if (!host) return;

  function t(k) { return window.cupT ? window.cupT(k) : k; }
  function lang() { return window.cupLang ? window.cupLang() : 'en'; }
  function pick(o) { return (lang() === 'ar' ? o.ar : o.en) || o.en || ''; }
  function money(n) { return n.toFixed(3) + ' ' + t('menu.kwd'); }

  function find(id) {
    var cat = window.CUP_CATALOGUE;
    if (!cat || !id) return null;
    var p = String(id).split('/');
    var line = cat.lines.filter(function (l) { return l.slug === p[0]; })[0];
    if (!line) return null;
    var item = line.items.filter(function (i) { return i.slug === p[1]; })[0];
    if (!item) return null;
    return { id: id, line: line, item: item, body: cat.bodies[line.body] || {} };
  }

  function render() {
    var id = new URLSearchParams(location.search).get('id');
    var found = find(id);

    if (!found) {
      host.innerHTML = '<div class="stack" data-rise>' +
        '<p class="pending">' + t('prod.gone') + '</p>' +
        '<a class="btn btn--ghost" href="menu.html">' + t('prod.back') + '</a></div>';
      return;
    }

    var line = found.line, item = found.item, body = found.body;
    var dims = body.handle
      ? body.heightCm + ' × ' + body.topDiameterCm + ' cm'
      : body.heightCm + ' × ' + body.diameterCm + ' cm';

    var material = (window.CUP_CONTENT && window.CUP_CONTENT.product &&
                    window.CUP_CONTENT.product.material) || null;

    /* Every row is a fact off a sheet. A line with no price says so rather
       than rendering a currency with a gap in front of it. */
    var rows = [
      [t('prod.capacity'), body.capacityMl + ' ml'],
      [t('k.height'), dims]
    ];
    if (material) rows.push([t('prod.material'), pick(material)]);

    var price = line.priceKwd == null
      ? '<p class="card__price card__price--unset">' + t('menu.price.unset') + '</p>'
      : '<p class="display display--2">' + money(line.priceKwd) + '</p>';

    var chips = line.features.map(function (f) {
      return '<li class="chip">' + t('feat.' + f) + '</li>';
    }).join('');

    host.innerHTML =
      '<div class="split">' +
        '<div>' +
          '<div data-cup3d data-height="420" data-colour="' + item.hex + '"' +
            (line.band ? ' data-band="1"' : '') +
            ' aria-label="' + pick(item) + '"></div>' +
          '<p class="micro cuphint" data-t="home.cup.hint"></p>' +
        '</div>' +
        '<div class="stack" data-rise style="gap:1.1rem;width:100%">' +
          '<p class="micro"><a href="menu.html">' + pick(line) + '</a></p>' +
          '<h1 class="display display--2">' + pick(item) + '</h1>' +
          price +
          '<ul class="facts facts--tight">' +
            rows.map(function (r) {
              return '<li><span class="k">' + r[0] + '</span><span class="v">' + r[1] + '</span></li>';
            }).join('') +
          '</ul>' +
          '<ul class="chips">' + chips + '</ul>' +
          (line.concept ? '<p class="pending">' + t('menu.concept.note') + '</p>' : '') +
          '<div class="prodbtns">' +
            '<button type="button" class="btn" data-prod-add></button>' +
            '<a class="btn btn--ghost" href="engrave.html?colour=' +
              encodeURIComponent(item.slug) + '&line=' + encodeURIComponent(line.slug) + '">' +
              t('prod.engrave') + '</a>' +
          '</div>' +
          '<p class="micro"><a href="menu.html">' + t('prod.back') + '</a></p>' +
        '</div>' +
      '</div>';

    /* The tab says which cup, not which catalogue. A page whose title is the
       same as five hundred others is useless in a row of open tabs. */
    document.title = pick(item) + ' · ' + pick(line) + ' — cup.kw';

    paintAdd(found.id);
    document.querySelector('[data-prod-add]').addEventListener('click', function () {
      window.CUP_CART.toggle(found.id);
      paintAdd(found.id);
    });

    /* The 3D cup is mounted by app.js on boot, which has already run by now. */
    if (window.cupMountCups) window.cupMountCups();
    if (window.cupApplyLang) window.cupApplyLang();
  }

  function paintAdd(id) {
    var b = document.querySelector('[data-prod-add]');
    if (!b) return;
    var on = window.CUP_CART.has(id);
    b.textContent = t(on ? 'shop.picked' : 'shop.add');
    b.setAttribute('aria-pressed', String(on));
  }

  if (window.cupT) render();
  else document.addEventListener('cup:ready', render, { once: true });
  document.addEventListener('cup:lang', render);
})();

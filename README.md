# cup.kw

The website for **cup.kw** — an insulated stainless steel travel cup, made and sold in Kuwait.

One cup, one link.

---

## What this is

A six-screen bilingual website. No framework, no build step, no bundler. Open `index.html`
from disk and it works; put it on a host and it works the same way.

| Screen | Address | What it does |
|---|---|---|
| Home | `/` | The promise, in five seconds. Engraving is the promise. |
| The cup | `/product` | Capacity in real terms, the colours, grip, and what it is *not* good for. |
| Proof | `/proof` | The Kuwait Heat Test log and the cup-holder fit list. |
| Engraving | `/engrave` | Type your name in Arabic or English and watch it appear on the cup. |
| Sign in | `/login` | Email and password. Real accounts, real sessions. |
| Your cup | `/reserve` | Gated. Your reservation and your saved engraving. |

`/reserve` is gated: opening it signed out sends you to `/login` before any of it paints.

---

## The one file you edit

Everything factual about the product lives in **`assets/js/content.js`**. Price, capacity,
colours, heat-test readings, which cars the cup fits, delivery times, warranty, and the
contact handles.

Every value in it ships **unset**, and the site is written to be honest about that. An unset
price does not render an empty box or a dangling `KWD` — the page says the price is not
published yet, and the pre-order still works. Fill a value in and the page changes what it
claims about itself.

**Nothing on this site invents a fact about the product.** No test readings, no car
compatibility, no delivery promise and no warranty term appears until you put a real one in
that file. That is deliberate: a fabricated number on a real product is the kind of mistake
that costs a customer.

---

## Two languages, not one language translated

English and Arabic, with a switch in the header and true right-to-left layout for Arabic —
not a mirrored stylesheet bolted on, but logical CSS properties throughout, so the layout
mirrors because it was built to.

The Arabic was written natively in a Kuwaiti register. It is not a translation of the
English, and in several places it says something different in order to mean the same thing.

---

## No image files

There isn't a single `.png` or `.jpg` in this repository, and there is no web font. The cup,
the engraving preview, the icons and the marks are inline SVG and CSS. Nothing is fetched at
runtime except the calls to our own Supabase project.

---

## Contributing

The repository is public so people can suggest changes.

- **Small text fix?** Edit the file on GitHub and open a pull request.
- **Changing a product fact?** It almost certainly belongs in `assets/js/content.js`, not in
  the HTML.
- **Adding a claim about the real world?** It needs a source. See the honesty rules above.

Run it locally with nothing installed:

```
git clone https://github.com/Smart1po/cup-kw.git
cd cup-kw
```

Then open `index.html` in a browser. That is the whole setup. For the routes to look like
`/product` rather than `/product.html`, serve it instead:

```
npx serve .
```

---

## Back end

Supabase, for accounts and pre-orders. See `SUPABASE.md`.

The publishable key is committed on purpose — it ships in the JavaScript of every Supabase
site on the web and is not a secret. What protects the data is Row Level Security, which is
switched on. The `service_role` key is not in this repository and must never be.

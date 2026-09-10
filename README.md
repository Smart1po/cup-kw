# cup.kw

The website for **cup.kw** — an insulated stainless steel travel cup, made and sold in Kuwait.

One cup, one link.

---

## What this is

A bilingual website with no framework, no build step and no bundler. Open `index.html`
from disk and it works; put it on a host and it works the same way.

| Screen | Address | What it does |
|---|---|---|
| Home | `/` | The promise in five seconds, the Kuwait Collection, the proof sections, and where the product stops. |
| The cups | `/menu` | The whole catalogue, filtered by kind, capacity and features. |
| One cup | `/product?id=sadu/navy` | Its capacity, what it is made of, and the way through to the engraving screen with that colour already on. |
| Engraving | `/engrave` | Type your name in Arabic or English and watch it land on the cup. |
| Log in | `/login` | An email and a password. Nothing else is on it. |
| Create account | `/signup` | Name, email, phone and area — or Google or Apple. |
| Checkout | `/checkout` | Gated. An address you keep, or a gift straight to somebody else. |
| My account | `/account` | Gated. Your details, and every order with its status and when it was placed. |

The two gated pages send you to `/login` before any of them paints, and back again once you
are in — nothing member-shaped is ever in the DOM unhidden for a signed-out visitor.

The cart lives in `localStorage` and needs no server, so the catalogue, the cup and the
engraving screen are fully usable with no back end at all. Only the last two screens need
one. See `SUPABASE.md` — including the three dashboard settings that have to be switched on
before sign-up and the Google and Apple buttons do anything.

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

The menu's four collection buttons live in **`assets/js/catalogue.js`** under `collections`.
`All cups` and `Limited edition` are honest — the second is derived from the `limited` feature
the Sadu line already carries, so nothing was tagged to make it work. `New arrivals` and
`Best sellers` are hand-picked for the pitch and carry `placeholder: true`, which puts a line
on the page saying so whenever one of them is the active filter. Replace the ids with real
ones and drop the flag; the line goes away by itself.

---

## Two languages, not one language translated

English and Arabic, with a switch in the header and true right-to-left layout for Arabic —
not a mirrored stylesheet bolted on, but logical CSS properties throughout, so the layout
mirrors because it was built to.

The Arabic was written natively in a Kuwaiti register. It is not a translation of the
English, and in several places it says something different in order to mean the same thing.

---

## The Kuwait Collection

Fourteen colours taken from Sadu rather than from a paint chart, listed in `content.js`.
Choosing one repaints the 3D cup on the page, and carries through to the engraving preview
and the reservation form. Delete a colour there and it disappears from all three at once.

The `slug` on each colour is what gets stored against an order, so it must not be changed
once a reservation exists against it. Change the English and Arabic labels instead.

---

## The cup is real 3D, and it is not a library

Drag the cup on the home page and it turns, because it is actual geometry: the body, the
woven band, the lid and the straw are each a ring of thin panels, every one rotated to its
own angle and pushed out to the radius. Panels facing away are dropped, so the far side of
the cup never shows through the near side.

The lighting is a flat layer in front of the whole thing rather than shading painted onto
the panels. That sounds like a cheat and is actually the correct physics: a cylinder turning
about its own axis has a silhouette that never changes, so the light should stay still while
the printing rotates past it. It also costs nothing per frame — an earlier version put a
blend mode there and locked the renderer up completely.

Proportions come from `product.heightCm` and `product.diameterCm`. Correct the spec and the
model changes shape.

The cup does not mirror in Arabic. A lid is on the same side of a physical object in every
language, so the model is pinned left-to-right while the page around it flips.

---

## Photographs, and everything else drawn

The photographs are in `assets/img/`. They earn their place: a photograph of the cup actually
standing in a car cup holder is worth more than any cup holder that can be drawn in CSS.

Five of them carry a different colourway with a different name cut into it — AHMAD in a
majlis, MAJED on a balcony in Dubai, WAHAJ poolside, ASMAA at pilates. That is the whole
positioning demonstrated without a word of copy. Four of the five are the slideshow on the
home page; their alt text and their captions are in `assets/js/experience.js` under
`quests`.

Everything else is still drawn — the 3D cup, the engraving preview, the icons, the marks, the
stage props for the scenes that have no photograph. There is no web font, and nothing is
fetched at runtime except the images, which are served from this repository, and the calls to
our own Supabase project.

Images are lazy-loaded below the fold and carry real alt text in both languages.

---

## Contributing

The repository is public so people can suggest changes.

**Read `DECISIONS.md` first.** It records why the site is the way it is — the positioning,
why so much of it is deliberately empty, and the two things about the 3D cup that will break
if you undo them.

- **Small text fix?** Edit the file on GitHub and open a pull request.
- **Changing a product fact?** It almost certainly belongs in `assets/js/content.js`, not in
  the HTML.
- **Adding a claim about the real world?** It needs a source. See the honesty rules above.
- **Editing an Arabic string?** It was written natively, not translated. Do not correct it
  toward Modern Standard Arabic.

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

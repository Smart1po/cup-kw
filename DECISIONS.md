# Decisions, and why

This file exists so that somebody editing this repository — including us in three months —
does not undo a choice without knowing what it cost to make.

`README.md` says what the site *is*. This says why it is that and not something else.

Written 9 September 2026.

---

## The positioning: "Yours, not everyone's"

Three positions were on the table. Engraving won, and the whole site now reads from it.

The competitor sells in Kuwait at roughly 8.5–13 KWD through marketplace-style channels and
is already winning on colour variety and influencer reach. **Beating that on "more colours"
is a losing game.** An engraving is the one thing about a cup that cannot be bought twice,
and it is the one thing a marketplace listing structurally cannot offer.

That is also why the home page leads with *"A colour is not yours. A name is."* rather than
with the collection. The fourteen colours are the second beat, not the first.

**Do not name the competitor anywhere on the site.** The anti-competitor lines are all in
positive form and unnamed: *no leaks in the tote, no sticker to peel off in August.*

---

## Why so much of this site is deliberately empty

The Heat Test has no readings. The cup-holder list has no cars. There is no price, no
capacity, no delivery time, no warranty, no reviews and no customer count.

**None of that is unfinished work. It is the product of a rule:** nothing on this site claims
a real-world fact we have not measured.

Every one of those sections is fully built and wired to `assets/js/content.js`. Each renders
a deliberate sentence while its data is absent, and becomes the fact the moment a real value
is filled in. An unset price does not render `KWD` with a gap in front of it.

The Heat Test empty state is the one to protect. It promises to publish **the hour the cup
stops winning**, not just the hours it wins. A test you only half publish is an advert, and
readers know it. Honesty about where the product stops is what makes the rest believable —
which is also why `product.notGoodFor` ships filled in and says plainly that the cup is wrong
for the dishwasher, for fizzy drinks, and for hot drinks through a straw lid.

If you are about to add a number to this site, you need a source for it. If you do not have
one, leave the blank — the blanks are the strongest argument here.

---

## What is safe to say without a source

Things structurally true of the product category, and our own promises about our own conduct.

Steel is steel. A vacuum wall is a vacuum wall. An engraving is permanent. Kuwaiti summer
heat is a fact of life. Those need no citation. *"Keeps drinks cold for twelve hours"* does.

---

## The cup is real 3D, and there is no library

Each of the body, the woven Sadu band, the lid and the straw is a ring of 24 thin panels,
every one rotated to its own angle and pushed out to the radius. Back-facing panels are
dropped, so the far side never shows through the near side. Drag it and you are turning
geometry.

Two things worth not undoing:

**The lighting is a flat layer in front of the cup, not shading on the panels.** That looks
like a shortcut and is actually correct: a cylinder turning about its own axis has a
silhouette that never changes, so the light should stay still while the printing rotates past
it. An earlier version used `mix-blend-mode` there, which forced the browser to flatten the
whole 3D subtree into a texture every frame and **locked the renderer up completely**. If you
make the shading prettier, check it still runs.

**The cup does not mirror in Arabic.** `.c3d` is pinned `direction: ltr` on purpose. A lid is
on the same side of a physical object in every language. Only the layout around it flips.

Proportions come from `product.heightCm` and `product.diameterCm` — 22 × 7 cm off the product
sheet. Correct the spec and the model changes shape rather than being re-drawn by hand.

---

## The Arabic is not a translation

It was written natively in a Kuwaiti register, and in several places it says something
different in order to mean the same thing. Copy translated word-for-word reads as foreign,
and foreign reads as untrusted.

If you edit an Arabic string, do not "correct" it toward Modern Standard Arabic. And never
let the Arabic claim something the English does not — a reader who switches language mid-page
must not catch us in a contradiction.

`cup.kw` stays Latin and left-to-right in both languages. It is never transliterated.

---

## The colours

`slug` is what gets stored against an order. **Never change a slug once a reservation exists
against it** — you will orphan the order. Change the English and Arabic labels instead;
they are display-only.

Delete a colour and it disappears from the 3D model, the engraving preview and the
reservation form at once, because all three read the same list.

---

## The login, and the database

Sign in and create account are two distinct buttons, not one that guesses. Guessing is how a
typo in an email address silently becomes a second account.

The password is passed straight from the field into the request and is never assigned to
anything of ours. It is not stored, not logged, not put on the session object.

Supabase reports failures accurately but not in language addressed to a customer. Every one
is translated into something a person can act on, in their own language — including "email
not confirmed", which is **not an error**: the account exists and is waiting.

A reservation is private commercial data, so Row Level Security only ever hands a row back to
the session that owns it — unlike a public members list, a signed-in customer cannot read
anyone else's. `user_id` is filled by a database trigger from the verified token, never from
the browser.

The publishable key in `assets/js/backend.js` is committed **on purpose**. It ships in the
JavaScript of every Supabase site on the web and is not a secret. RLS is what protects the
data. The `service_role` key must never enter this repository.

---

## Things that were considered and rejected

- **A video.** An advert clip was on the home page for one commit and was replaced by the 3D
  model. A model you can turn beats a clip you can only watch, and it costs no file.
- **`mizu` branding on the base.** It appears on the physical product's underside, but
  putting a third-party mark on the site would read as a partnership claim we have not made.
- **More panels on the cylinder.** 34 looked no better than 24 and cost frames.

---

## Open, as of writing

| What | Where |
|---|---|
| The price | `content.js` → `price` — inside the 8.5–13 KWD band, figure not chosen |
| Heat Test readings | `content.js` → `heatTest.rows` |
| Cup-holder results | `content.js` → `fit.entries` — physically tested cars only |
| Contact handles | `content.js` → `contact` |
| Capacity, hours cold/hot, weight, steel grade | `content.js` → `product` |
| `unsafe-inline` in the script CSP | `vercel.json` — `/login` and `/reserve` still carry inline scripts |
| The `[ MOUDHI ]` wordmark | hard-coded in `assets/js/cup3d.js` |

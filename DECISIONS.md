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

Proportions come from `product.heightCm`, `topDiameterCm` and `baseDiameterCm` — 27 cm tall,
10 cm at the mouth, 7.5 cm at the base, off the product sheet. The body is a cone frustum
because the real cup is. Correct the spec and the model changes shape rather than being
re-drawn by hand.

It turns on **both** axes now, and zooms. Pitch is clamped to roughly −52°…+26° for two
reasons: past that you are looking into a lid with no inside modelled, and the fixed lighting
overlay only describes a cylinder seen side-on — which is also why it fades as the cup tips,
rather than lying about where the light is.

Wheel zoom requires ctrl or ⌘. A bare wheel scrolls the page, because hijacking the scroll
whenever a cursor crosses a product shot is a hostile pattern. On touch, a vertical swipe
still scrolls too — which is why tilt has buttons as well as drag. Nobody should be able to
get trapped inside a 3D model.

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

## The cup has a face, and rules about where it may not go

The character is a stoic little survivor, not a mascot. It endures a Kuwaiti
afternoon without complaining and is quietly pleased to be picked up. Two eyes, a
blink, no mouth. Wide-set and small reads adult; close-set and large reads like a
children's toy, and this is a real product being sold to adults for money.

**Where the face is forbidden**, and this matters more than where it appears: it
must never sit beside a section where the site is admitting it does not know
something. No face next to the unpublished Heat Test. No face next to the price
disclosure or the empty cup-holder list. The credibility of this site rests on
those sections being straight-faced, and a winking cup next to *"we have not
measured this yet"* would undo all of it.

Mechanically the face is opt-in per page: a cup only has one if its element
carries `data-face`. The default is no face at all.

---

## The waiting screen is a cost, and it is priced accordingly

A deliberate pause between pages is time taken from somebody. So it is capped at
about three quarters of a second, a click or Escape skips it instantly, and
reduced motion **removes the delay entirely** rather than merely removing the
animation. A hard timeout always releases the navigation, so a failure in that
file can never strand a visitor on a brand mark.

It is inserted by script. If `loader.js` fails to load, the site navigates the way
it always did — nothing depends on it.

The nineteen lines are Kuwaiti, written in Arabic first, with the English rebuilt
around each joke rather than translated. A twentieth was cut: it claimed four
colours, and the collection has fourteen. The count *was* the joke, so it could
not be reworded — it had to go.

---

## The show is not the only place the words live

Every scene's copy is written into the page at load, not when its turn arrives.
The animation only decides which scene is *foregrounded*. With motion off, all
seven are shown at full strength and one Kuwaiti day simply reads as a list.

That is the rule the whole site is built on — an animation is never the only
reason content is visible — and the show is the place it was most tempting to
break.

Props are drawn in CSS: steam is three rising strokes, the car is a cup-holder
ring and a dashboard sweep, the bag is a dark mouth in front of the cup. The bag
uses fixed colours rather than tokens, because `--ink` inverts between day and
night and a bag that turns cream at night reads as a cardboard box.

---

## The assistant is not an AI, and says so

It matches what you type against a written keyword table and returns an answer
somebody wrote. There is no model behind it. Its own panel says this before it
says anything else, and its greeting repeats it.

That is not modesty, it is the only honest option available: a real language model
needs a server-side API key, and a key shipped in a static site's JavaScript is a
key you have given away. If you want a real one later, the route is a Supabase
Edge Function holding the key, with the page calling that — not a key in this
repository, ever.

Arabic matching folds alef forms, ta marbuta, alef maqsura and diacritics
together. Without that, correctly-typed Arabic gets a shrug.

---

## Two bugs worth remembering

**The translation loop.** `applyLang()` ends by dispatching `cup:lang`. `chat.js`
listened for `cup:lang` and re-translated itself by calling `applyLang()` — which
dispatched `cup:lang` again. Stack overflow on every page load, which silently
killed everything that booted after it. There is now a re-entrancy guard in
`applyLang`; leave it there. Anything that listens for `cup:lang` must not ask for
a full re-translation pass.

**Double-centring.** `cup3d.js` centres its planes with `translateX(-50%)`. Adding
a negative margin in CSS as well pushed the decal, and later the face, clean off
the side of the cup. It has happened twice. Centre it in one place.

---

## Things that were considered and rejected

- **A video.** An advert clip was on the home page for one commit and was replaced by the 3D
  model. A model you can turn beats a clip you can only watch.
- **Drawing everything.** The site ran for several commits with no image files at all, which
  was a good discipline and the wrong final answer. Five real product photographs went in
  once they existed: a photo of the cup in an actual cup holder beats a cup holder drawn in
  CSS, and the scenes with no photograph still use the model, so neither is doing the other's
  job. Three of the seven show scenes are still drawn.
- **Maximum contrast.** Both themes were first built near the top of the contrast range —
  13.7:1 in day, 15.2:1 at night. Correct by the guidelines and tiring to read. They now sit
  at about 10.7:1 and 11.4:1, which is still well past AAA and much easier on the eye.
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

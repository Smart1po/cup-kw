# The back end

**Live.** Supabase project `CUP` (`vufibpaxprcydixjfoue`), eu-central-1, free tier. The URL
and publishable key are in `assets/js/backend.js`.

There is no bundler and no CDN in this project, so `supabase-js` cannot be imported. Every
call is a hand-written `fetch` against the Supabase auth and REST endpoints, which is what
the library does for these operations anyway.

---

## What is in the database

One table, `reservations`. One row per person — reserving twice edits the reservation instead
of creating a second one.

| Column | |
|---|---|
| `user_id` | set by a trigger from the verified token, never from the browser |
| `display_name`, `quantity`, `colour` | `colour` stores the **slug**, not the label |
| `engraving`, `engraving_script` | `latin` or `arabic` — the script decides the layout |
| `status`, `created_at`, `updated_at` | `updated_at` is touched by a trigger |

Row Level Security is **on**, with four policies. The important one:

> A signed-in customer can read **only their own row.**

That is different from a public members list, and deliberately so. A pre-order is private
commercial data — how many cups somebody ordered, and what name they had cut into one, is not
for other customers to read.

Two triggers do work the browser is not trusted with. `reservations_set_user_id` fills
`user_id` from `auth.uid()` on insert, so a client that posts somebody else's id gets its own
anyway. `touch_reservation` refuses to let an update reassign ownership.

---

## Why the key in the repository is fine

`assets/js/backend.js` contains the **publishable** key. It ships in the JavaScript of every
Supabase site on the web and is not a secret. What protects the data is the Row Level
Security above — with RLS off, that key really would let anyone read every reservation.

The **`service_role` key bypasses every policy** and must never enter this repository, any
config file, or any deployment environment variable used by the front end.

---

## The one setting to check before a demo

**Authentication → Sign In / Providers → Email → Confirm email.**

With it **on**, a new account gets no session until the person clicks a link in their inbox.
The site handles this honestly — it reports *"The account exists and is waiting on you"*
rather than an error, because that is what has happened. It is correct behaviour and poor
demo behaviour.

Turn it **off** for a live demo in a room. **Turn it back on before real customers use this.**

---

## Checking it works

1. Open `/login` and create an account with an address you have never used.
2. Supabase dashboard → **Authentication → Users**. The account is there.
3. Reserve a cup on `/reserve`. → **Table Editor → reservations**. The row is there, with
   your engraving on it.
4. Close the browser entirely and reopen `/reserve`. You are still signed in.
5. Sign in on a phone with the same address. Same account, same reservation.

Step 4 is the one worth doing in front of somebody.

---

## If there is no back end

Opened from a `file://` path there is no origin to call from. Every call reports `no-backend`,
the page says so in plain language in both languages, and nothing that was typed goes
anywhere. Nothing breaks and nothing lies about what it did.

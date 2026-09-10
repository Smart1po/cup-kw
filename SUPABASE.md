# The back end

**Live.** Supabase project `CUP` (`vufibpaxprcydixjfoue`), eu-central-1, free tier. The URL
and publishable key are in `assets/js/backend.js`.

There is no bundler and no CDN in this project, so `supabase-js` cannot be imported. Every
call is a hand-written `fetch` against the Supabase auth and REST endpoints, which is what
the library does for these operations anyway.

---

## Four settings to change in the dashboard

None of these can be done from this repository, and none of them can be done by whoever
wrote it: the Supabase account this code was written against does not have this project on
it. The code is written and waiting for all four; until they are switched on, the site says
so honestly rather than pretending.

### 1. Confirm email → **off**

**Authentication → Sign In / Providers → Email → Confirm email.**

Sign-up is now a plain sign-up: fill the form, and you are in. That only works with
confirmation **off**, because with it on Supabase returns no session until a link in an
inbox is clicked. With it on, the site reports *"The account exists and is waiting on you"*
and stops there — correct behaviour, and not the behaviour asked for.

**Turn it back on before real customers use this**, and expect the sign-up flow to change
shape when you do.

### 2. Google → **on**

**Authentication → Sign In / Providers → Google.** Needs a client ID and secret from a
Google Cloud OAuth consent screen. Authorised redirect URI:

```
https://vufibpaxprcydixjfoue.supabase.co/auth/v1/callback
```

### 3. Apple → **on**

Same screen. Needs an Apple Developer account, a Services ID, and a signing key. Same
callback URL.

The two buttons are on **`/signup`**, not `/login` — logging in is an email and a password
and nothing else. Both providers are a way of making an account as much as a way back into
one, so that is where they sit.

Until a provider is switched on, its button sends the person to Supabase and Supabase sends
them straight back with an error in the URL. `login.html` reads that and says *"That way in
is not switched on yet"* rather than hanging on a blank screen.

### 4. Redirect URLs → **allow-list the login page**

**Authentication → URL Configuration → Redirect URLs.** Supabase refuses to send anybody
back to a `redirect_to` it has not been told about, and silently drops them at the site root
instead. The provider always returns to `login.html`, whichever page sent them out, because
that is where the token is read out of the fragment:

```
https://cup-kw.vercel.app/login.html
http://localhost:3311/login.html
```

Add the second only while developing, and take it out before launch.

---

## What is in the database

**Nothing that this site now writes.** The `reservations` table is still there and is no
longer used — `/reserve` was removed along with it. Drop it when you are sure you want to
lose what is in it.

The customer's name, phone, area, saved addresses and orders all live in
**`raw_user_meta_data` on their own row in `auth.users`**, written through
`PUT /auth/v1/user`.

### Why, and what is wrong with it

It needs no table, no migration and no policy, which is the whole reason: it works today
against a project that the person writing this code cannot reach.

The cost is real and you should understand it before relying on it. **A person can edit
their own metadata.** That is fine for a name, a phone number and an address — those are
theirs to change. It is *not* fine for an order status: today `status` is a note to the
customer, not a record they cannot touch, and anyone who opens the console can mark their
own order delivered.

### When that stops being acceptable

The moment staff need to move an order through its stages. At that point orders belong in
their own table, with a policy that lets a customer read their own and only staff write:

```sql
create table public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  placed_at   timestamptz not null default now(),
  status      text not null default 'placed'
              check (status in ('placed','making','onway','delivered')),
  items       jsonb not null,
  total       numeric(6,3),
  gift        boolean not null default false,
  address     jsonb,
  recipient   jsonb,
  message     text check (char_length(message) <= 250)
);

alter table public.orders enable row level security;

-- Read your own, and only your own.
create policy orders_read_own on public.orders
  for select using (auth.uid() = user_id);

-- Place your own. user_id comes from the token, not the browser.
create policy orders_insert_own on public.orders
  for insert with check (auth.uid() = user_id);

create function public.orders_set_user_id() returns trigger
  language plpgsql security definer as $$
begin
  new.user_id := auth.uid();
  return new;
end $$;

create trigger orders_set_user_id before insert on public.orders
  for each row execute function public.orders_set_user_id();
```

Note there is deliberately **no update policy**: with none, nobody can change a row through
the publishable key at all, which is the correct starting point. Add one for a staff role
when there is a staff role.

Then change `placeOrder` and the orders half of `getUser` in `assets/js/backend.js` to
`/rest/v1/orders`. Addresses can stay in metadata — they really are the customer's own.

---

## Why the key in the repository is fine

`assets/js/backend.js` contains the **publishable** key. It ships in the JavaScript of every
Supabase site on the web and is not a secret. What protects the data is Row Level Security —
and, for everything above, the fact that Supabase only ever hands back the user attached to
the access token in the request.

The **`service_role` key bypasses every policy** and must never enter this repository, any
config file, or any deployment environment variable used by the front end.

---

## Checking it works

1. Open `/signup` and fill in name, email, phone and area.
2. Supabase dashboard → **Authentication → Users**. The account is there, and
   **Raw User Meta Data** holds the four fields.
3. Put a cup in the cart from `/menu`, then **Checkout**. Save an address and place the order.
4. `/account` shows it, with its status and the time it was placed. Back in the dashboard,
   the same order is in that user's metadata.
5. Close the browser entirely and reopen `/account`. You are still signed in.
6. Sign in on a phone with the same address. Same account, same orders.

Step 5 is the one worth doing in front of somebody.

---

## If there is no back end

Opened from a `file://` path there is no origin to call from. Every call reports `no-backend`,
the page says so in plain language in both languages, and nothing that was typed goes
anywhere. The cart still works — it is in `localStorage` and never needed a server — so the
catalogue, the cup, and the engraving screen are all fully usable offline. Nothing breaks and
nothing lies about what it did.

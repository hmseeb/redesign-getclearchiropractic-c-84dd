# Clear Chiropractic — Website Redesign

A complete, from-scratch redesign for **Clear Chiropractic**, a family-run chiropractic practice
with offices in Chula Vista and La Mesa, California. Built with vanilla HTML, CSS and JavaScript —
no build step, no dependencies, no environment variables.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, quick links, about, services overview, conditions, doctors, moms &amp; babies, testimonials, FAQ, locations, contact form, CTA |
| `services.html` | All six services in depth plus the full list of conditions families bring to us |
| `team.html` | Full profiles for Dr. Eva Zingone, Dr. Joe Zingone and Dr. Makai Manuwai, plus techniques used |
| `new-patients.html` | What to expect across the first two visits, fees and payment, appointment request form |
| `contact.html` | Both locations with hours and phone numbers, message form, updates sign-up form |

## Assets

```
assets/
  css/styles.css   design tokens, layout, components, responsive rules
  js/main.js       header state, mobile drawer, testimonial carousel, scroll reveals, form handling
  favicon.svg      inline SVG favicon
```

## Design

- Modern, clean, professional aesthetic: deep teal and warm sand palette, clay accent for calls to action.
- `Fraunces` display serif paired with `Plus Jakarta Sans` for body copy (system-font fallbacks included).
- Mobile-first and fully responsive; sticky header, off-canvas mobile menu, and a sticky
  Call / Book action bar on small screens.
- Accessibility: skip link, semantic landmarks, visible focus styles, labelled form controls,
  `aria-current` on the active nav item, `prefers-reduced-motion` support.
- SEO: per-page titles and descriptions, Open Graph and Twitter cards, canonical links, and
  `Chiropractic` JSON-LD with address and opening hours on the home page.

## Forms

All five forms POST to the same LeadrVision endpoint:

```
https://vision.leadrai.com/api/forms/229c0adfd37c1e856d082f9cf10f9771
```

Every form includes:

- a hidden `_form` field naming the form (`Contact`, `Service enquiry`, `Appointment request`, `Newsletter`)
- a hidden `_page` field populated with `window.location.href` on load (and included in JSON fetch bodies)
- a hidden `_gotcha` honeypot field
- human-readable field names, with `name`, `email` and `phone` used verbatim where requested

`assets/js/main.js` enhances submissions with `fetch()` to the same URL and shows an inline
"Thanks, your message was sent" confirmation when the response is `{"ok": true}`. With JavaScript
disabled the plain HTML POST still works, and a visitor returning with `?submitted=1` sees the
same confirmation plus a page-level banner.

## Content &amp; images

All copy, services, conditions, FAQs, testimonials, hours, addresses and phone numbers come from the
existing Clear Chiropractic site. Photography reuses the practice's own authentic images (logo,
doctor portraits and in-office family photos) at their original URLs — no stock imagery and no
invented assets.

## Running locally

Open `index.html` in a browser, or serve the directory:

```sh
python3 -m http.server 8000
```

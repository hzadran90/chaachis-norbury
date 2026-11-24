# Chaachi's Norbury — website

A website for **Chaachi's**, the family-run halal café at **1583 London Rd, Norbury, London SW16 4AA**
([@chaachis.norbury](https://www.instagram.com/chaachis.norbury/)).

It is a static site (plain HTML, CSS and JavaScript, with no build step), hosted on Netlify.

## Features

- **Background video:** the café's "pov: you found Norbury's best late-night halal café" reel plays behind the whole site, and also in a sharp arch frame in the hero.
- **Live open/closed status:** worked out from Europe/London time, with today's row highlighted in the hours table.
- **Full menu:** transcribed from the in-café menu boards and split into tabs (Hot Drinks, Matcha & Iced, Frappe & Bubble, Savoury & Specials, Sweet Treats).
- **Instagram panel:** an iPhone Pro Max-style phone mock-up with a scrollable profile and the latest posts. Each post links to Instagram.
- **Google reviews:** a 4.8★ summary from 118 reviews and a carousel of selected reviews, with links to read or write a review.
- **Story timeline:** from the 2025 soft opening to the first Sip & Paint event in November 2026.
- **Chat assistant:** answers questions about hours, the menu, halal, directions and events. It can hand off to an **Instagram DM** or send an **email enquiry**.
- **Contact form:** uses Netlify Forms (form name `enquiry`) and shares its submission path with the chat widget.
- **Motion:** an intro loader, a split-letter hero title, scroll reveals, parallax, magnetic buttons, 3D tilt cards, a marquee, a drag-to-scroll gallery and timeline progress. All of it respects `prefers-reduced-motion`.

## Receiving enquiries by email

Messages from the contact form and the chat widget are saved by **Netlify Forms**. To have them emailed to the café:

1. Open Netlify → this site → **Site configuration → Forms → Form notifications**.
2. **Add notification → Email notification**, choose the `enquiry` form, and enter Chaachi's email address.

When the café confirms a public email address, also set `CONTACT_EMAIL` at the top of `script.js`. That shows the address on the page and gives visitors a pre-filled email if the form ever fails.

## Run locally

```bash
python -m http.server 5179
# open http://localhost:5179
```

## Structure

```
index.html      page markup + schema.org data
styles.css      all styling and responsive rules
script.js       menu, Instagram, reviews, hours, chat and motion
netlify.toml    publish settings + headers
assets/img      photos (from @chaachis.norbury), menu boards, logo, icons
assets/video    background reel (web-optimised) + poster
```

## Content sources

- Photos and video: [@chaachis.norbury](https://www.instagram.com/chaachis.norbury/) on Instagram
- Menu: the café's menu boards (via the [Wheree listing](https://chaachi-s.wheree.com/menu))
- Reviews and rating: Chaachi's Google Business profile
- Opening hours: Chaachi's "Open hours" Instagram highlight

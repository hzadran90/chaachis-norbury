/* ==========================================================
   Chaachi's Norbury — interactions
   ========================================================== */

/* ---- Site config ------------------------------------------------------
   CONTACT_EMAIL: once Chaachi's confirms a public email address, put it
   here. It will show in the contact list, and the forms will fall back to
   a pre-filled email if the online form can't be sent.
   Enquiries are delivered through Netlify Forms (form name "enquiry").
   Set the address that receives them in Netlify, under
   Site configuration → Forms → Form notifications.
------------------------------------------------------------------------- */
const CONFIG = {
  CONTACT_EMAIL: "",
  INSTAGRAM: "https://www.instagram.com/chaachis.norbury/",
  INSTAGRAM_DM: "https://ig.me/m/chaachis.norbury",
  DIRECTIONS: "https://www.google.com/maps/dir/?api=1&destination=Chaachi%27s%2C+1583+London+Rd%2C+Norbury%2C+London+SW16+4AA",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------- Menu (from the in-café menu boards) ---------------- */
const MENU = [
  {
    id: "drinks", label: "Hot Drinks", groups: [
      { title: "Coffee", items: [
        ["Americano", "£3.00"], ["Flat White", "£3.00"], ["Cappuccino", "£3.50"], ["Latte", "£3.50"],
        ["Honey Oat Latte", "£4.20"], ["Mocha", "£3.50"], ["Hot Chocolate", "£3.50"] ] },
      { title: "Tea", price: "£3.25", items: [
        ["Simple Karak Chai", "", "Fan favourite"], ["Mint Tea", ""], ["Nar Çay", "", "Pomegranate tea, from Turkey"] ] },
      { title: "Extras", items: [
        ["Syrups", "£0.50", "Hazelnut, Caramel, Vanilla, Chocolate, Pistachio, Honeycomb, Strawberry, Blueberry"],
        ["Soya Milk, Almond Milk or Cream", "£0.50"] ] },
    ],
  },
  {
    id: "matcha", label: "Matcha & Iced", groups: [
      { title: "Matcha", items: [
        ["Blueberry Milk / Oat Matcha", "£4.95"], ["Vanilla Milk / Oat Matcha", "£4.95"],
        ["Matcha w/ Strawberry Foam", "£5.25", "Signature"] ] },
      { title: "Iced Drinks", items: [
        ["Iced Pistachio Latte", "£4.95"], ["Iced Spanish Latte", "£4.95", "Signature · with a dash of cinnamon"],
        ["Iced Mocha", "£3.95"], ["Nimbu Pani", "£3.50", "Fresh lemon cooler"] ] },
    ],
  },
  {
    id: "frappe", label: "Frappe & Bubble", groups: [
      { title: "Frappe", price: "£4.50", items: [
        ["Caramel Frappe", ""], ["Hazelnut Frappe", ""], ["Vanilla Frappe", ""], ["Mocha Frappe", ""] ] },
      { title: "Bubble Tea", price: "£4.20", items: [
        ["Blueberry Lemonade", "", "with Strawberry Bubbles"],
        ["Mango, Passion Fruit & Guava", "", "with Mango Bubbles"] ] },
    ],
  },
  {
    id: "savoury", label: "Savoury & Specials", groups: [
      { title: "Homemade Savoury", items: [
        ["Vegetable Pasty", "£4.50", "Vegetarian"], ["Chicken Pasty", "£4.95"], ["Beef Pasty", "£5.20"],
        ["Brie & Caramelised Onions on Sourdough", "£5.95"],
        ["Sriracha Chicken & Red Leicester Panini", "£6.50"],
        ["Steak Strips, Fried Onions & Cheese Panini", "£6.95"] ] },
      { title: "Chaachi's Specials*", note: "Available on certain days, so ask at the till.", items: [
        ["Chicken & Spinach Creamy Pasta", "£6.95"], ["Shepherd's Pie", "£7.95", "With gravy & Yorkshire pudding"],
        ["Chicken & Mozzarella Pie", "£7.95"], ["Prawn & Vegetable Noodles", "£7.95"],
        ["Chicken Sweetcorn & Rice Noodle Soup", "£5.50"] ] },
    ],
  },
  {
    id: "sweet", label: "Sweet Treats", groups: [
      { title: "Homemade Sweet Treats", items: [
        ["Chocolate & Coffee Tiramisu", "£5.95"], ["Pistachio Tiramisu", "£6.45", "Signature"],
        ["Pistachio & Raspberry Dream Cream", "£6.45"],
        ["Chocolate Cake w/ Pistachio Kunafe & Dark Chocolate", "£5.95", "Signature"],
        ["Creamy Burnt Basque Cheesecake w/ Pouring Chocolate", "£6.95", "Optional raspberry purée +£0.50"] ] },
      { title: "Fresh at the counter", note: "Rotating bakes made by Chaachi. Ask what's in today.", items: [
        ["Blackforest Cheesecake", ""], ["Oreo Cheesecake", ""], ["Biscoff Tiramisu", ""], ["Brownies & Cookies", ""] ] },
    ],
  },
];

function renderMenu() {
  const tabs = $("#menuTabs"), panel = $("#menuPanel");
  tabs.innerHTML = MENU.map((c, i) =>
    `<button class="menu__tab" role="tab" id="tab-${c.id}" aria-controls="menuPanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${c.id}">${c.label}</button>`).join("");
  const show = (id) => {
    const cat = MENU.find((c) => c.id === id);
    $$(".menu__tab", tabs).forEach((t) => { const on = t.dataset.id === id; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    panel.setAttribute("aria-labelledby", `tab-${id}`);
    panel.innerHTML = cat.groups.map((g) => `
      <div class="menu-group">
        <div class="menu-group__head"><h3>${g.title}</h3>${g.price ? `<span>${g.price}</span>` : ""}</div>
        ${g.note ? `<p class="menu-group__note">${g.note}</p>` : ""}
        ${g.items.map(([name, price, desc]) => {
          const sig = desc && desc.startsWith("Signature");
          const sub = sig ? desc.replace(/^Signature( · )?/, "") : desc;
          return `<div class="menu-item">
            <span class="menu-item__name">${name}${sig ? '<span class="tag">Signature</span>' : ""}${sub ? `<small>${sub}</small>` : ""}</span>
            ${price ? `<span class="menu-item__dots"></span><span class="menu-item__price">${price}</span>` : ""}
          </div>`;
        }).join("")}
      </div>`).join("");
  };
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".menu__tab"); if (!b) return;
    show(b.dataset.id);
    b.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
    // if the reader has scrolled down into a long list, bring the new list's top back into view
    const stuck = getComputedStyle(tabs).position === "sticky";
    const panelTop = panel.getBoundingClientRect().top;
    const offset = stuck ? tabs.getBoundingClientRect().bottom + 12 : 90;
    if (panelTop < offset) window.scrollBy({ top: panelTop - offset, behavior: reduceMotion ? "auto" : "smooth" });
  });
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const list = $$(".menu__tab", tabs); const i = list.indexOf(document.activeElement);
    const n = list[(i + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];
    n.focus(); show(n.dataset.id);
  });
  show(MENU[0].id);
}

/* ---------------- Instagram feed (latest posts) ---------------- */
const IG_POSTS = [
  { id: "Df0Fuv9NpR7", type: "reel", img: "events-collage", date: "2026-11-16", likes: 53, cap: "Chaachi's events have officially begun! South has a new event space in town 🎀🎨" },
  { id: "DfxlMuSNpD9", type: "reel", img: "sip-paint", date: "2026-11-15", likes: 201, cap: "Today's Sip & Paint was everything and more! Thank you for helping us raise money for such a lovely cause." },
  { id: "De69mkkt4q0", type: "reel", img: "biscoff-latte", date: "2026-10-25", likes: 54, cap: "Biscoff latte kind of day 🍂🧡🍪" },
  { id: "DewrLkItBOh", type: "reel", img: "barista", date: "2026-10-21", likes: 83, cap: "Honestly, this has actually happened 😩" },
  { id: "DeHJhtxNEx3", type: "photo", img: "hours", date: "2026-10-05", likes: null, cap: "Opening hours: Mon–Thu 3.30–10.30pm · Fri & Sat 3.30pm–12.30am · Sun 3.30–10.30pm" },
  { id: "DeAKwR1tO0y", type: "reel", img: "dessert-pour", date: "2026-10-02", likes: 105, cap: "End of the week means you deserve a treat. Everything is made fresh by Chaachi." },
  { id: "Dd9jwqENUZP", type: "reel", img: "firecracker-chicken", date: "2026-10-01", likes: 42, cap: "Firecracker chicken with rice is on the menu today!" },
  { id: "Dd6371QjTxm", type: "carousel", img: "team-matcha-coffee", date: "2026-09-30", likes: 38, cap: "New flavours for both teams! Birthday cake matcha vs biscoff latte." },
  { id: "Dd4a15cjdbh", type: "carousel", img: "opening-earlier", date: "2026-09-29", likes: 53, cap: "New opening hours from 5th October, now open Wednesdays too!" },
  { id: "Dd17DhrNU-_", type: "reel", img: "biscoff-tiramisu-latte", date: "2026-09-28", likes: 38, cap: "Tastes like biscoff tiramisu in a cup! 👌🏽" },
  { id: "Ddo1bzgtaER", type: "reel", img: "storefront-night", date: "2026-09-23", likes: 108, cap: "All our desserts are made fresh, plus new Blackforest & Oreo cheesecakes." },
];
const IG_ICONS = {
  reel: '<svg class="ig-post__type" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm5 6v6l5-3-5-3Z"/></svg>',
  carousel: '<svg class="ig-post__type" viewBox="0 0 24 24"><path d="M8 3h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm-5 5v11a2 2 0 0 0 2 2h11v-2H5V8H3Z"/></svg>',
  photo: "",
};
function renderInstagram() {
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  $("#igGrid").innerHTML = IG_POSTS.map((p) => `
    <a class="ig-post" href="https://www.instagram.com/${p.type === "reel" ? "reel" : "p"}/${p.id}/" target="_blank" rel="noopener" aria-label="Open Instagram post from ${fmt.format(new Date(p.date))}">
      <img src="assets/img/${p.img}.webp" alt="" loading="lazy" />
      ${IG_ICONS[p.type]}
      <span class="ig-post__over"><b>${fmt.format(new Date(p.date))}${p.likes ? ` · ♥ ${p.likes}` : ""}</b>${p.cap}</span>
    </a>`).join("");
  $("#igPosts").textContent = IG_POSTS.length;
  const clock = () => { $("#phoneClock").textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" }).format(new Date()); };
  clock(); setInterval(clock, 30000);
}

/* ---------------- Reviews (from Google) ---------------- */
const REVIEWS = [
  { n: "Hassan Raja", when: "4 months ago", t: "I got the Shepherds pie and the food was so good and hearty, the portion sizes are great value for the price. The drinks are on point, the pineapple sparkler was so refreshing. The Basque cheesecake and Kunefe cakes were my favourite.", r: "We’re delighted that you enjoyed our special & desserts. We recommend you try our Brisket & Mash (you will not be disappointed)!" },
  { n: "Mina", when: "4 months ago", t: "I’ve always loved Chaachis for their Karak Chai and desserts (the tiramisu is elite), but since their reopening I tried the Iced Spanish Latte with cold foam… and I fear I’ve developed a new addiction. I literally bought two at 10pm on a Sunday night. No regrets." },
  { n: "Niltip 786", when: "4 months ago", t: "Such a welcoming atmosphere that it’s easy to feel at home as soon as you walk through the door. The cosy, nostalgic décor gives the café plenty of charm, and the Spanish latte, made by the owner herself, was absolutely delicious." },
  { n: "Lareb Naseem", when: "a year ago", t: "As soon as we walked in, I felt transported back home to Pakistan. The Pistachio & Raspberry Cream Dream? I almost gave it infinite stars. The Shepherd's Pie felt like a warm, nostalgic hug from my mother's kitchen." },
  { n: "Madeeha Islam", when: "3 months ago", t: "Everything about this place is just amazing. The comfort food, drinks, amazinggg service, and unique decor. I’d defo recommend the iced spanish latte, and the tiramisu! 🤍" },
  { n: "Sundas Malik", when: "a year ago", t: "My new local matcha spot! The strawberry foam matcha was just as good, if not better, than the big competitors! Update: I had to come back for the Chocolate Kunafa Cake, it is unreal!! Second slice this week!" },
  { n: "Ju'varna Campbell", when: "a year ago", t: "We were intrigued by the story on the walls, generations of pictures taken in the local area. If you like a balanced matcha with sensible flavours, this is definitely the spot to go to." },
  { n: "Aisr", when: "4 months ago", t: "I tried the firecracker chicken special and the new peach matcha and I was so impressed, Allahumma Barik. This place is such a vibe. Very cosy and chilled environment with friendly staff." },
  { n: "Sufus", when: "a year ago", t: "Taken aback by its beautiful decor. The creamy chicken, spinach pasta was out of this world. Desserts and pastries are all homemade and that shines through. The chocolate tiramisu was deeelicious." },
  { n: "Eva Nip", when: "a year ago", t: "Service was excellent and friendly, you can tell they put their heart into the place. We had the basque cheesecake, chocolate tiramisu, and chocolate pistachio kunafe cake. These slices were huge and so yummy." },
  { n: "Cem Mustafa", when: "a year ago", t: "Greeted by a bubbly woman at the counter who made me feel like I was at home 😊 Kunafe & dark chocolate cake with an iced Spanish latte, both 10/10, plus the service was first class." },
  { n: "Umar Ali", when: "4 months ago", t: "Lovely caramel tone to the chai that makes it perfect and not too sweet either. The seating and interior is amazing as well, a proper Pakistani style cafe. Dairy alternatives available, just ask." },
];
function renderReviews() {
  const track = $("#reviewsTrack");
  track.innerHTML = REVIEWS.map((r) => `
    <article class="rv">
      <span class="stars" aria-label="5 out of 5 stars">★★★★★</span>
      <div class="rv__quote" aria-hidden="true">“</div>
      <p>${r.t}</p>
      ${r.r ? `<p class="rv__reply"><b>Chaachi's replied:</b> ${r.r}</p>` : ""}
      <div class="rv__meta"><span class="rv__avatar">${r.n.trim()[0]}</span><div><b>${r.n}</b><small>Google review · ${r.when}</small></div></div>
    </article>`).join("");
  const step = () => (track.querySelector(".rv")?.offsetWidth || 360) + 22;
  $("#rvPrev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  $("#rvNext").addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  // gentle auto-advance, paused on hover/touch
  let paused = false;
  ["mouseenter", "touchstart", "focusin"].forEach((ev) => track.addEventListener(ev, () => (paused = true), { passive: true }));
  let resume; const unpause = () => { clearTimeout(resume); resume = setTimeout(() => (paused = false), 4000); };
  if (!reduceMotion) setInterval(() => {
    if (paused || document.hidden) return;
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
    track.scrollTo({ left: end ? 0 : track.scrollLeft + step(), behavior: "smooth" });
  }, 5500);
}

/* ---------------- Opening hours / live status ---------------- */
// day: 0 = Sunday … 6 = Saturday; times in minutes after midnight (London time)
const HOURS = { 0: [930, 1350], 1: [930, 1350], 2: [930, 1350], 3: [930, 1350], 4: [930, 1350], 5: [930, 1470], 6: [930, 1470] };
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function londonNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, mins: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
}
const fmtTime = (m) => { m %= 1440; const h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1; return `${h12}${mm ? "." + String(mm).padStart(2, "0") : ""}${h < 12 ? "am" : "pm"}`; };
function openStatus() {
  const { day, mins } = londonNow();
  const [o, c] = HOURS[day];
  const prev = (day + 6) % 7; const [, pc] = HOURS[prev];
  if (pc > 1440 && mins < pc - 1440) return { open: true, text: `Open now · closes ${fmtTime(pc)}` };
  if (mins >= o && mins < c) return { open: true, text: `Open now · closes ${fmtTime(c)}` };
  if (mins < o) return { open: false, text: `Closed · opens today at ${fmtTime(o)}` };
  return { open: false, text: `Closed · opens ${DAY_NAMES[(day + 1) % 7]} at ${fmtTime(HOURS[(day + 1) % 7][0])}` };
}
function renderStatus() {
  const s = openStatus();
  $("#statusDot").className = "dot " + (s.open ? "open" : "closed");
  $("#statusText").textContent = s.text;
  const { day } = londonNow();
  $$("#hoursList li").forEach((li) => li.classList.toggle("today", li.dataset.days.split(",").map(Number).includes(day)));
}

/* ---------------- Enquiry submission (Netlify Forms) ---------------- */
async function sendEnquiry(data) {
  const body = new URLSearchParams({ "form-name": "enquiry", ...data }).toString();
  const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (!res.ok) throw new Error("Form error " + res.status);
  return true;
}
const mailtoFor = (d) => CONFIG.CONTACT_EMAIL &&
  `mailto:${CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent(`${d.topic || "Enquiry"} from ${d.name}`)}&body=${encodeURIComponent(`${d.message}\n\n${d.name}\n${d.email}`)}`;

function initContactForm() {
  const form = $("#enquiryForm"), status = $("#formStatus");
  if (CONFIG.CONTACT_EMAIL) {
    $("#emailRow").hidden = false;
    $("#emailLink").href = `mailto:${CONFIG.CONTACT_EMAIL}`;
    $("#emailLink").textContent = CONFIG.CONTACT_EMAIL;
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    delete data["form-name"]; delete data["bot-field"];
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Sending…"; status.textContent = "";
    try {
      await sendEnquiry(data);
      form.reset();
      status.textContent = "Thank you! Your message has been sent. We'll be in touch soon. ☕";
    } catch {
      const m = mailtoFor(data);
      status.innerHTML = m
        ? `We couldn't send that online. <a href="${m}">Email it to us instead</a>, or <a href="${CONFIG.INSTAGRAM_DM}" target="_blank" rel="noopener">DM us on Instagram</a>.`
        : `We couldn't send that just now. Please <a href="${CONFIG.INSTAGRAM_DM}" target="_blank" rel="noopener">DM us on Instagram</a>.`;
    } finally { btn.disabled = false; btn.textContent = "Send message"; }
  });
}

/* ---------------- Chat assistant ---------------- */
function initChat() {
  const fab = $("#chatFab"), chat = $("#chat"), body = $("#chatBody"), chips = $("#chatChips"), input = $("#chatInput"), text = $("#chatText");
  let started = false;

  const scroll = () => (body.scrollTop = body.scrollHeight);
  const add = (html, who = "bot") => { const d = document.createElement("div"); d.className = `msg msg--${who}`; d.innerHTML = html; body.appendChild(d); scroll(); return d; };
  const addActions = (actions) => {
    const w = document.createElement("div"); w.className = "msg-actions";
    actions.forEach((a) => {
      const el = document.createElement(a.href ? "a" : "button");
      el.textContent = a.label; if (a.primary) el.className = "primary";
      if (a.href) { el.href = a.href; if (/^https?:/.test(a.href)) { el.target = "_blank"; el.rel = "noopener"; } el.addEventListener("click", () => a.href.startsWith("#") && toggle(false)); }
      else el.addEventListener("click", a.onClick);
      w.appendChild(el);
    });
    body.appendChild(w); scroll();
  };
  const botSay = (html, actions) => new Promise((resolve) => {
    const typing = add("<i></i><i></i><i></i>"); typing.classList.add("msg--typing");
    setTimeout(() => { typing.remove(); add(html); if (actions) addActions(actions); resolve(); }, reduceMotion ? 50 : 650);
  });

  const igActions = [{ label: "💬 DM on Instagram", href: CONFIG.INSTAGRAM_DM, primary: true }, { label: "Email enquiry", onClick: () => showEmailForm() }];

  const intents = [
    { k: /(halal|\bhmc\b|\bmeat\b|vegan|vegetarian|allerg|dairy|gluten|\bnuts?\b|lactose)/i, a: () => botSay("All our meat is <b>HMC certified halal</b>. We have vegetarian options and dairy alternatives (soya, almond, oat). For allergens, please ask at the till or message us.", igActions) },
    { k: /\b(hours?|open|opening|close[sd]?|closing|times?|today|tonight|late|when)\b/i, a: () => botSay(`We're open <b>every day from 3.30pm</b>:\nMon–Thu · 3.30pm–10.30pm\nFri & Sat · 3.30pm–12.30am\nSun · 3.30pm–10.30pm\n\nRight now: <b>${openStatus().text}</b>`, [{ label: "See full hours", href: "#visit" }]) },
    { k: /matcha/i, a: () => botSay("Our matchas are a customer favourite 🍵 Blueberry or Vanilla (milk/oat) £4.95, and the signature <b>Matcha w/ Strawberry Foam</b> £5.25. Ask about the Birthday Cake Matcha too!", [{ label: "Matcha menu", href: "#menu" }]) },
    { k: /\b(chai|karak|teas?|nar|pomegranate)\b/i, a: () => botSay("Karak Chai, Mint Tea and Nar Çay (pomegranate tea, sourced from Turkey) are all £3.25 ☕") },
    { k: /(cakes?\b|desserts?|sweets?\b|tiramisu|kunaf|cheesecake|brownie|cookie)/i, a: () => botSay("Everything sweet is homemade by Chaachi: Pistachio Tiramisu £6.45, Chocolate Cake w/ Pistachio Kunafe £5.95, Burnt Basque Cheesecake £6.95 and more. Want a whole cake? Send us an enquiry!", [{ label: "Order a cake", onClick: () => showEmailForm("Whole cake order") }]) },
    { k: /\b(where|address|location|directions?|park|parking|station|find you|postcode)\b/i, a: () => botSay("You'll find us at <b>1583 London Rd, Norbury, London SW16 4AA</b>. There's free street parking nearby, and we're a short walk from Norbury station.", [{ label: "Get directions", href: CONFIG.DIRECTIONS, primary: true }]) },
    { k: /(events?\b|paint|part(y|ies)|\bbook|\bhire\b|reserv|birthday|\bgroups?\b)/i, a: () => botSay("Chaachi's events have officially begun 🎨 We host Sip & Paint nights and more. We're walk-in only for normal visits, but for events or private hire just send us a message!", [{ label: "Enquire about events", onClick: () => showEmailForm("Events & private hire"), primary: true }, { label: "DM on Instagram", href: CONFIG.INSTAGRAM_DM }]) },
    { k: /(insta|\bdm\b|social|tiktok|follow)/i, a: () => botSay("Follow us on Instagram <b>@chaachis.norbury</b> for new flavours, daily specials and events.", [{ label: "Open Instagram", href: CONFIG.INSTAGRAM, primary: true }, { label: "Send a DM", href: CONFIG.INSTAGRAM_DM }]) },
    { k: /\b(e-?mail|contact|phone|call|message|speak|human|staff|quer(y|ies)|question|enquir\w*)\b/i, a: () => botSay("You can send us a message right here and it'll go straight to the Chaachi's team. For the fastest reply, DM us on Instagram.", igActions) },
    { k: /\b(menu|prices?|costs?|eat|food|drinks?|how much)\b/i, a: () => botSay("Our menu has speciality coffee, karak chai, matcha, iced drinks, frappes, bubble tea, homemade savoury bites, specials and sweet treats. Coffees start from £3.00.", [{ label: "Open the menu", href: "#menu", primary: true }]) },
    { k: /\b(hi|hiya|hello|hey|salaam|salam|assalam\w*|asalam\w*)\b/i, a: () => botSay("Wa alaikum assalam & hello! 👋 How can we help today?") },
    { k: /(thank|cheers|jazak)/i, a: () => botSay("You're very welcome! Hope to see you at Chaachi's soon 🤍") },
  ];

  const reply = (msg) => {
    const hit = intents.find((i) => i.k.test(msg));
    if (hit) return hit.a();
    return botSay("Good question! I'm only a little helper, so the team can answer that best. Message them on Instagram or send an email enquiry 👇", igActions);
  };

  function showEmailForm(topic = "General enquiry") {
    const f = document.createElement("form"); f.className = "chat-form";
    f.innerHTML = `
      <input name="name" placeholder="Your name" required autocomplete="name" />
      <input name="email" type="email" placeholder="Your email" required autocomplete="email" />
      <textarea name="message" rows="3" placeholder="Your message" required></textarea>
      <button type="submit">Send to Chaachi's</button>`;
    body.appendChild(f); scroll(); f.querySelector("input").focus();
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = { ...Object.fromEntries(new FormData(f)), topic, source: "Chat widget" };
      const btn = f.querySelector("button"); btn.disabled = true; btn.textContent = "Sending…";
      try {
        await sendEnquiry(data);
        f.remove(); add(`<b>Message sent ✓</b>\n${escapeHtml(data.message)}`, "me");
        botSay(`Thank you, ${escapeHtml(data.name.trim().split(/\s+/)[0])}! The team will reply to ${escapeHtml(data.email)} soon. Anything else?`);
      } catch {
        btn.disabled = false; btn.textContent = "Send to Chaachi's";
        const m = mailtoFor(data);
        botSay("Hmm, that didn't send. You can reach the team directly instead:",
          [m ? { label: "Open email", href: m, primary: true } : null, { label: "DM on Instagram", href: CONFIG.INSTAGRAM_DM, primary: !m }].filter(Boolean));
      }
    });
  }

  const QUICK = [["🕒 Hours", "What are your opening hours?"], ["📋 Menu", "Can I see the menu?"], ["📍 Directions", "Where are you?"], ["🎨 Events", "Do you do events?"], ["☪︎ Halal?", "Is the meat halal?"], ["✉️ Email us", "__email"], ["💬 Instagram DM", "__dm"]];
  chips.innerHTML = QUICK.map(([l, q]) => `<button type="button" data-q="${q}">${l}</button>`).join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const q = b.dataset.q;
    if (q === "__email") { add("I'd like to send an email enquiry", "me"); botSay("Of course! Fill this in and it'll be sent to the Chaachi's team:").then(() => showEmailForm()); return; }
    if (q === "__dm") { window.open(CONFIG.INSTAGRAM_DM, "_blank", "noopener"); return; }
    add(q, "me"); reply(q);
  });
  input.addEventListener("submit", (e) => {
    e.preventDefault(); const v = text.value.trim(); if (!v) return;
    add(escapeHtml(v), "me"); text.value = ""; reply(v);
  });

  function toggle(open = chat.hidden) {
    chat.hidden = !open; fab.setAttribute("aria-expanded", open); fab.classList.add("seen");
    if (open && !started) {
      started = true;
      botSay("Assalamu alaikum & welcome to <b>Chaachi's</b> ☕🧁").then(() =>
        botSay(`${openStatus().text}. Ask me about our hours, menu, events or directions, or message the team directly.`, igActions));
    }
    if (open) setTimeout(() => text.focus(), 300);
  }
  fab.addEventListener("click", () => toggle());
  $("#chatClose").addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden) toggle(false); });
}

/* ---------------- Motion ---------------- */
function initMotion() {
  // split hero title into characters
  $$(".split").forEach((el) => {
    const txt = el.textContent; el.textContent = "";
    [...txt].forEach((c, i) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; s.style.transitionDelay = `${0.35 + i * 0.06}s`; el.appendChild(s); });
  });

  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .split, .t-item").forEach((el) => io.observe(el));

  // nav state + active link + parallax + timeline progress
  const nav = $("#nav"), links = $$(".nav__links a[href^='#']"), sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const para = $$(".parallax"), tl = $("#timeline");
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY, vh = window.innerHeight;
    nav.classList.toggle("scrolled", y > 40);
    let current = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top < vh * 0.4) current = s.id; });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
    if (!reduceMotion) para.forEach((el) => { const r = el.getBoundingClientRect(); const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed); el.style.transform = `translate3d(0, ${off}px, 0)`; });
    if (tl) { const r = tl.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height)); tl.style.setProperty("--progress", (p * 100).toFixed(1) + "%"); }
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  // mobile nav
  const burger = $("#burger");
  const setMenu = (o) => {
    nav.classList.toggle("open", o);
    document.body.classList.toggle("nav-open", o);
    burger.setAttribute("aria-expanded", o);
    burger.setAttribute("aria-label", o ? "Close menu" : "Open menu");
    document.body.style.overflow = o ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); burger.focus(); } });
  matchMedia("(min-width: 921px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  if (reduceMotion || !matchMedia("(hover: hover)").matches) return;

  // magnetic buttons
  $$(".magnetic").forEach((b) => {
    b.addEventListener("mousemove", (e) => { const r = b.getBoundingClientRect(); b.style.setProperty("--x", `${(e.clientX - r.left - r.width / 2) * 0.25}px`); b.style.setProperty("--y", `${(e.clientY - r.top - r.height / 2) * 0.35}px`); });
    b.addEventListener("mouseleave", () => { b.style.setProperty("--x", "0px"); b.style.setProperty("--y", "0px"); });
  });
  // 3D tilt cards
  $$(".tilt").forEach((c) => {
    c.addEventListener("mousemove", (e) => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`; });
    c.addEventListener("mouseleave", () => { c.style.transform = ""; });
  });
}

/* ---------------- Gallery drag-to-scroll (mouse) ---------------- */
let galleryDragged = false;
function initGallery() {
  const rail = $("#galleryRail"); let down = false, sx = 0, sl = 0;
  rail.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.button !== 0) return; down = true; galleryDragged = false; sx = e.clientX; sl = rail.scrollLeft; });
  rail.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (!galleryDragged && Math.abs(dx) > 6) { galleryDragged = true; rail.classList.add("dragging"); rail.setPointerCapture(e.pointerId); }
    if (galleryDragged) rail.scrollLeft = sl - dx * 1.3;
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => rail.addEventListener(ev, () => { down = false; rail.classList.remove("dragging"); }));
  rail.addEventListener("dragstart", (e) => e.preventDefault());
}

/* ---------------- Lightbox (gallery + menu boards) ---------------- */
function initLightbox() {
  const lb = $("#lightbox"), img = $("#lbImg"), cap = $("#lbCap");
  let items = [], idx = 0, lastFocus = null;
  const show = (i) => {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    img.src = it.src; img.alt = it.alt; cap.textContent = `${it.caption}  ·  ${idx + 1} / ${items.length}`;
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
  };
  const open = (list, i) => {
    items = list; lastFocus = document.activeElement;
    lb.hidden = false; document.body.style.overflow = "hidden"; show(i); $("#lbClose").focus();
  };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; img.removeAttribute("src"); lastFocus?.focus(); };

  const galleryItems = () => $$("#galleryRail .g-item img").map((el) => ({ src: el.currentSrc || el.src, alt: el.alt, caption: el.alt }));
  $$("#galleryRail .g-item").forEach((fig, i) => {
    fig.tabIndex = 0; fig.setAttribute("role", "button"); fig.setAttribute("aria-label", `View photo: ${fig.querySelector("img").alt}`);
    fig.addEventListener("click", () => { if (galleryDragged) { galleryDragged = false; return; } open(galleryItems(), i); });
    fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(galleryItems(), i); } });
  });
  const boards = $$("[data-lightbox='boards']");
  const boardItems = boards.map((b) => ({ src: b.dataset.src, alt: b.querySelector("img").alt, caption: b.dataset.caption }));
  boards.forEach((b, i) => b.addEventListener("click", () => open(boardItems, i)));

  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(idx - 1));
  $("#lbNext").addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(idx + 1);
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "Tab") { // keep focus inside the dialog
      const f = $$("button", lb); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let tx = 0;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); }, { passive: true });
}

/* ---------------- Video resilience ---------------- */
function initVideo() {
  const vids = [$("#bgVideo"), $("#heroVideo")].filter(Boolean);
  const play = () => vids.forEach((v) => { v.muted = true; v.play().catch(() => {}); });
  play();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) play(); });
  ["touchstart", "click", "scroll"].forEach((ev) => window.addEventListener(ev, play, { once: true, passive: true }));
  // keep the two copies in step so the hero and background feel like one film
  const [bg, hero] = vids;
  if (bg && hero) setInterval(() => { if (!bg.paused && !hero.paused && Math.abs(bg.currentTime - hero.currentTime) > 0.35) bg.currentTime = hero.currentTime; }, 3000);
}

/* ---------------- Boot ---------------- */
document.body.classList.add("is-loading");
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderMenu(); renderInstagram(); renderReviews(); renderStatus(); setInterval(renderStatus, 60000);
  initContactForm(); initChat(); initMotion(); initGallery(); initLightbox(); initVideo();
});
window.addEventListener("load", () => {
  setTimeout(() => { $("#loader").classList.add("done"); document.body.classList.remove("is-loading"); }, reduceMotion ? 0 : 900);
});
// never trap visitors behind the loader
setTimeout(() => { $("#loader")?.classList.add("done"); document.body.classList.remove("is-loading"); }, 4500);

/* ===== EDIT YOUR DETAILS HERE (used by nav, footer, contact) ===== */
const SITE = {
  name: "Agashya B",
  email: "agashyabalakrishnan@gmail.com",
  pages: [["Home","index.html"],["About","about.html"],["Skills","skills.html"],
          ["Projects","projects.html"],["Certifications","certifications.html"],["Contact","contact.html"]]
};

/* ===== Navigation + footer (shared on every page) ===== */
const current = document.body.dataset.page;
const links = SITE.pages.map(([t,h]) =>
  `<li><a href="${h}" class="${h.startsWith(current)?'active':''}">${t}</a></li>`).join("");
document.body.insertAdjacentHTML("afterbegin",
  `<header class="nav"><div class="wrap">
     <a class="logo grad-text" href="index.html">${SITE.name}</a>
     <button class="burger" aria-label="Menu"><span></span><span></span><span></span></button>
     <ul>${links}</ul></div></header>`);
document.body.insertAdjacentHTML("beforeend",
  `<footer><div class="wrap"><span>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span>
     <nav>${SITE.pages.slice(0,6).map(([t,h])=>`<a href="${h}">${t}</a>`).join("")}</nav></div></footer>`);

/* Hamburger menu */
const burger = document.querySelector(".burger"), menu = document.querySelector(".nav ul");
burger.onclick = () => { burger.classList.toggle("open"); menu.classList.toggle("open"); };

/* Page transition: fade in on load, fade out when clicking internal links */
requestAnimationFrame(() => document.body.classList.add("ready"));
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || a.target || /^(mailto|tel|http|#)/.test(a.getAttribute("href"))) return;
  e.preventDefault(); document.body.classList.add("leaving");
  setTimeout(() => location.href = a.href, 350);
});
window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

/* Scroll reveal + skill bar fill (Intersection Observer) */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add("show");
  en.target.querySelectorAll(".bar i").forEach(b => b.style.width = b.dataset.level + "%");
  io.unobserve(en.target);
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach((el,i) => { el.style.transitionDelay = (i%4)*80 + "ms"; io.observe(el); });

/* Typing effect: words come from data-words on #typing */
const t = document.getElementById("typing");
if (t) {
  const words = t.dataset.words.split("|"); let w = 0, c = 0, del = false;
  (function tick(){
    const word = words[w];
    t.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; w = (w+1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 45 : 90);
  })();
}

/* Profile photo fallback: shows initials if assets/profile.jpg is missing */
const img = document.querySelector(".photo img");
if (img) img.onerror = () => {
  img.onerror = null;
  img.src = "data:image/svg+xml;utf8," + encodeURIComponent(
   `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='#111'/><text x='100' y='118' font-size='72' text-anchor='middle' fill='#8b5cf6' font-family='sans-serif'>AB</text></svg>`);
};

/* Contact form: opens the visitor's email app (no backend needed) */
const form = document.getElementById("contact-form");
if (form) form.onsubmit = e => {
  e.preventDefault();
  const d = new FormData(form);
  const body = encodeURIComponent(`${d.get("message")}\n\n— ${d.get("name")} (${d.get("email")})`);
  location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(d.get("subject")||"Portfolio enquiry")}&body=${body}`;
  document.querySelector(".note").textContent = "Opening your email app…";
};
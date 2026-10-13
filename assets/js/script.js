/* ==========================================================================
   DAVIYA ELDERLY CARE HOMES — site behaviour
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONTACT SETTINGS  (edit these three values — the whole site updates)
   --------------------------------------------------------------------------
   phone     : digits with country code, no spaces or "+", e.g. "919876543210"
   whatsapp  : same format (can be the same number)
   email     : e.g. "care@yourdomain.com"
   Leave a value as "" and the matching buttons/links stay hidden.            */
const DAVIYA = {
  phone: "",
  whatsapp: "",
  email: ""
};

(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Format "919876543210" as "+91 98765 43210" ---------- */
  function pretty(num) {
    const d = String(num).replace(/\D/g, "");
    if (d.length === 12 && d.startsWith("91")) return "+91 " + d.slice(2, 7) + " " + d.slice(7);
    return "+" + d;
  }

  /* ---------- 2. Wire up contact links from settings ---------- */
  function applyContact() {
    const has = {
      phone: !!DAVIYA.phone,
      whatsapp: !!DAVIYA.whatsapp,
      email: !!DAVIYA.email
    };
    $$("[data-dv-need]").forEach(el => { el.hidden = !has[el.dataset.dvNeed]; });

    if (has.phone) {
      $$("[data-dv-tel]").forEach(a => a.setAttribute("href", "tel:+" + DAVIYA.phone.replace(/\D/g, "")));
      $$("[data-dv-phone-text]").forEach(a => (a.textContent = pretty(DAVIYA.phone)));
    }
    if (has.whatsapp) {
      $$("[data-dv-wa]").forEach(a =>
        a.setAttribute("href", "https://wa.me/" + DAVIYA.whatsapp.replace(/\D/g, "") +
          "?text=" + encodeURIComponent("Hello Daviya, I would like to know more about your elderly care homes.")));
      $$("[data-dv-wa-text]").forEach(a => (a.textContent = pretty(DAVIYA.whatsapp)));
    }
    if (has.email) {
      $$("[data-dv-mail]").forEach(a => a.setAttribute("href", "mailto:" + DAVIYA.email));
      $$("[data-dv-email-text]").forEach(a => (a.textContent = DAVIYA.email));
    }
  }

  /* ---------- 3. Sticky header state + back-to-top ---------- */
  const header = $(".daviya-header");
  const toTop = $("#toTop");
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 4. Close mobile menu / mega menu after choosing a link ---------- */
  const collapseEl = $("#daviyaNavigation");
  function closeMenus() {
    if (!window.bootstrap) return;
    const dd = $("#daviyaServicesToggle");
    if (dd) { const inst = bootstrap.Dropdown.getInstance(dd); if (inst) inst.hide(); }
    if (collapseEl && collapseEl.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
    }
  }
  $$(".daviya-navigation a[href^='#'], .daviya-topbar a[href^='#']").forEach(a => a.addEventListener("click", closeMenus));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenus(); });
  // click outside the open mega menu closes it on desktop
  document.addEventListener("click", e => {
    if (!e.target.closest(".daviya-mega-parent")) {
      const dd = $("#daviyaServicesToggle");
      if (dd && window.bootstrap) { const inst = bootstrap.Dropdown.getInstance(dd); if (inst) inst.hide(); }
    }
  });

  /* ---------- 5. Highlight the nav link of the section in view ---------- */
  const spyMap = {
    home: "#home", about: "#about", "daviya-services": "#daviya-services",
    day: "#day", homes: "#homes", faq: "#faq", "daviya-contact": "#daviya-contact"
  };
  const navLinks = $$(".daviya-nav-list > .nav-item > a.daviya-nav-link");
  function setActive(id) {
    // Services section highlights nothing in the list (it is a dropdown); keep Home/About etc. exact
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(spyMap).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- 6. Care guide ---------- */
  const guideForm = $("#guideForm");
  const guideResult = $("#guideResult");
  const guideError = $("#guideError");
  let guideNotes = "";

  if (guideForm) {
    guideForm.addEventListener("submit", e => {
      e.preventDefault();
      const v = n => { const c = guideForm.querySelector('input[name="' + n + '"]:checked'); return c ? Number(c.value) : null; };
      const a = { daily: v("daily"), meds: v("meds"), mobility: v("mobility"), food: v("food"), social: v("social") };
      if (Object.values(a).some(x => x === null)) { guideError.hidden = false; return; }
      guideError.hidden = true;

      const label = {
        daily:   ["manages alone", "needs some help", "needs help every day"],
        meds:    ["takes medicines alone", "needs reminders", "needs medicines administered"],
        mobility:["walks independently", "uses a stick or walker, some fall risk", "needs help to move"],
        food:    ["no dietary restrictions", "specific diet", "soft or special diet"],
        social:  ["active and social", "quiet and often alone"]
      };

      const picks = [];
      if (a.daily > 0)    picks.push(["bi-person-hearts", "Daily activity assistance", "#svc-daily", "Help with bathing, grooming and dressing."]);
      if (a.meds > 0)     picks.push(["bi-capsule", "Medication management", "#svc-medical", "Experienced staff handle reminders and administration in a controlled manner."]);
      if (a.mobility > 0) picks.push(["bi-person-walking", "Mobility assistance and physiotherapy", "#svc-mobility", "Support with moving around and regular exercise sessions to reduce fall risk."]);
      if (a.food > 0)     picks.push(["bi-egg-fried", "Dietitian-planned meals", "#svc-meals", "Meals planned around health requirements and restrictions."]);
      if (a.social === 1 || a.daily + a.meds + a.mobility + a.food === 0)
                          picks.push(["bi-flower1", "Yoga, meditation and recreation", "#svc-yoga", "Gentle daily activities and company in a small, warm community."]);
      picks.push(["bi-heart-pulse", "24×7 medical support", "#svc-medical", "Nurses round the clock and doctors on call, included for every resident."]);
      picks.push(["bi-house-heart", "Comfortable, senior-friendly living", "#svc-living", "Furnished rooms, anti-skid washrooms and in-house laundry."]);

      const total = a.daily + a.meds + a.mobility + a.food;
      const level = total <= 2 ? "light" : total <= 5 ? "moderate" : "high";
      const levelText = {
        light: "Your parent seems fairly independent. A Daviya home can add safety, nutrition and company.",
        moderate: "Your parent would benefit from regular daily support alongside medical oversight.",
        high: "Your parent would benefit from close, round-the-clock support. A small home like Daviya is built for this."
      }[level];

      // de-duplicate by title
      const seen = new Set();
      const uniq = picks.filter(p => !seen.has(p[1]) && seen.add(p[1]));

      guideNotes =
        "Care needs noted from the Daviya care guide:\n" +
        "- Daily routines: " + label.daily[a.daily] + "\n" +
        "- Medicines: " + label.meds[a.meds] + "\n" +
        "- Moving around: " + label.mobility[a.mobility] + "\n" +
        "- Food: " + label.food[a.food] + "\n" +
        "- Day to day: " + label.social[a.social];

      guideResult.innerHTML =
        "<h3>Suggested support</h3><p>" + levelText + "</p><ul>" +
        uniq.map(p => '<li><i class="bi ' + p[0] + '"></i><a class="dv-inline" href="' + p[2] + '">' + p[1] + "</a>. " + p[3] + "</li>").join("") +
        '</ul><button type="button" class="dv-btn dv-btn--green" id="useNotes">Add these answers to my enquiry <i class="bi bi-arrow-down"></i></button>';
      guideResult.classList.add("is-open");
      guideResult.scrollIntoView({ behavior: "smooth", block: "nearest" });

      $("#useNotes").addEventListener("click", () => {
        const msg = $("#fMsg");
        if (msg) {
          msg.value = (msg.value.trim() ? msg.value.trim() + "\n\n" : "") + guideNotes;
        }
        const target = $("#daviya-contact");
        if (target) target.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => { const n = $("#fName"); if (n) n.focus({ preventScroll: true }); }, 700);
      });
    });
    guideForm.addEventListener("change", () => { guideError.hidden = true; });
  }

  /* ---------- 7. Enquiry form ---------- */
  const form = $("#enquiryForm");
  const status = $("#formStatus");

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = "dv-form-status is-open " + (type === "ok" ? "is-ok" : "is-error");
  }

  function validate() {
    let ok = true;
    const name = $("#fName"), phone = $("#fPhone"), email = $("#fEmail");
    const set = (el, bad) => { el.classList.toggle("is-invalid", bad); if (bad) ok = false; };
    set(name, name.value.trim().length < 2);
    set(phone, !/^[+\d][\d\s\-]{7,15}$/.test(phone.value.trim()));
    set(email, email.value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
    if (!ok) { const first = $(".is-invalid", form); if (first) first.focus(); }
    return ok;
  }

  function buildMessage() {
    const f = id => ($("#" + id).value || "").trim();
    const lines = [
      "Hello Daviya, I would like to enquire about elderly care.",
      "",
      "Name: " + f("fName"),
      "Phone: " + f("fPhone")
    ];
    if (f("fEmail")) lines.push("Email: " + f("fEmail"));
    if (f("fCity"))  lines.push("Location: " + f("fCity"));
    if (f("fFor"))   lines.push("Care is for: " + f("fFor"));
    if (f("fMsg"))   lines.push("", f("fMsg"));
    return lines.join("\n");
  }

  if (form) {
    $$("input, textarea, select", form).forEach(el =>
      el.addEventListener("input", () => el.classList.remove("is-invalid")));

    $$("[data-send]", form).forEach(btn => btn.addEventListener("click", () => {
      status.className = "dv-form-status";
      if (!validate()) return;
      const channel = btn.dataset.send;
      const text = buildMessage();

      if (channel === "whatsapp") {
        if (!DAVIYA.whatsapp) { showStatus("WhatsApp is not set up yet. Please use the email option or call us.", "error"); return; }
        window.open("https://wa.me/" + DAVIYA.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        showStatus("Opening WhatsApp. Press send there to deliver your enquiry.", "ok");
      } else {
        if (!DAVIYA.email) { showStatus("Email is not set up yet. Please use WhatsApp or call us.", "error"); return; }
        window.location.href = "mailto:" + DAVIYA.email +
          "?subject=" + encodeURIComponent("Enquiry from " + $("#fName").value.trim()) +
          "&body=" + encodeURIComponent(text);
        showStatus("Opening your email app. Press send there to deliver your enquiry.", "ok");
      }
    }));
  }

  /* ---------- 8. Footer year + init ---------- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
  applyContact();
})();

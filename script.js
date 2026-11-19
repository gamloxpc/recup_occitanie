// ========== Menu mobile ==========
(function () {
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (!burger || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }

  burger.addEventListener("click", function () {
    setOpen(burger.getAttribute("aria-expanded") !== "true");
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setOpen(false); });
  });
})();

// ========== Ombre du header au scroll ==========
(function () {
  var header = document.getElementById("header");
  if (!header) return;
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ========== Apparition au scroll + compteurs ==========
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function format(n) {
    return n.toLocaleString("fr-FR");
  }

  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = format(target) + suffix; return; }
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var items = document.querySelectorAll(".reveal");
  var counters = document.querySelectorAll("[data-count]");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
    counters.forEach(animateCount);
    return;
  }

  var revealObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { revealObs.observe(el); });

  var countObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { countObs.observe(el); });
})();

// ========== Année du pied de page ==========
(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// ========== Bandeau cookies ==========
(function () {
  var banner = document.getElementById("cookies");
  var btn = document.getElementById("cookies-accept");
  if (!banner || !btn) return;

  var accepted = false;
  try { accepted = localStorage.getItem("cookies-ok") === "1"; } catch (e) {}
  if (!accepted) banner.hidden = false;

  btn.addEventListener("click", function () {
    try { localStorage.setItem("cookies-ok", "1"); } catch (e) {}
    banner.hidden = true;
  });
})();
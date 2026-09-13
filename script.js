const hero = document.querySelector(".hero");
const parallaxItems = document.querySelectorAll("[data-depth]");
const revealItems = document.querySelectorAll(".intro-band, .section-heading, .feature-card, .phone-shell, .offline-copy, .download");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const header = document.querySelector(".site-header");
const featureCards = [...document.querySelectorAll(".feature-card")];
const sectionBridges = document.querySelectorAll(".section-bridge");

let parallaxFrame = 0;
let pointerFrame = 0;
let lastPointer = { x: 0, y: 0 };
let stackFrame = 0;

function updateHeader() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function updateFeatureStack() {
  stackFrame = 0;
  if (prefersReducedMotion.matches || !featureCards.length) return;

  const stickyTop = window.innerWidth <= 620 ? 74 : window.innerWidth <= 940 ? 82 : Math.min(148, Math.max(96, window.innerHeight * 0.14));
  const focusLine = stickyTop + 120;

  featureCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.max(0, Math.min(1, (focusLine - rect.top) / Math.max(rect.height, 1)));
    card.style.setProperty("--stack-index", index + 1);
    card.style.setProperty("--stack-scale", `${1 - distance * 0.035}`);
    card.style.setProperty("--stack-lift", `${-distance * 5}px`);
    card.classList.toggle("stack-active", rect.top <= focusLine && rect.bottom > stickyTop);
  });
}

function requestFeatureStackUpdate() {
  if (!stackFrame) stackFrame = requestAnimationFrame(updateFeatureStack);
}

function updateHeader() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function updateParallax() {
  parallaxFrame = 0;
  if (!hero || prefersReducedMotion.matches) return;

  const scrollProgress = Math.min(window.scrollY / hero.offsetHeight, 1);
  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.depth);
    item.style.setProperty("--scroll-shift", `${scrollProgress * depth * -180}px`);
  });
}

function requestParallaxUpdate() {
  if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
}

function updatePointerParallax() {
  pointerFrame = 0;
  if (!hero || prefersReducedMotion.matches) return;

  const rect = hero.getBoundingClientRect();
  const pointerX = (lastPointer.x - rect.left) / rect.width - 0.5;
  const pointerY = (lastPointer.y - rect.top) / rect.height - 0.5;
  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.depth);
    item.style.setProperty("--pointer-x", `${pointerX * depth * 72}px`);
    item.style.setProperty("--pointer-y", `${pointerY * depth * 72}px`);
  });
}

if (!prefersReducedMotion.matches) {
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("pointermove", (event) => {
    lastPointer = { x: event.clientX, y: event.clientY };
    if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointerParallax);
  }, { passive: true });
  requestParallaxUpdate();
}
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("scroll", requestFeatureStackUpdate, { passive: true });
window.addEventListener("resize", requestFeatureStackUpdate, { passive: true });
updateHeader();
requestFeatureStackUpdate();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

const bridgeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        bridgeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: "0px 0px -12% 0px" }
);

sectionBridges.forEach((bridge) => bridgeObserver.observe(bridge));

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  if (item.classList.contains("feature-card")) {
    item.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
    item.style.transitionDelay = "var(--reveal-delay)";
  }
  revealObserver.observe(item);
});

if (finePointer.matches && !prefersReducedMotion.matches) {
  const cursor = document.createElement("span");
  cursor.className = "cursor-dot";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);

  window.addEventListener("pointermove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  }, { passive: true });

  document.querySelectorAll("a, .feature-card").forEach((interactive) => {
    interactive.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
    interactive.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });

  document.querySelectorAll(".primary-button, .store-button").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const rect = button.getBoundingClientRect();
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.append(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });
}

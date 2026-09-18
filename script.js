const hero = document.querySelector(".hero");
const parallaxItems = document.querySelectorAll("[data-depth]");
const revealItems = document.querySelectorAll(".intro-band > *, .section-heading, .feature-card, .phone-shell, .download > *");
const stackPanels = document.querySelectorAll(".stack-panel");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateParallax() {
  if (!hero || prefersReducedMotion.matches) {
    return;
  }

  const scrollProgress = Math.min(window.scrollY / hero.offsetHeight, 1);

  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.depth);
    item.style.setProperty("--scroll-shift", `${scrollProgress * depth * -180}px`);
  });
}

if (!prefersReducedMotion.matches) {
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (!hero) {
      return;
    }

    const rect = hero.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5;

    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.depth);
      item.style.setProperty("--pointer-x", `${pointerX * depth * 72}px`);
      item.style.setProperty("--pointer-y", `${pointerY * depth * 72}px`);
    });
  });

  updateParallax();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  revealObserver.observe(item);
});

if (!prefersReducedMotion.matches) {
  const stackObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-stacked");
          stackObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  stackPanels.forEach((panel) => {
    panel.classList.add("stack-ready");
    stackObserver.observe(panel);
  });
}

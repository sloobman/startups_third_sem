const hero = document.querySelector(".hero");
const parallaxItems = document.querySelectorAll("[data-depth]");
const revealItems = document.querySelectorAll(".intro-band > *, .section-heading, .feature-card, .phone-shell, .download > *");
const stackPanels = document.querySelectorAll(".stack-panel");
const cookieBanner = document.querySelector(".cookie-banner");
const cookieButtons = document.querySelectorAll("[data-cookie-choice]");
const cookieSettingsButton = document.querySelector(".cookie-settings");

const COOKIE_CONSENT_KEY = "holdit-cookie-consent";
const METRIKA_ID = 113058718;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function loadMetrika() {
  if (window.ym) {
    return;
  }

  window.ym = function () {
    window.ym.a = window.ym.a || [];
    window.ym.a.push(arguments);
  };
  window.ym.l = Date.now();

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;
  document.head.append(script);

  window.ym(METRIKA_ID, "init", {
    accurateTrackBounce: true,
    clickmap: true,
    referrer: document.referrer,
    ssr: true,
    trackLinks: true,
    url: location.href,
    webvisor: true,
  });
}

function getCookieConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return null;
  }
}

function saveCookieConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {}
}

function closeCookieBanner() {
  if (!cookieBanner) {
    return;
  }

  cookieBanner.classList.add("is-closing");
  window.setTimeout(() => {
    cookieBanner.hidden = true;
    cookieBanner.classList.remove("is-closing");
    cookieSettingsButton?.removeAttribute("hidden");
  }, 220);
}

function openCookieBanner() {
  if (!cookieBanner) {
    return;
  }

  cookieSettingsButton?.setAttribute("hidden", "");
  cookieBanner.classList.remove("is-closing");
  cookieBanner.hidden = false;
  cookieBanner.querySelector("button")?.focus();
}

const cookieConsent = getCookieConsent();

if (cookieConsent === "all") {
  loadMetrika();
}

if (cookieConsent) {
  cookieSettingsButton?.removeAttribute("hidden");
} else if (cookieBanner) {
  openCookieBanner();
}

cookieButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.dataset.cookieChoice;
    saveCookieConsent(choice);

    if (choice === "all") {
      loadMetrika();
    }

    closeCookieBanner();
  });
});

cookieSettingsButton?.addEventListener("click", openCookieBanner);

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

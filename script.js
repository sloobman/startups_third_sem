const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".signal-band, .section-heading, .feature-card, .workflow-copy, .workflow-steps article, .use-cases, .phone-shell, .offline-copy, .access-copy, .access-card");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const caseContent = {
  founders: {
    label: "Основатели и продуктовые команды",
    title: "Собирайте ресерч рынка, заметки о конкурентах и статьи по росту в одном архиве.",
    bullets: [
      "Быстро возвращайтесь к фактам перед питчем.",
      "Храните customer discovery, PDF и посты без потери контекста.",
      "Делайте подборки под гипотезы, сегменты и фичи."
    ]
  },
  students: {
    label: "Студенты и исследователи",
    title: "Превращайте учебные материалы, статьи и PDF в библиотеку, которая работает без интернета.",
    bullets: [
      "Читайте сохраненные источники в дороге и между парами.",
      "Отмечайте ключевые мысли прямо в материале.",
      "Находите нужные фрагменты перед экзаменом или защитой."
    ]
  },
  creators: {
    label: "Авторы, редакторы и маркетологи",
    title: "Собирайте референсы, идеи для контента и сильные формулировки без хаоса в закладках.",
    bullets: [
      "Держите источники для статей и сценариев в одном месте.",
      "Возвращайтесь к сохраненным инсайтам через поиск.",
      "Разделяйте подборки по проектам, рубрикам и клиентам."
    ]
  }
};

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-count]").forEach((counter) => {
  const target = Number(counter.dataset.count);
  if (!Number.isFinite(target) || prefersReducedMotion.matches) {
    counter.textContent = String(target);
    return;
  }

  let startTime = 0;
  const duration = 900;
  const tick = (time) => {
    if (!startTime) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    counter.textContent = String(Math.round(target * progress));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

const casePanel = document.querySelector("[data-case-panel]");
document.querySelectorAll("[data-case]").forEach((button) => {
  button.addEventListener("click", () => {
    const content = caseContent[button.dataset.case];
    if (!casePanel || !content) return;

    document.querySelectorAll("[data-case]").forEach((tab) => tab.classList.remove("is-active"));
    button.classList.add("is-active");
    casePanel.innerHTML = `
      <p class="case-label">${content.label}</p>
      <h3>${content.title}</h3>
      <ul>${content.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
  });
});

if (finePointer.matches && !prefersReducedMotion.matches) {
  document.querySelectorAll("[data-tilt]").forEach((panel) => {
    panel.addEventListener("pointermove", (event) => {
      const rect = panel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      panel.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-4px)`;
    });

    panel.addEventListener("pointerleave", () => {
      panel.style.transform = "";
    });
  });

  document.querySelectorAll(".primary-button").forEach((button) => {
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

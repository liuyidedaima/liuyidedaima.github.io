const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const revealTargets = document.querySelectorAll(
  ".feature-card, .story-card, .timeline-item, .page-card, .expansion-card, .fact-card, .policy-card, .source-item, .hero-copy, .hero-panel"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealTargets.forEach((target, index) => {
  target.style.opacity = "0";
  target.style.transform = "translateY(28px)";
  target.style.transition = `opacity 600ms ease ${index * 35}ms, transform 600ms ease ${index * 35}ms`;
  revealObserver.observe(target);
});

document.addEventListener("scroll", () => {
  const visible = window.scrollY > 480;
  scrollTopBtn.style.opacity = visible ? "1" : "0.6";
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".is-visible").forEach((node) => {
    node.style.opacity = "1";
    node.style.transform = "translateY(0)";
  });
});

const style = document.createElement("style");
style.textContent = `
  .is-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

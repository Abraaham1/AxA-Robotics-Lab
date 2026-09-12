document.addEventListener('DOMContentLoaded', () => {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  if (statValues.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (el) => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const startTime = performance.now();

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach((el) => observer.observe(el));
});

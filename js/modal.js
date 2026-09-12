/* ==========================================================================
   Project detail modal
   Each .project-card carries data-* attributes describing its content.
   Clicking a card reads those attributes, fills the modal, and opens it.
   The carousel inside the modal is driven separately by carousel.js,
   which reads the same card's media list.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal-close');
  const titleEl = overlay.querySelector('[data-modal-title]');
  const statusEl = overlay.querySelector('[data-modal-status]');
  const descEl = overlay.querySelector('[data-modal-description]');
  const tagsEl = overlay.querySelector('[data-modal-tags]');

  let lastFocusedElement = null;

  const openModal = (card) => {
    lastFocusedElement = document.activeElement;

    titleEl.textContent = card.dataset.title;
    descEl.textContent = card.dataset.description;

    statusEl.textContent = card.dataset.statusLabel;
    statusEl.className = 'status status--' + card.dataset.status;

    tagsEl.innerHTML = '';
    (card.dataset.tags || '').split(',').forEach((tag) => {
      if (!tag.trim()) return;
      const span = document.createElement('span');
      span.textContent = tag.trim();
      tagsEl.appendChild(span);
    });

    // Build the media list for the carousel from this card's data-media attribute
    // (a comma-separated list of "type:src" pairs, e.g. "video:images/projects/x.mp4,image:images/projects/y.jpg")
    const mediaList = (card.dataset.media || '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [type, src] = entry.split(':');
        return { type, src: src ? src.trim() : '' };
      });

    window.dispatchEvent(new CustomEvent('carousel:load', { detail: mediaList }));

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('carousel:stop'));
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Basic focus trap while modal is open
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
});

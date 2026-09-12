document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const dotsWrap = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');

  if (!track) return;

  let slides = [];
  let currentIndex = 0;

  const renderSlide = (index) => {
    track.querySelectorAll('.carousel-slide').forEach((el, i) => {
      el.classList.toggle('is-active', i === index);
      const video = el.querySelector('video');
      if (video) {
        if (i === index) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });

    if (dotsWrap) {
      dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    }

    currentIndex = index;
  };

  const buildCarousel = (mediaList) => {
    track.innerHTML = '';
    if (dotsWrap) dotsWrap.innerHTML = '';
    slides = mediaList;

    // Single-image media (e.g. the research roadmap models) doesn't need
    // dots or arrows — those only appear when there's more than one slide.
    const showControls = mediaList.length > 1;
    if (dotsWrap) dotsWrap.style.display = showControls ? '' : 'none';
    if (prevBtn) prevBtn.style.display = showControls ? '' : 'none';
    if (nextBtn) nextBtn.style.display = showControls ? '' : 'none';

    mediaList.forEach((item, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';

      if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('aria-label', 'Project demo clip');
        slide.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = 'Project screenshot';
        slide.appendChild(img);
      }

      track.appendChild(slide);

      if (dotsWrap) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => renderSlide(i));
        dotsWrap.appendChild(dot);
      }
    });

    renderSlide(0);
  };

  window.addEventListener('carousel:load', (e) => {
    buildCarousel(e.detail);
  });

  window.addEventListener('carousel:stop', () => {
    track.querySelectorAll('video').forEach((v) => v.pause());
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (slides.length === 0) return;
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlide(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (slides.length === 0) return;
      const newIndex = (currentIndex + 1) % slides.length;
      renderSlide(newIndex);
    });
  }
});

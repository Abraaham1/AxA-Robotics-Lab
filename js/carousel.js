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

    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });

    currentIndex = index;
  };

  const buildCarousel = (mediaList) => {
    track.innerHTML = '';
    dotsWrap.innerHTML = '';
    slides = mediaList;

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

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => renderSlide(i));
      dotsWrap.appendChild(dot);
    });

    renderSlide(0);
  };

  window.addEventListener('carousel:load', (e) => {
    buildCarousel(e.detail);
  });

  window.addEventListener('carousel:stop', () => {
    track.querySelectorAll('video').forEach((v) => v.pause());
  });

  prevBtn.addEventListener('click', () => {
    if (slides.length === 0) return;
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    renderSlide(newIndex);
  });

  nextBtn.addEventListener('click', () => {
    if (slides.length === 0) return;
    const newIndex = (currentIndex + 1) % slides.length;
    renderSlide(newIndex);
  });
});

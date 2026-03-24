

const videosLazy = document.querySelectorAll('[data-lazy-video]');

const io = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const video = entry.target;
    const sources = video.querySelectorAll('source');

    sources.forEach(source => {
      source.src = source.dataset.src;
    });

    video.load();
    video.play().catch(() => {});

    observer.unobserve(video);
  });
}, {
  rootMargin: '1000px'
});

videosLazy.forEach(video => io.observe(video));


const joyItems = document.querySelectorAll('.home-joy__item');

if (joyItems.length) {
  joyItems.forEach(item => {
    const images = item.querySelectorAll('img');
    if (images.length === 0) return;

    let currentIndex = 0;

    // 👉 настройки
    const delay = parseInt(item.dataset.delay) || 2500;
    const duration = parseInt(item.dataset.duration) || 500;

    // 👉 применяем duration к transition
    images.forEach(img => {
      img.style.transitionDuration = `${duration}ms`;
    });

    // 👉 начальное состояние
    images.forEach(img => img.classList.remove('_active'));
    images[0].classList.add('_active');

    // 👉 если 1 картинка — не крутим
    if (images.length < 2) return;

    // 👉 слайдер
    setInterval(() => {
      images[currentIndex].classList.remove('_active');

      currentIndex++;
      if (currentIndex >= images.length) currentIndex = 0;

      images[currentIndex].classList.add('_active');

    }, delay);
  });
}
import "./video.scss"

const homeVideo = document.querySelectorAll('[data-fls-video]');

if (homeVideo.length > 0) {
  homeVideo.forEach(block => {
    const btn = block.querySelector('[data-fls-video-btn]');
    const previewVideo = block.querySelector('[data-lazy-video]');
    const mainVideo = block.querySelector('[data-fls-video-main] video');
  
    let mainLoaded = false;
  
    // 👉 lazy load main video (отдельно от preview)
    const loadMainVideo = () => {
      if (mainLoaded) return;
  
      const sources = mainVideo.querySelectorAll('source');
      sources.forEach(source => {
        source.src = source.dataset.src;
      });
  
      mainVideo.load();
      mainLoaded = true;
    };
  
    // 👉 IntersectionObserver для main video
    const ioMain = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
  
        loadMainVideo();
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '1000px'
    });
  
    ioMain.observe(block);
  
    // 👉 click play
   btn.addEventListener('click', () => {
      // подгружаем если вдруг не успело
      loadMainVideo();
      
      // добавляем класс
      block.classList.add('--play');
      
      // стоп preview
      if (previewVideo) {
        previewVideo.pause();
      }
    
      // 👉 включаем звук и ставим громкость
      mainVideo.muted = false;
      mainVideo.volume = 0.3;
    
      // старт main
      mainVideo.play().catch(() => {});
    });
  });
}
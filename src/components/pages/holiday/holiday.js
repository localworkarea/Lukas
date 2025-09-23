import { addTouchAttr, addLoadedAttr, isMobile, FLS } from "@js/common/functions.js"

import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

addLoadedAttr();

// === GSAP ==========================

document.addEventListener("DOMContentLoaded", () => {

  ScrollTrigger.refresh();

  const blockEl = document.querySelectorAll('[data-anim-block]');
  const watchEl = document.querySelectorAll('[data-anim-watch]');
  // const starsEl = document.querySelectorAll('[data-stars]');
  const deerParent = document.querySelector('.holiday-gifts__picture');
  const deerImg = document.querySelector('.holiday-gifts__picture img');


	// фукнция для создания анимации
	function createGsapAnim() {
   
		// удаляем тригеры после срабатывания фунции (поворота экрана...)
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    blockEl.forEach((section) => {
      gsap.to(section, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",  
          end: "bottom top",  
          scrub: 2
        }
      });
    });

    watchEl.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: "top 80%", 
        onEnter: () => element.classList.add('--view'),
        onLeaveBack: () => element.classList.remove('--view'),
      });
    });

    

    // для очищения стилей gsap при повороте для элементов, которым не нужно больше
    gsap.set([deerImg], { clearProps: "all" }); 
    
    
    let mm = gsap.matchMedia();
    mm.add({
      min820: "(min-width: 821px)",
      max820: "(max-width: 820px)",
    }, (context) => {
      
      let { min820, max820  } = context.conditions;
      
      if (min820) {
        
        gsap.to(deerParent, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: deerParent,
            start: "top center",
            end: " bottom 60%",
            scrub: 2,
          }
        });
        
        gsap.to(deerImg, {
          xPercent: -150,
          yPercent: 70,
          scrollTrigger: {
            trigger: deerParent,
            start: 'top center',
            end: 'bottom top',
            scrub: 2
          }
        });

      }



      
      if (max820) {

       gsap.to(deerParent, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: deerParent,
            start: "top 80%",
            end: " bottom 30%",
            scrub: 2,
          }
        });
 

        gsap.to(deerImg, {
          xPercent: -100,
          // yPercent: 30,
          scrollTrigger: {
            trigger: deerParent,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 2
          }
        });
        
      }

    }); 
    
  };

  createGsapAnim();
  


  
  // == DATA-STARS ==========================================
  
  const SVG_WIDTH = 1440;
  const SVG_HEIGHT = 738;
  const ORIGINAL_STAR_SIZE = 46; 
  
  const starContainers = document.querySelectorAll('[data-stars]');
  
  const stars = [
    { cx: 1046.5, cy: 0.0, r: 0.67 },
    { cx: 1134.1, cy: 0.0, r: 1.42 },
    { cx: 229.5, cy: 4.1, r: 1.79 },
    { cx: 501.3, cy: 5.5, r: 0.8 },
    { cx: 341.8, cy: 5.9, r: 0.78 },
    { cx: 619.3, cy: 9.1, r: 0.83 },
    { cx: 1009.0, cy: 15.4, r: 0.81 },
    { cx: 45.0, cy: 19.4, r: 0.83 },
    { cx: 548.9, cy: 19.7, r: 0.81 },
    { cx: 1233.7, cy: 24.0, r: 0.73 },
    { cx: 1383.8, cy: 32.7, r: 0.78 },
    { cx: 944.4, cy: 49.9, r: 0.85 },
    { cx: 429.3, cy: 56.4, r: 2.04 },
    { cx: 770.5, cy: 59.0, r: 2.01 },
    { cx: 1296.1, cy: 60.8, r: 2.49 },
    { cx: 977.4, cy: 63.8, r: 1.34 },
    { cx: 307.6, cy: 65.9, r: 0.81 },
    { cx: 372.6, cy: 72.9, r: 0.85 },
    { cx: 156.2, cy: 73.5, r: 2.08 },
    { cx: 70.7, cy: 88.6, r: 1.42 },
    { cx: 1439.9, cy: 103.5, r: 0.96 },
    { cx: 1011.3, cy: 113.7, r: 1.39 },
    { cx: 621.5, cy: 120.0, r: 0.8 },
    { cx: 1145.4, cy: 125.2, r: 0.83 },
    { cx: 1384.5, cy: 127.0, r: 0.83 },
    { cx: 908.6, cy: 127.1, r: 2.31 },
    { cx: 92.7, cy: 132.7, r: 0.8 },
    { cx: 478.9, cy: 134.1, r: 0.8 },
    { cx: 1202.0, cy: 135.1, r: 0.83 },
    { cx: 1102.5, cy: 135.3, r: 1.82 },
    { cx: 543.5, cy: 136.3, r: 0.8 },
    { cx: 500.1, cy: 139.6, r: 0.8 },
    { cx: 77.3, cy: 142.4, r: 0.8 },
    { cx: 188.5, cy: 149.3, r: 0.78 },
    { cx: 447.5, cy: 150.0, r: 0.8 },
    { cx: 1067.4, cy: 150.3, r: 1.46 },
    { cx: 96.8, cy: 153.3, r: 1.42 },
    { cx: 1438.9, cy: 156.8, r: 0.84 },
    { cx: 256.9, cy: 159.3, r: 1.44 },
    { cx: 129.3, cy: 170.7, r: 0.8 },
    { cx: 1295.6, cy: 177.0, r: 1.4 },
    { cx: 36.2, cy: 177.2, r: 2.04 },
    { cx: 81.8, cy: 181.3, r: 0.83 },
    { cx: 770.9, cy: 183.4, r: 0.8 },
    { cx: 1021.0, cy: 185.4, r: 1.77 },
    { cx: 556.9, cy: 188.5, r: 1.81 },
    { cx: 948.9, cy: 198.7, r: 0.83 },
    { cx: 338.1, cy: 204.2, r: 1.34 },
    { cx: 1154.9, cy: 204.5, r: 2.02 },
    { cx: 1384.5, cy: 209.4, r: 2.03 },
    { cx: 1000.4, cy: 222.2, r: 2.1 },
    { cx: 387.9, cy: 223.6, r: 0.83 },
    { cx: 972.9, cy: 226.4, r: 0.81 },
    { cx: 152.8, cy: 246.3, r: 1.34 },
    { cx: 85.6, cy: 259.1, r: 1.79 },
    { cx: 312.0, cy: 273.6, r: 2.05 },
    { cx: 1108.1, cy: 287.3, r: 0.52 },
    { cx: 1046.1, cy: 287.6, r: 3.21 },
    { cx: 1288.5, cy: 290.8, r: 0.86 },
    { cx: 687.8, cy: 295.1, r: 0.8 },
    { cx: 198.6, cy: 300.6, r: 1.33 },
    { cx: 1314.9, cy: 303.4, r: 1.75 },
    { cx: 790.3, cy: 305.5, r: 0.83 },
    { cx: 1213.0, cy: 311.5, r: 0.76 },
    { cx: 140.7, cy: 313.6, r: 1.81 },
    { cx: 63.9, cy: 325.6, r: 0.81 },
    { cx: 1292.1, cy: 329.9, r: 2.01 },
    { cx: 698.7, cy: 333.6, r: 1.4 },
    { cx: 1399.8, cy: 334.9, r: 0.8 },
    { cx: 347.0, cy: 343.8, r: 2.01 },
    { cx: 1420.4, cy: 361.5, r: 2.71 },
    { cx: 389.9, cy: 377.4, r: 1.33 },
    { cx: 1230.8, cy: 380.0, r: 1.33 },
    { cx: 1435.3, cy: 390.8, r: 0.81 },
    { cx: 1083.3, cy: 391.9, r: 0.57 },
    { cx: 1039.7, cy: 395.0, r: 1.59 },
    { cx: 712.1, cy: 399.2, r: 1.44 },
    { cx: 565.2, cy: 402.2, r: 1.4 },
    { cx: 132.1, cy: 402.7, r: 0.8 },
    { cx: 1246.0, cy: 404.8, r: 1.41 },
    { cx: 1152.3, cy: 411.0, r: 2.12 },
    { cx: 48.3, cy: 417.9, r: 2.03 },
    { cx: 444.6, cy: 424.3, r: 1.33 },
    { cx: 1078.7, cy: 432.0, r: 1.59 },
    { cx: 446.4, cy: 438.0, r: 1.33 },
    { cx: 560.0, cy: 439.4, r: 2.56 },
    { cx: 178.9, cy: 445.0, r: 0.99 },
    { cx: 1190.9, cy: 452.6, r: 1.14 },
    { cx: 1336.8, cy: 455.4, r: 1.7 },
    { cx: 109.3, cy: 455.9, r: 2.03 },
    { cx: 1013.4, cy: 456.0, r: 1.39 },
    { cx: 1412.9, cy: 456.6, r: 1.14 },
    { cx: 484.6, cy: 460.3, r: 1.33 },
    { cx: 1249.3, cy: 464.0, r: 2.12 },
    { cx: 980.4, cy: 465.0, r: 1.39 },
    { cx: 892.9, cy: 472.6, r: 1.13 },
    { cx: 1123.3, cy: 473.0, r: 2.12 },
    { cx: 183.9, cy: 474.5, r: 0.99 },
    { cx: 33.2, cy: 478.0, r: 1.08 },
    { cx: 249.5, cy: 479.4, r: 1.8 },
    { cx: 418.6, cy: 487.3, r: 1.33 },
    { cx: 1045.0, cy: 488.1, r: 0.8 },
    { cx: 1383.8, cy: 491.4, r: 1.7 },
    { cx: 367.3, cy: 496.3, r: 1.82 },
    { cx: 1294.8, cy: 497.4, r: 1.7 },
    { cx: 145.5, cy: 497.6, r: 1.81 },
    { cx: 861.6, cy: 498.0, r: 1.52 },
    { cx: 291.5, cy: 500.6, r: 1.82 },
    { cx: 529.0, cy: 500.9, r: 2.06 },
    { cx: 368.0, cy: 501.9, r: 1.04 },
    { cx: 935.6, cy: 505.0, r: 2.54 },
    { cx: 204.5, cy: 508.6, r: 1.81 },
    { cx: 991.5, cy: 512.1, r: 1.39 },
    { cx: 211.7, cy: 517.4, r: 1.01 },
    { cx: 1264.8, cy: 525.4, r: 1.7 },
    { cx: 1339.7, cy: 533.5, r: 2.23 },
    { cx: 338.5, cy: 537.6, r: 1.82 },
    { cx: 250.0, cy: 543.4, r: 1.56 },
    { cx: 887.9, cy: 543.6, r: 1.13 },
    { cx: 1353.5, cy: 552.9, r: 2.23 },
  ];
  
  const starsBig = [
    { cx: 470, cy: 160, size: 40 },
    { cx: 1102, cy: 214, size: 46 },
    { cx: 151, cy: 259, size: 30 },
    { cx: 1035, cy: 359, size: 24 },
    { cx: 341, cy: 435, size: 32 },
    { cx: 1177, cy: 453, size: 26 },
    { cx: 849, cy: 456, size: 38 },
    { cx: 968, cy: 502, size: 20 },
    { cx: 274, cy: 512, size: 22 },
    { cx: 535, cy: 521, size: 28 },
    { cx: 301, cy: 540, size: 18 },
  ];
  
  
  
  function renderStars() {
    if (!starContainers.length) return;
  
    starContainers.forEach(container => {
      const containerRect = container.getBoundingClientRect();
      const scaleX = containerRect.width / SVG_WIDTH;
      const scaleY = containerRect.height / SVG_HEIGHT;
  
      const src = container.dataset.src;
      const scale = (scaleX + scaleY) / 2;
  
      container.innerHTML = '';
  
      // Рендер маленьких звёзд (span)
      stars.forEach(({ cx, cy, r }) => {
        const star = document.createElement('span');
        star.classList.add('star');
  
        const size = r * 2;
  
        Object.assign(star.style, {
          left: `${cx * scaleX}px`,
          top: `${cy * scaleY}px`,
          width: `${size}px`,
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${1 + Math.random() * 2}s`,
        });
  
        container.appendChild(star);
      });
  
      // Рендер больших звёзд (img)
      const OFFSET_Y = 70;
      if (src) {
        starsBig.forEach((star) => {
          const img = document.createElement('img');
          img.src = src;
          img.alt = 'star';
          img.classList.add('star-big');
  
          const size = star.size * scale;
  
          Object.assign(img.style, {
            width: `${size}px`,
            left: `${star.cx * scaleX - size / 2}px`,
            top: `${(star.cy - OFFSET_Y) * scaleY - size / 2}px`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
          });
  
          container.appendChild(img);
        });
      }
    });
  }
  
  renderStars();
  
  
  // === RESIZI OBSERVER ==========================================
  
  let lastWidth2 = window.innerWidth;
  
  const resizeObserver2 = new ResizeObserver(entries => {
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        const currentWidth = entry.contentRect.width;
        if (currentWidth !== lastWidth2) {
          renderStars();
          // createGsapAnim();
          lastWidth2 = currentWidth;
        }
      });
    });
  });
  
  resizeObserver2.observe(document.body);



});  






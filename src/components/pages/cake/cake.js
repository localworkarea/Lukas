import { addTouchAttr, addLoadedAttr, isMobile, FLS } from "@js/common/functions.js"
// import SplitType from 'split-type'
addLoadedAttr();

document.addEventListener("DOMContentLoaded", () => {
function updateClipPath(angleDeg = -8) {
	const elements = document.querySelectorAll('[data-fls-clip]');
	if (!elements.length) return;

	const angleRad = angleDeg * (Math.PI / 180);

	elements.forEach(el => {
		const width = el.offsetWidth;
		const height = el.getBoundingClientRect().height;

		const offset = Math.tan(Math.abs(angleRad)) * width;
		const yRight = height - offset;

		el.style.clipPath = `polygon(
			0 0,
			${width}px 0,
			${width}px ${yRight}px,
			0 ${height}px
		)`;
	});
}

  
  
  updateClipPath(-8);
  
  
  
  // СМЕНА КАРТИНОК И ТЕКСТА ДЛЯ ЭЛЕМЕНТА [data-info-el] по клику на кнопки data-info =====
  // const dataInfoEl = document.querySelector('[data-info-el]');
  // if (dataInfoEl) {
  // 	const subBlocks = [...dataInfoEl.querySelectorAll('[data-info-subel]')];
  // 	const buttons = [...document.querySelectorAll('[data-info]')];

  // 	// Установка начального состояния — активны только первые элементы
  // 	function initDisplay() {
  // 		subBlocks.forEach((block) => {
  // 			[...block.children].forEach((child, i) => {
  // 				child.classList.toggle('--active', i === 0);
  // 			});
  // 		});
  // 	}

  // 	// Показать по индексу (index — с 1)
  // 	function showInfoByIndex(index) {
  // 		const targetIndex = index - 1;
  // 		subBlocks.forEach((block) => {
  // 			[...block.children].forEach((child, i) => {
  // 				child.classList.toggle('--active', i === targetIndex);
  // 			});
  // 		});
  // 	}

  // 	// Удалить все --hover
  // 	function clearAllHoverClasses() {
  // 		buttons.forEach((btn) => {
  // 			btn.parentElement?.classList.remove('--hover');
	// 			btn.classList.remove('--hover-el');
  // 		});
  // 	}

  // 	// Установить --hover только нужному
  // 	function setHoverOn(btn) {
  // 		clearAllHoverClasses();
  // 		btn.parentElement?.classList.add('--hover');
  // 		btn.classList.add('--hover-el');
  // 	}

  // 	initDisplay();

  // 	buttons.forEach((btn) => {
  // 		const index = parseInt(btn.dataset.info, 10);
  // 		if (isNaN(index)) return;

  // 		const handleInteraction = () => {
  // 			showInfoByIndex(index);
  // 			setHoverOn(btn);
  // 		};

  // 		btn.addEventListener('mouseenter', handleInteraction);
  // 		btn.addEventListener('click', handleInteraction);

  // 		// Удаляем --hover при уходе мыши
  // 		btn.addEventListener('mouseleave', () => {
  // 			btn.parentElement?.classList.remove('--hover');
  // 		});
  // 	});

  // 	// Слушаем клик по документу — убираем все --hover если клик был вне кнопок
  // 	document.addEventListener('click', (e) => {
  // 		if (!e.target.closest('[data-info]')) {
  // 			clearAllHoverClasses();
  // 		}
  // 	});
  // }



	const dataInfoEl = document.querySelector('[data-info-el]');
if (dataInfoEl) {
	const subBlocks = [...dataInfoEl.querySelectorAll('[data-info-subel]')];
	const buttons = [...document.querySelectorAll('[data-info]')];

	// Получить все целевые элементы внутри блока
	function getItems(block) {
		// ищем либо картинки, либо элементы списка
		return block.querySelectorAll('.info-cake__img, .info-cake__item');
	}

	// Установка начального состояния — активны только первые элементы
	function initDisplay() {
		subBlocks.forEach((block) => {
			getItems(block).forEach((child, i) => {
				child.classList.toggle('--active', i === 0);
			});
		});
	}

	// Показать по индексу (index — с 1)
	function showInfoByIndex(index) {
		const targetIndex = index - 1;
		subBlocks.forEach((block) => {
			getItems(block).forEach((child, i) => {
				child.classList.toggle('--active', i === targetIndex);
			});
		});
	}

	// Удалить все --hover
	function clearAllHoverClasses() {
		buttons.forEach((btn) => {
			btn.parentElement?.classList.remove('--hover');
			btn.classList.remove('--hover-el');
		});
	}

	// Установить --hover только нужному
	function setHoverOn(btn) {
		clearAllHoverClasses();
		btn.parentElement?.classList.add('--hover');
		btn.classList.add('--hover-el');
	}

	initDisplay();

	buttons.forEach((btn) => {
		const index = parseInt(btn.dataset.info, 10);
		if (isNaN(index)) return;

		const handleInteraction = () => {
			showInfoByIndex(index);
			setHoverOn(btn);
		};

		btn.addEventListener('mouseenter', handleInteraction);
		btn.addEventListener('click', handleInteraction);

		// Удаляем --hover при уходе мыши
		btn.addEventListener('mouseleave', () => {
			btn.parentElement?.classList.remove('--hover');
		});
	});

	// Слушаем клик по документу — убираем все --hover если клик был вне кнопок
	document.addEventListener('click', (e) => {
		if (!e.target.closest('[data-info]')) {
			clearAllHoverClasses();
		}
	});
}



  // === end ================


  // === тригеры для анимации элементов data-trigger-star =============
  
  // data-trigger-start="top,75%" - превое значение top|center|bottom или % для єлемента, второе значение top|center|bottom или % для окна браузера

	let watcherstrigger = []; // глобальный список отслеживаемых элементов
  let lastScrollY = window.scrollY;

  // Обработка строки значения: 'top, 20%' → ['top', '20%']
  function parseTriggerValues(value) {
  	const parts = value.split(",").map(s => s.trim());
  	return [parts[0] || "top", parts[1] || "top"];
  }

  // Преобразуем "top" / "center" / "10%" / "40px" в числовую точку относительно base
  function parsePoint(value, base) {
  	if (typeof value === "string") {
  		if (value.endsWith("%")) {
  			return base * parseFloat(value) / 100;
  		} else if (value === "top") {
  			return 0;
  		} else if (value === "center") {
  			return base / 2;
  		} else if (value === "bottom") {
  			return base;
  		} else if (!isNaN(parseFloat(value))) {
  			return parseFloat(value); // абсолютные px
  		}
  	}
  	return 0;
  }

  // === ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ===
  function initTriggers() {
  	const triggers = document.querySelectorAll("[data-trigger-start]");
  	if (!triggers.length) return; // безопасный выход

  	watcherstrigger = Array.from(triggers).map((el) => {
  		const [startElementPoint, startViewportPoint] = parseTriggerValues(el.dataset.triggerStart);
  		return {
  			element: el,
  			startElementPoint,
  			startViewportPoint,
  			isActive: false,
  		};
  	});

  	// подписка на scroll (один раз)
  	window.addEventListener("scroll", updateTrigger);

  // отложенный запуск updateTrigger после загрузки
    requestAnimationFrame(() => {
    	setTimeout(() => {
    		lastScrollY = window.scrollY;
    		updateTrigger(true); // <-- принудительно обрабатываем на старте
    	}, 50);
    });

  }

  // === ОТКРЫТАЯ ФУНКЦИЯ: МОЖНО ВЫЗЫВАТЬ С СНАРУЖИ ===
  function updateTrigger(forceCheck = false) {
  	const viewportHeight = window.innerHeight;
  	const scrollingDown = window.scrollY > lastScrollY;
  	const scrollingUp = window.scrollY < lastScrollY;

  	watcherstrigger.forEach(watcher => {
  		const rect = watcher.element.getBoundingClientRect();
  		const elementOffset = parsePoint(watcher.startElementPoint, rect.height);
  		const viewportOffset = parsePoint(watcher.startViewportPoint, viewportHeight);

  		const elementTriggerPosition = rect.top + elementOffset;

  		// === ВХОД В ЗОНУ (либо при скролле вниз, либо при принудительной проверке)
  		if (!watcher.isActive && elementTriggerPosition <= viewportOffset && (scrollingDown || forceCheck)) {
  			watcher.element.classList.add("--view");
  			watcher.isActive = true;
  		}

  		// === ВЫХОД ИЗ ЗОНЫ
  		if (watcher.isActive && elementTriggerPosition > viewportOffset && scrollingUp) {
  			watcher.element.classList.remove("--view");
  			watcher.isActive = false;
  		}
  	});

  	lastScrollY = window.scrollY;
  }

  initTriggers();

  // ===== end ======================================================



	// ПОДСТАВИТЬ КОНТЕНТ В ПОПАП ===========
	// const popupCake = document.querySelector('[data-fls-popup="popup-cake"]');
	// if (popupCake) {
	// 	const popupTitle = popupCake.querySelector(".popup-cake__title");
	// 	const popupDescr = popupCake.querySelector(".popup-cake__txt"); 
	// 	const popupSpecs = popupCake.querySelector(".popup-cake__specification"); 
	// 	const orderBtn = popupCake.querySelector(".popup-cake__btn");
	// 	const popupImg = popupCake.querySelector(".popup-cake__picture img");

	// 	const ROOT = document.documentElement;
  // 	const CLASS_PREFIX = "popup-el--";

	// 	const catalogItems = document.querySelectorAll('[data-fls-popup-link="popup-cake"]');
	// 	const infoBlocks = document.querySelectorAll("[data-popup-info]");

	// 	catalogItems.forEach((item, index) => {
	// 		item.addEventListener("click", (e) => {
	// 			e.preventDefault();
				

	// 			const info = infoBlocks[index];
	// 			if (!info) return;

	// 			// Заголовок
	// 			popupTitle.textContent = "";
	// 			const infoTitle = info.querySelector("[data-popup-title]");
	// 			if (infoTitle) popupTitle.textContent = infoTitle.textContent;

	// 			// Описание
	// 			popupDescr.innerHTML = "";
	// 			const infoDescr = info.querySelector("[data-popup-descr]");
	// 			if (infoDescr) popupDescr.innerHTML = infoDescr.innerHTML;

	// 			// Спецификации
	// 			popupSpecs.innerHTML = "";
	// 			const infoSpecs = info.querySelectorAll("[data-popup-specs-item]");
	// 			if (infoSpecs.length) {
	// 				const ul = document.createElement("ul");
	// 				ul.className = "specification__list";

	// 				infoSpecs.forEach((spec) => {
	// 					const title = spec.querySelector("[data-popup-specs-title]")?.textContent.trim() || "";
	// 					const descr = spec.querySelector("[data-popup-specs-descr]")?.textContent.trim() || "";

	// 					const li = document.createElement("li");
	// 					li.className = "specification__item";

	// 					li.innerHTML = `
	// 						<div class="specification__title"><p>${title}</p></div>
	// 						<div class="specification__descr"><p>${descr}</p></div>
	// 					`;
	// 					ul.appendChild(li);
	// 				});

	// 				popupSpecs.appendChild(ul);
	// 			}

	// 			// Картинка
	// 			const catalogImg = item.querySelector("img");
	// 			if (catalogImg && popupImg) {
	// 				popupImg.setAttribute("src", catalogImg.getAttribute("src"));
	// 				popupImg.setAttribute("alt", catalogImg.getAttribute("alt") || "Image");
	// 			}

	// 			// Кнопка заказа
	// 			const orderUrl = info.dataset.popupOrder || "#";
	// 			if (orderUrl) {
	// 				orderBtn.setAttribute("href", orderUrl);
	// 			}
	// 		});
	// 	});
	// }



	const popupCake = document.querySelector('[data-fls-popup="popup-cake"]');

if (popupCake) {
  const popupTitle = popupCake.querySelector(".popup-cake__title");
  const popupDescr = popupCake.querySelector(".popup-cake__txt");
  const popupSpecs = popupCake.querySelector(".popup-cake__specification");
  const orderBtn   = popupCake.querySelector(".popup-cake__btn");
  const popupImg   = popupCake.querySelector(".popup-cake__picture img");

  const ROOT = document.documentElement;
  const CLASS_PREFIX = "popup-el--";

  const catalogItems = document.querySelectorAll('[data-fls-popup-link="popup-cake"]');

  catalogItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // 1) Данные берём из блока внутри текущего item
      const info = item.querySelector("[data-popup-info]");
      if (!info) return;

      // 2) Заголовок
      popupTitle.textContent = "";
      const infoTitle = info.querySelector("[data-popup-title]");
      if (infoTitle) popupTitle.textContent = infoTitle.textContent.trim();

      // 3) Описание
      popupDescr.innerHTML = "";
      const infoDescr = info.querySelector("[data-popup-descr]");
      if (infoDescr) popupDescr.innerHTML = infoDescr.innerHTML.trim();

      // 4) Спецификации
      popupSpecs.innerHTML = "";
      const infoSpecs = info.querySelectorAll("[data-popup-specs-item]");
      if (infoSpecs.length) {
        const ul = document.createElement("ul");
        ul.className = "specification__list";

        infoSpecs.forEach((spec) => {
          const title = spec.querySelector("[data-popup-specs-title]")?.textContent.trim() || "";
          const descr = spec.querySelector("[data-popup-specs-descr]")?.textContent.trim() || "";
          if (!title && !descr) return;

          const li = document.createElement("li");
          li.className = "specification__item";
          li.innerHTML = `
            <div class="specification__title"><p>${title}</p></div>
            <div class="specification__descr"><p>${descr}</p></div>
          `;
          ul.appendChild(li);
        });

        if (ul.children.length) popupSpecs.appendChild(ul);
      }

      // 5) Картинка из кликнутого элемента
      const catalogImg = item.querySelector("img");
      if (catalogImg && popupImg) {
        popupImg.src = catalogImg.getAttribute("src") || popupImg.src;
        popupImg.alt = catalogImg.getAttribute("alt") || "Image";
      }

      // 6) Кнопка заказа
      orderBtn.setAttribute("href", info.dataset.popupOrder || "#");
    });
  });
}

	// ===== END ========================================


  

  // == funcsion risize ======================
  let lastWidth = window.innerWidth;
  const resizeObserver = new ResizeObserver(entries => {
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        const currentWidth = entry.contentRect.width;
        if (currentWidth !== lastWidth) {
          updateClipPath(-8);
          updateTrigger();
          lastWidth = currentWidth;
        }
      });
    });
  });
  resizeObserver.observe(document.body);
  
  
  
    // == ЗАПУС ВИДЕО ЭЛЕМЕНТОВ ЕСЛИ IPHONE В РЕЖИМЕ LOWE MODE ===============================
    if (isMobile.iOS()) {
          const heroSection = document.querySelector('.cake-hero');
          
          if (popupCases) {
  
            const videoElements = document.querySelectorAll('video');
      
            if (videoElements.length > 0) {
            
                Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
                    get: function () {
                        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
                    }
                });
              
                videoElements.forEach(videoElement => {
                    if (!videoElement.hasAttribute('playsinline')) {
                        videoElement.setAttribute('playsinline', '');
                    }
                });
              
                function attemptPlay(videoElement) {
                    if (!videoElement.playing) {
                        videoElement.play().catch(error => {
                            console.error('Failed to play video:', error);
                        });
                    }
                }
              
                document.body.addEventListener('click', () => {
                    videoElements.forEach(videoElement => attemptPlay(videoElement));
                });
              
                document.body.addEventListener('touchstart', () => {
                    videoElements.forEach(videoElement => attemptPlay(videoElement));
                });
            }
          }
  
    }
    // ===================================
});





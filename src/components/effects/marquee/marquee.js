import { FLS } from "@js/common/functions.js";

import "./marquee.scss";

// const marquee = () => {
// 	const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
// 	const ATTR_NAMES = {
// 		wrapper: "data-fls-marquee-wrapper",
// 		inner: "data-fls-marquee-inner",
// 		item: "data-fls-marquee-item",
// 	};

// 	if (!$marqueeArray.length) return;

// 	const { head } = document;

// 	const debounce = (delay, fn) => {
// 		let timerId;
// 		return (...args) => {
// 			if (timerId) {
// 				clearTimeout(timerId);
// 			}
// 			timerId = setTimeout(() => {
// 				fn(...args);
// 				timerId = null;
// 			}, delay);
// 		};
// 	};

// 	const onWindowWidthResize = (cb) => {
// 		if (!cb && !isFunction(cb)) return;

// 		let prevWidth = 0;

// 		const handleResize = () => {
// 			const currentWidth = window.innerWidth;

// 			if (prevWidth !== currentWidth) {
// 				prevWidth = currentWidth;
// 				cb();
// 			}
// 		};

// 		window.addEventListener("resize", debounce(50, handleResize));

// 		handleResize();
// 	};

// 	const buildMarquee = (marqueeNode) => {
// 		if (!marqueeNode) return;

// 		const $marquee = marqueeNode;
// 		const $childElements = $marquee.children;

// 		if (!$childElements.length) return;
// 		//$marquee.setAttribute(ATTR_NAMES.wrapper, '');
// 		Array.from($childElements).forEach(($childItem) => $childItem.setAttribute(ATTR_NAMES.item, ''));

// 		const htmlStructure = `<div ${ATTR_NAMES.inner}>${$marquee.innerHTML}</div>`;
// 		$marquee.innerHTML = htmlStructure;
// 	};

// 	const getElSize = ($el, isVertical) => {
// 		if (isVertical) return $el.offsetHeight;
// 		return $el.offsetWidth;
// 	};

// 	$marqueeArray.forEach(($wrapper) => {
// 		if (!$wrapper) return;

// 		buildMarquee($wrapper);

// 		const $marqueeInner = $wrapper.firstElementChild;
// 		let cacheArray = [];

// 		if (!$marqueeInner) return;

// 		const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
// 		const $items = $wrapper.querySelectorAll(`[${ATTR_NAMES.item}]`);
// 		const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
// 		const isMousePaused = $wrapper.hasAttribute("data-fls-marquee-pause");
// 		const direction = $wrapper.getAttribute("data-fls-marquee-direction");
// 		const isVertical = direction === "bottom" || direction === "top";
// 		const animName = `marqueeAnimation-${Math.floor(Math.random() * 10000000)}`;
// 		let spaceBetweenItem = parseFloat(window.getComputedStyle($items[0])?.getPropertyValue("margin-right"));
// 		let spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
// 		let startPosition = parseFloat($wrapper.getAttribute("data-fls-marquee-start")) || 0;

// 		let sumSize = 0;
// 		let firstScreenVisibleSize = 0;
// 		let initialSizeElements = 0;
// 		let initialElementsLength = $marqueeInner.children.length;
// 		let index = 0;
// 		let counterDuplicateElements = 0;

// 		const initEvents = () => {
// 			if (startPosition) $marqueeInner.addEventListener("animationiteration", onChangeStartPosition);

// 			if (!isMousePaused) return;
// 			$marqueeInner.removeEventListener("mouseenter", onChangePaused);
// 			$marqueeInner.removeEventListener("mouseleave", onChangePaused);
// 			$marqueeInner.addEventListener("mouseenter", onChangePaused);
// 			$marqueeInner.addEventListener("mouseleave", onChangePaused);
// 		};

// 		const onChangeStartPosition = () => {
// 			startPosition = 0;
// 			$marqueeInner.removeEventListener("animationiteration", onChangeStartPosition);
// 			onResize();
// 		};

// 		const setBaseStyles = (firstScreenVisibleSize) => {
// 			let baseStyle = "display: flex; flex-wrap: nowrap;";

// 			if (isVertical) {
// 				baseStyle += `
// 				flex-direction: column;
// 				position: relative;
// 				will-change: transform;`;

// 				if (direction === "bottom") {
// 					baseStyle += `top: -${firstScreenVisibleSize}px;`;
// 				}
// 			} else {
// 				baseStyle += `
// 				position: relative;
// 				will-change: transform;`;

// 				if (direction === "right") {
// 					baseStyle += `inset-inline-start: -${firstScreenVisibleSize}px;;`;
// 				}
// 			}

// 			$marqueeInner.style.cssText = baseStyle;
// 		};

// 		const setdirectionAnim = (totalWidth) => {
// 			switch (direction) {
// 				case "right":
// 				case "bottom":
// 					return totalWidth;
// 				default:
// 					return -totalWidth;
// 			}
// 		};

// 		const animation = () => {
// 			const keyFrameCss = `@keyframes ${animName} {
// 					 0% {
// 						 transform: translate${isVertical ? "Y" : "X"}(${!isVertical && window.stateRtl ? -startPosition : startPosition}%);
// 					 }
// 					 100% {
// 						 transform: translate${isVertical ? "Y" : "X"}(${setdirectionAnim(
// 				!isVertical && window.stateRtl ? -firstScreenVisibleSize : firstScreenVisibleSize
// 			)}px);
// 					 }
// 				 }`;
// 			const $style = document.createElement("style");

// 			$style.classList.add(animName);
// 			$style.innerHTML = keyFrameCss;
// 			head.append($style);

// 			$marqueeInner.style.animation = `${animName} ${(firstScreenVisibleSize + (startPosition * firstScreenVisibleSize) / 100) / speed
// 				}s infinite linear`;
// 		};

// 		const addDublicateElements = () => {
// 			sumSize = firstScreenVisibleSize = initialSizeElements = counterDuplicateElements = index = 0;

// 			const $parentNodeWidth = getElSize($wrapper, isVertical);

// 			let $childrenEl = Array.from($marqueeInner.children);

// 			if (!$childrenEl.length) return;

// 			if (!cacheArray.length) {
// 				cacheArray = $childrenEl.map(($item) => $item);
// 			} else {
// 				$childrenEl = [...cacheArray];
// 			}

// 			$marqueeInner.style.display = "flex";
// 			if (isVertical) $marqueeInner.style.flexDirection = "column";
// 			$marqueeInner.innerHTML = "";
// 			$childrenEl.forEach(($item) => {
// 				$marqueeInner.append($item);
// 			});

// 			$childrenEl.forEach(($item) => {
// 				if (isVertical) {
// 					$item.style.marginBottom = `${spaceBetween}px`;
// 				} else {
// 					$item.style.marginRight = `${spaceBetween}px`;
// 					$item.style.flexShrink = 0;
// 				}

// 				const sizeEl = getElSize($item, isVertical);

// 				sumSize += sizeEl + spaceBetween;
// 				firstScreenVisibleSize += sizeEl + spaceBetween;
// 				initialSizeElements += sizeEl + spaceBetween;
// 				counterDuplicateElements += 1;

// 				return sizeEl;
// 			});

// 			const $multiplyWidth = $parentNodeWidth * 2 + initialSizeElements;

// 			for (; sumSize < $multiplyWidth; index += 1) {
// 				if (!$childrenEl[index]) index = 0;

// 				const $cloneNone = $childrenEl[index].cloneNode(true);
// 				const $lastElement = $marqueeInner.children[index];

// 				$marqueeInner.append($cloneNone);

// 				sumSize += getElSize($lastElement, isVertical) + spaceBetween;

// 				if (firstScreenVisibleSize < $parentNodeWidth || counterDuplicateElements % initialElementsLength !== 0) {
// 					counterDuplicateElements += 1;
// 					firstScreenVisibleSize += getElSize($lastElement, isVertical) + spaceBetween;
// 				}
// 			}

// 			setBaseStyles(firstScreenVisibleSize);
// 		};

// 		const correctSpaceBetween = () => {
// 			if (spaceBetweenItem) {
// 				$items.forEach(($item) => $item.style.removeProperty("margin-right"));

// 				spaceBetweenItem = parseFloat(window.getComputedStyle($items[0]).getPropertyValue("margin-right"));
// 				spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
// 			}
// 		};

// 		const init = () => {
// 			correctSpaceBetween();
// 			addDublicateElements();
// 			animation();
// 			initEvents();
// 		};

// 		const onResize = () => {
// 			head.querySelector(`.${animName}`)?.remove();
// 			init();
// 		};

// 		const onChangePaused = (e) => {
// 			const { type, target } = e;

// 			target.style.animationPlayState = type === "mouseenter" ? "paused" : "running";
// 		};

// 		onWindowWidthResize(onResize);
// 	});
// };

// marquee();





// document.addEventListener("DOMContentLoaded", () => {
// 	marquee();
// });

// const marquee = () => {
// 	const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
// 	if (!$marqueeArray.length) return;

// 	const getElSize = ($el) => $el?.offsetWidth || 0;

// 	$marqueeArray.forEach(($wrapper) => {
// 		const ATTR = {
// 			inner: "data-fls-marquee-inner",
// 			item: "data-fls-marquee-item",
// 		};

// 		const buildStructure = () => {
// 			const $children = Array.from($wrapper.children);
// 			if (!$children.length) return false;

// 			$children.forEach(($el) => $el.setAttribute(ATTR.item, ''));
// 			$wrapper.innerHTML = `<div ${ATTR.inner}>${$wrapper.innerHTML}</div>`;
// 			return true;
// 		};

// 		if (!buildStructure()) return;

// 		const $marqueeInner = $wrapper.querySelector(`[${ATTR.inner}]`);
// 		const $items = $wrapper.querySelectorAll(`[${ATTR.item}]`);
// 		if (!$marqueeInner || !$items.length) return;

// 		const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
// 		const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
// 		const direction = $wrapper.getAttribute("data-fls-marquee-direction");
// 		const isReverse = direction === "right";
// 		const itemMargin = parseFloat(getComputedStyle($items[0]).getPropertyValue("margin-right")) || 0;
// 		const spaceBetween = !isNaN(itemMargin)
// 			? itemMargin
// 			: !isNaN(dataMarqueeSpace)
// 			? dataMarqueeSpace
// 			: 30;

// 		// NEW: флаг возможности перетаскивания
// 		const isDraggable = $wrapper.hasAttribute("data-fls-marquee-drag");

// 		let currentX = 0;
// 		let lastFrameTime = performance.now();
// 		let firstScreenVisibleSize = 0;
// 		let isDragging = false;
// 		let isPaused = false;
// 		let startX = 0;
// 		let startY = 0; // <-- NEW
// 		let dragStartX = 0;
// 		let cacheArray = [];
// 		let velocity = 0;

// 		const addDuplicateElements = () => {
// 			const $parentWidth = getElSize($wrapper);
// 			if ($parentWidth <= 0) return;

// 			let sumSize = 0;
// 			firstScreenVisibleSize = 0;

// 			let $children = Array.from($marqueeInner.children);
// 			if (!cacheArray.length) {
// 				cacheArray = $children;
// 			} else {
// 				$children = [...cacheArray];
// 			}

// 			$marqueeInner.style.display = "flex";
// 			$marqueeInner.innerHTML = "";

// 			$children.slice().reverse().forEach(($item) => {
// 				const $clone = $item.cloneNode(true);
// 				$clone.style.marginRight = `${spaceBetween}px`;
// 				$clone.style.flexShrink = 0;
// 				$marqueeInner.insertBefore($clone, $marqueeInner.firstChild);
// 			});

// 			$children.forEach(($item) => {
// 				$item.style.marginRight = `${spaceBetween}px`;
// 				$item.style.flexShrink = 0;
// 				$marqueeInner.append($item);

// 				const size = getElSize($item);
// 				sumSize += size + spaceBetween;
// 				firstScreenVisibleSize += size + spaceBetween;
// 			});

// 			const targetSize = $parentWidth * 2 + firstScreenVisibleSize;
// 			let index = 0;

// 			while (sumSize < targetSize && $children.length > 0) {
// 				if (!$children[index]) index = 0;
// 				const $clone = $children[index].cloneNode(true);
// 				$clone.style.marginRight = `${spaceBetween}px`;
// 				$clone.style.flexShrink = 0;
// 				$marqueeInner.appendChild($clone);
// 				sumSize += getElSize($clone) + spaceBetween;
// 				index++;
// 			}
// 		};

// 		const render = () => {
// 			const now = performance.now();
// 			const delta = now - lastFrameTime;
// 			lastFrameTime = now;

// 			const easing = 0.05;
// 			const maxSpeed = (isReverse ? 1 : -1) * (speed / 1000);
// 			const targetSpeed = (isDragging || isPaused) ? 0 : maxSpeed;
// 			velocity += (targetSpeed - velocity) * easing;

// 			currentX += velocity * delta;

// 			if (currentX <= -firstScreenVisibleSize * 2) {
// 				currentX += firstScreenVisibleSize;
// 			}
// 			if (currentX >= -firstScreenVisibleSize) {
// 				currentX -= firstScreenVisibleSize;
// 			}

// 			$marqueeInner.style.transform = `translateX(${currentX}px)`;
// 			requestAnimationFrame(render);
// 		};

// const initDrag = () => {
//   // курсор и touch-action
//   $marqueeInner.style.cursor = isDraggable ? "grab" : "";
//   if (isDraggable) $marqueeInner.style.touchAction = "pan-y";

//   if (!isDraggable) return;

//   const getPointerX = (e) => (e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX);
//   const getPointerY = (e) => (e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY);

//   let isPointerDown = false;
//   let lockAxis = null; // 'x' | 'y' | null
//   const moveThreshold = 6; // пиксели до определения направления
//   const angleRatio = 1.2;  // порог угла: |dx| должен превышать |dy| * 1.2 для X, и наоборот для Y
//   let dragStartTime = 0;

//   const onPointerDown = (e) => {
//     isPointerDown = true;
//     isDragging = false;
//     lockAxis = null;

//     startX = getPointerX(e);
//     startY = getPointerY(e);
//     dragStartX = currentX;
//     dragStartTime = performance.now();

//     if (e.type === "mousedown") e.preventDefault();
//     $marqueeInner.style.cursor = "grabbing";

//     // слушаем на окне, чтобы не терять жест за пределами элемента
//     window.addEventListener("mousemove", onPointerMove, { passive: false });
//     window.addEventListener("mouseup", onPointerUp, { passive: true });
//     window.addEventListener("touchmove", onPointerMove, { passive: false });
//     window.addEventListener("touchend", onPointerUp, { passive: true });
//     window.addEventListener("touchcancel", onPointerUp, { passive: true });
//   };

//   const onPointerMove = (e) => {
//     if (!isPointerDown) return;

//     const x = getPointerX(e);
//     const y = getPointerY(e);
//     const dx = x - startX;
//     const dy = y - startY;
//     const adx = Math.abs(dx);
//     const ady = Math.abs(dy);

//     if (!lockAxis) {
//       if (adx < moveThreshold && ady < moveThreshold) return;

//       if (adx > ady * angleRatio) {
//         // Горизонтальный жест
//         lockAxis = 'x';
//         isDragging = true;
//         isPaused = true;     // ставим на паузу автоскролл
//         // сбросим отправную точку, чтобы инерция считалась по реальному старту X-жеста
//         dragStartX = currentX;
//         startX = x;
//         startY = y;
//       } else if (ady > adx * angleRatio) {
//         // Вертикальный жест — отдаём странице
//         lockAxis = 'y';
//       } else {
//         // зона неопределенности угла — ничего не делаем
//         return;
//       }
//     }

//     if (lockAxis === 'y') {
//       // Вертикальный скролл страницы — не мешаем
//       return;
//     }

//     // Горизонтальный drag — предотвращаем дёргание страницы
//     if (e.cancelable) e.preventDefault();

//     const delta = x - startX;
//     currentX = dragStartX + delta;
//   };

//   const onPointerUp = () => {
//     if (isDragging) {
//       const dragDistance = currentX - dragStartX;
//       const dragDuration = Math.max(performance.now() - dragStartTime, 16);
//       const rawVelocity = dragDistance / dragDuration;

//       const maxInertia = 1.5;
//       const minThreshold = 0.1;
//       velocity = Math.abs(rawVelocity) > minThreshold
//         ? Math.max(-maxInertia, Math.min(maxInertia, rawVelocity))
//         : 0;
//     }

//     isPointerDown = false;
//     isDragging = false;
//     lockAxis = null;
//     isPaused = false;
//     $marqueeInner.style.cursor = "grab";

//     // снимаем глобальные слушатели
//     window.removeEventListener("mousemove", onPointerMove);
//     window.removeEventListener("mouseup", onPointerUp);
//     window.removeEventListener("touchmove", onPointerMove);
//     window.removeEventListener("touchend", onPointerUp);
//     window.removeEventListener("touchcancel", onPointerUp);
//   };

//   // базовые слушатели старта на самой ленте
//   $marqueeInner.addEventListener("mousedown", onPointerDown);
//   $marqueeInner.addEventListener("touchstart", onPointerDown, { passive: true });

//   // на всякий случай завершаем drag при уходе мыши
//   $marqueeInner.addEventListener("mouseleave", () => {
//     if (!isPointerDown) return;
//     onPointerUp();
//   });
// };

// 		const init = () => {
// 			addDuplicateElements();
// 			if (firstScreenVisibleSize <= 0) return;
// 			currentX = 0;
// 			lastFrameTime = performance.now();
// 			initDrag();

// 			if ($wrapper.hasAttribute("data-fls-marquee-pause")) {
// 				$marqueeInner.addEventListener("mouseenter", () => {
// 					if (!isDragging) isPaused = true;
// 				});
// 				$marqueeInner.addEventListener("mouseleave", () => {
// 					isPaused = false;
// 				});
// 			}

// 			requestAnimationFrame(render);
// 		};

// 		init();
// 	});
// };





document.addEventListener("DOMContentLoaded", () => {
  marquee();
});

const marquee = () => {
  const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
  if (!$marqueeArray.length) return;

  const getElSize = ($el) => $el?.offsetWidth || 0;

  $marqueeArray.forEach(($wrapper) => {
    // ✅ Анти-дубль: если уже инициализирован — выходим
    if ($wrapper.dataset.flsMarqueeInit === "true") return;
    $wrapper.dataset.flsMarqueeInit = "true";

    // --- ПЕРЕМЕННЫЕ И СОСТОЯНИЕ ИНСТАНСА ---
    const ATTR = {
      inner: "data-fls-marquee-inner",
      item: "data-fls-marquee-item",
    };

    let $marqueeInner = null;
    let $items = null;

    const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
    const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
    const direction = $wrapper.getAttribute("data-fls-marquee-direction");
    const isReverse = direction === "right";
    const isDraggable = $wrapper.hasAttribute("data-fls-marquee-drag");

    let currentX = 0;
    let lastFrameTime = performance.now();
    let firstScreenVisibleSize = 0;
    let isDragging = false;
    let isPaused = false;
    let startX = 0;
    let startY = 0;
    let dragStartX = 0;
    let velocity = 0;
    let cacheArray = [];
    let rafId = null;

    let onPointerDown, onPointerMove, onPointerUp, onMouseLeave;

    // --- ЗАЩИЩЁННАЯ СБОРКА СТРУКТУРЫ ---
    const buildStructure = () => {
      // Если уже есть inner — не заворачиваем повторно
      const $existingInner = $wrapper.querySelector(`[${ATTR.inner}]`);
      if ($existingInner) {
        $marqueeInner = $existingInner;
        $items = $marqueeInner.querySelectorAll(`[${ATTR.item}]`);
        return !!$items.length;
      }

      const $children = Array.from($wrapper.children);
      if (!$children.length) return false;

      $children.forEach(($el) => $el.setAttribute(ATTR.item, ""));
      $wrapper.innerHTML = `<div ${ATTR.inner}>${$wrapper.innerHTML}</div>`;
      $marqueeInner = $wrapper.querySelector(`[${ATTR.inner}]`);
      $items = $wrapper.querySelectorAll(`[${ATTR.item}]`);
      return !!$marqueeInner && !!$items.length;
    };

    if (!buildStructure()) return;

    // Вычисление пробела между элементами (margin-right приоритетнее)
    const itemMargin = parseFloat(getComputedStyle($items[0]).getPropertyValue("margin-right")) || 0;
    const spaceBetween = !isNaN(itemMargin)
      ? itemMargin
      : !isNaN(dataMarqueeSpace)
      ? dataMarqueeSpace
      : 30;

    // --- ДОБАВЛЕНИЕ КЛОНОВ С ЛИМИТАМИ ---
    const addDuplicateElements = () => {
      const parentWidth = getElSize($wrapper);
      if (parentWidth <= 0) return false; // подождём размера

      let sumSize = 0;
      firstScreenVisibleSize = 0;

      let $children = Array.from($marqueeInner.children);
      // Кэшируем «оригинальный набор» 1 раз
      if (!cacheArray.length) {
        cacheArray = $children;
      } else {
        $children = [...cacheArray];
      }

      $marqueeInner.style.display = "flex";
      $marqueeInner.innerHTML = "";

      // 1) Левая «подушка»
      $children
        .slice()
        .reverse()
        .forEach(($item) => {
          const $clone = $item.cloneNode(true);
          $clone.style.marginRight = `${spaceBetween}px`;
          $clone.style.flexShrink = 0;
          $marqueeInner.insertBefore($clone, $marqueeInner.firstChild);
        });

      // 2) Оригиналы
      $children.forEach(($item) => {
        $item.style.marginRight = `${spaceBetween}px`;
        $item.style.flexShrink = 0;
        $marqueeInner.append($item);

        const size = getElSize($item);
        // Защита от нулевых размеров (например, display:none)
        if (size <= 0) return;
        sumSize += size + spaceBetween;
        firstScreenVisibleSize += size + spaceBetween;
      });

      // Если всё ещё 0 — откат и скажем «позже»
      if (firstScreenVisibleSize <= 0) {
        $marqueeInner.innerHTML = "";
        cacheArray.forEach((n) => {
          n.style.marginRight = `${spaceBetween}px`;
          n.style.flexShrink = 0;
          $marqueeInner.append(n);
        });
        return false;
      }

      // 3) Правая «подушка»
      const targetSize = parentWidth * 2 + firstScreenVisibleSize;
      let index = 0;
      let safety = 0; // лимит на количество клонов (анти-бесконечность)

      while (sumSize < targetSize && $children.length > 0) {
        if (!$children[index]) index = 0;
        const $clone = $children[index].cloneNode(true);
        $clone.style.marginRight = `${spaceBetween}px`;
        $clone.style.flexShrink = 0;
        $marqueeInner.appendChild($clone);

        const size = getElSize($clone);
        if (size <= 0) {
          // если размер странный — ограничим цикл
          if (++safety > 2000) break;
          index++;
          continue;
        }

        sumSize += size + spaceBetween;
        index++;

        if (++safety > 2000) break; // жёсткий предохранитель
      }

      return true;
    };

    // --- РЕНДЕР С КОНТРОЛЕМ ЖИЗНЕННОГО ЦИКЛА ---
    const render = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      const easing = 0.05;
      const maxSpeed = (isReverse ? 1 : -1) * (speed / 1000);
      const targetSpeed = isDragging || isPaused ? 0 : maxSpeed;
      velocity += (targetSpeed - velocity) * easing;

      currentX += velocity * delta;

      if (currentX <= -firstScreenVisibleSize * 2) {
        currentX += firstScreenVisibleSize;
      }
      if (currentX >= -firstScreenVisibleSize) {
        currentX -= firstScreenVisibleSize;
      }

      $marqueeInner.style.transform = `translateX(${currentX}px)`;
      rafId = requestAnimationFrame(render);
    };

    // --- DRAG C ОСЕВОЙ БЛОКИРОВКОЙ И HMR-БЕЗОПАСНОСТЬЮ ---
    const initDrag = () => {
      $marqueeInner.style.cursor = isDraggable ? "grab" : "";
      if (isDraggable) $marqueeInner.style.touchAction = "pan-y";
      if (!isDraggable) return;

      const getPointerX = (e) => (e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX);
      const getPointerY = (e) => (e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY);

      let isPointerDown = false;
      let lockAxis = null; // 'x' | 'y' | null
      const moveThreshold = 6;
      const angleRatio = 1.2;
      let dragStartTime = 0;

      onPointerDown = (e) => {
        isPointerDown = true;
        isDragging = false;
        lockAxis = null;

        startX = getPointerX(e);
        startY = getPointerY(e);
        dragStartX = currentX;
        dragStartTime = performance.now();

        if (e.type === "mousedown") e.preventDefault();
        $marqueeInner.style.cursor = "grabbing";

        window.addEventListener("mousemove", onPointerMove, { passive: false });
        window.addEventListener("mouseup", onPointerUp, { passive: true });
        window.addEventListener("touchmove", onPointerMove, { passive: false });
        window.addEventListener("touchend", onPointerUp, { passive: true });
        window.addEventListener("touchcancel", onPointerUp, { passive: true });
      };

      onPointerMove = (e) => {
        if (!isPointerDown) return;

        const x = getPointerX(e);
        const y = getPointerY(e);
        const dx = x - startX;
        const dy = y - startY;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);

        if (!lockAxis) {
          if (adx < moveThreshold && ady < moveThreshold) return;

          if (adx > ady * angleRatio) {
            lockAxis = "x";
            isDragging = true;
            isPaused = true;
            dragStartX = currentX;
            startX = x;
            startY = y;
          } else if (ady > adx * angleRatio) {
            lockAxis = "y";
          } else {
            return;
          }
        }

        if (lockAxis === "y") {
          return; // отдаём странице
        }

        if (e.cancelable) e.preventDefault();

        const delta = x - startX;
        currentX = dragStartX + delta;
      };

      onPointerUp = () => {
        if (isDragging) {
          const dragDistance = currentX - dragStartX;
          const dragDuration = Math.max(performance.now() - dragStartTime, 16);
          const rawVelocity = dragDistance / dragDuration;

          const maxInertia = 1.5;
          const minThreshold = 0.1;
          velocity =
            Math.abs(rawVelocity) > minThreshold
              ? Math.max(-maxInertia, Math.min(maxInertia, rawVelocity))
              : 0;
        }

        isPointerDown = false;
        isDragging = false;
        lockAxis = null;
        isPaused = false;
        $marqueeInner.style.cursor = "grab";

        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);
        window.removeEventListener("touchcancel", onPointerUp);
      };

      onMouseLeave = () => {
        // завершаем жест, если ушли курсором
        if (document.pointerLockElement) return;
        if (!isPointerDown) return;
        onPointerUp();
      };

      $marqueeInner.addEventListener("mousedown", onPointerDown);
      $marqueeInner.addEventListener("touchstart", onPointerDown, { passive: true });
      $marqueeInner.addEventListener("mouseleave", onMouseLeave);
    };

    // --- УНИЧТОЖЕНИЕ (важно для HMR/повторной инициализации) ---
    const destroy = () => {
      cancelAnimationFrame(rafId);
      rafId = null;

      if ($marqueeInner) {
        $marqueeInner.style.cursor = "";
        $marqueeInner.style.touchAction = "";
        $marqueeInner.style.transform = "";

        $marqueeInner.removeEventListener("mousedown", onPointerDown);
        $marqueeInner.removeEventListener("touchstart", onPointerDown);
        $marqueeInner.removeEventListener("mouseleave", onMouseLeave);
      }

      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("touchcancel", onPointerUp);

      // позволим повторную инициализацию в будущем при необходимости
      delete $wrapper.dataset.flsMarqueeInit;
    };

    // На случай ухода со страницы/пересборки
    window.addEventListener("beforeunload", destroy);

    // --- ИНИЦИАЛИЗАЦИЯ С ОЖИДАНИЕМ РАЗМЕРОВ ---
    const init = () => {
      // ждём, пока элементы получат ненулевые размеры (CSS/шрифты)
      let attempts = 0;
      const tryInit = () => {
        attempts++;
        if (!addDuplicateElements()) {
          if (attempts < 10) {
            requestAnimationFrame(tryInit);
            return;
          }
          // fallback: старт без автоклонов (чтобы не зависло)
          firstScreenVisibleSize = Math.max(
            1,
            Array.from($marqueeInner.children).reduce((acc, n) => acc + getElSize(n) + spaceBetween, 0)
          );
        }
        currentX = 0;
        lastFrameTime = performance.now();
        initDrag();

        if ($wrapper.hasAttribute("data-fls-marquee-pause")) {
          $marqueeInner.addEventListener("mouseenter", () => {
            if (!isDragging) isPaused = true;
          });
          $marqueeInner.addEventListener("mouseleave", () => {
            isPaused = false;
          });
        }

        rafId = requestAnimationFrame(render);
      };

      tryInit();
    };

    init();
  });
};

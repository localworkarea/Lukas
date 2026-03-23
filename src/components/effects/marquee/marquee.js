import { FLS } from "@js/common/functions.js";

import "./marquee.scss";



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
    let isManualAnimating = false; // new for buttons navigation
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
      // const targetSize = parentWidth * 2 + firstScreenVisibleSize;
      const targetSize = parentWidth + firstScreenVisibleSize;
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

    // --- ПОЛУЧЕНИЕ ШИРИНІ 1 элемента ---- 
    // new for buttons navigation
    const getItemStep = () => {
      if (!$marqueeInner.children.length) return 0;
      const first = $marqueeInner.children[0];
      return getElSize(first) + spaceBetween;
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

    // --- Анимация "перелистывания" ==============
     // new for buttons navigation
    const animateTo = (targetX) => {
      const duration = 800; // быстрее основной анимации
      const start = performance.now();
      const from = currentX;

      isManualAnimating = true;
      isPaused = true;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOut(progress);
      
        currentX = from + (targetX - from) * eased;
      
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          isManualAnimating = false;
          isPaused = false;
        }
      };
    
      requestAnimationFrame(tick);
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

    // --- ЛОГИКА КНОПОК ПЕРЕЛИСТЫВАНИЯ --------
     // new for buttons navigation
    const initButtons = () => {
      // 🔑 ищем ближайший wrapper
      const $container = $wrapper.closest("[data-fls-marquee-wrapper]");
      if (!$container) return;

      const $prev = $container.querySelector('[data-fls-marquee-btn="prev"]');
      const $next = $container.querySelector('[data-fls-marquee-btn="next"]');

      // 👉 если кнопок нет — просто выходим (логика не активируется)
      if (!$prev && !$next) return;

      // ✅ защита от повторного навешивания
      if ($container.dataset.flsMarqueeBtnsInit === "true") return;
      $container.dataset.flsMarqueeBtnsInit = "true";

      const move = (dir) => {
        if (isManualAnimating) return;
      
        const step = getItemStep();
        if (!step) return;
      
        const target = currentX + step * dir;
        animateTo(target);
      };
    
      // prev = вправо
      $prev?.addEventListener("click", () => move(1));
    
      // next = влево
      $next?.addEventListener("click", () => move(-1));
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

        initButtons();  // new for buttons navigation

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

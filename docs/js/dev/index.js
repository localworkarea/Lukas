import { a as addLoadedAttr, i as isMobile } from "./app.min.js";
class DynamicAdapt {
  constructor() {
    this.daClassname = "--dynamic";
    this.init();
  }
  init() {
    this.objects = [];
    this.nodes = [...document.querySelectorAll("[data-fls-dynamic]")];
    this.nodes.forEach((node) => {
      const data = node.dataset.flsDynamic.trim();
      const dataArray = data.split(",");
      const object = {};
      object.element = node;
      object.parent = node.parentNode;
      const selector = dataArray[0]?.trim();
      const breakpoint = dataArray[1]?.trim() || "767.98";
      const place = dataArray[2]?.trim() || "last";
      const type = dataArray[3]?.trim() || "max";
      object.breakpoint = breakpoint;
      object.place = place;
      object.type = type;
      object.index = this.indexInParent(object.parent, object.element);
      const destination = document.querySelector(selector);
      if (destination) {
        object.destination = destination;
      }
      this.objects.push(object);
    });
    this.arraySort(this.objects);
    const mediaGroups = {};
    this.objects.forEach((obj) => {
      const mediaKey = `(${obj.type}-width: ${obj.breakpoint / 16}em),${obj.breakpoint},${obj.type}`;
      if (!mediaGroups[mediaKey]) {
        mediaGroups[mediaKey] = [];
      }
      mediaGroups[mediaKey].push(obj);
    });
    Object.entries(mediaGroups).forEach(([media, objects]) => {
      const [mediaQuery, breakpoint, type] = media.split(",");
      const matchMedia = window.matchMedia(mediaQuery);
      matchMedia.addEventListener("change", () => {
        this.mediaHandler(matchMedia, objects);
      });
      this.mediaHandler(matchMedia, objects);
    });
  }
  mediaHandler(matchMedia, objects) {
    if (matchMedia.matches) {
      objects.forEach((object) => {
        if (object.destination) {
          this.moveTo(object.place, object.element, object.destination);
        }
      });
    } else {
      objects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, index);
        }
      });
    }
  }
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    const index = place === "last" || place === "first" ? place : parseInt(place, 10);
    if (index === "last" || index >= destination.children.length) {
      destination.append(element);
    } else if (index === "first") {
      destination.prepend(element);
    } else {
      destination.children[index].before(element);
    }
  }
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== void 0) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }
  arraySort(arr) {
    arr.sort((a, b) => {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }
        if (a.place === "first" || b.place === "last") {
          return -1;
        }
        if (a.place === "last" || b.place === "first") {
          return 1;
        }
        return 0;
      }
      return a.breakpoint - b.breakpoint;
    });
  }
}
if (document.querySelector("[data-fls-dynamic]")) {
  window.addEventListener("load", () => new DynamicAdapt());
}
class MousePRLX {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true
    };
    this.config = Object.assign(defaultConfig, props);
    if (this.config.init) {
      const paralaxMouse = document.querySelectorAll("[data-fls-mouse]");
      if (paralaxMouse.length) {
        this.paralaxMouseInit(paralaxMouse);
      }
    }
  }
  paralaxMouseInit(paralaxMouse) {
    paralaxMouse.forEach((el) => {
      const paralaxMouseWrapper = el.closest("[data-fls-mouse-wrapper]");
      const paramСoefficientX = +el.dataset.flsMouseCx || 100;
      const paramСoefficientY = +el.dataset.flsMouseCy || 100;
      const directionX = el.hasAttribute("data-fls-mouse-dxr") ? -1 : 1;
      const directionY = el.hasAttribute("data-fls-mouse-dyr") ? -1 : 1;
      const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;
      let positionX = 0, positionY = 0;
      let coordXprocent = 0, coordYprocent = 0;
      setMouseParallaxStyle();
      if (paralaxMouseWrapper) {
        mouseMoveParalax(paralaxMouseWrapper);
      } else {
        mouseMoveParalax();
      }
      function setMouseParallaxStyle() {
        const distX = coordXprocent - positionX;
        const distY = coordYprocent - positionY;
        positionX = positionX + distX * paramAnimation / 1e3;
        positionY = positionY + distY * paramAnimation / 1e3;
        el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0) rotate(0.02deg);`;
        requestAnimationFrame(setMouseParallaxStyle);
      }
      function mouseMoveParalax(wrapper = window) {
        wrapper.addEventListener("mousemove", function(e) {
          const offsetTop = el.getBoundingClientRect().top + window.scrollY;
          if (offsetTop >= window.scrollY || offsetTop + el.offsetHeight >= window.scrollY) {
            const parallaxWidth = window.innerWidth;
            const parallaxHeight = window.innerHeight;
            const coordX = e.clientX - parallaxWidth / 2;
            const coordY = e.clientY - parallaxHeight / 2;
            coordXprocent = coordX / parallaxWidth * 100;
            coordYprocent = coordY / parallaxHeight * 100;
          }
        });
      }
    });
  }
}
document.querySelector("[data-fls-mouse]") ? window.addEventListener("load", new MousePRLX({})) : null;
document.addEventListener("DOMContentLoaded", () => {
  marquee();
});
const marquee = () => {
  const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
  if (!$marqueeArray.length) return;
  const getElSize = ($el) => $el?.offsetWidth || 0;
  $marqueeArray.forEach(($wrapper) => {
    if ($wrapper.dataset.flsMarqueeInit === "true") return;
    $wrapper.dataset.flsMarqueeInit = "true";
    const ATTR = {
      inner: "data-fls-marquee-inner",
      item: "data-fls-marquee-item"
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
    const buildStructure = () => {
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
    const itemMargin = parseFloat(getComputedStyle($items[0]).getPropertyValue("margin-right")) || 0;
    const spaceBetween = !isNaN(itemMargin) ? itemMargin : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
    const addDuplicateElements = () => {
      const parentWidth = getElSize($wrapper);
      if (parentWidth <= 0) return false;
      let sumSize = 0;
      firstScreenVisibleSize = 0;
      let $children = Array.from($marqueeInner.children);
      if (!cacheArray.length) {
        cacheArray = $children;
      } else {
        $children = [...cacheArray];
      }
      $marqueeInner.style.display = "flex";
      $marqueeInner.innerHTML = "";
      $children.slice().reverse().forEach(($item) => {
        const $clone = $item.cloneNode(true);
        $clone.style.marginRight = `${spaceBetween}px`;
        $clone.style.flexShrink = 0;
        $marqueeInner.insertBefore($clone, $marqueeInner.firstChild);
      });
      $children.forEach(($item) => {
        $item.style.marginRight = `${spaceBetween}px`;
        $item.style.flexShrink = 0;
        $marqueeInner.append($item);
        const size = getElSize($item);
        if (size <= 0) return;
        sumSize += size + spaceBetween;
        firstScreenVisibleSize += size + spaceBetween;
      });
      if (firstScreenVisibleSize <= 0) {
        $marqueeInner.innerHTML = "";
        cacheArray.forEach((n) => {
          n.style.marginRight = `${spaceBetween}px`;
          n.style.flexShrink = 0;
          $marqueeInner.append(n);
        });
        return false;
      }
      const targetSize = parentWidth * 2 + firstScreenVisibleSize;
      let index = 0;
      let safety = 0;
      while (sumSize < targetSize && $children.length > 0) {
        if (!$children[index]) index = 0;
        const $clone = $children[index].cloneNode(true);
        $clone.style.marginRight = `${spaceBetween}px`;
        $clone.style.flexShrink = 0;
        $marqueeInner.appendChild($clone);
        const size = getElSize($clone);
        if (size <= 0) {
          if (++safety > 2e3) break;
          index++;
          continue;
        }
        sumSize += size + spaceBetween;
        index++;
        if (++safety > 2e3) break;
      }
      return true;
    };
    const render = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;
      const easing = 0.05;
      const maxSpeed = (isReverse ? 1 : -1) * (speed / 1e3);
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
    const initDrag = () => {
      $marqueeInner.style.cursor = isDraggable ? "grab" : "";
      if (isDraggable) $marqueeInner.style.touchAction = "pan-y";
      if (!isDraggable) return;
      const getPointerX = (e) => e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      const getPointerY = (e) => e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
      let isPointerDown = false;
      let lockAxis = null;
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
          return;
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
          velocity = Math.abs(rawVelocity) > minThreshold ? Math.max(-maxInertia, Math.min(maxInertia, rawVelocity)) : 0;
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
        if (document.pointerLockElement) return;
        if (!isPointerDown) return;
        onPointerUp();
      };
      $marqueeInner.addEventListener("mousedown", onPointerDown);
      $marqueeInner.addEventListener("touchstart", onPointerDown, { passive: true });
      $marqueeInner.addEventListener("mouseleave", onMouseLeave);
    };
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
      delete $wrapper.dataset.flsMarqueeInit;
    };
    window.addEventListener("beforeunload", destroy);
    const init = () => {
      let attempts = 0;
      const tryInit = () => {
        attempts++;
        if (!addDuplicateElements()) {
          if (attempts < 10) {
            requestAnimationFrame(tryInit);
            return;
          }
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
addLoadedAttr();
document.addEventListener("DOMContentLoaded", () => {
  function updateClipPath(angleDeg = -8) {
    const elements = document.querySelectorAll("[data-fls-clip]");
    if (!elements.length) return;
    const angleRad = angleDeg * (Math.PI / 180);
    elements.forEach((el) => {
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
  const dataInfoEl = document.querySelector("[data-info-el]");
  if (dataInfoEl) {
    let getItems = function(block) {
      return block.querySelectorAll(".info-cake__img, .info-cake__item");
    }, initDisplay = function() {
      subBlocks.forEach((block) => {
        getItems(block).forEach((child, i) => {
          child.classList.toggle("--active", i === 0);
        });
      });
    }, showInfoByIndex = function(index) {
      const targetIndex = index - 1;
      subBlocks.forEach((block) => {
        getItems(block).forEach((child, i) => {
          child.classList.toggle("--active", i === targetIndex);
        });
      });
    }, clearAllHoverClasses = function() {
      buttons.forEach((btn) => {
        btn.parentElement?.classList.remove("--hover");
        btn.classList.remove("--hover-el");
      });
    }, setHoverOn = function(btn) {
      clearAllHoverClasses();
      btn.parentElement?.classList.add("--hover");
      btn.classList.add("--hover-el");
    };
    const subBlocks = [...dataInfoEl.querySelectorAll("[data-info-subel]")];
    const buttons = [...document.querySelectorAll("[data-info]")];
    initDisplay();
    buttons.forEach((btn) => {
      const index = parseInt(btn.dataset.info, 10);
      if (isNaN(index)) return;
      const handleInteraction = () => {
        showInfoByIndex(index);
        setHoverOn(btn);
      };
      btn.addEventListener("mouseenter", handleInteraction);
      btn.addEventListener("click", handleInteraction);
      btn.addEventListener("mouseleave", () => {
        btn.parentElement?.classList.remove("--hover");
      });
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-info]")) {
        clearAllHoverClasses();
      }
    });
  }
  let watcherstrigger = [];
  let lastScrollY = window.scrollY;
  function parseTriggerValues(value) {
    const parts = value.split(",").map((s) => s.trim());
    return [parts[0] || "top", parts[1] || "top"];
  }
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
        return parseFloat(value);
      }
    }
    return 0;
  }
  function initTriggers() {
    const triggers = document.querySelectorAll("[data-trigger-start]");
    if (!triggers.length) return;
    watcherstrigger = Array.from(triggers).map((el) => {
      const [startElementPoint, startViewportPoint] = parseTriggerValues(el.dataset.triggerStart);
      return {
        element: el,
        startElementPoint,
        startViewportPoint,
        isActive: false
      };
    });
    window.addEventListener("scroll", updateTrigger);
    requestAnimationFrame(() => {
      setTimeout(() => {
        lastScrollY = window.scrollY;
        updateTrigger(true);
      }, 50);
    });
  }
  function updateTrigger(forceCheck = false) {
    const viewportHeight = window.innerHeight;
    const scrollingDown = window.scrollY > lastScrollY;
    const scrollingUp = window.scrollY < lastScrollY;
    watcherstrigger.forEach((watcher) => {
      const rect = watcher.element.getBoundingClientRect();
      const elementOffset = parsePoint(watcher.startElementPoint, rect.height);
      const viewportOffset = parsePoint(watcher.startViewportPoint, viewportHeight);
      const elementTriggerPosition = rect.top + elementOffset;
      if (!watcher.isActive && elementTriggerPosition <= viewportOffset && (scrollingDown || forceCheck)) {
        watcher.element.classList.add("--view");
        watcher.isActive = true;
      }
      if (watcher.isActive && elementTriggerPosition > viewportOffset && scrollingUp) {
        watcher.element.classList.remove("--view");
        watcher.isActive = false;
      }
    });
    lastScrollY = window.scrollY;
  }
  initTriggers();
  const popupCake = document.querySelector('[data-fls-popup="popup-cake"]');
  if (popupCake) {
    const popupTitle = popupCake.querySelector(".popup-cake__title");
    const popupDescr = popupCake.querySelector(".popup-cake__txt");
    const popupSpecs = popupCake.querySelector(".popup-cake__specification");
    const orderBtn = popupCake.querySelector(".popup-cake__btn");
    const popupImg = popupCake.querySelector(".popup-cake__picture img");
    const catalogItems = document.querySelectorAll('[data-fls-popup-link="popup-cake"]');
    catalogItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const info = item.querySelector("[data-popup-info]");
        if (!info) return;
        popupTitle.textContent = "";
        const infoTitle = info.querySelector("[data-popup-title]");
        if (infoTitle) popupTitle.textContent = infoTitle.textContent.trim();
        popupDescr.innerHTML = "";
        const infoDescr = info.querySelector("[data-popup-descr]");
        if (infoDescr) popupDescr.innerHTML = infoDescr.innerHTML.trim();
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
        const catalogImg = item.querySelector("img");
        if (catalogImg && popupImg) {
          popupImg.src = catalogImg.getAttribute("src") || popupImg.src;
          popupImg.alt = catalogImg.getAttribute("alt") || "Image";
        }
        orderBtn.setAttribute("href", info.dataset.popupOrder || "#");
      });
    });
  }
  let lastWidth = window.innerWidth;
  const resizeObserver = new ResizeObserver((entries) => {
    requestAnimationFrame(() => {
      entries.forEach((entry) => {
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
  if (isMobile.iOS()) {
    document.querySelector(".cake-hero");
    if (popupCases) {
      const videoElements = document.querySelectorAll("video");
      if (videoElements.length > 0) {
        let attemptPlay = function(videoElement) {
          if (!videoElement.playing) {
            videoElement.play().catch((error) => {
              console.error("Failed to play video:", error);
            });
          }
        };
        Object.defineProperty(HTMLMediaElement.prototype, "playing", {
          get: function() {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
          }
        });
        videoElements.forEach((videoElement) => {
          if (!videoElement.hasAttribute("playsinline")) {
            videoElement.setAttribute("playsinline", "");
          }
        });
        document.body.addEventListener("click", () => {
          videoElements.forEach((videoElement) => attemptPlay(videoElement));
        });
        document.body.addEventListener("touchstart", () => {
          videoElements.forEach((videoElement) => attemptPlay(videoElement));
        });
      }
    }
  }
});

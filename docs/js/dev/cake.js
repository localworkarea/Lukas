import { e as addLoadedAttr, i as isMobile } from "./app.min.js";
import "./popup.min.js";
import "./marquee.min.js";
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

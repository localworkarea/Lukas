(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const isMobile = { Android: function() {
  return navigator.userAgent.match(/Android/i);
}, BlackBerry: function() {
  return navigator.userAgent.match(/BlackBerry/i);
}, iOS: function() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}, Opera: function() {
  return navigator.userAgent.match(/Opera Mini/i);
}, Windows: function() {
  return navigator.userAgent.match(/IEMobile/i);
}, any: function() {
  return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
} };
let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.setAttribute("data-fls-scrolllock", "");
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
    const [value, type = "max"] = item.dataset[dataSetValue].split(",");
    return { value, type, item };
  });
  if (media.length === 0) return [];
  const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
  const uniqueQueries = [...new Set(breakpointsArray)];
  return uniqueQueries.map((query) => {
    const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
    const matchMedia = window.matchMedia(mediaQuery);
    const itemsArray = media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType);
    return { itemsArray, matchMedia };
  });
}
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-fls-popup-link",
      // Атрибут для кнопки, яка викликає попап
      attributeCloseButton: "data-fls-popup-close",
      // Атрибут для кнопки, що закриває попап
      fixElementSelector: "[data-fls-lp]",
      // Атрибут для елементів із лівим паддингом (які fixed)
      attributeMain: "data-fls-popup",
      youtubeAttribute: "data-fls-popup-youtube",
      youtubePlaceAttribute: "data-fls-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        // popupWrapper: 'popup__wrapper',
        popupContent: "data-fls-popup-body",
        popupActive: "data-fls-popup-active",
        // Додається для попапа, коли він відкривається
        bodyActive: "data-fls-popup-open"
        // Додається для боді, коли попап відкритий
      },
      focusCatch: true,
      // Фокус усередині попапа зациклений
      closeEsc: true,
      // Закриття ESC
      bodyLock: true,
      // Блокування скролла
      hashSettings: {
        location: false,
        // Хеш в адресному рядку
        goHash: false
        // Перехід по наявності в адресному рядку
      },
      on: {
        // Події
        beforeOpen: function() {
        },
        afterOpen: function() {
        },
        beforeClose: function() {
        },
        afterClose: function() {
        }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = [
      "a[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "button:not([disabled]):not([aria-hidden])",
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "area[href]",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])'
    ];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.breakpointMediaQuery = null;
    this.bodyLock = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.buildPopup();
    this.eventsPopup();
  }
  buildPopup() {
  }
  eventsPopup() {
    document.addEventListener("click", (function(e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        const popupWidth = buttonOpen.getAttribute("data-fls-popup-width");
        if (popupWidth) {
          const tempElement = document.createElement("div");
          tempElement.dataset.breakpoint = `${popupWidth},max`;
          const mdQueriesArray = dataMediaQueries([tempElement], "breakpoint");
          if (mdQueriesArray && mdQueriesArray.length) {
            const mediaQuery = mdQueriesArray[0].matchMedia;
            if (!mediaQuery.matches) return;
            this.breakpointMediaQuery = mediaQuery;
            this.breakpointMediaQuery.addEventListener("change", this._breakpointChecker.bind(this));
          }
        }
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        if (this._dataValue !== "error") {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`[${this.options.classes.popupContent}]`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }).bind(this));
    document.addEventListener("keydown", (function(e) {
      if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && e.which == 9 && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }).bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", (function() {
        if (window.location.hash) {
          this._openToHash();
        } else {
          this.close(this.targetOpen.selector);
        }
      }).bind(this));
      if (window.location.hash) {
        this._openToHash();
      }
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.hasAttribute("data-fls-scrolllock") && !this.isOpen ? true : false;
      if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(`[${this.options.attributeMain}=${this.targetOpen.selector}]`);
      if (this.targetOpen.element) {
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.setAttribute(this.options.classes.popupActive, "");
        document.documentElement.setAttribute(this.options.classes.bodyActive, "");
        if (!this._reopen) {
          !this.bodyLock ? bodyLock() : null;
        } else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        setTimeout(() => {
          this._focusTrap();
        }, 50);
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
      this.previousOpen.selector = selectorValue;
    }
    if (!this.isOpen || !bodyLockStatus) {
      return;
    }
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    this.previousOpen.element.removeAttribute(this.options.classes.popupActive);
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.removeAttribute(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
    }
    if (this.breakpointMediaQuery) {
      this.breakpointMediaQuery.removeEventListener("change", this._breakpointChecker.bind(this));
      this.breakpointMediaQuery = null;
    }
    this._removeHash();
    if (this._selectorOpen) {
      this.lastClosed.selector = this.previousOpen.selector;
      this.lastClosed.element = this.previousOpen.element;
    }
    this.options.on.afterClose(this);
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    setTimeout(() => {
      this._focusTrap();
    }, 50);
  }
  // Отримання хешу 
  _getHash() {
    if (this.options.hashSettings.location) {
      this.hash = `#${this.targetOpen.selector}`;
    }
  }
  _openToHash() {
    let classInHash = window.location.hash.replace("#", "");
    document.querySelector(`[${this.options.attributeOpenButton}="${classInHash}"]`);
    if (classInHash) this.open(classInHash);
  }
  // Встановлення хеша
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
  _focusTrap() {
    const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
    if (!this.isOpen && this.lastFocusEl) {
      this.lastFocusEl.focus();
    } else {
      focusable[0].focus();
    }
  }
  _breakpointChecker(e) {
    if (!e.matches && this.isOpen) {
      this.close();
    }
  }
}
document.querySelector("[data-fls-popup]") ? window.addEventListener("load", () => window.flsPopup = new Popup({})) : null;
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
const marquee = () => {
  const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
  const ATTR_NAMES = {
    inner: "data-fls-marquee-inner",
    item: "data-fls-marquee-item"
  };
  if (!$marqueeArray.length) return;
  const { head } = document;
  const debounce = (delay, fn) => {
    let timerId;
    return (...args) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
  };
  const onWindowWidthResize = (cb) => {
    if (!cb && !isFunction(cb)) return;
    let prevWidth = 0;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth !== currentWidth) {
        prevWidth = currentWidth;
        cb();
      }
    };
    window.addEventListener("resize", debounce(50, handleResize));
    handleResize();
  };
  const buildMarquee = (marqueeNode) => {
    if (!marqueeNode) return;
    const $marquee = marqueeNode;
    const $childElements = $marquee.children;
    if (!$childElements.length) return;
    Array.from($childElements).forEach(($childItem) => $childItem.setAttribute(ATTR_NAMES.item, ""));
    const htmlStructure = `<div ${ATTR_NAMES.inner}>${$marquee.innerHTML}</div>`;
    $marquee.innerHTML = htmlStructure;
  };
  const getElSize = ($el, isVertical) => {
    if (isVertical) return $el.offsetHeight;
    return $el.offsetWidth;
  };
  $marqueeArray.forEach(($wrapper) => {
    if (!$wrapper) return;
    buildMarquee($wrapper);
    const $marqueeInner = $wrapper.firstElementChild;
    let cacheArray = [];
    if (!$marqueeInner) return;
    const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
    const $items = $wrapper.querySelectorAll(`[${ATTR_NAMES.item}]`);
    const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
    const isMousePaused = $wrapper.hasAttribute("data-fls-marquee-pause");
    const direction = $wrapper.getAttribute("data-fls-marquee-direction");
    const isVertical = direction === "bottom" || direction === "top";
    const animName = `marqueeAnimation-${Math.floor(Math.random() * 1e7)}`;
    let spaceBetweenItem = parseFloat(window.getComputedStyle($items[0])?.getPropertyValue("margin-right"));
    let spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
    let startPosition = parseFloat($wrapper.getAttribute("data-fls-marquee-start")) || 0;
    let sumSize = 0;
    let firstScreenVisibleSize = 0;
    let initialSizeElements = 0;
    let initialElementsLength = $marqueeInner.children.length;
    let index = 0;
    let counterDuplicateElements = 0;
    const initEvents = () => {
      if (startPosition) $marqueeInner.addEventListener("animationiteration", onChangeStartPosition);
      if (!isMousePaused) return;
      $marqueeInner.removeEventListener("mouseenter", onChangePaused);
      $marqueeInner.removeEventListener("mouseleave", onChangePaused);
      $marqueeInner.addEventListener("mouseenter", onChangePaused);
      $marqueeInner.addEventListener("mouseleave", onChangePaused);
    };
    const onChangeStartPosition = () => {
      startPosition = 0;
      $marqueeInner.removeEventListener("animationiteration", onChangeStartPosition);
      onResize();
    };
    const setBaseStyles = (firstScreenVisibleSize2) => {
      let baseStyle = "display: flex; flex-wrap: nowrap;";
      if (isVertical) {
        baseStyle += `
				flex-direction: column;
				position: relative;
				will-change: transform;`;
        if (direction === "bottom") {
          baseStyle += `top: -${firstScreenVisibleSize2}px;`;
        }
      } else {
        baseStyle += `
				position: relative;
				will-change: transform;`;
        if (direction === "right") {
          baseStyle += `inset-inline-start: -${firstScreenVisibleSize2}px;;`;
        }
      }
      $marqueeInner.style.cssText = baseStyle;
    };
    const setdirectionAnim = (totalWidth) => {
      switch (direction) {
        case "right":
        case "bottom":
          return totalWidth;
        default:
          return -totalWidth;
      }
    };
    const animation = () => {
      const keyFrameCss = `@keyframes ${animName} {
					 0% {
						 transform: translate${isVertical ? "Y" : "X"}(${!isVertical && window.stateRtl ? -startPosition : startPosition}%);
					 }
					 100% {
						 transform: translate${isVertical ? "Y" : "X"}(${setdirectionAnim(
        !isVertical && window.stateRtl ? -firstScreenVisibleSize : firstScreenVisibleSize
      )}px);
					 }
				 }`;
      const $style = document.createElement("style");
      $style.classList.add(animName);
      $style.innerHTML = keyFrameCss;
      head.append($style);
      $marqueeInner.style.animation = `${animName} ${(firstScreenVisibleSize + startPosition * firstScreenVisibleSize / 100) / speed}s infinite linear`;
    };
    const addDublicateElements = () => {
      sumSize = firstScreenVisibleSize = initialSizeElements = counterDuplicateElements = index = 0;
      const $parentNodeWidth = getElSize($wrapper, isVertical);
      let $childrenEl = Array.from($marqueeInner.children);
      if (!$childrenEl.length) return;
      if (!cacheArray.length) {
        cacheArray = $childrenEl.map(($item) => $item);
      } else {
        $childrenEl = [...cacheArray];
      }
      $marqueeInner.style.display = "flex";
      if (isVertical) $marqueeInner.style.flexDirection = "column";
      $marqueeInner.innerHTML = "";
      $childrenEl.forEach(($item) => {
        $marqueeInner.append($item);
      });
      $childrenEl.forEach(($item) => {
        if (isVertical) {
          $item.style.marginBottom = `${spaceBetween}px`;
        } else {
          $item.style.marginRight = `${spaceBetween}px`;
          $item.style.flexShrink = 0;
        }
        const sizeEl = getElSize($item, isVertical);
        sumSize += sizeEl + spaceBetween;
        firstScreenVisibleSize += sizeEl + spaceBetween;
        initialSizeElements += sizeEl + spaceBetween;
        counterDuplicateElements += 1;
        return sizeEl;
      });
      const $multiplyWidth = $parentNodeWidth * 2 + initialSizeElements;
      for (; sumSize < $multiplyWidth; index += 1) {
        if (!$childrenEl[index]) index = 0;
        const $cloneNone = $childrenEl[index].cloneNode(true);
        const $lastElement = $marqueeInner.children[index];
        $marqueeInner.append($cloneNone);
        sumSize += getElSize($lastElement, isVertical) + spaceBetween;
        if (firstScreenVisibleSize < $parentNodeWidth || counterDuplicateElements % initialElementsLength !== 0) {
          counterDuplicateElements += 1;
          firstScreenVisibleSize += getElSize($lastElement, isVertical) + spaceBetween;
        }
      }
      setBaseStyles(firstScreenVisibleSize);
    };
    const correctSpaceBetween = () => {
      if (spaceBetweenItem) {
        $items.forEach(($item) => $item.style.removeProperty("margin-right"));
        spaceBetweenItem = parseFloat(window.getComputedStyle($items[0]).getPropertyValue("margin-right"));
        spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
      }
    };
    const init = () => {
      correctSpaceBetween();
      addDublicateElements();
      animation();
      initEvents();
    };
    const onResize = () => {
      head.querySelector(`.${animName}`)?.remove();
      init();
    };
    const onChangePaused = (e) => {
      const { type, target } = e;
      target.style.animationPlayState = type === "mouseenter" ? "paused" : "running";
    };
    onWindowWidthResize(onResize);
  });
};
marquee();
document.addEventListener("DOMContentLoaded", () => {
  function updateClipPath(angleDeg = -8) {
    const el = document.querySelector(".cake-hero__bg");
    if (!el) return;
    const width = el.offsetWidth;
    const height = el.getBoundingClientRect().height;
    const angleRad = angleDeg * (Math.PI / 180);
    const offset = Math.tan(Math.abs(angleRad)) * width;
    const yRight = height - offset;
    el.style.clipPath = `polygon(
      0 0,
      ${width}px 0,
      ${width}px ${yRight}px,
      0 ${height}px
    )`;
  }
  updateClipPath(-8);
  const dataInfoEl = document.querySelector("[data-info-el]");
  if (dataInfoEl) {
    let initDisplay2 = function() {
      subBlocks.forEach((block) => {
        [...block.children].forEach((child, i) => {
          child.classList.toggle("--active", i === 0);
        });
      });
    }, showInfoByIndex2 = function(index) {
      const targetIndex = index - 1;
      subBlocks.forEach((block) => {
        [...block.children].forEach((child, i) => {
          child.classList.toggle("--active", i === targetIndex);
        });
      });
    }, clearAllHoverClasses2 = function() {
      buttons.forEach((btn) => {
        btn.parentElement?.classList.remove("--hover");
      });
    }, setHoverOn2 = function(btn) {
      clearAllHoverClasses2();
      btn.parentElement?.classList.add("--hover");
    };
    var initDisplay = initDisplay2, showInfoByIndex = showInfoByIndex2, clearAllHoverClasses = clearAllHoverClasses2, setHoverOn = setHoverOn2;
    const subBlocks = [...dataInfoEl.querySelectorAll("[data-info-subel]")];
    const buttons = [...document.querySelectorAll("[data-info]")];
    initDisplay2();
    buttons.forEach((btn) => {
      const index = parseInt(btn.dataset.info, 10);
      if (isNaN(index)) return;
      const handleInteraction = () => {
        showInfoByIndex2(index);
        setHoverOn2(btn);
      };
      btn.addEventListener("mouseenter", handleInteraction);
      btn.addEventListener("click", handleInteraction);
      btn.addEventListener("mouseleave", () => {
        btn.parentElement?.classList.remove("--hover");
      });
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-info]")) {
        clearAllHoverClasses2();
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
        let attemptPlay2 = function(videoElement) {
          if (!videoElement.playing) {
            videoElement.play().catch((error) => {
              console.error("Failed to play video:", error);
            });
          }
        };
        var attemptPlay = attemptPlay2;
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
          videoElements.forEach((videoElement) => attemptPlay2(videoElement));
        });
        document.body.addEventListener("touchstart", () => {
          videoElements.forEach((videoElement) => attemptPlay2(videoElement));
        });
      }
    }
  }
});

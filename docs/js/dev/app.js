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
function addLoadedAttr() {
  if (!document.documentElement.hasAttribute("data-fls-preloader-loading")) {
    window.addEventListener("load", function() {
      setTimeout(function() {
        document.documentElement.setAttribute("data-fls-loaded", "");
      }, 0);
    });
  }
}
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
function uniqArray(array) {
  return array.filter((item, index, self) => self.indexOf(item) === index);
}
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
      focusCatch: false,
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
      delayRemoveClass: 800,
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
    this._openerPopupElVal = null;
    this._clearClassTimer = null;
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
  _clearPopupClasses() {
    const ROOT = document.documentElement;
    const CLASS_PREFIX = "popup-el--";
    if (![...ROOT.classList].some((c) => c.startsWith(CLASS_PREFIX))) return;
    if (this._clearClassTimer) {
      clearTimeout(this._clearClassTimer);
      this._clearClassTimer = null;
    }
    this._clearClassTimer = setTimeout(() => {
      Array.from(ROOT.classList).forEach((c) => {
        if (c.startsWith(CLASS_PREFIX)) ROOT.classList.remove(c);
      });
      this._clearClassTimer = null;
    }, this.options.delayRemoveClass);
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
          this._openerPopupElVal = (buttonOpen.getAttribute("data-popup-el") || buttonOpen.closest("[data-popup-el]")?.getAttribute("data-popup-el") || "").trim() || null;
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
        if (this._clearClassTimer) {
          clearTimeout(this._clearClassTimer);
          this._clearClassTimer = null;
        }
        {
          const ROOT = document.documentElement;
          const CLASS_PREFIX = "popup-el--";
          Array.from(ROOT.classList).forEach((c) => {
            if (c.startsWith(CLASS_PREFIX)) ROOT.classList.remove(c);
          });
        }
        const elValFromOpener = this._openerPopupElVal;
        const elValFromPopup = this.targetOpen.element.getAttribute("data-popup-el")?.trim();
        const elVal = elValFromOpener || elValFromPopup;
        if (elVal) {
          document.documentElement.classList.add(`popup-el--${elVal}`);
        }
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
    this._clearPopupClasses();
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
class Parallax {
  constructor(elements) {
    if (elements.length) {
      this.elements = Array.from(elements).map((el) => new Parallax.Each(el, this.options));
    }
  }
  destroyEvents() {
    this.elements.forEach((el) => {
      el.destroyEvents();
    });
  }
  setEvents() {
    this.elements.forEach((el) => {
      el.setEvents();
    });
  }
}
Parallax.Each = class {
  constructor(parent) {
    this.parent = parent;
    this.elements = this.parent.querySelectorAll("[data-fls-parallax]");
    this.animation = this.animationFrame.bind(this);
    this.offset = 0;
    this.value = 0;
    this.smooth = parent.dataset.flsParallaxSmooth ? Number(parent.dataset.flsParallaxSmooth) : 15;
    this.setEvents();
  }
  setEvents() {
    this.animationID = window.requestAnimationFrame(this.animation);
  }
  destroyEvents() {
    window.cancelAnimationFrame(this.animationID);
  }
  animationFrame() {
    const topToWindow = this.parent.getBoundingClientRect().top;
    const heightParent = this.parent.offsetHeight;
    const heightWindow = window.innerHeight;
    const positionParent = {
      top: topToWindow - heightWindow,
      bottom: topToWindow + heightParent
    };
    const centerPoint = this.parent.dataset.flsParallaxCenter ? this.parent.dataset.flsParallaxCenter : "center";
    if (positionParent.top < 30 && positionParent.bottom > -30) {
      switch (centerPoint) {
        // верхній точці (початок батька стикається верхнього краю екрану)
        case "top":
          this.offset = -1 * topToWindow;
          break;
        // центрі екрана (середина батька у середині екрана)
        case "center":
          this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
          break;
        // Початок: нижня частина екрана = верхня частина батька
        case "bottom":
          this.offset = heightWindow - (topToWindow + heightParent);
          break;
      }
    }
    this.value += (this.offset - this.value) / this.smooth;
    this.animationID = window.requestAnimationFrame(this.animation);
    this.elements.forEach((el) => {
      const parameters = {
        axis: el.dataset.axis ? el.dataset.axis : "v",
        direction: el.dataset.flsParallaxDirection ? el.dataset.flsParallaxDirection + "1" : "-1",
        coefficient: el.dataset.flsParallaxCoefficient ? Number(el.dataset.flsParallaxCoefficient) : 5,
        additionalProperties: el.dataset.flsParallaxProperties ? el.dataset.flsParallaxProperties : ""
      };
      this.parameters(el, parameters);
    });
  }
  parameters(el, parameters) {
    if (parameters.axis == "v") {
      el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`;
    } else if (parameters.axis == "h") {
      el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
    }
  }
};
if (document.querySelector("[data-fls-parallax-parent]")) {
  new Parallax(document.querySelectorAll("[data-fls-parallax-parent]"));
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
export {
  addLoadedAttr as a,
  isMobile as i,
  uniqArray as u
};

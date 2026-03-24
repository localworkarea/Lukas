import { b as bodyLockToggle, a as bodyLockStatus, s as slideUp, c as slideToggle, i as isMobile, d as slideDown } from "./app.min.js";
import "./marquee.min.js";
const homeVideo = document.querySelectorAll("[data-fls-video]");
if (homeVideo.length > 0) {
  homeVideo.forEach((block) => {
    const btn = block.querySelector("[data-fls-video-btn]");
    const previewVideo = block.querySelector("[data-lazy-video]");
    const mainVideo = block.querySelector("[data-fls-video-main] video");
    let mainLoaded = false;
    const loadMainVideo = () => {
      if (mainLoaded) return;
      const sources = mainVideo.querySelectorAll("source");
      sources.forEach((source) => {
        source.src = source.dataset.src;
      });
      mainVideo.load();
      mainLoaded = true;
    };
    const ioMain = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadMainVideo();
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "1000px"
    });
    ioMain.observe(block);
    btn.addEventListener("click", () => {
      loadMainVideo();
      block.classList.add("--play");
      if (previewVideo) {
        previewVideo.pause();
      }
      mainVideo.muted = false;
      mainVideo.volume = 0.3;
      mainVideo.play().catch(() => {
      });
    });
  });
}
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
function initHeaderMenu() {
  const menuItemsWithSublist = document.querySelectorAll(".menu__item.menu-has-sublist");
  if (!menuItemsWithSublist.length) return;
  const media = window.matchMedia("(min-width: 62.061em)");
  let cleanupFunctions = [];
  const closeAllDesktopSubmenus = () => {
    menuItemsWithSublist.forEach((item) => {
      item.classList.remove("--show-submenu");
    });
  };
  const resetMobileSubmenus = () => {
    menuItemsWithSublist.forEach((item) => {
      const sublist = item.querySelector(".menu__sublist");
      if (!sublist) return;
      item.classList.remove("--show-submenu");
      item.classList.remove("--open");
      sublist.hidden = false;
      sublist.style.removeProperty("height");
      sublist.style.removeProperty("overflow");
      sublist.style.removeProperty("transition-duration");
      sublist.style.removeProperty("transition-property");
      sublist.style.removeProperty("padding-top");
      sublist.style.removeProperty("padding-bottom");
      sublist.style.removeProperty("margin-top");
      sublist.style.removeProperty("margin-bottom");
      sublist.classList.remove("--slide");
    });
  };
  const removeAllListeners = () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    cleanupFunctions = [];
    closeAllDesktopSubmenus();
    resetMobileSubmenus();
  };
  const initDesktopMenu = () => {
    removeAllListeners();
    menuItemsWithSublist.forEach((item) => {
      const link = item.querySelector(".menu__link");
      if (!link) return;
      if (isMobile.any()) {
        const onLinkClick = (e) => {
          e.preventDefault();
          const isOpen = item.classList.contains("--show-submenu");
          closeAllDesktopSubmenus();
          if (!isOpen) {
            item.classList.add("--show-submenu");
          }
        };
        const onDocumentClick = (e) => {
          if (!item.contains(e.target)) {
            item.classList.remove("--show-submenu");
          }
        };
        link.addEventListener("click", onLinkClick);
        document.addEventListener("click", onDocumentClick);
        cleanupFunctions.push(() => {
          link.removeEventListener("click", onLinkClick);
          document.removeEventListener("click", onDocumentClick);
        });
      } else {
        const onMouseEnter = () => {
          item.classList.add("--show-submenu");
        };
        const onMouseLeave = () => {
          item.classList.remove("--show-submenu");
        };
        item.addEventListener("mouseenter", onMouseEnter);
        item.addEventListener("mouseleave", onMouseLeave);
        cleanupFunctions.push(() => {
          item.removeEventListener("mouseenter", onMouseEnter);
          item.removeEventListener("mouseleave", onMouseLeave);
        });
      }
    });
  };
  const initMobileMenu = () => {
    removeAllListeners();
    menuItemsWithSublist.forEach((item) => {
      const link = item.querySelector(".menu__link");
      const sublist = item.querySelector(".menu__sublist");
      if (!link || !sublist) return;
      item.classList.remove("--open");
      slideUp(sublist, 0);
      const onLinkClick = (e) => {
        e.preventDefault();
        if (sublist.classList.contains("--slide")) return;
        const isHidden = sublist.hidden;
        if (isHidden) {
          item.classList.add("--open");
          slideDown(sublist, 400);
        } else {
          item.classList.remove("--open");
          slideUp(sublist, 400);
        }
      };
      link.addEventListener("click", onLinkClick);
      cleanupFunctions.push(() => {
        link.removeEventListener("click", onLinkClick);
      });
    });
  };
  const handleMediaChange = (e) => {
    if (e.matches) {
      initDesktopMenu();
    } else {
      initMobileMenu();
    }
  };
  handleMediaChange(media);
  if (media.addEventListener) {
    media.addEventListener("change", handleMediaChange);
  } else {
    media.addListener(handleMediaChange);
  }
}
initHeaderMenu();
function initLangDropdown() {
  const lang = document.querySelector(".lng");
  if (!lang) return;
  const langBtn = lang.querySelector(".lng__btn");
  const langList = lang.querySelector(".lng__list");
  if (!langBtn || !langList) return;
  slideUp(langList, 0);
  langBtn.addEventListener("click", (e) => {
    e.preventDefault();
    lang.classList.toggle("--open");
    slideToggle(langList, 400);
  });
  document.addEventListener("click", (e) => {
    if (!lang.contains(e.target) && !langList.hidden) {
      slideUp(langList, 300);
      if (lang.classList.contains("--open")) {
        lang.classList.remove("--open");
      }
    }
  });
}
initLangDropdown();
function initScrollToButtons() {
  const scrollButtons = document.querySelectorAll("[data-fls-scroll]");
  if (!scrollButtons.length) return;
  scrollButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSelector = button.dataset.flsScroll;
      if (!targetSelector) return;
      let targetElement = null;
      try {
        targetElement = document.querySelector(targetSelector);
      } catch (error) {
        console.warn(`error data-fls-scroll: ${targetSelector}`);
        return;
      }
      if (!targetElement) return;
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth"
      });
    });
  });
}
initScrollToButtons();
const videosLazy = document.querySelectorAll("[data-lazy-video]");
const io = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const video = entry.target;
    const sources = video.querySelectorAll("source");
    sources.forEach((source) => {
      source.src = source.dataset.src;
    });
    video.load();
    video.play().catch(() => {
    });
    observer.unobserve(video);
  });
}, {
  rootMargin: "1000px"
});
videosLazy.forEach((video) => io.observe(video));
const joyItems = document.querySelectorAll(".home-joy__item");
if (joyItems.length) {
  joyItems.forEach((item) => {
    const images = item.querySelectorAll("img");
    if (images.length === 0) return;
    let currentIndex = 0;
    const delay = parseInt(item.dataset.delay) || 2500;
    const duration = parseInt(item.dataset.duration) || 500;
    images.forEach((img) => {
      img.style.transitionDuration = `${duration}ms`;
    });
    images.forEach((img) => img.classList.remove("_active"));
    images[0].classList.add("_active");
    if (images.length < 2) return;
    setInterval(() => {
      images[currentIndex].classList.remove("_active");
      currentIndex++;
      if (currentIndex >= images.length) currentIndex = 0;
      images[currentIndex].classList.add("_active");
    }, delay);
  });
}

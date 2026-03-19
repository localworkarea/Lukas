import {isMobile,slideToggle,slideDown,slideUp, FLS } from "@js/common/functions.js"
import './header.scss'


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

		lang.classList.toggle('--open');
		slideToggle(langList, 400);
	});
	document.addEventListener("click", (e) => {
		if (!lang.contains(e.target) && !langList.hidden) {
			slideUp(langList, 300);
			if (lang.classList.contains('--open')) {
				lang.classList.remove('--open');
			}
		}
	});
}

initLangDropdown();
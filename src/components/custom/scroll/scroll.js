import "./scroll.scss"

function initScrollToButtons() {
	const scrollButtons = document.querySelectorAll('[data-fls-scroll]');
	if (!scrollButtons.length) return;

	scrollButtons.forEach((button) => {
		button.addEventListener('click', (e) => {
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
				behavior: 'smooth',
			});
		});
	});
}

initScrollToButtons();
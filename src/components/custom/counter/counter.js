import "./counter.scss"

document.addEventListener("DOMContentLoaded", () => {
	const counters = document.querySelectorAll("[data-fls-counter]");
	if (!counters.length) return;

	counters.forEach(counter => {
		const targetAttr = counter.getAttribute("data-fls-counter");
		if (!targetAttr) return;

		// Разбираем атрибут: "YYYY-MM-DD,HH:MM"
		const [datePart, timePart] = targetAttr.split(",");
		const targetDate = new Date(`${datePart.trim()}T${timePart.trim()}:00`);

		// Функция безопасной записи текста (если элемент есть)
		const setText = (el, value) => {
			if (el) el.textContent = value;
		};

		const daysEl = counter.querySelector('[data-fls-counter-el="days"]');
		const hoursEl = counter.querySelector('[data-fls-counter-el="hours"]');
		const minsEl = counter.querySelector('[data-fls-counter-el="minuts"]');
		const secsEl = counter.querySelector('[data-fls-counter-el="seconds"]');

		function updateCounter() {
			const now = new Date();
			let diff = targetDate - now;

			if (diff <= 0) {
				// Когда время вышло — показываем нули
				setText(daysEl, "0");
				setText(hoursEl, "0");
				setText(minsEl, "0");
				setText(secsEl, "0");
				clearInterval(intervalId);
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setText(daysEl, days);
			setText(hoursEl, hours.toString().padStart(2, "0"));
			setText(minsEl, minutes.toString().padStart(2, "0"));
			setText(secsEl, seconds.toString().padStart(2, "0"));
		}

		updateCounter();
		const intervalId = setInterval(updateCounter, 1000);
	});
});

import { FLS } from "@js/common/functions.js";
// Docs: https://www.npmjs.com/package/split-type
import SplitType from 'split-type'
// Стилі модуля
import './splittype.scss'

// function splitType() {
// 	const splitText = SplitType.create('[data-fls-splittype]', {
// 		absolute: false,
// 		tagName: 'div',
// 		lineClass: 'line',
// 		wordClass: 'word',
// 		charClass: 'char',
// 		splitClass: '',
// 		types: "lines, words, chars",
// 		split: ''
// 	})
// }

// document.querySelector('[data-fls-splittype]') ?
// 	window.addEventListener('load', splitType) : null

function processSplit(element, type) {
	let globalIndex = 0;

	if (type === 'line') {
		const split = new SplitType(element, { types: 'lines, words' });
		const lines = element.querySelectorAll('.line');
		lines.forEach(line => {
			const words = line.querySelectorAll('.word');
			words.forEach(word => {
				word.style.setProperty('--index', globalIndex++);
			});
		});
	} else if (type === 'words') {
		const split = new SplitType(element, { types: 'words' });
		const words = element.querySelectorAll('.word');
		words.forEach((word, index) => {
			word.style.setProperty('--index', index);
		});
	} else if (type === 'chars') {
		const split = new SplitType(element, { types: 'chars' });
		const chars = element.querySelectorAll('.char');
		chars.forEach((char, index) => {
			char.style.setProperty('--index', index);
		});
	} else if (type === 'words,span') {
		const split = new SplitType(element, { types: 'words' });
		const words = element.querySelectorAll('.word');
		words.forEach((word, index) => {
			const text = word.textContent.trim();

			const span = document.createElement('span');
			span.classList.add('subword');
			span.style.display = 'inline-block';
			span.textContent = text;

			word.innerHTML = ''; // очищаем текущее содержимое
			word.appendChild(span);
			word.style.setProperty('--index', index);
		});
	}
}

function initSplitTypeElements() {
	const elements = document.querySelectorAll('[data-fls-splittype]');
	elements.forEach(el => {
		const type = el.dataset.flsSplittype?.trim().toLowerCase();
		if (!type) return;

		processSplit(el, type);
	});
}


window.addEventListener('load', initSplitTypeElements);


let lastWidth2 = window.innerWidth;
const resizeObserver2 = new ResizeObserver(entries => {
	requestAnimationFrame(() => {
		entries.forEach(entry => {
			const currentWidth = entry.contentRect.width;
			if (currentWidth !== lastWidth2) {
				initSplitTypeElements();
				lastWidth2 = currentWidth;
			}
		});
	});
});

resizeObserver2.observe(document.body);
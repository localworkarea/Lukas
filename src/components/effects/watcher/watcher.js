import { isMobile, uniqArray, FLS } from "@js/common/functions.js";

class ScrollWatcher {
	constructor(props) {
		let defaultConfig = {
			logging: true,
		}
		this.config = Object.assign(defaultConfig, props);
		this.observer;

		!document.documentElement.hasAttribute('data-fls-watch') ? this.scrollWatcherRun() : null;
	}
	// Оновлюємо конструктор
	scrollWatcherUpdate() {
		this.scrollWatcherRun();
	}
	scrollWatcherRun() {
		document.documentElement.setAttribute('data-fls-watch', '')
		this.scrollWatcherConstructor(document.querySelectorAll('[data-fls-watcher]'));
	}
	scrollWatcherConstructor(items) {
		if (items.length) {
			FLS(`_FLS_WATCHER_START_WATCH`, items.length);
			let uniqParams = uniqArray(Array.from(items).map(function (item) {
				if (item.dataset.flsWatcher === 'navigator' && !item.dataset.flsWatcherThreshold) {
					let valueOfThreshold;
					if (item.clientHeight > 2) {
						valueOfThreshold =
							window.innerHeight / 2 / (item.clientHeight - 1);
						if (valueOfThreshold > 1) {
							valueOfThreshold = 1;
						}
					} else {
						valueOfThreshold = 1;
					}
					item.setAttribute(
						'data-fls-watcher-threshold',
						valueOfThreshold.toFixed(2)
					);
				}
				return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : '0px'}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
			}));
			uniqParams.forEach(uniqParam => {
				let uniqParamArray = uniqParam.split('|');
				let paramsWatch = {
					root: uniqParamArray[0],
					margin: uniqParamArray[1],
					threshold: uniqParamArray[2]
				}
				let groupItems = Array.from(items).filter(function (item) {
					let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
					let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : '0px';
					let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
					if (
						String(watchRoot) === paramsWatch.root &&
						String(watchMargin) === paramsWatch.margin &&
						String(watchThreshold) === paramsWatch.threshold
					) {
						return item;
					}
				});

				let configWatcher = this.getScrollWatcherConfig(paramsWatch);

				this.scrollWatcherInit(groupItems, configWatcher);
			});
		} else {
			FLS("_FLS_WATCHER_SLEEP")
		}
	}
	getScrollWatcherConfig(paramsWatch) {
		let configWatcher = {}
		if (document.querySelector(paramsWatch.root)) {
			configWatcher.root = document.querySelector(paramsWatch.root);
		} else if (paramsWatch.root !== 'null') {
			FLS(`_FLS_WATCHER_NOPARENT`, paramsWatch.root)
		}
		configWatcher.rootMargin = paramsWatch.margin;
		if (paramsWatch.margin.indexOf('px') < 0 && paramsWatch.margin.indexOf('%') < 0) {
			FLS(`_FLS_WATCHER_WARN_MARGIN`)
			return
		}
		if (paramsWatch.threshold === 'prx') {
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1.0; i += 0.005) {
				paramsWatch.threshold.push(i);
			}
		} else {
			paramsWatch.threshold = paramsWatch.threshold.split(',');
		}
		configWatcher.threshold = paramsWatch.threshold;
		return configWatcher;
	}
	scrollWatcherCreate(configWatcher) {
		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}
	scrollWatcherInit(items, configWatcher) {
		this.scrollWatcherCreate(configWatcher);
		items.forEach(item => this.observer.observe(item));
	}
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) {
			!targetElement.classList.contains('--watcher-view') ? targetElement.classList.add('--watcher-view') : null;
			FLS(`_FLS_WATCHER_VIEW`, targetElement.classList[0]);
		} else {
			targetElement.classList.contains('--watcher-view') ? targetElement.classList.remove('--watcher-view') : null;
			FLS(`_FLS_WATCHER_NOVIEW`, targetElement.classList[0]);
		}
	}
	// Функція відключення стеження за об'єктом
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
		FLS(`_FLS_WATCHER_STOP_WATCH`, targetElement.classList[0]);
	}
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		this.scrollWatcherIntersecting(entry, targetElement);
		targetElement.hasAttribute('data-fls-watcher-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
		document.dispatchEvent(new CustomEvent("watcherCallback", {
			detail: {
				entry: entry
			}
		}));
	}
}
document.querySelector('[data-fls-watcher]') ?
	window.addEventListener('load', () => new ScrollWatcher({})) : null
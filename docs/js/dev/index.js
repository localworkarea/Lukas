import { u as uniqArray, a as addLoadedAttr, i as isMobile } from "./app.min.js";
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.hasAttribute("data-fls-watch") ? this.scrollWatcherRun() : null;
  }
  // Оновлюємо конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  scrollWatcherRun() {
    document.documentElement.setAttribute("data-fls-watch", "");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
  }
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            "data-fls-watcher-threshold",
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
          let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
          let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") ;
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries2, observer) => {
      entries2.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("--watcher-view") ? targetElement.classList.add("--watcher-view") : null;
    } else {
      targetElement.classList.contains("--watcher-view") ? targetElement.classList.remove("--watcher-view") : null;
    }
  }
  // Функція відключення стеження за об'єктом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
}
document.querySelector("[data-fls-watcher]") ? window.addEventListener("load", () => new ScrollWatcher({})) : null;
(function() {
  function append() {
    var length = arguments.length;
    for (var i = 0; i < length; i++) {
      var node = i < 0 || arguments.length <= i ? void 0 : arguments[i];
      if (node.nodeType === 1 || node.nodeType === 11) this.appendChild(node);
      else this.appendChild(document.createTextNode(String(node)));
    }
  }
  function replaceChildren() {
    while (this.lastChild) {
      this.removeChild(this.lastChild);
    }
    if (arguments.length) this.append.apply(this, arguments);
  }
  function replaceWith() {
    var parent = this.parentNode;
    for (var _len = arguments.length, nodes = new Array(_len), _key = 0; _key < _len; _key++) {
      nodes[_key] = arguments[_key];
    }
    var i = nodes.length;
    if (!parent) return;
    if (!i) parent.removeChild(this);
    while (i--) {
      var node = nodes[i];
      if (typeof node !== "object") {
        node = this.ownerDocument.createTextNode(node);
      } else if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
      if (!i) {
        parent.replaceChild(node, this);
      } else {
        parent.insertBefore(this.previousSibling, node);
      }
    }
  }
  if (typeof Element !== "undefined") {
    if (!Element.prototype.append) {
      Element.prototype.append = append;
      DocumentFragment.prototype.append = append;
    }
    if (!Element.prototype.replaceChildren) {
      Element.prototype.replaceChildren = replaceChildren;
      DocumentFragment.prototype.replaceChildren = replaceChildren;
    }
    if (!Element.prototype.replaceWith) {
      Element.prototype.replaceWith = replaceWith;
      DocumentFragment.prototype.replaceWith = replaceWith;
    }
  }
})();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function extend(target, object) {
  return Object.getOwnPropertyNames(Object(target)).reduce(function(extended, key) {
    var currentValue = Object.getOwnPropertyDescriptor(Object(target), key);
    var newValue = Object.getOwnPropertyDescriptor(Object(object), key);
    return Object.defineProperty(extended, key, newValue || currentValue);
  }, {});
}
function isString(value) {
  return typeof value === "string";
}
function isArray(value) {
  return Array.isArray(value);
}
function parseSettings() {
  var settings = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var object = extend(settings);
  var types;
  if (object.types !== void 0) {
    types = object.types;
  } else if (object.split !== void 0) {
    types = object.split;
  }
  if (types !== void 0) {
    object.types = (isString(types) || isArray(types) ? String(types) : "").split(",").map(function(type) {
      return String(type).trim();
    }).filter(function(type) {
      return /((line)|(word)|(char))/i.test(type);
    });
  }
  if (object.absolute || object.position) {
    object.absolute = object.absolute || /absolute/.test(settings.position);
  }
  return object;
}
function parseTypes(value) {
  var types = isString(value) || isArray(value) ? String(value) : "";
  return {
    none: !types,
    lines: /line/i.test(types),
    words: /word/i.test(types),
    chars: /char/i.test(types)
  };
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isNode(input) {
  return isObject(input) && /^(1|3|11)$/.test(input.nodeType);
}
function isLength(value) {
  return typeof value === "number" && value > -1 && value % 1 === 0;
}
function isArrayLike(value) {
  return isObject(value) && isLength(value.length);
}
function toArray(value) {
  if (isArray(value)) return value;
  if (value == null) return [];
  return isArrayLike(value) ? Array.prototype.slice.call(value) : [value];
}
function getTargetElements(target) {
  var elements = target;
  if (isString(target)) {
    if (/^(#[a-z]\w+)$/.test(target.trim())) {
      elements = document.getElementById(target.trim().slice(1));
    } else {
      elements = document.querySelectorAll(target);
    }
  }
  return toArray(elements).reduce(function(result, element) {
    return [].concat(_toConsumableArray(result), _toConsumableArray(toArray(element).filter(isNode)));
  }, []);
}
var entries = Object.entries;
var expando = "_splittype";
var cache = {};
var uid = 0;
function set(owner, key, value) {
  if (!isObject(owner)) {
    console.warn("[data.set] owner is not an object");
    return null;
  }
  var id = owner[expando] || (owner[expando] = ++uid);
  var data = cache[id] || (cache[id] = {});
  if (value === void 0) {
    if (!!key && Object.getPrototypeOf(key) === Object.prototype) {
      cache[id] = _objectSpread2(_objectSpread2({}, data), key);
    }
  } else if (key !== void 0) {
    data[key] = value;
  }
  return value;
}
function get(owner, key) {
  var id = isObject(owner) ? owner[expando] : null;
  var data = id && cache[id] || {};
  {
    return data;
  }
}
function remove(element) {
  var id = element && element[expando];
  if (id) {
    delete element[id];
    delete cache[id];
  }
}
function clear() {
  Object.keys(cache).forEach(function(key) {
    delete cache[key];
  });
}
function cleanup() {
  entries(cache).forEach(function(_ref) {
    var _ref2 = _slicedToArray(_ref, 2), id = _ref2[0], _ref2$ = _ref2[1], isRoot = _ref2$.isRoot, isSplit = _ref2$.isSplit;
    if (!isRoot || !isSplit) {
      cache[id] = null;
      delete cache[id];
    }
  });
}
function toWords(value) {
  var separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : " ";
  var string = value ? String(value) : "";
  return string.trim().replace(/\s+/g, " ").split(separator);
}
var rsAstralRange = "\\ud800-\\udfff";
var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
var rsComboSymbolsRange = "\\u20d0-\\u20f0";
var rsVarRange = "\\ufe0e\\ufe0f";
var rsAstral = "[".concat(rsAstralRange, "]");
var rsCombo = "[".concat(rsComboMarksRange).concat(rsComboSymbolsRange, "]");
var rsFitz = "\\ud83c[\\udffb-\\udfff]";
var rsModifier = "(?:".concat(rsCombo, "|").concat(rsFitz, ")");
var rsNonAstral = "[^".concat(rsAstralRange, "]");
var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
var rsZWJ = "\\u200d";
var reOptMod = "".concat(rsModifier, "?");
var rsOptVar = "[".concat(rsVarRange, "]?");
var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = "(?:".concat(["".concat(rsNonAstral).concat(rsCombo, "?"), rsCombo, rsRegional, rsSurrPair, rsAstral].join("|"), "\n)");
var reUnicode = RegExp("".concat(rsFitz, "(?=").concat(rsFitz, ")|").concat(rsSymbol).concat(rsSeq), "g");
var unicodeRange = [rsZWJ, rsAstralRange, rsComboMarksRange, rsComboSymbolsRange, rsVarRange];
var reHasUnicode = RegExp("[".concat(unicodeRange.join(""), "]"));
function asciiToArray(string) {
  return string.split("");
}
function hasUnicode(string) {
  return reHasUnicode.test(string);
}
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}
function stringToArray(string) {
  return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}
function toString(value) {
  return value == null ? "" : String(value);
}
function toChars(string) {
  var separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  string = toString(string);
  if (string && isString(string)) {
    if (!separator && hasUnicode(string)) {
      return stringToArray(string);
    }
  }
  return string.split(separator);
}
function createElement(name, attributes) {
  var element = document.createElement(name);
  if (!attributes) {
    return element;
  }
  Object.keys(attributes).forEach(function(attribute) {
    var rawValue = attributes[attribute];
    var value = isString(rawValue) ? rawValue.trim() : rawValue;
    if (value === null || value === "") return;
    if (attribute === "children") {
      element.append.apply(element, _toConsumableArray(toArray(value)));
    } else {
      element.setAttribute(attribute, value);
    }
  });
  return element;
}
var defaults = {
  splitClass: "",
  lineClass: "line",
  wordClass: "word",
  charClass: "char",
  types: ["lines", "words", "chars"],
  absolute: false,
  tagName: "div"
};
function splitWordsAndChars(textNode, settings) {
  settings = extend(defaults, settings);
  var types = parseTypes(settings.types);
  var TAG_NAME = settings.tagName;
  var VALUE = textNode.nodeValue;
  var splitText = document.createDocumentFragment();
  var words = [];
  var chars = [];
  if (/^\s/.test(VALUE)) {
    splitText.append(" ");
  }
  words = toWords(VALUE).reduce(function(result, WORD, idx, arr) {
    var wordElement;
    var characterElementsForCurrentWord;
    if (types.chars) {
      characterElementsForCurrentWord = toChars(WORD).map(function(CHAR) {
        var characterElement = createElement(TAG_NAME, {
          "class": "".concat(settings.splitClass, " ").concat(settings.charClass),
          style: "display: inline-block;",
          children: CHAR
        });
        set(characterElement, "isChar", true);
        chars = [].concat(_toConsumableArray(chars), [characterElement]);
        return characterElement;
      });
    }
    if (types.words || types.lines) {
      wordElement = createElement(TAG_NAME, {
        "class": "".concat(settings.wordClass, " ").concat(settings.splitClass),
        style: "display: inline-block; ".concat(types.words && settings.absolute ? "position: relative;" : ""),
        children: types.chars ? characterElementsForCurrentWord : WORD
      });
      set(wordElement, {
        isWord: true,
        isWordStart: true,
        isWordEnd: true
      });
      splitText.appendChild(wordElement);
    } else {
      characterElementsForCurrentWord.forEach(function(characterElement) {
        splitText.appendChild(characterElement);
      });
    }
    if (idx < arr.length - 1) {
      splitText.append(" ");
    }
    return types.words ? result.concat(wordElement) : result;
  }, []);
  if (/\s$/.test(VALUE)) {
    splitText.append(" ");
  }
  textNode.replaceWith(splitText);
  return {
    words,
    chars
  };
}
function split(node, settings) {
  var type = node.nodeType;
  var wordsAndChars = {
    words: [],
    chars: []
  };
  if (!/(1|3|11)/.test(type)) {
    return wordsAndChars;
  }
  if (type === 3 && /\S/.test(node.nodeValue)) {
    return splitWordsAndChars(node, settings);
  }
  var childNodes = toArray(node.childNodes);
  if (childNodes.length) {
    set(node, "isSplit", true);
    if (!get(node).isRoot) {
      node.style.display = "inline-block";
      node.style.position = "relative";
      var nextSibling = node.nextSibling;
      var prevSibling = node.previousSibling;
      var text = node.textContent || "";
      var textAfter = nextSibling ? nextSibling.textContent : " ";
      var textBefore = prevSibling ? prevSibling.textContent : " ";
      set(node, {
        isWordEnd: /\s$/.test(text) || /^\s/.test(textAfter),
        isWordStart: /^\s/.test(text) || /\s$/.test(textBefore)
      });
    }
  }
  return childNodes.reduce(function(result, child) {
    var _split = split(child, settings), words = _split.words, chars = _split.chars;
    return {
      words: [].concat(_toConsumableArray(result.words), _toConsumableArray(words)),
      chars: [].concat(_toConsumableArray(result.chars), _toConsumableArray(chars))
    };
  }, wordsAndChars);
}
function getPosition(node, isWord, settings, scrollPos) {
  if (!settings.absolute) {
    return {
      top: isWord ? node.offsetTop : null
    };
  }
  var parent = node.offsetParent;
  var _scrollPos = _slicedToArray(scrollPos, 2), scrollX = _scrollPos[0], scrollY = _scrollPos[1];
  var parentX = 0;
  var parentY = 0;
  if (parent && parent !== document.body) {
    var parentRect = parent.getBoundingClientRect();
    parentX = parentRect.x + scrollX;
    parentY = parentRect.y + scrollY;
  }
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height, x = _node$getBoundingClie.x, y = _node$getBoundingClie.y;
  var top = y + scrollY - parentY;
  var left = x + scrollX - parentX;
  return {
    width,
    height,
    top,
    left
  };
}
function unSplitWords(element) {
  if (!get(element).isWord) {
    toArray(element.children).forEach(function(child) {
      return unSplitWords(child);
    });
  } else {
    remove(element);
    element.replaceWith.apply(element, _toConsumableArray(element.childNodes));
  }
}
var createFragment = function createFragment2() {
  return document.createDocumentFragment();
};
function repositionAfterSplit(element, settings, scrollPos) {
  var types = parseTypes(settings.types);
  var TAG_NAME = settings.tagName;
  var nodes = element.getElementsByTagName("*");
  var wordsInEachLine = [];
  var wordsInCurrentLine = [];
  var lineOffsetY = null;
  var elementHeight;
  var elementWidth;
  var contentBox;
  var lines = [];
  var parent = element.parentElement;
  var nextSibling = element.nextElementSibling;
  var splitText = createFragment();
  var cs = window.getComputedStyle(element);
  var align = cs.textAlign;
  var fontSize = parseFloat(cs.fontSize);
  var lineThreshold = fontSize * 0.2;
  if (settings.absolute) {
    contentBox = {
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth
    };
    elementWidth = element.offsetWidth;
    elementHeight = element.offsetHeight;
    set(element, {
      cssWidth: element.style.width,
      cssHeight: element.style.height
    });
  }
  toArray(nodes).forEach(function(node) {
    var isWordLike = node.parentElement === element;
    var _getPosition = getPosition(node, isWordLike, settings, scrollPos), width = _getPosition.width, height = _getPosition.height, top = _getPosition.top, left = _getPosition.left;
    if (/^br$/i.test(node.nodeName)) return;
    if (types.lines && isWordLike) {
      if (lineOffsetY === null || top - lineOffsetY >= lineThreshold) {
        lineOffsetY = top;
        wordsInEachLine.push(wordsInCurrentLine = []);
      }
      wordsInCurrentLine.push(node);
    }
    if (settings.absolute) {
      set(node, {
        top,
        left,
        width,
        height
      });
    }
  });
  if (parent) {
    parent.removeChild(element);
  }
  if (types.lines) {
    lines = wordsInEachLine.map(function(wordsInThisLine) {
      var lineElement = createElement(TAG_NAME, {
        "class": "".concat(settings.splitClass, " ").concat(settings.lineClass),
        style: "display: block; text-align: ".concat(align, "; width: 100%;")
      });
      set(lineElement, "isLine", true);
      var lineDimensions = {
        height: 0,
        top: 1e4
      };
      splitText.appendChild(lineElement);
      wordsInThisLine.forEach(function(wordOrElement, idx, arr) {
        var _data$get = get(wordOrElement), isWordEnd = _data$get.isWordEnd, top = _data$get.top, height = _data$get.height;
        var next = arr[idx + 1];
        lineDimensions.height = Math.max(lineDimensions.height, height);
        lineDimensions.top = Math.min(lineDimensions.top, top);
        lineElement.appendChild(wordOrElement);
        if (isWordEnd && get(next).isWordStart) {
          lineElement.append(" ");
        }
      });
      if (settings.absolute) {
        set(lineElement, {
          height: lineDimensions.height,
          top: lineDimensions.top
        });
      }
      return lineElement;
    });
    if (!types.words) {
      unSplitWords(splitText);
    }
    element.replaceChildren(splitText);
  }
  if (settings.absolute) {
    element.style.width = "".concat(element.style.width || elementWidth, "px");
    element.style.height = "".concat(elementHeight, "px");
    toArray(nodes).forEach(function(node) {
      var _data$get2 = get(node), isLine = _data$get2.isLine, top = _data$get2.top, left = _data$get2.left, width = _data$get2.width, height = _data$get2.height;
      var parentData = get(node.parentElement);
      var isChildOfLineNode = !isLine && parentData.isLine;
      node.style.top = "".concat(isChildOfLineNode ? top - parentData.top : top, "px");
      node.style.left = isLine ? "".concat(contentBox.left, "px") : "".concat(left - (isChildOfLineNode ? contentBox.left : 0), "px");
      node.style.height = "".concat(height, "px");
      node.style.width = isLine ? "".concat(contentBox.width, "px") : "".concat(width, "px");
      node.style.position = "absolute";
    });
  }
  if (parent) {
    if (nextSibling) parent.insertBefore(element, nextSibling);
    else parent.appendChild(element);
  }
  return lines;
}
var _defaults = extend(defaults, {});
var SplitType = /* @__PURE__ */ (function() {
  _createClass(SplitType2, null, [{
    key: "clearData",
    /**
     * CLears all data
     */
    value: function clearData() {
      clear();
    }
    /**
     * The default settings for all splitType instances
     * @static
     */
  }, {
    key: "setDefaults",
    /**
     * Sets the default settings for all SplitType instances.
     * The provided object will be merged with the existing defaults objects.
     *
     * @param {Object} settings an object containing the settings to override
     * @returns {Object} the new default settings
     * @public
     * @static
     * @example
     * SplitType.setDefaults({ "position": "absolute" })
     */
    value: function setDefaults(options) {
      _defaults = extend(_defaults, parseSettings(options));
      return defaults;
    }
    /**
     * Revert target elements to their original html content
     * Has no effect on that
     *
     * @param {any} elements The target elements to revert. One of:
     *  - {string} A css selector
     *  - {HTMLElement} A single element
     * -  {NodeList} A NodeList or collection
     *  - {HTMLElement[]} An array of Elements
     * -  {Array<HTMLElement|NodeList|HTMLElement[]>} A nested array of elements
     * @static
     */
  }, {
    key: "revert",
    value: function revert(elements) {
      getTargetElements(elements).forEach(function(element) {
        var _data$get = get(element), isSplit = _data$get.isSplit, html = _data$get.html, cssWidth = _data$get.cssWidth, cssHeight = _data$get.cssHeight;
        if (isSplit) {
          element.innerHTML = html;
          element.style.width = cssWidth || "";
          element.style.height = cssHeight || "";
          remove(element);
        }
      });
    }
    /**
     * Creates a new SplitType instance
     * This static method provides a way to create a `SplitType` instance without
     * using the `new` keyword.
     *
     * @param {any} target The target elements to split. One of:
     *  - {string} A css selector
     *  - {HTMLElement} A single element
     * -  {NodeList} A NodeList or collection
     *  - {HTMLElement[]} An array of Elements
     * -  {Array<HTMLElement|NodeList|HTMLElement[]>} A nested array of elements
     * @param {Object} [options] Settings for the SplitType instance
     * @return {SplitType} the SplitType instance
     * @static
     */
  }, {
    key: "create",
    value: function create(target, options) {
      return new SplitType2(target, options);
    }
    /**
     * Creates a new `SplitType` instance
     *
     * @param {any} elements The target elements to split. One of:
     *  - {string} A css selector
     *  - {HTMLElement} A single element
     * -  {NodeList} A NodeList or collection
     *  - {HTMLElement[]} An array of Elements
     * -  {Array<HTMLElement|NodeList|HTMLElement[]>} A nested array of elements
     * @param {Object} [options] Settings for the SplitType instance
     */
  }, {
    key: "data",
    /**
     * The internal data store
     */
    get: function get2() {
      return cache;
    }
  }, {
    key: "defaults",
    get: function get2() {
      return _defaults;
    },
    set: function set2(options) {
      _defaults = extend(_defaults, parseSettings(options));
    }
  }]);
  function SplitType2(elements, options) {
    _classCallCheck(this, SplitType2);
    this.isSplit = false;
    this.settings = extend(_defaults, parseSettings(options));
    this.elements = getTargetElements(elements);
    this.split();
  }
  _createClass(SplitType2, [{
    key: "split",
    value: function split$1(options) {
      var _this = this;
      this.revert();
      this.elements.forEach(function(element) {
        set(element, "html", element.innerHTML);
      });
      this.lines = [];
      this.words = [];
      this.chars = [];
      var scrollPos = [window.pageXOffset, window.pageYOffset];
      if (options !== void 0) {
        this.settings = extend(this.settings, parseSettings(options));
      }
      var types = parseTypes(this.settings.types);
      if (types.none) {
        return;
      }
      this.elements.forEach(function(element) {
        set(element, "isRoot", true);
        var _split2 = split(element, _this.settings), words = _split2.words, chars = _split2.chars;
        _this.words = [].concat(_toConsumableArray(_this.words), _toConsumableArray(words));
        _this.chars = [].concat(_toConsumableArray(_this.chars), _toConsumableArray(chars));
      });
      this.elements.forEach(function(element) {
        if (types.lines || _this.settings.absolute) {
          var lines = repositionAfterSplit(element, _this.settings, scrollPos);
          _this.lines = [].concat(_toConsumableArray(_this.lines), _toConsumableArray(lines));
        }
      });
      this.isSplit = true;
      window.scrollTo(scrollPos[0], scrollPos[1]);
      cleanup();
    }
    /**
     * Reverts target element(s) back to their original html content
     * Deletes all stored data associated with the target elements
     * Resets the properties on the splitType instance
     *
     * @public
     */
  }, {
    key: "revert",
    value: function revert() {
      if (this.isSplit) {
        this.lines = null;
        this.words = null;
        this.chars = null;
        this.isSplit = false;
      }
      SplitType2.revert(this.elements);
    }
  }]);
  return SplitType2;
})();
function processSplit(element, type) {
  let globalIndex = 0;
  if (type === "line") {
    new SplitType(element, { types: "lines, words" });
    const lines = element.querySelectorAll(".line");
    lines.forEach((line) => {
      const words = line.querySelectorAll(".word");
      words.forEach((word) => {
        word.style.setProperty("--index", globalIndex++);
      });
    });
  } else if (type === "words") {
    new SplitType(element, { types: "words" });
    const words = element.querySelectorAll(".word");
    words.forEach((word, index) => {
      word.style.setProperty("--index", index);
    });
  } else if (type === "chars") {
    new SplitType(element, { types: "chars" });
    const chars = element.querySelectorAll(".char");
    chars.forEach((char, index) => {
      char.style.setProperty("--index", index);
    });
  } else if (type === "words,span") {
    new SplitType(element, { types: "words" });
    const words = element.querySelectorAll(".word");
    words.forEach((word, index) => {
      const text = word.textContent.trim();
      const span = document.createElement("span");
      span.classList.add("subword");
      span.style.display = "inline-block";
      span.textContent = text;
      word.innerHTML = "";
      word.appendChild(span);
      word.style.setProperty("--index", index);
    });
  }
}
function initSplitTypeElements() {
  const elements = document.querySelectorAll("[data-fls-splittype]");
  elements.forEach((el) => {
    const type = el.dataset.flsSplittype?.trim().toLowerCase();
    if (!type) return;
    processSplit(el, type);
  });
}
window.addEventListener("load", initSplitTypeElements);
let lastWidth2 = window.innerWidth;
const resizeObserver2 = new ResizeObserver((entries2) => {
  requestAnimationFrame(() => {
    entries2.forEach((entry) => {
      const currentWidth = entry.contentRect.width;
      if (currentWidth !== lastWidth2) {
        initSplitTypeElements();
        lastWidth2 = currentWidth;
      }
    });
  });
});
resizeObserver2.observe(document.body);
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
  const resizeObserver = new ResizeObserver((entries2) => {
    requestAnimationFrame(() => {
      entries2.forEach((entry) => {
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

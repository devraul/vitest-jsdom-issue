import assert from "node:assert";
import { CookieJar, JSDOM, ResourceLoader } from "jsdom";

const jsdom = {};

// SEE https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/interfaces.js

const LIVING_KEYS = [
  "DOMException",
  "URL",
  "URLSearchParams",
  "EventTarget",
  "NamedNodeMap",
  "Node",
  "Attr",
  "Element",
  "DocumentFragment",
  "DOMImplementation",
  "Document",
  "XMLDocument",
  "CharacterData",
  "Text",
  "CDATASection",
  "ProcessingInstruction",
  "Comment",
  "DocumentType",
  "NodeList",
  "RadioNodeList",
  "HTMLCollection",
  "HTMLOptionsCollection",
  "DOMStringMap",
  "DOMTokenList",
  "StyleSheetList",
  "HTMLElement",
  "HTMLHeadElement",
  "HTMLTitleElement",
  "HTMLBaseElement",
  "HTMLLinkElement",
  "HTMLMetaElement",
  "HTMLStyleElement",
  "HTMLBodyElement",
  "HTMLHeadingElement",
  "HTMLParagraphElement",
  "HTMLHRElement",
  "HTMLPreElement",
  "HTMLUListElement",
  "HTMLOListElement",
  "HTMLLIElement",
  "HTMLMenuElement",
  "HTMLDListElement",
  "HTMLDivElement",
  "HTMLAnchorElement",
  "HTMLAreaElement",
  "HTMLBRElement",
  "HTMLButtonElement",
  "HTMLCanvasElement",
  "HTMLDataElement",
  "HTMLDataListElement",
  "HTMLDetailsElement",
  "HTMLDialogElement",
  "HTMLDirectoryElement",
  "HTMLFieldSetElement",
  "HTMLFontElement",
  "HTMLFormElement",
  "HTMLHtmlElement",
  "HTMLImageElement",
  "HTMLInputElement",
  "HTMLLabelElement",
  "HTMLLegendElement",
  "HTMLMapElement",
  "HTMLMarqueeElement",
  "HTMLMediaElement",
  "HTMLMeterElement",
  "HTMLModElement",
  "HTMLOptGroupElement",
  "HTMLOptionElement",
  "HTMLOutputElement",
  "HTMLPictureElement",
  "HTMLProgressElement",
  "HTMLQuoteElement",
  "HTMLScriptElement",
  "HTMLSelectElement",
  "HTMLSlotElement",
  "HTMLSourceElement",
  "HTMLSpanElement",
  "HTMLTableCaptionElement",
  "HTMLTableCellElement",
  "HTMLTableColElement",
  "HTMLTableElement",
  "HTMLTimeElement",
  "HTMLTableRowElement",
  "HTMLTableSectionElement",
  "HTMLTemplateElement",
  "HTMLTextAreaElement",
  "HTMLUnknownElement",
  "HTMLFrameElement",
  "HTMLFrameSetElement",
  "HTMLIFrameElement",
  "HTMLEmbedElement",
  "HTMLObjectElement",
  "HTMLParamElement",
  "HTMLVideoElement",
  "HTMLAudioElement",
  "HTMLTrackElement",
  "HTMLFormControlsCollection",
  "SVGElement",
  "SVGGraphicsElement",
  "SVGSVGElement",
  "SVGTitleElement",
  "SVGAnimatedString",
  "SVGNumber",
  "SVGStringList",
  "Event",
  "CloseEvent",
  "CustomEvent",
  "MessageEvent",
  "ErrorEvent",
  "HashChangeEvent",
  "PopStateEvent",
  "StorageEvent",
  "ProgressEvent",
  "PageTransitionEvent",
  "SubmitEvent",
  "UIEvent",
  "FocusEvent",
  "InputEvent",
  "MouseEvent",
  "KeyboardEvent",
  "TouchEvent",
  "CompositionEvent",
  "WheelEvent",
  "BarProp",
  "External",
  "Location",
  "History",
  "Screen",
  "Crypto",
  "Performance",
  "Navigator",
  "PluginArray",
  "MimeTypeArray",
  "Plugin",
  "MimeType",
  "FileReader",
  "Blob",
  "File",
  "FileList",
  "ValidityState",
  "DOMParser",
  "XMLSerializer",
  "FormData",
  "XMLHttpRequestEventTarget",
  "XMLHttpRequestUpload",
  "XMLHttpRequest",
  "WebSocket",
  "NodeFilter",
  "NodeIterator",
  "TreeWalker",
  "AbstractRange",
  "Range",
  "StaticRange",
  "Selection",
  "Storage",
  "CustomElementRegistry",
  "ShadowRoot",
  "MutationObserver",
  "MutationRecord",
  "Headers",
  "AbortController",
  "AbortSignal",

  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Float32Array",
  "Float64Array",
  "ArrayBuffer",
  "DOMRectReadOnly",
  "DOMRect",

  // not specified in docs, but is available
  "Image",
  "Audio",
  "Option",

  "CSS",
];

const OTHER_KEYS = [
  "addEventListener",
  "alert",
  // 'atob',
  "blur",
  // 'btoa',
  "cancelAnimationFrame",
  /* 'clearInterval', */
  /* 'clearTimeout', */
  "close",
  "confirm",
  /* 'console', */
  "createPopup",
  "dispatchEvent",
  "document",
  "focus",
  "frames",
  "getComputedStyle",
  "history",
  "innerHeight",
  "innerWidth",
  "length",
  "location",
  "matchMedia",
  "moveBy",
  "moveTo",
  "name",
  "navigator",
  "open",
  "outerHeight",
  "outerWidth",
  "pageXOffset",
  "pageYOffset",
  "parent",
  "postMessage",
  "print",
  "prompt",
  "removeEventListener",
  "requestAnimationFrame",
  "resizeBy",
  "resizeTo",
  "screen",
  "screenLeft",
  "screenTop",
  "screenX",
  "screenY",
  "scroll",
  "scrollBy",
  "scrollLeft",
  "scrollTo",
  "scrollTop",
  "scrollX",
  "scrollY",
  "self",
  /* 'setInterval', */
  /* 'setTimeout', */
  "stop",
  /* 'toString', */
  "top",
  "Window",
  "window",
];

const skipKeys = ["window", "self", "top", "parent"];

const KEYS = LIVING_KEYS.concat(OTHER_KEYS);

const {
  html = "<!DOCTYPE html>",
  userAgent,
  url = "http://localhost:3000",
  contentType = "text/html",
  pretendToBeVisual = true,
  includeNodeLocations = false,
  runScripts = "dangerously",
  resources,
  cookieJar = false,
  ...restOptions
} = jsdom;

const dom = new JSDOM(html, {
  pretendToBeVisual,
  resources:
    resources ?? (userAgent ? new ResourceLoader({ userAgent }) : undefined),
  runScripts,
  url,
  cookieJar: cookieJar ? new CookieJar() : undefined,
  includeNodeLocations,
  contentType,
  userAgent,
  ...restOptions,
});

const { keys, originals } = populateGlobal(global, dom.window, {
  bindFunctions: true,
});

const clearWindowErrors = catchWindowErrors(global);

global.jsdom = dom;

const foo = new TextEncoder().encode("foo");

/**
 * CHECKING
 */
assert(foo instanceof Uint8Array);

// VITEST CODE

function populateGlobal(global, win, options = {}) {
  const { bindFunctions = false } = options;
  const keys = getWindowKeys(global, win, options.additionalKeys);

  const originals = new Map();

  const overrideObject = new Map();
  for (const key of keys) {
    const boundFunction =
      bindFunctions &&
      typeof win[key] === "function" &&
      !isClassLikeName(key) &&
      win[key].bind(win);

    if (KEYS.includes(key) && key in global) originals.set(key, global[key]);

    Object.defineProperty(global, key, {
      get() {
        if (overrideObject.has(key)) return overrideObject.get(key);
        if (boundFunction) return boundFunction;
        return win[key];
      },
      set(v) {
        overrideObject.set(key, v);
      },
      configurable: true,
    });
  }

  global.window = global;
  global.self = global;
  global.top = global;
  global.parent = global;

  if (global.global) global.global = global;

  // rewrite defaultView to reference the same global context
  if (global.document && global.document.defaultView) {
    Object.defineProperty(global.document, "defaultView", {
      get: () => global,
      enumerable: true,
      configurable: true,
    });
  }

  skipKeys.forEach((k) => keys.add(k));

  return {
    keys,
    skipKeys,
    originals,
  };
}

function getWindowKeys(global, win, additionalKeys = []) {
  const keysArray = [...additionalKeys, ...KEYS];
  const keys = new Set(
    keysArray.concat(Object.getOwnPropertyNames(win)).filter((k) => {
      if (skipKeys.includes(k)) return false;
      if (k in global) return keysArray.includes(k);

      return true;
    })
  );

  return keys;
}

function isClassLikeName(name) {
  return name[0] === name[0].toUpperCase();
}

function catchWindowErrors(window) {
  let userErrorListenerCount = 0;
  function throwUnhandlerError(e) {
    if (userErrorListenerCount === 0 && e.error != null)
      process.emit("uncaughtException", e.error);
  }
  const addEventListener = window.addEventListener.bind(window);
  const removeEventListener = window.removeEventListener.bind(window);
  window.addEventListener("error", throwUnhandlerError);
  window.addEventListener = function (...args) {
    if (args[0] === "error") userErrorListenerCount++;
    return addEventListener.apply(this, args);
  };
  window.removeEventListener = function (...args) {
    if (args[0] === "error" && userErrorListenerCount) userErrorListenerCount--;
    return removeEventListener.apply(this, args);
  };
  return function clearErrorHandlers() {
    window.removeEventListener("error", throwUnhandlerError);
  };
}

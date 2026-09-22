const colorMap = {
  "#64d583": "green",
  "#91a8f9": "blue",
  "#ee92d7": "pink",
  "#aa8ef0": "purple",
  "#ee955e": "orange",
  "#f5d770": "yellow",
};

/**
 * Finds the CSS color name for a supported hexadecimal deck color.
 * @param {string} hex - The hexadecimal color, including its leading hash.
 * @returns {string|undefined} The matching name, or undefined for an unsupported color.
 */
function hexToString(hex) {
  return colorMap[hex.toLowerCase()];
}

/**
 * Removes BEM color modifiers from an element.
 * @param {HTMLElement} element - The element whose color classes should be cleared.
 * @returns {void}
 */
function removeColorClasses(element) {
  [...element.classList]
    .filter((className) => className.includes("_color_"))
    .forEach((className) => element.classList.remove(className));
}

export { hexToString, removeColorClasses };
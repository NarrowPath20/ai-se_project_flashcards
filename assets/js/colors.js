const colorMap = {
  "#64d583": "green",
  "#91a8f9": "blue",
  "#ee92d7": "pink",
  "#aa8ef0": "purple",
  "#ee955e": "orange",
  "#f5d770": "yellow",
};

function hexToString(hex) {
  return colorMap[hex.toLowerCase()];
}

function removeColorClasses(element) {
  [...element.classList]
    .filter((className) => className.includes("_color_"))
    .forEach((className) => element.classList.remove(className));
}

export { hexToString, removeColorClasses };
const textilejs = require("textile-js");

var parsers = {};

/** @type {import("./index").Option} */
var defaultOption = {
  breaks: true,
};
/**
 * Textile to HTML
 * @param {string} text
 * @param {import("./index").Option} [option]
 * @returns {string}
 */
parsers.toHtml = function (text, option) {
  const opt = option ?? defaultOption;
  return textilejs.parse(text, opt);
};
/**
 * Textile to JsonML
 * @param {string} text
 * @param {import("./index").Option} [option]
 * @returns {import("./index").JsonMLTree}
 */
parsers.toJsonML = function (text, option) {
  const opt = option ?? defaultOption;
  return textilejs.jsonml(text, opt);
};
/**
 * JsonMl to HTML
 * @param {import("./index").JsonMLTree} ml
 * @returns {string}
 */
parsers.mlToHtml = function (ml) {
  if (ml[0] !== "html") {
    new TypeError("Wrong Tree Format");
  }
  return textilejs.serialize(ml);
};

module.exports = parsers;

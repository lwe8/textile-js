const textile = require("textile-js");

/**
 * @typedef {} AA
 */

/** @type {import("./types").Option} */
const defaultOption = {
  breaks: true,
};
/**
 *
 * @param {string} text
 * @param {import("./types").Option} [option]
 * @returns
 */
exports.textToHtml = function (text, option) {
  const opt = option ?? defaultOption;
  return textile.parse(text, option);
};

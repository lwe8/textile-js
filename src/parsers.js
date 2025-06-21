import textile from "./textile/index.js";
/** @import {JsonMLTree,Option} from "@lwe8/text-types" */
//
const defaultOption = {
  breaks: true,
};
const parsers = {
  /**
   * Textile to HTML
   * @param {string} text
   * @param {Option} [option]
   * @returns {string}
   */
  textileToHtml(text, option) {
    const opt = option ?? defaultOption;
    return textile.parse(text, opt);
  },
  /**
   * Textile to JsonML
   * @param {string} text
   * @param {Option} [option]
   * @returns {JsonMLTree}
   */
  textileToJsonML(text, option) {
    const opt = option ?? defaultOption;
    return textile.jsonml(text, opt);
  },
  /**
   * JsonML to HTML
   * @param {JsonMLTree} ml
   * @returns {string}
   */
  jsonMlToHtml(ml) {
    if (ml[0] !== "html") {
      new TypeError("Wrong Tree Format");
    }
    return textile.serialize(ml);
  },
};

export default parsers;

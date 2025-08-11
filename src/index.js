import parseFlow from "./textile/flow.js";
import { toHTML } from "./textile/jsonml.js";

/**
 * @typedef TextileOptions
 * @property {boolean} [breaks]
 */

/**
 * @param {import("./textile/builder.js").JsonMLNode} node
 * @return {string}
 */
export function jmlToHTML(node) {
  return toHTML(node);
}
/**
 * Converts Textile markup to JsonML and HTML.
 *
 * @param {string} raw - The raw Textile markup string to be converted.
 * @param {object} [options] - Optional configuration object.
 * @param {boolean} [options.breaks=true] - Whether to convert line breaks to <br> tags.
 * @returns {{ jsonml: import("./textile/builder.js").JsonMLNode[], html: string }} An object containing the parsed JsonML and HTML string.
 *
 * @example
 * import textile from './index.js';
 * const result = textile('h1. Hello, Textile!');
 * console.log(result.html); // <h1>Hello, Textile!</h1>
 * console.log(result.jsonml); // [ ...JsonML structure... ]
 */
export default function textile(raw, options) {
  const _options = options ?? { breaks: true };
  /** @type {import("./textile/builder.js").JsonMLNode[]} */
  const jlm = parseFlow(raw, _options);
  const _html = jlm.map(toHTML).join("");
  return {
    jsonml: jlm,
    html: _html,
  };
}

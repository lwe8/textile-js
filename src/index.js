import parseFlow from "./textile/flow.js";
import { toHTML } from "./textile/jsonml.js";

/**
 *
 * @typedef {keyof HTMLElementTagNameMap} HTMLTagName
 *
 * @typedef {"###" | "notextile" | "!" | "bc" | "bq"} TextileTagName
 *
 * @typedef {HTMLTagName|TextileTagName} TagName
 *
 * @typedef {[TagName]} ENzero
 *
 * @typedef {Record<string,any>}  JsonMLAttributes
 *
 * @typedef {[TagName,JsonMLAttributes | string]} ENone
 *
 * @typedef {[TagName,JsonMLAttributes | string,string]} ENtwo
 *
 * @typedef {[TagName,JsonMLAttributes | string|ENtwo]} ENthree
 *
 * @typedef {[TagName,JsonMLAttributes | string|ENthree|string]} ENfour
 *
 * @typedef {ENzero|ENone|ENtwo|ENthree|ENfour}  ENfive
 *
 * @typedef {ENfive | [TagName,...ENfive]} JsonMLElement
 *
 * @typedef {JsonMLElement | string} JsonMLNode
 *
 */
/**
 * @typedef TextileOptions
 * @property {boolean} [breaks]
 */

/**
 * @param {JsonMLNode} node
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
 * @returns {{ jsonml: JsonMLNode[], html: string }} An object containing the parsed JsonML and HTML string.
 *
 * @example
 * import textile from './index.js';
 * const result = textile('h1. Hello, Textile!');
 * console.log(result.html); // <h1>Hello, Textile!</h1>
 * console.log(result.jsonml); // [ ...JsonML structure... ]
 */
export function textile(raw, options) {
  const _options = options ?? { breaks: true };
  /** @type {JsonMLNode[]} */
  const jlm = parseFlow(raw, _options);
  const _html = jlm.map(toHTML).join("");
  return {
    jsonml: jlm,
    html: _html,
  };
}

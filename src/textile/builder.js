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
 *
 * @param {any}initArr
 */

export default function builder(initArr) {
  /** @type {JsonMLNode[]} */
  const arr = Array.isArray(initArr) ? initArr : [];

  return {
    /**
     *
     * @param {JsonMLNode} node
     */
    add: function (node) {
      if (typeof node === "string" && typeof arr[arr.length - 1] === "string") {
        // join if possible
        arr[arr.length - 1] += node;
      } else if (Array.isArray(node)) {
        arr.push(node.filter((s) => s !== undefined));
      } else if (node) {
        arr.push(node);
      }
      return this;
    },
    /**
     *
     * @param {JsonMLNode[]} arr
     */
    merge: function (arr) {
      for (let i = 0, l = arr.length; i < l; i++) {
        this.add(arr[i]);
      }
      return this;
    },

    linebreak: function () {
      if (arr.length) {
        this.add("\n");
      }
    },

    get: function () {
      return arr;
    },
  };
}

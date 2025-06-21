import parsers from "./parsers.js";
import txast from "./txast.js";

/** @import {WalkFunction,TextileExtension,JsonMLTree,TxastTree,Option} from "@lwe8/text-types" */

const htmlTagRegex = /<\/?html>/g;
class Textile {
  /**
   *
   * @param {Option} [option]
   */
  constructor(option) {
    /** @private */
    this._opt = option ?? { breaks: true };
    /**
     * @private
     * @type {TextileExtension[]}
     *
     */
    this._exts = [];
    /** @private */
    this._text = "";
    /**
     * @private
     * @type {JsonMLTree}
     *
     */
    this._jsonml = [];
    /**
     * @private
     * @type {TxastTree}
     *
     */
    this._txastTree = {};
    /**
     * @private
     * @type {WalkFunction[]}
     *
     */
    this._visitors = [];
    /** @private */
    this._html = "";
  }
  /** @private */
  _int() {
    if (this._text === "") {
      throw new Error("You must input text to convert");
    }
    this._jsonml = parsers.textileToJsonML(this._text, this._opt);
    this._txastTree = txast.createTxast(this._jsonml);
    if (this._exts.length > 0) {
      for (const ext of this._exts) {
        txast.walk(this._txastTree, ext.walkTree);
      }
    }
    if (this._visitors.length > 0) {
      for (const visitor of this._visitors) {
        txast.walk(this._txastTree, visitor);
      }
    }
    this._jsonml = txast.createJsonML(this._txastTree);
    this._html = parsers.jsonMlToHtml(this._jsonml).replace(htmlTagRegex, "");
  }
  /**
   *
   * @param {TextileExtension} ext
   */
  use(ext) {
    this._exts.push(ext);
    return this;
  }
  /**
   *
   * @param {WalkFunction} visitor
   * @returns {this}
   */
  visit(visitor) {
    this._visitors.push(visitor);
    return this;
  }

  /**
   *
   * @param {string} input
   */
  parse(input) {
    this._text = input;
    this._int();
    return {
      html: this._html,
      jsonMLTree: this._jsonml,
      txastTree: this._txastTree,
    };
  }
}

export default Textile;

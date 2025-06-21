import helpers from "./helpers.js";
/** @import {WalkFunction,JsonMLTree,TxastTree,TxastNodes} from "@lwe8/text-types" */
const txast = {
  /**
   * Converts a JsonML tree into a TxAST (Textile Abstract Syntax Tree) structure.
   *
   * @param {import("@lwe8/text-types").JsonMLTree} jsonmlTree - The JsonML tree to convert.
   * @returns {TxastTree} The resulting TxAST tree.
   */
  createTxast(jsonmlTree) {
    /** @type {TxastTree} */
    const txast = {
      type: "root",
      tagName: "html",
      children: [],
    };
    /**
     *
     * @param {JsonMLNode} node
     * @param {TxastNodes} children
     */
    const travis = (node, children) => {
      let txastNode = {};
      let remainNode = node;
      if (typeof node === "string") {
        if (node.startsWith("\n") || node.startsWith("\t")) {
          txastNode.type = "breaks";
          txastNode.value = node;
        } else {
          txastNode.type = "text";
          txastNode.value = node;
        }
      } else if (Array.isArray(node)) {
        txastNode.type = "element";
        txastNode.tagName = node[0];
        if (helpers.isAttrNode(node[1])) {
          txastNode.properties = node[1];
          remainNode = node.slice(2);
        } else {
          remainNode = node.slice(1);
        }
        if (Array.isArray(remainNode) && remainNode.length > 0) {
          txastNode.children = [];
          remainNode.forEach((n) => {
            travis(n, txastNode.children);
          });
        }
      }
      children.push(txastNode);
    };
    jsonmlTree.slice(1).forEach((node) => {
      travis(node, txast.children);
    });

    return txast;
  },
  /**
   * Converts a TxAST tree into a JsonML representation.
   *
   * @param {TxastTree} txastTree - The root TxAST node to convert.
   * @returns {JsonMLTree} The JsonML representation of the input TxAST tree.
   */
  createJsonML(txastTree) {
    const jsonMLTree = ["html"];
    /**
     *
     * @param {TxastNode} node
     */
    const travis = (node) => {
      /** @type {import("@lwe8/text-types").ElementNode} */
      const elNode = [];

      if (node.type === "text" || node.type === "breaks") {
        return node.value;
      } else {
        elNode[0] = node.tagName;
        if (node.properties) {
          elNode[1] = node.properties;
        }
        if (node.children && node.children.length > 0) {
          node.children.forEach((n) => {
            elNode.push(travis(n));
          });
        }
        return elNode;
      }
    };
    txastTree.children.forEach((node) => {
      jsonMLTree.push(travis(node));
    });
    return jsonMLTree;
  },
  /**
   * Traverses and transforms the children of a TXAST tree using a callback function.
   *
   * @param {TxastTree} txastTree - The root node of the TXAST tree to traverse. Must have a `children` property (array).
   * @param {WalkFunction} callback -
   *   A function called for each child node. Receives the node, its index, and its parent array.
   *   Should return a new node object to merge with the original, or `undefined` to leave unchanged.
   */
  walk(txastTree, callback) {
    /**
     *
     * @param {TxastNode} node
     */
    const travis = (node) => {
      const index = txastTree.children.indexOf(node);
      callback(node, index, txastTree.children);
      if (node.type === "element" && node.children) {
        node.children.forEach((v, i, p) => callback(v, i, p));
      }
    };
    txastTree.children.map((v) => travis(v));
  },
};

export default txast;

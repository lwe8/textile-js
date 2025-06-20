helpers = {};

helpers.isAttrNode = function (input) {
  return /^\{.*\}$/.test(input);
};
/**
 * Checks if a JsonMLNode is an element node
 * @param {import("./index").JsonMLNode} jsonmlNode
 * @returns {boolean}
 */
helpers.isElementNode = function (jsonmlNode) {
  return Array.isArray(jsonmlNode);
};
/**
 * Filters and returns element nodes from a JsonMLTree
 * @param {import("./index").JsonMLTree} tree
 * @returns {Array<{index: number, node: import("./index").JsonMLNode}>}
 */
helpers.filterElementNode = function (tree) {
  return tree
    .map((node, index) =>
      helpers.isElementNode(node) ? { index, node } : null
    )
    .filter((element) => element !== null);
};

helpers.hasChild = function(){
    
}

module.exports = helpers;

export default function builder(initArr) {
  /** @type {import("../index.js").JsonMLNode[]} */
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
     * @param {import("../index.js").JsonMLNode[]} arr
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

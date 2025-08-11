/**
 *
 * @param {import("./builder.js").JsonMLNode[]} ml
 * @param {{ [x: string]: any }} dict
 * @returns
 */
export default function fixLinks(ml, dict) {
  if (Array.isArray(ml)) {
    if (ml[0] === "a") {
      // found a link
      const attr = ml[1];
      if (typeof attr === "object" && "href" in attr && attr.href in dict) {
        attr.href = dict[attr.href];
      }
    }
    for (let i = 0, l = ml.length; i < l; i++) {
      if (Array.isArray(ml[i])) {
        fixLinks(ml[i], dict);
      }
    }
  }
  return ml;
}

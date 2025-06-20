import fs from "node:fs";
import textile from "./index.mjs";
const tx = fs.readFileSync("a.textile", "utf8");
const _html = textile.toHtml(tx);

fs.writeFileSync("bb.html", _html);

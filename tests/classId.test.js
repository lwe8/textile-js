import { describe, it, snapshot } from "node:test";
import textile from "../src/index.js";
import path from "node:path";

// snapshot dir path
snapshot.setResolveSnapshotPath((testPath) => {
  const _dir = path.dirname(testPath);
  const _baseName = path.basename(testPath);
  return path.join(_dir, "__snapshots__", `${_baseName}.snapshot`);
});

describe("Class ID Attributes Tests", function () {
  it("Original style attributes", function (t) {
    const text = "h1(class#id). Hello World";
    const result = textile(text).html;
    const expected = '<h1 class="class" id="id">Hello World</h1>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
  it("Original style attributes option 2", function (t) {
    const text = "h1(class foo #id). Hello World";
    const result = textile(text).html;
    const expected = '<h1 class="class foo" id="id">Hello World</h1>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
  // placing #id anywhere
  it("Place id(#id) any place", function (t) {
    const text = "h1(#id class). Hello World";
    const result = textile(text).html;
    const expected = '<h1 id="id" class="class">Hello World</h1>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
  it("Place id(#id) any place,option 2", function (t) {
    const text = "h1(foo #id class). Hello World";
    const result = textile(text).html;
    const expected = '<h1 class="foo class" id="id">Hello World</h1>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
  it("If #id more than one, the first one will return", function (t) {
    const text = "h1(foo #id1 class #id2). Hello World";
    const result = textile(text).html;
    const expected = '<h1 class="foo class" id="id1">Hello World</h1>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
  it("More than one space between class and id", function (t) {
    const text = "h1( foo   #id   class). Hello World";
    const result = textile(text).html;
    const expected = '<h1 class="foo class" id="id">Hello World</h1>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
  it("When using `*` in none `bc` elements , return itself as class", function (t) {
    const text = "h1(*js #id class). Hello World";
    const result = textile(text).html;
    const expected = '<h1 class="*js class" id="id">Hello World</h1>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
  it("When using `*` in `bc` elements , return as language for syntax highlight", function (t) {
    const text = 'bc(*js #id). console.log("Hello World")';
    const result = textile(text).html;
    const expected =
      '<pre class="language-js" id="id"><code class="language-js">console.log("Hello World")</code></pre>';
    t.assert.equal(result, expected);
    t.assert.snapshot({ text, result, expected });
  });
});

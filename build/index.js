#!/usr/bin/env node
import { rollup } from "rollup";
import { createRequire } from "node:module";
import nodeResolve from "@rollup/plugin-node-resolve";
import forceRemoveDir from "./forceRemoveDir.js";
import { compile } from "@lwe8/dts";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
//
const require = createRequire(import.meta.url);
const _package = require("../package.json");

const yn = new Date().getFullYear();
const yearNow = yn > 2025 ? `-${yn}` : "";
//
const bannerText = `
/*!
 * textile-ts v${_package.version} -- Copyright (c) 2025${yearNow} ${_package.author} -- license ${_package.license}
 *
 * Bundled dependencies information.
 *
 * textile-js :
 *            Author : Borgar - https://github.com/borgar
 *            LICENSE: MIT - https://github.com/borgar/textile-js/blob/master/LICENSE
 *            Github : https://github.com/borgar/textile-js
 */
`;
//
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
//
// list of build functions
const buildFunctions = [
  async function () {
    return new Promise((resolve, reject) => {
      try {
        forceRemoveDir("./dist");
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  },
  // bundle first to generate .dts file
  async function () {
    const bundle = await rollup({
      input: "./src/index.js",
      plugins: [nodeResolve()],
      external: ["htmlparser2"],
    });
    bundle.write({
      format: "es",
      file: "./.temp/index.js",
    });
  },
  // generate .dts file from temp bundled file
  async function () {
    await wait(1000);
    compile("./.temp/index.js", "dist");
  },
  // transpile and minify to esm and cjs from temp bundled file
  async function () {
    await wait(1000);
    const bundle = await rollup({
      input: "./.temp/index.js",
      plugins: [
        nodeResolve(),
        babel({
          babelHelpers: "bundled",
          presets: [
            [
              "@babel/preset-env",
              {
                loose: true,
                modules: false,
              },
            ],
          ],
        }),
        terser(),
      ],
    });
    bundle.write({
      format: "es",
      file: "./dist/index.js",
      sourcemap: true,
      banner: bannerText,
    });
    bundle.write({
      format: "cjs",
      file: "./dist/index.cjs",
      sourcemap: true,
      banner: bannerText,
    });
    bundle.write({
      format: "iife",
      file: "./dist/textile.min.js",
      sourcemap: true,
      banner: bannerText,
      name: "textile",
    });
  },
  // remove temp dir
  async function () {
    await wait(1000);
    forceRemoveDir("./.temp");
  },
];

// Executing arrays of async/await JavaScript functions in series vs. concurrently
// https://www.coreycleary.me/executing-arrays-of-async-await-javascript-functions-in-series-vs-concurrently/

// executing in series
const start = performance.now();
for await (const fn of buildFunctions) {
  await fn();
}
const end = performance.now();
console.log((end - start).toFixed(0));
// executing concurrently
//await Promise.all(buildFunctions.map((fn) => fn()));

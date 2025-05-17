# textile-js

![textile](./textile.png)

This code are copied from https://github.com/borgar/textile-js by [Borgar](https://github.com/borgar).

Just add lang attribute to code block.

**Textile live web editor : https://borgar.github.io/textile-js/**

## Add lang to code block

```textile
bc(foo bar *js #biz). console.log("Hello World")
```

**output**

```html
<pre
  class="foo bar language-js"
  id="biz"
><code class="foo bar language-js">console.log("Hello World")</code></pre>
```

> NOTE: order is important here , before `*lang` are normal class and the last one `#id`,`tag(class ... *lang #id)`.

## Install

```bash
npm i @lwe8/textile
```

## Use

```js
import { TextileJs } from "@lwe8/textile";

const text = 'bc(foo bar *js #biz). console.log("Hello World")';

const textile = new TextileJs();

// text to html
const html = textile.parse(text);
// text to jsonml
const jsonml = textile.jsonml(text);
// jsonml to html
const _html = textile.serialize(jsonml);
```

## Textile Syntax Guide

Please visit https://textile-lang.com/

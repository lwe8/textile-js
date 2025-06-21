const _cache = {};
// ribbon.js
function ribbon(feed) {
  const org = String(feed);
  let slot;
  let pos = 0;
  const self = {
    index: () => {
      return pos;
    },

    save: () => {
      slot = pos;
      return self;
    },

    load: () => {
      pos = slot;
      feed = org.slice(pos);
      return self;
    },

    advance: (n) => {
      pos += typeof n === "string" ? n.length : n;
      feed = org.slice(pos);
      return feed;
    },

    skipWS: () => {
      const ws = /^\s+/.exec(feed);
      if (ws) {
        pos += ws[0].length;
        feed = org.slice(pos);
        return ws[0];
      }
      return "";
    },

    lookbehind: (nchars) => {
      nchars = nchars == null ? 1 : nchars;
      return org.slice(pos - nchars, pos);
    },

    startsWith: (s) => {
      return feed.substring(0, s.length) === s;
    },

    slice: (a, b) => {
      return b != null ? feed.slice(a, b) : feed.slice(a);
    },

    valueOf: () => {
      return feed;
    },

    toString: () => {
      return feed;
    },
  };

  return self;
}
// re.js
/*
 ** Regular Expression helper methods
 **
 ** This provides the `re` object, which contains several helper
 ** methods for working with big regular expressions (soup).
 **
 */
const re = {
  pattern: {
    punct: "[!-/:-@\\[\\\\\\]-`{-~]",
    space: "\\s",
  },

  escape: function (src) {
    return src.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },

  collapse: function (src) {
    return src.replace(/(?:#.*?(?:\n|$))/g, "").replace(/\s+/g, "");
  },

  expandPatterns: function (src) {
    // TODO: provide escape for patterns: \[:pattern:] ?
    return src.replace(/\[:\s*(\w+)\s*:\]/g, function (m, k) {
      const ex = re.pattern[k];
      if (ex) {
        return re.expandPatterns(ex);
      } else {
        throw new Error("Pattern " + m + " not found in " + src);
      }
    });
  },

  isRegExp: function (r) {
    return Object.prototype.toString.call(r) === "[object RegExp]";
  },

  compile: function (src, flags) {
    if (re.isRegExp(src)) {
      if (arguments.length === 1) {
        // no flags arg provided, use the RegExp one
        flags =
          (src.global ? "g" : "") +
          (src.ignoreCase ? "i" : "") +
          (src.multiline ? "m" : "");
      }
      src = src.source;
    }
    // don't do the same thing twice
    const ckey = src + (flags || "");
    if (ckey in _cache) {
      return _cache[ckey];
    }
    // allow classes
    let rx = re.expandPatterns(src);
    // allow verbose expressions
    if (flags && /x/.test(flags)) {
      rx = re.collapse(rx);
    }
    // allow dotall expressions
    if (flags && /s/.test(flags)) {
      rx = rx.replace(/([^\\])\./g, "$1[^\\0]");
    }
    // TODO: test if MSIE and add replace \s with [\s\u00a0] if it is?
    // clean flags and output new regexp
    flags = (flags || "").replace(/[^gim]/g, "");
    return (_cache[ckey] = new RegExp(rx, flags));
  },
};
// merge.js
// merge object b properties into object a
function merge(a, b) {
  if (b) {
    for (const k in b) {
      a[k] = b[k];
    }
  }
  return a;
}

// html.js
re.pattern.html_id = "[a-zA-Z][a-zA-Z\\d:]*";
re.pattern.html_attr = "(?:\"[^\"]+\"|'[^']+'|[^>\\s]+)";

const reAttr = re.compile(/^\s*([^=\s]+)(?:\s*=\s*("[^"]+"|'[^']+'|[^>\s]+))?/);
const reComment = re.compile(/^<!--([\s\S]*?)-->/, "s");
const reEndTag = re.compile(/^<\/([:html_id:])([^>]*)>/);
const reTag = re.compile(
  /^<([:html_id:])((?:\s[^=\s/]+(?:\s*=\s*[:html_attr:])?)+)?\s*(\/?)>/
);
const reHtmlTagBlock = re.compile(
  /^\s*<([:html_id:](?::[a-zA-Z\d]+)*)((?:\s[^=\s/]+(?:\s*=\s*[:html_attr:])?)+)?\s*(\/?)>/
);

const singletons = {
  area: 1,
  base: 1,
  br: 1,
  col: 1,
  embed: 1,
  hr: 1,
  img: 1,
  input: 1,
  link: 1,
  meta: 1,
  option: 1,
  param: 1,
  wbr: 1,
};

function testComment(src) {
  return reComment.exec(src);
}

function testOpenTagBlock(src) {
  return reHtmlTagBlock.exec(src);
}

function testOpenTag(src) {
  return reTag.exec(src);
}

function testCloseTag(src) {
  return reEndTag.exec(src);
}

function parseHtmlAttr(attrSrc) {
  // parse ATTR and add to element
  const attr = {};
  let m;
  while ((m = reAttr.exec(attrSrc))) {
    attr[m[1]] =
      typeof m[2] === "string" ? m[2].replace(/^(["'])(.*)\1$/, "$2") : null;
    attrSrc = attrSrc.slice(m[0].length);
  }
  return attr;
}

const OPEN = "OPEN";
const CLOSE = "CLOSE";
const SINGLE = "SINGLE";
const TEXT = "TEXT";
const COMMENT = "COMMENT";
const WS = "WS";

function tokenize(src, whitelistTags, lazy) {
  const tokens = [];
  let textMode = false;
  const oktag = (tag) => {
    if (textMode) {
      return tag === textMode;
    }
    if (whitelistTags) {
      return tag in whitelistTags;
    }
    return true;
  };
  const nesting = {};
  let nestCount = 0;
  let m;

  src = ribbon(String(src));

  do {
    // comment
    if ((m = testComment(src)) && oktag("!")) {
      tokens.push({
        type: COMMENT,
        data: m[1],
        pos: src.index(),
        src: m[0],
      });
      src.advance(m[0]);
    }

    // end tag
    else if ((m = testCloseTag(src)) && oktag(m[1])) {
      const token = {
        type: CLOSE,
        tag: m[1],
        pos: src.index(),
        src: m[0],
      };
      src.advance(m[0]);
      tokens.push(token);
      nesting[token.tag]--;
      nestCount--;
      // console.log( '/' + token.tag, nestCount, nesting );
      if (
        lazy &&
        (!nestCount || !nesting[token.tag] < 0 || isNaN(nesting[token.tag]))
      ) {
        return tokens;
      }
      // if parse is in text mode then that ends here
      if (textMode) {
        textMode = null;
      }
    }

    // open/void tag
    else if ((m = testOpenTag(src)) && oktag(m[1])) {
      const token = {
        type: m[3] || m[1] in singletons ? SINGLE : OPEN,
        tag: m[1],
        pos: src.index(),
        src: m[0],
      };
      if (m[2]) {
        token.attr = parseHtmlAttr(m[2]);
      }
      // some elements can move parser into "text" mode
      if (m[1] === "script" || m[1] === "code" || m[1] === "style") {
        textMode = token.tag;
      }
      if (token.type === OPEN) {
        nestCount++;
        nesting[token.tag] = (nesting[token.tag] || 0) + 1;
        // console.log( token.tag, nestCount, nesting );
      }
      tokens.push(token);
      src.advance(m[0]);
    }

    // text content
    else {
      // no match, move by all "uninteresting" chars
      m = /([^<]+|[^\0])/.exec(src);
      if (m) {
        tokens.push({
          type: TEXT,
          data: m[0],
          pos: src.index(),
          src: m[0],
        });
      }
      src.advance(m ? m[0].length || 1 : 1);
    }
  } while (src.valueOf());

  return tokens;
}

// This "indesciminately" parses HTML text into a list of JSON-ML element
// No steps are taken however to prevent things like <table><p><td> - user can still create nonsensical but "well-formed" markup
function parseHtml(tokens, lazy) {
  const root = [];
  const stack = [];
  let curr = root;
  let token;
  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (token.type === COMMENT) {
      curr.push(["!", token.data]);
    } else if (token.type === TEXT || token.type === WS) {
      curr.push(token.data);
    } else if (token.type === SINGLE) {
      curr.push(token.attr ? [token.tag, token.attr] : [token.tag]);
    } else if (token.type === OPEN) {
      // TODO: some things auto close other things: <td>, <li>, <p>, <table>
      // https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-omission
      const elm = token.attr ? [token.tag, token.attr] : [token.tag];
      curr.push(elm);
      stack.push(elm);
      curr = elm;
    } else if (token.type === CLOSE) {
      if (stack.length) {
        for (let i = stack.length - 1; i >= 0; i--) {
          const head = stack[i];
          if (head[0] === token.tag) {
            stack.splice(i);
            curr = stack[stack.length - 1] || root;
            break;
          }
        }
      }
      if (!stack.length && lazy) {
        root.sourceLength = token.pos + token.src.length;
        return root;
      }
    }
  }
  root.sourceLength = token ? token.pos + token.src.length : 0;
  return root;
}

/*
 ** JSONML helper methods - http://www.jsonml.org/
 **
 ** This provides the `JSONML` object, which contains helper
 ** methods for rendering JSONML to HTML.
 **
 ** Note that the tag ! is taken to mean comment, this is however
 ** not specified in the JSONML spec.
 */
// jsonml.js

// drop or add tab levels to JsonML tree
function reIndent(ml, shiftBy) {
  // a bit obsessive, but there we are...
  if (!shiftBy) {
    return ml;
  }
  return ml.map(function (s) {
    if (/^\n\t+/.test(s)) {
      if (shiftBy < 0) {
        s = s.slice(0, shiftBy);
      } else {
        for (let i = 0; i < shiftBy; i++) {
          s += "\t";
        }
      }
    } else if (Array.isArray(s)) {
      return reIndent(s, shiftBy);
    }
    return s;
  });
}

function escape(text, escapeQuotes) {
  return text
    .replace(
      /&(?!(#\d{2,}|#x[\da-fA-F]{2,}|[a-zA-Z][a-zA-Z1-4]{1,6});)/g,
      "&amp;"
    )
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, escapeQuotes ? "&quot;" : '"')
    .replace(/'/g, escapeQuotes ? "&#39;" : "'");
}

function toHTML(jsonml) {
  jsonml = jsonml.concat();

  // basic case
  if (typeof jsonml === "string") {
    return escape(jsonml);
  }

  const tag = jsonml.shift();
  let attributes = {};
  let tagAttrs = "";
  const content = [];

  if (
    jsonml.length &&
    typeof jsonml[0] === "object" &&
    !Array.isArray(jsonml[0])
  ) {
    attributes = jsonml.shift();
  }

  while (jsonml.length) {
    content.push(toHTML(jsonml.shift()));
  }

  for (const a in attributes) {
    tagAttrs +=
      attributes[a] == null
        ? ` ${a}`
        : ` ${a}="${escape(String(attributes[a]), true)}"`;
  }

  // be careful about adding whitespace here for inline elements
  if (tag === "!") {
    return `<!--${content.join("")}-->`;
  } else if (tag in singletons || (tag.indexOf(":") > -1 && !content.length)) {
    return `<${tag}${tagAttrs} />`;
  } else {
    return `<${tag}${tagAttrs}>${content.join("")}</${tag}>`;
  }
}
// fixlink.js
// recurse the tree and swap out any "href" attributes
// this uses the context as the replace dictionary so it can be fed to Array#map
function fixLinks(ml, dict) {
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
// builder.js
function builder(initArr) {
  const arr = Array.isArray(initArr) ? initArr : [];

  return {
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
// attr.js
const reClassid = /^\(([^()\n]+)\)/;
const rePaddingL = /^(\(+)/;
const rePaddingR = /^(\)+)/;
const reAlignBlock = /^(<>|<|>|=)/;
const reAlignImg = /^(<|>|=)/;
const reVAlign = /^(~|\^|-)/;
const reColSpan = /^\\(\d+)/;
const reRowSpan = /^\/(\d+)/;
const reStyles = /^\{([^}]*)\}/;
const reCSS = /^\s*([^:\s]+)\s*:\s*(.+)\s*$/;
const reLang = /^\[([^[\]\n]+)\]/;

const pbaAlignLookup = {
  "<": "left",
  "=": "center",
  ">": "right",
  "<>": "justify",
};

const pbaVAlignLookup = {
  "~": "bottom",
  "^": "top",
  "-": "middle",
};

function copyAttr(s, blacklist) {
  if (!s) {
    return undefined;
  }
  const d = {};
  for (const k in s) {
    if (k in s && (!blacklist || !(k in blacklist))) {
      d[k] = s[k];
    }
  }
  return d;
}

function testBlock(name) {
  // "in" test would be better but what about fn#.?
  return /^(?:table|t[dh]|t(?:foot|head|body)|b[qc]|div|notextile|pre|h[1-6]|fn\\d+|p|###)$/.test(
    name
  );
}

/*
  The attr bit causes massive problems for span elements when parentheses are used.
  Parentheses are a total mess and, unsurprisingly, cause trip-ups:

   RC: `_{display:block}(span) span (span)_` -> `<em style="display:block;" class="span">(span) span (span)</em>`
   PHP: `_{display:block}(span) span (span)_` -> `<em style="display:block;">(span) span (span)</em>`

  PHP and RC seem to mostly solve this by not parsing a final attr parens on spans if the
  following character is a non-space. I've duplicated that: Class/ID is not matched on spans
  if it is followed by `endToken` or <space>.

  Lang is not matched here if it is followed by the end token. Theoretically I could limit the lang
  attribute to /^\[[a-z]{2+}(\-[a-zA-Z0-9]+)*\]/ because Textile is layered on top of HTML which
  only accepts valid BCP 47 language tags, but who knows what atrocities are being preformed
  out there in the real world. So this attempts to emulate the other libraries.
*/
function parseAttr(input, element, endToken) {
  input = String(input);
  if (!input || element === "notextile") {
    return undefined;
  }

  let m;
  const st = {};
  const o = { style: st };
  let remaining = input;

  const isBlock = testBlock(element);
  const isImg = element === "img";
  const isList = element === "li";
  const isPhrase = !isBlock && !isImg && element !== "a";
  const reAlign = isImg ? reAlignImg : reAlignBlock;

  do {
    if ((m = reStyles.exec(remaining))) {
      m[1].split(";").forEach(function (p) {
        const d = p.match(reCSS);
        if (d) {
          st[d[1]] = d[2];
        }
      });
      remaining = remaining.slice(m[0].length);
      continue;
    }

    if ((m = reLang.exec(remaining))) {
      const rm = remaining.slice(m[0].length);
      if (
        (!rm && isPhrase) ||
        (endToken && endToken === rm.slice(0, endToken.length))
      ) {
        m = null;
      } else {
        o.lang = m[1];
        remaining = remaining.slice(m[0].length);
      }
      continue;
    }

    if ((m = reClassid.exec(remaining))) {
      const rm = remaining.slice(m[0].length);
      if (
        (!rm && isPhrase) ||
        (endToken &&
          (rm[0] === " " || endToken === rm.slice(0, endToken.length)))
      ) {
        m = null;
      } else {
        const bits = m[1].split("#");
        if (bits[0]) {
          o.class = bits[0];
        }
        if (bits[1]) {
          o.id = bits[1];
        }
        remaining = rm;
      }
      continue;
    }

    if (isBlock || isList) {
      if ((m = rePaddingL.exec(remaining))) {
        st["padding-left"] = `${m[1].length}em`;
        remaining = remaining.slice(m[0].length);
        continue;
      }
      if ((m = rePaddingR.exec(remaining))) {
        st["padding-right"] = `${m[1].length}em`;
        remaining = remaining.slice(m[0].length);
        continue;
      }
    }

    // only for blocks:
    if (isImg || isBlock || isList) {
      if ((m = reAlign.exec(remaining))) {
        const align = pbaAlignLookup[m[1]];
        if (isImg) {
          o.align = align;
        } else {
          st["text-align"] = align;
        }
        remaining = remaining.slice(m[0].length);
        continue;
      }
    }

    // only for table cells
    if (element === "td" || element === "tr") {
      if ((m = reVAlign.exec(remaining))) {
        st["vertical-align"] = pbaVAlignLookup[m[1]];
        remaining = remaining.slice(m[0].length);
        continue;
      }
    }
    if (element === "td") {
      if ((m = reColSpan.exec(remaining))) {
        o.colspan = m[1];
        remaining = remaining.slice(m[0].length);
        continue;
      }
      if ((m = reRowSpan.exec(remaining))) {
        o.rowspan = m[1];
        remaining = remaining.slice(m[0].length);
        continue;
      }
    }
  } while (m);

  // collapse styles
  const s = [];
  for (const v in st) {
    s.push(`${v}:${st[v]}`);
  }
  if (s.length) {
    o.style = s.join(";");
  } else {
    delete o.style;
  }

  return remaining === input ? undefined : [input.length - remaining.length, o];
}

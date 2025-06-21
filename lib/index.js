/*
 ** Textile parser for JavaScript
 **
 ** Copyright (c) 2012 Borgar Þorsteinsson (MIT License).
 **
 */ function $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039(a, b) {
    if (b) for(const k in b)a[k] = b[k];
    return a;
}
function $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(feed) {
    const org = String(feed);
    let slot;
    let pos = 0;
    const self = {
        index: ()=>{
            return pos;
        },
        save: ()=>{
            slot = pos;
            return self;
        },
        load: ()=>{
            pos = slot;
            feed = org.slice(pos);
            return self;
        },
        advance: (n)=>{
            pos += typeof n === "string" ? n.length : n;
            feed = org.slice(pos);
            return feed;
        },
        skipWS: ()=>{
            const ws = /^\s+/.exec(feed);
            if (ws) {
                pos += ws[0].length;
                feed = org.slice(pos);
                return ws[0];
            }
            return "";
        },
        lookbehind: (nchars)=>{
            nchars = nchars == null ? 1 : nchars;
            return org.slice(pos - nchars, pos);
        },
        startsWith: (s)=>{
            return feed.substring(0, s.length) === s;
        },
        slice: (a, b)=>{
            return b != null ? feed.slice(a, b) : feed.slice(a);
        },
        valueOf: ()=>{
            return feed;
        },
        toString: ()=>{
            return feed;
        }
    };
    return self;
}
/*
 ** Regular Expression helper methods
 **
 ** This provides the `re` object, which contains several helper
 ** methods for working with big regular expressions (soup).
 **
 */ const $3c678dba4e2e903e$var$$1d282c06949d5561$var$_cache = {};
const $3c678dba4e2e903e$var$$1d282c06949d5561$var$re = {
    pattern: {
        punct: "[!-/:-@\\[\\\\\\]-`{-~]",
        space: "\\s"
    },
    escape: function(src) {
        return src.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    collapse: function(src) {
        return src.replace(/(?:#.*?(?:\n|$))/g, "").replace(/\s+/g, "");
    },
    expandPatterns: function(src) {
        // TODO: provide escape for patterns: \[:pattern:] ?
        return src.replace(/\[:\s*(\w+)\s*:\]/g, function(m, k) {
            const ex = $3c678dba4e2e903e$var$$1d282c06949d5561$var$re.pattern[k];
            if (ex) return $3c678dba4e2e903e$var$$1d282c06949d5561$var$re.expandPatterns(ex);
            else throw new Error("Pattern " + m + " not found in " + src);
        });
    },
    isRegExp: function(r) {
        return Object.prototype.toString.call(r) === "[object RegExp]";
    },
    compile: function(src, flags) {
        if ($3c678dba4e2e903e$var$$1d282c06949d5561$var$re.isRegExp(src)) {
            if (arguments.length === 1) flags = (src.global ? "g" : "") + (src.ignoreCase ? "i" : "") + (src.multiline ? "m" : "");
            src = src.source;
        }
        // don't do the same thing twice
        const ckey = src + (flags || "");
        if (ckey in $3c678dba4e2e903e$var$$1d282c06949d5561$var$_cache) return $3c678dba4e2e903e$var$$1d282c06949d5561$var$_cache[ckey];
        // allow classes
        let rx = $3c678dba4e2e903e$var$$1d282c06949d5561$var$re.expandPatterns(src);
        // allow verbose expressions
        if (flags && /x/.test(flags)) rx = $3c678dba4e2e903e$var$$1d282c06949d5561$var$re.collapse(rx);
        // allow dotall expressions
        if (flags && /s/.test(flags)) rx = rx.replace(/([^\\])\./g, "$1[^\\0]");
        // TODO: test if MSIE and add replace \s with [\s\u00a0] if it is?
        // clean flags and output new regexp
        flags = (flags || "").replace(/[^gim]/g, "");
        return $3c678dba4e2e903e$var$$1d282c06949d5561$var$_cache[ckey] = new RegExp(rx, flags);
    }
};
var $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039 = $3c678dba4e2e903e$var$$1d282c06949d5561$var$re;
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.html_id = "[a-zA-Z][a-zA-Z\\d:]*";
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.html_attr = "(?:\"[^\"]+\"|'[^']+'|[^>\\s]+)";
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$reAttr = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^\s*([^=\s]+)(?:\s*=\s*("[^"]+"|'[^']+'|[^>\s]+))?/);
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$reComment = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^<!--([\s\S]*?)-->/, "s");
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$reEndTag = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^<\/([:html_id:])([^>]*)>/);
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$reTag = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^<([:html_id:])((?:\s[^=\s/]+(?:\s*=\s*[:html_attr:])?)+)?\s*(\/?)>/);
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$reHtmlTagBlock = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^\s*<([:html_id:](?::[a-zA-Z\d]+)*)((?:\s[^=\s/]+(?:\s*=\s*[:html_attr:])?)+)?\s*(\/?)>/);
const $3c678dba4e2e903e$var$$a37e21e51a445407$export$d8d37edd8cf36f83 = {
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
    wbr: 1
};
function $3c678dba4e2e903e$var$$a37e21e51a445407$export$6e264830d08f3393(src) {
    return $3c678dba4e2e903e$var$$a37e21e51a445407$var$reComment.exec(src);
}
function $3c678dba4e2e903e$var$$a37e21e51a445407$export$54363df15124977a(src) {
    return $3c678dba4e2e903e$var$$a37e21e51a445407$var$reHtmlTagBlock.exec(src);
}
function $3c678dba4e2e903e$var$$a37e21e51a445407$export$6f4e506b48457794(src) {
    return $3c678dba4e2e903e$var$$a37e21e51a445407$var$reTag.exec(src);
}
function $3c678dba4e2e903e$var$$a37e21e51a445407$export$9de3995551e4eda3(src) {
    return $3c678dba4e2e903e$var$$a37e21e51a445407$var$reEndTag.exec(src);
}
function $3c678dba4e2e903e$var$$a37e21e51a445407$export$8e03a9320701dbe8(attrSrc) {
    // parse ATTR and add to element
    const attr = {};
    let m;
    while(m = $3c678dba4e2e903e$var$$a37e21e51a445407$var$reAttr.exec(attrSrc)){
        attr[m[1]] = typeof m[2] === "string" ? m[2].replace(/^(["'])(.*)\1$/, "$2") : null;
        attrSrc = attrSrc.slice(m[0].length);
    }
    return attr;
}
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$OPEN = "OPEN";
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$CLOSE = "CLOSE";
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$SINGLE = "SINGLE";
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$TEXT = "TEXT";
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$COMMENT = "COMMENT";
const $3c678dba4e2e903e$var$$a37e21e51a445407$var$WS = "WS";
function $3c678dba4e2e903e$var$$a37e21e51a445407$export$660b2ee2d4fb4eff(src, whitelistTags, lazy) {
    const tokens = [];
    let textMode = false;
    const oktag = (tag)=>{
        if (textMode) return tag === textMode;
        if (whitelistTags) return tag in whitelistTags;
        return true;
    };
    const nesting = {};
    let nestCount = 0;
    let m;
    src = $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(String(src));
    do {
        // comment
        if ((m = $3c678dba4e2e903e$var$$a37e21e51a445407$export$6e264830d08f3393(src)) && oktag("!")) {
            tokens.push({
                type: $3c678dba4e2e903e$var$$a37e21e51a445407$var$COMMENT,
                data: m[1],
                pos: src.index(),
                src: m[0]
            });
            src.advance(m[0]);
        } else if ((m = $3c678dba4e2e903e$var$$a37e21e51a445407$export$9de3995551e4eda3(src)) && oktag(m[1])) {
            const token = {
                type: $3c678dba4e2e903e$var$$a37e21e51a445407$var$CLOSE,
                tag: m[1],
                pos: src.index(),
                src: m[0]
            };
            src.advance(m[0]);
            tokens.push(token);
            nesting[token.tag]--;
            nestCount--;
            // console.log( '/' + token.tag, nestCount, nesting );
            if (lazy && (!nestCount || !nesting[token.tag] < 0 || isNaN(nesting[token.tag]))) return tokens;
            // if parse is in text mode then that ends here
            if (textMode) textMode = null;
        } else if ((m = $3c678dba4e2e903e$var$$a37e21e51a445407$export$6f4e506b48457794(src)) && oktag(m[1])) {
            const token = {
                type: m[3] || m[1] in $3c678dba4e2e903e$var$$a37e21e51a445407$export$d8d37edd8cf36f83 ? $3c678dba4e2e903e$var$$a37e21e51a445407$var$SINGLE : $3c678dba4e2e903e$var$$a37e21e51a445407$var$OPEN,
                tag: m[1],
                pos: src.index(),
                src: m[0]
            };
            if (m[2]) token.attr = $3c678dba4e2e903e$var$$a37e21e51a445407$export$8e03a9320701dbe8(m[2]);
            // some elements can move parser into "text" mode
            if (m[1] === "script" || m[1] === "code" || m[1] === "style") textMode = token.tag;
            if (token.type === $3c678dba4e2e903e$var$$a37e21e51a445407$var$OPEN) {
                nestCount++;
                nesting[token.tag] = (nesting[token.tag] || 0) + 1;
            // console.log( token.tag, nestCount, nesting );
            }
            tokens.push(token);
            src.advance(m[0]);
        } else {
            // no match, move by all "uninteresting" chars
            m = /([^<]+|[^\0])/.exec(src);
            if (m) tokens.push({
                type: $3c678dba4e2e903e$var$$a37e21e51a445407$var$TEXT,
                data: m[0],
                pos: src.index(),
                src: m[0]
            });
            src.advance(m ? m[0].length || 1 : 1);
        }
    }while (src.valueOf());
    return tokens;
}
// This "indesciminately" parses HTML text into a list of JSON-ML element
// No steps are taken however to prevent things like <table><p><td> - user can still create nonsensical but "well-formed" markup
function $3c678dba4e2e903e$var$$a37e21e51a445407$export$ffae2e31416920bc(tokens, lazy) {
    const root = [];
    const stack = [];
    let curr = root;
    let token;
    for(let i = 0; i < tokens.length; i++){
        token = tokens[i];
        if (token.type === $3c678dba4e2e903e$var$$a37e21e51a445407$var$COMMENT) curr.push([
            "!",
            token.data
        ]);
        else if (token.type === $3c678dba4e2e903e$var$$a37e21e51a445407$var$TEXT || token.type === $3c678dba4e2e903e$var$$a37e21e51a445407$var$WS) curr.push(token.data);
        else if (token.type === $3c678dba4e2e903e$var$$a37e21e51a445407$var$SINGLE) curr.push(token.attr ? [
            token.tag,
            token.attr
        ] : [
            token.tag
        ]);
        else if (token.type === $3c678dba4e2e903e$var$$a37e21e51a445407$var$OPEN) {
            // TODO: some things auto close other things: <td>, <li>, <p>, <table>
            // https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-omission
            const elm = token.attr ? [
                token.tag,
                token.attr
            ] : [
                token.tag
            ];
            curr.push(elm);
            stack.push(elm);
            curr = elm;
        } else if (token.type === $3c678dba4e2e903e$var$$a37e21e51a445407$var$CLOSE) {
            if (stack.length) for(let i = stack.length - 1; i >= 0; i--){
                const head = stack[i];
                if (head[0] === token.tag) {
                    stack.splice(i);
                    curr = stack[stack.length - 1] || root;
                    break;
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
// drop or add tab levels to JsonML tree
function $3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$d77c97251ed182a0(ml, shiftBy) {
    // a bit obsessive, but there we are...
    if (!shiftBy) return ml;
    return ml.map(function(s) {
        if (/^\n\t+/.test(s)) {
            if (shiftBy < 0) s = s.slice(0, shiftBy);
            else for(let i = 0; i < shiftBy; i++)s += "\t";
        } else if (Array.isArray(s)) return $3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$d77c97251ed182a0(s, shiftBy);
        return s;
    });
}
function $3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$4e7f196112fea3c5(text, escapeQuotes) {
    return text.replace(/&(?!(#\d{2,}|#x[\da-fA-F]{2,}|[a-zA-Z][a-zA-Z1-4]{1,6});)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, escapeQuotes ? "&quot;" : '"').replace(/'/g, escapeQuotes ? "&#39;" : "'");
}
function $3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$438fa7935f716bdf(jsonml) {
    jsonml = jsonml.concat();
    // basic case
    if (typeof jsonml === "string") return $3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$4e7f196112fea3c5(jsonml);
    const tag = jsonml.shift();
    let attributes = {};
    let tagAttrs = "";
    const content = [];
    if (jsonml.length && typeof jsonml[0] === "object" && !Array.isArray(jsonml[0])) attributes = jsonml.shift();
    while(jsonml.length)content.push($3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$438fa7935f716bdf(jsonml.shift()));
    for(const a in attributes)tagAttrs += attributes[a] == null ? ` ${a}` : ` ${a}="${$3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$4e7f196112fea3c5(String(attributes[a]), true)}"`;
    // be careful about adding whitespace here for inline elements
    if (tag === "!") return `<!--${content.join("")}-->`;
    else if (tag in $3c678dba4e2e903e$var$$a37e21e51a445407$export$d8d37edd8cf36f83 || tag.indexOf(":") > -1 && !content.length) return `<${tag}${tagAttrs} />`;
    else return `<${tag}${tagAttrs}>${content.join("")}</${tag}>`;
}
function $3c678dba4e2e903e$var$$f30befba8e3ca18c$export$2e2bcd8739ae039(ml, dict) {
    if (Array.isArray(ml)) {
        if (ml[0] === "a") {
            // found a link
            const attr = ml[1];
            if (typeof attr === "object" && "href" in attr && attr.href in dict) attr.href = dict[attr.href];
        }
        for(let i = 0, l = ml.length; i < l; i++)if (Array.isArray(ml[i])) $3c678dba4e2e903e$var$$f30befba8e3ca18c$export$2e2bcd8739ae039(ml[i], dict);
    }
    return ml;
}
function $3c678dba4e2e903e$var$$8b83a3ea098f8f5b$export$2e2bcd8739ae039(initArr) {
    const arr = Array.isArray(initArr) ? initArr : [];
    return {
        add: function(node) {
            if (typeof node === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += node;
            else if (Array.isArray(node)) arr.push(node.filter((s)=>s !== undefined));
            else if (node) arr.push(node);
            return this;
        },
        merge: function(arr) {
            for(let i = 0, l = arr.length; i < l; i++)this.add(arr[i]);
            return this;
        },
        linebreak: function() {
            if (arr.length) this.add("\n");
        },
        get: function() {
            return arr;
        }
    };
}
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reClassid = /^\(([^()\n]+)\)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$rePaddingL = /^(\(+)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$rePaddingR = /^(\)+)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reAlignBlock = /^(<>|<|>|=)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reAlignImg = /^(<|>|=)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reVAlign = /^(~|\^|-)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reColSpan = /^\\(\d+)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reRowSpan = /^\/(\d+)/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reStyles = /^\{([^}]*)\}/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reCSS = /^\s*([^:\s]+)\s*:\s*(.+)\s*$/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reLang = /^\[([^[\]\n]+)\]/;
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$pbaAlignLookup = {
    "<": "left",
    "=": "center",
    ">": "right",
    "<>": "justify"
};
const $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$pbaVAlignLookup = {
    "~": "bottom",
    "^": "top",
    "-": "middle"
};
function $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$82a138c9dbede741(s, blacklist) {
    if (!s) return undefined;
    const d = {};
    for(const k in s)if (k in s && (!blacklist || !(k in blacklist))) d[k] = s[k];
    return d;
}
function $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$testBlock(name) {
    // "in" test would be better but what about fn#.?
    return /^(?:table|t[dh]|t(?:foot|head|body)|b[qc]|div|notextile|pre|h[1-6]|fn\\d+|p|###)$/.test(name);
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
*/ function $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(input, element, endToken) {
    input = String(input);
    if (!input || element === "notextile") return undefined;
    let m;
    const st = {};
    const o = {
        style: st
    };
    let remaining = input;
    const isBlock = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$testBlock(element);
    const isImg = element === "img";
    const isList = element === "li";
    const isPhrase = !isBlock && !isImg && element !== "a";
    const reAlign = isImg ? $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reAlignImg : $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reAlignBlock;
    do {
        if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reStyles.exec(remaining)) {
            m[1].split(";").forEach(function(p) {
                const d = p.match($3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reCSS);
                if (d) st[d[1]] = d[2];
            });
            remaining = remaining.slice(m[0].length);
            continue;
        }
        if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reLang.exec(remaining)) {
            const rm = remaining.slice(m[0].length);
            if (!rm && isPhrase || endToken && endToken === rm.slice(0, endToken.length)) m = null;
            else {
                o.lang = m[1];
                remaining = remaining.slice(m[0].length);
            }
            continue;
        }
        if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reClassid.exec(remaining)) {
            const rm = remaining.slice(m[0].length);
            if (!rm && isPhrase || endToken && (rm[0] === " " || endToken === rm.slice(0, endToken.length))) m = null;
            else {
                const bits = m[1].split("#");
                if (bits[0]) o.class = bits[0];
                if (bits[1]) o.id = bits[1];
                remaining = rm;
            }
            continue;
        }
        if (isBlock || isList) {
            if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$rePaddingL.exec(remaining)) {
                st["padding-left"] = `${m[1].length}em`;
                remaining = remaining.slice(m[0].length);
                continue;
            }
            if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$rePaddingR.exec(remaining)) {
                st["padding-right"] = `${m[1].length}em`;
                remaining = remaining.slice(m[0].length);
                continue;
            }
        }
        // only for blocks:
        if (isImg || isBlock || isList) {
            if (m = reAlign.exec(remaining)) {
                const align = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$pbaAlignLookup[m[1]];
                if (isImg) o.align = align;
                else st["text-align"] = align;
                remaining = remaining.slice(m[0].length);
                continue;
            }
        }
        // only for table cells
        if (element === "td" || element === "tr") {
            if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reVAlign.exec(remaining)) {
                st["vertical-align"] = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$pbaVAlignLookup[m[1]];
                remaining = remaining.slice(m[0].length);
                continue;
            }
        }
        if (element === "td") {
            if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reColSpan.exec(remaining)) {
                o.colspan = m[1];
                remaining = remaining.slice(m[0].length);
                continue;
            }
            if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$var$reRowSpan.exec(remaining)) {
                o.rowspan = m[1];
                remaining = remaining.slice(m[0].length);
                continue;
            }
        }
    }while (m);
    // collapse styles
    const s = [];
    for(const v in st)s.push(`${v}:${st[v]}`);
    if (s.length) o.style = s.join(";");
    else delete o.style;
    return remaining === input ? undefined : [
        input.length - remaining.length,
        o
    ];
}
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reApostrophe = /(\w)'(\w)/g;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reArrow = /([^-]|^)->/;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reClosingDQuote = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/([^\s[(])"(?=$|\s|[:punct:])/g);
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reClosingSQuote = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/([^\s[(])'(?=$|\s|[:punct:])/g);
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reCopyright = /(\b ?|\s|^)(?:\(C\)|\[C\])/gi;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reDimsign = /([\d.,]+['"]? ?)x( ?)(?=[\d.,]['"]?)/g;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reDoublePrime = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/(\d*[.,]?\d+)"(?=\s|$|[:punct:])/g);
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reEllipsis = /([^.]?)\.{3}/g;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reEmdash = /(^|[\s\w])--([\s\w]|$)/g;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reEndash = / - /g;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reOpenDQuote = /"/g;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reOpenSQuote = /'/g;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reRegistered = /(\b ?|\s|^)(?:\(R\)|\[R\])/gi;
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reSinglePrime = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/(\d*[.,]?\d+)'(?=\s|$|[:punct:])/g);
const $3c678dba4e2e903e$var$$8bad2e583046a708$var$reTrademark = /(\b ?|\s|^)(?:\((?:TM|tm)\)|\[(?:TM|tm)\])/g;
function $3c678dba4e2e903e$var$$8bad2e583046a708$export$2e2bcd8739ae039(src) {
    if (typeof src !== "string") return src;
    // NB: order is important here ...
    return src.replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reArrow, "$1&#8594;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reDimsign, "$1&#215;$2").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reEllipsis, "$1&#8230;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reEmdash, "$1&#8212;$2").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reEndash, " &#8211; ").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reTrademark, "$1&#8482;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reRegistered, "$1&#174;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reCopyright, "$1&#169;") // double quotes
    .replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reDoublePrime, "$1&#8243;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reClosingDQuote, "$1&#8221;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reOpenDQuote, "&#8220;") // single quotes
    .replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reSinglePrime, "$1&#8242;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reApostrophe, "$1&#8217;$2").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reClosingSQuote, "$1&#8217;").replace($3c678dba4e2e903e$var$$8bad2e583046a708$var$reOpenSQuote, "&#8216;") // fractions and degrees
    .replace(/[([]1\/4[\])]/, "&#188;").replace(/[([]1\/2[\])]/, "&#189;").replace(/[([]3\/4[\])]/, "&#190;").replace(/[([]o[\])]/, "&#176;").replace(/[([]\+\/-[\])]/, "&#177;");
}
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$68fb15f6adb0419d = "(?:b[qc]|div|notextile|pre|h[1-6]|fn\\d+|p|###)";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$3d19fb1780ae58d = "A-Z\xc0-\xd6\xd8-\xde\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E\u2C7F\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$4e3b3d7da2618855 = ":((?:[^\\s()]|\\([^\\s()]+\\)|[()])+?)(?=[!-\\.:-@\\[\\\\\\]-`{-~]+(?:$|\\s)|$|\\s)";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$993d5d8674603ad5 = "\\([^\\)]+\\)";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$c9122c808e49153d = "\\{[^\\}]+\\}";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$b5a51f7cd9b727fc = "\\[[^\\[\\]]+\\]";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$f4cf0a0b07c2c945 = "(?:<>|<|>|=)";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$432e08aa9b20642 = "[\\(\\)]+";
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$4f470285c57cd8c8 = `(?:${$3c678dba4e2e903e$var$$3122b7c8007103ff$export$993d5d8674603ad5}|${$3c678dba4e2e903e$var$$3122b7c8007103ff$export$c9122c808e49153d}|${$3c678dba4e2e903e$var$$3122b7c8007103ff$export$b5a51f7cd9b727fc}|${$3c678dba4e2e903e$var$$3122b7c8007103ff$export$f4cf0a0b07c2c945}|${$3c678dba4e2e903e$var$$3122b7c8007103ff$export$432e08aa9b20642})*`;
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$b94e33ed5e186b4a = `[\\t ]*(\\*|\\#(?:_|\\d+)?)${$3c678dba4e2e903e$var$$3122b7c8007103ff$export$4f470285c57cd8c8}(?: +\\S|\\.\\s*(?=\\S|\\n))`;
const $3c678dba4e2e903e$var$$3122b7c8007103ff$export$a3a66bd9ba3a98b6 = `[\\t ]*[\\#\\*]*(\\*|\\#(?:_|\\d+)?)${$3c678dba4e2e903e$var$$3122b7c8007103ff$export$4f470285c57cd8c8}(?: +\\S|\\.\\s*(?=\\S|\\n))`;
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txattr = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$4f470285c57cd8c8;
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txcite = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$4e3b3d7da2618855;
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.ucaps = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$3d19fb1780ae58d;
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$phraseConvert = {
    "*": "strong",
    "**": "b",
    "??": "cite",
    _: "em",
    __: "i",
    "-": "del",
    "%": "span",
    "+": "ins",
    "~": "sub",
    "^": "sup",
    "@": "code"
};
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$rePhrase = /^([[{]?)(__?|\*\*?|\?\?|[-+^~@%])/;
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reImage = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^!(?!\s)([:txattr:](?:\.[^\n\S]|\.(?:[^./]))?)([^!\s]+?) ?(?:\(((?:[^()]|\([^()]+\))+)\))?!(?::([^\s]+?(?=[!-.:-@[\\\]-`{-~](?:$|\s)|\s|$)))?/);
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reImageFenced = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^\[!(?!\s)([:txattr:](?:\.[^\n\S]|\.(?:[^./]))?)([^!\s]+?) ?(?:\(((?:[^()]|\([^()]+\))+)\))?!(?::([^\s]+?(?=[!-.:-@[\\\]-`{-~](?:$|\s)|\s|$)))?\]/);
// NB: there is an exception in here to prevent matching "TM)"
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reCaps = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^((?!TM\)|tm\))[[:ucaps:]](?:[[:ucaps:]\d]{1,}(?=\()|[[:ucaps:]\d]{2,}))(?:\((.*?)\))?(?=\W|$)/);
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reLink = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^"(?!\s)((?:[^"]|"(?![\s:])[^\n"]+"(?!:))+)"[:txcite:]/);
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reLinkFenced = /^\["([^\n]+?)":((?:\[[a-z0-9]*\]|[^\]])+)\]/;
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reLinkTitle = /\s*\(((?:\([^()]*\)|[^()])+)\)$/;
const $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reFootnote = /^\[(\d+)(!?)\]/;
function $3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(src, options) {
    src = $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(src);
    const list = $3c678dba4e2e903e$var$$8b83a3ea098f8f5b$export$2e2bcd8739ae039();
    let m;
    let pba;
    // loop
    do {
        src.save();
        // linebreak -- having this first keeps it from messing to much with other phrases
        if (src.startsWith("\r\n")) src.advance(1); // skip cartridge returns
        if (src.startsWith("\n")) {
            src.advance(1);
            if (src.startsWith(" ")) src.advance(1);
            else if (options.breaks) list.add([
                "br"
            ]);
            list.add("\n");
            continue;
        }
        // inline notextile
        if (m = /^==(.*?)==/.exec(src)) {
            src.advance(m[0]);
            list.add(m[1]);
            continue;
        }
        // lookbehind => /([\s>.,"'?!;:])$/
        const behind = src.lookbehind(1);
        const boundary = !behind || /^[\s<>.,"'?!;:()[\]%{}]$/.test(behind);
        // FIXME: need to test right boundary for phrases as well
        if ((m = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$rePhrase.exec(src)) && (boundary || m[1])) {
            src.advance(m[0]);
            const tok = m[2];
            const fence = m[1];
            const phraseType = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$phraseConvert[tok];
            const code = phraseType === "code";
            if (pba = !code && $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(src, phraseType, tok)) {
                src.advance(pba[0]);
                pba = pba[1];
            }
            // FIXME: if we can't match the fence on the end, we should output fence-prefix as normal text
            // seek end
            let mMid;
            let mEnd;
            if (fence === "[") {
                mMid = "^(.*?)";
                mEnd = "(?:])";
            } else if (fence === "{") {
                mMid = "^(.*?)";
                mEnd = "(?:})";
            } else {
                const t1 = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.escape(tok.charAt(0));
                mMid = code ? "^(\\S+|\\S+.*?\\S)" : `^([^\\s${t1}]+|[^\\s${t1}].*?\\S(${t1}*))`;
                mEnd = "(?=$|[\\s.,\"'!?;:()\xab\xbb\u201E\u201C\u201D\u201A\u2018\u2019<>])";
            }
            const rx = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(`${mMid}(${$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.escape(tok)})${mEnd}`);
            if ((m = rx.exec(src)) && m[1]) {
                src.advance(m[0]);
                if (code) list.add([
                    phraseType,
                    m[1]
                ]);
                else list.add([
                    phraseType,
                    pba
                ].concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(m[1], options)));
                continue;
            }
            // else
            src.load();
        }
        // image
        if ((m = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reImage.exec(src)) || (m = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reImageFenced.exec(src))) {
            src.advance(m[0]);
            pba = m[1] && $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(m[1], "img");
            const attr = pba ? pba[1] : {
                src: ""
            };
            let img = [
                "img",
                attr
            ];
            attr.src = m[2];
            attr.alt = m[3] ? attr.title = m[3] : "";
            if (m[4]) // TODO: support link_ref for image cite
            img = [
                "a",
                {
                    href: m[4]
                },
                img
            ];
            list.add(img);
            continue;
        }
        // html comment
        if (m = $3c678dba4e2e903e$var$$a37e21e51a445407$export$6e264830d08f3393(src)) {
            src.advance(m[0]);
            list.add([
                "!",
                m[1]
            ]);
            continue;
        }
        // html tag
        // TODO: this seems to have a lot of overlap with block tags... DRY?
        if (m = $3c678dba4e2e903e$var$$a37e21e51a445407$export$6f4e506b48457794(src)) {
            src.advance(m[0]);
            const tag = m[1];
            const single = m[3] || m[1] in $3c678dba4e2e903e$var$$a37e21e51a445407$export$d8d37edd8cf36f83;
            let element = [
                tag
            ];
            if (m[2]) element.push($3c678dba4e2e903e$var$$a37e21e51a445407$export$8e03a9320701dbe8(m[2]));
            if (single) {
                // single tag
                list.add(element).add(src.skipWS());
                continue;
            } else {
                // need terminator
                // gulp up the rest of this block...
                const reEndTag = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(`^(.*?)(</${tag}\\s*>)`, "s");
                if (m = reEndTag.exec(src)) {
                    src.advance(m[0]);
                    if (tag === "code") element.push(m[1]);
                    else if (tag === "notextile") {
                        // HTML is still parsed, even though textile is not
                        list.merge($3c678dba4e2e903e$var$$a37e21e51a445407$export$ffae2e31416920bc($3c678dba4e2e903e$var$$a37e21e51a445407$export$660b2ee2d4fb4eff(m[1])));
                        continue;
                    } else element = element.concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(m[1], options));
                    list.add(element);
                    continue;
                }
            // end tag is missing, treat tag as normal text...
            }
            src.load();
        }
        // footnote
        if ((m = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reFootnote.exec(src)) && /\S/.test(behind)) {
            src.advance(m[0]);
            list.add([
                "sup",
                {
                    class: "footnote",
                    id: "fnr" + m[1]
                },
                m[2] === "!" ? m[1] // "!" suppresses the link
                 : [
                    "a",
                    {
                        href: "#fn" + m[1]
                    },
                    m[1]
                ]
            ]);
            continue;
        }
        // caps / abbr
        if (m = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reCaps.exec(src)) {
            src.advance(m[0]);
            let caps = [
                "span",
                {
                    class: "caps"
                },
                m[1]
            ];
            if (m[2]) caps = [
                "acronym",
                {
                    title: m[2]
                },
                caps
            ];
            list.add(caps);
            continue;
        }
        // links
        if (boundary && (m = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reLink.exec(src)) || (m = $3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reLinkFenced.exec(src))) {
            src.advance(m[0]);
            let title = m[1].match($3c678dba4e2e903e$var$$c1da35ae23756c5b$var$reLinkTitle);
            let inner = title ? m[1].slice(0, m[1].length - title[0].length) : m[1];
            if (pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(inner, "a")) {
                inner = inner.slice(pba[0]);
                pba = pba[1];
            } else pba = {};
            if (title && !inner) {
                inner = title[0];
                title = "";
            }
            pba.href = m[2];
            if (title) pba.title = title[1];
            // links may self-reference their url via $
            if (inner === "$") inner = pba.href.replace(/^(https?:\/\/|ftps?:\/\/|mailto:)/, "");
            list.add([
                "a",
                pba
            ].concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(inner.replace(/^(\.?\s*)/, ""), options)));
            continue;
        }
        // no match, move by all "uninteresting" chars
        m = /([a-zA-Z0-9,.':]+|[ \f\r\t\v\xA0\u2028\u2029]+|[^\0])/.exec(src);
        if (m) list.add(m[0]);
        src.advance(m ? m[0].length || 1 : 1);
    }while (src.valueOf());
    return list.get().map($3c678dba4e2e903e$var$$8bad2e583046a708$export$2e2bcd8739ae039);
}
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txlisthd = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$b94e33ed5e186b4a;
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txlisthd2 = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$a3a66bd9ba3a98b6;
const $3c678dba4e2e903e$var$$2651df716b8fd793$var$reList = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^((?:[:txlisthd:][^:\r\n]*(?:\r?\n|$))+)(\s*\n|$)/, "s");
const $3c678dba4e2e903e$var$$2651df716b8fd793$var$reItem = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^([#*]+)([^\0]+?)(\n(?=[:txlisthd2:])|$)/, "s");
function $3c678dba4e2e903e$var$$2651df716b8fd793$var$listPad(n) {
    let s = "\n";
    while(n--)s += "\t";
    return s;
}
function $3c678dba4e2e903e$var$$2651df716b8fd793$export$3bff79ad49bb8dba(src) {
    return $3c678dba4e2e903e$var$$2651df716b8fd793$var$reList.exec(src);
}
function $3c678dba4e2e903e$var$$2651df716b8fd793$export$1c14447c2c2991eb(src, options) {
    src = $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(src.replace(/(^|\r?\n)[\t ]+/, "$1"));
    const stack = [];
    const currIndex = {};
    const lastIndex = options._lst || {};
    let itemIndex = 0;
    let listAttr;
    let m;
    let n;
    let s;
    while(m = $3c678dba4e2e903e$var$$2651df716b8fd793$var$reItem.exec(src)){
        const item = [
            "li"
        ];
        const destLevel = m[1].length;
        const type = m[1].substr(-1) === "#" ? "ol" : "ul";
        let newLi = null;
        let lst;
        let par;
        let pba;
        let r;
        // list starts and continuations
        if (n = /^(_|\d+)/.exec(m[2])) {
            itemIndex = isFinite(n[1]) ? parseInt(n[1], 10) : lastIndex[destLevel] || currIndex[destLevel] || 1;
            m[2] = m[2].slice(n[1].length);
        }
        if (pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(m[2], "li")) {
            m[2] = m[2].slice(pba[0]);
            pba = pba[1];
        }
        // list control
        if (/^\.\s*$/.test(m[2])) {
            listAttr = pba || {};
            src.advance(m[0]);
            continue;
        }
        // create nesting until we have correct level
        while(stack.length < destLevel){
            // list always has an attribute object, this simplifies first-pba resolution
            lst = [
                type,
                {},
                $3c678dba4e2e903e$var$$2651df716b8fd793$var$listPad(stack.length + 1),
                newLi = [
                    "li"
                ]
            ];
            par = stack[stack.length - 1];
            if (par) {
                par.li.push($3c678dba4e2e903e$var$$2651df716b8fd793$var$listPad(stack.length));
                par.li.push(lst);
            }
            stack.push({
                ul: lst,
                li: newLi,
                // count attributes's found per list
                att: 0
            });
            currIndex[stack.length] = 1;
        }
        // remove nesting until we have correct level
        while(stack.length > destLevel){
            r = stack.pop();
            r.ul.push($3c678dba4e2e903e$var$$2651df716b8fd793$var$listPad(stack.length));
            // lists have a predictable structure - move pba from listitem to list
            if (r.att === 1 && !r.ul[3][1].substr) $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039(r.ul[1], r.ul[3].splice(1, 1)[0]);
        }
        // parent list
        par = stack[stack.length - 1];
        if (itemIndex) {
            par.ul[1].start = itemIndex;
            currIndex[destLevel] = itemIndex;
            // falsy prevents this from fireing until it is set again
            itemIndex = 0;
        }
        if (listAttr) {
            // "more than 1" prevent attribute transfers on list close
            par.att = 9;
            $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039(par.ul[1], listAttr);
            listAttr = null;
        }
        if (!newLi) {
            par.ul.push($3c678dba4e2e903e$var$$2651df716b8fd793$var$listPad(stack.length), item);
            par.li = item;
        }
        if (pba) {
            par.li.push(pba);
            par.att++;
        }
        Array.prototype.push.apply(par.li, $3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(m[2].trim(), options));
        src.advance(m[0]);
        currIndex[destLevel] = (currIndex[destLevel] || 0) + 1;
    }
    // remember indexes for continuations next time
    options._lst = currIndex;
    while(stack.length){
        s = stack.pop();
        s.ul.push($3c678dba4e2e903e$var$$2651df716b8fd793$var$listPad(stack.length));
        // lists have a predictable structure - move pba from listitem to list
        if (s.att === 1 && !s.ul[3][1].substr) $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039(s.ul[1], s.ul[3].splice(1, 1)[0]);
    }
    return s.ul;
}
//
const $3c678dba4e2e903e$var$$5c0617f6cdbc16f6$var$reDeflist = /^((?:- (?:[^\n]\n?)+?)+:=(?: *\n[^\0]+?=:(?:\n|$)|(?:[^\0]+?(?:$|\n(?=\n|- )))))+/;
const $3c678dba4e2e903e$var$$5c0617f6cdbc16f6$var$reItem = /^((?:- (?:[^\n]\n?)+?)+):=( *\n[^\0]+?=:\s*(?:\n|$)|(?:[^\0]+?(?:$|\n(?=\n|- ))))/;
function $3c678dba4e2e903e$var$$5c0617f6cdbc16f6$export$59730de7815d1e0f(src) {
    return $3c678dba4e2e903e$var$$5c0617f6cdbc16f6$var$reDeflist.exec(src);
}
function $3c678dba4e2e903e$var$$5c0617f6cdbc16f6$export$10add4594dd87d77(src, options) {
    src = $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(src.trim());
    // late loading to get around the lack of non-circular-dependency support in RequireJS
    // const parsePhrase = require("./phrase").parsePhrase;
    // const parseFlow = require("./flow").parseFlow;
    const deflist = [
        "dl",
        "\n"
    ];
    let terms;
    let def;
    let m;
    while(m = $3c678dba4e2e903e$var$$5c0617f6cdbc16f6$var$reItem.exec(src)){
        // add terms
        terms = m[1].split(/(?:^|\n)- /).slice(1);
        while(terms.length)deflist.push("\t", [
            "dt"
        ].concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(terms.shift().trim(), options)), "\n");
        // add definitions
        def = m[2].trim();
        deflist.push("\t", [
            "dd"
        ].concat(/=:$/.test(def) ? $3c678dba4e2e903e$var$$93d220932d1572f7$export$2e2bcd8739ae039(def.slice(0, -2).trim(), options) : $3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(def, options)), "\n");
        src.advance(m[0]);
    }
    return deflist;
}
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txattr = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$4f470285c57cd8c8;
const $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reTable = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^((?:table[:txattr:]\.(?:\s(.+?))\s*\n)?(?:(?:[:txattr:]\.[^\n\S]*)?\|.*?\|[^\n\S]*(?:\n|$))+)([^\n\S]*\n+)?/, "s");
const $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reHead = /^table(_?)([^\n]*?)\.(?:[ \t](.+?))?\s*\n/;
const $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reRow = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^(?:\|([~^-][:txattr:])\.\s*\n)?([:txattr:]\.[^\n\S]*)?\|(.*?)\|[^\n\S]*(\n|$)/, "s");
const $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reCaption = /^\|=([^\n+]*)\n/;
const $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reColgroup = /^\|:([^\n+]*)\|[\r\t ]*\n/;
const $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reRowgroup = /^\|([\^\-~])([^\n+]*)\.[ \t\r]*\n/;
const $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$charToTag = {
    "^": "thead",
    "~": "tfoot",
    "-": "tbody"
};
function $3c678dba4e2e903e$var$$69b5e596e9cf4116$export$2df229a971038e60(src) {
    const colgroup = [
        "colgroup",
        {}
    ];
    src.split("|").forEach(function(s, isCol) {
        const col = isCol ? {} : colgroup[1];
        let d = s.trim();
        let m;
        if (d) {
            if (m = /^\\(\d+)/.exec(d)) {
                col.span = +m[1];
                d = d.slice(m[0].length);
            }
            if (m = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(d, "col")) {
                $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039(col, m[1]);
                d = d.slice(m[0]);
            }
            if (m = /\b\d+\b/.exec(d)) col.width = +m[0];
        }
        if (isCol) colgroup.push("\n\t\t", [
            "col",
            col
        ]);
    });
    return colgroup.concat([
        "\n\t"
    ]);
}
function $3c678dba4e2e903e$var$$69b5e596e9cf4116$export$81c7950acfeb9273(src) {
    return $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reTable.exec(src);
}
function $3c678dba4e2e903e$var$$69b5e596e9cf4116$export$5f9db210835129c(src, options) {
    src = $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(src.trim());
    const rowgroups = [];
    let colgroup;
    let caption;
    const tAttr = {};
    let tCurr;
    let row;
    let inner;
    let pba;
    let more;
    let m;
    let extended = 0;
    const setRowGroup = function(type, pba) {
        tCurr = [
            type,
            pba || {}
        ];
        rowgroups.push(tCurr);
    };
    if (m = $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reHead.exec(src)) {
        // parse and apply table attr
        src.advance(m[0]);
        pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(m[2], "table");
        if (pba) $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039(tAttr, pba[1]);
        if (m[3]) tAttr.summary = m[3];
    }
    // caption
    if (m = $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reCaption.exec(src)) {
        caption = [
            "caption"
        ];
        if (pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(m[1], "caption")) {
            caption.push(pba[1]);
            m[1] = m[1].slice(pba[0]);
        }
        if (/\./.test(m[1])) {
            // mandatory "."
            caption.push(m[1].slice(1).replace(/\|\s*$/, "").trim());
            extended++;
            src.advance(m[0]);
        } else caption = null;
    }
    do {
        // colgroup
        if (m = $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reColgroup.exec(src)) {
            colgroup = $3c678dba4e2e903e$var$$69b5e596e9cf4116$export$2df229a971038e60(m[1]);
            extended++;
        } else if (m = $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reRowgroup.exec(src)) {
            // PHP allows any amount of these in any order
            // and simply translates them straight through
            // the same is done here.
            const tag = $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$charToTag[m[1]] || "tbody";
            pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(`${m[2]} `, tag);
            setRowGroup(tag, pba && pba[1]);
            extended++;
        } else if (m = $3c678dba4e2e903e$var$$69b5e596e9cf4116$var$reRow.exec(src)) {
            if (!tCurr) setRowGroup("tbody");
            row = [
                "tr"
            ];
            if (m[2] && (pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(m[2], "tr"))) row.push(pba[1]);
            tCurr.push("\n\t\t", row);
            inner = $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(m[3]);
            do {
                inner.save();
                // cell loop
                const th = inner.startsWith("_");
                let cell = [
                    th ? "th" : "td"
                ];
                if (th) inner.advance(1);
                pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(inner, "td");
                if (pba) {
                    inner.advance(pba[0]);
                    cell.push(pba[1]); // FIXME: don't do this if next text fails
                }
                if (pba || th) {
                    const p = /^\.\s*/.exec(inner);
                    if (p) inner.advance(p[0]);
                    else {
                        cell = [
                            "td"
                        ];
                        inner.load();
                    }
                }
                const mx = /^(==.*?==|[^|])*/.exec(inner);
                cell = cell.concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(mx[0], options));
                row.push("\n\t\t\t", cell);
                more = inner.valueOf().charAt(mx[0].length) === "|";
                inner.advance(mx[0].length + 1);
            }while (more);
            row.push("\n\t\t");
        }
        //
        if (m) src.advance(m[0]);
    }while (m);
    // assemble table
    let table = [
        "table",
        tAttr
    ];
    if (extended) {
        if (caption) table.push("\n\t", caption);
        if (colgroup) table.push("\n\t", colgroup);
        rowgroups.forEach(function(tbody) {
            table.push("\n\t", tbody.concat([
                "\n\t"
            ]));
        });
    } else table = table.concat($3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$d77c97251ed182a0(rowgroups[0].slice(2), -1));
    table.push("\n");
    return table;
}
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txblocks = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$68fb15f6adb0419d;
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txlisthd = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$b94e33ed5e186b4a;
$3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.pattern.txattr = $3c678dba4e2e903e$var$$3122b7c8007103ff$export$4f470285c57cd8c8;
// HTML tags allowed in the document (root) level that trigger HTML parsing
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$allowedBlocktags = {
    p: 0,
    hr: 0,
    ul: 1,
    ol: 0,
    li: 0,
    div: 1,
    pre: 0,
    object: 1,
    script: 0,
    noscript: 0,
    blockquote: 1,
    notextile: 1
};
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlock = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^([:txblocks:])/);
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockNormal = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^(.*?)($|\r?\n(?=[:txlisthd:])|\r?\n(?:\s*\n|$)+)/, "s");
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockExtended = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^(.*?)($|\r?\n(?=[:txlisthd:])|\r?\n+(?=[:txblocks:][:txattr:]\.))/, "s");
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockNormalPre = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^(.*?)($|\r?\n(?:\s*\n|$)+)/, "s");
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockExtendedPre = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^(.*?)($|\r?\n+(?=[:txblocks:][:txattr:]\.))/, "s");
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reRuler = /^(---+|\*\*\*+|___+)(\r?\n\s+|$)/;
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reLinkRef = $3c678dba4e2e903e$var$$1d282c06949d5561$export$2e2bcd8739ae039.compile(/^\[([^\]]+)\]((?:https?:\/\/|\/)\S+)(?:\s*\n|$)/);
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$reFootnoteDef = /^fn\d+$/;
const $3c678dba4e2e903e$var$$93d220932d1572f7$var$hasOwn = Object.prototype.hasOwnProperty;
function $3c678dba4e2e903e$var$$93d220932d1572f7$var$extend(target, ...args) {
    for(let i = 1; i < args.length; i++){
        const src = args[i];
        if (src != null) {
            for(const nextKey in src)if ($3c678dba4e2e903e$var$$93d220932d1572f7$var$hasOwn.call(src, nextKey)) target[nextKey] = src[nextKey];
        }
    }
    return target;
}
function $3c678dba4e2e903e$var$$93d220932d1572f7$var$paragraph(s, tag, pba, linebreak, options) {
    tag = tag || "p";
    let out = [];
    s.split(/(?:\r?\n){2,}/).forEach(function(bit, i) {
        if (tag === "p" && /^\s/.test(bit)) {
            // no-paragraphs
            bit = bit.replace(/\r?\n[\t ]/g, " ").trim();
            out = out.concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(bit, options));
        } else {
            if (linebreak && i) out.push(linebreak);
            out.push(pba ? [
                tag,
                pba
            ].concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(bit, options)) : [
                tag
            ].concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(bit, options)));
        }
    });
    return out;
}
function $3c678dba4e2e903e$var$$93d220932d1572f7$export$2e2bcd8739ae039(src, options) {
    const list = $3c678dba4e2e903e$var$$8b83a3ea098f8f5b$export$2e2bcd8739ae039();
    let linkRefs;
    let m;
    src = $3c678dba4e2e903e$var$$a42d20654869d369$export$2e2bcd8739ae039(src.replace(/^( *\r?\n)+/, ""));
    // loop
    while(src.valueOf()){
        src.save();
        // link_ref -- this goes first because it shouldn't trigger a linebreak
        if (m = $3c678dba4e2e903e$var$$93d220932d1572f7$var$reLinkRef.exec(src)) {
            if (!linkRefs) linkRefs = {};
            src.advance(m[0]);
            linkRefs[m[1]] = m[2];
            continue;
        }
        // add linebreak
        list.linebreak();
        // named block
        if (m = $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlock.exec(src)) {
            src.advance(m[0]);
            const blockType = m[0];
            let pba = $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$d543073c23be49b9(src, blockType);
            if (pba) {
                src.advance(pba[0]);
                pba = pba[1];
            }
            if (m = /^\.(\.?)(?:\s|(?=:))/.exec(src)) {
                // FIXME: this whole copyAttr seems rather strange?
                // slurp rest of block
                const extended = !!m[1];
                let reBlockGlob = extended ? $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockExtended : $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockNormal;
                if (blockType === "bc" || blockType === "pre") reBlockGlob = extended ? $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockExtendedPre : $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockNormalPre;
                m = reBlockGlob.exec(src.advance(m[0]));
                src.advance(m[0]);
                // bq | bc | notextile | pre | h# | fn# | p | ###
                if (blockType === "bq") {
                    let inner = m[1];
                    if (m = /^:(\S+)\s+/.exec(inner)) {
                        if (!pba) pba = {};
                        pba.cite = m[1];
                        inner = inner.slice(m[0].length);
                    }
                    // RedCloth adds all attr to both: this is bad because it produces duplicate IDs
                    const par = $3c678dba4e2e903e$var$$93d220932d1572f7$var$paragraph(inner, "p", $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$82a138c9dbede741(pba, {
                        cite: 1,
                        id: 1
                    }), "\n", options);
                    list.add([
                        "blockquote",
                        pba,
                        "\n"
                    ].concat(par).concat([
                        "\n"
                    ]));
                } else if (blockType === "bc") {
                    const subPba = pba ? $3c678dba4e2e903e$var$$b952e5f5cad58fa1$export$82a138c9dbede741(pba, {
                        id: 1
                    }) : null;
                    list.add([
                        "pre",
                        pba,
                        subPba ? [
                            "code",
                            subPba,
                            m[1]
                        ] : [
                            "code",
                            m[1]
                        ]
                    ]);
                } else if (blockType === "notextile") list.merge($3c678dba4e2e903e$var$$a37e21e51a445407$export$ffae2e31416920bc($3c678dba4e2e903e$var$$a37e21e51a445407$export$660b2ee2d4fb4eff(m[1])));
                else if (blockType === "###") ;
                else if (blockType === "pre") // "pre(foo#bar).. line1\n\nline2" prevents multiline preformat blocks
                // ...which seems like the whole point of having an extended pre block?
                list.add([
                    "pre",
                    pba,
                    m[1]
                ]);
                else if ($3c678dba4e2e903e$var$$93d220932d1572f7$var$reFootnoteDef.test(blockType)) {
                    // footnote
                    // Need to be careful: RedCloth fails "fn1(foo#m). footnote" -- it confuses the ID
                    const fnid = blockType.replace(/\D+/g, "");
                    if (!pba) pba = {};
                    pba.class = (pba.class ? pba.class + " " : "") + "footnote";
                    pba.id = "fn" + fnid;
                    list.add([
                        "p",
                        pba,
                        [
                            "a",
                            {
                                href: "#fnr" + fnid
                            },
                            [
                                "sup",
                                fnid
                            ]
                        ],
                        " "
                    ].concat($3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(m[1], options)));
                } else list.merge($3c678dba4e2e903e$var$$93d220932d1572f7$var$paragraph(m[1], blockType, pba, "\n", options));
                continue;
            } else src.load();
        }
        // HTML comment
        if (m = $3c678dba4e2e903e$var$$a37e21e51a445407$export$6e264830d08f3393(src)) {
            src.advance(m[0] + (/(?:\s*\n+)+/.exec(src) || [])[0]);
            list.add([
                "!",
                m[1]
            ]);
            continue;
        }
        // block HTML
        if (m = $3c678dba4e2e903e$var$$a37e21e51a445407$export$54363df15124977a(src)) {
            const tag = m[1];
            // Is block tag? ...
            if (tag in $3c678dba4e2e903e$var$$93d220932d1572f7$var$allowedBlocktags) {
                if (m[3] || tag in $3c678dba4e2e903e$var$$a37e21e51a445407$export$d8d37edd8cf36f83) {
                    // single?
                    src.advance(m[0]);
                    if (/^\s*(\n|$)/.test(src)) {
                        const elm = [
                            tag
                        ];
                        if (m[2]) elm.push($3c678dba4e2e903e$var$$a37e21e51a445407$export$8e03a9320701dbe8(m[2]));
                        list.add(elm);
                        src.skipWS();
                        continue;
                    }
                } else if (tag === "pre") {
                    const t = $3c678dba4e2e903e$var$$a37e21e51a445407$export$660b2ee2d4fb4eff(src, {
                        pre: 1,
                        code: 1
                    }, tag);
                    const p = $3c678dba4e2e903e$var$$a37e21e51a445407$export$ffae2e31416920bc(t, true);
                    src.load().advance(p.sourceLength);
                    if (/^\s*(\n|$)/.test(src)) {
                        list.merge(p);
                        src.skipWS(); // skip tailing whitespace
                        continue;
                    }
                } else if (tag === "notextile") {
                    // merge all child elements
                    const t = $3c678dba4e2e903e$var$$a37e21e51a445407$export$660b2ee2d4fb4eff(src, null, tag);
                    let s = 1; // start after open tag
                    while(/^\s+$/.test(t[s].src))s++; // skip whitespace
                    const p = $3c678dba4e2e903e$var$$a37e21e51a445407$export$ffae2e31416920bc(t.slice(s, -1), true);
                    const x = t.pop();
                    src.load().advance(x.pos + x.src.length);
                    if (/^\s*(\n|$)/.test(src)) {
                        list.merge(p);
                        src.skipWS(); // skip tailing whitespace
                        continue;
                    }
                } else {
                    src.skipWS();
                    const t = $3c678dba4e2e903e$var$$a37e21e51a445407$export$660b2ee2d4fb4eff(src, null, tag);
                    const x = t.pop(); // this should be the end tag
                    let s = 1; // start after open tag
                    while(t[s] && /^[\n\r]+$/.test(t[s].src))s++; // skip whitespace
                    if (x.tag === tag) {
                        // inner can be empty
                        const inner = t.length > 1 ? src.slice(t[s].pos, x.pos) : "";
                        src.advance(x.pos + x.src.length);
                        if (/^\s*(\n|$)/.test(src)) {
                            let elm = [
                                tag
                            ];
                            if (m[2]) elm.push($3c678dba4e2e903e$var$$a37e21e51a445407$export$8e03a9320701dbe8(m[2]));
                            if (tag === "script" || tag === "style") elm.push(inner);
                            else {
                                const innerHTML = inner.replace(/^\n+/, "").replace(/\s*$/, "");
                                const isBlock = /\n\r?\n/.test(innerHTML) || tag === "ol" || tag === "ul";
                                const innerElm = isBlock ? $3c678dba4e2e903e$var$$93d220932d1572f7$export$2e2bcd8739ae039(innerHTML, options) : $3c678dba4e2e903e$var$$c1da35ae23756c5b$export$2e2bcd8739ae039(innerHTML, $3c678dba4e2e903e$var$$93d220932d1572f7$var$extend({}, options, {
                                    breaks: false
                                }));
                                if (isBlock || /^\n/.test(inner)) elm.push("\n");
                                if (isBlock || /\s$/.test(inner)) innerElm.push("\n");
                                elm = elm.concat(innerElm);
                            }
                            list.add(elm);
                            src.skipWS(); // skip tailing whitespace
                            continue;
                        }
                    }
                }
            }
            src.load();
        }
        // ruler
        if (m = $3c678dba4e2e903e$var$$93d220932d1572f7$var$reRuler.exec(src)) {
            src.advance(m[0]);
            list.add([
                "hr"
            ]);
            continue;
        }
        // list
        if (m = $3c678dba4e2e903e$var$$2651df716b8fd793$export$3bff79ad49bb8dba(src)) {
            src.advance(m[0]);
            list.add($3c678dba4e2e903e$var$$2651df716b8fd793$export$1c14447c2c2991eb(m[0], options));
            continue;
        }
        // definition list
        if (m = $3c678dba4e2e903e$var$$5c0617f6cdbc16f6$export$59730de7815d1e0f(src)) {
            src.advance(m[0]);
            list.add($3c678dba4e2e903e$var$$5c0617f6cdbc16f6$export$10add4594dd87d77(m[0], options));
            continue;
        }
        // table
        if (m = $3c678dba4e2e903e$var$$69b5e596e9cf4116$export$81c7950acfeb9273(src)) {
            src.advance(m[0]);
            list.add($3c678dba4e2e903e$var$$69b5e596e9cf4116$export$5f9db210835129c(m[1], options));
            continue;
        }
        // paragraph
        m = $3c678dba4e2e903e$var$$93d220932d1572f7$var$reBlockNormal.exec(src);
        list.merge($3c678dba4e2e903e$var$$93d220932d1572f7$var$paragraph(m[1], "p", undefined, "\n", options));
        src.advance(m[0]);
    }
    return linkRefs ? fixLinks(list.get(), linkRefs) : list.get();
}
/**
 * @param {string} txt
 * @param {{breaks?:boolean}} [opt]
 * @returns {string}
 */ function $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile(txt, opt) {
    // get a throw-away copy of options
    opt = $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039($3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039({}, $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.defaults), opt || {});
    // run the converter
    return $3c678dba4e2e903e$var$$93d220932d1572f7$export$2e2bcd8739ae039(txt, opt).map($3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$438fa7935f716bdf).join("");
}
// options
$3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.defaults = {
    // single-line linebreaks are converted to <br> by default
    breaks: true
};
$3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.setOptions = $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.setoptions = function(opt) {
    $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039($3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.defaults, opt);
    return this;
};
$3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.parse = $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.convert = $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile;
$3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.html_parser = $3c678dba4e2e903e$var$$a37e21e51a445407$export$ffae2e31416920bc;
/**
 *
 * @param {string} txt
 * @param {{breaks?:boolean}} [opt]
 * @returns {Array<any>}
 */ $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.jsonml = function(txt, opt) {
    // get a throw-away copy of options
    opt = $3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039($3c678dba4e2e903e$var$$cc478446806820dc$export$2e2bcd8739ae039({}, $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.defaults), opt || {});
    // parse and return tree
    return [
        "html"
    ].concat($3c678dba4e2e903e$var$$93d220932d1572f7$export$2e2bcd8739ae039(txt, opt));
};
/**
 * @param {Array<any>} jsonml
 * @return {string}
 */ $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile.serialize = $3c678dba4e2e903e$var$$740110f7f7a3a6e8$export$438fa7935f716bdf;
var $3c678dba4e2e903e$export$2e2bcd8739ae039 = $3c678dba4e2e903e$var$$cf838c15c8b009ba$var$textile;


/** @import {JsonMLTree,Option} from "@lwe8/text-types" */ //
const $25158b8b7101d1c8$var$defaultOption = {
    breaks: true
};
const $25158b8b7101d1c8$var$parsers = {
    /**
   * Textile to HTML
   * @param {string} text
   * @param {Option} [option]
   * @returns {string}
   */ textileToHtml (text, option) {
        const opt = option ?? $25158b8b7101d1c8$var$defaultOption;
        return (0, $3c678dba4e2e903e$export$2e2bcd8739ae039).parse(text, opt);
    },
    /**
   * Textile to JsonML
   * @param {string} text
   * @param {Option} [option]
   * @returns {JsonMLTree}
   */ textileToJsonML (text, option) {
        const opt = option ?? $25158b8b7101d1c8$var$defaultOption;
        return (0, $3c678dba4e2e903e$export$2e2bcd8739ae039).jsonml(text, opt);
    },
    /**
   * JsonML to HTML
   * @param {JsonMLTree} ml
   * @returns {string}
   */ jsonMlToHtml (ml) {
        if (ml[0] !== "html") new TypeError("Wrong Tree Format");
        return (0, $3c678dba4e2e903e$export$2e2bcd8739ae039).serialize(ml);
    }
};
var $25158b8b7101d1c8$export$2e2bcd8739ae039 = $25158b8b7101d1c8$var$parsers;


const $bc68805842a7be7a$var$helpers = {
    isAttrNode (input) {
        return typeof input === "object" && Array.isArray(input) === false && input !== null;
    }
};
var $bc68805842a7be7a$export$2e2bcd8739ae039 = $bc68805842a7be7a$var$helpers;


/** @import {WalkFunction,JsonMLTree,TxastTree,TxastNodes} from "@lwe8/text-types" */ const $b0b154b565ee4205$var$txast = {
    /**
   * Converts a JsonML tree into a TxAST (Textile Abstract Syntax Tree) structure.
   *
   * @param {import("@lwe8/text-types").JsonMLTree} jsonmlTree - The JsonML tree to convert.
   * @returns {TxastTree} The resulting TxAST tree.
   */ createTxast (jsonmlTree) {
        /** @type {TxastTree} */ const txast = {
            type: "root",
            tagName: "html",
            children: []
        };
        /**
     *
     * @param {JsonMLNode} node
     * @param {TxastNodes} children
     */ const travis = (node, children)=>{
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
                if ((0, $bc68805842a7be7a$export$2e2bcd8739ae039).isAttrNode(node[1])) {
                    txastNode.properties = node[1];
                    remainNode = node.slice(2);
                } else remainNode = node.slice(1);
                if (Array.isArray(remainNode) && remainNode.length > 0) {
                    txastNode.children = [];
                    remainNode.forEach((n)=>{
                        travis(n, txastNode.children);
                    });
                }
            }
            children.push(txastNode);
        };
        jsonmlTree.slice(1).forEach((node)=>{
            travis(node, txast.children);
        });
        return txast;
    },
    /**
   * Converts a TxAST tree into a JsonML representation.
   *
   * @param {TxastTree} txastTree - The root TxAST node to convert.
   * @returns {JsonMLTree} The JsonML representation of the input TxAST tree.
   */ createJsonML (txastTree) {
        const jsonMLTree = [
            "html"
        ];
        /**
     *
     * @param {TxastNode} node
     */ const travis = (node)=>{
            /** @type {import("@lwe8/text-types").ElementNode} */ const elNode = [];
            if (node.type === "text" || node.type === "breaks") return node.value;
            else {
                elNode[0] = node.tagName;
                if (node.properties) elNode[1] = node.properties;
                if (node.children && node.children.length > 0) node.children.forEach((n)=>{
                    elNode.push(travis(n));
                });
                return elNode;
            }
        };
        txastTree.children.forEach((node)=>{
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
   */ walk (txastTree, callback) {
        /**
     *
     * @param {TxastNode} node
     */ const travis = (node)=>{
            const index = txastTree.children.indexOf(node);
            callback(node, index, txastTree.children);
            if (node.type === "element" && node.children) node.children.forEach((v, i, p)=>callback(v, i, p));
        };
        txastTree.children.map((v)=>travis(v));
    }
};
var $b0b154b565ee4205$export$2e2bcd8739ae039 = $b0b154b565ee4205$var$txast;


/** @import {WalkFunction,TextileExtension,JsonMLTree,TxastTree,Option} from "@lwe8/text-types" */ const $cf838c15c8b009ba$var$htmlTagRegex = /<\/?html>/g;
class $cf838c15c8b009ba$var$Textile {
    /**
   *
   * @param {Option} [option]
   */ constructor(option){
        /** @private */ this._opt = option ?? {
            breaks: true
        };
        /**
     * @private
     * @type {TextileExtension[]}
     *
     */ this._exts = [];
        /** @private */ this._text = "";
        /**
     * @private
     * @type {JsonMLTree}
     *
     */ this._jsonml = [];
        /**
     * @private
     * @type {TxastTree}
     *
     */ this._txastTree = {};
        /**
     * @private
     * @type {WalkFunction[]}
     *
     */ this._visitors = [];
        /** @private */ this._html = "";
    }
    /** @private */ _int() {
        if (this._text === "") throw new Error("You must input text to convert");
        this._jsonml = (0, $25158b8b7101d1c8$export$2e2bcd8739ae039).textileToJsonML(this._text, this._opt);
        this._txastTree = (0, $b0b154b565ee4205$export$2e2bcd8739ae039).createTxast(this._jsonml);
        if (this._exts.length > 0) for (const ext of this._exts)(0, $b0b154b565ee4205$export$2e2bcd8739ae039).walk(this._txastTree, ext.walkTree);
        if (this._visitors.length > 0) for (const visitor of this._visitors)(0, $b0b154b565ee4205$export$2e2bcd8739ae039).walk(this._txastTree, visitor);
        this._jsonml = (0, $b0b154b565ee4205$export$2e2bcd8739ae039).createJsonML(this._txastTree);
        this._html = (0, $25158b8b7101d1c8$export$2e2bcd8739ae039).jsonMlToHtml(this._jsonml).replace($cf838c15c8b009ba$var$htmlTagRegex, "");
    }
    /**
   *
   * @param {TextileExtension} ext
   */ use(ext) {
        this._exts.push(ext);
        return this;
    }
    /**
   *
   * @param {WalkFunction} visitor
   * @returns {this}
   */ visit(visitor) {
        this._visitors.push(visitor);
        return this;
    }
    /**
   *
   * @param {string} input
   */ parse(input) {
        this._text = input;
        this._int();
        return {
            html: this._html,
            jsonMLTree: this._jsonml,
            txastTree: this._txastTree
        };
    }
}
var $cf838c15c8b009ba$export$2e2bcd8739ae039 = $cf838c15c8b009ba$var$Textile;


export {$cf838c15c8b009ba$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.js.map

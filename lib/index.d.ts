export = Textile;
export as namespace textile;
declare namespace Textile {
  export type Attributes = Record<string, string>;
  export type ElementNode = [string, ...(Attributes | JsonMLNode)[]];
  export type JsonMLNode = string | ElementNode;
  export type JsonMLNodes = JsonMLNode[];
  export type JsonMLTree = JsonMLNode[];
  export type TokenType =
    | "CLOSE"
    | "TEXT"
    | "OPEN"
    | "SINGLE"
    | "COMMENT"
    | "WS";
  export type Token =
    | {
        type: TokenType;
        pos: number;
        src: string;
        tag?: Tags;
        attr?: Record<string, string>;
      }
    | {
        type: TokenType;
        pos: number;
        src: string;
        data: string;
      };
  export type Tokens = Token[];
  export type Option = {
    breaks?: boolean;
  };
  export type Tags =
    | "a"
    | "abbr"
    | "address"
    | "area"
    | "article"
    | "aside"
    | "audio"
    | "b"
    | "bdi"
    | "bdo"
    | "blockquote"
    | "body"
    | "br"
    | "button"
    | "canvas"
    | "caption"
    | "cite"
    | "code"
    | "col"
    | "colgroup"
    | "data"
    | "datalist"
    | "dd"
    | "del"
    | "details"
    | "dfn"
    | "dialog"
    | "div"
    | "dl"
    | "dt"
    | "em"
    | "embed"
    | "fieldset"
    | "figcaption"
    | "figure"
    | "footer"
    | "form"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "header"
    | "hgroup"
    | "hr"
    | "i"
    | "iframe"
    | "img"
    | "input"
    | "ins"
    | "kbd"
    | "label"
    | "legend"
    | "li"
    | "main"
    | "map"
    | "mark"
    | "menu"
    | "meter"
    | "nav"
    | "noscript"
    | "object"
    | "ol"
    | "optgroup"
    | "option"
    | "output"
    | "p"
    | "picture"
    | "pre"
    | "progress"
    | "q"
    | "rp"
    | "rt"
    | "ruby"
    | "s"
    | "samp"
    | "search"
    | "section"
    | "select"
    | "slot"
    | "small"
    | "source"
    | "span"
    | "strong"
    | "sub"
    | "summary"
    | "sup"
    | "table"
    | "tbody"
    | "td"
    | "template"
    | "textarea"
    | "tfoot"
    | "th"
    | "thead"
    | "time"
    | "tr"
    | "track"
    | "u"
    | "ul"
    | "var"
    | "video"
    | "wbr";

  //

  /**
   * Textile to HTML
   */
  export function toHtml(text: string, option?: Option): string;
  /**
   * Textile to JsonML
   */
  export function toJsonML(text: string, option?: Option): JsonMLTree;
  /**
   * JsonMl to HTML
   */
  export function mlToHtml(ml: JsonMLTree): string;
}

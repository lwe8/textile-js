import Textile from "./lib";

const ele: Textile.ElementNode[] = [
  [
    "p",
    "Some more text of dubious character. Here is some string of ",
    [
      "span",
      {
        class: "caps",
      },
      "CAPITAL",
    ],
    " letters. Here is something we want to ",
    ["em", "emphasize"],
    ". ",
    ["br"],
    "\nThat was a linebreak. And something to indicate ",
    ["strong", "strength"],
    ". Of course I could use ",
    [
      "em",
      "my own ",
      [
        "span",
        {
          class: "caps",
        },
        "HTML",
      ],
      " tags",
    ],
    " if I ",
    ["strong", "felt"],
    " like it.",
  ],
];

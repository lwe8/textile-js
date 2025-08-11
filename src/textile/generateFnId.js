// cSpell:disable
const rivers = {
  0: "Mu",
  1: "Lemro",
  2: "Phyu",
  3: "Naf",
  4: "Mayu",
  5: "Kyaw",
  6: "Shweli",
  7: "Zawgyi",
  8: "Yin",
  9: "Yaw",
};

const genFnId = (input) => {
  const stra = String(input).split("");
  let str = "";
  let idx = 0;
  let supstr = stra.length < 2 ? "river" : "";
  for (; idx < stra.length; idx++) {
    const qnum = parseInt(stra[idx]);
    str += rivers[qnum];
  }
  str = str + supstr;

  return Buffer.from(str.toLowerCase()).toString("hex");
};

export default genFnId;

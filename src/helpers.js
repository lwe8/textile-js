const helpers = {
  isAttrNode(input) {
    return (
      typeof input === "object" &&
      Array.isArray(input) === false &&
      input !== null
    );
  },
};

export default helpers;

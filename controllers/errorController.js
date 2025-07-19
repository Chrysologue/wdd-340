const throwError = async (req, res, next) => {
  // Intentionally throw an error
  throw new Error("Intentional Server Error: Something went wrong on purpose.");
};

module.exports = { throwError };

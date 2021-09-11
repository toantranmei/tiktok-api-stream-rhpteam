module.exports = {
  isExists: (arr, key, value) => {
    return arr.some(function (el) {
      return el[key] === value;
    });
  },
};

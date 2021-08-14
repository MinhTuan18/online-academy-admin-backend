/**
 * Create an object composed of the chosen object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
 const extract = (object, keys) => {
    return keys.reduce((obj, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = object[key];
      }
      return obj;
    }, {});
  };
  
  module.exports = extract;
  
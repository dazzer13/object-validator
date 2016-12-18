var validator = require('validator');

function get(o, s) {
  var a = s.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
  while (a.length) {
    var n = a.shift();
    if (n in o) {
      o = o[n];
    } else {
      return;
    }
  }
  return o;
}

function hasValidValidatorMethod(method, pathKey) {
  if (validator[method] == null) {
    throw new Error(method + ' is not a valid method for validator at: ' + pathKey);
  }
}

module.exports = function (object, schema) {
  var errors;
  if (!object instanceof Object) throw new Error('Object needs to be a JavaScript Object');
  if (!schema instanceof Object) throw new Error('Schema needs to be a JavaScript Object');

  function forEachKey(schemaObject, path, rootKey) {

    Object.keys(schemaObject).forEach(function (key) {
      var pathKey = path ? (path + '.' + key) : key;
      var validatorKey = schemaObject[key];

      if (typeof validatorKey === 'object' && !Array.isArray(validatorKey)) {
        forEachKey(schemaObject[key], pathKey, key);
      } else {

        var valid;

        if (Array.isArray(validatorKey)) {

          hasValidValidatorMethod(validatorKey[0], pathKey);
          valid = validator[validatorKey[0]].apply(validator, [get(object, pathKey)].concat(validatorKey.slice(1)));

        } else if (typeof validatorKey !== 'string') {

          valid = validatorKey === get(object, pathKey);

        } else {

          var firstChar = validatorKey.substr(0, 1);

          if (firstChar === '!' || firstChar === '~') {
            validatorKey = validatorKey.substr(1, validatorKey.length);
          }

          if (firstChar === '~' && (get(object, pathKey) == null || get(object, pathKey) == undefined)) {
            return;
          }

          switch (validatorKey) {
            case('isString'):
              valid = typeof get(object, pathKey) === 'string';
              break;
            case('isBoolean'):
              valid = typeof get(object, pathKey) === 'boolean';
              break;
            case('isNumber'):
              valid = typeof get(object, pathKey) === 'number';
              break;
            case('isObject'):
              valid = typeof get(object, pathKey) === 'object';
              break;
            case('isArray'):
              valid = Array.isArray(get(object, pathKey));
              break;
            case('isFunction'):
              valid = typeof get(object, pathKey) === 'function';
              break;
            default:
              hasValidValidatorMethod(validatorKey, pathKey);

              valid = validator[validatorKey](String(get(object, pathKey)));

              if (firstChar === '!') {
                valid = !valid;
              }
          }
        }

        if (!valid) {
          errors = errors || [];
          errors.push({
            path: pathKey,
            validator: schemaObject[key],
            value: get(object, pathKey),
            message: pathKey + ' failed ' + JSON.stringify(schemaObject[key]) + ' validator test.'
          });
        }
      }
    });
  }

  forEachKey(schema);

  return errors;
};
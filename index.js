var assert          = require('assert'),
	validator       = require('validator');

module.exports = function(object /* Object */, schema /* Schema */) {

	if(!object instanceof Object) throw new Error('Object needs to be a JavaScript Object');
	if(!schema instanceof Object) throw new Error('Schema needs to be a JavaScript Object');

	var errors = [];

	object.byString = function(s) {
		s = s.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
		var a = s.split('.'),
			o = this;
		while (a.length) {
			var n = a.shift();
			if (n in o) {
				o = o[n];
			} else {
				return;
			}
		}
		return o;
	};

	function forEachKey(schemaObject, path, rootKey) {

		Object.keys(schemaObject).forEach(function(key) {

			var pathKey = path ? (path + '.' + key) : key;

			if (schemaObject[ key ] instanceof Object) {
				forEachKey(schemaObject[ key ], pathKey, key);
			} else {
				var valid, inverted;
				//todo Add inverted test "!isEmail", if not email return false;
				if(typeof schemaObject[ key ] != 'string'){
					valid = schemaObject[ key ] === object.byString(pathKey);
				} else {
					switch(schemaObject[ key ]){
						case('isString'):
							valid = typeof schemaObject[key] == 'string';
							break;
						case('isBoolean'):
							valid = typeof schemaObject[key] == 'boolean';
							break;
						default:
							if (validator[ schemaObject[key] ] == null) throw new Error( schemaObject[pathKey] + ' is not a valid method for validator at: ' + pathKey );
							valid = validator[ schemaObject[key] ]( object.byString(pathKey) );
					}
				}
				if (!valid) errors.push({ validator: schemaObject[key], path: pathKey, value: object.byString(pathKey) });
			}

		}, this);

	}

	forEachKey(schema);

	if (errors.length > 0) {
		errors.forEach(function(error) {
			assert.fail(error.value, error.validator, error.path + ' failed ' + error.validator );
		});
		return errors;
	} else {
		return true;
	}

};
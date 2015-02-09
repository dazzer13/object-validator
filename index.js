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
				var valid;
				if(typeof schemaObject[ key ] != 'string'){
					valid = schemaObject[ key ] === object.byString(pathKey);
				} else {
					var validatorKey = schemaObject[ key ],
						firstChar = validatorKey.substr(0,1);

					if(firstChar === '!' || firstChar === '~') validatorKey = validatorKey.substr(1,validatorKey.length);

					switch(validatorKey){
						case('isString'):
							valid = typeof object.byString(pathKey) == 'string';
							break;
						case('isBoolean'):
							valid = typeof object.byString(pathKey) == 'boolean';
							break;
						default:

							if( validator[ validatorKey ] == null ) throw new Error(validatorKey + ' is not a valid method for validator at: ' + pathKey);

							if(firstChar === '~' && object.byString(pathKey) == null ) return;

							valid = validator[ validatorKey ](object.byString(pathKey));

							if (firstChar === '!') valid = !valid;

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
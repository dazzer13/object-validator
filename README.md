# object-validator

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

Small wrapper to validate JSON objects with the [Validator](https://github.com/chriso/validator.js) library. With some small added validations.

## Installation

```bash
$ npm install object-validator-js --save
```
## Using

**validator( OBJECT, SCHEMA )**
_returns Array of errors (empty or no array if no errors)_

```javascript
    var request = require('request');
    var validator = require('object-validator');

    request({ url: '/user' }, function (err, res, body) {
        validator(data, {
            _id: 'isMongoId', // Validator test
            active: true, // NonString schema test (doesn't use validator)
            enabled: 'isBoolean',
            contact: {
                first_name: 'isString', // Checks value is typeof string
                last_name: 'isString', // Checks value is typeof string
                nick_name: 'isString', // Checks value is typeof string
                email: 'isEmail', // Validator test
                phone: 'isString' // Checks value is typeof string
            },
            auth: {
                login_attempts: 'isInt', // Validator test
                username: 'isString', // Validator test
                password: 'isNull', // Validator test
                token: 'isString' // Checks value is typeof string
            },
            preferences: { state: { last_emailed: 'isDate' } }, // Validator test
            timestamps: {
                created: 'isDate', // Validator test
                killed: '~isDate' // Validator test but can be null
             }
        });
    });
```

## Additional Validations

* `isString` in schema - Returns true is value is `typeof` `string`
* `isBoolean` in Schema - Returns true is value is `typeof` `boolean`
* `isNumber` in Schema - Returns true is value is `typeof` `number`
* `isArray` in Schema - Returns true is value `Array.isArray`
* `isFunction` in Schema - Returns true is value is `typeof` `function`
* `NonString` in schema - Checks value with === comparison;
* `!` before `validator method` will give the negative result
* `~` before `validator method` validates method if data present (optional)

## Errors are all bundled into single array
```
   validator({ path: { to: { value:  '23' } } }, {  "path.to.value": ['isInt', {min: 2, max: 10}] })

   // Error response is array (if no errors it returns true)
   [
     {
       path: 'path.to.value',
       validator: [ 'isInt', [Object] ],
       value: '23',
       message: 'path.to.value failed ["isInt",{"min":2,"max":10}] validator test.'
      }
    ]
```

[npm-image]: https://img.shields.io/npm/v/object-validator-js.svg?style=flat
[npm-url]: https://npmjs.org/package/object-validator-js
[downloads-image]: https://img.shields.io/npm/dm/object-validator-js.svg?style=flat
[downloads-url]: https://npmjs.org/package/object-validator-js
[travis-image]: https://img.shields.io/travis/strongloop/object-validator-js.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/object-validator-js
[coveralls-image]: https://img.shields.io/coveralls/strongloop/object-validator-js.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/object-validator-js?branch=master

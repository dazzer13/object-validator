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

```javascript
    var request       = require('request'),
    	validator       = require('object-validator');

    request({
            method: 'POST',
            uri: '/user',
            body: profile
        },
        function (err, res, body) {
            validator(body,{
                _id: 'isMongoId', // Validator test
                active: true, // NonString schema test (doesn't use validtor)
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
                timestamps: { created: 'isDate' } // Validator test
            });
        });
```

## Addtional Validations

* `isString` in scheam - Returns true is value is `typeof` `string`
* `isBoolean` in Schema - Returns true is value is `typeof` `boolean`
* `NonString` in schema - Checks value with === comparision;

[npm-image]: https://img.shields.io/npm/v/object-validator-js.svg?style=flat
[npm-url]: https://npmjs.org/package/object-validator-js
[downloads-image]: https://img.shields.io/npm/dm/object-validator.svg?style=flat
[downloads-url]: https://npmjs.org/package/object-validator
[travis-image]: https://img.shields.io/travis/strongloop/object-validator.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/object-validator
[coveralls-image]: https://img.shields.io/coveralls/strongloop/object-validator.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/object-validator?branch=master

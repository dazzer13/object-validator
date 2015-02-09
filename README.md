# object-validator

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

Small wrapper to validate JSON objects with [Validator.js](https://github.com/chriso/validator.js) library.

### validator( OBJECT, SCHEMA )

```javascript
    var request         = require('request'),
    	validator       = require('object-validator');

    request({
            method: 'POST',
            uri: '/user',
            body: profile
        },
        function (err, res, body) {
            validator(body,{
                _id: 'isMongoId',
                active: true,
                contact: {
                    first_name: 'isString',
                    last_name: 'isString',
                    nick_name: 'isString',
                    email: 'isEmail',
                    phone: 'isString'
                },
                auth: {
                    login_attempts: 'isInt',
                    username: 'isString',
                    password: 'isNull',
                    token: 'isString'
                },
                preferences: { state: { last_emailed: 'isDate' } },
                timestamps: { created: 'isDate' }
            });
        });
```

[npm-image]: https://img.shields.io/npm/v/object-validator.svg?style=flat
[npm-url]: https://npmjs.org/package/object-validator
[downloads-image]: https://img.shields.io/npm/dm/object-validator.svg?style=flat
[downloads-url]: https://npmjs.org/package/object-validator
[travis-image]: https://img.shields.io/travis/strongloop/object-validator.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/object-validator
[coveralls-image]: https://img.shields.io/coveralls/strongloop/object-validator.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/object-validator?branch=master

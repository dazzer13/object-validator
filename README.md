# object-validator

Small wrapper to validate JSON objects with [Validator.js](https://github.com/chriso/validator.js) library.

## validator( OBJECT, SCHEMA );


```
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

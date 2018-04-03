'use strict';

const mysql       = require('anytv-node-mysql');
const winston     = require('winston');
const jwt         = require('jsonwebtoken');
const util        = require(__dirname + '/../helpers/util');
const config      = require(__dirname + '/../config/config');
const crypto      = require(__dirname + '/../lib/cryptography');

/**
 * @api {post} /auth/login User login
 * @apiGroup Authentication
 * @apiVersion 0.0.1
 *
 * @apiParam {String} username     User's username
 * @apiParam {String} password  User's password
 *
 * @apiSuccessExample Sample-Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 *    "data": {
 *          "id": "6e9402a1-f752-4141-a90f-aec19f1d63e5",
 *          "username": "maangelo",
 *          "token": "token"
 *    }
 * }
 *
 * @apiErrorExample Sample-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "success": false,
 *    "errors": [
 *      {
 *          "code": "LOG_FAIL",
 *          "message": "Log-In failed",
 *          "context": "Incorrect Password"
 *      }
 *    ]
 * }
 *
 */
exports.login = (req, res, next) => {
    const data = util._get
        .form_data({
            username: '',
            password: ''
        })
        .from(req.body);

    function start () {

        if (data instanceof Error) {
            return res.error('INC_DATA', data.message);
        }

        data.username.toLowerCase();

        mysql.use('master')
            .query(
                ['SELECT id, IF(PASSWORD(CONCAT(MD5(?), ?))',
                '= password, TRUE, FALSE) AS isPasswordValid,',
                'username, first_name,last_name FROM users',
                'WHERE username LIKE ?'].join(' '),
                [data.password, config.SALT, data.username],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        let user,
            token,
            encrypted = {};

        if (err) {
            winston.error('Error in logging in', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.error('LOG_FAIL', 'Invalid username');
        }

        if (!result[0].isPasswordValid) {
            return res.error('LOG_FAIL', 'Incorrect Password');
        }

        user = {
            id:     result[0].id,
            username:  result[0].username
        };

        encrypted.user = crypto.encryptSync(user);

        token = jwt.sign(encrypted, config.SECRET, {
                        algorithm: config.TOKEN_ALGO,
                        expiresIn: config.TOKEN_EXPIRATION
                    });

        user.token = token;

        req.redis.sadd(user.id.toString(), token);

        res.set('x-access-token', token)
           .item(user)
           .send();

    }

    start();
};

/**
 * @api {post} /auth/logout User logout
 * @apiGroup Authentication
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} x-access-token Token from login
 *
 * @apiSuccessExample Sample-Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 *    "data": {
 *          "message": "User successfully logged out"
 *    }
 * }
 *
 * @apiErrorExample Sample-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "success": false,
 *    "errors": [
 *      {
 *          "code": "UNAUTH",
 *          "message": "Unauthorized access",
 *          "context": "Failed to authenticate token."
 *      }
 *    ]
 * }
 *
 */
exports.logout = (req, res) => {
    const body  = req.body,
          token = body.token,
          id    = body.user.id.toString();

    function start () {
        if (token) {
            req.redis.srem(id, token);
            res.item({message: 'User successfully logged out'})
               .send();
        } else {
            res.error('NO_TOKEN', 'Please provide valid token in body form')
               .status(403)
               .send();
        }
    }

    start();
};

exports.verify_token = (req, res, next) => {
    const token = req.headers['x-access-token'],
          redis = req.redis;

    let decrypted,
        userId;

    function start () {

        if (token) {
            jwt.verify(token, config.SECRET, 
                  {algorithms : [config.TOKEN_ALGO]}, 
                  jwt_verify);
        }
        else {
            res.error('NO_TOKEN', 'Please provide valid token in body form')
               .status(403)
               .send();
        }

    }

    function jwt_verify (err, user) {
        if (err) {
            return res.status(404)
                      .error('UNAUTH', 'Failed to authenticate token.')
                      .send();
        }

        decrypted = crypto.decryptSync(user.user);
        userId    = decrypted.tokenId;

        redis.sismember(userId, id, 
                       send_response);


    }

    function send_response (err, isMember) {
        if (err || !isMember) {
            return res.status(404)
                      .error('UNAUTH', 'Failed to authenticate token.')
                      .send();
        }

        req.body.user  = decrypted;
        req.body.token = token;
        next();
    }

    start();

};
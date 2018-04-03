'use strict';

const mysql     = require('anytv-node-mysql');
const winston   = require('winston');
const util      = require(__dirname + '/../helpers/util');
const config    = require(__dirname + '/../config/config');


/**
 * @api {post} /user Create user
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {String} username       User's username
 * @apiParam {String} password       User's password
 * @apiParam {String} first_name     User's first name
 * @apiParam {String} last_name      User's last name
 *
 * @apiSuccess {String} id            User's unique ID
 * @apiSuccess {String} firstName     User's first name
 * @apiSuccess {String} lastName      User's last name  
 * @apiSuccess {String} username      User's username
 *
 * @apiSuccessExample Sample-Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 *    "data": {
 *         "message": "Successfully created user",
 *         "id": "1"
 *         "first_name": "John Lloyd",
 *         "last_name" : "Cruz",
 *         "user": "user1"    
 *    }
 * }
 *
 * @apiErrorExample Sample-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "success": false,
 *    "errors": [
 *      {
 *          "code": "INC_DATA",
 *          "message": "Incomplete request data",
 *          "context": "firstName is missing"
 *      }
 *    ]
 * }
 *
 */
exports.create = (req, res, next) => {
    const data = util._get
        .form_data({
            username: '',
            password: '',
            first_name: '',
            last_name : ''
        })
        .from(req.body);

    function start() {

        if (data instanceof Error) {
            return res.error('INC_DATA', data.message);
        }

        mysql.use('master')
        .query (
            ['SELECT * FROM users',
             'WHERE username = ?',
             'AND deleted IS NULL'].join(' '),
             data.username,
             create_user
        )
        .end();
    }

    function create_user (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting user', err, last_query);
            return next(err);
        }

        if (result.length) {
            return res.error('INVALID_USER', 'Username is already in use');
        }

        mysql.use('master')
        .query (
            ['INSERT INTO users(username, password, first_name,last_name)',
             'VALUES (?, PASSWORD(CONCAT(MD5(?), ?)), ?,?)'].join(' '),
             [data.username, data.password, config.SALT, data.first_name,data.last_name],
             send_response
        )
        .end();

    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating user', last_query);
            return next(err);
        }

        if (!result.affectedRows) {
            return res.error('NO_RECORD_CREATED', 'No user was created');
        }

        res.data({
            message: 'Successfully created user',
            id:         result.insertId,
            first_name: data.first_name,
            last_name:  data.last_name,
            username:   data.username
        })
        .send();
    }

    start();
};

/**
 * @api {get} /user/:id Get user by Id
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} x-access-token Token from login
 *
 * @apiParam {String} id User's unique ID
 *
 * @apiSuccess {String} id            User's unique ID
 * @apiSuccess {String} first_name    User's first name
 * @apiSuccess {String} last_name     User's last name
 * @apiSuccess {String} username      User's username
 *
 * @apiSuccessExample Sample-Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 *    "data": {
 *          "first_name": "John Lloyd",
 *          "last_name" : " Cruz"
 *          "username": "user1",
 *          "password": "*SADSADMS123"
 *    }
 * }
 *
 * @apiErrorExample Sample-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    "success": false,
 *    "errors": [
 *      {
 *          "code": "ZERO_RES",
 *          "message": "Database returned no result",
 *          "context": "User not found"
 *      }
 *    ]
 * }
 */
exports.retrieve = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM users WHERE id = ? LIMIT 1;',
                [req.params.id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting users', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error('ZERO_RES', 'User not found')
                .send();
        }

        res.data(result[0])
            .send();
    }

    start();
};

/**
 * @api {put} /user/:id Update User
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id              User's unique ID
 * @apiParam {String} [fullName]      User's full name
 * @apiParam {String} username        User's username
 *
 * @apiSuccess {String} id            User's unique ID
 * @apiSuccess {String} fullname      User's full name
 * @apiSuccess {String} username      User's username
 *
 * @apiSuccessExample Sample-Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 *    "data": {
 *          "id": "57e0013070c8f70790749bc6",
 *          "first_name": "John Lloyd",
 *          "last_name" : " Cruz"
 *          "username": "user1"
 *    }
 * }
 *
 * @apiErrorExample Sample-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "success": false,
 *    "errors": [
 *      {
 *          "code": "NO_RECORD_UPDATED",
 *          "message": "No record was updated",
 *          "context": "No user was updated"
 *      }
 *    ]
 * }
 *
 */
 exports.update = (req, res, next) => {
    const data = util._get
        .form_data({
            username: '',
            first_name: '',
            last_name: ''
        })
        .from(req.body);

    function start() {

        if (data instanceof Error) {
            return res.error('INC_DATA', data.message);
        }

        data.date_updated = new Date();

        mysql.use('master')
        .query (
            ['SELECT * FROM users',
             'WHERE id != ? AND username = ?',
             'AND deleted IS NULL'].join(' '),
             [req.params.id, data.username],
             update_user
        )
        .end();
    }

    function update_user (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting user', err, last_query);
            return next(err);
        }

        if (result.length) {
            return res.error('INVALID_USERNAME', 'Username is already in use');
        }

        mysql.use('master')
        .query (
            ['UPDATE users SET ? WHERE id=?'].join(' '),
            [data, req.params.id],
            send_response
        )
        .end();

    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in update user', last_query);
            return next(err);
        }

        if (!result.affectedRows) {
            return res.error('NO_RECORD_UPDATED', 'No user was updated');
        }

        data.id = req.params.id;

        res.data(data)
           .send();
    }

    start();
};


/**
 * @api {delete} /user/:id Delete User
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 *
 * @apiParam {String} id User's unique ID
 *
 * @apiSuccessExample Sample-Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 *    "data": {
 *          "message": "Successfully deleted user"
 *    }
 * }
 *
 * @apiErrorExample Sample-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "success": false,
 *    "errors": [
 *      {
 *          "code": "NO_RECORD_DELETED",
 *          "message": "No record was deleted",
 *          "context": "No user was deleted"
 *      }
 *    ]
 * }
 *
 */
exports.delete = (req, res, next) => {

    function start () {

        mysql.use('master')
        .query (
            ['UPDATE users SET deleted=NOW()',
             'WHERE deleted IS NULL AND id=?'].join(' '),
            [req.params.id],
            send_response
        )
        .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in retrieving user', last_query);
            return next(err);
        }

        if (result.affectedRows === 0) {
            return res.error('NO_RECORD_DELETED', 'No User was deleted');
        }

        res.item({message: 'Successfully deleted user'})
           .send();
    }

    start();

};

/**
 * @api {post} /user/change_password User update password
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} x-access-token Token from login
 *
 * @apiParam {String} currentPassword    User's old password
 * @apiParam {String} newPassword        User's new password
 * @apiParam {String} [confirmPassword]  User's new password confirmation
 *
 * @apiSuccessExample Sample-Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 *    "data": {
 *          "message": "Password successfully updated"
 *    }
 * }
 *
 * @apiErrorExample Sample-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "success": false,
 *    "errors": [
 *      {
 *          "code": "NO_PASS",
 *          "message": "No password is found",
 *          "context": "Please check current password"
 *      }
 *    ]
 * }
 *
 */
exports.change_password = (req, res, next) => {
    const body  = req.body,
          redis = req.redis,
          id    = body.user.id,
          data  = util._get
                    .form_data({
                        currentPassword: '',
                        newPassword: '',
                        _confirmPassword: ''
                    })
                    .from(req.body);
          

    function start () {

        if (data instanceof Error) {
            return res.error('INC_DATA', data.message);
        }

        if (data.confirmPassword && data.newPassword !== data.confirmPassword) {
            return res.error('INV_PASS', 'Invalid password confirmation');
        }

        mysql.use('master')
        .query(
            ['UPDATE users SET password = PASSWORD(CONCAT(MD5(?), ?)),',
            'date_updated = NOW() WHERE password = PASSWORD(CONCAT(MD5(?), ?))',
            'AND id = ? LIMIT 1;'].join(' '),
            [data.newPassword, config.SALT, data.currentPassword, 
             config.SALT, id],
            send_response
        )
        .end();

    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in retrieving user', last_query);
            return next(err);
        }

        if (result.affectedRows === 0) {
            return res.error('NO_PASS', 'Please check current password');
        }

        // Delete all active tokens
        // and remain the current one
        redis.del(id.toString());
        redis.sadd(id.toString(), body.token);

        res.item({message: 'Password successfully updated'})
           .send();
    }

    start();
};
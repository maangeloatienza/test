'use strict';

const mysql = require('anytv-node-mysql');
const winston = require('winston');
const util = require(__dirname + '/../helpers/util');
const config = require(__dirname + '/../config/config');
const status = ["FOR_INBOUND", "RECEIVED", "MISSING"];
//check from assignment

exports.scan_item = (req, res, next) => {
    
    const data = util._get
        .form_data({
            tracking_num: ''
        })
        .from(req.body)

    function start() {
        mysql.use('master')
            .query([`SELECT * FROM temp_assignment WHERE tracking_num = ?`].join(' '),
                [data.tracking_num],
                scan_item
            )
            .end()
    }

    function scan_item(err, result, args, last_query) {
        if (err) {
            winston.error('Error getting in package', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.error('ZERO_RES', 'No records from database')
        }
        data.id = result.id;
        data.date_received = new Date();
        data.item = result.item;
        mysql.use('master')
            .query(`UPDATE temp_assignment SET status =?, date_received = ? WHERE tracking_num = ?`,
                [status[1],data.date_received, data.tracking_num],
                send_response
            )
            .end()
    }

    function send_response(err, result, args, last_query) {
        if (err) {
            winston.error('Error getting in package', last_query);
            return next(err);
        }

        if (!result.affectedRows) {
            return res.error('NO_RECORD_UPDATED', 'Cannot update status');
        }
        data.status = status[1];

        res.data({
            message: 'Successfully scanned',
            result: data
        })
            .send();
    }
    start();
};


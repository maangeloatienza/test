'use strict';

const mysql = require('anytv-node-mysql');
const winston = require('winston');
const util = require(__dirname + '/../helpers/util');
const config = require(__dirname + '/../config/config');
const status = ["FOR_INBOUND", "RECEIVED", "MISSING"];
const location = ["Pasig"];

exports.primary_sort = (req,res,next)=>{
    
    function start(){
        mysql.use('master')
            .query(`SELECT id,courier_id,item_name,tracking_num,location,DATE(date_received) AS date_rcv,
                   TIME(date_received) AS time_rcv, status FROM temp_assignment WHERE status = ? AND location = ?`),
            [status[1],location[0]],
            sort_area
    }
    function sort_area(err,result,args,last_query){
        if(err){
            winston.error('Error getting in assignments',last_query);
            return next(err);
        }

        if(!result.length){
            return res.erro('ZERO_RES','No records found');
        }
    }
}


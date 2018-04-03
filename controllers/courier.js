'use strict';

const mysql = require('anytv-node-mysql');
const winston = require('winston');
const util = require(__dirname + '/../helpers/util');
const config = require(__dirname + '/../config/config');

exports.retrieve = (req,res,next)=>{
    function start(){
        mysql.use('master')
            .query(`SELECT * FROM courier`,
            send_response
        )
        .end()
    }

    function send_response(err,result,args,last_query){
        if(err){
            winston.error('Error getting in courier',last_query);
            return next(err);
        }

        if(!result.length){
            return res.error('ZERO_RES','No records found');
        }
        var courier = [];
        for(var i in result){
            courier.push({ id: result[i].id, full_name: result[i].first_name + " " + result[i].last_name   });
        }
        res.data(courier)
            .send();
    }
        start();
}

exports.retrieve_id = (req, res, next) => {
    function start() {
        mysql.use('master')
            .query(`SELECT * FROM courier WHERE id = ?`,
                [req.params.id],
                send_response
            )
            .end()
    }

    function send_response(err, result, args, last_query) {
        if (err) {
            winston.error('Error getting in courier', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.error('ZERO_RES', 'No records found');
        }
        var courier = [];
        for (var i in result) {
            courier.push({ id: result[i].id, full_name: result[i].first_name + " " + result[i].last_name });
        }
        res.data(courier)
            .send();
    }
    start();
}
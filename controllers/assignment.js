'use strict';

const mysql = require('anytv-node-mysql');
const winston = require('winston');
const util = require(__dirname + '/../helpers/util');
const config = require(__dirname + '/../config/config');
const status = ["FOR_INBOUND", "RECEIVED", "MISSING"];

exports.assign = (req,res,next)=>{

    
    const data = util._get
        .form_data({
            courier_id : '',
            item_id : '',
            location: ''
        })
        .from(req.body)

    function makeTrack() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    function start(){
        if(data instanceof Error){
            return res.error('INC_DATA',data.message);
        }

        mysql.use('master')
            .query(`SELECT first_name,last_name FROM courier WHERE id = ?`,
            [data.courier_id],
            get_item
        )
        .end();
    }

    function get_item(err,result,args,last_query){
        if(err){
            winston.error('Error getting in courier', last_query);
            return next(err);
        }

        if(!result.length){
            return res.error('ZERO_RES','Courier not found');
        }
        data.courier = result[0].first_name + " " + result[0].last_name;   
        mysql.use('master')
            .query(`SELECT * FROM item WHERE id = ?`,
                [data.item_id],
                give_assignment
        )
        .end();
    }

    function give_assignment(err,result,args,last_query){
        if(err){
            winston.error('Error getting in item',last_query);
            return next(err);
        }

        if(!result.length){
            return res.error('ZERO_RES','Item not available');
        }
        
        data.date_received = new Date();
        data.tracking_num = makeTrack();
        data.item = result[0].item;
             

        mysql.use('master')
            .query(`INSERT INTO temp_assignment(courier_id ,courier_name ,item_name ,
                    location,tracking_num,date_received,status) VALUES(?,?,?,?,?,?,?)`,
            [data.courier_id,data.courier,data.item,data.location,data.tracking_num,data.date_received,status[0]],
            send_response
            )

    }

    function send_response(err,result,args,last_query){
        if(err){
            winston.error('Error getting in assignments');
            return next(err);
        }

        if(!result.affectedRows){
            return res.error('No records found',)
        }
        data.status = status[0];
        
        res.data({
            message : 'Succesful',
            result : {
                courier_id : data.id,
                courier: data.courier,
                item_id : data.item_id,
                item    : data.item,
                location: data.location,
                tracking_num : data.tracking_num,
                status  : data.status
            }
        })
        .send();
    }
    start();
};

exports.get_assignment = (req,res,next)=>{
    function start(){
        mysql.use('master')
            .query(`SELECT id,courier_id,item_name,tracking_num,location,DATE(date_received) AS date_rcv,
                   TIME(date_received) AS time_rcv, status FROM temp_assignment WHERE status = ?`,
            [status[1]],
            send_response
        )
        .end();
    }

    function send_response(err,result,args,last_query){
        if(err){
            winston.error('Error getting in assignments',last_query);
            return next(err);
        }

        if(!result.length){
            return res.error('ZERO_RES','NO RECORDS FOUND');
        }

        res.items(result)
        .send();
    }
    start();
}


exports.assignment_cour = (req, res, next) => {
    function start() {
        mysql.use('master')
            .query(`SELECT id,courier_id,courier_name,item_name,tracking_num,location,DATE(date_received) AS date_rcv,
                    TIME(date_received) AS time_rcv, status FROM temp_assignment
                    WHERE status = ? AND courier_id = ?`,
                [status[1],req.params.courier_id],
                send_response
            )
            .end();
    }

    function send_response(err, result, args, last_query) {
        if (err) {
            winston.error('Error getting in assignments', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.error('ZERO_RES', 'NO RECORDS FOUND');
        }

        res.data(result)
            .send();
    }
    start();
}


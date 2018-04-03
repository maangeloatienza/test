'use strict';

const mysql = require('anytv-node-mysql');
const winston = require('winston');
const util = require(__dirname + '/../helpers/util');
const config = require(__dirname + '/../config/config');
const status = ["FOR_INBOUND", "RECEIVED", "MISSING"];

exports.create_item = (req,res,next)=>{
    const data = util._get
        .form_data({
            item : '',
            category: ''
        })
        .from(req.body)

    function start(){
        if( data instanceof Error){
            return res.error('INC_DATA',data.message);
        }
        data.tracking_num = makeTrack();
        mysql.use('master')
            .query(`SELECT * FROM item WHERE item = ?`,
            [data.item],
            create_package
        )
        .end();
    }

    function create_package(err,result,args,last_query){
        if(err){
            winston.error('Error in getting package', last_query);
            return next(err);
        }

        if(result.length){
            return res.error('INVALID_ITEM','Item already exists');
        }
            data.date_received = new Date();

        mysql.use('master')
            .query(`INSERT INTO item(item,category,date_received) VALUES (?,?,?)`,
            [data.item,data.category,date_received],
            send_response
        )
        .end();
    }

    function send_response(err,result,args,last_query){
        if(err){
            winston.error('Error in creating package',last_query);
            return next(err);
        }

        if(!result.affectedRows){
            return res.erro('NO_RECORD_CREATED','No package created');
        }

        res.data({
            message : 'Success',
            result : {
                id : result.insertId,
                item : data.item,
                category : data.category
            }
        })

        .send()
    }
    start();
};


exports.retrieve_by_id = (req,res,next)=>{

    function start(){
        mysql.use('master')
            .query(`SELECT * FROM item WHERE id = ?`,[req.params.id],send_response)
            .end();
    }

    function send_response(err,result,args,last_query){
        if(err){
            winston.error('Error getting in item',last_query);
            return next(err);
        }
        if(!result.length){
            return res.error('ZERO_RES','Item does not exists');
        }

        res.data({
            id : result[0].id,
            item : result[0].item,
        })
        .send()
    }
    start();
};

exports.retrieve = (req, res, next) => {

    function start() {
        mysql.use('master')
            .query(`SELECT * FROM item `, send_response)
            .end();
    }

    function send_response(err, result, args, last_query) {
        if (err) {
            winston.error('Error getting in item', last_query);
            return next(err);
        }
        if (!result.length) {
            return res.error('ZERO_RES', 'Item does not exists');
        }

        res.data(result)
            .send()
    }
    start();
};



exports.received = (req,res,next)=>{
    function start() {
        mysql.use('master')
            .query(`SELECT id,item_name,tracking_num,DATE(date_received) AS date_rcv,
            TIME(date_received) AS time_rcv FROM temp_assignment WHERE status = ? `,[status[1]], send_response)
            .end();
    }

    function send_response(err, result, args, last_query) {
        if (err) {
            winston.error('Error getting in item', last_query);
            return next(err);
        }
        if (!result.length) {
            return res.error('ZERO_RES', 'No item received');
        }
        var item = [];
        for (var i in result) {
            item.push({ id: result[i].id, item: result[i].item_name, tracking_num: result[i].tracking_num });
        }
        res.items(result)
            .send()
    }
    start();
}
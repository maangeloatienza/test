'use strict';

const mysql = require('anytv-node-mysql');
const winston = require('winston');
const util = require(__dirname + '/../helpers/util');
const config = require(__dirname + '/../config/config');
const status = ["FOR_INBOUND", "RECEIVED", "MISSING","FOR_LOADING"];
const location = ["Pasig"];
const area = ['Bagong ilog','Bagong katipunan','Bambang','Manggahan','Maybunga'];

exports.primary_sort = (req,res,next)=>{
    
    function start(){
    
    }

    function send_response(err,resullt,args,last_query){
        if(err){
            winston.error('Error getting in basket',last_query);
            return next(err);
        }

        if(!result.affectedRows){
            return res.error('NO_RECORD_CREATED');
        }

        res.data(result);
    }
}


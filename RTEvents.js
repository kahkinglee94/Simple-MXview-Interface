var log4js = require('log4js');
var logger = log4js.getLogger('SocketIoClient');
const cookie = require('cookie');
var sioClient = require('socket.io-client');
const request = require('request');
logger.level = 'debug';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token;
var event = function getEvent(sockets){
    request.post(
    'https://192.168.127.20/login',
    {
        timeout:2000,
        json: {username:'admin', password:'moxa'}
    }, (err, response, body)=>{
        if(err !== null){
            logger.error(err);
        }else{
            logger.debug(body.mxviewGateway);
            token = body.mxviewGateway;
            //console.log(token);
            var socket = sioClient.connect(`http://192.168.127.20/?token=Bearer ${token}`);
            socket.on('connect', function(){
                logger.info('connected');
            });
            socket.on('TRIGGER', function(data){
                if(typeof data.trigger_detail !== 'undefined') {
                    // delete data.trigger_detail.availability_update;
                    // delete data.trigger_detail.devices;
                    // delete data.trigger_detail.events;
                }
                if(data.trigger_detail.events != null){
                    dataJSON = JSON.stringify(data.trigger_detail.events[0].severity);
                    logger.info(dataJSON);
                    sockets.emit("trigger_detail", data.trigger_detail.events[0]);
                }     
            });
            socket.on('disconnect', function(){
                logger.info('disconnected');
            });
            socket.on('error', (err)=>{
                logger.error(err);
            });
        }
    });
}

module.exports = event;
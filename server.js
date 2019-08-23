var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var event = require('../Models/RTEvents');
var process = require('../Models/GetInfo');

server.listen(3000, 'localhost', null, function(){
    console.log('Node server is running');
});

app.get('/', function(req, res){
    res.sendfile("D:/Side_Projects/APIWebsite/Views/index.html");
});

app.get('/style.css', function(req, res){
    res.sendFile("D:/Side_Projects/APIWebsite/Views/style.css");
});


io.sockets.on("connection", function(socket){
   console.log("Received a request from " + socket.client.conn.remoteAddress);
   event(socket); 
   process(socket);
});


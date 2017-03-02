//set up server
var express = require('express'); // it goes and finds express and imports it
var app = express(); // sets up an (express) app
var server = require('http').createServer(app); // creates http server which is using (express) app
// require socket.io and make it available to the server
var io = require('socket.io')(server); //io - input output // require socket.io and make it available to the server

var numOfCliets = 0;

//define directiories which are exposed to web
app.use(express.static(__dirname + '/node_modules'));

//ROUTING
//http command
//request for / is the 1st request
app.get('/', function(req, res){
    console.log("GET request for '/' ");
    //.send send text
    //__dirname get directiory where we are in
    res.sendFile(__dirname + '/public/index.html');
}); 

app.get('/users', function(req, res){
    console.log("GET request for '/users' ");
    //.send send text
    //__dirname get directiory where we are in
    res.sendFile(__dirname + '/public/users.html');
});

//SERVER SIDE SOCKET.IO
//if sb connects to my socket run this function
io.on('connection', function(client){
    console.log("client connected");
    numOfCliets++;
    io.emit('hello', numOfCliets); //send msges out
});

server.listen(3000); // listen on port 3000

//set up server
var express = require('express'); // it goes and finds express and imports it
var app = express(); // sets up an (express) app
var server = require('http').createServer(app); // creates http server which is using (express) app
// require socket.io and make it available to the server
var io = require('socket.io')(server); //io - input output // require socket.io and make it available to the server

var clickCount = 0;
var clients = [];
var numOfCliets = 0;
var line_history = [];

//define directiories which are exposed to web
app.use(express.static(__dirname + '/node_modules'));
//feature of Express is its ability to server static files like images, CSS files and JavaScript files
app.use(express.static(__dirname + '/public')); 

//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
}); 

//ROUTING
//http command
//request for / is the 1st request
//redirect / to our index.html file
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
//if client connects to my socket run this function
io.on('connection', function(client){
    numOfCliets++;
   // console.log(clients);
    
    io.clients(function(error, clients){
        if (error) throw error;
        io.emit('hello', numOfCliets); //send msges out

        io.emit('clientsList', clients)
    })   

    /* When the server receives one of these messages 
    it increments the clickCount variable and emits a 'buttonUpdate' message to all clients.*/
    client.on('clicked', function(data){
        clickCount++;
        io.emit('buttonUpdate', clickCount);
    });

    client.on('nicknameEmit', function(data){
        client.nickname = data;
        console.log(client.nickname);

    });

    client.on('messageEmit', function(data, client){
        var nickname = this.nickname;
        console.log(nickname);
        io.emit('sendingMsg', data, nickname);
    });

    client.on('draw', function(x, y, isDown){
        io.emit('drawingEmit', x, y, isDown);
    });



    client.on('clearArea', function(data){
        io.emit('clearArea');
        console.log("clear area");
    });

    //TODO
    client.on('disconnect', function(){
        numOfCliets--;
    });


    // first send the history to the new client
   for (var i in line_history) {
      io.emit('draw_line', { line: line_history[i] } );
   }

   // add handler for message type "draw_line".
   client.on('draw_line', function (data) {
    console.log(data);
      // add received line to history 
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });
});


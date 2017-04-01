//set up server
var express = require('express'); // it goes and finds express and imports it
var app = express(); // sets up an (express) app
var server = require('http').createServer(app); // creates http server which is using (express) app
// require socket.io and make it available to the server
var io = require('socket.io')(server); //io - input output // require socket.io and make it available to the server

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

var clickCount = 0;
var allPlayers = [];
var numOfCliets = 0;
var line_history = [];
var active_drawing;
var point = 0;
var clientId;
var drawingQueue = false;
var sbIsDrawingAndLeft = false;

//SERVER SIDE SOCKET.IO
//if client connects to my socket run this function
io.on('connection', function(client){

    player = {
        nickname: "nickname",
        points: 0,
        id: client.id
    }

    io.clients(function(error, clients){
        if (error) throw error;
    });   
    //prompt function to save nickname
    client.on('newPlayer', function(nickname, points){
        //saving nicname on server side for player object
        player.nickname = nickname;
        //array with all the current clients
        allPlayers.push(player);
        //update list of players
        io.emit('playersList', allPlayers, player);
    });
    //sending new msg in the chat
    client.on('messageEmit', function(msg, nickname){
        //emit message to all clients
        io.emit('emittingMessage', msg, nickname);
        //if msg equals the drawing, add points to player who guessed and update content on client side
        if (msg === active_drawing){
          player.points = player.points + 1;
          //update Players List And Top Panel with info who is drawing
          io.emit('updatePlayersListAndTopPanel', nickname, player.points, sbIsDrawingAndLeft);
        }
    });
    //next round, drawing queue is free 
    client.on('nextRound', function () {
        drawingQueue = false;
    });
    //sb wants to draw and clieckd i want to draw
    client.on('IwantToDrawClicked', function(nickname) {
        sbIsDrawingAndLeft = false;
        //find player who wants to draw
        //this function returns a player from an array with a given nickname
        function findPlayer(allPlayers){
            return allPlayers.nickname === nickname;
        }
        var drawing_player = allPlayers.find(findPlayer);
       
        if (drawingQueue === false){
            //emmiting who is currently drawing
            io.emit('whoIsDrawing', drawing_player.nickname);
            var msg = "you are drawing";
            //sending a msg to player who is drawing 
            io.to(drawing_player.id).emit('youDraw', msg);
        }
        drawingQueue = true;
    });
    //emitting the drawing coordinates from client
    client.on('draw', function(x, y, isDown, startX, startY){
        io.emit('drawingEmit', x, y, isDown, startX, startY);
    });
    ////emmiting what needs to be guessed as a drawing
    client.on('activeDrawing', function(data){
      active_drawing = data;
    });
    //clearing canvases
    client.on('clearArea', function(data){
        io.emit('clearArea');
    });
    //disconnected client
    client.on('disconnect', function(){
        sbIsDrawingAndLeft = true;
        //checking which player disconnected and deleting him from an array
        for (var i = 0; i < allPlayers.length; i++ ){
            if(allPlayers[i].id === client.id){
                //update top pannel
                io.emit('updatePlayersListAndTopPanel', allPlayers[i].nickname, allPlayers[i].points, sbIsDrawingAndLeft);
                //delete from array
                allPlayers.splice(i, 1);
            }
        }
        //update list of clients
        io.emit('playersList', allPlayers);
    });

});


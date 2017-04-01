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

    client.on('activeDrawing', function(data){
      active_drawing = data;
      /*console.log(active_drawing);
*/    });

    client.on('newPlayer', function(nickname, points){
        player.nickname = nickname;
        allPlayers.push(player);
        //console.log(allPlayers);
        io.emit('playersList', allPlayers, player);
    });

    client.on('messageEmit', function(msg, nickname){
        var nickname = nickname;
        if (msg == active_drawing){
          player.points = player.points + 1;
          io.emit('updatePlayersListEmit', nickname, player.points);
        }
        io.emit('sendingMsg', msg, nickname);
    });

    client.on('draw', function(x, y, isDown, startX, startY){
/*        console.log(x, y, isDown, startX, startY);*/
        io.emit('drawingEmit', x, y, isDown, startX, startY);
    });

    client.on('nextRound', function () {
        drawingQueue = false;
    });

    client.on('IwantToDrawClicked', function(player) {
        function findPlayer(allPlayers){
                return allPlayers.nickname === player;
        }
        var drawing_player = allPlayers.find(findPlayer);
        /*console.log("find player" + player.id + " " + player.nickname);*/
        var msg = "mesage to you";
        
        if (drawingQueue === false){
            io.emit('whoIsDrawing', drawing_player.nickname);
            io.to(drawing_player.id).emit('youDraw', msg);
        }
        drawingQueue = true;
    })


    client.on('clearArea', function(data){
        io.emit('clearArea');
        console.log("clear area");
    });

    //TODO
    client.on('disconnect', function(){
        numOfCliets--;
        var index = allPlayers.indexOf(player);
        allPlayers.splice(index, 1);
        /*console.log(allPlayers);*/
        io.emit('playersList', allPlayers);
    });

});


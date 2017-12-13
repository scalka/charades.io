/*
.emit Sends messages between server-client(s).
.on Handles incoming messages
*/
var socket = io.connect();

var canvas = document.getElementById("myCanvas");
var ctx;
var mousePressed = false;
var clearCanvasButton;
var startX, startY;
var lastX, lastY;
var ul;
var x,y;
var isDown;
var chatDiv;
var iwantToDrawButton;
var what_are_you_drawing;
var who_is_drawing;

var player = {
  nickname: "nickname",
  points: 0,
  id: "id"
}
//update list of players
socket.on('playersList', function(clients, client){
    document.getElementById('clients_ol').innerHTML = '';
    //create new list element for each client
    for(var i=0; i<clients.length; i++){
        var li = document.createElement("li");
        li.setAttribute("class", "clientsListLi");
        li.setAttribute("id", clients[i].nickname);
        li.innerHTML = clients[i].nickname + " " + clients[i].points /*+ " " + clients[i].id*/;
        clients_ol.appendChild(li);
    }
});
//emit message to all clients from server
socket.on('emittingMessage', function(data, nickname){
    newMessage(data, nickname);
    chatDiv.scrollTop = chatDiv.scrollHeight;
});
//update Players List And Top Panel with info who is drawing
socket.on('updatePlayersListAndTopPanel', function(nickname, points, sbIsDrawingAndLeft){
    //update display
    what_are_you_drawing.style.display = "none";
    who_is_drawing.style.display = "none";
    iwantToDrawButton.style.display = "block";
    //check if sb left the room and didnt finish drawing
    if(sbIsDrawingAndLeft == false){
        document.getElementById(nickname).innerHTML = nickname + " " + points;
        newMessage(nickname, "WON THIS ROUND: ");
    } else {
        newMessage( nickname,"PLAYER LEFT THE ROOM");
    }
    //next round, drawing queue is free 
    socket.emit('nextRound');
});
//emmiting who is currently drawing and updating display
socket.on('whoIsDrawing', function (nickname) {
    who_is_drawing.style.display = "block";
    document.getElementById('who_is_drawing_h2').innerHTML = "Now is drawing: " + nickname;
    iwantToDrawButton.style.display = "none";
});
//sending a msg to player who is drawing 
socket.on('youDraw', function(data){
    what_are_you_drawing.style.display = "block";
    who_is_drawing.style.display = "none";
});
//updating client's canvases with drawing
socket.on('drawingEmit', function(x, y, isDown, startX, startY){
    Draw(x, y, isDown, startX, startY);
});
//clearing canvases
socket.on('clearArea', function(data){
   clearArea();
});

//prompt function to save nickname
function saveNickname(){
    var nickname = prompt("Nickname: ");
    socket.emit('newPlayer', nickname, 0);
    //saving nickname on client side for player object
    player.nickname = nickname;
}
//sending new msg in the chat
function sendMessage(){
  var msg = document.getElementById('message').value;
  socket.emit('messageEmit', msg, player.nickname);
}
//adding new message to chat
function newMessage(data, nickname){
    //console.log(nickname);
    var li = document.createElement("li");
    li.setAttribute("class", "message_li");
    li.innerHTML = nickname + ": " + data;
    ul.appendChild(li);
}
//sb wants to draw and clieckd i want to draw
function IwantToDraw(){
    socket.emit('clearArea');
    socket.emit('IwantToDrawClicked', player.nickname);
}
//saving what a player is drawing and what need to be guessed
function sayWhatURDrawing(){
//getting input value/string
  active_drawing = document.getElementById('active_drawing').value;
  //emmiting what needs to be guessed as a drawing
  socket.emit('activeDrawing', active_drawing);
}
//clear canvas
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);   
}

//initialisation
function init(){
    //getting elements from html
    ctx = document.getElementById('myCanvas').getContext("2d");
    ul = document.getElementById("messages_ul");
    clients_ul = document.getElementById("clients_ul");
    chatDiv = document.getElementById('chat');
    iwantToDrawButton = document.getElementById('IwantToDraw');
    what_are_you_drawing = document.getElementById('what_are_you_drawing');
    who_is_drawing = document.getElementById('who_is_drawing');
    clearCanvasButton = document.getElementById("clearCanvas");
    //prompt for nickname
    saveNickname();

    //submit message in the chat 
    $('#sendMessageForm').submit(function () {
        sendMessage();
        sendMessageForm.reset();
        return false;
    });
    //CANVAS
    $('#myCanvas').mousedown(function (e) {
        //tracking mouse starting pos 
         mousePressed = true;
         startX = e.pageX - $(this).offset().left;
         startY = e.pageY - $(this).offset().top, false;
         x = e.pageX - $(this).offset().left;
         y = e.pageY - $(this).offset().top, false;
         isDown = "mousedown";
        //drawing on client's canvas 
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, isDown, startX, startY);
        //emitting the drawing coordinates from client
        socket.emit('draw', x, y, "mousedown", startX, startY);
    });
    $('#myCanvas').mousemove(function (e) {
        //tracking mouse movement
        if (mousePressed) {
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var isDown = "mousemove";
            startX = 0;
            startY = 0;
            //continuing drawing on client's canvas 
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, isDown, startX, startY);
            //emitting the drawing coordinates from client
            socket.emit('draw', x, y, isDown, startX, startY);
        }
    });
    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
    //click listener for clearing canvases
    clearCanvasButton.addEventListener('click', function(){
       socket.emit('clearArea');
       clearArea();
    });
}
//drawing function
function Draw(x, y, isDown, startX, startY ) {
    //TODO pick color and width
    /*ctx.strokeStyle = $('#selColor').val();
    ctx.lineWidth = $('#selWidth').val();*/
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    //starting position
    if (x == startX && y == startY) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    }
    //movement coordinates
    else if (isDown == "mousemove"){
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}


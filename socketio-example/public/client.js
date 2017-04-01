/*
.emit Sends messages between server-client(s).
.on Handles incoming messages
*/
var socket = io.connect();

//drawing
var canvas = document.getElementById("myCanvas");
var ctx;
var mousePressed = false;
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

socket.on('playersList', function(clients, client){
    document.getElementById('clients_ol').innerHTML = '';
    for(var i=0; i<clients.length; i++){
        var li = document.createElement("li");
        li.setAttribute("class", "clientsListLi");
        li.setAttribute("id", clients[i].nickname);
        li.innerHTML = clients[i].nickname + " " + clients[i].points;
        clients_ol.appendChild(li);
    }
});

socket.on('youDraw', function(data){
    what_are_you_drawing.style.display = "block";
    who_is_drawing.style.display = "none";
});

socket.on('whoIsDrawing', function (nickname) {
    who_is_drawing.style.display = "block";
    document.getElementById('who_is_drawing_h2').innerHTML = "Now is drawing: " + nickname;
    iwantToDrawButton.style.display = "none";

});

socket.on('updatePlayersListEmit', function(nickname, points){
    what_are_you_drawing.style.display = "none";
    document.getElementById(nickname).innerHTML = nickname + " " + points;
    newMessage(nickname, "WON THIS ROUND: ");
    who_is_drawing.style.display = "none";
    iwantToDrawButton.style.display = "block";
    socket.emit('nextRound');
});

socket.on('sendingMsg', function(data, nickname){
    newMessage(data, nickname);
    chatDiv.scrollTop = chatDiv.scrollHeight;
});

socket.on('clearArea', function(data){
   clearArea();
});

socket.on('drawingEmit', function(x, y, isDown, startX, startY){
    Draw(x, y, isDown, startX, startY);
});


function IwantToDraw(nickname){
    console.log("i want to draw clicked: " + player.nickname) ;
    socket.emit('IwantToDrawClicked', player.nickname);
}

function sendDrawing(){
  active_drawing = document.getElementById('active_drawing').value;
  socket.emit('activeDrawing', active_drawing);
}
function saveNickname(){
    var nickname = prompt("Nickname: ");
    //console.log(nickname);
    socket.emit('newPlayer', nickname, 0);
    player.nickname = nickname;

}

//sending msg
function sendMessage(){
  var msg = document.getElementById('message').value;
  socket.emit('messageEmit', msg, player.nickname);
}
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);   
}
function newMessage(data, nickname){
    //console.log(nickname);
    var li = document.createElement("li");
    li.setAttribute("class", "message_li");
    li.innerHTML = nickname + ": " + data;
    ul.appendChild(li);
}


//DRAWING PART
function init(){
    ctx = document.getElementById('myCanvas').getContext("2d");
    ul = document.getElementById("messages_ul");
    clients_ul = document.getElementById("clients_ul");
    chatDiv = document.getElementById('chat');
    iwantToDrawButton = document.getElementById('IwantToDraw');
    what_are_you_drawing = document.getElementById('what_are_you_drawing');
    who_is_drawing = document.getElementById('who_is_drawing');

    saveNickname();

    $('#myCanvas').mousedown(function (e) {
         mousePressed = true;
         startX = e.pageX - $(this).offset().left;
         startY = e.pageY - $(this).offset().top, false;
         x = e.pageX - $(this).offset().left;
         y = e.pageY - $(this).offset().top, false;
         isDown = "mousedown";

        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, isDown, startX, startY);
        socket.emit('draw', x, y, "mousedown", startX, startY);

    });
    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var isDown = "mousemove";
            startX = 0;
            startY = 0;

            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, isDown, startX, startY);
            socket.emit('draw', x, y, isDown, startX, startY);
        }
    });
    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
        $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });

    var clearCanvasButton = document.getElementById("clearCanvas");
    console.log(clearCanvasButton);
    clearCanvasButton.addEventListener('click', function(){
       socket.emit('clearArea');
       clearArea();
    });

    //submit message
    $('#sendMessageForm').submit(function () {
        sendMessage();
        sendMessageForm.reset();
        return false;
    });
}

function Draw(x, y, isDown, startX, startY ) {
    //TODO pick color and width
    /*ctx.strokeStyle = $('#selColor').val();
    ctx.lineWidth = $('#selWidth').val();*/
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";

    if (x == startX && y == startY) {
        console.log(isDown);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    }
    else if (isDown == "mousemove"){
        console.log(isDown);
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}


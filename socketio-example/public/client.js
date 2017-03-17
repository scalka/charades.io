/*
.emit Sends messages between server-client(s).
.on Handles incoming messages
*/
var socket = io.connect();

           
//listening for messages
//in this case for hello
socket.on('hello', function(data){
    document.getElementById('clientsList').innerHTML = data + "clients with id " + socket.id ;
});

socket.on('clientsList', function(data){
    console.log("client " + data);
    document.getElementById("clientsList").innerHTML = "";
    for (var i =0 ; i < data.length; i++){
        var li = document.createElement("li");
        li.setAttribute("class", "clientsListLi");
        li.innerHTML = data[i];
        clients_ul.appendChild(li);
    }
});

//incoming
socket.on('buttonUpdate', function(data){
    document.getElementById("buttonCount").innerHTML = 'The button has been clicked ' + data + ' times.';
});

socket.on('sendingMsg', function(data, nickname){
    newMessage(data, nickname);
    
});

socket.on('drawingEmit', function(x, y, isDown, lastX, lastY){
    //console.log("draw");
    console.log("is down " + isDown);
    if(isDown){
        Draw(x, y, isDown, startX, startY);
    }
});

socket.on('clearArea', function(data){
   clearArea();
   //console.log("clear");
});


//drawing
var canvas = document.getElementById("myCanvas");
var ctx;
var mousePressed = false;
var startX, startY;
var lastX, lastY;
var ul;
var x,y;

//DRAWING PART
function init(){
    ctx = document.getElementById('myCanvas').getContext("2d");
    ul = document.getElementById("messages_ul");
    clients_ul = document.getElementById("clients_ul");
    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        startX = e.pageX - $(this).offset().left;
        startY = e.pageY - $(this).offset().top;

    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                x = e.pageX - $(this).offset().left;
                y = e.pageY - $(this).offset().top;

            socket.emit('draw', x, y, mousePressed, startX, startY);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
            lastX = e.pageX - $(this).offset().left;
            lastY = e.pageY - $(this).offset().top;
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

}
function saveNickname(){
    var nickname = document.getElementById('nickname').value;
    //console.log(nickname);
    socket.emit('nicknameEmit', nickname);
}
//sending msg
function sendMessage(){
	var msg = document.getElementById('message').value;
	//console.log(msg);
	socket.emit('messageEmit', msg);
}

function Draw(x, y, isDown, startX, startY) {
    if (isDown) {
        console.log(lastX, lastY);
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(startX, startX);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
    }
    
    lastX = x; lastY = y;  

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

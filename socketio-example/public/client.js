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

socket.on('drawingEmit', function(x, y, isDown){
    //console.log("draw");
    console.log("is down " + isDown);
   /* if(isDown){
        Draw(x, y, isDown);
    }*/
    Draw(x, y, isDown);
});
//DRAWING PART
function init(){
    ctx = document.getElementById('myCanvas').getContext("2d");
    ul = document.getElementById("messages_ul");
    clients_ul = document.getElementById("clients_ul");
    $('#myCanvas').mousedown(function (e) {
         mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);

                var x = e.pageX - $(this).offset().left;
                var y = e.pageY - $(this).offset().top;
                var isDown = true;

            socket.emit('draw', x, y, isDown);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
            lastX = e.pageX - $(this).offset().left;
            lastY = e.pageY - $(this).offset().top;
            socket.emit('draw', x, y, mousePressed);
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
function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
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


/*
document.addEventListener("DOMContentLoaded", function() {
   var mouse = { 
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   var socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };

   // draw line received from server
    socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
   });
   
   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});*/
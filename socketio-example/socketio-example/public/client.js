var socket = io.connect();

/*
.emit Sends messages between server-client(s).
.on Handles incoming messages
*/

           
//listening for messages
//in this case for hello
socket.on('hello', function(data){
    document.getElementById('text').innerHTML = data + "clients";
});

//onclick function 
function buttonClicked(){
	socket.emit('clicked');
}

//sending msg
function sendMessage(){
	var msg = document.getElementById('message').value;
	console.log(msg);
	socket.emit('messageEmit', msg);
}

//incoming
socket.on('buttonUpdate', function(data){
	document.getElementById("buttonCount").innerHTML = 'The button has been clicked ' + data + ' times.';
});

socket.on('sendingMsg', function(data){
	document.getElementById("receivedMsg").innerHTML = "received " + data;
	console.log(data);

});

socket.on('drawingEmit', function(x, y, isDown){
	console.log("draw");
	Draw(x, y, isDown);
});

//drawing
var canvas = document.getElementById("myCanvas");
var ctx;
var mousePressed = false;
var lastX, lastY;

//DRAWING PART
function init(){
	ctx = document.getElementById('myCanvas').getContext("2d");
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
    });
	    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
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
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
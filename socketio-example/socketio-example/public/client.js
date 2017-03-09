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




//drawing
var canvas = document.getElementById("myCanvas");

canvas.addEventListener("mousedown", function(){
	console.log("down");
});
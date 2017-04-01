## Socket.io Charades 
This is a client-server game based on chat functionality. Charades were developed using on the server side Node.js with Express.js framework and Socket.io. 
Charades is a drawing game. One of the players chooses what he wants to draw and the rest of them needs to guess what was drawn on the canvas. Players write their guesses in a chat. The app checks for the correct answer. If the answer was guessed correctly, points are given to that player and a next player can start drawing.

To run this project navigate to the top level folder in a console and type:
```
node server.js 
```
And then navigate to localhost in a browser:
```
http://localhost:3000
```
Other players can join by connecting to the same network and typing in a browser
```
http://local_ip_address:3000
```
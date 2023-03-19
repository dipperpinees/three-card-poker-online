## Three Card Poker (Ba Cay) game with Node.js, Express.js, Socket.io, and React
> This is a simple Three Card Poker online game website built using Node.js, Express.js, Socket.io, and React. It allows players to join a game room and play Ba Cây with other players in real-time.

## Getting Started
To get started, clone this repository to your local machine and run the following commands:

`yarn install` to install packages

`yarn start` to run app locally

Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

## Functionality overview

**General functionality:**
- Join the game with up to 12 players
- Deal a random poker hand from a standard card deck
- Bet money on other players
- Contribute money together
- Transfer money to other players

<p>
  <img src="https://res.cloudinary.com/uethehe/image/upload/w_1500/v1675775558/Screenshot-from-2022-12-10-16-51-52_ub4v6h.png"/>
</p>

## How it Works
This website uses Socket.io to establish real-time communication between the client and the server. When a player joins a game room, they are assigned a unique ID, which is used to communicate with other players in the same game room.

The server-side code is built using Node.js and Express.js. It handles HTTP requests and serves the client-side code and static files. The client-side code is built using React and communicates with the server using Socket.io.

## Acknowledgments
This project was inspired by the popular Ba Cay game, which is a traditional Vietnamese card game. Special thanks to the contributors of the following libraries and frameworks:
 - Node.js: https://nodejs.org
 - Express.js: https://expressjs.com
 - Socket.io: https://socket.io
 - React: https://reactjs.org


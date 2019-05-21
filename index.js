const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 8000;

const { Deck } = require('./deck.js');

let connections = [];
let gameDecks = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(`CONNECTED: Number of connections => ${connections.length}`);

    socket.on('disconnect', () => {
        connections.splice(socket);
        console.log(`DISCONNECTED: Number of connections => ${connections.length}`);
    });

    socket.on('new game', () => {
        let gameCode = generateGameCode();

        socket.gameCode = gameCode;
        gameDecks[gameCode] = new Deck().shuffle();

        socket.emit('game code', gameCode);
    });

    socket.on('join game', (gameCode) => {
        if (gameDecks.hasOwnProperty(gameCode)) {
            socket.gameCode = gameCode;

            socket.emit('game code', gameCode);
        }
    });

    socket.on('deal', () => {
        let players = getClientsFromGame(socket.gameCode);

        players.forEach((player) => {
            player.hand = []

            for (let i = 0; i < 7; i++) {
                player.hand.push(gamesDecks[socket.gameCode].draw());
            }

            player.emit('hand', player.hand);
        });
    });
});

function getRandomNumberInRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function generateGameCode() {
    return String(getRandomNumberInRange(100000, 999999));
}

function getClientsFromGame(gameCode) {
    return connections.filter((socket) => {
        return socket.gameCode === gameCode;
    });
}
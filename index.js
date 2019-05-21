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
        connections.splice(connections.indexOf(socket), 1);
        console.log(`DISCONNECTED: Number of connections => ${connections.length}`);
    });

    socket.on('new game', () => {
        let gameCode = generateGameCode();

        socket.gameCode = gameCode;
        gameDecks[gameCode] = new Deck();

        socket.emit('game code', gameCode);
    });

    socket.on('join game', (gameCode) => {
        if (gameDecks.hasOwnProperty(gameCode)) {
            socket.gameCode = gameCode;

            socket.emit('game code', gameCode);
        }
    });

    socket.on('deal', () => {
        let currentDeck = gameDecks[socket.gameCode];
        let players = getClientsFromGame(socket.gameCode);

        currentDeck.shuffle();

        players.forEach((player) => {
            player.hand = []

            for (let i = 0; i < 27; i++) {
                player.hand.push(currentDeck.draw());
            }            

            player.emit('hand', player.hand);
        });
    });

    socket.on('match found', (matches) => {
        if (!socket.hasOwnProperty('points')) {
            socket.points = 0
        }

        matches.forEach((cardName) => {
            socket.hand.splice(socket.hand.indexOf(getCardFromHand(socket, cardName)), 1);
        });

        if (matches.length === 4) {
            socket.points += 5
        } else {
            socket.points += 1
        }

        socket.emit('hand', socket.hand);
        socket.emit('points', socket.points);
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

// card funcitonality

function getCardFromHand(socket, name) {
    return socket.hand.filter((card) => {
        return card.name === name;
    })[0];
}
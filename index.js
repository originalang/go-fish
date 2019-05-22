const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 8000;

const { Deck } = require('./deck.js');

let connections = [];
let gameDecks = {};
let gameTurns = {};

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
        gameTurns[gameCode] = -1;

        // join the room
        socket.join(socket.gameCode);

        socket.emit('found game');
    });

    socket.on('join game', (gameCode) => {
        if (gameDecks.hasOwnProperty(gameCode)) {
            if (gameDecks[gameCode].cards.length > 0) {
                socket.gameCode = gameCode;

                // join the room
                socket.join(socket.gameCode);

                socket.emit('found game');
            }
        }
    });

    socket.on('username', (username) => {
        socket.username = username;

        socket.emit('game code', socket.gameCode);
    });

    socket.on('deal', () => {
        let currentDeck = gameDecks[socket.gameCode];
        let players = getClientsFromGame(socket.gameCode);

        currentDeck.shuffle();

        let i = 0;

        while (currentDeck.cards.length > 0) {
            if (i === players.length) {
                i = 0;
            }

            if (!players[i].hasOwnProperty('hand')) {
                players[i].hand = [];
            }

            players[i].hand.push(currentDeck.draw());

            i++;
        }

        players.forEach((player) => {
            player.emit('hand', player.hand);
        });
    });

    socket.on('next turn', () => {
        let players = getClientsFromGame(socket.gameCode); 

        gameTurns[socket.gameCode] += 1;

        if (gameTurns[socket.gameCode] === players.length) {
            gameTurns[socket.gameCode] = 0
        }
        
        players[gameTurns[socket.gameCode]].emit('turn');
        io.to(socket.gameCode).emit('turn info', players[gameTurns[socket.gameCode]].username);
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
let socket = io.connect();

const welcomePage = document.querySelector('#welcome-page');
const gamePage = document.querySelector('#game-page');
const welcomeAnimation = document.querySelector('#welcome-animation');
const gameCodeInput = document.querySelector('#game-code-input');
const usernameInput = document.querySelector('#username');
const gameCodeDisplay = document.querySelector('#game-code');
const startGame = document.querySelector('#start-game');
const playerHand = document.querySelector('#hand');
const matchButton = document.querySelector('#match');
const pointsDisplay = document.querySelector('#points');
const turnComplete = document.querySelector('#turn-complete');

// save current client's username
let finalUsername;

document.querySelector('#new-game').addEventListener('click', (e) => {
    socket.emit('new game');
    welcomePage.classList.add('hide');
    gameCodeInput.classList.remove('hide');
    startGame.classList.remove('hide');
});

document.querySelector('#join-game').addEventListener('click', (e) => {
    welcomePage.classList.add('hide');
    gameCodeInput.classList.remove('hide');
});

gameCodeInput.addEventListener('change', (e) => {
    socket.emit('join game', gameCodeInput.value);
});

usernameInput.addEventListener('change', (e) => {
    finalUsername = usernameInput.value;
    socket.emit('username', usernameInput.value);
});

startGame.addEventListener('click', (e) => {
    socket.emit('deal');
    socket.emit('next turn');
    startGame.classList.add('hide');
});

matchButton.addEventListener('click', (e) => {
    let selected = document.querySelectorAll('.selected');
    let matchTest = {};
    selected.forEach((c) => {
        if (matchTest.hasOwnProperty(c.dataset.value)) {
            matchTest[c.dataset.value] += 1;
        } else {
            matchTest[c.dataset.value] = 1;
        }
    });

    if ((selected.length === 2 || selected.length === 4) && Object.keys(matchTest).length === 1) {
        socket.emit('match found', [...selected].map(c => c.name));
    }
    
});

turnComplete.addEventListener('click', (e) => {
    socket.emit('next turn');
});

// incoming events

socket.on('found game', () => {
    gameCodeInput.classList.add('hide');
    usernameInput.classList.remove('hide');
});

socket.on('game code', (gameCode) => {
    welcomePage.classList.add('hide');
    welcomeAnimation.classList.add('hide');

    usernameInput.classList.add('hide');

    gamePage.classList.remove('hide');

    gameCodeDisplay.innerHTML = gameCode;
});

socket.on('hand', (hand) => {
    playerHand.innerHTML = '';

    hand.forEach((card) => {
        playerHand.innerHTML += `<img class="card" src="cards/${card.name.toLowerCase().split(' ').join('_')}.png" alt="${card.name}" name="${card.name}" data-value="${card.value}" onclick="cardClicked(this)">`
    });

    matchButton.classList.remove('hide');
    pointsDisplay.classList.remove('hide');
});

socket.on('points', (points) => {
    pointsDisplay.innerHTML = points;
});

socket.on('turn', () => {
    turnComplete.classList.remove('hide');    
});

socket.on('turn info', (username) => {
    if (finalUsername !== username) {
        turnComplete.classList.add('hide');
    }
});

// helper functions

function cardClicked(card) {
    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
    } else {
        card.classList.add('selected');
    }

    document.querySelectorAll('.card').forEach((c) => {
        if (!c.classList.contains('selected')) {
            c.style.opacity = '0.4';
        } else {
            c.style.opacity = '1';
        }
    });
}
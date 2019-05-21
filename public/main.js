let socket = io.connect();

const welcomePage = document.querySelector('#welcome-page');
const welcomeAnimation = document.querySelector('#welcome-animation');
const gameCodeInput = document.querySelector('#game-code-input');
const gameCodeDisplay = document.querySelector('#game-code');
const startGame = document.querySelector('#start-game');
const playerHand = document.querySelector('#hand');
const matchButton = document.querySelector('#match');

document.querySelector('#new-game').addEventListener('click', (e) => {
    socket.emit('new game');
    startGame.classList.remove('hide');
});

document.querySelector('#join-game').addEventListener('click', (e) => {
    welcomePage.classList.add('hide');
    gameCodeInput.classList.remove('hide');
});

gameCodeInput.addEventListener('change', (e) => {
    socket.emit('join game', gameCodeInput.value);
});

startGame.addEventListener('click', (e) => {
    socket.emit('deal');
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

    if (selected.length === 4 && Object.keys(matchTest).length === 1) {
        socket.emit('match found', [...selected].map(c => c.name));
    }
    
});

// incoming events

socket.on('game code', (gameCode) => {
    welcomePage.classList.add('hide');
    welcomeAnimation.classList.add('hide');
    gameCodeInput.classList.add('hide');

    gameCodeDisplay.innerHTML = gameCode;
});

socket.on('hand', (hand) => {
    hand.forEach((card) => {
        playerHand.innerHTML += `<img class="card" src="cards/${card.name.toLowerCase().split(' ').join('_')}.png" alt="${card.name}" name="${card.name}" data-value="${card.value}" onclick="cardClicked(this)">`
    });
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
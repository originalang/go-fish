let socket = io.connect();

const welcomePage = document.querySelector('#welcome-page');
const welcomeAnimation = document.querySelector('#welcome-animation');
const gameCodeInput = document.querySelector('#game-code-input');
const gameCodeDisplay = document.querySelector('#game-code');
const startGame = document.querySelector('#start-game');

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

// incoming events

socket.on('game code', (gameCode) => {
    welcomePage.classList.add('hide');
    welcomeAnimation.classList.add('hide');
    gameCodeInput.classList.add('hide');

    gameCodeDisplay.innerHTML = gameCode;
});

socket.on('hand', (hand) => {
    console.log(hand);
});
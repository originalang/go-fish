let socket = io.connect();

const welcomePage = document.querySelector('#welcome-page');
const gameCodeInput = document.querySelector('#game-code-input');

document.querySelector('#new-game').addEventListener('click', (e) => {
    socket.emit('new game');
});

document.querySelector('#join-game').addEventListener('click', (e) => {
    welcomePage.classList.add('hide');
    gameCodeInput.classList.remove('hide');
});

gameCodeInput.addEventListener('change', (e) => {
    socket.emit('join game', gameCodeInput.value);
});

socket.on('game code', (gameCode) => {
    welcomePage.classList.add('hide');
    gameCodeInput.classList.add('hide');

    console.log(gameCode);
});
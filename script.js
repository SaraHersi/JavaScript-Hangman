// DOM Elements
const wordDisplay = document.getElementById('word-display');
const guessesLeftDisplay = document.getElementById('guesses-left');
const keyboardDiv = document.getElementById('keyboard');
const hangmanCanvas = document.getElementById('hangman-canvas');
const popupContainer = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');
const correctWordDisplay = document.getElementById('correct-word');
const playAgainButton = document.getElementById('play-again-button');

const ctx = hangmanCanvas.getContext('2d');

// Game Variables
const words = ["executioner", "hangman", "butcher", "assassin", "headsman"];
let selectedWord;
let guessedLetters;
let wrongGuesses;
let gameInProgress;

const MAX_WRONG_GUESSES = 6;

// --- Game Initialization ---
function setupKeyboard() {
    keyboardDiv.innerHTML = ''; // Clear previous keyboard
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
        const keyButton = document.createElement('button');
        keyButton.className = 'key';
        keyButton.textContent = letter;
        keyButton.addEventListener('click', () => handleGuess(letter));
        keyboardDiv.appendChild(keyButton);
    });
}

function resetGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = new Set();
    wrongGuesses = 0;
    gameInProgress = true;

    updateWordDisplay();
    updateGuessesLeft();
    drawHangman();
    
    document.querySelectorAll('.key').forEach(key => key.disabled = false);
    
    popupContainer.style.display = 'none';
}

// --- UI Updates ---
function updateWordDisplay() {
    const display = selectedWord
        .split('')
        .map(letter => (guessedLetters.has(letter) ? letter.toUpperCase() : '_'))
        .join(' ');
    wordDisplay.textContent = display;
}

function updateGuessesLeft() {
    guessesLeftDisplay.textContent = MAX_WRONG_GUESSES - wrongGuesses;
}

function drawHangman() {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Gallow
    if (wrongGuesses > 0) {
        ctx.beginPath();
        ctx.moveTo(20, 230);
        ctx.lineTo(120, 230);
        ctx.moveTo(70, 230);
        ctx.lineTo(70, 50);
        ctx.lineTo(170, 50);
        ctx.stroke();
    }

    // Rope
    if (wrongGuesses > 1) {
        ctx.beginPath();
        ctx.moveTo(170, 50);
        ctx.lineTo(170, 90);
        ctx.stroke();
    }

    // Head
    if (wrongGuesses > 2) {
        ctx.beginPath();
        ctx.arc(170, 110, 20, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Body
    if (wrongGuesses > 3) {
        ctx.beginPath();
        ctx.moveTo(170, 130);
        ctx.lineTo(170, 180);
        ctx.stroke();
    }

    // Arms
    if (wrongGuesses > 4) {
        ctx.beginPath();
        ctx.moveTo(170, 140);
        ctx.lineTo(140, 160);
        ctx.moveTo(170, 140);
        ctx.lineTo(200, 160);
        ctx.stroke();
    }

    // Legs
    if (wrongGuesses > 5) {
        ctx.beginPath();
        ctx.moveTo(170, 180);
        ctx.lineTo(140, 210);
        ctx.moveTo(170, 180);
        ctx.lineTo(200, 210);
        ctx.stroke();
    }
}

// --- Game Logic ---
function handleGuess(letter) {
    if (!gameInProgress || guessedLetters.has(letter)) {
        return;
    }

    guessedLetters.add(letter);

    document.querySelectorAll('.key').forEach(key => {
        if (key.textContent === letter) {
            key.disabled = true;
        }
    });

    if (selectedWord.includes(letter)) {
        updateWordDisplay();
    } else {
        wrongGuesses++;
        updateGuessesLeft();
        drawHangman();
    }

    checkGameState();
}

function checkGameState() {
    const isWinner = selectedWord.split('').every(letter => guessedLetters.has(letter));
    const isLoser = wrongGuesses >= MAX_WRONG_GUESSES;

    if (isWinner || isLoser) {
        gameInProgress = false;
        setTimeout(() => showFinalMessage(isWinner), 500);
    }
}

function showFinalMessage(isWinner) {
    correctWordDisplay.textContent = '';
    if (isWinner) {
        finalMessage.textContent = 'Congratulations! You Won! :)';
    } else {
        finalMessage.textContent = 'Unfortunately, you lost.:(';
        correctWordDisplay.textContent = `The word was: ${selectedWord}`;
    }
    popupContainer.style.display = 'flex';
}

// --- Event Listeners ---
document.addEventListener('keydown', (e) => {
    if (gameInProgress && e.key >= 'a' && e.key <= 'z') {
        handleGuess(e.key.toLowerCase());
    }
});

playAgainButton.addEventListener('click', resetGame);

// --- Initial Setup ---
setupKeyboard();
resetGame();
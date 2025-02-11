const words = require('./words');
const sessions = {};
const games = {};

function getAllWords() {
    return words;
}

function getUsername(sid) {
    return sessions[sid]?.username;
}

function createSession(sid, username) {
    sessions[sid] = { username };
    if (!games[username]) {
        games[username] = null;
    }
}

function isValidSession(sid) {
    return sid in sessions;
}

function endSession(sid) {
    delete sessions[sid];
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toLowerCase();
}

function getGame(username) {
    return games[username] || null;
}

function addGuess(username, guess) {
    const game = games[username];
    if (game) {
        game.guesses.push(guess);
        game.turns += 1;
    }
}

function checkGuess(username, guess) {
    const game = games[username];

    const normalizedGuess = guess.toLowerCase();
    const normalizedSecretWord = game.secretWord.toLowerCase();

    if (!words.includes(normalizedGuess)) {
        return { valid: false, error: 'Invalid word. Please guess a valid word in Available Words.' };
    }

    if (game.guesses.includes(normalizedGuess)) {
        return { valid: false, error: 'You have already guessed this word.' };
    }

    game.guesses.push(normalizedGuess);
    game.turns += 1;

    if (normalizedGuess === normalizedSecretWord) {
        game.isGameOver = true;
        return { valid: true, correct: true, matches: game.secretWord.length };
    } else {
        const matchingLetters = normalizedGuess.split('').filter(char => normalizedSecretWord.includes(char)).length;
        return { valid: true, correct: false, matches: matchingLetters };
    }
}

function startNewGame(username) {
    const secretWord = words[Math.floor(Math.random() * words.length)];

    games[username] = {
        secretWord: secretWord,
        guesses: [],
        turns: 0,
        isGameOver: false
    };

    return secretWord;
}

module.exports = {
    createSession,
    checkGuess,
    endSession,
    getRandomWord,
    isValidSession,
    getUsername,
    getAllWords,
    startNewGame,
    addGuess,
    getGame
};

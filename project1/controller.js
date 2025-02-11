
const view = require('./view');
const sessionManager = require('./model');
const crypto = require('crypto');

function handleLogin(req, res) {
    const username = req.body.username ? req.body.username.trim() : null;

    if (!username) {
        return view.renderLoginPage(res, 'Please provide a valid username.');
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return view.renderLoginPage(res, 'Invalid username.');
    }

    if (username === 'dog') {
        return view.renderLoginPage(res, 'Username "dog" is not allowed.');
    }

    const sid = crypto.randomUUID();
    sessionManager.createSession(sid, username);

    const game = sessionManager.getGame(username);
    if (!game) {

        const secretWord = sessionManager.startNewGame(username);
        console.log(`New gamer started: ${username}, Secret word: ${secretWord}`);
    } else {
 
        console.log(`User ${username} resumed the game. Secret word: ${game.secretWord}`);
    }

    res.cookie('sid', sid, { httpOnly: true });
    res.redirect('/');
}

function handleHomePage(req, res) {
    const sid = req.cookies.sid || '';

    if (!sid || !sessionManager.isValidSession(sid)) {
        return view.renderLoginPage(res);
    }

    const username = sessionManager.getUsername(sid);
    const game = sessionManager.getGame(username);

    if (game) {
        const words = sessionManager.getAllWords();
        view.renderGamePage(res, username, '', game, words, sid);
    } else {
        view.renderLoginPage(res, 'No active game found. Please start a new game.');
    }
}


function handleGuess(req, res) {
    const sid = req.cookies.sid || '';

    if (!sid || !sessionManager.isValidSession(sid)) {
        return view.renderLoginPage(res, 'Session expired. Please log in again.');
    }

    const username = sessionManager.getUsername(sid);
    const guess = req.body.guess.trim().toLowerCase();
    const result = sessionManager.checkGuess(username, guess);
    const game = sessionManager.getGame(username);
    const words = sessionManager.getAllWords();

    if (game.isGameOver) {
        return view.renderGamePage(res, username, `Congratulations! You already guessed the correct word: ${game.secretWord}. Game Over!`, game, sessionManager.getAllWords(), sid);
    }

    if (!result.valid) {
        return view.renderGamePage(res, username, result.error, game, words, sid);
    }

    if (result.correct) {
        game.isGameOver = true;
        return view.renderGamePage(res, username, `Congratulations! You guessed the correct word: ${game.secretWord}.!`, game, words, sid);
    }

    view.renderGamePage(res, username, `You matched ${result.matches} letters.`, game, words, sid);
}


function handleNewGame(req, res) {
    const sid = req.cookies.sid || '';
    if (!sid || !sessionManager.isValidSession(sid)) {
        return view.renderLoginPage(res, 'Session expired. Please log in again.');
    }

    const username = sessionManager.getUsername(sid);
    const secretWord = sessionManager.startNewGame(username);
    console.log(`Started New Game: ${username}, Secret word: ${secretWord}`);

    res.redirect('/');
}


function handleLogout(req, res) {
    const sid = req.cookies.sid;
    res.clearCookie('sid');
    sessionManager.endSession(sid);
    res.redirect('/');
}


module.exports = { handleLogin, handleHomePage, handleGuess, handleNewGame, handleLogout };
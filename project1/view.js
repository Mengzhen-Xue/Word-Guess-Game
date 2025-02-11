
function renderLoginPage(res, errorMessage = '') {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/styles.css">
            <title>Word Guess Game</title>
        </head>
        <body>
        <h1>Welcome to word guessing game</h1>
            <div class="game-intro">
                <p>How to Play: <p>
                <p>Guess the secret word by entering your guesses.
                 The system will tell you know how many letters match the secret word.
                Keep guessing until you find the word!</p>
            </div>
            <h2>Log in to start playing</h2>
            <form action="/login" method="POST" class="form-section">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required placeholder="Enter your name">
                ${errorMessage ? `<p class="error-message">${errorMessage}</p>` : ''}
                <button type="submit">Log in</button>
            </form>
        </body>
        </html>
    `;
    res.send(html);
}
function renderGamePage(res, username, message, game, words = [], sid) {
    const guessesHtml = game.guesses.map(guess => `<li>${guess}</li>`).join('');
    const wordsHtml = words.map(word => `<li>${word}</li>`).join('');

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Word Guess Game</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <h1>Welcome ${username}, let's get started!</h1>
            <h2 class="info-text">Available Words:</h2>
            <ul>${wordsHtml}</ul>
            ${!game.isGameOver ? `
            <form action="/guess" method="POST">
                <label for="guess">Your guess:</label>
                <input type="text" id="guess" name="guess" required>
                <input type="hidden" name="sid" value="${sid}">
                <button type="submit">Submit Guess</button>
            </form>
            ` : `

            `}${message ? `<p class="error-message">${message}</p>` : ''}
            <p class="guess-message">Guess the secret word. You've made ${game.turns} guesses.</p>

            <h2 class="info-text">Previous Guesses:</h2>
            <ul class="guess-info">${guessesHtml}</ul>


            <form action="/new-game" method="POST">
                <button type="submit">Start New Game</button>
            </form>

            <form action="/logout" method="POST">
                <button type="submit">Logout</button>
            </form>
        </body>
        </html>
    `;
    res.send(html);
}


module.exports = { renderLoginPage, renderGamePage };


const express = require('express');
const cookieParser = require('cookie-parser');
const controller = require('./controller');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));


app.get('/', (req, res) => {
    controller.handleHomePage(req, res);
});

app.post('/login', (req, res) => {
    controller.handleLogin(req, res);
});

app.post('/guess', (req, res) => {
    controller.handleGuess(req, res);
});

app.get('/win', (req, res) => {
    controller.handleWin(req, res);
});

app.post('/new-game', (req, res) => {
    controller.handleNewGame(req, res);
});

app.post('/logout', (req, res) => {
    controller.handleLogout(req, res);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

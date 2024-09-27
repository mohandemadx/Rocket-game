import HomeScreen from './screens/HomeScreen.js';
import InfoScreen from './screens/InfoScreen.js';
import MainGame from './screens/MainGame.js';
import GameOverScreen from './screens/GameOverScreen.js';
import QuestionScreen from './screens/QuestionScreen.js';

window.globalGameData = {
    username: '',
    score: 0,
    level: 1
};

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth-25,
    height: window.innerHeight-25,
    backgroundColor: '#000',
    scene: [HomeScreen, InfoScreen, MainGame, GameOverScreen, QuestionScreen], // HomeScreen should be listed first
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
};

const game = new Phaser.Game(config);

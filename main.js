import HomeScreen from './screens/HomeScreen.js';
import InfoScreen from './screens/InfoScreen.js';
import MainGame from './screens/MainGame.js';
import GameOverScreen from './screens/GameOverScreen.js';
import QuestionScreen from './screens/QuestionScreen.js';
import MainGame2 from './screens/MainGame2.js';
import QuestionScreen2 from './screens/QuestionScreen2.js';
import GameOverScreen2 from './screens/GameOverScreen2.js';
import FinalScreen from './screens/FinalScreen.js';
import GameInfo from './screens/GameInfo.js';
import ScoreboardScreen from './screens/ScoreboardScreen.js';

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
    scene: [HomeScreen, InfoScreen, MainGame, GameOverScreen,
         QuestionScreen, GameInfo, MainGame2,
          QuestionScreen2, GameOverScreen2, FinalScreen,
        ScoreboardScreen], 
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
};

const game = new Phaser.Game(config);

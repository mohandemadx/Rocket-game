import { getTop5Scores, getHighscore } from '../firebase/firebase.js';

class ScoreboardScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ScoreboardScreen' });
    }

    async create() {
        // Fetch the top 5 scores and player's highscore
        const top5Scores = await getTop5Scores();
        const playerHighscore = await getHighscore(window.globalGameData.username);

        // Screen dimensions for centering
        const centerX = this.game.config.width / 2;
        let yOffset = 100; // Initial y-offset for displaying scores

        // Display the header (Scoreboard)
        this.add.text(centerX, 50, 'Scoreboard', {
            fontSize: '32px',
            fontFamily: "'Press Start 2P', cursive",  // Use your game's font
            color: '#ffffff',
            stroke: '#000000',  // Add black outline
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5, 0.5); // Center the header

        // Display the top 5 scores
        yOffset += 20; // Adjust the y-offset after the header
        top5Scores.forEach((scoreData, index) => {
            this.add.text(centerX, yOffset, `${index + 1}. ${scoreData.username}: ${scoreData.highscore}`, {
                fontSize: '20px',
                fontFamily: "'Press Start 2P', cursive",  // Use your game's font
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',  // Add black outline
                strokeThickness: 4
            }).setOrigin(0.5, 0.5); // Center the text
            yOffset += 50; // Move down for the next score
        });

        // Display the player's highscore
        yOffset += 20; // Add some space between the top 5 and player's highscore
        this.add.text(centerX, yOffset, `Your Highscore: ${playerHighscore}`, {
            fontSize: '20px',
            fontFamily: "'Press Start 2P', cursive",  // Use your game's font
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',  // Add black outline
            strokeThickness: 4
        }).setOrigin(0.5, 0.5); // Center the text

        yOffset += 50;
        // Add a button to return to the main menu
        this.add.text(centerX, yOffset, 'Press ESC to Exit', {
            fontSize: '16px',
            fontFamily: "'Press Start 2P', cursive",  // Use your game's font
            color: '#ffffff',
            stroke: '#000000',  // Add black outline
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5, 0.5); // Center the button text

        // Enable 'ESC' key to return to the Final Screen
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('FinalScreen'); 
        });
    }
}

export default ScoreboardScreen;

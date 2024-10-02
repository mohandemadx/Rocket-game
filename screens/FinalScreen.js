import { getHighscore } from '../firebase/firebase.js';

class FinalScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalScreen' });
    }

    preload() {
        // Load button assets
        this.load.image('homeButton', 'assets/home.png'); 
        this.load.image('scoreboardButton', 'assets/score.png'); 
    }

    create() {
        this.createBackground();
        this.createWindow();
        this.displayTitle();
        this.displayScore();
        this.createButtons();
    }

    createBackground() {
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.game.config.width, this.game.config.height);
        background.setTint(0x888888);
    }

    createWindow() {
        const windowWidth = 600;
        const windowHeight = 400;
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;

        this.window = this.add.rectangle(windowX, windowY, windowWidth, windowHeight, 0x000000)
            .setStrokeStyle(4, 0xffffff);
    }

    displayTitle() {
        const text = "Spread the word, help us to create a better Earth for the next Generation. Make an Impact, Try picking up trash or Watering a tree."
        const titleText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 120, 'Congrats!', {
            fontSize: '48px',
            fontFamily: "'Press Start 2P', cursive", // Use your game's font
            color: '#ff0000', // Red color for the title
            stroke: '#ffffff', // White stroke for outline
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5, 0.5); // Center the text

        const desText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 70, 'you have reached the end of our game.', {
            fontSize: '14px',
            fontFamily: "'Press Start 2P', cursive", 
            color: '#ffffff', 
            align: 'center'
        }).setOrigin(0.5, 0.5); // Center the text
        
        const Text = this.add.text(this.game.config.width / 2, this.game.config.height / 2 , text, {
            fontSize: '14px',
            fontFamily: "'Press Start 2P', cursive", 
            color: '#ffffff', 
            wordWrap: { width: 550, useAdvancedWrap: true },
            align: 'center'
        }).setOrigin(0.5, 0.5); // Center the text

        const Text3 = this.add.text(this.game.config.width / 2, this.game.config.height / 2 +50, 'YOU ACTIONS MATTER!', {
            fontSize: '14px',
            fontFamily: "'Press Start 2P', cursive", // Use your game's font
            color: '#ffffff', // Red color for the title
            align: 'center'
        }).setOrigin(0.5, 0.5); // Center the text

    }

    async displayScore() {
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;
    
        // Display Final Score
        this.scoreText = this.add.text(windowX, windowY + 120, `Final Score: ${window.globalGameData.score}`, {
            fontSize: '16px',
            fontFamily: "'Press Start 2P', cursive", // Use your game's font
            color: '#ffffff',
            stroke: '#000000', // Black stroke for outline
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5, 0.5);
    
        // Fetch the highest score asynchronously
        const highestScore = await getHighscore(window.globalGameData.username);
    
        // Display Highest Score
        this.highscoreText = this.add.text(windowX, windowY +100, `Your Highest Score: ${highestScore !== null ? highestScore : 0}`, {
            fontSize: '16px',
            fontFamily: "'Press Start 2P', cursive", // Use your game's font
            color: '#ffffff',
            stroke: '#000000', // Black stroke for outline
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5, 0.5);
    }
    

    createButtons() {
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;
        const buttonSpacing = 150; // Adjust the spacing between buttons as needed
    
        // Home Button
        this.homeButton = this.add.image(windowX - buttonSpacing / 2, windowY + 115, 'homeButton')
            .setOrigin(0.5, 0)
            .setInteractive()
            .setDisplaySize(200, 100) // Scale it down
            .on('pointerdown', () => this.goToHomeScreen())
            .on('pointerover', () => this.homeButton.setTint(0xcccccc)) // Hover effect
            .on('pointerout', () => this.homeButton.clearTint()); // Reset color
    
        // Scoreboard Button
        this.scoreboardButton = this.add.image(windowX + buttonSpacing / 2, windowY + 135, 'scoreboardButton')
            .setOrigin(0.5, 0)
            .setInteractive()
            .setDisplaySize(150, 50) // Scale it down
            .on('pointerdown', () => this.goToScoreboardScreen())
            .on('pointerover', () => this.scoreboardButton.setTint(0xcccccc)) // Hover effect
            .on('pointerout', () => this.scoreboardButton.clearTint()); // Reset color
    }
    
    goToScoreboardScreen() {
        this.scene.start('ScoreboardScreen', { previousScreen: this.scene.key }); // Navigate to the Scoreboard screen
    }

    goToHomeScreen() {
        window.globalGameData.username = '';
        window.globalGameData.score = 0;
        window.globalGameData.level = 1;
        this.scene.start('HomeScreen');
    }
}

export default FinalScreen;

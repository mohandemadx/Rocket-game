import { getHighscore } from '../firebase/firebase.js';

class GameOverScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScreen' });
    }

    preload() {
        // Load button assets
        this.load.image('restartButton', 'assets/restart.png'); // Add your asset path
        this.load.image('homeButton', 'assets/home.png'); // Add your asset path
    }

    create() {
        this.createBackground();
        this.createWindow();
        this.displayTitle();
        this.displayScore();
        this.createButtons();
    }

    createBackground() {
        this.cameras.main.setBackgroundColor('#2d2d2d'); // Dark background
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
        const titleText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 100, 'Game Over', {
            fontSize: '48px',
            fontFamily: "'Press Start 2P', cursive", // Use your game's font
            color: '#ff0000', // Red color for the title
            stroke: '#ffffff', // White stroke for outline
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5, 0.5); // Center the text
    }

    async displayScore() {
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;
    
        // Display Final Score
        this.scoreText = this.add.text(windowX, windowY + 60, `Final Score: ${window.globalGameData.score}`, {
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
        this.highscoreText = this.add.text(windowX, windowY +20, `Your Highest Score: ${highestScore !== null ? highestScore : 0}`, {
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
        const windowHeight = 400;

        // Restart Button
        this.restartButton = this.add.image(windowX - 120, windowY + 60, 'restartButton')
            .setOrigin(0.5, 0)
            .setInteractive()
            .setDisplaySize(200, 100) // Scale it down
            .on('pointerdown', () => this.restartGame())
            .on('pointerover', () => this.restartButton.setTint(0xcccccc)) // Hover effect
            .on('pointerout', () => this.restartButton.clearTint()); // Reset color

        // Home Button
        this.homeButton = this.add.image(windowX + 120, windowY + 60, 'homeButton')
            .setOrigin(0.5, 0)
            .setInteractive()
            .setDisplaySize(200, 100) // Scale it down
            .on('pointerdown', () => this.goToHomeScreen())
            .on('pointerover', () => this.homeButton.setTint(0xcccccc)) // Hover effect
            .on('pointerout', () => this.homeButton.clearTint()); // Reset color
    }

    restartGame() {
        window.globalGameData.score = 0;
        this.scene.start('MainGame');  
    }

    goToHomeScreen() {
        window.globalGameData.username = '';
        window.globalGameData.score = 0;
        window.globalGameData.level = 1;
        this.scene.start('HomeScreen');
    }
}

export default GameOverScreen;

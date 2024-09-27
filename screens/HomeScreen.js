class HomeScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScreen' });
    }

    preload() {
        this.load.image('startButton', 'assets/start_game.png');
        this.load.image('background', 'assets/home_screen.png');
    }

    create() {
        // Initialize global variables (if needed)
        window.globalGameData.username = '';  // Reset or set default values
        window.globalGameData.score = 0;
        window.globalGameData.level = 1;

        this.setupBackground();
        this.createStartButton();
    }

    setupBackground() {
        // BACKGROUND
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.game.config.width, this.game.config.height); 
    }

    createStartButton() {
        const startButton = this.add.image(this.game.config.width / 2, this.game.config.height - 100, 'startButton').setInteractive();
        startButton.setScale(0.5);

        // Handle button click
        startButton.on('pointerdown', () => this.startGame());
        startButton.on('pointerover', () => this.onButtonHover(startButton, 0.55));
        startButton.on('pointerout', () => this.onButtonHover(startButton, 0.5));
    }

    startGame() {
        this.scene.start('InfoScreen');
    }

    onButtonHover(button, scale) {
        button.setScale(scale); // Adjust the scale of the button
    }
}

export default HomeScreen;

class GameInfo extends Phaser.Scene {
    constructor() {
        super({ key: 'GameInfo' });
    }

    preload() {
        this.load.image('background', 'assets/home_screen.png');
        this.load.image('nextButton', 'assets/next.png'); 
        this.load.image('saveEarth', 'assets/saveEarth.png'); 
    }

    create() {
        this.currentTextIndex = 0;
        this.setupBackground();
        this.createWindow();
        this.createTextDisplay();
        this.createButtons();
        
        // Keyboard shortcuts
        this.input.keyboard.on('keydown-ENTER', () => this.showNextText());
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('HomeScreen');  // Switch to the HomeScreen scene
        });
    }

    setupBackground() {
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.game.config.width, this.game.config.height); 
        background.setTint(0x888888); // SET TINT

        this.cameras.main.setBackgroundColor('#2d2d2d');  // Dark background
    }

    createWindow() {
        const windowWidth = 600;
        const windowHeight = 400;
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;

        this.window = this.add.rectangle(windowX, windowY, windowWidth, windowHeight, 0x000000)
            .setStrokeStyle(4, 0xffffff);
    }

    createTextDisplay() {
        this.textArray = [
            "Our planet is running a fever.",
            "Human activities, from burning fossil fuels to deforestation,",
            "are pumping greenhouse gases into the atmosphere,",
            "trapping heat and causing global temperatures to rise.",
            "This warming is triggering a cascade of consequences,",
            "from melting glaciers and rising sea levels",
            "to more extreme weather events like hurricanes, droughts, and wildfires.",
            "Come with us and help save our planet earth!",
        ];

        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;

        this.textDisplay = this.add.text(windowX, windowY, this.textArray[this.currentTextIndex], {
            fontSize: '32px',
            color: '#ffffff',
            wordWrap: { width: 530, useAdvancedWrap: true },
            align: 'center'
        });

        this.textDisplay.setOrigin(0.5, 0.5);  // Centered in both directions
    }

    createButtons() {
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;
        const windowHeight = 400;

        // Next button using an image
        this.nextButton = this.add.image(windowX, windowY + (windowHeight / 2) - 100, 'nextButton')
            .setOrigin(0.5) // Center the image
            .setInteractive()
            .setScale(0.35); // Scale down to desired size (adjust as necessary)

        // Add pointer down event for the Next button
        this.nextButton.on('pointerdown', () => this.showNextText());

        this.nextButton.on('pointerover', () => {
            this.nextButton.setScale(0.4); // Scale up on hover
        }); 
        this.nextButton.on('pointerout', () => {
            this.nextButton.setScale(0.35); // Reset scale when not hovering
        });
    }

    showNextText() {
        if (this.currentTextIndex < this.textArray.length - 2) {
            // If not the last text, increment index and update text
            this.currentTextIndex++;
            this.textDisplay.setText(this.textArray[this.currentTextIndex]);
        } 
        else if (this.currentTextIndex === this.textArray.length - 2) {

            this.textDisplay.setText(this.textArray[this.textArray.length - 1]);
            // Replace 'nextButton' with 'saveEarth' button on the last text
            this.nextButton.destroy(); // Remove the old 'next' button
    
            // Add the 'saveEarth' button
            this.nextButton = this.add.image(this.game.config.width / 2, this.game.config.height / 2 + (400 / 2) - 100, 'saveEarth')
                .setOrigin(0.5)
                .setInteractive()
                .setScale(0.35);
    
            // Apply hover effect to the new button
            this.applyHoverEffect(this.nextButton);
    
            // Add functionality for starting the game
            this.startGameAfterUsername();
        }
    }

    applyHoverEffect(button) {
        button.on('pointerover', () => {
            button.setScale(0.4); // Scale up on hover
        });
        button.on('pointerout', () => {
            button.setScale(0.35); // Reset scale when not hovering
        });
    }

    startGameAfterUsername() {
        // Remove the button's listeners to avoid duplicates
        this.nextButton.removeAllListeners('pointerdown');
    
        // Add new functionality for starting the game
        this.nextButton.on('pointerdown', () => {
            // Start the main game scene
            this.scene.start('MainGame');
        });
        this.nextButton.on('pointerover', () => {
            this.nextButton.setScale(0.4); // Scale up on hover
        }); 
        this.nextButton.on('pointerout', () => {
            this.nextButton.setScale(0.35); // Reset scale when not hovering
        });
    }
}

export default GameInfo;

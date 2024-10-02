class InfoScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'InfoScreen' });
    }

    preload() {
        this.load.image('background', 'assets/home_screen.png');
        this.load.image('nextButton', 'assets/next.png'); // Load the next button asset
    }

    create() {
        this.currentTextIndex = 0;
        this.setupBackground();
        this.createWindow();
        this.createTextDisplay();
        this.createButtons();

        // Create input for username
        this.createUsernameInput();
        
        // Keyboard shortcuts
        this.input.keyboard.on('keydown-ENTER', () => this.showNextText());
        this.input.keyboard.on('keydown-ESC', () => {
            this.shutdown();  // Clean up input fields
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
            "Welcome to Envo Rockets!",
            "Use left and right arrow keys to move.",
            "Press the spacebar to shoot.",
            "Good luck and have fun!"
        ];

        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;

        this.textDisplay = this.add.text(windowX, windowY, this.textArray[this.currentTextIndex], {
            fontSize: '32px',
            color: '#ffffff',
            wordWrap: { width: 550, useAdvancedWrap: true },
            align: 'center',
            lineSpacing: 3,
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
        if (this.currentTextIndex < this.textArray.length - 1) {
            this.currentTextIndex++;
            this.textDisplay.setText(this.textArray[this.currentTextIndex]);
        } 
        else {
            // When the last text is shown, remove the text, change the button and show the username input
            this.textDisplay.setText(''); // Clear the text
            this.nextButton.setVisible(true); // Show the Next button
            this.nextButton.setPosition(this.game.config.width / 2, this.game.config.height / 2 + 100); // Adjust position

            // Show the input for the username
            this.showUsernameInput();

            // Change button functionality to start the game after entering username
            this.nextButton.removeAllListeners('pointerdown'); // Remove old listeners
            this.nextButton.on('pointerdown', () => {
                const username = this.usernameInput.value;
                if (username) {
                    // Save the username to the global variable
                    window.globalGameData.username = username;

                    this.shutdown(); // Clean up input fields
                    this.scene.start('ScoreboardScreen'); // Start the MainGame scene (username is now global)
                } else {
                    alert('Please enter a username.');
                }
            });
        }
    }

    createUsernameInput() {
        // Create a styled HTML input element but hide it initially
        this.usernameInput = document.createElement('input');
        this.usernameInput.type = 'text';
        this.usernameInput.placeholder = 'Enter your username';
        this.usernameInput.style.position = 'absolute';
        this.usernameInput.style.top = `${this.game.config.height / 2 - 50}px`; // Adjusted top value
        this.usernameInput.style.left = `${this.game.config.width / 2 - 150}px`;
        this.usernameInput.style.width = '300px';
        this.usernameInput.style.height = '40px';
        this.usernameInput.style.fontSize = '16px';
        this.usernameInput.style.fontFamily = "'Press Start 2P', cursive"; // Matching the game's font
        this.usernameInput.style.color = '#ffffff'; // White text
        this.usernameInput.style.backgroundColor = '#333333'; // Dark background
        this.usernameInput.style.border = '2px solid #ff0000'; // Red border to match theme
        this.usernameInput.style.padding = '10px';
        this.usernameInput.style.textAlign = 'center'; // Centered text
        this.usernameInput.style.borderRadius = '10px'; // Rounded corners
        this.usernameInput.style.display = 'none'; // Initially hidden
        document.body.appendChild(this.usernameInput);
    }

    showUsernameInput() {
        // Show the username input
        this.usernameInput.style.display = 'block';
    }

    shutdown() {
        // Remove input when transitioning to the next scene
        this.usernameInput.remove();
    }
}

export default InfoScreen;

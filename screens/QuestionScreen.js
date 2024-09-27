class QuestionScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'QuestionScreen' });
        this.hasSelected = false; // Track if the user has already selected an option
        this.questionIndex = -1;
        this.questions = [
            "What is deforestation?",
            "Why are forests important for the environment?", 
            "How does deforestation contribute to climate change?",
            "What are some of the consequences of climate change?",
            "How can we help to reduce deforestation and its impact on climate change?"
        ];
        this.answersList = [
            [
                { text: 'A: The process of planting new trees in a cleared area.', correct: false },
                { text: 'B: The cutting down of trees in a large area.', correct: true },
                { text: 'C: The natural death of trees in a forest.', correct: false },
            ], 
            [
                { text: 'A: Forests provide habitats for animals.', correct: false },
                { text: 'B: Forests help to absorb carbon dioxide from the atmosphere.', correct: false },
                { text: 'C: Both A and B.', correct: true },
            ],
            [
                { text: 'A: By releasing stored carbon dioxide into the atmosphere.', correct: true },
                { text: "B: By reducing the Earth's ability to reflect sunlight.", correct: false },
                { text: 'C: By increasing the amount of water vapor in the atmosphere.', correct: false },
            ],
            [
                { text: 'A: Rising sea levels, more extreme weather events, and loss of biodiversity.', correct: true },
                { text: "B: Increased rainfall, colder temperatures, and healthier ecosystems.", correct: false },
                { text: 'C: Fewer natural disasters, cleaner air, and longer growing seasons.', correct: false },
            ],
            [
                { text: 'A: By using less paper and wood products.', correct: false },
                { text: "B: By supporting sustainable forestry practices.", correct: false },
                { text: 'C: Both A and B.', correct: true },
            ]
        ];
    }

    preload() {
        this.load.image('background', 'assets/home_screen.png');
        this.load.image('nextButton', 'assets/next.png');
    }

    create() {
        this.setupQuestionIndex();
        this.hasSelected = false; // reset
        this.createBackground();
        this.createQuestionWindow();
        this.createOptions();
        this.createNextButton();
    }

    setupQuestionIndex() {
        this.questionIndex = (this.questionIndex + 1) % this.questions.length; // next question
    }

    createBackground() {
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.game.config.width, this.game.config.height);
        background.setTint(0x888888);
    }

    createQuestionWindow() {
        const windowWidth = 800;
        const windowHeight = 400;
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;

        this.window = this.add.rectangle(windowX, windowY, windowWidth, windowHeight, 0x000000)
            .setStrokeStyle(4, 0xffffff);

        // Display the question
        this.questionText = this.add.text(windowX, windowY - 120, this.questions[this.questionIndex], {
            fontSize: '32px',
            fontStyle: 'bold', // Bold the font
            color: '#ffffff',
            wordWrap: { width: 750, useAdvancedWrap: true },
            align: 'center',
        }).setOrigin(0.5);

        // Explanation text
        this.explanationText = this.add.text(windowX, windowY + 150, '', {
            fontSize: '20px',
            color: '#ffffff',
            wordWrap: { width: 750, useAdvancedWrap: true },
            align: 'center'
        }).setOrigin(0.5);
    }

    createOptions() {
        this.options = this.answersList[this.questionIndex];
        const windowY = this.game.config.height / 2;

        this.options.forEach((option, index) => {
            const yPosition = windowY - 40 + index * 60; // Positioning the choices
            const optionText = this.add.text(this.game.config.width / 2, yPosition, option.text, {
                fontSize: '24px',
                color: '#ffffff',
                wordWrap: { width: 750, useAdvancedWrap: true },
                align: 'center'
            }).setOrigin(0.5).setInteractive();

            // Add pointer down event for each option
            optionText.on('pointerdown', () => this.selectOption(option, optionText));
            option.textRef = optionText; // Store the option text for later reference
        });
    }

    createNextButton() {
        const windowX = this.game.config.width / 2;
        const windowY = this.game.config.height / 2;
        const windowWidth = 800;
        const windowHeight = 400;

        // Use the loaded image for the Next button
        this.nextButton = this.add.image(windowX + (windowWidth / 2) - 70, windowY - (windowHeight / 2) + 40, 'nextButton')
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false) // Hide initially
            .setScale(0.2);

        // Add pointer down event for Next button
        this.nextButton.on('pointerdown', () => {
            this.scene.start('MainGame'); // Change to your actual next scene
        });
        this.nextButton.on('pointerover', () => {
            this.nextButton.setScale(0.25); // Scale up on hover
        }); 
        this.nextButton.on('pointerout', () => {
            this.nextButton.setScale(0.2); // Reset scale when not hovering
        });
    }

    selectOption(option, optionText) {
        if (this.hasSelected) return; // Prevent further selections

        this.hasSelected = true; // Mark that an option has been selected

        if (option.correct) {
            optionText.setColor('#00ff00'); // Green for correct
            this.explanationText.setText('Correct!');

            window.globalGameData.score += 5; // Update global score
            this.showFloatingScore("+5"); // Show floating score effect

        } else {
            optionText.setColor('#ff0000'); // Red for wrong
            this.options.forEach(opt => {
                if (opt.correct) {
                    opt.textRef.setColor('#00ff00'); // Green for the correct answer
                }
            });
            this.explanationText.setText('Incorrect.');
        }

        // Disable all options to prevent further selections
        this.options.forEach(opt => {
            opt.textRef.setInteractive(false); // Disable all options
        });

        // Show the Next button
        this.nextButton.setVisible(true); // Show the button
    }

    // VISUAL EFFECT FOR CORRECT ANSWERS
    showFloatingScore(scoreText) {
        const text = this.add.text(this.game.config.width / 2, this.game.config.height / 2, scoreText, {
            fontSize: '32px',
            color: '#00ff00', // Color for the score
            fontStyle: 'bold',
            align: 'center',
        }).setOrigin(0.5);

        // Create a tween animation for the floating effect
        this.tweens.add({
            targets: text,
            y: text.y - 100, // Move it upwards
            alpha: 0, // Fade out
            duration: 1000, // Duration of the animation
            ease: 'Power1', // Easing function
            onComplete: () => {
                text.destroy(); // Remove the text after the animation is complete
            },
        });
    }
}

export default QuestionScreen;

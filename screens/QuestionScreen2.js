class QuestionScreen2 extends Phaser.Scene {
    constructor() {
        super({ key: 'QuestionScreen2' });
        this.hasSelected = false; // Track if the user has already selected an option
        this.questionIndex = -1;
        this.questions = [
            "What is pollution?",
            "What are the main types of pollution?", 
            "How does air pollution affect human health?",
            "What are the consequences of water pollution?",
            "How can we reduce pollution and protect the environment?"
        ];
        this.answersList = [
            [
                { text: 'A: The process of cleaning up the environment.', correct: false },
                { text: 'B: The introduction of harmful substances into the environment.', correct: true },
                { text: 'C: The natural process of decomposition.', correct: false },
            ], 
            [
                { text: 'A: Air, water, and land pollution.', correct: false },
                { text: 'B: Noise, light, and visual pollution.', correct: false },
                { text: 'C: All of the above.', correct: true },
            ],
            [
                { text: 'A: It can cause respiratory problems, heart disease, and cancer.', correct: true },
                { text: "B: It can lead to improved mental health and increased energy levels.", correct: false },
                { text: 'C: It has no significant impact on human health.', correct: false },
            ],
            [
                { text: 'A: Contaminated drinking water, harm to aquatic life, and destruction of ecosystems.', correct: true },
                { text: "B: Cleaner water, healthier fish populations, and improved water quality.", correct: false },
                { text: 'C: Increased rainfall, higher water levels, and more flooding.', correct: false },
            ],
            [
                { text: 'A: By recycling, conserving energy, and reducing waste.', correct: true },
                { text: "B: By using more harmful chemicals and polluting industries.", correct: false },
                { text: 'C: By ignoring environmental concerns and focusing on economic growth.', correct: false },
            ]
        ];
    }

    preload() {
        this.load.image('background', 'assets/home_screen.png');
        this.load.image('nextButton', 'assets/next.png');
    }

    create() {
        this.username = window.globalGameData.username;
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
            if(window.globalGameData.level <= 5){
                this.scene.start('MainGame2');
            }
            else{
                window.globalGameData.level = 1;
                this.time.delayedCall(200, async () => {
                    // Fetch the highscore for the current user
                    const highscore = await getHighscore(this.username);
            
                    // Check if the current score is higher than the stored highscore
                    if (window.globalGameData.score > highscore) {
                        // Save the new highscore for this user
                        await saveScore(this.username, undefined, undefined, window.globalGameData.score);
                    }
                });
                this.scene.start('FinalScreen');
            }
            
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

export default QuestionScreen2;

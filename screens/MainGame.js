import { saveScore, getHighscore } from '../firebase/firebase.js';

class MainGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGame' });
        this.lives = 3; // Initialize lives
        this.LEVEL_NUM = 5 //NUM OF LEVELS
        this.isPaused = false; // Initialize pause state
    }

    preload() {
        // Load assets
        this.load.image('spaceship', 'assets/spaceship.png');  
        this.load.image('gameBackground', 'assets/background.jpg');  
        this.load.image('target', 'assets/tree.png');
        this.load.image('projectile', 'assets/water.png');
        this.load.image('pauseButton', 'assets/pause.png');
        this.load.image('heart', 'assets/heart.png');
    }

    create() {
        this.username = window.globalGameData.username;

        this.targetNumber = window.globalGameData.level*7; // Total number of targets
        this.targetsRemaining = this.targetNumber;

        this.resetGame(); // Reset game state

        // Background setup
        this.createBackground();

        // Spaceship setup
        this.createSpaceship();

        // Ground and targets setup
        this.createGround();
        this.createTargets();

        // UI elements (score, lives, pause button)
        this.createUI();

        // Setup input and controls
        this.setupControls();

        // Pause menu (initially hidden)
        this.createPauseMenu();

        // SHORTCUT TO PAUSE
        this.input.keyboard.on('keydown-P', this.togglePause, this);

    }

    resetGame() {
        // Reset game variables
        this.lives = 3;
    }

    createBackground() {
        const background = this.add.image(0, 0, 'gameBackground').setOrigin(0, 0);
        background.setDisplaySize(this.game.config.width, this.game.config.height);
    }

    createSpaceship() {
        this.spaceship = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 100, 'spaceship');
        this.spaceship.setDisplaySize(786 / 12, 1366 / 12);
        this.spaceship.setCollideWorldBounds(true); // Prevent spaceship from leaving the screen
    }

    createGround() {
        this.ground = this.physics.add.staticGroup();
        const groundWidth = this.game.config.width;
        this.ground.create(groundWidth / 2, this.game.config.height - 10, 'target')
            .setScale(groundWidth / 50, 1)
            .refreshBody()
            .setAlpha(0); // Make ground invisible
    }

    createTargets() {
        this.targets = this.physics.add.group();

        // Spawn targets every second, up to the target number
        this.spawnTimer = this.time.addEvent({
            delay: 1000,
            repeat: this.targetNumber - 1,
            callback: () => {
                this.spawnTarget();
            },
            callbackScope: this,
        });

        // Detect collisions between targets and the ground
        this.physics.add.collider(this.targets, this.ground, this.targetHitsGround, null, this);
    }

    spawnTarget() {
        const target = this.targets.create(
            Phaser.Math.Between(80, this.game.config.width), // Random X position
            Phaser.Math.Between(0, 50), // Random Y position
            'target'
        );

        const targetType = Phaser.Math.Between(1, 3);
        target.setDisplaySize(100 * targetType, 100 * targetType); // Set size based on type
        target.setVelocityY(50 / targetType); // Set speed based on type
        target.health = targetType; // Set health based on type
        target.body.immovable = true;
    }

    createUI() {
        // Score Text
        this.scoreText = this.add.text(this.game.config.width - 50, 50, `Score: ${window.globalGameData.score}`, { 
            fontSize: '16px', 
            fontFamily: "'Press Start 2P', cursive", 
            fill: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 2,
        }).setOrigin(1, 0).setDepth(10); // Align to the right
    
        // Lives (with heart images)
        this.livesContainer = this.add.container(10, this.game.config.height - 40); // Create a container for the hearts
        this.updateLives(3); // Initialize with 3 lives (you can change this based on your game logic)
    
        // Level Text
        this.levelText = this.add.text(this.game.config.width / 2, 20, `LEVEL: ${window.globalGameData.level}`, { 
            fontSize: '32px', 
            fontFamily: "'Press Start 2P', cursive", 
            fill: '#ffd700', 
            stroke: '#000000', 
            strokeThickness: 3,
        }).setOrigin(0.5, 0).setDepth(10); // Center the text
    
        // Pause button (for pausing the game)
        this.pauseButton = this.add.image(80, 50, 'pauseButton').setInteractive();
        this.pauseButton.on('pointerdown', this.togglePause, this);
        this.pauseButton.setScale(0.2).setDepth(10);

        // VISUAL EFFECT
        this.pauseButton.on('pointerover', () => {
            this.pauseButton.setScale(0.25); // Scale up on hover
        }); 
        this.pauseButton.on('pointerout', () => {
            this.pauseButton.setScale(0.2); // Reset scale when not hovering
        });
    }
    
    
    updateLives(lives) {
        this.livesContainer.removeAll(true); // Clear existing hearts
        for (let i = 0; i < lives; i++) {
            const heart = this.add.image(i * 40 +20, 5, 'heart').setOrigin(0.5, 0.5).setScale(0.2); // Adjust the size as needed
            this.livesContainer.add(heart); // Add heart to the container
        }
    }
    

    setupControls() {
        // Enable input for keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Spacebar to shoot
        this.input.keyboard.on('keydown-SPACE', this.shoot, this);
    
        // Touch controls for mobile
        // this.leftButton = this.add.text(50, this.game.config.height - 100, '←', {
        //     fontSize: '32px',
        //     fill: '#fff',
        //     backgroundColor: '#000'
        // }).setInteractive();
    
        // this.rightButton = this.add.text(150, this.game.config.height - 100, '→', {
        //     fontSize: '32px',
        //     fill: '#fff',
        //     backgroundColor: '#000'
        // }).setInteractive();
    
        // this.shootButton = this.add.text(this.game.config.width - 100, this.game.config.height - 100, 'Shoot', {
        //     fontSize: '32px',
        //     fill: '#fff',
        //     backgroundColor: '#000'
        // }).setInteractive();
    
        // Touch events for movement
        // this.leftButton.on('pointerdown', () => {
        //     this.spaceship.setVelocityX(-500);
        // });
    
        // this.rightButton.on('pointerdown', () => {
        //     this.spaceship.setVelocityX(500);
        // });
    
        // this.leftButton.on('pointerup', () => {
        //     this.spaceship.setVelocityX(0);
        // });
    
        // this.rightButton.on('pointerup', () => {
        //     this.spaceship.setVelocityX(0);
        // });
    
        // // Touch event for shooting
        // this.shootButton.on('pointerdown', this.shoot, this);
    }    

    createPauseMenu() {
        this.pauseText = this.add.text(
            this.game.config.width / 2, 
            this.game.config.height / 2, 
            'Game Paused\nPress P to Resume', 
            { fontSize: '32px', fill: '#fff', align: 'center' }
        ).setOrigin(0.5).setVisible(false); // Initially hidden
    }

    togglePause() {
        this.isPaused = !this.isPaused; // Toggle pause state
        this.physics.world.isPaused = this.isPaused; // Pause physics
        this.spawnTimer.paused = this.isPaused;
        this.pauseText.setVisible(this.isPaused); // Show/hide pause text
    }

    shoot() {
        const projectile = this.physics.add.sprite(this.spaceship.x, this.spaceship.y - 20, 'projectile');
        projectile.setScale(0.25);
        projectile.setVelocityY(-400); // Move projectile upwards
        this.physics.add.collider(projectile, this.targets, this.hitTarget, null, this);
    }

    hitTarget(projectile, target) {
        projectile.destroy(); // Destroy the projectile

        // Reduce target's health
        target.health--;
        if (target.health <= 0) {
            this.flashTarget(target);
            target.destroy();
            this.updateScore(); // Increase score and update display
            
            this.targetsRemaining--; //Decrease Targets Remaining

            // Check if all targets have been destroyed
            if (this.targetsRemaining === 0) {
                this.levelComplete();
            }

        } else {
            this.flashTarget(target); // Flash effect when hit but not destroyed
        }
    }

    async levelComplete() {
        if(window.globalGameData.level <= this.LEVEL_NUM){
            window.globalGameData.level++;
            await saveScore(this.username, window.globalGameData.score, window.globalGameData.le, window.globalGameData.score);

            this.scene.start('QuestionScreen');
        }
    }

    flashTarget(target) {
        target.setTint(0x14B5FF); // Change color to blue on hit
        this.time.delayedCall(100, () => {
            target.clearTint(); // Clear tint after a short delay
        });
    }

    targetHitsGround(target) {
        // Skip already hit targets
        if (target.hit) return;

        target.hit = true;
        this.flashTarget(target); // Visual effect on hit
        this.time.delayedCall(200, () => target.destroy()); // Destroy the target after a delay

        this.loseLife(); // Handle life loss
    }

    loseLife() {
        this.lives--; // Decrease lives
        this.updateLives(this.lives); // Update lives display
        this.targetsRemaining--; //Decrease Targets Remaining

        // Check if all targets have been destroyed
        if (this.targetsRemaining === 0 && this.lives != 0) {
            this.levelComplete();
        }

        if (this.lives === 0) {
            this.endGame(); // Transition to Game Over if lives run out
        }
    }

    async endGame() {
        try {
            const highscore = await getHighscore(this.username);
        
            if (window.globalGameData.score > highscore) {
                
                await saveScore(this.username, window.globalGameData.score, window.globalGameData.le, window.globalGameData.score);
                
            }
            this.scene.start('GameOverScreen');
        } catch (error) {
            console.error('Error during endGame processing:', error);
        }
    }
    
    
    updateScore() {
        window.globalGameData.score++;
        this.scoreText.setText('Score: ' + window.globalGameData.score); // Update score display
    }

    update() {
        // Stop movement initially
        this.spaceship.setVelocityX(0);

        // Move spaceship left or right
        if (this.cursors.left.isDown) {
            this.spaceship.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.spaceship.setVelocityX(500);
        }
    }
}

export default MainGame; // Exporting MainGame class
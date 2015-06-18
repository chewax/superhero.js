/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/EnemyBase.ts"/>
/// <reference path="../character/EnemyManager.ts"/>
/// <reference path="../utils/Debug.ts"/>
/// <reference path="../config/Config.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>
/// <reference path="../obstacles/ObstacleManager.ts"/>
/// <reference path="../collectables/Collectables.ts"/>
/// <reference path="../collectables/CollectableManager.ts"/>


module Superhero {

    export class Intro extends Phaser.State {

        hero: Superhero.Hero;
        background: Phaser.TileSprite;

        paralax1: Phaser.TileSprite;
        paralax2: Phaser.TileSprite;
        //paralax3: Phaser.TileSprite;
        paralax4: Phaser.TileSprite;
        paralax5: Phaser.TileSprite;
        spaceShip1: Phaser.Sprite;
        spaceShip2: Phaser.Sprite;

        musicEnabled: boolean;
        fxEnabled: boolean;


        //debug: Superhero.Debug;
        ui: Superhero.UI;
        theme: Phaser.Sound;
        obstacleManager: Obstacles.ObstacleManager;
        enemyManager: Superhero.EnemyManager;
        collectableManager: Collectables.CollectableManager;
        levelID: string = "Intro";
        enemyFace: Phaser.Sprite;
        heroFace: Phaser.Sprite;
        boots: Phaser.Sprite;
        factoryEnd: Phaser.Sprite;
        heroText: Phaser.Text;
        enemyText: Phaser.Text;
        heroTextBoxGraphic: Phaser.Graphics;
        enemyTextBoxGraphic: Phaser.Graphics;
        bootsCollected: boolean = false;
        playerCanInteract: boolean = true;
        skipIntroButton: Phaser.Sprite;

        pcFireButton: Phaser.Key;
        pcNukeButton: Phaser.Key;
        pcWarpButton: Phaser.Key;
        pcBombButton: Phaser.Key;

        cursors: Phaser.CursorKeys;
        tutorialImages: Phaser.Sprite[];
        currentTutorialImage: Phaser.Sprite;

        preload () {

        }

        create () {

            this.fxEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
            this.musicEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;

            //Setup Physics Engine
            this.configurePhysics();

            //Configure Base Stage Options
            this.setBaseStage();
            this.configureInput();
            this.setActors("herowalking");
            this.startMusic();
            this.setEnemyManager();
            this.setIntroScene();

            //this.debug = new Debug(this.game);
        }

        update () {
            //Collisions
            this.checkForCollisions();

            //Updates
            this.hero.update();

            this.enemyManager.update();
            this.ui.update();
            //this.debug.update();

            //Obstacles
            this.obstacleManager.update();

            this.checkPCInput();
        }

        configurePhysics():void {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = (<Superhero.Game> this.game).conf.PHYSICS.global.gravity.y;
        }


        setBaseStage():void {
            this.paralax1 = this.game.add.tileSprite(0,0,1800,600, 'starfield');
            this.paralax1.autoScroll(-10,0);

            this.paralax2 = this.game.add.tileSprite(0,0,3600,600, 'planets');
            this.paralax2.autoScroll(-30,0);

            this.spaceShip1 = this.game.add.sprite(0, 0, "spaceShipBackground1");
            this.spaceShip2 = this.game.add.sprite(this.spaceShip1.width, 0, "spaceShipBackground2");

            this.game.physics.arcade.enable(this.spaceShip1);
            this.spaceShip1.body.velocity.x = -200;

            this.game.physics.arcade.enable(this.spaceShip2);
            this.spaceShip2.body.velocity.x = -200;

            this.paralax5 = this.game.add.tileSprite(0,this.world.height-25,this.world.width,this.world.height-25, 'steel', 'floor_c');
            this.paralax5.autoScroll(-200,0);
            this.game.physics.arcade.enable(this.paralax5);
            this.paralax5.body.immovable = true;
            this.paralax5.physicsType =  Phaser.SPRITE;

            //Setup Obstacle
            this.obstacleManager = new Obstacles.ObstacleManager(this.game, 800);

            this.initCollectables();
        }

        private  setEnemyManager(): void {
            // Setup enemy manager
            this.enemyManager = new Superhero.EnemyManager(this.game, this.levelID);
        }

        initCollectables(): void {
            this.collectableManager = new Collectables.CollectableManager(this.game);
        }


        configureInput(): void {
            // Create Gamepad using the plugin
            (<Superhero.Game> this.game).gamepad = new Gamepads.GamePad(this.game, Gamepads.GamepadType.GESTURE_BUTTON, Gamepads.ButtonPadType.FOUR_FAN);
            (<Superhero.Game> this.game).gamepad.touchInput.touchType = Gamepads.TouchInputType.TOUCH;
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.type = Gamepads.ButtonType.SINGLE_THEN_TURBO;
            // Disable buttons
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.type = Gamepads.ButtonType.SINGLE;
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.type = Gamepads.ButtonType.SINGLE;
            (<Superhero.Game> this.game).gamepad.buttonPad.button4.type = Gamepads.ButtonType.SINGLE_THEN_TURBO;

            this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () { event.preventDefault(); }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () { event.preventDefault(); }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () { event.preventDefault(); }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () { event.preventDefault(); }, this);

            this.pcFireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.pcNukeButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.pcWarpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            this.pcBombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C);

            this.cursors = this.game.input.keyboard.createCursorKeys();
        }

        setActors(assetKey: string = "hero1"): void {
            this.hero = new Hero(this.game, assetKey);
            this.hero.sprite.body.gravity.y = 1500;
            this.hero.sprite.body.drag = 0;
            this.hero.sprite.body.height -= 15;
            this.hero.setIdleCallback(this.hero.run);

            // Set gamepad callbacks
            (<Superhero.Game> this.game).gamepad.touchInput.onTouchDownCallback = this.hero.jump.bind(this.hero);

            (<Superhero.Game> this.game).gamepad.buttonPad.button1.setOnPressedCallback(this.hero.fire, this.hero);

            // BUTTON2
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.sprite.alpha = 0.3;
            // BUTTON 3
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.sprite.alpha = 0.3;
            // BUTTON 4
            (<Superhero.Game> this.game).gamepad.buttonPad.button4.sprite.alpha = 0.3;

            this.hero._state = new Superhero.StateRun(this.game,this.hero);
            this.hero._state.enterState();

            this.ui = new Superhero.UI(this.game, this.hero);

            this.skipIntroButton = this.game.add.sprite(this.game.width - 162, 8, "skipIntro");
            this.skipIntroButton.inputEnabled = true;
            this.skipIntroButton.events.onInputDown.add(this.finishLevel, this);
        }

        setIntroScene(): void {
            this.game.time.events.add((Phaser.Timer.SECOND * 2), this.showTutorial, this);
            //this.game.time.events.add(Phaser.Timer.SECOND * 20, this.spawnMiniBoss, this);
        }

        showTutorial(): void {
            this.tutorialImages = [];

            this.paralax5.stopScroll();
            this.spaceShip1.body.velocity.x = 0;
            this.spaceShip2.body.velocity.x = 0;

            this.hero.sprite.animations.paused = true;
            (<Superhero.StateRun>this.hero._state).isMoving = false;
            this.hero.sprite.animations.play("stopWalking");

            if (this.game.device.desktop) this.showDesktopTutorial();
            else this.showTouchTutorial();
        }

        startSlideShow(): void {
            if (this.currentTutorialImage) this.currentTutorialImage.destroy();
            if (this.enemyTextBoxGraphic) this.enemyTextBoxGraphic.destroy();

            this.currentTutorialImage = this.tutorialImages.pop();
            if (!this.currentTutorialImage) {
                this.paralax5.autoScroll(-200,0);
                this.spaceShip1.body.velocity.x = -200;
                this.spaceShip2.body.velocity.x = -200;

                this.hero.sprite.animations.paused = false;
                (<Superhero.StateRun>this.hero._state).isMoving = true;
                this.hero.sprite.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.hero.sprite.key]["idleAnimation"]);

                (<Superhero.StateRun>this.hero._state).isMoving = false;
                this.game.time.events.add(Phaser.Timer.SECOND * 4.5, this.spawnMiniBoss, this);
                return;
            }
            this.currentTutorialImage.x = 150;
            this.currentTutorialImage.y = 150;
            this.currentTutorialImage.visible = true;

            this.enemyTextBoxGraphic = this.game.add.graphics(0, 0);
            this.enemyTextBoxGraphic.lineStyle(2, 0xdb6607, 1);
            this.enemyTextBoxGraphic.beginFill(0x000000, 0.8);
            this.enemyTextBoxGraphic.drawRect(120, 120, this.currentTutorialImage.width + 60, this.currentTutorialImage.height + 60);
            this.enemyTextBoxGraphic.endFill();

            this.game.world.bringToTop(this.currentTutorialImage);

            this.game.time.events.add((Phaser.Timer.SECOND * 4.5), this.startSlideShow, this);
        }

        showDesktopTutorial(): void {
            var pic1 = this.game.add.sprite(0,0,'tut_pc_jump');
            var pic2 = this.game.add.sprite(0,0,'tut_pc_pups');
            var pic3 = this.game.add.sprite(0,0,'tut_pc_fire');
            var pic4 = this.game.add.sprite(0,0,'tut_pc_move');

            // To correctly use array.pop()
            this.tutorialImages = [pic4, pic3, pic2, pic1];
            this.tutorialImages.forEach( function(pic){
                pic.visible = false;
                //pic.scale = 0.6;
            },this);

            this.startSlideShow();
        }

        showTouchTutorial(): void {
            var pic1 = this.game.add.sprite(0,0,'tut_touch_move');
            var pic2 = this.game.add.sprite(0,0,'tut_touch_jump');
            var pic3 = this.game.add.sprite(0,0,'tut_touch_fire');

            // To correctly use array.pop()
            this.tutorialImages = [pic3, pic2, pic1];
            this.tutorialImages.forEach( function(pic){
                pic.visible = false;
                //pic.scale = 0.6;
            },this);

            this.startSlideShow();
        }

        spawnMiniBoss(): void {
            if(this.enemyManager.totalEnemiesAlive() < 2) {
                this.enemyManager.spawnCustomEnemy("miniBoss");
                this.spaceShip1.body.velocity.x = 0;
                this.spaceShip2.body.velocity.x = 0;
                this.paralax5.stopScroll();
                this.hero.sprite.animations.paused = true;
                (<Superhero.StateRun>this.hero._state).isMoving = false;
                this.hero.sprite.animations.play("stopWalking");
                this.game.time.events.add(Phaser.Timer.SECOND * 1, this.displayTextScene1, this);
            }
        }

        spawnTwoHandedEnemy(): void {
            if(this.enemyManager.totalEnemiesAlive() < 2) {
                this.enemyManager.spawnCustomEnemy("twoHandedWeapon");
            }
        }

        displayTextScene1() {
            // Set up scene

            // Text boxes
            // Enemy
            this.enemyTextBoxGraphic = this.game.add.graphics(0, 0);
            this.enemyTextBoxGraphic.lineStyle(2, 0x0000FF, 1);
            this.enemyTextBoxGraphic.beginFill(0x000000, 0.8);
            this.enemyTextBoxGraphic.drawRect(100, 10, this.game.world.width - 300, 200);
            this.enemyTextBoxGraphic.endFill();

            // Enemy
            this.enemyFace = this.game.add.sprite(this.game.world.width - 270, 70, "introScene", "enemy1");
            this.enemyFace.anchor.setTo(0.5, 0);
            this.enemyFace.scale.setTo(0.5);
            this.enemyFace.animations.add("introScene",["enemy1", "enemy2", "enemy3", "enemy4", "enemy3", "enemy2"], 60, true, false);
            this.enemyFace.animations.play("introScene", 4, true, false);

            var style = { font: "30px saranaigamebold", fill: "#ffffff", align: 'left', wordWrap: true, wordWrapWidth: 650 };
            this.enemyText = this.game.add.text(410, 100, "You shall not pass :P", style);

            this.playerCanInteract = true;

            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene2, this);
        }


        displayTextScene2(): void {
            // Hero
            this.heroTextBoxGraphic = this.game.add.graphics(0, 0);
            this.heroTextBoxGraphic.lineStyle(2, 0x0000FF, 1);
            this.heroTextBoxGraphic.beginFill(0x000000, 0.8);
            this.heroTextBoxGraphic.drawRect(40, 250, this.game.world.width - 300, 200);
            this.heroTextBoxGraphic.endFill();
            // Face
            this.heroFace = this.game.add.sprite(100, 300, "introScene", "hero1");
            this.heroFace.anchor.setTo(0.5, 0);
            this.heroFace.scale.setTo(0.5);
            this.heroFace.animations.add("introScene",["hero1", "hero2", "hero3", "hero4", "hero3", "hero2"], 60, true, false);
            this.heroFace.animations.play("introScene", 10, true, false);
            var style = { font: "30px saranaigamebold", fill: "#ffffff", align: 'left', wordWrap: true, wordWrapWidth: 650 };
            this.enemyText.setText("");
            this.heroText = this.game.add.text(220, 330, "Watch N See", style);
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene3, this);
        }

        displayTextScene3(): void {
            this.heroText.setText("");
            this.enemyText.x = 220;
            this.enemyText.y -= 20;
            this.enemyText.setText("Why don't you talk with my friend here...");
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene4, this);
        }

        displayTextScene4(): void {
            this.heroText.setText("");
            this.enemyText.y += 20;
            this.enemyText.setText("I'm pretty sure that you'll solve the issue... Bye");
            this.spawnTwoHandedEnemy();
            this.enemyManager.enemiesAlive[1].shield = 20;
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene5, this);
        }

        displayTextScene5(): void {
            this.enemyManager.enemiesAlive[0].shield = 0;
            this.enemyManager.enemiesAlive[0].die(this.enemyManager.enemiesAlive[0].sprite);
            this.enemyText.destroy();
            this.heroText.setText("So, you seem to be a nice guy...");
            this.enemyTextBoxGraphic.destroy();
            this.enemyFace.kill();
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene6, this);
        }

        displayTextScene6(): void {
            this.heroText.destroy();
            this.heroTextBoxGraphic.destroy();
            this.heroFace.kill();
            this.enemyManager.enemiesAlive[0].fireEnabled = true;
            (<Superhero.StateEnemyHostile>this.enemyManager.enemiesAlive[0]._state).patrol(spawnEnemyPosition.DOWN);
            this.enemyManager.enemiesAlive[0].shield = 3;
            this.enemyManager.enemiesAlive[0].sprite.events.onKilled.add(function(s) {
                this.generateBoots();
            }, this);
        }

        generateBoots(): void {
            // Boots
            this.playerCanInteract = false;
            (<Superhero.StateRun>this.hero._state).isMoving = true;
            this.hero.sprite.animations.paused = false;
            this.hero.sprite.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.hero.sprite.key]["idleAnimation"])
            this.spaceShip1.body.velocity.x = -200;
            this.spaceShip2.body.velocity.x = -200;
            this.paralax5.autoScroll(-200,0);
            this.bootsCollected = false;
            this.boots = this.game.add.sprite(this.game.world.width, this.game.world.height - 85, "introScene", "boots1");
            this.boots.anchor.setTo(0.5, 0);
            this.boots.scale.setTo(0.7);
            this.boots.animations.add("introScene",["boots1", "boots2", "boots3", "boots2"], 60, true, false);
            this.boots.animations.add("introCollected",["noBoots"], 6, true, false);
            this.boots.animations.play("introScene", 10, true, false);
            this.game.physics.arcade.enable(this.boots);
            this.boots.body.enable = true;
            this.boots.body.velocity.x = -200;
            (<Superhero.Game> this.game).gamepad.touchInput.inputDisable();
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.sprite.inputEnabled = false;
            this.world.bringToTop(this.hero.sprite);
        }

        collectBoots(): void {
            this.bootsCollected = true;
            this.boots.animations.play("introCollected");
            if ((<Superhero.Game> this.game).conf.ISMUSICENABLED) {
                var takeOffSound = this.game.sound.add("heroTakeOff", 0.6, false);
                takeOffSound.play();
            }
            var actualCoor = {x: this.hero.sprite.x, y: this.hero.sprite.y};
            this.hero.sprite.x = -100;
            this.hero.sprite.y = -150;
            this.hero.sprite.body.enable = false;
            this.setActors();
            this.hero.sprite.x = actualCoor.x;
            this.hero.sprite.y = actualCoor.y;
            this.hero._state = new Superhero.StateIntroFly(this.game,this.hero);
            this.hero._state.enterState();
            this.hero.sprite.body.collideWorldBounds = false;
            this.game.physics.arcade.enable(this.paralax5);
            this.game.time.events.add(2650, this.stopGroundParalax, this);

            this.game.time.events.add(Phaser.Timer.SECOND * 9, this.finishLevel, this);
        }

        stopGroundParalax(): void {
            this.paralax5.stopScroll();
            this.paralax5.body.velocity.x = -200;
        }

        finishLevel(): void {
            this.game.sound.stopAll();
            // Persist first time played
            (<Superhero.Game> this.game).conf.FIRSTTIMEPLAYING = false;
            localStorage.setItem('superhero.conf', JSON.stringify((<Superhero.Game> this.game).conf));
            // Start level 1
            this.game.state.start('Level1', true, false);
        }

        startMusic () :void{
            if((<Superhero.Game> this.game).conf.ISMUSICENABLED) {
                if (this.theme) this.theme.destroy();
                this.theme = this.game.add.audio('introTheme', 0.5, true);
                this.theme.play();
            }
        }

        checkPCInput(){
            if(this.playerCanInteract) {
                if (this.pcFireButton.isDown) this.hero.fire();
                if (this.pcNukeButton.isDown) this.hero.fireNuke();
                if (this.pcWarpButton.isDown) this.hero.fireWarp();
                if (this.pcBombButton.isDown) this.hero.fireRocket();

                if (this.cursors.up.isDown && this.hero.sprite.body.touching.down) {
                    var speed = {x: 0, y: 0};
                    if (this.cursors.up.isDown) speed.y = -800;
                    this.hero.move(speed);
                }
            }
        }

        checkForCollisions(): void {

            this.hero.collideWithObject(this.paralax5);

            var enemies = this.enemyManager.enemies;

            enemies.forEach((enmy) =>
                    this.hero.diesWithGroup(enmy.bullets)
            );


            this.obstacleManager.collidesWith(this.hero.sprite);
            this.obstacleManager.diesWith(this.hero.bullets, this.killWall, this);
            this.obstacleManager.diesWith(this.hero.rockets, this.killWall, this);


            enemies.forEach((enmy) => {
                enmy.collideWithObject(enmy.shadow);
                enmy.diesWithGroup(this.hero.bullets);
                enmy.diesWithGroup(this.hero.rockets);
                this.obstacleManager.diesWith(enmy.bullets, this.killWall, this);

            });

            this.collectableManager.checkCollectedBy(this.hero);

            if(this.boots && !this.bootsCollected) {
                this.game.physics.arcade.overlap(this.hero.sprite, this.boots, this.collectBoots, null, this);
            }
        }


        killWall(bullet:Phaser.Sprite, wall:Phaser.Sprite): void {


            if (bullet.frameName == 'bullet1'){
                bullet.kill();
                //If contains the word grey
                if (wall.frameName.indexOf("grey") > -1) {
                    return
                }

            }

            wall.kill();


            //if (wall.frameName.indexOf("grey") > -1) {
            //    if (bullet.frameName == 'bullet1'){
            //        return
            //    }
            //};

            //one out of 20 must drop something
            this.collectableManager.spawnCollectable(wall.position.x, wall.position.y);
            this.obstacleManager.particleBurst(wall);
            //this.ui.scoreUp(50);
        }

        shutdown() {
            this.game.world.removeAll();
        }
    }
}

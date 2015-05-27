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

        musicEnabled: boolean;
        fxEnabled: boolean;


        debug: Superhero.Debug;
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

            this.debug = new Debug(this.game);
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

            //if (this.game.input.keyboard.addKey(Phaser.Keyboard.P).isDown){
            //    this.game.paused != this.game.paused
            //}
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


            this.paralax4 = this.game.add.tileSprite(0,0,this.world.width,this.world.height, 'steeltile');
            this.paralax4.autoScroll(-200,0);


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
        }

        setIntroScene(): void {
            this.game.time.events.add(Phaser.Timer.SECOND * 9, this.spawnMiniBoss, this);
        }

        spawnMiniBoss(): void {
            if(this.enemyManager.totalEnemiesAlive() < 2) {
                this.enemyManager.spawnCustomEnemy("miniBoss");
                this.paralax1.stopScroll();
                this.paralax2.stopScroll();
                this.paralax4.stopScroll();
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
            this.heroText = this.game.add.text(220, 330, "Watch and see", style);
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene3, this);
        }

        displayTextScene3(): void {
            this.heroText.setText("");
            this.enemyText.x = 220;
            this.enemyText.setText("Why don't you talk with my friend here...");
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene4, this);
        }

        displayTextScene4(): void {
            this.heroText.setText("");
            this.enemyText.setText("I'm pretty sure that you'll solve the issue...Bye");
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
            (<Superhero.StateRun>this.hero._state).isMoving = true;
            this.hero.sprite.animations.paused = false;
            this.enemyManager.enemiesAlive[0].fireEnabled = true;
            (<Superhero.StateEnemyHostile>this.enemyManager.enemiesAlive[0]._state).patrol(spawnEnemyPosition.DOWN);
            this.enemyManager.enemiesAlive[0].shield = 3;
            this.enemyManager.enemiesAlive[0].sprite.events.onKilled.add(function(s) {
                this.generateBoots();
            }, this);

            this.hero.sprite.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.hero.sprite.key]["idleAnimation"])
            this.paralax1.autoScroll(-10,0);
            this.paralax2.autoScroll(-30,0);
            this.paralax4.autoScroll(-200,0);
            this.paralax5.autoScroll(-200,0);
        }

        generateBoots(): void {
            // Boots
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
            this.game.physics.arcade.enable(this.paralax4);
            this.paralax4.body.checkWorldBounds = true;
            this.paralax4.body.outOfBoundsKill = true;
            this.paralax4.stopScroll();
            this.paralax4.body.velocity.x = -300;
            this.factoryEnd = this.game.add.sprite(this.paralax4.x + this.paralax4.width, 0, "factoryEnd");
            this.world.sendToBack(this.factoryEnd);
            this.world.sendToBack(this.paralax2);
            this.world.sendToBack(this.paralax1);
            this.game.physics.arcade.enable(this.factoryEnd);
            this.factoryEnd.body.velocity.x = -300;
            this.game.time.events.add(Phaser.Timer.SECOND * 9, this.finishLevel, this);
        }

        finishLevel(): void {
            this.game.sound.stopAll();
            this.game.state.start('Level1', true, false);
        }

        startMusic () :void{
            if((<Superhero.Game> this.game).conf.ISMUSICENABLED) {
                if (this.theme) this.theme.destroy();
                this.theme = this.game.add.audio('introTheme', 0.5, true);
                this.theme.play();
            }
            /*this.theme = this.game.add.audio('theme', 1, true);
            if (this.musicEnabled) this.theme.play();*/
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

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
        paralax3: Phaser.TileSprite;
        paralax4: Phaser.TileSprite;
        paralax5: Phaser.TileSprite;


        debug: Superhero.Debug;
        //ui: Superhero.UI;
        theme: Phaser.Sound;
        obstacleManager: Obstacles.ObstacleManager;
        enemyManager: Superhero.EnemyManager;
        collectableManager: Collectables.CollectableManager;
        levelID: string = "Intro";
        enemyFace: Phaser.Sprite;
        heroFace: Phaser.Sprite;
        boots: Phaser.Sprite;

        preload () {

        }

        create () {
            //Setup Physics Engine
            this.configurePhysics();

            //Configure Base Stage Options
            this.setBaseStage();
            this.configureInput();
            this.setActors();
            //this.startMusic();
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
            //this.ui.update();
            //this.debug.update();

            //Obstacles
            this.obstacleManager.update();

            //if (this.game.input.keyboard.addKey(Phaser.Keyboard.P).isDown){
            //    this.game.paused != this.game.paused
            //}
        }

        configurePhysics():void {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = (<Superhero.Game> this.game).conf.PHYISICS.global.gravity.y;
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

            //this.game.world.bringToTop(this.heroFace);
            //Setup Obstacle
            this.obstacleManager = new Obstacles.ObstacleManager(this.game, 800);
            //this.obstacleManager.addObstacleToPool(Obstacles.ObstacleType.WALL);
            //this.obstacleManager.addObstacleToPool(Obstacles.ObstacleType.METEORITE_SHOWER);

            this.initCollectables();
        }

        private  setEnemyManager(): void {
            // Setup enemy manager
            this.enemyManager = new Superhero.EnemyManager(this.game, this.levelID);
        }

        initCollectables(): void {
            this.collectableManager = new Collectables.CollectableManager(this.game);
            /*this.collectableManager.addCollectable(Collectables.CollectableType.IMPROVE_FIRE);
            this.collectableManager.addCollectable(Collectables.CollectableType.IMPROVE_SHIELD);
            this.collectableManager.addCollectable(Collectables.CollectableType.NUKE_BOMB);
            //this.collectableManager.addCollectable(Collectables.CollectableType.TIME_WARP);
            //this.collectableManager.addCollectable(Collectables.CollectableType.DIAMOND);
            this.collectableManager.addCollectable(Collectables.CollectableType.BOMB);
            //this.collectableManager.addCollectable(Collectables.CollectableType.IMMUNITY);
            this.collectableManager.addCollectable(Collectables.CollectableType.LIVES);*/
        }


        configureInput(): void {
            // Create Gamepad using the plugin
            (<Superhero.Game> this.game).gamepad = new Gamepads.GamePad(this.game, Gamepads.GamepadType.GESTURE_BUTTON, Gamepads.ButtonPadType.FOUR_FAN);
            (<Superhero.Game> this.game).gamepad.touchInput.touchType = Gamepads.TouchInputType.TOUCH;
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.type = Gamepads.ButtonType.SINGLE_THEN_TURBO;
            // Diable buttons
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.type = Gamepads.ButtonType.SINGLE;
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.type = Gamepads.ButtonType.SINGLE;
            (<Superhero.Game> this.game).gamepad.buttonPad.button4.type = Gamepads.ButtonType.SINGLE_THEN_TURBO;
        }

        setActors(): void {
            this.hero = new Hero(this.game, "herowalking");
            this.hero.sprite.body.gravity.y = 1500;
            this.hero.sprite.body.drag = 0;
            this.hero.sprite.body.height -= 15;
            this.hero.setIdleCallback(this.hero.run);

            // Set gamepad callbacks
            (<Superhero.Game> this.game).gamepad.touchInput.onTouchDownCallback = this.hero.jump.bind(this.hero);

            (<Superhero.Game> this.game).gamepad.buttonPad.button1.setOnPressedCallback(this.hero.fire, this.hero);

            // BUTTON2
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.setOnPressedCallback(this.hero.fireNuke, this.hero);
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.customCanTriggerCallback = (function():boolean {return this.hero.nukes>0}).bind(this);
            //
            //// BUTTON 3
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.customCanTriggerCallback = (function():boolean {return this.hero.timeWarps>0}).bind(this);
            //
            //// BUTTON 4
            (<Superhero.Game> this.game).gamepad.buttonPad.button4.setOnPressedCallback(this.hero.fireRocket, this.hero);

            this.hero._state = new Superhero.StateRun(this.game,this.hero);
            this.hero._state.enterState();

            //this.ui = new Superhero.UI(this.game, this.hero);
        }

        setIntroScene() {
            // Set up scene
            // Hero
            this.heroFace = this.game.add.sprite(100, 300, "introScene", "hero1");
            this.heroFace.anchor.setTo(0.5, 0);
            this.heroFace.scale.setTo(0.5);
            this.heroFace.animations.add("introScene",["hero1", "hero2", "hero3", "hero4", "hero3", "hero2"], 60, true, false);
            this.heroFace.animations.play("introScene", 10, true, false);
            // Enemy
            this.enemyFace = this.game.add.sprite(this.game.world.width - 270, 70, "introScene", "enemy1");
            this.enemyFace.anchor.setTo(0.5, 0);
            this.enemyFace.scale.setTo(0.5);
            this.enemyFace.animations.add("introScene",["enemy1", "enemy2", "enemy3", "enemy4", "enemy3", "enemy2"], 60, true, false);
            this.enemyFace.animations.play("introScene", 4, true, false);
            // Boots
            this.boots= this.game.add.sprite(this.game.world.width - 350, this.game.world.height - 85, "introScene", "boots1");
            this.boots.anchor.setTo(0.5, 0);
            this.boots.scale.setTo(0.7);
            this.boots.animations.add("introScene",["boots1", "boots2", "boots3", "boots2"], 60, true, false);
            this.boots.animations.play("introScene", 10, true, false);
        }

        startMusic () :void{
            this.theme = this.game.add.audio('theme', 1, true);
            this.theme.play();
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

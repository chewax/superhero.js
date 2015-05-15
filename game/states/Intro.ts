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
        ui: Superhero.UI;
        theme: Phaser.Sound;
        obstacleManager: Obstacles.ObstacleManager;
        enemyManager: Superhero.EnemyManager;
        collectableManager: Collectables.CollectableManager;
        levelID: string = "level1";

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

            //this.paralax3 = this.game.add.tileSprite(0,0,3600,600, 'meteos');
            //this.paralax3.autoScroll(-400,0);s


            this.paralax4 = this.game.add.tileSprite(0,0,this.world.width,this.world.height, 'steeltile');
            this.paralax4.autoScroll(-200,0);


            this.paralax5 = this.game.add.tileSprite(0,this.world.height-80,this.world.width,this.world.height-80, 'steel', 'floor_c');
            this.paralax5.autoScroll(-200,0);

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
            this.collectableManager.addCollectable(Collectables.CollectableType.IMPROVE_FIRE);
            this.collectableManager.addCollectable(Collectables.CollectableType.IMPROVE_SHIELD);
            this.collectableManager.addCollectable(Collectables.CollectableType.NUKE_BOMB);
            //this.collectableManager.addCollectable(Collectables.CollectableType.TIME_WARP);
            //this.collectableManager.addCollectable(Collectables.CollectableType.DIAMOND);
            this.collectableManager.addCollectable(Collectables.CollectableType.BOMB);
            //this.collectableManager.addCollectable(Collectables.CollectableType.IMMUNITY);
            this.collectableManager.addCollectable(Collectables.CollectableType.LIVES);

        }


        configureInput(): void {
            (<Superhero.Game> this.game).gamepad = new Gamepads.GamePad(this.game, Gamepads.GamepadType.STICK_BUTTON, Gamepads.ButtonPadType.FOUR_FAN);
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.type = Gamepads.ButtonType.CUSTOM;
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.type = Gamepads.ButtonType.CUSTOM;
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.enableCooldown(30);
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.type = Gamepads.ButtonType.CUSTOM;
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.enableCooldown(10);
            (<Superhero.Game> this.game).gamepad.buttonPad.button4.type = Gamepads.ButtonType.CUSTOM;
            (<Superhero.Game> this.game).gamepad.stick1.settings.topSpeed = 600;
        }

        setActors(): void {
            this.hero = new Hero(this.game);
            this.ui = new Superhero.UI(this.game, this.hero);
        }


        startMusic () :void{
            this.theme = this.game.add.audio('theme', 1, true);
            this.theme.play();
        }

        checkForCollisions(): void {

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
            this.ui.scoreUp(50);
        }

    }
}

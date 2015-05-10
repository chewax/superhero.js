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

    export class Level1 extends Phaser.State {

        hero: Superhero.Hero;
        background: Phaser.TileSprite;
        paralax1: Phaser.TileSprite;
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
            this.startMusic();
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

            // Setup paralax layer
            this.paralax1 = this.game.add.tileSprite(0,0,1800,600, 'starfield');
            this.paralax1.autoScroll(-100,0);

            //Setup Obstacle
            this.obstacleManager = new Obstacles.ObstacleManager(this.game, 2500);
            //this.obstacleManager.addObstacleToPool(Obstacles.ObstacleType.WALL);
            this.obstacleManager.addObstacleToPool(Obstacles.ObstacleType.METEORITE_SHOWER);

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
            this.collectableManager.addCollectable(Collectables.CollectableType.TIME_WARP);
            this.collectableManager.addCollectable(Collectables.CollectableType.DIAMOND);
            this.collectableManager.addCollectable(Collectables.CollectableType.BOMB);
            this.collectableManager.addCollectable(Collectables.CollectableType.IMMUNITY);
        }


        configureInput(): void {
            (<Superhero.Game> this.game).gamepad = new Gamepads.GamePad(this.game, Gamepads.GamepadType.STICK_BUTTON, Gamepads.ButtonPadType.ONE_FIXED);
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.type = Gamepads.ButtonType.CUSTOM;
            (<Superhero.Game> this.game).gamepad.stick1.settings.topSpeed = 600;
        }

        setActors(): void {
            this.hero = new Hero(this.game);
            this.ui = new Superhero.UI(this.game, this.hero);
        }


        startMusic () :void{
            if((<Superhero.Game> this.game).conf.ISMUSICENABLED) {
                this.theme = this.game.add.audio('theme', 1, true);
                this.theme.play();
            }
        }

        checkForCollisions(): void {

            var enemies = this.enemyManager.enemies;

            enemies.forEach((enmy) =>
                this.hero.diesWithGroup(enmy.bullets)
            );

            this.obstacleManager.collidesWith(this.hero.sprite);
            this.obstacleManager.diesWith(this.hero.bullets, this.killWall, this);


            enemies.forEach((enmy) => {
                enmy.collideWithObject(enmy.shadow);
                enmy.diesWithGroup(this.hero.bullets);
                this.obstacleManager.diesWith(enmy.bullets, this.killWall, this);
            });

            this.collectableManager.checkCollectedBy(this.hero);

        }


        killWall(bullet:Phaser.Sprite, wall:Phaser.Sprite): void {

            bullet.kill();

            //If contains the word grey
            if (wall.frameName.indexOf("grey") > -1) return;

            //one out of 20 must drop something
            this.collectableManager.spawnCollectable(wall.position.x, wall.position.y);

            wall.kill();

            this.obstacleManager.particleBurst(wall);
            this.ui.scoreUp(50);
        }

    }
}

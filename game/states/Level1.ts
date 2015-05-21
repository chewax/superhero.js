/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/EnemyBase.ts"/>
/// <reference path="../character/EnemyManager.ts"/>
/// <reference path="../character/TentacleBot.ts"/>
/// <reference path="../character/TwoHandedWeapon.ts"/>
/// <reference path="../character/MiniBoss.ts"/>
/// <reference path="../character/SmallMissileEnemy.ts"/>
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
            this.startUI();
        }

        startUI(){
            this.ui = new Superhero.UI(this.game, this.hero);
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

            //if (this.game.input.keyboard.addKey(Phaser.Keyboard.P).onUp){
            //    this.game.paused = this.game.paused? false : true;
            //}
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
            this.obstacleManager = new Obstacles.ObstacleManager(this.game, 800);
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
            //this.collectableManager.addCollectable(Collectables.CollectableType.DIAMOND);
            this.collectableManager.addCollectable(Collectables.CollectableType.BOMB);
            //this.collectableManager.addCollectable(Collectables.CollectableType.IMMUNITY);
            this.collectableManager.addCollectable(Collectables.CollectableType.LIVES);
        }


        configureInput(): void {
            (<Superhero.Game> this.game).gamepad = new Gamepads.GamePad(this.game, Gamepads.GamepadType.STICK_BUTTON, Gamepads.ButtonPadType.FOUR_FAN);
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.type = Gamepads.ButtonType.SINGLE_THEN_TURBO;
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.type = Gamepads.ButtonType.SINGLE;
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.enableCooldown(30);
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.type = Gamepads.ButtonType.SINGLE;
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.enableCooldown(10);
            (<Superhero.Game> this.game).gamepad.buttonPad.button4.type = Gamepads.ButtonType.SINGLE_THEN_TURBO;
            (<Superhero.Game> this.game).gamepad.stick1.settings.topSpeed = 600;
        }

        setActors(): void {
            this.hero = new Hero(this.game);
            this.hero.setRespawnDelay(2000);
            this.ui = new Superhero.UI(this.game, this.hero);


            (<Superhero.Game> this.game).gamepad.buttonPad.button1.setOnPressedCallback(this.hero.fire, this.hero);
            // BUTTON2
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.setOnPressedCallback(this.hero.fireNuke, this.hero);
            (<Superhero.Game> this.game).gamepad.buttonPad.button2.customCanTriggerCallback = (function():boolean {return this.hero.nukes>0 && this.hero.sprite.alive}).bind(this);

                // BUTTON 3
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.setOnPressedCallback(this.hero.fireWarp, this.hero);
            (<Superhero.Game> this.game).gamepad.buttonPad.button3.customCanTriggerCallback = (function():boolean {return this.hero.timeWarps>0 && this.hero.sprite.alive}).bind(this);

                // BUTTON 4
            (<Superhero.Game> this.game).gamepad.buttonPad.button4.setOnPressedCallback(this.hero.fireRocket, this.hero);
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
            this.obstacleManager.diesWith(this.hero.rockets, this.killWall, this);

            enemies.forEach((enmy) => {
                enmy.diesWithGroup(this.hero.bullets);
                enmy.diesWithGroup(this.hero.rockets);
                this.obstacleManager.diesWith(enmy.bullets, this.killWallEnemy, this);
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

            var prevCombo = this.hero.comboLevel;
            this.hero.comboLevel += 0.1;

            if (Math.floor(this.hero.comboLevel) > Math.floor(prevCombo)) {
                this.ui.infoText.showComboText(this.hero.comboLevel);
            }



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


        killWallEnemy(bullet:Phaser.Sprite, wall:Phaser.Sprite): void {
            wall.kill();
            this.obstacleManager.particleBurst(wall);
        }

        render() {
            //this.game.debug.body(this.hero.sprite);
            //this.obstacleManager.obstacles[0].group.forEach(function(e){
            //    this.game.debug.body(e);
            //},this);
        }

        shutdown() {
            this.game.world.removeAll();
        }
    }
}

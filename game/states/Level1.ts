/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/Badie.ts"/>
/// <reference path="../utils/Debug.ts"/>
/// <reference path="../config/Config.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>
/// <reference path="../obstacles/Obstacles.ts"/>
/// <reference path="../collectables/Collectables.ts"/>


module Superhero {

    export class Level1 extends Phaser.State {

        hero: Superhero.Hero;
        badie: Superhero.Badie;
        background: Phaser.TileSprite;
        paralax1: Phaser.TileSprite;
        fuelPowerUps: Phaser.Group;
        debug: Superhero.Debug;
        ui: Superhero.UI;
        theme: Phaser.Sound;
        wall: Obstacles.WallObstacle;
        obstacleEmitter: Phaser.Particles.Arcade.Emitter;
        obstacleTimer: number;

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

            this.debug = new Debug(this.game);
            //this.game.time.events.add(this.game.rnd.integerInRange(5000, 20000), this.createPowerUp, this);

        }

        update () {
            //Collisions
            this.checkForCollisions();

            //Updates
            this.hero.update();
            this.badie.update();
            this.ui.update();
            this.debug.update();

            //Obstacles
            this.obstacleGenerator();
        }

        configurePhysics():void {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = (<Superhero.Game> this.game).conf.physics.global.gravity.y;
        }


        setBaseStage():void {

            //Setup paralax layer
            this.paralax1 = this.game.add.tileSprite(0,0,1800,600, 'starfield');
            this.paralax1.autoScroll(-100,0);

            //Setup Wall Obstacle
    	    this.wall = new Obstacles.WallObstacle(this.game);
            this.obstacleTimer = this.game.time.time;


            //Setup powerups
            this.setPowerUps();

            //Set obstacleEmitter
            this.setObstaclesEmitter();

        }


        configureInput(): void {
            (<Superhero.Game> this.game).gamepad = new Gamepads.GamePad(this.game, Gamepads.GamepadType.STICK_BUTTON, Gamepads.ButtonPadType.ONE_FIXED);
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.type = Gamepads.ButtonType.CUSTOM;
            (<Superhero.Game> this.game).gamepad.stick1.settings.topSpeed = 600;
        }

        setActors(): void {
            this.hero = new Hero(this.game);
            this.badie = new Badie(this.game);
            this.ui = new Superhero.UI(this.game, this.hero);
        }


        setPowerUps(): void {
            this.fuelPowerUps = this.game.add.group();
            this.fuelPowerUps.classType = Collectables.FuelPowerUps;
            this.fuelPowerUps.enableBody = true;
            this.fuelPowerUps.createMultiple(1,'heart');
        }


        createPowerUp(): void {
            this.game.time.events.add(this.game.rnd.integerInRange(5000, 20000), this.createPowerUp, this);
            var pu = this.fuelPowerUps.getFirstDead();

            if (pu) {
                pu.reset(this.game.world.width, this.game.world.centerY - 200);
                pu.resetFloatation();
            }
        }

        spawnPU(x:number, y:number): void {
            var pu = this.fuelPowerUps.getFirstDead();

            if (pu) {
                pu.reset(x, y);
                pu.resetFloatation(-100,true);
            }
        }

        startMusic () :void{
            this.theme = this.game.add.audio('theme', 1, true);
            this.theme.play();
        }

        checkForCollisions(): void {

            //this.hero.diesWithGroup(this.badie.bullets);

            this.hero.collideWithObject(this.hero.shadow);
            this.hero.collectsGroup(this.fuelPowerUps);

            this.hero.collideWithGroup(this.wall.upperObstacle.group);
            this.hero.collideWithGroup(this.wall.lowerObstacle.group);

            this.game.physics.arcade.overlap(this.wall.lowerObstacle.group, this.hero.bullets, this.killWall, null, this);
            this.game.physics.arcade.overlap(this.wall.upperObstacle.group, this.hero.bullets, this.killWall, null, this);

            this.badie.collideWithObject(this.badie.shadow);
            this.badie.diesWithGroup(this.hero.bullets);

        }

        obstacleGenerator(): void {
            var elapsedTime = this.game.time.elapsedSince(this.obstacleTimer);

            if (elapsedTime > 1500 ) {
                this.wall.resetAndRoll(30,-150);
                this.obstacleTimer = this.game.time.time;
            }
        }

        setObstaclesEmitter(): void {
            this.obstacleEmitter = this.game.add.emitter();
            this.obstacleEmitter.makeParticles('meteors', 'brown10');
            this.obstacleEmitter.gravity = 0;
        }

        particleBurst(pointer) {
            //  Position the emitter where the mouse/touch event was
            this.obstacleEmitter.x = pointer.x;
            this.obstacleEmitter.y = pointer.y;

            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter  is how many particles will be emitted in this single burst
            this.obstacleEmitter.start(true, 2000, null, 4);
        }

        killWall(wall:Phaser.Sprite, bullet:Phaser.Sprite):void{

            var wallX = wall.x;
            var wallY = wall.y;

            if (!(wall.frameName == "grey5")) {
                wall.kill();
                //one out of 20 must drop something
                if (this.game.rnd.integerInRange(0,20) == 10) this.spawnPU(wallX, wallY);
                this.ui.scoreUp(50);
                this.particleBurst(wall);
            }

            bullet.kill();
        }

    }
}

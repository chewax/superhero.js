/**
 * Character class.
 * Wraps the logic of creating and upating a character. Should be extended from
 * Hero and Badie
 */

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="CharStates.ts"/>
/// <reference path="../collectables/Collectables.ts"/>

module Superhero {

    export enum Facing {
        LEFT = -1,
        RIGHT = 1
    }

    export class Character {

        game: Phaser.Game;
        sprite: Phaser.Sprite;
        shieldSprite: Phaser.Sprite;
        bullets: Phaser.Group;
        rockets: Phaser.Group;

        shadow: Phaser.Sprite;
        fuel: number;
        maxFuel: number;
        shootDelay: number = 300;
        allowFingerMargin: boolean = true;

        // Power Ups
        firePower: number = 1;
        nukes: number = 0;
        timeWarps: number = 0;
        immunity: boolean = false;
        bombs: number = 0;
        shield: number = 0;
        lives: number = 3;

        // 1 Diamond == 10 Coins
        coins: number = 0;

        fuelTimer: number;
        bulletTimer: number;
        dieTimer: number;
        facing: Facing;
        _state: Superhero.CharState;

        bulletVelocity: number = 1000;
        floor: number;

        /**
         * Constructor. Creates the Character
         * @param {Phaser.Game} game     the instance of the game to wich it will be created
         * @param {string}      assetKey The name of the asset to which the character will be created
         * @param {number}      x        Initial X coordinate of the character
         * @param {number}      y        Initial Y coordinate of the character
         */
        constructor (game:Phaser.Game, assetKey:string, x:number, y:number) {

            this.game = game;
            this.floor = this.game.height - 80;
            this._state = new Superhero.StateIdle(game, this);
            this.facing = Facing.LEFT;
            this.allowFingerMargin = false;
            
            this.initSprite(assetKey,x,y);
            this.initPhysics();
            this.addAnimations();
            this.initBullets();
            this.startChar();
        }
        /**
         * Starts the character default behaviour
         */
        startChar(): void {
            this.fuel = 2000;
            this.maxFuel = 2000;
            this.fuelTimer = this.game.time.time;
            this.bulletTimer = this.game.time.time;
            this.sprite.play('flystill');
        }

        /**
         * Initializes the character sprite
         * @param {string} assetKey The name of the asset to which the character will be created
         * @param {number} x        Initial X coordinate of the character
         * @param {number} y        Initial Y coordinate of the character
         */
        initSprite (assetKey:string, x:number, y:number):void {
            this.sprite = this.game.add.sprite(x, y, assetKey, 'stand1');

            //TODO Deacrease sprite size not to use scale, or properly update boundaries
            this.sprite.anchor.setTo(0.5,0);
            this.sprite.scale.setTo((<Superhero.Game> this.game).conf.WORLD.sprite_scaling);
            this.sprite.checkWorldBounds = (<Superhero.Game> this.game).conf.PLAYERDIEOUTOFBOUNDS;
            this.sprite.outOfBoundsKill = (<Superhero.Game> this.game).conf.PLAYERDIEOUTOFBOUNDS;
        }

        /**
         * Initalizes the physics of the character
         */
        initPhysics ():void {
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;

            this.sprite.body.gravity.y = (<Superhero.Game> this.game).conf.PHYISICS.player.gravity.y;
            this.sprite.body.drag.x = (<Superhero.Game> this.game).conf.PHYISICS.player.drag;
            this.sprite.body.drag.y = (<Superhero.Game> this.game).conf.PHYISICS.player.drag;
            this.sprite.body.setSize(100,220);
        }
        /**
         * Wraps the left movement logic
         */
        moveLeft ():void{
            this.sprite.body.velocity.x = -500;
        }

        /**
         * Wraps the sprint logic
         */
        sprint () : void{
            this.sprite.play('fly');
            this.sprite.body.velocity.x = 800;
        }

        /**
         * Wraps the descend logic
         */
        descend (): void{
            if (this.sprite.y < this.floor - this.sprite.height) this.sprite.y += 5;
        }

        /**
         * Wraps the climb logic
         */
        climb (): void {
            this.sprite.body.velocity.y = -500;
        }

        /**
         * Wraps the mid air flight logic
         */
        flyStill (): void {
            if (this.sprite.animations.currentAnim.isFinished){
                this.sprite.play('flystill');
            }
        }

        move (speed:{x:number ; y:number}): void {
                if (this.allowFingerMargin && (this.sprite.x <= this.game.width / 2 && speed.x < 0)) speed.x = 0;

                this.sprite.body.velocity.x = speed.x;
                if (this.fuel) this.sprite.body.velocity.y = speed.y;
        }

        /**
         * Wraps the stop logic
         */
        stop (): void {
            this.sprite.animations.play('stop');
        }

        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        fire (): void {
                //Thou shalt only shoot if there is no shooting in progress
                if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {

                    //Check for shootRate
                    var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                    if (elapsedTime < this.shootDelay) return;

                    this.sprite.animations.play('shoot');

                    for (var i = 0; i < this.firePower; i++) {

                        //Get the first bullet that has gone offscreen
                        var bullet = this.bullets.getFirstDead();

                        //If there is none (all are still flying) create new one.
                        if (!bullet) bullet = this.bullets.create(-10, -10, 'bullets', 'bullet1');

                        bullet.anchor.setTo(0.5, 1);
                        bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + (10 * i + 1));
                        bullet.checkWorldBounds = true;
                        bullet.outOfBoundsKill = true;
                        bullet.body.velocity.x = this.bulletVelocity;
                        bullet.body.allowGravity = false;
                        bullet.scale.setTo(0.4);
                        //bullet.scale.setTo((<Superhero.Game> this.game).conf.WORLD.sprite_scaling);
                    }


                    //Reset the timer
                    this.bulletTimer = this.game.time.time;
                }
        }

        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        fireRocket (): void {

            if (this.bombs <= 0) return;

            //Thou shalt only shoot if there is no shooting in progress
            if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {

                //Check for shootRate
                var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                if (elapsedTime < this.shootDelay) return;

                this.sprite.animations.play('shoot');

                //Get the first bullet that has gone offscreen
                var rocket = this.rockets.getFirstDead();
                //If there is none (all are still flying) create new one.
                if (!rocket) rocket = this.rockets.create(-10, -10, 'bullets', 'bullet2');

                rocket.anchor.setTo(0.5, 1);
                rocket.reset(this.sprite.x + (this.facing * 40), this.sprite.y + this.sprite.height/2);
                rocket.checkWorldBounds = true;
                rocket.outOfBoundsKill = true;
                rocket.body.velocity.x = this.bulletVelocity;
                rocket.body.allowGravity = false;
                rocket.scale.setTo(0.6);
                //rocket.scale.setTo((<Superhero.Game> this.game).conf.WORLD.sprite_scaling);

                //Reset the timer
                this.bulletTimer = this.game.time.time;
                this.bombs -= 1;
            }
        }


        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        fireNuke (): void {

            if (this.nukes <= 0) return;

            //Thou shalt only shoot if there is no shooting in progress
            if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {

                //Check for shootRate
                var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                if (elapsedTime < this.shootDelay) return;

                var graphics = this.game.add.graphics(0,0);

                graphics.lineStyle(0);
                graphics.beginFill(0xFFFFFF, 1);
                var rect = graphics.drawRect(0,0,this.game.width, this.game.height);

                var nukeTween = this.game.add.tween(rect);
                nukeTween.to({alpha:0},1500);

                nukeTween.onComplete.add(function(){
                    graphics.destroy();
                },this);

                nukeTween.start();
                this.game.state.states.Level1.obstacleManager.killAll();
                this.game.state.states.Level1.enemyManager.killAll();

                //Reset the timer
                this.bulletTimer = this.game.time.time;
                this.nukes -= 1;
            }

        }

        /**
         * Adds the animations to the character
         */
        addAnimations (): void {

            this.sprite.animations.add('flystill',['stand1','stand2'], 8, true, false);
            this.sprite.animations.add('shoot',['shoot1','shoot2', 'shoot3', 'shoot4'], 10, false, false);
            this.sprite.animations.add('flywalk',['walk1','walk2'], 6, true, false);
            this.sprite.animations.add('fly',['fly1','fly2'], 8, true, false);
            this.sprite.animations.add('takehit',['hit1','hit2', 'hit3', 'hit4'], 4, false, false);
            this.sprite.animations.add('stop',['hit1'], 3, false, false);

            this.sprite.events.onAnimationComplete.add(function () {
                if(this.isAlive) {
                    this.sprite.animations.stop();
                    this.flyStill();
                }
            }, this);
        }

        /**
         * Creates bullets group and enable physics
         */
        initBullets (): void {
            // Create a bullet group with Arcade physics
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(4,'bullets','bullet1');

            this.rockets = this.game.add.group();
            this.rockets.enableBody = true;
            this.rockets.createMultiple(4,'bullets', 'bullet2');
        }

        //renderShield():void{
        //    this.shieldSprite = this.game.add.sprite(this.sprite.x + 20, this.sprite.y-40, 'enershield');
        //    this.shieldSprite.scale.setTo(0.2);
        //}
        /**
         * If it is flying, then decrease the fuel, if it is on the ground, slowly increase the fuel
         */
        updateFuel ():void {

            var elapsedTime = this.game.time.elapsedSecondsSince(this.fuelTimer);

            if (elapsedTime > 0.02) {

                this.fuelTimer = this.game.time.time;

                if (this.sprite.body.touching.down){
                    if (this.fuel < this.maxFuel) {
                        this.fuel += 1;

                    }
                } else {
                    if (this.fuel > 5) {
                        this.fuel -= 5;
                    } else {
                        this.fuel = 0;
                    }
                }
            }

        }

        //updateShield(){
        //    if (this.shieldSprite) {
        //        if (this.shieldSprite.alive) {
        //            this.shieldSprite.x = this.sprite.x + 20;
        //            this.shieldSprite.y = this.sprite.y;
        //        }
        //    }
        //}

        /**
         * Update method. Here should be all the logic related to the character's game loop
         */
        update (): void {
            //this.updateFuel();
            //this.updateShadow();
            //this.updateShield();
        }

        /**
         * Sets the bullet velocity to all subsequent shots
         * @param {number} n the new value to the bullet velocity
         */
        setBulletVelocity(n:number){
            this.bulletVelocity = n * this.facing;
        }

        /**
         * Sets collitions of the character with a group
         * @param {Phaser.Group} group Group upon wich the character should collide
         */
        collideWithGroup (group:Phaser.Group): void{
            this.game.physics.arcade.collide(group, this.sprite, null, null, this);
        }

        /**
         * Sets collection of the character with a group
         * @param {Phaser.Group} group Group that the character will collect
         */
        collectsGroup (group:Phaser.Group): void{
            this.game.physics.arcade.collide(group, this.sprite, this.collect, null, this);
        }

        /**
         * Sets the collitions of the character with an object
         * @param {Phaser.Sprite} object Object upon which the character sould collide
         */
        collideWithObject (object:Phaser.Sprite): void{
            this.game.physics.arcade.collide(object, this.sprite, null, null, this);
        }

        /**
         * Configures the Character to die upon colliding with a group
         * @param {Phaser.Group} group Group that will make the character die
         */
        diesWithGroup (group:Phaser.Group): void {
            this.game.physics.arcade.overlap(group, this.sprite, this.die, null , this);
        }

        /**
         * Configures the Character to die upon colliding with an object
         * @param {Phaser.Sprite} object Object that will make the character die
         */
        diesWithObject (object:Phaser.Sprite): void {
            this.game.physics.arcade.overlap(object, this.sprite, this.die, null, this);
        }

        /**
         * Callback method when the character collides with a deadly object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        die (char:Phaser.Sprite, object?:any) {
            var elapsedTime = this.game.time.elapsedSince(this.dieTimer);
            if (elapsedTime < 100) return;
            this.dieTimer = this.game.time.time;

            if((<Superhero.Game>this.game).conf.PLAYERISIMMORTAL && char.key == "hero1") {
                return;
            }

            if (object) object.kill();

            if (this.shield > 0) {
                this.shield -= 1;
                this.flickerSprite(0xFF0000);
                return;
            }

            if (this.lives > 1) {
                this.lives -= 1;
                this.dieReset();
                return
            }


            char.alive = false;

            if (this.bullets) this.bullets.forEachAlive(function(b){b.kill()},this);
            if (this.rockets) this.rockets.forEachAlive(function(r){r.kill()},this);

            char.play('takehit',4,false,true);

        }

        dieReset():void {
            this.sprite.reset(100,this.game.world.centerY);
            Utils.interval(this.flickerSprite.bind(this), 400, 5);
        }

        flickerSprite(color:number=0xFF0000):void {
            this.sprite.tint = color;
            setTimeout(function(){
                this.sprite.tint = 0xFFFFFF;
            }.bind(this), 150);
        }


        /**
         * Callback method when the character collides with a collectable object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        collect (char:Phaser.Sprite, object:Collectables.Collectable) {
            object.collect(this);
            object.kill();
        }

    }
}

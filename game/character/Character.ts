/**
 * Character class.
 * Wraps the logic of creating and upating a character. Should be extended from
 * Hero and Badie
 *
 * @author Daniel Waksman
 */

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="CharStates.ts"/>

module Superhero {

    export class Character {

        game: Phaser.Game;
        sprite: Phaser.Sprite;
        bullets: Phaser.Group;
        shadow: Phaser.Sprite;
        fuel: number;
        maxFuel: number;
        fuelTimer: number;
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

            this.initShadow();
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
            this.sprite.anchor.setTo(0.5,0);

            this.sprite.scale.setTo((<Superhero.Game> this.game).conf.world.sprite_scaling);
        }

        /**
         * Initalizes the physics of the character
         */
        initPhysics ():void {
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;

            this.sprite.body.gravity.y = (<Superhero.Game> this.game).conf.physics.player.gravity.y;
            this.sprite.body.drag.x = (<Superhero.Game> this.game).conf.physics.player.drag;
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

                //Get the first bullet that has gone offscreen
                var bullet = this.bullets.getFirstDead();
                if (!bullet) return;

                this.sprite.animations.play('shoot');
                bullet.anchor.setTo(0.5, 1);

                //Reposition bullet
                bullet.reset(this.sprite.x + 40, this.sprite.y + 40);

                //Set bullet physics
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
                bullet.body.velocity.x = this.bulletVelocity;
                bullet.body.allowGravity = false;
                bullet.scale.setTo((<Superhero.Game> this.game).conf.world.sprite_scaling);
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

                this.sprite.animations.stop();
                this.flyStill();

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
            this.bullets.createMultiple(3,'bullets','bullet1');
        }

        /**
         * Inits the character shadow
         */
        initShadow (): void {

            //Sprite related
            this.shadow = this.game.add.sprite(100, this.floor, 'shadow');
            this.shadow.scale.setTo((<Superhero.Game> this.game).conf.world.sprite_scaling);
            this.shadow.anchor.setTo(0.5,0);

            //Physics
            this.game.physics.enable(this.shadow, Phaser.Physics.ARCADE);
            this.shadow.body.immovable = true;
            this.shadow.body.allowGravity = false;
        }

        /**
         * Updates shadow accordingly.
         * Must scale depending of the distance to the character and always keep below the char
         */
        updateShadow ():void {
            var x1 = this.game.height - 50;
            var y1 = 0.8;
            var x2 = 50;
            var y2 = 0.5;

            var x0 = this.sprite.y;
            var y0 = Utils.intepolate(x1,y1,x2,y2,x0);

            this.shadow.x = this.sprite.x + 5;
            this.shadow.scale.setTo(y0);
        }

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

        /**
         * Update method. Here should be all the logic related to the character's game loop
         */
        update (): void {
            this.updateFuel();
            this.updateShadow();
        }

        /**
         * Sets the bullet velocity to all subsequent shots
         * @param {number} n the new value to the bullet velocity
         */
        setBulletVelocity(n:number){
            this.bulletVelocity = n;
        }

        /**
         * Sets collitions of the character with a group
         * @param {Phaser.Group} group Group upon wich the character should collide
         */
        collideWithGroup (group:Phaser.Group): void{
            this.game.physics.arcade.collide(group, this.sprite, null, null, this);
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
        die (char:Phaser.Sprite, object:any) {

            char.play('takehit',4,false,true);
            this.shadow.kill();
            object.kill();

        }

    }
}

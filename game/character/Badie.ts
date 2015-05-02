/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    export class Badie extends Character{

        constructor (game:Phaser.Game) {
            // TODO: add random spawn point for enemies
            super(game,'badie',game.width - 150,100);

            this.facing = Facing.LEFT;
            this.setBulletVelocity(1000);

            this._state = new Superhero.StateHostile(this.game, this);
            (<Superhero.StateHostile>this._state).patrol();

            this.shootDelay = 1600;
        }

        update () {
            super.update();
            var newState = this._state.update();

            // If the update returned a different state then
            // we must exit the previous state, start the new one and assign the new one
            if (newState !== this._state) {
                this._state.exitState();
                newState.enterState();
                this._state = newState;
            }
        }

        /**
         * Creates bullets group and enable physics
         */
        initBullets (): void {
            // Create a bullet group with Arcade physics
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;

            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(4,'bullets','arrow1');
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

                this.sprite.animations.play('shoot',6);
                this.sprite.animations.currentAnim.onComplete.add(function(){
                    for (var i=0; i<this.firePower; i++) {

                        //Get the first bullet that has gone offscreen
                        var bullet = this.bullets.getFirstDead();

                        //If there is none (all are still flying) create new one.
                        if (!bullet) bullet = this.bullets.create(-10,-10, 'bullets','arrow1');

                        bullet.anchor.setTo(0.5, 1);
                        bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + (10 * i+1));
                        bullet.angle = 180;
                        bullet.checkWorldBounds = true;
                        bullet.outOfBoundsKill = true;
                        bullet.body.velocity.x = this.bulletVelocity;
                        bullet.body.allowGravity = false;
                        bullet.scale.setTo((<Superhero.Game> this.game).conf.world.sprite_scaling);
                    }


                    //Reset the timer
                    this.bulletTimer = this.game.time.time;
                },this);



            }
        }
    }
}

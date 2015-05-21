/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    /**
     * TentacleBot base class
     */
    export class MiniBoss extends Superhero.EnemyBase {

        constructor(game: Phaser.Game, enemyChar: Superhero.IEnemy) {
            super(game, enemyChar);
            this.addAnimations();
        }

        addAnimations (): void {
            super.addAnimations();
            // Check why we need to call the idle animation
            this.sprite.animations.play("flystill");
        }

        /**
         * Wraps the fire logic
         */
        fire (): void {

            if(this.sprite.alive) {
                if (this.fireEnabled) {
                    if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {

                        //Check for shootRate
                        var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                        if (elapsedTime < this.shootDelay) return;
                        (<Superhero.StateEnemyHostile>this._state).pausePatrol();

                        this.sprite.animations.play('shoot', (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["shootAnimationFrames"]);
                        // Stop tween and play new animation
                        setTimeout(function () {
                            this.fireBullet();
                        }.bind(this), 1000);
                    }
                }
            }
        }

        fireBullet(): void {

            if(this.sprite.alive) {
                var lastBulletX = this.sprite.x - (this.sprite.width * this.sprite.anchor.x);
                var beamWidth = 0;
                for (var i = 0; beamWidth < this.game.width; i++) {

                    // TODO: maybe load it on a level preloader
                    //Get the first bullet that has gone offscreen
                    var bullet = this.getCustomBullet("blueBeam");

                    //If there is none (all are still flying) create new one.
                    if (!bullet) {
                        bullet = this.createNewBullet();
                    }

                    bullet.alpha = 1;

                    bullet.anchor.setTo(
                        1,
                        0
                    );

                    bullet.reset(lastBulletX, this.sprite.y);

                    // Fire sound
                    this.playFireSound();

                    bullet.checkWorldBounds = true;
                    bullet.outOfBoundsKill = true;
                    bullet.body.velocity.x = 0;
                    lastBulletX = lastBulletX - bullet.width;
                    this.game.add.tween(bullet).to({alpha: 0}, 600, Phaser.Easing.Bounce.In, true, 0, 0, false).onComplete.add(function (b) {
                        b.kill();
                    }, this);
                    beamWidth += bullet.width;
                }
                (<Superhero.StateEnemyHostile>this._state).resumePatrol();
                this.resetFireTimer();
            }
        }

        getCustomBullet(assetKey: string): Phaser.Sprite{
            //var
            for (var i = 0; i < this.bullets.length; i++) {
                if ((<Phaser.Sprite>this.bullets.children[i]).frameName === assetKey && !(<Phaser.Sprite>this.bullets.children[i]).alive) {
                    return (<Phaser.Sprite>this.bullets.children[i]);
                }
            }

            return null;
        }

        /**
         * Callback method when the character collides with a deadly object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        die (char:Phaser.Sprite, object?:any) {
            if (this.shield < 1) {
                this.sprite.body.velocity.x = 80;
                if (this.bullets) this.bullets.forEachAlive(function(b){b.kill()},this);
            }
            super.die(char, object);
        }
    }
}

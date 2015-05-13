/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    /**
     * TentacleBot base class
     */
    export class TentacleBot extends Superhero.EnemyBase {
        missiles: Phaser.Sprite[];
        misslesLaunched: boolean = false;
        misslesTimer: Phaser.Timer;

        constructor(game: Phaser.Game, enemyChar: Superhero.IEnemy) {
            super(game, enemyChar);
            this.missiles = [];
            this.addAnimations();
            this.initMisslesPhysics();
            this.initTimer();
        }

        initTimer(): void {
            this.misslesTimer = this.game.time.create(false);
            this.misslesTimer.start();
        }

        initMisslesPhysics(): void {
            for (var i=0; i<4; i++) {
                this.missiles.push(this.bullets.create(
                    -10,
                    -10,
                    (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["key"],
                    (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["frame"]
                ));
                this.game.physics.enable(this.missiles[i], Phaser.Physics.ARCADE);
            }
        }

        addAnimations (): void {
            super.addAnimations();
            // Check why we need to call the idle animation
            this.sprite.animations.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
        }

        /**
         * Wraps the fire logic
         */
        fire (): void {

            // TODO: implement groups for missles
            if(this.misslesTimer.seconds > 10) {
                this.bulletTimer = this.game.time.time;
                this.misslesTimer.stop();
                this.misslesTimer.start();
            }
            // TODO: use config instead of hardcoded fire power(4) and seconds
            if (this.misslesLaunched && this.misslesTimer.seconds > 5) {
                for (var i=0; i<4; i++) {
                    var bullet = this.missiles[i];
                    /* if(!soundFire && count > 158) {
                     soundFire = true;
                     mslsfx.play();
                     }*/
                    this.resetMisslesTexture("withFire");
                    bullet.body.velocity.x -= 35;
                    bullet.body.velocity.y -= 3;
                }
            }
            if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {
                if(this.misslesTimer.seconds > 4 && this.misslesTimer.seconds < 4.4 ) {

                    this.sprite.animations.play('fire');
                    if(!this.misslesLaunched ) {
                        // TODO: add coordinates for every missile on config file - e.g. missiles[i]
                        this.missiles[0].reset(this.sprite.x + 55, this.sprite.y + 60);
                        this.missiles[1].reset(this.sprite.x - 68, this.sprite.y + 25);
                        this.missiles[2].reset(this.sprite.x - 29, this.sprite.y + 140);
                        this.missiles[3].reset(this.sprite.x - 98, this.sprite.y + 100);
                        for (var i=0; i<4; i++) {
                            this.missiles[i].body.gravity.y = 66;
                        }
                        this.misslesLaunched = true;
                    }
                } else {
                    if (this.misslesTimer.seconds > 6) {
                        this.misslesLaunched = false;
                        this.bulletTimer = this.game.time.time;
                        this.misslesTimer.stop();
                        this.misslesTimer.start();
                        // TODO: reset does not reset the texture of the sprite??
                        this.resetMisslesTexture("withoutFire");
                    }
                    this.sprite.animations.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
                }
            }
        }

        /**
         * Update missle texture
         * @param newTexture
         */
        resetMisslesTexture(newTexture: string): void {
            this.missiles.forEach((missle) =>
                    missle.loadTexture(this.sprite.key, newTexture)
            );
            return;
        }
    }
}

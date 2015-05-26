/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    /**
     * TentacleBot base class
     */
    export class TentacleBot extends Superhero.EnemyBase {
        missiles: Phaser.Sprite[];
        missilesLaunched: boolean = false;
        missilesTimer: Phaser.Timer;

        constructor(game: Phaser.Game, enemyChar: Superhero.IEnemy) {
            super(game, enemyChar);
            this.missiles = [];
            this.addAnimations();
            this.initMisslesPhysics();
            this.initTimer();
        }

        initTimer(): void {
            this.missilesTimer = this.game.time.create(false);
            this.missilesTimer.stop();
            this.missilesTimer.start();
        }

        initMisslesPhysics(): void {
            for (var i=0; i<4; i++) {
                this.missiles.push(this.bullets.create(
                    -50,
                    -50,
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
            if(this.missilesTimer.seconds > 10 || this.missilesTimer.seconds < 0) {
                this.initTimer()
            }

            if (this.missilesLaunched && this.missilesTimer.seconds > 4) {
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
                if(this.missilesTimer.seconds > 3 && this.missilesTimer.seconds < 3.4 ) {
                    this.sprite.animations.play('fire');
                    if(!this.missilesLaunched ) {
                        for (var i=0; i<4; i++) {
                            this.missiles[i].body.gravity.y = 66;
                            this.missiles[i].reset(
                                this.sprite.x + ((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["missiles"][i]["x"]),
                                this.sprite.y + ((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["missiles"][i]["y"])
                            );
                        }
                        this.missilesLaunched = true;
                        this.playFireSound();
                    }
                } else {
                    if (this.missilesTimer.seconds > 5) {
                        this.missilesLaunched = false;
                        this.bulletTimer = this.game.time.time;
                        this.missilesTimer.stop();
                        this.missilesTimer.start();
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

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    export enum BulletDirection {
        STRAIGHT = 0,
        UP = 1,
        DOWN = 2
    }

    /**
     * TentacleBot base class
     */
    export class TwoHandedEnemy extends Superhero.EnemyBase {
        lastFireLeft: boolean;

        constructor(game: Phaser.Game, enemyChar: Superhero.IEnemy) {
            super(game, enemyChar);
            this.addAnimations();
            this.initBullets();
        }

        initBullets(): void {
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;

            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(
                2,
                "twoHandedWeapon",
                "downProjectile"
            );
            this.bullets.createMultiple(
                2,
                "twoHandedWeapon",
                "upperProjectile"
            )
            this.bullets.createMultiple(
                2,
                "twoHandedWeapon",
                "mainProjectile"
            )
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

            if(this.sprite.alive) {
                if(this.fireEnabled) {
                    if (
                        (this.sprite.animations.currentAnim.name != 'shootRightWhenDown' ||
                        this.sprite.animations.currentAnim.name != 'shootRightWhenUp' ||
                        this.sprite.animations.currentAnim.name != 'shootLeft' ||
                        this.sprite.animations.currentAnim.isFinished) &&
                        this.sprite.animations.currentAnim.name != 'takehit') {

                        //Check for shootRate
                        var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                        if (elapsedTime < this.shootDelay) return;

                        if (this.lastFireLeft) {
                            // fire right hand
                            this.lastFireLeft = false;
                            if (this.spawnPoint == spawnEnemyPosition.TOP) {
                                // shoot down
                                this.sprite.animations.play('shootRightWhenUp');
                                setTimeout(function () {
                                    this.fireBullet("downProjectile", BulletDirection.DOWN);
                                }.bind(this), 250);
                            } else {
                                this.sprite.animations.play('shootRightWhenDown');
                                setTimeout(function () {
                                    this.fireBullet("upperProjectile", BulletDirection.UP);
                                }.bind(this), 250);
                            }
                        } else {
                            // fire left hand
                            this.lastFireLeft = true;
                            this.sprite.animations.play('shootLeft');
                            setTimeout(function () {
                                this.fireBullet("mainProjectile", BulletDirection.STRAIGHT);
                            }.bind(this), 250);
                        }
                        //Reset the timer
                        this.bulletTimer = this.game.time.time;
                        // TODO: fix idle anim
                        //this.sprite.animations.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
                    }
                }
            }
        }

        fireBullet(bulletKey: string, bulletDirection: BulletDirection): void {
            var bullet = this.getCustomBullet(bulletKey);
            //If there is none (all are still flying) create new one.
            if (!bullet) {
                bullet = this.createNewBullet("twoHandedWeapon", bulletKey);
            }
            bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + 15);
            if(bulletDirection != BulletDirection.STRAIGHT) {
                if (bulletDirection == BulletDirection.DOWN) {
                    bullet.body.velocity.y = 100;
                } else {
                    bullet.body.velocity.y = -100;
                }
            }
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
            bullet.body.velocity.x = this.bulletVelocity;
            bullet.body.allowGravity = this.allowGravity;
            bullet.scale.setTo((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bulletScale"]);
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
            // TODO: DRY
            if((<Superhero.Game> this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["isImmortal"]){
                return;
            }

            var elapsedTime = this.game.time.elapsedSince(this.dieTimer);
            if (elapsedTime < this.respawnDelay) return;
            this.dieTimer = this.game.time.time;

            // SFX
            this.playGetHitSound(char.key);

            // Smoke emitter
            if (this.shield > 0) {
                if(!this.smokeEmitter.on) {
                    this.startSmokeEmitter();
                }
                this.shield -= 1;
                this.flickerSprite(0xFF0000);
                return;
            }
            if(this.smokeEmitter.on) {
                this.stopSmokeEmitter();
            }

            // Update combo using enemy sields
            this.updateComboByEnemy();

            this.sprite.body.checkWorldBounds = true;
            this.sprite.body.outOfBoundsKill = true;
            this.sprite.body.angularVelocity = this.game.rnd.integerInRange(-400, -300);
            if (this.bullets) this.bullets.forEachAlive(function(b){b.kill()},this);
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, this.game.rnd.integerInRange(-300,-400), this.sprite.body.acceleration);
            this.deadSince = this.game.time.time;
        }
    }
}

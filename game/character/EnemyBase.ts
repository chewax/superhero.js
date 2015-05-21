/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    export interface IEnemyChar {
        AssetKey: string;
        Facing: Superhero.Facing;
        BulletVelocity: number;
    }

    /**
     * Interface to set enemies tween range
     */
    export enum spawnEnemyPosition {
        TOP = 150,
        DOWN = -150
    }

    /**
     * Enemy base class
     */
    export class EnemyBase extends Character {
        isPatrolling: boolean = false;
        spawnPoint: spawnEnemyPosition;
        fireEnabled: boolean = true;
        dropsSmoke: boolean = false;
        smokeEmitter: Phaser.Particles.Arcade.Emitter;


        constructor (game: Phaser.Game, enemyChar: Superhero.IEnemy) {
            super(game, enemyChar.assetsKey, game.width - enemyChar.spawnLocation.x, enemyChar.spawnLocation.y);
            // Set custom properties
            this.setCustomEnemyProperties(enemyChar);
            this.lives = 1;
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
         * Set enemy custom properties
        **/
        setCustomEnemyProperties(enemyChar: Superhero.IEnemy): void {

            // Common properties
            this.firePower = enemyChar.firePower;
            this.spawnPoint = enemyChar.spawnPoint;
            this.facing = enemyChar.facing;
            this.setBulletVelocity(enemyChar.bulletVelocity);
            this.shootDelay = enemyChar.shootDelay;
            this.deadSince = enemyChar.deadSince;
            this.fireEnabled = enemyChar.fireEnabled;
            this.shield = enemyChar.shields;
            this.sprite.rotation = 0;
            if(enemyChar.respawnDelay){
                this.respawnDelay = enemyChar.respawnDelay;
            }
            this.dropsSmoke = enemyChar.dropsSmoke;
            this.soundEnabled = enemyChar.soundEnabled;
            this.resetFireTimer();

            // State
            this._state = new Superhero.StateEnemyHostile(this.game, this);

            // Patrol
            if (enemyChar.defaultState == EnemyState.PATROL) {
                this.isPatrolling = true;
                (<Superhero.StateEnemyHostile>this._state).patrol(enemyChar.spawnPoint);
            }

            if(enemyChar.assetsKey == "smallMissileEnemy"){
                (<Superhero.StateEnemyHostile>this._state).startWarning();
            }

            // Smoke emitter
            if(this.dropsSmoke) {
                this.initSmokeEmitter();
            }

            this.sprite.animations.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
        }

        /**
         * Initalizes the physics of the character
         */
        initPhysics ():void {
            super.initPhysics();
            this.sprite.body.drag.x = 0;
            this.sprite.body.collideWorldBounds = false;
            this.sprite.body.checkWorldBounds = true;
        }


        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        fire (): void {
            if(this.fireEnabled) {
                //Thou shalt only shoot if there is no shooting in progress
                if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {

                    //Check for shootRate
                    var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                    if (elapsedTime < this.shootDelay) return;

                    this.sprite.animations.play('shoot', (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["shootAnimationFrames"]);

                    for (var i = 0; i < this.firePower; i++) {

                        //Get the first bullet that has gone offscreen
                        var bullet = this.bullets.getFirstDead();

                        //If there is none (all are still flying) create new one.
                        if (!bullet) {
                            bullet = this.createNewBullet();
                        }

                        bullet.anchor.setTo(
                            (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["x"],
                            (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["y"]
                        );

                        bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + (10 * i + 1));
                        bullet.angle = 180;
                        bullet.checkWorldBounds = true;
                        bullet.outOfBoundsKill = true;
                        bullet.body.velocity.x = this.bulletVelocity;
                        bullet.body.allowGravity = this.allowGravity;
                        bullet.scale.setTo((<Superhero.Game>this.game).conf.WORLD.sprite_scaling);
                    }
                    //Reset the timer
                    this.bulletTimer = this.game.time.time;
                }
            }
        }

        initSmokeEmitter(): void {
            this.smokeEmitter = this.game.add.emitter();
            this.smokeEmitter.maxParticles = 13;
            this.sprite.addChild(this.smokeEmitter);
            this.smokeEmitter.makeParticles('smoke');
            this.smokeEmitter.setXSpeed(0, -50);
            this.smokeEmitter.setYSpeed(0, 0);
            this.smokeEmitter.setRotation(0, 0);
            this.smokeEmitter.setAlpha(0.1, 1, 3000);
            this.smokeEmitter.setScale(0.8, 1.5, 0.8, 1.5, 1000, Phaser.Easing.Quintic.Out);
            this.smokeEmitter.gravity = -30;
            this.smokeEmitter.y = 45;
            this.smokeEmitter.x = 36;
        }

        startSmokeEmitter(): void {
            this.smokeEmitter.start(false, 2000, 100);
            this.smokeEmitter.on = true;
        }

        stopSmokeEmitter(): void {
            this.smokeEmitter.on = false;
        }
    }
}

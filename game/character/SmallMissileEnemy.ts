/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    /**
     * TentacleBot base class
     */
    export class SmallMissileEnemy extends Superhero.EnemyBase {
        warningSound: Phaser.Sound;
        sirenSound: Phaser.Sound;
        missileSound: Phaser.Sound;

        constructor(game: Phaser.Game, enemyChar: Superhero.IEnemy) {
            super(game, enemyChar);
            this.addAnimations();
            this.initPhysics();
            this.sprite.events.onKilled.add(function(){
                this.warningSound.stop();
                this.sirenSound.stop();
                this.missileSound.stop();
                this.die(this.sprite);
            }, this);
        }

        addAnimations (): void {
            super.addAnimations();
            // Check why we need to call the idle animation
            this.sprite.animations.play("flystill");
        }

        /**
         * Initialize instance audio
         */
        initAudio(): void {
            super.initAudio();
            this.warningSound = this.game.add.audio(
                "smallMissileWarningSound",
                0.5,
                false
            );

            this.sirenSound = this.game.add.audio(
                "smallMissileSiren",
                0.3,
                true
            )

            this.missileSound = this.game.add.audio(
                "smallMissileMissile",
                1,
                false
            )
        }

        /**
         * Update method. Here should be all the logic related to the character's game loop
         */
        update() {
            super.update();
            this.game.physics.arcade.collide(this.game.state.states.Level1.hero.sprite, this.sprite, this.handleHeroCollition, null, this);
            this.game.state.states.Level1.obstacleManager.diesWith(this.sprite, this.game.state.states.Level1.killWallEnemy, this.game.state.states.Level1);
        }

        handleHeroCollition(object: any, smallMissileEnemy: any): void {
            this.game.state.states.Level1.hero.die(object, smallMissileEnemy);
        }

        /**
         * Wraps the fire logic
         */
        fire (): void {
            if(this.sprite.alive) {
                if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {
                    //Check for shootRate
                    var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                    if (elapsedTime < this.shootDelay) return;
                    this.sprite.animations.play('shoot');
                    (<Superhero.StateEnemyHostile>this._state).engage();
                }
            }
        }
    }
}

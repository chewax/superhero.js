/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
/// <reference path="../plugins/GamePad.ts"/>



module Superhero {

    /**
     * @interface CharState
     * Interface for classes that represent a Character State
     *
     * Implements the State Pattern. Sets up a FSM in whiche every state knows how to handle its events and derives
     * to the next state
     */
    export interface CharState {

        /**
         * @function update
         * @returns {CharState}
         * handles the update logic for current state.
         */
        update():CharState;
        enterState():void;
        exitState():void;
    }

    /**
     * Enemy possible states
     */
    export enum EnemyState {
        STEADY = 0,
        PATROL = 1
    }


    /**
     * Contains all the generic behaviour for the States.
     * @class BaseState
     * @implements CharState
     * @param {Phaser.Game} game - the instance of the current game
     * @param {Superhero.Character} hero - the instance of the player character
     *
     */
    class BaseState implements CharState {

        game:Phaser.Game;
        hero:Superhero.Character;

        fireButton:Gamepads.Button;
        nukeButton:Gamepads.Button;
        warpButton:Gamepads.Button;
        bombButton:Gamepads.Button;
        heroStick:Gamepads.Joystick;
        fxEnabled: boolean;
        musicEnabled: boolean;


        gamepad:Gamepads.GamePad;

        /**
         * @param {Phaser.game} game instance
         * @param {Superher.Character} hero instance
         */
        constructor(game:Phaser.Game, hero:Superhero.Character) {
            this.game = game;
            // Is hero used for all the characters? even if it's an enemy?
            this.hero = hero;

            // Are we adding to all the enemies the gamePad, fireButton and heroStick?
            this.gamepad = (<Superhero.Game> this.game).gamepad;
            this.fireButton = this.gamepad.buttonPad.button1;
            this.nukeButton = this.gamepad.buttonPad.button2;
            this.warpButton = this.gamepad.buttonPad.button3;
            this.bombButton = this.gamepad.buttonPad.button4;
            this.heroStick = this.gamepad.stick1;

            this.fxEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
            this.musicEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
        }

        public update():CharState {
            return null;
        }

        public enterState():void {
        }

        public exitState():void {
        }

    }

    ///**
    // * STATE_IDLE Class
    // */
    export class StateIdle extends BaseState {

        public update():CharState {
            if (this.hero.sprite.alive) {

                if (this.heroStick.receivingInput()) {
                    return new StateFly(this.game, this.hero);
                }
            }
            //If nothing was commanded remain on the same state
            return this;
        }

        public enterState() {
        }

        public exitState() {
        }
    }


    ///**
    // * STATE_FLY Class
    // */
    export class StateFly extends BaseState {

        public update():CharState {

            if (this.hero.sprite.alive) {
                if (Math.abs(this.heroStick.speed.x) > 0 || Math.abs(this.heroStick.speed.y) > 0) {
                    this.hero.move(this.heroStick.speed);
                }


                this.hero.sprite.play('flystill');

                if (this.heroStick.cursors.right) {
                    return new StateSprint(this.game, this.hero);
                }

                if (!this.heroStick.receivingInput()) {
                    return new StateIdle(this.game, this.hero);
                }
            }
            return this;
        }

        public enterState() {
        }

        public exitState() {
        }
    }


    ///**
    // * STATE_SPRINT Class
    // */
    export class StateSprint extends BaseState {

        public update():CharState {
            if (this.hero.sprite.alive) {
                this.hero.sprite.play('fly');

                if (Math.abs(this.heroStick.speed.x) > 0 || Math.abs(this.heroStick.speed.y) > 0) {
                    this.hero.move(this.heroStick.speed);
                }

                if (!this.heroStick.receivingInput()) {
                    return new StateIdle(this.game, this.hero);
                }

                if (!this.heroStick.cursors.right) {
                    return new StateFly(this.game, this.hero);
                }
            }
            return this;
        }

        public enterState() {
        }

        public exitState() {
            this.hero.stop();
        }
    }

    ///**
    // * Hostile state Class
    // */
    export class StateEnemyHostile extends BaseState {

        tween:Phaser.Tween;

        public patrol(patrolPoint:Superhero.spawnEnemyPosition):void {

            this.tween = this.game.add.tween(this.hero.sprite);

            if(this.hero.sprite.key == "miniBoss") {
                // TODO: implement method for miniBoss longPatrol
                this.tween.to({y: this.game.world.y}, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
            } else {
                if (patrolPoint == Superhero.spawnEnemyPosition.TOP) {
                    this.tween.to({y: this.game.world.centerY - 50}, (<Superhero.Game>this.game).conf.ENEMIES.patrolTweenSpeed, Phaser.Easing.Linear.None, true, 0, -1, true);
                } else {
                    if (patrolPoint == Superhero.spawnEnemyPosition.TOP) {
                        this.tween.to({y: this.game.world.centerY - 50}, (<Superhero.Game>this.game).conf.ENEMIES.patrolTweenSpeed, Phaser.Easing.Linear.None, true, 0, -1, true);
                    } else {
                        this.tween.to({y: this.game.world.centerY + 50}, (<Superhero.Game>this.game).conf.ENEMIES.patrolTweenSpeed, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
            }
        }

        public engage(){
            (<Superhero.SmallMissileEnemy>this.hero).sirenSound.loop = false;
            if(!(<Superhero.SmallMissileEnemy>this.hero).missileSound.isPlaying) {
                if (this.fxEnabled) (<Superhero.SmallMissileEnemy>this.hero).missileSound.play();
            }
            this.stopPatrol();
            this.hero.sprite.alpha = 1;
            this.hero.sprite.body.enable = true;
            this.hero.sprite.body.velocity.x = -1000;
            this.hero.sprite.checkWorldBounds = true;
            this.hero.sprite.outOfBoundsKill = true;
        }

        public startWarning(): void {
            (<Superhero.SmallMissileEnemy>this.hero).sirenSound.loop = true;
            if (this.fxEnabled) (<Superhero.SmallMissileEnemy>this.hero).warningSound.play();
            if (this.fxEnabled) (<Superhero.SmallMissileEnemy>this.hero).sirenSound.play();
            this.hero.sprite.animations.play("flystill");
            this.hero.sprite.body.enable = false;
            this.hero.sprite.alpha = 0;
            this.tween = this.game.add.tween(this.hero.sprite);
            this.tween.to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }

        public resumePatrol(){
            if(this.tween) {
                if ((<EnemyBase>this.hero).isPatrolling) {
                    this.tween.resume();
                }
            }
        }

        public stopPatrol():void {
            if (this.tween) {
                this.tween.stop();
            }
        }

        public pausePatrol(): void {
            if(this.tween){
                this.tween.pause();
            }
        }

        public update ():CharState {
            if(this.hero.sprite.alive) {
                this.hero.fire();
            }
            return this;
        }

        public enterState() {
        }

        public exitState() {
        }
    }

    // SM LevelIntro


    /**
     * STATE_RUN Class
     */
    export class StateRun extends BaseState {

        public update():CharState {
            if (this.hero.sprite.animations.currentAnim.isFinished){
                this.hero.sprite.animations.play('run');
            }
            //If nothing was commanded remain on the same state
            return this;
        }

        public enterState() {
            this.hero.sprite.play('run');
        }

        public exitState() {
        }
    }
}

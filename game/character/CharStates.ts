/**
 * @author Daniel Waksman
 */

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
     * Contains all the generic behaviour for the States.
     * @class BaseState
     * @implements CharState
     * @param {Phaser.Game} game - the instance of the current game
     * @param {Superhero.Character} hero - the instance of the player character
     *
     */
    class BaseState implements CharState {

        game: Phaser.Game;
        hero: Superhero.Character;

        fireButton: Gamepads.Button;
        heroStick: Gamepads.Joystick;


        gamepad: Gamepads.GamePad;

        /**
         * @param {Phaser.game} game instance
         * @param {Superher.Character} hero instance
         */
        constructor (game: Phaser.Game, hero: Superhero.Character){
            this.game = game;
            this.hero = hero;
            this.gamepad = (<Superhero.Game> this.game).gamepad;
            this.fireButton = this.gamepad.buttonPad.button1;

            this.heroStick = this.gamepad.stick1;
        }

        public update (): CharState {
            return null;
        }

        public enterState(): void {}
        public exitState(): void {}

    }

    ///**
    // * STATE_IDLE Class
    // */
    export class StateIdle extends BaseState{

        public update ():CharState {

            //If fire on idle. Fire and remain in same state
            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            if (this.heroStick.receivingInput()) {
                return new StateFly(this.game, this.hero);
            }
            //If nothing was commanded remain on the same state
            return this;
        }

        public enterState () {}
        public exitState () {}
    }


    ///**
    // * STATE_FLY Class
    // */
    export class StateFly extends BaseState{

        public update ():CharState {


            if (Math.abs(this.heroStick.speed.x) > 0 || Math.abs(this.heroStick.speed.y) > 0) {
                this.hero.move(this.heroStick.speed);
            }
            this.hero.sprite.play('flystill');

            if (this.heroStick.cursors.right) {
                return new StateSprint(this.game, this.hero);
            }

            //If fire on idle. Fire and remain in same state
            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            if (!this.heroStick.receivingInput()) {
                return new StateIdle(this.game, this.hero);
            }

            return this;
        }

        public enterState () {}
        public exitState () {}
    }


    ///**
    // * STATE_SPRINT Class
    // */
    export class StateSprint extends BaseState{

        public update ():CharState {

            this.hero.sprite.play('fly');
            //var speed = this.heroStick.speed;
            //speed.x *= 2;

            if (Math.abs(this.heroStick.speed.x) > 0 || Math.abs(this.heroStick.speed.y) > 0) {
                this.hero.move(this.heroStick.speed);
            }

            //If fire on idle. Fire and remain in same state
            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            if (!this.heroStick.receivingInput()) {
                return new StateIdle(this.game, this.hero);
            }

            if (!this.heroStick.cursors.right) {
                return new StateFly(this.game, this.hero);
            }

            return this;
        }

        public enterState () {}
        public exitState () {
            this.hero.stop();
        }
    }

    ///**
    // * Hostile state Class
    // */
    export class StateHostile extends BaseState{

        tween: Phaser.Tween;

        // TODO: DRY code - to improve

        public tween1 (): void {
            this.tween = this.game.add.tween(this.hero.sprite);
            this.tween.to({y: 300},1000,Phaser.Easing.Linear.None,true);
            this.tween.onComplete.addOnce(this.tween2, this);

            //  Notice the use of addOnce above. If you don't use that then you *must* do:
            // tween.onComplete.removeAll();
            //  before using the tween again, or it will fire both onComplete callbacks.

        }

        private tween2(): void {
            this.tween.to({y: 500},1000,Phaser.Easing.Linear.None,true);
            this.tween.onComplete.addOnce(this.tween3, this);
        }

        private tween3(): void {
            this.tween.to({y: 100},1000,Phaser.Easing.Linear.None,true);
            this.tween.onComplete.addOnce(this.tween2, this);
        }

        public update ():CharState {
            this.hero.fire();
            return this;
        }

        public enterState () {}
        public exitState () {}
    }
}
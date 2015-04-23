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
        sprintKey: Phaser.Key;

        fireButton: Gamepads.Button;
        heroStick: Gamepads.Joystick;


        //retreatKey: Phaser.Key;
        //fireKey: Phaser.Key;


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

    /**
     * STATE_IDLE Class
     */
    export class StateIdle extends BaseState{

        /**
         * @function update
         * Manages input for state idle.
         * STATE_IDLE + FIRE      --> (fire) IDLE
         * STATE_IDLE + TOUCH     --> FLY
         * STATE_IDLE + SPRINT    --> SPRINT
         * STATE_IDLE + RETREAT   --> RETREAT
         * STATE_IDLE + NULL      --> IDLE
         * @returns {CharState}
         */
        public update ():CharState {

            //If fire on idle. Fire and remain in same state
            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            //If commanded to climb and hero still has fuel then change state to STATE_FLY
            if (this.heroStick.cursors.up && this.hero.fuel > 0){
                return new StateFly(this.game, this.hero);
            }

            //If commanded to sprint then change state to STATE_SPRINT
            if (this.heroStick.cursors.right){
                return new StateSprint(this.game, this.hero);
            }

            //If commanded to retreat then change state to STATE_RETREAT
            if (this.heroStick.cursors.left){
                return new StateRetreating(this.game, this.hero);
            }

            //If nothing was commanded remain on the same state
            return this;
        }

        public enterState () {}
        public exitState () {}
    }

    /**
     * STATE_FLY Class
     */
    export class StateFly extends BaseState {

        public update ():CharState {

            //This state is all about climbing, so climb!
            this.hero.climb();

            //If fire on idle. Fire and remain in same state
            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            //If commanded to sprint then change state to STATE_SPRINT
            if (this.heroStick.cursors.right){
                return new StateSprint(this.game, this.hero);
            }

            //If commanded to retreat then change state to STATE_RETREAT
            if (this.heroStick.cursors.left){
                return new StateRetreating(this.game, this.hero);
            }

            //If climb command has stopped or run out of fuel then change state to STATE_DIVING
            if (!this.heroStick.receivingInput() || this.hero.fuel == 0) {
                return new StateDiving(this.game, this.hero);
            }

            return this;
        }

        public enterState () {}
        public exitState () {}
    }

    /**
     * STATE_SPRINT Class
     */
    export class StateSprint extends BaseState {

        public update ():CharState {

            this.hero.sprint();

            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            if (this.heroStick.cursors.up && this.hero.fuel > 0) {
                this.hero.climb();
            }

            if (!this.heroStick.receivingInput()) {
                return new StateIdle(this.game, this.hero);
            }

            return this;
        }

        public enterState () {}

        public exitState () {
            this.hero.stop();
        }
    }

    /**
     * STATE_RETREAT Class
     */
    export class StateRetreating extends BaseState {

        public update ():CharState {

            this.hero.moveLeft();

            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            if (this.heroStick.cursors.up && this.hero.fuel > 0) {
                this.hero.climb();
            }

            if (!this.heroStick.receivingInput()){
                return new StateIdle(this.game, this.hero);
            }

            return this;
        }

        public enterState () {}
        public exitState () {}
    }

    /**
     * STATE_DIVING Class
     */
    export class StateDiving extends BaseState {

        public update ():CharState {

            if (this.fireButton.pressed) {
                this.hero.fire();
            }

            if (this.heroStick.cursors.up && this.hero.fuel > 0){
                return new StateFly(this.game, this.hero);
            }

            if (this.hero.sprite.body.touching.down) {
                return new StateIdle(this.game, this.hero);
            }

            if (this.heroStick.cursors.right){
                return new StateSprint(this.game, this.hero);
            }

            if (this.heroStick.cursors.left){
                return new StateRetreating(this.game, this.hero);
            }

            return this;

        }

        public enterState () {}
        public exitState () {}
    }






}
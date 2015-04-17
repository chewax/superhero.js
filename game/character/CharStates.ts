/// <reference path="../../lib/phaser.d.ts"/>


module Superhero {

    /**
     * STATE PATTERN
     * Character States, interface
     */
    export interface CharState {

        update():CharState;
        enterState():void;
        exitState():void;
    }

    class BaseState implements CharState {

        game: Phaser.Game;
        hero: Superhero.Character;
        sprintKey: Phaser.Key;
        retreatKey: Phaser.Key;
        fireKey: Phaser.Key;

        constructor (game: Phaser.Game, hero: Superhero.Character){
            this.game = game;
            this.hero = hero;
            this.sprintKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.retreatKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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

        public update ():CharState {

            if (this.fireKey.isDown) {
                this.hero.fire();
            }

            if (this.game.input.activePointer.isDown && this.hero.fuel > 0){
                this.hero.climb();
                return new StateFly(this.game, this.hero);
            }

            if (this.sprintKey.isDown){
                return new StateSprint(this.game, this.hero);
            }

            if (this.retreatKey.isDown){
                return new StateRetreating(this.game, this.hero);
            }

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

            if (this.fireKey.isDown) {
                this.hero.fire();
            }

            if (this.sprintKey.isDown){
                return new StateSprint(this.game, this.hero);
            }

            if (this.retreatKey.isDown){
                return new StateRetreating(this.game, this.hero);
            }

            if (this.game.input.activePointer.isDown && this.hero.fuel > 0){
                this.hero.climb();
                return this
            }

            if (this.game.input.activePointer.isUp || this.hero.fuel == 0) {
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

            if (this.fireKey.isDown) {
                this.hero.fire();
            }

            if (this.game.input.activePointer.isDown && this.hero.fuel > 0) {
                this.hero.climb();
            }

            if (this.sprintKey.isUp) {
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

            if (this.fireKey.isDown) {
                this.hero.fire();
            }

            if (this.game.input.activePointer.isDown && this.hero.fuel > 0) {
                this.hero.climb();
            }

            if (this.retreatKey.isUp){
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

            if (this.fireKey.isDown) {
                this.hero.fire();
            }

            if (this.game.input.activePointer.isDown && this.hero.fuel > 0){
                this.hero.climb();
                return new StateFly(this.game, this.hero);
            }

            if (this.hero.sprite.body.touching.down) {
                return new StateIdle(this.game, this.hero);
            }

            if (this.sprintKey.isDown){
                return new StateSprint(this.game, this.hero);
            }

            if (this.retreatKey.isDown){
                return new StateRetreating(this.game, this.hero);
            }

            return this;

        }

        public enterState () {}
        public exitState () {}
    }






}
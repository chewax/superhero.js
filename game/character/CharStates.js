/**
 * @author Daniel Waksman
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * Contains all the generic behaviour for the States.
     * @class BaseState
     * @implements CharState
     * @param {Phaser.Game} game - the instance of the current game
     * @param {Superhero.Character} hero - the instance of the player character
     *
     */
    var BaseState = (function () {
        /**
         * @param {Phaser.game} game instance
         * @param {Superher.Character} hero instance
         */
        function BaseState(game, hero) {
            this.game = game;
            this.hero = hero;
            this.sprintKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.retreatKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }
        BaseState.prototype.update = function () {
            return null;
        };
        BaseState.prototype.enterState = function () { };
        BaseState.prototype.exitState = function () { };
        return BaseState;
    })();
    /**
     * STATE_IDLE Class
     */
    var StateIdle = (function (_super) {
        __extends(StateIdle, _super);
        function StateIdle() {
            _super.apply(this, arguments);
        }
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
        StateIdle.prototype.update = function () {
            //If fire on idle. Fire and remain in same state
            if (this.fireKey.isDown) {
                this.hero.fire();
            }
            //If commanded to climb and hero still has fuel then change state to STATE_FLY
            if (this.game.input.activePointer.isDown && this.hero.fuel > 0) {
                return new StateFly(this.game, this.hero);
            }
            //If commanded to sprint then change state to STATE_SPRINT
            if (this.sprintKey.isDown) {
                return new StateSprint(this.game, this.hero);
            }
            //If commanded to retreat then change state to STATE_RETREAT
            if (this.retreatKey.isDown) {
                return new StateRetreating(this.game, this.hero);
            }
            //If nothing was commanded remain on the same state
            return this;
        };
        StateIdle.prototype.enterState = function () { };
        StateIdle.prototype.exitState = function () { };
        return StateIdle;
    })(BaseState);
    Superhero.StateIdle = StateIdle;
    /**
     * STATE_FLY Class
     */
    var StateFly = (function (_super) {
        __extends(StateFly, _super);
        function StateFly() {
            _super.apply(this, arguments);
        }
        StateFly.prototype.update = function () {
            //This state is all about climbing, so climb!
            this.hero.climb();
            //If fire on idle. Fire and remain in same state
            if (this.fireKey.isDown) {
                this.hero.fire();
            }
            //If commanded to sprint then change state to STATE_SPRINT
            if (this.sprintKey.isDown) {
                return new StateSprint(this.game, this.hero);
            }
            //If commanded to retreat then change state to STATE_RETREAT
            if (this.retreatKey.isDown) {
                return new StateRetreating(this.game, this.hero);
            }
            //If climb command has stopped or run out of fuel then change state to STATE_DIVING
            if (this.game.input.activePointer.isUp || this.hero.fuel == 0) {
                return new StateDiving(this.game, this.hero);
            }
            return this;
        };
        StateFly.prototype.enterState = function () { };
        StateFly.prototype.exitState = function () { };
        return StateFly;
    })(BaseState);
    Superhero.StateFly = StateFly;
    /**
     * STATE_SPRINT Class
     */
    var StateSprint = (function (_super) {
        __extends(StateSprint, _super);
        function StateSprint() {
            _super.apply(this, arguments);
        }
        StateSprint.prototype.update = function () {
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
        };
        StateSprint.prototype.enterState = function () { };
        StateSprint.prototype.exitState = function () {
            this.hero.stop();
        };
        return StateSprint;
    })(BaseState);
    Superhero.StateSprint = StateSprint;
    /**
     * STATE_RETREAT Class
     */
    var StateRetreating = (function (_super) {
        __extends(StateRetreating, _super);
        function StateRetreating() {
            _super.apply(this, arguments);
        }
        StateRetreating.prototype.update = function () {
            this.hero.moveLeft();
            if (this.fireKey.isDown) {
                this.hero.fire();
            }
            if (this.game.input.activePointer.isDown && this.hero.fuel > 0) {
                this.hero.climb();
            }
            if (this.retreatKey.isUp) {
                return new StateIdle(this.game, this.hero);
            }
            return this;
        };
        StateRetreating.prototype.enterState = function () { };
        StateRetreating.prototype.exitState = function () { };
        return StateRetreating;
    })(BaseState);
    Superhero.StateRetreating = StateRetreating;
    /**
     * STATE_DIVING Class
     */
    var StateDiving = (function (_super) {
        __extends(StateDiving, _super);
        function StateDiving() {
            _super.apply(this, arguments);
        }
        StateDiving.prototype.update = function () {
            if (this.fireKey.isDown) {
                this.hero.fire();
            }
            if (this.game.input.activePointer.isDown && this.hero.fuel > 0) {
                return new StateFly(this.game, this.hero);
            }
            if (this.hero.sprite.body.touching.down) {
                return new StateIdle(this.game, this.hero);
            }
            if (this.sprintKey.isDown) {
                return new StateSprint(this.game, this.hero);
            }
            if (this.retreatKey.isDown) {
                return new StateRetreating(this.game, this.hero);
            }
            return this;
        };
        StateDiving.prototype.enterState = function () { };
        StateDiving.prototype.exitState = function () { };
        return StateDiving;
    })(BaseState);
    Superhero.StateDiving = StateDiving;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=CharStates.js.map
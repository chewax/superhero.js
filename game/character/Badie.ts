/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    export class Badie extends Character{

        constructor (game:Phaser.Game) {
            // TODO: add random spawn point for enemies
            super(game,'badie',game.width - 150,100);

            this.facing = Facing.LEFT;
            this.setBulletVelocity(1000);

            this._state = new Superhero.StateHostile(this.game, this);
            (<Superhero.StateHostile>this._state).patrol();

            this.shootDelay = 1600;
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
    }
}

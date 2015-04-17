/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>


module Superhero {
    export class Hero extends Character {

        constructor (game:Phaser.Game) {
            super(game,'hero1',100,100);
            this.setBulletVelocity(1000);
        }

        update () {
            super.update();
            var newState = this._state.update();

            console.log(newState.constructor.name);

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
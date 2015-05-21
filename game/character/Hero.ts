/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
/// <reference path="../plugins/GamePad.ts"/>


module Superhero {
    export class Hero extends Character {

        constructor (game:Phaser.Game, spriteKey?: string) {
            var sptK;
            if(spriteKey){
                sptK = spriteKey
            } else {
                sptK = "hero1";
            }
            super(game, sptK, game.world.centerX - 200,game.world.centerY);
            this.facing = Facing.RIGHT;
            //this.firePower = 10;
            this.shootDelay = 500;

            this.setBulletVelocity(1000);
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
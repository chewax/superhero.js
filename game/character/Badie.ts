/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>


module Superhero {

    export class Badie extends Character{

        constructor (game:Phaser.Game) {
            // TODO: add random spawn point for enemies
            super(game,'badie',game.width - 150,100);
            this.setBulletVelocity(-1000);
            this._state = new Superhero.StateHostile(this.game, this);
            (<Superhero.StateHostile>this._state).tween1();
            this._state.exitState();
            this._state.enterState();
            this.shootDelay = 1600;
        }

        update () {
            super.update();
            this._state.update();
        }
    }
}

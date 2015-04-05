/// <reference path="../lib/phaser.d.ts"/>

module Superhero {

    export class Badie extends Character{

        constructor (game:Phaser.Game) {
            super(game,'badie',game.width - 150,100);
            this.setBulletVelocity(-1000);
        }
    }
}

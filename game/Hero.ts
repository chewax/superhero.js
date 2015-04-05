/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>


module Superhero {
    export class Hero extends Character {

        constructor (game:Phaser.Game) {
            super(game,'hero1',100,100);
            this.setBulletVelocity(1000);
        }
    }
}
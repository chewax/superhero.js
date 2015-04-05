/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="states/Boot.ts"/>
/// <reference path="states/Preloader.ts"/>
/// <reference path="states/Menu.ts"/>
/// <reference path="states/Level1.ts"/>


module Superhero{

    export class Game extends Phaser.Game{

        constructor () {
            super(window.innerWidth, 600, Phaser.AUTO, 'radar', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('Menu', Menu, false);
            this.state.add('Level1', Level1, false);

            this.state.start('Boot');
        }

    }

}
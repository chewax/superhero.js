/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../states/Boot.ts"/>
/// <reference path="../states/Preloader.ts"/>
/// <reference path="../states/Menu.ts"/>
/// <reference path="../states/Level1.ts"/>
/// <reference path="../states/Intro.ts"/>
/// <reference path="../config/Config.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
/// <reference path="../../lib/jquery.d.ts" />


module Superhero{

    /**
     * Main game class. Create the states of the game, inits the config object and starts the boot.
     * @class Game
     * @extends Phaser.Game
     *
     * @param {number} width - The viewport width. It originally sets the width of the world too.
     * @param {number} height - The viewport height. It originally sets the height of the world too.
     * @param {number} render - One of the Phaser render styles available [Phaser.CANVAS | Phaser.WEBGL | PHASER.AUTO]
     * @param {string} sh - The div name to the DOM object that will contain the instance of the game
     */
    export class Game extends Phaser.Game{

        conf: Superhero.Config;
        gamepad: Gamepads.GamePad;

        constructor () {

            this.conf = new Superhero.Config();
            super(this.conf.WORLD.width, this.conf.WORLD.height, Phaser.CANVAS, 'sh', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('Menu', Menu, false);
            this.state.add('Level1', Level1, false);
            this.state.add('Intro', Intro, false);

            this.state.start('Boot');
        }

    }

}

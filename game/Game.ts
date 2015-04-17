/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="states/Boot.ts"/>
/// <reference path="states/Preloader.ts"/>
/// <reference path="states/Menu.ts"/>
/// <reference path="states/Level1.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="UI.ts"/>


module Superhero{

    export class Game extends Phaser.Game{

        conf: Superhero.Config;

        constructor () {

            this.conf = new Superhero.Config();
            super(this.conf.world.width, this.conf.world.height, Phaser.CANVAS, 'sh', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('Menu', Menu, false);
            this.state.add('Level1', Level1, false);

            this.state.start('Boot');
        }

    }

}

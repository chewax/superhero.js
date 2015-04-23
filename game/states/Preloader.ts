/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Menu.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>

module Superhero {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload () {

            this.preloadBar = this.add.sprite(200,250,'loadbar');
            this.preloadBar.anchor.setTo(0.5);

            this.load.setPreloadSprite(this.preloadBar);
            this.loadAssets();
        }

        create () {

            this.game.state.start('Menu', true, false);
        }

        loadAssets () {
            this.game.load.atlasJSONHash('hero1', '/assets/hero1.png', '/assets/hero1.json');
            this.game.load.atlasJSONHash('badie', '/assets/badie.png', '/assets/badie.json');
            this.game.load.atlasJSONHash('bullets', '/assets/bullets.png', '/assets/bullets.json');
            this.game.load.atlasJSONHash('env', '/assets/environment.png', '/assets/environment.json');
            this.game.load.image('background', '/assets/Background.png');
            this.game.load.image('fuelbar', '/assets/fuel.png');
            this.game.load.image('shadow', '/assets/shadow.png');

            Gamepads.GamePad.preloadAssets(this.game, '/assets');

        }
    }

}

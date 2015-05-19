/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Menu.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>

module Superhero {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload () {

            this.preloadBar = this.add.sprite(this.world.centerX,this.world.centerY,'loadbar');
            this.preloadBar.anchor.setTo(0.5);

            this.load.setPreloadSprite(this.preloadBar);
            this.loadAssets();

        }

        create () {

            this.game.state.start('Menu', true, false);
        }

        loadAssets () {

            //Spritesheets
            this.game.load.atlasJSONHash('hero1', '/assets/hero1.png', '/assets/hero1.json');
            this.game.load.atlasJSONHash('badie', '/assets/hero3.png', '/assets/hero3.json');
            this.game.load.atlasJSONHash('pups', '/assets/pups.png', '/assets/pups.json');
            this.game.load.atlasJSONHash('meteors', '/assets/meteors.png', '/assets/meteors.json');
            this.game.load.atlasJSONHash('bullets', '/assets/bullets.png', '/assets/bullets.json');

            //Single Images
            this.game.load.image('fuelbar', '/assets/fuel.png');
            this.game.load.image('starfield', '/assets/starfield.png');
            this.game.load.image('puinfo', '/assets/PUInfo.png');


            //Audio
            //this.game.load.audio('theme', '/assets/sounds/demon_destroyer.mp3');
            this.game.load.audio('theme', '/assets/sounds/demon_destroyer.ogg');

            // Tentacle bot
            this.game.load.atlasJSONHash('tentabot01', 'assets/tentacleBot.png', '/assets/tentacleBot.json');
            //this.game.load.audio('tentacleMissileLaunch', 'assets/missleLaunc1.ogg');

            // Two handed weapon enemy
            this.game.load.atlasJSONHash('twoHandedWeapon', 'assets/twoHandedWeapon.png', '/assets/twoHandedWeapon.json');

            // Mini Boss
            this.game.load.atlasJSONHash('miniBoss', 'assets/miniBoss.png', '/assets/miniBoss.json');

            // SmallMissileEnemy
            this.game.load.atlasJSONHash('smallMissileEnemy', 'assets/smallMissileEnemy.png', '/assets/smallMissileEnemy.json');

            Gamepads.GamePad.preloadAssets(this.game, '/assets');

        }
    }

}

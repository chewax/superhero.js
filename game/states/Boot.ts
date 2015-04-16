/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Preloader.ts"/>

module Superhero {

    export class Boot extends Phaser.State {
        preload () {
            this.load.image('loadbar','../../assets/progress.jpg');
        }
        create () {

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;


            this.game.state.start('Preloader', true, false);
        }
    }
}

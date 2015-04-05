/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Preloader.ts"/>

module Superhero {

    export class Boot extends Phaser.State {
        preload () {
            //this.load.image('loadbar','../../assets/preloader-bar.png');
        }
        create () {

            //Not supporting mutitouch
            this.input.maxPointers = 1;

            //Phaser will automatically pause if the browser tab the game is in loses focus.
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                // Desktop specific settings
                this.scale.pageAlignHorizontally = true;
                this.scale.width = 800;
                this.scale.height = 600;
            }
            else {
                //Same goes for mobile settings.
                this.scale.minWidth = 480;
                this.scale.minHeight = 640;

                this.scale.maxHeight = 1024;
                this.scale.maxWidth = 768;

                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
            }

            this.game.state.start('Preloader', true, false);
        }
    }
}

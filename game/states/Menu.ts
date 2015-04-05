/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Level1.ts"/>

module Superhero {

    export class Menu extends Phaser.State {

        returnKey: Phaser.Key;

        preload () {

        }


        create () {

            //this.returnKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            //var text = 'Press ENTER to start';
            //var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
            //var menuText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, text, style);
            //menuText.anchor.set(0.5,0.5);

            this.game.state.start('Level1', true, false);

        }

        update () {
            //if (this.returnKey.isDown){
            //    this.game.state.start('Level1', true, false);
            //}
        }
    }
}

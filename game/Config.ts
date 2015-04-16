/// <reference path="../lib/phaser.d.ts"/>

module Superhero {

    export class Config {

        constructor () {

        }

        static gameWidth () :number { return 1200 }
        static gameHeight () :number { return 560 }
        static playerGravityX () :number { return 0 }
        static playerGravityY () :number { return 1750 }
        static playerDrag () :number { return 1500 }
        static spriteScaling () :number { return 0.5 }
        static npcGravity () :number { return 1500 }
        static worldGravity ():number { return 100 }

    }
}

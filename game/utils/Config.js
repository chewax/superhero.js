/// <reference path="../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Config = (function () {
        function Config() {
            this.world = {
                width: 1200,
                height: 550,
                sprite_scaling: 0.5
            };
            this.physics = {
                global: {
                    gravity: { x: 0, y: 100 }
                },
                player: {
                    gravity: { x: 0, y: 1750 },
                    drag: 1500
                },
                npc: {
                    gravity: { x: 0, y: 1500 },
                    drag: 1500
                }
            };
        }
        return Config;
    })();
    Superhero.Config = Config;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=Config.js.map
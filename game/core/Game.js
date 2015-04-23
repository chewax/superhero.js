/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="states/Boot.ts"/>
/// <reference path="states/Preloader.ts"/>
/// <reference path="states/Menu.ts"/>
/// <reference path="states/Level1.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="UI.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Superhero;
(function (Superhero) {
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
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            this.conf = new Superhero.Config();
            _super.call(this, this.conf.world.width, this.conf.world.height, Phaser.CANVAS, 'sh', null);
            this.state.add('Boot', Superhero.Boot, false);
            this.state.add('Preloader', Superhero.Preloader, false);
            this.state.add('Menu', Superhero.Menu, false);
            this.state.add('Level1', Superhero.Level1, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Superhero.Game = Game;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=Game.js.map
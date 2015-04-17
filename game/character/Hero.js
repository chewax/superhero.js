/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Superhero;
(function (Superhero) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game) {
            _super.call(this, game, 'hero1', 100, 100);
            this.setBulletVelocity(1000);
        }
        Hero.prototype.update = function () {
            _super.prototype.update.call(this);
            switch (this._state) {
                case 0 /* STATE_IDLE */: var a = 10;
                case 1 /* STATE_FLY */: var a = 10;
                case 2 /* STATE_SPRINT */: var a = 10;
                case 3 /* STATE_RUNNING */: var a = 10;
                case 4 /* STATE_DIVING */: var a = 10;
            }
            ;
        };
        return Hero;
    })(Superhero.Character);
    Superhero.Hero = Hero;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=Hero.js.map
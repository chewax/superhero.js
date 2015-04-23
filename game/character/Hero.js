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
            var newState = this._state.update();
            // If the update returned a different state then
            // we must exit the previous state, start the new one and assign the new one
            if (newState !== this._state) {
                this._state.exitState();
                newState.enterState();
                this._state = newState;
            }
        };
        return Hero;
    })(Superhero.Character);
    Superhero.Hero = Hero;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=Hero.js.map
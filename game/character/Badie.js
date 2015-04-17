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
    var Badie = (function (_super) {
        __extends(Badie, _super);
        function Badie(game) {
            _super.call(this, game, 'badie', game.width - 150, 100);
            this.setBulletVelocity(-1000);
        }
        return Badie;
    })(Superhero.Character);
    Superhero.Badie = Badie;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=Badie.js.map
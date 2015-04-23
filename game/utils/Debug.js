/// <reference path="../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Debug = (function () {
        function Debug(game) {
            this.game = game;
            this.init();
        }
        Debug.prototype.init = function () {
            var style = { font: "14px Courier", fill: "#ffffff", align: "left" };
            this.info = this.game.add.text(16, 16, ' ', style);
            this.info.lineSpacing = 4;
            this.info.setShadow(2, 2);
        };
        Debug.prototype.update = function () {
            var s = "";
            this.game.time.advancedTiming = true;
            s = s.concat("FPS: " + (this.game.time.fps.toString() || '--') + "\n");
            s = s.concat("Game size: " + this.game.width + " x " + this.game.height + "\n");
            s = s.concat("Actual size: " + this.game.scale.width + " x " + this.game.scale.height + "\n");
            s = s.concat("minWidth: " + this.game.scale.minWidth + " - minHeight: " + this.game.scale.minHeight + "\n");
            s = s.concat("maxWidth: " + this.game.scale.maxWidth + " - maxHeight: " + this.game.scale.maxHeight + "\n");
            s = s.concat("aspect ratio: " + this.game.scale.aspectRatio + "\n");
            s = s.concat("parent is window: " + this.game.scale.parentIsWindow + "\n");
            s = s.concat("bounds x: " + this.game.scale.bounds.x + " y: " + this.game.scale.bounds.y + " width:" + this.game.scale.bounds.width + " height: " + this.game.scale.bounds.height + "\n");
            this.info.text = s;
        };
        return Debug;
    })();
    Superhero.Debug = Debug;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=Debug.js.map
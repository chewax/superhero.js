/**
 * UI Class
 * Wraps the logic to setup and handle the ui
 * @author Daniel Waksman
 */
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="character/Character.ts"/>
var Superhero;
(function (Superhero) {
    var UI = (function () {
        function UI(game, player) {
            this.game = game;
            this.player = player;
            this.createFuelBar();
        }
        UI.prototype.update = function () {
            this.updateFuelBar();
        };
        UI.prototype.updateFuelBar = function () {
            var currentValue = this.player.fuel;
            var maxValue = this.player.maxFuel;
            var barWidth = 200;
            this.fuelBar.cropRect.width = (currentValue / maxValue) * barWidth;
            this.fuelBar.updateCrop();
            this.fuelRemaining.text = Math.ceil(currentValue * 100 / maxValue).toString();
        };
        UI.prototype.createFuelBar = function () {
            this.fuelBar = this.game.add.sprite(20, 20, 'fuelbar');
            this.fuelBar.cropRect = new Phaser.Rectangle(0, 0, 0, 20);
            var style = { font: "14px Arial", fill: "#000", align: "center" };
            this.fuelRemaining = this.game.add.text(25, 30, ' ', style);
            this.fuelRemaining.anchor.y = 0.5;
        };
        return UI;
    })();
    Superhero.UI = UI;
})(Superhero || (Superhero = {}));
//# sourceMappingURL=UI.js.map
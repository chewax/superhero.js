/**
 * UI Class
 * Wraps the logic to setup and handle the ui
 * @author Daniel Waksman
 */

/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="character/Character.ts"/>

module Superhero {

	export class UI {

    game: Phaser.Game;
    player: Superhero.Character;
		fuelBar: Phaser.Sprite;
    fuelRemaining: Phaser.Text;

    constructor(game: Phaser.Game, player: Superhero.Character) {
			this.game = game;
      this.player = player

      this.createFuelBar();
		}

    update ():void {
      this.updateFuelBar();
    }

    updateFuelBar ():void {
      var currentValue = this.player.fuel;
      var maxValue = this.player.maxFuel;
      var barWidth = 200;
      this.fuelBar.cropRect.width = (currentValue / maxValue) * barWidth;
      this.fuelBar.updateCrop();
      this.fuelRemaining.text = Math.ceil(currentValue * 100 / maxValue).toString();
    }

    createFuelBar ():void {
      this.fuelBar = this.game.add.sprite(20, 20, 'fuelbar');
      this.fuelBar.cropRect = new Phaser.Rectangle(0, 0, 0, 20);

      var style = { font: "14px Arial", fill: "#000", align: "center" };
      this.fuelRemaining = this.game.add.text(25, 30, ' ', style);
      this.fuelRemaining.anchor.y = 0.5;
    }


	}

}

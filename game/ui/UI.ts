/**
 * UI Class
 * Wraps the logic to setup and handle the ui
 * @author Daniel Waksman
 */

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>

module Superhero {

	export class UI {

        game: Phaser.Game;
        fuelRemaining: Phaser.Text;
        player: Superhero.Character;
        fuelBar: Phaser.Sprite;

        fireInfo: Phaser.Sprite;
        nukeInfo: Phaser.Sprite;
        warpInfo: Phaser.Sprite;
        coinInfo: Phaser.Sprite;
        shieldInfo: Phaser.Sprite;

        scoreCount: number = 0;
        scoreText: Phaser.Text;

        constructor(game: Phaser.Game, player: Superhero.Character) {
            this.game = game;
            this.player = player;

            //this.createFuelBar();
            this.createScoreBoard();
            this.createPowerUPInfo();
        }

        update ():void {
            //this.updateFuelBar();
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

        createScoreBoard (): void {
            var style = { font: "40px saranaigamebold", fill: "#FF9900", align: "center" };
            this.scoreText = this.game.add.text(35, 100, this.scoreCount.toString(), style);
        }


        scoreUp (amount:number): void {
            this.scoreCount += amount;
            this.scoreText.setText(this.scoreCount.toString());
        }

        createPowerUPInfo(){
            var x = 20;
            var y = 20;
            var style = { font: "40px saranaigamebold", fill: "#FF9900", align: "center" };

            //Fire Info
            this.fireInfo = this.game.add.sprite(x, y, 'puinfo');
            this.fireInfo.addChild(this.game.add.sprite(34, 24, 'pups', 'bullet'));
            this.fireInfo.addChild(this.game.add.text(150, 37, this.player.firePower.toString(), style));
            this.fireInfo.scale.setTo(0.5);

            x = x + this.fireInfo.width + 10;
            //Shield Info
            this.shieldInfo = this.game.add.sprite(x, y, 'puinfo');
            this.shieldInfo.addChild(this.game.add.sprite(28, 33, 'pups', 'shield'));
            this.shieldInfo.addChild(this.game.add.text(150, 37, this.player.shield.toString(), style));
            this.shieldInfo.scale.setTo(0.5);

            x = x + this.shieldInfo.width + 10;
            //Shield Info
            this.coinInfo = this.game.add.sprite(x, y, 'puinfo');
            this.coinInfo.addChild(this.game.add.sprite(27, 29, 'pups', 'coin'));
            this.coinInfo.addChild(this.game.add.text(150, 37, this.player.coins.toString(), style));
            this.coinInfo.scale.setTo(0.5);

        }
	}

}

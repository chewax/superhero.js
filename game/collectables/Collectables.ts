/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>

module Collectables {

    export interface Collectable extends Phaser.Sprite{
        updateCharacter(character: Superhero.Character);
    }

    export class FuelPowerUps extends Phaser.Sprite implements Collectable{

        //In Pertentage
        potency: number = 50;
        constructor(game: Phaser.Game){

            super(game,-10,-10,'heart','frame-1');

            var anim = this.animations.add('base',['frame-1','frame-2','frame-3','frame-4','frame-5','frame-6','frame-7','frame-8'], 10, false, false);
            anim.onComplete.add(this.restartAnimation,this);
        }

        restartAnimation(){
            setTimeout(function(){
                this.play('base');
            }.bind(this), 1000);
        }

        resetFloatation(speed:number = -100, tween:boolean = true){
            this.restartAnimation();
            if (tween) this.game.add.tween(this).to( {y:'+100'} , 1500, Phaser.Easing.Sinusoidal.InOut, true , 400, -1 , true);
            this.body.velocity.x = speed;
            this.scale.setTo(0.1);
            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;
        }

        updateCharacter(character: Superhero.Character){
            character.fuel += character.maxFuel * this.potency / 100;
            if (character.fuel > character.maxFuel) character.fuel = character.maxFuel;

            if (character.firePower < 5) character.firePower += 1;

        }

    }
}
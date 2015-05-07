/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>

module Collectables {

    export interface Collectable extends Phaser.Sprite{
        spawnAt ( x:number, y:number ): void;
        collect ( character: Superhero.Character ): void;
        overlapWithChar ( character: Superhero.Character): void;
    }


    export class BaseCollectable extends Phaser.Sprite implements Collectable {

        constructor(game: Phaser.Game, key:string){
            super(game,100,100,'pups', key);
            this.initPhysics();
        }

        initPhysics(){
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.alive = false;
            this.visible = false;
            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;
        }

        spawnAt ( x:number, y:number ): void {
            this.scale.setTo(0.5);
            this.reset(x,y);
            this.resetFloatation();
        }

        resetFloatation ( speed:number = 10, tween:boolean = true ) {
            this.body.velocity.x = speed;
            if (tween) this.game.add.tween(this).to( {y:'+50'} , 1500, Phaser.Easing.Sinusoidal.InOut, true , 0,  -1 , true);
        }

        collect( character: Superhero.Character ) {

        }

        overlapWithChar (character: Superhero.Character){
            if (this.game.physics.arcade.overlap(character.sprite, this)) {
                this.collect(character);
                this.kill();
            }
        }

    }

    export class ImproveFirePower extends BaseCollectable {

        constructor(game: Phaser.Game){
            super(game, 'bullet');
        }

        collect( character: Superhero.Character ) {
            if (character.firePower < 5) character.firePower += 1;
        }
    }


    export class ImprovedShield extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'shield');
        }

        collect( character: Superhero.Character ) {
            //if (character.firePower < 5) character.firePower += 1;
        }

    }

    export class NukeBomb extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'nuke');
        }

        collect( character: Superhero.Character ) {
            //if (character.firePower < 5) character.firePower += 1;
        }

    }

    export class TimeWarp extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'clock');
        }

        collect( character: Superhero.Character ) {
            //if (character.firePower < 5) character.firePower += 1;
        }

    }

    export class Diamond extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'diamond');
        }

        collect( character: Superhero.Character ) {
            //if (character.firePower < 5) character.firePower += 1;
        }

    }
}
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>

module Collectables {

    export interface Collectable extends Phaser.Sprite{

        spawnAt ( x:number, y:number ): void;
        collect ( character: Superhero.Character ): void;
        overlapWithChar ( character: Superhero.Character): void;
    }

    export class ImproveFirePower extends Phaser.Sprite implements Collectable{

        constructor(game: Phaser.Game){
            super(game,100,100,'pups','bullet');
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

            this.scale.setTo(0.1);
            this.reset(x,y);
            this.resetFloatation();

        }

        resetFloatation ( speed:number = 10, tween:boolean = true ) {
            this.body.velocity.x = speed;
            if (tween) this.game.add.tween(this).to( {y:'+100'} , 1500, Phaser.Easing.Sinusoidal.InOut, true , 400, -1 , true);

        }

        collect( character: Superhero.Character ) {
            if (character.firePower < 5) character.firePower += 1;
        }

        overlapWithChar (character: Superhero.Character){
            if (this.game.physics.arcade.overlap(character.sprite, this)) {
                this.kill();
                this.collect(character);
            }

        }

    }

    export class ImprovedShield extends Phaser.Sprite implements Collectable{

        constructor(game: Phaser.Game){
            super(game,100,100,'pups','shield');
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
            this.scale.setTo(0.1);
            this.reset(x,y);
            this.resetFloatation();
        }

        resetFloatation ( speed:number = 10, tween:boolean = true ) {
            this.body.velocity.x = speed;

            if (tween) this.game.add.tween(this).to( {y:'+100'} , 1500, Phaser.Easing.Sinusoidal.InOut, true , 400, -1 , true);

        }

        collect( character: Superhero.Character ) {
            //if (character.firePower < 5) character.firePower += 1;
        }

        overlapWithChar (character: Superhero.Character){
            if (this.game.physics.arcade.overlap(character.sprite, this)) {
                this.kill();
                this.collect(character);
            }

        }

    }
}
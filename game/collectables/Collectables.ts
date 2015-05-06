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
            super(game,100,100,'heart','frame-1');
            this.initAnimations();
            this.initPhysics();
        }

        initAnimations(){
            var anim = this.animations.add('base',['frame-1','frame-2','frame-3','frame-4','frame-5','frame-6','frame-7','frame-8'], 10, false, false);
            anim.onComplete.add(this.restartAnimation,this);
        }

        initPhysics(){
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.alive = false;
            this.visible = false;
            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;
        }

        spawnAt ( x:number, y:number ): void {
            this.revive();
            this.reset(x,y);
            this.restartAnimation();
            this.resetFloatation();
        }

        restartAnimation(){
            setTimeout(function(){
                this.play('base');
            }.bind(this), 1000);
        }

        resetFloatation ( speed:number = 20, tween:boolean = true ) {
            if (tween) this.game.add.tween(this).to( {y:'+100'} , 1500, Phaser.Easing.Sinusoidal.InOut, true , 400, -1 , true);
            this.body.velocity.x = speed;
            this.scale.setTo(0.1);
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
}
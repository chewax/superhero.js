/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>

module Collectables {

    export interface Collectable extends Phaser.Sprite{
        spawnAt ( x:number, y:number ): void;
        collect ( character: Superhero.Character ): void;
        overlapWithChar ( character: Superhero.Character): boolean;
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

        overlapWithChar (character: Superhero.Character): boolean {
            if (this.game.physics.arcade.overlap(character.sprite, this)) {
                this.collect(character);
                this.kill();
                return true
            }

            return false;
        }

    }

    export class ImproveFirePower extends BaseCollectable {

        constructor(game: Phaser.Game){
            super(game, 'bullet');
        }

        collect( character: Superhero.Character ) {
            if (character.firePower < 5) {
                character.firePower += 1;
                this.game.state.states.Level1.ui.infoText.showCustomText('Fire Power!');
            }
        }
    }


    export class ImprovedShield extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'shield');
        }

        collect( character: Superhero.Character ) {
            if (character.shield < 3) {
                character.shield += 1;
                character.renderShield();
                this.game.state.states.Level1.ui.infoText.showCustomText('Shield On!');
            }
        }

    }

    export class NukeBomb extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'nuke');
        }

        collect( character: Superhero.Character ) {
            character.nukes += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Nuke Collected!');
        }

    }

    export class TimeWarp extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'clock');
        }

        collect( character: Superhero.Character ) {
            character.timeWarps += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Time Warp Collected');
        }

    }

    export class Diamond extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'diamond');
        }

        collect( character: Superhero.Character ) {
            character.coins += 10;
        }

    }

    export class Immunity extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'star');
        }

        collect( character: Superhero.Character ) {
            character.immunity = true;
            this.game.state.states.Level1.ui.infoText.showCustomText('Inmune!');
        }

    }

    export class Bomb extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'rocket');
        }

        collect( character: Superhero.Character ) {
            character.bombs += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Rocket Collected!');
        }

    }

    export class Lives extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'hero1');
        }

        collect( character: Superhero.Character ) {
            character.lives += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('1 UP');
        }

    }


}
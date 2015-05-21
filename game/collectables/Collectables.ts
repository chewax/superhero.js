/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>

module Collectables {

    export interface Collectable extends Phaser.Sprite{
        spawnAt ( x:number, y:number ): void;
        collect ( character: Superhero.Character ): void;
        overlapWithChar ( character: Superhero.Character): boolean;
        loadAnimation (): void;
        playAnimation (): void;
    }


    export class BaseCollectable extends Phaser.Sprite implements Collectable {

        constructor(game: Phaser.Game, key:string){
            super(game,100,100,'pupanim', key);
            this.initPhysics();
            this.loadAnimation();
        }


        loadAnimation(): void {}

        playAnimation(): void {
            this.animations.play('main');
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

        loadAnimation(): void {
            this.animations.add('main', ['bullet1', 'bullet2'], 3, true, false);
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

        loadAnimation(): void {
            this.animations.add('main', ['shield1', 'shield2', 'shield3', 'shield4', 'shield5'], 4, true, false);
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

        loadAnimation(): void {
            this.animations.add('main', ['nuke1', 'nuke2', 'nuke3', 'nuke4', 'nuke5', 'nuke6'], 5, true, false);
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

        loadAnimation(): void {
            this.animations.add('main', ['clock1', 'clock2', 'clock3', 'clock4', 'clock5', 'clock6'], 5, true, false);
        }

    }

    export class Diamond extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'diamond');
        }

        collect( character: Superhero.Character ) {
            character.coins += 10;
        }

        loadAnimation(): void {}

    }

    export class Immunity extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'star');
        }

        collect( character: Superhero.Character ) {
            character.immunity = true;
            this.game.state.states.Level1.ui.infoText.showCustomText('Inmune!');
        }

        loadAnimation(): void {}

    }

    export class Bomb extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'rocket');
        }

        collect( character: Superhero.Character ) {
            character.bombs += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Rocket Collected!');
        }

        loadAnimation(): void {
            this.animations.add('main', ['rocket1', 'rocket2'], 6, true, false);
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

        loadAnimation(): void {
            this.animations.add('main', ['head1', 'head2', 'head3', 'head4', 'head5'], 6, true, false);
        }


    }


}
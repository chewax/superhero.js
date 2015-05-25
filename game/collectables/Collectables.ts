/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
/// <reference path="../character/Hero.ts"/>

module Collectables {

    export interface Collectable extends Phaser.Sprite{
        collectSound: Phaser.Sound;

        spawnAt ( x:number, y:number ): void;
        collect ( character: Superhero.Character ): void;
        overlapWithChar ( character: Superhero.Character): boolean;
        loadAnimation (): void;
        playAnimation (): void;
        loadSound(): void;
        playSound(): void;
    }


    export class BaseCollectable extends Phaser.Sprite implements Collectable {
        soundList: string[];
        collectSound: Phaser.Sound;

        constructor(game: Phaser.Game, key:string){
            super(game,100,100,'pupanim', key);
            this.initPhysics();
            this.loadAnimation();
            this.loadSound();
        }

        loadAnimation(): void {}

        loadSound(): void{
            this.soundList = ['pup1', 'pup2', 'pup3' ,'pup4' ,'pup5' ,'pup6' ,'pup7' ,'pup8' ,'pup9'];
            var rnd = this.game.rnd.integerInRange(0, this.soundList.length-1);
            this.collectSound = this.game.add.sound(this.soundList[rnd], 0.5);
        }

        playSound(): void {
            this.collectSound.play();

            // After play, reset the sound
            this.loadSound();
        }

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
            this.playSound();
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
                this.playSound();
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
                this.playSound();
            }
        }

        loadAnimation(): void {
            this.animations.add('main', ['shield1', 'shield2', 'shield3', 'shield4', 'shield5'], 4, true, false);
        }


        loadSound(): void{
            this.collectSound = this.game.add.sound('shieldCollect', 0.5);
        }

        playSound(): void {
            this.collectSound.play();
        }


    }

    export class NukeBomb extends BaseCollectable{

        constructor(game: Phaser.Game){
            super(game, 'nuke');
        }

        collect( character: Superhero.Character ) {
            character.nukes += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Nuke Collected!');
            this.playSound();
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
            this.playSound();
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
            this.playSound();
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
            this.playSound();
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
            this.playSound();
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
            this.playSound();
        }

        loadAnimation(): void {
            this.animations.add('main', ['head1', 'head2', 'head3', 'head4', 'head5'], 6, true, false);
        }

    }


}
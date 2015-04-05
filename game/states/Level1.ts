/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../Hero.ts"/>
/// <reference path="../Badie.ts"/>

module Superhero {

    export class Level1 extends Phaser.State {

        leftKey: Phaser.Key;
        rightKey: Phaser.Key;
        upKey: Phaser.Key;
        downKey: Phaser.Key;
        spaceKey: Phaser.Key;
        hero: Superhero.Hero;
        badie: Superhero.Badie;
        background: Phaser.TileSprite;
        foregroundItems: Phaser.Group;



        preload () {

        }

        create () {

            //Setup Physics Engine
            this.configurePhysics();

            //Configure Input type
            this.configureInput();

            //Configure Base Stage Options
            this.setBaseStage();

        }

        update () {
            this.hero.diesWithGroup(this.badie.bullets);
            this.badie.diesWithGroup(this.hero.bullets);

            //if (this.game.input.pointer.isDown()){
            //
            //}

            if (this.leftKey.isDown) {
                this.hero.moveLeft();
            }

            else if (this.rightKey.isDown) {
                if (!this.spaceKey.isDown){
                    this.hero.sprint();
                }

            }

            if (this.downKey.isDown) {
                this.hero.descend();

            } else if (this.upKey.isDown) {
                this.hero.climb();
            }

            this.hero.update();
            this.badie.update();


            var park = this.foregroundItems.getFirstDead();

            if (park) {
                park.reset(this.world.width + 50, 600);
                park.body.velocity.x = -900;
                park.scale.setTo(0.5);
                park.angle = -90;
                park.checkWorldBounds = true;
                park.outOfBoundsKill = true;
            }


        }

        configureInput(){

            //Configure Keys
            this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            this.rightKey.onUp.add( function (key) {
                this.hero.stop();
            }, this);

            this.spaceKey.onDown.add( function (key) {
                this.hero.fire();
            }, this);

        }

        configurePhysics() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
        }

        setBaseStage() {
            this.background = this.game.add.tileSprite(0, 0, 2061, 540, 'background');
            this.background.autoScroll(-300, 0);

            this.hero = new Hero(this.game);
            this.badie = new Badie(this.game);

            this.foregroundItems = this.game.add.group();
            this.foregroundItems.enableBody = true;
            this.foregroundItems.createMultiple(1,'env','parkimeter');


        }
    }
}

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../Hero.ts"/>
/// <reference path="../Badie.ts"/>
/// <reference path="../Debug.ts"/>
/// <reference path="../Config.ts"/>

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
        debug: Superhero.Debug;
        drone: Phaser.Sprite;


        preload () {

        }

        create () {

            //Setup Physics Engine
            this.configurePhysics();

            //Configure Input type
            this.configureInput();


            //Configure Base Stage Options
            this.setBaseStage();


            this.debug = new Debug(this.game);

        }

        update () {
            this.hero.diesWithGroup(this.badie.bullets);
            this.hero.collideWithObject(this.hero.shadow);
            this.hero.collideWithObject(this.drone);

            this.badie.collideWithObject(this.badie.shadow);
            this.badie.diesWithGroup(this.hero.bullets);


            if (this.leftKey.isDown) {
                this.hero.moveLeft();
            }

            else if (this.rightKey.isDown) {
                if (!this.spaceKey.isDown){
                    this.hero.sprint();
                }

            }

            if (this.input.activePointer.isDown && this.hero.fuel > 0){
                this.hero.climb();
            }

            if (this.upKey.isDown  && this.hero.fuel > 0) {
                this.hero.climb();
            }

            this.hero.update();
            console.log(this.hero.fuel);
            this.badie.update();
            this.debug.update();


            var park = this.foregroundItems.getFirstDead();

            if (park) {

                park.reset(this.world.width + 50, 600);
                park.body.velocity.x = -900;
                park.scale.setTo(Config.spriteScaling());
                park.body.allowGravity = false;
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
            this.game.physics.arcade.gravity.y = Config.worldGravity();
        }

        setBaseStage() {
            this.background = this.game.add.tileSprite(0, 0, 2061, 540, 'background');
            this.background.autoScroll(-500, 0);


            this.hero = new Hero(this.game);
            this.badie = new Badie(this.game);

            this.foregroundItems = this.game.add.group();
            this.foregroundItems.enableBody = true;

            this.foregroundItems.createMultiple(1,'env','parkimeter');


        }
    }
}

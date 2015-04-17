/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/Badie.ts"/>
/// <reference path="../Debug.ts"/>
/// <reference path="../Config.ts"/>
/// <reference path="../UI.ts"/>

module Superhero {

    export class Level1 extends Phaser.State {

        hero: Superhero.Hero;
        badie: Superhero.Badie;
        background: Phaser.TileSprite;
        foregroundItems: Phaser.Group;
        debug: Superhero.Debug;
        ui: Superhero.UI;


        preload () {

        }

        create () {

            //Setup Physics Engine
            this.configurePhysics();

            //Configure Base Stage Options
            this.setBaseStage();


            this.debug = new Debug(this.game);

        }

        update () {
            this.hero.diesWithGroup(this.badie.bullets);
            this.hero.collideWithObject(this.hero.shadow);

            this.badie.collideWithObject(this.badie.shadow);
            this.badie.diesWithGroup(this.hero.bullets);

            //Updates
            this.hero.update();
            this.badie.update();
            this.ui.update();
            // this.debug.update();

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

            this.ui = new Superhero.UI(this.game, this.hero);

        }
    }
}

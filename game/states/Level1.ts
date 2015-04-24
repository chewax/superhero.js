/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/Badie.ts"/>
/// <reference path="../utils/Debug.ts"/>
/// <reference path="../utils/Config.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>


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
            //this.hero.diesWithGroup(this.badie.bullets);
            this.hero.collideWithObject(this.hero.shadow);

            //this.badie.collideWithObject(this.badie.shadow);
            //this.badie.diesWithGroup(this.hero.bullets);

            //Updates
            this.hero.update();
            //this.badie.update();
            this.ui.update();
            // this.debug.update();

        }

        configurePhysics() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = (<Superhero.Game> this.game).conf.physics.global.gravity.y;
        }

        setBaseStage() {
            this.background = this.game.add.tileSprite(0, 0, 2061, 540, 'background');
            this.background.autoScroll(-500, 0);

            (<Superhero.Game> this.game).gamepad = new Gamepads.GamePad(this.game, Gamepads.GamepadType.STICK_BUTTON, Gamepads.ButtonPadType.ONE_FIXED);
            (<Superhero.Game> this.game).gamepad.buttonPad.button1.type = Gamepads.ButtonType.CUSTOM;
            (<Superhero.Game> this.game).gamepad.stick1.settings.topSpeed = 500;


            this.hero = new Hero(this.game);
            //this.badie = new Badie(this.game);
            this.ui = new Superhero.UI(this.game, this.hero);

        }
    }
}

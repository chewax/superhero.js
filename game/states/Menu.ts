/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Level1.ts"/>
/// <reference path="../plugins/GamePad.ts"/>

module Superhero {

    export class Menu extends Phaser.State {

        returnKey: Phaser.Key;
        menu: Phaser.Sprite;
        paralax1: Phaser.TileSprite;
        paralax2: Phaser.TileSprite;
        background: Phaser.TileSprite;
        hero: Phaser.Sprite;
        theme: Phaser.Sound;
        startSound: Phaser.Sound;
        musicOnOff: Phaser.Sprite;
        musicOnOffText: Phaser.Text;


        preload () {


        }


        create () {

            // Setup paralax layer
            this.paralax2 = this.game.add.tileSprite(0,0,1800,600, 'starfield');
            this.paralax2.autoScroll(-30,0);

            // Setup paralax layer
            this.paralax1 = this.game.add.tileSprite(0,0,1800,600, 'planets');
            this.paralax1.autoScroll(-60,0);

            //this.returnKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.background = this.game.add.tileSprite(0,0,1200,600,'menuBackground');
            this.background.autoScroll(-90,0);

            this.hero = this.game.add.sprite(200, 100, 'hero1', (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION['hero1']["mainSprite"]);
            this.hero.scale.setTo(0.7,0.7);
            var newCharAnims = (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.hero.key]["animations"];
            for (var key in newCharAnims) {
                this.hero.animations.add(key,newCharAnims[key]["frames"], newCharAnims[key]["frameRate"],
                    newCharAnims[key]["loop"], newCharAnims[key]["useNumericIndex"]);
            };


            this.hero.animations.play('fly');
            this.game.input.onDown.add(this.parseMenu, this);
            this.game.physics.arcade.enable(this.hero);


            this.menu = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'mainMenu');
            this.menu.anchor.setTo(0.5, 0.5);

            var musicOnOffsetX = this.world.width - this.world.width/5;
            var musicOnOffsetY = this.world.height - 100;

            var onOffFrame = ((<Superhero.Game> this.game).conf.ISMUSICENABLED? 'on' : 'off');

            var style = { font: "25px saranaigamebold", fill: "#66C8FF", align: "center"};
            this.musicOnOffText = this.game.add.text(musicOnOffsetX - 100, musicOnOffsetY + 15,"SOUND", style);

            this.musicOnOff = this.game.add.sprite(musicOnOffsetX,musicOnOffsetY, 'onoff', onOffFrame);
            this.musicOnOff.inputEnabled = true;
            this.musicOnOff.events.onInputDown.add(this.switchMusic, this);

            this.theme = this.game.add.audio('menuTheme', 0.5);
            this.theme.loop = true;
            this.startSound = this.game.add.audio('menuStart',1);
            if((<Superhero.Game> this.game).conf.ISMUSICENABLED) this.theme.play();
        }

        switchMusic(){
            if((<Superhero.Game> this.game).conf.ISMUSICENABLED) {
                (<Superhero.Game> this.game).conf.ISMUSICENABLED = false;
                this.theme.stop();
                this.musicOnOff.frame = 1;
                localStorage.setItem('superhero.conf', JSON.stringify((<Superhero.Game> this.game).conf));
            } else {
                (<Superhero.Game> this.game).conf.ISMUSICENABLED = true;
                this.theme.play()
                this.musicOnOff.frame = 0;
                localStorage.setItem('superhero.conf', JSON.stringify((<Superhero.Game> this.game).conf));
            }
        }

        parseMenu(event){
            // Calculate the corners of the menu
            var x1 = this.game.world.centerX - this.menu.width/2, x2 = this.game.world.centerX + this.menu.width/2,
                y1 = this.game.world.centerY - this.menu.height/2, y2 = this.game.world.centerY + this.menu.height/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choice = Math.floor((y/4)/23) + 1;
                switch (choice){
                    case 1:
                        this.startSound.play();
                        this.theme.fadeOut(2000);
                        this.hero.body.acceleration.x = 600;

                        setTimeout(function(){
                            this.theme.destroy();
                            this.game.state.start('Level1', true, false);
                        }.bind(this), 2000);

                        break;

                    case 2:
                        this.theme.destroy();
                        this.game.state.start('Intro', true, false);
                        break;

                    case 3:
                        this.game.state.start('Ranking', false, false);
                        break;

                    case 4:
                        break;

                }
            }
        }

        shutdown() {
            this.game.world.removeAll();
        }

    }
}

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


            this.menu = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'mainMenu');
            this.menu.anchor.setTo(0.5, 0.5);

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
                var choice = Math.floor((y/5)/14) + 1;
                switch (choice){
                    case 1:
                        this.game.state.start('Level1', true, false);
                        break;

                    case 2:
                        this.game.state.start('Intro', true, false);
                        break;

                    case 3:
                        this.game.state.start('Settings', false, false);
                        break;

                    case 4:
                        this.game.state.start('Ranking', false, false);
                        break;

                    case 5:
                        window.close();
                        break;

                }
            }
        }

        shutdown() {
            this.game.world.removeAll();
        }

    }
}

/// <reference path="../../lib/phaser.d.ts"/>

module TextInfo {

    export interface IText {
        text: string;
        level: number;
    }

    export enum TextType {
        PRAISE = 1,
        CRITICIZE = 2
    }

    export class InfoTextManager {
        game: Phaser.Game;
        goodJobText: IText[];
        badJobText: IText[];
        comboText: IText[];
        xDirection: number = -1;

        words: Phaser.Text;



        constructor (game:Phaser.Game){
            this.game = game;
            this.goodJobText = [
                {text:"Nice!", level:1},
                {text:"Well Done!", level:3},
                {text:"Keep it up!", level:4},
                {text:"Good Job!", level:6},
                {text:"Perfect!", level:9},
                {text:"Awesome!", level:12},
                {text:"Sublime!", level:15},
                {text:"Oh yeah!", level:18},
                {text:"Superb!", level:21}
            ];

            this.badJobText = [
                {text:"Darn", level:1},
                {text:"Oh god!", level:3},
                {text:"Shall I keep looking?", level:6},
                {text:"Please don't", level:9},
                {text:"You better start practicing!", level:12},
                {text:"Dude!", level:15},
                {text:"Blimey!", level:18},
                {text:"Are you even paying attention?", level:21}
            ];

            this.comboText = [
                {text:"Bullseye", level:1},
                {text:"Marksman", level:2},
                {text:"Smoking", level:3},
                {text:"Multi blow", level:4},
                {text:"Super hit", level:5},
                {text:"Rampage!", level:6},
                {text:"Destruction Spree!", level:7},
                {text:"Unnstopable", level:8},
                {text:"Insane", level:9},
                {text:"Armageddon!", level:10},
                {text:"Godlike", level:11}

            ];

        }

        showGoodJobText(){
            var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center"};

            // Set New Text
            var frase = this.goodJobText[this.game.rnd.integerInRange(0,this.goodJobText.length-1)].text;
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);


            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1,2));
            var newy = txt.y - 100;


            var tween = this.game.add.tween(txt).to({x:newx, y:newy},1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(
                function(){
                    txt.destroy();
                },this);

            this.xDirection *= -1;


        }

        showBadJobText(){
            var style = { font: "30px saranaigamebold", fill: "#FF0000", align: "center"};

            // Set New Text
            var frase = this.badJobText[this.game.rnd.integerInRange(0,this.badJobText.length-1)].text;
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);


            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1,2));
            var newy = txt.y - 100;


            var tween = this.game.add.tween(txt).to({x:newx, y:newy},1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(
                function(){
                    txt.destroy();
                },this);

            this.xDirection *= -1;

        }

        showComboText(level:number){
            var style = { font: "30px saranaigamebold", fill: "#00FF00", align: "center"};

            var frase = "Combo Lost";
            var soundChoices = ['goodJob', 'congratulations', 'greatWork'];
            var sound = this.game.add.audio(soundChoices[this.game.rnd.integerInRange(0,2)],0.8,false);

            // Set New Text
            for (var i = this.comboText.length-1; i>=0; i--){
                if (this.comboText[i].level < level) {
                    frase = this.comboText[i].text;

                    // It is inside this for to avoid playing congrat text upon loosing a level.
                    if ((<Superhero.Game> this.game).conf.ISMUSICENABLED) sound.play();
                    break;
                }
            }


            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);
            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1,2));
            var newy = txt.y - 100;


            var tween = this.game.add.tween(txt).to({x:newx, y:newy},1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(
                function(){
                    txt.destroy();
                },this);

            this.xDirection *= -1;

        }

        showCustomText(frase:string){
            var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center"};

            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);

            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1,2));
            var newy = txt.y - 100;

            var tween = this.game.add.tween(txt).to({x:newx, y:newy},1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(
                function(){
                    txt.destroy();
                },this);

            this.xDirection *= -1;
        }


        showNewRecordText(frase:string = "NEW RECORD!"){

            var style = { font: "50px saranaigamebold", fill: "#27E5E8", align: "center"};
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);

            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1,2));
            var newy = txt.y - 100;

            var tween = this.game.add.tween(txt).to({x:newx, y:newy},1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(
                function(){
                    txt.destroy();
                },this);

            this.xDirection *= -1;
        }

    }
}
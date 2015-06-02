/**
 * UI Class
 * Wraps the logic to setup and handle the ui
 */

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
/// <reference path="../text/TextInfo.ts"/>


module Superhero {

	export class UI {

        game: Phaser.Game;
        player: Superhero.Character;

        // INFO TEXT
        infoText: TextInfo.InfoTextManager;
        comboText: Phaser.Text;
        recordText: Phaser.Text;


        // TIMER
        timer: Phaser.Timer;
        timerText: Phaser.Text;

        // SHIELD
        shieldIcons:Phaser.Sprite[];
        shieldLastCount: number = 0;

        // LIVES
        livesIcon: Phaser.Sprite;
        livesText: Phaser.Text;
        livesLastCount: number = 0;


        // NUKES
        nukesIcon: Phaser.Sprite;
        nukesText: Phaser.Text;
        nukesLastCount: number = 0;

        // WARP
        warpIcon: Phaser.Sprite;
        warpText: Phaser.Text;
        warpLastCount: number = 0;

        // ROCKET
        rocketIcon: Phaser.Sprite;
        rocketText: Phaser.Text;
        rocketLastCount: number = 0;

        // BUTTONS
        pauseButton: Phaser.Sprite;
        menu: Phaser.Sprite;
        menuDisabled: Phaser.Sprite;

        scoreCount: number = 0;
        scoreText: Phaser.Text;
        brokeRecord: boolean = false;
        recordSaved: boolean = false;

        constructor(game: Phaser.Game, player: Superhero.Character) {
            this.game = game;
            this.player = player;
            this.infoText = new TextInfo.InfoTextManager(this.game);
            if(this.game.state.current == "level1") {
                this.game.state.states.Level1.collectableManager.onCollect.removeAll();
                this.game.state.states.Level1.collectableManager.onCollect.add(this.dispatchPraiseText, this);
                this.game.state.states.Level1.hero.onHit.removeAll();
                this.game.state.states.Level1.hero.onHit.add(this.dispatchCriticizeText, this);
            }

            this.createTimer();
            this.createScoreBoard();
            this.createPlayerInterface();
            this.createPowerUpInterface();
        }

        update ():void {

            this.updateShields();
            this.updateLives();
            this.updatePUPIcons();
            this.updateCooldowns();

            if (Math.floor(this.player.comboLevel) > 0) {
                this.comboText.setText("combo X"+Math.floor(this.player.comboLevel+1));
            } else {
                this.comboText.setText("");
            }

            if (this.scoreCount > (<Superhero.Game> this.game).conf.TOPSCORE && !this.brokeRecord ) {
                this.brokeRecord = true;
                this.infoText.showNewRecordText();
            }

            if (!this.player.sprite.alive) this.popUpMenu();

        }

        popUpMenu(){

            if (this.player.sprite.alive) this.menu.reset(this.game.world.centerX, this.game.world.centerY);
            else this.menuDisabled.reset(this.game.world.centerX, this.game.world.centerY);

            this.game.world.bringToTop(this.menu);

            if (!this.recordSaved) (<Superhero.Game> this.game).conf.save();

            this.recordSaved = true;

            this.timer.pause();
            this.game.paused = true;
            this.game.sound.pauseAll();
            this.game.input.onDown.add(this.unPause, this);
        }

        dispatchCriticizeText():void{
            this.infoText.showBadJobText();

        }

        dispatchPraiseText():void {
            this.infoText.showGoodJobText();
        }
        
        createTimer():void {
            var puinfo = this.game.add.sprite(this.game.world.centerX + 60, 10, 'puinfo');
            puinfo.scale.setTo(-0.5,0.5);
            puinfo.inputEnabled = true;
            puinfo.events.onInputDown.add(this.popUpMenu, this);

            this.pauseButton = this.game.add.sprite(this.game.world.centerX + 15, 25, 'pauseBtn');
            this.pauseButton.inputEnabled = true;
            this.pauseButton.scale.setTo(1.5, 1.5);


            this.menu = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menuBack');
            this.menu.anchor.setTo(0.5,0.5);
            this.menu.inputEnabled = true;

            this.menuDisabled = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menuBackDisabled');
            this.menuDisabled.anchor.setTo(0.5,0.5);
            this.menuDisabled.inputEnabled = true;

            this.menu.kill();
            this.menuDisabled.kill();

            this.timer = this.game.time.create(false);
            this.pauseButton.events.onInputDown.add(this.popUpMenu, this);


            var style = { font: "25px saranaigamebold", fill: "#FFFFFF", align: "center" };
            this.timerText = this.game.add.text(this.game.world.centerX - 60, 40, "0:00", style);
            this.timerText.anchor.set(0, 0.5);
            this.timer.loop(Phaser.Timer.SECOND, this.updateTime, this);
            this.timer.start();
        }

        unPause(event){
            // Calculate the corners of the menu;
            var menu = this.player.sprite.alive ? this.menu : this.menuDisabled;


            var x1 = this.game.world.centerX - menu.width/2, x2 = this.game.world.centerX + menu.width/2,
                y1 = this.game.world.centerY - menu.height/2, y2 = this.game.world.centerY + menu.height/2;

            this.game.sound.resumeAll();

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choice = Math.floor(((y/4)-28)/22) + 1;

                switch (choice){
                    case 1:

                        if (!this.player.sprite.alive) return;
                        this.game.input.onDown.remove(this.unPause,this);
                        menu.kill();
                        this.timer.resume();
                        this.game.paused = false;
                        break;

                    case 2:
                        this.game.input.onDown.remove(this.unPause,this);
                        this.timer.resume();
                        this.game.paused = false;
                        this.game.state.restart(true,false);
                        break;

                    case 3:
                        this.game.input.onDown.remove(this.unPause,this);
                        this.timer.resume();
                        this.game.paused = false;
                        this.game.sound.stopAll();
                        this.game.state.start('Menu', true, false);
                        break;

                    default:
                        if (!this.player.sprite.alive) return;
                        this.game.input.onDown.remove(this.unPause,this);
                        this.timer.resume();
                        this.game.paused = false;

                        // Remove the menu
                        menu.kill();

                        break;
                }

            } else {

                if (!this.player.sprite.alive) return;
                // Remove the menu and the label
                menu.kill();

                // Doing it this way to avoid the menu to become invisibly operated
                this.game.input.onDown.remove(this.unPause,this);
                // Unpause the game
                this.game.paused = false;
                this.timer.resume();
            }
        }


        createScoreBoard (): void {
            var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center" };
            this.scoreText = this.game.add.text(20, 50, "", style);
        }

        scoreUp (amount:number): void {
            this.scoreCount += amount * Math.floor(this.player.comboLevel + 1);
            this.scoreText.setText(this.scoreCount.toString());
        }

        updateCooldowns(){
            this.updateNukeCooldown();
            this.updateWarpCooldown();
        }

        updateNukeCooldown(){
            var elapsed = this.game.time.elapsedSecondsSince(this.player.nukeCoolDown);
            var cooldown = 30;

            if (elapsed > cooldown) {
                if (!(<Superhero.PieMask> this.nukesIcon.mask).atRest) (<Superhero.PieMask> this.nukesIcon.mask).drawCircleAtSelf();
                (<Superhero.PieMask> this.nukesIcon.mask).atRest = true;
                return;
            }

            var pj = elapsed / cooldown;
            (<Superhero.PieMask> this.nukesIcon.mask).drawWithFill(pj, 0xFFFFFF, 0.5);
            (<Superhero.PieMask> this.nukesIcon.mask).atRest = false;

        }

        updateWarpCooldown(){
            var elapsed = this.game.time.elapsedSecondsSince(this.player.warpCoolDown);
            var cooldown = 30;

            if (elapsed > cooldown) {
                if (!(<Superhero.PieMask> this.warpIcon.mask).atRest) (<Superhero.PieMask> this.warpIcon.mask).drawCircleAtSelf();
                (<Superhero.PieMask> this.warpIcon.mask).atRest = true;
                return;
            }

            var pj = elapsed / cooldown;
            (<Superhero.PieMask> this.warpIcon.mask).drawWithFill(pj, 0xFFFFFF, 0.5);
            (<Superhero.PieMask> this.warpIcon.mask).atRest = false;

        }

        updateTime(){
            var minutes = Math.floor(this.timer.seconds / 60);
            var seconds = Math.floor(this.timer.seconds - (minutes * 60));
            this.timerText.setText(minutes.toString() + ":" + ( "0" + seconds.toString()).slice(-2) );
        }

        updateShields(){
            if (this.shieldLastCount == this.player.shield) return;
            if (this.shieldLastCount > this.player.shield) this.killNextShield();

            else this.reviveNextShield();
            this.shieldLastCount = this.player.shield;
        }

        updateLives(){
            this.livesText.setText('x'+this.player.lives.toString());
        }

        updatePUPIcons(){
            this.updateNukes();
            this.updateRockets();
            this.updateWarps();
        }

        updateNukes(){
            if (this.nukesLastCount == this.player.nukes) return;
            this.nukesText.setText(this.player.nukes.toString());

            if (this.player.nukes > 0) {
                this.nukesIcon.alpha = 1;
                this.nukesText.alpha = 1;
                (<Superhero.Game> this.game).gamepad.buttonPad.button2.sprite.alpha = 1;
            }

            else
            {
                this.nukesIcon.alpha = 0.3;
                this.nukesText.alpha = 0.3;
                (<Superhero.Game> this.game).gamepad.buttonPad.button2.sprite.alpha = 0.3;
            }

            this.nukesLastCount = this.player.nukes;
        }

        updateRockets(){
            if (this.rocketLastCount == this.player.bombs) return;
            this.rocketText.setText(this.player.bombs.toString());

            if (this.player.bombs > 0) {
                this.rocketIcon.alpha = 1;
                this.rocketText.alpha = 1;
                (<Superhero.Game> this.game).gamepad.buttonPad.button4.sprite.alpha = 1;
            }
            else
            {
                this.rocketIcon.alpha = 0.3;
                this.rocketText.alpha = 0.3;
                (<Superhero.Game> this.game).gamepad.buttonPad.button4.sprite.alpha = 0.3;
            }

            this.rocketLastCount = this.player.bombs;
        }

        updateWarps(){
            if (this.warpLastCount == this.player.timeWarps) return;
            this.warpText.setText(this.player.timeWarps.toString());

            if (this.player.timeWarps > 0) {
                this.warpIcon.alpha = 1;
                this.warpText.alpha = 1;
                (<Superhero.Game> this.game).gamepad.buttonPad.button3.sprite.alpha = 1;
            }

            else
            {
                this.warpIcon.alpha = 0.3;
                this.warpText.alpha = 0.3;
                (<Superhero.Game> this.game).gamepad.buttonPad.button3.sprite.alpha = 0.3;
            }

            this.warpLastCount = this.player.timeWarps;
        }

        /**
         * Renders n Shields starting on (x,y) and moving to the right of the screen
         * @param n Amounts of shields to render
         * @param x Starting x
         * @param y Starting y
         */
        renderShieldIcons(n:number, x:number, y:number){
            for (var i=0; i < n; i++){
                this.shieldIcons[i] = this.game.add.sprite(x, y, 'pups', 'shield_s');
                this.shieldIcons[i].anchor.setTo(0,0.5);
                x = x + this.shieldIcons[i].width + 5;
                this.shieldLastCount += 1;
            }
        }

        /**
         * Revives n Shield icons starting from right to left
         * @param n
         */
        reviveShieldIcon(n:number){
            var revived = 0;
            for (var i=this.player.shield-1; revived < n && i > -1; i--){
                this.shieldIcons[i].revive();
                this.shieldLastCount -= 1;
                revived += 1;
            }
        }


        /**
         * Kills n shield icons, starting from the right.
         * @param n
         */
        killShieldIcon(n:number){
            var killed = 0;
            for (var i=this.shieldIcons.length-1; killed < n && i > -1; i--){
                this.shieldIcons[i].kill();
                this.shieldLastCount -= 1;
                killed += 1;
            }
        }

        killNextShield(){
            for (var i=0; i<this.shieldIcons.length; i++){
                if (!this.shieldIcons[i].alive && i>0) {
                    this.shieldIcons[i-1].kill();
                    return;
                }
            }
            this.shieldIcons[this.shieldIcons.length-1].kill();
        }

        reviveNextShield(){
            for (var i=0; i<this.shieldIcons.length; i++){
                if (!this.shieldIcons[i].alive) {
                    this.shieldIcons[i].revive();
                    return;
                }
            }
        }

        createPlayerInterface () {
            var x = 20;
            var y = 30;

            var style = { font: "20px saranaigamebold", fill: "#FDCD08", align: "center"};

            // LIVES
            this.livesIcon = this.game.add.sprite(x, y, 'pups', 'hero1_s');
            this.livesIcon.anchor.setTo(0,0.5);
            x = x + this.livesIcon.width + 10;
            //this.livesText = this.game.add.text(x, y+5, 'x' + this.player.lives.toString(), style);
            this.livesText = this.game.add.text(x, y+5, '', style);
            this.livesText.anchor.set(0,0.5);
            this.livesLastCount = this.player.lives;
            x = x + this.livesText.width + 10;

            // SHIELDS
            this.shieldIcons = [];
            this.renderShieldIcons(3,x + 20,y);
            this.killShieldIcon(3);


            var style = { font: "40px saranaigamebold", fill: "#FDCD08", align: "center"};
            this.comboText = this.game.add.text(this.game.world.centerX, 100, "", style);
            this.comboText.anchor.set(0.5,0.5);
        }


        createPowerUpInterface () {
            var x = this.game.width - 50;
            var y = 15;

            var style = { font: "15px saranaigamebold", fill: "#FDCD08", align: "center"};

            // NUKES
            this.nukesIcon = this.game.add.sprite(x, y, 'pups', 'nuke_s');
            this.nukesText = this.game.add.text(x + (this.nukesIcon.width / 2) + 1, y + 33, this.player.nukes.toString(), style);
            this.nukesText.anchor.set(0.5,0);
            this.nukesLastCount = this.player.nukes;

            // NUKE ICON MASK
            var mask_x = x + (this.nukesIcon.width / 2);
            var mask_y = y + (this.nukesIcon.height / 2);
            var mask_radius = Math.max(this.nukesIcon.width,this.nukesIcon.height)/2;
            this.nukesIcon.mask = new Superhero.PieMask(this.game, mask_radius, mask_x, mask_y);


            if (this.player.nukes == 0) {
                this.nukesIcon.alpha = 0.3;
                this.nukesText.alpha = 0.3;
                (<Superhero.Game> this.game).gamepad.buttonPad.button2.sprite.alpha = 0.3;
            }


            x = x - (this.nukesIcon.width  + 10);

            // WARPS
            this.warpIcon = this.game.add.sprite(x, y, 'pups', 'clock_s');
            this.warpText = this.game.add.text(x + (this.warpIcon.width / 2) + 1, y + 33, this.player.timeWarps.toString(), style);
            this.warpText.anchor.set(0.5,0);
            this.warpLastCount = this.player.timeWarps;

            // WARP ICON MASK
            mask_x = x + (this.warpIcon.width / 2);
            mask_y = y + (this.warpIcon.height / 2);
            mask_radius = Math.max(this.warpIcon.width,this.warpIcon.height)/2;
            this.warpIcon.mask = new Superhero.PieMask(this.game, mask_radius, mask_x, mask_y);


            if (this.player.timeWarps == 0) {
                this.warpIcon.alpha = 0.3;
                this.warpText.alpha = 0.3;
                (<Superhero.Game> this.game).gamepad.buttonPad.button3.sprite.alpha = 0.3;
            }

            x = x - (this.warpIcon.width  + 10);

            // ROCKETS
            this.rocketIcon = this.game.add.sprite(x, y, 'pups', 'rocket_s');
            this.rocketText = this.game.add.text(x + (this.rocketIcon.width / 2) + 1, y + 33, this.player.bombs.toString(), style);
            this.rocketText.anchor.set(0.5,0);
            this.rocketLastCount = this.player.bombs;

            if (this.player.bombs == 0) {
                this.rocketIcon.alpha = 0.3;
                this.rocketText.alpha = 0.3;
                (<Superhero.Game> this.game).gamepad.buttonPad.button4.sprite.alpha = 0.3;
            }

        }

	}

}

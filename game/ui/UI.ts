/**
 * UI Class
 * Wraps the logic to setup and handle the ui
 * @author Daniel Waksman
 */

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>

module Superhero {

	export class UI {

        game: Phaser.Game;
        player: Superhero.Character;

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


        scoreCount: number = 0;
        scoreText: Phaser.Text;

        constructor(game: Phaser.Game, player: Superhero.Character) {
            this.game = game;
            this.player = player;

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
            //this.updateCoins();

        }



        createTimer():void {
            this.timer = this.game.time.create(false);

            var style = { font: "30px saranaigamebold", fill: "#FFFFFF", align: "center" };
            this.timerText = this.game.add.text(this.game.world.centerX, 35, "0:00", style);
            this.timerText.anchor.set(0, 0.5);
            this.timer.loop(Phaser.Timer.SECOND, this.updateTime, this);
            this.timer.start();
        }


        createScoreBoard (): void {
            var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center" };
            this.scoreText = this.game.add.text(20, 50, this.scoreCount.toString(), style);
        }

        scoreUp (amount:number): void {
            this.scoreCount += amount;
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
            if (this.livesLastCount == this.player.lives) return;
            this.livesText.setText("x" + this.player.lives);
            this.livesLastCount = this.player.lives;
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
            this.livesText = this.game.add.text(x, y+5, 'x' + this.player.lives.toString(), style);
            this.livesText.anchor.set(0,0.5);
            this.livesLastCount = this.player.lives;
            x = x + this.livesText.width + 10;

            // SHIELDS
            this.shieldIcons = [];
            this.renderShieldIcons(3,x,y);
            this.killShieldIcon(3);

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

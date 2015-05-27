/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
/// <reference path="../plugins/GamePad.ts"/>


module Superhero {
    export class Hero extends Character {

        fireNukeSound: Phaser.Sound;
        fireWarpSound: Phaser.Sound;
        fireRocketSound: Phaser.Sound;
        warpEnd: Phaser.Sound;
        takeHitSound: Phaser.Sound;

        constructor (game:Phaser.Game, spriteKey?: string) {
            var sptK;
            if(spriteKey){
                sptK = spriteKey
            } else {
                sptK = "hero1";
            }
            super(game, sptK, game.world.centerX - 200,game.world.centerY);
            this.facing = Facing.RIGHT;
            //this.firePower = 10;
            this.shootDelay = 500;

            this.setBulletVelocity(1000);
        }

        update () {
            super.update();
            var newState = this._state.update();

            // If the update returned a different state then
            // we must exit the previous state, start the new one and assign the new one
            if (newState !== this._state) {
                this._state.exitState();
                newState.enterState();
                this._state = newState;
            }

        }
        updateCombo(amount: number) : void {
            var prevCombo = this.comboLevel;
            this.comboLevel += amount;
            this.game.state.states.Level1.ui.scoreUp(50);
            if (Math.floor(this.comboLevel) > Math.floor(prevCombo)) {
                this.game.state.states.Level1.ui.infoText.showComboText(this.comboLevel);
            }
        }


        fireWarp (): void {

            if (this.timeWarps <= 0 || !this.sprite.alive) return;

            //console.log(this.sprite.body.drag.multiply(this));
            //var slowTween = this.game.add.tween(this.game.time):
            this.game.add.tween(this.game.time).to( {slowMotion:5.0} , 300, Phaser.Easing.Linear.None, true , 0,  0 , false).onComplete.add(
                function(){
                    this.sprite.body.drag.x *= 3*this.game.time.slowMotion;
                    this.sprite.body.drag.y *= 3*this.game.time.slowMotion;
                },this);

            this.game.add.tween(this.game.state.states.Level1.theme).to({volume:0.05}, 300, Phaser.Easing.Linear.None, true , 0,  0 , false);

            this.game.time.events.add(8000, function() {
                this.sprite.body.drag.x /= 3*this.game.time.slowMotion;
                this.sprite.body.drag.y /= 3*this.game.time.slowMotion;
                this.game.add.tween(this.game.time).to( {slowMotion:1.0} , 1000, Phaser.Easing.Linear.None, true , 0,  0 , false);
                this.game.add.tween(this.game.state.states.Level1.theme).to({volume:0.2}, 1000, Phaser.Easing.Linear.None, true , 0,  0 , false);
            }, this);

            this.game.time.events.add(6000, function() {
                if (this.fxEnabled) this.warpEnd.play();
            }, this);

            this.timeWarps -= 1;

            if (this.fxEnabled) this.fireWarpSound.play();

        }

        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        fireRocket (): void {

            if (this.bombs <= 0 || !this.sprite.alive) return;

            this.sprite.animations.play('shoot');

            //Get the first bullet that has gone offscreen
            var rocket = this.rockets.getFirstDead();
            //If there is none (all are still flying) create new one.
            if (!rocket) rocket = this.rockets.create(-10, -10, 'bullets', 'bullet2');

            rocket.anchor.setTo(0.5, 1);
            rocket.reset(this.sprite.x + (this.facing * 40), this.sprite.y + this.sprite.height/2);
            rocket.checkWorldBounds = true;
            rocket.outOfBoundsKill = true;
            rocket.body.velocity.x = this.bulletVelocity;
            rocket.body.allowGravity = false;
            rocket.scale.setTo(0.6);
            //rocket.scale.setTo((<Superhero.Game> this.game).conf.WORLD.sprite_scaling);

            //Reset the timer
            //this.bulletTimer = this.game.time.time;
            this.bombs -= 1;

            if (this.fxEnabled) this.fireRocketSound.play();
        }



        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        fireNuke (): void {

            if (this.nukes <= 0 || !this.sprite.alive) return;
            //var coolDown = this.game.time.elapsedSecondsSince(this.nukeCoolDown);
            //if (coolDown < 30) return;
            //this.nukeCoolDown = this.game.time.time;

            var graphics = this.game.add.graphics(0,0);

            graphics.lineStyle(0);
            graphics.beginFill(0xFFFFFF, 1);
            var rect = graphics.drawRect(0,0,this.game.width, this.game.height);

            var nukeTween = this.game.add.tween(rect);
            nukeTween.to({alpha:0},1500);

            nukeTween.onComplete.add(function(){
                graphics.destroy();
            },this);

            nukeTween.start();
            this.game.state.states.Level1.obstacleManager.killAll();
            this.game.state.states.Level1.enemyManager.killAll();

            //Reset the timer
            this.bulletTimer = this.game.time.time;
            this.nukes -= 1;

            if (this.fxEnabled) this.fireNukeSound.play();
        }

        die (char:Phaser.Sprite, object?:any):boolean {
            var dead = super.die(char, object);
            if (!dead) {
                this.fxEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
                if (this.fxEnabled) this.takeHitSound.play();
            }

            return dead;
        }


        /**
         * Initialize instance audio
         */
        initAudio(): void {
            this.hitSound = this.game.add.audio("enemyHit", 0.5, false);
            this.fireSound = this.game.add.audio(
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["fireSound"],
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["fireVolume"],
                false
            );

            this.fireNukeSound = this.game.add.audio('heroFireNuke', 0.9);
            this.fireWarpSound = this.game.add.audio('heroFireWarp', 0.8);
            this.fireRocketSound = this.game.add.audio('heroFireRocket', 0.2);
            this.warpEnd = this.game.add.audio('heroWarpEnd', 0.8);
            this.takeHitSound = this.game.add.audio('heroGetHit', 0.8);
        }
    }
}
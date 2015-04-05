/// <reference path="../lib/phaser.d.ts"/>

module Superhero {

    export class Character {

        game: Phaser.Game;
        sprite: Phaser.Sprite;
        bullets: Phaser.Group;
        shadow: Phaser.Sprite;

        bulletVelocity: number = 1000;
        floor: number;


        constructor (game:Phaser.Game, assetKey:string, x:number, y:number) {

            this.game = game;

            //Load Sprite
            this.sprite = this.game.add.sprite(x, y, assetKey, 'stand1');
            this.sprite.anchor.setTo(0.5,0);
            this.sprite.scale.setTo(0.5);

            this.game.physics.enable(this.sprite);
            this.sprite.body.drag.setTo(1500);

            this.addAnimations();
            this.initBullets();
            this.initShadow();

            this.floor = this.game.height - 120;;
            this.sprite.play('flystill');

        }

        moveLeft ():void{
            this.sprite.body.velocity.x = -500;
        }

        sprint () : void{
            this.sprite.play('fly');
            this.sprite.body.velocity.x = 800;
        }

        descend (): void{
            if (this.sprite.y < this.floor - this.sprite.height) this.sprite.y += 5;
        }

        climb (): void {
            this.sprite.y -= 5;
        }

        flyStill (): void {

            if (this.sprite.animations.currentAnim.isFinished){
                this.sprite.play('flystill');
            }
        }

        stop (): void {
            this.sprite.animations.play('stop');
        }

        fire (): void {
            if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {

                var bullet = this.bullets.getFirstDead();
                if (!bullet) return;

                this.sprite.animations.play('shoot');

                bullet.anchor.setTo(0.5, 1);
                bullet.reset(this.sprite.x + 40, this.sprite.y + 40);
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
                bullet.body.velocity.x = this.bulletVelocity;
            }
        }

        addAnimations (): void {

            this.sprite.animations.add('flystill',['stand1','stand2'], 8, true, false);
            this.sprite.animations.add('shoot',['shoot1','shoot2', 'shoot3', 'shoot4'], 10, false, false);
            this.sprite.animations.add('flywalk',['walk1','walk2'], 8, true, false);
            this.sprite.animations.add('fly',['fly1','fly2'], 8, true, false);
            this.sprite.animations.add('takehit',['hit1','hit2', 'hit3', 'hit4'], 4, false, false);
            this.sprite.animations.add('stop',['hit1'], 3, false, false);
            this.sprite.body.collideWorldBounds = true;


            this.sprite.events.onAnimationComplete.add(function () {

                this.sprite.animations.stop();
                this.flyStill();

            }, this);
        }

        initBullets (): void {
            // Create a bullet group with Arcade physics
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;

            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(3,'bullets','bullet1');
        }

        initShadow (): void {
            this.shadow = this.game.add.sprite(100, this.game.world.height - 50, 'shadow');
            this.shadow.scale.setTo(0.5);
            this.shadow.anchor.setTo(0.5,0);
        }

        /**
         * Interpolates a value yn defined by coordinates (x1,y1) (x2,y2) and reference value xn
         * @param x1 X Coordinate of first point of the line
         * @param y1 Y Coordinate of first point of the line
         * @param x2 X Coordinate of second point of the line
         * @param y2 Y Coordinate of second point of the line
         * @param xn X Value of the Y value that is looked for
         * @returns {number}
         */
        intepolate(x1:number, y1:number, x2:number, y2:number, xn:number): number {
            return ((xn - x1)*(y2-y1) / (x2-x1)) + y1
        }

        update (): void {

            var x1 = this.game.world.height - 50;
            var y1 = 0.8
            var x2 = 50
            var y2 = 0.5

            var x0 = this.sprite.y;
            var y0 = this.intepolate(x1,y1,x2,y2,x0);

            this.shadow.x = this.sprite.x + 5;
            this.shadow.y = this.floor;
            this.shadow.scale.setTo(y0);
        }

        setBulletVelocity(n:number){
            this.bulletVelocity = n;
        }

        collideWithGroup (group:Phaser.Group): void{
            this.game.physics.arcade.collide(group, this.sprite);
        }

        collideWithObject (object:Phaser.Sprite): void{
            this.game.physics.arcade.collide(object, this.sprite);
        }

        diesWithGroup (group:Phaser.Group): void {
            this.game.physics.arcade.overlap(group, this.sprite, this.die, null , this);
        }

        diesWithObject (object:Phaser.Sprite): void {
            this.game.physics.arcade.overlap(object, this.sprite, this.die, null, this);
        }

        die (char:Phaser.Sprite, object:any) {

            char.play('takehit',4,false,true);
            this.shadow.kill();
            object.kill();

        }

    }
}

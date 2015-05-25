/**
 * Character class.
 * Wraps the logic of creating and upating a character. Should be extended from
 * Hero and Badie
 */

/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="CharStates.ts"/>
/// <reference path="../collectables/Collectables.ts"/>

module Superhero {

    export enum Facing {
        LEFT = -1,
        RIGHT = 1
    }

    export class Character {

        game: Phaser.Game;
        sprite: Phaser.Sprite;
        shieldSprite: Phaser.Sprite;
        bullets: Phaser.Group;
        rockets: Phaser.Group;
        hitSound: Phaser.Sound;
        fireSound: Phaser.Sound;
        soundEnabled: boolean = true;
        fxEnabled: boolean = true;

        shadow: Phaser.Sprite;
        fuel: number;
        maxFuel: number;
        shootDelay: number = 200;
        allowFingerMargin: boolean = true;

        // Power Ups
        firePower: number = 1;
        nukes: number = 0;
        timeWarps: number = 0;
        immunity: boolean = false;
        bombs: number = 0;
        shield: number = 0;
        lives: number = 3;
        coins: number = 0; // 1 Diamond == 10 Coins

        fuelTimer: number;
        bulletTimer: number;
        nukeCoolDown: number = 0;
        warpCoolDown: number = 0;
        dieTimer: number;
        deadSince: number;
        respawnDelay: number = 5000;
        facing: Facing;
        _state: Superhero.CharState;
        idleCallback: Function;

        bulletVelocity: number = 1000;
        floor: number;
        allowGravity: boolean = false;

        onHit: Phaser.Signal;
        comboLevel: number = 0;



        /**
         * Constructor. Creates the Character
         * @param {Phaser.Game} game     the instance of the game to wich it will be created
         * @param {string}      assetKey The name of the asset to which the character will be created
         * @param {number}      x        Initial X coordinate of the character
         * @param {number}      y        Initial Y coordinate of the character
         */
        constructor (game:Phaser.Game, assetKey:string, x:number, y:number) {

            this.game = game;
            this.floor = this.game.height - 80;
            this._state = new Superhero.StateIdle(game, this);
            this.facing = Facing.LEFT;
            this.allowFingerMargin = false;
            this.onHit = new Phaser.Signal;
            this.soundEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
            this.fxEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
            
            this.initSprite(assetKey,x,y);
            this.initPhysics();
            this.addAnimations();
            this.initBullets();
            this.startChar();
            this.initAudio();
        }
        /**
         * Starts the character default behaviour
         */
        startChar(): void {

            this.fuel = 2000;
            this.maxFuel = 2000;
            this.fuelTimer = this.game.time.time;
            this.bulletTimer = this.game.time.time;
            this.nukeCoolDown = this.game.time.time;
            this.warpCoolDown = this.game.time.time;
            this.sprite.play((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"])
            this.setIdleCallback(this.flyStill);
        }

        /**
         * Initialize instance audio
         */
        initAudio(): void {

            this.hitSound = this.game.add.audio(
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["hitSound"],
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["hitSoundVolume"],
                false
            );

            this.fireSound = this.game.add.audio(
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["fireSound"],
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["fireVolume"],
                false
            )
        }

        /**
         * Initializes the character sprite
         * @param {string} assetKey The name of the asset to which the character will be created
         * @param {number} x        Initial X coordinate of the character
         * @param {number} y        Initial Y coordinate of the character
         */
        initSprite (assetKey:string, x:number, y:number):void {

            this.sprite = this.game.add.sprite(x, y, assetKey, (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetKey]["mainSprite"]);

            //TODO Deacrease sprite size not to use scale, or properly update boundaries
            this.sprite.anchor.setTo((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetKey]["anchor"]["x"],
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetKey]["anchor"]["y"]);
            this.sprite.scale.setTo((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetKey]["scale"]);
            if((<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[assetKey]["diesOutOfBounds"]) {
                this.sprite.checkWorldBounds = true;
                this.sprite.outOfBoundsKill = true;
            }
        }

        /**
         * Initalizes the physics of the character
         */
        initPhysics ():void {
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;

            this.sprite.body.gravity.y = (<Superhero.Game> this.game).conf.PHYSICS.player.gravity.y;
            this.sprite.body.drag.x = (<Superhero.Game> this.game).conf.PHYSICS.player.drag;
            this.sprite.body.drag.y = (<Superhero.Game> this.game).conf.PHYSICS.player.drag;
        }
        /**
         * Wraps the left movement logic
         */
        moveLeft ():void{
            this.sprite.body.velocity.x = -500;
        }

        /**
         * Wraps the sprint logic
         */
        sprint () : void{
            this.sprite.play('fly');
            this.sprite.body.velocity.x = 800;
        }

        /**
         * Wraps the descend logic
         */
        descend (): void{
            if (this.sprite.y < this.floor - this.sprite.height) this.sprite.y += 5;
        }

        /**
         * Wraps the climb logic
         */
        climb (): void {
            this.sprite.body.velocity.y = -500;
        }

        /**
         * Wraps the jump logic
         */
        jump (): void {
            if (this.sprite.alive && this.sprite.body.touching.down) {
                this.sprite.body.velocity.y = -650;
            }

        }

        /**
         * Wraps the mid air flight logic
         */
        flyStill (): void {
            if (this.sprite.animations.currentAnim.isFinished){
                this.sprite.play('flystill');
            }
        }

        /**
         * Wraps the run logic
         */
        run (): void {
            if (this.sprite.animations.currentAnim.isFinished){
                this.sprite.play('run');
            }
        }

        move (speed:{x:number ; y:number}): void {

            if (this.allowFingerMargin && (this.sprite.x <= this.game.width / 2 && speed.x < 0)) speed.x = 0;
            this.sprite.body.velocity.x = speed.x * this.game.time.slowMotion;
            if (this.fuel) this.sprite.body.velocity.y = speed.y * this.game.time.slowMotion;

        }

        /**
         * Wraps the stop logic
         */
        stop (): void {
            this.sprite.animations.play('stop');
        }

        shootTimeUp():boolean{
            var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
            return !(elapsedTime < this.shootDelay);
        }

        okToShoot(): boolean{
            if (!this.sprite.alive) return false;
            if ((this.sprite.animations.currentAnim.name == 'shoot') && !this.sprite.animations.currentAnim.isFinished) return false;
            return true;
        }

        canShoot(){
            return this.shootTimeUp() && this.okToShoot();
        }

        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        fire (): void {
            //Thou shalt only shoot if there is no shooting in progress
                ////Check for shootRate
                //var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                //if (elapsedTime < this.shootDelay) return;
                if (!this.canShoot()) return;

                // TODO: implement fire play anim for every child (maybe a propertyor childs.count and hasFireAnim anim)
                this.sprite.animations.play('shoot');

                for (var i = 0; i < this.firePower; i++) {

                    //Get the first bullet that has gone offscreen
                    var bullet = this.bullets.getFirstDead();

                    //If there is none (all are still flying) create new one.
                    if (!bullet) {
                        bullet = this.createNewBullet();
                    }

                    bullet.anchor.setTo(
                        (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["x"],
                        (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["y"]
                    );

                    // Fire sfx
                    this.playFireSound();

                    bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + (10 * i + 1));
                    bullet.checkWorldBounds = true;
                    bullet.outOfBoundsKill = true;

                    bullet.body.velocity.x = this.bulletVelocity * this.game.time.slowMotion;

                    bullet.body.allowGravity = false;
                    bullet.scale.setTo(0.4);
                    //bullet.scale.setTo((<Superhero.Game> this.game).conf.WORLD.sprite_scaling);
                    this.playFireSound();
                }

                //Reset the timer
                this.resetFireTimer();
            }

        /**
         * Resets the bullet timer
         */
        resetFireTimer(): void{
            this.bulletTimer = this.game.time.time;
        }



        /**
         * Adds the animations to the character
         */
        addAnimations (): void {

            var newCharAnims = (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["animations"];
            for (var key in newCharAnims) {
                this.sprite.animations.add(key,newCharAnims[key]["frames"], newCharAnims[key]["frameRate"],
                    newCharAnims[key]["loop"], newCharAnims[key]["useNumericIndex"]);
            };

            this.sprite.events.onAnimationComplete.add(function () {
                if(this.isAlive) {
                    this.sprite.animations.stop();
                    this.idleCallback();
                }
            }, this);
        }



        /**
         * Creates bullets group and enable physics
         */
        initBullets (): void {
            // Create a bullet group with Arcade physics
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.firePower = (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["firePower"];

            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["qty"],
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["key"],
                (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["frame"]);

            this.rockets = this.game.add.group();
            this.rockets.enableBody = true;
            this.rockets.createMultiple(4,'bullets', 'bullet2');
        }

        /**
         * If it is flying, then decrease the fuel, if it is on the ground, slowly increase the fuel
         */
        updateFuel ():void {

            var elapsedTime = this.game.time.elapsedSecondsSince(this.fuelTimer);

            if (elapsedTime > 0.02) {

                this.fuelTimer = this.game.time.time;

                if (this.sprite.body.touching.down){
                    if (this.fuel < this.maxFuel) {
                        this.fuel += 1;

                    }
                } else {
                    if (this.fuel > 5) {
                        this.fuel -= 5;
                    } else {
                        this.fuel = 0;
                    }
                }
            }

        }

        unShield(){
            if (this.sprite.key == 'hero1') {
                this.sprite.removeChildAt(this.shield);
            }
        }

        /**
         * Update method. Here should be all the logic related to the character's game loop
         */
        update (): void {

        }

        /**
         * Sets the bullet velocity to all subsequent shots
         * @param {number} n the new value to the bullet velocity
         */
        setBulletVelocity(n:number){
            this.bulletVelocity = n * this.facing;
        }

        /**
         * Sets collitions of the character with a group
         * @param {Phaser.Group} group Group upon wich the character should collide
         */
        collideWithGroup (group:Phaser.Group): void{
            this.game.physics.arcade.collide(group, this.sprite, null, null, this);
        }

        /**
         * Sets collection of the character with a group
         * @param {Phaser.Group} group Group that the character will collect
         */
        collectsGroup (group:Phaser.Group): void{
            this.game.physics.arcade.collide(group, this.sprite, this.collect, null, this);
        }

        /**
         * Sets the collitions of the character with an object
         * @param {Phaser.Sprite} object Object upon which the character sould collide
         */
        collideWithObject (object:any): void{
            this.game.physics.arcade.collide(object, this.sprite, null, null, this);
        }

        /**
         * Configures the Character to die upon colliding with a group
         * @param {Phaser.Group} group Group that will make the character die
         */
        diesWithGroup (group:Phaser.Group): void {
            this.game.physics.arcade.overlap(group, this.sprite, this.die, null , this);
        }

        /**
         * Configures the Character to die upon colliding with an object
         * @param {Phaser.Sprite} object Object that will make the character die
         */
        diesWithObject (object:Phaser.Sprite): void {
            this.game.physics.arcade.overlap(object, this.sprite, this.die, null, this);
        }

        /**
         * Callback method when the character collides with a deadly object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        die (char:Phaser.Sprite, object?:any) {

            // TODO: implement lives and different animations for enemies
            if((<Superhero.Game> this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["isImmortal"]){
                return false;
            }

            var elapsedTime = this.game.time.elapsedSince(this.dieTimer);
            if (elapsedTime < this.respawnDelay) return false;
            this.dieTimer = this.game.time.time;

            // SFX
            this.playGetHitSound();

            // Ugly workaround
            // lol!
            if(object) {
                if ((<Phaser.Sprite>object).frameName != "blueBeam") {
                    object.kill();
                }
                // Rocket fix
                this.checkRocketCollision(object);
            }

            if (this.sprite.key == "hero1") {
                if (this.comboLevel > 0) this.game.state.states.Level1.ui.infoText.showComboText("Combo Lost!");
                this.comboLevel = 0;
            }

            // Shields
            if (this.shield > 0) {
                this.shield -= 1;
                this.flickerSprite(0xFF0000);
                this.unShield();
                this.onHit.dispatch();
                window.navigator.vibrate(100);
                return false;
            }

            if (this.lives > 1) {
                this.lives -= 1;
                this.onHit.dispatch();
                this.dieReset();
                window.navigator.vibrate([300,300,300,300]);
                return false;
            }

            this.lives -= 1;
            char.alive = false;
            this.deadSince = this.game.time.time;

            // Update combo using enemy sields
            this.updateComboByEnemy();

            if (this.bullets) this.bullets.forEachAlive(function(b){b.kill()},this);
            if (this.rockets) this.rockets.forEachAlive(function(r){r.kill()},this);

            char.animations.play('takehit',4,false,true);
            return true;
        }

        dieReset():void {
            this.sprite.reset(100,this.game.world.centerY);
            var flickerRepeats =  Math.floor(this.respawnDelay / 550);
            Utils.interval(this.flickerSprite.bind(this), 400, flickerRepeats);
            this.firePower = 1;
        }

        updateComboByEnemy(){
            if(sh.state.getCurrentState().key != "Intro") {
                if (this.sprite.key != "smallMissileEnemy" && this.sprite.key != "hero1") {
                    var charShields = (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["shields"];
                    if (charShields == 0) charShields = 1;
                    this.game.state.states.Level1.hero.updateCombo(charShields / 10);
                    this.game.state.states.Level1.ui.scoreUp(charShields * 50);
                }
            }
        }

        flickerSprite(color:number=0xFF0000):void {
            this.sprite.tint = color;
            setTimeout(function(){
                this.sprite.tint = 0xFFFFFF;
            }.bind(this), 150);
        }

        /**
         * Callback method when the character collides with a collectable object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        collect (char:Phaser.Sprite, object:Collectables.Collectable) {
            object.collect(this);
            object.kill();
        }

        /**
         * Creates new bullet
         */
        public createNewBullet(key?: string, frame?: string): Phaser.Sprite{
            var keyBullet;
            var frameBullet;

            if(key && frame){
                keyBullet = key;
                frameBullet = frame;
            } else {
                keyBullet = (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["key"];
                frameBullet = (<Superhero.Game>this.game).conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["frame"];
            }

            return this.bullets.create(
            -200,
            -200,
            keyBullet,
            frameBullet
            );
        }

        checkRocketCollision(object: any): void {
            if(this.shield > 0) {
                if ((<Phaser.Sprite>object).frameName == "bullet2") {
                    this.shield = 0;
                }
            }
        }

        setRespawnDelay(delay: number): void {
            this.respawnDelay = delay;
        }

        canRespawn(): boolean {
            var elapsedTime = this.game.time.elapsedSince(this.deadSince);
            if(elapsedTime > this.respawnDelay) {
                return true;
            }
            return false;
        }

        renderShield():void{
            var shields = ['shield1','shield2','shield3'];
            var shield = this.game.add.sprite(20,95,'shields',shields[this.shield-1]);
            this.game.physics.arcade.enable(shield);
            shield.scale.setTo(2.5,2.5);
            shield.anchor.setTo(0.5,0.5);
            shield.rotation += Phaser.Math.degToRad(90);
            this.sprite.addChild(shield);
        }

        /**
         * Each state has a different idle state (in the intro the character runs on idle, on the main level the character
         flies still. So the State can set the idle state to whichever fits. Note that this does not alter the FSM. It only alters
         the function that is called upon finishing an animation.
         * @param listener the Function Handler
         * @param listenerContext the Context with which it should be called
         */
        setIdleCallback(listener: Function, listenerContext: any = this): void {
            this.idleCallback = listener.bind(listenerContext);
        }

        playGetHitSound(): void {
            this.soundEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
            if(this.soundEnabled) {
                this.hitSound.play();
            }
        }

        playFireSound(){
            this.soundEnabled = (<Superhero.Game> this.game).conf.ISMUSICENABLED;
            if(this.soundEnabled) {
                this.fireSound.play();
            }
        }
    }
}

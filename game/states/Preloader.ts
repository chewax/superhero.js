/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Menu.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>

module Superhero {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;
        loadHolder: Phaser.Sprite;

        preload () {

            this.loadHolder = this.add.sprite(this.world.centerX,this.world.centerY,'loadHolder');
            var offsetX = (this.loadHolder.width/2) - 33;
            var offsetY = 23;
            this.preloadBar = this.add.sprite(this.world.centerX - offsetX,this.world.centerY + offsetY,'loadingBar');
            this.preloadBar.anchor.setTo(0,0.5);
            this.loadHolder.anchor.setTo(0.5);

            this.load.setPreloadSprite(this.preloadBar);
            this.loadAssets();

        }

        create () {
            this.game.state.start('Menu', true, false);
        }

        loadAssets () {

            //Spritesheets
            this.game.load.atlasJSONHash('hero1', '/assets/hero1.png', '/assets/hero1.json');
            this.game.load.atlasJSONHash('herowalking', '/assets/hero1Walking.png', '/assets/hero1.json');
            this.game.load.atlasJSONHash('badie', '/assets/hero3.png', '/assets/hero3.json');
            this.game.load.atlasJSONHash('pups', '/assets/pups.png', '/assets/pups.json');
            this.game.load.atlasJSONHash('meteors', '/assets/meteors.png', '/assets/meteors.json');
            this.game.load.atlasJSONHash('bullets', '/assets/bullets.png', '/assets/bullets.json');
            this.game.load.atlasJSONHash('steel', '/assets/steel.png', '/assets/steel.json');
            this.game.load.atlasJSONHash('shields', '/assets/shields.png', '/assets/shields.json');
            this.game.load.atlasJSONHash('pupanim', '/assets/pupanim.png', '/assets/pupanim.json');
            this.game.load.atlasJSONHash('onoff', '/assets/onoff.png', '/assets/onoff.json');

            // Intro scene
            this.game.load.atlasJSONHash('introScene', '/assets/introScene.png', '/assets/introScene.json');

            //Single Images
            this.game.load.image('starfield', '/assets/starfield.png');
            this.game.load.image('spaceShipBackground1', '/assets/spaceShip1.png');
            this.game.load.image('spaceShipBackground2', '/assets/spaceShip2.png');
            this.game.load.image('planets', '/assets/planets.png');
            this.game.load.image('puinfo', '/assets/PUInfo.png');
            this.game.load.image('pauseBtn', '/assets/pauseBtn.png');
            this.game.load.image('menuBack', '/assets/menuBack.png');
            this.game.load.image('menuBackDisabled', '/assets/menuBack2.png');
            this.game.load.image('mainMenu', '/assets/mainMenu.png');
            this.game.load.image('mainMenuStartDisabled', '/assets/mainMenuStartDisabled.png');
            this.game.load.image('ranking', '/assets/ranking.png');
            this.game.load.image('menuBackground', '/assets/menuBackground.png');
            this.game.load.image('superheroText', '/assets/superheroText.png');

            // Smoke
            this.game.load.image('smoke', 'assets/smoke-puff.png');

            /** Enemies **/

            // Tentacle bot
            this.game.load.atlasJSONHash('tentabot01', 'assets/tentacleBot.png', '/assets/tentacleBot.json');
            //this.game.load.audio('tentacleMissileLaunch', 'assets/missleLaunc1.ogg');
            // Two handed weapon enemy
            this.game.load.atlasJSONHash('twoHandedWeapon', 'assets/twoHandedWeapon.png', '/assets/twoHandedWeapon.json');
            // Mini Boss
            this.game.load.atlasJSONHash('miniBoss', 'assets/miniBoss.png', '/assets/miniBoss.json');
            // SmallMissileEnemy
            this.game.load.atlasJSONHash('smallMissileEnemy', 'assets/smallMissileEnemy.png', '/assets/smallMissileEnemy.json');

            /** Audio **/
            this.game.load.audio('theme', '/assets/sounds/demon_destroyer.ogg');
            this.game.load.audio('introTheme', '/assets/sounds/intro/introTheme.ogg');
            this.game.load.audio('enemyHit', '/assets/sounds/enemyHit.ogg');

            // Menu
            this.game.load.audio('menuTheme', '/assets/sounds/menu.ogg');

            // Hero
            this.game.load.audio('heroFire', '/assets/sounds/hero/fire.ogg');
            this.game.load.audio('heroFireWarp', '/assets/sounds/hero/fireWarp.ogg');
            this.game.load.audio('heroWarpEnd', '/assets/sounds/hero/warpEnd.ogg');
            this.game.load.audio('heroFireRocket', '/assets/sounds/hero/fireRocket.ogg');
            this.game.load.audio('heroFireNuke', '/assets/sounds/hero/fireNuke.ogg');
            this.game.load.audio('heroWarpMeanwhile','/assets/sounds/hero/duringWarp.ogg');
            this.game.load.audio('heroGetHit','/assets/sounds/hero/getHit.ogg');
            this.game.load.audio('heroTakeOff','/assets/sounds/hero/introTakeOff.ogg');
            this.game.load.audio('heroDie','/assets/sounds/hero/die.ogg');


            // PowerUps
            this.game.load.audio('shieldCollect', '/assets/sounds/pups/shield.ogg');
            this.game.load.audio('extraLifeCollect', '/assets/sounds/pups/extraLife.ogg');
            this.game.load.audio('timeWarpCollect', '/assets/sounds/pups/timeWarp.ogg');
            this.game.load.audio('rocketCollect', '/assets/sounds/pups/rocket.ogg');
            this.game.load.audio('nukeCollect', '/assets/sounds/pups/nuke.ogg');
            this.game.load.audio('bulletCollect', '/assets/sounds/pups/bullet.ogg');

            // Cheers
            this.game.load.audio('goodJob', '/assets/sounds/pups/goodJob.ogg');
            this.game.load.audio('congratulations', '/assets/sounds/pups/congratulations.ogg');
            this.game.load.audio('greatWork', '/assets/sounds/pups/greatWork.ogg');

            this.game.load.audio('menuStart', '/assets/sounds/pups/alright.ogg');

            // Mini Boss
            this.game.load.audio('miniBossFire', '/assets/sounds/miniBoss/blast.ogg');

            // Two handed weapon enemy
            this.game.load.audio('twoHandedFire', '/assets/sounds/twoHandedEnemy/twoHandedfire.ogg');
            this.game.load.audio('twoHandedDie', '/assets/sounds/twoHandedEnemy/die.ogg');

            // Tentacle bot
            this.game.load.audio('tentaBotFire', '/assets/sounds/tentacleBot/fire.ogg');

            // Badie
            this.game.load.audio('badieFire', '/assets/sounds/badie/badieFire.ogg');

            // Small missile enemy
            this.game.load.audio('smallMissileWarningSound', '/assets/sounds/smallMissileEnemy/warning.ogg');
            this.game.load.audio('smallMissileSiren', '/assets/sounds/smallMissileEnemy/siren.ogg');
            this.game.load.audio('smallMissileMissile', '/assets/sounds/smallMissileEnemy/missile.ogg');

            // Particles
            this.game.load.audio("obstacle1", '/assets/sounds/obstacles/obetacle1.ogg');
            this.game.load.audio("obstacle2", '/assets/sounds/obstacles/obetacle2.ogg');
            this.game.load.audio("obstacle3", '/assets/sounds/obstacles/obetacle3.ogg');
            this.game.load.audio("obstacle4", '/assets/sounds/obstacles/obetacle4.ogg');
            this.game.load.audio("obstacle5", '/assets/sounds/obstacles/obetacle5.ogg');

            Gamepads.GamePad.preloadAssets(this.game, '/assets');
        }
    }

}

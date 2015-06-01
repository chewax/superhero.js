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

            var basepath = '';

            //Spritesheets
            this.game.load.atlasJSONHash('hero1', basepath + '/assets/hero1.png', basepath + '/assets/hero1.json');
            this.game.load.atlasJSONHash('herowalking', basepath + '/assets/hero1Walking.png', basepath + '/assets/hero1.json');
            this.game.load.atlasJSONHash('badie', basepath + '/assets/hero3.png', basepath + '/assets/hero3.json');
            this.game.load.atlasJSONHash('pups', basepath + '/assets/pups.png', basepath + '/assets/pups.json');
            this.game.load.atlasJSONHash('meteors', basepath + '/assets/meteors.png', basepath + '/assets/meteors.json');
            this.game.load.atlasJSONHash('bullets', basepath + '/assets/bullets.png', basepath + '/assets/bullets.json');
            this.game.load.atlasJSONHash('steel', basepath + '/assets/steel.png', basepath + '/assets/steel.json');
            this.game.load.atlasJSONHash('shields', basepath + '/assets/shields.png', basepath + '/assets/shields.json');
            this.game.load.atlasJSONHash('pupanim', basepath + '/assets/pupanim.png', basepath + '/assets/pupanim.json');
            this.game.load.atlasJSONHash('onoff', basepath + '/assets/onoff.png', basepath + '/assets/onoff.json');

            // Intro scene
            this.game.load.atlasJSONHash('introScene', basepath + '/assets/introScene.png', basepath + '/assets/introScene.json');

            //Single Images
            this.game.load.image('starfield', basepath + '/assets/starfield.png');
            this.game.load.image('spaceShipBackground1', basepath + '/assets/spaceShip1.png');
            this.game.load.image('spaceShipBackground2', basepath + '/assets/spaceShip2.png');
            this.game.load.image('planets', basepath + '/assets/planets.png');
            this.game.load.image('puinfo', basepath + '/assets/PUInfo.png');
            this.game.load.image('pauseBtn', basepath + '/assets/pauseBtn.png');
            this.game.load.image('menuBack', basepath + '/assets/menuBack.png');
            this.game.load.image('menuBackDisabled', basepath + '/assets/menuBack2.png');
            this.game.load.image('mainMenu', basepath + '/assets/mainMenu.png');
            this.game.load.image('mainMenuStartDisabled', basepath + '/assets/mainMenuStartDisabled.png');
            this.game.load.image('ranking', basepath + '/assets/ranking.png');
            this.game.load.image('menuBackground', basepath + '/assets/menuBackground.png');
            this.game.load.image('superheroText', basepath + '/assets/superheroText.png');

            // Smoke
            this.game.load.image('smoke',  basepath + '/assets/smoke-puff.png');

            /** Enemies **/

            // Tentacle bot
            this.game.load.atlasJSONHash('tentabot01', basepath + '/assets/tentacleBot.png', basepath + '/assets/tentacleBot.json');
            // Two handed weapon enemy
            this.game.load.atlasJSONHash('twoHandedWeapon', basepath + '/assets/twoHandedWeapon.png', basepath + '/assets/twoHandedWeapon.json');
            // Mini Boss
            this.game.load.atlasJSONHash('miniBoss', basepath + '/assets/miniBoss.png', basepath + '/assets/miniBoss.json');
            // SmallMissileEnemy
            this.game.load.atlasJSONHash('smallMissileEnemy', basepath + '/assets/smallMissileEnemy.png', basepath + '/assets/smallMissileEnemy.json');

            /** Audio **/
            this.game.load.audio('theme', basepath + '/assets/sounds/demon_destroyer.ogg');
            this.game.load.audio('introTheme', basepath + '/assets/sounds/intro/introTheme.ogg');
            this.game.load.audio('enemyHit', basepath + '/assets/sounds/enemyHit.ogg');

            // Menu
            this.game.load.audio('menuTheme', basepath + '/assets/sounds/menu.ogg');

            // Hero
            this.game.load.audio('heroFire', basepath + '/assets/sounds/hero/fire.ogg');
            this.game.load.audio('heroFireWarp', basepath + '/assets/sounds/hero/fireWarp.ogg');
            this.game.load.audio('heroWarpEnd', basepath + '/assets/sounds/hero/warpEnd.ogg');
            this.game.load.audio('heroFireRocket', basepath + '/assets/sounds/hero/fireRocket.ogg');
            this.game.load.audio('heroFireNuke', basepath + '/assets/sounds/hero/fireNuke.ogg');
            this.game.load.audio('heroWarpMeanwhile',basepath + '/assets/sounds/hero/duringWarp.ogg');
            this.game.load.audio('heroGetHit',basepath + '/assets/sounds/hero/getHit.ogg');
            this.game.load.audio('heroTakeOff',basepath + '/assets/sounds/hero/introTakeOff.ogg');
            this.game.load.audio('heroDie',basepath + '/assets/sounds/hero/die.ogg');


            // PowerUps
            this.game.load.audio('shieldCollect', basepath + '/assets/sounds/pups/shield.ogg');
            this.game.load.audio('extraLifeCollect', basepath + '/assets/sounds/pups/extraLife.ogg');
            this.game.load.audio('timeWarpCollect', basepath + '/assets/sounds/pups/timeWarp.ogg');
            this.game.load.audio('rocketCollect', basepath + '/assets/sounds/pups/rocket.ogg');
            this.game.load.audio('nukeCollect', basepath + '/assets/sounds/pups/nuke.ogg');
            this.game.load.audio('bulletCollect', basepath + '/assets/sounds/pups/bullet.ogg');

            // Cheers
            this.game.load.audio('goodJob', basepath + '/assets/sounds/pups/goodJob.ogg');
            this.game.load.audio('congratulations', basepath + '/assets/sounds/pups/congratulations.ogg');
            this.game.load.audio('greatWork', basepath + '/assets/sounds/pups/greatWork.ogg');

            this.game.load.audio('menuStart', basepath + '/assets/sounds/pups/alright.ogg');

            // Mini Boss
            this.game.load.audio('miniBossFire', basepath + '/assets/sounds/miniBoss/blast.ogg');

            // Two handed weapon enemy
            this.game.load.audio('twoHandedFire', basepath + '/assets/sounds/twoHandedEnemy/twoHandedfire.ogg');
            this.game.load.audio('twoHandedDie', basepath + '/assets/sounds/twoHandedEnemy/die.ogg');

            // Tentacle bot
            this.game.load.audio('tentaBotFire', basepath + '/assets/sounds/tentacleBot/fire.ogg');

            // Badie
            this.game.load.audio('badieFire', basepath + '/assets/sounds/badie/badieFire.ogg');

            // Small missile enemy
            this.game.load.audio('smallMissileWarningSound', basepath + '/assets/sounds/smallMissileEnemy/warning.ogg');
            this.game.load.audio('smallMissileSiren', basepath + '/assets/sounds/smallMissileEnemy/siren.ogg');
            this.game.load.audio('smallMissileMissile', basepath + '/assets/sounds/smallMissileEnemy/missile.ogg');

            // Particles
            this.game.load.audio("obstacle1", basepath + '/assets/sounds/obstacles/obetacle1.ogg');
            this.game.load.audio("obstacle2", basepath + '/assets/sounds/obstacles/obetacle2.ogg');
            this.game.load.audio("obstacle3", basepath + '/assets/sounds/obstacles/obetacle3.ogg');
            this.game.load.audio("obstacle4", basepath + '/assets/sounds/obstacles/obetacle4.ogg');
            this.game.load.audio("obstacle5", basepath + '/assets/sounds/obstacles/obetacle5.ogg');

            Gamepads.GamePad.preloadAssets(this.game, basepath + '/assets');
        }
    }

}

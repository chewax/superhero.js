/// <reference path="../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Utils = (function () {
        function Utils() {
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
        Utils.intepolate = function (x1, y1, x2, y2, xn) {
            return ((xn - x1) * (y2 - y1) / (x2 - x1)) + y1;
        };
        return Utils;
    })();
    Superhero.Utils = Utils;
})(Superhero || (Superhero = {}));
/// <reference path="../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Config = (function () {
        function Config() {
        }
        Config.gameWidth = function () { return 1200; };
        Config.gameHeight = function () { return 560; };
        Config.playerGravityX = function () { return 0; };
        Config.playerGravityY = function () { return 1750; };
        Config.playerDrag = function () { return 1500; };
        Config.spriteScaling = function () { return 0.5; };
        Config.npcGravity = function () { return 1500; };
        Config.worldGravity = function () { return 100; };
        return Config;
    })();
    Superhero.Config = Config;
})(Superhero || (Superhero = {}));
/**
 * Character class.
 * Wraps the logic of creating and upating a character. Should be extended from
 * Hero and Badie
 *
 * @author Daniel Waksman
 */
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="Utils.ts"/>
/// <reference path="Config.ts"/>
var Superhero;
(function (Superhero) {
    var Character = (function () {
        /**
         * Constructor. Creates the Character
         * @param {Phaser.Game} game     the instance of the game to wich it will be created
         * @param {string}      assetKey The name of the asset to which the character will be created
         * @param {number}      x        Initial X coordinate of the character
         * @param {number}      y        Initial Y coordinate of the character
         */
        function Character(game, assetKey, x, y) {
            this.bulletVelocity = 1000;
            this.game = game;
            this.floor = this.game.height - 80;
            ;
            this.initShadow();
            this.initSprite(assetKey, x, y);
            this.initPhysics();
            this.addAnimations();
            this.initBullets();
            this.startChar();
        }
        /**
         * Starts the character default behaviour
         */
        Character.prototype.startChar = function () {
            this.fuel = 100;
            this.fuelTimer = this.game.time.time;
            this.sprite.play('flystill');
        };
        /**
         * Initializes the character sprite
         * @param {string} assetKey The name of the asset to which the character will be created
         * @param {number} x        Initial X coordinate of the character
         * @param {number} y        Initial Y coordinate of the character
         */
        Character.prototype.initSprite = function (assetKey, x, y) {
            this.sprite = this.game.add.sprite(x, y, assetKey, 'stand1');
            this.sprite.anchor.setTo(0.5, 0);
            this.sprite.scale.setTo(Superhero.Config.spriteScaling());
        };
        /**
         * Initalizes the physics of the character
         */
        Character.prototype.initPhysics = function () {
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;
            this.sprite.body.gravity.y = Superhero.Config.playerGravityY();
            this.sprite.body.drag.x = Superhero.Config.playerDrag();
            this.sprite.body.setSize(100, 220);
        };
        /**
         * Wraps the left movement logic
         */
        Character.prototype.moveLeft = function () {
            this.sprite.body.velocity.x = -500;
        };
        /**
         * Wraps the sprint logic
         */
        Character.prototype.sprint = function () {
            this.sprite.play('fly');
            this.sprite.body.velocity.x = 800;
        };
        /**
         * Wraps the descend logic
         */
        Character.prototype.descend = function () {
            if (this.sprite.y < this.floor - this.sprite.height)
                this.sprite.y += 5;
        };
        /**
         * Wraps the climb logic
         */
        Character.prototype.climb = function () {
            this.sprite.body.velocity.y = -500;
        };
        /**
         * Wraps the mid air flight logic
         */
        Character.prototype.flyStill = function () {
            if (this.sprite.animations.currentAnim.isFinished) {
                this.sprite.play('flystill');
            }
        };
        /**
         * Wraps the stop logic
         */
        Character.prototype.stop = function () {
            this.sprite.animations.play('stop');
        };
        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        Character.prototype.fire = function () {
            //Thou shalt only shoot if there is no shooting in progress
            if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {
                //Get the first bullet that has gone offscreen
                var bullet = this.bullets.getFirstDead();
                if (!bullet)
                    return;
                this.sprite.animations.play('shoot');
                bullet.anchor.setTo(0.5, 1);
                //Reposition bullet
                bullet.reset(this.sprite.x + 40, this.sprite.y + 40);
                //Set bullet physics
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
                bullet.body.velocity.x = this.bulletVelocity;
                bullet.body.allowGravity = false;
                bullet.scale.setTo(Superhero.Config.spriteScaling());
            }
        };
        /**
         * Adds the animations to the character
         */
        Character.prototype.addAnimations = function () {
            this.sprite.animations.add('flystill', ['stand1', 'stand2'], 8, true, false);
            this.sprite.animations.add('shoot', ['shoot1', 'shoot2', 'shoot3', 'shoot4'], 10, false, false);
            this.sprite.animations.add('flywalk', ['walk1', 'walk2'], 6, true, false);
            this.sprite.animations.add('fly', ['fly1', 'fly2'], 8, true, false);
            this.sprite.animations.add('takehit', ['hit1', 'hit2', 'hit3', 'hit4'], 4, false, false);
            this.sprite.animations.add('stop', ['hit1'], 3, false, false);
            this.sprite.events.onAnimationComplete.add(function () {
                this.sprite.animations.stop();
                this.flyStill();
            }, this);
        };
        /**
         * Creates bullets group and enable physics
         */
        Character.prototype.initBullets = function () {
            // Create a bullet group with Arcade physics
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(3, 'bullets', 'bullet1');
        };
        /**
         * Inits the character shadow
         */
        Character.prototype.initShadow = function () {
            //Sprite related
            this.shadow = this.game.add.sprite(100, this.floor, 'shadow');
            this.shadow.scale.setTo(Superhero.Config.spriteScaling());
            this.shadow.anchor.setTo(0.5, 0);
            //Physics
            this.game.physics.enable(this.shadow, Phaser.Physics.ARCADE);
            this.shadow.body.immovable = true;
            this.shadow.body.allowGravity = false;
        };
        /**
         * Updates shadow accordingly.
         * Must scale depending of the distance to the character and always keep below the char
         */
        Character.prototype.updateShadow = function () {
            var x1 = this.game.height - 50;
            var y1 = 0.8;
            var x2 = 50;
            var y2 = 0.5;
            var x0 = this.sprite.y;
            var y0 = Superhero.Utils.intepolate(x1, y1, x2, y2, x0);
            this.shadow.x = this.sprite.x + 5;
            this.shadow.scale.setTo(y0);
        };
        /**
         * If it is flying, then decrease the fuel, if it is on the ground, slowly increase the fuel
         */
        Character.prototype.updateFuel = function () {
            var elapsedTime = this.game.time.elapsedSecondsSince(this.fuelTimer);
            if (elapsedTime > 0.02) {
                this.fuelTimer = this.game.time.time;
                if (this.sprite.body.touching.down) {
                    if (this.fuel < 100) {
                        this.fuel += 1;
                    }
                }
                else {
                    if (this.fuel > 0) {
                        this.fuel -= 1;
                    }
                }
            }
        };
        /**
         * Update method. Here should be all the logic related to the character's game loop
         */
        Character.prototype.update = function () {
            this.updateFuel();
            this.updateShadow();
        };
        /**
         * Sets the bullet velocity to all subsequent shots
         * @param {number} n the new value to the bullet velocity
         */
        Character.prototype.setBulletVelocity = function (n) {
            this.bulletVelocity = n;
        };
        /**
         * Sets collitions of the character with a group
         * @param {Phaser.Group} group Group upon wich the character should collide
         */
        Character.prototype.collideWithGroup = function (group) {
            this.game.physics.arcade.collide(group, this.sprite, null, null, this);
        };
        /**
         * Sets the collitions of the character with an object
         * @param {Phaser.Sprite} object Object upon which the character sould collide
         */
        Character.prototype.collideWithObject = function (object) {
            this.game.physics.arcade.collide(object, this.sprite, null, null, this);
        };
        /**
         * Configures the Character to die upon colliding with a group
         * @param {Phaser.Group} group Group that will make the character die
         */
        Character.prototype.diesWithGroup = function (group) {
            this.game.physics.arcade.overlap(group, this.sprite, this.die, null, this);
        };
        /**
         * Configures the Character to die upon colliding with an object
         * @param {Phaser.Sprite} object Object that will make the character die
         */
        Character.prototype.diesWithObject = function (object) {
            this.game.physics.arcade.overlap(object, this.sprite, this.die, null, this);
        };
        /**
         * Callback method when the character collides with a deadly object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        Character.prototype.die = function (char, object) {
            char.play('takehit', 4, false, true);
            this.shadow.kill();
            object.kill();
        };
        return Character;
    })();
    Superhero.Character = Character;
})(Superhero || (Superhero = {}));
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Superhero;
(function (Superhero) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game) {
            _super.call(this, game, 'hero1', 100, 100);
            this.setBulletVelocity(1000);
        }
        return Hero;
    })(Superhero.Character);
    Superhero.Hero = Hero;
})(Superhero || (Superhero = {}));
/// <reference path="../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Badie = (function (_super) {
        __extends(Badie, _super);
        function Badie(game) {
            _super.call(this, game, 'badie', game.width - 150, 100);
            this.setBulletVelocity(-1000);
        }
        return Badie;
    })(Superhero.Character);
    Superhero.Badie = Badie;
})(Superhero || (Superhero = {}));
/// <reference path="../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Debug = (function () {
        function Debug(game) {
            this.game = game;
            this.init();
        }
        Debug.prototype.init = function () {
            var style = { font: "14px Courier", fill: "#ffffff", align: "left" };
            this.info = this.game.add.text(16, 16, ' ', style);
            this.info.lineSpacing = 4;
            this.info.setShadow(2, 2);
        };
        Debug.prototype.update = function () {
            var s = "";
            this.game.time.advancedTiming = true;
            s = s.concat("FPS: " + (this.game.time.fps.toString() || '--') + "\n");
            s = s.concat("Game size: " + this.game.width + " x " + this.game.height + "\n");
            s = s.concat("Actual size: " + this.game.scale.width + " x " + this.game.scale.height + "\n");
            s = s.concat("minWidth: " + this.game.scale.minWidth + " - minHeight: " + this.game.scale.minHeight + "\n");
            s = s.concat("maxWidth: " + this.game.scale.maxWidth + " - maxHeight: " + this.game.scale.maxHeight + "\n");
            s = s.concat("aspect ratio: " + this.game.scale.aspectRatio + "\n");
            s = s.concat("parent is window: " + this.game.scale.parentIsWindow + "\n");
            s = s.concat("bounds x: " + this.game.scale.bounds.x + " y: " + this.game.scale.bounds.y + " width:" + this.game.scale.bounds.width + " height: " + this.game.scale.bounds.height + "\n");
            this.info.text = s;
        };
        return Debug;
    })();
    Superhero.Debug = Debug;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../Hero.ts"/>
/// <reference path="../Badie.ts"/>
/// <reference path="../Debug.ts"/>
/// <reference path="../Config.ts"/>
var Superhero;
(function (Superhero) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.preload = function () {
        };
        Level1.prototype.create = function () {
            //Setup Physics Engine
            this.configurePhysics();
            //Configure Input type
            this.configureInput();
            //Configure Base Stage Options
            this.setBaseStage();
            this.debug = new Superhero.Debug(this.game);
        };
        Level1.prototype.update = function () {
            this.hero.diesWithGroup(this.badie.bullets);
            this.hero.collideWithObject(this.hero.shadow);
            this.hero.collideWithObject(this.drone);
            this.badie.collideWithObject(this.badie.shadow);
            this.badie.diesWithGroup(this.hero.bullets);
            if (this.leftKey.isDown) {
                this.hero.moveLeft();
            }
            else if (this.rightKey.isDown) {
                if (!this.spaceKey.isDown) {
                    this.hero.sprint();
                }
            }
            if (this.input.activePointer.isDown && this.hero.fuel > 0) {
                this.hero.climb();
            }
            if (this.upKey.isDown && this.hero.fuel > 0) {
                this.hero.climb();
            }
            this.hero.update();
            console.log(this.hero.fuel);
            this.badie.update();
            this.debug.update();
            var park = this.foregroundItems.getFirstDead();
            if (park) {
                park.reset(this.world.width + 50, 600);
                park.body.velocity.x = -900;
                park.scale.setTo(Superhero.Config.spriteScaling());
                park.body.allowGravity = false;
                park.angle = -90;
                park.checkWorldBounds = true;
                park.outOfBoundsKill = true;
            }
        };
        Level1.prototype.configureInput = function () {
            //Configure Keys
            this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.rightKey.onUp.add(function (key) {
                this.hero.stop();
            }, this);
            this.spaceKey.onDown.add(function (key) {
                this.hero.fire();
            }, this);
        };
        Level1.prototype.configurePhysics = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = Superhero.Config.worldGravity();
        };
        Level1.prototype.setBaseStage = function () {
            this.background = this.game.add.tileSprite(0, 0, 2061, 540, 'background');
            this.background.autoScroll(-500, 0);
            this.hero = new Superhero.Hero(this.game);
            this.badie = new Superhero.Badie(this.game);
            this.foregroundItems = this.game.add.group();
            this.foregroundItems.enableBody = true;
            this.foregroundItems.createMultiple(1, 'env', 'parkimeter');
        };
        return Level1;
    })(Phaser.State);
    Superhero.Level1 = Level1;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Level1.ts"/>
var Superhero;
(function (Superhero) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        Menu.prototype.preload = function () {
        };
        Menu.prototype.create = function () {
            //this.returnKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            //var text = 'Press ENTER to start';
            //var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
            //var menuText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, text, style);
            //menuText.anchor.set(0.5,0.5);
            this.game.state.start('Level1', true, false);
        };
        Menu.prototype.update = function () {
            //if (this.returnKey.isDown){
            //    this.game.state.start('Level1', true, false);
            //}
        };
        return Menu;
    })(Phaser.State);
    Superhero.Menu = Menu;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Menu.ts"/>
var Superhero;
(function (Superhero) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = this.add.sprite(200, 250, 'loadbar');
            this.preloadBar.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);
            this.loadAssets();
        };
        Preloader.prototype.create = function () {
            this.game.state.start('Menu', true, false);
        };
        Preloader.prototype.loadAssets = function () {
            this.game.load.atlasJSONHash('hero1', '/assets/hero1.png', '/assets/hero1.json');
            this.game.load.atlasJSONHash('badie', '/assets/badie.png', '/assets/badie.json');
            this.game.load.atlasJSONHash('bullets', '/assets/bullets.png', '/assets/bullets.json');
            this.game.load.atlasJSONHash('env', '/assets/environment.png', '/assets/environment.json');
            this.game.load.image('background', '/assets/Background.png');
            this.game.load.image('shadow', '/assets/shadow.png');
        };
        return Preloader;
    })(Phaser.State);
    Superhero.Preloader = Preloader;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Preloader.ts"/>
var Superhero;
(function (Superhero) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('loadbar', '../../assets/progress.jpg');
        };
        Boot.prototype.create = function () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Superhero.Boot = Boot;
})(Superhero || (Superhero = {}));
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="states/Boot.ts"/>
/// <reference path="states/Preloader.ts"/>
/// <reference path="states/Menu.ts"/>
/// <reference path="states/Level1.ts"/>
/// <reference path="Config.ts"/>
var Superhero;
(function (Superhero) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, Superhero.Config.gameWidth(), Superhero.Config.gameHeight(), Phaser.CANVAS, 'sh', null);
            this.conf = new Superhero.Config();
            this.state.add('Boot', Superhero.Boot, false);
            this.state.add('Preloader', Superhero.Preloader, false);
            this.state.add('Menu', Superhero.Menu, false);
            this.state.add('Level1', Superhero.Level1, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Superhero.Game = Game;
})(Superhero || (Superhero = {}));
/// <reference path="Game.ts"/>
var sh;
window.onload = function () {
    sh = new Superhero.Game();
};

/// <reference path="../../lib/phaser.d.ts"/>
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
/**
 * UI Class
 * Wraps the logic to setup and handle the ui
 * @author Daniel Waksman
 */
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
var Superhero;
(function (Superhero) {
    var UI = (function () {
        function UI(game, player) {
            this.game = game;
            this.player = player;
            this.createFuelBar();
        }
        UI.prototype.update = function () {
            this.updateFuelBar();
        };
        UI.prototype.updateFuelBar = function () {
            var currentValue = this.player.fuel;
            var maxValue = this.player.maxFuel;
            var barWidth = 200;
            this.fuelBar.cropRect.width = (currentValue / maxValue) * barWidth;
            this.fuelBar.updateCrop();
            this.fuelRemaining.text = Math.ceil(currentValue * 100 / maxValue).toString();
        };
        UI.prototype.createFuelBar = function () {
            this.fuelBar = this.game.add.sprite(20, 20, 'fuelbar');
            this.fuelBar.cropRect = new Phaser.Rectangle(0, 0, 0, 20);
            var style = { font: "14px Arial", fill: "#000", align: "center" };
            this.fuelRemaining = this.game.add.text(25, 30, ' ', style);
            this.fuelRemaining.anchor.y = 0.5;
        };
        return UI;
    })();
    Superhero.UI = UI;
})(Superhero || (Superhero = {}));
/**
 * Phaser joystick plugin.
 * Usage: In your preloader function call the static method preloadAssets. It will handle the preload of the necessary
 * assets. Then in the Stage in which you want to use the joystick, in the create method, instantiate the class and add such
 * object to the Phaser plugin manager (eg: this.game.plugins.add( myPlugin ))
 * Use the cursor.up / cursor.down / cursor.left / cursor.right methods to check for inputs
 * Use the speed dictionary to retrieve the input speed (if you are going to use an analog joystick)
 */
/// <reference path="../../lib/phaser.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Gamepads;
(function (Gamepads) {
    (function (Sectors) {
        Sectors[Sectors["HALF_LEFT"] = 1] = "HALF_LEFT";
        Sectors[Sectors["HALF_TOP"] = 2] = "HALF_TOP";
        Sectors[Sectors["HALF_RIGHT"] = 3] = "HALF_RIGHT";
        Sectors[Sectors["HALF_BOTTOM"] = 4] = "HALF_BOTTOM";
        Sectors[Sectors["TOP_LEFT"] = 5] = "TOP_LEFT";
        Sectors[Sectors["TOP_RIGHT"] = 6] = "TOP_RIGHT";
        Sectors[Sectors["BOTTOM_RIGHT"] = 7] = "BOTTOM_RIGHT";
        Sectors[Sectors["BOTTOM_LEFT"] = 8] = "BOTTOM_LEFT";
        Sectors[Sectors["ALL"] = 9] = "ALL";
    })(Gamepads.Sectors || (Gamepads.Sectors = {}));
    var Sectors = Gamepads.Sectors;
    /**
     * @class Joystick
     * @extends Phaser.Plugin
     *
     * Implements a floating joystick for touch screen devices
     */
    var Joystick = (function (_super) {
        __extends(Joystick, _super);
        function Joystick(game, sector, gamepadMode) {
            if (gamepadMode === void 0) { gamepadMode = true; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.imageGroup = [];
            this.doUpdate = false;
            this.gamepadMode = true;
            this.game = game;
            this.sector = sector;
            this.gamepadMode = gamepadMode;
            this.pointer = this.game.input.pointer1;
            //Setup the images
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_base'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_segment'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_knob'));
            this.imageGroup.forEach(function (e) {
                e.anchor.set(0.5);
                e.visible = false;
                e.fixedToCamera = true;
            });
            //Setup Default Settings
            this.settings = {
                maxDistanceInPixels: 60,
                singleDirection: false,
                float: true,
                analog: true,
                topSpeed: 200
            };
            //Setup Default State
            this.cursors = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            this.speed = {
                x: 0,
                y: 0
            };
            this.inputEnable();
        }
        /**
         * @function inputEnable
         * enables the plugin actions
         */
        Joystick.prototype.inputEnable = function () {
            this.game.input.onDown.add(this.createStick, this);
            this.game.input.onUp.add(this.removeStick, this);
            this.active = true;
        };
        /**
         * @function inputDisable
         * disables the plugin actions
         */
        Joystick.prototype.inputDisable = function () {
            this.game.input.onDown.remove(this.createStick, this);
            this.game.input.onUp.remove(this.removeStick, this);
            this.active = false;
        };
        Joystick.prototype.inSector = function (pointer) {
            var half_bottom = pointer.position.y > this.game.height / 2;
            var half_top = pointer.position.y < this.game.height / 2;
            var half_right = pointer.position.x > this.game.width / 2;
            var half_left = pointer.position.x < this.game.width / 2;
            if (this.sector == 9 /* ALL */)
                return true;
            if (this.sector == 1 /* HALF_LEFT */ && half_left)
                return true;
            if (this.sector == 3 /* HALF_RIGHT */ && half_right)
                return true;
            if (this.sector == 4 /* HALF_BOTTOM */ && half_bottom)
                return true;
            if (this.sector == 2 /* HALF_TOP */ && half_top)
                return true;
            if (this.sector == 5 /* TOP_LEFT */ && half_top && half_left)
                return true;
            if (this.sector == 6 /* TOP_RIGHT */ && half_top && half_right)
                return true;
            if (this.sector == 7 /* BOTTOM_RIGHT */ && half_bottom && half_right)
                return true;
            if (this.sector == 8 /* BOTTOM_LEFT */ && half_bottom && half_left)
                return true;
            return false;
        };
        /**
         * @function createStick
         * @param pointer
         *
         * visually creates the pad and starts accepting the inputs
         */
        Joystick.prototype.createStick = function (pointer) {
            //If this joystick is not in charge of monitoring the sector that was touched --> return
            if (!this.inSector(pointer))
                return;
            //Else update the pointer (it may be the first touch)
            this.pointer = pointer;
            this.imageGroup.forEach(function (e) {
                e.visible = true;
                e.bringToTop();
                e.cameraOffset.x = this.pointer.worldX;
                e.cameraOffset.y = this.pointer.worldY;
            }, this);
            //Allow updates on the stick while the screen is being touched
            this.doUpdate = true;
            //Start the Stick on the position that is being touched right now
            this.initialPoint = this.pointer.position.clone();
        };
        /**
         * @function removeStick
         * @param pointer
         *
         * Visually removes the stick and stops paying atention to input
         */
        Joystick.prototype.removeStick = function (pointer) {
            if (pointer.id != this.pointer.id)
                return;
            //Deny updates on the stick
            this.doUpdate = false;
            this.imageGroup.forEach(function (e) {
                e.visible = false;
            });
            this.cursors.up = false;
            this.cursors.down = false;
            this.cursors.left = false;
            this.cursors.right = false;
            this.speed.x = 0;
            this.speed.y = 0;
        };
        /**
         * @function receivingInput
         * @returns {boolean}
         *
         * Returns true if any of the joystick "contacts" is activated
         */
        Joystick.prototype.receivingInput = function () {
            return (this.cursors.up || this.cursors.down || this.cursors.left || this.cursors.right);
        };
        /**
         * @function preUpdate
         * Performs the preUpdate plugin actions
         */
        Joystick.prototype.preUpdate = function () {
            if (this.doUpdate) {
                this.setDirection();
            }
        };
        Joystick.prototype.setSingleDirection = function () {
            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (d < maxDistanceInPixels) {
                this.cursors.up = false;
                this.cursors.down = false;
                this.cursors.left = false;
                this.cursors.right = false;
                this.speed.x = 0;
                this.speed.y = 0;
                this.imageGroup.forEach(function (e, i) {
                    e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                    e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                }, this);
                return;
            }
            ;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaY = 0;
                this.pointer.position.y = this.initialPoint.y;
            }
            else {
                deltaX = 0;
                this.pointer.position.x = this.initialPoint.x;
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            if (d > maxDistanceInPixels) {
                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;
                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;
                }
            }
            this.speed.x = Math.round(Math.cos(angle) * this.settings.topSpeed);
            this.speed.y = Math.round(Math.sin(angle) * this.settings.topSpeed);
            angle = angle * 180 / Math.PI;
            this.cursors.up = angle == -90;
            this.cursors.down = angle == 90;
            this.cursors.left = angle == 180;
            this.cursors.right = angle == 0;
            this.imageGroup.forEach(function (e, i) {
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);
        };
        /**
         * @function setDirection
         * Main Plugin function. Performs the calculations and updates the sprite positions
         */
        Joystick.prototype.setDirection = function () {
            if (this.settings.singleDirection) {
                this.setSingleDirection();
                return;
            }
            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (!this.settings.analog) {
                if (d < maxDistanceInPixels) {
                    this.cursors.up = false;
                    this.cursors.down = false;
                    this.cursors.left = false;
                    this.cursors.right = false;
                    this.speed.x = 0;
                    this.speed.y = 0;
                    this.imageGroup.forEach(function (e, i) {
                        e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                        e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                    }, this);
                    return;
                }
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            if (d > maxDistanceInPixels) {
                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;
                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;
                }
            }
            if (this.settings.analog) {
                this.speed.x = Math.round((deltaX / maxDistanceInPixels) * this.settings.topSpeed);
                this.speed.y = Math.round((deltaY / maxDistanceInPixels) * this.settings.topSpeed);
            }
            else {
                this.speed.x = Math.round(Math.cos(angle) * this.settings.topSpeed);
                this.speed.y = Math.round(Math.sin(angle) * this.settings.topSpeed);
            }
            this.cursors.up = (deltaY < 0);
            this.cursors.down = (deltaY > 0);
            this.cursors.left = (deltaX < 0);
            this.cursors.right = (deltaX > 0);
            this.imageGroup.forEach(function (e, i) {
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);
        };
        /**
         * @function preloadAssets
         * @static
         * @param game {Phaser.Game} - An instance of the current Game object
         * @param assets_path {String} - A relative path to the assets directory
         *
         * Static class that preloads all the necesary assets for the joystick. Should be called on the game
         * preload method
         */
        Joystick.preloadAssets = function (game, assets_path) {
            game.load.image('joystick_base', assets_path + '/joystick_base.png');
            game.load.image('joystick_segment', assets_path + '/joystick_segment.png');
            game.load.image('joystick_knob', assets_path + '/joystick_knob.png');
        };
        return Joystick;
    })(Phaser.Plugin);
    Gamepads.Joystick = Joystick;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (ButtonType) {
        ButtonType[ButtonType["SINGLE"] = 1] = "SINGLE";
        ButtonType[ButtonType["TURBO"] = 2] = "TURBO";
        ButtonType[ButtonType["DELAYED_TURBO"] = 3] = "DELAYED_TURBO";
        ButtonType[ButtonType["SINGLE_THEN_TURBO"] = 4] = "SINGLE_THEN_TURBO";
        ButtonType[ButtonType["CUSTOM"] = 5] = "CUSTOM";
    })(Gamepads.ButtonType || (Gamepads.ButtonType = {}));
    var ButtonType = Gamepads.ButtonType;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(game, x, y, key, onPressedCallback, listenerContext, type, width, height) {
            if (type === void 0) { type = 4 /* SINGLE_THEN_TURBO */; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.pressed = false;
            this.game = game;
            this.type = type;
            this.sprite = this.game.add.sprite(x, y, key);
            this.width = width || this.sprite.width;
            this.height = height || this.sprite.height;
            this.sprite.inputEnabled = true;
            if (onPressedCallback == undefined) {
                this.onPressedCallback = this.empty;
            }
            else {
                this.onPressedCallback = onPressedCallback.bind(listenerContext);
            }
            this.sprite.events.onInputDown.add(this.pressButton, this);
            this.sprite.events.onInputUp.add(this.releaseButton, this);
            this.sprite.anchor.setTo(1, 1);
            this.active = true;
        }
        Button.prototype.empty = function () {
        };
        Button.prototype.pressButton = function () {
            switch (this.type) {
                case 1 /* SINGLE */:
                    this.onPressedCallback();
                    break;
                case 2 /* TURBO */:
                    this.pressed = true;
                    break;
                case 3 /* DELAYED_TURBO */:
                    this.timerId = setTimeout(function () {
                        this.pressed = true;
                    }.bind(this), 300);
                    break;
                case 4 /* SINGLE_THEN_TURBO */:
                    this.onPressedCallback();
                    this.timerId = setTimeout(function () {
                        this.pressed = true;
                    }.bind(this), 300);
                    break;
                default:
                    this.pressed = true;
            }
        };
        Button.prototype.releaseButton = function () {
            this.pressed = false;
            clearTimeout(this.timerId);
        };
        Button.prototype.setOnPressedCallback = function (listener, listenerContext) {
            this.onPressedCallback = listener.bind(listenerContext);
        };
        Button.prototype.update = function () {
            //If it is custom, we assume the programmer will check for the state in his own update,
            //we just set the state to pressed
            if (this.pressed && this.type != 5 /* CUSTOM */) {
                this.onPressedCallback();
            }
        };
        return Button;
    })(Phaser.Plugin);
    Gamepads.Button = Button;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Button.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (ButtonPadType) {
        ButtonPadType[ButtonPadType["ONE_FIXED"] = 1] = "ONE_FIXED";
        ButtonPadType[ButtonPadType["TWO_INLINE_X"] = 2] = "TWO_INLINE_X";
        ButtonPadType[ButtonPadType["TWO_INLINE_Y"] = 3] = "TWO_INLINE_Y";
        ButtonPadType[ButtonPadType["THREE_INLINE_X"] = 4] = "THREE_INLINE_X";
        ButtonPadType[ButtonPadType["THREE_INLINE_Y"] = 5] = "THREE_INLINE_Y";
        ButtonPadType[ButtonPadType["THREE_FAN"] = 6] = "THREE_FAN";
        ButtonPadType[ButtonPadType["FOUR_STACK"] = 7] = "FOUR_STACK";
        ButtonPadType[ButtonPadType["FOUR_INLINE_X"] = 8] = "FOUR_INLINE_X";
        ButtonPadType[ButtonPadType["FOUR_INLINE_Y"] = 9] = "FOUR_INLINE_Y";
        ButtonPadType[ButtonPadType["FOUR_FAN"] = 10] = "FOUR_FAN";
        ButtonPadType[ButtonPadType["FIVE_FAN"] = 11] = "FIVE_FAN";
    })(Gamepads.ButtonPadType || (Gamepads.ButtonPadType = {}));
    var ButtonPadType = Gamepads.ButtonPadType;
    var ButtonPad = (function (_super) {
        __extends(ButtonPad, _super);
        function ButtonPad(game, type, buttonSize) {
            _super.call(this, game, new PIXI.DisplayObject());
            this.padding = 10;
            this.game = game;
            this.type = type;
            this.buttonSize = buttonSize;
            switch (this.type) {
                case 1 /* ONE_FIXED */:
                    this.initOneFixed();
                    break;
                case 2 /* TWO_INLINE_X */:
                    this.initTwoInlineX();
                    break;
                case 4 /* THREE_INLINE_X */:
                    this.initThreeInlineX();
                    break;
                case 8 /* FOUR_INLINE_X */:
                    this.initFourInlineX();
                    break;
                case 3 /* TWO_INLINE_Y */:
                    this.initTwoInlineY();
                    break;
                case 5 /* THREE_INLINE_Y */:
                    this.initThreeInlineY();
                    break;
                case 9 /* FOUR_INLINE_Y */:
                    this.initFourInlineY();
                    break;
                case 7 /* FOUR_STACK */:
                    this.initFourStack();
                    break;
                case 6 /* THREE_FAN */:
                    this.initThreeFan();
                    break;
                case 10 /* FOUR_FAN */:
                    this.initFourFan();
                    break;
                case 11 /* FIVE_FAN */:
                    this.initFiveFan();
                    break;
            }
        }
        ButtonPad.prototype.initOneFixed = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            this.game.add.plugin(this.button1);
            return offsetX;
        };
        ButtonPad.prototype.initTwoInlineX = function () {
            var offsetX = this.initOneFixed();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            this.game.add.plugin(this.button2);
            return offsetX;
        };
        ButtonPad.prototype.initThreeInlineX = function () {
            var offsetX = this.initTwoInlineX();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);
            return offsetX;
        };
        ButtonPad.prototype.initFourInlineX = function () {
            var offsetX = this.initThreeInlineX();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);
            return offsetX;
        };
        ButtonPad.prototype.initTwoInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            return offsetY;
        };
        ButtonPad.prototype.initThreeInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initTwoInlineY();
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);
            return offsetY;
        };
        ButtonPad.prototype.initFourInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initThreeInlineY();
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);
            return offsetY;
        };
        ButtonPad.prototype.initFourStack = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            var offsetX = offsetX - this.buttonSize - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
        };
        ButtonPad.prototype.toRadians = function (angle) {
            return angle * (Math.PI / 180);
        };
        ButtonPad.prototype.toDegrees = function (angle) {
            return angle * (180 / Math.PI);
        };
        ButtonPad.prototype.initThreeFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            //Button 1
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button1 = new Gamepads.Button(this.game, bx, by, 'button1');
            this.button1.sprite.scale.setTo(0.7);
            //Button 2
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
        };
        ButtonPad.prototype.initFourFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            this.button1 = new Gamepads.Button(this.game, cx - this.padding, cy - this.padding, 'button1');
            this.button1.sprite.scale.setTo(1.2);
            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
        };
        ButtonPad.prototype.initFiveFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 3;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            this.button1 = new Gamepads.Button(this.game, cx, cy, 'button1');
            this.button1.sprite.scale.setTo(1.2);
            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.7);
            //Button 5
            bx = cx + Math.cos(angle + (angleStep * 3)) * radius;
            by = cy + Math.sin(angle + (angleStep * 3)) * radius;
            this.button5 = new Gamepads.Button(this.game, bx, by, 'button5');
            this.button5.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
            this.game.add.plugin(this.button5);
        };
        ButtonPad.preloadAssets = function (game, assets_path) {
            game.load.image('button1', assets_path + '/button1.png');
            game.load.image('button2', assets_path + '/button2.png');
            game.load.image('button3', assets_path + '/button3.png');
            game.load.image('button4', assets_path + '/button4.png');
            game.load.image('button5', assets_path + '/button5.png');
        };
        return ButtonPad;
    })(Phaser.Plugin);
    Gamepads.ButtonPad = ButtonPad;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>
/// <reference path="Button.ts"/>
/// <reference path="ButtonPad.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (GampadType) {
        GampadType[GampadType["SINGLE_STICK"] = 1] = "SINGLE_STICK";
        GampadType[GampadType["DOUBLE_STICK"] = 2] = "DOUBLE_STICK";
        GampadType[GampadType["STICK_BUTTON"] = 3] = "STICK_BUTTON";
        GampadType[GampadType["CORNER_STICKS"] = 4] = "CORNER_STICKS";
    })(Gamepads.GampadType || (Gamepads.GampadType = {}));
    var GampadType = Gamepads.GampadType;
    var GamePad = (function (_super) {
        __extends(GamePad, _super);
        function GamePad(game, type, buttonPadType) {
            _super.call(this, game, new PIXI.DisplayObject());
            this.test = 0;
            this.game = game;
            switch (type) {
                case 2 /* DOUBLE_STICK */:
                    this.initDoublStick();
                    break;
                case 1 /* SINGLE_STICK */:
                    this.initSingleStick();
                    break;
                case 3 /* STICK_BUTTON */:
                    this.initStickButton(buttonPadType);
                    break;
                case 4 /* CORNER_STICKS */:
                    this.initCornerSticks();
                    break;
            }
        }
        GamePad.prototype.initDoublStick = function () {
            this.stick1 = new Gamepads.Joystick(this.game, 1 /* HALF_LEFT */);
            this.stick2 = new Gamepads.Joystick(this.game, 3 /* HALF_RIGHT */);
            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);
        };
        GamePad.prototype.initCornerSticks = function () {
            //Add 2 extra pointers (2 by default + 2 Extra)
            this.game.input.addPointer();
            this.game.input.addPointer();
            this.stick1 = new Gamepads.Joystick(this.game, 8 /* BOTTOM_LEFT */);
            this.stick2 = new Gamepads.Joystick(this.game, 5 /* TOP_LEFT */);
            this.stick3 = new Gamepads.Joystick(this.game, 6 /* TOP_RIGHT */);
            this.stick4 = new Gamepads.Joystick(this.game, 7 /* BOTTOM_RIGHT */);
            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);
            this.game.add.plugin(this.stick3, null);
            this.game.add.plugin(this.stick4, null);
        };
        GamePad.prototype.initSingleStick = function () {
            this.stick1 = new Gamepads.Joystick(this.game, 9 /* ALL */);
            this.game.add.plugin(this.stick1, null);
        };
        GamePad.prototype.initStickButton = function (buttonPadType) {
            var style = { font: "14px Courier", fill: "#ffffff", align: "left" };
            this.info = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '0', style);
            this.stick1 = new Gamepads.Joystick(this.game, 1 /* HALF_LEFT */);
            this.game.add.plugin(this.stick1, null);
            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);
            function pressTest() {
                this.test += 1;
                this.info.text = this.test.toString();
            }
            //FOR TESTING
            this.buttonPad.button1.setOnPressedCallback(pressTest, this);
            //this.buttonPad.button2.setOnPressedCallback(pressTest,this);
            //this.buttonPad.button3.setOnPressedCallback(pressTest,this);
            //this.buttonPad.button4.setOnPressedCallback(pressTest,this);
            //this.buttonPad.button5.setOnPressedCallback(pressTest,this);
        };
        GamePad.preloadAssets = function (game, assets_path) {
            Gamepads.Joystick.preloadAssets(game, assets_path);
            Gamepads.ButtonPad.preloadAssets(game, assets_path);
        };
        return GamePad;
    })(Phaser.Plugin);
    Gamepads.GamePad = GamePad;
})(Gamepads || (Gamepads = {}));
/**
 * @author Daniel Waksman
 */
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * Contains all the generic behaviour for the States.
     * @class BaseState
     * @implements CharState
     * @param {Phaser.Game} game - the instance of the current game
     * @param {Superhero.Character} hero - the instance of the player character
     *
     */
    var BaseState = (function () {
        /**
         * @param {Phaser.game} game instance
         * @param {Superher.Character} hero instance
         */
        function BaseState(game, hero) {
            this.game = game;
            this.hero = hero;
            this.gamepad = this.game.gamepad;
            this.fireButton = this.gamepad.buttonPad.button1;
            this.heroStick = this.gamepad.stick1;
        }
        BaseState.prototype.update = function () {
            return null;
        };
        BaseState.prototype.enterState = function () {
        };
        BaseState.prototype.exitState = function () {
        };
        return BaseState;
    })();
    /**
     * STATE_IDLE Class
     */
    var StateIdle = (function (_super) {
        __extends(StateIdle, _super);
        function StateIdle() {
            _super.apply(this, arguments);
        }
        /**
         * @function update
         * Manages input for state idle.
         * STATE_IDLE + FIRE      --> (fire) IDLE
         * STATE_IDLE + TOUCH     --> FLY
         * STATE_IDLE + SPRINT    --> SPRINT
         * STATE_IDLE + RETREAT   --> RETREAT
         * STATE_IDLE + NULL      --> IDLE
         * @returns {CharState}
         */
        StateIdle.prototype.update = function () {
            //If fire on idle. Fire and remain in same state
            if (this.fireButton.pressed) {
                this.hero.fire();
            }
            //If commanded to climb and hero still has fuel then change state to STATE_FLY
            if (this.heroStick.cursors.up && this.hero.fuel > 0) {
                return new StateFly(this.game, this.hero);
            }
            //If commanded to sprint then change state to STATE_SPRINT
            if (this.heroStick.cursors.right) {
                return new StateSprint(this.game, this.hero);
            }
            //If commanded to retreat then change state to STATE_RETREAT
            if (this.heroStick.cursors.left) {
                return new StateRetreating(this.game, this.hero);
            }
            //If nothing was commanded remain on the same state
            return this;
        };
        StateIdle.prototype.enterState = function () {
        };
        StateIdle.prototype.exitState = function () {
        };
        return StateIdle;
    })(BaseState);
    Superhero.StateIdle = StateIdle;
    /**
     * STATE_FLY Class
     */
    var StateFly = (function (_super) {
        __extends(StateFly, _super);
        function StateFly() {
            _super.apply(this, arguments);
        }
        StateFly.prototype.update = function () {
            //This state is all about climbing, so climb!
            this.hero.climb();
            //If fire on idle. Fire and remain in same state
            if (this.fireButton.pressed) {
                this.hero.fire();
            }
            //If commanded to sprint then change state to STATE_SPRINT
            if (this.heroStick.cursors.right) {
                return new StateSprint(this.game, this.hero);
            }
            //If commanded to retreat then change state to STATE_RETREAT
            if (this.heroStick.cursors.left) {
                return new StateRetreating(this.game, this.hero);
            }
            //If climb command has stopped or run out of fuel then change state to STATE_DIVING
            if (!this.heroStick.receivingInput() || this.hero.fuel == 0) {
                return new StateDiving(this.game, this.hero);
            }
            return this;
        };
        StateFly.prototype.enterState = function () {
        };
        StateFly.prototype.exitState = function () {
        };
        return StateFly;
    })(BaseState);
    Superhero.StateFly = StateFly;
    /**
     * STATE_SPRINT Class
     */
    var StateSprint = (function (_super) {
        __extends(StateSprint, _super);
        function StateSprint() {
            _super.apply(this, arguments);
        }
        StateSprint.prototype.update = function () {
            this.hero.sprint();
            if (this.fireButton.pressed) {
                this.hero.fire();
            }
            if (this.heroStick.cursors.up && this.hero.fuel > 0) {
                this.hero.climb();
            }
            if (!this.heroStick.receivingInput()) {
                return new StateIdle(this.game, this.hero);
            }
            return this;
        };
        StateSprint.prototype.enterState = function () {
        };
        StateSprint.prototype.exitState = function () {
            this.hero.stop();
        };
        return StateSprint;
    })(BaseState);
    Superhero.StateSprint = StateSprint;
    /**
     * STATE_RETREAT Class
     */
    var StateRetreating = (function (_super) {
        __extends(StateRetreating, _super);
        function StateRetreating() {
            _super.apply(this, arguments);
        }
        StateRetreating.prototype.update = function () {
            this.hero.moveLeft();
            if (this.fireButton.pressed) {
                this.hero.fire();
            }
            if (this.heroStick.cursors.up && this.hero.fuel > 0) {
                this.hero.climb();
            }
            if (!this.heroStick.receivingInput()) {
                return new StateIdle(this.game, this.hero);
            }
            return this;
        };
        StateRetreating.prototype.enterState = function () {
        };
        StateRetreating.prototype.exitState = function () {
        };
        return StateRetreating;
    })(BaseState);
    Superhero.StateRetreating = StateRetreating;
    /**
     * STATE_DIVING Class
     */
    var StateDiving = (function (_super) {
        __extends(StateDiving, _super);
        function StateDiving() {
            _super.apply(this, arguments);
        }
        StateDiving.prototype.update = function () {
            if (this.fireButton.pressed) {
                this.hero.fire();
            }
            if (this.heroStick.cursors.up && this.hero.fuel > 0) {
                return new StateFly(this.game, this.hero);
            }
            if (this.hero.sprite.body.touching.down) {
                return new StateIdle(this.game, this.hero);
            }
            if (this.heroStick.cursors.right) {
                return new StateSprint(this.game, this.hero);
            }
            if (this.heroStick.cursors.left) {
                return new StateRetreating(this.game, this.hero);
            }
            return this;
        };
        StateDiving.prototype.enterState = function () {
        };
        StateDiving.prototype.exitState = function () {
        };
        return StateDiving;
    })(BaseState);
    Superhero.StateDiving = StateDiving;
})(Superhero || (Superhero = {}));
/**
 * Character class.
 * Wraps the logic of creating and upating a character. Should be extended from
 * Hero and Badie
 *
 * @author Daniel Waksman
 */
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="CharStates.ts"/>
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
            this._state = new Superhero.StateIdle(game, this);
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
            this.fuel = 2000;
            this.maxFuel = 2000;
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
            this.sprite.scale.setTo(this.game.conf.world.sprite_scaling);
        };
        /**
         * Initalizes the physics of the character
         */
        Character.prototype.initPhysics = function () {
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;
            this.sprite.body.gravity.y = this.game.conf.physics.player.gravity.y;
            this.sprite.body.drag.x = this.game.conf.physics.player.drag;
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
                bullet.scale.setTo(this.game.conf.world.sprite_scaling);
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
            this.shadow.scale.setTo(this.game.conf.world.sprite_scaling);
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
                    if (this.fuel < this.maxFuel) {
                        this.fuel += 1;
                    }
                }
                else {
                    if (this.fuel > 5) {
                        this.fuel -= 5;
                    }
                    else {
                        this.fuel = 0;
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
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
var Superhero;
(function (Superhero) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game) {
            _super.call(this, game, 'hero1', 100, 100);
            this.setBulletVelocity(1000);
        }
        Hero.prototype.update = function () {
            _super.prototype.update.call(this);
            var newState = this._state.update();
            // If the update returned a different state then
            // we must exit the previous state, start the new one and assign the new one
            if (newState !== this._state) {
                this._state.exitState();
                newState.enterState();
                this._state = newState;
            }
        };
        return Hero;
    })(Superhero.Character);
    Superhero.Hero = Hero;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
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
/// <reference path="../../lib/phaser.d.ts"/>
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
var Superhero;
(function (Superhero) {
    var Config = (function () {
        function Config() {
            this.world = {
                width: 1200,
                height: 550,
                sprite_scaling: 0.5
            };
            this.physics = {
                global: {
                    gravity: { x: 0, y: 100 }
                },
                player: {
                    gravity: { x: 0, y: 1750 },
                    drag: 1500
                },
                npc: {
                    gravity: { x: 0, y: 1500 },
                    drag: 1500
                }
            };
        }
        return Config;
    })();
    Superhero.Config = Config;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/Badie.ts"/>
/// <reference path="../utils/Debug.ts"/>
/// <reference path="../utils/Config.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>
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
            //Configure Base Stage Options
            this.setBaseStage();
            this.debug = new Superhero.Debug(this.game);
        };
        Level1.prototype.update = function () {
            this.hero.diesWithGroup(this.badie.bullets);
            this.hero.collideWithObject(this.hero.shadow);
            this.badie.collideWithObject(this.badie.shadow);
            this.badie.diesWithGroup(this.hero.bullets);
            //Updates
            this.hero.update();
            this.badie.update();
            this.ui.update();
            // this.debug.update();
        };
        Level1.prototype.configurePhysics = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = this.game.conf.physics.global.gravity.y;
        };
        Level1.prototype.setBaseStage = function () {
            this.background = this.game.add.tileSprite(0, 0, 2061, 540, 'background');
            this.background.autoScroll(-500, 0);
            this.game.gamepad = new Gamepads.GamePad(this.game, 3 /* STICK_BUTTON */, 1 /* ONE_FIXED */);
            this.game.gamepad.stick1.settings.analog = false;
            this.game.gamepad.buttonPad.button1.type = 5 /* CUSTOM */;
            this.hero = new Superhero.Hero(this.game);
            this.badie = new Superhero.Badie(this.game);
            this.ui = new Superhero.UI(this.game, this.hero);
        };
        return Level1;
    })(Phaser.State);
    Superhero.Level1 = Level1;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Level1.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
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
/// <reference path="../plugins/Gamepad.ts"/>
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
            this.game.load.image('fuelbar', '/assets/fuel.png');
            this.game.load.image('shadow', '/assets/shadow.png');
            Gamepads.GamePad.preloadAssets(this.game, '/assets');
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
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../states/Boot.ts"/>
/// <reference path="../states/Preloader.ts"/>
/// <reference path="../states/Menu.ts"/>
/// <reference path="../states/Level1.ts"/>
/// <reference path="../utils/Config.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * Main game class. Create the states of the game, inits the config object and starts the boot.
     * @class Game
     * @extends Phaser.Game
     *
     * @param {number} width - The viewport width. It originally sets the width of the world too.
     * @param {number} height - The viewport height. It originally sets the height of the world too.
     * @param {number} render - One of the Phaser render styles available [Phaser.CANVAS | Phaser.WEBGL | PHASER.AUTO]
     * @param {string} sh - The div name to the DOM object that will contain the instance of the game
     */
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            this.conf = new Superhero.Config();
            _super.call(this, this.conf.world.width, this.conf.world.height, Phaser.CANVAS, 'sh', null);
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
//# sourceMappingURL=output.js.map
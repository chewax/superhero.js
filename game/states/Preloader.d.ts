/// <reference path="../../lib/phaser.d.ts" />
/// <reference path="Menu.d.ts" />
declare module Superhero {
    class Preloader extends Phaser.State {
        preloadBar: Phaser.Sprite;
        preload(): void;
        create(): void;
        loadAssets(): void;
    }
}

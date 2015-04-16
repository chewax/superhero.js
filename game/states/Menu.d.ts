/// <reference path="../../lib/phaser.d.ts" />
/// <reference path="Level1.d.ts" />
declare module Superhero {
    class Menu extends Phaser.State {
        returnKey: Phaser.Key;
        preload(): void;
        create(): void;
        update(): void;
    }
}
